import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { useToast } from './Toast';

interface KudosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * KudosModal — floating modal for sending peer kudos.
 * Available to members on all pages via the floating button in RootLayout.
 */
export default function KudosModal({ isOpen, onClose }: KudosModalProps) {
  const currentUser = useStore(s => s.currentUser);
  const members = useStore(s => s.members);
  const sendKudo = useStore(s => s.sendKudo);
  const { showToast } = useToast();

  const [recipientId, setRecipientId] = useState('');
  const [message, setMessage] = useState('');
  const [recipientError, setRecipientError] = useState('');

  // Escape key closes modal
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function handleClose() {
    setRecipientId('');
    setMessage('');
    setRecipientError('');
    onClose();
  }

  function handleSubmit() {
    if (!recipientId) {
      setRecipientError('Please select a recipient.');
      return;
    }
    if (!currentUser) return;

    sendKudo(currentUser.id, recipientId, message);
    showToast('Kudo sent! 🌸', 'success');
    handleClose();
  }

  if (!isOpen) return null;

  // Exclude current user from recipient list
  const eligibleMembers = members.filter(m => m.id !== currentUser?.id);

  return (
    <div
      className="fixed inset-0 bg-baro-bark/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-baro-cream rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="kudos-modal-title"
      >
        <h2 id="kudos-modal-title" className="font-display text-baro-brown text-xl mb-4">
          Give a Kudo 🌸
        </h2>

        {/* Recipient */}
        <div className="mb-4">
          <label htmlFor="kudo-recipient" className="block text-sm font-medium text-baro-bark mb-1">
            To:
          </label>
          <select
            id="kudo-recipient"
            value={recipientId}
            onChange={e => {
              setRecipientId(e.target.value);
              if (e.target.value) setRecipientError('');
            }}
            className="border border-baro-amber/60 rounded-lg px-3 py-2 w-full bg-baro-offwhite focus:outline-none focus:ring-2 focus:ring-baro-gold text-baro-bark"
          >
            <option value="">Select a member...</option>
            {eligibleMembers.map(m => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          {recipientError && (
            <p className="text-baro-terra text-xs mt-1">{recipientError}</p>
          )}
        </div>

        {/* Message */}
        <div className="mb-6">
          <label htmlFor="kudo-message" className="block text-sm font-medium text-baro-bark mb-1">
            Message:
          </label>
          <textarea
            id="kudo-message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Say something kind..."
            rows={3}
            className="border border-baro-amber/60 rounded-lg px-3 py-2 w-full bg-baro-offwhite focus:outline-none focus:ring-2 focus:ring-baro-gold text-baro-bark resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="text-baro-brown/60 hover:text-baro-brown transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-baro-sage text-white rounded-lg px-4 py-2 hover:bg-baro-brown transition-colors text-sm"
          >
            Send Kudo ✓
          </button>
        </div>
      </div>
    </div>
  );
}
