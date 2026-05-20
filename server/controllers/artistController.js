const Artist = require('../models/Artist');
const User = require('../models/User');
const { evaluateBadges } = require('../utils/gamification');

// GET /api/artists
const getArtists = async (req, res) => {
  try {
    const artists = await Artist.find().sort('-followers').limit(50);
    res.json({ success: true, artists });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/artists/:id
const getArtistById = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(404).json({ success: false, message: 'Artist not found' });
    res.json({ success: true, artist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/artists  (admin only)
const createArtist = async (req, res) => {
  try {
    const artist = await Artist.create(req.body);
    res.status(201).json({ success: true, artist });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// POST /api/follow/:artistId  — toggle follow/unfollow
const toggleFollow = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.artistId);
    if (!artist) return res.status(404).json({ success: false, message: 'Artist not found' });

    const userId = req.user._id;
    const isFollowing = artist.followers.includes(userId);

    if (isFollowing) {
      // Unfollow
      artist.followers.pull(userId);
      await User.findByIdAndUpdate(userId, { $pull: { subscriptions: artist._id } });
    } else {
      // Follow
      artist.followers.push(userId);
      await User.findByIdAndUpdate(userId, { $addToSet: { subscriptions: artist._id } });
    }

    await artist.save();

    // Re-evaluate badges (Art Ambassador requires 3 follows)
    const user = await User.findById(userId);
    await evaluateBadges(user);

    res.json({ success: true, following: !isFollowing, followerCount: artist.followers.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getArtists, getArtistById, createArtist, toggleFollow };
