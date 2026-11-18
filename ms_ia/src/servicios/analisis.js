const { hayGemini, preguntar } = require('./gemini');

// palabras que no sirven como etiquetas
const PALABRAS_COMUNES = new Set([
  'para', 'como', 'con', 'que', 'los', 'las', 'del', 'una', 'uno', 'por', 'sobre', 'entre', 'este',
  'esta', 'estos', 'estas', 'sus', 'mas', 'más', 'muy', 'sin', 'desde', 'hasta', 'donde', 'cuando',
  'puede', 'pueden', 'hacer', 'tiene', 'tener', 'ser', 'son', 'fue', 'the', 'and',
]);

function palabrasClave(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .split(/[^a-z0-9ñ]+/)
    .filter((p) => p.length > 3 && !PALABRAS_COMUNES.has(p));
}

// ---------- analizar una propuesta ----------

async function analizarPropuesta(titulo, descripcion, categorias = []) {
  if (!hayGemini()) {
    return analizarDemo(titulo, descripcion, categorias);
  }

  const prompt = `Eres asistente de la coordinacion academica de una universidad colombiana.
Analiza esta propuesta de actividad academica y responde SOLO un JSON con esta forma:
{"resumen": "maximo 2 frases", "categoria_sugerida": "una de la lista", "etiquetas": ["3 a 5 palabras clave"], "sugerencias": ["2 o 3 consejos cortos para mejorar la redaccion"]}

Categorias disponibles: ${categorias.join(', ') || 'Taller, Charla, Semillero de investigación, Hackatón, Salida técnica, Club de estudio'}

Titulo: ${titulo}
Descripcion: ${descripcion}`;

  const r = await preguntar(prompt);
  return {
    resumen: r.resumen || '',
    categoria_sugerida: r.categoria_sugerida || '',
    etiquetas: Array.isArray(r.etiquetas) ? r.etiquetas.slice(0, 5) : [],
    sugerencias: Array.isArray(r.sugerencias) ? r.sugerencias.slice(0, 3) : [],
    modo: 'gemini',
  };
}

// cuando no hay api key se hace algo sencillo para poder probar
function analizarDemo(titulo, descripcion, categorias) {
  const frases = descripcion.split(/(?<=[.!?])\s+/);
  const conteo = {};
  palabrasClave(`${titulo} ${descripcion}`).forEach((p) => { conteo[p] = (conteo[p] || 0) + 1; });
  const etiquetas = Object.entries(conteo).sort((a, b) => b[1] - a[1]).slice(0, 4).map((e) => e[0]);

  const texto = `${titulo} ${descripcion}`.toLowerCase();
  const categoria = categorias.find((c) => texto.includes(c.toLowerCase().split(' ')[0])) || categorias[0] || '';

  return {
    resumen: frases.slice(0, 2).join(' ').slice(0, 300),
    categoria_sugerida: categoria,
    etiquetas,
    sugerencias: descripcion.length < 120 ? ['Agrega mas detalles sobre el objetivo y el publico.'] : [],
    modo: 'demo',
  };
}

// ---------- buscar propuestas parecidas ----------

async function buscarSimilares(titulo, descripcion, propuestas = []) {
  if (propuestas.length === 0) {
    return { similares: [], modo: hayGemini() ? 'gemini' : 'demo' };
  }
  if (!hayGemini()) {
    return similaresDemo(titulo, descripcion, propuestas);
  }

  const lista = propuestas.map((p) => `- id ${p.id}: ${p.titulo}. ${String(p.descripcion || '').slice(0, 200)}`).join('\n');
  const prompt = `Tengo una propuesta nueva y una lista de propuestas existentes.
Dime cuales existentes tratan casi del mismo tema (maximo 3). Si ninguna se parece devuelve la lista vacia.
Responde SOLO un JSON: {"similares": [{"id": numero, "motivo": "frase corta"}]}

Propuesta nueva: ${titulo}. ${descripcion}

Existentes:
${lista}`;

  const r = await preguntar(prompt);
  const ids = new Set(propuestas.map((p) => Number(p.id)));
  const similares = (Array.isArray(r.similares) ? r.similares : [])
    .filter((s) => ids.has(Number(s.id)))
    .slice(0, 3)
    .map((s) => ({ id: Number(s.id), motivo: s.motivo || '' }));
  return { similares, modo: 'gemini' };
}

function similaresDemo(titulo, descripcion, propuestas) {
  const nuevas = new Set(palabrasClave(`${titulo} ${descripcion}`));
  const similares = propuestas
    .map((p) => {
      const otras = new Set(palabrasClave(`${p.titulo} ${p.descripcion || ''}`));
      const comunes = [...nuevas].filter((x) => otras.has(x));
      return { id: Number(p.id), comunes };
    })
    .filter((p) => p.comunes.length >= 2)
    .sort((a, b) => b.comunes.length - a.comunes.length)
    .slice(0, 3)
    .map((p) => ({ id: p.id, motivo: `Comparten: ${p.comunes.slice(0, 3).join(', ')}` }));
  return { similares, modo: 'demo' };
}

// ---------- reporte para el coordinador ----------

async function generarReporte(desde, hasta, propuestas = []) {
  if (!hayGemini()) {
    return reporteDemo(desde, hasta, propuestas);
  }

  const lista = propuestas
    .map((p) => `- ${p.titulo} | ${p.categoria} | estado ${p.estado} | ${p.votos} votos | ${p.comentarios || 0} comentarios`)
    .join('\n');
  const prompt = `Eres asistente de la coordinacion academica. Escribe un reporte ejecutivo corto en español
sobre las propuestas de actividades academicas del ${desde} al ${hasta}.
Incluye: resumen general, las propuestas mas votadas, tendencias por categoria y 2 o 3 recomendaciones.
Responde SOLO un JSON: {"reporte": "texto del reporte, puedes usar saltos de linea"}

Propuestas:
${lista || '(no hay propuestas en el periodo)'}`;

  const r = await preguntar(prompt);
  return { reporte: r.reporte || '', modo: 'gemini' };
}

function reporteDemo(desde, hasta, propuestas) {
  const porCategoria = {};
  propuestas.forEach((p) => { porCategoria[p.categoria] = (porCategoria[p.categoria] || 0) + 1; });
  const top = [...propuestas].sort((a, b) => b.votos - a.votos).slice(0, 3);

  let reporte = `Reporte del ${desde} al ${hasta}\n\n`;
  reporte += `Total de propuestas: ${propuestas.length}\n\n`;
  reporte += 'Mas votadas:\n';
  top.forEach((p) => { reporte += `- ${p.titulo} (${p.votos} votos)\n`; });
  reporte += '\nPor categoria:\n';
  Object.entries(porCategoria).forEach(([c, n]) => { reporte += `- ${c}: ${n}\n`; });
  return { reporte, modo: 'demo' };
}

module.exports = { analizarPropuesta, buscarSimilares, generarReporte };
