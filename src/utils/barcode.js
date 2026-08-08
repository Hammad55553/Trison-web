/**
 * Dependency-free Code 128 (subset B) barcode generator.
 * Produces an SVG string that any barcode scanner can read.
 * Used by both the on-screen <Barcode> component and the print label.
 */

// Standard Code 128 symbol patterns (index 0..106). Each string is the
// sequence of bar/space module widths, starting with a bar.
const PATTERNS = [
  '212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312', '132212', '221213',
  '221312', '231212', '112232', '122132', '122231', '113222', '123122', '123221', '223211', '221132',
  '221231', '213212', '223112', '312131', '311222', '321122', '321221', '312212', '322112', '322211',
  '212123', '212321', '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313',
  '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121', '313121', '211331',
  '231131', '213113', '213311', '213131', '311123', '311321', '331121', '312113', '312311', '332111',
  '314111', '221411', '431111', '111224', '111422', '121124', '121421', '141122', '141221', '112214',
  '112412', '122114', '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111',
  '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112', '421211', '212141',
  '214121', '412121', '111143', '111341', '131141', '114113', '114311', '411113', '411311', '113141',
  '114131', '311141', '411131', '211412', '211214', '211232', '2331112',
];

const START_B = 104;
const STOP = 106;

/** Encode a string into Code 128B symbol values (incl. start, checksum, stop). */
function encode(text) {
  const values = [START_B];
  let checksum = START_B;
  for (let i = 0; i < text.length; i++) {
    let code = text.charCodeAt(i) - 32;
    if (code < 0 || code > 94) code = 0; // clamp unsupported chars to space
    values.push(code);
    checksum += code * (i + 1);
  }
  values.push(checksum % 103);
  values.push(STOP);
  return values;
}

/**
 * Build the SVG markup string for a barcode.
 * @param {string} text
 * @param {object} opts { moduleWidth, height, margin, showText, textSize, color, bg }
 */
export function barcodeSVG(text = '', opts = {}) {
  const {
    moduleWidth = 2,
    height = 70,
    margin = 10,
    showText = true,
    textSize = 13,
    color = '#0f172a',
    bg = '#ffffff',
  } = opts;

  const clean = String(text || '').trim() || ' ';
  const values = encode(clean);

  // Total module count
  let totalModules = 0;
  values.forEach((v) => {
    const pat = PATTERNS[v];
    for (let i = 0; i < pat.length; i++) totalModules += parseInt(pat[i], 10);
  });

  const barsWidth = totalModules * moduleWidth;
  const width = barsWidth + margin * 2;
  const textGap = showText ? textSize + 8 : 0;
  const svgHeight = height + textGap + margin;

  let x = margin;
  let rects = '';
  values.forEach((v) => {
    const pat = PATTERNS[v];
    let isBar = true;
    for (let i = 0; i < pat.length; i++) {
      const w = parseInt(pat[i], 10) * moduleWidth;
      if (isBar) {
        rects += `<rect x="${x}" y="${margin}" width="${w}" height="${height}" fill="${color}" />`;
      }
      x += w;
      isBar = !isBar;
    }
  });

  const label = showText
    ? `<text x="${width / 2}" y="${margin + height + textSize + 2}" text-anchor="middle" font-family="monospace" font-size="${textSize}" letter-spacing="2" fill="${color}">${escapeXml(clean)}</text>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${svgHeight}" viewBox="0 0 ${width} ${svgHeight}" role="img" aria-label="Barcode ${escapeXml(clean)}"><rect width="${width}" height="${svgHeight}" fill="${bg}" />${rects}${label}</svg>`;
}

function escapeXml(s) {
  return String(s).replace(/[<>&'"]/g, (c) => (
    { '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]
  ));
}

/**
 * Return the raw bar geometry for a value so other renderers (e.g. jsPDF)
 * can draw the same Code 128 barcode without SVG.
 * @returns {{ bars: Array<{x:number,w:number}>, width:number }}
 *   x/w are in "module" units × moduleWidth already applied.
 */
export function barcodeBars(text = '', moduleWidth = 1) {
  const clean = String(text || '').trim() || ' ';
  const values = encode(clean);
  const bars = [];
  let x = 0;
  values.forEach((v) => {
    const pat = PATTERNS[v];
    let isBar = true;
    for (let i = 0; i < pat.length; i++) {
      const w = parseInt(pat[i], 10) * moduleWidth;
      if (isBar) bars.push({ x, w });
      x += w;
      isBar = !isBar;
    }
  });
  return { bars, width: x };
}
