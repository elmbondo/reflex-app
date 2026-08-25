// Retailer View — Person 1 builds this out
// Job: a form to log a new delivery request, plus a list of that retailer's past requests

import React, { useState, useEffect } from 'react';
import { createDelivery, getDeliveries } from '../api';

function RetailerView() {
  const [form, setForm] = useState({
    customerName: '', customerPhone: '', address: '', itemDescription: ''
  });
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    getDeliveries().then((res) => setDeliveries(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: replace 'RETAILER_ID_HERE' with the logged-in retailer's real ID
    await createDelivery({ ...form, retailer: 'RETAILER_ID_HERE' });
    setForm({ customerName: '', customerPhone: '', address: '', itemDescription: '' });
  };

  return (
    <div>
      <h2>Log a Delivery Request</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Customer name" value={form.customerName}
          onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
        <input placeholder="Customer phone" value={form.customerPhone}
          onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} />
        <input placeholder="Address" value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <input placeholder="Item description" value={form.itemDescription}
          onChange={(e) => setForm({ ...form, itemDescription: e.target.value })} />
        <button type="submit">Submit Request</button>
      </form>

      <h3>My Requests</h3>
      {/* TODO: filter this list to only this retailer's deliveries */}
      <ul>
        {deliveries.map((d) => (
          <li key={d._id}>{d.customerName} — {d.currentStatus}</li>
        ))}
      </ul>
    </div>
  );
}

export default RetailerView;
