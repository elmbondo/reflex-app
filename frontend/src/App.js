import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import RetailerView from './pages/RetailerView';
import DispatcherView from './pages/DispatcherView';
import RiderView from './pages/RiderView';

const navLinkStyle = ({ isActive }) => ({
  padding: '10px 20px',
  textDecoration: 'none',
  color: isActive ? '#fff' : '#333',
  backgroundColor: isActive ? '#4CAF50' : '#f1f1f1',
  borderRadius: '6px',
  marginRight: '8px',
  fontWeight: isActive ? 'bold' : 'normal',
  transition: 'background-color 0.2s',
});

function App() {
  return (
    <BrowserRouter>
      <nav
        style={{
          padding: '15px 20px',
          borderBottom: '1px solid #ddd',
          backgroundColor: '#fafafa',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Temporary role switcher for demo purposes — replace with real login/role routing later */}
        <span style={{ marginRight: '20px', fontWeight: 'bold', color: '#888' }}>
          REFLEX
        </span>
        <NavLink to="/retailer" style={navLinkStyle}>Retailer</NavLink>
        <NavLink to="/dispatcher" style={navLinkStyle}>Dispatcher</NavLink>
        <NavLink to="/rider" style={navLinkStyle}>Rider</NavLink>
      </nav>

      <Routes>
        <Route path="/retailer" element={<RetailerView />} />
        <Route path="/dispatcher" element={<DispatcherView />} />
        <Route path="/rider" element={<RiderView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;