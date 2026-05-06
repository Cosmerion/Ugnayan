import { NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../store';

// ---------------------------------------------------------------------------
// NavBar
// Sticky top bar on desktop; collapses to a fixed bottom tab bar on mobile.
// ---------------------------------------------------------------------------

export default function NavBar() {
  const session  = useStore(s => s.session);
  const logout   = useStore(s => s.logout);
  const navigate = useNavigate();

  const isOfficer = session?.role === 'officer';

  const links = isOfficer
    ? [
        { to: '/dashboard', label: 'Dashboard', short: '🏠' },
        { to: '/events',    label: 'Events',    short: '📅' },
      ]
    : [
        { to: '/home', label: 'Home',    short: '🏠' },
        { to: '/scan', label: 'Scan QR', short: '📷' },
      ];

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const activeCls = 'underline underline-offset-4 font-semibold';
  const linkCls   = 'hover:underline hover:underline-offset-4 transition-colors';

  return (
    <>
      {/* ── Desktop top bar (hidden on mobile) ─────────────────────────── */}
      <header className="hidden md:flex sticky top-0 z-50 items-center justify-between
                         bg-baro-bark text-baro-cream px-6 py-3 shadow-md">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="font-baybayin text-xl" aria-hidden="true">
            ᜂᜄ᜔ᜈᜌᜈ᜔
          </span>
          <span className="font-display text-lg font-semibold tracking-wide">
            Ugnayan
          </span>
        </div>

        {/* Nav links + Log Out */}
        <nav className="flex items-center gap-6 text-sm">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive ? activeCls : linkCls
              }
            >
              {label}
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="ml-4 rounded-md border border-baro-cream/40 px-3 py-1
                       text-sm hover:bg-baro-cream/10 transition-colors"
            aria-label="Log out"
          >
            Log Out
          </button>
        </nav>
      </header>

      {/* ── Mobile bottom tab bar (visible only on mobile) ──────────────── */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-50 flex
                   bg-baro-bark text-baro-cream border-t border-baro-cream/20"
        aria-label="Mobile navigation"
      >
        {links.map(({ to, short, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2 text-xs gap-0.5
               ${isActive ? 'text-baro-amber font-semibold' : 'hover:text-baro-amber'}`
            }
            aria-label={label}
          >
            <span className="text-lg leading-none" aria-hidden="true">
              {short}
            </span>
            <span>{label}</span>
          </NavLink>
        ))}

        {/* Log Out tab */}
        <button
          onClick={handleLogout}
          className="flex-1 flex flex-col items-center justify-center py-2 text-xs gap-0.5
                     hover:text-baro-amber transition-colors"
          aria-label="Log out"
        >
          <span className="text-lg leading-none" aria-hidden="true">🚪</span>
          <span>Log Out</span>
        </button>
      </nav>
    </>
  );
}
