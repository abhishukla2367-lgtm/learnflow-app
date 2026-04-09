import { useState, useEffect, useCallback, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import {
  Star, BookOpen, Users,
  Linkedin, XIcon, CheckCircle, Mail,
  GraduationCap, TrendingUp, Award, Clock,
  RefreshCw, AlertTriangle,
} from "lucide-react";
import { FaGithub, FaInstagram, FaUserTie } from "react-icons/fa";
import api from "../utils/api";

/* ── Banner gradients ── */
const BANNER_GRADIENTS = [
  "from-violet-600 to-indigo-700",
  "from-cyan-600 to-teal-700",
  "from-rose-600 to-pink-700",
  "from-amber-600 to-orange-700",
  "from-emerald-600 to-teal-700",
  "from-indigo-600 to-blue-700",
];

/* ── Photo map — ONLY these 8 names are shown on the page ── */
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

/* The exact 8 names we want to show, in display order */
const MAPPED_NAMES = Object.keys(INSTRUCTOR_PHOTO_MAP);

/* ── Ratings map ── */
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

function getAvatarUrl(name = "") {
  return INSTRUCTOR_PHOTO_MAP[name] || null;
}

function getSocialLinks(instructor) {
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
      href:  instructor.X                 || "https://X.com",
      label: "X",
      hover: "hover:bg-indigo-500 hover:text-white",
    },
  ];
}

/* ── Floating particles ── */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id:       i,
  size:     Math.random() * 4 + 2,
  x:        Math.random() * 100,
  y:        Math.random() * 100,
  delay:    Math.random() * 6,
  duration: Math.random() * 8 + 6,
}));

function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {PARTICLES.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-cyan-400/20 animate-float"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Shared themed background ── */
function ThemedBackground({ children, className = "" }) {
  return (
    <div className={`relative overflow-hidden bg-white ${className}`}>
      <div className="absolute inset-0
        [background-image:linear-gradient(rgba(8,145,178,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(8,145,178,0.05)_1px,transparent_1px)]
        [background-size:44px_44px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan-100/60 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-violet-100/50 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-emerald-50/40 blur-[80px] pointer-events-none" />
      <FloatingParticles />
      <div className="relative">{children}</div>
    </div>
  );
}

/* ── Skeleton Card ── */
function SkeletonCard() {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-cyan-100 rounded-2xl overflow-hidden flex flex-col animate-pulse">
      <div className="h-24 bg-gradient-to-r from-cyan-100 to-violet-100" />
      <div className="px-5 -mt-10 relative z-10">
        <div className="w-20 h-20 rounded-2xl bg-slate-200 border-4 border-white shadow" />
      </div>
      <div className="px-5 pb-5 pt-3 flex flex-col gap-3">
        <div className="h-3 bg-slate-200 rounded w-2/3" />
        <div className="h-2 bg-slate-100 rounded w-full" />
        <div className="h-2 bg-slate-100 rounded w-4/5" />
        <div className="h-2 bg-slate-100 rounded w-1/2 mt-1" />
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100">
          {[0, 1, 2].map(i => <div key={i} className="bg-slate-100 rounded-xl py-5" />)}
        </div>
        <div className="flex gap-2 mt-1">
          {[0, 1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-xl bg-slate-100" />)}
        </div>
      </div>
    </div>
  );
}

/* ── Empty State ── */
function EmptyState() {
  return (
    <ThemedBackground className="rounded-3xl border border-cyan-100 shadow-sm">
      <div className="py-24 px-8 text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 to-violet-600
          flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/30">
          <GraduationCap size={36} className="text-white" />
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
          bg-gradient-to-r from-cyan-50 to-violet-50 border border-cyan-200
          text-cyan-700 text-xs font-mono font-semibold mb-4 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          No Results
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
          No Instructors Found
        </h3>
        <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
          We couldn't find any instructors right now. Check back soon — our team is growing!
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {[
            { icon: Clock,      label: "IST Friendly",  color: "text-cyan-600",    bg: "bg-cyan-50 border-cyan-200"      },
            { icon: TrendingUp, label: "Career Growth", color: "text-violet-600",  bg: "bg-violet-50 border-violet-200"  },
            { icon: Award,      label: "Certified",     color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
          ].map(({ icon: Icon, label, color, bg }) => (
            <span key={label}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold font-mono ${bg} ${color}`}>
              <Icon size={11} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </ThemedBackground>
  );
}

/* ── Error State ── */
function ErrorState({ onRetry }) {
  return (
    <ThemedBackground className="rounded-3xl border border-rose-100 shadow-sm">
      <div className="py-24 px-8 text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-500 to-pink-600
          flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-500/30">
          <AlertTriangle size={36} className="text-white" />
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
          bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono font-semibold mb-4 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          Something went wrong
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
          Failed to Load Instructors
        </h3>
        <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed mb-8">
          We hit a snag fetching the instructor list. Please check your connection and try again.
        </p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-8 py-3
            bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-2xl font-black text-sm
            hover:from-cyan-600 hover:to-violet-700 transition-all shadow-lg shadow-cyan-500/30
            active:scale-95">
          <RefreshCw size={14} />
          Try Again
        </button>
      </div>
    </ThemedBackground>
  );
}

/* ── Instructor Card ── */
function InstructorCard({ instructor }) {
  const idx        = instructor.name?.charCodeAt(0) % BANNER_GRADIENTS.length || 0;
  const bannerGrad = BANNER_GRADIENTS[idx];

  /* ── counts: prefer pre-computed fields, fall back to array lengths ── */
  const courses  = instructor.coursesCount  ?? instructor.createdCourses?.length  ?? 0;
  const students = instructor.studentsCount ?? instructor.enrolledStudents?.length ?? instructor.totalStudents ?? 0;

  const avatarUrl   = getAvatarUrl(instructor.name);
  const socialLinks = getSocialLinks(instructor);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden
      hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50
      transition-all duration-300 group flex flex-col">

      {/* Banner — no Active badge */}
      <div className={`h-24 bg-gradient-to-br ${bannerGrad} relative flex-shrink-0`}>
        <div className="absolute inset-0 opacity-10
          [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)]
          [background-size:16px_16px]" />
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

        <div className="mb-1">
          <h3 className="font-black text-slate-900 text-sm leading-tight">
            {instructor.name}
          </h3>
        </div>

        {instructor.bio && (
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">
            {instructor.bio}
          </p>
        )}

        <div className="flex items-center gap-2 mb-4 mt-1">
          <Mail size={11} className="text-slate-300 flex-shrink-0" />
          <p className="text-xs text-slate-400 truncate font-mono">{instructor.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 mb-4">
          {[
            { icon: BookOpen, val: courses,                    label: "Courses",  iconColor: "text-indigo-500", bg: "bg-indigo-50" },
            { icon: Users,    val: students,                   label: "Students", iconColor: "text-cyan-500",   bg: "bg-cyan-50"   },
            { icon: Star,     val: getRating(instructor.name), label: "Rating",   iconColor: "text-amber-500",  bg: "bg-amber-50"  },
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

/* ── Main Page ── */
export default function Instructors() {
  const [instructors, setInstructors] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(false);
  const heroRef = useRef(null);
  const { socket } = useSocket();

  const load = useCallback(async () => {
    setError(false);
    setLoading(true);
    try {
      const { data } = await api.get("/users/instructors");
      const all = data.users || [];

      /* Keep only the 8 names in INSTRUCTOR_PHOTO_MAP, preserve map order */
      const filtered = MAPPED_NAMES
        .map(name => all.find(u => u.name === name))
        .filter(Boolean);

      setInstructors(filtered);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  /* ── Real-time socket (mirrors admin) ── */
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

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative bg-white overflow-hidden py-20">
        <div className="absolute inset-0
          [background-image:linear-gradient(rgba(8,145,178,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(8,145,178,0.05)_1px,transparent_1px)]
          [background-size:44px_44px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan-100/60 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-violet-100/50 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-emerald-50/40 blur-[80px] pointer-events-none" />
        <FloatingParticles />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
            bg-gradient-to-r from-cyan-50 to-violet-50 border border-cyan-200
            text-cyan-700 text-xs font-mono font-semibold mb-7 shadow-sm shadow-cyan-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            🇮🇳 India's Top Educators
          </div>

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600
            flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/30">
            <GraduationCap size={30} className="text-white" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-wide text-slate-900 mb-4 leading-[1.1]">
            Learn from{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-violet-600">
              India's Best
            </span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Working professionals with real-world experience who love to teach — at IST-friendly timings and INR pricing.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {[
              { icon: FaUserTie, val: "7+",      label: "Expert Instructors", bg: "bg-cyan-50 border-cyan-200",      text: "text-cyan-700",    icon_c: "text-cyan-600"    },
              { icon: BookOpen,  val: "100+",    label: "Courses Created",    bg: "bg-violet-50 border-violet-200",  text: "text-violet-700",  icon_c: "text-violet-600"  },
              { icon: Users,     val: "50,000+", label: "Students Taught",    bg: "bg-emerald-50 border-emerald-200",text: "text-emerald-700", icon_c: "text-emerald-600" },
            ].map(({ icon: Icon, val, label, bg, text, icon_c }) => (
              <div key={label} className={`flex items-center gap-3 px-6 py-3 rounded-2xl border ${bg} shadow-sm`}>
                <Icon size={18} className={icon_c} />
                <div className="text-left">
                  <p className={`text-xl font-black ${text}`}>{val}</p>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: Clock,      label: "IST Friendly",  bg: "bg-cyan-50 border-cyan-200",      text: "text-cyan-700",    icon_c: "text-cyan-600"    },
              { icon: TrendingUp, label: "Career Growth", bg: "bg-violet-50 border-violet-200",  text: "text-violet-700",  icon_c: "text-violet-600"  },
              { icon: Award,      label: "Certified",     bg: "bg-emerald-50 border-emerald-200",text: "text-emerald-700", icon_c: "text-emerald-600" },
            ].map(({ icon: Icon, label, bg, text, icon_c }) => (
              <div key={label} className={`flex items-center gap-1.5 px-4 py-2 rounded-full border ${bg} text-xs font-semibold font-mono ${text}`}>
                <Icon size={13} className={icon_c} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cards Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <ErrorState onRetry={load} />
        ) : instructors.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {instructors.map(ins => <InstructorCard key={ins._id} instructor={ins} />)}
          </div>
        )}
      </div>
    </div>
  );
}