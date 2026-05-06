import { useState } from 'react';
import type { FormEvent } from 'react';
import { useStore } from '../store';
import { useToast } from '../components/Toast';

/**
 * ScanQRPage — member-only check-in page at /scan.
 * Camera scanning is not available (react-qr-reader incompatible with React 19).
 * Provides manual event ID entry and a list of available events.
 */
export default function ScanQRPage() {
  const currentUser = useStore(s => s.currentUser);
  const events = useStore(s => s.events);
  const checkIn = useStore(s => s.checkIn);
  const { showToast } = useToast();

  const [eventId, setEventId] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = eventId.trim();
    if (!trimmed || !currentUser) return;

    const result = checkIn(currentUser.id, trimmed);

    if (result === 'success') {
      showToast('Checked in! ✓', 'success');
      setEventId('');
    } else if (result === 'already_checked_in') {
      showToast("You're already checked in to this event.", 'info');
    } else {
      showToast('Event not found. Check the ID and try again.', 'error');
    }
  }

  const sortedEvents = [...events].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="p-6">
      <h1 className="font-display text-baro-brown text-2xl mb-6">Check In to Event</h1>

      <div className="bg-baro-cream rounded-xl border border-baro-amber/40 p-6 max-w-md mx-auto">
        {/* Info banner */}
        <div className="bg-baro-amber/20 text-baro-brown text-sm rounded-lg p-3 mb-4">
          📷 Camera scanning is not available in this version. Use the event ID below to check in
          manually.
        </div>

        {/* Manual entry */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label
              htmlFor="scan-event-id"
              className="block text-sm font-medium text-baro-bark mb-1"
            >
              Event ID
            </label>
            <input
              id="scan-event-id"
              type="text"
              value={eventId}
              onChange={e => setEventId(e.target.value)}
              placeholder="Paste or type the event ID"
              className="border border-baro-amber/60 rounded-lg px-3 py-2 w-full bg-baro-offwhite focus:outline-none focus:ring-2 focus:ring-baro-gold text-baro-bark"
            />
          </div>
          <button
            type="submit"
            className="bg-baro-gold hover:bg-baro-brown text-white rounded-lg px-4 py-2 w-full transition-colors"
          >
            Check In
          </button>
        </form>

        {/* Available events list */}
        {sortedEvents.length > 0 && (
          <div className="mt-6">
            <h2 className="font-display text-baro-brown text-base mb-3">Available Events</h2>
            <ul className="space-y-2">
              {sortedEvents.map(event => (
                <li key={event.id}>
                  <button
                    type="button"
                    onClick={() => setEventId(event.id)}
                    className="w-full text-left rounded-lg border border-baro-amber/30 bg-baro-offwhite px-3 py-2 hover:bg-baro-amber/20 transition-colors"
                  >
                    <div className="font-medium text-baro-brown text-sm">{event.name}</div>
                    <div className="text-baro-brown/60 text-xs mt-0.5">
                      {event.date} ·{' '}
                      <code className="bg-baro-cream px-1 rounded">{event.id}</code>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
