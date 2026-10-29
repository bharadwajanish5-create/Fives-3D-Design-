import { awardLogos, partnerLogos } from '../data/site';

const files = import.meta.glob('../assets/logos/*.webp', { eager: true, import: 'default' }) as Record<string, string>;
const src = (f: string) => files[`../assets/logos/${f}`];

/** One-line ticker of award, certification and partner logos. */
export default function LogoStrip() {
  const items = [...awardLogos, ...partnerLogos];
  return (
    <div className="mt-16 overflow-hidden border-y border-fg/10 bg-surface2 py-5" aria-label="Awards, certifications and partners"
      style={{ maskImage: 'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)' }}>
      <div className="ticker flex w-max items-center gap-4" style={{ animationDuration: '110s' }}>
        {[...items, ...items].map((l, i) => (
          <div key={i} title={l.name} className="flex h-[64px] shrink-0 items-center justify-center rounded-2xl border border-fg/10 bg-white px-5 transition hover:-translate-y-0.5 hover:border-sun">
            <img src={src(l.file)} alt={i < items.length ? l.name : ''} aria-hidden={i >= items.length} className="max-h-[40px] w-auto max-w-[150px] object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
}
