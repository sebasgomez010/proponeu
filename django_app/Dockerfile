FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=8000

WORKDIR /app

COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .

RUN DJANGO_SECRET_KEY=build DEBUG=False python manage.py collectstatic --noinput

RUN useradd --create-home proponeu && chown -R proponeu /app
USER proponeu

EXPOSE 8000

# migraciones, datos de prueba (opcional) y gunicorn
CMD ["sh", "-c", "python manage.py migrate --noinput && if [ \"$CARGAR_DEMO\" = \"True\" ]; then python manage.py cargar_demo; fi && gunicorn proponeu.wsgi:application --bind 0.0.0.0:${PORT} --workers 2"]
