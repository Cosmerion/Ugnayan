import { useState } from 'react';
import type { MemberRow } from '../types';

interface MemberEngagementTableProps {
  rows: MemberRow[];
  onRowClick: (memberId: string) => void;
}

type SortKey = keyof MemberRow;
type SortDir = 'asc' | 'desc';

// ── Status badge ────────────────────────────────────────────────────────────

interface StatusBadgeProps {
  status: 'green' | 'yellow' | 'red';
}

function StatusBadge({ status }: StatusBadgeProps) {
  if (status === 'green') {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                   bg-baro-sage/20 text-baro-sage"
        aria-label="Engagement status: Active"
      >
        ✓ Active
      </span>
    );
  }
  if (status === 'yellow') {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                   bg-baro-yellow/20 text-baro-yellow"
        aria-label="Engagement status: At Risk"
      >
        ⚠ At Risk
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                 bg-baro-terra/20 text-baro-terra"
      aria-label="Engagement status: Drifting"
    >
      ✕ Drifting
    </span>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00'); // parse as local date
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function compareRows(a: MemberRow, b: MemberRow, key: SortKey, dir: SortDir): number {
  let aVal = a[key];
  let bVal = b[key];

  // Treat null lastActivity as empty string for sorting (sorts last)
  if (aVal === null) aVal = '';
  if (bVal === null) bVal = '';

  let cmp = 0;
  if (typeof aVal === 'string' && typeof bVal === 'string') {
    cmp = aVal.localeCompare(bVal);
  } else if (typeof aVal === 'number' && typeof bVal === 'number') {
    cmp = aVal - bVal;
  }

  return dir === 'asc' ? cmp : -cmp;
}

// ── Column definitions ───────────────────────────────────────────────────────

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'name',           label: 'Name' },
  { key: 'eventsAttended', label: 'Attended' },
  { key: 'lastActivity',   label: 'Last Active' },
  { key: 'status',         label: 'Status' },
  { key: 'kudosThisMonth', label: 'Kudos This Month' },
];

// ── Component ────────────────────────────────────────────────────────────────

/**
 * MemberEngagementTable
 *
 * Sortable table of member engagement data.
 * Clicking a row opens the MemberDetailModal.
 */
export default function MemberEngagementTable({
  rows,
  onRowClick,
}: MemberEngagementTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  function handleHeaderClick(key: SortKey) {
    if (key === sortKey) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const sorted = [...rows].sort((a, b) => compareRows(a, b, sortKey, sortDir));

  return (
    <div className="bg-baro-cream rounded-xl shadow-sm border border-baro-amber/40 overflow-hidden">
      <h2 className="font-display text-baro-brown text-lg p-4 pb-0">
        Member Engagement
      </h2>

      <div className="overflow-x-auto mt-3">
        <table className="w-full text-sm">
          <thead>
            <tr>
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleHeaderClick(col.key)}
                  className="bg-baro-bark text-baro-cream text-sm font-medium px-4 py-3
                             cursor-pointer select-none text-left whitespace-nowrap"
                  aria-sort={
                    sortKey === col.key
                      ? sortDir === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                >
                  {col.label}
                  {sortKey === col.key && (
                    <span className="ml-1 text-baro-amber" aria-hidden="true">
                      {sortDir === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, idx) => (
              <tr
                key={row.id}
                onClick={() => onRowClick(row.id)}
                className={`cursor-pointer hover:bg-baro-amber/20 transition-colors
                  ${idx % 2 === 0 ? 'bg-baro-offwhite' : 'bg-baro-cream'}`}
              >
                <td className="px-4 py-3 text-baro-brown font-medium">{row.name}</td>
                <td className="px-4 py-3 text-baro-brown">{row.eventsAttended}</td>
                <td className="px-4 py-3 text-baro-brown">{formatDate(row.lastActivity)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-4 py-3 text-baro-brown">{row.kudosThisMonth}</td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="px-4 py-8 text-center text-baro-brown/50"
                >
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
