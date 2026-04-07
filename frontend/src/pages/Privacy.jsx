import { Link } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';

const SECTIONS = [
 { id:'intro', title:'1. Introduction', body:`Learnflow Technologies Private Limited ("Learnflow", "we", "our") is an online learning platform incorporated under the Companies Act, 2013, with its registered office at Learnflow Tower, Phase II, Ghodbunder Rd, near Viviana Mall, Thane West, Maharashtra — 400 606.\n\nThis Privacy Policy explains how we collect, use, store, disclose, and protect your personal data when you use learnflow.in and related services. It complies with the Digital Personal Data Protection Act, 2023 (DPDPA) and the Information Technology (Reasonable Security Practices) Rules, 2011.\n\nBy using the Platform, you consent to this Policy. If you do not agree, please discontinue use.` },
 { id:'data-collected', title:'2. Data We Collect', body:`Account & Identity: Name, email, mobile number, date of birth, gender, profile photo, password (hashed).\n\nLearning Data: Course enrolments, assessment scores, completion progress, certificates earned, assignment submissions.\n\nPayment Data: Billing name/address, last 4 digits of payment instrument, GSTIN, transaction IDs. Full card or bank account details are never stored — they are handled by Razorpay (PCI-DSS Level 1).\n\nDevice & Usage: IP address, browser type, OS, device IDs, pages visited, time spent, clickstream data, error logs.\n\nCommunications: Messages sent to our support team, live session Q&A inputs, community forum posts.` },
 { id:'use', title:'3. How We Use Your Data', body:`Service Delivery: Account management, payment processing, course access, certificate generation, and customer support.\n\nPersonalisation: Course recommendations and AI-powered learning paths based on your progress and goals.\n\nCommunications: Transactional messages (receipts, session reminders, certificate notifications) and, with your consent, marketing communications.\n\nSafety & Security: Detecting and preventing fraudulent or illegal activity.\n\nLegal Compliance: Complying with Indian laws, court orders, and GST regulations.` },
 { id:'sharing', title:'4. Data Sharing & Disclosure', body:`We do not sell your personal data. We share it only in these limited circumstances:\n\nInstructors: Your name and progress may be shared with the instructor of your enrolled course.\n\nHiring Partners (Opt-in Only): With your explicit consent, your skills and certificates may be shared with our hiring partners.\n\nService Providers: Razorpay (payments), AWS Mumbai (hosting), SendGrid (email), Firebase (notifications) — all bound by strict data processing agreements.\n\nLegal Obligations: We may disclose data to Indian law enforcement or regulatory authorities (MEITY, CERT-In) when required by law.\n\nBusiness Transfers: In a merger or acquisition, data may transfer to the successor entity with prior notice.` },
 { id:'storage', title:'5. Data Storage & Security', body:`Storage Location: All personal data is stored on AWS Mumbai (ap-south-1) servers within India, in compliance with DPDPA data localisation requirements.\n\nRetention: Account data is retained while your account is active. After deletion, data is erased within 30 days, except financial records retained 7 years per the Companies Act and GST rules.\n\nSecurity Measures: AES-256 encryption at rest, TLS 1.3 in transit, bcrypt password hashing, multi-factor authentication (MFA), regular penetration testing by CERT-In empanelled auditors, and role-based access controls.` },
 { id:'rights', title:'6. Your Rights Under DPDPA 2023', body:`As a Data Principal under the DPDPA 2023, you have the right to:\n\nAccess: Request a copy of the personal data we hold about you.\nCorrection: Request correction of inaccurate or incomplete data.\nErasure: Request deletion of your data, subject to legal retention obligations.\nGrievance Redressal: Lodge a complaint with our Grievance Officer and, if unresolved, with the Data Protection Board of India.\nWithdraw Consent: Unsubscribe from marketing communications at any time.\n\nTo exercise these rights, email privacy@learnflow.in. We respond within 30 days.` },
 { id:'cookies', title:'7. Cookies', body:`We use essential, analytics, preference, and marketing cookies. Please refer to our Cookie Policy at learnflow.in/cookies for full details. You can manage non-essential cookies at any time via your Cookie Preferences.` },
 { id:'children', title:'8. Children\'s Privacy', body:`Our Platform is not directed at persons under 18. We do not knowingly collect data from children. If you believe a child has created an account, contact privacy@learnflow.in and we will delete the data immediately.` },
 { id:'changes', title:'9. Changes to This Policy', body:`We may update this Policy periodically. Material changes will be notified via email and a platform notice at least 15 days before taking effect. Continued use after the effective date constitutes acceptance.` },
 { id:'grievance', title:'10. Grievance Officer', body:`Name: Aditi Verma\nDesignation: Data Protection Officer & Grievance Officer\nCompany: Learnflow Technologies Private Limited\nAddress: Learnflow Tower, Phase II, Ghodbunder Rd, near Viviana Mall, Thane West, Maharashtra — 400 606\nEmail: privacy@learnflow.in\nPhone: +91 80 4567 8910\nAvailability: Mon–Fri, 10 AM–6 PM IST\n\nWe acknowledge your grievance within 3 business days and resolve it within 30 days.` },
];

export default function Privacy() {
 return (
 <>
 <section className="relative bg-white border-b border-slate-200 overflow-hidden">
 <div className="absolute inset-0 pointer-events-none"/>
 <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
 <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center mx-auto mb-5"><Shield className="w-7 h-7 text-cyan-600"/></div>
 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-mono bg-cyan-50 text-cyan-700 border border-cyan-200 mb-4 mb-4">Legal</span>
 <h1 className=" text-4xl font-bold text-slate-900 mb-3">Privacy Policy</h1>
 <p className="text-sm text-slate-500 font-mono">Learnflow Technologies Pvt Ltd · Last updated: 15 January 2025</p>
 <p className="text-sm text-slate-600 font-sans mt-2 max-w-lg mx-auto">Compliant with the Digital Personal Data Protection Act, 2023 (DPDPA) and IT (Reasonable Security Practices) Rules, 2011.</p>
 </div>
 </section>

 <section className="py-16 bg-white">
 <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
 <aside className="hidden lg:block">
 <div className="sticky top-6 bg-slate-100 border border-slate-200 rounded-2xl p-4">
 <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-4">Contents</p>
 <nav className="flex flex-col gap-0.5">
 {SECTIONS.map(({id,title})=>(
 <a key={id} href={`#${id}`} className="text-xs text-slate-600 font-sans hover:text-cyan-700 transition-colors py-1.5 px-2 rounded-lg hover:bg-white">{title}</a>
 ))}
 </nav>
 </div>
 </aside>
 <div className="lg:col-span-3">
 {SECTIONS.map(({id,title,body})=>(
 <section key={id} id={id} className="mb-10 scroll-mt-6">
 <h2 className=" text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">{title}</h2>
 <div className="text-sm text-slate-600 font-sans leading-7">
 {body.split('\n\n').map((para,i)=>{
 const [bold, ...rest] = para.split(':');
 const hasLabel = rest.length > 0 && bold.length < 40 && !bold.includes(' ') === false;
 return (
 <p key={i} className="mb-3">
 {hasLabel ? <><strong className="font-semibold text-slate-900">{bold}:</strong>{rest.join(':')}</> : para}
 </p>
 );
 })}
 </div>
 </section>
 ))}
 </div>
 </div>
 </div>
 </section>

 <section className="py-12 bg-slate-100 border-t border-slate-200">
 <div className="max-w-xl mx-auto px-4 text-center">
 <p className="text-sm text-slate-600 font-sans mb-4">Questions about your data? Contact our Data Protection Officer.</p>
 <div className="flex flex-wrap justify-center gap-3">
 <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-600 text-white font-semibold text-sm transition-all duration-200 hover:bg-cyan-700 active:scale-[0.98] px-6 py-2.5 text-sm shadow-sm">Contact DPO <ArrowRight className="w-3.5 h-3.5"/></Link>
 <Link to="/terms" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 text-slate-900 font-semibold text-sm bg-white transition-all duration-200 hover:border-cyan-300 hover:bg-cyan-50 active:scale-[0.98] px-6 py-2.5 text-sm">Terms of Service</Link>
 </div>
 </div>
 </section>
 </>
 );
}
