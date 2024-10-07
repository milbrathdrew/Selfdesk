const mongoose = require('mongoose'); // Import mongoose to work with MongoDB
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

// Define the User schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Username must be unique
  password: { type: String, required: true }, // Password is required
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // User role with default value 'user'
});

// Hash the password before saving to the database
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // If the password isn't modified, skip hashing
  this.password = await bcrypt.hash(this.password, 10); // Hash the password with a salt round of 10
  next(); // Proceed to the next middleware or save operation
});

// Method to compare passwords during login
UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password); // Compare the provided password with the stored hash
};

// Create and export the User model
  module.exports = mongoose.model('User', UserSchema);
