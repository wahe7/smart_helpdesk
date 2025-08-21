const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/agentReviewController');
const { authenticate, authorize } = require('../middleware/auth');

// Only agents/admins can review
router.post('/:ticketId/review', authenticate, authorize(['agent','admin']), ctrl.review);

module.exports = router;
