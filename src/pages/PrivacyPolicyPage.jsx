import React from 'react';
import GenericInfoPage from '../components/common/GenericInfoPage';

const PrivacyPolicyPage = () => {
  return (
    <GenericInfoPage 
      title="Privacy Policy" 
      subtitle="How we collect, use, and protect your data."
    >
      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px' }}>1. Introduction</h2>
      <p style={{ marginBottom: '24px' }}>
        Welcome to Trison Solar ("we," "our," or "us"). We respect your privacy and are committed to protecting the personal data of our users, partners, and visitors. This Privacy Policy outlines how we collect, process, and safeguard your personal information when you visit our website, interact with our services, or purchase our solar PV modules and solutions. By accessing our platform, you agree to the collection and use of information in accordance with this policy.
      </p>

      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px' }}>2. Information We Collect</h2>
      <p style={{ marginBottom: '12px' }}>
        We collect various types of data to provide and improve our products and services. The types of data we collect include:
      </p>
      <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
        <li style={{ marginBottom: '8px' }}><strong>Personal Identification Information:</strong> Name, email address, phone number, and physical address when you register for an account, subscribe to our newsletters, or contact us.</li>
        <li style={{ marginBottom: '8px' }}><strong>Business Information:</strong> Company name, job title, corporate address, and tax identification numbers when you inquire about commercial solar installations or distribution partnerships.</li>
        <li style={{ marginBottom: '8px' }}><strong>Technical Data:</strong> IP address, browser type, operating system, and browsing behavior collected through cookies and tracking technologies to enhance user experience.</li>
        <li style={{ marginBottom: '8px' }}><strong>Transaction Data:</strong> Details about payments, panel serial numbers for authenticity verification, and warranty registration details.</li>
      </ul>

      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px' }}>3. How We Use Your Data</h2>
      <p style={{ marginBottom: '12px' }}>
        Trison strictly uses the collected data for operational and legal purposes, including:
      </p>
      <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
        <li style={{ marginBottom: '8px' }}>To fulfill product orders, handle shipping logistics, and manage customer service requests.</li>
        <li style={{ marginBottom: '8px' }}>To authenticate the serial numbers of imported Trison solar panels through our verification system.</li>
        <li style={{ marginBottom: '8px' }}>To process warranty claims and provide technical support for inverters and monocrystalline plates.</li>
        <li style={{ marginBottom: '8px' }}>To communicate important safety notices, product recalls, or updates to our terms and conditions.</li>
        <li style={{ marginBottom: '8px' }}>To improve website functionality, analyze traffic, and optimize our marketing efforts.</li>
      </ul>

      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px' }}>4. Data Sharing and Third-Party Disclosure</h2>
      <p style={{ marginBottom: '24px' }}>
        We do not sell, trade, or rent your personal identification information to unauthorized third parties. We may share generic aggregated demographic information not linked to any personal identification information with our business partners and trusted affiliates. We may use third-party service providers (such as shipping logistics companies and payment processors) to help us operate our business, provided they agree to keep your information confidential. We may also disclose your information if required by law, court order, or governmental regulation.
      </p>

      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px' }}>5. Data Security & Protection</h2>
      <p style={{ marginBottom: '24px' }}>
        We adopt appropriate data collection, storage, and processing practices, as well as robust security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information. Our website is secured via SSL (Secure Socket Layer) encryption, and access to internal databases is restricted to authorized personnel only. However, please be aware that no method of transmission over the internet or method of electronic storage is 100% secure.
      </p>

      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px' }}>6. Cookies and Tracking Technologies</h2>
      <p style={{ marginBottom: '24px' }}>
        Our website uses "cookies" to enhance user experience. Your web browser places cookies on your hard drive for record-keeping purposes and sometimes to track information about you. You may choose to set your web browser to refuse cookies, or to alert you when cookies are being sent. If you do so, note that some parts of the site may not function properly.
      </p>

      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px' }}>7. Your Privacy Rights</h2>
      <p style={{ marginBottom: '24px' }}>
        Depending on your location, you may have the right to request access to the personal data we hold about you, request corrections to inaccurate data, or request the deletion of your data under certain conditions. To exercise these rights, please contact our Data Protection Officer through our official support channels.
      </p>

      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px' }}>8. Changes to This Privacy Policy</h2>
      <p style={{ marginBottom: '24px' }}>
        Trison Solar has the discretion to update this privacy policy at any time. When we do, we will revise the updated date at the bottom of this page. We encourage users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect.
      </p>

      <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '40px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
        Last updated: August 2026. For privacy-related inquiries, contact privacy@trisonsolar.com.
      </p>
    </GenericInfoPage>
  );
};

export default PrivacyPolicyPage;
