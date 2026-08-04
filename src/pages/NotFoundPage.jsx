import React from 'react';
import { ArrowLeft, ZapOff } from 'lucide-react';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <div className="notfound-animation-container">
          <div className="solar-core"></div>
          <div className="orbit orbit-1"></div>
          <div className="orbit orbit-2"></div>
          <div className="orbit orbit-3"></div>
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <ZapOff size={40} className="notfound-icon-center" />
        </div>
        <h1 className="notfound-title">404</h1>
        <h2 className="notfound-subtitle">Energy Depleted. Page Not Found.</h2>
        <p className="notfound-text">
          We couldn't find the page you're looking for. It might have been moved, renamed, or perhaps the connection was lost in the grid.
        </p>
        <a href="/" className="notfound-button">
          <ArrowLeft size={20} />
          Return to Home
        </a>
      </div>
      
      {/* Background glowing effects */}
      <div className="notfound-glow-1"></div>
      <div className="notfound-glow-2"></div>
    </div>
  );
};

export default NotFoundPage;
