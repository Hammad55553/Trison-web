import React from 'react';
import { Layers, Zap, Landmark, Award, ShieldAlert, Cpu } from 'lucide-react';
import './ModulesPage.css';

// Import images
import solutionsBg from '../assets/images/pv_solutions.png';
import monoFrontImg from '../assets/images/mono_front.png';
import bifacialFrontImg from '../assets/images/3d/angle1.png';

const ModulesPage = ({ onViewChange, setSelectedProduct }) => {
  const navigateToProduct = (productId) => {
    setSelectedProduct(productId);
    onViewChange('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const products = [
    {
      id: 'hi-mo-5-monofacial',
      title: 'Hi-MO 5 Monofacial: Best Choice for Rooftop Systems',
      image: monoFrontImg,
      badge: 'Residential & Commercial',
      features: [
        'M10 wafer and 54 cell design',
        'Working current of ~13A (optimizer ready)',
        'Ideal for private, residential, and C&I configurations'
      ]
    },
    {
      id: 'hi-mo-5-bifacial',
      title: 'Hi-MO 5 Bifacial: Shaping the Future of Solar',
      image: bifacialFrontImg,
      badge: 'Utility-Scale Generation',
      features: [
        'Optimized for utility-scale ground stations',
        'Bifacial PERC with high backside reflection gain',
        'M10 Ga-doped wafer & Smart Multi-Busbar (SMBB)'
      ]
    }
  ];

  const technologies = [
    {
      title: 'HPDC Cell Technology',
      desc: 'HPDC stands for High Performance and Hybrid Passivated Dual-Junction Cell. The cell adopts high and low junctions, achieving excellent passivation effects and reduced light absorption. An upgraded low-resistance layer at the front further enhances conversion efficiency, delivering superior temperature coefficients and high reliability.',
      icon: <Cpu size={24} />
    },
    {
      title: 'PERC Technology Wafers',
      desc: 'PERC cells improve efficiency by depositing additional passive coating and laser grooves. Trison mono-PERC cells integrate advanced passivation on monocrystalline silicon with low light degradation, pushing cell efficiencies up from 21% to 24.4% in mass production.',
      icon: <Layers size={24} />
    },
    {
      title: 'Bifacial Power PV',
      desc: 'Bifacial modules collect solar energy from both the front and back side of the module, increasing the total power output per module. Trison has scaled up volume manufacturing of bifacial modules to support massive grid-connected utility installations worldwide.',
      icon: <Zap size={24} />
    }
  ];

  const cases = [
    {
      title: 'Vietnam Solar Power Station Project',
      loc: 'Ninh Thuan, Vietnam',
      capacity: '50 MW',
      label: 'Capacity'
    },
    {
      title: 'South Korea PV Power Station Project',
      loc: 'Gimcheon, South Korea',
      capacity: '0.80 MW',
      label: 'Capacity'
    },
    {
      title: 'Chakwal Cement Plant Phase II Pakistan',
      loc: 'Chakwal, Punjab, Pakistan',
      capacity: '15.21 MW',
      label: 'Project Capacity'
    }
  ];

  return (
    <div className="modules-page">

      {/* Hero Header */}
      <section 
        className="modules-hero"
        style={{ backgroundImage: `linear-gradient(to right, rgba(11, 11, 38, 0.95) 30%, rgba(11, 11, 38, 0.7) 100%), url(${solutionsBg})` }}
      >
        <div className="modules-hero-container">
          <span className="hero-category">Silicon Solar Wafer & Wafer Modules</span>
          <h1>US-Assembled Modules & Domestic Content Cells</h1>
          <p>
            Trison supplies high-efficiency solar modules with a traceable supply chain and regions to power the world toward a low-carbon future.
          </p>
        </div>
      </section>

      {/* Modules Catalog Section */}
      <section className="catalog-section">
        <div className="catalog-container">
          <div className="catalog-header">
            <span className="section-badge">Main Products</span>
            <h2>Trison High-Efficiency Solar Modules</h2>
          </div>

          <div className="products-list-grid">
            {products.map((prod) => (
              <div className="product-catalog-card" key={prod.id}>
                {/* Product image */}
                <div className="product-catalog-img-box">
                  <img src={prod.image} alt={prod.title} className="product-catalog-img" />
                </div>
                {/* Product details */}
                <div className="product-catalog-info">
                  <span className="product-badge">{prod.badge}</span>
                  <h3>{prod.title}</h3>
                  <ul className="product-feature-list">
                    {prod.features.map((feat, index) => (
                      <li key={index}>{feat}</li>
                    ))}
                  </ul>
                  <button 
                    className="btn-product-explore"
                    onClick={() => navigateToProduct(prod.id)}
                  >
                    Product Details &gt;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supply Chain & Rating Info Banner */}
      <section className="info-banners-section">
        <div className="info-banners-container">
          <div className="info-grid-card">
            <h3>Traceable Supply Chain</h3>
            <p>
              Trison and Western Silicon Metal producers have entered into long-term metallurgical grade silicon MGS agreements. This consolidates traceable supply chains to ensure high quality materials are procured responsibly for all module lines.
            </p>
          </div>
          <div className="info-grid-card rating-card">
            <Award className="rating-award-icon" size={32} />
            <h3>AAA PV Module Tech Bankability Rating</h3>
            <p>
              Trison has consistently retained high bankability scores in global PV Module Tech bankability ratings, reflecting continuous excellence and market supply leadership.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Leadership */}
      <section className="tech-leadership-section">
        <div className="tech-leadership-container">
          <div className="section-title-box">
            <span className="section-badge">R&D Innovation</span>
            <h2>Technology Leadership</h2>
            <p>Reliable, top-quality, high-performance solar innovation from Trison.</p>
          </div>

          <div className="tech-cards-grid">
            {technologies.map((tech, index) => (
              <div className="tech-card-item" key={index}>
                <div className="tech-icon-circle">{tech.icon}</div>
                <h3>{tech.title}</h3>
                <p>{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Successful Cases */}
      <section className="cases-section">
        <div className="cases-container">
          <div className="section-title-box">
            <span className="section-badge">Global Performance</span>
            <h2>Successful Project Cases</h2>
            <p>Our high-efficiency modules are installed widely across utility, commercial, and residential fields globally.</p>
          </div>

          <div className="cases-grid">
            {cases.map((cs, index) => (
              <div className="case-item-card" key={index}>
                <span className="case-location">{cs.loc}</span>
                <h4>{cs.title}</h4>
                <div className="case-stat">
                  <span className="case-val">{cs.capacity}</span>
                  <span className="case-label">{cs.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModulesPage;
