from django.urls import path
from . import views

app_name = 'propuestas'

urlpatterns = [
    path('', views.index, name='index'),
    path('crear/', views.crear, name='crear'),
    path('<int:propuesta_id>/', views.detalle, name='detalle'),
    path('<int:propuesta_id>/editar/', views.editar, name='editar'),
    path('<int:propuesta_id>/eliminar/', views.eliminar, name='eliminar'),
    path('<int:propuesta_id>/votar/', views.votar, name='votar'),
    path('<int:propuesta_id>/resultados/', views.resultados, name='resultados'),
]