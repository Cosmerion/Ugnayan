import type { Member, OrgEvent } from '../types';
import { computeAttendancePct, computeEngagementStatus } from '../selectors';

interface MemberStatsCardProps {
  member: Member;
  events: OrgEvent[];
}

function StatusBadge({ status }: { status: 'green' | 'yellow' | 'red' }) {
  const tones = {
    green: 'bg-baro-sage/20 text-baro-sage',
    yellow: 'bg-baro-yellow/20 text-baro-yellow',
    red: 'bg-baro-terra/20 text-baro-terra',
  }[status];

  const label = {
    green: 'Active',
    yellow: 'At Risk',
    red: 'Drifting',
  }[status];

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${tones}`}>
      <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
      {label}
    </span>
  );
}

export default function MemberStatsCard({ member, events }: MemberStatsCardProps) {
  const eventsAttended = events.filter(e => e.attendees.includes(member.id)).length;
  const attendancePct = computeAttendancePct(member.id, events);
  const status = computeEngagementStatus(member.id, events);

  return (
    <div className="baro-panel rounded-[28px] p-6">
      <h1 className="mb-4 font-display text-2xl text-baro-brown">Kamusta, {member.name}</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-baro-offwhite p-4 text-center">
          <div className="font-display text-4xl text-baro-brown">{eventsAttended}</div>
          <div className="mt-1 text-xs text-baro-brown/60">Events Attended</div>
        </div>

        <div className="rounded-xl bg-baro-offwhite p-4 text-center">
          <div className="font-display text-4xl text-baro-brown">{attendancePct}%</div>
          <div className="mt-1 text-xs text-baro-brown/60">Attendance Rate</div>
        </div>

        <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-baro-offwhite p-4 text-center">
          <StatusBadge status={status} />
          <div className="mt-1 text-xs text-baro-brown/60">Status</div>
        </div>
      </div>
    </div>
  );
}
