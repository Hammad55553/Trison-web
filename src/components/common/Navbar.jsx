import React, { useState, useEffect } from 'react';
import { Menu, X, PhoneCall, ShieldCheck } from 'lucide-react';
import trisonLogo from '../../assets/images/TRISON.jpg';
import './Navbar.css';

const Navbar = ({ currentView, onViewChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navigateToHomeSection = (sectionId) => {
    setIsOpen(false);
    
    // If not in home view, switch to home first
    if (currentView !== 'home') {
      onViewChange('home');
      // Give a tiny timeout for DOM to mount home sections
      setTimeout(() => {
        scrollToElement(sectionId);
      }, 100);
    } else {
      scrollToElement(sectionId);
    }
  };

  const navigateToVerifier = () => {
    setIsOpen(false);
    onViewChange('verifier');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPartner = () => {
    setIsOpen(false);
    onViewChange('partner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToModules = () => {
    setIsOpen(false);
    onViewChange('modules');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAbout = () => {
    setIsOpen(false);
    onViewChange('about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToElement = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="navbar-logo" onClick={() => navigateToHomeSection('hero')}>
          <img src={trisonLogo} alt="Trison" className="logo-img" />
        </div>

        {/* Desktop Links */}
        <div className="navbar-links">
          <button onClick={() => navigateToHomeSection('hero')} className={`nav-link ${currentView === 'home' ? 'active' : ''}`}>Home</button>
          <button onClick={navigateToModules} className={`nav-link ${currentView === 'modules' ? 'active' : ''}`}>Products & Solutions</button>
          <button onClick={navigateToAbout} className={`nav-link ${currentView === 'about' ? 'active' : ''}`}>About Trison</button>
          <button onClick={navigateToVerifier} className={`nav-link ${currentView === 'verifier' ? 'active' : ''}`}>
            <ShieldCheck size={14} style={{ marginRight: '4px', display: 'inline' }} /> Verify Panel
          </button>
          <button onClick={navigateToPartner} className={`nav-link ${currentView === 'partner' ? 'active' : ''}`}>Global Inquiry</button>
          <button onClick={navigateToPartner} className="btn-nav">
            <PhoneCall size={16} /> Contact Us
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <button className="mobile-toggle" onClick={toggleMenu} aria-label="Toggle navigation menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-drawer ${isOpen ? 'drawer-open' : ''}`}>
        <button onClick={() => navigateToHomeSection('hero')} className="drawer-link">Home</button>
        <button onClick={navigateToModules} className="drawer-link">Products & Solutions</button>
        <button onClick={navigateToAbout} className="drawer-link">About Trison</button>
        <button onClick={navigateToVerifier} className="drawer-link">Verify Panel</button>
        <button onClick={navigateToPartner} className="drawer-link">Global Inquiry</button>
        <button onClick={navigateToPartner} className="btn-drawer">
          <PhoneCall size={16} /> Contact Us
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
