import React, { useState, useEffect } from 'react';
import { getDeliveries, assignRider, getRiders } from '../api'; 
import { useAuth } from '../context/AuthContext';

function DispatcherView() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  
  const [riders, setRiders] = useState([]);
  const [selectedRider, setSelectedRider] = useState("");

  const [assignMessage, setAssignMessage] = useState(null);

  const loadData = async () => {
    try {
      // 1. Load Deliveries 
      const deliveryResponse = await getDeliveries(); 
      setDeliveries(
        Array.isArray(deliveryResponse.data) ? deliveryResponse.data : []
      );

      // 2. Load Real Riders
      const riderData = await getRiders();
      setRiders(
        Array.isArray(riderData) ? riderData : []
      );
      
    } catch (error) {
      console.log("Error loading data from API:", error);
    }
  };

  useEffect(() => {
    loadData();
    const intervalId = setInterval(loadData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // VIEW 2: The Assignment Screen
  if (selectedDelivery) {
    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h2>Assign Delivery</h2>
        <p><strong>Delivery:</strong> {selectedDelivery._id}</p>
        <p><strong>Customer:</strong> {selectedDelivery.customerName}</p>
        <hr />

        {assignMessage && (
          <div style={{
            padding: '10px 15px',
            marginBottom: '15px',
            borderRadius: '6px',
            backgroundColor: assignMessage.type === 'success' ? '#e8f5e9' : '#ffebee',
            color: assignMessage.type === 'success' ? '#2e7d32' : '#c62828',
          }}>
            {assignMessage.text}
          </div>
        )}
        
        <h3>Select Rider:</h3>
        {riders.map((rider) => (
          <div key={rider._id} style={{ marginBottom: '10px' }}>
            <label>
              <input 
                type="radio" 
                name="rider" 
                value={rider._id}
                onChange={(e) => setSelectedRider(e.target.value)}
              />
              {' '}{rider.name || rider.role}
            </label>
          </div>
        ))}

        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={async () => {
              try {
                await assignRider(selectedDelivery._id, {
                  riderId: selectedRider,
                  dispatcherId: user?.id || user?._id || process.env.REACT_APP_DISPATCHER_ID || '6a8f2824b13a4922f089478d'
                });

                setAssignMessage({ type: 'success', text: 'Rider assigned successfully!' });
                setSelectedDelivery(null);
                setSelectedRider("");
                await loadData();

              } catch (error) {
                console.log("Failed to assign rider:", error);
                setAssignMessage({
                  type: 'error',
                  text: error.response?.data?.error || 'Failed to assign rider.'
                });
              }
            }} 
            style={{ padding: '5px 10px', marginRight: '10px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}
          >
            CONFIRM ASSIGNMENT
          </button>
          <button onClick={() => setSelectedDelivery(null)} style={{ padding: '5px 10px', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // VIEW 1: The Open Deliveries List
  const openDeliveries = deliveries.filter(
    (delivery) => delivery.currentStatus === 'Pending'
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>REFLEX DISPATCHER</h1>
      <h2>Open Deliveries</h2>

      {assignMessage && (
        <div style={{
          padding: '10px 15px',
          marginBottom: '15px',
          borderRadius: '6px',
          backgroundColor: assignMessage.type === 'success' ? '#e8f5e9' : '#ffebee',
          color: assignMessage.type === 'success' ? '#2e7d32' : '#c62828',
        }}>
          {assignMessage.text}
        </div>
      )}

      <hr />

      {openDeliveries.length === 0 ? (
        <p>No open deliveries found. Waiting for a retailer to create one!</p>
      ) : (
        openDeliveries.map((delivery) => (
          <div key={delivery._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <h3>{delivery.itemDescription}</h3>
            <p>Customer: {delivery.customerName}</p>
            <p>Location: {delivery.address}</p>
            <button 
              onClick={() => {
                setAssignMessage(null);
                setSelectedDelivery(delivery);
              }}
              style={{ padding: '5px 10px', cursor: 'pointer' }}
            >
              Assign Rider
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default DispatcherView;