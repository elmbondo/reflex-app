import React, { useState, useEffect } from 'react';
import { getDeliveries, assignRider, getRiders } from '../api'; 

function DispatcherView() {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  
  const [riders, setRiders] = useState([]);
  const [selectedRider, setSelectedRider] = useState("");

  useEffect(() => {
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

    loadData();
  }, []); // Empty dependency array means this runs once on page load

  // VIEW 2: The Assignment Screen
  if (selectedDelivery) {
    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h2>Assign Delivery</h2>
        <p><strong>Delivery:</strong> {selectedDelivery._id}</p>
        <p><strong>Customer:</strong> {selectedDelivery.customerName}</p>
        <hr />
        
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
                  dispatcherId: process.env.REACT_APP_DISPATCHER_ID
                });
                
                alert(`Success! Rider is now assigned.`);
                setSelectedDelivery(null);
                
              } catch (error) {
                console.log("Failed to assign rider:", error);
                alert("Oops! Failed to assign rider. Check the console.");
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
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>REFLEX DISPATCHER</h1>
      <h2>Open Deliveries</h2>
      <hr />

      {deliveries.length === 0 ? (
        <p>No open deliveries found. Waiting for a retailer to create one!</p>
      ) : (
        deliveries.map((delivery) => (
          <div key={delivery._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <h3>{delivery.itemDescription}</h3>
            <p>Customer: {delivery.customerName}</p>
            <p>Location: {delivery.address}</p>
            <button 
              onClick={() => setSelectedDelivery(delivery)}
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
