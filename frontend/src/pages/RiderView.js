import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getDeliveries, updateStatus } from '../api';
import { socket } from '../socket';
import { useAuth } from '../context/AuthContext';
import QrScannerModal from '../components/QrScannerModal';
import './RiderView.css';

function RiderView() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'assigned' | 'picked_up' | 'delivered'
  const [scanningDelivery, setScanningDelivery] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentRiderId = user?.id || user?._id || process.env.REACT_APP_RIDER_ID;

  // Fetch all deliveries
  const fetchDeliveries = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getDeliveries();
      if (res && res.data) {
        setDeliveries(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.error('Error fetching deliveries in RiderView:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeliveries();

    // 5-second polling fallback
    const intervalId = setInterval(fetchDeliveries, 5000);

    // Socket.io Real-time events
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
  }, [fetchDeliveries]);

  // Status transition handler
  const handleStatusUpdate = async (deliveryId, status, qrCode = null) => {
    setIsSubmitting(true);
    setActionMessage(null);

    // Optimistic UI state update
    setDeliveries((prev) =>
      prev.map((d) =>
        d._id === deliveryId ? { ...d, currentStatus: status } : d
      )
    );

    try {
      const riderId = currentRiderId || '6a8f2824b13a4922f089478e';
      const payload = {
        status,
        changedBy: riderId,
        ...(qrCode ? { qrCode } : {})
      };

      const res = await updateStatus(deliveryId, payload);
      if (res?.data) {
        setDeliveries((prev) =>
          prev.map((d) => (d._id === res.data._id ? res.data : d))
        );
      }

      setActionMessage({
        type: 'success',
        text: status === 'Delivered'
          ? 'Delivery confirmed and completed via optical QR scan!'
          : 'Package marked as Picked Up. Safe riding!'
      });

      if (scanningDelivery) {
        setScanningDelivery(null);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      setActionMessage({
        type: 'error',
        text: error.response?.data?.error || 'Status update failed. Please try again.'
      });
      // Revert/refresh on error
      fetchDeliveries();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if assigned to current logged-in rider
  const isAssignedToMe = (d) => {
    if (!currentRiderId) return true;
    return (
      d.assignedRider === currentRiderId ||
      d.assignedRider?._id === currentRiderId ||
      d.assignedRider?.id === currentRiderId
    );
  };

  const myDeliveries = deliveries.filter(isAssignedToMe);
  const assignedDeliveries = myDeliveries.filter((d) => d.currentStatus === 'Assigned');
  const pickedUpDeliveries = myDeliveries.filter((d) => d.currentStatus === 'Picked Up');
  const deliveredDeliveries = myDeliveries.filter((d) => d.currentStatus === 'Delivered');

  return (
    <div className="rider-portal-page">
      <div className="rider-portal-container">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '14px' }}>
          <Link to="/" className="rider-back-link">
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <header className="rider-header">
          <div className="rider-header-title-group">
            <div className="rider-badge">
              <span className="badge-dot"></span>
              Reflex Courier Portal • Motorcycle Fleet
            </div>
            <h1>My Assigned Deliveries</h1>
            <p className="rider-subtitle">
              Collect retail orders across Nairobi, navigate drops, and verify doorstep delivery using optical QR scanning.
            </p>
          </div>

          <div className="rider-info-card">
            <span className="rider-info-label">Active Courier:</span>
            <strong>{user?.name || 'Reflex Motorcycle Rider'}</strong>
            {user?.details?.motorcycleReg && (
              <span className="rider-bike-tag">
                {user.details.motorcycleReg} &bull; {user.details.motorcycleModel || 'Motorcycle'}
              </span>
            )}
          </div>
        </header>

        {/* Action Toast Alert */}
        {actionMessage && (
          <div className={`rider-toast ${actionMessage.type}`}>
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
              className="toast-close-btn"
              onClick={() => setActionMessage(null)}
            >
              ×
            </button>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="rider-stats-grid">
          <div
            className={`rider-stat-card ${activeTab === 'assigned' ? 'active-stat' : ''}`}
            onClick={() => setActiveTab('assigned')}
          >
            <div className="stat-card-top">
              <span className="stat-label">Awaiting Pickup</span>
              <span className="stat-dot pending"></span>
            </div>
            <div className="stat-count text-blue">{assignedDeliveries.length}</div>
            <div className="stat-hint">Collect from Retailer</div>
          </div>

          <div
            className={`rider-stat-card ${activeTab === 'picked_up' ? 'active-stat' : ''}`}
            onClick={() => setActiveTab('picked_up')}
          >
            <div className="stat-card-top">
              <span className="stat-label">Out for Delivery</span>
              <span className="stat-dot transit"></span>
            </div>
            <div className="stat-count text-terracotta">{pickedUpDeliveries.length}</div>
            <div className="stat-hint">In Transit to Customer</div>
          </div>

          <div
            className={`rider-stat-card ${activeTab === 'delivered' ? 'active-stat' : ''}`}
            onClick={() => setActiveTab('delivered')}
          >
            <div className="stat-card-top">
              <span className="stat-label">Completed Drops</span>
              <span className="stat-dot completed"></span>
            </div>
            <div className="stat-count text-green">{deliveredDeliveries.length}</div>
            <div className="stat-hint">Verified via QR Scan</div>
          </div>
        </div>

        {/* Queue Tabs */}
        <div className="rider-controls-bar">
          <div className="rider-tabs">
            <button
              type="button"
              className={`rider-tab-btn ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Active Jobs ({assignedDeliveries.length + pickedUpDeliveries.length})
            </button>
            <button
              type="button"
              className={`rider-tab-btn ${activeTab === 'assigned' ? 'active' : ''}`}
              onClick={() => setActiveTab('assigned')}
            >
              Pickups ({assignedDeliveries.length})
            </button>
            <button
              type="button"
              className={`rider-tab-btn ${activeTab === 'picked_up' ? 'active' : ''}`}
              onClick={() => setActiveTab('picked_up')}
            >
              In Transit ({pickedUpDeliveries.length})
            </button>
            <button
              type="button"
              className={`rider-tab-btn ${activeTab === 'delivered' ? 'active' : ''}`}
              onClick={() => setActiveTab('delivered')}
            >
              History ({deliveredDeliveries.length})
            </button>
          </div>

          <button
            type="button"
            className="btn-sync-rider"
            onClick={fetchDeliveries}
            disabled={isLoading}
            title="Refresh Deliveries"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isLoading ? 'rotate(180deg)' : 'none', transition: 'transform 0.5s' }}>
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            <span>{isLoading ? 'Syncing...' : 'Sync Live'}</span>
          </button>
        </div>

        {/* SECTION 1: Awaiting Pickup (Assigned) */}
        {(activeTab === 'active' || activeTab === 'assigned') && (
          <section className="rider-section-group">
            <div className="section-divider-title">
              <h2>Awaiting Merchant Pickup ({assignedDeliveries.length})</h2>
            </div>

            {assignedDeliveries.length === 0 ? (
              <div className="rider-empty-card">
                <p>No parcels currently waiting for pickup. New assignments will appear here live.</p>
              </div>
            ) : (
              <div className="rider-cards-list">
                {assignedDeliveries.map((delivery) => (
                  <div key={delivery._id} className="rider-task-card card-pickup">
                    <div className="task-card-header">
                      <div>
                        <span className="task-badge badge-blue">Ready for Pickup</span>
                        <h3 className="task-item-title">{delivery.itemDescription}</h3>
                      </div>
                      <span className="task-ref-id">ID: {delivery._id ? delivery._id.slice(-6).toUpperCase() : 'REF'}</span>
                    </div>

                    <div className="task-card-details">
                      <div className="detail-item">
                        <span className="detail-label">Customer:</span>
                        <span className="detail-val">
                          <strong>{delivery.customerName}</strong>
                          {delivery.customerPhone && (
                            <a href={`tel:${delivery.customerPhone}`} className="tel-link">
                              {delivery.customerPhone}
                            </a>
                          )}
                        </span>
                      </div>

                      <div className="detail-item">
                        <span className="detail-label">Destination:</span>
                        <span className="detail-val">{delivery.address}</span>
                      </div>

                      {delivery.retailer && (
                        <div className="detail-item">
                          <span className="detail-label">Merchant:</span>
                          <span className="detail-val">
                            {delivery.retailer.name || 'Retail Shop'} ({delivery.retailer.phone || 'Contact'})
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="task-card-actions">
                      <button
                        type="button"
                        className="btn-mark-pickup"
                        onClick={() => handleStatusUpdate(delivery._id, 'Picked Up')}
                        disabled={isSubmitting}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 21 16z"></path>
                          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        </svg>
                        <span>Mark Picked Up &amp; Start Delivery</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* SECTION 2: Out for Delivery (Picked Up) */}
        {(activeTab === 'active' || activeTab === 'picked_up') && (
          <section className="rider-section-group">
            <div className="section-divider-title">
              <h2>Out for Delivery &bull; In Transit ({pickedUpDeliveries.length})</h2>
            </div>

            {pickedUpDeliveries.length === 0 ? (
              <div className="rider-empty-card">
                <p>No parcels currently in transit. Pick up an assigned package to begin delivery.</p>
              </div>
            ) : (
              <div className="rider-cards-list">
                {pickedUpDeliveries.map((delivery) => (
                  <div key={delivery._id} className="rider-task-card card-transit">
                    <div className="task-card-header">
                      <div>
                        <span className="task-badge badge-terracotta">Out for Delivery</span>
                        <h3 className="task-item-title">{delivery.itemDescription}</h3>
                      </div>
                      <span className="task-ref-id">ID: {delivery._id ? delivery._id.slice(-6).toUpperCase() : 'REF'}</span>
                    </div>

                    <div className="task-card-details">
                      <div className="detail-item">
                        <span className="detail-label">Customer:</span>
                        <span className="detail-val">
                          <strong>{delivery.customerName}</strong>
                          {delivery.customerPhone && (
                            <a href={`tel:${delivery.customerPhone}`} className="tel-link">
                              {delivery.customerPhone}
                            </a>
                          )}
                        </span>
                      </div>

                      <div className="detail-item">
                        <span className="detail-label">Drop Destination:</span>
                        <span className="detail-val">{delivery.address}</span>
                      </div>

                      {delivery.qrCodeValue && (
                        <div className="detail-item qr-code-item">
                          <span className="detail-label">Optical Code:</span>
                          <span className="detail-val font-mono">{delivery.qrCodeValue}</span>
                        </div>
                      )}
                    </div>

                    <div className="task-card-actions">
                      <button
                        type="button"
                        className="btn-scan-deliver"
                        onClick={() => setScanningDelivery(delivery)}
                        disabled={isSubmitting}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="7" height="7"></rect>
                          <rect x="14" y="3" width="7" height="7"></rect>
                          <rect x="14" y="14" width="7" height="7"></rect>
                          <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                        <span>Scan QR &amp; Confirm Handover</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* SECTION 3: Completed / Delivered */}
        {(activeTab === 'delivered' || activeTab === 'active') && (
          <section className="rider-section-group">
            <div className="section-divider-title">
              <h2>Delivered History ({deliveredDeliveries.length})</h2>
            </div>

            {deliveredDeliveries.length === 0 ? (
              <div className="rider-empty-card">
                <p>No completed deliveries recorded yet for this shift.</p>
              </div>
            ) : (
              <div className="rider-cards-list">
                {deliveredDeliveries.map((delivery) => (
                  <div key={delivery._id} className="rider-task-card card-completed">
                    <div className="task-card-header">
                      <div>
                        <span className="task-badge badge-green">Delivered</span>
                        <h3 className="task-item-title">{delivery.itemDescription}</h3>
                      </div>
                      <span className="task-ref-id">ID: {delivery._id ? delivery._id.slice(-6).toUpperCase() : 'REF'}</span>
                    </div>

                    <div className="task-card-details">
                      <div className="detail-item">
                        <span className="detail-label">Customer:</span>
                        <span className="detail-val">{delivery.customerName} ({delivery.customerPhone})</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Address:</span>
                        <span className="detail-val">{delivery.address}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Delivered At:</span>
                        <span className="detail-val">
                          {delivery.deliveredAt
                            ? new Date(delivery.deliveredAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                            : 'Completed'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Optical QR Scanner Modal */}
        {scanningDelivery && (
          <QrScannerModal
            delivery={scanningDelivery}
            onClose={() => setScanningDelivery(null)}
            onConfirmScan={(scannedCode) => {
              handleStatusUpdate(scanningDelivery._id, 'Delivered', scannedCode);
            }}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}

export default RiderView;