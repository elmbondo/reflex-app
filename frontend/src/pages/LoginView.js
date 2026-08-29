import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginView.css';

function LoginView() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role, path) => {
    login(role);
    navigate(path);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Reflex Portal Access</h2>
        <p>Select your role to access the appropriate dashboard (MVP Auth simulation).</p>
        <div className="role-buttons">
          <button onClick={() => handleLogin('Admin', '/admin')} className="btn-role">Admin</button>
          <button onClick={() => handleLogin('Retailer', '/retailer')} className="btn-role">Retailer</button>
          <button onClick={() => handleLogin('Dispatcher', '/dispatcher')} className="btn-role">Dispatcher</button>
          <button onClick={() => handleLogin('Rider', '/rider')} className="btn-role">Rider</button>
        </div>
      </div>
    </div>
  );
}

export default LoginView;
