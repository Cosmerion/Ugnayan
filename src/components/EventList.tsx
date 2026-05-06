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

/**
 * EventList — sorted by date descending, with a "Show QR" button per event.
 */
export default function EventList({ events, onShowQR }: EventListProps) {
  const sorted = [...events].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <h2 className="font-display text-baro-brown text-lg mb-4">Events</h2>

      {sorted.length === 0 ? (
        <div className="text-baro-brown/50 text-center py-8">
          <div className="text-4xl mb-2">🌸</div>
          <p>No events yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(event => (
            <div
              key={event.id}
              className="bg-baro-cream rounded-xl border border-baro-amber/40 p-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="font-display text-baro-brown font-medium truncate">
                  {event.name}
                </div>
                <div className="text-baro-brown/60 text-sm mt-0.5">
                  {formatDate(event.date)} · {event.type}
                </div>
              </div>
              <button
                onClick={() => onShowQR(event.id)}
                className="shrink-0 bg-baro-gold text-white text-sm px-3 py-1.5 rounded-lg hover:bg-baro-brown transition-colors"
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
