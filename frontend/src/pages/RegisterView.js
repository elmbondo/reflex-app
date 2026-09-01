import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './RegisterView.css';

const ROLES = [
  {
    id: 'retailer',
    title: 'Retailer / Merchant',
    badge: 'Send Deliveries',
    desc: 'Log customer orders, request motorcycle dispatches, and track real-time deliveries.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
    )
  },
  {
    id: 'rider',
    title: 'Delivery Rider',
    badge: 'Fulfill Deliveries',
    desc: 'Receive dispatch assignments, navigate Nairobi deliveries, and confirm drop-offs with QR codes.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5.5" cy="17.5" r="3.5"></circle>
        <circle cx="18.5" cy="17.5" r="3.5"></circle>
        <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5L9 9l3-2 3 3h3"></path>
      </svg>
    )
  },
  {
    id: 'dispatcher',
    title: 'Fleet Dispatcher',
    badge: 'Manage Operations',
    desc: 'Coordinate incoming retail orders, assign available riders, and manage fleet queues.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
    )
  }
];

function RegisterView() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState('retailer');
  const [step, setStep] = useState(1); // 1: Choose Role, 2: Form Details

  // Form State
  const [formData, setFormData] = useState({
    // Common fields
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',

    // Retailer fields
    shopName: '',
    shopLocation: '',
    businessType: 'General Retail',

    // Rider fields
    address: '',
    motorcycleReg: '',
    chassisDetails: '',
    motorcycleColor: '',
    motorcycleModel: '',

    // Dispatcher fields (also uses address)
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validateSingleField(field, value);
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateSingleField(field, formData[field]);
  };

  const validateSingleField = (field, value) => {
    const val = (value || '').trim();
    let err = '';

    if (field === 'name') {
      if (!val) err = 'Full name is required';
      else if (val.length < 3) err = 'Full name must be at least 3 characters';
    } else if (field === 'phone') {
      if (!val) err = 'Phone number is required';
      else if (!/^[+0-9\s-]{9,15}$/.test(val)) err = 'Enter a valid phone number (e.g. 0712 345 678)';
    } else if (field === 'email') {
      if (!val) err = 'Email address is required';
      else if (!/\S+@\S+\.\S+/.test(val)) err = 'Enter a valid email address';
    } else if (field === 'password') {
      if (!val) err = 'Password is required';
      else if (val.length < 6) err = 'Password must be at least 6 characters';
    } else if (field === 'confirmPassword') {
      if (!val) err = 'Please confirm your password';
      else if (val !== formData.password) err = 'Passwords do not match';
    } else if (selectedRole === 'retailer') {
      if (field === 'shopName' && !val) err = 'Shop/business name is required';
      if (field === 'shopLocation' && !val) err = 'Shop location / physical address is required';
      if (field === 'businessType' && !val) err = 'Business type is required';
    } else if (selectedRole === 'rider') {
      if (field === 'address' && !val) err = 'Residential location / base is required';
      if (field === 'motorcycleReg' && !val) err = 'Motorcycle registration number is required (e.g. KMDF 123X)';
      if (field === 'chassisDetails' && !val) err = 'Chassis/frame number or details required';
      if (field === 'motorcycleColor' && !val) err = 'Motorcycle color is required';
      if (field === 'motorcycleModel' && !val) err = 'Motorcycle model is required (e.g. Boxer 150)';
    } else if (selectedRole === 'dispatcher') {
      if (field === 'address' && !val) err = 'Operational location / dispatch base is required';
    }

    setErrors(prev => ({ ...prev, [field]: err }));
    return err;
  };

  const validateAll = () => {
    const fieldsToValidate = ['name', 'phone', 'email', 'password', 'confirmPassword'];

    if (selectedRole === 'retailer') {
      fieldsToValidate.push('shopName', 'shopLocation', 'businessType');
    } else if (selectedRole === 'rider') {
      fieldsToValidate.push('address', 'motorcycleReg', 'chassisDetails', 'motorcycleColor', 'motorcycleModel');
    } else if (selectedRole === 'dispatcher') {
      fieldsToValidate.push('address');
    }

    const newErrors = {};
    const newTouched = {};

    fieldsToValidate.forEach(f => {
      newTouched[f] = true;
      const err = validateSingleField(f, formData[f]);
      if (err) newErrors[f] = err;
    });

    setTouched(prev => ({ ...prev, ...newTouched }));
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Build role-specific details payload
      const details = {};
      if (selectedRole === 'retailer') {
        details.shopName = formData.shopName.trim();
        details.shopLocation = formData.shopLocation.trim();
        details.businessType = formData.businessType.trim();
      } else if (selectedRole === 'rider') {
        details.address = formData.address.trim();
        details.motorcycleReg = formData.motorcycleReg.trim();
        details.chassisDetails = formData.chassisDetails.trim();
        details.motorcycleColor = formData.motorcycleColor.trim();
        details.motorcycleModel = formData.motorcycleModel.trim();
      } else if (selectedRole === 'dispatcher') {
        details.address = formData.address.trim();
      }

      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: selectedRole,
        details
      };

      const result = await register(payload);
      setSubmittedData(result);
    } catch (err) {
      console.error('Registration failed:', err);
      const msg = err?.response?.data?.error || 'Registration failed. Please check your details and try again.';
      setApiError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Confirmation Screen upon successful submission
  if (submittedData) {
    return (
      <div className="register-page">
        <div className="register-success-card">
          <div className="register-success-icon-badge">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>

          <span className="status-pill status-pending">Status: Pending Admin Approval</span>
          <h1 className="register-success-title">Application Submitted!</h1>
          <p className="register-success-desc">
            Thank you, <strong>{formData.name}</strong>. Your application to join Reflex as a <strong>{selectedRole.toUpperCase()}</strong> has been submitted and queued for administrator review.
          </p>

          <div className="register-summary-box">
            <div className="summary-row">
              <span className="summary-label">Applied Role</span>
              <span className="summary-value" style={{ textTransform: 'capitalize' }}>{selectedRole}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Email Address</span>
              <span className="summary-value">{formData.email}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Phone Number</span>
              <span className="summary-value">{formData.phone}</span>
            </div>
            {selectedRole === 'retailer' && (
              <div className="summary-row">
                <span className="summary-label">Business</span>
                <span className="summary-value">{formData.shopName} ({formData.shopLocation})</span>
              </div>
            )}
            {selectedRole === 'rider' && (
              <div className="summary-row">
                <span className="summary-label">Motorcycle Reg</span>
                <span className="summary-value">{formData.motorcycleReg} • {formData.motorcycleModel}</span>
              </div>
            )}
            {selectedRole === 'dispatcher' && (
              <div className="summary-row">
                <span className="summary-label">Operating Base</span>
                <span className="summary-value">{formData.address}</span>
              </div>
            )}
          </div>

          <div className="register-next-steps">
            <h3>What happens next?</h3>
            <ol>
              <li>Our fleet admin team verifies your submitted credentials and operational details.</li>
              <li>Once verified, your account status will transition to <strong>APPROVED</strong>.</li>
              <li>You can log in at any time to check if your account has been approved.</li>
            </ol>
          </div>

          <div className="register-success-actions">
            <Link to="/login" className="btn-primary-action">
              Go to Login Portal
            </Link>
            <Link to="/" className="btn-secondary-action">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Header */}
        <header className="register-header">
          <Link to="/" className="brand-logo" aria-label="Reflex Home">
            <span className="brand-logo-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </span>
            <span className="brand-logo-text">Reflex</span>
          </Link>
          <h1 className="register-title">Join the Reflex Network</h1>
          <p className="register-subtitle">
            Choose your role and complete your operational profile to request verified access to the platform.
          </p>
        </header>

        {/* Step Indicator */}
        <div className="step-indicator">
          <button
            type="button"
            className={`step-bubble ${step === 1 ? 'active' : 'completed'}`}
            onClick={() => setStep(1)}
          >
            <span className="step-num">1</span>
            <span className="step-text">Choose Role</span>
          </button>
          <div className="step-line"></div>
          <button
            type="button"
            className={`step-bubble ${step === 2 ? 'active' : ''}`}
            onClick={() => setStep(2)}
          >
            <span className="step-num">2</span>
            <span className="step-text">Application Details</span>
          </button>
        </div>

        {apiError && (
          <div className="error-banner" role="alert">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div>
              <strong>Application Error</strong>
              <p>{apiError}</p>
            </div>
          </div>
        )}

        {/* STEP 1: ROLE SELECTION */}
        {step === 1 && (
          <div className="role-selection-section">
            <h2 className="section-label">Select Your Account Type</h2>
            <div className="role-cards-grid">
              {ROLES.map(r => (
                <div
                  key={r.id}
                  className={`role-select-card ${selectedRole === r.id ? 'selected' : ''}`}
                  onClick={() => setSelectedRole(r.id)}
                >
                  <div className="role-select-header">
                    <div className="role-select-icon">{r.icon}</div>
                    <span className="role-select-badge">{r.badge}</span>
                  </div>
                  <h3 className="role-select-title">{r.title}</h3>
                  <p className="role-select-desc">{r.desc}</p>
                  <div className="role-select-radio">
                    <div className="radio-dot"></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="step-actions">
              <button
                type="button"
                className="btn-next-step"
                onClick={() => setStep(2)}
              >
                <span>Continue as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: REGISTRATION FORM */}
        {step === 2 && (
          <form className="register-form" onSubmit={handleSubmit} noValidate>
            <div className="role-pill-banner">
              <span>Applying as:</span>
              <strong>{selectedRole.toUpperCase()}</strong>
              <button
                type="button"
                className="btn-change-role"
                onClick={() => setStep(1)}
              >
                Change Role
              </button>
            </div>

            {/* SECTION: Account Credentials */}
            <div className="form-section-card">
              <h3 className="form-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Personal & Account Credentials
              </h3>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="name">Full Name <span className="req">*</span></label>
                  <input
                    id="name"
                    type="text"
                    className={`form-input ${touched.name && errors.name ? 'input-error' : ''}`}
                    placeholder="e.g. Samuel Mwangi"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    required
                  />
                  {touched.name && errors.name && <div className="field-error">{errors.name}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number <span className="req">*</span></label>
                  <input
                    id="phone"
                    type="tel"
                    className={`form-input ${touched.phone && errors.phone ? 'input-error' : ''}`}
                    placeholder="e.g. 0712 345 678"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    required
                  />
                  {touched.phone && errors.phone && <div className="field-error">{errors.phone}</div>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address <span className="req">*</span></label>
                <input
                  id="email"
                  type="email"
                  className={`form-input ${touched.email && errors.email ? 'input-error' : ''}`}
                  placeholder="e.g. samuel@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  required
                />
                {touched.email && errors.email && <div className="field-error">{errors.email}</div>}
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="password">Password <span className="req">*</span></label>
                  <input
                    id="password"
                    type="password"
                    className={`form-input ${touched.password && errors.password ? 'input-error' : ''}`}
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    required
                  />
                  {touched.password && errors.password && <div className="field-error">{errors.password}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password <span className="req">*</span></label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className={`form-input ${touched.confirmPassword && errors.confirmPassword ? 'input-error' : ''}`}
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    onBlur={() => handleBlur('confirmPassword')}
                    required
                  />
                  {touched.confirmPassword && errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
                </div>
              </div>
            </div>

            {/* SECTION: Role-Specific Details */}
            {selectedRole === 'retailer' && (
              <div className="form-section-card">
                <h3 className="form-section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  Shop & Business Details
                </h3>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="shopName">Shop / Business Name <span className="req">*</span></label>
                    <input
                      id="shopName"
                      type="text"
                      className={`form-input ${touched.shopName && errors.shopName ? 'input-error' : ''}`}
                      placeholder="e.g. Nairobi Star Fashions"
                      value={formData.shopName}
                      onChange={(e) => handleChange('shopName', e.target.value)}
                      onBlur={() => handleBlur('shopName')}
                      required
                    />
                    {touched.shopName && errors.shopName && <div className="field-error">{errors.shopName}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="businessType">Business Type <span className="req">*</span></label>
                    <select
                      id="businessType"
                      className="form-select"
                      value={formData.businessType}
                      onChange={(e) => handleChange('businessType', e.target.value)}
                    >
                      <option value="Fashion & Apparel">Fashion & Apparel</option>
                      <option value="Electronics & Accessories">Electronics & Accessories</option>
                      <option value="Groceries & Food">Groceries & Food</option>
                      <option value="Beauty & Cosmetics">Beauty & Cosmetics</option>
                      <option value="Hardware & Spares">Hardware & Spares</option>
                      <option value="Pharmacy & Health">Pharmacy & Health</option>
                      <option value="General Retail">General Retail</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="shopLocation">Shop Location & Landmark <span className="req">*</span></label>
                  <input
                    id="shopLocation"
                    type="text"
                    className={`form-input ${touched.shopLocation && errors.shopLocation ? 'input-error' : ''}`}
                    placeholder="e.g. Biashara Plaza 2nd Floor, Stall B12, CBD"
                    value={formData.shopLocation}
                    onChange={(e) => handleChange('shopLocation', e.target.value)}
                    onBlur={() => handleBlur('shopLocation')}
                    required
                  />
                  {touched.shopLocation && errors.shopLocation && <div className="field-error">{errors.shopLocation}</div>}
                </div>
              </div>
            )}

            {selectedRole === 'rider' && (
              <div className="form-section-card">
                <h3 className="form-section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="5.5" cy="17.5" r="3.5"></circle>
                    <circle cx="18.5" cy="17.5" r="3.5"></circle>
                    <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5L9 9l3-2 3 3h3"></path>
                  </svg>
                  Motorcycle & Operational Details
                </h3>

                <div className="form-group">
                  <label htmlFor="address">Address / Operating Base <span className="req">*</span></label>
                  <input
                    id="address"
                    type="text"
                    className={`form-input ${touched.address && errors.address ? 'input-error' : ''}`}
                    placeholder="e.g. Ngara / Nairobi CBD Stage"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    onBlur={() => handleBlur('address')}
                    required
                  />
                  {touched.address && errors.address && <div className="field-error">{errors.address}</div>}
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="motorcycleReg">Motorcycle Reg Number <span className="req">*</span></label>
                    <input
                      id="motorcycleReg"
                      type="text"
                      className={`form-input ${touched.motorcycleReg && errors.motorcycleReg ? 'input-error' : ''}`}
                      placeholder="e.g. KMDF 829X"
                      value={formData.motorcycleReg}
                      onChange={(e) => handleChange('motorcycleReg', e.target.value.toUpperCase())}
                      onBlur={() => handleBlur('motorcycleReg')}
                      required
                    />
                    {touched.motorcycleReg && errors.motorcycleReg && <div className="field-error">{errors.motorcycleReg}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="motorcycleModel">Motorcycle Model <span className="req">*</span></label>
                    <input
                      id="motorcycleModel"
                      type="text"
                      className={`form-input ${touched.motorcycleModel && errors.motorcycleModel ? 'input-error' : ''}`}
                      placeholder="e.g. Boxer BM 150 / TVS HLX"
                      value={formData.motorcycleModel}
                      onChange={(e) => handleChange('motorcycleModel', e.target.value)}
                      onBlur={() => handleBlur('motorcycleModel')}
                      required
                    />
                    {touched.motorcycleModel && errors.motorcycleModel && <div className="field-error">{errors.motorcycleModel}</div>}
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="motorcycleColor">Motorcycle Color <span className="req">*</span></label>
                    <input
                      id="motorcycleColor"
                      type="text"
                      className={`form-input ${touched.motorcycleColor && errors.motorcycleColor ? 'input-error' : ''}`}
                      placeholder="e.g. Red / Black / Blue"
                      value={formData.motorcycleColor}
                      onChange={(e) => handleChange('motorcycleColor', e.target.value)}
                      onBlur={() => handleBlur('motorcycleColor')}
                      required
                    />
                    {touched.motorcycleColor && errors.motorcycleColor && <div className="field-error">{errors.motorcycleColor}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="chassisDetails">Chassis / Frame Details <span className="req">*</span></label>
                    <input
                      id="chassisDetails"
                      type="text"
                      className={`form-input ${touched.chassisDetails && errors.chassisDetails ? 'input-error' : ''}`}
                      placeholder="e.g. MD2A35BY2NW123456"
                      value={formData.chassisDetails}
                      onChange={(e) => handleChange('chassisDetails', e.target.value)}
                      onBlur={() => handleBlur('chassisDetails')}
                      required
                    />
                    {touched.chassisDetails && errors.chassisDetails && <div className="field-error">{errors.chassisDetails}</div>}
                  </div>
                </div>
              </div>
            )}

            {selectedRole === 'dispatcher' && (
              <div className="form-section-card">
                <h3 className="form-section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                  Operational Station Details
                </h3>

                <div className="form-group">
                  <label htmlFor="address">Dispatch Station / Location <span className="req">*</span></label>
                  <input
                    id="address"
                    type="text"
                    className={`form-input ${touched.address && errors.address ? 'input-error' : ''}`}
                    placeholder="e.g. Reflex Central Hub, Commercial Street, Industrial Area"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    onBlur={() => handleBlur('address')}
                    required
                  />
                  {touched.address && errors.address && <div className="field-error">{errors.address}</div>}
                </div>
              </div>
            )}

            {/* Form Footer Buttons */}
            <div className="form-actions-row">
              <button
                type="button"
                className="btn-back"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
              >
                Back to Role Select
              </button>

              <button
                type="submit"
                className="btn-submit-app"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-sm"></span>
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Application for Approval</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        <div className="register-footer">
          Already have an approved account? <Link to="/login" className="login-link">Log In Here</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterView;
