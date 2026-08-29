import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';

import HomePage from './pages/HomePage';
import RetailerView from './pages/RetailerView';
import DispatcherView from './pages/DispatcherView';
import RiderView from './pages/RiderView';
import LoginView from './pages/LoginView';
import AdminView from './pages/AdminView';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import FAQs from './pages/FAQs';

// Helper: protect portal routes by role
const ProtectedRoute = ({ children, allowedRole }) => {
  const { role } = useAuth();
  if (!role) return <Navigate to="/login" replace />;
  if (role !== allowedRole) return <Navigate to={`/${role.toLowerCase()}`} replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
          {/* Public: Home + info pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/login" element={<LoginView />} />

          {/* Protected: role portals */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRole="Admin"><AdminView /></ProtectedRoute>
          } />
          <Route path="/retailer" element={
            <ProtectedRoute allowedRole="Retailer"><RetailerView /></ProtectedRoute>
          } />
          <Route path="/dispatcher" element={
            <ProtectedRoute allowedRole="Dispatcher"><DispatcherView /></ProtectedRoute>
          } />
          <Route path="/rider" element={
            <ProtectedRoute allowedRole="Rider"><RiderView /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
