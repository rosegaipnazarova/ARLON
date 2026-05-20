const Product = require('../models/Product');

// GET /api/products
const getProducts = async (req, res) => {
  try {
    const { type, category, sort = '-createdAt', limit = 20, page = 1 } = req.query;
    const filter = { isActive: true };
    if (type) filter.type = type;
    if (category) filter.category = category;

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .populate('artistId', 'name avatar verified'),
      Product.countDocuments(filter),
    ]);

    res.json({ success: true, products, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'artistId',
      'name avatar bio verified'
    );

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/products  (admin/artist only)
const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      remainingQuantity: req.body.totalQuantity,
    });
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { getProducts, getProductById, createProduct };
