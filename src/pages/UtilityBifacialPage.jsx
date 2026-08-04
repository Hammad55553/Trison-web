import React from 'react';
import GenericInfoPage from '../components/common/GenericInfoPage';
import headerImg from '../assets/images/utility_header_bg.webp';
import utilityImg from '../assets/images/untilty.webp';

const UtilityBifacialPage = () => {
  return (
    <GenericInfoPage 
      title="Utility Bifacial Modules" 
      subtitle="Maximizing energy yield for massive grid-scale installations."
      headerImage={headerImg}
    >
      {/* Product Image Section */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <img
          src={utilityImg}
          alt="Trison Utility Bifacial Modules"
          loading="lazy"
          decoding="async"
          style={{ width: '100%', maxWidth: '1000px', height: 'auto', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
        />
      </div>

      <p style={{ marginBottom: '30px', fontSize: '1.15rem' }}>
        Trison stands as a premier global Tier-1 solar cell and plate manufacturer. Founded in 2007 in China, we have continuously delivered leading PV module technology with verified lifespan yields. Our Utility Bifacial Modules represent the pinnacle of large-scale solar generation, specifically engineered to drastically reduce the Levelized Cost of Energy (LCOE) for massive grid-connected power stations worldwide.
      </p>
      
      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>Dual-Sided Energy Generation</h2>
      <p style={{ marginBottom: '24px' }}>
        Unlike traditional monofacial panels that only absorb light from the top surface, Trison’s Utility Bifacial Modules are masterfully engineered to capture sunlight from both the front and rear sides simultaneously. By intelligently utilizing reflected albedo light from the ground—such as white sand, snow, or specialized reflective membranes—these modules can increase total energy yield by up to 25% depending on the installation environment. This breakthrough means utility operators can generate significantly more power without increasing the physical footprint of the solar farm.
      </p>

      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>Built for the Harshest Environments</h2>
      <p style={{ marginBottom: '16px' }}>
        Utility-scale solar farms are frequently deployed in some of the most unforgiving climates on Earth. To counter these extremes, our bifacial modules feature an ultra-robust dual-glass construction. This architectural choice provides unparalleled protection, making them the premier choice for desert, coastal, and snow-prone utility projects.
      </p>
      <ul style={{ paddingLeft: '24px', marginBottom: '32px', lineHeight: 1.8 }}>
        <li><strong>Superior Durability:</strong> The symmetrical dual-glass design ensures absolute resistance against moisture ingress, drastically minimizing the risk of Potential Induced Degradation (PID) which often plagues standard backsheet panels over time.</li>
        <li><strong>Corrosion Resistance:</strong> Engineered to withstand harsh coastal salt mist and high-ammonia agricultural environments without any degradation to the internal circuitry.</li>
        <li><strong>Sand and Dust Deflection:</strong> The frameless or optimized frame edges prevent the accumulation of abrasive desert sand, ensuring the glass remains clear and fully transmissive.</li>
      </ul>

      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>Core Advantages for Grid-Scale Deployments</h2>
      
      <h3 style={{ fontSize: '1.4rem', color: '#1e293b', marginBottom: '10px' }}>Up to 25% More Energy Yield</h3>
      <p style={{ marginBottom: '20px' }}>
        The rear-side energy boost acts as a continuous performance multiplier. Whether installed on trackers following the sun or fixed-tilt structures, the bifacial technology consistently harvests scattered and reflected light, directly translating to higher megawatt-hour outputs and faster return on investment (ROI).
      </p>

      <h3 style={{ fontSize: '1.4rem', color: '#1e293b', marginBottom: '10px' }}>Excellent Performance in Extreme Conditions</h3>
      <p style={{ marginBottom: '20px' }}>
        Trison modules are characterized by an exceptionally low temperature coefficient. This ensures that even during peak summer heatwaves in arid desert installations, the panels maintain high voltage and minimal power loss. Furthermore, the robust dual-glass structure provides strong mechanical load capacity against heavy snow accumulation and cyclonic winds.
      </p>

      <h3 style={{ fontSize: '1.4rem', color: '#1e293b', marginBottom: '10px' }}>Drastically Lower LCOE</h3>
      <p style={{ marginBottom: '32px' }}>
        The ultimate goal of any utility project is minimizing the Levelized Cost of Energy. By combining a higher lifetime energy yield with rock-solid long-term reliability and zero maintenance overhead for backsheet replacements, Trison Bifacial Modules effectively dilute the Balance of System (BOS) costs. You get more power from the same land, tracking systems, and inverters.
      </p>

      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>Trison Global Trust & Heritage</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#f1f5f9', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0ea5e9' }}>2007</div>
          <div style={{ fontSize: '0.95rem', color: '#475569' }}>Founded in China</div>
        </div>
        <div style={{ backgroundColor: '#f1f5f9', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0ea5e9' }}>Global</div>
          <div style={{ fontSize: '0.95rem', color: '#475569' }}>Presence & Supply</div>
        </div>
        <div style={{ backgroundColor: '#f1f5f9', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0ea5e9' }}>TIER-1</div>
          <div style={{ fontSize: '0.95rem', color: '#475569' }}>Manufacturing Quality</div>
        </div>
        <div style={{ backgroundColor: '#f1f5f9', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0ea5e9' }}>Verified</div>
          <div style={{ fontSize: '0.95rem', color: '#475569' }}>Long-term Reliability</div>
        </div>
      </div>

    </GenericInfoPage>
  );
};

export default UtilityBifacialPage;
