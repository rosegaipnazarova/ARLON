const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    // User IDs who follow this artist
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // Link to a user account if the artist has one
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isMuseum: { type: Boolean, default: false },
    website: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Artist', artistSchema);
