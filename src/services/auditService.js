const AuditLog = require('../models/AuditLog');

/**
 * Save an audit event for a ticket
 * @param {ObjectId} ticketId - the ticket this event is tied to
 * @param {string} traceId - UUID shared across all steps in a triage run
 * @param {string} actor - who performed this action ("system" | "agent" | "user")
 * @param {string} action - what happened (e.g., "TICKET_CREATED", "AGENT_CLASSIFIED")
 * @param {object} meta - additional info (JSON)
 */
async function log(ticketId, traceId, actor, action, meta = {}) {
  const event = new AuditLog({
    ticketId,
    traceId,
    actor,
    action,
    meta,
    timestamp: new Date()
  });
  await event.save();
  return event;
}

module.exports = { log };
