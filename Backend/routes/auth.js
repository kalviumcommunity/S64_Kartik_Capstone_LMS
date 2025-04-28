import express from 'express';
import { register, login, refreshToken } from '../controllers/authController.js';

const router = express.Router();

// POST /register - User Registration
router.post('/register', register);

// POST /login - User Login
router.post('/login', login);

// POST /refresh - Token Refresh
router.post('/refresh', refreshToken);

export default router;
