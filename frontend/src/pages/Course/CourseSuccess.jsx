import { useLocation, useParams, Link } from 'react-router-dom';
import {
  CheckCircle, ArrowRight, Download, Share2,
  Play, Layout, BadgeCheck, Award, Users, Zap,
} from 'lucide-react';

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id:       i,
  size:     (i % 4) + 2,
  x:        (i * 8.3)  % 100,
  y:        (i * 13.7) % 100,
  delay:    (i * 0.4)  % 5,
  duration: 5 + (i % 7),
}));

export default function Success() {
  const location = useLocation();
  
  // 1. Unified data source from location state
  // This handles both 'course' and 'cert' naming conventions from previous pages
  const courseData = location.state?.course || location.state?.cert || null;
  
  // 2. Extract IDs and names using the correct variable (courseData)
  const id = location.state?.courseId || location.state?.certId || courseData?.id || courseData?._id || '';
  const courseName = courseData?.title || 'Professional Certification';
  
  // 3. Determine type
  const type = location.pathname.includes('course-success') ? 'course' : 'certification';

  // 4. Handle Lessons - using courseData
  const firstLesson = courseData?.lessons?.[0]?._id || courseData?.lessons?.[0]?.id || null;
  
  const isTrial = location.state?.isTrial || false;

  // 5. Construct URLs
  const curriculumTo = `/learn/${type}/${id}`;
  const introVideoTo = firstLesson 
    ? `/learn/${type}/${id}/${firstLesson}` 
    : `/learn/${type}/${id}`;

  const handleShare = async () => {
    const text = `I just enrolled in "${courseName}" on Learnflow! 🎓`;
    if (navigator.share) {
      try { await navigator.share({ title: courseName, text }); } catch (_) {}
    } else {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-white overflow-hidden py-20">
      <div className="absolute inset-0 [background-image:linear-gradient(rgba(8,145,178,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(8,145,178,0.05)_1px,transparent_1px)] [background-size:44px_44px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan-100/40 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-violet-100/40 blur-[100px] pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-emerald-400/30 animate-bounce"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-2xl mx-auto px-4 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-100 mb-8 shadow-xl shadow-emerald-100/50 border border-emerald-200">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>

        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-mono font-bold mb-4 uppercase tracking-wider ${
          isTrial ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
        }`}>
          {isTrial ? 'Trial Membership Active' : 'Payment Successful'}
        </div>

        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
          {isTrial ? "Your trial has started," : "You're enrolled,"}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-violet-600">
            Welcome!
          </span>
        </h1>
        
        <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto">
          {isTrial ? (
            <>You have full access to <span className="font-semibold text-slate-800">"{courseName}"</span> for the next 7 days.</>
          ) : (
            <>Your enrollment for <span className="font-semibold text-slate-800">"{courseName}"</span> is confirmed.</>
          )}
        </p>

        {courseData && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 text-left shadow-sm">
            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-100">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${courseData.gradient || 'from-cyan-500 to-blue-600'} flex items-center justify-center text-2xl flex-shrink-0`}>
                {courseData.emoji || '🎓'}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{courseData.title}</p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  {courseData.duration} · {courseData.level}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                [BadgeCheck, 'Blockchain certificate issued to your account'],
                [Award,      'LinkedIn badge ready to add in My Learning'],
                [Users,      'Community access unlocked — join 50,000+ learners'],
                [Zap,        'First module unlocked — start learning now'],
              ].map(([Icon, text]) => (
                <div key={text} className="flex items-center gap-3 text-sm text-slate-600">
                  <Icon className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white/70 backdrop-blur-md border border-slate-200 p-8 rounded-3xl shadow-2xl shadow-slate-200/50 mb-10">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={introVideoTo}
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-cyan-600 text-white font-bold text-lg shadow-lg shadow-cyan-600/30 hover:bg-cyan-700 hover:-translate-y-1 transition-all duration-200"
            >
              Start Learning Now
              <Play className="w-5 h-5 fill-current" />
            </Link>

            <button
              onClick={() => alert('Your invoice will be sent to your email shortly.')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-slate-200 bg-white text-slate-700 font-bold text-lg hover:bg-slate-50 transition-all"
            >
              <Download className="w-5 h-5" />
              Invoice
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Link to={curriculumTo} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-cyan-50 transition-all">
            <Layout className="w-5 h-5 mx-auto mb-2 text-cyan-600" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Curriculum</span>
          </Link>

          <Link to={introVideoTo} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-violet-50 transition-all">
            <Play className="w-5 h-5 mx-auto mb-2 text-violet-600" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Intro Video</span>
          </Link>

          <button onClick={handleShare} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-emerald-50 transition-all w-full">
            <Share2 className="w-5 h-5 mx-auto mb-2 text-emerald-600" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Share</span>
          </button>
        </div>
      </div>
    </section>
  );
}