// server.js

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import connectDB from './configs/mongodb.js';
import './config/passport.js';  // Import passport config
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courseRoutes.js';
import enrollmentRoutes from './routes/enrollment.js';
import studentRoutes from './routes/student.js';
import llmRoutes from './routes/llmRoutes.js';
import mongoose from 'mongoose';

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/llm', llmRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
