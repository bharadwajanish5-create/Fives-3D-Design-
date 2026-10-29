import { awardLogos, partnerLogos } from '../data/site';

const files = import.meta.glob('../assets/logos/*.webp', { eager: true, import: 'default' }) as Record<string, string>;
const src = (f: string) => files[`../assets/logos/${f}`];

function Row({ items, label, reverse, speed }: { items: { file: string; name: string }[]; label: string; reverse?: boolean; speed: number }) {
  return (
    <div className="grid items-center gap-4 md:grid-cols-[180px_1fr]">
      <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-muted2">{label}</p>
      <div className="min-w-0 overflow-hidden" style={{ maskImage: 'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)' }}>
        <div className="ticker flex w-max gap-4" style={{ animationDuration: `${speed}s`, animationDirection: reverse ? 'reverse' : 'normal' }}>
          {[...items, ...items].map((l, i) => (
            <div key={i} title={l.name} className="flex h-[76px] shrink-0 items-center justify-center rounded-2xl border border-fg/10 bg-white px-6 transition hover:-translate-y-0.5 hover:border-sun hover:shadow-[0_10px_24px_rgba(15,27,45,.08)]">
              <img src={src(l.file)} alt={i < items.length ? l.name : ''} aria-hidden={i >= items.length} className="max-h-[46px] w-auto max-w-[170px] object-contain" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LogoStrip() {
  return (
    <div className="mt-20 border-y border-fg/10 bg-surface2 py-8">
      <div className="wrap grid gap-6">
        <Row items={awardLogos} label="Awards & certifications" speed={70} />
        <Row items={partnerLogos} label="Technology partners" speed={60} reverse />
      </div>
    </div>
  );
}
