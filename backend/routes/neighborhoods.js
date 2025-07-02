const express = require('express');
const Neighborhood = require('../models/Neighborhood');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  try {
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload.isAdmin) return res.status(403).json({ error: 'Admin only' });
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Get all neighborhoods
router.get('/', async (req, res) => {
  try {
    const neighborhoods = await Neighborhood.find();
    res.json(neighborhoods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new neighborhood (admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const neighborhood = new Neighborhood(req.body);
    await neighborhood.save();
    res.status(201).json(neighborhood);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get a neighborhood by ID
router.get('/:id', async (req, res) => {
  try {
    const neighborhood = await Neighborhood.findById(req.params.id);
    if (!neighborhood) return res.status(404).json({ error: 'Not found' });
    res.json(neighborhood);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a neighborhood (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const neighborhood = await Neighborhood.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!neighborhood) return res.status(404).json({ error: 'Not found' });
    res.json(neighborhood);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a neighborhood (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const neighborhood = await Neighborhood.findByIdAndDelete(req.params.id);
    if (!neighborhood) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 