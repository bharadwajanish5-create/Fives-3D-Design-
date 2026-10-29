import LogoStrip from './LogoStrip';

/** Who we are — copy and layout from the reference design (Purpose-Led BPM). */
export default function About() {
  return (
    <section id="about" className="theme-light relative bg-surface pt-20 md:pt-24">
      <div className="wrap">
        <p className="eyebrow">Who we are</p>
        <h2 className="h-display mt-3 text-[34px] sm:text-[44px]">Purpose-Led <em className="accent">BPM</em></h2>
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
      </div>
      <LogoStrip />
    </section>
  );
}
