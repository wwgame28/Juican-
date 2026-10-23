// Жуйкан v2: маршрут через Амур, переключатель дороги, просмотр фото, адрес для водителя.
const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Рисует линию от начала к концу; маркер едет по первому пути. Возвращает функцию отмены.
function drawPaths(paths, { duration = 1400, marker, onDone } = {}) {
  const length = paths[0].getTotalLength();
  const finish = () => {
    paths.forEach((p) => { p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; });
    marker?.classList.remove('is-moving');
    onDone?.();
  };
  if (reduceMotion.matches || !length) { finish(); return () => {}; }

  paths.forEach((p) => { p.style.strokeDasharray = `${length} ${length}`; p.style.strokeDashoffset = `${length}`; });
  marker?.classList.add('is-moving');
  let frame;
  let start;
  const step = (now) => {
    start ??= now;
    const t = Math.min(1, (now - start) / duration);
    const done = length * easeInOut(t);
    paths.forEach((p) => { p.style.strokeDashoffset = `${length - done}`; });
    if (marker) {
      const pt = paths[0].getPointAtLength(done);
      marker.setAttribute('cx', pt.x);
      marker.setAttribute('cy', pt.y);
    }
    if (t < 1) frame = requestAnimationFrame(step);
    else finish();
  };
  frame = requestAnimationFrame(step);
  return () => { cancelAnimationFrame(frame); finish(); };
}

// Первый экран: маршрут от точки «Благовещенск» через реку к точке «Хэйхэ».
function initHeroRoute() {
  const hero = document.querySelector('.hero');
  const svg = hero?.querySelector('.hero__route');
  if (!svg) return;
  const paths = [...svg.querySelectorAll('path')];
  const marker = svg.querySelector('.route-marker');
  const from = hero.querySelector('#pin-ru .pin__dot');
  const to = hero.querySelector('#pin-cn .pin__dot');

  const layout = () => {
    const box = hero.getBoundingClientRect();
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    const x1 = a.left + a.width / 2 - box.left;
    const y1 = a.bottom - box.top;
    const x2 = b.left + b.width / 2 - box.left;
    const y2 = b.top - box.top;
    const bend = (y2 - y1) * 0.6;
    svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    const d = `M${x1} ${y1} C${x1} ${y1 + bend} ${x2} ${y2 - bend} ${x2} ${y2}`;
    paths.forEach((p) => p.setAttribute('d', d));
  };

  let cancel = () => {};
  // Фото клиники открывается после прибытия маршрута, но только когда его видно на экране.
  const arrive = () => {
    root.classList.add('arrived');
    const photo = hero.querySelector('.hero__photo');
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { root.classList.add('photo-in'); io.disconnect(); }
    }, { threshold: 0.1 });
    io.observe(photo);
  };
  const start = () => {
    layout();
    cancel = drawPaths(paths, { duration: 1500, marker, onDone: arrive });
  };

  // Позиции точек зависят от шрифтов, поэтому ждём их загрузки.
  const ready = document.fonts?.ready ?? Promise.resolve();
  ready.then(() => setTimeout(start, reduceMotion.matches ? 0 : 300));

  let resizeTimer;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { cancel(); layout(); }, 120);
  });
}

// «Дорога»: вкладки автобус/теплоход и перерисовка маршрута на схеме.
function initRouteTabs() {
  const tabs = [...document.querySelectorAll('.route__tab')];
  const map = document.querySelector('.map');
  if (!tabs.length || !map) return;
  const marker = map.querySelector('.map__marker');
  let cancel = () => {};

  const select = (tab, { focus = false } = {}) => {
    if (tab.getAttribute('aria-selected') === 'true') return;
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
    cancel();
    map.dataset.mode = tab.dataset.mode;
    cancel = drawPaths([map.querySelector(`[data-route="${tab.dataset.mode}"]`)], { duration: 1300, marker });
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      const keys = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
      if (!(e.key in keys)) return;
      e.preventDefault();
      select(tabs[(keys[e.key] + tabs.length) % tabs.length], { focus: true });
    });
  });
}

// Плавный переход «миниатюра → крупный вид» там, где есть View Transitions.
function withTransition(fromEl, toEl, update) {
  if (!document.startViewTransition || reduceMotion.matches || !fromEl || !toEl) { update(); return; }
  fromEl.style.viewTransitionName = 'zoom';
  const vt = document.startViewTransition(() => {
    fromEl.style.viewTransitionName = '';
    toEl.style.viewTransitionName = 'zoom';
    update();
  });
  vt.finished.finally(() => { toEl.style.viewTransitionName = ''; });
}

// Фото: прокрутка ленты и просмотр на весь экран.
function initGallery() {
  const items = [...document.querySelectorAll('.gallery__item')];
  const strip = document.querySelector('.gallery');
  const dialog = document.getElementById('lightbox');
  if (!items.length || !dialog) return;
  const img = dialog.querySelector('.lightbox__img');
  const caption = dialog.querySelector('.lightbox__caption');
  const count = dialog.querySelector('.lightbox__count');
  let current = 0;

  document.querySelectorAll('[data-scroll]').forEach((btn) => {
    btn.addEventListener('click', () => {
      strip.scrollBy({ left: Number(btn.dataset.scroll) * strip.clientWidth * 0.8, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    });
  });
  const checkOverflow = () => root.classList.toggle('no-scroll', strip.scrollWidth <= strip.clientWidth + 4);
  checkOverflow();
  addEventListener('resize', checkOverflow);

  const show = (i, src) => {
    current = (i + items.length) % items.length;
    const item = items[current];
    const thumb = item.querySelector('img');
    img.src = src ?? item.dataset.full;
    img.alt = thumb.alt;
    caption.textContent = item.dataset.caption;
    count.textContent = `${current + 1} из ${items.length}`;
  };

  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      const thumb = item.querySelector('img');
      const full = new Image();
      full.src = item.dataset.full;
      // Для перехода берём уже загруженную миниатюру, крупный файл подставляем после открытия.
      withTransition(thumb, img, () => {
        show(i, thumb.currentSrc || thumb.src);
        dialog.showModal();
        full.decode().then(() => { if (current === i && dialog.open) img.src = full.src; }).catch(() => {});
      });
    });
  });

  dialog.querySelector('.lightbox__prev').addEventListener('click', () => show(current - 1));
  dialog.querySelector('.lightbox__next').addEventListener('click', () => show(current + 1));
  dialog.querySelector('.lightbox__close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog || e.target.classList.contains('lightbox__figure')) dialog.close(); });
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'ArrowLeft') show(current - 1);
  });
  dialog.addEventListener('close', () => items[current].focus());

  let startX = null;
  img.addEventListener('pointerdown', (e) => { startX = e.clientX; });
  img.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
  });
}

// Адрес: копирование и крупный экран для водителя такси.
function initAddress() {
  const cn = document.querySelector('.address__cn');
  const status = document.querySelector('.address__status');
  const driver = document.getElementById('driver');
  const copyBtn = document.querySelector('[data-copy-address]');
  const showBtn = document.querySelector('[data-show-driver]');
  if (!cn || !driver) return;

  copyBtn?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(cn.textContent.trim());
      status.textContent = 'Адрес на китайском скопирован.';
    } catch {
      status.textContent = 'Не получилось скопировать. Нажмите «Показать водителю».';
    }
  });

  const text = driver.querySelector('.driver__text');
  showBtn?.addEventListener('click', () => withTransition(cn, text, () => driver.showModal()));
  driver.querySelector('.driver__close').addEventListener('click', () => driver.close());
  driver.addEventListener('close', () => showBtn?.focus());
}

// Меню на телефоне.
function initMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;
  const set = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  };
  toggle.addEventListener('click', () => set(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { set(false); toggle.focus(); }
  });
}

initHeroRoute();
initRouteTabs();
initGallery();
initAddress();
initMenu();
