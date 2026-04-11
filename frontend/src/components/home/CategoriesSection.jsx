import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FadeIn } from '../ui/FadeIn';
import { CATEGORIES, COLOR_MAP } from '../../data/homeData';

/* 3D tilt on hover */
function TiltCard({ children, className }) {
  const ref = useRef(null);

  const handleMove = e => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 14;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -14;
    el.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
    el.style.boxShadow = `${-x * 1.5}px ${y * 1.5}px 30px rgba(8,145,178,0.12)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
    el.style.boxShadow = '';
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}
    >
      {children}
    </div>
  );
}

const GLOW_COLOR = {
  orange:  'group-hover:shadow-orange-200/60',
  cyan:    'group-hover:shadow-cyan-200/60',
  violet:  'group-hover:shadow-violet-200/60',
  amber:   'group-hover:shadow-amber-200/60',
  emerald: 'group-hover:shadow-emerald-200/60',
  blue:    'group-hover:shadow-blue-200/60',
  indigo:  'group-hover:shadow-indigo-200/60',
  rose:    'group-hover:shadow-rose-200/60',
};

export default function CategoriesSection() {
  return (
    <section className="py-24 border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <FadeIn className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-mono bg-cyan-50 text-cyan-700 border border-cyan-200 mb-4 shadow-sm shadow-cyan-100">
            Explore Topics
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-3">
            Browse by category
          </h2>
          <p className="text-slate-500 text-base leading-relaxed max-w-lg mx-auto">
            From web development to data science — every category has expert instructors
            from India's top companies.
          </p>
        </FadeIn>

        {/* ── Category grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {CATEGORIES.map(({ label, icon: Icon, count, color }, i) => (
            <FadeIn key={label} delay={i * 60}>
              <TiltCard className={`group h-full`}>
                <Link
                  to={`/courses?category=${label}`}
                  className={`relative flex flex-col items-center gap-4 p-8 rounded-2xl bg-white border border-slate-200 text-center transition-all duration-300 cursor-pointer overflow-hidden h-full hover:border-transparent shadow-sm hover:shadow-xl ${GLOW_COLOR[color]}`}
                >
                  {/* Background glow on hover */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl ${COLOR_MAP[color].split(' ')[0]}`} />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl bg-gradient-to-br from-current to-transparent" />

                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl border-[0.5px] flex items-center justify-center shadow-inner transition-all duration-300 ${COLOR_MAP[color]}`}>
                      <Icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  </div>

                  <div className="relative z-10">
                    <p className="text-base font-bold tracking-tight text-slate-900 group-hover:text-slate-800 transition-colors leading-tight">{label}</p>
                    <p className="text-[13px] text-slate-500 font-medium mt-1.5">{count} courses</p>
                  </div>

                  {/* Bottom accent line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full ${COLOR_MAP[color].replace('bg-', 'bg-').split(' ')[0].replace('50', '400')}`} />
                </Link>
              </TiltCard>
            </FadeIn>
          ))}
        </div>

        {/* ── View all link ── */}
        <FadeIn delay={200} className="text-center mt-10">
          <Link
            to="/courses"
            className="group inline-flex items-center gap-2 px-8 py-3 rounded-full border border-slate-200 text-slate-900 text-sm font-medium bg-white hover:border-cyan-300 hover:text-cyan-700 hover:bg-cyan-50 transition-all duration-200 shadow-sm"
          >
            View all categories
            <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
