/* FiveS Digital — shared behaviour: card tilt + agent chat demo */
(function () {
  var fine = window.matchMedia && matchMedia('(hover:hover) and (pointer:fine)').matches;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (fine && !reduce) {
    document.querySelectorAll('.tilt').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.classList.add('is-tilting');
        el.style.transform = 'perspective(900px) rotateX(' + ((.5 - y) * 9).toFixed(2) + 'deg) rotateY(' + ((x - .5) * 11).toFixed(2) + 'deg) translateY(-4px)';
        el.style.setProperty('--mx', (x * 100) + '%'); el.style.setProperty('--my', (y * 100) + '%');
      });
      el.addEventListener('mouseleave', function () { el.classList.remove('is-tilting'); el.style.transform = ''; });
    });
  }
  var SCRIPTS = {
    shop: { name: 'Maya', role: 'D2C support agent', hue: '#FACC2C',
      opener: ['Hi, I’m Maya. I can answer most order questions instantly.', 'Try one of these.'],
      replies: [
        { q: 'Where is my order?', a: ['I check the carrier feed live and share the status and ETA, then offer to message you on WhatsApp when it moves.'] },
        { q: 'I need to return an item', a: ['I confirm eligibility, book the pickup and start the refund in the same conversation.'] },
        { q: 'Sale-day spike?', a: ['Teams scale 2–3x in 7–10 days, and routine queries stay with AI so humans handle the complex ones.'] } ] },
    maya: { name: 'Maya', role: 'CommX voice & chat agent', hue: '#FACC2C',
      opener: ['Hi, I’m Maya from FiveS. I can resolve most customer queries in the customer’s own language.', 'What would you like to see?'],
      replies: [
        { q: 'Which languages?', a: ['15+ languages across voice and chat, including regional Indian dialects, with a human specialist one tap away.'] },
        { q: 'Where does it work?', a: ['Voice, web chat, WhatsApp and email, all sharing one conversation history so customers never repeat themselves.'] },
        { q: 'When do humans step in?', a: ['Sensitive or low-confidence cases escalate to a trained specialist in under 400 ms, with the full context attached.'] } ] },
    arjun: { name: 'Arjun', role: 'AssistX agent copilot', hue: '#7CC6FF',
      opener: ['Hi, I’m Arjun, the live copilot that sits beside your agents.', 'Ask me what I do during a call.'],
      replies: [
        { q: 'What do you suggest?', a: ['Next-best response, knowledge-base answers and compliance prompts appear in real time while the agent talks.'] },
        { q: 'Does it cut handle time?', a: ['Yes. Agents stop searching and start resolving, so handle time and ramp-up time both drop.'] },
        { q: 'Is it auditable?', a: ['Every suggestion and accepted action is logged, so QA and compliance can trace what was said and why.'] } ] }
  };
  document.querySelectorAll('[data-chat]').forEach(function (root) {
    var s = SCRIPTS[root.getAttribute('data-chat')]; if (!s) return;
    var log = root.querySelector('.chat-log'), chips = root.querySelector('.chat-chips'), st = root.querySelector('.st');
    var used = {}, busy = false, timers = [], started = false;
    function add(t, who) { var d = document.createElement('div'); d.className = 'm ' + (who === 'u' ? 'u' : 'a'); d.textContent = t; if (who === 'u') d.style.background = s.hue; log.appendChild(d); log.scrollTop = 1e5; }
    function typing(on) { var t = log.querySelector('.ty'); if (on && !t) { t = document.createElement('div'); t.className = 'ty'; t.innerHTML = '<i></i><i></i><i></i>'; log.appendChild(t); } if (!on && t) t.remove(); st.textContent = on ? 'typing…' : 'online'; log.scrollTop = 1e5; }
    function say(lines, done) {
      busy = true; var d = 250;
      lines.forEach(function (l, i) {
        timers.push(setTimeout(function () { typing(true); }, d)); d += 600 + Math.min(l.length * 12, 800);
        timers.push(setTimeout(function () { typing(false); add(l, 'a'); if (i === lines.length - 1) { busy = false; if (done) done(); } }, d)); d += 180;
      });
    }
    function render() {
      chips.innerHTML = '';
      var left = s.replies.filter(function (r) { return !used[r.q]; });
      left.forEach(function (r) { var b = document.createElement('button'); b.textContent = r.q; b.disabled = busy; b.onclick = function () { if (busy) return; used[r.q] = 1; add(r.q, 'u'); say(r.a, render); render(); }; chips.appendChild(b); });
      if (!left.length) { var a = document.createElement('a'); a.className = 'cta'; a.href = 'index.html#contact'; a.textContent = 'Talk to a specialist →'; chips.appendChild(a); }
    }
    function start() { if (started) return; started = true; render(); say(s.opener, render); }
    if ('IntersectionObserver' in window) { new IntersectionObserver(function (e, o) { if (e[0].isIntersecting) { start(); o.disconnect(); } }, { threshold: .4 }).observe(root); } else start();
  });
})();
