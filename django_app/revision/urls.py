from django.urls import path

from . import views

app_name = 'revision'

urlpatterns = [
    path('', views.BandejaView.as_view(), name='bandeja'),
    path('<int:pk>/estado/', views.CambiarEstadoView.as_view(), name='cambiar_estado'),
]
