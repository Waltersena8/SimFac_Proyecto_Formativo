// ── Orders data
  let orders = [
    { id:'#036', mesa:4,  status:'pend', time:'12:45', elapsed:3,  items:[{e:'🍖',n:'Bandeja Paisa',q:1,p:28000},{e:'🥤',n:'Limonada de Coco',q:2,p:8000}],  note:''  },
    { id:'#035', mesa:7,  status:'pend', time:'12:42', elapsed:6,  items:[{e:'🐟',n:'Cazuela de Mariscos',q:2,p:35000}],  note:'Sin cebolla por favor' },
    { id:'#034', mesa:2,  status:'pend', time:'12:40', elapsed:8,  items:[{e:'🍚',n:'Arroz con Pollo',q:1,p:24000},{e:'🧃',n:'Jugo Maracuyá',q:1,p:7000}],  note:'' },
    { id:'#033', mesa:9,  status:'prep', time:'12:35', elapsed:13, items:[{e:'🥣',n:'Ajiaco Bogotano',q:1,p:22000},{e:'☕',n:'Agua Panela',q:1,p:4000}],  note:'' },
    { id:'#032', mesa:5,  status:'prep', time:'12:30', elapsed:18, items:[{e:'🫔',n:'Wrap de Pollo',q:2,p:18000},{e:'🧃',n:'Jugo Natural',q:2,p:7000}],  note:'Extra salsa' },
    { id:'#031', mesa:1,  status:'done', time:'12:20', elapsed:28, items:[{e:'🍲',n:'Sancocho',q:1,p:26000}], note:'' },
    { id:'#030', mesa:3,  status:'done', time:'12:10', elapsed:38, items:[{e:'🍖',n:'Bandeja Paisa',q:2,p:28000}], note:'' },
    { id:'#029', mesa:6,  status:'done', time:'12:00', elapsed:48, items:[{e:'🥗',n:'Ensalada César',q:1,p:16000},{e:'☕',n:'Agua Panela',q:1,p:4000}], note:'' },
    { id:'#028', mesa:8,  status:'done', time:'11:50', elapsed:58, items:[{e:'🐟',n:'Cazuela Mariscos',q:1,p:35000}], note:'' },
    { id:'#027', mesa:10, status:'done', time:'11:40', elapsed:68, items:[{e:'🍞',n:'Pan de Bono x4',q:4,p:3500},{e:'🥤',n:'Limonada',q:1,p:8000}], note:'' },
    { id:'#026', mesa:2,  status:'done', time:'11:30', elapsed:78, items:[{e:'🍚',n:'Arroz con Pollo',q:2,p:24000}], note:'' },
    { id:'#025', mesa:4,  status:'done', time:'11:20', elapsed:88, items:[{e:'🥣',n:'Ajiaco',q:1,p:22000},{e:'🥤',n:'Limonada',q:1,p:8000}], note:'' },
  ];

  let activeModal = null;
  let nextId = 37;

  function getTotal(o) { return o.items.reduce((s,i) => s + i.p * i.q, 0); }

  const statusMeta = {
    pend: { cls:'sp-pend', label:'Pendiente',      next:'prep', nextLabel:'Pasar a preparación', col:'col-pend' },
    prep: { cls:'sp-prep', label:'En preparación', next:'done', nextLabel:'Marcar entregado',    col:'col-prep' },
    done: { cls:'sp-done', label:'Entregado',      next:null,   nextLabel:'',                   col:'col-done' },
  };

  // ── Render kanban
  function renderKanban() {
    ['pend','prep','done'].forEach(s => {
      const col   = document.getElementById('col-' + s);
      const badge = document.getElementById('kc-'  + s);
      const list  = orders.filter(o => o.status === s);
      badge.textContent = list.length;
      col.innerHTML = '';

      if (!list.length) {
        col.innerHTML = `<div class="col-empty"><div class="col-empty-icon">${s==='pend'?'⏳':s==='prep'?'🔥':'✅'}</div><div>Sin pedidos aquí</div></div>`;
        return;
      }

      list.forEach((o, i) => {
        const isUrgent = (s === 'pend' && o.elapsed > 7) || (s === 'prep' && o.elapsed > 20);
        const div = document.createElement('div');
        div.className = 'order-card' + (isUrgent ? ' urgent' : '');
        div.style.animationDelay = (i * 0.06) + 's';
        div.onclick = () => openModal(o.id);

        const timeClass = o.elapsed > 20 ? 'late' : o.elapsed > 10 ? '' : '';
        const itemsHTML = o.items.map(it => `<div class="oc-item">${it.e} ${it.n}${it.q > 1 ? ` × ${it.q}` : ''}</div>`).join('');

        let actionsHTML = '';
        if (s === 'pend') {
          actionsHTML = `
            <button class="oc-btn btn-advance" onclick="advance('${o.id}',event)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              Preparar
            </button>
            <button class="oc-btn btn-cancel" onclick="cancelOrder('${o.id}',event)">✕</button>`;
        } else if (s === 'prep') {
          actionsHTML = `
            <button class="oc-btn btn-done" onclick="advance('${o.id}',event)">✅ Entregado</button>
            <button class="oc-btn btn-revert" onclick="revert('${o.id}',event)">↩</button>`;
        } else {
          actionsHTML = `<button class="oc-btn btn-revert" onclick="revert('${o.id}',event)">↩ Revertir</button>`;
        }

        div.innerHTML = `
          <div class="oc-top">
            <div class="oc-id">${o.id}</div>
            <div class="oc-mesa">Mesa ${o.mesa}</div>
            <div class="oc-time ${timeClass}">${o.elapsed} min</div>
          </div>
          <div class="oc-items">${itemsHTML}</div>
          <div class="oc-footer">
            <div class="oc-total">$${getTotal(o).toLocaleString('es-CO')}</div>
            <div class="oc-actions">${actionsHTML}</div>
          </div>`;

        col.appendChild(div);
      });
    });
    updateStats();
    renderTimers();
    renderHistory();
    renderDonut();
  }

  // ── Advance / revert
  function advance(id, e) {
    e && e.stopPropagation();
    const o = orders.find(o => o.id === id);
    if (!o || !statusMeta[o.status].next) return;
    const prev = o.status;
    o.status = statusMeta[prev].next;
    renderKanban();
    showToast(`Pedido ${id} → ${statusMeta[o.status].label}`);
  }

  function revert(id, e) {
    e && e.stopPropagation();
    const o = orders.find(o => o.id === id);
    if (!o) return;
    if (o.status === 'prep') o.status = 'pend';
    else if (o.status === 'done') o.status = 'prep';
    renderKanban();
    showToast(`Pedido ${id} revertido`);
  }

  function cancelOrder(id, e) {
    e && e.stopPropagation();
    orders = orders.filter(o => o.id !== id);
    renderKanban();
    showToast(`Pedido ${id} cancelado`, 'info');
  }

  // ── Stats
  function updateStats() {
    const pend = orders.filter(o => o.status === 'pend').length;
    const prep = orders.filter(o => o.status === 'prep').length;
    const done = orders.filter(o => o.status === 'done').length;
    document.getElementById('cntPend').textContent  = pend;
    document.getElementById('cntPrep').textContent  = prep;
    document.getElementById('cntDone').textContent  = done;
    document.getElementById('cntTotal').textContent = orders.length;
    document.getElementById('sidebarBadge').textContent = pend;
    document.getElementById('lgPend').textContent = pend;
    document.getElementById('lgPrep').textContent = prep;
    document.getElementById('lgDone').textContent = done;
    document.getElementById('donutTotal').textContent = orders.length;
  }

  // ── Donut
  function renderDonut() {
    const total = orders.length || 1;
    const circ  = 239;
    const done  = orders.filter(o => o.status === 'done').length;
    const prep  = orders.filter(o => o.status === 'prep').length;
    const pend  = orders.filter(o => o.status === 'pend').length;
    const doneArc = (done/total)*circ;
    const prepArc = (prep/total)*circ;
    const pendArc = (pend/total)*circ;
    document.getElementById('donutDone').style.strokeDashoffset = circ - doneArc;
    document.getElementById('donutPrep').style.strokeDashoffset = circ - prepArc;
    document.getElementById('donutPend').style.strokeDashoffset = circ - pendArc;
  }

  // ── Timers
  function renderTimers() {
    const active = orders.filter(o => o.status === 'pend' || o.status === 'prep');
    const list = document.getElementById('timerList');
    list.innerHTML = '';
    if (!active.length) {
      list.innerHTML = '<div class="col-empty" style="padding:1.2rem"><div class="col-empty-icon">🕐</div><div>Sin pedidos activos</div></div>';
      return;
    }
    active.forEach(o => {
      const cls = o.elapsed > 20 ? 'te-late' : o.elapsed > 10 ? 'te-warn' : 'te-ok';
      const row = document.createElement('div');
      row.className = 'timer-item';
      row.innerHTML = `
        <div class="timer-id">${o.id}</div>
        <div class="timer-mesa">Mesa ${o.mesa} · ${statusMeta[o.status].label}</div>
        <div class="timer-elapsed ${cls}">${o.elapsed} min</div>`;
      list.appendChild(row);
    });
  }

  // ── History table
  function renderHistory() {
    const tbody = document.getElementById('histBody');
    tbody.innerHTML = '';
    [...orders].reverse().forEach((o, i) => {
      const { cls, label } = statusMeta[o.status];
      const tr = document.createElement('tr');
      tr.style.opacity = '0';
      tr.style.animation = `card-in .35s ease forwards ${i * 0.04}s`;
      tr.onclick = () => openModal(o.id);
      tr.innerHTML = `
        <td style="font-weight:600;color:var(--cream)">${o.id}</td>
        <td><span style="background:rgba(245,166,35,0.1);color:var(--amber);padding:.15rem .5rem;border-radius:100px;font-size:.7rem;font-weight:500;">Mesa ${o.mesa}</span></td>
        <td style="color:var(--muted);font-size:.8rem">${o.items.map(i=>i.n).join(', ')}</td>
        <td style="font-weight:600;color:var(--amber)">$${getTotal(o).toLocaleString('es-CO')}</td>
        <td style="color:var(--muted)">${o.time}</td>
        <td><span class="status-pill ${cls}">${label}</span></td>`;
      tbody.appendChild(tr);
    });
  }

  renderKanban();
  setTimeout(renderDonut, 300);

  // ── Modal
  function openModal(id) {
    const o = orders.find(o => o.id === id);
    if (!o) return;
    activeModal = id;
    document.getElementById('omId').textContent = o.id;
    document.getElementById('omMesa').textContent = `Mesa ${o.mesa}`;
    const { cls, label } = statusMeta[o.status];
    document.getElementById('omStatusPill').innerHTML = `<span class="status-pill ${cls}">${label}</span>`;
    document.getElementById('omStatusSelect').value = o.status;

    const itemsEl = document.getElementById('omItems');
    itemsEl.innerHTML = '';
    o.items.forEach(it => {
      const div = document.createElement('div');
      div.className = 'om-item';
      div.innerHTML = `
        <div class="om-item-emoji">${it.e}</div>
        <div class="om-item-name">${it.n}</div>
        <div class="om-item-qty">× ${it.q}</div>
        <div class="om-item-price">$${(it.p * it.q).toLocaleString('es-CO')}</div>`;
      itemsEl.appendChild(div);
    });

    document.getElementById('omTotal').textContent = `$${getTotal(o).toLocaleString('es-CO')}`;

    const noteEl = document.getElementById('omNote');
    if (o.note) { noteEl.style.display = 'flex'; document.getElementById('omNoteText').textContent = o.note; }
    else { noteEl.style.display = 'none'; }

    const nextLabel = statusMeta[o.status].nextLabel;
    const advBtn = document.getElementById('omAdvanceBtn');
    if (nextLabel) { advBtn.style.display = 'flex'; document.getElementById('omAdvanceText').textContent = nextLabel; }
    else { advBtn.style.display = 'none'; }

    document.getElementById('orderModal').classList.add('open');
  }

  function closeModal() {
    document.getElementById('orderModal').classList.remove('open');
    activeModal = null;
  }

  function updateModalStatus() {
    if (!activeModal) return;
    const o = orders.find(o => o.id === activeModal);
    if (!o) return;
    o.status = document.getElementById('omStatusSelect').value;
    renderKanban();
    closeModal();
    showToast(`Pedido ${o.id} → ${statusMeta[o.status].label}`);
  }

  function advanceFromModal() {
    if (!activeModal) return;
    advance(activeModal, null);
    closeModal();
  }

  document.getElementById('orderModal').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });

  // ── New order simulation
  function showNewOrder() {
    const mesa = Math.floor(Math.random() * 10) + 1;
    const qty  = Math.floor(Math.random() * 3) + 1;
    document.getElementById('notifSub').textContent = `Mesa ${mesa} · ${qty} producto${qty>1?'s':''}`;
    const notif = document.getElementById('newOrderNotif');
    notif.classList.add('show');

    const newOrder = {
      id: '#0' + nextId++, mesa, status: 'pend',
      time: new Date().toLocaleTimeString('es-CO', {hour:'2-digit',minute:'2-digit'}),
      elapsed: 0,
      items: [{e:'🍖', n:'Bandeja Paisa', q:qty, p:28000}],
      note: ''
    };
    orders.unshift(newOrder);
    renderKanban();
    showToast(`¡Nuevo pedido de Mesa ${mesa}!`);
    setTimeout(() => notif.classList.remove('show'), 5000);
  }

  function closeNotif() { document.getElementById('newOrderNotif').classList.remove('show'); }

  // ── Toast
  let toastTimer;
  function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    toast.className = `toast ${type}`;
    void toast.offsetWidth;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // ── Sidebar mobile
  function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('show');
  }

  // ── Simulate elapsed time ticking
  setInterval(() => {
    orders.filter(o => o.status !== 'done').forEach(o => o.elapsed++);
    renderTimers();
  }, 60000);
