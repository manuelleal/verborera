# Diseño del juego — especificación para Construcción

Todos los números viven en `js/reglas.js` (`VJ.REGLAS`, aquí `R`). Este documento dice qué pasa y en qué orden. Si un número de aquí no coincide con la tabla, manda la tabla.

## 1. Idea en cinco líneas

- La partida es una **cola de 8 turnos**. Un turno = un verbo completo: recoger la base → fila del pasado → fila del participio.
- Solo hay **un objeto a la vez** en la calle. El siguiente aparece cuando el anterior se resolvió.
- Un error es un tropiezo y abre el **peligro**: otro error en las 2 filas siguientes es captura.
- El profesor salva **una vez** de la captura (comodín) y se recarga con 6 filas acertadas seguidas.
- Se gana cuando la cola queda vacía: los 8 turnos cumplidos sin error en su última pasada.

## 2. Tiempo y lectura

`lectura` (L) es cuántos segundos se ve una fila antes de llegar a ella. Empieza en `R.lecturaInicial` (4,5 s).

- Velocidad = `R.distanciaVista / L`. Una fila aparece a `R.distanciaVista` (40 m) y llega en L segundos.
- El verbo base aparece a `R.distanciaVista × R.fraccionRecoger` (28 m): se ve 0,7 × L (3,15 s al empezar).
- Cada turno limpio: L −= `R.lecturaBajaPorTurno`, nunca por debajo de `R.lecturaMinima` (3,5 s).
- Cada error: L += `R.lecturaSubePorError`, nunca por encima de `R.lecturaInicial`.
- Cambiar de carril tarda `R.cambioCarril` (0,15 s) en `x`; `carril` cambia al instante y es el que decide.

Por qué 4,5 s: leer tres palabras cortas en otro idioma (~1,5 s), decidir (~1,5 s), moverse hasta dos carriles (0,3 s) y un margen igual de grande. El tope de 3,5 s deja margen aun para quien va bien.

**Requisito de dibujo (se mide en captura de celular vertical, 360 px de ancho):**

- Los tres letreros se leen **desde que aparecen**, no solo al llegar. La letra nunca mide menos de `R.letraMinima × ancho` (16 px). Para eso la perspectiva es suave: donde aparece la fila, la calle mide `R.anchoCalleLejos` (78 %) del ancho que tiene al pie.
- Una palabra de `R.maxLetras` letras debe caber en su letrero a ese tamaño. Letra gruesa, minúsculas, oscuro sobre claro.
- El verbo base viene en MAYÚSCULAS en una ficha de otro color y forma (redonda) para no confundirlo con un letrero.

**Marcador fijo arriba** (siempre visible, letra `R.letraHud × ancho`):

| Momento | Texto |
|---|---|
| Viene el verbo base | `Recoge: GO (ir)` |
| Recogido, viene la fila del pasado | `GO (ir) → pasado: ?` |
| Pasado resuelto, viene el participio | `GO → went → participio: ?` |
| Turno terminado | `GO → went → gone` (1 s, con ✓ si fue limpio) |

El marcador siempre muestra la forma **correcta** ya resuelta, aunque el jugador haya fallado (en ese caso, resaltada). Debajo, en pequeño: turnos cumplidos `3 / 8`, el comodín del profesor (lleno o con su carga `4/6`) y el aviso `PELIGRO` mientras dure.

## 3. Ciclo de un turno

1. **Anuncio de grupo** (solo la primera vez que sale un grupo en la partida): cartel `Los rebeldes · go – went – gone` durante `R.anuncioGrupo`. No frena; la calle va vacía mientras tanto. Evento `grupo`.
2. **Verbo base.** Aparece en un carril **distinto del que ocupa el jugador** en ese instante (al azar con semilla entre los otros dos). Así nadie lo recoge sin moverse.
   - Pasa por su carril → evento `recogio`.
   - No pasa → cuenta como error (`pide: 'recoger'`, `elegida: null`). El mismo verbo vuelve a aparecer enseguida, con las mismas reglas. No se reencola.
3. **Fila del pasado.** Tres letreros. Al llegar se mira `carril`: acierto o error.
4. **Fila del participio.** Igual. Se juega **aunque se haya fallado el pasado** (sigue siendo práctica).
5. **Cierre.** Si las dos filas se acertaron, el turno es limpio: pausa `R.pausaAprendido`, y si el verbo no tiene más turnos en la cola, evento `aprendido`. Si hubo algún error en filas, el verbo se reencola (sección 6).

Entre objeto y objeto no hay espera, salvo `R.respiroTrasError` después de un error y `R.pausaAprendido` después de un turno limpio.

## 4. Error, peligro y captura

Cuenta `peligroFilas` (0 = a salvo).

**Acierto en una fila:** si `peligroFilas > 0`, baja 1. `racha` += 1. `carga` += 1; si `carga` llega a `R.aciertosParaComodin` y no hay comodín, `comodin = 1`, `carga = 0`, evento `comodin`. El monstruo se aleja (sección 5).

**Error** (fila equivocada o verbo base sin recoger):

1. `racha = 0`, `carga = 0`, L sube, se anota en `fallos` (los de `recoger` no cuentan como fallo del verbo en el historial).
2. Si `peligroFilas == 0`: tropiezo. `peligroFilas = R.peligroFilas`. Evento `error`.
3. Si `peligroFilas > 0` y hay comodín: el profesor lo salva. `comodin −= 1`, `peligroFilas = R.peligroFilas` (el peligro empieza de nuevo). Eventos `error` y `salvado`.
4. Si `peligroFilas > 0` y no hay comodín: eventos `error` y `captura`, `fase = 'perdida'`.
5. Si no fue captura: `R.respiroTrasError` de calle vacía antes del siguiente objeto.

Recoger el verbo base **no** gasta peligro; no recogerlo estando en peligro sí es captura (o gasta el comodín).

**Lo que ve el jugador en un error, sin frenar el juego:**

- El letrero elegido se pone rojo y se sacude; el correcto se pone verde. El estudiante tropieza (`R.tropiezoSegundos`).
- Aparece el **panel de pista** bajo el marcador, durante `R.pistaSegundos`: el profesor a la izquierda y, en grande, `GO → went` (la forma correcta), debajo en pequeño y tachado lo que eligió (`goed`), y la `pista` del verbo.
- La calle sigue, vacía, durante el respiro. El panel no tapa los letreros que vengan.
- Si no recogió el verbo, el panel dice: `¡Recoge el verbo! Pasa por encima de la palabra.`

No se congela el juego: el respiro da el tiempo de lectura (1,5 s de calle vacía más lo que tarda en llegar lo siguiente, 3,2 s o más) y la lógica no necesita un estado de pausa. Además el error devuelve medio segundo de lectura a las filas que siguen.

## 5. El monstruo

Tiene una distancia de reposo `b`, que empieza en `R.monstruoInicio`.

- Fila acertada: `b −= R.monstruoPorAcierto`. Turno limpio: además `b −= R.monstruoPorAprendido`. Error: `b += R.monstruoPorError`. Siempre entre `R.monstruoMin` y `R.monstruoMax`.
- Su sitio es `R.monstruoEnPeligro` mientras `peligroFilas > 0`, y `b` si no. `estado.monstruo` se mueve hacia su sitio a `R.monstruoVelocidad` por segundo. En captura vale 1.
- Tamaño: de `R.monstruoTamMax` a `R.monstruoTamMin`, en proporción a los turnos cumplidos sobre el total.

El monstruo es el termómetro del peligro, no una segunda forma de perder: la única captura es la de la sección 4. Así las probabilidades se pueden calcular y explicar.

## 6. Qué verbos salen y cuándo vuelven

### Historial (lo que se guarda entre partidas)

Por verbo: `vistos` (turnos jugados), `aciertos` (turnos limpios), `fallos` (filas falladas). **Añadidos al contrato:** `racha` (partidas seguidas en que se jugó sin fallarlo), `descanso` (partidas que le faltan para volver a salir), `pendiente` (falló en su última partida), `falsoPasado` y `falsoParticipio` (el último falso que eligió). Un historial sin estos campos se lee como 0 / `false` / vacío.

### Cola inicial, según el modo

**Añadido a `VJ.crearPartida`:** `modo: 'camino' | 'grupo' | 'repaso'` (por defecto `'camino'`) y `grupo: id` (para el modo grupo).

**Camino** (el botón principal, "Seguir aprendiendo"):

1. *Pendientes* = verbos con `pendiente`. *Nuevos disponibles* = verbos con `vistos == 0`, por `orden`.
2. Cuántos nuevos: `R.nuevosPorPartida`; si los pendientes son `R.umbralPendientes` o más, `R.nuevosSiHayPendientes`.
3. *Repaso* = verbos con `vistos > 0` y `descanso == 0`, ordenados: primero los pendientes, luego menor `racha`, luego menor `orden`. Se toman los que hagan falta para completar `R.turnosPorPartida`.
4. Se arma la cola siguiendo `R.patronCola` letra por letra (R = siguiente de repaso, N = siguiente nuevo). Si un tipo se acabó, la casilla la ocupa el otro.
5. Si aún sobran casillas (primeras partidas, sin repaso), se llenan con una **segunda vuelta** de los mismos verbos en el mismo orden, sin pasar de `R.maxTurnosPorVerbo` por verbo. Primera partida: 4 verbos nuevos, dos vueltas: `have, make, say, get, have, make, say, get`.
6. Si ni así se llega a 8, la partida tiene los turnos que haya.

**Grupo** ("Practicar un grupo"): los verbos de ese grupo por `orden`, hasta 8; si son menos, segunda vuelta hasta completar 8 (un grupo de 4 da dos vueltas; el de 7 repite el primero). No depende del historial: es el modo para la demostración.

**Repaso** ("Lo que me cuesta"): los verbos con `fallos > 0`, ordenados: pendientes primero, luego mayor `fallos / vistos`, luego menor `orden`; hasta 8, con segunda vuelta si son menos. Sin descansos. El botón se apaga si no hay ningún verbo con fallos.

### Verbo fallado dentro de la partida

Al cerrar un turno con algún error en filas:

1. El verbo vuelve a entrar en la cola en la posición `R.repasoTras` (después de 2 verbos). Si quedan menos, al final.
2. **Nunca dos turnos seguidos del mismo verbo.** Si iba a quedar pegado a otro turno suyo, se corre un puesto. Si es el único que queda, antes se mete un turno de relleno: el verbo de esta partida que lleva más tiempo aprendido. Si no hay ninguno aprendido, vuelve directo.
3. Un relleno que se falla se trata como cualquier fallado.
4. `estado.aprendidos` contiene los verbos sin turnos en la cola cuyo último turno fue limpio. Un verbo sale de ahí si vuelve a entrar en la cola.

**Victoria:** cola vacía → evento `victoria`, `fase = 'ganada'`.

### Al terminar (lo calcula `resumen()` para el historial)

Por cada verbo jugado: suma `vistos`, `aciertos`, `fallos`; si no falló ninguna fila en toda la partida, `racha += 1` y `pendiente = false`; si falló, `racha = 0` y `pendiente = true`; guarda el último falso elegido. Si `racha >= R.rachaParaEspaciar`, `descanso = R.descansos[min(racha − R.rachaParaEspaciar, 2)]`; si no, 0. A los verbos no jugados con `descanso > 0` se les resta 1. Un verbo con `racha >= R.rachaSabido` se muestra como "sabido".

Esto aplica el criterio de `VJ.ESTRATEGIA` (Enseñanza): 4 nuevos, mitad repaso, 2 nuevos si hay 3 pendientes, el fallado vuelve tras 2 verbos y abre la partida siguiente, descansos 1-2-4, sabido con 5.

## 7. Cómo se arma una fila

1. **Carril de la correcta.** Se saca de una bolsa: `R.bolsaCarriles` barajada con la semilla; al gastarse, se baraja otra. Si el carril que sale haría más de `R.maxMismoCarrilSeguido` seguidas en el mismo, se cambia por el siguiente de la bolsa que sea distinto (también entre una bolsa y la otra). Resultado: de cada 6 filas, 2 por carril, y nunca 3 seguidas.
2. **Falsos.** De `falsosPasado` o `falsosParticipio`, que vienen del más común al menos común:
   - Primera vez que sale el verbo: los dos primeros.
   - Si el jugador ya eligió un falso para esa forma (en esta partida, o `falsoPasado` / `falsoParticipio` del historial): ese falso va siempre, y el otro rota entre los restantes según las veces que ha salido.
3. Los dos falsos se reparten al azar con semilla en los dos carriles que quedan.
4. Las tres palabras deben ser distintas entre sí.

## 8. Añadidos a `partida.estado` y a los eventos

Además de lo que pide el contrato:

- `peligroFilas`: filas de peligro que quedan. `peligro` (el del contrato, en segundos) = `peligroFilas × lectura`, solo para dibujar.
- `comodin` (0 o 1) y `carga` (0 a `R.aciertosParaComodin`).
- `lectura`: el L actual.
- `turnosTotal`, `turnosCumplidos`, `cola` (ids pendientes, en orden).
- `cadena`: `{ base, es, pasado, participio }` con `null` en lo que aún no se ha resuelto (para el marcador).
- `pista`: `null` o `{ texto, base, pide, correcta, elegida, quedan }` mientras se muestra el panel.
- `monstruoTam`: tamaño del monstruo.
- `modo`, `grupo`.

Eventos nuevos: `salvado` (el profesor gastó el comodín), `comodin` (se recargó), `grupo` (empieza el anuncio de un grupo). En un error por no recoger: `pide: 'recoger'`, `elegida: null`, `correcta` = la base.

`resumen()` añade: `ganada`, `tiempo`, `modo`, y por verbo `{ id, base, pasado, participio, es, grupo, turnos, limpios, errores: [{ pide, elegida }], sabido }`.

## 9. Personajes (formas básicas)

- **Estudiante:** visto de espaldas al pie de la pantalla; círculo por cabeza, rectángulo de color vivo por cuerpo y un morral cuadrado; se inclina al cambiar de carril y da un traspié al fallar.
- **Monstruo de la Ignorancia:** mancha morada oscura de borde irregular, dos ojos blancos y boca en zigzag, detrás del estudiante; sube y crece en pantalla según `estado.monstruo`, se encoge con `monstruoTam`, se pone rojo y tiembla en peligro.
- **Profesor:** busto en la esquina superior izquierda del panel de pista (círculo, gafas, saco verde); aparece al anunciar un grupo, al dar la pista y al celebrar; cuando salva, cruza con un libro abierto como escudo entre el estudiante y el monstruo. Junto al marcador hay un librito que indica si el comodín está listo.

## 10. Pantallas

**Menú.** Título, una línea de instrucciones (`Recoge el verbo y pasa por su pasado y su participio. ← → o toca los lados.`), y tres botones: `Seguir aprendiendo` (camino; dice cuántos verbos se han visto de 31), `Practicar un grupo` (lista de los 6 grupos con nombre, ejemplo y cuántos sabidos) y `Lo que me cuesta` (repaso; con el número de verbos). Abajo, pequeño: `Borrar mi progreso` (pide confirmar).

**Juego.** Marcador arriba (sección 2), calle con el objeto en curso, estudiante, monstruo. Nada más.

**Pista.** No es una pantalla aparte: es el panel de la sección 4, encima del juego en marcha.

**Final.** Para proyectar en el salón:

1. Titular: `¡Lo lograste!` o `Te atrapó la Ignorancia` · verbos aprendidos `6 de 8` · tiempo `2:14` · filas acertadas `17 de 21`.
2. **Tabla de verbos practicados**, en el orden en que salieron: `base – pasado – participio (significado)`, con ✓ (limpio a la primera), ↻ (aprendido tras repetir) o ✗ (quedó pendiente).
3. **Los que costaron**: cada uno con lo que se pedía, lo que eligió tachado y la forma correcta, más la pista. Ejemplo: `GO, pasado: elegiste goed → es went. "GO es de los rebeldes: went, gone."`
4. Botones: `Copiar resultado`, `Jugar otra vez` (mismo modo) y `Menú`.

Texto que copia el botón (sin nombre del estudiante; el profesor lo pega donde quiera):

```
Verbos irregulares — resultado
Partida: Seguir aprendiendo · ganada · 2:14
Aprendidos: 6 de 8 · Filas acertadas: 17 de 21

Practicados:
✓ have – had – had (tener)
↻ go – went – gone (ir)
✗ come – came – come (venir)

Me costaron:
- go, pasado: elegí "goed", es "went"
- come, participio: elegí "came", es "come"
```

Si el portapapeles falla (pasa al abrir con doble clic en algunos navegadores), mostrar el texto en un cuadro seleccionable.

## 11. Que no se gane sin saber: las cuentas

Modelo: 8 turnos, 2 filas por turno, peligro de 2 filas, un comodín al empezar que se recarga con 6 aciertos seguidos. `p` = probabilidad de acertar una fila; `q = 1 − p`.

**A mano** (sin contar la recarga del comodín):

- Un turno sale limpio con probabilidad p². Para 8 turnos limpios hacen falta 8/p² turnos, o sea 16/p² filas.
- Un error "desde a salvo" abre el peligro; es mortal si se falla alguna de las 2 filas siguientes: 1 − p².
- Fracción de filas que se juegan a salvo: 1 / (1 + q + q·p).
- Sustos mortales esperados λ = (16/p²) · q · [1 / (1 + q + q·p)] · (1 − p²).
- Con un comodín se gana si hay 0 o 1 susto mortal: P ≈ e^(−λ) · (1 + λ).

| Bot | Filas | λ | Gana, a mano | Gana, simulado | Sin comodín (simulado) |
|---|---|---|---|---|---|
| Acierta 70 % | 32,7 | 3,31 | 16 % | 17 % | 6 % |
| Acierta 80 % | 25,0 | 1,32 | 62 % | 56 % | — |
| Acierta 90 % | 19,8 | 0,32 | 96 % | 93 % | 73 % |
| Acierta 95 % | 17,7 | 0,08 | 99,7 % | 99 % | — |
| Perfecto | 16 | 0 | 100 % | 100 % | 100 % |

El comodín existe por la última columna: sin él, quien acierta 9 de cada 10 perdería una de cada cuatro partidas.

**Azar** (elige carril al azar en todo, también al recoger): acierta 1/3. Un turno limpio pide tres aciertos seguidos: (1/3)³ = 3,7 %. Cada error desde a salvo es mortal con probabilidad 1 − (1/3)² = 89 %, y solo tiene un comodín: vive unas 6 o 7 decisiones, dos turnos. Simulado: gana 0 %, llega a 3 turnos limpios el 0,08 % de las veces, dura 24 s.

**Azar que sí recoge el verbo** (el caso más favorable): turno limpio 1/9; las dos filas falladas en el mismo turno, 4/9. Contando solo esas dos salidas, cada turno decisivo es limpio 1 de cada 5 veces, y necesita 3 limpios antes del segundo susto: C(4,3)·0,2³·0,8 + 0,2⁴ = 2,7 % como techo. Simulado: 1,0 %, gana 0 %, dura 38 s.

**Quieto** (no toca nada): el verbo base nunca aparece en su carril. Primer verbo perdido: tropiezo. Segundo: gasta el comodín. Tercero: captura. Pierde el 100 %, con 0 verbos, a los 16–18 s (2 + 3 de anuncio + 3 × 3,15 + 2 × 1,5).

**Quedarse en un carril** tampoco sirve en las filas: por la bolsa, acierta exactamente 2 de cada 6 y nunca 3 seguidas.

**Duración** (simulada): perfecto 1:40; quien acierta 90 % gana en 2:08 de media (95 % de las veces en menos de 2:52); quien acierta 70 %, cuando gana, tarda 2:43 (casi nunca más de 3:45). No hay tope de tiempo: quien falla mucho pierde antes de alargarla.

**Avisos para Pruebas:**

- Los números "simulados" salen de un modelo de dados que hice aparte (100.000 partidas por bot), **no** del juego construido. Los bots de verdad deben volver a medirlos.
- En la primera partida hay 4 verbos en dos vueltas, así que `aprendidos` llega como mucho a 4 y el primer `aprendido` sale en el quinto turno. Para el bot al azar conviene medir **turnos limpios** (`turnosCumplidos`), no solo verbos aprendidos.
- Vale la pena medir aparte el modo `grupo` con `en` (8 verbos distintos) y con `rebeldes` (4 en dos vueltas).

---

## 12. Segunda y tercera etapa: Revisión en el puente y verbos regulares infiltrados

- **60 verbos en 6 tramos de 10 (`R.verbosPorTramo = 10`):** cada tramo reúne los verbos con `orden` de `10(k − 1) + 1` a `10k`.
- **La revisión en el puente (`VJ.crearRevision`):** al ganar una carrera salen `R.revisionTrasCarrera` (4) oraciones; al cerrar un tramo salen `R.revisionDeTramo` (6) oraciones. Es quieta, sin reloj y no se pierde: cada oración fallada vuelve una vez al final (`R.revisionRepite = 1`) con las opciones en otro orden.
- **Tope de turnos (`R.turnosMaximos = 12`, `R.maxReencolar = 2`):** un mismo verbo fallado vuelve como máximo 2 veces en la misma carrera y la partida nunca supera los 12 turnos irregulares.
- **Verbos regulares infiltrados (`R.regularesPorPartida = 2`, `R.revisionRegulares = 1`):** se mezclan 2 verbos regulares en cada carrera y 1 oración regular en cada puente, cerrando el atajo de "nunca escojas la palabra que termina en `-ed`".

---

## 13. Cuarta etapa: Herramienta semestral, producción con fichas, tramos cerrados y Modo Salón

Acordado en `equipo/debate-semestre/5-acuerdo.md` para que el juego funcione todo el semestre y en sesiones de salón de 15 minutos.

### A. Producción sin opciones: Caja de 8 Fichas de Letras (`R.produccionPorRevision = 2`, `R.fichasLetrasTotal = 8`, `R.intentosProduccion = 2`)
1. **Dónde se produce:** en la calle se mantienen los 3 carriles ágiles; en el puente, las últimas `R.produccionPorRevision` (2 en carrera, 3 en cierre de tramo) oraciones no muestran 3 carteles, sino un hueco vacío para **armar el verbo letra por letra**.
2. **Cuadrícula `4 × 2` (`76 × 54 px` en celular `360 × 740`, `150 × 72 px` en proyector `1280 × 720`):**
   - Muestra **7 fichas de letras únicas reutilizables + 1 ficha `⌫` (borrar)**. Como cada letra se puede tocar varias veces si la palabra repite letra (*keep, been, written, forgotten*), 7 letras únicas cubren el 100 % de los verbos sin abrir jamás el teclado del teléfono ni su autocorrector.
   - Las 7 letras incluyen todas las letras de la forma correcta más las necesarias para formar al menos un falso completo del verbo (por ejemplo, para *went* incluye `G, O, D` de *goed/gone*).
3. **Dos intentos con apoyo progresivo (`R.intentosProduccion = 2`):**
   - **1.er intento:** caja abierta (sin rayitas `_ _ _ _` que delaten el largo) con botón `✓ Listo` (o tecla `Enter`).
   - **2.º intento (si falla el primero):** el profesor muestra el esqueleto con la longitud exacta y la primera letra fija (`w _ _ _`) y apaga 2 letras trampa.
4. **Teclado físico y voz opcional:** en computador acepta las teclas `A–Z`, `Backspace` y `Enter`; incluye un botón opcional `🎤 Decirlo` cuando el navegador tenga reconocimiento de voz disponible.

### B. Repaso espaciado por Tramos cerrados de 10 verbos (`R.tramoCerrado = true`, `R.sabidosParaAvanzar = 8`, `R.cupoMantenimiento = 2`)
1. **Foco en los 10 verbos del tramo actual:** en el modo `camino`, la cola toma sus verbos nuevos y de repaso de los 10 verbos del tramo activo (Cuadras 1 a 6 del Mapa). Desde el Tramo 2, hasta `R.cupoMantenimiento` (2) turnos por carrera se reservan para repasar verbos de tramos anteriores cuyo descanso llegó a 0 o que tengan fallos.
2. **Escalera a "Sabido" en una sesión de clase (`R.rachaParaEspaciar = 2`, `R.descansos = [0, 1, 3]`, `R.rachaSabido = 3`, `R.requiereProduccionParaSabido = true`):**
   - **Racha 1 (`descanso = 0`):** primera carrera limpia; vuelve en la carrera siguiente.
   - **Racha 2 (`descanso = 1`):** segunda carrera limpia seguida; descansa 1 carrera completa.
   - **Racha 3 + producción limpia (`descanso = 3`):** al volver del descanso, pasar limpio y armarlo con fichas en el puente, el verbo se corona como **"Sabido"** y descansa 3 carreras.
   - Con **8 de los 10 verbos del tramo en estado "Sabido"** (`R.sabidosParaAvanzar = 8`), se abre el siguiente tramo en el Mapa de las 6 Cuadras. En 4 a 5 carreras (~11–12 minutos) un estudiante atento logra sus primeros 8 a 10 verbos sabidos.

### C. Cierre del atajo en la calle (`R.filaSignificadoEnIguales = true`, `R.ordenAlRevesEnRepaso = 0.4`) y tercer molde (`didn't ___`)
1. **Prohibido repetir respuesta en las dos filas cuando `pasado === participio`:**
   - En los 30 verbos irregulares donde `pasado === participio` y en los 12 regulares, la 1.ª fila pide la forma en inglés (`kept / keeped / kopt`) y la 2.ª fila pide **el significado corto en español (`pide: 'significado'`)** entre `[esCorto, falsosEs[0], falsosEs[1]]` (`guardar / dormir / sentir`), o bien el contraste negativo **`didn't ___` (`pide: 'base'`)** donde la respuesta correcta es la base (`keep` frente a `kept`).
   - **Sin soplo en el libro:** cuando un turno tiene fila de significado, el cartel del libro al inicio muestra solo el verbo en inglés (`KEEP`) sin la traducción arriba (`ocultarSignificadoLibro: true`).
2. **Misma regla de orden para regulares e irregulares:** el orden de las preguntas no distingue entre verbos nuevos regulares e irregulares, evitando que pedir participio primero delate a un regular. Los regulares infiltrados no ensucian el conteo de pendientes del tramo.
3. **Tercer molde en el puente (`forma: 'base'` con `didn't` / `Did … ?`):** un tercio de las oraciones lleva `didn't` o `Did`, donde el auxiliar ya marca el pasado y exige la forma `base` (*"I didn't go"*, corrigiendo *"I didn't went"*).

### D. Termómetro Pre/Post (`R.preguntasPrePost = 5`) y Código del Profesor (`R.largoCodigoProfe = 6`)
1. **Prueba corta Pre y Post (45 segundos, 5 preguntas sin pistas):** antes de empezar un tramo y al completarlo, el estudiante responde 5 preguntas rápidas (2 pasado, 2 participio, 1 `didn't` + base) con botón `Paso / Aún no lo sé`. Se guarda en `localStorage` la mejora (`Pre: 1/5 → Post: 5/5`).
2. **Código verificable de 6 caracteres (`125BDK`) y Vista del Profesor:** codifica Tramo (`1–6`), nota Pre (`0–5`), nota Post (`0–5`), los 2 verbos más fallados del tramo (`A–J` o `0`) y una letra verificadora (`A–Z`). La **Vista del Profesor** decodifica la lista del curso sin internet, incluye un botón **`Cargar ejemplo de salón (25 estudiantes)`** para demostraciones en vivo y permite lanzar una revancha con los 3 verbos más fallados.

### E. Modo Salón para proyector en 15 minutos (`R.turnosSalon = 4`, `R.lecturaSalon = 5.5`, `R.letraMinimaSalon = 0.062`)
1. **Relevos por equipos (2 o 3 equipos):** cada equipo corre `R.turnosSalon` (4) verbos (~65 s por relevo) con lectura de `5,5 s` por fila, letra 38 % mayor y carriles numerados con color fijo **`[1 Azul] · [2 Amarillo] · [3 Verde]`** (teclas `1`, `2`, `3` y pausa del profesor con `Espacio`). No hay captura: cada acierto da `+100` puntos (`R.puntosSalonAcierto`) y cada tropiezo resta `-50` (`R.puntosSalonError`).
2. **Duelo Final en el Puente con Robo de Punto (`R.oracionesPuenteSalon = 6`, `R.segundosTapadoSalon = 4`, `R.puntosSalonRebote = 100`):** la oración aparece primero durante 4 segundos con el hueco vacío para que el equipo en turno piense o deletree la respuesta; si al destapar falla, el turno rebota al siguiente equipo por `+100` puntos. Cierra con el cartel de **"Los 3 verbos del día"**.

