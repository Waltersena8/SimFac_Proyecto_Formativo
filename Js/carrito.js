// ── Product catalog (mini)
  const catalog = [
    { id:1,  name:'Bandeja Paisa',       price:28000, emoji:'🍖', note:'' },
    { id:6,  name:'Ajiaco Bogotano',     price:22000, emoji:'🥣', note:'' },
    { id:8,  name:'Limonada de Coco',    price:8000,  emoji:'🥤', note:'' },
    { id:2,  name:'Cazuela de Mariscos', price:35000, emoji:'🐟', note:'Sin cebolla por favor' },
    { id:3,  name:'Arroz con Pollo',     price:24000, emoji:'🍚', note:'' },
    { id:4,  name:'Wrap de Pollo',       price:18000, emoji:'🫔', note:'' },
    { id:7,  name:'Sancocho Trifásico',  price:26000, emoji:'🍲', note:'' },
    { id:9,  name:'Jugo de Maracuyá',    price:7000,  emoji:'🧃', note:'' },
    { id:10, name:'Agua Panela',         price:4000,  emoji:'☕', note:'' },
    { id:11, name:'Pan de Bono',         price:3500,  emoji:'🧀', note:'' },
    { id:12, name:'Pandebono',           price:4000,  emoji:'🍞', note:'' },
  ];

  // ── Cart state (pre-loaded with items)
  let cart = {
    1: { qty:1, note:'' },
    6: { qty:2, note:'' },
    8: { qty:1, note:'Poco azúcar' },
  };

  let discount = 0;
  const PROMO_CODES = { 'SIMFAC10': 10, 'FOGATA15': 15, 'BIENVENIDO': 5 };

  // ── Render cart items
  function renderCart() {
    const list    = document.getElementById('cartItemsList');
    const empty   = document.getElementById('emptyCart');
    const itemsSec = document.getElementById('itemsSection');
    const upsellSec = document.getElementById('upsellSection');
    const confirmBtn = document.getElementById('confirmBtn');

    const ids = Object.keys(cart).map(Number);
    list.innerHTML = '';

    if (!ids.length) {
      empty.classList.add('show');
      itemsSec.style.display = 'none';
      upsellSec.style.display = 'none';
      confirmBtn.disabled = true;
      updateSummary();
      return;
    }

    empty.classList.remove('show');
    itemsSec.style.display = 'block';
    upsellSec.style.display = 'block';
    confirmBtn.disabled = false;

    ids.forEach((id, i) => {
      const prod = catalog.find(p => p.id === id);
      if (!prod) return;
      const item = cart[id];
      const subtotal = prod.price * item.qty;

      const card = document.createElement('div');
      card.className = 'cart-item';
      card.id = 'ci-' + id;
      card.style.animationDelay = (i * 0.06) + 's';

      card.innerHTML = `
        <div class="ci-emoji">${prod.emoji}</div>
        <div class="ci-info">
          <div class="ci-name">${prod.name}</div>
          <div class="ci-unit-price">$${prod.price.toLocaleString('es-CO')} c/u</div>
          ${item.note ? `<div class="ci-note">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            ${item.note}
          </div>` : ''}
        </div>
        <div class="ci-right">
          <div class="ci-price">$${subtotal.toLocaleString('es-CO')}</div>
          <div class="ci-qty">
            <button class="ci-qty-btn ${item.qty === 1 ? 'remove' : ''}" onclick="updateItem(${id}, -1)">${item.qty === 1 ? '🗑' : '−'}</button>
            <div class="ci-qty-num">${item.qty}</div>
            <button class="ci-qty-btn" onclick="updateItem(${id}, 1)">+</button>
          </div>
        </div>`;
      list.appendChild(card);
    });

    renderUpsell();
    updateSummary();
  }

  // ── Update item qty
  function updateItem(id, delta) {
    if (!cart[id]) return;
    cart[id].qty += delta;
    if (cart[id].qty <= 0) {
      const prod = catalog.find(p => p.id === id);
      delete cart[id];
      const el = document.getElementById('ci-' + id);
      if (el) { el.style.transition = 'opacity .25s, transform .25s'; el.style.opacity = '0'; el.style.transform = 'translateX(-20px)'; setTimeout(() => renderCart(), 250); }
      showToast(`${prod.emoji} ${prod.name} eliminado`);
    } else {
      renderCart();
    }
  }

  // ── Clear cart
  function clearCart() {
    cart = {};
    renderCart();
    showToast('Pedido vaciado');
  }

  // ── Upsell suggestions
  function renderUpsell() {
    const cartIds = Object.keys(cart).map(Number);
    const suggestions = catalog.filter(p => !cartIds.includes(p.id)).slice(0, 6);
    const ul = document.getElementById('upsellList');
    ul.innerHTML = '';
    suggestions.forEach(p => {
      const card = document.createElement('div');
      card.className = 'upsell-card';
      card.innerHTML = `
        <div class="upsell-emoji">${p.emoji}</div>
        <div class="upsell-name">${p.name}</div>
        <div class="upsell-price">$${p.price.toLocaleString('es-CO')}</div>
        <button class="upsell-add" onclick="addUpsell(${p.id})">+ Agregar</button>`;
      ul.appendChild(card);
    });
  }

  function addUpsell(id) {
    const prod = catalog.find(p => p.id === id);
    if (!prod) return;
    cart[id] = { qty: 1, note: '' };
    renderCart();
    showToast(`${prod.emoji} ${prod.name} agregado`);
  }

  // ── Summary
  function updateSummary() {
    const ids = Object.keys(cart).map(Number);
    const subtotal = ids.reduce((s, id) => {
      const p = catalog.find(p => p.id === id);
      return s + (p ? p.price * cart[id].qty : 0);
    }, 0);
    const totalQty = ids.reduce((s, id) => s + cart[id].qty, 0);
    const discountAmt = Math.round(subtotal * discount / 100);
    const total = subtotal - discountAmt;

    document.getElementById('sumSubtotal').textContent = `$${subtotal.toLocaleString('es-CO')}`;
    document.getElementById('sumTotal').textContent    = `$${total.toLocaleString('es-CO')}`;
    document.getElementById('btTotal').textContent     = `$${total.toLocaleString('es-CO')}`;
    document.getElementById('btItems').textContent     = `${totalQty} producto${totalQty !== 1 ? 's' : ''}`;
    document.getElementById('topBadge').textContent    = `${totalQty} item${totalQty !== 1 ? 's' : ''}`;

    if (discountAmt > 0) {
      document.getElementById('sumDiscount').style.display = 'flex';
      document.getElementById('sumDiscountVal').textContent = `−$${discountAmt.toLocaleString('es-CO')}`;
    } else {
      document.getElementById('sumDiscount').style.display = 'none';
    }
  }

  // ── Promo code
  function applyPromo() {
    const code = document.getElementById('promoInput').value.trim().toUpperCase();
    const msg  = document.getElementById('promoMsg');
    const input = document.getElementById('promoInput');
    if (!code) { msg.textContent = 'Ingresa un código.'; msg.className = 'promo-msg err'; return; }
    if (PROMO_CODES[code]) {
      discount = PROMO_CODES[code];
      input.classList.add('applied');
      msg.textContent = `✓ Código aplicado — ${discount}% de descuento`;
      msg.className = 'promo-msg ok';
      updateSummary();
      showToast(`🎉 ${discount}% de descuento aplicado`);
    } else {
      discount = 0;
      input.classList.remove('applied');
      msg.textContent = 'Código inválido o expirado.';
      msg.className = 'promo-msg err';
      updateSummary();
    }
  }

  document.getElementById('promoInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') applyPromo();
  });

  // ── Go to confirm
  function goToConfirm() {
    const mesa  = document.getElementById('mesaSelect').value;
    const note  = document.getElementById('orderNote').value.trim();
    const total = Object.keys(cart).reduce((s, id) => {
      const p = catalog.find(p => p.id === parseInt(id));
      return s + (p ? p.price * cart[id].qty : 0);
    }, 0);
    const discountAmt = Math.round(total * discount / 100);

    // Store in sessionStorage for confirm page
    sessionStorage.setItem('simfac_cart',    JSON.stringify(cart));
    sessionStorage.setItem('simfac_mesa',    mesa);
    sessionStorage.setItem('simfac_note',    note);
    sessionStorage.setItem('simfac_discount', discount);
    sessionStorage.setItem('simfac_total',   (total - discountAmt).toString());

    // Animate button
    const btn = document.getElementById('confirmBtn');
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Procesando...';
    btn.disabled = true;
    setTimeout(() => { window.location.href = 'Confirmacion.html'; }, 800);
  }

  // ── Toast
  let toastTimer;
  function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
  }

  // ── Init
  renderCart();
