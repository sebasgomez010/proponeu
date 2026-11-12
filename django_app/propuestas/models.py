from django.conf import settings
from django.db import models
from django.db.models import Sum
from django.urls import reverse


class Categoria(models.Model):
    nombre = models.CharField(max_length=80, unique=True)
    descripcion = models.CharField(max_length=200, blank=True)

    class Meta:
        verbose_name = 'categoría'
        verbose_name_plural = 'categorías'
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class Propuesta(models.Model):
    class Estado(models.TextChoices):
        BORRADOR = 'BORRADOR', 'Borrador'
        PUBLICADA = 'PUBLICADA', 'Publicada'
        EN_REVISION = 'EN_REVISION', 'En revisión'
        APROBADA = 'APROBADA', 'Aprobada'
        RECHAZADA = 'RECHAZADA', 'Rechazada'

    class Modalidad(models.TextChoices):
        PRESENCIAL = 'PRESENCIAL', 'Presencial'
        VIRTUAL = 'VIRTUAL', 'Virtual'
        HIBRIDA = 'HIBRIDA', 'Híbrida'

    titulo = models.CharField('título', max_length=150)
    descripcion = models.TextField('descripción')
    objetivo = models.TextField(blank=True)
    publico_objetivo = models.CharField('público objetivo', max_length=150, blank=True)
    modalidad = models.CharField(max_length=10, choices=Modalidad.choices, default=Modalidad.PRESENCIAL)
    fecha_tentativa = models.DateField(null=True, blank=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.PROTECT, related_name='propuestas')
    autor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='propuestas')
    estado = models.CharField(max_length=12, choices=Estado.choices, default=Estado.BORRADOR)
    creada = models.DateTimeField(auto_now_add=True)
    actualizada = models.DateTimeField(auto_now=True)

    # solo se puede editar o borrar en estos estados
    ESTADOS_EDITABLES = (Estado.BORRADOR, Estado.PUBLICADA)

    class Meta:
        ordering = ['-creada']

    def __str__(self):
        return self.titulo

    def get_absolute_url(self):
        return reverse('propuestas:detalle', args=[self.pk])

    @property
    def es_editable(self):
        return self.estado in self.ESTADOS_EDITABLES

    def puede_modificar(self, usuario):
        return usuario.is_authenticated and usuario == self.autor and self.es_editable

    @property
    def color_estado(self):
        colores = {
            self.Estado.BORRADOR: 'secondary',
            self.Estado.PUBLICADA: 'primary',
            self.Estado.EN_REVISION: 'warning',
            self.Estado.APROBADA: 'success',
            self.Estado.RECHAZADA: 'danger',
        }
        return colores[self.estado]

    @property
    def puntaje(self):
        return self.votos.aggregate(total=Sum('valor'))['total'] or 0
