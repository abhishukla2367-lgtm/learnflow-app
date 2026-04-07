import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Loader2, BookOpen } from 'lucide-react';
import api from '../api/axiosConfig';
import CourseCard from '../components/CourseCard';

const CATEGORIES   = ['All', 'Marketing', 'Web Development', 'AI / Machine Learning', 'Design', 'Data Science', 'Cloud Computing', 'Cybersecurity', 'DSA'];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating',  label: 'Top Rated'    },
  { value: 'newest',  label: 'Newest'        },
];

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [courses,     setCourses]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [total,       setTotal]       = useState(0);
  const [page,        setPage]        = useState(1);
  const [pages,       setPages]       = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // ── Filter state — initialised from URL on first render ──
  const [search,     setSearch]     = useState(searchParams.get('search')   || '');
  const [category,   setCategory]   = useState(decodeURIComponent(searchParams.get('category') || '') || 'All');
  const [difficulty, setDifficulty] = useState('All');
  const [sort,       setSort]       = useState('popular');
  const [freeOnly,   setFreeOnly]   = useState(false);

  // ── Sync category (and page) whenever the URL ?category param changes ──
  // This handles: clicking a header nav link while already on /courses
  useEffect(() => {
    const cat = searchParams.get('category');
    const decoded = cat ? decodeURIComponent(cat) : 'All';
    setCategory(decoded);
    setPage(1); // ← always reset to page 1 when category changes via URL
  }, [searchParams]);

  // ── Fetch ─────────────────────────────────────────────────────────────
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12, sort });
      if (search)            params.set('search',     search);
      if (category !== 'All') params.set('category',  category);
      if (difficulty !== 'All') params.set('difficulty', difficulty);
      if (freeOnly)          params.set('free',       'true');

      const { data } = await api.get(`/courses?${params}`);
      setCourses(data.courses || []);
      setTotal(data.total     || 0);
      setPages(data.pages     || 1);
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, difficulty, sort, freeOnly]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  // ── Helpers ───────────────────────────────────────────────────────────
  const resetFilters = () => {
    setSearch('');
    setCategory('All');
    setDifficulty('All');
    setSort('popular');
    setFreeOnly(false);
    setPage(1);
    setSearchParams({});
  };

  // When the user manually picks a category inside the filter panel,
  // also keep the URL in sync so browser back/forward works correctly
  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
    if (cat === 'All') {
      setSearchParams(prev => { prev.delete('category'); return prev; });
    } else {
      setSearchParams(prev => { prev.set('category', cat); return prev; });
    }
  };

  const hasFilters = search || category !== 'All' || difficulty !== 'All' || freeOnly;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-white border-b border-slate-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 text-indigo-600">
            {category !== 'All' ? category : 'All Courses'}
          </h1>
          <p className="text-slate-500 text-lg font-medium">
            {category !== 'All'
              ? `Showing courses in "${category}"`
              : 'Browse our full library of expert-led courses.'}
          </p>

          {/* Search */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, instructor, or skill..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all border shadow-sm ${
                showFilters
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal size={16} />
              Filters
              {hasFilters && <div className="ml-1 w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900">Filter & Sort</h3>
              {hasFilters && (
                <button onClick={resetFilters} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1 font-medium">
                  <X size={14} /> Clear all
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Category</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      onClick={() => handleCategoryChange(c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        category === c ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Difficulty</p>
                <div className="flex flex-wrap gap-2">
                  {DIFFICULTIES.map(d => (
                    <button
                      key={d}
                      onClick={() => { setDifficulty(d); setPage(1); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        difficulty === d ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Sort By</p>
                <select
                  value={sort}
                  onChange={e => { setSort(e.target.value); setPage(1); }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-indigo-400 bg-white"
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Price</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={freeOnly}
                    onChange={e => { setFreeOnly(e.target.checked); setPage(1); }}
                    className="w-4 h-4 rounded accent-indigo-600"
                  />
                  <span className="text-sm font-semibold text-slate-700">Free courses only</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Results bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">
            {loading
              ? 'Loading…'
              : <><span className="font-bold text-slate-900">{total}</span> courses found</>
            }
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={36} className="animate-spin text-indigo-500" />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen size={48} className="text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No courses found</h3>
            <p className="text-slate-500 mb-6">Try adjusting your filters.</p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map(course => <CourseCard key={course._id} course={course} />)}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-all"
            >
              Previous
            </button>
            {[...Array(Math.min(pages, 7))].map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                    page === p ? 'bg-indigo-600 text-white shadow-md' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}