import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Zap, Landmark, Award, ShieldAlert, Cpu } from 'lucide-react';
import './ModulesPage.css';

// Import images
import solutionsBg from '../assets/images/pv_solutions.webp';
import monoFrontImg from '../assets/images/mono_front.webp';
import bifacialFrontImg from '../assets/images/3d/angle1.webp';
// Exploded view image (User uploaded)
import explodedViewImg from '../assets/images/exploded_view.webp';

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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="modules-page">

      {/* Hero Header */}
      <section 
        className="modules-hero"
        style={{ backgroundImage: `linear-gradient(to right, rgba(11, 11, 38, 0.95) 30%, rgba(11, 11, 38, 0.7) 100%), url(${solutionsBg})` }}
      >
        <motion.div 
          className="modules-hero-container"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <span className="hero-category">Silicon Solar Wafer & Wafer Modules</span>
          <h1>US-Assembled Modules & Domestic Content Cells</h1>
          <p>
            Trison supplies high-efficiency solar modules with a traceable supply chain and regions to power the world toward a low-carbon future.
          </p>
        </motion.div>
      </section>

      {/* Exploded View / Panel Anatomy Section */}
      <section className="exploded-view-section" style={{ padding: '80px 24px', backgroundColor: '#ffffff', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <span className="section-badge" style={{ display: 'inline-block', marginBottom: '12px', padding: '6px 12px', backgroundColor: '#f1f5f9', color: '#0ea5e9', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600 }}>Anatomy</span>
            <h2 style={{ fontSize: '2.5rem', color: '#0f172a', marginBottom: '40px' }}>Trison Solar Panel Assembly</h2>
            <div style={{ 
              backgroundColor: '#f8fafc', 
              padding: '40px', 
              borderRadius: '24px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
              border: '1px solid #e2e8f0'
            }}>
              <img
                src={explodedViewImg}
                alt="Solar Panel Exploded View"
                loading="lazy"
                decoding="async"
                style={{ width: '100%', maxWidth: '900px', height: 'auto', display: 'block', margin: '0 auto' }}
                onError={(e) => { e.target.src = 'https://dummyimage.com/1200x800/f8fafc/0f172a&text=Save+your+image+as+exploded_view.png+in+src/assets/images/'; }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modules Catalog Section */}
      <section className="catalog-section">
        <div className="catalog-container">
          <motion.div 
            className="catalog-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <span className="section-badge">Main Products</span>
            <h2>Trison High-Efficiency Solar Modules</h2>
          </motion.div>

          <motion.div 
            className="products-list-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
          {products.map((prod) => (
              <motion.div className="product-catalog-card" key={prod.id} variants={fadeInUp}>
                {/* Product image */}
                <div className="product-catalog-img-box">
                  <img src={prod.image} alt={prod.title} className="product-catalog-img" loading="lazy" decoding="async" />
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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Supply Chain & Rating Info Banner */}
      <section className="info-banners-section">
        <motion.div 
          className="info-banners-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.div className="info-grid-card" variants={scaleIn}>
            <h3>Traceable Supply Chain</h3>
            <p>
              Trison and Western Silicon Metal producers have entered into long-term metallurgical grade silicon MGS agreements. This consolidates traceable supply chains to ensure high quality materials are procured responsibly for all module lines.
            </p>
          </motion.div>
          <motion.div className="info-grid-card rating-card" variants={scaleIn}>
            <Award className="rating-award-icon" size={32} />
            <h3>AAA PV Module Tech Bankability Rating</h3>
            <p>
              Trison has consistently retained high bankability scores in global PV Module Tech bankability ratings, reflecting continuous excellence and market supply leadership.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Technology Leadership */}
      <section className="tech-leadership-section">
        <div className="tech-leadership-container">
          <motion.div 
            className="section-title-box"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <span className="section-badge">R&D Innovation</span>
            <h2>Technology Leadership</h2>
            <p>Reliable, top-quality, high-performance solar innovation from Trison.</p>
          </motion.div>

          <motion.div 
            className="tech-cards-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
          {technologies.map((tech, index) => (
              <motion.div className="tech-card-item" key={index} variants={fadeInUp}>
                <div className="tech-icon-circle">{tech.icon}</div>
                <h3>{tech.title}</h3>
                <p>{tech.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Successful Cases */}
      <section className="cases-section">
        <div className="cases-container">
          <motion.div 
            className="section-title-box"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <span className="section-badge">Global Performance</span>
            <h2>Successful Project Cases</h2>
            <p>Our high-efficiency modules are installed widely across utility, commercial, and residential fields globally.</p>
          </motion.div>

          <motion.div 
            className="cases-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {cases.map((cs, index) => (
              <motion.div className="case-item-card" key={index} variants={scaleIn}>
                <span className="case-location">{cs.loc}</span>
                <h4>{cs.title}</h4>
                <div className="case-stat">
                  <span className="case-val">{cs.capacity}</span>
                  <span className="case-label">{cs.label}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ModulesPage;
