const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/ticketController');
const { authenticate, authorize } = require('../middleware/auth');

// User creates ticket
router.post('/', authenticate, authorize('user'), ctrl.create);

// User views own tickets
router.get('/me', authenticate, authorize('user'), ctrl.myTickets);

// Agent/Admin view all
router.get('/', authenticate, authorize(['admin','agent']), ctrl.listAll);

// Get single ticket
router.get('/:id', authenticate, ctrl.getById);

module.exports = router;
