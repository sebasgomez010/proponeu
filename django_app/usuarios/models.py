from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UsuarioManager(BaseUserManager):
    # para que el login sea con el correo y no con username
    use_in_migrations = True

    def _crear(self, email, password, **extra):
        if not email:
            raise ValueError('El correo es obligatorio')
        usuario = self.model(email=self.normalize_email(email), **extra)
        usuario.set_password(password)
        usuario.save(using=self._db)
        return usuario

    def create_user(self, email, password=None, **extra):
        extra.setdefault('is_staff', False)
        extra.setdefault('is_superuser', False)
        return self._crear(email, password, **extra)

    def create_superuser(self, email, password=None, **extra):
        extra.setdefault('is_staff', True)
        extra.setdefault('is_superuser', True)
        extra.setdefault('rol', Usuario.Rol.ADMINISTRADOR)
        return self._crear(email, password, **extra)


class Usuario(AbstractUser):
    class Rol(models.TextChoices):
        ESTUDIANTE = 'ESTUDIANTE', 'Estudiante'
        DOCENTE = 'DOCENTE', 'Docente'
        COORDINADOR = 'COORDINADOR', 'Coordinador académico'
        ADMINISTRADOR = 'ADMINISTRADOR', 'Administrador'

    username = None
    email = models.EmailField('correo electrónico', unique=True)
    rol = models.CharField(max_length=20, choices=Rol.choices, default=Rol.ESTUDIANTE)
    programa = models.CharField('programa académico', max_length=120, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = UsuarioManager()

    class Meta:
        verbose_name = 'usuario'
        verbose_name_plural = 'usuarios'

    def __str__(self):
        return self.get_full_name() or self.email

    @property
    def es_coordinador(self):
        return self.rol in (self.Rol.COORDINADOR, self.Rol.ADMINISTRADOR) or self.is_superuser

    @property
    def es_administrador(self):
        return self.rol == self.Rol.ADMINISTRADOR or self.is_superuser
