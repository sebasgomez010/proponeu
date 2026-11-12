from django import forms

from proponeu.formularios import EstiloBootstrapMixin

from .models import Comentario


class ComentarioForm(EstiloBootstrapMixin, forms.ModelForm):
    class Meta:
        model = Comentario
        fields = ['texto']
        labels = {'texto': ''}
        widgets = {'texto': forms.Textarea(attrs={'rows': 3, 'placeholder': 'Escribe un comentario...'})}
