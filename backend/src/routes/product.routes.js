const express = require('express');
const router = express.Router();
const { getProducts, createProduct, deleteProduct, getProductById, updateProduct } = require('../controllers/product.controller');
const upload = require('../middleware/upload.middleware');
const { protect } = require('../middleware/auth.middleware');

router.route('/')
    .get(getProducts)
    .post(protect, upload.single('image'), createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, upload.single('image'), updateProduct)
    .delete(protect, deleteProduct);

module.exports = router;
