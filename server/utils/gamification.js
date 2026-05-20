const User = require('../models/User');

const POINTS = {
  share: 10,
  buy: 50,
  verify: 100,
};

/**
 * Award loyalty points to a user and re-evaluate their badges.
 */
const awardPoints = async (userId, action) => {
  const pts = POINTS[action] || 0;
  if (pts === 0) return;

  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { loyaltyPoints: pts } },
    { new: true }
  );

  await evaluateBadges(user);
};

/**
 * Check badge conditions and assign them if not already present.
 */
const evaluateBadges = async (user) => {
  const badges = new Set(user.badges);

  // 'Collector': owns at least 1 item
  if (user.collection.length >= 1) badges.add('Collector');

  // 'Art Ambassador': follows at least 3 museums/artists
  if (user.subscriptions.length >= 3) badges.add('Art Ambassador');

  // 'Verified Collector': has a verified certificate (checked separately)
  // Triggered when a certificate is verified

  const badgeArray = Array.from(badges);
  if (badgeArray.length !== user.badges.length) {
    await User.findByIdAndUpdate(user._id, { badges: badgeArray });
  }
};

module.exports = { awardPoints, evaluateBadges, POINTS };
