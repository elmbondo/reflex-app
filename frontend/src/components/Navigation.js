import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

function Navigation() {
  const { role, status, logout, isAuthenticated, isPending, isRejected } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const close = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    close();
  };

  return (
    <header className="main-nav">
      <div className="nav-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={close} aria-label="Reflex Home">
          <span className="brand-logo-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </span>
          <span className="brand-logo-text">Reflex</span>
        </Link>

        {/* Desktop Nav Links: About -> How It Works -> FAQs */}
        <nav className="nav-center-links" aria-label="Primary Navigation">
          <NavLink to="/about" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={close}>
            About
          </NavLink>
          <NavLink to="/how-it-works" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={close}>
            How It Works
          </NavLink>
          <NavLink to="/faqs" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={close}>
            FAQs
          </NavLink>
        </nav>

        {/* Nav Actions */}
        <div className="nav-actions">
          {isAuthenticated && role ? (
            <div className="nav-auth-group">
              <NavLink to={`/${role.toLowerCase()}`} className="btn-portal-link" onClick={close}>
                {role} Portal
              </NavLink>
              <span className="nav-role-pill">{role}</span>
              <button className="btn-nav-logout" onClick={handleLogout} aria-label="Log out">
                Logout
              </button>
            </div>
          ) : isPending ? (
            <div className="nav-auth-group">
              <NavLink to="/pending" className="nav-role-pill status-pending" onClick={close}>
                Pending Review
              </NavLink>
              <button className="btn-nav-logout" onClick={handleLogout} aria-label="Log out">
                Logout
              </button>
            </div>
          ) : isRejected ? (
            <div className="nav-auth-group">
              <NavLink to="/pending" className="nav-role-pill status-rejected" onClick={close}>
                Declined
              </NavLink>
              <button className="btn-nav-logout" onClick={handleLogout} aria-label="Log out">
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-guest-group">
              <Link to="/register" className="btn-nav-register-link" onClick={close}>
                Register
              </Link>
              <Link to="/login" className="btn-nav-login-pill" onClick={close}>
                Login
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <nav className="mobile-nav-drawer" aria-label="Mobile Navigation">
          <NavLink to="/about" className="mobile-nav-item" onClick={close}>
            About
          </NavLink>
          <NavLink to="/how-it-works" className="mobile-nav-item" onClick={close}>
            How It Works
          </NavLink>
          <NavLink to="/faqs" className="mobile-nav-item" onClick={close}>
            FAQs
          </NavLink>

          <div className="mobile-nav-divider" />

          {isAuthenticated && role ? (
            <div className="mobile-auth-actions">
              <NavLink to={`/${role.toLowerCase()}`} className="mobile-nav-item" onClick={close}>
                {role} Portal
              </NavLink>
              <button className="btn-nav-logout mobile-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : isPending || isRejected ? (
            <div className="mobile-auth-actions">
              <NavLink to="/pending" className="mobile-nav-item" onClick={close}>
                Application Status ({status})
              </NavLink>
              <button className="btn-nav-logout mobile-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="mobile-guest-actions">
              <Link to="/register" className="mobile-nav-item" onClick={close}>
                Register Role Application
              </Link>
              <Link to="/login" className="btn-nav-login-pill mobile-login-btn" onClick={close}>
                Login to Portal
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}

export default Navigation;
