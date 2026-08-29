import React, { useState, useEffect } from 'react';
import { getDeliveries, assignRider, getRiders } from '../api'; 

function DispatcherView() {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  
  // NEW: Real state for our riders!
  const [riders, setRiders] = useState([]);
  const [selectedRider, setSelectedRider] = useState("");

  // Fetching BOTH deliveries and real riders when the page loads
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Load Deliveries
        const deliveryResponse = await getDeliveries(); 
        if (deliveryResponse && Array.isArray(deliveryResponse.data)) {
          setDeliveries(deliveryResponse.data);
        } else if (Array.isArray(deliveryResponse)) {
          setDeliveries(deliveryResponse);
        } else {
          setDeliveries([]); 
        }

        // 2. Load Real Riders
        const riderData = await getRiders();
        if (riderData && Array.isArray(riderData.data)) {
          setRiders(riderData.data);
        } else if (Array.isArray(riderData)) {
          setRiders(riderData);
        }
      } catch (error) {
        console.log("Error loading data from API:", error);
      }
    };

    loadData();
  }, []);

  // VIEW 2: The Assignment Screen
  if (selectedDelivery) {
    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h2>Assign Delivery</h2>
        <p><strong>Delivery:</strong> {selectedDelivery._id || selectedDelivery.id}</p>
        <p><strong>Customer:</strong> {selectedDelivery.customerName}</p>
        <hr />
        
        <h3>Select Rider:</h3>
        {/* Mapping over our REAL riders from the database! */}
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
                // THE CHEAT FIX IS HERE:
                await assignRider(selectedDelivery._id || selectedDelivery.id, {
                  riderId: selectedRider,
                  dispatcherId: selectedRider 
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
          <div key={delivery._id || delivery.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <h3>{delivery.item || delivery.itemDescription}</h3>
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

