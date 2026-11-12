from django.test import TestCase
from django.urls import reverse

from .models import Usuario


class RegistroTests(TestCase):
    def datos(self, **cambios):
        datos = {
            'first_name': 'Ana', 'last_name': 'Pérez', 'email': 'ana@uninpahu.edu.co',
            'programa': 'Ingeniería de Software', 'rol': 'ESTUDIANTE',
            'password1': 'ClaveSegura.2026', 'password2': 'ClaveSegura.2026',
        }
        datos.update(cambios)
        return datos

    def test_registro_crea_usuario_y_inicia_sesion(self):
        respuesta = self.client.post(reverse('usuarios:registro'), self.datos())
        self.assertRedirects(respuesta, reverse('propuestas:lista'))
        usuario = Usuario.objects.get(email='ana@uninpahu.edu.co')
        self.assertEqual(usuario.rol, Usuario.Rol.ESTUDIANTE)
        self.assertEqual(int(self.client.session['_auth_user_id']), usuario.pk)

    def test_no_permite_correo_repetido(self):
        Usuario.objects.create_user('ana@uninpahu.edu.co', 'x', first_name='A', last_name='B')
        respuesta = self.client.post(reverse('usuarios:registro'), self.datos())
        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(Usuario.objects.count(), 1)

    def test_no_permite_registrarse_como_coordinador(self):
        self.client.post(reverse('usuarios:registro'), self.datos(rol='COORDINADOR'))
        self.assertFalse(Usuario.objects.exists())


class LoginTests(TestCase):
    def setUp(self):
        Usuario.objects.create_user('ana@uninpahu.edu.co', 'ClaveSegura.2026', first_name='Ana', last_name='Pérez')

    def test_login_con_correo(self):
        respuesta = self.client.post(reverse('login'), {'username': 'ana@uninpahu.edu.co', 'password': 'ClaveSegura.2026'})
        self.assertRedirects(respuesta, reverse('propuestas:lista'))

    def test_login_con_clave_incorrecta(self):
        respuesta = self.client.post(reverse('login'), {'username': 'ana@uninpahu.edu.co', 'password': 'otra'})
        self.assertEqual(respuesta.status_code, 200)
        self.assertNotIn('_auth_user_id', self.client.session)

    def test_logout(self):
        self.client.login(email='ana@uninpahu.edu.co', password='ClaveSegura.2026')
        self.client.post(reverse('logout'))
        self.assertNotIn('_auth_user_id', self.client.session)


class RolesTests(TestCase):
    def test_roles(self):
        estudiante = Usuario.objects.create_user('e@u.co', 'x', rol=Usuario.Rol.ESTUDIANTE)
        coordinador = Usuario.objects.create_user('c@u.co', 'x', rol=Usuario.Rol.COORDINADOR)
        admin = Usuario.objects.create_superuser('a@u.co', 'x')
        self.assertFalse(estudiante.es_coordinador)
        self.assertTrue(coordinador.es_coordinador)
        self.assertFalse(coordinador.es_administrador)
        self.assertTrue(admin.es_administrador)
        self.assertEqual(admin.rol, Usuario.Rol.ADMINISTRADOR)
