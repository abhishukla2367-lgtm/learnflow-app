import { useState, useEffect, useCallback, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import notificationApi from '../api/notificationApi';

const POLL_INTERVAL = 60_000; // 60 s fallback poll

export function useNotifications() {
  const { user } = useAuth();
  const { socket, connected } = useSocket();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [loading,       setLoading]       = useState(false);
  const [page,          setPage]          = useState(1);
  const [hasMore,       setHasMore]       = useState(true);
  const pollRef = useRef(null);

  /* ── Fetch (initial + pagination) ─────────────────────────── */
  const fetchNotifications = useCallback(async (pageNum = 1, append = false) => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await notificationApi.getAll({ page: pageNum, limit: 20 });
      setUnreadCount(data.unreadCount ?? 0);
      setHasMore(data.notifications.length === 20);
      setNotifications(prev =>
        append ? [...prev, ...data.notifications] : data.notifications
      );
    } catch (err) {
      console.error('[useNotifications] fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  /* ── Initial load ──────────────────────────────────────────── */
  useEffect(() => {
    if (user) {
      setPage(1);
      fetchNotifications(1, false);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, fetchNotifications]);

  /* ── Socket: join notifications room + listen for new ones ── */
  useEffect(() => {
    if (!socket || !connected || !user) return;
    const userId = user._id || user.id;
    socket.emit('notifications:join', userId);

    const handleNew = (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(c => c + 1);
    };

    socket.on('notification:new', handleNew);
    return () => socket.off('notification:new', handleNew);
  }, [socket, connected, user]);

  /* ── Fallback polling when socket isn't reliable ──────────── */
  useEffect(() => {
    if (!user) return;
    pollRef.current = setInterval(() => fetchNotifications(1, false), POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [user, fetchNotifications]);

  /* ── Load more (pagination) ────────────────────────────────── */
  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage, true);
  }, [page, fetchNotifications]);

  /* ── Mark single as read ──────────────────────────────────── */
  const markRead = useCallback(async (id) => {
    const target = notifications.find(n => n._id === id);
    if (!target || target.isRead) return;
    try {
      await notificationApi.markRead(id);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n)
      );
      setUnreadCount(c => Math.max(0, c - 1));
    } catch (err) {
      console.error('[useNotifications] markRead error:', err.message);
    }
  }, [notifications]);

  /* ── Mark all as read ─────────────────────────────────────── */
  const markAllRead = useCallback(async () => {
    try {
      await notificationApi.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('[useNotifications] markAllRead error:', err.message);
    }
  }, []);

  /* ── Delete single ────────────────────────────────────────── */
  const remove = useCallback(async (id) => {
    const target = notifications.find(n => n._id === id);
    try {
      await notificationApi.remove(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      if (target && !target.isRead) setUnreadCount(c => Math.max(0, c - 1));
    } catch (err) {
      console.error('[useNotifications] remove error:', err.message);
    }
  }, [notifications]);

  /* ── Refresh ──────────────────────────────────────────────── */
  const refresh = useCallback(() => {
    setPage(1);
    fetchNotifications(1, false);
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    hasMore,
    markRead,
    markAllRead,
    remove,
    loadMore,
    refresh,
  };
}