import React from 'react';
import GenericInfoPage from '../components/common/GenericInfoPage';
import headerImg from '../assets/images/inside3.webp';

const NTypeTOPConPage = () => {
  return (
    <GenericInfoPage 
      title="N-Type TOPCon Technology" 
      subtitle="The next generation of ultra-high efficiency solar cells."
      headerImage={headerImg}
    >
      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px' }}>Breaking Efficiency Barriers</h2>
      <p style={{ marginBottom: '24px' }}>
        Tunnel Oxide Passivated Contact (TOPCon) technology represents a monumental leap in N-type cell architecture. By introducing an ultra-thin tunnel oxide layer, Trison significantly reduces electron recombination, allowing cell efficiencies to exceed 25% in mass production.
      </p>

      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px' }}>Superior Low-Light Performance</h2>
      <p style={{ marginBottom: '24px' }}>
        N-Type TOPCon cells exhibit exceptionally low degradation rates and possess a superior temperature coefficient. This means they generate more power during early mornings, late afternoons, and hot summer days compared to traditional P-type PERC cells.
      </p>
    </GenericInfoPage>
  );
};

export default NTypeTOPConPage;
