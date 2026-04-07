import { useInView, useCountUp } from '../../hooks/useInView';

/* Maps numeric delay prop → Tailwind transition-delay class.
   All values are static strings so Tailwind JIT can scan them. */
const DELAY_CLASS = {
  0:   'delay-0',
  60:  'delay-[60ms]',
  70:  'delay-[70ms]',
  80:  'delay-[80ms]',
  100: 'delay-100',
  120: 'delay-[120ms]',
  150: 'delay-150',
  180: 'delay-[180ms]',
  200: 'delay-200',
  300: 'delay-300',
  400: 'delay-[400ms]',
  500: 'delay-500',
};

export function FadeIn({ children, delay = 0, className = '', up = true }) {
  const [ref, inView] = useInView();
  const delayClass = DELAY_CLASS[delay] ?? 'delay-0';

  return (
    <div
      ref={ref}
      className={`transition-all duration-[650ms] ease-out ${delayClass}
        ${inView ? 'opacity-100 translate-y-0' : up ? 'opacity-0 translate-y-7' : 'opacity-0'}
        ${className}`}
    >
      {children}
    </div>
  );
}

export function StatCard({ target, suffix, label, decimals = 0 }) {
  const [count, ref] = useCountUp(target, 1800, decimals);
  return (
    <div
      ref={ref}
      className="
        group flex flex-col items-center justify-center
        rounded-2xl bg-white
        ring-1 ring-cyan-200
        shadow-xl shadow-slate-200/60
        px-5 py-4 text-center
        hover:shadow-cyan-100/80 hover:ring-cyan-300 hover:-translate-y-0.5
        active:scale-[0.98] active:translate-y-0
        transition-all duration-200 cursor-pointer
        w-full min-w-0
      "
    >
      <p className="text-2xl font-bold text-slate-900 tabular-nums group-hover:text-cyan-700 transition-colors duration-200">
        {decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString('en-IN')}{suffix}
      </p>
      <p className="text-xs text-slate-500 mt-0.5 font-mono">{label}</p>
    </div>
  );
}