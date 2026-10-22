# Informe de pruebas — juego de verbos irregulares

# Tercera ronda (60 verbos + 12 regulares infiltrados, orden al azar, 144 oraciones)

**Veredicto en una línea:** el truco del "-ed" quedó cerrado de verdad (sus cuatro variantes ganan 11 de 48.000 partidas; antes una ganaba 63 de cada 100) y **52 de 53 requisitos se cumplen**; el que no: todavía se puede llegar al colegio en la primera carrera sin saberse un verbo, con otra receta más larga (65 a 74 % de las veces, casi nunca "limpia").

Cómo repetirlo: `node pruebas/bots.js` (70 segundos). Las dos rondas anteriores quedan debajo, sin tocar.

## El truco del "-ed" en las tres rondas

Partidas ganadas por jugadores que **no saben ningún verbo**. 1.000 partidas por casilla.

| Truco | Dónde | 1.ª ronda | 2.ª ronda | 3.ª ronda |
|---|---|---|---|---|
| "Nunca -ed, y de las que queden la más corta" | camino, 1.ª partida | **63,3 %** | 5,6 % | **0,2 %** |
| | su mejor grupo | **100 %** (no cambian) | 11 % (no cambian) | **0,7 %** (no cambian) |
| | letreros que acierta | 82 % | 53 % | 44 % |
| "Nunca -ed" + memoria del turno ("la otra es el participio") | camino, 1.ª partida | 48,3 % | 0 % | **0 %** |
| | su mejor grupo | **100 %** (participio en N) | **42,6 %** (pasado-n) | **0,1 %** |
| "Nunca -ed", a secas | todos los modos | no lo medí | no lo medí | **0,1 %** como mucho |
| "Siempre -ed" (el truco contrario) | todos los modos | — | — | **0 %** (acierta 24 % de los letreros, menos que el azar) |
| En la revisión: "nunca -ed ni la palabra del libro" | acierta a la primera | no existía | 62 % | **36 %** (el azar, 33 %) |
| En la revisión: "nunca -ed, la más corta" | acierta a la primera | no existía | no lo medí | 46,5 % |
| 20 partidas seguidas con cualquiera de los cuatro trucos | partidas que gana | 4 % | — | **0 %** |
| **El mejor tramposo que pude armar** (ver hallazgo 1) | camino, 1.ª partida: llega | 79 % (con los datos de entonces) | no lo medí | **72 a 74 %** llega; **11 a 13 %** limpia |

Por qué se cerró: ya ninguna fila tiene la correcta como única opción sin -ed (antes 15 de 62), y en 2 de cada 10 turnos la respuesta *es* la de -ed. Quien nunca escoge -ed falla el 100 % de los regulares; quien siempre la escoge falla casi todos los irregulares.

## Qué era regla vieja y qué es falla real

Los 6 "no cumple" que daba mi banco sin tocar eran **todos regla vieja**, como dijo Construcción (lo comprobé uno por uno):

| Lo que marcaba | Por qué | Ahora |
|---|---|---|
| "72 verbos entraron, hay saltos", "máximo 6 nuevos", "10 turnos", "72 de 60" | Contaba los regulares como verbos del recorrido | Separados: 8 turnos de irregulares y 2 de regulares en 12.000 colas de 12.000; los 60 entran en orden, 4 por partida |
| 24 oraciones "con verbo que no existe" | Buscaba el verbo solo entre los irregulares | 0 problemas en 144 |
| "Repaso sin nada que repasar" | Esperaba 8 turnos y ahora son 10 | Cumple |

Con mi banco a 300 partidas salió un séptimo (la posición de la respuesta en la revisión, 32/38/30 %). Era mío: con pocas semillas seguidas el dado no reparte parejo. Con 5.000 da 33,1 / 33,3 / 33,6 %.

## Requisitos (53; cumplen 52)

Los 43 de la segunda ronda, puestos al día, cumplen todos salvo el del tramposo. Los nuevos:

| Requisito nuevo | ¿Cumple? | Número |
|---|---|---|
| Regulares contra el contrato (3 falsos por lista, ninguno en -ed, sin repetidos, máximo 9 letras, pasado = base + ed) | cumple | 0 problemas en 12 |
| 2 regulares por partida, nunca el primero, nunca seguidos, nunca el mismo dos veces | cumple | 12.000 de 12.000 colas, en todos los modos |
| Con regulares y orden al azar apagados, todo sale idéntico a la segunda ronda | cumple | aprendices 25,7 / 62,5 / 93,5 % exactos; perfecto 1:42 |
| El dado del orden no cambia carriles, aciertos ni tiempos | cumple | 200 de 200 partidas iguales |
| Un verbo nuevo siempre va pasado → participio | cumple | 0 al revés en 815.323 turnos |
| Vistos y regulares: la mitad de las veces primero el participio | cumple | 50,1 % y 49,8 % |
| El estado dice lo que de verdad se pide y no adelanta la respuesta | cumple | 0 fugas en 2,4 millones de filas |
| Los cuatro trucos del "-ed" ganan 1 % o menos en todo modo y grupo | cumple | el peor: 0,7 % |
| En la revisión, los trucos del "-ed" aciertan menos de la mitad | cumple | el mejor, 46,5 % |
| **Ningún tramposo que no sepa los verbos llega al colegio más del 1 %** | **NO cumple** | 65 % con una receta de dos pasos; 72 a 81 % con la mejor regla |

Lo que ya servía sigue sirviendo: quieto pierde siempre (0 de 3.000, a los 43 s); azar no gana (0 de 1.000); perfecto gana siempre (12.000 de 12.000, en los tres modos y los 9 grupos); toda partida termina (la más larga de todas, 3:23); lo fallado vuelve tras 2 verbos y abre la siguiente; los 60 se ven en orden.

Duración: el perfecto tarda **2:03** (Construcción decía 2:03: cierto). Aprendiz 95 %: 2:18; 90 %: 2:32; 80 %: 2:49; 70 %: 2:59. Ninguna partida de ningún perfil pasa de 3:23. **Por primera vez todo cabe en 2 a 4 minutos.**

Aprendices: 50 % → gana 0,2 %; 60 % → 3,3 %; 70 % → 19,3 %; 80 % → 56,5 %; 90 % → 92,1 %; 95 % → 98,9 %. Con dos turnos más, quien sabe a medias gana un poco menos que en la segunda ronda (25,7 → 19,3 %).

## Fallas reales, por gravedad

### 1. Importante — todavía se llega al colegio sin saber verbos, con otra receta

Le toca a **Mecánica** (cómo pesa la segunda fila y el regular) con **Enseñanza**.

Una receta de dos pasos, sin nada de inglés: **(1) en la primera fila, ni la de -ed ni la palabra del libro; (2) en la segunda, la misma palabra que el juego acaba de mostrar como correcta.**

| | Camino, 1.ª partida | 20 partidas seguidas | Camino con historial a medias | Verbos "sabidos" |
|---|---|---|---|---|
| Receta de dos pasos | llega **65 %**, limpia 0 % | 10,5 % | 0 % | 0 |
| La mejor regla que encontré probando 6.800 combinaciones | llega **72 a 74 %**, limpia 11 a 13 % | 18,5 % | 0 % | 0 |
| El azar | 0 % | 0 % | 0 % | 0 |

Por qué funciona, en tres piezas medidas:
- **La segunda fila sale gratis.** En 30 de los 60 verbos el pasado y el participio son la misma palabra, y el juego acaba de mostrarla. Repetirla acierta el 100 % de las segundas filas en esos grupos. Los primeros 20 verbos del recorrido son todos así. El orden al azar no lo evita: da igual cuál se pida primero si son iguales.
- **La primera fila se estrecha sola.** Quitando la de -ed y la palabra del libro quedan una o dos opciones: 60 a 65 % de acierto (el azar, 33 %).
- **El regular cuesta un solo tropiezo.** Se falla su primera fila, el juego muestra `walked`, y la segunda ya se sabe. No se reencola. Un tropiezo suelto no es captura. Con los regulares apagados la misma regla ganaría 90 %; con ellos, 59 a 74 %. Frenan, no cierran.

Lo que lo limita: casi siempre llega "con verbos pendientes" (la pantalla final ahora lo dice), no pasa de los primeros tramos y el juego nunca le marca un verbo como sabido. Es el mismo tamaño de problema que el "-ed" de la primera ronda (63 %), pero con una receta menos obvia y ya etiquetada como victoria a medias.

Reproducir: perfiles "receta de dos pasos" y "mejor regla general", sección 9 de `bots.js`.

### 2. Media — el orden de las filas delata al regular

Le toca a **Mecánica** y **Construcción**.

Un verbo nuevo siempre pide pasado y luego participio. Un regular, la mitad de las veces pide primero el participio. Entonces, en las primeras partidas, **un verbo que nunca he visto y que empieza pidiendo el participio solo puede ser regular** → se escoge la de -ed. Lo vi en pantalla: `WORK (trabajar) → I have ___ participio` como primera fila.
Medido: con ese chivato el tramposo acierta la primera fila del regular 48 % de las veces en vez de 5 %, y llega al colegio 74 % en vez de 59 %.

### 3. Media — un regular fallado queda "pendiente" de nada

Le toca a **Mecánica** y **Construcción**.

Un regular fallado no vuelve en esa partida, no entra en "Lo que me cuesta" y no abre la siguiente. Pero la pantalla final lo cuenta como "te quedó 1 verbo por repasar". Jugador que sabe todos los irregulares y falla los regulares: 400 de 400 victorias salen "con verbos pendientes", solo por regulares.
Efecto en estudiantes buenos: al que acierta 95 % le sale el aviso en 21 % de sus victorias, y al de 90 % en 38 %. El aviso de "victoria honesta" pierde fuerza si sale tan seguido y por un verbo que no se va a repasar.

### 4. Media — con una regla por grupo se gana casi siempre, pero casi siempre esa regla *es* la lección

Para que lo decidan **Enseñanza** y el dueño; no lo cuento como falla.

| Grupo | Regla hecha a la medida | Llega | ¿Es trampa o es el patrón? |
|---|---|---|---|
| no cambian | "la palabra del libro, las dos veces" | 100 % | Es el patrón |
| -ew / -own | "ni el libro, ni la larga, ni la de -n; luego la otra" | 100 % | Casi el patrón |
| participio = base + N | "la corta sin -n; luego la otra" | 94 % | Casi el patrón |
| rebeldes | "ni -ed, ni libro, ni -n; luego la otra" | 92 % | Forma de las palabras |
| iguales, final en T | "ni -ed ni libro; luego la misma" | 64 a 68 % | Mitad patrón, mitad forma |
| pasado + N, -ought, i-a-u | — | 10 a 22 % | Aquí sí hay que saber |

Lo que dice de fondo: escogiendo entre tres letreros, el juego comprueba que el estudiante **reconoce** la forma y **sabe el patrón**, no que la recuerde sin ayuda. Para una exposición conviene decirlo así.

### 5. Media — "sabido" es casi inalcanzable y los descansos no mandan

Le toca a **Mecánica**.

Con 60 verbos y 8 turnos por partida, a cada verbo le toca cada 7 u 8 partidas. Tras **30 partidas perfectas** (una hora de juego) hay **0 de 60** verbos "sabidos": ninguno ha salido 5 veces. `have` sale en las partidas 1, 2, 16 y 24. La regla de descanso 1-2-4 está bien programada pero nunca llega a decidir nada. El menú va a decir "0 sabidos" durante semanas.
Ritmo del recorrido: quien no falla ve los 60 en 15 partidas; el de 90 %, en 17; el de 80 %, en 24; el de 70 %, en 35 (y en 20 partidas solo ha visto 36).

### 6. Baja — en la revisión todavía rinde algo leer las palabras

Le toca a **Enseñanza**. "Nunca -ed, la más corta" acierta 46,5 % a la primera; la mejor regla que además mira si hay have/has, 52,8 % (y esa ya es media lección). El sello de "todo a la primera" lo saca 1,8 % de las veces. En la segunda ronda el truco acertaba 62 % y sacaba el sello 9 %.

### 7. Bajas y de detalle

- **Nombres de grupo que predicen el error** (Enseñanza): "Participio = base + N" no sirve para *write → written* ni *ride → ridden*, y "pasado + N" no sirve para *wear → worn*. Los falsos `writen` y `woren` son justo lo que la regla del cartel produce.
- `thunk`, `brung`, `brang`, `boughten` existen como formas dialectales; un profesor puede preguntar.
- La pantalla final repite la misma línea cuando se falla lo mismo varias veces (vi "MAKE, pasado…" cuatro veces).
- En el tablero del puente la palabra respondida queda pegada a las vecinas ("family`lived`here").
- Contando carriles se sigue acertando 48 % de los letreros (no gana: 0 a 0,6 %).

### Lo que se arregló desde la segunda ronda (comprobado)

- **La partida sin final:** quien esquiva el libro siempre termina (0:46 de media, 0 victorias de 1.000). Perseguir estrellas da como mucho 2.130 puntos; el perfecto hace 11.580. Antes, 27.090 sin acertar nada.
- La oración de *let* (ya no trae `left`) y la de *rise* (ya no trae `raised`).
- `drank` y `sung` ya no están entre los falsos de participio y pasado.
- El guardado dañado: un `descanso` negativo ya no hace desaparecer el verbo.
- "Lo que me cuesta" con un solo verbo ya no da `make make`.

## Regulares y oraciones, con ojo de profesor

**Regulares (12):** walk, work, play, want, look, live, talk, call, help, start, open, watch. Bien escritos (*live → lived*, no "liveed"). Ningún falso es una forma aceptada: son la base, un cambio de vocal inventado (`wolk`, `tolk`, `stort`) o un -en inventado (`walken`). Algunos son palabras reales de otra cosa (`plaid`, `went`, `cell`, `lave`, `liven`), lo cual sirve. No se colaron verbos de doble forma (*burn, learn, dream*), buena decisión.

**Oraciones (144), leídas una por una:** ninguna queda correcta con uno de sus falsos. Todas las de pasado llevan su marca de tiempo; todas las de participio llevan have/has pegado al hueco y ninguna marca de tiempo terminado ("today" en *I have walked a lot today* está bien). Suenan naturales y el vocabulario es básico. Las traducciones son correctas y colombianas ("hace ocho días", "cogí el bus", "le ha dado gripa"). GET sigue sin oración de participio, a propósito.
Único reparo: `We have ___ about it` trae `thunk`, que existe en inglés informal.

## En el navegador (puerto 5195)

| Qué | 360×740 | 740×360 | 1280×720 |
|---|---|---|---|
| Consola sin errores | sí | sí | sí |
| Las 144 oraciones caben en el tablero, máximo 2 renglones, sin desplazar | no medido aquí | sí, 144 de 144 | sí, 144 de 144 |
| Letra de los letreros de la carrera | 22,5 px en la fila que vi (mínimo 15,8) | 18,4 a 18,7 px con palabras de 9 letras (mínimo 16,9) | 41,5 px en la fila que vi (mínimo 29,3) |

- **Un regular en carrera:** sale sin anunciarse; la pizarra dice `HELP (ayudar) → Yesterday I ___ pasado` y los letreros `helped / help / helpt`.
- **Error en el puente:** escogí `liven`; el letrero se pone rojo, el correcto verde, el tablero dice `in 2010 → pasado: lived · no liven · volverá al final`, el monstruo se ríe. La oración volvió al final marcada "otra vez".
- **Final con verbos pendientes:** fallando siempre el pasado de *make*, el título dice `¡LLEGASTE! Te quedó 1 verbo por repasar`, y el texto de copiar `llegó, con 1 verbo por repasar`. Los regulares van aparte: "Regulares infiltrados: estos sí llevan -ed".
- **Puente → resultado:** "Ver mi carrera" lleva a la pantalla final (en la segunda ronda no lo había tocado).
- **Salir con "Menú" a mitad de carrera:** guardó los errores (`tell` quedó pendiente con su falso `teld`) y el menú pasó a "Lo que me cuesta: 2 verbos".
- El guardado del 5195 estaba vacío antes y quedó vacío; no toqué el 5190. Servidor apagado.

## Lo que NO probé

- **Celular real, sonido, voz en inglés, doble clic y fluidez:** igual que en las dos rondas anteriores. Mis capturas llegaron con un cuadro de atraso porque el panel estaba oculto; lo que afirmo de pantalla lo comprobé leyendo la página, no solo mirando.
- **Si un estudiante descubriría la receta por su cuenta.** Mido que existe y cuánto rinde, no qué tan probable es que alguien la encuentre.
- **El mejor tramposo sobre los datos de la segunda ronda:** no guardé copia de aquella lista de verbos. La comparación de esa fila es entre la primera ronda y esta.
- **"El mejor tramposo" es el mejor de una familia** (puntos por: termina en -ed, es la del libro, es la más corta, la más larga, termina en -n, y lo que mostró la primera fila). Puede haber uno mejor fuera de esa familia.
- La gran revisión de tramo solo la abrí una vez (tramo 4, 740×360). El puente en 1280×720 lo medí pero no lo miré.
- No volví a medir los pendientes pegados al principio ni la letra en pantallas bajitas (hallazgos 5 y 11 de la primera ronda).

---


# Segunda ronda (60 verbos, 9 grupos, revisión con oraciones)

**Veredicto en una línea:** las correcciones funcionaron (el truco del "-ed" pasó de ganar 63 % a 5,6 %, la partida sin final por fallar siempre un verbo ya termina, salir con "Menú" ya guarda) y la revisión con oraciones está bien hecha; quedan **4 de 43 requisitos sin cumplir**, y uno es nuevo y nació de un arreglo: **quien no recoge el libro puede quedarse jugando para siempre y sumando puntos**.

Cómo repetirlo: `node pruebas/bots.js` (un minuto). La primera ronda queda más abajo, sin tocar: el antes y el después.

## Qué era regla vieja y qué es falla real

De los 8 "no cumple" que vio el coordinador al correr mi banco viejo sobre el juego nuevo:

| Lo que marcaba | Qué era | Ahora |
|---|---|---|
| El libro nunca sale en el carril del jugador | **Regla vieja.** Ahora el libro no recogido vuelve a propósito en su carril | Requisito cambiado: la primera vez sale en otro carril (0 fallos de 667.755) y, si no se recoge, vuelve en el del jugador (717.909 de 717.909). Cumple |
| El quieto pierde a los 17 s | **Regla vieja.** No recoger ya no es error | El quieto sigue perdiendo siempre (0 de 3.000), ahora a los 43 s y por los letreros. Cumple |
| Aprendices lejos de lo calculado en DISENO | **Regla vieja.** La partida ahora tiene tope | Ya no se compara con DISENO; se mide (tabla abajo). Cumple "quien más sabe, más gana" |
| Azar llega a 3 turnos el 1,1 % (tope 1 %) | **Regla vieja, a medias.** El libro vuelve solo, así que el azar dura más | Sigue sin ganar (0 de 1.000). Subí el tope a 3 %. Cumple |
| Piso de 2 minutos | Era mío y sobraba | Pasa a aviso (el perfecto tarda 1:42) |
| "Lo que me cuesta" da `make make` | **Mi banco probaba un caso extremo.** El arreglo está en `logica.js` y funciona | Ver punto 3 |
| Un tramposo gana más del 1 % en el camino | **Falla real**, mucho menor | 5,6 % (antes 63,3 %) |
| Un tramposo gana más del 1 % en un grupo | **Falla real**, menor | 42,6 % en "pasado-n" (antes 100 % en "no cambian") |

## Los 4 requisitos que no se cumplen

**1. Nuevo y el más serio: la partida vuelve a no tener final, por otra puerta.** Le toca a **Mecánica** y **Construcción**.
No recoger el libro ya no es error, y el libro vuelve cuantas veces haga falta. Quien se aparta cada vez no pierde, no gasta turnos y no termina: 50 de 50 partidas seguían a los 15 minutos. No hace falta mala intención: los jugadores que cambian de carril sin mirar (alternar, girar, perseguir estrellas) quedaron atrapados así en 815 de cada 1.000 partidas. Y mientras tanto siguen saliendo estrellas: persiguiéndolas se llega a 27.090 puntos en 15 minutos, contra 8.880 del jugador perfecto. El récord se puede inflar sin acertar un verbo.
El tope de 12 turnos no lo frena porque un libro no recogido no cuenta como turno. Reproducir: perfiles "esquiva el libro siempre" y "solo persigue estrellas".

**2. El truco "sin -ed" todavía gana algo en el modo principal:** 5,6 % de las primeras partidas (7,5 % en otra tanda de semillas), 11 % en el grupo "no cambian". Acierta 53 % de los letreros (el azar, 32 %). Tres de cada cinco de esas victorias son con verbos pendientes, es decir, gracias al tope de turnos. Le toca a **Enseñanza** (falsos) y **Mecánica** (tope). Ya no es grave: antes ganaba 63 %.

**3. "Sin -ed" con memoria del turno gana 42,6 % en el grupo "pasado-n"** (9,4 % en "participio en N", 11,8 % en "Lo que me cuesta"). En ese grupo acierta 77 % de los letreros: descarta la terminada en -ed, toma la más corta como pasado y la otra como participio. Es el peor caso que encontré. Le toca a **Enseñanza**.

**4. En la revisión, un truco acierta 62 % a la primera** (el azar, 33 %). El truco: descartar lo que termine en -ed y la forma que ya se vio en el libro. En 30 de 120 oraciones eso deja solo la correcta; en el resto deja dos. Con él se saca el sello de "todo a la primera" en 9 % de las revisiones (al azar, 0 de 6.000). El tope de "menos de la mitad" lo puse yo; como en la revisión no se pierde, lo considero **medio**, no grave. Le toca a **Enseñanza**: 56 oraciones traen la forma base entre los falsos.

## ¿El tope de 12 turnos regala victorias a quien no sabe?

**No a quien no sabe; sí a quien sabe a medias.**

| Perfil | Ganaba (1.ª ronda) | Gana ahora | De sus victorias, con algún verbo pendiente | Dura si gana |
|---|---|---|---|---|
| Aprendiz 50 % | — | 0,6 % | 83 % | 2:41 |
| Aprendiz 60 % | — | 6,1 % | 73 % | 2:39 |
| Aprendiz 70 % | 17,4 % | 25,7 % | 60 % | 2:33 |
| Aprendiz 80 % | 56,5 % | 62,5 % | 35 % | 2:25 |
| Aprendiz 90 % | 92,9 % | 93,5 % | 9 % | 2:08 |
| Aprendiz 95 % | 99,0 % | 99,1 % | 1 % | 1:56 |
| Azar / azar que recoge | 0 % | 0 % | — | — |
| Cuenta carriles | 0 a 0,5 % | 0,4 a 1,8 % según el grupo | casi todas | 2:48 |

Quien acierta 7 de cada 10 gana ahora una de cada cuatro partidas en vez de una de cada seis, y más de la mitad de esas victorias llegan con verbos sin aprender. No es grave (esos verbos quedan pendientes y abren la partida siguiente), pero conviene que la pantalla final no diga "lo lograste" igual que a quien los aprendió todos. Lo bueno: ya ninguna partida ganada pasa de 2:50 (antes hasta 5:10).

## "Lo que me cuesta" con un solo verbo fallado

El arreglo **está en `logica.js` y funciona**: rellena con verbos ya vistos. Con un verbo fallado y tres vistos da `make have say get make have say get`; en el navegador, con uno fallado y dos vistos, dio `make have say make have say`.
Mi banco seguía viendo `make make` porque le daba un historial con **un solo verbo en total**: no hay con qué rellenar. A ese caso se llega de verdad (fallar el primer verbo y salir con "Menú", que ahora guarda), pero es raro. Lo dejé como aviso, no como requisito.

## La revisión con oraciones

**Datos (`oraciones.js`): 0 problemas en 120 oraciones.** Ids únicos, verbo existente, un solo hueco, señal dentro del texto, 2 falsos distintos de la correcta, nunca dos falsos en -ed, textos de máximo 30 y traducciones de máximo 34, todo pasado con marca de tiempo, todo participio con have/has pegado al hueco y sin marca de tiempo, sin did ni preguntas.

Con ojo de profesor leí las 120:
- **Una dudosa:** `They have ___ us in.` (let) trae `left` como falso, y "They have left us in" se puede leer como inglés correcto con otro sentido. Conviene cambiar ese falso. Le toca a **Enseñanza**.
- `Prices have ___ again.` (rise) con el falso `raised`: es incorrecto, pero es un error que cometen hasta hablantes nativos; puede dar discusión.
- GET no tiene oración de participio (tiene dos de pasado). Está anotado como decisión, por `gotten`.
- En las demás, la marca de tiempo o el have/has dejan una sola respuesta posible.

**Lógica (`VJ.crearRevision`), 6.000 revisiones (6 tramos × 1.000 semillas):**

| Comprobación | Resultado |
|---|---|
| Quien acierta todo termina en 6 pasos y con sello | 6.000 de 6.000 |
| Quien falla todo termina, sin sello, y cada oración vuelve una sola vez (12 pasos) | 6.000 de 6.000 |
| Al azar siempre termina, nunca más de 12 pasos | 6.000 de 6.000 |
| Misma semilla, mismo orden; otra semilla, otro orden | 6.000 de 6.000 |
| Mitad pasado y mitad participio, en los 6 tramos | 100 % en cada tramo; ningún verbo repetido |
| Posición de la correcta | 33,9 % / 33,3 % / 32,8 % |
| Al azar, acierto a la primera | 33,2 % |
| Puente tras la carrera (4 oraciones) y fallados primero | 200 de 200 y 200 de 200 |
| Entradas raras (un verbo, ids inventados, cantidad 0 o 500, elegir sin destapar) | no rompe |

## En el navegador (360×740, puerto 5195)

- Consola sin errores.
- **Salir con "Menú" a mitad de carrera ya guarda** (era mi hallazgo 3): quedaron los 3 verbos jugados y `make` como pendiente con su falso `maked`.
- **Una carrera ganada pasa al puente:** salió "Revisión en el puente, 1 de 4", fallé una a propósito, volvió marcada "otra vez", y al terminar aparecieron los botones "Copiar resultado" y "Ver mi carrera".

## Lo que sigue igual que en la primera ronda

Los hallazgos 5 (pendientes pegados al principio), 6 (los descansos no crecen), 7 (contando carriles se acierta 48 %), 10 (guardado dañado) y 11 (letra en pantallas bajitas) no los volví a medir a fondo; el banco sigue mostrando los mismos números para 7 y 10.

## Lo que NO probé en esta ronda

- No toqué el botón "Ver mi carrera": vi que aparece, no que lleve al resultado.
- La gran revisión de un tramo en pantalla (solo la del puente de 4 oraciones).
- Celular real, sonido, voz, doble clic y fluidez: igual que antes.
- Las oraciones las revisé leyéndolas una vez, con prisa; un profesor debería leerlas con calma.
- Si las 120 oraciones caben en pantalla a buen tamaño: solo vi una.

---

# Primera ronda (31 verbos, 6 grupos)


**Veredicto en una línea:** el juego es sólido por dentro (no se rompe, no se gana al azar ni quedándose quieto, el perfecto gana siempre y los números de Mecánica son ciertos), pero **28 de 33 requisitos duros se cumplen y 5 no**; el más serio: en varios grupos se puede ganar sin saber un solo verbo con el truco "nunca la que termina en -ed".

Cómo repetirlo: `node pruebas/bots.js` desde la raíz (25 segundos, 1.000 partidas por perfil, siempre los mismos números). Termina con código 1 mientras haya algún requisito duro sin cumplir.

Todo lo que sigue lo medí yo con mis propios jugadores automáticos sobre `js/logica.js`. No di por cierto nada de lo que dicen las otras bitácoras.

## 1. Requisitos duros

| # | Requisito | ¿Cumple? | Número medido |
|---|---|---|---|
| 1 | Datos de `verbos.js`: ids y orden únicos, grupos que existen, ningún falso igual a la correcta, sin repetidos, máximo 9 letras | cumple | 0 problemas en 31 verbos; la palabra más larga tiene 8 letras |
| 2 | Quieto pierde siempre, arrancando en cada carril | cumple | 0 ganadas de 3.000; pierde a los 17,45 s |
| 3 | Azar no gana | cumple | 0 de 1.000 |
| 4 | Azar casi nunca llega a 3 turnos limpios | cumple | 0,1 %; dura 25 s |
| 5 | Azar que sí recoge el verbo: no gana y casi nunca llega a 3 turnos | cumple | gana 0 %; 3 turnos 0,3 % |
| 6 | Perfecto gana siempre (primera partida) | cumple | 1.000 de 1.000 |
| 7 | Perfecto gana siempre en los tres modos y los seis grupos | cumple | 9.000 de 9.000 |
| 8 | Aprendices: victorias a menos de 5 puntos de lo que calculó Mecánica | cumple | mayor diferencia: 0,5 puntos |
| 9 | Ningún tramposo gana más del 1 % en el modo principal | **NO cumple** | "nada con -ed, la más corta" gana 63,3 % de las primeras partidas |
| 10 | Ningún tramposo gana más del 1 % en ningún modo o grupo | **NO cumple** | el mismo truco gana 100 % en "Los que no cambian" |
| 11 | La correcta se reparte parejo entre carriles | cumple | 33,34 % / 33,35 % / 33,31 % en 1.169.265 filas |
| 12 | La correcta nunca cae 3 veces seguidas en el mismo carril | cumple | 0 veces |
| 13 | Ninguna fila con dos palabras iguales o un letrero vacío | cumple | 0 |
| 14 | La correcta está siempre en la fila y ningún falso es la correcta | cumple | 0 fallos |
| 15 | El verbo base nunca sale en el carril del jugador | cumple | 0 de 614.246 |
| 16 | Un verbo fallado vuelve con el mismo falso que se eligió | cumple | 214.612 veces sí, 0 no |
| 17 | El fallado vuelve en la misma partida tras 2 verbos | cumple | 30 veces tras 2 verbos, 2 veces tras 1 (cuando quedaban pocos) |
| 18 | Lo fallado vuelve en la partida siguiente y un fallado la abre | cumple | 35 de 35 |
| 19 | Con 3 o más pendientes entran como mucho 2 nuevos | cumple | siempre |
| 20 | Un verbo acertado sale en menos partidas que uno que se falla | cumple | 2 partidas de 12 contra 12 de 12 |
| 21 | La regla de descanso da 1, 2 y 4 partidas | cumple | 3 aciertos→1, 4→2, 5→4 |
| 22 | Un verbo que se sigue fallando está en todas las partidas | cumple | 36 de 36 |
| 23 | Los verbos nuevos entran en el orden de Enseñanza, sin saltos | cumple | los 31, en orden |
| 24 | Nunca más de 4 verbos nuevos por partida | cumple | máximo 4 |
| 25 | `resumen()` lista lo que costó, con lo elegido y lo correcto | cumple | 35 fallos revisados |
| 26 | En 20 partidas se ven los 31 verbos | cumple | 31 de 31 en la partida 12 (estudiante con 4 verbos difíciles); quien no falla, en la 8; el más lento de los que aciertan 70 %, en la 20 |
| 27 | Todas las partidas del modo principal tienen 8 turnos | cumple | 30 de 30 |
| 28 | Ninguna cola empieza con el mismo verbo dos turnos seguidos | **NO cumple** | "Lo que me cuesta" con un solo verbo fallado: `make make`, partida de 30 s |
| 29 | Tope de 4 minutos (95 % de las ganadas) | cumple | la peor: 3:28 |
| 30 | Piso de 2 minutos | **NO cumple** | perfecto 1:42; aprendiz 90 % 2:10 |
| 31 | Una partida siempre termina | **NO cumple** | quien falla siempre el mismo pasado sigue jugando a los 15:00 |
| 32 | Robustez: misma semilla, pasos de tiempo distintos, historiales y modos raros, `mover` fuera de borde | cumple | 18 de 18 pedidas (2 extra con datos dañados fallan, ver hallazgo 10) |
| 33 | Peligro: dos errores seguidos gastan al profesor y el tercero es captura | cumple | comprobado jugada a jugada |

## 2. Tabla de bots

Primera partida del modo principal, 1.000 partidas por perfil (3.000 los aprendices).

| Perfil | Gana | Dura (media) | Turnos limpios (de 8) | Llega a 3 turnos | Letreros acertados | Cómo pierde |
|---|---|---|---|---|---|---|
| Quieto (izquierda, centro, derecha) | 0 % | 0:17 | 0 | 0 % | — | sin recoger el verbo, 100 % |
| Azar | 0 % | 0:25 | 0,12 | 0,1 % | 34 % | sin recoger 62 %, pasado 19 %, participio 19 % |
| Azar que sí recoge | 0 % | 0:39 | 0,28 | 0,3 % | 32 % | pasado 55 %, participio 45 % |
| **Perfecto** | **100 %** | 1:42 | 8 | 100 % | 100 % | no pierde |
| Aprendiz 70 % | 17,4 % | 1:47 (2:46 si gana) | 3,9 | 57 % | 70 % | mitad y mitad |
| Aprendiz 80 % | 56,5 % | 2:12 (2:33 si gana) | 6,3 | 84 % | 80 % | mitad y mitad |
| Aprendiz 90 % | 92,9 % | 2:08 (2:10 si gana) | 7,9 | 97 % | 90 % | pasado 57 % |
| Aprendiz 95 % | 99,0 % | 1:56 | 8,1 | 99,5 % | 95 % | — |
| Tramposo: siempre el mismo carril (izq / centro / der) tras recoger | 0 % | 0:36 | 0,14 | 0 % | 28 % | pasado o participio |
| Tramposo: se queda donde recogió | 0 % | 0:40 | 0,19 | 0,9 % | 34 % | pasado 59 % |
| Tramposo: alterna o gira sin leer nada | 0 % | 0:29 | 0,18 | 0,2 % | 33 % | sin recoger 44 % |
| Tramposo: recoge y alterna / gira / zigzag | 0 % | 0:40 | 0,36 | 1,4 a 2,0 % | 33 % | pasado 57 % |
| Tramposo: solo persigue estrellas | 0 % | 0:28 | 0,10 | 0 % | 32 % | sin recoger 45 % |
| Tramposo: estrellas, recoge, no lee | 0 % | 0:37 | 0,16 | 0,7 % | 30 % | mitad y mitad |
| Tramposo: cuenta carriles (no lee) | 0 % | 0:54 | 0,86 | **10,8 %** | **48 %** | pasado 58 % |
| **Tramposo: "nada con -ed, la más corta"** | **63,3 %** | 2:42 | 8,3 | 100 % | 82 % | participio 63 % |
| **Tramposo: "sin -ed" + memoria del turno** | **48,3 %** | 2:13 | 6,9 | 100 % | 81 % | participio 91 % |

Aprendices contra `DISENO.md`: 17 / 56 / 93 / 99 % calculado, 17,4 / 56,5 / 92,9 / 99,0 % medido. **Mecánica acertó.** Sin el comodín del profesor: 5,4 % y 73,8 % (DISENO decía 6 % y 73 %).

Por modo y grupo (1.000 partidas cada casilla):

| Modo | Perfecto | Aprendiz 90 % | Aprendiz 70 % | Azar recoge | Cuenta carriles | "Sin -ed" | "Sin -ed" + memoria |
|---|---|---|---|---|---|---|---|
| Camino, 1.ª partida | 100 % | 92,8 % | 17,2 % | 0 % | 0,3 % | **64,5 %** | **50,0 %** |
| Grupo: pasado y participio iguales | 100 % | 93,1 % | 16,0 % | 0 % | 0,1 % | **77,4 %** | **47,7 %** |
| Grupo: los rebeldes | 100 % | 92,7 % | 15,5 % | 0 % | 0,2 % | 0 % | **20,7 %** |
| Grupo: los que no cambian | 100 % | 92,5 % | 16,3 % | 0 % | 0,3 % | **100 %** | **100 %** |
| Grupo: participio en N | 100 % | 92,8 % | 18,1 % | 0 % | 0,2 % | 0 % | **100 %** |
| Grupo: -ought / -aught | 100 % | 93,8 % | 15,9 % | 0 % | 0,1 % | 0 % | 0 % |
| Grupo: i – a – u | 100 % | 92,7 % | 14,6 % | 0 % | 0,1 % | 0,7 % | **12,8 %** |
| Lo que me cuesta (10 verbos) | 100 % | 93,1 % | 17,1 % | 0 % | 0,5 % | 0 % | 0 % |
| Camino con historial a medias | 100 % | 92,7 % | 17,5 % | 0 % | 0,3 % | 0 % | 0 % |

Duración de las partidas ganadas: perfecto 1:42 siempre; aprendiz 95 % media 1:56 (95 % antes de 2:28); 90 % media 2:10 (antes de 2:56, la más larga 4:48); 80 % media 2:33 (antes de 3:28, la más larga 5:10); 70 % media 2:46 (antes de 3:52, la más larga 5:02).

## 3. Hallazgos, por gravedad

### Importantes

**1. Se gana sin saber verbos con el truco "nunca la que termina en -ed".** Le toca a **Enseñanza** (los falsos) con **Mecánica**.
Ninguna forma correcta termina en -ed y el 61 % de los falsos (113 de 186) sí. En las filas tal como salen la primera vez, la correcta es la *única* sin -ed en 15 de 62; añadiendo "y si quedan dos, la más corta", salen 34 de 62 (55 %). Por grupo: no cambian 8 de 8, iguales 13 de 14, participio en N 8 de 16.
Un jugador que solo aplica eso gana el 63 % de las primeras partidas, el 100 % del grupo "no cambian" y el 77 % del grupo "iguales". Si además recuerda que "la que no fue el pasado es el participio", gana el 100 % del grupo "participio en N".
Lo que lo limita: en 20 partidas seguidas ese jugador gana la primera la mitad de las veces pero solo el 4 % del total, y el juego nunca le marca un verbo como "sabido". Es decir, el truco abre la puerta, no se lleva el juego.
Cómo verlo: `node pruebas/bots.js`, perfiles "nada con -ed" (semillas 1 a 1.000) y la tabla "¿Se puede acertar sin saber el verbo?". Ojo de profesor: "lo irregular no lleva -ed" es justo media lección; el problema es que el juego lo premia como si fuera saberse el verbo. Bastaría con que cada fila llevara un falso tentador sin -ed (`tolden`, `fand`, `brang`, `putten`, la otra forma del verbo) entre los dos primeros.

**2. Una partida puede no acabar nunca.** Le toca a **Mecánica**.
Quien sabe todo menos un pasado y lo falla cada vez nunca pierde (un solo error por vuelta no es captura) ni gana (el verbo vuelve cada 2 turnos). Medido: a los 15 minutos seguía; 65 turnos, 31 del mismo verbo. Reproducir: semilla 5, falla siempre el pasado de `say`. No hay tope de tiempo ni de repeticiones. Un estudiante real acabaría aprendiéndolo, pero en una demostración ante profesores una partida sin final es un riesgo.

**3. Salir con el botón "Menú" (o Escape) a mitad de partida no guarda nada.** Le toca a **Construcción** (y que Mecánica diga qué se quiere).
Visto en el navegador: jugué 71 segundos, 3 verbos completos y 2 errores, toqué "Menú": lo guardado quedó idéntico a antes. Los errores de esa partida no cuentan y esos verbos no quedan como pendientes. Quien vaya perdiendo puede salirse y su historial queda limpio; y quien cierre la pestaña pierde lo practicado.

### Medios

**4. "Lo que me cuesta" con un solo verbo fallado da una partida de 30 segundos con el mismo verbo dos veces seguidas** (`make make`), y termina con "¡Llegaste al colegio!". Rompe la regla "nunca dos turnos seguidos del mismo verbo". Visto en el navegador y en `bots.js` (modo repaso, semilla 3). Además, el botón nunca se vacía: cuenta los verbos fallados *alguna vez*, aunque ya se hayan corregido. Le toca a **Mecánica** y **Construcción**.

**5. Los verbos pendientes salen pegados al principio y eso puede costar la partida en 48 segundos.** El estudiante de prueba con cuatro verbos difíciles perdió la partida 9: cola `make go buy…`, falla el primero (tropiezo), el segundo (lo salva el profesor) y el tercero (captura). "Abrir con lo fallado" y "dos errores cercanos son captura" chocan. Reproducir: cadena de la sección 5 de `bots.js`, partida 9. Le toca a **Mecánica**.

**6. Los descansos 1-2-4 existen, pero casi no son lo que decide cuándo vuelve un verbo.** La regla está bien programada (requisito 21). En la práctica manda otra cosa: caben 8 turnos por partida y hay 31 verbos.
- Mientras entran verbos nuevos, uno ya acertado puede esperar mucho: `have` salió en las partidas 1 y 2 y no volvió hasta la 13.
- Cuando ya se vieron los 31, a cada verbo le toca cada 4 partidas más o menos, se sepa mucho o poco: `have` en las partidas 1, 2, 8, 13, 17, 21, 24, 28. Los huecos no crecen.
Sí se cumple lo esencial que pidió el dueño: lo fallado vuelve antes (en la misma partida y en todas las siguientes) y lo acertado se espacia. Lo que no se ve es el "cada vez más lejos" que promete `DISENO.md`. Le toca a **Mecánica** con **Enseñanza**.

**7. Los carriles se pueden adivinar a medias sin leer.** Como la correcta sale 2 veces por carril cada 6 filas y nunca 3 seguidas, solo repite carril el 20 % de las veces (con dados limpios sería 33 %). Un jugador que solo cuenta carriles acierta el 48 % de los letreros (el azar, 32 %) y llega a 3 turnos el 10,8 % de las veces (el azar, 0,3 %). No gana (0 a 0,5 %), pero es ventaja real. Ni el carril del libro ni las estrellas delatan nada. Le toca a **Mecánica**.

**8. Duración.** El tope de 4 minutos se cumple para quien acierta 80 % o más. El piso de 2 no: el perfecto tarda siempre 1:42 y quien acierta 95 %, 1:56. Y hay colas largas: 1,4 % de las victorias del aprendiz de 80 % y 2,3 % de las del de 70 % pasan de 4:00 (hasta 5:10). Le toca a **Mecánica**.

### Menores

**9. Poner `comodinInicial: 0` no apaga al profesor**, como dice `AGENTES.md`: se sigue recargando con 6 aciertos. Quien acierta 90 % gana 86 % así, contra 74 % sin profesor de verdad (hay que poner también `comodinMaximo: 0`). Le toca al **coordinador** o a **Mecánica** (corregir la frase).

**10. Con un guardado dañado, un verbo puede desaparecer para siempre.** Si `descanso` llega negativo o con decimales, ese verbo no vuelve a salir en el modo principal (0 de 10 partidas) y el número no se corrige solo. El juego nunca escribe eso por su cuenta: solo pasa con datos tocados a mano. No se rompe nada más: textos, nulos, arreglos e ids inventados se aguantan bien. Le toca a **Construcción**.

**11. En pantallas bajitas la letra baja de 16 px.** El tamaño sale del menor entre el ancho y el 55 % del alto. En 360×740 la letra más pequeña es 17 px (bien). En 320×480 medí 12,6 px para las palabras más largas. Un celular de 360 de ancho con menos de 655 px de alto visible ya queda por debajo. Le toca a **Construcción**.

**12. Datos, con ojo de profesor de inglés.** Las tres formas de los 31 verbos están bien escritas y los significados son correctos. Para que **Enseñanza** lo confirme:
- `drank` como falso del participio de *drink* y `sung` como falso del pasado de *sing*: algún diccionario (Merriam-Webster) los registra como variantes. Son los errores que se quieren enseñar, pero un profesor puede objetarlo.
- `thunk`, `brung`, `brang`, `boughten`, `drunken` existen como formas dialectales o adjetivos; ninguna es la forma estándar.
- Varios falsos son palabras reales de otro verbo (`founded`, `sawed`, `singed`, `putted`, `lived`, `thought`, `bought`): correcto y útil, dos ya lo explican en la pista.
- `gotten` no aparece nunca, como se prometió.

**13. Detalles.** El modo grupo con un id que no existe juega en silencio el primer grupo; "repaso" sin nada que repasar juega el camino (y lo dice en `estado.modo`). Jugar un grupo o un repaso también descuenta descansos de los demás verbos. `DISENO.md` dice que el perfecto tarda 1:40 y el azar 24 s; son 1:42 y 25 s.

### Lo que salió bien (y no era obvio)

- Misma semilla, misma partida (200 de 200). Pasos de tiempo de 1/120 a 1/4 de segundo dan exactamente lo mismo.
- `mover` 1.000 veces por cuadro y con valores absurdos: el carril nunca salió de 0–2.
- Las estrellas no delatan la respuesta y perseguirlas no ayuda ni estorba.
- En el navegador (360×740 y 740×360): consola sin errores; toque izquierdo y derecho, deslizar, flechas y A/D funcionan; el progreso se guarda al terminar y la segunda partida lo usa (abrió con `make`, que había fallado, y con `maked` entre las opciones); "Borrar mi progreso" pide confirmar y borra; con el guardado bloqueado el juego sigue y avisa; con un guardado ilegible arranca limpio; "Copiar resultado" funcionó por el camino de respaldo (cuadro de texto).

## 4. Lo que NO pude probar

- **Un celular de verdad.** Usé ventanas de tamaño de celular; los "toques" fueron clics del ratón.
- **Sonido y voz en inglés.** No oí nada (mi navegador no tiene voz en inglés).
- **Abrir con doble clic** (`file://`). Solo lo probé servido en el puerto 5195.
- **El juego corriendo de corrido.** El panel de mi navegador estaba oculto y el juego no avanzaba solo: lo adelanté a mano. No puedo decir si va fluido.
- **El guardado bloqueado desde el arranque.** Simulé que falla al escribir; que falle al leer solo lo revisé leyendo el código.
- **El portapapeles real.** Mi navegador lo negó; solo vi el respaldo.
- **Pantalla grande (1280×720) y la lista de grupos:** no las medí bien (la lectura salió del tamaño anterior).
- **Mis bots deciden en cuanto ven el objeto.** No miden si un humano alcanza a leer y moverse en 3,5 a 4,5 segundos.
- Lo guardado en el puerto 5195 estaba vacío antes y lo dejé vacío. No toqué el 5190 ni las otras pestañas. El servidor quedó apagado.
