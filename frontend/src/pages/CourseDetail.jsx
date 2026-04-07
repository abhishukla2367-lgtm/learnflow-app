import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star, Clock, Users, Award, CheckCircle2, Play, Lock,
  ChevronDown, Loader2, ArrowLeft, Globe, BookOpen
} from 'lucide-react';
import api from '../utils/api';
import { getInstructorPhoto } from '../utils/instructorPhotos';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function CourseDetail() {
  const { id }       = useParams();
  const { user }     = useAuth();
  const navigate     = useNavigate();

  const [course,    setCourse]    = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [enrolled,  setEnrolled]  = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [openSec,   setOpenSec]   = useState(0);
  const [activeLesson, setActiveLesson] = useState(null);

  // ── Fetch course ──────────────────────────────────────────
  useEffect(() => {
    api.get(`/courses/${id}`)
      .then(r => setCourse(r.data.course))
      .catch(() => navigate('/courses'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  // ── Check enrollment ──────────────────────────────────────
  useEffect(() => {
    if (user && course) {
      api.get('/enrollments').then(r => {
        const list = Array.isArray(r.data) ? r.data : (r.data?.enrollments || []);
        const ids  = list.map(e => e.course?._id || e.course);
        setEnrolled(ids.includes(course._id));
      }).catch(() => {});
    }
  }, [user, course]);

  // ── Build lesson list for cache ───────────────────────────
  const buildLessons = (c) =>
    (c.sections || []).flatMap(sec =>
      (sec.lessons || []).map(l => ({
        id:        l._id,
        title:     l.title,
        duration:  l.duration  || 0,
        videoUrl:  l.videoUrl  || '',
        isPreview: l.isPreview || false,
      }))
    );

  // ── Enroll handler ────────────────────────────────────────
  const handleEnroll = async () => {
    if (!user) { navigate('/login'); return; }

    const isFree = course.isFree || course.price === 0;

    if (isFree) {
      // Free course — enroll directly, skip checkout
      try {
        setEnrolling(true);
        await api.post(`/enrollments/${course._id}`);

        // Save to localStorage cache so CoursePlayer can find it
        const cache = JSON.parse(localStorage.getItem('lf_course_cache') || '{}');
        cache[course._id] = {
          id:        course._id,
          title:     course.title,
          thumbnail: course.thumbnail || '',
          lessons:   buildLessons(course),
        };
        localStorage.setItem('lf_course_cache', JSON.stringify(cache));
        
        navigate(`/checkout/${course._id}`, { state: { certId: course._id, title: course.title } });
        navigate('/success', { state: { certId: course._id, title: course.title } });
      } catch {
        toast.error('Enrollment failed. Please try again.');
      } finally {
        setEnrolling(false);
      }
      return;
    }

    // Paid course — go to checkout
    navigate(`/checkout/${course._id}`, {
      state: {
        cert: {
          id:           course._id,
          title:        course.title,
          desc:         course.description,
          price:        course.price || 0,
          origPrice:    course.price ? Math.round(course.price * 1.5) : 0,
          gradient:     'from-indigo-500 to-violet-600',
          accentBg:     'bg-indigo-50',
          accentText:   'text-indigo-700',
          accentBorder: 'border-indigo-200',
          emoji:        '📘',
          tag:          course.category || 'Course',
          thumbnail:    course.thumbnail || '',
          lessons:      buildLessons(course),
        }
      }
    });
  };

  // ── Open a lesson in the inline player ───────────────────
  const openLesson = (lesson) => {
    if (!lesson.isPreview && !enrolled) return;
    setActiveLesson({
      id:       lesson._id,
      title:    lesson.title,
      duration: lesson.duration,
      videoUrl: lesson.videoUrl || '',
    });
    // Scroll to player
    setTimeout(() => {
      document.getElementById('lesson-player')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // ── Loading / not found ───────────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 size={36} className="animate-spin text-indigo-500" />
    </div>
  );
  if (!course) return null;

  const hrs = course.totalDuration
    ? `${Math.floor(course.totalDuration / 60)}h ${course.totalDuration % 60}m`
    : null;

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero (white themed, matches home) ── */}
      <div className="bg-white border-b border-slate-100">
        {/* Grid background like hero section */}
        <div className="absolute inset-x-0 h-[480px] [background-image:linear-gradient(rgba(8,145,178,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(8,145,178,0.05)_1px,transparent_1px)] [background-size:44px_44px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 text-sm font-medium mb-8 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Courses
          </Link>

          <div className="grid lg:grid-cols-3 gap-10 items-start">

            {/* ── Left: course info ── */}
            <div className="lg:col-span-2">
              <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-600 text-xs font-bold uppercase tracking-wide">
                {course.category}
              </span>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-4 mb-3 leading-tight text-slate-900">
                {course.title}
              </h1>

              {course.subtitle && (
                <p className="text-xl text-slate-500 mb-5">{course.subtitle}</p>
              )}

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                {course.averageRating > 0 && (
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.round(course.averageRating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-amber-500">{course.averageRating.toFixed(1)}</span>
                    <span className="text-slate-400">({course.totalReviews} reviews)</span>
                  </div>
                )}
                {course.enrollmentCount > 0 && (
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Users size={14} />{course.enrollmentCount.toLocaleString()} students
                  </span>
                )}
                {hrs && (
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Clock size={14} />{hrs}
                  </span>
                )}
                {course.language && (
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Globe size={14} />{course.language}
                  </span>
                )}
              </div>

              {/* Instructor */}
              {course.instructor && (
                <div className="flex items-center gap-3">
                  <img
                    src={getInstructorPhoto(course.instructor.name)
                    || course.instructor.avatar
                    || `https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor.name}`}
                    alt={course.instructor.name}
                    className="w-11 h-11 rounded-full border-2 border-indigo-100 object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{course.instructor.name}</p>
                    <p className="text-xs text-slate-500">{course.instructor.headline}</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: enrollment card ── */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-200 overflow-hidden">
                {/* Thumbnail */}
                <div className="aspect-video bg-slate-100 relative overflow-hidden">
                  <img
                    src={course.thumbnail || `https://picsum.photos/seed/${course._id}/640/360`}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <Play size={22} className="text-indigo-600 ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Price */}
                  <div className="flex items-baseline gap-3 mb-5">
                    {course.isFree || course.price === 0 ? (
                      <span className="text-3xl font-black text-emerald-600">Free</span>
                    ) : (
                      <>
                        <span className="text-3xl font-black text-slate-900">
                          ₹{course.price?.toLocaleString('en-IN')}
                        </span>
                        <span className="text-sm text-slate-400 line-through">
                          ₹{Math.round(course.price * 1.5).toLocaleString('en-IN')}
                        </span>
                        <span className="text-sm font-bold text-emerald-600">33% off</span>
                      </>
                    )}
                  </div>

                  {/* CTA */}
                  {enrolled ? (
                    <Link
                      to="/my-courses"
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all mb-4"
                    >
                      <CheckCircle2 size={18} /> Go to My Learning
                    </Link>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-60 mb-4"
                    >
                      {enrolling ? <Loader2 size={18} className="animate-spin" /> : null}
                      {enrolling
                        ? 'Enrolling…'
                        : (course.isFree || course.price === 0 ? 'Enroll for Free' : 'Enroll Now')}
                    </button>
                  )}

                  {/* Includes list */}
                  <ul className="space-y-2 text-sm text-slate-600">
                    {[
                      course.totalLessons && `${course.totalLessons} lessons`,
                      hrs && `${hrs} total content`,
                      course.certificate && 'Certificate of completion',
                      'Lifetime access',
                      'Mobile & desktop access',
                    ].filter(Boolean).map(item => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:max-w-[66%]">

          {/* ── Inline Lesson Player ── */}
          {activeLesson && (
            <div id="lesson-player" className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-8 shadow-sm">
              <div className="bg-slate-900 aspect-video flex items-center justify-center relative">
                {activeLesson.videoUrl ? (
                  <video
                    key={activeLesson.id}
                    src={activeLesson.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <BookOpen size={48} className="opacity-30" />
                    <p className="text-sm">No video available for this lesson</p>
                  </div>
                )}
              </div>
              <div className="p-4 flex items-center justify-between border-t border-slate-100">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{activeLesson.title}</p>
                  {activeLesson.duration > 0 && (
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock size={11} /> {activeLesson.duration} min
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setActiveLesson(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* ── What you'll learn ── */}
          {course.outcomes?.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-8">
              <h2 className="text-xl font-black text-slate-900 mb-5">What You'll Learn</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {course.outcomes.map(item => (
                  <div key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Description ── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-8">
            <h2 className="text-xl font-black text-slate-900 mb-4">Description</h2>
            <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">
              {course.description}
            </p>
          </div>

          {/* ── Curriculum ── */}
          {course.sections?.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8">
              <h2 className="text-xl font-black text-slate-900 mb-5">Course Curriculum</h2>
              <div className="space-y-3">
                {course.sections.map((sec, idx) => (
                  <div key={sec._id || idx} className="border border-slate-200 rounded-xl overflow-hidden">
                    {/* Section header */}
                    <button
                      className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                      onClick={() => setOpenSec(openSec === idx ? -1 : idx)}
                    >
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{sec.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {sec.lessons?.length || 0} lessons
                        </p>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`text-slate-400 transition-transform duration-200 ${openSec === idx ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Lessons */}
                    {openSec === idx && sec.lessons?.length > 0 && (
                      <div className="divide-y divide-slate-100">
                        {sec.lessons.map((lesson, li) => {
                          const canPlay = lesson.isPreview || enrolled;
                          return (
                            <button
                              key={lesson._id || li}
                              onClick={() => canPlay && openLesson(lesson)}
                              disabled={!canPlay}
                              className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${
                                canPlay
                                  ? 'hover:bg-indigo-50 cursor-pointer'
                                  : 'cursor-not-allowed opacity-60'
                              }`}
                            >
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                canPlay ? 'bg-indigo-100' : 'bg-slate-100'
                              }`}>
                                {canPlay
                                  ? <Play size={13} className="text-indigo-600 ml-0.5" />
                                  : <Lock size={13} className="text-slate-400" />
                                }
                              </div>
                              <span className="text-sm text-slate-700 flex-1">{lesson.title}</span>
                              {lesson.duration > 0 && (
                                <span className="text-xs text-slate-400">{lesson.duration}m</span>
                              )}
                              {lesson.isPreview && (
                                <span className="text-xs text-indigo-600 font-semibold">Preview</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}