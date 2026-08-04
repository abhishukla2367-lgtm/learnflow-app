import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Users, ClipboardList,
  BarChart2, GraduationCap, LogOut, X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { id: "dashboard",   label: "Dashboard",        icon: LayoutDashboard },
  { id: "courses",     label: "Courses",           icon: BookOpen        },
  { id: "users",       label: "Students & Users",  icon: Users           },
  { id: "enrollments", label: "Enrollments",       icon: ClipboardList   },
  { id: "instructors", label: "Instructors",       icon: GraduationCap   },
  { id: "reports",     label: "Reports",           icon: BarChart2       },
];

const DELAY_CLASSES = [
  "delay-0","delay-[60ms]","delay-[120ms]",
  "delay-[180ms]","delay-[240ms]","delay-[300ms]",
];

/* ── Logo mark (same real SVG used in the Footer, so it can react to hover) ── */
function LearnodaysLogo({ className = "w-full h-full" }) {
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Learnodays">
      <rect x="6" y="6" width="188" height="188" rx="44" fill="#0b0b0d" />
      <path
        d="M46,48 L52,48 L52,134 L90,134 L90,152 L34,152 L34,70 Z"
        fill="#ffffff"
        className="transition-colors duration-300 group-hover:fill-cyan-400"
      />
      <path
        d="M104 48 L134 48 C 158 48 172 68 172 100 C172 132 158 152 134 152 L104 152 Z M118 62 L132 62 C 148 62 158 76 158 100 C158 124 148 138 132 138 L118 138 Z"
        fillRule="evenodd"
        fill="#ffffff"
      />
    </svg>
  );
}

function NavContent({ active, onChange, onClose }) {
  const navigate   = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => { navigate("/", { replace: true }); logout(); };

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0">
            <LearnodaysLogo />
          </div>
          <div>
            <h1 className="font-black text-sm tracking-tight text-slate-900">Learnodays</h1>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-600">Admin Console</p>
          </div>
        </div>
        {/* Close button — mobile only */}
        {onClose && (
          <button onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, icon: Icon }, i) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => { onChange(id); onClose?.(); }}
              aria-current={isActive ? "page" : undefined}
              className={`
                animate-sidebar-in ${DELAY_CLASSES[i]}
                relative w-full flex items-center gap-3 px-4 py-2.5 rounded-xl
                font-semibold text-sm transition-all duration-150
                ${isActive
                  ? "bg-cyan-50 text-cyan-700 border border-cyan-200"
                  : "text-slate-500 border border-transparent hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[55%] bg-cyan-500 rounded-r-full" />
              )}
              <Icon size={16} strokeWidth={isActive ? 2.5 : 2} className="flex-shrink-0" />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl font-semibold text-sm
            text-slate-400 border border-transparent transition-all duration-150
            hover:bg-red-50 hover:text-red-500 hover:border-red-100"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ active, onChange, mobileOpen, onMobileClose }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="w-64 hidden lg:flex flex-col h-screen sticky top-0
          bg-white border-r border-slate-200 animate-sidebar-in"
        aria-label="Admin navigation"
      >
        <NavContent active={active} onChange={onChange} />
      </aside>

      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200
          flex flex-col lg:hidden transition-transform duration-300 ease-in-out shadow-xl
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Mobile admin navigation"
      >
        <NavContent active={active} onChange={onChange} onClose={onMobileClose} />
      </aside>
    </>
  );
}