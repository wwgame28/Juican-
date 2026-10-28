(function () {
  var S = window.SITE || {};
  var has = function (v) { return typeof v === 'string' ? v.trim() !== '' : !!v; };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  // Данные из config.js. Пустые поля остаются заглушками и подсвечиваются.
  $$('[data-k]').forEach(function (el) {
    var v = S[el.getAttribute('data-k')];
    if (has(v)) el.textContent = v;
    else el.classList.add('ph');
  });

  var links = {
    tel: has(S.phone) ? 'tel:' + S.phone.replace(/[^\d+]/g, '') : '',
    max: S.max || '',
    telegram: S.telegram || '',
    email: has(S.ownerEmail) ? 'mailto:' + S.ownerEmail : '',
    site: S.siteUrl || ''
  };
  $$('[data-href]').forEach(function (el) {
    var href = links[el.getAttribute('data-href')];
    if (href) el.setAttribute('href', href);
    else if (el.getAttribute('data-href') === 'email' || el.getAttribute('data-href') === 'site') el.removeAttribute('href');
    else el.hidden = true;
  });

  $$('[data-show]').forEach(function (el) {
    var key = el.getAttribute('data-show');
    // ОГРНИП прячем, только когда статус уже указан, а номера нет (самозанятому он не нужен).
    var visible = key === 'ownerOgrnip' ? (has(S.ownerOgrnip) || !has(S.ownerStatus)) : S[key] !== false;
    if (!visible) el.hidden = true;
  });
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Шапка получает границу после начала прокрутки.
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Мобильное меню
  var menuBtn = document.querySelector('.menu-btn');
  var mobileNav = document.getElementById('mobile-nav');
  if (menuBtn && mobileNav) {
    var setMenu = function (open) {
      mobileNav.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
      menuBtn.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
    };
    menuBtn.addEventListener('click', function () { setMenu(!mobileNav.classList.contains('open')); });
    $$('a', mobileNav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
    });
  }

  // Плавное появление блоков при прокрутке
  var reveals = $$('.reveal');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (el.closest('.hero') ? Math.min(i, 6) * 70 : 0) + 'ms';
      io.observe(el);
    });
  }

  // Китайский адрес для таксиста
  $$('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = S[btn.getAttribute('data-copy')] || '';
      var label = btn.querySelector('span');
      var status = document.getElementById('copy-status');
      var done = function (ok) {
        label.textContent = ok ? 'Адрес скопирован' : 'Не получилось, выделите адрес выше';
        if (status) status.textContent = label.textContent;
        setTimeout(function () { label.textContent = 'Скопировать адрес для таксиста'; }, 3000);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      else done(false);
    });
  });

  // Cookie. Яндекс Метрика загружается только после согласия и только если указан номер счётчика.
  var banner = document.getElementById('cookie');
  var COOKIE_KEY = 'cookie-choice';
  var metrikaLoaded = false;
  function loadMetrika() {
    if (metrikaLoaded || !has(S.metrikaId)) return;
    metrikaLoaded = true;
    (function (m, e, t, r, i, k, a) {
      m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
      m[i].l = 1 * new Date();
      k = e.createElement(t); a = e.getElementsByTagName(t)[0]; k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
    // Вебвизор выключен: он записывает ввод в формы, то есть персональные данные.
    window.ym(Number(S.metrikaId), 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: false });
  }
  if (banner) {
    var necessaryBtn = banner.querySelector('[data-cookie="necessary"]');
    var allBtn = banner.querySelector('[data-cookie="all"]');
    if (has(S.metrikaId)) {
      banner.querySelector('[data-cookie-text]').textContent = 'Мы используем cookie Яндекс Метрики, чтобы видеть статистику посещений. Данные обрабатываются в России. Без вашего согласия Метрика не включается.';
      necessaryBtn.hidden = false;
      allBtn.textContent = 'Принять';
    }
    var choice = store.get(COOKIE_KEY);
    if (!choice) banner.hidden = false;
    else if (choice === 'all') loadMetrika();
    $$('[data-cookie]', banner).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var value = btn.getAttribute('data-cookie');
        var prev = store.get(COOKIE_KEY);
        store.set(COOKIE_KEY, value);
        banner.hidden = true;
        if (value === 'all') loadMetrika();
        else if (prev === 'all' && metrikaLoaded) location.reload();
      });
    });
    $$('[data-cookie-open]').forEach(function (btn) {
      btn.addEventListener('click', function () { banner.hidden = false; allBtn.focus(); });
    });
  }

  // Форма заявки
  var form = document.getElementById('lead-form');
  if (form) {
    var status = form.querySelector('.form-status');
    var submit = form.querySelector('[type="submit"]');
    var setErr = function (input, errId, msg) {
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      var el = document.getElementById(errId);
      if (el) el.textContent = msg || '';
      return !msg;
    };
    var validate = function () {
      var ok = true;
      var name = form.elements.name, phone = form.elements.phone, consent = form.elements.consent;
      var digits = phone.value.replace(/\D/g, '');
      ok = setErr(name, 'f-name-err', name.value.trim().length < 2 ? 'Напишите, как к вам обращаться' : '') && ok;
      ok = setErr(phone, 'f-phone-err', digits.length < 10 || digits.length > 15 ? 'Проверьте номер: нужно 10–11 цифр' : '') && ok;
      ok = setErr(consent, 'f-consent-err', consent.checked ? '' : 'Без согласия я не могу принять заявку. Можно просто позвонить.') && ok;
      return ok;
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form-status full';
      status.textContent = '';
      if (!validate()) {
        var first = form.querySelector('[aria-invalid="true"]');
        if (first) first.focus();
        return;
      }
      if (form.elements.website.value) { status.textContent = 'Спасибо!'; return; }
      if (!has(S.formEndpoint)) {
        status.className = 'form-status full bad';
        status.textContent = 'Приём заявок через сайт пока не подключён. Позвоните ' + (S.phone || '') + ' или напишите в MAX.';
        return;
      }
      var data = new FormData(form);
      data.append('consent_version', S.docsDate || '');
      data.append('page', location.href);
      submit.disabled = true;
      fetch(S.formEndpoint, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json().catch(function () { return {}; }); })
        .then(function () {
          form.reset();
          status.className = 'form-status full ok';
          status.textContent = 'Заявка отправлена. Перезвоню, как только смогу.';
        })
        .catch(function () {
          status.className = 'form-status full bad';
          status.textContent = 'Не получилось отправить. Позвоните ' + (S.phone || '') + ', пожалуйста.';
        })
        .then(function () { submit.disabled = false; });
    });
    form.elements.consent.addEventListener('change', function () {
      if (form.elements.consent.checked) setErr(form.elements.consent, 'f-consent-err', '');
    });
  }
})();
