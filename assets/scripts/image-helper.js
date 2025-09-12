// image-helper.js
// ------------------------------------------------------------
// Propósito:
//  - ImageHelper v1.4: inyección y manejo responsivo de imágenes (background y <img>)
//  - Registra inyecciones por id, fusiona inyecciones pendientes, acepta window.PANES
//  - Evita comprobaciones pesadas en file:// (conveniencia dev)
//
// Autor: Macarena Baltra — Product & UX Designer
// Fecha: 12-09-2025
// ------------------------------------------------------------

(function (global) {
  'use strict';

  /* =========================
     Constantes / Config
     ========================= */
  const DEFAULT_BREAKPOINT_MD = 768;
  const DEFAULT_BREAKPOINT_LG = 1366;
  const STYLE_ID_PREFIX = 'ih-css-';

  // allow user to toggle DEBUG externally via window.ImageHelper.DEBUG
  let DEBUG = false;
  const log = (...args) => { if (DEBUG) console.log('[ImageHelper]', ...args); };
  const warn = (...args) => { if (DEBUG) console.warn('[ImageHelper]', ...args); };

  /* =========================
     Helpers básicos
     ========================= */
  const isString = (v) => typeof v === 'string';
  const isElement = (el) => {
    // soporta Element y Document nodes
    return !!el && (typeof Node !== 'undefined') && (el.nodeType === 1 || el.nodeType === 9);
  };

  /**
   * safeQuery - acepta selector string o nodo y devuelve Element o null
   * @param {string|Element|null} selectorOrNode
   * @returns {Element|null}
   */
  const safeQuery = (selectorOrNode) => {
    if (!selectorOrNode) return null;
    if (isString(selectorOrNode)) return document.querySelector(selectorOrNode);
    if (isElement(selectorOrNode)) return selectorOrNode;
    return null;
  };

  /**
   * injectStyleSheetOnce - agrega <style> con id único (evita duplicados)
   * @param {string} cssText
   * @param {string} [id]
   * @returns {HTMLStyleElement}
   */
  function injectStyleSheetOnce(cssText, id) {
    if (!id) id = STYLE_ID_PREFIX + Math.random().toString(36).slice(2, 9);
    const existing = document.getElementById(id);
    if (existing) return existing;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = cssText;
    document.head.appendChild(style);
    return style;
  }

  const sanClass = (className) => {
    return String(className || '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '')
      .toLowerCase();
  };

  const normalizeAssetPath = (p) => {
    if (!p) return p;
    let s = String(p).trim();
    if (!s) return s;
    if (s.indexOf('//') === 0) return s;
    if (/^https?:\/\//i.test(s)) return s;
    // If it's like "/assets/..." under file:// remove leading slash (dev convenience)
    if (typeof location !== 'undefined' && location.protocol === 'file:' && s.startsWith('/')) {
      s = s.replace(/^\/+/, '');
    }
    return s;
  };

  /* =========================
     CSS helpers
     ========================= */
  function buildBackgroundCSS(className, imageMobile, imageDesktop, breakpoint = DEFAULT_BREAKPOINT_MD, opts = {}) {
    const cls = sanClass(className);
    const mUrl = imageMobile ? `url("${normalizeAssetPath(imageMobile)}")` : 'none';
    const dUrl = imageDesktop ? `url("${normalizeAssetPath(imageDesktop)}")` : (imageMobile ? `url("${normalizeAssetPath(imageMobile)}")` : 'none');
    const mdUrl = opts.imageMd ? `url("${normalizeAssetPath(opts.imageMd)}")` : null;
    let css = '';

    if (opts.injectVariables) {
      css += `.${cls} { --bg-mobile: ${mUrl}; ${mdUrl ? `--bg-md: ${mdUrl};` : ''} --bg-desktop: ${dUrl}; }\n`;
    }

    css += `.${cls} {
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: ${opts.injectVariables ? 'var(--bg-mobile)' : mUrl};
}\n`;

    if (mdUrl) {
      css += `@media (min-width: ${Math.round(breakpoint * 0.8)}px) and (max-width: ${breakpoint - 1}px) {
  .${cls} { background-image: ${opts.injectVariables ? 'var(--bg-md)' : mdUrl}; }
}\n`;
    }

    css += `@media (min-width: ${breakpoint}px) {
  .${cls} { background-image: ${opts.injectVariables ? 'var(--bg-desktop)' : dUrl}; }
}\n`;

    return css;
  }

  function buildImgCSS(className, width, height, opts = {}) {
    const cls = sanClass(className);
    let css = `.${cls} { display: inline-block; max-width:100%; height:auto; object-fit:contain; }\n`;
    if (width) css += `.${cls} { width:${Number(width)}px; }\n`;
    if (height) css += `.${cls} { height:${Number(height)}px; }\n`;
    if (opts.forceBlock) css += `.${cls} { display:block; }\n`;
    return css;
  }

  /* =========================
     Core API functions
     ========================= */

  /**
   * createBackgroundClass - inyecta reglas CSS responsive para una clase de background
   * @param {string} className
   * @param {object} opts
   * @returns {string} clase sanitizada
   */
  function createBackgroundClass(className, opts = {}) {
    if (!className) throw new Error('createBackgroundClass: className es requerido');
    const cls = sanClass(className);
    const css = buildBackgroundCSS(cls, opts.imageMobile, opts.imageDesktop, opts.breakpoint || DEFAULT_BREAKPOINT_MD, opts);
    const styleId = (opts.styleId) ? opts.styleId : (STYLE_ID_PREFIX + cls);
    injectStyleSheetOnce(css, styleId);
    return cls;
  }

  /**
   * assignClass - asigna clase a un selector/nodo y opcionalmente marca data-base en <img>
   * @param {string|Element} selectorOrNode
   * @param {string} className
   * @param {object} opts
   * @returns {Element|null}
   */
  function assignClass(selectorOrNode, className, opts = {}) {
    const el = safeQuery(selectorOrNode);
    if (!el) {
      warn('assignClass: elemento no encontrado ->', selectorOrNode);
      return null;
    }
    const cls = sanClass(className);
    el.classList.add(cls);
    if (opts.setDataBase && el.tagName && el.tagName.toLowerCase() === 'img') {
      try { el.setAttribute('data-base', cls); } catch (e) { /* ignore */ }
    }
    return el;
  }

  /**
   * configureImg - configura atributos y src/srcset de un <img>
   * @param {string|Element} selectorOrNode
   * @param {object} opts
   * @returns {Element|null}
   */
  function configureImg(selectorOrNode, opts = {}) {
    const el = safeQuery(selectorOrNode);
    if (!el) {
      warn('configureImg: elemento <img> no encontrado ->', selectorOrNode);
      return null;
    }
    if (el.tagName.toLowerCase() !== 'img') {
      warn('configureImg: el selector no es <img> ->', selectorOrNode);
      return el;
    }

    if (opts.alt) el.setAttribute('alt', opts.alt);
    if (opts.width) el.setAttribute('width', String(opts.width));
    if (opts.height) el.setAttribute('height', String(opts.height));
    if (!el.getAttribute('loading')) el.setAttribute('loading', opts.loading || 'lazy');

    if (opts.imageMobile && opts.imageDesktop) {
      const m = normalizeAssetPath(opts.imageMobile);
      const d = normalizeAssetPath(opts.imageDesktop);
      const descriptors = opts.descriptors || `${m} 600w, ${d} 1200w`;
      el.setAttribute('srcset', descriptors);
      el.setAttribute('sizes', opts.sizes || '(max-width: 767px) 600px, 1200px');
      el.setAttribute('src', d || m);
    } else if (opts.imageUrl) {
      el.setAttribute('src', normalizeAssetPath(opts.imageUrl));
    } else if (opts.imageDesktop || opts.imageMobile) {
      el.setAttribute('src', normalizeAssetPath(opts.imageDesktop || opts.imageMobile));
    }

    if (opts.className) {
      const cls = sanClass(opts.className);
      el.classList.add(cls);
      const css = buildImgCSS(cls, opts.width, opts.height, { forceBlock: opts.forceBlock });
      injectStyleSheetOnce(css, STYLE_ID_PREFIX + cls);
      if (opts.setDataBase) {
        try { el.setAttribute('data-base', cls); } catch (e) { /* ignore */ }
      }
    }

    return el;
  }

  /**
   * processBatch - procesa un array de instrucciones de inyección (bg o img)
   * @param {Array} items
   */
  function processBatch(items = []) {
    if (!Array.isArray(items)) return;
    items.forEach(item => {
      try {
        if (!item || !item.selector || !item.className) {
          warn('processBatch: item inválido', item);
          return;
        }
        const type = item.type || (item.imageUrl ? 'img' : 'bg');
        if (type === 'bg') {
          createBackgroundClass(item.className, {
            imageMobile: item.imageMobile,
            imageDesktop: item.imageDesktop,
            imageMd: item.imageMd,
            breakpoint: item.breakpoint,
            styleId: item.styleId,
            injectVariables: !!item.injectVariables
          });
          assignClass(item.selector, item.className, { setDataBase: !!item.setDataBase });
        } else {
          configureImg(item.selector, {
            className: item.className,
            imageMobile: item.imageMobile,
            imageDesktop: item.imageDesktop,
            imageUrl: item.imageUrl,
            imageMd: item.imageMd,
            alt: item.alt,
            width: item.width,
            height: item.height,
            sizes: item.sizes,
            descriptors: item.descriptors,
            setDataBase: !!item.setDataBase,
            forceBlock: !!item.forceBlock,
            loading: item.loading
          });
        }
      } catch (err) {
        console.error('[ImageHelper] processBatch error', err, item);
      }
    });
  }

  /* =========================
     Image injection registry
     ========================= */
  const _imageInjections = {};

  const DEFAULT_IMAGE_INJECTIONS = {
    "banner-landing-blog": {
      imageDesktop: "assets/img/hero-article/BLOG/img-blog-3840@2x.webp",
      imageTablet:  "assets/img/hero-article/BLOG/img-blog-2048@2x.webp",
      imageMobile:  "assets/img/hero-article/BLOG/img-blog-750@2x.webp",
      type: "background"
    },
    "banner-landing-othersprojects": {
      imageDesktop: "assets/img/hero-article/Others-Projects/img-othersprojects-3840@2x.webp",
      imageTablet:  "assets/img/hero-article/Others-Projects/img-othersprojects-2048@2x.webp",
      imageMobile:  "assets/img/hero-article/Others-Projects/img-othersprojects-750@2x.webp",
      type: "background"
    }
  };

  // detect environment: when file:// we skip urlExists checks (prevents failing to choose any image)
  const IS_FILE_PROTOCOL = (typeof location !== 'undefined' && location.protocol === 'file:');

  /**
   * urlExists - intenta cargar la imagen para verificar existencia (no perfecto, pero útil)
   * @param {string} url
   * @returns {Promise<boolean>}
   */
  function urlExists(url) {
    return new Promise(resolve => {
      if (!url) return resolve(false);
      // If we are in file: protocol we won't rely on this check (it often fails), so resolve false
      if (IS_FILE_PROTOCOL) return resolve(false);
      const img = new Image();
      img.onload = function () { resolve(true); };
      img.onerror = function () { resolve(false); };
      try { img.src = normalizeAssetPath(url); } catch (e) { resolve(false); }
    });
  }

  /**
   * chooseBestImage - elige el candidato correcto según viewport y disponibilidad
   * @param {object} entry
   * @returns {Promise<string|null>}
   */
  async function chooseBestImage(entry) {
    if (!entry) return null;
    const w = window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || 1024;
    const candidates = [];
    if (w < DEFAULT_BREAKPOINT_MD) {
      if (entry.imageMobile) candidates.push(entry.imageMobile);
      if (entry.imageTablet) candidates.push(entry.imageTablet);
      if (entry.imageDesktop) candidates.push(entry.imageDesktop);
    } else if (w < DEFAULT_BREAKPOINT_LG) {
      if (entry.imageTablet) candidates.push(entry.imageTablet);
      if (entry.imageDesktop) candidates.push(entry.imageDesktop);
      if (entry.imageMobile) candidates.push(entry.imageMobile);
    } else {
      if (entry.imageDesktop) candidates.push(entry.imageDesktop);
      if (entry.imageTablet) candidates.push(entry.imageTablet);
      if (entry.imageMobile) candidates.push(entry.imageMobile);
    }

    const normalized = candidates.map(c => normalizeAssetPath(c)).filter(Boolean);
    if (!normalized.length) return null;

    // If file protocol, return the first normalized candidate (development convenience)
    if (IS_FILE_PROTOCOL) {
      log('file:// detected — skipping urlExists checks, returning first candidate', normalized[0]);
      return normalized[0];
    }

    // Otherwise check sequentially which URL actually exists
    for (let i = 0; i < normalized.length; i++) {
      try {
        const ok = await urlExists(normalized[i]);
        if (ok) return normalized[i];
      } catch (e) { /* continue */ }
    }
    // if none resolved, return first as fallback (to at least show something)
    return normalized[0];
  }

  /**
   * applyInjectionToElement - aplica inyección (img o background) a elemento por id
   * @param {string} id
   * @param {object} entry
   * @param {object} [opts]
   * @returns {Promise<string|null>}
   */
  async function applyInjectionToElement(id, entry, opts = {}) {
    if (!id || !entry) return null;
    const el = document.getElementById(id);
    if (!el) {
      log('Elemento no encontrado en DOM para id=', id);
      return null;
    }

    if (el.dataset && el.dataset.ihSkip === '1') {
      log('Skipped by data-ih-skip for', id);
      return null;
    }

    const chosen = await chooseBestImage(entry);
    if (!chosen) {
      log('No candidate found for', id);
      return null;
    }

    const norm = normalizeAssetPath(chosen);

    if (entry.type === 'img') {
      let imgChild = el.querySelector('img.image-helper-injected');
      if (!imgChild) {
        imgChild = document.createElement('img');
        imgChild.className = 'image-helper-injected';
        imgChild.alt = entry.alt || '';
        imgChild.loading = entry.loading || 'lazy';
        el.appendChild(imgChild);
      }
      if (entry.srcset) imgChild.setAttribute('srcset', entry.srcset);
      if (entry.sizes) imgChild.setAttribute('sizes', entry.sizes);
      imgChild.src = norm;
      el.dataset.imageHelperApplied = norm;
      log('Injected <img> into', id, norm);
      return norm;
    } else {
      // background
      el.style.backgroundImage = `url("${norm}")`;
      el.style.backgroundPosition = entry.position || 'center';
      el.style.backgroundSize = entry.size || 'contain';
      el.classList.add('injected-bg');
      el.dataset.imageHelperApplied = norm;
      log('Injected background into', id, norm);
      return norm;
    }
  }

  /**
   * processAllInjections - recorre y aplica todas las inyecciones registradas
   * @param {object} [opts]
   * @returns {Promise<object>}
   */
  async function processAllInjections(opts = {}) {
    const keys = Object.keys(_imageInjections || {});
    const results = {};
    for (let i = 0; i < keys.length; i++) {
      const id = keys[i];
      try {
        results[id] = await applyInjectionToElement(id, _imageInjections[id], opts);
      } catch (e) {
        console.warn('[ImageHelper] applyInjection error for', id, e);
        results[id] = null;
      }
    }
    return results;
  }

  /**
   * registerImageInjections - agrega/mezcla un mapa de inyecciones (por id)
   * @param {object} map
   * @returns {object} _imageInjections
   */
  function registerImageInjections(map = {}) {
    if (!map || typeof map !== 'object') return _imageInjections;
    Object.keys(map).forEach(k => {
      _imageInjections[k] = Object.assign({}, _imageInjections[k] || {}, map[k]);
    });
    return _imageInjections;
  }

  function addImageInjection(id, entry) {
    if (!id || !entry) return null;
    _imageInjections[id] = Object.assign({}, _imageInjections[id] || {}, entry);
    return _imageInjections[id];
  }

  /* =========================
     Merge pending globals (window._IMAGE_HELPER_PENDING_INJECTIONS, window.PANES)
     ========================= */
  function mergePendingGlobals() {
    // Merge window._IMAGE_HELPER_PENDING_INJECTIONS if present
    try {
      if (global._IMAGE_HELPER_PENDING_INJECTIONS && typeof global._IMAGE_HELPER_PENDING_INJECTIONS === 'object') {
        registerImageInjections(global._IMAGE_HELPER_PENDING_INJECTIONS);
        log('Merged _IMAGE_HELPER_PENDING_INJECTIONS');
      }
    } catch (e) { /* ignore */ }

    // If your project sets window.PANES with data-image-* strings, try to map them automatically
    try {
      if (global.PANES && typeof global.PANES === 'object') {
        Object.keys(global.PANES).forEach(key => {
          try {
            const html = String(global.PANES[key] || '');
            // search for data-image-mobile / data-image-desktop / data-image
            const mMatch = html.match(/data-image-mobile=['"]([^'"]+)['"]/i);
            const dMatch = html.match(/data-image-desktop=['"]([^'"]+)['"]/i);
            const sMatch = html.match(/data-image=['"]([^'"]+)['"]/i);
            if (mMatch || dMatch || sMatch) {
              const entry = { type: 'background' };
              if (mMatch) entry.imageMobile = mMatch[1];
              if (dMatch) entry.imageDesktop = dMatch[1];
              if (sMatch) entry.imageDesktop = entry.imageDesktop || sMatch[1];
              // register using pane id if it's a valid dom id later. we use pane key as id candidate.
              registerImageInjections({ [key]: entry });
              log('Mapped PANES entry -> injection for', key, entry);
            }
          } catch (e) { /* ignore per-pane errors */ }
        });
      }
    } catch (e) { /* ignore */ }
  }

  /* =========================
     Auto-init injections + housekeeping
     ========================= */
  let _inits = false;
  let _resizeHandler = null;
  let _dprInterval = null;

  function initInjectionsAuto() {
    if (_inits) return;
    _inits = true;

    // initial defaults
    registerImageInjections(DEFAULT_IMAGE_INJECTIONS);

    // merge globals (if any)
    mergePendingGlobals();

    function run() {
      // If developer wants debugging, pick it up from window.ImageHelper.DEBUG
      try { DEBUG = !!(global.ImageHelper && global.ImageHelper.DEBUG); } catch (e) {}
      log('Starting injection processing. DEBUG=', DEBUG);

      processAllInjections({}).then(res => {
        log('processAllInjections finished', res);
        // warn user if no injection applied for known ids (helpful)
        Object.keys(_imageInjections).forEach(id => {
          const el = document.getElementById(id);
          if (!el) {
            // element not in DOM: that's normal in some pages, so only debug-print
            log('No DOM element found for', id);
          } else if (!el.dataset.imageHelperApplied) {
            log('Element found but no image applied yet for', id);
          }
        });
      }).catch(err => {
        console.error('[ImageHelper] processAllInjections error', err);
      });

      // Debounced resize re-run
      let t;
      _resizeHandler = function () {
        clearTimeout(t);
        t = setTimeout(() => processAllInjections({}), 260);
      };
      window.addEventListener('resize', _resizeHandler);

      // DPR watcher (some browsers change DPR when zooming)
      let lastDPR = window.devicePixelRatio || 1;
      /* REVIEW: Interval polling for DPR can be heavy; consider using 'resize' or 'change' events when available. */
      _dprInterval = setInterval(() => {
        const dpr = window.devicePixelRatio || 1;
        if (dpr !== lastDPR) {
          lastDPR = dpr;
          processAllInjections({});
        }
      }, 1000);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run);
    } else {
      // When script is placed at end of body, DOM may be ready; schedule shortly
      setTimeout(run, 0);
    }
  }

  /**
   * cleanup - remueve listeners e intervalos para evitar fugas si se recarga SPA
   */
  function cleanup() {
    try {
      if (_resizeHandler) window.removeEventListener('resize', _resizeHandler);
      if (_dprInterval) {
        clearInterval(_dprInterval);
        _dprInterval = null;
      }
    } catch (e) { /* ignore */ }
  }

  /* ensure cleanup on page unload (SPA friendliness) */
  try {
    window.addEventListener('beforeunload', cleanup);
  } catch (e) { /* ignore */ }

  /* =========================
     Public API exposure
     ========================= */
  global.ImageHelper = global.ImageHelper || {};
  Object.assign(global.ImageHelper, {
    createBackgroundClass,
    assignClass,
    configureImg,
    processBatch,
    normalizeAssetPath,
    processAllInjections,
    registerImageInjections,
    addImageInjection,
    // toggle debug from console:
    set DEBUG(val) { DEBUG = !!val; },
    get DEBUG() { return DEBUG; },
    _internal: {
      buildBackgroundCSS,
      buildImgCSS,
      sanitizeClass: sanClass,
      _imageInjections: _imageInjections
    }
  });

  // start auto-init (non-blocking)
  initInjectionsAuto();

})(window);

/* =========================
   End of file
   ========================= */