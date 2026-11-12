from django import forms
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm

from proponeu.formularios import EstiloBootstrapMixin

from .models import Usuario


class RegistroForm(EstiloBootstrapMixin, UserCreationForm):
    # coordinador y admin solo los asigna el administrador
    rol = forms.ChoiceField(
        choices=[(Usuario.Rol.ESTUDIANTE, 'Estudiante'), (Usuario.Rol.DOCENTE, 'Docente')],
    )

    class Meta:
        model = Usuario
        fields = ['first_name', 'last_name', 'email', 'programa', 'rol']
        labels = {'first_name': 'Nombres', 'last_name': 'Apellidos'}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['first_name'].required = True
        self.fields['last_name'].required = True


class LoginForm(EstiloBootstrapMixin, AuthenticationForm):
    pass


class PerfilForm(EstiloBootstrapMixin, forms.ModelForm):
    class Meta:
        model = Usuario
        fields = ['first_name', 'last_name', 'programa']
        labels = {'first_name': 'Nombres', 'last_name': 'Apellidos'}
