import { Link } from 'react-router-dom';
import { ArrowLeft, Zap, Home, BookOpen, HelpCircle } from 'lucide-react';

export default function NotFound() {
 return (
 <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 relative overflow-hidden">
 <div className="absolute inset-0 [background-image:linear-gradient(rgba(8,145,178,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(8,145,178,0.06)_1px,transparent_1px)] [background-size:40px_40px] opacity-60 pointer-events-none"/>
 <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-cyan-100/30 blur-[100px] rounded-full pointer-events-none"/>
 <div className="relative text-center animate-fade-up max-w-lg">
 <p className=" text-9xl font-extrabold text-slate-100 mb-2 select-none tracking-tight">404</p>
 <div className="w-16 h-16 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center mx-auto mb-5 -mt-4">
 <Zap className="w-8 h-8 text-cyan-600"/>
 </div>
 <h1 className=" text-3xl font-bold text-slate-900 mb-3">Page not found</h1>
 <p className="text-slate-500 font-sans text-base mb-10 leading-relaxed max-w-sm mx-auto">
 The page you're looking for doesn't exist or has been moved. Let's get you back on track.
 </p>
 <div className="flex flex-wrap items-center justify-center gap-3">
 <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-600 text-white font-semibold text-sm transition-all duration-200 hover:bg-cyan-700 active:scale-[0.98] px-6 py-3 shadow-sm"><Home className="w-4 h-4"/> Go home</Link>
 <Link to="/courses" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 text-slate-900 font-semibold text-sm bg-white transition-all duration-200 hover:border-cyan-300 hover:bg-cyan-50 active:scale-[0.98] px-6 py-3"><BookOpen className="w-4 h-4"/> Browse courses</Link>
 <Link to="/help" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 text-sm transition-all duration-200 hover:text-slate-900 hover:bg-slate-100 active:scale-[0.98] px-6 py-3"><HelpCircle className="w-4 h-4"/> Get help</Link>
 </div>
 <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs text-slate-500 font-mono">
 {[['/', 'Home'],['/courses','Courses'],['/live-sessions','Live'],['/about','About'],['/contact','Contact']].map(([href,label])=>(
 <Link key={href} to={href} className="hover:text-cyan-600 transition-colors">{label}</Link>
 ))}
 </div>
 </div>
 </div>
 );
}
