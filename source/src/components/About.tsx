import { whoWeAre } from '../data/site';
import LogoStrip from './LogoStrip';
import { useCountUp } from '../lib/hooks';

function Fact({ value, suffix, label, note, i }: { value: number; suffix: string; label: string; note: string; i: number }) {
  const ref = useCountUp(value);
  return (
    <div className="group relative min-w-0 border-t border-fg/10 pt-6" style={{ perspective: '800px' }}>
      <span className="font-mono text-[11px] text-muted3">0{i + 1}</span>
      <div className="h-display mt-2 text-[45px] text-fg tabular-nums transition duration-500 group-hover:text-acc text-fg sm:text-[74px]" style={{ transformOrigin: 'left bottom' }}>
        <span ref={ref}>{value}</span><span className="text-sun">{suffix}</span>
      </div>
      <p className="mt-1 text-[17px] font-semibold">{label}</p>
      <p className="mt-1 text-[13px] leading-snug text-muted2">{note}</p>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="theme-light relative bg-surface pt-24 md:pt-32">
      <div className="wrap">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">Who we are</p>
            <h2 className="h-display mt-5 text-[40px] sm:text-[54px]">Purpose-led <em className="accent">BPM</em>, built in Udaipur, run worldwide.</h2>
          </div>
          <div className="min-w-0 self-end">
            <p className="text-[21px] font-semibold leading-snug text-fg">{whoWeAre.lead}</p>
            <p className="mt-5 max-w-[60ch] text-[16px] leading-relaxed text-muted">{whoWeAre.body}</p>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-2 sm:gap-x-8 gap-x-6 gap-y-10 lg:grid-cols-4">
          {whoWeAre.facts.map((f, i) => <Fact key={f.label} {...f} i={i} />)}
        </div>
      </div>

      <LogoStrip />
    </section>
  );
}
