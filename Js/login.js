// ── Demo credentials
  const DEMO = { email: 'demo@simfac.app', password: 'demo1234' };

  // ── Toggle password visibility
  function togglePw() {
    const inp = document.getElementById('password');
    const isHidden = inp.type === 'password';
    inp.type = isHidden ? 'text' : 'password';
    document.getElementById('eyeIcon').style.opacity = isHidden ? '.35' : '1';
  }

  // ── Validate
  function validate() {
    let ok = true;
    const email = document.getElementById('email').value.trim();
    const pw    = document.getElementById('password').value;

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    document.getElementById('email').classList.toggle('has-error', !emailOk);
    document.getElementById('emailErr').classList.toggle('show', !emailOk);
    if (!emailOk) ok = false;

    const pwOk = pw.length >= 1;
    document.getElementById('password').classList.toggle('has-error', !pwOk);
    document.getElementById('pwErr').classList.toggle('show', !pwOk);
    if (!pwOk) ok = false;

    return ok;
  }

  // ── Loading state
  function setLoading(loading) {
    const btn = document.getElementById('btnLogin');
    btn.disabled = loading;
    document.getElementById('btnText').textContent = loading ? 'Verificando...' : 'Entrar a mi panel';
    document.getElementById('spinner').style.display  = loading ? 'block' : 'none';
    document.getElementById('btnArrow').style.display = loading ? 'none'  : 'block';
  }

  // ── Show error
  function showError(msg) {
    const b = document.getElementById('errorBanner');
    document.getElementById('errorMsg').textContent = msg;
    b.classList.remove('show');
    void b.offsetWidth; // reflow for shake animation
    b.classList.add('show');
  }

  // ── Login flow
  function doLogin() {
    document.getElementById('errorBanner').classList.remove('show');
    if (!validate()) return;

    const email = document.getElementById('email').value.trim();
    const pw    = document.getElementById('password').value;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Simulate wrong credentials (unless demo)
      if (email === DEMO.email && pw === DEMO.password) {
        window.location.href = 'dashboard.html';
      } else if (email.includes('@') && pw.length >= 8) {
        // Simulate "found" user for demo purposes
        window.location.href = 'dashboard.html';
      } else {
        showError('Correo o contraseña incorrectos. Intenta de nuevo.');
        document.getElementById('password').value = '';
        document.getElementById('password').classList.remove('has-error');
      }
    }, 1600);
  }

  // ── Demo login
  function demoLogin() {
    document.getElementById('email').value    = DEMO.email;
    document.getElementById('password').value = DEMO.password;
    document.getElementById('email').classList.remove('has-error');
    document.getElementById('password').classList.remove('has-error');
    document.getElementById('emailErr').classList.remove('show');
    document.getElementById('pwErr').classList.remove('show');
    document.getElementById('errorBanner').classList.remove('show');

    setTimeout(() => doLogin(), 300);
  }

  // ── Enter key
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
  });

  // ── Live clear errors on input
  document.getElementById('email').addEventListener('input', () => {
    document.getElementById('email').classList.remove('has-error');
    document.getElementById('emailErr').classList.remove('show');
  });
  document.getElementById('password').addEventListener('input', () => {
    document.getElementById('password').classList.remove('has-error');
    document.getElementById('pwErr').classList.remove('show');
  });

  // ── Forgot password modal
  function openForgot(e) {
    e.preventDefault();
    document.getElementById('forgotModal').classList.add('open');
    document.getElementById('forgotEmail').value = document.getElementById('email').value;
    setTimeout(() => document.getElementById('forgotEmail').focus(), 100);
  }

  function closeModal() {
    document.getElementById('forgotModal').classList.remove('open');
    setTimeout(() => {
      document.getElementById('forgotForm').style.display = 'block';
      document.getElementById('forgotSuccess').style.display = 'none';
    }, 300);
  }

  function sendReset() {
    const emailVal = document.getElementById('forgotEmail').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      document.getElementById('forgotEmail').classList.add('has-error');
      return;
    }
    document.getElementById('forgotForm').style.display = 'none';
    document.getElementById('forgotSuccess').style.display = 'flex';
  }

  // Close modal on overlay click
  document.getElementById('forgotModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });
