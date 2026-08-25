// Dispatcher View — Person 4 builds this out
// Job: show open (Pending) requests and let dispatcher assign each to a rider

import React, { useState, useEffect } from 'react';
import { getDeliveries, assignRider } from '../api';
import { socket } from '../socket';

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
    <div>
      <h2>Open Delivery Requests</h2>
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
  );
}

export default DispatcherView;
