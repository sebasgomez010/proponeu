from django.contrib import admin

from .models import Comentario, Voto


@admin.register(Voto)
class VotoAdmin(admin.ModelAdmin):
    list_display = ['propuesta', 'usuario', 'valor', 'fecha']
    list_filter = ['valor']
    search_fields = ['propuesta__titulo', 'usuario__email']


@admin.register(Comentario)
class ComentarioAdmin(admin.ModelAdmin):
    list_display = ['propuesta', 'autor', 'texto', 'fecha']
    search_fields = ['propuesta__titulo', 'autor__email', 'texto']
