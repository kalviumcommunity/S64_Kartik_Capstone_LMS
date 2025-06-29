import OTP from '../models/OTP.js';
import crypto from 'crypto';
import emailService from './emailService.js';

class OTPService {
  constructor() {
    this.otpLength = 6;
    this.otpExpiryMinutes = 10;
  }

  // Generate a random OTP
  generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Validate email format
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate phone number format (basic validation)
  isValidPhone(phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  // Determine if identifier is email or phone
  getIdentifierType(identifier) {
    if (this.isValidEmail(identifier)) {
      return 'email';
    } else if (this.isValidPhone(identifier)) {
      return 'phone';
    }
    throw new Error('Invalid identifier format. Please provide a valid email or phone number.');
  }

  // Send OTP via email
  async sendEmailOTP(identifier, otp, purpose) {
    try {
      const result = await emailService.sendOTPEmail(identifier, otp, purpose);
      console.log(`📧 Email OTP sent successfully to ${identifier}`);
      return result;
    } catch (error) {
      console.error('Error sending email OTP:', error);
      throw new Error('Failed to send email OTP. Please try again.');
    }
  }

  // Send OTP via SMS (mock implementation)
  async sendSMSOTP(identifier, otp) {
    try {
      // Simulate SMS API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock SMS response
      const mockResponse = {
        success: true,
        message: `SMS OTP sent successfully to ${identifier}`,
        identifier: identifier,
        timestamp: new Date().toISOString()
      };

      // In a real implementation, you would integrate with:
      // - Twilio: https://www.twilio.com/docs/sms
      // - Fast2SMS: https://docs.fast2sms.com/

      console.log(`📱 Mock SMS OTP: ${otp} sent to ${identifier}`);
      
      return mockResponse;
    } catch (error) {
      console.error('Error sending SMS OTP:', error);
      throw new Error('Failed to send SMS OTP. Please try again.');
    }
  }

  // Send OTP (email or SMS)
  async sendOTP(identifier, otp, type, purpose) {
    try {
      if (type === 'email') {
        return await this.sendEmailOTP(identifier, otp, purpose);
      } else if (type === 'phone') {
        return await this.sendSMSOTP(identifier, otp);
      } else {
        throw new Error('Invalid OTP type');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  }

  // Create and send OTP
  async createAndSendOTP(identifier, purpose = 'registration') {
    try {
      const type = this.getIdentifierType(identifier);
      
      // Generate OTP
      const otp = this.generateOTP();
      
      // Set expiry time
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + this.otpExpiryMinutes);

      // Delete any existing unverified OTPs for this identifier
      await OTP.deleteMany({ 
        identifier, 
        isVerified: false,
        purpose 
      });

      // Create new OTP record
      const otpRecord = new OTP({
        identifier,
        otp,
        type,
        purpose,
        expiresAt
      });

      await otpRecord.save();

      // Send OTP
      const sendResult = await this.sendOTP(identifier, otp, type, purpose);

      return {
        success: true,
        message: `OTP sent successfully to ${type === 'email' ? 'email' : 'phone'}`,
        identifier,
        type,
        purpose,
        expiresAt
      };
    } catch (error) {
      console.error('Error creating OTP:', error);
      throw error;
    }
  }

  // Verify OTP
  async verifyOTP(identifier, otp, purpose = 'registration') {
    try {
      // Find the OTP record
      const otpRecord = await OTP.findOne({
        identifier,
        purpose,
        isVerified: false
      });

      if (!otpRecord) {
        throw new Error('No OTP found for this identifier. Please request a new OTP.');
      }

      // Check if OTP is expired
      if (otpRecord.isExpired()) {
        throw new Error('OTP has expired. Please request a new OTP.');
      }

      // Check if max attempts exceeded
      if (otpRecord.isMaxAttemptsExceeded()) {
        throw new Error('Maximum verification attempts exceeded. Please request a new OTP.');
      }

      // Increment attempts
      await otpRecord.incrementAttempts();

      // Verify OTP
      if (otpRecord.otp !== otp) {
        throw new Error('Invalid OTP. Please try again.');
      }

      // Mark as verified
      await otpRecord.markAsVerified();

      return {
        success: true,
        message: 'OTP verified successfully',
        identifier,
        purpose
      };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  }

  // Resend OTP
  async resendOTP(identifier, purpose = 'registration') {
    try {
      // Delete existing unverified OTPs
      await OTP.deleteMany({
        identifier,
        isVerified: false,
        purpose
      });

      // Create and send new OTP
      return await this.createAndSendOTP(identifier, purpose);
    } catch (error) {
      console.error('Error resending OTP:', error);
      throw error;
    }
  }

  // Get OTP status (for debugging/demo purposes)
  async getOTPStatus(identifier, purpose = 'registration') {
    try {
      const otpRecord = await OTP.findOne({
        identifier,
        purpose
      });

      if (!otpRecord) {
        return {
          exists: false,
          message: 'No OTP found'
        };
      }

      return {
        exists: true,
        isVerified: otpRecord.isVerified,
        isExpired: otpRecord.isExpired(),
        attempts: otpRecord.attempts,
        maxAttempts: otpRecord.maxAttempts,
        expiresAt: otpRecord.expiresAt,
        createdAt: otpRecord.createdAt
      };
    } catch (error) {
      console.error('Error getting OTP status:', error);
      throw error;
    }
  }
}

export default new OTPService(); 