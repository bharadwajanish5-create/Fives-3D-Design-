import { useEffect, useRef, useState } from 'react';
import { pathways } from '../data/site';
import { submitLead, type Lead } from '../lib/leads';

type Msg = { from: 'agent' | 'user'; text: string };
type Step = 'pathway' | 'interest' | 'name' | 'email' | 'company' | 'message' | 'review' | 'done';

const HUE = '#FACC2C';

function Orb({ talking }: { talking: boolean }) {
  return (
    <div className="relative grid h-[200px] w-[200px] place-items-center sm:h-[240px] sm:w-[240px]">
      <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 34% 28%, #FFF6CF 0, #FACC2C 34%, #E9A800 70%, #8A5E00 110%)', boxShadow: '0 40px 120px rgba(250,204,44,.35), inset -20px -30px 60px rgba(120,70,0,.4)' }} />
      <div className="absolute inset-[-14px] rounded-full border border-dashed border-fg/20" style={{ animation: 'spin 40s linear infinite' }} />
      <div className="relative flex h-16 items-center gap-[5px]">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className={talking ? 'wave-bar' : ''} style={{ width: 6, height: [22, 40, 58, 36, 64, 40, 52, 30, 20][i], borderRadius: 4, background: '#070D18', animationDelay: `${i * 0.09}s`, transform: talking ? undefined : 'scaleY(.45)' }} />
        ))}
      </div>
      <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
    </div>
  );
}

export default function Contact() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [step, setStep] = useState<Step>('pathway');
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [lead, setLead] = useState<Lead>({ pathway: '', interest: '', name: '', email: '', company: '', message: '' });
  const [preview, setPreview] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { scroller.current?.scrollTo({ top: 99999, behavior: 'smooth' }); }, [msgs, typing, step]);
  useEffect(() => { if (open && ['name', 'email', 'company', 'message'].includes(step) && !typing) inputRef.current?.focus({ preventScroll: true }); }, [step, typing, open]);

  const agentSay = (lines: string[], next?: Step) => {
    setTyping(true);
    let d = 0;
    lines.forEach((t, i) => {
      d += 550 + Math.min(t.length * 10, 700);
      window.setTimeout(() => { setMsgs((m) => [...m, { from: 'agent', text: t }]); if (i === lines.length - 1) { setTyping(false); if (next) setStep(next); } }, d);
    });
  };

  const start = (pathId?: string) => {
    setOpen(true);
    setMsgs([]); setStep('pathway'); setLead({ pathway: '', interest: '', name: '', email: '', company: '', message: '' });
    if (pathId) {
      const p = pathways.find((x) => x.id === pathId)!;
      setLead((l) => ({ ...l, pathway: p.label }));
      setMsgs([{ from: 'user', text: p.label }]);
      agentSay(['Hi, I’m Sahaya from FiveS. Great, let’s get you to the right team.', p.ask], 'interest');
    } else {
      agentSay(['Hi, I’m Sahaya from FiveS.', 'I’ll take a few details and pass them to the right team. What brings you here?'], 'pathway');
    }
  };

  const user = (text: string) => setMsgs((m) => [...m, { from: 'user', text }]);
  const pathway = pathways.find((p) => p.label === lead.pathway);

  const choosePath = (id: string) => {
    const p = pathways.find((x) => x.id === id)!;
    user(p.label); setLead((l) => ({ ...l, pathway: p.label })); setStep('interest');
    agentSay([p.ask], 'interest');
  };
  const chooseInterest = (o: string) => { user(o); setLead((l) => ({ ...l, interest: o })); agentSay(['Got it. What’s your name?'], 'name'); };

  const submitText = (e: React.FormEvent) => {
    e.preventDefault();
    const v = input.trim();
    setError('');
    if (step === 'name') {
      if (v.length < 2) return setError('Please enter your name.');
      user(v); setLead((l) => ({ ...l, name: v })); setInput('');
      agentSay([`Nice to meet you, ${v.split(' ')[0]}. Which email should the team reply to?`], 'email');
    } else if (step === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return setError('That email looks incomplete. Check for a missing @ or domain.');
      user(v); setLead((l) => ({ ...l, email: v })); setInput('');
      agentSay([lead.pathway === 'Careers' ? 'Which city are you based in?' : 'And the company you’re with?'], 'company');
    } else if (step === 'company') {
      if (v.length < 2) return setError('Please add a short answer.');
      user(v); setLead((l) => ({ ...l, company: v })); setInput('');
      agentSay(['Anything you’d like the team to know before they call? You can skip this.'], 'message');
    } else if (step === 'message') {
      user(v || 'Skip'); setLead((l) => ({ ...l, message: v })); setInput('');
      agentSay(['Here’s what I’ll send. Check it over.'], 'review');
    }
  };

  const send = async () => {
    const r = await submitLead(lead);
    setPreview(r.preview); setStep('done');
    agentSay([`Thanks, ${lead.name.split(' ')[0]}. The ${lead.pathway.toLowerCase()} team will reply to ${lead.email} within one business day.`], 'done');
  };

  const placeholder: Partial<Record<Step, string>> = { name: 'Your full name', email: 'name@company.com', company: lead.pathway === 'Careers' ? 'City' : 'Company name', message: 'Optional note' };

  return (
    <section id="contact" className="theme-dark relative overflow-hidden py-24 md:py-32" style={{ background: 'linear-gradient(135deg, #0A1322 0%, #0F1B2D 55%, #16253B 100%)' }}>
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(700px 500px at 20% 40%, rgba(250,204,44,.14), transparent 65%)' }} />
      <div className="wrap relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="min-w-0">
          <p className="eyebrow">Start your transformation</p>
          <h2 className="h-display mt-5 text-[40px] sm:text-[54px]">Skip the form. <em className="accent">Talk to Sahaya.</em></h2>
          <p className="mt-5 max-w-[460px] text-[16px] leading-relaxed text-muted">Our intake agent takes your details in under a minute and routes them to sales, careers or partnerships.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {pathways.map((p) => (
              <button key={p.id} onClick={() => start(p.id)} className="group rounded-2xl border border-fg/12 bg-fg/[0.03] p-4 text-left transition hover:-translate-y-1 hover:border-sun/70">
                <span className="block text-[15px] font-bold">{p.label}</span>
                <span className="mt-1 block select-all break-all font-mono text-[11px] text-muted2">{p.email}</span>
                <span className="mt-3 block text-[13px] font-semibold text-acc">Start →</span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative grid min-h-[520px] place-items-center">
          {!open ? (
            <button onClick={() => start()} className="group grid place-items-center gap-6 text-center" aria-label="Start a conversation with Sahaya">
              <div className="transition duration-500 group-hover:scale-105"><Orb talking={false} /></div>
              <span className="rounded-full border border-fg/20 bg-surface/70 px-6 py-3 text-[15px] font-bold backdrop-blur transition group-hover:border-sun group-hover:text-acc">Click to talk to Sahaya</span>
            </button>
          ) : (
            <div className="flex h-[560px] w-full max-w-[520px] flex-col overflow-hidden rounded-[26px] border border-fg/15 bg-surface/90 shadow-[0_40px_100px_rgba(0,0,0,.55)] backdrop-blur-xl">
              <div className="flex items-center gap-3 border-b border-fg/10 px-5 py-4">
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${typing ? 'animate-pulse' : ''}`} style={{ background: 'radial-gradient(circle at 34% 28%, #FFF6CF 0, #FACC2C 40%, #C98F00 100%)', boxShadow: '0 8px 24px rgba(250,204,44,.35)' }}>
                  <span className="flex h-4 items-center gap-[2px]">{[8, 14, 10, 16, 9].map((h, i) => <i key={i} className={typing ? 'wave-bar' : ''} style={{ width: 2.5, height: h, background: '#070D18', borderRadius: 2, animationDelay: `${i * 0.1}s` }} />)}</span>
                </span>
                <div className="flex-1">
                  <p className="text-[15px] font-bold">Sahaya</p>
                  <p className="text-[12px] text-muted2">FiveS intake agent · {typing ? 'typing…' : 'online'}</p>
                </div>
                <button onClick={() => start()} className="rounded-full border border-fg/15 px-3 py-1.5 text-[12px] text-muted hover:bg-fg/10">Restart</button>
              </div>

              <div ref={scroller} className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-5 py-5">
                {msgs.map((m, i) => (
                  <div key={i} className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] leading-snug ${m.from === 'agent' ? 'self-start rounded-bl-md bg-surface3' : 'self-end rounded-br-md font-semibold text-ink'}`} style={m.from === 'user' ? { background: HUE } : undefined}>{m.text}</div>
                ))}
                {typing && <div className="typing flex w-max gap-1 self-start rounded-2xl rounded-bl-md bg-surface3 px-4 py-3"><span /><span /><span /></div>}
                {!typing && step === 'review' && (
                  <div className="mt-1 self-stretch rounded-2xl border border-sun/40 bg-sun/[0.06] p-4 text-[13.5px]">
                    {([['Pathway', lead.pathway], ['Interest', lead.interest], ['Name', lead.name], ['Email', lead.email], [lead.pathway === 'Careers' ? 'City' : 'Company', lead.company], ['Note', lead.message || '—']] as const).map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4 border-b border-fg/10 py-1.5 last:border-0"><span className="text-muted2">{k}</span><span className="min-w-0 truncate text-right font-semibold">{v}</span></div>
                    ))}
                    <div className="mt-3 flex gap-2">
                      <button onClick={send} className="btn-sun !py-2.5 !text-[14px]">Send to FiveS</button>
                      <button onClick={() => start()} className="btn-ghost !py-2.5 !text-[14px]">Start over</button>
                    </div>
                  </div>
                )}
                {!typing && step === 'done' && preview && <p className="mt-2 self-center font-mono text-[11px] text-muted3">Design prototype: details are not sent anywhere.</p>}
              </div>

              <div className="border-t border-fg/10 px-5 py-4">
                {!typing && step === 'pathway' && <div className="flex flex-wrap gap-2">{pathways.map((p) => <button key={p.id} onClick={() => choosePath(p.id)} className="chip border-fg/20 hover:border-sun hover:text-acc">{p.label}</button>)}</div>}
                {!typing && step === 'interest' && pathway && <div className="flex flex-wrap gap-2">{pathway.options.map((o) => <button key={o} onClick={() => chooseInterest(o)} className="chip border-fg/20 hover:border-sun hover:text-acc">{o}</button>)}</div>}
                {['name', 'email', 'company', 'message'].includes(step) && (
                  <form onSubmit={submitText} className="flex gap-2" noValidate>
                    <label htmlFor="intake-input" className="sr-only">{placeholder[step]}</label>
                    <input id="intake-input" ref={inputRef} disabled={typing} value={input} onChange={(e) => setInput(e.target.value)} type={step === 'email' ? 'email' : 'text'} placeholder={placeholder[step]}
                      className="min-w-0 flex-1 rounded-full border border-fg/15 bg-surface2 px-5 py-3 text-[14px] text-fg outline-none placeholder:text-muted3 focus:border-sun" />
                    <button disabled={typing} className="btn-sun !px-5 !py-3 !text-[14px] disabled:opacity-50">{step === 'message' && !input ? 'Skip' : 'Send'}</button>
                  </form>
                )}
                {error && <p className="mt-2 text-[12.5px] text-ember">{error}</p>}
                {(typing || step === 'review' || step === 'done') && !error && <p className="text-center font-mono text-[11px] text-muted3">{step === 'done' ? 'Conversation complete' : 'Sahaya is guiding you'}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
