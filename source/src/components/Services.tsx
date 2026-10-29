import { useRef, useState } from 'react';
import { services } from '../data/site';
import AgentChat, { AgentAvatar } from './AgentChat';
import voiceImg from '../assets/voice_cx.jpg';
import peopleImg from '../assets/inclusive_workplace.jpg';

function Visual({ id, hue }: { id: string; hue: string }) {
  if (id === 'voice') {
    return (
      <div className="relative h-full w-full">
        <img src={voiceImg} alt="Voice specialist on a live call" className="h-full w-full object-cover" />
        <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-surface/80 px-4 py-3 backdrop-blur">
          <div className="flex h-7 items-end gap-[3px]">
            {Array.from({ length: 14 }).map((_, i) => <span key={i} className="wave-bar w-[3px] rounded-full" style={{ height: 28, background: hue, animationDelay: `${(i % 5) * 0.12}s` }} />)}
          </div>
          <div><p className="text-[12px] font-bold">Live call · Marathi</p><p className="text-[11px] text-leaf">Sentiment: positive</p></div>
        </div>
      </div>
    );
  }
  if (id === 'nonvoice') {
    const rows = [['WhatsApp', 'Where is my order #4821?', 'Bot resolved · 12s'], ['Email', 'Refund not received yet', 'Routed to specialist'], ['Web chat', 'Change delivery address', 'Bot resolved · 20s'], ['Instagram DM', 'Product arrived damaged', 'Specialist · priority']];
    return (
      <div className="flex h-full w-full flex-col justify-center gap-3 bg-gradient-to-br from-ink-3 to-ink p-6">
        {rows.map(([ch, q, s], i) => (
          <div key={i} className="flex items-center gap-3 rounded-2xl border border-fg/10 bg-surface/70 p-3" style={{ transform: `translateX(${i % 2 ? 18 : 0}px)` }}>
            <span className="rounded-lg px-2 py-1 font-mono text-[10px] font-bold text-ink" style={{ background: hue }}>{ch}</span>
            <span className="min-w-0 flex-1 truncate text-[13px]">{q}</span>
            <span className={`whitespace-nowrap text-[11px] ${s.startsWith('Bot') ? 'text-leaf' : 'text-acc'}`}>{s}</span>
          </div>
        ))}
      </div>
    );
  }
  if (id === 'genai') {
    return (
      <div className="grid h-full w-full content-center gap-3 bg-gradient-to-br from-ink-3 to-ink p-6 sm:p-8">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: hue }}>How RLHF works</p>
          <p className="mt-1 max-w-[46ch] text-[13px] leading-snug text-muted">The model writes two answers to the same prompt. Our raters compare them, and the one they prefer is used to train the model.</p>
        </div>
        <div className="rounded-xl border border-fg/10 bg-fg/[0.04] px-4 py-2.5 text-[13px]"><span className="text-muted2">Prompt · </span>Explain EMI to a first-time borrower in Hindi</div>
        {[['A', 'Uses simple Hindi, gives a worked example and flags late-fee risk.', true], ['B', 'Mixes English jargon, skips the example and misses the risk note.', false]].map(([k, t, win]) => (
          <div key={k as string} className="rounded-2xl border p-4 transition" style={{ borderColor: win ? hue : 'rgba(255,255,255,.12)', background: win ? `${hue}14` : 'transparent', opacity: win ? 1 : 0.75 }}>
            <div className="flex items-center justify-between gap-3"><b className="text-[13px]">Answer {k as string}</b>{win ? <span className="rounded-full px-2 py-0.5 text-[11px] font-bold text-ink" style={{ background: hue }}>Chosen by 4 of 5 raters</span> : <span className="rounded-full border border-fg/15 px-2 py-0.5 text-[11px] text-muted2">Not chosen</span>}</div>
            <p className="mt-2 text-[13px] text-muted">{t as string}</p>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="relative h-full w-full">
      <img src={peopleImg} alt="Office scene used as an annotation sample" className="h-full w-full object-cover" />
      {[[3, 33, 26, 60, 'person 0.98'], [70, 42, 28, 56, 'person 0.97'], [51, 52, 16, 22, 'laptop 0.95'], [46, 17, 14, 40, 'person 0.96']].map(([l, t, w, h, lb], i) => (
        <div key={i} className="absolute border-2" style={{ left: `${l}%`, top: `${t}%`, width: `${w}%`, height: `${h}%`, borderColor: hue }}>
          <span className="absolute -top-5 left-[-2px] whitespace-nowrap px-1.5 font-mono text-[10px] font-bold text-ink" style={{ background: hue }}>{lb as string}</span>
        </div>
      ))}
    </div>
  );
}

export default function Services() {
  const [tab, setTab] = useState(0);
  const [chat, setChat] = useState(false);
  const [peek, setPeek] = useState(false);
  const peekTimer = useRef<number>();
  const s = services[tab];

  return (
    <section id="services" className="theme-light relative bg-surface2 py-24 md:py-32">
      <div className="wrap">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-6">
          <div>
            <p className="eyebrow">Core Capabilities</p>
            <h2 className="h-display mt-5 text-[40px] leading-[1.12] sm:whitespace-nowrap sm:text-[clamp(34px,4.2vw,54px)]">Comprehensive <em className="accent">BPM Services</em></h2>
          </div>
          <div className="max-w-[470px]"><p className="text-[15.5px] leading-relaxed text-muted">Delivering end-to-end customer experience, voice, non-voice digital triage, and human-led data annotation workflows.</p><p className="mt-3 inline-flex items-center gap-2 rounded-full border border-fg/10 bg-surface px-3 py-1.5 text-[12px] font-semibold text-fg"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sun opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-sun" /></span>Pick a service, then call or chat with its agent</p></div>
        </div>

        <div className="mt-12 grid gap-2 sm:grid-cols-2 lg:grid-cols-4" role="tablist">
          {services.map((x, i) => (
            <button key={x.id} role="tab" aria-selected={tab === i} onClick={() => { setTab(i); setChat(false); }}
              className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition duration-300 hover:-translate-y-0.5 ${tab === i ? '-translate-y-0.5 border-ink bg-ink text-white shadow-[0_16px_30px_rgba(15,27,45,.28)] [&_*]:!text-white' : 'border-fg/10 bg-surface hover:border-sun hover:shadow-[0_12px_24px_rgba(15,27,45,.10)]'}`}>
              <AgentAvatar name={x.agent.name} hue={x.agent.hue} size={36} />
              <span className="min-w-0">
                <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{x.kicker}</span>
                <span className="block text-[14px] font-bold leading-tight">{x.title}</span>
              </span>
            </button>
          ))}
        </div>

        <div
          className="relative mt-4 grid overflow-hidden rounded-[28px] border border-fg/10 bg-surface shadow-[0_24px_60px_rgba(15,27,45,.08)] lg:grid-cols-[1fr_1.1fr]"
          onMouseEnter={() => { peekTimer.current = window.setTimeout(() => setPeek(true), 350); }}
          onMouseLeave={() => { clearTimeout(peekTimer.current); setPeek(false); }}
          onDoubleClick={() => setChat(true)}
        >
          <div className="min-w-0 p-7 sm:p-10">
            <span className="chip border-transparent text-ink" style={{ background: s.agent.hue }}>{s.kicker}</span>
            <h3 className="h-display mt-5 text-[34px] sm:text-[40px]">{s.title}</h3>
            <p className="mt-4 max-w-[52ch] text-[16px] leading-relaxed text-muted">{s.desc}</p>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {s.metrics.map((m) => (
                <div key={m.lbl} className="min-w-0 rounded-2xl border border-fg/10 bg-surface2 p-4">
                  <p className="font-mono text-[22px] font-bold tabular-nums text-fg sm:text-[26px]">{m.num}</p><span className="mt-2 block h-[3px] w-8 rounded-full" style={{ background: s.agent.hue }} />
                  <p className="mt-1 text-[12px] leading-snug text-muted2">{m.lbl}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setChat(true)} className="mt-8 flex items-center gap-3 rounded-full border border-fg/15 py-2 pl-2 pr-5 transition hover:border-fg/40">
              <AgentAvatar name={s.agent.name} hue={s.agent.hue} size={36} talking={peek && !chat} />
              <span className="flex items-center gap-2 text-[14px] font-semibold">{s.agent.mode === 'call' ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/></svg> : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}{s.agent.action}</span>
            </button>
          </div>

          <div className="theme-dark relative min-h-[380px] overflow-hidden bg-surface lg:min-h-[480px]">
            <Visual id={s.id} hue={s.agent.hue} />
            {/* peeking agent */}
            {!chat && (
              <button onClick={() => setChat(true)}
                className={`theme-dark absolute right-5 top-5 flex items-center gap-3 rounded-full bg-surface/85 py-2 pl-2 pr-4 backdrop-blur transition-all duration-500 ${peek ? 'translate-y-0 opacity-100' : 'lg:-translate-y-3 lg:opacity-0'}`}>
                <AgentAvatar name={s.agent.name} hue={s.agent.hue} size={34} talking />
                <span className="text-left"><span className="block text-[13px] font-bold">Hi, I’m {s.agent.name}</span><span className="block text-[11px] text-muted2">{s.agent.hint}</span></span>
              </button>
            )}
            {chat && (
              <div className="absolute inset-3 sm:inset-auto sm:bottom-4 sm:right-4 sm:top-4 sm:w-[360px]">
                <AgentChat service={s} onClose={() => setChat(false)} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
