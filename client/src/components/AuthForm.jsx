import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import GoogleAuth from './GoogleAuth';
import OTPVerification from './OTPVerification';

const AuthForm = ({ isLogin }) => {
  const initialForm = isLogin 
    ? { email: '', password: '' }
    : { name: '', email: '', password: '', role: 'student' };

  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showOTP, setShowOTP] = useState(false);
  const [otpIdentifier, setOtpIdentifier] = useState('');
  const [otpPurpose, setOtpPurpose] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setIsEducator } = useAppContext();

  // Handle token from Google OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      try {
        // Store token and user data
        localStorage.setItem('token', token);
        const user = JSON.parse(atob(token.split('.')[1]));
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setIsEducator(user.role === 'educator');
        
        // Redirect based on role
        navigate(user.role === 'educator' ? '/educator' : '/');
      } catch (error) {
        console.error('Error processing token:', error);
        setMessage('Error processing authentication');
      }
    }
  }, [location, navigate, setUser, setIsEducator]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!isLogin && !form.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const sendOTP = async (identifier, purpose) => {
    try {
      const response = await fetch('http://localhost:5000/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, purpose })
      });

      const data = await response.json();
      
      if (data.success) {
        setOtpIdentifier(identifier);
        setOtpPurpose(purpose);
        setShowOTP(true);
        setMessage(`OTP sent to ${identifier}`);
        return true;
      } else {
        setMessage(data.message || 'Failed to send OTP');
        return false;
      }
    } catch (error) {
      setMessage('Error sending OTP. Please try again.');
      return false;
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    
    const trimmedForm = Object.entries(form).reduce((acc, [key, value]) => {
      acc[key] = typeof value === 'string' ? value.trim() : value;
      return acc;
    }, {});
    
    try {
      if (isLogin) {
        // For login, first try to authenticate, then send OTP if successful
        const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(trimmedForm)
        });
        
        const loginData = await loginResponse.json();
        
        if (loginResponse.ok) {
          // Check if OTP verification is required
          if (loginData.requiresOTP) {
            // Send OTP for 2FA
            const otpSent = await sendOTP(trimmedForm.email, 'login');
            if (otpSent) {
              setMessage('Login successful! Please verify OTP to continue.');
            } else {
              // If OTP fails, still allow login (fallback)
              completeLogin(loginData);
            }
          } else {
            // No OTP required, complete login directly
            completeLogin(loginData);
          }
        } else {
          setMessage(loginData.message || 'Login failed');
        }
      } else {
        // For registration, send OTP first
        const otpSent = await sendOTP(trimmedForm.email, 'registration');
        if (!otpSent) {
          setMessage('Failed to send OTP. Please try again.');
        }
      }
    } catch (error) {
      setMessage('Error connecting to server');
    } finally {
      setIsLoading(false);
    }
  };

  const completeLogin = (loginData) => {
    localStorage.setItem('token', loginData.token);
    localStorage.setItem('user', JSON.stringify(loginData.user));
    setUser(loginData.user);
    setIsEducator(loginData.user.role === 'educator');
    
    // Redirect based on role
    if (loginData.user.role === 'educator') {
      navigate('/educator');
    } else {
      navigate('/');
    }
  };

  const handleOTPVerificationSuccess = async (otpData) => {
    if (isLogin) {
      // For login, use the complete-login endpoint after OTP verification
      const loginResponse = await fetch('http://localhost:5000/api/auth/complete-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const loginData = await loginResponse.json();
      if (loginResponse.ok) {
        completeLogin(loginData);
      } else {
        setMessage(loginData.message || 'Login failed');
      }
    } else {
      // For registration, proceed with user creation
      const trimmedForm = Object.entries(form).reduce((acc, [key, value]) => {
        acc[key] = typeof value === 'string' ? value.trim() : value;
        return acc;
      }, {});
      
      const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trimmedForm)
      });
      
      const registerData = await registerResponse.json();
      
      if (registerResponse.ok) {
        setMessage('Registration successful! Please log in.');
        setTimeout(() => {
          setShowOTP(false);
          navigate('/login');
        }, 1500);
      } else {
        setMessage(registerData.message || 'Registration failed');
      }
    }
  };

  const handleOTPVerificationFailure = (error) => {
    setMessage(`OTP verification failed: ${error}`);
  };

  const handleBackToForm = () => {
    setShowOTP(false);
    setMessage('');
  };

  // Show OTP verification screen
  if (showOTP) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">
          {isLogin ? 'Two-Factor Authentication' : 'Verify Your Email'}
        </h2>
        
        <OTPVerification
          identifier={otpIdentifier}
          purpose={otpPurpose}
          onVerificationSuccess={handleOTPVerificationSuccess}
          onVerificationFailure={handleOTPVerificationFailure}
          isLoading={isLoading}
        />
        
        <div className="mt-4 text-center">
          <button
            onClick={handleBackToForm}
            className="text-blue-600 hover:underline"
          >
            ← Back to {isLogin ? 'Login' : 'Registration'}
          </button>
        </div>
      </div>
    );
  }

  // Show regular form
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{isLogin ? 'Login' : 'Register'}</h2>
      
      <div className="mb-6">
        <GoogleAuth />
      </div>
      
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name</label>
            <input 
              name="name" 
              value={form.name || ''} 
              onChange={handleChange} 
              className={`w-full px-3 py-2 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              required 
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input 
            name="email" 
            type="email"
            value={form.email} 
            onChange={handleChange} 
            className={`w-full px-3 py-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            required 
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Password</label>
          <input 
            name="password" 
            value={form.password} 
            onChange={handleChange} 
            type="password" 
            className={`w-full px-3 py-2 border rounded-lg ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            required 
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
        
        {!isLogin && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Role</label>
            <select 
              name="role" 
              value={form.role} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="student">Student</option>
              <option value="educator">Educator</option>
            </select>
          </div>
        )}
        
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
          ) : null}
          {isLogin ? 'Login with Email' : 'Register with Email'}
        </button>
        
        {message && (
          <div className={`mt-4 p-3 rounded ${message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}
      </form>
      
      <div className="mt-4 text-center text-gray-600">
        {isLogin ? (
          <>Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a></>
        ) : (
          <>Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a></>
        )}
      </div>
    </div>
  );
};

export default AuthForm;