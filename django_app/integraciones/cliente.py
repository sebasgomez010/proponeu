import logging

import requests
from django.conf import settings

logger = logging.getLogger(__name__)


def _post(ruta, datos):
    # llama al microservicio, si falla devuelve None para que django siga funcionando
    try:
        respuesta = requests.post(
            f'{settings.MS_IA_URL}{ruta}',
            json=datos,
            headers={'x-api-key': settings.MS_API_KEY},
            timeout=settings.MS_IA_TIMEOUT,
        )
        respuesta.raise_for_status()
        return respuesta.json()
    except (requests.RequestException, ValueError) as error:
        logger.warning('Error llamando a ms_ia %s: %s', ruta, error)
        return None


def analizar_propuesta(titulo, descripcion, categorias):
    return _post('/propuestas/analizar', {
        'titulo': titulo,
        'descripcion': descripcion,
        'categorias': categorias,
    })


def buscar_similares(titulo, descripcion, propuestas):
    datos = _post('/propuestas/similares', {
        'titulo': titulo,
        'descripcion': descripcion,
        'propuestas': [{'id': p.id, 'titulo': p.titulo, 'descripcion': p.descripcion} for p in propuestas],
    })
    if datos is None:
        return None
    return datos.get('similares', [])


def generar_reporte(desde, hasta, propuestas):
    datos = _post('/reportes', {'desde': str(desde), 'hasta': str(hasta), 'propuestas': propuestas})
    if datos is None:
        return None
    return datos.get('reporte', '')


def enviar_notificacion(para, asunto, mensaje):
    datos = _post('/notificaciones', {'para': para, 'asunto': asunto, 'mensaje': mensaje})
    return bool(datos and datos.get('enviado'))
