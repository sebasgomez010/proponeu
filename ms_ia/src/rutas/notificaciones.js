const express = require('express');
const { enviarCorreo } = require('../servicios/correo');

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { para, asunto, mensaje } = req.body || {};
  if (!para || !asunto || !mensaje) {
    return res.status(400).json({ error: 'para, asunto y mensaje son obligatorios' });
  }
  try {
    const resultado = await enviarCorreo(para, asunto, mensaje);
    res.json(resultado);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
