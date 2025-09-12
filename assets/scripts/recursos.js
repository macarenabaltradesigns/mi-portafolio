/* recursos.js
// ------------------------------------------------------------
 * Carrusel nativo con arrastre (drag/pointer) y formulario dinámico.
 *
 * Propósito:
 *  - Proveer un slider horizontal accesible con soporte drag (Pointer Events).
 *  - Mostrar progress bar reactiva conforme el usuario navega el slider.
 *  - Generar un formulario robusto, con validaciones básicas y envío mediante fetch
 *    usando AbortController para timeout.
 *  - Evitar innerHTML para datos dinámicos (usar creación DOM segura).
 *
 *  Autor: Macarena Baltra — Product & UX Designer
 *  Fecha: 12-09-2025.
 ------------------------------------------------------------ */

(function () {
  'use strict';

  /* ------------------ Config (ajustable) ------------------ */
  const PRODUCT_URLS = {
    'ebook-branding': {
      descripcion: 'Guía paso a paso para modernizar tu marca.',
      gratis: 'https://drive.google.com/branding.pdf',
      pago: 'https://hotmart.com/branding'
    },
    'ebook-uxui': {
      descripcion: 'Conceptos clave para diseñar experiencias atractivas.',
      gratis: 'https://drive.google.com/uxui.pdf',
      pago: 'https://hotmart.com/uxui'
    },
    'ebook-accessibility': {
      descripcion: 'Mejores prácticas de accesibilidad web.',
      gratis: 'https://drive.google.com/accessibility.pdf',
      pago: 'https://hotmart.com/accessibility'
    },
    'ebook-design-thinking': {
      descripcion: 'Metodología Design Thinking para proyectos UX.',
      gratis: null,
      pago: 'https://hotmart.com/design-thinking'
    },
    'ebook-responsive': {
      descripcion: 'Diseño responsive avanzado en 2025.',
      gratis: 'https://drive.google.com/responsive.pdf',
      pago: 'https://hotmart.com/responsive'
    }
  };

  const STYLE_ID = 'recursos-dynamic-styles';
  const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxsRKrB5fRtrqE_SZnxe94dB00YhWSV86xymtDk2iEAW4KptaevrvjRuXClXVEy9L9A/exec';
  const FETCH_TIMEOUT_MS = 9000;

  /* ------------------ Utilities ------------------ */
  function qs(sel, ctx = document) { try { return (ctx || document).querySelector(sel); } catch (e) { return null; } }
  function qsa(sel, ctx = document) { try { return Array.from((ctx || document).querySelectorAll(sel)); } catch (e) { return []; } }
  function isElement(node) { return node && node.nodeType === Node.ELEMENT_NODE; }

  function create(tag, props = {}, children = []) {
    const el = document.createElement(tag);
    Object.keys(props || {}).forEach(k => {
      if (k === 'className') el.className = props[k];
      else if (k === 'text') el.textContent = props[k];
      else if (k === 'html') el.innerHTML = props[k]; // trusted static usage only
      else if (k === 'style' && typeof props[k] === 'object') Object.assign(el.style, props[k]);
      else el.setAttribute(k, props[k]);
    });
    (Array.isArray(children) ? children : [children]).forEach(c => { if (c) el.appendChild(c); });
    return el;
  }

  function escapeHtml(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  function debounce(fn, wait) {
    let t;
    return function () { clearTimeout(t); t = setTimeout(() => fn.apply(this, arguments), wait); };
  }
  function throttle(fn, limit) {
    let waiting = false;
    return function () {
      if (!waiting) {
        fn.apply(this, arguments);
        waiting = true;
        setTimeout(() => waiting = false, limit);
      }
    };
  }

  /* ------------------ Inject styles (once) ------------------ */
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.appendChild(document.createTextNode(`
      /* Recursos slider styles (inyectado) */
      #recursos-slider { display:flex; overflow-x:hidden; gap:1rem; padding:1rem 0 4rem; position:relative; user-select:none; cursor:grab; -webkit-overflow-scrolling: touch; }
      #recursos-slider .card { transition: transform 0.18s ease, box-shadow 0.18s ease; border-radius:8px; overflow:hidden; }
      #recursos-slider .card:focus-within, #recursos-slider .card:hover { transform: translateY(-4px); box-shadow: 0 6px 18px rgba(0,0,0,0.12); }
      .hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      .recursos-progress-wrap { display:flex; justify-content:center; margin-top:.5rem; }
      .recursos-progress { width: min(720px, 90%); height:6px; background:#e9ecef; border-radius:3px; overflow:hidden; }
      .recursos-progress-bar { height:100%; width:0%; background:linear-gradient(90deg,#2dd4bf,#06b6d4); transition:width 120ms linear; }
      .recursos-card-badge { position:absolute; bottom:0; left:50%; transform:translateX(-50%); margin-bottom:0.6rem; border-radius:0; font-size:1rem; cursor:pointer; padding:.45rem .9rem; }
      .injected-bg { background-position:center; background-size:cover; background-repeat:no-repeat; }
      @media (max-width: 575px) { #recursos-slider .card { width: 86vw !important; } }
    `));
    document.head.appendChild(style);
  }

  /* ------------------ Main init ------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    try { initSlider(); } catch (e) { console.error('recursos.initSlider error', e); }
    try { initForm(); } catch (e) { console.error('recursos.initForm error', e); }
  });

  /* ------------------ Slider ------------------ */
  function initSlider() {
    const container = document.getElementById('recursos-slider');
    if (!container) return;

    // Header (static trusted HTML)
    const headerWrapper = create('div', { className: 'container' }, create('div', { className: 'px-4 my-5', html: `
      <h2 class="pb-2 border-bottom">Recursos y Guías</h2>
      <p>Descubre nuestros productos gratuitos y pagados para potenciar tu proyecto.</p>
    ` }));

    if (container.parentNode && (!container.previousElementSibling || !container.previousElementSibling.querySelector || !container.previousElementSibling.querySelector('h2'))) {
      container.parentNode.insertBefore(headerWrapper, container);
    }

    container.classList.add('hide-scrollbar');

    // Progress bar creation
    let progressWrap = container.parentNode ? container.parentNode.querySelector('.recursos-progress-wrap') : null;
    if (!progressWrap && container.parentNode) {
      progressWrap = create('div', { className: 'recursos-progress-wrap' });
      const progressBar = create('div', { className: 'recursos-progress' });
      const barInner = create('div', { className: 'recursos-progress-bar' });
      progressBar.appendChild(barInner);
      progressWrap.appendChild(progressBar);
      container.parentNode.insertBefore(progressWrap, container.nextSibling);
    }
    const progressBarEl = container.parentNode ? container.parentNode.querySelector('.recursos-progress-bar') : null;

    // update progress on scroll
    function updateProgress() {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const percent = maxScroll > 0 ? (container.scrollLeft / maxScroll) * 100 : 0;
      if (progressBarEl) progressBarEl.style.width = Math.min(100, Math.max(0, percent)) + '%';
    }
    container.addEventListener('scroll', throttle(updateProgress, 50));
    updateProgress();

    // Pointer drag support
    let isDragging = false, startX = 0, startScroll = 0, lastPointerId = null;
    container.addEventListener('pointerdown', (ev) => {
      if (ev.pointerType === 'mouse' && ev.button !== 0) return;
      isDragging = true;
      lastPointerId = ev.pointerId;
      try { container.setPointerCapture(ev.pointerId); } catch (e) {}
      startX = ev.clientX;
      startScroll = container.scrollLeft;
      container.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    });
    container.addEventListener('pointermove', (ev) => {
      if (!isDragging || ev.pointerId !== lastPointerId) return;
      ev.preventDefault();
      const dx = ev.clientX - startX;
      container.scrollLeft = startScroll - dx;
    });
    function endDrag(ev) {
      if (!isDragging) return;
      isDragging = false;
      lastPointerId = null;
      try { container.releasePointerCapture && container.releasePointerCapture(ev && ev.pointerId); } catch (e) {}
      container.style.cursor = 'grab';
      document.body.style.userSelect = '';
      updateProgress();
    }
    container.addEventListener('pointerup', endDrag);
    container.addEventListener('pointercancel', endDrag);
    container.addEventListener('pointerleave', endDrag);

    // keyboard accessibility
    if (!container.hasAttribute('tabindex')) container.tabIndex = 0;
    container.addEventListener('keydown', (ev) => {
      const key = ev.key;
      if (key === 'ArrowRight') { container.scrollBy({ left: 320, behavior: 'smooth' }); ev.preventDefault(); }
      if (key === 'ArrowLeft') { container.scrollBy({ left: -320, behavior: 'smooth' }); ev.preventDefault(); }
    });

    // create cards based on PRODUCT_URLS
    Object.entries(PRODUCT_URLS).forEach(([id, info]) => {
      const card = create('article', { className: 'card position-relative flex-shrink-0', role: 'group', 'aria-label': formatTitle(id) });
      Object.assign(card.style, { width: '395px', scrollSnapAlign: 'start', backgroundColor: info.gratis ? '#2d0057' : '#12105f', color: '#ffffff' });

      const body = create('div', { className: 'card-body text-start', style: { userSelect: 'none' } });
      const h5 = create('h5', { className: 'card-title fontmontserrat', text: formatTitle(id) });
      const p = create('p', { className: 'card-text' });
      p.appendChild(create('small', { html: escapeHtml(info.descripcion || '') }));

      body.appendChild(h5);
      body.appendChild(p);
      card.appendChild(body);

      // accessible badge/button
      const btn = create('button', {
        className: `recursos-card-badge ${info.gratis ? 'btn btn-success' : 'btn btn-warning text-dark'}`,
        type: 'button',
        'aria-pressed': 'false',
        'data-product-id': id,
        'data-product-gratis': !!info.gratis ? 'true' : 'false'
      });
      btn.textContent = info.gratis ? 'Gratis' : 'Pagado';
      btn.addEventListener('click', () => selectProduct(id, !!info.gratis));
      btn.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); selectProduct(id, !!info.gratis); } });

      card.appendChild(btn);
      container.appendChild(card);
    });

    container.style.cursor = 'grab';
    window.addEventListener('resize', debounce(updateProgress, 180));
  }

  /* ------------------ Form ------------------ */
  function initForm() {
    const formContainer = document.getElementById('formulario-descarga');
    if (!formContainer) return;

    // build form safely with DOM APIs
    const form = create('form', { id: 'descarga-form', className: 'p-4 border rounded bg-light', action: '#', method: 'post', 'aria-label': 'Formulario de descarga' });

    const row = create('div', { className: 'row' });
    const col1 = create('div', { className: 'col-12 col-md-6' });
    const col2 = create('div', { className: 'col-12 col-md-6' });

    col1.appendChild(makeFormGroup('nombre', 'Nombre', 'text', true));
    col1.appendChild(makeFormGroup('correo', 'Correo electrónico', 'email', true));
    col1.appendChild(makeSelectGroup('perfil', 'Perfil de usuario', [
      { value: '', text: 'Selecciona...' },
      { value: 'reclutador', text: 'Reclutador/a' },
      { value: 'cliente', text: 'Cliente' },
      { value: 'disenador', text: 'Diseñador/a' },
      { value: 'otro', text: 'Otro' }
    ], true));

    col2.appendChild(makeFormGroup('apellido', 'Apellido', 'text', true));
    col2.appendChild(makeSelectGroup('uso', '¿Para qué lo usarás?', [
      { value: '', text: 'Selecciona...' },
      { value: 'negocio', text: 'Negocio/empresa' },
      { value: 'aprender', text: 'Aprender algo nuevo' },
      { value: 'reclutamiento', text: 'Proceso de reclutamiento' },
      { value: 'otro', text: 'Otro' }
    ], false));

    // producto select
    const productGroup = create('div', { className: 'mb-3' });
    const productLabel = create('label', { for: 'select-producto', className: 'form-label', text: 'Selecciona recurso' });
    const productSelect = create('select', { id: 'select-producto', className: 'form-select', required: 'required', 'aria-required': 'true' });
    productSelect.appendChild(create('option', { value: '', text: '-- Elige un producto --' }));
    Object.entries(PRODUCT_URLS).forEach(([id, info]) => {
      const opt = create('option', { value: id, text: formatTitle(id) });
      if (info.gratis) opt.dataset.gratis = 'true';
      else opt.dataset.gratis = 'false';
      productSelect.appendChild(opt);
    });
    productGroup.appendChild(productLabel);
    productGroup.appendChild(productSelect);
    col2.appendChild(productGroup);

    row.appendChild(col1);
    row.appendChild(col2);
    form.appendChild(row);

    const btnWrap = create('div', { className: 'd-flex gap-2 mt-2' });
    const btnFree = create('button', { id: 'btn-free', type: 'submit', className: 'btn btn-success flex-fill', text: 'Descargar gratis' });
    const btnPrice = create('button', { id: 'btn-price', type: 'submit', className: 'btn btn-warning text-dark flex-fill', text: 'Comprar' });
    btnFree.style.display = 'none';
    btnPrice.style.display = 'none';
    btnWrap.appendChild(btnFree);
    btnWrap.appendChild(btnPrice);
    form.appendChild(btnWrap);

    const feedback = create('div', { id: 'form-feedback', className: 'mt-3' });
    form.appendChild(feedback);

    formContainer.innerHTML = '';
    formContainer.appendChild(form);

    // listeners
    productSelect.addEventListener('change', (ev) => {
      const selected = ev.target.options[ev.target.selectedIndex];
      const isGratis = selected && selected.dataset && selected.dataset.gratis === 'true';
      toggleButtons(isGratis);
    });

    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      feedback.innerHTML = '';
      const data = {
        nombre: form.querySelector('#nombre').value.trim(),
        apellido: form.querySelector('#apellido').value.trim(),
        correo: form.querySelector('#correo').value.trim(),
        perfil: form.querySelector('#perfil').value,
        uso: form.querySelector('#uso').value,
        producto: form.querySelector('#select-producto').value,
      };

      if (!data.nombre || !data.apellido || !data.correo || !data.perfil || !data.producto) {
        showFeedback(feedback, 'Completa todos los campos obligatorios.', 'danger');
        return;
      }
      if (!validateEmail(data.correo)) {
        showFeedback(feedback, 'Ingresa un correo válido.', 'danger');
        return;
      }

      const selOpt = form.querySelector('#select-producto').selectedOptions[0];
      const pago = !(selOpt && selOpt.dataset && selOpt.dataset.gratis === 'true');
      data.pago = pago;

      // send with timeout
      try {
        showFeedback(feedback, 'Enviando datos…', 'info');
        const controller = new AbortController();
        const idTimeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

        const resp = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tipo: 'descarga', ...data }),
          signal: controller.signal
        });
        clearTimeout(idTimeout);

        if (!resp.ok) {
          showFeedback(feedback, 'Error en el servidor. Intenta más tarde.', 'danger');
          return;
        }
        const json = await resp.json().catch(() => null);
        if (!json || json.status === 'OK' || resp.status === 200) {
          const urls = PRODUCT_URLS[data.producto] || {};
          const targetUrl = pago ? urls.pago : urls.gratis;
          if (targetUrl) {
            window.location.href = targetUrl;
          } else {
            showFeedback(feedback, 'Recurso no disponible.', 'warning');
          }
        } else {
          showFeedback(feedback, 'Error al enviar datos. Intenta más tarde.', 'danger');
        }
      } catch (err) {
        if (err && err.name === 'AbortError') {
          showFeedback(feedback, 'Tiempo de espera agotado. Revisa tu conexión.', 'warning');
        } else {
          showFeedback(feedback, 'Error de conexión. Intenta más tarde.', 'danger');
        }
      }
    });
  }

  /* ------------------ Small helpers for form building ------------------ */
  function makeFormGroup(id, labelText, type = 'text', required = false) {
    const wrap = create('div', { className: 'mb-3' });
    const label = create('label', { for: id, className: 'form-label', text: labelText + (required ? ' *' : '') });
    const input = create('input', { id: id, type: type, className: 'form-control' });
    if (required) input.required = true;
    wrap.appendChild(label);
    wrap.appendChild(input);
    return wrap;
  }

  function makeSelectGroup(id, labelText, options = [], required = false) {
    const wrap = create('div', { className: 'mb-3' });
    const label = create('label', { for: id, className: 'form-label', text: labelText + (required ? ' *' : '') });
    const select = create('select', { id: id, className: 'form-select' });
    if (required) select.required = true;
    options.forEach(opt => {
      const o = create('option', { value: opt.value, text: opt.text });
      select.appendChild(o);
    });
    wrap.appendChild(label);
    wrap.appendChild(select);
    return wrap;
  }

  /* ------------------ Validation & UI feedback ------------------ */
  function validateEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
  function showFeedback(container, message, level = 'info') {
    if (!container) return;
    container.innerHTML = '';
    const alert = create('div', { className: `alert alert-${level}` });
    alert.textContent = message;
    container.appendChild(alert);
    try { alert.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
  }

  /* ------------------ Helpers: selectProduct & toggleButtons ------------------ */
  function formatTitle(id) {
    return String(id).replace(/^ebook-/, '').replace(/-/g, ' ').replace(/(?:^|\s)\S/g, l => l.toUpperCase());
  }

  function selectProduct(id, isGratis) {
    const sel = qs('#select-producto');
    if (!sel) return;
    sel.value = id;
    toggleButtons(!!isGratis);
    const formContainer = qs('#formulario-descarga');
    if (formContainer) {
      try { formContainer.scrollIntoView({ behavior: 'smooth' }); } catch (e) {}
      const firstInput = formContainer.querySelector('input,select,textarea');
      if (firstInput) try { firstInput.focus(); } catch (e) {}
    }
  }

  function toggleButtons(isGratis) {
    const btnFree = qs('#btn-free');
    const btnPrice = qs('#btn-price');
    if (btnFree) btnFree.style.display = isGratis ? 'block' : 'none';
    if (btnPrice) btnPrice.style.display = isGratis ? 'none' : 'block';
  }

})();