import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';

const SECTIONS = [
 { id:'acceptance', title:'1. Acceptance of Terms', body:`These Terms of Service ("Terms") constitute a legally binding agreement between you ("User") and Learnflow Technologies Private Limited (CIN U72900KA2020PTC135792), a company incorporated under the Companies Act, 2013, with its registered office at Learnflow Tower, Phase II, Ghodbunder Rd, near Viviana Mall, Thane West, Maharashtra — 400 606\n\nBy creating an account, enrolling in a course, or otherwise using the Platform, you agree to be bound by these Terms, our Privacy Policy, and our Cookie Policy.\n\nThese Terms are governed by the laws of India, including the Information Technology Act, 2000, the Consumer Protection Act, 2019, and all applicable rules thereunder.` },
 { id:'eligibility', title:'2. Eligibility', body:`Age: You must be at least 18 years old, or have parental consent if you are between 15 and 17.\n\nLegal Capacity: You must have the legal capacity to enter into a binding contract under the Indian Contract Act, 1872.\n\nBy using the Platform, you represent and warrant that you meet these requirements.` },
 { id:'accounts', title:'3. User Accounts', body:`Registration: You must provide accurate, current, and complete information during registration.\n\nAccount Security: You are responsible for the confidentiality of your credentials. Notify us immediately at support@learnflow.in if you suspect unauthorised access.\n\nOne Account Per User: Multiple accounts to circumvent bans, obtain duplicate offers, or impersonate others are prohibited.\n\nSuspension: We may suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or disrupt the learning experience.` },
 { id:'courses', title:'4. Courses, Content & Access', body:`Licence: Upon purchasing a course, Learnflow grants you a limited, non-exclusive, non-transferable licence to access and view content for personal, non-commercial educational use.\n\nAccess Period: Purchased courses are accessible for 12 months from enrolment. Live session recordings are retained for 90 days.\n\nRestrictions: You must not download, reproduce, distribute, sell, or screen-record course content. You must not share your account credentials or use content for commercial purposes.\n\nInstructor Content: Instructors are independent educators. Learnflow does not guarantee that course content is error-free or current.` },
 { id:'payments', title:'5. Payments, Refunds & GST', body:`Pricing: All prices are in Indian Rupees (INR) inclusive of 18% GST. Learnflow issues GST-compliant invoices for all purchases.\n\nPayment Processing: Payments are processed by Razorpay, a PCI-DSS Level 1 compliant payment gateway.\n\nRefund Policy: We offer a 7-day full refund from enrolment date, provided you have completed less than 25% of the course content. Requests must be submitted via Dashboard or email. Refunds are processed within 5–7 business days.\n\nExceptions: Refunds are not available for live cohorts after the first session, certification assessment fees, or flash sale purchases with explicit "no refund" labels.\n\nChargebacks: Initiating a chargeback without first contacting support may result in immediate account suspension.` },
 { id:'conduct', title:'6. User Conduct', body:`You agree not to: harass, threaten, or abuse other learners, instructors, or staff; post illegal, obscene, or defamatory content; infringe intellectual property rights; engage in academic dishonesty; attempt unauthorised access to the Platform; or use the Platform for commercial purposes.\n\nViolations may result in immediate account suspension, forfeiture of access to paid content without refund, and legal action under applicable Indian law.` },
 { id:'ip', title:'7. Intellectual Property', body:`All content on the Platform — including course videos, slides, assessments, code samples, trademarks, and logos — is owned by or licensed to Learnflow Technologies Private Limited and is protected under the Copyright Act, 1957 and the Trade Marks Act, 1999.\n\nInstructors retain ownership of their original content but grant Learnflow a worldwide, royalty-free licence to host, distribute, and sublicense that content to enrolled learners.` },
 { id:'liability', title:'8. Disclaimers & Limitation of Liability', body:`No Employment Guarantee: Learnflow provides education and career support but does not guarantee employment or salary increases.\n\nPlatform Availability: We strive for 99.9% uptime but do not guarantee uninterrupted access. Scheduled maintenance is announced 48 hours in advance.\n\nLimitation: To the maximum extent permitted by Indian law, Learnflow's total liability for any claim shall not exceed the amount paid by you for the specific course in the 3 months preceding the claim. Learnflow shall not be liable for indirect or consequential damages.` },
 { id:'governing', title:'9. Governing Law & Disputes', body:`These Terms are governed by the laws of India.\n\nInformal Resolution: Contact us first at legal@learnflow.in. Most disputes resolve amicably within 30 days.\n\nArbitration: Unresolved disputes shall be referred to arbitration under the Arbitration and Conciliation Act, 1996. Seat: Thane, Maharashtra. Language: English.\n\nConsumer Disputes: Nothing in these Terms limits your rights under the Consumer Protection Act, 2019, including the right to approach the District Consumer Disputes Redressal Commission for Thane.\n\nCourts: For non-arbitrable matters, the courts of Thane, Maharashtra shall have exclusive jurisdiction.` },
 { id:'amendments', title:'10. Amendments', body:`Learnflow may modify these Terms at any time. Material changes will be communicated via email and platform notice at least 15 days before they take effect. Continued use after the effective date constitutes acceptance.` },
];

export default function Terms() {
 return (
 <>
 <section className="relative bg-white border-b border-slate-200 overflow-hidden">
 <div className="absolute inset-0 pointer-events-none"/>
 <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
 <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center mx-auto mb-5"><FileText className="w-7 h-7 text-cyan-600"/></div>
 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-mono bg-cyan-50 text-cyan-700 border border-cyan-200 mb-4 mb-4">Legal</span>
 <h1 className=" text-4xl font-bold text-slate-900 mb-3">Terms of Service</h1>
 <p className="text-sm text-slate-500 font-mono">Learnflow Technologies Pvt Ltd · CIN U72900KA2020PTC135792 · Last updated: 15 January 2025</p>
 <p className="text-sm text-slate-600 font-sans mt-2 max-w-lg mx-auto">Governed by the laws of India, including the IT Act, 2000 and the Consumer Protection Act, 2019.</p>
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
 const colonIdx = para.indexOf(':');
 const hasLabel = colonIdx > 0 && colonIdx < 40 && !para.substring(0,colonIdx).includes(' ') === false;
 return <p key={i} className="mb-3">{para}</p>;
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
 <p className="text-sm text-slate-600 font-sans mb-4">Legal queries? Email legal@learnflow.in. For general support, visit our Help Centre.</p>
 <div className="flex flex-wrap justify-center gap-3">
 <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-600 text-white font-semibold text-sm transition-all duration-200 hover:bg-cyan-700 active:scale-[0.98] px-6 py-2.5 text-sm shadow-sm">Contact Us <ArrowRight className="w-3.5 h-3.5"/></Link>
 <Link to="/help" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 text-slate-900 font-semibold text-sm bg-white transition-all duration-200 hover:border-cyan-300 hover:bg-cyan-50 active:scale-[0.98] px-6 py-2.5 text-sm">Help Centre</Link>
 <Link to="/privacy" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 text-slate-900 font-semibold text-sm bg-white transition-all duration-200 hover:border-cyan-300 hover:bg-cyan-50 active:scale-[0.98] px-6 py-2.5 text-sm">Privacy Policy</Link>
 </div>
 </div>
 </section>
 </>
 );
}
