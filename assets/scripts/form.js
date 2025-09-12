// form.js
// ------------------------------------------------------------
// Propósito:
//  -Renderiza y valida el formulario de descarga/compra, controla botones según
//  producto seleccionado y realiza el POST al endpoint sin cambiar nombres públicos.
/*  Notas:
 * - IDs públicos usados por otras partes del proyecto:
 *   - formulario-descarga (contenedor)
 *   - descarga-form (form)
 *   - select-producto (select)
 *   - btn-free, btn-price (botones de envío)
 * - Variables globales esperadas (no definidas aquí): `productos`, `PRODUCT_URLS`.
 * 
// Autor: Macarena Baltra — Product & UX Designer
// Fecha: 12-09-2025
// ------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
  const formContainer = document.getElementById('formulario-descarga');
  if (!formContainer) return;

  // Construir opciones del select de forma segura (evita error si `productos` no está definido)
  const buildProductOptions = () => {
    if (typeof productos === 'undefined' || !Array.isArray(productos)) {
      /* `productos` debería venir del servidor / template. Si no existe,
         dejamos el select con la opción por defecto para no romper la UI. */
      return '';
    }

    // Escapar texto básico para evitar inyección accidental (títulos simples)
    const escapeHtml = (str) => String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    return productos
      .map((p) => {
        const id = escapeHtml(p.id ?? '');
        const titulo = escapeHtml(p.titulo ?? '');
        const gratis = Boolean(p.gratis) ? 'true' : 'false';
        return `<option value="${id}" data-gratis="${gratis}">${titulo}</option>`;
      })
      .join('');
  };

  // Render del formulario
  formContainer.innerHTML = `
    <form id="descarga-form" class="p-4 border rounded bg-light" role="form" aria-label="Formulario de descarga">
      <div class="container">
        <div class="row">
          <div class="col-6">
            <div class="mb-3">
              <label for="nombre" class="form-label">Nombre <span class="text-danger">*</span></label>
              <input type="text" class="form-control" id="nombre" required>
            </div>
            <div class="mb-3">
              <label for="correo" class="form-label">Correo electrónico <span class="text-danger">*</span></label>
              <input type="email" class="form-control" id="correo" required>
            </div>
            <div class="mb-3">
              <label for="perfil" class="form-label">Perfil de usuario <span class="text-danger">*</span></label>
              <select id="perfil" class="form-select" required>
                <option value="">Selecciona...</option>
                <option value="reclutador">Reclutador/a</option>
                <option value="cliente">Cliente</option>
                <option value="disenador">Diseñador/a</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>

          <div class="col-6">
            <div class="mb-3">
              <label for="apellido" class="form-label">Apellido <span class="text-danger">*</span></label>
              <input type="text" class="form-control" id="apellido" required>
            </div>
            <div class="mb-3">
              <label for="uso" class="form-label">¿Para qué lo usarás?</label>
              <select id="uso" class="form-select">
                <option value="">Selecciona...</option>
                <option value="negocio">Negocio/empresa</option>
                <option value="aprender">Aprender algo nuevo</option>
                <option value="reclutamiento">Proceso de reclutamiento</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="select-producto" class="form-label">Selecciona recurso <span class="text-danger">*</span></label>
              <select id="select-producto" class="form-select" required>
                <option value="">-- Elige un producto --</option>
                ${buildProductOptions()}
              </select>
            </div>
          </div>

          <div class="col">
            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-primary flex-fill" id="btn-free" style="display:none;">
                Descargar gratis
              </button>
              <button type="submit" class="btn btn-success flex-fill" id="btn-price" style="display:none;">
                Comprar
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  `;

  // Elementos del DOM importantes (ids públicos)
  const selectProd = document.getElementById('select-producto');
  const formEl = document.getElementById('descarga-form');

  // Seguridad adicional: si por alguna razón no existen, salir sin romper
  if (!selectProd || !formEl) {
    return;
  }

  const btnFree = document.getElementById('btn-free');
  const btnPrice = document.getElementById('btn-price');

  // Inicializar botones ocultos por defecto
  updateFormButtons(false);

  /**
   * Actualiza visibilidad de botones según si el producto es gratuito.
   * @param {boolean} isGratis
   */
  function updateFormButtons(isGratis) {
    if (btnFree) btnFree.style.display = isGratis ? 'block' : 'none';
    if (btnPrice) btnPrice.style.display = isGratis ? 'none' : 'block';
  }

  // Manejo del cambio en la selección de producto
  selectProd.addEventListener('change', () => {
    const opt = selectProd.selectedOptions && selectProd.selectedOptions[0];
    const gratis = opt && opt.getAttribute('data-gratis') === 'true';
    updateFormButtons(Boolean(gratis));
  });

  /**
   * Valida que los campos obligatorios estén completos.
   * @returns {boolean}
   */
  function isFormValid() {
    const nombre = document.getElementById('nombre')?.value.trim() || '';
    const apellido = document.getElementById('apellido')?.value.trim() || '';
    const correo = document.getElementById('correo')?.value.trim() || '';
    const perfil = document.getElementById('perfil')?.value || '';
    const producto = selectProd.value;

    return Boolean(nombre && apellido && correo && perfil && producto);
  }

  // Envío del formulario (reusa endpoint y PRODUCT_URLS tal como en el original)
  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      window.alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    const data = {
      nombre: document.getElementById('nombre').value.trim(),
      apellido: document.getElementById('apellido').value.trim(),
      correo: document.getElementById('correo').value.trim(),
      perfil: document.getElementById('perfil').value,
      uso: document.getElementById('uso').value,
      producto: selectProd.value,
      pago: selectProd.selectedOptions[0].getAttribute('data-gratis') === 'false'
    };

    const endpoint = 'https://script.google.com/'; // colocar link real cuando lo tengas

    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: 'descarga', ...data })
      });

      // Intentamos parsear JSON; si falla se entra a catch
      const json = await resp.json();

      if (json && json.status === 'OK') {
        /* PRODUCT_URLS debe estar definido globalmente y contener la estructura:
           PRODUCT_URLS[productoId] = { gratis: 'url', pago: 'url' } */
        if (typeof PRODUCT_URLS === 'undefined' || !PRODUCT_URLS[data.producto]) {
          window.alert('No se encontró la URL del producto. Contacta al soporte.');
          return;
        }

        const urls = PRODUCT_URLS[data.producto];
        const destino = data.pago ? urls.pago : urls.gratis;

        // Redirección final
        window.location.href = destino;
      } else {
        window.alert('Error al enviar datos.');
      }
    } catch (err) {
      window.alert('Fallo de conexión.');
    }
  });
});