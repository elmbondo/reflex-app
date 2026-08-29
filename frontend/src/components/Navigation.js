import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

function Navigation() {
  const { role, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const close = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    close();
  };

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <Link to="/" className="brand-logo" onClick={close}>
          <span className="brand-logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </span>
          <span className="brand-logo-text">Reflex</span>
        </Link>

        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu" aria-expanded={isOpen}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isOpen
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>
            }
          </svg>
        </button>

        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <NavLink to="/about" className="nav-link" onClick={close}>About</NavLink>
          <NavLink to="/how-it-works" className="nav-link" onClick={close}>How It Works</NavLink>
          <NavLink to="/faqs" className="nav-link" onClick={close}>FAQs</NavLink>

          <div className="nav-divider" />

          {role ? (
            <>
              <NavLink to={`/${role.toLowerCase()}`} className="nav-link" onClick={close}>
                My Portal
              </NavLink>
              <span className="nav-role-badge">{role}</span>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <NavLink to="/login" className="btn-login" onClick={close}>Login</NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
