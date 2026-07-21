const express = require('express');
const router = express.Router();
const { getGallery, addGalleryItem, deleteGalleryItem, updateGalleryItem } = require('../controllers/gallery.controller');
const { uploadGallery } = require('../middleware/upload.middleware');
const { protect } = require('../middleware/auth.middleware');

router.route('/')
    .get(getGallery)
    .post(protect, uploadGallery.single('image'), addGalleryItem);

router.route('/:id')
    .put(protect, uploadGallery.single('image'), updateGalleryItem)
    .delete(protect, deleteGalleryItem);

module.exports = router;
