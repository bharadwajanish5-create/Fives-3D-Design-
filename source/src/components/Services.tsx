import { useRef, useState } from 'react';
import { services } from '../data/site';
import AgentChat, { AgentAvatar } from './AgentChat';
import voiceImg from '../assets/voice_cx.jpg';
import peopleImg from '../assets/inclusive_workplace.jpg';
import nonvoiceImg from '../assets/nonvoice_cx.jpg';
import genaiImg from '../assets/genai_lab.jpg';

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
    const rows: [string, string, string][] = [['WhatsApp', 'Where is my order #4821?', 'Bot resolved · 12s'], ['Email', 'Refund not received yet', 'Routed to specialist'], ['Web chat', 'Change delivery address', 'Bot resolved · 20s']];
    return (
      <div className="relative h-full w-full">
        <img src={nonvoiceImg} alt="Digital support team working across chat and email" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
        <div className="theme-dark absolute bottom-4 left-4 right-4 grid gap-2 sm:right-auto sm:w-[330px]">
          {rows.map(([ch, q, st], i) => (
            <div key={i} className="flex items-center gap-2.5 rounded-xl border border-fg/10 bg-surface/85 px-3 py-2 backdrop-blur" style={{ transform: `translateX(${i % 2 ? 14 : 0}px)` }}>
              <span className="rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold text-ink" style={{ background: hue }}>{ch}</span>
              <span className="min-w-0 flex-1 truncate text-[12px] text-fg">{q}</span>
              <span className={`whitespace-nowrap text-[10.5px] ${st.startsWith('Bot') ? 'text-leaf' : 'text-acc'}`}>{st}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (id === 'genai') {
    return (
      <div className="relative h-full w-full">
        <img src={genaiImg} alt="Specialists reviewing AI model answers in a bright office" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
        <div className="theme-dark absolute bottom-4 left-4 right-4 rounded-2xl border border-fg/10 bg-surface/90 p-3.5 backdrop-blur sm:right-auto sm:w-[360px]">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.12em]" style={{ color: hue }}>How RLHF works</p>
          <p className="mt-1 text-[12px] leading-snug text-muted">The model writes two answers. Our raters pick the better one, and that choice trains the model.</p>
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            {[['A', 'Simple Hindi, worked example', true], ['B', 'English jargon, no example', false]].map(([k, t, win]) => (
              <div key={k as string} className="rounded-xl border px-2.5 py-2" style={{ borderColor: win ? hue : 'rgba(255,255,255,.14)', background: win ? `${hue}1f` : 'transparent', opacity: win ? 1 : 0.7 }}>
                <p className="flex items-center justify-between text-[11.5px] font-bold">Answer {k as string}<span className="text-[10px]" style={{ color: win ? hue : undefined }}>{win ? '✓ chosen' : 'not chosen'}</span></p>
                <p className="mt-0.5 text-[11px] text-muted">{t as string}</p>
              </div>
            ))}
          </div>
        </div>
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
    <section id="services" className="theme-light relative border-b border-fg/10 bg-surface py-[70px]">
      <div className="wrap">
        <p className="eyebrow">Core Capabilities</p>
        <h2 className="sec-title">Comprehensive <em className="accent">BPM Services</em></h2>
        <p className="sec-desc">Delivering end-to-end customer experience, voice, non-voice digital triage, and human-led data annotation workflows.</p>

        <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" role="tablist">
          {services.map((x, i) => (
            <button key={x.id} role="tab" aria-selected={tab === i} onClick={() => { setTab(i); setChat(false); }}
              className={`rounded-xl border-[1.5px] px-4 py-3.5 text-left text-[14px] font-extrabold leading-tight transition duration-300 ${tab === i ? 'border-ink bg-ink text-white shadow-[0_6px_18px_rgba(15,27,45,.15)]' : 'border-fg/10 bg-surface2 text-fg hover:border-sun hover:bg-[#FFFDF5]'}`}>
              {x.title}
            </button>
          ))}
        </div>

        <div
          className="mt-7 grid gap-10 rounded-[20px] border-[1.5px] border-fg/10 bg-surface2 p-6 sm:p-[38px_40px] lg:grid-cols-[1.2fr_0.8fr] lg:items-center"
          onMouseEnter={() => { peekTimer.current = window.setTimeout(() => setPeek(true), 350); }}
          onMouseLeave={() => { clearTimeout(peekTimer.current); setPeek(false); }}
          onDoubleClick={() => setChat(true)}
        >
          <div className="min-w-0">
            <span className="inline-flex rounded-md px-3 py-1 text-[12px] font-extrabold text-[#946900]" style={{ background: 'rgba(250,204,44,.2)' }}>{s.badge}</span>
            <h3 className="mt-3 text-[26px] font-extrabold leading-[1.3] text-fg">{s.title}</h3>
            <p className="mt-2 max-w-[56ch] text-[14.5px] leading-[1.65] text-muted">{s.desc}</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {s.metrics.map((m) => (
                <div key={m.lbl} className="min-w-0 rounded-[10px] border border-fg/10 bg-surface px-3.5 py-3">
                  <p className="text-[22px] font-black leading-[1.1] text-acc">{m.num}</p>
                  <p className="mt-[3px] text-[11.5px] font-semibold leading-snug text-muted2">{m.lbl}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setChat(true)} className="mt-6 flex items-center gap-3 rounded-full border border-fg/15 bg-surface py-2 pl-2 pr-5 transition hover:border-fg/40">
              <AgentAvatar name={s.agent.name} hue={s.agent.hue} size={36} talking={peek && !chat} />
              <span className="flex items-center gap-2 text-[14px] font-semibold">{s.agent.mode === 'call' ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/></svg> : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}{s.agent.action}</span>
            </button>
          </div>

          <div className="theme-dark relative overflow-hidden rounded-2xl border border-fg/10 bg-surface shadow-[0_12px_28px_rgba(15,27,45,.08)] transition-[height] duration-500" style={{ height: chat ? 500 : 310 }}>
            <Visual id={s.id} hue={s.agent.hue} />
            {!chat && (
              <button onClick={() => setChat(true)}
                className={`theme-dark absolute right-4 top-4 flex items-center gap-3 rounded-full bg-surface/85 py-2 pl-2 pr-4 backdrop-blur transition-all duration-500 ${peek ? 'translate-y-0 opacity-100' : 'lg:-translate-y-3 lg:opacity-0'}`}>
                <AgentAvatar name={s.agent.name} hue={s.agent.hue} size={34} talking />
                <span className="text-left"><span className="block text-[13px] font-bold">Hi, I’m {s.agent.name}</span><span className="block text-[11px] text-muted2">{s.agent.hint}</span></span>
              </button>
            )}
            {chat && (
              <div className="absolute inset-3">
                <AgentChat service={s} onClose={() => setChat(false)} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
