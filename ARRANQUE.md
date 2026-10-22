# Juego de verbos en inglés — arranque

Este archivo es para empezar el proyecto en un chat nuevo sin tener que volver a explicar nada. Instrucción para quien lo abra: **léelo completo, propón el plan en pocas líneas y empieza a construir.**

## Qué se quiere

Un juego para aprender los **verbos irregulares en inglés** (base, pasado y participio), hecho a partir del runner "Tinto" que ya existe. Tiene dos propósitos, y los dos importan por igual:

1. **Que sirva para aprender:** una estrategia de práctica, no solo un juego con palabras encima.
2. **Que sirva para enseñar cómo se hace:** se le va a mostrar a un grupo de profesores, y hay que poder explicarles paso a paso cómo se construyó con agentes de IA. El registro del proceso es parte de la entrega, no un extra.

## La idea del dueño, en sus palabras

- "Copiar el juego, pero en lugar de un perro, un profesor corriendo a un estudiante; el estudiante se vuelve más listo, o un monstruo de la ignorancia, algo similar."
- "El estudiante coge un verbo en inglés; desde ahí tiene que encontrar los verbos similares en pasado y pasado participio; si no, se estrella."
- "La idea es hacer una estrategia para aprender verbos en inglés."
- "Sin renderizar tanto."
- "Es para unos profes y que vean cómo se hace."
- "Necesito que tenga cómo se hizo, los pasos, los agentes y todo, para yo explicarles."

## Cómo se traduce eso a mecánica (propuesta de partida, se puede mejorar)

- **Quién corre y quién persigue.** El dueño dejó dos opciones abiertas: un profesor persiguiendo a un estudiante, o un "monstruo de la ignorancia". Recomendación para proponerle: el estudiante corre y lo persigue el Monstruo de la Ignorancia; cada acierto lo aleja y lo encoge, cada error lo acerca. El profesor queda como aliado (da la pista, celebra), porque un profesor que persigue al estudiante dice lo contrario de lo que se quiere enseñar. Es decisión del dueño: preguntarle una sola vez y seguir.
- **El ciclo de un verbo.** (1) El estudiante recoge un verbo base que viene por la calle, por ejemplo **GO**. (2) Más adelante aparece una fila con tres opciones, una por carril: `went` · `goed` · `gone`. Tiene que pasar por la del **pasado**. (3) Después otra fila para el **participio**. (4) Si acierta las dos, el verbo queda "aprendido" en esa partida y llega otro.
- **Equivocarse.** Pasar por la opción incorrecta es el choque. Sirve tal cual el modelo que ya tiene Tinto: un tropiezo acerca al perseguidor durante unos segundos y un segundo tropiezo en ese lapso es captura.
- **Los distractores enseñan.** Las opciones falsas deben ser los errores típicos de quien aprende: la forma regular inventada (`goed`), la otra forma del mismo verbo (`gone` cuando se pide el pasado) y la forma de otro verbo parecido. No palabras al azar.
- **Se tiene que poder leer.** Es un juego de palabras a velocidad: letreros grandes, alto contraste, velocidad más baja que en Tinto y tiempo suficiente para leer tres palabras. Mostrar siempre arriba qué se está pidiendo ("GO → pasado").
- **Estrategia de aprendizaje, no azar.** Empezar por los verbos más frecuentes; agruparlos por patrón (los que no cambian: cut/cut/cut; los de vocal i-a-u: sing/sang/sung; etc.); repetir antes los que se fallan y espaciar los que se aciertan; al final de la partida, mostrar los verbos fallados con sus tres formas correctas.
- **Para el salón.** Una pantalla de resultados que se pueda copiar o mostrar: verbos practicados, aciertos, y cuáles cuestan más. Sin cuentas ni servidor: todo en el dispositivo.

## "Sin renderizar tanto"

Nada de Blender en este proyecto. Personajes y escenario con figuras simples hechas por código, o directamente en 2D si resulta más claro. Lo que tiene que verse bien son **las palabras**. Un solo escenario basta.

## Qué se puede reutilizar

En `base-tinto/` hay una copia del juego Tinto tal como quedó (página, código, modelos y banco de pruebas). No es obligatorio partir de ahí; es la base disponible. Lo que más sirve:

| Pieza | Dónde | Para qué sirve aquí |
|---|---|---|
| Calle de tres carriles, cámara y controles (teclado y toque) | `base-tinto/js/core.js` | Es el mismo esqueleto |
| Modelo de tropiezo y captura | `core.js` y `rules.js` | Es el castigo por equivocarse |
| Generador de filas por patrones con garantías | `core.js` | Las "filas de respuesta" son un caso particular: tres opciones, una correcta |
| Tabla única de reglas | `base-tinto/js/rules.js` | Para ajustar velocidad y tiempos de lectura en un solo sitio |
| Estadísticas en el dispositivo con botón de copiar | `base-tinto/js/stats.js` | Base de la pantalla de resultados para el salón |
| Banco de bots | `base-tinto/pruebas/bots.js` | Para comprobar que no se gana al azar ni quedándose quieto |
| Contrato entre módulos | `base-tinto/AGENTES.md` | Cómo se reparte el trabajo entre agentes sin que se pisen |

Lo que **no** hace falta traer: mundos, tienda, gatos con habilidades, drenaje, balcones, modelos de Blender. Un juego más pequeño se explica mejor.

## Cómo trabajar (lo que se aprendió haciendo Tinto)

El método completo y los errores cometidos están en `COMO-SE-HIZO-TINTO.md`. Lo esencial:

1. **Registro desde el minuto uno.** Crear `REGISTRO.md` al empezar y anotar en él cada paso: qué se pidió, qué agente lo hizo, con qué rol, qué decidió, qué salió mal y cómo se notó. Es el material con el que el dueño va a explicarles a los profesores, así que debe poder leerlo alguien que no programa.
2. **Agentes con rol y un archivo cada uno.** Si varios agentes editan lo mismo, se pisan. Un módulo por agente y un contrato escrito entre ellos.
3. **Roles sugeridos para este proyecto:** un especialista en enseñanza de inglés (lista de verbos, orden, distractores y estrategia de repaso; solo piensa y entrega datos), un diseñador de la mecánica, un constructor, y un probador con bots. Opcional: un redactor de la guía para profesores.
4. **Probar jugando mal.** En Tinto nadie probó quedarse quieto y resultó que el juego se jugaba solo. Aquí hay que probar con un bot que elige al azar (debe perder pronto) y con uno que siempre acierta (debe ganar).
5. **Mirar, no solo medir.** Un informe puede decir "probado" y la función no llegar al jugador. Revisar en capturas lo que se construye.
6. **El dueño prefiere que se actúe sin muchas preguntas.** Decidir con criterio, anotar la decisión y seguir. Él prueba y corrige.

## Entregas

1. El juego, que se abra con un doble clic o un enlace, en computador y en celular.
2. `REGISTRO.md`: el paso a paso del proceso, con agentes, roles, decisiones y errores.
3. `GUIA-PARA-PROFES.md`: cómo se usa el juego en clase y, aparte, cómo se hizo, explicado para alguien que no programa, de modo que otro profesor pueda repetir el método con su propia materia.

## Datos prácticos

- Servidor local: `python servidor.py 5173` dentro de la carpeta del juego (no guarda caché). En `base-tinto/` ya hay una copia.
- No publicar nada ni subir a GitHub sin que el dueño lo pida. Si se publica, no escribir en los archivos su nombre, correo, oficio ni rutas del computador.
