import { useState, useRef, useEffect } from "react";
import Sidebar           from "./Sidebar";
import DashboardOverview from "./DashboardOverview";
import CoursesAdmin      from "./courses/CoursesAdmin";
import UsersAdmin        from "./users/UsersAdmin";
import EnrollmentsAdmin  from "./enrollments/EnrollmentsAdmin";
import InstructorsAdmin  from "./users/InstructorsAdmin";
import ReportsAdmin      from "./reports/ReportsAdmin";
import { useAuth }   from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import toast from "react-hot-toast";
import {
  Clock, Wifi, Zap, Menu, Download,
  RefreshCw, FileText, Loader2,
} from "lucide-react";

/* ── Live Clock ──────────────────────────────────────────── */
function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const h       = now.getHours();
  const mm      = String(now.getMinutes()).padStart(2, "0");
  const ss      = String(now.getSeconds()).padStart(2, "0");
  const period  = h < 12 ? "AM" : "PM";
  const timeStr = `${String(h % 12 || 12).padStart(2, "0")}:${mm}:${ss} ${period}`;
  const dateStr = now.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  return (
    <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200">
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-live-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Live</span>
      </div>
      <div className="w-px h-5 bg-slate-200" />
      <div className="flex items-center gap-2">
        <Clock size={12} className="text-amber-500 flex-shrink-0" />
        <div className="leading-none">
          <p className="text-sm font-black text-slate-800 tabular-nums tracking-tight">{timeStr}</p>
          <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">{dateStr}</p>
        </div>
      </div>
      <div className="w-px h-5 bg-slate-200" />
      <div className="flex items-center gap-1.5">
        <Wifi size={11} className="text-cyan-500" />
        <span className="text-[9px] font-black uppercase tracking-widest text-cyan-600">Online</span>
      </div>
    </div>
  );
}


/* ── Page meta ───────────────────────────────────────────── */
const PAGE_META = {
  dashboard:   { title: "Dashboard Overview",    downloadable: false, pdfable: false },
  courses:     { title: "Course Management",     downloadable: true,  pdfable: true  },
  users:       { title: "Students & Users",      downloadable: true,  pdfable: true  },
  enrollments: { title: "Enrollments",           downloadable: true,  pdfable: true  },
  instructors: { title: "Instructor Management", downloadable: false, pdfable: false },
  reports:     { title: "Reports & Analytics",   downloadable: true,  pdfable: true  },
};

/* ── Activity event label ────────────────────────────────── */
function activityLabel(event) {
  switch (event?.type) {
    case "enrollment:new": return `🎓 ${event.studentName || "A student"} enrolled in ${event.courseName || "a course"}`;
    case "user:new":       return `👤 New user registered: ${event.name || "Someone"}`;
    case "course:published": return `📚 Course published: ${event.title || "New course"}`;
    case "payment:new":    return `💰 Payment received: ₹${event.amount?.toLocaleString("en-IN") || "—"}`;
    default:               return event?.message || "New activity";
  }
}

/* ── Main ────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const [activeTab,  setActiveTab]  = useState("dashboard");
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(false);

  const { user, loading }                             = useAuth();
  const { onlineCount, connected, recentActivity }   = useSocket();
  const mainRef      = useRef(null);
  const downloadRef  = useRef(null);
  const exportPdfRef = useRef(null);
  const prevActivity = useRef(0);

  /* ── Scroll shadow ───────────────────────────────────────── */
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const fn = () => setScrolled(el.scrollTop > 8);
    el.addEventListener("scroll", fn);
    return () => el.removeEventListener("scroll", fn);
  }, []);

  /* ── Reset refs on tab change ────────────────────────────── */
  useEffect(() => {
    downloadRef.current  = null;
    exportPdfRef.current = null;
  }, [activeTab]);

  /* ── Toast new real-time activity events ─────────────────── */
  useEffect(() => {
    if (recentActivity.length > prevActivity.current) {
      const latest = recentActivity[0];
      toast(activityLabel(latest), {
        icon: latest?.type === "payment:new" ? "💰"
            : latest?.type === "enrollment:new" ? "🎓"
            : latest?.type === "user:new" ? "👤" : "📢",
        duration: 5000,
        style: { borderLeft: "4px solid #6366f1" },
      });
      /* Auto-refresh the section that received new data */
      if (
        (latest?.type === "enrollment:new" && activeTab === "enrollments") ||
        (latest?.type === "user:new"       && activeTab === "users") ||
        (latest?.type === "course:published" && activeTab === "courses")
      ) {
        setRefreshKey(k => k + 1);
      }
    }
    prevActivity.current = recentActivity.length;
  }, [recentActivity, activeTab]);

  /* ── Listen for server-triggered refresh hints ───────────── */
  useEffect(() => {
    const handler = (e) => {
      const { section } = e.detail || {};
      if (!section || section === activeTab || section === "all") {
        setRefreshKey(k => k + 1);
      }
    };
    window.addEventListener("lf:refresh", handler);
    return () => window.removeEventListener("lf:refresh", handler);
  }, [activeTab]);

  const handleTabChange = (tab) => { setActiveTab(tab); setMobileOpen(false); };
  const getInitials = (name = "") =>
    name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const renderContent = () => {
    switch (activeTab) {
      case "courses":     return <CoursesAdmin    key={refreshKey} downloadReportRef={downloadRef} exportPdfRef={exportPdfRef} />;
      case "users":       return <UsersAdmin       key={refreshKey} downloadReportRef={downloadRef} exportPdfRef={exportPdfRef} />;
      case "enrollments": return <EnrollmentsAdmin key={refreshKey} downloadReportRef={downloadRef} exportPdfRef={exportPdfRef} />;
      case "instructors": return <InstructorsAdmin key={refreshKey}                                 exportPdfRef={exportPdfRef} />;
      case "reports":     return <ReportsAdmin     key={refreshKey} downloadReportRef={downloadRef} exportPdfRef={exportPdfRef} />;
      default:            return <DashboardOverview key={refreshKey} downloadReportRef={downloadRef} />;
    }
  };

  const meta = PAGE_META[activeTab] ?? PAGE_META.dashboard;

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <div className="w-10 h-10 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen font-sans bg-slate-50 text-slate-900 overflow-hidden">
      <Sidebar active={activeTab} onChange={handleTabChange} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

        {/* ── Header ── */}
        <header className={`flex-shrink-0 h-[68px] px-4 md:px-8 flex items-center justify-between z-30
          bg-white/95 backdrop-blur-xl border-b border-slate-200 transition-shadow duration-300
          ${scrolled ? "shadow-lg shadow-slate-200/80" : ""}`}>

          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
              <Menu size={20} />
            </button>
            <div className="lg:hidden flex items-center gap-2 mr-1">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
                <Zap size={13} className="text-white" />
              </div>
              <span className="font-black text-sm text-slate-900">Learnflow</span>
            </div>
            <LiveClock />
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-2.5 pl-2.5 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-[10px] font-black text-white flex-shrink-0">
                {user ? getInitials(user.name) : "AD"}
              </div>
              <div className="hidden lg:block leading-none">
                <p className="text-xs font-bold text-slate-800">{user?.name || "Admin"}</p>
                <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">{user?.role || "Admin"}</p>
              </div>
            </div>
          </div>
        </header>

        {/* ── Scrollable main ── */}
        <main ref={mainRef} className="flex-1 px-4 py-6 md:px-8 md:py-8 overflow-y-auto bg-slate-50">
          <div className="mb-7">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-cyan-600">
              <span className="w-4 h-[2px] bg-cyan-500 rounded-full inline-block" />
              Admin Console
            </div>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">{meta.title}</h1>
              {activeTab !== "dashboard" && (
                <div className="flex items-center gap-2">
                  <button onClick={() => setRefreshKey(k => k + 1)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-white border border-slate-200 text-slate-600 hover:border-cyan-400 hover:text-cyan-600 hover:bg-cyan-50 transition-all active:scale-95 shadow-sm">
                    <RefreshCw size={15} /> Refresh
                  </button>
                  {meta.pdfable && (
                    <button disabled={pdfLoading}
                      onClick={async () => {
                        if (typeof exportPdfRef.current !== "function") return;
                        setPdfLoading(true);
                        try { await exportPdfRef.current(); }
                        catch (e) { console.error("PDF export failed", e); }
                        finally { setPdfLoading(false); }
                      }}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-white border border-slate-200 text-slate-600 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 transition-all active:scale-95 shadow-sm ${pdfLoading ? "opacity-60 cursor-not-allowed pointer-events-none" : ""}`}>
                      {pdfLoading ? <><Loader2 size={15} className="animate-spin" /> Generating…</> : <><FileText size={15} /> Export PDF</>}
                    </button>
                  )}
                  {meta.downloadable && (
                    <button onClick={() => { if (typeof downloadRef.current === "function") downloadRef.current(); }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-white border border-slate-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all active:scale-95 shadow-sm">
                      <Download size={15} /> Download Report
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="animate-fade-up">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}