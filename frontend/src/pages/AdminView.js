import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApplications, approveApplication, rejectApplication, getAdminStats } from '../api';
import './AdminView.css';

function AdminView() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved' | 'rejected' | 'all'
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'retailer' | 'rider' | 'dispatcher'
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [error, setError] = useState(null);

  // Fetch applications based on active filter
  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      if (activeTab !== 'all') params.status = activeTab;
      if (roleFilter !== 'all') params.role = roleFilter;

      const res = await getApplications(params);
      if (res.data) {
        setApplications(res.data);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to fetch applications from server.');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, roleFilter]);

  // Fetch platform stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await getAdminStats();
      if (res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, [fetchApplications, fetchStats]);

  // Handle Approve action
  const handleApprove = async (id, targetRole) => {
    setActionLoading(prev => ({ ...prev, [id]: 'approving' }));
    setActionMessage(null);
    try {
      const payload = targetRole ? { role: targetRole } : {};
      const res = await approveApplication(id, payload);
      setActionMessage({ type: 'success', text: res.data.message || 'Applicant approved successfully!' });
      // Refresh lists
      fetchApplications();
      fetchStats();
      if (selectedApplicant && selectedApplicant._id === id) {
        setSelectedApplicant(prev => ({ ...prev, status: 'approved' }));
      }
    } catch (err) {
      console.error('Approve failed:', err);
      setActionMessage({ type: 'error', text: err?.response?.data?.error || 'Failed to approve applicant.' });
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: null }));
    }
  };

  // Handle Reject action
  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this application?')) {
      return;
    }

    setActionLoading(prev => ({ ...prev, [id]: 'rejecting' }));
    setActionMessage(null);
    try {
      const res = await rejectApplication(id);
      setActionMessage({ type: 'success', text: res.data.message || 'Applicant rejected.' });
      // Refresh lists
      fetchApplications();
      fetchStats();
      if (selectedApplicant && selectedApplicant._id === id) {
        setSelectedApplicant(prev => ({ ...prev, status: 'rejected' }));
      }
    } catch (err) {
      console.error('Reject failed:', err);
      setActionMessage({ type: 'error', text: err?.response?.data?.error || 'Failed to reject applicant.' });
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: null }));
    }
  };

  const getRoleBadgeClass = (r) => {
    switch ((r || '').toLowerCase()) {
      case 'retailer': return 'badge-role-retailer';
      case 'rider': return 'badge-role-rider';
      case 'dispatcher': return 'badge-role-dispatcher';
      case 'admin': return 'badge-role-admin';
      default: return '';
    }
  };

  const getStatusBadgeClass = (s) => {
    switch ((s || '').toLowerCase()) {
      case 'approved': return 'badge-status-approved';
      case 'rejected': return 'badge-status-rejected';
      case 'pending':
      default: return 'badge-status-pending';
    }
  };

  return (
    <div className="admin-portal-page">
        <div style={{ marginBottom: '14px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--color-terracotta, #c85a32)', fontWeight: 600, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Back to Home</span>
          </Link>
        </div>

        <header className="admin-header">
          <div className="admin-header-title-group">
            <div className="admin-badge">
              <span className="badge-dot"></span>
              Reflex Central Administration
            </div>
            <h1>Role Approval & Verification Desk</h1>
            <p className="admin-subtitle">
              Review applicant details, verify retailer and rider operational credentials, and authorize platform access.
            </p>
          </div>

          <div className="admin-user-tag">
            <span>Signed in as Administrator:</span>
            <strong>{user?.name || 'Reflex Admin'}</strong>
          </div>
        </header>

        {/* Global Statistics Cards */}
        {stats && (
          <div className="admin-stats-grid">
            <div
              className={`stat-card ${activeTab === 'pending' ? 'active-filter' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              <div className="stat-card-top">
                <span className="stat-label">Pending Approval</span>
                <span className="stat-indicator-dot pending"></span>
              </div>
              <div className="stat-count text-amber">{stats.pendingCount}</div>
              <div className="stat-hint">Requires Administrator Action</div>
            </div>

            <div
              className={`stat-card ${activeTab === 'approved' ? 'active-filter' : ''}`}
              onClick={() => setActiveTab('approved')}
            >
              <div className="stat-card-top">
                <span className="stat-label">Approved Accounts</span>
                <span className="stat-indicator-dot approved"></span>
              </div>
              <div className="stat-count text-green">{stats.approvedCount}</div>
              <div className="stat-hint">Active Fleet & Merchants</div>
            </div>

            <div
              className={`stat-card ${activeTab === 'rejected' ? 'active-filter' : ''}`}
              onClick={() => setActiveTab('rejected')}
            >
              <div className="stat-card-top">
                <span className="stat-label">Declined Applications</span>
                <span className="stat-indicator-dot rejected"></span>
              </div>
              <div className="stat-count text-muted">{stats.rejectedCount}</div>
              <div className="stat-hint">Rejected Requests</div>
            </div>

            <div
              className={`stat-card ${activeTab === 'all' ? 'active-filter' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              <div className="stat-card-top">
                <span className="stat-label">Total Users</span>
                <span className="stat-indicator-dot neutral"></span>
              </div>
              <div className="stat-count text-charcoal">{stats.totalUsers}</div>
              <div className="stat-hint">All Database Accounts</div>
            </div>
          </div>
        )}

        {/* Action Alert Message */}
        {actionMessage && (
          <div className={`action-toast ${actionMessage.type}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {actionMessage.type === 'success' ? (
                <polyline points="20 6 9 17 4 12"></polyline>
              ) : (
                <circle cx="12" cy="12" r="10"></circle>
              )}
            </svg>
            <span>{actionMessage.text}</span>
            <button
              type="button"
              className="toast-close"
              onClick={() => setActionMessage(null)}
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div className="error-banner" role="alert">
            <span>{error}</span>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="admin-controls-row">
          <div className="admin-tabs">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending ({stats?.pendingCount ?? '...'})
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
              onClick={() => setActiveTab('approved')}
            >
              Approved
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'rejected' ? 'active' : ''}`}
              onClick={() => setActiveTab('rejected')}
            >
              Rejected
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Records
            </button>
          </div>

          <div className="admin-filter-group">
            <label htmlFor="role-filter">Filter Role:</label>
            <select
              id="role-filter"
              className="admin-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="retailer">Retailers</option>
              <option value="rider">Riders</option>
              <option value="dispatcher">Dispatchers</option>
            </select>

            <button
              type="button"
              className="btn-refresh-admin"
              onClick={() => {
                fetchApplications();
                fetchStats();
              }}
              disabled={isLoading}
              title="Refresh applications list"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isLoading ? 'rotate(180deg)' : 'none', transition: 'transform 0.5s' }}>
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
              <span>{isLoading ? 'Loading...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Applications List */}
        <div className="admin-table-card">
          {isLoading ? (
            <div className="admin-loading-state">
              <div className="spinner-sm"></div>
              <span>Fetching verification applications...</span>
            </div>
          ) : applications.length === 0 ? (
            <div className="admin-empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#a0978e' }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              <h3>No Applications Found</h3>
              <p>There are currently no {activeTab !== 'all' ? activeTab : ''} applications matching your filter.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Role-Specific Details</th>
                    <th>Applied On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app._id} className={`table-row ${selectedApplicant?._id === app._id ? 'row-selected' : ''}`}>
                      {/* Applicant Name & Contacts */}
                      <td>
                        <div className="applicant-primary">
                          <strong className="applicant-name">{app.name}</strong>
                          <div className="applicant-subtext">{app.email}</div>
                          <div className="applicant-subtext">{app.phone}</div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td>
                        <span className={`role-badge ${getRoleBadgeClass(app.role)}`}>
                          {app.role}
                        </span>
                      </td>

                      {/* Approval Status Badge */}
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(app.status)}`}>
                          <span className="status-dot"></span>
                          {app.status || 'pending'}
                        </span>
                      </td>

                      {/* Role Specific Details Preview */}
                      <td>
                        <div className="details-preview">
                          {app.role === 'retailer' && app.details && (
                            <>
                              <div><strong>Shop:</strong> {app.details.shopName || '—'}</div>
                              <div><strong>Location:</strong> {app.details.shopLocation || '—'}</div>
                              <div><strong>Type:</strong> {app.details.businessType || 'General'}</div>
                            </>
                          )}

                          {app.role === 'rider' && app.details && (
                            <>
                              <div><strong>Reg:</strong> {app.details.motorcycleReg || '—'}</div>
                              <div><strong>Model:</strong> {app.details.motorcycleModel || '—'} ({app.details.motorcycleColor || 'N/A'})</div>
                              <div><strong>Base:</strong> {app.details.address || '—'}</div>
                              {app.details.chassisDetails && (
                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                  Frame: {app.details.chassisDetails}
                                </div>
                              )}
                            </>
                          )}

                          {app.role === 'dispatcher' && app.details && (
                            <>
                              <div><strong>Base Station:</strong> {app.details.address || '—'}</div>
                            </>
                          )}

                          {app.role === 'admin' && (
                            <span className="text-muted">Platform Administrator</span>
                          )}
                        </div>
                      </td>

                      {/* Created Date */}
                      <td className="text-muted text-sm">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'N/A'}
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="table-actions-cell">
                          {app.role !== 'admin' && (
                            <>
                              {app.status !== 'approved' && (
                                <button
                                  type="button"
                                  className="btn-action-approve"
                                  onClick={() => handleApprove(app._id, app.role)}
                                  disabled={actionLoading[app._id]}
                                  title={`Approve ${app.name} as ${app.role}`}
                                >
                                  {actionLoading[app._id] === 'approving' ? '...' : 'Approve'}
                                </button>
                              )}

                              {app.status !== 'rejected' && (
                                <button
                                  type="button"
                                  className="btn-action-reject"
                                  onClick={() => handleReject(app._id)}
                                  disabled={actionLoading[app._id]}
                                  title={`Reject application`}
                                >
                                  {actionLoading[app._id] === 'rejecting' ? '...' : 'Reject'}
                                </button>
                              )}

                              {app.status === 'approved' && (
                                <span className="action-tag-done">Verified</span>
                              )}
                            </>
                          )}

                          {app.role === 'admin' && (
                            <span className="action-tag-done">System</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminView;
