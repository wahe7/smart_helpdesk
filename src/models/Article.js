const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  tags: [String],
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', ArticleSchema);
