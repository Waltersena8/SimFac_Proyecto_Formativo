/* ============================================================
   SimFac — script.js
   JavaScript GLOBAL, compartido por las 10 páginas.
   Se carga DESPUÉS del bundle de Bootstrap y ANTES del script
   propio de cada página (Js/<pagina>.js).
   ============================================================ */

// Mensaje de marca en consola (solo decorativo)
console.log(
  '%cSimFac%c · Menús digitales para restaurantes',
  'color:#F5A623;font-weight:bold;font-size:14px;',
  'color:#7A7060;font-size:12px;'
);

/**
 * Resalta automáticamente, en el menú lateral del panel de
 * administración, el enlace que corresponde a la página actual.
 * Si la página no tiene sidebar (Landing, Login, Registro, Menú,
 * Carrito, Confirmación) esta función simplemente no encuentra
 * nada que hacer y no afecta en nada.
 */
document.addEventListener('DOMContentLoaded', function () {
  var current = window.location.pathname.split('/').pop();
  var links = document.querySelectorAll('.sidebar-nav .nav-item');
  if (!links.length) return;

  links.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href === current) {
      links.forEach(function (l) { l.classList.remove('active'); });
      link.classList.add('active');
    }
  });
});
