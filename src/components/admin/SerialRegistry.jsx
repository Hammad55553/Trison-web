import React, { useState } from 'react';
import { Plus, Search, Trash2, CheckCircle } from 'lucide-react';
import { getCustomRegistry, registerCustomPanel } from '../../services/authenticityService';

const SerialRegistry = ({ serials, onSerialsUpdate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const getInitialNewPanel = () => {
    const saved = localStorage.getItem('trison_sr_template');
    if (saved) {
      try { return { ...JSON.parse(saved), barcode: '' }; } catch (e) {}
    }
    return {
      barcode: '',
      brand: 'Trison',
      model: 'TS-Premium-580M',
      wattage: '580W',
      customerName: '',
      warrantyYears: '25',
      technology: 'Bifacial Mono PERC'
    };
  };

  const [newPanel, setNewPanel] = useState(getInitialNewPanel);

  React.useEffect(() => {
    const templateToSave = { ...newPanel, barcode: '' };
    localStorage.setItem('trison_sr_template', JSON.stringify(templateToSave));
  }, [newPanel]);

  const handleAddPanel = (e) => {
    e.preventDefault();
    if (!newPanel.barcode.trim()) return;
    try {
      registerCustomPanel(newPanel);
      onSerialsUpdate(getCustomRegistry());
      setNewPanel(prev => ({
        ...prev,
        barcode: ''
      }));
      setStatusMsg('Serial number registered successfully!');
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteSerial = (barcode) => {
    if (window.confirm(`Are you sure you want to delete Serial ${barcode}?`)) {
      const registry = getCustomRegistry();
      delete registry[barcode];
      localStorage.setItem('trison_registered_panels', JSON.stringify(registry));
      onSerialsUpdate(getCustomRegistry());
    }
  };

  const filteredSerials = Object.keys(serials).filter(key =>
    key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (serials[key].customerName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-panel-box">
      <h2>Panel Authenticity Register (Verifier DB)</h2>
      <p className="box-desc">Add new monocrystalline serial keys to make them verifiable for customers.</p>

      <form onSubmit={handleAddPanel} className="admin-add-form">
        <div className="form-row">
          <div className="input-group">
            <label>Serial Barcode *</label>
            <input
              type="text"
              placeholder="e.g. TRPI778902"
              value={newPanel.barcode}
              onChange={e => setNewPanel({ ...newPanel, barcode: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <label>Target Customer Name</label>
            <input
              type="text"
              placeholder="e.g. Al-Fatah Projects"
              value={newPanel.customerName}
              onChange={e => setNewPanel({ ...newPanel, customerName: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="input-group">
            <label>Module Model</label>
            <input
              type="text"
              value={newPanel.model}
              onChange={e => {
                const val = e.target.value;
                const wattMatch = val.match(/(\d{3,}W)/i);
                setNewPanel(p => ({ 
                  ...p, 
                  model: val,
                  wattage: wattMatch ? wattMatch[0].toUpperCase() : p.wattage 
                }));
              }}
              list="sr-model-options"
            />
            <datalist id="sr-model-options">
              {Array.from(new Set([
                ...Array.from({ length: Math.floor((750 - 580) / 5) + 1 }, (_, i) => `TS21RN-66HT${580 + i * 5}W`),
                ...Object.values(serials).map(p => p.model).filter(Boolean)
              ])).sort().map(m => (
                <option key={m} value={m} />
              ))}
            </datalist>
          </div>
          <div className="input-group">
            <label>Wattage Output</label>
            <input
              type="text"
              value={newPanel.wattage}
              onChange={e => setNewPanel({ ...newPanel, wattage: e.target.value })}
            />
          </div>
        </div>

        <button type="submit" className="btn-admin-add">
          <Plus size={16} /> Register Serial Key
        </button>
      </form>

      {statusMsg && (
        <div className="admin-status-toast">
          <CheckCircle size={14} /> {statusMsg}
        </div>
      )}

      {/* Serial Database Table */}
      <div className="serial-list-wrapper">
        <div className="serial-list-header">
          <h3>Registered Serial Keys</h3>
          <div className="search-bar-wrap">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search serials..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Serial / Barcode</th>
                <th>Model</th>
                <th>Wattage</th>
                <th>Client / Customer</th>
                <th style={{ width: '80px', textAlign: 'center' }}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredSerials.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-row">No matching serial numbers found in database.</td>
                </tr>
              ) : (
                filteredSerials.map((key) => (
                  <tr key={key}>
                    <td><strong>{key}</strong></td>
                    <td>{serials[key].model}</td>
                    <td>{serials[key].wattage}</td>
                    <td>{serials[key].customerName || 'N/A'}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button onClick={() => handleDeleteSerial(key)} className="btn-delete-action">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SerialRegistry;
