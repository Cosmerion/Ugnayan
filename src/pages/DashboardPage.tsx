import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import MemberDetailModal from '../components/MemberDetailModal';
import MemberEngagementTable from '../components/MemberEngagementTable';
import TrendLineChart from '../components/TrendLineChart';
import VitalityScoreCard from '../components/VitalityScoreCard';
import {
  computeEngagementStatus,
  computeKudosThisMonth,
  computeLastActivity,
  computeMonthlyTrend,
  computeVitalityScore,
} from '../selectors';
import { useStore } from '../store';
import type { MemberRow } from '../types';

const BAYBAYIN_WORD = '\u1712\u1704\u1714\u1708\u1711\u1708\u1714';

export default function DashboardPage() {
  const navigate = useNavigate();
  const logout = useStore(s => s.logout);
  const members = useStore(s => s.members);
  const events = useStore(s => s.events);
  const kudos = useStore(s => s.kudos);

  const [modalMemberId, setModalMemberId] = useState<string | null>(null);

  const vitalityScore = computeVitalityScore(events, members);
  const trendData = computeMonthlyTrend(events, members);

  const memberRows: MemberRow[] = members.map(member => ({
    id: member.id,
    name: member.name,
    eventsAttended: events.filter(event => event.attendees.includes(member.id)).length,
    lastActivity: computeLastActivity(member.id, events),
    status: computeEngagementStatus(member.id, events),
    kudosThisMonth: computeKudosThisMonth(member.id, kudos),
  }));

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const navLinkCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
      isActive
        ? 'bg-baro-gold/30 text-baro-cream font-semibold'
        : 'text-baro-cream/80 hover:bg-baro-gold/20 hover:text-baro-cream'
    }`;

  return (
    <div className="baro-shell flex min-h-screen bg-transparent">
      <aside className="hidden min-h-screen w-64 shrink-0 flex-col border-r border-baro-amber/20 bg-baro-brown/92 px-5 py-7 text-baro-cream md:flex">
        <div className="mb-10">
          <span className="font-baybayin text-2xl text-baro-amber" aria-hidden="true">
            {BAYBAYIN_WORD}
          </span>
          <div className="mt-2 font-display text-[1.55rem] font-semibold">Ugnayan</div>
          <p className="mt-2 text-sm text-baro-cream/72">
            Officer pulse view for attendance, trends, and member support.
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-1" aria-label="Sidebar navigation">
          <NavLink to="/dashboard" className={navLinkCls}>
            Dashboard
          </NavLink>
          <NavLink to="/events" className={navLinkCls}>
            Events
          </NavLink>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-2 rounded-full border border-baro-cream/20 px-4 py-3 text-sm text-baro-cream/70 transition-colors hover:bg-baro-gold/18 hover:text-baro-cream"
          aria-label="Log out"
        >
          Log Out
        </button>
      </aside>

      <main className="flex-1 overflow-auto px-4 py-5 md:px-8 md:py-8">
        <div className="mx-auto max-w-7xl">
          <section className="baro-panel mb-6 rounded-[30px] bg-gradient-to-r from-baro-cream/92 via-white/88 to-baro-offwhite/88 px-6 py-6 md:px-8">
            <p className="text-xs uppercase tracking-[0.22em] text-baro-terra">Officer Dashboard</p>
            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="font-display text-4xl text-baro-brown md:text-5xl">Org vitality at a glance</h1>
                <p className="mt-2 max-w-2xl text-sm text-baro-bark/70 md:text-base">
                  Track momentum, spot members who need support, and keep event energy visible without judgment.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-baro-brown px-4 py-3 text-baro-cream">
                  <div className="text-baro-cream/70">Members</div>
                  <div className="mt-1 font-display text-3xl">{members.length}</div>
                </div>
                <div className="rounded-2xl bg-baro-gold px-4 py-3 text-baro-offwhite">
                  <div className="text-baro-offwhite/80">Events</div>
                  <div className="mt-1 font-display text-3xl">{events.length}</div>
                </div>
              </div>
            </div>
          </section>

          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <VitalityScoreCard score={vitalityScore} />
            <TrendLineChart data={trendData} />
          </div>

          <MemberEngagementTable rows={memberRows} onRowClick={setModalMemberId} />
        </div>
      </main>

      <MemberDetailModal memberId={modalMemberId} onClose={() => setModalMemberId(null)} />
    </div>
  );
}
