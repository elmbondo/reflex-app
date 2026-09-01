import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HowItWorks.css';

const steps = [
  {
    number: '01',
    iconType: 'retailer',
    title: 'Retailer Logs the Request',
    description:
      'The merchant opens their Retailer portal, fills in customer name, phone number, delivery address, and package description. The form validates all fields before sending.',
    detail: 'Takes less than 30 seconds. Works on mobile or desktop.',
  },
  {
    number: '02',
    iconType: 'dispatcher',
    title: 'Dispatcher Reviews the Queue',
    description:
      'The dispatcher sees the new request appear in their real-time queue. They review the details and assign the delivery to an available rider.',
    detail: 'Assignment triggers an instant notification to the rider.',
  },
  {
    number: '03',
    iconType: 'rider',
    title: 'Rider Picks Up the Package',
    description:
      'The assigned rider heads to the merchant, collects the package, and updates the status to "Picked Up" in their portal. The retailer sees this update live.',
    detail: 'No phone calls needed — statuses update in real time.',
  },
  {
    number: '04',
    iconType: 'package',
    title: 'Customer Receives the Delivery',
    description:
      'The rider delivers the package to the customer\'s doorstep and marks it as "Delivered". A complete audit trail is recorded for the retailer.',
    detail: 'Full history stored per delivery for reconciliation.',
  },
];

function StepIcon({ type }) {
  switch (type) {
    case 'retailer':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      );
    case 'dispatcher':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      );
    case 'rider':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="5.5" cy="17.5" r="3.5"></circle>
          <circle cx="18.5" cy="17.5" r="3.5"></circle>
          <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5L9 9l3-2 3 3h3"></path>
        </svg>
      );
    case 'package':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      );
    default:
      return null;
  }
}

function HowItWorks() {
  const [active, setActive] = useState(null);

  useEffect(() => {
    document.title = 'How It Works | Reflex Delivery Coordination Platform';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Discover how Reflex connects retail merchants, dispatchers, and riders into a smooth, transparent 4-step delivery pipeline across Nairobi.'
      );
    }
  }, []);

  return (
    <div className="hiw-page">
      <section className="hiw-hero">
        <div className="hiw-hero-inner">
          <div className="hiw-badge-pill">
            <span className="badge-dot" aria-hidden="true"></span>
            How It Works
          </div>
          <h1 className="hiw-headline">From shelf to doorstep in four steps</h1>
          <p className="hiw-lead">
            Reflex keeps everyone — retailer, dispatcher, and rider — on the same page
            through a clean, role-based workflow and real-time updates.
          </p>
        </div>
      </section>

      <section className="hiw-steps-section">
        <div className="hiw-steps-inner">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`hiw-step ${active === i ? 'hiw-step-active' : ''}`}
              onClick={() => setActive(active === i ? null : i)}
            >
              <div className="hiw-step-number">{step.number}</div>
              <div className="hiw-step-body">
                <div className="hiw-step-icon" aria-hidden="true">
                  <StepIcon type={step.iconType} />
                </div>
                <h3 className="hiw-step-title">{step.title}</h3>
                <p className="hiw-step-desc">{step.description}</p>
                {active === i && (
                  <div className="hiw-step-detail">
                    <span className="detail-tag">Key benefit:</span> {step.detail}
                  </div>
                )}
              </div>
              <div className="hiw-step-toggle" aria-hidden="true">
                {active === i ? '−' : '+'}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="hiw-cta-section">
        <div className="hiw-cta-inner">
          <h2>Ready to get started?</h2>
          <p>Log into your portal and start coordinating deliveries in minutes.</p>
          <Link to="/login" className="btn-hiw-primary">Access Your Portal</Link>
        </div>
      </section>
    </div>
  );
}

export default HowItWorks;
