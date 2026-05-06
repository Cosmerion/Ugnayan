import { useState } from 'react';
import type { FormEvent } from 'react';
import { useStore } from '../store';
import { useToast } from './Toast';

type FieldErrors = {
  name?: string;
  date?: string;
  type?: string;
};

const EVENT_TYPES = ['General Assembly', 'Workshop', 'Social', 'Planning'];

const INITIAL_FORM = { name: '', date: '', type: '' };

/**
 * CreateEventForm — controlled form for creating a new org event.
 */
export default function CreateEventForm() {
  const createEvent = useStore(state => state.createEvent);
  const { showToast } = useToast();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nextErrors: FieldErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Event name is required.';
    if (!form.date.trim()) nextErrors.date = 'Event date is required.';
    if (!form.type.trim()) nextErrors.type = 'Event type is required.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    createEvent({ name: form.name.trim(), date: form.date, type: form.type });
    setForm(INITIAL_FORM);
    showToast('Event created! 📅', 'success');
  }

  return (
    <div className="bg-baro-cream rounded-xl border border-baro-amber/40 p-6">
      <h2 className="font-display text-baro-brown text-lg mb-4">Create Event</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-baro-bark mb-1" htmlFor="event-name">
            Name
          </label>
          <input
            id="event-name"
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="June Leadership Workshop"
            className="border border-baro-amber/60 rounded-lg px-3 py-2 w-full bg-baro-offwhite focus:outline-none focus:ring-2 focus:ring-baro-gold text-baro-bark"
          />
          {errors.name && (
            <p className="text-baro-terra text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-baro-bark mb-1" htmlFor="event-date">
            Date
          </label>
          <input
            id="event-date"
            type="date"
            value={form.date}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            className="border border-baro-amber/60 rounded-lg px-3 py-2 w-full bg-baro-offwhite focus:outline-none focus:ring-2 focus:ring-baro-gold text-baro-bark"
          />
          {errors.date && (
            <p className="text-baro-terra text-xs mt-1">{errors.date}</p>
          )}
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-baro-bark mb-1" htmlFor="event-type">
            Type
          </label>
          <select
            id="event-type"
            value={form.type}
            onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
            className="border border-baro-amber/60 rounded-lg px-3 py-2 w-full bg-baro-offwhite focus:outline-none focus:ring-2 focus:ring-baro-gold text-baro-bark"
          >
            <option value="">Select a type...</option>
            {EVENT_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {errors.type && (
            <p className="text-baro-terra text-xs mt-1">{errors.type}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-baro-gold hover:bg-baro-brown text-baro-offwhite rounded-lg px-4 py-2 w-full transition-colors"
        >
          Create Event
        </button>
      </form>
    </div>
  );
}
