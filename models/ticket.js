const mongoose = require('mongoose');

// Define the Ticket schema
const TicketSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Title is a required string
  description: { type: String, required: true }, // Description is a required string
  status: { 
    type: String, 
    enum: ['open', 'in progress', 'closed'], // Status can be one of these values
    default: 'open' // Default status is 'open'
  },
  createdAt: { type: Date, default: Date.now } // Created at timestamp defaults to now
});

// Export the Ticket model
module.exports = mongoose.model('Ticket', TicketSchema);
