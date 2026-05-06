import type { AppState, Credential } from './types';

// Hardcoded credentials for demo login
export const CREDENTIALS: Credential[] = [
  { id: 'u1', name: 'Maria Santos',     role: 'officer', password: 'officer123' },
  { id: 'u2', name: 'Jose Reyes',       role: 'member',  password: 'member123'  },
  { id: 'u3', name: 'Ana Cruz',         role: 'member',  password: 'member456'  },
  { id: 'u4', name: 'Carlo Dela Cruz',  role: 'member',  password: 'member789'  },
  { id: 'u5', name: 'Liza Bautista',    role: 'member',  password: 'member321'  },
  { id: 'u6', name: 'Ramon Villanueva', role: 'member',  password: 'member654'  },
];

// Events spanning Feb–May 2026 (8 events across 4 months)
// Sorted by date ascending for reference; the last 5 events are e4–e8.
//
// Attendance engineering (last 5 events: e4, e5, e6, e7, e8):
//   u1 (Maria)  — attends e4,e5,e6,e7,e8 → GREEN (attended most recent + 5/5)
//   u2 (Jose)   — attends e4,e5,e6,e7,e8 → GREEN (attended most recent + 5/5)
//   u3 (Ana)    — attends e4,e5,e6 only   → YELLOW (3/5, but missed e7 & e8 most recent)
//                 Wait: attended 3 of last 5 → GREEN by rule (3+ of last 5)
//                 Adjust: u3 attends e4,e5 only → 2/5, missed e6,e7,e8 → YELLOW
//   u4 (Carlo)  — attends e4 only         → 1/5, missed e5,e6,e7,e8 → YELLOW
//   u5 (Liza)   — attends none of last 5  → RED
//   u6 (Ramon)  — attends e8 (most recent)→ GREEN (attended most recent)
//
// Summary of statuses:
//   GREEN:  u1, u2, u6
//   YELLOW: u3, u4
//   RED:    u5

export const SEED_STATE: AppState = {
  currentUser: null,
  session: null,
  storageError: false,
  aiInsightCache: {},
  aiInsightErrors: {},
  aiInsightNoKey: {},

  members: [
    { id: 'u1', name: 'Maria Santos',     joinDate: '2025-06-01' },
    { id: 'u2', name: 'Jose Reyes',       joinDate: '2025-06-01' },
    { id: 'u3', name: 'Ana Cruz',         joinDate: '2025-07-15' },
    { id: 'u4', name: 'Carlo Dela Cruz',  joinDate: '2025-08-01' },
    { id: 'u5', name: 'Liza Bautista',    joinDate: '2025-09-10' },
    { id: 'u6', name: 'Ramon Villanueva', joinDate: '2025-10-05' },
  ],

  events: [
    // Feb 2026 — 2 events (e1, e2) — outside last 5
    {
      id: 'e1',
      name: 'February General Assembly',
      date: '2026-02-07',
      type: 'General Assembly',
      attendees: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6'],
    },
    {
      id: 'e2',
      name: 'February Workshop',
      date: '2026-02-21',
      type: 'Workshop',
      attendees: ['u1', 'u2', 'u3', 'u5'],
    },
    // Mar 2026 — 2 events (e3, e4) — e3 outside last 5, e4 is last-5[0]
    {
      id: 'e3',
      name: 'March Planning Session',
      date: '2026-03-07',
      type: 'Planning',
      attendees: ['u1', 'u2', 'u4', 'u6'],
    },
    {
      id: 'e4',
      name: 'March Social Night',
      date: '2026-03-21',
      type: 'Social',
      // u1, u2, u3, u4 attend; u5, u6 absent
      attendees: ['u1', 'u2', 'u3', 'u4'],
    },
    // Apr 2026 — 2 events (e5, e6)
    {
      id: 'e5',
      name: 'April General Assembly',
      date: '2026-04-05',
      type: 'General Assembly',
      // u1, u2, u3 attend; u4, u5, u6 absent
      attendees: ['u1', 'u2', 'u3'],
    },
    {
      id: 'e6',
      name: 'April Workshop',
      date: '2026-04-19',
      type: 'Workshop',
      // u1, u2 attend; u3, u4, u5, u6 absent
      attendees: ['u1', 'u2'],
    },
    // May 2026 — 2 events (e7, e8) — most recent
    {
      id: 'e7',
      name: 'May Planning Session',
      date: '2026-05-03',
      type: 'Planning',
      // u1, u2 attend; u3, u4, u5, u6 absent
      attendees: ['u1', 'u2'],
    },
    {
      id: 'e8',
      name: 'May General Assembly',
      date: '2026-05-17',
      type: 'General Assembly',
      // u1, u2, u6 attend; u3, u4, u5 absent
      attendees: ['u1', 'u2', 'u6'],
    },
  ],

  kudos: [
    // Kudos in May 2026 (current month)
    {
      id: 'k1',
      from: 'u2',
      to: 'u1',
      message: 'Salamat sa lahat ng ginawa mo para sa ating org! Lagi kang nandoon para sa amin.',
      createdAt: new Date('2026-05-18T09:00:00').getTime(),
    },
    {
      id: 'k2',
      from: 'u3',
      to: 'u1',
      message: 'Ang galing mong mag-organisa ng events. Ikaw ang pinakamahusay na officer namin!',
      createdAt: new Date('2026-05-18T10:30:00').getTime(),
    },
    {
      id: 'k3',
      from: 'u4',
      to: 'u2',
      message: 'Lagi kang handang tumulong. Maraming salamat, Jose!',
      createdAt: new Date('2026-05-19T08:00:00').getTime(),
    },
    {
      id: 'k4',
      from: 'u1',
      to: 'u3',
      message: 'Napakagaling mong mag-facilitate ng discussions. Sana makita ka namin sa susunod na event!',
      createdAt: new Date('2026-05-19T11:00:00').getTime(),
    },
    {
      id: 'k5',
      from: 'u6',
      to: 'u1',
      message: 'Palagi kang inspirasyon sa aming lahat. Maraming salamat sa iyong dedikasyon!',
      createdAt: new Date('2026-05-20T14:00:00').getTime(),
    },
    // Kudos in April 2026
    {
      id: 'k6',
      from: 'u1',
      to: 'u2',
      message: 'Napakagaling mong mag-present sa workshop. Proud kami sa iyo!',
      createdAt: new Date('2026-04-20T09:00:00').getTime(),
    },
    {
      id: 'k7',
      from: 'u2',
      to: 'u6',
      message: 'Masaya kaming makita kang bumabalik sa mga events. Tuloy lang!',
      createdAt: new Date('2026-04-21T10:00:00').getTime(),
    },
    {
      id: 'k8',
      from: 'u3',
      to: 'u4',
      message: 'Ang galing mong mag-coordinate ng logistics. Malaking tulong mo sa amin!',
      createdAt: new Date('2026-04-22T15:00:00').getTime(),
    },
    // Kudos in March 2026
    {
      id: 'k9',
      from: 'u4',
      to: 'u1',
      message: 'Ang husay ng Social Night na in-organisa mo! Masaya kaming lahat.',
      createdAt: new Date('2026-03-22T09:00:00').getTime(),
    },
    {
      id: 'k10',
      from: 'u1',
      to: 'u5',
      message: 'Nami-miss ka namin sa mga events. Sana makita ka namin muli!',
      createdAt: new Date('2026-03-23T10:00:00').getTime(),
    },
    // Kudos in February 2026
    {
      id: 'k11',
      from: 'u5',
      to: 'u2',
      message: 'Salamat sa tulong mo sa February Workshop. Napakagaling mo!',
      createdAt: new Date('2026-02-22T11:00:00').getTime(),
    },
    {
      id: 'k12',
      from: 'u6',
      to: 'u3',
      message: 'Ang galing mong mag-explain ng mga concepts. Maraming natutunan sa iyo!',
      createdAt: new Date('2026-02-23T14:00:00').getTime(),
    },
  ],
};
