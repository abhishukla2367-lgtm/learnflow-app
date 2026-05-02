import { COURSES } from '../data/coursesData';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Play, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth, enrollmentKey } from '../context/AuthContext';

const TABS = ['All', 'In Progress', 'Completed', 'Not Started'];

function statusOf(p) {
  if (p === 100) return 'Completed';
  if (p > 0)     return 'In Progress';
  return 'Not Started';
}

const STATUS_STYLE = {
  'Completed':   'bg-emerald-100 text-emerald-700 border border-emerald-200',
  'In Progress': 'bg-amber-100 text-amber-700 border border-amber-200',
  'Not Started': 'bg-slate-100 text-slate-500 border border-slate-200',
};

/* ─── Canonical ID extractor ───────────────────────────────────
 * This is the single source of truth for "what is the unique ID
 * of this enrollment?" — used everywhere to prevent duplicates.
 * It checks every possible shape the object might have.
 * ─────────────────────────────────────────────────────────── */
function enrollmentId(e) {
  return String(
    e._id ||
    e.certId ||
    e.course?._id ||
    e.course?.id ||
    e.course ||
    ''
  );
}

/* ─── Dedup a flat array of enrollments by canonical ID ──────── */
function dedup(list) {
  const seen = new Set();
  return list.filter(e => {
    const id = enrollmentId(e);
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function CourseRow({ enrollment }) {
  const progress = enrollment.progress ?? 0;
  const course   = enrollment.course || {};
  const status   = statusOf(progress);
  const courseId = course._id || course.id || '';

  const model = enrollment.courseModel || '';
  const hasCertData = !!(enrollment.certData && enrollment.certData.title);

  const isStaticCourse = COURSES.some(
    c => String(c.id) === String(courseId) || String(c._id) === String(courseId)
  );

  const type = isStaticCourse
    ? 'course'
    : (model.toLowerCase() === 'certification' || hasCertData)
      ? 'certification'
      : 'course';

  const lastLesson = (() => {
    try {
      const progressKey = type === 'certification' ? 'lf_progress' : 'lf_course_progress';
      const all = JSON.parse(localStorage.getItem(progressKey) || '{}');
      return all[courseId]?.lastLesson || null;
    } catch { return null; }
  })();

  const playerLink = courseId
    ? `/learn/${type}/${courseId}${lastLesson ? `/${lastLesson}` : ''}`
    : `/learn/${type}/${courseId}`;

  const handleNavigate = () => {
    if (!courseId || !course) return;
    try {
      const globalCache = JSON.parse(localStorage.getItem('lf_course_cache') || '{}');
      if (!globalCache[courseId] && course.lessons?.length) {
        globalCache[courseId] = {
          ...course,
          isTrial: enrollment.isTrial,
          trialEndsAt: enrollment.trialEndsAt,
        };
        localStorage.setItem('lf_course_cache', JSON.stringify(globalCache));
      }
    } catch (e) {
      console.error('Cache prime failed', e);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row shadow-sm">
      <div className="relative sm:w-48 h-36 sm:h-auto bg-gradient-to-br from-cyan-400 to-violet-500 flex-shrink-0">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-60">
            {course.emoji || '📘'}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent sm:bg-gradient-to-r sm:from-black/20 sm:to-transparent" />
      </div>

      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3 className="font-black text-slate-900 text-base leading-snug line-clamp-2 font-sans">
              {course.title || 'Untitled Course'}
            </h3>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${STATUS_STYLE[status]}`}>
              {status}
            </span>
          </div>
          {course.instructor && (
            <p className="text-xs text-slate-500 font-sans mb-1">by {course.instructor}</p>
          )}
          {course.description && (
            <p className="text-xs text-slate-500 font-sans line-clamp-2 mt-1">{course.description}</p>
          )}
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-sans">Progress</span>
            <span className="font-bold text-cyan-600">{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-cyan-500 to-violet-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-end pt-1">
            <Link
              to={playerLink}
              onClick={handleNavigate}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-cyan-600 hover:text-cyan-700 transition-colors"
            >
              <Play size={13} />
              {status === 'Completed' ? 'Review' : status === 'In Progress' ? 'Continue' : 'Start Learning'}
              <ChevronRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyCourses() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [activeTab,   setActiveTab]   = useState('All');
  const [loading,     setLoading]     = useState(true);

  const lsKey = user ? enrollmentKey(user._id || user.id) : null;

  const getLocal = useCallback(() => {
    if (!lsKey) return [];
    try { return JSON.parse(localStorage.getItem(lsKey) || '[]'); }
    catch { return []; }
  }, [lsKey]);

  // Merge API + local, deduplicate using the shared enrollmentId helper
  const merge = useCallback((apiData, localData) => {
    const apiIds = new Set(apiData.map(enrollmentId).filter(Boolean));
    const localOnly = localData.filter(e => !apiIds.has(enrollmentId(e)));
    return dedup([...apiData, ...localOnly]);
  }, []);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const local = getLocal();
    if (local.length) setEnrollments(dedup(local));

    api.get('/enrollments')
      .then(res => {
        const apiData = Array.isArray(res.data) ? res.data : [];
        const merged  = merge(apiData, getLocal());
        setEnrollments(merged);

        if (lsKey) {
          localStorage.setItem(lsKey, JSON.stringify(merged));
        }

        try {
          const globalCache = JSON.parse(localStorage.getItem('lf_course_cache') || '{}');
          apiData.forEach(enrol => {
            const courseObj = enrol.course;
            if (courseObj && (courseObj._id || courseObj.id)) {
              const cid = courseObj._id || courseObj.id;
              globalCache[cid] = {
                ...courseObj,
                isTrial: enrol.isTrial,
                trialEndsAt: enrol.trialEndsAt,
              };
            }
          });
          localStorage.setItem('lf_course_cache', JSON.stringify(globalCache));
        } catch (e) {
          console.error('Cache sync failed', e);
        }
      })
      .catch(() => {
        setEnrollments(dedup(getLocal()));
      })
      .finally(() => setLoading(false));
  }, [user, lsKey, getLocal, merge]);

  useEffect(() => {
    const handler = (e) => {
      const entry = e.detail;
      setEnrollments(prev => {
        // Use the same enrollmentId extractor — no more weak/mismatched checks
        const incomingId = enrollmentId(entry);
        if (!incomingId) return prev;
        const exists = prev.some(p => enrollmentId(p) === incomingId);
        if (exists) return prev;
        // Dedup the whole list just to be safe (handles any race conditions)
        return dedup([entry, ...prev]);
      });
    };
    window.addEventListener('lf:enrollment:new', handler);
    return () => window.removeEventListener('lf:enrollment:new', handler);
  }, []);

  const filtered = enrollments.filter(e => {
    const p = e.progress ?? 0;
    if (activeTab === 'All')         return true;
    if (activeTab === 'Completed')   return p === 100;
    if (activeTab === 'In Progress') return p > 0 && p < 100;
    if (activeTab === 'Not Started') return p === 0;
    return true;
  });

  const counts = {
    'All':         enrollments.length,
    'In Progress': enrollments.filter(e => (e.progress ?? 0) > 0 && (e.progress ?? 0) < 100).length,
    'Completed':   enrollments.filter(e => (e.progress ?? 0) === 100).length,
    'Not Started': enrollments.filter(e => (e.progress ?? 0) === 0).length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-black text-slate-900 font-sans">My Courses</h1>
          <p className="text-sm text-slate-500 font-sans mt-1">Access your purchased certifications and track your learning progress</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Tabs */}
        <div className="flex gap-1.5 bg-white border border-slate-200 p-1 rounded-2xl w-fit shadow-sm overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap font-sans ${
                activeTab === tab
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${
                activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-9 h-9 border-[3px] border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-500 text-sm font-sans">Syncing your library…</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen size={32} className="text-slate-300" />
            </div>
            <h3 className="font-black text-slate-800 text-lg">
              {activeTab === 'All' ? 'Your library is empty' : `No ${activeTab.toLowerCase()} courses`}
            </h3>
            <p className="text-slate-400 text-sm font-sans mt-1 mb-8 max-w-xs mx-auto">
              {activeTab === 'All'
                ? 'Enroll in a certification to start building your professional skills.'
                : 'Try checking another tab to see your progress.'}
            </p>
            {activeTab === 'All' && (
              <Link to="/certifications" className="inline-flex items-center gap-2 bg-cyan-600 text-white text-sm font-bold px-8 py-3 rounded-xl hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-600/20">
                Explore Certifications
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(e => <CourseRow key={enrollmentId(e)} enrollment={e} />)}
          </div>
        )}
      </div>
    </div>
  );
}