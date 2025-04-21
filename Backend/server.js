// server.js

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/mongodb.js';
import authRoutes from './routes/auth.js';

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Auth Routes
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
