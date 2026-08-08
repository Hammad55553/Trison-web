/**
 * ─────────────────────────────────────────────────────
 * Trison Panel — Excel / CSV helpers
 * Parse an uploaded sheet into panel rows, and generate a
 * styled downloadable template (with dropdowns + a sample row).
 * ─────────────────────────────────────────────────────
 */
// xlsx-js-style is a drop-in fork of SheetJS that ALSO writes cell styles
// and data-validation (dropdowns) — needed for the styled template.
import * as XLSX from 'xlsx-js-style';

// Canonical column order shown to admins in the template.
export const TEMPLATE_COLUMNS = [
  'serial',
  'model',
  'wattage',
  'technology',
  'class',
  'country',
  'status',
  'customerName',
  'warrantyYears',
  'brand',
];

// Friendly headers ↔ internal keys. We accept several spellings on import
// so a slightly different sheet still maps correctly.
const HEADER_ALIASES = {
  serial: 'serial', 'serial number': 'serial', barcode: 'serial', 'serial / barcode': 'serial',
  model: 'model', 'model name': 'model',
  wattage: 'wattage', watt: 'wattage', 'power': 'wattage',
  technology: 'technology', tech: 'technology',
  class: 'class', grade: 'class',
  country: 'country',
  status: 'status',
  customername: 'customerName', customer: 'customerName', 'customer name': 'customerName', client: 'customerName',
  warrantyyears: 'warrantyYears', warranty: 'warrantyYears', 'warranty years': 'warrantyYears',
  brand: 'brand',
};

const normaliseKey = (h) => {
  const key = String(h || '').trim().toLowerCase();
  return HEADER_ALIASES[key] || null;
};

/**
 * Parse an uploaded File (.xlsx / .xls / .csv) into an array of panel rows.
 * @param {File} file
 * @returns {Promise<Array<Object>>}
 */
export const parsePanelFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the file. Please try again.'));
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        if (!sheet) return resolve([]);

        // Read as rows of raw arrays so we control header mapping.
        const raw = XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false });
        if (!raw.length) return resolve([]);

        const headerRow = raw[0].map(normaliseKey);
        const rows = [];
        for (let i = 1; i < raw.length; i++) {
          const line = raw[i];
          if (!line || line.every((c) => String(c ?? '').trim() === '')) continue;
          const obj = {};
          headerRow.forEach((key, col) => {
            if (key) obj[key] = line[col] != null ? String(line[col]).trim() : '';
          });
          // Skip the template's guidance row (contains helper hints, not data).
          const joined = Object.values(obj).join(' ').toLowerCase();
          if (joined.includes('auto-generated') || joined.includes('free text')) continue;
          rows.push(obj);
        }
        resolve(rows);
      } catch (err) {
        reject(new Error('Invalid or corrupted file. Please use the provided template.'));
      }
    };
    reader.readAsArrayBuffer(file);
  });

/**
 * Build and trigger download of a styled .xlsx template with:
 *   • a colored header row
 *   • sensible column widths / spacing
 *   • dropdown (data-validation) lists for class / country / status
 *   • one sample "dummy" row so the format is obvious
 */
export const downloadPanelTemplate = () => {
  const headers = [
    'Serial Number', 'Model Name', 'Wattage', 'Technology',
    'Class', 'Country', 'Status', 'Customer Name', 'Warranty Years', 'Brand',
  ];

  // One friendly example row (leave serial blank to show auto-generate works,
  // but here we include one so the layout is clear).
  const sample = [
    'TSCN2608SAMPLE01', 'TS-Premium-580M', '580W', 'Bifacial Mono PERC',
    'A', 'Pakistan', 'active', 'Sample Customer', 'Active and Validated', 'Trison',
  ];

  // A short guidance row (row 2) telling admins the allowed values for the
  // dropdown-style columns. It sits between the header and the sample so the
  // rules are obvious even if a viewer's Excel ignores data-validation.
  const guide = [
    'blank = auto-generated', 'free text', 'e.g. 580W', 'free text',
    'A or B', 'Pakistan / UAE / …', 'active / inactive', 'free text', 'free text', 'Trison',
  ];

  const aoa = [headers, guide, sample];
  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // Column widths for comfortable spacing.
  ws['!cols'] = [
    { wch: 24 }, { wch: 20 }, { wch: 10 }, { wch: 20 },
    { wch: 10 }, { wch: 18 }, { wch: 14 }, { wch: 20 }, { wch: 24 }, { wch: 12 },
  ];
  ws['!rows'] = [{ hpt: 26 }, { hpt: 18 }, { hpt: 20 }];

  // Header row: bold white on Trison amber.
  const headerStyle = {
    font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 11 },
    fill: { fgColor: { rgb: 'F59E0B' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: 'E2E8F0' } },
      bottom: { style: 'thin', color: { rgb: 'E2E8F0' } },
      left: { style: 'thin', color: { rgb: 'E2E8F0' } },
      right: { style: 'thin', color: { rgb: 'E2E8F0' } },
    },
  };
  // Guidance row: small grey italic on a light background.
  const guideStyle = {
    font: { italic: true, color: { rgb: '94A3B8' }, sz: 9 },
    fill: { fgColor: { rgb: 'F8FAFC' } },
    alignment: { horizontal: 'center', vertical: 'center' },
  };
  // Sample row: normal dark text.
  const sampleStyle = {
    font: { color: { rgb: '1E293B' }, sz: 10 },
    alignment: { vertical: 'center' },
  };

  for (let c = 0; c < headers.length; c++) {
    const h = XLSX.utils.encode_cell({ r: 0, c });
    const g = XLSX.utils.encode_cell({ r: 1, c });
    const s = XLSX.utils.encode_cell({ r: 2, c });
    if (ws[h]) ws[h].s = headerStyle;
    if (ws[g]) ws[g].s = guideStyle;
    if (ws[s]) ws[s].s = sampleStyle;
  }

  // Excel data-validation dropdowns (Class / Country / Status) for rows 3..500.
  // Supported by xlsx-js-style; if a reader ignores them, the guidance row
  // still communicates the allowed values.
  ws['!dataValidation'] = [
    { sqref: 'E3:E500', type: 'list', formula1: '"A,B"', allowBlank: true, showDropDown: true },
    { sqref: 'F3:F500', type: 'list', formula1: '"Pakistan,UAE,Saudi Arabia,Qatar,Kuwait,Bangladesh,India,China"', allowBlank: true, showDropDown: true },
    { sqref: 'G3:G500', type: 'list', formula1: '"active,inactive"', allowBlank: true, showDropDown: true },
  ];

  // Freeze the header row so it stays visible while scrolling.
  ws['!freeze'] = { xSplit: 0, ySplit: 1 };

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Panels');
  XLSX.writeFile(wb, 'Trison_Panel_Import_Template.xlsx');
};
