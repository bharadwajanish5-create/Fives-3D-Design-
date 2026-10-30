import LogoStrip from './LogoStrip';
import { whoWeAre } from '../data/site';
import { useCountUp } from '../lib/hooks';

function Fact({ f }: { f: (typeof whoWeAre.facts)[number] }) {
  const ref = useCountUp(f.value, { duration: 1.4 });
  return (
    <div className="group rounded-xl border-[1.5px] border-fg/10 bg-surface2 px-5 py-4 transition duration-300 hover:-translate-y-1 hover:border-sun hover:shadow-[0_16px_36px_rgba(15,27,45,.09)]">
      <p className="text-[32px] font-black leading-none text-acc"><span ref={ref}>{f.value}</span>{f.suffix}</p>
      <p className="mt-2 text-[13.5px] font-extrabold text-fg">{f.label}</p>
    </div>
  );
}

/** Who we are — copy and layout from the reference design (Purpose-Led BPM), plus the headline numbers. */
export default function About() {
  return (
    <section id="about" className="theme-light relative border-b border-fg/10 bg-surface pt-[72px]">
      <div className="wrap">
        <p className="eyebrow">Who we are</p>
        <h2 className="sec-title">Purpose-Led <em className="accent">BPM</em></h2>
        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <div className="border-l-[3.5px] border-sun pl-6">
            <p className="text-[18px] font-semibold leading-[1.55] tracking-[-0.01em] text-fg sm:text-[21px]">
              At FiveS Digital, we blend technology and human intelligence to deliver best-in-class BPM solutions. For over 16 years, we’ve powered AI-backed customer experience and data management services.
            </p>
          </div>
          <p className="text-[16.5px] leading-[1.7] text-muted">
            Helping global brands across India, Europe, the USA, and the Middle East transform the way they operate. We’re proud to lead with purpose, home to India’s first diverse and inclusive BPM centre in Navi Mumbai, where scale meets social impact.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {whoWeAre.facts.map((f) => <Fact key={f.label} f={f} />)}
        </div>
      </div>
      <LogoStrip />
    </section>
  );
}
