import React from 'react';
import { motion } from 'framer-motion';
import headerBg from '../../assets/images/solar_network_nodes.webp';
import './GenericInfoPage.css';

const GenericInfoPage = ({ title, subtitle, children, headerImage }) => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const bgImg = headerImage || headerBg;

  return (
    <div className="generic-info-page">
      
      {/* Premium Hero Banner */}
      <section 
        className="generic-hero-section"
        style={{ 
          backgroundImage: `linear-gradient(135deg, rgba(14, 165, 233, 0.4) 0%, rgba(15, 23, 42, 0.7) 100%), url(${bgImg})`
        }}
      >
        {/* Network Node Pattern Overlay (simulating tech nodes) */}
        <div className="generic-hero-overlay"></div>

        <motion.div 
          className="generic-hero-content"
          initial="hidden" 
          animate="visible" 
          variants={fadeInUp} 
        >
          <h1 className="generic-hero-title">{title}</h1>
          {subtitle && <p className="generic-hero-subtitle">{subtitle}</p>}
        </motion.div>
      </section>

      {/* Main Content Area with Glassmorphism */}
      <section className="generic-content-section">
        <motion.div 
          className="generic-content-card"
          initial="hidden" 
          animate="visible" 
          variants={fadeInUp} 
        >
          {children}
        </motion.div>
      </section>
    </div>
  );
};

export default GenericInfoPage;
