import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Search, Trash2, Edit2, X, Save, RefreshCw,
  ScanLine, CheckCircle, ToggleLeft, ToggleRight, ChevronDown
} from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
  getAllPanels, savePanel, deletePanel,
  generateSerial, PANEL_MODELS, CLASS_OPTIONS, COUNTRY_OPTIONS
} from '../../services/authenticityService';

// ── Blank panel template with all 7 fields ────────────
const BLANK = {
  serial: '',
  model: PANEL_MODELS[0].model,
  wattage: PANEL_MODELS[0].wattage,
  technology: PANEL_MODELS[0].technology,
  class: 'A',
  country: 'Pakistan',
  status: 'active',
  customerName: '',
  warrantyYears: '25',
  brand: 'Trison',
};

const PanelManager = () => {
  const [panels, setPanels] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);   // original serial when editing
  const [form, setForm] = useState({ ...BLANK });
  const [toast, setToast] = useState('');
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef(null);
  const scannerInst = useRef(null);

  // Load panels
  const reload = () => setPanels(getAllPanels());
  useEffect(() => { reload(); }, []);

  // Flash toast helper
  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  // Pick model → auto-fill wattage & technology
  const handleModelChange = (modelVal) => {
    const found = PANEL_MODELS.find(m => m.model === modelVal);
    setForm(f => ({
      ...f,
      model: found?.model || modelVal,
      wattage: found?.wattage || f.wattage,
      technology: found?.technology || f.technology,
    }));
  };

  // Open Add form
  const openAdd = () => {
    setForm({ ...BLANK, serial: generateSerial() });
    setEditing(null);
    setShowForm(true);
  };

  // Open Edit form
  const openEdit = (panel) => {
    setForm({ ...BLANK, ...panel });
    setEditing(panel.serial);
    setShowForm(true);
  };

  // Close form
  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    stopScanner();
  };

  // Save / update
  const handleSave = (e) => {
    e.preventDefault();
    if (!form.serial.trim()) return;
    try {
      // If editing and serial changed, delete old entry first
      if (editing && editing !== form.serial.trim()) deletePanel(editing);
      savePanel(form);
      reload();
      closeForm();
      flash(editing ? 'Panel updated successfully!' : 'Panel registered successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete
  const handleDelete = (serial) => {
    if (!window.confirm(`Delete serial: ${serial}?`)) return;
    deletePanel(serial);
    reload();
    flash('Panel deleted from database.');
  };

  // Toggle status inline
  const handleToggleStatus = (panel) => {
    savePanel({ ...panel, status: panel.status === 'active' ? 'inactive' : 'active' });
    reload();
  };

  // ── QR / Barcode scanner for serial field ─────────
  const startScanner = () => {
    setScanning(true);
    setTimeout(() => {
      if (!scannerRef.current) return;
      const sc = new Html5QrcodeScanner(
        'pm-qr-region',
        { fps: 10, qrbox: { width: 240, height: 120 }, aspectRatio: 2 },
        false
      );
      sc.render(
        (decoded) => {
          sc.clear().catch(() => { });
          scannerInst.current = null;
          setScanning(false);
          setForm(f => ({ ...f, serial: decoded.trim() }));
        },
        () => { }
      );
      scannerInst.current = sc;
    }, 150);
  };

  const stopScanner = () => {
    if (scannerInst.current) {
      scannerInst.current.clear().catch(() => { });
      scannerInst.current = null;
    }
    setScanning(false);
  };

  // ── Filter panels ─────────────────────────────────
  const filtered = panels.filter(p =>
    [p.serial, p.model, p.customerName, p.country, p.class]
      .some(v => (v || '').toLowerCase().includes(search.toLowerCase()))
  );

  const selectedModelLabel = PANEL_MODELS.find(m => m.model === form.model)?.label || form.model;

  if (showForm) {
    return (
      <div className="pm-root pm-form-view">
        <div className="pm-modal-header" style={{ padding: '0 0 20px 0', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>
            {editing ? 'Edit Panel Entry' : 'Register New Panel'}
          </h3>
          <button className="pm-modal-close" onClick={closeForm}><X size={18} /></button>
        </div>

        <form className="pm-form-body-inline" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* ── Field 1: Serial Number ─────── */}
          <div className="pm-section">
            <label className="pm-section-title">Serial Number *</label>
            <div className="pm-serial-row">
              <input
                className="pm-input pm-serial-input"
                placeholder="e.g. TSCN-2607-78934"
                value={form.serial}
                onChange={e => setForm(f => ({ ...f, serial: e.target.value }))}
                required
              />
              <button
                type="button"
                className="pm-btn-gen"
                onClick={() => setForm(f => ({ ...f, serial: generateSerial() }))}
                title="Auto-generate serial"
              >
                <RefreshCw size={14} /> Auto
              </button>
              <button
                type="button"
                className={`pm-btn-scan ${scanning ? 'active' : ''}`}
                onClick={scanning ? stopScanner : startScanner}
                title="Scan barcode"
              >
                <ScanLine size={14} /> {scanning ? 'Stop' : 'Scan'}
              </button>
            </div>
            {scanning && (
              <div className="pm-scanner-box">
                <p className="pm-scanner-hint">Point camera at barcode or QR code on the panel</p>
                <div id="pm-qr-region" ref={scannerRef} />
              </div>
            )}
          </div>

          {/* ── Row: Model Number + Brand ─────── */}
          <div className="pm-row-2">
            {/* Field 2: Model Number */}
            <div className="pm-section">
              <label className="pm-section-title">Model Number *</label>
              <div className="pm-select-wrap">
                <select
                  className="pm-select"
                  value={form.model}
                  onChange={e => handleModelChange(e.target.value)}
                >
                  {PANEL_MODELS.map(m => (
                    <option key={m.model} value={m.model}>{m.label}</option>
                  ))}
                </select>
                <ChevronDown size={15} className="pm-select-icon" />
              </div>
            </div>

            {/* Brand Selector */}
            <div className="pm-section">
              <label className="pm-section-title">Brand / Plate Owner</label>
              <div className="pm-select-wrap">
                <select
                  className="pm-select"
                  value={form.brand}
                  onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                >
                  <option value="Trison">Trison</option>
                  <option value="LONGI Solar">LONGI Solar</option>
                </select>
                <ChevronDown size={15} className="pm-select-icon" />
              </div>
            </div>
          </div>

          <div className="pm-section" style={{ marginTop: '-8px' }}>
            <div className="pm-auto-filled">
              <span>Wattage: <strong>{form.wattage}</strong></span>
              <span>Technology: <strong>{form.technology}</strong></span>
            </div>
          </div>

          {/* ── Row: Class + Country ─────────── */}
          <div className="pm-row-2">
            {/* Field 3: Class */}
            <div className="pm-section">
              <label className="pm-section-title">Module Class</label>
              <div className="pm-class-toggle">
                {CLASS_OPTIONS.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    className={`pm-class-btn ${form.class === c.value ? 'selected' : ''}`}
                    onClick={() => setForm(f => ({ ...f, class: c.value }))}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Field 4: Country */}
            <div className="pm-section">
              <label className="pm-section-title">Country Entered</label>
              <div className="pm-select-wrap">
                <select
                  className="pm-select"
                  value={form.country}
                  onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                >
                  {COUNTRY_OPTIONS.map(c => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown size={15} className="pm-select-icon" />
              </div>
            </div>
          </div>

          {/* ── Row: Customer + Warranty ──── */}
          <div className="pm-row-2">
            {/* Field 5: Customer */}
            <div className="pm-section">
              <label className="pm-section-title">Customer / Project Name</label>
              <input
                className="pm-input"
                placeholder="e.g. Al-Noor Solar Project"
                value={form.customerName}
                onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
              />
            </div>

            {/* Field 6: Warranty */}
            <div className="pm-section">
              <label className="pm-section-title">Warranty Period</label>
              <div className="pm-select-wrap">
                <select
                  className="pm-select"
                  value={form.warrantyYears}
                  onChange={e => setForm(f => ({ ...f, warrantyYears: e.target.value }))}
                >
                  {['10', '12', '15', '25', '30'].map(y => (
                    <option key={y} value={y}>{y} Years</option>
                  ))}
                </select>
                <ChevronDown size={15} className="pm-select-icon" />
              </div>
            </div>
          </div>

          {/* ── Field 7: Status ──────────────── */}
          <div className="pm-section">
            <label className="pm-section-title">Panel Status</label>
            <div className="pm-status-row">
              <button
                type="button"
                className={`pm-status-btn ${form.status === 'active' ? 'active' : ''}`}
                onClick={() => setForm(f => ({ ...f, status: 'active' }))}
              >
                <ToggleRight size={16} /> Active
              </button>
              <button
                type="button"
                className={`pm-status-btn ${form.status === 'inactive' ? 'inactive-sel' : ''}`}
                onClick={() => setForm(f => ({ ...f, status: 'inactive' }))}
              >
                <ToggleLeft size={16} /> Inactive
              </button>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="pm-modal-actions" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', marginTop: '10px' }}>
            <button type="button" className="pm-btn-cancel" onClick={closeForm}>Cancel</button>
            <button type="submit" className="pm-btn-save">
              <Save size={15} /> {editing ? 'Update Panel' : 'Register Panel'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="pm-root">
      {/* ── Toolbar ── */}
      <div className="pm-topbar">
        <div className="pm-search">
          <Search size={15} className="pm-search-icon" />
          <input
            placeholder="Search serial, model, customer, country..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="pm-btn-add" onClick={openAdd}>
          <Plus size={16} /> Register Panel
        </button>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className="pm-toast">
          <CheckCircle size={15} /> {toast}
        </div>
      )}

      {/* ── Data Table ── */}
      <div className="pm-table-wrap">
        <table className="pm-tbl">
          <thead>
            <tr>
              <th>#</th>
              <th>Serial Number</th>
              <th>Model</th>
              <th>Wattage</th>
              <th>Class</th>
              <th>Country</th>
              <th>Customer</th>
              <th>Warranty</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="10" className="pm-empty">
                  {search ? 'No matching panels.' : 'No panels registered yet. Click "Register Panel" to begin.'}
                </td>
              </tr>
            ) : (
              filtered.map((p, i) => (
                <tr key={p.serial} className="pm-row">
                  <td className="pm-num">{i + 1}</td>
                  <td><code className="pm-serial-code">{p.serial}</code></td>
                  <td className="pm-model-cell">{p.model}</td>
                  <td><span className="pm-badge watt">{p.wattage}</span></td>
                  <td>
                    <span className={`pm-badge class-badge class-${(p.class || 'A').toLowerCase()}`}>
                      {p.class || 'A'}
                    </span>
                  </td>
                  <td>{p.country || 'Pakistan'}</td>
                  <td className="pm-customer">{p.customerName || ''}</td>
                  <td>{p.warrantyYears ? `${p.warrantyYears} Yrs` : <span className="pm-dash">—</span>}</td>
                  <td>
                    <button
                      className={`pm-status-toggle ${p.status === 'active' ? 'active' : 'inactive'}`}
                      onClick={() => handleToggleStatus(p)}
                      title="Click to toggle status"
                    >
                      {p.status === 'active'
                        ? <><ToggleRight size={16} /> Active</>
                        : <><ToggleLeft size={16} /> Inactive</>
                      }
                    </button>
                  </td>
                  <td>
                    <div className="pm-actions">
                      <button className="pm-btn-edit" onClick={() => openEdit(p)}><Edit2 size={13} /></button>
                      <button className="pm-btn-delete" onClick={() => handleDelete(p.serial)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pm-count">{filtered.length} of {panels.length} panels</div>
    </div>
  );
};

export default PanelManager;
