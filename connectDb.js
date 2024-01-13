const dotenv = require('dotenv');
dotenv.config();

// Import VisData schema
const { VisData } = require('./visData');

const mongoose = require('mongoose');

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB Cloud!');
}).catch(err => {
  console.error('Error connecting to MongoDB Cloud:', err.message);
});
