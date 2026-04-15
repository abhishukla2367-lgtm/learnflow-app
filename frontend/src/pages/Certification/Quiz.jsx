import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CERTS } from '../../data/certsData';
import {
  Clock, CheckCircle, X, Trophy, AlertCircle,
  ArrowLeft, ArrowRight, RotateCcw, Award
} from 'lucide-react';

const PASS_SCORE = 4;
const TOTAL_SECONDS = 15 * 60; // 15 minutes

/* ── localStorage helpers ── */
function saveQuizResult(certId, score, passed) {
  try {
    const all = JSON.parse(localStorage.getItem('lf_quiz') || '{}');
    all[certId] = {
      score, 
      passed,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    localStorage.setItem('lf_quiz', JSON.stringify(all));

    // Also sync with lf_progress to keep CertCoursePlayer updated
    const allProgress = JSON.parse(localStorage.getItem('lf_progress') || '{}');
    if (allProgress[certId]) {
        allProgress[certId].quizPassed = passed;
        localStorage.setItem('lf_progress', JSON.stringify(allProgress));
    }
  } catch (e) {
    console.error("Failed to save quiz result", e);
  }
}

function Timer({ seconds }) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const pct = (seconds / TOTAL_SECONDS) * 100;
  const urgent = seconds < 60;
  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border font-mono text-sm font-bold ${urgent ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
      <Clock className={`w-4 h-4 ${urgent ? 'text-red-500' : 'text-slate-500'}`} />
      <span>{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}</span>
      <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div className={`h-1.5 rounded-full transition-all ${urgent ? 'bg-red-500' : 'bg-cyan-500'}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function Quiz() {
  const { certId } = useParams();
  const navigate = useNavigate();
  const cert = CERTS.find(c => String(c.id) === String(certId));

  const [phase, setPhase] = useState('intro'); // intro | quiz | result
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [submitted, setSubmitted] = useState(false);
  const timerRef = useRef(null);

  // 1. SECURITY REDIRECT: If already passed, go to certificate
  useEffect(() => {
    if (!cert) {
        navigate('/my-courses');
        return;
    }

    try {
        const allQuiz = JSON.parse(localStorage.getItem('lf_quiz') || '{}');
        const record = allQuiz[certId];
        if (record && record.passed) {
            // Prevent re-taking if already passed
            navigate(`/certificate/${certId}`, { replace: true });
        }
    } catch (e) {}
  }, [cert, certId, navigate]);

  // 2. TIMER LOGIC
  useEffect(() => {
    if (phase === 'quiz' && !submitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { 
            clearInterval(timerRef.current); 
            handleSubmit(true); 
            return 0; 
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase, submitted]);

  if (!cert) return null;

  const questions = cert.quiz || [];
  const score = questions.filter((q, i) => answers[i] === q.correct).length;
  const passed = score >= PASS_SCORE;

  function handleSubmit(auto = false) {
    clearInterval(timerRef.current);
    setSubmitted(true);
    const finalScore = questions.filter((q, i) => answers[i] === q.correct).length;
    const isPassed = finalScore >= PASS_SCORE;
    
    saveQuizResult(certId, finalScore, isPassed);
    setPhase('result');
  }

  function handleAnswer(qIdx, optIdx) {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  }

  const answeredCount = Object.keys(answers).length;

  /* ── INTRO PHASE ── */
  if (phase === 'intro') return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className={`h-1.5 bg-gradient-to-r ${cert.gradient}`} />
        <div className="p-8">
          <div className="text-center mb-6">
            <span className="text-5xl">{cert.emoji}</span>
            <h1 className="text-2xl font-bold text-slate-900 mt-4 mb-1">Assessment Quiz</h1>
            <p className="text-slate-500 font-mono text-sm">{cert.title}</p>
          </div>
          <div className="space-y-3 mb-8">
            {[
              [`${questions.length} multiple-choice questions`, CheckCircle, 'text-cyan-500'],
              ['15 minutes to complete', Clock, 'text-amber-500'],
              [`Pass mark: ${PASS_SCORE}/${questions.length} (${Math.round((PASS_SCORE / questions.length) * 100)}%)`, Trophy, 'text-emerald-500'],
              ['Unlimited retries if you don\'t pass', RotateCcw, 'text-violet-500'],
            ].map(([text, Icon, color]) => (
              <div key={text} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <Icon className={`w-4 h-4 ${color} flex-shrink-0`} />
                <p className="text-sm text-slate-700 font-mono">{text}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => { setPhase('quiz'); setTimeLeft(TOTAL_SECONDS); setCurrent(0); setAnswers({}); setSubmitted(false); }}
            className={`w-full py-3.5 rounded-xl bg-gradient-to-r ${cert.gradient} text-white font-bold text-base transition-all hover:opacity-90 active:scale-[0.98]`}
          >
            Start Quiz
          </button>
          <button onClick={() => navigate(-1)} className="w-full mt-3 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Course
          </button>
        </div>
      </div>
    </div>
  );

  /* ── RESULT PHASE ── */
  if (phase === 'result') return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className={`h-1.5 bg-gradient-to-r ${cert.gradient}`} />
        <div className="p-8 text-center">
          <div className={`w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center ${passed ? 'bg-emerald-100' : 'bg-red-100'}`}>
            {passed ? <Trophy className="w-10 h-10 text-emerald-600" /> : <X className="w-10 h-10 text-red-500" />}
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${passed ? 'text-emerald-700' : 'text-red-600'}`}>
            {passed ? 'You Passed! 🎉' : 'Not Quite'}
          </h1>
          <p className="text-slate-500 font-mono text-sm mb-2">
            {passed ? 'Congratulations! You\'ve earned your certificate.' : `You need ${PASS_SCORE}/${questions.length} to pass. Keep trying!`}
          </p>

          <div className="my-6">
            <div className={`inline-flex items-center justify-center w-28 h-28 rounded-full border-4 ${passed ? 'border-emerald-500 bg-emerald-50' : 'border-red-400 bg-red-50'}`}>
              <div>
                <p className={`text-3xl font-black ${passed ? 'text-emerald-700' : 'text-red-600'}`}>{score}/{questions.length}</p>
                <p className="text-xs text-slate-400 font-mono text-center">{Math.round((score / questions.length) * 100)}%</p>
              </div>
            </div>
          </div>

          <div className="text-left space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {questions.map((q, i) => {
              const userAns = answers[i];
              const correct = q.correct;
              const isRight = userAns === correct;
              return (
                <div key={i} className={`p-4 rounded-xl border ${isRight ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-start gap-2 mb-2">
                    {isRight ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /> : <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />}
                    <p className="text-xs font-semibold text-slate-800">{q.q}</p>
                  </div>
                  {!isRight && (
                    <p className="text-xs text-emerald-700 font-mono ml-6">
                      ✓ {q.options[correct]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-3">
            {passed ? (
              <button
                onClick={() => navigate(`/certificate/${certId}`)}
                className={`w-full py-3.5 rounded-xl bg-gradient-to-r ${cert.gradient} text-white font-bold text-base transition-all hover:opacity-90`}
              >
                <span className="flex items-center justify-center gap-2"><Award className="w-5 h-5" /> View My Certificate</span>
              </button>
            ) : (
              <button
                onClick={() => { setPhase('intro'); setAnswers({}); setCurrent(0); setSubmitted(false); setTimeLeft(TOTAL_SECONDS); }}
                className="w-full py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-base transition-all"
              >
                <span className="flex items-center justify-center gap-2"><RotateCcw className="w-4 h-4" /> Try Again</span>
              </button>
            )}
            <button onClick={() => navigate('/my-courses')} className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all">
              Back to My Courses
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── QUIZ PHASE ── */
  const q = questions[current];
  const progressPct = ((current + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">{cert.emoji}</span>
            <div>
              <p className="text-xs text-slate-400 font-mono">Assessment</p>
              <p className="text-sm font-bold text-slate-800">{cert.title}</p>
            </div>
          </div>
          <Timer seconds={timeLeft} />
        </div>
        <div className="w-full h-1 bg-slate-100">
          <div className={`h-1 bg-gradient-to-r ${cert.gradient} transition-all duration-500`} style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-slate-500 font-mono">Question {current + 1} of {questions.length}</span>
          <span className="text-sm text-slate-500 font-mono">{answeredCount}/{questions.length} answered</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 leading-relaxed mb-6">{q.q}</h2>
          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              const selected = answers[current] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(current, idx)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left transition-all ${
                    selected
                      ? `border-cyan-500 bg-cyan-50 text-cyan-900`
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all ${selected ? 'border-cyan-500 bg-cyan-500 text-white' : 'border-slate-300 text-slate-400'}`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-sm font-medium">{opt}</span>
                  {selected && <CheckCircle className="w-4 h-4 text-cyan-500 ml-auto flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrent(c => Math.max(0, c - 1))}
            disabled={current === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex gap-1.5">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === current ? 'bg-cyan-600 scale-125' :
                  answers[i] !== undefined ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>

          {current < questions.length - 1 ? (
            <button
              onClick={() => setCurrent(c => c + 1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm transition-all"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => handleSubmit()}
              disabled={answeredCount < questions.length}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              {answeredCount < questions.length ? `Answer all (${answeredCount}/${questions.length})` : 'Submit Quiz'}
            </button>
          )}
        </div>

        {current === questions.length - 1 && answeredCount < questions.length && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <p className="text-xs text-amber-700 font-mono">{questions.length - answeredCount} question{questions.length - answeredCount > 1 ? 's' : ''} unanswered. You must answer all questions to submit.</p>
          </div>
        )}
      </div>
    </div>
  );
}