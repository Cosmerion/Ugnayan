import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

const DEMO_ACCOUNTS = [
  { name: 'Maria Santos', password: 'officer123', role: 'Officer' },
  { name: 'Jose Reyes', password: 'member123', role: 'Member' },
  { name: 'Ana Cruz', password: 'member456', role: 'Member' },
];

export default function LoginPage() {
  const login = useStore(state => state.login);
  const session = useStore(state => state.session);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session) return;
    navigate(session.role === 'officer' ? '/dashboard' : '/home', { replace: true });
  }, [navigate, session]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const success = login(username.trim(), password);

    if (!success) {
      setError('Invalid credentials. Use one of the demo accounts below.');
      return;
    }

    const nextSession = useStore.getState().session;
    navigate(nextSession?.role === 'officer' ? '/dashboard' : '/home', {
      replace: true,
    });
  }

  return (
    <div className="min-h-screen bg-baro-offwhite px-4 py-10">
      <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-baro-gold/30 bg-baro-cream shadow-2xl md:grid-cols-[1.1fr_0.9fr]">
          <section className="bg-gradient-to-br from-baro-bark via-baro-brown to-baro-terra p-8 text-baro-offwhite md:p-10">
            <p className="font-baybayin text-4xl">ᜂᜄ᜔ᜈᜌᜈ᜔</p>
            <h1 className="mt-4 font-display text-4xl">Ugnayan</h1>
            <p className="mt-3 max-w-md text-sm text-baro-cream/90">
              Filipino-themed org health tracking for events, check-ins, and peer recognition.
            </p>

            <div className="mt-8 rounded-2xl border border-baro-cream/20 bg-baro-cream/10 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.22em] text-baro-amber">Demo Accounts</p>
              <ul className="mt-3 space-y-3 text-sm">
                {DEMO_ACCOUNTS.map(account => (
                  <li key={account.name} className="rounded-xl bg-white/10 p-3">
                    <div className="font-medium">{account.role}</div>
                    <div>{account.name}</div>
                    <div className="text-baro-cream/80">{account.password}</div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="p-8 md:p-10">
            <div className="mx-auto max-w-md">
              <p className="text-sm uppercase tracking-[0.2em] text-baro-terra">Sign In</p>
              <h2 className="mt-3 font-display text-3xl text-baro-brown">Open the prototype</h2>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-baro-bark">Username</span>
                  <input
                    value={username}
                    onChange={event => setUsername(event.target.value)}
                    className="w-full rounded-xl border border-baro-amber/60 bg-white px-4 py-3 text-baro-bark outline-none transition focus:border-baro-gold"
                    placeholder="Maria Santos"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-baro-bark">Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    className="w-full rounded-xl border border-baro-amber/60 bg-white px-4 py-3 text-baro-bark outline-none transition focus:border-baro-gold"
                    placeholder="officer123"
                  />
                </label>

                {error ? <p className="text-sm text-baro-terra">{error}</p> : null}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-baro-gold px-4 py-3 font-medium text-baro-offwhite transition hover:bg-baro-brown"
                >
                  Sign In
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
