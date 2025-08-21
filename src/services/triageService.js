const { v4: uuidv4 } = require('uuid');
const Ticket = require('../models/Ticket');
const Article = require('../models/Article');
const AgentSuggestion = require('../models/AgentSuggestion');
const auditService = require('./auditService');
const { classifyLLM, draftReplyLLM } = require('./llmService');

// Helpers
function newTraceId() {
  return uuidv4();
}

// --- Simple stubbed functions ---
// In real case, call an LLM API instead of keyword matching
async function classify(text) {
  let predictedCategory = 'other';
  if (/refund|charge|payment/i.test(text)) predictedCategory = 'billing';
  if (/error|bug|issue/i.test(text)) predictedCategory = 'technical';
  if (/ship|delivery|tracking/i.test(text)) predictedCategory = 'shipping';
  return { predictedCategory, confidence: 0.9 };
}

async function retrieveKB(text) {
  const regex = new RegExp(text.split(/\s+/).join('|'), 'i');
  return Article.find({ status: 'published', $or: [{ title: regex }, { body: regex }] }).limit(3);
}

async function draftReply(ticket, articles) {
  if (!articles.length) {
    return `Hi, thanks for reaching out. Our support team will review your ticket shortly.`;
  }
  return `Hi, based on your ticket, you may find these articles useful: ${articles
    .map((a) => a.title)
    .join(', ')}.`;
}

// --- Main entry point ---
async function enqueueTriage(ticketId, { traceId } = {}) {
  // run in background
  setImmediate(async () => {
    try {
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) return;
      const tid = traceId || newTraceId();

      await auditService.log(ticket._id, tid, 'system', 'AGENT_PLAN_STARTED', {});

      // Step 1: classify
      const c = await classify(ticket.description || ticket.title);
      await auditService.log(ticket._id, tid, 'system', 'AGENT_CLASSIFIED', c);

      // Step 2: retrieve KB
      const articles = await retrieveKB(ticket.description || ticket.title);
      await auditService.log(ticket._id, tid, 'system', 'KB_RETRIEVED', {
        articleIds: articles.map((a) => a._id),
      });

      // Step 3: draft reply
      const draft = await draftReplyLLM(ticket, articles);
      await auditService.log(ticket._id, tid, 'system', 'DRAFT_GENERATED', { draft });

      // Save AgentSuggestion
      const suggestion = new AgentSuggestion({
        ticketId: ticket._id,
        predictedCategory: c.predictedCategory,
        articleIds: articles.map((a) => a._id),
        draftReply: draft,
        confidence: c.confidence,
        autoClosed: false,
        modelInfo: { provider: 'stub' },
      });
      await suggestion.save();

      // Step 4: decision
      const AUTO_CLOSE = process.env.AUTO_CLOSE_ENABLED === 'true';
      const CONF_THRESH = parseFloat(process.env.CONFIDENCE_THRESHOLD || '0.78');

      if (AUTO_CLOSE && c.confidence >= CONF_THRESH) {
        ticket.status = 'resolved';
        suggestion.autoClosed = true;
        await suggestion.save();
        await auditService.log(ticket._id, tid, 'system', 'AUTO_CLOSED', { confidence: c.confidence });
      } else {
        ticket.status = 'waiting_human';
        await auditService.log(ticket._id, tid, 'system', 'ASSIGNED_TO_HUMAN', { confidence: c.confidence });
      }

      await ticket.save();

      await auditService.log(ticket._id, tid, 'system', 'AGENT_PLAN_FINISHED', {});
    } catch (err) {
      console.error('triage error', err);
    }
  });
}

module.exports = { enqueueTriage, newTraceId };
