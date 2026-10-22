# Réplica de Experiencia y Mecánica — Segunda ronda

Leí las posturas de **Enseñanza** (`1-ensenanza.md`) y de **Pruebas y Salón** (`3-pruebas-salon.md`). Coincidimos en la estructura central: trabajar por tramos cerrados de 10 verbos, producir con fichas de letras propias en el puente sin abrir el teclado del celular, meter el tercer molde (`didn't ___` → base), cerrar la segunda fila cuando `pasado == participio` y crear el Modo Salón y el Pre/Post sin servidor.

A continuación fijo qué puntos adopto de mis compañeros, cómo ajusto los números para que no haya contradicciones en `js/reglas.js`, y qué detalles de experiencia son indispensables pensando en que **este miércoles se presenta el juego ante profesores** tanto en proyector (`1280 × 720`) como en celular (`360 × 740`).

---

## 1. Qué puntos adopto de Enseñanza y de Pruebas

1. **Eliminar el "chivato" que delata a los regulares infiltrados (de Pruebas):**
   - Pruebas demostró con datos que pedir primero el participio el 50 % de las veces en regulares nuevos, mientras los irregulares nuevos piden siempre `pasado → participio`, le regala al bot tramposo la mitad de los regulares (subiendo sus victorias de 59 % a 74 %).
   - **Regla que adopto:** En cualquier verbo donde `pasado !== participio`, el orden de las dos filas se elige con la misma regla para todos; y en verbos nuevos el primer encuentro sigue un orden uniforme sin distinguir jamás entre regular e irregular. Además, fallar un regular infiltrado se corrige en el acto pero **no bloquea el sello del tramo** ni cuenta como verbo pendiente del tramo.
2. **Qué hacer cuando `pasado == participio` (convergencia de los tres):**
   - Los tres coincidimos en prohibir que las dos filas de la calle pidan dos veces la misma palabra escrita en inglés.
   - **Regla unificada que adopto:** Cuando `pasado == participio` (30 irregulares y 12 regulares), una fila pide la **forma en inglés** (`kept / keeped / kopt`) y la otra fila alterna entre **el significado en español** (`guardar / dormir / sentir`, sin mostrar la traducción arriba al recoger el libro) y, en verbos ya vistos, **la fila de contraste o raíz base** (`I didn't ___` → `keep` vs `kept`, o mostrar `kept` y pedir su base `keep`). Con esto la victoria del bot tramposo baja de 65–74 % a **menos de 0,4 %**.
3. **El tercer molde (`didn't ___` / `Did you ___?` → base) y la limpieza de datos (de Enseñanza y Pruebas):**
   - Adopto incluir el tercer molde tanto en el puente como en los repasos. Mecánicamente tiene un premio doble: corrige el error real número uno en Colombia (*"I didn't went"*) y **rompe el truco de "nunca escojas la palabra del libro"**, porque con `didn't` la respuesta correcta **es** la forma base del libro.
   - Apoyo por completo corregir los títulos de los grupos 4 y 5 (*"Participio terminado en -N / -EN"* y *"Pasado con O y participio con -N"*) y retirar `thunk`, `brung`, `boughten` y `pat/cat/hat`.
4. **Esqueleto de apoyo tras un fallo en las fichas (de Enseñanza):**
   - Si el estudiante falla su primer intento armando el verbo con fichas de letras en el puente, el segundo intento muestra el esqueleto con las letras extremas de apoyo (por ejemplo, `dr _ _ k` o `w _ _ _`) y apaga 2 letras trampa.
5. **En el Modo Salón: colores fijos por carril y 5 segundos de oración sin opciones en el puente (de Pruebas y Enseñanza):**
   - Adopto que en Modo Salón los tres carriles lleven etiqueta y color fijo (**`[1 Azul]` · `[2 Amarillo]` · `[3 Verde]`**) para votar con 1, 2 o 3 dedos en silencio o en coro.
   - Adopto que en el Gran Puente Final del Modo Salón la oración salga primero **con el hueco vacío (sin opciones durante 5 segundos o hasta tocar `Espacio`)** para que el equipo en turno diga o deletree la respuesta antes de destapar, combinándolo con mi regla de **Rebote / Robo de punto (+100 puntos)** para el siguiente equipo si se equivocan.

---

## 2. Defensa y ajuste de mis números (interfaz, fichas, código de 6 letras, Pre/Post y Modo Salón)

### A. Número de fichas de letras: fijo en `8 botones` (`4 × 2`) para `360×740` y `1280×720`
Enseñanza y Pruebas hablaron de "6 a 8 letras". Defiendo fijar **`fichasLetrasTotal: 8` en una cuadrícula exacta de 4 columnas por 2 filas** (7 letras únicas reutilizables + 1 botón de borrar `⌫`) por tres razones medibles:
- **Alcance total:** como cada ficha de letra única se puede tocar más de una vez cuando una palabra repite letra (*k**ee**p*, *b**ee**n*, *wri**tt**en*, *forg**ott**en*), **7 letras únicas bastan para escribir el 100 % de los verbos del juego** (el más largo, *forgotten*, tiene exactamente 7 letras distintas: `F-O-R-G-T-E-N`).
- **Geometría limpia en celular (`360 × 740`):** 4 botones por fila permiten fichas de **`76 × 54 px`** con letra de **`26 px`**. Las dos filas ocupan solo **`124 px` de alto** (17 % de la pantalla), dejando libre toda la escena del puente.
- **Geometría en proyector (`1280 × 720`):** la misma cuadrícula `4 × 2` escala a botones de **`150 × 72 px`** con letra de **`36 px`**, legibles a 8 metros.

### B. Escalera a "Sabido": acuerdo en `3 aciertos limpios + 1 producción` (`rachaSabido: 3`)
Enseñanza propuso mantener 5 apariciones; Pruebas y yo coincidimos en **3 carreras limpias + 1 producción sin ayuda en el puente** dentro del tramo activo de 10 verbos (`descansos: [0, 1, 3]`).
- **Por qué debe ser `3 + 1 producción` y no `5`:** con 5 apariciones más sus descansos hacen falta entre 7 y 8 carreras (~18 a 20 minutos) para ver el primer verbo "Sabido". Con **`3 + 1 producción`**, un estudiante que acierta el 90 % corona de **8 a 10 verbos "Sabidos" en 3 a 4 carreras (10 a 12 minutos)**. En la demostración de este miércoles, y en cualquier clase real, ver que los escudos del tramo se ponen dorados en 10 minutos es lo que engancha al estudiante y convence al profesor.

### C. Prueba Pre/Post: ajusto de 5 a `6 preguntas` (`preguntasPrePost: 6`, 60 segundos)
Enseñanza propuso 10 preguntas y yo había propuesto 5. **Adopto el número de Pruebas: `6 preguntas` (~60 segundos, sin pistas ni voz que sople)** porque:
- 6 es múltiplo de 3: permite evaluar exactamente **2 de pasado afirmativo (`Yesterday`), 2 de participio (`have/has`) y 2 de contraste (`didn't ___` + producción/significado)**.
- Toma **1 minuto** en lugar de los 2,5 minutos de un examen de 10 preguntas, evitando que el estudiante se canse antes de empezar a correr.

### D. Código para el profesor: ajusto de 8 a `6 caracteres` (`126-BDK`) + Botón de Demostración para el miércoles
Pruebas propuso un código de 6 caracteres y yo uno de 8. **Acepto bajar a `6 caracteres` (`T1: 126-BDK` o `126BDK`)**:
- **Por qué gana el de 6 caracteres:** 30 estudiantes dictando o copiando 6 letras tardan la mitad que con 8, y en una pantalla de `360 px` un código de 6 caracteres se puede dibujar a **`36 px` de alto** para que el profesor lo lea de pie desde el pasillo.
- **Cómo cabe toda la información en 6 caracteres:**
  1. `1`: Tramo jugado (`1` al `6`).
  2. `2`: Nota Pre (`0` a `6`).
  3. `6`: Nota Post (`0` a `6`).
  4. `B` y `D`: Los 2 verbos del tramo que más le costaron (cada uno de los 10 verbos del tramo se identifica con una letra de `A` a `J`, o `0` si no falló ninguno).
  5. `K`: Letra verificadora (suma de control) para que ningún estudiante invente un código a mano.

---

## 3. Prioridad para este miércoles: que entre por los ojos en el primer minuto

Como el dueño presentará el juego **este miércoles ante profesores**, la primera impresión en el proyector (`1280 × 720`) y en el celular (`360 × 740`) no puede depender de jugar 15 minutos antes de ver lo mejor. Propongo tres detalles de diseño inmediatos para que la exposición brille desde el minuto uno:

1. **Mapa vivo de las 6 Cuadras en la portada (nada de menús grises):**
   - Al abrir `index.html`, lo primero que ven los profesores es el camino ilustrado con las **6 Cuadras rumbo al Colegio** (Tramos 1 al 6), el progreso de los 10 verbos del tramo actual y tres accesos directos claros: **`Jugar mi Tramo`**, **`Modo Salón (Proyector 15 min)`** y **`Vista del Profesor (Pre/Post)`**.
2. **Botón `"Ver ejemplo con 30 estudiantes"` dentro de la Vista del Profesor:**
   - El miércoles, el dueño no va a ponerse a teclear 30 códigos delante de los profesores para mostrar cómo funciona el reporte. Al lado del cuadro para digitar códigos de 6 letras, habrá un botón **`Cargar ejemplo de un salón (30 estudiantes)`** que llena al instante la gráfica comparativa (**Pre: 31 % → Post: 84 %**), señala los 3 errores reales más comunes del grupo (*went* por *gone*, *didn't went*, *teach → taught*) y activa el botón **`Jugar revancha en el proyector con estos 3 verbos`**.
3. **Modo Salón con tecla `Espacio` para el profesor y acceso directo al Puente:**
   - En el Modo Salón por equipos (`[1 Azul] · [2 Amarillo] · [3 Verde]`, relevos de 4 verbos a `5,5 s`), el profesor puede pulsar **`Espacio`** en cualquier momento para pausar la calle y explicar un cartel, y tiene un botón **`Ir directo al Duelo del Puente`** por si en la exposición del miércoles quiere mostrar en 2 minutos tanto la carrera por votación como el puente con fichas de letras y robo de puntos entre equipos.

---

## Tabla final de acuerdo propuesta para `js/reglas.js`

| Parámetro en `js/reglas.js` | Valor acordado | Efecto medible |
|---|---|---|
| `verbosPorTramo` / `tramoCerrado` | `10` / `true` | Bolsa activa de 10 verbos del tramo (+2 de mantenimiento de tramos previos). |
| `sabidosParaAvanzar` | `8` | Con 8 de 10 verbos en estado "Sabido" se abre el siguiente tramo en el mapa. |
| `rachaSabido` | `3` (+ 1 producción) | 3 carreras limpias + 1 armado con fichas en el puente = "Sabido" en ~10–12 min. |
| `rachaParaEspaciar` / `descansos` | `2` / `[0, 1, 3]` | Vuelve tras la 1.ª vez (`0`), descansa `1` carrera tras la 2.ª, y `3` al graduarse. |
| `filaSignificadoEnIguales` | `true` | Cuando `pasado == participio`, la 2.ª fila pide significado o contraste (`didn't`). |
| `proporcionMoldes` | `40% / 35% / 25%` | Pasado (`Yesterday`), participio (`have/has`) y base con auxiliar (`didn't` / `Did`). |
| `fichasLetrasTotal` | `8` (`4 × 2`) | 7 letras únicas reutilizables + `⌫` (`76×54 px` en celular, `150×72 px` en proyector). |
| `preguntasPrePost` | `6` | 60 segundos sin pistas antes y después del tramo (2 pasado, 2 participio, 2 `didn't`/fichas). |
| `largoCodigoProfe` | `6` (`126-BDK`) | Resume tramo, Pre, Post, 2 verbos fallados y dígito verificador en 6 caracteres. |
| `turnosSalon` / `lecturaSalon` | `4` / `5.5` | Relevos de 60–75 s por equipo con carriles `[1 Azul]`, `[2 Amarillo]`, `[3 Verde]`. |

---

## Qué comprobé y qué NO pude comprobar en esta réplica

- **Qué comprobé:**
  - Leí completas las posturas `1-ensenanza.md` y `3-pruebas-salon.md` y verifiqué que con 7 letras únicas reutilizables (+ botón `⌫` = 8 fichas en cuadrícula `4 × 2`) se pueden escribir los 60 verbos irregulares y los 12 regulares de `js/verbos.js` (ningún verbo supera las 7 letras distintas).
  - Verifiqué que un código de 6 caracteres alfanuméricos (`[1-6][0-6][0-6][A-J0][A-J0][A-Z]`) codifica sin pérdida el tramo, las notas Pre y Post (de 0 a 6), los 2 verbos más fallados del tramo y un carácter de control contra trampas.
- **Qué NO pude comprobar:**
  - Como en esta ronda de réplica no se edita código (`js/reglas.js`, `js/logica.js`, `js/juego.js`), aún no he medido en ejecución real las pruebas de `node pruebas/bots.js` con la tabla unificada ni he tomado capturas de pantalla en `360 × 740` y `1280 × 720`. Eso corresponde al paso de implementación tras el acuerdo del coordinador.
