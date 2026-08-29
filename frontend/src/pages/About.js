import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-inner">
          <div className="about-badge-pill">
            <span className="badge-dot" aria-hidden="true"></span>
            About Reflex
          </div>
          <h1 className="about-headline">Logistics built for Nairobi's streets</h1>
          <p className="about-lead">
            Reflex is a lightweight, real-time delivery coordination platform designed
            specifically for Kenyan retailers and local courier networks. We bridge the
            gap between shopkeepers, dispatchers, and riders to ensure fast, trackable deliveries.
          </p>
        </div>
      </section>

      <section className="about-section">
        <div className="about-content">
          <h2>Our Mission</h2>
          <p>
            Last-mile delivery in Nairobi is chaotic — orders get lost, riders are
            unreachable, and retailers have no visibility. Reflex gives every party in
            the delivery chain a single, clear view so nothing slips through.
          </p>

          <h2>Who We Serve</h2>
          <div className="about-cards">
            <div className="about-card">
              <div className="about-card-icon">🏪</div>
              <h3>Retailers</h3>
              <p>Log delivery requests in under 30 seconds. Track every parcel from submission to doorstep without phone calls.</p>
            </div>
            <div className="about-card">
              <div className="about-card-icon">📋</div>
              <h3>Dispatchers</h3>
              <p>Manage your entire delivery queue from one screen. Assign riders, monitor statuses, and keep operations running smoothly.</p>
            </div>
            <div className="about-card">
              <div className="about-card-icon">🏍️</div>
              <h3>Riders</h3>
              <p>See your assigned deliveries clearly, update statuses on the go, and maintain a clean record of completed jobs.</p>
            </div>
          </div>

          <h2>Built for Kenyan Conditions</h2>
          <ul className="about-feature-list">
            <li>✅ Landmark-friendly address input — no GPS required</li>
            <li>✅ Works on mobile browsers and as a PWA</li>
            <li>✅ Real-time status updates via Socket.io</li>
            <li>✅ No upfront hardware or complex setup</li>
          </ul>

          <div className="about-cta">
            <Link to="/login" className="btn-about-primary">Access Your Portal</Link>
            <Link to="/how-it-works" className="btn-about-secondary">See How It Works</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
