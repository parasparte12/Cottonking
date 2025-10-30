import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authAPI.register(formData);
      
      // DETAILED DEBUG LOGGING
      console.log('=== REGISTRATION SUCCESS ===');
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      console.log('Response status:', response.status);
      console.log('Token:', response.data.token);
      console.log('First Name:', response.data.firstName);
      console.log('===========================');
      
      // Check if registration was successful (status 200-299)
      if (response.status >= 200 && response.status < 300) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userName', response.data.firstName);
        localStorage.setItem('userEmail', response.data.email);
        
        toast.success('Registration successful!');
        navigate('/');
        window.location.reload();
      } else {
        toast.error('Registration failed - unexpected status');
      }
    } catch (error) {
      console.error('=== REGISTRATION ERROR ===');
      console.error('Full error:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error message:', error.message);
      console.error('===========================');
      
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>🌿 Register at CottonKing</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First Name"
            required
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          />
          <input
            type="text"
            placeholder="Last Name"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            required
            value={formData.phoneNumber}
            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p>Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
};

export default Register;

