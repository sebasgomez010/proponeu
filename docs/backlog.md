# Backlog inicial — ProponeU

Priorización MoSCoW (Must, Should, Could) y estimación en puntos de historia (Fibonacci). Cada historia se registra como issue en GitHub con la plantilla «Historia de usuario».

| ID | Historia de usuario | Prioridad | Puntos | Entrega |
| --- | --- | --- | --- | --- |
| HU01 | Como visitante, quiero registrarme como estudiante o docente, para poder proponer, votar y comentar. | Must | 3 | Entrega 2 |
| HU02 | Como usuario registrado, quiero iniciar y cerrar sesión, para acceder de forma segura a mis funciones. | Must | 2 | Entrega 2 |
| HU03 | Como usuario registrado, quiero editar mi perfil, para mantener mis datos actualizados. | Could | 2 | Entrega 2 |
| HU04 | Como estudiante o docente, quiero crear una propuesta de actividad académica, para que la comunidad la conozca y la apoye. | Must | 5 | Entrega 2 |
| HU05 | Como autor de una propuesta, quiero editar o eliminar mi propuesta, para corregir errores o retirarla. | Must | 3 | Entrega 2 |
| HU06 | Como miembro de la comunidad, quiero buscar y filtrar propuestas, para encontrar las que me interesan. | Must | 3 | Entrega 2 |
| HU07 | Como usuario registrado, quiero votar a favor o en contra de una propuesta, para expresar mi interés. | Must | 3 | Entrega 2 |
| HU08 | Como usuario registrado, quiero comentar una propuesta, para aportar ideas o hacer preguntas. | Should | 2 | Entrega 2 |
| HU09 | Como autor de una propuesta, quiero que la IA resuma mi propuesta, sugiera categoría y etiquetas y me dé sugerencias de redacción, para presentarla de forma clara. | Must | 8 | Entrega 3 |
| HU10 | Como autor de una propuesta, quiero ver propuestas similares antes de publicar, para no duplicar ideas y unirme a una existente. | Should | 5 | Entrega 3 |
| HU11 | Como coordinador académico, quiero cambiar el estado de una propuesta con una observación, para dar respuesta formal a la comunidad. | Must | 5 | Entrega 2 |
| HU12 | Como autor de una propuesta, quiero recibir un correo cuando cambie el estado de mi propuesta, para enterarme sin entrar a la plataforma. | Should | 3 | Entrega 3 |
| HU13 | Como coordinador académico, quiero generar con IA un reporte ejecutivo de un periodo, para tomar decisiones rápidas basadas en datos. | Should | 5 | Entrega 3 |
| HU14 | Como coordinador académico, quiero ver un tablero de estadísticas, para conocer la participación de la comunidad. | Could | 3 | Sustentación final |
| HU15 | Como administrador, quiero gestionar usuarios y asignar roles, para controlar quién puede revisar propuestas. | Must | 3 | Entrega 2 |
| HU16 | Como administrador, quiero gestionar las categorías, para mantener organizado el catálogo de propuestas. | Should | 2 | Entrega 2 |
| HU17 | Como desarrollador o integrador, quiero consultar la documentación Swagger del microservicio, para entender y probar sus endpoints. | Must | 3 | Entrega 3 |

**Total estimado:** 60 puntos.

## Criterios de aceptación

### HU01 — Registrarme como estudiante o docente

- [ ] El formulario pide nombre, correo, programa, rol y contraseña.
- [ ] No se permite un correo ya registrado.
- [ ] Debo aceptar la política de tratamiento de datos.

### HU02 — Iniciar y cerrar sesión

- [ ] Con credenciales válidas entro a la página principal.
- [ ] Con credenciales inválidas veo un mensaje de error.
- [ ] Al cerrar sesión no puedo entrar a páginas protegidas.

### HU03 — Editar mi perfil

- [ ] Puedo cambiar nombre, programa y contraseña.
- [ ] Los cambios se ven de inmediato.

### HU04 — Crear una propuesta de actividad académica

- [ ] Título, descripción y categoría son obligatorios.
- [ ] Puedo guardarla como borrador o publicarla.
- [ ] La propuesta queda asociada a mi usuario.

### HU05 — Editar o eliminar mi propuesta

- [ ] Solo veo las opciones en mis propuestas.
- [ ] No puedo editar una propuesta En revisión, Aprobada o Rechazada.
- [ ] Eliminar pide confirmación.

### HU06 — Buscar y filtrar propuestas

- [ ] Puedo buscar por texto.
- [ ] Puedo filtrar por categoría y estado.
- [ ] Puedo ordenar por más votadas o más recientes.

### HU07 — Votar a favor o en contra de una propuesta

- [ ] Solo tengo un voto por propuesta y puedo cambiarlo.
- [ ] No puedo votar mi propia propuesta.
- [ ] El conteo se actualiza al votar.

### HU08 — Comentar una propuesta

- [ ] El comentario muestra autor y fecha.
- [ ] No se permiten comentarios vacíos.

### HU09 — Que la IA resuma mi propuesta, sugiera categoría y etiquetas y me dé sugerencias de redacción

- [ ] Al pulsar «Analizar con IA» veo resumen, categoría, etiquetas y sugerencias.
- [ ] Si la IA falla, puedo publicar igual.
- [ ] El resumen se guarda con la propuesta.

### HU10 — Ver propuestas similares antes de publicar

- [ ] Se muestran hasta 3 propuestas similares con enlace.
- [ ] Si no hay similares, se informa.

### HU11 — Cambiar el estado de una propuesta con una observación

- [ ] Puedo elegir En revisión, Aprobada o Rechazada.
- [ ] La observación es obligatoria al rechazar.
- [ ] Queda registro de fecha y usuario.

### HU12 — Recibir un correo cuando cambie el estado de mi propuesta

- [ ] El correo incluye título, nuevo estado y observación.
- [ ] Si el correo falla, el cambio de estado no se pierde.

### HU13 — Generar con IA un reporte ejecutivo de un periodo

- [ ] Puedo elegir el rango de fechas.
- [ ] El reporte incluye las propuestas más votadas y tendencias por categoría.
- [ ] Puedo descargar o copiar el reporte.

### HU14 — Ver un tablero de estadísticas

- [ ] Veo totales por estado y por categoría.
- [ ] Veo las 5 propuestas más votadas.

### HU15 — Gestionar usuarios y asignar roles

- [ ] Puedo activar o desactivar usuarios.
- [ ] Puedo asignar los roles Estudiante, Docente, Coordinador o Administrador.
- [ ] Un usuario sin rol de coordinador no ve la bandeja de revisión.

### HU16 — Gestionar las categorías

- [ ] Puedo crear, editar y eliminar categorías.
- [ ] No puedo eliminar una categoría con propuestas asociadas.

### HU17 — Consultar la documentación Swagger del microservicio

- [ ] La documentación está en /api/docs y es pública.
- [ ] Cada endpoint muestra parámetros, respuestas y ejemplos.
- [ ] Puedo probar los endpoints desde Swagger UI.
