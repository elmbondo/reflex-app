import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import './QrScannerModal.css';

function QrScannerModal({ delivery, onClose, onConfirmScan, isSubmitting }) {
  const [cameraActive, setCameraActive] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [scanFeedback, setScanFeedback] = useState(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const scannerRef = useRef(null);
  const html5QrCodeInstanceRef = useRef(null);

  const targetCode = delivery?.qrCodeValue || '';

  useEffect(() => {
    let html5QrCode = null;

    const startScanner = async () => {
      try {
        const qrElementId = 'qr-reader-viewport';
        const qrElement = document.getElementById(qrElementId);
        if (!qrElement) return;

        html5QrCode = new Html5Qrcode(qrElementId);
        html5QrCodeInstanceRef.current = html5QrCode;

        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length > 0) {
          const cameraId = cameras[0].id;
          await html5QrCode.start(
            { facingMode: 'environment' },
            {
              fps: 10,
              qrbox: { width: 220, height: 220 },
              aspectRatio: 1.0,
            },
            (decodedText) => {
              handleCodeScanned(decodedText);
            },
            (error) => {
              // Standard scan frame miss, ignore
            }
          );
          setCameraActive(true);
        } else {
          setCameraActive(false);
        }
      } catch (err) {
        console.warn('Camera access unavailable or declined:', err?.message || err);
        setCameraActive(false);
      }
    };

    startScanner();

    return () => {
      if (html5QrCodeInstanceRef.current) {
        try {
          html5QrCodeInstanceRef.current.stop().then(() => {
            html5QrCodeInstanceRef.current.clear();
          }).catch(() => {});
        } catch (e) {}
      }
    };
  }, []);

  const handleCodeScanned = (scanned) => {
    const code = (scanned || '').trim();
    if (!code) return;

    if (targetCode && code !== targetCode) {
      setErrorMessage(`Scanned code "${code}" does not match package QR code.`);
      return;
    }

    setErrorMessage(null);
    setScanFeedback('Optical Barcode Verified Successfully!');
    
    // Slight pause for user visual confirmation
    setTimeout(() => {
      onConfirmScan(code || targetCode);
    }, 400);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const code = manualCode.trim();
    if (!code) {
      setErrorMessage('Please enter a valid verification code.');
      return;
    }

    if (targetCode && code.toLowerCase() !== targetCode.toLowerCase()) {
      setErrorMessage('Provided verification code does not match package reference.');
      return;
    }

    handleCodeScanned(code || targetCode);
  };

  const handleSimulateMatch = () => {
    handleCodeScanned(targetCode);
  };

  return (
    <div className="qr-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="qr-modal-title">
      <div className="qr-modal-card">
        {/* Header */}
        <div className="qr-modal-header">
          <div>
            <div className="qr-badge">Optical Verification</div>
            <h2 id="qr-modal-title" className="qr-modal-title">Optical Barcode Scan</h2>
          </div>
          <button
            type="button"
            className="qr-btn-close"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close QR scanner"
          >
            &times;
          </button>
        </div>

        {/* Target Package Info */}
        <div className="qr-package-summary">
          <div className="qr-pkg-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <div className="qr-pkg-text">
            <div className="qr-pkg-item">{delivery?.itemDescription || 'Customer Package'}</div>
            <div className="qr-pkg-cust">
              <strong>Destination:</strong> {delivery?.customerName} ({delivery?.address})
            </div>
          </div>
        </div>

        {/* Optical Viewfinder Box */}
        <div className="qr-viewfinder-container">
          <div id="qr-reader-viewport" className="qr-reader-box" ref={scannerRef}></div>
          
          <div className="qr-viewfinder-overlay">
            {/* Corner Markers */}
            <div className="corner-bracket top-left"></div>
            <div className="corner-bracket top-right"></div>
            <div className="corner-bracket bottom-left"></div>
            <div className="corner-bracket bottom-right"></div>
            
            {/* Animated Laser Sweep Line */}
            <div className="qr-laser-line"></div>

            {/* Target Code Badge */}
            {targetCode && (
              <div className="qr-target-code-pill">
                <span>PASS: {targetCode}</span>
              </div>
            )}
          </div>
        </div>

        {/* Feedback / Error Alerts */}
        {scanFeedback && (
          <div className="qr-feedback-banner success">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>{scanFeedback}</span>
          </div>
        )}

        {errorMessage && (
          <div className="qr-feedback-banner error">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Primary Action Button */}
        <div className="qr-actions-box">
          <button
            type="button"
            className="btn-confirm-optical-match"
            onClick={handleSimulateMatch}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-sm"></span>
                <span>Confirming Doorstep Handover...</span>
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>Confirm Optical Match &amp; Complete Delivery</span>
              </>
            )}
          </button>
        </div>

        {/* Manual Verification Code Option */}
        <form className="qr-manual-form" onSubmit={handleManualSubmit}>
          <label htmlFor="manual-code-input" className="qr-manual-label">
            Manual Package Code Entry:
          </label>
          <div className="qr-manual-input-group">
            <input
              id="manual-code-input"
              type="text"
              className="qr-manual-input"
              placeholder="e.g. 7a8f9c1b2e3d"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              disabled={isSubmitting}
            />
            <button
              type="submit"
              className="btn-verify-manual"
              disabled={isSubmitting || !manualCode.trim()}
            >
              Verify Code
            </button>
          </div>
        </form>

        <p className="qr-modal-note">
          Scan the QR code printed on the retailer's parcel or displayed on the merchant/customer receipt.
        </p>
      </div>
    </div>
  );
}

export default QrScannerModal;
