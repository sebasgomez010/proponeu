from django.urls import path

from . import views

app_name = 'participacion'

urlpatterns = [
    path('<int:pk>/votar/', views.votar, name='votar'),
    path('<int:pk>/comentar/', views.comentar, name='comentar'),
]
