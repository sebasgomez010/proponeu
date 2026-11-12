from django.test import TestCase
from django.urls import reverse

from usuarios.models import Usuario

from .models import Categoria, Propuesta


class PropuestaBaseTest(TestCase):
    def setUp(self):
        self.autor = Usuario.objects.create_user('autor@u.co', 'clave', first_name='Luis', last_name='Rojas')
        self.otro = Usuario.objects.create_user('otro@u.co', 'clave', first_name='Eva', last_name='Díaz')
        self.categoria = Categoria.objects.get(nombre='Taller')

    def crear(self, **extra):
        datos = {'titulo': 'Taller de Git', 'descripcion': 'Aprender Git Flow', 'categoria': self.categoria,
                 'autor': self.autor, 'estado': Propuesta.Estado.PUBLICADA}
        datos.update(extra)
        return Propuesta.objects.create(**datos)


class CrudTests(PropuestaBaseTest):
    def formulario(self, **extra):
        datos = {'titulo': 'Hackatón de IA', 'categoria': self.categoria.pk, 'descripcion': 'Un fin de semana programando',
                 'modalidad': 'PRESENCIAL'}
        datos.update(extra)
        return datos

    def test_crear_requiere_login(self):
        respuesta = self.client.get(reverse('propuestas:crear'))
        self.assertRedirects(respuesta, f"{reverse('login')}?next={reverse('propuestas:crear')}")

    def test_crear_y_publicar(self):
        self.client.force_login(self.autor)
        respuesta = self.client.post(reverse('propuestas:crear'), self.formulario(publicar=''))
        propuesta = Propuesta.objects.get()
        self.assertRedirects(respuesta, propuesta.get_absolute_url())
        self.assertEqual(propuesta.autor, self.autor)
        self.assertEqual(propuesta.estado, Propuesta.Estado.PUBLICADA)

    def test_guardar_como_borrador(self):
        self.client.force_login(self.autor)
        self.client.post(reverse('propuestas:crear'), self.formulario(borrador=''))
        self.assertEqual(Propuesta.objects.get().estado, Propuesta.Estado.BORRADOR)

    def test_titulo_obligatorio(self):
        self.client.force_login(self.autor)
        self.client.post(reverse('propuestas:crear'), self.formulario(titulo=''))
        self.assertFalse(Propuesta.objects.exists())

    def test_editar_propia(self):
        propuesta = self.crear()
        self.client.force_login(self.autor)
        self.client.post(reverse('propuestas:editar', args=[propuesta.pk]), self.formulario(titulo='Nuevo título', publicar=''))
        propuesta.refresh_from_db()
        self.assertEqual(propuesta.titulo, 'Nuevo título')

    def test_no_editar_ajena(self):
        propuesta = self.crear()
        self.client.force_login(self.otro)
        respuesta = self.client.get(reverse('propuestas:editar', args=[propuesta.pk]))
        self.assertEqual(respuesta.status_code, 403)

    def test_no_editar_aprobada(self):
        propuesta = self.crear(estado=Propuesta.Estado.APROBADA)
        self.client.force_login(self.autor)
        respuesta = self.client.get(reverse('propuestas:editar', args=[propuesta.pk]))
        self.assertEqual(respuesta.status_code, 403)

    def test_eliminar_propia(self):
        propuesta = self.crear()
        self.client.force_login(self.autor)
        self.client.post(reverse('propuestas:eliminar', args=[propuesta.pk]))
        self.assertFalse(Propuesta.objects.exists())


class ConsultaTests(PropuestaBaseTest):
    def test_lista_publica_sin_borradores(self):
        self.crear(titulo='Publicada')
        self.crear(titulo='Secreta', estado=Propuesta.Estado.BORRADOR)
        respuesta = self.client.get(reverse('propuestas:lista'))
        self.assertContains(respuesta, 'Publicada')
        self.assertNotContains(respuesta, 'Secreta')

    def test_busqueda_y_filtros(self):
        self.crear(titulo='Taller de Docker')
        self.crear(titulo='Charla de ética', categoria=Categoria.objects.get(nombre='Charla'))
        respuesta = self.client.get(reverse('propuestas:lista'), {'q': 'docker'})
        self.assertContains(respuesta, 'Taller de Docker')
        self.assertNotContains(respuesta, 'Charla de ética')
        respuesta = self.client.get(reverse('propuestas:lista'), {'categoria': Categoria.objects.get(nombre='Charla').pk})
        self.assertContains(respuesta, 'Charla de ética')
        self.assertNotContains(respuesta, 'Taller de Docker')

    def test_borrador_solo_lo_ve_el_autor(self):
        propuesta = self.crear(estado=Propuesta.Estado.BORRADOR)
        self.client.force_login(self.otro)
        self.assertEqual(self.client.get(propuesta.get_absolute_url()).status_code, 404)
        self.client.force_login(self.autor)
        self.assertEqual(self.client.get(propuesta.get_absolute_url()).status_code, 200)

    def test_categorias_iniciales(self):
        self.assertEqual(Categoria.objects.count(), 6)
