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
    <section id="industries" className="theme-light relative bg-surface py-24 md:py-32">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[640px]">
            <p className="eyebrow">Industry practices</p>
            <h2 className="h-display mt-5 text-[40px] sm:text-[54px]">Domain depth across <em className="accent">six</em> verticals.</h2>
          </div>
          <p className="max-w-[340px] text-[15px] leading-relaxed text-[#4A566B]">Hover or tap a card to turn it over and see what we run for that industry.</p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((d, i) => (
            <div key={d.title} className={`flip h-[340px] ${flipped === i ? 'is-flipped' : ''}`}>
              <button className="flip-inner block w-full text-left" onClick={() => setFlipped(flipped === i ? null : i)} aria-label={`${d.title}: show services`}>
                {/* front */}
                <div className="flip-face flex flex-col justify-between rounded-[26px] border border-fg/10 bg-surface2 p-7">
                  <div className="flex items-start justify-between">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-ink text-sun">
                      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{icons[d.icon]}</svg>
                    </span>
                    <span className="font-mono text-[11px] text-[#7A8599]">0{i + 1} / 06</span>
                  </div>
                  <div>
                    <h3 className="h-display text-[29px] leading-[1.02]">{d.title}</h3>
                    <p className="mt-2 text-[15px] text-[#4A566B]">{d.front}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#E3E8EF] pt-4">
                    <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#7A8599]">{d.kpiLbl}</span>
                    <span className="font-mono text-[20px] font-bold">{d.kpi}</span>
                  </div>
                </div>
                {/* back */}
                <div className="flip-face flip-back theme-dark flex flex-col justify-between overflow-hidden rounded-[26px] bg-surface p-7 text-fg">
                  <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sun/90 blur-[1px]" />
                  <div className="relative">
                    <p className="eyebrow">What we run</p>
                    <h3 className="h-display mt-3 text-[25px] leading-[1.02]">{d.title}</h3>
                  </div>
                  <ul className="relative grid gap-2.5">
                    {d.back.map((b) => (
                      <li key={b} className="flex items-center gap-3 text-[15px]"><i className="h-1.5 w-1.5 rotate-45 bg-sun" />{b}</li>
                    ))}
                  </ul>
                  <div className="relative flex items-center justify-between border-t border-fg/10 pt-4">
                    <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted2">{d.back.length} services</span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-sun px-4 py-2 text-[13px] font-bold text-ink">Explore industry →</span>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
