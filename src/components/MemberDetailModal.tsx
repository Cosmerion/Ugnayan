import { useEffect, useRef } from 'react';
import { useStore } from '../store';
import {
  computeEngagementStatus,
  computeMemberMonthlyAttendance,
} from '../selectors';
import AttendanceBarChart from './AttendanceBarChart';
import AIInsightBox from './AIInsightBox';
import KudosList from './KudosList';

interface MemberDetailModalProps {
  memberId: string | null;
  onClose: () => void;
}

// ── StatusBadge (inline, same style as MemberEngagementTable) ───────────────

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

// ── MemberDetailModal ────────────────────────────────────────────────────────

export default function MemberDetailModal({ memberId, onClose }: MemberDetailModalProps) {
  const members = useStore(s => s.members);
  const events = useStore(s => s.events);
  const kudos = useStore(s => s.kudos);
  const aiInsightCache = useStore(s => s.aiInsightCache);
  const aiInsightErrors = useStore(s => s.aiInsightErrors);
  const aiInsightNoKey = useStore(s => s.aiInsightNoKey);
  const fetchInsight = useStore(s => s.fetchInsight);

  const savedScrollY = useRef(0);

  // Lock body scroll when modal opens; restore on close
  useEffect(() => {
    if (memberId) {
      savedScrollY.current = window.scrollY;
      document.body.style.overflow = 'hidden';
      // Fetch AI insight if not already cached
      fetchInsight(memberId);
    } else {
      document.body.style.overflow = '';
      window.scrollTo(0, savedScrollY.current);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [memberId, fetchInsight]);

  // Escape key closes modal
  useEffect(() => {
    if (!memberId) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
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
      className="fixed inset-0 bg-baro-bark/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-baro-cream rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 pb-4 border-b border-baro-amber/30">
          <div className="flex items-center gap-3 flex-wrap">
            <h2
              id="modal-title"
              className="font-display text-baro-brown text-2xl"
            >
              {member.name}
            </h2>
            <StatusBadge status={status} />
          </div>
          <button
            onClick={onClose}
            className="shrink-0 text-baro-brown/60 hover:text-baro-brown transition-colors text-2xl leading-none"
            aria-label="Close member detail"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Attendance Bar Chart */}
          <div>
            <h3 className="font-display text-baro-brown text-base mb-3">
              Attendance — Past 6 Months
            </h3>
            <AttendanceBarChart data={attendanceData} />
          </div>

          {/* AI Insight */}
          <AIInsightBox
            memberId={memberId}
            insight={insight}
            error={error}
            noKey={noKey}
          />

          {/* Kudos Received */}
          <div>
            <h3 className="font-display text-baro-brown text-base mb-3">
              Kudos Received ({memberKudos.length})
            </h3>
            <div className="bg-baro-offwhite rounded-xl border border-baro-amber/30 px-4">
              <KudosList kudos={memberKudos} members={members} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
