// Retailer View — Person 1 (Frontend / Retailer Experience)
// Job: a form to log a new delivery request with clear validation and feedback,
// plus a real-time list of that retailer's past requests.

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { createDelivery, getDeliveries } from '../api';
import { useAuth } from '../context/AuthContext';
import DeliveryQrModal from '../components/DeliveryQrModal';
import './RetailerView.css';

function RetailerView() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    address: '',
    itemDescription: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccessData, setSubmitSuccessData] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [isLoadingDeliveries, setIsLoadingDeliveries] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [qrModalDelivery, setQrModalDelivery] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // Default to 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Reset to page 1 on filter or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  // Fetch past delivery requests
  const fetchDeliveries = useCallback(async () => {
    setIsLoadingDeliveries(true);
    try {
      const res = await getDeliveries();
      if (res && res.data) {
        setDeliveries(res.data);
      }
    } catch (err) {
      console.error('Error fetching deliveries:', err);
    } finally {
      setIsLoadingDeliveries(false);
    }
  }, []);

  useEffect(() => {
    fetchDeliveries();
    const intervalId = setInterval(fetchDeliveries, 5000);
    return () => clearInterval(intervalId);
  }, [fetchDeliveries]);

  // Validation logic
  const validateField = (name, value) => {
    const trimmed = (value || '').trim();
    switch (name) {
      case 'customerName':
        if (!trimmed) return 'Customer name is required';
        if (trimmed.length < 2) return 'Customer name must be at least 2 characters';
        return '';
      case 'customerPhone':
        if (!trimmed) return 'Customer phone number is required';
        // Validate general phone formats (e.g. 0712345678, +254712345678, 0112345678)
        if (!/^[+0-9\s-]{9,15}$/.test(trimmed)) {
          return 'Enter a valid phone number (e.g. 0712 345 678)';
        }
        return '';
      case 'address':
        if (!trimmed) return 'Delivery address / landmark is required';
        if (trimmed.length < 3) return 'Please provide a clearer address or landmark';
        return '';
      case 'itemDescription':
        if (!trimmed) return 'Item description is required';
        if (trimmed.length < 2) return 'Please describe what is being delivered';
        return '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {
      customerName: validateField('customerName', form.customerName),
      customerPhone: validateField('customerPhone', form.customerPhone),
      address: validateField('address', form.address),
      itemDescription: validateField('itemDescription', form.itemDescription)
    };

    // Filter out empty error strings
    const activeErrors = Object.keys(newErrors).reduce((acc, key) => {
      if (newErrors[key]) acc[key] = newErrors[key];
      return acc;
    }, {});

    setErrors(activeErrors);
    return Object.keys(activeErrors).length === 0;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, form[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched to display errors
    setTouched({
      customerName: true,
      customerPhone: true,
      address: true,
      itemDescription: true
    });

    if (!validateForm()) {
      return;
    }

    if (isSubmitting) return; // Prevent duplicate submission

    setIsSubmitting(true);
    setApiError(null);

    try {
      // Real API call: RetailerView -> shared api.js -> POST /api/deliveries
      const payload = {
        customerName: form.customerName.trim(),
        customerPhone: form.customerPhone.trim(),
        address: form.address.trim(),
        itemDescription: form.itemDescription.trim(),
        retailer: user?.id || user?._id || process.env.REACT_APP_RETAILER_ID
      };

      const response = await createDelivery(payload);
      
      // Expected success format: HTTP 201 with response.data
      const createdDelivery = response.data || payload;
      setSubmitSuccessData(createdDelivery);

      // Reset form fields
      setForm({
        customerName: '',
        customerPhone: '',
        address: '',
        itemDescription: ''
      });
      setTouched({});
      setErrors({});

      // Refresh deliveries list
      fetchDeliveries();
    } catch (err) {
      console.error('Failed to create delivery:', err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Unable to submit delivery request. Please check network connection and try again.';
      setApiError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset to log another delivery
  const handleResetForNewDelivery = () => {
    setSubmitSuccessData(null);
    setApiError(null);
  };

  // Status badge styling helper
  const getStatusBadgeClass = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'assigned':
        return 'status-assigned';
      case 'picked up':
        return 'status-picked-up';
      case 'delivered':
        return 'status-delivered';
      default:
        return 'status-pending';
    }
  };

  // Summary counts for fast operational overview
  const pendingCount = deliveries.filter((d) => d.currentStatus === 'Pending').length;
  const inProgressCount = deliveries.filter((d) => d.currentStatus === 'Assigned' || d.currentStatus === 'Picked Up').length;
  const completedCount = deliveries.filter((d) => d.currentStatus === 'Delivered').length;
  
  // Filter & sort newest first
  const filteredDeliveries = deliveries.filter((d) => {
    if (activeFilter === 'pending' && d.currentStatus !== 'Pending') return false;
    if (activeFilter === 'delivered' && d.currentStatus !== 'Delivered') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = (d.customerName || '').toLowerCase().includes(q);
      const phoneMatch = (d.customerPhone || '').toLowerCase().includes(q);
      const addrMatch = (d.address || '').toLowerCase().includes(q);
      const itemMatch = (d.itemDescription || '').toLowerCase().includes(q);
      const idMatch = (d._id || '').toLowerCase().includes(q);
      return nameMatch || phoneMatch || addrMatch || itemMatch || idMatch;
    }
    return true;
  }).sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA;
  });

  const totalPages = Math.max(1, Math.ceil(filteredDeliveries.length / ITEMS_PER_PAGE));
  const paginatedDeliveries = filteredDeliveries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <main className="retailer-container" aria-label="Retailer Delivery Management">
      <div style={{ marginBottom: '14px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--color-terracotta, #c85a32)', fontWeight: 600, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Brand Header */}
      <header className="retailer-header">
        <div className="brand-badge">
          <span className="brand-badge-dot" aria-hidden="true"></span>
          Reflex Logistics • Retailer Portal
        </div>
        <h1 className="retailer-title">Create & Track Delivery Requests</h1>
        <p className="retailer-subtitle">
          Dispatch orders directly to our fleet without messy phone calls or lost WhatsApp messages. Log your customer's package details below for instant dispatcher assignment and live rider updates.
        </p>
      </header>

      {/* Main Layout Grid */}
      <div className="retailer-layout">
        {/* Left Column: Form / Success state */}
        <section className="retailer-card" aria-labelledby="form-heading">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <div>
                <h2 id="form-heading" className="card-title">
                  {submitSuccessData ? 'Request Submitted' : 'New Delivery Request'}
                </h2>
                <p className="card-caption">
                  {submitSuccessData ? 'Dispatch order logged successfully' : 'Fill in customer and delivery package details'}
                </p>
              </div>
            </div>
          </div>

          {/* Controlled Network / API Error State */}
          {apiError && (
            <div className="error-banner" role="alert">
              <div className="error-banner-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div>
                <div className="error-banner-title">Delivery submission failed</div>
                <p className="error-banner-text">{apiError}</p>
                <button
                  type="button"
                  className="btn-retry"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  Retry Submission
                </button>
              </div>
            </div>
          )}

          {/* Success State using REAL API response */}
          {submitSuccessData ? (
            <div className="success-card" role="region" aria-live="polite">
              <div className="success-header">
                <div className="success-icon-badge" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="success-headline">Delivery request submitted!</h3>
                  <div className="success-status-pill">
                    Status: {submitSuccessData.currentStatus || 'Pending'}
                  </div>
                </div>
              </div>

              <div className="success-details-box">
                <div className="detail-row">
                  <span className="detail-label">Customer Name</span>
                  <span className="detail-value">{submitSuccessData.customerName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone</span>
                  <span className="detail-value">{submitSuccessData.customerPhone}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Address</span>
                  <span className="detail-value">{submitSuccessData.address}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Item</span>
                  <span className="detail-value">{submitSuccessData.itemDescription}</span>
                </div>
                {submitSuccessData._id && (
                  <div className="detail-row">
                    <span className="detail-label">Reference ID</span>
                    <span className="detail-value" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      {submitSuccessData._id}
                    </span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-new-delivery"
                  onClick={() => setQrModalDelivery(submitSuccessData)}
                  style={{ backgroundColor: 'var(--color-olive, #242d22)' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  View QR Pass
                </button>

                <button
                  type="button"
                  className="btn-new-delivery"
                  onClick={handleResetForNewDelivery}
                  id="log-another-delivery-btn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Log Another Delivery
                </button>
              </div>
            </div>
          ) : (
            /* Creation Form */
            <form className="delivery-form" onSubmit={handleSubmit} noValidate>
              {/* Row 1: Customer Name & Phone */}
              <div className="form-row-2col">
                {/* Field 1: Customer Name */}
                <div className="form-group">
                  <label className="form-label" htmlFor="customerName">
                    Customer Name <span className="required-star">*</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </span>
                    <input
                      id="customerName"
                      name="customerName"
                      type="text"
                      className={`form-input ${touched.customerName && errors.customerName ? 'input-error' : ''}`}
                      placeholder="e.g. Wanjiku Kamau"
                      value={form.customerName}
                      onChange={(e) => handleChange('customerName', e.target.value)}
                      onBlur={() => handleBlur('customerName')}
                      disabled={isSubmitting}
                      required
                      aria-invalid={touched.customerName && Boolean(errors.customerName)}
                      aria-describedby={errors.customerName ? 'customerName-error' : undefined}
                    />
                  </div>
                  {touched.customerName && errors.customerName && (
                    <div id="customerName-error" className="field-error-message" role="alert">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      {errors.customerName}
                    </div>
                  )}
                </div>

                {/* Field 2: Customer Phone */}
                <div className="form-group">
                  <label className="form-label" htmlFor="customerPhone">
                    Customer Phone <span className="required-star">*</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </span>
                    <input
                      id="customerPhone"
                      name="customerPhone"
                      type="tel"
                      className={`form-input ${touched.customerPhone && errors.customerPhone ? 'input-error' : ''}`}
                      placeholder="e.g. 0712 345 678"
                      value={form.customerPhone}
                      onChange={(e) => handleChange('customerPhone', e.target.value)}
                      onBlur={() => handleBlur('customerPhone')}
                      disabled={isSubmitting}
                      required
                      aria-invalid={touched.customerPhone && Boolean(errors.customerPhone)}
                      aria-describedby={errors.customerPhone ? 'customerPhone-error' : 'phone-helper'}
                    />
                  </div>
                  {touched.customerPhone && errors.customerPhone && (
                    <div id="customerPhone-error" className="field-error-message" role="alert">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      {errors.customerPhone}
                    </div>
                  )}
                </div>
              </div>

              {/* Row 2: Delivery Address & Package Details */}
              <div className="form-row-2col">
                {/* Field 3: Delivery Address */}
                <div className="form-group">
                  <label className="form-label" htmlFor="address">
                    Delivery Address & Landmark <span className="required-star">*</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </span>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      className={`form-input ${touched.address && errors.address ? 'input-error' : ''}`}
                      placeholder="e.g. Biashara Plaza 3rd Flr, Room 14, CBD"
                      value={form.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      onBlur={() => handleBlur('address')}
                      disabled={isSubmitting}
                      required
                      aria-invalid={touched.address && Boolean(errors.address)}
                      aria-describedby={errors.address ? 'address-error' : undefined}
                    />
                  </div>
                  {touched.address && errors.address && (
                    <div id="address-error" className="field-error-message" role="alert">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      {errors.address}
                    </div>
                  )}
                </div>

                {/* Field 4: Item Description */}
                <div className="form-group">
                  <label className="form-label" htmlFor="itemDescription">
                    Item Description <span className="required-star">*</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="21 8 21 21 3 21 3 8"></polyline>
                        <line x1="1" y1="3" x2="23" y2="3"></line>
                        <path d="M10 12h4"></path>
                      </svg>
                    </span>
                    <input
                      id="itemDescription"
                      name="itemDescription"
                      type="text"
                      className={`form-input ${touched.itemDescription && errors.itemDescription ? 'input-error' : ''}`}
                      placeholder="e.g. 2x Ankara dresses in brown box"
                      value={form.itemDescription}
                      onChange={(e) => handleChange('itemDescription', e.target.value)}
                      onBlur={() => handleBlur('itemDescription')}
                      disabled={isSubmitting}
                      required
                      aria-invalid={touched.itemDescription && Boolean(errors.itemDescription)}
                      aria-describedby={errors.itemDescription ? 'itemDescription-error' : undefined}
                    />
                  </div>
                  {touched.itemDescription && errors.itemDescription && (
                    <div id="itemDescription-error" className="field-error-message" role="alert">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      {errors.itemDescription}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="submit-delivery-btn"
                className="btn-submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner" aria-hidden="true"></span>
                    <span>Submitting Delivery...</span>
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                    <span>Submit Delivery Request</span>
                  </>
                )}
              </button>
            </form>
          )}
        </section>

        {/* Right Column: Active & Past Deliveries Queue */}
        <section className="retailer-card" aria-labelledby="queue-heading">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon" style={{ backgroundColor: 'var(--color-sand)' }} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-olive)' }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div>
                <h2 id="queue-heading" className="card-title">My Requests</h2>
                <p className="card-caption">Live status of your logged deliveries</p>
              </div>
            </div>
            <div className="queue-header-actions">
              <div className="view-mode-toggle" role="radiogroup" aria-label="View Mode">
                <button
                  type="button"
                  className={`btn-view-toggle ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid Cards View"
                  aria-label="Grid View"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  <span>Grid</span>
                </button>
                <button
                  type="button"
                  className={`btn-view-toggle ${viewMode === 'table' ? 'active' : ''}`}
                  onClick={() => setViewMode('table')}
                  title="Table View"
                  aria-label="Table View"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                  <span>Table</span>
                </button>
              </div>

              <button
                type="button"
                className="btn-refresh"
                onClick={fetchDeliveries}
                disabled={isLoadingDeliveries}
                title="Refresh delivery statuses"
                aria-label="Refresh requests list"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isLoadingDeliveries ? 'rotate(180deg)' : 'none', transition: 'transform 0.5s ease' }}>
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
                <span>{isLoadingDeliveries ? 'Updating...' : 'Refresh'}</span>
              </button>
            </div>
          </div>

          {/* Search & Quick Metrics Bar */}
          <div className="queue-controls-bar">
            <div className="search-input-wrapper">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                className="search-filter-input"
                placeholder="Search requests by customer, address or package..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            <div className="retailer-stats">
              <div
                className={`stat-box ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
                style={{ cursor: 'pointer' }}
              >
                <div className="stat-number">{deliveries.length}</div>
                <div className="stat-label">Total</div>
              </div>
              <div
                className={`stat-box ${activeFilter === 'pending' ? 'active' : ''}`}
                onClick={() => setActiveFilter('pending')}
                style={{ cursor: 'pointer' }}
              >
                <div className="stat-number" style={{ color: 'var(--color-amber-dark)' }}>{pendingCount}</div>
                <div className="stat-label">Pending</div>
              </div>
              <div
                className={`stat-box ${activeFilter === 'delivered' ? 'active' : ''}`}
                onClick={() => setActiveFilter('delivered')}
                style={{ cursor: 'pointer' }}
              >
                <div className="stat-number" style={{ color: 'var(--color-success)' }}>{completedCount}</div>
                <div className="stat-label">Delivered</div>
              </div>
            </div>
          </div>

          {/* Deliveries list */}
          {filteredDeliveries.length === 0 ? (
            <div className="empty-state">
              <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              <h3 className="empty-state-title">
                {searchQuery ? 'No matching requests found' : 'No deliveries logged yet'}
              </h3>
              <p className="empty-state-text">
                {searchQuery ? 'Try clearing your search or filter keywords.' : 'Submit your first customer delivery request using the form.'}
              </p>
            </div>
          ) : viewMode === 'table' ? (
            <div className="requests-table-container">
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>Ref / Date</th>
                    <th>Customer Details</th>
                    <th>Delivery Address</th>
                    <th>Package Item</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDeliveries.map((d) => (
                    <tr key={d._id || `${d.customerName}-${d.createdAt || Math.random()}`}>
                      <td className="cell-ref">
                        <div className="ref-code">Ref: {d._id ? d._id.slice(-6).toUpperCase() : 'NEW'}</div>
                        <div className="ref-date">
                          {d.createdAt ? new Date(d.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                        </div>
                      </td>
                      <td>
                        <div className="customer-cell-name">{d.customerName}</div>
                        <div className="customer-cell-phone">{d.customerPhone}</div>
                      </td>
                      <td className="cell-address">{d.address}</td>
                      <td className="cell-item">{d.itemDescription}</td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(d.currentStatus)}`}>
                          <span className="status-badge-dot" aria-hidden="true"></span>
                          {d.currentStatus || 'Pending'}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-qr-pass"
                          onClick={() => setQrModalDelivery(d)}
                        >
                          QR Pass
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="requests-grid" aria-label="Deliveries grid">
              {paginatedDeliveries.map((d) => (
                <div key={d._id || `${d.customerName}-${d.createdAt || Math.random()}`} className="request-card">
                  <div className="request-top">
                    <div className="customer-name">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-terracotta)' }}>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      <span>{d.customerName}</span>
                    </div>
                    <span className={`status-badge ${getStatusBadgeClass(d.currentStatus)}`}>
                      <span className="status-badge-dot" aria-hidden="true"></span>
                      {d.currentStatus || 'Pending'}
                    </span>
                  </div>

                  <div className="request-info">
                    {d.customerPhone && (
                      <div className="info-row">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        <span>{d.customerPhone}</span>
                      </div>
                    )}
                    {d.address && (
                      <div className="info-row">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>{d.address}</span>
                      </div>
                    )}
                    {d.itemDescription && (
                      <div className="item-desc-text">
                        <strong>Package:</strong> {d.itemDescription}
                      </div>
                    )}
                  </div>

                  <div className="request-meta">
                    <div className="meta-left">
                      <span className="ref-pill">#{d._id ? d._id.slice(-6).toUpperCase() : 'NEW'}</span>
                      <span className="date-text">
                        {d.createdAt ? new Date(d.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn-qr-pass"
                      onClick={() => setQrModalDelivery(d)}
                    >
                      QR Pass
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {filteredDeliveries.length > ITEMS_PER_PAGE && (
            <div className="pagination-bar">
              <div className="pagination-info">
                Showing {Math.min(filteredDeliveries.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)}-
                {Math.min(filteredDeliveries.length, currentPage * ITEMS_PER_PAGE)} of {filteredDeliveries.length} requests
              </div>
              <div className="pagination-actions">
                <button
                  type="button"
                  className="btn-page"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  aria-label="Previous Page"
                >
                  ← Prev
                </button>

                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      className={`btn-page-num ${pageNum === currentPage ? 'active' : ''}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="btn-page"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  aria-label="Next Page"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {qrModalDelivery && (
        <DeliveryQrModal
          delivery={qrModalDelivery}
          onClose={() => setQrModalDelivery(null)}
        />
      )}
    </main>
  );
}

export default RetailerView;

