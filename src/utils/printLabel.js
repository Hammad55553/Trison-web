import { barcodeSVG } from './barcode';

/**
 * Open a print-ready window with a branded panel label (barcode + specs)
 * and trigger the browser print dialog.
 */
/**
 * @param {object} panel
 * @param {string} logoUrl
 * @param {string[]} fields  Optional field keys to include on the label
 *   (serial + barcode are always printed). e.g. ['model','wattage'].
 */
export function printPanelLabel(panel, logoUrl, fields = []) {
  if (!panel || !panel.serial) return;

  const bc = barcodeSVG(panel.serial, { moduleWidth: 2, height: 80, showText: true, textSize: 14 });

  const FIELD_MAP = {
    model: ['Model', panel.model],
    brand: ['Brand', panel.brand || 'Trison'],
    wattage: ['Wattage', panel.wattage],
    technology: ['Technology', panel.technology],
    class: ['Class', panel.class ? `Class ${panel.class}` : ''],
    country: ['Country', panel.country],
    customerName: ['Customer', panel.customerName],
    warrantyYears: ['Warranty', panel.warrantyYears],
    status: ['Status', panel.status],
  };

  const rows = (fields || [])
    .map((k) => FIELD_MAP[k])
    .filter((pair) => pair && pair[1]);

  const rowsHtml = rows
    .map(
      ([k, v]) =>
        `<tr><td class="k">${esc(k)}</td><td class="v">${esc(v)}</td></tr>`
    )
    .join('');

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Trison Panel Label — ${esc(panel.serial)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; padding: 24px; }
  .label {
    width: 420px; margin: 0 auto; border: 2px solid #1a1a5e; border-radius: 14px;
    overflow: hidden;
  }
  .label-head {
    display: flex; align-items: center; justify-content: space-between;
    background: linear-gradient(135deg, #1a1a5e, #2d2d8a); color: #fff; padding: 12px 18px;
  }
  .label-head img { height: 26px; filter: brightness(0) invert(1); }
  .label-head .tag {
    font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
    opacity: 0.85;
  }
  .barcode-box { text-align: center; padding: 18px 12px 8px; }
  .barcode-box svg { max-width: 100%; height: auto; }
  .specs { padding: 4px 18px 18px; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 6px 0; font-size: 12.5px; border-bottom: 1px solid #eef2f7; vertical-align: top; }
  td.k { color: #64748b; font-weight: 600; width: 38%; text-transform: uppercase; letter-spacing: 0.04em; font-size: 10.5px; }
  td.v { color: #0f172a; font-weight: 700; text-align: right; }
  .foot { text-align: center; font-size: 9.5px; color: #94a3b8; padding: 8px; border-top: 1px dashed #cbd5e1; }
  @media print {
    body { padding: 0; }
    @page { margin: 8mm; }
  }
</style>
</head>
<body>
  <div class="label">
    <div class="label-head">
      ${logoUrl ? `<img src="${esc(logoUrl)}" alt="Trison" />` : '<strong>TRISON</strong>'}
      <span class="tag">Authentic Panel</span>
    </div>
    <div class="barcode-box">${bc}</div>
    ${rows.length ? `<div class="specs"><table>${rowsHtml}</table></div>` : ''}
    <div class="foot">Verify authenticity at trisonsolar.com · &copy; ${new Date().getFullYear()} Trison</div>
  </div>
  <script>
    window.onload = function () {
      setTimeout(function () { window.print(); }, 200);
    };
    window.onafterprint = function () { window.close(); };
  <\/script>
</body>
</html>`;

  // Use a hidden iframe so no popup blocker can interfere.
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();

  const cleanup = () => {
    setTimeout(() => {
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
    }, 500);
  };

  iframe.contentWindow.onafterprint = cleanup;
  // Fallback cleanup in case onafterprint never fires
  setTimeout(cleanup, 60000);
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[<>&'"]/g, (c) => (
    { '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]
  ));
}
