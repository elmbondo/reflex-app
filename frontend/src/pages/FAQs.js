import React from 'react';

function FAQs() {
  return (
    <div className="static-page" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', color: 'var(--color-ink, #2d2d2d)' }}>
      <h1 style={{ color: 'var(--color-terracotta, #e05e36)' }}>Frequently Asked Questions</h1>
      
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ color: 'var(--color-sand-dark, #b5a999)' }}>How fast are deliveries?</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '1.5rem' }}>Depending on the distance and rider availability, most deliveries are completed within a few hours.</p>

        <h3 style={{ color: 'var(--color-sand-dark, #b5a999)' }}>How can I track my package?</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '1.5rem' }}>Currently, retailers have real-time visibility through the Retailer portal. Customer tracking links are coming soon!</p>

        <h3 style={{ color: 'var(--color-sand-dark, #b5a999)' }}>Who do I contact for support?</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '1.5rem' }}>You can reach out to our Dispatch team directly through the app or contact our support line.</p>
      </div>
    </div>
  );
}

export default FAQs;
