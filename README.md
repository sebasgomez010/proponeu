# ProponeU

Plataforma web para proponer actividades académicas (talleres, charlas, semilleros, hackatones...) en Uninpahu. La comunidad vota y comenta las propuestas y el coordinador las aprueba o las rechaza. Con IA se resumen las propuestas, se buscan propuestas parecidas y se generan reportes.

Proyecto Integrador ExpoUninpahu 2026 - Ingeniería de Software
Docente: Elfar Didier Morantes Sánchez

**Integrantes**
- Juan Sebastián Gómez Tovar
- Sergio Andrés Gutiérrez Marín

## Tecnologías

- Django 6 (Python 3.13)
- Node.js 20 + Express (microservicio `ms_ia`)
- Google Gemini (IA generativa)
- Swagger / OpenAPI
- PostgreSQL (en local se usa SQLite)
- Bootstrap 5
- Docker y Docker Compose
- Render para el despliegue

## Estructura

```
django_app/        proyecto django
  proponeu/        settings y urls
  usuarios/        registro, login y roles
  propuestas/      crud de propuestas y categorias
  participacion/   votos y comentarios
  revision/        aprobar / rechazar propuestas
  reportes/        reporte con ia para el coordinador
  integraciones/   cliente que llama al microservicio
ms_ia/             microservicio node (ia, correos y swagger)
docs/              srs, backlog y diagramas uml
docker-compose.yml levanta todo junto
render.yaml        configuracion de render
```

## Cómo correrlo

### Todo junto con Docker Compose

```bash
docker compose up --build
```

- Django: http://localhost:8000
- Swagger del microservicio: http://localhost:3000/api/docs

Las claves se ponen en un archivo `.env` en la raíz (copiar `.env.example`). Sin `GEMINI_API_KEY` la IA funciona en modo demo.

### Sin Docker

Microservicio:

```bash
cd ms_ia
npm install
npm run dev
```

Django (en otra terminal):

```bash
python -m venv venv
venv\Scripts\activate
pip install -r django_app/requirements.txt
cd django_app
python manage.py migrate
python manage.py cargar_demo
python manage.py runserver
```

`cargar_demo` crea usuarios de prueba (admin, coordinador, docente y estudiantes) y unas propuestas de ejemplo.

### Pruebas

```bash
cd django_app
python manage.py test
```

```bash
cd ms_ia
npm test
```

## Despliegue

Se despliega en Render con el archivo `render.yaml`: Django, el microservicio y la base de datos PostgreSQL.

- App: _pendiente_
- Swagger: _pendiente_
URL: aún pendiente

## Documentación

- [SRS (PDF)](docs/SRS_ProponeU.pdf)
- [Backlog](docs/backlog.md)
- [Diagramas UML](docs/uml)
- [Microservicio ms_ia](ms_ia/README.md)
