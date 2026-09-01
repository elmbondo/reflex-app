const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'retailer', 'dispatcher', 'rider'],
    required: true,
    lowercase: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    lowercase: true,
    trim: true
  },
  // Role-specific fields
  details: {
    // Retailer specific
    shopName: { type: String, trim: true },
    shopLocation: { type: String, trim: true },
    businessType: { type: String, trim: true },

    // Rider specific
    address: { type: String, trim: true },
    motorcycleReg: { type: String, trim: true },
    chassisDetails: { type: String, trim: true },
    motorcycleColor: { type: String, trim: true },
    motorcycleModel: { type: String, trim: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
