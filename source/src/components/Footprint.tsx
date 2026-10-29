import { useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { geoNaturalEarth1, geoMercator } from 'd3-geo';
import dots from '../data/mapDots.json';
import { locations, type Location } from '../data/site';

const W = 1000, H = 520, RATIO = H / W;

export default function Footprint() {
  const proj = useMemo(() => geoNaturalEarth1().fitSize([W, H], { type: 'MultiPoint', coordinates: [[-168, -55], [178, 76], [0, 76], [0, -55]] } as any), []);
  const P = (lon: number, lat: number) => proj([lon, lat]) as [number, number];
  const world = useMemo(() => (dots.world as number[][]).map(([lo, la]) => P(lo, la)), [proj]);
  // India gets its own north-up Mercator so it isn't sheared by the world projection, anchored where it sits on the world map
  const projIn = useMemo(() => geoMercator().center([82.5, 22.5]).scale(proj.scale() * 1.0).translate(proj([82.5, 22.5]) as [number, number]), [proj]);
  const PI = (lon: number, lat: number) => projIn([lon, lat]) as [number, number];
  const india = useMemo(() => (dots.india as number[][]).map(([lo, la]) => PI(lo, la)), [projIn]);
  const indiaBox = useMemo(() => {
    const xs = india.map((p) => p[0]), ys = india.map((p) => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const h = (y1 - y0) * 1.25, w = Math.max(h / RATIO, (x1 - x0) * 1.3);
    return { x: (x0 + x1) / 2 - w / 2, y: (y0 + y1) / 2 - (w * RATIO) / 2, w, h: w * RATIO };
  }, [india]);

  const [vb, setVb] = useState({ x: 0, y: 0, w: W, h: H });
  const [view, setView] = useState<'world' | 'india'>('world');
  const [hover, setHover] = useState<string | null>(null);
  const box = useRef({ ...vb });

  const go = (v: 'world' | 'india') => {
    setView(v); setHover(null);
    const t = v === 'india' ? indiaBox : { x: 0, y: 0, w: W, h: H };
    gsap.to(box.current, { ...t, duration: 1.2, ease: 'power3.inOut', onUpdate: () => setVb({ ...box.current }) });
  };

  const k = W / vb.w; // zoom factor
  const z = Math.min(1, Math.max(0, (k - 1) / 3)); // 0 world → 1 india
  const origin = P(73.71, 24.58);
  const intl = locations.filter((l) => l.region === 'intl');
  const hubs = locations.filter((l) => l.region === 'india');
  const pct = (x: number, y: number) => ({ left: `${((x - vb.x) / vb.w) * 100}%`, top: `${((y - vb.y) / vb.h) * 100}%` });
  const hovered = locations.find((l) => l.name === hover);
  const clusterHover = hover === '__india';

  const Pin = ({ l, flagship, i = 0 }: { l: Location; flagship?: boolean; i?: number }) => {
    const [x, y] = (l.region === 'india' && view === 'india' ? PI : P)(l.lon, l.lat);
    const r = (flagship ? 7 : 5.5) / k;
    const col = l.region === 'india' ? '#FACC2C' : '#2F8FDB';
    return (
      <g onMouseEnter={() => setHover(l.name)} onMouseLeave={() => setHover(null)} onClick={() => setHover(l.name)} style={{ cursor: 'pointer' }}>
        <circle cx={x} cy={y} r={r * 4.2} fill={l.region === 'india' ? 'url(#glowY)' : 'url(#glowB)'} className="pulse-glow" style={{ animationDelay: `${(i * 0.55) % 2.6}s` }} />
        <circle cx={x} cy={y} r={r * 4.2} fill={l.region === 'india' ? 'url(#glowY)' : 'url(#glowB)'} className="pulse-glow" style={{ animationDelay: `${((i * 0.55) % 2.6) + 1.3}s` }} />
        <circle cx={x} cy={y} r={r} fill={col} stroke="#0F1B2D" strokeWidth={2 / k} />
        <circle cx={x} cy={y} r={r * 3} fill="transparent" />
      </g>
    );
  };

  return (
    <section id="footprint" className="theme-light relative overflow-hidden bg-surface py-24 md:py-32">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[640px]">
            <p className="eyebrow">Global Infrastructure</p>
            <h2 className="h-display mt-5 text-[40px] sm:whitespace-nowrap sm:text-[clamp(34px,4.2vw,54px)]">Delivery <em className="accent">Footprint</em></h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-muted">Connected global delivery hubs serving Tier-1 clients across India, Europe, USA, and the Middle East.</p>
          </div>
          <div className="flex gap-2 rounded-full border border-fg/15 p-1">
            {(['world', 'india'] as const).map((v) => (
              <button key={v} onClick={() => go(v)} aria-pressed={view === v} className={`rounded-full px-5 py-2 text-[13px] font-bold transition ${view === v ? 'bg-ink text-white' : 'text-fg hover:bg-fg/5'}`}>{v === 'world' ? 'Global' : 'India hubs'}</button>
            ))}
          </div>
        </div>

        <div className="-mx-4 mt-12 overflow-x-auto px-4 pb-2 sm:mx-0 sm:overflow-visible sm:px-0">
          <div className="relative min-w-[720px] overflow-hidden rounded-[28px] border border-fg/10 bg-surface2 sm:min-w-0" style={{ boxShadow: '0 30px 70px rgba(15,27,45,.10)' }}>
            <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
              <svg viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} className="absolute inset-0 h-full w-full" role="img" aria-label="Map of FiveS delivery locations">
                <defs>
                  <radialGradient id="glowY"><stop offset="0" stopColor="#FACC2C" stopOpacity="0.85" /><stop offset="0.55" stopColor="#FACC2C" stopOpacity="0.28" /><stop offset="1" stopColor="#FACC2C" stopOpacity="0" /></radialGradient>
                  <radialGradient id="glowB"><stop offset="0" stopColor="#2F8FDB" stopOpacity="0.85" /><stop offset="0.55" stopColor="#2F8FDB" stopOpacity="0.28" /><stop offset="1" stopColor="#2F8FDB" stopOpacity="0" /></radialGradient>
                </defs>
                <g opacity={1 - z * 0.85}>
                  {world.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.9} fill="#C3CEDC" />)}
                </g>
                <g opacity={Math.min(1, z * 1.8)}>
                  {india.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={0.75} fill={z > 0.5 ? '#8FA3BD' : '#AFBDCF'} />)}
                </g>
                {/* arcs from Udaipur */}
                <g opacity={1 - z}>
                  {intl.map((l) => {
                    const [x, y] = P(l.lon, l.lat);
                    const mx = (origin[0] + x) / 2, my = Math.min(origin[1], y) - Math.abs(origin[0] - x) * 0.22;
                    const on = hover === l.name;
                    return <path key={l.name} d={`M${origin[0]},${origin[1]} Q${mx},${my} ${x},${y}`} fill="none" stroke={on ? '#E9A800' : '#0F1B2D'} strokeOpacity={on ? 0.95 : 0.3} strokeWidth={on ? 1.8 : 1.1} className="dash-flow" />;
                  })}
                </g>
                {view === 'world' && intl.map((l, i) => <Pin key={l.name} l={l} i={i} />)}
                {view === 'world' && z < 0.2 && (
                  <g onMouseEnter={() => setHover('__india')} onMouseLeave={() => setHover(null)} onClick={() => go('india')} style={{ cursor: 'pointer' }}>
                    <circle cx={origin[0] + 6} cy={origin[1] + 14} r={44} fill="url(#glowY)" className="pulse-glow" />
                    <circle cx={origin[0] + 6} cy={origin[1] + 14} r={44} fill="url(#glowY)" className="pulse-glow" style={{ animationDelay: '1.3s' }} />
                    <circle cx={origin[0] + 6} cy={origin[1] + 14} r={13} fill="#FACC2C" stroke="#070D18" strokeWidth={2} />
                    <text x={origin[0] + 6} y={origin[1] + 18.5} textAnchor="middle" fontSize="13" fontWeight="800" fill="#070D18" style={{ fontFamily: 'Inter, sans-serif' }}>7</text>
                  </g>
                )}
                {view === 'india' && z > 0.6 && hubs.map((l, i) => <Pin key={l.name} l={l} flagship={l.flagship} i={i} />)}
              </svg>

              {/* labels for India hubs */}
              {view === 'india' && z > 0.6 && hubs.map((l) => {
                const [x, y] = PI(l.lon, l.lat);
                return <span key={l.name} className="pointer-events-none absolute -translate-y-1/2 pl-4 text-[12px] font-bold text-fg" style={pct(x, y)}>{l.name}</span>;
              })}

              {/* tooltip */}
              {(hovered || clusterHover) && (() => {
                const [x, y] = hovered ? (hovered.region === 'india' && view === 'india' ? PI : P)(hovered.lon, hovered.lat) : [origin[0] + 6, origin[1] + 14];
                const pos = pct(x, y);
                const right = parseFloat(pos.left) > 62;
                return (
                  <div className="theme-dark pointer-events-none absolute z-10 w-[250px] -translate-y-[calc(100%+18px)] rounded-2xl border border-fg/15 bg-surface/95 p-4 shadow-2xl backdrop-blur"
                    style={{ ...pos, transform: `translate(${right ? '-100%' : '-12%'}, calc(-100% - 18px))` }}>
                    {hovered ? (
                      <>
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: hovered.region === 'india' ? '#FACC2C' : '#7CC6FF' }}>{hovered.region === 'india' ? 'India hub' : 'International desk'}</p>
                        <p className="mt-1 text-[17px] font-bold">{hovered.name}</p>
                        <p className="text-[13px] font-semibold text-fg/85">{hovered.role}</p>
                        <p className="mt-2 text-[12.5px] leading-snug text-muted">{hovered.detail}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-acc">India · 7 delivery centres</p>
                        <p className="mt-2 text-[12.5px] leading-snug text-muted">{hubs.map((h) => h.name).join(' · ')}</p>
                        <p className="mt-2 text-[12px] font-bold text-acc">Click to zoom in →</p>
                      </>
                    )}
                  </div>
                );
              })()}

              <div className="theme-dark absolute bottom-4 left-4 flex items-center gap-4 rounded-full bg-surface/80 px-4 py-2 font-mono text-[11px] backdrop-blur">
                <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-sun" />India hubs</span>
                <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#2F8FDB]" />Global desks</span>
                <span className="hidden text-muted2 sm:inline">Hover a pin for details</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
