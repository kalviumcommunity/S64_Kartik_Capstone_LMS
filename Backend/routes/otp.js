import express from 'express';
import rateLimit from 'express-rate-limit';
import { 
  sendOTP, 
  verifyOTP, 
  resendOTP, 
  getOTPStatus, 
  otpHealthCheck 
} from '../controllers/otpController.js';

const router = express.Router();

// Rate limiting for OTP operations
const sendOTPLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // limit each IP to 3 OTP requests per 5 minutes
  message: {
    success: false,
    message: 'Too many OTP requests. Please wait 5 minutes before trying again.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const verifyOTPLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // limit each IP to 5 verification attempts per 10 minutes
  message: {
    success: false,
    message: 'Too many verification attempts. Please wait 10 minutes before trying again.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Health check endpoint
router.get('/health', otpHealthCheck);

// Send OTP endpoint
router.post('/send', sendOTPLimiter, sendOTP);

// Verify OTP endpoint
router.post('/verify', verifyOTPLimiter, verifyOTP);

// Resend OTP endpoint
router.post('/resend', sendOTPLimiter, resendOTP);

// Get OTP status endpoint (for demo/debugging)
router.get('/status', getOTPStatus);

export default router; 