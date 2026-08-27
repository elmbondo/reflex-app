import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RetailerView from './pages/RetailerView';
import DispatcherView from './pages/DispatcherView';
import RiderView from './pages/RiderView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/retailer" element={<RetailerView />} />
        <Route path="/dispatcher" element={<DispatcherView />} />
        <Route path="/rider" element={<RiderView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
