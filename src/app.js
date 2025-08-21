const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

// later we’ll mount routes
app.get('/healthz', (req, res) => res.send('ok'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/kb', require('./routes/kb'));
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/agent-review', require('./routes/agentReview'));



module.exports = app;
