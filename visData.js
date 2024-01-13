//visData.js
const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  sensors: {
    temperature: Number,
    humidity: Number,
    uvIndex: Number,
  },
});

const VisDataSchema = new mongoose.Schema({
  name: String,
  latitude: Number,
  longitude: Number,
  data: [sensorSchema],
});

const VisData = mongoose.model('VisData', VisDataSchema);

module.exports = VisData;
