import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';

import HomePage from './pages/HomePage';
import RetailerView from './pages/RetailerView';
import DispatcherView from './pages/DispatcherView';
import RiderView from './pages/RiderView';
import LoginView from './pages/LoginView';
import RegisterView from './pages/RegisterView';
import PendingView from './pages/PendingView';
import AdminView from './pages/AdminView';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import FAQs from './pages/FAQs';
import SupportView from './pages/SupportView';

// Helper: protect portal routes by role & approval status
const ProtectedRoute = ({ children, allowedRole }) => {
  const { role, status, loading, user } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid #eae3d9', borderTopColor: '#c85a32', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }}></div>
          <p style={{ color: '#7a7067', fontSize: '0.9rem', fontWeight: 600 }}>Verifying authorization...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Pending or rejected applicants cannot access operational portals
  if (status === 'pending' || status === 'rejected') {
    return <Navigate to="/pending" replace />;
  }

  // Prevent URL-based role bypass (e.g. Retailer typing /dispatcher)
  if (role !== allowedRole) {
    return <Navigate to={`/${role.toLowerCase()}`} replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
          {/* Public marketing and informational pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/support" element={<SupportView />} />

          {/* Authentication & Application routes */}
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/signup" element={<RegisterView />} />
          <Route path="/pending" element={<PendingView />} />

          {/* Protected Role-Based Portals */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="Admin">
                <AdminView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/retailer"
            element={
              <ProtectedRoute allowedRole="Retailer">
                <RetailerView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dispatcher"
            element={
              <ProtectedRoute allowedRole="Dispatcher">
                <DispatcherView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rider"
            element={
              <ProtectedRoute allowedRole="Rider">
                <RiderView />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;