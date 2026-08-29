import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginView.css';

const roles = [
  {
    role: 'Retailer',
    path: '/retailer',
    iconType: 'retailer',
    desc: 'Log and track customer delivery requests',
  },
  {
    role: 'Dispatcher',
    path: '/dispatcher',
    iconType: 'dispatcher',
    desc: 'Manage the delivery queue and assign riders',
  },
  {
    role: 'Rider',
    path: '/rider',
    iconType: 'rider',
    desc: 'View assigned deliveries and update statuses',
  },
  {
    role: 'Admin',
    path: '/admin',
    iconType: 'admin',
    desc: 'Manage users, roles, and platform settings',
  },
];

function RoleIcon({ type }) {
  switch (type) {
    case 'retailer':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      );
    case 'dispatcher':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      );
    case 'rider':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="5.5" cy="17.5" r="3.5"></circle>
          <circle cx="18.5" cy="17.5" r="3.5"></circle>
          <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5L9 9l3-2 3 3h3"></path>
        </svg>
      );
    case 'admin':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      );
    default:
      return null;
  }
}

function LoginView() {
  const { login, role } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (selectedRole, path) => {
    login(selectedRole);
    navigate(path);
  };

  return (
    <div className="login-page">
      <div className="login-hero">
        <Link to="/" className="brand-logo" aria-label="Reflex Home">
          <span className="brand-logo-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </span>
          <span className="brand-logo-text">Reflex</span>
        </Link>
        <h1>Access Your Portal</h1>
        <p>Select your operational role below to enter your workspace.</p>
        {role && (
          <div className="login-current-role">
            Currently active as <strong>{role}</strong>
          </div>
        )}
      </div>

      <div className="login-roles">
        {roles.map(({ role: r, path, iconType, desc }) => (
          <button
            key={r}
            className="role-card"
            onClick={() => handleLogin(r, path)}
            aria-label={`Log in as ${r}`}
          >
            <div className="role-card-icon" aria-hidden="true">
              <RoleIcon type={iconType} />
            </div>
            <div className="role-card-content">
              <span className="role-card-title">{r}</span>
              <span className="role-card-desc">{desc}</span>
            </div>
            <div className="role-card-arrow" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </button>
        ))}
      </div>

      <p className="login-note">
        Reflex Delivery Coordination Platform • Built for Kenyan Merchants
      </p>
    </div>
  );
}

export default LoginView;
