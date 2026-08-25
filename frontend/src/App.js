import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import RetailerView from './pages/RetailerView';
import DispatcherView from './pages/DispatcherView';
import RiderView from './pages/RiderView';

function App() {
  return (
    <BrowserRouter>
      <nav>
        {/* Temporary nav for testing — replace with real login/role routing later */}
        <Link to="/retailer">Retailer</Link> |{' '}
        <Link to="/dispatcher">Dispatcher</Link> |{' '}
        <Link to="/rider">Rider</Link>
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
