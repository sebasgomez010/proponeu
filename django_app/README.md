 <!-- Reto Django - Propuestas Universitarias -->

Sebastian Gomez

App para registrar propuestas de actividades académicas y votar si interesan o no.
La hice dentro de mi proyecto de clase, en la app `propuestas`.

<!-- Cómo ejecutarlo -->

1. Crear y activar el entorno virtual:
   python -m venv venv
   venv\Scripts\activate

2. Instalar lo necesario:
   pip install -r requirements.txt

3. Crear las tablas:
   python manage.py migrate

4. Crear un usuario para el admin:
   python manage.py createsuperuser

5. Correr el servidor:
   python manage.py runserver

<!-- Rutas -->

- /propuestas/  -> lista de propuestas
- /propuestas/<id>/  -> detalle y votación
- /propuestas/<id>/votar/  -> registra el voto (POST)
- /propuestas/<id>/resultados/  -> resultados
- /admin/  -> crear propuestas y opciones