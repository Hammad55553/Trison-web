import React from 'react';
import GenericInfoPage from '../components/common/GenericInfoPage';
import headerImg from '../assets/images/pv_solutions.webp';

const TermsPage = () => {
  return (
    <GenericInfoPage 
      title="Terms & Conditions" 
      subtitle="Legal agreements and usage policies for Trison products and services."
      headerImage={headerImg}
    >
      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px' }}>1. Acceptance of Terms</h2>
      <p style={{ marginBottom: '24px' }}>
        By accessing the Trison Solar website, engaging with our digital platforms, or purchasing our solar PV modules and solutions, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you are advised to discontinue the use of our services immediately. These terms apply to all visitors, users, and authorized distributors worldwide.
      </p>

      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px' }}>2. Product Information & Specifications</h2>
      <p style={{ marginBottom: '12px' }}>
        Trison is dedicated to continuous innovation. Therefore, we reserve the right to:
      </p>
      <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
        <li style={{ marginBottom: '8px' }}>Modify product specifications, dimensions, and electrical parameters without prior notice as manufacturing processes evolve.</li>
        <li style={{ marginBottom: '8px' }}>Update marketing materials and datasheets on our website; however, the actual product performance is strictly governed by the official datasheet provided at the time of purchase.</li>
        <li style={{ marginBottom: '8px' }}>Discontinue legacy module series to make way for newer, more efficient TOPCon and Heterojunction (HJT) technologies.</li>
      </ul>

      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px' }}>3. Pricing and Sales Agreements</h2>
      <p style={{ marginBottom: '24px' }}>
        All commercial sales, whether for utility-scale projects or C&I distribution, are subject to a formal, legally binding Sales Agreement negotiated between Trison and the buyer. The prices listed on marketing materials (if any) are indicative and do not constitute a formal offer. Trison reserves the right to adjust pricing based on global silicon supply chains, logistics costs, and regional tariffs.
      </p>

      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px' }}>4. Intellectual Property Rights</h2>
      <p style={{ marginBottom: '24px' }}>
        All content, trademarks, patents, logos, and digital assets associated with Trison Solar—including but not limited to the Trison logo, proprietary cell designs, software algorithms, and website architecture—are the exclusive property of Trison. Unauthorized reproduction, reverse engineering, or distribution of our intellectual property is strictly prohibited and subject to legal action under international copyright and patent laws.
      </p>

      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px' }}>5. Installation & Compliance</h2>
      <p style={{ marginBottom: '24px' }}>
        Trison manufactures Tier-1 solar equipment, but we are not an EPC (Engineering, Procurement, and Construction) contractor. It is the sole responsibility of the buyer or authorized distributor to ensure that our modules are installed by certified solar technicians in full compliance with local building codes, electrical safety regulations, and environmental laws. Improper installation voids the warranty and absolves Trison of any liability.
      </p>

      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px' }}>6. Limitation of Liability</h2>
      <p style={{ marginBottom: '24px' }}>
        To the maximum extent permitted by law, Trison shall not be held liable for any indirect, incidental, punitive, or consequential damages arising from the use or inability to use our products. This includes, but is not limited to, loss of revenue, grid curtailment losses, or operational downtime. Our maximum liability under any claim shall not exceed the original purchase price of the defective product.
      </p>

      <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px' }}>7. Governing Law and Dispute Resolution</h2>
      <p style={{ marginBottom: '24px' }}>
        These Terms and Conditions shall be governed by and construed in accordance with international trade laws and the specific jurisdiction outlined in your formal Sales Agreement. Any disputes arising from these terms will first be subject to binding arbitration before seeking resolution in a court of law.
      </p>

      <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '40px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
        Last updated: August 2026. For legal inquiries, please contact legal@trisonsolar.com.
      </p>
    </GenericInfoPage>
  );
};

export default TermsPage;
