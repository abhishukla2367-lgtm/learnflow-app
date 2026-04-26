import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../../context/SocketContext";
import {
  Search, Filter, Plus, MoreVertical, Eye, Trash2,
  ToggleLeft, ToggleRight, BookOpen, Star, Users,
  Clock, TrendingUp, CheckCircle2, XCircle,
} from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { fetchAdminCourses, publishCourse, deleteCourse } from "../../../api/adminApi";
import EmptyState from "../shared/EmptyState";
import ErrorState from "../shared/ErrorState";
import { SkeletonCourseCard } from "../shared/SkeletonCard";
import usePdfExport from "../shared/usePdfExport";
import toast from "react-hot-toast";

const DIFF_STYLES = {
  Beginner:     "bg-emerald-50 text-emerald-700 border-emerald-200",
  Intermediate: "bg-amber-50  text-amber-700  border-amber-200",
  Advanced:     "bg-rose-50   text-rose-700   border-rose-200",
};
const DIFF_DOT = {
  Beginner:"bg-emerald-500", Intermediate:"bg-amber-500", Advanced:"bg-rose-500",
};
const CAT_GRADIENTS = {
  "Web Development":"from-blue-600 to-indigo-600","Data Science":"from-violet-600 to-purple-600",
  "Design":"from-pink-500 to-rose-500","Business":"from-amber-500 to-orange-500",
  "Mobile Dev":"from-cyan-500 to-teal-500","AI / Machine Learning":"from-indigo-600 to-violet-600",
  "DevOps":"from-slate-600 to-slate-800","Cybersecurity":"from-red-600 to-rose-700",
  "Other":"from-emerald-500 to-teal-600",
};
const PIE_COLORS = ["#6366f1","#8b5cf6","#06b6d4","#f59e0b","#10b981","#f43f5e","#3b82f6","#ec4899"];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-2xl px-3 py-2.5 shadow-2xl text-xs">
      {label && <p className="font-bold text-slate-400 mb-1.5 uppercase tracking-widest text-[10px]">{label}</p>}
      {payload.map((p,i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{backgroundColor:p.color}}/>
          <span className="font-black text-slate-900">{typeof p.value==="number"?p.value.toLocaleString("en-IN"):p.value}</span>
        </div>
      ))}
    </div>
  );
}

function PieTooltipCustom({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="bg-white border border-slate-200 rounded-2xl px-3 py-2.5 shadow-2xl text-xs">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="w-2 h-2 rounded-full" style={{backgroundColor:p.payload.fill}}/>
        <span className="font-bold text-slate-900">{p.name}</span>
      </div>
      <p className="text-slate-500"><span className="font-black text-slate-900">{p.value}</span> courses</p>
    </div>
  );
}

function CourseCard({ course, onToggle, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef   = useRef(null);
  const navigate  = useNavigate();
  useEffect(() => {
    if (!menuOpen) return;
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [menuOpen]);
  const gradient = CAT_GRADIENTS[course.category] || "from-slate-600 to-slate-800";
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300 group flex flex-col">
      <div className={`relative h-36 bg-gradient-to-br ${gradient} overflow-hidden`}>
        {course.thumbnail
          ? <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"/>
          : <div className="w-full h-full flex items-center justify-center opacity-30"><BookOpen size={40} className="text-white"/></div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"/>
        <div className="absolute top-3 right-3" ref={menuRef}>
          <button onClick={() => setMenuOpen(v => !v)} className="w-8 h-8 rounded-xl bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100">
            <MoreVertical size={14}/>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-10 z-20 w-44 rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
              <button onClick={() => { navigate(`/courses/${course._id}`); setMenuOpen(false); }} className="flex items-center gap-2.5 w-full px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"><Eye size={14} className="text-indigo-500"/> View Course</button>
              <button onClick={() => { onToggle(course._id, course.isPublished); setMenuOpen(false); }} className="flex items-center gap-2.5 w-full px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                {course.isPublished ? <><ToggleLeft size={14} className="text-amber-500"/> Unpublish</> : <><ToggleRight size={14} className="text-emerald-500"/> Publish</>}
              </button>
              <div className="h-px bg-slate-100"/>
              <button onClick={() => { onDelete(course._id); setMenuOpen(false); }} className="flex items-center gap-2.5 w-full px-4 py-3 text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-colors"><Trash2 size={14}/>Delete Course</button>
            </div>
          )}
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center leading-none px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold border border-white/10">{course.category}</span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-3">
          <h3 className="font-black text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
          {course.instructor && (
            <div className="flex items-center gap-2 mt-1.5">
              <img src={course.instructor.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor.name}`} alt={course.instructor.name} className="w-4 h-4 rounded-full bg-slate-100"/>
              <p className="text-xs text-slate-400 truncate">{course.instructor.name}</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className={`inline-flex items-center leading-none gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${DIFF_STYLES[course.difficulty]||"bg-slate-50 text-slate-500 border-slate-200"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${DIFF_DOT[course.difficulty]||"bg-slate-400"}`}/>
            {course.difficulty}
          </span>
          {course.isFree
            ? <span className="inline-flex items-center leading-none text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Free for 7 days</span>
            : <span className="inline-flex items-center leading-none text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">₹{course.price?.toLocaleString("en-IN")}</span>
          }
        </div>
        <div className="mt-auto grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-slate-700"><Users size={11} className="text-indigo-400"/><span className="text-xs font-black">{(course.enrollmentCount||0).toLocaleString("en-IN")}</span></div>
            <p className="text-[9px] text-slate-400 uppercase tracking-wide mt-0.5">Students</p>
          </div>
          <div className="text-center border-x border-slate-100">
            <div className="flex items-center justify-center gap-1"><Star size={11} className="fill-amber-400 text-amber-400"/><span className="text-xs font-black text-slate-700">{course.averageRating?.toFixed(1)||"—"}</span></div>
            <p className="text-[9px] text-slate-400 uppercase tracking-wide mt-0.5">Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CoursesAdmin({ downloadReportRef, exportPdfRef }) {
  const [courses,  setCourses]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(false);
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");
  const [diff,     setDiff]     = useState("All");
  const [status,   setStatus]   = useState("All");
  const [total,    setTotal]    = useState(0);
  const pageRef = useRef(null);
  usePdfExport(exportPdfRef, pageRef, "courses", "Course Management");

  const CATEGORIES   = ["All","Marketing","Web Development","AI / Machine Learning","Design","Data Science","Cloud Computing"];
  const DIFFICULTIES = ["All","Beginner","Intermediate","Advanced"];
  const load = useCallback(async () => {
    setError(false); setLoading(true);
    try {
      const params = {};
      if (search)             params.search     = search;
      if (category !== "All") params.category   = category;
      if (diff !== "All")     params.difficulty = diff;
      if (status !== "All")   params.status     = status;
      const { data } = await fetchAdminCourses({ ...params, limit: 100 });
      setCourses(data.courses||[]); setTotal(data.total||0);
    } catch { setError(true); }
    finally { setLoading(false); }
  }, [search, category, diff, status]);

  useEffect(() => { load(); }, [load]);
  const { socket, liveStats  } = useSocket();

  // ── Auto-refresh on real-time events ─────────────────────
  useEffect(() => {
    if (!socket) return;
    const refresh = () => load();
    const dataRefreshHandler = ({ section }) => {
      if (section === "courses" || section === "all") load();
    };
    socket.on("course:published", refresh);
    socket.on("data:refresh", dataRefreshHandler);
    return () => {
      socket.off("course:published", refresh);
      socket.off("data:refresh", dataRefreshHandler);
    };
  }, [socket, load]);


  useEffect(() => {
    if (downloadReportRef) {
      downloadReportRef.current = async () => {
        const ExcelJS = (await import("exceljs")).default;
        const wb = new ExcelJS.Workbook();
        wb.creator = "LearnFlow Admin";
        const ws = wb.addWorksheet("Courses");

        ws.columns = [
          { header: "#",           key: "num",        width: 6  },
          { header: "Title",       key: "title",      width: 42 },
          { header: "Instructor",  key: "instructor", width: 22 },
          { header: "Category",    key: "category",   width: 20 },
          { header: "Difficulty",  key: "difficulty", width: 16 },
          { header: "Enrollments", key: "enroll",     width: 14 },
          { header: "Rating",      key: "rating",     width: 10 },
          { header: "Price (₹)",   key: "price",      width: 14 },
          { header: "Status",      key: "status",     width: 14 },
        ];

        courses.forEach((c, i) => ws.addRow({
          num: i + 1, title: c.title,
          instructor: c.instructor?.name ?? "—",
          category: c.category, difficulty: c.difficulty,
          enroll: c.enrollmentCount ?? 0,
          rating: c.averageRating?.toFixed(1) ?? "—",
          price: c.isFree ? "Free" : c.price ?? 0,
          status: c.isPublished ? "Published" : "Draft",
        }));

        // Style header row
        const INDIGO = "FF6366F1";
        ws.getRow(1).eachCell(cell => {
          cell.font      = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
          cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: INDIGO } };
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.border    = { top:{ style:"thin" }, left:{ style:"thin" }, bottom:{ style:"thin" }, right:{ style:"thin" } };
        });
        ws.getRow(1).height = 22;

        // Alternating row colors + status color coding
        for (let i = 2; i <= courses.length + 1; i++) {
          const row  = ws.getRow(i);
          const data = courses[i - 2];
          row.eachCell(cell => {
            cell.border    = { top:{ style:"thin" }, left:{ style:"thin" }, bottom:{ style:"thin" }, right:{ style:"thin" } };
            cell.alignment = { vertical: "middle" };
            if (i % 2 === 0) cell.fill = { type:"pattern", pattern:"solid", fgColor:{ argb:"FFF8FAFF" } };
          });
          // Color status cell
          const statusCell = row.getCell("status");
          if (data?.isPublished) {
            statusCell.font = { bold: true, color: { argb: "FF059669" } };
          } else {
            statusCell.font = { bold: true, color: { argb: "FFD97706" } };
          }
        }
        ws.getColumn("price").numFmt = "₹#,##0";

        const buffer = await wb.xlsx.writeBuffer();
        const blob   = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url    = URL.createObjectURL(blob);
        const a      = document.createElement("a");
        a.href = url; a.download = `learnflow_courses_${new Date().toISOString().slice(0,10)}.xlsx`;
        a.click(); URL.revokeObjectURL(url);
      };
    }
  });

  const handleToggle = async (id, current) => {
    try {
      await publishCourse(id);
      setCourses(p => p.map(c => c._id === id ? { ...c, isPublished: !current } : c));
      toast.success(`Course ${current ? "unpublished" : "published"} successfully`);
    } catch { toast.error("Failed to update course. Please try again."); }
  };

  const handleDelete = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold text-slate-900">Delete this course?</p>
        <p className="text-xs text-slate-500">This action cannot be undone.</p>
        <div className="flex gap-2">
          <button onClick={async () => {
            toast.dismiss(t.id);
            try {
              await deleteCourse(id);
              setCourses(p => p.filter(c => c._id !== id));
              setTotal(prev => prev - 1);
              toast.success("Course deleted successfully");
            } catch { toast.error("Failed to delete course. Please try again."); }
          }} className="flex-1 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition-all">
            Delete
          </button>
          <button onClick={() => toast.dismiss(t.id)}
            className="flex-1 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition-all">
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const published    = courses.filter(c => c.isPublished).length;
  const activeEnrollments = liveStats?.totalEnrollments ?? courses.reduce((a, c) => a + (c.enrollmentCount || 0), 0);
  const totalStudents= courses.reduce((a,c) => a+(c.enrollmentCount||0),0);

  // Chart data
  const enrollChartData = [...courses].sort((a,b)=>(b.enrollmentCount||0)-(a.enrollmentCount||0)).slice(0,6).map(c => ({ name: c.title, Students: c.enrollmentCount||0 }));
  const catMap = {};
  courses.forEach(c => { catMap[c.category]=(catMap[c.category]||0)+1; });
  const catPieData = Object.entries(catMap).map(([name,value]) => ({name,value})).sort((a,b)=>b.value-a.value);

  return (
    <div ref={pageRef} className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:"Total Courses",  value:total,                               icon:BookOpen,    color:"bg-indigo-50 border-indigo-200 text-indigo-600"   },
          { label:"Active Enrollments", value: typeof activeEnrollments === 'number' ? activeEnrollments.toLocaleString("en-IN") : activeEnrollments, icon:Users, color:"bg-amber-50 border-amber-200 text-amber-600" },
          { label:"Total Students", value:totalStudents.toLocaleString("en-IN"),icon:TrendingUp,  color:"bg-violet-50 border-violet-200 text-violet-600"   },
        ].map(s => (
          <div key={s.label} className={`border rounded-2xl p-4 flex items-center gap-3 ${s.color}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}><s.icon size={18}/></div>
            <div><p className="text-xl font-black text-slate-900">{s.value}</p><p className="text-xs font-semibold text-slate-500">{s.label}</p></div>
          </div>
        ))}
      </div>

      {/* Charts */}
      {!loading && courses.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Enrollments Bar Chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2"><Users size={15} className="text-indigo-500"/><h3 className="font-black text-slate-900 text-sm">Top Courses by Enrollments</h3></div>
              <span className="text-[10px] font-semibold text-slate-400">Top 6</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={enrollChartData} layout="vertical" margin={{top:0,right:20,bottom:0,left:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false}/>
                <XAxis type="number" tick={{fontSize:10,fill:"#94a3b8"}} axisLine={false} tickLine={false} tickFormatter={v=>v.toLocaleString("en-IN")}/>
                <YAxis type="category" dataKey="name" tick={{fontSize:10,fill:"#64748b",fontWeight:600}} axisLine={false} tickLine={false} width={160}/>
                <Tooltip content={<ChartTooltip/>} cursor={{fill:"rgba(99,102,241,0.06)"}}/>
                <Bar dataKey="Students" radius={[0,6,6,0]} maxBarSize={22}>
                  {enrollChartData.map((_,i) => <Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Pie Chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-5"><TrendingUp size={15} className="text-violet-500"/><h3 className="font-black text-slate-900 text-sm">Courses by Category</h3></div>
            <div className="flex items-center gap-2">
              <ResponsiveContainer width="55%" height={200}>
                <PieChart>
                  <Pie data={catPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" animationBegin={0} animationDuration={900}>
                    {catPieData.map((_,i) => <Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]} stroke="white" strokeWidth={2}/>)}
                  </Pie>
                  <Tooltip content={<PieTooltipCustom/>}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                {catPieData.map((item,i) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{backgroundColor:PIE_COLORS[i%PIE_COLORS.length]}}/>
                    <span className="text-[10px] text-slate-600 truncate flex-1">{item.name}</span>
                    <span className="text-[10px] font-black text-slate-700">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center justify-between pdf-hide">
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses…"
              className="pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 w-52 transition-all"/>
          </div>
          {[["Category",category,setCategory,CATEGORIES],["Level",diff,setDiff,DIFFICULTIES],["Status",status,setStatus,["All","published","draft"]]].map(([lbl,val,set,opts]) => (
            <div key={lbl} className="relative">
              <Filter size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
              <select value={val} onChange={e => set(e.target.value)} className="pl-7 pr-7 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-600 appearance-none focus:outline-none focus:border-indigo-400 cursor-pointer transition-all">
                {opts.map(o => <option key={o} value={o}>{o==="All"?lbl:(o.charAt(0).toUpperCase()+o.slice(1))}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400">{total} courses found</span>
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({length:8}).map((_,i) => <SkeletonCourseCard key={i}/>)}
        </div>
      ) : error ? <ErrorState onRetry={load}/> : courses.length === 0 ? (
        <EmptyState title="No courses found" message="Adjust your filters or add a new course."/>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {courses.map(course => <CourseCard key={course._id} course={course} onToggle={handleToggle} onDelete={handleDelete}/>)}
        </div>
      )}
    </div>
  );
}
