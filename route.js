const express = require('express')
const router = express.Router()
const { getRestaurants, getRestaurantDetails,createReservations, registerUser, loginUser,protectedRoute } = require('./controller');

router.get('/protected', protectedRoute);
router.get('/restaurants',getRestaurants);
router.get('restaurants/:id',getRestaurantDetails);
router.post('reservations',createReservations);
router.post('/register',registerUser);
router.post('/login',loginUser);

module.export = router;