import { useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRDisplayModalProps {
  eventId: string | null;
  eventName: string;
  onClose: () => void;
}

/**
 * QRDisplayModal — shows a QR code for event check-in.
 * Closes on Escape key or backdrop click.
 */
export default function QRDisplayModal({ eventId, eventName, onClose }: QRDisplayModalProps) {
  useEffect(() => {
    if (!eventId) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [eventId, onClose]);

  if (!eventId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-baro-bark/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
    >
      <div
        className="bg-baro-cream rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <h2
          id="qr-modal-title"
          className="font-display text-baro-brown text-xl mb-4 text-center"
        >
          {eventName}
        </h2>

        <div className="flex justify-center">
          <QRCodeSVG
            value={eventId}
            size={240}
            bgColor="#FAF6EE"
            fgColor="#3D1F0A"
            includeMargin
          />
        </div>

        <p className="text-baro-brown/60 text-sm text-center mt-3">
          Members scan this to check in
        </p>

        <button
          onClick={onClose}
          className="bg-baro-gold text-white rounded-lg px-4 py-2 mt-4 w-full hover:bg-baro-brown transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
