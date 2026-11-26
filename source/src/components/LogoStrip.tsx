import { badges } from '../data/badges';

/** One-line ticker of certification and partner badges — the strip from the reference design. */
export default function LogoStrip() {
  return (
    <div className="theme-light overflow-hidden border-b border-fg/10 bg-surface py-4" aria-label="Partner and certification recognition strip"
      style={{ maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)' }}>
      <div className="ticker flex w-max items-center gap-4" style={{ animationDuration: '32s' }}>
        {[...badges, ...badges].map((b, i) => (
          <span key={i} aria-hidden={i >= badges.length} className="flex h-[42px] shrink-0 items-center gap-2.5 whitespace-nowrap rounded-[10px] border-[1.5px] border-fg/10 bg-white px-[18px] text-[13px] font-bold text-fg transition hover:-translate-y-px hover:border-sun hover:bg-[#FFFDF5]">
            <span className="flex shrink-0 items-center" dangerouslySetInnerHTML={{ __html: b.svg }} />
            <span><strong>{b.strong}</strong> {b.rest}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
