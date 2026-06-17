// ── Data
  let products = [
    { id:1,  name:'Bandeja Paisa',       cat:'Platos fuertes', price:28000, desc:'Frijoles, chicharrón, arepa, arroz, carne molida y más',    emoji:'🍖', active:true  },
    { id:2,  name:'Cazuela de Mariscos', cat:'Platos fuertes', price:35000, desc:'Camarones, calamar y pescado en salsa de coco',             emoji:'🐟', active:true  },
    { id:3,  name:'Arroz con Pollo',     cat:'Platos fuertes', price:24000, desc:'Arroz especiado con pollo deshuesado y verduras',           emoji:'🍚', active:true  },
    { id:4,  name:'Ajiaco Bogotano',     cat:'Sopas',          price:22000, desc:'Sopa tradicional con papa criolla, guasca y pollo',         emoji:'🥣', active:true  },
    { id:5,  name:'Sancocho Trifásico',  cat:'Sopas',          price:26000, desc:'Pollo, res y cerdo con yuca, plátano y papa',               emoji:'🍲', active:true  },
    { id:6,  name:'Limonada de Coco',    cat:'Bebidas',        price:8000,  desc:'Fresca y cremosa, preparada al momento',                   emoji:'🥤', active:true  },
    { id:7,  name:'Jugo de Maracuyá',    cat:'Bebidas',        price:7000,  desc:'Natural, sin azúcar añadida',                              emoji:'🧃', active:true  },
    { id:8,  name:'Agua Panela',         cat:'Bebidas',        price:4000,  desc:'Caliente o fría, tradicional colombiana',                  emoji:'☕', active:true  },
    { id:9,  name:'Pan de Bono',         cat:'Panadería',      price:3500,  desc:'Recién horneado, con queso costeño',                       emoji:'🧀', active:true  },
    { id:10, name:'Pandebono',           cat:'Panadería',      price:4000,  desc:'Esponjoso y caliente, ideal para desayuno',                emoji:'🍞', active:false },
    { id:11, name:'Wrap de Pollo',       cat:'Platos fuertes', price:18000, desc:'Tortilla rellena de pollo a la plancha, lechuga y tomate', emoji:'🫔', active:true  },
    { id:12, name:'Ensalada César',      cat:'Platos fuertes', price:16000, desc:'Lechuga romana, crutones, parmesano y aderezo César',      emoji:'🥗', active:false },
  ];

  let editingId = null;
  let deleteId  = null;
  let nextId    = 13;
  let currentView = 'grid';
  let currentEmoji = '🍽️';

  // ── Render
  function applyFilters() {
    const q      = document.getElementById('searchInput').value.toLowerCase();
    const cat    = document.getElementById('filterCat').value;
    const status = document.getElementById('filterStatus').value;

    let filtered = products.filter(p => {
      const matchQ   = p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
      const matchCat = !cat || p.cat === cat;
      const matchSt  = !status || (status === 'active' ? p.active : !p.active);
      return matchQ && matchCat && matchSt;
    });

    document.getElementById('toolbarCount').textContent = `${filtered.length} producto${filtered.length !== 1 ? 's' : ''}`;

    if (currentView === 'grid') renderGrid(filtered);
    else renderTable(filtered);

    document.getElementById('emptyState').style.display = filtered.length ? 'none' : 'flex';
  }

  function renderGrid(data) {
    const grid = document.getElementById('gridView');
    grid.innerHTML = '';
    data.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'prod-card';
      card.style.animationDelay = (i * 0.05) + 's';
      card.innerHTML = `
        <div class="prod-img">
          ${p.emoji}
          ${!p.active ? `<div class="prod-inactive-badge">No disponible</div>` : ''}
          <div class="prod-cat-badge">${p.cat}</div>
          <div class="prod-img-overlay">
            <button class="img-action-btn" onclick="editProduct(${p.id},event)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Editar
            </button>
          </div>
        </div>
        <div class="prod-body">
          <div class="prod-header-row">
            <div class="prod-name">${p.name}</div>
            <div class="prod-price">$${p.price.toLocaleString('es-CO')}</div>
          </div>
          <div class="prod-desc">${p.desc}</div>
          <div class="prod-footer">
            <div class="prod-actions">
              <button class="prod-action-btn" onclick="editProduct(${p.id},event)" title="Editar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="prod-action-btn danger" onclick="openDelModal(${p.id},event)" title="Eliminar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
              </button>
            </div>
            <label class="toggle-sm" title="${p.active?'Disponible':'No disponible'}">
              <input type="checkbox" ${p.active?'checked':''} onchange="toggleProduct(${p.id}, this.checked)">
              <div class="track-sm"></div>
            </label>
          </div>
        </div>`;
      grid.appendChild(card);
    });
    updateStats();
  }

  function renderTable(data) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    data.forEach((p, i) => {
      const tr = document.createElement('tr');
      tr.style.opacity = '0';
      tr.style.animation = `card-in .4s ease forwards ${i * 0.04}s`;
      tr.innerHTML = `
        <td>
          <div style="display:flex;align-items:center;gap:.7rem">
            <div class="tbl-emoji">${p.emoji}</div>
            <div>
              <div class="tbl-name">${p.name}</div>
              <div style="font-size:.7rem;color:var(--muted);">${p.active?'✅ Disponible':'❌ No disponible'}</div>
            </div>
          </div>
        </td>
        <td><span class="tbl-cat">${p.cat}</span></td>
        <td><span class="tbl-price">$${p.price.toLocaleString('es-CO')}</span></td>
        <td><span class="tbl-desc">${p.desc}</span></td>
        <td>
          <label class="toggle-sm">
            <input type="checkbox" ${p.active?'checked':''} onchange="toggleProduct(${p.id}, this.checked)">
            <div class="track-sm"></div>
          </label>
        </td>
        <td>
          <div class="tbl-actions">
            <button class="prod-action-btn" onclick="editProduct(${p.id},event)" title="Editar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="prod-action-btn danger" onclick="openDelModal(${p.id},event)" title="Eliminar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
            </button>
          </div>
        </td>`;
      tbody.appendChild(tr);
    });
    updateStats();
  }

  function updateStats() {
    document.getElementById('statTotal').textContent   = products.length;
    document.getElementById('statActive').textContent  = products.filter(p => p.active).length;
    document.getElementById('statInactive').textContent = products.filter(p => !p.active).length;
  }

  applyFilters();

  // ── View toggle
  function setView(v) {
    currentView = v;
    document.getElementById('gridView').style.display  = v === 'grid'  ? 'grid'  : 'none';
    document.getElementById('tableView').style.display = v === 'table' ? 'block' : 'none';
    document.getElementById('btnGrid').classList.toggle('active',  v === 'grid');
    document.getElementById('btnTable').classList.toggle('active', v === 'table');
    applyFilters();
  }

  // ── Toggle availability
  function toggleProduct(id, val) {
    const p = products.find(p => p.id === id);
    if (p) { p.active = val; showToast(val ? `"${p.name}" disponible` : `"${p.name}" no disponible`); updateStats(); }
  }

  // ── Drawer
  function openDrawer(id) {
    editingId = id || null;
    if (editingId) {
      const p = products.find(p => p.id === editingId);
      document.getElementById('drawerTitle').textContent = 'Editar producto';
      document.getElementById('drawerSub').textContent   = p.name;
      document.getElementById('drawerIcon').textContent  = '✏️';
      document.getElementById('btnSaveText').textContent = 'Actualizar producto';
      document.getElementById('fName').value   = p.name;
      document.getElementById('fPrice').value  = p.price;
      document.getElementById('fDesc').value   = p.desc;
      document.getElementById('fActive').checked = p.active;
      document.getElementById('fCat').value    = p.cat;
      setEmoji(p.emoji);
      document.getElementById('uploadPreview').style.display = 'none';
      document.getElementById('uploadPlaceholder').style.display = 'block';
    } else {
      document.getElementById('drawerTitle').textContent = 'Nuevo producto';
      document.getElementById('drawerSub').textContent   = 'Completa la información';
      document.getElementById('drawerIcon').textContent  = '➕';
      document.getElementById('btnSaveText').textContent = 'Guardar producto';
      document.getElementById('fName').value  = '';
      document.getElementById('fPrice').value = '';
      document.getElementById('fDesc').value  = '';
      document.getElementById('fActive').checked = true;
      document.getElementById('fCat').value   = '';
      setEmoji('🍽️');
      document.getElementById('uploadPreview').style.display = 'none';
      document.getElementById('uploadPlaceholder').style.display = 'block';
    }
    document.getElementById('drawerOverlay').classList.add('open');
    document.getElementById('drawer').classList.add('open');
    setTimeout(() => document.getElementById('fName').focus(), 350);
  }

  function closeDrawer() {
    document.getElementById('drawerOverlay').classList.remove('open');
    document.getElementById('drawer').classList.remove('open');
    editingId = null;
  }

  function editProduct(id, e) { e && e.stopPropagation(); openDrawer(id); }

  // ── Emoji shortcut
  function setEmoji(em) {
    currentEmoji = em;
    document.getElementById('uploadEmoji').textContent = em;
  }

  // ── Image preview
  function previewImg(input) {
    const file = input.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      document.getElementById('previewImg').src = e.target.result;
      document.getElementById('uploadPlaceholder').style.display = 'none';
      document.getElementById('uploadPreview').style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
  function removeImg(e) {
    e.stopPropagation();
    document.getElementById('imgInput').value = '';
    document.getElementById('uploadPreview').style.display = 'none';
    document.getElementById('uploadPlaceholder').style.display = 'block';
  }

  // ── Save
  function saveProduct() {
    const name  = document.getElementById('fName').value.trim();
    const price = parseInt(document.getElementById('fPrice').value);
    const cat   = document.getElementById('fCat').value;

    if (!name)       { showToast('El nombre es obligatorio', 'error'); return; }
    if (!price || price <= 0) { showToast('El precio debe ser mayor a 0', 'error'); return; }
    if (!cat)        { showToast('Selecciona una categoría', 'error'); return; }

    const data = {
      name, price, cat,
      desc:   document.getElementById('fDesc').value.trim(),
      active: document.getElementById('fActive').checked,
      emoji:  currentEmoji,
    };

    if (editingId) {
      Object.assign(products.find(p => p.id === editingId), data);
      showToast(`"${name}" actualizado`);
    } else {
      products.push({ id: nextId++, ...data });
      showToast(`"${name}" agregado al menú`);
    }
    closeDrawer();
    applyFilters();
  }

  // ── Delete
  function openDelModal(id, e) {
    e && e.stopPropagation();
    deleteId = id;
    const p = products.find(p => p.id === id);
    document.getElementById('delName').textContent = `"${p.name}"`;
    document.getElementById('delModal').classList.add('open');
  }
  function closeDelModal() { document.getElementById('delModal').classList.remove('open'); deleteId = null; }
  function confirmDelete() {
    const p = products.find(p => p.id === deleteId);
    products = products.filter(p => p.id !== deleteId);
    closeDelModal(); applyFilters();
    showToast(`"${p.name}" eliminado`);
  }
  document.getElementById('delModal').addEventListener('click', e => { if (e.target === e.currentTarget) closeDelModal(); });

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
