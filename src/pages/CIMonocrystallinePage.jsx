import React from 'react';
import GenericInfoPage from '../components/common/GenericInfoPage';
import headerImg from '../assets/images/bilding.webp';

const CIMonocrystallinePage = () => {
  return (
    <GenericInfoPage 
      title="C&I Monocrystalline Plates" 
      subtitle="Optimized solar solutions for Commercial and Industrial rooftops."
      headerImage={headerImg}
    >
      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px' }}>Powering Businesses with Clean Energy</h2>
      <p style={{ marginBottom: '24px' }}>
        Commercial and Industrial (C&I) facilities demand high-density power generation to offset heavy energy loads. Trison’s C&I monocrystalline plates are designed to maximize wattage per square meter, making them ideal for constrained warehouse and factory roof spaces.
      </p>

      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px' }}>Structural Integrity & Safety</h2>
      <p style={{ marginBottom: '24px' }}>
        Safety is paramount for commercial buildings. Our C&I modules are lightweight yet structurally robust, minimizing roof load while withstanding extreme wind and snow pressures. Additionally, they are optimized for rapid shutdown and fire safety compliance.
      </p>
    </GenericInfoPage>
  );
};

export default CIMonocrystallinePage;
