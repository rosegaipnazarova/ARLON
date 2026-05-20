const router = require('express').Router();
const { createOrder, getUserOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, restrict } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/user/:id', protect, getUserOrders);
router.put('/:id/status', protect, restrict('admin'), updateOrderStatus);

module.exports = router;
