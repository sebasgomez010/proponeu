from datetime import date, timedelta

from django import forms

from proponeu.formularios import EstiloBootstrapMixin


class ReporteForm(EstiloBootstrapMixin, forms.Form):
    # el input type=date necesita el formato año-mes-dia
    desde = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}, format='%Y-%m-%d'))
    hasta = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}, format='%Y-%m-%d'))

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # por defecto el ultimo mes
        self.fields['desde'].initial = date.today() - timedelta(days=30)
        self.fields['hasta'].initial = date.today()

    def clean(self):
        datos = super().clean()
        if datos.get('desde') and datos.get('hasta') and datos['desde'] > datos['hasta']:
            raise forms.ValidationError('La fecha "desde" no puede ser mayor que "hasta".')
        return datos
