// ── Data
  let categories = [
    { id: 1, name: 'Platos fuertes', desc: 'Nuestros platos principales, con sabor auténtico', emoji: '🍖', color: '#F5A623', active: true, count: 5 },
    { id: 2, name: 'Bebidas',        desc: 'Jugos naturales, refrescos y bebidas calientes',  emoji: '🥤', color: '#60A5FA', active: true, count: 3 },
    { id: 3, name: 'Sopas',          desc: 'Caldos y sopas tradicionales colombianas',         emoji: '🥣', color: '#27C478', active: true, count: 2 },
    { id: 4, name: 'Panadería',      desc: 'Pan de bono, croissants y más',                   emoji: '🍞', color: '#E8522A', active: true, count: 2 },
  ];

  let editingId   = null;
  let deleteId    = null;
  let selEmoji    = '🍖';
  let selColor    = '#F5A623';
  let nextId      = 5;

  const EMOJIS = ['🍖','🥤','🥣','🍞','🐟','🥩','🫔','🥗','🍜','🍕','🍔','🧃','🍰','🫕','🌮','🥘'];
  const COLORS = ['#F5A623','#E8522A','#27C478','#60A5FA','#A78BFA','#F472B6','#34D399','#FBBF24','#FB923C','#38BDF8'];

  // ── Render emoji picker
  const emojiPicker = document.getElementById('emojiPicker');
  EMOJIS.forEach(em => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'emoji-opt' + (em === selEmoji ? ' selected' : '');
    btn.textContent = em;
    btn.onclick = () => { selEmoji = em; renderEmojis(); updatePreview(); };
    emojiPicker.appendChild(btn);
  });

  function renderEmojis() {
    emojiPicker.querySelectorAll('.emoji-opt').forEach((btn, i) => {
      btn.classList.toggle('selected', EMOJIS[i] === selEmoji);
    });
  }

  // ── Render color picker
  const colorPicker = document.getElementById('colorPicker');
  COLORS.forEach(c => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'color-opt' + (c === selColor ? ' selected' : '');
    btn.style.background = c;
    btn.title = c;
    btn.onclick = () => { selColor = c; renderColors(); updatePreview(); };
    colorPicker.appendChild(btn);
  });

  function renderColors() {
    colorPicker.querySelectorAll('.color-opt').forEach((btn, i) => {
      btn.classList.toggle('selected', COLORS[i] === selColor);
    });
  }

  // ── Live preview
  document.getElementById('fName').addEventListener('input', updatePreview);

  function updatePreview() {
    const name = document.getElementById('fName').value.trim() || 'Nombre de categoría';
    document.getElementById('prevName').textContent  = name;
    document.getElementById('prevEmoji').textContent = selEmoji;
    document.getElementById('prevEmoji').style.background = selColor + '20';
    document.getElementById('prevBar').style.background   = selColor;
  }

  // ── Render cards
  function renderCards(data) {
    const grid = document.getElementById('catCardsGrid');
    const empty = document.getElementById('emptyState');
    grid.innerHTML = '';
    if (!data.length) { empty.style.display = 'flex'; return; }
    empty.style.display = 'none';

    data.forEach((cat, idx) => {
      const card = document.createElement('div');
      card.className = 'cat-card';
      card.draggable = true;
      card.dataset.id = cat.id;
      card.style.animationDelay = (idx * 0.06) + 's';

      card.innerHTML = `
        <div class="cat-card-bar" style="background:${cat.color};"></div>
        <div class="cat-card-body">
          <div class="cat-card-top">
            <div class="cat-emoji-box" style="background:${cat.color}20;">${cat.emoji}</div>
            <div class="cat-menu">
              <button class="cat-menu-btn" onclick="toggleDropdown(${cat.id}, event)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="19" r="1" fill="currentColor"/>
                </svg>
              </button>
              <div class="cat-dropdown" id="dd-${cat.id}">
                <div class="dd-item" onclick="editCat(${cat.id})">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Editar
                </div>
                <div class="dd-item" onclick="viewProducts(${cat.id})">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.96-1.59l1.54-7.41H6"/></svg>
                  Ver productos
                </div>
                <div class="dd-divider"></div>
                <div class="dd-item danger" onclick="openDelModal(${cat.id})">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                  Eliminar
                </div>
              </div>
            </div>
          </div>
          <div class="cat-name">${cat.name}</div>
          <div class="cat-desc">${cat.desc || 'Sin descripción'}</div>
        </div>
        <div class="cat-card-footer">
          <div class="cat-prod-count">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.96-1.59l1.54-7.41H6"/></svg>
            <strong>${cat.count}</strong> producto${cat.count !== 1 ? 's' : ''}
          </div>
          <label class="toggle-sm" title="${cat.active ? 'Activa' : 'Inactiva'}">
            <input type="checkbox" ${cat.active ? 'checked' : ''} onchange="toggleCat(${cat.id}, this.checked)">
            <div class="track-sm"></div>
          </label>
        </div>`;

      // Drag events
      card.addEventListener('dragstart', onDragStart);
      card.addEventListener('dragover',  onDragOver);
      card.addEventListener('dragleave', onDragLeave);
      card.addEventListener('drop',      onDrop);
      card.addEventListener('dragend',   onDragEnd);

      grid.appendChild(card);
    });

    document.getElementById('totalCats').textContent = categories.length;
  }

  renderCards(categories);

  // ── Dropdown toggle
  function toggleDropdown(id, e) {
    e.stopPropagation();
    const dd = document.getElementById('dd-' + id);
    const isOpen = dd.classList.contains('open');
    document.querySelectorAll('.cat-dropdown').forEach(d => d.classList.remove('open'));
    if (!isOpen) dd.classList.add('open');
  }
  document.addEventListener('click', () => {
    document.querySelectorAll('.cat-dropdown').forEach(d => d.classList.remove('open'));
  });

  // ── Filter
  function filterCats() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    const filtered = categories.filter(c => c.name.toLowerCase().includes(q));
    renderCards(filtered);
  }

  // ── Sort
  let sortAsc = true;
  function sortCats() {
    sortAsc = !sortAsc;
    categories.sort((a, b) => sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
    renderCards(categories);
    showToast('Categorías ordenadas ' + (sortAsc ? 'A → Z' : 'Z → A'));
  }

  // ── Toggle active
  function toggleCat(id, val) {
    const cat = categories.find(c => c.id === id);
    if (cat) { cat.active = val; showToast(val ? `"${cat.name}" activada` : `"${cat.name}" desactivada`); }
  }

  // ── New / Edit
  function newCategory() {
    editingId = null;
    resetForm();
    document.getElementById('fName').focus();
  }

  function editCat(id) {
    const cat = categories.find(c => c.id === id);
    if (!cat) return;
    editingId = id;
    document.getElementById('fName').value  = cat.name;
    document.getElementById('fDesc').value  = cat.desc;
    selEmoji = cat.emoji;
    selColor = cat.color;
    renderEmojis(); renderColors(); updatePreview();
    document.getElementById('formTitle').textContent  = 'Editar categoría';
    document.getElementById('formSub').textContent    = `Modificando: ${cat.name}`;
    document.getElementById('formIcon').textContent   = '✏️';
    document.getElementById('btnSaveText').textContent = 'Actualizar';
    document.getElementById('fName').focus();
    document.querySelectorAll('.cat-dropdown').forEach(d => d.classList.remove('open'));
  }

  function resetForm() {
    editingId = null;
    document.getElementById('fName').value = '';
    document.getElementById('fDesc').value = '';
    selEmoji = '🍖'; selColor = '#F5A623';
    renderEmojis(); renderColors(); updatePreview();
    document.getElementById('formTitle').textContent  = 'Nueva categoría';
    document.getElementById('formSub').textContent    = 'Completa los datos para agregar';
    document.getElementById('formIcon').textContent   = '➕';
    document.getElementById('btnSaveText').textContent = 'Guardar';
  }

  // ── Save
  function saveCategory() {
    const name = document.getElementById('fName').value.trim();
    if (!name) { document.getElementById('fName').focus(); showToast('El nombre es obligatorio', 'error'); return; }
    if (editingId) {
      const cat = categories.find(c => c.id === editingId);
      Object.assign(cat, { name, desc: document.getElementById('fDesc').value.trim(), emoji: selEmoji, color: selColor });
      showToast(`"${name}" actualizada correctamente`);
    } else {
      categories.push({ id: nextId++, name, desc: document.getElementById('fDesc').value.trim(), emoji: selEmoji, color: selColor, active: true, count: 0 });
      showToast(`"${name}" creada correctamente`);
    }
    renderCards(categories);
    resetForm();
  }

  // ── View products (placeholder)
  function viewProducts(id) {
    const cat = categories.find(c => c.id === id);
    showToast(`Ir a productos de "${cat.name}"`);
    document.querySelectorAll('.cat-dropdown').forEach(d => d.classList.remove('open'));
  }

  // ── Delete modal
  function openDelModal(id) {
    deleteId = id;
    const cat = categories.find(c => c.id === id);
    document.getElementById('delCatName').textContent = `"${cat.name}"`;
    document.getElementById('delModal').classList.add('open');
    document.querySelectorAll('.cat-dropdown').forEach(d => d.classList.remove('open'));
  }
  function closeDelModal() { document.getElementById('delModal').classList.remove('open'); deleteId = null; }
  function confirmDelete() {
    if (!deleteId) return;
    const cat = categories.find(c => c.id === deleteId);
    categories = categories.filter(c => c.id !== deleteId);
    renderCards(categories);
    closeDelModal();
    showToast(`"${cat.name}" eliminada`);
    if (editingId === deleteId) resetForm();
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

  // ── Drag & Drop reorder
  let dragSrc = null;
  function onDragStart(e) { dragSrc = this; this.classList.add('dragging'); }
  function onDragOver(e) { e.preventDefault(); if (this !== dragSrc) this.classList.add('drag-over'); }
  function onDragLeave()  { this.classList.remove('drag-over'); }
  function onDrop(e) {
    e.preventDefault();
    if (this === dragSrc) return;
    const srcId  = parseInt(dragSrc.dataset.id);
    const destId = parseInt(this.dataset.id);
    const si = categories.findIndex(c => c.id === srcId);
    const di = categories.findIndex(c => c.id === destId);
    [categories[si], categories[di]] = [categories[di], categories[si]];
    renderCards(categories);
    showToast('Orden actualizado');
  }
  function onDragEnd() { document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('dragging','drag-over')); }

  // ── Sidebar mobile
  function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('show');
  }
