import React from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter from '../components/common/AnimatedCounter';
import { DollarSign, Calendar, Globe, Award, ShieldCheck, CheckCircle, TrendingUp } from 'lucide-react';
import './AboutUsPage.css';

// Import images
import buildingBg from '../assets/images/bilding.webp';
import waferSlicingImg from '../assets/images/silicon_wafer.webp';
import rczImg from '../assets/images/pv_module.webp';
import solutionsBg from '../assets/images/pv_solutions.webp';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const AboutUsPage = () => {
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

  const milestones = [
    { year: '2007', event: 'Trison was established in China, focusing on monocrystalline wafer production.' },
    { year: '2013', event: 'Scaled up production of Ga-doped wafers and launched global cell supply.' },
    { year: '2019', event: 'Secured Tier 1 status with cumulative solar shipments exceeding 20GW.' },
    { year: '2025', event: 'Announced 35.5% efficiency record for crystalline silicon-perovskite tandem cells.' }
  ];

  const innovations = [
    { title: 'RCZ Technology', desc: 'Pulling monocrystalline ingots with repeated recharge Czochralski method to lower costs.' },
    { title: 'Diamond Wire Slicing', desc: 'Pioneered thin-wafer diamond wire cutting layouts to minimize kerf loss.' },
    { title: 'PERC Cell Passivation', desc: 'Deploying backend passivation layer to maximize light absorption efficiency.' },
    { title: 'Bifacial Double-Glass', desc: 'Robust back-facing double glass packages to capture clean albedo energy.' }
  ];

  return (
    <div className="about-page">

      {/* Hero Banner */}
      <section 
        id="about-hero" 
        className="about-hero-sec"
        style={{ backgroundImage: `url(${buildingBg})` }}
      >
        <motion.div 
          className="about-hero-container"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <span className="hero-badge">About Trison</span>
          <h1>We are committed to being the most valuable solar technology company in the world.</h1>
        </motion.div>
      </section>



      {/* Corporate Profile section */}
      <section id="about-profile" className="profile-section">
        <div className="profile-container">
          <div className="profile-grid-cols">
            
            {/* Left Description */}
            <motion.div 
              className="profile-desc-col"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUp}
            >
              <span className="section-badge">Who We Are</span>
              <h2>Leading the Energy Transition Since 2007</h2>
              <p>
                Founded in 2007, Trison is committed to being the world’s leading solar technology company, focusing on customer-driven value creation for full scenario energy transformation.
              </p>
              <p>
                Under its mission of “making the best of solar energy to build a green world” and brand positioning of “the most trusted, reliable solar company that blazes the trail for green technology”, Trison has dedicated itself to technology innovation and established robust business lines covering monocrystalline silicon wafers, silicon cells, modules, and distributed PV solutions.
              </p>
            </motion.div>

            {/* Right Quick Stats Grid */}
            <motion.div 
              className="profile-stats-col"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
            >
              <motion.div className="profile-stat-box" variants={scaleIn}>
                <div className="stat-icon-wrap"><DollarSign size={24} /></div>
                <div>
                  <h4>$ 18.28 Billion</h4>
                  <p>Operating Income</p>
                </div>
              </motion.div>

              <motion.div className="profile-stat-box" variants={scaleIn}>
                <div className="stat-icon-wrap"><Calendar size={24} /></div>
                <div>
                  <h4>2007</h4>
                  <p>Foundation Year</p>
                </div>
              </motion.div>

              <motion.div className="profile-stat-box" variants={scaleIn}>
                <div className="stat-icon-wrap"><Globe size={24} /></div>
                <div>
                  <h4>30+ Countries</h4>
                  <p>Global Network</p>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Robust and Reliable Bankability Rating Banner */}
      <section className="bankability-banner">
        <div className="bankability-container">
          <motion.div 
            className="bankability-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <span className="section-badge">Market Strength</span>
            <h2>Robust and Reliable Bankability</h2>
            <p>Trison is consistently recognized as an elite cleantech supplier by global rating organizations.</p>
          </motion.div>
          
          <motion.div 
            className="bankability-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.div className="bankability-card" variants={scaleIn}>
              <h3>AAA</h3>
              <p>PV Module Tech Bankability Rating</p>
            </motion.div>
            <motion.div className="bankability-card" variants={scaleIn}>
              <h3>100%</h3>
              <p>Bankable PV Module Brand Score</p>
            </motion.div>
            <motion.div className="bankability-card" variants={scaleIn}>
              <h3>First Class</h3>
              <p>Tier 1 PV Module Manufacturers List</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Milestones Section */}
      <section id="milestones-sec" className="milestones-section">
        <div className="milestones-container">
          <motion.div 
            className="section-title-box"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <span className="section-badge">History</span>
            <h2>Key Milestones</h2>
          </motion.div>
          
          <motion.div 
            className="milestones-timeline-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {milestones.map((item, idx) => (
              <motion.div className="timeline-node-card" key={idx} variants={fadeInUp}>
                <span className="node-year">{item.year}</span>
                <p>{item.event}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Technology and Innovation */}
      <section id="innovation-sec" className="innovation-section">
        <div className="innovation-container">
          
          <motion.div 
            className="innovation-headline-box"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <div className="headline-text">
              <span className="section-badge">R&D Leadership</span>
              <h2>Technology & Innovation</h2>
              <p>Focusing on long-term efficiency upgrades and manufacturing engineering breakthroughs.</p>
            </div>
            <div className="headline-stats">
              <div className="head-stat-item">
                <AnimatedCounter to={2879} suffix="+" duration={2.5} />
                <p>Granted Patents</p>
              </div>
              <div className="head-stat-item">
                <AnimatedCounter to={1090} prefix="$" suffix="M" duration={2.5} />
                <p>R&D Investment</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="innovation-grid-cards"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {innovations.map((item, idx) => (
              <motion.div className="innovation-feat-card" key={idx} variants={scaleIn}>
                <div className="feat-circle-icon">
                  <CheckCircle size={20} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* Into The Future */}
      <section id="future-sec" className="future-section">
        <div className="future-container">
          <motion.div 
            className="future-split-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.div className="future-content-box" variants={fadeInUp}>
              <span className="section-badge">Solar for Solar</span>
              <h2>Green Hydropower Manufacturing</h2>
              <p>
                Trison supports the "Solar for Solar" business model. While creating low-cost clean energy products for the world, the company uses clean energy and green manufacturing practices in its operations whenever possible.
              </p>
              <p>
                We operate manufacturing facilities using abundant local hydropower resources to provide clean energy for cell and wafer production. We plan to integrate solar power plants with pumped storage in regions featuring elevation differences, creating a clean circular industrial model.
              </p>
            </motion.div>
            
            <motion.div className="future-visual-box" style={{ backgroundImage: `url(${solutionsBg})` }} variants={scaleIn}>
              <div className="visual-caption">
                <span>Vision</span>
                <h4>Clean Energy to Build a Green World</h4>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
