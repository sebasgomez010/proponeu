# ms_ia

Microservicio de ProponeU hecho en Node.js con Express. Django lo llama para:

- analizar una propuesta con IA (resumen, categoría sugerida, etiquetas y sugerencias)
- buscar propuestas parecidas
- generar el reporte para el coordinador
- enviar el correo cuando cambia el estado de una propuesta

La IA es Google Gemini. Si no se pone `GEMINI_API_KEY` funciona en modo demo (sin IA real) para poder probar.

## Endpoints

| Método | Ruta | Para qué |
| --- | --- | --- |
| GET | `/api/v1/health` | ver si está arriba |
| POST | `/api/v1/propuestas/analizar` | análisis con IA |
| POST | `/api/v1/propuestas/similares` | propuestas parecidas |
| POST | `/api/v1/reportes` | reporte ejecutivo |
| POST | `/api/v1/notificaciones` | enviar correo |

La documentación está en `/api/docs` (Swagger). Los POST piden el header `x-api-key`.

## Correrlo

```bash
cd ms_ia
npm install
npm run dev
```

Variables (se pueden poner en un archivo `.env` dentro de `ms_ia`):

```
PORT=3000
MS_API_KEY=la-misma-que-en-django
GEMINI_API_KEY=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
```

Pruebas:

```bash
npm test
```
