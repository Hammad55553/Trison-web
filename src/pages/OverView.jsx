import React, { useState, useEffect } from 'react';
import { ChevronDown, Layers, Zap, Scale, Box } from 'lucide-react';
import './OverView.css';

// Import local Bifacial 3D angles
import angle1Img from '../assets/images/3d/angle1.png';
import angle2Img from '../assets/images/3d/angle2.png';
import angle3Img from '../assets/images/3d/angle3.png';

// Import local Monofacial front/back images
import monoFrontImg from '../assets/images/mono_front.png';
import monoBackImg from '../assets/images/mono_back.png';

// Import solutions background image for the Hero
import solutionsBg from '../assets/images/pv_solutions.png';

const OverView = ({ productId }) => {
  const [activeAngle, setActiveAngle] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'detail'

  // Reset active angle when product changes to prevent index out of bounds
  useEffect(() => {
    setActiveAngle(0);
  }, [productId]);

  // Decide image angles list depending on selected product
  const isMonofacial = productId === 'hi-mo-5-monofacial';

  const angles = isMonofacial
    ? [
        {
          name: 'Front View (54-Cell Monofacial)',
          image: monoFrontImg,
        },
        {
          name: 'Rear Profile (54-Cell Monofacial)',
          image: monoBackImg,
        },
      ]
    : [
        {
          name: 'Front View (M10 Cell)',
          image: angle1Img,
        },
        {
          name: 'Rear Profile (Bifacial Glass)',
          image: angle2Img,
        },
        {
          name: 'Concentric Wafer Structure',
          image: angle3Img,
        },
      ];

  const faqs = [
    {
      q: "What applications are Trison's monocrystalline modules suited for?",
      a: "Trison modules are optimized for utility-scale ground stations, commercial complexes, and industrial rooftops where high durability and peak power density are required."
    },
    {
      q: "What are the advantages of Hi-MO monocrystalline plates in utility projects?",
      a: "They utilize gallium-doped silicon texturing which virtually eliminates initial degradation, alongside a bifacial layout that captures backside light reflections, boosting net generation."
    },
    {
      q: "Why is the 182 mm wafer size ideal for modern PV design?",
      a: "The 182 mm (M10) size optimizes module dimensions for container logistics and manual installation, while maintaining peak electrical compatibility with grid inverters."
    }
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 140; // accounted for sticky headers
      const bodyRect = document.body.getBoundingClientRect().top;
      const elRect = el.getBoundingClientRect().top;
      const offsetPosition = elRect - bodyRect - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const handleNextAngle = () => {
    setActiveAngle((prev) => (prev + 1) % angles.length);
  };

  const handlePrevAngle = () => {
    setActiveAngle((prev) => (prev - 1 + angles.length) % angles.length);
  };

  return (
    <div className="overview-page">

      {/* Product Hero Banner (Background image + clean specs overlay) */}
      <section
        id="overview-hero"
        className="product-hero-sec"
        style={{ backgroundImage: `linear-gradient(to right, rgba(11, 11, 38, 0.95) 30%, rgba(11, 11, 38, 0.7) 100%), url(${solutionsBg})` }}
      >
        <div className="product-hero-container">
          <div className="product-info-col">
            <span className="brand-pill">Est. 2007 · Tier 1 Manufacture</span>
            <h1>Trison Hi-MO Monocrystalline Plate</h1>
            <p className="product-tagline">
              Delivering high-efficiency power outputs with double-glass bifacial monocrystalline silicon cells.
            </p>

            {/* Quick Specs Cards */}
            <div className="product-quick-specs">
              <div className="spec-card">
                <span className="spec-val">555<span className="spec-unit">W</span></span>
                <span className="spec-label">Module Power</span>
              </div>
              <div className="spec-card">
                <span className="spec-val">21.5<span className="spec-unit">%</span></span>
                <span className="spec-label">Module Efficiency</span>
              </div>
              <div className="spec-card">
                <span className="spec-val">12<span className="spec-unit">Yrs</span></span>
                <span className="spec-label">Product Warranty</span>
              </div>
              <div className="spec-card">
                <span className="spec-val">30<span className="spec-unit">Yrs</span></span>
                <span className="spec-label">Power Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Sub-navigation Bar */}
      <div className="product-sub-nav">
        <div className="sub-nav-container">
          <button onClick={() => scrollToSection('overview-hero')}>Overview</button>
          <button onClick={() => scrollToSection('parameter-interactive-sec')}>Core Parameters</button>
          <button onClick={() => scrollToSection('technical-specs')}>Specifications</button>
          <button onClick={() => scrollToSection('faqs-sec')}>FAQs</button>
        </div>
      </div>

      {/* Core Highlights & Interactive 3D Selector Section (LONGi Style) */}
      <section id="parameter-interactive-sec" className="parameter-interactive-section">
        <div className="parameter-container">
          
          {/* Tabs header */}
          <div className="parameter-tabs">
            <button 
              className={`param-tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
              onClick={() => setActiveTab('basic')}
            >
              Basic Parameters
            </button>
            <button 
              className={`param-tab-btn ${activeTab === 'detail' ? 'active' : ''}`}
              onClick={() => setActiveTab('detail')}
            >
              Detail Parameters
            </button>
          </div>

          {/* Interactive parameter grid */}
          <div className="parameter-interactive-grid">
            
            {/* Left Column: Feature cards */}
            <div className="param-column column-left">
              <div className="param-feature-card">
                <div className="param-icon-wrapper">
                  <Layers size={24} />
                </div>
                <h3>Optimized Electrical Parameters</h3>
                <p>The working current is about 13A, which is perfectly adapted to mainstream string inverters.</p>
              </div>

              <div className="param-feature-card">
                <div className="param-icon-wrapper">
                  <Zap size={24} />
                </div>
                <h3>Gallium-doped Technology</h3>
                <p>Gallium-doped technology overcomes LID degradation and guarantees the long-term power generation of the module.</p>
              </div>
            </div>

            {/* Center Column: 3D plate image & Flipped SVG curved buttons */}
            <div className="param-column column-center">
              
              {/* Left Rotate Button (Flipped curved arrow) */}
              <button 
                className="rotate-arrow-btn left-arrow" 
                onClick={handlePrevAngle}
                aria-label="Previous view"
              >
                <svg width="17" height="19" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scaleX(-1)', width: '22px', height: '22px' }}>
                  <path d="M2 3C10.9623 5.39198 16 8.08666 16 10.9369C16 13.4452 12.0987 15.833 5.05455 18" stroke="currentColor" strokeWidth="2"></path>
                  <path d="M4.01774 8.06208L2 2.76552L7.04434 1" stroke="currentColor" strokeWidth="2"></path>
                </svg>
              </button>

              {/* Central Plate Viewer */}
              <div className="center-plate-box">
                <img
                  key={activeAngle}
                  src={angles[activeAngle].image}
                  alt={angles[activeAngle].name}
                  className="interactive-plate-img animated-slide-in"
                />
                <span className="plate-badge">{angles[activeAngle].name}</span>
              </div>

              {/* Right Rotate Button (Original curved arrow) */}
              <button 
                className="rotate-arrow-btn right-arrow" 
                onClick={handleNextAngle}
                aria-label="Next view"
              >
                <svg width="17" height="19" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '22px', height: '22px' }}>
                  <path d="M2 3C10.9623 5.39198 16 8.08666 16 10.9369C16 13.4452 12.0987 15.833 5.05455 18" stroke="currentColor" strokeWidth="2"></path>
                  <path d="M4.01774 8.06208L2 2.76552L7.04434 1" stroke="currentColor" strokeWidth="2"></path>
                </svg>
              </button>

            </div>

            {/* Right Column: Feature cards */}
            <div className="param-column column-right">
              <div className="param-feature-card">
                <div className="param-icon-wrapper">
                  <Scale size={24} />
                </div>
                <h3>Optimized Module Size</h3>
                <p>Large-format modules with M10 wafer size use dual-glass and frame packaging to ensure module strength.</p>
              </div>

              <div className="param-feature-card">
                <div className="param-icon-wrapper">
                  <Box size={24} />
                </div>
                <h3>Smart Packaging & Logistics</h3>
                <p>Smart module packaging solutions are used to achieve high reliability, low-cost transportation and logistics.</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Technical Specifications */}
      <section id="technical-specs" className="specs-sec">
        <div className="specs-container">
          <div className="section-title-box">
            <span className="section-badge">Datasheet</span>
            <h2>Technical Parameters</h2>
          </div>
          <div className="specs-detail-grid">
            {/* Table 1: Electrical */}
            <div className="detail-table-card">
              <h3>Electrical Characteristics</h3>
              <table className="detail-table">
                <tbody>
                  <tr>
                    <td>Maximum Power (Pmax)</td>
                    <td><strong>555W</strong></td>
                  </tr>
                  <tr>
                    <td>Open Circuit Voltage (Voc)</td>
                    <td><strong>{activeTab === 'basic' ? '49.8V' : '50.1V'}</strong></td>
                  </tr>
                  <tr>
                    <td>Short Circuit Current (Isc)</td>
                    <td><strong>{activeTab === 'basic' ? '13.98A' : '14.05A'}</strong></td>
                  </tr>
                  <tr>
                    <td>Maximum Power Voltage (Vmp)</td>
                    <td><strong>{activeTab === 'basic' ? '42.1V' : '42.3V'}</strong></td>
                  </tr>
                  <tr>
                    <td>Maximum Power Current (Imp)</td>
                    <td><strong>13.18A</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Table 2: Mechanical */}
            <div className="detail-table-card">
              <h3>Mechanical Specifications</h3>
              <table className="detail-table">
                <tbody>
                  <tr>
                    <td>Cell Dimensions</td>
                    <td><strong>182 x 182 mm</strong></td>
                  </tr>
                  <tr>
                    <td>Module Layout</td>
                    <td><strong>144 cells (6 x 24)</strong></td>
                  </tr>
                  <tr>
                    <td>Weight</td>
                    <td><strong>32.3 kg</strong></td>
                  </tr>
                  <tr>
                    <td>Glass Construction</td>
                    <td><strong>Dual Glass, 2.0 mm thickness</strong></td>
                  </tr>
                  <tr>
                    <td>Junction Box Protection</td>
                    <td><strong>IP68 rated</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs-sec" className="faqs-sec-container">
        <div className="faqs-container">
          <div className="section-title-box">
            <span className="section-badge">FAQ</span>
            <h2>Product Help & FAQs</h2>
          </div>
          <div className="faqs-accordion-list">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className={`faq-accordion-item ${activeFaq === idx ? 'expanded' : ''}`}
                onClick={() => toggleFaq(idx)}
              >
                <div className="faq-question-bar">
                  <span>{faq.q}</span>
                  <ChevronDown className="faq-chevron" size={18} />
                </div>
                <div className="faq-answer-bar">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OverView;