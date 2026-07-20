import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Cpu, ScanLine, ClipboardList, LogOut, LayoutGrid, X, User, Lock, Eye, EyeOff } from 'lucide-react';
import AdminStats from '../../components/admin/AdminStats';
import PanelManager from '../../components/admin/PanelManager';
import QRScanner from '../../components/admin/QRScanner';
import InquiryLogs from '../../components/admin/InquiryLogs';
import { getCustomRegistry } from '../../services/authenticityService';
import { getInquiries } from '../../services/leadService';
import trisonLogo from '../../assets/images/TRISON.jpg';
import mainGateImg from '../../assets/images/MainGate.jpeg';
import './AdminPage.css';
import { ChevronRight } from 'lucide-react';
const VIEWS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'panels', label: 'Panel Manager', icon: Cpu },
  { key: 'scanner', label: 'Scan & Verify', icon: ScanLine },
  { key: 'leads', label: 'Sales Leads', icon: ClipboardList },
];

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('trison_admin_auth') === 'true'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [activeView, setActiveView] = useState(
    sessionStorage.getItem('trison_admin_view') || 'dashboard'
  );
  const [serials, setSerials] = useState({});
  const [inquiries, setInquiries] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sync active view to sessionStorage to persist across page refresh
  useEffect(() => {
    sessionStorage.setItem('trison_admin_view', activeView);
  }, [activeView]);

  useEffect(() => {
    if (isAuthenticated) {
      setSerials(getCustomRegistry());
      setInquiries(getInquiries());
    }
  }, [isAuthenticated]);

  // Refresh data whenever tab changes (so counts stay fresh)
  useEffect(() => {
    if (isAuthenticated) {
      setSerials(getCustomRegistry());
      setInquiries(getInquiries());
    }
  }, [activeView, isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    // Default administrative credentials
    if (username.trim() === 'admin' && password === 'trison') {
      sessionStorage.setItem('trison_admin_auth', 'true');
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password.');
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    sessionStorage.removeItem('trison_admin_auth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-card">
          {/* Card Header Image Section */}
          <div className="login-card-hero" style={{ backgroundImage: `url(${mainGateImg})` }}>
            <div className="hero-overlay"></div>
          </div>

          {/* Card Body Section */}
          <div className="login-card-body">
            <div className="login-brand-header">
              <img src={trisonLogo} alt="Trison Logo" className="login-logo" />
              <p>Access requires verified administrative credentials.</p>
            </div>
            <form onSubmit={handleLogin} className="login-form">
              <div className="login-group">
                <label>Username</label>
                <div className="login-input-wrapper">
                  <User className="login-input-icon" size={18} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>
              <div className="login-group">
                <label>Password</label>
                <div className="login-input-wrapper">
                  <Lock className="login-input-icon" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    aria-label="Password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(s => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {loginError && <div className="login-error-message">{loginError}</div>}
              <button type="submit" className="login-submit-btn">Authorize Session</button>
            </form>
            <a href="/" className="login-back-link">Return to Main Site</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-root ${sidebarOpen ? 'sidebar-visible' : 'sidebar-hidden'}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <img src={trisonLogo} alt="Trison Logo" className="admin-sidebar-logo" />
          <button className="btn-sidebar-close-mobile" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {VIEWS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`sidebar-nav-item ${activeView === key ? 'active' : ''}`}
              onClick={() => {
                setActiveView(key);
                setSidebarOpen(false);
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
              {activeView === key && <div className="nav-active-bar" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={handleLogout} className="sidebar-logout" style={{ border: 'none', background: 'transparent', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LogOut size={16} /> End Session (Logout)
          </button>
          <a href="/" className="sidebar-logout">
            <LogOut size={16} /> Back to Site
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Bar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <button className="btn-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} title="Toggle Sidebar">
              <LayoutGrid size={20} />
            </button>
            <div className="topbar-title-wrap">
              <h2>{VIEWS.find(v => v.key === activeView)?.label}</h2>
              <span className="topbar-sub">Trison Internal Management System</span>
            </div>
          </div>
          <div className="topbar-right">
            <span className="topbar-badge">Admin Session</span>
          </div>
        </header>

        {/* View Content */}
        <div className="admin-content-area" key={activeView}>

          {/* ── Dashboard ── */}
          {activeView === 'dashboard' && (
            <div className="dash-view">
              <AdminStats serialCount={Object.keys(serials).length} inquiryCount={inquiries.length} />

              <div className="dash-quick-grid">
                <div className="dash-quick-card" onClick={() => setActiveView('panels')}>
                  <Cpu size={26} />
                  <h3>Panel Manager</h3>
                  <p>Register, edit, and delete solar panel serial keys in the authenticity database.</p>
                  <span className="quick-link">Open <ChevronRight size={16} /></span>
                </div>
                <div className="dash-quick-card" onClick={() => setActiveView('scanner')}>
                  <ScanLine size={26} />
                  <h3>Scan & Verify</h3>
                  <p>Use camera or manual entry to verify if a panel serial number is authentic.</p>
                  <span className="quick-link">Open <ChevronRight size={16} /></span>
                </div>
                <div className="dash-quick-card" onClick={() => setActiveView('leads')}>
                  <ClipboardList size={26} />
                  <h3>Sales Leads</h3>
                  <p>View and manage all incoming dealer and distributor inquiry submissions.</p>
                  <span className="quick-link">Open <ChevronRight size={16} /></span>
                </div>
              </div>

              {/* Recent Serials Table Preview */}
              <div className="dash-recent-block">
                <div className="dash-recent-header">
                  <h3>Recently Registered Panels</h3>
                  <button className="dash-view-all" onClick={() => setActiveView('panels')}>
                    View All <span className='icon-right'><ChevronRight size={16} /></span>
                  </button>                </div>
                <div className="pm-table-wrap">
                  <table className="pm-tbl">
                    <thead>
                      <tr>
                        <th>Serial / Barcode</th>
                        <th>Model</th>
                        <th>Wattage</th>
                        <th>Customer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(serials).length === 0 ? (
                        <tr><td colSpan="4" className="pm-empty">No panels registered yet.</td></tr>
                      ) : (
                        Object.keys(serials).slice(-5).reverse().map(key => (
                          <tr key={key} className="pm-row">
                            <td><code className="pm-serial-code">{key}</code></td>
                            <td style={{ fontWeight: '600', color: '#0f172a' }}>{serials[key].model}</td>
                            <td><span className="pm-badge watt">{serials[key].wattage}</span></td>
                            <td style={{ fontWeight: '500' }}>{serials[key].customerName || ''}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── Panel Manager ── */}
          {activeView === 'panels' && (
            <PanelManager
              serials={serials}
              onSerialsUpdate={setSerials}
            />
          )}

          {/* ── QR / Barcode Scanner ── */}
          {activeView === 'scanner' && (
            <div className="scanner-view-wrap">
              <div className="scanner-intro">
                <ScanLine size={28} />
                <div>
                  <h3>Panel Authenticity Scanner</h3>
                  <p>Scan a QR code or enter a barcode serial manually to instantly verify if a module is authenticated in the Trison database.</p>
                </div>
              </div>
              <QRScanner />
            </div>
          )}

          {/* ── Leads ── */}
          {activeView === 'leads' && (
            <InquiryLogs
              inquiries={inquiries}
              onInquiriesUpdate={setInquiries}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
