import { lazy, Suspense, useEffect, useRef } from 'react';
import { useCountUp, useInView } from '../lib/hooks';

const MergeScene = lazy(() => import('../three/MergeScene'));

const stats = [
  { v: 16, s: '', l: 'Years of impact' },
  { v: 100, s: '+', l: 'Global brands' },
  { v: 7, s: '', l: 'Countries' },
  { v: 3000, s: '+', l: 'People' },
];
function Stat({ v, s, l }: { v: number; s: string; l: string }) {
  const ref = useCountUp(v);
  return (
    <div className="relative border-t border-fg/12 pt-5">
      <span className="absolute -top-[2px] left-0 h-[3px] w-12 rounded-full bg-sun" />
      <p className="h-display text-[40px] leading-none text-fg sm:text-[52px]"><span ref={ref}>{v.toLocaleString('en-IN')}</span>{s}</p>
      <p className="mt-2 text-[12px] font-bold uppercase tracking-[0.12em] text-muted2">{l}</p>
    </div>
  );
}

/** Who we are — technology + human intelligence merge into one purpose as you scroll. */
export default function About() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const p = useRef(0);
  useEffect(() => {
    const on = () => {
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect(), vh = window.innerHeight;
      p.current = Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (vh * 0.45)));
      el.style.setProperty('--p', String(p.current));
    };
    on(); window.addEventListener('scroll', on, { passive: true }); window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, [ref]);

  return (
    <section id="about" className="theme-light relative overflow-hidden border-b border-fg/10 bg-surface py-[68px]">
      <div className="wrap">
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow">Who we are</p>
            <h2 className="sec-title">Purpose-Led <em className="accent">BPM</em></h2>
          </div>
          <div className="inline-flex items-center gap-3 self-end rounded-full border border-fg/12 bg-surface2 py-2 pl-3 pr-5">
            <span className="relative flex h-3 w-3"><i className="absolute inset-0 animate-ping rounded-full bg-sun/70" /><i className="relative h-3 w-3 rounded-full bg-sun" /></span>
            <span className="text-[13.5px] font-bold text-fg">India’s first diverse &amp; inclusive BPM centre <span className="font-medium text-muted">· Navi Mumbai</span></span>
          </div>
        </div>

        <div ref={ref} className="relative mt-8 h-[340px] overflow-hidden rounded-[26px] border border-fg/10 sm:h-[420px]"
          style={{ background: 'radial-gradient(ellipse at 50% 55%, #FFFFFF 0%, #F1F4F8 55%, #E6ECF4 100%)' }}>
          <Suspense fallback={null}><MergeScene p={p} running={inView} /></Suspense>
          {/* captions: the two ingredients fade out as they merge, the purpose caption fades in */}
          <div className="pointer-events-none absolute bottom-5 left-[28%] -translate-x-1/2 text-center" style={{ opacity: 'calc(1 - var(--p, 0) * 1.7)' }}>
            <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-fg sm:text-[14px]">Technology</p>
          </div>
          <div className="pointer-events-none absolute bottom-5 left-[72%] -translate-x-1/2 text-center" style={{ opacity: 'calc(1 - var(--p, 0) * 1.7)' }}>
            <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-fg sm:text-[14px]">Human intelligence</p>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-5 text-center" style={{ opacity: 'calc((var(--p, 0) - 0.55) * 2.6)' }}>
            <p className="text-[14px] font-extrabold uppercase tracking-[0.16em] text-fg">One purpose</p>
            <p className="mt-0.5 text-[13px] text-muted">Where scale meets social impact</p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-9 lg:grid-cols-4 lg:gap-x-10">
          {stats.map((x) => <Stat key={x.l} {...x} />)}
        </div>
      </div>
    </section>
  );
}
