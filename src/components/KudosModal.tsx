import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { useToast } from './Toast';

interface KudosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KudosModal({ isOpen, onClose }: KudosModalProps) {
  const currentUser = useStore(s => s.currentUser);
  const members = useStore(s => s.members);
  const sendKudo = useStore(s => s.sendKudo);
  const { showToast } = useToast();

  const [recipientId, setRecipientId] = useState('');
  const [message, setMessage] = useState('');
  const [recipientError, setRecipientError] = useState('');

  const recipientRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') handleClose();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) recipientRef.current?.focus();
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
    showToast('Kudo sent.', 'success');
    handleClose();
  }

  if (!isOpen) return null;

  const eligibleMembers = members.filter(member => member.id !== currentUser?.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-baro-bark/60 backdrop-blur-sm" onClick={handleClose}>
      <div
        className="mx-4 w-full max-w-md rounded-2xl bg-baro-cream p-6 shadow-2xl"
        onClick={event => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="kudos-modal-title"
      >
        <h2 id="kudos-modal-title" className="mb-4 font-display text-xl text-baro-brown">
          Give a Kudo
        </h2>

        <div className="mb-4">
          <label htmlFor="kudo-recipient" className="mb-1 block text-sm font-medium text-baro-bark">
            To:
          </label>
          <select
            ref={recipientRef}
            id="kudo-recipient"
            value={recipientId}
            onChange={event => {
              setRecipientId(event.target.value);
              if (event.target.value) setRecipientError('');
            }}
            className="w-full rounded-lg border border-baro-amber/60 bg-baro-offwhite px-3 py-2 text-baro-bark focus:outline-none focus:ring-2 focus:ring-baro-gold"
          >
            <option value="">Select a member...</option>
            {eligibleMembers.map(member => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
          {recipientError && <p className="mt-1 text-xs text-baro-terra">{recipientError}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="kudo-message" className="mb-1 block text-sm font-medium text-baro-bark">
            Message:
          </label>
          <textarea
            id="kudo-message"
            value={message}
            onChange={event => setMessage(event.target.value)}
            placeholder="Say something kind..."
            rows={3}
            className="w-full resize-none rounded-lg border border-baro-amber/60 bg-baro-offwhite px-3 py-2 text-baro-bark focus:outline-none focus:ring-2 focus:ring-baro-gold"
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="text-sm text-baro-brown/60 transition-colors hover:text-baro-brown"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-baro-sage px-4 py-2 text-sm text-white transition-colors hover:bg-baro-brown"
          >
            Send Kudo
          </button>
        </div>
      </div>
    </div>
  );
}
