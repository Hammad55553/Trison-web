import React, { useState, useRef, useEffect } from 'react';
import {
  Zap, Trash2, CheckCircle, AlertTriangle, X, RefreshCw, Settings2, Edit2, SkipForward,
} from 'lucide-react';
import {
  savePanel, deletePanel, getPanelBySerial, getRegistry,
  CLASS_OPTIONS, COUNTRY_OPTIONS, MODEL_OPTIONS, MODEL_MAP,
} from '../../services/authenticityService';

/**
 * Rapid Scan — designed for a physical USB/Bluetooth barcode reader.
 * The reader behaves like a keyboard that "types" the serial and presses
 * Enter. A hidden, always-focused input captures each scan; on Enter we
 * add the panel using the set-config below. Duplicates pause and let the
 * operator Update / Delete / Skip.
 */
const DEFAULT_CFG = {
  model: 'TS-Premium-580M',
  wattage: '580W',
  technology: 'Bifacial Mono PERC',
  class: 'A',
  country: 'Pakistan',
  status: 'active',
  customerName: '',
  warrantyYears: 'Active and Validated',
  brand: 'Trison',
};

const RapidScan = ({ onDataChange }) => {
  const [cfg, setCfg] = useState(() => {
    const saved = localStorage.getItem('trison_rapid_cfg');
    return saved ? { ...DEFAULT_CFG, ...JSON.parse(saved) } : DEFAULT_CFG;
  });
  const [running, setRunning] = useState(false);
  const [scanned, setScanned] = useState([]); // {serial, action:'added'|'updated', at}
  const [duplicate, setDuplicate] = useState(null); // pending duplicate serial + existing
  const [buffer, setBuffer] = useState('');
  const inputRef = useRef(null);

  // Persist config so it survives refresh.
  useEffect(() => {
    localStorage.setItem('trison_rapid_cfg', JSON.stringify(cfg));
  }, [cfg]);

  // Keep the hidden input focused while running (so the reader's keystrokes land).
  useEffect(() => {
    if (running && !duplicate) {
      const t = setInterval(() => {
        if (inputRef.current && document.activeElement !== inputRef.current) {
          inputRef.current.focus();
        }
      }, 400);
      return () => clearInterval(t);
    }
  }, [running, duplicate]);

  const setField = (k, v) => setCfg((c) => ({ ...c, [k]: v }));

  // Selecting a model auto-fills its wattage + technology.
  const setModel = (model) => {
    const info = MODEL_MAP[model];
    setCfg((c) => ({
      ...c,
      model,
      wattage: info ? info.wattage : c.wattage,
      technology: info ? info.technology : c.technology,
    }));
  };

  const pushScanned = (serial, action) => {
    setScanned((list) => [{ serial, action, at: Date.now() }, ...list].slice(0, 200));
    if (onDataChange) onDataChange(getRegistry());
  };

  const addSerial = (serialRaw) => {
    const serial = String(serialRaw || '').trim();
    if (!serial) return;

    const existing = getPanelBySerial(serial);
    if (existing) {
      // Pause and ask the operator what to do.
      setDuplicate({ serial, existing });
      beep(false);
      return;
    }
    savePanel({ ...cfg, serial });
    pushScanned(serial, 'added');
    beep(true);
  };

  // Hidden input submit (barcode reader presses Enter).
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSerial(buffer);
      setBuffer('');
    }
  };

  // Duplicate resolution actions
  const resolveUpdate = () => {
    savePanel({ ...duplicate.existing, ...cfg, serial: duplicate.serial, registeredAt: duplicate.existing.registeredAt });
    pushScanned(duplicate.serial, 'updated');
    setDuplicate(null);
    beep(true);
    refocus();
  };
  const resolveDelete = () => {
    deletePanel(duplicate.serial);
    setScanned((list) => list.filter((s) => s.serial !== duplicate.serial));
    if (onDataChange) onDataChange(getRegistry());
    setDuplicate(null);
    refocus();
  };
  const resolveSkip = () => {
    setDuplicate(null);
    refocus();
  };

  const refocus = () => setTimeout(() => inputRef.current?.focus(), 50);

  const start = () => { setRunning(true); refocus(); };
  const stop = () => { setRunning(false); setBuffer(''); };
  const clearList = () => setScanned([]);

  // Simple audio feedback (no asset needed).
  const beep = (ok) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = ok ? 880 : 300;
      gain.gain.value = 0.06;
      osc.start();
      setTimeout(() => { osc.stop(); ctx.close(); }, ok ? 90 : 220);
    } catch (_) { /* audio not available */ }
  };

  const addedCount = scanned.filter((s) => s.action === 'added').length;
  const updatedCount = scanned.filter((s) => s.action === 'updated').length;

  return (
    <div className="rapid-root">
      {/* Set-config */}
      <div className="rapid-config">
        <div className="rapid-config-head">
          <Settings2 size={16} /> Scan Settings — applied to every scanned serial
        </div>
        <div className="rapid-config-grid">
          <label>Model
            <select value={cfg.model} disabled={running} onChange={(e) => setModel(e.target.value)}>
              {!MODEL_MAP[cfg.model] && <option value={cfg.model}>{cfg.model || 'Select model'}</option>}
              {MODEL_OPTIONS.map((m) => <option key={m.model} value={m.model}>{m.model}</option>)}
            </select>
          </label>
          <label>Wattage (auto)
            <input value={cfg.wattage} disabled={running} onChange={(e) => setField('wattage', e.target.value)} />
          </label>
          <label>Technology
            <input value={cfg.technology} disabled={running} onChange={(e) => setField('technology', e.target.value)} />
          </label>
          <label>Class
            <select value={cfg.class} disabled={running} onChange={(e) => setField('class', e.target.value)}>
              {CLASS_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </label>
          <label>Country
            <select value={cfg.country} disabled={running} onChange={(e) => setField('country', e.target.value)}>
              {COUNTRY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label>Status
            <select value={cfg.status} disabled={running} onChange={(e) => setField('status', e.target.value)}>
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          </label>
          <label>Customer
            <input value={cfg.customerName} disabled={running} onChange={(e) => setField('customerName', e.target.value)} />
          </label>
          <label>Brand
            <input value={cfg.brand} disabled={running} onChange={(e) => setField('brand', e.target.value)} />
          </label>
        </div>
      </div>

      {/* Scan control */}
      {!running ? (
        <button className="rapid-start-btn" onClick={start}>
          <Zap size={18} /> Start Rapid Scan
        </button>
      ) : (
        <div className={`rapid-live ${duplicate ? 'paused' : ''}`}>
          <div className="rapid-live-status">
            <span className="rapid-dot" />
            {duplicate ? 'Paused — duplicate found' : 'Ready — scan a barcode…'}
          </div>
          {/* Hidden input catches the reader's keystrokes */}
          <input
            ref={inputRef}
            className="rapid-hidden-input"
            value={buffer}
            onChange={(e) => setBuffer(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            aria-label="Barcode scanner input"
          />
          <button className="rapid-stop-btn" onClick={stop}><X size={16} /> Stop</button>
        </div>
      )}

      {/* Duplicate resolver */}
      {duplicate && (
        <div className="rapid-dup">
          <div className="rapid-dup-head">
            <AlertTriangle size={18} /> This serial is already registered
          </div>
          <code className="rapid-dup-serial">{duplicate.serial}</code>
          <p className="rapid-dup-info">
            Existing: {duplicate.existing.model || '-'} · {duplicate.existing.wattage || '-'} · {duplicate.existing.customerName || 'no customer'}
          </p>
          <div className="rapid-dup-actions">
            <button className="rapid-btn update" onClick={resolveUpdate}><Edit2 size={15} /> Update (override)</button>
            <button className="rapid-btn delete" onClick={resolveDelete}><Trash2 size={15} /> Delete old</button>
            <button className="rapid-btn skip" onClick={resolveSkip}><SkipForward size={15} /> Skip</button>
          </div>
        </div>
      )}

      {/* Scanned list */}
      <div className="rapid-results">
        <div className="rapid-results-head">
          <div className="rapid-counts">
            <span className="rapid-count added"><strong>{addedCount}</strong> Added</span>
            <span className="rapid-count updated"><strong>{updatedCount}</strong> Updated</span>
          </div>
          {scanned.length > 0 && (
            <button className="rapid-clear" onClick={clearList}><RefreshCw size={14} /> Clear list</button>
          )}
        </div>
        {scanned.length === 0 ? (
          <div className="rapid-empty">Scanned serials will appear here, newest first.</div>
        ) : (
          <ul className="rapid-list">
            {scanned.map((s) => (
              <li key={s.serial + s.at} className={s.action}>
                <CheckCircle size={14} />
                <code>{s.serial}</code>
                <span className="rapid-tag">{s.action}</span>
                <button className="rapid-del-one" title="Delete this panel" onClick={() => { deletePanel(s.serial); setScanned((l) => l.filter((x) => x.serial !== s.serial)); if (onDataChange) onDataChange(getRegistry()); }}>
                  <Trash2 size={13} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RapidScan;
