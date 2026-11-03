// Genera docs/backlog.md y docs/trazabilidad.md a partir de content.js.
const fs = require('fs');
const path = require('path');
const D = require('./content');
const OUT = process.argv[2];

const row = cells => `| ${cells.map(c => String(c).replace(/\|/g, '\\|')).join(' | ')} |`;

let backlog = `# Backlog inicial — ${D.proyecto}\n\n` +
  'Priorización MoSCoW (Must, Should, Could) y estimación en puntos de historia (Fibonacci). ' +
  'Cada historia se registra como issue en GitHub con la plantilla «Historia de usuario».\n\n' +
  row(['ID', 'Historia de usuario', 'Prioridad', 'Puntos', 'Entrega']) + '\n' + row(['---', '---', '---', '---', '---']) + '\n' +
  D.hu.map(h => row([h[0], `Como ${h[1]}, quiero ${h[2]}, para ${h[3]}.`, h[5], h[6], h[7]])).join('\n') +
  `\n\n**Total estimado:** ${D.hu.reduce((a, h) => a + h[6], 0)} puntos.\n\n## Criterios de aceptación\n\n` +
  D.hu.map(h => `### ${h[0]} — ${h[2][0].toUpperCase() + h[2].slice(1)}\n\n` + h[4].map(c => `- [ ] ${c}`).join('\n')).join('\n\n') + '\n';

let traz = `# Matriz de trazabilidad — ${D.proyecto}\n\n` +
  'Formato de la guía institucional: RF → Caso de uso → Historia de usuario → Componente → Evidencia en video → Entrega → URL desplegada.\n' +
  'Se actualiza en cada entrega; la URL se completa cuando el requisito está desplegado.\n\n' +
  row(['RF', 'Requisito', 'CU', 'HU', 'Componente', 'Evidencia en video', 'Entrega', 'URL']) + '\n' +
  row(Array(8).fill('---')) + '\n' +
  D.rf.map(r => row([r[0], r[1], r[3], r[4], r[5], r[7], r[6], 'Pendiente'])).join('\n') + '\n';

fs.writeFileSync(path.join(OUT, 'backlog.md'), backlog);
fs.writeFileSync(path.join(OUT, 'trazabilidad.md'), traz);
console.log('ok');
