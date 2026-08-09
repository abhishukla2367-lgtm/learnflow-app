import { useState, useEffect, useCallback, useRef } from "react";
import { useSocket } from "../../../context/SocketContext";
import {
  TrendingUp, IndianRupee, Users, BookOpen,
  Star, Award, BarChart3, ArrowUpRight, Calendar, ChevronDown,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchReports } from "../../../api/adminApi";
import ErrorState from "../shared/ErrorState";
import { SkeletonTopCourseCard } from "../shared/SkeletonCard";
import usePdfExport from "../shared/usePdfExport";

const PIE_COLORS = ["#6366f1","#8b5cf6","#06b6d4","#f59e0b","#10b981","#f43f5e"];

/* ── Calendar-aligned report periods (Coursera / Udemy admin style) ── */
const PERIOD_GROUPS = [
  { label: "Week",  options: [{ value: "this_week",  label: "This Week"  }, { value: "last_week",  label: "Last Week"  }] },
  { label: "Month", options: [{ value: "this_month", label: "This Month" }, { value: "last_month", label: "Last Month" }] },
  { label: "Year",  options: [{ value: "this_year",  label: "This Year"  }, { value: "last_year",  label: "Last Year"  }] },
];
const PERIOD_LABELS = Object.fromEntries(PERIOD_GROUPS.flatMap(g => g.options).map(o => [o.value, o.label]));

function PeriodDropdown({ period, setPeriod }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative pdf-hide">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:border-indigo-300 hover:shadow-sm transition-all"
      >
        <Calendar size={13} className="text-slate-400" />
        {PERIOD_LABELS[period] ?? period}
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-20 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2">
          {PERIOD_GROUPS.map((group, gi) => (
            <div key={group.label} className={gi > 0 ? "mt-1 pt-1 border-t border-slate-100" : ""}>
              <p className="px-3 pt-2 pb-1 text-[9px] font-black uppercase tracking-widest text-slate-400">{group.label}</p>
              {group.options.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setPeriod(opt.value); setOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    period === opt.value ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChangeBadge({ value = 0 }) {
  const isUp = value >= 0;
  return (
    <span className={`inline-flex items-center leading-none px-2.5 py-1 text-[10px] font-black rounded-full border ${
      isUp ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"
    }`}>
      {isUp ? "+" : ""}{value}%
    </span>
  );
}

function ChartTooltip({ active, payload, label, prefix = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-2xl text-xs">
      {label && <p className="font-bold text-slate-400 mb-2 uppercase tracking-widest text-[10px]">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-1 last:mb-0">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-slate-600 font-semibold">{p.name}:</span>
          <span className="font-black text-slate-900">{prefix}{typeof p.value === "number" ? p.value.toLocaleString("en-IN") : p.value}</span>
        </div>
      ))}
    </div>
  );
}

function PieTooltipCustom({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-2xl text-xs">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.payload.fill }} />
        <span className="font-bold text-slate-900">{p.name}</span>
      </div>
      <p className="text-slate-500">
        <span className="font-black text-slate-900">{p.value?.toLocaleString("en-IN")}</span>
        <span className="ml-1">({p.payload.percent}%)</span>
      </p>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, prefix = "", accentBg, accentIcon, accentBorder, change }) {
  const isUp = change >= 0;
  return (
    <div className={`bg-white border rounded-2xl p-5 hover:shadow-md transition-all duration-200 ${accentBorder}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${accentBg} ${accentBorder}`}>
          <Icon size={17} className={accentIcon} />
        </div>
        {change !== undefined && (
          <span className={`flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full border
            ${isUp ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-rose-50 text-rose-500 border-rose-200"}`}>
            <ArrowUpRight size={9} className={!isUp ? "rotate-180" : ""} />
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <p className={`text-2xl font-black tabular-nums ${accentIcon}`}>
        {prefix}{typeof value === "number" ? value.toLocaleString("en-IN") : (value ?? "—")}
      </p>
    </div>
  );
}

function TopCourseCard({ course, rank }) {
  const RANK_STYLES = {
    1: { bg:"bg-amber-500",  text:"text-white", label:"🥇" },
    2: { bg:"bg-slate-400",  text:"text-white", label:"🥈" },
    3: { bg:"bg-orange-500", text:"text-white", label:"🥉" },
  };
  const style = RANK_STYLES[rank] || { bg:"bg-slate-100", text:"text-slate-600", label:`#${rank}` };
  const comp  = course.completionRate ?? 0;
  const compC = comp >= 80 ? "bg-emerald-500" : comp >= 50 ? "bg-indigo-500" : "bg-amber-400";
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <span className={`w-8 h-8 rounded-xl ${style.bg} ${style.text} flex items-center justify-center text-sm font-black`}>
          {rank <= 3 ? style.label : `#${rank}`}
        </span>
        <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-xl border border-amber-200">
          <Star size={10} className="fill-amber-400 text-amber-400" />
          <span className="text-[10px] font-black text-amber-700">{course.rating?.toFixed(1)}</span>
        </div>
      </div>
      <p className="font-black text-slate-900 text-sm line-clamp-2 mb-3 group-hover:text-indigo-600 transition-colors">{course.title}</p>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="p-2.5 bg-slate-50 rounded-xl">
          <p className="text-sm font-black text-slate-900">{course.enrollments?.toLocaleString("en-IN")}</p>
          <p className="text-[9px] text-slate-400 uppercase tracking-wide mt-0.5">Students</p>
        </div>
        <div className="p-2.5 bg-emerald-50 rounded-xl">
          <p className="text-sm font-black text-emerald-700">₹{(course.revenue/1000)?.toFixed(0)}k</p>
          <p className="text-[9px] text-slate-400 uppercase tracking-wide mt-0.5">Revenue</p>
        </div>
      </div>
      <div>
        <div className="flex justify-between mb-1.5">
          <span className="text-[10px] font-bold text-slate-500">Completion</span>
          <span className="text-[10px] font-black text-slate-700">{comp}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${compC} transition-all duration-700`} style={{ width:`${comp}%` }} />
        </div>
      </div>
    </div>
  );
}

const MOCK = {
  totalRevenue:1380000, newStudents:950, newEnrollments:3241, avgOrderValue:2800,
  changes:{ totalRevenue:22, newStudents:12, newEnrollments:18, avgOrderValue:8 },
  revenueChart:[{label:"Oct",value:128000},{label:"Nov",value:192000},{label:"Dec",value:156000},{label:"Jan",value:248000},{label:"Feb",value:312000},{label:"Mar",value:380000}],
  enrollmentChart:[{label:"Oct",value:320},{label:"Nov",value:480},{label:"Dec",value:390},{label:"Jan",value:620},{label:"Feb",value:780},{label:"Mar",value:950}],
  categoryBreakdown:[{label:"Web Development",value:1240},{label:"AI / Machine Learning",value:980},{label:"Design",value:756},{label:"Data Science",value:623},{label:"DevOps",value:542},{label:"Cybersecurity",value:389}],
  topCourses:[
    {_id:"1",title:"Full-Stack Web Development Bootcamp",enrollments:1240,revenue:3717600,rating:4.8,completionRate:72},
    {_id:"2",title:"Machine Learning with Python",enrollments:980,revenue:3429020,rating:4.9,completionRate:65},
    {_id:"3",title:"React & Next.js Advanced Architecture",enrollments:887,revenue:2479130,rating:4.9,completionRate:80},
    {_id:"4",title:"UI/UX Design Masterclass",enrollments:756,revenue:1510244,rating:4.7,completionRate:58},
    {_id:"5",title:"AWS & DevOps Fundamentals",enrollments:542,revenue:2167458,rating:4.6,completionRate:45},
    {_id:"6",title:"Data Science with R & Python",enrollments:623,revenue:1556877,rating:4.7,completionRate:61},
  ],
};

export default function ReportsAdmin({ downloadReportRef, exportPdfRef }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const [period,  setPeriod]  = useState("this_month");
  const chartsRef = useRef(null);

  const load = useCallback(async () => {
    setError(false); setLoading(true);
    try { const { data: res } = await fetchReports(period); setData(res); }
    catch { setData(MOCK); }
    finally { setLoading(false); }
  }, [period]);

  useEffect(() => { load(); }, [load]);
  const { socket } = useSocket();

  // ── Auto-refresh on real-time events ─────────────────────
  useEffect(() => {
    if (!socket) return;
    const refresh = () => load();
    const dataRefreshHandler = ({ section }) => {
      if (section === "reports" || section === "all") load();
    };
    socket.on("enrollment:new", refresh);
    socket.on("data:refresh", dataRefreshHandler);
    return () => {
      socket.off("enrollment:new", refresh);
      socket.off("data:refresh", dataRefreshHandler);
    };
  }, [socket, load]);


  // ── ExcelJS styled XLSX export ────────────────────────────
  useEffect(() => {
    if (downloadReportRef) {
      downloadReportRef.current = async () => {
        const ExcelJS = (await import("exceljs")).default;
        const d  = data ?? MOCK;
        const wb = new ExcelJS.Workbook();
        wb.creator = "Learnodays Admin";
        wb.created = new Date();

        const HEADER_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "FF6366F1" } };
        const HEADER_FONT = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
        const BORDER      = { top:{ style:"thin" }, left:{ style:"thin" }, bottom:{ style:"thin" }, right:{ style:"thin" } };
        const ALT_FILL    = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8FAFF" } };

        const styleHeader = (ws) => {
          ws.getRow(1).eachCell(cell => {
            cell.font      = HEADER_FONT;
            cell.fill      = HEADER_FILL;
            cell.alignment = { vertical: "middle", horizontal: "center" };
            cell.border    = BORDER;
          });
          ws.getRow(1).height = 22;
        };

        const styleRows = (ws, rowCount) => {
          for (let i = 2; i <= rowCount + 1; i++) {
            ws.getRow(i).eachCell(cell => {
              cell.border    = BORDER;
              cell.alignment = { vertical: "middle" };
              if (i % 2 === 0) cell.fill = ALT_FILL;
            });
          }
        };

        // Sheet 1 — Revenue & Enrollments
        const ws1 = wb.addWorksheet("Revenue & Enrollments");
        ws1.columns = [
          { header: "Period",       key: "period",      width: 12 },
          { header: "Revenue (₹)",  key: "revenue",     width: 18 },
          { header: "Enrollments",  key: "enrollments", width: 16 },
        ];
        (d.revenueChart ?? []).forEach((r, i) => ws1.addRow({
          period: r.label, revenue: r.value ?? 0, enrollments: d.enrollmentChart?.[i]?.value ?? 0,
        }));
        styleHeader(ws1); styleRows(ws1, d.revenueChart?.length ?? 0);
        ws1.getColumn("revenue").numFmt = "₹#,##0";

        // Sheet 2 — Category Breakdown
        const ws2 = wb.addWorksheet("Category Breakdown");
        ws2.columns = [
          { header: "Rank",         key: "rank",        width: 8  },
          { header: "Category",     key: "category",    width: 24 },
          { header: "Enrollments",  key: "enrollments", width: 16 },
          { header: "Share (%)",    key: "share",       width: 12 },
        ];
        const catTotal = (d.categoryBreakdown ?? []).reduce((a, c) => a + (c.value ?? 0), 0) || 1;
        (d.categoryBreakdown ?? []).forEach((c, i) => ws2.addRow({
          rank: i + 1, category: c.label, enrollments: c.value ?? 0,
          share: +((( c.value ?? 0) / catTotal * 100).toFixed(1)),
        }));
        styleHeader(ws2); styleRows(ws2, d.categoryBreakdown?.length ?? 0);
        ws2.getColumn("share").numFmt = "0.0\"%\"";

        // Sheet 3 — Top Courses
        const ws3 = wb.addWorksheet("Top Courses");
        ws3.columns = [
          { header: "Rank",          key: "rank",       width: 8  },
          { header: "Course Title",  key: "title",      width: 44 },
          { header: "Students",      key: "students",   width: 12 },
          { header: "Revenue (₹)",   key: "revenue",    width: 16 },
          { header: "Rating",        key: "rating",     width: 10 },
          { header: "Completion %",  key: "completion", width: 14 },
        ];
        (d.topCourses ?? []).forEach((c, i) => ws3.addRow({
          rank: i + 1, title: c.title, students: c.enrollments ?? 0,
          revenue: c.revenue ?? 0, rating: c.rating?.toFixed(1) ?? "—",
          completion: c.completionRate ?? 0,
        }));
        styleHeader(ws3); styleRows(ws3, d.topCourses?.length ?? 0);
        ws3.getColumn("revenue").numFmt    = "₹#,##0";
        ws3.getColumn("completion").numFmt = "0\"%\"";

        // Sheet 4 — Summary
        const ws4 = wb.addWorksheet("Summary");
        ws4.columns = [
          { header: "Metric", key: "metric", width: 22 },
          { header: "Value",  key: "value",  width: 24 },
        ];
        [
          { metric: "Total Revenue",   value: `₹${(d.totalRevenue ?? 0).toLocaleString("en-IN")}` },
          { metric: "New Students",    value: d.newStudents    ?? 0 },
          { metric: "New Enrollments", value: d.newEnrollments ?? 0 },
          { metric: "Avg Order Value", value: `₹${(d.avgOrderValue ?? 0).toLocaleString("en-IN")}` },
          { metric: "Report Period",   value: PERIOD_LABELS[period] ?? period },
          { metric: "Exported On",     value: new Date().toLocaleString("en-IN") },
        ].forEach(r => ws4.addRow(r));
        styleHeader(ws4); styleRows(ws4, 6);

        // Download
        const buffer = await wb.xlsx.writeBuffer();
        const blob   = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url    = URL.createObjectURL(blob);
        const a      = document.createElement("a");
        a.href       = url;
        a.download   = `Learnodays_report_${period}_${new Date().toISOString().slice(0, 10)}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
      };
    }
  });

  // ── PDF export — captures charts section via shared hook ──
  usePdfExport(exportPdfRef, chartsRef, `analytics_${period}`, `Reports & Analytics — ${PERIOD_LABELS[period] ?? period}`);

  if (error) return <ErrorState onRetry={load} />;
  const d = data ?? MOCK;

  const SUMMARY = [
    { icon:IndianRupee, label:"Total Revenue",   value:d.totalRevenue,    prefix:"₹", change:d.changes?.totalRevenue   ?? 0, accentBg:"bg-emerald-50", accentIcon:"text-emerald-600", accentBorder:"border-emerald-200" },
    { icon:Users,       label:"New Students",    value:d.newStudents,                 change:d.changes?.newStudents    ?? 0, accentBg:"bg-cyan-50",    accentIcon:"text-cyan-600",    accentBorder:"border-cyan-200"    },
    { icon:TrendingUp,  label:"New Enrollments", value:d.newEnrollments,              change:d.changes?.newEnrollments ?? 0, accentBg:"bg-violet-50",  accentIcon:"text-violet-600",  accentBorder:"border-violet-200"  },
    { icon:BarChart3,   label:"Avg Order Value", value:d.avgOrderValue,   prefix:"₹", change:d.changes?.avgOrderValue  ?? 0, accentBg:"bg-amber-50",   accentIcon:"text-amber-600",   accentBorder:"border-amber-200"   },
  ];

  const pieTotal  = d.categoryBreakdown.reduce((a,c) => a+(c.value??0),0)||1;
  const pieData   = d.categoryBreakdown.map(c => ({ name:c.label, value:c.value??0, percent:Math.round(((c.value??0)/pieTotal)*100) }));
  const revenueData = d.revenueChart.map(r => ({ name:r.label, Revenue:r.value??0 }));
  const enrollData  = d.enrollmentChart.map(r => ({ name:r.label, Enrollments:r.value??0 }));
  const comboData   = d.revenueChart.map((r,i) => ({ name:r.label, "Revenue (₹k)":Math.round((r.value??0)/1000), Enrollments:d.enrollmentChart?.[i]?.value??0 }));

  return (
    <div className="space-y-8">

      {/* Period selector */}
      <div className="flex items-center justify-between pdf-hide">
        <PeriodDropdown period={period} setPeriod={setPeriod} />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({length:4}).map((_,i) => <SkeletonTopCourseCard key={i} />)
          : SUMMARY.map(s => <SummaryCard key={s.label} {...s} />)
        }
      </div>

      {/* ── Charts + Top Courses — captured for PDF ── */}
      <div ref={chartsRef} className="space-y-8">

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Revenue Area */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <IndianRupee size={15} className="text-emerald-500" />
              <h3 className="font-black text-slate-900 text-sm">Revenue Trend</h3>
            </div>
            <ChangeBadge value={d.changes?.totalRevenue ?? 0} />
          </div>
          {loading ? <div className="h-52 bg-slate-100 rounded-xl animate-pulse" /> : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueData} margin={{top:5,right:10,bottom:0,left:0}}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                <XAxis dataKey="name" tick={{fontSize:11,fill:"#94a3b8",fontWeight:600}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:10,fill:"#94a3b8"}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`} width={48}/>
                <Tooltip content={<ChartTooltip prefix="₹"/>}/>
                <Area type="monotone" dataKey="Revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#revGrad)" dot={{fill:"#10b981",strokeWidth:0,r:4}} activeDot={{r:6,strokeWidth:2,stroke:"white"}}/>
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Enrollment Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Users size={15} className="text-indigo-500"/>
              <h3 className="font-black text-slate-900 text-sm">Enrollment Growth</h3>
            </div>
            <ChangeBadge value={d.changes?.newEnrollments ?? 0} />
          </div>
          {loading ? <div className="h-52 bg-slate-100 rounded-xl animate-pulse"/> : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={enrollData} margin={{top:5,right:10,bottom:0,left:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                <XAxis dataKey="name" tick={{fontSize:11,fill:"#94a3b8",fontWeight:600}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:10,fill:"#94a3b8"}} axisLine={false} tickLine={false} width={35}/>
                <Tooltip content={<ChartTooltip/>} cursor={{fill:"rgba(99,102,241,0.06)",radius:8}}/>
                <Bar dataKey="Enrollments" fill="#6366f1" radius={[6,6,0,0]} maxBarSize={40}>
                  {enrollData.map((_,i) => <Cell key={i} fill={`hsl(${240+i*8},70%,${60-i*3}%)`}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Category Pie */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-5">
            <BookOpen size={15} className="text-violet-500"/>
            <h3 className="font-black text-slate-900 text-sm">Enrollments by Category</h3>
          </div>
          {loading ? <div className="h-52 bg-slate-100 rounded-xl animate-pulse"/> : (
            <div className="flex items-center gap-2">
              <ResponsiveContainer width="55%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                    paddingAngle={3} dataKey="value" animationBegin={0} animationDuration={900}>
                    {pieData.map((_,i) => <Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]} stroke="white" strokeWidth={2}/>)}
                  </Pie>
                  <Tooltip content={<PieTooltipCustom/>}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                {pieData.map((item,i) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{backgroundColor:PIE_COLORS[i%PIE_COLORS.length]}}/>
                    <span className="text-[10px] text-slate-600 truncate flex-1">{item.name}</span>
                    <span className="text-[10px] font-black text-slate-700">{item.percent}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Revenue vs Enrollment combo */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 size={15} className="text-amber-500"/>
            <h3 className="font-black text-slate-900 text-sm">Revenue vs Enrollments</h3>
          </div>
          {loading ? <div className="h-52 bg-slate-100 rounded-xl animate-pulse"/> : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={comboData} margin={{top:5,right:10,bottom:0,left:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                <XAxis dataKey="name" tick={{fontSize:11,fill:"#94a3b8",fontWeight:600}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:10,fill:"#94a3b8"}} axisLine={false} tickLine={false} width={35}/>
                <Tooltip content={<ChartTooltip/>} cursor={{fill:"rgba(99,102,241,0.04)"}}/>
                <Legend wrapperStyle={{fontSize:"11px",fontWeight:700,paddingTop:"8px"}}/>
                <Bar dataKey="Revenue (₹k)" fill="#10b981" radius={[4,4,0,0]} maxBarSize={28}/>
                <Bar dataKey="Enrollments"  fill="#6366f1" radius={[4,4,0,0]} maxBarSize={28}/>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top Courses */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Award size={15} className="text-amber-500"/>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Top Courses by Revenue</h2>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d.topCourses?.length??0} courses</span>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({length:6}).map((_,i) => <SkeletonTopCourseCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(d.topCourses??[]).map((course,i) => <TopCourseCard key={course._id} course={course} rank={i+1}/>)}
          </div>
        )}
      </div>

      </div>{/* end chartsRef */}
    </div>
  );
}