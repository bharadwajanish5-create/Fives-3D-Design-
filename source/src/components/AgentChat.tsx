import { useEffect, useRef, useState } from 'react';
import type { Service } from '../data/site';

type Msg = { from: 'agent' | 'user'; text: string };

export function AgentAvatar({ name, hue, size = 44, talking = false }: { name: string; hue: string; size?: number; talking?: boolean }) {
  return (
    <span
      className="relative inline-grid shrink-0 place-items-center rounded-full font-bold text-ink"
      style={{ width: size, height: size, background: `radial-gradient(circle at 32% 28%, #fff 0, ${hue} 38%, ${hue} 60%, rgba(0,0,0,.35) 120%)`, boxShadow: `0 0 0 3px rgba(15,27,45,1), 0 0 0 4px ${hue}66, 0 10px 30px ${hue}55`, fontSize: size * 0.38 }}
      aria-hidden
    >
      {name[0]}
      {talking && <span className="absolute -inset-1 animate-ping rounded-full" style={{ border: `1px solid ${hue}` }} />}
      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-ink bg-leaf" />
    </span>
  );
}

function useConversation(service: Service) {
  const { agent } = service;
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [used, setUsed] = useState<string[]>([]);
  const timers = useRef<number[]>([]);
  const say = (lines: string[]) => {
    let delay = 250;
    lines.forEach((t, idx) => {
      timers.current.push(window.setTimeout(() => setTyping(true), delay));
      delay += 650 + Math.min(t.length * 14, 900);
      timers.current.push(window.setTimeout(() => { setTyping(idx < lines.length - 1); setMsgs((m) => [...m, { from: 'agent', text: t }]); }, delay));
      delay += 200;
    });
  };
  useEffect(() => {
    setMsgs([]); setUsed([]);
    say(agent.opener);
    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service.id]);
  const ask = (q: string, a: string[]) => { setUsed((u) => [...u, q]); setMsgs((m) => [...m, { from: 'user', text: q }]); say(a); };
  return { msgs, typing, ask, remaining: agent.replies.filter((r) => !used.includes(r.q)) };
}

export default function AgentChat({ service, onClose }: { service: Service; onClose: () => void }) {
  const { agent } = service;
  const { msgs, typing, ask, remaining } = useConversation(service);
  const scroller = useRef<HTMLDivElement>(null);
  const [secs, setSecs] = useState(0);
  const isCall = agent.mode === 'call';
  useEffect(() => { scroller.current?.scrollTo({ top: 99999, behavior: 'smooth' }); }, [msgs, typing]);
  useEffect(() => { if (!isCall) return; const t = window.setInterval(() => setSecs((s) => s + 1), 1000); return () => clearInterval(t); }, [isCall]);
  const clock = `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;

  return (
    <div className="theme-dark flex h-full w-full flex-col overflow-hidden rounded-[22px] border border-fg/15 bg-surface/95 shadow-[0_30px_80px_rgba(0,0,0,.55)] backdrop-blur-xl" role="dialog" aria-label={`${isCall ? 'Call' : 'Chat'} with ${agent.name}`}>
      {isCall ? (
        <div className="flex flex-col items-center gap-2 border-b border-fg/10 px-4 pb-4 pt-5 text-center" style={{ background: `radial-gradient(260px 140px at 50% 0%, ${agent.hue}33, transparent)` }}>
          <AgentAvatar name={agent.name} hue={agent.hue} size={58} talking={typing} />
          <p className="mt-1 text-[15px] font-bold leading-tight">{agent.name} · {agent.role}</p>
          <p className="text-[12px] tabular-nums text-leaf">On call · {clock}</p>
          <div className="flex h-6 items-end gap-[3px]" aria-hidden>
            {Array.from({ length: 22 }).map((_, i) => <span key={i} className={typing ? 'wave-bar' : ''} style={{ width: 3, height: 24, borderRadius: 2, background: agent.hue, opacity: typing ? 1 : 0.35, transform: typing ? undefined : 'scaleY(.25)', animationDelay: `${(i % 6) * 0.08}s` }} />)}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 border-b border-fg/10 px-4 py-3">
          <AgentAvatar name={agent.name} hue={agent.hue} size={36} talking={typing} />
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-bold leading-tight">{agent.name}</p>
            <p className="text-[12px] text-muted2">{agent.role} · {typing ? 'typing…' : 'online'}</p>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full border border-fg/15 text-muted hover:bg-fg/10" aria-label="Close chat">✕</button>
        </div>
      )}

      <div ref={scroller} className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-4 py-4">
        {isCall && <p className="text-center text-[10px] font-bold uppercase tracking-[0.14em] text-muted3">Live transcript</p>}
        {msgs.map((m, i) => isCall ? (
          <p key={i} className="text-[13.5px] leading-snug"><b className="mr-1.5" style={{ color: m.from === 'agent' ? agent.hue : '#fff' }}>{m.from === 'agent' ? agent.name : 'You'}:</b><span className="text-muted">{m.text}</span></p>
        ) : (
          <div key={i} className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-snug ${m.from === 'agent' ? 'self-start rounded-bl-md bg-surface3 text-fg' : 'self-end rounded-br-md text-ink'}`} style={m.from === 'user' ? { background: agent.hue } : undefined}>{m.text}</div>
        ))}
        {typing && !isCall && <div className="typing flex w-max gap-1 self-start rounded-2xl rounded-bl-md bg-surface3 px-3.5 py-3 text-fg"><span /><span /><span /></div>}
        {typing && isCall && <p className="text-[12px] italic text-muted3">{agent.name} is speaking…</p>}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-fg/10 px-4 py-3">
        {remaining.length ? remaining.map((r) => (
          <button key={r.q} disabled={typing} onClick={() => ask(r.q, r.a)} className="chip border-fg/20 text-fg hover:border-fg/50 disabled:opacity-40">{isCall ? `Ask: ${r.q}` : r.q}</button>
        )) : (
          <a href="#contact" className="chip border-transparent text-ink" style={{ background: agent.hue }}>Talk to a specialist →</a>
        )}
        {isCall && <button onClick={onClose} className="ml-auto inline-flex items-center gap-2 rounded-full bg-[#E5484D] px-4 py-2 text-[13px] font-bold text-white hover:bg-[#d13c41]">End call</button>}
      </div>
    </div>
  );
}
