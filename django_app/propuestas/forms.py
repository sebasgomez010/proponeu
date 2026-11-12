from django import forms

from proponeu.formularios import EstiloBootstrapMixin

from .models import Categoria, Propuesta


class PropuestaForm(EstiloBootstrapMixin, forms.ModelForm):
    class Meta:
        model = Propuesta
        fields = ['titulo', 'categoria', 'descripcion', 'objetivo', 'publico_objetivo', 'modalidad', 'fecha_tentativa']
        widgets = {
            'descripcion': forms.Textarea(attrs={'rows': 5}),
            'objetivo': forms.Textarea(attrs={'rows': 3}),
            'fecha_tentativa': forms.DateInput(attrs={'type': 'date'}, format='%Y-%m-%d'),
        }
        help_texts = {
            'publico_objetivo': 'Por ejemplo: estudiantes de primer semestre de Ingeniería de Software.',
        }


class FiltroPropuestasForm(EstiloBootstrapMixin, forms.Form):
    ORDEN = [('recientes', 'Más recientes'), ('votadas', 'Más votadas')]

    q = forms.CharField(required=False, label='Buscar', widget=forms.TextInput(attrs={'placeholder': 'Buscar por título o descripción'}))
    categoria = forms.ModelChoiceField(queryset=Categoria.objects.all(), required=False, empty_label='Todas las categorías')
    estado = forms.ChoiceField(
        required=False,
        choices=[('', 'Todos los estados')] + [c for c in Propuesta.Estado.choices if c[0] != Propuesta.Estado.BORRADOR],
    )
    orden = forms.ChoiceField(choices=ORDEN, required=False)
