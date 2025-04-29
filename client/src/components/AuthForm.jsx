import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const AuthForm = ({ isLogin }) => {
  const initialForm = isLogin 
    ? { email: '', password: '' }
    : { name: '', email: '', password: '', role: 'student' };

  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { setUser, setIsEducator } = useAppContext();

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

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    
    const endpoint = isLogin 
      ? 'http://localhost:5000/api/auth/login'
      : 'http://localhost:5000/api/auth/register';
      
    const trimmedForm = Object.entries(form).reduce((acc, [key, value]) => {
      acc[key] = typeof value === 'string' ? value.trim() : value;
      return acc;
    }, {});
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trimmedForm)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage(isLogin ? 'Login successful!' : 'Registration successful! Please log in.');
        
        if (isLogin) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          setUser(data.user);
          setIsEducator(data.user.role === 'educator');
          
          // Redirect based on role
          if (data.user.role === 'educator') {
            navigate('/educator');
          } else {
            navigate('/');
          }
        } else {
          setTimeout(() => navigate('/login'), 1500);
        }
      } else {
        setMessage(data.message || (isLogin ? 'Login failed' : 'Registration failed'));
      }
    } catch (error) {
      setMessage('Error connecting to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{isLogin ? 'Login' : 'Register'}</h2>
      
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
        {isLogin ? 'Login' : 'Register'}
      </button>
      
      {message && (
        <div className={`mt-4 p-3 rounded ${message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
      
      <div className="mt-4 text-center text-gray-600">
        {isLogin ? (
          <>Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a></>
        ) : (
          <>Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a></>
        )}
      </div>
    </form>
  );
};

export default AuthForm;