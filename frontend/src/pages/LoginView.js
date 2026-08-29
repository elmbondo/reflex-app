import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginView.css';

const roles = [
  { role: 'Retailer', path: '/retailer', icon: '🏪', desc: 'Log and track customer delivery requests' },
  { role: 'Dispatcher', path: '/dispatcher', icon: '📋', desc: 'Manage the delivery queue and assign riders' },
  { role: 'Rider', path: '/rider', icon: '🏍️', desc: 'View assigned deliveries and update statuses' },
  { role: 'Admin', path: '/admin', icon: '⚙️', desc: 'Manage users, roles, and platform settings' },
];

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
        <Link to="/" className="brand-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
          <span>Reflex</span>
        </Link>
        <h1>Access Your Portal</h1>
        <p>Select your role below to enter the appropriate dashboard.</p>
        {role && (
          <div className="login-current-role">
            Currently logged in as <strong>{role}</strong>
          </div>
        )}
      </div>

      <div className="login-roles">
        {roles.map(({ role: r, path, icon, desc }) => (
          <button
            key={r}
            className="role-card"
            onClick={() => handleLogin(r, path)}
          >
            <span className="role-card-icon">{icon}</span>
            <span className="role-card-title">{r}</span>
            <span className="role-card-desc">{desc}</span>
            <span className="role-card-arrow">→</span>
          </button>
        ))}
      </div>

      <p className="login-note">
        MVP auth simulation — full authentication with credentials is on the roadmap.
      </p>
    </div>
  );
}

export default LoginView;
