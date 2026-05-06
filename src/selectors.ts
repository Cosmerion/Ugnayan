import type { Member, OrgEvent, Kudo, TrendDataPoint, MonthlyAttendance } from './types';

/**
 * Vitality Score: (total attendances / (memberCount × eventCount)) × 100
 * Returns 0 if events or members is empty.
 */
export function computeVitalityScore(events: OrgEvent[], members: Member[]): number {
  if (events.length === 0 || members.length === 0) return 0;
  const totalAttendances = events.reduce((sum, e) => sum + e.attendees.length, 0);
  const maxPossible = members.length * events.length;
  return Math.round((totalAttendances / maxPossible) * 100);
}

/**
 * Engagement Status based on last 5 events:
 * - green: attended most recent event OR attended 3+ of last 5
 * - red: missed all 5 of last 5
 * - yellow: otherwise (missed 3+ of last 5)
 */
export function computeEngagementStatus(
  memberId: string,
  events: OrgEvent[]
): 'green' | 'yellow' | 'red' {
  const sorted = [...events].sort((a, b) => b.date.localeCompare(a.date));
  const last5 = sorted.slice(0, 5);

  if (last5.length === 0) return 'yellow';

  const attendedLast = last5[0]?.attendees.includes(memberId) ?? false;
  const attendedCount = last5.filter(e => e.attendees.includes(memberId)).length;

  if (attendedLast || attendedCount >= 3) return 'green';
  if (attendedCount === 0) return 'red';
  return 'yellow';
}

/**
 * Format a "YYYY-MM" key into "MMM YYYY" label (e.g. "Jan 2025").
 */
function formatMonthLabel(yyyyMM: string): string {
  const [year, month] = yyyyMM.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
}

/**
 * Monthly trend: attendance % per month for up to last 6 months that have events.
 * Skips months with 0 events.
 */
export function computeMonthlyTrend(
  events: OrgEvent[],
  members: Member[]
): TrendDataPoint[] {
  if (members.length === 0) return [];

  // Group events by YYYY-MM
  const byMonth: Record<string, OrgEvent[]> = {};
  for (const event of events) {
    const key = event.date.slice(0, 7); // "YYYY-MM"
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(event);
  }

  // Sort months descending, take up to 6
  const sortedMonths = Object.keys(byMonth).sort((a, b) => b.localeCompare(a)).slice(0, 6);

  // Return in ascending order for the chart
  return sortedMonths
    .reverse()
    .map(monthKey => {
      const monthEvents = byMonth[monthKey];
      const totalAttendances = monthEvents.reduce((sum, e) => sum + e.attendees.length, 0);
      const maxPossible = members.length * monthEvents.length;
      const attendancePct = Math.round((totalAttendances / maxPossible) * 100);
      return {
        month: formatMonthLabel(monthKey),
        attendancePct,
      };
    });
}

/**
 * Attendance percentage for a single member across all events.
 * Returns 0 if events is empty.
 */
export function computeAttendancePct(memberId: string, events: OrgEvent[]): number {
  if (events.length === 0) return 0;
  const attended = events.filter(e => e.attendees.includes(memberId)).length;
  return Math.round((attended / events.length) * 100);
}

/**
 * Last activity date for a member (most recent event they attended).
 * Returns null if they haven't attended any event.
 */
export function computeLastActivity(memberId: string, events: OrgEvent[]): string | null {
  const attended = events
    .filter(e => e.attendees.includes(memberId))
    .sort((a, b) => b.date.localeCompare(a.date));
  return attended.length > 0 ? attended[0].date : null;
}

/**
 * Monthly attendance breakdown for a member (for bar chart in modal).
 * Returns last 6 months that have events.
 */
export function computeMemberMonthlyAttendance(
  memberId: string,
  events: OrgEvent[]
): MonthlyAttendance[] {
  // Group events by YYYY-MM
  const byMonth: Record<string, OrgEvent[]> = {};
  for (const event of events) {
    const key = event.date.slice(0, 7);
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(event);
  }

  // Sort months descending, take up to 6
  const sortedMonths = Object.keys(byMonth).sort((a, b) => b.localeCompare(a)).slice(0, 6);

  // Return in ascending order
  return sortedMonths
    .reverse()
    .map(monthKey => {
      const monthEvents = byMonth[monthKey];
      const attended = monthEvents.filter(e => e.attendees.includes(memberId)).length;
      return {
        month: formatMonthLabel(monthKey),
        attended,
        total: monthEvents.length,
      };
    });
}

/**
 * Kudos received by a member in the current calendar month.
 */
export function computeKudosThisMonth(memberId: string, kudos: Kudo[]): number {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  return kudos.filter(k => {
    if (k.to !== memberId) return false;
    const d = new Date(k.createdAt);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  }).length;
}
