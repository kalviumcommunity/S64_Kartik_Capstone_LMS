import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  identifier: { 
    type: String, 
    required: true,
    index: true 
  }, // email or phone number
  otp: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['email', 'phone'], 
    required: true 
  },
  purpose: { 
    type: String, 
    enum: ['registration', 'login', 'password_reset'], 
    default: 'registration' 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  expiresAt: { 
    type: Date, 
    required: true 
  },
  attempts: { 
    type: Number, 
    default: 0 
  },
  maxAttempts: { 
    type: Number, 
    default: 3 
  }
}, { 
  timestamps: true 
});

// Index for automatic cleanup of expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Method to check if OTP is expired
otpSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

// Method to check if max attempts exceeded
otpSchema.methods.isMaxAttemptsExceeded = function() {
  return this.attempts >= this.maxAttempts;
};

// Method to increment attempts
otpSchema.methods.incrementAttempts = function() {
  this.attempts += 1;
  return this.save();
};

// Method to mark as verified
otpSchema.methods.markAsVerified = function() {
  this.isVerified = true;
  return this.save();
};

const OTP = mongoose.model('OTP', otpSchema);
export default OTP; 