import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Search, Trash2, Edit2, X, Save, RefreshCw,
  ScanLine, CheckCircle, ToggleLeft, ToggleRight, Printer
} from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
  getAllPanels, savePanel, deletePanel,
  getRegistry, generateSerial, CLASS_OPTIONS, COUNTRY_OPTIONS
} from '../../services/authenticityService';
import Barcode from './Barcode';
import PrintOptionsModal from './PrintOptionsModal';

// ── Blank panel template with all 7 fields ────────────
const BLANK = {
  serial: '',
  model: '',
  wattage: '',
  technology: '',
  class: 'A',
  country: 'Pakistan',
  status: 'active',
  customerName: '',
  warrantyYears: 'Active and Validated',
  brand: 'Trison',
};

const PanelManager = ({ onSerialsUpdate }) => {
  const [panels, setPanels] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);   // original serial when editing
  const [form, setForm] = useState({ ...BLANK });
  const [toast, setToast] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [scanning, setScanning] = useState(false);
  const [printPanel, setPrintPanel] = useState(null);
  const scannerRef = useRef(null);
  const scannerInst = useRef(null);

  // Load panels (and keep the dashboard's serials state in sync)
  const reload = () => {
    setPanels(getAllPanels());
    if (onSerialsUpdate) onSerialsUpdate(getRegistry());
  };
  useEffect(() => { reload(); }, []);

  // Open the print-options modal (serial + barcode always; extras opt-in)
  const handlePrint = (panel) => setPrintPanel(panel);

  // Flash toast helper
  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleModelChange = (modelVal) => {
    setForm(f => ({
      ...f,
      model: modelVal,
    }));
  };

  // Persist form state for new panels so selections stay on refresh
  useEffect(() => {
    if (showForm && !editing) {
      const templateToSave = { ...form, serial: '' };
      localStorage.setItem('trison_panel_template', JSON.stringify(templateToSave));
    }
  }, [form, showForm, editing]);

  // Open Add form
  const openAdd = () => {
    const savedTemplate = JSON.parse(localStorage.getItem('trison_panel_template') || 'null') || BLANK;
    setForm({ ...savedTemplate, serial: generateSerial() });
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

  // ── Filter panels ─────────────────────────────────  // Filter data
  const filtered = panels.filter(p =>
    [p.serial, p.model, p.customerName, p.country, p.class]
      .some(v => (v || '').toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination logic
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedPanels = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const selectedModelLabel = form.model;

  if (showForm) {
    return (
      <div className="pm-root pm-form-view">
        {printPanel && <PrintOptionsModal panel={printPanel} onClose={() => setPrintPanel(null)} />}
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
                placeholder="e.g. TSCN260778934"
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

            {/* Live barcode preview + print */}
            {form.serial.trim() && !scanning && (
              <div className="pm-barcode-preview">
                <div className="pm-barcode-preview-head">
                  <span>Barcode Preview</span>
                  <button
                    type="button"
                    className="pm-btn-print"
                    onClick={() => handlePrint(form)}
                    title="Print barcode label"
                  >
                    <Printer size={14} /> Print Label
                  </button>
                </div>
                <Barcode value={form.serial.trim()} height={64} moduleWidth={2} />
              </div>
            )}
          </div>

          {/* ── Row: Model Number + Brand ─────── */}
          <div className="pm-row-2">
            {/* Field 2: Model Number */}
            <div className="pm-section">
              <label className="pm-section-title">Model Number *</label>
              <input
                className="pm-input"
                placeholder="e.g. TS21RN-66HT580W"
                value={form.model}
                onChange={e => {
                  const val = e.target.value;
                  const wattMatch = val.match(/(\d{3,}W)/i);
                  setForm(f => ({ 
                    ...f, 
                    model: val,
                    wattage: (wattMatch ? wattMatch[0].toUpperCase() : f.wattage),
                  }));
                }}
                list="model-options"
                required
              />
              <datalist id="model-options">
                {Array.from(new Set([
                  ...Array.from({ length: Math.floor((750 - 580) / 5) + 1 }, (_, i) => `TS21RN-66HT${580 + i * 5}W`),
                  ...panels.map(p => p.model).filter(Boolean)
                ])).sort().map(m => (
                  <option key={m} value={m} />
                ))}
              </datalist>
            </div>

            {/* Brand Input */}
            <div className="pm-section">
              <label className="pm-section-title">Brand / Plate Owner</label>
              <input
                className="pm-input"
                placeholder="e.g. Trison"
                value={form.brand}
                onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* ── Row: Wattage + Technology ─────── */}
          <div className="pm-row-2">
            {/* Wattage Input */}
            <div className="pm-section">
              <label className="pm-section-title">Wattage *</label>
              <input
                className="pm-input"
                placeholder="e.g. 580W"
                value={form.wattage}
                onChange={e => setForm(f => ({ ...f, wattage: e.target.value }))}
                required
              />
            </div>

            {/* Technology Input */}
            <div className="pm-section">
              <label className="pm-section-title">Technology</label>
              <input
                className="pm-input"
                placeholder="e.g. Bifacial Mono PERC"
                value={form.technology}
                onChange={e => setForm(f => ({ ...f, technology: e.target.value }))}
              />
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
              <input
                className="pm-input"
                placeholder="e.g. Pakistan"
                value={form.country}
                onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* ── Row: Customer + Warranty ──── */}
          <div className="pm-row-2">
            {/* Field 5: Customer */}
            <div className="pm-section">
              <label className="pm-section-title">Customer / Project Name (Optional)</label>
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
              <input
                className="pm-input"
                placeholder="e.g. Active and Validated"
                value={form.warrantyYears}
                onChange={e => setForm(f => ({ ...f, warrantyYears: e.target.value }))}
                required
              />
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
      {printPanel && <PrintOptionsModal panel={printPanel} onClose={() => setPrintPanel(null)} />}

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
            {paginatedPanels.length === 0 ? (
              <tr>
                <td colSpan="10" className="pm-empty">
                  {search ? 'No matching panels.' : 'No panels registered yet. Click "Register Panel" to begin.'}
                </td>
              </tr>
            ) : (
              paginatedPanels.map((p, i) => (
                <tr key={p.serial} className="pm-row">
                  <td data-label="#">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td data-label="Serial Number"><code className="pm-serial-code">{p.serial}</code></td>
                  <td data-label="Model" className="pm-model-cell">{p.model}</td>
                  <td data-label="Wattage"><span className="pm-badge watt">{p.wattage}</span></td>
                  <td data-label="Class">
                    <span className={`pm-badge class-badge class-${(p.class || 'A').toLowerCase()}`}>
                      {p.class || 'A'}
                    </span>
                  </td>
                  <td data-label="Country">{p.country || 'Pakistan'}</td>
                  <td data-label="Customer" className="pm-customer">{p.customerName || ''}</td>
                  <td data-label="Warranty">{p.warrantyYears ? (isNaN(p.warrantyYears) ? p.warrantyYears : `${p.warrantyYears} Yrs`) : <span className="pm-dash">—</span>}</td>
                  <td data-label="Status">
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
                  <td data-label="Actions">
                    <div className="pm-actions">
                      <button className="pm-btn-print-sm" onClick={() => handlePrint(p)} title="Print barcode label"><Printer size={13} /></button>
                      <button className="pm-btn-edit" onClick={() => openEdit(p)} title="Edit"><Edit2 size={13} /></button>
                      <button className="pm-btn-delete" onClick={() => handleDelete(p.serial)} title="Delete"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pm-pagination-wrap">
        <div className="pm-count">
          Showing {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} panels
        </div>
        {totalPages > 1 && (
          <div className="pm-pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="pm-page-btn"
            >
              Prev
            </button>
            <span className="pm-page-info">{currentPage} / {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="pm-page-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PanelManager;
