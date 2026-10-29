import { useEffect, useRef, useState } from 'react';
import type { Service } from '../data/site';

type Msg = { from: 'agent' | 'user'; text: string };

export function AgentAvatar({ name, hue, size = 44, talking = false }: { name: string; hue: string; size?: number; talking?: boolean }) {
  return (
    <span
      className="relative inline-grid shrink-0 place-items-center rounded-full font-bold text-ink"
      style={{ width: size, height: size, background: `radial-gradient(circle at 32% 28%, #fff 0, ${hue} 38%, ${hue} 60%, rgba(0,0,0,.35) 120%)`, boxShadow: `0 0 0 3px rgba(7,13,24,1), 0 0 0 4px ${hue}66, 0 10px 30px ${hue}55`, fontSize: size * 0.38 }}
      aria-hidden
    >
      {name[0]}
      {talking && <span className="absolute -inset-1 animate-ping rounded-full" style={{ border: `1px solid ${hue}` }} />}
      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-ink bg-leaf" />
    </span>
  );
}

export default function AgentChat({ service, onClose }: { service: Service; onClose: () => void }) {
  const { agent } = service;
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [used, setUsed] = useState<string[]>([]);
  const scroller = useRef<HTMLDivElement>(null);
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

  useEffect(() => { scroller.current?.scrollTo({ top: 99999, behavior: 'smooth' }); }, [msgs, typing]);

  const ask = (q: string, a: string[]) => {
    setUsed((u) => [...u, q]);
    setMsgs((m) => [...m, { from: 'user', text: q }]);
    say(a);
  };

  const remaining = agent.replies.filter((r) => !used.includes(r.q));

  return (
    <div className="theme-dark flex h-full w-full flex-col overflow-hidden rounded-[22px] border border-fg/15 bg-surface/95 shadow-[0_30px_80px_rgba(0,0,0,.55)] backdrop-blur-xl" role="dialog" aria-label={`Chat with ${agent.name}`}>
      <div className="flex items-center gap-3 border-b border-fg/10 px-4 py-3">
        <AgentAvatar name={agent.name} hue={agent.hue} size={36} talking={typing} />
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-bold leading-tight">{agent.name}</p>
          <p className="text-[12px] text-muted2">{agent.role} · {typing ? 'typing…' : 'online'}</p>
        </div>
        <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full border border-fg/15 text-muted hover:bg-fg/10" aria-label="Close chat">✕</button>
      </div>
      <div ref={scroller} className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-4 py-4">
        {msgs.map((m, i) => (
          <div key={i} className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-snug ${m.from === 'agent' ? 'self-start rounded-bl-md bg-surface3 text-fg' : 'self-end rounded-br-md text-ink'}`} style={m.from === 'user' ? { background: agent.hue } : undefined}>
            {m.text}
          </div>
        ))}
        {typing && <div className="typing flex w-max gap-1 self-start rounded-2xl rounded-bl-md bg-surface3 px-3.5 py-3 text-fg"><span /><span /><span /></div>}
      </div>
      <div className="flex flex-wrap gap-2 border-t border-fg/10 px-4 py-3">
        {remaining.length ? remaining.map((r) => (
          <button key={r.q} disabled={typing} onClick={() => ask(r.q, r.a)} className="chip border-fg/20 text-fg hover:border-fg/50 disabled:opacity-40">{r.q}</button>
        )) : (
          <a href="#contact" className="chip border-transparent text-ink" style={{ background: agent.hue }}>Talk to a specialist →</a>
        )}
      </div>
    </div>
  );
}
