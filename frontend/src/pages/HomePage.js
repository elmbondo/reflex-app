import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="homepage-container">
      {/* Hero Section — Photographic backdrop with subtle overlay */}
      <section className="hero-section hero-overlay-style">
        {/* Background Image & Subtle Overlay */}
        <div className="hero-backdrop" aria-hidden="true">
          <img
            src="/images/reflex-hero-delivery.jpg"
            alt="Reflex delivery rider with parcel on motorcycle in Nairobi"
            className="hero-backdrop-img"
          />
          <div className="hero-subtle-overlay"></div>
        </div>

        <div className="hero-container hero-overlay-content">
          {/* Top Pill */}
          <div className="hero-pill hero-pill-solid">
            <span className="hero-pill-dot" aria-hidden="true"></span>
            Built for Kenyan Retailers &amp; Merchants
          </div>

          {/* Main Headline */}
          <h1 className="hero-title hero-title-overlay">
            Deliver without the <span className="highlight-terracotta">delivery chaos.</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle hero-subtitle-overlay">
            Reflex helps retail shops, boutiques, and merchants log customer deliveries instantly, dispatch verified riders, and maintain real-time visibility.
          </p>

          {/* Central Quick-Dispatch Bar */}
          <div className="hero-search-bar-wrapper">
            <div className="hero-search-bar">
              <span className="search-bar-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </span>
              <input
                type="text"
                className="search-bar-input"
                placeholder="Enter customer delivery address (e.g., Westlands, CBD, Kilimani)..."
                readOnly
                onClick={() => window.location.href = '/retailer'}
                aria-label="Enter customer delivery destination"
              />
              <Link to="/retailer" className="btn-search-bar-cta" id="hero-send-delivery-btn">
                <span>Create a Delivery</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>

            {/* Quick Portal Access Pills with Professional SVG Icons */}
            <div className="hero-quick-pills">
              <Link to="/retailer" className="quick-pill quick-pill-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                <span>Retailer Order Desk</span>
              </Link>
              <Link to="/dispatcher" className="quick-pill">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
                <span>Dispatcher Queue</span>
              </Link>
              <Link to="/rider" className="quick-pill">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="5.5" cy="17.5" r="3.5"></circle>
                  <circle cx="18.5" cy="17.5" r="3.5"></circle>
                  <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5L9 9l3-2 3 3h3"></path>
                </svg>
                <span>Rider Portal</span>
              </Link>
              <Link to="/how-it-works" className="quick-pill quick-pill-ghost">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <span>How It Works</span>
              </Link>
            </div>
          </div>

          {/* Trust Highlights Row with Clean SVG Icons */}
          <div className="hero-trust-row hero-trust-overlay">
            <div className="trust-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              <span>Instant dispatch assignment</span>
            </div>
            <div className="trust-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>Live status tracking</span>
            </div>
            <div className="trust-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>Secure doorstep verification</span>
            </div>
          </div>
        </div>
      </section>

      {/* How Reflex Works Section */}
      <section id="how-it-works" className="section-container">
        <div className="section-header">
          <span className="section-eyebrow">Simplicity First</span>
          <h2 className="section-title">How Reflex Works</h2>
          <p className="section-subtitle">
            From the moment your customer places an order to the final doorstep handover, Reflex keeps everyone aligned in three simple steps.
          </p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number-badge">1</div>
            <div className="step-icon-wrap" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            </div>
            <h3 className="step-title">Log Package Details</h3>
            <p className="step-desc">
              Enter customer name, phone number, destination landmark, and item description in the clean retailer portal.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number-badge">2</div>
            <div className="step-icon-wrap" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3 className="step-title">Instant Rider Dispatch</h3>
            <p className="step-desc">
              Your request is immediately captured and prioritized for dispatch to verified nearby motorcycle riders.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number-badge">3</div>
            <div className="step-icon-wrap" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="step-title">Live Delivery Visibility</h3>
            <p className="step-desc">
              Track status in real time from Pending to Assigned, Picked Up, and Delivered without chasing updates over the phone.
            </p>
          </div>
        </div>
      </section>

      {/* About Reflex Section */}
      <section id="about" className="section-alt-wrapper">
        <div className="section-container section-inner">
          <div className="about-grid">
            <div className="about-content">
              <span className="section-eyebrow">Why Reflex</span>
              <h2 className="section-title">Built specifically for Kenyan merchants</h2>
              <p className="about-text">
                Small retailers often lose hours every week coordinating customer orders through informal messaging, miscommunicated addresses, and uncertain courier timelines.
              </p>
              <p className="about-text">
                Reflex provides a dedicated, lightweight delivery coordination hub tailored to the reality of local retail operations: fast, reliable, and accessible on any smartphone or tablet.
              </p>

              <div className="about-feature-list">
                <div className="about-feature-item">
                  <div className="feature-check" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <strong>No upfront setup hardware:</strong> Works seamlessly directly in your mobile browser or as an installable PWA.
                  </div>
                </div>
                <div className="about-feature-item">
                  <div className="feature-check" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <strong>Landmark-friendly address input:</strong> Built for Kenyan addresses, building names, and estate landmarks.
                  </div>
                </div>
                <div className="about-feature-item">
                  <div className="feature-check" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <strong>Direct accountability:</strong> Clean records of all dispatched orders for reconciliation.
                  </div>
                </div>
              </div>
            </div>

            <div className="about-card-stat">
              <div className="stat-highlight-box">
                <div className="stat-big-number">100%</div>
                <div className="stat-big-label">Delivery Visibility</div>
                <p className="stat-subtext">Clear status updates from the minute you hit submit.</p>
              </div>
              <div className="stat-highlight-box stat-terracotta">
                <div className="stat-big-number">&lt; 30s</div>
                <div className="stat-big-label">To Log a Request</div>
                <p className="stat-subtext">Designed for busy shopkeepers during peak sales hours.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Become a Retailer Section */}
      <section id="retailers" className="section-container">
        <div className="callout-card retailer-callout">
          <div className="callout-content">
            <span className="callout-eyebrow">For Shop Owners &amp; Online Merchants</span>
            <h2 className="callout-title">Ready to streamline your customer deliveries?</h2>
            <p className="callout-desc">
              Start dispatching customer parcels today. No complex contracts, no tedious onboarding — open your retailer portal and submit your first delivery request right away.
            </p>
            <Link to="/retailer" className="btn-callout-primary">
              <span>Go to Retailer Portal</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
          <div className="callout-perks">
            <div className="perk-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Instant Request Logging</span>
            </div>
            <div className="perk-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Real-Time Order Queue</span>
            </div>
            <div className="perk-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Duplicate Submission Safety</span>
            </div>
            <div className="perk-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Mobile &amp; Tablet Friendly</span>
            </div>
          </div>
        </div>
      </section>

      {/* Become a Rider Section */}
      <section id="riders" className="section-container section-tight">
        <div className="callout-card rider-callout">
          <div className="callout-content">
            <span className="callout-eyebrow">For Delivery Couriers</span>
            <h2 className="callout-title">Deliver for local retailers across your city</h2>
            <p className="callout-desc">
              Get matched with steady parcel deliveries from clothing shops, electronics stores, and local retailers with transparent order details and customer contacts.
            </p>
            <div className="rider-action-row">
              <Link to="/how-it-works" className="btn-callout-secondary">
                Learn About Dispatch
              </Link>
              <span className="rider-note">Rider onboarding open across Nairobi</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-inner">
          <div className="footer-brand-col">
            <div className="brand-logo">
              <span className="brand-logo-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </span>
              <span className="brand-logo-text">Reflex</span>
            </div>
            <p className="footer-mission">
              Modern delivery tracking and coordination platform designed for small Kenyan retailers. Every delivery, one clear view.
            </p>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Platform</h4>
            <Link to="/retailer" className="footer-link">Retailer Portal</Link>
            <Link to="/how-it-works" className="footer-link">How It Works</Link>
            <Link to="/about" className="footer-link">About Reflex</Link>
            <Link to="/faqs" className="footer-link">FAQs</Link>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Community</h4>
            <Link to="/retailer" className="footer-link">For Retailers</Link>
            <Link to="/rider" className="footer-link">For Riders</Link>
            <span className="footer-badge">Nairobi, Kenya</span>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Operations</h4>
            <Link to="/dispatcher" className="footer-link-subtle">Dispatcher View</Link>
            <Link to="/rider" className="footer-link-subtle">Rider View</Link>
            <Link to="/admin" className="footer-link-subtle">Admin Portal</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Reflex Logistics. All rights reserved.</p>
          <p className="footer-bottom-tagline">Deliver without the delivery chaos.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
