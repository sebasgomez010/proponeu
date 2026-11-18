from unittest.mock import MagicMock, patch

import requests
from django.test import SimpleTestCase, override_settings

from . import cliente


@override_settings(MS_IA_URL='http://ms:3000/api/v1', MS_API_KEY='clave', MS_IA_TIMEOUT=5)
class ClienteTests(SimpleTestCase):
    @patch('integraciones.cliente.requests.post')
    def test_analizar_manda_api_key_y_devuelve_json(self, post):
        post.return_value = MagicMock(status_code=200)
        post.return_value.json.return_value = {'resumen': 'ok', 'etiquetas': []}

        datos = cliente.analizar_propuesta('Titulo', 'Descripcion', ['Taller'])

        self.assertEqual(datos['resumen'], 'ok')
        url = post.call_args.args[0]
        self.assertEqual(url, 'http://ms:3000/api/v1/propuestas/analizar')
        self.assertEqual(post.call_args.kwargs['headers'], {'x-api-key': 'clave'})
        self.assertEqual(post.call_args.kwargs['json']['categorias'], ['Taller'])

    @patch('integraciones.cliente.requests.post', side_effect=requests.ConnectionError('apagado'))
    def test_si_el_microservicio_falla_devuelve_none(self, post):
        self.assertIsNone(cliente.analizar_propuesta('T', 'D', []))
        self.assertIsNone(cliente.generar_reporte('2026-11-01', '2026-11-30', []))
        self.assertFalse(cliente.enviar_notificacion('a@b.co', 'x', 'y'))

    @patch('integraciones.cliente.requests.post')
    def test_error_http_devuelve_none(self, post):
        post.return_value = MagicMock()
        post.return_value.raise_for_status.side_effect = requests.HTTPError('401')
        self.assertIsNone(cliente.buscar_similares('T', 'D', []))
