import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Clock, CreditCard } from 'lucide-react';
import { FadeIn } from '../ui/FadeIn';
import { useAuth } from '../../context/AuthContext';

const PERKS = [
  { icon: CreditCard, label: 'Secure card payment' },
  { icon: Clock,      label: '7-day free trial' },
  { icon: Shield,     label: 'Cancel anytime'  },
];

export default function CTASection() {
  const { user } = useAuth();
  return (
    <section className="py-24 border-t border-slate-200 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-cyan-900/20">

            {/* ── Animated gradient background ── */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-cyan-700 to-violet-700" />
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/40 via-transparent to-cyan-400/30 animate-shimmer" style={{ backgroundSize: '200% 200%' }} />

            {/* ── Decorative orbs ── */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-violet-400/20 rounded-full blur-2xl animate-float-delay pointer-events-none" />
            <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-cyan-300/10 rounded-full blur-2xl pointer-events-none" />

            {/* ── Grid overlay ── */}
            <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />

            {/* ── Content ── */}
            <div className="relative px-8 py-16 md:py-20 text-center">

              {/* Headline */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-[1.08]">
                Start learning today.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-violet-200">
                  Your dream job is waiting.
                </span>
              </h2>

              <p className="text-cyan-100/90 mb-10 max-w-xl mx-auto text-base md:text-lg leading-relaxed">
                Join 50,000+ professionals building tech careers with Learnflow.
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
                <Link
                  to={user ? "/" : "/register"}
                  onClick={(e) => {
    if (user) {
      // If user is logged in and on the home page, just scroll up
      if (window.location.pathname === "/") {
        e.preventDefault(); // Prevent a re-render/navigation
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }}
                  className="group relative inline-flex items-center gap-2 px-9 py-4 text-base rounded-xl bg-white text-cyan-700 font-bold hover:bg-cyan-50 hover:-translate-y-1 active:scale-[0.97] transition-all duration-200 shadow-xl shadow-black/15 overflow-hidden"
                >
                  <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-cyan-100/60 to-transparent transition-transform duration-500" />
                  Create free account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link
                  to="/courses"
                  className="group inline-flex items-center gap-2 px-9 py-4 text-base rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 hover:border-white/50 hover:-translate-y-1 active:scale-[0.97] transition-all duration-200 backdrop-blur-sm"
                >
                  Explore courses
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
                </Link>
              </div>

              {/* Perk badges */}
              <div className="flex flex-wrap items-center justify-center gap-6">
                {PERKS.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-sm text-white/80 font-medium">
                    <div className="w-6 h-6 rounded-full bg-white/15 border border-white/25 flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
