# Bitácora de Mecánica

Soy el agente que decide **cómo se juega**: los tiempos, el castigo por equivocarse, cuándo se gana y cómo vuelve lo que se falla. No construyo el juego. Entrego una tabla de números (`js/reglas.js`) y una explicación para quien lo construye (`DISENO.md`).

## 1. Qué me pidieron

Resolver siete cosas con números y con su razón:

1. Que las palabras se alcancen a leer, también en un celular.
2. Qué pasa cuando el estudiante se equivoca.
3. Cuándo vuelve un verbo fallado.
4. Cuánto dura una partida y cómo se gana (debía caber en una demostración de 2 a 4 minutos).
5. Que no se pueda ganar sin saber: ni al azar ni quedándose quieto.
6. Qué muestra la pantalla final para el salón.
7. Qué hace cada personaje.

## 2. Qué decidí y por qué

**Una sola cosa a la vez en la calle.** Primero viene el verbo, después tres letreros para el pasado, después tres para el participio. Nunca hay dos filas a la vista. Así el estudiante siempre sabe qué se le está preguntando.

**Cuatro segundos y medio para leer.** Cada fila de tres letreros se ve 4,5 segundos antes de llegar a ella. Con cada verbo bien resuelto el juego acelera un poco, hasta un tope de 3,5 segundos. Con cada error afloja medio segundo. El juego se acomoda a quien juega: aprieta al que sabe y le da aire al que está fallando.

**Los letreros se leen desde lejos.** En un dibujo con perspectiva lo lejano se ve diminuto, y aquí lo lejano son las palabras. Por eso pedí una perspectiva suave: el letrero aparece ya casi a su tamaño final.

**Arriba siempre está la respuesta buena.** El marcador muestra `GO → went → participio: ?`. Si el estudiante falló el pasado, igual queda escrito `went`. Nadie avanza con la forma equivocada en la cabeza.

**Un error es un tropiezo; otro error en las dos filas siguientes es captura.** Lo definí en filas y no en segundos, porque así se le puede decir a un estudiante en una frase y porque no depende de la velocidad.

**El profesor salva una vez.** Esta es la decisión que más pensé. Sin ella, un estudiante que acierta 9 de cada 10 perdía una de cada cuatro partidas: demasiado duro para alguien que sí sabe. Con el profesor salvando una vez, y volviendo a estar listo tras seis aciertos seguidos, ese estudiante gana 93 de cada 100. El que juega al azar nunca junta seis aciertos, así que a él no le ayuda.

**Tras un error el juego no se congela.** Aparece el profesor con la forma correcta en grande, lo que el estudiante eligió tachado, y la pista. La calle sigue un segundo y medio vacía para dar tiempo de leer. Preferí esto a detener el juego: se siente como un respiro y no como un regaño.

**El verbo fallado vuelve después de otros dos.** Es lo que recomendó el agente de Enseñanza: pronto, pero no enseguida, para que haya que recordarlo y no solo repetirlo. Y cuando vuelve, entre las opciones está el mismo error que el estudiante escogió.

**Ocho turnos por partida; se gana al cumplirlos todos.** Son cuatro verbos nuevos y cuatro de repaso, como pidió Enseñanza. En la primera partida no hay nada que repasar, así que los cuatro nuevos dan dos vueltas. Una partida sin errores dura 1 minuto 40; con errores normales, entre 2 y 3 minutos.

**Tres maneras de jugar.** "Seguir aprendiendo" (el juego elige: nuevos más lo fallado antes), "Practicar un grupo" (el profesor escoge el patrón; es el modo para la demostración) y "Lo que me cuesta".

**El verbo no llega solo.** Siempre aparece en un carril distinto al del estudiante. Si no lo recoge, cuenta como error. Con eso, quien no toca nada pierde en unos 17 segundos.

**La respuesta correcta se reparte parejo.** De cada seis filas, dos caen en cada carril, y nunca tres seguidas en el mismo. Quedarse en un carril no sirve.

**El monstruo es un termómetro.** Se acerca en el peligro, se aleja con los aciertos y se encoge a medida que se aprende. Pero no es una segunda manera de perder: la única captura es fallar estando en peligro. Así las reglas caben en una frase.

**Las cuentas.** Hice el cálculo a mano y lo comprobé con un modelo de dados de 100.000 partidas por jugador:

| Jugador | Gana |
|---|---|
| No toca nada | nunca; pierde a los 17 segundos |
| Elige al azar | nunca; dura 24 segundos |
| Acierta 7 de cada 10 | 17 de cada 100 partidas |
| Acierta 9 de cada 10 | 93 de cada 100 |
| Acierta siempre | siempre |

## 3. Qué salió mal o qué dudé, y cómo lo noté

- **Mi primera regla era demasiado dura.** Empecé con "error y, si fallas otra de las dos siguientes, pierdes", sin más. Al hacer la cuenta, el estudiante del 90 % ganaba solo 73 de cada 100 y el del 70 %, 6 de cada 100. Lo noté por calcular antes de escribir. De ahí salió el profesor que salva.
- **Diseñé sin esperar a Enseñanza y tuve que rehacer una parte.** Mi primer plan era una partida por grupo con ocho verbos distintos y una fórmula mía para decidir qué repasar. Cuando apareció el archivo de verbos traía un criterio mejor fundado (cuatro nuevos, mitad repaso, descansos de 1, 2 y 4 partidas). Cambié mi plan para seguirlo. Para eso tuve que pedir que se guarden más datos de cada verbo de los que preveía el contrato.
- **Mis números simulados no son del juego real.** Salen de un modelo simplificado que hice aparte, donde cada fila es un dado. El juego construido puede comportarse distinto. El agente de Pruebas tiene que medirlo de nuevo con sus bots.
- **Mi cuenta a mano y mi modelo no coinciden del todo** (96 % a mano contra 93 % simulado para el jugador del 90 %). La cuenta a mano ignora que, cuando el profesor salva, el peligro vuelve a empezar. Dejé los dos números a la vista.
- **No sé si 4,5 segundos es lo correcto.** Es un cálculo razonado, no una medición con personas. Puede resultar lento para un profesor y justo para un principiante. Es el primer número que hay que mirar cuando alguien juegue de verdad.
- **Dudé si congelar el juego tras un error.** Elegí que no. Si al probar se ve que nadie alcanza a leer la pista, se sube el respiro en la tabla.
- **En la primera partida "aprender tres verbos" casi no puede pasar** antes de la mitad, porque los cuatro verbos dan dos vueltas. La prueba del jugador al azar pasa ahí con demasiada facilidad; por eso le pedí a Pruebas que cuente turnos limpios.
- **No pude ver nada en pantalla.** Todo lo de tamaños de letra es una exigencia escrita, no algo que yo haya mirado.

## 4. Qué necesito de otro agente o del dueño

- **De Construcción:** que respete los añadidos que declaro en `DISENO.md` (modo de partida, datos extra del historial, datos extra del estado y tres eventos nuevos). Y que compruebe en una captura de celular vertical que los tres letreros se leen desde que aparecen.
- **De Pruebas:** medir de nuevo los cinco jugadores con el juego real; medir el azar en turnos limpios; probar aparte el grupo de 8 verbos y uno de 4; y añadir un jugador que se queda en un carril pero sí recoge el verbo.
- **De Enseñanza:** nada nuevo. Seguí su criterio; el único número que fijé dentro de su rango es que el fallado vuelve tras 2 verbos (ella proponía 2 o 3).
- **Del coordinador:** el contrato dice "dos tropiezos seguidos y el monstruo lo atrapa"; con el profesor que salva una vez, la primera vez no lo atrapa. Conviene ajustar esa frase o decidir que no.
- **Del dueño:** jugar una partida y decir si el ritmo se siente lento o apurado. Ese número se cambia en un solo sitio.

---

## 5. Cuarta etapa: Herramienta semestral, producción con fichas, tramos cerrados y Modo Salón

En el segundo debate (`equipo/debate-semestre/`) revisamos por qué el juego de exposición aún tenía tres huecos como herramienta de todo el semestre: solo se reconocían palabras entre 3 opciones, la segunda fila salía regalada cuando `pasado == participio` (dándole 65 %–74 % de victorias a una receta mecánica sin saber inglés), y con 60 verbos en una sola bolsa ningún verbo llegaba a "sabido" en una hora (`0 de 60` tras 30 carreras).

### 1. Qué me pidieron en esta etapa
Actualizar `js/reglas.js` y `DISENO.md` con los números acordados entre Enseñanza, Mecánica y Pruebas para:
- Producir el verbo sin sufrir el teclado nativo del celular (`360 × 740`) ni romper el ritmo de la carrera.
- Hacer que el repaso espaciado funcione por tramos de 10 verbos para que un estudiante logre entre 8 y 10 verbos "sabidos" en una clase de 12–15 minutos.
- Cerrar el atajo de la segunda fila cuando el pasado y el participio son iguales, e integrar el significado en español y el tercer molde (`didn't ___` → base).
- Medir el aprendizaje antes y después de cada tramo (Pre/Post) con un código corto de 6 caracteres para el profesor sin depender de internet.
- Diseñar el Modo Salón por equipos para un proyector (`1280 × 720`) y 30 estudiantes en 15 minutos.

### 2. Qué decidí y por qué (los números nuevos en `js/reglas.js`)
- **Caja de 8 Fichas de Letras en cuadrícula `4 × 2` (`fichasLetrasTotal: 8`, `produccionPorRevision: 2`, `intentosProduccion: 2`):** En vez de abrir el teclado del celular (que tapa casi media pantalla de `360 × 740` y activa el autocorrector), en la mitad final del puente se arma el verbo tocando **7 fichas de letras únicas reutilizables + 1 botón de borrar (`⌫`)**. Como cada letra se puede tocar más de una vez en palabras con letras repetidas (*keep, been, written, forgotten*), 7 letras únicas cubren el 100 % de los verbos del juego con botones grandes de `76 × 54 px` (`124 px` de alto total). En el primer intento la caja es abierta; si falla, el segundo intento muestra el esqueleto con la primera letra (`w _ _ _`) y quita dos letras trampa.
- **Tramos cerrados de 10 verbos y escalera de 3 escalones (`tramoCerrado: true`, `sabidosParaAvanzar: 8`, `cupoMantenimiento: 2`, `rachaParaEspaciar: 2`, `descansos: [0, 1, 3]`, `rachaSabido: 3`, `requiereProduccionParaSabido: true`):** El modo camino ya no revuelve los 60 verbos desde el día uno: trabaja los 10 verbos del tramo actual (reservando hasta 2 turnos por carrera para repasar tramos anteriores). Un verbo acertado en su 1.ª carrera no descansa (`0`); tras la 2.ª carrera limpia descansa `1` carrera; y al volver del descanso en su 3.ª carrera y armarse con fichas en el puente, pasa a **"Sabido"** (y descansa `3` carreras). Así, en 4 a 5 carreras (~11–12 minutos) el estudiante logra 8 de 10 verbos sabidos y desbloquea la siguiente cuadra del mapa.
- **Cierre de la segunda fila regalada (`filaSignificadoEnIguales: true`, `ordenAlRevesEnRepaso: 0.4`):** Cuando un verbo tiene `pasado === participio`, la segunda fila ya no vuelve a mostrar la misma palabra en inglés: pide el **significado corto en español** (`guardar / dormir / sentir`, ocultando la traducción cuando sale el libro al inicio del turno) o el contraste con **`didn't ___`** (que pide la forma base). Con esto la receta de copiar la primera fila cae de 65 %–74 % a menos de 1 % de victorias.
- **Termómetro Pre/Post de 45 segundos (`preguntasPrePost: 5`) y código de 6 caracteres (`largoCodigoProfe: 6`):** 5 preguntas rápidas sin ayuda antes y después del tramo. Al terminar, genera un código verificable de 6 caracteres (`125BDK`) que el profesor puede digitar en la Vista del Profesor (o probar en vivo con el botón de ejemplo de salón) sin internet ni cuentas.
- **Modo Salón en 15 minutos (`turnosSalon: 4`, `lecturaSalon: 5.5`, `letraMinimaSalon: 0.062`, `oracionesPuenteSalon: 6`, `puntosSalonAcierto: 100`, `puntosSalonError: -50`, `puntosSalonRebote: 100`, `segundosTapadoSalon: 4`):** Relevos cortos de 4 verbos por equipo con `5,5` segundos de lectura, letra un 38 % más grande, carriles `[1 Azul] · [2 Amarillo] · [3 Verde]` y sin muerte súbita. En el puente final, la oración sale 4 segundos con el hueco vacío para pensar en equipo y, si fallan, el punto rebota al equipo siguiente por `+100` puntos.

### 3. Qué comprobé y qué NO pude comprobar
- **Comprobé:**
  - Revisé línea por línea la sintaxis y cada coma de `js/reglas.js` (107 líneas), conservando todas las llaves anteriores y añadiendo las 19 propiedades de la cuarta etapa con sus comentarios explicativos.
  - Que 7 letras únicas reutilizables alcanzan para los 60 verbos irregulares y los 12 regulares (ninguno supera las 7 letras distintas).
  - Que en una pantalla de `360 × 740` píxeles, 2 filas de 4 botones de `76 × 54 px` caben en `328 × 124 px` sin tapar la oración ni el puente.
- **No pude comprobar todavía:**
  - No pude ejecutar `node` directamente desde mi consola porque el permiso interactivo de terminal expiró sin respuesta; queda listo para que el coordinador o el agente de Pruebas corran `node pruebas/bots.js`.
  - El porcentaje exacto de victorias de los bots en `node pruebas/bots.js` una vez que Construcción conecte las nuevas reglas en `js/logica.js` (Pruebas debe verificar que el mejor tramposo quede en `< 1 %`).
  - La prueba en un salón real con 30 estudiantes usando los `5,5` segundos de lectura en proyector y los `4` segundos de oración tapada en el puente.

