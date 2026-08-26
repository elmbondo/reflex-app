import React, { useState } from 'react';

// Fake Data
const fakeDeliveries = [
  { id: "DEL-001", customerName: "John Kamau", address: "Westlands", item: "Laptop", status: "OPEN" },
  { id: "DEL-002", customerName: "Mary Wanjiku", address: "Kilimani", item: "Medicine", status: "OPEN" }
];

const fakeRiders = [
  { id: "R-001", name: "Brian" },
  { id: "R-002", name: "David" },
  { id: "R-003", name: "Peter" }
];

function DispatcherView() {
  // These act as the memory for your screen
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [selectedRider, setSelectedRider] = useState("");

  // VIEW 2: The Assignment Screen
  if (selectedDelivery) {
    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h2>Assign Delivery</h2>
        <p><strong>Delivery:</strong> {selectedDelivery.id}</p>
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
          <button 
            onClick={() => {
              // This is the new alert logic!
              alert(`Successfully assigned ${selectedDelivery.id} to Rider ${selectedRider}!`);
              setSelectedDelivery(null); // Go back to the main list
            }} 
            style={{ padding: '5px 10px', marginRight: '10px', cursor: 'pointer' }}
          >
            CONFIRM ASSIGNMENT
          </button>
          <button 
            onClick={() => setSelectedDelivery(null)} 
            style={{ padding: '5px 10px', cursor: 'pointer' }}
          >
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

      {fakeDeliveries.map((delivery) => (
        <div key={delivery.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <h3>#{delivery.id} - {delivery.item}</h3>
          <p>Customer: {delivery.customerName}</p>
          <p>Location: {delivery.address}</p>
          <button 
            onClick={() => setSelectedDelivery(delivery)}
            style={{ padding: '5px 10px', cursor: 'pointer' }}
          >
            Assign Rider
          </button>
        </div>
      ))}
    </div>
  );
}

export default DispatcherView;
