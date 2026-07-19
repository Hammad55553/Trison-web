import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Cpu, ScanLine, ClipboardList, LogOut, LayoutGrid, X } from 'lucide-react';
import AdminStats from '../../components/admin/AdminStats';
import PanelManager from '../../components/admin/PanelManager';
import QRScanner from '../../components/admin/QRScanner';
import InquiryLogs from '../../components/admin/InquiryLogs';
import { getCustomRegistry } from '../../services/authenticityService';
import { getInquiries } from '../../services/leadService';
import trisonLogo from '../../assets/images/TRISON.jpg';
import './AdminPage.css';

const VIEWS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'panels', label: 'Panel Manager', icon: Cpu },
  { key: 'scanner', label: 'Scan & Verify', icon: ScanLine },
  { key: 'leads', label: 'Sales Leads', icon: ClipboardList },
];

const AdminPage = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [serials, setSerials] = useState({});
  const [inquiries, setInquiries] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setSerials(getCustomRegistry());
    setInquiries(getInquiries());
  }, []);

  // Refresh data whenever tab changes (so counts stay fresh)
  useEffect(() => {
    setSerials(getCustomRegistry());
    setInquiries(getInquiries());
  }, [activeView]);

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

        <div className="sidebar-footer">
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
                  <span className="quick-link">Open →</span>
                </div>
                <div className="dash-quick-card" onClick={() => setActiveView('scanner')}>
                  <ScanLine size={26} />
                  <h3>Scan & Verify</h3>
                  <p>Use camera or manual entry to verify if a panel serial number is authentic.</p>
                  <span className="quick-link">Open →</span>
                </div>
                <div className="dash-quick-card" onClick={() => setActiveView('leads')}>
                  <ClipboardList size={26} />
                  <h3>Sales Leads</h3>
                  <p>View and manage all incoming dealer and distributor inquiry submissions.</p>
                  <span className="quick-link">Open →</span>
                </div>
              </div>

              {/* Recent Serials Table Preview */}
              <div className="dash-recent-block">
                <div className="dash-recent-header">
                  <h3>Recently Registered Panels</h3>
                  <button className="dash-view-all" onClick={() => setActiveView('panels')}>View All →</button>
                </div>
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
