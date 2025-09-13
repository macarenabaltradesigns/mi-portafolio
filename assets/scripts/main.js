// main.js
// ------------------------------------------------------------
// Propósito:
//  - Funciones utilitarias de la UI (tabs, stats, breadcrumb, tooltips).
//  - Gestión de imágenes responsive / retina y modal ligero para imágenes/videos.
// Autor: Macarena Baltra — Product & UX Designer
// Fecha: 12-09-2025
// ------------------------------------------------------------


(function () {
  'use strict';

  const DEBUG = false;
  const log = (...args) => { if (DEBUG) console.log('[main]', ...args); };

  /* ------------------ Helpers ------------------ */

  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else setTimeout(fn, 0);
  }

  function safeQuery(sel, ctx = document) {
    try { return ctx.querySelector(sel); } catch (e) { return null; }
  }

  function safeQueryAll(sel, ctx = document) {
    try { return Array.from((ctx || document).querySelectorAll(sel)); } catch (e) { return []; }
  }

  function debounce(fn, wait = 150) {
    let t;
    return function () {
      const args = arguments;
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function normalizeAssetPath(p) {
    if (!p) return p;
    if (location && location.protocol === 'file:' && p.startsWith('/')) {
      return p.replace(/^\/+/, '');
    }
    return p;
  }

  function initTabs() {
    document.addEventListener('click', (ev) => {
      const tab = ev.target.closest('.tab');
      if (!tab) return;
      if (ev.target.tagName && ev.target.tagName.toLowerCase() === 'a') ev.preventDefault();

      let target = tab.dataset.target || tab.getAttribute('data-bs-target') || tab.getAttribute('href');
      if (!target) return;
      if (!target.startsWith('#')) target = `#${target}`;

      const allTabs = safeQueryAll('.tab');
      allTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const panels = safeQueryAll('.project-detail');
      panels.forEach(p => p.classList.remove('active'));
      const panel = safeQuery(target);
      if (panel) panel.classList.add('active');

      try { if (history && history.replaceState) history.replaceState(null, '', target); } catch (e) {}
    });

    document.addEventListener('keydown', (ev) => {
      const el = document.activeElement;
      if (!el || !el.classList || !el.classList.contains('tab')) return;
      const tabs = safeQueryAll('.tab');
      if (!tabs.length) return;
      const idx = tabs.indexOf(el);
      if (idx === -1) return;

      if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') {
        ev.preventDefault();
        const next = tabs[(idx + 1) % tabs.length];
        if (next) next.focus();
      } else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') {
        ev.preventDefault();
        const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
        if (prev) prev.focus();
      }
    });

    log('Tabs initialized');
  }

  function initStats() {
    const cards = safeQueryAll('.stat-card');
    if (!cards.length) return;

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const card = entry.target;
        const value = Number(card.dataset.value || 0);
        const numberEl = card.querySelector('.stat-number');
        const circle = card.querySelector('.radial-fg');

        if (circle && circle.tagName && circle.tagName.toLowerCase() === 'circle') {
          try {
            const rVal = circle.r && circle.r.baseVal ? circle.r.baseVal.value : Number(circle.getAttribute('r')) || 0;
            const radius = Number(rVal) || 0;
            const circumference = 2 * Math.PI * radius;
            circle.style.strokeDasharray = `${circumference}`;
            circle.style.strokeDashoffset = `${circumference}`;
            requestAnimationFrame(() => {
              const offset = circumference * (1 - Math.max(0, Math.min(100, value)) / 100);
              circle.style.transition = 'stroke-dashoffset 1200ms ease';
              circle.style.strokeDashoffset = offset;
            });
          } catch (e) { console.warn('[main] svg animation error', e); }
        }

        if (numberEl) {
          const duration = 1400;
          const start = performance.now();
          const targetNum = Math.max(0, Math.floor(value));
          function tick(now) {
            const t = Math.min(1, (now - start) / duration);
            const current = Math.floor(t * targetNum);
            numberEl.textContent = current;
            if (t < 1) requestAnimationFrame(tick);
            else numberEl.textContent = targetNum;
          }
          requestAnimationFrame(tick);
        }

        obs.unobserve(card);
      });
    }, { threshold: 0.5 });

    cards.forEach(c => {
      try { io.observe(c); } catch (e) { /* ignore */ }
    });

    log('Stats initialized for', cards.length);
  }

  function initBreadcrumb() {
    const breadcrumbOl = safeQuery('#breadcrumb');
    if (!breadcrumbOl) return;
    if (breadcrumbOl.dataset.inited === '1') return;
    breadcrumbOl.dataset.inited = '1';

    const referrer = document.referrer || '';
    const pageTitle = document.title || '';
    let prevHref = 'index.html';
    let prevText = '← Volver a Home';

    if (referrer) {
      try {
        const urlAnt = new URL(referrer, location.href);
        let archivo = urlAnt.pathname.substring(urlAnt.pathname.lastIndexOf('/') + 1).toLowerCase();
        archivo = archivo || '';
        if (archivo) prevHref = archivo;
        if (archivo === 'index.html' || archivo === 'index-html') prevText = '← Volver a Home';
        else if (archivo === 'portfolio.html') prevText = '← Volver a Blog';
        else if (archivo === 'landing-blog.html' || archivo === 'landing-blog-html') prevText = '← Volver a Home';
        else prevText = '← Volver';
      } catch (e) { prevHref = 'index.html'; prevText = '← Volver a Home'; }
    }

    const liPrev = document.createElement('li');
    liPrev.className = 'breadcrumb-item';
    const aPrev = document.createElement('a');
    aPrev.href = prevHref;
    aPrev.textContent = prevText;
    liPrev.appendChild(aPrev);

    const liCurrent = document.createElement('li');
    liCurrent.className = 'breadcrumb-item active';
    liCurrent.setAttribute('aria-current', 'page');
    liCurrent.textContent = pageTitle;

    breadcrumbOl.appendChild(liPrev);
    breadcrumbOl.appendChild(liCurrent);

    log('Breadcrumb injected');
  }

  function initBootstrapUI() {
    try {
      if (window.bootstrap) {
        if (typeof bootstrap.Tooltip === 'function') {
          safeQueryAll('[data-bs-toggle="tooltip"]').forEach(el => {
            try { if (!el.dataset.bsTooltipInited) { new bootstrap.Tooltip(el); el.dataset.bsTooltipInited = '1'; } } catch (e) {}
          });
        }
        if (typeof bootstrap.Popover === 'function') {
          safeQueryAll('[data-bs-toggle="popover"]').forEach(el => {
            try { if (!el.dataset.bsPopoverInited) { new bootstrap.Popover(el); el.dataset.bsPopoverInited = '1'; } } catch (e) {}
          });
        }
      }
    } catch (e) { console.warn('[main] bootstrap init error', e); }
  }

  function initDataHires() {
    if (!window.responsiveLazyImages || typeof window.responsiveLazyImages.loadImage !== 'function') return;
    safeQueryAll('img[data-hires]').forEach(img => {
      try { window.responsiveLazyImages.loadImage(img); } catch (e) {}
    });
    log('data-hires processed');
  }

  function initCtaButtons() {
    function injectOnce(selector, htmlString) {
      const container = safeQuery(selector);
      if (!container || container.dataset.inited === '1') return;
      container.innerHTML = htmlString;
      container.dataset.inited = '1';
    }

    injectOnce('#cta-buttons-2', `
      <section>
        <div class="cta-group-center py-5">
          <a href="https://forms.gle/9m8BURuvUohX2iNE8" class="btn btn-primary my-2" aria-label="Cotizar" title="Cotizar" data-bs-toggle="tooltip" target="_blank" rel="noopener">Cotizar proyecto</a>
          <a href="assets/CV2025-azul.pdf" download="CV2025-azul.pdf" class="btn btn-secondary my-2" aria-label="Ver currículum" title="Ver currículum" data-bs-toggle="tooltip" target="_blank" rel="noopener">Descargar CV</a>
        </div>
      </section>
    `);

    injectOnce('#cta-buttons-2b', `
      <section>
        <div class="cta-group-center py-5">
          <a href="https://wa.me/message/2KZW3XDAWMFAJ1" class="btn btn-secondary my-2" target="_blank" aria-label="Contactar por WhatsApp" title="Contactar por WhatsApp" data-bs-toggle="tooltip" rel="noopener">Contactar por WhatsApp</a>
          <a href="assets/CV2025-azul.pdf" download="CV2025-azul.pdf" class="btn btn-primary my-2" target="_blank" aria-label="Ver currículum" title="Ver currículum" data-bs-toggle="tooltip" rel="noopener">Descargar CV</a>
        </div>
      </section>
    `);

    log('CTAs handled');
  }

  function applyRetinaSrcset(img) {
    try {
      if (!img || !img.getAttribute) return;
      if (img.closest && img.closest('picture')) return;
      if (img.getAttribute('srcset')) return;

      const src = img.getAttribute('src');
      if (!src || src.includes('@2x')) return;
      const idx = src.lastIndexOf('.');
      if (idx === -1) return;
      const base = src.slice(0, idx);
      const ext = src.slice(idx);
      const webp2x = `${base}@2x.webp`;
      const def2x = `${base}@2x${ext}`;

      const tester = new Image();
      tester.onload = () => { try { img.setAttribute('srcset', `${src} 1x, ${webp2x} 2x`); } catch (e) {} };
      tester.onerror = () => { try { img.setAttribute('srcset', `${src} 1x, ${def2x} 2x`); } catch (e) {} };
      tester.src = normalizeAssetPath(webp2x);
    } catch (e) {
      if (DEBUG) console.warn('[applyRetinaSrcset] error', e);
    }
  }

  function initRetina() {
    safeQueryAll('img').forEach(applyRetinaSrcset);
    log('Retina srcset applied');
  }

  function initResponsiveImages() {
    const imgs = safeQueryAll('img[data-src-mobile][data-src-desktop]');
    if (!imgs.length) { log('No responsive images found'); return; }

    function buildSrcsetString(img) {
      const mobile = img.dataset.srcMobile ? normalizeAssetPath(img.dataset.srcMobile) : null;
      const desktop = img.dataset.srcDesktop ? normalizeAssetPath(img.dataset.srcDesktop) : null;
      const mobile2x = img.dataset.srcMobile2x ? normalizeAssetPath(img.dataset.srcMobile2x) : null;
      const desktop2x = img.dataset.srcDesktop2x ? normalizeAssetPath(img.dataset.srcDesktop2x) : null;
      const mobileW = parseInt(img.dataset.srcMobileWidth, 10) || 375;
      const desktopW = parseInt(img.dataset.srcDesktopWidth, 10) || 1920;

      const parts = [];
      if (mobile) parts.push(`${mobile} ${mobileW}w`);
      if (mobile2x) parts.push(`${mobile2x} ${mobileW * 2}w`);
      if (desktop) parts.push(`${desktop} ${desktopW}w`);
      if (desktop2x) parts.push(`${desktop2x} ${desktopW * 2}w`);

      const unique = parts.filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);
      return unique.join(', ');
    }

    function updateAll() {
      imgs.forEach(img => {
        try {
          if (img.closest && img.closest('picture')) {
            if (DEBUG) log('[responsive] skip - inside picture', img);
            return;
          }
          if (img.getAttribute('srcset')) {
            if (DEBUG) log('[responsive] skip - has srcset', img);
            return;
          }

          const srcset = buildSrcsetString(img);
          const sizes = img.dataset.sizes || '(max-width:767px) 100vw, (max-width:1366px) 80vw, 1920px';
          const isLazy = img.classList.contains('lazy') || img.getAttribute('loading') === 'lazy' || img.dataset.lazy === 'true';

          if (isLazy) {
            if (srcset) img.dataset.srcset = srcset;
            if (!img.dataset.src && img.dataset.srcMobile) {
              img.dataset.src = normalizeAssetPath(img.dataset.srcMobile);
            }
            if (sizes) img.dataset.sizes = sizes;
            if (DEBUG) log('[responsive] set data-srcset for lazy', img, img.dataset.srcset);
          } else {
            if (srcset) img.setAttribute('srcset', srcset);
            if (sizes) img.setAttribute('sizes', sizes);
            if (!img.getAttribute('src')) {
              const fallback = img.dataset.srcMobile ? normalizeAssetPath(img.dataset.srcMobile) : (img.dataset.srcDesktop ? normalizeAssetPath(img.dataset.srcDesktop) : '');
              if (fallback) img.setAttribute('src', fallback);
            }
            if (DEBUG) log('[responsive] set srcset/sizes immediate', img, srcset, sizes);
          }
        } catch (err) {
          if (DEBUG) console.warn('[responsive] update img error', err, img);
        }
      });
    }

    updateAll();
    window.addEventListener('resize', debounce(updateAll, 180));

    let lastDPR = window.devicePixelRatio || 1;
    setInterval(() => {
      const dpr = window.devicePixelRatio || 1;
      if (dpr !== lastDPR) {
        lastDPR = dpr;
        updateAll();
      }
    }, 1000);

    log('Responsive images initialized:', imgs.length);
  }

  function initEncodeSpecialChars() {
    function encodeSpecialChars(root = document.body) {
      if (!root) return;
      const filter = {
        acceptNode(node) {
          if (!node.parentElement) return NodeFilter.FILTER_REJECT;
          let el = node.parentElement;
          while (el) {
            const tag = el.nodeName.toLowerCase();
            if (['code', 'pre', 'textarea', 'script', 'style'].includes(tag)) return NodeFilter.FILTER_REJECT;
            el = el.parentElement;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      };

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, filter, false);
      const replacements = [
        [/&(?!#?\w+;)/g, '&amp;'],
        [/</g, '&lt;'],
        [/>/g, '&gt;'],
        [/"/g, '&quot;'],
        [/'/g, '&#39;']
      ];

      const toReplace = [];
      let node;
      while ((node = walker.nextNode())) {
        let text = node.nodeValue;
        if (!/[&<>"']/.test(text)) continue;
        replacements.forEach(([re, ent]) => { text = text.replace(re, ent); });
        if (text !== node.nodeValue) toReplace.push({ node, html: text });
      }

      toReplace.forEach(item => {
        const span = document.createElement('span');
        span.innerHTML = item.html;
        try { item.node.parentNode.replaceChild(span, item.node); } catch (e) {}
      });
    }

    try { encodeSpecialChars(); } catch (e) { console.warn('[main] encode initial failed', e); }

    try {
      const observer = new MutationObserver((mutations, obs) => {
        obs.disconnect();
        mutations.forEach(m => {
          m.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              try { encodeSpecialChars(node); } catch (err) { console.error('[main] encode error on node', err); }
            }
          });
        });
        obs.observe(document.body, { childList: true, subtree: true });
      });
      if (document.body) observer.observe(document.body, { childList: true, subtree: true });
    } catch (e) { console.warn('[main] MutationObserver failed', e); }

    log('encodeSpecialChars initialized');
  }

  /* ------------------ Modal (Bootstrap 5) ------------------ */

  function isLogoLike(el, src) {
    try {
      if (!el && !src) return false;
      // explicit override
      if (el && el.getAttribute && el.getAttribute('data-open-modal') === 'true') return false;

      const s = (src || '').toLowerCase();
      const file = s.split('/').pop() || '';

      if (file.includes('logo')) return true;
      if (/\blogo\b/i.test(file)) return true;

      const attrs = [];
      if (el && el.getAttribute) {
        attrs.push((el.getAttribute('alt') || '').toLowerCase());
        attrs.push((el.getAttribute('title') || '').toLowerCase());
        attrs.push((el.getAttribute('aria-label') || '').toLowerCase());
      }
      if (attrs.join(' ').indexOf('logo') !== -1) return true;
      if (el && el.classList && Array.from(el.classList).some(c => /logo/i.test(c))) return true;

      return false;
    } catch (e) {
      if (DEBUG) console.warn('[modal] isLogoLike error', e);
      return false;
    }
  }

  /**
   * Crea (o devuelve) el modal dinámico para imágenes/videos.
   * Usa estructura recomendada por Bootstrap 5.
   * @returns {HTMLElement} modalEl
   */
  function createOrGetImageModal() {
    const existing = document.getElementById('imageModal');
    if (existing) return existing;

    const wrapper = document.createElement('div');
    wrapper.id = 'imageModal';
    wrapper.className = 'modal fade';
    wrapper.tabIndex = -1;
    wrapper.setAttribute('role', 'dialog');
    wrapper.setAttribute('aria-hidden', 'true');

    // modal-dialog (fullscreen small down + centered)
    wrapper.innerHTML = `
      <div class="modal-dialog modal-fullscreen-sm-down modal-dialog-centered modal-lg" role="document">
        <div class="modal-content bg-transparent border-0">
          <div class="modal-body d-flex justify-content-center align-items-center position-relative p-3" style="min-height: 280px;">
            <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            <img id="modalImage" class="img-fluid d-none rounded" alt="" loading="eager" />
            <video id="modalVideo" class="w-100 d-none rounded" controls preload="metadata" style="max-height:80vh;">
              <source id="modalVideoSource" src="" type="video/mp4" />
              Tu navegador no soporta video.
            </video>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(wrapper);

    return wrapper;
  }

  /**
   * Limpia media del modal (pausar video, limpiar srcs)
   * @param {HTMLElement} modalEl
   */
  function cleanupModalMedia(modalEl) {
    try {
      const img = modalEl.querySelector('#modalImage');
      const video = modalEl.querySelector('#modalVideo');
      const vSource = modalEl.querySelector('#modalVideoSource');

      if (video) {
        try { video.pause(); } catch (e) {}
        if (vSource && vSource.src) vSource.src = '';
        try { video.removeAttribute('src'); video.load && video.load(); } catch (e) {}
        video.classList.add('d-none');
      }
      if (img) {
        img.removeAttribute('src');
        img.removeAttribute('srcset');
        img.removeAttribute('alt');
        img.classList.add('d-none');
      }
    } catch (e) { if (DEBUG) console.warn('[modal] cleanupModalMedia', e); }
  }

  /**
   * Limpieza de backdrops huérfanos y restauración de body.
   */
  function cleanupBackdropsAndBody() {
    try {
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(b => {
        try { b.remove(); } catch (e) {}
      });
      document.body.classList.remove('modal-open');
      document.body.style.paddingRight = '';
    } catch (e) { if (DEBUG) console.warn('[modal] cleanupBackdropsAndBody', e); }
  }

  /**
   * Inicializa la delegación para abrir imágenes/videos en el modal creado.
   * Detecta:
   *  - <img data-bs-toggle="modal" data-bs-target="#imageModal" data-full="...">
   *  - cualquier elemento con [data-full]
   *  - background images (se intenta extraer url)
   */
  function initFreshImageModal() {
    const modalEl = createOrGetImageModal();
    const modalImg = modalEl.querySelector('#modalImage');
    const modalVideo = modalEl.querySelector('#modalVideo');
    const modalVideoSource = modalEl.querySelector('#modalVideoSource');
    const hasBootstrap = !!(window.bootstrap && typeof bootstrap.Modal === 'function');
    const bsInstance = hasBootstrap ? new bootstrap.Modal(modalEl, { backdrop: true, keyboard: true }) : null;

    let lastTrigger = null;

    // Cuando el modal esté oculto: limpiar medios y restaurar el foco/fondos
    modalEl.addEventListener('hidden.bs.modal', function () {
      try {
        cleanupModalMedia(modalEl);
        cleanupBackdropsAndBody();
        if (lastTrigger && typeof lastTrigger.focus === 'function') {
          try { lastTrigger.focus({ preventScroll: false }); } catch (e) { try { lastTrigger.focus(); } catch (err) {} }
        }
        lastTrigger = null;
      } catch (e) { if (DEBUG) console.warn('[modal] hidden handler', e); }
    });

    // Controlador que oculta
    modalEl.addEventListener('hide.bs.modal', function () {
      try { /* Oculta rápidamente las piezas internas para evitar imágenes fantasma. */ cleanupModalMedia(modalEl); } catch (e) {}
    });

    // Controlador de clics
    document.addEventListener('click', function (ev) {
      try {
        const trigger = ev.target.closest('img[data-bs-toggle="modal"], [data-full]');
        if (!trigger) return;

        let full = null;
        let isVideo = false;
        // prioridad: explicit data-full attribute
        const df = trigger.closest && trigger.closest('[data-full]') ? trigger.closest('[data-full]') : null;
        if (df) {
          full = df.getAttribute('data-full') || df.dataset && df.dataset.full || null;
        }
        // Si hace clic en una img, responde a src/currentSrc
        if (!full && trigger.tagName && trigger.tagName.toLowerCase() === 'img') {
          full = trigger.getAttribute('data-full') || trigger.dataset && trigger.dataset.full || trigger.currentSrc || trigger.getAttribute('src') || null;
        }
        // Si aún no lo encuentras, revisa el estilo de la imagen de fondo en el "árbol".
        if (!full) {
          let el = trigger;
          while (el) {
            try {
              const style = window.getComputedStyle(el);
              const bg = style && style.backgroundImage;
              if (bg && bg !== 'none') {
                const m = bg.match(/url\((?:'|")?(.*?)(?:'|")?\)/);
                if (m && m[1]) { full = m[1]; break; }
              }
            } catch (e) {}
            el = el.parentElement;
          }
        }

        if (!full) return; // nada que mostrar

        full = normalizeAssetPath(full);
        isVideo = /\.(mp4|webm|ogg)$/i.test(full);

        // Skip logos unless explicit override
        if (isLogoLike(trigger, full)) {
          if (DEBUG) log('[modal] skip opening (logo-like):', full);
          return;
        }

        // Evitar la navegación si se está dentro de un enlace
        if (ev.target.closest && ev.target.closest('a')) ev.preventDefault();

        lastTrigger = trigger;

        // prepara elementos
        cleanupModalMedia(modalEl);

        if (isVideo && modalVideo && modalVideoSource) {
          modalVideoSource.src = full;
          modalVideo.load && modalVideo.load();
          modalVideo.classList.remove('d-none');
          try { modalVideo.play().catch(() => {}); } catch (e) {}
        } else if (modalImg) {
          modalImg.src = full;
          // Intenta copiar srcset desde el disparador (o data-srcset)
          try {
            const srcset = (trigger.getAttribute && trigger.getAttribute('srcset')) || (trigger.dataset && trigger.dataset.srcset) || null;
            if (srcset) modalImg.setAttribute('srcset', srcset);
          } catch (e) {}
          // respaldo alternativo
          try {
            const alt = trigger.getAttribute && trigger.getAttribute('alt');
            if (alt) modalImg.setAttribute('alt', alt);
          } catch (e) {}
          modalImg.classList.remove('d-none');
        }

        // Mostrar modal usando la API de Bootstrap si está disponible
        if (hasBootstrap && bsInstance) {
          try {
            bsInstance.show();
          } catch (e) {
            // manual de respaldo
            modalEl.classList.add('show');
            modalEl.style.display = 'block';
            document.body.classList.add('modal-open');
            if (!document.querySelector('.modal-backdrop')) {
              const bd = document.createElement('div');
              bd.className = 'modal-backdrop fade show';
              document.body.appendChild(bd);
            }
          }
        } else {
          // reserva mínima si el bootstrap no está presente
          modalEl.classList.add('show');
          modalEl.style.display = 'block';
          document.body.classList.add('modal-open');
          if (!document.querySelector('.modal-backdrop')) {
            const bd = document.createElement('div');
            bd.className = 'modal-backdrop fade show';
            document.body.appendChild(bd);
          }
        }
      } catch (err) {
        if (DEBUG) console.warn('[modal] delegate click error', err);
      }
    }, false);

    log('Fresh image modal initialized (Bootstrap present: ' + hasBootstrap + ')');
  }

  /* ------------------ Init all ------------------ */

  onReady(() => {
    try { initTabs(); } catch (e) { console.error('[main] initTabs failed', e); }
    try { initStats(); } catch (e) { console.error('[main] initStats failed', e); }
    try { initBreadcrumb(); } catch (e) { console.error('[main] initBreadcrumb failed', e); }
    try { initBootstrapUI(); } catch (e) { console.error('[main] initBootstrapUI failed', e); }
    try { initDataHires(); } catch (e) { console.error('[main] initDataHires failed', e); }
    try { initCtaButtons(); } catch (e) { console.error('[main] initCtaButtons failed', e); }
    try { initRetina(); } catch (e) { console.error('[main] initRetina failed', e); }
    try { initResponsiveImages(); } catch (e) { console.error('[main] initResponsiveImages failed', e); }
    try { initEncodeSpecialChars(); } catch (e) { console.error('[main] initEncodeSpecialChars failed', e); }
    try { initFreshImageModal(); } catch (e) { console.error('[main] initFreshImageModal failed', e); }
    log('main.js initialization complete');
  });

  /* ------------------ Small helper: getParam ------------------ */

  function getParam(name) {
    try { return new URLSearchParams(window.location.search).get(name); } catch (e) { return null; }
  }

  (function () {
    document.addEventListener('DOMContentLoaded', function () {
      try {
        if (getParam('missingArticle') === '1') {
          const modalEl = document.getElementById('modalMissingArticle');
          if (modalEl && window.bootstrap && typeof bootstrap.Modal === 'function') {
            const modal = new bootstrap.Modal(modalEl);
            modal.show();
            if (history.replaceState) {
              const url = new URL(window.location.href);
              url.searchParams.delete('missingArticle');
              history.replaceState({}, '', url.toString());
            }
          }
        }
      } catch (e) { /* ignore */ }
    });
  })();

})();