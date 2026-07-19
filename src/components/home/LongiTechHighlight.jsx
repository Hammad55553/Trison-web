import React from 'react';
import { Award, Shield, Globe } from 'lucide-react';
import './LongiTechHighlight.css';

const LongiTechHighlight = () => {
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
            <div className="inn-stats-grid">
              <div className="inn-stat">
                <span className="stat-value">1,000+</span>
                <span className="stat-label">Researchers</span>
              </div>
              <div className="inn-stat">
                <span className="stat-value">$1,090 M</span>
                <span className="stat-label">R&D Investment</span>
              </div>
              <div className="inn-stat">
                <span className="stat-value">1,387</span>
                <span className="stat-label">Patents</span>
              </div>
              <div className="inn-stat">
                <span className="stat-value">27.3%</span>
                <span className="stat-label">N-HJT Efficiency</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default LongiTechHighlight;
