import React from 'react';
import { motion } from 'framer-motion';
import { Landmark, Zap, Shield, Sun } from 'lucide-react';
import './Solutions.css';

const Solutions = () => {
  const solutions = [
    {
      title: 'Utility-Scale Solar',
      desc: 'Double-glass bifacial monocrystalline modules designed to optimize power yield for massive grid installations.',
      tag: '660W+ Max Yield Class',
      icon: <Landmark className="sol-icon" />
    },
    {
      title: 'Commercial & Industrial',
      desc: 'Optimized module arrays and roof installations offering peak structural protection and load performance.',
      tag: '23.0% Efficiency Class',
      icon: <Zap className="sol-icon" />
    },
    {
      title: 'Residential Rooftops',
      desc: 'Pure obsidian back-contact cells offering beautiful integration and premium aesthetics for residential roofs.',
      tag: '22.8% Aesthetic Class',
      icon: <Sun className="sol-icon" />
    },
    {
      title: 'Hydrogen Energy',
      desc: 'Integrating green solar plate energy with water electrolyzers to power carbon-neutral hydrogen generation.',
      tag: 'Zero-Emission Fuel',
      icon: <Shield className="sol-icon" />
    }
  ];

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section id="solutions" className="solutions-section">
      <div className="solutions-container">
        <motion.div 
          className="solutions-title-block"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <h2>Trison PV Solutions</h2>
          <p>
            Trison provides a comprehensive suite of solar PV modules and solutions that can optimize a wide range of global project applications.
          </p>
        </motion.div>

        <motion.div 
          className="solutions-grid-layout"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {solutions.map((item, idx) => (
            <motion.div 
              className="solution-item-card" 
              key={idx} 
              variants={idx % 2 === 0 ? slideInLeft : slideInRight}
            >
              <div className="sol-icon-box">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <span className="sol-tag-badge">{item.tag}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Solutions;
