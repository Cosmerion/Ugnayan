import { useStore } from '../store';

export default function StorageWarningBanner() {
  const storageError = useStore(s => s.storageError);
  if (!storageError) return null;

  return (
    <div
      role="alert"
      className="border-b border-baro-terra/20 bg-baro-terra/10 px-4 py-2 text-center text-sm text-baro-terra"
    >
      Warning: unable to save data. Your browser may have storage restrictions, so changes may not persist.
    </div>
  );
}
