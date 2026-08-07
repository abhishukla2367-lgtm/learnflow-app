import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Flame } from 'lucide-react';
import { FadeIn } from '../ui/FadeIn';
import CourseCard from '../CourseCard';
import { FEATURED_COURSES } from '../../data/homeData';
import api from '../../utils/api';

export default function FeaturedCoursesSection() {
  const scrollRef = useRef(null);
  const [, setCanScrollLeft] = useState(false);
  const [, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [courses, setCourses] = useState(FEATURED_COURSES); // fallback to static

  useEffect(() => {
    let isMounted = true;
    
    api.get('/courses/featured')
      .then((res) => {
        // Support both { success: true, courses: [...] } and raw array responses
        const data = res.data?.courses || res.data;
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setCourses(data);
        }
      })
      .catch(() => {
        // Silently fall back to static data if backend/network fails
      });

    return () => { isMounted = false; };
  }, []);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    const cardWidth = 288 + 16; // w-72 (288px) + gap-4 (16px)
    setActiveIndex(Math.round(el.scrollLeft / cardWidth));
  };

  return (
    <section className="py-24 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <FadeIn className="flex items-end justify-between mb-12">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-mono bg-orange-50 text-orange-600 border border-orange-200 mb-4 shadow-sm">
              <Flame className="w-3 h-3" /> Featured
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              Top courses this week
            </h2>
            <p className="text-slate-500 text-sm mt-2">Handpicked by our expert curriculum team</p>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/courses"
              className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-cyan-700 text-sm font-semibold hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
            >
              View all
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </FadeIn>

        {/* ── Desktop: standard grid ── */}
        <div className="hidden lg:grid grid-cols-4 gap-5 items-stretch">
          {courses.map((c, i) => (
            <FadeIn key={c._id || c.id || i} delay={i * 80} className="h-full">
              <CourseCard course={c} />
            </FadeIn>
          ))}
        </div>

        {/* ── Mobile/tablet: horizontal scroll ── */}
        <div className="lg:hidden relative">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div
            ref={scrollRef}
            onScroll={onScroll}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {courses.map((c, i) => (
              <div key={c._id || c.id || i} className="flex-shrink-0 w-72 snap-start">
                <CourseCard course={c} />
              </div>
            ))}
          </div>

          {/* Mobile scroll dots */}
          <div className="flex justify-center gap-1.5 mt-4">
            {courses.map((c, i) => (
              <div
                key={c._id || c.id || i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex ? 'w-6 bg-cyan-500' : 'w-1.5 bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── Mobile view all ── */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border border-slate-200 text-slate-900 font-semibold text-sm bg-white hover:border-cyan-300 hover:bg-cyan-50 transition-all duration-200 shadow-sm"
          >
            View all courses
          </Link>
        </div>
      </div>
    </section>
  );
}