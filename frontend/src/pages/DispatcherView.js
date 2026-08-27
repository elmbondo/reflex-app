// Dispatcher View — Person 4 builds this out
// Job: show open (Pending) requests and let dispatcher assign each to a rider

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDeliveries, assignRider } from '../api';
import { socket } from '../socket';
import './DispatcherView.css';

function DispatcherView() {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    getDeliveries().then((res) => setDeliveries(res.data));

    // Live update when a new delivery comes in
    socket.on('delivery-created', (newDelivery) => {
      setDeliveries((prev) => [...prev, newDelivery]);
    });

    return () => socket.off('delivery-created');
  }, []);

  const handleAssign = async (deliveryId, riderId) => {
    // TODO: replace with the logged-in dispatcher's real ID
    await assignRider(deliveryId, { riderId, dispatcherId: 'DISPATCHER_ID_HERE' });
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

      {/* Coming-soon shell */}
      <main className="placeholder-main">
        <div className="placeholder-badge">
          <span className="placeholder-badge-dot" aria-hidden="true"></span>
          Dispatcher Portal — In Development
        </div>
        <h1 className="placeholder-title">Open Delivery Requests</h1>
        <p className="placeholder-lead">
          This view is being built out. The functional skeleton below is live and connected to the real backend.
        </p>

        {/* Original placeholder logic — untouched */}
        <div className="placeholder-raw-content">
          <ul>
            {deliveries.filter((d) => d.currentStatus === 'Pending').map((d) => (
              <li key={d._id}>
                {d.customerName} — {d.address}
                {/* TODO: replace with a real rider dropdown once rider list is available */}
                <button onClick={() => handleAssign(d._id, 'RIDER_ID_HERE')}>
                  Assign Rider
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default DispatcherView;

