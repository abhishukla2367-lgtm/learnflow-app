import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { COURSES } from '../../data/coursesData';
import {
  CheckCircle, Circle, ChevronLeft, ChevronRight, Menu,
  X, Trophy, ArrowLeft, Clock, PlayCircle, StickyNote,
  ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';
import api from '../../utils/api';

/* ─────────────────────────────────────────────
   localStorage helpers
───────────────────────────────────────────── */
function loadProgress(courseId) {
  try {
    const all = JSON.parse(localStorage.getItem('lf_course_progress') || '{}');
    return all[courseId] || { completedLessons: [], lastLesson: null };
  } catch {
    return { completedLessons: [], lastLesson: null };
  }
}

function saveProgress(courseId, data) {
  try {
    const all = JSON.parse(localStorage.getItem('lf_course_progress') || '{}');
    all[courseId] = data;
    localStorage.setItem('lf_course_progress', JSON.stringify(all));
  } catch (e) {
    console.error("Failed to save progress", e);
  }
}

function loadNotes(courseId, lessonId) {
  try {
    return JSON.parse(localStorage.getItem('lf_course_notes') || '{}')[`${courseId}-${lessonId}`] || '';
  } catch { return ''; }
}

function saveNote(courseId, lessonId, text) {
  try {
    const all = JSON.parse(localStorage.getItem('lf_course_notes') || '{}');
    all[`${courseId}-${lessonId}`] = text;
    localStorage.setItem('lf_course_notes', JSON.stringify(all));
  } catch {}
}

/* ─────────────────────────────────────────────
   Helpers & Normalisation
───────────────────────────────────────────── */
function lid(lesson) {
  return lesson?.id || lesson?._id || '';
}

function normaliseLessons(lessons = []) {
  if (!Array.isArray(lessons)) return [];
  return lessons.map((l, i) => ({
    ...l,
    id: String(l.id || l._id || i),
    weekLabel: l.weekLabel || `Section ${Math.floor(i / 5) + 1}`,
    duration: l.duration ? (typeof l.duration === 'number' ? `${l.duration} min` : l.duration) : '5 min',
    videoId: l.videoId || null,
    videoUrl: l.videoUrl || null,
  }));
}

function useResolveCourse(courseId) {
  const [apiFetched, setApiFetched] = useState(null);

  // Check static data and cache first
  const staticOrCached = (() => {
    if (!courseId) return null;

    const fromStatic = COURSES.find(
      (c) => String(c.id) === String(courseId) || String(c._id) === String(courseId)
    );
    if (fromStatic) return { ...fromStatic, lessons: normaliseLessons(fromStatic.lessons) };

    try {
      const cache = JSON.parse(localStorage.getItem('lf_course_cache') || '{}');
      const cached = cache[courseId];
      if (cached) return { ...cached, id: courseId, lessons: normaliseLessons(cached.lessons) };
    } catch (e) {
      console.error("Cache read error:", e);
    }

    return null;
  })();

  useEffect(() => {
    if (staticOrCached || apiFetched !== null) return;
    console.log('Fetching course from API:', courseId); 
    api.get(`/courses/${courseId}`)
      .then(res => {
        const fetched = res.data?.courseData || res.data;
        const cache = JSON.parse(localStorage.getItem('lf_course_cache') || '{}');
        cache[courseId] = fetched;
        localStorage.setItem('lf_course_cache', JSON.stringify(cache));
        setApiFetched(fetched);
      })
      .catch((err) => {
         console.error('Course fetch failed:', err);
        setApiFetched({})
   });
  }, [courseId]);

  if (staticOrCached) return staticOrCached;
  if (apiFetched?._id) return { ...apiFetched, lessons: normaliseLessons(apiFetched.lessons) };
  return null;
}

async function syncProgressToBackend(courseId, completedCount, totalCount) {
  try {
    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    await api.patch(`/enrollments/${courseId}/progress`, { progress: pct });
  } catch (err) {
    console.warn("Sync failed, progress saved locally only.");
  }
}

/* ═══════════════════════════════════════════
   COURSE PLAYER COMPONENT
═══════════════════════════════════════════ */
export default function CoursePlayer({ courseId: propId, lessonId: propLessonId }) {
  const { type, id: urlId, lessonId: urlLessonId } = useParams();
  const navigate = useNavigate();

  const courseId = propId || urlId;
  const currentLessonId = propLessonId || urlLessonId;

  // Data Resolution
  const courseData = useResolveCourse(courseId);
  const lessons = courseData?.lessons || [];
  
  const lessonIdx = currentLessonId
    ? lessons.findIndex((l) => String(lid(l)) === String(currentLessonId))
    : 0;
  
  const lesson = lessons[lessonIdx === -1 ? 0 : lessonIdx];

  // States
  const [progress, setProgress] = useState({ completedLessons: [], lastLesson: null });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notesOpen, setNotesOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [justCompleted, setJustCompleted] = useState(false);
  const videoRef = useRef(null);

  // Sync state when courseData/lesson loads
  useEffect(() => {
    if (!courseData || !lesson) return;
    
    const currentLid = String(lid(lesson));
    const p = loadProgress(courseId);
    setProgress(p);
    setNoteText(loadNotes(courseId, currentLid));
    
    if (lesson.weekLabel) {
      setExpandedWeeks((prev) => ({ ...prev, [lesson.weekLabel]: true }));
    }
    
    const updated = { ...p, lastLesson: currentLid };
    saveProgress(courseId, updated);
  }, [courseId, currentLessonId, lesson]);

  const isCompleted = useCallback(
    (id) => progress.completedLessons?.includes(String(id)),
    [progress]
  );

  const markComplete = () => {
    if (!lesson) return;
    const currentLid = String(lid(lesson));
    const already = isCompleted(currentLid);
    
    const updatedList = already
      ? progress.completedLessons
      : [...(progress.completedLessons || []), currentLid];

    const updated = { ...progress, completedLessons: updatedList, lastLesson: currentLid };
    saveProgress(courseId, updated);
    setProgress(updated);
    setJustCompleted(true);

    syncProgressToBackend(courseId, updatedList.length, lessons.length);

    setTimeout(() => {
      setJustCompleted(false);
      const next = lessons[lessonIdx + 1];
      if (next) {
        navigate(`/learn/${type || 'courseData'}/${courseId}/${lid(next)}`);
      }
    }, 1200);
  };

  const saveNoteHandler = () => {
    if (!lesson) return;
    saveNote(courseId, lid(lesson), noteText);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  // Error/Loading State
  if (!courseData || !lesson) {
    return (
      <div className="flex flex-col h-screen bg-slate-900 items-center justify-center text-white p-6 text-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-bold mb-2">Loading Course Content...</h2>
        <button onClick={() => navigate('/my-courses')} className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300">
           <ArrowLeft className="w-4 h-4" /> Back to My Courses
        </button>
      </div>
    );
  }

  const completedCount = progress.completedLessons?.length || 0;
  const pct = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;
  const allDone = completedCount >= lessons.length && lessons.length > 0;

  const weekGroups = lessons.reduce((acc, l) => {
    const key = l.weekLabel;
    if (!acc[key]) acc[key] = [];
    acc[key].push(l);
    return acc;
  }, {});

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} flex-shrink-0 bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 overflow-hidden`}>
        <div className="p-4 border-b border-slate-700 flex-shrink-0">
          <button onClick={() => navigate('/my-courses')} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-mono mb-3 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> My Learning
          </button>
          <h2 className="text-sm font-bold text-white leading-tight line-clamp-2">{courseData.title}</h2>
          <div className="mt-3">
            <div className="flex justify-between mb-1 font-mono text-[10px]">
              <span className="text-slate-400 uppercase tracking-tighter">{completedCount}/{lessons.length} Lessons</span>
              <span className="text-white font-bold">{pct}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div className={`h-1.5 rounded-full bg-gradient-to-r ${courseData.gradient || 'from-cyan-500 to-blue-500'} transition-all duration-500`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
          {Object.entries(weekGroups).map(([week, sectionLessons]) => (
            <div key={week} className="mb-1">
              <button onClick={() => setExpandedWeeks(p => ({ ...p, [week]: !p[week] }))} className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-300 transition-colors bg-slate-800/50">
                <span>{week}</span>
                {expandedWeeks[week] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              {expandedWeeks[week] && sectionLessons.map((l) => (
                <button 
                    key={lid(l)} 
                    onClick={() => navigate(`/learn/${type || 'courseData'}/${courseId}/${lid(l)}`)} 
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-all ${String(lid(l)) === String(lid(lesson)) ? 'bg-slate-700/80 border-l-2 border-cyan-500' : 'hover:bg-slate-700/30 border-l-2 border-transparent'}`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {isCompleted(lid(l)) ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : String(lid(l)) === String(lid(lesson)) ? <PlayCircle className="w-4 h-4 text-cyan-400" /> : <Circle className="w-4 h-4 text-slate-600" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs leading-snug font-medium line-clamp-2 ${String(lid(l)) === String(lid(lesson)) ? 'text-white' : 'text-slate-400'}`}>{l.title}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {l.duration}</p>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-900">
        <header className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700/50 px-4 py-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(v => !v)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all"><Menu className="w-4 h-4" /></button>
            <div className="hidden md:block">
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">{courseData.emoji} {courseData.title}</p>
              <p className="text-sm font-bold text-white truncate max-w-xs">{lesson.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setNotesOpen(v => !v)} className={`p-2 rounded-lg transition-all flex items-center gap-1.5 ${notesOpen ? 'bg-cyan-600/20 text-cyan-400' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
              <StickyNote className="w-4 h-4" /><span className="hidden sm:block text-xs font-bold">Notes</span>
            </button>
            <div className="h-4 w-[1px] bg-slate-700 mx-1" />
            <button onClick={() => { const p = lessons[lessonIdx - 1]; if (p) navigate(`/learn/${type || 'courseData'}/${courseId}/${lid(p)}`); }} disabled={lessonIdx === 0} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-20 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => { const n = lessons[lessonIdx + 1]; if (n) navigate(`/learn/${type || 'courseData'}/${courseId}/${lid(n)}`); }} disabled={lessonIdx === lessons.length - 1} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-20 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
            <div className="relative w-full bg-black aspect-video shadow-2xl">
              {lesson.videoId ? (
                <iframe src={`https://www.youtube.com/embed/${lesson.videoId}?rel=0&modestbranding=1&color=white&autoplay=1`} className="absolute inset-0 w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
              ) : lesson.videoUrl ? (
                <video ref={videoRef} src={lesson.videoUrl} controls autoPlay onEnded={markComplete} className="absolute inset-0 w-full h-full object-contain" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 gap-4 bg-slate-900">
                  <PlayCircle className="w-20 h-20 opacity-10 animate-pulse" />
                  <p className="text-sm font-mono uppercase tracking-widest text-slate-500">No video for this module</p>
                  <button onClick={markComplete} className="px-6 py-2.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-900/20">Mark as Read & Continue</button>
                </div>
              )}
            </div>

            <div className="max-w-5xl mx-auto px-6 py-8">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-tighter">{lesson.weekLabel}</span>
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 uppercase"><Clock className="w-3 h-3" /> {lesson.duration}</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-4 tracking-tight">{lesson.title}</h1>
                  <div className="prose prose-invert max-w-none prose-sm text-slate-400 leading-relaxed">
                    {lesson.description || "In this lesson, we'll cover the core concepts of this module. Follow along with the video and take notes as needed."}
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  {isCompleted(lid(lesson)) ? (
                    <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-sm shadow-sm">
                      <CheckCircle className="w-5 h-5" /> Lesson Completed
                    </div>
                  ) : (
                    <button onClick={markComplete} className={`group flex items-center gap-3 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-[0.95] shadow-xl ${justCompleted ? 'bg-emerald-500 text-white' : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/20'}`}>
                      {justCompleted ? <><CheckCircle className="w-5 h-5 animate-bounce" /> Processing...</> : <><CheckCircle className="w-5 h-5 transition-transform group-hover:scale-110" /> Mark Complete</>}
                    </button>
                  )}
                </div>
              </div>

              {allDone && (
                <div className="mt-12 p-10 bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
                  <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]" />
                  <h3 className="text-3xl font-black text-white mb-3 tracking-tight">Course Completed! 🎉</h3>
                  <p className="text-slate-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">You've finished all the modules. Ready to test your knowledge and earn your certificate?</p>
                  <button onClick={() => navigate(`/courseData-quiz/${courseId}`)} className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-900/30 transition-all hover:-translate-y-1 active:scale-95">Take Final Quiz</button>
                </div>
              )}
            </div>
          </div>

          {/* NOTES PANEL */}
          {notesOpen && (
            <div className="w-80 flex-shrink-0 bg-slate-800 border-l border-slate-700 flex flex-col animate-in slide-in-from-right duration-300">
              <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2"><StickyNote className="w-4 h-4 text-amber-400" /> Lesson Notes</h3>
                <button onClick={() => setNotesOpen(false)} className="p-1 hover:bg-slate-700 rounded-md transition-colors"><X className="w-4 h-4 text-slate-400" /></button>
              </div>
              <div className="flex-1 p-5 flex flex-col gap-4">
                <p className="text-[10px] text-slate-500 font-medium">Notes are saved automatically to your browser for this specific lesson.</p>
                <textarea 
                  value={noteText} 
                  onChange={(e) => { setNoteText(e.target.value); setNoteSaved(false); }} 
                  placeholder="Summarize key points, timestamps, or code snippets..." 
                  className="flex-1 bg-slate-900/50 border border-slate-700 rounded-2xl p-4 text-sm text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder:text-slate-700" 
                />
                <button 
                  onClick={saveNoteHandler} 
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg ${noteSaved ? 'bg-emerald-600 text-white shadow-emerald-900/20' : 'bg-slate-700 hover:bg-slate-600 text-white shadow-black/20'}`}
                >
                  {noteSaved ? '✓ Saved Successfully' : 'Save Notes'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}