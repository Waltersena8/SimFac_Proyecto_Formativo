let currentStep = 1;

  // Step navigation
  function goStep(n) {
    if (n > currentStep && !validateStep(currentStep)) return;

    document.getElementById('step' + currentStep).classList.remove('active');
    document.getElementById('step' + n).classList.add('active');

    // Update progress
    for (let i = 1; i <= 3; i++) {
      const ps = document.getElementById('ps' + i);
      ps.classList.remove('active', 'done');
      if (i < n) ps.classList.add('done');
      else if (i === n) ps.classList.add('active');
    }

    if (n === 3) fillSummary();
    currentStep = n;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Validation
  function validateStep(step) {
    let valid = true;
    if (step === 1) {
      valid = checkField('f-nombre', 'nombre', v => v.trim().length >= 2) && valid;
      valid = checkField('f-tipo', 'tipo', v => v !== '') && valid;
      valid = checkField('f-ciudad', 'ciudad', v => v.trim().length >= 2) && valid;
    }
    if (step === 2) {
      valid = checkField('f-fname', 'fname', v => v.trim().length >= 2) && valid;
      valid = checkField('f-lname', 'lname', v => v.trim().length >= 2) && valid;
      valid = checkField('f-email', 'email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) && valid;
      valid = checkField('f-telefono', 'telefono', v => /^[0-9]{10}$/.test(v.replace(/\s/g,''))) && valid;
      valid = checkField('f-password', 'password', v => v.length >= 8) && valid;
      valid = checkField('f-confirm', 'confirm', v => v === document.getElementById('password').value) && valid;
    }
    return valid;
  }

  function checkField(fieldId, inputId, rule) {
    const field = document.getElementById(fieldId);
    const input = document.getElementById(inputId);
    const val = input.value;
    const ok = rule(val);
    field.classList.toggle('has-error', !ok);
    field.classList.toggle('is-valid', ok && val.length > 0);
    return ok;
  }

  // Live validation
  document.addEventListener('DOMContentLoaded', () => {
    ['nombre','ciudad','fname','lname'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('blur', () => {
        if (el.value.trim().length >= 2) {
          const f = el.closest('.field');
          f.classList.remove('has-error');
          f.classList.add('is-valid');
        }
      });
    });

    document.getElementById('email').addEventListener('blur', function() {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value);
      const f = this.closest('.field');
      f.classList.toggle('has-error', !ok && this.value.length > 0);
      f.classList.toggle('is-valid', ok);
    });

    document.getElementById('telefono').addEventListener('input', function() {
      this.value = this.value.replace(/\D/g,'').slice(0,10);
    });

    document.getElementById('password').addEventListener('input', function() {
      updateStrength(this.value);
    });

    document.getElementById('confirm').addEventListener('blur', function() {
      const pw = document.getElementById('password').value;
      const f = this.closest('.field');
      const match = this.value === pw && this.value.length > 0;
      f.classList.toggle('has-error', !match && this.value.length > 0);
      f.classList.toggle('is-valid', match);
    });
  });

  // Password strength
  function updateStrength(pw) {
    const fill = document.getElementById('pwFill');
    const text = document.getElementById('pwText');
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    const levels = [
      { pct: '0%',   color: 'transparent',  label: 'Escribe tu contraseña' },
      { pct: '25%',  color: '#E8522A',       label: 'Muy débil' },
      { pct: '50%',  color: '#FBBF24',       label: 'Débil' },
      { pct: '75%',  color: '#27C478',       label: 'Buena' },
      { pct: '100%', color: '#27C478',       label: 'Excelente 🔒' },
    ];
    const l = levels[Math.min(score, 4)];
    fill.style.width = l.pct;
    fill.style.background = l.color;
    text.textContent = l.label;
    text.style.color = score < 2 ? 'var(--muted)' : l.color;
  }

  // Password toggle
  function togglePw(id, btn) {
    const input = document.getElementById(id);
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    btn.querySelector('svg').style.opacity = isHidden ? '.4' : '1';
  }

  // Logo preview
  document.getElementById('logoInput').addEventListener('change', function() {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      document.getElementById('logoImg').src = e.target.result;
      document.getElementById('uploadPlaceholder').style.display = 'none';
      const prev = document.getElementById('logoPreview');
      prev.style.display = 'flex';
    };
    reader.readAsDataURL(file);
  });

  // Fill summary
  function fillSummary() {
    document.getElementById('sum-nombre').textContent = document.getElementById('nombre').value || '—';
    document.getElementById('sum-tipo').textContent = document.getElementById('tipo').value || '—';
    document.getElementById('sum-ciudad').textContent = document.getElementById('ciudad').value || '—';
    const fn = document.getElementById('fname').value;
    const ln = document.getElementById('lname').value;
    document.getElementById('sum-admin').textContent = (fn + ' ' + ln).trim() || '—';
    document.getElementById('sum-email').textContent = document.getElementById('email').value || '—';
    document.getElementById('sum-tel').textContent = document.getElementById('telefono').value || '—';
  }

  // Submit
  function submitForm() {
    if (!document.getElementById('terminos').checked) {
      alert('Debes aceptar los Términos y condiciones para continuar.');
      return;
    }
    const btn = document.getElementById('btnSubmit');
    btn.textContent = 'Creando tu restaurante...';
    btn.disabled = true;

    // Simulate async
    setTimeout(() => {
      const nombre = document.getElementById('nombre').value;
      const slug = nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g,'');
      document.getElementById('menuSlug').textContent = 'simfac.app/menu/' + slug;

      document.getElementById('regForm').style.display = 'none';
      document.getElementById('progress').style.display = 'none';
      document.querySelector('.form-header').style.display = 'none';
      document.getElementById('loginLink').style.display = 'none';

      const sv = document.getElementById('successView');
      sv.style.display = 'flex';
    }, 1800);
  }
