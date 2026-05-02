

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { fetchNotifications } from '../api/notifications';
import { fLog } from '../middleware/logger';

const STORAGE_KEY = 'campus_viewed_ids';
const POLL_INTERVAL_MS = 30_000; // 30 seconds

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications]   = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [viewedIds, setViewedIds]           = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const pollRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...viewedIds]));
    } catch {
      // Private browsing / storage full — not fatal
    }
  }, [viewedIds]);

  const loadNotifications = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);

    try {
      const data = await fetchNotifications({ limit: 10, page: 1 });
      setNotifications(data);

      await fLog("info", "state", `Notification store updated — ${data.length} item(s) in memory`);
    } catch (err) {
      setError("Unable to reach the notification server. Please try again.");
      await fLog("error", "state", `Failed to load notifications: ${err.message}`);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  const markViewed = useCallback(async (id) => {
    setViewedIds(prev => {
      if (prev.has(id)) return prev;   // already viewed — no-op
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    await fLog("info", "state", `Notification ${id} marked as viewed`);
  }, []);

  const markAllViewed = useCallback(async () => {
    setViewedIds(prev => {
      const next = new Set(prev);
      notifications.forEach(n => next.add(n.ID));
      return next;
    });
    await fLog("info", "state", `All ${notifications.length} notifications marked as viewed`);
  }, [notifications]);

  useEffect(() => {
    loadNotifications();

    pollRef.current = setInterval(() => {
      loadNotifications(true); // silent = true, no loading spinner for polls
    }, POLL_INTERVAL_MS);

    return () => {
      clearInterval(pollRef.current);
    };
  }, [loadNotifications]);

  const unreadCount = notifications.filter(n => !viewedIds.has(n.ID)).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        error,
        viewedIds,
        unreadCount,
        markViewed,
        markAllViewed,
        reload: () => loadNotifications(),
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside <NotificationProvider>');
  return ctx;
}
