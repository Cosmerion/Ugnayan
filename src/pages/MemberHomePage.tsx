import KudosReceivedList from '../components/KudosReceivedList';
import MemberStatsCard from '../components/MemberStatsCard';
import { useStore } from '../store';

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
    <div className="baro-shell px-4 py-5 md:px-8 md:py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="baro-panel rounded-[30px] bg-gradient-to-r from-baro-cream/92 to-white/88 px-6 py-6 md:px-8">
          <p className="text-xs uppercase tracking-[0.2em] text-baro-terra">Member Home</p>
          <h1 className="mt-2 font-display text-4xl text-baro-brown">Your engagement snapshot</h1>
          <p className="mt-2 max-w-2xl text-sm text-baro-bark/72">
            Review your attendance momentum and the encouragement your peers have sent you.
          </p>
        </section>

        <MemberStatsCard member={member} events={events} />
        <KudosReceivedList kudos={myKudos} members={members} />
      </div>
    </div>
  );
}
