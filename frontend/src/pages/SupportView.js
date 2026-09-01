import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { submitSupportTicket } from '../api';
import './SupportView.css';

function SupportView() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    deliveryId: '',
    issue: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    document.title = 'Support & Help Desk | Reflex Delivery Platform';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Need help with a delivery, rider dispatch, or account issue? Contact the Reflex support team for fast assistance.'
      );
    }
  }, []);

  const validateField = (field, value) => {
    const trimmed = (value || '').trim();
    switch (field) {
      case 'name':
        if (!trimmed) return 'Please provide your full name.';
        if (trimmed.length < 2) return 'Name must be at least 2 characters.';
        return '';
      case 'phone':
        if (!trimmed) return 'Please provide a contact phone number.';
        if (!/^[+0-9\s-]{9,15}$/.test(trimmed)) {
          return 'Enter a valid phone number (e.g., 0712 345 678).';
        }
        return '';
      case 'issue':
        if (!trimmed) return 'Please describe the issue or question you have.';
        if (trimmed.length < 10) return 'Please provide more details (at least 10 characters).';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const err = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      name: true,
      phone: true,
      issue: true
    });

    const newErrors = {
      name: validateField('name', formData.name),
      phone: validateField('phone', formData.phone),
      issue: validateField('issue', formData.issue)
    };

    const activeErrors = Object.keys(newErrors).reduce((acc, key) => {
      if (newErrors[key]) acc[key] = newErrors[key];
      return acc;
    }, {});

    setErrors(activeErrors);

    if (Object.keys(activeErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setApiError(null);
    setSubmitSuccess(null);

    try {
      const res = await submitSupportTicket({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        deliveryId: formData.deliveryId.trim(),
        issue: formData.issue.trim()
      });

      setSubmitSuccess(res.data?.message || 'Support ticket submitted successfully!');
      setFormData({
        name: '',
        phone: '',
        deliveryId: '',
        issue: ''
      });
      setTouched({});
      setErrors({});
    } catch (err) {
      console.error('Support ticket error:', err);
      setApiError(err.response?.data?.error || 'Failed to submit support ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="support-page">
      <div className="support-hero">
        <div className="support-hero-inner">
          <div className="support-badge-pill">
            <span className="support-badge-dot" aria-hidden="true"></span>
            Reflex Help &amp; Support
          </div>
          <h1 className="support-headline">How can we help you?</h1>
          <p className="support-lead">
            Have a question about an ongoing dispatch, delivery status, or need help with your account?
            Submit the form below and our operations team will assist you.
          </p>
        </div>
      </div>

      <div className="support-content-container">
        <div className="support-card">
          {submitSuccess && (
            <div className="support-alert success-alert" role="status">
              <div className="alert-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div>
                <strong>Thank you!</strong>
                <p>{submitSuccess}</p>
                <button
                  type="button"
                  className="btn-new-ticket"
                  onClick={() => setSubmitSuccess(null)}
                >
                  Submit Another Issue
                </button>
              </div>
            </div>
          )}

          {apiError && (
            <div className="support-alert error-alert" role="alert">
              <div className="alert-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div>
                <strong>Submission Error</strong>
                <p>{apiError}</p>
              </div>
            </div>
          )}

          {!submitSuccess && (
            <form className="support-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="support-name">
                  Full Name <span className="req-star">*</span>
                </label>
                <input
                  id="support-name"
                  type="text"
                  className={`support-input ${errors.name && touched.name ? 'input-error' : ''}`}
                  placeholder="e.g. Grace Wanjiku"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  disabled={isSubmitting}
                />
                {errors.name && touched.name && (
                  <span className="field-error">{errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="support-phone">
                  Phone Number <span className="req-star">*</span>
                </label>
                <input
                  id="support-phone"
                  type="tel"
                  className={`support-input ${errors.phone && touched.phone ? 'input-error' : ''}`}
                  placeholder="e.g. 0712 345 678"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  disabled={isSubmitting}
                />
                {errors.phone && touched.phone && (
                  <span className="field-error">{errors.phone}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="support-delivery-id">
                  Delivery ID <span className="optional-tag">(Optional)</span>
                </label>
                <input
                  id="support-delivery-id"
                  type="text"
                  className="support-input"
                  placeholder="e.g. 64b8e... (found on tracking screen)"
                  value={formData.deliveryId}
                  onChange={(e) => handleChange('deliveryId', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="support-issue">
                  Issue Description <span className="req-star">*</span>
                </label>
                <textarea
                  id="support-issue"
                  className={`support-textarea ${errors.issue && touched.issue ? 'input-error' : ''}`}
                  rows="4"
                  placeholder="Please describe the issue or question in detail..."
                  value={formData.issue}
                  onChange={(e) => handleChange('issue', e.target.value)}
                  onBlur={() => handleBlur('issue')}
                  disabled={isSubmitting}
                ></textarea>
                {errors.issue && touched.issue && (
                  <span className="field-error">{errors.issue}</span>
                )}
              </div>

              <button
                type="submit"
                className="btn-submit-support"
                disabled={isSubmitting}
                id="support-submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-sm" aria-hidden="true"></span>
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <span>Submit Support Request</span>
                )}
              </button>
            </form>
          )}

          <div className="support-footer-links">
            <p>
              Looking for quick answers? Check our <Link to="/faqs">Frequently Asked Questions</Link> or learn <Link to="/how-it-works">How Reflex Works</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportView;
