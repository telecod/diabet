const express = require('express');
const sugarController = require('../controllers/sugarController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authenticate);
router.post('/', sugarController.create);
router.put('/:id', sugarController.update);
router.delete('/:id', sugarController.delete);
router.get('/', sugarController.getUserReadings);

module.exports = router;