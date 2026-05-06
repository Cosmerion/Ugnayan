export interface Member {
  id: string;
  name: string;
  joinDate: string; // ISO date "YYYY-MM-DD"
}

export interface OrgEvent {
  id: string;
  name: string;
  date: string;   // ISO date "YYYY-MM-DD"
  type: string;
  attendees: string[]; // member ids — deduplicated
}

export interface Kudo {
  id: string;
  from: string;    // member id
  to: string;      // member id
  message: string;
  createdAt: number; // Unix ms timestamp
}

export interface Session {
  userId: string;
  role: 'officer' | 'member';
}

export interface AppState {
  currentUser: { id: string; name: string; role: 'officer' | 'member' } | null;
  members: Member[];
  events: OrgEvent[];
  kudos: Kudo[];
  aiInsightCache: Record<string, string>; // memberId → insight text
  aiInsightErrors: Record<string, boolean>; // memberId → error flag
  aiInsightNoKey: Record<string, boolean>;  // memberId → no API key flag
  session: Session | null;
  storageError: boolean;
}

export interface CreateEventFormValues {
  name: string;
  date: string;   // YYYY-MM-DD
  type: string;
}

export type CheckInResult = 'success' | 'already_checked_in' | 'unknown_event';

export interface TrendDataPoint {
  month: string;         // "Jan 2025"
  attendancePct: number; // 0–100
}

export interface MemberRow {
  id: string;
  name: string;
  eventsAttended: number;
  lastActivity: string | null; // ISO date string or null
  status: 'green' | 'yellow' | 'red';
  kudosThisMonth: number;
}

export interface MonthlyAttendance {
  month: string;   // "Jan 2025"
  attended: number;
  total: number;
}

export interface Credential {
  id: string;
  name: string;
  role: 'officer' | 'member';
  password: string;
}
