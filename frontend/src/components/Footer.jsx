import { Link } from 'react-router-dom';
import { Zap, MapPin, Mail } from 'lucide-react';
import { FaFacebook, FaLinkedin, FaXTwitter, FaYoutube, FaInstagram } from 'react-icons/fa6';

const LINKS = {
  Platform: [
    { label: 'Browse Courses', href: '/courses'        },
    { label: 'Certifications', href: '/certifications' },
    { label: 'Leaderboard', href: '/leaderboard'    },
    { label: 'Instructors',    href: '/instructors'    }
  ],
  Company: [
    { label: 'About Us', href: '/about'   },
    { label: 'Contact',  href: '/contact' },
  ],
  Support: [
    { label: 'Help Center',      href: '/help'    },
    { label: 'Privacy Policy',   href: '/privacy' },
    { label: 'Terms of Service', href: '/terms'   },
    { label: 'Cookie Policy',    href: '/cookies' },
  ],
};

const SOCIALS = [
  { icon: FaFacebook,  href: 'https://facebook.com',  label: 'Facebook'  },
  { icon: FaLinkedin,  href: 'https://linkedin.com',  label: 'LinkedIn'  },
  { icon: FaXTwitter,  href: 'https://x.com',         label: 'X'         },
  { icon: FaYoutube,   href: 'https://youtube.com',   label: 'YouTube'   },
  { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
];

const STATS = [
  { num: '50K+', label: 'Learners'   },
  { num: '30+',  label: 'Courses'    },
  { num: '4.7★', label: 'Rating'     },
  { num: '98%',  label: 'Completion' },
];

// 6× duplication ensures seamless -50% loop at any screen width
const TICKER_ITEMS = [...STATS, ...STATS, ...STATS, ...STATS, ...STATS, ...STATS];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">

      {/* ── Infinite Ticker ── */}
      <div className="relative border-b border-slate-200 overflow-hidden py-3 bg-slate-50">

        {/* Left fade mask */}
        <div className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-slate-50 to-transparent" />
        {/* Right fade mask */}
        <div className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-slate-50 to-transparent" />

        <div
          className="flex w-max animate-ticker will-change-transform"
          onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
          onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}
        >
          {TICKER_ITEMS.map((s, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 mx-8 text-xs text-slate-500 font-mono whitespace-nowrap"
            >
              <span className="text-cyan-600 font-semibold">{s.num}</span>
              <span>{s.label}</span>
              <span className="text-slate-300">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Main Footer Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-10">

          {/* Brand col */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center">
                <Zap className="w-4 h-4 text-cyan-600" />
              </div>
              <span className="text-lg font-bold text-slate-900">
                Learn<span className="text-cyan-600">flow</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 font-sans leading-relaxed mb-4 max-w-xs">
              India's professional online learning platform — 50,000+ learners mastering in-demand
              tech skills through expert-led live sessions, AI-powered progress tracking, and
              blockchain-verified certifications.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
              <MapPin className="w-3.5 h-3.5 text-cyan-500" />
              Thane, Maharashtra
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono mt-1">
              <Mail className="w-3.5 h-3.5 text-cyan-500" />
              hello@Learnodays.in
            </div>
          </div>

          {/* Nav link cols */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold font-mono text-slate-500 uppercase tracking-widest mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map(l => (
                  <li key={l.label}>
                    <Link
                      to={l.href}
                      className="text-sm text-slate-600 hover:text-cyan-700 font-sans transition-colors duration-200"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-mono">
            © 2020-{new Date().getFullYear()} Learnodays Technologies Pvt Ltd · CIN U72900KA2020PTC135792 · All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-cyan-600 hover:border-cyan-200 hover:bg-cyan-50 transition-all duration-200"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}