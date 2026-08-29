import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HowItWorks.css';

const steps = [
  {
    number: '01',
    icon: '🏪',
    title: 'Retailer Logs the Request',
    description:
      'The merchant opens their Retailer portal, fills in customer name, phone number, delivery address, and package description. The form validates all fields before sending.',
    detail: 'Takes less than 30 seconds. Works on mobile or desktop.',
  },
  {
    number: '02',
    icon: '📋',
    title: 'Dispatcher Reviews the Queue',
    description:
      'The dispatcher sees the new request appear in their real-time queue. They review the details and assign the delivery to an available rider.',
    detail: 'Assignment triggers an instant notification to the rider.',
  },
  {
    number: '03',
    icon: '🏍️',
    title: 'Rider Picks Up the Package',
    description:
      'The assigned rider heads to the merchant, collects the package, and updates the status to "Picked Up" in their portal. The retailer sees this update live.',
    detail: 'No phone calls needed — statuses update in real time.',
  },
  {
    number: '04',
    icon: '📦',
    title: 'Customer Receives the Delivery',
    description:
      'The rider delivers the package to the customer\'s doorstep and marks it as "Delivered". A complete audit trail is recorded for the retailer.',
    detail: 'Full history stored per delivery for reconciliation.',
  },
];

function HowItWorks() {
  const [active, setActive] = useState(null);

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
                <div className="hiw-step-icon">{step.icon}</div>
                <h3 className="hiw-step-title">{step.title}</h3>
                <p className="hiw-step-desc">{step.description}</p>
                {active === i && (
                  <div className="hiw-step-detail">
                    <span>💡 </span>{step.detail}
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
