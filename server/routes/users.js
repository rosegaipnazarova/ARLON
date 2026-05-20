const router = require('express').Router();
const { getUserById, updateUser, getCollection } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/collection', protect, getCollection);
router.get('/:id', getUserById);
router.put('/update', protect, updateUser);

module.exports = router;
