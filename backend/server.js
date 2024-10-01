const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection URL
const mongoUri = process.env.MONGO_URI;

let db;
const client = new MongoClient(mongoUri);

// Connect to MongoDB and start the server
client.connect()
  .then(() => {
    db = client.db('onboarding-flow');
    console.log('MongoDB connected');

    // Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Simple API route for testing
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Import user routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', (req, res, next) => {
  req.db = db;
  next();
}, userRoutes);

