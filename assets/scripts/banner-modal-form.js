// banner-modal-form.js
// ------------------------------------------------------------
// Propósito: Inyectar banners tipo "ebook" y gestionar el modal/form de descarga/compra.
// Autor: Macarena Baltra — Product & UX Designer
// Fecha: 12-09-2025.
// ------------------------------------------------------------

(function () {
  'use strict';

  const DEBUG = false;
  const log = (...args) => { if (DEBUG) console.log('[banner-modal-form]', ...args); };

  // Mapa de e-books y sus URLs (agregar/ajustar según sea necesario)
  const PRODUCT_URLS = {
    'banner-ebook-price-memoriaemocional': {
      title: 'E-Book Memoria Emocional',
      subtitle: 'Aprende el método paso a paso, aunque no seas diseñador.',
      ctaText: 'Quiero mi e-book',
      pago: true,
      pagoUrl: 'https://hotmart.com/',
      gratisUrl: ''
    },
    'banner-ebook-free-branding': {
      title: 'E-Book Branding',
      subtitle: 'Guía esencial para potenciar la identidad de tu marca.',
      ctaText: 'Quiero mi e-book gratis',
      pago: false,
      pagoUrl: '',
      gratisUrl: 'https://drive.google.com/'
    },
    'banner-ebook-free-checklistactualizacionsemestral': {
      title: 'Checklist de Actualización Semestral',
      subtitle: 'Guía paso a paso para auditar front-end, UX/UI y branding.',
      ctaText: 'Quiero mi checklist gratis',
      pago: false,
      pagoUrl: '',
      gratisUrl: 'https://drive.google.com/'
    }
    // Añade más banners siguiendo el mismo esquema
  };

  // Helpers
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

  function normalizeUrl(u) {
    if (!u) return '';
    try {
      // Si es relativa, dejarla como está; si es absoluta, crear URL segura
      if (/^https?:\/\//i.test(u)) return u;
      return u;
    } catch (e) { return u; }
  }

  // Modal factory: crea modal en el body si no existe y devuelve el objeto con referencias útiles.
  function getOrCreateEbookModal() {
    let modalEl = safeQuery('#ebookModal');
    if (modalEl) {
      return { modalEl, bodyContainer: safeQuery('#modal-form-container', modalEl), instance: (window.bootstrap && bootstrap.Modal) ? bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl) : null };
    }

    // Crear estructura DOM del modal de forma programática (evitar innerHTML)
    modalEl = document.createElement('div');
    modalEl.id = 'ebookModal';
    modalEl.className = 'modal fade';
    modalEl.tabIndex = -1;
    modalEl.setAttribute('aria-labelledby', 'ebookModalLabel');
    modalEl.setAttribute('aria-hidden', 'true');
    modalEl.setAttribute('role', 'dialog');

    const dialog = document.createElement('div');
    dialog.className = 'modal-dialog modal-dialog-centered';
    dialog.setAttribute('role', 'document');

    const content = document.createElement('div');
    content.className = 'modal-content';

    const header = document.createElement('div');
    header.className = 'modal-header';

    const title = document.createElement('h5');
    title.className = 'modal-title';
    title.id = 'ebookModalLabel';
    title.textContent = ''; // fill later

    const btnClose = document.createElement('button');
    btnClose.type = 'button';
    btnClose.className = 'btn-close';
    btnClose.setAttribute('data-bs-dismiss', 'modal');
    btnClose.setAttribute('aria-label', 'Cerrar');

    header.appendChild(title);
    header.appendChild(btnClose);

    const body = document.createElement('div');
    body.className = 'modal-body';

    const formContainer = document.createElement('div');
    formContainer.id = 'modal-form-container';

    body.appendChild(formContainer);

    content.appendChild(header);
    content.appendChild(body);
    dialog.appendChild(content);
    modalEl.appendChild(dialog);

    // append to body
    document.body.appendChild(modalEl);

    // Initialize bootstrap modal instance if available
    let instance = null;
    if (window.bootstrap && typeof bootstrap.Modal === 'function') {
      instance = new bootstrap.Modal(modalEl, { backdrop: 'static', keyboard: true });
    }

    return { modalEl, bodyContainer: formContainer, instance };
  }

  // Construye el DOM del banner dentro del slot (sin innerHTML)
  function buildBannerNode(id, info) {
    const wrapper = document.createElement('div');
    wrapper.className = `banner-ebook ${id} my-5`;
    wrapper.setAttribute('role', 'button');
    wrapper.setAttribute('tabindex', '0');
    wrapper.setAttribute('aria-label', info.title || 'Banner e-book');

    const overlay = document.createElement('div');
    overlay.className = 'banner-ebook__overlay';
    wrapper.appendChild(overlay);

    const content = document.createElement('div');
    content.className = 'banner-ebook__content';

    const h1 = document.createElement('h1');
    h1.className = 'banner-ebook__title';
    h1.textContent = info.title || '';
    content.appendChild(h1);

    const p = document.createElement('p');
    p.className = 'banner-ebook__text';
    p.textContent = info.subtitle || '';
    content.appendChild(p);

    const a = document.createElement('a');
    a.className = 'banner-ebook__button';
    a.href = '#';
    a.setAttribute('role', 'link');
    a.textContent = info.ctaText || 'Quiero';
    // allow keyboard activation
    a.addEventListener('click', (ev) => ev.preventDefault());
    content.appendChild(a);

    wrapper.appendChild(content);

    return wrapper;
  }

  // Construye el formulario DOM y devuelve el <form> element
  function buildEbookForm(info) {
    const container = document.createElement('div');
    container.className = 'p-4';

    const form = document.createElement('form');
    form.id = 'ebook-download-form';
    form.setAttribute('novalidate', 'novalidate');

    // Nombre
    const divNombre = document.createElement('div');
    divNombre.className = 'mb-3';
    const labelNombre = document.createElement('label');
    labelNombre.className = 'form-label';
    labelNombre.setAttribute('for', 'modal-nombre');
    labelNombre.innerHTML = 'Nombre <span class="text-danger">*</span>';
    const inputNombre = document.createElement('input');
    inputNombre.type = 'text';
    inputNombre.className = 'form-control';
    inputNombre.id = 'modal-nombre';
    inputNombre.required = true;
    divNombre.appendChild(labelNombre);
    divNombre.appendChild(inputNombre);
    form.appendChild(divNombre);

    // Correo
    const divCorreo = document.createElement('div');
    divCorreo.className = 'mb-3';
    const labelCorreo = document.createElement('label');
    labelCorreo.className = 'form-label';
    labelCorreo.setAttribute('for', 'modal-correo');
    labelCorreo.innerHTML = 'Correo electrónico <span class="text-danger">*</span>';
    const inputCorreo = document.createElement('input');
    inputCorreo.type = 'email';
    inputCorreo.className = 'form-control';
    inputCorreo.id = 'modal-correo';
    inputCorreo.required = true;
    divCorreo.appendChild(labelCorreo);
    divCorreo.appendChild(inputCorreo);
    form.appendChild(divCorreo);

    // Perfil
    const divPerfil = document.createElement('div');
    divPerfil.className = 'mb-3';
    const labelPerfil = document.createElement('label');
    labelPerfil.className = 'form-label';
    labelPerfil.setAttribute('for', 'modal-perfil');
    labelPerfil.textContent = 'Perfil de usuario ';
    const spanReq = document.createElement('span');
    spanReq.className = 'text-danger';
    spanReq.textContent = '*';
    labelPerfil.appendChild(spanReq);

    const selectPerfil = document.createElement('select');
    selectPerfil.id = 'modal-perfil';
    selectPerfil.className = 'form-select';
    selectPerfil.required = true;

    const optPlaceholder = document.createElement('option');
    optPlaceholder.value = '';
    optPlaceholder.textContent = 'Selecciona...';
    selectPerfil.appendChild(optPlaceholder);

    const options = [
      { v: 'reclutador', t: 'Reclutador/a' },
      { v: 'cliente', t: 'Cliente' },
      { v: 'disenador', t: 'Diseñador/a' },
      { v: 'otro', t: 'Otro' }
    ];
    options.forEach(o => {
      const opt = document.createElement('option');
      opt.value = o.v;
      opt.textContent = o.t;
      selectPerfil.appendChild(opt);
    });

    divPerfil.appendChild(labelPerfil);
    divPerfil.appendChild(selectPerfil);
    form.appendChild(divPerfil);

    // Submit button
    const divSubmit = document.createElement('div');
    divSubmit.className = 'd-grid';
    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.className = `btn ${info.pago ? 'btn-free-recursos' : 'btn-price-recursos'}`;
    btn.textContent = info.pago ? 'Comprar' : 'Descargar gratis';
    divSubmit.appendChild(btn);
    form.appendChild(divSubmit);

    container.appendChild(form);
    return { container, form };
  }

  /**
   * Abre modal con formulario para bannerId.
   * @param {string} bannerId
   */
  async function openEbookModal(bannerId) {
    try {
      const info = PRODUCT_URLS[bannerId];
      if (!info) return;

      const { modalEl, bodyContainer, instance } = getOrCreateEbookModal();

      // Establecer título accesible
      const titleEl = safeQuery('#ebookModalLabel', modalEl);
      if (titleEl) titleEl.textContent = info.title || '';

      // Limpiar contenido previo y construir form de forma segura
      // removemos listeners previos invocados por submit handlers guardados en dataset
      if (bodyContainer._currentFormSubmitRemover) {
        try { bodyContainer._currentFormSubmitRemover(); } catch (e) {}
        bodyContainer._currentFormSubmitRemover = null;
      }
      // limpiar nodo
      while (bodyContainer.firstChild) bodyContainer.removeChild(bodyContainer.firstChild);

      const { container, form } = buildEbookForm(info);
      bodyContainer.appendChild(container);

      // Submit handler
      const onSubmit = async (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        const nombre = (safeQuery('#modal-nombre', form) && safeQuery('#modal-nombre', form).value || '').trim();
        const correo = (safeQuery('#modal-correo', form) && safeQuery('#modal-correo', form).value || '').trim();
        const perfil = (safeQuery('#modal-perfil', form) && safeQuery('#modal-perfil', form).value || '').trim();

        if (!nombre || !correo || !perfil) {
          // simple validación; puedes sustituir por UI más amigable
          try { alert('Completa todos los campos obligatorios.'); } catch (e) {}
          return;
        }

        // Prevent duplicate submits: disable button
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.setAttribute('disabled', 'disabled');
          submitBtn.setAttribute('aria-disabled', 'true');
        }

        // Preparar payload
        const payload = {
          tipo: 'ebook',
          bannerId,
          nombre,
          correo,
          perfil,
          pago: !!info.pago
        };

        // Enviar a Apps Script (placeholder — REEMPLAZAR TU_URL)
        const endpoint = 'https://script.google.com/macros/s/TU_URL/exec';

        try {
          const resp = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          // Aceptar respuestas 2xx como ok. Si el endpoint devuelve JSON con status, respetarlo.
          let okResponse = false;
          try {
            const json = await resp.json();
            okResponse = (json && (json.status === 'OK' || resp.ok));
          } catch (e) {
            okResponse = resp.ok;
          }

          // Redirigir según tipo
          if (okResponse) {
            const targetUrl = info.pago ? normalizeUrl(info.pagoUrl) : normalizeUrl(info.gratisUrl);
            if (targetUrl) {
              // cerrar modal antes de redirigir
              if (instance && typeof instance.hide === 'function') instance.hide();
              else {
                modalEl.classList.remove('show');
                modalEl.style.display = 'none';
                document.body.classList.remove('modal-open');
                const bds = document.querySelectorAll('.modal-backdrop');
                bds.forEach(b => b.remove());
              }
              // navegación
              setTimeout(() => { window.location.href = targetUrl; }, 150);
            } else {
              try { alert('Registro completo. Gracias.'); } catch (e) {}
              if (instance && typeof instance.hide === 'function') instance.hide();
            }
          } else {
            try { alert('Error al procesar la solicitud. Intenta nuevamente.'); } catch (e) {}
          }
        } catch (err) {
          try { alert('Error de conexión. Intenta nuevamente.'); } catch (e) {}
          log('submit error', err);
        } finally {
          if (submitBtn) {
            submitBtn.removeAttribute('disabled');
            submitBtn.removeAttribute('aria-disabled');
          }
        }
      };

      // Add submit listener and save remover
      form.addEventListener('submit', onSubmit);
      bodyContainer._currentFormSubmitRemover = () => {
        try { form.removeEventListener('submit', onSubmit); } catch (e) {}
      };

      // show modal
      if (instance && typeof instance.show === 'function') {
        instance.show();
        // focus primer input al mostrar
        setTimeout(() => {
          const first = safeQuery('#modal-nombre', form);
          try { if (first && typeof first.focus === 'function') first.focus(); } catch (e) {}
        }, 80);
      } else {
        // fallback manual
        modalEl.classList.add('show');
        modalEl.style.display = 'block';
        document.body.classList.add('modal-open');
        if (!document.querySelector('.modal-backdrop')) {
          const bd = document.createElement('div');
          bd.className = 'modal-backdrop fade show';
          document.body.appendChild(bd);
        }
        const first = safeQuery('#modal-nombre', form);
        try { if (first && typeof first.focus === 'function') first.focus(); } catch (e) {}
      }
    } catch (e) {
      log('openEbookModal error', e);
    }
  }

  // Inicializar banners: inyectar y attach listeners (evitar doble bind)
  function initBanners() {
    try {
      Object.keys(PRODUCT_URLS).forEach(bannerId => {
        try {
          const slot = document.getElementById(bannerId);
          if (!slot) return;
          // evitar doble inyección
          if (slot.dataset && slot.dataset.inited === '1') return;

          const info = PRODUCT_URLS[bannerId];
          const bannerNode = buildBannerNode(bannerId, info);

          // click + keyboard activation (Enter/Space)
          bannerNode.addEventListener('click', (ev) => {
            ev.preventDefault();
            openEbookModal(bannerId);
          });

          bannerNode.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter' || ev.key === ' ') {
              ev.preventDefault();
              openEbookModal(bannerId);
            }
          });

          // append bannerNode into slot, clearing previous children (if any)
          while (slot.firstChild) slot.removeChild(slot.firstChild);
          slot.appendChild(bannerNode);

          // marcar como inicializado
          if (slot.dataset) slot.dataset.inited = '1';
        } catch (inner) { log('initBanners inner error', inner); }
      });
    } catch (e) {
      log('initBanners error', e);
    }
  }

  onReady(() => {
    initBanners();
    log('banner-modal-form initialized');
  });

  // export interno opcional para pruebas (no polutes global by default)
  // window.__bannerModalForm = { openEbookModal }; // habilitar solo si necesitas testing desde consola

})();