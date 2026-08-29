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
              <div className="about-card-icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <h3>Retailers</h3>
              <p>Log delivery requests in under 30 seconds. Track every parcel from submission to doorstep without phone calls.</p>
            </div>

            <div className="about-card">
              <div className="about-card-icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <h3>Dispatchers</h3>
              <p>Manage your entire delivery queue from one screen. Assign riders, monitor statuses, and keep operations running smoothly.</p>
            </div>

            <div className="about-card">
              <div className="about-card-icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="5.5" cy="17.5" r="3.5"></circle>
                  <circle cx="18.5" cy="17.5" r="3.5"></circle>
                  <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5L9 9l3-2 3 3h3"></path>
                </svg>
              </div>
              <h3>Riders</h3>
              <p>See your assigned deliveries clearly, update statuses on the go, and maintain a clean record of completed jobs.</p>
            </div>
          </div>

          <h2>Built for Kenyan Conditions</h2>
          <ul className="about-feature-list">
            <li>
              <span className="about-check-icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </span>
              <span><strong>Landmark-friendly address input:</strong> Built for Kenyan addresses, building names, and estate landmarks.</span>
            </li>
            <li>
              <span className="about-check-icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </span>
              <span><strong>Works on mobile browsers &amp; PWA:</strong> No app store friction for fast staff onboarding.</span>
            </li>
            <li>
              <span className="about-check-icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </span>
              <span><strong>Real-time status updates:</strong> Live coordination between retailers, dispatchers, and riders.</span>
            </li>
            <li>
              <span className="about-check-icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </span>
              <span><strong>Zero upfront hardware:</strong> Runs directly on existing Android and iOS smartphones.</span>
            </li>
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
