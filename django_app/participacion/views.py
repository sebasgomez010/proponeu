from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect
from django.views.decorators.http import require_POST

from propuestas.models import Propuesta

from .forms import ComentarioForm
from .models import Voto


@login_required
@require_POST
def votar(request, pk):
    propuesta = get_object_or_404(Propuesta, pk=pk)

    if propuesta.estado != Propuesta.Estado.PUBLICADA:
        messages.error(request, 'Solo se puede votar en propuestas publicadas.')
    elif propuesta.autor == request.user:
        messages.error(request, 'No puedes votar tu propia propuesta.')
    elif request.POST.get('valor') not in ('1', '-1'):
        messages.error(request, 'Voto no válido.')
    else:
        Voto.objects.update_or_create(
            propuesta=propuesta, usuario=request.user,
            defaults={'valor': int(request.POST['valor'])},
        )
        messages.success(request, 'Tu voto fue registrado.')
    return redirect(propuesta)


@login_required
@require_POST
def comentar(request, pk):
    propuesta = get_object_or_404(Propuesta, pk=pk)
    if propuesta.estado == Propuesta.Estado.BORRADOR:
        messages.error(request, 'No se puede comentar un borrador.')
        return redirect(propuesta)

    form = ComentarioForm(request.POST)
    if form.is_valid():
        comentario = form.save(commit=False)
        comentario.propuesta = propuesta
        comentario.autor = request.user
        comentario.save()
        messages.success(request, 'Comentario publicado.')
    else:
        messages.error(request, 'El comentario no puede estar vacío.')
    return redirect(f'{propuesta.get_absolute_url()}#comentarios')
