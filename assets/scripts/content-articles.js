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
        Diseño que evoluciona:
        <span class="opacity-70">cómo actualizar front-end e identidad sin romper lo que ya funciona</span>
      `,
      date: "22 de mayo, 2026",
      imagenDesktop: "assets/img/hero-article/Articulo1/img-article-1-3840@2x.webp",
      imagenMobile: "assets/img/hero-article/Articulo1/img-article-1-750@2x.webp",
      ogImage: "mi-portafolio/assets/img/og-images/og-article-1@2x.webp",
      aboutHTML: `
        <span class="opacity-70">
          Soy Macarena, <strong>UX/UI Designer & Front-End Prototyper.</strong>
          He entregado más de 40 proyectos listos para producción combinando diseño,
          código y documentación. Creo que proteger la inversión de una marca empieza
          por mantenerla actualizada — técnica y visualmente.
          Cuando no trabajo, pruebo paletas con un Matcha Latte en mano.
        </span>
      `,
      imageUrl: "assets/img/coveraboutme/avatar-1-400@2x.webp",
      imageAlt: "Imagen de mí",
      content: `
        <p>
          En uno de mis primeros proyectos profesionales abrí el repositorio de un sitio
          que llevaba años sin tocarse. Layout con tablas, imágenes sin comprimir, cero
          etiquetas semánticas. El equipo lo sabía, pero nadie había podido justificar
          el costo de cambiarlo. Mientras lo revisaba, pensé: <em>esto no es solo deuda
          técnica, es una decisión que alguien tomó cada vez que eligió no actuar.</em>
        </p>
        <p>
          Posponer una actualización no es una decisión neutral. Es una decisión activa
          de quedarse atrás — y afecta el SEO, la experiencia móvil y, silenciosamente,
          la confianza de quienes visitan el sitio.
        </p>
        <p>
          Aquí comparto lo que aprendí modernizando proyectos reales: pasos prácticos,
          mini-casos con métricas concretas y una forma de actualizar con foco en
          resultados — sin empezar de cero.
        </p>
    
        <p class="text-center fs-6 my-4 bg-canva p-3">
          "El diseño no es solo cómo se ve y cómo se siente. El diseño es cómo funciona."
          — <em>Steve Jobs</em>
        </p>
    
        <hr>
    
        <h2 class="mt-5 fontpoppins opacity-100">El problema</h2>
    
        <p>
          Velocidad, accesibilidad, comportamiento móvil — los buscadores y los usuarios
          lo exigen hoy. Cuando una web no responde a eso, las consecuencias son concretas:
          <strong>más abandonos, menos conversiones, posicionamiento orgánico que se erosiona
          despacio y una percepción de marca que empieza a quedar vieja.</strong>
        </p>
        <p>
          No hace falta estar en crisis para actualizar. Hace falta el hábito de revisar
          antes de que el problema se vuelva visible y urgente.
        </p>
    
        <hr>
    
        <h4 class="mb-3">Mini-casos</h4>
    
        <ul>
    
          <li class="mb-5">
            <strong><em>
              <a
                href="landing-projects-d-CBC.html"
                class="a-small-article-green px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver más sobre este Proyecto"
                data-bs-toggle="tooltip"
              >CBC — De los 90s a la era responsive (2020)</a>:
            </em></strong>
    
            <p>
              El sitio había sido diseñado para escritorio y casi nunca tocado. En móvil,
              los usuarios abandonaban antes de llegar a los formularios clave. Empezamos
              por donde duele: Analytics y mapas de calor para entender qué flujos importaban
              al negocio — no solo cuáles se veían mal.
            </p>
            <p>
              Prototipos mobile-first en HTML5/CSS3, pruebas rápidas con usuarios internos,
              migración a etiquetas semánticas y reorganización de contenidos.
              <strong>El resultado fue menos rebote y navegación más fluida</strong>
              — medido con comparativa en Analytics antes y después.
            </p>
            <p class="textdescriptions">
              <small>
                <strong>Lo que aprendí:</strong> las mejoras que impactan al negocio primero
                (formularios, onboarding) justifican la inversión mucho más rápido que las estéticas.
              </small>
            </p>
            <p class="textdescriptions">
              <small>
                <strong>Cómo se midió:</strong> análisis comparativo en Google Analytics y
                mapas de calor antes y después, priorizando secciones críticas del funnel móvil.
              </small>
            </p>
          </li>
    
          <li class="mb-5">
            <strong><em>
              <a
                href="https://www.instagram.com/p/DLsRJJ7stBt/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
                class="a-small-article px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver más sobre este Proyecto"
                data-bs-toggle="tooltip"
              >CBC — Actualizaciones front-end (plataforma)</a>:
            </em></strong>
    
            <p>
              Pantallas sobrecargadas y flujos confusos que el equipo interno tampoco
              entendía del todo bien.
            </p>
            <p>
              Mapeamos con stakeholders, prototipamos de baja a alta fidelidad y probamos
              con usuarios internos. Creamos una librería de componentes en HTML/CSS
              alineada al Brand System.
            </p>
            <p>
              <strong>Resultado:</strong> formularios reestructurados, componentes
              reutilizables y procesos internos más ágiles.
            </p>
            <p class="textdescriptions">
              <small>
                <strong>Lo que aprendí:</strong> documentar componentes (Storybook o similar)
                acelera la colaboración y reduce dudas en el handoff. Esa documentación vale
                más de lo que parece cuando el equipo crece.
              </small>
            </p>
          </li>
    
          <li class="mb-5">
            <strong><em>
              <a
                href="https://www.behance.net/gallery/229753651/Rebranding-de-Full-Graphic-Impresores-%282014%29"
                class="a-small-article-green px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver más sobre este Proyecto"
                data-bs-toggle="tooltip"
              >Full Graphic Impresores — Rebranding</a>:
            </em></strong>
    
            <p>
              Identidad solo en JPG, sin archivos fuente ni paleta digital.
              Cada pieza nueva era una adivinanza.
            </p>
            <p>
              Vectorizamos (.ai/.svg), mapeamos Pantone/CMYK a HEX/RGB
              y establecimos reglas de uso claras.
            </p>
            <p>
              <strong>Resultado:</strong> coherencia visual en digital e impreso,
              mejor legibilidad en pantallas pequeñas y piezas comerciales más efectivas.
            </p>
            <p class="textdescriptions">
              <small>
                <strong>Lo que aprendí:</strong> entregar master files y reglas claras
                evita errores que se repiten — y libera al equipo para crear en vez de corregir.
              </small>
            </p>
          </li>
    
        </ul>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">
          Propuesta práctica: evita el "efecto dinosaurio" digital
        </h2>
    
        <p>
          Tres prácticas que no requieren reinventar el proceso —
          solo incorporarlas con disciplina:
        </p>
    
        <ol>
    
          <li>
            <strong><em>Auditorías semestrales (front-end + UX/UI)</em></strong>
            <p><em>Qué:</em> revisiones programadas de código, rendimiento, accesibilidad y flujos.</p>
            <p>
              <em>Por qué:</em> previenes deuda técnica acumulada y proteges SEO y conversiones
              antes de que el daño sea visible.
            </p>
            <p>
              <em>Cómo:</em> combina escaneos automáticos con revisiones manuales en dispositivos
              reales. Herramientas: Stylelint, validadores W3C y Lighthouse.
            </p>
          </li>
    
          <div class="my-5"></div>
    
          <li>
            <strong><em>Revisiones periódicas de identidad visual</em></strong>
            <p><em>Qué:</em> evaluar logo, paleta, tipografías y tono con la misma frecuencia que el código.</p>
            <p>
              <em>Por qué:</em> la coherencia visual genera confianza;
              la inconsistencia confunde — y la confianza se construye o se pierde en cada pieza.
            </p>
            <p>
              <em>Cómo:</em> normaliza archivos fuente (.ai/.svg), mapea Pantone → HEX/RGB
              y documenta reglas en un Brand System. Las tipografías variables además
              ahorran peso y mejoran rendimiento.
            </p>
          </li>
    
          <div class="my-5"></div>
    
          <li>
            <strong><em>Componentes y estilos reutilizables</em></strong>
            <p>
              <em>Qué:</em> librería sistematizada (botones, inputs, cards)
              y variables (Sass/CSS tokens).
            </p>
            <p>
              <em>Por qué:</em> acelera el desarrollo, asegura coherencia y facilita pruebas.
              El equipo deja de tomar decisiones de estilo en cada entrega.
            </p>
            <p>
              <em>Cómo:</em> define un stack y documenta.
              Sass modular + Storybook es una combinación que funciona bien en proyectos medianos.
            </p>
          </li>
    
        </ol>
    
        <!-- Banner E-Book Memoria Emocional -->
        <div id="banner-ebook-price-memoriaemocional" class="d-none"></div>
        <!-- Banner E-Book Memoria Emocional -->
    
        <hr class="my-5">
    
        <div class="bg-canva p-5">
    
          <h4 class="text-center fontpoppins-semibold pb-4 opacity-100">FAQ´s</h4>
    
          <p><strong>¿Cuánto tiempo para ver mejoras tangibles?</strong></p>
          <p>
            Quick wins: 2–8 semanas. Reestructuras o migraciones: 2–6 meses.
            Proyectos mayores: 3–12 meses. Lo importante es medir desde la línea base
            — tasa de rebote, conversiones — y reportar por sprint, no al final.
          </p>
    
          <hr>
    
          <p><strong>¿Puedo modernizar sin perder la memoria visual de la marca?</strong></p>
          <p>
            Sí. Modernizar no es borrar — es actualizar con cuidado. Documenta la identidad,
            crea componentes que respeten lo que la marca ya comunica emocionalmente
            y mejora accesibilidad y rendimiento sin sacrificar reconocimiento.
          </p>
    
          <hr>
    
          <p><strong>¿Qué documentación entregar?</strong></p>
          <p>
            Master files (.ai/.svg), tokens y variables CSS/Sass, ejemplos de uso
            y un repositorio de componentes. Un Storybook o una carpeta con snippets
            y guías es suficiente para empezar.
          </p>
    
        </div>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">Mis 3 aprendizajes clave</h2>
    
        <ol>
          <li>
            Revisar cada seis meses evita que la deuda técnica se acumule hasta el punto
            en que ya no hay vuelta atrás sin costo alto.
          </li>
          <li>
            Mejorar progresivamente funciona mejor que reescribir todo.
            Moderniza sin borrar la memoria emocional de la marca.
          </li>
          <li>
            Documentar no es opcional. Una librería de componentes y un Brand System
            permiten iterar con coherencia aunque el equipo cambie.
          </li>
        </ol>
    
        <hr class="my-5">
    
        <p>
          "Sigue funcionando" es la frase más cara del producto digital.
          La tecnología cambia, las expectativas también y los usuarios no esperan.
        </p>
        <p>
          Actualizar no significa empezar de cero — significa priorizar lo que aporta
          valor real, documentar para no repetir el trabajo y construir la capacidad
          de seguir mejorando sin necesitar una crisis para justificarlo.
          Eso lo aprendí abriendo repositorios viejos, no leyendo sobre ellos.
        </p>
      `,
      relatedArticles: [
        { id: "11", title: "Iteraciones Rápidas: Prototipado que Minimiza Riesgos" },
        { id: "6",  title: "Investigación UX: mapas, A/B y observación en contexto" },
        { id: "12", title: "Colabora con IA: en tu Proceso de Diseño" }
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
 
  // ─────────────────────────────────────────────────────────────────────────────
 
  "2": {
    id: 2,
    titleHTML: `
      Coherencia Visual:
      <span class="opacity-70">estandariza tus Documentos</span>
    `,
    date: "22 de mayo, 2026",
    imagenDesktop: "assets/img/hero-article/Articulo2/img-article-2-3840@2x.webp",
    imagenMobile: "assets/img/hero-article/Articulo2/img-article-2-750@2x.webp",
    ogImage: "mi-portafolio/assets/img/og-images/og-article-2@2x.webp",
    aboutHTML: `
      <span class="opacity-70">
        Soy Macarena, <strong>UX/UI Designer & Front-End Prototyper.</strong>
        He estandarizado documentos y Brand Systems en organizaciones de distintos tamaños.
        Cuando no diseño, pruebo paletas con mi jugo de zanahoria favorito en mano.
      </span>
    `,
    imageUrl: "assets/img/coveraboutme/avatar-2-400@2x.webp",
    imageAlt: "Imagen de mí",
    content: `
      <p>
        Una vez le entregué a una clienta un manual de documentos y me dijo: "Esto lo
        entiendo yo y lo entiende mi equipo." Esa frase vale más que cualquier elogio estético.
        Porque el problema con la coherencia visual no es de mala voluntad — es de sistema.
        Cuando no hay reglas claras, cada persona interpreta la marca desde su propio lugar
        y, poco a poco, los documentos empiezan a contar historias distintas.
      </p>
      <p>
        Folletos con tipografías distintas, logos en versiones viejas, presentaciones
        que no se parecen entre sí. No es solo un fallo estético: confunde al cliente
        y desgasta la confianza. Un logo bonito no basta. La coherencia en cada pieza
        — impresa o digital — sostiene la reputación de una organización.
      </p>
      <p>
        Aquí comparto un plan práctico basado en proyectos reales: qué incluir,
        cómo enseñarlo y qué entregar para que el equipo lo use de verdad.
      </p>
 
      <hr>
 
      <p class="text-center fs-6 my-4 bg-canva p-3">
        "Un buen diseño es el mínimo diseño posible." — <em>Dieter Rams</em>
      </p>
 
      <h2 class="mt-5 fontpoppins opacity-100">Problema</h2>
 
      <p>En muchas organizaciones los documentos nacen en manos distintas sin una guía clara. El resultado:</p>
      <ul>
        <li><strong><em>Percepción dispersa:</em></strong> el público no identifica un mismo lenguaje visual.</li>
        <li><strong><em>Versiones antiguas circulando:</em></strong> logos en JPG y paletas desalineadas.</li>
        <li><strong><em>Pérdida de tiempo:</em></strong> correcciones manuales y cuellos de botella en aprobaciones.</li>
      </ul>
      <p>
        La solución no es un manual eterno: es un sistema usable — breve, visual
        y con plantillas que el equipo realmente use.
      </p>
 
      <hr class="my-5">
 
      <h4 class="mb-3">Casos prácticos — qué hicimos y por qué funcionó</h4>
 
      <ul>
 
        <li class="mb-5">
          <p>
            <strong><em>
              <a
                href="https://www.instagram.com/p/DLirllmSpai/?utm_source=ig_web_copy_link"
                class="a-small-article px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver más sobre este Proyecto"
                data-bs-toggle="tooltip"
              >CBC — Manual de Documentos (2020)</a>:
            </em></strong>
          </p>
          <strong>Reto:</strong> materiales inconsistentes y muchas correcciones.
          <br><strong>Acción:</strong> manual práctico + plantillas para presentaciones y reportes.
          <br><strong>Resultado:</strong> entregables alineados entre áreas y menos rondas de revisión.
          <p><strong>Aprendizaje:</strong> un documento corto y plantillas prácticas aceleran la publicación.</p>
        </li>
 
        <li class="mb-5">
          <p>
            <strong><em>
              <a
                href="https://www.instagram.com/p/DLnbeYNSgf6/?utm_source=ig_web_copy_link"
                class="a-small-article-green px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver más sobre este Proyecto"
                data-bs-toggle="tooltip"
              >Casona Minka — Manual OPL (2019)</a>:
            </em></strong>
          </p>
          <strong>Reto:</strong> caos operativo por falta de reglas claras.
          <br><strong>Acción:</strong> manual operativo y talleres express con equipos.
          <br><strong>Resultado:</strong> procesos más fluidos, onboarding más claro y experiencia coherente para huéspedes.
          <p><strong>Aprendizaje:</strong> los talleres cortos garantizan adopción y uso real del manual.</p>
        </li>
 
        <li class="mb-5">
          <p>
            <strong><em>
              <a
                href="landing-projects-d-fol.html"
                class="a-small-article-green px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver más sobre este Proyecto"
                data-bs-toggle="tooltip"
              >FOL — Brand System</a>:
            </em></strong>
          </p>
          <strong>Reto:</strong> uso inconsistente de colores, tipografías e iconos.
          <br><strong>Acción:</strong> guía con paleta (HEX/RGB), tipografías y reglas de uso; entrega de snippets y assets.
          <br><strong>Resultado:</strong> menos dudas entre equipos y lanzamientos más ágiles.
          <p><strong>Aprendizaje:</strong> entregar assets listos (master files) reduce consultas y acelera ejecución.</p>
        </li>
 
      </ul>
 
      <p class="text-center fs-6 my-4 bg-canva p-3">
        En todos los casos la clave fue: <strong>documento breve + práctica inmediata + activos listos para usar</strong>.
      </p>
 
      <hr>
 
      <h4 class="mt-5 fontpoppins opacity-100">Propuesta práctica: manual + talleres + plantillas</h4>
      <p>Tres pasos claros para que el equipo adopte una guía usable y productiva:</p>
 
      <h4 class="mb-3">1. Style Guide básico (8–12 páginas)</h4>
      <ul>
        <li>Paleta con valores (HEX/RGB/CMYK) y ejemplos de uso.</li>
        <li>Tipografías: jerarquía y tamaños recomendados.</li>
        <li>Logos: versiones, espacio mínimo y usos permitidos.</li>
        <li>Uso correcto vs. incorrecto (2–3 comparaciones rápidas).</li>
        <li>Plantillas maestras prioritarias: presentación, reporte y factura.</li>
      </ul>
 
      <hr>
 
      <p><strong><em>Tip:</em></strong> si se entiende en 30 s, el equipo lo usará.</p>
 
      <hr>
 
      <h4 class="mb-3">2. Taller express (30 minutos)</h4>
      <ol>
        <li>10 min: impacto en percepción y tiempo.</li>
        <li>15 min: ejercicio práctico aplicando la guía a una pieza real.</li>
        <li>5 min: dudas y asignación de responsable.</li>
      </ol>
 
      <hr>
 
      <p><strong><em>Tip:</em></strong> remoto → usar Miro/Zoom y plantillas compartidas para practicar en vivo.</p>
 
      <hr>
 
      <h4 class="mb-3">3. Plantillas editables que funcionen</h4>
      <p>Sugerencias según perfil:</p>
      <ul>
        <li>Equipos sin diseñadores → Canva (bloquea elementos críticos y acelera entrega).</li>
        <li>Documentos complejos → InDesign (paquete con fuentes).</li>
        <li>Colaboración digital → Figma (librerías y componentes).</li>
        <li>Entregables recomendados: master files (.ai, .svg, .fig) + versiones "para editar" (.pptx, .canva).</li>
      </ul>
 
      <hr>
 
      <!-- Banner E-Book Branding -->
      <div id="banner-ebook-free-branding" class="d-none"></div>
      <!-- Banner E-Book Branding -->
 
      <h4>Buenas prácticas rápidas</h4>
      <ul>
        <li>Nombres claros y versión en archivos: ejemplo "logo_v2_2025.svg".</li>
        <li>Control de acceso: carpeta con permisos; editar solo las versiones "para editar".</li>
        <li>Onboarding visual: incluye el Style Guide en la inducción.</li>
        <li>Automatiza lo repetitivo: campos rellenables y plantillas.</li>
      </ul>
 
      <hr>
 
      <h4>Herramientas (mini-guía)</h4>
      <ul>
        <li><strong>Canva:</strong> rapidez y autonomía (ideal para no diseñadores). Entrega master files y guías.</li>
        <li><strong>Figma:</strong> colaboración y hand-off a front-end (librerías y componentes).</li>
        <li><strong>Illustrator:</strong> precisión vectorial para logos e iconos.</li>
        <li><strong>InDesign:</strong> maquetación multipágina para impresos.</li>
      </ul>
      <p><strong>Regla de oro:</strong> la herramienta no define la calidad; el criterio y los master files sí.</p>
 
      <hr class="my-5">
 
      <div class="bg-canva p-5">
        <h4 class="text-center fontpoppins-semibold pb-4 opacity-100">FAQ´s</h4>
 
        <p><strong>¿Un manual corto es suficiente?</strong></p>
        <p>Sí — si es práctico, visual y viene con plantillas que el equipo pueda usar al instante.</p>
 
        <hr>
 
        <p><strong>¿Cómo demuestro el ROI a dirección?</strong></p>
        <p>Muestra errores reales (logo viejo, colores equivocados), cuantifica horas en correcciones y proyecta la reducción tras implementar el sistema.</p>
 
        <hr>
 
        <p><strong>¿Qué plantilla priorizar?</strong></p>
        <p>La presentación corporativa: cambia la percepción externa y es la más usada por equipos. Empieza por ahí.</p>
 
        <hr>
 
        <p><strong>¿Es profesional usar Canva?</strong></p>
        <p>Sí. Canva es válido cuando se usa con criterio. La profesionalidad se demuestra en la calidad de la solución, el pensamiento detrás del diseño y la capacidad de elegir la plataforma que mejor sirva al contexto del cliente. Usa Canva para velocidad y autonomía de equipos no diseñadores; conserva y entrega master files (Figma/AI) cuando el proyecto requiere control tipográfico, producción o escalabilidad.</p>
 
        <hr>
 
        <p><strong>¿Cada cuánto revisar la guía?</strong></p>
        <p>Revisión ligera anual; ajustes menores según campañas o cambios de identidad.</p>
      </div>
 
      <hr class="my-5">
 
      <p>
        La coherencia visual no es solo estética: es práctica diaria y profesionalismo.
        Un manual claro, talleres aplicados y plantillas bien pensadas convierten la identidad
        en una herramienta que facilita el trabajo y mejora la percepción en cada contacto.
        Lo aprendí proyecto a proyecto, y la diferencia siempre estuvo en lo mismo:
        hacer que el sistema sea tan simple que el equipo no necesite pedirle permiso
        a nadie para usarlo bien.
      </p>
    `,
    relatedArticles: [
      { id: "10", title: "Brand Kit Eficiente: Ahorra Tiempo y Consigue Coherencia Visual" },
      { id: "7",  title: "Brief de diseño: la hoja de ruta que acorta proyectos" },
      { id: "9",  title: "Herramientas de Diseño Inteligentes: Cómo Elegir la Mejor para Tu Equipo" }
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
 
  // ─────────────────────────────────────────────────────────────────────────────
 
  "3": {
    id: 3,
    titleHTML: `
      El corazón, un órgano diferenciador
      <span class="opacity-70">— proyecto de título</span>
    `,
    date: "22 de mayo, 2026",
    imagenDesktop: "assets/img/hero-article/Articulo3/img-article-3-3840@2x.webp",
    imagenMobile: "assets/img/hero-article/Articulo3/img-article-3-750@2x.webp",
    ogImage: "mi-portafolio/assets/img/og-images/og-article-3@2x.webp",
    aboutHTML: `
      <span class="opacity-70">
        Soy Macarena, <strong>UX/UI Designer & Front-End Prototyper.</strong>
        En "El corazón" confirmé que la intuición, acompañada de experimentos y registros,
        puede transformarse en experiencia pública.
        Cuando no diseño, bosquejo ideas con un chocolate caliente con naranja.
      </span>
    `,
    imageUrl: "assets/img/coveraboutme/avatar-3-400@2x.webp",
    imageAlt: "Imagen de mí",
    content: `
      <p>
        Había una pregunta que no me dejaba tranquila: ¿puede el latido de una persona
        convertirse en algo visible? No un dato clínico — un retrato. Algo que te miras
        y reconoces como tuyo.
      </p>
      <p>
        De esa pregunta nació <strong><em>"El corazón: un órgano diferenciador"</em></strong>,
        mi proyecto de título. Lo que empezó como una intuición difícil de explicar terminó
        siendo una instalación con sensores Doppler, algoritmos de mapeo sonoro y mándalas
        generadas en tiempo real frente a un jurado que no sabía exactamente qué esperar.
        Yo tampoco, del todo. Pero tenía datos, prototipos y una hipótesis que quería probar
        en público.
      </p>
      <p>
        Aquí cuento cómo lo construí: la hipótesis, el proceso, lo que validé
        y lo que aprendí sosteniendo una idea arriesgada hasta el final.
      </p>
  
      <hr class="my-5">
  
      <h2 class="mt-5 fontpoppins opacity-100">Hipótesis central</h2>
  
      <p>
        El latido contiene rasgos sonoros — ritmo, amplitud, variabilidad — que, mapeados
        y procesados, pueden generar una mándala visual y sonora única por persona.
        No dos iguales. No dos corazones que cuenten la misma historia.
      </p>
  
      <p class="text-center fs-6 my-4 bg-canva p-3">
        "El objetivo del arte no es representar la apariencia exterior de las cosas,
        sino su significado interior." — <em>Aristóteles</em>
      </p>
  
      <hr class="my-5">
  
      <h2 class="mt-5 fontpoppins opacity-100">Contexto científico</h2>
  
      <p>
        La actividad cardíaca se registra con sensores como Doppler o PPG. La señal
        tiene ritmo, amplitud y variabilidad — parámetros que pueden mapearse a propiedades
        sonoras (tono, intensidad, ritmo) y desde ahí traducirse a rasgos gráficos.
        Lo que hice fue exactamente eso: tomar algo invisible del cuerpo y devolverlo
        como imagen.
      </p>
      <p>
        <strong><em>Importante:</em></strong> esta obra usa datos como material creativo,
        no como diagnóstico médico. La diferencia no es menor — define todo el marco ético
        del proyecto.
      </p>
  
      <p class="text-center fs-6 my-4 bg-canva p-3">
        "El diseño puede ser arte. El diseño puede ser estético. El diseño es muy simple,
        por eso es tan complicado." — <em>Paul Rand</em>
      </p>
  
      <hr>
  
      <h4 class="mt-5 fontpoppins opacity-100">Metodología</h4>
      <ol>
        <li>
          <strong><em>Captura in situ:</em></strong> registro de 10–20 s por visitante (Doppler).
          Breve, no invasivo, suficiente para leer los parámetros que importaban.
        </li>
        <li>
          <strong><em>Procesamiento sonoro:</em></strong> mapeo de parámetros a propiedades
          auditivas — frecuencia → tono; amplitud → intensidad; variabilidad → ornamento —
          con Max/MSP.
        </li>
        <li>
          <strong><em>Generación gráfica:</em></strong> un algoritmo traduce la onda en trazos
          radiales, paletas y texturas. El resultado es una mándala que nadie más tiene.
        </li>
        <li>
          <strong><em>Cadena de exhibición:</em></strong> sensor → procesamiento →
          sonificación + mándala → visualización en pantalla. Todo en tiempo real,
          frente al visitante.
        </li>
      </ol>
  
      <hr>
  
      <h4 class="mt-5 fontpoppins opacity-100">¿Qué miden las mándalas?</h4>
      <ul>
        <li><strong><em>Amplitud </em>→</strong> altura y energía del trazo.</li>
        <li><strong><em>Frecuencia </em>→</strong> ritmo y densidad del patrón.</li>
        <li><strong><em>Timbre / color </em>→</strong> paletas y contraste que sugieren cualidad tonal.</li>
        <li><strong><em>Variabilidad </em>→</strong> ornamentación y complejidad visual.</li>
      </ul>
  
      <p class="text-center fs-6 my-4 bg-canva p-3">
        Estas representaciones no son diagnósticos. Son relatos visuales pensados para
        provocar reconocimiento emocional — y eso, en diseño, también es una función.
      </p>
  
      <hr class="my-5">
  
      <h2 class="mt-5 fontpoppins opacity-100">Resultados y validación</h2>
  
      <p>
        El banco de registros mostró patrones diferenciables entre participantes —
        la hipótesis no era solo una intuición bonita, había algo ahí. En la defensa,
        la pieza despertó reacciones que no esperaba del todo: el jurado pasó de la
        curiosidad técnica a algo más parecido a la emoción. Eso fue difícil de fabricar
        y fácil de reconocer cuando ocurrió.
      </p>
      <p>
        Encuestas y observaciones confirmaron que la propuesta funcionó en dos planos:
        conceptual y estético. La hipótesis se validó con prototipos mínimos y datos reales.
        No necesité más.
      </p>
  
      <hr>
  
      <h4 class="mt-5 fontpoppins opacity-100">Testimonios seleccionados</h4>
  
      <p>
        <em>"Hace tangible algo que normalmente sólo escucho en el trabajo clínico."</em>
        — Teresa Conejeros, Enfermera Coordinadora
      </p>
      <p>
        <em>"Sentí que es algo frágil, como otro ser al que debo cuidar."</em>
        — María José Neira, Estudiante de Arte
      </p>
  
      <hr>
  
      <h4 class="mt-5 fontpoppins opacity-100">Entrevistas con especialistas (extractos)</h4>
  
      <p>
        <strong>Sobre memoria prenatal:</strong> matronas expertas señalaron que experiencias
        maternas dejan huellas tempranas en el feto. Eso me confirmó que el corazón
        como material creativo tenía profundidad cultural, no solo fisiológica.
      </p>
      <p>
        <strong>Sobre la relación cerebro-corazón:</strong> cardiólogos y expertos señalaron
        que el corazón influye en la señal corporal y se conecta con el sistema nervioso.
        Eso respalda usar la señal cardiaca como insumo válido para la obra — y me dio
        base científica para defender algo que en principio sonaba solo poético.
      </p>
      <p>(Estas entrevistas aportaron contexto científico y cultural al proyecto.)</p>
  
      <hr>
  
      <h4 class="mt-5 fontpoppins opacity-100">Comentarios del jurado (selección)</h4>
  
      <p>
        <em>"Nos mostraste que biología y física pueden alimentar propuestas creativas de diseño."</em>
        — Julián Naranjo, Diseñador Gráfico
      </p>
      <p>
        <em>"La experiencia me dejó pensando en la relación entre cuerpo y emoción."</em>
        — Sol Guillón, Artista y Docente
      </p>
  
      <hr class="my-5">
  
      <h2 class="mt-5 fontpoppins opacity-100">Retos</h2>
      <ul>
        <li>
          Escepticismo inicial — hubo momentos en que la idea no tenía apoyo y yo
          tenía que seguir igual.
        </li>
        <li>
          Limitaciones de tiempo y recursos que me impidieron escalar la instalación
          tanto como quería.
        </li>
      </ul>
      <p>
        Esas restricciones me obligaron a ser muy precisa: prototipos mínimos,
        documentación de cada paso, hipótesis clara. A veces las limitaciones
        te enseñan más que los recursos.
      </p>
  
      <hr class="my-5">
  
      <h2 class="mt-5 fontpoppins opacity-100">Lecciones prácticas</h2>
  
      <h4 class="mb-3">1. La ciencia propone; el diseño hace visible.</h4>
      <ul>
        <li>
          Transformar datos en experiencia pide cuidado. La pieza tiene que comunicar
          sin sobreexplicar — y eso es más difícil de lo que parece cuando estás
          enamorada del proceso técnico.
        </li>
      </ul>
  
      <hr>
  
      <h4 class="mb-3">2. Prototipa lo mínimo.</h4>
      <ul>
        <li>
          Registros de 10–20 s y mapeos simples bastaron para validar la hipótesis.
          No necesitaba más complejidad — necesitaba evidencia.
        </li>
      </ul>
  
      <hr>
  
      <h4 class="mb-3">3. Diseña un puente emocional.</h4>
      <ul>
        <li>
          La visualización tiene que hablar por sí misma antes que la explicación técnica.
          Si necesitas un párrafo para que la gente entienda qué siente, algo en el diseño
          todavía no está resuelto.
        </li>
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
                <figcaption><small><em>Mándala generada en tiempo real — proyección en sala.</em></small></figcaption>
              </figure>
              <figure>
                <img src="assets/img/gallery/img-gallery-article3-2-500@2x.webp" alt="Registro con Doppler durante la exhibición" class="img-article-gallery"/>
                <figcaption><small><em>Interacción visitante: captura y mándala emergente.</em></small></figcaption>
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
                <figcaption><small><em>Registro con Doppler durante la exhibición.</em></small></figcaption>
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
  
      <p class="text-center fs-6 my-4 bg-canva p-3">
        El proyecto mostró que el corazón no solo late: cuenta. Combinando biología,
        cultura, sonido y diseño convertí ese relato íntimo en experiencia pública.
      </p>
  
      <hr class="my-5">
  
      <div class="bg-canva p-5">
        <h4 class="text-center fontpoppins-semibold pb-4 opacity-100">FAQ´s</h4>
  
        <p><strong>¿Por qué trabajar con el corazón?</strong></p>
        <p>
          Porque es un símbolo universal con base fisiológica. Conecta ciencia, cultura
          y emoción — y eso me permitía hablarle a audiencias muy distintas con el mismo objeto.
        </p>
  
        <hr>
  
        <p><strong>¿Es esto diagnóstico?</strong></p>
        <p>
          No. Son relatos visuales y sonoros. No pretenden reemplazar un examen médico
          ni acercarse a eso. El marco es artístico y comunicacional, siempre.
        </p>
  
        <hr>
  
        <p><strong>¿Qué aprende un diseñador con esto?</strong></p>
        <p>
          Que una idea arriesgada puede sostenerse si se documenta, se prototipa
          y se valida con datos y público. El escepticismo ajeno no es razón suficiente
          para abandonar una hipótesis que todavía no has probado.
        </p>
      </div>
  
      <hr class="my-5">
  
      <h4 class="mb-3">Proyectos relacionados</h4>
      <ul>
        <li>
          <p>
            <strong><em>
              <a
                href="https://www.behance.net/gallery/230525254/Espacio-de-Aire-para-Concurso-Acadmico-Nike-Air-Max"
                class="a-small-article px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver más sobre este Proyecto"
                data-bs-toggle="tooltip"
              >Espacio de Aire (Air Max)</a>:
            </em></strong>
            escultura en papel que hace tangible la "huella invisible" de una suela.
          </p>
        </li>
        <li>
          <p>
            <strong><em>
              <a
                href="https://www.behance.net/gallery/54482169/Obra-expuesta-en-Bellas-Artes"
                class="a-small-article-green px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver más sobre este Proyecto"
                data-bs-toggle="tooltip"
              >Tributo a Matta-Clark (Bellas Artes)</a>:
            </em></strong>
            maqueta en MDF inspirada en cortes arquitectónicos como exploración espacial.
          </p>
        </li>
      </ul>
    `,
    relatedArticles: [
      { id: "4", title: "Laboratorio de Formas: experimentación creativa aplicada al diseño" },
      { id: "6", title: "Investigación UX: mapas, A/B y observación en contexto" },
      { id: "5", title: "Antes de llamarlo UX: diseño, personas y criterio profesional" }
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
  
  // ─────────────────────────────────────────────────────────────────────────────

    "4": {
      id: 4,
      titleHTML: `
        Laboratorio de Formas:
        <span class="opacity-70">experimentación creativa aplicada al diseño</span>
      `,
      date: "24 de mayo, 2026",
      imagenDesktop: "assets/img/hero-article/Articulo4/img-article-4-3840@2x.webp",
      imagenMobile: "assets/img/hero-article/Articulo4/img-article-4-750@2x.webp",
      ogImage: "mi-portafolio/assets/img/og-images/og-article-4@2x.webp",
      aboutHTML: `
        <span class="opacity-70">
          Soy Macarena, <strong>UX/UI Designer & Front-End Prototyper.</strong>
          En mi Laboratorio de Formas transformo materiales y técnicas en recursos visuales
          aplicados a UX, UI y branding. Cuando no experimento, recolecto texturas urbanas
          para mi próximo prototipo.
        </span>
      `,
      imageUrl: "assets/img/coveraboutme/avatar-4-400@2x.webp",
      imageAlt: "Imagen de mí",
      content: `
        <p>
          Un día arrugué papel, lo fotografié con luz rasante y terminé usando esa textura
          en una pieza digital tres semanas después. No lo planeé. Pasó porque tenía
          una carpeta de experimentos y el ojo entrenado para reconocer cuándo algo servía.
        </p>
        <p>
          Eso es el Laboratorio de Formas: tiempo reservado para probar materiales sin
          presión de entrega. Papel, tintas, luz, cartón. Ver qué pasa.
          Y documentarlo para que no se pierda.
        </p>
        <p>
          Lo que aprendí: los plazos te hacen eficiente, pero también te hacen predecible.
          Una sesión al mes de experimentación libre es suficiente para que el trabajo
          visual no siempre se vea igual.
        </p>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">El problema</h2>
    
        <p>
          Cuando el calendario aprieta, repites lo que funcionó la vez anterior.
          Eso no es malo — es racional. Pero acumulado en el tiempo, produce un lenguaje
          visual que se vuelve limitado. Mismo tipo de composición, misma paleta segura,
          mismas decisiones tipográficas.
        </p>
        <p>
          El Laboratorio es nutrir el trabajo desde otro lugar.
          Y la diferencia entre un experimento que queda olvidado y uno que termina
          en un entregable es tener un flujo claro: <strong><em>experimentar, fotografiar,
          documentar, digitalizar, integrar.</em></strong>
        </p>
    
        <p class="text-center fs-6 my-4 bg-canva p-3">
          Una tensión frecuente: seguir el camino seguro o probar lo nuevo.
        </p>
    
        <hr class="my-5">
    
        <h4 class="mb-3">Mini-casos</h4>
    
        <ul>
    
          <li class="mb-5">
            <strong><em>
              <a
                href="https://www.instagram.com/p/DMOgSTsyD6m/?utm_source=ig_web_copy_link"
                class="a-small-article-green px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver más sobre este Proyecto"
                data-bs-toggle="tooltip"
              >Venezia Venezia — Cartel</a>
            </em></strong>
            <br><strong>Reto:</strong> traducir una crítica arquitectónica y ambiental en una pieza impactante.
            <br><strong>Acción:</strong> pliegues y arrugas en papel para generar volúmenes físicos;
            fotografía de las variantes; edición y aplicación digital.
            <br><strong>Resultado:</strong> piezas con textura propia, listas para flyers y afiches.
            <p>
              <strong><em>Aprendizaje:</em></strong> lo que el papel hace accidentalmente,
              el software tarda en imitar. A veces el accidente es la solución.
            </p>
          </li>
    
          <li class="mb-5">
            <strong><em>
              <a
                href="https://www.instagram.com/p/DMLlLzQyweZ/?utm_source=ig_web_copy_link"
                class="a-small-article px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver más sobre este Proyecto"
                data-bs-toggle="tooltip"
              >TEPA — Exploración serigráfica</a>
            </em></strong>
            <br><strong>Reto:</strong> identidad propia para portadas y bolsos con técnicas artesanales.
            <br><strong>Acción:</strong> fotografía con luz rasante para revelar relieves;
            digitalización de ilustraciones; generación de patterns desde esas capturas.
            <br><strong>Resultado:</strong> texturas únicas en portadas y material promocional digital.
            <p>
              <strong><em>Aprendizaje:</em></strong> la luz rasante revela lo que la luz frontal aplana.
              Cambiar el ángulo cambia el material.
            </p>
          </li>
    
          <li class="mb-5">
            <strong><em>
              <a
                href="https://www.instagram.com/p/DMJX0VbSrib/?utm_source=ig_web_copy_link"
                class="a-small-article-green px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver más sobre este Proyecto"
                data-bs-toggle="tooltip"
              >Proyecto de título — "El corazón, un órgano diferenciador"</a>
            </em></strong>
            <br><strong>Reto:</strong> convertir frecuencia cardiaca en imagen y sonido
            con propósito artístico y comunicacional.
            <br><strong>Acción:</strong> registro in situ, transformación de señales en mándalas,
            prototipado de aplicaciones gráficas para soportes físicos y digitales.
            <br><strong>Resultado:</strong> componentes visuales con carga emocional
            que reforzaron la presentación del proyecto.
            <p>
              <strong><em>Aprendizaje:</em></strong> cuando los datos se traducen bien al diseño,
              no son decoración. Son el argumento.
            </p>
          </li>
    
        </ul>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">Cómo montar tu Laboratorio de Formas</h2>
    
        <p>Seis pasos. Sin presupuesto grande, sin equipo especializado.</p>
    
        <h4 class="mb-3">1. Reserva 4 horas, una vez al mes.</h4>
        <p>
          Materiales básicos: papeles variados, cartón, tintas, pegamentos, cuchillas (corta cartón o tiptop)
          y un móvil con buena cámara. Lo que ya tienes en casa suele alcanzar.
        </p>
    
        <hr>
    
        <h4 class="mb-3">2. Prueba 3 técnicas por sesión.</h4>
        <p>
          Elige técnicas contrastantes — plegado, serigrafía, relieve con gel.
          Quédate con la que más sorprenda. La sorpresa es la señal de que algo vale explorar.
        </p>
    
        <hr>
    
        <h4 class="mb-3">3. Fotografía bien.</h4>
        <p>
          Captura 3 a 6 versiones por pieza: luz lateral, rasante, difusa.
          Estas fotos son la materia prima para digitalizar. La luz rasante es tu aliada.
        </p>
    
        <hr>
    
        <h4 class="mb-3">4. Documenta en caliente.</h4>
        <p>
          Anota qué sorprendió, posibles usos en UI y qué emoción transmite.
          Notas de voz, fotos, cuaderno. Si no lo registras ahora, lo pierdes —
          la memoria edita sin avisar.
        </p>
    
        <hr>
    
        <h4 class="mb-3">5. Traduce a digital.</h4>
        <p>
          Escanea o fotografía → limpia → vectoriza si hace falta → prueba como fondo,
          botón, icono o micro-animación. Una regla simple: 1 experimento, 1 componente UI.
        </p>
    
        <hr>
    
        <h4 class="mb-3">6. Clasifica e integra.</h4>
        <p>
          Guarda en "Activos Experimentales" con tags claros (ej.: textura_rugosa_v1).
          Define cuándo y cómo usar cada recurso. Así el experimento personal
          pasa a ser parte del sistema.
        </p>
    
        <hr class="my-5">
    
        <!-- Banner E-Book Branding -->
        <div id="banner-ebook-free-branding" class="d-none"></div>
        <!-- Banner E-Book Branding -->
    
        <h2 class="mt-5 fontpoppins opacity-100">Para qué sirve en la práctica</h2>
        <ul>
          <li>Diferenciación visual sin romper coherencia de marca.</li>
          <li>Assets reutilizables — texturas, iconos, micro-animaciones — que aceleran entregas.</li>
          <li>Material auténtico para campañas y storytelling.</li>
          <li>Recursos sensoriales que ningún banco de imágenes tiene.</li>
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
                  <figcaption><small><em>Textura de pintura — témpera y color.</em></small></figcaption>
                </figure>
                <figure>
                  <img src="assets/img/gallery/img-gallery-article4-2-500@2x.webp" alt="Composición digital sobre diferentes fotos" class="img-article-gallery"/>
                  <figcaption><small><em>Composición digital sobre varias fotos.</em></small></figcaption>
                </figure>
                <figure>
                  <img src="assets/img/gallery/img-gallery-article4-3-500@2x.webp" alt="Zoom a cartel 3d" class="img-article-gallery"/>
                  <figcaption><small><em>Zoom al cartel 3D (Venezia).</em></small></figcaption>
                </figure>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-center">
                <figure>
                  <img src="assets/img/gallery/img-gallery-article4-4-500@2x.webp" alt="Superposición de fotos" class="img-article-gallery"/>
                  <figcaption><small><em>Superposición de fotografías.</em></small></figcaption>
                </figure>
                <figure>
                  <img src="assets/img/gallery/img-gallery-article4-5-500@2x.webp" alt="Capa vectorial sobre fotografias complejas" class="img-article-gallery"/>
                  <figcaption><small><em>Capa vectorial sobre fotografías complejas.</em></small></figcaption>
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
          <p>
            No. Lo que importa es tener un flujo claro de traducción a digital,
            no la calidad del papel. Un móvil con buena cámara y disciplina son suficientes.
          </p>
    
          <hr>
    
          <p><strong>¿Cómo evito romper la coherencia de la marca?</strong></p>
          <p>
            Define reglas de uso antes de integrar: cuándo aplica el recurso,
            contrastes permitidos y requisitos de accesibilidad.
            El experimento entra al sistema con reglas, no sin ellas.
          </p>
    
          <hr>
    
          <p><strong>¿Qué métricas conviene medir?</strong></p>
          <p>
            Tasa de Clics (CTR) de piezas que usan el activo, tiempo de producción por asset
            y tasa de reutilización. Si el recurso se reutiliza, la sesión valió la pena.
          </p>
        </div>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">Mis 3 aprendizajes clave</h2>
        <ol>
          <li>
            La experimentación con dirección produce recursos aplicables,
            no solo fotos en una carpeta que nadie vuelve a abrir.
          </li>
          <li>
            Documentar en el momento es la diferencia entre un hallazgo y un recuerdo vago.
          </li>
          <li>
            Integrar al design system transforma el descubrimiento personal en recurso de equipo.
          </li>
        </ol>
    
        <p class="text-center fs-6 my-4 bg-canva p-3">
          "La simplicidad consiste en restar lo obvio y añadir lo significativo." — <em>John Maeda</em>
        </p>
    
        <hr class="my-5">
    
        <p>
          Experimentar no es un lujo de cuando hay tiempo libre. Es parte del trabajo,
          aunque no aparezca en ningún brief. Lo que sale de una sesión de Laboratorio
          tarde o temprano aterriza en algo real — si tienes el sistema para capturarlo.
        </p>
      `,
      relatedArticles: [
        { id: "3", title: "El corazón, un órgano diferenciador — proyecto de título" },
        { id: "9", title: "Herramientas de Diseño Inteligentes" },
        { id: "5", title: "Antes de llamarlo UX: diseño, personas y criterio profesional" }
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
    
    // ─────────────────────────────────────────────────────────────────────────────
    
    "5": {
      id: 5,
      titleHTML: `
        Antes de llamarlo UX:
        <span class="opacity-70">
          lo que aprendí sobre diseño, personas y criterio profesional en el voluntariado
        </span>
      `,
      date: "24 de mayo, 2026",
      imagenDesktop: "assets/img/hero-article/Articulo5/img-article-5-3840@2x.webp",
      imagenMobile: "assets/img/hero-article/Articulo5/img-article-5-750@2x.webp",
      ogImage: "mi-portafolio/assets/img/og-images/og-article-5@2x.webp",
      aboutHTML: `
        <span class="opacity-70">
          Soy Macarena, <strong>UX/UI Designer & Front-End Prototyper.</strong>
          Me titulé en Diseño Gráfico en 2015. En 2017 cursé un diplomado Front-End Jr.
          (Laboratoria Chile) y desde entonces consolidé experiencia en UX/UI en roles
          profesionales y como freelance. Mis primeros voluntariados como estudiante
          fueron el semillero de prácticas que hoy muestro con orgullo en mi portafolio.
          Cuando no diseño, exploro visualizaciones de datos con un café en mano.
        </span>
      `,
      imageUrl: "assets/img/coveraboutme/avatar-5-400@2x.webp",
      imageAlt: "Imagen de mí",
      content: `
        <p>
          Hay una versión de mi historia que podría empezar en 2015, cuando me titulé.
          O en 2017, cuando terminé el diplomado Front-End. Pero si soy honesta,
          hay decisiones que tomo hoy — cómo observo, cómo priorizo, cómo me muevo
          en contextos que no tienen instrucciones — que se formaron mucho antes.
          En voluntariados estudiantiles, sin terminología técnica y sin nadie
          que me dijera qué hacer en cada paso.
        </p>
        <p>
          <strong><em>Tardé años en entender que eso no era anécdota.</em> Era entrenamiento.</strong>
        </p>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">El problema</h2>
    
        <p>
          Hay una trampa en cómo se cuenta la trayectoria profesional: todo lo que
          ocurrió antes del primer trabajo formal tiende a descartarse como experiencia
          irrelevante. Pero algunas de las competencias más difíciles de enseñar
          — autonomía real, lectura de contexto, capacidad de iterar sin mapa —
          no aparecen en ningún curso. Aparecen cuando te enfrentas a un problema
          sin instrucciones y decides igual.
        </p>
        <p>
          Mirar hacia atrás no fue nostalgia. Fue entender de dónde vienen decisiones
          que hoy tomo con criterio profesional consciente.
        </p>
    
        <p class="text-center fs-6 my-4 bg-canva p-3">
          Mirar hacia atrás fue clave: no para reescribir mi historia, sino para entenderla.
        </p>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">Mi proceso — lo que hice</h2>
    
        <ul>
    
          <li class="mb-5">
            <strong><em>
              <a
                href="https://www.behance.net/gallery/230522186/Voluntariado-en-AIESEC-%2820122014%29"
                class="a-small-article-green px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver más sobre este Proyecto"
                data-bs-toggle="tooltip"
              >AIESEC — Voluntariado (etapa estudiantil)</a>:
            </em></strong>
            <br><strong>Reto:</strong> baja captación y materiales sin estandarizar.
            <br><strong>Lo que hice:</strong> diseñé más de 15 piezas de reclutamiento,
            planifiqué el stand y coordiné equipos multiculturales. Sin brief formal,
            sin cliente que aprobara — solo un objetivo claro y recursos limitados.
            <br><strong>Resultado:</strong> +30% en postulaciones respecto a la campaña previa
            (registro interno).
            <p>
              <strong><em>Lo que demuestra hoy:</em></strong> investigación rápida, pruebas
              de diseño y medición de impacto. Habilidades que aplico en cada proyecto UX,
              con o sin ese nombre.
            </p>
          </li>
    
          <li class="mb-5">
            <strong><em>
              <a
                href="https://www.instagram.com/p/DLnbeYNSgf6/?utm_source=ig_web_copy_link"
                class="a-small-article px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver más sobre este Proyecto"
                data-bs-toggle="tooltip"
              >Casona Minka — Manual OPL (proyecto profesional)</a>:
            </em></strong>
            <br><strong>Reto:</strong> tareas operativas sin documentación clara.
            <br><strong>Lo que hice:</strong> diseñé un Manual OPL y plantillas para onboarding.
            Fui al hostal, observé cómo trabajaba el equipo, pregunté qué faltaba
            y traduje eso a un documento que pudieran usar solos.
            <br><strong>Resultado:</strong> onboarding estandarizado y menor tiempo de adaptación.
            <p>
              <strong><em>Lo que demuestra hoy:</em></strong> capacidad para sistematizar procesos
              y traducir operaciones a documentación útil — UX writing y documentación de producto
              aplicados a un contexto real, no académico.
            </p>
          </li>
    
          <li class="mb-5">
            <strong><em>
              <a
                href="https://www.instagram.com/p/DLiftbVSbw3/?utm_source=ig_web_copy_link"
                class="a-small-article-green px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver más sobre este Proyecto"
                data-bs-toggle="tooltip"
              >CBC — Diseño y prototipo de blog (proyecto profesional)</a>:
            </em></strong>
            <br><strong>Reto:</strong> comunicación por email no escalable y mala experiencia móvil.
            <br><strong>Lo que hice:</strong> prototipé un blog en HTML5/CSS3, definí flujos
            editoriales y guías de publicación para que el equipo pudiera operar sin depender
            de diseño en cada post.
            <br><strong>Resultado:</strong> canal centralizado con métricas de engagement
            que antes no existían.
            <p class="textdescriptions">
              <small>
                <strong>Cómo se evaluó:</strong> el blog permitió centralizar contenidos
                y habilitar métricas básicas de lectura y participación que antes no existían.
              </small>
            </p>
            <p>
              <strong><em>Lo que demuestra hoy:</em></strong> soluciones escalables que integran
              diseño y front-end. El prototipo en HTML no fue un extra — fue la razón
              por la que el equipo pudo implementarlo desde el primer día.
            </p>
          </li>
    
        </ul>
    
        <p class="text-center fs-6 my-4 bg-canva p-3">
          "El liderazgo no está en mandar; está en conectar, inspirar y motivar a otros a actuar.
          La empatía es el mejor catalizador del cambio."
        </p>
    
        <hr>
    
        <h2 class="mt-5 fontpoppins opacity-100">Lo que aprendí</h2>
    
        <h4 class="mt-4 mb-3 fontpoppins opacity-100">La educación formal suma — pero no define sola.</h4>
        <p>
          El título estructura, valida y da lenguaje común. Pero la persona profesional
          también se construye desde la personalidad, la ética y la forma de observar.
          Eso no aparece en ningún pénsum académico (programa universitario) — se forma en los proyectos donde nadie
          te está mirando y decides igual.
        </p>
    
        <hr>
    
        <h4 class="mt-4 mb-3 fontpoppins opacity-100">Los momentos sin presión externa son los más reveladores.</h4>
        <p>
          Cuando no estás cumpliendo expectativas ajenas sino explorando, aparecen señales
          de cómo piensas, qué problemas te energizan y qué rol tomas naturalmente
          en un equipo. En mi caso: observación antes de proponer, sistematizar lo que
          otros dejan sin documentar, construir puentes entre lo que el cliente necesita
          y lo que el equipo puede ejecutar.
        </p>
    
        <hr>
    
        <h4 class="mt-4 mb-3 fontpoppins opacity-100">Ser autodidacta es hacerse responsable del propio crecimiento.</h4>
        <p>
          No es aprender solo. Es decidir qué aprender, cuándo y por qué.
          En voluntariados, esa autonomía aparece antes que en cualquier trabajo formal:
          nadie te da un roadmap, tú lo construyes. Eso es una competencia profesional,
          no una carencia de estructura.
        </p>
    
        <!-- Banner E-Book Memoria Emocional -->
        <div id="banner-ebook-price-memoriaemocional" class="d-none"></div>
        <!-- Banner E-Book Memoria Emocional -->
    
        <hr class="my-5">
    
        <div class="bg-canva p-5">
          <h4 class="text-center fontpoppins-semibold pb-4 opacity-100">FAQ´s</h4>
    
          <p><strong>¿Qué hago si no hay datos previos para medir el impacto de mi experiencia?</strong></p>
          <p>
            Cuando no existen métricas previas, el primer paso es crear una línea base mínima,
            aunque sea imperfecta. Puede ser una campaña puntual, un período corto
            o una comparación cualitativa antes/después. Medir no siempre es tener dashboards:
            muchas veces es demostrar criterio, intención y capacidad de observación.
          </p>
    
          <hr>
    
          <p><strong>¿Cómo muestro que soy autodidacta sin sonar informal?</strong></p>
          <p>
            Presenta proceso y resultados: problema → aprendizaje aplicado → resultado.
            Los cursos y tutoriales suman cuando están conectados a decisiones reales,
            no cuando aparecen como lista de certificados.
          </p>
    
          <hr>
    
          <p><strong>¿Cómo transformo recuerdos creativos en fortalezas profesionales?</strong></p>
          <p>
            Revisa los momentos donde creabas sin presión externa, desde el disfrute
            y la curiosidad. Pregúntate: ¿qué estaba resolviendo?, ¿qué me motivaba?,
            ¿qué decisiones tomaba casi de forma intuitiva? Ahí suelen aparecer patrones
            de personalidad — observación, empatía, síntesis, pensamiento sistémico —
            que cuando los reconoces y conectas con tu práctica actual, dejan de ser
            nostalgia y se convierten en criterio profesional consciente.
          </p>
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
                  <figcaption><small><em>Flyer campaña Outgoing Exchange.</em></small></figcaption>
                </figure>
                <figure>
                  <img src="assets/img/gallery/img-gallery-article5-5-500@2x.webp" alt="Foto grupal de equipos internos de AIESEC" class="img-article-gallery"/>
                  <figcaption><small><em>Foto grupal de equipos internos de AIESEC.</em></small></figcaption>
                </figure>
              </div>
            </div>
          </div>
        </div>
        <!-- Gallery Article -->
    
        <hr class="my-5">
    
        <p>
          Mis voluntariados estudiantiles no fueron solo participación. Sin saberlo entonces,
          ahí empecé a practicar algo muy cercano al <strong>pensamiento UX:</strong> observar antes de decidir,
          priorizar con recursos limitados e iterar con lo que había.
        </p>
        <p>
          No lo aprendí en una sala de clases. Surgió de hacerme responsable, de escuchar
          a otros y de intentar mejorar procesos que no funcionaban — mientras avanzaba.
          Eso es autonomía real. Y esa autonomía hoy la reconozco como una ventaja,
          no como algo que deba justificar o minimizar.
        </p>
        <p>
          <strong>El crecimiento profesional no empieza con un título ni termina con él:</strong>
          se construye cuando conectas quién eres, cómo aprendes y el impacto que decides generar.
        </p>
      `,
      relatedArticles: [
        { id: "4",  title: "Laboratorio de Formas: experimentación creativa aplicada al diseño" },
        { id: "7",  title: "Brief de diseño: la hoja de ruta que acorta proyectos" },
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
          url: "https://www.behance.net/gallery/230522186/Voluntariado-en-AIESEC-%2820122014%29"
        }
      ]
    },
    
    // ─────────────────────────────────────────────────────────────────────────────
    
    "6": {
      id: 6,
      titleHTML: `
        Investigación UX:
        <span class="opacity-70">mapas, A/B y observación en contexto</span>
      `,
      date: "24 de mayo, 2026",
      imagenDesktop: "assets/img/hero-article/Articulo6/img-article-6-3840@2x.webp",
      imagenMobile: "assets/img/hero-article/Articulo6/img-article-6-750@2x.webp",
      ogImage: "mi-portafolio/assets/img/og-images/og-article-6@2x.webp",
      aboutHTML: `
        <span class="opacity-70">
          Soy Macarena, <strong>UX/UI Designer & Front-End Prototyper.</strong>
          En proyectos como CBC y Casona Minka aplico mapas de recorrido, pruebas por etapas
          y observación en contexto — siempre con contenido real desde el primer prototipo.
          Titulada en 2015; cursé Front-End Jr. (Laboratoria, 2017) y sigo formándome
          de manera autodidacta. Cuando no investigo, pruebo herramientas nuevas con
          una infusión de rooibos y hibiscos.
        </span>
      `,
      imageUrl: "assets/img/coveraboutme/avatar-6-400@2x.webp",
      imageAlt: "Imagen de mí",
      content: `
        <p>
          Vi a un usuario quedarse cinco minutos atascado en un formulario.
          Clics erráticos, duda visible, y finalmente abandono. El equipo creía
          que el problema era el diseño. Cuando mapeamos el recorrido completo,
          el problema era anterior: el flujo pedía información en un orden que
          no tenía sentido para quien lo usaba, y el microcopy no ayudaba a entender
          por qué cada campo importaba.
        </p>
        <p>
          Lo que hicimos después — mapas de recorrido, A/B controlado, observación 1:1
          en contexto — redujo ese tiempo de tarea de 15 a 6 minutos
          y subió el CTR un 25% acumulado en las iteraciones siguientes (registros internos CBC).
          En este artículo desgloso qué cambió, qué medimos y por qué el orden de las decisiones fue lo que hizo la diferencia.
        </p>
    
        <hr>
    
        <h2 class="mt-5 fontpoppins opacity-100">El problema</h2>
    
        <p>
          Muchas interfaces nacen de suposiciones: pantallas atractivas que ocultan pasos confusos.
          Sin investigación, los equipos toman decisiones por opinión y no por efecto real.
          El resultado es predecible: usuarios que abandonan, soporte que se sobrecarga
          y un equipo que no entiende por qué el rediseño no funcionó.
        </p>
        <p>
          <strong>Un punto que suele pasarse por alto:</strong> diseñar sin contenido real
          es decoración. Textos, titulares, CTAs y ejemplos concretos dan intención y jerarquía.
          Sin ellos, la interfaz puede quedar bonita pero vacía. Por eso investigo, diseño
          y escribo en paralelo — el contenido aporta propósito y el diseño estructura ese propósito.
        </p>
    
        <h4 class="mt-5 fontpoppins opacity-100">Antes / Después</h4>
        <ul>
          <li>
            <p>
              <strong><em>Antes:</em></strong> pantallas que se veían bien pero no resolvían
              los procesos que los usuarios necesitaban completar.
            </p>
          </li>
          <li>
            <p>
              <strong><em>Lo que hice:</em></strong> aplicar métodos de investigación en orden —
              mapas de recorrido para entender el flujo completo, observación en contexto para ver
              lo que los datos no muestran, y pruebas A/B controladas para validar hipótesis
              con evidencia. Siempre con contenido real desde el primer boceto.
            </p>
          </li>
          <li>
            <p>
              <strong><em>Después:</em></strong> decisiones basadas en comportamiento real,
              no en opiniones. Resultados medibles y un equipo que entiende por qué
              cada cambio ocurrió.
            </p>
          </li>
        </ul>
    
        <p class="text-center fs-6 my-4 bg-canva p-3">
          "Si el usuario no puede usarlo, no funciona." — <em>Susan Dray</em>
        </p>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">Mi proceso — lo que hice</h2>
    
        <ul>
    
          <li class="mb-5">
            <strong><em>
              <a
                href="https://www.instagram.com/p/DLskei2SY5r/?utm_source=ig_web_copy_link"
                class="a-small-article-green px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver más sobre este Proyecto"
                data-bs-toggle="tooltip"
              >Módulo "Mis Datos" — Plataforma CBC (proyecto profesional)</a>:
            </em></strong>
            <br><strong>Reto:</strong> pasos redundantes para actualizar información personal.
            Los usuarios tardaban demasiado y cometían errores evitables.
            <br><strong>Lo que hice:</strong> mapeé el recorrido completo con usuarios internos,
            identifiqué dónde se acumulaban las dudas, rediseñé el flujo y prototipé
            con microcopy claro desde la primera versión.
            <br><strong>Resultado:</strong> tiempo medio por tarea reducido de 15 a 6 minutos
            (registro interno CBC).
            <p class="textdescriptions">
              <small>
                <strong>Lo que aprendí:</strong> investigar el recorrido y escribir microcopy claro
                desde el inicio evita ambigüedades que después son costosas de corregir.
              </small>
            </p>
          </li>
    
          <li class="mb-5">
            <strong><em>
              <a
                href="https://www.instagram.com/p/DLsLeySMdog/?utm_source=ig_web_copy_link"
                class="a-small-article px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver más sobre este Proyecto"
                data-bs-toggle="tooltip"
              >A/B testing — CBC Web (proyecto profesional)</a>:
            </em></strong>
            <br><strong>Reto:</strong> baja visibilidad del menú y la landing principal.
            El equipo tenía hipótesis distintas sobre qué cambiar — y ninguna con evidencia.
            <br><strong>Lo que hice:</strong> diseñé variantes y propuse pruebas por etapas:
            una sola variable por iteración para poder atribuir el efecto correctamente.
            <br><strong>Resultado:</strong> +25% CTR acumulado tras las iteraciones (registro interno CBC).
            <p class="textdescriptions">
              <small>
                <strong>Lo que aprendí:</strong> probar una variable a la vez no es ser lento —
                es la única forma de saber qué funcionó y por qué.
              </small>
            </p>
          </li>
    
          <li class="mb-5">
            <strong><em>
              <a
                href="landing-projects-d-minka.html"
                class="a-small-article-green px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver más sobre este Proyecto"
                data-bs-toggle="tooltip"
              >Observación en contexto — Hostal Casona Minka (proyecto profesional)</a>:
            </em></strong>
            <br><strong>Reto:</strong> procesos manuales y desorden en recepción que afectaban
            la atención y la tasa de reservas.
            <br><strong>Lo que hice:</strong> fui al hostal, observé el trabajo en su contexto real,
            identifiqué qué tareas se repetían sin sistema y cuáles generaban errores.
            Después ajusté formularios y reorganicé flujos con el equipo.
            <br><strong>Resultado:</strong> aumento en reservas (~+20%) y mayor fluidez operativa
            (reportado por el equipo de Casona Minka).
            <p class="textdescriptions">
              <small>
                <strong>Lo que aprendí:</strong> ver el trabajo en su contexto revela problemas
                operativos que ninguna entrevista remota hubiera detectado.
              </small>
            </p>
          </li>
    
        </ul>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">Qué prácticas integrar y por qué funcionan</h2>
    
        <ul>
          <li>
            <strong><em>Registrar el recorrido del usuario (journey mapping):</em></strong>
            deja ver pasos y decisiones completos, y ayuda a detectar dónde se acumulan los bloqueos.
            No solo qué falla — dónde y por qué.
          </li>
          <li>
            <strong><em>Content-first — contenido junto al diseño:</em></strong>
            desarrolla titulares, microcopy y ejemplos en paralelo al wireframe.
            Sin contenido real, el diseño puede volverse mera decoración.
            Esto aplica también en emails, landing pages, onboarding y documentación.
          </li>
          <li>
            <strong><em>Pruebas por etapas, una variable a la vez:</em></strong>
            eso permite atribuir el resultado a una causa concreta, no a una combinación de decisiones simultáneas.
          </li>
          <li>
            <strong><em>Observación en contexto (contextual inquiry):</em></strong>
            muestra atajos, herramientas paralelas y comportamientos que no aparecen
            en pruebas remotas ni en datos de Analytics.
          </li>
          <li>
            <strong><em>Validar prototipos con contenido real antes de programar:</em></strong>
            reduce ciclos de revisión y evita rehacer código por decisiones de diseño
            que no se probaron a tiempo.
          </li>
        </ul>
    
        <!-- Banner E-Book Memoria Emocional -->
        <div id="banner-ebook-price-memoriaemocional" class="d-none"></div>
        <!-- Banner E-Book Memoria Emocional -->
    
        <hr class="my-5">
    
        <p class="text-center fs-6 my-4 bg-canva p-3">
          "Regla general para UX: más opciones, más problemas." — <em>Scott Belsky</em>
        </p>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">KPIs recomendados — elige 2 o 3 según objetivo</h2>
        <ul>
          <li><strong>Eficiencia de tarea:</strong> tiempo medio por tarea, tasa de completitud, tasa de error.</li>
          <li><strong>Visibilidad / enganche:</strong> Tasa de Clics (CTR) en elementos clave, % de usuarios que alcanzan la meta.</li>
          <li><strong>Conversión:</strong> reservas, leads, tasa de conversión por paso del flujo.</li>
        </ul>
        <p><em>Complementa siempre con feedback cualitativo para entender el "por qué" detrás del número.</em></p>
    
        <hr class="my-5">
    
        <div class="bg-canva p-5">
          <h4 class="text-center fontpoppins-semibold pb-4 opacity-100">FAQ´s</h4>
    
          <p><strong>¿Por dónde empiezo si tengo poco tráfico?</strong></p>
          <p>
            Prioriza observación en contexto y pruebas con 3–5 usuarios representativos.
            Los hallazgos cualitativos generan hipótesis sólidas para validar después
            con pruebas cuantitativas. No necesitas volumen para empezar a aprender.
          </p>
    
          <hr>
    
          <p><strong>¿Cuánto tiempo tarda ver resultados en un A/B?</strong></p>
          <p>
            Depende del tráfico y del tamaño del efecto esperado. Define el tamaño de muestra
            y la duración antes de lanzar — no después. Si no hay tráfico suficiente,
            empieza por pruebas cualitativas y usa el A/B cuando tengas volumen real.
          </p>
    
          <hr>
    
          <p><strong>¿El shadowing reemplaza las métricas?</strong></p>
          <p>
            No — las complementa. La observación explica el "por qué" detrás de los números
            y ayuda a diseñar pruebas más precisas. Sin ese "por qué", los datos
            son difíciles de actuar.
          </p>
        </div>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">Mis 4 aprendizajes clave</h2>
        <ol>
          <li>
            Registrar el recorrido completo ahorra horas: ver el flujo entero revela
            la causa real de muchos problemas que parecían de diseño pero eran de contenido.
          </li>
          <li>
            Prueba por etapas y repite: pocas iteraciones controladas valen más que
            muchas opiniones bien intencionadas.
          </li>
          <li>
            Observar en contexto humaniza los datos: ver a la persona usar el producto
            en su entorno real revela soluciones que los números no sugieren.
          </li>
          <li>
            Diseñar con contenido desde el inicio evita que la interfaz se vuelva
            un cascarón bonito. El contenido da intención — el diseño la estructura.
          </li>
        </ol>
    
        <p class="text-center fs-6 my-4 bg-canva p-3">
          "Un buen diseño de UX se basa en simplificar la experiencia del usuario,
          lo que implica eliminar cualquier elemento innecesario." — <em>Career Foundry</em>
        </p>
    
        <hr class="my-5">
    
        <p>
          La investigación UX convierte incertidumbre en decisiones claras.
          No necesitas un presupuesto grande para empezar — necesitas una hipótesis,
          un flujo que observar y la disciplina de cambiar una sola cosa a la vez.
        </p>
        <p>
          <strong>Recuerda: un diseño sin contenido es decoración.</strong>
          Diseñar y escribir deberían avanzar juntos — en interfaces, emails,
          onboarding y campañas — para que el mensaje y la experiencia sean coherentes
          desde el primer prototipo.
        </p>
      `,
      relatedArticles: [
        { id: "8",  title: "El Retorno de Inversión en UX: Por Qué Vale la Pena" },
        { id: "11", title: "Iteraciones Rápidas: Prototipado que Minimiza Riesgos" },
        { id: "12", title: "Colabora con IA: en tu Proceso de Diseño" }
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

    // ─────────────────────────────────────────────────────────────────────────────
    
    "7": {
      id: 7,
      titleHTML: `
        Brief de diseño:
        <span class="opacity-70">la hoja de ruta que acorta proyectos</span>
      `,
      date: "25 de mayo, 2026",
      imagenDesktop: "assets/img/hero-article/Articulo7/img-article-7-3840@2x.webp",
      imagenMobile: "assets/img/hero-article/Articulo7/img-article-7-750@2x.webp",
      ogImage: "mi-portafolio/assets/img/og-images/og-article-7@2x.webp",
      aboutHTML: `
        <span class="opacity-70">
          Soy Macarena, <strong>UX/UI Designer & Front-End Prototyper.</strong>
          Creo que empezar con un brief operativo es un acto de cuidado: protege tiempos,
          presupuesto y expectativas. Titulada en 2015; cursé Front-End Jr.
          (Laboratoria, 2017) y sigo formándome de manera autodidacta.
          Cuando no diseño, pruebo metodologías nuevas con un té de jazmín a mano.
        </span>
      `,
      imageUrl: "assets/img/coveraboutme/avatar-1-400@2x.webp",
      imageAlt: "Imagen de mí",
      content: `
        <p>
          El proyecto más complicado que viví no falló por mal diseño.
          Falló porque en el kick-off nadie preguntó qué se quería lograr
          ni quién iba a aprobar cada etapa. A las tres semanas, cada reunión
          era una negociación sobre algo que debió quedar claro el primer día.
        </p>
        <p>
          Desde entonces tengo una regla: antes de comenzar a diseñar, existe el brief.
          No un documento largo que nadie lee — una hoja de ruta corta y operativa
          que el equipo consulta cada vez que aparece una duda.
          Eso acorta proyectos más que cualquier herramienta.
        </p>
    
        <hr>
    
        <h2 class="mt-5 fontpoppins opacity-100">El problema</h2>
    
        <p>
          Sin un brief claro, los proyectos empiezan por pantallas y terminan en debates.
          Las correcciones no vienen del diseño — vienen de expectativas que nunca
          se pusieron por escrito. Cada cambio de dirección cuesta tiempo,
          energía y a veces la confianza del cliente.
        </p>
        <p>
          Dedicar una hora al brief al inicio no es papeleo. Es la inversión
          que protege todo lo que viene después.
        </p>
    
        <h4 class="mt-5 fontpoppins opacity-100">Antes / Después</h4>
        <ul>
          <li>
            <p>
              <strong><em>Antes:</em></strong> proyectos que empezaban por pantallas
              y terminaban con rondas interminables de correcciones.
            </p>
          </li>
          <li>
            <p>
              <strong><em>Lo que hice:</em></strong> incorporar un brief operativo en el kick-off.
              Objetivo, métricas, perfiles de usuario, contenido de referencia,
              alcance y responsables — todo acordado antes del primer wireframe.
            </p>
          </li>
          <li>
            <p>
              <strong><em>Después:</em></strong> decisiones más rápidas, menos correcciones y stakeholders con mayor autonomía para avanzar sin depender del equipo en cada paso.
            </p>
          </li>
        </ul>
    
        <p class="text-center fs-6 my-4 bg-canva p-3">
          "El diseño es el pensamiento hecho visual." — <em>Saul Bass</em>
        </p>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">Mi proceso — lo que hice</h2>
    
        <ul>
    
          <li class="mb-5">
            <strong><em>
              <a
                href="landing-projects-d-fol.html"
                class="a-small-article-green px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver más sobre este Proyecto"
                data-bs-toggle="tooltip"
              >Brand System para FOL (proyecto profesional)</a>:
            </em></strong>
            <br><strong>Reto:</strong> decisiones visuales dispersas entre TI y Marketing
            que retrasaban lanzamientos.
            <br><strong>Lo que hice:</strong> brief inicial con moodboard, guía de tokens
            (colores, tipografías) y plantillas editables. Todo acordado antes de diseñar
            una sola pieza.
            <br><strong>Resultado:</strong> decisiones más ágiles y casi sin correcciones de color.
            <p class="textdescriptions">
              <small>
                <strong>Lo que aprendí:</strong> un brief con archivos fuente incluidos
                acelera el handoff técnico. El equipo de TI no pregunta dos veces
                si ya tiene los tokens.
              </small>
            </p>
          </li>
    
          <li class="mb-5">
            <strong><em>
              <a
                href="landing-projects-d-australGroup.html"
                class="a-small-article px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver más sobre este Proyecto"
                data-bs-toggle="tooltip"
              >Aulas Virtuales e-Learning — Austral Group (proyecto profesional)</a>:
            </em></strong>
            <br><strong>Reto:</strong> el proyecto iba a empezar directo por pantallas,
            sin entender flujos ni usuarios.
            <br><strong>Lo que hice:</strong> brief con 3 perfiles prioritarios y mapeo
            de recorridos antes de hacer un solo wireframe.
            <br><strong>Resultado:</strong> mayor velocidad en entregas y capacidad
            de anticipar problemas antes de que llegaran al equipo de desarrollo.
            <p class="textdescriptions">
              <small>
                <strong>Lo que aprendí:</strong> mapear usuarios antes de diseñar
                evita suposiciones que después cuestan semanas.
              </small>
            </p>
          </li>
    
          <li class="mb-5">
            <strong><em>
              <a
                href="landing-projects-d-tarotParaSanar.html"
                class="a-small-article-green px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver más sobre este Proyecto"
                data-bs-toggle="tooltip"
              >Rebranding y plantillas — Tarot para Sanar (proyecto profesional)</a>:
            </em></strong>
            <br><strong>Reto:</strong> 18 piezas para redes sociales y rebranding completo
            en 4 semanas, manteniendo tono coherente.
            <br><strong>Lo que hice:</strong> brief estético preciso, plantillas editables
            en formato para redes y guías rápidas de uso — paleta, tipografías y logo.
            <br><strong>Resultado:</strong> entregas puntuales y cliente con autonomía
            para publicar sin depender de mí.
            <p class="textdescriptions">
              <small>
                <strong>Lo que aprendí:</strong> entregar plantillas junto al brief
                reduce consultas posteriores y da escalabilidad real al cliente.
              </small>
            </p>
          </li>
    
        </ul>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">Qué incluye un brief que funciona</h2>
    
        <p>
          No es largo. Es útil. Estos son los campos que idealmente deberían estar:
        </p>
    
        <ol>
          <li><strong>Título del proyecto</strong> — foco claro en una línea.</li>
          <li><strong>Objetivo (SMART si es posible)</strong> — qué se quiere lograr y en qué plazo.</li>
          <li><strong>KPIs y línea base</strong> — 1 o 2 métricas con fuente y período de medición.</li>
          <li><strong>Audiencia / JTBD (2–3 perfiles)</strong> — quién usa esto, en qué contexto y qué intenta resolver.</li>
          <li><strong>Contenido de referencia (content-first)</strong> — titulares, microcopy y un CTA ejemplo.
          Si no hay textos definitivos, van prototipos de contenido.</li>
          <li><strong>Alcance y entregables</strong> — qué está dentro y qué no.</li>
          <li><strong>Restricciones técnicas y presupuesto estimado</strong> — stack, límites y recursos.</li>
          <li><strong>Referencias visuales y tono</strong> — qué sí / qué no.</li>
          <li><strong>Stakeholders y aprobaciones</strong> — quién aprueba cada paso.</li>
          <li><strong>Plazos y versionado</strong> — fechas, responsable y control de cambios.</li>
        </ol>
    
        <p>
          <strong>Tip:</strong> un brief con ejemplos de contenido y una plantilla visual
          reduce preguntas y acelera el handoff. Si se entiende en 5 minutos, funciona.
        </p>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">7 pasos para un brief operativo</h2>
    
        <ol>
          <li class="mb-3">
            <strong>Kick-off colaborativo (45–60 min)</strong>
            <p>
              Junta a cliente, producto, diseño y quien aprueba. Tablero visual en Miro o Notion.
              Documenta los acuerdos — lo que no queda escrito no existió.
            </p>
          </li>
          <li class="mb-3">
            <strong>Define objetivo y KPI con línea base</strong>
            <p>
              1 objetivo principal y 1–2 KPIs. Registra cómo se midió la línea base:
              herramienta, período, fuente. Esto evita discusiones sobre resultados al final.
            </p>
          </li>
          <li class="mb-3">
            <strong>Perfiles de usuario prioritarios</strong>
            <p>
              Define 2–3 perfiles con su contexto de uso: dispositivo, situación y qué los motiva a completar la tarea. Cuanto más específico, menos decisiones quedan abiertas durante el diseño.
            </p>
          </li>
          <li class="mb-3">
            <strong>Contenido desde el día 0</strong>
            <p>
              Titulares de ejemplo, microcopy y un CTA real. El diseño debe sostener
              el mensaje — no al revés.
            </p>
          </li>
          <li class="mb-3">
            <strong>Alcance y entregables claros</strong>
            <p>
              Lista lo que se entrega: wireframes, prototipo, archivos fuente, plantillas.
              Tener esto escrito desde el inicio evita malentendidos y facilita ajustes
              cuando el proyecto cambia de dirección — porque siempre cambia algo.
            </p>
          </li>
          <li class="mb-3">
            <strong>Restricciones técnicas y presupuesto</strong>
            <p>
              Stack, límites de accesibilidad, estimado de tiempo y costo.
              Esto frena el scope creep antes de que empiece.
            </p>
          </li>
          <li class="mb-3">
            <strong>Responsables y versionado</strong>
            <p>
              Quién aprueba qué. Cómo se registra un cambio. Quién actualiza los KPIs.
              Cada versión del brief lleva fecha y responsable.
            </p>
          </li>
        </ol>
    
        <p>
          <strong>Tip:</strong> sesiones cortas por área — 20 minutos, no más —
          para presentar el brief y resolver dudas. Las micro-sesiones generan adopción
          real. Los correos largos, no.
        </p>
    
        <hr class="my-5">
    
        <div class="bg-canva p-5">
          <h4 class="text-center fontpoppins-semibold pb-4 opacity-100">FAQ´s</h4>
    
          <p><strong>¿Qué diferencia un brief UX de un brief visual?</strong></p>
          <p>
            El brief UX incluye objetivos de comportamiento y métricas de uso.
            El visual se centra en tono e imagen. Lo ideal es un brief que combine ambos
            — porque el diseño que no tiene contexto de uso termina siendo solo decoración.
          </p>
    
          <hr>
    
          <p><strong>¿Quién debe aprobar el brief?</strong></p>
          <p>
            Como mínimo: cliente o project owner, responsable de producto y diseñador líder.
            Si alguien que toma decisiones no lo aprobó, el brief no existe todavía.
          </p>
    
          <hr>
    
          <p><strong>¿El brief puede cambiar durante el proyecto?</strong></p>
          <p>
            Sí — y eso es normal en proyectos reales. Lo importante es versionarlo,
            registrar el impacto en KPIs y avisarle a los responsables. Así el cambio
            queda integrado en lugar de generar confusión más adelante.
          </p>
        </div>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">Mis 4 aprendizajes clave</h2>
        <ol>
          <li>Involucra a las personas correctas desde el día 0. Después es tarde.</li>
          <li>Define 1 o 2 métricas que importen al negocio — no más.</li>
          <li>Entrega plantillas y archivos fuente: facilitan la implementación y reducen consultas.</li>
          <li>El brief es un documento vivo. Cuando algo cambia, lo actualizamos juntos y dejamos registro — así todos saben dónde estamos parados.</li>
        </ol>
    
        <hr>
    
        <p>
          Un brief bien hecho no es un trámite — es la diferencia entre un proyecto
          que avanza y uno que da vueltas. Lo aprendí de la manera difícil.
          Ahora es lo primero que propongo en cualquier proyecto nuevo.
        </p>
      `,
      relatedArticles: [
        { id: "2",  title: "Coherencia Visual: Estandariza tus Documentos" },
        { id: "9",  title: "Herramientas de Diseño Inteligentes" },
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
    
    // ─────────────────────────────────────────────────────────────────────────────
    
    "8": {
      id: 8,
      titleHTML: `
        ROI en UX:
        <span class="opacity-70">demuestra con números cómo el diseño aumenta conversiones y ahorra costos</span>
      `,
      date: "25 de mayo, 2026",
      imagenDesktop: "assets/img/hero-article/Articulo8/img-article-8-3840@2x.webp",
      imagenMobile: "assets/img/hero-article/Articulo8/img-article-8-750@2x.webp",
      ogImage: "mi-portafolio/assets/img/og-images/og-article-8@2x.webp",
      aboutHTML: `
        <span class="opacity-70">
          Soy Macarena, <strong>UX/UI Designer & Front-End Prototyper.</strong>
          He aplicado investigación y prototipado en proyectos como Austral Group,
          CBC Web y Hostal Casona Minka para transformar problemas de uso
          en mejoras medibles. Titulada en 2015; cursé Front-End Jr. (Laboratoria, 2017)
          y sigo formándome de forma autodidacta.
          Cuando no mido impactos, disfruto un capítulo de anime con sushi vegetariano.
        </span>
      `,
      imageUrl: "assets/img/coveraboutme/avatar-2-400@2x.webp",
      imageAlt: "Imagen de mí",
      content: `
        <p>
          La primera vez que me dijeron "UX es un gasto" no supe cómo responder.
          Tenía intuición de que estaban equivocados, pero no tenía los números.
          Eso cambió cuando empecé a medir antes de tocar nada:
          línea base primero, intervención después, comparativa al final.
        </p>
        <p>
          Con ese orden, el diseño deja de ser una opinión y se convierte en evidencia.
          Menos tickets de soporte, mayor completitud en flujos clave, procesos internos
          más ágiles — resultados que la dirección entiende sin necesitar traducción.
        </p>
    
        <hr>
    
        <h2 class="mt-5 fontpoppins opacity-100">El problema</h2>
    
        <p>
          Sin métricas, el diseño queda reducido a preferencias estéticas.
          Los usuarios abandonan pasos críticos, el soporte se sobrecarga
          y se pierde facturación — pero nadie puede demostrar que el diseño
          es la causa ni la solución.
        </p>
        <p>
          Medir transforma intuiciones en evidencia. Y la evidencia abre presupuesto.
        </p>
    
        <h4 class="mt-5 fontpoppins opacity-100">Antes / Después</h4>
        <ul>
          <li>
            <p>
              <strong><em>Antes:</em></strong> proyectos que empezaban diseñando pantallas
              y terminaban en debates sobre prioridades.
            </p>
          </li>
          <li>
            <p>
              <strong><em>Lo que hice:</em></strong> registrar la línea base, investigar en contexto,
              prototipar con contenido real y probar hipótesis en ciclos cortos.
            </p>
          </li>
          <li>
            <p>
              <strong><em>Después:</em></strong> resultados concretos que justificaron inversión,
              acortaron plazos de entrega y redujeron la carga operativa del equipo.
            </p>
          </li>
        </ul>
    
        <p class="text-center fs-6 my-4 bg-canva p-3">
          "Si piensas que el buen diseño es caro, deberías considerar el costo del mal diseño."
          — <em>Dr. Ralf Speth</em>
        </p>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">Mi proceso — lo que hice</h2>
    
        <ul>
    
          <li class="mb-5">
            <strong><em>
              <a
                href="https://www.behance.net/gallery/229418197/Perfil-de-Inversionista-en-App-FOL-%282018%29"
                class="a-small-article-green px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver más sobre este Proyecto"
                data-bs-toggle="tooltip"
              >Perfil de Inversionista — FOL (proyecto profesional)</a>:
            </em></strong>
            <br><strong>Reto:</strong> flujos y textos pensados para escritorio que fallaban en móvil.
            <br><strong>Lo que hice:</strong> investigación de contenido (content-first),
            priorización de campos y prototipado responsive.
            <br><strong>Resultado:</strong> aumento en la tasa de completitud y menor abandono
            en mobile (registro interno).
            <p class="textdescriptions">
              <small>
                <strong>Lo que aprendí:</strong> invertir en contenido y validación móvil
                mejora conversión con inversión moderada. El problema no era el diseño — era el orden.
              </small>
            </p>
          </li>
    
          <li class="mb-5">
            <strong><em>
              <a
                href="https://www.instagram.com/p/DLiftbVSbw3/?utm_source=ig_web_copy_link"
                class="a-small-article-green px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver más sobre este Proyecto"
                data-bs-toggle="tooltip"
              >Diseño y Prototipo de Blog — CBC (proyecto profesional)</a>:
            </em></strong>
            <br><strong>Reto:</strong> comunicación por email no escalable y mala experiencia móvil.
            <br><strong>Lo que hice:</strong> flujos editoriales, prototipado responsive
            en HTML5/CSS3 y foco en lectura móvil.
            <br><strong>Resultado:</strong> canal público con métricas de engagement
            que antes no existían.
            <p class="textdescriptions">
              <small>
                <strong>Lo que aprendí:</strong> un canal bien diseñado
                se convierte en activo medible para marketing.
                El diseño no es el costo — es la infraestructura.
              </small>
            </p>
          </li>
    
          <li class="mb-5">
            <strong><em>
              <a
                href="https://www.instagram.com/p/DMJX0VbSrib/?utm_source=ig_web_copy_link"
                class="a-small-article px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver más sobre este Proyecto"
                data-bs-toggle="tooltip"
              >"El corazón, un órgano diferenciador" (Proyecto académico)</a>:
            </em></strong>
            <br><strong>Reto:</strong> traducir señales biométricas a experiencia visual y sonora.
            <br><strong>Lo que hice:</strong> investigación interdisciplinaria y prototipado experimental.
            <br><strong>Resultado:</strong> validación de la hipótesis y exhibición pública.
            <p class="textdescriptions">
              <small>
                <strong>Lo que aprendí:</strong> la investigación aplicada comunica ideas complejas
                a audiencias amplias. El método importa tanto como el resultado.
              </small>
            </p>
          </li>
    
        </ul>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">Cómo convertir UX en ROI — pasos prácticos</h2>
    
        <p>Antes de tocar nada, registra durante 1 a 2 semanas:</p>
        <ol>
          <li>Tiempo por tarea crítica (ej.: completar registro).</li>
          <li>Tasa de abandono por paso del flujo.</li>
          <li>Tickets y consultas relacionadas por semana.</li>
        </ol>
        <p>Con esos datos tienes la base para comparar después de la intervención.</p>
    
        <hr>
    
        <ol>
          <li class="mb-3">
            <strong>Define la hipótesis</strong>
            <p>Una sola. Ej.: "Si simplificamos el formulario, la completitud subirá X%."</p>
          </li>
          <li class="mb-3">
            <strong>Elige la métrica norte</strong>
            <p>1 KPI. Registra la línea base con fuente y período. Sin esto, no hay comparación posible.</p>
          </li>
          <li class="mb-3">
            <strong>Investiga en contexto</strong>
            <p>
              Shadowing 1:1 de 10 a 30 minutos. Anota atajos, términos confusos
              y momentos que interrumpen la tarea. Los datos de Analytics no muestran esto.
            </p>
          </li>
          <li class="mb-3">
            <strong>Prototipa y prueba</strong>
            <p>
              Prototipo click-through o HTML ligero. 3 a 5 usuarios, o A/B si hay tráfico.
              Una sola variable por iteración.
            </p>
          </li>
          <li class="mb-3">
            <strong>Mide y monetiza</strong>
            <p>
              Calcula antes vs. después. Monetiza: horas ahorradas × costo/hora
              + aumento de conversiones × valor medio.
            </p>
          </li>
          <li class="mb-3">
            <strong>Comunica con un one-pager</strong>
            <p>
              Objetivo, línea base, hipótesis, resultado (%), cálculo de ahorro o ingreso
              y tiempo de recuperación. Una página. Sin más.
            </p>
          </li>
        </ol>
    
        <p class="text-center fs-6 my-4 bg-canva p-3">
          "Si quieres un gran sitio, debes probarlo." — <em>Steve Krug</em>
        </p>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">Perfiles UX y cuándo contratarlos</h2>
    
        <p>
          Un diseñador gráfico no es un diseñador UX/UI. El gráfico trabaja identidad
          y piezas estáticas. El UX se centra en procesos, comportamiento y medición.
          Tampoco es necesario que dependa de TI — lo ideal es colaboración transversal
          entre Producto, TI y Marketing.
        </p>
    
        <ul>
          <li><strong>Generalista UX/UI (MVPs):</strong> prototipo navegable y user flows. Para lanzar y validar rápido.</li>
          <li><strong>UX Researcher:</strong> entrevistas, tests y síntesis de insights. Reduce riesgo antes de construir.</li>
          <li><strong>Product / UX Designer:</strong> estrategia, prototipos y métricas. Conecta negocio y usuario.</li>
          <li><strong>Interaction Designer:</strong> especificaciones de interacción y estados. Precisión en micro-experiencias.</li>
          <li><strong>UI / Visual Designer:</strong> kits visuales y mockups hi-fi. Aumenta confianza visual.</li>
          <li><strong>UX Engineer / Front-end (foco UX):</strong> componentes accesibles y performance.</li>
          <li><strong>Design System Specialist:</strong> tokens y gobernanza.</li>
          <li><strong>Content Designer / UX Writer:</strong> microcopy y arquitectura de contenido.</li>
        </ul>
    
        <p class="text-center fs-6 my-4 bg-canva p-3">
          Invertir en UX no es una moda: es la estrategia que hace que tu producto funcione
          y que tu negocio crezca de forma sostenible.
        </p>
    
        <hr class="my-5">
    
        <div class="bg-canva p-5">
          <h4 class="text-center fontpoppins-semibold pb-4 opacity-100">FAQ´s</h4>
    
          <p><strong>¿Cómo calculo el ROI de UX?</strong></p>
          <p>
            ROI = (Beneficio neto − Inversión) / Inversión × 100.
            Beneficio neto = ingresos adicionales + ahorro operativo estimado.
          </p>
    
          <hr>
    
          <p><strong>¿Qué KPI inicio para e-commerce?</strong></p>
          <p>
            Tasa de conversión por paso, valor promedio de orden, abandono de carrito
            y tiempo hasta completar la compra. Elige uno y mídelo bien
            antes de agregar más.
          </p>
    
          <hr>
    
          <p><strong>¿Por qué invertir en UX es relevante para mi empresa?</strong></p>
          <p>
            Porque reduce obstáculos y costos, aumenta conversiones y velocidad de entrega,
            y convierte decisiones de diseño en resultados medibles que la dirección puede leer.
          </p>
        </div>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">Mis 3 aprendizajes clave</h2>
        <ol>
          <li>Medir primero. Tener una línea base hace que las conversaciones sobre resultados sean más claras para todo el equipo — no solo para diseño.</li>
          <li>Experimenta barato y repite. 2 o 3 iteraciones generan evidencia sólida.</li>
          <li>Traduce resultados a dinero o tiempo. Así el negocio entiende el valor del diseño.</li>
        </ol>
    
        <hr class="my-5">
    
        <p>
          El diseño deja de ser un gasto cuando se demuestra con números.
          Medir primero, probar rápido y traducir mejoras a ahorro o ingresos —
          esas tres prácticas son las que, en mi experiencia, convierten diseño
          en ventaja competitiva. No hace falta un equipo grande para empezar.
          Hace falta disciplina para registrar la línea base y valentía para probar en pequeño.
        </p>
      `,
      relatedArticles: [
        { id: "6",  title: "Investigación UX: mapas, A/B y observación en contexto" },
        { id: "11", title: "Iteraciones Rápidas: Prototipado que Minimiza Riesgos" },
        { id: "12", title: "Colabora con IA: en tu Proceso de Diseño" }
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
    
    // ─────────────────────────────────────────────────────────────────────────────
    
    "9": {
      id: 9,
      titleHTML: `
        Herramientas de Diseño:
        <span class="opacity-70">elige lo que hace al equipo más autónomo</span>
      `,
      date: "25 de mayo, 2026",
      imagenDesktop: "assets/img/hero-article/Articulo9/img-article-9-3840@2x.webp",
      imagenMobile: "assets/img/hero-article/Articulo9/img-article-9-750@2x.webp",
      ogImage: "mi-portafolio/assets/img/og-images/og-article-9@2x.webp",
      aboutHTML: `
        <span class="opacity-70">
          Soy Macarena, <strong>UX/UI Designer & Front-End Prototyper.</strong>
          He adaptado herramientas y flujos según contexto y objetivos,
          buscando siempre que el equipo gane autonomía y velocidad.
          Cuando no estoy eligiendo herramientas, me puedes encontrar
          disfrutando un pastel de frutos del bosque con una infusión de rooibos.
        </span>
      `,
      imageUrl: "assets/img/coveraboutme/avatar-3-400@2x.webp",
      imageAlt: "Imagen de mí",
      content: `
        <p>
          Cada equipo tiene su historia con las herramientas: algunas llegaron por moda,
          otras por lo que usaba el equipo anterior, algunas por una demo convincente.
          No hay una elección incorrecta de entrada — pero sí hay una forma de evaluar
          si la herramienta actual está ayudando o frenando el trabajo.
        </p>
        <p>
          La mejor herramienta no es la más popular. Es la que el equipo domina
          y que resuelve objetivos reales. Aquí cuento cómo llego a esa decisión:
          5 pasos, criterios claros y ejemplos de proyectos reales.
        </p>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">El problema</h2>
    
        <p>
          Elegir sin criterio produce dependencia: el equipo no puede avanzar
          sin que alguien con acceso o conocimiento específico esté disponible.
          Una buena elección hace lo contrario — libera tiempo para crear
          en vez de consumirlo en problemas técnicos.
        </p>
    
        <h4 class="mt-5 fontpoppins opacity-100">Antes / Después</h4>
        <ul>
          <li>
            <p><strong><em>Antes:</em></strong> decisiones por opinión o moda.</p>
          </li>
          <li>
            <p>
              <strong><em>Después:</em></strong> decisiones basadas en necesidades reales,
              pruebas cortas y métricas que demuestran si la herramienta mejora el trabajo diario.
            </p>
          </li>
        </ul>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">5 pasos para elegir bien</h2>
    
        <ol>
          <li class="mb-3">
            <strong>Auditoría rápida (30–60 min)</strong>
            <p>
              Reúne 4 o 5 personas de distintas áreas — Marketing, Producto, TI, Diseño.
              Pide 2 o 3 necesidades por persona y prioriza por impacto y frecuencia.
              El entregable: 3 objetivos concretos (velocidad, calidad de arte final, integración con desarrollo).
            </p>
          </li>
          <li class="mb-3">
            <strong>Define la métrica norte por entregable</strong>
            <p>
              Antes de probar, acuerda qué medirás: tiempo por publicación, errores en exportación,
              tiempo de handoff. Registra la línea base para tener algo con qué comparar.
            </p>
          </li>
          <li class="mb-3">
            <strong>Evalúa con una matriz simple</strong>
            <p>
              Valora: precisión técnica, colaboración en tiempo real, integración con desarrollo
              y costo vs. curva de aprendizaje. Prioriza por impacto y frecuencia de uso.
            </p>
          </li>
          <li class="mb-3">
            <strong>Prueba corta y medible (7–14 días)</strong>
            <p>
              Elige 1 entregable real — un post, un banner, una página.
              Mide tiempo por tarea, errores y satisfacción. Si hace falta, repite con otra alternativa.
              Decide con datos, no con intuición.
            </p>
          </li>
          <li class="mb-3">
            <strong>Plan de incorporación 30/60/90 días</strong>
            <p>
              Define licencias, responsable de implementación, plantillas, sesiones cortas de formación
              y métricas de uso. Revisa y ajusta en ciclos breves.
            </p>
          </li>
        </ol>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">Cuándo elegir cada herramienta</h2>
    
        <p><strong>Illustrator</strong> — Branding, iconografía y arte final con control vectorial. Para equipos de diseño y producción.</p>
        <p><strong>InDesign</strong> — Maquetación multipágina: revistas, catálogos. Para equipos editoriales.</p>
        <p><strong>Canva</strong> — Contenidos rápidos en redes y equipos no diseñadores. Con plantillas controladas y archivos fuente para producción.</p>
        <p><strong>Figma</strong> — Interfaces, prototipado y colaboración en vivo. Facilita el handoff a desarrollo. Para producto y diseño.</p>
        <p><strong>CapCut / Premiere Pro</strong> — CapCut para video ágil; Premiere para producción profesional. Según recursos y objetivos de calidad.</p>
    
        <p class="text-center fs-6 my-4 bg-canva p-3">
          "La mejor herramienta no siempre es la más popular:
          es la que tu equipo domina y que impulsa resultados."
        </p>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">Mini-casos</h2>
    
        <ul>
    
          <li class="mb-5">
            <strong><em>
              <a
                href="https://www.instagram.com/p/DL0pyKUSCg-/?utm_source=ig_web_copy_link"
                class="a-small-article-green px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver más sobre este Proyecto"
                data-bs-toggle="tooltip"
              >Plantillas Social Media — Akasha Healing (proyecto profesional)</a>:
            </em></strong>
            <br><strong>Reto:</strong> cliente sin equipo ni tiempo para producir contenido constante.
            <br><strong>Lo que hice:</strong> plantillas editables en Canva y guía rápida de uso.
            <br><strong>Resultado:</strong> coherencia visual inmediata y +30% de engagement
            (comparativa interna).
            <p class="textdescriptions">
              <small>
                <strong>Lo que aprendí:</strong> elegir la herramienta por autonomía del cliente
                permite velocidad sin perder identidad de marca.
              </small>
            </p>
          </li>
    
          <li class="mb-5">
            <strong><em>
              <a
                href="https://www.instagram.com/p/DLsRJJ7stBt/?utm_source=ig_web_copy_link"
                class="a-small-article px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver más sobre este Proyecto"
                data-bs-toggle="tooltip"
              >Prototipado & handoff — CBC (proyecto profesional)</a>:
            </em></strong>
            <br><strong>Reto:</strong> assets inconsistentes y handoff lento a desarrollo.
            <br><strong>Lo que hice:</strong> assets optimizados en SVG y tokens CSS,
            snippets reutilizables y prototipo en HTML/CSS.
            <br><strong>Resultado:</strong> tiempo de preparación de assets reducido
            y despliegues más ágiles (estimación interna).
            <p class="textdescriptions">
              <small>
                <strong>Lo que aprendí:</strong> estandarizar formatos y fragmentos reutilizables
                acelera la implementación más que cualquier herramienta nueva.
              </small>
            </p>
          </li>
    
        </ul>
    
        <p class="text-center fs-6 my-4 bg-canva p-3">
          "La fuerza del equipo reside en cada miembro. La fuerza de cada miembro es el equipo."
          — <em>Phil Jackson</em>
        </p>
    
        <hr>
    
        <h2 class="mt-5 fontpoppins opacity-100">Cómo medir la prueba — plantilla rápida</h2>
    
        <p>Una tabla simple con estas columnas:</p>
        <ul>
          <li><strong>Tarea</strong> — qué se está midiendo.</li>
          <li><strong>Tiempo antes (min)</strong> — línea base.</li>
          <li><strong>Tiempo prueba (min)</strong> — durante el ensayo.</li>
          <li><strong>Errores / ajustes</strong> — número de correcciones necesarias.</li>
          <li><strong>Satisfacción (1–5)</strong> — valoración del responsable.</li>
        </ul>
        <p>
          <strong>Criterio de decisión:</strong> si la herramienta nueva reduce tiempo
          y mantiene calidad, seguir. Si no, probar otra alternativa.
        </p>
    
        <hr>
    
        <h2 class="mt-5 fontpoppins opacity-100">Responsabilidades y versiones</h2>
        <p>Antes de implementar, define:</p>
        <ul>
          <li>Responsable del cambio (nombre, no cargo).</li>
          <li>Formato y nombre de archivo estándar — ej.: banner_v1_2026_facebook.svg</li>
          <li>Dónde están los master files — Figma, Drive o GitHub.</li>
        </ul>
        <p>
          Tener esto claro desde el inicio ayuda a que la adopción sea más fluida
          y que el equipo sepa exactamente dónde encontrar lo que necesita.
        </p>
    
        <hr class="my-5">
    
        <div class="bg-canva p-5">
          <h4 class="text-center fontpoppins-semibold pb-4 opacity-100">FAQ´s</h4>
    
          <p><strong>¿Canva sirve para branding profesional?</strong></p>
          <p>
            Sí, si se entrega con master files y reglas claras. Canva es útil para velocidad
            y autonomía de equipos no diseñadores. Para producción o impresión,
            conserva los archivos fuente en AI o Figma.
          </p>
    
          <hr>
    
          <p><strong>¿Cuánto tarda un equipo en incorporar una herramienta nueva?</strong></p>
          <p>
            Con prueba corta, plantillas y formación breve: 30 a 90 días para uso habitual.
            Mide con porcentaje de uso de plantillas y tiempo por tarea.
          </p>
    
          <hr>
    
          <p><strong>¿Cómo demuestro el retorno de la herramienta?</strong></p>
          <p>
            Define la métrica principal, registra la línea base, haz la prueba corta y compara.
            Complementa con testimonios internos del equipo que la usa.
          </p>
        </div>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">Mis 3 aprendizajes clave</h2>
        <ul>
          <li>La mejor herramienta es la que el equipo usa bien y que resuelve objetivos reales.</li>
          <li>Pruebas cortas con métricas claras evitan decisiones guiadas por opiniones.</li>
          <li>Plantillas y sesiones de 15 a 30 minutos generan adopción real
          más rápido que cualquier manual extenso.</li>
        </ul>
    
        <hr class="my-5">
    
        <p>
          Elegir una herramienta es una decisión de trabajo diario, no una declaración
          de identidad. Cuando esa decisión se toma con criterio — definiendo qué quieres
          lograr, probando en condiciones reales y midiendo — el equipo gana velocidad
          y confianza. Y eso se nota en cada entrega.
        </p>
      `,
      relatedArticles: [
        { id: "7",  title: "Brief de diseño: la hoja de ruta que acorta proyectos" },
        { id: "11", title: "Iteraciones Rápidas: Prototipado que Minimiza Riesgos" },
        { id: "4",  title: "Laboratorio de Formas: experimentación creativa aplicada al diseño" }
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

    // ─────────────────────────────────────────────────────────────────────────────

    "10": {
      id: 10,
      titleHTML: `
        Brand Kit eficiente:
        <span class="opacity-70">ahorra tiempo y consigue coherencia visual</span>
      `,
      date: "25 de mayo, 2026",
      imagenDesktop: "assets/img/hero-article/Articulo10/img-article-10-3840@2x.webp",
      imagenMobile: "assets/img/hero-article/Articulo10/img-article-10-750@2x.webp",
      ogImage: "mi-portafolio/assets/img/og-images/og-article-10@2x.webp",
      aboutHTML: `
        <span class="opacity-70">
          Soy Macarena, <strong>UX/UI Designer & Front-End Prototyper.</strong>
          He ayudado a equipos a ahorrar horas de trabajo y a mantener coherencia visual
          en múltiples proyectos. Cuando no organizo assets, me encontrarás
          disfrutando la compañía de un hermoso gatito.
        </span>
      `,
      imageUrl: "assets/img/coveraboutme/avatar-4-400@2x.webp",
      imageAlt: "Imagen de mí",
      content: `
        <p>
          En un proyecto con FOL, el equipo de Marketing y el de TI usaban versiones
          distintas del logo. Nadie lo había notado hasta que apareció en una presentación
          importante. No fue culpa de nadie — era un problema de sistema:
          no había un lugar único con los archivos correctos ni reglas claras de uso.
        </p>
        <p>
          Eso es lo que resuelve un Brand Kit bien hecho. No es decoración ni un entregable
          de cierre de proyecto — es la herramienta que permite que el equipo trabaje
          con autonomía y coherencia al mismo tiempo.
        </p>
    
        <p class="text-center fs-6 my-4 bg-canva p-3">
          "El diseño es el embajador silencioso de tu marca." — <em>Paul Rand</em>
        </p>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">El problema</h2>
    
        <p>
          Cuando no hay un sistema claro, cada persona interpreta la identidad
          desde su propio lugar. El resultado es gradual e invisible al principio:
          colores que varían un poco, logos en versiones distintas, tipografías
          que no coinciden entre piezas. Nada grave por separado — pero acumulado,
          la marca empieza a contar historias distintas dependiendo de quién produce.
        </p>
        <p>
          Un Brand Kit centraliza los activos y las reglas para que eso no pase.
          El equipo gasta energía en crear, no en buscar archivos ni en preguntar
          cuál es la versión correcta.
        </p>
    
        <h4 class="mt-5 fontpoppins opacity-100">Antes / Después</h4>
        <ul>
          <li>
            <p>
              <strong><em>Antes:</em></strong> piezas con colores distintos
              y preguntas frecuentes sobre cuál era el logo correcto.
            </p>
          </li>
          <li>
            <p>
              <strong><em>Después:</em></strong> una carpeta centralizada con archivos fuente,
              plantillas y un UI Kit que el equipo usa a diario. Menos revisiones,
              entregas más rápidas y menos dependencia del equipo de diseño
              para tareas operativas.
            </p>
          </li>
        </ul>
    
        <hr class="my-5">
    
        <h4 class="mb-3">Qué es y por qué funciona</h4>
        <ul>
          <li>
            <strong>Brand System / Brand Kit:</strong> guía con paleta (HEX / RGB / CMYK),
            tipografías, versiones de logo, reglas de uso y tono.
            Un Brand System escalable integra tokens y componentes para productos digitales.
            <strong><em>Un Brand Kit es la versión compacta para arrancar rápido.</em></strong>
          </li>
          <li>
            <strong>UI Kit:</strong> colección de componentes — botones, inputs, cards, iconos SVG —
            tokens y snippets que facilitan la implementación sin inconsistencias.
            Los design tokens mantienen valores de color y espaciados sincronizados
            entre diseño y código.
          </li>
          <li>
            <strong>Documentación:</strong> ejemplos interactivos y estados de componentes
            que reducen dudas y aceleran el handoff a desarrollo.
          </li>
        </ul>
    
        <hr class="my-5">
    
        <h4 class="mb-3">Mini-casos</h4>
    
        <ul>
    
          <li class="mb-5">
            <strong><em>
              <a
                href="https://www.instagram.com/p/DLxhfxrxvp_/?utm_source=ig_web_copy_link"
                class="a-small-article-green px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver más sobre este Proyecto"
                data-bs-toggle="tooltip"
              >Brand System — CBC (proyecto profesional)</a>:
            </em></strong>
            <br><strong>Reto:</strong> piezas y documentos con líneas visuales distintas entre áreas.
            <br><strong>Lo que hice:</strong> Brand Guide práctico de 10 páginas más archivos fuente.
            <br><strong>Resultado:</strong> equipos alineados con plantillas listas;
            menos revisiones de color y de usos del logo.
            <p class="textdescriptions">
              <small>
                <strong>Lo que aprendí:</strong> centralizar archivos fuente y reglas de uso
                reduce consultas y libera tiempo para trabajo de mayor valor.
              </small>
            </p>
          </li>
    
          <li class="mb-5">
            <strong><em>
              <a
                href="landing-projects-d-fol.html"
                class="a-small-article px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver más sobre este Proyecto"
                data-bs-toggle="tooltip"
              >Style Guide — FOL (proyecto profesional)</a>:
            </em></strong>
            <br><strong>Reto:</strong> uso inconsistente de colores y tipografías
            entre Marketing, TI y Ventas.
            <br><strong>Lo que hice:</strong> paleta con valores HEX/RGB, familias tipográficas,
            iconografía y guías de aplicación con ejemplos de qué sí y qué no.
            <br><strong>Resultado:</strong> coherencia inmediata en web y materiales comerciales.
            <p class="textdescriptions">
              <small>
                <strong>Lo que aprendí:</strong> los ejemplos visuales de uso correcto e incorrecto
                son más útiles que las reglas escritas. La gente los entiende a primera vista.
              </small>
            </p>
          </li>
    
          <li class="mb-5">
            <strong><em>
              <a
                href="https://www.instagram.com/p/DLnbeYNSgf6/?utm_source=ig_web_copy_link"
                class="a-small-article-green px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver más sobre este Proyecto"
                data-bs-toggle="tooltip"
              >Manual OPL — Casona Minka (proyecto profesional)</a>:
            </em></strong>
            <br><strong>Reto:</strong> identidad externa cuidada pero procesos internos sin estandarizar.
            <br><strong>Lo que hice:</strong> manual operativo con instrucciones claras
            para convivencia, procesos y comunicación interna.
            <br><strong>Resultado:</strong> mayor eficiencia operativa y mejor coordinación de equipos.
            <p class="textdescriptions">
              <small>
                <strong>Lo que aprendí:</strong> un manual práctico funciona si lo enseñas
                en 15 a 30 minutos con el equipo. Sin ese tiempo de activación, queda guardado.
              </small>
            </p>
          </li>
    
        </ul>
    
        <hr class="my-5">
    
        <h4 class="mb-3">Evidencia y benchmarks: qué dicen los datos</h4>
        <p>
          Esto es lo que muestran estudios y experiencias de la industria —
          útil para fijar metas alcanzables al proponer un Brand Kit internamente.
        </p>
        <ol>
          <li class="mb-3">
            <strong><em>Ahorro de tiempo</em></strong>
            <p>
              Equipos con design systems reportan reducciones de entre 25% y 40%
              en tiempos de producción, según la madurez del sistema.
              En términos prácticos: si un banner toma 60 minutos hoy,
              una meta razonable tras implementar tokens y un UI Kit es dejarlo en 36 a 45 minutos.
            </p>
          </li>
          <li class="mb-3">
            <strong><em>Adopción de plantillas</em></strong>
            <p>
              Equipos que miden el uso de plantillas suelen alcanzar más del 70% en 60 a 90 días
              cuando hay una sesión de activación y un responsable que acompaña el proceso.
            </p>
          </li>
          <li class="mb-3">
            <strong><em>Calidad y errores</em></strong>
            <p>
              Organizaciones con documentación interactiva y librerías vivas reportan
              menos errores visuales y problemas de accesibilidad — lo que se traduce
              en menos rondas de revisión y más tiempo para trabajo de diseño real.
            </p>
          </li>
        </ol>
    
        <h5 class="mt-5">Referencias</h5>
        <ul>
          <li class="textdescriptions">
            <small>
              <a
                href="https://www.figma.com/es-la/reports/measure-design-system-roi/"
                class="a-small px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ir a la fuente"
                data-bs-toggle="tooltip"
              >"Figma — Measure design system ROI."</a>
            </small>
          </li>
          <li class="textdescriptions">
            <small>
              <a
                href="https://www.smashingmagazine.com/2022/09/formula-roi-design-system/"
                class="a-small px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ir a la fuente"
                data-bs-toggle="tooltip"
              >"Smashing Magazine — The ROI of a design system."</a>
            </small>
          </li>
          <li class="textdescriptions">
            <small>
              <a
                href="https://storybook.js.org/showcase/"
                class="a-small px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ir a la fuente"
                data-bs-toggle="tooltip"
              >"Storybook — Case studies."</a>
            </small>
          </li>
          <li class="textdescriptions">
            <small>
              <a
                href="https://storybook.js.org/docs"
                class="a-small px-1"
                target="_blank"
                rel="noopener noreferrer"
                title="Ir a la fuente"
                data-bs-toggle="tooltip"
              >"Storybook — Docs."</a>
            </small>
          </li>
        </ul>
    
        <hr class="my-5">
    
        <h4 class="mb-3">Cómo medir el impacto</h4>
        <ol>
          <li><strong>Antes:</strong> registra 10 a 20 assets típicos — tiempo de producción y número de correcciones.</li>
          <li><strong>Implementa:</strong> one-page + 3 tokens + 1 plantilla.</li>
          <li><strong>Después:</strong> a los 30 y 90 días, mide la misma muestra.</li>
          <li><strong>Reporta:</strong> reducción de tiempo, porcentaje de uso de plantilla, incidencias.</li>
        </ol>
    
        <hr class="my-5">
    
        <div class="bg-canva p-5">
          <h4 class="text-center fontpoppins-semibold pb-4 opacity-100">FAQ´s</h4>
    
          <p><strong>¿Brand Kit o Brand System?</strong></p>
          <p>
            El Brand Kit es la versión compacta para arrancar rápido — paleta, logos, 2 o 3 plantillas.
            El Brand System es la versión escalable con tokens, componentes y documentación viva.
            Empezar por el Kit y evolucionar al System cuando el producto digital lo demande
            es una ruta que funciona bien en equipos que están creciendo.
          </p>
    
          <hr>
    
          <p><strong>¿Cómo logro que el equipo lo use?</strong></p>
          <p>
            Con una sesión corta de activación por área, un responsable visible
            y plantillas listas para usar desde el primer día. La adopción viene
            cuando el sistema facilita el trabajo, no cuando lo complica.
          </p>
    
          <hr>
    
          <p><strong>¿Entregar código listo o solo snippets?</strong></p>
          <p>
            Depende del ritmo del equipo. Si el proyecto lanza con frecuencia,
            componentes documentados en Storybook aceleran mucho.
            Si el equipo está arrancando, snippets CSS y un prototipo navegable
            son un buen punto de partida que desarrollo puede completar.
          </p>
        </div>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">Mis 3 aprendizajes clave</h2>
        <ol>
          <li>
            Centralizar assets reduce el tiempo que el equipo pasa buscando
            y preguntando — y eso se nota en el ritmo de trabajo diario.
          </li>
          <li>
            Un UI Kit bien pensado mejora la relación entre diseño y desarrollo:
            menos idas y vueltas, más claridad en cada entrega.
          </li>
          <li>
            Una sesión corta de activación vale más que un manual extenso.
            El sistema funciona cuando la gente sabe usarlo, no solo cuando existe.
          </li>
        </ol>
    
        <hr class="my-5">
    
        <p>
          La coherencia visual no es un lujo — es una práctica que protege
          la reputación de la marca y hace el trabajo diario más fluido.
          Un Brand Kit bien construido y bien activado libera al equipo
          para hacer lo que importa: diseñar, iterar y conectar con usuarios.
        </p>
      `,
      relatedArticles: [
        { id: "2", title: "Coherencia Visual: Estandariza tus Documentos" },
        { id: "1", title: "Diseño que Evoluciona" },
        { id: "7", title: "Brief de diseño: la hoja de ruta que acorta proyectos" }
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
    
    // ─────────────────────────────────────────────────────────────────────────────
    
    "11": {
      id: 11,
      titleHTML: `
        Iteraciones Rápidas:
        <span class="opacity-70">prototipado que minimiza riesgos</span>
      `,
      date: "25 de mayo, 2026",
      imagenDesktop: "assets/img/hero-article/Articulo11/img-article-11-3840@2x.webp",
      imagenMobile: "assets/img/hero-article/Articulo11/img-article-11-750@2x.webp",
      ogImage: "mi-portafolio/assets/img/og-images/og-article-11@2x.webp",
      aboutHTML: `
        <span class="opacity-70">
          Soy Macarena, <strong>UX/UI Designer & Front-End Prototyper,</strong>
          y creo que validar rápido es un acto de cuidado hacia el equipo:
          prototipos bien hechos ahorran tiempo y mantienen la visión del producto.
          Cuando no construyo prototipos, pruebo nuevas herramientas ágiles
          con un helado Amarena en mano.
        </span>
      `,
      imageUrl: "assets/img/coveraboutme/avatar-5-400@2x.webp",
      imageAlt: "Imagen de mí",
      content: `
        <p>
          En un proyecto me tocó ser parte del equipo que tuvo que rehacer semanas
          de desarrollo porque la idea no se había probado antes de programarla.
          No fue error de nadie en particular — fue un proceso que no tenía
          un momento de validación antes de escribir código.
        </p>
        <p>
          Desde entonces, propongo prototipar temprano en cada proyecto donde tengo
          esa posibilidad. No como regla, sino porque he visto la diferencia:
          un prototipo de dos días puede evitar dos semanas de retrabajo.
          Y eso cuida el tiempo de todo el equipo, no solo del mío.
        </p>
    
        <hr>
    
        <h2 class="mt-5 fontpoppins opacity-100">El problema</h2>
    
        <p>
          Cuando se construye sin validar primero, el costo del error sube con cada etapa.
          Lo que es un ajuste rápido en un prototipo se convierte en un cambio de código
          una semana después. Los plazos se estiran, la confianza del equipo baja
          y nadie entiende bien por qué.
        </p>
        <p>
          Probar antes no es desconfiar del diseño — es cuidar el esfuerzo
          que viene después.
        </p>
    
        <p class="text-center fs-6 my-4 bg-canva p-3">
          "La transformación ágil no es un proyecto; es un cambio cultural."
          — <em>Michael Sahota</em>
        </p>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">Mi proceso — lo que hice</h2>
    
        <ul>
    
          <li class="mb-5">
            <strong><em>Laboratoria — sprints cortos (formación)</em></strong>
            <p>
              Durante el diplomado trabajamos en sprints cortos y hackathons de 24 horas
              para pasar de idea a prototipo. Aprendí a tomar decisiones rápidas
              sin perder el foco del usuario — y a trabajar en ciclos cortos
              donde cada iteración tiene un aprendizaje claro.
            </p>
            <p>
              <strong><em>Lo que me llevé:</em></strong> la práctica de iterar como rutina
              hace que el equipo se mueva con más seguridad. No por velocidad —
              por claridad en cada paso.
            </p>
          </li>
    
          <li class="mb-5">
            <strong><em>FOL — trabajo junto a TI (proyecto profesional)</em></strong>
            <p>
              Me integré desde el inicio a las reuniones técnicas del equipo de TI,
              armé prototipos en HTML y trabajé en ciclos cortos junto a desarrollo.
              El objetivo era que el traspaso fuera lo más fluido posible.
            </p>
            <p>
              <strong><em>Lo que aprendí:</em></strong> cuando desarrollo conoce la hipótesis
              y ve el prototipo temprano, las preguntas técnicas aparecen antes
              — y eso ahorra tiempo en ambas direcciones.
            </p>
          </li>
    
        </ul>
    
        <p class="text-center fs-6 my-4 bg-canva p-3">
          "En un equipo Scrum, todos están dando lo máximo siempre,
          buscando apoyar a sus compañeros en lo que requieran." — <em>Jorge Abad</em>
        </p>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">Lo que funciona en la práctica</h2>
    
        <ol>
          <li class="mb-3">
            <strong><em>Empieza con lo mínimo que pruebe la idea.</em></strong>
            <p>
              Un prototipo simple que permita probar la tarea clave — registro, compra,
              envío — ya da pistas reales. No necesita ser perfecto para ser útil.
            </p>
          </li>
          <li class="mb-3">
            <strong><em>Valida el flujo antes que la estética.</em></strong>
            <p>
              Primero comprueba si la gente entiende el camino.
              Los detalles visuales vienen después, cuando el flujo ya tiene sentido.
            </p>
          </li>
          <li class="mb-3">
            <strong><em>No subas la fidelidad hasta estar seguro.</em></strong>
            <p>
              El prototipo en HTML/CSS tiene sentido cuando el flujo y el contenido
              ya están validados. Antes de eso, es construir sobre suposiciones.
            </p>
          </li>
          <li class="mb-3">
            <strong><em>Cada prueba responde una pregunta.</em></strong>
            <p>
              ¿El usuario completa el registro sin ayuda? Esa es la pregunta del test —
              una sola. Cuando se mezclan varias preguntas, los resultados
              son difíciles de interpretar.
            </p>
          </li>
          <li class="mb-3">
            <strong><em>Documenta lo que aprendes.</em></strong>
            <p>
              Un registro simple — fecha, hipótesis, hallazgo, decisión — evita repetir
              los mismos errores y hace claro para todo el equipo por qué algo cambió.
            </p>
          </li>
        </ol>
    
        <h4 class="mb-3 mt-5">Método que uso</h4>
        <ul>
          <li><strong>Hipótesis en 1 línea.</strong> Ej.: "El 70% de usuarios completará el registro en menos de 2 minutos."</li>
          <li><strong>Métrica principal.</strong> Una sola — tasa de éxito, tiempo o errores críticos.</li>
          <li><strong>Ronda rápida:</strong> 3 a 5 usuarios para detectar los problemas más importantes.</li>
          <li><strong>Entregable:</strong> prototipo click-through + notas de hallazgos priorizados.</li>
        </ul>
    
        <p>
          <small>
            <strong>Consejo:</strong> no siempre se puede reclutar usuarios externos.
            Colegas, stakeholders o personas representativas del equipo sirven para una primera ronda.
            Lo importante es observar, no la perfección de la muestra.
          </small>
        </p>
    
        <hr class="my-5">
    
        <h4 class="mb-3">KPIs sencillos</h4>
        <ul>
          <li><strong>% de tareas completadas</strong> — cuántos usuarios lograron la tarea.</li>
          <li><strong>Tiempo medio por tarea</strong> — cronómetro y registro.</li>
          <li><strong>Problemas críticos</strong> — lista corta de errores que impiden completar la tarea.</li>
        </ul>
        <p>
          <small>
            <strong>Registro simple:</strong> una hoja con columnas —
            usuario / tarea / tiempo / completó (sí/no) / nota.
            Así hay evidencia para decidir y compartir con el equipo.
          </small>
        </p>
    
        <hr class="my-5">
    
        <p class="text-center fs-6 my-4 bg-canva p-3">
          "La forma más costosa de probar tu idea es desarrollar software de calidad de producción."
          — <em>Jeff Patton</em>
        </p>
    
        <hr>
    
        <h4 class="mb-3 mt-5">Herramientas que se suelen usar</h4>
        <ul>
          <li><strong>Prototipado interactivo:</strong> Figma, Adobe XD, ProtoPie.</li>
          <li><strong>Maquetas y arte final:</strong> Illustrator, Photoshop.</li>
          <li><strong>Testing:</strong> Lookback, Maze, UserTesting.</li>
          <li><strong>Documentación y handoff:</strong> Notion, Google Sheets, Storybook.</li>
          <li><strong>Registro y grabación:</strong> Loom, Zoom.</li>
        </ul>
    
        <p class="text-center fs-6 my-4 bg-canva p-3">
          "Construir — Medir — Aprender" — <em>Eric Ries</em>
        </p>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">Procesos de equipo que sostienen iteraciones sanas</h2>
    
        <p>
          Prototipar rápido funciona mejor cuando hay acuerdos de equipo que lo sostienen.
          En los proyectos donde he podido proponer o co-construir estos acuerdos,
          el ritmo de trabajo mejoró notablemente:
        </p>
    
        <ul class="mb-5">
          <li class="mb-3">
            <strong><em>Sprints cortos con foco.</em></strong>
            <p>
              1 o 2 hipótesis clave por sprint. Menos frentes abiertos, más claridad
              en cada entrega.
            </p>
          </li>
          <li class="mb-3">
            <strong><em>Standups útiles.</em></strong>
            <p>
              10 a 15 minutos para sincronizar bloqueos — no para reportar todo.
              Cuando el standup es corto y enfocado, el equipo queda con energía.
            </p>
          </li>
          <li class="mb-3">
            <strong><em>Demos rápidas al final del sprint.</em></strong>
            <p>
              Mostrar lo probado en 20 a 30 minutos alinea a producto, negocio y desarrollo.
              Cuando todos ven lo que funcionó y lo que no, las decisiones son más claras.
            </p>
          </li>
          <li class="mb-3">
            <strong><em>Definición clara de "listo".</em></strong>
            <p>
              Qué incluye una entrega: diseño, microcopy, assets optimizados, notas para desarrollo.
              Cuando "listo" significa lo mismo para todos, hay menos malentendidos en el handoff.
            </p>
          </li>
          <li class="mb-3">
            <strong><em>Desarrollo presente desde el prototipo.</em></strong>
            <p>
              Cuando el equipo de desarrollo conoce la hipótesis y ve el prototipo temprano,
              las preguntas técnicas aparecen antes — y eso ahorra tiempo en ambas direcciones.
            </p>
          </li>
        </ul>
    
        <p>
          <strong><em>Estos son acuerdos, no reglas rígidas.</em></strong> Cada equipo los adapta a su contexto.
          Lo que sí he visto en todos los casos: cuando existen y todos los respetan,
          el trabajo fluye mejor y las personas se desgastan menos.
        </p>
    
        <div class="bg-canva mt-5 p-5">
          <h4 class="text-center fontpoppins-semibold pb-4 opacity-100">FAQ´s</h4>
    
          <p><strong>¿Por qué con 5 usuarios alcanza para empezar?</strong></p>
          <p>
            5 usuarios suelen ser suficientes para identificar los problemas más críticos
            de usabilidad en una primera ronda. Si aparecen patrones, se amplía la muestra
            en rondas siguientes.
          </p>
    
          <hr>
    
          <p><strong>¿Y si no hay presupuesto para usuarios externos?</strong></p>
          <p>
            Se puede hacer guerrilla testing con compañeros, clientes internos o personas
            cercanas al perfil. Lo clave es observar sin interferir y registrar lo que pasa.
          </p>
    
          <hr>
    
          <p><strong>¿Cómo avanzar en empresas donde las decisiones toman tiempo?</strong></p>
          <p>
            Proponer entregas pequeñas y visibles ayuda mucho: un tablero compartido,
            una demo rápida al cierre de cada ciclo, un hallazgo concreto en cada reunión.
            Los resultados visibles generan confianza y esa confianza abre espacio
            para iterar con más velocidad.
          </p>
        </div>
    
        <hr class="my-5">
    
        <p>
          Prototipar temprano no es solo una técnica — es una forma de cuidar el tiempo
          de las personas con quienes trabajo. Cuando el equipo ve que una ronda de pruebas
          de dos días evitó semanas de retrabajo, el hábito se instala solo.
          Y el producto que llega a producción es mejor para todos.
        </p>
      `,
      relatedArticles: [
        { id: "1",  title: "Diseño que Evoluciona" },
        { id: "6",  title: "Investigación UX: mapas, A/B y observación en contexto" },
        { id: "12", title: "Colabora con IA: en tu Proceso de Diseño" }
      ],
      relatedProjects: [
        {
          title: "Givit: prototipo interactivo de marketplace",
          url: "https://www.behance.net/gallery/132995601/Diseno-Givit"
        },
        {
          title: "Diseño Web & Prototipado de la Sección \"Premio CBC\"",
          url: "https://www.behance.net/gallery/229571505/rototipado-de-la-Seccion-Premio-CBC"
        },
        {
          title: "Dashboard Responsivo para Banco Comafi",
          url: "https://www.behance.net/gallery/229563933/Diseno-y-Prototipado-Front-end-de-Dashboard"
        }
      ]
    },
    
    // ─────────────────────────────────────────────────────────────────────────────
    
    "12": {
      id: 12,
      titleHTML: `
        IA
        <span class="opacity-70">en Diseño</span>
      `,
      date: "25 de mayo, 2026",
      imagenDesktop: "assets/img/hero-article/Articulo12/img-article-12-3840@2x.webp",
      imagenMobile: "assets/img/hero-article/Articulo12/img-article-12-750@2x.webp",
      ogImage: "mi-portafolio/assets/img/og-images/og-article-12@2x.webp",
      aboutHTML: `
        <span class="opacity-70">
          Soy Macarena, <strong>UX/UI Designer & Front-End Prototyper.</strong>
          Trabajo mezclando diseño, prototipado front-end (HTML/CSS) y Brand Systems
          para convertir ideas en productos útiles. Uso la IA para eliminar tareas
          repetitivas y dedicar más tiempo a la estrategia, las pruebas y el detalle humano.
          Cuando no estoy afinando prompts, me encontrarás disfrutando de mi sándwich favorito.
        </span>
      `,
      imageUrl: "assets/img/coveraboutme/avatar-6-400@2x.webp",
      imageAlt: "Imagen de mí",
      content: `
        <p>
          Pedí cinco paletas en segundos. Usé ese tiempo en revisar contraste y accesibilidad
          — algo que normalmente me lleva mucho más. En ese proyecto, la velocidad
          me permitió llegar a la versión final en una sola reunión con el cliente.
        </p>
        <p>
          <strong>La IA me dio velocidad. Yo decidí si la salida valía la pena.</strong>
          Esa distinción es la que más me importa: la herramienta acelera,
          el criterio sigue siendo mío.
        </p>
        <p>
          Aquí cuento mi flujo para integrar IA en el proceso de diseño:
          qué delego, cómo valido y qué nunca dejo sin revisión humana.
        </p>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">El problema</h2>
    
        <p>
          Sin un método claro, la IA produce variantes sueltas: copys con tonos distintos,
          imágenes que no respetan la identidad o código que funciona pero no se puede mantener.
          Si no guardo los prompts que funcionan, pierdo reproducibilidad.
          Y usar IA por usarla, sin integrarla al proceso, complica más de lo que ayuda.
        </p>
    
        <h4 class="mb-3 mt-5">Dónde me ayuda la IA</h4>
        <ul>
          <li><strong>Exploración visual y paletas</strong> — arranque rápido para propuestas.</li>
          <li><strong>Microcopy y variantes</strong> — pruebas de CTAs y titulares para A/B.</li>
          <li><strong>Snippets de código</strong> — reduce el boilerplate; siempre reviso calidad y seguridad.</li>
          <li><strong>Operaciones internas</strong> — plantillas de email, agendas y resúmenes.</li>
          <li><strong>Testing preparatorio</strong> — generar variantes para probar con usuarios.</li>
        </ul>
    
        <p class="text-center fs-6 my-4 bg-canva p-3">
          "En encuestas a diseñadores, la mayoría dice que la IA aumenta la eficiencia,
          pero menos de la mitad asegura que los hace 'mejores' profesionales —
          lo que confirma que el criterio humano sigue siendo clave."
          — <em>
            <a
              href="https://www.figma.com/blog/figma-2025-ai-report-perspectives/"
              class="a-small px-1"
              target="_blank"
              rel="noopener noreferrer"
              title="Ir a la fuente"
              data-bs-toggle="tooltip"
            >Figma</a>
          </em>
        </p>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">Mi proceso — lo que hice</h2>
    
        <h4 class="mt-4 mb-3 fontpoppins opacity-100">Cómo lo integro en 4 pasos</h4>
        <ul>
          <li><strong>Generar</strong> — pido 5 a 10 opciones rápidas: paletas, textos, snippets.</li>
          <li><strong>Filtrar</strong> — elijo 2 o 3 con criterio: legibilidad, voz de marca, factibilidad técnica.</li>
          <li><strong>Validar</strong> — pruebo las mejores con un colega o con usuarios, según lo que se trate.</li>
          <li><strong>Documentar</strong> — guardo el prompt, la versión del modelo y la salida final con notas.</li>
        </ul>
    
        <p>
          Este flujo convierte una herramienta rápida en un recurso reproducible.
          Lo que funciona queda registrado para la próxima vez.
        </p>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">Buenas prácticas de prompts</h2>
    
        <ul class="my-3">
          <li>
            <strong><em>Sé específico desde el inicio:</em></strong> indica audiencia, tono, longitud y formato.
            <br><small><em>Ej.: "Escribe 6 CTAs para registro, dirigidos a emprendedoras, tono cordial y directo, 3–5 palabras."</em></small>
          </li>
          <li>
            <strong><em>Pide variantes y explicaciones:</em></strong> solicita 3 opciones y una línea
            que explique por qué cada una funciona. Así entiendes la intención, no solo la salida.
          </li>
          <li>
            <strong><em>Da contexto fijo:</em></strong> incluye siempre un brief corto —
            qué hace el producto, para quién y qué no debe decir. Eso reduce resultados fuera de tono.
          </li>
          <li>
            <strong><em>Controla el alcance:</em></strong> si quieres ideas, dilo.
            Si quieres texto listo para publicar, dilo también. Evita ambigüedades desde el principio.
          </li>
          <li>
            <strong><em>Itera el prompt, no solo la versión final:</em></strong>
            un pequeño cambio en una palabra puede mejorar mucho la salida.
            Guarda cada versión que funcione.
          </li>
          <li>
            <strong><em>Guarda todo en un solo lugar:</em></strong> Notion o Google Drive,
            con fecha, modelo y salida final. Así reproduces lo que funcionó
            cuando lo necesites de nuevo.
          </li>
          <li>
            <strong><em>Valida siempre con criterio humano:</em></strong> corrige el estilo,
            comprueba los datos y prueba las frases con una persona real antes de publicar.
          </li>
          <li>
            <strong><em>Ten un prompt base de marca:</em></strong> una frase fija que añades siempre
            — ej.: "Tono: cercano, profesional; evitar jergas técnicas."
            Úsalo como contexto predeterminado en cada sesión.
          </li>
        </ul>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">Prompts listos para copiar</h2>
    
        <ol class="my-3">
          <li class="mb-4">
            <strong><em>Paletas rápidas</em></strong>
            <br>"Dame 5 paletas HEX para una UI minimalista orientada al bienestar.
            Indica contraste (alto/medio/bajo) y uso recomendado (fondo/texto/acento)."
          </li>
          <li class="mb-4">
            <strong><em>Microcopy CTA</em></strong>
            <br>"Escribe 6 variantes de CTA para 'registro' dirigido a emprendedoras;
            tono cordial y directo; 3–5 palabras."
          </li>
          <li class="mb-4">
            <strong><em>Snippet HTML/CSS</em></strong>
            <br>"Genera un snippet HTML/CSS para una card responsive con imagen, título y botón;
            incluye variables CSS para color y spacing. Añade 2 sugerencias de accesibilidad."
          </li>
          <li class="mb-4">
            <strong><em>Prompt base UX/UI</em></strong>
            <br>"Contexto: [funcionalidad]. Audiencia: [perfil, dispositivo]. Objetivo: [acción clave].
            Prioridad: [accesibilidad/rendimiento/conversión]. Entregable: [CTA/microcopy/form].
            Estilo: claro y directo. Genera 6 variantes e indica la más accesible."
          </li>
        </ol>
    
        <hr class="my-5">
    
        <h2 class="mt-5 fontpoppins opacity-100">Cómo medir sin complicarte</h2>
    
        <ul class="my-3">
          <li><strong>Tiempo ahorrado por tarea</strong> — minutos antes vs. después.</li>
          <li><strong>Variantes útiles por hora</strong> — cuántas salidas sirven de verdad.</li>
          <li>
            <strong>Porcentaje de salidas reutilizadas sin edición</strong> —
            si baja, ajusto el prompt con más contexto, ejemplo y formato.
          </li>
        </ul>
    
        <p>
          <small>
            <strong>Registro simple:</strong> una hoja con columnas —
            tarea / tiempo antes / tiempo después / variantes generadas / uso final.
          </small>
        </p>
    
        <p class="mt-4">
          <strong>Ética y legal — lo imprescindible:</strong>
          verifica siempre la información que genera la IA, cuida la representación
          para evitar estereotipos y revisa las licencias antes de usar imágenes
          o assets en productos comerciales. No subas datos sensibles a modelos públicos
          sin permisos claros.
        </p>
    
        <hr class="my-5">
    
        <div class="bg-canva p-5">
          <h4 class="text-center fontpoppins-semibold pb-4 opacity-100">FAQ´s</h4>
    
          <p><strong>¿La IA reemplazará al diseñador?</strong></p>
          <p>
            No. Automatiza tareas repetitivas y amplifica el criterio —
            pero quien valida, decide y aplica el contexto humano sigue siendo esencial.
            La IA no sabe qué es lo que el usuario necesita: eso lo sé yo después
            de haber investigado.
          </p>
    
          <hr>
    
          <p><strong>¿Cómo evito resultados fuera de tono?</strong></p>
          <p>
            Con un prompt que incluya audiencia, tono y restricciones claras desde el inicio.
            Pedir variantes y editar antes de publicar. Y tener un repositorio de prompts
            validados para no empezar de cero cada vez.
          </p>
    
          <hr>
    
          <p><strong>¿Qué hago si no tengo presupuesto para herramientas de pago?</strong></p>
          <p>
            Versiones gratuitas o períodos de prueba son suficientes para empezar.
            Lo importante es documentar resultados antes de invertir —
            así la decisión de compra tiene base real.
          </p>
        </div>
    
        <hr class="my-5">
    
        <p>
          <strong>La IA me dio tiempo: tiempo para pensar, para conversar con usuarios
          y para cuidar los detalles que marcan la diferencia.</strong>
          Pero la velocidad sin método es ruido. Mi forma es simple:
          genero, filtro, pruebo y documento.
          Así una herramienta rápida se convierte en un recurso confiable
          que aporta al proceso del equipo, no solo al mío.
        </p>
      `,
      relatedArticles: [
        { id: "6",  title: "Investigación UX: mapas, A/B y observación en contexto" },
        { id: "8",  title: "El Retorno de Inversión en UX: Por Qué Vale la Pena" },
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