// Rider View — Person 5 builds this out
// Job: show this rider's assigned deliveries, let them update status,
// and confirm final delivery via QR scan

import React, { useState, useEffect } from 'react';
import { getDeliveries, updateStatus } from '../api';
import { socket } from '../socket';

function RiderView() {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    const fetchDeliveries = () => {
      getDeliveries().then((res) => setDeliveries(res.data)).catch(console.error);
    };

    fetchDeliveries(); // Initial fetch
    
    // Fallback polling for Vercel serverless (where WebSockets won't broadcast cross-client)
    const intervalId = setInterval(fetchDeliveries, 5000);

    socket.on('delivery-updated', (updated) => {
      setDeliveries((prev) =>
        prev.map((d) => (d._id === updated._id ? updated : d))
      );
    });

    return () => {
      socket.off('delivery-updated');
      clearInterval(intervalId);
    };
  }, []);

  const handleStatusUpdate = async (deliveryId, status, qrCode) => {
    try {
      // Optimistic state update so UI responds instantly
      setDeliveries((prev) =>
        prev.map((d) =>
          d._id === deliveryId ? { ...d, currentStatus: status } : d
        )
      );

      const res = await updateStatus(deliveryId, {
        status,
        changedBy: process.env.REACT_APP_RIDER_ID,
        ...(qrCode ? { qrCode } : {})
      });

      if (res?.data) {
        setDeliveries((prev) =>
          prev.map((d) => (d._id === res.data._id ? res.data : d))
        );
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      // Revert/refresh on error
      getDeliveries().then((res) => setDeliveries(res.data));
    }
  };

  const myDeliveries = deliveries.filter(
    (d) =>
      (d.currentStatus === 'Assigned' || d.currentStatus === 'Picked Up') &&
      (d.assignedRider === process.env.REACT_APP_RIDER_ID ||
        d.assignedRider?._id === process.env.REACT_APP_RIDER_ID)
  );

  const assignedDeliveries = myDeliveries.filter(
    (d) => d.currentStatus === 'Assigned'
  );
  const pickedUpDeliveries = myDeliveries.filter(
    (d) => d.currentStatus === 'Picked Up'
  );
  const deliveredDeliveries = deliveries.filter(
    (d) =>
      d.currentStatus === 'Delivered' &&
      (d.assignedRider === process.env.REACT_APP_RIDER_ID ||
        d.assignedRider?._id === process.env.REACT_APP_RIDER_ID)
  );

  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '10px',
    backgroundColor: '#fff',
  };

  const sectionTitleStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#555',
    marginTop: '20px',
    marginBottom: '10px',
    borderBottom: '2px solid #eee',
    paddingBottom: '5px',
  };

  const buttonStyle = {
    marginTop: '8px',
    padding: '6px 14px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    color: '#fff',
    fontWeight: 'bold',
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '500px' }}>
      <h1 style={{ marginBottom: '5px' }}>My Deliveries</h1>
      <p style={{ color: '#888', marginTop: 0 }}>Reflex Rider</p>

      <div style={sectionTitleStyle}>
        📦 Awaiting Pickup ({assignedDeliveries.length})
      </div>
      {assignedDeliveries.length === 0 ? (
        <p style={{ color: '#aaa' }}>Nothing waiting for pickup right now.</p>
      ) : (
        assignedDeliveries.map((d) => (
          <div key={d._id} style={cardStyle}>
            <strong>{d.customerName}</strong>
            <div style={{ color: '#777', fontSize: '14px' }}>{d.address}</div>
            <button
              onClick={() => handleStatusUpdate(d._id, 'Picked Up')}
              style={{ ...buttonStyle, backgroundColor: '#2196F3' }}
            >
              Mark Picked Up
            </button>
          </div>
        ))
      )}

      <div style={sectionTitleStyle}>
        🚴 Out for Delivery ({pickedUpDeliveries.length})
      </div>
      {pickedUpDeliveries.length === 0 ? (
        <p style={{ color: '#aaa' }}>Nothing out for delivery right now.</p>
      ) : (
        pickedUpDeliveries.map((d) => (
          <div key={d._id} style={cardStyle}>
            <strong>{d.customerName}</strong>
            <div style={{ color: '#777', fontSize: '14px' }}>{d.address}</div>
            <button
              onClick={() => handleStatusUpdate(d._id, 'Delivered', d.qrCodeValue)}
              style={{ ...buttonStyle, backgroundColor: '#4CAF50' }}
              // TODO: replace this button with an actual QR scan step
            >
              Scan & Confirm Delivered
            </button>
          </div>
        ))
      )}

      <div style={sectionTitleStyle}>
        ✅ Delivered ({deliveredDeliveries.length})
      </div>
      {deliveredDeliveries.length === 0 ? (
        <p style={{ color: '#aaa' }}>Nothing delivered yet.</p>
      ) : (
        deliveredDeliveries.map((d) => (
          <div key={d._id} style={{ ...cardStyle, opacity: 0.7 }}>
            <strong>{d.customerName}</strong>
            <div style={{ color: '#777', fontSize: '14px' }}>{d.address}</div>
            <div style={{ color: '#4CAF50', fontSize: '13px', marginTop: '4px' }}>
              ✔ Delivered
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default RiderView;