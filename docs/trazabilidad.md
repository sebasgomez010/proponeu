# Matriz de trazabilidad — ProponeU

Formato de la guía institucional: RF → Caso de uso → Historia de usuario → Componente → Evidencia en video → Entrega → URL desplegada.
Se actualiza en cada entrega; la URL se completa cuando el requisito está desplegado.

| RF | Requisito | CU | HU | Componente | Evidencia en video | Entrega | URL |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RF01 | El sistema debe permitir que un visitante se registre como Estudiante o Docente con nombre, correo, programa y contraseña, aceptando la política de tratamiento de datos. | CU01 | HU01 | usuarios | Video 2 — Registro | Entrega 2 | Pendiente |
| RF02 | El sistema debe permitir iniciar y cerrar sesión con correo y contraseña. | CU02 | HU02 | usuarios | Video 2 — Login | Entrega 2 | Pendiente |
| RF03 | El usuario debe poder consultar y actualizar los datos de su perfil. | CU03 | HU03 | usuarios | Video 2 — Demo funcional | Entrega 2 | Pendiente |
| RF04 | El sistema debe restringir cada funcionalidad según el rol: Estudiante, Docente, Coordinador académico o Administrador. | CU15 | HU15 | usuarios | Video 2 — Roles | Entrega 2 | Pendiente |
| RF05 | Un usuario registrado debe poder crear una propuesta con título, descripción, objetivo, público objetivo, modalidad, fecha tentativa y categoría. | CU04 | HU04 | propuestas | Video 2 — CRUD | Entrega 2 | Pendiente |
| RF06 | El autor debe poder editar o eliminar su propuesta mientras esté en estado Borrador o Publicada. | CU05 | HU05 | propuestas | Video 2 — CRUD | Entrega 2 | Pendiente |
| RF07 | Cualquier persona debe poder listar las propuestas publicadas y buscarlas por texto, categoría, estado y número de votos. | CU06 | HU06 | propuestas | Video 2 — CRUD | Entrega 2 | Pendiente |
| RF08 | Un usuario registrado debe poder votar a favor o en contra de una propuesta, con un único voto por propuesta que puede cambiar. | CU07 | HU07 | participacion | Video 2 — Demo funcional | Entrega 2 | Pendiente |
| RF09 | Un usuario registrado debe poder comentar las propuestas publicadas. | CU08 | HU08 | participacion | Video 2 — Demo funcional | Entrega 2 | Pendiente |
| RF10 | Al crear o editar una propuesta, el sistema debe obtener del microservicio IA un resumen, una categoría sugerida, etiquetas y sugerencias de redacción. | CU09 | HU09 | integraciones · ms_ia (Servicio IA) | Video 3 — Integración IA | Entrega 3 | Pendiente |
| RF11 | Al crear una propuesta, el sistema debe mostrar propuestas existentes similares para evitar duplicados. | CU10 | HU10 | integraciones · ms_ia (Servicio IA) | Video 3 — Integración IA | Entrega 3 | Pendiente |
| RF12 | El Coordinador académico debe poder cambiar el estado de una propuesta (En revisión, Aprobada, Rechazada) registrando una observación. | CU11 | HU11 | revision | Video 2 — Roles | Entrega 2 | Pendiente |
| RF13 | El sistema debe notificar por correo al autor cuando su propuesta cambie de estado. | CU16 | HU12 | integraciones · ms_ia (Notificaciones) | Video 3 — Comunicación Django → Node.js | Entrega 3 | Pendiente |
| RF14 | El Coordinador académico debe poder generar con IA un reporte ejecutivo de un periodo con las propuestas más votadas y las tendencias por categoría. | CU12 | HU13 | reportes · ms_ia (Servicio IA) | Video 3 — Integración IA | Entrega 3 | Pendiente |
| RF15 | El Coordinador académico debe poder consultar un tablero con estadísticas de propuestas por estado, categoría y votos. | CU13 | HU14 | revision | Video final | Sustentación final | Pendiente |
| RF16 | El Administrador debe poder crear, editar y eliminar categorías. | CU14 | HU16 | propuestas · Django Admin | Video 2 — CRUD | Entrega 2 | Pendiente |
| RF17 | El Administrador debe poder gestionar usuarios y asignar roles desde el panel administrativo. | CU15 | HU15 | Django Admin · usuarios | Video 2 — Roles | Entrega 2 | Pendiente |
| RF18 | El microservicio debe exponer su API REST documentada con Swagger/OpenAPI en una URL pública. | CU09, CU10, CU12, CU16 | HU17 | ms_ia (API REST · Swagger UI) | Video 3 — Swagger | Entrega 3 | Pendiente |
