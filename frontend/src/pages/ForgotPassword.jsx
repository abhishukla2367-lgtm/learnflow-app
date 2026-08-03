import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Zap, ArrowRight, Loader2, Mail } from "lucide-react";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const fieldKey = useMemo(() => `reset_em_${Math.random().toString(36).substring(7)}`, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsSent(true);
        setEmail("");
        toast.success("Reset link sent to your email!");
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 [background-image:linear-gradient(rgba(8,145,178,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(8,145,178,0.06)_1px,transparent_1px)] [background-size:40px_40px] opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-100/40 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center shadow-sm">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Learno<span className="text-cyan-600">days</span></span>
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-100 mx-auto mb-5">
            <Mail className="w-5 h-5 text-cyan-600" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-1 text-center">Reset your password</h1>
          <p className="text-sm text-slate-500 font-sans mb-8 text-center leading-relaxed">
            Enter your registered email and we'll send a secure reset link.
          </p>

          {isSent && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-center text-sm font-semibold text-green-700">
              ✅ Reset link sent! Check your inbox.
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
            <input type="text" tabIndex={-1} aria-hidden="true" style={{ display: "none" }} readOnly />

            <div>
              <label className="block text-xs font-semibold text-slate-600 font-sans mb-2">
                Email address
              </label>
              <input
                type="email"
                name={fieldKey}
                autoComplete="new-password"
                readOnly
                onFocus={e => e.target.removeAttribute("readonly")}
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm transition-all duration-200 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-cyan-600 text-white font-semibold text-sm transition-all duration-200 hover:bg-cyan-700 active:scale-[0.98] w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                : <>Send Reset Link <ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 font-sans mt-5">
          Remembered it?{" "}
          <Link to="/login" className="text-cyan-600 hover:text-cyan-700 font-semibold transition-colors">
            Back to Login →
          </Link>
        </p>
      </div>
    </div>
  );
}