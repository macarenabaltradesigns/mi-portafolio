/** feedback.js
// ------------------------------------------------------------
 * Propósito:
 *  - Construir y manejar el widget de feedback para artículos:
 *    valoración (like/dislike) + comentario + envío a endpoint remoto (Google Apps Script).
 *  - Implementación defensiva: evita duplicar la inyección, comprueba existencia de nodos,
 *    y añade accesibilidad básica (aria-labels, aria-live).
 *
 * // Autor: Macarena Baltra — Product & UX Designer
 * // Fecha: 12-09-2025.
 // ------------------------------------------------------------ */

(function () {
  'use strict';

  /**
   * Endpoint público (NO cambiar nombre ni valor salvo si el backend lo requiere).
   * Se mantiene exactamente como en tu proyecto.
   */
  const endpoint = 'https://script.google.com/'; // cuando tengas el link real, tienes que ponerlo acá 

  /**
   * Helper: safe query
   * @param {string} sel
   * @param {ParentNode} ctx
   * @returns {Element|null}
   */
  function safeQuery(sel, ctx = document) {
    try { return ctx.querySelector(sel); } catch (e) { return null; }
  }

  /**
   * Inicializa el bloque de feedback (se invoca en DOMContentLoaded).
   * Evita doble inyección mediante dataset.inited.
   */
  function initFeedback() {
    const container = document.getElementById('feedback-article');
    if (!container) return;
    if (container.dataset && container.dataset.inited === '1') return;
    if (container.dataset) container.dataset.inited = '1';

    // Construcción del UI usando createElement para evitar innerHTML
    const wrapper = document.createElement('div');
    wrapper.className = 'text-center my-5';

    const q = document.createElement('p');
    q.textContent = '¿Te fue útil este artículo?';
    wrapper.appendChild(q);

    // Botones like / dislike (con aria-labels)
    const btnLike = document.createElement('button');
    btnLike.id = 'likeBtn';
    btnLike.type = 'button';
    btnLike.className = 'btn btn-outline-success me-2';
    btnLike.setAttribute('aria-pressed', 'false');
    btnLike.setAttribute('aria-label', 'Me gusta');
    btnLike.textContent = '👍';

    const btnDislike = document.createElement('button');
    btnDislike.id = 'dislikeBtn';
    btnDislike.type = 'button';
    btnDislike.className = 'btn btn-outline-danger';
    btnDislike.setAttribute('aria-pressed', 'false');
    btnDislike.setAttribute('aria-label', 'No me gusta');
    btnDislike.textContent = '👎';

    const btnRow = document.createElement('div');
    btnRow.className = 'my-2';
    btnRow.appendChild(btnLike);
    btnRow.appendChild(btnDislike);
    wrapper.appendChild(btnRow);

    // Textarea y botón enviar
    const formWrap = document.createElement('div');
    formWrap.className = 'my-4';

    const textarea = document.createElement('textarea');
    textarea.id = 'comentario';
    textarea.rows = 2;
    textarea.className = 'form-control';
    textarea.placeholder = '¿Qué te gustaría comentar?';
    textarea.style.height = '100px';
    textarea.setAttribute('aria-label', 'Comentario sobre el artículo');

    const sendBtn = document.createElement('button');
    sendBtn.id = 'enviarFeedback';
    sendBtn.type = 'button';
    sendBtn.className = 'btn btn-secondary mt-4';
    sendBtn.textContent = 'Enviar';
    sendBtn.setAttribute('aria-label', 'Enviar feedback');

    formWrap.appendChild(textarea);
    formWrap.appendChild(sendBtn);
    wrapper.appendChild(formWrap);

    // Region para mensajes no intrusivos (aria-live)
    const live = document.createElement('div');
    live.id = 'feedback-live';
    live.setAttribute('role', 'status');
    live.setAttribute('aria-live', 'polite');
    live.className = 'visually-hidden';
    wrapper.appendChild(live);

    // Adjuntar todo al container
    container.appendChild(wrapper);

    // Estado interno
    let valoracion = '';

    // Helpers UI
    function setStatus(msg, visible = true) {
      try {
        live.textContent = msg || '';
        live.className = visible ? 'd-block' : 'visually-hidden';
      } catch (e) { /* ignore */ }
    }

    function markActive(button, active) {
      try {
        if (active) button.classList.add('active');
        else button.classList.remove('active');
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
      } catch (e) {}
    }

    // Eventos like / dislike (prevent duplicates, toggling)
    btnLike.addEventListener('click', () => {
      if (valoracion === 'like') {
        valoracion = '';
        markActive(btnLike, false);
        setStatus('Valoración eliminada.');
        return;
      }
      valoracion = 'like';
      markActive(btnLike, true);
      markActive(btnDislike, false);
      setStatus('Gracias por tu valoración positiva.');
      // Mantengo el alert original para compatibilidad UX
      alert('Gracias por tu valoración positiva.');
    });

    btnDislike.addEventListener('click', () => {
      if (valoracion === 'dislike') {
        valoracion = '';
        markActive(btnDislike, false);
        setStatus('Valoración eliminada.');
        return;
      }
      valoracion = 'dislike';
      markActive(btnDislike, true);
      markActive(btnLike, false);
      setStatus('Gracias por tu opinión. Vamos a mejorar.');
      alert('Gracias por tu opinión. Vamos a mejorar.');
    });

    // Envío de feedback
    sendBtn.addEventListener('click', async () => {
      const comentario = (textarea.value || '').trim();

      if (!valoracion && !comentario) {
        alert('Por favor, deja al menos una valoración o comentario.');
        setStatus('Por favor, deja al menos una valoración o comentario.');
        return;
      }

      // Desactivar botón mientras se envía
      sendBtn.setAttribute('disabled', 'disabled');
      setStatus('Enviando...');

      try {
        // Nota: se respeta el endpoint tal como está definido arriba.
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tipo: 'feedback-article', valoracion, comentario })
        });

        // Intentar parsear JSON sólo si response.ok
        let json = null;
        try {
          json = await resp.json();
        } catch (parseErr) {
          // Si no es JSON, construir objeto fallback
          json = { status: resp.ok ? 'OK' : 'ERROR' };
        }

        if (json && json.status === 'OK') {
          alert('¡Gracias por tu feedback!');
          setStatus('¡Gracias por tu feedback!');
          textarea.value = '';
          valoracion = '';
          markActive(btnLike, false);
          markActive(btnDislike, false);
        } else {
          alert('Error al enviar feedback.');
          setStatus('Error al enviar feedback.');
        }
      } catch (err) {
        // Log en consola (no necesario para usuarios) y mensaje amigable
        console.error('[feedback] send error', err);
        alert('Error en la conexión.');
        setStatus('Error en la conexión.');
      } finally {
        sendBtn.removeAttribute('disabled');
      }
    });
  } // end initFeedback

  // Ejecutar cuando DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFeedback);
  } else {
    // ya listo
    setTimeout(initFeedback, 0);
  }

})();