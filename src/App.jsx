import React, { useState, useEffect, Suspense, lazy } from 'react';
import Splash from './components/common/Splash';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
// Home renders on first paint for every visitor — keep it in the main bundle.
import HomePage from './pages/HomePage';

// Everything else is a secondary route: code-split so a first-time visitor
// only downloads what the home page needs. Each of these becomes its own
// chunk, fetched on demand the moment the user actually navigates there.
const VerifierPage = lazy(() => import('./pages/VerifierPage'));
const PartnerPage = lazy(() => import('./pages/PartnerPage'));
const OverView = lazy(() => import('./pages/OverView'));
const ModulesPage = lazy(() => import('./pages/ModulesPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const AdminPanelPage = lazy(() => import('./pages/admin/AdminPage'));

const SiliconCellPage = lazy(() => import('./pages/SiliconCellPage'));
const UtilityBifacialPage = lazy(() => import('./pages/UtilityBifacialPage'));
const CIMonocrystallinePage = lazy(() => import('./pages/CIMonocrystallinePage'));
const NTypeTOPConPage = lazy(() => import('./pages/NTypeTOPConPage'));
const PanelWarrantyPage = lazy(() => import('./pages/PanelWarrantyPage'));
const InverterWarrantyPage = lazy(() => import('./pages/InverterWarrantyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

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
  'silicon-cell': { title: 'Silicon Cell Manufacturing - Trison', description: 'Advanced monocrystalline cell fabrication processes.' },
  'utility-bifacial': { title: 'Utility Bifacial Modules - Trison', description: 'Maximizing energy yield for grid-scale installations.' },
  'ci-monocrystalline': { title: 'C&I Monocrystalline Plates - Trison', description: 'Optimized solutions for commercial rooftops.' },
  'n-type-topcon': { title: 'N-Type TOPCon Technology - Trison', description: 'Next generation of ultra-high efficiency solar cells.' },
  'panel-warranty': { title: '25-Year Panel Warranty - Trison', description: 'Industry-leading guarantees for peace of mind.' },
  'inverter-warranty': { title: '10-Year Inverter Warranty - Trison', description: 'Securing the heart of your solar power system.' },
  'terms': { title: 'Terms & Conditions - Trison', description: 'Legal agreements and usage policies.' },
  'privacy': { title: 'Privacy Policy - Trison', description: 'How we collect, use, and protect your data.' },
};

function App() {
  const [view, setView] = useState('home'); // 'home' | 'about' | 'modules' | 'overview' | 'verifier' | 'partner' | 'admin'
  const [selectedProduct, setSelectedProduct] = useState('hi-mo-5-bifacial');
  const [showSplash, setShowSplash] = useState(true);

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
      } else if (path === '/silicon-cell' || path === '/silicon-cell/') {
        setView('silicon-cell');
      } else if (path === '/utility-bifacial' || path === '/utility-bifacial/') {
        setView('utility-bifacial');
      } else if (path === '/ci-monocrystalline' || path === '/ci-monocrystalline/') {
        setView('ci-monocrystalline');
      } else if (path === '/n-type-topcon' || path === '/n-type-topcon/') {
        setView('n-type-topcon');
      } else if (path === '/panel-warranty' || path === '/panel-warranty/') {
        setView('panel-warranty');
      } else if (path === '/inverter-warranty' || path === '/inverter-warranty/') {
        setView('inverter-warranty');
      } else if (path === '/terms' || path === '/terms/') {
        setView('terms');
      } else if (path === '/privacy' || path === '/privacy/') {
        setView('privacy');
      } else if (path.startsWith('/admin-x7k2m9')) {
        setView('admin');
      } else if (path === '/' || path === '') {
        setView('home');
      } else {
        setView('not-found');
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
    } else if (newView === 'silicon-cell') {
      targetPath = '/silicon-cell/';
    } else if (newView === 'utility-bifacial') {
      targetPath = '/utility-bifacial/';
    } else if (newView === 'ci-monocrystalline') {
      targetPath = '/ci-monocrystalline/';
    } else if (newView === 'n-type-topcon') {
      targetPath = '/n-type-topcon/';
    } else if (newView === 'panel-warranty') {
      targetPath = '/panel-warranty/';
    } else if (newView === 'inverter-warranty') {
      targetPath = '/inverter-warranty/';
    } else if (newView === 'terms') {
      targetPath = '/terms/';
    } else if (newView === 'privacy') {
      targetPath = '/privacy/';
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
      {/* Branded intro splash on first load */}
      {showSplash && <Splash onFinish={() => setShowSplash(false)} />}

      {/* High-tech grid background overlay */}
      {!isAdmin && <div className="grid-overlay"></div>}

      {/* Floating glass navigation bar with state triggers */}
      {!isAdmin && <Navbar currentView={view} onViewChange={handleViewChange} />}

      {/* Main Content Router */}
      <main style={isAdmin ? { height: '100vh', margin: 0, padding: 0, overflow: 'hidden' } : { minHeight: '80vh' }}>
        {view === 'home' ? (
          <HomePage onViewChange={handleViewChange} />
        ) : (
        <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
        {view === 'about' ? (
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
        ) : view === 'partner' ? (
          /* Dedicated Global Sales & Distribution Inquiries screen */
          <PartnerPage />
        ) : view === 'silicon-cell' ? (
          <SiliconCellPage />
        ) : view === 'utility-bifacial' ? (
          <UtilityBifacialPage />
        ) : view === 'ci-monocrystalline' ? (
          <CIMonocrystallinePage />
        ) : view === 'n-type-topcon' ? (
          <NTypeTOPConPage />
        ) : view === 'panel-warranty' ? (
          <PanelWarrantyPage />
        ) : view === 'inverter-warranty' ? (
          <InverterWarrantyPage />
        ) : view === 'terms' ? (
          <TermsPage />
        ) : view === 'privacy' ? (
          <PrivacyPolicyPage />
        ) : view === 'admin' ? (
          /* Hidden Internal Verifier DB & Leads Dashboard Manager */
          <AdminPanelPage onViewChange={handleViewChange} />
        ) : view === 'not-found' ? (
          <NotFoundPage />
        ) : (
          <HomePage onViewChange={handleViewChange} />
        )}
        </Suspense>
        )}
      </main>

      {/* Structured site bottom index */}
      {!isAdmin && <Footer onViewChange={handleViewChange} />}
    </>
  );
}

export default App;
