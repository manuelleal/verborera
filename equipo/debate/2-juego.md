# Propuesta del diseñador de juegos

Mi postura en una frase: **la revisión no es un examen que interrumpe el juego; es el momento en que el estudiante deja de huir y le planta cara al monstruo, en la misma calle y con los mismos tres carriles, pero ahora con oraciones.**

## 1. Diagnóstico

- **Se espera más de lo que se decide.** Un turno perfecto dura 13 s (3,15 de recoger + 4,5 + 4,5 + 1 de pausa) y tiene dos decisiones. Recoger el libro no es decisión: es un trámite. Un runner bueno pide algo cada 1 o 2 segundos.
- **Todas las filas son iguales.** Tres letreros, una palabra cada uno, siempre. A la cuarta fila ya se vio todo lo que el juego tiene.
- **No hay meta que se vea.** "8 turnos" es un contador, no un lugar. No se sabe cuánto falta para nada, ni qué se gana por jugar otra partida.
- **El monstruo no es un personaje, es un termómetro.** Persigue, pero nunca pasa nada con él: no se le gana, no cambia entre partidas.
- **Las estrellas y la racha no compran nada.** Ir bien y ir regular se sienten igual hasta que uno pierde.

## 2. La revisión: "La Ignorancia cierra el paso"

**Elijo UNA forma: sigue siendo runner, misma calle, mismos tres carriles, pero el monstruo salta adelante y bloquea el puente al final del tramo.** Durante diez verbos uno huye; en la revisión uno lo enfrenta. No cambia de pantalla ni de control: el estudiante no tiene que aprender nada nuevo para jugarla y el programador no construye otro juego.

**Qué se ve**
- La calle se vacía 3 s. El monstruo pasa por encima del estudiante y se planta al fondo, en la mitad de la calle, delante de un puente. Cartel: `¡La Ignorancia cierra el paso! Completa las oraciones.`
- El marcador de arriba se convierte en **el tablero del profesor** (el 22 % alto de la pantalla). Renglón 1, en letra de marcador: la oración en inglés con un hueco, `Yesterday I ____ to school.` Renglón 2, pequeño: `Ayer fui al colegio.` La **palabra clave** (`Yesterday`, `have`, `last week`, `never`) va resaltada en amarillo.
- Al lado del tablero, tres libritos: son las tres ayudas del profesor (las vidas de la revisión).
- Por la calle vienen los tres letreros de siempre, una palabra cada uno: el pasado, el participio y un falso (`went / gone / goed`).

**Qué hace el jugador:** lee la oración arriba, mira la palabra clave y pasa por el letrero que completa el hueco. Exactamente el mismo gesto de siempre.

**Por qué cabe en una pantalla angosta:** la oración **no viaja por la calle**; está quieta arriba. Los letreros siguen llevando una sola palabra, que es lo que ya se probó que se lee a 360 px. Límite duro para las oraciones: 26 letras por renglón, máximo dos renglones.

**Velocidad:** fija, sin acelerar: 6 s por fila (`revisionLectura`). La oración aparece apenas se resuelve la anterior; los letreros tardan 6 s en llegar. Son 1,5 s más que una fila normal porque ahora hay que leer una oración y decidir entre dos formas verdaderas.

**Cuánto dura:** 10 oraciones × (6 s + 1 s de festejo) + 3 s de entrada = **unos 75 segundos**.

**Qué pasa al acertar:** el estudiante lanza el libro, el hueco se llena en verde (`Yesterday I went to school.`), el monstruo pierde un pedazo y retrocede un paso.

**Qué pasa al fallar:** el tablero muestra la forma correcta y la elegida tachada, con la regla en cinco palabras (`Yesterday → pasado: went`). Se gasta un librito y el monstruo avanza un paso. **No hay ventana de peligro ni captura aquí**: tres vidas, cuenta clara.

**Cómo se gana:** llegar a la décima oración con algún librito: 8 de 10 o más. **Si se gastan los tres:** el monstruo empuja al estudiante de vuelta al tramo. No se pierde nada aprendido; los verbos fallados quedan como pendientes, la siguiente carrera los trae, y después se reintenta el puente.

**Premio:** se abre el tramo siguiente (cambia el paisaje), el monstruo queda **más pequeño para siempre** (se ve en el mapa y en las carreras siguientes), medalla de 1 a 3 estrellas (8, 9 o 10 aciertos) y una pantalla final con las diez oraciones completas, lista para proyectar y copiar.

**Qué oraciones salen:** de los verbos del tramo, primero los que más se han fallado; mitad de pasado y mitad de participio. En los verbos de pasado y participio iguales (`made`, `bought`, `put`) no hay dilema de forma: ahí el falso es la base o el regular inventado (`make / made / maked`).

**Sobre "ordenar" y "conectar":** conectar ya es el ciclo básico (base → pasado → participio). Ordenar palabras necesita cinco fichas, arrastre y pantalla quieta: es otro juego, mide el orden de la oración y no el verbo, y en celular angosto las fichas quedan diminutas. **Lo dejo fuera.** De las tres ideas del dueño, completar oraciones es la única que agrega lo que hoy falta (el verbo usado, y cuándo va pasado y cuándo participio) sin cambiar de control.

## 3. La estructura completa: tres tramos y la puerta del colegio

Se respeta el `orden` que ya tiene `verbos.js`; no se mueve ningún verbo.

| Tramo | Lugar | Grupos | Verbos | Carreras | Cierra con |
|---|---|---|---|---|---|
| 1 | El barrio | iguales + rebeldes | 11 (órdenes 1–11) | 3 | Puente 1 |
| 2 | La plaza de mercado | no cambian + participio en -n | 12 (12–23) | 3 | Puente 2 |
| 3 | La subida al colegio | -ought + i-a-u | 8 (24–31) | 2 | Puente 3 |
| Final | La puerta del colegio | todos | 31 | — | 12 oraciones mezcladas |

- **Carrera** = la partida de hoy (8 turnos, 4 nuevos y 4 de repaso), ahora de 1:25 a 2:30. Los nuevos salen solo del tramo abierto.
- **El puente se abre** cuando todos los verbos del tramo se han visto y hay 2 pendientes o menos. Si hay más, toca otra carrera, que trae justamente esos.
- **Recorrido completo sin fallar:** 8 carreras + 3 puentes + la final ≈ 20 minutos. Con tropiezos, dos o tres ratos de clase. Una sesión natural es "un tramo": 5 a 8 minutos.
- **El mapa** reemplaza el botón principal del menú: una pantalla vertical con el camino del pueblo de abajo hacia arriba, los tres tramos, un punto por carrera, el monstruo parado en el puente que toca y el colegio arriba. Un toque en el punto que brilla y se juega. `Practicar un grupo` y `Lo que me cuesta` quedan como botones pequeños.
- **Dentro de la carrera**, una tirita bajo el marcador muestra al estudiante avanzando hacia el puente: `faltan 3 verbos para el puente`. Esa es la meta que hoy no existe.
- **Se guarda:** el historial por verbo (ya existe), el tramo abierto, las estrellas de cada puente y el tamaño del monstruo. Cuatro datos nuevos.
- **Se desbloquea:** paisaje nuevo por tramo, monstruo más chico, y al final el monstruo queda del tamaño de un gato sentado en la puerta del colegio, con diploma copiable.

## 4. Cambios al ciclo básico

**a. Menos espera (solo números).**

| Número en `reglas.js` | Hoy | Propongo | Por qué |
|---|---|---|---|
| `fraccionRecoger` | 0,7 | 0,55 | Una sola palabra en mayúsculas no necesita 3 s |
| `arranque` | 2 | 1,2 | Ya se sabe dónde está uno |
| `anuncioGrupo` | 3 | 2 | Y con estrellas en la calle mientras dura |
| `pausaAprendido` | 1 | 0,6 | El festejo no debe frenar |
| `lecturaMinima` | 3,5 | 3,0 | Solo se llega ahí yendo muy bien |
| `lecturaBajaPorTurno` | 0,1 | 0,15 | Que la aceleración se note |
| `lecturaInicial` | 4,5 | **igual** | El verbo nuevo conserva su tiempo |
| `respiroTrasError`, `pistaSegundos` | 1,5 / 4 | **igual** | Ahí es donde se aprende |

Nuevo: `restaLecturaRepaso: 0,8`. Los turnos de repaso (las R de `patronCola`) corren 0,8 s más rápido por fila que los nuevos. Lo conocido va rápido; lo nuevo, despacio. Eso solo ya crea ritmo: tramos tensos y tramos de respiro.

**b. Recoger se vuelve una decisión: el libro dorado.** En los turnos de repaso el verbo base aparece dos veces: libro normal en un carril y **libro dorado** en otro. El dorado es una apuesta: las dos filas de ese verbo llegan 1 s más rápido (`libroDoradoResta: 1,0`), pero cada acierto vale doble para recargar la ayuda del profesor y da tres estrellas. Nunca en verbos nuevos. Es riesgo y recompensa con un solo dedo, y el estudiante que ya sabe deja de aburrirse.

**c. La racha se ve y sirve.** Contador grande `×3` junto al marcador. Ya recarga al profesor a los 6 aciertos; que además se vea llenarse. Las estrellas dejan de ser adorno: suman para la medalla del tramo.

**d. Estrellas en los tiempos muertos.** En el respiro, el anuncio y el tramo antes del libro, una hilera corta de estrellas que obliga a cambiar de carril. Nunca en la zona de una fila de letreros: no deben señalar la respuesta.

**e. Una oración al cerrar cada verbo.** La cinta que hoy muestra `go – went – gone` muestra debajo una oración del verbo (`Yesterday I went to school.`). No se pregunta nada: es ver la oración antes de que el puente la pregunte. Usa los mismos datos.

**Aviso:** al cambiar tiempos hay que volver a correr los bots y rehacer la tabla de duración de `DISENO.md`. Las probabilidades de ganar no cambian: no toco `peligroFilas`, `comodinInicial` ni `aciertosParaComodin`.

## 5. Lo que NO haría

- **Arrastrar fichas para ordenar oraciones.** Otro control, otra pantalla, letras chiquitas, y no mide verbos.
- **Varias actividades de revisión que rotan.** Una sola, bien hecha y explicable en una frase ante los profesores.
- **Tienda, monedas, disfraces.** Semanas de trabajo y cero verbos.
- **Saltar y agacharse.** En un runner de leer, un obstáculo físico le roba la vista a la palabra.
- **Oraciones viajando por la calle** o letreros de dos palabras. No se leen a 360 px.
- **Que el monstruo del puente tenga ataques o patrones.** Es un contador con cara; con eso basta.
- **Reloj en la revisión.** La presión ya la pone la fila que viene.
- **Quitarle tiempo al verbo nuevo.** El que aburre es el verbo sabido que va lento, no el nuevo.

## 6. Costo, ordenado de más valor por menos trabajo

| # | Qué | Costo | Nota |
|---|---|---|---|
| 1 | Números de tiempo (4a) | Minutos | Más volver a medir con los bots |
| 2 | Tirita de meta y racha visible (3, 4c) | Bajo | Solo dibujo; los datos ya existen |
| 3 | Estrellas en tiempos muertos y oración en la cinta (4d, 4e) | Bajo | La cinta depende de los datos del #4 |
| 4 | **El puente** (sección 2) | Medio | Un modo nuevo de partida que reutiliza filas, carriles y letreros. Lo nuevo: tablero, tres vidas, monstruo adelante |
| 5 | Datos: 62 oraciones cortas con palabra clave | Medio, pero de Enseñanza | Dos por verbo; es escribir, no programar |
| 6 | Tramos y desbloqueo guardado (3) | Bajo–medio | Limitar los nuevos al tramo abierto + 4 datos guardados |
| 7 | Libro dorado (4b) | Bajo–medio | Una bandera por turno y un segundo objeto en la calle |
| 8 | Final en la puerta del colegio | Bajo | Es el puente con 12 oraciones de todos los tramos |
| 9 | Mapa dibujado | Medio | Lo más caro en dibujo. Primera versión: tres tarjetas en fila; el camino dibujado, después |

**Para la exposición alcanza con 1 a 6.** El 7 y el 9 son la segunda pasada.
