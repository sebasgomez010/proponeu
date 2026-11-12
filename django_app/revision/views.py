from django.contrib import messages
from django.db import transaction
from django.shortcuts import get_object_or_404, redirect
from django.views.generic import FormView, ListView

from propuestas.models import Propuesta
from propuestas.views import con_conteos
from usuarios.mixins import CoordinadorRequeridoMixin

from .forms import CambiarEstadoForm
from .models import HistorialEstado


class BandejaView(CoordinadorRequeridoMixin, ListView):
    template_name = 'revision/bandeja.html'
    context_object_name = 'propuestas'

    def get_queryset(self):
        self.estado = self.request.GET.get('estado', 'pendientes')
        qs = con_conteos(Propuesta.objects.exclude(estado=Propuesta.Estado.BORRADOR))
        if self.estado == 'pendientes':
            qs = qs.filter(estado__in=[Propuesta.Estado.PUBLICADA, Propuesta.Estado.EN_REVISION])
        elif self.estado in Propuesta.Estado.values:
            qs = qs.filter(estado=self.estado)
        return qs.order_by('-total_votos', 'creada')

    def get_context_data(self, **kwargs):
        contexto = super().get_context_data(**kwargs)
        contexto['estado_actual'] = self.estado
        contexto['opciones'] = [('pendientes', 'Pendientes')] + [
            c for c in Propuesta.Estado.choices if c[0] != Propuesta.Estado.BORRADOR
        ]
        return contexto


class CambiarEstadoView(CoordinadorRequeridoMixin, FormView):
    form_class = CambiarEstadoForm
    template_name = 'revision/cambiar_estado.html'

    def dispatch(self, request, *args, **kwargs):
        self.propuesta = get_object_or_404(Propuesta, pk=kwargs['pk'])
        if self.propuesta.estado == Propuesta.Estado.BORRADOR:
            messages.error(request, 'Un borrador no se puede revisar.')
            return redirect('revision:bandeja')
        return super().dispatch(request, *args, **kwargs)

    def get_initial(self):
        return {'estado': self.propuesta.estado}

    def get_context_data(self, **kwargs):
        contexto = super().get_context_data(**kwargs)
        contexto['propuesta'] = self.propuesta
        contexto['historial'] = self.propuesta.historial.select_related('usuario')
        return contexto

    @transaction.atomic
    def form_valid(self, form):
        nuevo = form.cleaned_data['estado']
        HistorialEstado.objects.create(
            propuesta=self.propuesta,
            estado_anterior=self.propuesta.estado,
            estado_nuevo=nuevo,
            observacion=form.cleaned_data['observacion'],
            usuario=self.request.user,
        )
        self.propuesta.estado = nuevo
        self.propuesta.save(update_fields=['estado', 'actualizada'])
        messages.success(self.request, f'La propuesta quedó en estado «{self.propuesta.get_estado_display()}».')
        return redirect('revision:bandeja')
