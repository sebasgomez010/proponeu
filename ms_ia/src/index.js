require('dotenv').config({ quiet: true });

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`ms_ia corriendo en el puerto ${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/api/docs`);
  if (!process.env.GEMINI_API_KEY) {
    console.log('OJO: no hay GEMINI_API_KEY, la IA funciona en modo demo');
  }
});
