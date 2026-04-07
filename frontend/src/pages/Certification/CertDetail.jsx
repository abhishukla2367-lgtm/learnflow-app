import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, CheckCircle, Clock, BarChart2, Briefcase,
  BadgeCheck, Shield, Download, Star, ChevronDown, ChevronUp,
  PlayCircle, Users, Zap, ArrowRight, Globe } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CERTS } from '../../data/certsData';

function SyllabusRow({ item, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-slate-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 font-mono flex-shrink-0">{index + 1}</span>
          <div>
            <p className="text-sm font-semibold text-slate-800">{item.topic}</p>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{item.week} · {item.lessons} lessons</p>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <PlayCircle className="w-3.5 h-3.5" /> Video lectures + hands-on labs · {item.lessons} lessons · Certificate on completion
          </div>
        </div>
      )}
    </div>
  );
}

export default function CertDetail() {
  const { certId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const cert = CERTS.find(c => String(c.id) === String(certId));

  if (!cert) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-slate-500 font-mono text-sm">Certification not found.</p>
          <Link to="/certifications" className="mt-4 inline-flex items-center gap-2 text-cyan-600 font-semibold text-sm hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to certifications
          </Link>
        </div>
      </div>
    );
  }

  const disc = Math.round((1 - cert.price / cert.origPrice) * 100);
  const totalLessons = cert.syllabus.reduce((s, w) => s + w.lessons, 0);

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* Hero */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 font-mono transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to certifications
          </button>

          <div className="grid lg:grid-cols-3 gap-10 items-start">
            {/* Left */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-mono ${cert.accentBg} ${cert.accentText} border ${cert.accentBorder}`}>
                  {cert.tag}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-mono bg-slate-100 text-slate-600 border border-slate-200">
                  {cert.level}
                </span>
              </div>

              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl flex-shrink-0">{cert.emoji}</span>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">{cert.title}</h1>
              </div>

              <p className="text-slate-500 font-mono text-sm mb-3">{cert.tagline}</p>
              <p className="text-base text-slate-600 leading-relaxed mb-6 max-w-2xl">{cert.desc}</p>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 mb-6">
                {[
                  { icon: Clock, label: cert.duration },
                  { icon: BarChart2, label: `${totalLessons} lessons` },
                  { icon: Users, label: '50,000+ enrolled' },
                  { icon: Briefcase, label: cert.jobs },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-sm text-slate-600 font-mono">
                    <Icon className="w-4 h-4 text-cyan-500" /> {label}
                  </div>
                ))}
              </div>

              {/* Hiring companies */}
              <div>
                <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mb-3">Recognised for hiring by</p>
                <div className="flex flex-wrap gap-2">
                  {cert.companies.map(c => (
                    <span key={c} className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 font-mono">{c}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky enrolment card */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className={`h-1.5 bg-gradient-to-r ${cert.gradient}`} />
                <div className="p-6 flex flex-col gap-5">
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold text-slate-900">₹{cert.price.toLocaleString('en-IN')}</span>
                      <span className="text-sm text-slate-400 line-through">₹{cert.origPrice.toLocaleString('en-IN')}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold font-mono ${cert.accentBg} ${cert.accentText} border ${cert.accentBorder}`}>{disc}% off</span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono">One-time payment · Lifetime access</p>
                  </div>

                  <button
                    onClick={() => navigate(user ? `/checkout/${certId}` : '/register', { state: { cert } })}
                    className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r ${cert.gradient} text-white font-bold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98] shadow-sm`}
                  >
                    Enrol Now <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                  onClick={() => {
                    if (!user) { navigate('/register'); return; }
                    const uid   = user._id || user.id;
                    const lsKey = enrollmentKey(uid);
                    const snap  = {
                      _id:        `free_${cert.id}_${Date.now()}`,
                      course: {
                        _id:         cert.id,
                        id:          cert.id,
                        title:       cert.title,
                        thumbnail:   cert.thumbnail || null,
                        instructor:  null,
                        description: cert.desc || null,
                        emoji:       cert.emoji || null,
                        tag:         cert.tag   || null,
                      },
                      certId:     cert.id,
                      progress:   0,
                      enrolledAt: new Date().toISOString(),
                      type:       'free',
                    };
                    try {
                      const stored  = JSON.parse(localStorage.getItem(lsKey) || '[]');
                      const deduped = stored.filter(e =>
                        String(e.certId || e.course?._id || e.course?.id) !== String(cert.id)
                      );
                      localStorage.setItem(lsKey, JSON.stringify([...deduped, snap]));
                    } catch { /* ignore */ }
                    navigate('/my-courses');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all duration-200"
                >
                  Start free trial
                </button>

                  <div className="border-t border-slate-200 pt-4 space-y-2.5">
                    {[
                      [BadgeCheck, 'Blockchain-verified certificate'],
                      [Shield, 'Tamper-proof QR code for recruiters'],
                      [Download, 'PDF + LinkedIn-ready badge'],
                      [Globe, 'Recognised by 1,200+ hiring partners'],
                      [Zap, '30-day money-back guarantee'],
                    ].map(([Icon, text]) => (
                      <div key={text} className="flex items-center gap-2.5 text-xs text-slate-600 font-mono">
                        <Icon className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" /> {text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl space-y-10">

          {/* What you'll learn */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-5">What you'll learn</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {cert.highlights.map(h => (
                <div key={h} className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl">
                  <CheckCircle className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700 leading-relaxed">{h}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Skills you'll gain</h2>
            <div className="flex flex-wrap gap-2">
              {cert.skills.map(s => (
                <span key={s} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-sm text-slate-700 font-mono shadow-sm">{s}</span>
              ))}
            </div>
          </section>

          {/* Syllabus */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-900">Course curriculum</h2>
              <span className="text-xs text-slate-500 font-mono">{cert.syllabus.length} modules · {totalLessons} lessons · {cert.duration}</span>
            </div>
            <div className="space-y-2">
              {cert.syllabus.map((item, i) => (
                <SyllabusRow key={i} item={item} index={i} />
              ))}
            </div>
          </section>

          {/* Alumni */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-5">Alumni story</h2>
            <div className="bg-white border border-slate-200 rounded-2xl p-7">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: cert.alumni.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-500" fill="currentColor" />
                ))}
              </div>
              <p className="text-slate-600 text-base leading-relaxed mb-5">"{cert.alumni.text}"</p>
              <div className="flex items-center gap-3 pt-5 border-t border-slate-200">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cert.gradient} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>
                  {cert.alumni.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{cert.alumni.name}</p>
                  <p className="text-xs text-slate-500">{cert.alumni.role}</p>
                  <p className={`text-xs font-mono mt-0.5 ${cert.accentText}`}>📍 {cert.alumni.city}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-slate-200 bg-white py-10">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <Award className="w-10 h-10 text-cyan-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Ready to earn your certificate?</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Join 50,000+ professionals who have already levelled up with Learnflow.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate(user ? `/checkout/${certId}` : '/register', { state: { cert } })}
              className={`inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r ${cert.gradient} text-white font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-sm`}
            >
              Enrol Now — ₹{cert.price.toLocaleString('en-IN')} <ArrowRight className="w-4 h-4" />
            </button>
            <Link to="/certifications" className="inline-flex items-center gap-2 px-7 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all">
              View all certifications
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}