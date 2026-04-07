import { Link } from 'react-router-dom';
import { Home, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      {/* 404 number */}
      <p className="text-[120px] md:text-[160px] font-black text-slate-100 leading-none select-none">
        404
      </p>

      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center -mt-6 mb-6">
        <svg viewBox="0 0 24 24" className="w-7 h-7 text-cyan-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">Page not found</h1>
      <p className="text-sm text-slate-500 font-sans text-center max-w-xs leading-relaxed mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 text-white font-semibold text-sm hover:bg-cyan-700 active:scale-[0.98] transition-all shadow-sm"
        >
          <Home className="w-4 h-4" /> Go home
        </Link>
        <Link
          to="/help"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 active:scale-[0.98] transition-all"
        >
          <HelpCircle className="w-4 h-4" /> Get help
        </Link>
      </div>
    </div>
  );
}