// Genera los diagramas UML de la Entrega 1 como SVG y PNG.
const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const OUT = process.argv[2];
fs.mkdirSync(OUT, { recursive: true });

const FONT = 'Segoe UI, Arial, sans-serif';
const C = {
  ink: '#1E2A36', muted: '#5B6773',
  blue: '#1F4E79', blueBg: '#E8F0F8',
  green: '#2F7D4A', greenBg: '#E9F5EC',
  amber: '#9A5B00', amberBg: '#FFF4E0',
  gray: '#6B6B6B', grayBg: '#F4F4F4',
  uc: '#FFFBF0', ucStroke: '#A0711C',
};

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function text(x, y, s, o = {}) {
  const lines = Array.isArray(s) ? s : [s];
  const size = o.size || 14, lh = o.lh || size * 1.25;
  const anchor = o.anchor || 'middle';
  const y0 = o.vcenter ? y - ((lines.length - 1) * lh) / 2 + size * 0.35 : y;
  return lines.map((l, i) =>
    `<text x="${x}" y="${y0 + i * lh}" font-family="${FONT}" font-size="${size}" text-anchor="${anchor}"` +
    ` fill="${o.fill || C.ink}"${o.bold ? ' font-weight="700"' : ''}${o.italic ? ' font-style="italic"' : ''}>${esc(l)}</text>`
  ).join('\n');
}

const defs = `<defs>
  <marker id="open" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" orient="auto-start-reverse">
    <path d="M1,1 L11,6 L1,11" fill="none" stroke="${C.ink}" stroke-width="1.4"/></marker>
  <marker id="tri" viewBox="0 0 16 16" refX="15" refY="8" markerWidth="16" markerHeight="16" orient="auto-start-reverse">
    <path d="M1,1 L15,8 L1,15 Z" fill="#fff" stroke="${C.ink}" stroke-width="1.4"/></marker>
</defs>`;

function line(x1, y1, x2, y2, o = {}) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${o.stroke || C.ink}" stroke-width="${o.w || 1.4}"` +
    `${o.dash ? ' stroke-dasharray="7 5"' : ''}${o.marker ? ` marker-end="url(#${o.marker})"` : ''}/>`;
}

function poly(points, o = {}) {
  return `<polyline points="${points.map(p => p.join(',')).join(' ')}" fill="none" stroke="${o.stroke || C.ink}"` +
    ` stroke-width="${o.w || 1.4}"${o.dash ? ' stroke-dasharray="7 5"' : ''}${o.marker ? ` marker-end="url(#${o.marker})"` : ''}/>`;
}

function label(x, y, s, o = {}) {
  const size = o.size || 12.5;
  const lines = Array.isArray(s) ? s : [s];
  const w = Math.max(...lines.map(l => l.length)) * size * 0.56 + 12;
  const h = lines.length * size * 1.25 + 6;
  return `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="4" fill="#fff" fill-opacity="0.95"/>` +
    text(x, y, lines, { size, vcenter: true, fill: o.fill || C.muted, italic: o.italic });
}

function actor(x, y, name) {
  // (x, y) = centro de la cabeza
  return `<g stroke="${C.ink}" stroke-width="1.8" fill="none">
    <circle cx="${x}" cy="${y}" r="13" fill="#fff"/>
    <line x1="${x}" y1="${y + 13}" x2="${x}" y2="${y + 50}"/>
    <line x1="${x - 24}" y1="${y + 26}" x2="${x + 24}" y2="${y + 26}"/>
    <line x1="${x}" y1="${y + 50}" x2="${x - 18}" y2="${y + 78}"/>
    <line x1="${x}" y1="${y + 50}" x2="${x + 18}" y2="${y + 78}"/></g>` +
    text(x, y + 98, name, { size: 14, bold: true });
}

function usecase(cx, cy, rx, ry, lines) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${C.uc}" stroke="${C.ucStroke}" stroke-width="1.6"/>` +
    text(cx, cy, lines, { size: 13.5, vcenter: true });
}

function compIcon(x, y) {
  return `<g stroke="${C.ink}" stroke-width="1.1" fill="#fff">
    <rect x="${x}" y="${y}" width="16" height="20"/>
    <rect x="${x - 5}" y="${y + 4}" width="10" height="4"/>
    <rect x="${x - 5}" y="${y + 12}" width="10" height="4"/></g>`;
}

function component(x, y, w, h, title, sub, col = C.blue, bg = C.blueBg) {
  const lines = sub ? [title, sub] : [title];
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${bg}" stroke="${col}" stroke-width="1.6"/>` +
    compIcon(x + w - 26, y + 8) +
    text(x + w / 2 - 8, y + h / 2 - (sub ? 9 : -5), title, { size: 14, bold: true }) +
    (sub ? text(x + w / 2 - 8, y + h / 2 + 13, sub, { size: 12.5, fill: C.muted }) : '');
}

function container(x, y, w, h, stereo, title, col, bg, dash = false) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${bg}" stroke="${col}" stroke-width="2"${dash ? ' stroke-dasharray="9 6"' : ''}/>` +
    text(x + 16, y + 24, stereo, { size: 12.5, anchor: 'start', fill: col, italic: true }) +
    text(x + 16, y + 44, title, { size: 15, anchor: 'start', bold: true });
}

function cylinder(cx, y, w, h, lines, col = C.amber, bg = C.amberBg) {
  const rx = w / 2, ry = 14;
  return `<path d="M${cx - rx},${y + ry} L${cx - rx},${y + h - ry} A${rx},${ry} 0 0 0 ${cx + rx},${y + h - ry} L${cx + rx},${y + ry}" fill="${bg}" stroke="${col}" stroke-width="1.8"/>` +
    `<ellipse cx="${cx}" cy="${y + ry}" rx="${rx}" ry="${ry}" fill="${bg}" stroke="${col}" stroke-width="1.8"/>` +
    text(cx, y + h / 2 + 8, lines, { size: 13.5, vcenter: true, bold: true });
}

function node3d(x, y, w, h, stereo, title, col, bg, d = 14) {
  return `<g stroke="${col}" stroke-width="1.8">
    <path d="M${x},${y} L${x + d},${y - d} L${x + w + d},${y - d} L${x + w},${y} Z" fill="${bg}"/>
    <path d="M${x + w},${y} L${x + w + d},${y - d} L${x + w + d},${y + h - d} L${x + w},${y + h} Z" fill="${bg}"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${bg}"/></g>` +
    text(x + 14, y + 22, stereo, { size: 12.5, anchor: 'start', fill: col, italic: true }) +
    text(x + 14, y + 42, title, { size: 14.5, anchor: 'start', bold: true });
}

function artifact(x, y, w, h, title) {
  const f = 10;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="${C.ink}" stroke-width="1.1"/>` +
    `<path d="M${x + w - 22},${y + 6} l0,18 l14,0 l0,-13 l-5,-5 Z" fill="#fff" stroke="${C.ink}" stroke-width="1"/>` +
    text(x + 10, y + h / 2 + 5, title, { size: 12.5, anchor: 'start' }) + (f ? '' : '');
}

function svg(w, h, body, title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<rect width="100%" height="100%" fill="#ffffff"/>${defs}
${text(24, 30, title, { size: 18, anchor: 'start', bold: true, fill: C.blue })}
${body}
</svg>`;
}

// ---------------------------------------------------------------- Casos de uso
function casosDeUso() {
  const A = 470, B = 880, rxA = 158, rxB = 178, ry = 33;
  const ucA = {
    CU01: [110, ['CU01 Registrarse']],
    CU02: [195, ['CU02 Iniciar / cerrar sesión']],
    CU03: [280, ['CU03 Gestionar perfil']],
    CU04: [365, ['CU04 Crear propuesta']],
    CU05: [450, ['CU05 Editar / eliminar', 'propuesta propia']],
    CU06: [535, ['CU06 Consultar y buscar', 'propuestas']],
    CU07: [620, ['CU07 Votar propuesta']],
    CU08: [705, ['CU08 Comentar propuesta']],
  };
  const ucB = {
    CU09: [200, ['CU09 Analizar propuesta con IA', '(resumen, categoría, etiquetas)']],
    CU10: [310, ['CU10 Detectar propuestas', 'similares (IA)']],
    CU16: [430, ['CU16 Enviar notificación', 'por correo']],
    CU11: [540, ['CU11 Revisar y cambiar estado', '(aprobar / rechazar)']],
    CU12: [640, ['CU12 Generar reporte', 'ejecutivo con IA']],
    CU13: [740, ['CU13 Consultar estadísticas', '(dashboard)']],
    CU14: [850, ['CU14 Gestionar categorías']],
    CU15: [950, ['CU15 Gestionar usuarios y roles']],
  };
  let b = '';
  b += `<rect x="290" y="56" width="790" height="960" rx="10" fill="#FCFDFE" stroke="${C.blue}" stroke-width="2"/>`;
  b += text(685, 82, 'Sistema ProponeU', { size: 16, bold: true, fill: C.blue });

  // actores
  const vis = [90, 120], usr = [90, 470], est = [40, 790], doc = [150, 790];
  const coo = [1210, 560], adm = [1210, 860], ia = [1210, 215], mail = [1210, 400];
  b += actor(...vis, 'Visitante') + actor(...usr, 'Usuario registrado') + actor(...est, 'Estudiante') + actor(...doc, 'Docente');
  b += actor(...coo, 'Coordinador') + text(coo[0], coo[1] + 116, 'académico', { size: 14, bold: true });
  b += actor(...adm, 'Administrador');
  b += actor(...ia, 'Microservicio IA') + text(ia[0], ia[1] + 116, '«sistema externo»', { size: 12, italic: true, fill: C.muted });
  b += actor(...mail, 'Servicio de correo') + text(mail[0], mail[1] + 116, '«sistema externo»', { size: 12, italic: true, fill: C.muted });

  // generalización Estudiante/Docente -> Usuario registrado
  b += line(est[0] + 4, est[1] - 16, usr[0] - 22, usr[1] + 128, { marker: 'tri' });
  b += line(doc[0] - 4, doc[1] - 16, usr[0] + 22, usr[1] + 128, { marker: 'tri' });

  const L = (actorPt, cy, side = 'A') => {
    const ax = actorPt[0] + (side === 'A' ? 28 : -28), ay = actorPt[1] + 30;
    const ex = side === 'A' ? A - rxA : B + rxB;
    return line(ax, ay, ex + (side === 'A' ? 4 : -4), cy);
  };
  b += L(vis, ucA.CU01[0]) + L(vis, ucA.CU02[0]) + L(vis, ucA.CU06[0]);
  for (const k of ['CU02', 'CU03', 'CU04', 'CU05', 'CU06', 'CU07', 'CU08']) b += L(usr, ucA[k][0]);
  for (const k of ['CU11', 'CU12', 'CU13']) b += L(coo, ucB[k][0], 'B');
  for (const k of ['CU14', 'CU15']) b += L(adm, ucB[k][0], 'B');
  for (const k of ['CU09', 'CU10', 'CU12']) b += L(ia, ucB[k][0], 'B');
  b += L(mail, ucB.CU16[0], 'B');

  for (const [k, [cy, t]] of Object.entries(ucA)) b += usecase(A, cy, rxA, ry, t);
  for (const [k, [cy, t]] of Object.entries(ucB)) b += usecase(B, cy, rxB, ry, t);

  // relaciones include / extend
  b += line(A + rxA - 10, ucA.CU04[0] - 14, B - rxB + 14, ucB.CU09[0] + 20, { dash: true, marker: 'open' });
  b += label(672, 272, '«include»', { italic: true });
  b += line(B - rxB + 6, ucB.CU10[0] + 14, A + rxA - 2, ucA.CU04[0] - 4, { dash: true, marker: 'open' });
  b += label(675, 340, '«extend»', { italic: true });
  b += line(B, ucB.CU11[0] - ry, B, ucB.CU16[0] + ry + 2, { dash: true, marker: 'open' });
  b += label(B + 46, 485, '«include»', { italic: true });
  b += line(A + rxA - 6, ucA.CU07[0] - 10, B - rxB + 20, ucB.CU16[0] + 26, { dash: true, marker: 'open' });
  b += label(688, 518, '«include»', { italic: true });

  b += text(300, 1046, 'Nota: el Coordinador académico y el Administrador también son usuarios registrados (heredan CU02, CU03, CU06).', { size: 12.5, anchor: 'start', fill: C.muted, italic: true });
  return svg(1340, 1066, b, 'Diagrama de casos de uso — ProponeU');
}

// ---------------------------------------------------------------- Componentes
function componentes() {
  let b = '';
  b += component(30, 400, 200, 76, 'Navegador web', 'Cliente (HTML/CSS/JS)', C.gray, C.grayBg);

  b += container(262, 52, 900, 900, '«Docker Compose» · red interna proponeu_net', '', C.gray, '#FFFFFF', true);

  // Django
  b += container(292, 100, 440, 830, '«contenedor» django_app · :8000', 'Aplicación web Django 6 + Gunicorn', C.blue, '#F7FAFD');
  const dj = [
    ['usuarios', 'Registro, login, perfiles y roles'],
    ['propuestas', 'CRUD de propuestas y categorías'],
    ['participacion', 'Votos y comentarios'],
    ['revision', 'Aprobación, estados y estadísticas'],
    ['reportes', 'Reportes ejecutivos con IA'],
    ['Django Admin', 'Panel administrativo'],
    ['integraciones', 'Cliente HTTP del microservicio'],
    ['ORM Django', 'Modelos y migraciones'],
  ];
  dj.forEach(([t, s], i) => { b += component(318, 165 + i * 94, 388, 68, t, s); });

  // Node
  b += container(790, 100, 344, 520, '«contenedor» ms_ia · :3000', 'Microservicio Node.js 20 + Express', C.green, '#F8FCF9');
  const nd = [
    ['API REST /api/v1', 'Rutas y controladores'],
    ['Servicio IA', 'Prompts y análisis de texto'],
    ['Servicio de notificaciones', 'Envío de correos'],
    ['Swagger UI /api/docs', 'Especificación OpenAPI 3'],
    ['Middleware', 'API Key, validación y logs'],
  ];
  nd.forEach(([t, s], i) => { b += component(812, 165 + i * 88, 300, 66, t, s, C.green, C.greenBg); });
  b += line(950, 231, 950, 253, { marker: 'open' });

  // PostgreSQL
  b += container(790, 680, 344, 250, '«contenedor» db · :5432', 'PostgreSQL 16', C.amber, '#FFFCF6');
  b += cylinder(962, 760, 220, 140, ['BD proponeu', '(datos de la aplicación)']);

  // Externos
  b += component(1222, 210, 250, 76, 'API de IA generativa', 'Google Gemini (HTTPS)', C.gray, C.grayBg);
  b += component(1222, 370, 250, 76, 'Servidor SMTP', 'Correo electrónico', C.gray, C.grayBg);
  b += text(1347, 190, '«servicios externos»', { size: 12.5, italic: true, fill: C.muted });

  // Conectores
  b += line(230, 438, 292, 438, { marker: 'open' });
  b += label(250, 500, ['HTTPS', 'HTML/Forms']);
  b += poly([[706, 777], [760, 777], [760, 198], [812, 198]], { marker: 'open' });
  b += label(760, 470, ['REST/JSON', '+ API Key']);
  b += line(1112, 286, 1222, 250, { marker: 'open' });
  b += label(1166, 252, 'HTTPS');
  b += line(1112, 374, 1222, 404, { marker: 'open' });
  b += label(1166, 405, 'SMTP');
  b += poly([[706, 871], [760, 871], [760, 830], [852, 830]], { marker: 'open' });
  b += label(770, 902, 'SQL (psycopg)');

  b += text(30, 990, 'Los módulos de Django acceden a la base de datos a través del ORM y al microservicio a través del módulo «integraciones».', { size: 12.5, anchor: 'start', italic: true, fill: C.muted });
  return svg(1500, 1010, b, 'Diagrama de componentes — ProponeU');
}

// ---------------------------------------------------------------- Despliegue
function despliegue() {
  let b = '';
  b += node3d(30, 330, 240, 150, '«device»', 'Dispositivo del usuario', C.gray, C.grayBg);
  b += artifact(52, 400, 196, 50, 'Navegador web');

  b += node3d(330, 70, 780, 770, '«cloud · PaaS»', 'Render — Producción', C.blue, '#F7FAFD', 18);

  b += node3d(360, 140, 330, 300, '«execution env.» Docker', 'Web Service: proponeu-web', C.blue, C.blueBg);
  b += artifact(380, 210, 290, 46, '«artifact» imagen django_app');
  b += artifact(380, 272, 290, 46, 'Gunicorn + Django 6');
  b += artifact(380, 334, 290, 46, 'WhiteNoise (archivos estáticos)');

  b += node3d(750, 140, 330, 300, '«execution env.» Docker', 'Web Service: proponeu-ms', C.green, C.greenBg);
  b += artifact(770, 210, 290, 46, '«artifact» imagen ms_ia');
  b += artifact(770, 272, 290, 46, 'Node.js 20 + Express');
  b += artifact(770, 334, 290, 46, 'Swagger UI /api/docs');

  b += node3d(360, 530, 330, 260, '«database server»', 'Render PostgreSQL (gestionado)', C.amber, C.amberBg);
  b += cylinder(525, 610, 220, 140, ['BD proponeu', 'PostgreSQL 16']);

  b += node3d(750, 530, 330, 260, '«configuration»', 'Variables de entorno', C.gray, C.grayBg);
  ['DJANGO_SECRET_KEY · DEBUG', 'DATABASE_URL', 'MS_IA_URL · MS_API_KEY', 'GEMINI_API_KEY', 'SMTP_HOST · SMTP_USER · SMTP_PASS']
    .forEach((t, i) => { b += text(772, 612 + i * 30, t, { size: 13, anchor: 'start' }); });

  b += node3d(1180, 140, 290, 120, '«external service»', 'Google AI — Gemini API', C.gray, C.grayBg);
  b += node3d(1180, 330, 290, 120, '«external service»', 'Servidor SMTP (Gmail)', C.gray, C.grayBg);
  b += node3d(1180, 580, 290, 150, '«repository»', 'GitHub', C.gray, C.grayBg);
  b += artifact(1200, 650, 250, 46, 'Código + Dockerfiles');

  b += line(270, 400, 360, 300, { marker: 'open' }) + label(300, 330, ['HTTPS', ':443']);
  b += line(690, 290, 750, 290, { marker: 'open' }) + label(720, 262, ['HTTPS', 'REST/JSON']);
  b += line(525, 440, 525, 530, { marker: 'open' }) + label(525, 486, 'TCP 5432 / SSL');
  b += line(1094, 200, 1180, 200, { marker: 'open' }) + label(1137, 178, 'HTTPS');
  b += line(1094, 400, 1180, 390, { marker: 'open' }) + label(1137, 372, ['SMTP/TLS', ':587']);
  b += line(1180, 655, 1128, 655, { marker: 'open' }) + label(1150, 625, ['git push →', 'auto-deploy']);

  b += node3d(30, 600, 260, 200, '«device» Desarrollo local', 'Equipo del desarrollador', C.gray, '#FFFFFF');
  b += text(46, 680, ['docker compose up', '→ django_app :8000', '→ ms_ia :3000', '→ db (PostgreSQL) :5432'], { size: 13, anchor: 'start', lh: 22 });

  return svg(1500, 880, b, 'Diagrama de despliegue — ProponeU');
}

const all = { casos_de_uso: casosDeUso(), componentes: componentes(), despliegue: despliegue() };
for (const [name, s] of Object.entries(all)) {
  fs.writeFileSync(path.join(OUT, `${name}.svg`), s);
  const png = new Resvg(s, { fitTo: { mode: 'zoom', value: 2 }, font: { loadSystemFonts: true, defaultFontFamily: 'Segoe UI' } }).render().asPng();
  fs.writeFileSync(path.join(OUT, `${name}.png`), png);
  console.log(name, 'ok');
}
