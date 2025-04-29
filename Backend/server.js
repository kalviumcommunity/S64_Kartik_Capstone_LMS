// server.js

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/mongodb.js';
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/course.js';
import enrollmentRoutes from './routes/enrollment.js';

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Auth Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
