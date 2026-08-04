import React from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter from '../common/AnimatedCounter';
import { Award, Shield, Globe } from 'lucide-react';
import './LongiTechHighlight.css';

const LongiTechHighlight = () => {
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section id="tech-highlight" className="tech-section">
      <div className="tech-container">
        
        {/* Tech Innovation Banner */}
        <div className="innovation-banner">
          <div className="innovation-content">
            <span className="inn-tag">Technology Innovation</span>
            <h3>Trison R&D Centers</h3>
            <p>
              Trison’s network of R&D centers focuses on solar wafer, cell, module and solutions technologies. Our strategic partnerships strengthen the cooperation among enterprises, universities and research institutes.
            </p>
            <motion.div 
              className="inn-stats-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
            >
              <motion.div className="inn-stat" variants={scaleIn}>
                <AnimatedCounter to={1000} suffix="+" duration={2.5} className="stat-value" />
                <span className="stat-label">Researchers</span>
              </motion.div>
              <motion.div className="inn-stat" variants={scaleIn}>
                <AnimatedCounter to={1090} prefix="$" suffix=" M" duration={2.5} className="stat-value" />
                <span className="stat-label">R&D Investment</span>
              </motion.div>
              <motion.div className="inn-stat" variants={scaleIn}>
                <AnimatedCounter to={1387} duration={2.5} className="stat-value" />
                <span className="stat-label">Patents</span>
              </motion.div>
              <motion.div className="inn-stat" variants={scaleIn}>
                <AnimatedCounter to={27.3} decimals={1} suffix="%" duration={2.5} className="stat-value" />
                <span className="stat-label">N-HJT Efficiency</span>
              </motion.div>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default LongiTechHighlight;
