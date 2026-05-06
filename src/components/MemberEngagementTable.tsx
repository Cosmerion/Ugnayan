import { useState } from 'react';
import type { MemberRow } from '../types';

interface MemberEngagementTableProps {
  rows: MemberRow[];
  onRowClick: (memberId: string) => void;
}

type SortKey = keyof MemberRow;
type SortDir = 'asc' | 'desc';

interface StatusBadgeProps {
  status: 'green' | 'yellow' | 'red';
}

function StatusBadge({ status }: StatusBadgeProps) {
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
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${tones}`}
      aria-label={`Engagement status: ${label}`}
    >
      <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
      {label}
    </span>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function compareRows(a: MemberRow, b: MemberRow, key: SortKey, dir: SortDir): number {
  let aVal = a[key];
  let bVal = b[key];

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

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'eventsAttended', label: 'Attended' },
  { key: 'lastActivity', label: 'Last Active' },
  { key: 'status', label: 'Status' },
  { key: 'kudosThisMonth', label: 'Kudos This Month' },
];

export default function MemberEngagementTable({ rows, onRowClick }: MemberEngagementTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  function handleHeaderClick(key: SortKey) {
    if (key === sortKey) {
      setSortDir(current => (current === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const sorted = [...rows].sort((a, b) => compareRows(a, b, sortKey, sortDir));

  return (
    <div className="baro-panel overflow-hidden rounded-[28px]">
      <div className="px-5 pt-5">
        <p className="text-xs uppercase tracking-[0.2em] text-baro-terra">Members</p>
        <h2 className="pt-2 font-display text-[1.85rem] text-baro-brown">Member Engagement</h2>
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleHeaderClick(col.key)}
                  scope="col"
                  className="cursor-pointer select-none whitespace-nowrap bg-baro-bark px-4 py-3 text-left text-sm font-medium text-baro-cream"
                  aria-sort={
                    sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
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
                className={`cursor-pointer transition-colors hover:bg-baro-amber/20 ${
                  idx % 2 === 0 ? 'bg-baro-offwhite' : 'bg-baro-cream/75'
                }`}
              >
                <td className="px-4 py-3 font-medium text-baro-brown">{row.name}</td>
                <td className="px-4 py-3 text-baro-brown">{row.eventsAttended}</td>
                <td className="px-4 py-3 text-baro-brown">{formatDate(row.lastActivity)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-4 py-3 text-baro-brown">
                  <span className="inline-flex min-w-8 justify-center rounded-full bg-baro-amber/18 px-2 py-1 text-xs font-semibold text-baro-brown">
                    {row.kudosThisMonth}
                  </span>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-8 text-center text-baro-brown/50">
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
