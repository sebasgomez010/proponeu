from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.messages.views import SuccessMessageMixin
from django.urls import reverse_lazy
from django.views.generic import CreateView, UpdateView

from .forms import PerfilForm, RegistroForm


class RegistroView(CreateView):
    form_class = RegistroForm
    template_name = 'usuarios/registro.html'
    success_url = reverse_lazy('propuestas:lista')

    def form_valid(self, form):
        respuesta = super().form_valid(form)
        login(self.request, self.object)
        messages.success(self.request, f'¡Bienvenido(a), {self.object.first_name}! Tu cuenta fue creada.')
        return respuesta


class PerfilView(LoginRequiredMixin, SuccessMessageMixin, UpdateView):
    form_class = PerfilForm
    template_name = 'usuarios/perfil.html'
    success_url = reverse_lazy('usuarios:perfil')
    success_message = 'Tus datos fueron actualizados.'

    def get_object(self, queryset=None):
        return self.request.user
