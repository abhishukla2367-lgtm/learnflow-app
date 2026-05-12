import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth, enrollmentKey } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import {
  ShieldCheck, Lock, ChevronDown, ChevronUp, CheckCircle,
  CreditCard, Smartphone, Building2, ArrowLeft,
  AlertCircle, Clock, Users, Star, BadgeCheck,
  RefreshCw, Eye, EyeOff
} from 'lucide-react';
import { MdPlayCircleOutline } from 'react-icons/md';

const TEST_CARDS = [
  { brand: 'Visa',       number: '4111 1111 1111 1111', expiry: '12/26', cvv: '123', name: 'Test User' },
  { brand: 'Mastercard', number: '5555 5555 5555 4444', expiry: '08/27', cvv: '456', name: 'Test User' },
  { brand: 'RuPay',      number: '6011 1111 1111 1117', expiry: '03/28', cvv: '789', name: 'Test User' },
];

/* ── Formatters ── */
const formatCard = v =>
  v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

const formatExpiry = v => {
  const digits = v.replace(/\D/g, '').slice(0, 4);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const formatCVV = v => v.replace(/\D/g, '').slice(0, 4);

/* ── Card brand detector ── */
function cardBrand(num) {
  const n = num.replace(/\s/g, '');
  if (/^4/.test(n))      return 'Visa';
  if (/^5[1-5]/.test(n)) return 'Mastercard';
  if (/^3[47]/.test(n))  return 'Amex';
  if (/^6/.test(n))      return 'RuPay';
  return null;
}

/* ── Luhn algorithm ── */
function luhn(num) {
  const digits = num.replace(/\s/g, '');
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10);
    if (shouldDouble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

/* ── Canonical enrollment ID ── */
function enrollmentId(e) {
  return String(
    e._id ||
    e.certId ||
    e.course?._id ||
    e.course?.id ||
    e.course ||
    ''
  );
}

/* ── Nuclear AutoComplete killer hook ── */
function useAntiAutofill(inputRef) {
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const nukeAttrs = () => {
      el.setAttribute('autocomplete', 'off');
      el.setAttribute('autocorrect', 'off');
      el.setAttribute('autocapitalize', 'off');
      el.setAttribute('spellcheck', 'false');
      el.setAttribute('data-form-type', 'other');
      el.setAttribute('data-lpignore', 'true');
      el.setAttribute('data-1p-ignore', 'true');
      el.setAttribute('data-bwignore', 'true');
      el.setAttribute('data-dashlane-ignore', 'true');
      el.setAttribute('data-np-intersection-state', 'hidden');
    };
    nukeAttrs();
    const observer = new MutationObserver(nukeAttrs);
    observer.observe(el, { attributes: true, attributeFilter: ['autocomplete'] });
    return () => observer.disconnect();
  }, [inputRef]);
}

/* ── Anti-autofill input wrapper ── */
function NoFillInput({ className, type = 'text', overlay, ...props }) {
  const ref = useRef(null);
  useAntiAutofill(ref);
  const [fakeName] = useState(() => `nf_${Math.random().toString(36).slice(2)}`);
  return (
    <div className="relative">
      <input
        aria-hidden="true" tabIndex={-1} type={type} name={fakeName}
        autoComplete="off"
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, width: 0, top: 0, left: 0 }}
      />
      <input
        ref={ref} type={type} name={fakeName + '_real'}
        autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
        data-form-type="other" data-lpignore="true" data-1p-ignore="true" data-bwignore="true"
        className={className} {...props}
      />
      {overlay}
    </div>
  );
}

/* ── Anti-autofill password input (for CVV) ── */
function NoFillPassword({ className, showToggle, onToggle, show, ...props }) {
  const ref = useRef(null);
  useAntiAutofill(ref);
  const [fakeName] = useState(() => `nf_${Math.random().toString(36).slice(2)}`);
  return (
    <div className="relative">
      <input
        aria-hidden="true" tabIndex={-1} type="password" name={fakeName}
        autoComplete="new-password"
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, width: 0, top: 0, left: 0 }}
      />
      <input
        ref={ref} type={show ? 'text' : 'password'} name={fakeName + '_real'}
        autoComplete="new-password" autoCorrect="off" autoCapitalize="off" spellCheck={false}
        data-form-type="other" data-lpignore="true" data-1p-ignore="true" data-bwignore="true"
        className={`${className} pr-10`} {...props}
      />
      {showToggle && (
        <button type="button" onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          aria-label={show ? 'Hide CVV' : 'Show CVV'}>
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}

/* ── Field wrapper ── */
function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide font-mono">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 font-mono">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}

/* ── Step indicator ── */
function Steps({ current }) {
  const steps = ['Order Summary', 'Payment', 'Confirmation'];
  return (
    <div className="flex items-center gap-0">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i < current  ? 'bg-cyan-600 text-white' :
              i === current ? 'bg-cyan-600 text-white ring-4 ring-cyan-100' :
              'bg-slate-200 text-slate-500'
            }`}>
              {i < current ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-xs font-mono hidden sm:block ${
              i === current ? 'text-cyan-700 font-semibold' : 'text-slate-400'
            }`}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-8 sm:w-16 h-0.5 mx-2 transition-all ${i < current ? 'bg-cyan-600' : 'bg-slate-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Test card picker ── */
function TestCardPicker({ onPick }) {
  return (
    <div className="mb-4 p-3 rounded-xl border border-dashed border-amber-300 bg-amber-50">
      <p className="text-xs font-bold text-amber-700 font-mono mb-2 flex items-center gap-1.5">
        <MdPlayCircleOutline  className="w-3 h-3" /> Demo mode — click a test card to fill:
      </p>
      <div className="flex flex-wrap gap-2">
        {TEST_CARDS.map(tc => (
          <button key={tc.brand} type="button" onClick={() => onPick(tc)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-amber-200 text-xs font-mono text-amber-800 hover:border-amber-400 hover:bg-amber-100 transition-all">
            <span className="font-bold">{tc.brand}</span>
            <span className="text-amber-500">···{tc.number.slice(-4)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN CHECKOUT COMPONENT
══════════════════════════════════════════ */
export default function CourseCheckout() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user }  = useAuth();

  const courseState = location.state?.course || null;
  const course = courseState ? {
    ...courseState,
    origPrice: courseState.origPrice && courseState.origPrice > courseState.price
      ? courseState.origPrice
      : Math.round((courseState.price || 0) * 1.5) || courseState.price || 0,
  } : null;

  const [payMethod,     setPayMethod]     = useState('card');
  const [card,          setCard]          = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [cardErrors,    setCardErrors]    = useState({});
  const [showCVV,       setShowCVV]       = useState(false);
  const [upi,           setUpi]           = useState('');
  const [upiError,      setUpiError]      = useState('');
  const [bank,          setBank]          = useState('');
  const [bankError,     setBankError]     = useState('');
  const [processing,    setProcessing]    = useState(false);
  const [agreeTerms,    setAgreeTerms]    = useState(false);
  const [termsError,    setTermsError]    = useState('');
  const [showSummary,   setShowSummary]   = useState(true);
  const [payError,      setPayError]      = useState('');

  useEffect(() => {
    if (!user)   { setTimeout(() => navigate('/login'),   0); return; }
    if (!course) { setTimeout(() => navigate('/courses'), 0); }
  }, [user, course, navigate]);

  if (!course || !user) return null;

  /* ── Calculations ── */
  const basePrice = course.price || 0;
  const gst       = Math.round(basePrice * 0.18);
  const total     = basePrice + gst;
  const savings   = Math.max(0, course.origPrice - total);
  const brand     = cardBrand(card.number);

  /* ── Card validation ── */
  function validateCard() {
    const errs = {};
    const num = card.number.replace(/\s/g, '');
    if (num.length < 16) {
      errs.number = 'Enter a valid 16-digit card number';
    } else if (!luhn(num)) {
      errs.number = 'Card number is invalid';
    }
    if (!card.name.trim()) errs.name = 'Cardholder name is required';
    const parts = card.expiry.split('/');
    const mm = parts[0];
    const yy = parts[1];
    if (!mm || !yy || mm.length < 2 || yy.length < 2) {
      errs.expiry = 'Enter a valid expiry date (MM/YY)';
    } else {
      const month = Number(mm);
      if (month < 1 || month > 12) {
        errs.expiry = 'Month must be between 01 and 12';
      } else {
        const expDate = new Date(`20${yy}`, month - 1);
        const now = new Date();
        if (expDate < new Date(now.getFullYear(), now.getMonth(), 1)) {
          errs.expiry = 'Card has expired';
        }
      }
    }
    if (card.cvv.length < 3) errs.cvv = 'Enter a valid CVV';
    setCardErrors(errs);
    return Object.keys(errs).length === 0;
  }

  /* ── UPI validation ── */
  function validateUPI() {
    const valid = /^[\w.\-_]+@[\w]{3,}$/.test(upi.trim());
    setUpiError(valid ? '' : 'Enter a valid UPI ID (e.g. name@okaxis)');
    return valid;
  }

  function validateBank() {
    if (!bank) { setBankError('Please select a bank to continue'); return false; }
    setBankError('');
    return true;
  }

  const applyUPISuffix = (suffix) => {
    const base = upi.split('@')[0];
    setUpi(`${base}${suffix}`);
  };

  /* ── Submit ── */
  const handlePay = async () => {
    setPayError('');
    if (!agreeTerms) {
      setTermsError('Please accept the terms and conditions to continue.');
      return;
    }
    setTermsError('');
    let valid = false;
    if (payMethod === 'card')            valid = validateCard();
    else if (payMethod === 'upi')        valid = validateUPI();
    else if (payMethod === 'netbanking') valid = validateBank();
    if (!valid) return;

    const finalCourseId = course?._id || course?.id || course?.courseId;
    if (!finalCourseId) {
      toast.error('Course ID missing. Please go back and try again.');
      return;
    }

    setProcessing(true);
    try {
      let enrollData = {};
      try {
        const { data } = await api.post(`/enrollments/${finalCourseId}`, {
          status: 'enrolled', paymentMethod: payMethod, amount: total, type: 'paid',
        });
        enrollData = data;
      } catch (apiErr) {
        console.warn('Enrollment API error:', apiErr?.response?.data?.message || apiErr.message);
      }

      const uid      = user._id || user.id;
      const lsKey    = enrollmentKey(uid);
      const targetId = String(finalCourseId);

      const snap = {
        _id: enrollData?.enrollment?._id || enrollData?.data?._id || `local_${targetId}_${Date.now()}`,
        course: {
          _id: targetId, id: targetId,
          title: course.title,
          thumbnail: course.thumbnail || null,
          instructor: course.instructor || null,
          description: course.desc || course.description || null,
          emoji: course.emoji || null,
          tag: course.tag || null,
        },
        courseId:    targetId,
        progress:    0,
        enrolledAt:  new Date().toISOString(),
        type:        'paid',
        courseModel: 'Course',
      };

      try {
        const stored  = JSON.parse(localStorage.getItem(lsKey) || '[]');
        const deduped = stored.filter(e => enrollmentId(e) !== targetId);
        localStorage.setItem(lsKey, JSON.stringify([...deduped, snap]));
      } catch (lsErr) {
        console.error('LocalStorage update failed:', lsErr);
      }

      try {
        const cache = JSON.parse(localStorage.getItem('lf_course_cache') || '{}');
        cache[targetId] = course;
        localStorage.setItem('lf_course_cache', JSON.stringify(cache));
      } catch (cacheErr) {
        console.error('Cache update failed:', cacheErr);
      }

      navigate('/course-success', {
        state: { course, courseId: finalCourseId, isTrial: false },
      });

    } catch (err) {
      console.error('Payment flow failed:', err);
      setPayError('Something went wrong. Please try again.');
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  /* ── Shared input class builder ── */
  const inputCls = (hasError) =>
    `w-full px-4 py-3 rounded-xl border text-sm font-mono bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
      hasError ? 'border-red-300' : 'border-slate-200'
    }`;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Demo banner */}
      <div className="bg-amber-400 text-amber-900 text-xs font-mono font-bold text-center py-2 tracking-wide">
        ⚠ DEMO MODE — No real payments processed. Use the test cards provided.
      </div>

      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 font-mono transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <Steps current={1} />
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-500" /> Secure checkout
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* ════ LEFT — Payment form ════ */}
          <div className="lg:col-span-3 space-y-5">

            {/* FIX: Page heading now lives inside its own white card so it
                aligns visually with the Order Summary card on the right */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-6 py-5">
              <h1 className="text-2xl font-bold text-slate-900">Complete your enrollment</h1>
              <p className="text-sm text-slate-500 font-mono mt-1">
                Logged in as <span className="text-cyan-600">{user?.email}</span>
              </p>
            </div>

            {/* Payment method selector */}
            <div role="presentation" className="bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="px-6 pt-5 pb-4 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide font-mono">
                  Payment method
                </h2>
              </div>

              <div className="flex border-b border-slate-100">
                {[
                  { id: 'card',       icon: CreditCard, label: 'Card' },
                  { id: 'upi',        icon: Smartphone, label: 'UPI' },
                  { id: 'netbanking', icon: Building2,  label: 'Net Banking' },
                ].map(({ id, icon: Icon, label }) => (
                  <button key={id}
                    onClick={() => { setPayMethod(id); setCardErrors({}); setUpiError(''); setBankError(''); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold font-mono transition-all border-b-2 ${
                      payMethod === id
                        ? 'border-cyan-600 text-cyan-700 bg-cyan-50'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}>
                    <Icon className="w-4 h-4" /> {label}
                  </button>
                ))}
              </div>

              <div className="p-6">

                {/* ── CARD FORM ── */}
                {payMethod === 'card' && (
                  <div className="space-y-4">
                    <TestCardPicker onPick={tc => setCard({ number: tc.number, name: tc.name, expiry: tc.expiry, cvv: tc.cvv })} />

                    <Field label="Card number" error={cardErrors.number}>
                      <NoFillInput
                        inputMode="numeric"
                        placeholder="1234 5678 9012 3456"
                        value={card.number}
                        onChange={e => setCard(p => ({ ...p, number: formatCard(e.target.value) }))}
                        className={inputCls(cardErrors.number) + ' pr-20'}
                        overlay={brand && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 font-mono bg-white border border-slate-200 px-2 py-0.5 rounded-md z-10">
                            {brand}
                          </span>
                        )}
                      />
                    </Field>

                    <Field label="Cardholder name" error={cardErrors.name}>
                      <NoFillInput
                        placeholder="As printed on card"
                        value={card.name}
                        onChange={e => setCard(p => ({ ...p, name: e.target.value }))}
                        className={inputCls(cardErrors.name)}
                      />
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Expiry date" error={cardErrors.expiry}>
                        <NoFillInput
                          placeholder="MM/YY"
                          value={card.expiry}
                          onChange={e => {
                            const raw = e.target.value;
                            if (raw.length < card.expiry.length && card.expiry.endsWith('/')) {
                              setCard(p => ({ ...p, expiry: raw.replace(/\/$/, '') }));
                            } else {
                              setCard(p => ({ ...p, expiry: formatExpiry(raw) }));
                            }
                          }}
                          className={inputCls(cardErrors.expiry)}
                        />
                      </Field>

                      <Field label="CVV" error={cardErrors.cvv}>
                        <NoFillPassword
                          placeholder="•••"
                          value={card.cvv}
                          onChange={e => setCard(p => ({ ...p, cvv: formatCVV(e.target.value) }))}
                          className={inputCls(cardErrors.cvv)}
                          show={showCVV}
                          showToggle
                          onToggle={() => setShowCVV(v => !v)}
                        />
                      </Field>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <p className="text-xs text-slate-400 font-mono">Accepted:</p>
                      {['Visa', 'Mastercard', 'Amex', 'RuPay'].map(b => (
                        <span key={b}
                          className="px-2 py-0.5 rounded border border-slate-200 text-xs font-bold text-slate-500 font-mono bg-slate-50">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── UPI FORM ── */}
                {payMethod === 'upi' && (
                  <div className="space-y-4">
                    <Field label="UPI ID" error={upiError}>
                      <NoFillInput
                        placeholder="yourname@okaxis"
                        value={upi}
                        onChange={e => setUpi(e.target.value)}
                        className={inputCls(upiError)}
                      />
                    </Field>
                    <div className="flex flex-wrap gap-2">
                      {['@okaxis', '@ybl', '@paytm', '@gpay', '@oksbi'].map(s => (
                        <button key={s} onClick={() => applyUPISuffix(s)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono text-slate-600 hover:bg-cyan-50 hover:border-cyan-200 hover:text-cyan-700 transition-all">
                          {s}
                        </button>
                      ))}
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700 font-mono flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      A payment request will be sent to your UPI app. Approve it within 10 minutes.
                    </div>
                  </div>
                )}

                {/* ── NET BANKING ── */}
                {payMethod === 'netbanking' && (
                  <div className="space-y-4">
                    <Field label="Select your bank" error={bankError}>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB'].map(b => (
                          <button key={b} onClick={() => { setBank(b); setBankError(''); }}
                            className={`px-4 py-3 rounded-xl border text-sm font-bold font-mono transition-all ${
                              bank === b
                                ? 'border-cyan-500 bg-cyan-50 text-cyan-700 ring-2 ring-cyan-200'
                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white'
                            }`}>
                            {b}
                          </button>
                        ))}
                      </div>
                    </Field>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-700 font-mono flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      You'll be redirected to your bank's secure portal to complete payment.
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Terms & Pay button */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input type="checkbox" checked={agreeTerms}
                    onChange={e => { setAgreeTerms(e.target.checked); if (e.target.checked) setTermsError(''); }}
                    className="sr-only" />
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    agreeTerms ? 'bg-cyan-600 border-cyan-600' : 'border-slate-300 group-hover:border-cyan-400'
                  }`}>
                    {agreeTerms && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-mono leading-relaxed">
                  I agree to Learnflow's{' '}
                  <Link to="/terms" className="text-cyan-600 hover:underline">Terms of Service</Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-cyan-600 hover:underline">Privacy Policy</Link>.
                  I understand this is a one-time payment with lifetime access and a 30-day money-back guarantee.
                </p>
              </label>

              {termsError && (
                <p className="text-xs text-red-500 font-mono flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {termsError}
                </p>
              )}

              {payError && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-mono">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {payError}
                </div>
              )}

              <button onClick={handlePay} disabled={processing}
                className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-base transition-all shadow-sm ${
                  !processing
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:opacity-95 active:scale-[0.98]'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}>
                {processing
                  ? <><RefreshCw className="w-5 h-5 animate-spin" /> Processing payment…</>
                  : <><Lock className="w-4 h-4" /> Pay ₹{total.toLocaleString('en-IN')} securely</>}
              </button>

              <div className="flex items-center justify-center gap-4 pt-1">
                {[
                  [ShieldCheck, '256-bit SSL'],
                  [BadgeCheck,  'PCI DSS compliant'],
                  [MdPlayCircleOutline ,         'Instant access'],
                ].map(([Icon, text]) => (
                  <div key={text} className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                    <Icon className="w-3 h-3 text-emerald-500" /> {text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ════ RIGHT — Order summary ════ */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

              {/* FIX: Header height now matches left panel's heading card so
                  both columns start at the same visual baseline */}
              <button onClick={() => setShowSummary(v => !v)}
                className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50 transition-colors lg:cursor-default border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide font-mono">Order summary</h2>
                <span className="lg:hidden">
                  {showSummary
                    ? <ChevronUp className="w-4 h-4 text-slate-400" />
                    : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </span>
              </button>

              <div className={`${showSummary ? 'block' : 'hidden lg:block'}`}>

                {/* Course info */}
                <div className="px-6 py-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.gradient || 'from-cyan-500 to-blue-600'} flex items-center justify-center text-2xl flex-shrink-0`}>
                      {course.emoji || '📘'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 leading-snug">{course.title}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${course.accentBg || 'bg-cyan-50'} ${course.accentText || 'text-cyan-700'} border ${course.accentBorder || 'border-cyan-200'}`}>
                          {course.tag}
                        </span>
                        {course.level && (
                          <span className="text-xs text-slate-400 font-mono">{course.level}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 font-mono">
                        {course.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />{course.duration}
                          </span>
                        )}
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />50k+ enrolled</span>
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500" fill="currentColor" />4.9</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* What's included — FIX: removed bg-slate-50 stripe to avoid
                    unintended visual break; uses consistent white background
                    with a clean top border separator instead */}
                <div className="px-6 py-4 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide font-mono mb-3">
                    What's included
                  </p>
                  <div className="space-y-2">
                    {[
                      'Blockchain-verified certificate',
                      'Lifetime access to all content',
                      '30-day money-back guarantee',
                      'LinkedIn badge + PDF download',
                    ].map(item => (
                      <div key={item} className="flex items-center gap-2 text-xs text-slate-600 font-mono">
                        <CheckCircle className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" /> {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing breakdown — FIX: all label text is now uniformly
                    slate-600; only the discount VALUE stays emerald so the
                    two-column layout feels visually balanced */}
                <div className="px-6 py-5 border-t border-slate-100 space-y-2.5">
                  {/* Original price */}
                  <div className="flex items-center justify-between text-sm font-mono">
                    <span className="text-slate-600">Original price</span>
                    <span className="text-slate-400 line-through">
                      ₹{course.origPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Discount row — only shown when there is an actual discount */}
                  {course.origPrice > course.price && (
                    <div className="flex items-center justify-between text-sm font-mono">
                      <span className="text-slate-600">Learnflow discount</span>
                      <span className="text-emerald-600 font-semibold">
                        −₹{(course.origPrice - course.price).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}

                  {/* GST */}
                  <div className="flex items-center justify-between text-sm font-mono">
                    <span className="text-slate-600">GST (18%)</span>
                    <span className="text-slate-600">₹{gst.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Total */}
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between font-bold text-slate-900">
                    <span className="text-base">Total</span>
                    <span className="text-xl">₹{total.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Savings badge */}
                  {savings > 0 && (
                    <div className="flex items-center justify-end gap-1 text-xs text-emerald-600 font-mono">
                      <CheckCircle className="w-3 h-3" />
                      You save ₹{savings.toLocaleString('en-IN')} on this order
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Trust badges */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              {[
                [ShieldCheck, 'Secure 256-bit SSL encryption',  'Your payment info is never stored.'],
                [RefreshCw,   '30-day money-back guarantee',     'Full refund, no questions asked.'],
                [BadgeCheck,  'Instant certificate access',      'Issued immediately after payment.'],
              ].map(([Icon, title, desc]) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 font-mono">{title}</p>
                    <p className="text-xs text-slate-500 font-mono">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-slate-400 font-mono">
              Need help?{' '}
              <Link to="/help" className="text-cyan-600 hover:underline">Contact support</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}