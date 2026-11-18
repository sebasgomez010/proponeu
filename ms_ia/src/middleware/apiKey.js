// revisa que django mande la api key en el header x-api-key
function validarApiKey(req, res, next) {
  const clave = process.env.MS_API_KEY;

  // si no hay clave configurada no se valida (solo para desarrollo)
  if (!clave) {
    return next();
  }

  if (req.get('x-api-key') !== clave) {
    return res.status(401).json({ error: 'API key invalida o faltante' });
  }
  next();
}

module.exports = validarApiKey;
