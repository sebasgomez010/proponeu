from django import forms

from proponeu.formularios import EstiloBootstrapMixin
from propuestas.models import Propuesta


class CambiarEstadoForm(EstiloBootstrapMixin, forms.Form):
    ESTADOS = [
        (Propuesta.Estado.EN_REVISION, 'En revisión'),
        (Propuesta.Estado.APROBADA, 'Aprobada'),
        (Propuesta.Estado.RECHAZADA, 'Rechazada'),
    ]

    estado = forms.ChoiceField(choices=ESTADOS, label='Nuevo estado')
    observacion = forms.CharField(
        label='Observación para el autor', required=False,
        widget=forms.Textarea(attrs={'rows': 4}),
    )

    def clean(self):
        datos = super().clean()
        if datos.get('estado') == Propuesta.Estado.RECHAZADA and not datos.get('observacion', '').strip():
            self.add_error('observacion', 'Debes explicar el motivo del rechazo.')
        return datos
