const express = require('express');
const router = express.Router();
const { getMainCategories } = require('../controllers/mainCategory.controller');

router.get('/', getMainCategories);

module.exports = router;
