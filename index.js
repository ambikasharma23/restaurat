// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./route'); // Assuming you have a 'routes.js' file

// Create an Express application
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Middleware for token-based authentications
app.use((req, res, next) => {
    // extract the token from the request header
    const token = req.headers.authorization;

    // verify the token
    jwt.verify(token, 'your-secret-key', (err, decoded) => {
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
app.use('/api', routes); // Assuming your API routes are prefixed with '/api'

// Define a default route
app.get('/', (req, res) => {
  res.send('Welcome to the Restaurant Booking API!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
