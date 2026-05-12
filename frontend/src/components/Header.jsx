import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import {
  LayoutDashboard, LogOut, Menu, X, ChevronDown,
  Code2, Brain, Palette, PlayCircle, Info, Phone, HelpCircle, GraduationCap,
  ArrowRight, TrendingUp, UserCircle, Database, Cloud
} from 'lucide-react';
import toast from 'react-hot-toast';

const COURSE_CATS = [
  { label: 'Marketing',             icon: TrendingUp,  href: '/courses?category=Marketing',           color: 'text-orange-600', bg: 'bg-orange-50' },
  { label: 'Web Development',       icon: Code2,       href: '/courses?category=Web Development',  color: 'text-blue-600',   bg: 'bg-blue-50'   },
  { label: 'AI / Machine Learning', icon: Brain,       href: '/courses?category=AI / Machine Learning',         color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Design',          icon: Palette,     href: '/courses?category=Design',          color: 'text-pink-600',   bg: 'bg-pink-50'   },
  { label: 'Data Science',          icon: Database ,    href: '/courses?category=Data Science',    color: 'text-amber-600',  bg: 'bg-amber-50'  },
  { label: 'Cloud Computing',       icon: Cloud,      href: '/courses?category=Cloud Computing',    color: 'text-cyan-600',   bg: 'bg-cyan-50'   }
];

const MORE_LINKS = [
  { label: 'About Learnflow', desc: 'Our mission & story',       icon: Info,          href: '/about'       },
  { label: 'Our Instructors', desc: 'Expert mentors from India', icon: GraduationCap, href: '/instructors' },
  { label: 'Help Centre',     desc: 'FAQs & Support',            icon: HelpCircle,    href: '/help'        },
  { label: 'Contact Us',      desc: 'Get in touch with us',      icon: Phone,         href: '/contact'     },
];

const NAV_BTN = 'px-4 py-2 text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-black transition-colors duration-150';

const LOGO_URL = 'https://res.cloudinary.com/db2vju4mv/image/upload/q_auto/f_auto/v1775046563/p1_l90afj.webp';

/* ── Dropdown ── */
function NavDropdown({ children, label, width = 'w-64' }) {
  const [open, setOpen] = useState(false);
  const timerRef        = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const show = () => { clearTimeout(timerRef.current); setOpen(true);  };
  const hide = () => { timerRef.current = setTimeout(() => setOpen(false), 150); };

  return (
    <div className="relative flex items-center" onMouseEnter={show} onMouseLeave={hide}>
      <button
        aria-expanded={open}
        className={`${NAV_BTN} flex items-center gap-1.5`}
      >
        {label}
        <ChevronDown
          size={13}
          className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 z-[110] ${width}
        transition-all duration-200 origin-top
        ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
      >
        <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.11)] ring-1 ring-black/[0.04] overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function Header() {
  const { user, logout } = useAuth();
  const location         = useLocation();
  const navigate         = useNavigate();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out safely');
    navigate('/');
  };

  /* ── User dropdown menu items based on role ── */
  const UserMenu = () => (
    <NavDropdown label={user.name?.split(' ')[0] ?? 'Account'} width="w-60">
      <div className="p-2">
        <div className="px-3 py-2 mb-1">
          <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
          <p className="text-xs text-slate-400 truncate">{user.email}</p>
        </div>
        <div className="h-px bg-slate-100 mb-1" />

        {isAdmin ? (
          <Link
            to="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-sm font-semibold text-slate-600 hover:text-black transition-colors"
          >
            <LayoutDashboard size={16} className="text-slate-400 flex-shrink-0" /> Dashboard
          </Link>
        ) : (
          <>
            <Link
              to="/profile"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-sm font-semibold text-slate-600 hover:text-black transition-colors"
            >
              <UserCircle size={16} className="text-slate-400 flex-shrink-0" /> Profile
            </Link>
            <Link
              to="/my-courses"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-sm font-semibold text-slate-600 hover:text-black transition-colors"
            >
              <PlayCircle size={16} className="text-slate-400 flex-shrink-0" /> My Courses
            </Link>
          </>
        )}

        <div className="h-px bg-slate-100 my-1" />
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-50 text-sm font-semibold text-slate-500 hover:text-rose-600 text-left transition-colors"
        >
          <LogOut size={16} className="flex-shrink-0" /> Logout
        </button>
      </div>
    </NavDropdown>
  );

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'py-2' : 'py-5'}`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className={`flex items-center justify-between px-6 sm:px-8 rounded-full border transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl border-slate-200 shadow-lg py-2'
            : 'bg-white border-slate-100 py-3.5'
        }`}>

          {/* ── BRAND ── */}
          <Link to="/" className="flex items-center gap-2.5 group flex-1 min-w-0 active:opacity-80">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex-shrink-0 overflow-hidden shadow-sm
              bg-gradient-to-br from-cyan-500 to-cyan-700
              transition-all duration-300
              group-hover:shadow-[0_0_0_3px_rgba(6,182,212,0.3)]
              group-hover:scale-105">
              <img src={LOGO_URL} alt="Learnflow" className="w-full h-full object-cover" />
            </div>
            <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tighter uppercase truncate">
              Learn<span className="text-indigo-600">flow</span>
            </span>
          </Link>

          {/* ── DESKTOP NAV ── */}
          <nav className="hidden lg:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">

            {/* Explore */}
            <NavDropdown label="Explore" width="w-[640px]">
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Course Categories
                  </h4>
                  {/* "View All" goes to /courses with NO category param → shows all */}
                  <Link
                    to="/courses"
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
                  >
                    View All <ArrowRight size={12} />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {COURSE_CATS.map(cat => (
                    <Link
                      key={cat.label}
                      to={cat.href}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all group/cat border border-transparent hover:border-slate-100"
                    >
                      <div className={`w-10 h-10 rounded-xl ${cat.bg} ${cat.color} flex items-center justify-center flex-shrink-0 group-hover/cat:scale-110 transition-transform duration-200`}>
                        <cat.icon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 leading-tight">{cat.label}</p>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">{cat.badge}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </NavDropdown>

            <Link to="/certifications" className={NAV_BTN}>Certifications</Link>
            <Link to="/leaderboard"    className={NAV_BTN}>Leaderboard</Link>

            {/* More */}
            <NavDropdown label="More" width="w-72">
              <div className="p-2">
                {MORE_LINKS.map(link => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 group/more transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover/more:bg-slate-200 group-hover/more:text-slate-600 transition-all flex-shrink-0">
                      <link.icon size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700 group-hover/more:text-slate-900 leading-tight">{link.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{link.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </NavDropdown>
          </nav>

          {/* ── AUTH ── */}
          <div className="flex items-center justify-end gap-2 flex-1">
            {user ? (
            <div className="hidden lg:flex items-center gap-2">
            {!isAdmin && <NotificationBell />}
            <UserMenu />
            </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-black transition-colors duration-150"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-7 py-3 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all duration-200 shadow-md active:scale-95"
                >
                  Join Free
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="lg:hidden p-2 text-slate-700 hover:text-black transition-colors rounded-lg hover:bg-slate-100"
              onClick={() => setMenuOpen(v => !v)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE DRAWER ── */}
      <div
        className={`lg:hidden fixed inset-0 bg-white z-[90] transition-all duration-300
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ top: scrolled ? '60px' : '76px' }}
      >
        <div className="h-full overflow-y-auto p-6 flex flex-col gap-1">

          {/* Main links */}
          {[
            { to: '/courses',        label: 'Explore'        },
            { to: '/certifications', label: 'Certifications' },
            ...(user ? [{ to: '/my-courses', label: 'My Courses' },
                { to: '/notifications', label: 'Notifications' },
             ] : []),
            { to: '/leaderboard',    label: 'Leaderboard'    },
          ].map(item => (
            <Link
              key={item.to}
              to={item.to}
              className="px-4 py-4 text-lg font-bold text-slate-700 hover:text-black hover:bg-slate-50 rounded-xl border-b border-slate-100 transition-colors"
            >
              {item.label}
            </Link>
          ))}

          {/* Categories grid */}
          <div className="pt-5">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 px-4 mb-3">Categories</p>
            <div className="grid grid-cols-2 gap-2">
              {COURSE_CATS.map(cat => (
                <Link
                  key={cat.label}
                  to={cat.href}
                  className={`flex items-center gap-2 p-3 rounded-xl ${cat.bg} transition-colors`}
                >
                  <cat.icon size={16} className={cat.color} />
                  <span className="text-xs font-bold text-slate-700 leading-tight">{cat.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* More links */}
          <div className="pt-5">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 px-4 mb-3">More</p>
            <div className="grid grid-cols-2 gap-2">
              {MORE_LINKS.map(l => (
                <Link
                  key={l.label}
                  to={l.href}
                  className="px-4 py-3 rounded-xl bg-slate-50 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-black transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* ── Mobile Auth Section ── */}
          <div className="pt-5 mt-auto">
            {user ? (
              <div className="flex flex-col gap-2">
                <div className="px-4 py-3 rounded-xl bg-slate-50 mb-1">
                  <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
                {/* Mobile: Notification bell */}
<div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 mb-1">
  <div>
    <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
    <p className="text-xs text-slate-400 truncate">{user.email}</p>
  </div>
  {!isAdmin && <NotificationBell />}
</div>

                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <LayoutDashboard size={16} className="text-slate-400" /> Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <UserCircle size={16} className="text-slate-400" /> Profile
                    </Link>
                    <Link
                      to="/my-courses"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <PlayCircle size={16} className="text-slate-400" /> My Courses
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-50 text-sm font-semibold text-rose-600 hover:bg-rose-100 transition-colors text-left"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  className="w-full py-3.5 text-center rounded-xl border-2 border-slate-200 text-sm font-bold text-slate-700 hover:border-slate-900 hover:text-black transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="w-full py-3.5 text-center rounded-xl bg-slate-900 text-white text-sm font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors"
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}