const router = require('express').Router();
const { getAll, create, update, delete: deleteGallery } = require('../controllers/galleryController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', getAll);
router.post('/', auth, admin, create);
router.put('/:id', auth, admin, update);
router.delete('/:id', auth, admin, deleteGallery);

module.exports = router;
