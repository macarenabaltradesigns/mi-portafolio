/** inject-gato-raster.js — interacción “gato 404”
// ------------------------------------------------------------
 * Propósito:
 *  - Gestionar la interacción gráfica y estados del "gato 404" (escenas, diálogo,
 *    spawn de corazones/pelusas, progreso e interfaz de CTA).
 *  - Implementación defensiva: comprobaciones DOM, protección de timers y manejo
 *    de fallos de carga de imágenes (webp -> png fallback).
*
*   Autor: Macarena Baltra — Product & UX Designer
*   Fecha: 12-09-2025.
 ------------------------------------------------------------ */
 
(function () {
  'use strict';

  const IMG = {
    scene1: 'assets/img/Gato-404/g-gato-escena-1.webp',
    scene2: 'assets/img/Gato-404/g-gato-escena-2.webp',
    yes_touch_3: 'assets/img/Gato-404/g-gato-escena-yes-touch-3.webp',
    yes_touch_4: 'assets/img/Gato-404/g-gato-escena-yes-touch-4.webp',
    yes_touch_5: 'assets/img/Gato-404/g-gato-escena-yes-touch-5.webp',
    yes_touch_6: 'assets/img/Gato-404/g-gato-escena-yes-touch-6.webp',
    yes_touch_7: 'assets/img/Gato-404/g-gato-escena-yes-touch-7.webp',
    no_touch_3: 'assets/img/Gato-404/g-gato-escena-no-touch-3.webp'
  };

  // tiempos (ajustables)
  const DIALOG_TIMERS = {
    initialToScene2: 3000,
    dialogVisible: 10000,
    inactivityHint: 20000
  };

  const DEBUG = false;
  const log = (...a) => { if (DEBUG) console.log('[inject-gato]', ...a); };
  const err = (...a) => { console.error('[inject-gato]', ...a); };

  function qs(sel, ctx=document){ try { return (ctx||document).querySelector(sel); } catch(e) { return null; } }
  function qsa(sel, ctx=document){ try { return Array.from((ctx||document).querySelectorAll(sel)); } catch(e) { return []; } }

  // DOM references (asegurarse que coincidan con tu HTML)
  const catImage = qs('#cat-image');
  const catDialogue = qs('#cat-dialogue');
  const btnNo = qs('#btn-no-touch');
  const btnYes = qs('#btn-yes-touch');
  const btnStop = qs('#btn-stop-interaction');
  const instructionPanel = qs('#instruction-panel');
  const progressBox = qs('#progress-box');
  const emojiBadge = qs('#emoji-badge');
  const progressWrap = qs('#progress-wrap');
  const progressBar = qs('#progress-bar');
  const heartsContainer = qs('#hearts-container');
  const ctaGrid = qs('#cta-grid');
  const countdown = qs('#countdown');
  const countdownSeconds = qs('#countdown-seconds');
  const landingSubtext = qs('#landing-subtext') || qs('#g404-panel .micro') || qs('.micro') || null;
  const svgHolder = qs('#svg-holder');
  const initialControls = qs('#initial-controls'); // <-- fijar aquí (error corregido)

  // sanity check
  if (!catImage || !catDialogue || !btnNo || !btnYes || !svgHolder) {
    err('Elementos requeridos no encontrados en DOM. Revisa el HTML.');
    return;
  }

  // Estado
  let scene2Preloaded = false;
  let scene2Visible = false;
  let autoScene2Timer = null;
  let dialogTimer = null;
  let inactivityTimer = null;
  let clickCount = 0;
  let progress = 0;
  let countdownTimer = null;
  let countdownRemaining = 0;
  let interactionActive = false;
  let finalTriggered = false;
  let inactivityShown = false;
  let lastProgressState = 'idle';
  let furInterval = null;
  let lastDialogueText = '';
  let alarmShown = false;

  // util: preload image with timeout
  function preloadImage(src, timeout = 4000) {
    return new Promise(resolve => {
      if (!src) return resolve(false);
      try {
        const i = new Image();
        let done = false;
        const t = setTimeout(()=> { if(!done){ done=true; i.onload=i.onerror=null; resolve(false); } }, timeout);
        i.onload = function(){ if(!done){ done=true; clearTimeout(t); resolve(true); } };
        i.onerror = function(){ if(!done){ done=true; clearTimeout(t); resolve(false); } };
        i.src = src;
      } catch (e) { resolve(false); }
    });
  }

  // resolve image then set src (webp fallback to png) - safe
  async function resolveAndSetImage(imgEl, srcCandidate) {
    if (!imgEl || !srcCandidate) return false;
    try {
      const ok = await preloadImage(srcCandidate);
      if (ok) {
        imgEl.src = srcCandidate;
        imgEl.alt = 'Gato 404';
        imgEl.style.display = 'block';
        return true;
      }
      if (srcCandidate.endsWith('.webp')) {
        const png = srcCandidate.replace(/\.webp$/i, '.png');
        const ok2 = await preloadImage(png);
        if (ok2) {
          imgEl.src = png;
          imgEl.alt = 'Gato 404';
          imgEl.style.display = 'block';
          return true;
        }
      }
    } catch (e) {
      log('resolveAndSetImage error', e);
    }
    // si falla, ocultar imagen para evitar "broken image"
    try { imgEl.removeAttribute('src'); imgEl.alt = ''; imgEl.style.display = 'none'; } catch(e){}
    return false;
  }

  // habilita/deshabilita botones iniciales
  function setControlsEnabled(enabled) {
    try {
      if (!btnNo || !btnYes) return;
      btnNo.disabled = !enabled;
      btnYes.disabled = !enabled;
      btnNo.setAttribute('aria-disabled', String(!enabled));
      btnYes.setAttribute('aria-disabled', String(!enabled));
    } catch(e) { log('setControlsEnabled error', e); }
  }

  // --- DIÁLOGO palabra-por-palabra (con guardado anti-duplicado) ---
  function showCatDialogueWords(text, durationMs) {
    clearTimeout(dialogTimer);
    try {
      catDialogue.classList.remove('fade-in','fade-out');
      if (!text) {
        lastDialogueText = '';
        catDialogue.style.display = 'none';
        catDialogue.innerHTML = '';
        return;
      }
      if (lastDialogueText && lastDialogueText === text) {
        if (durationMs && durationMs > 0) {
          dialogTimer = setTimeout(()=> {
            catDialogue.classList.remove('fade-in');
            catDialogue.classList.add('fade-out');
            setTimeout(()=> { catDialogue.style.display = 'none'; catDialogue.classList.remove('fade-out'); catDialogue.innerHTML = ''; lastDialogueText=''; }, 360);
          }, durationMs);
        }
        return;
      }
      lastDialogueText = text;
      const words = String(text).split(/\s+/).filter(Boolean);
      catDialogue.innerHTML = '';
      const delayBase = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--dialog-word-delay')) || 140;
      words.forEach((w, i) => {
        const sp = document.createElement('span');
        sp.className = 'word';
        sp.textContent = w;
        sp.style.animationDelay = (i * delayBase) + 'ms';
        catDialogue.appendChild(sp);
        catDialogue.appendChild(document.createTextNode(' '));
      });
      catDialogue.style.display = 'block';
      catDialogue.classList.add('fade-in');

      if (durationMs && durationMs > 0) {
        dialogTimer = setTimeout(()=> {
          catDialogue.classList.remove('fade-in');
          catDialogue.classList.add('fade-out');
          setTimeout(()=> { catDialogue.style.display = 'none'; catDialogue.classList.remove('fade-out'); catDialogue.innerHTML = ''; lastDialogueText=''; }, 360);
        }, durationMs);
      }
    } catch(e){ log('showCatDialogueWords error', e); }
  }

  // spawn heart at click coords
  function spawnHeart(clientX, clientY) {
    try {
      const h = document.createElement('div');
      h.className = 'heart';
      h.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21s-7.2-4.35-9.04-6.24C-0.35 11.45 2.4 6 6.5 6c2.1 0 3.3 1.14 4 2.06C11.2 7.14 12.4 6 14.5 6 18.6 6 22.35 11.45 21.04 14.76 19.2 16.65 12 21 12 21z" fill="#6DDC8E"/></svg>';
      const rect = svgHolder.getBoundingClientRect();
      h.style.left = (clientX - rect.left - 18) + 'px';
      h.style.top = (clientY - rect.top - 18) + 'px';
      heartsContainer.appendChild(h);
      setTimeout(()=> { try{ h.remove(); }catch(e){} }, 1100);
    } catch(e){ log('spawnHeart error', e); }
  }

  // spawn reaction emoji (same animation as heart). If 😠 use bigger size.
  function spawnReactionEmoji(symbol, clientX, clientY) {
    try {
      const el = document.createElement('div');
      el.className = 'heart';
      const rect = svgHolder.getBoundingClientRect();
      el.style.left = (clientX - rect.left - 18) + 'px';
      el.style.top = (clientY - rect.top - 18) + 'px';
      if (symbol === '😠') {
        el.innerHTML = `<div style="font-size:55px; line-height:36px">${symbol}</div>`;
      } else {
        el.innerHTML = `<div style="font-size:26px; line-height:26px">${symbol}</div>`;
      }
      heartsContainer.appendChild(el);
      setTimeout(()=> { try{ el.remove(); }catch(e){} }, 1200);
    } catch(e){ log('spawnReactionEmoji error', e); }
  }

  // fur spawn to right/up area
  function startFur() {
    stopFur();
    furInterval = setInterval(() => {
      const rect = svgHolder.getBoundingClientRect();
      const rx = rect.left + rect.width * (0.62 + (Math.random() - 0.5) * 0.12);
      const ry = rect.top + rect.height * (0.28 + (Math.random() - 0.5) * 0.08);
      createFurAt(rx, ry);
    }, 700);
  }
  function stopFur() {
    if (furInterval) { clearInterval(furInterval); furInterval = null; }
  }
  function createFurAt(clientX, clientY) {
    try {
      const f = document.createElement('div');
      f.className = 'fur';
      const rect = svgHolder.getBoundingClientRect();
      const left = (clientX - rect.left - 6) + 'px';
      const top = (clientY - rect.top - 6) + 'px';
      f.style.left = left;
      f.style.top = top;
      heartsContainer.appendChild(f);
      setTimeout(()=> { try{ f.remove(); }catch(e){} }, 2200);
    } catch(e){ log('createFurAt error', e); }
  }

  // show complaint using the same dialogue box (centered)
  function showComplaintInDialogue(text, delay = 0, duration = 2600) {
    setTimeout(()=> {
      showCatDialogueWords(text, duration);
    }, delay);
  }

  // update progress and transitions
  async function updateProgress(newProgress) {
    progress = Math.max(0, Math.min(100, newProgress));
    try {
      if (progressBar) {
        progressBar.style.width = progress + '%';
        progressBar.setAttribute('aria-valuenow', String(progress));
      }
      if (emojiBadge) {
        if (progress < 30) emojiBadge.textContent = '😺';
        else if (progress < 61) emojiBadge.textContent = '🙀';
        else if (progress < 81) emojiBadge.textContent = '😾';
        else emojiBadge.textContent = '💥';
      }

      let state;
      if (progress < 30) state = 'happy';
      else if (progress < 61) state = 'alert';
      else if (progress < 81) state = 'warning';
      else state = 'anger';

      if (state !== lastProgressState) {
        lastProgressState = state;
        if (interactionActive && !finalTriggered) {
          catImage.classList.remove('brush-animate','brush-fast','purr','vibrate','vibrate-more','cat-boom');
          if (state === 'happy') {
            await resolveAndSetImage(catImage, IMG.yes_touch_3);
            catImage.classList.add('brush-animate');
          } else if (state === 'alert') {
            await resolveAndSetImage(catImage, IMG.yes_touch_4);
            catImage.classList.add('brush-animate','brush-fast');
            showCatDialogueWords("¡HEY!! No te emociones demasiado.", DIALOG_TIMERS.dialogVisible);
          } else if (state === 'warning') {
            await resolveAndSetImage(catImage, IMG.yes_touch_5);
            catImage.classList.remove('brush-animate','brush-fast');
            catImage.classList.add('vibrate');
            showCatDialogueWords("¡Eso fue suficiente! Si sigues, voy a reclamar mis derechos felinos.", DIALOG_TIMERS.dialogVisible);
          } else if (state === 'anger') {
            await resolveAndSetImage(catImage, IMG.yes_touch_6);
            triggerFinalState();
          }
        }
      }
    } catch(e) { log('updateProgress error', e); }
  }

  // Start interaction
  function startInteraction() {
    if (!scene2Visible) return;
    interactionActive = true;
    clickCount = 0;
    progress = 0;
    lastProgressState = 'idle';
    updateProgress(0);
    if (instructionPanel) instructionPanel.hidden = false;
    if (progressBox) progressBox.style.display = 'block';
    if (progressWrap) progressWrap.setAttribute('aria-hidden','false');
    if (initialControls) initialControls.style.display = 'none';
    if (btnStop) { btnStop.style.display = 'inline-block'; btnStop.disabled = false; btnStop.setAttribute('aria-disabled','false'); }
    if (landingSubtext) landingSubtext.textContent = "Haz clic suavemente para acariciarlo — no abuses. Cada 3 clics aumentan el nivel de enfado.";
    svgHolder.style.cursor = 'pointer';
    stopFur();
    resetInactivityTimer();
  }

  // Stop interaction -> No-touch result
  async function stopInteractionAsNoTouch() {
    interactionActive = false;
    if (instructionPanel) instructionPanel.hidden = true;
    if (progressBox) progressBox.style.display = 'none';
    if (progressWrap) progressWrap.setAttribute('aria-hidden','true');
    if (progressBar) progressBar.style.width = '0%';
    if (btnStop) btnStop.style.display = 'none';
    if (initialControls) initialControls.style.display = 'none';
    if (ctaGrid) ctaGrid.style.display = 'flex';
    await resolveAndSetImage(catImage, IMG.no_touch_3);
    showCatDialogueWords("Purrr… sigo soñando con pelusas.", DIALOG_TIMERS.dialogVisible);
    try { catImage.classList.add('purr'); } catch(e){}
    if (landingSubtext) landingSubtext.textContent = "¡Genial! Selecciona uno de los botones para continuar.";
    clearInterval(countdownTimer); countdownTimer = null;
    clearTimeout(inactivityTimer); inactivityTimer = null;
    inactivityShown = false;
    startFur();
    svgHolder.style.cursor = 'default';
  }

  // Final: show complaints (as dialogues), show alarm/countdown immediately and CTA
  async function triggerFinalState() {
    if (finalTriggered) return;
    finalTriggered = true;
    interactionActive = false;

    if (instructionPanel) instructionPanel.hidden = true;
    if (progressBox) progressBox.style.display = 'none';
    if (progressWrap) progressWrap.setAttribute('aria-hidden','true');

    stopFur();

    await resolveAndSetImage(catImage, IMG.yes_touch_6);

    // Show alarm and hide landing-subtext immediately
    if (!alarmShown && countdown) {
      alarmShown = true;
      countdown.hidden = false;
      if (landingSubtext) landingSubtext.style.display = 'none';
      if (instructionPanel) instructionPanel.hidden = true;
      if (ctaGrid) ctaGrid.style.display = 'flex';
      startCountdown(60);
    }

    // display complaints sequentially using the same dialogue box (centered)
    const complaints = [
      "¡Qué soy tierno!!",
      "¡Dije SUAVE!!",
      "Todo mundo me toquetea!!",
      "Uno ya no puede trabajar en estas condiciones",
      "Y menos ser peludito!!"
    ];
    let d = 0;
    complaints.forEach((c, i) => {
      showComplaintInDialogue(c, d, 2200);
      d += 1600;
    });

    setTimeout(()=> {
      showCatDialogueWords("¡Quién te dejó tocarme así! Ahora voy a destruir todos los archivos — salva uno antes de que empiece.", 0);
    }, d + 300);

    catImage.classList.remove('cat-boom');
    setTimeout(()=> { try{ catImage.classList.add('cat-boom'); } catch(e){} }, 30);
    svgHolder.style.cursor = 'default';
  }

  // Start countdown (runs continuously once started)
  function startCountdown(seconds) {
    // If already running, do nothing
    if (countdownTimer) return;
    countdownRemaining = Math.max(0, Number(seconds) || 60);
    if (countdownSeconds) countdownSeconds.textContent = countdownRemaining + ' s';
    if (countdown) countdown.hidden = false;

    countdownTimer = setInterval(()=> {
      countdownRemaining -= 1;
      if (countdownSeconds) countdownSeconds.textContent = countdownRemaining + ' s';

      if (countdownRemaining === 5) {
        showCatDialogueWords("Ya verás!!!", 3000);
      }

      if (countdownRemaining <= 0) {
        clearInterval(countdownTimer);
        countdownTimer = null;
        onCountdownZero();
      }
    }, 1000);
  }

  // On countdown zero -> show explosion image (keep visible at least 5s), reveal CTAs and reload later
  async function onCountdownZero() {
    if (landingSubtext) {
      landingSubtext.style.display = ''; 
      landingSubtext.textContent = "El gato ha comenzado la destrucción. Pero tranquilo, puedes volver al sitio con estos botones.";
    }

    await resolveAndSetImage(catImage, IMG.yes_touch_7 || IMG.yes_touch_6);
    if (ctaGrid) ctaGrid.style.display = 'flex';

    catImage.classList.remove('cat-boom'); 
    setTimeout(()=> { try{ catImage.classList.add('cat-boom'); } catch(e){} }, 10);

    setTimeout(()=> {
      try { location.reload(); } catch(e) {}
    }, 6000);
  }

  // inactivity hint timer
  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      if (interactionActive && !finalTriggered) {
        inactivityShown = true;
        if (landingSubtext) landingSubtext.textContent = "¿Cómo interactúo? Haz clic suavemente sobre el gato — verás corazones cuando le guste.";
        svgHolder.style.cursor = 'pointer';
      }
    }, DIALOG_TIMERS.inactivityHint);
  }

  // click handler on holder
  function holderClickHandler(ev) {
    if (!interactionActive || finalTriggered) return;
    clickCount += 1;
    const cx = ev.clientX, cy = ev.clientY;

    if (progress < 30) {
      spawnHeart(cx, cy);

      if (clickCount === 3) {
        showCatDialogueWords("Ser suavecito suma puntos, no lo niego… aunque eso no asegura que te quiera.", DIALOG_TIMERS.dialogVisible);
      } else {
        showCatDialogueWords("Purrr Purrr Purrr", 1200);
      }
    } else if (progress < 61) {
      spawnReactionEmoji('‼️', cx, cy);
    } else if (progress < 81) {
      spawnReactionEmoji('😠', cx, cy);
      // intensify vibrate briefly
      catImage.classList.remove('vibrate-more');
      void catImage.offsetWidth;
      catImage.classList.add('vibrate-more');
      setTimeout(()=> { try{ catImage.classList.remove('vibrate-more'); }catch(e){} }, 700);
    }

    if (clickCount % 3 === 0) {
      updateProgress(progress + 10);
    }

    if (inactivityShown) {
      inactivityShown = false;
      if (landingSubtext) landingSubtext.textContent = "Haz clic suavemente para acariciarlo — no abuses. Mientras más clics, más se enoja.";
    }
    resetInactivityTimer();
  }

  // Scenes: show raster images and optionally dialog
  async function showScene(key, showDialogue = true, persistentDialogue = false) {
    if (!IMG[key]) return;
    await resolveAndSetImage(catImage, IMG[key]);

    catImage.classList.remove('brush-animate','brush-fast','purr','vibrate','vibrate-more','cat-boom');
    setTimeout(()=> { try{ catImage.classList.add('brush-animate'); }catch(e){} }, 80);

    if (key === 'scene2') {
      scene2Visible = true;
      setControlsEnabled(true);
      if (initialControls) initialControls.style.display = '';
    }

    if (!showDialogue) return;

    switch(key) {
      case 'scene1':
        showCatDialogueWords("Amo cuando estoy tranquilo, sin ningún visitante, al fin puedo descansar...", 0);
        break;
      case 'scene2':
        if (persistentDialogue) showCatDialogueWords("Oh!! Alguien me interrumpió en mi rutina de belleza. Estoy en mi momento de cepillado. ¿Realmente tenías que venir aquí?", 0);
        else showCatDialogueWords("Oh!! Alguien me interrumpió en mi rutina de belleza. Estoy en mi momento de cepillado. ¿Realmente tenías que venir aquí?", DIALOG_TIMERS.dialogVisible);
        break;
      case 'yes_touch_3':
        // no auto dialog
        break;
      case 'yes_touch_4':
        showCatDialogueWords("¡HEY!! No te emociones demasiado.", DIALOG_TIMERS.dialogVisible);
        break;
      case 'yes_touch_5':
        showCatDialogueWords("¡Eso fue suficiente! Si sigues, voy a reclamar mis derechos felinos.", DIALOG_TIMERS.dialogVisible);
        break;
      case 'yes_touch_6':
        // final alarm stage handled by triggerFinalState
        break;
      case 'no_touch_3':
        showCatDialogueWords("Purrr… sigo soñando con pelusas.", DIALOG_TIMERS.dialogVisible);
        break;
      default:
        break;
    }
  }

  // BUTTON wiring
  btnYes.addEventListener('click', async function (ev) {
    ev.preventDefault();
    if (!scene2Visible) return;
    await showScene('yes_touch_3', false, false);
    startInteraction();
  });

  btnNo.addEventListener('click', async function (ev) {
    ev.preventDefault();
    if (!interactionActive) {
      if (!scene2Visible) return;
      if (initialControls) initialControls.style.display = 'none';
      if (ctaGrid) ctaGrid.style.display = 'flex';
      await resolveAndSetImage(catImage, IMG.no_touch_3);
      showCatDialogueWords("Purrr… sigo soñando con pelusas.", DIALOG_TIMERS.dialogVisible);
      if (landingSubtext) landingSubtext.textContent = "¡Genial! Selecciona uno de los botones para continuar.";
      try { catImage.classList.add('purr'); } catch(e){}
      startFur();
      return;
    }
    stopInteractionAsNoTouch();
  });

  if (btnStop) {
    btnStop.addEventListener('click', function (ev) {
      ev.preventDefault();
      if (interactionActive) stopInteractionAsNoTouch();
    });
  }

  svgHolder.addEventListener('click', holderClickHandler);

  qsa('#cta-grid a').forEach(a => a.addEventListener('click', () => {
    if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
  }));

  // initial render
  (async function initialRender() {
    await resolveAndSetImage(catImage, IMG.scene1);
    showCatDialogueWords("Amo cuando estoy tranquilo, sin ningún visitante, al fin puedo descansar...", 0);

    preloadImage(IMG.scene2).then(ok => {
      scene2Preloaded = !!ok;
      log('scene2 preloaded:', scene2Preloaded);
      // don't enable controls until we show scene2 (showScene handles enabling)
    });

    autoScene2Timer = setTimeout(()=> {
      if (!interactionActive && !finalTriggered) {
        if (scene2Preloaded) {
          showScene('scene2', true, true);
        } else {
          showCatDialogueWords("Oh!! Alguien me interrumpió en mi rutina de belleza. Estoy en mi momento de cepillado. ¿Realmente tenías que venir aquí?", 0);
        }
      }
    }, DIALOG_TIMERS.initialToScene2);
  })();

  // cleanup
  window.addEventListener('beforeunload', () => {
    clearTimeout(autoScene2Timer);
    clearTimeout(dialogTimer);
    clearInterval(countdownTimer);
    clearTimeout(inactivityTimer);
    stopFur();
  });

  log('inject-gato-raster.js inicializado correctamente.');

})();
