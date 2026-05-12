import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, BellOff, CheckCheck, Trash2, BookOpen, Star,
  Award, Trophy, Megaphone, TrendingUp, CreditCard,
  MessageSquare, Loader2, Filter, RefreshCw, Check
} from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { formatDistanceToNow } from '../utils/timeUtils';

/* ── Type meta ──────────────────────────────────────────── */
const TYPE_META = {
  enrollment:      { icon: BookOpen,      bg: 'bg-indigo-100',  color: 'text-indigo-600',  label: 'Enrollment'   },
  review:          { icon: Star,          bg: 'bg-amber-100',   color: 'text-amber-600',   label: 'Review'       },
  course_published:{ icon: Award,         bg: 'bg-emerald-100', color: 'text-emerald-600', label: 'Published'    },
  quiz_passed:     { icon: Trophy,        bg: 'bg-yellow-100',  color: 'text-yellow-600',  label: 'Quiz'         },
  certificate:     { icon: Award,         bg: 'bg-cyan-100',    color: 'text-cyan-600',    label: 'Certificate'  },
  announcement:    { icon: Megaphone,     bg: 'bg-rose-100',    color: 'text-rose-600',    label: 'Announcement' },
  progress:        { icon: TrendingUp,    bg: 'bg-violet-100',  color: 'text-violet-600',  label: 'Progress'     },
  payment:         { icon: CreditCard,    bg: 'bg-green-100',   color: 'text-green-600',   label: 'Payment'      },
  message:         { icon: MessageSquare, bg: 'bg-sky-100',     color: 'text-sky-600',     label: 'Message'      },
};

function getMeta(type) {
  return TYPE_META[type] || { icon: Bell, bg: 'bg-slate-100', color: 'text-slate-600', label: 'General' };
}

/* ── Filter tabs ─────────────────────────────────────────── */
const FILTERS = [
  { key: 'all',    label: 'All'         },
  { key: 'unread', label: 'Unread'      },
  { key: 'enrollment', label: 'Courses' },
  { key: 'certificate', label: 'Certificates' },
  { key: 'payment',    label: 'Payments'     },
  { key: 'announcement', label: 'Announcements' },
];

/* ── Group notifications by date ─────────────────────────── */
function groupByDate(list) {
  const today     = new Date(); today.setHours(0,0,0,0);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const groups    = {};

  list.forEach(n => {
    const d = new Date(n.createdAt);
    d.setHours(0,0,0,0);
    let label;
    if (d.getTime() === today.getTime())         label = 'Today';
    else if (d.getTime() === yesterday.getTime()) label = 'Yesterday';
    else label = d.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });
    if (!groups[label]) groups[label] = [];
    groups[label].push(n);
  });

  return Object.entries(groups);
}

/* ── Single notification card ───────────────────────────── */
function NotifCard({ notif, onRead, onDelete }) {
  const navigate = useNavigate();
  const meta = getMeta(notif.type);
  const Icon = meta.icon;

  const handleClick = () => {
    if (!notif.isRead) onRead(notif._id);
    if (notif.link) navigate(notif.link);
  };

  return (
    <div
      className={`group relative flex items-start gap-4 p-5 rounded-2xl border transition-all duration-200 cursor-pointer
        ${!notif.isRead
          ? 'bg-indigo-50/60 border-indigo-100 hover:border-indigo-200 hover:bg-indigo-50'
          : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/60'
        }`}
      onClick={handleClick}
    >
      {/* Unread indicator */}
      {!notif.isRead && (
        <span className="absolute top-5 right-5 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
      )}

      {/* Icon */}
      <div className={`flex-shrink-0 w-11 h-11 rounded-2xl ${meta.bg} ${meta.color} flex items-center justify-center shadow-sm`}>
        <Icon size={20} />
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0 pr-8">
        {/* Sender avatar + name (if present) */}
        {notif.sender && (
          <div className="flex items-center gap-1.5 mb-1">
            {notif.sender.avatar ? (
              <img src={notif.sender.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
            ) : null}
            <span className="text-xs font-semibold text-slate-400">
              {notif.sender.name}
            </span>
            <span className="text-xs text-slate-300">·</span>
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${meta.bg} ${meta.color}`}>
              {meta.label}
            </span>
          </div>
        )}

        <h3 className={`text-sm font-bold leading-snug ${notif.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
          {notif.title}
        </h3>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          {notif.message}
        </p>
        <p className="text-xs text-slate-400 mt-2 font-medium">
          {formatDistanceToNow(notif.createdAt)}
        </p>
      </div>

      {/* Actions (visible on hover) */}
      <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!notif.isRead && (
          <button
            onClick={(e) => { e.stopPropagation(); onRead(notif._id); }}
            title="Mark as read"
            className="p-1.5 rounded-lg hover:bg-indigo-100 text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <Check size={13} />
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(notif._id); }}
          title="Delete"
          className="p-1.5 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-500 transition-colors"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────────── */
export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const {
    notifications, unreadCount, loading,
    hasMore, markRead, markAllRead, remove, loadMore, refresh,
  } = useNotifications();

  /* Client-side filter */
  const filtered = notifications.filter(n => {
    if (activeFilter === 'all')    return true;
    if (activeFilter === 'unread') return !n.isRead;
    return n.type === activeFilter;
  });

  const groups = groupByDate(filtered);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* ── Page Header ── */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Notifications</h1>
            <p className="text-sm text-slate-400 mt-1 font-medium">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                : 'You're all caught up'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              disabled={loading}
              className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-400
                hover:text-slate-700 hover:border-slate-300 transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-bold
                  rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <CheckCheck size={15} /> Mark all read
              </button>
            )}
          </div>
        </div>

        {/* ── Filter Tabs ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all duration-150
                ${activeFilter === f.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700'
                }`}
            >
              {f.label}
              {f.key === 'unread' && unreadCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-white/20 text-[10px] font-black rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        {loading && notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={28} className="animate-spin text-indigo-400" />
            <p className="text-sm text-slate-400 font-medium">Loading notifications…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center">
              <BellOff size={28} className="text-slate-300" />
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-slate-700">No notifications here</p>
              <p className="text-sm text-slate-400 mt-1">
                {activeFilter !== 'all'
                  ? 'Try switching to "All" to see everything'
                  : 'We\'ll notify you about your courses and activity'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {groups.map(([dateLabel, items]) => (
              <div key={dateLabel}>
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 px-1">
                  {dateLabel}
                </h2>
                <div className="space-y-2">
                  {items.map(notif => (
                    <NotifCard
                      key={notif._id}
                      notif={notif}
                      onRead={markRead}
                      onDelete={remove}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Load more */}
            {hasMore && activeFilter === 'all' && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200
                    text-sm font-bold text-slate-600 rounded-xl hover:border-slate-300 hover:text-slate-900
                    transition-colors disabled:opacity-50"
                >
                  {loading
                    ? <><Loader2 size={14} className="animate-spin" /> Loading…</>
                    : 'Load more'
                  }
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}