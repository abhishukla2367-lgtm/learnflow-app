import { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CERTS } from '../../data/certsData';
import { Award, Download, Share2, ArrowLeft, CheckCircle, Star, BadgeCheck, Linkedin, Printer } from 'lucide-react';
import usePdfExport from '../../components/admin/shared/usePdfExport';

function getQuizResult(certId) {
  try { return JSON.parse(localStorage.getItem('lf_quiz') || '{}')[certId] || null; }
  catch { return null; }
}

function genCertId(userId, certId) {
  const base = `LF-${String(certId).padStart(2, '0')}-${(userId || 'U').toString().slice(0, 4).toUpperCase()}-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  return base;
}

export default function CertificatePage() {
  const { certId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const cert = CERTS.find(c => String(c.id) === String(certId));
  const result = getQuizResult(String(certId));
  const LOGO_URL = 'https://res.cloudinary.com/db2vju4mv/image/upload/q_auto/f_auto/v1775046563/p1_l90afj.webp';

  // ── PDF export via hook ──────────────────────────────────────────
  const exportPdfRef = useRef(null);
  const certRef = useRef(null);

  usePdfExport(exportPdfRef, certRef, cert?.title?.replace(/\s+/g, '-') || 'cert', cert?.title || '');

  if (!cert) { navigate('/my-courses'); return null; }
  
  if (!result?.passed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Certificate not yet earned</h2>
          <p className="text-slate-500 font-mono text-sm mb-6">Pass the quiz to unlock your certificate.</p>
          <button onClick={() => navigate(`/quiz/${cert.id}`)} className="px-6 py-3 rounded-xl bg-cyan-600 text-white font-bold text-sm hover:bg-cyan-700 transition-all">
            Take the Quiz
          </button>
        </div>
      </div>
    );
  }

  const userName = user?.name || user?.email?.split('@')[0] || 'Learner';
  const certIdStr = genCertId(user?.id || user?.email, cert.id);
  const issueDate = result.date;
  const score = result.score;

  const handleDownload = () => exportPdfRef.current?.();

  // ── Print Logic ──────────────────────────────────────────────────
  const handlePrint = () => {
    const styleId = '__lf_cert_print__';
    document.getElementById(styleId)?.remove();
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      @media print {
        @page { margin: 0; size: A4 portrait; }
        html, body { height: auto !important; overflow: visible !important; }
        body > * { display: none !important; }
        #__cert_print_root__ {
          display: block !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
        }
        #certificate {
          display: block !important;
          width: 100% !important;
          box-shadow: none !important;
          border: none !important;
          border-radius: 0 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `;
    document.head.appendChild(style);

    const certEl = document.getElementById('certificate');
    const wrapper = document.createElement('div');
    wrapper.id = '__cert_print_root__';
    certEl.parentNode.insertBefore(wrapper, certEl);
    wrapper.appendChild(certEl);
    document.body.appendChild(wrapper);

    window.print();

    wrapper.parentNode.insertBefore(certEl, wrapper);
    wrapper.remove();
    document.getElementById(styleId)?.remove();
  };

  const handleLinkedIn = () => {
    const url = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(cert.title)}&organizationName=Learnflow&issueYear=${new Date().getFullYear()}&issueMonth=${new Date().getMonth() + 1}&certUrl=${encodeURIComponent(window.location.href)}&certId=${certIdStr}`;
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
            <ArrowLeft className="w-4 h-4" /> My Courses
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
        <div className="flex flex-col lg:flex-row justify-start gap-6 items-start print:block lg:pl-14">

          {/* ── CERTIFICATE ── */}
          <div className="w-full lg:w-[700px] flex-shrink-0 print:w-full">
            <div
              id="certificate"
              ref={certRef}
              className="bg-white rounded-2xl overflow-hidden print:overflow-visible shadow-xl print:shadow-none print:rounded-none border border-slate-200 print:border-0"
            >
              <div className={`h-3 bg-gradient-to-r ${cert.gradient}`} />

              <div className="px-12 pt-10 pb-8">
                {/* Header row */}
                <div className="flex items-start justify-between mb-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-black flex items-center justify-center shadow-md overflow-hidden">
                      <img src={LOGO_URL} alt="Logo" className="w-full h-full object-cover" crossOrigin="anonymous" />
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

                {/* Main content */}
                <div className="text-center mb-10">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] font-mono mb-4">
                    This certifies that
                  </p>
                  <h1 className="text-5xl font-black text-slate-900 mb-6" style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.5px' }}>
                    {userName}
                  </h1>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] font-mono mb-5">
                    has successfully completed
                  </p>
                  <div
                    className={`inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r ${cert.gradient} shadow-lg mb-5`}
                    style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact', backgroundColor: '#0891b2' }}
                  >
                    <span style={{ color: '#ffffff', fontSize: '1.5rem', lineHeight: 1 }}>{cert.emoji}</span>
                    <h2 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 900, fontFamily: 'Arial, sans-serif' }}>{cert.title}</h2>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto font-mono">
                    Demonstrating proficiency in {cert.desc.split('—')[0].trim().toLowerCase()}.
                  </p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-5 mb-10">
                  {[
                    { label: 'Duration', value: cert.duration },
                    { label: 'Level', value: cert.level },
                    { label: 'Quiz Score', value: `${score} / 5` },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center py-4 px-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mb-2">{label}</p>
                      <p className="text-base font-bold text-slate-800">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Skills section */}
                <div className="mb-10">
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mb-3 text-center">
                    Skills Validated
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {cert.lessons.slice(0, 6).map(l => (
                      <span key={l.id} className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-600">
                        {l.title.split('&')[0].trim().split(' ').slice(0, 3).join(' ')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer section */}
                <div className="flex items-end justify-between border-t border-slate-200 pt-7">
                  <div>
                    <svg viewBox="0 0 200 64" className="w-48 h-16 mb-2" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 8 C8 8 6 28 8 42 C9 50 14 54 20 52 C26 50 28 44 24 42" stroke="#1e3a5f" strokeWidth="2.2" strokeLinecap="round" />
                      <path d="M24 42 C28 36 34 34 38 38 C40 42 38 48 34 48 C38 48 44 46 46 40 C48 34 46 30 50 32" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" />
                      <path d="M74 42 C78 32 80 20 84 18 C88 16 90 24 88 30 C87 34 90 38 94 36" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" />
                      <path d="M6 58 Q100 54 194 56" stroke="#1e3a5f" strokeWidth="1.2" strokeLinecap="round" opacity="0.2" />
                    </svg>
                    <p className="text-xs font-semibold text-slate-600 font-mono">Learnflow Certifications</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">Authorised Signatory</p>
                  </div>
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${cert.gradient} flex items-center justify-center mx-auto mb-2 shadow-md`} style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">Blockchain Verified</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">{issueDate}</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">Date of Issue</p>
                  </div>
                </div>
              </div>
              <div className={`h-1.5 bg-gradient-to-r ${cert.gradient}`} />
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <div className="w-full lg:w-72 flex-shrink-0 space-y-4 print:hidden">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400" fill="currentColor" />)}
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Congratulations!</h3>
              <p className="text-sm text-slate-500 font-mono leading-relaxed">
                You've earned the <span className="text-cyan-600 font-semibold">{cert.title}</span> certification.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide font-mono mb-1">Actions</p>
              <button onClick={handleLinkedIn} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100 transition-all">
                <Linkedin className="w-4 h-4" /> Add to LinkedIn
              </button>
              <button onClick={handlePrint} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-cyan-600 text-white font-semibold text-sm hover:bg-cyan-700 transition-all">
                <Printer className="w-4 h-4" /> Print Certificate
              </button>
              <button
                onClick={() => navigator.share?.({ title: cert.title, url: window.location.href })}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all"
              >
                <Share2 className="w-4 h-4" /> Share Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}