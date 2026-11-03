// Construye el SRS de la Entrega 1 en Word.
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, ImageRun, PageBreak, Footer, Header, PageNumber,
  TableOfContents, LevelFormat, VerticalAlign,
} = require('docx');
const D = require('./content');

const [, , UML_DIR, OUT] = process.argv;
const BLUE = '1F4E79', LIGHT = 'E8F0F8', GRAY = 'BFBFBF';
const W = 9360; // ancho útil carta con márgenes de 1"

const p = (t, o = {}) => new Paragraph({
  spacing: { after: 120, line: 288 }, alignment: o.align || AlignmentType.JUSTIFIED, ...o.para,
  children: (Array.isArray(t) ? t : [t]).map(x => typeof x === 'string' ? new TextRun({ text: x, ...o.run }) : x),
});
const b = t => new TextRun({ text: t, bold: true });
const h1 = t => new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, children: [new TextRun(t)] });
const h2 = t => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] });
const h3 = t => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(t)] });
const bullet = (t, lvl = 0) => new Paragraph({
  numbering: { reference: 'bullets', level: lvl }, spacing: { after: 60, line: 276 },
  children: (Array.isArray(t) ? t : [t]).map(x => typeof x === 'string' ? new TextRun(x) : x),
});
const numbered = (t, ref) => new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { after: 60 }, children: [new TextRun(t)] });

const border = { style: BorderStyle.SINGLE, size: 4, color: GRAY };
const borders = { top: border, bottom: border, left: border, right: border };

function cell(content, width, o = {}) {
  const paras = (Array.isArray(content) ? content : [content]).map(c =>
    c instanceof Paragraph ? c : new Paragraph({
      spacing: { after: 40 }, alignment: o.align,
      children: [new TextRun({ text: String(c), bold: o.bold, color: o.color, size: o.size || 19 })],
    }));
  return new TableCell({
    width: { size: width, type: WidthType.DXA }, borders, verticalAlign: o.valign || VerticalAlign.TOP,
    shading: o.fill ? { fill: o.fill, type: ShadingType.CLEAR, color: 'auto' } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 }, children: paras,
  });
}

function table(headers, rows, widths) {
  const total = widths.reduce((a, x) => a + x, 0);
  return new Table({
    width: { size: total, type: WidthType.DXA }, columnWidths: widths,
    rows: [
      new TableRow({ tableHeader: true, children: headers.map((h, i) => cell(h, widths[i], { bold: true, color: 'FFFFFF', fill: BLUE })) }),
      ...rows.map((r, ri) => new TableRow({
        cantSplit: true,
        children: r.map((c, i) => cell(c, widths[i], { fill: ri % 2 ? 'F7F9FC' : undefined })),
      })),
    ],
  });
}

function keyValue(rows, widths = [2400, W - 2400]) {
  return new Table({
    width: { size: W, type: WidthType.DXA }, columnWidths: widths,
    rows: rows.map(([k, v]) => new TableRow({
      cantSplit: true,
      children: [cell(k, widths[0], { bold: true, fill: LIGHT }), cell(v, widths[1])],
    })),
  });
}

function figure(file, caption) {
  const buf = fs.readFileSync(path.join(UML_DIR, file));
  const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
  const width = 624;
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { before: 120, after: 60 },
      children: [new ImageRun({ type: 'png', data: buf, transformation: { width, height: Math.round(width * h / w) } })],
    }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: caption, italics: true, size: 18, color: '595959' })] }),
  ];
}
const space = () => new Paragraph({ spacing: { after: 80 }, children: [] });

// ------------------------------------------------------------------ Portada
const portada = [
  new Paragraph({ spacing: { before: 1800, after: 200 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'EXPOUNINPAHU 2026 · PROYECTO INTEGRADOR', size: 22, color: '595959', bold: true })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: 'Especificación de Requisitos de Software (SRS)', size: 36, color: BLUE })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: D.proyecto, size: 64, bold: true, color: BLUE })] }),
  new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 900 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: BLUE, space: 12 } },
    children: [new TextRun({ text: D.subtitulo, size: 28, color: '404040' })],
  }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Integrantes', bold: true, size: 24 })] }),
  ...D.integrantes.map(n => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: n, size: 22 })] })),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400, after: 40 }, children: [new TextRun({ text: `Docente: ${D.docente}`, size: 22 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: D.programa, size: 22 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: `Entrega 1 — Requisitos y arquitectura · Versión ${D.version} · ${D.fecha}`, size: 22 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Basado en IEEE 830 / ISO/IEC/IEEE 29148', size: 20, italics: true, color: '595959' })] }),
];

const control = [
  new Paragraph({ pageBreakBefore: true, spacing: { after: 160 }, children: [new TextRun({ text: 'Control de versiones', bold: true, size: 28, color: BLUE })] }),
  table(['Versión', 'Fecha', 'Autor', 'Descripción'], [
    ['1.0', D.fecha, 'Equipo ProponeU', 'Versión inicial para la Entrega 1: problema, objetivos, alcance, tecnologías, requisitos, UML inicial, backlog y matriz de trazabilidad.'],
  ], [1100, 1400, 2000, 4860]),
  new Paragraph({ spacing: { before: 400, after: 160 }, children: [new TextRun({ text: 'Tabla de contenido', bold: true, size: 28, color: BLUE })] }),
  new TableOfContents('Tabla de contenido', { hyperlink: true, headingStyleRange: '1-2' }),
  p('Si la tabla aparece vacía, haga clic derecho sobre ella y seleccione «Actualizar campos».', { run: { italics: true, size: 18, color: '808080' } }),
];

// ------------------------------------------------------------------ Secciones
const s1 = [
  h1('1. Introducción'),
  h2('1.1 Propósito'),
  p(`Este documento especifica los requisitos de ${D.proyecto}, ${D.subtitulo.toLowerCase()}. Está dirigido al docente evaluador, a los jurados de ExpoUninpahu 2026 y al equipo de desarrollo, y sirve como base para el diseño, la implementación, las pruebas y la trazabilidad del proyecto en todas sus entregas.`),
  h2('1.2 Alcance del producto'),
  p(`${D.proyecto} es una aplicación web en la que estudiantes y docentes de Uninpahu proponen actividades académicas complementarias, la comunidad las vota y comenta, y la coordinación académica las revisa y responde. Un microservicio en Node.js integra una API de inteligencia artificial generativa para resumir, clasificar y comparar propuestas, y para generar reportes ejecutivos. El alcance detallado se presenta en la sección 4.`),
  h2('1.3 Definiciones, acrónimos y abreviaturas'),
  table(['Término', 'Definición'], [
    ['Propuesta', 'Idea de actividad académica complementaria (taller, charla, semillero, hackatón, salida técnica, club de estudio) registrada en la plataforma.'],
    ['SRS', 'Software Requirements Specification — Especificación de Requisitos de Software.'],
    ['RF / RNF', 'Requisito funcional / Requisito no funcional.'],
    ['CU / HU', 'Caso de uso / Historia de usuario.'],
    ['IA generativa', 'Modelos de inteligencia artificial capaces de generar texto a partir de instrucciones (prompts).'],
    ['Microservicio', 'Servicio independiente, desplegable por separado, que expone una API para una responsabilidad concreta.'],
    ['API REST', 'Interfaz de programación basada en HTTP y JSON.'],
    ['Swagger / OpenAPI', 'Especificación estándar y herramienta para documentar y probar APIs REST.'],
    ['Docker / Docker Compose', 'Tecnología de contenedores y herramienta para definir y levantar varios contenedores juntos.'],
    ['ORM', 'Object-Relational Mapping: capa de Django que traduce modelos de Python a tablas de la base de datos.'],
    ['Git Flow', 'Modelo de ramas (main, develop, feature/*, release/*, hotfix/*) para organizar el desarrollo.'],
  ], [2400, W - 2400]),
  h2('1.4 Referencias'),
  bullet('IEEE Std 830-1998, Recommended Practice for Software Requirements Specifications.'),
  bullet('ISO/IEC/IEEE 29148:2018, Systems and software engineering — Life cycle processes — Requirements engineering.'),
  bullet('Guía Institucional del Proyecto Integrador ExpoUninpahu 2026, Programa de Ingeniería de Software.'),
  bullet('Documentación oficial de Django, Node.js, Express, OpenAPI 3, Docker y Render.'),
  bullet('Ley 1581 de 2012 (Colombia), régimen general de protección de datos personales.'),
  h2('1.5 Visión general del documento'),
  p('La sección 2 describe el problema y su justificación; la 3 los objetivos; la 4 el alcance; la 5 la descripción general del producto, sus actores y restricciones; la 6 las tecnologías; la 7 la arquitectura con los diagramas de componentes y despliegue; las secciones 8 a 10 los requisitos y casos de uso; la 11 el backlog inicial; la 12 la matriz de trazabilidad, y la 13 la organización del repositorio.'),
];

const s2 = [
  h1('2. Problema a resolver y justificación'),
  h2('2.1 ¿Quién tiene el problema?'),
  p(D.problema.quien),
  h2('2.2 ¿Cómo se ve actualmente?'),
  ...D.problema.actual.map(t => bullet(t)),
  h2('2.3 ¿Por qué vale la pena resolverlo?'),
  ...D.problema.porque.map(t => bullet(t)),
  h2('2.4 Planteamiento del problema'),
  p('¿Cómo centralizar, priorizar y dar respuesta trazable a las propuestas de actividades académicas de la comunidad de Uninpahu, reduciendo el trabajo manual de la coordinación mediante inteligencia artificial generativa?', { run: { italics: true } }),
  h2('2.5 Justificación'),
  ...D.justificacion.map(t => p(t)),
];

const s3 = [
  h1('3. Objetivos'),
  h2('3.1 Objetivo general'),
  p(D.objetivoGeneral),
  h2('3.2 Objetivos específicos'),
  ...D.objetivosEspecificos.map(t => numbered(t, 'objetivos')),
];

const s4 = [
  h1('4. Alcance'),
  h2('4.1 El sistema incluye'),
  ...D.alcanceIncluye.map(t => bullet(t)),
  h2('4.2 Fuera del alcance'),
  ...D.alcanceExcluye.map(t => bullet(t)),
  h2('4.3 Alcance por entrega'),
  table(['Fecha', 'Entrega', 'Resultado esperado'], [
    ['05/11/2026', 'Entrega 1 — Requisitos y arquitectura', 'SRS, UML inicial (casos de uso, componentes, despliegue), backlog, repositorio GitHub, matriz de trazabilidad inicial y video.'],
    ['12/11/2026', 'Entrega 2 — Núcleo funcional', 'Registro, login, roles, CRUD de propuestas y categorías, votos, comentarios, revisión, Django Admin, Dockerfile, despliegue inicial y diagrama de secuencia.'],
    ['19/11/2026', 'Entrega 3 — Integración', 'Microservicio Node.js, Swagger público, integración con IA, notificaciones, Docker Compose y UML actualizado.'],
    ['26/11/2026', 'ExpoUninpahu — Sustentación', 'Producto final completo, tablero de estadísticas, documentación final y demostración en vivo.'],
  ], [1400, 2800, W - 4200]),
];

const s5 = [
  h1('5. Descripción general'),
  h2('5.1 Perspectiva del producto'),
  p(`${D.proyecto} es un sistema nuevo que evoluciona un prototipo académico previo desarrollado en Django (aplicación «propuestas» con votación básica). Se compone de una aplicación web Django, un microservicio Node.js, una base de datos PostgreSQL y dos servicios externos: una API de IA generativa y un servidor de correo.`),
  h2('5.2 Funciones principales'),
  bullet('Gestión de usuarios, autenticación y roles.'),
  bullet('Gestión de propuestas y categorías (CRUD).'),
  bullet('Participación de la comunidad: búsqueda, votos y comentarios.'),
  bullet('Revisión y respuesta de la coordinación con notificación por correo.'),
  bullet('Análisis con IA: resumen, clasificación, detección de similares y reportes ejecutivos.'),
  h2('5.3 Actores y características de los usuarios'),
  table(['Actor', 'Descripción', 'Responsabilidades en el sistema'], D.actores, [2000, 3000, W - 5000]),
  h2('5.4 Restricciones'),
  ...D.restricciones.map(t => bullet(t)),
  h2('5.5 Suposiciones y dependencias'),
  ...D.suposiciones.map(t => bullet(t)),
];

const s6 = [
  h1('6. Tecnologías'),
  p('La selección de tecnologías responde a las tecnologías obligatorias de la guía institucional y a la experiencia previa del equipo con Django.'),
  table(['Capa', 'Tecnología', 'Uso en el proyecto'], D.tecnologias, [1900, 2700, W - 4600]),
];

const s7 = [
  h1('7. Arquitectura de la solución'),
  p('La solución sigue una arquitectura de microservicios ligera: Django es la aplicación principal y dueña de los datos; Node.js es un microservicio especializado que aísla las integraciones con terceros (IA y correo). Ambos se comunican por REST/JSON y se empaquetan como contenedores Docker.'),
  h2('7.1 Diagrama de componentes'),
  ...figure('componentes.png', 'Figura 1. Diagrama de componentes de ProponeU.'),
  table(['Componente', 'Responsabilidad'], D.componentesTexto, [2600, W - 2600]),
  h2('7.2 Diagrama de despliegue'),
  ...figure('despliegue.png', 'Figura 2. Diagrama de despliegue de ProponeU.'),
  ...D.despliegueTexto.map(t => bullet(t)),
];

const s8 = [
  h1('8. Requisitos funcionales'),
  table(['ID', 'Requisito', 'Prioridad', 'CU', 'HU'], D.rf.map(r => [r[0], r[1], r[2], r[3], r[4]]), [800, 5560, 1000, 1100, 900]),
];

const s9 = [
  h1('9. Requisitos no funcionales'),
  table(['ID', 'Categoría', 'Requisito'], D.rnf, [900, 1700, W - 2600]),
];

const s10 = [
  h1('10. Casos de uso'),
  h2('10.1 Diagrama de casos de uso'),
  ...figure('casos_de_uso.png', 'Figura 3. Diagrama de casos de uso de ProponeU.'),
  h2('10.2 Resumen de casos de uso'),
  table(['ID', 'Caso de uso', 'Actores', 'Descripción'], D.cu, [800, 2300, 2300, W - 5400]),
  h2('10.3 Especificación de los casos de uso principales'),
  ...D.cuDetalle.flatMap(c => [
    h3(`${c.id} — ${c.nombre}`),
    keyValue([
      ['Actores', c.actores],
      ['Precondición', c.pre],
      ['Flujo principal', c.flujo.map((t, i) => new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: `${i + 1}. ${t}`, size: 19 })] }))],
      ['Flujos alternos', c.alternos.map(t => new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: t, size: 19 })] }))],
      ['Postcondición', c.post],
    ]),
    space(),
  ]),
];

const s11 = [
  h1('11. Backlog inicial — Historias de usuario'),
  p('Las historias se priorizan con MoSCoW (Must, Should, Could) y se estiman en puntos de historia (escala Fibonacci). Cada historia se registrará como issue en GitHub y se gestionará en el tablero del proyecto.'),
  table(['ID', 'Historia de usuario', 'Criterios de aceptación', 'Prior.', 'Pts', 'Entrega'],
    D.hu.map(h => [
      h[0],
      `Como ${h[1]}, quiero ${h[2]}, para ${h[3]}.`,
      h[4].map(t => new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { after: 20 }, children: [new TextRun({ text: t, size: 18 })] })),
      h[5], String(h[6]), h[7],
    ]), [700, 2900, 3460, 800, 500, 1000]),
  p([b('Total estimado: '), `${D.hu.reduce((a, h) => a + h[6], 0)} puntos de historia.`], { para: { spacing: { before: 160 } } }),
];

const s12 = [
  h1('12. Matriz de trazabilidad inicial'),
  p('Formato definido por la guía institucional: RF → Caso de uso → Historia de usuario → Componente → Evidencia en video → Entrega → URL desplegada. La columna de URL se completará cuando cada requisito esté desplegado.'),
  table(['RF', 'CU', 'HU', 'Componente', 'Evidencia en video', 'Entrega', 'URL'],
    D.rf.map(r => [r[0], r[3], r[4], r[5], r[7], r[6], 'Pendiente']),
    [700, 1100, 700, 2160, 2100, 1500, 1100]),
];

const s13 = [
  h1('13. Repositorio y organización del proyecto'),
  h2('13.1 Estructura del repositorio'),
  ...[
    ['django_app/', 'Aplicación Django (proyecto «problema» con las apps actuales).'],
    ['ms_ia/', 'Microservicio Node.js (se implementa en la Entrega 3).'],
    ['docs/', 'SRS, diagramas UML (SVG y PNG), backlog, matriz de trazabilidad y guion de los videos.'],
    ['.github/', 'Plantillas de issues (historia de usuario, bug) y de pull request.'],
    ['.env.example', 'Variables de entorno necesarias, sin valores secretos.'],
    ['README.md', 'Descripción del proyecto, arquitectura e instrucciones de ejecución.'],
  ].map(([k, v]) => bullet([new TextRun({ text: k, bold: true, font: 'Consolas' }), new TextRun(` — ${v}`)])),
  h2('13.2 Flujo de trabajo (Git Flow)'),
  bullet([b('main: '), 'versión estable desplegada en producción.']),
  bullet([b('develop: '), 'integración de las funcionalidades terminadas.']),
  bullet([b('feature/HUxx-descripcion: '), 'una rama por historia de usuario, integrada a develop mediante pull request revisado por otro integrante.']),
  bullet([b('release/entrega-N y hotfix/*: '), 'preparación de cada entrega y correcciones urgentes.']),
  bullet([b('Commits: '), 'convención Conventional Commits (feat, fix, docs, test, chore) con referencia a la historia, por ejemplo «feat(propuestas): crear propuesta (HU04)».']),
];

const doc = new Document({
  creator: 'Equipo ProponeU', title: `SRS — ${D.proyecto}`, description: 'Especificación de Requisitos de Software — Entrega 1',
  features: { updateFields: true },
  styles: {
    default: { document: { run: { font: 'Arial', size: 21 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 32, bold: true, color: BLUE, font: 'Arial' }, paragraph: { spacing: { before: 120, after: 200 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 26, bold: true, color: BLUE, font: 'Arial' }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 23, bold: true, color: '404040', font: 'Arial' }, paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 240 } } } }] },
      { reference: 'objetivos', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 360 } } } }] },
    ],
  },
  sections: [
    {
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }, titlePage: true },
      headers: {
        default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `${D.proyecto} · SRS v${D.version}`, size: 16, color: '808080' })] })] }),
        first: new Header({ children: [] }),
      },
      footers: {
        default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ size: 16, color: '808080', children: ['Página ', PageNumber.CURRENT, ' de ', PageNumber.TOTAL_PAGES] })] })] }),
        first: new Footer({ children: [] }),
      },
      children: [...portada, ...control, ...s1, ...s2, ...s3, ...s4, ...s5, ...s6, ...s7, ...s8, ...s9, ...s10, ...s11, ...s12, ...s13],
    },
  ],
});

Packer.toBuffer(doc).then(buf => { fs.writeFileSync(OUT, buf); console.log('OK', OUT, buf.length); });
