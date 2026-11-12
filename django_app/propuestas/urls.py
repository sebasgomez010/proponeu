from django.urls import path

from . import views

app_name = 'propuestas'

urlpatterns = [
    path('', views.PropuestaListView.as_view(), name='lista'),
    path('mias/', views.MisPropuestasView.as_view(), name='mis_propuestas'),
    path('nueva/', views.PropuestaCreateView.as_view(), name='crear'),
    path('<int:pk>/', views.PropuestaDetailView.as_view(), name='detalle'),
    path('<int:pk>/editar/', views.PropuestaUpdateView.as_view(), name='editar'),
    path('<int:pk>/eliminar/', views.PropuestaDeleteView.as_view(), name='eliminar'),
]
