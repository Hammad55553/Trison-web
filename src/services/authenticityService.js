/**
 * ─────────────────────────────────────────────────────
 * Trison Panel Registry API Service
 * Synced automatically with Node.js/Express MySQL Database, fallback to localStorage.
 * ─────────────────────────────────────────────────────
 */

const API_BASE = '/api/panels.php';
const REGISTRY_KEY = 'trison_registered_panels';

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
  return `TSCN${year}${month}${rand}${seq}`;
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
    localStorage.setItem(REGISTRY_KEY, JSON.stringify({}));
    return {};
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

  // 2. Delete on Express/PHP Server
  fetch(`${API_BASE}?serial=${cleanSerial}`, { method: 'DELETE' })
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
    const res = await fetch(`${API_BASE}?action=verify&serial=${clean}`);
    if (res.ok) {
      localData = await res.json();
    } else {
      localData = getPanelBySerial(clean);
    }
  } catch (_) {
    // Fallback to local storage if API is offline
    localData = getPanelBySerial(clean);
  }

  // 2. Return Trison Local Registry match if found
  if (localData && !localData.error) {
    return {
      ...localData,
      brand: localData.brand || 'Trison',
      source: 'Trison Local Registry',
      found: true
    };
  }

  // 3. Fallback to Longi API if not found locally
  try {
    const longiRes = await fetch(`https://javacms-prod-us.longi.com/getQrInfo?moduleCode=${clean}&locale=en-US&_locale=en-US`);
    const longiData = await longiRes.json();
    if (longiData.success && longiData.content) {
      const c = longiData.content;
      return {
        serial: c.moduleId,
        model: c.productionType,
        wattage: _wattFromModel(c.productionType) || 'Unknown',
        class: c.moduleLevel || 'A',
        brand: 'Trison',
        source: 'Manufacturer Registry',
        found: true
      };
    }
  } catch (e) {
    console.error('Longi API fallback failed', e);
  }

  throw new Error('Serial not found in Trison Database or Manufacturer records. Register it in the admin panel first.');
};

/**
 * Bulk import panels from parsed rows (e.g. an uploaded Excel/CSV file).
 *
 * Smart de-duplication so re-uploading the same file never creates
 * duplicates and never wipes existing good data:
 *   • Row serial is empty/missing → a new serial is auto-generated → ADD
 *   • Serial is new (not in registry) → ADD
 *   • Serial exists AND all fields identical → SKIP (nothing changes)
 *   • Serial exists BUT some field changed → UPDATE (overwrite that entry)
 *
 * @param {Array<Object>} rows  Array of panel-like objects.
 * @returns {{ added:number, updated:number, skipped:number, total:number, errors:string[] }}
 */
export const bulkImportPanels = (rows) => {
  const registry = getRegistry();
  let added = 0, updated = 0, skipped = 0;
  const errors = [];

  // Fields we compare to decide "changed vs same" (ignore timestamps).
  const COMPARE_FIELDS = [
    'model', 'wattage', 'technology', 'class', 'country',
    'status', 'customerName', 'warrantyYears', 'brand',
  ];

  const isBlankRow = (r) =>
    !r || COMPARE_FIELDS.every(f => !String(r[f] ?? '').trim()) && !String(r.serial ?? '').trim();

  (rows || []).forEach((rawRow, idx) => {
    try {
      if (isBlankRow(rawRow)) return; // ignore empty lines

      // Normalise / apply sensible defaults.
      const row = {
        serial: String(rawRow.serial ?? '').trim(),
        model: String(rawRow.model ?? '').trim(),
        wattage: String(rawRow.wattage ?? '').trim(),
        technology: String(rawRow.technology ?? '').trim(),
        class: String(rawRow.class ?? 'A').trim() || 'A',
        country: String(rawRow.country ?? 'Pakistan').trim() || 'Pakistan',
        status: String(rawRow.status ?? 'active').trim() || 'active',
        customerName: String(rawRow.customerName ?? '').trim(),
        warrantyYears: String(rawRow.warrantyYears ?? 'Active and Validated').trim(),
        brand: String(rawRow.brand ?? 'Trison').trim() || 'Trison',
      };

      // No serial in the file → generate one and treat as a new entry.
      if (!row.serial) {
        row.serial = generateSerial();
      }

      const existing = registry[row.serial];

      if (!existing) {
        // Brand-new panel.
        savePanel(row);
        registry[row.serial] = { ...row };
        added++;
        return;
      }

      // Serial already exists — did anything actually change?
      const changed = COMPARE_FIELDS.some(
        f => String(existing[f] ?? '').trim() !== String(row[f] ?? '').trim()
      );

      if (!changed) {
        skipped++;                 // identical → keep existing, do nothing
        return;
      }

      // Update: overwrite changed fields but preserve the original
      // registration date so history isn't lost.
      savePanel({ ...existing, ...row, registeredAt: existing.registeredAt });
      registry[row.serial] = { ...existing, ...row };
      updated++;
    } catch (err) {
      errors.push(`Row ${idx + 2}: ${err.message || 'could not be imported'}`);
    }
  });

  return { added, updated, skipped, total: added + updated + skipped, errors };
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
