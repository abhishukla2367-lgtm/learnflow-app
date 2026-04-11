import { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { COURSES } from '../../data/coursesData';
import { Award, Download, Share2, ArrowLeft, CheckCircle, Star, BadgeCheck, Linkedin, Printer } from 'lucide-react';
import usePdfExport from '../../components/admin/shared/usePdfExport';

function getQuizResult(courseId) {
  try { return JSON.parse(localStorage.getItem('lf_course_quiz') || '{}')[courseId] || null; }
  catch { return null; }
}

function genCertId(userId, courseId) {
  const base = `LF-${String(courseId).padStart(2, '0')}-${(userId || 'U').toString().slice(0, 4).toUpperCase()}-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  return base;
}

export default function CertificatePage() {
  const { courseId } = useParams();
  const navigate   = useNavigate();
  const { user }   = useAuth();
  const course       = COURSES.find(c => String(c.id) === String(courseId));
  const result     = getQuizResult(String(courseId));

  if (!course) { navigate('/my-courses'); return null; }
  if (!result?.passed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Certificate not yet earned</h2>
          <p className="text-slate-500 font-mono text-sm mb-6">Pass the quiz to unlock your certificate.</p>
          <button onClick={() => navigate(`/quiz/${course.id}`)} className="px-6 py-3 rounded-xl bg-cyan-600 text-white font-bold text-sm hover:bg-cyan-700 transition-all">
            Take the Quiz
          </button>
        </div>
      </div>
    );
  }

  const userName  = user?.name || user?.email?.split('@')[0] || 'Learner';
  const certIdStr = genCertId(user?.id || user?.email, course.id);
  const issueDate = result.date;
  const score     = result.score;

  // ── PDF export via hook ──────────────────────────────────────────
  const exportPdfRef = useRef(null);
  const certRef      = useRef(null);

  usePdfExport(exportPdfRef, certRef, course.title.replace(/\s+/g, '-'), course.title);

  const handleDownload = () => exportPdfRef.current?.();

  // ── Print ────────────────────────────────────────────────────────
  const handlePrint = () => {
    const styleId = '__lf_cert_print__';
    document.getElementById(styleId)?.remove();
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      @media print {
        @page {
          margin: 0;
          size: A4 portrait;
        }
        /* Hide everything on the page */
        html, body {
          height: auto !important;
          overflow: visible !important;
        }
        body > * {
          display: none !important;
        }
        /* Show only the certificate wrapper */
        #__cert_print_root__ {
          display: block !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        #certificate {
          display: block !important;
          width: 100% !important;
          box-shadow: none !important;
          border: none !important;
          border-radius: 0 !important;
          page-break-after: avoid !important;
          break-after: avoid !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        #certificate * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Wrap the certificate in a dedicated print root
    const certEl = document.getElementById('certificate');
    const wrapper = document.createElement('div');
    wrapper.id = '__cert_print_root__';
    certEl.parentNode.insertBefore(wrapper, certEl);
    wrapper.appendChild(certEl);
    document.body.appendChild(wrapper);

    window.print();

    // Restore DOM
    wrapper.parentNode.insertBefore(certEl, wrapper);
    wrapper.remove();
    document.getElementById(styleId)?.remove();
  };

  // ── LinkedIn ─────────────────────────────────────────────────────
  const handleLinkedIn = () => {
    const url = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(course.title)}&organizationName=Learnflow&issueYear=${new Date().getFullYear()}&issueMonth=${new Date().getMonth() + 1}&certUrl=${encodeURIComponent(window.location.href)}&courseId=${certIdStr}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white">

      {/* ── Action bar ── */}
      <div className="print:hidden bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/my-courses')}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 font-mono transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> My Learning
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLinkedIn}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100 transition-all"
            >
              <Linkedin className="w-4 h-4" /> Add to LinkedIn
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 text-white font-semibold text-sm hover:bg-cyan-700 transition-all"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* ── Page body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 print:p-0 print:max-w-none">
        {/*
          Two-column flex layout:
            • Certificate: fixed max-width, centred in remaining space
            • Sidebar: fixed width, hugs the right
        */}
        <div className="flex flex-col lg:flex-row justify-start gap-6 items-start print:block lg:pl-14">

          {/* ── CERTIFICATE ── */}
          <div className="w-full lg:w-[700px] flex-shrink-0 print:w-full">
            <div
              id="certificate"
              ref={certRef}
              className="bg-white rounded-2xl overflow-hidden print:overflow-visible shadow-xl print:shadow-none print:rounded-none border border-slate-200 print:border-0"
            >
              {/* Top accent bar */}
              <div className={`h-3 bg-gradient-to-r ${course.gradient}`} />

              <div className="px-12 pt-10 pb-8">

                {/* ── Header row: logo left, course-id right ── */}
                <div className="flex items-start justify-between mb-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center shadow-md">
                      <svg viewBox="0 0 24 24" className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-900 tracking-tight leading-none">
                        LEARN<span className="text-cyan-600">FLOW</span>
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">Certificate of Completion</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wide">Certificate ID</p>
                    <p className="text-xs font-bold text-slate-600 font-mono mt-0.5">{certIdStr}</p>
                  </div>
                </div>

                {/* ── Main content ── */}
                <div className="text-center mb-10">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] font-mono mb-4">
                    This certifies that
                  </p>
                  <h1
                    className="text-5xl font-black text-slate-900 mb-6"
                    style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.5px' }}
                  >
                    {userName}
                  </h1>

                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] font-mono mb-5">
                    has successfully completed
                  </p>

                  {/* Course pill — solid bg fallback ensures html2canvas captures white text */}
                  <div
                    className={`inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r ${course.gradient} shadow-lg mb-5`}
                    style={{
                      WebkitPrintColorAdjust: 'exact',
                      printColorAdjust: 'exact',
                      backgroundColor: '#0891b2', /* cyan-600 solid fallback for html2canvas */
                    }}
                  >
                    <span style={{ color: '#ffffff', fontSize: '1.5rem', lineHeight: 1, display: 'inline-block' }}>{course.emoji}</span>
                    <h2 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.025em', margin: 0, padding: 0, fontFamily: 'Arial, sans-serif' }}>{course.title}</h2>
                  </div>

                  <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto font-mono">
                    Demonstrating proficiency in {course.desc.split('—')[0].trim().toLowerCase()}.
                  </p>
                </div>

                {/* ── Stats row ── */}
                <div className="grid grid-cols-3 gap-5 mb-10">
                  {[
                    { label: 'Duration',   value: course.duration },
                    { label: 'Level',      value: course.level    },
                    { label: 'Quiz Score', value: `${score} / 5` },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center py-4 px-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mb-2">{label}</p>
                      <p className="text-base font-bold text-slate-800">{value}</p>
                    </div>
                  ))}
                </div>

                {/* ── Skills ── */}
                <div className="mb-10">
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mb-3 text-center">
                    Skills Validated
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {course.lessons.slice(0, 6).map(l => (
                      <span
                        key={l.id}
                        className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-600"
                      >
                        {l.title.split('&')[0].trim().split(' ').slice(0, 3).join(' ')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ── Footer: signature | seal | date ── */}
                <div className="flex items-end justify-between border-t border-slate-200 pt-7">

                  {/* Professional cursive signature */}
                  <div>
                    <svg
                      viewBox="0 0 200 64"
                      className="w-48 h-16 mb-2"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/*
                        "L" — tall capital with descending loop
                      */}
                      <path
                        d="M8 8 C8 8 6 28 8 42 C9 50 14 54 20 52 C26 50 28 44 24 42"
                        stroke="#1e3a5f"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/*
                        "earn" — flowing lowercase joining stroke
                      */}
                      <path
                        d="M24 42 C28 36 34 34 38 38 C40 42 38 48 34 48
                           C38 48 44 46 46 40 C48 34 46 30 50 32
                           C54 34 54 42 58 40 C62 38 64 32 68 34
                           C72 36 70 44 74 42"
                        stroke="#1e3a5f"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/*
                        "nf" — cross-bar on f, upstroke
                      */}
                      <path
                        d="M74 42 C78 32 80 20 84 18 C88 16 90 24 88 30
                           C87 34 90 38 94 36 C98 34 100 26 104 28
                           C108 30 106 42 110 40"
                        stroke="#1e3a5f"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* f crossbar */}
                      <path
                        d="M80 26 L92 24"
                        stroke="#1e3a5f"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        opacity="0.7"
                      />
                      {/*
                        "low" — descending loop + final flourish
                      */}
                      <path
                        d="M110 40 C114 34 118 30 122 32 C126 34 124 44 120 46
                           C124 46 128 42 132 36 C136 30 138 28 142 32
                           C146 36 144 48 148 50 C152 52 156 44 158 38
                           C160 32 164 28 170 32 C176 36 178 46 182 44
                           C186 42 190 36 194 38"
                        stroke="#1e3a5f"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/*
                        Signature underline — tapers right
                      */}
                      <path
                        d="M6 58 Q100 54 194 56"
                        stroke="#1e3a5f"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        opacity="0.2"
                      />
                    </svg>
                    <p className="text-xs font-semibold text-slate-600 font-mono">Learnflow Certifications</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">Authorised Signatory</p>
                  </div>

                  {/* Seal */}
                  <div className="text-center">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${course.gradient} flex items-center justify-center mx-auto mb-2 shadow-md`}
                      style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
                    >
                      <Award className="w-8 h-8" style={{ color: '#ffffff' }} />
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">Blockchain Verified</p>
                  </div>

                  {/* Issue date */}
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">{issueDate}</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">Date of Issue</p>
                  </div>
                </div>

              </div>

              {/* Bottom accent */}
              <div className={`h-1.5 bg-gradient-to-r ${course.gradient}`} />
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <div className="w-full lg:w-72 flex-shrink-0 space-y-4 print:hidden">

            {/* Congrats card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400" fill="currentColor" />
                ))}
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Congratulations!</h3>
              <p className="text-sm text-slate-500 font-mono leading-relaxed">
                You've earned the <span className="text-cyan-600 font-semibold">{course.title}</span> certification. Your credential is now live.
              </p>
            </div>

            {/* What's included */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide font-mono mb-3">Your credential includes</p>
              <div className="space-y-2.5">
                {[
                  [BadgeCheck,  'Blockchain-verified certificate'],
                  [Download,    'Downloadable coloured PDF'],
                  [Linkedin,    'LinkedIn profile badge'],
                  [CheckCircle, 'QR code for recruiter verification'],
                  [Award,       'Learnflow alumni status'],
                ].map(([Icon, text]) => (
                  <div key={text} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <Icon className="w-4 h-4 text-cyan-500 flex-shrink-0" /> {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Share actions */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide font-mono mb-1">Share your achievement</p>
              <button
                onClick={handleLinkedIn}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100 transition-all"
              >
                <Linkedin className="w-4 h-4" /> Add to LinkedIn Profile
              </button>
              <button
                onClick={handlePrint}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-cyan-600 text-white font-semibold text-sm hover:bg-cyan-700 transition-all"
              >
                <Printer className="w-4 h-4" /> Print Certificate
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: course.title,
                      text: `I just earned the ${course.title} certification from Learnflow!`,
                      url: window.location.href,
                    });
                  }
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all"
              >
                <Share2 className="w-4 h-4" /> Share Certificate
              </button>
            </div>

            {/* Next steps */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide font-mono mb-3">Next steps</p>
              <div className="space-y-2">
                {COURSES.filter(c => c.id !== course.id).slice(0, 3).map(c => (
                  <button
                    key={c.id}
                    onClick={() => navigate(`/certifications/${c.id}`)}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 transition-all text-left"
                  >
                    <span className="text-lg">{c.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{c.title}</p>
                      <p className="text-xs text-slate-400 font-mono">{c.duration} · {c.level}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>{/* end sidebar */}

        </div>
      </div>
    </div>
  );
}