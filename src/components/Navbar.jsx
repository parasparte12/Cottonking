import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');
  const userName = localStorage.getItem('userName') || 'User';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/');
    window.location.reload();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(''); // Clear search after submitting
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🌿 <span>CottonKing</span>
        </Link>

        <div className="navbar-menu">
          <Link to="/?category=MEN">Men</Link>
          <Link to="/?category=WOMEN">Women</Link>
          <Link to="/?category=KIDS">Kids</Link>
        </div>

        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>

        <div className="navbar-actions">
          {isLoggedIn ? (
            <>
              <span className="user-name">Hi, {userName}!</span>
              <Link to="/cart" className="nav-btn">🛒 Cart</Link>
              <button onClick={handleLogout} className="nav-btn logout">Logout</button>
            </>
          ) : (
            <Link to="/login" className="nav-btn">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

