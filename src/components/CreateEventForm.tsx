import { useState } from 'react';
import type { FormEvent } from 'react';
import { useToast } from './Toast';
import { useStore } from '../store';

type FieldErrors = {
  name?: string;
  date?: string;
  type?: string;
};

const EVENT_TYPES = ['General Assembly', 'Workshop', 'Social', 'Planning'];
const INITIAL_FORM = { name: '', date: '', type: '' };

export default function CreateEventForm() {
  const createEvent = useStore(state => state.createEvent);
  const { showToast } = useToast();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FieldErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Event name is required.';
    if (!form.date.trim()) nextErrors.date = 'Event date is required.';
    if (!form.type.trim()) nextErrors.type = 'Event type is required.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    createEvent({ name: form.name.trim(), date: form.date, type: form.type });
    setForm(INITIAL_FORM);
    showToast('Event created.', 'success');
  }

  return (
    <div className="baro-panel rounded-[28px] p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-baro-terra">Create</p>
      <h2 className="mt-2 mb-4 font-display text-[1.8rem] leading-none text-baro-brown">New event</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-sm font-medium text-baro-bark" htmlFor="event-name">
            Name
          </label>
          <input
            id="event-name"
            type="text"
            value={form.name}
            onChange={event => setForm(current => ({ ...current, name: event.target.value }))}
            placeholder="June Leadership Workshop"
            className="w-full rounded-lg border border-baro-amber/60 bg-baro-offwhite px-3 py-2 text-baro-bark focus:outline-none focus:ring-2 focus:ring-baro-gold"
          />
          {errors.name && <p className="mt-1 text-xs text-baro-terra">{errors.name}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-baro-bark" htmlFor="event-date">
            Date
          </label>
          <input
            id="event-date"
            type="date"
            value={form.date}
            onChange={event => setForm(current => ({ ...current, date: event.target.value }))}
            className="w-full rounded-lg border border-baro-amber/60 bg-baro-offwhite px-3 py-2 text-baro-bark focus:outline-none focus:ring-2 focus:ring-baro-gold"
          />
          {errors.date && <p className="mt-1 text-xs text-baro-terra">{errors.date}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-baro-bark" htmlFor="event-type">
            Type
          </label>
          <select
            id="event-type"
            value={form.type}
            onChange={event => setForm(current => ({ ...current, type: event.target.value }))}
            className="w-full rounded-lg border border-baro-amber/60 bg-baro-offwhite px-3 py-2 text-baro-bark focus:outline-none focus:ring-2 focus:ring-baro-gold"
          >
            <option value="">Select a type...</option>
            {EVENT_TYPES.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.type && <p className="mt-1 text-xs text-baro-terra">{errors.type}</p>}
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-baro-gold px-4 py-2 text-baro-offwhite transition-colors hover:bg-baro-brown"
        >
          Create Event
        </button>
      </form>
    </div>
  );
}
