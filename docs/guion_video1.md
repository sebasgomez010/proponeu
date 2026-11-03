# Guion — Video 1 · ProponeU (Entrega 1)

**Duración objetivo:** 5:30 min. La guía pide máximo 8 min y el cronograma indica 5 min.
**Reglas de la guía:** todos los integrantes deben aparecer y hablar. Se deben mostrar pantallas reales (SRS, diagramas, repositorio). Debe existir una sección llamada **«Evidencia de Requisitos Implementados»**.

**Qué tener abierto en pantalla:** el SRS en Word, los PNG de `docs/uml/`, el repositorio en GitHub y la matriz de trazabilidad (sección 12 del SRS).

| Bloque | Tiempo | Quién | En pantalla |
| --- | --- | --- | --- |
| 1. Presentación | 0:00–0:30 | Todos (I1 habla) | Cámara con todos + portada del SRS |
| 2. Problema | 0:30–1:30 | I2 | SRS, sección 2 |
| 3. Solución | 1:30–2:30 | I3 | SRS, sección 4 + diagrama de casos de uso |
| 4. Arquitectura | 2:30–4:30 | I4 e I1 | Diagrama de componentes y de despliegue |
| 5. Evidencia y estado actual | 4:30–5:30 | I2 e I3 | Matriz (sección 12 del SRS), backlog y repositorio en GitHub |

---

## 1. Presentación del equipo (30 s) — Integrante 1

> «Hola, somos el equipo de **ProponeU**, una plataforma web de propuestas académicas con inteligencia artificial, para el Proyecto Integrador ExpoUninpahu 2026 de Ingeniería de Software. Somos [I1], [I2], [I3] y [I4]. *(cada uno saluda en cámara)* En este video presentamos el problema, nuestra solución y la arquitectura que vamos a construir.»

## 2. Problema identificado (1 min) — Integrante 2

> «**¿Quién tiene el problema?** Los estudiantes y docentes de Uninpahu que tienen ideas para actividades académicas, como talleres, charlas, semilleros o hackatones, y los coordinadores que deben decidir cuáles se hacen.
>
> **¿Cómo se ve hoy?** Las ideas circulan por grupos de WhatsApp, correos sueltos o en papel. No hay un registro central: las propuestas se pierden o se repiten, nadie sabe en qué estado están y no hay forma de medir cuánto interés genera cada una. Además, el coordinador tiene que leer y clasificar todo a mano.
>
> **¿Por qué vale la pena resolverlo?** Porque se pierden buenas ideas, baja la participación y las decisiones se toman por percepción y no con datos.»

*Recomendación:* si hacen una encuesta rápida a compañeros (por ejemplo, 10 a 20 respuestas en Google Forms), mencionen aquí un dato real. No inventen cifras.

## 3. Propuesta de solución (1 min) — Integrante 3

> «Nuestra solución es **ProponeU**. Cualquier estudiante o docente puede registrarse y publicar una propuesta. La comunidad la vota y la comenta, y el coordinador académico la revisa y la aprueba o la rechaza con una observación. El autor recibe un correo con la respuesta.
>
> La inteligencia artificial nos ayuda en tres puntos: resume y clasifica cada propuesta, avisa si ya existe una propuesta parecida y genera reportes ejecutivos para que la coordinación decida rápido.
>
> *(mostrar el diagrama de casos de uso)* Aquí están los actores: visitante, estudiante, docente, coordinador y administrador, y los 16 casos de uso que definimos en el SRS.»

## 4. Arquitectura (2 min) — Integrantes 4 y 1 · *mostrar diagrama de componentes*

**Integrante 4 (1 min):**
> «Esta es nuestra arquitectura.
> **Django** es la aplicación principal. Maneja el registro, el login, los roles, el CRUD de propuestas y categorías, los votos, los comentarios, la revisión y el panel administrativo. Está organizada en módulos: usuarios, propuestas, participación, revisión, reportes e integraciones.
> **Node.js** es un microservicio con Express que concentra todo lo que depende de servicios externos. Django se comunica con él por una API REST con JSON, protegida con una API Key, y esa API queda documentada con **Swagger** en /api/docs.»

**Integrante 1 (1 min):**
> «La **IA** se usa a través de la API de Google Gemini. Solo la llama el microservicio, así Django no depende directamente del proveedor y, si la IA falla, la aplicación sigue funcionando.
> La **base de datos** es PostgreSQL, a la que Django accede por su ORM.
> Con **Docker** cada servicio tiene su contenedor: django_app, ms_ia y db. Con Docker Compose levantamos todo con un solo comando.
> *(mostrar el diagrama de despliegue)* En producción publicamos ambos servicios en Render, con PostgreSQL gestionado. Los secretos van en variables de entorno y cada push a main despliega automáticamente.»

## 5. Evidencia de Requisitos Implementados y estado actual (1 min) — Integrantes 2 y 3

**Integrante 2 — Evidencia de Requisitos Implementados (30 s)** · *mostrar la sección 12 del SRS*
> «En esta entrega la evidencia es la especificación. Tenemos 18 requisitos funcionales y 11 no funcionales en el SRS. Cada requisito está en la matriz de trazabilidad con su caso de uso, su historia de usuario, el componente que lo implementa, el video donde se va a mostrar y la entrega correspondiente. El backlog tiene 17 historias de usuario priorizadas con MoSCoW.»

**Integrante 3 — Estado actual (30 s)** · *mostrar el repositorio en GitHub*
> «Este es nuestro repositorio. Tiene la carpeta django_app con el proyecto Django y una app por cada módulo del diagrama de componentes, ms_ia para el microservicio, y docs con el SRS, los diagramas UML y el backlog. Trabajamos con Git Flow: main, develop y una rama por historia de usuario. En la Entrega 2 vamos a mostrar el núcleo funcional: login, roles y CRUD. ¡Gracias!»

---

### Checklist antes de publicar
- [ ] Todos los integrantes aparecen en cámara y hablan.
- [ ] Duración menor a 8 minutos (ideal cerca de 5).
- [ ] Se ven el SRS, los tres diagramas UML, el backlog, la matriz y el repositorio.
- [ ] El video está publicado (YouTube como «No listado» o Drive con enlace público) y el enlace está en el README.
