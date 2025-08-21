const Ticket = require('../models/Ticket');
const AgentSuggestion = require('../models/AgentSuggestion');
const auditService = require('../services/auditService');
const { newTraceId } = require('../services/triageService');

// Agent reviews the AI suggestion
exports.review = async (req, res) => {
  const { ticketId } = req.params;
  const { finalReply } = req.body; // agent can edit the draft

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

  const suggestion = await AgentSuggestion.findOne({ ticketId });
  if (!suggestion) return res.status(404).json({ error: 'No suggestion found' });

  // update ticket with agent’s final reply
  ticket.finalReply = finalReply || suggestion.draftReply;
  ticket.status = 'resolved';
  ticket.assignedTo = req.user._id;
  await ticket.save();

  // audit log
  const traceId = newTraceId();
  await auditService.log(ticket._id, traceId, 'agent', 'AGENT_REVIEWED', {
    finalReply: ticket.finalReply
  });

  res.json({ message: 'Reply submitted and ticket resolved', ticket });
};
