// routes/auth.js

import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// POST /register - User Registration
router.post('/register', register);

// POST /login - User Login
router.post('/login', login);

export default router;
