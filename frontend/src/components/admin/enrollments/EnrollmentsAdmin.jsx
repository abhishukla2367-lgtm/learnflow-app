import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useSocket } from "../../../context/SocketContext";
import {
  Search, Filter, Clock, CheckCircle2, TrendingUp,
  Users, BookOpen, Award, Trash2, RotateCcw
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { fetchAdminEnrollments, deleteAdminEnrollment, restoreAdminEnrollment } from "../../../api/adminApi";
import EmptyState from "../shared/EmptyState";
import ErrorState from "../shared/ErrorState";
import { SkeletonEnrollCard } from "../shared/SkeletonCard";
import usePdfExport from "../shared/usePdfExport";
import toast from "react-hot-toast";

const STATUSES = ["All","active","completed","deleted"];
const STUDENT_GRADIENTS = ["from-cyan-400 to-blue-500","from-violet-400 to-purple-500","from-rose-400 to-pink-500","from-amber-400 to-orange-500","from-emerald-400 to-teal-500","from-indigo-400 to-violet-500"];
const PIE_COLORS = ["#10b981","#6366f1","#e2e8f0"];
const PROGRESS_COLORS = ["#6366f1","#f43f5e","#f59e0b","#8b5cf6","#06b6d4","#10b981"];

function PieTooltipCustom({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="bg-white border border-slate-200 rounded-2xl px-3 py-2.5 shadow-2xl text-xs">
      <div className="flex items-center gap-1.5 mb-1"><span className="w-2 h-2 rounded-full" style={{backgroundColor:p.payload.fill}}/><span className="font-bold text-slate-900">{p.name}</span></div>
      <p className="text-slate-500"><span className="font-black text-slate-900">{p.value?.toLocaleString("en-IN")}</span> ({p.payload.percent}%)</p>
    </div>
  );
}

function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-2xl px-3 py-2.5 shadow-2xl text-xs">
      <p className="font-bold text-slate-400 mb-1 text-[10px] uppercase tracking-widest">{label}</p>
      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{backgroundColor:payload[0].fill}}/><span className="font-black text-slate-900">{payload[0].value} students</span></div>
    </div>
  );
}

function ProgressRing({ value = 0 }) {
  const SIZE = 44, r = 19, circ = 2 * Math.PI * r;
  const pct  = Math.min(Math.max(value, 0), 100);
  const dash = (pct / 100) * circ;
  const color = pct >= 80 ? "#10b981" : pct >= 40 ? "#6366f1" : "#f59e0b";
  return (
    <div className="relative flex-shrink-0 w-11 h-11">
      <svg width={SIZE} height={SIZE} className="-rotate-90">
        <circle cx={SIZE/2} cy={SIZE/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={5} />
        <circle cx={SIZE/2} cy={SIZE/2} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-slate-700 tabular-nums">
        {pct}%
      </span>
    </div>
  );
}

function EnrollmentCard({ enrollment, onRemove, onRestore }) {
  const e = enrollment;
  const gradIdx = e.student?.name?.charCodeAt(0)%STUDENT_GRADIENTS.length||0;
  const gradient = STUDENT_GRADIENTS[gradIdx];
  const joinDate = e.createdAt ? new Date(e.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"2-digit"}) : "—";
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300 group flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-base font-black text-white flex-shrink-0 shadow-md`}>
            {e.student?.name?.[0]?.toUpperCase()??"?"}
          </div>
          <div className="min-w-0">
            <p className="font-black text-slate-900 text-sm truncate">{e.student?.name||"—"}</p>
            <p className="text-[10px] text-slate-400 truncate">{e.student?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ProgressRing value={e.progress||0}/>
          {!e.isDeleted && (
            <button
              onClick={() => onRemove(e._id, e.student?.name, e.course?.title)}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
              title="Remove enrollment"
            >
              <Trash2 size={13}/>
            </button>
          )}
          {e.isDeleted && (
            <button
              onClick={() => onRestore(e._id, e.student?.name, e.course?.title)}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all"
              title="Restore enrollment"
            >
              <RotateCcw size={13}/>
            </button>
          )}
        </div>
      </div>
      <div className="flex items-start gap-3 mb-4 p-3 bg-slate-50 rounded-xl">
        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 overflow-hidden flex-shrink-0">
          {e.course?.thumbnail ? <img src={e.course.thumbnail} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center"><BookOpen size={14} className="text-indigo-400"/></div>}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-800 line-clamp-1">{e.course?.title||"—"}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{e.course?.category}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-4">
        {e.isCompleted
          ? <span className="inline-flex items-center leading-none gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-black text-emerald-700"><CheckCircle2 size={10}/> Completed</span>
          : <span className="inline-flex items-center leading-none gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-[10px] font-black text-indigo-700"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"/> In Progress</span>
        }
        {e.course?.certificate && <span className="inline-flex items-center leading-none gap-1 px-2 py-1 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-bold text-amber-700"><Award size={9}/> Cert</span>}
      </div>
      <div className="mt-auto grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
        <div><div className="flex items-center gap-1.5 text-slate-600"><Clock size={10} className="text-violet-400"/><span className="text-xs font-bold">{joinDate}</span></div><p className="text-[9px] text-slate-400 uppercase tracking-wide mt-0.5">Enrolled</p></div>
        <div><div className="flex items-center gap-1.5 text-slate-600"><TrendingUp size={10} className="text-emerald-400"/><span className="text-xs font-bold text-emerald-600">₹{e.course?.price?.toLocaleString("en-IN")||"Free"}</span></div><p className="text-[9px] text-slate-400 uppercase tracking-wide mt-0.5">Value</p></div>
      </div>
    </div>
  );
}

// ── Portal-based modals ─────────────────────────────────────
function ConfirmModal({ name, course, onConfirm, onCancel }) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
          <Trash2 size={20} className="text-rose-500" />
        </div>
        <h3 className="font-black text-slate-900 text-base mb-1">Remove Enrollment?</h3>
        <p className="text-sm text-slate-500 mb-5">
          <span className="font-bold text-slate-700">{name}</span> will be removed from{" "}
          <span className="font-bold text-slate-700">{course}</span>. This can be restored later.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold transition-all">
            Remove
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function RestoreModal({ name, course, onConfirm, onCancel }) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
          <RotateCcw size={20} className="text-emerald-500" />
        </div>
        <h3 className="font-black text-slate-900 text-base mb-1">Restore Enrollment?</h3>
        <p className="text-sm text-slate-500 mb-5">
          <span className="font-bold text-slate-700">{name}</span> will be re-enrolled in{" "}
          <span className="font-bold text-slate-700">{course}</span>.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition-all">
            Restore
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function EnrollmentsAdmin({ downloadReportRef, exportPdfRef }) {
  const [items,         setItems]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(false);
  const [search,        setSearch]        = useState("");
  const [status,        setStatus]        = useState("All");
  const [total,         setTotal]         = useState(0);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [restoreTarget, setRestoreTarget] = useState(null);
  const pageRef = useRef(null);
  usePdfExport(exportPdfRef, pageRef, "enrollments", "Enrollments");

  const load = useCallback(async () => {
    setError(false); setLoading(true);
    try {
      const params = {};
      if (search)           params.search = search;
      if (status !== "All") params.status = status;
      const { data } = await fetchAdminEnrollments(params);
      setItems(data.enrollments||[]); setTotal(data.total||0);
    } catch { setError(true); }
    finally { setLoading(false); }
  }, [search, status]);

  useEffect(() => { load(); }, [load]);
  const { socket } = useSocket();

  // ── Auto-refresh on real-time events ─────────────────────
  useEffect(() => {
    if (!socket) return;
    const refresh = () => load();
    const dataRefreshHandler = ({ section }) => {
      if (section === "enrollments" || section === "all") load();
    };
    socket.on("enrollment:new", refresh);
    socket.on("data:refresh", dataRefreshHandler);
    return () => {
      socket.off("enrollment:new", refresh);
      socket.off("data:refresh", dataRefreshHandler);
    };
  }, [socket, load]);

  const handleRemove = async () => {
    try {
      await deleteAdminEnrollment(confirmTarget.id);
      setItems(prev => prev.filter(e => e._id !== confirmTarget.id));
      setTotal(prev => prev - 1);
      toast.success("Enrollment removed successfully");
    } catch {
      toast.error("Failed to remove enrollment");
    } finally {
      setConfirmTarget(null);
    }
  };

  const handleRestore = async () => {
    try {
      await restoreAdminEnrollment(restoreTarget.id);
      setItems(prev => prev.filter(e => e._id !== restoreTarget.id));
      setTotal(prev => prev - 1);
      toast.success("Enrollment restored successfully");
    } catch {
      toast.error("Failed to restore enrollment");
    } finally {
      setRestoreTarget(null);
    }
  };

  useEffect(() => {
    if (downloadReportRef) {
      downloadReportRef.current = async () => {
        const ExcelJS = (await import("exceljs")).default;
        const wb = new ExcelJS.Workbook();
        wb.creator = "Learnodays Admin";
        const ws = wb.addWorksheet("Enrollments");

        ws.columns = [
          { header: "#",           key: "num",      width: 6  },
          { header: "Student",     key: "student",  width: 24 },
          { header: "Email",       key: "email",    width: 30 },
          { header: "Course",      key: "course",   width: 40 },
          { header: "Category",    key: "category", width: 20 },
          { header: "Progress",    key: "progress", width: 12 },
          { header: "Status",      key: "status",   width: 16 },
          { header: "Price (₹)",   key: "price",    width: 14 },
          { header: "Enrolled On", key: "enrolled", width: 16 },
        ];

        items.forEach((e, i) => ws.addRow({
          num: i + 1,
          student:  e.student?.name  ?? "—",
          email:    e.student?.email ?? "—",
          course:   e.course?.title  ?? "—",
          category: e.course?.category ?? "—",
          progress: `${e.progress ?? 0}%`,
          status:   e.isCompleted ? "Completed" : "In Progress",
          price:    e.course?.isFree ? "Free" : e.course?.price ?? 0,
          enrolled: e.createdAt ? new Date(e.createdAt).toLocaleDateString("en-IN") : "—",
        }));

        ws.getRow(1).eachCell(cell => {
          cell.font      = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
          cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FF6366F1" } };
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.border    = { top:{ style:"thin" }, left:{ style:"thin" }, bottom:{ style:"thin" }, right:{ style:"thin" } };
        });
        ws.getRow(1).height = 22;

        for (let i = 2; i <= items.length + 1; i++) {
          const row  = ws.getRow(i);
          const data = items[i - 2];
          row.eachCell(cell => {
            cell.border    = { top:{ style:"thin" }, left:{ style:"thin" }, bottom:{ style:"thin" }, right:{ style:"thin" } };
            cell.alignment = { vertical: "middle" };
            if (i % 2 === 0) cell.fill = { type:"pattern", pattern:"solid", fgColor:{ argb:"FFF8FAFF" } };
          });
          const statusCell = row.getCell("status");
          if (data?.isCompleted) {
            statusCell.font = { bold: true, color: { argb: "FF059669" } };
          } else {
            statusCell.font = { bold: true, color: { argb: "FF6366F1" } };
          }
          const pct = data?.progress ?? 0;
          const progressCell = row.getCell("progress");
          progressCell.font = { bold: true, color: { argb: pct >= 80 ? "FF059669" : pct >= 40 ? "FF6366F1" : "FFD97706" } };
        }
        ws.getColumn("price").numFmt = "₹#,##0";

        const buffer = await wb.xlsx.writeBuffer();
        const blob   = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url    = URL.createObjectURL(blob);
        const a      = document.createElement("a");
        a.href = url; a.download = `Learnodays_enrollments_${new Date().toISOString().slice(0,10)}.xlsx`;
        a.click(); URL.revokeObjectURL(url);
      };
    }
  });

  const completed  = items.filter(e => e.isCompleted).length;
  const inProgress = items.filter(e => !e.isCompleted&&(e.progress||0)>0).length;
  const notStarted = items.filter(e => (e.progress||0)===0).length;
  const avgProgress = items.length ? Math.round(items.reduce((a,e)=>a+(e.progress||0),0)/items.length) : 0;

  const pieTot = completed + inProgress + notStarted || 1;
  const statusPieData = [
    { name:"Completed",   value:completed,  fill:"#10b981", percent:Math.round(completed/pieTot*100)  },
    { name:"In Progress", value:inProgress, fill:"#6366f1", percent:Math.round(inProgress/pieTot*100) },
    { name:"Not Started", value:notStarted, fill:"#f59e0b", percent:Math.round(notStarted/pieTot*100) },
  ].filter(d => d.value > 0);

  const progressBarData = [
    { name:"0%",    value:notStarted,                                                                    fill:PROGRESS_COLORS[0] },
    { name:"1-25%", value:items.filter(e=>(e.progress||0)>=1&&(e.progress||0)<=25).length,              fill:PROGRESS_COLORS[1] },
    { name:"26-50%",value:items.filter(e=>(e.progress||0)>=26&&(e.progress||0)<=50).length,             fill:PROGRESS_COLORS[2] },
    { name:"51-75%",value:items.filter(e=>(e.progress||0)>=51&&(e.progress||0)<=75).length,             fill:PROGRESS_COLORS[3] },
    { name:"76-99%",value:items.filter(e=>(e.progress||0)>=76&&(e.progress||0)<=99).length,             fill:PROGRESS_COLORS[4] },
    { name:"100%",  value:items.filter(e=>(e.progress||0)===100).length,                                fill:PROGRESS_COLORS[5] },
  ];

  return (
    <div ref={pageRef} className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:"Total",        value:total,             icon:Users,        color:"bg-indigo-50  border-indigo-200  text-indigo-600"  },
          { label:"Completed",    value:completed,         icon:CheckCircle2, color:"bg-emerald-50 border-emerald-200 text-emerald-600" },
          { label:"In Progress",  value:inProgress,        icon:TrendingUp,   color:"bg-amber-50   border-amber-200   text-amber-600"   },
          { label:"Avg Progress", value:`${avgProgress}%`, icon:Award,        color:"bg-violet-50  border-violet-200  text-violet-600"  },
        ].map(s => (
          <div key={s.label} className={`border rounded-2xl p-4 flex items-center gap-3 ${s.color}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}><s.icon size={18}/></div>
            <div><p className="text-xl font-black text-slate-900">{s.value}</p><p className="text-xs font-semibold text-slate-500">{s.label}</p></div>
          </div>
        ))}
      </div>

      {/* Charts */}
      {!loading && items.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-5"><CheckCircle2 size={15} className="text-emerald-500"/><h3 className="font-black text-slate-900 text-sm">Completion Status</h3></div>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={180}>
                <PieChart>
                  <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value" animationBegin={0} animationDuration={900}>
                    {statusPieData.map((entry,i) => <Cell key={i} fill={entry.fill} stroke="white" strokeWidth={2}/>)}
                  </Pie>
                  <Tooltip content={<PieTooltipCustom/>}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-3 flex-1">
                {statusPieData.map(item => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{backgroundColor:item.fill}}/>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-700">{item.name}</p>
                      <p className="text-[10px] text-slate-400">{item.value} ({item.percent}%)</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-5"><TrendingUp size={15} className="text-amber-500"/><h3 className="font-black text-slate-900 text-sm">Progress Distribution</h3></div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={progressBarData} margin={{top:5,right:10,bottom:0,left:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                <XAxis dataKey="name" tick={{fontSize:10,fill:"#64748b",fontWeight:600}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:10,fill:"#94a3b8"}} axisLine={false} tickLine={false} width={30}/>
                <Tooltip content={<BarTooltip/>} cursor={{fill:"rgba(99,102,241,0.06)"}}/>
                <Bar dataKey="value" name="Students" radius={[6,6,0,0]} maxBarSize={40}>
                  {progressBarData.map((entry,i) => <Cell key={i} fill={entry.fill}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center justify-between pdf-hide">
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student or course…"
              className="pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 w-60 transition-all"/>
          </div>
          <div className="relative">
            <Filter size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
            <select value={status} onChange={e => setStatus(e.target.value)} className="pl-7 pr-7 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-600 appearance-none focus:outline-none focus:border-indigo-400 cursor-pointer transition-all">
              {STATUSES.map(s => <option key={s} value={s}>{s==="All"?"All Status":s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
            </select>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-400">{total} enrollments</span>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({length:8}).map((_,i) => <SkeletonEnrollCard key={i}/>)}
        </div>
      ) : error ? <ErrorState onRetry={load}/> : items.length===0 ? (
        <EmptyState title="No enrollments found" message="Try different filters."/>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map(e => (
            <EnrollmentCard
              key={e._id}
              enrollment={e}
              onRemove={(id, name, course) => setConfirmTarget({ id, name, course })}
              onRestore={(id, name, course) => setRestoreTarget({ id, name, course })}
            />
          ))}
        </div>
      )}

      {/* Modals — rendered via portal directly into document.body */}
      {confirmTarget && (
        <ConfirmModal
          name={confirmTarget.name}
          course={confirmTarget.course}
          onConfirm={handleRemove}
          onCancel={() => setConfirmTarget(null)}
        />
      )}
      {restoreTarget && (
        <RestoreModal
          name={restoreTarget.name}
          course={restoreTarget.course}
          onConfirm={handleRestore}
          onCancel={() => setRestoreTarget(null)}
        />
      )}
    </div>
  );
}