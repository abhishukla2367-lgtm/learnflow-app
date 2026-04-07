import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail, Phone, MapPin, Clock, ArrowRight, MessageCircle,
  Building2, HeadphonesIcon, Briefcase, Send, CheckCircle,
  Star, ThumbsUp, Quote, X, Loader2, CheckCircle2, Copy, Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { db } from '../firebase'; // Adjust path to your firebase.js
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, limit, where } from 'firebase/firestore';


/* ─── Static data ─────────────────────────────────────────── */
const OFFICES = [
  { city: 'Thane (HQ)', icon: '🏢', address: 'Learnflow Tower, Phase II, Ghodbunder Rd, near Viviana Mall, Thane West, Maharashtra — 400 606', phone: '+91 22 4567 8900', email: 'hello@learnflow.in', hours: 'Mon–Fri, 9 AM – 7 PM IST' },
  { city: 'Bengaluru',  icon: '📍', address: '3rd Floor, 91springboard, Koramangala, Bengaluru — 560 034', phone: '+91 80 4567 8900', email: 'blr@learnflow.in', hours: 'Mon–Fri, 9 AM – 7 PM IST' },
  { city: 'Mumbai',     icon: '🏙️', address: 'WeWork BKC, G Block, Bandra Kurla Complex, Mumbai — 400 051', phone: '+91 22 6789 0123', email: 'mumbai@learnflow.in', hours: 'Mon–Fri, 9 AM – 7 PM IST' },
];

const OPTIONS = [
  { icon: MessageCircle,  title: 'General Enquiry',    desc: 'Questions about courses, features, or the platform?',     cta: 'Chat with us',    link: '#form',  color: 'bg-cyan-50 border-cyan-200 text-cyan-600'       },
  { icon: HeadphonesIcon, title: 'Learner Support',    desc: 'Issue with your account, payment, or course access?',     cta: 'Get support',    link: '/help',  color: 'bg-violet-50 border-violet-200 text-violet-600' },
  { icon: Briefcase,      title: 'Corporate Training', desc: 'Looking to upskill your team? We offer custom B2B plans.', cta: 'Talk to sales',  link: '#form',  color: 'bg-emerald-50 border-emerald-200 text-emerald-600' },
  { icon: Building2,      title: 'Hiring Partnership', desc: 'Want to hire verified Learnflow graduates?',               cta: 'Partner with us', link: '#form', color: 'bg-amber-50 border-amber-200 text-amber-600'     },
];

const AVATAR_COLORS = [
  'from-cyan-500 to-cyan-700',
  'from-violet-500 to-violet-700',
  'from-emerald-500 to-emerald-700',
  'from-amber-500 to-amber-700',
];

const MAX_MESSAGE = 1000;

/* ─── Copy-to-clipboard hook ──────────────────────────────── */
function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return [copied, copy];
}

/* ─── Sub-components ──────────────────────────────────────── */
function StarRow({ rating, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} style={{ width: size, height: size }}
          className={i <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'} />
      ))}
    </div>
  );
}

function StarPicker({ label, value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(num => (
          <button key={num} type="button"
            onClick={() => onChange(num)}
            onMouseEnter={() => setHovered(num)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform active:scale-110 hover:scale-125">
            <Star size={22}
              className={num <= (hovered || value)
                ? 'text-amber-400 fill-amber-400'
                : 'text-slate-300 fill-slate-100'} />
          </button>
        ))}
      </div>
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, copy] = useCopy();
  return (
    <button onClick={() => copy(text)} title="Copy"
      className="ml-1 p-0.5 rounded text-slate-300 hover:text-cyan-500 transition-colors flex-shrink-0">
      {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
    </button>
  );
}

function ReviewCard({ review, onHelpful }) {
  const [voted, setVoted] = useState(false);
  const [count, setCount] = useState(review.helpful || 0);
  const handle = () => { if (voted) return; setVoted(true); setCount(c => c + 1); onHelpful?.(review.id); };
  
  // Deterministic color based on the review ID or name to keep it consistent
  const colorIdx = typeof review.id === 'number' 
    ? review.id % AVATAR_COLORS.length 
    : review.name.length % AVATAR_COLORS.length;

  return (
    <article className="relative bg-white border border-slate-200 rounded-2xl p-7 flex flex-col gap-5 shadow-sm hover:border-cyan-200 hover:shadow-md transition-all duration-300">
      {/* ── Header: Avatar, Info, and Stars ── */}
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[colorIdx]} flex items-center justify-center font-bold text-white text-sm flex-shrink-0 shadow-sm`}>
          {review.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-900 truncate">{review.name}</h3>
          <p className="text-xs text-slate-500 font-mono truncate">{review.role} · {review.city}</p>
        </div>
        <StarRow rating={review.overallRating} />
      </div>

      {/* ── Review Text: Italicized and exactly like seed reviews ── */}
      {review.overallDetail && (
        <p className="text-sm text-slate-600 leading-relaxed italic">
          "{review.overallDetail}"
        </p>
      )}

      {/* ── Detailed Ratings Grid ── */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Course', val: review.courseRating },
          { label: 'Instructor', val: review.instructorRating },
          { label: 'Platform', val: review.platformRating },
        ].map(({ label, val }) => (
          <div key={label} className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-center">
            <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <div className="flex justify-center gap-0.5">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={9} className={i <= (val || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer: Badge and Helpful Button ── */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
      <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold font-mono">
      <CheckCircle className="w-3 h-3" /> Verified Learner
      </span>
        <button onClick={handle} disabled={voted}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all font-medium
            ${voted
              ? 'border-cyan-300 text-cyan-700 bg-cyan-50'
              : 'border-slate-200 text-slate-500 hover:border-cyan-300 hover:text-cyan-700 hover:bg-cyan-50'
            }`}>
          <ThumbsUp size={11} /> Helpful {count > 0 ? `(${count})` : ''}
        </button>
      </div>
    </article>
  );
}

/* ─── Inline Review Form ──────────────────────────────────── */
function ReviewForm({ onSubmit, submitting, submitted }) {
  const [form, setForm] = useState({
    name: '', role: '', city: '',
    courseRating: 0, instructorRating: 0, platformRating: 0,
    overallRating: 0, overallDetail: '', likedDetail: '', improveDetail: '',
  });
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())                                               e.name          = 'Name is required';
    if (form.overallRating === 0)                                        e.overallRating = 'Please select an overall rating';
    if (!form.overallDetail.trim() || form.overallDetail.length < 10)   e.overallDetail = 'Write at least 10 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (honeypot.length > 0) {
      console.log("Bot detected.");
      return; 
    }
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    await onSubmit(form);
    setForm({ name:'',role:'',city:'',courseRating:0,instructorRating:0,platformRating:0,overallRating:0,overallDetail:'',likedDetail:'',improveDetail:'' });
  };

  const inputCls = 'w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm transition-all duration-200 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100';

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center bg-emerald-50 border border-emerald-200 rounded-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center">
          <CheckCircle2 size={30} className="text-emerald-500" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">Thank you for your review!</h3>
          <p className="text-slate-500 text-sm">Your review is now live and will help other learners.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col gap-6 shadow-sm">
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-1">Share your Learnflow experience</h3>
        <p className="text-sm text-slate-500">Your review helps thousands of learners make better decisions.</p>
      </div>

      {/* Basic info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div style={{ display: 'none' }} aria-hidden="true">
        <input 
          type="text" 
          name="website" 
          value={honeypot} 
          onChange={(e) => setHoneypot(e.target.value)} 
          tabIndex="-1" 
          autoComplete="off" 
        />
      </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name *</label>
          <input placeholder="Rahul Sharma" value={form.name}
            onChange={e => set('name', e.target.value)} className={inputCls} />
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Role / Job Title</label>
          <input placeholder="Frontend Developer" value={form.role}
            onChange={e => set('role', e.target.value)} className={inputCls} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">City</label>
          <input placeholder="Pune" value={form.city}
            onChange={e => set('city', e.target.value)} className={inputCls} />
        </div>
      </div>

      {/* Sub-ratings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
        <StarPicker label="Course Quality" value={form.courseRating}     onChange={v => set('courseRating', v)} />
        <StarPicker label="Instructor"     value={form.instructorRating} onChange={v => set('instructorRating', v)} />
        <StarPicker label="Platform"       value={form.platformRating}   onChange={v => set('platformRating', v)} />
      </div>

      {/* What did you like */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">What did you like most?</label>
        <textarea rows={2} placeholder="The IST-friendly live sessions, certificate quality, instructors…"
          value={form.likedDetail} onChange={e => set('likedDetail', e.target.value)}
          className={`${inputCls} resize-none`} />
      </div>

      {/* Suggestions */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Suggestions for improvement</label>
        <textarea rows={2} placeholder="What could we do better?"
          value={form.improveDetail} onChange={e => set('improveDetail', e.target.value)}
          className={`${inputCls} resize-none`} />
      </div>

      {/* Overall */}
      <div className="space-y-4 pt-5 border-t border-slate-200">
        <StarPicker label="Overall Rating *" value={form.overallRating} onChange={v => set('overallRating', v)} />
        {errors.overallRating && <p className="text-red-500 text-xs -mt-2">{errors.overallRating}</p>}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Overall Experience *</label>
          <textarea rows={4}
            placeholder="Share your overall experience — how Learnflow helped your career…"
            value={form.overallDetail}
            onChange={e => set('overallDetail', e.target.value)}
            className={`${inputCls} resize-none`} />
          <p className="text-xs text-slate-400 text-right">{form.overallDetail.length} characters</p>
          {errors.overallDetail && <p className="text-red-500 text-xs">{errors.overallDetail}</p>}
        </div>
      </div>

      <button type="submit" disabled={submitting}
        className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-base transition-all shadow-md
          ${submitting
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
            : 'bg-cyan-600 hover:bg-cyan-700 text-white hover:-translate-y-0.5 shadow-cyan-600/25 active:scale-[0.98]'
          }`}>
        {submitting
          ? <><Loader2 size={18} className="animate-spin" /> Submitting…</>
          : <><Star size={16} className="fill-white" /> Submit Review</>}
      </button>
    </form>
  );
}

/* ─── Main Component ──────────────────────────────────────── */
export default function Contact() {
  /* Contact form */
  const [form, setForm]   = useState({ name: '', email: '', phone: '', subject: 'General Enquiry', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit = async e => {
  e.preventDefault();
  if (!form.name || !form.email || !form.message) { 
    toast.error('Please fill in all required fields.'); 
    return; 
  }
  
  setSending(true);
  try {
    // Save to "messages" collection
    await addDoc(collection(db, "messages"), {
      ...form,
      createdAt: serverTimestamp()
    });
    
    setSending(false); 
    setSent(true);
    toast.success("Message sent! We'll reply within 24 hours.");
  } catch (error) {
    setSending(false);
    toast.error("Something went wrong. Please try again.");
    console.error("Firestore Error:", error);
  }
};
  /* Reviews State */
  const [reviews, setReviews] = useState([]);
  const [submittingR, setSubmittingR] = useState(false);
  const [reviewSent, setReviewSent] = useState(false);

  useEffect(() => {
    const q = query(
    collection(db, "reviews"),
    where("status", "==", "approved"),
    where("overallRating", ">=", 4), 
    orderBy("overallRating", "desc"),
    orderBy("createdAt", "desc"),
    limit(3)
  );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const remoteReviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // This merges the live Firestore data with your initial hardcoded data
      setReviews(remoteReviews);
    });

    return () => unsubscribe();
  }, []);
   const submitReview = async (formData) => {
  setSubmittingR(true);
  try {
    // 1. Prepare the review object
    const newReview = {
      name: formData.name.trim(),
      role: formData.role.trim() || 'Learnflow Learner',
      city: formData.city.trim() || 'India',
      avatar: formData.name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
      courseRating: formData.courseRating,
      instructorRating: formData.instructorRating,
      platformRating: formData.platformRating,
      overallRating: formData.overallRating,
      overallDetail: formData.overallDetail.trim(),
      likedDetail: formData.likedDetail.trim(),
      improveDetail: formData.improveDetail.trim(),
      helpful: 0,
      isVerified: true,
      status: 'pending',
      createdAt: serverTimestamp(), // Vital for the orderBy("createdAt", "desc") query
    };

    // 2. Save to "reviews" collection
    await addDoc(collection(db, "reviews"), newReview);

    // 3. Update UI state
    setReviewSent(true);
    toast.success('Review submitted successfully!');
    
    // Reset the "sent" view after a few seconds if you want them to be able to post again
    setTimeout(() => setReviewSent(false), 5000);
  } catch (error) {
    console.error("Error adding review: ", error);
    toast.error('Failed to submit review. Please try again.');
  } finally {
    setSubmittingR(false);
  }
};
  // FIX: Safe avgRating — no NaN
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.overallRating, 0) / reviews.length).toFixed(1)
    : null;
  const roundedAvg = avgRating ? Math.round(parseFloat(avgRating)) : 0;

  const inputCls = 'w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 text-base transition-all duration-200 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100';

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-white border-b border-slate-200 overflow-hidden">
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(8,145,178,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(8,145,178,0.06)_1px,transparent_1px)] [background-size:40px_40px] opacity-60 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold font-mono bg-cyan-50 text-cyan-700 border border-cyan-200 mb-6">Contact Us</span>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            We'd love to hear<br /><span className="text-cyan-600">from you.</span>
          </h1>
          <p className="text-slate-600 text-xl leading-relaxed max-w-xl mx-auto">
            Our India-based support team is available Monday to Friday, 9 AM to 7 PM IST. Average response time: under 4 hours.
          </p>
        </div>
      </section>

      {/* ── Contact options ── */}
      <section className="py-12 bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {OPTIONS.map(({ icon: Icon, title, desc, cta, link, color }) => (
              <a key={title} href={link}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-cyan-200 hover:shadow-md hover:-translate-y-0.5 transition-all block">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${color}`}><Icon className="w-6 h-6" /></div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-600 font-sans leading-relaxed mb-4">{desc}</p>
                <span className="text-sm font-semibold text-cyan-600 font-mono flex items-center gap-1">{cta} <ArrowRight className="w-4 h-4" /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form + Offices ── */}
      <section id="form" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Send us a message</h2>
              <p className="text-base text-slate-500 font-sans mb-10">All fields marked * are required. We respond within 24 hours on working days.</p>

              {sent ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-14 text-center">
                  <div className="w-[72px] h-[72px] rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="w-9 h-9 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Message received!</h3>
                  <p className="text-base text-slate-600 font-sans">We'll get back to you at <strong>{form.email}</strong> within 24 hours.</p>
                  <button onClick={() => { setSent(false); setForm({ name:'', email:'', phone:'', subject:'General Enquiry', message:'' }); }}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border border-slate-200 text-slate-900 font-semibold text-base bg-white transition-all duration-200 hover:border-cyan-300 hover:bg-cyan-50 active:scale-[0.98] mt-7">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 font-sans mb-2">Full Name *</label>
                      <input name="name" value={form.name} onChange={handle} type="text" placeholder="Rahul Sharma" className={inputCls} required />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 font-sans mb-2">Email Address *</label>
                      <input name="email" value={form.email} onChange={handle} type="email" placeholder="rahul@example.com" className={inputCls} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 font-sans mb-2">Phone (optional)</label>
                      {/* FIX: Proper border-join with matching border-radius */}
                      <div className="flex">
                        <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-500 text-sm font-mono select-none">+91</span>
                        <input name="phone" value={form.phone} onChange={handle} type="tel" placeholder="98765 43210"
                          className={`${inputCls} rounded-l-none border-l-0 focus:border-l focus:ring-0 focus:border-cyan-400`} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 font-sans mb-2">Subject *</label>
                      <select name="subject" value={form.subject} onChange={handle} className={`${inputCls} cursor-pointer`} required>
                        {['General Enquiry','Learner Support','Corporate Training','Hiring Partnership','Instructor Application','Billing & Payments','Technical Issue'].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 font-sans mb-2">Message *</label>
                    <textarea name="message" value={form.message} onChange={handle} rows={5}
                      maxLength={MAX_MESSAGE}
                      placeholder="Tell us how we can help you…"
                      className={`${inputCls} resize-none`} required />
                    {/* FIX: Character counter */}
                    <p className={`text-xs text-right mt-1 font-mono ${form.message.length >= MAX_MESSAGE ? 'text-red-500' : 'text-slate-400'}`}>
                      {form.message.length}/{MAX_MESSAGE}
                    </p>
                  </div>
                  <button type="submit" disabled={sending}
                    className="inline-flex items-center gap-2 px-9 py-4 rounded-lg bg-cyan-600 text-white font-semibold text-base transition-all duration-200 hover:bg-cyan-700 active:scale-[0.98] shadow-sm disabled:opacity-60">
                    {sending
                      ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending…</>
                      : <><Send className="w-5 h-5" />Send Message</>}
                  </button>
                </form>
              )}
            </div>

            {/* Offices */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-9">Our offices</h2>
              <div className="flex flex-col gap-4">
                {OFFICES.map(({ city, icon, address, phone, email, hours }) => (
                  <div key={city} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:border-cyan-200 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{icon}</span>
                      <h3 className="text-lg font-bold text-slate-900">{city}</h3>
                    </div>
                    <div className="space-y-2.5 text-sm">
                      {/* FIX: Copy-to-clipboard on phone and email */}
                      <p className="flex gap-2.5 text-slate-600 text-sm leading-relaxed">
                        <MapPin className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />{address}
                      </p>
                      <p className="flex items-center gap-2.5 text-slate-600 text-sm">
                        <Phone className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                        <span className="flex-1">{phone}</span>
                        <CopyButton text={phone} />
                      </p>
                      <p className="flex items-center gap-2.5 text-slate-600 text-sm">
                        <Mail className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                        <span className="flex-1 truncate">{email}</span>
                        <CopyButton text={email} />
                      </p>
                      <p className="flex gap-2.5 text-slate-600 text-sm leading-relaxed">
                        <Clock className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />{hours}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-6">
                  <h3 className="text-base font-bold text-slate-900 mb-2">WhatsApp Support</h3>
                  <p className="text-sm text-slate-600 font-sans mb-4">Chat instantly — available 9 AM–9 PM IST.</p>
                  <a href="https://wa.me/912245678900"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-cyan-600 text-white font-semibold text-base transition-all duration-200 hover:bg-cyan-700 active:scale-[0.98] justify-center w-full">
                    💬 Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Learner Reviews Section (always visible, inline form) ── */}
      <section id="reviews" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-mono bg-amber-50 text-amber-700 border border-amber-200 mb-4">
                Learner Reviews
              </span>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">What our learners say</h2>
              <p className="text-slate-500 text-sm">Real stories from real learners across India — verified enrollments only.</p>
            </div>

            {/* FIX: Safe avgRating badge — no NaN */}
            {avgRating && (
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 flex-shrink-0">
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-500 leading-none">{avgRating}</p>
                  <p className="text-slate-400 text-[10px] mt-0.5 font-mono">avg rating</p>
                </div>
                <div className="flex flex-col gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={10} className={i <= roundedAvg ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main container for reviews and stats */}
<div className="flex flex-col">

  {/* Reviews Grid: Changed to md:grid-cols-3 to force 3 in one row */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
    {reviews.length > 0 ? (
      reviews.map(r => <ReviewCard key={r.id} review={r} />)
    ) : (
      <div className="col-span-full py-16 text-center bg-white border border-dashed border-slate-200 rounded-2xl">
        <p className="text-slate-400">Loading top reviews...</p>
      </div>
    )}
  </div>

  {/* Stats strip - now centered below the row of 3 */}
  <div className="flex flex-wrap items-center justify-center gap-8 py-6 px-8 bg-white border border-slate-200 rounded-2xl mb-16 shadow-sm">
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}</div>
      <span className="text-sm font-bold text-slate-900">{avgRating ?? '—'} / 5</span>
      <span className="text-xs text-slate-400 font-mono">avg rating</span>
    </div>
    <div className="w-px h-6 bg-slate-200 hidden sm:block" />
    <div className="text-sm text-slate-600">
      Based on <span className="font-bold text-slate-900">{reviews.length}</span> verified reviews
    </div>
    <div className="w-px h-6 bg-slate-200 hidden sm:block" />
    <div className="text-sm text-slate-600"><span className="font-bold text-slate-900">98%</span> would recommend Learnflow</div>
  </div>
</div>
            {/* FIX: Always-visible inline review form — no modal needed */}
            <div className="max-w-4xl mx-auto w-full">
              <ReviewForm
                onSubmit={submitReview}
                submitting={submittingR}
                submitted={reviewSent}
              />
            </div>
          </div>
      </section>

      {/* ── Help centre CTA ── */}
      <section className="py-14 bg-white border-t border-slate-200">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Looking for quick answers?</h2>
          <p className="text-base text-slate-600 font-sans mb-6">Browse our help centre — most questions answered in seconds.</p>
          <Link to="/help"
           className="inline-flex items-center gap-2 px-9 py-4 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-base transition-all duration-200 active:scale-[0.98]">
           Visit Help Centre <ArrowRight className="w-5 h-5 text-white" />
          </Link>
        </div>
      </section>
    </>
  );
}