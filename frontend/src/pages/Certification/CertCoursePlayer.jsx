import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CERTS } from '../../data/certsData';
import {
  CheckCircle, Circle, ChevronLeft, ChevronRight, Menu,
  X, Trophy, ArrowLeft, Clock, PlayCircle, StickyNote,
  ChevronDown, ChevronUp,
} from 'lucide-react';
import api from '../../utils/api';

/* ─────────────────────────────────────────────
   localStorage helpers
───────────────────────────────────────────── */
function loadProgress(id) {
  try {
    return (
      JSON.parse(localStorage.getItem('lf_progress') || '{}')[id] || {
        completedLessons: [],
        lastLesson: null,
      }
    );
  } catch {
    return { completedLessons: [], lastLesson: null };
  }
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
    return (
      JSON.parse(localStorage.getItem('lf_notes') || '{}')[
        `${id}-${lessonId}`
      ] || ''
    );
  } catch {
    return '';
  }
}

function saveNote(id, lessonId, text) {
  try {
    const all = JSON.parse(localStorage.getItem('lf_notes') || '{}');
    all[`${id}-${lessonId}`] = text;
    localStorage.setItem('lf_notes', JSON.stringify(all));
  } catch {}
}

/* ─────────────────────────────────────────────
   Resolve lesson id — DB uses _id, CERTS uses id
───────────────────────────────────────────── */
function lid(lesson) {
  return lesson?.id || lesson?._id || '';
}

/* ─────────────────────────────────────────────
   Normalise lessons from cache / CERTS data
   - adds weekLabel fallback so sidebar works
   - ensures .id is always set
───────────────────────────────────────────── */
function normaliseLessons(lessons = []) {
  return lessons.map((l, i) => ({
    ...l,
    id: l.id || l._id || String(i),
    weekLabel: l.weekLabel || `Section ${Math.floor(i / 5) + 1}`,
    duration: l.duration
      ? typeof l.duration === 'number'
        ? `${l.duration} min`
        : l.duration
      : '—',
    videoId:  l.videoId  || null,
    videoUrl: l.videoUrl || null,
  }));
}

/* ─────────────────────────────────────────────
   Resolve the cert from CERTS constant OR
   from the lf_course_cache written at enrolment
───────────────────────────────────────────── */
function resolveCert(id) {
  // 1. Static CERTS array (original certifications)
  const fromStatic = CERTS.find((c) => String(c.id) === String(id));
  if (fromStatic) {
    return { ...fromStatic, lessons: normaliseLessons(fromStatic.lessons) };
  }

  // 2. Dynamic courses enrolled via API (saved in cache at enrolment)
  try {
    const cache  = JSON.parse(localStorage.getItem('lf_course_cache') || '{}');
    const cached = cache[id];
    if (cached) {
      return {
        ...cached,
        id:           id,
        gradient:     cached.gradient     || 'from-cyan-500 to-violet-600',
        accentBg:     cached.accentBg     || 'bg-cyan-900/40',
        accentText:   cached.accentText   || 'text-cyan-400',
        accentBorder: cached.accentBorder || 'border-cyan-700',
        emoji:        cached.emoji        || '📘',
        lessons:      normaliseLessons(cached.lessons),
      };
    }
  } catch {}

  return null;
}

/* ─────────────────────────────────────────────
   Sync progress percentage to backend
───────────────────────────────────────────── */
async function syncProgressToBackend(courseId, completedCount, totalCount) {
  try {
    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    await api.patch(`/enrollments/${courseId}/progress`, { progress: pct });
  } catch {
    // non-fatal — localStorage is source of truth locally
  }
}

/* ═══════════════════════════════════════════
   COURSE PLAYER
═══════════════════════════════════════════ */
export default function CoursePlayer() {
  const { id, lessonId } = useParams();
  const navigate = useNavigate();

  const cert    = resolveCert(id);
  const lessons = cert?.lessons || [];

  const lessonIdx = lessonId
    ? lessons.findIndex((l) => String(lid(l)) === String(lessonId))
    : 0;
  const lesson = lessons[lessonIdx === -1 ? 0 : lessonIdx];

  const [progress,       setProgress]       = useState({ completedLessons: [], lastLesson: null });
  const [sidebarOpen,    setSidebarOpen]    = useState(true);
  const [notesOpen,      setNotesOpen]      = useState(false);
  const [noteText,       setNoteText]       = useState('');
  const [noteSaved,      setNoteSaved]      = useState(false);
  const [expandedWeeks,  setExpandedWeeks]  = useState({});
  const [justCompleted,  setJustCompleted]  = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const videoRef = useRef(null);


  /* ── Load progress on mount ── */
  useEffect(() => {
    if (!cert) { navigate('/my-courses'); return; }
    setProgress(loadProgress(cert.id));
    if (cert.isTrial && cert.enrolledAt) {
    const enrollmentDate = new Date(cert.enrolledAt);
    const now = new Date();
    const diffInDays = (now - enrollmentDate) / (1000 * 60 * 60 * 24);

    if (diffInDays > 7) {
      setIsExpired(true);
    }
  }
  }, [cert?.id]); // eslint-disable-line

  /* ── When lesson changes ── */
  useEffect(() => {
    if (!cert || !lesson) return;
    const currentLid = lid(lesson);
    setNoteText(loadNotes(cert.id, currentLid));
    setNoteSaved(false);
    setJustCompleted(false);
    setExpandedWeeks((prev) => ({ ...prev, [lesson.weekLabel]: true }));
    const p       = loadProgress(cert.id);
    const updated = { ...p, lastLesson: currentLid };
    saveProgress(cert.id, updated);
    setProgress(updated);
  }, [cert?.id, lid(lesson)]); // eslint-disable-line

  const isCompleted = useCallback(
    (id) => progress.completedLessons?.includes(String(id)),
    [progress]
  );

  /* ── Mark lesson complete ── */
  const markComplete = () => {
    if (!lesson) return;
    const currentLid  = String(lid(lesson));
    const already     = isCompleted(currentLid);
    const updatedList = already
      ? progress.completedLessons
      : [...(progress.completedLessons || []), currentLid];

    const updated = { ...progress, completedLessons: updatedList, lastLesson: currentLid };
    saveProgress(cert.id, updated);
    setProgress(updated);
    setJustCompleted(true);

    syncProgressToBackend(cert.id, updatedList.length, lessons.length);

    setTimeout(() => {
      const next = lessons[lessonIdx + 1];
      if (next) navigate(`/learn/${cert.id}/${lid(next)}`);
    }, 1200);
  };

  /* ── Auto-mark complete when mp4 video ends ── */
  const handleVideoEnded = () => {
    if (!isCompleted(lid(lesson))) markComplete();
  };

  /* ── Save note ── */
  const saveNoteHandler = () => {
    if (!lesson) return;
    saveNote(cert.id, lid(lesson), noteText);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  if (!cert || !lesson) return null;
  /* ── Check Expiry ── */
  /* ── Check Expiry ── */
  const trialEndDate = cert.trialEndsAt ? new Date(cert.trialEndsAt) : null;
  const expired = cert.isTrial && trialEndDate && new Date() > trialEndDate;

  if (expired) {
    return (
      <div className="flex h-screen bg-slate-900 items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 p-8 rounded-3xl text-center shadow-2xl">
          <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Trial Expired</h2>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">
            Your 7-day trial for <span className="text-cyan-400 font-bold">{cert.title}</span> has ended. 
            Upgrade now to keep your progress and earn your certificate.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => navigate(`/checkout/${cert.id}`)}
              className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-cyan-900/20"
            >
              Upgrade & Unlock Now
            </button>
            <button 
              onClick={() => navigate('/my-courses')}
              className="w-full py-3 text-slate-500 hover:text-slate-300 text-xs font-semibold transition-colors"
            >
              Back to My Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  const completedCount = progress.completedLessons?.length || 0;
  const pct            = Math.round((completedCount / lessons.length) * 100);
  const allDone        = completedCount >= lessons.length;

  /* ── Group lessons by weekLabel for sidebar ── */
  const weekGroups = lessons.reduce((acc, l) => {
    const key = l.weekLabel;
    if (!acc[key]) acc[key] = [];
    acc[key].push(l);
    return acc;
  }, {});

  const hasYouTube = !!lesson.videoId;
  const hasMp4     = !!lesson.videoUrl;
  
  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">

      {/* ══════════ SIDEBAR ══════════ */}
      <aside
        className={`${
          sidebarOpen ? 'w-80' : 'w-0'
        } flex-shrink-0 bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 overflow-hidden`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex-shrink-0">
          <button
            onClick={() => navigate('/my-courses')}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-mono mb-3 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> My Learning
          </button>
          <h2 className="text-sm font-bold text-white leading-tight">{cert.title}</h2>

          <div className="mt-3">
            <div className="flex justify-between mb-1">
              <span className="text-xs text-slate-400 font-mono">
                {completedCount}/{lessons.length} lessons
              </span>
              <span className="text-xs font-bold text-white font-mono">{pct}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-1.5 rounded-full bg-gradient-to-r ${cert.gradient} transition-all duration-500`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Lesson list */}
        <div className="flex-1 overflow-y-auto py-2">
          {Object.entries(weekGroups).map(([week, sectionLessons]) => (
            <div key={week}>
              <button
                onClick={() => setExpandedWeeks((p) => ({ ...p, [week]: !p[week] }))}
                className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200 transition-colors"
              >
                <span className="font-mono">{week}</span>
                {expandedWeeks[week]
                  ? <ChevronUp className="w-3.5 h-3.5" />
                  : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {expandedWeeks[week] &&
                sectionLessons.map((l) => {
                  const active = String(lid(l)) === String(lid(lesson));
                  const done   = isCompleted(lid(l));
                  return (
                    <button
                      key={lid(l)}
                      onClick={() => navigate(`/learn/${cert.id}/${lid(l)}`)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-all ${
                        active
                          ? 'bg-slate-700 border-l-2 border-cyan-500'
                          : 'hover:bg-slate-700/50 border-l-2 border-transparent'
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {done   ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                        : active ? <PlayCircle  className="w-4 h-4 text-cyan-400" />
                                 : <Circle      className="w-4 h-4 text-slate-600" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs leading-snug font-semibold truncate ${
                          active ? 'text-white' : done ? 'text-slate-400' : 'text-slate-300'
                        }`}>
                          {l.title}
                        </p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> {l.duration}
                        </p>
                      </div>
                    </button>
                  );
                })}
            </div>
          ))}
        </div>

        {/* Quiz CTA when all done */}
        {/* --- LINE 417: Course Completion Section --- */}
            {allDone && (
              <div className="max-w-4xl mx-6 mt-8 mb-12 p-8 bg-slate-800 border border-slate-700 rounded-3xl text-center shadow-xl">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                  <Trophy className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Course Completed! 🎉</h3>
                
                {cert.isTrial ? (
                  <div className="mt-4">
                    <p className="text-slate-400 mb-6 text-sm max-w-md mx-auto leading-relaxed">
                      Amazing work! You've finished all the lessons. To claim your 
                      <span className="text-white font-bold"> Official Certificate</span> and get lifetime access, upgrade to a full account.
                    </p>
                    <button 
                      onClick={() => navigate(`/checkout/${cert.id}`)}
                      className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95"
                    >
                      Upgrade to Unlock Certificate
                    </button>
                  </div>
                ) : (
                  <div className="mt-4">
                    <p className="text-slate-400 mb-6 text-sm">
                      Your hard work paid off. Your certificate is ready for download!
                    </p>
                    <button 
                      onClick={() => navigate(`/quiz/${cert.id}`)}
                      className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95"
                    >
                      Take Quiz & Claim Certificate
                    </button>
                  </div>
                )}
              </div>
            )}
      </aside>

      {/* ══════════ MAIN ══════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="hidden sm:block">
              <p className="text-xs text-slate-400 font-mono">{cert.emoji} {cert.title}</p>
              <p className="text-sm font-semibold text-white">{lesson.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setNotesOpen((v) => !v)}
              className={`p-2 rounded-lg text-sm font-mono transition-all flex items-center gap-1.5 ${
                notesOpen ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <StickyNote className="w-4 h-4" />
              <span className="hidden sm:block text-xs">Notes</span>
            </button>
            <button
              onClick={() => { const p = lessons[lessonIdx - 1]; if (p) navigate(`/learn/${cert.id}/${lid(p)}`); }}
              disabled={lessonIdx === 0}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => { const n = lessons[lessonIdx + 1]; if (n) navigate(`/learn/${cert.id}/${lid(n)}`); }}
              disabled={lessonIdx === lessons.length - 1}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video + content */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto">

            {/* ── Video player ── */}
            <div className="relative w-full bg-black" style={{ paddingTop: '56.25%' }}>
              {hasYouTube ? (
                <iframe
                  key={lesson.videoId}
                  src={`https://www.youtube.com/embed/${lesson.videoId}?rel=0&modestbranding=1&color=white`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title={lesson.title}
                />
              ) : hasMp4 ? (
                <video
                  key={lesson.videoUrl}
                  ref={videoRef}
                  src={lesson.videoUrl}
                  controls
                  autoPlay
                  onEnded={handleVideoEnded}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-3">
                  <PlayCircle className="w-16 h-16 opacity-20" />
                  <p className="text-sm font-mono">No video for this lesson</p>
                  <button
                    onClick={markComplete}
                    className="mt-2 px-5 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white text-sm font-bold transition-all"
                  >
                    Mark as Read &amp; Continue
                  </button>
                </div>
              )}
            </div>

            {/* ── Lesson info ── */}
            <div className="bg-slate-900 px-6 py-5 border-b border-slate-700">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 max-w-4xl">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${cert.accentBg || 'bg-cyan-900/40'} ${cert.accentText || 'text-cyan-400'} ${cert.accentBorder || 'border-cyan-700'}`}>
                      {lesson.weekLabel}
                    </span>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {lesson.duration}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Lesson {lessonIdx + 1} of {lessons.length}
                    </span>
                  </div>
                  <h1 className="text-xl font-bold text-white mb-2">{lesson.title}</h1>
                  {lesson.description && (
                    <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">{lesson.description}</p>
                  )}
                </div>

                {/* Mark Complete */}
                <div className="flex-shrink-0">
                  {isCompleted(lid(lesson)) ? (
                    <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-900/50 border border-emerald-700 text-emerald-400 font-semibold text-sm">
                      <CheckCircle className="w-4 h-4" /> Completed
                    </div>
                  ) : (
                    <button
                      onClick={markComplete}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-[0.97] ${
                        justCompleted ? 'bg-emerald-600 text-white' : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                      }`}
                    >
                      {justCompleted
                        ? <><CheckCircle className="w-4 h-4" /> Done!</>
                        : <><CheckCircle className="w-4 h-4" /> Mark Complete</>}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ── Progress bar ── */}
            <div className="bg-slate-900 px-6 py-3 border-b border-slate-700/50">
              <div className="max-w-4xl flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full bg-gradient-to-r ${cert.gradient} transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-slate-400 whitespace-nowrap">{pct}% complete</span>
                {allDone && (
                  <button
                    onClick={() => navigate(`/quiz/${cert.id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-all"
                  >
                    <Trophy className="w-3.5 h-3.5" /> Take Quiz
                  </button>
                )}
              </div>
            </div>

            {/* ── Navigation footer ── */}
            <div className="px-6 py-4 bg-slate-900 flex items-center justify-between max-w-4xl">
              <button
                onClick={() => { const p = lessons[lessonIdx - 1]; if (p) navigate(`/learn/${cert.id}/${lid(p)}`); }}
                disabled={lessonIdx === 0}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-semibold"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {allDone ? (
                <button
                  onClick={() => navigate(`/quiz/${cert.id}`)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-all"
                >
                  <Trophy className="w-4 h-4" /> Take Quiz
                </button>
              ) : (
                <span className="text-xs text-slate-500 font-mono">
                  {completedCount}/{lessons.length} completed
                </span>
              )}

              <button
                onClick={() => { const n = lessons[lessonIdx + 1]; if (n) navigate(`/learn/${cert.id}/${lid(n)}`); }}
                disabled={lessonIdx === lessons.length - 1}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-bold"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ══ NOTES PANEL ══ */}
          {notesOpen && (
            <div className="w-72 flex-shrink-0 bg-slate-800 border-l border-slate-700 flex flex-col">
              <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <StickyNote className="w-4 h-4 text-amber-400" /> My Notes
                </h3>
                <button onClick={() => setNotesOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 p-4 flex flex-col gap-3">
                <p className="text-xs text-slate-400 font-mono line-clamp-2">{lesson.title}</p>
                <textarea
                  value={noteText}
                  onChange={(e) => { setNoteText(e.target.value); setNoteSaved(false); }}
                  placeholder="Write your notes here..."
                  className="flex-1 bg-slate-900 border border-slate-600 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-600 resize-none focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono leading-relaxed"
                />
                <button
                  onClick={saveNoteHandler}
                  className={`w-full px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    noteSaved ? 'bg-emerald-600 text-white' : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                  }`}
                >
                  {noteSaved ? '✓ Saved!' : 'Save Note'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}