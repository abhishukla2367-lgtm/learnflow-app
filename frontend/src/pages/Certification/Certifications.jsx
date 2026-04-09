import { Link } from 'react-router-dom';
import { Award, CheckCircle, ArrowRight, Star, Shield, BadgeCheck,
 Globe, Briefcase, TrendingUp, Download } from 'lucide-react';
import { CERTS } from '../../data/certsData';
import { TESTIMONIALS } from '../../data/homeData';

 const WHY = [
 { icon:BadgeCheck, title:'Employer Verified', desc:'Each certificate has a unique QR code recruiters scan for instant verification.' },
 { icon:Shield, title:'Blockchain Secured', desc:'Credentials anchored to a public blockchain — tamper-proof, permanently verifiable.' },
 { icon:Globe, title:'Nationwide Recognition',desc:'Trusted by 1,200+ hiring partners across Bengaluru, Mumbai, Delhi, Hyderabad, and Pune.' },
 { icon:Briefcase, title:'Placement Support', desc:'Resume reviews, mock interviews, and direct referrals to partner companies.' },
 { icon:TrendingUp, title:'35% Salary Hike', desc:'Average salary increase reported by our graduates within 6 months of certification.' },
 { icon:Download, title:'PDF + LinkedIn Ready', desc:'Download a print-ready PDF and add your certificate to LinkedIn with one click.' },
];

const COMPANIES = ['TCS','Infosys','Wipro','HCL','Flipkart','Zomato','Swiggy','Razorpay','Ola','BYJU\'S','PhonePe','MakeMyTrip'];

function CertCard({ c }) {
 const disc = Math.round((1 - c.price / c.origPrice) * 100);
 return (
 <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-cyan-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col shadow-sm group">
 <div className={`h-1.5 bg-gradient-to-r ${c.gradient}`}/>
 <div className="p-6 flex flex-col gap-4 flex-1">
 <div className="flex items-start justify-between">
 <span className="text-3xl">{c.emoji}</span>
 <span className={`${c.tagStyle} text-xs`}>{c.tag}</span>
 </div>
 <div>
 <h3 className=" text-base font-semibold text-slate-900 mb-1 group-hover:text-cyan-700 transition-colors">{c.title}</h3>
 <p className="text-sm text-slate-600 font-sans leading-relaxed">{c.desc}</p>
 </div>
 <div className="flex flex-wrap gap-1.5">
 {(c.modules || []).map(m=>(
 <span key={m} className="px-2.5 py-1 rounded-lg bg-slate-100 text-xs text-slate-500 font-mono border border-slate-200">{m}</span>
 ))}
 </div>
 <div className="grid grid-cols-2 gap-2 text-xs font-mono">
 <span className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-500"><Award className="w-3.5 h-3.5 text-cyan-500"/>{c.level}</span>
 <span className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-500"><CheckCircle className="w-3.5 h-3.5 text-cyan-500"/>{c.duration}</span>
 </div>
 <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">
 <Briefcase className="w-3.5 h-3.5"/>💼 {c.jobs}
 </div>
 <div className="flex items-center justify-between pt-2 border-t border-slate-200 mt-auto">
 <div>
 <span className=" text-xl font-bold text-slate-900">₹{c.price.toLocaleString('en-IN')}</span>
 <span className="text-xs text-slate-500 line-through ml-2">₹{c.origPrice.toLocaleString('en-IN')}</span>
 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] ml-2">{disc}% off</span>
 </div>
 </div>
 <Link to={`/certifications/${c.id}`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-600 text-white font-semibold text-sm transition-all duration-200 hover:bg-cyan-700 active:scale-[0.98] justify-center text-sm py-2.5">Enrol Now <ArrowRight className="w-3.5 h-3.5"/></Link>
 </div>
 </div>
 );
}

export default function Certifications() {
 return (
 <>
 {/* Hero */}
 <section className="relative bg-white border-b border-slate-200 overflow-hidden">
 <div className="absolute inset-0 [background-image:linear-gradient(rgba(8,145,178,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(8,145,178,0.06)_1px,transparent_1px)] [background-size:40px_40px] opacity-60 pointer-events-none"/>
 <div className="absolute inset-0 pointer-events-none"/>
 <div className="absolute top-10 right-10 w-72 h-72 bg-violet-100/30 blur-3xl rounded-full pointer-events-none animate-float"/>
 <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-mono bg-cyan-50 text-cyan-700 border border-cyan-200 mb-4 mb-5">Learnflow Certifications</span>
 <h1 className=" text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-5 leading-[1.1]">
 Credentials That<br/>
 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-violet-600">Actually Move Careers.</span>
 </h1>
 <p className="text-slate-600 text-base leading-relaxed max-w-2xl mx-auto mb-10">
 Blockchain-verified, employer-recognised certifications — trusted by 1,200+ hiring partners across India's top tech and product companies.
 </p>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
 {[['1,200+','Hiring Partners'],['35%','Avg. Salary Hike'],['50,000+','Certs Issued'],['98%','Placement Rate']].map(([n,l])=>(
 <div key={l} className="bg-white border border-slate-200 rounded-2xl px-4 py-4 shadow-sm">
 <p className=" text-2xl font-bold text-cyan-600">{n}</p>
 <p className="text-xs text-slate-500 font-mono">{l}</p>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* Ticker */}
 <section className="py-5 bg-slate-100 border-b border-slate-200 overflow-hidden">
 <p className="text-center text-xs text-slate-500 font-mono uppercase tracking-widest mb-4">Trusted by hiring teams at</p>
 <div className="flex animate-ticker whitespace-nowrap">
 {[...COMPANIES,...COMPANIES].map((c,i)=>(
 <span key={i} className="inline-flex items-center mx-8 text-sm font-semibold text-slate-600 font-mono">
 {c}<span className="ml-8 text-bg-border">·</span>
 </span>
 ))}
 </div>
 </section>

 {/* Cert grid */}
 <section className="py-16 bg-slate-100">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="text-center mb-12">
 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-mono bg-cyan-50 text-cyan-700 border border-cyan-200 mb-4">Programmes</span>
 <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">Choose your certification path</h2>
 <p className="text-slate-600 text-base leading-relaxed mt-3 max-w-xl mx-auto">Each programme is built with direct input from India's top companies — so every skill you learn maps directly to what employers need.</p>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
 {CERTS.map(c=><CertCard key={c.id} c={c}/>)}
 </div>
 </div>
 </section>

 {/* Why section */}
 <section className="py-20 border-t border-slate-200 bg-white">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="text-center mb-14">
 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-mono bg-cyan-50 text-cyan-700 border border-cyan-200 mb-4">Why Learnflow Certs?</span>
 <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">Built for real-world credibility</h2>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
 {WHY.map(({icon:Icon,title,desc})=>(
 <div key={title} className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-cyan-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
 <div className="w-11 h-11 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center mb-4 group-hover:bg-cyan-100 transition-colors">
 <Icon className="w-5 h-5 text-cyan-600"/>
 </div>
 <h3 className=" text-base font-semibold text-slate-900 mb-2">{title}</h3>
 <p className="text-sm text-slate-600 font-sans leading-relaxed">{desc}</p>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* Alumni */}
 <section className="py-20 border-t border-slate-200 bg-slate-100">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="text-center mb-14">
 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-mono bg-cyan-50 text-cyan-700 border border-cyan-200 mb-4">Alumni Stories</span>
 <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">Their certs. Their success.</h2>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
 {TESTIMONIALS.map(({ name, role, city, text, avatar, rating }) => (
  <div key={name} className="bg-white border border-slate-200 rounded-2xl p-7 flex flex-col gap-5 shadow-sm hover:border-cyan-200 hover:shadow-md hover:-translate-y-0.5 transition-all">
    <div className="flex gap-1">
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} className="w-4 h-4 text-amber-500" fill="currentColor" />
      ))}
    </div>
    <p className="text-sm text-slate-600 font-sans leading-relaxed flex-1">"{text}"</p>
    <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
        {avatar}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900 font-sans">{name}</p>
        <p className="text-xs text-slate-500 font-sans">{role}</p>
        <p className="text-xs text-cyan-600 font-mono mt-0.5">📍 {city}</p>
      </div>
    </div>
  </div>
))}
 </div>
 </div>
 </section>

 {/* CTA */}
 <section className="py-16 border-t border-slate-200 bg-white">
 <div className="max-w-2xl mx-auto px-4 text-center">
 <Award className="w-12 h-12 text-cyan-600 mx-auto mb-4"/>
 <h2 className=" text-3xl font-bold text-slate-900 mb-4">Earn your certificate today</h2>
 <p className="text-slate-600 text-base leading-relaxed mb-8">Join 50,000+ Indian professionals who have already levelled up with Learnflow certifications.</p>
 <div className="flex flex-wrap justify-center gap-4">
 <Link to="/register" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-600 text-white font-semibold text-sm transition-all duration-200 hover:bg-cyan-700 active:scale-[0.98] px-8 py-3.5 text-base shadow-sm">Get started free <ArrowRight className="w-4 h-4"/></Link>
 <Link to="/courses" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 text-slate-900 font-semibold text-sm bg-white transition-all duration-200 hover:border-cyan-300 hover:bg-cyan-50 active:scale-[0.98] px-8 py-3.5 text-base">Browse all courses</Link>
 </div>
 </div>
 </section>
 </>
 );
}
