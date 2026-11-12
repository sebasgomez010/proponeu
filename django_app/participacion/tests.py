from django.test import TestCase
from django.urls import reverse

from propuestas.models import Categoria, Propuesta
from usuarios.models import Usuario

from .models import Comentario, Voto


class ParticipacionTests(TestCase):
    def setUp(self):
        self.autor = Usuario.objects.create_user('autor@u.co', 'clave')
        self.votante = Usuario.objects.create_user('votante@u.co', 'clave')
        self.propuesta = Propuesta.objects.create(
            titulo='Club de Python', descripcion='Estudiar Python', autor=self.autor,
            categoria=Categoria.objects.first(), estado=Propuesta.Estado.PUBLICADA,
        )
        self.url_votar = reverse('participacion:votar', args=[self.propuesta.pk])

    def test_votar_y_cambiar_voto(self):
        self.client.force_login(self.votante)
        self.client.post(self.url_votar, {'valor': '1'})
        self.assertEqual(self.propuesta.puntaje, 1)
        self.client.post(self.url_votar, {'valor': '-1'})
        self.assertEqual(Voto.objects.count(), 1)
        self.assertEqual(self.propuesta.puntaje, -1)

    def test_no_votar_propia(self):
        self.client.force_login(self.autor)
        self.client.post(self.url_votar, {'valor': '1'})
        self.assertFalse(Voto.objects.exists())

    def test_no_votar_si_no_esta_publicada(self):
        self.propuesta.estado = Propuesta.Estado.APROBADA
        self.propuesta.save()
        self.client.force_login(self.votante)
        self.client.post(self.url_votar, {'valor': '1'})
        self.assertFalse(Voto.objects.exists())

    def test_votar_requiere_login(self):
        self.client.post(self.url_votar, {'valor': '1'})
        self.assertFalse(Voto.objects.exists())

    def test_comentar(self):
        self.client.force_login(self.votante)
        self.client.post(reverse('participacion:comentar', args=[self.propuesta.pk]), {'texto': '¡Me interesa!'})
        self.assertEqual(Comentario.objects.get().autor, self.votante)

    def test_comentario_vacio(self):
        self.client.force_login(self.votante)
        self.client.post(reverse('participacion:comentar', args=[self.propuesta.pk]), {'texto': ''})
        self.assertFalse(Comentario.objects.exists())
