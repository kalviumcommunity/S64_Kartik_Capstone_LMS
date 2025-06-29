import React, { useState, useEffect } from 'react';

const OTPVerification = ({ 
  identifier, 
  purpose, 
  onVerificationSuccess, 
  onVerificationFailure, 
  onResendOTP,
  isLoading = false 
}) => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [countdown, setCountdown] = useState(0);

  const API_BASE = 'http://localhost:5000/api/otp';

  const showMessage = (msg, type = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      showMessage('Please enter a 6-digit OTP', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp, purpose })
      });

      const data = await response.json();
      
      if (data.success) {
        showMessage('OTP verified successfully!', 'success');
        onVerificationSuccess(data);
      } else {
        showMessage(data.message, 'error');
        onVerificationFailure(data.message);
      }
    } catch (error) {
      showMessage('Failed to verify OTP. Please try again.', 'error');
      onVerificationFailure('Network error');
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await fetch(`${API_BASE}/resend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, purpose })
      });

      const data = await response.json();
      
      if (data.success) {
        showMessage('OTP resent successfully!', 'success');
        setCountdown(60); // 60 second cooldown
        onResendOTP && onResendOTP(data);
      } else {
        showMessage(data.message, 'error');
      }
    } catch (error) {
      showMessage('Failed to resend OTP. Please try again.', 'error');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleVerifyOTP();
    }
  };

  return (
    <div className="space-y-4">
      {/* Message Display */}
      {message && (
        <div className={`p-3 rounded ${
          messageType === 'success' ? 'bg-green-100 text-green-700' :
          messageType === 'error' ? 'bg-red-100 text-red-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {message}
        </div>
      )}

      {/* OTP Input */}
      <div>
        <label className="block text-gray-700 mb-2">
          Enter 6-digit OTP sent to {identifier}
        </label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          onKeyPress={handleKeyPress}
          placeholder="123456"
          maxLength="6"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleVerifyOTP}
          disabled={isLoading || otp.length !== 6}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
          ) : null}
          Verify OTP
        </button>

        <button
          onClick={handleResendOTP}
          disabled={isLoading || countdown > 0}
          className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
        </button>
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-600 text-center">
        <p>Check your email/SMS for the OTP code</p>
        <p className="mt-1">OTP expires in 10 minutes</p>
      </div>
    </div>
  );
};

export default OTPVerification; 