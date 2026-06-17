// ── Date
  const d = new Date();
  const days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  document.getElementById('currentDate').textContent =
    `${days[d.getDay()]}, ${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;

  // ── Greeting
  const h = d.getHours();
  const greet = h < 12 ? '¡Buenos días' : h < 18 ? '¡Buenas tardes' : '¡Buenas noches';
  document.querySelector('.greeting h1').innerHTML = `${greet},<br><em>La Fogata!</em> 👋`;

  // ── Count-up animation
  function countUp(id, target, prefix='', suffix='') {
    const el = document.getElementById(id);
    let cur = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = prefix + cur.toLocaleString('es-CO') + suffix;
      if (cur >= target) clearInterval(timer);
    }, 30);
  }
  setTimeout(() => {
    countUp('countPedidos', 12);
    countUp('countProductos', 12);
    countUp('countPend', 3);
    countUp('countVisitas', 87);
  }, 300);

  // ── Orders data
  const orders = [
    { id: '#036', mesa: 4,  items: 'Bandeja Paisa, Limonada de Coco', total: '$36.000', status: 'pend' },
    { id: '#035', mesa: 7,  items: 'Cazuela de Mariscos × 2',         total: '$70.000', status: 'prep' },
    { id: '#034', mesa: 2,  items: 'Arroz con Pollo, Jugo Natural',    total: '$29.000', status: 'prep' },
    { id: '#033', mesa: 1,  items: 'Ajiaco, Agua Panela',             total: '$22.000', status: 'done' },
    { id: '#032', mesa: 5,  items: 'Wrap Pollo × 2, Jugo × 2',        total: '$52.000', status: 'done' },
    { id: '#031', mesa: 9,  items: 'Sopa del Día, Pan',               total: '$15.000', status: 'done' },
  ];

  const statusMeta = {
    pend: { cls: 'sp-pend', label: 'Pendiente' },
    prep: { cls: 'sp-prep', label: 'En preparación' },
    done: { cls: 'sp-done', label: 'Entregado' },
  };

  const tbody = document.getElementById('ordersBody');
  orders.forEach((o, i) => {
    const { cls, label } = statusMeta[o.status];
    const tr = document.createElement('tr');
    tr.style.opacity = '0';
    tr.style.animation = `card-in .4s ease forwards ${i * 0.07 + 0.2}s`;
    tr.innerHTML = `
      <td><span class="order-id">${o.id}</span></td>
      <td><span class="order-table-tag">Mesa ${o.mesa}</span></td>
      <td><span class="order-items-list">${o.items}</span></td>
      <td><span class="order-total-val">${o.total}</span></td>
      <td>
        <select class="status-select ${cls}" onchange="changeStatus(this, ${i})" style="background:transparent; color:inherit;">
          <option value="pend" ${o.status==='pend'?'selected':''}>⏳ Pendiente</option>
          <option value="prep" ${o.status==='prep'?'selected':''}>🔥 En preparación</option>
          <option value="done" ${o.status==='done'?'selected':''}>✅ Entregado</option>
        </select>
      </td>
      <td>
        <button class="action-dots" title="Opciones">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="19" r="1" fill="currentColor"/></svg>
        </button>
      </td>`;
    tbody.appendChild(tr);
  });

  function changeStatus(sel, idx) {
    const s = sel.value;
    const { cls } = statusMeta[s];
    sel.className = `status-select ${cls}`;
  }

  // ── Chart
  const chartData = [
    { day: 'Lun', val: 5 },
    { day: 'Mar', val: 9 },
    { day: 'Mié', val: 7 },
    { day: 'Jue', val: 11 },
    { day: 'Vie', val: 14 },
    { day: 'Sáb', val: 18 },
    { day: 'Hoy', val: 12, today: true },
  ];
  const maxVal = Math.max(...chartData.map(d => d.val));
  const chartEl = document.getElementById('chartBars');
  chartData.forEach(({ day, val, today }) => {
    const pct = Math.round((val / maxVal) * 100);
    const col = document.createElement('div');
    col.className = 'bar-col';
    col.innerHTML = `
      <div class="bar ${today?'today':''}" style="height:${pct}%; min-height:4px;" title="${val} pedidos"></div>
      <div class="bar-day ${today?'today':''}">${day}</div>`;
    chartEl.appendChild(col);
  });

  // ── Products
  const products = [
    { emoji: '🍖', name: 'Bandeja Paisa',        cat: 'Platos fuertes', price: '$28.000', active: true },
    { emoji: '🐟', name: 'Cazuela de Mariscos',  cat: 'Platos fuertes', price: '$35.000', active: true },
    { emoji: '🥤', name: 'Limonada de Coco',     cat: 'Bebidas',        price: '$8.000',  active: true },
    { emoji: '🥘', name: 'Ajiaco Bogotano',      cat: 'Sopas',          price: '$22.000', active: true },
    { emoji: '🍞', name: 'Pan de Bono',           cat: 'Panadería',      price: '$4.000',  active: false },
  ];
  const prodList = document.getElementById('productsList');
  products.forEach(p => {
    const row = document.createElement('div');
    row.className = 'product-row';
    row.innerHTML = `
      <div class="prod-emoji">${p.emoji}</div>
      <div class="prod-info">
        <div class="prod-name">${p.name}</div>
        <div class="prod-cat">${p.cat}</div>
      </div>
      <div class="prod-price">${p.price}</div>
      <div class="prod-active ${p.active?'':'off'}" title="${p.active?'Activo':'Inactivo'}"></div>`;
    prodList.appendChild(row);
  });

  // ── Categories
  const cats = [
    { emoji: '🍖', name: 'Platos fuertes', count: 5, pct: 100 },
    { emoji: '🥤', name: 'Bebidas',         count: 3, pct: 60  },
    { emoji: '🥣', name: 'Sopas',           count: 2, pct: 40  },
    { emoji: '🍞', name: 'Panadería',        count: 2, pct: 40  },
  ];
  const catGrid = document.getElementById('catGrid');
  cats.forEach(c => {
    const row = document.createElement('div');
    row.className = 'cat-row';
    row.innerHTML = `
      <div class="cat-icon-box">${c.emoji}</div>
      <div class="cat-name">${c.name}</div>
      <div class="cat-count">${c.count} productos</div>
      <div class="cat-bar-wrap"><div class="cat-bar-fill" style="width:${c.pct}%"></div></div>`;
    catGrid.appendChild(row);
  });

  // ── Menu toggle
  function toggleMenu() {
    const on = document.getElementById('menuToggle').checked;
    document.getElementById('menuStatusLabel').textContent = on ? 'Menú activo' : 'Menú desactivado';
    document.getElementById('menuStatusSub').textContent   = on ? 'Los clientes pueden ver y pedir' : 'No visible para clientes';
  }

  // ── Copy link
  function copyLink() {
    navigator.clipboard.writeText('https://simfac.app/menu/la-fogata').catch(() => {});
    const btn = document.getElementById('copyBtn');
    btn.textContent = '¡Copiado!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Copiar'; btn.classList.remove('copied'); }, 2000);
  }

  // ── QR modal
  function openQR()  { document.getElementById('qrModal').classList.add('open'); }
  function closeQR() { document.getElementById('qrModal').classList.remove('open'); }
  document.getElementById('qrModal').addEventListener('click', e => { if (e.target === e.currentTarget) closeQR(); });

  // ── Sidebar mobile
  function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('show');
  }
