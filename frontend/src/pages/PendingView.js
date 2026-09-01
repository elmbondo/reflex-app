import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './PendingView.css';

function PendingView() {
  const { user, status, role, logout, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setMessage(null);
    try {
      const updatedUser = await refreshProfile();
      if (updatedUser && updatedUser.status === 'approved') {
        const dest = `/${updatedUser.role.toLowerCase()}`;
        navigate(dest);
      } else {
        setMessage('Application is still under review. Please check back shortly.');
      }
    } catch (err) {
      setMessage('Could not refresh status. Please check your connection.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isRejected = status === 'rejected';

  return (
    <div className="pending-page">
      <div className="pending-card">
        <div className={`pending-icon-badge ${isRejected ? 'rejected' : 'pending'}`}>
          {isRejected ? (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          )}
        </div>

        <span className={`status-badge-lg ${isRejected ? 'badge-rejected' : 'badge-pending'}`}>
          {isRejected ? 'Application Rejected' : 'Account Under Review'}
        </span>

        <h1 className="pending-title">
          {isRejected ? 'Account Application Declined' : 'Welcome, ' + (user?.name || 'Applicant')}
        </h1>

        <p className="pending-desc">
          {isRejected ? (
            <>
              Your application for <strong>{role || 'your role'}</strong> access was not approved by the Reflex administration team. If you believe this is an error, please reach out to our support team.
            </>
          ) : (
            <>
              Your registration as a <strong>{role || 'Member'}</strong> is pending administrator verification. Protected portal features will unlock immediately once your application is approved.
            </>
          )}
        </p>

        {message && (
          <div className="status-notice-banner">
            {message}
          </div>
        )}

        {user && (
          <div className="applicant-details-card">
            <h3 className="details-header">Your Application Summary</h3>
            <div className="details-row">
              <span className="details-label">Full Name</span>
              <span className="details-val">{user.name}</span>
            </div>
            <div className="details-row">
              <span className="details-label">Registered Email</span>
              <span className="details-val">{user.email}</span>
            </div>
            <div className="details-row">
              <span className="details-label">Phone</span>
              <span className="details-val">{user.phone}</span>
            </div>
            <div className="details-row">
              <span className="details-label">Requested Role</span>
              <span className="details-val" style={{ textTransform: 'capitalize' }}>{user.role}</span>
            </div>
            {user.details?.shopName && (
              <div className="details-row">
                <span className="details-label">Shop Name</span>
                <span className="details-val">{user.details.shopName}</span>
              </div>
            )}
            {user.details?.motorcycleReg && (
              <div className="details-row">
                <span className="details-label">Motorcycle Reg</span>
                <span className="details-val">{user.details.motorcycleReg}</span>
              </div>
            )}
            {user.details?.address && (
              <div className="details-row">
                <span className="details-label">Base Location</span>
                <span className="details-val">{user.details.address}</span>
              </div>
            )}
          </div>
        )}

        <div className="pending-actions">
          {!isRejected && (
            <button
              type="button"
              className="btn-refresh-status"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? 'Checking Status...' : 'Check Approval Status'}
            </button>
          )}

          <button
            type="button"
            className="btn-logout"
            onClick={handleLogout}
          >
            Log Out / Switch Account
          </button>
        </div>

        <div className="pending-footer">
          <Link to="/">Back to Public Website</Link>
        </div>
      </div>
    </div>
  );
}

export default PendingView;
