// Rider View — Person 5 builds this out
// Job: show this rider's assigned deliveries, let them update status,
// and confirm final delivery via QR scan

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDeliveries, updateStatus } from '../api';
import { socket } from '../socket';
import './DispatcherView.css';

function RiderView() {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    getDeliveries().then((res) => setDeliveries(res.data));

    socket.on('delivery-updated', (updated) => {
      setDeliveries((prev) =>
        prev.map((d) => (d._id === updated._id ? updated : d))
      );
    });

    return () => socket.off('delivery-updated');
  }, []);

  const handleStatusUpdate = async (deliveryId, status) => {
    // TODO: replace with the logged-in rider's real ID
    await updateStatus(deliveryId, { status, changedBy: 'RIDER_ID_HERE' });
  };

  return (
    <div className="placeholder-page">
      {/* Nav */}
      <nav className="placeholder-nav">
        <div className="placeholder-nav-inner">
          <Link to="/" className="brand-logo" aria-label="Back to Reflex Home">
            <span className="brand-logo-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </span>
            <span className="brand-logo-text">Reflex</span>
          </Link>
          <Link to="/" className="btn-back-placeholder">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Main shell */}
      <main className="placeholder-main">
        <div className="placeholder-badge">
          <span className="placeholder-badge-dot" aria-hidden="true"></span>
          Rider Portal — In Development
        </div>
        <h1 className="placeholder-title">My Assigned Deliveries</h1>
        <p className="placeholder-lead">
          This view is being built out. The functional skeleton below is live and connected to the real backend.
        </p>

        {/* Original placeholder logic — untouched */}
        <div className="placeholder-raw-content">
          <ul>
            {deliveries
              .filter((d) => d.currentStatus === 'Assigned' || d.currentStatus === 'Picked Up')
              .map((d) => (
                <li key={d._id}>
                  <span>{d.customerName} — <strong>{d.currentStatus}</strong></span>
                  {d.currentStatus === 'Assigned' && (
                    <button onClick={() => handleStatusUpdate(d._id, 'Picked Up')}>
                      Mark Picked Up
                    </button>
                  )}
                  {d.currentStatus === 'Picked Up' && (
                    <button onClick={() => handleStatusUpdate(d._id, 'Delivered')}>
                      {/* TODO: replace this button with an actual QR scan step */}
                      Scan & Confirm Delivered
                    </button>
                  )}
                </li>
              ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default RiderView;

