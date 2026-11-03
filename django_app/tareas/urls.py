from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('crear/', views.crear, name='crear'),
    path('<int:tarea_id>/', views.detail, name='detail'),
    path('<int:tarea_id>/editar/', views.editar, name='editar'),
    path('<int:tarea_id>/eliminar/', views.eliminar, name='eliminar'),
]
