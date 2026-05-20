const User = require('../models/User');

// GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -refreshToken')
      .populate('collection.productId', 'title images type price')
      .populate('subscriptions', 'name avatar verified');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/users/update
const updateUser = async (req, res) => {
  try {
    const { username, bio, avatar } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { username, bio, avatar },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/users/collection
const getCollection = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'collection.productId',
        select: 'title images type price artistId',
        populate: { path: 'artistId', select: 'name avatar' },
      })
      .populate('collection.certificateId', 'serialNumber qrCode isVerified');

    res.json({ success: true, collection: user.collection });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getUserById, updateUser, getCollection };
