/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Outfit',         'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
        display: ['Syne',           'sans-serif'],
      },

      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#1e1b4b',
        },
        bg: {
          base:    '#f8fafc',
          surface: '#ffffff',
          muted:   '#f1f5f9',
        },
        ink: {
          primary:   '#0f172a',
          secondary: '#475569',
          muted:     '#94a3b8',
        },
      },

      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to:   { opacity: 1, transform: 'translateY(0)'    },
        },
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to:   { opacity: 1, transform: 'none'             },
        },
        livePing: {
          '75%,100%': { transform: 'scale(2)', opacity: 0 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)'  },
          '50%':      { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        spin: {
          from: { transform: 'rotate(0deg)'   },
          to:   { transform: 'rotate(360deg)' },
        },
        countUp: {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to:   { opacity: 1, transform: 'translateY(0)'   },
        },
        panelIn: {
          from: { opacity: 0, transform: 'translateY(12px)' },
          to:   { opacity: 1, transform: 'translateY(0)'    },
        },
        scaleIn: {
          from: { opacity: 0, transform: 'scale(0.95)' },
          to:   { opacity: 1, transform: 'scale(1)'    },
        },
        sidebarIn: {
          from: { opacity: 0, transform: 'translateX(-10px)' },
          to:   { opacity: 1, transform: 'translateX(0)'     },
        },
        ticker: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
      },

      animation: {
        /* ── Core ── */
        'fade-in':      'fadeIn  0.5s ease forwards',
        'slide-up':     'slideUp 0.5s ease forwards',
        'fade-up':      'fadeUp  0.6s cubic-bezier(0.16,1,0.3,1) both',
        'fade-up-slow': 'fadeUp  0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both',

        /* ── Live indicators ── */
        'live-ping':    'livePing 1.5s cubic-bezier(0,0,0.2,1) infinite',

        /* ── UI effects ── */
        'float':        'float   4s ease-in-out infinite',
        'float-delay':  'float   4s ease-in-out 2s infinite',
        'shimmer':      'shimmer 2s linear infinite',

        /* ── Admin dashboard stagger ── */
        'count-up':     'countUp 0.5s cubic-bezier(0.16,1,0.3,1)       both',
        'count-up-d1':  'countUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.08s both',
        'count-up-d2':  'countUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.16s both',
        'count-up-d3':  'countUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.24s both',
        'count-up-d4':  'countUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.32s both',
        'count-up-d5':  'countUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.40s both',

        /* ── Admin panel ── */
        'panel-in':     'panelIn   0.3s ease both',
        'scale-in':     'scaleIn   0.2s cubic-bezier(0.16,1,0.3,1) both',
        'sidebar-in':   'sidebarIn 0.3s cubic-bezier(0.16,1,0.3,1) both',

        /* ── Hero stagger ── */
        'fade-up-d1':   'fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.10s both',
        'fade-up-d2':   'fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.20s both',
        'fade-up-d3':   'fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.30s both',
        'fade-up-d4':   'fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.35s both',
        'fade-up-d5':   'fadeUp 0.60s cubic-bezier(0.16,1,0.3,1) 0.40s both',

        /* ── Footer ticker ── */
        'ticker':       'ticker 22s linear infinite',
      },
    },
  },
  plugins: [],
}