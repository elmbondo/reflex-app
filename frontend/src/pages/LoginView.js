import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginView.css';

function LoginView() {
  const { login, role, isAuthenticated, user, status } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingAccount, setPendingAccount] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPendingAccount(null);

    if (!email.trim() || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);

    try {
      const loggedUser = await login(email.trim(), password);
      if (loggedUser) {
        const dest = `/${loggedUser.role.toLowerCase()}`;
        navigate(dest);
      }
    } catch (err) {
      console.error('Login failed:', err);
      const resData = err?.response?.data;
      if (err?.response?.status === 403 && (resData?.status === 'pending' || resData?.status === 'rejected')) {
        setPendingAccount(resData);
      } else {
        setError(resData?.error || 'Invalid credentials or connection failure. Please verify your email and password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
    setPendingAccount(null);
  };

  return (
    <div className="login-page">
      <div className="login-card-container">
        {/* Header */}
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
          <p>Sign in with your verified Reflex credentials to enter your role portal.</p>

          {isAuthenticated && user && (
            <div className="login-current-role">
              Currently signed in as <strong>{user.name}</strong> ({role})
              <button
                type="button"
                className="btn-enter-portal-inline"
                onClick={() => navigate(`/${user.role.toLowerCase()}`)}
              >
                Go to {role} Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Pending / Rejected Notice */}
        {pendingAccount && (
          <div className={`login-status-banner ${pendingAccount.status}`}>
            <div className="banner-icon">
              {pendingAccount.status === 'pending' ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              )}
            </div>
            <div>
              <strong>
                {pendingAccount.status === 'pending' ? 'Application Under Review' : 'Application Declined'}
              </strong>
              <p>{pendingAccount.error}</p>
              <div className="banner-actions">
                <Link to="/pending" className="banner-link">
                  View Application Details
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="error-banner" role="alert">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <div className="input-with-icon">
              <svg className="input-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <div className="input-with-icon">
              <svg className="input-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                id="login-password"
                type="password"
                className="form-input"
                placeholder="Enter your account password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-login-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-sm"></span>
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In to Portal</span>
            )}
          </button>
        </form>

        {/* Quick Admin Credential Shortcut */}
        <div className="quick-access-box">
          <div className="quick-access-header">
            <span>System Administrator Access:</span>
          </div>
          <button
            type="button"
            className="btn-quick-cred"
            onClick={() => handleDemoFill('admin@reflex.co.ke', 'Admin@Reflex2026!')}
          >
            Fill Admin Credentials (admin@reflex.co.ke)
          </button>
        </div>

        {/* Register CTA */}
        <div className="login-register-prompt">
          <span>New to Reflex?</span>
          <Link to="/register" className="btn-register-link">
            Apply for Role Registration
          </Link>
        </div>

        <p className="login-note">
          Reflex Delivery Coordination Platform • Nairobi Logistics Network
        </p>
      </div>
    </div>
  );
}

export default LoginView;
