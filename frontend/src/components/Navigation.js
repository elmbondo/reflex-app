import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

function Navigation() {
  const { role, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <Link to="/" className="brand-logo" onClick={() => setIsOpen(false)}>
          <span className="brand-logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </span>
          <span className="brand-logo-text">Reflex</span>
        </Link>

        {/* Hamburger for mobile */}
        <button className="mobile-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isOpen ? (
              <><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></>
            ) : (
              <><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></>
            )}
          </svg>
        </button>

        {/* Nav Links */}
        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <NavLink to="/about" className="nav-link" onClick={() => setIsOpen(false)}>About</NavLink>
          <NavLink to="/how-it-works" className="nav-link" onClick={() => setIsOpen(false)}>How It Works</NavLink>
          <NavLink to="/faqs" className="nav-link" onClick={() => setIsOpen(false)}>FAQs</NavLink>
          
          {role ? (
            <div className="nav-user-actions">
              <span className="nav-role-badge">Role: {role}</span>
              <NavLink to={`/${role.toLowerCase()}`} className="nav-link" onClick={() => setIsOpen(false)}>My Portal</NavLink>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="nav-user-actions">
              <NavLink to="/login" className="btn-login" onClick={() => setIsOpen(false)}>Login</NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
