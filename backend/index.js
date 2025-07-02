const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const neighborhoodsRouter = require('./routes/neighborhoods');
const matchRouter = require('./routes/match');
const authRouter = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Debug: Print the actual value of MONGODB_URI
console.log('Loaded MONGODB_URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB successfully!');
})
.catch((err) => {
  console.error('MongoDB connection error:', err.message);
});

app.get('/', (req, res) => {
  res.send('NeighborFit API is running');
});

app.use('/api/neighborhoods', neighborhoodsRouter);
app.use('/api/match', matchRouter);
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 