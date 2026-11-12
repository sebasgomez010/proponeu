from django.conf import settings
from django.db import models

from propuestas.models import Propuesta


class HistorialEstado(models.Model):
    propuesta = models.ForeignKey(Propuesta, on_delete=models.CASCADE, related_name='historial')
    estado_anterior = models.CharField(max_length=12, choices=Propuesta.Estado.choices)
    estado_nuevo = models.CharField(max_length=12, choices=Propuesta.Estado.choices)
    observacion = models.TextField(blank=True)
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'historial de estado'
        verbose_name_plural = 'historial de estados'
        ordering = ['-fecha']

    def __str__(self):
        return f'{self.propuesta}: {self.estado_anterior} → {self.estado_nuevo}'
