import React, { useState } from 'react';
import './FAQs.css';

const faqs = [
  {
    q: 'How fast are deliveries?',
    a: 'Most deliveries within Nairobi are completed within 2–4 hours depending on traffic and rider availability. Express slots are being developed for high-priority parcels.',
  },
  {
    q: 'How can I track my package?',
    a: 'Retailers have real-time visibility on every delivery through the Retailer portal. Status updates from "Pending" through "Assigned", "Picked Up", and "Delivered" appear as they happen.',
  },
  {
    q: 'What areas do you cover?',
    a: 'Reflex currently operates across Nairobi with plans to expand to Mombasa and Kisumu. Coverage continues to grow as more riders join the network.',
  },
  {
    q: 'What if a delivery fails or the rider is unreachable?',
    a: 'Dispatchers monitor the queue and can re-assign deliveries if a rider becomes unavailable. The retailer is kept informed via status updates throughout.',
  },
  {
    q: 'Do I need to install an app?',
    a: 'No installation is required. Reflex runs fully in your mobile or desktop browser. An installable PWA option is also available for a more native feel.',
  },
  {
    q: 'How is the retailer ID assigned?',
    a: 'In the current MVP, a temporary retailer ID is used to identify merchants. Full multi-tenant authentication with unique login credentials is on the roadmap.',
  },
  {
    q: 'Is my data secure?',
    a: 'All data is stored in a dedicated MongoDB Atlas cluster with network isolation. Sensitive environment variables (like database credentials) are never exposed in the frontend code.',
  },
  {
    q: 'Who do I contact for support?',
    a: 'Reach out to your assigned Dispatcher or our operations team directly through the platform. An in-app support system is coming soon.',
  },
];

function FAQs() {
  const [open, setOpen] = useState(null);

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
            Everything you need to know about how Reflex works, what to expect,
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
