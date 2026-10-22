# Postura de primera ronda — El probador escéptico y el abogado del salón real

Hablo con dos sombreros que se necesitan el uno al otro:
1. **El probador escéptico:** mi trabajo es inventar jugadores automáticos que no saben ni una palabra de inglés, pero que miran las letras, cuentan carriles y usan la memoria inmediata para ganar haciendo trampa. Si un bot sin inglés pasa, un estudiante vivo también pasa sin aprender.
2. **El abogado del salón real:** defiendo al profesor que tiene 30 adolescentes inquietos, 15 minutos de reloj, un solo proyector o celulares prestados de pantalla pequeña (`360×740`), sin internet confiable, sin cuentas de correo y con la obligación de demostrar con números que la actividad sirvió para aprender y no solo para jugar.

---

## El diagnóstico desde los números: por qué hoy un tramposo gana entre 65 % y 74 %

Cerramos el viejo truco de "nunca escoger la palabra terminada en `-ed`" (bajó de 63,3 % a 0,2 % gracias a los verbos regulares infiltrados y a mejores distractores). Pero al probar **6.800 combinaciones de reglas mecánicas sin saber inglés**, encontré una puerta abierta igual de grande en la primera carrera:

- **La "receta de dos pasos"** llega al colegio el **65 %** de las veces sin saber un solo verbo:
  1. **En la 1.ª fila:** no escojas ni la palabra que termina en `-ed` ni la palabra exacta que salió en el libro. Eso reduce el azar de 33 % a **60–65 %** de acierto.
  2. **En la 2.ª fila:** escoge exactamente **la misma palabra que el juego acaba de mostrar como correcta** tras pasar la primera fila.
- **El mejor tramposo mecánico** (que además aprovecha un chivato: si un verbo desconocido empieza pidiendo el participio en vez del pasado, seguro es regular y entonces sí escoge `-ed`) llega al colegio entre el **72 % y el 74 %** de las veces (y entre **11 % y 13 %** con victoria limpia, sin verbos pendientes).

### ¿Por qué funciona este atajo? Tres piezas medidas:
1. **La segunda fila sale gratis en la mitad del juego:** en **30 de los 60 verbos** (y en los **primeros 20 verbos seguidos** del recorrido, tramos 1 y 2) el pasado y el participio son la misma palabra (`made/made`, `had/had`, `left/left`, `felt/felt`). Cuando el jugador pasa la primera pancarta —acierte o falle—, el juego le muestra la respuesta correcta de la primera fila. Dos segundos después viene la segunda pancarta pidiendo la otra forma: repetir la palabra recién vista acierta el **100 %** de las segundas filas en esos 30 verbos. Cambiar el orden entre pasado y participio no sirve de nada cuando ambos son idénticos.
2. **El orden de las filas delata al regular infiltrado:** hoy un verbo irregular nuevo siempre pregunta `pasado → participio` (0 excepciones en 815.323 turnos medidos), mientras que un verbo regular pregunta primero el participio el **50 %** de las veces. Ese detalle le regala al tramposo la mitad de los regulares (pasa de 5 % a 48 % de acierto en su primera fila, subiendo sus victorias de 59 % a 74 %).
3. **Reconocer entre 3 carteles no prueba que el verbo esté en la cabeza:** incluso en el puente, descartar `-ed` y mirar la longitud acierta el **46,5 %** a la primera (y mirar si hay `have/has` sube a **52,8 %**). El estudiante nunca tiene que sacar la palabra de su memoria sin verla escrita antes.

---

## Respuestas a las 5 preguntas del debate

### 1. Producir sin opciones (en celular `360×740`, computador y proyector)

**Mirada del salón real:**
Nunca abramos el teclado nativo del celular (`QWERTY` del sistema). En una pantalla de `360×740`, el teclado del teléfono se come la mitad inferior de la pantalla, tapa al personaje o la oración, dispara el autocorrector en español (que cambia `went` por `wen` o `bought` por cualquier cosa) y arruina el ritmo. Tampoco obliguemos a usar micrófono: en un salón con 30 muchachos gritando, el micrófono oye al vecino, y en muchos navegadores sin internet el reconocimiento de voz ni siquiera arranca (solo debe existir como botón opcional para pronunciar en casa, nunca como requisito para avanzar).

**Mirada del probador escéptico (la solución que baja el atajo a < 1 %):**
La producción debe hacerse con **fichas de letras en pantalla (un banco de 6 a 8 letras o sílabas grandes tocables)** dentro del propio lienzo del juego, y en computador también permitiendo teclear las letras directamente.
- **Cómo funciona sin matar el ritmo:**
  - En la calle (la carrera), mantener los 3 carriles ágiles para conservar la emoción del juego, **pero con la segunda fila corregida** (ver pregunta 2).
  - **En el puente (y para graduar un verbo a "sabido"):** la última prueba no es elegir entre 3 carteles, sino **armar la palabra letra por letra (o sílaba por sílaba)** tocando fichas grandes en la parte baja del tablero (`[ W ] [ E ] [ N ] [ T ]` mezcladas con 2 o 3 letras trampa de los errores típicos, por ejemplo `[ O ] [ E ] [ D ]`).
  - **Por qué destruye al tramposo:** con 7 fichas de letras para formar una palabra de 4 o 5 letras, hay cientos de combinaciones posibles. Un bot que no sabe inglés (ni aplicando "nunca `-ed`" ni "la más corta") cae de **46,5 %** de acierto en el puente a **menos del 0,5 %**. Y cabe perfecto en `360×740` con botones de más de 44 px de alto, sin que salte el teclado del celular.

---

### 2. Repaso espaciado real y cierre del atajo en la carrera

**Parte A — Cómo bajar el atajo de la carrera de 65–74 % a < 1 % (regla exacta):**

Hay que cortar las tres patas del tramposo a la vez:
1. **Prohibir que la 2.ª fila se responda copiando la 1.ª cuando `pasado == participio`:**
   En los 30 verbos donde pasado y participio son iguales (y en los 12 regulares), las dos filas de la calle **no pueden pedir las dos formas en inglés seguidas con los mismos 3 carteles**. Propongo esta regla exacta para los turnos del camino:
   - **Fila 1 (o Fila 2 al azar):** pide la forma del verbo en contexto corto (`Yesterday I ___` o `I have ___`) entre 3 formas en inglés (`made / maked / make`).
   - **La otra fila del mismo verbo:** cuando `pasado == participio`, en vez de volver a preguntar la misma palabra que acaba de salir en pantalla, hace una de dos pruebas que no se pueden copiar de la fila anterior:
     - **Opción A (Contraste de molde / "fila al revés"):** muestra la forma usada o una oración negativa (`I didn't ___ yesterday` → exige escoger la **base** `make`, no `made`; o muestra `I have made` y pregunta qué significa o qué tiempo es).
     - **Opción B (Significado en español en una de las dos filas):** el libro anuncia el verbo en inglés (`LEAVE`) sin regalar la traducción arriba; la 1.ª fila pide el significado entre 3 verbos en español del mismo tramo (`irse / sentir / perder`), y la 2.ª fila pide la forma en inglés (`left / leaved / live`).
   - **Impacto medido:** si la 2.ª fila ya no se acierta copiando la respuesta recién mostrada de la 1.ª, la probabilidad de acertar las dos filas con la "receta de dos pasos" cae de `0,62 × 1,00 = 62 %` por turno a `0,62 × 0,33 = 20 %` por turno. En una carrera de 10 turnos con máximo 2 errores seguidos, **la tasa de victoria del mejor tramposo cae de 72–74 % a menos de 0,4 %** (cumpliendo por fin el requisito duro de `< 1 %`).
2. **Eliminar el chivato del regular:** los verbos nuevos irregulares también deben poder empezar pidiendo el participio o el pasado al 50 %, igual que los regulares, o bien toda carrera empieza siempre en orden fijo según la pregunta. Así el orden de las filas jamás delata si el verbo lleva `-ed`.
3. **Separar a los regulares del aviso de "verbos pendientes":** si un estudiante falla un regular infiltrado, que se le corrija en esa misma carrera (o en el puente), pero que no ensucie el cartel de victoria limpia en el 21–38 % de los estudiantes buenos si luego no se va a reencolar.

**Parte B — Repaso espaciado que sí llegue a "sabido" en una sesión de clase:**

Hoy tenemos un embudo matemático: 60 verbos haciendo fila en una sola bolsa, con 8 turnos por carrera. En **30 carreras perfectas (1 hora)** ningún verbo llega a salir 5 veces (`0 de 60 sabidos`). Un estudiante nunca ve premiado su esfuerzo.
- **La regla nueva por tramos cerrados de 10 verbos:**
  - El juego no mete los 60 verbos en la misma bolsa desde el día 1. **Se juega por tramo activo (10 verbos del tramo + 2 regulares infiltrados).**
  - Dentro de un tramo de 10 verbos, cada carrera tiene 8 turnos de ese tramo (más 1 o 2 de repaso de tramos anteriores ya superados). Así, un verbo del tramo sale en **casi todas las carreras** mientras se está aprendiendo.
  - **Definición realista de "Verbo Sabido" para una clase de 15–20 minutos:** un verbo pasa a **"Sabido"** cuando el estudiante logra **3 aciertos limpios seguidos en carrera + 1 producción sin ayuda (armando la palabra con letras) en el puente**, sin haber fallado en el intento actual.
  - Con una bolsa de 10 verbos por tramo y racha de `3 + 1 producción`, un estudiante que acierta el 90 % logra sus primeros **8 a 10 verbos "sabidos" en 3 o 4 carreras (unos 10 a 12 minutos)**, desbloqueando el tramo siguiente con una sensación real de progreso. Y el descanso `1-2-4` ahora sí funciona de verdad: un verbo "sabido" del Tramo 1 descansa 1, luego 2 y luego 4 carreras mientras el estudiante juega el Tramo 2.

---

### 3. Significado y uso real (sin recargar la pantalla de `360×740`)

1. **El significado deja de ser un adorno en la pizarra y pasa a ser jugada:**
   - Hoy la pizarra dice `FIND (encontrar)` y el jugador ni mira el español. Si cuando el libro aparece solo dice `FIND`, y una de las filas (o el arranque en el puente) pide elegir entre tres significados cortos de 1 palabra (`encontrar / construir / gastar`), el estudiante **tiene que saber qué significa el verbo** para no tropezar. Como son palabras sueltas de máximo 10 letras, caben con la misma letra grande de `22 px` en los 3 letreros de la calle.
2. **El tercer molde obligatorio (`didn't ___` / `Did you ___?` → forma base):**
   - El error más común en un salón colombiano después de enseñar el pasado irregular es *"Yesterday I didn't went"* o *"Did you saw?"*.
   - No necesitamos oraciones largas. En la pizarra caben igual de cortos que hoy (máximo 28 caracteres):
     - Molde 1 (Pasado afirmativo): `Yesterday I ___` → `went`
     - Molde 2 (Participio con have/has): `She has ___` → `gone`
     - Molde 3 (Auxiliar `did` → pide la base): `I didn't ___ yesterday` o `Did you ___ it?` → `go` (con `went` y `gone` como falsos tentadores).
   - Esto además **destruye el truco de "nunca escojas la palabra del libro"**, porque en el Molde 3 ¡la respuesta correcta ES la palabra del libro (la forma base)! Un bot que descarte la palabra del libro fallará el 100 % del Molde 3.
3. **Limpieza de datos que un profesor reclamaría:**
   - Renombrar los carteles de los tramos 4 y 5 para que no enseñen una regla falsa (*write → written* dobla la *t* y *wear → worn* no suma *-n* al pasado; mejor llamarlos *"Participio terminado en -en / -n"* y *"Cambio a -o- y participio en -n"*).
   - Retirar los distractores dialectales que existen en diccionarios (`thunk`, `brung`, `brang`, `boughten`) y reemplazarlos por errores reales de salón (`thinked`, `bringed`, `buyed`, `catched`).

---

### 4. Demostrar que funciona: Pre/Post y vista del profesor sin servidor

Un profesor no le cree a un juego porque tenga colores bonitos; le cree si puede mostrarle al coordinador académico o a los padres: *"Al empezar la clase acertaban 3 de 10; doce minutos después, sin pistas, acertaron 8 de 10"*.

1. **La prueba corta Pre y Post (60 segundos, 6 preguntas sin ayuda):**
   - Antes de jugar un tramo por primera vez, el juego lanza un **"Reto Inicial (1 minuto)"**: 6 preguntas rápidas de ese tramo (2 de significado, 2 de pasado/base con `Yesterday` vs `didn't`, 2 de participio con `have/has`), **armando o escogiendo sin pista del profesor, sin voz que sople y sin mostrar cuál era la correcta al fallar**. Guarda el puntaje inicial (por ejemplo, `Pre Tramo 1: 2/6`).
   - Al terminar las carreras y el puente del tramo, lanza el **"Reto Final (1 minuto)"** con los mismos verbos en otras oraciones y sin ayuda (`Post Tramo 1: 5/6`).
   - La pantalla final muestra la ganancia neta: **`Empezaste en 2/6 → Terminaste en 5/6 (+3 verbos aprendidos hoy)`**.
2. **Cómo recoge los datos el profesor en 1 minuto sin internet ni cuentas ("Código de 6 letras" + Tablero en `index.html`):**
   - Copiar y pegar un párrafo largo por WhatsApp o correo no funciona si no hay internet en el salón.
   - En cambio, al terminar, la pantalla del estudiante muestra en letras gigantes un **Código de Resumen de 6 caracteres** junto a sus iniciales (por ejemplo: `ANA: T1-2A5-MK,FD`). En esos pocos caracteres va codificado: tramo jugado (`T1`), nota Pre (`2`), nota Post (`5`), carreras jugadas y las iniciales de los 2 verbos que más le costaron (`make`, `find`).
   - En el computador del profesor (abierto con doble clic en `index.html`), hay un botón **"Modo Profesor / Ver resultados del salón"**:
     - El profesor puede escribir (o un estudiante dicta en 3 segundos) los códigos cortos de la clase, o pegar varios si los mandaron por red local.
     - El juego suma todo al instante sin servidor y dibuja en el proyector:
       1. **Promedio del salón Antes vs. Después** (ej. *Pre: 38 % → Post: 81 %*).
       2. **Los 3 verbos que más le costaron a este grupo hoy** (ej. *14 estudiantes pusieron `maked`, 11 pusieron `I didn't went`*), con un botón **"Repasar estos 3 verbos ahora en el proyector"**.

---

### 5. Modo Salón (15 minutos, 1 proyector, 30 estudiantes)

He visto qué pasa cuando se proyecta un juego pensado para celular ante 30 estudiantes: los de la última fila no alcanzan a leer, los que no tienen el teclado se aburren a los dos minutos, y si una partida dura 3 minutos solo pasan 4 estudiantes en toda la clase.

Para que el **Modo Salón (15 minutos)** funcione de verdad en un proyector (`1280×720`):
1. **Rondas relámpago por equipos (2 o 3 equipos, 90 segundos por turno):**
   - En vez de carreras individuales de 2:30, el Modo Salón divide la pantalla superior en el marcador de **Equipo A vs. Equipo B (y Equipo C opcional)**.
   - Cada relevo en la calle dura exactamente **4 verbos (unos 50–60 segundos)**. Así, en 10 minutos pasan **10 a 12 estudiantes** al teclado y nadie se queda dormido mirando.
2. **Carriles numerados `1 — 2 — 3` y colores bien distintos para gritar desde el puesto:**
   - En un salón de 30, gritar *"¡izquierda!"* o *"¡la del medio!"* es un caos. En Modo Salón, cada carril y cada pancarta lleva arriba un número gigante y un color fijo: **`[1 Azul]` · `[2 Amarillo]` · `[3 Verde]`**. Todo el equipo puede levantar 1, 2 o 3 dedos en silencio (si el profe no quiere bulla) o cantar el número, y el compañero en el teclado solo oprime `1`, `2` o `3`.
3. **El Gran Puente de cierre con todo el salón (los últimos 4 minutos):**
   - Los 4 verbos en los que más tropezaron los equipos durante los relevos aparecen en el Puente Final.
   - En Modo Salón, las opciones o fichas **salen tapadas durante 5 segundos** mientras se ve la oración (`Yesterday we ___ the bus`). El profesor señala a un equipo para que diga (o deletree) la respuesta en voz alta antes de destapar y marcar quién se lleva el punto doble.

---

## Qué está comprobado con números hoy y qué falta comprobar

Como agente de Pruebas, separo siempre lo medido de lo prometido:

- **Comprobado hoy (`node pruebas/bots.js` y navegador):**
  - El truco viejo de `-ed` está cerrado (0,2 % de victorias en la 1.ª partida, 11 victorias en 48.000 partidas).
  - La "receta de dos pasos" gana hoy el **65 %** de las primeras carreras y el mejor bot mecánico gana entre **72 % y 74 %**, porque en 30 de 60 verbos `pasado == participio` y el orden `pasado → participio` delata a los regulares.
  - Con los 60 verbos en una sola cola, tras **30 partidas perfectas** hay **0 verbos en estado "sabido"**.
  - En el puente actual de 3 opciones, un bot sin inglés acierta **46,5 %** a la primera (y **52,8 %** mirando `have/has`).
- **Calculado y listo para verificar con nuevos bots en cuanto se construya:**
  - Que al meter el tercer molde (`didn't ___` → base), el significado en español o contraste en la 2.ª fila cuando `pasado == participio`, y el orden al azar también en verbos nuevos, **ningún bot de las 6.800 combinaciones supere el 1 % de victorias**.
  - Que con tramos de 10 verbos y producción con fichas de letras en el puente, un aprendiz del 90 % alcance **8 a 10 verbos "sabidos" en menos de 12 minutos**, y un tramposo logre **0 sabidos y < 1 % en el puente**.
- **Lo que un bot NO puede comprobar (y solo se comprueba con el profesor y sus estudiantes):**
  - Si el tiempo de lectura en el Modo Salón con 30 estudiantes gritando números requiere 4 segundos o 5 segundos por pancarta, y si la diferencia entre el Pre y el Post se mantiene una semana después.
