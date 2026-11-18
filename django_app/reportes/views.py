from django.views.generic import FormView

from integraciones import cliente
from propuestas.models import Propuesta
from propuestas.views import con_conteos
from usuarios.mixins import CoordinadorRequeridoMixin

from .forms import ReporteForm


class ReporteView(CoordinadorRequeridoMixin, FormView):
    form_class = ReporteForm
    template_name = 'reportes/reporte.html'

    def form_valid(self, form):
        desde = form.cleaned_data['desde']
        hasta = form.cleaned_data['hasta']
        propuestas = con_conteos(
            Propuesta.objects.exclude(estado=Propuesta.Estado.BORRADOR)
            .filter(creada__date__gte=desde, creada__date__lte=hasta)
        )
        datos = [
            {
                'titulo': p.titulo,
                'categoria': p.categoria.nombre,
                'estado': p.get_estado_display(),
                'votos': p.total_votos,
                'comentarios': p.total_comentarios,
            }
            for p in propuestas
        ]
        reporte = cliente.generar_reporte(desde, hasta, datos)
        return self.render_to_response(self.get_context_data(
            form=form,
            reporte=reporte,
            ia_fallo=reporte is None,
            total=len(datos),
        ))
