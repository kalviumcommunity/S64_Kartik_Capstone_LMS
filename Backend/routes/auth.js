import express from 'express';
import passport from 'passport';
import { register, login, completeLogin, refreshToken } from '../controllers/authController.js';

const router = express.Router();

// POST /register - User Registration
router.post('/register', register);

// POST /login - User Login
router.post('/login', login);

// POST /complete-login - Complete login after OTP verification
router.post('/complete-login', completeLogin);

// POST /refresh - Token Refresh
router.post('/refresh', refreshToken);

// Google OAuth Routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: false 
  }),
  (req, res) => {
    // Generate JWT token here
    const token = req.user.generateAuthToken();
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
  }
);

export default router;
