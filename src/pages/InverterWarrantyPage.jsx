import React from 'react';
import GenericInfoPage from '../components/common/GenericInfoPage';
import inverterImg from '../assets/images/inverter.webp';
import headerImg from '../assets/images/news_tandem_cell.webp';

const InverterWarrantyPage = () => {
  return (
    <GenericInfoPage 
      title="10-Year Inverter Warranty & Specs" 
      subtitle="Securing the heart of your solar power system with unmatched reliability."
      headerImage={headerImg}
    >
      {/* Product Image Section */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <img
          src={inverterImg}
          alt="Trison Solar Inverter"
          loading="lazy"
          decoding="async"
          style={{ width: '100%', maxWidth: '900px', height: 'auto', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
        />
      </div>

      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px' }}>1. Standard 10-Year Protection</h2>
      <p style={{ marginBottom: '24px' }}>
        All Trison-certified string and central inverters come with a standard 10-year factory warranty. This covers the internal electronics, smart monitoring modules, cooling systems, casing, and critical components against manufacturing defects and premature failure under normal operational loads. Our commitment ensures that the "brain" of your solar array remains fully functional for a decade.
      </p>

      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px' }}>2. Advanced Inverter Technology</h2>
      <p style={{ marginBottom: '12px' }}>
        Trison Inverters are engineered for maximum energy harvest and seamless grid integration. Key technical highlights include:
      </p>
      <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
        <li style={{ marginBottom: '8px' }}><strong>High Peak Efficiency:</strong> Operating at up to 98.8% maximum efficiency, minimizing power loss during DC to AC conversion.</li>
        <li style={{ marginBottom: '8px' }}><strong>Multi-MPPT Design:</strong> Equipped with up to 12 Maximum Power Point Trackers to handle complex roof shading and varying string lengths, ensuring maximum yield.</li>
        <li style={{ marginBottom: '8px' }}><strong>Smart Grid Integration:</strong> Features active and reactive power control, grid fault ride-through capabilities, and remote dispatch controls.</li>
        <li style={{ marginBottom: '8px' }}><strong>IP66 Robust Protection:</strong> Designed to withstand extreme weather conditions ranging from -30°C to +60°C, ensuring safe outdoor installations.</li>
      </ul>

      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px' }}>3. Extended Warranty Options</h2>
      <p style={{ marginBottom: '24px' }}>
        For large-scale utility and Commercial & Industrial (C&I) clients, Trison offers extended warranty packages pushing coverage to 15 or even 20 years. These premium packages include rapid-response replacements, advanced proactive remote monitoring diagnostics, and priority access to our global O&M (Operations & Maintenance) engineering teams to minimize downtime.
      </p>

      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px' }}>4. Smart Monitoring System</h2>
      <p style={{ marginBottom: '24px' }}>
        Every Trison inverter is integrated with a state-of-the-art WLAN/4G communication module. Through our proprietary cloud portal, facility managers and homeowners can monitor real-time string-level performance, run I-V curve diagnostics, and receive instant alert notifications directly to their mobile devices.
      </p>

      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px' }}>5. Claiming Your Warranty</h2>
      <p style={{ marginBottom: '24px' }}>
        In the rare event of a system failure, claiming your warranty is simple. Our smart monitoring system automatically generates fault codes. Users can submit these codes along with their serial number via our Partner Portal. Our technical team will instantly diagnose the issue remotely and, if necessary, dispatch a replacement unit within 48 hours to secure continuous power transmission.
      </p>

    </GenericInfoPage>
  );
};

export default InverterWarrantyPage;
