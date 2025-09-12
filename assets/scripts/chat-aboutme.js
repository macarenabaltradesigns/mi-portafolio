/** chat-aboutme.js
// ------------------------------------------------------------
 * Comportamiento:
 *  - Rueda de mensajes tipo "ticker" dentro de un viewport fijo.
 *  - Se muestran VISIBLE items; cada INTERVAL_MS se desplaza 1 item usando transform (animación CSS).
 *  - Al terminar la animación se recicla el primer nodo (remove first, append new) y se resetea transform.
 *
 * Notas de implementación:
 *  - Verifica existencia de nodos (chatWindow, chatTrack, botones) antes de operar.
 *  - Respeta prefers-reduced-motion: si el usuario lo prefiere, no usa animaciones CSS; hace rotación instantánea.
 *  - Usa createElement/appendChild (no innerHTML) para evitar parsing inesperado y problemas con comentarios.
 *
 // Autor: Macarena Baltra — Product & UX Designer
 // Fecha: 12-09-2025.
  ------------------------------------------------------------ */

(function () {
  'use strict';

  const DEBUG = false;
  const VISIBLE = 5;            // número de items visibles en la ventana
  const INTERVAL_MS = 3000;     // tiempo entre movimientos (ms)
  const ANIM_MS = 700;          // duración de la animación CSS (debe coincidir con CSS)
  const GAP_PX = 8;             // gap vertical entre items (coincidir con CSS .chat-track gap)

  // Estado interno
  let pointer = 0;
  let timerId = null;
  let running = true;
  let itemH = 120;
  let animating = false;

  // Elementos del DOM (se inicializan en onReady)
  let chatWindow = null;
  let chatTrack = null;
  let pauseBtn = null;
  let resumeBtn = null;
  let intervalLabel = null;

  /**
   * Helper para logs controlados
   * @param  {...any} args
   */
  function log(...args) {
    if (DEBUG) console.log('[chat-aboutme]', ...args);
  }

  /**
   * Safe query selector
   * @param {string} sel
   * @param {HTMLElement|Document} ctx
   * @returns {HTMLElement|null}
   */
  function safeQuery(sel, ctx = document) {
    try { return ctx.querySelector(sel); } catch (e) { return null; }
  }

  /**
   * Crea un nodo de mensaje (burbuja) de forma segura.
   * @param {string} text - Texto del mensaje
   * @param {number} idx - Índice para alternar lado left/right
   * @returns {HTMLElement}
   */
  function createBubble(text, idx) {
    const d = document.createElement('div');
    d.className = 'chat-msg ' + (idx % 2 === 0 ? 'right' : 'left');

    const inner = document.createElement('div');
    inner.className = 'chat-text';
    inner.textContent = text || '';

    d.appendChild(inner);
    d.style.height = itemH + 'px';
    return d;
  }

  /**
   * Calcula y aplica la altura de cada item en la track según el viewport actual.
   * Actualiza la variable CSS --item-h si es necesario.
   */
  function computeHeights() {
    if (!chatWindow || !chatTrack) return;
    const winH = chatWindow.clientHeight || 0;
    const totalGap = GAP_PX * (VISIBLE - 1);
    itemH = Math.max(40, Math.floor((winH - totalGap) / VISIBLE)); // min height safeguard
    // aplicar alturas a los items existentes
    const nodes = chatTrack.querySelectorAll('.chat-msg');
    nodes.forEach(n => { n.style.height = itemH + 'px'; });
    // set CSS var en track (en caso de uso en CSS)
    try { chatTrack.style.setProperty('--item-h', itemH + 'px'); } catch (e) {}
    log('Heights computed', itemH);
  }

  /**
   * Inicializa la ventana con VISIBLE elementos.
   * Construye nodos con createElement (no innerHTML).
   */
  function initWindow(initialMessages) {
    if (!chatTrack) return;
    // limpiar
    while (chatTrack.firstChild) chatTrack.removeChild(chatTrack.firstChild);

    for (let i = 0; i < VISIBLE; i++) {
      const text = initialMessages[(pointer + i) % initialMessages.length];
      const bubble = createBubble(text, pointer + i);
      chatTrack.appendChild(bubble);
    }
    pointer = (pointer + VISIBLE) % initialMessages.length;
    computeHeights();
  }

  /**
   * Realiza un solo paso (mueve la track hacia arriba una unidad y recicla).
   * Respeta prefers-reduced-motion.
   * @param {string[]} messagesArray
   */
  function stepOnce(messagesArray) {
    if (!running || animating || !chatTrack) return;
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Si el usuario prefiere reducir animaciones -> rotación instantánea sin animación
    if (reduceMotion) {
      // remove first, append next
      const first = chatTrack.querySelector('.chat-msg');
      if (first) chatTrack.removeChild(first);
      const newText = messagesArray[pointer % messagesArray.length];
      const newBubble = createBubble(newText, pointer);
      chatTrack.appendChild(newBubble);
      pointer = (pointer + 1) % messagesArray.length;
      computeHeights();
      return;
    }

    // Animado por CSS: usamos transform en el track
    animating = true;
    chatTrack.classList.add('animating'); // asume que CSS aplica transition cuando .animating presente
    // Mover por itemH + GAP_PX
    chatTrack.style.transform = `translateY(-${itemH + GAP_PX}px)`;

    // Handler de finalización (transitionend) + fallback timeout
    let finished = false;

    function finishAnimation() {
      if (finished) return;
      finished = true;
      // remover listener
      chatTrack.removeEventListener('transitionend', onEnd);
      // Restaurar estado: quitar animación, reset transform a 0 sin transición visible
      chatTrack.classList.remove('animating');
      // Temporalmente quitar transición para resetear transform instantáneamente
      const prevTransition = chatTrack.style.transition;
      chatTrack.style.transition = 'none';
      chatTrack.style.transform = 'translateY(0)';
      // eliminar primer hijo y añadir nuevo al final
      const first = chatTrack.querySelector('.chat-msg');
      if (first) chatTrack.removeChild(first);
      const newText = messagesArray[pointer % messagesArray.length];
      const newBubble = createBubble(newText, pointer);
      chatTrack.appendChild(newBubble);
      pointer = (pointer + 1) % messagesArray.length;
      // force reflow y restaurar transition inline
      // eslint-disable-next-line no-unused-expressions
      chatTrack.offsetHeight;
      chatTrack.style.transition = prevTransition || '';
      animating = false;
      computeHeights();
    }

    function onEnd(ev) {
      // defensivo: solo reaccionar al evento cuando la propiedad es transform
      if (ev && ev.propertyName && ev.propertyName !== 'transform') return;
      finishAnimation();
    }

    // fallback por si transitionend no se dispara (ej. interrupciones)
    const fallback = setTimeout(() => {
      finishAnimation();
    }, ANIM_MS + 120);

    chatTrack.addEventListener('transitionend', onEnd, { once: true });
  }

  /**
   * Inicia el ciclo (setInterval) que llama a stepOnce periódicamente.
   * @param {string[]} messagesArray
   */
  function startLoop(messagesArray) {
    if (timerId) clearInterval(timerId);
    // Ejecutar inmediatamente una vez opcional (comentar si no quieres primer salto inmediato)
    // stepOnce(messagesArray);
    timerId = setInterval(() => {
      stepOnce(messagesArray);
    }, INTERVAL_MS);
    log('Loop started');
  }

  /**
   * Para el loop y limpia timer.
   */
  function stopLoop() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    animating = false;
    running = false;
    log('Loop stopped');
  }

  /**
   * Pausa y reanuda (control por botones)
   */
  function pause() {
    running = false;
    if (pauseBtn) { pauseBtn.setAttribute('disabled', 'disabled'); pauseBtn.setAttribute('aria-pressed', 'true'); }
    if (resumeBtn) { resumeBtn.removeAttribute('disabled'); resumeBtn.setAttribute('aria-pressed', 'false'); }
    log('Paused');
  }
  function resume() {
    running = true;
    if (pauseBtn) { pauseBtn.removeAttribute('disabled'); pauseBtn.setAttribute('aria-pressed', 'false'); }
    if (resumeBtn) { resumeBtn.setAttribute('disabled', 'disabled'); resumeBtn.setAttribute('aria-pressed', 'true'); }
    log('Resumed');
  }

  /**
   * Manejo de resize: recalcula heights (debounced)
   */
  let resizeTimeout = null;
  function onResize() {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      computeHeights();
    }, 120);
  }

  /**
   * Inicialización principal (se llama en DOMContentLoaded)
   * @param {string[]} messagesArray
   */
  function init(messagesArray) {
    chatWindow = safeQuery('#chatWindow');
    chatTrack = safeQuery('#chatTrack');
    pauseBtn = safeQuery('#pauseChat');
    resumeBtn = safeQuery('#resumeChat');
    intervalLabel = safeQuery('#chatIntervalLabel');

    // Verificar nodos mínimos
    if (!chatWindow || !chatTrack) {
      log('chatWindow o chatTrack no encontrado — abortando inicialización');
      return;
    }

    // Inicializar controles si existen
    if (pauseBtn) pauseBtn.addEventListener('click', pause);
    if (resumeBtn) resumeBtn.addEventListener('click', resume);

    // accesibilidad: aria-live para avisos dinámicos (no intrusivo)
    try {
      if (!chatTrack.hasAttribute('aria-live')) chatTrack.setAttribute('aria-live', 'polite');
      if (!chatTrack.hasAttribute('role')) chatTrack.setAttribute('role', 'list');
    } catch (e) {}

    // Inicializar contenido y loop
    initWindow(messagesArray);
    startLoop(messagesArray);
    // ajustar heights en resize
    window.addEventListener('resize', onResize);

    // valor visual del intervalo (opcional)
    if (intervalLabel) intervalLabel.textContent = (INTERVAL_MS / 1000) + 's';

    // Si hay un video que controla pausa/reanudar, integrarlo (opcional)
    const video = safeQuery('#aboutVideo');
    if (video) {
      video.addEventListener('pause', pause);
      video.addEventListener('play', resume);
    }

    // estado inicial botones
    if (resumeBtn) resumeBtn.setAttribute('disabled', 'disabled');
    if (pauseBtn) pauseBtn.removeAttribute('disabled');
  }

  // Mensajes curados
  const CHAT_MESSAGES = [
    '☕+🍊 Chocolate con naranja — así empiezo el día feliz.',
    '🍣 Sushi (sin palta) — por alergia respiratoria 😢.',
    '🎶 Música 80s/90s — Daft Punk, RHCP y Guns N’ Roses en mi lista.',
    '😻🧶 Michis — me distraen y me enamoran.',
    '🎮 Mario Kart — Yoshi o Toad, siempre.',
    '🍰👩‍🍳 Cocina = laboratorio — experimento cada semana.',
    '📚 Encuadernación artesanal — mi terapia creativa.',
    '🏕️ Bosque y camping — reset total para mí.',
    '🧘‍♀️ Grounding y respiraciones — me devuelven el flujo.',
    '🌙💤 Diario de sueños — ideas en borrador constante.',
    '🦻👁️ Sordera en un oído — escucho de otra manera.',
    '😂 La risa en el equipo me recarga.',
    '📷 Paparazzi amateur — colecciono fotos de pajaritos y paisajes.',
    '❄️🥶 No soporto el frío.',
    '🪴 Coleccionista de plantitas.',
    '🧳🏖️ Amo viajar — mi lugar favorito: el sur de Chile.'
  ];

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init(CHAT_MESSAGES));
  } else {
    setTimeout(() => init(CHAT_MESSAGES), 0);
  }

})();