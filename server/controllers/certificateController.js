const Certificate = require('../models/Certificate');
const User = require('../models/User');
const { awardPoints } = require('../utils/gamification');

// POST /api/certificate/verify
const verifyCertificate = async (req, res) => {
  try {
    const { serialNumber } = req.body;

    const cert = await Certificate.findOne({ serialNumber })
      .populate('productId', 'title images type artistId')
      .populate('userId', 'username avatar');

    if (!cert) {
      return res.json({ success: true, status: 'FAKE', message: 'Certificate not found in registry' });
    }

    // Award points to the verifying user (if logged in)
    if (req.user) {
      await awardPoints(req.user._id, 'verify');

      // Grant 'Verified Collector' badge
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { badges: 'Verified Collector' },
      });
    }

    res.json({
      success: true,
      status: 'VALID',
      certificate: {
        serialNumber: cert.serialNumber,
        product: cert.productId,
        owner: cert.userId,
        issuedAt: cert.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/certificate/:serialNumber  — public lookup
const getCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findOne({ serialNumber: req.params.serialNumber })
      .populate('productId', 'title images type')
      .populate('userId', 'username avatar');

    if (!cert) {
      return res.status(404).json({ success: false, status: 'FAKE' });
    }

    res.json({ success: true, status: 'VALID', certificate: cert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { verifyCertificate, getCertificate };
