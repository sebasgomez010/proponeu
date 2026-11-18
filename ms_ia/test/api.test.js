const { test, before, after } = require('node:test');
const assert = require('node:assert');

// para las pruebas no se usa gemini (modo demo) y se pone una api key fija
delete process.env.GEMINI_API_KEY;
delete process.env.SMTP_HOST;
process.env.MS_API_KEY = 'clave-pruebas';

const app = require('../src/app');

let servidor;
let base;

before(() => {
  servidor = app.listen(0);
  base = `http://localhost:${servidor.address().port}`;
});

after(() => servidor.close());

function post(ruta, cuerpo, clave = 'clave-pruebas') {
  return fetch(base + ruta, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': clave },
    body: JSON.stringify(cuerpo),
  });
}

test('health responde sin api key', async () => {
  const r = await fetch(`${base}/api/v1/health`);
  assert.strictEqual(r.status, 200);
  assert.strictEqual((await r.json()).estado, 'ok');
});

test('swagger esta disponible', async () => {
  const r = await fetch(`${base}/api/docs/`);
  assert.strictEqual(r.status, 200);
  const spec = await (await fetch(`${base}/api/docs.json`)).json();
  assert.ok(spec.paths['/api/v1/propuestas/analizar']);
});

test('sin api key devuelve 401', async () => {
  const r = await post('/api/v1/propuestas/analizar', { titulo: 'a', descripcion: 'b' }, 'otra');
  assert.strictEqual(r.status, 401);
});

test('analizar pide titulo y descripcion', async () => {
  const r = await post('/api/v1/propuestas/analizar', { titulo: 'Solo titulo' });
  assert.strictEqual(r.status, 400);
});

test('analizar devuelve resumen, categoria y etiquetas', async () => {
  const r = await post('/api/v1/propuestas/analizar', {
    titulo: 'Taller de Docker',
    descripcion: 'Un taller practico para aprender Docker y contenedores. Usaremos Docker Compose.',
    categorias: ['Taller', 'Charla'],
  });
  assert.strictEqual(r.status, 200);
  const datos = await r.json();
  assert.ok(datos.resumen.length > 0);
  assert.strictEqual(datos.categoria_sugerida, 'Taller');
  assert.ok(datos.etiquetas.includes('docker'));
  assert.strictEqual(datos.modo, 'demo');
});

test('similares encuentra la propuesta parecida', async () => {
  const r = await post('/api/v1/propuestas/similares', {
    titulo: 'Curso de Git y GitHub',
    descripcion: 'Aprender ramas y pull requests en GitHub',
    propuestas: [
      { id: 1, titulo: 'Taller de Git y GitHub', descripcion: 'Ramas, pull requests y GitHub' },
      { id: 2, titulo: 'Charla de etica', descripcion: 'Etica profesional en ingenieria' },
    ],
  });
  const datos = await r.json();
  assert.deepStrictEqual(datos.similares.map((s) => s.id), [1]);
});

test('reporte con las propuestas del periodo', async () => {
  const r = await post('/api/v1/reportes', {
    desde: '2026-11-01',
    hasta: '2026-11-30',
    propuestas: [{ titulo: 'Taller de Git', categoria: 'Taller', estado: 'Publicada', votos: 3 }],
  });
  const datos = await r.json();
  assert.ok(datos.reporte.includes('Taller de Git'));
});

test('notificacion sin smtp se muestra en consola', async () => {
  const r = await post('/api/v1/notificaciones', { para: 'a@b.co', asunto: 'Hola', mensaje: 'Prueba' });
  assert.deepStrictEqual(await r.json(), { enviado: true, modo: 'consola' });
});
