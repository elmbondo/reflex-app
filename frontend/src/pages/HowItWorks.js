import React from 'react';

function HowItWorks() {
  return (
    <div className="static-page" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', color: 'var(--color-ink, #2d2d2d)' }}>
      <h1 style={{ color: 'var(--color-terracotta, #e05e36)' }}>How Reflex Works</h1>
      <ol style={{ lineHeight: '1.8', marginTop: '1.5rem', paddingLeft: '1.5rem' }}>
        <li><strong>Retailer Logs Request:</strong> Merchants use the Retailer portal to quickly log customer details and package descriptions.</li>
        <li><strong>Dispatcher Assigns Rider:</strong> Our dispatchers view incoming requests and assign them to available riders on the field.</li>
        <li><strong>Rider Picks Up:</strong> The assigned rider heads to the merchant, scans the package (or confirms pickup), and updates the status.</li>
        <li><strong>Customer Receives Package:</strong> The rider delivers the item directly to the customer's doorstep, updating the status to Delivered.</li>
      </ol>
    </div>
  );
}

export default HowItWorks;
