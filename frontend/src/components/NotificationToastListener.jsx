import { useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Star, Award, Trophy, Megaphone,
  TrendingUp, CreditCard, MessageSquare, Bell
} from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

/* ── Icon per type ──────────────────────────────────────────── */
const TYPE_ICON = {
  enrollment:       BookOpen,
  review:           Star,
  course_published: Award,
  quiz_passed:      Trophy,
  certificate:      Award,
  announcement:     Megaphone,
  progress:         TrendingUp,
  payment:          CreditCard,
  message:          MessageSquare,
};

const TYPE_COLOR = {
  enrollment:       '#4f46e5', // indigo
  review:           '#d97706', // amber
  course_published: '#059669', // emerald
  quiz_passed:      '#ca8a04', // yellow
  certificate:      '#0891b2', // cyan
  announcement:     '#e11d48', // rose
  progress:         '#7c3aed', // violet
  payment:          '#16a34a', // green
  message:          '#0284c7', // sky
};

/* ── Custom toast component ─────────────────────────────────── */
function NotifToast({ notification, onClose, onNavigate }) {
  const Icon  = TYPE_ICON[notification.type] || Bell;
  const color = TYPE_COLOR[notification.type] || '#4f46e5';

  return (
    <div
      className="flex items-start gap-3 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.14)]
        border border-slate-200 p-4 max-w-[340px] cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => {
        if (notification.link) onNavigate(notification.link);
        onClose();
      }}
    >
      {/* Colored icon */}
      <div
        className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}18`, color }}
      >
        <Icon size={16} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-900 leading-snug truncate">
          {notification.title}
        </p>
        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
          {notification.message}
        </p>
      </div>

      {/* Close */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="flex-shrink-0 text-slate-300 hover:text-slate-500 transition-colors mt-0.5"
      >
        ×
      </button>
    </div>
  );
}

/* ── Hook — mount once in App or layout ─────────────────────── */
export function useNotificationToast() {
  const { socket, connected } = useSocket();
  const { user }              = useAuth();
  const navigate              = useNavigate();

  const showToast = useCallback((notification) => {
    toast.custom(
      (t) => (
        <NotifToast
          notification={notification}
          onClose={() => toast.dismiss(t.id)}
          onNavigate={navigate}
        />
      ),
      {
        duration:  5000,
        position:  'top-right',
        id:        notification._id || `notif-${Date.now()}`,
      }
    );
  }, [navigate]);

  useEffect(() => {
    if (!socket || !connected || !user) return;

    socket.on('notification:new', showToast);
    return () => socket.off('notification:new', showToast);
  }, [socket, connected, user, showToast]);
}

/* ── Component version (use either this OR the hook) ─────────── */
export default function NotificationToastListener() {
  useNotificationToast();
  return null; // renders nothing
}