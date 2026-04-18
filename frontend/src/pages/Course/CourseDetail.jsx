import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star, Clock, Users, Award, CheckCircle2, Play, Lock,
  ChevronDown, ChevronUp, Loader2, ArrowLeft, Globe, BookOpen,
  Shield, Download, BadgeCheck, Zap, ArrowRight, PlayCircle
} from 'lucide-react';
import api from '../../utils/api';
import { getInstructorPhoto } from '../../utils/instructorPhotos';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

function CurriculumRow({ sec, idx, isOpen, setOpen, enrolled, openLesson }) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(isOpen ? -1 : idx)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 font-mono flex-shrink-0">
            {idx + 1}
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-800">{sec.title}</p>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              {sec.lessons?.length || 0} lessons · {sec.lessons?.reduce((acc, l) => acc + (l.duration || 0), 0)} mins
            </p>
          </div>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {isOpen && sec.lessons?.length > 0 && (
        <div className="bg-slate-50 border-t border-slate-200 divide-y divide-slate-100">
          {sec.lessons.map((lesson, li) => {
            const canPlay = lesson.isPreview || enrolled;
            return (
              <button
                key={lesson._id || li}
                onClick={() => canPlay && openLesson(lesson)}
                disabled={!canPlay}
                className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
                  canPlay ? 'hover:bg-white cursor-pointer' : 'cursor-not-allowed opacity-60'
                }`}
              >
                {canPlay ? (
                  <PlayCircle className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-300 flex-shrink-0" />
                )}
                <span className="text-sm text-slate-600 flex-1 font-mono">{lesson.title}</span>
                {lesson.isPreview && (
                  <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-tighter border border-cyan-200 bg-cyan-50 px-1.5 py-0.5 rounded">
                    Preview
                  </span>
                )}
                {lesson.duration > 0 && (
                  <span className="text-xs text-slate-400 font-mono">{lesson.duration}m</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CourseDetail() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [openSec, setOpenSec] = useState(0);
  const [activeLesson, setActiveLesson] = useState(null);

  // 1. Fetch Course
  useEffect(() => {
    if (!courseId || courseId === 'undefined') {
      navigate('/courses');
      return;
    }
    api.get(`/courses/${courseId}`)
      .then(r => setCourse(r.data.course))
      .catch(() => navigate('/courses'))
      .finally(() => setLoading(false));
  }, [courseId, navigate]);

  // 2. Check Enrollment
  useEffect(() => {
    if (user && course) {
      api.get('/enrollments').then(r => {
        const list = Array.isArray(r.data) ? r.data : (r.data?.enrollments || []);
        const ids = list.map(e => String(e.course?._id || e.course || ''));
        setEnrolled(ids.includes(String(course._id)));
      }).catch(() => {});
    }
  }, [user, course]);

  const buildLessons = (c) =>
    (c.sections || []).flatMap(sec =>
      (sec.lessons || []).map(l => ({
        courseId: l._id,
        title: l.title,
        duration: l.duration || 0,
        videoUrl: l.videoUrl || '',
        isPreview: l.isPreview || false,
      }))
    );

  const handleEnroll = async () => {
    if (!user) { navigate('/login'); return; }
    const isFree = course.isFree || course.price === 0;

    if (isFree) {
      try {
        setEnrolling(true);
        const response = await api.post(`/enrollments/${courseId}`, { type: 'trial' });
        
        const cache = JSON.parse(localStorage.getItem('lf_course_cache') || '{}');
        cache[courseId] = {
          courseId,
          title: course.title,
          lessons: buildLessons(course),
          enrolledAt: new Date().toISOString(),
          isTrial: true 
        };
        localStorage.setItem('lf_course_cache', JSON.stringify(cache));
        
        if (response.data.alreadyEnrolled) {
          navigate(`/my-courses`); 
        } else {
          toast.success('7-Day Trial Started!');
          navigate('/course-success', {
            state: { 
              certId: courseId, 
              courseId: courseId,
              isTrial: true, 
              trialEndsAt: response.data.trialEndsAt,
              cert: {
                title: course.title,
                lessons: buildLessons(course)
              }
            } 
          });
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Enrollment failed');
      } finally {
        setEnrolling(false);
      }
      return;
    }
    
    navigate(`/course-checkout/${course._id}`, {
      state: {
        cert: {
          courseId: course._id,
          title: course.title,
          desc: course.description,
          price: course.price || 0,
          origPrice: course.price ? Math.round(course.price * 1.5) : 0,
          gradient: 'from-cyan-500 to-blue-600',
          accentBg: 'bg-cyan-50',
          accentText: 'text-cyan-700',
          accentBorder: 'border-cyan-200',
          emoji: '📘',
          tag: course.category || 'Course',
          thumbnail: course.thumbnail || '',
          lessons: buildLessons(course),
        }
      }
    });
  };

  const openLesson = (lesson) => {
    if (!lesson.isPreview && !enrolled) return;
    setActiveLesson({
      courseId: lesson._id,
      title: lesson.title,
      duration: lesson.duration,
      videoUrl: lesson.videoUrl || '',
    });
    setTimeout(() => {
      document.getElementById('lesson-player')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 size={36} className="animate-spin text-cyan-500" />
    </div>
  );

  if (!course) return null;

  const totalLessons = course.sections?.reduce((acc, s) => acc + (s.lessons?.length || 0), 0) || 0;
  const disc = 33; // Default discount placeholder
  const hrs = course.totalDuration ? `${Math.floor(course.totalDuration / 60)}h ${course.totalDuration % 60}m` : null;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 font-mono transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to courses
          </button>

          <div className="grid lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-mono bg-cyan-50 text-cyan-700 border border-cyan-200">
                  {course.category}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-mono bg-slate-100 text-slate-600 border border-slate-200">
                  {course.level || 'All Levels'}
                </span>
              </div>

              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl flex-shrink-0">📘</span>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                {course.title.replace('&', 'and')} 
                </h1>
              </div>

              <p className="text-slate-500 font-mono text-sm mb-3">{course.subtitle}</p>
              <p className="text-base text-slate-600 leading-relaxed mb-6 max-w-2xl">{course.description}</p>

              <div className="flex flex-wrap gap-4 mb-6">
                {[
                  { icon: Clock, label: hrs || 'Self-paced' },
                  { icon: PlayCircle, label: `${totalLessons} lessons` },
                  { icon: Users, label: `${course.enrollmentCount?.toLocaleString() || '5,000'}+ students` },
                  { icon: Globe, label: course.language || 'English' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-sm text-slate-600 font-mono">
                    <Icon className="w-4 h-4 text-cyan-500" /> {label}
                  </div>
                ))}
              </div>

              {/* Recognized By Section */}
              <div>
                <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mb-3">Recognised by</p>
                <div className="flex flex-wrap gap-2">
                  {['Google', 'Microsoft', 'Amazon', 'Meta'].map(c => (
                    <span key={c} className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 font-mono">{c}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Pricing Card */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="h-1.5 bg-gradient-to-r from-cyan-500 to-blue-600" />
                <div className="p-6 flex flex-col gap-5">
                  <div className="flex items-baseline gap-2 mb-1">
                    {course.isFree || course.price === 0 ? (
                      <span className="text-2xl font-bold text-slate-900">7-Day Free Trial</span>
                    ) : (
                      <>
                        <span className="text-3xl font-bold text-slate-900">₹{course.price?.toLocaleString('en-IN')}</span>
                        <span className="text-sm text-slate-400 line-through">₹{Math.round(course.price * 1.5).toLocaleString('en-IN')}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold font-mono bg-cyan-50 text-cyan-700 border border-cyan-200">{disc}% off</span>
                      </>
                    )}
                  </div>

                  {enrolled ? (
                    <button 
                      onClick={() => navigate('/my-courses')}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Go to My Courses
                    </button>
                  ) : (
                    <button 
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-sm disabled:opacity-50"
                    >
                      {enrolling ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Enroll Now <ArrowRight className="w-4 h-4" /></>}
                    </button>
                  )}
                  
                  <div className="border-t border-slate-200 pt-4 space-y-2.5">
                    {[
                      [BadgeCheck, 'Full Lifetime Access'],
                      [Shield, 'Blockchain-verified certificate'],
                      [Download, 'Downloadable resources'],
                      [Globe, 'Learn on Mobile & Desktop'],
                      [Zap, '7-Day Refund Policy'],
                    ].map(([Icon, text]) => (
                      <div key={text} className="flex items-center gap-2.5 text-xs text-slate-600 font-mono">
                        <Icon className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" /> {text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Instructor Mini-Card */}
              {course.instructor && (
                <div className="mt-4 p-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3">
                  <img
                    src={getInstructorPhoto(course.instructor.name) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor.name}`}
                    alt={course.instructor.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{course.instructor.name}</p>
                    <p className="text-[10px] font-mono text-slate-500 uppercase">{course.instructor.headline || 'Lead Instructor'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl space-y-10">
          
          {/* Inline Player Section */}
          {activeLesson && (
            <section id="lesson-player" className="scroll-mt-24">
              <div className="bg-slate-900 aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
                {activeLesson.videoUrl ? (
                  <video 
                    key={activeLesson.courseId}
                    src={activeLesson.videoUrl} 
                    controls 
                    autoPlay 
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                    <BookOpen size={48} className="opacity-20" />
                    <p className="font-mono text-sm">No video content for this lesson.</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <h3 className="font-bold text-slate-900">{activeLesson.title}</h3>
                  <p className="text-xs text-slate-500 font-mono">Currently playing · {activeLesson.duration} mins</p>
                </div>
                <button onClick={() => setActiveLesson(null)} className="text-xs font-bold text-slate-400 hover:text-slate-600 font-mono uppercase">Close Player</button>
              </div>
            </section>
          )}

          {/* What you'll learn */}
          {course.outcomes?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-5 font-mono">What you'll learn</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {course.outcomes.map(h => (
                  <div key={h} className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-700 leading-relaxed font-mono">{h}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Curriculum */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-900 font-mono">Course curriculum</h2>
              <span className="text-xs text-slate-500 font-mono">{course.sections?.length || 0} modules · {totalLessons} lessons</span>
            </div>
            <div className="space-y-2">
              {course.sections?.map((sec, idx) => (
                <CurriculumRow 
                  key={sec._id || idx} 
                  sec={sec} 
                  idx={idx} 
                  isOpen={openSec === idx}
                  setOpen={setOpenSec}
                  enrolled={enrolled}
                  openLesson={openLesson}
                />
              ))}
            </div>
          </section>

          {/* About Course */}
          <section className="bg-white border border-slate-200 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4 font-mono">Full Course Description</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                {course.description}
              </p>
            </div>
          </section>

          {/* Final Bottom CTA */}
          <div className="border-t border-slate-200 pt-10">
            <div className="text-center">
              <Award className="w-10 h-10 text-cyan-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-3 font-mono">Ready to start your journey?</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 font-mono">
                Join thousands of students learning {course.category} from industry experts.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {enrolled ? (
                  <Link to="/my-courses" className="px-10 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-sm hover:opacity-90 transition-all">
                    Continue Learning
                  </Link>
                ) : (
                  <button onClick={handleEnroll} className="px-10 py-3 rounded-xl bg-cyan-600 text-white font-bold text-sm shadow-sm hover:opacity-90 transition-all">
                    {course.isFree || course.price === 0 ? 'Start 7-Day Free Trial' : 'Enroll Now'}
                  </button>
                )}
                <Link to="/courses" className="inline-flex items-center gap-2 px-7 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all font-mono">
                  Explore all courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}