import React from 'react';
import { Globe } from 'lucide-react';
import './ESG.css';

const ESG = () => {
  return (
    <section id="esg" className="esg-section">
      <div className="esg-container">
        <div className="esg-card-layout">
          <div className="esg-icon-wrapper-box">
            <Globe className="esg-main-icon" />
          </div>
          <div className="esg-text-box">
            <span className="esg-tag">Sustainability Focus</span>
            <h3>Environmental, Social & Corporate Governance (ESG)</h3>
            <p>
              The Trison team is committed to providing innovative solar wafer, cell, and module solutions that help make the world a healthier, safer, and more sustainable place. We value our role in the global business community and honor our obligation to pursue the highest standards of environmental responsibility and transparent governance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ESG;
