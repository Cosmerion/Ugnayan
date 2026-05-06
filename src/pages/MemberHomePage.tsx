import { useStore } from '../store';
import MemberStatsCard from '../components/MemberStatsCard';
import KudosReceivedList from '../components/KudosReceivedList';

/**
 * MemberHomePage — member-only home page at /home.
 * Shows personal attendance stats and kudos received.
 * The floating Give Kudo button is rendered by RootLayout.
 */
export default function MemberHomePage() {
  const currentUser = useStore(s => s.currentUser);
  const members = useStore(s => s.members);
  const events = useStore(s => s.events);
  const kudos = useStore(s => s.kudos);

  if (!currentUser) return null;

  const member = members.find(m => m.id === currentUser.id);
  if (!member) return null;

  const myKudos = kudos.filter(k => k.to === currentUser.id);

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <MemberStatsCard member={member} events={events} />
      <KudosReceivedList kudos={myKudos} members={members} />
    </div>
  );
}
