import React from 'react';

function About() {
  return (
    <div className="static-page" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', color: 'var(--color-ink, #2d2d2d)' }}>
      <h1 style={{ color: 'var(--color-terracotta, #e05e36)' }}>About Reflex</h1>
      <p style={{ lineHeight: '1.6', marginTop: '1rem' }}>
        Reflex is a lightweight delivery platform designed for Kenyan merchants. 
        We bridge the gap between retailers, dispatchers, and riders to ensure 
        fast, reliable, and trackable deliveries across town.
      </p>
      <p style={{ lineHeight: '1.6', marginTop: '1rem' }}>
        Built with usability and performance in mind, our platform provides a 
        seamless experience for managing orders, dispatching riders, and keeping 
        customers informed every step of the way.
      </p>
    </div>
  );
}

export default About;
