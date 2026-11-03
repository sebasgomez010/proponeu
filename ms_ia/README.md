# ms_ia — Microservicio Node.js

Se implementa en la **Entrega 3**. Responsabilidades (ver SRS, sección 7):

- API REST en `/api/v1` protegida con API Key (`MS_API_KEY`).
- Servicio IA: resumen, categoría sugerida, etiquetas, sugerencias de redacción, propuestas similares y reportes ejecutivos (Google Gemini).
- Servicio de notificaciones por correo (SMTP).
- Documentación Swagger UI pública en `/api/docs`.

Endpoints planeados:

| Método | Ruta | Requisito |
| --- | --- | --- |
| POST | `/api/v1/propuestas/analizar` | RF10 |
| POST | `/api/v1/propuestas/similares` | RF11 |
| POST | `/api/v1/reportes` | RF14 |
| POST | `/api/v1/notificaciones` | RF13 |
| GET | `/api/v1/health` | RNF05 |
| GET | `/api/docs` | RF18 |
