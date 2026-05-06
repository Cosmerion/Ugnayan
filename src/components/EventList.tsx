import type { OrgEvent } from '../types';

interface EventListProps {
  events: OrgEvent[];
  onShowQR: (eventId: string) => void;
}

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function EventList({ events, onShowQR }: EventListProps) {
  const sorted = [...events].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="baro-panel rounded-[28px] p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-baro-terra">Live Events</p>
      <h2 className="mt-2 mb-4 font-display text-[1.8rem] leading-none text-baro-brown">Event list</h2>

      {sorted.length === 0 ? (
        <div className="py-8 text-center text-baro-brown/50">
          <div className="mb-2 text-4xl font-display text-baro-gold">✿</div>
          <p>No events yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(event => (
            <div
              key={event.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-baro-amber/40 bg-baro-cream p-4"
            >
              <div className="min-w-0">
                <div className="truncate font-display font-medium text-baro-brown">{event.name}</div>
                <div className="mt-0.5 text-sm text-baro-brown/60">
                  {formatDate(event.date)} · {event.type}
                </div>
              </div>
              <button
                onClick={() => onShowQR(event.id)}
                className="shrink-0 rounded-lg bg-baro-gold px-3 py-1.5 text-sm text-white transition-colors hover:bg-baro-brown"
              >
                Show QR
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
