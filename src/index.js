require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 8080;

(async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`🚀 API listening on ${PORT}`));
})();
