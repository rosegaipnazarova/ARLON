const router = require('express').Router();
const { getProducts, getProductById, createProduct } = require('../controllers/productController');
const { protect, restrict } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, restrict('admin', 'artist'), createProduct);

module.exports = router;
