import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

const defaultWeights = {
  safety: 25,
  pollution: 25,
  cleanliness: 25,
  greenery: 25,
};

export default function MatchForm({ onMatch }) {
  const [weights, setWeights] = useState(defaultWeights);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [cities, setCities] = useState([]);
  const [maxBudget, setMaxBudget] = useState('');

  useEffect(() => {
    // Fetch unique cities from the API
    fetch(`${process.env.REACT_APP_API_URL}/api/neighborhoods`)
      .then(res => res.json())
      .then(neighborhoods => {
        const uniqueCities = [...new Set(neighborhoods.map(n => n.city))].sort();
        setCities(uniqueCities);
      })
      .catch(err => console.error('Error fetching cities:', err));
  }, []);

  const handleChange = (name) => (e, value) => {
    setWeights((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCity) {
      alert('Please select a city first');
      return;
    }
    setLoading(true);
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...weights, city: selectedCity, maxBudget: maxBudget ? Number(maxBudget) : undefined }),
    });
    const data = await res.json();
    setLoading(false);
    onMatch(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom>Find Your Ideal Neighborhood</Typography>
      
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select City</InputLabel>
        <Select
          value={selectedCity}
          label="Select City"
          onChange={(e) => setSelectedCity(e.target.value)}
          required
        >
          <MenuItem value="">All Cities</MenuItem>
          {cities.map((city) => (
            <MenuItem key={city} value={city}>
              {city}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Max Budget (₹ per month)"
        type="number"
        value={maxBudget}
        onChange={(e) => setMaxBudget(e.target.value)}
        margin="normal"
        inputProps={{ min: 0 }}
        sx={{ mb: 3 }}
      />

      <Typography variant="h6" gutterBottom>Set Your Preferences</Typography>
      {Object.keys(weights).map((key) => (
        <Box key={key} sx={{ mb: 2 }}>
          <Typography gutterBottom>{key.charAt(0).toUpperCase() + key.slice(1)}</Typography>
          <Slider
            value={weights[key]}
            onChange={handleChange(key)}
            min={0}
            max={100}
            step={1}
            valueLabelDisplay="auto"
          />
        </Box>
      ))}
      <Button type="submit" variant="contained" disabled={loading || !selectedCity}>
        {loading ? 'Finding Matches...' : 'Find My Neighborhoods'}
      </Button>
    </Box>
  );
} 