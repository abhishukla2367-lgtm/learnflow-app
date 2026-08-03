import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Zap, ArrowRight, Loader2, Eye, EyeOff, KeyRound } from "lucide-react";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pwdReady, setPwdReady] = useState(true);
  const [confirmReady, setConfirmReady] = useState(true);

  const pwdKey     = useMemo(() => `pwd_${Math.random().toString(36).substring(7)}`, []);
  const confirmKey = useMemo(() => `cpwd_${Math.random().toString(36).substring(7)}`, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return toast.error("Passwords do not match.");
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password reset! Redirecting to login…");
        setTimeout(() => navigate("/login"), 2500);
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
            <KeyRound className="w-5 h-5 text-cyan-600" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-1 text-center">Set new password</h1>
          <p className="text-sm text-slate-500 font-sans mb-8 text-center">
            Choose a strong password for your account.
          </p>

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
            <input type="password" tabIndex={-1} aria-hidden="true" style={{ display: "none" }} readOnly />

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 font-sans mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  name={pwdKey}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setPwdReady(false)}
                  readOnly={pwdReady}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 pr-11 text-slate-900 placeholder-slate-400 text-sm transition-all duration-200 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 font-sans mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name={confirmKey}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  onFocus={() => setConfirmReady(false)}
                  readOnly={confirmReady}
                  placeholder="Re-enter new password"
                  autoComplete="new-password"
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 pr-11 text-slate-900 placeholder-slate-400 text-sm transition-all duration-200 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-cyan-600 text-white font-semibold text-sm transition-all duration-200 hover:bg-cyan-700 active:scale-[0.98] w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Resetting…</>
                : <>Reset Password <ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 font-sans mt-5">
          <Link to="/login" className="text-cyan-600 hover:text-cyan-700 font-semibold transition-colors">
            ← Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}