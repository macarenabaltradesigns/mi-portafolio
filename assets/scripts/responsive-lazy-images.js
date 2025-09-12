/** responsive-lazy-images.js
// ------------------------------------------------------------
 * Propósito:
 *  - Cargar imágenes responsivas de forma lazy (IntersectionObserver) y
 *    proporcionar una API para cargar imágenes puntuales.
 *  - Detecta `data-base="..."`, clases con prefijo `img-` o intenta derivar
 *    un "base name" desde el `src` cuando está permitido.
 *  - Soporta `data-image-mobile` / `data-image-desktop` para inyección directa.
 *  - Respeta elementos <picture> y cualquier <img> que ya tenga `srcset`.
 *
 * Características y mejoras:
 *  - Evita doble carga concurrente por elemento (flag `data-resp-loading`).
 *  - Timeout en verificación de URL para no bloquear el flujo.
 *  - Fallback controlado (data-fallback).
 *  - API pública: window.responsiveLazyImages.{init, loadImage, loadAll, refresh, configure}
 *  - Configuración por defecto, sobreescribible vía window.RESPONSIVE_LAZY_IMAGES_CONFIG
 *
 * Autor: Macarena Baltra — Product & UX Designer
 * Fecha: 12-09-2025.
 ------------------------------------------------------------ */

 
(function () {
  'use strict';

  /* -------------------- DEFAULT CONFIG -------------------- */
  const DEFAULT = {
    ASSETS_PATH: 'assets/img',
    SIZE_BUCKETS: [1920, 1366, 1024, 768, 375],
    EXTENSIONS: ['webp', 'jpg', 'png'],
    CLASS_PREFIX: 'img-',
    DATA_BASE_ATTR: 'data-base',
    DATA_IMAGE_MOBILE: 'data-image-mobile',
    DATA_IMAGE_DESKTOP: 'data-image-desktop',
    AUTO_PROCESS_ALL: false,       // si true intenta derivar base desde src cuando no haya data-base/class
    ROOT_MARGIN: '200px',
    DPR_MULT: true,                // multiplicar por devicePixelRatio en pickSize
    DEBUG: false,
    PRELOAD_TIMEOUT: 5000,         // ms para probar existencia de URL
    OBSERVER_THRESHOLD: 0.01
  };

  // Tomar configuración global si existe (permitir override)
  const cfg = Object.assign({}, DEFAULT, window.RESPONSIVE_LAZY_IMAGES_CONFIG || {});
  window.RESPONSIVE_LAZY_IMAGES_CONFIG = cfg; // exponer la configuración

  const log = (...args) => { if (cfg.DEBUG || (window.responsiveLazyImages && window.responsiveLazyImages.DEBUG)) console.log('[responsive-lazy-images]', ...args); };
  const warn = (...args) => { if (cfg.DEBUG) console.warn('[responsive-lazy-images]', ...args); };

  /* -------------------- UTILIDADES -------------------- */
  function isElement(el) { return el instanceof Element; }
  function safeQuery(selectorOrNode) {
    if (!selectorOrNode) return null;
    if (isElement(selectorOrNode)) return selectorOrNode;
    try { return document.querySelector(selectorOrNode); } catch (e) { return null; }
  }

  // detecta soporte webp de forma simple y cached
  const supportsWebP = (() => {
    try {
      const c = document.createElement('canvas');
      if (!c.getContext) return false;
      return c.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    } catch (e) {
      return false;
    }
  })();

  function getDPR() {
    return (window.devicePixelRatio && Number(window.devicePixelRatio)) || 1;
  }

  function normalizeAssetPath(p) {
    if (!p) return p;
    let s = String(p).trim();
    if (s.indexOf('//') === 0) return s;
    if (location && location.protocol === 'file:' && s.startsWith('/')) s = s.replace(/^\/+/, '');
    return s;
  }

  function debounce(fn, wait = 150) {
    let t;
    return function () {
      const args = arguments;
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // obtiene "base name" desde src (limpieza de sufijos comunes)
  function deriveBaseFromSrc(src) {
    if (!src) return null;
    const cleaned = src.split('?')[0].split('#')[0];
    const filename = cleaned.split('/').pop() || '';
    const withoutExt = filename.replace(/\.[^/.]+$/, '');
    const base = withoutExt
      .replace(/@2x$/i, '')
      .replace(/[-_](desktop|mobile|tablet)([-_]\d+)?$/i, '')
      .replace(/[-_]\d{2,4}p?$/i, '')
      .replace(/[-_](s|small|sm|md|lg)$/i, '')
      .replace(/[_-]thumb$/i, '')
      .trim();
    return base || null;
  }

  // obtiene base preferente (data-base > data-image-* derive > class img- > fallback src)
  function getBaseName(img) {
    if (!img) return null;
    const dataBase = (img.dataset && img.dataset.base) || img.getAttribute && img.getAttribute(cfg.DATA_BASE_ATTR);
    if (dataBase) return String(dataBase).trim();

    const dm = (img.dataset && img.dataset.imageMobile) || img.getAttribute && img.getAttribute(cfg.DATA_IMAGE_MOBILE);
    const dd = (img.dataset && img.dataset.imageDesktop) || img.getAttribute && img.getAttribute(cfg.DATA_IMAGE_DESKTOP);
    if (dd) {
      const b = deriveBaseFromSrc(dd);
      if (b) return b;
    }
    if (dm) {
      const b = deriveBaseFromSrc(dm);
      if (b) return b;
    }

    if (img.classList && img.classList.length) {
      for (const c of img.classList) {
        if (String(c).indexOf(cfg.CLASS_PREFIX) === 0) return c.slice(cfg.CLASS_PREFIX.length);
      }
    }

    if (cfg.AUTO_PROCESS_ALL) {
      const src = img.getAttribute && img.getAttribute('src') || '';
      return deriveBaseFromSrc(src);
    }

    return null;
  }

  // elige bucket de tamaño basado en viewport y dpr
  function pickSize() {
    const needed = Math.ceil(window.innerWidth * (cfg.DPR_MULT ? getDPR() : 1));
    const buckets = Array.isArray(cfg.SIZE_BUCKETS) ? cfg.SIZE_BUCKETS.slice().sort((a, b) => a - b) : [1024];
    for (let i = 0; i < buckets.length; i++) if (buckets[i] >= needed) return buckets[i];
    return buckets[buckets.length - 1];
  }

  function buildPatternList(baseName, size) {
    return [
      `${baseName}-desktop-${size}`,
      `${baseName}-tablet-${size}`,
      `${baseName}-mobile-${size}`,
      `${baseName}-${size}`,
      `${baseName}-${size}w`,
      `${baseName}-${size}x`,
      `${baseName}`
    ];
  }

  function buildCandidatesFromPattern(patterns) {
    const exts = Array.isArray(cfg.EXTENSIONS) ? cfg.EXTENSIONS.slice() : ['webp','jpg','png'];
    const extsToUse = supportsWebP ? exts : exts.filter(e => e !== 'webp');
    const candidates = [];
    patterns.forEach(pat => {
      extsToUse.forEach(ext => candidates.push(normalizeAssetPath(`${cfg.ASSETS_PATH}/${pat}.${ext}`)));
    });
    return candidates;
  }

  // Test de URL con timeout (Image preload)
  function testUrl(url, timeout = cfg.PRELOAD_TIMEOUT) {
    return new Promise(resolve => {
      if (!url) return resolve(false);
      const img = new Image();
      let done = false;
      const t = setTimeout(() => {
        if (!done) { done = true; img.onload = img.onerror = null; resolve(false); }
      }, timeout);
      img.onload = function () { if (!done) { done = true; clearTimeout(t); resolve(true); } };
      img.onerror = function () { if (!done) { done = true; clearTimeout(t); resolve(false); } };
      img.src = url;
    });
  }

  /* -------------------- CORE: tryLoadSequential -------------------- */
  async function tryLoadSequential(imgEl, candidates) {
    if (!imgEl || !Array.isArray(candidates) || !candidates.length) {
      return failFallback(imgEl);
    }

    try { imgEl.classList.add('is-loading'); } catch (e) {}

    // marcar que está en proceso para evitar reentradas
    if (imgEl.dataset && imgEl.dataset.respLoading === '1') {
      log('Elemento ya en carga:', imgEl);
      return imgEl;
    }
    try { imgEl.dataset.respLoading = '1'; } catch (e) {}

    for (let i = 0; i < candidates.length; i++) {
      const url = normalizeAssetPath(candidates[i]);
      try {
        const ok = await testUrl(url);
        if (ok) {
          try {
            imgEl.src = url;
            try { imgEl.classList.remove('is-loading'); } catch (e) {}
            try { delete imgEl.dataset.respLoading; } catch(e) {}
            log('imagen cargada:', url, imgEl);
            return imgEl;
          } catch (e) {
            warn('Asignar src falló para', url, e);
            continue;
          }
        } else {
          if (cfg.DEBUG) log('no existe candidato', url);
        }
      } catch (err) {
        if (cfg.DEBUG) warn('error testUrl', url, err);
      }
    }

    // ninguno funcionó
    try { imgEl.classList.remove('is-loading'); } catch (e) {}
    try { delete imgEl.dataset.respLoading; } catch (e) {}
    failFallback(imgEl);
    return imgEl;
  }

  function failFallback(imgEl) {
    if (!imgEl) return;
    try { imgEl.classList.remove('is-loading'); } catch(e){}
    try { imgEl.classList.add('load-error'); } catch(e){}
    const fb = imgEl.getAttribute && imgEl.getAttribute('data-fallback');
    if (fb) {
      try { imgEl.src = normalizeAssetPath(fb); } catch (e) {}
    }
    warn('responsive-lazy-images: sin candidato para', imgEl);
  }

  /* -------------------- loadResponsiveImage (pública) -------------------- */
  async function loadResponsiveImage(imgEl) {
    const el = safeQuery(imgEl);
    if (!el) { warn('loadResponsiveImage: elemento no encontrado', imgEl); return null; }

    // ya cargado?
    if (el.dataset && el.dataset.responsiveLoaded === '1') {
      if (cfg.DEBUG) log('skip already loaded', el);
      return el;
    }

    // respetar picture/srcset
    if (el.closest && el.closest('picture')) {
      if (cfg.DEBUG) log('skip: inside picture', el);
      el.dataset.responsiveLoaded = '1';
      return el;
    }
    if (el.getAttribute && el.getAttribute('srcset')) {
      if (cfg.DEBUG) log('skip: has srcset', el);
      el.dataset.responsiveLoaded = '1';
      return el;
    }

    // data-image-* directos (preferir)
    const dataMobile = el.getAttribute(cfg.DATA_IMAGE_MOBILE) || (el.dataset && el.dataset.imageMobile);
    const dataDesktop = el.getAttribute(cfg.DATA_IMAGE_DESKTOP) || (el.dataset && el.dataset.imageDesktop);
    if (dataMobile || dataDesktop) {
      try {
        if (dataMobile && dataDesktop) {
          const m = normalizeAssetPath(dataMobile);
          const d = normalizeAssetPath(dataDesktop);
          // generar srcset básico
          el.setAttribute('srcset', `${m} 600w, ${d} 1200w`);
          el.setAttribute('sizes', el.dataset.sizes || '(max-width: 767px) 100vw, 1200px');
          el.src = d || m;
          el.dataset.responsiveLoaded = '1';
          try { el.classList.remove('is-loading'); } catch (e) {}
          log('cargado por data-image-*', el);
          return el;
        } else {
          el.src = normalizeAssetPath(dataDesktop || dataMobile);
          el.dataset.responsiveLoaded = '1';
          try { el.classList.remove('is-loading'); } catch (e) {}
          log('cargado por single data-image', el);
          return el;
        }
      } catch (e) {
        warn('Error al asignar data-image-*', e, el);
      }
    }

    // obtener base
    const base = getBaseName(el);
    if (!base) {
      warn('No hay base para procesar (data-base/clase/img derivado):', el);
      return el;
    }

    // elegir tamaño y patrones
    const size = pickSize();
    const patterns = buildPatternList(base, size);
    let candidates = buildCandidatesFromPattern(patterns);

    // añadir variantes @2x (opcional): ej base-1920@2x.webp
    const with2x = [];
    candidates.forEach(url => {
      with2x.push(url);
      const idx = url.lastIndexOf('.');
      if (idx !== -1) with2x.push(url.slice(0, idx) + '@2x' + url.slice(idx));
    });
    candidates = with2x;

    try {
      await tryLoadSequential(el, candidates);
      el.dataset.responsiveLoaded = '1';
      return el;
    } catch (e) {
      warn('Error en tryLoadSequential', e, el);
      failFallback(el);
      return el;
    }
  }

  /* -------------------- IntersectionObserver & init -------------------- */
  let _observer = null;

  function shouldProcessImg(img) {
    if (!img) return false;
    // Excluir intencionalmente logos/enlaces que no deban procesarse:
    if (img.getAttribute && img.getAttribute('data-no-responsive') === 'true') return false;
    if (img.getAttribute && img.getAttribute('data-no-lazy') === 'true') return false;
    // buscar criterios
    if (img.getAttribute && img.getAttribute(cfg.DATA_BASE_ATTR)) return true;
    if (img.getAttribute && (img.getAttribute(cfg.DATA_IMAGE_MOBILE) || img.getAttribute(cfg.DATA_IMAGE_DESKTOP))) return true;
    if ([...img.classList].some(c => String(c).indexOf(cfg.CLASS_PREFIX) === 0)) return true;
    if (cfg.AUTO_PROCESS_ALL && deriveBaseFromSrc(img.getAttribute('src') || '')) return true;
    return false;
  }

  function initObserver() {
    const allImgs = Array.from(document.querySelectorAll('img'));
    const imgsToProcess = allImgs.filter(img => shouldProcessImg(img));

    if (!imgsToProcess.length) {
      log('No hay imágenes a procesar por responsive-lazy-images.');
      return;
    }

    // desconectar observer previo
    if (_observer && typeof _observer.disconnect === 'function') {
      try { _observer.disconnect(); } catch (e) {}
      _observer = null;
    }

    if (!('IntersectionObserver' in window)) {
      imgsToProcess.forEach(i => loadResponsiveImage(i));
      return;
    }

    _observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          try {
            loadResponsiveImage(img);
          } catch (e) {
            warn('Error cargando imagen intersectada', e, img);
          } finally {
            try { obs.unobserve(img); } catch (e) {}
          }
        }
      });
    }, { root: null, rootMargin: cfg.ROOT_MARGIN, threshold: cfg.OBSERVER_THRESHOLD });

    imgsToProcess.forEach(img => {
      const eagerAttr = (img.dataset && img.dataset.eager) || img.getAttribute('data-eager');
      if (String(eagerAttr) === 'true') {
        loadResponsiveImage(img);
      } else {
        try { _observer.observe(img); } catch (e) { loadResponsiveImage(img); }
      }
    });

    log('IntersectionObserver iniciado para', imgsToProcess.length, 'imágenes.');
  }

  function initAuto() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initObserver);
    } else {
      setTimeout(initObserver, 0);
    }
  }

  /* -------------------- Public API -------------------- */
  const API = {
    DEBUG: cfg.DEBUG,
    init: function () { initAuto(); },
    loadImage: function (selectorOrNode) {
      const el = safeQuery(selectorOrNode);
      if (!el) { warn('loadImage: elemento no encontrado', selectorOrNode); return null; }
      return loadResponsiveImage(el);
    },
    loadAll: function () {
      const imgs = Array.from(document.querySelectorAll('img'));
      return Promise.all(imgs.map(i => loadResponsiveImage(i)));
    },
    refresh: function () {
      if (_observer && typeof _observer.disconnect === 'function') {
        try { _observer.disconnect(); } catch (e) {}
        _observer = null;
      }
      initObserver();
    },
    configure: function (options) {
      if (!options || typeof options !== 'object') return;
      Object.assign(cfg, options || {});
      Object.assign(window.RESPONSIVE_LAZY_IMAGES_CONFIG, cfg);
    }
  };

  // exportar
  window.responsiveLazyImages = API;

  // auto-init
  initAuto();

})();