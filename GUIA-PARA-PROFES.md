# Guía para profes

Dos partes: cómo usar el juego en clase, y cómo se hizo, para que usted pueda repetir el método con su propia materia. El paso a paso completo, con cada error, está en `REGISTRO.md`.

---

## Parte 1 — Cómo usar el juego en clase

### Qué es

Un estudiante corre por la calle de un pueblo camino al colegio y lo persigue el Monstruo de la Ignorancia. Por la calle viene un libro con un verbo en inglés (GO). Después vienen tres pancartas, una por carril: hay que pasar por el pasado correcto (went). Luego otras tres para el participio (gone). El juego dice cada forma en voz alta en inglés.

Equivocarse es tropezar: el monstruo se acerca y el profesor del juego muestra la forma correcta con una pista. Dos errores seguidos y el monstruo atrapa al estudiante (el profesor lo salva una vez).

Al terminar un tramo, la Ignorancia cierra el paso en un puente. Ahí el juego se detiene y hay que completar oraciones: `Yesterday I ___ to school.` pide el pasado; `I have ___ to school.` pide el participio.

### Cómo abrirlo

- **En un computador:** doble clic en `index.html`. No necesita internet ni instalar nada.
- **En celulares:** el archivo tiene que estar en un sitio al que el celular pueda llegar. La forma sencilla en un salón: en el computador, dentro de la carpeta del juego, ejecutar `python servidor.py 5173`; los celulares conectados a la misma red wifi abren `http://` seguido de la dirección del computador y `:5173`.
- El progreso se guarda en cada aparato. No hay cuentas ni se envía nada a ninguna parte.

### Cómo se maneja

| | Computador | Celular |
|---|---|---|
| Cambiar de carril | Flechas ← → (o A y D) | Tocar el lado izquierdo o derecho, o deslizar |
| Empezar | Espacio o Enter | Tocar el botón |
| En el puente | 1, 2, 3 o flechas y Enter | Tocar la pancarta |

### Los 60 verbos, en seis tramos

| Tramo | Patrón | Verbos |
|---|---|---|
| 1 | Pasado y participio iguales | have, make, say, get, tell, sell, find, hear, pay, stand |
| 2 | Terminan en -t | leave, feel, keep, sleep, meet, mean, lose, send, spend, build |
| 3 | Rebeldes, y los que no cambian | go, do, come, become, run · put, let, cut, hit, read |
| 4 | Participio = base + N | take, give, see, know, eat, fall, write, drive, ride, rise |
| 5 | Participio = pasado + N, y -ought/-aught | speak, break, choose, forget, wear · think, buy, bring, teach, catch |
| 6 | Vocal i-a-u, y -ew/-own | drink, sing, swim, begin, ring · grow, throw, fly, draw, blow |

El verbo BE no está: tiene dos pasados (was/were) y en una pancarta cabe una sola palabra.

**Los infiltrados.** En cada carrera aparecen, sin avisar, dos verbos **regulares** (walk, work, play, want, look, live, talk, call, help, start, open, watch), donde la respuesta sí termina en -ed. Están ahí porque sin ellos un estudiante vivo descubre que basta con no escoger nunca la palabra en -ed; y de paso practican cuáles verbos no son irregulares. Se apagan poniendo `regularesPorPartida: 0` en `js/reglas.js`.

### Tres maneras de usarlo en 15 minutos

1. **Modo Salón por Equipos (proyector, 2 o 3 equipos):**
   - Desde la portada, toque **`Modo Salón · Equipos (15 min)`**.
   - Relevos de 4 verbos por equipo. Los carriles tienen insignias gigantes con número y color fijo **`[ 1 Azul ] · [ 2 Amarillo ] · [ 3 Verde ]`** para que los estudiantes voten levantando la mano o diciendo el número a coro desde su pupitre (o pulsando las teclas `1`, `2`, `3`).
   - El profesor tiene el control pedagógico total con la barra **`Espacio`** (`⏸ Pausa del Profe`) para congelar la pantalla en cualquier cartel y explicar la gramática.
   - En el puente final se juega con **Robo de Punto**: si el equipo en turno se equivoca, salta el cartel de rebote y el punto pasa al siguiente equipo si sabe la respuesta. Cierra con podio y "Los 3 verbos del día para anotar en el cuaderno".

2. **Termómetro Pre/Post (45 segundos) y Tablero del Salón:**
   - Antes de empezar la clase, los estudiantes abren **`⏱️ Termómetro Pre/Post`** en su celular o en el computador y responden 5 preguntas sin pistas en 45 segundos (con botón honesto *"Paso / Aún no lo sé"*).
   - Al final de la clase hacen el Post-Test y el juego les entrega un **código de 6 caracteres** (ej. `125BDK`).
   - El profesor entra a la **`Vista del Profesor`**, digita o pega los códigos y ve en vivo las barras comparativas (ej. *Entrada: 29 % → Salida: 89 %*) y los 3 verbos que más costaron en el salón, con un botón para lanzar la revancha de inmediato.
   - **Para mostrarle a otros profesores:** toque el botón **`✨ Cargar ejemplo de salón (25 estudiantes)`** para ver la demostración instantánea.

3. **Caja de Fichas de Letras (producción activa sin teclado del celular):**
   - En la segunda mitad del puente, en vez de elegir entre 3 opciones, los estudiantes deben armar la palabra letra por letra usando 8 fichas táctiles grandes (`4 × 2`, 7 letras únicas + `⌫`), con teclado físico o con el botón de micrófono (`🎤`).
   - Si fallan, el segundo intento les muestra el esqueleto (`w _ _ _`) y apaga las letras trampa. Ningún verbo sube a "Sabido" sin haber sido escrito correctamente al menos una vez.

### Qué mirar en la pantalla final

- **Los que costaron**, con la forma que el estudiante eligió. Si muchos eligen la misma forma equivocada (por ejemplo "goed"), ese es el error del grupo y vale más que una nota.
- Las opciones falsas no son al azar: son los errores típicos (la forma regular inventada, la otra forma del mismo verbo, el patrón de otro grupo). Algunas son palabras que existen en inglés aunque no sean la respuesta (founded, seed): un estudiante atento puede preguntar, y es una buena pregunta.

### Lo que el juego no hace

- No enseña a pronunciar ni a escribir: el estudiante reconoce y escoge.
- Comprueba que el estudiante reconoce la forma y sabe el patrón, no que la recuerde sin ayuda. Quien entiende que en la mitad de los verbos el pasado y el participio son iguales ya tiene media carrera hecha; eso es aprender el patrón, pero no reemplaza escribir o decir el verbo.
- Con 60 verbos y pocos por carrera, cada verbo tarda en volver: recorrerlos todos toma unas 15 carreras a quien no falla. Para una clase, use "Elegir un grupo" o "Revisiones" sobre el tramo del día.
- Las oraciones usan solo dos moldes (Yesterday… / I have…). No hay preguntas ni negaciones.
- No reemplaza la explicación: funciona mejor después de presentar el patrón del tramo, o para repasar.
- No se ha probado con un grupo real de estudiantes. Los tiempos de lectura (unos 4 segundos por fila) son un cálculo. Si a su grupo le quedan cortos o largos, se cambian en un solo archivo (`js/reglas.js`, clave `lecturaInicial`).

---

## Parte 2 — Cómo se hizo, y cómo repetirlo con otra materia

### La idea

El profesor no programó. Describió lo que quería, miró el resultado y corrigió. Un asistente de IA (el "coordinador") repartió el trabajo entre otros asistentes ("agentes"), cada uno con un oficio, y fue anotando todo. Lo que hace que funcione no es la IA sola: es el ciclo de **pedir, mirar y corregir**, repetido.

### El equipo

| Agente | Su oficio | ¿Construye o piensa? |
|---|---|---|
| Coordinador | Reparte, junta, revisa en capturas, lleva el registro | Las dos |
| Enseñanza | Profesor de inglés: qué verbos, en qué orden, qué errores típicos, qué oraciones | Piensa y entrega datos |
| Mecánica | Diseñador de juego: las reglas, con números | Piensa |
| Construcción | Programador: hace el juego | Construye |
| Pruebas | Juega miles de partidas con jugadores automáticos, incluidos tramposos | Mide |
| Debate (tres voces) | Didáctica, diseño de juego y "abogado del estudiante" | Solo piensan y se critican |

Cada agente es dueño de sus archivos y no toca los de otro. Antes de empezar se escribió un acuerdo (`AGENTES.md`) que dice quién hace qué y cómo encajan las piezas.

### Lo que pasó, en orden

1. El profesor escribió el encargo completo: la idea, las condiciones y la forma de trabajar.
2. Enseñanza y Mecánica trabajaron a la vez, cada uno en lo suyo.
3. Construcción hizo una primera versión. Pasó todas las pruebas. **El profesor la abrió y dijo que era horrible y aburrida.** Tenía razón: era una calle gris vacía.
4. Se rehízo lo que se ve: un pueblo de día, personajes, voz en inglés.
5. Pruebas encontró que se podía ganar sin saber inglés, con el truco de no escoger nunca la palabra terminada en -ed.
6. El profesor pidió pensar antes de seguir: tres agentes debatieron cómo hacer una revisión cada diez verbos.
7. Enseñanza amplió la lista a 60 verbos y corrigió el truco. Se volvió a medir: de 63 % de victorias del tramposo a 2,4 %.
8. Se construyó la revisión con oraciones.
9. Un arreglo (no castigar por no recoger el libro) abrió un hueco: se podía jugar sin fin. Pruebas lo encontró y se cerró.
10. Se mezclaron verbos regulares y el truco quedó en 0,2 %. Pruebas buscó el mejor tramposo posible entre 6.800 reglas.

### Lo que salió mal, que es lo que más enseña

| Qué pasó | Qué enseña |
|---|---|
| El coordinador convirtió "figuras simples" en "nada de adornos" y salió un juego sin vida | Una instrucción se puede endurecer al pasar de mano en mano. "Simple" no es "vacío" |
| Todas las pruebas automáticas estaban en verde y el juego aburría | Los agentes miden; las personas notan. Ninguna prueba mide si algo aburre |
| Ningún agente pudo oír la voz en inglés; el profesor lo comprobó en un minuto | Hay cosas que solo puede verificar una persona. Un buen informe dice qué NO se comprobó |
| Cada error típico estaba bien escogido, pero juntos delataban la respuesta | Los problemas de conjunto no se ven revisando pieza por pieza. Hay que probar jugando mal a propósito |
| En el debate, los tres agentes descartaron dos ideas del profesor | Un equipo útil también contradice, pero con razones que se puedan explicar, y la decisión sigue siendo de la persona |
| En el debate los tres cambiaron de opinión en la segunda ronda | Pedir opiniones por separado y después hacerlos leerse da mejores resultados que una sola opinión |

### Cómo repetirlo con su materia

La receta no depende del inglés. Sirve para cualquier contenido que se pueda preguntar con una respuesta correcta y dos equivocadas típicas: tablas de multiplicar, capitales, símbolos químicos, ortografía, fechas, clasificación de seres vivos.

1. **Escriba el encargo completo antes de empezar.** Qué quiere, para quién, en qué aparatos, qué NO quiere, y cómo quiere que se trabaje. Con ejemplos.
2. **Pida un registro desde el primer minuto.** Qué se pidió, quién lo hizo, qué decidió, qué salió mal. Sin eso no hay nada que explicarle a otro.
3. **Separe los oficios.** Uno que sepa de su materia y entregue los datos (las preguntas, el orden, los errores típicos). Otro que diseñe las reglas. Otro que construya. Otro que pruebe.
4. **Los errores típicos son su aporte.** La IA propone, pero usted sabe en qué se equivocan sus estudiantes. Revise esa lista con sus propios ojos.
5. **Pida que prueben jugando mal:** un jugador al azar debe perder, uno que no hace nada debe perder, uno que siempre acierta debe ganar, y un tramposo que busque atajos no debe ganar.
6. **Mire usted el resultado, pronto.** No espere a que esté terminado. Diez segundos suyos encuentran lo que cien pruebas no.
7. **Diga lo que no le gusta sin suavizarlo.** "Está feo y aburre" fue la instrucción más útil de todo el proyecto.
8. **Cuando no sepa cómo seguir, pida un debate.** Varias voces con miradas distintas, primero por separado y luego criticándose.
9. **Las decisiones de fondo son suyas:** qué entra y qué no, el tono, si algo se publica.

### Con qué se hizo

Un asistente de IA que puede leer y escribir archivos en el computador y coordinar a otros asistentes. El juego es una página web sencilla: se abre en cualquier navegador y no necesita servidor ni internet. Nada se publicó.
