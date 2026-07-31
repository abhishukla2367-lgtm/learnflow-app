
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

function NavContent({ active, onChange, onClose }) {
  const navigate   = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => { navigate("/", { replace: true }); logout(); };

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-black
          flex items-center justify-center shadow-lg shadow-black/25 overflow-hidden">
            <img src="https://res.cloudinary.com/db2vju4mv/image/upload/q_auto/f_auto/v1775046563/p1_l90afj.webp" className="w-9 h-9 object-contain" />
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
