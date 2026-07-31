import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../../context/SocketContext";
import {
  Search, Filter, MoreVertical, Ban, CheckCircle,
  UserCheck, Mail, Calendar, BookOpen, Shield,
  GraduationCap, Users, TrendingUp,
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { fetchAdminUsers, toggleUser } from "../../../api/adminApi";
import EmptyState from "../shared/EmptyState";
import ErrorState from "../shared/ErrorState";
import { SkeletonUserCard } from "../shared/SkeletonCard";
import usePdfExport from "../shared/usePdfExport";
import toast from "react-hot-toast";

const ROLE_STYLES = {
  student:    { bg:"bg-slate-100",  text:"text-slate-600",  icon:Users         },
  instructor: { bg:"bg-violet-100", text:"text-violet-700", icon:GraduationCap },
  admin:      { bg:"bg-indigo-100", text:"text-indigo-700", icon:Shield        },
};
const AVATAR_GRADIENTS = ["from-cyan-400 to-blue-500","from-violet-400 to-purple-500","from-rose-400 to-pink-500","from-amber-400 to-orange-500","from-emerald-400 to-teal-500","from-indigo-400 to-violet-500"];
const PIE_COLORS = ["#10b981","#f43f5e","#94a3b8"];
const ROLE_COLORS = { student:"#6366f1", instructor:"#8b5cf6", admin:"#06b6d4" };

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-2xl px-3 py-2.5 shadow-2xl text-xs">
      {label && <p className="font-bold text-slate-400 mb-1 text-[10px] uppercase tracking-widest">{label}</p>}
      {payload.map((p,i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{backgroundColor:p.color||p.fill}}/>
          <span className="font-black text-slate-900">{p.value?.toLocaleString("en-IN")}</span>
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
      <p className="text-slate-500"><span className="font-black text-slate-900">{p.value?.toLocaleString("en-IN")}</span> users</p>
    </div>
  );
}


function UserCard({ user, onToggle }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef  = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!menuOpen) return;
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [menuOpen]);
  const gradIdx  = user.name?.charCodeAt(0) % AVATAR_GRADIENTS.length || 0;
  const gradient = AVATAR_GRADIENTS[gradIdx];
  const roleStyle = ROLE_STYLES[user.role] || ROLE_STYLES.student;
  const RoleIcon  = roleStyle.icon;
  const joinDate  = user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"2-digit"}) : "—";
  const courses = user.role === "instructor" || user.role === "admin"
  ? user.coursesCount ?? 0    
  : user.enrolledCount ?? 0;    
  
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300 group flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-lg font-black text-white flex-shrink-0 shadow-md`}>
            {user.name?.[0]?.toUpperCase()??"?"}
          </div>
          <div className="min-w-0">
            <p className="font-black text-slate-900 text-sm truncate max-w-[130px]">{user.name}</p>
            {user.isVerified && <span className="text-[10px] text-indigo-600 font-bold flex items-center gap-1"><CheckCircle size={10}/> Verified</span>}
          </div>
        </div>
        <div className="relative flex-shrink-0" ref={menuRef}>
          <button onClick={() => setMenuOpen(v => !v)} className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-all opacity-0 group-hover:opacity-100">
            <MoreVertical size={14}/>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-9 z-20 w-40 rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
              <button onClick={() => { onToggle(user._id, user.isActive); setMenuOpen(false); }} className={`flex items-center gap-2.5 w-full px-4 py-3 text-sm font-semibold transition-colors ${user.isActive?"text-rose-500 hover:bg-rose-50":"text-emerald-600 hover:bg-emerald-50"}`}>
                {user.isActive ? <><Ban size={13}/> Suspend</> : <><CheckCircle size={13}/> Reactivate</>}
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 mb-4"><Mail size={11} className="text-slate-400 flex-shrink-0"/><p className="text-xs text-slate-400 truncate">{user.email}</p></div>
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className={`inline-flex items-center leading-none gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${roleStyle.bg} ${roleStyle.text}`}><RoleIcon size={10}/> {user.role}</span>
        <span className={`inline-flex items-center leading-none gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${user.isActive?"bg-emerald-50 text-emerald-700":"bg-rose-50 text-rose-600"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${user.isActive?"bg-emerald-500":"bg-rose-500"}`}/>{user.isActive?"Active":"Suspended"}
        </span>
      </div>
      <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
        <div><div className="flex items-center gap-1.5 text-slate-700"><BookOpen size={11} className="text-indigo-400"/><span className="text-sm font-black">{courses}</span></div><p className="text-[9px] text-slate-400 uppercase tracking-wide mt-0.5">Courses</p></div>
        <div><div className="flex items-center gap-1.5 text-slate-700"><Calendar size={11} className="text-violet-400"/><span className="text-xs font-bold">{joinDate}</span></div><p className="text-[9px] text-slate-400 uppercase tracking-wide mt-0.5">Joined</p></div>
      </div>
    </div>
  );
}

export default function UsersAdmin({ downloadReportRef, exportPdfRef }) {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const [search,  setSearch]  = useState("");
  const [role,    setRole]    = useState("All");
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const pageRef = useRef(null);
  usePdfExport(exportPdfRef, pageRef, "users", "Students & Users");
  const PER_PAGE = 20;
  const ROLES = ["All","student","instructor","admin"];

  const load = useCallback(async () => {
    setError(false); setLoading(true);
    try {
      const params = { page, limit:PER_PAGE };
      if (search)         params.search = search;
      if (role !== "All") params.role   = role;
      const { data } = await fetchAdminUsers(params);
      setUsers(data.users||[]); setTotal(data.total||0);
    } catch { setError(true); }
    finally { setLoading(false); }
  }, [search, role, page]);

  useEffect(() => { load(); }, [load]);
  const { socket } = useSocket();

  // ── Auto-refresh on real-time events ─────────────────────
  useEffect(() => {
    if (!socket) return;
    const refresh = () => load();
    const dataRefreshHandler = ({ section }) => {
      if (section === "users" || section === "all") load();
    };
    socket.on("user:new", refresh);
    socket.on("data:refresh", dataRefreshHandler);
    return () => {
      socket.off("user:new", refresh);
      socket.off("data:refresh", dataRefreshHandler);
    };
  }, [socket, load]);


  useEffect(() => {
    if (downloadReportRef) {
      downloadReportRef.current = async () => {
        const ExcelJS = (await import("exceljs")).default;
        const wb = new ExcelJS.Workbook();
        wb.creator = "Learnodays Admin";
        const ws = wb.addWorksheet("Users");

        ws.columns = [
          { header: "#",        key: "num",      width: 6  },
          { header: "Name",     key: "name",     width: 26 },
          { header: "Email",    key: "email",    width: 32 },
          { header: "Role",     key: "role",     width: 14 },
          { header: "Courses",  key: "courses",  width: 10 },
          { header: "Verified", key: "verified", width: 10 },
          { header: "Status",   key: "status",   width: 14 },
          { header: "Joined",   key: "joined",   width: 16 },
        ];

        users.forEach((u, i) => ws.addRow({
          num: i + 1, name: u.name, email: u.email, role: u.role,
          courses: (u.enrolledCourses?.length ?? 0) + (u.createdCourses?.length ?? 0),
          verified: u.isVerified ? "Yes" : "No",
          status: u.isActive ? "Active" : "Suspended",
          joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN") : "—",
        }));

        // Style header
        ws.getRow(1).eachCell(cell => {
          cell.font      = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
          cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FF6366F1" } };
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.border    = { top:{ style:"thin" }, left:{ style:"thin" }, bottom:{ style:"thin" }, right:{ style:"thin" } };
        });
        ws.getRow(1).height = 22;

        // Row styles + status color coding
        for (let i = 2; i <= users.length + 1; i++) {
          const row  = ws.getRow(i);
          const data = users[i - 2];
          row.eachCell(cell => {
            cell.border    = { top:{ style:"thin" }, left:{ style:"thin" }, bottom:{ style:"thin" }, right:{ style:"thin" } };
            cell.alignment = { vertical: "middle" };
            if (i % 2 === 0) cell.fill = { type:"pattern", pattern:"solid", fgColor:{ argb:"FFF8FAFF" } };
          });
          const statusCell = row.getCell("status");
          if (data?.isActive) {
            statusCell.font = { bold: true, color: { argb: "FF059669" } };
          } else {
            statusCell.font = { bold: true, color: { argb: "FFE11D48" } };
          }
          const roleCell = row.getCell("role");
          const roleColors = { admin: "FF6366F1", instructor: "FF7C3AED", student: "FF0891B2" };
          roleCell.font = { bold: true, color: { argb: roleColors[data?.role] ?? "FF475569" } };
        }

        const buffer = await wb.xlsx.writeBuffer();
        const blob   = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url    = URL.createObjectURL(blob);
        const a      = document.createElement("a");
        a.href = url; a.download = `Learnodays_users_${new Date().toISOString().slice(0,10)}.xlsx`;
        a.click(); URL.revokeObjectURL(url);
      };
    }
  });

  const handleToggle = async (id, current) => {
    try {
      await toggleUser(id);
      setUsers(p => p.map(u => u._id === id ? { ...u, isActive: !current } : u));
      toast.success(`User ${current ? "suspended" : "reactivated"} successfully`);
    } catch {
      toast.error("Failed to update user. Please try again.");
    }
  };

  const activeCount    = users.filter(u => u.isActive).length;
  const suspendedCount = users.filter(u => !u.isActive).length;
  const studentCount   = users.filter(u => u.role==="student").length;

  // Chart data
  const statusPieData = [
    { name:"Active",    value:activeCount,    fill:"#10b981" },
    { name:"Suspended", value:suspendedCount, fill:"#f43f5e" },
  ].filter(d => d.value > 0);

  const roleBarData = ["student","instructor","admin"].map(r => ({
    name: r.charAt(0).toUpperCase()+r.slice(1)+"s",
    Users: users.filter(u => u.role===r).length,
    fill:  ROLE_COLORS[r],
  }));

  return (
    <div ref={pageRef} className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:"Active",       value:activeCount,    icon:CheckCircle, color:"bg-emerald-50 border-emerald-200 text-emerald-600" },
          { label:"Suspended",    value:suspendedCount, icon:Ban,         color:"bg-rose-50    border-rose-200    text-rose-600"    },
          { label:"Students",     value:studentCount,   icon:TrendingUp,  color:"bg-violet-50  border-violet-200  text-violet-600"  },
        ].map(s => (
          <div key={s.label} className={`border rounded-2xl p-4 flex items-center gap-3 ${s.color}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}><s.icon size={18}/></div>
            <div><p className="text-xl font-black text-slate-900">{s.value.toLocaleString("en-IN")}</p><p className="text-xs font-semibold text-slate-500">{s.label}</p></div>
          </div>
        ))}
      </div>

      {/* Charts */}
      {!loading && users.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Active vs Suspended Pie */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-5"><Users size={15} className="text-indigo-500"/><h3 className="font-black text-slate-900 text-sm">Active vs Suspended</h3></div>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={180}>
                <PieChart>
                  <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value" animationBegin={0} animationDuration={900}>
                    {statusPieData.map((entry,i) => <Cell key={i} fill={entry.fill} stroke="white" strokeWidth={2}/>)}
                  </Pie>
                  <Tooltip content={<PieTooltipCustom/>}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-4 flex-1">
                {statusPieData.map(item => (
                  <div key={item.name} className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{backgroundColor:item.fill}}/>
                    <div>
                      <p className="text-base font-black text-slate-900">{item.value.toLocaleString("en-IN")}</p>
                      <p className="text-[10px] text-slate-400">{item.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Users by Role Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-5"><TrendingUp size={15} className="text-violet-500"/><h3 className="font-black text-slate-900 text-sm">Users by Role</h3></div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={roleBarData} margin={{top:5,right:10,bottom:0,left:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                <XAxis dataKey="name" tick={{fontSize:11,fill:"#64748b",fontWeight:600}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:10,fill:"#94a3b8"}} axisLine={false} tickLine={false} width={35}/>
                <Tooltip content={<ChartTooltip/>} cursor={{fill:"rgba(99,102,241,0.06)"}}/>
                <Bar dataKey="Users" radius={[6,6,0,0]} maxBarSize={50}>
                  {roleBarData.map((entry,i) => <Cell key={i} fill={entry.fill}/>)}
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
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search users…"
              className="pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 w-52 transition-all"/>
          </div>
          <div className="relative">
            <Filter size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
            <select value={role} onChange={e => { setRole(e.target.value); setPage(1); }} className="pl-7 pr-7 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-600 appearance-none focus:outline-none focus:border-indigo-400 cursor-pointer transition-all">
              {ROLES.map(r => <option key={r} value={r}>{r==="All"?"All Roles":r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
            </select>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-400">{total} users</span>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({length:8}).map((_,i) => <SkeletonUserCard key={i}/>)}
        </div>
      ) : error ? <ErrorState onRetry={load}/> : users.length===0 ? (
        <EmptyState title="No users found" message="Try a different search or role filter."/>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {users.map(u => <UserCard key={u._id} user={u} onToggle={handleToggle}/>)}
        </div>
      )}

      {total > PER_PAGE && (
        <div className="flex items-center justify-between px-1 pdf-hide">
          <p className="text-xs text-slate-400">Showing {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE,total)} of {total}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-all">Previous</button>
            <button onClick={() => setPage(p => p+1)} disabled={page*PER_PAGE>=total} className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-all">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
