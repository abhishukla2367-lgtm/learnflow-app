import { useState, useEffect, useCallback } from 'react';
import { Star, MapPin, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { FadeIn } from '../ui/FadeIn';
import { TESTIMONIALS } from '../../data/homeData';

const AVATAR_COLORS = [
  'from-cyan-500 to-violet-500',
  'from-violet-500 to-pink-500',
  'from-emerald-500 to-cyan-500',
];

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState('right');

  const goTo = useCallback((idx, dir = 'right') => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setActive(idx);
      setAnimating(false);
    }, 280);
  }, [animating]);

  const prev = () => goTo((active - 1 + TESTIMONIALS.length) % TESTIMONIALS.length, 'left');
  const next = () => goTo((active + 1) % TESTIMONIALS.length, 'right');

  /* Auto-advance */
  useEffect(() => {
    const t = setInterval(() => {
      goTo((active + 1) % TESTIMONIALS.length, 'right');
    }, 5500);
    return () => clearInterval(t);
  }, [active, goTo]);

  const t = TESTIMONIALS[active];

  return (
    <section className="py-24 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <FadeIn className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-mono bg-amber-50 text-amber-700 border border-amber-200 mb-4 shadow-sm">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-3">
            Learners who made it
          </h2>
          <p className="text-slate-500 text-base leading-relaxed max-w-lg mx-auto">
            Real stories from real learners across India — from Tier 1 cities to Tier 3 towns.
          </p>
        </FadeIn>

        {/* ── Desktop: all 3 cards ── */}
        <div className="hidden md:grid grid-cols-3 gap-5">
          {TESTIMONIALS.map(({ name, role, text, avatar, rating, city }, i) => (
            <FadeIn key={name} delay={i * 80}>
              <div
                className={`relative bg-white border rounded-2xl p-7 flex flex-col gap-5 shadow-sm transition-all duration-300 h-full cursor-pointer group
                  ${i === active
                    ? 'border-cyan-200 shadow-lg shadow-cyan-100/60 -translate-y-1'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5'
                  }`}
                onClick={() => goTo(i, i > active ? 'right' : 'left')}
              >
                {/* Quote icon */}
                <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote className="w-10 h-10 text-cyan-600" fill="currentColor" />
                </div>

                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <p className="text-sm text-slate-600 leading-relaxed flex-1 relative z-10">"{text}"</p>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[i]} flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-sm`}>
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{name}</p>
                    <p className="text-xs text-slate-500">{role}</p>
                    <p className="text-xs text-cyan-600 font-mono mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{city}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* ── Mobile: single card carousel ── */}
        <div className="md:hidden">
          <div className="relative overflow-hidden rounded-2xl">
            <div
              className={`transition-all duration-280 ease-out ${
                animating
                  ? direction === 'right' ? '-translate-x-8 opacity-0' : 'translate-x-8 opacity-0'
                  : 'translate-x-0 opacity-100'
              }`}
            >
              <div className="relative bg-white border border-cyan-200 rounded-2xl p-7 shadow-lg shadow-cyan-100/40">
                <div className="absolute top-6 right-6 opacity-10">
                  <Quote className="w-10 h-10 text-cyan-600" fill="currentColor" />
                </div>

                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <p className="text-sm text-slate-600 leading-relaxed mb-6">"{t.text}"</p>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[active]} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                    <p className="text-xs text-cyan-600 font-mono mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{t.city}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={prev} className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-cyan-700 hover:border-cyan-300 hover:bg-cyan-50 transition-all duration-200">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > active ? 'right' : 'left')}
                  className={`rounded-full transition-all duration-300 ${i === active ? 'w-6 h-2 bg-cyan-500' : 'w-2 h-2 bg-slate-200 hover:bg-slate-300'}`}
                />
              ))}
            </div>
            <button onClick={next} className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-cyan-700 hover:border-cyan-300 hover:bg-cyan-50 transition-all duration-200">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Rating summary strip ── */}
        <FadeIn delay={150} className="mt-12">
          <div className="flex flex-wrap items-center justify-center gap-8 py-6 px-8 bg-gradient-to-r from-slate-50 via-white to-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
              </div>
              <span className="text-sm font-bold text-slate-900">4.7 / 5</span>
              <span className="text-xs text-slate-400 font-mono">avg rating</span>
            </div>
            <div className="w-px h-6 bg-slate-200 hidden sm:block" />
            <div className="text-sm text-slate-600">
              Based on <span className="font-bold text-slate-900">8,200+</span> verified reviews
            </div>
            <div className="w-px h-6 bg-slate-200 hidden sm:block" />
            <div className="text-sm text-slate-600">
              <span className="font-bold text-slate-900">98%</span> would recommend Learnodays
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
