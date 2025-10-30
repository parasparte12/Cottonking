import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authAPI.login(formData);
      
      // Debug: Log the response to see the structure
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      
      // Store token and user data - FIXED based on your backend response structure
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userName', response.data.firstName);  // Changed from response.data.user.firstName
      localStorage.setItem('userEmail', response.data.email);
      
      toast.success('Login successful!');
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error response:', error.response);
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>🌿 Login to CottonKing</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
};

export default Login;

