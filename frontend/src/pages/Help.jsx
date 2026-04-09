import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, BookOpen, CreditCard, Award, User, Wifi, Settings, HelpCircle, MessageCircle, ArrowRight, CheckCircle } from 'lucide-react';

const CATS = [
 { id:'courses', icon:BookOpen, label:'Courses & Learning', color:'bg-cyan-50 border-cyan-200 text-cyan-600', count:8 },
 { id:'billing', icon:CreditCard, label:'Billing & Payments', color:'bg-emerald-50 border-emerald-200 text-emerald-600', count:8 },
 { id:'certs', icon:Award, label:'Certifications', color:'bg-violet-50 border-violet-200 text-violet-600', count:8 },
 { id:'live', icon:Wifi, label:'Live Sessions', color:'bg-amber-50 border-amber-200 text-amber-600', count:8 },
 { id:'account', icon:User, label:'Account & Profile', color:'bg-rose-50 border-rose-200 text-rose-600', count:8 },
 { id:'technical', icon:Settings, label:'Technical Support', color:'bg-slate-50 border-slate-200 text-slate-600', count:8 },
];

const FAQS = [
 { cat:'courses', q:'How do I enrol in a course?', a:'Browse courses, click "Enrol Now", and pay via UPI, net banking or card. You get immediate access once payment is confirmed.' },
 { cat:'courses', q:'Can I access videos after the batch ends?', a:'Yes! All pre-recorded content remains accessible for 12 months. Live session recordings are available within 24 hours.' },
 { cat:'courses', q:'Are courses available in Hindi?', a:'Many courses are taught in Hinglish. Look for the "Hindi" badge on course pages. Full Hindi transcripts are available for all courses.' },
 { cat:'courses', q:'What is the refund policy?', a:'We offer a 7-day full refund if you\'re unsatisfied. Raise a request from your dashboard and we process it within 3–5 business days.' },
 { cat:'courses', q:'Can I switch to a different batch?', a:'Yes, you can request a batch transfer within the first 7 days of enrolment. Email support@learnflow.in or WhatsApp us.' },
 { cat:'courses', q:'Can I download course videos for offline viewing?', a:'Yes, the LearnFlow mobile app lets you download videos for offline viewing. Downloads are available for 30 days before they need to be refreshed.' },
 { cat:'courses', q:'How do I track my course progress?', a:'Your dashboard shows a progress bar for each enrolled course. You can also see completed modules and upcoming live sessions at a glance.' },
 { cat:'courses', q:'Are there any prerequisites for courses?', a:'Each course page lists prerequisites under the "Requirements" section. Most beginner courses have no prerequisites. Intermediate and advanced courses specify required knowledge.' },

 { cat:'billing', q:'What payment methods do you accept?', a:'UPI (GPay, PhonePe, Paytm), debit/credit cards (Visa, Mastercard, RuPay), net banking, and EMI via HDFC, ICICI, SBI, Axis, and Kotak.' },
 { cat:'billing', q:'Is GST included in the price?', a:'All prices are inclusive of 18% GST. A GST invoice is emailed to you immediately. Enter your GSTIN during checkout for business invoices.' },
 { cat:'billing', q:'Can I pay in EMI?', a:'Yes — 3, 6, and 12-month no-cost EMI via major credit cards. EMI options appear at checkout if your card is eligible.' },
 { cat:'billing', q:'How do I get a GST invoice?', a:'Enter your GST number at checkout. Your invoice is emailed within minutes and available in your dashboard under Billing > Invoices.' },
 { cat:'billing', q:'My payment failed but money was deducted. What do I do?', a:'Failed payment refunds are automatically processed within 5–7 business days by your bank. If not received after 7 days, email billing@learnflow.in with your transaction ID.' },
 { cat:'billing', q:'Can I get a receipt for my purchase?', a:'Yes, receipts are emailed instantly after purchase and are always available in your dashboard under Billing > Purchase History.' },
 { cat:'billing', q:'Do you offer student or group discounts?', a:'Yes! Students get 20% off with a valid college ID. Groups of 5 or more get 30% off. Email sales@learnflow.in for group pricing.' },
 { cat:'billing', q:'Can I upgrade my plan after purchasing?', a:'Yes, you can upgrade to a higher-tier course or bundle at any time. You only pay the price difference. Contact support to apply your existing payment as credit.' },

 { cat:'certs', q:'How do I earn my certificate?', a:'Complete all modules (100% video progress) and pass the final assessment with 70% or above. Certificate issued within 24 hours.' },
 { cat:'certs', q:'How do employers verify my certificate?', a:'Each certificate has a unique QR code. Employers scan it or visit learnflow.in/verify and enter the 16-character credential ID.' },
 { cat:'certs', q:'Can I add it to LinkedIn?', a:'Yes! Click "Add to LinkedIn" on your certificate page — it adds automatically to Licences & Certifications. Learnflow is a recognised LinkedIn issuer.' },
 { cat:'certs', q:'Do certificates expire?', a:'Learnflow certificates do not expire. Tech-specific certs note a "knowledge as of [year]" date to help employers contextualise the content.' },
 { cat:'certs', q:'What if I fail the final assessment?', a:'You get 3 attempts at the final assessment. After each failed attempt, a 48-hour cooldown applies. Use the review materials provided to prepare for your next try.' },
 { cat:'certs', q:'Can I get a physical copy of my certificate?', a:'Yes, printed certificates can be ordered from your dashboard for ₹299, including shipping anywhere in India. Delivery takes 7–10 business days.' },
 { cat:'certs', q:'Is the certificate recognised by companies?', a:'Learnflow certificates are recognised by 500+ hiring partners including TCS, Infosys, Wipro, and several MNCs. The full list is available on our Hiring Partners page.' },
 { cat:'certs', q:'What if my name is incorrect on my certificate?', a:'Update your legal name in Settings → Account → Full Name before completing the course. If already issued, email support@learnflow.in with your ID proof for a reissue.' },

 { cat:'live', q:'How do I join a live session?', a:'On your Dashboard, go to "Upcoming Sessions" and click "Join Now" — activates 10 minutes before the session. No app download required.' },
 { cat:'live', q:'What if I miss a live session?', a:'Recordings are uploaded within 24 hours and are viewable unlimited times before your access period ends.' },
 { cat:'live', q:'Can I ask questions during a session?', a:'Yes — live chat, Q&A queue, and the option to raise your hand to speak. Post-session doubts go in the community forum.' },
 { cat:'live', q:'What are the system requirements?', a:'Stable internet (5+ Mbps), Chrome/Firefox browser. Works on laptops, PCs, and Android/iOS devices.' },
 { cat:'live', q:'How do I get notified about upcoming live sessions?', a:'Enable notifications in Settings → Notifications. You\'ll receive email and app reminders 24 hours and 30 minutes before each session.' },
 { cat:'live', q:'Can I reschedule a live session?', a:'Individual sessions cannot be rescheduled, but you can switch to a different batch within 7 days of enrolment. Recordings ensure you never miss content.' },
 { cat:'live', q:'What happens if the instructor is unavailable?', a:'You\'ll be notified at least 4 hours in advance if a session is cancelled. A replacement session is always scheduled within 48 hours at no extra cost.' },
 { cat:'live', q:'Are live sessions recorded in full?', a:'Yes, all live sessions are fully recorded including Q&A segments. Recordings are available in your dashboard within 24 hours of the session ending.' },

 { cat:'account', q:'How do I reset my password?', a:'Go to learnflow.in/login → "Forgot Password". Enter your email or phone — you\'ll receive a reset link within 2 minutes.' },
 { cat:'account', q:'Can I change my email address?', a:'Yes. Settings → Account → Change Email. Verify both old and new emails. Change takes effect within 24 hours.' },
 { cat:'account', q:'How do I delete my account?', a:'Settings → Account → Delete Account. Deletion is permanent and removes all progress, certificates, and purchase history.' },
 { cat:'account', q:'How do I update my profile picture?', a:'Go to Settings → Profile → Avatar. Upload a JPG or PNG under 5 MB. Your new photo appears across the platform within a few minutes.' },
 { cat:'account', q:'Can I have multiple accounts?', a:'No, one account per person is allowed. If you need to switch email addresses, use the Change Email option in Settings rather than creating a new account.' },
 { cat:'account', q:'How do I enable two-factor authentication?', a:'Go to Settings → Security → Two-Factor Authentication and follow the setup steps. We support authenticator apps and SMS-based OTP.' },
 { cat:'account', q:'How do I change my display name?', a:'Go to Settings → Profile → Full Name. Changes are reflected immediately across the platform including on your certificates.' },
 { cat:'account', q:'Can I pause my account?', a:'You cannot pause an account, but your course access periods are fixed from the date of enrolment. Contact support if you\'re facing a medical or personal emergency.' },

 { cat:'technical', q:'Videos won\'t play. What do I do?', a:'Try Chrome or Firefox. Clear cache/cookies. Check your internet speed (min 5 Mbps). If the issue persists, contact support@learnflow.in.' },
 { cat:'technical', q:'I can\'t log in. What should I do?', a:'Reset your password via the "Forgot Password" link. If you still can\'t log in, email support@learnflow.in with your registered email.' },
 { cat:'technical', q:'The mobile app keeps crashing. How do I fix it?', a:'Update the app to the latest version from the Play Store or App Store. If it still crashes, uninstall, restart your device, and reinstall the app.' },
 { cat:'technical', q:'Why is my video buffering constantly?', a:'Check your internet connection speed (minimum 5 Mbps required). Try lowering the video quality in the player settings. Avoid streaming during peak hours.' },
 { cat:'technical', q:'My certificate is not generating. What should I do?', a:'Ensure you have met all completion requirements: 80% video progress, all assignments submitted, and assessment passed. If requirements are met, contact support@learnflow.in.' },
 { cat:'technical', q:'Push notifications are not working. How do I fix it?', a:'Check that notifications are enabled both in the app settings and your device settings. On Android, also check battery optimisation settings which may block notifications.' },
 { cat:'technical', q:'I\'m getting a payment gateway error. What should I do?', a:'Try a different browser or clear your cache. Ensure your card/UPI is enabled for online transactions. If the issue persists, contact your bank or try a different payment method.' },
 { cat:'technical', q:'How do I report a bug or technical issue?', a:'Use the "Report an Issue" button in the app or email support@learnflow.in with a screenshot and description. Our tech team responds within 24 hours.' },
];

function FaqItem({ q, a }) {
 const [open, setOpen] = useState(false);
 return (
 <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${open?'border-cyan-200 shadow-sm':'border-slate-200 bg-white'}`}>
 <button onClick={()=>setOpen(o=>!o)} className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 hover:bg-slate-50 transition-colors">
 <span className="font-sans text-base font-semibold text-slate-900 leading-snug">{q}</span>
 <ChevronDown className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform duration-200 ${open?'rotate-180':''}`}/>
 </button>
 {open && (
 <div className="px-6 pb-6 bg-cyan-50/30">
 <p className="text-base text-slate-600 font-sans leading-relaxed">{a}</p>
 </div>
 )}
 </div>
 );
}

export default function Help() {
 const [search, setSearch] = useState('');
 const [activeCat, setActiveCat] = useState('all');

 const filtered = FAQS.filter(f =>
 (activeCat==='all'||f.cat===activeCat) &&
 (!search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
 );

 const grouped = CATS.map(c => ({
 ...c, items: filtered.filter(f => f.cat===c.id)
 })).filter(g => activeCat==='all' ? g.items.length>0 : g.id===activeCat);

 return (
 <>
 {/* Hero */}
 <section className="relative bg-white border-b border-slate-200 overflow-hidden">
 <div className="absolute inset-0 [background-image:linear-gradient(rgba(8,145,178,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(8,145,178,0.06)_1px,transparent_1px)] [background-size:40px_40px] opacity-60 pointer-events-none"/>
 <div className="absolute inset-0 pointer-events-none"/>
 <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
 <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold font-mono bg-cyan-50 text-cyan-700 border border-cyan-200 mb-6">Help Centre</span>
 <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
 How can we<br/><span className="text-cyan-600">help you today?</span>
 </h1>
 <p className="text-slate-600 text-xl leading-relaxed max-w-xl mx-auto mb-10">Browse FAQs or search for your question. Our support team is always one message away.</p>
 <div className="relative max-w-lg mx-auto">
 <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"/>
 <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search help articles…" className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-5 py-4 text-slate-900 placeholder-slate-400 text-base transition-all duration-200 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 shadow-sm"/>
 </div>
 </div>
 </section>

 {/* Category tiles */}
 <section className="py-12 bg-slate-100 border-b border-slate-200">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
 <button onClick={()=>setActiveCat('all')}
 className={`rounded-2xl border p-5 text-center transition-all ${activeCat==='all'?'bg-cyan-600 border-cyan-600 text-white shadow-sm':'bg-white border-slate-200 text-slate-600 hover:border-cyan-300 hover:bg-cyan-50'}`}>
 <HelpCircle className="w-7 h-7 mx-auto mb-2.5"/>
 <p className="text-sm font-bold font-mono">All Topics</p>
 </button>
 {CATS.map(({id,icon:Icon,label,color,count})=>(
 <button key={id} onClick={()=>setActiveCat(id)}
 className={`rounded-2xl border p-5 text-center transition-all hover:shadow-md ${activeCat===id?'bg-cyan-600 border-cyan-600 text-white shadow-sm':`${color} hover:-translate-y-0.5`}`}>
 <Icon className="w-7 h-7 mx-auto mb-2.5"/>
 <p className="text-sm font-bold font-mono leading-tight">{label}</p>
 <p className="text-xs opacity-70 mt-1">{count} articles</p>
 </button>
 ))}
 </div>
 </div>
 </section>

 {/* FAQs */}
 <section className="py-20 bg-white">
 <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
 {filtered.length===0 ? (
 <div className="text-center py-20 bg-slate-100 border border-slate-200 rounded-2xl">
 <HelpCircle className="w-14 h-14 text-slate-500 mx-auto mb-4"/>
 <p className="text-xl font-bold text-slate-900 mb-2">No results for "{search}"</p>
 <p className="text-base text-slate-500 font-sans mb-6">Try different keywords or browse a category.</p>
 <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-cyan-600 text-white font-semibold text-base transition-all duration-200 hover:bg-cyan-700 active:scale-[0.98]">Contact support</Link>
 </div>
 ) : (
 grouped.map(({id,label,items})=>(
 <div key={id} className="mb-12">
 <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-3">
 <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-cyan-500 to-violet-500 inline-block"/>
 {label}
 </h2>
 <div className="flex flex-col gap-3">
 {items.map((item,i)=><FaqItem key={i} q={item.q} a={item.a}/>)}
 </div>
 </div>
 ))
 )}
 </div>
 </section>

 {/* Still need help */}
 <section className="py-20 border-t border-slate-200 bg-slate-100">
 <div className="max-w-3xl mx-auto px-4 text-center">
 <h2 className="text-3xl font-bold text-slate-900 mb-4">Still need help?</h2>
 <p className="text-slate-600 text-lg leading-relaxed mb-10">Our India-based support team is here Mon–Fri, 9 AM–7 PM IST. Avg response time: under 4 hours.</p>
 <div className="flex flex-wrap justify-center gap-4">
 <Link to="/contact" className="inline-flex items-center gap-2 px-9 py-4 rounded-lg bg-cyan-600 text-white font-semibold text-base transition-all duration-200 hover:bg-cyan-700 active:scale-[0.98]"><MessageCircle className="w-5 h-5"/> Contact Support</Link>
 <a href="https://wa.me/918045678900" className="inline-flex items-center gap-2 px-9 py-4 rounded-lg border border-slate-200 text-slate-900 font-semibold text-base bg-white transition-all duration-200 hover:border-cyan-300 hover:bg-cyan-50 active:scale-[0.98]">💬 WhatsApp Us</a>
 </div>
 </div>
 </section>
 </>
 );
}