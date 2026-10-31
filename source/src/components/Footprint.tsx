import { useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { geoNaturalEarth1, geoMercator } from 'd3-geo';
import dots from '../data/mapDots.json';
import { locations, type Location } from '../data/site';

const W = 1000, H = 520, RATIO = H / W;
const HUB = locations.find((l) => l.flagship)!;
const country: Record<string, string> = { 'New Jersey': 'USA', Brussels: 'Belgium', Malta: 'Malta', Ghana: 'Ghana', Kenya: 'Kenya', Philippines: 'Philippines' };

export default function Footprint() {
  const proj = useMemo(() => geoNaturalEarth1().fitSize([W, H], { type: 'MultiPoint', coordinates: [[-168, -55], [178, 76], [0, 76], [0, -55]] } as any), []);
  const P = (lon: number, lat: number) => proj([lon, lat]) as [number, number];
    // India gets its own north-up Mercator so it isn't sheared by the world projection, anchored where it sits on the world map
  const projIn = useMemo(() => geoMercator().center([82.5, 22.5]).scale(proj.scale() * 1.0).translate(proj([82.5, 22.5]) as [number, number]), [proj]);
  const PI = (lon: number, lat: number) => projIn([lon, lat]) as [number, number];
  const india = useMemo(() => (dots.india as number[][]).map(([lo, la]) => PI(lo, la)), [projIn]);
  const world = useMemo(() => {
    // drop world dots that sit under the finer India grid so India reads as its own highlighted block
    const C = 6, cells = new Set(india.map(([x, y]) => `${Math.floor(x / C)},${Math.floor(y / C)}`));
    return (dots.world as number[][]).map(([lo, la]) => P(lo, la)).filter(([x, y]) => { const cx = Math.floor(x / C), cy = Math.floor(y / C); for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) if (cells.has(`${cx + i},${cy + j}`)) return false; return true; });
  }, [proj, india]);
  const indiaBox = useMemo(() => {
    const xs = india.map((p) => p[0]), ys = india.map((p) => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const h = (y1 - y0) * 1.25, w = Math.max(h / RATIO, (x1 - x0) * 1.3);
    return { x: (x0 + x1) / 2 - w / 2, y: (y0 + y1) / 2 - (w * RATIO) / 2, w, h: w * RATIO };
  }, [india]);

  type Box = { x: number; y: number; w: number; h: number; z: number };
  const [vb, setVb] = useState<Box>({ x: 0, y: 0, w: W, h: H, z: 0 });
  const [view, setView] = useState<'world' | 'india'>('world');
  const [zoomed, setZoomed] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const box = useRef<Box>({ ...vb });

  const tween = (t: Box) => gsap.to(box.current, { ...t, duration: 1.3, ease: 'power3.inOut', onUpdate: () => setVb({ ...box.current }) });
  const go = (v: 'world' | 'india') => {
    setView(v); setHover(null); setZoomed(false);
    tween(v === 'india' ? { ...indiaBox, z: 1 } : { x: 0, y: 0, w: W, h: H, z: 0 });
  };
  /** Fly the camera to a pin and zoom in on it. */
  const focusOn = (l: Location) => {
    const inIndia = l.region === 'india';
    const [px, py] = (inIndia ? PI : P)(l.lon, l.lat);
    const w = inIndia ? indiaBox.w / 2.4 : W / 3.3, h = w * RATIO;
    const x = inIndia ? px - w / 2 : Math.min(W - w, Math.max(0, px - w / 2));
    const y = inIndia ? py - h / 2 : Math.min(H - h, Math.max(0, py - h / 2));
    setHover(l.name); setZoomed(true); setView(inIndia ? 'india' : 'world');
    tween({ x, y, w, h, z: inIndia ? 1 : 0 });
  };

  const k = W / vb.w; // zoom factor
  const z = vb.z; // 0 world → 1 india
  const origin = PI(HUB.lon, HUB.lat);
  const intl = locations.filter((l) => l.region === 'intl');
  const hubs = locations.filter((l) => l.region === 'india');
  const pct = (x: number, y: number) => ({ left: `${((x - vb.x) / vb.w) * 100}%`, top: `${((y - vb.y) / vb.h) * 100}%` });
  const proj2 = (l: Location) => (l.region === 'india' ? PI : P)(l.lon, l.lat);
  const hovered = locations.find((l) => l.name === hover);
  const clusterHover = hover === '__india';
  const cx = (indiaBox.x + indiaBox.w / 2), cy = (indiaBox.y + indiaBox.h / 2);

  const pin = (l: Location, flagship: boolean | undefined, i: number) => {
    const [x, y] = proj2(l);
    const r = (flagship ? 7 : 5.5) / k;
    const intlPin = l.region === 'intl';
    const glow = intlPin ? 'url(#glowB)' : 'url(#glowY)';
    return (
      <g key={l.name} onMouseEnter={() => setHover(l.name)} onMouseLeave={() => setHover(null)} onClick={() => focusOn(l)} style={{ cursor: 'pointer' }}>
        <circle cx={x} cy={y} r={r * 4.2} fill={glow} className="pulse-glow" style={{ animationDelay: `${(i * 0.55) % 2.6}s` }} />
        <circle cx={x} cy={y} r={r * 4.2} fill={glow} className="pulse-glow" style={{ animationDelay: `${((i * 0.55) % 2.6) + 1.3}s` }} />
        <circle cx={x} cy={y} r={r} fill={intlPin ? '#2F8FDB' : '#FACC2C'} stroke="#0F1B2D" strokeWidth={2 / k} />
        <circle cx={x} cy={y} r={r * 3.2} fill="transparent" />
      </g>
    );
  };
  const halo = { textShadow: '0 0 4px #fff, 0 0 4px #fff, 0 0 8px #fff' } as const;

  return (
    <section id="footprint" className="theme-light relative overflow-hidden border-b border-fg/10 bg-surface2 py-[70px]">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Global Infrastructure</p>
            <h2 className="sec-title">Delivery <em className="accent">Footprint</em></h2>
            <p className="sec-desc sec-desc-line">Connected global delivery hubs serving Tier-1 clients across India, Europe, USA, and the Middle East.</p>
          </div>
          <div className="flex gap-2 rounded-full border border-fg/15 p-1">
            {(['world', 'india'] as const).map((v) => (
              <button key={v} onClick={() => go(v)} aria-pressed={view === v && !zoomed} className={`rounded-full px-5 py-2 text-[13px] font-bold transition ${view === v && !zoomed ? 'bg-ink text-white' : 'text-fg hover:bg-fg/5'}`}>{v === 'world' ? 'Global' : 'India hubs'}</button>
            ))}
          </div>
        </div>

        <div className="-mx-4 mt-9 overflow-x-auto px-4 pb-2 sm:mx-0 sm:overflow-visible sm:px-0">
          <div className="relative min-w-[720px] overflow-hidden rounded-[20px] border border-fg/10 bg-surface sm:min-w-0" style={{ boxShadow: '0 30px 70px rgba(15,27,45,.10)' }}>
            <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
              <svg viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} className="absolute inset-0 h-full w-full" role="img" aria-label="Map of FiveS delivery locations, with every desk connected to the India hub">
                <defs>
                  <radialGradient id="glowY"><stop offset="0" stopColor="#FACC2C" stopOpacity="0.85" /><stop offset="0.55" stopColor="#FACC2C" stopOpacity="0.28" /><stop offset="1" stopColor="#FACC2C" stopOpacity="0" /></radialGradient>
                  <radialGradient id="glowB"><stop offset="0" stopColor="#2F8FDB" stopOpacity="0.85" /><stop offset="0.55" stopColor="#2F8FDB" stopOpacity="0.28" /><stop offset="1" stopColor="#2F8FDB" stopOpacity="0" /></radialGradient>
                  <radialGradient id="glowHub"><stop offset="0" stopColor="#FACC2C" stopOpacity="0.55" /><stop offset="0.6" stopColor="#FACC2C" stopOpacity="0.16" /><stop offset="1" stopColor="#FACC2C" stopOpacity="0" /></radialGradient>
                </defs>
                <g opacity={1 - z * 0.85}>
                  {world.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.9 / Math.sqrt(k)} fill="#C3CEDC" />)}
                </g>
                {/* a soft halo makes India the centre of the picture */}
                <circle cx={cx} cy={cy} r={95} fill="url(#glowHub)" opacity={1 - z} />
                <g>
                  {india.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={0.75 + (1 - z) * 0.5} fill={z > 0.5 ? '#8FA3BD' : '#F0B90B'} />)}
                </g>

                {/* every desk feeds into India: arcs run desk → hub, with a pulse travelling toward India */}
                <g opacity={1 - z}>
                  {intl.map((l, i) => {
                    const [x, y] = P(l.lon, l.lat);
                    const mx = (origin[0] + x) / 2, my = Math.min(origin[1], y) - Math.abs(origin[0] - x) * 0.24;
                    const on = hover === l.name || hover === '__india';
                    const d = `M${x},${y} Q${mx},${my} ${origin[0]},${origin[1]}`;
                    return (
                      <g key={l.name}>
                        <path d={d} fill="none" stroke="#E9A800" strokeOpacity={on ? 0.95 : 0.55} strokeWidth={on ? 2.4 : 1.5} vectorEffect="non-scaling-stroke" className="dash-flow" />
                        <circle r={3.4 / Math.sqrt(k)} fill="#FACC2C" stroke="#0F1B2D" strokeWidth={0.9 / Math.sqrt(k)}>
                          <animateMotion dur="3.6s" begin={`${-(i * 0.6)}s`} repeatCount="indefinite" path={d} />
                        </circle>
                      </g>
                    );
                  })}
                </g>

                {view !== 'india' && intl.map((l, i) => pin(l, false, i))}
                {view !== 'india' && (
                  <g onMouseEnter={() => setHover('__india')} onMouseLeave={() => setHover(null)} onClick={() => go('india')} style={{ cursor: 'pointer' }}>
                    <circle cx={origin[0]} cy={origin[1]} r={46 / Math.sqrt(k)} fill="url(#glowY)" className="pulse-glow" opacity={1 - z} />
                    <circle cx={origin[0]} cy={origin[1]} r={46 / Math.sqrt(k)} fill="url(#glowY)" className="pulse-glow" style={{ animationDelay: '1.3s' }} opacity={1 - z} />
                    {hubs.map((l) => { const [x, y] = PI(l.lon, l.lat); return <circle key={l.name} cx={x} cy={y} r={(l.flagship ? 5.2 : 3.4) / Math.sqrt(k)} fill="#FACC2C" stroke="#0F1B2D" strokeWidth={1.4 / Math.sqrt(k)} />; })}
                    <circle cx={cx} cy={cy} r={62} fill="transparent" />
                  </g>
                )}
                {view === 'india' && hubs.map((l, i) => pin(l, l.flagship, i))}
              </svg>

              {/* country names beside the desks */}
              {view !== 'india' && intl.map((l) => {
                const [x, y] = P(l.lon, l.lat);
                const left = x > W * 0.82 || (x - vb.x) / vb.w > 0.86;
                return <span key={l.name} className={`pointer-events-none absolute -translate-y-1/2 text-[11.5px] font-extrabold tracking-wide text-fg ${left ? '-translate-x-full pr-3.5' : 'pl-3.5'}`} style={{ ...pct(x, y), ...halo }}>{country[l.name]}</span>;
              })}
              {/* India hub label */}
              {view !== 'india' && (
                <div className="pointer-events-none absolute -translate-x-full -translate-y-1/2 pr-[30px] text-right" style={{ ...pct(origin[0], origin[1]), opacity: 1 - z, ...halo }}>
                  <p className="text-[15px] font-black leading-none tracking-[0.12em] text-fg">INDIA</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#946900]">Delivery hub</p>
                </div>
              )}
              {/* labels for India hubs */}
              {view === 'india' && z > 0.6 && hubs.map((l) => {
                const [x, y] = PI(l.lon, l.lat);
                return <span key={l.name} className="pointer-events-none absolute -translate-y-1/2 pl-4 text-[12px] font-bold text-fg" style={{ ...pct(x, y), ...halo }}>{l.name}</span>;
              })}

              {/* tooltip */}
              {(hovered || clusterHover) && !zoomed && (() => {
                const [x, y] = hovered ? proj2(hovered) : [origin[0], origin[1]];
                const pos = pct(x, y);
                const right = parseFloat(pos.left) > 62;
                return (
                  <div className="theme-dark pointer-events-none absolute z-10 w-[250px] rounded-2xl border border-fg/15 bg-surface/95 p-4 shadow-2xl backdrop-blur"
                    style={{ ...pos, transform: `translate(${right ? '-100%' : '-12%'}, calc(-100% - 18px))` }}>
                    {hovered ? (
                      <>
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: hovered.region === 'india' ? '#FACC2C' : '#7CC6FF' }}>{hovered.region === 'india' ? 'India hub' : 'International desk'}</p>
                        <p className="mt-1 pr-8 text-[17px] font-bold">{hovered.name}</p>
                        <p className="text-[13px] font-semibold text-fg/85">{hovered.role}</p>
                        <p className="mt-2 text-[12.5px] leading-snug text-muted">{hovered.detail}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-acc">India · 7 delivery centres</p>
                        <p className="mt-2 pr-8 text-[12.5px] leading-snug text-muted">{hubs.map((h) => h.name).join(' · ')}</p>
                      </>
                    )}
                    <span className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-sun text-ink"><ZoomGlyph /></span>
                  </div>
                );
              })()}

              {/* back to the full map once the camera has flown in */}
              {zoomed && (
                <button onClick={() => go(view)} aria-label="Back to the full map" className="theme-dark absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-surface/85 text-fg shadow-lg backdrop-blur transition hover:bg-surface">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></svg>
                </button>
              )}

              <div className="theme-dark absolute bottom-4 left-4 flex items-center gap-4 rounded-full bg-surface/80 px-4 py-2 font-mono text-[11px] backdrop-blur">
                <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-sun" />India hubs</span>
                <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#2F8FDB]" />Global desks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ZoomGlyph() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m20 20-4.8-4.8M10.5 8v5M8 10.5h5" /></svg>;
}
