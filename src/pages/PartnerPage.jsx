import React, { useEffect } from 'react';
import ContactScreen from '../components/home/ContactScreen';

const PartnerPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div style={{ paddingTop: '80px', backgroundColor: 'var(--bg-primary)', minHeight: '90vh' }}>
      <ContactScreen />
    </div>
  );
};

export default PartnerPage;
