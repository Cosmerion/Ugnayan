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

export default function KudosReceivedList({ kudos, members }: KudosReceivedListProps) {
  const sorted = [...kudos].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="baro-panel rounded-[28px] p-6">
      <h2 className="mb-4 font-display text-lg text-baro-brown">Kudos Received</h2>

      {sorted.length === 0 ? (
        <p className="py-4 text-center text-sm text-baro-brown/50">No kudos yet — be the first to send one.</p>
      ) : (
        <ul>
          {sorted.map(kudo => {
            const sender = members.find(member => member.id === kudo.from);
            const senderName = sender?.name ?? 'Unknown';

            return (
              <li key={kudo.id} className="flex gap-3 border-b border-baro-amber/30 py-3 last:border-0">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-sm font-medium text-baro-brown">{senderName}</span>
                    <span className="text-xs text-baro-brown/50">{formatDate(kudo.createdAt)}</span>
                  </div>
                  {kudo.message && <p className="mt-0.5 text-sm text-baro-brown/80">{kudo.message}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
