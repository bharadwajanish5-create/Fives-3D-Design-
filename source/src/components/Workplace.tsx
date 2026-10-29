import { lazy, Suspense, useState } from 'react';
import { elements } from '../data/site';
import { useInView } from '../lib/hooks';
import earth from '../assets/elements/earth.jpg';
import water from '../assets/elements/water.jpg';
import air from '../assets/elements/air.jpg';
import fire from '../assets/elements/fire.jpg';
import space from '../assets/elements/space.jpg';

const ElementsScene = lazy(() => import('../three/ElementsScene'));
/** Photos from fivesdigital.com/life-at-fives, one per element. */
const photos: Record<string, { src: string; alt: string; caption: string }> = {
  earth: { src: earth, alt: 'Bright FiveS office floor with yellow walls', caption: 'A workplace that truly cares' },
  water: { src: water, alt: 'Team at work, including a colleague in a wheelchair', caption: 'Inclusion you can see every day' },
  air: { src: air, alt: 'Women colleagues standing arm in arm', caption: 'Diversity on the floor and in leadership' },
  fire: { src: fire, alt: 'Rising arrow and a lightbulb', caption: 'Growth you can measure' },
  space: { src: space, alt: 'Hands joined together in a circle', caption: 'Values we live by' },
};

export default function Workplace() {
  const [active, setActive] = useState(1);
  const { ref, inView } = useInView<HTMLDivElement>();
  const e = elements[active];
  return (
    <section id="people" className="theme-light relative overflow-hidden bg-surface2 py-24 md:py-28">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-end">
          <div>
            <p className="eyebrow">Our Workplace</p>
            <h2 className="h-display mt-5 text-[40px] sm:whitespace-nowrap sm:text-[clamp(34px,4.2vw,54px)]">Inclusion driven <em className="accent">People approach</em></h2>
          </div>
        </div>

        <div className="mt-12 grid overflow-hidden rounded-[28px] border border-fg/10 bg-surface shadow-[0_24px_60px_rgba(15,27,45,.08)] lg:grid-cols-[1fr_1.05fr]">
          {/* photo — changes with the element */}
          <div className="relative min-h-[300px] overflow-hidden lg:min-h-[520px]">
            {elements.map((x, i) => (
              <img key={x.id} src={photos[x.id].src} alt={photos[x.id].alt} aria-hidden={i !== active}
                className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out"
                style={{ opacity: i === active ? 1 : 0, transform: i === active ? 'scale(1)' : 'scale(1.06)' }} />
            ))}
            <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 45%, rgba(15,27,45,.9)), linear-gradient(120deg, ${e.color}40, transparent 55%)` }} />
            <div className="theme-dark absolute bottom-5 left-5 right-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-acc">{e.name}</p>
              <p className="mt-1 text-[15px] font-semibold text-fg">{photos[e.id].caption}</p>
            </div>
          </div>

          <div className="min-w-0 p-6 sm:p-9">
            {/* five 3D element icons */}
            <div className="rounded-2xl border border-fg/10 bg-surface2 px-2 pt-2">
              <div ref={ref} className="h-[96px] sm:h-[110px]">
                <Suspense fallback={null}><ElementsScene active={active} onSelect={setActive} running={inView} /></Suspense>
              </div>
              <div className="grid grid-cols-5 pb-2" role="tablist" aria-label="Five elements">
                {elements.map((x, i) => (
                  <button key={x.id} role="tab" aria-selected={active === i} onClick={() => setActive(i)}
                    className={`mx-auto rounded-full px-2.5 py-1 text-[12px] font-bold transition sm:text-[13px] ${active === i ? 'text-ink' : 'text-muted hover:text-fg'}`}
                    style={{ background: active === i ? x.color : 'transparent' }}>{x.name}</button>
                ))}
              </div>
            </div>

            {/* details for the selected element */}
            <div key={e.id} className="mt-7" style={{ animation: 'elIn .45s ease' }}>
              <h3 className="h-display text-[30px] leading-[1.08] sm:text-[34px]">{e.value}</h3>
              <div className="mt-5 flex items-center gap-4 rounded-2xl border border-fg/10 p-4">
                <span className="h-display shrink-0 text-[42px] leading-none text-fg">{e.stat}</span>
                <span className="h-10 w-[3px] shrink-0 rounded-full" style={{ background: e.color }} />
                <span className="text-[14px] leading-snug text-muted">{e.statLbl}</span>
              </div>
              <p className="mt-5 text-[16px] leading-relaxed text-muted">{e.body}</p>
            </div>
            <style>{'@keyframes elIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}'}</style>
          </div>
        </div>
      </div>
    </section>
  );
}
