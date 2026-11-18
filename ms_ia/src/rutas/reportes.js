const express = require('express');
const { generarReporte } = require('../servicios/analisis');

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { desde, hasta, propuestas } = req.body || {};
  if (!desde || !hasta) {
    return res.status(400).json({ error: 'desde y hasta son obligatorios' });
  }
  try {
    const resultado = await generarReporte(desde, hasta, Array.isArray(propuestas) ? propuestas : []);
    res.json(resultado);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
