import { useState } from 'react';
import { industries } from '../data/site';

const icons: Record<string, JSX.Element> = {
  cart: <path d="M6 8h22l-3 12H9L6 8Zm0 0L5 4H2m10 22a2 2 0 1 0 0 .1M24 26a2 2 0 1 0 0 .1" />,
  shield: <path d="M16 3 5 7v8c0 7 5 12 11 14 6-2 11-7 11-14V7L16 3Zm-5 13 4 4 7-8" />,
  pulse: <path d="M2 17h6l3-8 5 15 4-10 2 3h8" />,
  cap: <path d="M16 5 2 12l14 7 14-7-14-7Zm-8 11v7c4 3 12 3 16 0v-7M28 13v8" />,
  truck: <path d="M2 8h17v13H2zM19 12h6l4 5v4H19M8 25a2.5 2.5 0 1 0 0 .1M24 25a2.5 2.5 0 1 0 0 .1" />,
  chip: <path d="M10 10h12v12H10zM13 5v5M19 5v5M13 22v5M19 22v5M5 13h5M5 19h5M22 13h5M22 19h5" />,
};

export default function Industries() {
  const [flipped, setFlipped] = useState<number | null>(null);
  return (
    <section id="industries" className="theme-light relative border-b border-fg/10 bg-surface2 py-[65px]">
      <div className="wrap">
        <p className="eyebrow">Industry Practices</p>
        <h2 className="sec-title">Domain Expertise Across <em className="accent">Verticals</em></h2>

        <div className="mt-9 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((d, i) => (
            <div key={d.title} className={`flip h-[262px] ${flipped === i ? 'is-flipped' : ''}`}>
              <button className="flip-inner block w-full text-left" onClick={() => setFlipped(flipped === i ? null : i)} aria-label={`${d.title}: flip card`}>
                {/* front — as in the reference design */}
                <div className="flip-face flex flex-col justify-between rounded-2xl border-[1.5px] border-fg/10 bg-surface p-6">
                  <div>
                    <span className="mb-4 grid h-14 w-14 place-items-center rounded-[14px] bg-ink text-sun shadow-[inset_0_1px_1px_rgba(255,255,255,.2)]">
                      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{icons[d.icon]}</svg>
                    </span>
                    <h3 className="mb-2 text-[17.5px] font-extrabold text-fg">{d.title}</h3>
                    <p className="text-[13.5px] leading-[1.55] text-muted">{d.desc}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-fg/10 pt-3.5">
                    <span className="text-[12px] font-semibold text-muted2">{d.kpiLbl}</span>
                    <span className="rounded-full border border-sun/40 bg-sun/20 px-3 py-1 text-[15px] font-black text-fg">{d.kpi}</span>
                  </div>
                </div>
                {/* back */}
                <div className="flip-face flip-back theme-dark flex flex-col justify-between overflow-hidden rounded-2xl bg-surface p-6 text-fg">
                  <div className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full bg-sun/90" />
                  <span className="relative grid h-14 w-14 place-items-center rounded-[14px] bg-ink text-sun">
                    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{icons[d.icon]}</svg>
                  </span>
                  <div className="relative">
                    <h3 className="text-[19px] font-extrabold">{d.title}</h3>
                    <p className="mt-2 text-[13.5px] leading-[1.55] text-muted">Specialized workflows tailored to compliance, speed, and unit economics.</p>
                  </div>
                  <span role="link" onClick={(e) => { e.stopPropagation(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="relative inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-sun px-4 py-2 text-[13px] font-bold text-ink">Talk to our team →</span>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
