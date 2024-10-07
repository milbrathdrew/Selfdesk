const jwt = require('jsonwebtoken'); // Import jsonwebtoken to verify tokens
const User = require('../models/user'); // Import User model

// Middleware to check if the user is an admin
const authorizeAdmin = async (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]; // Extract token from Authorization header

  if (!token) return res.sendStatus(401); // Respond with Unauthorized if no token provided

  jwt.verify(token, 'your_jwt_secret', async (err, user) => { // Verify the token using the secret
    if (err) return res.sendStatus(403); // Respond with Forbidden if token is invalid

    // Find the user in the database
    const foundUser = await User.findById(user.userId);
    if (!foundUser || foundUser.role !== 'admin') {
      return res.sendStatus(403); // If user not found or not an admin, respond with Forbidden
    }

    req.user = foundUser; // Store user info in request for later use
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = { authorizeAdmin }; // Export the middleware
