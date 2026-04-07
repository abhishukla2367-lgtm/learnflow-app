import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Video, Calendar, Clock, Users, Star, ArrowRight, CheckCircle,
 Search, Play, Award, Mic, Wifi, Radio, Filter, ChevronRight } from 'lucide-react';

const SESSIONS = [
 { id:1, title:'Full Stack Development with MERN — Live Bootcamp', instructor:'Rohan Gupta', city:'Bengaluru', company:'ex-Google India', date:'Mon · Wed · Fri', time:'7:00 – 9:00 PM IST', enrolled:1240, maxSeats:1500, rating:4.9, reviews:2341, category:'Web Dev', level:'Intermediate', price:2999, origPrice:8999, live:true, tag:'Most Popular', tagStyle:'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-mono bg-cyan-50 text-cyan-700 border border-cyan-200', desc:'Build production-grade full-stack apps with MongoDB, Express, React, and Node.js — guided by a Bengaluru-based senior engineer from ex-Google.', avatar:'RS', gradient:'from-cyan-500 to-blue-600' },
 { id:2, title:'Deep Learning for Data Science', instructor:'Kavita Bhosle', city:'Chennai', company:'IIT Madras', date:'Tue · Thu · Sat', time:'8:00 – 10:00 PM IST', enrolled:890, maxSeats:1000, rating:4.8, reviews:1876, category:'AI / ML', level:'Intermediate', price:3499, origPrice:9999, live:true, tag:'Trending', tagStyle:'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-mono bg-violet-50 text-violet-700 border border-violet-200', desc:'Hands-on data science with Python, Pandas, and Scikit-learn using real Indian datasets — from an IIT Madras AI researcher with 12+ years of experience.', avatar:'PN', gradient:'from-violet-500 to-purple-600' },
 { id:3, title:'UI/UX Design Essentials — Live Workshop', instructor:'Priya Kulkarni', city:'Thane', company:'Razorpay', date:'Sat & Sun', time:'10:00 AM – 12:00 PM IST', enrolled:560, maxSeats:700, rating:4.7, reviews:987, category:'Design', level:'Beginner', price:1999, origPrice:5999, live:false, tag:'Weekend Batch', tagStyle:'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-mono bg-amber-50 text-amber-700 border border-amber-200', desc:'Learn Figma, design systems, and user research with real-world Indian product briefs. Perfect for students and career changers.', avatar:'AM', gradient:'from-amber-500 to-orange-600' },
 { id:4, title:'Google Cloud Platform(GCP) Fundamentals', instructor:'Siddharth Rao', city:'Hyderabad', company:'Wipro Cloud', date:'Mon & Thu', time:'6:30 – 8:30 PM IST', enrolled:430, maxSeats:600, rating:4.8, reviews:1340, category:'Cloud', level:'Advanced', price:3999, origPrice:11999, live:true, tag:'New Batch', tagStyle:'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-mono bg-emerald-50 text-emerald-700 border border-emerald-200', desc:'Hands-on DevOps with CI/CD, Kubernetes, Terraform, and both AWS and GCP — taught by a Hyderabad-based cloud architect from Wipro.', avatar:'KR', gradient:'from-emerald-500 to-teal-600' },
 { id:5, title:'Competitive Programming Secrets', instructor:'Aarav Deshmukh', city:'Delhi', company:'ex-Google · ex-Amazon', date:'Wed & Sat', time:'9:00 – 11:00 PM IST', enrolled:1800, maxSeats:2000, rating:4.9, reviews:4200, category:'DSA', level:'Intermediate', price:1499, origPrice:4999, live:true, tag:'Most Enrolled', tagStyle:'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-mono bg-cyan-50 text-cyan-700 border border-cyan-200', desc:'Crack FAANG interviews with curated DSA problems, live doubt sessions, and mock tests — from an ex-Google engineer based in Delhi.', avatar:'VS', gradient:'from-rose-500 to-pink-600' },
 { id:6, title:'Search Engine Optimization Deep Dive', instructor:'Ajay Chauhan', city:'Thane', company:'Flipkart', date:'Tue & Fri', time:'7:30 – 9:00 PM IST', enrolled:310, maxSeats:500, rating:4.7, reviews:654, category:'Product', level:'Advanced', price:4499, origPrice:12999, live:false, tag:'Premium', tagStyle:'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-mono bg-violet-50 text-violet-700 border border-violet-200', desc:'Move from engineer to PM — learn product strategy, roadmapping, and stakeholder management with real case studies from Flipkart and Zomato.', avatar:'SK', gradient:'from-indigo-500 to-violet-600' },
];

const CATS = ['All','Web Dev','AI / ML','Design','Cloud','DSA','Product'];

const HOW = [
 { icon:Search, step:'01', title:'Browse & Enrol', desc:'Pick from upcoming live batches filtered by topic, time, and level. All slots are in IST.' },
 { icon:Mic, step:'02', title:'Join Live Room', desc:'HD video, quiz exercises — all in your browser.' },
 { icon:Award, step:'03', title:'Get Certified', desc:'Complete all sessions and assignments to earn a blockchain-verified Learnflow certificate.' },
];

function SessionCard({ s }) {
 const pct = Math.round((s.enrolled/s.maxSeats)*100);
 const disc = Math.round((1-s.price/s.origPrice)*100);
 return (
 <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-cyan-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col shadow-sm">
 <div className="h-1.5 bg-gradient-to-r from-cyan-500 to-violet-500"/>
 <div className="p-6 flex flex-col gap-4 flex-1">
 <div className="flex items-start justify-between gap-2">
 <span className={`${s.tagStyle} text-xs`}>{s.tag}</span>
 {s.live && (
 <span className="animate-live-glow flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-mono font-semibold flex-shrink-0">
 <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"/>LIVE
 </span>
 )}
 </div>

 <div className="flex items-start gap-3">
 <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>{s.avatar}</div>
 <div>
 <h3 className=" text-sm font-semibold text-slate-900 leading-snug">{s.title}</h3>
 <p className="text-xs text-cyan-600 font-mono mt-0.5">{s.instructor} · {s.company}</p>
 </div>
 </div>

 <p className="text-sm text-slate-600 font-sans leading-relaxed line-clamp-2">{s.desc}</p>

 <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 font-mono">
 <span className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5"><Calendar className="w-3.5 h-3.5 text-cyan-500"/>{s.date}</span>
 <span className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5"><Clock className="w-3.5 h-3.5 text-cyan-500"/>{s.time}</span>
 <span className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5"><Users className="w-3.5 h-3.5 text-cyan-500"/>{s.enrolled.toLocaleString('en-IN')}</span>
 <span className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5">📍 {s.city}</span>
 </div>

 <div>
 <div className="flex justify-between text-xs mb-1.5">
 <span className="text-slate-500 font-sans">Seats filled</span>
 <span className="font-mono font-semibold text-slate-900">{pct}% <span className="text-slate-500 font-normal">({s.maxSeats-s.enrolled} left)</span></span>
 </div>
 <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full transition-all duration-700" style={{width:`${pct}%`}}/></div>
 </div>

 <div className="flex items-center justify-between pt-2 border-t border-slate-200">
 <div className="flex items-baseline gap-2">
 <span className=" text-xl font-bold text-slate-900">₹{s.price.toLocaleString('en-IN')}</span>
 <span className="text-xs text-slate-500 line-through">₹{s.origPrice.toLocaleString('en-IN')}</span>
 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">{disc}% off</span>
 </div>
 <div className="flex items-center gap-1">
 <Star className="w-3.5 h-3.5 text-amber-500" fill="currentColor"/>
 <span className="text-xs font-bold text-slate-900 font-mono">{s.rating}</span>
 </div>
 </div>

 <div className="flex gap-2">
 <Link to={`/courses/${s.id}`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-600 text-white font-semibold text-sm transition-all duration-200 hover:bg-cyan-700 active:scale-[0.98] flex-1 justify-center text-sm py-2.5">Enrol Now <ArrowRight className="w-3.5 h-3.5"/></Link>
 </div>
 </div>
 </div>
 );
}

export default function LiveSessions() {
 const [active, setActive] = useState('All');
 const [search, setSearch] = useState('');
 const [nowIST, setNowIST] = useState('');

 useEffect(() => {
 const update = () => setNowIST(new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Kolkata'}));
 update(); const t = setInterval(update,1000); return ()=>clearInterval(t);
 }, []);

 const filtered = SESSIONS.filter(s =>
 (active==='All'||s.category===active) &&
 (!search||s.title.toLowerCase().includes(search.toLowerCase())||s.instructor.toLowerCase().includes(search.toLowerCase()))
 );

 return (
 <>
 {/* Hero */}
 <section className="relative bg-white border-b border-slate-200 overflow-hidden">
 <div className="absolute inset-0 [background-image:linear-gradient(rgba(8,145,178,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(8,145,178,0.06)_1px,transparent_1px)] [background-size:40px_40px] opacity-60 pointer-events-none"/>
 <div className="absolute inset-0 pointer-events-none"/>
 <div className="absolute top-10 right-10 w-64 h-64 bg-cyan-100/30 blur-3xl rounded-full pointer-events-none animate-float"/>
 <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
 <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-mono font-semibold mb-6 animate-live-glow">
 <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"/>
 {SESSIONS.filter(s=>s.live).length} sessions live right now · IST {nowIST}
 </div>
 <h1 className=" text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-5 leading-[1.1]">
 Learn Live.<br/>
 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-violet-600">From India's Best.</span>
 </h1>
 <p className="text-slate-600 text-base leading-relaxed max-w-2xl mx-auto mb-8">
 Real-time interactive classes at evening and weekend slots — designed for working professionals across India. All timings in IST.
 </p>
 <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600 font-sans">
 {[['HD Video','Wifi'],['Live Q&A','Mic'],['Peer Community','Users'],['Verified Certificate','Award']].map(([label])=>(
 <span key={label} className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-cyan-500"/>{label}</span>
 ))}
 </div>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mt-10">
 {[['5+','Live Batches'],['3,200+','Active Learners'],['4.7★','Avg Rating'],['₹1.5K+','Avg Salary Hike']].map(([n,l])=>(
 <div key={l} className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
 <p className=" text-xl font-bold text-cyan-600">{n}</p>
 <p className="text-xs text-slate-500 font-mono">{l}</p>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* Sticky filters */}
 <section className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-3">
 <div className="relative flex-1 min-w-48 max-w-xs">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"/>
 <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search sessions…" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm transition-all duration-200 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 pl-9 py-2 text-sm"/>
 </div>
 <div className="flex gap-2 flex-wrap">
 {CATS.map(c=>(
 <button key={c} onClick={()=>setActive(c)}
 className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono border transition-all ${active===c?'bg-cyan-600 text-white border-cyan-600':'bg-white text-slate-600 border-slate-200 hover:border-cyan-300 hover:text-cyan-700'}`}>
 {c}
 </button>
 ))}
 </div>
 </div>
 </section>

 {/* Cards */}
 <section className="py-14 bg-slate-100">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <p className="text-sm text-slate-500 font-mono mb-8">
 <span className="text-slate-900 font-semibold">{filtered.length}</span> sessions available
 </p>
 {filtered.length===0 ? (
 <div className="text-center py-24 bg-white border border-slate-200 rounded-2xl">
 <p className="text-slate-500 font-sans">No sessions match your search.</p>
 </div>
 ) : (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
 {filtered.map(s=><SessionCard key={s.id} s={s}/>)}
 </div>
 )}
 </div>
 </section>

 {/* How it works */}
 <section className="py-20 border-t border-slate-200 bg-white">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="text-center mb-14">
 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-mono bg-cyan-50 text-cyan-700 border border-cyan-200 mb-4">Process</span>
 <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">How live sessions work</h2>
 <p className="text-slate-600 text-base leading-relaxed mt-3 max-w-xl mx-auto">4 simple steps from sign-up to certified.</p>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
 {HOW.map(({icon:Icon,step,title,desc},i)=>(
 <div key={step} className="relative text-center">
 {i<HOW.length-1 && <div className="hidden lg:block absolute top-7 left-[60%] w-[80%] h-px border-t-2 border-dashed border-slate-200"/>}
 <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center mx-auto mb-4">
 <Icon className="w-6 h-6 text-cyan-600"/>
 </div>
 <p className="font-mono text-xs font-bold text-cyan-600 mb-2">{step}</p>
 <h3 className=" font-semibold text-slate-900 mb-2">{title}</h3>
 <p className="text-sm text-slate-600 font-sans leading-relaxed">{desc}</p>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* CTA */}
 <section className="py-16 bg-slate-100 border-t border-slate-200">
 <div className="max-w-2xl mx-auto px-4 text-center">
 <h2 className=" text-3xl font-bold text-slate-900 mb-4">Ready for your first live class?</h2>
 <p className="text-slate-600 text-base leading-relaxed mb-8">Seats fill up fast. Register now and secure your spot.</p>
 <Link to="/register" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-600 text-white font-semibold text-sm transition-all duration-200 hover:bg-cyan-700 active:scale-[0.98] px-8 py-3.5 text-base shadow-sm">Register for free <ArrowRight className="w-4 h-4"/></Link>
 </div>
 </section>
 </>
 );
}
