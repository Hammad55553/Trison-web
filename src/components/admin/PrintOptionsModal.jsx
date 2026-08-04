import React, { useState } from 'react';
import { X, Printer } from 'lucide-react';
import Barcode from './Barcode';
import { printPanelLabel } from '../../utils/printLabel';
import trisonLogo from '../../assets/images/TRISON.jpg';

// Optional fields the user can opt into (serial + barcode always print)
const FIELD_OPTIONS = [
  { key: 'model', label: 'Model Number' },
  { key: 'brand', label: 'Brand' },
  { key: 'wattage', label: 'Wattage' },
  { key: 'technology', label: 'Technology' },
  { key: 'class', label: 'Module Class' },
  { key: 'country', label: 'Country' },
  { key: 'customerName', label: 'Customer' },
  { key: 'warrantyYears', label: 'Warranty' },
  { key: 'status', label: 'Status' },
];

const PrintOptionsModal = ({ panel, onClose }) => {
  // Default: nothing checked → only barcode + serial number print
  const [selected, setSelected] = useState([]);

  const toggle = (key) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handlePrint = () => {
    printPanelLabel(panel, trisonLogo, selected);
  };

  const availableFields = FIELD_OPTIONS.filter((f) => {
    const v = f.key === 'brand' ? (panel.brand || 'Trison') : panel[f.key];
    return v != null && String(v).trim() !== '';
  });

  return (
    <div className="print-modal-backdrop" onClick={onClose}>
      <div className="print-modal" onClick={(e) => e.stopPropagation()}>
        <div className="print-modal-header">
          <h3>Print Barcode Label</h3>
          <button className="pm-modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="print-modal-body">
          <div className="print-preview-box">
            <Barcode value={panel.serial} height={60} moduleWidth={2} />
          </div>

          <p className="print-hint">
            The <strong>barcode</strong> and <strong>serial number</strong> always print.
            Tick any extra details you want on the label:
          </p>

          <div className="print-fields-grid">
            {availableFields.map((f) => (
              <label key={f.key} className="print-check">
                <input
                  type="checkbox"
                  checked={selected.includes(f.key)}
                  onChange={() => toggle(f.key)}
                />
                <span>{f.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="print-modal-actions">
          <button className="pm-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="pm-btn-save" onClick={handlePrint}>
            <Printer size={15} /> Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintOptionsModal;
