import React, { useState, useEffect } from 'react';
import { getDeliveries, assignRider } from '../api'; 

function DispatcherView() {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [selectedRider, setSelectedRider] = useState("");

  const fakeRiders = [
    { id: "R-001", name: "Brian" },
    { id: "R-002", name: "David" },
    { id: "R-003", name: "Peter" }
  ];

  // Fetching the real data
  useEffect(() => {
    const loadDeliveries = async () => {
      try {
        const data = await getDeliveries(); 
        console.log("Data from api.js:", data);
        setDeliveries(data);
      } catch (error) {
        console.log("Error loading deliveries from API:", error);
      }
    };

    loadDeliveries();
  }, []);

  // VIEW 2: The Assignment Screen (This is where the button is!)
  if (selectedDelivery) {
    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h2>Assign Delivery</h2>
        <p><strong>Delivery:</strong> {selectedDelivery._id || selectedDelivery.id}</p>
        <p><strong>Customer:</strong> {selectedDelivery.customerName}</p>
        <hr />
        
        <h3>Select Rider:</h3>
        {fakeRiders.map((rider) => (
          <div key={rider.id} style={{ marginBottom: '10px' }}>
            <label>
              <input 
                type="radio" 
                name="rider" 
                value={rider.id}
                onChange={(e) => setSelectedRider(e.target.value)}
              />
              {' '}{rider.name}
            </label>
          </div>
        ))}

        <div style={{ marginTop: '20px' }}>
          {/* THE UPDATED ASYNC BUTTON*/}
          <button 
            onClick={async () => {
              try {
                await assignRider(selectedDelivery._id || selectedDelivery.id, {
                  riderId: selectedRider,
                  dispatcherId: "D-999" 
                });
                
                alert(`Success! Rider ${selectedRider} is now assigned.`);
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
            <h3>{delivery.item}</h3>
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
