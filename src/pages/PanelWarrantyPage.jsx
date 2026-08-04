import React from 'react';
import GenericInfoPage from '../components/common/GenericInfoPage';
import headerImg from '../assets/images/MainGate.webp';

const PanelWarrantyPage = () => {
  return (
    <GenericInfoPage 
      title="25-Year Panel Warranty" 
      subtitle="Industry-leading guarantees ensuring your long-term return on investment."
      headerImage={headerImg}
    >
      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px' }}>Comprehensive Product Warranty</h2>
      <p style={{ marginBottom: '24px' }}>
        Trison guarantees that our solar PV modules will maintain their structural and functional integrity for 12 years under standard environmental conditions. Any defects in materials or workmanship during this period will be covered under our global replacement policy.
      </p>

      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px' }}>25-Year Linear Power Output Warranty</h2>
      <p style={{ marginBottom: '24px' }}>
        We promise that power degradation will not exceed 2% in the first year and 0.55% annually thereafter. By the 25th year, Trison guarantees an actual power output of no less than 84.8% of the labeled nominal power, ensuring reliable financial returns for the lifespan of your project.
      </p>
    </GenericInfoPage>
  );
};

export default PanelWarrantyPage;
