# Postura de Experiencia y Mecánica — Primera ronda

Como responsable de las reglas del juego, los tiempos y las cuentas (`js/reglas.js` y `DISENO.md`), revisé el estado actual de `js/reglas.js` y `js/logica.js`. Hoy tenemos un juego divertido de tres minutos para una feria, pero con tres huecos mecánicos medibles que le impiden ser una herramienta de todo el semestre:

1. **En la carrera siempre se elige entre 3 palabras ya escritas** y, cuando el pasado y el participio son iguales (30 de los 60 verbos, más los 12 regulares), la primera fila le sopla al jugador la respuesta exacta de la segunda. Por eso una receta mecánica sin saber inglés gana entre el **65 % y el 74 %** de las carreras.
2. **El repaso espaciado mezcla los 60 verbos en una sola bolsa.** Con `turnosPorPartida: 8`, `rachaParaEspaciar: 3`, `descansos: [1, 2, 4]` y `rachaSabido: 5`, un verbo necesita al menos **8 apariciones y descansos** entre 60 competidores. En 30 carreras (~1 hora), **0 verbos llegan a "sabido"**.
3. **El significado en español es decorativo**: nunca hace falta mirarlo para elegir de carril ni para pasar el puente.

A continuación presento la propuesta de Experiencia y Mecánica con números exactos para `js/reglas.js`, pensada a la vez para un **celular modesto de `360 × 740` píxeles** y para un **profesor con proyector y 30 estudiantes en 15 minutos**.

---

## 1. Producir sin opciones (en celular `360×740`, computador y proyector)

### Por qué no sirve abrir el teclado del celular
En una pantalla vertical de `360 × 740` píxeles, el teclado propio del teléfono ocupa entre **260 y 300 píxeles de alto** (el 40 % de la pantalla), achica el dibujo de golpe, mete el autocorrector en español (que cambia *went* por *venta*) y tiene teclas de **32 píxeles de ancho** donde un dedo falla por accidente. Además, escribir mientras se corre por tres carriles rompería el ritmo de persecución del Monstruo.

### La mecánica: "Caja de Fichas de Letras" en el puente + teclado en PC + voz opcional

**Dónde vive la producción (sin frenar la carrera):**
- **En la calle (corriendo):** Se mantienen los **3 carriles** para conservar el ritmo, la emoción y la ventana de lectura de `3,5` a `4,5` segundos. En la calle no se escribe letra por letra.
- **En el puente (revisión quieta y sin reloj):** De las **4 oraciones** al terminar una carrera (`revisionTrasCarrera: 4`) o las **6 oraciones** de cierre de tramo (`revisionDeTramo: 6`), la primera mitad sigue siendo de elegir entre 3 letreros (para afianzar la señal gramatical), y la **segunda mitad (`produccionPorRevision: 2` en carrera, `3` en cierre de tramo)** es de **armar el verbo sin opciones**.
- **Para graduarse a "Sabido":** Ningún verbo sube al estado final de `sabido` solo corriendo; su último paso exige armarlo limpio en el puente o en la prueba del tramo.

**Cómo funciona la Caja de Fichas en `360 × 740` píxeles:**
1. **El hueco y la pista limpia:** En el puente aparece la oración con el hueco vacío (`Yesterday I ___ to school.`) y arriba el verbo base con su significado: **`GO (ir)`**. En el hueco se ven las casillas vacías (por ejemplo, `_ _ _ _`).
2. **8 fichas grandes reutilizables en 2 filas de 4:** En la parte baja de la pantalla aparecen **`fichasLetrasTotal: 8` fichas** (dos filas de 4 botones).
   - Contienen las **letras únicas** de la forma correcta más las letras de los errores típicos de ese verbo (por ejemplo, para `went` con falsos `goed` y `gone`, las 7–8 fichas barajadas son `[ W ] [ E ] [ N ] [ T ] [ G ] [ O ] [ D ]` más el botón de borrar `[ ⌫ ]`).
   - **Cada ficha se puede tocar más de una vez** si la palabra repite letra (como `E` en *keep / kept / been* o `T` en *written*). Así nunca hacen falta 12 fichas chiquitas: con **7 letras + 1 botón de borrar (`⌫`)** se escribe cualquier verbo del juego.
3. **Medidas exactas para dedos reales en `360 × 740`:**
   - Cada ficha mide **`76 × 54` píxeles** con separación de **`8` píxeles** y letra de **`26` píxeles** (casi el doble que una tecla de celular).
   - Las dos filas juntas ocupan solo **`124` píxeles de alto** (el 17 % de la pantalla), dejando **más de `600` píxeles libres** para la escena del puente, el profesor, el monstruo y la oración.
   - **No regalar la respuesta por número de letras:** En el primer intento, la caja donde caen las letras es abierta y tiene botón **`✓ Listo`** (así el estudiante no descarta `went` vs `goed` contando rayitas). Si se equivoca en el primer intento (`intentosProduccion: 2`), el profesor le da una mano: **muestra las casillas exactas `_ _ _ _` con la primera letra ya puesta (`w _ _ _`) y apaga 2 letras trampa**.
4. **En computador (teclado físico directo):**
   - El estudiante puede hacer clic en las fichas **o escribir directo con su teclado (`A–Z`, `Retroceso`, `Enter`)**. Si pulsa una tecla que no está entre las 7 fichas, la ficha no sube (evita perder por rozar una tecla vecina sin querer).
5. **Micrófono opcional ("Dilo en voz alta"):**
   - Si el navegador del dispositivo soporta reconocimiento de voz, aparece un botón **`🎤 Decirlo` (`54 × 54` píxeles)** al lado de la caja. Al mantenerlo pulsado y decir *"went"*, las fichas se arman solas y el juego responde leyendo toda la oración en voz alta. **Siempre es opcional**: si no hay internet, no hay micrófono o hay bulla en el salón, las fichas bastan al 100 %.

---

## 2. Repaso espaciado real por tramos de 10 y cierre del atajo en la 2.ª fila

### A. Repaso espaciado que sí llega a "Sabido" en una sesión de clase

**Qué falla hoy en los números:**
Hoy `armarCola` busca entre los 60 verbos a la vez y exige `rachaSabido: 5` con `descansos: [1, 2, 4]`. Un verbo necesita salir limpio en 5 partidas más 3 partidas de descanso intermedio (mínimo 8 partidas si solo hubiera 8 verbos; más de 35 partidas cuando compite con 60 verbos). En una clase de 15–20 minutos un estudiante juega **entre 4 y 6 carreras** (cada carrera más su puente dura **2 minutos y 15 segundos**).

**Los nuevos números de repaso en `js/reglas.js`:**
- **Trabajo por Tramo Activo de 10 verbos (`verbosPorTramo: 10`, `tramoCerrado: true`):** El modo "Seguir aprendiendo" (`camino`) se concentra en los **10 verbos del tramo actual** (Tramo 1: verbos 1 al 10; Tramo 2: verbos 11 al 20, etc.). El siguiente tramo se desbloquea cuando el estudiante logra **8 de los 10 verbos en estado "Sabido" (`sabidosParaAvanzar: 8`)** y pasa el puente del tramo.
- **Mantenimiento de tramos anteriores (`cupoMantenimiento: 2`):** A partir del Tramo 2, de los `8` turnos de cada carrera, **6 turnos** son del tramo actual de 10 verbos y **2 turnos** traen de vuelta verbos de tramos anteriores cuyo descanso llegó a cero o que se hayan fallado. Así lo viejo no se olvida, pero nunca ahoga a los 10 verbos nuevos.
- **Escalera de dominio en 3 escalones (`rachaSabido: 3`, `rachaParaEspaciar: 2`, `descansos: [0, 1, 3]`):**
  1. **Escalón 1 — Visto y acertado (`racha: 1`, `descanso: 0`):** Lo acertó en su primera carrera. No descansa (`0`): vuelve en la carrera siguiente para comprobar que no fue suerte.
  2. **Escalón 2 — Afianzado (`racha: 2`, `descanso: 1`):** Lo acertó en dos carreras seguidas. Ahora **descansa 1 carrera completa** (mientras el estudiante practica los otros verbos del tramo).
  3. **Escalón 3 — ¡Sabido! (`racha: 3`, `descanso: 3`, con producción):** Tras descansar 1 carrera, el verbo reaparece en la calle y en el puente con **fichas de letras**. Si lo supera sin error, **queda coronado como "Sabido"** y pasa a descansar **3 carreras** (mantenimiento largo).

**Comprobación con reloj en mano (1 sesión de clase de 12–15 minutos con 10 verbos):**

| Carrera | Minuto | Qué juega el estudiante (8 turnos de calle + 4 de puente) | Verbos en "Sabido" al terminar |
|---|---|---|---|
| **Carrera 1** | Min 0 a 2:15 | 6 verbos nuevos del tramo (2 repiten vuelta) → suben a `racha: 1` (`descanso: 0`) | 0 / 10 |
| **Carrera 2** | Min 2:15 a 4:30 | Los 4 nuevos que faltaban (`racha: 1`) + 4 de la Carrera 1 → suben a `racha: 2` (`descanso: 1`) | 0 / 10 |
| **Carrera 3** | Min 4:30 a 6:45 | Los 6 que estaban en `racha: 1` suben a `racha: 2` (`descanso: 1`); los primeros 4 descansan | 0 / 10 |
| **Carrera 4** | Min 6:45 a 9:00 | Vuelven del descanso los primeros verbos en `racha: 2` + los arma con fichas en el puente → **suben a `racha: 3`** | **4 a 6 Sabidos** |
| **Carrera 5** | Min 9:00 a 11:30 | Vuelven del descanso los restantes en `racha: 2` + puente de tramo | **8 a 10 Sabidos (Tramo completado)** |

Con este ajuste, un estudiante que presta atención **completa un tramo de 10 verbos en 5 carreras (~12 minutos)** con memoria diferida real (descanso de una partida entera antes del examen final del verbo).

### B. Cómo cerrar de raíz la segunda fila regalada cuando `pasado = participio`

**Por qué hace trampa el bot hoy:**
En los 30 verbos donde `pasado === participio` (como `keep → kept → kept` o `cut → cut → cut`) y en los 12 regulares (`walk → walked → walked`), al pasar la primera fila el marcador muestra la respuesta buena (`kept`). En la segunda fila, el jugador ve otra vez `kept` entre los tres carriles y pasa por ahí sin pensar.

**El doble cerrojo mecánico en la calle:**

1. **Regla de la "Fila de Significado" cuando `pasado === participio` (`filaSignificadoEnIguales: true`):**
   - Cuando un verbo tiene la misma forma en pasado y participio, **no se pregunta dos veces la misma palabra en inglés**.
   - **1.ª fila:** Pide **PASADO Y PARTICIPIO** (porque en ese grupo son gemelos): el estudiante elige entre `[ keeped | kept | kopt ]` y el marcador arriba sella de una vez **`KEEP → kept · kept`**.
   - **2.ª fila (`pide: 'significado'`):** Pregunta **`¿QUÉ SIGNIFICA KEEP?`** y los tres letreros de la calle traen significados cortos en español (máximo 10 letras): **`[ guardar | dormir | sentir ]`** (tomados de otros verbos del mismo grupo o tramo).
   - **Efecto sobre el atajo:** La receta *"repite en la 2.ª fila la palabra que salió en la 1.ª"* **queda en 0 %**, porque la primera fila está en inglés (`kept`) y la segunda está en español (`guardar`).

2. **Regla de la "Carrera al Revés" en repaso (`ordenAlRevesEnRepaso: 0.4`):**
   - En los verbos que el estudiante ya vio (`vistos >= 1`), el **40 % de las veces** el libro que recoge en la calle no trae la forma base sino **el pasado o el participio** (por ejemplo, recoge **`WENT`** o **`BOUGHT`**).
   - Entonces la **1.ª fila** pide la **FORMA BASE** (`[ go | walk | win ]`) y la **2.ª fila** pide el **PARTICIPIO** (si es distinto, `[ gone | went | goed ]`) o el **SIGNIFICADO EN ESPAÑOL** (`[ ir | venir | hacer ]`).
   - **Nueva cuenta contra tramposos:** Con estos dos cerrojos, un jugador o bot que no sabe ni las formas ni qué significan los verbos en español pasa de acertar el **65 %–74 %** a acertar solo **1/3 en la primera fila × 1/3 en la segunda = 11,1 % por turno**, con lo cual **pierde más del 98 % de las carreras** antes de llegar a la mitad.

---

## 3. Significado en español y tercer molde (`didn't ___`) sin recargar los `360 px`

### Cómo entra el significado en español sin amontonar letras
- **Al ver un verbo por primera vez (`vistos === 0`):** Cuando viene el libro redondo por la calle, el marcador de arriba muestra en grande **`BUY = comprar`** durante los `1,8` segundos de recogida, para que nadie sea evaluado en algo que no se le ha presentado.
- **Desde la segunda vez (`vistos >= 1`):** El marcador muestra solo **`BUY`** (sin la traducción) cuando esa partida va a incluir la **Fila de Significado** en español (`[ comprar | traer | pensar ]`). Así el estudiante tiene que leer y recordar qué significa cada verbo para no tropezar.
- **Tope estricto de letras en letreros de español:** Toda traducción usada en un letrero de carril tiene **máximo 10 letras** (una sola palabra: *comprar, traer, pensar, enseñar, atrapar, construir*), cumpliendo la misma regla de legibilidad (`letraMinima: 0.044`, mínimo `16 px` en pantallas de `360 px`).

### El tercer molde en el puente: `didn't ___` y `Did you ___?` (pide la forma `base`)
- **El problema real en el salón:** Cuando los estudiantes aprenden *went* y *saw*, empiezan a decir *"I didn't went"* y *"Did she saw?"*.
- **La mecánica en el puente (`proporcionMoldes: { pasado: 0.4, participio: 0.35, base: 0.25 }`):**
  - En cada revisión del puente entra al menos **1 oración con `didn't` o `Did … ?`** donde la respuesta correcta es la **forma base** (`go`, `see`, `buy`) y los dos falsos son el pasado (`went`) y el participio (`gone`).
  - **Cero recarga visual:** La oración ocupa el mismo renglón de siempre (máximo 30 caracteres: `Yesterday I didn't ___ it.`), la palabra **`didn't`** se ilumina como señal del mismo modo que hoy se iluminan `Yesterday` o `have`, y al resolver aparece la explicación corta en una sola línea: **`didn't ya lleva el pasado → buy`**.

---

## 4. Demostrar que enseña (Pre/Post sin servidor) y el Mapa que da ganas de volver

### A. Prueba corta Pre y Post de cada tramo ("El Termómetro de 45 segundos")
Para que el profesor (y el propio estudiante) tenga una medida limpia antes y después de jugar cada tramo de 10 verbos:

1. **Antes de abrir un tramo nuevo (Pre-Tramo):**
   - Antes de la primera carrera del tramo, aparece una tarjeta sobria y amigable: **"Miremos cuántos de estos 10 verbos ya conoces (sin monstruo ni castigo)"**.
   - Son **`preguntasPrePost: 5` preguntas rápidas** (5 verbos representativos del tramo: 2 en pasado, 2 en participio y 1 con `didn't` o significado).
   - Se responden con la **Caja de Fichas de Letras** (sin opciones de selección múltiple para que no haya un 33 % de acierto por suerte) e incluyen un botón claro **`Paso / Aún no lo sé`** para que nadie pierda tiempo adivinando. Dura **45 a 60 segundos**.
2. **Al completar los 8 verbos sabidos del tramo (Post-Tramo):**
   - El estudiante responde las **5 preguntas equivalentes de esos mismos 5 verbos**, también con fichas y sin pistas del profesor.
3. **Comparación guardada en el dispositivo:**
   - El historial guarda por tramo `{ pre: 1, post: 5, fecha }`. Al terminar el tramo, la pantalla muestra el salto neto: **`Tramo 1: entraste con 1/5 → saliste con 5/5 (+4 verbos aprendidos)`**.

### B. Cómo recoge el profesor los datos de 30 estudiantes sin internet ni cuentas
En un colegio sin red o con celulares propios donde nadie va a crear usuario ni contraseña:

- **Sello Visual + Código de Entrega de 8 letras (`codigoEntrega`):**
  1. **De vistazo rápido desde el puesto:** La pantalla de resumen del tramo tiene un **color de fondo único por tramo y nota** y números gigantes (`TRAMO 2 · PRE 1/5 → POST 5/5 · 9 SABIDOS`). El profesor puede caminar por las filas y anotar en su planilla en 1 minuto.
  2. **Tablero del Profesor con Códigos Cortos:** La pantalla final genera un código corto de **8 caracteres con dígito de control** (por ejemplo: **`T2-15-KP-BR`**), que empaqueta: Tramo (`2`), nota Pre (`1`), nota Post (`5`) y los dos verbos donde más tropezó (`keep`, `bring`).
  3. En el computador del profesor hay un botón **`Vista del Profesor`**: el docente puede dictar o teclear los códigos de 8 letras de sus estudiantes (o pegarlos si se los mandaron al final) y la página calcula al instante, sin internet:
     - **Promedio Pre vs. Post del salón** (ejemplo: *Inicio: 28 % → Final: 88 %*).
     - **Los 3 verbos más fallados por el grupo**, con un botón directo: **`Lanzar revancha en el proyector con estos verbos`**.

### C. El Mapa de Progreso que da ganas de volver ("Las 6 Cuadras hasta el Colegio")
En lugar de un menú de texto plano, la pantalla principal muestra el **Mapa del Recorrido Semestral** con **6 paradas conectadas por un camino**:
1. **Cuadra 1 (Verbos 1–10):** *La Salida de Casa* (los 10 verbos más urgentes del inglés).
2. **Cuadra 2 (Verbos 11–20):** *La Panadería*.
3. **Cuadra 3 (Verbos 21–30):** *El Parque*.
4. **Cuadra 4 (Verbos 31–40):** *La Estación*.
5. **Cuadra 5 (Verbos 41–50):** *El Puente Mayor*.
6. **Cuadra 6 (Verbos 51–60):** *El Colegio (Meta del Semestre)*.

**Qué hace que el estudiante quiera volver la semana siguiente:**
- Cada cuadra muestra **10 ladrillos o escudos pequeños (uno por verbo)**: gris (*sin ver*), ámbar (*en camino, racha 1–2*) y **dorado/verde brillante (*Sabido, racha 3*)**. Ver **7 de 8 ladrillos dorados** necesarios para abrir la siguiente cuadra genera el deseo inmediato de jugar *"una carrera más de 2 minutos para destrabar El Parque"*.
- **El Álbum de los 60 Verbos:** Tocando cualquier cuadra, el estudiante abre las tarjetas de sus verbos ya ganados, puede tocar el botón de altavoz `🔊` para escuchar cómo se pronuncian las 3 formas y ver su récord personal.

---

## 5. Modo Salón (15 minutos, 1 proyector, 30 estudiantes, por equipos)

Para un profesor con un solo computador conectado al proyector o televisor del salón y 30 estudiantes divididos por filas, el modo individual no sirve porque la letra es pequeña a 7 metros y una captura deja a un equipo sin turno. Diseñamos el **`Modo Salón por Equipos` (`modo: 'salon'`)** con estas reglas medidas al minuto:

### Preparación (30 segundos)
- El profesor toca **`Modo Salón (15 min)`**, elige **2 o 3 equipos** (por defecto: *Equipo 1 Fila Izquierda*, *Equipo 2 Fila Centro*, *Equipo 3 Fila Derecha*) y el **Tramo (1 al 6)** o **"Los verbos que costaron hoy"**.

### Parte 1: Relevos en la Calle (8 minutos — 1 ronda de 4 verbos por equipo)
- **Turnos cortos y parejos (`turnosSalon: 4`):** Cada equipo juega una carrera corta de **4 verbos (~1 minuto y 45 segundos por equipo)**. Con 3 equipos son **5,5 a 7 minutos** en total, incluidos los cambios de equipo.
- **Tiempo de lectura para votar en voz alta (`lecturaSalon: 5.5` segundos):** En vez de `4,5 s`, cada fila de letreros tarda **`5,5` segundos** en llegar. Eso le da tiempo al equipo de gritar o levantar 1, 2 o 3 dedos y a su representante (o al profesor en el teclado) de pulsar la tecla **`1`**, **`2`** o **`3`** (que mueve al corredor directamente al carril izquierdo, central o derecho sin tener que pulsar dos veces la flecha).
- **Tamaño de letra para fondo de salón (`letraMinimaSalon: 0.062`):** Los letreros de los carriles tienen un **38 % más de tamaño** y llevan encima el número grande **`[ 1 ]`**, **`[ 2 ]`**, **`[ 3 ]`** con colores de alto contraste para que se lean desde el último pupitre a 8 metros.
- **Sin muerte súbita (nadie se queda mirando cómo el otro juega más):** En Modo Salón **no hay captura que corte el turno**.Cada acierto suma **`+100` puntos** al marcador del equipo; cada tropiezo resta **`-50` puntos**, acerca al monstruo y muestra la explicación del profesor en tamaño gigante durante **`4,5` segundos** (el profesor puede pulsar **`Espacio`** para congelar la explicación todo el tiempo que quiera y comentarla con la clase).

### Parte 2: Gran Final en el Puente con "Robo de Punto" (5 minutos — 6 retos)
- Los 3 equipos llegan juntos al puente para resolver **6 oraciones finales** (2 turnos titulares por equipo: 1 de elegir entre los 3 moldes `Yesterday / have / didn't` y 1 de armar el verbo con las **Fichas de Letras** diciendo las letras desde el salón).
- **Regla de "Rebote / Robo de Punto" (para que los 30 estudiantes estén callados y atentos aunque sea el turno de otro equipo):**
  - Si el **Equipo 1** acierta a la primera, gana **`+200` puntos**.
  - Si el **Equipo 1** falla, la oración no se resuelve sola: salta el aviso **`¡REBOTE PARA EL EQUIPO 2 POR +100 PUNTOS!`** con las dos opciones restantes (o con la pista de primera letra en las fichas). Así los otros dos equipos están pendientes de cada oración porque cualquier fallo ajeno es oportunidad propia.

### Cierre de clase (últimos 90 segundos)
- Sale el podio de los equipos y, al lado, el cartel **"Los 3 verbos del día para anotar en el cuaderno"**: muestra únicamente los verbos donde hubo tropiezos en esos 15 minutos, con sus tres formas, su significado y la oración correcta lista para leer en coro antes de que suene el timbre.

---

## Tabla resumen de números nuevos propuestos para `js/reglas.js`

| Regla en `js/reglas.js` | Valor actual | Valor propuesto | Por qué cambia |
|---|---|---|---|
| `tramoCerrado` | *(no existe)* | `true` | Enfoca el modo camino en 10 verbos a la vez en lugar de diluir entre 60. |
| `sabidosParaAvanzar` | *(no existe)* | `8` | Con 8 de 10 verbos sabidos (80 %) se destraba el siguiente tramo. |
| `cupoMantenimiento` | *(no existe)* | `2` | Turnos por carrera reservados para repasar verbos de tramos anteriores. |
| `rachaParaEspaciar` | `3` | `2` | Empieza a dejar descansar el verbo desde la 2.ª carrera limpia seguida. |
| `descansos` | `[1, 2, 4]` | `[0, 1, 3]` | Vuelve enseguida tras la 1.ª vez (`0`), descansa `1` carrera tras la 2.ª, y `3` al ser sabido. |
| `rachaSabido` | `5` | `3` | Permite coronar verbos como "Sabidos" en 1 sesión de clase (4–5 carreras + producción). |
| `filaSignificadoEnIguales` | *(no existe)* | `true` | Cuando `pasado === participio`, la 2.ª fila pide el significado en español: cierra el atajo. |
| `ordenAlRevesEnRepaso` | *(no existe)* | `0.4` | En verbos ya vistos, 40 % de las veces da el pasado/participio y pide la base y el significado. |
| `produccionPorRevision` | `0` | `2` | Oraciones del puente que se resuelven armando la palabra con 8 fichas de letras. |
| `fichasLetrasTotal` | *(no existe)* | `8` | 7 fichas de letras grandes reutilizables + 1 de borrar (`76×54 px` en celular `360×740`). |
| `intentosProduccion` | *(no existe)* | `2` | Al fallar el 1.er intento con fichas, muestra el largo `_ _ _ _` con la inicial puesta. |
| `preguntasPrePost` | *(no existe)* | `5` | Prueba corta de 45–60 s antes y después de cada tramo de 10 verbos. |
| `turnosSalon` | *(no existe)* | `4` | Verbos por turno de equipo en el Modo Salón para que 3 equipos jueguen en 15 minutos. |
| `lecturaSalon` | *(no existe)* | `5.5` | Segundos para ver la fila en proyector y que el equipo alcance a votar `1`, `2` o `3`. |
| `letraMinimaSalon` | *(no existe)* | `0.062` | Tamaño de letra 38 % mayor para leerse a 8 metros desde el fondo del salón. |

---

## Informe de verificación (qué comprobé y qué NO pude comprobar)

### Qué comprobé
1. **Revisé el código actual de `js/reglas.js` y `js/logica.js`:** Comprobé línea por línea cómo `armarCola` (líneas 95–162 de `js/logica.js`) toma `nuevos` y `repaso` de toda la lista de 60 verbos sin filtrar por el tramo actual, y cómo `resumen()` (líneas 684–686) aplica `rachaParaEspaciar: 3`, `descansos: [1, 2, 4]` y `rachaSabido: 5`, lo que explica matemáticamente por qué tras 30 carreras hay 0 verbos en estado "sabido".
2. **Comprobé las cuentas de espacio en pantalla de `360 × 740` píxeles:** Verifiqué que 2 filas de 4 fichas de `76 × 54 px` con `8 px` de margen suman `4 × 76 + 3 × 8 = 328 px` de ancho (caben con `16 px` de margen a cada lado en `360 px`) y `2 × 54 + 16 = 124 px` de alto, sin tapar la oración ni el puente y sin invocar el teclado del teléfono.
3. **Comprobé las cuentas de tiempo de una sesión de clase:** Con `turnosPorPartida: 8` (~95 s de carrera) más 4 oraciones en el puente (~40 s), cada ciclo dura ~2 minutos y 15 segundos. En 5 ciclos (~11,5 minutos) con `rachaSabido: 3` y `descansos: [0, 1, 3]`, los 10 verbos del tramo cumplen sus 3 apariciones espaciadas (carreras 1–2, descanso en 3, coronación en 4–5).
4. **Comprobé la caída matemática del atajo del tramposo:** Al reemplazar la segunda fila repetida en los 30 verbos de `pasado === participio` por una fila de significado en español, la estrategia de repetir la palabra de la primera fila pasa de acertar el 100 % en esa segunda fila a acertar 0 % (o 1/3 si elige al azar entre los 3 significados en español).

### Qué NO pude comprobar
1. **No corrí el banco de bots con las reglas nuevas** porque en esta primera ronda del debate no debemos editar `js/reglas.js` ni `js/logica.js`; cuando se apruebe el acuerdo, habrá que medir con `node pruebas/bots.js` que el nuevo bot tramposo baje efectivamente de 65 %–74 % a menos de 12 % de victorias.
2. **No he probado con estudiantes reales en un salón** si `5,5` segundos por fila en el `Modo Salón` (`lecturaSalon: 5.5`) son suficientes cuando votan 10 estudiantes por equipo, o si el profesor prefiere `6,0` segundos; por eso queda como un número ajustable en `js/reglas.js`.
3. **No pude comprobar en todos los navegadores sin internet el botón de micrófono opcional**, ya que el reconocimiento de voz del navegador suele requerir conexión en varios teléfonos Android; por eso diseñé la Caja de Fichas de Letras como el mecanismo principal que funciona siempre sin internet.
