/** content-articles.js 
// ------------------------------------------------------------
 * Propósito:
 *  - Inyectar contenidos de articulos del blog.
 *  - Render del artículo actual: título, fecha, contenido, author box, tags, related lists.
 *  - Inyección segura de meta tags, JSON-LD y banner hero con fallback.
 *  - Integración opcional con ImageHelper y responsiveLazyImages.
 * Autor: Macarena Baltra — Product & UX Designer
 * Fecha: 12-09-2025.
 // ------------------------------------------------------------ */

(function () {
  'use strict';

    /* ===================== Utilities (seguras) ===================== */

  /**
   * safeQuery - selector seguro
   * @param {string} sel
   * @param {ParentNode} ctx
   * @returns {Element|null}
   */
  const safeQuery = (sel, ctx = document) => {
    try { return ctx.querySelector(sel); } catch (e) { return null; }
  };

  /**
   * safeQueryAll - safe querySelectorAll -> Array
   * @param {string} sel
   * @param {ParentNode} ctx
   * @returns {Array<Element>}
   */
  const safeQueryAll = (sel, ctx = document) => {
    try { return Array.from((ctx || document).querySelectorAll(sel)); } catch (e) { return []; }
  };

  const safeText = (s) => (s === undefined || s === null) ? '' : String(s);
  const stripHtml = (html) => safeText(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const truncate = (s, n) => { s = safeText(s); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
  const isIsoDate = (s) => { if (!s) return false; const d = new Date(s); return !isNaN(d.getTime()); };
  const toIsoIfPossible = (s) => { if (!s) return undefined; const d = new Date(s); return isNaN(d.getTime()) ? undefined : d.toISOString(); };
  const escapeAttr = (s) => safeText(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

  const createSafeLink = (href, text, external) => {
    const a = document.createElement('a');
    a.href = href || '#';
    a.textContent = safeText(text) || href;
    if (external) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    return a;
  };

  /* ===================== Articles data (placeholder) ===================== */

  const articles = {
    "1": {
      id: 1,
      titleHTML: `
        Diseño que Evoluciona: 
        <span class="opacity-70">Mantén tu Marca y Front-end al Día</span>
      `,
      date: "18 de julio, 2025",
      imagenDesktop: "assets/img/hero-article/Articulo1/img-article-1-3840@2x.webp",
      imagenMobile: "assets/img/hero-article/Articulo1/img-article-1-750@2x.webp",
      ogImage: "mi-portafolio/assets/img/og-images/og-article-1@2x.webp",
      aboutHTML: `
      <span class="opacity-70">
        Soy Macarena, <strong>Product & UX Designer.</strong>
        He entregado más de 40 proyectos front-end listos para producción y creo en la mezcla de diseño, código y documentación como forma de proteger la inversión de una marca.
        Cuando no diseño, me encontrarás probando nuevas paletas con un Matcha Latte en mano.
        </span>
      `,
      imageUrl: "assets/img/coveraboutme/avatar-1-400@2x.webp",
      imageAlt: "Imagen de mí",
      content: `
        <p><strong>No actualizar a tiempo no es inofensivo: es abrir la puerta a errores y a que otros tomen la delantera.</strong> Actualiza a tiempo y tu producto —y tu reputación— lo agradecerán.</p>
        <p>Recuerdo la primera vez que abrí el código de un cliente y vi etiquetas <strong><code class="fs-6">&lt;table&gt;</code></strong> usadas para maquetar todo el sitio. Fue mezcla de asombro y urgencia: “¿cómo pretende seguir liderando así?” Ese momento dejó algo claro: posponer iteraciones técnicas o actualizaciones visuales no es neutro. Afecta la visibilidad, la experiencia móvil y la confianza que clientes y socios depositan en tu marca. Aquí comparto pasos prácticos, mini-casos y una hoja de ruta para modernizar con seguridad y foco en resultados.</p>
        <p class="text-center fs-6 my-4 bg-canva p-3">“El diseño no es solo cómo se ve y cómo se siente. El diseño es cómo funciona.” — <em>Steve Jobs</em></p>
        <hr>
        <h2 class="mt-5 fontpoppins opacity-100">Problema</h2>
        <p>Hoy los buscadores y los usuarios exigen velocidad, accesibilidad y buen comportamiento en móviles.</p>
        <p>Cuando una web y su identidad se quedan atrás, ocurren consecuencias claras:</p>
        <ul>
          <li>Más abandonos y menos conversiones.</li>
          <li>Penalizaciones en posicionamiento orgánico por malas prácticas técnicas.</li>
          <li>Percepción de marca debilitada frente a clientes, socios y reclutadores.</li>
        </ul>
        <p>La respuesta es cambiar la mentalidad: pasar de “funciona por ahora” a una cultura de revisión y mejora continua que combine auditorías técnicas, actualizaciones visuales y componentes reutilizables.</p>
        <hr>
        <h4 class="mb-3">Mini-casos</h4>
        <ul>
          <li>
            <strong><em><a href="landing-projects-d-CBC.html" class="a-small-article-green px-1" target="_blank" rel="noopener noreferrer" title="Ver más sobre este Proyecto" data-bs-toggle="tooltip">De los 90s a la era responsive — CBC (2020)</a>:</em></strong>
            <p><strong>Reto:</strong> sitio pensado para escritorio, mala experiencia móvil y altas tasas de abandono en secciones clave.</p>
            <p><strong>Acción:</strong> análisis de analytics y mapas de calor; priorización de funnels críticos; prototipos mobile-first en HTML5/CSS3; pruebas rápidas con usuarios.</p>
            <p><strong>Resultado:</strong> migración a etiquetas semánticas, reorganización de contenidos y optimización de recursos. Navegación móvil más fluida y caída importante en la tasa de abandono.</p>
            <p><strong>Aprendizaje:</strong> mejora primero los flujos que impactan al negocio (onboarding, formularios) para obtener resultados rápidos y justificar inversión.</p>
          </li>
          <li>
            <strong><em><a href="https://www.instagram.com/p/DLsRJJ7stBt/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" class="a-small-article px-1" target="_blank" rel="noopener noreferrer" title="Ver más sobre este Proyecto" data-bs-toggle="tooltip">Actualizaciones Front-End — Plataforma CBC</a>:</em></strong>
            <p><strong>Reto:</strong> pantallas sobrecargadas, flujos confusos y errores en procesos internos.</p>
            <p><strong>Acción:</strong> mapeo con stakeholders; prototipado iterativo (baja → alta fidelidad); pruebas con usuarios internos; desarrollo de una librería de componentes en HTML/CSS alineada al Brand System.</p>
            <p><strong>Resultado:</strong> formularios reestructurados, componentes reutilizables y procesos internos más ágiles.</p>
            <p><strong>Aprendizaje:</strong> documentar componentes (Storybook) acelera la colaboración entre diseño y desarrollo.</p>
          </li>
          <li>
            <strong><em><a href="https://www.behance.net/gallery/229753651/Rebranding-de-Full-Graphic-Impresores-%282014%29" class="a-small-article-green px-1" target="_blank" rel="noopener noreferrer" title="Ver más sobre este Proyecto" data-bs-toggle="tooltip">Rebranding — Full Graphic Impresores</a>:</em></strong>
            <p><strong>Reto:</strong> identidad entregada solo en JPG; sin archivos fuente ni paleta digital.</p>
            <p><strong>Acción:</strong> vectorización de logo (.ai/.svg); mapeo Pantone/CMYK → HEX/RGB; reglas de uso y versiones.</p>
            <p><strong>Resultado:</strong> coherencia visual en canales digitales e impresos, mejor legibilidad en pantallas pequeñas y piezas comerciales más efectivas.</p>
            <p><strong>Aprendizaje:</strong> entregar master files y reglas claras evita errores repetidos y acelera producción.</p>
          </li>
        </ul>
        <hr class="my-5">
        <h2 class="mt-5 fontpoppins opacity-100">Propuesta práctica: evita el “efecto dinosaurio” digital</h2>
        <p>Integra estas tres prácticas en tu ciclo de producto para mantener marca y front-end alineados:</p>
        <ol>
          <li><strong><em>Auditorías semestrales (front-end + UX/UI)</em></strong>
            <p><em>Qué:</em> revisiones programadas de código, rendimiento, accesibilidad y flujos.</p>
            <p><em>Por qué:</em> evitas que la deuda técnica crezca y mantienes SEO y conversiones.</p>
            <p><em>Cómo (práctico):</em> combina escaneos automáticos con revisiones manuales en dispositivos reales. Herramientas útiles: Stylelint, validadores W3C, Lighthouse.</p>
          </li>
          <div class="my-5"></div>
          <li><strong><em>Revisiones periódicas de identidad visual</em></strong>
            <p><em>Qué:</em> evaluación de logo, paleta, tipografías y tono.</p>
            <p><em>Por qué:</em> una identidad coherente genera confianza; la inconsistencia confunde.</p>
            <p><em>Cómo:</em> normaliza archivos fuente (.ai/.svg), mapea Pantone → HEX/RGB y documenta reglas en un Brand System. Considera tipografías variables para optimizar rendimiento.</p>
          </li>
          <div class="my-5"></div>
          <li><strong><em>Componentes y estilos reutilizables</em></strong>
            <p><em>Qué:</em> librería sistematizada (botones, inputs, cards) y variables (Sass/CSS tokens).</p>
            <p><em>Por qué:</em> acelera desarrollo, asegura coherencia y facilita pruebas.</p>
            <p><em>Cómo:</em> adoptar un stack y documentarlo (React/Vue o librerías equivalentes + Sass modular + Storybook).</p>
          </li>
        </ol>

        <!-- Banner E-Book Memoria Emocional --> 
        <div id="banner-ebook-price-memoriaemocional" class="d-none"></div>
        <!-- CTA alternativo para usuarios -->

        <hr class="my-5">
        <div class="bg-canva p-5">
            <h4 class="text-center fontpoppins-semibold pb-4 opacity-100">FAQ´s</h4>
            <p><strong>¿Cuánto tiempo necesito para ver mejoras tangibles después de una auditoría?</strong></p>
            <p>Quick wins muestran efecto en 2–8 semanas; reestructuras o migraciones suelen requerir 2–6 meses; proyectos mayores entre 3–12 meses. Mide siempre desde la línea base (tasa de rebote, conversiones) y reporta avances por sprint.</p>
            <hr>
            <p><strong>¿Puedo modernizar sin perder la memoria visual?</strong></p>
            <p>Sí. Modernizar no significa borrar: documenta la identidad (Brand System) y crea componentes que respeten la memoria emocional, mientras mejoras accesibilidad, rendimiento y usabilidad.</p>
            <hr>
            <p><strong>¿Qué documentación entregar para facilitar el trabajo interno?</strong></p>
            <p>Master files (.ai/.svg), tokens y variables CSS/Sass, ejemplos de uso y un repositorio de componentes (Storybook o carpeta con snippets y guías).</p>
        </div>
        <hr class="my-5">
        <h2 class="mt-5 fontpoppins opacity-100">Mis 3 Aprendizajes Clave</h2>
        <ol>
          <li><strong><em>Revisa tu proyecto cada seis meses</em></strong> para evitar deuda técnica acumulada.</li>
          <li><strong><em>Mejora progresivamente:</em></strong> moderniza sin borrar la memoria emocional de la marca.</li>
          <li><strong><em>Documenta:</em></strong> una librería de componentes y un Brand System te permiten iterar con coherencia y menos errores.</li>
        </ol>
        <hr class="my-5">
        <p>Quedarse esperando que “siga funcionando” es una trampa: la tecnología y las expectativas cambian. Mantener tu front-end y tu marca actualizados es esencial para proteger la visibilidad, la experiencia y la reputación. Actualizar no significa empezar de cero; significa priorizar lo que aporta valor hoy y construir capacidad para seguir mejorando mañana.</p>
      `,
      // ← Aquí las relaciones
      relatedArticles: [
        { id: "11", title: "Iteraciones Rápidas: Prototipado que Minimiza Riesgos" },
        { id: "6", title: "Investigación UX que Transforma Productos" },
        { id: "12", title: "Integrando IA en tu Proceso de Diseño" }
      ],
      relatedProjects: [
        {
          title: "Prototipado y UI Design para Austral Group",
          url: "landing-projects-d-australGroup.html"
        },
        {
          title: "Actualizaciones Front-End de Plataforma CBC",
          url: "https://www.instagram.com/p/DLsRJJ7stBt/?utm_source=ig_web_copy_link"
        },
        {
          title: "Prototipado & Mantenimiento Front-End de la Web CBC",
          url: "https://www.behance.net/gallery/229631545/Prototipado-Mantenimiento-Front-End-de-la-Web-CBC"
        }
      ]
    },
    // 
    "2": {
      id: 2,
      titleHTML: `
        Coherencia Visual: 
        <span class="opacity-70">estandariza tus Documentos</span>
      `,
      date: "25 de julio, 2025",
      imagenDesktop: "assets/img/hero-article/Articulo2/img-article-2-3840@2x.webp",
      imagenMobile: "assets/img/hero-article/Articulo2/img-article-2-750@2x.webp",
      ogImage: "mi-portafolio/assets/img/og-images/og-article-2@2x.webp",
      aboutHTML: `
        <span class="opacity-70">
          Soy Macarena, <strong>Product & UX Designer.</strong>
          He estandarizado documentos y sistemas de marca en organizaciones de distintos tamaños.
          Cuando no diseño, pruebo paletas con mi jugo de zanahoria favorito en mano.
        </span>
      `,
      imageUrl: "assets/img/coveraboutme/avatar-2-400@2x.webp",
      imageAlt: "Imagen de mí",
      content: `
        <p>Recibir folletos con tipografías y colores distintos no es solo un problema estético: confunde al cliente y desgasta la credibilidad. Un logo atractivo no basta. La coherencia en cada pieza —impresa o digital— sostiene la reputación de una organización. Aquí verás un plan práctico, casos reales y pasos accionables para que tus documentos sean claros, consistentes y fáciles de usar por todo el equipo.</p>
        <hr>
        <p class="text-center fs-6 my-4 bg-canva p-3">“Un buen diseño es el mínimo diseño posible.” — <em>Dieter Rams</em></p>
        <h2 class="mt-5 fontpoppins opacity-100">Problema</h2>
        <p>En muchas organizaciones los documentos nacen en manos diferentes sin una guía clara. El resultado típico:</p>
        <ul>
          <li><strong><em>Percepción dispersa:</em></strong> el público no reconoce un mismo lenguaje visual.</li>
          <li><strong><em>Versiones antiguas circulando:</em></strong> logos en JPG y paletas desalineadas.</li>
          <li><strong><em>Pérdida de tiempo:</em></strong> correcciones manuales y cuellos de botella a la hora de aprobar materiales.</li>
        </ul>
        <p>La solución no es un manual infinito: es un sistema usable —breve, visual y con plantillas que el equipo realmente use.</p>
        <hr class="my-5">
        <h4 class="mb-3">Casos prácticos — qué hicimos y por qué funcionó</h4>
        <ul>
          <li>
            <p><strong><em><a href="https://www.instagram.com/p/DLirllmSpai/?utm_source=ig_web_copy_link" class="a-small-article px-1" target="_blank" title="Ver más sobre este Proyecto" data-bs-toggle="tooltip">CBC — Manual de Documentos (2020)</a>:</em></strong></p>
            <p><strong>Reto:</strong> materiales inconsistentes y múltiples correcciones.</p>
            <p><strong>Acción:</strong> manual práctico + plantillas para presentaciones y reportes.</p>
            <p><strong>Resultado:</strong> entregables más alineados entre áreas y reducción de revisiones.</p>
          </li>
          <li>
            <p><strong><em><a href="https://www.instagram.com/p/DLnbeYNSgf6/?utm_source=ig_web_copy_link" class="a-small-article-green px-1" target="_blank" title="Ver más sobre este Proyecto" data-bs-toggle="tooltip">Casona Minka — Manual OPL (2019)</a>:</em></strong></p>
            <p><strong>Reto:</strong> caos operativo por falta de reglas claras.</p>
            <p><strong>Acción:</strong> manual operativo y talleres cortos.</p>
            <p><strong>Resultado:</strong> procesos más fluidos, onboarding más claro y experiencia coherente para huéspedes.</p>        
          </li>
          <li>
            <p><strong><em><a href="landing-projects-d-fol.html" class="a-small-article-green px-1" target="_blank" title="Ver más sobre este Proyecto" data-bs-toggle="tooltip">FOL — Brand System</a>:</em></strong></p>
            <p><strong>Reto:</strong> uso inconsistente de colores, tipografías e iconos.</p>
            <p><strong>Acción:</strong> guía con paleta (HEX/RGB), tipografías y reglas de uso.</p>
            <p><strong>Resultado:</strong> menos dudas entre equipos y lanzamientos más ágiles.</p>       
          </li>
        </ul>
        <p class="text-center fs-6 my-4 bg-canva p-3">En todos los casos la clave fue: <strong>documento breve + práctica inmediata + activos listos para usar</strong>.</p>
        <hr>
        <h4 class="mt-5 fontpoppins opacity-100">Propuesta práctica: Manual + talleres + plantillas (paso a paso)</h4>
        <h4 class="mb-3">1. Style Guide básico (8–12 páginas)</h4>
        <ul>
          <li>Paleta con valores (HEX/RGB/CMYK) y ejemplos de uso.</li>
          <li>Tipografías: jerarquía y tamaños.</li>
          <li>Logos: versiones, espacio mínimo y usos permitidos.</li>
          <li>Uso correcto vs. incorrecto (2–3 comparaciones rápidas).</li>
          <li>Plantillas maestras prioritarias (presentación, reporte, factura).</li>
        </ul>
        <hr>
        <p><strong><em>Tip:</em></strong> si se entiende en 30 s, se usará.</p>
        <hr>
        <h4 class="mb-3">2. Taller express de 30 minutos</h4>
        <ol>
          <li>10 min: por qué importa (impacto en percepción y tiempo).</li>
          <li>15 min: ejercicio práctico aplicando la guía a una pieza real.</li>
          <li>5 min: dudas y responsable.</li>
        </ol>
        <hr>
        <p><strong><em>Tip:</em></strong> si el equipo es remoto, usa Miro/Zoom + plantillas compartidas para practicar en vivo.</p>
        <hr>
        <h4 class="mb-3">3. Plantillas editables que funcionen</h4>
        <p>Por tipo de equipo:</p>
        <ul>
          <li>No diseñadores → Canva Pro (bloquea elementos críticos).</li>
          <li>Documentos complejos → InDesign (paquete con fuentes).</li>
          <li>Diseño digital colaborativo → Figma (librerías y componentes).</li>
          <li>Entregables: master files (.ai, .svg, .fig) + versiones “para editar” (.pptx, .canva).</li>
        </ul>
        <hr>
  
        <!-- Banner E-Book Branding --> 
        <div id="banner-ebook-free-branding" class="d-none"></div>
        <!-- Banner E-Book Branding -->

        <h4>Buenas prácticas rápidas</h4>
        <ul>
          <li>Nombres claros y versión en archivos: logo_v2_2025.svg.</li>
          <li>Control de acceso: carpeta en la nube con permisos para editar solo las master templates.</li>
          <li>Onboarding visual: incluye el Style Guide en la inducción de nuevos empleados.</li>
          <li>Automatiza lo repetitivo: usa campos rellenables y plantillas para evitar recrear piezas.</li>
        </ul>
        <hr>
        <h4>Herramientas: mini-guía según contexto</h4>
        <ul>
          <li><strong>Canva:</strong> velocidad y autonomía para equipos no diseñadores. Entregar master files y guías de uso.</li>
          <li><strong>Figma:</strong> colaboración, librerías y hand-off a front-end.</li>
          <li><strong>Illustrator:</strong> precisión vectorial para logos e iconos.</li>
          <li><strong>InDesign:</strong> maquetación multipágina para impresos profesionales.</li>
        </ul>
        <p><strong>Regla de oro:</strong> la herramienta no define la calidad; el criterio y los master files sí.</p>
        <hr class="my-5">
        <div class="bg-canva p-5">
            <h4 class="text-center fontpoppins-semibold pb-4 opacity-100">FAQ´s</h4>
            <p><strong>¿Un manual corto es suficiente?</strong></p>
            <p>Sí —si es práctico, visual y va acompañado de plantillas.</p>
            <hr>
            <p><strong>¿Cómo demuestro el ROI a la dirección?</strong></p>
            <p>Muestra errores reales (logo viejo, color erróneo), calcula horas gastadas en correcciones y proyecta la reducción tras aplicar el sistema.</p>
            <hr>
            <p><strong>¿Qué plantilla priorizar?</strong></p>
            <p>La presentación corporativa: cambia percepción externa y se usa más.</p>
            <hr>
            <p><strong>¿Es profesional usar Canva?</strong></p>
            <p>Sí. Canva es una herramienta profesional válida cuando se usa con criterio. La profesionalidad se demuestra en la calidad de la solución, el pensamiento detrás del diseño y la capacidad de elegir la plataforma que mejor sirva al contexto del cliente. Usa Canva para velocidad y autonomía de equipos no diseñadores; conserva y entrega master files (Figma/AI/INDD) cuando el proyecto requiere control tipográfico, producción o escalabilidad.</p>
            <hr>
            <p><strong>¿Cada cuánto revisar la guía?</strong></p>
            <p>Revisión ligera anual; ajustes menores según campañas o cambios de identidad.</p>
        </div>
        <hr class="my-5">
        <p>La coherencia visual no es solo estética: es una práctica diaria que transmite profesionalismo. Un manual claro, talleres aplicados y plantillas bien pensadas convierten la identidad en una herramienta que facilita el trabajo y mejora la percepción de la marca en cada contacto. Si tu objetivo es que la marca se perciba con confianza desde el primer vistazo, estos pasos te permiten lograrlo de forma práctica y medible.</p>    
      `,
      // ← Aquí las relaciones
      relatedArticles: [
        { id: "10", title: "Brand Kit Eficiente: Ahorra Tiempo y Consigue Coherencia Visual" },
        { id: "7", title: "Brief de Diseño: Hoja de Ruta para Proyectos Exitosos" },
        { id: "9", title: "Herramientas de Diseño Inteligentes: Cómo Elegir la Mejor para Tu Equipo" }
      ],
      relatedProjects: [
        {
          title: "Brand System para CBC",
          url: "https://www.instagram.com/p/DLxhfxrxvp_/?utm_source=ig_web_copy_link"
        },
        {
          title: "Estandarización & Manual de Documentos para CBC",
          url: "https://www.behance.net/gallery/229336493/Estandarizacion-Manual-de-Documentos-para-CBC"
        },
        {
          title: "Brand System para FOL Agencia de Valores SpA",
          url: "landing-projects-d-fol.html"
        }
      ]
    },
    "3": {
      id: 3,
      titleHTML: `
        El corazón, un órgano diferenciador 
        <span class="opacity-70">— proyecto de título</span>
      `,
      date: "25 de julio, 2025",
      imagenDesktop: "assets/img/hero-article/Articulo3/img-article-3-3840@2x.webp",
      imagenMobile: "assets/img/hero-article/Articulo3/img-article-3-750@2x.webp",
      ogImage: "mi-portafolio/assets/img/og-images/og-article-3@2x.webp",
      aboutHTML: `
        <span class="opacity-70">
          Soy Macarena, <strong>Product & UX Designer.</strong>
          Con <em>El corazón, un órgano diferenciador</em> confirmé que la intuición, cuando se acompaña de experimentos y registros, puede transformarse en experiencia pública.
          Cuando no diseño, bosquejo nuevas ideas con un chocolate caliente con naranja.
        </span>
      `,
      imageUrl: "assets/img/coveraboutme/avatar-3-400@2x.webp",
      imageAlt: "Imagen de mí",
      content: `
        <p>Una intuición llevó la idea; los datos la hicieron posible. “El corazón, un órgano diferenciador” nació de la pregunta: <em>¿Cómo demostrar que el corazón es un órgano que expresa una huella sonora única para cada persona?</em> Este proyecto de titulación buscó responderlo transformando señales biométricas en experiencias gráficas y sonoras accesibles para cualquier público, aunque se haya presentado ante un jurado académico.</p>
        <p><strong><em>Hipótesis central</em></strong> El latido no es sólo fisiología: contiene características sonoras (ritmo, amplitud, variabilidad) que, mapeadas y procesadas, pueden generar una mándala visual y sonora única para cada persona.</p>
        <p class="text-center fs-6 my-4 bg-canva p-3">“El objetivo del arte no es representar la apariencia exterior de las cosas, sino su significado interior.” — <em>Aristóteles</em></p>
        <hr class="my-5">
        <h2 class="mt-5 fontpoppins opacity-100">Contexto científico</h2>
        <ul>
          <li>La actividad cardiaca se puede capturar con sensores como Doppler o PPG; la señal muestra ritmo, amplitud y variabilidad.</li>
          <li>Esos parámetros se pueden convertir a parámetros sonoros (tono, intensidad, ritmo) y luego a rasgos gráficos.</li>
          <li>Estudios y trabajos interdisciplinarios respaldan que el corazón tiene una actividad propia que influencia el cuerpo; mi objetivo fue usar esos datos como insumo creativo, no como diagnóstico médico.</li>
        </ul>
        <p class="text-center fs-6 my-4 bg-canva p-3">“El diseño puede ser arte. El diseño puede ser estético. El diseño es muy simple, por eso es tan complicado” — <em>Paul Rand</em></p>
        <hr>
        <h4 class="mt-5 fontpoppins opacity-100">Cómo se mostró lo invisible (metodología)</h4>
        <ol>
          <li><strong><em>Captura in situ:</em></strong> registro de 10–20 s por visitante con Doppler.</li>
          <li><strong><em>Procesamiento sonoro:</em></strong> mapeo de señales a propiedades auditivas (frecuencia → tono; amplitud → intensidad; variabilidad → ornamento) usando Max/MSP.</li>
          <li><strong><em>Generación gráfica:</em></strong> un algoritmo traduce la forma de la onda y sus atributos a trazos radiales, paletas y texturas para crear una mándala única.</li>
          <li><strong><em>Cadena de exhibición:</em></strong> sensor → procesamiento → sonificación + mándala → visualización en pantalla para la experiencia del visitante.</li>
        </ol>
        <hr>
        <h4 class="mt-5 fontpoppins opacity-100">¿Qué transmiten las mándalas? (qué mide cada parámetro)</h4>
        <ul>
          <li><strong><em>Amplitud </em>→</strong> altura y energía del trazo.</li>
          <li><strong><em>Frecuencia </em>→</strong> ritmo y densidad de los patrones.</li>
          <li><strong><em>Timbre / color </em>→</strong> paletas y contrastes que sugieren cualidad tonal.</li>
          <li><strong><em>Variabilidad </em>→</strong> ornamentación y complejidad visual.</li>
        </ul>
        <p class="text-center fs-6 my-4 bg-canva p-3">No son diagnósticos médicos; son relatos visuales que buscan reconocimiento emocional y conexión personal.</p>
        <hr class="my-5">
        <h2 class="mt-5 fontpoppins opacity-100">Resultados y validación académica</h2>
        <ul>
          <li>El banco de registros mostró patrones diferenciables entre participantes.</li>
          <li>En la defensa ante el jurado, la pieza generó reacciones técnicas y emocionales: la mayoría de evaluadores expresó sorpresa y conexión con la obra.</li>
          <li>Encuestas y observaciones indicaron que la propuesta funcionó tanto a nivel conceptual como estético: la hipótesis se validó con prototipos mínimos y datos reales.</li>
        </ul>
        <hr>
        <h4 class="mt-5 fontpoppins opacity-100">Testimonios seleccionados</h4>
        <p><em>“Hace tangible algo que normalmente sólo escucho en el trabajo clínico.”</em> — Teresa Conejeros, Enfermera Coordinadora</p>
        <p><em>“Sentí que es algo frágil, como otro ser al que debo cuidar.”</em> — María José Neira, Estudiante de Arte</p>
        <hr>
        <h4 class="mt-5 fontpoppins opacity-100">Entrevistas con especialistas (extractos)</h4>
        <p><strong>Sobre memoria prenatal:</strong> matronas expertas señalaron que experiencias maternas dejan huellas tempranas en el feto.</p>
        <p><strong>Sobre la relación cerebro-corazón:</strong> cardiólogos y expertos señalaron que el corazón influye en la señal corporal y se conecta con el sistema nervioso; esto respalda usar la señal cardiaca como insumo válido para la obra.</p>
        <p>(Estas entrevistas aportaron contexto científico y cultural al proyecto.)</p>
        <hr>
        <h4 class="mt-5 fontpoppins opacity-100">Comentarios del jurado (selección)</h4>
        <p><em>“Nos mostraste que biología y física pueden alimentar propuestas creativas de diseño.”</em> — Julián Naranjo, Diseñador Gráfico</p>
        <p><em>“La experiencia me dejó pensando en la relación entre cuerpo y emoción.”</em> — Sol Guillón, Artista y Docente</p>
        <hr>
        <hr class="my-5">
        <h2 class="mt-5 fontpoppins opacity-100">Retos durante el proceso</h2>
        <ul>
          <li>Escepticismo inicial y falta de apoyo en etapas tempranas.</li>
          <li>Limitaciones de tiempo y recursos para escalar la instalación.</li>
        </ul>
        <p>Estas restricciones obligaron a priorizar prototipos mínimos y documentar cada paso para demostrar la hipótesis rápidamente.</p>
        <hr class="my-5">
        <h2 class="mt-5 fontpoppins opacity-100">Lecciones prácticas</h2>
        <h4 class="mb-3">1. La ciencia da la posibilidad; el diseño la hace visible.</h4>
        <ul>
          <li>Traducir datos en imágenes exige cuidado para que la pieza hable por sí misma.</li>
        </ul>
        <hr>
        <h4 class="mb-3">2. Prototipa lo mínimo que pruebe la idea.</h4>
        <ul>
          <li>Registros cortos (10–20 s) y mapeos simples bastaron para validar la hipótesis.</li>
        </ul>
        <hr>
        <h4 class="mb-3">3. Diseña la visualización como puente emocional.</h4>
        <ul>
          <li>La pieza debía hablar por sí misma más que cualquier explicación técnica.</li>
        </ul>

        <!-- Banner E-Book Branding --> 
        <div id="banner-ebook-free-branding" class="d-none"></div>
        <!-- Banner E-Book Branding -->
        <hr class="my-5">
        <h2 class="mt-5 fontpoppins opacity-100">Galería de fotos</h2>
        <!-- Gallery Article -->
        <div class="container">
            <div class="row">
              <div class="col-12 col-md-6">
                  <div class="text-center">
                    <figure>
                        <img src="assets/img/gallery/img-gallery-article3-1-500@2x.webp" alt="Mándala generada en tiempo real proyectada en sala" class="img-article-gallery"/>
                        <figcaption><small><em>Mándala generada en tiempo real proyectada en sala.</em></small></figcaption>
                      </figure>
                      <figure>
                        <img src="assets/img/gallery/img-gallery-article3-2-500@2x.webp" alt="Registro con Doppler durante la exhibición" class="img-article-gallery"/>
                        <figcaption><small><em>Interacción visitante: captura con Doppler y la mándala emergente.</em></small></figcaption>
                      </figure>
                      <figure>
                        <img src="assets/img/gallery/img-gallery-article3-3-500@2x.webp" alt="Miembro del jurado interactuando con la instalación" class="img-article-gallery"/>
                        <figcaption><small><em>Jurado interactuando con la instalación.</em></small></figcaption>
                      </figure>
                  </div>
              </div>
              <div class="col-12 col-md-6">
                  <div class="text-center">
                      <figure>
                        <img src="assets/img/gallery/img-gallery-article3-4-500@2x.webp" alt="Vista general de la exhibición" class="img-article-gallery"/>
                        <figcaption><small><em>Registro in situ durante la exhibición.</em></small></figcaption>
                      </figure>
                      <figure>
                        <img src="assets/img/gallery/img-gallery-article3-5-500@2x.webp" alt="Bocetos de exploración" class="img-article-gallery"/>
                        <figcaption><small><em>Bocetos y estudios fisiológicos del corazón.</em></small></figcaption>
                      </figure>
                  </div>
              </div>
            </div>
          </div>
          <!-- Gallery Article -->
          <hr class="my-5">
        <p class="text-center fs-6 my-4 bg-canva p-3">El proyecto demostró que el corazón no solo late: cuenta. Al combinar biología, historia cultural, sonido y diseño gráfico logré que ese relato íntimo se hiciera visible para cualquiera. Ve más detalles del pryecto <a href="https://www.behance.net/gallery/230499631/Proyecto-de-Titulo-El-corazon-un-organo-diferenciador" class="a-small-article-green px-1" target="_blank" title="Ver más sobre este Proyecto" data-bs-toggle="tooltip">aquí.</a> <span class="d-none">Si quieres, te comparto el kit básico (workflow, código de mapeo y plantillas gráficas) para que puedas probar una versión propia en tu espacio o evento.</span></p>
        <hr class="my-5">
        <div class="bg-canva p-5">
            <h4 class="text-center fontpoppins-semibold pb-4 opacity-100">FAQ´s</h4>
            <p><strong>¿Por qué trabajar con el corazón?</strong></p>
            <p>Porque es un símbolo universal con base fisiológica; conecta ciencia, cultura y emoción.</p>
            <hr>
            <p><strong>¿Es esto diagnóstico?</strong></p>
            <p>No. El proyecto crea relatos visuales y sonoros; no pretende ni reemplaza un examen médico.</p>
            <hr>
            <p><strong>¿Qué aprende un diseñador con esto?</strong></p>
            <p>Que una idea arriesgada puede sostenerse si se documenta, se prototipa y se valida con datos y público.</p>
        </div>
        <hr class="my-5">
        <p>El proyecto mostró que el latido es más que ritmo: es narración. Combinar biología, historia cultural, sonido y diseño permitió transformar un dato invisible en una experiencia que habla al visitante. Fue, sobre todo, un ejercicio de persistencia: sostener una intuición con datos y prototipos hasta que pueda mostrarse y reconocerse.</p>
        <hr class="my-5">
        <h4 class="mb-3">Proyectos relacionados</h4>
        <ul>
          <li>
            <p><strong><em><a href="https://www.behance.net/gallery/230525254/Espacio-de-Aire-para-Concurso-Acadmico-Nike-Air-Max" class="a-small-article px-1" target="_blank" title="Ver más sobre este Proyecto" data-bs-toggle="tooltip">Espacio de Aire (Air Max)</a>:</em></strong> escultura en papel que hace tangible la “huella invisible” de una suela.</p>
          </li>
          <li>
            <p><strong><em><a href="https://www.behance.net/gallery/54482169/Obra-expuesta-en-Bellas-Artes" class="a-small-article-green px-1" target="_blank" title="Ver más sobre este Proyecto" data-bs-toggle="tooltip">Tributo a Matta-Clark (Bellas Artes)</a>:</em></strong> maqueta en MDF inspirada en cortes arquitectónicos como exploración espacial.</p>          
          </li>
        </ul>
      `,
      // ← Aquí las relaciones
      relatedArticles: [
        { id: "4", title: "Laboratorio de Formas: experimentación creativa aplicada al diseño" },
        { id: "6", title: "Investigación UX que Transforma Productos" },
        { id: "5", title: "Más Allá del Lienzo: cómo convertir experiencia en carrera profesional" }
      ],
      relatedProjects: [
        {
          title: "Tributo a Matta-Clark: exhibición en Bellas Artes",
          url: "https://www.instagram.com/p/DMN1JoOMpb2/?utm_source=ig_web_copy_link"
        },
        {
          title: "Espacio de Aire: La huella invisible de Air Max",
          url: "https://www.instagram.com/p/DMMJOIuMC7Z/?utm_source=ig_web_copy_link"
        },
        {
          title: "Proyecto de Título: El corazón, un órgano diferenciador",
          url: "https://www.behance.net/gallery/54481033/Proyecto-de-Titulo-UFT-2015"
        }
      ]
    },
    "4": {
      id: 4,
      titleHTML: `
        Laboratorio de Formas: 
        <span class="opacity-70"> experimentación creativa aplicada al diseño</span>
      `,
      date: "25 de julio, 2025",
      imagenDesktop: "assets/img/hero-article/Articulo4/img-article-4-3840@2x.webp",
      imagenMobile: "assets/img/hero-article/Articulo4/img-article-4-750@2x.webp",
      ogImage: "mi-portafolio/assets/img/og-images/og-article-4@2x.webp",
      aboutHTML: `
        <span class="opacity-70">
          Soy Macarena, <strong>Product & UX Designer.</strong>
          En mi laboratorio de formas transformo materiales y técnicas en experiencias visuales aplicadas a UX, UI y branding.
          Cuando no experimento, me encontrarás recolectando texturas urbanas para mi próximo prototipo.
        </span>
      `,
      imageUrl: "assets/img/coveraboutme/avatar-4-400@2x.webp",
      imageAlt: "Imagen de mí",
      content: `
        <p>En proyectos de producto solemos vivir entre guías, sprints y entregables. Eso da seguridad, pero también puede empobrecer el lenguaje visual. Un Laboratorio de Formas es un espacio corto y periódico para probar materiales, técnicas y fotografía con propósito: produce activos reales (texturas, relieves, micro-prototipos) que enriquecen interfaces, branding y narrativas visuales sin sacrificar coherencia.</p>
        <hr class="my-5">
        <h2 class="mt-5 fontpoppins opacity-100">Problema</h2>
        <p>La presión por cumplir plazos lleva a repetir patrones previsibles y perder oportunidades de diferenciación visual. Si la experimentación no tiene proceso, los hallazgos se quedan en fotos desordenadas o en ideas que nunca se aplican. La solución es crear un flujo simple: experimentar, documentar, digitalizar e integrar.</p>
        <p class="text-center fs-6 my-4 bg-canva p-3">Una tensión común en diseño y proyectos: seguir el camino seguro frente a probar cosas nuevas.</p>
        <hr class="my-5">
        <h4 class="mb-3">Mini-casos</h4>
        <ul>
          <li>
            <strong><em><a href="https://www.instagram.com/p/DMOgSTsyD6m/?utm_source=ig_web_copy_link" class="a-small-article-green px-1" target="_blank" title="Ver más sobre este Proyecto" data-bs-toggle="tooltip">Cartel “Venezia Venezia”:</a></em></strong>
            <p><strong>Reto:</strong> traducir una crítica arquitectónica y ambiental en una pieza impactante para impresión y digital.</p>
            <p><strong>Acción:</strong> experimento con pliegues y arrugas en papel para generar volúmenes que simularan olas; fotografié y edité variantes.</p>
            <p><strong>Resultado:</strong> piezas impresas y digitales con textura propia, adaptables a flyers y afiches.</p>
            <p><strong><em>Aprendizaje:</em></strong> una textura física puede convertirse en un motivo visual coherente en múltiples soportes.</p>
          </li>
          <li>
            <strong><em><a href="https://www.instagram.com/p/DMLlLzQyweZ/?utm_source=ig_web_copy_link" class="a-small-article px-1" target="_blank" title="Ver más sobre este Proyecto" data-bs-toggle="tooltip">Exploración serigráfica (TEPA):</a></em></strong>
            <p><strong>Reto:</strong> diseñar portadas y bolsos con identidad propia a partir de técnicas artesanales.</p>
            <p><strong>Acción:</strong> fotografié objetos bajo luz rasante para revelar relieves y digitalicé ilustraciones para crear backgrounds y patterns.</p>
            <p><strong>Resultado:</strong> texturas únicas aplicadas en portadas de cuadernos y en material promocional digital.</p>
            <p><strong><em>Aprendizaje:</em></strong> la observación del material y la luz genera detalles que hacen los productos auténticos.</p>     
          </li>
          <li>
            <strong><em><a href="https://www.instagram.com/p/DMJX0VbSrib/?utm_source=ig_web_copy_link" class="a-small-article-green px-1" target="_blank" title="Ver más sobre este Proyecto" data-bs-toggle="tooltip">Proyecto de título — “El corazón, un órgano diferenciador”:</a></em></strong>    
            <p><strong>Reto:</strong> convertir frecuencia cardiaca en imagen y sonido con sentido artístico y comunicacional.</p>
            <p><strong>Acción:</strong> registré latidos in situ, transformé las señales en mandalas visuales y prototipé aplicaciones gráficas para soportes físicos y digitales.</p>
            <p><strong>Resultado:</strong> componentes visuales con carga emocional que acompañaron la presentación de defensa del proyecto.</p>
            <p><strong><em>Aprendizaje:</em></strong> los datos, bien traducidos al diseño, aumentan la carga narrativa y el impacto comunicacional.</p>
          </li>
        </ul>
        <hr class="my-5">
        <h2 class="mt-5 fontpoppins opacity-100">Cómo montar tu Laboratorio de Formas</h2>
        <h4 class="mb-3">1. Reserva el tiempo — 4 horas, 1 vez al mes.</h4>
        <ul>
          <li>Materiales básicos: papeles variados, cartón, tintas, pegamentos, cuchillas, una cámara o móvil con buena cámara.</li>
        </ul>
        <hr>
        <h4 class="mb-3">2. Prueba 3 técnicas por sesión</h4>
        <ul>
          <li>Elige técnicas contrastantes (p. ej. plegado, serigrafía, relieve con gel) y prioriza la que sorprenda más.</li>
        </ul>
        <hr>
        <h4 class="mb-3">3. Fotografía</h4>
        <ul>
          <li>Captura 3–6 versiones por pieza (luz lateral, rasante, difusa). Las fotos serán la base para digitalizar texturas.</li>
        </ul>
        <hr>
        <h4 class="mb-3">4. Documenta insights en caliente</h4>
        <ul>
          <li>Anota lo esencial: qué te sorprendió, cómo se podría usar en UI, qué emoción transmite. Usa notas de voz o un cuaderno.</li>
        </ul>
        <hr>
        <h4 class="mb-3">5. Traduce a digital por capas</h4>
        <ul>
          <li>Escanea/fotografía → limpiar → vectorizar si hace falta → probar como fondo, botón, icono o micro-animación. Regla práctica: 1 experimento → 1 componente UI.</li>
        </ul>
        <hr>
        <h4 class="mb-3">6. Clasifica e integra</h4>
        <ul>
          <li>Guarda los recursos en una carpeta “Activos Experimentales”, define reglas de uso y tags (ej.: textura_rugosa_v1). Decide tokens visuales si procede.</li>
        </ul>
        <hr class="my-5">
  
        <!-- Banner E-Book Branding --> 
        <div id="banner-ebook-free-branding" class="d-none"></div>
        <!-- Banner E-Book Branding -->

        <h2 class="mt-5 fontpoppins opacity-100">Beneficios concretos para producto y marca</h2>
        <ul>
          <li>Diferenciación estética sin romper coherencia.</li>
          <li>Elementos reutilizables (texturas, iconos, micro-animaciones) que aceleran entregas.</li>
          <li>Material auténtico para campañas y storytelling.</li>
          <li>Mayor conexión emocional con usuarios gracias a recursos sensoriales originales.</li>
        </ul>
        <hr class="my-5">
        <h2 class="mt-5 fontpoppins opacity-100">Galería de fotos</h2>
        <!-- Gallery Article -->
        <div class="container">
            <div class="row">
              <div class="col-12 col-md-6">
                  <div class="text-center">
                    <figure>
                        <img src="assets/img/gallery/img-gallery-article4-1-500@2x.webp" alt="Textura de pintura" class="img-article-gallery"/>
                        <figcaption><small><em>Tempera y color.</em></small></figcaption>
                      </figure>
                      <figure>
                        <img src="assets/img/gallery/img-gallery-article4-2-500@2x.webp" alt="Composición digital sobre diferentes fotos" class="img-article-gallery"/>
                        <figcaption><small><em>Composición digital sobre diferentes fotos.</em></small></figcaption>
                      </figure>
                      <figure>
                        <img src="assets/img/gallery/img-gallery-article4-3-500@2x.webp" alt="Zoom a cartel 3d" class="img-article-gallery"/>
                        <figcaption><small><em>Zoom a cartel 3d del proyecto "Venerzzia".</em></small></figcaption>
                      </figure>
                  </div>
              </div>
              <div class="col-12 col-md-6">
                  <div class="text-center">
                      <figure>
                        <img src="assets/img/gallery/img-gallery-article4-4-500@2x.webp" alt="Superposición de fotos" class="img-article-gallery"/>
                        <figcaption><small><em>Superposición de fotos</em></small></figcaption>
                      </figure>
                      <figure>
                        <img src="assets/img/gallery/img-gallery-article4-5-500@2x.webp" alt="Capa vectorial sobre fotografias complejas" class="img-article-gallery"/>
                        <figcaption><small><em>Capa vectorial sobre fotografias complejas.</em></small></figcaption>
                      </figure>
                  </div>
              </div>
            </div>
          </div>
          <!-- Gallery Article -->
        <hr class="my-5">
        <div class="bg-canva p-5">
            <h4 class="text-center fontpoppins-semibold pb-4 opacity-100">FAQ´s</h4>
            <p><strong>¿Necesito mucho presupuesto?</strong></p>
            <p>No. Materiales básicos y un móvil bastan. La clave es la disciplina y el flujo de traducción a digital.</p>
            <hr>
            <p><strong>¿Cómo evito romper la coherencia de la marca?</strong></p>
            <p>Define reglas de uso antes de integrar: cuándo aplicar, contrastes permitidos y accesibilidad (contraste mínimo, legibilidad).</p>
            <hr>
            <p><strong>¿Qué métricas conviene medir?</strong></p>
            <p>CTR de piezas que usan el activo, tiempo de producción por asset, tasa de reutilización y feedback cualitativo de usuarios/equipo.</p>
        </div>
        <hr class="my-5">
        <h2 class="mt-5 fontpoppins opacity-100">Mis 3 Aprendizajes Clave</h2>
        <ol>
          <li>La experimentación dirigida produce recursos aplicables y distintivos.</li>
          <li>Fotografiar y documentar en el momento evita perder hallazgos valiosos.</li>
          <li>Integrar resultados en el design system transforma descubrimientos en recursos escalables.</li>
        </ol>
        <p class="text-center fs-6 my-4 bg-canva p-3">“La simplicidad consiste en restar lo obvio y añadir lo significativo.” — <em>John Maeda</em></p>
        <hr class="my-5">
        <p>Practicar en un Laboratorio de Formas no es escapar del trabajo: es enriquecerlo. Pequeños experimentos bien documentados se convierten en componentes, texturas y narrativas que elevan la experiencia del producto y dan a la marca una voz visual propia.</p>   
      `,
      // ← Aquí las relaciones
      relatedArticles: [
        { id: "3", title: "El corazón, un órgano diferenciador— proyecto de título" },
        { id: "9", title: "Herramientas de Diseño Inteligentes" },
        { id: "5", title: "Más Allá del Lienzo: cómo convertir experiencia en carrera profesional" }
      ],
      relatedProjects: [
        {
          title: "Tributo a Matta-Clark: exhibición en Bellas Artes",
          url: "https://www.instagram.com/p/DMN1JoOMpb2/?utm_source=ig_web_copy_link"
        },
        {
          title: "Espacio de Aire: La huella invisible de Air Max",
          url: "https://www.instagram.com/p/DMMJOIuMC7Z/?utm_source=ig_web_copy_link"
        },
        {
          title: "Proyecto de Título: El corazón, un órgano diferenciador",
          url: "https://www.behance.net/gallery/54481033/Proyecto-de-Titulo-UFT-2015"
        }
      ]
    },
    "5": {
      id: 5,
      titleHTML: `
        Más Allá del Lienzo: 
        <span class="opacity-70">cómo convertir experiencia en carrera profesional</span>
      `,
      date: "25 de julio, 2025",
      imagenDesktop: "assets/img/hero-article/Articulo5/img-article-5-3840@2x.webp",
      imagenMobile: "assets/img/hero-article/Articulo5/img-article-5-750@2x.webp",
      ogImage: "mi-portafolio/assets/img/og-images/og-article-5@2x.webp",
      aboutHTML: `
        <span class="opacity-70">
          Soy Macarena, <strong>Product & UX Designer</strong>. 
          Mi paso por AIESEC potenció mi liderazgo y me enseñó a transformar iniciativas comunitarias en proyectos medibles.
          Cuando no diseño para ONG, exploro nuevas formas de visualización de datos con un café en mano.
        </span>
      `,
      imageUrl: "assets/img/coveraboutme/avatar-5-400@2x.webp",
      imageAlt: "Imagen de mí",
      content: `
        <p><strong>El voluntariado</strong> no es solo buena voluntad: es un laboratorio de habilidades reales. Liderar equipos, diseñar campañas y medir resultados te da experiencia que puede entrar directo en tu portafolio y en conversaciones con recruiters.</p>
        <p><strong>Antes / Después — mi experiencia personal</strong>— Al principio me movía la inquietud y también mucha duda. Me daba temor asumir responsabilidades porque pensaba que no “daba el ancho”: no estaba segura de poder enseñar o coordinar con estudiantes de otras carreras y culturas. Con el tiempo acepté roles que me sacaron de mi zona de confort: organicé cronogramas, facilité comunicación entre equipos y diseñé material de captación. Me pidieron dar capacitaciones y me ofrecieron liderar un área. Fue un proceso de prueba y error: pedí ayuda cuando la necesité, aprendí a delegar y a medir resultados. Al mirar atrás, ya no soy la de antes: tengo más confianza, más claridad sobre lo que aporto y evidencia concreta para mostrar.</p>
        <p class="text-center fs-6 my-4 bg-canva p-3">“La gente no compra lo que haces; compra por qué lo haces.” — <em>Simon Sinek</em></p>
        <hr>
        <h4 class="text-centerfontpoppins opacity-100">Por qué importa documentar el voluntariado</h4>
        <p>Muchas iniciativas valiosas quedan sin registrar y se pierden en el olvido. Documentarlas bien te permite:</p>
        <ul>
          <li>Mostrar habilidades transferibles (liderazgo, coordinación, gestión de stakeholders).</li>
          <li>Probar impacto con números simples (postulaciones, asistencia, satisfacción).</li>
          <li>Contar una narrativa profesional coherente que recruiters y clientes valoran.</li>
        </ul>
        <hr class="my-5">
        <h2 class="mb-3">Mini-casos</h2>
        <ul>
            <li>
                <strong><em><a href="https://www.behance.net/gallery/230522186/Voluntariado-en-AIESEC-%2820122014%29" class="a-small-article-green px-1" target="_blank" rel="noopener noreferrer" title="Ver más sobre este Proyecto" data-bs-toggle="tooltip">Voluntariado en AIESEC</a>:</em></strong>
                <p><strong>Reto:</strong> baja captación y falta de material estandarizado para eventos y stand.</p>
                <p><strong>Acción:</strong> diseñé +20 piezas de reclutamiento, planifiqué el stand y coordiné equipos multiculturales.</p>
                <p><strong>Resultado:</strong> +30% en postulaciones respecto a la campaña previa.</p>
                <p><strong><em>Aprendizaje:</em></strong> alinear comunicación visual con procesos operativos impulsa la participación.</p>
            </li>
            <li>
                <strong><em><a href="https://www.instagram.com/p/DLnbeYNSgf6/?utm_source=ig_web_copy_link" class="a-small-article px-1" target="_blank" rel="noopener noreferrer" title="Ver más sobre este Proyecto" data-bs-toggle="tooltip">Manual OPL — Casona Minka</a>:</em></strong>
                <p><strong>Reto:</strong> tareas operativas sin documentación clara, lo que generaba ineficiencias.</p>
                <p><strong>Acción:</strong> creé un manual OPL y plantillas prácticas para onboarding.</p>
                <p><strong>Resultado:</strong> onboarding estandarizado y menor tiempo de adaptación para nuevos voluntarios.</p>
                <p><strong><em>Aprendizaje:</em></strong> el diseño puede estructurar cultura y operaciones; un documento claro ahorra horas.</p>
            </li>
            <li>
                <strong><em><a href="https://www.instagram.com/p/DLiftbVSbw3/?utm_source=ig_web_copy_link" class="a-small-article-green px-1" target="_blank" rel="noopener noreferrer" title="Ver más sobre este Proyecto" data-bs-toggle="tooltip">Diseño y Prototipo de Blog — CBC</a>:</em></strong>
                <p><strong>Reto:</strong> la comunicación por email no era escalable y la lectura móvil era pobre.</p>
                <p><strong>Acción:</strong> prototipé un blog en HTML5/CSS3, definí flujos editoriales y guías de publicación.</p>
                <p><strong>Resultado:</strong> canal estable que centralizó la comunicación y permitió medir engagement.</p>
                <p><strong><em>Aprendizaje:</em></strong> soluciones sostenibles facilitan la continuidad y muestran impacto medible.</p>
            </li>
        </ul>
        <p class="text-center fs-6 my-4 bg-canva p-3">"El liderazgo no está en mandar; está en conectar, inspirar y motivar a otros a actuar. La empatía es el mejor catalizador del cambio."</p>
        <hr>
        <h4 class="mt-5 mb-5 fontpoppins opacity-100">Tres pasos prácticos para transformar voluntariado en experiencia profesional</h4>
        <ol>
            <li>
                <strong><em>Acepta roles que te saquen de tu zona de confort</em></strong>
                <ul>
                    <li>Busca responsabilidad real: coordinar, liderar proyectos, formar a otros.</li>
                    <li>Documenta tareas y decisiones: qué hiciste, por qué lo hiciste y qué decisión tomaste.</li>
                </ul>
            </li>
            <div class="my-5"></div>
            <li>
                <strong><em>Mide lo que puedas, aunque sea con indicadores simples</em></strong>
                <ul>
                    <li>Postulaciones por campaña, asistentes a eventos, tasa de conversión interés→postulación, encuestas de satisfacción.</li>
                    <li>Guarda una línea base (antes) y compara después de tu intervención.</li>
                </ul>
            </li>
            <div class="my-5"></div>
            <li>
                <strong><em>Cuenta tu historia con evidencia</em></strong>
                <ul>
                    <li>Publica un hilo en LinkedIn o una entrada en tu blog con: contexto, tu rol, metodología, resultado y un testimonio breve.</li>
                    <li>Adjunta artefactos: piezas diseñadas, cronogramas, capturas del dashboard o encuestas.</li>
                </ul>
            </li>
        </ol>

        <!-- Banner E-Book Memoria Emocional -->
        <div id="banner-ebook-price-memoriaemocional" class="d-none"></div>
        <!-- Banner E-Book Memoria Emocional -->

        <hr class="my-5">
        <div class="bg-canva p-5">
            <h4 class="text-center fontpoppins-semibold pb-4 opacity-100">FAQ´s</h4>
            <p><strong>¿Cómo demuestra el voluntariado habilidades transferibles?</strong></p>
            <p>Con resultados y artefactos: explica tu rol, muestra piezas y cronogramas, comparte métricas y 1–2 testimonios que respalden tu aporte.</p>
            <hr>
            <p><strong>¿Puedo incluir trabajo voluntario en un case study profesional?</strong></p>
            <p>Sí. Anonimiza datos sensibles si corresponde; presenta contexto, tu rol, la línea base, la metodología y los resultados cuantificados.</p>
            <hr>
            <p><strong>¿Qué hago si no hay datos previos?</strong></p>
            <p>Registra una línea base mínima (una campaña o dos semanas), usa encuestas rápidas y combina métricas con testimonios cualitativos.</p>
        </div>
        <!-- Gallery Article -->
        <hr class="my-5">
        <h2 class="mt-5 fontpoppins opacity-100">Galería de fotos</h2>
        <div class="container">
            <div class="row">
              <div class="col-12 col-md-6">
                  <div class="text-center">
                    <figure>
                        <img src="assets/img/gallery/img-gallery-article5-1-500@2x.webp" alt="Foto en stand" class="img-article-gallery"/>
                        <figcaption><small><em>Stand de campaña — Outgoing Exchange.</em></small></figcaption>
                      </figure>
                      <figure>
                        <img src="assets/img/gallery/img-gallery-article5-2-500@2x.webp" alt="Foto del set Transmisión de TV" class="img-article-gallery"/>
                        <figcaption><small><em>Foto del set Transmisión de TV — Entrevista a AIESEC.</em></small></figcaption>
                      </figure>
                      <figure>
                        <img src="assets/img/gallery/img-gallery-article5-3-500@2x.webp" alt="Diseño de etiquetas de bienvenida" class="img-article-gallery"/>
                        <figcaption><small><em>Diseño de etiquetas de bienvenida — Outgoing Exchange.</em></small></figcaption>
                      </figure>
                  </div>
              </div>
              <div class="col-12 col-md-6">
                  <div class="text-center">
                      <figure>
                        <img src="assets/img/gallery/img-gallery-article5-4-500@2x.webp" alt="Flyer campaña Outgoing Exchange" class="img-article-gallery"/>
                        <figcaption><small><em>Flyer campaña Outgoing Exchange</em></small></figcaption>
                      </figure>
                      <figure>
                        <img src="assets/img/gallery/img-gallery-article5-5-500@2x.webp" alt="Foto grupal de equipos internos de AIESEC." class="img-article-gallery"/>
                        <figcaption><small><em>Foto grupal de equipos internos de AIESEC.</em></small></figcaption>
                      </figure>
                  </div>
              </div>
            </div>
          </div>
          <!-- Gallery Article -->
        <hr class="my-5">
        <h2 class="mt-5 fontpoppins opacity-100">Mis 3 Aprendizajes Clave</h2>
        <ol>
            <li>Documentar transforma tareas en evidencia profesional.</li>
            <li>Medir —aunque sea con métricas simples— transforma historias en datos accionables.</li>
            <li>Liderar en voluntariado enseña coordinación, delegación y diseño de soluciones sostenibles.</li>
        </ol>
        <hr class="my-5">
        <p>El voluntariado es una escuela práctica: te expone a problemas reales, equipos diversos y decisiones que no aparecen en las aulas. Si aceptas responsabilidades, mides lo que haces y cuentas la historia con humildad y datos, tu experiencia deja de ser un anexo del CV y pasa a ser parte central de tu trayectoria profesional.</p>   
      `,
      // ← Aquí las relaciones
      relatedArticles: [
        { id: "4", title: "Laboratorio de Formas: experimentación creativa aplicada al diseño" },
        { id: "7", title: "Brief de Diseño: Hoja de Ruta para Proyectos Exitosos" },
        { id: "10", title: "Brand Kit Eficiente" }
      ],
      relatedProjects: [
        {
          title: "TEPA Encuaderna tu mundo",
          url: "https://www.instagram.com/p/DMN1JoOMpb2/?utm_source=ig_web_copy_link"
        },
        {
          title: "Manual OPL para Voluntarios de Casona Minka",
          url: "https://www.instagram.com/p/DMMJOIuMC7Z/?utm_source=ig_web_copy_link"
        },
        {
          title: "Voluntariado en AIESEC",
          url: "https://www.behance.net/gallery/54481033/Proyecto-de-Titulo-UFT-2015"
        }
      ]
    },
    "6": {
      id: 6,
      titleHTML: `
        Investigación UX: 
        <span class="opacity-70"> mapas, A/B testing y shadowing</span>
      `,
      date: "18 de julio, 2025",
      imagenDesktop: "assets/img/hero-article/Articulo6/img-article-6-3840@2x.webp",
      imagenMobile: "assets/img/hero-article/Articulo6/img-article-6-750@2x.webp",
      ogImage: "mi-portafolio/assets/img/og-images/og-article-6@2x.webp",
      aboutHTML: `
        <span class="opacity-70">
          Soy Macarena, <strong>Product & UX Designer.</strong>
          He transformado procesos y experiencias en proyectos como CBC Web y Hostal Casona Minka. Aplico journey mapping, A/B testing y shadowing para convertir problemas en mejoras medibles.
          Cuando no investigo, pruebo nuevas herramientas con una infusión de rooibos y hibiscos.
        </span>
      `,
      imageUrl: "assets/img/coveraboutme/avatar-6-400@2x.webp",
      imageAlt: "Imagen de mí",
      content: `
        <p><strong>Investigación UX que convierte dificultades en resultados: mapas, A/B testing y shadowing que redujeron tiempos, subieron clics +25% y reservas +20%.</strong></p>
        <p>Vi a un usuario pasar cinco minutos atorado en un formulario: clics erráticos, confusión y abandono. Sin datos, cualquier cambio queda en opinión. Diseñé un programa práctico de investigación (journey mapping, shadowing y pruebas iterativas) y convertimos la observación en hipótesis, cambios concretos y métricas que demostraron impacto real. Este artículo te entrega un plan replicable para obtener resultados similares en tu producto o equipo.</p>
        <p class="text-center fs-6 my-4 bg-canva p-3">“Si el usuario no puede usarlo, no funciona” — <em>Susan Dray</em></p>
        <hr>
        <h2 class="mt-5 fontpoppins opacity-100">Problema</h2>
        <p>Muchas interfaces nacen de suposiciones: pantallas lindas que esconden procesos complejos. Sin investigación, los usuarios encuentran obstáculos y los equipos adoptan atajos que afectan la operación. La investigación UX aporta evidencia para priorizar cambios que importan al usuario y al negocio.</p>
        <h4 class="mb-3">Mini-casos (qué se hizo y por qué funcionó)</h4>
        <ul>
            <li>
                <strong><em><a href="https://www.instagram.com/p/DLskei2SY5r/?utm_source=ig_web_copy_link" class="a-small-article-green px-1" target="_blank" rel="noopener noreferrer" title="Ver más sobre este Proyecto" data-bs-toggle="tooltip">Módulo “Mis Datos” — Plataforma CBC</a>:</em></strong>
                <p><strong>Reto:</strong> pasos redundantes en el flujo de actualización de datos.</p>
                <p><strong>Acción:</strong> journey mapping, reordenamiento de pasos y prototipo testeado con usuarios internos.</p>
                <p><strong>Resultado:</strong> tiempo de tarea reducido de 15 a 6 minutos y menos errores operativos.</p>
                <p><strong><em>Métrica:</em></strong> tiempo por tarea.</p>
            </li>
            <li>
                <strong><em><a href="https://www.instagram.com/p/DLsLeySMdog/?utm_source=ig_web_copy_link" class="a-small-article px-1" target="_blank" rel="noopener noreferrer" title="Ver más sobre este Proyecto" data-bs-toggle="tooltip">A/B Testing — CBC Web (Prototipado & Mantenimiento)</a>:</em></strong>
                <p><strong>Reto:</strong> baja visibilidad del menú y landing.</p>
                <p><strong>Acción:</strong> tres rondas de A/B testing en variantes de menú, cada prueba con una sola variable.</p>
                <p><strong>Resultado:</strong> +25% en clics acumulados tras las iteraciones.</p>
                <p><strong><em>Métrica:</em></strong> tasa de clics (CTR).</p>
            </li>
            <li>
                <strong><em><a href="landing-projects-d-minka.html" class="a-small-article-green px-1" target="_blank" rel="noopener noreferrer" title="Ver más sobre este Proyecto" data-bs-toggle="tooltip">Shadowing — Hostal Casona Minka</a>:</em></strong>
                <p><strong>Reto:</strong> procesos manuales y desorden en la recepción que afectaban la experiencia y la operación.</p>
                <p><strong>Acción:</strong> observación 1:1 en contexto, ajuste de formularios y reorganización de tareas.</p>
                <p><strong>Resultado:</strong> +20% en reservas y mayor fluidez operacional.</p>
                <p><strong><em>Métrica:</em></strong> reservas y tiempo de atención</p>
            </li>
        </ul>
        <p class="text-center fs-6 my-4 bg-canva p-3">“La usabilidad gobierna la Web. En pocas palabras, si el cliente no puede encontrar un producto, entonces él o ella no lo comprará” — <em>Jakob Nielsen</em></p>
        <hr class="my-5">
        <h2 class="mt-5 fontpoppins opacity-100">Qué prácticas integrar (y por qué)</h2>
        <ol>
            <li><strong><em>Customer & Task Journey Mapping:</em></strong> muestra pasos, decisiones y puntos donde se detiene el usuario.</li>
            <li><strong><em>A/B Testing iterativo:</em></strong> prueba una variable por test para aislar impacto real.</li>
            <li><strong><em>Shadowing 1:1 en contexto:</em></strong> observa atajos, herramientas y comportamientos no verbales.</li>
            <li><strong><em>Validación de prototipos en entorno real:</em></strong> prueba en condiciones reales antes de programar.</li>
          </ol>

          <!-- Banner E-Book Memoria Emocional -->
          <div id="banner-ebook-price-memoriaemocional" class="d-none"></div>
          <!-- Banner E-Book Memoria Emocional -->
          <hr class="my-5">
          <p class="text-center fs-6 my-4 bg-canva p-3">“Un buen diseño de UX se basa en simplificar la experiencia del usuario, lo que implica eliminar cualquier elemento innecesario” — <em>Career Foundry</em></p>
          <hr class="my-5">
          <h2 class="mt-5 fontpoppins opacity-100">KPIs recomendados (elige 2–3 según objetivo)</h2>
          <ul>
              <li><strong>Eficiencia de tarea:</strong> tiempo medio por tarea, tasa de completitud, tasa de error.</li>
              <li><strong>Visibilidad:</strong> CTR en elementos clave, porcentaje de usuarios que alcanzan la meta.</li>
              <li><strong>Conversión:</strong> tasa de conversión por paso, reservas, leads.</li>
              <li><strong>Satisfacción:</strong> CSAT, NPS o feedback cualitativo estructurado.</li>
              <li><strong>Adopción interna:</strong> reducción de workarounds, % de procesos hechos sin soporte.</li>
          </ul>
          <p class="text-center fs-6 my-4 bg-canva p-3">“Regla general para UX: más opciones, más problemas” — <em>Scott Belsky</em></p>
          <hr class="my-5">
          <div class="bg-canva p-5">
              <h4 class="text-center fontpoppins-semibold pb-4 opacity-100">FAQ´s</h4>
              <p><strong>¿Por dónde empiezo si tengo poco tráfico?</strong></p>
              <p>Prioriza shadowing y tests de usabilidad con 3–5 usuarios representativos; los insights cualitativos producen hipótesis sólidas para luego probar.</p>
              <hr>
              <p><strong>¿Cuánto tiempo tarda ver resultados en un A/B test?</strong></p>
              <p>Depende del tráfico y del efecto. Define tamaño de muestra y duración antes de lanzar (p. ej. 1–2 semanas para tráfico moderado).</p>
              <hr>
              <p><strong>¿Shadowing reemplaza las métricas?</strong></p>
              <p>No. Shadowing complementa los números: explica el “por qué” detrás de los datos y ayuda a diseñar tests mejores.</p>
          </div>
          <hr class="my-5">
          <h2 class="mt-5 fontpoppins opacity-100">Mis 3 Aprendizajes Clave</h2>
          <ol>
              <li>Mapear primero ahorra horas: ver el flujo completo revela la causa de muchos problemas.</li>
              <li>Probar en breve y repetir: tres iteraciones controladas valen más que muchas opiniones sueltas.</li>
              <li>Observar en contexto humaniza los datos: ver a la persona usar el producto revela soluciones prácticas.</li>
          </ol>
          <hr class="my-5">
          <p>La investigación UX convierte dudas en acciones claras. Empieza pequeño: mapea un flujo, haz una observación breve y prueba una hipótesis. Los datos te darán criterio para priorizar lo que realmente mejora la experiencia y los resultados.</p>
      `,
      // ← Aquí las relaciones
      relatedArticles: [
        { id: "8", title: "El Retorno de Inversión en UX: Por Qué Vale la Pena" },
        { id: "11", title: "Iteraciones Rápidas: Prototipado que Minimiza Riesgos" },
        { id: "12", title: "Integrando IA en tu Proceso de Diseño" }
      ],
      relatedProjects: [
        {
          title: "Rediseño & Prototipado Web para CBC",
          url: "landing-projects-d-CBC.html"
        },
        {
          title: "Burbuja de Chatbot para CBC",
          url: "https://www.instagram.com/p/DLnmgKHS9he/?utm_source=ig_web_copy_link"
        },
        {
          title: "Experiencia Perú: App de Viaje Personalizado",
          url: "https://www.instagram.com/p/DLlB8LtS3GU/?utm_source=ig_web_copy_link"
        }
      ]
    },
    "7": {
      id: 7,
      titleHTML: `
        Brief de Diseño: 
        <span class="opacity-70"> Hoja de Ruta para Proyectos Exitosos</span>
      `,
      date: "18 de julio, 2025",
      imagenDesktop: "assets/img/hero-article/Articulo7/img-article-7-3840@2x.webp",
      imagenMobile: "assets/img/hero-article/Articulo7/img-article-7-750@2x.webp",
      ogImage: "mi-portafolio/assets/img/og-images/og-article-7@2x.webp",
      aboutHTML: `
        <span class="opacity-70">
          Soy Macarena, <strong>—Product & UX Designer—</strong>
          y pienso que empezar con un buen brief es un acto de cuidado: cuida tiempos, dinero y expectativas. Tras estandarizar documentos en equipos diversos, veo cómo un brief corto y bien hecho cambia la energía del proyecto.
          Cuando no estructuro briefs, exploro nuevas metodologías de diseño con un té de jazmín a mano.
        </span>
      `,
      imageUrl: "assets/img/coveraboutme/avatar-1-400@2x.webp",
      imageAlt: "Imagen de mí",
      content: `
        <p>El éxito de un proyecto de diseño rara vez depende sólo del talento creativo. Gran parte se decide al principio: cuando cliente y equipo alinean objetivo, alcance y criterios. Un brief claro es la brújula que evita idas y vueltas, acelera decisiones y protege el tiempo de todos.</p>
        <p><strong>¿Qué es un Brief de Diseño?</strong> Un brief es un documento breve y operativo que responde: ¿qué queremos lograr?, ¿por qué importa?, ¿para quién es esto? y ¿qué entregables y plazos acordamos? Más que un archivo, es la referencia diaria que guía decisiones creativas y técnicas.</p>
        <p class="text-center fs-6 my-4 bg-canva p-3">“El diseño es el pensamiento hecho visual” — <em>Saul Bass</em></p>
        <hr class="my-5">
        <h2 class="mt-5 fontpoppins opacity-100">Problema</h2>
        <p>Sin un brief práctico ocurren con frecuencia:</p>
        <ul>
            <li>Se pierde tiempo en decisiones evitables.</li>
            <li>Aumentan las correcciones por malentendidos.</li>
            <li>Entregables inconsistente que no responden al objetivo de negocio.</li>
        </ul>
        <p class="text-center fs-6 my-4 bg-canva p-3">Un brief bien definido evita eso y pone a todos en la misma página desde el día 0.</p>
        <h4 class="mt-5 mb-3">¿Por qué es tan importante?</h4>
        <p>Un brief alineado:</p>
        <ul>
            <li>Acelera la toma de decisiones.</li>
            <li>Reduce consultas y correcciones.</li>
            <li>Permite medir si el trabajo cumple el objetivo comercial o funcional.</li>
        </ul>
        <hr>
        <h4 class="mt-5 mb-3">Elementos Clave de un Brief Efectivo</h4>
        <p>Un brief no debe ser largo; debe ser útil. Campos que siempre incluyo:</p>
        <ol>
            <li><strong>Título del proyecto</strong></li>
            <li><strong>Objetivo (1 línea, SMART si es posible)</strong>— ¿Qué buscamos lograr? (p. ej. aumentar completitud de formulario +15% en 60 días).</li>
            <li><strong>Audiencia principal</strong>— quién usa o recibe el producto (edad, rol, contexto).</li>
            <li><strong>Propuesta de valor / mensaje clave</strong>— ¿qué debe comunicar esta pieza?</li>
            <li><strong>Alcance (qué está dentro y qué no)</strong>— entregables claros.</li>
            <li><strong>Métricas de éxito</strong>— 2–3 KPIs (ej.: tasa de conversión, tiempo por tarea, CSAT).</li>
            <li><strong>Restricciones</strong>— plazos, tech stack, recursos, accesibilidad.</li>
            <li><strong>Referencias visuales / tono</strong>— ejemplos “qué sí” / “qué no”</li>
            <li><strong>Stakeholders y responsables</strong>— quién aprueba en cada etapa.</li>
            <li><strong>Plazos y entregables</strong>— fechas clave y entregables intermedios.</li>
        </ol>
        <hr>
        <h4 class="mt-5 mb-3">Mini-casos</h4>
        <ul>
            <li>
                <strong><em><a href="landing-projects-d-fol.html" class="a-small-article-green px-1" target="_blank" rel="noopener noreferrer" title="Ver más sobre este Proyecto" data-bs-toggle="tooltip">Brand System para FOL</a>:</em></strong>
                <p><strong>Reto:</strong> decisiones visuales dispersas entre TI y Marketing que frenaban lanzamientos.</p>
                <p><strong>Acción:</strong> brief inicial + moodboard + guía de tokens visuales y plantillas.</p>
                <p><strong>Resultado:</strong> decisiones más ágiles; despliegues sin correcciones de color.</p>
                <p><strong><em>Aprendizaje:</em></strong> un brief operativo + entregables fuente acelera el hand-off técnico.</p>
            </li>
            <li>
                <strong><em><a href="landing-projects-d-australGroup.html" class="a-small-article px-1" target="_blank" rel="noopener noreferrer" title="Ver más sobre este Proyecto" data-bs-toggle="tooltip">Aulas Virtuales e-Learning para Austral Group</a>:</em></strong>
                <p><strong>Reto:</strong> comenzar por pantallas sin entender flujos y usuarios.</p>
                <p><strong>Acción:</strong> brief con 3 perfiles (roles) y mapeo de journeys antes de wireframes.</p>
                <p><strong>Resultado:</strong> mayor velocidad en entregas y capacidad de anticipar soluciones.</p>
                <p><strong><em>Aprendizaje:</em></strong> mapear usuarios antes de diseñar evita supuestos costosos.</p>
            </li>
            <li>
                <strong><em><a href="landing-projects-d-tarotParaSanar.html" class="a-small-article-green px-1" target="_blank" rel="noopener noreferrer" title="Ver más sobre este Proyecto" data-bs-toggle="tooltip">Rebranding / Plantillas para Tarot para Sanar</a>:</em></strong>
                <p><strong>Reto:</strong> producir 18 piezas en 4 semanas con tono profundo y coherente.</p>
                <p><strong>Acción:</strong> brief estético claro + plantillas editables.</p>
                <p><strong>Resultado:</strong> entregas puntuales y cliente autónoma para publicar.</p>
                <p><strong><em>Aprendizaje:</em></strong> incluir plantillas en el entregable reduce consultas posteriores.</p>
            </li>
        </ul>
        <hr class="my-5">
        <h2 class="mt-5 fontpoppins opacity-100">Checklist operativo</h2>
        <p>(30 / 60 / 90 días) — con indicadores</p>
        <ol>
          <li>
            <p><strong>Semana 0 (Kick-off, día 0)</strong></p>
                <ul>
                  <li>Objetivo SMART aprobado.</li>
                  <li>2 perfiles definidos (responsable de producto + responsable de diseño).</li>
                  <li>Moodboard y 3 referencias.</li>
                  <li><strong>KPI línea base registrada</strong> (p. ej. tiempo medio por tarea o % de completitud)</li>
                </ul>
              </li>
              <li>
                <p><strong>Día 30</strong></p>
                <ul>
                  <li>Entrega de wireframes y prototipo MVP.</li>
                  <li>Plantilla visual básica aprobada (slide / PDF).</li>
                  <li><strong>Medir:</strong> % de piezas que usan plantilla; número de correcciones en la primera ronda.</li>
                </ul>
              </li>
              <li>
                <p><strong>Día 60</strong></p>
                <ul>
                  <li>Primera versión funcional / QA básico.</li>
                  <li><strong>Medir:</strong> reducción % en tiempo por tarea vs. línea base; % de entregables aprobados a la primera.</li>
                </ul>
              </li>
              <li>
                <p><strong>Día 90</strong></p>
                <ul>
                  <li>Entrega final y retro / lecciones aprendidas.</li>
                  <li><strong>Medir:</strong> horas/mes ahorradas estimadas; CSAT cliente; % de entregables entregados en tiempo.</li>
                </ul>  
          </li>
        </ol>
        <hr class="my-5">
        <div class="bg-canva p-5">
            <h4 class="text-center fontpoppins-semibold pb-4 opacity-100">FAQ´s</h4>
            <p><strong>¿Qué diferencia un brief UX de un brief visual?</strong></p>
            <p>El brief UX incluye objetivos de comportamiento y métricas (tests, usuarios), el visual se centra en tono e imagen. Ideal: un único brief que combine ambos planos.</p>
            <hr>
            <p><strong>¿Quién debe aprobar el brief?</strong></p>
            <p>Al menos: cliente/project owner, responsable de producto y diseñador líder.</p>
            <hr>
            <p><strong>¿Quién participa en la creación del brief?</strong></p>
            <p>Generalmente el cliente, el equipo de producto, stakeholders clave y el diseñador UX.</p>
            <hr>
            <p><strong>¿El brief se puede cambiar durante el proyecto?</strong></p>
            <p>Sí — debe versionarse. Cualquier cambio importante necesita aprobación y actualización de KPIs.</p>
        </div>
        <hr class="my-5">
        <h2 class="mt-5 fontpoppins opacity-100">Mis 4 Aprendizajes Clave</h2>
        <ol>
            <li>Involucra a las personas correctas desde el día 0.</li>
            <li>Define 1–2 métricas que importen al negocio.</li>
            <li>Entrega plantillas y archivos fuente: facilitan implementación y reducen consultas.</li>
            <li>Mantén el brief vivo: versión, fecha y responsable para cada cambio.</li>
        </ol>
        <p class="text-center fs-6 my-4 bg-canva p-3">"Briefs bien definidos, proyectos más cortos, entregables más claros y clientes que regresan"</p>
        <hr>
        <p>Un brief bien estructurado no es un documento más, es la brújula que guía al equipo de diseño hacia soluciones claras, alineadas y efectivas. Dedicar tiempo a definirlo es invertir en un proceso creativo más ágil y en resultados que realmente aportan valor.</p>
      `,
      // ← Aquí las relaciones
      relatedArticles: [
        { id: "2", title: "Coherencia Visual: Estandariza tus Documentos" },
        { id: "9", title: "Herramientas de Diseño Inteligentes" },
        { id: "11", title: "Iteraciones Rápidas: Prototipado que Minimiza Riesgos" }
      ],
      relatedProjects: [
        {
          title: "Brand System FOL",
          url: "landing-projects-d-fol.html"
        },
        {
          title: "Brochure Maestranza San José",
          url: "https://www.instagram.com/p/DAn9UfQyuGE/?utm_source=ig_web_copy_link"
        },
        {
          title: "Brochure CBC",
          url: "https://www.instagram.com/p/DL0aldGSeIy/?utm_source=ig_web_copy_link"
        }
      ]
    },
    "8": {
      id: 8,
      titleHTML: `
        ROI en UX:
        <span class="opacity-70"> cómo medir y demostrar impacto (conversiones, ahorro y retención)</span>
      `,
      date: "18 de julio, 2025",
      imagenDesktop: "assets/img/hero-article/Articulo8/img-article-8-3840@2x.webp",
      imagenMobile: "assets/img/hero-article/Articulo8/img-article-8-750@2x.webp",
      ogImage: "mi-portafolio/assets/img/og-images/og-article-8@2x.webp",
      aboutHTML: `
        <span class="opacity-70">
          Soy Macarena, <strong>—Product & UX Designer—</strong>
          he transformado procesos y experiencias digitales en proyectos para Austral Group, CBC Web y Hostal Casona Minka, siempre con un enfoque basado en datos y pruebas reales.
          Cuando no estoy diseñando, me encontrarás disfrutando de un episodio de anime o serie, acompañada de una tabla de sushi vegetariano (sin palta).
        </span>
      `,
      imageUrl: "assets/img/coveraboutme/avatar-2-400@2x.webp",
      imageAlt: "Imagen de mí",
      content: `
        <p><strong>¿UX como gasto?</strong> EEs un error común. Con un método sencillo la investigación y el diseño no solo mejoran la experiencia: también aumentan conversiones, reducen consultas al soporte y generan ahorros reales. En este artículo te explico cómo pasar de “buen diseño” a evidencia empírica: qué medir, cómo probar hipótesis y qué resultados comunicar para convencer a un recruiter o a un tomador de decisiones.</p>
        <p class="text-center fs-6 my-4 bg-canva p-3">“Si piensas que el buen diseño es caro, deberías considerar el costo del mal diseño” — <em>Dr. Ralf Speth</em></p>
        <hr class="my-5">
        <h2 class="mt-5 fontpoppins opacity-100">Problema</h2>
        <p>Sin una estrategia UX clara ocurre esto: usuarios abandonan flujos críticos, el equipo de soporte se sobrecarga y se pierde facturación y confianza. Además, en algunas empresas el diseño se considera “decoración” o se contrata perfiles sin darles espacio para investigar —eso limita el potencial de impacto del diseño. Si no hay métricas, el diseño queda como opinión; con números pasa a ser evidencia.</p>
        <hr>
        <h4 class="mb-3">Qué medir primero</h4>
        <p>Antes de tocar nada, registra durante 1–2 semanas o 100 sesiones (lo que llegue primero):</p>
        <ol>
            <li>Tiempo por tarea crítica (p. ej. completar el registro).</li>
            <li>Tasa de abandono del flujo (por paso).</li>
            <li>Tickets de soporte asociados al flujo (nº / semana).</li>
        </ol>
        <p>Con estos datos tendrás la línea base para comparar tras los cambios.</p>
        <hr>
        <h4 class="mt-5 fontpoppins opacity-100">Propuesta práctica: convierte UX en ROI medible (pasos)</h4>
        <ol>
            <li>
                <strong><em>Define la hipótesis</em></strong>
                <p>Ej.: “Si simplificamos el formulario de registro, la tasa de completitud aumentará.”</p>
            </li>
            <div class="my-4"></div>
            <li>
                <strong><em>Prioriza una métrica norte</em></strong>
                <p>Elige 1 métrica que represente el impacto (ej.: % de completitud).</p>
            </li>
            <div class="my-4"></div>
            <li>
                <strong><em>Observación contextual</em></strong>
                <p>Shadowing 1:1 de 10–30 minutos; anota atajos y workarounds. Complementa métricas con entrevistas cortas.</p>
            </li>
            <div class="my-4"></div>
            <li>
                <strong><em>Diseña un experimento controlado</em></strong>
                <p>A/B test o test con usuarios; cambia una sola variable por prueba (microcopy, orden de campos, CTA). Corre 3 iteraciones si es posible.</p>
            </li>
            <div class="my-4"></div>
            <li>
                <strong><em>Observa en contexto (shadowing 1:1)</em></strong>
                <p>Acompaña a usuarios en su entorno para descubrir atajos y problemas que las métricas no muestran.</p>
            </li>
            <div class="my-4"></div>
            <li>
                <strong><em>Valida prototipos en entorno real</em></strong>
                <p>Prueba prototipos con usuarios representativos antes de programar.</p>
            </li>
            <div class="my-4"></div>
            <li>
                <strong><em>Calcula ahorro operativo</em></strong>
                <p><em>Fórmula práctica:</em></p>
                <p>Ahorro = (horas de soporte evitadas × coste/h) + (horas de correcciones evitadas × coste/h)</p>
                <p>ROI (%) = (Beneficio neto − Inversión) / Inversión × 100</p>
            </li>       
        </ol>
        <p class="text-center fs-6 my-4 bg-canva p-3">“Si quieres un gran sitio, debes probarlo” — <em>Steve Krug</em></p>
        <hr class="my-5">
        <h2 class="mb-3 mt-5">Mini-casos</h2>
        <ul>
            <li>
                <strong><em><a href="https://www.behance.net/gallery/229418197/Perfil-de-Inversionista-en-App-FOL-%282018%29" class="a-small-article-green px-1" target="_blank" rel="noopener noreferrer" title="Ver más sobre este Proyecto" data-bs-toggle="tooltip">Perfil de Inversionista — FOL</a>:</em></strong>
                <p><strong>Reto:</strong> flujos complejos para completar el perfil y lectura de textos pensados para desktop que no funcionaban en mobile.</p>
                <p><strong>Acción:</strong> investigación de contenido, priorización de campos, rediseño responsive y prototipado.</p>
                <p><strong>Resultado:</strong> mayor tasa de completitud del perfil, mejora en la experiencia móvil y reducción de obstáculos para realizar tareas clave.</p>
                <p><strong><em>Qué demuestra:</em></strong> priorizar contenido crítico mejora conversión sin grandes inversiones.</p>
            </li>
            <li>
                <strong><em><a href="https://www.instagram.com/p/DLnmgKHS9he/?utm_source=ig_web_copy_link" class="a-small-article px-1" target="_blank" rel="noopener noreferrer" title="Ver más sobre este Proyecto" data-bs-toggle="tooltip">Burbuja de Chatbot — CBC</a>:</em></strong>
                <p><strong>Reto:</strong> no contaban con un chatbot para resolver dudas básicas ni acceso directo a su asesor en consultas específicas.</p>
                <p><strong>Acción:</strong> diseño de burbuja con cuatro rutas (búsqueda, FAQs, vídeos, asesor), pruebas de usabilidad y microcopy optimizado.</p>
                <p><strong>Resultado:</strong> menos consultas repetidas y soporte más eficiente.</p>
                <p><strong><em>Qué demuestra:</em></strong> invertir en UX reduce costos operativos.</p>
            </li>
            <li>
                <strong><em><a href="https://www.instagram.com/p/DLiftbVSbw3/?utm_source=ig_web_copy_link" class="a-small-article-green px-1" target="_blank" rel="noopener noreferrer" title="Ver más sobre este Proyecto" data-bs-toggle="tooltip">Diseño y Prototipo de Blog — CBC</a>:</em></strong>
                <p><strong>Reto:</strong> comunicación por email poco escalable y baja lectura en móvil.</p>
                <p><strong>Acción:</strong> definición de flujos editoriales, prototipado en HTML5/CSS3 y diseño centrado en lectura móvil.</p>
                <p><strong>Resultado:</strong> mayor organización de contenidos y canal público que reforzó la marca.</p>
                <p><strong><em>Qué demuestra:</em></strong> experiencia optimizada = mayor engagement.</p>
            </li>
            <li>
                <strong><em><a href="https://www.instagram.com/p/DMJX0VbSrib/?utm_source=ig_web_copy_link" class="a-small-article px-1" target="_blank" rel="noopener noreferrer" title="Ver más sobre este Proyecto" data-bs-toggle="tooltip">Proyecto de Título — "El corazón, un órgano diferenciador"</a>:</em></strong>
                <p><strong>Reto:</strong> representar de manera visual y sonora la singularidad del latido humano.</p>
                <p><strong>Acción:</strong> investigación interdisciplinaria, registro in situ de pulso y creación de mandalas sonoros.</p>
                <p><strong>Resultado:</strong> validación de la hipótesis y exhibición interactiva exitosa.</p>
                <p><strong><em>Qué demuestra:</em></strong> investigación aplicada + diseño comunican resultados complejos a audiencias amplias.</p>
            </li>
        </ul>
        <hr class="my-5">
        <h4 class="mt-5 fontpoppins opacity-100">Perfiles UX + UI (qué son y cuándo necesitarlos)</h4>
        <p>Un diseñador gráfico no es lo mismo que un diseñador UX/UI. El gráfico trabaja identidad y piezas estáticas; el UX se centra en procesos, comportamiento y medición. Tampoco es necesario que el diseñador dependa jerárquicamente de TI: lo ideal es una colaboración transversal entre Producto, TI y Marketing. Un diseñador puede liderar iniciativas, proponer hipótesis y coordinar con ingeniería según su experiencia y contexto.</p>
        <ul>
            <li><strong>Generalista UX/UI (MVPs):</strong> prototipo navegable, user flows. Ideal para lanzar y validar rápido.</li>
            <li><strong>UX Researcher:</strong> entrevistas, tests y síntesis de insights. Reduce riesgo.</li>
            <li><strong>Product / UX Designer:</strong> estrategia, prototipos y métricas; conecta negocio y usuario.</li>
            <li><strong>Interaction Designer:</strong> especificaciones de interacción y estados; precisión en micro-experiencias.</li>
            <li><strong>UI / Visual Designer:</strong> kits visuales y mockups hi-fi (alta fidelidad); aumenta confianza visual.</li>
            <li><strong>UX Engineer / Front-end (foco UX):</strong> componentes accesibles y performance.</li>
            <li><strong>Design System Specialist:</strong> tokens y gobernanza.</li>
            <li><strong>Content Designer / UX Writer:</strong> microcopy y arquitectura de contenido.</li>
        </ul>
        <p class="text-center fs-6 my-4 bg-canva p-3">Invertir en UX no es una moda: es la estrategia que hace que tu producto funcione y que tu negocio crezca de forma sostenible.</p>
        <hr class="my-5">
        <h4>Mini-guía rápida según presupuesto</h4>
        <ul>
            <li><strong><em>Startup / MVP:</em></strong> UX+UI generalist — pide prototipo navegable y resultados de 1 experimento.</li>
            <li><strong><em>Scaleup:</em></strong> separar research, product y front-end — pide case studies con métricas.</li>
            <li><strong><em>Enterprise:</em></strong> design system + especialistas — pide snapshots y gobernanza.</li>
        </ul>
        <p>Cada perfil —del generalista al especialista— aporta habilidades concretas que, combinadas con objetivos y métricas, transforman ideas en productos útiles, rápidos de lanzar y fáciles de escalar.</p>
        <hr class="my-5">
        <div class="bg-canva p-5">
            <h4 class="text-center fontpoppins-semibold pb-4 opacity-100">FAQ´s</h4>
            <p><strong>¿Cómo calculo el ROI de UX?</strong></p>
            <p>ROI = (Beneficio neto — Inversión) / Inversión × 100. Beneficio neto = ingresos adicionales + ahorros operativos.</p>
            <hr>
            <p><strong>¿Qué KPI inicio para e-commerce?</strong></p>
            <p>Tasa de conversión por paso, AOV (average order value), tasa de abandono del carrito y tiempo hasta compra.</p>
            <hr>
            <p><strong>¿Por qué invertir en UX es relevante para mi empresa y equipo de trabajo?</strong></p>
            <p>Porque reduce obstáculos y costos, aumenta conversiones y velocidad de entrega, y convierte decisiones en resultados medibles.</p>
        </div>
        <hr class="my-5">
        <h2 class="mt-5 fontpoppins opacity-100">Mis 3 Aprendizajes Clave</h2>
        <ol>
            <li>Medir convierte UX en evidencia: sin línea base no hay historia creíble.</li>
            <li>Pequeños experimentos valen mucho: tres iteraciones controladas superan muchas opiniones.</li>
            <li>El ahorro operativo acelera decisiones: menos consultas y menos correcciones convierten inversión en retorno.</li>
        </ol>
        <hr class="my-5">
        <p><em>Invertir en UX no es un gasto estético: es la estrategia que reduce obstáculos, acelera decisiones de compra y hace que tu negocio crezca de forma sostenible — y eso se puede probar con números.</em></p>
      `,
      // ← Aquí las relaciones
      relatedArticles: [
        { id: "6", title: "Investigación UX que Transforma Productos" },
        { id: "11", title: "Iteraciones Rápidas: Prototipado que Minimiza Riesgos" },
        { id: "12", title: "Integrando IA en tu Proceso de Diseño" }
      ],
      relatedProjects: [
        {
          title: "Video Promocional Premio CBC",
          url: "https://www.instagram.com/reel/C687uy6MFee/?utm_source=ig_web_copy_link"
        },
        {
          title: "Plantillas de Social Media para Doble Espiral Academia",
          url: "landing-projects-d-dobleEspiral.html"
        },
        {
          title: "Dashboard Responsivo para Banco Comafi",
          url: "https://www.behance.net/gallery/229563933/Diseno-y-Prototipado-Front-end-de-Dashboard"
        }
      ]
    },
    "9": {
      id: 9,
      titleHTML: `
        Herramientas de Diseño: 
        <span class="opacity-70"> Cómo Elegir la Mejor para Tu Equipo</span>
      `,
      date: "18 de julio, 2025",
      imagenDesktop: "assets/img/hero-article/Articulo9/img-article-9-3840@2x.webp",
      imagenMobile: "assets/img/hero-article/Articulo9/img-article-9-750@2x.webp",
      ogImage: "mi-portafolio/assets/img/og-images/og-article-9@2x.webp",
      aboutHTML: `
        <span class="opacity-70">
          Soy Macarena, <strong>Product & UX Designer.</strong>
          He adaptado herramientas y flujos según contexto y objetivos, buscando siempre que el equipo gane autonomía y velocidad.
          Cuando no estoy utilizando herramientas de diseño, me puedes encontrar disfrutando de un pastel de frutos del bosque con una infusión de rooibos.
        </span>
      `,
      imageUrl: "assets/img/coveraboutme/avatar-3-400@2x.webp",
      imageAlt: "Imagen de mí",
      content: `
          <p>La mejor herramienta no es la más popular: es la que tu equipo domina y que resuelve objetivos reales. Elegir mal no solo genera incomodidad: frena proyectos, provoca demoras evitables y reduce la autonomía del equipo.</p>
          <hr class="my-5">
          <h2 class="mt-5 fontpoppins opacity-100">Problema</h2>
          <p>He visto equipos adoptar herramientas por moda o por preferencia del líder, sin medir impacto real. El resultado: curvas de aprendizaje largas, frustración, demoras y gasto inútil en licencias. Si no ligas la elección a resultados concretos, la herramienta deja de ser ayuda y se convierte en obstáculo.</p>
          <hr>
          <h4 class="mt-5 fontpoppins opacity-100">5 pasos para elegir la herramienta correcta</h4>
          <ol>
            <li><strong>Auditoría rápida (30–60 min):</strong> Reúne 4–5 stakeholders (Marketing, Producto, TI, Operaciones, Diseño). Pide 2–3 necesidades por persona y prioriza por impacto × frecuencia. <strong>Resultado:</strong> lista de 3 objetivos prioritarios (ej.: velocidad de publicación, calidad de arte final, integración con dev).</li>
            <li><strong>Define la métrica norte por entregable:</strong> Antes de probar, acuerda qué medirás: tiempo por publicación, tasa de errores en export, tiempo de hand-off, satisfacción del editor (NPS interno). Sin línea base, no hay evidencia.</li>
            <li><strong>Evalúa 4 dimensiones (Matriz)</strong> precisión (¿requiere control técnico o detalle vectorial?), colaboración (¿edición simultánea?), integración (¿export/hand-off a dev o a otros formatos?), coste/curva de aprendizaje (¿vale la inversión por lo que aporta? Prioriza según impacto × frecuencia.).</li>
            <li><strong>Piloto corto (7–14 días) — prueba real + medición:</strong> Selecciona 1 entregable real (post, banner, página o vídeo corto). Mide tiempo por tarea, errores y satisfacción del editor. Repite con 1–2 herramientas si es necesario. Los datos del piloto justifican la decisión.</li>
            <li><strong>Plan de adopción 30/60/90 días:</strong> Licencias, responsable, plantillas, formaciones cortas y métricas de adopción.</li>
          </ol>
          <hr>
          <h4 class="mt-5 fontpoppins opacity-100">Matriz rápida: cuándo elegir cada herramienta</h4>
          <p><strong>Illustrator (Adobe)</strong></p>
          <ul>
            <li>Cuándo: branding, iconografía y arte final que exige precisión.</li>
            <li>Ventaja: control vectorial.</li>
            <li>Contra: curva de aprendizaje y licencia.</li>
          </ul>
          <p><strong>InDesign (Adobe)</strong></p>
          <ul>
            <li>Cuándo: maquetación multipágina (revistas, folletos).</li>
            <li>Ventaja: control tipográfico.</li>
            <li>Contra: colaboración en tiempo real limitada.</li>
          </ul>
          <p><strong>Canva</strong></p>
          <ul>
            <li>Cuándo: equipos no diseñadores y contenidos sociales.</li>
            <li>Ventaja: rapidez y autonomía.</li>
            <li>Contra: control fino para arte final.</li>
          </ul>
          <p><strong>Figma</strong></p>
          <ul>
            <li>Cuándo: interfaces, prototipado y trabajo colaborativo.</li>
            <li>Ventaja: colaboración en vivo y hand-off.</li>
            <li>Contra: no es la herramienta ideal para arte final de impresión.</li>
          </ul>
          <p><strong>CapCut / Premiere Pro</strong></p>
          <ul>
            <li>Cuándo: video rápido vs. producción profesional.</li>
            <li>Ventaja: velocidad móvil (CapCut) o control profesional (Premiere).</li>
            <li>Contra: recurso hardware / curva de uso.</li>
          </ul>
          <p class="text-center fs-6 my-4 bg-canva p-3">"La mejor herramienta no siempre es la más popular: es la que tu equipo domina y que impulsa resultados"</p>
          <hr class="my-5">
          <h2 class="mt-5 fontpoppins opacity-100">Mini-casos</h2>
          <ul>
              <li>
                  <strong><em><a href="https://www.instagram.com/p/DL0pyKUSCg-/?utm_source=ig_web_copy_link" class="a-small-article-green px-1" target="_blank" rel="noopener noreferrer" title="Ver más sobre este Proyecto" data-bs-toggle="tooltip">Plantillas Social Media — Akasha Healing</a>:</em></strong>
                  <p><strong>Reto:</strong> cliente sin equipo ni tiempo para producir contenidos.</p>
                  <p><strong>Acción:</strong> plantillas editables en Canva y guía rápida de uso.</p>
                  <p><strong>Resultado:</strong> coherencia visual inmediata y +30% de engagement.</p>
                  <p><strong>Por qué la herramienta funcionó:</strong> Canva permitió autonomía del cliente y velocidad de publicación sin depender de un diseñador.</p>
              </li>
              <li>
                  <strong><em><a href="https://www.instagram.com/p/DLsRJJ7stBt/?utm_source=ig_web_copy_link" class="a-small-article px-1" target="_blank" rel="noopener noreferrer" title="Ver más sobre este Proyecto" data-bs-toggle="tooltip">Actualizaciones Front-End — CBC (assets y hand-off)</a>:</em></strong>
                  <p><strong>Reto:</strong> inconsistencias en assets y hand-off lento a desarrollo.</p>
                  <p><strong>Acción:</strong> entrega de assets optimizados (SVG, tokens), snippets CSS y prototipo en HTML5/CSS3 para validar interacción.</p>
                  <p><strong>Resultado:</strong> tiempo de gestión interna reducido (10 → 8 minutos) y despliegues más rápidos.</p>
                  <p><strong>Por qué la herramienta funcionó:</strong> Los snippets aceleraron la implementación.</p>
              </li>
          </ul>
          <p class="text-center fs-6 my-4 bg-canva p-3">“La fuerza del equipo reside en cada miembro. La fuerza de cada miembro es el equipo.” — <em>Phil Jackson</em></p>
          <hr class="my-5">
          <div class="bg-canva p-5">
            <h4 class="text-center fontpoppins-semibold pb-4 opacity-100">FAQ´s</h4>
            <p><strong>¿Canva sirve para branding?</strong></p>
            <p>Sí, si se entrega con master files y reglas claras; para pieza final técnico sigue siendo mejor Illustrator.</p>
            <hr>
            <p><strong>¿Cuánto tarda un equipo en adoptar una herramienta?</strong></p>
            <p>Con piloto, plantillas y formación: 30–90 días para adopción estable.</p>
            <hr>
            <p><strong>¿Cómo demuestro retorno de la herramienta?</strong></p>
            <p>Mide tiempo por tarea y % de uso de plantillas antes/después.</p>
          </div>
          <hr class="my-5">
          <h2 class="mt-5 fontpoppins opacity-100">Mis 3 Aprendizajes Clave</h2>
          <ul>
            <li>La mejor herramienta es la que tu equipo domina y que cumple objetivos concretos.</li>
            <li>Pilotos cortos + métricas claras evitan decisiones basadas en opiniones.</li>
            <li>Plantillas y formación breve producen más adopción que manuales extensos.</li>
          </ul>
          <hr>
          <p>Elegir herramientas es decidir cómo trabajará tu equipo cada día. Hazlo con datos, prueba en contexto y prioriza la autonomía de las personas que usarán la herramienta hoy. Si lo acompañas de plantillas y formación corta, la decisión deja de ser un problema y se convierte en una ventaja operativa.</p>
      `,
      // ← Aquí las relaciones
      relatedArticles: [
        { id: "7", title: "Brief de Diseño: Hoja de Ruta para Proyectos Exitosos" },
        { id: "11", title: "Iteraciones Rápidas: Prototipado que Minimiza Riesgos" },
        { id: "4", title: "Laboratorio de Formas: experimentación creativa aplicada al diseño" }
      ],
      relatedProjects: [
        {
          title: "Givit: prototipo interactivo de marketplace",
          url: "https://www.behance.net/gallery/132995601/Diseno-Givit"
        },
        {
          title: "Digital Content Design para FOL",
          url: "https://www.instagram.com/p/DL2m20ksynD/?utm_source=ig_web_copy_link"
        },
        {
          title: "Video Promocional del Premio CBC",
          url: "https://www.instagram.com/reel/C687uy6MFee/?utm_source=ig_web_copy_link"
        }
      ]
    },
    "10": {
      id: 10,
      titleHTML: `
        Brand Kit Eficiente:
        <span class="opacity-70"> Ahorra Tiempo y Consigue Coherencia Visual</span>
      `,
      date: "18 de julio, 2025",
      imagenDesktop: "assets/img/hero-article/Articulo10/img-article-10-3840@2x.webp",
      imagenMobile: "assets/img/hero-article/Articulo10/img-article-10-750@2x.webp",
      ogImage: "mi-portafolio/assets/img/og-images/og-article-10@2x.webp",
      aboutHTML: `
        <span class="opacity-70">
          Soy Macarena, <strong>Product & UX Designer.</strong>
          He ayudado a equipos a ahorrar horas de trabajo y a mantener coherencia visual en múltiples proyectos.
          Cuando no organizo assets, me encontrarás disfrutando de la compañía de un hermoso gatito.
        </span>
      `,
      imageUrl: "assets/img/coveraboutme/avatar-4-400@2x.webp",
      imageAlt: "Imagen de mí",
      content: `
        <p><strong>Un Brand Kit bien pensado no es decoración: es la herramienta que transforma improvisación en velocidad, confianza y profesionalismo.</strong></p>
        <p>He visto propuestas perder impulso por detalles evitables: colores distintos en la misma campaña, tipografías que cambian en cada slide o versiones de logo equivocadas. Esas pequeñas grietas minan la credibilidad. Cuando los recursos están organizados, el equipo gasta su energía en crear valor —no en buscar archivos— y eso se traduce en trabajo más ágil y con mejor resultado.</p>
        <p class="text-center fs-6 my-4 bg-canva p-3">“El diseño es el embajador silencioso de tu marca.” — <em>Paul Rand</em></p>
        <hr class="my-5">
        <h2 class="mt-5 fontpoppins opacity-100">Problema</h2>
        <p>Cuando cada área usa sus propios archivos aparecen inconsistencias: valores de color distintos, tipografías mezcladas y logos en JPG que se pixelan en pantalla. Eso genera correcciones, demoras y una imagen menos profesional frente a clientes y partners. Un Brand Kit y un UI Kit bien diseñados evitan estas fallas y convierten los assets en recursos reutilizables y controlables.</p>
        <hr>
        <h4 class="mb-3">Qué es y por qué funciona</h4>
        <ul>
            <li><strong>Brand System:</strong> una guía viva que reúne paleta exacta (HEX / RGB / CMYK), familias tipográficas, reglas de uso, versiones del logo y tokens. Es la referencia que evita dudas.</li>
            <li><strong>UI Kit:</strong> colección de componentes digitales listos (botones, inputs, cards, iconos SVG), tokens y snippets para desarrollo. Facilita implementar sin inconsistencias.</li>
        </ul>
        <p>Juntos permiten a los equipos implementar más rápido, con menos consultas y sin depender del diseñador en cada pieza.</p>
        <hr class="my-5">
        <h4 class="mb-3 mt-5">Mini-casos</h4>
        <ul>
            <li>
                <strong><em><a href="https://www.instagram.com/p/DLxhfxrxvp_/?utm_source=ig_web_copy_link" class="a-small-article-green px-1" target="_blank" rel="noopener noreferrer" title="Ver más sobre este Proyecto" data-bs-toggle="tooltip">Brand System — CBC</a>:</em></strong>
                <p><strong>Reto:</strong> documentos y piezas con líneas gráficas diferentes entre áreas.</p>
                <p><strong>Acción:</strong> Brand Guide práctico de 10 páginas que unificó paleta, tipografías y reglas.</p>
                <p><strong>Resultado:</strong> equipos alineados, menos preguntas repetidas y plantillas internas listas para usar.</p>
            </li>
            <li>
                <strong><em><a href="landing-projects-d-fol.html" class="a-small-article px-1" target="_blank" rel="noopener noreferrer" title="Ver más sobre este Proyecto" data-bs-toggle="tooltip">Style Guide — FOL</a>:</em></strong>
                <p><strong>Reto:</strong> uso diferente de colores, tipografías e iconos entre Marketing, TI y Ventas.</p>
                <p><strong>Acción:</strong> definí paleta (HEX/RGB), familias tipográficas, iconografía y reglas de aplicación en un documento accesible.</p>
                <p><strong>Resultado:</strong> coherencia inmediata en web y materiales comerciales; menos correcciones y procesos más ágiles.</p>
            </li>
            <li>
                <strong><em><a href="https://www.instagram.com/p/DLnbeYNSgf6/?utm_source=ig_web_copy_link" class="a-small-article-green px-1" target="_blank" rel="noopener noreferrer" title="Ver más sobre este Proyecto" data-bs-toggle="tooltip">Manual OPL — Casona Minka</a>:</em></strong>
                <p><strong>Reto:</strong> identidad externa cuidada, pero procesos internos sin estandarizar.</p>
                <p><strong>Acción:</strong> diseñamos un manual operativo con instrucciones claras para convivencia, procesos y comunicación.</p>
                <p><strong>Resultado:</strong> mayor eficiencia operativa y mejor coordinación entre voluntarios.</p>
            </li>
        </ul>
        <p><strong>Aprendizaje clave de los casos:</strong> centralizar los archivos fuente, entregar componentes prácticos y dedicar 15–30 minutos a capacitar por área hace que un manual deje de ser un documento abandonado y pase a ser una herramienta útil.</p>
        <p class="text-center fs-6 my-4 bg-canva p-3">“El diseño es, en esencia, un acto de comunicación; requiere comprender profundamente a la persona con la que te comunicas.” — <em>Don Norman</em></p>
        <hr class="my-5">
        <h2 class="mt-5 fontpoppins opacity-100">Cómo hacerlo</h2>
        <ol>
            <li>
                <strong><em>Documento central — lo mínimo indispensable</em></strong>
                <ul>
                    <li>Entregable: <em>BrandGuide_v1.pdf</em> + archivos fuente (<em>.ai, .svg</em>).</li>
                    <li>Debe incluir: paleta (HEX + RGB + CMYK), familias tipográficas y pesos, versiones del logo y ejemplos de uso (bien / mal), reglas de espaciado y tamaños mínimos.</li>
                </ul>
            </li>
            <div class="my-4"></div>
            <li>
                <strong><em>UI Kit práctico — en Figma + snippets para devs</em></strong>
                <ul>
                    <li>Entregable: <em>UIKit_v1.fig</em> + <em>code-snippets/</em> con variables CSS/SASS (<em>--brand-primary, --space-16,</em> etc.).</li>
                    <li>Componentes mínimos: botón (variante primaria/secundaria), input con estados, card, header/footer, icon set en SVG.</li>
                </ul>
            </li>
            <div class="my-4"></div>
            <li>
                <strong><em>Tokens y nomenclatura clara</em></strong>
                <ul>
                    <li>Nombres claros y predecibles: <em>--brand-primary, --accent-50, --space-8.</em></li>
                    <li>Versionado: <em>BrandSystem_v1.ai, BrandSystem_v1.1.ai.</em></li>
                </ul>
            </li>
            <li>
                <strong><em>Adopción rápida: micro-workshops (15 min)</em></strong>
                <ul>
                    <li>Una sesión por área (Marketing, Sales, Producto, Dev). Objetivo: mostrar dónde están los assets y practicar un uso real. Material: 1 slide “Cómo usar el Brand Kit en 60 s”.</li>
                </ul>
            </li>
            <li>
                <strong><em>Coordinación mínima</em></strong>
                <ul>
                    <li>Nombra un/a responsable (owner) del Brand Kit.</li>
                    <li>Define canal (Slack/Teams) para consultas y un folder central con permisos.</li>
                    <li>Regla: cualquier cambio al Brand Kit pasa por el owner.</li>
                </ul>
            </li>
        </ol>
        <hr>
        <h4 class="mb-3 mt-5">Métricas para reportar</h4>
        <ul>
            <li><strong>% reducción de errores</strong> por entregable (p. ej. colores / logos incorrectos).</li>
            <li><strong>Tiempo medio de implementación</strong> por asset (antes / después; objetivo: −20–30%).</li>
            <li><strong>% de piezas que usan plantilla oficial</strong> (meta: >80% en 90 días).</li>
            <li><strong>Número de consultas al owner</strong> (esperamos bajar tras 30 días de talleres).</li>
        </ul>
        <p>Estas métricas muestran de forma tangible el impacto del trabajo.</p>
        <hr class="my-5">
        <div class="bg-canva p-5">
            <h4 class="text-center fontpoppins-semibold pb-4 opacity-100">FAQ´s</h4>
            <p><strong>¿Brand Kit o Brand System?</strong></p>
            <p>El <strong>Brand Kit</strong> es una entrega compacta para arrancar rápido (paleta, logos, 2–3 plantillas). El <strong>Brand System</strong> es la versión estructurada y escalable (tokens, componentes, documentación viva). Si necesitas empezar ya, pide un Brand Kit; si quieres control a largo plazo, pide un Brand System.</p>
            <hr>
            <p><strong>¿Cómo hago que el equipo lo use?</strong></p>
            <p>Asigna un owner visible, realiza micro-workshops por área, versiona archivos y mide adopción. Plantillas listas y formación breve generan uso inmediato.</p>
            <hr>
            <p><strong>¿Entregar código listo o solo snippets?</strong></p>
            <p>- Si lanzas con frecuencia: entrega componentes documentados (Storybook) y código listo.</p>
            <p>- Si arrancas rápido: entrega snippets CSS/variables y un prototipo navegable; desarrollo completará la integración.</p>
        </div>
        <hr class="my-5">
        <h2 class="mt-5 fontpoppins opacity-100">Mis 3 Aprendizajes Clave</h2>
        <ol>
            <li>Centralizar assets evita pérdidas de tiempo y errores repetidos.</li>
            <li>Un UI Kit bien pensado acelera entregas y mejora la relación diseño-desarrollo.</li>
            <li>Enseñar en poco tiempo (micro-workshops) es más efectivo que una guía extensa.</li>
        </ol>
        <hr class="my-5">
        <p>La coherencia visual es práctica diaria. Un Brand Kit bien diseñado no solo ahorra tiempo: facilita la comunicación interna, mejora la percepción externa y libera al equipo para crear trabajo con impacto. Empezar por lo esencial y asegurarse de que la gente lo use es lo que realmente marca la diferencia.</p>
      `,
      // ← Aquí las relaciones
      relatedArticles: [
        { id: "2", title: "Coherencia Visual: Estandariza tus Documentos" },
        { id: "1", title: "Diseño que Evoluciona" },
        { id: "7", title: "Brief de Diseño: Hoja de Ruta para Proyectos Exitosos" }
      ],
      relatedProjects: [
        {
          title: "Brand System para FOL Agencia de Valores SpA",
          url: "landing-projects-d-fol.html"
        },
        {
          title: "Identidad Viva: Marca de Hostal Casona Minka",
          url: "https://www.instagram.com/p/DLtYpOKMxqd/?utm_source=ig_web_copy_link"
        },
        {
          title: "Coherencia visual para Doble Espiral Academia",
          url: "landing-projects-d-dobleEspiral.html"
        }
      ]
    },
    "11": {
      id: 11,
      titleHTML: `
        Iteraciones Rápidas:
        <span class="opacity-70"> prototipado que minimiza riesgos</span>
      `,
      date: "18 de julio, 2025",
      imagenDesktop: "assets/img/hero-article/Articulo11/img-article-11-3840@2x.webp",
      imagenMobile: "assets/img/hero-article/Articulo11/img-article-11-750@2x.webp",
      ogImage: "mi-portafolio/assets/img/og-images/og-article-11@2x.webp",
      aboutHTML: `
        <span class="opacity-70">
          Soy Macarena, <strong>Product & UX Designer,</strong>
          y creo que validar rápido es un acto de cuidado: prototipos bien hechos ahorran tiempo y dinero y mantienen la visión del producto. He liderado sprints de prototipado que detectaron problemas críticos antes de escribir código y redujeron semanas de desarrollo.
          Cuando no construyo prototipos, pruebo nuevas herramientas ágiles con un helado Amarena en mano.
        </span>
      `,
      imageUrl: "assets/img/coveraboutme/avatar-5-400@2x.webp",
      imageAlt: "Imagen de mí",
      content: `
        <p><strong>Valida tu idea en días, no en meses. Un prototipo interactivo muestra problemas reales antes de escribir código y evita semanas de trabajo perdido.</strong></p>
        <p><strong>Qué prototipo usar y cuándo?</strong> Usa prototipos <em>click-through</em> (Figma, Adobe XD) para validar flujos, lenguaje y tareas con usuarios —sin programar. Reserva prototipos en HTML/CSS/JS cuando la interacción, el rendimiento o la accesibilidad ya estén validados y necesites comprobar la implementación técnica. En resumen: primero valida la idea; solo después inviertes en código.</p>
        <p>En un lanzamiento, un cliente evitó cualquier experimento y saltó directo a programar. Tras semanas de desarrollo tuvimos que rehacer gran parte. Desde entonces, prototipar temprano dejó de ser una opción: es la forma más barata y rápida de responder a dudas reales.</p>
        <p class="text-center fs-6 my-4 bg-canva p-3">“La transformación ágil no es un proyecto; es un cambio cultural” — <em>Michael Sahota</em></p>
        <hr class="my-5">
        <h2 class="mt-5 fontpoppins opacity-100">Problema</h2>
        <p>Sin prototipado temprano se multiplican los errores: se invierte en código que no funciona, aparecen demoras y los usuarios quedan confundidos por flujos poco claros. Probar antes convierte suposiciones en evidencia y permite tomar decisiones con datos, no con opiniones.</p>
        <hr>
        <h4 class="mb-3 mt-5">Mini-casos</h4>
        <ul>
            <li>
                <strong><em>Formación en Laboratoria — adopción de metodología ágil</em></strong>
                <p><strong>Reto:</strong> cumplir múltiples desafíos diarios con tiempo limitado y sin un método claro.</p>
                <p><strong>Acción:</strong> sprints cortos, roles definidos y hackathons de 24 h para pasar de idea a entrega.</p>
                <p><strong>Resultado:</strong> la práctica se incorporó como rutina; equipos iteran con más disciplina y entregan pruebas funcionales en plazos cortos.</p>
                <p><strong>Aprendizaje:</strong> practicar sprints frecuentes transforma la intención en hábito.</p>
            </li>
            <li>
                <strong><em>Integración en equipos TI — experiencia en FOL</em></strong>
                <p><strong>Reto:</strong> integrarme como diseñadora web en procesos dirigidos por TI.</p>
                <p><strong>Acción:</strong> participé desde el inicio en reuniones, prototipé en HTML5/SASS y trabajé con Scrum.</p>
                <p><strong>Resultado:</strong> colaboración más fluida, mayor responsabilidad en el flujo productivo y prototipos que facilitaron la implementación.</p>
                <p><strong>Aprendizaje:</strong> involucrar a TI desde el prototipo reduce malentendidos y acelera el hand-off técnico.</p>
            </li>
        </ul>
        <p class="text-center fs-6 my-4 bg-canva p-3">“En un equipo Scrum, todos están dando lo máximo siempre, buscando apoyar a sus compañeros en lo que requieran” — <em>Jorge Abad</em></p>
        <hr class="my-5">
        <h2 class="mt-5 fontpoppins opacity-100">Hoja de ruta práctica</h2>
        <p><strong><em>Objetivo general:</em></strong> validar el flujo crítico (registro, compra, onboarding) con usuarios reales y decidir qué construir.</p>
        <h4 class="mb-3 mt-5">Antes del sprint (prep en 1–2 días)</h4>
        <ul>
          <li>Define <strong><em>objetivo</em></strong> del sprint (qué hipótesis pruebas).</li>
          <li>Elige la <strong><em>métrica norte</em></strong> (p. ej. % de tareas completadas, tiempo a completar, errores por paso).</li>
          <li>Recluta 5 usuarios representativos (o usa stakeholders para tests rápidos si no hay tiempo).</li>
          <li>Reserva herramientas: Figma/Adobe XD/ProtoPie y grabación (Zoom, Loom).</li>
        </ul>
        <hr>
        <h4 class="mb-3 mt-5">Día a día (1 week sprint)</h4>
        <ul>
          <li><strong><em>Día 1 — Explorar & mapear:</em></strong> wireframes rápidos y user flows; define alcance.</li>
          <li><strong><em>Día 2 — Diseñar prototipo baja/medio:</em></strong> pantallas clave y hotspots (click-through).</li>
          <li><strong><em>Día 3 — Refinar & preparar test:</em></strong> microcopy y escenarios; guion de test.</li>
          <li><strong><em>Día 4 — Tests con 3–5 usuarios:</em></strong> cada sesión 30–45 min (tarea + entrevista breve). Graba y toma notas.</li>
          <li><strong><em>Día 5 — Sintetizar & plan:</em></strong> prioriza hallazgos (Impacto × Esfuerzo), registra en el changelog y acuerda backlog con desarrollo.</li>
        </ul>
        <hr>
        <h4 class="mb-3 mt-5">Registro de cambios (changelog)</h4>
        <p>Mantén un registro simple (Google Sheets / Notion): fecha — pantalla — cambio — motivo — responsable. Un changelog claro evita repetir trabajo y mantiene alineados diseño y desarrollo.</p>
        <hr>
        <h4 class="mb-3 mt-5">KPIs sugeridos (qué reportar)</h4>
        <ul>
          <li><strong><em>Tasa de éxito</em></strong> por tarea (% usuarios que completan la tarea).</li>
          <li><strong><em>Tiempo medio</em></strong> para completar la tarea (s).</li>
          <li><strong><em>Número de problemas críticos</em></strong> detectados por usuario.</li>
          <li><strong><em>Horas de desarrollo evitadas</em></strong> (estimadas) al corregir en prototipo.</li>
        </ul>
        <p>Registra la línea base y muestra la diferencia pre/post para justificar decisiones.</p>
        <p class="text-center fs-6 my-4 bg-canva p-3">“La forma más costosa de probar tu idea es desarrollar software de calidad de producción” — <em>Jeff Patton</em></p>
        <hr>
        <h4 class="mb-3 mt-5">Herramientas recomendadas</h4>
        <ul>
          <li><strong><em>Prototipado interactivo:</em></strong> Figma, Adobe XD, ProtoPie.</li>
          <li><strong><em>Maquetas planas / arte final:</em></strong> Illustrator, Photoshop.</li>
          <li><strong><em>Testing / reclutamiento:</em></strong> Lookback, Maze, UserTesting.</li>
          <li><strong><em>Documentación / hand-off:</em></strong> Notion, Google Sheets, Storybook (para componentes).</li>
          <li><strong><em>Registro / grabación:</em></strong> Loom, Zoom.</li>
        </ul>
        <p>Si no hay desarrollador disponible, considera no-code (Webflow) o contratación puntual para convertir el prototipo validado en producción; evita programar antes de validar.</p>
        <h4 class="mb-3 mt-5">Testing: automatización + usuarios reales</h4>
        <p>Las herramientas automáticas (Testim, Applitools, Mabl) ayudan a detectar regresiones y asegurar estabilidad técnica, pero no reemplazan la observación con personas. La combinación ideal: datos técnicos + evidencia humana.</p>
        <hr class="my-5">
        <div class="bg-canva p-5">
            <h4 class="text-center fontpoppins-semibold pb-4 opacity-100">FAQ´s</h4>
            <p><strong>¿Por qué 5 usuarios si es una muestra pequeña?</strong></p>
            <p>Cinco usuarios suelen ser suficientes para identificar los problemas más críticos de usabilidad de forma rápida y económica; si aparecen patrones, amplía la muestra en rondas sucesivas.</p>
            <hr>
            <p><strong>¿Qué hacer si no hay presupuesto para usuarios externos?</strong></p>
            <p>Comienza con tests internos y stakeholders representativos; añade al menos 1–2 usuarios externos en la siguiente ronda o usa guerrilla testing para obtener rápida retroalimentación.</p>
            <hr>
            <p><strong>¿Cómo acelerar procesos en empresas donde las decisiones tardan?</strong></p>
            <p>Propón entregas pequeñas y visibles: un tablero (Trello, Miro o incluso Excel), acuerdos breves por reunión y demos rápidas. Pequeños éxitos muestran valor y contagian la práctica.</p>
        </div>
        <hr class="my-5">
        <h2 class="mt-5 fontpoppins opacity-100">Mis 3 Aprendizajes Clave</h2>
        <ol>
            <li>Probar temprano evita trabajo extra: cada problema detectado en prototipo ahorra tiempo de programación.</li>
            <li>Cinco usuarios bien reclutados bastan para revelar la mayoría de los problemas críticos.</li>
            <li>Un registro claro de cambios alinea diseño y desarrollo y evita malentendidos.</li>
        </ol>
        <p class="text-center fs-6 my-4 bg-canva p-3">“Build — Measure — Learn.” — <em>Eric Ries</em></p>
        <p><small>Un recordatorio práctico: convierte tu intuición en experimentos cortos, mide lo que importa y aprende rápido.</small></p>
        <hr class="my-5">
        <p>Prototipar rápido no es solo una técnica: es una forma de cuidar el tiempo de tu equipo y la experiencia de tus usuarios. Convierte la intuición en experimentos cortos, mide lo que importa y ajusta con rapidez. Esa práctica constante reduce errores, mejora decisiones y ayuda a entregar productos que realmente funcionan.</p>
      `,
      // ← Aquí las relaciones
      relatedArticles: [
        { id: "1", title: "Diseño que Evoluciona" },
        { id: "6", title: "Investigación UX que Transforma Productos" },
        { id: "12", title: "Integrando IA en tu Proceso de Diseño" }
      ],
      relatedProjects: [
        {
          title: "Givit: prototipo interactivo de marketplace",
          url: "https://www.behance.net/gallery/132995601/Diseno-Givit"
        },
        {
          title: "Diseño Web & Prototipado de la Sección “Premio CBC”",
          url: "https://www.behance.net/gallery/229571505/rototipado-de-la-Seccion-Premio-CBC"
        },
        {
          title: "Dashboard Responsivo para Banco Comafi",
          url: "https://www.behance.net/gallery/229563933/Diseno-y-Prototipado-Front-end-de-Dashboard"
        }
      ]
    },
    "12": {
      id: 12,
      titleHTML: `
        Integrando IA
        <span class="opacity-70"> en tu Proceso de Diseño</span>
      `,
      date: "18 de julio, 2025",
      imagenDesktop: "assets/img/hero-article/Articulo12/img-article-12-3840@2x.webp",
      imagenMobile: "assets/img/hero-article/Articulo12/img-article-12-750@2x.webp",
      ogImage: "mi-portafolio/assets/img/og-images/og-article-12@2x.webp",
      aboutHTML: `
        <span class="opacity-70">
          Soy Macarena, <strong>Product & UX Designer.</strong>
          Uso IA como herramienta para acelerar tareas y crear más espacio para estrategia y diseño con sentido.
          Cuando no estoy afinando prompts, me encontrarás disfrutando de mi sándwich favorito.
        </span>
      `,
      imageUrl: "assets/img/coveraboutme/avatar-6-400@2x.webp",
      imageAlt: "Imagen de mí",
      content: `
        <p><strong><em>La IA no sustituye al diseñador:</em></strong> automatiza lo repetitivo y libera tiempo para la creatividad y la estrategia. Su verdadero valor aparece cuando se usan prompts documentados, se valida con criterio humano y se miden los resultados (tiempo ahorrado, más variantes para probar, mejores métricas).</p>
        <p>Hace poco pedí a un generador cinco paletas completas en segundos; ese tiempo lo invertí en suavizar contraste y accesibilidad. La lección fue clara: la IA acelera tareas, pero el criterio profesional sigue siendo lo que marca la diferencia.</p>
        <p class="text-center fs-6 my-4 bg-canva p-3">“La mejor manera de predecir el futuro es inventarlo.” — <em>Alan Kay</em></p>
        <hr class="my-5">
        <h2 class="mt-5 fontpoppins opacity-100">Problema</h2>
        <p>Sin una guía y disciplina, la IA puede generar ruido: textos con tonos incompatibles, imágenes que no respetan la identidad y soluciones que fallan en producción. Cuando los equipos no registran sus prompts, pierden la posibilidad de replicar buenos resultados. No se trata de usar IA por moda, sino de integrarla con método: diseñar indicaciones claras, revisar salidas y cuidar la consistencia de las piezas que entregas.</p>
        <hr>
        <h4 class="mb-3 mt-5">Mini-casos</h4>
        <ul>
            <li>
                <strong><em>Mi Mágico Bosque — Social Media</em></strong>
                <p><strong>Reto:</strong> mantener contenido constante con recursos limitados.</p>
                <p><strong>Acción:</strong> la IA generó 12 copys iniciales y 5 propuestas de paleta; yo afiné tono y diseño final en Canva.</p>
                <p><strong>Resultado:</strong> 80% del material listo en un par de horas; mejor consistencia y más interacción.</p>
                <p><strong>Aprendizaje:</strong> la IA acelera producción, pero el juicio humano mantiene la voz.</p>
            </li>
            <li>
                <strong><em>Diseñadora independiente — proceso comercial</em></strong>
                <p><strong>Reto:</strong> escalar oferta de servicios manteniendo calidad en diseño y comunicación.</p>
                <p><strong>Acción:</strong> IA para propuestas iniciales, emails y calendarización; revisión humana y personalización final.</p>
                <p><strong>Resultado:</strong> más clientes recurrentes y menos tiempo de preparación por propuesta.</p>
                <p><strong>Aprendizaje:</strong> automatizar lo repetitivo libera espacio para la relación con el cliente.</p>
            </li>
            <li>
                <strong><em>Elaboración del portafolio — colaboración con IA</em></strong>
                <p><strong>Reto:</strong> condensar trayectoria y suplir áreas menos dominadas (redacción, snippets JS).</p>
                <p><strong>Acción:</strong> IA para variantes de texto, planificación de micro-metas y ejemplos de código; cada salida fue validada y adaptada al stack (HTML5/CSS3).</p>
                <p><strong>Resultado:</strong> avance más rápido y mayor consistencia en el mensaje.</p>
                <p><strong>Aprendizaje:</strong> la IA complementa habilidades, no las sustituye; cuanto mejor el prompt, mejor la salida.</p>
            </li>
        </ul>
        <hr class="my-5">
        <h2 class="mt-5 fontpoppins opacity-100">Dónde aplicar IA</h2>
        <ul>
          <li><strong>Exploración visual y paletas:</strong> genera opciones rápidas para moodboards.</li>
          <li><strong>Microcopy y variantes:</strong> acelera pruebas A/B de CTAs y títulos.</li>
          <li><strong>Prototipado inicial y snippets:</strong> reduce boilerplate (código repetitivo o “plantillas” innecesarias); siempre revisa seguridad y calidad del código.</li>
          <li><strong>Planificación y operaciones internas:</strong> calendarios, plantillas de emails y resúmenes de reuniones.</li>
        </ul>
        <hr>
        <h4 class="mt-5 fontpoppins opacity-100">Pasos prácticos (Qué / Por qué / Cómo)</h4>
        <ol>
            <li><strong><em>Automatiza research visual</em></strong>— <em>Por qué:</em> encuentras tendencias y paletas en minutos. <em>Cómo (prompt ejemplo):</em> “Dame 5 paletas HEX para una UI minimalista orientada a bienestar, con contraste accesible y una opción secundaria para acentos; incluye uso recomendado (fondo / texto / acento).”</li>
            <li><strong><em>Genera microcopy para pruebas</em></strong>— <em>Por qué:</em> acelera testeo y evita bloqueos por redacción. <em>Cómo (prompt ejemplo):</em> “Escribe 6 variantes de CTA para registro dirigido a emprendedoras; tono cordial y directo; 3–5 palabras cada una.”</li>
            <li><strong><em>Usa asistentes de código para prototipos</em></strong>— <em>Por qué:</em> reducen boilerplate y aceleran prototipado. <em>Cómo (prompt ejemplo):</em> “Genera un snippet HTML/CSS para un card responsive con imagen, título y botón; incluye variables CSS para color y spacing.”</li>
            <li><strong><em>Documenta prompts y resultados</em></strong>— <em>Por qué:</em> reproducibilidad y mejora continua. <em>Cómo:</em> guarda prompt, versión del modelo, ejemplos de salida y notas de ajuste en Notion/Google Drive por proyecto.</li>
        </ol>
        <hr>
        <h4 class="mt-5 fontpoppins opacity-100">Herramientas recomendadas</h4>
        <ul>
          <li><strong>Texto:</strong> ChatGPT, Claude, Jasper, Copy.ai — para borradores y variantes; guarda prompts.</li>
          <li><strong>Imágenes:</strong> Midjourney, DALL·E, Stable Diffusion — útiles para moodboards y exploración visual, no para arte final sin revisión.</li>
          <li><strong>Código:</strong> GitHub Copilot, Codeium, Cursor — como base; revisa seguridad y licencias.</li>
          <li><strong>Gestión:</strong> Notion / Google Drive para registrar prompts y resultados.</li>
          <li><strong>Testing:</strong> Testim, Applitools, Mabl para pruebas técnicas; combina con tests con usuarios.</li>
        </ul>
        <hr>
        <h4 class="mt-5 fontpoppins opacity-100">Consideraciones éticas y de calidad</h4>
        <ul>
          <li><strong>Verifica siempre:</strong> la IA puede inventar datos o hechos. No asumas todo correcto.</li>
          <li><strong>Revisa representación:</strong> cuida el lenguaje y las imágenes para evitar imágenes limitantes o imparcialidad en la comunicación.</li>
          <li><strong>Licencias y propiedad:</strong> revisa términos antes de usar imágenes o fragmentos en productos comerciales.</li>
          <li><strong>Privacidad:</strong> no cargues datos sensibles a modelos públicos.</li>
        </ul>
        <hr class="my-5">
        <div class="bg-canva p-5">
            <h4 class="text-center fontpoppins-semibold pb-4 opacity-100">FAQ´s</h4>
            <p><strong>¿La IA reemplazará al diseñador?</strong></p>
            <p>No. La IA automatiza tareas repetitivas y amplifica el juicio; quien valida y aplica el criterio humano sigue siendo esencial.</p>
            <hr>
            <p><strong>¿Cómo evito resultados fuera de tono?</strong></p>
            <p>Define indicaciones claras (audiencia, tono, longitud), pide variantes y edita antes de publicar. Mantén un repositorio de prompts validados.</p>
            <hr>
            <p><strong>¿Qué hago si no tengo presupuesto para herramientas de pago?</strong></p>
            <p>Empieza con versiones gratuitas o pruebas; usa la IA para borradores y prioriza la revisión humana. Documenta resultados para medir impacto antes de invertir.</p>
        </div>
        <hr class="my-5">
        <h2 class="mt-5 fontpoppins opacity-100">Mis 3 Aprendizajes Clave</h2>
        <ol>
            <li>La IA es una herramienta para acelerar y ampliar opciones; el criterio profesional decide qué queda.</li>
            <li>Documentar prompts y resultados convierte la IA en un recurso replicable y escalable.</li>
            <li>Validar siempre con personas: pruebas con usuarios o stakeholders son indispensables antes de lanzar.</li>
        </ol>
        <hr class="my-5">
        <p>La IA ya forma parte de mi flujo de trabajo: me ahorra tiempo y me permite enfocarme en estrategia y calidad. Sigo aprendiendo y documentando lo que funciona para compartirlo con equipos y clientes. La IA potencia mi criterio —no lo reemplaza— y se vuelve una ventaja cuando se usa con método.</p>    
      `,
      // ← Aquí las relaciones
      relatedArticles: [
        { id: "6", title: "Investigación UX que Transforma Productos" },
        { id: "8", title: "El Retorno de Inversión en UX: Por Qué Vale la Pena" },
        { id: "11", title: "Iteraciones Rápidas: Prototipado que Minimiza Riesgos" }
      ],
      relatedProjects: [
        {
          title: "Burbuja de Chatbot para CBC",
          url: "https://www.instagram.com/p/DLnmgKHS9he/?utm_source=ig_web_copy_link"
        },
        {
          title: "Iconografía: tokens para consistencia y agilidad",
          url: "https://www.instagram.com/p/DLvHjKFxHQo/?utm_source=ig_web_copy_link"
        },
        {
          title: "Experiencia Perú: App de Viaje Personalizado",
          url: "https://www.instagram.com/p/DLlB8LtS3GU/?utm_source=ig_web_copy_link"
        }
      ]
    },
    // 
  };
  
// Exponer globalmente si no existe (preserva integraciones que leen window.articles)
  window.articles = window.articles || articles;

  /* ===================== Normalización ===================== */

  /**
   * normaliza campos del artículo para facilitar uso posterior.
   * @param {Object} raw
   * @returns {Object|null}
   */
  function normalizeArticle(raw) {
    if (!raw) return null;
    const a = Object.assign({}, raw);
    a.bannerDesktop = safeText(raw.bannerDesktop || raw.imagenDesktop || raw.banner || raw.imageDesktop || '');
    a.bannerMobile  = safeText(raw.bannerMobile || raw.imagenMobile || raw.bannerMobile || raw.imageMobile || '');
    a.imageUrl      = safeText(raw.imageUrl || raw.image || raw.imagen || '');
    a.imageAlt      = safeText(raw.imageAlt || raw.imageAltText || raw.imagenAlt || '');
    a.dateIso       = toIsoIfPossible(raw.dateIso || raw.date || raw.publishedAt);
    a.titlePlain    = stripHtml(raw.titleHTML || raw.title || '');
    return a;
  }

  const getArticleIdFromSearch = () => new URLSearchParams(window.location.search).get('article') || '1';

  /* ===================== Render Article ===================== */

  /**
   * renderArticle - renderiza el artículo actual en la página (si existe).
   * - Si no existe el artículo, redirige a landing-blog con flag missingArticle=1.
   */
  function renderArticle() {
    const id = getArticleIdFromSearch();
    const raw = (window.articles && window.articles[id]) ? window.articles[id] : null;
    if (!raw) {
      // Redirigir con query param para que el landing muestre modal informativo.
      try { window.location.replace('/landing-blog.html?missingArticle=1'); } catch (e) { /* fallback: nothing */ }
      return;
    }

    const article = normalizeArticle(raw);

    // A) Title: intentionally allows markup (trusted project content).
    // /* REVIEW: innerHTML intencional. Si el contenido proviene de un CMS externo, SANITIZAR con DOMPurify. */
    const titleEl = safeQuery('#article-title');
    if (titleEl) titleEl.innerHTML = raw.titleHTML || raw.title || '';

    // B) Date display (texto)
    const dateEl = safeQuery('#article-date');
    if (dateEl) dateEl.textContent = safeText(raw.date) || '';

    // C) Content: intentional HTML insertion (trusted). REVIEW arriba.
    const contentEl = safeQuery('#article-content');
    if (contentEl) contentEl.innerHTML = raw.content || '';

    // D) About author block (may contain markup)
    const aboutEl = safeQuery('#article-about');
    if (aboutEl) aboutEl.innerHTML = raw.aboutHTML || '';

    /* ===== Build meta description (finalMeta) - prefer explicit metaDescription or derive from content/title ===== */
    const longtail = (raw.longtail || '').trim();
    const providedMeta = (raw.metaDescription || '').trim();
    let finalMeta = providedMeta || truncate(stripHtml(raw.content || ''), 150) || truncate(article.titlePlain || '', 150);

    if (longtail && finalMeta.toLowerCase().indexOf(longtail.toLowerCase()) === -1) {
      const sep = ' — ';
      const allowed = 160 - (sep.length + longtail.length);
      const base = allowed > 0 ? truncate(finalMeta, Math.max(0, allowed)) : '';
      finalMeta = (base ? base + sep : '') + longtail;
      if (finalMeta.length > 160) finalMeta = finalMeta.slice(0, 159) + '…';
    }

    if (finalMeta) {
      try {
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name', 'description'); document.head.appendChild(meta); }
        meta.setAttribute('content', finalMeta);
      } catch (e) { /* ignore */ }
    }

    // UX: mostrando snippet longtail si aplica
    if (longtail && contentEl) {
      try {
        if (!contentEl.querySelector('.longtail-snippet')) {
          const firstP = contentEl.querySelector('p');
          const p = document.createElement('p');
          p.className = 'longtail-snippet small text-muted';
          p.style.marginTop = '0.5rem';
          p.textContent = 'Incluye: ' + longtail + '.';
          if (firstP && firstP.parentNode) firstP.parentNode.insertBefore(p, firstP.nextSibling);
          else contentEl.insertBefore(p, contentEl.firstChild);
        }
      } catch (e) { /* ignore */ }
    }

    /* ===== JSON-LD Article (structured data) ===== */
    try {
      const keywordsArr = Array.isArray(raw.keywords) ? raw.keywords.slice() : [];
      if (longtail && !keywordsArr.some(k => String(k).toLowerCase() === longtail.toLowerCase())) {
        keywordsArr.push(longtail);
      }
      const kw = Array.from(new Map((keywordsArr || []).map(k => [String(k).toLowerCase(), String(k).trim()])).values());

      const authorField = raw.author ? (typeof raw.author === 'string' ? { "@type": "Person", name: raw.author } : (raw.author.name ? Object.assign({ "@type": "Person" }, raw.author) : undefined)) : undefined;
      const datePublishedIso = article.dateIso || undefined;

      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": stripHtml(raw.titleHTML || raw.title || document.title || ''),
        "datePublished": datePublishedIso,
        "author": authorField,
        "mainEntityOfPage": { "@type": "WebPage", "@id": raw.url || (document.querySelector('link[rel=canonical]') && document.querySelector('link[rel=canonical]').href) || location.href },
        "image": article.imageUrl || undefined,
        "keywords": kw.length ? kw.join(', ') : undefined
      };

      // remove undefined fields
      Object.keys(jsonLd).forEach(k => { if (jsonLd[k] === undefined) delete jsonLd[k]; });

      // eliminar script previo generado por este mismo proceso
      const prev = document.querySelector('script[type="application/ld+json"][data-generated="longtail-article"]');
      if (prev) prev.remove();

      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-generated', 'longtail-article');
      s.textContent = JSON.stringify(jsonLd, null, 2);
      document.head.appendChild(s);
    } catch (e) {
      // no bloquear el render por error de JSON-LD
      console.warn('[content-articles] error injecting JSON-LD', e);
    }

    /* ===== Image handling: main avatar / image del artículo ===== */
    try {
      const imgEl = safeQuery('#article-img');
      if (imgEl) {
        const avatarClass = `img-articleavatar-${id}`;
        if (window.ImageHelper && typeof window.ImageHelper.configureImg === 'function') {
          // ImageHelper expected API: configureImg(selector, opts)
          try {
            window.ImageHelper.configureImg('#article-img', {
              className: avatarClass,
              imageMobile: article.imageUrl || article.bannerMobile || '',
              imageDesktop: article.imageUrl || article.bannerDesktop || '',
              alt: article.imageAlt || article.titlePlain || 'Imagen del artículo',
              width: imgEl.getAttribute('width') || 150,
              height: imgEl.getAttribute('height') || 150
            });
          } catch (e) { /* fall back */ }
        } else {
          // Fallback: set src & alt, and try to call responsive loader
          if (article.imageUrl) imgEl.src = article.imageUrl;
          imgEl.alt = article.imageAlt || article.titlePlain || 'Imagen del artículo';
          if (window.responsiveLazyImages && typeof window.responsiveLazyImages.loadImage === 'function') {
            try { window.responsiveLazyImages.loadImage('#article-img'); } catch (e) { /* ignore */ }
          }
        }
      }
    } catch (e) { /* ignore */ }

    /* ===== Related / projects lists (DOM safe creation) ===== */
    try {
      const artList = safeQuery('#related-articles');
      if (artList) {
        while (artList.firstChild) artList.removeChild(artList.firstChild);
        if (Array.isArray(raw.relatedArticles)) {
          raw.relatedArticles.forEach(item => {
            const li = document.createElement('li');
            const href = item.url ? item.url : ('landing-blog-article.html?article=' + encodeURIComponent(String(item.id || '')));
            li.appendChild(createSafeLink(href, item.title || 'Artículo relacionado', /^https?:\/\//i.test(href)));
            artList.appendChild(li);
          });
        }
      }
    } catch (e) { /* ignore */ }

    try {
      const projList = safeQuery('#related-projects');
      if (projList) {
        while (projList.firstChild) projList.removeChild(projList.firstChild);
        if (Array.isArray(raw.relatedProjects)) {
          raw.relatedProjects.forEach(item => {
            const li = document.createElement('li');
            const isExternal = safeText(item.url).startsWith('http');
            li.appendChild(createSafeLink(item.url || '#', item.title || 'Proyecto', isExternal));
            projList.appendChild(li);
          });
        }
      }
    } catch (e) { /* ignore */ }

    /* ===== Document title, OG and canonical tags (defensive) ===== */
    try {
      const titleForDoc = article.titlePlain ? `${article.titlePlain} – Macarena Baltra` : document.title;
      document.title = titleForDoc;
      const titleNode = safeQuery('#page-title'); if (titleNode) titleNode.textContent = titleForDoc;

      const setMetaAttr = (attrName, value, isProperty = true) => {
        if (!value) return;
        const selector = isProperty ? `meta[property="${attrName}"]` : `meta[name="${attrName}"]`;
        let el = document.querySelector(selector);
        if (el) el.setAttribute('content', value);
        else {
          el = document.createElement('meta');
          if (isProperty) el.setAttribute('property', attrName);
          else el.setAttribute('name', attrName);
          el.setAttribute('content', value);
          document.head.appendChild(el);
        }
      };

      const ogTitle = raw.title || article.titlePlain || document.title;
      const ogDescription = raw.description || finalMeta || '';
      const ogUrl = raw.url || location.href;
      const ogImage = safeText(raw.ogImage || article.bannerDesktop || article.imagenDesktop || article.imageUrl || (location.origin + '/assets/img/og-image/og-article-default_v1.webp'));
      const ogImageType = ogImage.endsWith('.webp') ? 'image/webp' : (ogImage.endsWith('.png') ? 'image/png' : 'image/jpeg');

      setMetaAttr('og:type', 'article');
      setMetaAttr('og:locale', 'es_CL');
      setMetaAttr('og:site_name', 'Macarena Baltra');
      setMetaAttr('og:title', ogTitle);
      setMetaAttr('og:description', ogDescription);
      setMetaAttr('og:url', ogUrl);
      setMetaAttr('og:image', ogImage);
      setMetaAttr('og:image:secure_url', ogImage);
      setMetaAttr('og:image:type', ogImageType);
      setMetaAttr('og:image:width', '1200');
      setMetaAttr('og:image:height', '630');
      setMetaAttr('og:image:alt', raw.imageAlt || (article.titlePlain + ' — Macarena Baltra'));

      setMetaAttr('twitter:card', 'summary_large_image', false);
      setMetaAttr('twitter:title', ogTitle, false);
      setMetaAttr('twitter:description', ogDescription, false);
      setMetaAttr('twitter:image', ogImage, false);
      setMetaAttr('twitter:image:alt', raw.imageAlt || (article.titlePlain + ' — Macarena Baltra'), false);

      let canon = document.querySelector('link[rel="canonical"]');
      if (!canon) { canon = document.createElement('link'); canon.rel = 'canonical'; document.head.appendChild(canon); }
      if (raw.url) canon.href = raw.url;
    } catch (e) { /* ignore meta update errors */ }
  } // end renderArticle

  /* ===================== Banner injector (hero) ===================== */
  (function bannerInjector() {
    const BASE_PATH = 'assets/img/hero-article/';
    const NAME_PATTERN = id => `img-article-${id}`;
    const EXTENSIONS = ['webp', 'png', 'jpg'];

    function buildCandidates(id, isMobile) {
      const base = `${BASE_PATH}${NAME_PATTERN(id)}${isMobile ? '-s' : ''}`;
      const dpr = (window.devicePixelRatio || 1) >= 1.5;
      const candidates = [];
      if (dpr) EXTENSIONS.forEach(ext => candidates.push(`${base}@2x.${ext}`));
      EXTENSIONS.forEach(ext => candidates.push(`${base}.${ext}`));
      return candidates;
    }

    function findFirstWorking(urls) {
      return new Promise(resolve => {
        let idx = 0;
        function tryNext() {
          if (idx >= urls.length) return resolve(null);
          const url = urls[idx++];
          const img = new Image();
          img.onload = () => resolve(url);
          img.onerror = tryNext;
          img.src = url;
        }
        tryNext();
      });
    }

    const getArticleId = () => new URLSearchParams(window.location.search).get('article') || '1';

    function getPathsFromArticlesObject(id) {
      try {
        if (window.articles && window.articles[id]) {
          const art = window.articles[id];
          return {
            desktop: art.bannerDesktop || art.imagenDesktop || art.banner || null,
            mobile: art.bannerMobile || art.imagenMobile || art.bannerMobile || null
          };
        }
      } catch (e) { /* ignore */ }
      return null;
    }

    async function injectBanner() {
      const id = getArticleId();
      const placeholder = safeQuery('#article-banner-placeholder');
      if (!placeholder) return;

      // ensure hero element
      let bannerEl = placeholder.querySelector('.hero-banner');
      if (!bannerEl) {
        bannerEl = document.createElement('div');
        bannerEl.className = 'hero-banner loading';
        const altImg = document.createElement('img');
        altImg.className = 'hero-alt-img d-none';
        altImg.alt = '';
        bannerEl.appendChild(altImg);
        placeholder.appendChild(bannerEl);
      }

      // Preferir rutas definidas en articles object
      const fromObj = getPathsFromArticlesObject(id);
      if (fromObj && (fromObj.desktop || fromObj.mobile)) {
        const choose = (window.innerWidth < 768) ? (fromObj.mobile || fromObj.desktop) : (fromObj.desktop || fromObj.mobile);
        const bannerClass = `img-bannerarticle-${id}`;
        if (window.ImageHelper && typeof window.ImageHelper.createBackgroundClass === 'function') {
          try {
            window.ImageHelper.createBackgroundClass(bannerClass, { imageMobile: fromObj.mobile || fromObj.desktop, imageDesktop: fromObj.desktop || fromObj.mobile });
            bannerEl.classList.add(bannerClass);
            const altImg = bannerEl.querySelector('.hero-alt-img'); if (altImg) altImg.src = choose;
            bannerEl.classList.remove('loading'); bannerEl.classList.add('loaded');
            return;
          } catch (e) { /* fallback to inline style below */ }
        }
        try {
          bannerEl.style.backgroundImage = `url("${choose}")`;
          const altImg = bannerEl.querySelector('.hero-alt-img'); if (altImg) altImg.src = choose;
          bannerEl.classList.remove('loading'); bannerEl.classList.add('loaded');
        } catch (e) { bannerEl.classList.remove('loading'); bannerEl.classList.add('loaded'); }
        return;
      }

      // Fallback: try candidates by naming convention (async)
      try {
        const isMobile = window.innerWidth < 768;
        const candidates = buildCandidates(id, isMobile);
        const working = await findFirstWorking(candidates);
        if (working) {
          bannerEl.style.backgroundImage = `url("${working}")`;
          const altImg = bannerEl.querySelector('.hero-alt-img'); if (altImg) altImg.src = working;
          bannerEl.classList.remove('loading'); bannerEl.classList.add('loaded');
          return;
        }
        const workingOpp = await findFirstWorking(buildCandidates(id, !isMobile));
        if (workingOpp) {
          bannerEl.style.backgroundImage = `url("${workingOpp}")`;
          const altImg = bannerEl.querySelector('.hero-alt-img'); if (altImg) altImg.src = workingOpp;
          bannerEl.classList.remove('loading'); bannerEl.classList.add('loaded');
          return;
        }
      } catch (e) { /* ignore image detection errors */ }

      // final: mark loaded but no image
      bannerEl.classList.remove('loading'); bannerEl.classList.add('loaded');
      console.warn('[BannerInjector] no se encontraron imágenes para article id=', id);
    }

    // inicial y on resize (debounced)
    const runInject = () => { document.addEventListener('DOMContentLoaded', injectBanner); };
    runInject();
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => injectBanner(), 300);
    });
  })();

  /* ===================== Latest / Tags helpers ===================== */

  function fillLatestArticles(latestArticles) {
    if (!Array.isArray(latestArticles)) return;
    const latestList = safeQuery('#latest-articles');
    if (!latestList) return;
    while (latestList.firstChild) latestList.removeChild(latestList.firstChild);
    latestArticles.forEach(item => {
      const li = document.createElement('li');
      const href = item.url || ('landing-blog-article.html?article=' + encodeURIComponent(String(item.id || '')));
      li.appendChild(createSafeLink(href, item.title || href, /^https?:\/\//i.test(href)));
      latestList.appendChild(li);
    });
  }

  function renderTagsForArticle(article) {
    if (!article || !Array.isArray(article.tags)) return;
    const tagsList = safeQuery('#article-tags');
    if (!tagsList) return;
    while (tagsList.firstChild) tagsList.removeChild(tagsList.firstChild);
    article.tags.forEach(tag => {
      const li = document.createElement('li');
      li.textContent = tag;
      tagsList.appendChild(li);
    });
  }

  /* ===================== Init (DOMContentLoaded) ===================== */
  document.addEventListener('DOMContentLoaded', function () {
    try { renderArticle(); } catch (e) { console.error('[content-articles] renderArticle failed', e); }

    // Inicializar tooltips si bootstrap está disponible
    try {
      if (window.bootstrap && typeof window.bootstrap.Tooltip === 'function') {
        safeQueryAll('[data-bs-toggle="tooltip"]').forEach(el => {
          try { new bootstrap.Tooltip(el); } catch (e) { /* ignore */ }
        });
      }
    } catch (e) { /* ignore */ }

    // Optional: latest articles
    try { if (Array.isArray(window.latestArticles)) fillLatestArticles(window.latestArticles); } catch (e) { /* ignore */ }

    // Render tags for current article if available
    try {
      const id = new URLSearchParams(window.location.search).get('article') || '1';
      const raw = window.articles && window.articles[id];
      if (raw) renderTagsForArticle(raw);
    } catch (e) { /* ignore */ }

    // If responsiveLazyImages is present, attempt to load the article image
    try {
      const mainImg = safeQuery('#article-img');
      if (mainImg && window.responsiveLazyImages && typeof window.responsiveLazyImages.loadImage === 'function') {
        try { window.responsiveLazyImages.loadImage('#article-img'); } catch (e) { /* ignore */ }
      }
    } catch (e) { /* ignore */ }
  });

})();