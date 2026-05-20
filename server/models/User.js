const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin', 'artist'], default: 'user' },
    // Artists/museums the user follows
    subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }],
    // Digital collection: owned products + their certificates
    collection: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        certificateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' },
      },
    ],
    badges: [{ type: String }], // e.g. 'Collector', 'Art Ambassador', 'Verified Collector'
    loyaltyPoints: { type: Number, default: 0 },
    // Refresh token stored server-side for rotation
    refreshToken: { type: String, select: false },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
