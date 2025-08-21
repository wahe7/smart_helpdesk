const express = require('express');
const router = express.Router();
const kbCtrl = require('../controllers/kbController');
const { authenticate, authorize } = require('../middleware/auth');

// Public search
router.get('/', kbCtrl.search);

// Admin-only CRUD
router.post('/', authenticate, authorize('admin'), kbCtrl.create);
router.put('/:id', authenticate, authorize('admin'), kbCtrl.update);
router.delete('/:id', authenticate, authorize('admin'), kbCtrl.remove);

module.exports = router;
