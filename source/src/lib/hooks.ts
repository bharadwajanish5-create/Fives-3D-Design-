import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/** True while the element is (near) the viewport — used to pause WebGL when off-screen. */
export function useInView<T extends Element>(margin = '200px') {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return { ref, inView };
}

/** Counts from 0 to `value` once the element enters view. Renders the final value at rest. */
export function useCountUp(value: number, { decimals = 0, duration = 1.6, trigger }: { decimals?: number; duration?: number; trigger?: unknown } = {}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fmt = (n: number) => n.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    el.textContent = fmt(value);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const obj = { n: 0 };
    let tween: gsap.core.Tween | undefined;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      tween = gsap.to(obj, { n: value, duration, ease: 'power3.out', onUpdate: () => { el.textContent = fmt(obj.n); } });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); tween?.kill(); };
  }, [value, decimals, duration, trigger]);
  return ref;
}

export const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
