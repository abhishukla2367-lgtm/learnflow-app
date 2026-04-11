import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, ChevronRight } from 'lucide-react';
import { FadeIn } from '../ui/FadeIn';
import { FEATURES } from '../../data/homeData';
import { useAuth } from '../../context/AuthContext';

const AVATAR_INITIALS = ['AS', 'RG', 'MP', 'NK'];
const AVATAR_COLORS = [
  'from-cyan-500 to-cyan-700',
  'from-violet-500 to-violet-700',
  'from-emerald-500 to-emerald-700',
  'from-amber-500 to-amber-700',
];

const AUTO_ADVANCE_MS = 5000;

const BULLET_DELAYS = ['delay-0', 'delay-75', 'delay-150', 'delay-[225ms]'];

export default function WhyLearnflowSection() {
  const { user } = useAuth();
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const intervalRef = useRef(null);
  const progressRef = useRef(null);

  /* Auto-advance with progress bar */
  const startTimer = () => {
    clearInterval(intervalRef.current);
    setProgress(0);

    let elapsed = 0;
    const step = 50;

    intervalRef.current = setInterval(() => {
      elapsed += step;
      setProgress(Math.min((elapsed / AUTO_ADVANCE_MS) * 100, 100));
      if (elapsed >= AUTO_ADVANCE_MS) {
        setActive(prev => (prev + 1) % FEATURES.length);
        setAnimKey(k => k + 1);
        elapsed = 0;
        setProgress(0);
      }
    }, step);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleSelect = i => {
    setActive(i);
    setAnimKey(k => k + 1);
    startTimer();
  };

  const f = FEATURES[active];
  const FIcon = f.icon;

  return (
    <section className="py-24 border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <FadeIn className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-mono bg-cyan-50 text-cyan-700 border border-cyan-200 mb-4 shadow-sm shadow-cyan-100">
              Why Learnflow
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-3">
              Everything you need to<br />land your dream role.
            </h2>
            <p className="text-slate-500 text-base leading-relaxed">
              We've built every part of the platform around one goal — getting India's working
              professionals from zero to production-ready, with credentials employers trust.
            </p>
          </FadeIn>

          {/* Feature count badge */}
          <FadeIn delay={100}>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-sm text-slate-600 font-mono">
              <span className="text-cyan-600 font-bold">{active + 1}</span>
              <span className="text-slate-300">/</span>
              <span>{FEATURES.length}</span>
              <span className="text-slate-400 ml-1">features</span>
            </div>
          </FadeIn>
        </div>

        {/* ── Main split panel ── */}
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">

            {/* ── Left tab list ── */}
            <div className="lg:col-span-2 flex flex-col gap-2">
              {FEATURES.map(({ icon: TabIcon, title, tagline, tw }, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={title}
                    onClick={() => handleSelect(i)}
                    className={`group text-left w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all duration-200 cursor-pointer relative overflow-hidden
                      ${isActive
                        ? `bg-white ${tw.tabActiveBorder} ${tw.tabActiveShadow} translate-x-1`
                        : 'bg-transparent border-slate-200 hover:bg-white/70 hover:translate-x-0.5'
                      }`}
                  >
                    {/* Progress bar — only on active */}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-violet-400 transition-all duration-75 ease-linear" style={{ width: `${progress}%` }} />
                    )}

                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${isActive ? tw.tabIconActive : tw.tabIconInactive + ' group-hover:bg-slate-200'}`}>
                      <TabIcon className={`w-5 h-5 transition-colors duration-200 ${isActive ? tw.tabIconClrActive : tw.tabIconClrInact}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate transition-colors duration-200 ${isActive ? tw.tabTitleActive : tw.tabTitleInactive}`}>
                        {title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{tagline}</p>
                    </div>

                    {isActive
                      ? <span className={`flex-shrink-0 w-2 h-2 rounded-full ${tw.dot}`} />
                      : <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    }
                  </button>
                );
              })}
            </div>

            {/* ── Right detail card ── */}
            <div
              key={animKey}
              className={`lg:col-span-3 bg-white rounded-3xl overflow-hidden shadow-md border animate-panel-in ${f.tw.cardBorder}`}
              style={{ animationDuration: '0.35s' }}
            >
              {/* Gradient top bar */}
              <div className={`h-1.5 ${f.tw.topBar} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer" />
              </div>

              <div className="p-8">
                {/* Icon + title */}
                <div className="flex items-start gap-5 mb-6">
                  <div className={`flex-shrink-0 w-14 h-14 rounded-2xl border flex items-center justify-center ${f.tw.iconBg} ${f.tw.iconBorder} shadow-sm`}>
                    <FIcon className={`w-7 h-7 ${f.tw.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{f.title}</h3>
                    <p className={`text-sm font-medium ${f.tw.tagline}`}>{f.tagline}</p>
                  </div>
                </div>

                <p className="text-slate-500 text-base leading-relaxed mb-7">{f.desc}</p>

                {/* Bullets — staggered */}
                <ul className="space-y-3 mb-8">
                  {f.bullets.map((b, j) => (
                    <li
                      key={b}
                      className={`flex items-center gap-3 text-sm text-slate-700 animate-fade-up ${BULLET_DELAYS[j] ?? 'delay-0'}`}
                    >
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${f.tw.iconBg} border ${f.tw.iconBorder}`}>
                        <CheckCircle className={`w-3.5 h-3.5 ${f.tw.bullet}`} />
                      </div>
                      {b}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  to={user ? "/courses" : "/register"}
                  className={`group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] relative overflow-hidden ${f.tw.cta}`}
                >
                  <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500" />
                  Get started 
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
