import React from 'react';
import trisonLogo from '../../assets/images/TRISON.jpg';
import './Footer.css';

const Footer = ({ onViewChange }) => {
  const navigateToHomeSection = (sectionId) => {
    onViewChange('home');
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }, 100);
  };

  const navigateToVerifier = () => {
    onViewChange('verifier');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPartner = () => {
    onViewChange('partner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToModules = () => {
    onViewChange('modules');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAbout = () => {
    onViewChange('about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Col */}
        <div className="footer-brand">
          <div className="footer-logo" onClick={() => navigateToHomeSection('hero')}>
            <img src={trisonLogo} alt="Trison" className="logo-img-footer" />
          </div>
          <p className="footer-desc">
            A premier global Tier-1 solar cell and plate manufacturer founded in 2007 in China. Delivering leading PV module technology with verified lifespan yields.
          </p>
          <div className="social-links">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </div>

        {/* Quick Links Col */}
        <div className="footer-links-col">
          <h4>Navigation</h4>
          <button onClick={() => navigateToHomeSection('hero')}>Home</button>
          <button onClick={navigateToModules}>Products & Solutions</button>
          <button onClick={navigateToAbout}>About Trison</button>
          <button onClick={navigateToVerifier}>Verify Panel</button>
          <button onClick={navigateToPartner}>Global Inquiry</button>
        </div>

        {/* Services Col */}
        <div className="footer-links-col">
          <h4>Solar Solutions</h4>
          <span>Silicon Cell Manufacturing</span>
          <span>Utility Bifacial Modules</span>
          <span>C&I Monocrystalline Plates</span>
          <span>N-Type TOPCon Technology</span>
        </div>

        {/* Legal Col */}
        <div className="footer-links-col">
          <h4>Security & Support</h4>
          <span>25-Year Panel Warranty</span>
          <span>10-Year Inverter Warranty</span>
          <span>Terms & Conditions</span>
          <span>Privacy Policy</span>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Trison. All rights reserved. Created with premium craftsmanship.</p>
      </div>
    </footer>
  );
};

export default Footer;
