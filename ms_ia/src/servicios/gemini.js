// conexion con la api de google gemini
const MODELO = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent`;

function hayGemini() {
  return Boolean(process.env.GEMINI_API_KEY);
}

// le manda el prompt a gemini y devuelve la respuesta ya convertida a objeto
async function preguntar(prompt) {
  const respuesta = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.4 },
    }),
    signal: AbortSignal.timeout(20000),
  });

  if (!respuesta.ok) {
    const texto = await respuesta.text();
    throw new Error(`Gemini respondio ${respuesta.status}: ${texto.slice(0, 200)}`);
  }

  const datos = await respuesta.json();
  const partes = datos.candidates?.[0]?.content?.parts || [];
  const texto = partes.map((p) => p.text || '').join('');
  return JSON.parse(texto);
}

module.exports = { hayGemini, preguntar, MODELO };
