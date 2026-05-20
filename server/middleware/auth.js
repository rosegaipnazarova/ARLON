const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes — verifies the access token from the Authorization header
 * or from an HTTP-only cookie named 'accessToken'.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Try Bearer token in header
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // 2. Fallback to HTTP-only cookie
    else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = await User.findById(decoded.id).select('-password -refreshToken');

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

/**
 * Restrict access to certain roles.
 * Usage: restrict('admin', 'artist')
 */
const restrict = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Forbidden: insufficient role' });
  }
  next();
};

module.exports = { protect, restrict };
