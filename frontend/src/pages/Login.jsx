import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Zap, ArrowRight, Loader2, Shield, Award, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const PERKS = [
  { icon: Users, text: '50,000+ learners across India' },
  { icon: Award, text: 'Blockchain-verified certificates' },
  { icon: Shield, text: '7-day money-back guarantee' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name?.split(' ')[0]}! 👋`);
      navigate('/');
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Invalid email or password');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="absolute inset-0 [background-image:linear-gradient(rgba(8,145,178,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(8,145,178,0.06)_1px,transparent_1px)] [background-size:40px_40px] opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-100/40 blur-[100px] rounded-full pointer-events-none" />
      <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

        {/* Left panel */}
        <div className="hidden lg:flex flex-col justify-center p-8 bg-gradient-to-br from-cyan-600 to-violet-700 rounded-3xl text-white relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/10 rounded-full" />
          <div className="relative">
            <Link to="/" className="flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center"><Zap className="w-4 h-4 text-white" /></div>
              <span className="text-xl font-bold text-white">Learnflow</span>
            </Link>
            <h2 className="text-3xl font-bold text-white mb-3">Welcome back!</h2>
            <p className="text-cyan-100 font-sans text-sm mb-8 leading-relaxed">Continue your learning journey with India's best online learning platform.</p>
            <div className="space-y-4">
              {PERKS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center flex-shrink-0"><Icon className="w-4 h-4 text-white" /></div>
                  <span className="text-sm text-cyan-100 font-sans">{text}</span>
                </div>
              ))}
            </div>
            <div className="mt-10 p-4 bg-white/10 border border-white/20 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex -space-x-2">{['AK', 'PS', 'RN', 'VM'].map(a => <div key={a} className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-cyan-400 to-violet-400 flex items-center justify-center text-[10px] font-bold text-white">{a}</div>)}</div>
                <p className="text-sm font-semibold text-white">2,800+ joined this month</p>
              </div>
              <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}</div>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="animate-fade-up self-start">
          <div className="flex justify-center mb-6 lg:hidden">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center shadow-sm"><Zap className="w-5 h-5 text-white" /></div>
              <span className="text-xl font-bold text-slate-900">Learn<span className="text-cyan-600">flow</span></span>
            </Link>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 min-h-[420px]">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Login to Learnflow</h1>
            <p className="text-sm text-slate-500 font-sans mb-8">Enter your credentials to continue</p>

            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">

              {/* Off-screen decoy fields — Chrome autofills these instead of real ones */}
              <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
                <input type="text" tabIndex={-1} readOnly />
                <input type="password" tabIndex={-1} readOnly />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 font-sans mb-2">Email address</label>
                <input
                  type="email"
                  name="learnflow_email"
                  autoComplete="off"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm transition-all duration-200 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-600 font-sans">Password</label>
                  <Link to="/forgot-password" className="text-xs text-cyan-600 hover:text-cyan-700 font-sans transition-colors">Forgot password?</Link>
                </div>
                <div className="relative">
                  <input
                    type={show ? 'text' : 'password'}
                    name="learnflow_password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm transition-all duration-200 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 pr-11"
                  />
                  <button type="button" onClick={() => setShow(o => !o)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 transition-colors">
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-cyan-600 text-white font-semibold text-sm transition-all duration-200 hover:bg-cyan-700 active:scale-[0.98] w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed shadow-sm">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Logging in…</> : <>Login<ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-slate-500 font-sans mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-cyan-600 hover:text-cyan-700 font-semibold transition-colors">Create one free →</Link>
          </p>
        </div>

      </div>
    </div>
  );
}