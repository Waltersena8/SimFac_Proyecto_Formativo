// ── Catalog
  const catalog = [
    { id:1,  name:'Bandeja Paisa',       price:28000, emoji:'🍖' },
    { id:6,  name:'Ajiaco Bogotano',     price:22000, emoji:'🥣' },
    { id:8,  name:'Limonada de Coco',    price:8000,  emoji:'🥤' },
    { id:2,  name:'Cazuela de Mariscos', price:35000, emoji:'🐟' },
    { id:3,  name:'Arroz con Pollo',     price:24000, emoji:'🍚' },
    { id:4,  name:'Wrap de Pollo',       price:18000, emoji:'🫔' },
    { id:7,  name:'Sancocho Trifásico',  price:26000, emoji:'🍲' },
    { id:9,  name:'Jugo de Maracuyá',    price:7000,  emoji:'🧃' },
    { id:10, name:'Agua Panela',         price:4000,  emoji:'☕' },
    { id:11, name:'Pan de Bono',         price:3500,  emoji:'🧀' },
    { id:12, name:'Pandebono',           price:4000,  emoji:'🍞' },
  ];

  // ── Load from sessionStorage or use defaults
  let cart     = JSON.parse(sessionStorage.getItem('simfac_cart') || '{"1":{"qty":1,"note":""},"6":{"qty":2,"note":""},"8":{"qty":1,"note":"Poco azúcar"}}');
  const mesa   = sessionStorage.getItem('simfac_mesa')    || 'Mesa 4';
  const note   = sessionStorage.getItem('simfac_note')    || '';
  const total  = parseInt(sessionStorage.getItem('simfac_total') || '0') ||
    Object.keys(cart).reduce((s,id) => {
      const p = catalog.find(p => p.id === parseInt(id));
      return s + (p ? p.price * cart[id].qty : 0);
    }, 0);

  // ── Generate order number
  const orderNum = '#0' + (Math.floor(Math.random() * 50) + 30);
  document.getElementById('orderNum').textContent = orderNum;
  document.getElementById('detailMesa').textContent = mesa;

  // ── Render items
  const itemsEl = document.getElementById('detailItems');
  Object.keys(cart).forEach(id => {
    const p = catalog.find(p => p.id === parseInt(id));
    if (!p) return;
    const item = cart[id];
    const div = document.createElement('div');
    div.className = 'detail-item';
    div.innerHTML = `
      <div class="di-emoji">${p.emoji}</div>
      <div class="di-info">
        <div class="di-name">${p.name}</div>
        ${item.note ? `<div class="di-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>${item.note}</div>` : ''}
      </div>
      <div class="di-qty">× ${item.qty}</div>
      <div class="di-price">$${(p.price * item.qty).toLocaleString('es-CO')}</div>`;
    itemsEl.appendChild(div);
  });

  document.getElementById('detailTotal').textContent = `$${total.toLocaleString('es-CO')}`;

  // ── Note
  if (note) {
    document.getElementById('noteDisplay').style.display = 'flex';
    document.getElementById('noteText').textContent = note;
  }

  // ── Tracker line fill
  setTimeout(() => {
    document.getElementById('trackerLine').style.width = '33%';
  }, 400);

  // ── Countdown timer
  let seconds = 18 * 60;
  const cdEl = document.getElementById('countdownNum');
  const timerInterval = setInterval(() => {
    if (seconds <= 0) { clearInterval(timerInterval); cdEl.textContent = '00:00'; return; }
    seconds--;
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    cdEl.textContent = `${m}:${s}`;
  }, 1000);

  // ── Status updates simulation
  const updates = [
    { delay: 3000,  icon:'🔥', title:'¡Tu pedido ya está en cocina!', sub:'El equipo lo está preparando ahora mismo' },
    { delay: 9000,  icon:'👨‍🍳', title:'Cocinando tu pedido',           sub:'Todo va perfecto, ya casi está' },
    { delay: 16000, icon:'🍽️', title:'¡Tu pedido está casi listo!',   sub:'En unos minutos te lo llevamos' },
  ];

  updates.forEach(({ delay, icon, title, sub }) => {
    setTimeout(() => {
      document.getElementById('stIcon').textContent  = icon;
      document.getElementById('stTitle').textContent = title;
      document.getElementById('stSub').textContent   = sub;
      document.getElementById('statusToast').classList.add('show');
      setTimeout(() => document.getElementById('statusToast').classList.remove('show'), 4500);
    }, delay);
  });

  // Advance tracker at step 2
  setTimeout(() => {
    document.getElementById('trackerLine').style.width = '66%';
    document.getElementById('step-ready').classList.add('active');
    document.getElementById('lbl-ready').classList.add('active');
  }, 16000);

  function closeStatusToast() { document.getElementById('statusToast').classList.remove('show'); }

  // ── Share
  function shareOrder() {
    const items = Object.keys(cart).map(id => {
      const p = catalog.find(p => p.id === parseInt(id));
      return p ? `${p.emoji} ${p.name} × ${cart[id].qty}` : '';
    }).filter(Boolean).join('\n');
    const text = `🍽️ Mi pedido en La Fogata\n${mesa} · Pedido ${orderNum}\n\n${items}\n\nTotal: $${total.toLocaleString('es-CO')}\n\nMenuú digital por SimFac 🔗`;
    if (navigator.share) {
      navigator.share({ title: 'Mi pedido — La Fogata', text });
    } else {
      navigator.clipboard.writeText(text).catch(() => {});
      showMiniToast('📋 Resumen copiado');
    }
  }

  function showMiniToast(msg) {
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#1A1510;color:#F5EFE0;border-radius:100px;padding:.6rem 1.2rem;font-size:.83rem;font-weight:500;z-index:300;white-space:nowrap;box-shadow:0 8px 24px rgba(0,0,0,.3);border:1px solid rgba(245,166,35,.2);';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
  }

  // ── CONFETTI
  const canvas = document.getElementById('confettiCanvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = Math.min(window.innerWidth, 480);
  canvas.height = window.innerHeight;

  const COLORS = ['#F5A623','#FBBF24','#4ADE80','#E8522A','#F5EFE0','#60A5FA'];
  const pieces = Array.from({ length: 80 }, () => ({
    x:   Math.random() * canvas.width,
    y:   Math.random() * -canvas.height,
    w:   Math.random() * 10 + 4,
    h:   Math.random() * 5  + 2,
    col: COLORS[Math.floor(Math.random() * COLORS.length)],
    rot: Math.random() * Math.PI * 2,
    vx:  (Math.random() - .5) * 2,
    vy:  Math.random() * 3 + 1.5,
    vr:  (Math.random() - .5) * .15,
    opacity: Math.random() * .6 + .4,
  }));

  let animFrame;
  let confettiDone = false;
  function animConfetti() {
    if (confettiDone) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let allOut = true;
    pieces.forEach(p => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.rot += p.vr;
      if (p.y < canvas.height + 20) allOut = false;
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.col;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (allOut) { confettiDone = true; ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
    animFrame = requestAnimationFrame(animConfetti);
  }
  setTimeout(animConfetti, 300);
  setTimeout(() => { confettiDone = true; cancelAnimationFrame(animFrame); ctx.clearRect(0, 0, canvas.width, canvas.height); }, 4000);
