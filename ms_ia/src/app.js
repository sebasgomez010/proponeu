const fs = require('fs');
const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');

const validarApiKey = require('./middleware/apiKey');
const rutasPropuestas = require('./rutas/propuestas');
const rutasReportes = require('./rutas/reportes');
const rutasNotificaciones = require('./rutas/notificaciones');

const app = express();
app.use(express.json());

// documentacion swagger (publica)
const swaggerDoc = YAML.parse(fs.readFileSync(path.join(__dirname, '..', 'swagger.yaml'), 'utf8'));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, { customSiteTitle: 'ProponeU - ms_ia' }));
app.get('/api/docs.json', (req, res) => res.json(swaggerDoc));

app.get('/', (req, res) => res.redirect('/api/docs'));

app.get('/api/v1/health', (req, res) => {
  res.json({ estado: 'ok', ia: process.env.GEMINI_API_KEY ? 'gemini' : 'demo' });
});

// de aqui para abajo se necesita la api key
app.use('/api/v1', validarApiKey);
app.use('/api/v1/propuestas', rutasPropuestas);
app.use('/api/v1/reportes', rutasReportes);
app.use('/api/v1/notificaciones', rutasNotificaciones);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// si algo falla (por ejemplo gemini no responde)
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(502).json({ error: 'No se pudo procesar la solicitud', detalle: err.message });
});

module.exports = app;
