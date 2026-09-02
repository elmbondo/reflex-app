import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getDeliveries, assignRider, getRiders } from '../api';
import { socket } from '../socket';
import { useAuth } from '../context/AuthContext';
import './DispatcherView.css';

function DispatcherView() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [riders, setRiders] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [selectedRider, setSelectedRider] = useState('');
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'in_transit' | 'delivered' | 'all'
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [message, setMessage] = useState(null);

  // Load deliveries and real riders
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Deliveries
      const deliveryRes = await getDeliveries();
      if (deliveryRes && Array.isArray(deliveryRes.data)) {
        setDeliveries(deliveryRes.data);
      } else if (Array.isArray(deliveryRes)) {
        setDeliveries(deliveryRes);
      }

      // 2. Fetch Real Approved Riders
      const riderData = await getRiders();
      if (riderData && Array.isArray(riderData.data)) {
        setRiders(riderData.data);
      } else if (Array.isArray(riderData)) {
        setRiders(riderData);
      }
    } catch (error) {
      console.error('Error loading data from API in DispatcherView:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // 5-second polling fallback
    const intervalId = setInterval(loadData, 5000);

    // Socket.io Realtime listeners
    socket.on('delivery-created', (newDelivery) => {
      setDeliveries((prev) => {
        const exists = prev.some((d) => d._id === newDelivery._id);
        if (exists) return prev;
        return [newDelivery, ...prev];
      });
    });

    socket.on('delivery-updated', (updated) => {
      setDeliveries((prev) =>
        prev.map((d) => (d._id === updated._id ? updated : d))
      );
    });

    return () => {
      socket.off('delivery-created');
      socket.off('delivery-updated');
      clearInterval(intervalId);
    };
  }, [loadData]);

  // Handle Rider Assignment
  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedDelivery || !selectedRider) {
      setMessage({ type: 'error', text: 'Please select an available rider to assign.' });
      return;
    }

    setIsAssigning(true);
    setMessage(null);

    try {
      const dispatcherId = user?.id || user?._id || process.env.REACT_APP_DISPATCHER_ID || '6a8f2824b13a4922f089478d';
      
      const response = await assignRider(selectedDelivery._id, {
        riderId: selectedRider,
        dispatcherId
      });

      const updated = response?.data;
      if (updated) {
        setDeliveries((prev) =>
          prev.map((d) => (d._id === updated._id ? updated : d))
        );
      }

      setMessage({ type: 'success', text: `Delivery successfully assigned to rider!` });
      setSelectedDelivery(null);
      setSelectedRider('');
      await loadData();
    } catch (error) {
      console.error('Failed to assign rider:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to assign rider. Please try again.'
      });
    } finally {
      setIsAssigning(false);
    }
  };

  // Status Badge Class Helper
  const getStatusBadge = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pending':
        return { cls: 'status-pending', label: 'Pending Dispatch' };
      case 'assigned':
        return { cls: 'status-assigned', label: 'Rider Assigned' };
      case 'picked up':
        return { cls: 'status-picked-up', label: 'Picked Up • Out for Delivery' };
      case 'delivered':
        return { cls: 'status-delivered', label: 'Delivered' };
      default:
        return { cls: 'status-pending', label: status || 'Pending' };
    }
  };

  // Counts for Metrics
  const pendingCount = deliveries.filter((d) => d.currentStatus === 'Pending').length;
  const inTransitCount = deliveries.filter(
    (d) => d.currentStatus === 'Assigned' || d.currentStatus === 'Picked Up'
  ).length;
  const deliveredCount = deliveries.filter((d) => d.currentStatus === 'Delivered').length;

  // Filtered Deliveries list
  const filteredDeliveries = deliveries.filter((d) => {
    if (activeTab === 'pending') return d.currentStatus === 'Pending';
    if (activeTab === 'in_transit') return d.currentStatus === 'Assigned' || d.currentStatus === 'Picked Up';
    if (activeTab === 'delivered') return d.currentStatus === 'Delivered';
    return true; // 'all'
  });

  return (
    <div className="dispatcher-page">
      <div className="dispatcher-container">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '14px' }}>
          <Link to="/" className="dispatcher-back-link">
            Back to Home
          </Link>
        </div>

        {/* Portal Header */}
        <header className="dispatcher-header">
          <div className="dispatcher-title-group">
            <div className="dispatcher-badge">
              <span className="badge-dot"></span>
              Reflex Fleet Operations • Dispatcher Hub
            </div>
            <h1>Delivery Queue &amp; Rider Assignment</h1>
            <p className="dispatcher-subtitle">
              Monitor incoming retail delivery orders, coordinate logistics, and assign verified motorcycle couriers across Nairobi in real time.
            </p>
          </div>

          <div className="dispatcher-user-card">
            <span className="dispatcher-user-label">Active Dispatcher:</span>
            <strong>{user?.name || 'Reflex Dispatch Controller'}</strong>
            <span className="dispatcher-user-loc">{user?.details?.address || 'Central Hub Stage'}</span>
          </div>
        </header>

        {/* Alert Toast */}
        {message && (
          <div className={`dispatcher-toast ${message.type}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {message.type === 'success' ? (
                <polyline points="20 6 9 17 4 12"></polyline>
              ) : (
                <circle cx="12" cy="12" r="10"></circle>
              )}
            </svg>
            <span>{message.text}</span>
            <button
              type="button"
              className="toast-close-btn"
              onClick={() => setMessage(null)}
            >
              ×
            </button>
          </div>
        )}

        {/* Operational Metrics Cards */}
        <div className="dispatcher-stats-grid">
          <div
            className={`stat-card ${activeTab === 'pending' ? 'active-stat' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            <div className="stat-card-header">
              <span className="stat-title">Unassigned Orders</span>
              <span className="stat-pulse-dot pending"></span>
            </div>
            <div className="stat-value text-amber">{pendingCount}</div>
            <div className="stat-caption">Awaiting Rider Assignment</div>
          </div>

          <div
            className={`stat-card ${activeTab === 'in_transit' ? 'active-stat' : ''}`}
            onClick={() => setActiveTab('in_transit')}
          >
            <div className="stat-card-header">
              <span className="stat-title">In Transit</span>
              <span className="stat-pulse-dot in-transit"></span>
            </div>
            <div className="stat-value text-terracotta">{inTransitCount}</div>
            <div className="stat-caption">Assigned / Picked Up</div>
          </div>

          <div
            className={`stat-card ${activeTab === 'delivered' ? 'active-stat' : ''}`}
            onClick={() => setActiveTab('delivered')}
          >
            <div className="stat-card-header">
              <span className="stat-title">Completed Today</span>
              <span className="stat-pulse-dot completed"></span>
            </div>
            <div className="stat-value text-green">{deliveredCount}</div>
            <div className="stat-caption">Confirmed Deliveries</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-title">Active Fleet</span>
              <span className="stat-pulse-dot fleet"></span>
            </div>
            <div className="stat-value text-charcoal">{riders.length}</div>
            <div className="stat-caption">Approved Delivery Couriers</div>
          </div>
        </div>

        {/* Controls & Filter Bar */}
        <div className="dispatcher-controls">
          <div className="dispatcher-tabs">
            <button
              type="button"
              className={`filter-tab ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Open Orders ({pendingCount})
            </button>
            <button
              type="button"
              className={`filter-tab ${activeTab === 'in_transit' ? 'active' : ''}`}
              onClick={() => setActiveTab('in_transit')}
            >
              In Transit ({inTransitCount})
            </button>
            <button
              type="button"
              className={`filter-tab ${activeTab === 'delivered' ? 'active' : ''}`}
              onClick={() => setActiveTab('delivered')}
            >
              Delivered ({deliveredCount})
            </button>
            <button
              type="button"
              className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Deliveries ({deliveries.length})
            </button>
          </div>

          <button
            type="button"
            className="btn-refresh-queue"
            onClick={loadData}
            disabled={isLoading}
            title="Refresh Deliveries Queue"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isLoading ? 'rotate(180deg)' : 'none', transition: 'transform 0.5s' }}>
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            <span>{isLoading ? 'Updating...' : 'Sync Live'}</span>
          </button>
        </div>

        {/* Deliveries Queue List */}
        <div className="queue-section">
          {filteredDeliveries.length === 0 ? (
            <div className="queue-empty-card">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#a0978e' }}>
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              <h3>No Deliveries in this View</h3>
              <p>
                {activeTab === 'pending'
                  ? 'All delivery requests have been assigned. Waiting for retailers to log new orders!'
                  : 'There are currently no deliveries matching the selected tab filter.'}
              </p>
            </div>
          ) : (
            <div className="deliveries-grid">
              {filteredDeliveries.map((delivery) => {
                const badge = getStatusBadge(delivery.currentStatus);
                const isPending = delivery.currentStatus === 'Pending';

                return (
                  <div key={delivery._id} className={`delivery-card ${isPending ? 'card-pending-action' : ''}`}>
                    <div className="delivery-card-top">
                      <div className="package-title-box">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-terracotta)' }}>
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        </svg>
                        <h3 className="package-item-name">{delivery.itemDescription}</h3>
                      </div>
                      <span className={`status-pill ${badge.cls}`}>
                        <span className="status-dot"></span>
                        {badge.label}
                      </span>
                    </div>

                    <div className="delivery-info-rows">
                      <div className="info-row">
                        <span className="info-label">Customer:</span>
                        <span className="info-value">
                          <strong>{delivery.customerName}</strong> • {delivery.customerPhone}
                        </span>
                      </div>

                      <div className="info-row">
                        <span className="info-label">Destination:</span>
                        <span className="info-value">{delivery.address}</span>
                      </div>

                      {delivery.retailer && (
                        <div className="info-row">
                          <span className="info-label">Merchant:</span>
                          <span className="info-value">
                            {delivery.retailer.name || 'Retailer'} ({delivery.retailer.phone || 'N/A'})
                          </span>
                        </div>
                      )}

                      {delivery.assignedRider && (
                        <div className="info-row rider-assigned-row">
                          <span className="info-label">Courier:</span>
                          <span className="info-value text-green">
                            {delivery.assignedRider.name || 'Assigned Courier'} ({delivery.assignedRider.phone || 'Active'})
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="delivery-card-footer">
                      <div className="delivery-ref">
                        <span>ID: {delivery._id ? delivery._id.slice(-6).toUpperCase() : 'N/A'}</span>
                        <span>
                          {delivery.createdAt
                            ? new Date(delivery.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : 'Live'}
                        </span>
                      </div>

                      {isPending && (
                        <button
                          type="button"
                          className="btn-open-assign"
                          onClick={() => {
                            setMessage(null);
                            setSelectedDelivery(delivery);
                            setSelectedRider(riders.length > 0 ? riders[0]._id : '');
                          }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polyline>
                          </svg>
                          <span>Assign Courier</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ASSIGNMENT MODAL */}
        {selectedDelivery && (
          <div className="assign-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="assign-modal-heading">
            <div className="assign-modal-card">
              <div className="assign-modal-header">
                <div>
                  <div className="modal-eyebrow">Fleet Dispatcher Desk</div>
                  <h2 id="assign-modal-heading" className="modal-title">Assign Courier to Delivery</h2>
                </div>
                <button
                  type="button"
                  className="btn-modal-close"
                  onClick={() => setSelectedDelivery(null)}
                  aria-label="Close modal"
                >
                  &times;
                </button>
              </div>

              {/* Order Quick Summary */}
              <div className="assign-order-summary">
                <div className="summary-item">
                  <span className="summary-label">Package</span>
                  <span className="summary-val"><strong>{selectedDelivery.itemDescription}</strong></span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Customer</span>
                  <span className="summary-val">{selectedDelivery.customerName} ({selectedDelivery.customerPhone})</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Address</span>
                  <span className="summary-val">{selectedDelivery.address}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Order Ref</span>
                  <span className="summary-val font-mono">{selectedDelivery._id}</span>
                </div>
              </div>

              {/* Available Riders List */}
              <div className="riders-selection-section">
                <label className="riders-list-heading">
                  Select Available Approved Courier ({riders.length} active):
                </label>

                {riders.length === 0 ? (
                  <div className="no-riders-warning">
                    <p>No approved riders found in database. Please register and approve a rider in Admin portal first.</p>
                  </div>
                ) : (
                  <div className="riders-picker-list">
                    {riders.map((rider) => {
                      const isSelected = selectedRider === rider._id;
                      return (
                        <div
                          key={rider._id}
                          className={`rider-option-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => setSelectedRider(rider._id)}
                        >
                          <input
                            type="radio"
                            name="selectedRiderRadio"
                            id={`rider-${rider._id}`}
                            value={rider._id}
                            checked={isSelected}
                            onChange={() => setSelectedRider(rider._id)}
                            className="rider-radio-input"
                          />
                          <div className="rider-option-info">
                            <div className="rider-option-name">
                              <strong>{rider.name}</strong>
                              <span className="rider-option-phone">{rider.phone}</span>
                            </div>
                            <div className="rider-option-details">
                              {rider.details?.motorcycleReg && (
                                <span>{rider.details.motorcycleReg} &bull; {rider.details.motorcycleModel || 'Motorcycle'}</span>
                              )}
                              {rider.details?.address && (
                                <span className="rider-option-base">Base: {rider.details.address}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="assign-modal-actions">
                <button
                  type="button"
                  className="btn-cancel-assign"
                  onClick={() => setSelectedDelivery(null)}
                  disabled={isAssigning}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn-confirm-assign"
                  onClick={handleAssign}
                  disabled={isAssigning || !selectedRider || riders.length === 0}
                >
                  {isAssigning ? (
                    <>
                      <span className="spinner-sm"></span>
                      <span>Assigning Dispatch...</span>
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Confirm &amp; Dispatch Rider</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DispatcherView;