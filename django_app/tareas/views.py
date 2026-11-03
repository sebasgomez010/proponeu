from django.shortcuts import render, get_object_or_404, redirect
from .models import Tarea
from .forms import TareaForm


# READ - lista de tareas
def index(request):
    tareas = Tarea.objects.all()
    return render(request, 'tareas/index.html', {'tareas': tareas})


# READ - detalle de una tarea
def detail(request, tarea_id):
    tarea = get_object_or_404(Tarea, pk=tarea_id)
    return render(request, 'tareas/detail.html', {'tarea': tarea})


# CREATE - crear tarea
def crear(request):
    if request.method == 'POST':
        form = TareaForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('index')
    else:
        form = TareaForm()
    return render(request, 'tareas/form.html', {'form': form})


# UPDATE - editar tarea
def editar(request, tarea_id):
    tarea = get_object_or_404(Tarea, pk=tarea_id)
    if request.method == 'POST':
        form = TareaForm(request.POST, instance=tarea)
        if form.is_valid():
            form.save()
            return redirect('index')
    else:
        form = TareaForm(instance=tarea)
    return render(request, 'tareas/form.html', {'form': form})


# DELETE - eliminar tarea
def eliminar(request, tarea_id):
    tarea = get_object_or_404(Tarea, pk=tarea_id)
    if request.method == 'POST':
        tarea.delete()
        return redirect('index')
    return render(request, 'tareas/eliminar.html', {'tarea': tarea})
