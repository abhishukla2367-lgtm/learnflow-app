import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import {
  BookOpen, Award, Flame, Bell, ChevronRight,
  Wifi, WifiOff, TrendingUp, Play, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

/* ─── Stat Card ───────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}>
        <Icon size={20} className={color} />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 font-sans uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-black text-slate-900 leading-tight">{value}</p>
      </div>
    </div>
  );
}

/* ─── Enrollment Card ─────────────────────────────────────── */
function EnrollmentCard({ enrollment }) {
  const progress = enrollment.progress ?? 0;
  const course = enrollment.course ?? {};
  return (
    <Link
      to={`/course/${course._id}`}
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
    >
      <div className="relative h-36 bg-gradient-to-br from-cyan-400 to-violet-500 flex-shrink-0">
        {course.thumbnail && (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {course.category && (
          <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-white/20">
            {course.category}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-black text-slate-900 text-sm leading-snug line-clamp-2 mb-3 font-sans">
          {course.title || 'Untitled Course'}
        </h3>
        <div className="mt-auto space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500 font-sans">Progress</span>
            <span className="text-xs font-bold text-cyan-600">{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-cyan-500 to-violet-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Notification Item ───────────────────────────────────── */
function NotificationItem({ n }) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${n.read ? 'bg-slate-50' : 'bg-cyan-50 border border-cyan-100'}`}>
      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.read ? 'bg-slate-300' : 'bg-cyan-500'}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-sans leading-relaxed ${n.read ? 'text-slate-600' : 'text-slate-800 font-semibold'}`}>
          {n.message}
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5 font-sans">
          {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ──────────────────────────────────────── */
export default function Dashboard() {
  const { user } = useAuth();
  const { socket, connected } = useSocket();
  const [profile, setProfile]             = useState(null);
  const [enrollments, setEnrollments]     = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [liveEvents, setLiveEvents]       = useState([]);

  // Fetch all data in parallel
  useEffect(() => {
    const load = async () => {
      try {
        const [profRes, enrollRes, notifRes] = await Promise.all([
          api.get('/profile'),
          api.get('/enrollments'),
          api.get('/notifications'),
        ]);
        setProfile(profRes.data);
        setEnrollments(Array.isArray(enrollRes.data) ? enrollRes.data : []);
        setNotifications(Array.isArray(notifRes.data?.notifications ?? notifRes.data) ? (notifRes.data?.notifications ?? notifRes.data) : []);
      } catch (err) {
        toast.error(err?.response?.data?.message ?? 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Socket — live enrollment / activity feed
  useEffect(() => {
    if (!socket) return;
    const handler = (data) => {
      setLiveEvents(prev => [data, ...prev].slice(0, 5));
    };
    socket.on('activity:new', handler);
    return () => {
      socket.off('activity:new', handler);
    };
  }, [socket]);

  // Keep enrollment stat cards live when a new enrollment is confirmed
  useEffect(() => {
    const handler = (e) => {
      const entry = e.detail;
      setEnrollments(prev => {
        const id = String(entry.certId || entry.course?._id || entry.course?.id || '');
        const exists = prev.some(p => String(p.certId || p.course?._id || p.course?.id || '') === id);
        if (exists) return prev;
        return [entry, ...prev];
      });
    };
    window.addEventListener('lf:enrollment:new', handler);
    return () => window.removeEventListener('lf:enrollment:new', handler);
  }, []);

  const completed   = enrollments.filter(e => (e.progress ?? 0) === 100).length;
  const inProgress  = enrollments.filter(e => (e.progress ?? 0) > 0 && (e.progress ?? 0) < 100).length;
  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-sans">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  const displayName = profile?.name ?? user?.name ?? 'Learner';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-900 px-6 py-10">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-2xl font-black text-white border-2 border-white/20 shadow-lg">
            {displayName[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-cyan-300 text-sm font-sans">Welcome back,</p>
            <h1 className="text-2xl font-black text-white">{displayName}</h1>
            <p className="text-slate-400 text-xs font-sans">{profile?.email ?? user?.email}</p>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border bg-white/5 border-white/10 text-white/70">
            {connected ? <Wifi size={11} className="text-emerald-400"/> : <WifiOff size={11} className="text-slate-500"/>}
            {connected ? 'Live' : 'Offline'}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={BookOpen}   label="Enrolled"   value={enrollments.length} color="text-cyan-600"   bg="bg-cyan-50 border border-cyan-100" />
          <StatCard icon={Award}      label="Completed"  value={completed}           color="text-emerald-600" bg="bg-emerald-50 border border-emerald-100" />
          <StatCard icon={TrendingUp} label="In Progress" value={inProgress}         color="text-violet-600" bg="bg-violet-50 border border-violet-100" />
          <StatCard icon={Bell}       label="Unread"     value={unreadCount}         color="text-amber-600"  bg="bg-amber-50 border border-amber-100" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Continue Learning */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900">Continue Learning</h2>
              <Link to="/my-courses" className="flex items-center gap-1 text-sm text-cyan-600 hover:text-cyan-700 font-semibold font-sans transition-colors">
                View all <ChevronRight size={14} />
              </Link>
            </div>
            {enrollments.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
                <div className="text-5xl mb-3">🎯</div>
                <p className="font-black text-slate-800 text-lg">No courses yet</p>
                <p className="text-slate-500 text-sm font-sans mt-1 mb-5">Start your learning journey today</p>
                <Link to="/courses" className="inline-flex items-center gap-2 bg-cyan-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-cyan-700 transition-colors shadow-sm">
                  <Play size={14} /> Browse Courses
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {enrollments.slice(0, 4).map(e => (
                  <EnrollmentCard key={e._id} enrollment={e} />
                ))}
              </div>
            )}

            {/* Live socket feed */}
            {liveEvents.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Flame size={16} className="text-orange-500" />
                  <h3 className="font-black text-slate-900 text-sm">Live Activity</h3>
                  <span className="ml-auto flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <Wifi size={8} /> Live
                  </span>
                </div>
                <div className="space-y-2">
                  {liveEvents.map((ev, i) => (
                    <p key={i} className="text-xs text-slate-600 font-sans py-1 border-b border-slate-50 last:border-0">
                      {ev.message ?? JSON.stringify(ev)}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900">Notifications</h2>
              {unreadCount > 0 && (
                <span className="bg-cyan-100 border border-cyan-200 text-cyan-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm max-h-[440px] overflow-y-auto space-y-2">
              {notifications.length === 0 ? (
                <div className="py-10 text-center">
                  <Bell size={28} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-slate-400 text-sm font-sans">No notifications yet</p>
                </div>
              ) : (
                notifications.map(n => <NotificationItem key={n._id} n={n} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
