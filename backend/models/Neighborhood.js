const mongoose = require('mongoose');

const NeighborhoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  safety: { type: Number, required: true }, // 0-100
  pollution: { type: Number, required: true }, // 0-100
  cleanliness: { type: Number, required: true }, // 0-100
  greenery: { type: Number, required: true }, // 0-100
  budget: { type: Number, required: true }, // average monthly rent in rupees
  dataSources: { type: [String], default: [] },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Neighborhood', NeighborhoodSchema); 