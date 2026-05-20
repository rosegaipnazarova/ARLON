const router = require('express').Router();
const { verifyCertificate, getCertificate } = require('../controllers/certificateController');
const { protect } = require('../middleware/auth');

// Public verify endpoint (optional auth for points)
router.post('/verify', protect, verifyCertificate);
router.get('/:serialNumber', getCertificate);

module.exports = router;
