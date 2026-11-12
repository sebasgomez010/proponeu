from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import include, path
from django.views.generic import TemplateView

from usuarios.forms import LoginForm

admin.site.site_header = 'ProponeU — Administración'
admin.site.site_title = 'ProponeU'
admin.site.index_title = 'Panel administrativo'

urlpatterns = [
    path('', TemplateView.as_view(template_name='inicio.html'), name='inicio'),
    path('cuenta/login/', auth_views.LoginView.as_view(authentication_form=LoginForm), name='login'),
    path('cuenta/logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('cuenta/', include('usuarios.urls')),
    path('propuestas/', include('propuestas.urls')),
    path('propuestas/', include('participacion.urls')),
    path('revision/', include('revision.urls')),
    path('admin/', admin.site.urls),
]
