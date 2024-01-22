const mysql = require('mysql')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'navya@2018',
    database: 'Restaurant',
});

db.connect();

// Middleware for token-based authentication
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    jwt.verify(token, 'your-secret-key', (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      req.user = decoded;
      next();
    });
};

const protectedRoute = (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
};
  
const registerUser = (req, res) => {
    const {name, email, password} = req.body;
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (er){
            console.error(err);
            return res.status(500).json({error:'Server Error'});
        }
    const query = 'INSERT INTO customers (name, email, password) VALUES (?, ?, ?)';
        db.query(query, [name, email, hashedPassword], (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
          res.json({ message: 'User registered successfully' });
        });
    });
};

const loginUser = (req, res) => {
    const { email, password } = req.body;
  
    const query = 'SELECT * FROM customers WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      const user = results[0];
  
      // Compare hashed password
      bcrypt.compare(password, user.password, (err, result) => {
        if (err || !result) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }
  
        // Generate a JWT token
        const token = jwt.sign({ userId: user.id, email: user.email }, 'your-secret-key', { expiresIn: '1h' });
  
        res.json({ token });
      });
    });
};

const getRestaurants = (req, res) => {
    const query = "SELECT * FROM restaurants";
    db.query(query, (err, results) => {
        if (err){
            console.error(err);
            return res.status(500).json({error: 'Internal Error'});
        }
        res.json(results);    
    });
};


const getRestaurantDetails = (req, res) => {

    const restaurantID = req.params.id;

    const query = "SELECT * FROM restaurants WHERE restaurant_id = ?";
    db.query(query, (err, results) => {
        if (err){
            console.error(err);
            return res.status(500).json({error: 'Internal Error'});
        }
        if (results.lenght === 0){
            return res.status(404).json({error:"Not Found"});
        }
        res.json(results[0]);    
    });
};


const createReservations = (req, res) => {
    const { restaurantId, slotId, customerName, contactNumber, bookingDate, numGuests } = req.body;
    const query = "INSERT INTO bookings (restaurant_id, slot_id, customer_name, contact_number, booking_date, num_guests) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(query, [restaurantId, slotId, customerName, contactNumber, bookingDate, numGuests], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ message: 'Reservation created successfully', bookingId: results.insertId });
      });
    };

module.exports  = { getRestaurants, getRestaurantDetails, createReservations, authenticateToken, protectedRoute, registerUser, loginUser};