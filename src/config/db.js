const mongoose = require('mongoose');

module.exports = async function connectDB() {
  const uri = process.env.MONGO_URI;
  mongoose.set('strictQuery', false);
  await mongoose.connect(uri)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ Failed to connect to MongoDB', err));
};
