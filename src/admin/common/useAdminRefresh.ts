import { useEffect, useState } from 'react';

export const ADMIN_REFRESH_EVENT = 'kiddo:admin-refresh';

/**
 * Returns a tick counter that increments whenever the top bar refresh
 * button is pressed, so pages can re-fetch their data.
 */
export function useAdminRefresh(): number {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    window.addEventListener(ADMIN_REFRESH_EVENT, handler);
    return () => window.removeEventListener(ADMIN_REFRESH_EVENT, handler);
  }, []);

  return tick;
}

export function dispatchAdminRefresh() {
  window.dispatchEvent(new CustomEvent(ADMIN_REFRESH_EVENT));
}
