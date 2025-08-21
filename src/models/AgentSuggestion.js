const mongoose = require('mongoose');

const AgentSuggestionSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },
  predictedCategory: String,
  articleIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
  draftReply: String,
  confidence: Number,
  autoClosed: Boolean,
  modelInfo: Object,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AgentSuggestion', AgentSuggestionSchema);
