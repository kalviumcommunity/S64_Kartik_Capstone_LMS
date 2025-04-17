const mongoose = require('mongoose');

// Define the course schema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }
}, { timestamps: true });

// Create a model from the schema
module.exports = mongoose.model('Course', courseSchema);
