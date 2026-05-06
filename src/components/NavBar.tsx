import { NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../store';

const BAYBAYIN_WORD = '\u1712\u1704\u1714\u1708\u1711\u1708\u1714';

export default function NavBar() {
  const session = useStore(s => s.session);
  const logout = useStore(s => s.logout);
  const navigate = useNavigate();

  const isOfficer = session?.role === 'officer';

  const links = isOfficer
    ? [
        { to: '/dashboard', label: 'Dashboard', short: 'DB' },
        { to: '/events', label: 'Events', short: 'EV' },
      ]
    : [
        { to: '/home', label: 'Home', short: 'HM' },
        { to: '/scan', label: 'Scan QR', short: 'QR' },
      ];

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const activeCls = 'text-baro-cream border-b-2 border-baro-amber font-semibold';
  const linkCls =
    'text-baro-cream/78 border-b-2 border-transparent hover:text-baro-cream hover:border-baro-amber/50 transition-colors';

  return (
    <>
      <header className="baro-panel sticky top-0 z-50 hidden items-center justify-between border-x-0 border-t-0 bg-baro-bark/96 px-6 py-4 text-baro-cream md:flex">
        <div className="flex items-center gap-2">
          <span className="font-baybayin text-xl text-baro-amber" aria-hidden="true">
            {BAYBAYIN_WORD}
          </span>
          <span className="font-display text-xl font-semibold tracking-[0.02em]">Ugnayan</span>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <nav aria-label="Main navigation" className="flex items-center gap-5">
            {links.map(({ to, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `pb-1 ${isActive ? activeCls : linkCls}`}>
                {label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="ml-4 rounded-full border border-baro-cream/35 px-4 py-2 text-sm text-baro-cream hover:bg-baro-cream/10 transition-colors"
            aria-label="Log out"
          >
            Log Out
          </button>
        </div>
      </header>

      <nav
        className="baro-panel fixed inset-x-3 bottom-3 z-50 flex rounded-2xl bg-baro-bark/96 text-baro-cream md:hidden"
        aria-label="Mobile navigation"
      >
        {links.map(({ to, short, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[11px] ${
                isActive ? 'text-baro-amber font-semibold' : 'text-baro-cream/80 hover:text-baro-amber'
              }`
            }
            aria-label={label}
          >
            <span
              className="rounded-full border border-current/25 px-2 py-0.5 text-[10px] leading-none tracking-[0.14em]"
              aria-hidden="true"
            >
              {short}
            </span>
            <span>{label}</span>
          </NavLink>
        ))}

        <button
          onClick={handleLogout}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[11px] text-baro-cream/80 hover:text-baro-amber transition-colors"
          aria-label="Log out"
        >
          <span
            className="rounded-full border border-current/25 px-2 py-0.5 text-[10px] leading-none tracking-[0.14em]"
            aria-hidden="true"
          >
            OUT
          </span>
          <span>Log Out</span>
        </button>
      </nav>
    </>
  );
}
