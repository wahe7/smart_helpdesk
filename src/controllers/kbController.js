const Article = require('../models/Article');

// Public search (user + triage)
exports.search = async (req, res) => {
  const q = req.query.q || '';
  const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const results = await Article.find({
    status: 'published',
    $or: [{ title: regex }, { body: regex }, { tags: regex }]
  }).limit(20);
  res.json(results);
};

// Admin: create new KB article
exports.create = async (req, res) => {
  const { title, body, tags, status } = req.body;
  const article = new Article({ title, body, tags, status: status || 'draft' });
  await article.save();
  res.status(201).json(article);
};

// Admin: update KB article
exports.update = async (req, res) => {
  const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!article) return res.status(404).json({ error: 'Not found' });
  res.json(article);
};

// Admin: delete KB article
exports.remove = async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
};
