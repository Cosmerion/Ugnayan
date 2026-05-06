import { useMemo, useState } from 'react';
import CreateEventForm from '../components/CreateEventForm';
import EventList from '../components/EventList';
import QRDisplayModal from '../components/QRDisplayModal';
import { useStore } from '../store';

export default function EventsPage() {
  const events = useStore(state => state.events);
  const [qrEventId, setQrEventId] = useState<string | null>(null);

  const activeEvent = useMemo(() => events.find(e => e.id === qrEventId) ?? null, [events, qrEventId]);

  return (
    <div className="baro-shell px-4 py-5 md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl">
        <section className="baro-panel mb-6 rounded-[30px] bg-gradient-to-r from-baro-cream/92 to-white/88 px-6 py-6 md:px-8">
          <p className="text-xs uppercase tracking-[0.2em] text-baro-terra">Events</p>
          <h1 className="mt-2 font-display text-4xl text-baro-brown">Create and publish check-ins</h1>
          <p className="mt-2 max-w-2xl text-sm text-baro-bark/72">
            Officers can add new sessions, surface QR entry points, and keep attendance collection consistent.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <EventList events={events} onShowQR={setQrEventId} />
          <CreateEventForm />
        </div>
      </div>

      <QRDisplayModal
        eventId={activeEvent?.id ?? null}
        eventName={activeEvent?.name ?? ''}
        onClose={() => setQrEventId(null)}
      />
    </div>
  );
}
