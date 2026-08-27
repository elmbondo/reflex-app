import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="homepage-container">
      {/* Navigation Header */}
      <header className="home-nav">
        <div className="home-nav-inner">
          <Link to="/" className="brand-logo" aria-label="Reflex Home">
            <span className="brand-logo-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </span>
            <span className="brand-logo-text">Reflex</span>
          </Link>

          <nav className="nav-links" aria-label="Primary navigation">
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#retailers" className="nav-link">For Retailers</a>
            <a href="#riders" className="nav-link">For Riders</a>
          </nav>

          <div className="nav-actions">
            <Link to="/retailer" className="btn-nav-cta" id="nav-send-delivery-btn">
              <span>Send a Delivery</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
            <button
              className="btn-hamburger"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((v) => !v)}
              id="mobile-menu-btn"
            >
              {mobileMenuOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <nav className="mobile-drawer" aria-label="Mobile navigation">
            <a href="#how-it-works" className="mobile-nav-link" onClick={closeMobileMenu}>How It Works</a>
            <a href="#about" className="mobile-nav-link" onClick={closeMobileMenu}>About</a>
            <a href="#retailers" className="mobile-nav-link" onClick={closeMobileMenu}>For Retailers</a>
            <a href="#riders" className="mobile-nav-link" onClick={closeMobileMenu}>For Riders</a>
            <Link to="/retailer" className="mobile-nav-link mobile-nav-cta" onClick={closeMobileMenu}>Send a Delivery →</Link>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-pill">
              <span className="hero-pill-dot" aria-hidden="true"></span>
              Built for Kenyan Retailers & Merchants
            </div>
            <h1 className="hero-title">
              Deliver without the <span className="highlight-terracotta">delivery chaos.</span>
            </h1>
            <p className="hero-subtitle">
              Reflex helps small retail shops, boutiques, and merchants log customer delivery requests instantly and maintain clear, end-to-end visibility — no more messy WhatsApp chats or lost phone calls.
            </p>

            <div className="hero-cta-group">
              <Link to="/retailer" className="btn-hero-primary" id="hero-send-delivery-btn">
                <span>Send a Delivery</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
              <a href="#how-it-works" className="btn-hero-secondary">
                See How It Works
              </a>
            </div>

            {/* Quick Trust Highlights */}
            <div className="hero-trust-row">
              <div className="trust-item">
                <span className="trust-icon" aria-hidden="true">⚡</span>
                <span>Instant dispatch assignment</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon" aria-hidden="true">📍</span>
                <span>Live status visibility</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon" aria-hidden="true">📦</span>
                <span>Reliable doorstep handoffs</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-card">
              <img
                src="/images/reflex-hero-delivery.jpg"
                alt="Friendly Reflex delivery rider with parcel in Nairobi"
                className="hero-image"
                loading="eager"
              />
              <div className="floating-badge floating-badge-top">
                <div className="floating-badge-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <div className="floating-badge-title">Status: Pending → Assigned</div>
                  <div className="floating-badge-desc">Rider dispatched instantly</div>
                </div>
              </div>
              <div className="floating-badge floating-badge-bottom">
                <div className="floating-badge-icon badge-icon-warm" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <div className="floating-badge-title">Nairobi & Environs</div>
                  <div className="floating-badge-desc">Accurate landmark delivery</div>
                </div>
              </div>
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
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
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
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="12 6 12 12 16 14"></polygon>
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
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  <div className="feature-check" aria-hidden="true">✓</div>
                  <div>
                    <strong>No upfront setup hardware:</strong> Works seamlessly directly in your mobile browser or as an installable PWA.
                  </div>
                </div>
                <div className="about-feature-item">
                  <div className="feature-check" aria-hidden="true">✓</div>
                  <div>
                    <strong>Landmark-friendly address input:</strong> Built for Kenyan addresses, building names, and estate landmarks.
                  </div>
                </div>
                <div className="about-feature-item">
                  <div className="feature-check" aria-hidden="true">✓</div>
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
              <div className="stat-highlight-box stat-olive">
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
            <span className="callout-eyebrow">For Shop Owners & Online Merchants</span>
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
            <div className="perk-tag">✓ Instant Request Logging</div>
            <div className="perk-tag">✓ Real-Time Order Queue</div>
            <div className="perk-tag">✓ Duplicate Submission Safety</div>
            <div className="perk-tag">✓ Mobile & Tablet Friendly</div>
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
              <a href="#how-it-works" className="btn-callout-secondary">
                Learn About Dispatch
              </a>
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
            <a href="#how-it-works" className="footer-link">How It Works</a>
            <a href="#about" className="footer-link">About Reflex</a>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Community</h4>
            <a href="#retailers" className="footer-link">For Retailers</a>
            <a href="#riders" className="footer-link">For Riders</a>
            <span className="footer-badge">Nairobi, Kenya 🇰🇪</span>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Operations</h4>
            <Link to="/dispatcher" className="footer-link-subtle">Dispatcher View</Link>
            <Link to="/rider" className="footer-link-subtle">Rider View</Link>
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
