import React from 'react';
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

  return (
    <section id="solutions" className="solutions-section">
      <div className="solutions-container">
        <div className="solutions-title-block">
          <h2>Trison PV Solutions</h2>
          <p>
            Trison provides a comprehensive suite of solar PV modules and solutions that can optimize a wide range of global project applications.
          </p>
        </div>

        <div className="solutions-grid-layout">
          {solutions.map((item, idx) => (
            <div className="solution-item-card" key={idx}>
              <div className="sol-icon-box">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <span className="sol-tag-badge">{item.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solutions;
