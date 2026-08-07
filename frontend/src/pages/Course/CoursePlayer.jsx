import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { COURSES } from '../../data/coursesData';
import {
  CheckCircle, Circle, ChevronLeft, ChevronRight, Menu,
  X, Trophy, ArrowLeft, Clock, PlayCircle, StickyNote,
  ChevronDown, ChevronUp, Award
} from 'lucide-react';
import api from '../../utils/api';

/* ── YouTube ID Extractor Helper ── */
function extractYouTubeId(urlOrId) {
  if (!urlOrId || typeof urlOrId !== 'string') return null;
  
  // If it's already a raw 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId.trim())) {
    return urlOrId.trim();
  }
  
  // Regex for standard YouTube URLs, shortlinks, embeds
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = urlOrId.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

/* ── localStorage helpers ── */
function loadProgress(id) {
  try {
    return JSON.parse(localStorage.getItem('lf_progress') || '{}')[id] || { completedLessons: [], lastLesson: null };
  } catch { return { completedLessons: [], lastLesson: null }; }
}

function saveProgress(id, data) {
  try {
    const all = JSON.parse(localStorage.getItem('lf_progress') || '{}');
    all[id] = data;
    localStorage.setItem('lf_progress', JSON.stringify(all));
  } catch {}
}

function loadNotes(id, lessonId) {
  try {
    return JSON.parse(localStorage.getItem('lf_notes') || '{}')[`${id}-${lessonId}`] || '';
  } catch { return ''; }
}

function saveNote(id, lessonId, text) {
  try {
    const all = JSON.parse(localStorage.getItem('lf_notes') || '{}');
    all[`${id}-${lessonId}`] = text;
    localStorage.setItem('lf_notes', JSON.stringify(all));
  } catch {}
}

function loadQuizStatus(id) {
  try {
    return JSON.parse(localStorage.getItem('lf_quiz') || '{}')[id] || null;
  } catch { return null; }
}

function lid(lesson) {
  return String(lesson?.id || lesson?._id || '');
}

function normaliseLessons(lessons = []) {
  if (!Array.isArray(lessons)) return [];
  return lessons.map((l, i) => {
    // Extract video string/object variations across all possible backend schemas
    const rawVideo = l.videoId || l.youtubeId || l.video || l.videoUrl || l.video_url || l.video_id || l.url || l.embedUrl || (l.video && typeof l.video === 'object' ? l.video.url : null);
    
    const ytId = extractYouTubeId(rawVideo);
    
    return {
      ...l,
      id: String(l.id || l._id || i),
      title: l.title || l.name || l.lessonTitle || `Lesson ${i + 1}`,
      weekLabel: l.weekLabel || l.sectionTitle || l.moduleTitle || `Section ${Math.floor(i / 5) + 1}`,
      duration: l.duration ? (typeof l.duration === 'number' ? `${l.duration} min` : l.duration) : '10 min',
      videoId: ytId,
      videoUrl: !ytId && typeof rawVideo === 'string' ? rawVideo : null,
    };
  });
}

function extractLessonsFromCourse(fetched) {
  if (!fetched) return [];
  
  if (Array.isArray(fetched.lessons) && fetched.lessons.length > 0) {
    return fetched.lessons;
  }
  
  const containers = fetched.curriculum || fetched.modules || fetched.sections || fetched.chapters || fetched.syllabus;
  
  if (Array.isArray(containers)) {
    return containers.flatMap((group, idx) => {
      const groupTitle = group.title || group.name || group.sectionTitle || `Section ${idx + 1}`;
      const groupLessons = group.lessons || group.items || group.topics || [];
      return groupLessons.map((lesson) => ({
        ...lesson,
        weekLabel: lesson.weekLabel || groupTitle,
      }));
    });
  }
  
  return [];
}

/* ── Enhanced Hook Supporting both Courses & Certifications ── */
function useResolveCourse(courseId, isCertification) { 
  const [resolvedCourse, setResolvedCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    // 1. Check local cache
    try {
      const cache = JSON.parse(localStorage.getItem('lf_course_cache') || '{}');
      const cached = cache[courseId];
      if (cached?.lessons?.length) {
        if (isMounted) {
          setResolvedCourse({ ...cached, id: courseId, lessons: normaliseLessons(cached.lessons) });
          setLoading(false);
        }
        return;
      }
    } catch (e) { console.error('Cache read error:', e); }

    // 2. Check static data
    const fromStatic = COURSES.find(
      (c) => String(c.id) === String(courseId) || String(c._id) === String(courseId)
    );
    if (fromStatic?.lessons?.length > 1 || (fromStatic?.lessons?.length === 1 && (fromStatic.lessons[0].videoId || fromStatic.lessons[0].videoUrl || fromStatic.lessons[0].video))) {
      if (isMounted) {
        setResolvedCourse({ ...fromStatic, lessons: normaliseLessons(fromStatic.lessons) });
        setLoading(false);
      }
      return;
    }

    // 3. API Fetch Strategy
    const fetchCourseData = async () => {
      try {
        let fetchedData = null;
        
        // Dynamically choose endpoint based on route context
        const endpoints = isCertification 
          ? [`/certifications/${courseId}`, `/courses/${courseId}`, `/enrollments/${courseId}/detail`]
          : [`/courses/${courseId}`, `/certifications/${courseId}`, `/enrollments/${courseId}/detail`];

        for (const endpoint of endpoints) {
          try {
            const res = await api.get(endpoint);
            fetchedData = res.data?.certification || res.data?.course || res.data;
            const lessons = extractLessonsFromCourse(fetchedData);
            if (lessons.length > 0) break;
          } catch (err) {
            // keep trying next endpoint
          }
        }

        let extractedLessons = extractLessonsFromCourse(fetchedData);

        if (isMounted) {
          if (fetchedData && extractedLessons.length) {
            const resolved = {
              ...fetchedData,
              id: courseId,
              lessons: normaliseLessons(extractedLessons)
            };
            try {
              const cache = JSON.parse(localStorage.getItem('lf_course_cache') || '{}');
              cache[courseId] = resolved;
              localStorage.setItem('lf_course_cache', JSON.stringify(cache));
            } catch {}
            setResolvedCourse(resolved);
          } else {
            setResolvedCourse(null);
          }
        }
      } catch (err) {
        console.error("Course/Certification Fetch Error:", err);
        if (isMounted) setResolvedCourse(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCourseData();

    return () => { isMounted = false; };
  }, [courseId, isCertification]);

  return { course: resolvedCourse, loading };
}

async function syncProgressToBackend(courseId, completedCount, totalCount) {
  try {
    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    await api.patch(`/enrollments/${courseId}/progress`, { progress: pct });
  } catch {}
}

export default function CoursePlayer({ courseId: propId, lessonId: propLessonId }) {
  const { id: paramId, lessonId: paramLessonId } = useParams();
  const location = useLocation();
  const id = propId || paramId;
  const lessonId = propLessonId || paramLessonId;
  const navigate = useNavigate();

  // Detect route type dynamically (/learn/certification vs /learn/course)
  const isCertRoute = location.pathname.includes('/learn/certification');
  const basePath = isCertRoute ? `/learn/certification/${id}` : `/learn/course/${id}`;

  const { course, loading: courseLoading } = useResolveCourse(id, isCertRoute); 
  const lessons = course?.lessons || [];

  const lessonIdx = lessonId ? lessons.findIndex((l) => lid(l) === String(lessonId)) : 0;
  const lesson = lessons[lessonIdx === -1 ? 0 : lessonIdx];

  const [progress, setProgress] = useState(() => loadProgress(id));
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notesOpen, setNotesOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [justCompleted, setJustCompleted] = useState(false);

  const videoRef = useRef(null);
  const completionRef = useRef(null);
  const navTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!id || !lesson) return;

    const currentLid = lid(lesson);
    const p = loadProgress(id);
    setProgress(p);

    setNoteText(loadNotes(id, currentLid));
    setNoteSaved(false);
    setJustCompleted(false);

    if (lesson.weekLabel) {
      setExpandedWeeks((prev) => ({ ...prev, [lesson.weekLabel]: true }));
    }

    const updated = { ...p, lastLesson: currentLid };
    saveProgress(id, updated);
  }, [id, lessonId, lesson]);

  const completedCount = progress.completedLessons?.length || 0;
  const allDone = completedCount >= lessons.length && lessons.length > 0;

  useEffect(() => {
    if (allDone && completionRef.current) {
      const scrollTimer = setTimeout(() => {
        completionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 600);
      return () => clearTimeout(scrollTimer);
    }
  }, [allDone]);

  const isCompleted = useCallback(
    (lId) => progress.completedLessons?.includes(String(lId)),
    [progress]
  );

  const markComplete = () => {
    if (!lesson) return;
    const currentLid = lid(lesson);
    const already = isCompleted(currentLid);
    const updatedList = already ? progress.completedLessons : [...(progress.completedLessons || []), currentLid];

    const updated = { ...progress, completedLessons: updatedList, lastLesson: currentLid };
    saveProgress(id, updated);
    setProgress(updated);
    setJustCompleted(true);

    syncProgressToBackend(id, updatedList.length, lessons.length);

    if (navTimerRef.current) clearTimeout(navTimerRef.current);
    navTimerRef.current = setTimeout(() => {
      setJustCompleted(false);
      const next = lessons[lessonIdx + 1];
      if (next) navigate(`${basePath}/${lid(next)}`);
    }, 1200);
  };

  const handleVideoEnded = () => { if (!isCompleted(lid(lesson))) markComplete(); };

  const saveNoteHandler = () => {
    if (!lesson) return;
    saveNote(id, lid(lesson), noteText);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  if (courseLoading || !course || !lesson) {
    return (
      <div className="flex flex-col h-screen bg-slate-900 items-center justify-center text-white p-6 text-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-bold mb-2">Loading Certification Content...</h2>
        <button onClick={() => navigate('/my-courses')} className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300">
          <ArrowLeft className="w-4 h-4" /> Back to My Learning
        </button>
      </div>
    );
  }

  const trialEndDate = course.trialEndsAt ? new Date(course.trialEndsAt) : null;
  const expired = course.isTrial && trialEndDate && new Date() > trialEndDate;

  if (expired) {
    return (
      <div className="flex h-screen bg-slate-900 items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 p-8 rounded-3xl text-center shadow-2xl">
          <Clock className="w-12 h-12 text-amber-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Trial Expired</h2>
          <p className="text-slate-400 mb-8 text-sm">Upgrade to full access to continue learning.</p>
          <button onClick={() => navigate(`/checkout/${id}`)} className="w-full py-4 bg-cyan-600 text-white font-bold rounded-xl">Upgrade Now</button>
        </div>
      </div>
    );
  }

  const pct = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  const weekGroups = lessons.reduce((acc, l) => {
    const key = l.weekLabel;
    if (!acc[key]) acc[key] = [];
    acc[key].push(l);
    return acc;
  }, {});

  const quizData = loadQuizStatus(id);
  const hasPassed = quizData?.passed === true;

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} flex-shrink-0 bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 overflow-hidden`}>
        <div className="p-4 border-b border-slate-700 flex-shrink-0">
          <button onClick={() => navigate('/my-courses')} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-3 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> My Learning
          </button>
          <h2 className="text-sm font-bold text-white leading-tight line-clamp-2">{course.title}</h2>
          <div className="mt-3">
            <div className="flex justify-between mb-1 text-[10px]">
              <span className="text-slate-400">{completedCount}/{lessons.length} Lessons</span>
              <span className="text-white font-bold">{pct}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div className={`h-1.5 rounded-full bg-gradient-to-r ${course.gradient || 'from-cyan-500 to-blue-500'} transition-all duration-500`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {Object.entries(weekGroups).map(([week, sectionLessons]) => (
            <div key={week} className="mb-1">
              <button onClick={() => setExpandedWeeks(p => ({ ...p, [week]: !p[week] }))} className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-300 transition-colors">
                <span>{week}</span>
                {expandedWeeks[week] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              {expandedWeeks[week] && sectionLessons.map((l) => (
                <button
                  key={lid(l)}
                  onClick={() => navigate(`${basePath}/${lid(l)}`)}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-all ${lid(l) === lid(lesson) ? 'bg-slate-700/80 border-l-2 border-cyan-500' : 'hover:bg-slate-700/30 border-l-2 border-transparent'}`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {isCompleted(lid(l)) ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : lid(l) === lid(lesson) ? <PlayCircle className="w-4 h-4 text-cyan-400" /> : <Circle className="w-4 h-4 text-slate-600" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs leading-snug font-medium line-clamp-2 ${lid(l) === lid(lesson) ? 'text-white' : 'text-slate-400'}`}>{l.title}</p>
                    <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {l.duration}</p>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700/50 px-4 py-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(v => !v)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
              <Menu className="w-4 h-4" />
            </button>
            <div className="hidden md:block">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">{course.emoji} {course.title}</p>
              <p className="text-sm font-bold text-white truncate max-w-xs">{lesson.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setNotesOpen(v => !v)} className={`p-2 rounded-lg transition-all flex items-center gap-1.5 ${notesOpen ? 'bg-cyan-600/20 text-cyan-400' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
              <StickyNote className="w-4 h-4" /><span className="hidden sm:block text-xs font-bold">Notes</span>
            </button>
            <div className="h-4 w-[1px] bg-slate-700 mx-1" />
            <button onClick={() => { const p = lessons[lessonIdx - 1]; if (p) navigate(`${basePath}/${lid(p)}`); }} disabled={lessonIdx === 0} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-20 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => { const n = lessons[lessonIdx + 1]; if (n) navigate(`${basePath}/${lid(n)}`); }} disabled={lessonIdx === lessons.length - 1} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-20 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="relative w-full bg-black aspect-video shadow-2xl force-magnifier">
              {lesson.videoId ? (
                <iframe src={`https://www.youtube.com/embed/${lesson.videoId}?rel=0&modestbranding=1&autoplay=0`} className="absolute inset-0 w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
              ) : lesson.videoUrl ? (
                <video ref={videoRef} src={lesson.videoUrl} controls onEnded={handleVideoEnded} className="absolute inset-0 w-full h-full object-contain" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 gap-4 bg-slate-900">
                  <PlayCircle className="w-20 h-20 opacity-10 animate-pulse" />
                  <p className="text-sm uppercase tracking-widest text-slate-500">No video for this module</p>
                  <button onClick={markComplete} className="px-6 py-2.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all">Mark as Read & Continue</button>
                </div>
              )}
            </div>

            <div className="max-w-5xl mx-auto px-6 py-8">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase">{lesson.weekLabel}</span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {lesson.duration}</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-4 tracking-tight">{lesson.title}</h1>
                  <div className="text-sm text-slate-400 leading-relaxed">
                    {lesson.description || "In this lesson, we'll cover the core concepts of this module."}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {isCompleted(lid(lesson)) ? (
                    <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-sm">
                      <CheckCircle className="w-5 h-5" /> Lesson Completed
                    </div>
                  ) : (
                    <button onClick={markComplete} className={`group flex items-center gap-3 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-[0.95] shadow-xl ${justCompleted ? 'bg-emerald-500 text-white' : 'bg-cyan-600 hover:bg-cyan-500 text-white'}`}>
                      {justCompleted ? <><CheckCircle className="w-5 h-5 animate-bounce" /> Processing...</> : <><CheckCircle className="w-5 h-5" /> Mark Complete</>}
                    </button>
                  )}
                </div>
              </div>

              {/* ALL DONE / QUIZ BLOCK */}
              {allDone && (
                <div 
                  ref={completionRef} 
                  className="mt-12 p-10 bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 rounded-[2.5rem] text-center shadow-2xl scroll-mt-20"
                >
                  <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-6" />
                  <h3 className="text-3xl font-black text-white mb-3">
                    {hasPassed ? "Certification Earned! 🎓" : "Course Completed! 🎉"}
                  </h3>
                  <p className="text-slate-400 mb-8 max-w-md mx-auto text-sm">
                    {hasPassed 
                      ? "You've successfully cleared the assessment. Claim your reward below." 
                      : "You've finished all lessons. Complete the quiz to earn your certificate."}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {hasPassed ? (
                      <button onClick={() => navigate(`/course-certificate/${id}`)} className="flex items-center gap-2 px-10 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-bold transition-all hover:-translate-y-1 shadow-lg">
                        <Award className="w-5 h-5" /> View Certificate
                      </button>
                    ) : (
                      <button onClick={() => navigate(`/course-quiz/${id}`)} className="flex items-center gap-2 px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all hover:-translate-y-1 shadow-lg">
                        Take Final Quiz
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* NOTES PANEL */}
          {notesOpen && (
            <div className="w-80 flex-shrink-0 bg-slate-800 border-l border-slate-700 flex flex-col">
              <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2"><StickyNote className="w-4 h-4 text-amber-400" /> Lesson Notes</h3>
                <button onClick={() => setNotesOpen(false)} className="p-1 hover:bg-slate-700 rounded-md transition-colors"><X className="w-4 h-4 text-slate-400" /></button>
              </div>
              <div className="flex-1 p-5 flex flex-col gap-4">
                <textarea
                  value={noteText}
                  onChange={(e) => { setNoteText(e.target.value); setNoteSaved(false); }}
                  placeholder="Summarize key points..."
                  className="flex-1 bg-slate-900/50 border border-slate-700 rounded-2xl p-4 text-sm text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder:text-slate-700"
                />
                <button
                  onClick={saveNoteHandler}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all ${noteSaved ? 'bg-emerald-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
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