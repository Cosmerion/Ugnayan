import { create } from 'zustand';
import type { AppState, CreateEventFormValues, CheckInResult } from './types';
import { CREDENTIALS, SEED_STATE } from './seedData';

type AppStore = AppState & {
  login(username: string, password: string): boolean;
  logout(): void;
  createEvent(values: CreateEventFormValues): void;
  checkIn(memberId: string, eventId: string): CheckInResult;
  sendKudo(from: string, to: string, message: string): void;
  fetchInsight(memberId: string): Promise<void>;
  _persist(): void;
  _hydrate(): void;
};

const STORAGE_KEY = 'ugnayan_state';
const EXPECTED_KEYS = ['members', 'events', 'kudos'];

export const useStore = create<AppStore>((set, get) => ({
  // Initial state — will be overwritten by _hydrate()
  ...SEED_STATE,

  _persist() {
    try {
      const state = get();
      const serializable = {
        members: state.members,
        events: state.events,
        kudos: state.kudos,
        aiInsightCache: state.aiInsightCache,
        aiInsightErrors: state.aiInsightErrors,
        aiInsightNoKey: state.aiInsightNoKey,
        session: state.session,
        currentUser: state.currentUser,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
    } catch {
      set({ storageError: true });
    }
  },

  _hydrate() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      set(SEED_STATE);
      get()._persist();
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      const isValid =
        parsed !== null &&
        typeof parsed === 'object' &&
        EXPECTED_KEYS.every(k => Array.isArray(parsed[k]));
      if (isValid) {
        set(parsed);
      } else {
        set(SEED_STATE);
        get()._persist();
      }
    } catch {
      set(SEED_STATE);
      get()._persist();
    }
  },

  login(username: string, password: string): boolean {
    const credential = CREDENTIALS.find(
      c => c.name === username && c.password === password
    );
    if (!credential) return false;

    set({
      currentUser: {
        id: credential.id,
        name: credential.name,
        role: credential.role,
      },
      session: {
        userId: credential.id,
        role: credential.role,
      },
    });
    get()._persist();
    return true;
  },

  logout() {
    set({ currentUser: null, session: null });
    get()._persist();
  },

  createEvent(values: CreateEventFormValues) {
    const newEvent = {
      id: crypto.randomUUID(),
      name: values.name,
      date: values.date,
      type: values.type,
      attendees: [],
    };
    set(state => ({ events: [...state.events, newEvent] }));
    get()._persist();
  },

  checkIn(memberId: string, eventId: string): CheckInResult {
    const state = get();
    const event = state.events.find(e => e.id === eventId);
    if (!event) return 'unknown_event';
    if (event.attendees.includes(memberId)) return 'already_checked_in';

    set(s => ({
      events: s.events.map(e =>
        e.id === eventId
          ? { ...e, attendees: [...e.attendees, memberId] }
          : e
      ),
    }));
    get()._persist();
    return 'success';
  },

  sendKudo(from: string, to: string, message: string) {
    const newKudo = {
      id: crypto.randomUUID(),
      from,
      to,
      message,
      createdAt: Date.now(),
    };
    set(state => ({ kudos: [...state.kudos, newKudo] }));
    get()._persist();
  },

  async fetchInsight(memberId: string) {
    const state = get();

    // Return immediately if already cached
    if (state.aiInsightCache[memberId]) return;

    // Check for API key
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      set(s => ({
        aiInsightNoKey: { ...s.aiInsightNoKey, [memberId]: true },
      }));
      return;
    }

    // Build prompt
    const member = state.members.find(m => m.id === memberId);
    const memberName = member?.name ?? memberId;

    const attendedEvents = state.events
      .filter(e => e.attendees.includes(memberId))
      .map(e => e.name);

    const missedEvents = state.events
      .filter(e => !e.attendees.includes(memberId))
      .map(e => e.name);

    const attendedList =
      attendedEvents.length > 0 ? attendedEvents.join(', ') : 'none';
    const missedList =
      missedEvents.length > 0 ? missedEvents.join(', ') : 'none';

    const prompt =
      `You are a supportive organizational coach. A member named ${memberName} has attended ` +
      `the following events: ${attendedList}. They missed: ${missedList}. ` +
      `Please write 2-3 sentences of supportive, non-judgmental encouragement ` +
      `to help them stay engaged. Do not mention specific names of missed events in a negative way.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const text: string =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

      set(s => ({
        aiInsightCache: { ...s.aiInsightCache, [memberId]: text },
      }));
      get()._persist();
    } catch {
      set(s => ({
        aiInsightErrors: { ...s.aiInsightErrors, [memberId]: true },
      }));
    }
  },
}));

// Hydrate immediately after store creation
useStore.getState()._hydrate();
