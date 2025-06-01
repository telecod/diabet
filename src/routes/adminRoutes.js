const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authenticate);
router.use(isAdmin);
router.get('/readings', adminController.getAllReadings);
router.post('/user-readings', adminController.getUserReadings);
router.post('/change-user-password', adminController.changeUserPassword);

module.exports = router;