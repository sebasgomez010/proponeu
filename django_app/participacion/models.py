from django.conf import settings
from django.db import models

from propuestas.models import Propuesta


class Voto(models.Model):
    class Valor(models.IntegerChoices):
        A_FAVOR = 1, 'A favor'
        EN_CONTRA = -1, 'En contra'

    propuesta = models.ForeignKey(Propuesta, on_delete=models.CASCADE, related_name='votos')
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='votos')
    valor = models.SmallIntegerField(choices=Valor.choices)
    fecha = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            # un voto por usuario en cada propuesta
            models.UniqueConstraint(fields=['propuesta', 'usuario'], name='voto_unico_por_usuario'),
        ]

    def __str__(self):
        return f'{self.usuario} → {self.propuesta} ({self.get_valor_display()})'


class Comentario(models.Model):
    propuesta = models.ForeignKey(Propuesta, on_delete=models.CASCADE, related_name='comentarios')
    autor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comentarios')
    texto = models.TextField(max_length=1000)
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['fecha']

    def __str__(self):
        return f'{self.autor} en {self.propuesta}'
