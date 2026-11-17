/* AyaFey — интерактивность. Номер меняется только здесь и в href="tel:" */
(function () {
  'use strict';
  var PHONE = '+79001001222';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* Все кнопки записи ведут на звонок */
  $$('[data-call]').forEach(function (a) { a.setAttribute('href', 'tel:' + PHONE); });
  $('#year').textContent = new Date().getFullYear();

  /* Шапка и мобильное меню */
  var header = $('#header'), nav = $('#nav'), burger = $('#burger');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* Появление при прокрутке */
  var items = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add('in'); }); }

  /* Параллакс + состояние шапки */
  var par = $$('[data-parallax]'), ticking = false;
  function frame() {
    var y = window.scrollY, vh = window.innerHeight;
    header.classList.toggle('solid', y > 40);
    if (!reduce) par.forEach(function (el) {
      var r = el.parentNode.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      el.style.transform = 'translate3d(0,' + ((r.top + r.height / 2 - vh / 2) * -parseFloat(el.dataset.parallax)).toFixed(1) + 'px,0)';
    });
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  frame();

  /* Резервное изображение, если фото не загрузилось */
  var ph = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="600" fill="#12151a"/><path d="M0 600 800 0M0 0l800 600" stroke="#1d2a47" stroke-width="2"/><text x="400" y="310" fill="#4a74d9" font-family="Georgia,serif" font-size="46" text-anchor="middle">AyaFey</text></svg>');
  function fallback(img) { if (img.dataset.failed) return; img.dataset.failed = 1; img.src = ph; }
  $$('img').forEach(function (img) {
    img.addEventListener('error', function () { fallback(img); });
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) fallback(img);
  });

  /* Галерея: просмотр крупнее */
  var lb = $('#lb'), lbi = $('#lbi');
  $$('[data-full]').forEach(function (b) {
    b.addEventListener('click', function () {
      var im = $('img', b);
      lbi.src = im.src.replace(/w=\d+/, 'w=1800'); lbi.alt = im.alt;
      lbi.onerror = function () { lbi.src = im.src; lbi.onerror = null; };
      if (lb.showModal) lb.showModal(); else lb.setAttribute('open', '');
    });
  });
  function closeLb() { if (lb.close) lb.close(); else lb.removeAttribute('open'); }
  $('#lbx').addEventListener('click', closeLb);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
})();
