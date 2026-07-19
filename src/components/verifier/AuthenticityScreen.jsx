import React, { useState } from 'react';
import Card from '../common/Card';
import { verifyAuthenticity, registerCustomPanel, registerBulkPanels, generateCustomBarcode } from '../../services/authenticityService';
import { Search, Loader2, CheckCircle2, AlertTriangle, Cpu, Calendar, ShieldCheck, Tag, PlusCircle, HelpCircle, FileText, Upload, Globe } from 'lucide-react';
import './AuthenticityScreen.css';

const AuthenticityScreen = () => {
  const [activeTab, setActiveTab] = useState('verify'); // 'verify' | 'register'
  const [regMode, setRegMode] = useState('single'); // 'single' | 'bulk'

  // Verification states
  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Single Registration states
  const [regData, setRegData] = useState({
    barcode: '',
    brand: 'Trison',
    model: 'TS-Premium-580M',
    wattage: '580W',
    customerName: '',
    warrantyYears: '25',
    technology: 'Bifacial Mono PERC'
  });
  const [regStatus, setRegStatus] = useState({ type: '', message: '' });

  // Bulk Registration states
  const [bulkBarcodes, setBulkBarcodes] = useState('');
  const [bulkData, setBulkData] = useState({
    brand: 'Trison',
    model: 'TS-Premium-580M',
    wattage: '580W',
    customerName: 'Trison Project Client',
    warrantyYears: '25',
    technology: 'Bifacial Mono PERC'
  });
  const [bulkStatus, setBulkStatus] = useState({ type: '', message: '' });

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!barcode.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await verifyAuthenticity(barcode);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to verify. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setRegStatus({ type: '', message: '' });

    try {
      if (!regData.barcode.trim()) {
        throw new Error("Please enter or generate a barcode.");
      }
      if (!regData.customerName.trim()) {
        throw new Error("Please enter client/customer name for warranty registration.");
      }

      registerCustomPanel(regData);
      setRegStatus({
        type: 'success',
        message: `Panel [${regData.barcode}] successfully registered! You can now verify it.`
      });
    } catch (err) {
      setRegStatus({
        type: 'error',
        message: err.message || 'Registration failed.'
      });
    }
  };

  const handleBulkRegister = (e) => {
    e.preventDefault();
    setBulkStatus({ type: '', message: '' });

    try {
      if (!bulkBarcodes.trim()) {
        throw new Error("Please enter or upload a list of barcodes.");
      }

      // Split lines and clean
      const lines = bulkBarcodes.split('\n').map(line => line.trim()).filter(line => line.length > 0);

      const panelsArray = lines.map(line => {
        // Support CSV layout: barcode, customerName, model, wattage
        if (line.includes(',')) {
          const parts = line.split(',');
          return {
            barcode: parts[0]?.trim(),
            customerName: parts[1]?.trim() || bulkData.customerName,
            model: parts[2]?.trim() || bulkData.model,
            wattage: parts[3]?.trim() || bulkData.wattage,
            brand: bulkData.brand,
            warrantyYears: bulkData.warrantyYears,
            technology: bulkData.technology
          };
        }
        // Else just use the line as barcode and apply bulk default specs
        return {
          barcode: line,
          ...bulkData
        };
      });

      const response = registerBulkPanels(panelsArray);
      setBulkStatus({
        type: 'success',
        message: `${response.count} panels registered successfully in bulk database registry!`
      });
      setBulkBarcodes('');
    } catch (err) {
      setBulkStatus({
        type: 'error',
        message: err.message || 'Bulk registration failed.'
      });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setBulkBarcodes(text);
    };
    reader.readAsText(file);
  };

  const handleGenerateBarcode = () => {
    const code = generateCustomBarcode(regData.brand);
    setRegData(prev => ({
      ...prev,
      barcode: code
    }));
  };

  const loadSampleCode = () => {
    setBarcode('LRPI04109241102416062');
  };

  const testRegisteredBarcode = () => {
    setBarcode(regData.barcode);
    setActiveTab('verify');
    // Trigger verification instantly
    setLoading(true);
    setError('');
    setResult(null);
    setTimeout(async () => {
      try {
        const data = await verifyAuthenticity(regData.barcode);
        setResult(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  return (
    <section id="authenticity" className="authenticity-section">
      <div className="section-header">
        <h2 className="section-title">
          Database <span className="shimmer-text">Verification & Registry</span>
        </h2>
        <p className="section-subtitle">
          Verify imported LONGI panels via global APIs or register your custom Trison plates with active customer warranty tracking.
        </p>
      </div>

      {/* Tabs Row */}
      <div className="auth-tabs">
        <button
          className={`tab-btn ${activeTab === 'verify' ? 'active' : ''}`}
          onClick={() => setActiveTab('verify')}
        >
          <Search size={16} /> Verify Module Barcode
        </button>
        <button
          className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => setActiveTab('register')}
        >
          <PlusCircle size={16} /> Register Panels / Warranty
        </button>
      </div>

      <div className="authenticity-grid">
        {activeTab === 'verify' ? (
          /* VERIFICATION PANEL */
          <>
            <Card className="auth-form-card" glow={true} interactive={false}>
              <h3 className="auth-card-title">Check Module Status</h3>
              <p className="auth-card-desc">Enter any registered barcode or official LONGI barcode to retrieve consolidated specifications.</p>

              <form onSubmit={handleVerify} className="auth-form">
                <div className="search-input-wrapper">
                  <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="Enter barcode (e.g. LR... or TRI...)"
                    className="search-input"
                    required
                  />
                  <button type="submit" className="btn-search" disabled={loading}>
                    {loading ? <Loader2 className="spinner" size={18} /> : <Search size={18} />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={loadSampleCode}
                  className="btn-sample"
                >
                  Paste LONGI Sample Barcode
                </button>
              </form>

              <div className="barcode-guideline">
                <h4>Where to find the barcode?</h4>
                <p>Look for a white label containing a barcode and an alphanumeric string starting with "LR..." on the side frame or back sheet of the panel.</p>
                <div className="fake-barcode-sticker">
                  <div className="sticker-laser-line"></div>
                  <div className="barcode-lines">
                    <span></span><span></span><span></span><span></span><span></span>
                    <span></span><span></span><span></span><span></span><span></span>
                    <span></span><span></span><span></span><span></span><span></span>
                  </div>
                  <span className="barcode-string">LRPI 04109 24110 2416 062</span>
                </div>
              </div>
            </Card>

            <div className="auth-result-wrapper">
              {loading && (
                <div className="auth-status-card loading-card glass">
                  <div className="scanner-line"></div>
                  <Loader2 className="spinner status-large-icon" size={40} />
                  <h3>Querying Database Registries</h3>
                  <p>Consolidating data logs for: <strong>{barcode}</strong></p>
                </div>
              )}

              {!loading && !result && !error && (
                <div className="auth-status-card empty-card glass">
                  {/* High-tech Scanning Image Visual */}
                  <div className="image-scanner-container">
                    <img src="/solar_barcode_scanner.png" alt="Solar Panel Scanning" className="scanner-img" />
                    <div className="image-laser-line"></div>
                  </div>
                  <h3>Ready for Scanning</h3>
                  <p>Scan or input a module serial number to trigger verification logs.</p>

                  <div className="radar-badges">
                    <span className="radar-badge">⚡ Real-time API</span>
                    <span className="radar-badge">🔒 Encrypted</span>
                    <span className="radar-badge">📂 Multi-DB</span>
                  </div>
                </div>
              )}

              {!loading && error && (
                <div className="auth-status-card error-card glass">
                  <AlertTriangle className="status-large-icon text-orange" size={48} />
                  <h3>Record Not Found</h3>
                  <p>{error}</p>
                </div>
              )}

              {!loading && result && (
                <Card className="auth-status-card success-card" interactive={false}>
                  <div className="success-header">
                    <CheckCircle2 className="success-badge-icon" size={32} />
                    <div>
                      <span className="verified-tag">Genuine Record Match</span>
                      <h3>{result.brand || 'Trison'} Authenticated</h3>
                    </div>
                  </div>

                  <div className="auth-meta-grid">
                    <div className="meta-item">
                      <Cpu className="meta-icon" />
                      <div>
                        <span className="meta-label">Serial Number</span>
                        <span className="meta-value" style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                          {result.serial || result.moduleId}
                        </span>
                      </div>
                    </div>

                    <div className="meta-item">
                      <Cpu className="meta-icon" />
                      <div>
                        <span className="meta-label">Model Type</span>
                        <span className="meta-value">{result.model || result.productionType || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="meta-item">
                      <ShieldCheck className="meta-icon" />
                      <div>
                        <span className="meta-label">Module Level</span>
                        <span className="meta-value text-green">
                          {result.class ? `Class ${result.class}` : (result.moduleLevel || 'Class A')}
                        </span>
                      </div>
                    </div>

                    {result.source !== 'Trison Local Registry' && (result.registeredAt || result.manufactureDate) && (
                      <div className="meta-item">
                        <Calendar className="meta-icon" />
                        <div>
                          <span className="meta-label">Registered/Mfg Date</span>
                          <span className="meta-value">
                            {result.registeredAt ? result.registeredAt.split('T')[0] : (result.manufactureDate || 'N/A')}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="meta-item">
                      <Tag className="meta-icon" />
                      <div>
                        <span className="meta-label">Power Output</span>
                        <span className="meta-value">{result.wattage || '580W'}</span>
                      </div>
                    </div>

                    {/* New/Extra clean DB fields */}
                    {result.country && (
                      <div className="meta-item">
                        <Globe className="meta-icon" />
                        <div>
                          <span className="meta-label">Country Entered</span>
                          <span className="meta-value">{result.country}</span>
                        </div>
                      </div>
                    )}

                    {result.status && (
                      <div className="meta-item">
                        <ShieldCheck className="meta-icon" />
                        <div>
                          <span className="meta-label">Status</span>
                          <span className="meta-value" style={{ textTransform: 'capitalize' }}>
                            {result.status}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {(result.localWarranty || result.warrantyYears) && (
                    <div className="warranty-specs glass">
                      <h4>Distributor Warranty Details</h4>
                      {(result.customerName || (result.localWarranty && result.localWarranty.customerName)) && (
                        <p>
                          <strong>Customer Name:</strong>{' '}
                          {result.customerName || (result.localWarranty && result.localWarranty.customerName)}
                        </p>
                      )}
                      <p>
                        <strong>Active Warranty:</strong>{' '}
                        {result.warrantyYears || (result.localWarranty && result.localWarranty.warrantyYears) || '25'} Years Replacement
                      </p>
                      <p><strong>Status:</strong> Active & Validated</p>
                    </div>
                  )}

                </Card>
              )}
            </div>
          </>
        ) : (
          /* REGISTRATION PANEL */
          <>
            <Card className="auth-form-card" glow={true} interactive={false}>
              <div className="reg-mode-selectors">
                <button
                  type="button"
                  className={`mode-btn ${regMode === 'single' ? 'active' : ''}`}
                  onClick={() => setRegMode('single')}
                >
                  Single Panel Entry
                </button>
                <button
                  type="button"
                  className={`mode-btn ${regMode === 'bulk' ? 'active' : ''}`}
                  onClick={() => setRegMode('bulk')}
                >
                  Bulk Import List / CSV
                </button>
              </div>

              {regMode === 'single' ? (
                /* SINGLE REGISTRATION MODE */
                <form onSubmit={handleRegister} className="registration-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="reg-brand">Brand / Plate Owner</label>
                      <select
                        id="reg-brand"
                        value={regData.brand}
                        onChange={(e) => setRegData({ ...regData, brand: e.target.value })}
                      >
                        <option value="Trison">Trison</option>
                        <option value="LONGI Solar">LONGI Solar</option>
                        <option value="JinkoSolar">Jinko Solar</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="reg-model">Model Name</label>
                      <input
                        id="reg-model"
                        type="text"
                        value={regData.model}
                        onChange={(e) => setRegData({ ...regData, model: e.target.value })}
                        placeholder="e.g. TS-Premium-580M"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="reg-wattage">Wattage Rating</label>
                      <input
                        id="reg-wattage"
                        type="text"
                        value={regData.wattage}
                        onChange={(e) => setRegData({ ...regData, wattage: e.target.value })}
                        placeholder="e.g. 580W"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="reg-tech">Technology</label>
                      <input
                        id="reg-tech"
                        type="text"
                        value={regData.technology}
                        onChange={(e) => setRegData({ ...regData, technology: e.target.value })}
                        placeholder="e.g. Bifacial Mono PERC"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="reg-customer">Customer / Client Name (for Warranty) *</label>
                    <input
                      id="reg-customer"
                      type="text"
                      value={regData.customerName}
                      onChange={(e) => setRegData({ ...regData, customerName: e.target.value })}
                      placeholder="e.g. Tariq Mehmood"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="reg-barcode">Plate Barcode / Serial Number *</label>
                    <div className="barcode-gen-wrapper">
                      <input
                        id="reg-barcode"
                        type="text"
                        value={regData.barcode}
                        onChange={(e) => setRegData({ ...regData, barcode: e.target.value })}
                        placeholder="Enter custom barcode or generate one..."
                        required
                      />
                      <button
                        type="button"
                        onClick={handleGenerateBarcode}
                        className="btn-secondary btn-gen"
                      >
                        Auto-Generate
                      </button>
                    </div>
                  </div>

                  {regStatus.message && (
                    <div className={`status-banner banner-${regStatus.type}`}>
                      {regStatus.type === 'success' ? (
                        <CheckCircle2 className="status-banner-icon" />
                      ) : (
                        <AlertTriangle className="status-banner-icon" />
                      )}
                      <span>{regStatus.message}</span>
                    </div>
                  )}

                  <div className="reg-actions-row">
                    <button type="submit" className="btn-primary">
                      Register Plate Database
                    </button>
                    {regStatus.type === 'success' && (
                      <button
                        type="button"
                        onClick={testRegisteredBarcode}
                        className="btn-secondary"
                      >
                        Verify This Plate Now
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                /* BULK REGISTRATION MODE */
                <form onSubmit={handleBulkRegister} className="registration-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="bulk-brand">Default Brand</label>
                      <select
                        id="bulk-brand"
                        value={bulkData.brand}
                        onChange={(e) => setBulkData({ ...bulkData, brand: e.target.value })}
                      >
                        <option value="Trison">Trison</option>
                        <option value="LONGI Solar">LONGI Solar</option>
                        <option value="JinkoSolar">Jinko Solar</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="bulk-model">Default Model Name</label>
                      <input
                        id="bulk-model"
                        type="text"
                        value={bulkData.model}
                        onChange={(e) => setBulkData({ ...bulkData, model: e.target.value })}
                        placeholder="e.g. TS-Premium-580M"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="bulk-customer">Default Client / Project Name</label>
                      <input
                        id="bulk-customer"
                        type="text"
                        value={bulkData.customerName}
                        onChange={(e) => setBulkData({ ...bulkData, customerName: e.target.value })}
                        placeholder="e.g. DHA Project Batch 1"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="bulk-warranty">Default Warranty Years</label>
                      <input
                        id="bulk-warranty"
                        type="number"
                        value={bulkData.warrantyYears}
                        onChange={(e) => setBulkData({ ...bulkData, warrantyYears: e.target.value })}
                        placeholder="25"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="bulk-barcodes-header">
                      <label htmlFor="bulk-list">Paste Barcodes (One per line) OR upload CSV</label>
                      <div className="file-upload-btn-wrapper">
                        <label className="file-upload-label">
                          <Upload size={14} /> Upload CSV
                          <input type="file" accept=".csv, .txt" onChange={handleFileUpload} />
                        </label>
                      </div>
                    </div>
                    <textarea
                      id="bulk-list"
                      rows="6"
                      value={bulkBarcodes}
                      onChange={(e) => setBulkBarcodes(e.target.value)}
                      placeholder="Paste barcodes list here...&#10;Format: barcode&#10;Or CSV: barcode, customerName, model, wattage&#10;&#10;e.g.&#10;LRPI04109241102416062&#10;LRPI04109241102416063, Tariq Khan, TS-Bifacial-600M, 600W"
                      required
                    ></textarea>
                  </div>

                  {bulkStatus.message && (
                    <div className={`status-banner banner-${bulkStatus.type}`}>
                      {bulkStatus.type === 'success' ? (
                        <CheckCircle2 className="status-banner-icon" />
                      ) : (
                        <AlertTriangle className="status-banner-icon" />
                      )}
                      <span>{bulkStatus.message}</span>
                    </div>
                  )}

                  <button type="submit" className="btn-primary">
                    Import & Register Bulk List
                  </button>
                </form>
              )}
            </Card>

            {/* Instruction Side Card */}
            <div className="auth-result-wrapper">
              <Card className="auth-status-card info-card glass" interactive={false}>
                <FileText className="status-large-icon text-gold" size={44} />
                <h3>Bulk Import Instructions</h3>
                <p className="left-align-text">
                  Adding panels in thousands is now simple. Choose "Bulk Import List / CSV" and perform one of the following operations:
                </p>
                <ul className="info-bullets">
                  <li><strong>Paste Raw Serials</strong>: Paste a list of serials directly. All default values (Brand, Model, Wattage, Customer) will apply to the entire batch.</li>
                  <li><strong>Paste CSV Format</strong>: Paste lines separated by commas containing: `barcode, customerName, model, wattage` (e.g., `LRPI04109241102416062, Bilal, TS-580W, 580W`)</li>
                  <li><strong>Upload CSV File</strong>: Select your CSV file from your storage and click Import to run everything.</li>
                </ul>
              </Card>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default AuthenticityScreen;
