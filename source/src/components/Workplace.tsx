import { lazy, Suspense, useState } from 'react';
import { elements } from '../data/site';
import { useInView } from '../lib/hooks';
import peopleImg from '../assets/inclusive_workplace.jpg';

const ElementsScene = lazy(() => import('../three/ElementsScene'));

export default function Workplace() {
  const [active, setActive] = useState(1);
  const { ref, inView } = useInView<HTMLDivElement>();
  const e = elements[active];
  return (
    <section id="people" className="theme-light relative overflow-hidden bg-surface2 py-24 md:py-32">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-end">
          <div>
            <p className="eyebrow">Our workplace</p>
            <h2 className="h-display mt-5 text-[40px] sm:text-[54px]">Five elements. <em className="accent">One</em> inclusive workplace.</h2>
          </div>
          <p className="max-w-[460px] text-[15px] leading-relaxed text-muted">Our name comes from the five elements of life. Each one stands for how we hire, include and grow people. Select an element to read more.</p>
        </div>

        <div ref={ref} className="relative mt-6 h-[300px] sm:h-[360px]">
          <Suspense fallback={null}><ElementsScene active={active} onSelect={setActive} running={inView} /></Suspense>
        </div>

        <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Elements">
          {elements.map((x, i) => (
            <button key={x.id} role="tab" aria-selected={active === i} onClick={() => setActive(i)} className="chip" style={{ borderColor: active === i ? x.color : 'rgba(15,27,45,.15)', color: '#0F1B2D', background: active === i ? x.color : '#fff' }}>{x.name}</button>
          ))}
        </div>

        <div className="mt-10 grid overflow-hidden rounded-[28px] border border-fg/10 bg-surface shadow-[0_24px_60px_rgba(15,27,45,.08)] lg:grid-cols-[1.05fr_1fr]">
          <div className="relative min-h-[280px]">
            <img src={peopleImg} alt="Colleagues, including a wheelchair user, collaborating at the Navi Mumbai centre" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 40%, rgba(15,27,45,.92)), linear-gradient(90deg, ${e.color}33, transparent 60%)` }} />
            <div className="theme-dark absolute bottom-5 left-5 right-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-acc">Navi Mumbai · Impact BPM hub</p>
              <p className="mt-1 text-[14px] text-fg/85">Asia’s first diversity-focused delivery centre</p>
            </div>
          </div>
          <div key={e.id} className="min-w-0 p-7 sm:p-10">
            <p className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-fg"><i className="h-2.5 w-2.5 rounded-full" style={{ background: e.color }} />{e.name}</p>
            <h3 className="h-display mt-3 text-[34px] leading-[1.02]">{e.value}</h3>
            <div className="mt-6 flex items-baseline gap-4 border-y border-fg/10 py-5">
              <span className="h-display shrink-0 text-[50px] leading-none text-fg" style={{ textDecoration: 'underline', textDecorationColor: e.color, textDecorationThickness: 4, textUnderlineOffset: 8 }}>{e.stat}</span>
              <span className="text-[14px] leading-snug text-muted">{e.statLbl}</span>
            </div>
            <p className="mt-5 text-[16px] leading-relaxed text-muted">{e.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
