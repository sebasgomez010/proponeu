from django.contrib import admin

from .models import Tarea, Categoria

admin.site.register(Categoria)
admin.site.register(Tarea)