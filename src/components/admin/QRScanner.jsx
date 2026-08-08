import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { verifyAuthenticity } from '../../services/authenticityService';
import { CheckCircle2, HelpCircle, ScanLine, Keyboard, Loader2 } from 'lucide-react';

const QRScanner = () => {
  const [mode, setMode] = useState('manual'); // 'camera' | 'manual'
  const [manualCode, setManualCode] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scanHelpMessage, setScanHelpMessage] = useState('');
  const scannerRef = useRef(null);
  const scannerInstanceRef = useRef(null);
  const scanTimeoutRef = useRef(null);

  useEffect(() => {
    if (mode !== 'camera') return;

    setScanHelpMessage('');
    scanTimeoutRef.current = setTimeout(() => {
      setScanHelpMessage('Having trouble? Hold the barcode steady, keep it in focus, and make sure it is well-lit.');
    }, 6000);

    const startTimer = setTimeout(() => {
      if (!scannerRef.current) return;
      const scanner = new Html5QrcodeScanner(
        'qr-scanner-region',
        {
          fps: 10,
          qrbox: { width: 260, height: 260 },
          aspectRatio: 1,
          // Prefer the rear camera by default; user can switch if needed.
          videoConstraints: { facingMode: { ideal: 'environment' } },
        },
        false
      );
      scanner.render(
        async (decodedText) => {
          scanner.clear().catch(() => {});
          if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
          setScanHelpMessage('');
          setMode('manual');
          setManualCode(decodedText);
          await handleVerify(decodedText);
        },
        () => {}
      );
      scannerInstanceRef.current = scanner;
    }, 200);

    return () => {
      clearTimeout(startTimer);
      if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
      if (scannerInstanceRef.current) {
        scannerInstanceRef.current.clear().catch(() => {});
        scannerInstanceRef.current = null;
      }
    };
  }, [mode]);

  const handleVerify = async (code) => {
    const barcode = (code || manualCode).trim();
    if (!barcode) return;
    setLoading(true);
    setScanResult(null);
    setError('');
    try {
      const data = await verifyAuthenticity(barcode);
      setScanResult({ ...data, barcode });
    } catch (err) {
      setError(err.message || 'No matching panel found. Please check the serial and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setScanResult(null);
    setError('');
    setManualCode('');
  };

  return (
    <div className="qr-scanner-panel">
      {/* Mode Toggle */}
      <div className="scanner-mode-toggle">
        <button
          className={`mode-btn ${mode === 'camera' ? 'active' : ''}`}
          onClick={() => { handleReset(); setMode('camera'); }}
        >
          <ScanLine size={16} /> Camera Scan
        </button>
        <button
          className={`mode-btn ${mode === 'manual' ? 'active' : ''}`}
          onClick={() => { handleReset(); setMode('manual'); }}
        >
          <Keyboard size={16} /> Manual Entry
        </button>
      </div>

      {/* Camera Mode */}
      {mode === 'camera' && !scanResult && !error && (
        <div className="camera-wrapper">
          <div className="camera-permission-hint">
            <ScanLine size={16} style={{ flexShrink: 0 }} />
            <span>Tap <strong>Request Camera Permissions</strong> below, then point your back camera at the barcode.</span>
          </div>
          <div id="qr-scanner-region" ref={scannerRef}></div>
          {scanHelpMessage && (
            <div className="scan-help-message">
              <HelpCircle size={18} style={{ flexShrink: 0 }} />
              <span>{scanHelpMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* Manual Mode */}
      {mode === 'manual' && !scanResult && !error && (
        <form className="manual-scan-form" onSubmit={e => { e.preventDefault(); handleVerify(); }}>
          <div className="scan-input-wrap">
            <ScanLine size={18} className="scan-icon" />
            <input
              type="text"
              placeholder="Enter or paste panel serial / barcode..."
              value={manualCode}
              onChange={e => setManualCode(e.target.value)}
              autoFocus
            />
          </div>
          <button type="submit" className="btn-verify-scan" disabled={loading}>
            {loading ? <><Loader2 size={16} className="spin" /> Verifying...</> : 'Verify Panel'}
          </button>
        </form>
      )}

      {/* Loading */}
      {loading && (
        <div className="scan-loading-state">
          <Loader2 size={32} className="spin" />
          <p>Checking panel authenticity...</p>
        </div>
      )}

      {/* Result: Verified */}
      {scanResult && !loading && (
        <div className="scan-result verified">
          <div className="result-header">
            <CheckCircle2 size={40} className="result-icon verified" />
            <div>
              <h3>Panel Verified ✓</h3>
              <p>Serial: <strong>{scanResult.barcode}</strong></p>
            </div>
          </div>
          <div className="result-details-grid">
            <div className="result-detail-item">
              <span>Model</span>
              <p>{scanResult.productionType || 'N/A'}</p>
            </div>
            <div className="result-detail-item">
              <span>Brand</span>
              <p>{scanResult.brand || 'N/A'}</p>
            </div>
            <div className="result-detail-item">
              <span>Wattage</span>
              <p>{scanResult.wattage || 'N/A'}</p>
            </div>
            <div className="result-detail-item">
              <span>Technology</span>
              <p>{scanResult.technology || 'N/A'}</p>
            </div>
            <div className="result-detail-item">
              <span>Module Level</span>
              <p>{scanResult.moduleLevel || 'N/A'}</p>
            </div>
            <div className="result-detail-item">
              <span>Source</span>
              <p>{scanResult.source || 'N/A'}</p>
            </div>
            {scanResult.localWarranty && (
              <div className="result-detail-item full-width">
                <span>Registered {scanResult.localWarranty.customerName ? 'Customer' : 'Warranty'}</span>
                <p>
                  {scanResult.localWarranty.customerName
                    ? `${scanResult.localWarranty.customerName} — ${scanResult.localWarranty.warrantyYears} Year Warranty`
                    : `${scanResult.localWarranty.warrantyYears} Year Warranty`
                  }
                </p>
              </div>
            )}
          </div>
          <button className="btn-scan-again" onClick={handleReset}>Scan Another Panel</button>
        </div>
      )}

      {/* Result: Not Found */}
      {error && !loading && (
        <div className="scan-result not-found">
          <div className="result-header">
            <HelpCircle size={40} className="result-icon not-found" />
            <div>
              <h3>No Match Found</h3>
              <p>{error}</p>
            </div>
          </div>
          <button className="btn-scan-again" onClick={handleReset}>Try Again</button>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
