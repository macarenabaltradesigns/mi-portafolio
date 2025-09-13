/** blog.js
// ------------------------------------------------------------
 * Propósito:
 *  - Inyectar de forma segura y accesible dos bloques de "Blog / Aprendizajes"
 *    en los contenedores con id "blog-news" y "blog-news2".
 * Autor: Macarena Baltra — Product & UX Designer
 * Fecha: 12-09-2025.
 ------------------------------------------------------------ */
 

(function () {
  'use strict';

  const DEBUG = false;
  const log = (...args) => { if (DEBUG) console.log('[blog.js]', ...args); };

  /**
   * Safe query helpers
   */
  function safeQuery(selector, ctx = document) {
    try { return ctx.querySelector(selector); } catch (e) { return null; }
  }
  function safeQueryAll(selector, ctx = document) {
    try { return Array.from((ctx || document).querySelectorAll(selector)); } catch (e) { return []; }
  }

  /**
   * Crea el bloque principal del blog (desktop hero + grid items + CTA)
   * @param {Object} opts - opciones: {heroTitle, heroSubtitle, heroLink, items: [{title, subtitle, href}], ctaText, ctaHref}
   * @returns {HTMLElement} section element
   */
  function buildBlogSection(opts = {}) {
    // contenedor <section class="container ...">
    const section = document.createElement('section');
    section.className = 'container pt-5 insights';
    section.setAttribute('role', 'region');
    section.setAttribute('aria-label', opts.ariaLabel || 'Blog — Aprendizajes');

    // header
    const headerWrap = document.createElement('div');
    headerWrap.className = 'pb-2 my-lg-4 my-md-4';

    const h2 = document.createElement('h2');
    h2.className = 'border-bottom';
    // construir HTML visual usando nodos (evitar innerHTML)
    const spanMuted = document.createElement('span');
    spanMuted.className = 'opacity-70';
    spanMuted.textContent = (opts.headerPrefix || 'Aprendizajes /');
    h2.appendChild(spanMuted);
    h2.appendChild(document.createTextNode(' ' + (opts.headerMain || 'Blog')));

    const pIntro = document.createElement('p');
    pIntro.className = 'fw-medium';
    pIntro.textContent = opts.headerDescription || 'Reflexiones breves sobre diseño, procesos y lo que aprendí trabajando con personas y marcas.';

    headerWrap.appendChild(h2);
    headerWrap.appendChild(pIntro);
    section.appendChild(headerWrap);

    // hero card
    if (opts.hero) {
      const heroOuter = document.createElement('div');
      const heroInner = document.createElement('div');
      heroInner.className = 'p-4 p-md-5 mb-4 rounded text-body-emphasis bg-body-secondary';

      const heroCol = document.createElement('div');
      heroCol.className = 'col-lg-8 px-0';

      const heroH2 = document.createElement('h2');
      heroH2.className = 'text-body-emphasis color-primary display-6 fst-italic fontmontserrat';
      heroH2.textContent = opts.hero.title || '';

      if (opts.hero.lead) {
        // añadir span de subtítulo estilizado si existe
        const spanSub = document.createElement('span');
        spanSub.className = 'opacity-70';
        spanSub.textContent = ' ' + opts.hero.lead;
        heroH2.appendChild(spanSub);
      }

      const heroP = document.createElement('p');
      heroP.className = 'description my-3 text-white text-opacity-75 fw-medium';
      heroP.textContent = opts.hero.description || '';

      const heroRead = document.createElement('p');
      heroRead.className = 'description mb-0';
      const heroA = document.createElement('a');
      heroA.href = opts.hero.href || '#';
      heroA.className = 'a-small text-body-emphasis';
      heroA.setAttribute('data-article-id', opts.hero.articleId || '');
      heroA.textContent = opts.hero.ctaText || 'Leer más →';
      heroRead.appendChild(heroA);

      heroCol.appendChild(heroH2);
      heroCol.appendChild(heroP);
      heroCol.appendChild(heroRead);
      heroInner.appendChild(heroCol);
      heroOuter.appendChild(heroInner);
      section.appendChild(heroOuter);
    }

    // grid rows
    if (Array.isArray(opts.items) && opts.items.length) {
      const row = document.createElement('div');
      row.className = 'row mb-2';

      opts.items.forEach((item) => {
        const col = document.createElement('div');
        col.className = 'col-md-6';

        const card = document.createElement('div');
        card.className = 'p-4 bg-body-secondary';

        const iconP = document.createElement('p');
        iconP.className = 'icon-square text-body-emphasis d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3';
        const iconI = document.createElement('i');
        iconI.className = item.iconClass || 'fa-regular fa-newspaper color-green opacity-60';
        iconP.appendChild(iconI);

        const content = document.createElement('div');

        const h3 = document.createElement('h3');
        h3.className = 'fs-5 text-body-emphasis color-primary';
        // append title and optional span
        h3.appendChild(document.createTextNode(item.title || ''));
        if (item.titleSpan) {
          const span = document.createElement('span');
          span.className = 'opacity-70';
          span.textContent = item.titleSpan;
          h3.appendChild(span);
        }

        const pDesc = document.createElement('p');
        pDesc.className = 'text-white-50 fw-medium';
        pDesc.textContent = item.description || '';

        const pMore = document.createElement('p');
        pMore.className = 'description mb-0 d-flex justify-content-end';
        const aMore = document.createElement('a');
        aMore.href = item.href || '#';
        aMore.className = 'a-small text-body-emphasis';
        aMore.setAttribute('data-article-id', item.articleId || '');
        aMore.textContent = item.ctaText || 'Leer más →';
        pMore.appendChild(aMore);

        content.appendChild(h3);
        content.appendChild(pDesc);
        content.appendChild(pMore);

        card.appendChild(iconP);
        card.appendChild(content);

        col.appendChild(card);
        row.appendChild(col);
      });

      section.appendChild(row);
    }

    // CTA group
    const ctaWrap = document.createElement('div');
    ctaWrap.className = 'cta-group-center';
    const ctaA = document.createElement('a');
    ctaA.href = opts.ctaHref || 'landing-blog.html';
    ctaA.className = 'btn btn-secondary my-2';
    ctaA.title = opts.ctaTitle || 'Ver artículos del Blog';
    ctaA.textContent = opts.ctaText || 'Ver artículos del Blog →';
    ctaWrap.appendChild(ctaA);
    section.appendChild(ctaWrap);

    return section;
  }

  /**
   * Inyecta contenido en el container dado si no fue inyectado ya.
   * @param {string} containerId
   * @param {HTMLElement} node
   */
  function injectOnce(containerId, node) {
    const container = safeQuery('#' + containerId);
    if (!container) {
      if (DEBUG) log('[blog] contenedor no encontrado:', containerId);
      return;
    }
    if (container.dataset && container.dataset.inited === '1') {
      if (DEBUG) log('[blog] ya inyectado:', containerId);
      return;
    }
    // limpiar nodos previos (si los hay) antes de inyectar
    while (container.firstChild) container.removeChild(container.firstChild);
    container.appendChild(node);
    if (container.dataset) container.dataset.inited = '1';
  }

  // Inicialización principal
  function initBlogSections() {
    // configuración del primer bloque
    const blog1 = buildBlogSection({
      ariaLabel: 'Blog Aprendizajes 1',
      headerPrefix: 'Aprendizajes /',
      headerMain: 'Blog',
      headerDescription: 'Reflexiones breves sobre diseño, procesos y lo que aprendí trabajando con personas y marcas.',
      hero: {
        title: 'Laboratorio de Formas:',
        lead: 'experimentación creativa aplicada al diseño',
        description: 'Cómo un laboratorio de experimentos materiales genera texturas, componentes y narrativas que enriquecen UX, UI y branding.',
        href: 'landing-blog-article.html?article=4',
        articleId: 'article-4',
        ctaText: 'Leer más →'
      },
      items: [
        {
          iconClass: 'fa-regular fa-newspaper color-green opacity-60',
          title: 'Investigación UX:',
          titleSpan: ' mapas, A/B testing y shadowing',
          description: 'Convierte observación en decisiones: mapas, A/B tests y shadowing que reducen tiempos, aumentan clics y elevan reservas con mejoras medibles.',
          href: 'landing-blog-article.html?article=6',
          articleId: 'article-6',
          ctaText: 'Leer más →'
        },
        {
          iconClass: 'fa-regular fa-newspaper color-secondary opacity-60',
          title: 'El corazón, un órgano diferenciador',
          titleSpan: '— proyecto de título',
          description: 'Convertí latidos en imagen y sonido: una instalación que traduce la frecuencia cardiaca en una mándala única por visitante, uniendo ciencia, sonido y diseño.',
          href: 'landing-blog-article.html?article=3',
          articleId: 'article-3',
          ctaText: 'Leer más →'
        }
      ],
      ctaText: 'Ver artículos del Blog →',
      ctaHref: 'landing-blog.html',
      ctaTitle: 'Ver artículos del Blog'
    });

    const blog2 = buildBlogSection({
      ariaLabel: 'Blog Aprendizajes 2',
      headerPrefix: 'Aprendizajes /',
      headerMain: 'Blog',
      headerDescription: 'Reflexiones breves sobre diseño, procesos y lo que aprendí trabajando con personas y marcas.',
      hero: {
        title: 'ROI en UX:',
        lead: 'cómo medir y demostrar impacto (conversiones, ahorro y retención)',
        description: 'Mide UX y transforma cada mejora en ingresos: aprende a calcular ROI, reducir consultas y aumentar conversiones con pruebas simples y medibles.',
        href: 'landing-blog-article.html?article=8',
        articleId: 'article-8',
        ctaText: 'Leer más →'
      },
      items: [
        {
          iconClass: 'fa-regular fa-newspaper color-green opacity-60',
          title: 'Brand Kit Eficiente:',
          titleSpan: ' Ahorra Tiempo y Consigue Coherencia Visual',
          description: 'Diseña un Brand System + UI Kit mínimos y aplicables desde el primer día: menos errores, lanzamientos más rápidos y un equipo que dedica energía a crear valor, no a buscar archivos.',
          href: 'landing-blog-article.html?article=10',
          articleId: 'article-10',
          ctaText: 'Leer más →'
        },
        {
          iconClass: 'fa-regular fa-newspaper color-secondary opacity-60',
          title: 'Integrando IA',
          titleSpan: ' en tu Proceso de Diseño',
          description: 'La IA no reemplaza al diseñador; libera horas repetitivas para que tú diseñes, prototipes y produzcas contenido con intención.',
          href: 'landing-blog-article.html?article=12',
          articleId: 'article-12',
          ctaText: 'Leer más →'
        }
      ],
      ctaText: 'Ver artículos del Blog →',
      ctaHref: 'landing-blog.html',
      ctaTitle: 'Ver artículos del Blog'
    });

    // Inyectar en los containers concretos (si existen)
    injectOnce('blog-news', blog1);
    injectOnce('blog-news2', blog2);
  }

  // Ejecutar al ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlogSections);
  } else {
    setTimeout(initBlogSections, 0);
  }

  // Exports para debugging (deshabilitado por defecto)
  // window.__blogModule = { buildBlogSection, initBlogSections }; /* REVIEW: habilitar para debugging si se necesita */

})();