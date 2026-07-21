const express = require('express');
const router = express.Router();
const { register, login, getProfile, changePassword } = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
