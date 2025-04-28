const mongoose = require('mongoose');

// Define the course schema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  thumbnail: String,
  educator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['live', 'private'], default: 'live' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Create a model from the schema
module.exports = mongoose.model('Course', courseSchema);
