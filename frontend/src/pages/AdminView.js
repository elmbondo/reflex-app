import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function AdminView() {
  const { role } = useAuth();

  if (role !== 'Admin') {
    return <Navigate to="/login" />;
  }

  return (
    <div className="admin-page" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the Admin Portal. Here you can authorize and assign roles.</p>
      
      <div className="admin-card" style={{ border: '1px solid #e0e0e0', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem' }}>
        <h3>Role Management (Simulation)</h3>
        <p>In a fully implemented system, you would manage user accounts and assign roles (Dispatcher, Rider, Retailer) to real identities here.</p>
        <ul>
          <li><strong>Assign Retailer:</strong> Allow a new merchant to log delivery requests.</li>
          <li><strong>Assign Dispatcher:</strong> Authorize a staff member to manage the queue.</li>
          <li><strong>Assign Rider:</strong> Register a new rider to accept jobs.</li>
        </ul>
        <button style={{ padding: '10px 15px', background: 'var(--color-terracotta, #e05e36)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Simulate Role Assignment
        </button>
      </div>
    </div>
  );
}

export default AdminView;
