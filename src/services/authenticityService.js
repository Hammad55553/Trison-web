/**
 * ─────────────────────────────────────────────────────
 * Trison Panel Registry API Service
 * Synced automatically with Node.js/Express MySQL Database, fallback to localStorage.
 * ─────────────────────────────────────────────────────
 */

const API_BASE = 'http://localhost:5000/api/panels';
const REGISTRY_KEY = 'trison_registered_panels';

// ── Preset Data Lists ─────────────────────────────────

export const PANEL_MODELS = [
  { label: 'Hi-MO 5 Bifacial 555W',       model: 'TS-HM5B-555M', wattage: '555W', technology: 'Bifacial Mono PERC' },
  { label: 'Hi-MO 5 Bifacial 575W',       model: 'TS-HM5B-575M', wattage: '575W', technology: 'Bifacial Mono PERC' },
  { label: 'Hi-MO 5 Monofacial 540W',     model: 'TS-HM5M-540M', wattage: '540W', technology: 'Monofacial Mono PERC' },
  { label: 'Hi-MO 5 Monofacial 555W',     model: 'TS-HM5M-555M', wattage: '555W', technology: 'Monofacial Mono PERC' },
  { label: 'Hi-MO 6 Bifacial 600W',       model: 'TS-HM6B-600M', wattage: '600W', technology: 'Bifacial HPDC' },
  { label: 'Hi-MO 6 Monofacial 580W',     model: 'TS-HM6M-580M', wattage: '580W', technology: 'Monofacial HPDC' },
  { label: 'Hi-MO 9 Bifacial 670W',       model: 'TS-HM9B-670M', wattage: '670W', technology: 'Bifacial TOPCon' },
];

export const CLASS_OPTIONS = [
  { value: 'A', label: 'Class A – Premium Grade' },
  { value: 'B', label: 'Class B – Standard Grade' },
];

export const COUNTRY_OPTIONS = [
  'Pakistan', 'UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bangladesh', 'India', 'China',
];

// ── Background Sync Logic ─────────────────────────────
const syncRegistry = () => {
  fetch(API_BASE)
    .then(res => res.json())
    .then(data => {
      const registryObj = {};
      data.forEach(p => {
        registryObj[p.serial] = p;
      });
      localStorage.setItem(REGISTRY_KEY, JSON.stringify(registryObj));
    })
    .catch(() => {
      // Fallback silently if offline
    });
};

// Initial background sync
syncRegistry();

export const generateSerial = () => {
  const now = new Date();
  const year  = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const rand  = String(Math.floor(1000 + Math.random() * 9000));
  const seq   = String(Date.now()).slice(-5);
  return `TSCN-${year}${month}-${rand}${seq}`;
};

// ── Preset Default Panels for local fallback ──────────
const PRESET_PANELS = {
  'TSCN-2607-731358458': {
    serial: 'TSCN-2607-731358458',
    brand: 'Trison',
    model: 'TS-HM5B-575M',
    wattage: '575W',
    technology: 'Bifacial Mono PERC',
    class: 'A',
    country: 'Pakistan',
    customerName: 'Hammad Aslam',
    warrantyYears: '25',
    status: 'active',
    registeredAt: '2026-07-20T10:00:00.000Z'
  },
  'TSCN-2607-994821102': {
    serial: 'TSCN-2607-994821102',
    brand: 'Trison',
    model: 'TS-HM6B-600M',
    wattage: '600W',
    technology: 'Bifacial HPDC',
    class: 'A',
    country: 'Pakistan',
    customerName: 'Zainab Bibi',
    warrantyYears: '25',
    status: 'active',
    registeredAt: '2026-07-20T11:30:00.000Z'
  }
};

// ── CRUD Operations ───────────────────────────────────

/**
 * Get all registered panels (returns sorted list from local storage, triggers sync in BG)
 */
export const getAllPanels = () => {
  syncRegistry();
  const raw = getRegistry();
  return Object.entries(raw).map(([key, p]) => ({
    ...p,
    serial: p.serial || p.barcode || key,
    barcode: p.barcode || p.serial || key
  })).sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));
};

/**
 * Get raw registry object
 */
export const getRegistry = () => {
  const local = localStorage.getItem(REGISTRY_KEY);
  if (!local || local === '{}') {
    localStorage.setItem(REGISTRY_KEY, JSON.stringify(PRESET_PANELS));
    return PRESET_PANELS;
  }
  return JSON.parse(local);
};

/**
 * Add or update a panel entry
 */
export const savePanel = (panel) => {
  if (!panel.serial?.trim()) throw new Error('Serial number is required.');
  const cleanSerial = panel.serial.trim();

  // 1. Save locally
  const registry = getRegistry();
  const savedObj = {
    ...panel,
    serial: cleanSerial,
    registeredAt: panel.registeredAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  registry[cleanSerial] = savedObj;
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));

  // 2. Post to Express Server
  fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(savedObj)
  })
  .then(() => syncRegistry())
  .catch(() => {});

  return { success: true };
};

/**
 * Delete a panel by serial number
 */
export const deletePanel = (serial) => {
  const cleanSerial = serial.trim();

  // 1. Delete locally
  const registry = getRegistry();
  delete registry[cleanSerial];
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));

  // 2. Delete on Express Server
  fetch(`${API_BASE}/${cleanSerial}`, { method: 'DELETE' })
    .then(() => syncRegistry())
    .catch(() => {});

  return { success: true };
};

/**
 * Get single panel locally
 */
export const getPanelBySerial = (serial) => {
  const registry = getRegistry();
  return registry[serial.trim()] || null;
};

// ── Authenticity Verification ─────────────────────────

/**
 * Verify a panel's authenticity.
 * Checks Express database first, then falls back to local storage.
 */
export const verifyPanel = async (serial) => {
  const clean = serial.trim();
  if (!clean) throw new Error('Please enter a valid serial number.');

  let localData = null;

  // 1. Try querying the Node.js Express server directly
  try {
    const res = await fetch(`${API_BASE}/verify/${clean}`);
    if (res.ok) {
      localData = await res.json();
    }
  } catch (_) {
    // Fallback to local storage if API is offline
    localData = getPanelBySerial(clean);
  }

  // 2. Return Trison Local Registry match if found
  if (localData) {
    return {
      ...localData,
      brand: localData.brand || 'Trison',
      source: 'Trison Local Registry',
      found: true
    };
  }

  throw new Error('Serial not found in Trison Database. Register it in the admin panel first.');
};

// ── Legacy compatibility shims ─────────────────────────
export const registerCustomPanel = (data) => savePanel({ ...data, serial: data.barcode });
export const getCustomRegistry = () => getRegistry();
export const generateCustomBarcode = () => generateSerial();
export const verifyAuthenticity = (barcode) => verifyPanel(barcode);
export const registerBulkPanels = (arr) => {
  arr.forEach(p => savePanel({ ...p, serial: p.barcode }));
  return { success: true, count: arr.length };
};

// Helpers
function _wattFromModel(model) {
  if (!model) return null;
  const m = model.match(/-(\d+)M/);
  return m ? `${m[1]}W` : null;
}
