from django.shortcuts import render, get_object_or_404, redirect
from .models import Propuesta, Opcion
from .forms import PropuestaForm

# lista de propuestas
def index(request):
    propuestas = Propuesta.objects.order_by('-fecha_creacion')
    return render(request, 'propuestas/index.html', {'propuestas': propuestas})

# detalle de una propuesta
def detalle(request, propuesta_id):
    propuesta = get_object_or_404(Propuesta, pk=propuesta_id)
    return render(request, 'propuestas/detalle.html', {'propuesta': propuesta})

# registrar el voto
def votar(request, propuesta_id):
    propuesta = get_object_or_404(Propuesta, pk=propuesta_id)
    try:
        opcion_elegida = propuesta.opcion_set.get(pk=request.POST['opcion'])
    except (KeyError, Opcion.DoesNotExist):
        return render(request, 'propuestas/detalle.html', {
            'propuesta': propuesta,
            'error_message': 'No seleccionaste ninguna opción.',
        })
    else:
        opcion_elegida.votos += 1
        opcion_elegida.save()
        return redirect('propuestas:resultados', propuesta_id=propuesta.id)

# resultados
def resultados(request, propuesta_id):
    propuesta = get_object_or_404(Propuesta, pk=propuesta_id)
    return render(request, 'propuestas/resultados.html', {'propuesta': propuesta})

# crear propuesta
def crear(request):
    if request.method == 'POST':
        form = PropuestaForm(request.POST)
        if form.is_valid():
            propuesta = form.save()
            # le creo las dos opciones de voto automaticamente
            Opcion.objects.create(Propuesta=propuesta, texto='Me interesa')
            Opcion.objects.create(Propuesta=propuesta, texto='No me interesa')
            return redirect('propuestas:index')
    else:
        form = PropuestaForm()
    return render(request, 'propuestas/form.html', {'form': form})


# editar propuesta
def editar(request, propuesta_id):
    propuesta = get_object_or_404(Propuesta, pk=propuesta_id)
    if request.method == 'POST':
        form = PropuestaForm(request.POST, instance=propuesta)
        if form.is_valid():
            form.save()
            return redirect('propuestas:detalle', propuesta_id=propuesta.id)
    else:
        form = PropuestaForm(instance=propuesta)
    return render(request, 'propuestas/form.html', {'form': form})


# eliminar propuesta
def eliminar(request, propuesta_id):
    propuesta = get_object_or_404(Propuesta, pk=propuesta_id)
    if request.method == 'POST':
        propuesta.delete()
        return redirect('propuestas:index')
    return render(request, 'propuestas/eliminar.html', {'propuesta': propuesta})