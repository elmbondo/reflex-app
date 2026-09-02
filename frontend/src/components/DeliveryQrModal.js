import React from 'react';
import QRCode from 'react-qr-code';
import './DeliveryQrModal.css';

function DeliveryQrModal({ delivery, onClose }) {
  if (!delivery) return null;

  const qrCodeValue = delivery.qrCodeValue || delivery._id;

  return (
    <div className="delivery-qr-overlay" role="dialog" aria-modal="true" aria-labelledby="qr-modal-heading">
      <div className="delivery-qr-card">
        <div className="delivery-qr-header">
          <div>
            <div className="delivery-qr-badge">Reflex Delivery Pass</div>
            <h2 id="qr-modal-heading" className="delivery-qr-title">Doorstep Verification Code</h2>
          </div>
          <button
            type="button"
            className="delivery-qr-close"
            onClick={onClose}
            aria-label="Close QR modal"
          >
            &times;
          </button>
        </div>

        <div className="delivery-qr-body">
          <div className="delivery-qr-frame">
            <QRCode
              value={qrCodeValue}
              size={180}
              style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              viewBox={`0 0 256 256`}
            />
          </div>

          <div className="delivery-qr-code-text">
            <span className="code-label">Optical Reference:</span>
            <span className="code-value">{qrCodeValue}</span>
          </div>

          <div className="delivery-qr-meta">
            <div className="meta-item">
              <span className="meta-label">Customer:</span>
              <span className="meta-val">{delivery.customerName}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Phone:</span>
              <span className="meta-val">{delivery.customerPhone}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Destination:</span>
              <span className="meta-val">{delivery.address}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Package:</span>
              <span className="meta-val">{delivery.itemDescription}</span>
            </div>
          </div>
        </div>

        <div className="delivery-qr-footer">
          <p>Present this QR code to the Reflex Rider upon delivery to confirm secure doorstep handover.</p>
          <button type="button" className="btn-done-qr" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeliveryQrModal;
