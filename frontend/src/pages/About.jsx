import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Target, Heart, Lightbulb, Globe, Users, BookOpen, Award, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TIMELINE = [
 { year:'2020', title:'Founded in Thane', desc:'Rohan Patil and Kajal Singh — two IIT graduates frustrated with the gap between college curriculam and what the industry actually needs — founded Learnodays in a Pokhran Road garage.' },
 { year:'2021', title:'First 1,000 Learners', desc:'Launched cohort-based courses in Full Stack and Data Science. Reached 1,000 active learners in 6 months entirely through word-of-mouth.' },
 { year:'2022', title:'Certification Launch', desc:'Launched India\'s first blockchain-verified tech certifications. Partnered with 150 companies including TCS, Infosys, and Google to recognise Learnodays credentials.' },
 { year:'2023', title:'Series A — ₹48 Cr', desc:'Raised ₹48 Cr in Series A funding led by Sequoia India. Expanded to 3 cities, onboarded 7+ instructors, crossed 25,000 learners.' },
 { year:'2024', title:'AI Learning Engine', desc:'Launched personalised AI learning paths, real-time doubt resolution, and automated progress analytics — making Learnodays the most intelligent learning platform built in India.' },
 { year:'2025', title:'50,000 Learners & Beyond', desc:'Today, Learnodays serves 50,000+ learners across 3 states. On a mission to place 1 million Indians in quality tech careers by 2030.' },
];

const VALUES = [
 { icon:Target, title:'Outcome First', desc:'Every feature, every course, every session is designed with one question: will this help learners get hired, promoted, or skilled?' },
 { icon:Heart, title:'Learner Centric',desc:'IST-friendly class timings, Hinglish content, regional support, and EMI-based pricing — we build for every Indian, not just metro elites.' },
 { icon:Lightbulb, title:'Real Knowledge', desc:'No fluff. Our instructors are working professionals who bring current, industry-relevant knowledge — not textbook theory from 2015.' },
 { icon:Globe, title:'Inclusive India', desc:'From Tier 1 cities to Tier 3 towns — we build for every Indian with a smartphone and a dream.' },
];

const TEAM = [
 { name:'Rohan Patil', role:'Co-Founder & CEO', city:'Thane', avatar:'RI', gradient:'from-cyan-500 to-blue-600', bio:'IIT Bombay alumnus. Ex-McKinsey. Passionate about making quality education accessible to every Indian.' },
 { name:'Kajal Singh', role:'Co-Founder & CTO', city:'Thane', avatar:'AS', gradient:'from-violet-500 to-purple-600', bio:'IIT Delhi. Ex-Google India. Built Learnodays\'s real-time infrastructure from scratch. 8 patents in distributed systems.' },
 { name:'Karthik Rajan', role:'VP of Product', city:'Ahmedabad', avatar:'KR', gradient:'from-emerald-500 to-teal-600', bio:'IIM Ahmedabad. 10 years in edtech. Led product at BYJU\'S before joining Learnodays. Obsessed with learning UX.' },
 { name:'Pooja Sharma', role:'Head of Curriculum',city:'Delhi', avatar:'PS', gradient:'from-amber-500 to-orange-600', bio:'PhD in Education Technology from Delhi University. Designed curricula used by 50,000+ learners across India.' },
];

const STATS = [
 { icon:Users, num:'50,000+', label:'Active Learners' },
 { icon:BookOpen, num:'30+', label:'Courses' },
 { icon:Award, num:'1,200+', label:'Hiring Partners' },
 { icon:MapPin, num:'3', label:'States Reached' },
 { icon:TrendingUp,num:'35%', label:'Avg Salary Hike' },
 { icon:Globe, num:'4.7 ★', label:'Platform Rating' },
];

export default function About() {
    const { user } = useAuth();
    const isLoggedIn = !!user;
 return (
 <>
 {/* Hero */}
 <section className="relative bg-white border-b border-slate-200 overflow-hidden">
 <div className="absolute inset-0 [background-image:linear-gradient(rgba(8,145,178,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(8,145,178,0.06)_1px,transparent_1px)] [background-size:40px_40px] opacity-60 pointer-events-none"/>
 <div className="absolute inset-0 pointer-events-none"/>
 <div className="absolute top-10 right-10 w-72 h-72 bg-cyan-100/30 blur-3xl rounded-full pointer-events-none animate-float"/>
 <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
 <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold font-mono bg-cyan-50 text-cyan-700 border border-cyan-200 mb-6">Our Story</span>
 <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-8 leading-[1.08]">
 On a mission to put<br/>
 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-violet-600">1 million Indians in quality tech careers.</span>
 </h1>
 <p className="text-slate-600 text-xl leading-relaxed max-w-2xl mx-auto">
 Built in Thane by engineers who were frustrated by the gap between what Indian colleges teach and what the industry demands. We're here to close that gap — for good.
 </p>
 </div>
 </section>

 {/* Stats */}
 <section className="py-14 bg-slate-100 border-b border-slate-200">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
 {STATS.map(({icon:Icon,num,label})=>(
 <div key={label} className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm hover:border-cyan-200 hover:shadow-md hover:-translate-y-0.5 transition-all">
 <div className="w-11 h-11 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center mx-auto mb-3"><Icon className="w-5 h-5 text-cyan-600"/></div>
 <p className="text-2xl font-bold text-cyan-600">{num}</p>
 <p className="text-sm text-slate-500 font-mono mt-1">{label}</p>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* Mission */}
 <section className="py-24 bg-white border-b border-slate-200">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
 <div>
 <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold font-mono bg-cyan-50 text-cyan-700 border border-cyan-200 mb-6">Why We Exist</span>
 <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-7">India deserves better than rote learning.</h2>
 <div className="space-y-5 text-lg text-slate-600 font-sans leading-relaxed">
 <p>India produces over 1.5 million engineering graduates every year. Yet a large percentage struggle to find quality jobs because their education didn't keep pace with what the industry needs.</p>
 <p>Learnodays bridges this gap with practical, project-based learning taught by people who are actually doing the work — not retired professors reading from slides.</p>
 <p>From a garage in Pokhran Road, Thane, we've grown to serve 50,000+ learners across 28 states. Every learner who lands a better job is why we come to work every day.</p>
 </div>
 <div className="flex gap-4 mt-10">
 <Link to={isLoggedIn ? "/courses" : "/register"} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-cyan-600 text-white font-semibold text-base transition-all duration-200 hover:bg-cyan-700 active:scale-[0.98] shadow-sm">Start learning <ArrowRight className="w-5 h-5"/></Link>
 <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border border-slate-200 text-slate-900 font-semibold text-base bg-white transition-all duration-200 hover:border-cyan-300 hover:bg-cyan-50 active:scale-[0.98]">Contact us</Link>
 </div>
 </div>
 <div className="grid grid-cols-2 gap-4">
 {VALUES.map(({icon:Icon,title,desc})=>(
 <div key={title} className="bg-slate-100 border border-slate-200 rounded-2xl p-6 hover:border-cyan-200 hover:shadow-md hover:-translate-y-0.5 transition-all">
 <div className="w-11 h-11 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center mb-4"><Icon className="w-5 h-5 text-cyan-600"/></div>
 <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
 <p className="text-sm text-slate-600 font-sans leading-relaxed">{desc}</p>
 </div>
 ))}
 </div>
 </div>
 </div>
 </section>

 {/* Timeline */}
 <section className="py-24 border-b border-slate-200 bg-slate-100">
 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="text-center mb-16">
 <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold font-mono bg-cyan-50 text-cyan-700 border border-cyan-200 mb-5">Our Journey</span>
 <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">How we got here</h2>
 </div>
 <div className="relative">
 <div className="absolute left-[2.25rem] top-0 bottom-0 w-px border-slate-200 hidden sm:block"/>
 <div className="flex flex-col gap-6">
 {TIMELINE.map(({year,title,desc})=>(
 <div key={year} className="flex gap-6 items-start">
 <div className="hidden sm:flex flex-col items-center flex-shrink-0 w-[2.25rem]">
 <div className="w-10 h-10 rounded-full bg-white border-2 border-cyan-300 flex items-center justify-center z-10 shadow-sm">
 <span className="text-[11px] font-bold text-cyan-600 font-mono">{year.slice(2)}</span>
 </div>
 </div>
 <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-cyan-200 hover:shadow-md transition-all">
 <div className="flex items-center gap-3 mb-3">
 <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold font-mono bg-cyan-50 text-cyan-700 border border-cyan-200">{year}</span>
 <h3 className="text-base font-bold text-slate-900">{title}</h3>
 </div>
 <p className="text-base text-slate-600 font-sans leading-relaxed">{desc}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </section>

 {/* Team */}
 <section className="py-24 border-b border-slate-200 bg-white">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="text-center mb-16">
 <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold font-mono bg-cyan-50 text-cyan-700 border border-cyan-200 mb-5">Leadership</span>
 <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">The people building Learnodays</h2>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
 {TEAM.map(({name,role,city,avatar,gradient,bio})=>(
 <div key={name} className="bg-white border border-slate-200 rounded-2xl p-7 text-center hover:border-cyan-200 hover:shadow-md hover:-translate-y-0.5 transition-all">
 <div className={`w-18 h-18 w-[72px] h-[72px] rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-2xl mx-auto mb-5`}>{avatar}</div>
 <h3 className="text-lg font-bold text-slate-900 mb-1">{name}</h3>
 <p className="text-sm text-cyan-600 font-mono font-semibold mb-1">{role}</p>
 <p className="text-sm text-slate-500 font-mono flex items-center justify-center gap-1 mb-4"><MapPin className="w-3.5 h-3.5"/>{city}</p>
 <p className="text-sm text-slate-600 font-sans leading-relaxed">{bio}</p>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* CTA */}
 <section className="py-20 bg-slate-100 border-t border-slate-200">
 <div className="max-w-2xl mx-auto px-4 text-center">
 <h2 className="text-4xl font-bold text-slate-900 mb-5">Join us on the mission</h2>
 <p className="text-slate-600 text-lg leading-relaxed mb-10">From learners to leaders — join 50,000+ Indians building careers in tech with Learnodays. 
 Your next opportunity starts here.</p>
 <div className="flex flex-wrap justify-center gap-4">
 <Link to={isLoggedIn ? "/courses" : "/register"} className="inline-flex items-center gap-2 px-9 py-4 rounded-lg bg-cyan-600 text-white font-semibold text-base transition-all duration-200 hover:bg-cyan-700 active:scale-[0.98] shadow-sm">Start learning <ArrowRight className="w-5 h-5"/></Link>
 <Link to="/contact" className="inline-flex items-center gap-2 px-9 py-4 rounded-lg border border-slate-200 text-slate-900 font-semibold text-base bg-white transition-all duration-200 hover:border-cyan-300 hover:bg-cyan-50 active:scale-[0.98]">Get in touch</Link>
 </div>
 </div>
 </section>
 </>
 );
}