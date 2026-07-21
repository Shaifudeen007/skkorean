const express = require('express');
const router = express.Router();

const {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require('../controllers/category.controller');
const { protect } = require('../middleware/auth.middleware');


router.post('/', protect, createCategory);
router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.put('/:id', protect, updateCategory);
router.delete('/:id', protect, deleteCategory);


module.exports = router;
