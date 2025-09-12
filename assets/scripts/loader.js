/** loader.js
// ------------------------------------------------------------
 * Propósito:
 *  - Mostrar un loader simple al inicio de la carga de la página y retirarlo de forma accesible
 *    cuando window.load se dispara (o tras un timeout de fallback).
 *  - Evitar errores si el script se ejecuta antes de que exista document.body.
 *  - Respetar preferencia de reduce-motion y ofrecer un fade-out suave para no "parpadear".
 *
 * // Autor: Macarena Baltra — Product & UX Designer
 * // Fecha: 12-09-2025.
 ------------------------------------------------------------ */

(function () {
  'use strict';

  const LOADER_ID = 'loadingpage';
  const FALLBACK_REMOVE_MS = 8000; // REVIEW: ajustar si cargas muy pesadas

  /**
   * Crea y retorna el nodo del loader (estilos scoped + markup).
   * No inserta el nodo en el DOM — el caller lo hace.
   * @returns {HTMLElement} container
   */
  function createLoaderElement() {
    // contenedor
    const container = document.createElement('div');
    container.id = LOADER_ID;
    container.setAttribute('role', 'status');
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-label', 'Cargando sitio web');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.background = 'rgba(0,0,0,0.9)';
    container.style.zIndex = '9999';
    container.style.transition = 'opacity 360ms ease';
    container.style.pointerEvents = 'auto'; // bloquea interacciones mientras visible

    // estilo interno (scoped) — para evitar collisiones, mantenemos selectores muy concretos
    const style = document.createElement('style');
    style.textContent = `
      /* Loader styles (scoped to #${LOADER_ID}) */
      #${LOADER_ID} .loader {
        font-size: 48px;
        font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        color: #0ff;
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }
      #${LOADER_ID} .dots { display: inline-block; width: 1.2em; text-align: left; }
      #${LOADER_ID} .dots span {
        display:inline-block; opacity:0; transform: translateY(0);
        animation: ${LOADER_ID}-dot 1s infinite;
      }
      #${LOADER_ID} .dots span:nth-child(1){ animation-delay: 0s; }
      #${LOADER_ID} .dots span:nth-child(2){ animation-delay: 0.18s; }
      #${LOADER_ID} .dots span:nth-child(3){ animation-delay: 0.36s; }

      @keyframes ${LOADER_ID}-dot {
        0%,20% { opacity: 0; transform: translateY(0); }
        50%    { opacity: 1; transform: translateY(-0.3em); }
        100%   { opacity: 0; transform: translateY(0); }
      }

      /* fade-out helper class */
      #${LOADER_ID}.is-hidden {
        opacity: 0 !important;
        pointer-events: none !important;
      }

      /* Respeto a la preferencia reduce-motion */
      @media (prefers-reduced-motion: reduce) {
        #${LOADER_ID} .dots span { animation: none !important; opacity: 1 !important; }
        #${LOADER_ID} { transition: none !important; }
      }
    `;

    // markup
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = `Agitando píxeles<span class="dots" aria-hidden="true"><span>.</span><span>.</span><span>.</span></span>`;

    container.appendChild(style);
    container.appendChild(loader);
    return container;
  }

  /**
   * Inserta el loader de forma segura: si document.body no existe, espera DOMContentLoaded.
   * @param {HTMLElement} node
   */
  function insertLoaderSafely(node) {
    if (!node) return;
    function doInsert() {
      // proteger doble inserción
      if (document.getElementById(LOADER_ID)) return;
      // insertamos al inicio del body
      try {
        document.body.insertBefore(node, document.body.firstChild);
      } catch (e) {
        // fallback: append
        try { document.body.appendChild(node); } catch (err) { /* ignore */ }
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', doInsert, { once: true });
    } else {
      doInsert();
    }
  }

  /**
   * Elimina el loader con un fade-out accesible y luego borra el nodo del DOM.
   * @param {number} delayMs tiempo antes de iniciar el fade-out (por si se quiere mostrar un mínimo)
   */
  function removeLoaderWithFade(delayMs = 0) {
    const node = document.getElementById(LOADER_ID);
    if (!node) return;
    // start fade-out after delay
    setTimeout(() => {
      // add hidden class to trigger CSS transition
      node.classList.add('is-hidden');
      // después de la transición, remover del DOM
      const onTransEnd = () => {
        try {
          if (node.parentNode) node.parentNode.removeChild(node);
        } catch (e) { /* ignore */ }
      };
      // si el navegador no soporta transitionend, forzamos remove en 500ms
      node.addEventListener('transitionend', onTransEnd, { once: true });
      setTimeout(() => {
        // guardia por si transitionend no se disparó
        if (document.getElementById(LOADER_ID)) {
          try { document.getElementById(LOADER_ID).remove(); } catch (e) {}
        }
      }, 600);
    }, delayMs);
  }

  // MAIN: crear e insertar loader
  const loaderNode = createLoaderElement();
  insertLoaderSafely(loaderNode);

  // Handler cuando la ventana terminó de cargar
  function onWindowLoad() {
    try {
      // quitamos loader con fade; dejamos 120ms de mínima visibilidad (opcional)
      removeLoaderWithFade(80);
      // limpiar fallback timeout
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
        fallbackTimer = null;
      }
    } catch (e) { /* ignore */ }
  }

  // Fallback: si load no se dispara en X ms, eliminar loader para no bloquear la UX
  let fallbackTimer = setTimeout(() => {
    try {
      removeLoaderWithFade(0);
      fallbackTimer = null;
    } catch (e) { /* ignore */ }
  }, FALLBACK_REMOVE_MS);

  // Si ya estamos en load, ejecutamos inmediatamente
  if (document.readyState === 'complete') {
    onWindowLoad();
  } else {
    window.addEventListener('load', onWindowLoad, { once: true });
  }

  // Safety: Exponer función de test/removal en window (útil en QA)
  // REVIEW: Si prefieres no exponer globals, eliminar esta línea.
  window.__removeSiteLoader = function () {
    try { removeLoaderWithFade(0); } catch (e) {}
  };
})();