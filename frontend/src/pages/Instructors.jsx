import { useState, useEffect, useRef } from 'react';
import { Users, Star, BookOpen, Award, XIcon, Linkedin, Loader2, CheckCircle, Mail, GraduationCap, Zap, TrendingUp } from 'lucide-react';
import { FaGithub, FaInstagram } from 'react-icons/fa';
import api from '../utils/api';

/* ── Mock data ── */
const MOCK = [
  { _id: 'i1', name: 'Rahul Sharma',   headline: 'Senior Full-Stack Developer | 8+ years',        bio: 'Expert in React, Node.js and cloud architecture. Helped 5000+ students land jobs at top companies.', createdCourses: [{},{},{},{}], enrolledCourses: Array(5200), rating: 4.9, isActive: true, isVerified: true, email: 'rahul@learnflow.in',   social: { github: '#', linkedin: '#', instagram: '#' } },
  { _id: 'i2', name: 'Dr. Priya Nair', headline: 'ML Researcher | IIT Bombay PhD',                bio: 'Published ML researcher with expertise in deep learning and NLP. 10+ publications in top journals.',  createdCourses: [{},{},{}],     enrolledCourses: Array(4100), rating: 4.9, isActive: true, isVerified: true, email: 'priya@learnflow.in',  social: { linkedin: '#', instagram: '#' } },
  { _id: 'i3', name: 'Sneha Kapoor',   headline: 'UI/UX Designer & React Expert',                 bio: '10+ years designing products for startups and enterprises across India and the US.',                 createdCourses: [{},{},{}],     enrolledCourses: Array(3200), rating: 4.8, isActive: true, isVerified: false, email: 'sneha@learnflow.in',  social: { linkedin: '#', github: '#' } },
  { _id: 'i4', name: 'Vikram Mehta',   headline: 'DevOps & Cloud Architect | AWS Certified',      bio: 'AWS Solutions Architect with extensive experience building scalable cloud systems for enterprises.',  createdCourses: [{},{}],        enrolledCourses: Array(2100), rating: 4.7, isActive: true, isVerified: true, email: 'vikram@learnflow.in', social: { linkedin: '#', github: '#' } },
  { _id: 'i5', name: 'Ananya Iyer',    headline: 'AI/ML Specialist | Ex-Google',                  bio: 'Former Google AI researcher bringing cutting-edge ML techniques to practical real-world applications.', createdCourses: [{},{}],       enrolledCourses: Array(3800), rating: 4.8, isActive: true, isVerified: true, email: 'ananya@learnflow.in', social: { github: '#', linkedin: '#' } },
  { _id: 'i6', name: 'Rohan Gupta',    headline: 'Full Stack Dev | ex-Google India',              bio: 'Build production-grade full-stack apps with MongoDB, Express, React, and Node.js.',                  createdCourses: [{},{},{}],     enrolledCourses: Array(4500), rating: 4.9, isActive: true, isVerified: true, email: 'rohan@learnflow.in',  social: { github: '#', linkedin: '#', instagram: '#' } },
  { _id: 'i7', name: 'Kavita Bhosle',  headline: 'Data Science Lead | Ex-Flipkart',               bio: 'Data science practitioner with 8+ years experience building ML pipelines at scale.',                 createdCourses: [{},{}],        enrolledCourses: Array(2900), rating: 4.7, isActive: true, isVerified: false, email: 'kavita@learnflow.in', social: { linkedin: '#' } },
  { _id: 'i8', name: 'Ajay Chauhan',   headline: 'SEO & Growth Expert | Ex-Razorpay',             bio: 'Growth hacker who scaled multiple SaaS products from 0 to 100k users using SEO and content.',        createdCourses: [{}],           enrolledCourses: Array(1700), rating: 4.6, isActive: true, isVerified: false, email: 'ajay@learnflow.in',   social: { linkedin: '#', instagram: '#' } },
];

/* ── Banner gradients ── */
const BANNER_GRADIENTS = [
  'from-cyan-500 to-cyan-700',
  'from-violet-500 to-violet-700',
  'from-indigo-500 to-indigo-700',
  'from-emerald-500 to-emerald-700',
  'from-amber-500 to-amber-700',
  'from-rose-500 to-rose-700',
];

/* ── Photo map ── */
const INSTRUCTOR_PHOTO_MAP = {
  'Vikas Tiwari':   'https://res.cloudinary.com/db2vju4mv/image/upload/q_auto/f_auto/v1775391842/s8ppe300x300-5_mbakdn.gif',
  'Kavita Bhosle':  'https://res.cloudinary.com/db2vju4mv/image/upload/q_auto/f_auto/v1775391841/images2_j1hqgr.jpg',
  'Priya Kulkarni': 'https://res.cloudinary.com/db2vju4mv/image/upload/q_auto/f_auto/v1775391841/1724819928447_h9vfvl.jpg',
  'Rohan Gupta':    'https://res.cloudinary.com/db2vju4mv/image/upload/q_auto/f_auto/v1775391841/images3_e6krpx.webp',
  'Ajay Chauhan':   'https://res.cloudinary.com/db2vju4mv/image/upload/q_auto/f_auto/v1775391841/64217-Ajay-Chauhan_z8khuj.jpg',
  'Siddharth Rao':  'https://res.cloudinary.com/db2vju4mv/image/upload/q_auto/f_auto/v1775391841/images_eahpkr.jpg',
  'Aarav Deshmukh': 'https://res.cloudinary.com/db2vju4mv/image/upload/q_auto/f_auto/v1775391840/1749345417148_mkfa31.jpg',
  'Ananya Iyer':    'https://res.cloudinary.com/db2vju4mv/image/upload/q_auto/f_auto/v1775391840/1745549131722_xjjk4q.jpg',
};

function getAvatarUrl(name = '') {
  return INSTRUCTOR_PHOTO_MAP[name] || null;
}

function getSocialLinks(instructor) {
  return [
    { key: 'github',    icon: FaGithub,    href: instructor.social?.github    || 'https://github.com',    label: 'GitHub',    hover: 'hover:bg-slate-800 hover:text-white' },
    { key: 'linkedin',  icon: Linkedin,    href: instructor.social?.linkedin  || 'https://linkedin.com',  label: 'LinkedIn',  hover: 'hover:bg-blue-600 hover:text-white'   },
    { key: 'instagram', icon: FaInstagram, href: instructor.social?.instagram || 'https://instagram.com', label: 'Instagram', hover: 'hover:bg-pink-500 hover:text-white'   },
    { key: 'x',   icon: XIcon,     href: instructor.social?.x   || 'https://x.com',   label: 'X',   hover: 'hover:bg-cyan-500 hover:text-white'   },
  ];
}

/* ── Floating particles (matches HeroSection) ── */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 4 + 2,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 6,
  duration: Math.random() * 8 + 6,
}));

/* ── Instructor Card (mirrors admin InstructorCard exactly) ── */
function InstructorCard({ instructor }) {
  const idx        = (instructor.name?.charCodeAt(0) || 0) % BANNER_GRADIENTS.length;
  const bannerGrad = BANNER_GRADIENTS[idx];
  const courses    = instructor.createdCourses?.length  || 0;
  const students   = instructor.enrolledCourses?.length || 0;
  const avatarUrl  = getAvatarUrl(instructor.name);
  const socialLinks = getSocialLinks(instructor);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden
      hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-50
      transition-all duration-300 group flex flex-col hover:-translate-y-1">

      {/* Banner */}
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
                onError={e => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div
                className={`w-20 h-20 rounded-2xl border-4 border-white shadow-lg
                  items-center justify-center text-white font-black text-xl
                  bg-gradient-to-br ${bannerGrad}`}
                style={{ display: 'none' }}
              >
                {instructor.name?.[0]?.toUpperCase() ?? '?'}
              </div>
            </>
          ) : (
            <div className={`w-20 h-20 rounded-2xl border-4 border-white shadow-lg
              flex items-center justify-center text-white font-black text-xl
              bg-gradient-to-br ${bannerGrad}`}>
              {instructor.name?.[0]?.toUpperCase() ?? '?'}
            </div>
          )}
          {instructor.isVerified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full
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
          <h3 className="font-black text-slate-900 text-sm leading-tight group-hover:text-cyan-700 transition-colors">
            {instructor.name}
          </h3>
        </div>

        {/* Bio */}
        {instructor.bio && (
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3 mt-1">
            {instructor.bio}
          </p>
        )}

        {/* Email */}
        {instructor.email && (
          <div className="flex items-center gap-2 mb-4">
            <Mail size={11} className="text-slate-300 flex-shrink-0" />
            <p className="text-xs text-slate-400 truncate font-mono">{instructor.email}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 mb-4">
          {[
            { icon: BookOpen, val: courses,                                                         label: 'Courses',  iconColor: 'text-cyan-500',   bg: 'bg-cyan-50'   },
            { icon: Users,    val: students.toLocaleString('en-IN'),                                label: 'Students', iconColor: 'text-violet-500', bg: 'bg-violet-50' },
            { icon: Star,     val: (instructor.averageRating || instructor.rating || 4.8).toFixed(1), label: 'Rating', iconColor: 'text-amber-500',  bg: 'bg-amber-50'  },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl py-2 px-1 text-center`}>
              <div className={`flex items-center justify-center gap-0.5 ${s.iconColor} mb-0.5`}>
                <s.icon size={11} />
                <span className="text-sm font-black text-slate-900 leading-none">{s.val}</span>
              </div>
              <p className="text-[9px] text-slate-400 uppercase tracking-wide font-semibold">{s.label}</p>
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
  const [loading, setLoading]         = useState(true);
  const heroRef = useRef(null);

  useEffect(() => {
    api.get('/users?role=instructor')
      .then(r => setInstructors(r.data.users?.length ? r.data.users : MOCK))
      .catch(() => setInstructors(MOCK))
      .finally(() => setLoading(false));
  }, []);

  const list = instructors.length ? instructors : MOCK;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Hero (themed exactly like HeroSection) ── */}
      <section ref={heroRef} className="relative bg-white overflow-hidden py-20">

        {/* Grid background */}
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(8,145,178,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(8,145,178,0.05)_1px,transparent_1px)] [background-size:44px_44px] pointer-events-none" />

        {/* Gradient blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan-100/60 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-violet-100/50 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-emerald-50/40 blur-[80px] pointer-events-none" />

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {PARTICLES.map(p => (
            <div
              key={p.id}
              className="absolute rounded-full bg-cyan-400/20 animate-float"
              style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s` }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-50 to-violet-50 border border-cyan-200 text-cyan-700 text-xs font-mono font-semibold mb-7 shadow-sm shadow-cyan-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            🇮🇳 India's Best Educators
          </div>

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/30">
            <GraduationCap size={30} className="text-white" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-4 leading-[1.1]">
            Learn from{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-violet-600">
              India's Best
            </span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Working professionals with real-world experience who love to teach — at IST-friendly timings and INR pricing.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {[
              { icon: GraduationCap, val: '7+',     label: 'Expert Instructors', bg: 'bg-cyan-50 border-cyan-200',     text: 'text-cyan-700',   icon_c: 'text-cyan-600'   },
              { icon: BookOpen,      val: '100+',   label: 'Courses Created',    bg: 'bg-violet-50 border-violet-200', text: 'text-violet-700', icon_c: 'text-violet-600' },
              { icon: Users,        val: '50,000+', label: 'Students Taught',    bg: 'bg-emerald-50 border-emerald-200',text:'text-emerald-700', icon_c: 'text-emerald-600'},
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

          {/* Mini badges row */}
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: Zap,        label: 'IST Friendly',   bg: 'bg-cyan-50 border-cyan-200',     text: 'text-cyan-700',    icon_c: 'text-cyan-600'   },
              { icon: TrendingUp, label: 'Career Growth',  bg: 'bg-violet-50 border-violet-200', text: 'text-violet-700',  icon_c: 'text-violet-600' },
              { icon: Award,      label: 'Certified',      bg: 'bg-emerald-50 border-emerald-200',text: 'text-emerald-700', icon_c: 'text-emerald-600' },
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
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-cyan-500" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {list.map(ins => (
              <InstructorCard key={ins._id} instructor={ins} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}