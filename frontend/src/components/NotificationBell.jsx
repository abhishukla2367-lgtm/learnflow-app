import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell, BellOff, Check, CheckCheck, Trash2, X,
  BookOpen, Star, Award, Trophy, Megaphone, TrendingUp,
  CreditCard, MessageSquare, ChevronRight, Loader2
} from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { formatDistanceToNow } from '../utils/timeUtils';

/* ── Icon + color per notification type ─────────────────── */
const TYPE_META = {
  enrollment:      { icon: BookOpen,      bg: 'bg-indigo-100',  color: 'text-indigo-600',  label: 'Enrolled'    },
  review:          { icon: Star,          bg: 'bg-amber-100',   color: 'text-amber-600',   label: 'Review'      },
  course_published:{ icon: Award,         bg: 'bg-emerald-100', color: 'text-emerald-600', label: 'Published'   },
  quiz_passed:     { icon: Trophy,        bg: 'bg-yellow-100',  color: 'text-yellow-600',  label: 'Quiz'        },
  certificate:     { icon: Award,         bg: 'bg-cyan-100',    color: 'text-cyan-600',    label: 'Certificate' },
  announcement:    { icon: Megaphone,     bg: 'bg-rose-100',    color: 'text-rose-600',    label: 'Announcement'},
  progress:        { icon: TrendingUp,    bg: 'bg-violet-100',  color: 'text-violet-600',  label: 'Progress'    },
  payment:         { icon: CreditCard,    bg: 'bg-green-100',   color: 'text-green-600',   label: 'Payment'     },
  message:         { icon: MessageSquare, bg: 'bg-sky-100',     color: 'text-sky-600',     label: 'Message'     },
};

function getMeta(type) {
  return TYPE_META[type] || { icon: Bell, bg: 'bg-slate-100', color: 'text-slate-600', label: 'Notification' };
}

/* ── Single notification row ────────────────────────────── */
function NotifRow({ notif, onRead, onDelete, onClose }) {
  const navigate = useNavigate();
  const meta = getMeta(notif.type);
  const Icon = meta.icon;

  const handleClick = () => {
    if (!notif.isRead) onRead(notif._id);
    if (notif.link) {
      onClose();
      navigate(notif.link);
    }
  };

  return (
    <div
      className={`group relative flex items-start gap-3 px-4 py-3.5 transition-all duration-150 cursor-pointer hover:bg-slate-50
        ${!notif.isRead ? 'bg-indigo-50/40' : ''}`}
      onClick={handleClick}
    >
      {/* Unread dot */}
      {!notif.isRead && (
        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500" />
      )}

      {/* Icon */}
      <div className={`flex-shrink-0 w-9 h-9 rounded-xl ${meta.bg} ${meta.color} flex items-center justify-center mt-0.5`}>
        <Icon size={16} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-snug ${notif.isRead ? 'text-slate-600' : 'text-slate-900 font-semibold'}`}>
          {notif.title}
        </p>
        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">{notif.message}</p>
        <p className="text-[11px] text-slate-400 mt-1 font-medium">
          {formatDistanceToNow(notif.createdAt)}
        </p>
      </div>

      {/* Delete button (visible on hover) */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(notif._id); }}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-rose-50 hover:text-rose-500 text-slate-300 mt-0.5"
        title="Delete"
      >
        <X size={13} />
      </button>
    </div>
  );
}

/* ── Main Bell Component ─────────────────────────────────── */
export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const panelRef        = useRef(null);
  const btnRef          = useRef(null);

  const {
    notifications, unreadCount, loading,
    hasMore, markRead, markAllRead, remove, loadMore,
  } = useNotifications();

  /* Close on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        btnRef.current   && !btnRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  return (
    <div className="relative">
      {/* ── Bell Button ── */}
      <button
        ref={btnRef}
        onClick={() => setOpen(v => !v)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        className={`relative p-2.5 rounded-xl transition-all duration-200
          ${open
            ? 'bg-indigo-50 text-indigo-600'
            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
      >
        <Bell size={20} className={unreadCount > 0 ? 'animate-[wiggle_0.5s_ease-in-out]' : ''} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center
            bg-indigo-600 text-white text-[10px] font-black rounded-full shadow-sm
            animate-in fade-in zoom-in duration-200">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* ── Dropdown Panel ── */}
      <div
        ref={panelRef}
        className={`absolute right-0 top-full mt-3 w-[380px] max-w-[calc(100vw-32px)]
          bg-white rounded-2xl shadow-[0_8px_48px_rgba(0,0,0,0.14)] border border-slate-200
          z-[200] transition-all duration-200 origin-top-right overflow-hidden
          ${open
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-slate-900 tracking-tight">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                title="Mark all as read"
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-500
                  hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <CheckCheck size={13} /> All read
              </button>
            )}
            <Link
              to="/notifications"
              onClick={close}
              className="px-2.5 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              See all
            </Link>
          </div>
        </div>

        {/* List */}
        <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-100/80 scrollbar-thin">
          {loading && notifications.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={22} className="animate-spin text-indigo-400" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                <BellOff size={22} className="text-slate-300" />
              </div>
              <p className="text-sm text-slate-400 font-medium">No notifications yet</p>
            </div>
          ) : (
            <>
              {notifications.slice(0, 8).map(notif => (
                <NotifRow
                  key={notif._id}
                  notif={notif}
                  onRead={markRead}
                  onDelete={remove}
                  onClose={close}
                />
              ))}
              {notifications.length > 8 && (
                <Link
                  to="/notifications"
                  onClick={close}
                  className="flex items-center justify-center gap-2 py-3 text-xs font-bold text-indigo-600
                    hover:bg-indigo-50 transition-colors w-full"
                >
                  View all {notifications.length}+ notifications <ChevronRight size={13} />
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}