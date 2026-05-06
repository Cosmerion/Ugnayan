import { useEffect, useRef } from 'react';
import AttendanceBarChart from './AttendanceBarChart';
import AIInsightBox from './AIInsightBox';
import KudosList from './KudosList';
import { computeEngagementStatus, computeMemberMonthlyAttendance } from '../selectors';
import { useStore } from '../store';

interface MemberDetailModalProps {
  memberId: string | null;
  onClose: () => void;
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

export default function MemberDetailModal({ memberId, onClose }: MemberDetailModalProps) {
  const members = useStore(s => s.members);
  const events = useStore(s => s.events);
  const kudos = useStore(s => s.kudos);
  const aiInsightCache = useStore(s => s.aiInsightCache);
  const aiInsightErrors = useStore(s => s.aiInsightErrors);
  const aiInsightNoKey = useStore(s => s.aiInsightNoKey);
  const fetchInsight = useStore(s => s.fetchInsight);

  const savedScrollY = useRef(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (memberId) {
      savedScrollY.current = window.scrollY;
      document.body.style.overflow = 'hidden';
      fetchInsight(memberId);
    } else {
      document.body.style.overflow = '';
      window.scrollTo(0, savedScrollY.current);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [memberId, fetchInsight]);

  useEffect(() => {
    if (memberId) closeButtonRef.current?.focus();
  }, [memberId]);

  useEffect(() => {
    if (!memberId) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [memberId, onClose]);

  if (!memberId) return null;

  const member = members.find(m => m.id === memberId);
  if (!member) return null;

  const insight = aiInsightCache[memberId] ?? null;
  const error = aiInsightErrors[memberId] ?? false;
  const noKey = aiInsightNoKey[memberId] ?? false;
  const memberKudos = kudos.filter(k => k.to === memberId);
  const attendanceData = computeMemberMonthlyAttendance(memberId, events);
  const status = computeEngagementStatus(memberId, events);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-baro-bark/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-baro-cream shadow-2xl" onClick={event => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 border-b border-baro-amber/30 p-6 pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 id="modal-title" className="font-display text-2xl text-baro-brown">
              {member.name}
            </h2>
            <StatusBadge status={status} />
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="shrink-0 text-2xl leading-none text-baro-brown/60 transition-colors hover:text-baro-brown"
            aria-label="Close member detail"
          >
            ×
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div>
            <h3 className="mb-3 font-display text-base text-baro-brown">Attendance — Past 6 Months</h3>
            <AttendanceBarChart data={attendanceData} />
          </div>

          <AIInsightBox memberId={memberId} insight={insight} error={error} noKey={noKey} />

          <div>
            <h3 className="mb-3 font-display text-base text-baro-brown">Kudos Received ({memberKudos.length})</h3>
            <div className="rounded-xl border border-baro-amber/30 bg-baro-offwhite px-4">
              <KudosList kudos={memberKudos} members={members} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
