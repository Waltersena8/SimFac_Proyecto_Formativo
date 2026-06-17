// ── Data
  const categories = [
    { id:'platos',    name:'Platos fuertes', emoji:'🍖', count:5 },
    { id:'sopas',     name:'Sopas',          emoji:'🥣', count:2 },
    { id:'bebidas',   name:'Bebidas',        emoji:'🥤', count:3 },
    { id:'panaderia', name:'Panadería',      emoji:'🍞', count:2 },
  ];

  const products = [
    { id:1,  name:'Bandeja Paisa',       cat:'platos',    price:28000, emoji:'🍖', desc:'Frijoles rojos, chicharrón crocante, carne molida, arepa, huevo frito, chorizo y arroz blanco. El sabor de Colombia en un plato.',  tags:['popular'], active:true  },
    { id:2,  name:'Cazuela de Mariscos', cat:'platos',    price:35000, emoji:'🐟', desc:'Camarones, calamar y filete de pescado en una cremosa salsa de coco con especias del Pacífico. Servida con arroz con coco.',           tags:['nuevo','picante'], active:true  },
    { id:3,  name:'Arroz con Pollo',     cat:'platos',    price:24000, emoji:'🍚', desc:'Arroz dorado con pollo tierno, verduras salteadas, cilantro y limón. Tradicional y reconfortante.',                                    tags:[], active:true  },
    { id:4,  name:'Wrap de Pollo',       cat:'platos',    price:18000, emoji:'🫔', desc:'Tortilla de trigo rellena de pollo a la plancha, lechuga crespa, tomate, aguacate y aderezo especial de la casa.',                    tags:[], active:true  },
    { id:5,  name:'Ensalada César',      cat:'platos',    price:16000, emoji:'🥗', desc:'Lechuga romana fresca, crutones artesanales, parmesano y nuestro aderezo César clásico. Opcional: agregar pollo.',                    tags:[], active:false },
    { id:6,  name:'Ajiaco Bogotano',     cat:'sopas',     price:22000, emoji:'🥣', desc:'Sopa tradicional capitalina con tres tipos de papa, pollo deshuesado, guasca fresca, mazorca y crema de leche.',                     tags:['popular'], active:true  },
    { id:7,  name:'Sancocho Trifásico',  cat:'sopas',     price:26000, emoji:'🍲', desc:'Tres carnes (pollo, res y cerdo) cocinadas lentamente con yuca, plátano, papa y cilantro. Contundente y delicioso.',                  tags:[], active:true  },
    { id:8,  name:'Limonada de Coco',    cat:'bebidas',   price:8000,  emoji:'🥤', desc:'Limonada fresca batida con leche de coco, azúcar y hielo. Cremosa, refrescante y muy colombiana.',                                    tags:['popular'], active:true  },
    { id:9,  name:'Jugo de Maracuyá',    cat:'bebidas',   price:7000,  emoji:'🧃', desc:'Jugo natural de maracuyá, en agua o en leche. Sin azúcar añadida, recién preparado.',                                               tags:[], active:true  },
    { id:10, name:'Agua Panela',         cat:'bebidas',   price:4000,  emoji:'☕', desc:'Bebida tradicional colombiana preparada con panela pura. Disponible caliente o fría con limón.',                                      tags:[], active:true  },
    { id:11, name:'Pan de Bono',         cat:'panaderia', price:3500,  emoji:'🧀', desc:'Pan de bono recién horneado, esponjoso por dentro y dorado por fuera. Preparado con queso costeño. Viene en paquete de 4.',           tags:['popular'], active:true  },
    { id:12, name:'Pandebono',           cat:'panaderia', price:4000,  emoji:'🍞', desc:'Tradicional pandebono valluno, suave y con sabor a queso. Perfecto para desayuno o onces. Viene tibio.',                             tags:[], active:true  },
  ];

  // ── Cart state
  let cart = {};
  let activeDetail = null;
  let detailQty = 1;
  let currentCat = 'all';

  // ── Build category tabs
  const catTabs = document.getElementById('catTabs');
  document.getElementById('tc-all').textContent = products.filter(p=>p.active).length;

  categories.forEach(c => {
    const count = products.filter(p => p.cat === c.id && p.active).length;
    const btn = document.createElement('button');
    btn.className = 'cat-tab';
    btn.dataset.cat = c.id;
    btn.onclick = function() { filterCat(c.id, this); };
    btn.innerHTML = `<span class="tab-emoji">${c.emoji}</span> ${c.name} <span class="tab-count" id="tc-${c.id}">${count}</span>`;
    catTabs.appendChild(btn);
  });

  // ── Render menu
  function renderMenu(filterCatId = 'all', query = '') {
    const content = document.getElementById('menuContent');
    const empty   = document.getElementById('searchEmpty');
    const featured = document.getElementById('featuredBanner');
    content.innerHTML = '';

    const catsToShow = filterCatId === 'all' ? categories : categories.filter(c => c.id === filterCatId);
    let totalShown = 0;

    catsToShow.forEach(cat => {
      let prods = products.filter(p => p.cat === cat.id);
      if (query) prods = prods.filter(p => p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query));
      if (!prods.length) return;
      totalShown += prods.length;

      const section = document.createElement('div');
      section.className = 'menu-section';
      section.id = 'sec-' + cat.id;

      const header = document.createElement('div');
      header.className = 'section-header';
      header.innerHTML = `<div class="section-emoji">${cat.emoji}</div><div class="section-title">${cat.name}</div><div class="section-count">${prods.length}</div>`;
      section.appendChild(header);

      const list = document.createElement('div');
      list.className = 'products-list';

      prods.forEach((p, i) => {
        const inCart = cart[p.id] ? cart[p.id].qty : 0;
        const card = document.createElement('div');
        card.className = 'prod-card' + (!p.active ? ' unavailable' : '');
        card.style.animationDelay = (i * 0.04) + 's';
        card.onclick = () => { if (p.active) openDetail(p.id); };

        const tagsHTML = p.tags.map(t => `<span class="prod-tag tag-${t}">${t==='popular'?'⭐ Popular':t==='nuevo'?'🆕 Nuevo':'🌶 Picante'}</span>`).join('');

        const rightHTML = !p.active
          ? `<div class="prod-right"><div class="prod-price">$${p.price.toLocaleString('es-CO')}</div><div class="out-badge">No disponible</div></div>`
          : inCart > 0
            ? `<div class="prod-right">
                <div class="prod-price">$${p.price.toLocaleString('es-CO')}</div>
                <div class="qty-control" id="qc-${p.id}">
                  <button class="qty-btn" onclick="event.stopPropagation();updateQty(${p.id},-1)">−</button>
                  <div class="qty-num">${inCart}</div>
                  <button class="qty-btn" onclick="event.stopPropagation();updateQty(${p.id},1)">+</button>
                </div>
              </div>`
            : `<div class="prod-right">
                <div class="prod-price">$${p.price.toLocaleString('es-CO')}</div>
                <button class="add-btn" onclick="event.stopPropagation();quickAdd(${p.id})">+</button>
              </div>`;

        card.innerHTML = `
          <div class="prod-emoji-box">${p.emoji}</div>
          <div class="prod-info">
            <div class="prod-name">${p.name}</div>
            <div class="prod-desc">${p.desc}</div>
            ${tagsHTML ? `<div class="prod-tags">${tagsHTML}</div>` : ''}
          </div>
          ${rightHTML}`;
        list.appendChild(card);
      });

      section.appendChild(list);
      content.appendChild(section);
    });

    featured.style.display = (query || filterCatId !== 'all') ? 'none' : 'flex';
    empty.classList.toggle('show', totalShown === 0);
  }

  renderMenu();

  // ── Filter by category
  function filterCat(catId, btn) {
    currentCat = catId;
    document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('searchInput').value = '';
    renderMenu(catId, '');

    if (catId !== 'all') {
      const sec = document.getElementById('sec-' + catId);
      if (sec) setTimeout(() => sec.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }

  // ── Search
  function handleSearch() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    document.querySelector('[data-cat="all"]').classList.add('active');
    currentCat = 'all';
    renderMenu('all', q);
  }

  // ── Quick add from list
  function quickAdd(id) {
    const p = products.find(p => p.id === id);
    if (!p) return;
    if (!cart[id]) cart[id] = { qty: 0, note: '' };
    cart[id].qty++;
    updateCartUI();
    renderMenu(currentCat, document.getElementById('searchInput').value.toLowerCase());
    showToast(`${p.emoji} ${p.name} agregado`);
  }

  // ── Update qty from list
  function updateQty(id, delta) {
    if (!cart[id]) return;
    cart[id].qty = Math.max(0, cart[id].qty + delta);
    if (cart[id].qty === 0) delete cart[id];
    updateCartUI();
    renderMenu(currentCat, document.getElementById('searchInput').value.toLowerCase());
  }

  // ── Product detail
  function openDetail(id) {
    const p = products.find(p => p.id === id);
    if (!p) return;
    activeDetail = id;
    detailQty = cart[id] ? cart[id].qty : 1;
    if (detailQty === 0) detailQty = 1;

    document.getElementById('detailImg').textContent  = p.emoji;
    document.getElementById('detailName').textContent = p.name;
    document.getElementById('detailPrice').textContent = `$${p.price.toLocaleString('es-CO')}`;
    document.getElementById('detailDesc').textContent  = p.desc;
    document.getElementById('detailNote').value = cart[id]?.note || '';

    const tagsEl = document.getElementById('detailTags');
    tagsEl.innerHTML = p.tags.map(t => `<span class="prod-tag tag-${t}">${t==='popular'?'⭐ Popular':t==='nuevo'?'🆕 Nuevo':'🌶 Picante'}</span>`).join('');

    updateDetailBtn(p);
    document.getElementById('detailOverlay').classList.add('open');
  }

  function closeDetail() { document.getElementById('detailOverlay').classList.remove('open'); activeDetail = null; }
  function closeDetailOutside(e) { if (e.target === document.getElementById('detailOverlay')) closeDetail(); }

  function changeDetailQty(delta) {
    detailQty = Math.max(1, detailQty + delta);
    document.getElementById('detailQty').textContent = detailQty;
    if (activeDetail) {
      const p = products.find(p => p.id === activeDetail);
      updateDetailBtn(p);
    }
  }

  function updateDetailBtn(p) {
    document.getElementById('detailQty').textContent = detailQty;
    document.getElementById('detailAddText').textContent = `Agregar${detailQty > 1 ? ` ${detailQty}` : ''} · $${(p.price * detailQty).toLocaleString('es-CO')}`;
  }

  function addFromDetail() {
    if (!activeDetail) return;
    const p = products.find(p => p.id === activeDetail);
    cart[activeDetail] = { qty: detailQty, note: document.getElementById('detailNote').value.trim() };
    updateCartUI();
    renderMenu(currentCat, document.getElementById('searchInput').value.toLowerCase());
    closeDetail();
    showToast(`${p.emoji} ${p.name} × ${detailQty} agregado`);
  }

  // ── Cart UI
  function updateCartUI() {
    const total = Object.keys(cart).reduce((s, id) => s + (products.find(p=>p.id===parseInt(id))?.price || 0) * cart[id].qty, 0);
    const count = Object.values(cart).reduce((s, i) => s + i.qty, 0);
    document.getElementById('cartCount').textContent = count;
    document.getElementById('cartTotal').textContent = `$${total.toLocaleString('es-CO')}`;
    document.getElementById('cartBar').classList.toggle('visible', count > 0);
  }

  function goToCart() { window.location.href = 'carrito.html'; }

  // ── Toast
  let toastTimer;
  function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
  }
