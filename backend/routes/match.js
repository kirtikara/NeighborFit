const express = require('express');
const Neighborhood = require('../models/Neighborhood');
const router = express.Router();

// POST /api/match
router.post('/', async (req, res) => {
  const { safety = 25, pollution = 25, cleanliness = 25, greenery = 25, city, maxBudget } = req.body;
  try {
    // Filter neighborhoods by city if specified
    const query = city ? { city } : {};
    let neighborhoods = await Neighborhood.find(query);
    
    if (typeof maxBudget === 'number') {
      neighborhoods = neighborhoods.filter(n => n.budget <= maxBudget);
    }
    
    if (neighborhoods.length === 0) {
      return res.status(404).json({ 
        error: city ? `No neighborhoods found in ${city}` : 'No neighborhoods found' 
      });
    }
    
    // Calculate weighted score for each neighborhood
    const total = safety + pollution + cleanliness + greenery;
    const results = neighborhoods.map(n => {
      // Higher safety, cleanliness, greenery is better; lower pollution is better
      const score = (
        (n.safety * safety) +
        ((100 - n.pollution) * pollution) +
        (n.cleanliness * cleanliness) +
        (n.greenery * greenery)
      ) / total;
      return { ...n.toObject(), score: Math.round(score) };
    });
    // Sort by score descending
    results.sort((a, b) => b.score - a.score);
    res.json(results.slice(0, 5)); // Return top 5 matches
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 