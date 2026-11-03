from django.db import models

class Propuesta(models.Model):
    titulo = models.CharField(max_length=100)
    descripcion = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.titulo

class Opcion(models.Model):
    Propuesta = models.ForeignKey(Propuesta, on_delete=models.CASCADE)
    texto = models.CharField(max_length=100)
    votos = models.IntegerField(default=0)

    def __str__(self):
        return self.texto