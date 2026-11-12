from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.db.models import Count, IntegerField, OuterRef, Q, Subquery, Sum
from django.db.models.functions import Coalesce
from django.http import Http404
from django.urls import reverse_lazy
from django.views.generic import CreateView, DeleteView, DetailView, ListView, UpdateView

from participacion.forms import ComentarioForm
from participacion.models import Voto

from .forms import FiltroPropuestasForm, PropuestaForm
from .models import Propuesta


def con_conteos(queryset):
    # se suman aparte porque con el Count de comentarios se duplicaban los votos
    suma_votos = (
        Voto.objects.filter(propuesta=OuterRef('pk'))
        .values('propuesta').annotate(total=Sum('valor')).values('total')
    )
    return queryset.select_related('categoria', 'autor').annotate(
        total_votos=Coalesce(Subquery(suma_votos, output_field=IntegerField()), 0),
        total_comentarios=Count('comentarios', distinct=True),
    ).order_by('-creada')


class PropuestaListView(ListView):
    template_name = 'propuestas/lista.html'
    context_object_name = 'propuestas'
    paginate_by = 9

    def get_queryset(self):
        qs = con_conteos(Propuesta.objects.exclude(estado=Propuesta.Estado.BORRADOR))
        self.filtro = FiltroPropuestasForm(self.request.GET or None)
        if self.filtro.is_valid():
            datos = self.filtro.cleaned_data
            if datos['q']:
                qs = qs.filter(Q(titulo__icontains=datos['q']) | Q(descripcion__icontains=datos['q']))
            if datos['categoria']:
                qs = qs.filter(categoria=datos['categoria'])
            if datos['estado']:
                qs = qs.filter(estado=datos['estado'])
            if datos['orden'] == 'votadas':
                qs = qs.order_by('-total_votos', '-creada')
        return qs

    def get_context_data(self, **kwargs):
        contexto = super().get_context_data(**kwargs)
        contexto['filtro'] = self.filtro
        parametros = self.request.GET.copy()
        parametros.pop('page', None)
        contexto['parametros'] = parametros.urlencode()
        return contexto


class MisPropuestasView(LoginRequiredMixin, ListView):
    template_name = 'propuestas/mis_propuestas.html'
    context_object_name = 'propuestas'

    def get_queryset(self):
        return con_conteos(Propuesta.objects.filter(autor=self.request.user))


class PropuestaDetailView(DetailView):
    template_name = 'propuestas/detalle.html'
    context_object_name = 'propuesta'

    def get_queryset(self):
        return con_conteos(Propuesta.objects.all())

    def get_object(self, queryset=None):
        propuesta = super().get_object(queryset)
        # los borradores solo los ve el autor
        if propuesta.estado == Propuesta.Estado.BORRADOR and propuesta.autor != self.request.user:
            raise Http404
        return propuesta

    def get_context_data(self, **kwargs):
        contexto = super().get_context_data(**kwargs)
        propuesta = self.object
        usuario = self.request.user
        contexto['puede_modificar'] = propuesta.puede_modificar(usuario)
        contexto['comentarios'] = propuesta.comentarios.select_related('autor')
        contexto['historial'] = propuesta.historial.select_related('usuario')
        contexto['comentario_form'] = ComentarioForm()
        contexto['votos_a_favor'] = propuesta.votos.filter(valor=1).count()
        contexto['votos_en_contra'] = propuesta.votos.filter(valor=-1).count()
        if usuario.is_authenticated:
            voto = propuesta.votos.filter(usuario=usuario).first()
            contexto['mi_voto'] = voto.valor if voto else None
            contexto['puede_votar'] = propuesta.estado == Propuesta.Estado.PUBLICADA and usuario != propuesta.autor
        return contexto


class GuardarComoMixin:
    # el boton que se oprima define si queda publicada o en borrador
    def form_valid(self, form):
        if 'borrador' in self.request.POST:
            form.instance.estado = Propuesta.Estado.BORRADOR
        else:
            form.instance.estado = Propuesta.Estado.PUBLICADA
        respuesta = super().form_valid(form)
        if form.instance.estado == Propuesta.Estado.PUBLICADA:
            messages.success(self.request, 'La propuesta fue publicada.')
        else:
            messages.info(self.request, 'La propuesta se guardó como borrador. Solo tú puedes verla.')
        return respuesta


class PropuestaCreateView(LoginRequiredMixin, GuardarComoMixin, CreateView):
    form_class = PropuestaForm
    template_name = 'propuestas/form.html'

    def form_valid(self, form):
        form.instance.autor = self.request.user
        return super().form_valid(form)


class SoloAutorMixin(LoginRequiredMixin, UserPassesTestMixin):
    model = Propuesta

    def test_func(self):
        return self.get_object().puede_modificar(self.request.user)


class PropuestaUpdateView(SoloAutorMixin, GuardarComoMixin, UpdateView):
    form_class = PropuestaForm
    template_name = 'propuestas/form.html'


class PropuestaDeleteView(SoloAutorMixin, DeleteView):
    template_name = 'propuestas/confirmar_eliminar.html'
    context_object_name = 'propuesta'
    success_url = reverse_lazy('propuestas:mis_propuestas')

    def form_valid(self, form):
        messages.success(self.request, f'La propuesta «{self.object}» fue eliminada.')
        return super().form_valid(form)
