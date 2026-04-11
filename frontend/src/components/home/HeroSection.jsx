import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, CheckCircle, BookOpen, Clock, TrendingUp, Award } from 'lucide-react';
import { FadeIn, StatCard } from '../ui/FadeIn';
import { HERO_STATS, COMPANY_LOGOS } from '../../data/homeData';
import { useAuth } from '../../context/AuthContext';

const LIVE_SESSIONS = [
  { title: 'React State Management Deep Dive', instructor: 'Rohan Gupta', viewers: 238, color: 'from-cyan-500 to-cyan-700' },
  { title: 'ML — Gradient Descent Visualised', instructor: 'Ananya Iyer', viewers: 191, color: 'from-violet-500 to-violet-700' },
];

const TRUST_BADGES = ['Secure card payment', 'Free 7-day trial', '₹2999 avg course price'];

const TYPEWRITER_WORDS = ['employers pay for.', 'the future demands.', 'India rewards.'];

/* Floating particle dots */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 4 + 2,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 6,
  duration: Math.random() * 8 + 6,
}));

function TypewriterText({ words }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[idx];
    if (!deleting && displayed.length < word.length) {
      const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 60);
      return () => clearTimeout(t);
    }
    if (!deleting && displayed.length === word.length) {
      const t = setTimeout(() => setDeleting(true), 2400);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIdx(prev => (prev + 1) % words.length);
    }
  }, [displayed, deleting, idx, words]);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-violet-600">
      {displayed}
      <span className="animate-pulse text-cyan-500">|</span>
    </span>
  );
}

export default function HeroSection() {
  const { user } = useAuth();
  const heroRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  /* Subtle parallax on mouse move */
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const handler = e => {
      const rect = el.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
        y: ((e.clientY - rect.top)  / rect.height - 0.5) * 10,
      });
    };
    el.addEventListener('mousemove', handler);
    return () => el.removeEventListener('mousemove', handler);
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[92vh] flex items-center bg-white overflow-hidden pb-16">

      {/* ── Grid background ── */}
      <div className="absolute inset-0 [background-image:linear-gradient(rgba(8,145,178,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(8,145,178,0.05)_1px,transparent_1px)] [background-size:44px_44px] pointer-events-none" />

      {/* ── Gradient blobs ── */}
      <div
        className="absolute top-16 right-0 w-[560px] h-[560px] rounded-full bg-cyan-100/60 blur-[120px] pointer-events-none transition-transform duration-700 ease-out"
        style={{ transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)` }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-violet-100/50 blur-[100px] pointer-events-none transition-transform duration-700 ease-out"
        style={{ transform: `translate(${-mousePos.x * 0.2}px, ${-mousePos.y * 0.2}px)` }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-emerald-50/40 blur-[80px] pointer-events-none" />

      {/* ── Floating particles ── */}
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">

          {/* ── Left copy ── */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-50 to-violet-50 border border-cyan-200 text-cyan-700 text-xs font-mono font-semibold mb-7 animate-fade-up shadow-sm shadow-cyan-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              🇮🇳 India's Emerging Online Learning Platform
            </div>

            {/* Headline with typewriter */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-slate-900 leading-[1.1] mb-6 animate-fade-up-d1">
              Build skills that<br />
              <TypewriterText words={TYPEWRITER_WORDS} />
            </h1>

            <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-lg animate-fade-up-d2">
              Live sessions, expert instructors, and blockchain-verified certificates — all designed
              for India's working professionals. IST timings. INR pricing. Real careers.
            </p>

            {/* CTA buttons */}
            {/* CTA buttons */}
<div className="flex flex-wrap gap-4 mb-10 animate-fade-up-d3">
  <Link
    to={user ? "/courses" : "/register"}
    className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-cyan-600 text-white font-semibold text-base shadow-lg shadow-cyan-600/30 hover:bg-cyan-700 hover:shadow-cyan-600/50 hover:-translate-y-1 active:scale-[0.97] transition-all duration-200 overflow-hidden"
  >
    <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 ease-in-out" />
    Start Learning 
    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
  </Link>

  <Link
    to="/contact"
    className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-slate-200 text-slate-800 font-semibold text-base bg-white hover:border-cyan-300 hover:bg-cyan-50 hover:-translate-y-1 active:scale-[0.97] transition-all duration-200 shadow-sm"
  >
    Get in Touch
    <ArrowRight className="w-4 h-4 text-slate-800 group-hover:translate-x-1 transition-transform duration-200" />
  </Link>
</div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-5 animate-fade-up-d4">
              {TRUST_BADGES.map(t => (
                <span key={t} className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right — stats + live card ── */}
          <div className="animate-fade-up-d5 space-y-4">
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {HERO_STATS.map(s => (
                <StatCard key={s.label} target={s.target} suffix={s.suffix} label={s.label} decimals={s.decimals} />
              ))}
            </div>

            {/* Live card */}
            <div className="ring-1 ring-cyan-200 rounded-2xl bg-white shadow-xl shadow-slate-200/60 p-5 hover:shadow-cyan-100/60 hover:ring-cyan-300 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center shadow-md shadow-cyan-500/30">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Live right now</p>
                  <p className="text-xs text-slate-500">2 sessions in progress</p>
                </div>
                <span className="ml-auto flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 text-red-600 text-xs font-mono font-bold rounded-full">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                  </span>
                  LIVE
                </span>
              </div>

              <div className="space-y-2.5">
                {LIVE_SESSIONS.map(s => (
                  <div
                    key={s.title}
                    className="group flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-cyan-200 hover:bg-cyan-50/50 hover:shadow-sm transition-all duration-200 cursor-pointer"
                  >
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`}>
                      {s.instructor[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate group-hover:text-cyan-700 transition-colors">{s.title}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{s.instructor}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono flex-shrink-0 bg-white border border-slate-200 px-2 py-1 rounded-lg">
                      <Users className="w-3 h-3" />{s.viewers}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mini stats row */}
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2">
                {[
                  { icon: Clock,        label: 'IST Friendly',  iconCls: 'text-cyan-600',    bgCls: 'bg-cyan-50 border-cyan-200',      textCls: 'text-cyan-700'    },
                  { icon: TrendingUp, label: 'Career Growth', iconCls: 'text-violet-600',  bgCls: 'bg-violet-50 border-violet-200',  textCls: 'text-violet-700'  },
                  { icon: Award,      label: 'Certified',     iconCls: 'text-emerald-600', bgCls: 'bg-emerald-50 border-emerald-200',textCls: 'text-emerald-700' },
                ].map(({ icon: Icon, label, iconCls, bgCls, textCls }) => (
                  <div key={label} className={`flex flex-col items-center gap-1.5 text-center px-2 py-2 rounded-xl border ${bgCls}`}>
                    <Icon className={`w-4 h-4 ${iconCls}`} />
                    <span className={`text-[10px] font-semibold font-mono ${textCls}`}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Trusted by logos ── */}
        <FadeIn delay={100} className="relative z-10">
          <div className="relative mb-10">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <p className="relative text-xs text-slate-400 font-mono uppercase tracking-widest text-center bg-white inline-block px-4 left-1/2 -translate-x-1/2 absolute">
              Trusted by professionals at
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-8">
            {COMPANY_LOGOS.map(({ name, url, cls }) => (
              <div
                key={name}
                className="group flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-0.5"
                title={name}
              >
                <img
                  src={url}
                  alt={name}
                  className={`${cls} h-9 w-auto object-contain transition-all duration-300`}
                  style={{ transform: (name === 'IBM' || name === 'Meta') ? 'scale(0.85)' : 'none' }}
                />
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}