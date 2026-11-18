const express = require('express');
const { analizarPropuesta, buscarSimilares } = require('../servicios/analisis');

const router = express.Router();

router.post('/analizar', async (req, res, next) => {
  const { titulo, descripcion, categorias } = req.body || {};
  if (!titulo || !descripcion) {
    return res.status(400).json({ error: 'titulo y descripcion son obligatorios' });
  }
  try {
    const resultado = await analizarPropuesta(titulo, descripcion, Array.isArray(categorias) ? categorias : []);
    res.json(resultado);
  } catch (err) {
    next(err);
  }
});

router.post('/similares', async (req, res, next) => {
  const { titulo, descripcion, propuestas } = req.body || {};
  if (!titulo || !descripcion) {
    return res.status(400).json({ error: 'titulo y descripcion son obligatorios' });
  }
  try {
    const resultado = await buscarSimilares(titulo, descripcion, Array.isArray(propuestas) ? propuestas : []);
    res.json(resultado);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
