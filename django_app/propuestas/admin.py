from django.contrib import admin

from .models import Categoria, Propuesta


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'descripcion', 'total_propuestas']
    search_fields = ['nombre']

    @admin.display(description='propuestas')
    def total_propuestas(self, obj):
        return obj.propuestas.count()


@admin.register(Propuesta)
class PropuestaAdmin(admin.ModelAdmin):
    list_display = ['titulo', 'categoria', 'autor', 'estado', 'modalidad', 'creada']
    list_filter = ['estado', 'categoria', 'modalidad']
    search_fields = ['titulo', 'descripcion', 'autor__email']
    date_hierarchy = 'creada'
    readonly_fields = ['creada', 'actualizada']
