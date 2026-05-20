const router = require('express').Router();
const { getFeed, createPost } = require('../controllers/feedController');
const { protect, restrict } = require('../middleware/auth');

router.get('/', protect, getFeed);
router.post('/', protect, restrict('admin', 'artist'), createPost);

module.exports = router;
