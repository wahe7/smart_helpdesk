const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },
  traceId: String, // same across all steps of one triage run
  actor: { type: String, enum: ['system', 'agent', 'user'] },
  action: String, // e.g. "TICKET_CREATED", "AGENT_CLASSIFIED"
  meta: Object,   // extra data (classification result, draft text, etc.)
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
