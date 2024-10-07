const express = require('express');
const mongoose = require('mongoose');
const Ticket = require('./models/ticket');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const { authorizeAdmin } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files (HTML, CSS, etc.) from the 'public' directory
app.use(express.static('public')); // Ensure this is placed before other routes

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/ticketing', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error: ', err));

// Additional API routes (CRUD for tickets, user login, etc.)

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
