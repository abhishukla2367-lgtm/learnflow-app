import { useState, useEffect, useRef } from 'react';

export function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

export function useCountUp(target, duration = 1800, decimals = 0) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    let s = 0; const steps = 60, inc = target / steps, iv = duration / steps;
    const t = setInterval(() => {
      s += inc;
      if (s >= target) { setCount(target); clearInterval(t); }
      else setCount(parseFloat(s.toFixed(decimals)));
    }, iv);
    return () => clearInterval(t);
  }, [started, target, duration, decimals]);
  return [count, ref];
}