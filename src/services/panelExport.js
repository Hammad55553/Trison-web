/**
 * ─────────────────────────────────────────────────────
 * Trison Panel — Export helpers
 * Download the current registry as Excel, CSV, or a PDF
 * where every panel shows its scannable barcode.
 * ─────────────────────────────────────────────────────
 */
import * as XLSX from 'xlsx-js-style';
import jsPDF from 'jspdf';
import { barcodeBars } from '../utils/barcode';

const EXPORT_COLUMNS = [
  { key: 'serial', label: 'Serial Number' },
  { key: 'model', label: 'Model' },
  { key: 'wattage', label: 'Wattage' },
  { key: 'technology', label: 'Technology' },
  { key: 'class', label: 'Class' },
  { key: 'country', label: 'Country' },
  { key: 'status', label: 'Status' },
  { key: 'customerName', label: 'Customer' },
  { key: 'warrantyYears', label: 'Warranty' },
  { key: 'brand', label: 'Brand' },
];

const stamp = () => new Date().toISOString().slice(0, 10);

const rowsFrom = (panels) =>
  panels.map((p) => EXPORT_COLUMNS.map((c) => String(p[c.key] ?? '')));

/** Excel (.xlsx) with a styled header. */
export const exportPanelsExcel = (panels) => {
  const header = EXPORT_COLUMNS.map((c) => c.label);
  const aoa = [header, ...rowsFrom(panels)];
  const ws = XLSX.utils.aoa_to_sheet(aoa);

  ws['!cols'] = [
    { wch: 22 }, { wch: 18 }, { wch: 10 }, { wch: 18 }, { wch: 8 },
    { wch: 14 }, { wch: 12 }, { wch: 18 }, { wch: 20 }, { wch: 12 },
  ];
  const headStyle = {
    font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 11 },
    fill: { fgColor: { rgb: 'F59E0B' } },
    alignment: { horizontal: 'center', vertical: 'center' },
  };
  for (let c = 0; c < header.length; c++) {
    const addr = XLSX.utils.encode_cell({ r: 0, c });
    if (ws[addr]) ws[addr].s = headStyle;
  }
  ws['!freeze'] = { xSplit: 0, ySplit: 1 };

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Panels');
  XLSX.writeFile(wb, `Trison_Panels_${stamp()}.xlsx`);
};

/** CSV (.csv). */
export const exportPanelsCSV = (panels) => {
  const header = EXPORT_COLUMNS.map((c) => c.label);
  const esc = (v) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [header.map(esc).join(',')];
  panels.forEach((p) => {
    lines.push(EXPORT_COLUMNS.map((c) => esc(p[c.key])).join(','));
  });
  const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  triggerBlob(blob, `Trison_Panels_${stamp()}.csv`);
};

/** PDF (.pdf) — one card per panel with a scannable barcode. */
export const exportPanelsPDF = (panels) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 12;
  const cardH = 46;
  const cardW = pageW - margin * 2;
  let y = margin;

  // Title
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.setFont(undefined, 'bold');
  doc.text('Trison — Registered Panels', margin, y + 4);
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated ${stamp()} · ${panels.length} panels`, margin, y + 10);
  y += 16;

  panels.forEach((p, idx) => {
    if (y + cardH > pageH - margin) {
      doc.addPage();
      y = margin;
    }

    // Card border
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, y, cardW, cardH, 2, 2, 'S');

    // Left: details
    const tx = margin + 5;
    let ty = y + 7;
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(String(p.serial || ''), tx, ty);

    doc.setFontSize(8.5);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(71, 85, 105);
    ty += 6;
    doc.text(`Model: ${p.model || '-'}    Wattage: ${p.wattage || '-'}`, tx, ty);
    ty += 5;
    doc.text(`Tech: ${p.technology || '-'}    Class: ${p.class || '-'}`, tx, ty);
    ty += 5;
    doc.text(`Customer: ${p.customerName || '-'}`, tx, ty);
    ty += 5;
    doc.text(`Country: ${p.country || '-'}    Status: ${p.status || '-'}`, tx, ty);

    // Right: barcode
    drawBarcode(doc, String(p.serial || ''), margin + cardW - 62, y + 6, 56, 20);

    y += cardH + 5;
    // subtle index footer
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(`#${idx + 1}`, margin + cardW - 8, y - 2);
  });

  doc.save(`Trison_Panels_${stamp()}.pdf`);
};

/** Draw a Code 128 barcode into the PDF at (x,y) fitting into (maxW,maxH). */
function drawBarcode(doc, value, x, y, maxW, maxH) {
  if (!value) return;
  const { bars, width } = barcodeBars(value, 1);
  if (!width) return;
  const scale = maxW / width;
  const barH = maxH - 5;
  doc.setFillColor(15, 23, 42);
  bars.forEach((b) => {
    doc.rect(x + b.x * scale, y, b.w * scale, barH, 'F');
  });
  // caption
  doc.setFontSize(7);
  doc.setTextColor(15, 23, 42);
  doc.text(value, x + maxW / 2, y + barH + 4, { align: 'center' });
}

function triggerBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
