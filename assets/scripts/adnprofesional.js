/* adnprofesional.js */
// ------------------------------------------------------------
// Propósito: Inyectar el bloque "Mi ADN Profesional" en el contenedor #adn-profesional
// Autor: Macarena Baltra — Product & UX Designer
// Fecha: 12-09-2025.
// ------------------------------------------------------------

(function () {
  'use strict';

  const DEBUG = false;
  function log() { if (DEBUG) console.log.apply(console, arguments); }

  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else setTimeout(fn, 0);
  }

  function safeQuery(sel, ctx = document) {
    try { return ctx.querySelector(sel); } catch (e) { return null; }
  }

  function createIconTextItem(iconClass, summaryText, smallText, popoverTitle, popoverContent) {
    const wrapper = document.createElement('div');

    const pIcon = document.createElement('p');
    pIcon.className = 'pointer mb-0 pointer-adn';
    if (popoverTitle && popoverContent) {
      pIcon.setAttribute('data-bs-toggle', 'popover');
      pIcon.setAttribute('data-bs-trigger', 'hover focus');
      pIcon.setAttribute('data-bs-placement', 'top');
      pIcon.setAttribute('data-bs-custom-class', 'custom-popover');
      pIcon.setAttribute('title', popoverTitle);
      pIcon.setAttribute('data-bs-content', popoverContent);
    }
    const i = document.createElement('i');
    i.className = iconClass;
    pIcon.appendChild(i);
    pIcon.appendChild(document.createTextNode(' ' + summaryText));
    wrapper.appendChild(pIcon);

    const pSmall = document.createElement('p');
    pSmall.className = 'textdescriptions mb-0 fs-6';
    const small = document.createElement('small');
    small.textContent = smallText;
    pSmall.appendChild(small);
    wrapper.appendChild(pSmall);

    return wrapper;
  }

  function createDesktopBlock() {
    const desktop = document.createElement('div');
    desktop.className = 'd-none d-sm-block';

    const learning = document.createElement('div');
    learning.className = 'learning align-items-center bg-body-secondary p-4';

    const headerWrap = document.createElement('div');
    const h5 = document.createElement('h5');
    h5.className = 'text-center pb-0 mb-0';
    h5.textContent = 'Mi ADN Profesional';
    headerWrap.appendChild(h5);

    const pIntro = document.createElement('p');
    pIntro.className = 'text-center border-top pb-0 mb-0';
    const smallIntro = document.createElement('small');
    smallIntro.innerHTML = 'Lo que Me Mueve<br/>y Me Define';
    pIntro.appendChild(smallIntro);
    headerWrap.appendChild(pIntro);

    learning.appendChild(headerWrap);

    const item1 = createIconTextItem(
      'fa-solid fa-brain',
      'INFJ',
      'Diseñadora INFJ | UX Empático | Resolución de Problemas Intuitiva',
      'Empatía Estratégica (INFJ)',
      'Como Diseñadora UX/UI INFJ, mi intuición me permite identificar necesidades no expresadas y diseñar soluciones que resuenen con usuarios y equipos. Combino análisis profundo con creatividad para transformar retos complejos en experiencias digitales.'
    );
    const item2 = createIconTextItem(
      'fa-solid fa-wand-magic-sparkles',
      'DIY',
      'Proactividad Creativa | Aprendizaje Autodidacta | Innovación DIY',
      'Autonomía Creativa (DIY)',
      'Mi pasión por el “Do It Yourself” demuestra mi autonomía y curiosidad: aprendo nuevas herramientas y metodologías por mi cuenta para mejorar procesos y acelerar entregas. Esta mentalidad “maker” impulsa mi capacidad de iterar rápido y aportar innovación tangible a cada proyecto.'
    );
    const item3 = createIconTextItem(
      'fa-solid fa-users',
      'Team Player',
      'Equipo Multidisciplinario | Cultura Colaborativa | Multifuncional',
      'Colaboración (Team Player)',
      'Trabajo de la mano con desarrolladores, marketers y directivos para alinear visión y objetivos. Mi enfoque colaborativo garantiza flujos de comunicación claros, respeto por la diversidad de roles y cumplimiento de metas compartidas, fortaleciendo la cultura y el rendimiento del equipo.'
    );
    const item4 = createIconTextItem(
      'fa-solid fa-hand-holding-heart',
      'Bienestar Sostenible',
      'Equilibrio Vida Trabajo | Well-Being Laboral | Sostenibilidad Profesional',
      'Equilibrio Vida-Trabajo',
      'Creo firmemente que cuidar de mí misma es cuidar la calidad de mi trabajo. Mantener un balance entre proyectos y momentos personales me ayuda a mantener la creatividad fresca y las entregas impecables, siempre con energía y entusiasmo.'
    );

    learning.appendChild(item1);
    learning.appendChild(item2);
    learning.appendChild(item3);
    learning.appendChild(item4);

    desktop.appendChild(learning);
    return desktop;
  }

  function createMobileBlock() {
    const mobile = document.createElement('div');
    mobile.className = 'd-block d-sm-none bg-body-secondary p-4';

    const h2 = document.createElement('h2');
    h2.className = 'text-center mb-0';
    h2.textContent = 'Mi ADN Profesional';
    mobile.appendChild(h2);

    const pIntro = document.createElement('p');
    pIntro.className = 'text-center my-lg-4 my-md-4 border-bottom mb-4 pb-2';
    const smallIntro = document.createElement('small');
    smallIntro.textContent = 'Lo que Me Mueve y Me Define';
    pIntro.appendChild(smallIntro);
    mobile.appendChild(pIntro);

    function makeMobileItem(iconClass, titleText, boldText, paragraphText, smallText) {
      const wrap = document.createElement('div');
      wrap.className = 'text-center mt-2 small text-xs-interests p-3';

      const h4 = document.createElement('h4');
      const i = document.createElement('i');
      i.className = iconClass + ' color-secondary';
      h4.appendChild(i);
      h4.appendChild(document.createTextNode(' ' + titleText));
      wrap.appendChild(h4);

      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = boldText;
      p.appendChild(strong);
      p.appendChild(document.createTextNode(' ' + paragraphText));
      wrap.appendChild(p);

      const pSmall = document.createElement('p');
      pSmall.className = 'textdescriptions mb-0 fs-6';
      const small = document.createElement('small');
      small.textContent = smallText;
      pSmall.appendChild(small);
      wrap.appendChild(pSmall);

      return wrap;
    }

    mobile.appendChild(makeMobileItem(
      'fa-solid fa-brain',
      'INFJ',
      'Empatía Estratégica (INFJ):',
      'Como Diseñadora UX/UI INFJ, mi intuición me permite identificar necesidades no expresadas y diseñar soluciones que resuenen con usuarios y equipos. Combino análisis profundo con creatividad para transformar retos complejos en experiencias digitales.',
      'Diseñadora INFJ | UX Empático | Resolución de Problemas Intuitiva'
    ));

    mobile.appendChild(makeMobileItem(
      'fa-solid fa-wand-magic-sparkles',
      'DIY',
      'Autonomía Creativa (DIY):',
      'Mi pasión por el “Do It Yourself” demuestra mi autonomía y curiosidad: aprendo nuevas herramientas y metodologías por mi cuenta para mejorar procesos y acelerar entregas. Esta mentalidad “maker” impulsa mi capacidad de iterar rápido y aportar innovación tangible a cada proyecto.',
      'Proactividad Creativa | Aprendizaje Autodidacta | Innovación DIY'
    ));

    mobile.appendChild(makeMobileItem(
      'fa-solid fa-users',
      'Team Player',
      'Colaboración (Team Player):',
      'Trabajo de la mano con desarrolladores, marketers y directivos para alinear visión y objetivos. Mi enfoque colaborativo garantiza flujos de comunicación claros, respeto por la diversidad de roles y cumplimiento de metas compartidas, fortaleciendo la cultura y el rendimiento del equipo.',
      'Equipo Multidisciplinario | Cultura Colaborativa | Multifuncional'
    ));

    mobile.appendChild(makeMobileItem(
      'fa-solid fa-hand-holding-heart',
      'Bienestar Sostenible',
      'Equilibrio Vida-Trabajo:',
      'Creo firmemente que cuidar de mí misma es cuidar la calidad de mi trabajo. Mantener un balance entre proyectos y momentos personales me ayuda a mantener la creatividad fresca y las entregas impecables, siempre con energía y entusiasmo.',
      'Equilibrio Vida Trabajo | Well-Being Laboral | Sostenibilidad Profesional'
    ));

    return mobile;
  }

  function initPopovers(container) {
    if (!container) return;
    try {
      if (window.bootstrap && typeof bootstrap.Popover === 'function') {
        const nodes = container.querySelectorAll('[data-bs-toggle="popover"]');
        nodes.forEach((el) => {
          try {
            if (el.__popoverInstance && typeof el.__popoverInstance.dispose === 'function') {
              el.__popoverInstance.dispose();
            }
          } catch (e) {}
          try {
            const opts = {
              trigger: el.getAttribute('data-bs-trigger') || 'hover focus',
              placement: el.getAttribute('data-bs-placement') || 'top',
              container: 'body',
              customClass: el.getAttribute('data-bs-custom-class') || ''
            };
            const instance = new bootstrap.Popover(el, opts);
            el.__popoverInstance = instance;
          } catch (err) {
            if (DEBUG) console.warn('[adnprofesional] popover init failed', err);
          }
        });
      }
    } catch (e) {
      if (DEBUG) console.warn('[adnprofesional] initPopovers error', e);
    }
  }

  function renderAdnProfessional() {
    const container = safeQuery('#adn-profesional');
    if (!container) return;

    if (container.dataset && container.dataset.inited === '1') {
      log('[adnprofesional] already injected');
      return;
    }

    try {
      if (!container.hasAttribute('role')) container.setAttribute('role', 'complementary');
      if (!container.hasAttribute('aria-label')) container.setAttribute('aria-label', 'Sección Mi ADN Profesional');

      const block = document.createElement('div');
      block.id = 'adn-profesional-block';

      block.appendChild(createDesktopBlock());
      block.appendChild(createMobileBlock());

      container.appendChild(block);
      if (container.dataset) container.dataset.inited = '1';

      initPopovers(block);
    } catch (e) {
      console.error('[adnprofesional] render error', e);
    }
  }

  onReady(function () {
    renderAdnProfessional();
  });

})();