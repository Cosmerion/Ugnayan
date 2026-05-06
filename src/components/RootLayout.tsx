import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useStore } from '../store';
import NavBar from './NavBar';
import KudosModal from './KudosModal';
import StorageWarningBanner from './StorageWarningBanner';

export default function RootLayout() {
  const session = useStore(s => s.session);
  const [kudosOpen, setKudosOpen] = useState(false);

  const isMember = session?.role === 'member';

  return (
    <div className="baro-shell flex min-h-screen flex-col bg-baro-offwhite">
      <StorageWarningBanner />
      <NavBar />

      <main className="flex-1 pb-24 md:pb-0">
        <Outlet />
      </main>

      {isMember && (
        <button
          onClick={() => setKudosOpen(true)}
          className="baro-panel fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-baro-gold px-5 py-3 text-sm font-medium text-white shadow-lg transition-colors hover:bg-baro-brown"
          aria-label="Give a Kudo"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/18 text-[10px] tracking-[0.15em]">
            KD
          </span>
          Give Kudo
        </button>
      )}

      <KudosModal isOpen={kudosOpen} onClose={() => setKudosOpen(false)} />
    </div>
  );
}
