import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import usePdfExport from "../shared/usePdfExport";
import { useSocket } from "../../../context/SocketContext";
import {
  Search, Star, BookOpen, Users,
  Linkedin, XIcon, CheckCircle, Mail,
  GraduationCap, TrendingUp,
} from "lucide-react";
import { FaGithub, FaInstagram } from "react-icons/fa";
import { fetchAdminUsers } from "../../../api/adminApi";
import EmptyState from "../shared/EmptyState";
import ErrorState from "../shared/ErrorState";
import { SkeletonInstructorCard } from "../shared/SkeletonCard";

const BANNER_GRADIENTS = [
  "from-violet-600 to-indigo-700",
  "from-cyan-600 to-teal-700",
  "from-rose-600 to-pink-700",
  "from-amber-600 to-orange-700",
  "from-emerald-600 to-teal-700",
  "from-indigo-600 to-blue-700",
];

/* ── Exact name → Cloudinary URL map ── */
const INSTRUCTOR_PHOTO_MAP = {
  "Vikas Tiwari":   "https://res.cloudinary.com/db2vju4mv/image/upload/q_auto/f_auto/v1775391842/s8ppe300x300-5_mbakdn.gif",
  "Kavita Bhosle":  "https://res.cloudinary.com/db2vju4mv/image/upload/q_auto/f_auto/v1775391841/images2_j1hqgr.jpg",
  "Priya Kulkarni": "https://res.cloudinary.com/db2vju4mv/image/upload/q_auto/f_auto/v1775391841/1724819928447_h9vfvl.jpg",
  "Rohan Gupta":    "https://res.cloudinary.com/db2vju4mv/image/upload/q_auto/f_auto/v1775391841/images3_e6krpx.webp",
  "Ajay Chauhan":   "https://res.cloudinary.com/db2vju4mv/image/upload/q_auto/f_auto/v1775391841/64217-Ajay-Chauhan_z8khuj.jpg",
  "Siddharth Rao":  "https://res.cloudinary.com/db2vju4mv/image/upload/q_auto/f_auto/v1775391841/images_eahpkr.jpg",
  "Aarav Deshmukh": "https://res.cloudinary.com/db2vju4mv/image/upload/q_auto/f_auto/v1775391840/1749345417148_mkfa31.jpg",
  "Ananya Iyer":    "https://res.cloudinary.com/db2vju4mv/image/upload/q_auto/f_auto/v1775391840/1745549131722_xjjk4q.jpg",
};

const INSTRUCTOR_RATINGS = {
  "Priya Kulkarni": "4.9",
  "Ananya Iyer":    "4.7",
  "Siddharth Rao":  "4.6",
  "Kavita Bhosle":  "4.8",
  "Aarav Deshmukh": "4.5",
  "Vikas Tiwari":   "5.0",
  "Ajay Chauhan":   "4.3",
  "Rohan Gupta":    "4.7",
};

function getRating(name = "") {
  return INSTRUCTOR_RATINGS[name] || "4.2";
}

/* ── Direct lookup — no hashing, no gender guessing ── */
function getAvatarUrl(name = "") {
  return INSTRUCTOR_PHOTO_MAP[name] || null; // null triggers initials fallback
}

/* ── Social links ── */
function getSocialLinks(instructor) {
  const slug = instructor.name?.toLowerCase().replace(/\s+/g, "") || "user";
  return [
    {
      key:   "github",
      icon:  FaGithub,
      href:  instructor.social?.github    || "https://github.com",
      label: "GitHub",
      hover: "hover:bg-slate-800 hover:text-white",
    },
    {
      key:   "linkedin",
      icon:  Linkedin,
      href:  instructor.social?.linkedin  || "https://linkedin.com",
      label: "LinkedIn",
      hover: "hover:bg-blue-600 hover:text-white",
    },
    {
      key:   "instagram",
      icon:  FaInstagram,
      href:  instructor.social?.instagram || "https://instagram.com",
      label: "Instagram",
      hover: "hover:bg-pink-500 hover:text-white",
    },
    {
      key:   "X",
      icon:  XIcon,
      href:  instructor.X           || "https://X.com",
      label: "X",
      hover: "hover:bg-indigo-500 hover:text-white",
    },
  ];
}

/* ── Instructor Card ── */
function InstructorCard({ instructor }) {
  const idx        = instructor.name?.charCodeAt(0) % BANNER_GRADIENTS.length || 0;
  const bannerGrad = BANNER_GRADIENTS[idx];
  const courses  = instructor.coursesCount  || 0;
  const students = instructor.studentsCount || 0;
  const avatarUrl  = getAvatarUrl(instructor.name);
  const socialLinks = getSocialLinks(instructor);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden
      hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50
      transition-all duration-300 group flex flex-col">

      {/* Banner */}
      <div className={`h-24 bg-gradient-to-br ${bannerGrad} relative flex-shrink-0`}>
        <div className="absolute inset-0 opacity-10
          [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)]
          [background-size:16px_16px]" />
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
            text-[10px] font-black backdrop-blur-sm border leading-none
            ${instructor.isActive
              ? "bg-emerald-500/90 text-white border-emerald-400/30"
              : "bg-slate-800/70 text-slate-300 border-slate-600/30"
            }`}>
            <span className={`w-1.5 h-1.5 rounded-full
              ${instructor.isActive ? "bg-white animate-pulse" : "bg-slate-500"}`} />
            {instructor.isActive ? "Active" : "Suspended"}
          </span>
        </div>
      </div>

      {/* Avatar */}
      <div className="px-5 -mt-10 relative z-10">
        <div className="relative w-20 h-20">
          {avatarUrl ? (
            <>
              <img
                src={avatarUrl}
                alt={instructor.name}
                className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg
                  group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              {/* Initials fallback if image fails to load */}
              <div
                className={`w-20 h-20 rounded-2xl border-4 border-white shadow-lg
                  items-center justify-center text-white font-black text-xl
                  bg-gradient-to-br ${bannerGrad}`}
                style={{ display: "none" }}
              >
                {instructor.name?.[0]?.toUpperCase() ?? "?"}
              </div>
            </>
          ) : (
            /* Initials shown when name not in map */
            <div className={`w-20 h-20 rounded-2xl border-4 border-white shadow-lg
              flex items-center justify-center text-white font-black text-xl
              bg-gradient-to-br ${bannerGrad}`}>
              {instructor.name?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
          {instructor.isVerified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full
              flex items-center justify-center border-2 border-white shadow-sm">
              <CheckCircle size={10} className="text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pb-5 pt-3 flex flex-col flex-1">

        {/* Name & headline */}
        <div className="mb-1">
          <h3 className="font-black text-slate-900 text-sm leading-tight">
            {instructor.name}
          </h3>
        </div>

        {/* Bio */}
        {instructor.bio && (
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">
            {instructor.bio}
          </p>
        )}

        {/* Email */}
        <div className="flex items-center gap-2 mb-4 mt-1">
          <Mail size={11} className="text-slate-300 flex-shrink-0" />
          <p className="text-xs text-slate-400 truncate font-mono">{instructor.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 mb-4">
          {[
            { icon: BookOpen, val: courses,  label: "Courses",  iconColor: "text-indigo-500", bg: "bg-indigo-50" },
            { icon: Users,    val: students, label: "Students", iconColor: "text-cyan-500",   bg: "bg-cyan-50"   },
            { icon: Star, val: getRating(instructor.name), label: "Rating", iconColor: "text-amber-500", bg: "bg-amber-50" },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl py-2 px-1 text-center`}>
              <div className={`flex items-center justify-center gap-0.5 ${s.iconColor} mb-0.5`}>
                <s.icon size={11} />
                <span className="text-sm font-black text-slate-900 leading-none">{s.val}</span>
              </div>
              <p className="text-[9px] text-slate-400 uppercase tracking-wide font-semibold">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Social links */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {socialLinks.map(({ key, icon: Icon, href, label, hover }) => (
            <a key={key} href={href} target="_blank" rel="noreferrer" title={label}
              className={`w-8 h-8 flex-shrink-0 rounded-xl bg-slate-100 flex items-center
                justify-center text-slate-400 transition-all duration-200 ${hover}`}>
              <Icon size={13} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function InstructorsAdmin({ exportPdfRef }) {
  const [instructors, setInstructors] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(false);
  const [search,      setSearch]      = useState("");
  const pageRef = useRef(null);
  usePdfExport(exportPdfRef, pageRef, "instructors", "Instructor Management");

  const load = useCallback(async () => {
    setError(false); setLoading(true);
    try {
      const { data } = await fetchAdminUsers({ role: "instructor", search, limit: 50 });
      setInstructors(data.users || []);
    } catch { setError(true); }
    finally  { setLoading(false); }
  }, [search]);
  useEffect(() => {
  if (instructors.length > 0) console.log(instructors[0]);
}, [instructors]);
  useEffect(() => { load(); }, [load]);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;
    const refresh = () => load();
    const dataRefreshHandler = ({ section }) => {
      if (section === "instructors" || section === "all") load();
    };
    socket.on("user:new", refresh);
    socket.on("data:refresh", dataRefreshHandler);
    return () => {
      socket.off("user:new", refresh);
      socket.off("data:refresh", dataRefreshHandler);
    };
  }, [socket, load]);

  const active    = instructors.filter(i => i.isActive).length;
  const suspended = instructors.filter(i => !i.isActive).length;

  return (
    <div ref={pageRef} className="space-y-6">

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Instructors", value: instructors.length, icon: GraduationCap, color: "bg-violet-50 border-violet-200 text-violet-600"   },
          { label: "Active",            value: active,             icon: TrendingUp,    color: "bg-emerald-50 border-emerald-200 text-emerald-600" },
          { label: "Suspended",         value: suspended,          icon: Users,         color: "bg-rose-50 border-rose-200 text-rose-600"          },
        ].map(s => (
          <div key={s.label} className={`border rounded-2xl p-5 flex items-center gap-4 ${s.color}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
              <s.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{s.value}</p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center justify-between flex-wrap gap-3 pdf-hide">
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search instructors…"
            className="pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm
              placeholder-slate-400 focus:outline-none focus:border-indigo-400
              focus:ring-2 focus:ring-indigo-100 w-60 transition-all"
          />
        </div>
        <span className="text-xs font-semibold text-slate-400">{instructors.length} instructors</span>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonInstructorCard key={i} />)}
        </div>
      ) : error ? (
        <ErrorState onRetry={load} />
      ) : instructors.length === 0 ? (
        <EmptyState title="No instructors found" message="No instructors match your search." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {instructors.map(ins => <InstructorCard key={ins._id} instructor={ins} />)}
        </div>
      )}

      {/* Invite CTA */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-8 text-center text-white">
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
          <GraduationCap size={24} className="text-white" />
        </div>
        <h3 className="font-black text-lg mb-2">Grow the Instructor Team</h3>
        <p className="text-indigo-100 text-sm mb-5 max-w-sm mx-auto">
          Invite industry experts to teach on LearnFlow and reach thousands of students.
        </p>
        <button
          onClick={() => toast("Invite feature coming soon! 🚀", { icon: "📧" })}
          className="px-8 py-3 bg-white text-indigo-600 rounded-xl font-black text-sm
            hover:bg-slate-50 transition-all shadow-lg active:scale-95">
          Invite Instructor
        </button>
      </div>
    </div>
  );
}