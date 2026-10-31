import { lazy, Suspense } from 'react';
import { useInView } from '../lib/hooks';

const GlobeScene = lazy(() => import('../three/GlobeScene'));

const chips = [
  { n: '16', u: 'years', l: 'of impact', pos: 'left-3 top-5 sm:left-6 sm:top-8', d: '0s' },
  { n: '100+', u: '', l: 'global brands', pos: 'right-3 top-14 sm:right-6 sm:top-16', d: '-1.4s' },
  { n: '7', u: '', l: 'countries', pos: 'left-3 bottom-16 sm:left-6 sm:bottom-20', d: '-2.6s' },
  { n: '3,000+', u: '', l: 'people', pos: 'right-3 bottom-6 sm:right-6 sm:bottom-10', d: '-3.8s' },
];

/** Who we are — a rotating globe with India as the hub; numbers float around it instead of paragraphs. */
export default function About() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <section id="about" className="theme-light relative overflow-hidden border-b border-fg/10 bg-surface py-[68px]">
      <div className="wrap grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <div>
          <p className="eyebrow">Who we are</p>
          <h2 className="sec-title">Purpose-Led <em className="accent">BPM</em></h2>
          <p className="mt-5 max-w-[30ch] text-[20px] font-semibold leading-[1.45] tracking-[-0.01em] text-fg sm:text-[23px]">
            Technology and human intelligence, delivered with purpose.
          </p>
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-fg/12 bg-surface2 py-2 pl-3 pr-5">
            <span className="relative flex h-3 w-3"><i className="absolute inset-0 animate-ping rounded-full bg-sun/70" /><i className="relative h-3 w-3 rounded-full bg-sun" /></span>
            <span className="text-[13.5px] font-bold text-fg">India’s first diverse &amp; inclusive BPM centre <span className="font-medium text-muted">· Navi Mumbai</span></span>
          </div>
        </div>

        <div ref={ref} className="theme-dark relative h-[400px] overflow-hidden rounded-[24px] border border-fg/10 sm:h-[470px]"
          style={{ background: 'radial-gradient(ellipse at 50% 45%, #1B3050 0%, #0F1B2D 62%, #0A1424 100%)', boxShadow: '0 30px 70px rgba(15,27,45,.28)' }}>
          <Suspense fallback={null}><GlobeScene running={inView} /></Suspense>
          {chips.map((c) => (
            <div key={c.l} className={`pointer-events-none absolute ${c.pos} rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-2.5 backdrop-blur-md`}
              style={{ animation: 'chipFloat 6s ease-in-out infinite', animationDelay: c.d, boxShadow: '0 10px 30px rgba(0,0,0,.25)' }}>
              <p className="text-[24px] font-black leading-none tracking-[-0.02em] text-sun sm:text-[30px]">{c.n}{c.u && <span className="ml-1 text-[13px] font-bold text-white/80">{c.u}</span>}</p>
              <p className="mt-1 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-white/70">{c.l}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{'@keyframes chipFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}'}</style>
    </section>
  );
}
