const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const routes = require('./route');
const { sequelize } = require('./database/connection');

// Load environment variables from .env file
require('dotenv').config();

// Create an Express application
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Middleware for token-based authentication
app.use((req, res, next) => {
  // Extract the token from the request header
  const token = req.headers.authorization;

  // Verify the token using the access token secret from process.env
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      // Token is invalid or expired
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Attach the decoded payload to the request object for later use
    req.user = decoded;

    // Continue to the next middleware or route handler
    next();
  });
});

// Routes
app.use('/api', routes);

// Define a default route
app.get('/hello', (req, res) => {
  res.send('Welcome to the Restaurant Booking API!');
});

// Sync Sequelize models with the database and start the server
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
