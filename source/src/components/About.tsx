import { lazy, Suspense, useEffect, useRef } from 'react';
import { useCountUp, useInView } from '../lib/hooks';

const GrowthScene = lazy(() => import('../three/GrowthScene'));

const milestones = [
  { y: '2009', t: 'Udaipur', d: 'Where FiveS began, with a 12-member team' },
  { y: '2023', t: 'Navi Mumbai', d: 'India’s first diverse & inclusive BPM centre' },
  { y: 'Today', t: 'Scale with purpose', d: 'Where scale meets social impact' },
];
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

/** Who we are — a skyline that builds itself floor by floor: 2009 → 2023 → today. */
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
        <div>
          <div>
            <p className="eyebrow">Who we are</p>
            <h2 className="sec-title">Purpose-Led <em className="accent">BPM</em></h2>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[26px] border border-fg/10" style={{ background: 'linear-gradient(180deg, #F7F9FC 0%, #EDF1F7 100%)' }}>
          <div ref={ref} className="relative h-[310px] sm:h-[380px]">
            <Suspense fallback={null}><GrowthScene p={p} running={inView} /></Suspense>
          </div>
          <div className="grid grid-cols-3 border-t border-fg/10 bg-surface/70">
            {milestones.map((m, i) => (
              <div key={m.y} className={`px-3 py-5 text-center sm:px-6 ${i ? 'border-l border-fg/10' : ''}`}>
                <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#B88400]">{m.y}</p>
                <p className="mt-1 text-[15px] font-extrabold text-fg sm:text-[18px]">{m.t}</p>
                <p className="mt-1 text-[12px] leading-snug text-muted sm:text-[13.5px]">{m.d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-9 lg:grid-cols-4 lg:gap-x-10">
          {stats.map((x) => <Stat key={x.l} {...x} />)}
        </div>
      </div>
    </section>
  );
}
