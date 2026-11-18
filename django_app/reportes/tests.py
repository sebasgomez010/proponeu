from unittest.mock import patch

from django.test import TestCase
from django.urls import reverse

from propuestas.models import Categoria, Propuesta
from usuarios.models import Usuario


class ReporteTests(TestCase):
    def setUp(self):
        self.estudiante = Usuario.objects.create_user('e@u.co', 'clave')
        self.coordinador = Usuario.objects.create_user('c@u.co', 'clave', rol=Usuario.Rol.COORDINADOR)
        Propuesta.objects.create(
            titulo='Hackatón de IA', descripcion='24 horas programando', autor=self.estudiante,
            categoria=Categoria.objects.get(nombre='Hackatón'), estado=Propuesta.Estado.PUBLICADA,
        )

    def test_solo_coordinador(self):
        self.client.force_login(self.estudiante)
        self.assertEqual(self.client.get(reverse('reportes:reporte')).status_code, 403)

    @patch('integraciones.cliente.generar_reporte', return_value='Reporte de prueba')
    def test_genera_reporte_con_las_propuestas(self, generar):
        self.client.force_login(self.coordinador)
        respuesta = self.client.post(reverse('reportes:reporte'), {'desde': '2020-01-01', 'hasta': '2099-12-31'})
        self.assertContains(respuesta, 'Reporte de prueba')
        propuestas = generar.call_args.args[2]
        self.assertEqual(propuestas[0]['titulo'], 'Hackatón de IA')
        self.assertEqual(propuestas[0]['categoria'], 'Hackatón')

    @patch('integraciones.cliente.generar_reporte', return_value=None)
    def test_aviso_si_la_ia_no_responde(self, generar):
        self.client.force_login(self.coordinador)
        respuesta = self.client.post(reverse('reportes:reporte'), {'desde': '2020-01-01', 'hasta': '2099-12-31'})
        self.assertContains(respuesta, 'no está disponible')
