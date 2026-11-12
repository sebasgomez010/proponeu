import os

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from participacion.models import Comentario, Voto
from propuestas.models import Categoria, Propuesta
from usuarios.models import Usuario

# clave para pruebas en local, en render se usa DEMO_PASSWORD
CLAVE_DEMO = 'Proponeu.Demo2026'

USUARIOS = [
    ('admin@proponeu.co', 'Admin', 'ProponeU', Usuario.Rol.ADMINISTRADOR),
    ('coordinador@proponeu.co', 'Carolina', 'Méndez', Usuario.Rol.COORDINADOR),
    ('docente@proponeu.co', 'Andrés', 'Salazar', Usuario.Rol.DOCENTE),
    ('estudiante@proponeu.co', 'Laura', 'Gómez', Usuario.Rol.ESTUDIANTE),
    ('estudiante2@proponeu.co', 'Mateo', 'Ríos', Usuario.Rol.ESTUDIANTE),
]

PROPUESTAS = [
    ('Taller de Git y GitHub para principiantes', 'Taller', 'estudiante@proponeu.co',
     'Sesión práctica de dos horas para aprender a usar Git, ramas, pull requests y GitHub en proyectos de clase.',
     'Que los estudiantes de primeros semestres trabajen en equipo con control de versiones.'),
    ('Hackatón de soluciones con inteligencia artificial', 'Hackatón', 'docente@proponeu.co',
     'Competencia de 24 horas en la que equipos mixtos desarrollan prototipos que usen IA para resolver problemas de la universidad.',
     'Fomentar la innovación y el trabajo interdisciplinario.'),
    ('Semillero de ciencia de datos', 'Semillero de investigación', 'estudiante2@proponeu.co',
     'Grupo semanal para estudiar análisis de datos con Python y participar en proyectos de investigación.',
     'Formar estudiantes en investigación aplicada con datos abiertos.'),
    ('Charla: experiencias de egresados en la industria', 'Charla', 'estudiante@proponeu.co',
     'Conversatorio con egresados que trabajan en empresas de software para contar cómo fue su paso al mundo laboral.',
     ''),
]


class Command(BaseCommand):
    help = 'Carga usuarios y propuestas de demostración'

    def handle(self, *args, **options):
        clave = os.environ.get('DEMO_PASSWORD') or (CLAVE_DEMO if settings.DEBUG else None)
        if not clave:
            raise CommandError('Define la variable de entorno DEMO_PASSWORD para cargar los datos en producción.')

        usuarios = {}
        for email, nombre, apellido, rol in USUARIOS:
            usuario, creado = Usuario.objects.get_or_create(
                email=email,
                defaults={'first_name': nombre, 'last_name': apellido, 'rol': rol,
                          'programa': 'Ingeniería de Software',
                          'is_staff': rol == Usuario.Rol.ADMINISTRADOR,
                          'is_superuser': rol == Usuario.Rol.ADMINISTRADOR},
            )
            if creado:
                usuario.set_password(clave)
                usuario.save()
            usuarios[email] = usuario

        for titulo, categoria, autor, descripcion, objetivo in PROPUESTAS:
            Propuesta.objects.get_or_create(
                titulo=titulo,
                defaults={'categoria': Categoria.objects.get(nombre=categoria), 'autor': usuarios[autor],
                          'descripcion': descripcion, 'objetivo': objetivo,
                          'estado': Propuesta.Estado.PUBLICADA},
            )

        taller = Propuesta.objects.get(titulo__startswith='Taller de Git')
        for email, valor in [('estudiante2@proponeu.co', 1), ('docente@proponeu.co', 1)]:
            Voto.objects.get_or_create(propuesta=taller, usuario=usuarios[email], defaults={'valor': valor})
        Comentario.objects.get_or_create(
            propuesta=taller, autor=usuarios['estudiante2@proponeu.co'],
            defaults={'texto': '¡Me apunto! Sería ideal hacerlo antes de los proyectos finales.'},
        )

        self.stdout.write(self.style.SUCCESS(
            f'Datos de demostración cargados. Usuarios: {", ".join(u[0] for u in USUARIOS)}'
        ))
