const Ticket = require('../models/Ticket');
const auditService = require('../services/auditService');
const { enqueueTriage, newTraceId } = require('../services/triageService');

// Create ticket (user)
exports.create = async (req, res) => {
  const { title, description } = req.body;
  const ticket = new Ticket({
    title,
    description,
    createdBy: req.user._id,
  });
  await ticket.save();

  const traceId = newTraceId();
  await auditService.log(ticket._id, traceId, 'user', 'TICKET_CREATED', { title, description });

  // trigger AI coworker
  enqueueTriage(ticket._id, { traceId });

  res.status(201).json(ticket);
};

// List my tickets (user)
exports.myTickets = async (req, res) => {
  const tickets = await Ticket.find({ createdBy: req.user._id });
  res.json(tickets);
};

// List all tickets (admin/agent)
exports.listAll = async (req, res) => {
  const tickets = await Ticket.find().populate('createdBy', 'email name role');
  res.json(tickets);
};

// Get ticket details
exports.getById = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)
    .populate('createdBy', 'email name')
    .populate('assignedTo', 'email name role');
  if (!ticket) return res.status(404).json({ error: 'Not found' });
  res.json(ticket);
};
