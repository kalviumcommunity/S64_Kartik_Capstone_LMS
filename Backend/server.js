// server.js

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import rateLimit from 'express-rate-limit';
import path from 'path';
import connectDB from './configs/mongodb.js';
import './config/passport.js';  // Import passport config
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courseRoutes.js';
import enrollmentRoutes from './routes/enrollment.js';
import studentRoutes from './routes/student.js';
import llmRoutes from './routes/llmRoutes.js';
import ssrRoutes from './routes/ssrRoutes.js';
import mongoose from 'mongoose';

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting middleware - Global rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later."
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to all routes
app.use(limiter);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/llm', llmRoutes);

// SSR Routes - These render React components on the server
app.use('/api', ssrRoutes);

// Serve static files from the React build
app.use(express.static('../client/dist'));

// Catch-all handler for client-side routing
app.get('*', (req, res) => {
  // Only handle non-API routes
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.resolve(process.cwd(), '../client/dist/index.html'));
  }
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📱 SSR Demo available at http://localhost:${PORT}/api/ssr`);
  console.log(`📊 SSR Stats at http://localhost:${PORT}/api/ssr/stats`);
  console.log(`📚 SSR Course pages at http://localhost:${PORT}/api/ssr/course/1`);
});
