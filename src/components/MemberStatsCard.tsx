import type { Member, OrgEvent } from '../types';
import { computeAttendancePct, computeEngagementStatus } from '../selectors';

interface MemberStatsCardProps {
  member: Member;
  events: OrgEvent[];
}

// ── StatusBadge (same style as MemberEngagementTable) ───────────────────────

function StatusBadge({ status }: { status: 'green' | 'yellow' | 'red' }) {
  if (status === 'green') {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-baro-sage/20 text-baro-sage"
        aria-label="Engagement status: Active"
      >
        ✓ Active
      </span>
    );
  }
  if (status === 'yellow') {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-baro-yellow/20 text-baro-yellow"
        aria-label="Engagement status: At Risk"
      >
        ⚠ At Risk
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-baro-terra/20 text-baro-terra"
      aria-label="Engagement status: Drifting"
    >
      ✕ Drifting
    </span>
  );
}

/**
 * MemberStatsCard — welcome card with attendance stats for the member home page.
 */
export default function MemberStatsCard({ member, events }: MemberStatsCardProps) {
  const eventsAttended = events.filter(e => e.attendees.includes(member.id)).length;
  const attendancePct = computeAttendancePct(member.id, events);
  const status = computeEngagementStatus(member.id, events);

  return (
    <div className="bg-baro-cream rounded-xl border border-baro-amber/40 p-6">
      <h1 className="font-display text-baro-brown text-2xl mb-4">
        Kamusta, {member.name}! 👋
      </h1>

      <div className="grid grid-cols-3 gap-4">
        {/* Events Attended */}
        <div className="bg-baro-offwhite rounded-xl p-4 text-center">
          <div className="text-4xl font-display text-baro-brown">{eventsAttended}</div>
          <div className="text-baro-brown/60 text-xs mt-1">Events Attended</div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-baro-offwhite rounded-xl p-4 text-center">
          <div className="text-4xl font-display text-baro-brown">{attendancePct}%</div>
          <div className="text-baro-brown/60 text-xs mt-1">Attendance Rate</div>
        </div>

        {/* Status */}
        <div className="bg-baro-offwhite rounded-xl p-4 text-center flex flex-col items-center justify-center gap-1">
          <StatusBadge status={status} />
          <div className="text-baro-brown/60 text-xs mt-1">Status</div>
        </div>
      </div>
    </div>
  );
}
