import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';

import RetailerView from './pages/RetailerView';
import DispatcherView from './pages/DispatcherView';
import RiderView from './pages/RiderView';
import LoginView from './pages/LoginView';
import AdminView from './pages/AdminView';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import FAQs from './pages/FAQs';

// Helper component to protect routes based on role
const ProtectedRoute = ({ children, allowedRole }) => {
  const { role } = useAuth();
  
  if (!role) {
    return <Navigate to="/login" replace />;
  }
  
  if (role !== allowedRole) {
    return <Navigate to={`/${role.toLowerCase()}`} replace />;
  }
  
  return children;
};

// Home component redirecting based on login status
const Home = () => {
  const { role } = useAuth();
  if (role) return <Navigate to={`/${role.toLowerCase()}`} replace />;
  return <Navigate to="/about" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/login" element={<LoginView />} />
          
          <Route path="/admin" element={
            <ProtectedRoute allowedRole="Admin">
              <AdminView />
            </ProtectedRoute>
          } />
          <Route path="/retailer" element={
            <ProtectedRoute allowedRole="Retailer">
              <RetailerView />
            </ProtectedRoute>
          } />
          <Route path="/dispatcher" element={
            <ProtectedRoute allowedRole="Dispatcher">
              <DispatcherView />
            </ProtectedRoute>
          } />
          <Route path="/rider" element={
            <ProtectedRoute allowedRole="Rider">
              <RiderView />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
