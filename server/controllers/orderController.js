const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Certificate = require('../models/Certificate');
const QRCode = require('qrcode');
const { awardPoints, evaluateBadges } = require('../utils/gamification');

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { products, address, phone } = req.body;

    if (!products?.length || !address || !phone) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    let totalPrice = 0;
    const orderProducts = [];

    // Validate stock and calculate total
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ success: false, message: `Product not found: ${item.productId}` });
      if (product.remainingQuantity < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for: ${product.title}` });
      }

      orderProducts.push({
        productId: product._id,
        quantity: item.quantity,
        priceAtPurchase: product.price,
      });
      totalPrice += product.price * item.quantity;
    }

    // Decrement stock
    for (const item of products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { remainingQuantity: -item.quantity },
      });
    }

    const order = await Order.create({
      userId: req.user._id,
      products: orderProducts,
      totalPrice,
      address,
      phone,
    });

    // Award loyalty points for purchase
    await awardPoints(req.user._id, 'buy');

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/orders/user/:id
const getUserOrders = async (req, res) => {
  try {
    // Users can only see their own orders; admins can see any
    const userId = req.user.role === 'admin' ? req.params.id : req.user._id;

    const orders = await Order.find({ userId })
      .sort('-createdAt')
      .populate('products.productId', 'title images price type');

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/orders/:id/status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = status;
    await order.save();

    // When delivered → generate certificates and add to collection
    if (status === 'delivered') {
      await onOrderDelivered(order);
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Called when an order is marked as delivered.
 * Generates certificates for original products and adds items to the user's digital collection.
 */
const onOrderDelivered = async (order) => {
  const collectionItems = [];

  for (const item of order.products) {
    const product = await Product.findById(item.productId);
    if (!product) continue;

    let certificateId = null;

    // Only generate certificates for original (limited) products
    if (product.type === 'original') {
      const verifyUrl = `${process.env.CLIENT_URL}/verify/`;
      const cert = new Certificate({
        productId: product._id,
        userId: order.userId,
        orderId: order._id,
      });

      // Generate QR code pointing to the verify page
      cert.qrCode = await QRCode.toDataURL(`${verifyUrl}${cert.serialNumber}`);
      await cert.save();
      certificateId = cert._id;
    }

    collectionItems.push({ productId: item.productId, certificateId });
  }

  // Add all items to user collection
  await User.findByIdAndUpdate(order.userId, {
    $push: { collection: { $each: collectionItems } },
  });

  // Re-evaluate badges after collection update
  const user = await User.findById(order.userId);
  await evaluateBadges(user);
};

module.exports = { createOrder, getUserOrders, updateOrderStatus };
