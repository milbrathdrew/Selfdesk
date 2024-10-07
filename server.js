const express = require('express'); // Import Express framework
const mongoose = require('mongoose'); // Import Mongoose for MongoDB interaction
const Ticket = require('./models/ticket'); // Import the Ticket model
const User = require('./models/user'); // Import the User model

const { authorizeAdmin } = require('./middleware/auth'); // Adjust the path if necessary

const app = express(); // Create an instance of Express
const PORT = process.env.PORT || 3000; // Set the port, default to 3000

/*
// Add this route to handle requests to the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Selfdesk System API'); // You can modify this message as needed
});
*/

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Send the index.html file for the root URL
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});


// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/ticketing', {
  useNewUrlParser: true, // Use the new URL parser
  useUnifiedTopology: true // Use the new topology engine
})
.then(() => console.log('MongoDB Connected')) // Log when connected
.catch(err => console.log('MongoDB Connection Error: ', err)); // Log connection errors

// Create a Ticket
app.post('/tickets', async (req, res) => {
  const newTicket = new Ticket({
    title: req.body.title, // Get title from the request body
    description: req.body.description // Get description from the request body
  });

  try {
    const savedTicket = await newTicket.save();
    res.status(201).json(savedTicket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all tickets
app.get('/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.find(); // Retrieve all tickets from the database
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: Fetch a single ticket by ID
app.get('/tickets/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id); // Fetch ticket by ID
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT: Update a ticket by ID
app.put('/tickets/:id', async (req, res) => {
  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, description: req.body.description, status: req.body.status },
      { new: true }
    );

    if (!updatedTicket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(updatedTicket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Delete a ticket by ID
app.delete('/tickets/:id', async (req, res) => {
  try {
    const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);
    if (!deletedTicket) return res.status(404).json({ message: 'Ticket not found' });
    res.json({ message: 'Ticket deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const jwt = require('jsonwebtoken');

// POST: Register a new user
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  const newUser = new User({ username, password });

  try {
    const savedUser = await newUser.save();
    res.status(201).json({ userId: savedUser._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST: Login user
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.use('/tickets', authenticateToken);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
