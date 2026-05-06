import { useMemo, useState } from 'react';
import { useStore } from '../store';
import CreateEventForm from '../components/CreateEventForm';
import EventList from '../components/EventList';
import QRDisplayModal from '../components/QRDisplayModal';

/**
 * EventsPage — officer-only page for managing events.
 * Two-column layout: event list on the left, create form on the right.
 */
export default function EventsPage() {
  const events = useStore(state => state.events);
  const [qrEventId, setQrEventId] = useState<string | null>(null);

  const activeEvent = useMemo(
    () => events.find(e => e.id === qrEventId) ?? null,
    [events, qrEventId],
  );

  return (
    <div className="p-6">
      <h1 className="font-display text-baro-brown text-2xl mb-6">Event Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EventList events={events} onShowQR={setQrEventId} />
        <CreateEventForm />
      </div>

      <QRDisplayModal
        eventId={activeEvent?.id ?? null}
        eventName={activeEvent?.name ?? ''}
        onClose={() => setQrEventId(null)}
      />
    </div>
  );
}
