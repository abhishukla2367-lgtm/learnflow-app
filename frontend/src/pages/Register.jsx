import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, ArrowRight, Loader2, CheckCircle2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const PERKS = [
  'Free access to 50+ courses',
  "Live sessions with India's best instructors",
  'AI-powered progress tracking',
  'Blockchain-verified certificates',
  'Placement support & mock interviews',
];

function PasswordStrength({ pw }) {
  const checks = [pw.length >= 8, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)];
  const score = checks.filter(Boolean).length;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['bg-slate-200', 'bg-red-400', 'bg-amber-400', 'bg-cyan-400', 'bg-emerald-500'];
  if (!pw) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1,2,3,4].map(i => <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= score ? colors[score] : 'bg-slate-200'}`} />)}
      </div>
      <p className={`text-xs font-mono ${score >= 3 ? 'text-emerald-600' : score >= 2 ? 'text-cyan-600' : 'text-amber-600'}`}>{labels[score]}</p>
    </div>
  );
}

/* ── Step 1: Registration form ───────────────────────────── */
function StepOne({ form, set, onNext, loading, show, setShow }) {
  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    onNext();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
      <h1 className="text-2xl font-black text-slate-900 mb-1">Create your account</h1>
      <p className="text-sm text-slate-500 font-sans mb-6">We'll send a verification code to your email</p>

      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
        <input type="text" tabIndex={-1} aria-hidden="true" style={{ display: 'none' }} readOnly />
        <input type="password" tabIndex={-1} aria-hidden="true" style={{ display: 'none' }} readOnly />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 font-sans mb-1.5">Full name *</label>
            <input type="text" name="lf_name" autoComplete="new-password" readOnly onFocus={e => e.target.removeAttribute('readonly')}
              placeholder="Rahul Sharma" value={form.name} onChange={e => set('name', e.target.value)} required
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 font-sans mb-1.5">Phone (optional)</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-500 text-sm font-mono">+91</span>
              <input type="tel" name="lf_phone" autoComplete="new-password" readOnly onFocus={e => e.target.removeAttribute('readonly')}
                placeholder="98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all rounded-l-none" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 font-sans mb-1.5">Email address *</label>
          <input type="email" name="lf_email" autoComplete="new-password" readOnly onFocus={e => e.target.removeAttribute('readonly')}
            placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} required
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 font-sans mb-1.5">Password *</label>
          <div className="relative">
            <input type={show ? 'text' : 'password'} name="lf_password" autoComplete="new-password" readOnly onFocus={e => e.target.removeAttribute('readonly')}
              placeholder="Min 8 characters" value={form.password} onChange={e => set('password', e.target.value)} required
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 pr-11 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all" />
            <button type="button" onClick={() => setShow(o => !o)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 transition-colors">
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <PasswordStrength pw={form.password} />
        </div>

        <button type="submit" disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-600 text-white font-black text-sm hover:bg-cyan-700 active:scale-[0.98] w-full justify-center disabled:opacity-60 shadow-sm mt-2 transition-colors">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending OTP…</> : <>Continue <ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500 font-sans mt-5 leading-relaxed">
        By signing up you agree to our{' '}<Link to="/terms" className="text-cyan-600 hover:text-cyan-700">Terms</Link> and{' '}<Link to="/privacy" className="text-cyan-600 hover:text-cyan-700">Privacy Policy</Link>.
      </p>
    </div>
  );
}

/* ── Step 2: OTP Verification ───────────────────────────── */
function StepTwo({ email, onVerify, onResend, loading, resending }) {
  const [otp, setOtp] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (otp.trim().length < 4) { toast.error('Enter the OTP sent to your email'); return; }
    onVerify(otp.trim());
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-2xl mx-auto mb-4">📧</div>
        <h1 className="text-2xl font-black text-slate-900 mb-1">Verify your email</h1>
        <p className="text-sm text-slate-500 font-sans">
          We sent a 6-digit OTP to <span className="font-semibold text-slate-700">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-600 font-sans mb-1.5">Enter OTP</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-4 text-slate-900 placeholder-slate-300 text-2xl font-mono tracking-widest text-center focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all"
          />
        </div>

        <button type="submit" disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-600 text-white font-black text-sm hover:bg-cyan-700 active:scale-[0.98] w-full justify-center disabled:opacity-60 shadow-sm transition-colors">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</> : <><CheckCircle2 className="w-4 h-4" /> Verify & Create Account</>}
        </button>

        <button type="button" onClick={onResend} disabled={resending}
          className="inline-flex items-center gap-2 text-sm text-cyan-600 hover:text-cyan-700 font-semibold font-sans w-full justify-center transition-colors disabled:opacity-50 mt-1">
          <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
          {resending ? 'Resending…' : "Didn't receive? Resend OTP"}
        </button>
      </form>
    </div>
  );
}

/* ── Main Register ───────────────────────────────────────── */
export default function Register() {
  const navigate        = useNavigate();
  const [step, setStep] = useState(1); // 1 = form, 2 = OTP
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'student' });
  const [show, setShow] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [resending, setResending] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // Step 1: Send OTP
  const handleSendOTP = async () => {
    setLoading(true);
    try {
      await api.post('/otp/send-otp', {
        name:     form.name,
        email:    form.email,
        password: form.password,
        phone:    form.phone,
        role:     form.role,
      });
      toast.success('OTP sent to ' + form.email);
      setStep(2);
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async otp => {
    setLoading(true);
    try {
      const res = await api.post('/otp/verify-otp', { email: form.email, otp });
      // Save token & user if returned
      if (res.data?.token) {
        localStorage.setItem('lf_token', res.data.token);
        localStorage.setItem('lf_user', JSON.stringify(res.data.user ?? res.data));
      }
      toast.success('Account created! Welcome to Learnodays 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setResending(true);
    try {
      await api.post('/otp/resend-otp', { email: form.email });
      toast.success('OTP resent!');
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Failed to resend');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 [background-image:linear-gradient(rgba(8,145,178,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(8,145,178,0.06)_1px,transparent_1px)] [background-size:40px_40px] opacity-60 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-violet-100/30 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left marketing panel */}
        <div className="hidden lg:block">
          <Link to="/" className="flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center shadow-sm"><Zap className="w-5 h-5 text-white" /></div>
            <span className="text-xl font-black text-slate-900">Learno<span className="text-cyan-600">days</span></span>
          </Link>
          <h2 className="text-3xl font-black text-slate-900 mb-4 leading-tight">
            Join India's fastest-growing<br />learning community.
          </h2>
          <p className="text-slate-600 font-sans text-sm mb-8 leading-relaxed">Trusted by 50,000+ professionals from fresh graduates to senior engineers.</p>
          <ul className="space-y-3 mb-8">
            {PERKS.map(p => (
              <li key={p} className="flex items-center gap-3 text-sm text-slate-600 font-sans">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />{p}
              </li>
            ))}
          </ul>
          {/* Step indicator */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-500 font-sans mb-3 uppercase tracking-wide">Registration steps</p>
            <div className="flex items-center gap-3">
              {[{ n: 1, label: 'Your details' }, { n: 2, label: 'Verify email' }].map(({ n, label }) => (
                <div key={n} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-colors ${step === n ? 'bg-cyan-600 text-white' : step > n ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {step > n ? '✓' : n}
                  </div>
                  <span className={`text-xs font-sans ${step >= n ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>{label}</span>
                  {n < 2 && <div className="w-6 h-px bg-slate-200" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div>
          {/* Mobile logo */}
          <div className="flex justify-center mb-6 lg:hidden">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center shadow-sm"><Zap className="w-5 h-5 text-white" /></div>
              <span className="text-xl font-black text-slate-900">Learn<span className="text-cyan-600">flow</span></span>
            </Link>
          </div>

          {step === 1 && (
            <StepOne form={form} set={set} onNext={handleSendOTP} loading={loading} show={show} setShow={setShow} />
          )}
          {step === 2 && (
            <StepTwo email={form.email} onVerify={handleVerifyOTP} onResend={handleResend} loading={loading} resending={resending} />
          )}

          <p className="text-center text-sm text-slate-500 font-sans mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-600 hover:text-cyan-700 font-bold transition-colors">Login →</Link>
          </p>
          {step === 2 && (
            <p className="text-center text-xs text-slate-400 font-sans mt-2">
              <button onClick={() => setStep(1)} className="text-slate-500 hover:text-slate-700 font-semibold transition-colors">← Back to form</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
