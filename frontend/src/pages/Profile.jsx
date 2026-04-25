import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User, Camera, Loader2,
  Eye, EyeOff, Github, Linkedin, Globe, MapPin,
  Sparkles, AlertCircle, ChevronRight, Trash2, X,
  Upload, Check, Info, FileText, Link2,
  Save, KeyRound, ShieldCheck, LogOut
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

/* ─── constants ─────────────────────────────────────────── */
const TABS = [
  { key: 'profile',       icon: User,        label: 'Profile',       desc: 'Personal information' },
  { key: 'password',      icon: KeyRound,    label: 'Security',      desc: 'Password & access' },
  { key: 'privacy',       icon: ShieldCheck, label: 'Privacy',       desc: 'Visibility & data' },
];

const INDIAN_CITIES = [
  // Maharashtra
  'Mumbai','Pune','Nagpur','Thane','Nashik','Aurangabad','Solapur',
  'Dombivli','Kalyan','Navi Mumbai','Amravati','Kolhapur','Sangli',
  // Karnataka
  'Bengaluru','Mysuru','Hubli','Mangaluru','Belagavi','Davangere',
  // Delhi NCR
  'Delhi','Noida','Gurugram','Faridabad','Ghaziabad',
  // Tamil Nadu
  'Chennai','Coimbatore','Madurai','Tiruchirappalli','Salem','Tirunelveli',
  // Telangana & AP
  'Hyderabad','Visakhapatnam','Vijayawada','Warangal','Guntur',
  // Gujarat
  'Ahmedabad','Surat','Vadodara','Rajkot','Gandhinagar','Bhavnagar',
  // Rajasthan
  'Jaipur','Jodhpur','Udaipur','Kota','Ajmer','Bikaner',
  // UP & Uttarakhand
  'Lucknow','Kanpur','Agra','Varanasi','Prayagraj','Meerut','Dehradun',
  // West Bengal
  'Kolkata','Howrah','Durgapur','Siliguri','Asansol',
  // Punjab, Haryana & Chandigarh
  'Chandigarh','Ludhiana','Amritsar','Jalandhar','Patiala','Ambala',
  // Kerala
  'Kochi','Thiruvananthapuram','Kozhikode','Thrissur','Kollam',
  // MP & Chhattisgarh
  'Bhopal','Indore','Gwalior','Jabalpur','Raipur','Bhilai',
  // Bihar & Jharkhand
  'Patna','Gaya','Ranchi','Jamshedpur','Dhanbad',
  // Other major cities
  'Bhubaneswar','Guwahati','Jammu','Srinagar','Shimla','Imphal',
].sort();

const PRIVACY_CONFIG = [
  { label: 'Public profile',                      desc: 'Allow anyone to view your profile and courses',          color: 'from-cyan-500 to-blue-500' },
  { label: 'Share progress with hiring partners', desc: "Let Learnflow's hiring partners see your skills",        color: 'from-emerald-500 to-teal-500' }
];

/* ─── password strength ──────────────────────────────────── */
function getStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '', bg: '' };
  let score = 0;
  if (pw.length >= 8)            score++;
  if (pw.length >= 12)           score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw))  score++;
  if (score <= 1) return { score, label: 'Weak',      color: 'bg-red-500',     text: 'text-red-500'     };
  if (score <= 2) return { score, label: 'Fair',      color: 'bg-amber-400',   text: 'text-amber-500'   };
  if (score <= 3) return { score, label: 'Good',      color: 'bg-yellow-400',  text: 'text-yellow-600'  };
  if (score <= 4) return { score, label: 'Strong',    color: 'bg-emerald-500', text: 'text-emerald-600' };
  return                 { score, label: 'Excellent', color: 'bg-cyan-500',    text: 'text-cyan-600'    };
}

/* ─── profile completion ─────────────────────────────────── */
function getCompletion(form) {
  const fields = ['name','email','bio','phone','city','headline','website','linkedin','github'];
  const filled  = fields.filter(f => form[f]?.trim()).length;
  return Math.round((filled / fields.length) * 100);
}

/* ─── FloatInput ─────────────────────────────────────────── */
function FloatInput({ label, type='text', value, onChange, placeholder, disabled, prefix, icon: Icon, maxLength, rightSlot, error }) {
  const [focused, setFocused] = useState(false);
  const filled = (value?.length ?? 0) > 0;
  return (
    <div className="relative">
      <div className={`
        relative flex items-center rounded-xl border transition-all duration-200 overflow-hidden
        ${error   ? 'border-red-400 ring-2 ring-red-100 shadow-sm shadow-red-100'
        : focused ? 'border-cyan-400 ring-2 ring-cyan-100 shadow-sm shadow-cyan-100'
        : 'border-slate-200 hover:border-slate-300 bg-white'}
        ${disabled ? 'bg-slate-50/80' : 'bg-white'}
      `}>
        {prefix && (
          <span className="inline-flex items-center px-3 h-full border-r border-slate-200 bg-slate-50 text-slate-500 text-sm font-mono select-none py-4 whitespace-nowrap">
            {prefix}
          </span>
        )}
        {Icon && !prefix && (
          <span className={`pl-3.5 flex-shrink-0 transition-colors duration-200 ${focused ? 'text-cyan-500' : 'text-slate-400'}`}>
            <Icon className="w-4 h-4" />
          </span>
        )}
        <div className="relative flex-1 min-w-0">
          <label className={`
            absolute left-4 pointer-events-none select-none transition-all duration-200 z-10
            ${(focused || filled)
              ? `top-1.5 text-[10px] font-bold tracking-wide ${focused ? 'text-cyan-600' : 'text-slate-400'}`
              : 'top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium'}
          `}>
            {label}
          </label>
          <input
            type={type} value={value} disabled={disabled}
            onChange={onChange} maxLength={maxLength}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={focused ? placeholder : ''}
            className={`w-full px-4 pt-5 pb-2 text-sm text-slate-900 bg-transparent outline-none font-medium ${disabled ? 'cursor-not-allowed text-slate-400' : ''}`}
          />
        </div>
        {rightSlot && <div className="pr-3 flex-shrink-0">{rightSlot}</div>}
        {maxLength && (
          <span className={`pr-3 text-[11px] font-mono tabular-nums flex-shrink-0 ${(value?.length ?? 0) >= maxLength * 0.9 ? 'text-amber-500' : 'text-slate-300'}`}>
            {value?.length ?? 0}/{maxLength}
          </span>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1.5 pl-1 animate-[fadeIn_.15s_ease]">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />{error}
        </p>
      )}
    </div>
  );
}

/* ─── Toggle ─────────────────────────────────────────────── */
function Toggle({ value, onChange, gradient = 'from-cyan-500 to-violet-500' }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      aria-checked={value}
      role="switch"
      className={`
        relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400
        ${value ? `bg-gradient-to-r ${gradient} shadow-md` : 'bg-slate-200 hover:bg-slate-300'}
      `}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${value ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );
}

/* ─── AvatarUpload ───────────────────────────────────────── */
function AvatarUpload({ name, avatarUrl, onUpload }) {
  const fileRef = useRef();
  const busyTimer = useRef(null);
  const [drag, setDrag]       = useState(false);
  const [preview, setPreview] = useState(avatarUrl || null);
  const [busy, setBusy]       = useState(false);

  useEffect(() => { if (avatarUrl) setPreview(avatarUrl); }, [avatarUrl]);
  useEffect(() => () => { clearTimeout(busyTimer.current); }, []);

  const handle = useCallback(file => {
    if (!file?.type.startsWith('image/')) { toast.error('Please upload an image file'); return; }
    const url = URL.createObjectURL(file);
    setPreview(prev => { if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev); return url; });
    setBusy(true);
    onUpload?.(url);
    clearTimeout(busyTimer.current);
    busyTimer.current = setTimeout(() => setBusy(false), 1200);
  }, [onUpload]);

  const initials = name?.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase() || 'U';

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`relative cursor-pointer transition-transform duration-200 ${drag ? 'scale-105' : 'hover:scale-[1.02]'}`}
        onDragOver={e  => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e      => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]); }}
        onClick={() => fileRef.current?.click()}
      >
        <div className={`
          w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-offset-2 transition-all duration-300 relative
          ${drag ? 'ring-cyan-400' : 'ring-slate-100 hover:ring-cyan-300'}
        `}>
          {preview
            ? <img src={preview} alt="avatar" className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-br from-cyan-500 via-blue-500 to-violet-600 flex items-center justify-center text-2xl font-black text-white tracking-wide">{initials}</div>
          }
          <div className={`absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center transition-opacity duration-200 ${drag ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
            {busy ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Upload className="w-6 h-6 text-white" />}
          </div>
        </div>
        <span className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-xl bg-white border border-slate-200 shadow-lg flex items-center justify-center text-cyan-600 hover:text-cyan-700 hover:border-cyan-300 transition-colors">
          <Camera className="w-3.5 h-3.5" />
        </span>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handle(e.target.files[0])} />
      {!preview && (
      <p className="text-[11px] text-slate-400 text-center leading-tight">Click or drag to upload<br/><span className="text-slate-300">JPG, PNG, GIF up to 5MB</span></p>
      )}
    </div>
  );
}

/* ─── Section wrapper ────────────────────────────────────── */
function Section({ title, subtitle, icon: Icon, children, accent = 'from-cyan-500 to-blue-500' }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
        {Icon && (
          <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
        )}
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h2>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

/* ─── CompletionRing ─────────────────────────────────────── */
function CompletionRing({ pct }) {
  const r = 28, circ = 2 * Math.PI * r;
  const dash = circ - (pct / 100) * circ;
  const color = pct === 100 ? '#10b981' : pct >= 70 ? '#06b6d4' : '#f59e0b';
  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg width="64" height="64" className="-rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#e2e8f0" strokeWidth="4" />
        <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={circ} strokeDashoffset={dash}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <span className="absolute text-xs font-black text-slate-700">{pct}%</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  Main Component                                             */
/* ═══════════════════════════════════════════════════════════ */
export default function Profile() {
  const { user, logout } = useAuth();
  const [tab, setTab]             = useState('profile');
  const [loading, setLoading]     = useState(false);
  const [fetching, setFetching]   = useState(true);
  const [saved, setSaved]         = useState(false);
  const [errors, setErrors]       = useState({});
  const [avatarUrl, setAvatarUrl] = useState(null);

  const [form, setForm] = useState({
    name: '', email: '', bio: '', phone: '',
    city: '', headline: '', website: '', linkedin: '', github: '',
  });

  const [pwForm, setPwForm]     = useState({ current: '', next: '', confirm: '' });
  const [showPw, setShowPw]     = useState({ current: false, next: false, confirm: false });
  const [pwSaved, setPwSaved]   = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const [privacy, setPrivacy]         = useState([true, false]);
  const [privacySaved, setPrivacySaved] = useState(false);
  const [privacyLoading, setPrivacyLoading] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting]       = useState(false);

  // Cleanup refs to prevent setState after unmount
  const savedTimer       = useRef(null);
  const pwSavedTimer     = useRef(null);
  const privacySavedTimer = useRef(null);
  useEffect(() => () => {
    clearTimeout(savedTimer.current);
    clearTimeout(pwSavedTimer.current);
    clearTimeout(privacySavedTimer.current);
  }, []);

  const set   = (k, v) => { setForm(p => ({ ...p, [k]: v }));    setErrors(e => ({ ...e, [k]: '' })); };
  const setPw = (k, v) => { setPwForm(p => ({ ...p, [k]: v }));  setErrors(e => ({ ...e, [k]: '' })); };

  const completion = getCompletion(form);
  const strength   = getStrength(pwForm.next);
  const fieldsRemaining = ['name','email','bio','phone','city','headline','website','linkedin','github']
    .filter(f => !form[f]?.trim()).length;

  /* ── load profile ── */
  useEffect(() => {
    const fallbackName  = user?.name  ?? '';
    const fallbackEmail = user?.email ?? '';
    api.get('/profile')
      .then(res => {
  const d = res.data?.user || res.data;
  setForm({
    name:     d.name              ?? fallbackName,
    email:    d.email             ?? fallbackEmail,
    bio:      d.bio               ?? '',
    phone:    d.phone             ?? '',
    city:     d.city              ?? '',
    headline: d.headline          ?? '',
    website:  d.website           ?? '',
    linkedin: d.social?.linkedin  ?? '',
    github:   d.social?.github    ?? '',
  });
  if (Array.isArray(d.privacy) && d.privacy.length === 2) {
    setPrivacy(d.privacy);
  }
  if (d.avatar) setAvatarUrl(d.avatar);
})
      .catch(() => setForm(p => ({ ...p, name: fallbackName, email: fallbackEmail })))
      .finally(() => setFetching(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── validate profile ── */
  const validate = () => {
    const errs = {};
    if (!form.name.trim())
      errs.name = 'Full name is required';
    if (form.website && !/^https?:\/\//i.test(form.website))
      errs.website = 'Must start with https://';
    if (form.linkedin && !/^https?:\/\//i.test(form.linkedin))
      errs.linkedin = 'Must start with https://';
    if (form.github && !/^https?:\/\//i.test(form.github))
      errs.github = 'Must start with https://';
    if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\s/g, '')))
      errs.phone = 'Enter a valid 10-digit number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ── save profile ── */
  const save = async () => {
    if (!validate()) { toast.error('Please fix the errors below'); return; }
    setLoading(true);
    try {
      await api.put('/profile/update', {
        name:     form.name,
        bio:      form.bio,
        phone:    form.phone,
        city:     form.city,
        headline: form.headline,
        website:  form.website,
        avatar:   avatarUrl ?? '',
        social:   { linkedin: form.linkedin, github: form.github },
      });
      setSaved(true);
      toast.success('Profile updated successfully ✓');
      clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── change password ── */
  const savePw = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!pwForm.current)                 errs.current = 'Current password is required';
    if (pwForm.next.length < 8)          errs.next    = 'Minimum 8 characters required';
    if (pwForm.next !== pwForm.confirm)  errs.confirm = 'Passwords do not match';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setPwLoading(true);
    try {
      await api.put('/auth/password', { currentPassword: pwForm.current, newPassword: pwForm.next });
      setPwSaved(true);
      toast.success('Password changed successfully ✓');
      setPwForm({ current: '', next: '', confirm: '' });
      clearTimeout(pwSavedTimer.current);
      pwSavedTimer.current = setTimeout(() => setPwSaved(false), 2500);
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Password update failed');
    } finally {
      setPwLoading(false);
    }
  };

  const savePrivacy = async () => {
    setPrivacyLoading(true);
    try {
      await api.put('/profile/update', { privacy });
      setPrivacySaved(true);
      toast.success('Privacy settings saved ✓');
      clearTimeout(privacySavedTimer.current);
      privacySavedTimer.current = setTimeout(() => setPrivacySaved(false), 2500);
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Failed to save privacy settings');
    } finally {
      setPrivacyLoading(false);
    }
  };

  /* ── delete account ── */
  const deleteAccount = async () => {
    setDeleting(true);
    try {
      await api.delete('/auth/account');
      toast.success('Account deleted successfully');
      logout?.();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Delete failed');
      setDeleting(false);
      setDeleteModal(false);
    }
  };

  /* ── loading screen ── */
  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 animate-pulse opacity-80" />
            <div className="absolute inset-1.5 rounded-xl bg-white flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-500 animate-spin" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-700">Loading your profile</p>
            <p className="text-xs text-slate-400 mt-1">Just a moment…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scaleIn { from { opacity:0; transform:scale(.96); } to { opacity:1; transform:scale(1); } }
        @keyframes bounceIn { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }
        .fade-in { animation: fadeIn 0.25s ease forwards; }
        .scale-in { animation: scaleIn 0.2s ease forwards; }
        .bounce-in { animation: bounceIn 0.3s ease forwards; }
      `}</style>

      <div className="min-h-screen bg-slate-50/80" style={{ background: 'radial-gradient(ellipse 80% 40% at 50% -5%, #ecfeff, transparent), #f8fafc' }}>

        {/* ── sticky header ── */}
        <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">Account Settings</h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">Manage your profile, security &amp; preferences</p>
            </div>
            <div className="flex items-center gap-3">
  <div className={`hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${completion === 100 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-amber-700 bg-amber-50 border-amber-200'}`}>
    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${completion === 100 ? 'bg-emerald-500' : 'bg-amber-400'}`} />
    {completion === 100 ? 'Profile complete' : `${completion}% complete`}
  </div>

  {/* ── NEW: Update Profile button shown only on profile tab ── */}
  {tab === 'profile' && (
    <button
      onClick={save}
      disabled={loading}
      className={`
        hidden sm:inline-flex items-center gap-2 px-4 py-1.5 rounded-xl font-bold text-xs shadow-sm transition-all duration-200 active:scale-95 disabled:opacity-60
        ${saved
          ? 'bg-emerald-500 text-white'
          : 'bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white hover:shadow-md hover:shadow-cyan-200/60'}
      `}
    >
      {loading ? (
        <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</>
      ) : saved ? (
        <><Check className="w-3.5 h-3.5" /> Saved!</>
      ) : (
        <><Save className="w-3.5 h-3.5" /> Update Profile</>
      )}
    </button>
  )}

  <button
    onClick={() => logout?.()}
    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 px-3 py-1.5 rounded-xl transition-all font-medium"
  >
    <LogOut className="w-3.5 h-3.5" /> Sign out
  </button>
        </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            {/* ── sidebar ── */}
            <aside className="md:col-span-1 space-y-4">

              {/* Profile card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col items-center text-center fade-in">
                <AvatarUpload name={form.name} avatarUrl={avatarUrl} onUpload={setAvatarUrl} />

                <div className="mt-4 w-full">
                  <p className="font-black text-slate-900 text-sm leading-tight">{form.name || 'Your Name'}</p>
                  {form.headline && (
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{form.headline}</p>
                  )}
                  {form.city && (
                    <div className="flex items-center justify-center gap-1 mt-1.5 text-[11px] text-slate-400">
                      <MapPin className="w-3 h-3" />{form.city}
                    </div>
                  )}
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-cyan-50 to-violet-50 border border-cyan-200/70 rounded-lg text-xs font-bold text-cyan-700">
                    {user?.role === 'instructor' ? '🎓 Instructor' : '⚡ Learner'}
                  </div>
                </div>

                {/* Completion ring */}
                <div className="mt-4 w-full pt-4 border-t border-slate-100 flex flex-col items-center gap-2">
                  <CompletionRing pct={completion} />
                  <div className="text-center">
                    <p className="text-[11px] font-bold text-slate-600">Profile Strength</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {completion === 100 ? 'All fields complete! 🎉' : `${fieldsRemaining} field${fieldsRemaining !== 1 ? 's' : ''} remaining`}
                    </p>
                  </div>
                </div>

                {/* Social links */}
                {(form.github || form.linkedin || form.website) && (
                  <div className="mt-3 w-full pt-3 border-t border-slate-100 flex justify-center gap-2">
                    {form.github && (
                      <a href={form.github} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-all">
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {form.linkedin && (
                      <a href={form.linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all">
                        <Linkedin className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {form.website && (
                      <a href={form.website} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-cyan-600 hover:border-cyan-200 transition-all">
                        <Globe className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Nav */}
              <nav className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm space-y-0.5">
                {TABS.map(({ key, icon: Icon, label, desc }) => (
                  <button
                    key={key}
                    onClick={() => { setTab(key); setErrors({}); setSaved(false); setPwSaved(false); }}
                    className={`
                      w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group
                      ${tab === key
                        ? 'bg-gradient-to-r from-cyan-50 to-violet-50/50 border border-cyan-200/80 text-cyan-700 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'}
                    `}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${tab === key ? 'bg-gradient-to-br from-cyan-500 to-violet-500' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
                      <Icon className={`w-3.5 h-3.5 ${tab === key ? 'text-white' : 'text-slate-500'}`} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-bold leading-none ${tab === key ? 'text-cyan-700' : 'text-slate-700'}`}>{label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">{desc}</p>
                    </div>
                    {tab === key && <ChevronRight className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />}
                  </button>
                ))}
              </nav>
            </aside>

            {/* ── main content ── */}
            <main className="md:col-span-3 space-y-4">

              {/* ╔════════════════════════════════════╗ */}
              {/* ║  PROFILE TAB                       ║ */}
              {/* ╚════════════════════════════════════╝ */}
              {tab === 'profile' && (
                <div className="fade-in space-y-4">

                  {/* Basic Info */}
                  <Section title="Basic Information" subtitle="Your name and contact details" icon={User} accent="from-cyan-500 to-blue-500">
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FloatInput
                          label="Full name *" value={form.name}
                          onChange={e => set('name', e.target.value)}
                          placeholder="e.g. Rahul Sharma" error={errors.name}
                        />
                        <FloatInput
                          label="Email address" value={form.email}
                          onChange={() => {}} disabled icon={User}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FloatInput
                          label="Phone number" value={form.phone} type="tel"
                          onChange={e => set('phone', e.target.value)}
                          placeholder="98765 43210" prefix="+91" error={errors.phone}
                        />

                        {/* City select */}
                        <div>
                          <div className="relative border border-slate-200 hover:border-slate-300 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100 rounded-xl bg-white overflow-hidden transition-all duration-200">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
                            {form.city && (
                              <label className="absolute left-10 pointer-events-none text-[10px] font-bold text-slate-400 tracking-wide z-10 top-1.5">City</label>
                            )}
                            <select
                              value={form.city}
                              onChange={e => set('city', e.target.value)}
                              className={`w-full pl-10 pr-4 text-sm text-slate-900 bg-transparent outline-none cursor-pointer appearance-none font-medium ${form.city ? 'pt-5 pb-2' : 'py-4'}`}
                            >
                              <option value="">Select your city…</option>
                              {INDIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Section>

                  {/* Professional Info */}
                  <Section title="Professional Details" subtitle="Tell the community about yourself" icon={FileText} accent="from-violet-500 to-purple-500">
                    <div className="p-6 space-y-4">
                      <FloatInput
                        label="Professional headline" value={form.headline} maxLength={80}
                        onChange={e => set('headline', e.target.value)}
                        placeholder="e.g. Full-Stack Developer | IIT Graduate"
                      />

                      {/* Bio */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 tracking-wide mb-2 pl-1">BIO</label>
                        <div className="relative">
                          <textarea
                            value={form.bio}
                            onChange={e => set('bio', e.target.value)}
                            rows={4} maxLength={300}
                            placeholder="Share your background, expertise, and what you're learning…"
                            className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none resize-none transition-all duration-200 font-medium"
                          />
                          <span className={`absolute bottom-3 right-3 text-[11px] font-mono tabular-nums ${form.bio.length > 270 ? 'text-amber-500' : 'text-slate-300'}`}>
                            {form.bio.length}/300
                          </span>
                        </div>
                      </div>
                    </div>
                  </Section>

                  {/* Social Links */}
                  <Section title="Links & Social" subtitle="Connect your online presence" icon={Link2} accent="from-emerald-500 to-teal-500">
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FloatInput
                          label="Website URL" value={form.website} type="url"
                          onChange={e => set('website', e.target.value)}
                          placeholder="https://yourportfolio.com" icon={Globe} error={errors.website}
                        />
                        <FloatInput
                          label="LinkedIn profile" value={form.linkedin} type="url"
                          onChange={e => set('linkedin', e.target.value)}
                          placeholder="https://linkedin.com/in/username" icon={Linkedin} error={errors.linkedin}
                        />
                      </div>
                      <FloatInput
                        label="GitHub profile" value={form.github} type="url"
                        onChange={e => set('github', e.target.value)}
                        placeholder="https://github.com/username" icon={Github} error={errors.github}
                      />
                    </div>
                  </Section>

                  {/* Completion hint */}
                  {completion < 100 && (
                    <div className="flex items-start gap-3 px-4 py-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 fade-in">
                      <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
                      <div>
                        <span className="font-bold">Your profile is {completion}% complete.</span>
                        {' '}Fill in all fields to improve your visibility and get better job recommendations.
                      </div>
                    </div>
                  )}

                  {/* Save button */}
                  <div className="flex justify-end">
                    <button
                      onClick={save} disabled={loading}
                      className={`
                        inline-flex items-center gap-2.5 px-7 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed
                        ${saved
                          ? 'bg-emerald-500 text-white shadow-emerald-200/70'
                          : 'bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white hover:shadow-md hover:shadow-cyan-200/60'}
                      `}
                    >
                      {loading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                      ) : saved ? (
                        <><Check className="w-4 h-4 bounce-in" /> Saved!</>
                      ) : (
                        <><Save className="w-4 h-4" /> Save Profile</>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* ╔════════════════════════════════════╗ */}
              {/* ║  PASSWORD TAB                      ║ */}
              {/* ╚════════════════════════════════════╝ */}
              {tab === 'password' && (
                <div className="fade-in">
                  <Section title="Change Password" subtitle="Use a strong, unique password you don't use elsewhere" icon={KeyRound} accent="from-violet-500 to-indigo-500">
                    <form onSubmit={savePw} className="p-6 space-y-5">

                      {[
                        { k: 'current', lbl: 'Current password',      ph: 'Enter your current password' },
                        { k: 'next',    lbl: 'New password',           ph: 'Minimum 8 characters' },
                        { k: 'confirm', lbl: 'Confirm new password',   ph: 'Repeat new password exactly' },
                      ].map(({ k, lbl, ph }) => (
                        <FloatInput
                          key={k}
                          label={lbl}
                          type={showPw[k] ? 'text' : 'password'}
                          value={pwForm[k]}
                          onChange={e => setPw(k, e.target.value)}
                          placeholder={ph}
                          error={errors[k]}
                          rightSlot={
                            <button type="button" onClick={() => setShowPw(p => ({ ...p, [k]: !p[k] }))} className="text-slate-400 hover:text-slate-600 p-1 transition-colors">
                              {showPw[k] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          }
                        />
                      ))}

                      {/* Strength meter */}
                      {pwForm.next && (
                        <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200 fade-in">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-slate-500">Password strength</span>
                            <span className={`text-xs font-bold ${strength.text}`}>{strength.label}</span>
                          </div>
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map(n => (
                              <div key={n} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${n <= strength.score ? strength.color : 'bg-slate-200'}`} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Requirements checklist */}
                      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-2.5">
                        <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">Requirements</p>
                        {[
                          ['At least 8 characters',  pwForm.next.length >= 8],
                          ['One uppercase letter',    /[A-Z]/.test(pwForm.next)],
                          ['One number',              /[0-9]/.test(pwForm.next)],
                          ['One special character',   /[^A-Za-z0-9]/.test(pwForm.next)],
                        ].map(([rule, met]) => (
                          <div key={rule} className="flex items-center gap-2.5">
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${met ? 'bg-emerald-500' : 'bg-blue-200'}`}>
                              <Check className={`w-2.5 h-2.5 ${met ? 'text-white' : 'text-transparent'}`} />
                            </span>
                            <span className={`text-xs transition-colors ${met ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-600'}`}>{rule}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end pt-1 border-t border-slate-100">
                        <button
                          type="submit" disabled={pwLoading}
                          className={`
                            inline-flex items-center gap-2.5 px-7 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed
                            ${pwSaved
                              ? 'bg-emerald-500 text-white'
                              : 'bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-700 hover:to-indigo-600 text-white hover:shadow-md hover:shadow-violet-200/60'}
                          `}
                        >
                          {pwLoading ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Updating…</>
                          ) : pwSaved ? (
                            <><Check className="w-4 h-4" /> Updated!</>
                          ) : (
                            <><KeyRound className="w-4 h-4" /> Update Password</>
                          )}
                        </button>
                      </div>
                    </form>
                  </Section>
                </div>
              )}
              {tab === 'privacy' && (
                <div className="fade-in space-y-4">
                  <Section title="Privacy Settings" subtitle="Control your visibility and data sharing" icon={ShieldCheck} accent="from-emerald-500 to-teal-500">
                    <div className="p-5 space-y-2.5">
                      {PRIVACY_CONFIG.map((item, i) => (
                        <div
                          key={i}
                          className={`
                            flex items-center justify-between gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 select-none
                            ${privacy[i]
                              ? 'bg-violet-50/60 border-violet-200/80 shadow-sm'
                              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'}
                          `}
                          onClick={() => setPrivacy(p => p.map((v, idx) => idx === i ? !v : v))}
                        >
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm font-bold ${privacy[i] ? 'text-violet-900' : 'text-slate-700'}`}>{item.label}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                          </div>
                          <Toggle
                            value={privacy[i]}
                            onChange={v => setPrivacy(p => p.map((x, idx) => idx === i ? v : x))}
                            gradient={item.color}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="px-5 pb-5 flex justify-end border-t border-slate-100 pt-4">
                      <button
                        onClick={savePrivacy} disabled={privacyLoading}
                        className={`
                          inline-flex items-center gap-2.5 px-7 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all duration-200 active:scale-95 disabled:opacity-60
                          ${privacySaved
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white hover:shadow-md hover:shadow-emerald-200/60'}
                        `}
                      >
                        {privacyLoading ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                        ) : privacySaved ? (
                          <><Check className="w-4 h-4" /> Saved!</>
                        ) : (
                          <><ShieldCheck className="w-4 h-4" /> Save Settings</>
                        )}
                      </button>
                    </div>
                  </Section>

                  {/* Danger Zone */}
                  <div className="bg-white border border-red-200 rounded-2xl overflow-hidden shadow-sm fade-in">
                    <div className="px-6 py-4 border-b border-red-100 bg-red-50/60 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-red-700">Danger Zone</h2>
                        <p className="text-[11px] text-red-400 mt-0.5">Irreversible actions — proceed with caution</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-slate-800">Delete my account</p>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">Permanently removes all your data, progress, and certificates.<br className="hidden sm:block"/>This action <strong>cannot</strong> be undone.</p>
                        </div>
                        <button
                          onClick={() => setDeleteModal(true)}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-300 text-red-600 text-xs font-bold hover:bg-red-50 hover:border-red-400 transition-all flex-shrink-0 active:scale-95"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* ── Delete confirm modal ── */}
      {deleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={e => e.target === e.currentTarget && setDeleteModal(false)}
        >
          <div className="scale-in bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-red-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <button onClick={() => setDeleteModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-base font-black text-slate-900 mb-1">Delete your account?</h3>
              <p className="text-sm text-slate-500 leading-relaxed">This will permanently delete your account, all course progress, and any certificates. <span className="font-semibold text-red-600">This cannot be reversed.</span></p>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setDeleteModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={deleteAccount} disabled={deleting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-all shadow-sm active:scale-95 disabled:opacity-60"
              >
                {deleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting…</> : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}