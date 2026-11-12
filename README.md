# ProponeU

Plataforma web para proponer actividades académicas (talleres, charlas, semilleros, hackatones...) en Uninpahu. La comunidad vota y comenta las propuestas y el coordinador las aprueba o las rechaza.

Proyecto Integrador ExpoUninpahu 2026 - Ingeniería de Software
Docente: Elfar Didier Morantes Sánchez

**Integrantes**
- Juan Sebastián Gómez Tovar
- Sergio Andrés Gutiérrez Marín

## Tecnologías

- Django 6 (Python 3.13)
- PostgreSQL (en local se usa SQLite)
- Bootstrap 5
- Docker
- Render para el despliegue
- Node.js + IA generativa (Gemini) para el microservicio (entrega 3)

## Estructura

```
django_app/      proyecto django
  proponeu/      settings y urls
  usuarios/      registro, login y roles
  propuestas/    crud de propuestas y categorias
  participacion/ votos y comentarios
  revision/      aprobar / rechazar propuestas
  reportes/      (entrega 3)
  integraciones/ (entrega 3)
ms_ia/           microservicio node (entrega 3)
docs/            srs, backlog y diagramas uml
render.yaml      configuracion de render
```

## Cómo correrlo

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

Para correr las pruebas:

```bash
python manage.py test
```

Con Docker:

```bash
cd django_app
docker build -t proponeu-web .
docker run -p 8000:8000 -e DEBUG=False -e USAR_HTTPS=False -e DJANGO_SECRET_KEY=clave-local -e CARGAR_DEMO=True -e DEMO_PASSWORD=clave-demo proponeu-web
```

## Despliegue

Se despliega en Render con el archivo `render.yaml` (servicio web con Docker + base de datos PostgreSQL).

URL: _pendiente_

## Documentación

- [SRS (PDF)](docs/SRS_ProponeU.pdf)
- [Backlog](docs/backlog.md)
- [Diagramas UML](docs/uml)
