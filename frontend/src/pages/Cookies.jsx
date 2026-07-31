import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, ArrowRight, CheckCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const COOKIE_TYPES = [
 { id:'essential', name:'Essential Cookies', icon:'🔒', required:true,
 desc:'Strictly necessary for the Platform to function — session tokens, CSRF protection, and load balancing. Cannot be disabled.',
 examples:['Learnodays_session (auth token)','_csrf (security)','lb_route (load balancer)'],
 duration:'Session / 30 days', provider:'Learnodays only' },
 { id:'analytics', name:'Analytics Cookies', icon:'📊', required:false,
 desc:'Help us understand how learners navigate the Platform — which pages are visited, where users drop off, and how features are used. All data is anonymised.',
 examples:['_ga, _gid (Google Analytics)','mp_session (Mixpanel)','_hjSession (Hotjar)'],
 duration:'1 day – 2 years', provider:'Google LLC, Mixpanel Inc, Hotjar Ltd' },
 { id:'preferences', name:'Preference Cookies', icon:'⚙️', required:false,
 desc:'Remember your settings — language preference, video playback quality, and UI state — so you don\'t reconfigure on every visit.',
 examples:['lf_lang (language)','lf_quality (video)','lf_sidebar (collapsed state)'],
 duration:'1 year', provider:'Learnodays only' },
 { id:'marketing', name:'Marketing Cookies', icon:'📣', required:false,
 desc:'Used to show you relevant Learnodays ads on Google, Meta, and LinkedIn. We never sell your data to advertisers.',
 examples:['_fbp, _fbc (Meta Pixel)','IDE (Google Ads)','li_fat_id (LinkedIn)'],
 duration:'3 months – 2 years', provider:'Meta Platforms, Google LLC, LinkedIn Corp' },
];

export default function Cookies() {
 const [prefs, setPrefs] = useState({ analytics:true, preferences:true, marketing:false });
 const [saved, setSaved] = useState(false);

 const toggle = (id) => { setPrefs(p=>({...p,[id]:!p[id]})); setSaved(false); };
 const savePrefs = () => { setSaved(true); toast.success('Cookie preferences saved!'); };
 const rejectAll = () => { setPrefs({analytics:false,preferences:false,marketing:false}); setSaved(false); };
 const acceptAll = () => { setPrefs({analytics:true,preferences:true,marketing:true}); setSaved(false); };

 return (
 <>
 <section className="relative bg-white border-b border-slate-200 overflow-hidden">
 <div className="absolute inset-0 pointer-events-none"/>
 <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
 <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center mx-auto mb-5"><Cookie className="w-7 h-7 text-cyan-600"/></div>
 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-mono bg-cyan-50 text-cyan-700 border border-cyan-200 mb-4 mb-4">Legal</span>
 <h1 className=" text-4xl font-bold text-slate-900 mb-3">Cookie Policy</h1>
 <p className="text-sm text-slate-500 font-mono">Learnodays Technologies Pvt Ltd · Last updated: 15 January 2025</p>
 <p className="text-sm text-slate-600 font-sans mt-2 max-w-xl mx-auto">We use cookies to make Learnodays work and improve your experience. Manage your preferences below — you can change them at any time.</p>
 </div>
 </section>

 {/* Preference Centre */}
 <section className="py-14 bg-slate-100 border-b border-slate-200">
 <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex items-center gap-3 mb-2">
 <div className="w-8 h-8 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center"><Info className="w-4 h-4 text-cyan-600"/></div>
 <h2 className=" text-xl font-bold text-slate-900">Cookie Preference Centre</h2>
 </div>
 <p className="text-sm text-slate-600 font-sans mb-8 ml-11">Manage which cookies Learnodays may use. Changes take effect immediately and are stored for 1 year.</p>

 <div className="flex flex-col gap-4">
 {COOKIE_TYPES.map(({id,name,icon,required,desc,examples,duration,provider})=>(
 <div key={id} className={`bg-white border rounded-2xl p-5 transition-all duration-200 ${!required&&prefs[id]?'border-cyan-200 shadow-sm':'border-slate-200'}`}>
 <div className="flex items-start justify-between gap-4">
 <div className="flex items-start gap-3 flex-1">
 <span className="text-xl mt-0.5">{icon}</span>
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2 flex-wrap mb-1">
 <h3 className=" text-sm font-semibold text-slate-900">{name}</h3>
 {required && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-mono bg-cyan-50 text-cyan-700 border border-cyan-200 text-[10px]">Always active</span>}
 </div>
 <p className="text-sm text-slate-600 font-sans leading-relaxed mb-3">{desc}</p>
 <div className="flex flex-wrap gap-3 text-xs text-slate-500 font-mono mb-3">
 <span>⏱ {duration}</span>
 <span>🏢 {provider}</span>
 </div>
 <div className="flex flex-wrap gap-1.5">
 {examples.map(ex=>(
 <code key={ex} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-500">{ex}</code>
 ))}
 </div>
 </div>
 </div>
 <div className="flex-shrink-0 mt-1">
 {required ? (
 <div className="w-12 h-6 rounded-full bg-cyan-600 flex items-center justify-end pr-1 cursor-not-allowed opacity-70">
 <div className="w-4 h-4 rounded-full bg-white shadow-sm"/>
 </div>
 ) : (
 <button onClick={()=>toggle(id)}
 className={`w-12 h-6 rounded-full transition-all duration-200 flex items-center ${prefs[id]?'bg-cyan-600 justify-end pr-1':'bg-slate-200 justify-start pl-1'}`}
 aria-label={`Toggle ${name}`}>
 <div className="w-4 h-4 rounded-full bg-white shadow-sm"/>
 </button>
 )}
 </div>
 </div>
 </div>
 ))}
 </div>

 <div className="flex flex-wrap gap-3 mt-6">
 <button onClick={savePrefs} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-600 text-white font-semibold text-sm transition-all duration-200 hover:bg-cyan-700 active:scale-[0.98] px-6 py-2.5 text-sm shadow-sm">
 {saved ? <><CheckCircle className="w-4 h-4"/>Saved!</> : 'Save Preferences'}
 </button>
 <button onClick={rejectAll} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 text-slate-900 font-semibold text-sm bg-white transition-all duration-200 hover:border-cyan-300 hover:bg-cyan-50 active:scale-[0.98] px-6 py-2.5 text-sm">Reject all optional</button>
 <button onClick={acceptAll} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 text-slate-900 font-semibold text-sm bg-white transition-all duration-200 hover:border-cyan-300 hover:bg-cyan-50 active:scale-[0.98] px-6 py-2.5 text-sm">Accept all</button>
 </div>
 </div>
 </section>

 {/* Policy content */}
 <section className="py-16 bg-white">
 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
 <aside className="hidden lg:block">
 <div className="sticky top-6 bg-slate-100 border border-slate-200 rounded-2xl p-4">
 <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-4">Contents</p>
 <nav className="flex flex-col gap-0.5">
 {[['#what','1. What Are Cookies?'],['#legal','2. Legal Basis'],['#third-party','3. Third-Party Cookies'],['#manage','4. Managing Cookies']].map(([href,label])=>(
 <a key={href} href={href} className="text-xs text-slate-600 font-sans hover:text-cyan-700 transition-colors py-1.5 px-2 rounded-lg hover:bg-white">{label}</a>
 ))}
 </nav>
 </div>
 </aside>
 <div className="lg:col-span-3 space-y-10">
 {[
 { id:'what', title:'1. What Are Cookies?', body:'Cookies are small text files placed on your device when you visit a website. Learnodays also uses local storage, session storage, and web beacons ("pixels") that function similarly to cookies. References to "cookies" in this Policy include all such technologies.' },
 { id:'legal', title:'2. Legal Basis', body:'Our use of cookies is governed by the Information Technology (Reasonable Security Practices) Rules, 2011, the DPDPA 2023, and MEITY guidelines. Essential cookies are used on the basis of our legitimate interest in operating a secure platform. All other cookies are used only with your explicit consent via the Preference Centre above.' },
 { id:'third-party', title:'3. Third-Party Cookies', body:'Some cookies on our Platform are set by trusted third-party service providers including Google (Analytics, Ads), Meta (Facebook Pixel), LinkedIn (Insight Tag), Razorpay (payment security), Hotjar (UX analytics), and Intercom (customer support chat). These third parties have their own privacy policies governing their use of cookie data.' },
 { id:'manage', title:'4. Managing Cookies', body:'You can manage cookie preferences using the Preference Centre above, or through your browser settings. Note that disabling essential cookies will prevent core platform functionality.\n\nChrome: Settings → Privacy and Security → Cookies\nFirefox: Settings → Privacy & Security → Cookies and Site Data\nSafari: Preferences → Privacy → Manage Website Data\nEdge: Settings → Cookies and site permissions' },
 ].map(({id,title,body})=>(
 <section key={id} id={id} className="scroll-mt-6">
 <h2 className=" text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">{title}</h2>
 {body.split('\n').map((line,i)=><p key={i} className="text-sm text-slate-600 font-sans leading-relaxed mb-2">{line}</p>)}
 </section>
 ))}
 </div>
 </div>
 </div>
 </section>

 <section className="py-12 bg-slate-100 border-t border-slate-200">
 <div className="max-w-xl mx-auto px-4 text-center">
 <p className="text-sm text-slate-600 font-sans mb-4">Questions about cookies? Email privacy@Learnodays.in — our DPO responds within 3 business days.</p>
 <div className="flex flex-wrap justify-center gap-3">
 <Link to="/privacy" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 text-slate-900 font-semibold text-sm bg-white transition-all duration-200 hover:border-cyan-300 hover:bg-cyan-50 active:scale-[0.98] px-6 py-2.5 text-sm">Privacy Policy</Link>
 <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-600 text-white font-semibold text-sm transition-all duration-200 hover:bg-cyan-700 active:scale-[0.98] px-6 py-2.5 text-sm shadow-sm">Contact DPO <ArrowRight className="w-3.5 h-3.5"/></Link>
 </div>
 </div>
 </section>
 </>
 );
}
