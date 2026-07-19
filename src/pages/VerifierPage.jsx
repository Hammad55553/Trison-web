import React from 'react';
import AuthenticityScreen from '../components/verifier/AuthenticityScreen';

const VerifierPage = () => {
  return (
    <div style={{ paddingTop: '85px', minHeight: '85vh' }}>
      <AuthenticityScreen />
    </div>
  );
};

export default VerifierPage;
