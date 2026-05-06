import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useStore } from '../store';
import NavBar from './NavBar';
import KudosModal from './KudosModal';

/**
 * RootLayout
 *
 * Wraps all protected pages with:
 *  - Sticky <NavBar> at the top
 *  - <Outlet> for page content
 *  - Floating "Give Kudo" button (member role only, bottom-right)
 *  - <KudosModal> stub (opened by the floating button)
 *
 * The <ToastContainer> is rendered by <ToastProvider> in main.tsx so it is
 * available app-wide without needing to be re-mounted per layout.
 */
export default function RootLayout() {
  const session = useStore(s => s.session);
  const [kudosOpen, setKudosOpen] = useState(false);

  const isMember = session?.role === 'member';

  return (
    <div className="min-h-screen bg-baro-offwhite flex flex-col">
      {/* Sticky top navigation */}
      <NavBar />

      {/* Page content */}
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Floating "Give Kudo" button — member only */}
      {isMember && (
        <button
          onClick={() => setKudosOpen(true)}
          className="bg-baro-gold text-white rounded-full shadow-lg px-4 py-3
                     fixed bottom-6 right-6 z-40
                     hover:bg-baro-brown transition-colors
                     flex items-center gap-1 text-sm font-medium"
          aria-label="Give a Kudo"
        >
          🌸 Kudo
        </button>
      )}

      {/* Kudos modal */}
      <KudosModal isOpen={kudosOpen} onClose={() => setKudosOpen(false)} />
    </div>
  );
}
