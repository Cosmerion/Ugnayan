import type { Kudo, Member } from '../types';

interface KudosReceivedListProps {
  kudos: Kudo[];
  members: Member[];
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * KudosReceivedList — card showing kudos received by the current member.
 * Sorted by createdAt descending.
 */
export default function KudosReceivedList({ kudos, members }: KudosReceivedListProps) {
  const sorted = [...kudos].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="bg-baro-cream rounded-xl border border-baro-amber/40 p-6">
      <h2 className="font-display text-baro-brown text-lg mb-4">Kudos Received 🌸</h2>

      {sorted.length === 0 ? (
        <p className="text-baro-brown/50 text-sm text-center py-4">
          No kudos yet — be the first to send one! 🌸
        </p>
      ) : (
        <ul>
          {sorted.map(kudo => {
            const sender = members.find(m => m.id === kudo.from);
            const senderName = sender?.name ?? 'Unknown';

            return (
              <li
                key={kudo.id}
                className="flex gap-3 py-3 border-b border-baro-amber/30 last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-medium text-baro-brown text-sm">{senderName}</span>
                    <span className="text-baro-brown/50 text-xs">{formatDate(kudo.createdAt)}</span>
                  </div>
                  {kudo.message && (
                    <p className="text-baro-brown/80 text-sm mt-0.5">{kudo.message}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
