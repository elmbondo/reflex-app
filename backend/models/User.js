// User model — Person 2 (Architecture/Database) owns this file
// One collection covers all three personas, distinguished by "role"

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  role: {
    type: String,
    enum: ['retailer', 'dispatcher', 'rider'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
