import otpService from '../services/otpService.js';

// Send OTP
export const sendOTP = async (req, res) => {
  try {
    const { identifier, purpose = 'registration' } = req.body;

    // Validate required fields
    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Identifier (email or phone) is required'
      });
    }

    // Validate purpose
    const validPurposes = ['registration', 'login', 'password_reset'];
    if (!validPurposes.includes(purpose)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid purpose. Must be one of: registration, login, password_reset'
      });
    }

    // Send OTP
    const result = await otpService.createAndSendOTP(identifier, purpose);

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        identifier: result.identifier,
        type: result.type,
        purpose: result.purpose,
        expiresAt: result.expiresAt
      }
    });

  } catch (error) {
    console.error('Error in sendOTP controller:', error);
    
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to send OTP'
    });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { identifier, otp, purpose = 'registration' } = req.body;

    // Validate required fields
    if (!identifier || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Identifier and OTP are required'
      });
    }

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: 'OTP must be a 6-digit number'
      });
    }

    // Verify OTP
    const result = await otpService.verifyOTP(identifier, otp, purpose);

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        identifier: result.identifier,
        purpose: result.purpose,
        verifiedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in verifyOTP controller:', error);
    
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to verify OTP'
    });
  }
};

// Resend OTP
export const resendOTP = async (req, res) => {
  try {
    const { identifier, purpose = 'registration' } = req.body;

    // Validate required fields
    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Identifier (email or phone) is required'
      });
    }

    // Resend OTP
    const result = await otpService.resendOTP(identifier, purpose);

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        identifier: result.identifier,
        type: result.type,
        purpose: result.purpose,
        expiresAt: result.expiresAt
      }
    });

  } catch (error) {
    console.error('Error in resendOTP controller:', error);
    
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to resend OTP'
    });
  }
};

// Get OTP status (for demo/debugging purposes)
export const getOTPStatus = async (req, res) => {
  try {
    const { identifier, purpose = 'registration' } = req.query;

    // Validate required fields
    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Identifier (email or phone) is required'
      });
    }

    // Get OTP status
    const status = await otpService.getOTPStatus(identifier, purpose);

    res.status(200).json({
      success: true,
      data: status
    });

  } catch (error) {
    console.error('Error in getOTPStatus controller:', error);
    
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to get OTP status'
    });
  }
};

// Health check for OTP service
export const otpHealthCheck = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'OTP service is healthy',
      timestamp: new Date().toISOString(),
      service: 'OTP Service',
      version: '1.0.0',
      features: [
        'Email OTP',
        'SMS OTP', 
        'OTP Verification',
        'Rate Limiting',
        'Auto Expiry'
      ]
    });
  } catch (error) {
    console.error('Error in OTP health check:', error);
    
    res.status(500).json({
      success: false,
      message: 'OTP service is not healthy',
      error: error.message
    });
  }
}; 