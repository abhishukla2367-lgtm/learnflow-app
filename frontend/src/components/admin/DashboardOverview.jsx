import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp, Users, BookOpen, IndianRupee, Award,
  GraduationCap, ArrowUpRight, ArrowDownRight,
  Star, Clock, Zap, Activity, RefreshCw, ChevronRight,
} from "lucide-react";
import { fetchDashboard } from "../../api/adminApi";
import { useSocket } from "../../context/SocketContext";
import ErrorState from "./shared/ErrorState";
import SkeletonCard from "./shared/SkeletonCard";

/* ── Animated counter ─────────────────────────────────────── */
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target == null || target === 0) { setCount(0); return; }
    let s = 0;
    const steps = 50, inc = target / steps, iv = duration / steps;
    const t = setInterval(() => {
      s += inc;
      if (s >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(s));
    }, iv);
    return () => clearInterval(t);
  }, [target, duration]);
  return count;
}

/* ── Time ago ─────────────────────────────────────────────── */
function timeAgo(date) {
  if (!date) return "—";
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

/* ── Stat Card ─────────────────────────────────────────────── */
const CARD_ANIMS = [
  "animate-count-up","animate-count-up-d1","animate-count-up-d2",
  "animate-count-up-d3","animate-count-up-d4","animate-count-up-d5",
];

function StatCard({ icon: Icon, label, value, prefix = "", suffix = "", change, changeLabel, accentBg, accentIcon, accentBorder, index = 0 }) {
  const animated = useCountUp(typeof value === "number" ? value : 0);
  const isUp = change >= 0;
  return (
    <div className={`${CARD_ANIMS[index]} bg-white border border-slate-200 rounded-2xl p-5
      hover:border-slate-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-default`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accentBg} ${accentBorder} border`}>
          <Icon size={17} className={accentIcon} />
        </div>
        {change !== undefined && change !== 100 && change !== null && (
          <span className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full border
            ${isUp ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-rose-50 text-rose-500 border-rose-200"}`}>
            {isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-black text-slate-900 tabular-nums tracking-tight">
        {prefix}{typeof value === "number" ? animated.toLocaleString("en-IN") : (value ?? "—")}{suffix}
      </p>
      {changeLabel && <p className="text-[10px] text-slate-400 mt-1 font-medium">{changeLabel}</p>}
    </div>
  );
}


/* ── Top Course Card ───────────────────────────────────────── */
function CourseCard({ course, index, onClick }) {
  const GRADIENTS = [
    "from-indigo-500 to-violet-600","from-cyan-500 to-blue-600",
    "from-emerald-500 to-teal-600","from-amber-500 to-orange-600","from-rose-500 to-pink-600",
  ];
  const grad = GRADIENTS[index % GRADIENTS.length];
  return (
    <div onClick={onClick}
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300 group cursor-pointer active:scale-[0.98]">
      <div className={`h-28 bg-gradient-to-br ${grad} relative overflow-hidden`}>
        {course.thumbnail
          ? <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full flex items-center justify-center opacity-30"><BookOpen size={32} className="text-white" /></div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-3">
          <span className="text-[10px] font-black text-white/90 uppercase tracking-wider">#{index + 1} Top Course</span>
        </div>
      </div>
      <div className="p-4">
        <p className="font-black text-slate-900 text-sm line-clamp-1 mb-1 group-hover:text-indigo-600 transition-colors">{course.title}</p>
        <p className="text-xs text-slate-400 mb-4 truncate">{course.instructor}</p>
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
          <div className="text-center">
            <p className="text-sm font-black text-slate-900">{course.enrollments?.toLocaleString("en-IN")}</p>
            <p className="text-[9px] text-slate-400 uppercase tracking-wide mt-0.5">Students</p>
          </div>
          <div className="text-center border-x border-slate-100">
            <p className="text-sm font-black text-emerald-600">
              ₹{course.revenue >= 1000 ? `${(course.revenue / 1000).toFixed(0)}k` : course.revenue}
            </p>
            <p className="text-[9px] text-slate-400 uppercase tracking-wide mt-0.5">Revenue</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-0.5">
              <Star size={10} className="fill-amber-400 text-amber-400" />
              <p className="text-sm font-black text-slate-900">{course.rating?.toFixed(1)}</p>
            </div>
            <p className="text-[9px] text-slate-400 uppercase tracking-wide mt-0.5">Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Enrollment Card ───────────────────────────────────────── */
function EnrollmentCard({ enrollment, isNew }) {
  const GRADIENTS = [
    "from-cyan-400 to-blue-500","from-violet-400 to-purple-500",
    "from-rose-400 to-pink-500","from-amber-400 to-orange-500","from-emerald-400 to-teal-500",
  ];
  const gradIdx  = enrollment.studentName?.charCodeAt(0) % GRADIENTS.length || 0;
  const gradient = GRADIENTS[gradIdx];
  return (
    <div className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-500 group cursor-default
      ${isNew ? "bg-indigo-50 border-indigo-200 animate-fade-in" : "bg-slate-50 border-transparent hover:bg-indigo-50 hover:border-indigo-100"}`}>
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-sm font-black text-white flex-shrink-0 shadow-sm`}>
        {enrollment.studentName?.[0]?.toUpperCase() ?? "?"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-700 transition-colors">{enrollment.studentName}</p>
        <p className="text-[10px] text-slate-400 truncate">{enrollment.courseTitle}</p>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        {isNew && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />}
        <Clock size={10} className="text-slate-300" />
        <span className="text-[10px] text-slate-400 font-medium">
          {enrollment.timeAgo || timeAgo(enrollment.createdAt)}
        </span>
      </div>
    </div>
  );
}

/* ── Mock fallback ─────────────────────────────────────────── */
const MOCK_DATA = {
  stats: {
    totalRevenue: 1380000, revenueChange: 22,
    activeStudents: 50124, studentChange: 12,
    publishedCourses: 48,  coursesThisMonth: 4,
    enrollmentsToday: 3241, enrollmentChange: 18,
    totalInstructors: 24,  avgCompletion: 68,
  },
  topCourses: [
    { _id:"1", title:"Full-Stack Bootcamp",          instructor:"Rahul Sharma",  enrollments:1240, revenue:3717600, rating:4.8, thumbnail:"https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400" },
    { _id:"2", title:"Machine Learning with Python", instructor:"Dr. Priya Nair",enrollments:980,  revenue:3429020, rating:4.9, thumbnail:"https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400" },
    { _id:"3", title:"React & Next.js Advanced",     instructor:"Sneha Kapoor", enrollments:887,  revenue:2479130, rating:4.9, thumbnail:"https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400" },
    { _id:"4", title:"UI/UX Design Masterclass",     instructor:"Sneha Kapoor", enrollments:756,  revenue:1510244, rating:4.7, thumbnail:"https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400" },
    { _id:"5", title:"AWS & DevOps Fundamentals",    instructor:"Vikram Mehta", enrollments:542,  revenue:2167458, rating:4.6, thumbnail:"https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400" },
  ],
  recentEnrollments: [
    { _id:"e1", studentName:"Arjun Patel",  courseTitle:"Full-Stack Bootcamp",     timeAgo:"2m ago"  },
    { _id:"e2", studentName:"Kavya Reddy",  courseTitle:"Machine Learning",         timeAgo:"8m ago"  },
    { _id:"e3", studentName:"Rohan Singh",  courseTitle:"UI/UX Design",             timeAgo:"15m ago" },
    { _id:"e4", studentName:"Meera Joshi",  courseTitle:"AWS & DevOps",             timeAgo:"32m ago" },
    { _id:"e5", studentName:"Aditya Kumar", courseTitle:"React & Next.js Advanced", timeAgo:"1h ago"  },
    { _id:"e6", studentName:"Prachi Verma", courseTitle:"Python for Beginners",     timeAgo:"2h ago"  },
  ],
};

/* ── Main ──────────────────────────────────────────────────── */
export default function DashboardOverview({ downloadReportRef }) {
  const [data,       setData]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated,setLastUpdated]= useState(null);
  const [newEnrolls, setNewEnrolls] = useState([]);
  const [, setTick] = useState(0);
  const navigate  = useNavigate();
  const { socket, liveStats } = useSocket();

  // Re-render every second so "Updated X ago" counts up live
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else { setError(false); setLoading(true); }
    try {
      const { data: res } = await fetchDashboard();
      setData(res);
    } catch (err) {
      console.warn("Dashboard API unavailable, using mock data:", err?.message);
      setData(MOCK_DATA);
    } finally {
      setLastUpdated(new Date());
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
    const handleRefresh = (e) => {
      const { section } = e.detail || {};
      if (!section || section === "all" || section === "enrollments" || section === "courses" || section === "users") {
        load();
      }
    };
    window.addEventListener("lf:refresh", handleRefresh);
    return () => window.removeEventListener("lf:refresh", handleRefresh);
  }, [load]);

  // ── Merge live stat pushes from socket server ──────────────
  useEffect(() => {
    if (!liveStats) return;
    setData(prev => prev ? {
      ...prev,
      stats: {
        ...prev.stats,
        ...liveStats,
        enrollmentsToday: liveStats.totalEnrollments ?? prev.stats?.enrollmentsToday,
      },
      // Update top courses if backend pushes fresh ranking
      topCourses: liveStats.topCourses ?? prev.topCourses,
    } : prev);
    setLastUpdated(new Date());
  }, [liveStats]);

  // ── Wire ExcelJS export for top courses ──
  useEffect(() => {
    if (downloadReportRef) {
      downloadReportRef.current = async () => {
        const ExcelJS   = (await import("exceljs")).default;
        const wb        = new ExcelJS.Workbook();
        wb.creator      = "LearnFlow Admin";
        const ws        = wb.addWorksheet("Top Courses");
        const courses   = data?.topCourses ?? [];

        ws.columns = [
          { header: "Rank",        key: "rank",      width: 8  },
          { header: "Course",      key: "course",    width: 40 },
          { header: "Instructor",  key: "instructor",width: 22 },
          { header: "Students",    key: "students",  width: 12 },
          { header: "Revenue (₹)", key: "revenue",   width: 16 },
          { header: "Rating",      key: "rating",    width: 10 },
        ];

        courses.forEach((c, i) => ws.addRow({
          rank: i + 1, course: c.title, instructor: c.instructor,
          students: c.enrollments, revenue: c.revenue,
          rating: c.rating?.toFixed(1),
        }));

        ws.getRow(1).eachCell(cell => {
          cell.font      = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
          cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FF6366F1" } };
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.border    = { top:{ style:"thin" }, left:{ style:"thin" }, bottom:{ style:"thin" }, right:{ style:"thin" } };
        });
        ws.getRow(1).height = 22;
        for (let i = 2; i <= courses.length + 1; i++) {
          ws.getRow(i).eachCell(cell => {
            cell.border    = { top:{ style:"thin" }, left:{ style:"thin" }, bottom:{ style:"thin" }, right:{ style:"thin" } };
            cell.alignment = { vertical: "middle" };
            if (i % 2 === 0) cell.fill = { type:"pattern", pattern:"solid", fgColor:{ argb:"FFF8FAFF" } };
          });
        }
        ws.getColumn("revenue").numFmt = "₹#,##0";

        const buffer = await wb.xlsx.writeBuffer();
        const blob   = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url    = URL.createObjectURL(blob);
        const a      = document.createElement("a");
        a.href = url; a.download = `learnflow_dashboard_${new Date().toISOString().slice(0,10)}.xlsx`;
        a.click(); URL.revokeObjectURL(url);
      };
    }
  });

  // ── Socket.IO realtime new enrollment ──
  useEffect(() => {
    if (!socket) return;
    const handler = (enrollment) => {
      setNewEnrolls(prev => [{ ...enrollment, _id: Date.now(), timeAgo: "Just now" }, ...prev].slice(0, 6));
      setData(prev => prev ? {
        ...prev,
        stats: { ...prev.stats, enrollmentsToday: (prev.stats?.enrollmentsToday || 0) + 1 },
      } : prev);
      // Re-fetch to get updated top courses ranking
      load();
    };
    socket.on("enrollment:new", handler);
    return () => socket.off("enrollment:new", handler);
  }, [socket, load]);

  // ── Socket.IO courses updated (ranking change, new course, etc.) ──
  useEffect(() => {
    if (!socket) return;
    socket.on("courses:updated", () => load());
    return () => socket.off("courses:updated");
  }, [socket, load]);

  if (error) return <ErrorState onRetry={() => load()} />;

  const s = data?.stats ?? {};

  const STAT_CARDS = [
    { icon: IndianRupee,   label: "Total Revenue",  value: s.totalRevenue,    prefix: "₹", change: s.revenueChange,    changeLabel: "vs last month", accentBg: "bg-emerald-50", accentIcon: "text-emerald-600", accentBorder: "border-emerald-200" },
    { icon: Users,         label: "Total Students", value: s.activeStudents,              change: s.studentChange,    changeLabel: "vs last month", accentBg: "bg-cyan-50",    accentIcon: "text-cyan-600",    accentBorder: "border-cyan-200"    },
    { icon: BookOpen,      label: "Total Courses",   value: s.publishedCourses,           changeLabel: s.coursesThisMonth ? `+${s.coursesThisMonth} this month` : undefined,     accentBg: "bg-violet-50",  accentIcon: "text-violet-600",  accentBorder: "border-violet-200"  },
    { icon: TrendingUp, label: "Active Enrollments", value: liveStats?.totalEnrollments ?? s.enrollmentsToday, changeLabel: "vs last month", accentBg: "bg-amber-50",   accentIcon: "text-amber-600",   accentBorder: "border-amber-200"   },
    { icon: GraduationCap, label: "Instructors",    value: s.totalInstructors,            accentBg: "bg-indigo-50",  accentIcon: "text-indigo-600", accentBorder: "border-indigo-200" },
    { icon: Award,         label: "Avg Completion", value: s.avgCompletion,   suffix: "%", accentBg: "bg-rose-50",    accentIcon: "text-rose-500",   accentBorder: "border-rose-200"   },
  ];

  const allEnrollments = [...newEnrolls, ...(data?.recentEnrollments ?? [])].slice(0, 6);

  return (
    <div className="space-y-8">

      {/* Platform Overview header with Refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-indigo-500" />
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Platform Overview</h2>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <p className="text-xs text-slate-400 font-semibold hidden sm:block">
              Updated {timeAgo(lastUpdated)}
            </p>
          )}
          <button onClick={() => load(true)} disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold
              text-slate-600 bg-white hover:border-cyan-400 hover:text-cyan-600 hover:bg-cyan-50
              transition-all active:scale-95 disabled:opacity-50 shadow-sm">
            <RefreshCw size={15} className={refreshing ? "animate-spin text-cyan-500" : ""} />
            <span className="hidden sm:inline">{refreshing ? "Refreshing…" : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : STAT_CARDS.map((card, i) => <StatCard key={card.label} {...card} index={i} />)
        }
      </div>

      {/* Top Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-amber-500" fill="currentColor" />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Top Performing Courses</h2>
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-28 bg-slate-100" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-slate-100 rounded-lg w-3/4" />
                  <div className="h-3 bg-slate-100 rounded-lg w-1/2" />
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
                    {[1,2,3].map(j => <div key={j} className="h-8 bg-slate-100 rounded-xl" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {(data?.topCourses ?? []).map((course, i) => (
              <CourseCard key={course._id} course={course} index={i} onClick={() => navigate("/admin/courses")} />
            ))}
          </div>
        )}
      </div>

      {/* Live Enrollments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Live Enrollments</h2>
            {newEnrolls.length > 0 && (
              <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-black rounded-full">
                {newEnrolls.length} new
              </span>
            )}
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 bg-white border border-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allEnrollments.map((e, i) => (
              <EnrollmentCard key={e._id} enrollment={e} isNew={i < newEnrolls.length} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}