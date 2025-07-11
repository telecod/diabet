const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/change-password', authenticate, authController.changePassword);
router.post('/change-email', authenticate, authController.changeEmail);
router.post('/change-login', authenticate, authController.changeLogin);

module.exports = router;