import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FAQs.css';

const faqs = [
  {
    q: 'How fast are deliveries?',
    a: 'Most deliveries within Nairobi are completed within 2–4 hours depending on traffic and rider availability. Orders are dispatched immediately once a retailer logs a request and a dispatcher assigns an active rider.',
  },
  {
    q: 'How can I track my package?',
    a: 'Retailers have real-time visibility on every delivery through their authenticated Retailer portal. Status updates from "Pending" through "Assigned", "Picked Up", and "Delivered" appear dynamically as riders update progress.',
  },
  {
    q: 'How do I register as a Retailer, Rider, or Dispatcher?',
    a: 'Click "Register" or "Sign Up" on the navigation bar, choose your role (Retailer, Delivery Rider, or Dispatcher), fill out your profile and vehicle/shop details, and submit. An administrator will review and approve your application before granting portal access.',
  },
  {
    q: 'What areas do you cover?',
    a: 'Reflex currently operates across Nairobi metropolitan areas including CBD, Westlands, Kilimani, Eastlands, Upperhill, Karen, and surrounding commercial hubs.',
  },
  {
    q: 'What if a delivery fails or the rider is unreachable?',
    a: 'Dispatchers actively monitor the queue and can re-assign deliveries if a rider encounters a mechanical breakdown or delay. Retailers can also submit an issue via our in-app Support form.',
  },
  {
    q: 'Do I need to install a mobile app?',
    a: 'No installation from an app store is required. Reflex runs responsively in any mobile or desktop web browser. An installable Progressive Web App (PWA) option is also supported.',
  },
  {
    q: 'Is my account and delivery data secure?',
    a: 'All data is stored in a secure MongoDB Atlas cluster with JWT authentication and role-based access control. Unapproved or unauthorized users cannot access operational portals.',
  },
  {
    q: 'Who do I contact for support or inquiries?',
    a: 'You can submit a ticket directly through our Support Form or reach our dispatch operations team directly through the platform.',
  },
];

function FAQs() {
  const [open, setOpen] = useState(null);

  useEffect(() => {
    document.title = 'Frequently Asked Questions | Reflex Delivery Platform';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Find answers to common questions about Reflex delivery tracking, retailer order dispatch, rider assignment, and role registration in Nairobi.'
      );
    }
  }, []);

  const toggle = (i) => setOpen(open === i ? null : i);

  return (
    <div className="faqs-page">
      <section className="faqs-hero">
        <div className="faqs-hero-inner">
          <div className="faqs-badge-pill">
            <span className="badge-dot" aria-hidden="true"></span>
            FAQs
          </div>
          <h1 className="faqs-headline">Questions? We have answers.</h1>
          <p className="faqs-lead">
            Everything you need to know about how Reflex works, role registration, delivery tracking,
            and how to get the most out of the platform.
          </p>
        </div>
      </section>

      <section className="faqs-body">
        <div className="faqs-inner">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item ${open === i ? 'faq-open' : ''}`}>
              <button
                className="faq-question"
                onClick={() => toggle(i)}
                aria-expanded={open === i}
              >
                <span>{faq.q}</span>
                <span className="faq-icon" aria-hidden="true">{open === i ? '−' : '+'}</span>
              </button>
              {open === i && (
                <div className="faq-answer">
                  {faq.a}
                  {i === faqs.length - 1 && (
                    <p style={{ marginTop: '10px' }}>
                      <Link to="/support" style={{ color: '#c85a32', fontWeight: '700' }}>
                        Go to Support Form →
                      </Link>
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default FAQs;

