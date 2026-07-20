import React, { useState, useEffect } from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import VerifierPage from './pages/VerifierPage';
import PartnerPage from './pages/PartnerPage';
import OverView from './pages/OverView';
import ModulesPage from './pages/ModulesPage';
import AboutUsPage from './pages/AboutUsPage';
import AdminPanelPage from './pages/admin/AdminPage';

const PAGE_META = {
  home: {
    title: 'Trison – Premier Chinese Monocrystalline Solar Cell & Module Manufacturer | Est. 2007',
    description: 'Trison is a leading Chinese manufacturer of monocrystalline silicon solar cells, plates, and PV modules. Tier-1 quality, 50GW+ global shipments since 2007.',
  },
  about: {
    title: 'About Trison – Corporate Profile & Solar Wafer Innovations',
    description: 'Learn about Trison’s corporate history, R&D innovations, milestone developments, bankability ratings, and our Solar for Solar green initiatives.',
  },
  modules: {
    title: 'Trison High-Efficiency Solar PV Wafer Modules Catalog',
    description: 'Explore the full catalog of Trison monocrystalline solar modules, including Monofacial and Bifacial M10 wafer platforms.',
  },
  overview: {
    title: 'Trison Monocrystalline Plate Product Specification & 3D Overview',
    description: 'Explore technical parameters and 3D angle views of the next-generation Trison monocrystalline silicon PV cell plates and modules.',
  },
  verifier: {
    title: 'Trison Panel Authenticity Verifier – Verify Solar Panel Import | trisonsolar.com',
    description: 'Instantly verify the authenticity of your Trison panels. Enter the serial number or scan the QR code to confirm your panel is a genuine Trison import.',
  },
  partner: {
    title: 'Partner with Trison – Global Solar Module Supply & Distributor Inquiry',
    description: 'Become a Trison authorized solar module distributor or EPC partner. Submit your bulk inquiry for monocrystalline silicon PV modules and cells worldwide.',
  },
  admin: {
    title: 'Trison Internal Admin Dashboard System',
    description: 'Trison internal database administration portal.',
  },
};

function App() {
  const [view, setView] = useState('home'); // 'home' | 'about' | 'modules' | 'overview' | 'verifier' | 'partner' | 'admin'
  const [selectedProduct, setSelectedProduct] = useState('hi-mo-5-bifacial');

  // Handle HTML5 History API path routing (no hash symbols)
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;

      if (path.startsWith('/overview')) {
        setView('overview');
        const queryPart = window.location.search;
        if (queryPart) {
          const params = new URLSearchParams(queryPart);
          const product = params.get('product');
          if (product) setSelectedProduct(product);
        }
      } else if (path === '/about-us' || path === '/about-us/') {
        setView('about');
      } else if (path === '/modules' || path === '/modules/') {
        setView('modules');
      } else if (path === '/modules-authenticity' || path === '/modules-authenticity/') {
        setView('verifier');
      } else if (path === '/partner' || path === '/partner/') {
        setView('partner');
      } else if (path.startsWith('/admin-x7k2m9')) {
        setView('admin');
      } else {
        setView('home');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    // Initial check on load
    handleLocationChange();

    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Update URL path dynamically using pushState
  const handleViewChange = (newView, productId = null) => {
    let targetPath = '/';
    if (newView === 'overview') {
      const prod = productId || selectedProduct;
      targetPath = `/overview?product=${prod}`;
    } else if (newView === 'about') {
      targetPath = '/about-us/';
    } else if (newView === 'modules') {
      targetPath = '/modules/';
    } else if (newView === 'verifier') {
      targetPath = '/modules-authenticity/';
    } else if (newView === 'partner') {
      targetPath = '/partner/';
    } else if (newView === 'admin') {
      targetPath = '/admin-x7k2m9/';
    }

    window.history.pushState({}, '', targetPath);
    // Dispatch popstate event manually so App updates state immediately
    window.dispatchEvent(new Event('popstate'));
  };

  // Dynamic SEO: update <title> and meta description on each view change
  useEffect(() => {
    const meta = PAGE_META[view] || PAGE_META.home;
    document.title = meta.title;
    let descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', meta.description);
  }, [view]);

  const isAdmin = view === 'admin';

  // Toggle admin body class to disable page-level scrolling & background glows
  useEffect(() => {
    if (isAdmin) {
      document.body.classList.add('admin-body');
    } else {
      document.body.classList.remove('admin-body');
    }
    return () => document.body.classList.remove('admin-body');
  }, [isAdmin]);

  return (
    <>
      {/* High-tech grid background overlay */}
      {!isAdmin && <div className="grid-overlay"></div>}

      {/* Floating glass navigation bar with state triggers */}
      {!isAdmin && <Navbar currentView={view} onViewChange={handleViewChange} />}

      {/* Main Content Router */}
      <main style={isAdmin ? { height: '100vh', margin: 0, padding: 0, overflow: 'hidden' } : { minHeight: '80vh' }}>
        {view === 'home' ? (
          <HomePage onViewChange={handleViewChange} />
        ) : view === 'about' ? (
          /* Detailed corporate background of Trison */
          <AboutUsPage />
        ) : view === 'modules' ? (
          /* Full catalog directory of Trison PV solar modules */
          <ModulesPage onViewChange={handleViewChange} setSelectedProduct={setSelectedProduct} />
        ) : view === 'overview' ? (
          /* Interactive 3D product overview and datasheet */
          <OverView productId={selectedProduct} />
        ) : view === 'verifier' ? (
          /* Dedicated Authenticity Verification & Registry screen */
          <VerifierPage />
        ) : view === 'admin' ? (
          /* Hidden Internal Verifier DB & Leads Dashboard Manager */
          <AdminPanelPage />
        ) : (
          /* Dedicated Global Sales & Distribution Inquiries screen */
          <PartnerPage />
        )}
      </main>

      {/* Structured site bottom index */}
      {!isAdmin && <Footer onViewChange={handleViewChange} />}
    </>
  );
}

export default App;
