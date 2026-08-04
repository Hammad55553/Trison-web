import React from 'react';
import GenericInfoPage from '../components/common/GenericInfoPage';
import siliconImg from '../assets/images/silicon.webp';
import headerImg from '../assets/images/silicon_wafer.webp';

const SiliconCellPage = () => {
  return (
    <GenericInfoPage 
      title="Advanced Silicon Wafer Production" 
      subtitle="Industry-leading monocrystalline cell fabrication processes."
      headerImage={headerImg}
    >
      {/* Product Image Section */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <img
          src={siliconImg}
          alt="Trison Advanced Silicon Wafer Production"
          loading="lazy"
          decoding="async"
          style={{ width: '100%', maxWidth: '1000px', height: 'auto', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
        />
      </div>

      <p style={{ marginBottom: '30px', fontSize: '1.15rem' }}>
        Trison is at the forefront of global silicon cell manufacturing. By leveraging advanced monocrystalline growth techniques and extreme-precision diamond wire slicing, we produce the ultra-high-efficiency wafers that form the bedrock of premium Tier-1 solar modules around the world.
      </p>
      
      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>From Ingot to Premium Wafer</h2>
      <p style={{ marginBottom: '16px' }}>Our state-of-the-art production pipeline is strictly controlled through 5 critical stages:</p>
      <ol style={{ paddingLeft: '24px', marginBottom: '32px', lineHeight: 1.8 }}>
        <li><strong>Monocrystalline Growth:</strong> Using the Czochralski process to grow pure, defect-free silicon ingots under highly controlled thermal environments.</li>
        <li><strong>Diamond Wire Slicing:</strong> Advanced ultra-thin diamond wire technology slices ingots with micron-level precision, significantly reducing kerf loss and preserving material integrity.</li>
        <li><strong>Edge Rounding & Polishing:</strong> Wafers undergo rigorous mechanical and chemical polishing to remove surface micro-defects and prepare for cell doping.</li>
        <li><strong>AI Inspection & Defect Detection:</strong> High-speed optical cameras powered by deep learning algorithms scan every wafer for micro-cracks, ensuring only perfect wafers proceed.</li>
        <li><strong>Automated Sorting & Packaging:</strong> Robotic systems classify wafers based on exact resistivity and thickness parameters before sealing them for module assembly.</li>
      </ol>

      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>Pillars of Manufacturing Excellence</h2>
      
      <h3 style={{ fontSize: '1.4rem', color: '#1e293b', marginBottom: '10px' }}>1. High-Purity Polysilicon Sourcing</h3>
      <p style={{ marginBottom: '20px' }}>
        We utilize only ultra-pure raw materials (99.9999999% purity). This exceptional starting point is critical for ensuring maximum light-to-electricity conversion efficiency and long-term module reliability under harsh conditions.
      </p>

      <h3 style={{ fontSize: '1.4rem', color: '#1e293b', marginBottom: '10px' }}>2. Proprietary Doping Techniques</h3>
      <p style={{ marginBottom: '20px' }}>
        To combat Light Induced Degradation (LID), Trison employs advanced gallium and phosphorus doping processes. This creates a highly uniform internal crystalline structure, minimizing power degradation over the decades.
      </p>

      <h3 style={{ fontSize: '1.4rem', color: '#1e293b', marginBottom: '10px' }}>3. Quality Control & AI Innovation</h3>
      <p style={{ marginBottom: '20px' }}>
        Our fully automated production lines integrate AI-driven defect detection and rigorous sorting algorithms. By mathematically eliminating micro-cracks and impurities, we guarantee Tier-1 performance criteria and decades of stable power output.
      </p>

      <h3 style={{ fontSize: '1.4rem', color: '#1e293b', marginBottom: '10px' }}>4. Zero-Emission Manufacturing Targets</h3>
      <p style={{ marginBottom: '32px' }}>
        Trison is deeply committed to a sustainable future. Our manufacturing hubs operate on a "Solar for Solar" philosophy, heavily utilizing clean energy, intensive water recycling, and aggressive zero-emission manufacturing targets to lower the carbon footprint of every panel.
      </p>

      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>Engineered for Excellence</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#f1f5f9', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0ea5e9' }}>&gt;23.5%</div>
          <div style={{ fontSize: '0.95rem', color: '#475569' }}>Mass Production Cell Efficiency</div>
        </div>
        <div style={{ backgroundColor: '#f1f5f9', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0ea5e9' }}>&lt;1%</div>
          <div style={{ fontSize: '0.95rem', color: '#475569' }}>First Year Degradation</div>
        </div>
        <div style={{ backgroundColor: '#f1f5f9', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0ea5e9' }}>25+ Years</div>
          <div style={{ fontSize: '0.95rem', color: '#475569' }}>Guaranteed Lifespan</div>
        </div>
        <div style={{ backgroundColor: '#f1f5f9', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0ea5e9' }}>TIER-1</div>
          <div style={{ fontSize: '0.95rem', color: '#475569' }}>Global Quality Standard</div>
        </div>
      </div>

    </GenericInfoPage>
  );
};

export default SiliconCellPage;
