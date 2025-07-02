// This script will fetch and process real neighborhood data for India.
// Data sources: NCRB, OpenAQ, Swachh Survekshan, ISRO Bhuvan, etc.
// The script should normalize and save data to MongoDB.

const axios = require('axios');
const mongoose = require('mongoose');
const Neighborhood = require('../models/Neighborhood');
require('dotenv').config();

const CITIES = [
  { name: 'Connaught Place', city: 'Delhi' },
  { name: 'Bandra', city: 'Mumbai' },
  { name: 'Indiranagar', city: 'Bangalore' }
];

async function fetchPollution(city) {
  // Fetch PM2.5 value from OpenAQ for the city
  try {
    const res = await axios.get(
      `https://api.openaq.org/v2/latest?city=${encodeURIComponent(city)}&parameter=pm25&country=IN&limit=1`
    );
    const value = res.data.results[0]?.measurements[0]?.value;
    // Normalize: Assume 0 (best) to 200 (worst) for PM2.5
    if (typeof value === 'number') {
      return Math.max(0, Math.min(100, Math.round((value / 200) * 100)));
    }
    return 50; // Default if not found
  } catch (e) {
    console.log(`Error fetching pollution for ${city}:`, e.message);
    return 50; // Default if error
  }
}

async function fetchSafety(city) {
  // Placeholder: In real use, fetch from NCRB or other sources
  // For demo, assign random value
  return Math.floor(Math.random() * 41) + 60; // 60-100
}

async function fetchCleanliness(city) {
  // Placeholder: In real use, fetch from Swachh Survekshan
  // For demo, assign random value
  return Math.floor(Math.random() * 41) + 50; // 50-90
}

async function fetchGreenery(city) {
  // Placeholder: In real use, fetch from ISRO Bhuvan or NDVI
  // For demo, assign random value
  return Math.floor(Math.random() * 41) + 40; // 40-80
}

async function fetchAndProcessData() {
  console.log('Fetching and processing data...');
  for (const loc of CITIES) {
    try {
      const pollution = await fetchPollution(loc.city);
      const safety = await fetchSafety(loc.city);
      const cleanliness = await fetchCleanliness(loc.city);
      const greenery = await fetchGreenery(loc.city);
      const neighborhood = new Neighborhood({
        name: loc.name,
        city: loc.city,
        safety,
        pollution,
        cleanliness,
        greenery,
        dataSources: ['OpenAQ', 'Placeholder'],
      });
      await neighborhood.save();
      console.log(`Saved: ${loc.name}, ${loc.city}`);
    } catch (error) {
      console.error(`Error processing ${loc.name}:`, error.message);
    }
  }
}

async function main() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully!');
    await fetchAndProcessData();
    console.log('Data processing completed!');
  } catch (error) {
    console.error('Error in main:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

main(); 