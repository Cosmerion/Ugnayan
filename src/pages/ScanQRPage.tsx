import { useState } from 'react';
import type { FormEvent } from 'react';
import { useToast } from '../components/Toast';
import { useStore } from '../store';

export default function ScanQRPage() {
  const currentUser = useStore(s => s.currentUser);
  const events = useStore(s => s.events);
  const checkIn = useStore(s => s.checkIn);
  const { showToast } = useToast();

  const [eventId, setEventId] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = eventId.trim();
    if (!trimmed || !currentUser) return;

    const result = checkIn(currentUser.id, trimmed);

    if (result === 'success') {
      showToast('Checked in.', 'success');
      setEventId('');
    } else if (result === 'already_checked_in') {
      showToast("You're already checked in to this event.", 'info');
    } else {
      showToast('Event not found. Check the ID and try again.', 'error');
    }
  }

  const sortedEvents = [...events].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="baro-shell px-4 py-5 md:px-8 md:py-8">
      <div className="mx-auto max-w-5xl">
        <section className="baro-panel mb-6 rounded-[30px] bg-gradient-to-r from-baro-cream/92 to-white/88 px-6 py-6 md:px-8">
          <p className="text-xs uppercase tracking-[0.2em] text-baro-terra">Scan QR</p>
          <h1 className="mt-2 font-display text-4xl text-baro-brown">Check in to an event</h1>
          <p className="mt-2 max-w-2xl text-sm text-baro-bark/72">
            Use the manual event ID flow below. Camera scanning can be added once the QR reader dependency is installed for this React version.
          </p>
        </section>

        <div className="baro-panel mx-auto max-w-2xl rounded-[28px] p-6">
          <div className="mb-4 rounded-lg bg-baro-amber/20 p-3 text-sm text-baro-brown">
            Camera scanning is not available in this build. Use the event ID below to check in manually.
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="scan-event-id" className="mb-1 block text-sm font-medium text-baro-bark">
                Event ID
              </label>
              <input
                id="scan-event-id"
                type="text"
                value={eventId}
                onChange={event => setEventId(event.target.value)}
                placeholder="Paste or type the event ID"
                className="w-full rounded-lg border border-baro-amber/60 bg-baro-offwhite px-3 py-2 text-baro-bark focus:outline-none focus:ring-2 focus:ring-baro-gold"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-baro-gold px-4 py-2 text-white transition-colors hover:bg-baro-brown"
            >
              Check In
            </button>
          </form>

          {sortedEvents.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-3 font-display text-base text-baro-brown">Available Events</h2>
              <ul className="space-y-2">
                {sortedEvents.map(event => (
                  <li key={event.id}>
                    <button
                      type="button"
                      onClick={() => setEventId(event.id)}
                      className="w-full rounded-lg border border-baro-amber/30 bg-baro-offwhite px-3 py-2 text-left transition-colors hover:bg-baro-amber/20"
                    >
                      <div className="text-sm font-medium text-baro-brown">{event.name}</div>
                      <div className="mt-0.5 text-xs text-baro-brown/60">
                        {event.date} · <code className="rounded bg-baro-cream px-1">{event.id}</code>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
