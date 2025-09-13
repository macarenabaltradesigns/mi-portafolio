// generate-articles-heads.js
// ------------------------------------------------------------
// Propósito: 
//  - Generador de cabeceras / páginas por artículo.
//  - Genera páginas estáticas por artículo desde content-articles.js o articles.json
//  - Construye el <head> (meta tags, Open Graph, Twitter Card, JSON-LD) y lo inserta
//    en una plantilla HTML o genera un HTML mínimo por artículo.
//
// Autor: Macarena Baltra — Product & UX Designer
// Fecha: 12-09-2025
// ------------------------------------------------------------


'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

/* =========================
   CLI args
   ========================= */
function parseArgs() {
  const args = {};
  process.argv.slice(2).forEach((a) => {
    const m = a.match(/^--([^=]+)=(.*)$/);
    if (m) args[m[1]] = m[2];
    else if (a === '--dry') args.dry = true;
  });
  return args;
}

/* =========================
   Plain data validator
   ========================= */
function isPlainData(value) {
  const t = typeof value;
  if (value === null) return true;
  if (t === 'string' || t === 'number' || t === 'boolean') return true;
  if (Array.isArray(value)) return value.every(isPlainData);
  if (t === 'object') {
    const proto = Object.getPrototypeOf(value);
    if (proto !== Object.prototype && proto !== null) return false;
    return Object.keys(value).every((k) => isPlainData(value[k]));
  }
  return false;
}

/* =========================
   AST extraction (acorn) helpers
   ========================= */
function tryRequireAcorn() {
  try {
    // optional dependency
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    return require('acorn');
  } catch (e) {
    return null;
  }
}

function astNodeToValue(node) {
  if (!node || typeof node.type !== 'string') throw new Error('Nodo AST inválido');
  switch (node.type) {
    case 'Literal':
      return node.value;
    case 'ObjectExpression': {
      const obj = {};
      for (const prop of node.properties) {
        if (prop.type !== 'Property' || prop.kind !== 'init') {
          throw new Error('Solo propiedades simples en objetos literales son soportadas.');
        }
        let key;
        if (prop.key.type === 'Identifier') key = prop.key.name;
        else if (prop.key.type === 'Literal') key = String(prop.key.value);
        else throw new Error('Tipo de clave no soportado en ObjectExpression.');
        obj[key] = astNodeToValue(prop.value);
      }
      return obj;
    }
    case 'ArrayExpression':
      return node.elements.map((el) => (el ? astNodeToValue(el) : null));
    case 'UnaryExpression':
      if (node.operator === '-' && node.argument.type === 'Literal' && typeof node.argument.value === 'number') {
        return -node.argument.value;
      }
      if (node.operator === '+' && node.argument.type === 'Literal' && typeof node.argument.value === 'number') {
        return +node.argument.value;
      }
      if (node.operator === 'void') return undefined;
      throw new Error('UnaryExpression no soportado: ' + node.operator);
    case 'TemplateLiteral':
      if (node.expressions && node.expressions.length > 0) {
        throw new Error('TemplateLiteral con expressions no permitidas.');
      }
      return node.quasis.map((q) => q.value.cooked).join('');
    default:
      throw new Error('Tipo de nodo AST no soportado: ' + node.type);
  }
}

function loadArticlesFromJS_Ast(filePath) {
  const acorn = tryRequireAcorn();
  if (!acorn) throw new Error('acorn no disponible');

  const txt = fs.readFileSync(filePath, 'utf8');
  const ast = acorn.parse(txt, { ecmaVersion: 'latest', sourceType: 'module' });

  for (const node of ast.body) {
    if (node.type === 'ExpressionStatement' && node.expression && node.expression.type === 'AssignmentExpression') {
      const ae = node.expression;
      const left = ae.left;
      const right = ae.right;
      let matched = false;
      if (left.type === 'MemberExpression') {
        if (
          left.object &&
          ((left.object.type === 'Identifier' && left.object.name === 'window' && left.property && left.property.name === 'articles') ||
            (left.object.type === 'Identifier' && left.object.name === 'module' && left.property && left.property.name === 'exports'))
        ) {
          matched = true;
        }
      } else if (left.type === 'Identifier' && left.name === 'articles') {
        matched = true;
      }
      if (matched) {
        if (!right || (right.type !== 'ObjectExpression' && right.type !== 'ArrayExpression')) {
          throw new Error('RHS no es objeto/array literal; AST extraction no soporta ejecución.');
        }
        return astNodeToValue(right);
      }
    }

    if (node.type === 'ExportNamedDeclaration' && node.declaration && node.declaration.type === 'VariableDeclaration') {
      for (const decl of node.declaration.declarations) {
        if (decl.id && decl.id.name === 'articles' && decl.init) {
          if (decl.init.type !== 'ObjectExpression' && decl.init.type !== 'ArrayExpression') {
            throw new Error('Exported articles no es literal (AST).');
          }
          return astNodeToValue(decl.init);
        }
      }
    }
  }

  throw new Error('No se encontró asignación literal de "articles" ni export named "articles" en el AST.');
}

/* =========================
   Fallback VM seguro
   ========================= */
function loadArticlesFromJS_VmSafe(filePath) {
  const txt = fs.readFileSync(filePath, 'utf8');
  const reCandidates = [
    /(window\.)?articles\s*=\s*({[\s\S]*?});?/m,
    /module\.exports\s*=\s*({[\s\S]*?});?/m,
    /export\s+const\s+articles\s*=\s*({[\s\S]*?});?/m
  ];

  let objText = null;
  for (const re of reCandidates) {
    const m = txt.match(re);
    if (m) {
      objText = m[2] || m[1] || m[0];
      break;
    }
  }

  if (!objText) throw new Error('No se encontró un literal de "articles" en el archivo JS (vm fallback).');

  const sandbox = {};
  vm.createContext(sandbox);

  try {
    const script = new vm.Script('result = ' + objText, { filename: filePath });
    script.runInContext(sandbox, { timeout: 500 });
    const result = sandbox.result;
    if (!isPlainData(result)) {
      throw new Error('El objeto evaluado no es "plain data" — contiene funciones/instancias o tipos no permitidos.');
    }
    return result;
  } catch (err) {
    throw new Error('Error evaluando objeto con vm-safe: ' + err.message);
  }
}

/* =========================
   Loader público
   ========================= */
function loadArticles(src) {
  const ext = path.extname(src).toLowerCase();
  if (ext === '.json') {
    try {
      return JSON.parse(fs.readFileSync(src, 'utf8'));
    } catch (err) {
      throw new Error('Error parseando JSON: ' + err.message);
    }
  }

  if (ext === '.js') {
    try {
      return loadArticlesFromJS_Ast(src);
    } catch (astErr) {
      try {
        return loadArticlesFromJS_VmSafe(src);
      } catch (vmErr) {
        throw new Error('No se pudo extraer articles (AST y vm fallaron): ' + vmErr.message + ' | AST: ' + astErr.message);
      }
    }
  }

  throw new Error('Formato no soportado. Usa .json o .js');
}

/* =========================
   Helpers head/meta y OG image resolution
   ========================= */
function safeText(s) { return s === undefined || s === null ? '' : String(s); }
function stripHtml(html) { return safeText(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
function truncate(s, n) { s = safeText(s); return s.length > n ? s.slice(0, n - 1) + '…' : s; }
function slugify(s) { return safeText(s).toLowerCase().replace(/[^a-z0-9\-]+/g, '-').replace(/\-+/g, '-').replace(/^\-|\-$/g, ''); }
function escapeHtml(s) { return safeText(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

/**
 * resolveDefaultOgImage - normaliza la candidate default image
 * (si es URL la devuelve, si es ruta local la valida y convierte a URL usando origin,
 *  si no existe devuelve '').
 */
function resolveDefaultOgImage(candidate, origin) {
  if (!candidate) return '';
  const normalized = String(candidate).trim();
  if (/^https?:\/\//i.test(normalized)) return normalized;
  const localPath = path.isAbsolute(normalized) ? normalized : path.join(process.cwd(), normalized);
  if (fs.existsSync(localPath)) {
    const rel = path.relative(process.cwd(), localPath).replace(/\\/g, '/');
    const resolvedUrl = origin.replace(/\/$/, '') + '/' + rel.replace(/^\//, '');
    return resolvedUrl;
  }
  console.warn(`WARN: defaultOgImage no encontrado en ruta local: ${localPath}. Se omitirá la meta de imagen por defecto.`);
  return '';
}

/**
 * normalizeCandidateToUrl - convierte una candidate (string o path) a URL relativa a origin si aplica.
 * Si candidate ya es URL absoluta la devuelve tal cual.
 */
function normalizeCandidateToUrl(candidate, origin) {
  if (!candidate) return '';
  const s = String(candidate).trim();
  if (/^https?:\/\//i.test(s)) return s;
  // Si comienza con '/' lo tomamos como path relativo al origin
  const clean = s.replace(/^\.\//, '').replace(/^\//, '');
  return origin.replace(/\/$/, '') + '/' + clean;
}

/**
 * resolveArticleOgImage - selecciona la imagen OG del artículo priorizando valores
 * definidos en arrays propios del artículo (ej: ogImages, images, imageUrl, media).
 *
 * Reglas:
 * 1) Busca arrays en propiedades candidatas y concatena sus entradas.
 * 2) Normaliza objetos (si entry es objeto usa entry.url / entry.src / entry.path).
 * 3) Prefiere filenames que contengan 'og' o 'og-image'; si no encuentra, toma la primera válida.
 */
function resolveArticleOgImage(article, origin) {
  if (!article || typeof article !== 'object') return '';

  // Campos candidatos donde pueden vivir las imágenes (orden de prioridad para obtención)
  const candidateFields = ['ogImages', 'images', 'media', 'assets', 'imagenMobile', 'imagenDesktop', 'imageUrl'];

  const candidates = [];

  // 1) Recoger arrays/string candidates
  for (const field of candidateFields) {
    if (Array.isArray(article[field])) {
      candidates.push(...article[field]);
    } else if (typeof article[field] === 'string' && article[field].trim()) {
      candidates.push(article[field]);
    }
  }

  // 2) Campos individuales que ya estaban en versiones previas
  ['imageUrl', 'bannerDesktop', 'banner', 'image', 'cover'].forEach((f) => {
    if (article[f]) candidates.push(article[f]);
  });

  // 3) Normalizar: si candidate es objeto intentar obtener url/src/path
  const normalized = candidates
    .map((c) => {
      if (!c) return '';
      if (typeof c === 'string') return c;
      if (typeof c === 'object') {
        // intentar propiedades comunes
        return c.url || c.src || c.path || c.image || c.file || '';
      }
      return '';
    })
    .filter(Boolean);

  if (normalized.length === 0) return '';

  // 4) Preferir entradas que sugieran ser OG images (nombre contenga 'og' o 'og-image')
  const preferred = normalized.find((s) => /(^|\/)[^\/]*og[^\/]*\.(webp|png|jpe?g)$/i.test(s) || /og-image/i.test(s));
  const chosen = preferred || normalized[0];

  // 5) Si la ruta elegida es relativa/local, convertir a URL pública usando origin
  if (/^https?:\/\//i.test(chosen)) return chosen;
  // si empieza con data: o similar, devolver tal cual
  if (/^data:/i.test(chosen)) return chosen;
  // si path relativo -> normalizar
  return normalizeCandidateToUrl(chosen, origin);
}

/**
 * buildHead: ahora prioriza la imagen declarada en el artículo (resolveArticleOgImage),
 * luego la imageUrl/banner y finalmente la defaultOgImage.
 */
function buildHead(a, opts) {
  const title = stripHtml(a.titleHTML || a.title || `Artículo ${a.id}`);
  const metaDesc = a.metaDescription || truncate(stripHtml(a.content || ''), 150) || '';
  const canonical = a.url || `${opts.origin}/blog/${a.slug || slugify(title) || 'article-' + a.id}`;

  // Prioriza la imagen declarada en el artículo
  const ogImageFromArticle = resolveArticleOgImage(a, opts.origin);
  const ogImage = ogImageFromArticle || (a.imageUrl || a.bannerDesktop || a.banner || opts.defaultOgImage || '');
  const dateIso = a.dateIso || a.date || undefined;
  const ogAlt = a.imageAlt || `${title} — Macarena Baltra`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: metaDesc || undefined,
    image: ogImage || undefined,
    author: { '@type': 'Person', '@id': `${opts.origin}/#person`, name: 'Macarena Baltra' },
    datePublished: dateIso || undefined,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical }
  };
  Object.keys(jsonLd).forEach((k) => (jsonLd[k] === undefined ? delete jsonLd[k] : null));

  let imgMeta = '';
  if (ogImage) {
    imgMeta = `
      <meta property="og:image" content="${ogImage}" />
      <meta property="og:image:secure_url" content="${ogImage}" />
      <meta property="og:image:type" content="${opts.ogImageType}" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="${escapeHtml(ogAlt)}" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content="${ogImage}" />
      <meta name="twitter:image:alt" content="${escapeHtml(ogAlt)}" />
    `;
  } else {
    imgMeta = `<meta name="twitter:card" content="summary" />`;
  }

  const head = `
      <title>${escapeHtml(title)} — Macarena Baltra</title>
      <meta name="description" content="${escapeHtml(metaDesc)}" />
      <link rel="canonical" href="${canonical}" />

      <meta property="og:type" content="article" />
      <meta property="og:title" content="${escapeHtml(title)}" />
      <meta property="og:description" content="${escapeHtml(metaDesc)}" />
      <meta property="og:url" content="${canonical}" />
      <meta property="og:site_name" content="Macarena Baltra" />

      ${imgMeta}

      <script type="application/ld+json">
      ${JSON.stringify(jsonLd, null, 2)}  
      </script>
`.trim();

  return { head, canonical, title, metaDesc, ogImage };
}

/* =========================
   Main
   ========================= */
async function main() {
  try {
    const args = parseArgs();
    const src = args.src || 'assets/js/content-articles.js';
    const templatePath = args.template || 'templates/article-template.html';
    const outDir = args.out || 'dist';
    const origin = args.origin || 'https://macarenabaltradesigns.github.io/';
    const candidateDefault = args.defaultOgImage || `${origin.replace(/\/$/, '')}/assets/img/og-image/og-article-default_v1.webp`;
    const ogImageType = args.ogImageType || 'image/webp';
    const dry = !!args.dry;

    const defaultOgImage = resolveDefaultOgImage(candidateDefault, origin);

    if (!fs.existsSync(src)) throw new Error('Archivo fuente no encontrado: ' + src);

    const articles = loadArticles(src);
    if (!articles || Object.keys(articles).length === 0) throw new Error('No se recuperaron artículos del archivo fuente.');

    const template = fs.existsSync(templatePath) ? fs.readFileSync(templatePath, 'utf8') : null;
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    for (const key of Object.keys(articles)) {
      const raw = articles[key];
      const a = Object.assign({}, raw);
      a.id = raw.id || key;
      a.titlePlain = stripHtml(raw.titleHTML || raw.title || '');
      a.dateIso = raw.dateIso || raw.date || undefined;
      a.slug = raw.slug || raw.slugify || slugify(a.titlePlain || `article-${a.id}`);

      const opts = { origin, defaultOgImage, ogImageType };
      const { head } = buildHead(a, opts);

      let outHtml;
      if (template) {
        const bodyContent = raw.content || `<h1>${escapeHtml(a.titlePlain)}</h1><p>Artículo ${a.id}</p>`;
        outHtml = template.replace('<!--HEAD_BUNDLE-->', head).replace('<!--ARTICLE_BODY-->', bodyContent);
      } else {
        outHtml = `<!doctype html><html lang="es"><head>${head}</head><body><main><article>${raw.content || ''}</article></main></body></html>`;
      }

      if (dry) {
        console.log('--- head para article id=', a.id, 'slug=', a.slug);
        console.log(head);
      } else {
        const outPath = path.join(outDir, `${a.slug}.html`);
        fs.writeFileSync(outPath, outHtml, 'utf8');
        console.log('Generado:', outPath);
      }
    }

    console.log('Proceso completado. Carpeta:', outDir, dry ? '(dry run)' : '');
  } catch (e) {
    console.error('Error:', e && e.message ? e.message : e);
    process.exit(1);
  }
}

/* Ejecutar main */
main();

/* =========================
   End of file
   ========================= */