from django.contrib import admin

from .models import HistorialEstado


@admin.register(HistorialEstado)
class HistorialEstadoAdmin(admin.ModelAdmin):
    list_display = ['propuesta', 'estado_anterior', 'estado_nuevo', 'usuario', 'fecha']
    list_filter = ['estado_nuevo']
    search_fields = ['propuesta__titulo', 'observacion']
    readonly_fields = ['propuesta', 'estado_anterior', 'estado_nuevo', 'observacion', 'usuario', 'fecha']

    def has_add_permission(self, request):
        # el historial se crea solo desde la revision
        return False
