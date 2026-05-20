const router = require('express').Router();
const { getArtists, getArtistById, createArtist, toggleFollow } = require('../controllers/artistController');
const { protect, restrict } = require('../middleware/auth');

router.get('/', getArtists);
router.get('/:id', getArtistById);
router.post('/', protect, restrict('admin'), createArtist);
router.post('/follow/:artistId', protect, toggleFollow);

module.exports = router;
