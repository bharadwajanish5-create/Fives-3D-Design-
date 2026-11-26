import { outcomes } from '../data/site';
import { useCountUp } from '../lib/hooks';

function Ring({ value }: { value: number }) {
  const r = 46, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 120 120" className="h-[112px] w-[112px] -rotate-90 drop-shadow-[0_12px_24px_rgba(250,204,44,.25)]" aria-hidden>
      <defs><linearGradient id={`rg${value}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFE68A" /><stop offset="1" stopColor="#E9A800" /></linearGradient></defs>
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,.10)" strokeWidth="12" />
      <circle cx="60" cy="60" r={r} fill="none" stroke={`url(#rg${value})`} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(c * value) / 100} ${c}`} />
    </svg>
  );
}

/** Two 3D columns: before (1x) and after (3.8x). */
function Bars({ value }: { value: number }) {
  const col = (h: number, top: string, face: string, side: string, lbl: string) => (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-9" style={{ height: h, transformStyle: 'preserve-3d' }}>
        <div className="absolute inset-0 rounded-[3px]" style={{ background: face }} />
        <div className="absolute -right-[10px] top-[5px] h-full w-[10px] origin-left skew-y-[-30deg]" style={{ background: side, height: h }} />
        <div className="absolute -top-[10px] left-[5px] h-[10px] w-full origin-bottom skew-x-[-60deg]" style={{ background: top }} />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted2">{lbl}</span>
    </div>
  );
  return (
    <div className="flex h-[112px] items-end gap-6 pr-3" aria-hidden>
      {col(22, '#3B5276', '#2A3B58', '#1E2C44', 'Before')}
      {col(Math.round(22 * value), '#FFE68A', 'linear-gradient(180deg,#FACC2C,#E9A800)', '#B88400', 'Year 1')}
    </div>
  );
}

function Stat({ value, suffix, label, kind }: (typeof outcomes)[number]) {
  const ref = useCountUp(value, { decimals: value % 1 ? 1 : 0 });
  return (
    <div className="flex min-w-0 items-center gap-6">
      <div className="relative grid shrink-0 place-items-center">
        {kind === 'ring' ? <Ring value={value} /> : <Bars value={value} />}
      </div>
      <div className="min-w-0">
        <div className="h-display text-[48px] leading-none text-sun tabular-nums"><span ref={ref}>{value}</span>{suffix}</div>
        <p className="mt-2 max-w-[220px] text-[14.5px] font-semibold leading-snug text-fg/90">{label}</p>
      </div>
    </div>
  );
}

export default function Outcomes() {
  return (
    <section className="theme-dark relative overflow-hidden border-y border-sun/25 py-9" style={{ background: 'linear-gradient(135deg, #0A1322 0%, #16253B 100%)' }} aria-label="Client outcomes">
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(600px 200px at 50% 0%, rgba(250,204,44,.10), transparent 70%)' }} />
      <div className="wrap relative grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {outcomes.map((o) => <Stat key={o.label} {...o} />)}
      </div>
    </section>
  );
}
