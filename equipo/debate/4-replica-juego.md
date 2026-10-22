# Réplica del diseñador de juegos

Cambio de postura en lo principal: **mi puente corriendo, con tres vidas y 8 de 10, no aguanta.** Lo retiro. Conservo el escenario (el monstruo adelante, en la calle, cara a cara) y cedo la mecánica.

## Lo que acepto

**Del Estudiante**
- **(a) Quieta y sin reloj.** Su argumento del salón es el que decide: con la oración quieta votan los 30; corriendo decide el que tiene el teclado. Y mis 6 s por fila eran una apuesta sin medir sobre cuánto lee un A1.
- **(c) No se pierde la revisión.** Siempre se abre el paso. La emoción la pongo con premio, no con castigo.
- **(d) El dedo no captura.** No recoger el libro deja de ser error: el libro vuelve a salir, ahora en el carril del jugador, y solo cuesta tiempo. Y la captura no devuelve a cero: el profesor lo levanta y la carrera sigue desde ese verbo, sin medalla.
- Empezar directo en un tramo desde el menú, teclas 1-2-3, y no mostrar puntaje en rojo.

**De Didáctica**
- **Letreros tapados.** En la parada: tapados hasta que el jugador toca (mínimo 1,5 s). Sin reloj, el profesor decide cuándo destapar y pide la respuesta en voz alta antes. En el ciclo básico: tapados el primer tercio en verbos ya vistos. Con eso **retiro mi idea de acelerar el repaso**: tapar no es tiempo muerto, es tiempo de pensar.
- **Moldes en vez de etiquetas** (`Yesterday I ___` / `I have ___` en el marcador) y el español siempre visible. Cuestan casi nada y preparan la parada.
- El falso fuerte es siempre la otra forma real del verbo; HAVE y GET solo en pasado; la oración fallada vuelve una vez.

## Lo que rechazo

- **10 oraciones (Didáctica).** Quieta y sin reloj, cada una toma 8 a 12 s: diez son dos minutos de preguntas. Pero **5 (Estudiante) no deja repartir parejo los dos moldes.** Van **6: tres de pasado y tres de participio**, mezcladas.
- **Que fallar no cambie nada (Estudiante: "con un fallo no retrocede").** Si acertar y fallar se ven igual, nadie lee la oración. Sin castigo, pero con diferencia visible: cada acierto a la primera le quita un pedazo al monstruo; quien acierta las 6 lo deja mínimo y gana el sello dorado. No sale ningún "4 de 6".
- **"Solo la parada y nada más" (Estudiante).** De acuerdo en que va primero; pero sin tramos la parada no tiene de dónde colgarse y la queja de la meta sigue viva.
- **"No más verbos" (Didáctica):** ya no está en nuestras manos; hay que diseñar para ~60.

## (e) Ordenar y conectar: qué decirle al dueño

- **Ordenar: no, firme.** Razón en una línea: *al ordenar, el verbo ya viene conjugado en la ficha; se practica el orden de la oración y el estudiante no tiene que saber nada del verbo.* Además pide arrastrar fichas pequeñas, que es otro control.
- **Conectar: sí hay una versión mínima, para la segunda pasada: la "fila al revés".** El marcador muestra `went` y los tres letreros traen bases (`go / get / come`): ¿de qué verbo es? Es conectar desde la otra punta, sirve para reconocer el verbo al leer, no necesita datos nuevos (los falsos son otras bases del tramo) y rompe la fila siempre igual. Una de cada cuatro filas en turnos de repaso. Trazar líneas entre columnas, no.

## (f) Con ~60 verbos y los hallazgos de Pruebas

- **15 partidas de 8 turnos sí es demasiado**, y el Estudiante ya vio dónde: se aburre en la fila 12 de 16. Subir a 5 o 6 nuevos por partida lo empeora. Propongo lo contrario: **partidas más cortas, 6 turnos con 3 nuevos y 3 de repaso** (primera vez: 3 nuevos en dos vueltas). Son más finales y más seguidos, que es lo que hace volver. Enseñanza debe dar el visto bueno: toca su criterio de 4 nuevos.
- **5 tramos de unos 12 verbos**, cortando en bordes de grupo y respetando `orden`; un grupo de más de 13 se parte en dos. Tramo = 4 carreras + parada, unos 7 a 9 minutos: un rato de clase.
- **Total, estimado a mano y sin simular:** 20 carreras de ~1:15 a 2:00 + 5 paradas de ~1 min + final ≈ 35 a 45 minutos, en cinco ratos. Para la exposición se muestra un tramo.
- **Partida que no termina:** un verbo se reencola máximo 2 veces por carrera; después sale de la cola como pendiente. Tope de 10 turnos por carrera.
- **El truco del "-ed":** en la parada no sirve, porque el falso fuerte es una forma real. En los verbos de formas iguales, que el tercer letrero no termine en -ed cuando haya otro falso disponible.

## Propuesta final

| Tema | Decisión |
|---|---|
| Actividad | Completar la oración; solo dos moldes (`Yesterday…` / `I have…`); palabra clave resaltada |
| Corriendo o quieta | **Quieta, sin reloj**, en la misma calle: el profesor frena al monstruo, que queda adelante. Tres letreros quietos, tapados hasta el primer toque; se toca el letrero o 1-2-3 |
| Cuántas | 6 (3 + 3). Las falladas vuelven una vez al final: máximo 9 |
| Tiempo | 60 a 90 s |
| Al fallar | La correcta cae al hueco, razón en una línea (`yesterday → went`), el verbo queda pendiente. Sin captura, sin puntaje, siempre se pasa. El monstruo solo se achica con aciertos a la primera |
| Tramos (~60 verbos) | 5 tramos de ~12, 4 carreras + parada cada uno; final de 8 oraciones mezcladas; entrada directa a cualquier tramo |
| Ciclo básico | `turnosPorPartida` 8→6, `nuevosPorPartida` 4→3, `patronCola` `'RNRNRN'`; `fraccionRecoger` 0,7→0,55; `arranque` 2→1,2; `anuncioGrupo` 3→2; `pausaAprendido` 1→0,6. Nuevos: `maxReencolar: 2`, `turnosMaximos: 10`, `tapadoRepaso: 0,33`. No recoger ya no es error. `lecturaInicial` y `lecturaMinima` quedan como están |
| Se construye primero | 1) La parada al final de la carrera de hoy + oraciones. 2) Captura justa y tope de reencolado. 3) Moldes en el marcador y números de tiempo. 4) Tramos y tirita de meta. 5) Tapados en repaso. Después: fila al revés, libro dorado, mapa dibujado |

Hay que volver a correr los bots: quitar el error de recoger y acortar a 6 turnos cambia las cuentas de la sección 11 de `DISENO.md`.
