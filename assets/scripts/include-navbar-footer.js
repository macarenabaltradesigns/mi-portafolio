// include-navbar-footer.js
// ------------------------------------------------------------
// Propósito:
//  - Inyecta el navbar y footer en los placeholders esperados y configura
//  la lógica de alternancia del toggler (iconos).
// Autor: Macarena Baltra — Product & UX Designer
// Fecha: 12-09-2025
// ------------------------------------------------------------


(function () {
  'use strict';

  window.addEventListener('DOMContentLoaded', () => {
    // HTML del menú a inyectar (no cambiar ids/clases públicos sin coordinar)
    const menuHTML = `
      <header class="sticky-top w-100 bg-canva" id="navbar-portfolio">
        <nav class="navbar navbar-expand-lg container-xxl bd-gutter bg-canva px-3">
          <!-- Marca siempre a la izquierda -->
          <a class="navbar-brand logo" aria-current="page" href="index.html" title="Ir a home">
            <img src="assets/img/Logo2-sinfondo.png" alt="" width="40"> macarenabaltradesigns
          </a>
          <!-- Contenedor que empuja todo lo demás a la derecha -->
          <div class="ms-auto d-flex align-items-center">
            <!-- Toggler -->
            <button class="navbar-toggler bg-whitesmoke" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <!-- Icono hamburguesa -->
              <i class="fas fa-bars toggler-open-icon"></i>
              <!-- Icono cerrar -->
              <i class="fas fa-times toggler-close-icon d-none"></i>
            </button>

            <!-- Collapse alineado a la derecha -->
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav mb-2 mb-lg-0 bg-canva">
                <li class="nav-item"><small><a class="nav-link text-white-50" href="index.html" title="Ir a home">Inicio</a></small></li>
                <li class="nav-item"><small><a class="nav-link text-white-50" href="landing-others-projects.html" title="Ver proyectos destacados">Portafolio</a></small></li>
                <li class="nav-item"><small><a class="nav-link text-white-50" href="aboutme.html" title="Conóceme más allá del Diseño">Sobre mí</a></small></li>
                <li class="nav-item"><small><a class="nav-link text-white-50" href="index.html#testimonials" title="Ver testimonios & referencias">Testimonios</a></small></li>
                <li class="nav-item"><small><a class="nav-link text-white-50" href="landing-blog.html" title="Ir a Blog">Blog</a></small></li>
                <li class="nav-item"><small><a class="nav-link text-white-50" href="index.html#contact" title="Ver datos de contacto">Contacto</a></small></li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    `;

    // HTML del footer a inyectar
    const footerHTML = `
      <div class="container p-3" id="footer-portfolio">
        <footer class="d-flex flex-wrap justify-content-between align-items-center py-4 my-5 border-top-footer">
          <div class="col-md-6 d-flex align-items-start align-items-center">
            <img src="assets/img/Logo2-sinfondo.png" alt="" width="40">
            <span class="mb-3 mb-md-0 text-white">© 2025 Macarena Baltra, Product & UX Designer. <small class="opacity-70"><em>Disponible para roles remotos y colaboraciones estratégicas.</em></small></span>
          </div>
          <ul class="nav col-md-6 justify-content-end list-unstyled d-flex">
            <li class="ms-3">
              <a class="mx-2 a-small-sl" href="https://www.instagram.com/macarenabaltradesigns/" target="_blank" aria-label="Instagram" title="Abrir perfil de Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
            </li>
            <li class="ms-3">
              <a class="mx-2 a-small-sl" href="https://www.behance.net/macarenabcc5b4" target="_blank" aria-label="Behance" title="Abrir perfil de Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
            </li>
            <li class="ms-3">
              <a class="mx-2 a-small-sl" href="https://www.linkedin.com/in/macarenabaltra/" target="_blank" aria-label="LinkedIn" title="Abrir perfil de LinkedIn" data-bs-toggle="tooltip"><i class="fab fa-linkedin-in"></i></a>
            </li>
          </ul>
        </footer>
      </div>
    `;

    // Busca el elemento con id "navbar-portfolio" e inyecta el menú
    const navContainer = document.getElementById('navbar-portfolio');
    if (navContainer) {
      navContainer.innerHTML = menuHTML;
    }

    // Busca el elemento con id "footer-portfolio" e inyecta el footer
    const footerContainer = document.getElementById('footer-portfolio');
    if (footerContainer) {
      footerContainer.innerHTML = footerHTML;
    }

    // Alternar icono de hamburguesa / cerrar cuando el collapse cambia
    const collapseEl = document.getElementById('navbarSupportedContent');
    const togglerBtn = document.querySelector('.navbar-toggler');

    if (collapseEl && togglerBtn) {
      const iconOpen = togglerBtn.querySelector('.toggler-open-icon');
      const iconClose = togglerBtn.querySelector('.toggler-close-icon');

      /**
       * Helper: muestra u oculta los iconos según el estado.
       * @param {boolean} isOpen
       */
      const setTogglerIcons = (isOpen) => {
        if (iconOpen) {
          iconOpen.classList.toggle('d-none', isOpen);
        }
        if (iconClose) {
          iconClose.classList.toggle('d-none', !isOpen);
        }
      };

      // Intentamos usar eventos de Bootstrap
      try {
        collapseEl.addEventListener('show.bs.collapse', () => setTogglerIcons(true));
        collapseEl.addEventListener('hide.bs.collapse', () => setTogglerIcons(false));
      } catch (err) {
        // En navegadores/entornos donde Bootstrap no expone estos eventos como tal,
        // la adición de listeners no funcionará — no romperemos la ejecución.
        // Fallback: escuchar clicks en el toggler y basarnos en aria-expanded o clase 'show'.
        /* REVIEW: si tu proyecto siempre usa Bootstrap, este catch rara vez se ejecutará. */
      }

      // Fallback robusto: escucha click y actualiza iconos según aria-expanded o clase 'show'
      togglerBtn.addEventListener('click', () => {
        const ariaExpanded = togglerBtn.getAttribute('aria-expanded');
        if (ariaExpanded !== null) {
          const willOpen = ariaExpanded === 'false' || ariaExpanded === '0';
          setTimeout(() => {
            const isOpen = collapseEl.classList.contains('show') || togglerBtn.getAttribute('aria-expanded') === 'true';
            setTogglerIcons(Boolean(isOpen));
          }, 10); // pequeño delay para sincronizar con Bootstrap
          setTogglerIcons(Boolean(willOpen));
          return;
        }

        // Si no hay aria-expanded, basar en clase 'show' con pequeño delay
        setTimeout(() => {
          const isOpen = collapseEl.classList.contains('show');
          setTogglerIcons(Boolean(isOpen));
        }, 10);
      });
    }

    // Optional: inicializar tooltips si Bootstrap está disponible
    // REVIEW: esto es seguro si usáis Bootstrap 5 y popper; si no, no hará nada.
    try {
      if (window.bootstrap && typeof window.bootstrap.Tooltip === 'function') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.forEach((el) => {
          // eslint-disable-next-line no-new
          new window.bootstrap.Tooltip(el);
        });
      }
    } catch (e) {
      // No romper si boostrap/poppers no están presentes
    }
  });
})();