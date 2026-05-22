/* projects-others.js
// ------------------------------------------------------------
 * Manejo de pestañas "otros proyectos" y carga/inyección de imágenes.
 *
 * Propósito:
 *  - Mantener un conjunto de "panes" (HTML por tab) inyectables desde JS.
 *  - Inicializar imágenes dentro de esos panes usando ImageHelper (si existe)
 *    o aplicar fallbacks (background-image / src / srcset).
 *  - Sincronizar hash / history con tabs y soportar Bootstrap Tabs cuando esté presente.
 *  - Observar cambios dinámicos (MutationObserver) y re-procesar elementos con data-img-class.
 *
 * Autor: Macarena Baltra — Product & UX Designer
 * Fecha: 12-09-2025.
 ------------------------------------------------------------ */

(function () {
  'use strict';

  const DEBUG = false; // cambia a true para ver logs
  const log = (...args) => { if (DEBUG) console.log('[projects-others]', ...args); };
  const warn = (...args) => { if (DEBUG) console.warn('[projects-others]', ...args); };

  /* -------------------- Contenido de cada pane (pega tu HTML en las cadenas) -------------------- */
  const PANES = {
    'ux-tab-pane': `
      <div class="row">
          <!-- CBC Web -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-uxui-cbcpweb@2x.webp" class="card-img-top" alt="Prototipo responsive de rediseño de la web de CBC en HTML5, CSS3 y Bootstrap 4" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-primary">Rediseño & Prototipado Web</span> para CBC</h3>
                <p class="textdescriptions"><small><em>2020</em></small></p>
                <p class="card-text">Como <strong><em>UX Architect y Prototyper Developer</em></strong> redefiní la arquitectura de información de CBC — card sorting, journey maps y un MVP responsivo en HTML5/CSS3/Bootstrap 4 que el equipo de desarrollo usó como referencia directa.</p>
                <p class="card-text"><small><strong><em>Resultado:</em></strong> +40% tráfico orgánico · +25% leads · prototipo ready-to-code.</small></p>
                <p class="opacity-75"><small>UX Architecture | Prototipado Web | Critical Journey Map | SEO On-Page | MVP Scalable</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DLgkRMSMpIv/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/229258475/Rediseno-Prototipado-Web-para-CBC-%282020%29" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="landing-projects-d-CBC.html" target="_blank" aria-label="Ver más" title="Ver en Proyecto Destacado" data-bs-toggle="tooltip"><i class="fa fa-eye"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="landing-blog-article.html?article=1" target="_blank" aria-label="Blog" title="Este proyecto se menciona como inspiración en el siguiente artículo" data-bs-toggle="tooltip"><i class="fa-solid fa-quote-right"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- CBC Web -->
          <!-- Perfil de Inversionista -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-uxui-folperfildeinversionista@2x.webp" class="card-img-top" alt="Pantallas de sección Perfil de Inversionista en app FOL con gráficos interactivos y tips financieros" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-secondary">App “Perfil de Inversionista”</span> para FOL</h3>
                <p class="textdescriptions"><small><em>2018</em></small></p>
                <p class="card-text">Diseñé la sección <em>"Perfil de Inversionista"</em> de FOL con prototipos responsivos, user flows claros y gráficas intuitivas — guiando al usuario desde la configuración inicial hasta la recepción de consejos personalizados sin fricción.</p>
                <p class="card-text"><small><strong><em>Entregable:</em></strong> prototipo interactivo validado con stakeholders · flujos documentados · listo para desarrollo.</small></p>
                <p class="opacity-75"><small>UX Strategy | User/Task Flow | Prototipo Responsive</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DLlMwLhyZZW/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/229418197/Perfil-de-Inversionista-en-App-FOL-%282018%29" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="landing-blog-article.html?article=8" target="_blank" aria-label="Blog" title="Este proyecto se menciona como inspiración en el siguiente artículo" data-bs-toggle="tooltip"><i class="fa-solid fa-quote-right"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Perfil de Inversionista -->
          <!-- Manual OPL para Voluntarios Minka -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-uxui-manualoplminka@2x.webp" class="card-img-top" alt="Página del Manual OPL de limpieza, convivencia y seguridad para voluntarios de Hostal Casona Minka" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-primary">Manual OPL </span> para Voluntarios de Casona Minka</h3>
                <p class="textdescriptions"><small><em>2019</em></small></p>
                <p class="card-text">Diseñé un Manual OPL de limpieza y convivencia para Casona Minka — documentando procesos operativos en un lenguaje visual claro que cualquier voluntario podía implementar sin capacitación previa.</p>
                <p class="card-text"><small>El manual fue tan efectivo que se escaló a seguridad y mantenimiento, estandarizando la operación completa del hostal.</small></p>
                <p class="opacity-75"><small>Manual OPL | UX Interno | Procesos Estandarizados</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DLnbeYNSgf6/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/229491573/Manual-OPL-para-Voluntarios-de-Casona-Minka" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="landing-blog-article.html?article=5" target="_blank" aria-label="Blog" title="Este proyecto se menciona como inspiración en el siguiente artículo" data-bs-toggle="tooltip"><i class="fa-solid fa-quote-right"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Manual OPL para Voluntarios Minka -->
           <!-- BLOG CBC -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-uxui-cbcblog@2x.webp" class="card-img-top" alt="Interfaz del MVP de blog corporativo CBC con diseño UX/UI estratégico y back‑office integrado" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-secondary">Diseño y Prototipo de Blog</span> para CBC</h3>
                <p class="textdescriptions"><small><em>2020</em></small></p>
                <p class="card-text">Convertí la comunicación por email de CBC en un blog corporativo responsive — diseñado en HTML5/CSS3/Bootstrap con flujos de usuario optimizados para que el equipo de Información gestionara el contenido desde back-office sin depender del área técnica.</p>
                <p class="card-text"><small><strong><em>Entregable:</em></strong> prototipo ready-to-code · guía de implementación para el equipo responsable.</small></p>
                <p class="opacity-75"><small>Blog Corporativo | HTML5/CSS3 | Bootstrap | User/Task Flows | MVP Ready-to-Code</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DLiftbVSbw3/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/229331173/Diseno-y-Prototipo-de-Blog-Corporativo" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="landing-blog-article.html?article=5" target="_blank" aria-label="Blog" title="Este proyecto se menciona como inspiración en el siguiente artículo" data-bs-toggle="tooltip"><i class="fa-solid fa-quote-right"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- BLOG CBC -->
           <!-- Experiencia Perú -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-uxui-viajeperu@2x.webp" class="card-img-top" alt="Mockup de app Experiencia Perú y flujos de usuario simplificados" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-primary">Experiencia Perú:</span> App de Viaje Personalizado</h3>
                <p class="textdescriptions"><small><em>2019</em></small></p>
                <p class="card-text">Diseñé "Experiencia Perú" — una app personal de viaje personal que permitió a un padre y su hija revivir juntos su recorrido por Perú, adaptando el contenido a cada generación.</p>
                <p class="card-text"><small>Un caso de diseño empático donde la investigación de usuarios definió cada decisión de flujo e interfaz.</small></p>
                <p class="opacity-75"><small>UX/UI Design | MVP prototipo | User/Task Flow | Experiencia de Usuario</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DLlB8LtS3GU/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/79983291/Conoce-Peru" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Experiencia Perú -->          
          <!-- Chatbot CBC -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-uxui-cbcchatbot@2x.webp" class="card-img-top" alt="Mockup de burbuja de chatbot automatizado para CBC mostrando opciones de búsqueda, FAQs y videos tutoriales" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-secondary">Burbuja de Chatbot </span> para CBC</h3>
                <p class="textdescriptions"><small><em>2022</em></small></p>
                <p class="card-text">Diseñé la burbuja de chatbot de CBC con cuatro rutas de ayuda — búsqueda libre, FAQs, videos y asesor personalizado — basada en investigación híbrida con usuarios reales y validada con mockups responsivos antes de llegar a desarrollo.</p>
                <p class="card-text"><small><strong><em>Entregable:</em></strong> flujos documentados · mockups responsivos · especificaciones para implementación.</small></p>
                <p class="opacity-75"><small>Chatbot UX | Automatización Cliente | User/Task Flows | MVP</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DLnmgKHS9he/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/229497459/Burbuja-de-Chatbot-Inteligente-para-CBC-%282022%29" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="landing-blog-article.html?article=8" target="_blank" aria-label="Blog" title="Este proyecto se menciona como inspiración en el siguiente artículo" data-bs-toggle="tooltip"><i class="fa-solid fa-quote-right"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Chatbot CBC -->
          <!-- Estandarización de Documentos CBC -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-uxui-cbcmanualdedocumentos@2x.webp" class="card-img-top" alt="Plantillas estandarizadas de documentos internos CBC alineadas al Brand System" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-primary">Estandarización &amp; Manual de Documentos</span> para CBC</h3>
                <p class="textdescriptions"><small><em>2020</em></small></p>
                <p class="card-text">Unifiqué la imagen de todos los documentos del área de Información de CBC basándome en el Brand System existente — mapeando flujos de usuario, estandarizando plantillas y creando un manual de implementación para que cualquier integrante del equipo mantuviera la coherencia sin asistencia.</p>
                <p class="card-text"><small><strong><em>Resultado:</em></strong> documentación estandarizada · manual de uso.</small></p>
                <p class="opacity-75"><small>Estandarización de Documentos | UX/UI Strategy | User Flow | Experiencia de Usuario</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DLirllmSpai/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/229336493/Estandarizacion-Manual-de-Documentos-para-CBC" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="landing-blog-article.html?article=2" target="_blank" aria-label="Blog" title="Este proyecto se menciona como inspiración en el siguiente artículo" data-bs-toggle="tooltip"><i class="fa-solid fa-quote-right"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Estandarización de Documentos CBC -->
        </div>    
    `,         // UX/UI Design Strategy
    'frontend-tab-pane': `
        <div class="row">
    <!-- Austral Web -->
      <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-frontend-austral@2x.webp" class="card-img-top" alt="Prototipo clickable de plataforma e‑learning de Austral Group en HTML5 y Bootstrap" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-secondary">Aulas Virtuales e-Learning</span> para Austral Group</h3>
                <p class="textdescriptions"><small><em>2019</em></small></p>
                <p class="card-text">Como <strong><em>Prototyper Developer</em></strong> construí prototipos clicables en HTML5/SASS/Bootstrap para el sitio web, plataforma e-learning y back-office de Austral Group — entregables que el equipo de TI podía revisar en el navegador y usar como referencia directa de construcción.</p>
                <p class="card-text"><small><strong><em>Proyección:</em></strong> al menos un 40% menos tiempo en validación interna · interfaz unificada para estudiantes internacionales y gestores.</small></p>
                <p class="opacity-75"><small>Prototipado Web | HTML5 CSS3 | Bootstrap | MVP ready-to-code</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DLau1zjyR88/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/112151519/Proyecto-Austral-Group" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="landing-projects-d-australGroup.html" target="_blank" aria-label="Ver más" title="Ver en Proyecto Destacado" data-bs-toggle="tooltip"><i class="fa fa-eye"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="landing-blog-article.html?article=7" target="_blank" aria-label="Blog" title="Este proyecto se menciona como inspiración en el siguiente artículo" data-bs-toggle="tooltip"><i class="fa-solid fa-quote-right"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Austral Web -->
          <!-- Givit -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-frontend-givitpweb@2x.webp" class="card-img-top" alt="Prototipo HTML5/CSS3 de la página de marketplace Givit con diseño responsive en Bootstrap" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-primary">Givit:</span> prototipo interactivo de marketplace</h3>
                <p class="textdescriptions"><small><em>2019</em></small></p>
                <p class="card-text">Convertí wireframes estáticos en un prototipo interactivo en HTML5/CSS3/Bootstrap para el marketplace Givit — construyendo el flujo y la experiencia de compradores y vendedores, documentados listos para desarrollo.</p>
                <p class="opacity-75"><small>Prototipado Bootstrap | Marketplace | Front-End</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/reel/C0M07t5uyPX/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/132995601/Diseno-Givit" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Givit -->
          <!-- Banco Comafi Dashboard -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-frontend-comafi@2x.webp" class="card-img-top" alt="Dashboard responsivo de Banco Comafi prototipado en HTML5 y CSS3" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-secondary">Dashboard Responsivo </span> para Banco Comafi</h3>
                <p class="textdescriptions"><small><em>2018</em></small></p>
                <p class="card-text">Diseñé y desarrollé un dashboard financiero responsivo en HTML5/CSS3 para Banco Comafi — <strong><em>validado en dos ciclos Agile y alineado al Brand System corporativo.</em></strong> Cada componente fue entregado con documentación técnica para el equipo de QA e implementación.</p>
                <p class="opacity-75"><small>Prototipado Dashboard | HTML5 CSS3 | QA to code | Agile Prototyping</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/reel/DLpwDwLNHQ1/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/229563933/Diseno-y-Prototipado-Front-end-de-Dashboard" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Banco Comafi Dashboard -->
           <!-- Premio CBC -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-frontend-premiocbc@2x.webp" class="card-img-top" alt="Mockup de la sección Premio CBC con estados: antiguo ganador, convocatoria, timeline y galería de ganadores" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-primary">Diseño Web &amp; Prototipado</span> de “Premio CBC”</h3>
                <p class="textdescriptions"><small><em>2022</em></small></p>
                <p class="card-text">Diseñé y prototipé la sección web "Premio CBC" en HTML5/CSS3/Bootstrap — definiendo cuatro estados automatizados (ganador, invitación, timeline y galería) para que la sección se actualizara sola en cada edición anual sin intervención del diseñador.</p>
                <p class="card-text"><small><strong><em>Resultado:</em></strong> sistema autónomo · prototipo ready-to-code · documentación de estados entregada.</small></p>
                <p class="opacity-75"><small>Prototipado Web | HTML5 CSS3 | Bootstrap | MVP ready-to-code</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/reel/DLp6jJZx--D/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/229571505/rototipado-de-la-Seccion-Premio-CBC" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Premio CBC -->
          <!-- Plataforma CBC -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-frontend-plataformaCBC@2x.webp" class="card-img-top" alt="Mockup de prototipo front-end de la plataforma CBC en HTML5 y CSS3 mostrando módulos renovados y flujos de usuario" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-secondary">Actualizaciones Front-End</span> de Plataforma CBC</h3>
                <p class="textdescriptions"><small><em>2020–2023</em></small></p>
                <p class="card-text">Actualicé módulos obsoletos de la plataforma CBC en HTML5/CSS3 — redefiniendo task flows, mensajes de estado y <strong><em>componentes UI alineados al nuevo Brand System.</em></strong> Cada módulo entregado con documentación técnica para garantizar coherencia en futuras iteraciones.</p>
                <p class="opacity-75"><small>UX/UI Design | Prototipado Web | HTML5 CSS3 | Bootstrap</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DLsRJJ7stBt/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/229579245/Diseno-Prototipado-Front-End-de-Plataforma-CBC" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="landing-blog-article.html?article=1" target="_blank" aria-label="Blog" title="Este proyecto se menciona como inspiración en el siguiente artículo" data-bs-toggle="tooltip"><i class="fa-solid fa-quote-right"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Plataforma CBC -->          
          <!-- pagina web de CBC -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-frontend-pwebcbc@2x.webp" class="card-img-top" alt="Mockup de la versión renovada de la web CBC en HTML5, CSS3 y Bootstrap 4 con diseño responsivo y navegación optimizada" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-primary">Prototipado &amp; Mantenimiento Front-End</span> de la Web CBC</h3>
                <p class="textdescriptions"><small><em>2020–2023</em></small></p>
                <p class="card-text"><strong><em>Mantuve y evolucióné la capa front-end de CBC durante 3 años</em></strong> — componentes responsivos en HTML5/CSS3/Bootstrap 4 entregados con documentación técnica en cada iteración para que el equipo de desarrollo pudiera implementar sin ambigüedades.</p>
                <p class="opacity-75"><small>Bootstrap 4 | Renovación Front-end | User/Task Flows | HTML5 CSS3</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DLsLeySMdog/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/229631545/Prototipado-Mantenimiento-Front-End-de-la-Web-CBC" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="landing-blog-article.html?article=6" target="_blank" aria-label="Blog" title="Este proyecto se menciona como inspiración en el siguiente artículo" data-bs-toggle="tooltip"><i class="fa-solid fa-quote-right"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- pagina web de CBC -->
          <!-- Prototipo Front-End: Módulo Mis Datos CBC -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-frontend-misdatoscbc@2x.webp" class="card-img-top" alt="Mockup HTML5/CSS3 del módulo Mis Datos de la plataforma CBC con diseño UI limpio y escalable" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-secondary">Módulo “Mis Datos”</span> en Plataforma CBC</h3>
                <p class="textdescriptions"><small><em>2021-2023</em></small></p>
                <p class="card-text">Prototipé el módulo "Mis Datos" de CBC en HTML5/CSS3 — diseñando un flujo intuitivo y una <strong><em>interfaz escalable alineada al Brand System,</em></strong> con componentes documentados listos para adaptarse a futuras mejoras tecnológicas sin romper la coherencia visual.</p>
                <p class="opacity-75"><small>HTML5 CSS3 | Prototipado Web | UX/UI Design | Experiencia de Usuario</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DLskei2SY5r/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/229645337/Diseno-Prototipado-Front-End-del-Modulo-Mis-Datos" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="landing-blog-article.html?article=6" target="_blank" aria-label="Blog" title="Este proyecto se menciona como inspiración en el siguiente artículo" data-bs-toggle="tooltip"><i class="fa-solid fa-quote-right"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Prototipo Front-End: Módulo Mis Datos CBC -->
        </div>    
    `,   // Prototyping & Front-end
    'brand-tab-pane': `
      <div class="row">
          <!-- Guía de Marca & Brand System para FOL -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-brandsystem-brandfol@2x.webp" class="card-img-top" alt="Página de la guía de marca FOL mostrando variantes del logotipo de FOL" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-primary">Brand System</span> para FOL Agencia de Valores SpA</h3>
                <p class="textdescriptions"><small><em>2018</em></small></p>
                <p class="card-text">Definí la paleta HEX/RGB, familias tipográficas e iconografía de FOL en un <strong><em>Brand System documentado</em></strong> que unificó la identidad visual entre Marketing, TI y partners externos — garantizando coherencia en todos los canales sin depender del diseñador para cada pieza.</p>
                <p class="card-text"><small><strong><em>Resultado:</em></strong> 50% menos tiempo en producción de assets · adopción inmediata desde el día uno.</small></p>
                <p class="opacity-75"><small>Brand System | Paleta HEX/RGB | Uso de Marca | Coherencia Visual</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/reel/C94-6L4MRa1/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/229658027/Brand-System-para-FOL-%282018%29" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="landing-projects-d-fol.html" target="_blank" aria-label="Ver más" title="Ver en Proyecto Destacado" data-bs-toggle="tooltip"><i class="fa fa-eye"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="landing-blog-article.html?article=2" target="_blank" aria-label="Blog" title="Este proyecto se menciona como inspiración en el siguiente artículo" data-bs-toggle="tooltip"><i class="fa-solid fa-quote-right"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Guía de Marca & Brand System para FOL -->
          <!-- Identidad Visual & Brand System para Hostal Casona Minka -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-brandsystem-brandMinka@2x.webp" class="card-img-top" alt="Logo de Casona Minka junto a paleta de colores e inspirados en murales de la fachada" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-secondary">Identidad Viva:</span> Marca de Hostal Casona Minka</h3>
                <p class="textdescriptions"><small><em>2019</em></small></p>
                <p class="card-text">Extraje la energía de los murales y la arquitectura de Casona Minka para construir un <strong><em>sistema de marca completo</em></strong> — colores, tipografías, reglas de uso e instrucciones de implementación que cualquier voluntario puede aplicar desde el primer día.</p>
                <p class="card-text"><small><strong><em>Resultado:</em></strong> +20% en reservas · procesos operativos 30% más ágiles.</small></p>
                <p class="opacity-75"><small>Brand System | Identidad Visual | Uso de Marca | Coherencia Visual</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DLtYpOKMxqd/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/229659497/Identidad-Viva-Marca-de-Hostal-Casona-Minka" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="landing-blog-article.html?article=2" target="_blank" aria-label="Blog" title="Este proyecto se menciona como inspiración en el siguiente artículo" data-bs-toggle="tooltip"><i class="fa-solid fa-quote-right"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Identidad Visual & Brand System para Hostal Casona Minka -->
          <!-- Logos Sandy y Academia Doble Espiral -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-brandsystem-Logossandyyacademiaespiral@2x.webp" class="card-img-top" alt="Logos de Sandy Schumacher con girasol y Academia Doble Espiral con espiral circular en color dorado y azul" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-primary">De Girasoles a Espirales:</span> Identidad de Sandy &amp; Doble Espiral</h3>
                <p class="textdescriptions"><small><em>2024</em></small></p>
                <p class="card-text"><strong><em>Diseñé la identidad visual de Sandy Schumacher y su Academia Doble Espiral</em></strong> — un girasol que emana espiritualidad y una espiral matemática creciente. Dos logos que capturan la dualidad de una marca que fusiona lo espiritual y lo científico.</p>
                <p class="card-text"><small><strong><em>Resultado:</em></strong> identidad que Sandy reconoció como 100% suya desde la primera presentación.</small></p>
                <p class="opacity-75"><small>Identidad Visual | Logotipo | Isotipo | Branding</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DLtm8J4scci/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/229661363/Diseno-de-Logos-para-Sandy-Academia-Doble-Espiral" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Logos Sandy y Academia Doble Espiral -->
          <!-- Brochure Mestranza -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-brandsystem-brochureMaestranza@2x.webp" class="card-img-top" alt="Brochure tipo revista de Maestranza San José con acabados metálicos y fotografías de procesos de metalizado" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-secondary">Brochure Corporativo</span> para Maestranza San José</h3>
                <p class="textdescriptions"><small><em>2024</em></small></p>
                <p class="card-text">Diseñé un <strong><em>brochure corporativo</em></strong> para Maestranza San José que comunica solidez industrial — texturas y reflejos metálicos que evocan la calidad de sus servicios de metalizado y fabricación sin necesidad de palabras.</p>
                <p class="card-text"><small><strong><em>Resultado:</em></strong> 100% de satisfacción por parte del cliente, expresando textual "Siempre es un agrado trabajar con profesionales" — Juan Salinas.</small></p>
                <p class="opacity-75"><small>Brochure Industrial | Diseño Corporativo | Brochure | Brand System</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DAn9UfQyuGE/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/229827593/Brochure-Corporativo-para-Maestranza-San-Jos-%282024%29" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Brochure Mestranza -->
          <!-- Logo MMB -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-brandsystem-logommb@2x.webp" class="card-img-top" alt="Logo de Mi Mágico Bosque: isotipo de corazón que crece y florece, simbolizando el ciclo interior-exterior" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-primary">Logo &amp; Variantes de Marca</span> para Mi Mágico Bosque</h3>
                <p class="textdescriptions"><small><em>2023</em></small></p>
                <p class="card-text">Diseñé el <strong><em>logo de Mi Mágico Bosque</em></strong> — un corazón que florece desde adentro hacia afuera, con variantes de color que guían el tipo de contenido espiritual en cada publicación. Un sistema visual que comunica la esencia de la marca en un solo ícono.</p>
                <p class="opacity-75"><small>Identidad Espiritual | Logo | Identidad Holística | Brand System</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DLvYYDFSA-G/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/229706867/Logo-Variantes-de-Marca-para-Mi-Magico-Bosque" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Logo MMB -->          
          <!-- Sello Inca -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-brandsystem-selloInca@2x.webp" class="card-img-top" alt="Sello de libro INCA: corona dorada de Sapa Inca sobre tipografía geométrica 'INCA' en color oro y negro" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-secondary">Sello &amp; Brand Token</span> para “INCA: Una Rebelión Transformada”</h3>
                <p class="textdescriptions"><small><em>2014</em></small></p>
                <p class="card-text">Diseñé un <strong><em>sello editorial y logotipo para "INCA: Una Rebelión Transformada"</em></strong> — la corona de los Sapa Incas como símbolo de poder histórico, combinada con una tipografía robusta que comunica resistencia y supervivencia cultural.</p>
                <p class="card-text"><small>Un ejercicio de diseño conceptual donde cada decisión tiene peso simbólico.</small></p>
                <p class="opacity-75"><small>Sello Editorial | Brand Token | Simbología Inca | Identidad Editorial</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DLvmBM_Sv8V/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/229710071/Sello-Distintivo-para-INCA-Una-Rebelion-Transformada" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Sello Inca -->
          <!-- Brochure CBC -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-brandsystem-brochureCBC@2x.webp" class="card-img-top" alt="Brochure digital de CBC con paleta corporativa, iconos de servicios y secciones de planes y sectores económicos" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-primary">Brochure</span> de Servicios y Planes para CBC</h3>
                <p class="textdescriptions"><small><em>2021-2023</em></small></p>
                <p class="card-text">Diseñé un <strong><em>brochure corporativo bajo el Brand System de CBC</em></strong> — paleta, tipografías e íconos corporativos — para presentar servicios, planes y sectores económicos de forma clara y atractiva tanto en email como en redes sociales.</p>
                <p class="opacity-75"><small>Brochure | Brand System | Coherencia Visual | Diseño B2B</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DL0aldGSeIy/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/229835099/Brochure-de-Servicios-y-Planes-para-CBC-%282021-2023%29" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Brochure CBC -->
          <!-- Guía de Marca CBC -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-brandsystem-guiademarcacbc@2x.webp" class="card-img-top" alt="Páginas del Manual de Marca CBC mostrando ejemplos de fotografía y comunicación" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-secondary">Brand System</span> para CBC</h3>
                <p class="textdescriptions"><small><em>2020</em></small></p>
                <p class="card-text">Creé el <strong><em>Brand System completo de CBC</em></strong> — logos, colores, tipografías, fotografía y tono de voz — para alinear Marketing, TI y Comunicaciones bajo un mismo lenguaje visual y comunicacional.</p>
                <p class="card-text"><small>Un sistema que eliminó las interpretaciones confusas y le dio a CBC una presencia corporativa coherente en todos sus canales.</small></p>
                <p class="opacity-75"><small>Comunicación Corporativa | Brand System | Coherencia Visual</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DLxhfxrxvp_/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/229748149/Brand-System-para-CBC" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="landing-blog-article.html?article=10" target="_blank" aria-label="Blog" title="Este proyecto se menciona como inspiración en el siguiente artículo" data-bs-toggle="tooltip"><i class="fa-solid fa-quote-right"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Guía de Marca CBC -->
          <!-- Logo Full Graphic -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-brandsystem-logofullgraphic@2x.webp" class="card-img-top" alt="Logo de Full Graphic Impresores" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-primary">Rebranding</span> de Full Graphic Impresores</h3>
                <p class="textdescriptions"><small><em>2014</em></small></p>
                <p class="card-text">Rediseñé la identidad de Full Graphic Impresores — incorporando las tintas CMYK como elemento gráfico y una tipografía lineal con curvas vectoriales que simboliza el trazo de imprenta y el flujo del plotter.</p>
                <p class="opacity-75"><small>Rebranding | Logotipo | Identidad Visual</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DLxuxNWyXHN/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/229753651/Rebranding-de-Full-Graphic-Impresores-%282014%29" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="landing-blog-article.html?article=1" target="_blank" aria-label="Blog" title="Este proyecto se menciona como inspiración en el siguiente artículo" data-bs-toggle="tooltip"><i class="fa-solid fa-quote-right"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Logo Full Graphic -->
        </div>
    `,      // Graphic Design & Brand System
    'rrss-tab-pane': `
        <div class="row">
          <!-- Plantillas para Doble Espiral Academia -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-digitalcontent-dobleespiral@2x.webp" class="card-img-top" alt="Carrusel y cover de Instagram inspirados en girasoles y doble espiral para Doble Espiral Academia" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-secondary">Plantillas de Social Media</span> para Doble Espiral Academia</h3>
                <p class="textdescriptions"><small><em>2024</em></small></p>
                <p class="card-text">Fusioné simbolismo espiritual y estructura matemática para diseñar 18 plantillas en Canva que Sandy opera con autonomía total hoy — carruseles, reels y covers para Instagram, Facebook y YouTube.</p>
                <p class="card-text"><small><strong><em>Resultado:</em></strong> +25% engagement · sistema que Sandy extendió a lápices, libretas y presentaciones.</small></p>
                <p class="opacity-75"><small>Plantillas Canva | E-learning | Diseño Espiritual | Social Media Designer</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DLeAWwWMRtQ/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/229201349/Social-Media-Design-para-Doble-Espiral" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="landing-projects-d-dobleEspiral.html" target="_blank" aria-label="Ver más" title="Ver en Proyecto Destacado" data-bs-toggle="tooltip"><i class="fa fa-eye"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Plantillas para Doble Espiral Academia -->
          <!-- Plantillas de diseños en Canva para ´Tarot para Sanar´ -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-digitalcontent-tarotparasanar@2x.webp" class="card-img-top" alt="Plantillas de diseños en Canva para ´Tarot para Sanar´ con paleta mística" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-primary">Plantillas de Social Media</span> para Tarot para Sanar</h3>
                <p class="textdescriptions"><small><em>2024</em></small></p>
                <p class="card-text">Creé 18 plantillas en Canva para Tarot para Sanar — fusionando profesionalismo y esencia espiritual para que Carolina publicara con coherencia de marca y sin depender de un diseñador para cada post.</p>
                <p class="card-text"><small><strong><em>Resultado:</em></strong> +30% engagement en el primer mes · cliente recurrente — volvió con un nuevo proyecto meses después.</small></p>
                <p class="opacity-75"><small>Plantillas Canva | Diseño Espiritual | Social Media Designer</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DBq9YmxOt-g/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/229247181/Rebranding-Plantillas-para-Tarot-para-Sanar" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="landing-projects-d-tarotParaSanar.html" target="_blank" aria-label="Ver más" title="Ver en Proyecto Destacado" data-bs-toggle="tooltip"><i class="fa fa-eye"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="landing-blog-article.html?article=7" target="_blank" aria-label="Blog" title="Este proyecto se menciona como inspiración en el siguiente artículo" data-bs-toggle="tooltip"><i class="fa-solid fa-quote-right"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Plantillas de diseños en Canva para ´Tarot para Sanar´ -->
          <!-- Plantillas para Net2e -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-digitalcontent-net2e@2x.webp" class="card-img-top" alt="Carrusel en Canva para Net2e" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-secondary">Plantillas de Social Media</span> en Canva para Net2e</h3>
                <p class="textdescriptions"><small><em>2024</em></small></p>
                <p class="card-text">Creé plantillas en Canva alineadas al <strong><em>Brand System de Net2e</em></strong> — carruseles, reels, stories y banners listos para que el equipo gestionara sus redes con coherencia visual y sin necesitar al diseñador para cada publicación.</p>
                <p class="opacity-75"><small>Plantillas Canva | Editable Templates | Social Media Designer</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DMJHHG6Sz58/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/230498905/Plantillas-de-Social-Media-en-Canva-para-Net2e" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Plantillas para Net2e -->
          <!-- VIDEO Premio CBC -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-digitalcontent-videoCBC@2x.webp" class="card-img-top" alt="Captura del video promocional de 51 segundos del Premio CBC" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-primary">Video Promocional</span> del Premio CBC</h3>
                <p class="textdescriptions"><small><em>2022</em></small></p>
                <p class="card-text">Desarrollé un video promocional de 51 segundos para el Premio CBC — animaciones limpias en <strong><em>After Effects y Premiere Pro,</em></strong> diseñado para anunciar inscripciones y presentar finalistas y ganadores durante la ceremonia anual.</p>
                <p class="opacity-75"><small>Video Promocional | After Effects | Premiere Pro | Digital Content</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/reel/C687uy6MFee/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://vimeo.com/1099494777?share=copy" target="_blank" aria-label="Behance" title="Ver en Vimeo" data-bs-toggle="tooltip"><i class="fa-brands fa-vimeo-v"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- VIDEO Premio CBC -->
          <!-- Animación de Intro para “Revelando Historias” -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-digitalcontent-videoIntroTV@2x.webp" class="card-img-top" alt="Animación de 5 segundos del logo de Revelando Historias, programa de TV universitario" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-secondary">Animación de Intro</span> para “Revelando Historias”</h3>
                <p class="textdescriptions"><small><em>2013</em></small></p>
                <p class="card-text">Diseñé una animación de intro de 5 segundos para el programa universitario "Revelando Historias" — inspirada en el revelado fotográfico analógico. El logo emerge como un recuerdo que cobra vida, <strong><em>construido en Photoshop y animado en After Effects.</em></strong></p>
                <p class="opacity-75"><small>TV Intro Design | After Effects | Animación</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/reel/DL07m3IMnAB/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://vimeo.com/1099506966?share=copy" target="_blank" aria-label="Behance" title="Ver en Vimeo" data-bs-toggle="tooltip"><i class="fa-brands fa-vimeo-v"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Animación de Intro para “Revelando Historias” -->          
          <!-- Banner PRemio CBC -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-digitalcontent-bannersCBC@2x.webp" class="card-img-top" alt="Banner del Premio CBC 2022 con timeline de etapas en colores corporativos y banner con empresas finalistas y sus logos" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-primary">Banners</span> para Premio CBC</h3>
                <p class="textdescriptions"><small><em>2021-2022</em></small></p>
                <p class="card-text">Diseñé dos sets de banners para el Premio CBC — uno comunicando el timeline de inscripciones y etapas, y otro celebrando a finalistas con nombres y logos. Ambos alineados al <strong><em>Brand System de CBC</em></strong> para garantizar coherencia en web y redes sociales.</p>
                <p class="opacity-75"><small>Digital Content Design | Banners | Social Media Banners</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DL2hHjfM9WC/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/229848731/Banners-para-Premio-CBC-%282021-2022%29" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Banner PRemio CBC -->
          <!-- RR.SS FOL -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-digitalcontent-rrssFOL@2x.webp" class="card-img-top" alt="Publicación de redes sociales diseñadas para FOL Agencia de Valores" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-secondary">Digital Content Design</span> para FOL Agencia de Valores SpA</h3>
                <p class="textdescriptions"><small><em>2017–2019</em></small></p>
                <p class="card-text">Diseñé banners web, posts para redes sociales e imágenes para email marketing de FOL — todos alineados al <strong><em>Brand System</em></strong> corporativo para garantizar un mensaje unificado y profesional en cada punto de contacto con el cliente.</p>
                <p class="opacity-75"><small>Digital Content Design | Social Media Design | Banners</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DL2m20ksynD/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/229902445/Digital-Content-Design-para-FOL-Agencia-de-Valores-SpA" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- RR.SS FOL -->
          <!-- Plantillas de diseños en Canva para Mi Mágico Bosque  -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-digitalcontent-mmb@2x.webp" class="card-img-top" alt="Plantillas de diseños en Canva para ´Mi mágico Bosque´ con paleta espiritual" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-primary">Diseños de Social Media</span> para Mi Mágico Bosque</h3>
                <p class="textdescriptions"><small><em>2023–2025</em></small></p>
                <p class="card-text">En <strong><em>Mi Mágico Bosque</em></strong> — mi proyecto personal de coaching espiritual — diseñé posts y carruseles que equilibran frescura y coherencia bajo 5 pilares de marca propios.</p>
                <p class="card-text"><small><strong><em>Resultado:</em></strong> +41% de engagement · comunidad más conectada con el propósito de la marca.</small></p>
                <p class="card-text"><small>Un caso donde soy clienta y diseñadora — lo que me enseña a tomar decisiones desde los dos lados.</small></p>
                <p class="opacity-75"><small>Plantillas Canva | Diseño Espiritual | Social Media Designer | Identidad Visual</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DL3OiWTyDNL/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/229924143/Disenos-de-Social-Media-para-Mi-Magico-Bosque" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Plantillas de diseños en Canva para Mi Mágico Bosque  -->
          <!-- Plantillas RR.SS para Akasha Healing -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-digitalcontent-akashahealing@2x.webp" class="card-img-top" alt="Conjunto de plantillas editables en Canva para Akasha Healing" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-secondary">Plantillas de Social Media</span> para Akasha Healing</h3>
                <p class="textdescriptions"><small><em>2023-2024</em></small></p>
                <p class="card-text">Diseñé <strong><em>plantillas editables en Canva</em></strong> para Akasha Healing — combinando símbolos akáshicos y layouts claros que permiten mantener una voz visual coherente en cada publicación, sin necesitar al diseñador para cada post.</p>
                <p class="card-text"><small><strong><em>Resultado:</em></strong> +60% de engagement · voz visual unificada en todos los canales.</small></p>
                <p class="opacity-75"><small>Plantillas Canva | Diseño Espiritual | Social Media Designer | Identidad Visual</small></p>
                <p class="card-text"><small><strong class="color-primary">¿Por qué este proyecto?</strong> Porque en este reto diseñé dinamismo y coherencia al mismo tiempo, creando plantillas editables que unificaron la voz espiritual de la marca y mejoraron su engagement +30 %.</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DL0pyKUSCg-/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/229842073/Plantillas-de-Social-Media-para-Akasha-Healing" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="landing-blog-article.html?article=9" target="_blank" aria-label="Blog" title="Este proyecto se menciona como inspiración en el siguiente artículo" data-bs-toggle="tooltip"><i class="fa-solid fa-quote-right"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Plantillas RR.SS para Akasha Healing -->
        </div>
    `,       // Digital Content Designer
    'other-tab-pane': `
          <div class="row">
          <!-- AIESEC -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-others-aiesec@2x.webp" class="card-img-top" alt="Flyers y etiquetas de viaje diseñados para AIESEC en Universidad Finis Terrae" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-secondary">Voluntariado</span> en AIESEC</h3>
                <p class="textdescriptions"><small><em>2012–2014</em></small></p>
                <p class="card-text">Voluntaria en AIESEC — <strong><em>diseñé +20 piezas de reclutamiento que aumentaron las postulaciones en 30%.</em></strong> Entrevisté candidatos promoviendo diversidad y valores organizacionales. Lideré 5 voluntarios en Intercambios UFT alcanzando el 100% de objetivos. Conduje un espacio televisivo universitario para visibilizar la organización y organicé eventos <strong><em>Outgoing Exchange que elevaron la satisfacción en 25%.</em></strong></p>
                <p class="card-text"><small>Una etapa que me enseñó <strong><em>liderazgo, comunicación y trabajo en equipo</em></strong> antes de que el diseño fuera mi profesión.</small></p>
                <p class="opacity-75"><small>Graphic Designer | Voluntariado | Liderazgo | Trabajo en Equipo</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DML8PA6SRn9/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/230522186/Voluntariado-en-AIESEC-%2820122014%29" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="landing-blog-article.html?article=5" target="_blank" aria-label="Blog" title="Lee el artículo completo sobre este proyecto" data-bs-toggle="tooltip"><i class="fa-solid fa-newspaper"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- AIESEC -->
          <!-- Guía de Estilos FOL -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-brandsystem-guiadeestilosfol@2x.webp" class="card-img-top" alt="Guía de Estilos de FOL mostrando paleta de colores HEX/RGB, tipografías corporativas y ejemplos de aplicación gráfica" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-primary">Style Guide</span> para FOL</h3>
                <p class="textdescriptions"><small><em>2018</em></small></p>
                <p class="card-text">Creé la <strong><em>Style Guide corporativa</em></strong> de FOL — colores, tipografías y logos documentados en un formato accesible para Marketing, TI, Ventas y Diseño Gráfico.</p>
                <p class="card-text"><small>Una guía que asegura que cada pieza — de cualquier equipo — transmita la misma identidad sin necesitar al diseñador como intermediario.</small></p>
                <p class="opacity-75"><small>Guía de Estilos | Brand System | Coherencia Visual</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DLvyeXXsQy6/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/229712437/Guia-de-Estilos-para-FOL-Agencia-de-Valores-SpA" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Guía de Estilos FOL -->
          <!-- Iconografía Personalizada -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-brandsystem-iconografia@2x.webp" class="card-img-top" alt="Conjunto de iconos SVG diseñados a medida con estilos únicos alineados al Brand System de la marca" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-secondary">Iconografía:</span> tokens para consistencia y agilidad</h3>
                <p class="textdescriptions"><small><em>Sin tiempo definido</em></small></p>
                <p class="card-text"><strong><em>Iconografía personalizada y exclusiva</em></strong> — trazos, colores y estados adaptados a cada marca y sistema de diseño. Listos en SVG para integrarse directamente a cualquier proyecto y reforzar el Brand System desde el primer vistazo.</p>
                <p class="opacity-75"><small>Iconos Personalizados | SVG | Design Tokens | Brand System</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DLvHjKFxHQo/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/229701315/Iconos-como-tokens-de-Brans-System" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Iconografía Personalizada -->
          <!-- Ilustraciones -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-others-ilustraciones@2x.webp" class="card-img-top" alt="Seis composiciones gráficas en tonos verdes, rojos y naranjas sobre texturas de fondo, usadas en portadas TEPA y bolsas reutilizables" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-primary">Exploración Serigráfica</span> para TEPA &amp; Bolsas Reutilizables</h3>
                <p class="textdescriptions"><small><em>2015-2017</em></small></p>
                <p class="card-text">Creé ilustraciones y composiciones abstractas en Illustrator para crear patrones serigráficos únicos — impresos sobre portadas artesanales para TEPA y bolsas reutilizables de género. Textura, color y geometría convertidos en productos físicos reales.</p>
                <p class="card-text"><small><strong><em>De boceto a objeto:</em></strong> el proceso que más me recuerda que el diseño también vive fuera de la pantalla.</small></p>
                <p class="opacity-75"><small>Serigrafía | Encuadernación Artesanal | Exploración Gráfica | Diseño de Patrones de Superficie</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DMLlLzQyweZ/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/230512178/Composiciones-graficas-para-TEPA-Bolsas-Reutilizables" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="landing-blog-article.html?article=4" target="_blank" aria-label="Blog" title="Este proyecto se menciona como inspiración en el siguiente artículo" data-bs-toggle="tooltip"><i class="fa-solid fa-quote-right"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Ilustraciones -->
          <!-- Proyecto de Título -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-others-titulo@2x.webp" class="card-img-top" alt="Bocetos y páginas del libro de título ‘El corazón, un órgano diferenciador’, con ilustraciones técnicas y notas conceptuales del proyecto" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-secondary">Proyecto de Título:</span> “El corazón, un órgano diferenciador”</h3>
                <p class="textdescriptions"><small><em>2015</em></small></p>
                <p class="card-text"><strong><em>Diseñé y monté una exposición interactiva</em></strong> de título donde cada latido cardíaco se convertía en forma y sonido — bocetos técnicos, modelos 3D y mandalas sonoros generados en vivo a partir de pulsos reales.</p>
                <p class="card-text"><small>Un proyecto interdisciplinario que fusionó <strong><em>diseño, ciencia y arte</em></strong> — y que validó mi capacidad de investigar, prototipar y exponer una idea compleja de forma accesible y memorable.</small></p>
                <p class="opacity-75"><small>Graphic Designer | Research Researcher | Proyecto de Título | Bio Art</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DMJX0VbSrib/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/54481033/Proyecto-de-Titulo-UFT-2015" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="landing-blog-article.html?article=3" target="_blank" aria-label="Blog" title="Lee el artículo completo sobre este proyecto" data-bs-toggle="tooltip"><i class="fa-solid fa-newspaper"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="landing-blog-article.html?article=4" target="_blank" aria-label="Blog" title="Este proyecto se menciona como inspiración en el siguiente artículo" data-bs-toggle="tooltip"><i class="fa-solid fa-quote-right"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Proyecto de Título -->
          <!-- Nike Air Max -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-others-nike@2x.webp" class="card-img-top" alt="Escultura en papel Ivory con relieve de la suela Nike Air Max y pliegues que emulan el vacío de aire" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-primary">Espacio de Aire:</span> La huella invisible de Air Max</h3>
                <p class="textdescriptions"><small><em>2013</em></small></p>
                <p class="card-text">Para un concurso académico inspirado en la Nike Air Max, creé una escultura en papel Ivory que hace tangible lo intangible — el <strong><em>"vacío sostenido"</em></strong> de la suela. Con cuño seco imprimí la huella real y conservé el relieve original para evocar la comodidad que no se siente al caminar pero se nota cuando no está.</p>
                <p class="card-text"><small>Técnica artesanal al servicio de un concepto de producto.</small></p>
                <p class="opacity-75"><small>Arte Experiencial | Cuño Seco | Energía en Movimiento | Obra de Arte | Escultura en Papel</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DMMJOIuMC7Z/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/230525254/Espacio-de-Aire-para-Concurso-Acadmico-Nike-Air-Max" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="landing-blog-article.html?article=3" target="_blank" aria-label="Blog" title="Este proyecto se menciona como inspiración en el siguiente artículo" data-bs-toggle="tooltip"><i class="fa-solid fa-quote-right"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Nike Air Max -->
          <!-- Proyecto Gordon Matta-Clark -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-others-gordonmattaclark@2x.webp" class="card-img-top" alt="Maqueta de cortes, inspirada en los building cuts de Gordon Matta-Clark, con sombras y espacios intervenidos" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-secondary">Tributo a Matta-Clark:</span> exhibición en Bellas Artes</h3>
                <p class="textdescriptions"><small><em>2013</em></small></p>
                <p class="card-text"><strong><em>Inspirada en los "building cuts" de Gordon Matta-Clark,</em></strong> construí una maqueta en MDF de 1mm donde cada corte y sombra revelan una arquitectura renovada — una metáfora de transformación.</p>
                <p class="card-text"><small><strong><em>La pieza fue seleccionada para exhibirse en Bellas Artes.</em></strong> Mi primer puente entre diseño y obra de arte, y el debut que me mostró que mi voz creativa existe más allá de la pantalla.</small></p>
                <p class="opacity-75"><small>Obra de Arte | Research Researcher | Bellas Artes | Matta-Clark Tribute</small></p>
                <p class="card-text"><small><strong class="color-primary">¿Por qué este proyecto?</strong> Porque fue mi primer puente entre diseño y arte intervencionista, me reveló mi voz creativa y la poesía escondida en la estructura y la sombra.</small></p>
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DMN1JoOMpb2/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/54482169/Obra-expuesta-en-Bellas-Artes" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="landing-blog-article.html?article=3" target="_blank" aria-label="Blog" title="Este proyecto se menciona como inspiración en el siguiente artículo" data-bs-toggle="tooltip"><i class="fa-solid fa-quote-right"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Proyecto Gordon Matta-Clark -->
          <!-- TEPA -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-others-tepa@2x.webp" class="card-img-top" alt="Logo de TEPA en blanco sobre fondo negro, tipografía que sugiere un tronco con veta interna y raíz descendente" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-primary">TEPA</span> Encuaderna tu mundo</h3>
                <p class="textdescriptions"><small><em>2015-2017</em></small></p>
                <p class="card-text"><strong><em>En TEPA lancé mi marca de encuadernación artesanal</em></strong> — exploré más de 11 técnicas (belga, copto, japonesa y más), diseñé el logo, stands y material promocional, y vendí en ferias fortaleciendo mi perfil como emprendedora creativa.</p>
                <p class="card-text"><small><strong><em>Un laboratorio de emprendimiento donde dominé cada fase:</em></strong> marca, producto, comunicación y venta directa.</small></p>
                <p class="opacity-75"><small>Emprendimiento Creativo | Brand System | Product Design | Encuadernación Artesanal | Diseño de Producto</small></p>                
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DMOQJo-y4vL/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/54531545/Logo-TEPA" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- TEPA -->
          <!-- Venezia  -->
          <div class="col-md-4">
            <div class="card card-projects border-0 my-3">
              <img src="assets/img/other-projects/othersprojects-others-venezia@2x.webp" class="card-img-top" alt="Cartel con máscara veneciana arrugada en relieve sobre fondo negro, con el título 'Venezia Venezia' y nombre Alfredo Jaar" loading="lazy">
              <div class="card-body">
                <h3 class="card-title"><span class="color-secondary">Cartel</span> “Venezia Venezia”</h3>
                <p class="textdescriptions"><small><em>2013</em></small></p>
                <p class="card-text">Transformé la crítica de <strong><em>Alfredo Jaar</em></strong> sobre una Venecia que se hunde en un cartel 3D — las arrugas del papel como olas, la máscara veneciana emergiendo desde las heridas. La cultura que persiste desde su propio caos.</p>
                <p class="card-text"><small>Un ejercicio de diseño conceptual donde el mensaje y la técnica son inseparables — y que luego se llevó a flyers y afiches para demostrar que el concepto se sostiene en cualquier formato.</small></p>
                <p class="opacity-75"><small>Cartel 3D | Graphic Designer | Conceptual Artist</small></p>                
                <p class="border-top pt-2 mb-0 text-center"><small>Puedes ver más de este proyecto en:</small></p>
                <div class="justify-content-center list-unstyled d-flex py-1">
                  <a class="mx-3 text-center a-small-sl" href="https://www.instagram.com/p/DMOgSTsyD6m/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" aria-label="Instagram" title="Ver en Instagram" data-bs-toggle="tooltip"><i class="fab fa-instagram"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="https://www.behance.net/gallery/230602867/Cartel-Venezia-Venezia" target="_blank" aria-label="Behance" title="Ver en Behance" data-bs-toggle="tooltip"><i class="fab fa-behance"></i></a>
                  <a class="mx-3 text-center a-small-sl" href="landing-blog-article.html?article=4" target="_blank" aria-label="Blog" title="Este proyecto se menciona como inspiración en el siguiente artículo" data-bs-toggle="tooltip"><i class="fa-solid fa-quote-right"></i></a>
                </div>
              </div>
            </div>
          </div>
          <!-- Venezia  -->
        </div>
    `       // Otros
  };

  /* -------------------- Helpers -------------------- */
  function safeQuery(selectorOrNode) {
    if (!selectorOrNode) return null;
    if (selectorOrNode.nodeType) return selectorOrNode;
    try { return document.querySelector(selectorOrNode); } catch (e) { return null; }
  }

  function setInnerHTML(container, html) {
    if (!container) return;
    container.innerHTML = html || '';
  }

  function normalizePath(p) {
    if (!p) return p;
    let s = String(p).trim();
    if (!s) return s;
    // si es absoluta http(s) dejarla
    if (/^https?:\/\//i.test(s) || s.indexOf('//') === 0) return s;
    // si estamos en file:// y la ruta empieza con / quitar slash inicial
    try {
      if (location && location.protocol === 'file:' && s.startsWith('/')) {
        s = s.replace(/^\/+/, '');
      }
    } catch (e) { /* ignore */ }
    return s;
  }

  // Procesa elementos con data-* relacionados a imágenes dentro de un contenedor
  function initImagesInContainer(container) {
    if (!container) return;
    const elems = Array.from(container.querySelectorAll('[data-img-class]'));
    if (!elems.length) return;

    elems.forEach(el => {
      try {
        const imgClass = el.getAttribute('data-img-class');
        const imageMobile = normalizePath(el.getAttribute('data-image-mobile') || el.dataset.imageMobile || '');
        const imageDesktop = normalizePath(el.getAttribute('data-image-desktop') || el.dataset.imageDesktop || '');
        const imageFallback = normalizePath(el.getAttribute('data-image') || el.dataset.image || '');
        const type = (el.getAttribute('data-type') || el.dataset.type || '').toLowerCase(); // 'bg' or 'img'

        // Si existe ImageHelper en el proyecto, preferimos su API (flujo por clases)
        if (window.ImageHelper && typeof window.ImageHelper.createBackgroundClass === 'function') {
          if (type === 'img' && el.tagName && el.tagName.toLowerCase() === 'img' && typeof window.ImageHelper.configureImg === 'function') {
            try {
              window.ImageHelper.configureImg(el, {
                className: imgClass,
                imageMobile: imageMobile || imageFallback,
                imageDesktop: imageDesktop || imageFallback,
                imageUrl: imageFallback || '',
                alt: el.getAttribute('alt') || el.dataset.alt || '',
                width: el.getAttribute('width') || el.dataset.width || undefined,
                height: el.getAttribute('height') || el.dataset.height || undefined,
                sizes: el.getAttribute('data-sizes') || el.dataset.sizes
              });
              log('ImageHelper.configureImg applied to', el, imgClass);
              if (window.responsiveLazyImages && typeof window.responsiveLazyImages.loadImage === 'function') {
                try { window.responsiveLazyImages.loadImage(el); } catch (e) { /* ignore */ }
              }
              return;
            } catch (e) {
              warn('ImageHelper.configureImg error:', e);
            }
          }

          // Para backgrounds o fallback general, crear clase y asignar
          try {
            window.ImageHelper.createBackgroundClass(imgClass, {
              imageMobile: imageMobile || imageFallback,
              imageDesktop: imageDesktop || imageFallback
            });
            el.classList.add(imgClass);
            log('ImageHelper.createBackgroundClass applied to', el, imgClass);
            return;
          } catch (e) {
            warn('ImageHelper.createBackgroundClass error:', e);
          }
        }

        // Fallback directo: asignar style.backgroundImage o img.src
        if (type === 'img' && el.tagName && el.tagName.toLowerCase() === 'img') {
          // Si está dentro de <picture>, respetar picture (no sobrescribir)
          if (el.closest && el.closest('picture')) {
            log('skip: img inside picture (let picture handle it)', el);
            return;
          }

          // Elegir la fuente según ancho
          const chosen = (window.innerWidth >= 768 ? imageDesktop : imageMobile) || imageDesktop || imageMobile || imageFallback || el.getAttribute('src');
          if (chosen) {
            try { el.src = chosen; } catch (e) { el.setAttribute('src', chosen); }
          }

          // Si elemento es lazy, dejar data-src/data-srcset para loaders
          const isLazy = el.classList.contains('lazy') || el.getAttribute('loading') === 'lazy' || el.dataset.lazy === 'true';
          if (isLazy) {
            if (!el.dataset.src && (imageMobile || imageDesktop || imageFallback)) {
              el.dataset.src = imageMobile || imageDesktop || imageFallback;
            }
            if (!el.dataset.srcset) {
              const parts = [];
              if (imageMobile) parts.push(`${imageMobile} 375w`);
              if (imageDesktop) parts.push(`${imageDesktop} 1200w`);
              if (parts.length) el.dataset.srcset = parts.join(', ');
            }
            if (!el.dataset.sizes && el.getAttribute('data-sizes')) {
              el.dataset.sizes = el.getAttribute('data-sizes');
            }
            log('left data-src/data-srcset for lazy img', el);
          } else {
            // no lazy -> aplicar srcset/sizes si no existen
            if (!el.getAttribute('srcset')) {
              const parts = [];
              if (imageMobile) parts.push(`${imageMobile} 375w`);
              if (imageDesktop) parts.push(`${imageDesktop} 1200w`);
              if (parts.length) el.setAttribute('srcset', parts.join(', '));
            }
            if (!el.getAttribute('sizes') && el.getAttribute('data-sizes')) {
              el.setAttribute('sizes', el.getAttribute('data-sizes'));
            }
            log('set img src/srcset fallback', el, chosen);
          }

          // Pasar a responsiveLazyImages si está disponible
          if (window.responsiveLazyImages && typeof window.responsiveLazyImages.loadImage === 'function') {
            try { window.responsiveLazyImages.loadImage(el); } catch (e) { /* ignore */ }
          }
          return;
        }

        // fallback for background-type or divs
        const chosenBg = (window.innerWidth >= 768 ? imageDesktop : imageMobile) || imageDesktop || imageMobile || imageFallback;
        if (chosenBg) {
          try {
            el.style.backgroundImage = `url("${chosenBg}")`;
            if (!el.style.backgroundPosition) el.style.backgroundPosition = 'center';
            if (!el.style.backgroundSize) el.style.backgroundSize = 'cover';
            el.classList.add('injected-bg');
            log('Fallback set background-image for', el, chosenBg);
          } catch (e) {
            warn('Error setting background-image for', el, e);
          }
        }
      } catch (err) {
        console.error('[projects-others] initImagesInContainer error on element', el, err);
      }
    });
  }

  /* -------------------- Tabs/hash handling -------------------- */

  // Activa tab por hash si existe (usa Bootstrap Tab)
  function activateTabFromHash() {
    const hash = window.location.hash;
    if (!hash) return;
    try {
      const triggerEl = document.querySelector(`[data-bs-target="${hash}"], a[href="${hash}"]`);
      if (triggerEl && window.bootstrap && typeof window.bootstrap.Tab === 'function') {
        new bootstrap.Tab(triggerEl).show();
        setTimeout(() => triggerEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
      } else if (triggerEl) {
        // fallback simple si no hay bootstrap
        const targetSelector = triggerEl.getAttribute('data-bs-target') || triggerEl.getAttribute('href');
        const panel = targetSelector ? document.querySelector(targetSelector) : null;
        if (panel) {
          document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
          document.querySelectorAll('.project-detail').forEach(p => p.classList.remove('active'));
          triggerEl.classList.add('active');
          panel.classList.add('active');
          setTimeout(() => triggerEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
        }
      }
    } catch (e) {
      console.warn('[projects-others] activateTabFromHash error', e);
    }
  }

  // Actualiza el hash cuando el usuario cambia de tab
  function bindTabChangeUpdateHash() {
    const tabTriggers = Array.from(document.querySelectorAll('[data-bs-toggle="tab"], [data-bs-target]'));
    tabTriggers.forEach(trigger => {
      if (trigger.dataset._hashBound === '1') return;
      trigger.dataset._hashBound = '1';

      if (window.bootstrap && typeof window.bootstrap.Tab === 'function') {
        trigger.addEventListener('shown.bs.tab', function (ev) {
          try {
            const target = (ev && ev.target && (ev.target.getAttribute('data-bs-target') || ev.target.getAttribute('href'))) || null;
            if (target) {
              if (history && history.replaceState) history.replaceState(null, '', target);
              else window.location.hash = target;
            }
          } catch (e) { console.warn('[projects-others] tab shown handler error', e); }
        });
      } else {
        trigger.addEventListener('click', function () {
          try {
            const target = trigger.getAttribute('data-bs-target') || trigger.getAttribute('href') || null;
            if (target) {
              if (history && history.replaceState) history.replaceState(null, '', target);
              else window.location.hash = target;
            }
          } catch (e) { console.warn('[projects-others] click->hash handler error', e); }
        });
      }
    });
  }

  /* -------------------- Init / Public API -------------------- */

  function initAllPanes() {
    Object.keys(PANES).forEach(paneId => {
      try {
        const container = document.getElementById(paneId);
        if (!container) {
          log('Pane container not found:', paneId);
          return;
        }
        setInnerHTML(container, PANES[paneId] || '');
        initImagesInContainer(container);
      } catch (e) {
        console.error('[projects-others] initAllPanes error for', paneId, e);
      }
    });
  }

  function init() {
    try {
      initAllPanes();
      activateTabFromHash();
      bindTabChangeUpdateHash();

      let resizeTimer = null;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          Object.keys(PANES).forEach(paneId => {
            const c = document.getElementById(paneId);
            if (c && (c.offsetParent !== null)) initImagesInContainer(c);
          });
        }, 200);
      });

      // MutationObserver para contenido dinámico
      if ('MutationObserver' in window) {
        const mo = new MutationObserver((mutations) => {
          mutations.forEach(m => {
            m.addedNodes.forEach(n => {
              if (n.nodeType === Node.ELEMENT_NODE) {
                if (n.hasAttribute && n.hasAttribute('data-img-class')) {
                  initImagesInContainer(n);
                } else {
                  const withAttr = n.querySelector && n.querySelector('[data-img-class]');
                  if (withAttr) initImagesInContainer(n);
                }
              }
            });
          });
        });
        try { mo.observe(document.body, { childList: true, subtree: true }); } catch (e) { /* ignore */ }
      }

      log('projects-others initialized');
    } catch (e) {
      console.error('[projects-others] init error', e);
    }
  }

  // API pública
  window.ProjectsOthers = {
    init,
    setPaneHtml: function (paneId, html) {
      try {
        PANES[paneId] = html;
        const c = document.getElementById(paneId);
        if (c) {
          setInnerHTML(c, html);
          initImagesInContainer(c);
        }
      } catch (e) {
        console.error('[projects-others] setPaneHtml error', e);
      }
    }
  };

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 0);
  }

})();