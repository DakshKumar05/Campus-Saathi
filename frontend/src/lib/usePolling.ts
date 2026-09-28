import { useCallback, useEffect, useRef, useState } from 'react';
import { errorMessage } from './api';

/**
 * Loads data now and then every `intervalMs` while the tab is visible, so queue
 * positions stay live without a manual refresh. `reload()` fetches immediately.
 */
export function usePolling<T>(load: () => Promise<T>, intervalMs = 5000, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState('');
  const loadRef = useRef(load);
  loadRef.current = load;

  const reload = useCallback(() => loadRef.current()
    .then((d) => { setData(d); setError(''); return d; })
    .catch((e) => { setError(errorMessage(e)); return null; }), []);

  useEffect(() => {
    setData(null);
    reload();
    const id = window.setInterval(() => { if (document.visibilityState === 'visible') reload(); }, intervalMs);
    const onVisible = () => { if (document.visibilityState === 'visible') reload(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { window.clearInterval(id); document.removeEventListener('visibilitychange', onVisible); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, intervalMs, ...deps]);

  return { data, error, reload, setData };
}

export const waitLabel = (minutes: number) =>
  minutes <= 0 ? 'You’re next' : minutes < 60 ? `~${minutes} min wait` : `~${Math.floor(minutes / 60)} h ${minutes % 60} min wait`;
