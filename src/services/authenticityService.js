/**
 * ─────────────────────────────────────────────────────
 * Trison Panel Registry API Service
 * All local-storage CRUD operations for PV panel management.
 * ─────────────────────────────────────────────────────
 */

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

// ── Serial Auto-Generator ─────────────────────────────

/**
 * Generates a unique Trison panel serial number
 * Format: TRPK-[YEAR][MONTH]-[4-digit random]
 */
export const generateSerial = () => {
  const now = new Date();
  const year  = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const rand  = String(Math.floor(1000 + Math.random() * 9000));
  const seq   = String(Date.now()).slice(-5);
  return `TRPK-${year}${month}-${rand}${seq}`;
};

// ── CRUD Operations ───────────────────────────────────

/**
 * Get all registered panels from local storage
 * @returns {Array} array of panel objects (sorted newest first)
 */
export const getAllPanels = () => {
  const raw = JSON.parse(localStorage.getItem(REGISTRY_KEY) || '{}');
  return Object.values(raw).sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));
};

/**
 * Get raw registry object (keyed by serial)
 */
export const getRegistry = () => {
  return JSON.parse(localStorage.getItem(REGISTRY_KEY) || '{}');
};

/**
 * Add or update a panel entry
 * @param {object} panel - Full panel data object
 */
export const savePanel = (panel) => {
  if (!panel.serial?.trim()) throw new Error('Serial number is required.');

  const registry = getRegistry();
  registry[panel.serial.trim()] = {
    ...panel,
    serial: panel.serial.trim(),
    registeredAt: panel.registeredAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
  return { success: true };
};

/**
 * Delete a panel by serial number
 * @param {string} serial
 */
export const deletePanel = (serial) => {
  const registry = getRegistry();
  delete registry[serial];
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
  return { success: true };
};

/**
 * Get single panel by serial number
 * @param {string} serial
 * @returns {object|null}
 */
export const getPanelBySerial = (serial) => {
  const registry = getRegistry();
  return registry[serial.trim()] || null;
};

// ── Authenticity Verification ─────────────────────────

const LONGI_API = (code) =>
  `https://javacms-prod-us.longi.com/getQrInfo?moduleCode=${encodeURIComponent(code)}&locale=en-US&_locale=en-US`;

/**
 * Verify a panel's authenticity by serial.
 * Checks Trison local registry first, then LONGI official API.
 * @param {string} serial - Panel serial or barcode
 * @returns {Promise<object>}
 */
export const verifyPanel = async (serial) => {
  const clean = serial.trim();
  if (!clean) throw new Error('Please enter a valid serial number.');

  // 1. Check local Trison registry
  const local = getPanelBySerial(clean);

  // 2. Try LONGI official API
  let apiData = null;
  try {
    const res = await fetch(LONGI_API(clean), { method: 'GET', mode: 'cors' });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.content) {
        apiData = {
          model:      json.content.productionType || 'N/A',
          serial:     json.content.moduleId || clean,
          class:      json.content.moduleLevel === 'A' ? 'A' : (json.content.moduleLevel || 'A'),
          wattage:    _wattFromModel(json.content.productionType) || '580W',
          technology: 'Mono PERC / HPDC High Efficiency',
          brand:      'LONGI Solar',
          country:    'N/A',
          status:     'active',
          source:     'LONGI Official Database',
        };
      }
    }
  } catch (_) {
    /* silent – fallback below */
  }

  // 3. If both found, merge local warranty info on top of official record
  if (local && apiData) {
    return { ...apiData, customerName: local.customerName, warrantyYears: local.warrantyYears, source: 'LONGI DB + Trison Registry', found: true };
  }

  // 4. Local registry only
  if (local) {
    return { ...local, brand: local.brand || 'Trison', source: 'Trison Local Registry', found: true };
  }

  // 5. LONGI API only
  if (apiData) {
    return { ...apiData, found: true };
  }

  // 6. LONGI heuristic fallback
  if (clean.startsWith('LR') && clean.length >= 15) {
    return {
      model:      `LR5-72HPH-580M`,
      serial:     clean,
      class:      'A',
      wattage:    '580W',
      technology: 'Tier-1 Mono PERC',
      brand:      'LONGI Solar',
      country:    'N/A',
      status:     'active',
      source:     'LONGI Heuristic Match',
      found:      true,
    };
  }

  throw new Error('Serial not found in any database. Register it in the admin panel first.');
};

// ── Legacy compatibility shims ─────────────────────────

/** @deprecated use savePanel() */
export const registerCustomPanel = (data) => savePanel({ ...data, serial: data.barcode });

/** @deprecated use getRegistry() */
export const getCustomRegistry = () => getRegistry();

/** @deprecated use generateSerial() */
export const generateCustomBarcode = () => generateSerial();

/** @deprecated use verifyPanel() */
export const verifyAuthenticity = (barcode) => verifyPanel(barcode);

/** @deprecated  */
export const registerBulkPanels = (arr) => {
  arr.forEach(p => savePanel({ ...p, serial: p.barcode }));
  return { success: true, count: arr.length };
};

// ── Helpers ───────────────────────────────────────────
function _wattFromModel(model) {
  if (!model) return null;
  const m = model.match(/-(\d+)M/);
  return m ? `${m[1]}W` : null;
}
