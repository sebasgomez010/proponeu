from django.contrib import admin

from .models import Opcion, Propuesta

admin.site.register(Propuesta)
admin.site.register(Opcion)