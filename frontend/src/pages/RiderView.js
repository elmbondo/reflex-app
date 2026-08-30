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
    // Now using the real environment variable instead of the fake ID!
    await updateStatus(deliveryId, { 
      status, 
      changedBy: process.env.REACT_APP_RIDER_ID 
    });
  };

  return (
    <div>
      <h2>My Assigned Deliveries</h2>
      <ul>
        {deliveries
          .filter((d) => 
            // 1. Must be Assigned or Picked Up
            (d.currentStatus === 'Assigned' || d.currentStatus === 'Picked Up') && 
            // 2. MUST belong to this exact rider
            (d.assignedRider === process.env.REACT_APP_RIDER_ID || d.assignedRider?._id === process.env.REACT_APP_RIDER_ID)
          )
          .map((d) => (
            <li key={d._id}>
              {d.customerName} — {d.currentStatus}
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
  );
}

export default RiderView;
