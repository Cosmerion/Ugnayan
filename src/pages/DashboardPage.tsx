import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import {
  computeVitalityScore,
  computeMonthlyTrend,
  computeEngagementStatus,
  computeLastActivity,
  computeKudosThisMonth,
} from '../selectors';
import type { MemberRow } from '../types';
import VitalityScoreCard from '../components/VitalityScoreCard';
import TrendLineChart from '../components/TrendLineChart';
import MemberEngagementTable from '../components/MemberEngagementTable';
import MemberDetailModal from '../components/MemberDetailModal';

/**
 * DashboardPage — Officer-only view
 *
 * Layout: fixed sidebar (desktop) + scrollable main content.
 * On mobile the sidebar is hidden; NavBar handles mobile navigation.
 */
export default function DashboardPage() {
  const navigate = useNavigate();
  const logout   = useStore(s => s.logout);
  const members  = useStore(s => s.members);
  const events   = useStore(s => s.events);
  const kudos    = useStore(s => s.kudos);

  const [modalMemberId, setModalMemberId] = useState<string | null>(null);

  // ── Derived data ──────────────────────────────────────────────────────────
  const vitalityScore = computeVitalityScore(events, members);
  const trendData     = computeMonthlyTrend(events, members);

  const memberRows: MemberRow[] = members.map(m => ({
    id:             m.id,
    name:           m.name,
    eventsAttended: events.filter(e => e.attendees.includes(m.id)).length,
    lastActivity:   computeLastActivity(m.id, events),
    status:         computeEngagementStatus(m.id, events),
    kudosThisMonth: computeKudosThisMonth(m.id, kudos),
  }));

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handleLogout() {
    logout();
    navigate('/login');
  }

  // ── Sidebar nav link styles ───────────────────────────────────────────────
  const navLinkCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
     ${isActive
       ? 'bg-baro-gold/30 text-baro-cream font-semibold'
       : 'text-baro-cream/80 hover:bg-baro-gold/20 hover:text-baro-cream'}`;

  return (
    <div className="flex min-h-screen bg-baro-offwhite">

      {/* ── Sidebar (desktop only) ─────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-56 bg-baro-brown text-baro-cream min-h-screen p-4 shrink-0">

        {/* Brand */}
        <div className="flex items-center gap-2 mb-8 mt-2">
          <span className="font-baybayin text-2xl" aria-hidden="true">
            ᜂᜄ᜔ᜈᜌᜈ᜔
          </span>
          <span className="font-display text-lg font-semibold">Ugnayan</span>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 flex-1" aria-label="Sidebar navigation">
          <NavLink to="/dashboard" className={navLinkCls}>
            🏠 Dashboard
          </NavLink>
          <NavLink to="/events" className={navLinkCls}>
            📅 Events
          </NavLink>
        </nav>

        {/* Log Out */}
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                     text-baro-cream/70 hover:bg-baro-gold/20 hover:text-baro-cream
                     transition-colors"
          aria-label="Log out"
        >
          🚪 Log Out
        </button>
      </aside>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <main className="flex-1 p-6 overflow-auto">

        {/* Top row: VitalityScoreCard + TrendLineChart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <VitalityScoreCard score={vitalityScore} />
          <TrendLineChart data={trendData} />
        </div>

        {/* Member Engagement Table */}
        <MemberEngagementTable
          rows={memberRows}
          onRowClick={setModalMemberId}
        />
      </main>

      {/* ── Member Detail Modal ───────────────────────────────────────────── */}
      <MemberDetailModal
        memberId={modalMemberId}
        onClose={() => setModalMemberId(null)}
      />
    </div>
  );
}
