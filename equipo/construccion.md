# Bitácora de Construcción

Soy el agente que **arma el juego**: tomo la lista de verbos (Enseñanza) y las reglas con sus números (Mecánica) y los convierto en algo que se abre y se juega. No decido qué verbos van ni cuánto dura una fila: eso ya venía decidido y no lo toqué.

Esta bitácora tiene dos partes porque el trabajo tuvo dos pasadas. La primera salió correcta y fea. La segunda es la que quedó.

## 1. Qué me pidieron

**Primera pasada.**

- Un juego que se abra con doble clic y también desde un servidor local, en computador y en celular, sin descargar nada de internet.
- Dos piezas separadas:
  - **El juego sin pantalla** (`js/logica.js`): las reglas funcionando, sin dibujos. Sirve para que después unos "jugadores automáticos" jueguen miles de partidas y midan si el juego es justo.
  - **Lo que se ve** (`js/juego.js` e `index.html`).
- Que las palabras se lean bien. El encargo decía también "figuras simples, un solo escenario, nada de adornos que compitan con las palabras".
- Guardar el avance en el dispositivo sin que el juego se rompa si el navegador no deja.

**Segunda pasada, después de que el dueño lo vio.** El dueño abrió el juego a medio hacer y dijo que se veía horrible, "desfachado de la realidad", que aburría al entrar y que así no se aprendía. Tenía razón. El coordinador reconoció que la frase "nada de adornos" del encargo había empujado hacia eso, y pidió rehacer todo lo que se ve:

- Un lugar de verdad y de día: la calle de un pueblo colombiano camino al colegio.
- Que se sienta correr.
- Que los letreros sean cosas de ese mundo.
- Que el momento de aprender un verbo se celebre en grande y **se oiga en inglés**.
- Que siempre haya algo que hacer.
- Un menú que invite en vez de explicar.

## 2. Qué decidí y por qué

### Lo que se mantuvo de la primera pasada

**El juego sin pantalla no usa dados del sistema.** Tiene su propio "dado" que arranca de un número (la semilla). Con la misma semilla y las mismas jugadas, la partida sale idéntica: un error se puede repetir y mirar.

**El tiempo se corta justo donde pasa algo.** En vez de preguntar 60 veces por segundo "¿ya llegó el letrero?", el juego calcula el instante exacto en que llega. La partida da lo mismo en un aparato rápido que en uno lento.

**El tamaño de la letra se mide, no se calcula a ojo.** Para cada fila el juego le pregunta al navegador cuánto ocupa la palabra más larga y escoge la letra más grande con la que cabe.

**Botones de verdad** para todo lo que se toca con el dedo, y una pantalla final que se puede desplazar.

### Lo que se rehízo en la segunda pasada

**Un pueblo, no una calle gris.** Cielo azul con sol y nubes que se mueven, tres capas de montañas, casas de colores con puerta, ventana, zócalo, tejado de barro y balcones con matas, tiendas con su aviso y su toldo, postes con cables, árboles y banderines de lado a lado. Todo dibujado con formas simples, sin imágenes.

**Dos maneras de dibujar la distancia, a propósito.** Es la decisión más importante de esta pasada:

- El pueblo se dibuja con perspectiva de verdad: las casas nacen pequeñas al fondo y crecen hasta salir por los bordes. Eso es lo que da la sensación de correr.
- Los letreros no. Si siguieran esa misma perspectiva nacerían diminutos y no se podrían leer hasta el último segundo. Por eso van **colgados de una cuerda, en el aire**, y aparecen ya casi a su tamaño final, como pidió Mecánica. Al estar colgados y no plantados en el piso, no se nota que avanzan a otro ritmo que las casas.

**Los letreros son pancartas.** Fondo claro, borde oscuro, sombra en el piso. Al acertar: confeti, campanita, la pancarta correcta se ilumina y la palabra vuela al marcador. Al fallar: la pancarta se parte en dos, la pantalla se sacude y destella en rojo, el monstruo ruge y la correcta queda iluminada.

**El verbo que se recoge es un libro grande y amarillo.**

**El marcador es una pizarra** verde con letra de tiza, donde se va armando la cadena `GO → went → gone`.

**Cada verbo completado se celebra en grande.** Sale una cinta con las tres formas en mayúsculas (`TAKE · TOOK · TAKEN`), el significado debajo, el profesor celebrando y el estudiante saltando.

**El juego habla en inglés.** Usa la voz que trae el navegador. Dice el verbo al recogerlo, la forma correcta al pasar cada fila (también cuando el estudiante falla: oye la buena) y las tres seguidas al completar el verbo. Si el aparato no tiene voz en inglés, no dice nada y el juego sigue igual: preferí el silencio a una voz en español leyendo inglés. Hay un botón para apagarla.

**Estrellas para los ratos vacíos.** En los tramos sin letreros aparecen estrellas que dan puntos. Hay racha con multiplicador ("¡Racha x3!") y mejor puntaje guardado. Tres cuidados:

- Las estrellas nunca están a la vista junto a una fila de respuestas: todas llegan antes de que aparezca la fila. No pueden señalar el carril correcto.
- Los puntos no cambian quién gana ni quién pierde.
- Usan un dado aparte, así que las partidas salen exactamente iguales que antes de añadirlas. Lo comprobé (ver abajo).

**El profesor es un personaje.** Tiene cara, gafas, bigote, saco verde, corbata y tiza. Sale desde la izquierda con un globo de diálogo para la pista, para presentar cada grupo y para enseñar a jugar.

**Se aprende a jugar jugando.** El menú ya no explica nada. En el primer verbo de la primera partida el profesor dice "¡Recoge el libro!", salen flechas animadas hacia el lado donde hay que moverse, y luego "Ahora su PASADO" y "Y ahora su PARTICIPIO".

**El monstruo está vivo.** Ondula, sigue al estudiante con los ojos, abre la boca cuando se acerca, se encoge un instante con cada acierto y crece y ruge con cada error.

**El menú es la escena.** El pueblo en movimiento, el estudiante corriendo, el monstruo detrás, un título grande y un botón enorme "¡A correr!". Los otros modos van más pequeños.

**La pantalla final también es el pueblo.** Si ganó: el colegio de frente, el estudiante saltando en la puerta y el monstruo diminuto. Si perdió: el monstruo satisfecho y un "¡Otra vez!" grande. Debajo, el puntaje y la tabla de verbos de siempre.

**Ayudas para mirar y probar sin jugar:** `?semilla=7` repite la misma partida; `?modo=grupo&grupo=en` entra directo; `?auto=1` hace que se juegue solo (`?auto=0.8` falla 2 de cada 10) y `&rapido=10` lo acelera. La tecla P pausa.

## 3. Qué salió mal o qué dudé, y cómo lo noté

**Lo más grave: entregué algo correcto que nadie querría jugar.** La primera versión cumplía todo lo medible: las palabras cabían, los jugadores automáticos ganaban y perdían como debían. Y era una calle gris sobre fondo casi negro, con un menú que era un muro de texto. Yo la miré en capturas y la di por buena, porque comparaba contra la lista de requisitos y no contra "¿esto le daría ganas a un estudiante?". Lo notó el dueño al abrirla, no yo. La lección para contar: una lista de requisitos cumplida no dice si la cosa sirve, y "nada de adornos" lo leí como "nada de vida".

**La banda de celebración casi no salía.** La había atado a "verbo aprendido", y en las primeras partidas cada verbo da dos vueltas: solo cuenta como aprendido en la segunda. Lo vi en una captura donde esperaba la cinta y no estaba. Ahora sale cada vez que se completa un verbo.

**Mis capturas no eran del momento que yo creía.** El juego seguía corriendo solo entre una orden mía y la siguiente, así que en una captura que debía mostrar un acierto el estudiante ya había fallado. Añadí una pausa para poder mirar un instante exacto.

**En el menú el monstruo quedaba tapado por el botón.** Lo vi en la captura y subí la escena.

**Árboles demasiado grandes** tapaban las casas en el celular. Los reduje y puse menos.

**De la primera pasada:** mis propias medidas me dijeron que 36 filas "no cabían" y era un error mío de medio píxel al redondear; lo corregí dejando un pelo de holgura. Hoy las 186 filas posibles caben.

**Lo que sigue sin gustarme:**

- Las pancartas avanzan más despacio que el piso. Es el precio de que se lean desde que aparecen. Colgadas se disimula, pero quien se fije lo va a ver.
- En pantallas bajitas y en horizontal, cuando hay peligro el monstruo tapa las piernas del estudiante.
- El estudiante se ve pequeño al lado de las puertas de las casas.
- Los postes que pasan muy cerca se ven como barras oscuras en los bordes.
- El dibujo es más pesado que antes. En mi computador cada cuadro toma unos 5 milésimas de segundo; en un celular modesto no sé cuánto.

**Lo que no pude ver ni oír:**

- **No oí nada.** Ni los sonidos ni la voz en inglés. Mi navegador de pruebas no tiene voz en inglés instalada, así que allí el juego hizo lo previsto: quedarse callado. Que hable bien en un celular real no está comprobado, y es la parte más valiosa de esta pasada.
- **No pude abrirlo con doble clic** en mi navegador de pruebas (solo acepta páginas servidas). Revisé que no use nada de lo que falla al abrir así.
- **No lo vi en un celular real.** Solo en ventanas de tamaño de celular.
- **No lo vi correr de corrido en la segunda pasada.** Lo miré cuadro por cuadro, adelantándolo a mano. Las casas sí cambian de sitio entre un cuadro y otro, pero la sensación de correr no la he visto en movimiento.
- En la segunda pasada no volví a capturar la vista acostada de celular (740×360), la lista de grupos ni el botón de copiar. El código de copiar no cambió.

## 4. Qué necesito de otro agente o del dueño

**Al dueño:**

- Abrir `index.html` con doble clic en el computador y en un celular real, con el volumen arriba. Tres preguntas: ¿habla en inglés?, ¿va fluido?, ¿se siente correr?
- Decir si el pueblo es el que tenía en la cabeza. Es un pueblo genérico de casas de colores; si quiere algo más parecido al de Tinto, hace falta que diga qué.

**A Mecánica:**

- Confirmar tres cosas que el diseño no decía y decidí yo: doy un segundo de pausa al terminar todo turno cuya última fila se acierta (no solo los limpios); si todos los verbos están descansando, la partida toma los que menos descanso les falta; cuando el estudiante no ha fallado, dejo fijo el error más común y roto el otro.
- Las estrellas y los puntos son números míos y están al inicio de `js/logica.js` (`VJ.EXTRAS`), no en su tabla. Si quiere moverlos o cambiarlos, son suyos.
- `letraMinima` da 15,8 píxeles en un celular de 360, no 16. En la práctica la letra más pequeña que sale es de 17.
- Para que un verbo salga como "sabido" hacen falta 5 partidas seguidas sin fallarlo: el menú va a decir "0 sabidos" mucho tiempo. Por eso ahora muestra también cuántos van "vistos".

**A Enseñanza:**

- Ninguna palabra pasa de 8 letras y todas caben. Una de 9 cabe justa.
- El juego dice en voz alta las formas tal como están escritas en su lista. Vale la pena que alguien que sepa inglés oiga cómo las pronuncia la voz del aparato, sobre todo `read`-`read` si algún día entra, y las de `-ought`.

**A Pruebas:**

- El juego sin pantalla se carga con `require` de `verbos.js`, `reglas.js` y `logica.js`, y queda en `globalThis.VJ`.
- Para saber a qué carril ir: `partida.estado.objetos[0].correcta` (sirve para el libro y para la fila). Hay un atajo `partida.irA(carril)`.
- Un paso nunca avanza más de 0,25 segundos aunque se le pida más; el tiempo real está en `estado.tiempo`.
- Hay un evento nuevo, `estrella`, y campos nuevos (`estado.puntos`, `estado.estrellas`, `estado.multiplicador`). No afectan el resultado: jugué 300 partidas con la versión de antes y con la nueva, con los mismos jugadores automáticos, y las 300 salieron idénticas.
- Mis números con jugadores sencillos (2.000 a 3.000 partidas cada uno) coinciden con los de Mecánica: al azar gana 0 de 2.000; quieto pierde a los 17,45 segundos; acertando 7, 8, 9 y 9,5 de cada 10 gana 17 %, 57 %, 92 % y 99 %. Son una primera mirada, no reemplazan su medición.

## 5. Tercera pasada: la revisión con oraciones (con plazo de 35 minutos)

- **Qué pasó:** el dueño probó la segunda versión ("se ve mejor", "la voz sí suena") y aprobó lo que acordó el debate: una revisión donde el verbo se usa en una oración.
- **Qué hice:** un puente donde la Ignorancia cierra el paso. Arriba queda quieta la oración con un hueco, la palabra clave resaltada (yesterday, have), su traducción y una ficha con el verbo que se pide. Abajo, tres letreros boca abajo: "Piénsala… y toca". Sin reloj y sin perder.
- Al acertar, la palabra entra al hueco, suena la oración completa en inglés y el monstruo se achica. Al fallar, se ve la correcta con su razón (`have → participio: run`), el monstruo no se achica y la oración vuelve una vez al final.
- Aparece al ganar una carrera (4 oraciones; 6 si con esa carrera se completó un tramo de 10 verbos) y también desde el menú, botón "Revisiones", sin exigir progreso.
- **Arreglos que pidió Pruebas:** un verbo no vuelve más de 2 veces y la partida tiene tope de 12 turnos; salir a mitad de partida guarda lo ya fallado; "Lo que me cuesta" con un solo verbo se rellena con otros ya vistos.
- **Más justo:** no recoger el libro ya no cuenta como error; el libro vuelve a salir en el carril del jugador. El jugador que no toca nada sigue perdiendo (300 de 300), ahora a los 56 segundos y no a los 17.
- El marcador muestra el molde (`Yesterday I ___`, `I have ___`) en vez de solo "pasado / participio".
- **Lo que no alcancé:** la palabra no "vuela" al hueco, aparece con un salto. No vi el marcador nuevo completo en captura, ni la revisión en computador acostado, ni oí la oración. Los números nuevos los puse yo al final de `js/reglas.js` con permiso del coordinador: Mecánica debe revisarlos.
- **Lo que sigue sin gustarme:** "Era: run" queda encima del estudiante, y el profesor en el puente celebra en vez de empujar al monstruo.

## 6. Cuarta pasada: los regulares infiltrados y el puente pulido (sin afán)

**Qué me pidieron.** Cerrar un truco que encontró el equipo: como ninguna respuesta correcta terminaba en -ed, bastaba con "nunca escojas la que termina en -ed". Además, pulir el puente, medirlo en todos los tamaños y que una victoria con verbos pendientes no se disfrace de victoria limpia.

**Qué hice.**

- **Verbos regulares mezclados.** En cada carrera entran 2 verbos regulares (walk, play…) en sitios al azar, nunca el primero ni dos seguidos. No se anuncian: se ven como cualquier otro, y ahí la respuesta sí es la de -ed. Al completarlos la cinta dice "¡Regular! Solo -ed". En la pantalla final van aparte ("Regulares infiltrados"). En cada revisión del puente, una oración es de un regular.
- **Orden cambiado en los repasos.** En un verbo ya visto antes (y en los regulares), la mitad de las veces se pide primero el participio y después el pasado. Así la segunda fila no sale gratis por descarte. En un verbo nuevo el orden sigue igual. La pizarra muestra siempre la cadena en su orden natural, con un "?" en el sitio que se está pidiendo.
- **El puente.** La palabra ahora vuela del letrero al hueco. La corrección ya no cae encima del estudiante: va en el tablero. El profesor se ve de espaldas, frenando al monstruo con un libro abierto como escudo, y solo celebra cuando el estudiante acierta. El monstruo hace "¡Puf!" y se encoge con el acierto a la primera, y se ríe ("¡Ja, ja, ja!") con el error.
- **Victoria honesta.** Si se llega al colegio con verbos sin resolver, el título dice "¡Llegaste! Te quedó 1 verbo por repasar", y el texto de copiar también.
- **El libro.** Si pasa de largo, el profesor dice "¡El libro! Recógelo" y vuelve por el carril del jugador, sin estrellas. Si pasa otra vez, el profesor cruza y se lo entrega ("¡Toma el libro!"), sin puntos.

**Qué salió mal y cómo lo noté.**

- **El monstruo quedaba escondido detrás del tablero** justo cuando se reía, y en computador se le tapaba la cara siempre. Lo vi en las capturas. Bajé la escena y lo achiqué; en celular acostado corrí la escena a la derecha.
- **Mi propia medida me engañó otra vez.** Marcó 33 letreros "apretados", incluida una palabra de 5 letras en una pantalla enorme. El error era mío: medía el letrero ya girado (el del error se inclina). Corregida la medida, quedaron 8 casos reales, todos palabras de 9 letras en pantallas angostas (forgotten, boughten). Ahora la letra de los tres letreros se achica por igual cuando una palabra no cabe.
- **Una prueba vieja mía dejó de servir:** comprobaba que el libro nunca saliera en el carril del jugador, y ahora, a propósito, sí sale la segunda vez.
- **La pizarra pegaba dos frases** ("HAVE (tener)I have…") cuando se pedía primero el participio. Lo vi al ampliar la captura; faltaba una flecha.

**Lo que medí.** Las 144 oraciones, puestas en el tablero de verdad, en 320, 360, 390 y 412 de ancho, en 740×360 y en 1280×720: ninguna se sale, ninguna pasa de dos renglones, todo cabe sin desplazar aun con la corrección abierta, y las tres palabras caben en sus letreros. Con los regulares apagados y el orden fijo, 500 partidas salen idénticas a las de antes del cambio. El truco "nunca la de -ed" pasó de servir a ganar 0 de 400 partidas.

**Lo que sigue flojo.** La carrera sin errores ahora dura unos 2 minutos (antes 1:40) por los dos turnos extra. En celular acostado el puente se ve apretado: el tablero tapa media escena. El profesor de espaldas se entiende, pero es un dibujo tosco. No oí nada de esto: ni la voz ni los sonidos nuevos.

**Qué necesito.** De Pruebas: su banco marca 6 requisitos que ya no aplican tal cual, porque cuenta los regulares como "verbos nuevos" (72 verbos en vez de 60, 10 turnos en vez de 8, 6 "nuevos" por partida) y revisa las 24 oraciones de regulares contra la lista de irregulares. De Mecánica: revisar los tres números que añadí (`regularesPorPartida`, `revisionRegulares`, `ordenAlAzarEnRepaso`).

### Retoque tras la cuarta pasada

- **El puente en el proyector.** El coordinador vio en captura que en pantalla ancha el tablero tapaba al monstruo y a medio profesor. Yo lo había dado por bueno mirando una captura reducida. Ahora, en toda pantalla ancha, el tablero va a la izquierda, los letreros a la derecha y los personajes abajo, completos, con y sin la corrección abierta. Lo miré en 1280×720, 1024×768 y 1366×768.
- **Llegar con verbos pendientes ya no se celebra como victoria limpia:** el estudiante no salta, no hay confeti ni "¡Nuevo récord!", y el profesor señala lo que falta ("Falta: HAVE").
- En este retoque no toqué la lógica: Pruebas la estaba midiendo.

### Último retoque (tras la tercera ronda de Pruebas)

- **El orden delataba al regular.** Un verbo nunca visto que pedía primero el participio solo podía ser regular. Lo encontró Pruebas. Ahora un regular que el jugador no ha visto se trata como verbo nuevo: pasado y luego participio.
- **Un regular fallado ya no cuenta como "pendiente"** ni quita la victoria limpia: no vuelve ni entra al repaso, así que decir "te quedó un verbo por repasar" era falso.
- **Los errores repetidos se agrupan** en la pantalla final ("goed ×3") en vez de repetir la misma línea.
- No lo vi en pantalla: lo comprobé solo con jugadores automáticos.

## 7. Cuarta etapa: el mapa de las 6 cuadras, la caja de fichas, el termómetro Pre/Post y el Modo Salón

**Qué me pidieron.** Transformar el juego en una herramienta semestral para noveno grado y dejarlo listo para la muestra de profesores del miércoles, tanto en celular (`360×740`) como en proyector (`1280×720`), sin conexión a internet y sin usar `<input>` nativos que levanten el teclado del celular y tapen el puente.

**Qué hice en `index.html` y `js/juego.js`:**

- **Portada con el Mapa vivo de las 6 Cuadras (`#menu`).** Los 60 verbos irregulares ahora se recorren como un camino visible de 6 cuadras de 10 verbos (`1. Salida de Casa`, `2. La Panadería`, `3. El Parque`, `4. La Estación`, `5. El Puente Mayor`, `6. El Colegio`). Cada cuadra muestra sus 10 ladrillos de verbo con tres estados claros: gris (nuevo), ámbar (en práctica) y verde con estrella (`¡Sabido!`). Incluye un botón discreto para el docente (`🔓 Soy el profe: abrir todas las cuadras`) que permite saltar a cualquier cuadra durante la clase o la muestra del miércoles.
- **Cintillos de fila y ocultación del significado en la calle (`juego`).** Cuando la lógica activa `ocultarSignificadoLibro` porque va a preguntar el significado en español, ni el libro dorado ni el marcador superior revelan la traducción antes de tiempo; se destapa apenas el estudiante pasa esa fila. Además, las filas llevan cintillos de alto contraste (`SIGNIFICADO` en turquesa, `DIDN'T ___ (BASE)` en morado, `PASADO` y `PARTICIPIO`) y la banda festiva al cerrar un verbo muestra una oración real corta junto a las tres formas.
- **Caja de Fichas de Letras en el Puente (`#revision`).** Para las preguntas de producción activa, construí una cuadrícula `4×2` de 8 botones grandes (`≥ 48×48 px`): 7 letras únicas en mayúscula más el botón `⌫`, junto con el visor superior de letras armadas, el botón `✓ Listo` y un botón opcional de micrófono (`🎤`) cuando el navegador soporta reconocimiento de voz. No hay ningún `<input>` nativo, por lo que en celular jamás se abre el teclado virtual ni se tapa al profesor ni a la Ignorancia. También responde al teclado físico (`a-z`, `Backspace`, `Enter`). En el segundo intento muestra el esqueleto con la primera letra (`w _ _ _`) y apaga las fichas trampa que indica la lógica. Al terminar el puente, llama a `VJ.aplicarRevisionAHistorial` para coronar los verbos producidos como `¡Sabidos!`.
- **Cuatro correcciones visuales que estaban pendientes:**
  1. En `360×740`, las filas falladas ahora se desvanecen rápido y dejan de dibujarse en cuanto asoma la siguiente fila para que los letreros rojos partidos nunca se monten sobre la fila nueva.
  2. En `1280×720`, la pantalla de victoria calcula el borde inferior real de la tarjeta de título/puntaje (`#finPuntajeCaja`) y planta el edificio del colegio más grande y más abajo, de modo que el cartel y el asta de la bandera nunca tocan el texto superior.
  3. Rehíce `dibujarProfesorFrena` en el puente con hombros redondeados, cuello, pelo canoso con mechones, patillas de las gafas y brazos abiertos con manos claras sosteniendo el libro abierto.
  4. Durante `volarPalabra()` en el puente, la carta o visor de origen recibe la clase `.enVuelo` (`opacity: 0`) para que la palabra no se vea duplicada mientras vuela al hueco de la oración.
- **Termómetro Pre/Post (`#prepost`) y Vista del Profe (`#profe`).** Añadí el diagnóstico rápido de 5 preguntas y 45 segundos con botón honesto `Paso / Aún no lo sé (sin adivinar)`, que guarda el resultado Pre y Post por cuadra en el dispositivo y genera el código verificable de 6 caracteres (`VJ.codificarReporte`). La Vista del Profe permite cargar con un clic la simulación realista de un salón de 25 estudiantes (`✨ Cargar ejemplo de salón`), agregar códigos reales (`➕ Agregar código de estudiante`), ver las barras comparativas Antes (Pre) vs. Después (Post), identificar los 3 verbos con más tropiezos del salón y lanzar de inmediato una revancha en Modo Salón con esos verbos.
- **Modo Salón por Equipos (`#salonConfig` y `salon`).** Permite elegir 2 o 3 equipos (`Equipo 1 Azul`, `Equipo 2 Amarillo`, `Equipo 3 Verde`), pinta insignias gigantes `[ 1 ]`, `[ 2 ]`, `[ 3 ]` sobre cada pancarta de carril para votar a distancia desde los pupitres, soporta las teclas `1, 2, 3` y la barra espaciadora (`⏸ Pausa del Profe`), suma `+100` y resta `-50` sin muerte súbita en la calle, hace relevos cada 4 verbos con cartel de cambio de equipo, pasa al Duelo del Puente con rebote (`¡REBOTE PARA EL EQUIPO X (+100 pts)!`) y cierra con podio y los "3 verbos del día para anotar en el cuaderno".

**Qué NO pude comprobar directamente.** Como en esta sesión trabajé únicamente editando los archivos asignados sin ejecutar comandos de consola ni abrir un navegador real, no pude ver en vivo las animaciones ni escuchar el micrófono o la síntesis de voz. Dejé lista toda la interfaz de inspección en `window.juego` (`iniciar`, `iniciarRevision`, `iniciarSalon`, `iniciarPrePost`, `abrirVistaProfe`, `medidas`, `medidasRevision` con `modo: 'fichas'`, `fichas` y `botonListo`, y `estado`) para que el agente de Pruebas y el coordinador puedan verificar cada pantalla y medir todos los rectángulos en `360×740` y `1280×720`.
