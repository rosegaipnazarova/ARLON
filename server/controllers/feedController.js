const Post = require('../models/Post');
const User = require('../models/User');

// GET /api/feed  — posts from followed artists
const getFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('subscriptions');
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const posts = await Post.find({ authorId: { $in: user.subscriptions } })
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit))
      .populate('authorId', 'name avatar verified');

    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/feed  — create a post (artist/admin)
const createPost = async (req, res) => {
  try {
    const { content, images, artistId } = req.body;
    const post = await Post.create({ authorId: artistId, content, images });
    res.status(201).json({ success: true, post });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { getFeed, createPost };
