from django.urls import path

from . import views

app_name = 'usuarios'

urlpatterns = [
    path('registro/', views.RegistroView.as_view(), name='registro'),
    path('perfil/', views.PerfilView.as_view(), name='perfil'),
]
