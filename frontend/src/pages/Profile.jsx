import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User, Lock, Bell, Shield, Camera, Loader2, CheckCircle2,
  Eye, EyeOff, Github, Linkedin, Globe, MapPin,
  Sparkles, AlertCircle, ChevronRight, Trash2, X,
  Upload, Check, Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

/* ─── constants ─────────────────────────────────────────── */
const TABS = [
  { key: 'profile',       icon: User,   label: 'Profile',       desc: 'Personal info' },
  { key: 'password',      icon: Lock,   label: 'Password',      desc: 'Security' },
  { key: 'notifications', icon: Bell,   label: 'Notifications', desc: 'Alerts' },
  { key: 'privacy',       icon: Shield, label: 'Privacy',       desc: 'Visibility' },
];

const INDIAN_CITIES = [
  'Bengaluru','Mumbai','Delhi','Hyderabad','Chennai',
  'Pune','Kolkata','Ahmedabad','Jaipur','Lucknow','Kochi','Chandigarh',
];

const NOTIF_CONFIG = [
  { k: 'email_sessions',    label: 'Live session reminders',     desc: '30 min before every live class',               icon: '🔔' },
  { k: 'email_assignments', label: 'Assignment deadlines',        desc: '24 hours before assignments are due',          icon: '📋' },
  { k: 'whatsapp',          label: 'WhatsApp notifications',      desc: 'Session links and updates on WhatsApp',        icon: '💬' },
  { k: 'weekly_summary',    label: 'Weekly progress summary',     desc: 'Your learning recap every Sunday morning',     icon: '📊' },
  { k: 'email_offers',      label: 'Course offers & promotions',  desc: 'New launches, discounts, and recommendations', icon: '🎁' },
];

const PRIVACY_CONFIG = [
  { label: 'Public profile',                      desc: 'Allow anyone to view your profile and courses' },
  { label: 'Show in leaderboard',                 desc: 'Appear in course completion leaderboards' },
  { label: 'Share progress with hiring partners', desc: "Let Learnflow's hiring partners see your skills" },
];

/* ─── password strength ──────────────────────────────────── */
function getStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8)            score++;
  if (pw.length >= 12)           score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw))  score++;
  if (score <= 1) return { score, label: 'Weak',      color: 'bg-red-500'     };
  if (score <= 2) return { score, label: 'Fair',      color: 'bg-amber-400'   };
  if (score <= 3) return { score, label: 'Good',      color: 'bg-yellow-400'  };
  if (score <= 4) return { score, label: 'Strong',    color: 'bg-emerald-500' };
  return                 { score, label: 'Excellent', color: 'bg-cyan-500'    };
}

/* ─── profile completion ─────────────────────────────────── */
function getCompletion(form) {
  const fields = ['name','email','bio','phone','city','headline','website','linkedin','github'];
  const filled  = fields.filter(f => form[f]?.trim()).length;
  return Math.round((filled / fields.length) * 100);
}

/* ─── floating-label input ───────────────────────────────── */
function FloatInput({
  label, type = 'text', value, onChange, placeholder,
  disabled, prefix, icon: Icon, maxLength, rightSlot, error,
}) {
  const [focused, setFocused] = useState(false);
  const filled = value?.length > 0;
  return (
    <div className="relative group">
      <div className={`
        relative flex items-center border rounded-xl transition-all duration-200 overflow-hidden
        ${error    ? 'border-red-400 ring-2 ring-red-100'
        : focused  ? 'border-cyan-400 ring-2 ring-cyan-100 shadow-sm shadow-cyan-100'
        : 'border-slate-200 hover:border-slate-300'}
        ${disabled ? 'bg-slate-50' : 'bg-white'}
      `}>
        {prefix && (
          <span className="inline-flex items-center px-3 py-3 border-r border-slate-200 bg-slate-50 text-slate-500 text-sm font-mono select-none">
            {prefix}
          </span>
        )}
        {Icon && !prefix && (
          <span className={`pl-3 transition-colors ${focused ? 'text-cyan-500' : 'text-slate-400'}`}>
            <Icon className="w-4 h-4" />
          </span>
        )}
        <div className="relative flex-1">
          <label className={`
            absolute left-4 pointer-events-none select-none font-sans transition-all duration-200 z-10
            ${(focused || filled)
              ? 'top-1 text-[10px] font-semibold ' + (focused ? 'text-cyan-600' : 'text-slate-400')
              : 'top-1/2 -translate-y-1/2 text-sm text-slate-400'}
          `}>
            {label}
          </label>
          <input
            type={type} value={value} disabled={disabled}
            onChange={onChange} maxLength={maxLength}
            onFocus={() => setFocused(true)}
            onBlur={()  => setFocused(false)}
            placeholder={focused ? placeholder : ''}
            className={`
              w-full px-4 pt-5 pb-2 text-sm text-slate-900 bg-transparent outline-none
              ${disabled ? 'cursor-not-allowed text-slate-500' : ''}
            `}
          />
        </div>
        {rightSlot && <div className="pr-3">{rightSlot}</div>}
        {maxLength && (
          <span className={`pr-3 text-[11px] font-mono tabular-nums transition-colors ${value?.length >= maxLength * 0.9 ? 'text-amber-500' : 'text-slate-400'}`}>
            {value?.length ?? 0}/{maxLength}
          </span>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500 flex items-center gap-1 animate-[fadeSlideIn_0.2s_ease]">
          <AlertCircle className="w-3 h-3" />{error}
        </p>
      )}
    </div>
  );
}

/* ─── toggle ─────────────────────────────────────────────── */
function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      aria-checked={value}
      role="switch"
      className={`
        relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400
        ${value ? 'bg-gradient-to-r from-cyan-500 to-violet-500 shadow-md shadow-cyan-200' : 'bg-slate-200'}
      `}
    >
      <span className={`
        absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300
        ${value ? 'left-7' : 'left-1'}
      `} />
    </button>
  );
}

/* ─── avatar upload ──────────────────────────────────────── */
function AvatarUpload({ name, avatarUrl, onUpload }) {
  const ref = useRef();
  const [drag, setDrag]         = useState(false);
  const [preview, setPreview]   = useState(avatarUrl || null);
  const [uploading, setUploading] = useState(false);

  // Sync external avatarUrl changes (e.g. after API load)
  useEffect(() => {
    if (avatarUrl) setPreview(avatarUrl);
  }, [avatarUrl]);

  // Cleanup blob URLs to prevent memory leaks
  const handle = useCallback(file => {
    if (!file?.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setPreview(prev => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
      return url;
    });
    setUploading(true);
    onUpload?.(url);
  }, [onUpload]);

  // Cleanup timeout on unmount
  useEffect(() => {
    if (!uploading) return;
    const t = setTimeout(() => setUploading(false), 1200);
    return () => clearTimeout(t);
  }, [uploading]);

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative cursor-pointer group transition-all duration-200 ${drag ? 'scale-105' : ''}`}
        onDragOver={e  => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e      => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]); }}
        onClick={() => ref.current?.click()}
      >
        <div className={`
          w-24 h-24 rounded-2xl relative overflow-hidden ring-4 transition-all duration-300
          ${drag ? 'ring-cyan-400 ring-offset-2' : 'ring-slate-100 group-hover:ring-cyan-300 group-hover:ring-offset-2'}
        `}>
          {preview
            ? <img src={preview} alt="avatar" className="w-full h-full object-cover" />
            : (
              <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-3xl font-black text-white">
                {name?.charAt(0)?.toUpperCase() ?? 'U'}
              </div>
            )
          }
          <div className={`
            absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-200
            ${drag ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
          `}>
            {uploading
              ? <Loader2 className="w-6 h-6 text-white animate-spin" />
              : <Upload  className="w-6 h-6 text-white" />
            }
          </div>
        </div>
        <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-500 group-hover:text-cyan-600 group-hover:border-cyan-200 transition-all">
          <Camera className="w-3.5 h-3.5" />
        </span>
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={e => handle(e.target.files[0])} />
      <p className="text-[11px] text-slate-400 mt-3 font-sans text-center leading-tight">
        Drop image or click<br />to upload
      </p>
    </div>
  );
}

/* ─── section wrapper ────────────────────────────────────── */
function Section({ title, subtitle, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-[fadeSlideIn_0.3s_ease]">
      <div className="px-7 py-5 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/60">
        <h2 className="text-base font-black text-slate-900 tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400 font-sans mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  Main Component                                             */
/* ═══════════════════════════════════════════════════════════ */
export default function Profile() {
  const { user, logout } = useAuth();
  const [tab, setTab]           = useState('profile');
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);
  const [saved, setSaved]       = useState(false);
  const [errors, setErrors]     = useState({});
  const [avatarUrl, setAvatarUrl] = useState(null);

  const [form, setForm] = useState({
    name: '', email: '', bio: '', phone: '',
    city: '', headline: '', website: '', linkedin: '', github: '',
  });

  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });

  const [notifs, setNotifs] = useState({
    email_sessions: true, email_assignments: true,
    email_offers: false, whatsapp: true, weekly_summary: true,
  });

  const [privacy, setPrivacy]       = useState([true, true, false]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting]     = useState(false);

  const set   = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };
  const setPw = (k, v) => setPwForm(p => ({ ...p, [k]: v }));

  const completion = getCompletion(form);
  const strength   = getStrength(pwForm.next);

  /* ── load profile ── */
  useEffect(() => {
    api.get('/profile')
      .then(res => {
        const d = res.data;
        setForm({
          name:     d.name              ?? user?.name  ?? '',
          email:    d.email             ?? user?.email ?? '',
          bio:      d.bio               ?? '',
          phone:    d.phone             ?? '',
          city:     d.city              ?? '',
          headline: d.headline          ?? '',
          website:  d.website           ?? '',
          linkedin: d.social?.linkedin  ?? '',
          github:   d.social?.github    ?? '',
        });
        if (d.avatarUrl) setAvatarUrl(d.avatarUrl);
      })
      .catch(() => setForm(p => ({ ...p, name: user?.name ?? '', email: user?.email ?? '' })))
      .finally(() => setFetching(false));
  }, [user]);

  /* ── validate profile ── */
  const validate = () => {
    const errs = {};
    if (!form.name.trim())
      errs.name = 'Name is required';
    if (form.website && !/^https?:\/\//i.test(form.website))
      errs.website = 'Must start with http(s)://';
    if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\s/g, '')))
      errs.phone = 'Enter a valid 10-digit number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ── save profile ── */
  const save = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await api.put('/profile/update', {
        name:     form.name,
        bio:      form.bio,
        phone:    form.phone,
        city:     form.city,
        headline: form.headline,
        website:  form.website,
        social:   { linkedin: form.linkedin, github: form.github },
      });
      setSaved(true);
      toast.success('Profile updated ✓');
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  /* ── change password ── */
  const savePw = async (event) => {
    event.preventDefault();
    const errs = {};
    if (!pwForm.current)                   errs.current = 'Required';
    if (pwForm.next.length < 8)            errs.next    = 'Min 8 characters';
    if (pwForm.next !== pwForm.confirm)    errs.confirm = 'Passwords do not match';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await api.put('/auth/password', {
        currentPassword: pwForm.current,
        newPassword:     pwForm.next,
      });
      toast.success('Password updated ✓');
      setPwForm({ current: '', next: '', confirm: '' });
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  /* ── delete account ── */
  const deleteAccount = async () => {
    setDeleting(true);
    try {
      await api.delete('/auth/account');
      toast.success('Account deleted');
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
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 animate-pulse" />
            <div className="absolute inset-1 rounded-xl bg-white flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-500 animate-spin" style={{ animationDuration: '2s' }} />
            </div>
          </div>
          <p className="text-sm text-slate-400 font-sans animate-pulse">Loading your profile…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── global keyframes ── */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes bounceIn {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        .tab-content-enter   { animation: fadeSlideIn 0.25s ease forwards; }
        .delete-modal-enter  { animation: scaleIn 0.2s ease forwards; }
      `}</style>

      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#ecfeff_0%,_#f8fafc_50%)]">

        {/* ── page header ── */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Account Settings</h1>
              <p className="text-xs text-slate-400 font-sans mt-0.5">Manage your profile, security &amp; preferences</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-sans bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <div className={`w-2 h-2 rounded-full animate-pulse ${completion === 100 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              Profile {completion}% complete
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            {/* ── sidebar ── */}
            <aside className="md:col-span-1 space-y-4">

              {/* avatar card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col items-center text-center animate-[fadeSlideIn_0.2s_ease]">
                <div className="relative mb-1">
                  <AvatarUpload name={form.name} avatarUrl={avatarUrl} onUpload={setAvatarUrl} />
                </div>
                <p className="font-black text-slate-900 text-sm mt-2 leading-tight">{form.name || 'Your Name'}</p>
                {form.headline && (
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5 line-clamp-2">{form.headline}</p>
                )}
                <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 bg-cyan-50 border border-cyan-200 rounded-lg text-xs font-semibold text-cyan-700 font-sans">
                  {user?.role === 'instructor' ? '🎓 Instructor' : '⚡ Learner'}
                </div>

                {/* completion bar */}
                <div className="w-full mt-4 space-y-1">
                  <div className="flex justify-between text-[10px] font-sans text-slate-400">
                    <span>Profile strength</span><span>{completion}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-700"
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* nav tabs */}
              <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm animate-[fadeSlideIn_0.25s_ease]">
                <nav className="space-y-0.5">
                  {TABS.map(({ key, icon: Icon, label, desc }) => (
                    <button
                      key={key}
                      onClick={() => { setTab(key); setErrors({}); }}
                      className={`
                        w-full text-left flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-200 group
                        ${tab === key
                          ? 'bg-gradient-to-r from-cyan-50 to-violet-50/60 border border-cyan-200 text-cyan-700 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent'}
                      `}
                    >
                      <span className={`
                        w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200
                        ${tab === key ? 'bg-cyan-100 text-cyan-600' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}
                      `}>
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className={`font-semibold text-xs leading-none ${tab === key ? 'text-cyan-700' : ''}`}>{label}</p>
                        <p className="text-[10px] text-slate-400 font-sans mt-0.5">{desc}</p>
                      </div>
                      {tab === key && <ChevronRight className="w-3.5 h-3.5 ml-auto text-cyan-400" />}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* ── main content ── */}
            <div className="md:col-span-3 space-y-4">

              {/* ╔═ PROFILE ══════════════════════════════════╗ */}
              {tab === 'profile' && (
                <div className="tab-content-enter space-y-4">
                  <Section title="Public Profile" subtitle="This information appears on your Learnflow profile">
                    <div className="p-7 space-y-5">

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FloatInput
                          label="Full name" value={form.name}
                          onChange={e => set('name', e.target.value)}
                          placeholder="Rahul Sharma" error={errors.name}
                        />
                        <FloatInput
                          label="Email address" value={form.email}
                          disabled placeholder="" icon={User}
                        />
                      </div>

                      <FloatInput
                        label="Professional headline" value={form.headline} maxLength={80}
                        onChange={e => set('headline', e.target.value)}
                        placeholder="e.g. Full-Stack Developer | IIT Graduate"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FloatInput
                          label="Phone number" value={form.phone} type="tel"
                          onChange={e => set('phone', e.target.value)}
                          placeholder="98765 43210" prefix="+91" error={errors.phone}
                        />

                        {/* city select */}
                        <div className="relative group">
                          <div className={`
                            relative flex items-center border rounded-xl bg-white overflow-hidden transition-all duration-200
                            ${errors.city
                              ? 'border-red-400 ring-2 ring-red-100'
                              : 'border-slate-200 hover:border-slate-300 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100'}
                          `}>
                            <MapPin className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                            <select
                              value={form.city}
                              onChange={e => set('city', e.target.value)}
                              className="w-full pl-9 pr-4 py-4 text-sm text-slate-900 bg-transparent outline-none cursor-pointer appearance-none"
                            >
                              <option value="">Select city…</option>
                              {INDIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* bio */}
                      <div className="relative">
                        <label className="block text-xs font-semibold text-slate-500 font-sans mb-1.5">Bio</label>
                        <textarea
                          value={form.bio}
                          onChange={e => set('bio', e.target.value)}
                          rows={3} maxLength={300}
                          placeholder="Tell learners about yourself…"
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm
                            focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 resize-none transition-all duration-200"
                        />
                        <span className={`absolute bottom-3 right-3 text-[11px] font-mono tabular-nums ${form.bio.length > 270 ? 'text-amber-500' : 'text-slate-400'}`}>
                          {form.bio.length}/300
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FloatInput
                          label="Website" value={form.website} type="url"
                          onChange={e => set('website', e.target.value)}
                          placeholder="https://yoursite.com" icon={Globe} error={errors.website}
                        />
                        <FloatInput
                          label="LinkedIn URL" value={form.linkedin} type="url"
                          onChange={e => set('linkedin', e.target.value)}
                          placeholder="linkedin.com/in/username" icon={Linkedin}
                        />
                      </div>

                      <FloatInput
                        label="GitHub URL" value={form.github} type="url"
                        onChange={e => set('github', e.target.value)}
                        placeholder="github.com/username" icon={Github}
                      />

                      {/* incomplete fields hint */}
                      {completion < 100 && (
                        <div className="flex items-start gap-2.5 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 font-sans animate-[fadeSlideIn_0.3s_ease]">
                          <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
                          <span>
                            Complete your profile for better visibility.&nbsp;
                            <span className="font-semibold">{100 - completion}% remaining</span>.
                          </span>
                        </div>
                      )}

                      <div className="flex justify-end pt-2 border-t border-slate-100">
                        <button
                          onClick={save} disabled={loading}
                          className={`
                            inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm
                            ${saved
                              ? 'bg-emerald-500 text-white shadow-emerald-200'
                              : 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white hover:from-cyan-700 hover:to-cyan-600 hover:shadow-md hover:shadow-cyan-200 active:scale-95'}
                            disabled:opacity-60 disabled:cursor-not-allowed
                          `}
                        >
                          {loading ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                          ) : saved ? (
                            <><Check className="w-4 h-4 animate-[bounceIn_0.3s_ease]" /> Saved!</>
                          ) : (
                            <><CheckCircle2 className="w-4 h-4" /> Save changes</>
                          )}
                        </button>
                      </div>
                    </div>
                  </Section>
                </div>
              )}

              {/* ╔═ PASSWORD ════════════════════════════════╗ */}
              {tab === 'password' && (
                <div className="tab-content-enter">
                  <Section title="Change Password" subtitle="Use a strong, unique password you don't use elsewhere">
                    <form onSubmit={savePw} className="p-7 space-y-5">

                      {['current', 'next', 'confirm'].map((k, i) => (
                        <FloatInput
                          key={k}
                          label={['Current password', 'New password', 'Confirm new password'][i]}
                          type={showPw[k] ? 'text' : 'password'}
                          value={pwForm[k]}
                          onChange={e => setPw(k, e.target.value)}
                          placeholder={['Enter current password', 'Min 8 characters', 'Repeat new password'][i]}
                          error={errors[k]}
                          rightSlot={
                            <button
                              type="button"
                              onClick={() => setShowPw(p => ({ ...p, [k]: !p[k] }))}
                              className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                            >
                              {showPw[k] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          }
                        />
                      ))}

                      {/* strength meter */}
                      {pwForm.next && (
                        <div className="space-y-2 animate-[fadeSlideIn_0.2s_ease]">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(n => (
                              <div key={n} className={`
                                flex-1 h-1.5 rounded-full transition-all duration-300
                                ${n <= strength.score ? strength.color : 'bg-slate-200'}
                              `} />
                            ))}
                          </div>
                          <p className="text-xs font-sans text-slate-500">
                            Strength:&nbsp;
                            <span className={`font-semibold ${
                              strength.score <= 1 ? 'text-red-500'
                              : strength.score <= 2 ? 'text-amber-500'
                              : strength.score <= 3 ? 'text-yellow-600'
                              : strength.score <= 4 ? 'text-emerald-600'
                              : 'text-cyan-600'
                            }`}>{strength.label}</span>
                          </p>
                        </div>
                      )}

                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700 font-sans space-y-1">
                        {[
                          ['At least 8 characters', pwForm.next.length >= 8],
                          ['One uppercase letter',  /[A-Z]/.test(pwForm.next)],
                          ['One number',            /[0-9]/.test(pwForm.next)],
                          ['One special character', /[^A-Za-z0-9]/.test(pwForm.next)],
                        ].map(([rule, met]) => (
                          <div key={rule} className="flex items-center gap-2">
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${met ? 'bg-emerald-500' : 'bg-blue-200'}`}>
                              <Check className={`w-2.5 h-2.5 ${met ? 'text-white' : 'text-transparent'}`} />
                            </span>
                            <span className={met ? 'text-slate-600 line-through decoration-slate-300' : ''}>{rule}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end pt-2 border-t border-slate-100">
                        <button
                          type="submit" disabled={loading}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-bold text-sm hover:from-cyan-700 hover:to-cyan-600 transition-all hover:shadow-md hover:shadow-cyan-200 active:scale-95 disabled:opacity-60"
                        >
                          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating…</> : 'Update password'}
                        </button>
                      </div>
                    </form>
                  </Section>
                </div>
              )}

              {/* ╔═ NOTIFICATIONS ════════════════════════════╗ */}
              {tab === 'notifications' && (
                <div className="tab-content-enter">
                  <Section title="Notification Preferences" subtitle="Choose how and when Learnflow contacts you">
                    <div className="p-5 space-y-2">
                      {NOTIF_CONFIG.map(({ k, label, desc, icon }) => (
                        <div
                          key={k}
                          className={`
                            flex items-center justify-between gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer
                            ${notifs[k]
                              ? 'bg-cyan-50/60 border-cyan-200 shadow-sm shadow-cyan-100'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}
                          `}
                          onClick={() => setNotifs(n => ({ ...n, [k]: !n[k] }))}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-lg">{icon}</span>
                            <div className="min-w-0">
                              <p className={`text-sm font-semibold font-sans truncate ${notifs[k] ? 'text-cyan-900' : 'text-slate-700'}`}>{label}</p>
                              <p className="text-xs text-slate-400 font-sans mt-0.5 truncate">{desc}</p>
                            </div>
                          </div>
                          <Toggle value={notifs[k]} onChange={v => setNotifs(n => ({ ...n, [k]: v }))} />
                        </div>
                      ))}
                    </div>
                  </Section>
                </div>
              )}

              {/* ╔═ PRIVACY ══════════════════════════════════╗ */}
              {tab === 'privacy' && (
                <div className="tab-content-enter space-y-4">
                  <Section title="Privacy Settings" subtitle="Control your visibility and data sharing">
                    <div className="p-5 space-y-2">
                      {PRIVACY_CONFIG.map((item, i) => (
                        <div
                          key={i}
                          className={`
                            flex items-center justify-between gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer
                            ${privacy[i]
                              ? 'bg-violet-50/60 border-violet-200 shadow-sm shadow-violet-100'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}
                          `}
                          onClick={() => setPrivacy(p => p.map((v, idx) => idx === i ? !v : v))}
                        >
                          <div className="min-w-0">
                            <p className={`text-sm font-semibold font-sans ${privacy[i] ? 'text-violet-900' : 'text-slate-700'}`}>{item.label}</p>
                            <p className="text-xs text-slate-400 font-sans mt-0.5">{item.desc}</p>
                          </div>
                          <Toggle value={privacy[i]} onChange={v => setPrivacy(p => p.map((x, idx) => idx === i ? v : x))} />
                        </div>
                      ))}
                    </div>
                  </Section>

                  {/* danger zone */}
                  <div className="bg-white border border-red-200 rounded-2xl overflow-hidden shadow-sm animate-[fadeSlideIn_0.35s_ease]">
                    <div className="px-7 py-5 border-b border-red-100 bg-red-50/50">
                      <h2 className="text-base font-black text-red-700">Danger Zone</h2>
                      <p className="text-xs text-red-400 font-sans mt-0.5">Irreversible actions — proceed with caution</p>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-800 font-sans">Delete my account</p>
                          <p className="text-xs text-slate-500 font-sans mt-0.5">Permanently removes all data, progress, and certificates. Cannot be undone.</p>
                        </div>
                        <button
                          onClick={() => setDeleteModal(true)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-300 text-red-600 text-sm font-semibold font-sans hover:bg-red-50 hover:border-red-400 transition-all flex-shrink-0 active:scale-95"
                        >
                          <Trash2 className="w-4 h-4" /> Delete account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* ── delete confirm modal ── */}
      {deleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={e => e.target === e.currentTarget && setDeleteModal(false)}
        >
          <div className="delete-modal-enter bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-red-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between">
              <div>
                <p className="font-black text-slate-900">Delete account?</p>
                <p className="text-xs text-slate-500 font-sans mt-1">This action is permanent and cannot be reversed.</p>
              </div>
              <button
                onClick={() => setDeleteModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold font-sans hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={deleteAccount}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-bold font-sans hover:bg-red-700 transition-all shadow-sm shadow-red-200 active:scale-95 disabled:opacity-60"
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