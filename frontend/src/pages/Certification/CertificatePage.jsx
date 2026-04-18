import { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CERTS } from '../../data/certsData';
import { Award, Download, Share2, ArrowLeft, Star, Linkedin, Printer } from 'lucide-react';
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

  const exportPdfRef = useRef(null);
  const certRef = useRef(null);

  usePdfExport(exportPdfRef, certRef, cert?.title?.replace(/\s+/g, '-') || 'certificate', "Official Certificate");

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
  const handlePrint = () => window.print();

  const handleLinkedIn = () => {
    const url = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(cert.title)}&organizationName=Learnflow&issueYear=${new Date().getFullYear()}&issueMonth=${new Date().getMonth() + 1}&certUrl=${encodeURIComponent(window.location.href)}&certId=${certIdStr}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white">
      {/* ── Action bar ── */}
      <div className="print:hidden bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <button onClick={() => navigate('/my-courses')} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 font-mono transition-colors">
            <ArrowLeft className="w-4 h-4" /> My Courses
          </button>
          <div className="flex items-center gap-2">
            <button onClick={handleLinkedIn} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100 transition-all">
              <Linkedin className="w-4 h-4" /> Add to LinkedIn
            </button>
            <button onClick={handleDownload} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 text-white font-semibold text-sm hover:bg-cyan-700 transition-all">
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* ── Page body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 print:p-0 print:max-w-none">
        <div className="flex flex-col lg:flex-row justify-start gap-6 items-start print:block lg:pl-14">

          {/* ── CERTIFICATE ── */}
          <div className="w-full lg:w-[700px] flex-shrink-0 print:w-full">
            <div id="certificate" ref={certRef} className="bg-white overflow-hidden print:overflow-visible shadow-xl print:shadow-none border border-slate-200 print:border-0 print:rounded-none">
  <div className={`h-4 bg-gradient-to-r ${cert.gradient}`} style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }} />
              <div className="px-14 py-20 flex flex-col justify-between min-h-[980px] h-[980px]">
                
                <div className="flex items-start justify-between mb-8">
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
                <div className="text-center">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] font-mono mb-4">This certifies that</p>
                  <h1 className="text-5xl font-black text-slate-900 mb-6" style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.5px' }}>{userName}</h1>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] font-mono mb-5">has successfully completed</p>
                  
                 {/* The Final Bulletproof Centered Badge */}
<div className="flex justify-center mb-5">
  <div 
    className="inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl shadow-lg"
    style={{ 
      backgroundColor: '#0D9488', 
      printColorAdjust: 'exact', 
      WebkitPrintColorAdjust: 'exact',
      minWidth: '380px' 
    }}
  >
    <span style={{ color: '#ffffff', fontSize: '1.5rem', lineHeight: 1 }}>{cert.emoji}</span>
    <h2 style={{ 
      color: '#ffffff', 
      fontSize: '1.25rem', 
      fontWeight: '900', 
      fontFamily: 'sans-serif', 
      margin: 0,
      display: 'flex',
      alignItems: 'center'
    }}>
      {cert.title}
    </h2>
  </div>
</div>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto font-mono mb-8">
                    Demonstrating proficiency in {cert.desc.split('—')[0].trim().toLowerCase()}.
                  </p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-5 mb-8">
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
                <div className="mb-8">
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mb-3 text-center">Skills Validated</p>
                  <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
  {cert.lessons.slice(0, 6).map(l => (
    <span 
      key={l.id} 
      className="inline-flex items-center justify-center px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-600 font-bold"
      style={{ minHeight: '32px' }}
    >
      {l.title.split('&')[0].trim().split(' ').slice(0, 3).join(' ')}
    </span>
  ))}
</div>
                </div>

                {/* Footer section */}
                <div className="flex items-end justify-between border-t border-slate-200 pt-10">
                  <div>
                    <svg viewBox="0 0 200 64" className="w-48 h-16 mb-2" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M 10 45 C 20 10, 35 5, 40 15 C 45 25, 35 50, 25 50 C 15 50, 15 35, 45 35" stroke="#1e3a5f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 45 35 C 52 25, 55 45, 62 35 C 67 28, 70 42, 75 35 C 80 28, 85 45, 90 38" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 100 45 C 115 10, 130 5, 125 20 C 120 35, 100 40, 115 50 C 125 55, 135 40, 130 35" stroke="#1e3a5f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 130 35 C 138 28, 142 45, 148 38 C 153 32, 157 44, 162 38 C 168 32, 172 45, 178 38 C 183 32, 188 45, 192 40" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 5 58 Q 100 68 195 52" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
                    </svg>
                    <p className="text-xs font-semibold text-slate-600 font-mono">Learnflow Certifications</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-1.5">Authorised Signatory</p>
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
              <button onClick={handlePrint} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-cyan-600 text-white font-semibold text-sm hover:bg-cyan-700 transition-all shadow-sm">
                <Printer className="w-4 h-4" /> Print Certificate
              </button>
              <button onClick={() => navigator.share?.({ title: cert.title, url: window.location.href })} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all border-dashed">
                <Share2 className="w-4 h-4" /> Share Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
