import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CERTS } from '../../data/certsData';
import {
  CheckCircle, Circle, ChevronLeft, ChevronRight, Menu,
  X, Trophy, ArrowLeft, Clock, PlayCircle, StickyNote,
  ChevronDown, ChevronUp,
} from 'lucide-react';
import api from '../../utils/api';

/* ── localStorage helpers ── */
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

/* ── Resolve lesson id — DB uses _id, CERTS uses id ── */
function lid(lesson) {
  return lesson?.id || lesson?._id || '';
}

/* ── Normalise lessons ── */
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

/* ── Resolve the cert ── */
function resolveCert(id) {
  const fromStatic = CERTS.find((c) => String(c.id) === String(id) || String(c._id) === String(id));
  if (fromStatic) {
    return { ...fromStatic, lessons: normaliseLessons(fromStatic.lessons) };
  }

  try {
    const cache  = JSON.parse(localStorage.getItem('lf_course_cache') || '{}');
    const cached = cache[id];
    if (cached) {
      return {
        ...cached,
        id: id,
        lessons: normaliseLessons(cached.lessons),
      };
    }
  } catch {}
  return null;
}

async function syncProgressToBackend(courseId, completedCount, totalCount) {
  try {
    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    await api.patch(`/enrollments/${courseId}/progress`, { progress: pct });
  } catch {}
}

export default function CertCoursePlayer() {
  // CRITICAL CHANGE: Included 'type' to maintain unified routing
  const { type, id, lessonId } = useParams();
  const navigate = useNavigate();

  const cert    = resolveCert(id);
  const lessons = cert?.lessons || [];

  const lessonIdx = lessonId
    ? lessons.findIndex((l) => String(lid(l)) === String(lessonId))
    : 0;
  const lesson = lessons[lessonIdx === -1 ? 0 : lessonIdx];

  const [progress, setProgress] = useState({ completedLessons: [], lastLesson: null });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notesOpen, setNotesOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [justCompleted, setJustCompleted] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!cert) { navigate('/my-courses'); return; }
    setProgress(loadProgress(cert.id));
  }, [cert?.id]);

  useEffect(() => {
    if (!cert || !lesson) return;
    const currentLid = lid(lesson);
    setNoteText(loadNotes(cert.id, currentLid));
    setNoteSaved(false);
    setJustCompleted(false);
    setExpandedWeeks((prev) => ({ ...prev, [lesson.weekLabel]: true }));
    
    const p = loadProgress(cert.id);
    const updated = { ...p, lastLesson: currentLid };
    saveProgress(cert.id, updated);
    setProgress(updated);
  }, [cert?.id, lid(lesson)]);

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
    saveProgress(cert.id, updated);
    setProgress(updated);
    setJustCompleted(true);

    syncProgressToBackend(cert.id, updatedList.length, lessons.length);

    setTimeout(() => {
      const next = lessons[lessonIdx + 1];
      // CRITICAL CHANGE: Added type to navigation
      if (next) navigate(`/learn/${type}/${id}/${lid(next)}`);
    }, 1200);
  };

  const handleVideoEnded = () => {
    if (!isCompleted(lid(lesson))) markComplete();
  };

  const saveNoteHandler = () => {
    if (!lesson) return;
    saveNote(cert.id, lid(lesson), noteText);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  if (!cert || !lesson) return null;

  const trialEndDate = cert.trialEndsAt ? new Date(cert.trialEndsAt) : null;
  const expired = cert.isTrial && trialEndDate && new Date() > trialEndDate;

  if (expired) {
    return (
      <div className="flex h-screen bg-slate-900 items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 p-8 rounded-3xl text-center shadow-2xl">
          <Clock className="w-12 h-12 text-amber-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Trial Expired</h2>
          <p className="text-slate-400 mb-8 text-sm">Upgrade to full access to continue learning.</p>
          <button onClick={() => navigate(`/checkout/${cert.id}`)} className="w-full py-4 bg-cyan-600 text-white font-bold rounded-xl">Upgrade Now</button>
        </div>
      </div>
    );
  }

  const completedCount = progress.completedLessons?.length || 0;
  const pct = Math.round((completedCount / lessons.length) * 100);
  const allDone = completedCount >= lessons.length;
  const weekGroups = lessons.reduce((acc, l) => {
    const key = l.weekLabel;
    if (!acc[key]) acc[key] = [];
    acc[key].push(l);
    return acc;
  }, {});

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} bg-slate-800 border-r border-slate-700 flex flex-col transition-all overflow-hidden`}>
        <div className="p-4 border-b border-slate-700">
          <button onClick={() => navigate('/my-courses')} className="text-xs text-slate-400 mb-3 flex items-center gap-1"><ArrowLeft size={14}/> Back</button>
          <h2 className="text-sm font-bold text-white">{cert.title}</h2>
          <div className="w-full h-1.5 bg-slate-700 rounded-full mt-3 overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${cert.gradient || 'from-cyan-500 to-blue-500'}`} style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {Object.entries(weekGroups).map(([week, sectionLessons]) => (
            <div key={week}>
              <button onClick={() => setExpandedWeeks(p => ({...p, [week]: !p[week]}))} className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-slate-400 uppercase">
                {week} {expandedWeeks[week] ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
              </button>
              {expandedWeeks[week] && sectionLessons.map((l) => (
                <button key={lid(l)} onClick={() => navigate(`/learn/${type}/${id}/${lid(l)}`)} className={`w-full flex items-start gap-3 px-4 py-3 text-left ${String(lid(l)) === String(lid(lesson)) ? 'bg-slate-700 border-l-2 border-cyan-500' : ''}`}>
                   {isCompleted(lid(l)) ? <CheckCircle size={16} className="text-emerald-500"/> : <Circle size={16} className="text-slate-600"/>}
                   <span className="text-xs text-slate-200">{l.title}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-slate-800 border-b border-slate-700 p-3 flex justify-between items-center">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-400"><Menu size={18}/></button>
          <div className="flex gap-2">
            <button onClick={() => setNotesOpen(!notesOpen)} className="p-2 text-slate-400"><StickyNote size={18}/></button>
            <button disabled={lessonIdx === 0} onClick={() => navigate(`/learn/${type}/${id}/${lid(lessons[lessonIdx-1])}`)} className="p-2 text-slate-400 disabled:opacity-20"><ChevronLeft/></button>
            <button disabled={lessonIdx === lessons.length-1} onClick={() => navigate(`/learn/${type}/${id}/${lid(lessons[lessonIdx+1])}`)} className="p-2 text-slate-400 disabled:opacity-20"><ChevronRight/></button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="relative bg-black" style={{ paddingTop: '56.25%' }}>
              {lesson.videoId ? (
                <iframe src={`https://www.youtube.com/embed/${lesson.videoId}`} className="absolute inset-0 w-full h-full" allowFullScreen />
              ) : lesson.videoUrl ? (
                <video ref={videoRef} src={lesson.videoUrl} controls autoPlay onEnded={handleVideoEnded} className="absolute inset-0 w-full h-full" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                  <PlayCircle size={48} className="opacity-20 mb-2"/>
                  <button onClick={markComplete} className="bg-cyan-700 px-4 py-2 rounded-lg text-white font-bold">Mark as Read</button>
                </div>
              )}
            </div>
            
            <div className="p-6 max-w-4xl">
              <h1 className="text-2xl font-bold text-white mb-4">{lesson.title}</h1>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">{lesson.description}</p>
              
              {!isCompleted(lid(lesson)) && (
                <button onClick={markComplete} className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
                  <CheckCircle size={18}/> {justCompleted ? 'Completed!' : 'Mark Lesson Complete'}
                </button>
              )}

              {allDone && (
                <div className="mt-12 p-8 bg-slate-800 border border-slate-700 rounded-3xl text-center">
                   <Trophy size={48} className="text-amber-500 mx-auto mb-4"/>
                   <h2 className="text-xl font-bold text-white">Course Complete!</h2>
                   <button onClick={() => navigate(`/quiz/${id}`)} className="mt-4 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold">Take Final Quiz</button>
                </div>
              )}
            </div>
          </div>

          {notesOpen && (
            <div className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold flex items-center gap-2"><StickyNote size={16}/> Notes</h3>
                <button onClick={() => setNotesOpen(false)}><X size={18} className="text-slate-400"/></button>
              </div>
              <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Type notes..." className="flex-1 bg-slate-900 text-white p-3 rounded-xl resize-none focus:outline-none border border-slate-700 mb-3"/>
              <button onClick={saveNoteHandler} className="bg-cyan-600 py-2 rounded-lg text-white font-bold">{noteSaved ? 'Saved!' : 'Save Note'}</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}