from unittest.mock import patch

from django.test import TestCase
from django.urls import reverse

from propuestas.models import Categoria, Propuesta
from usuarios.models import Usuario

from .models import HistorialEstado


class RevisionTests(TestCase):
    def setUp(self):
        simulado = patch('integraciones.cliente.enviar_notificacion', return_value=True)
        self.notificar = simulado.start()
        self.addCleanup(simulado.stop)
        self.estudiante = Usuario.objects.create_user('e@u.co', 'clave')
        self.coordinador = Usuario.objects.create_user('c@u.co', 'clave', rol=Usuario.Rol.COORDINADOR)
        self.propuesta = Propuesta.objects.create(
            titulo='Semillero de datos', descripcion='Análisis de datos', autor=self.estudiante,
            categoria=Categoria.objects.first(), estado=Propuesta.Estado.PUBLICADA,
        )
        self.url = reverse('revision:cambiar_estado', args=[self.propuesta.pk])

    def test_bandeja_solo_para_coordinador(self):
        self.client.force_login(self.estudiante)
        self.assertEqual(self.client.get(reverse('revision:bandeja')).status_code, 403)
        self.client.force_login(self.coordinador)
        self.assertContains(self.client.get(reverse('revision:bandeja')), 'Semillero de datos')

    def test_aprobar_registra_historial(self):
        self.client.force_login(self.coordinador)
        self.client.post(self.url, {'estado': 'APROBADA', 'observacion': 'Excelente idea'})
        self.propuesta.refresh_from_db()
        self.assertEqual(self.propuesta.estado, Propuesta.Estado.APROBADA)
        historial = HistorialEstado.objects.get()
        self.assertEqual(historial.estado_anterior, Propuesta.Estado.PUBLICADA)
        self.assertEqual(historial.usuario, self.coordinador)

    def test_rechazar_exige_observacion(self):
        self.client.force_login(self.coordinador)
        self.client.post(self.url, {'estado': 'RECHAZADA', 'observacion': ''})
        self.propuesta.refresh_from_db()
        self.assertEqual(self.propuesta.estado, Propuesta.Estado.PUBLICADA)
        self.assertFalse(HistorialEstado.objects.exists())

    def test_estudiante_no_puede_cambiar_estado(self):
        self.client.force_login(self.estudiante)
        respuesta = self.client.post(self.url, {'estado': 'APROBADA'})
        self.assertEqual(respuesta.status_code, 403)

    def test_al_cambiar_estado_se_notifica_al_autor(self):
        self.client.force_login(self.coordinador)
        self.client.post(self.url, {'estado': 'APROBADA', 'observacion': 'Muy buena'})
        para, asunto, mensaje = self.notificar.call_args.args
        self.assertEqual(para, 'e@u.co')
        self.assertIn('Aprobada', mensaje)
        self.assertIn('Muy buena', mensaje)
