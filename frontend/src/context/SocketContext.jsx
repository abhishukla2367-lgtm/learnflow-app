import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth, enrollmentKey } from './AuthContext';

/* ── Singleton socket — created once, survives StrictMode ── */
const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
  withCredentials: true,
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 10,
  reconnectionDelay: 1500,
  autoConnect: false,
  auth: { token: localStorage.getItem('lf_token') || '' },
});

const SocketContext = createContext({
  socket: null,
  onlineCount: 0,
  connected: false,
  liveStats: null,
  recentActivity: [],
  emit: () => {},
});

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [onlineCount,    setOnlineCount]    = useState(0);
  const [connected,      setConnected]      = useState(false);
  const [liveStats,      setLiveStats]      = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  /* ── Update socket auth token when user changes (login / logout) ── */
  useEffect(() => {
    const token = localStorage.getItem('lf_token') || '';
    socket.auth = { token };
    // Reconnect so backend picks up the new token
    if (socket.connected) {
      socket.disconnect();
      socket.connect();
    }
  }, [user]);

  useEffect(() => {
    socket.connect();

    socket.on('connect',    () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('users:online', (count) => setOnlineCount(count));
    socket.on('stats:update', (stats)  => setLiveStats(stats));

    socket.on('activity:new', (event) => {
      setRecentActivity(prev => [event, ...prev].slice(0, 20));
    });

    socket.on('data:refresh', ({ section }) => {
      window.dispatchEvent(new CustomEvent('lf:refresh', { detail: { section } }));
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('users:online');
      socket.off('stats:update');
      socket.off('activity:new');
      socket.off('data:refresh');
    };
  }, []);

  /* ── Real-time enrollment confirmation ────────────────────────────────────
     When the backend saves an enrollment and emits 'enrollment:confirmed',
     we persist it to the user-scoped localStorage so MyCourses shows it
     immediately — even before the API fetch completes.
  ── */
  useEffect(() => {
    if (!user) return;
    const uid   = user._id || user.id;
    const lsKey = enrollmentKey(uid);

    const handleConfirmed = (payload) => {
      try {
        const stored  = JSON.parse(localStorage.getItem(lsKey) || '[]');
        const deduped = stored.filter(e =>
          (e.certId || e.course?._id || e.course?.id) !== String(payload.certId)
        );
        const entry = {
          _id:        payload.enrollmentId,
          course:     { _id: payload.certId, id: payload.certId, ...payload.certData },
          certId:     payload.certId,
          progress:   0,
          enrolledAt: payload.enrolledAt || new Date().toISOString(),
          type:       'paid',
        };
        localStorage.setItem(lsKey, JSON.stringify([...deduped, entry]));

        // Notify MyCourses to re-merge
        window.dispatchEvent(new CustomEvent('lf:enrollment:new', { detail: entry }));
      } catch {/* ignore */}
    };

    socket.on('enrollment:confirmed', handleConfirmed);
    return () => socket.off('enrollment:confirmed', handleConfirmed);
  }, [user]);

  /* ── Join rooms once connected ── */
  useEffect(() => {
    if (!connected) return;
    if (user) {
      socket.emit('user:join', { userId: user.id || user._id, role: user.role });
      if (user.role === 'admin') socket.emit('admin:join');
    }
  }, [user, connected]);

  const emit = useCallback((event, data) => {
    socket?.emit(event, data);
  }, []);

  return (
    <SocketContext.Provider value={{
      socket,
      onlineCount,
      connected,
      liveStats,
      recentActivity,
      emit,
    }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
