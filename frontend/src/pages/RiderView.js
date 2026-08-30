// Rider View — Person 5 builds this out
// Job: show this rider's assigned deliveries, let them update status,
// and confirm final delivery via QR scan

import React, { useState, useEffect } from 'react';
import { getDeliveries, updateStatus } from '../api';
import { socket } from '../socket';

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
    await updateStatus(deliveryId, {
      status,
      changedBy: process.env.REACT_APP_RIDER_ID
    });
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
              onClick={() => handleStatusUpdate(d._id, 'Delivered')}
              style={{ ...buttonStyle, backgroundColor: '#4CAF50' }}
              // TODO: replace this button with an actual QR scan step
            >
              Scan & Confirm Delivered
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default RiderView;