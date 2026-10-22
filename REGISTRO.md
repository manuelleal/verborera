# Registro del proceso — juego de verbos irregulares

Este documento cuenta, paso a paso, cómo se hizo el juego: qué se pidió, quién lo hizo, qué decidió y qué salió mal. Está escrito para alguien que no programa.

**Cómo leerlo.** "El dueño" es el profesor que pidió el juego. "El coordinador" es el asistente de IA del chat principal: reparte el trabajo, junta las piezas, revisa y escribe este registro. "Los agentes" son otros asistentes de IA que el coordinador pone a trabajar, cada uno con un rol y con sus propios archivos. Cada agente deja además su bitácora en la carpeta `equipo/`.

---

## Paso 1 — El encargo

**Qué se pidió.** Un juego para aprender verbos irregulares en inglés (base, pasado, participio), derivado de un juego anterior llamado Tinto. El estudiante corre por tres carriles, lo persigue el Monstruo de la Ignorancia, recoge un verbo y tiene que pasar por el carril del pasado correcto y luego por el del participio. Condiciones: figuras simples, palabras grandes, estrategia de aprendizaje real (no azar), errores típicos como opciones falsas, que funcione en computador y celular, y que el proceso quede registrado. Aclaración final del dueño: es para una exposición, con unos 30 verbos basta.

**Quién.** El dueño lo escribió; el coordinador leyó los dos documentos de arranque (`ARRANQUE.md` y `COMO-SE-HIZO-TINTO.md`) antes de tocar nada.

**Qué enseña.** El encargo venía con la idea completa, las condiciones y la forma de trabajar. En el proyecto anterior la primera instrucción fue una sola frase y la IA construyó otro juego. Un encargo completo evita ese error.

## Paso 2 — Decisiones del coordinador antes de repartir

El dueño pidió no recibir muchas preguntas, así que el coordinador decidió y anotó:

| Decisión | Por qué |
|---|---|
| El juego se dibuja en 2D con sensación de profundidad, sin el motor 3D de Tinto | El dueño pidió "sin renderizar tanto" y que lo importante fueran las palabras. Además, sin motor 3D el juego no necesita internet y abre con doble clic, que es lo que conviene en un salón |
| De Tinto se reutilizan las ideas, no el código | Tinto pesa unas diez veces más de lo que este juego necesita (mundos, tienda, gatos, modelos). Se conservan: los tres carriles, el tropiezo que acerca al perseguidor, la tabla única de reglas y el banco de bots |
| Quien persigue es el Monstruo de la Ignorancia; el profesor es aliado | Así lo pidió el dueño en el encargo |
| Unos 30 verbos | Lo dijo el dueño: es para una exposición |
| La lógica del juego va separada de lo que se ve | Para que los bots puedan jugar miles de partidas en segundos sin abrir una pantalla |
| Se escribió un contrato (`AGENTES.md`) antes de llamar a ningún agente | En Tinto los agentes se pisaban al editar lo mismo. El contrato dice de quién es cada archivo y cómo encajan |

**Algo que salió torcido desde el principio.** El encargo se pegó en el chat del proyecto anterior (GATO) y decía "los archivos que están en esta carpeta", pero los archivos estaban en otra carpeta (VERBOS). El coordinador lo notó porque tenía una nota guardada de la sesión anterior que decía dónde vivía este proyecto, pidió permiso para trabajar en la carpeta correcta y construyó ahí. Sin esa nota habría buscado archivos que no existían o habría mezclado los dos proyectos.

## Paso 3 — El equipo

| Agente | Rol | Construye o piensa | Sus archivos |
|---|---|---|---|
| Coordinador | Reparte, junta, mira y registra | Las dos | `AGENTES.md`, `REGISTRO.md`, `GUIA-PARA-PROFES.md` |
| Enseñanza | Profesor de inglés: qué verbos, en qué orden, con qué errores típicos | Piensa y entrega datos | `js/verbos.js` |
| Mecánica | Diseñador de juego: cómo se juega, con números | Piensa y entrega reglas | `js/reglas.js`, `DISENO.md` |
| Construcción | Programador: hace el juego | Construye | `index.html`, `js/logica.js`, `js/juego.js` |
| Pruebas | Probador: juega con bots y mide | Mide y reporta | `pruebas/bots.js`, `pruebas/INFORME.md` |

Orden de trabajo: Enseñanza y Mecánica a la vez (no dependen uno del otro); después Construcción (necesita lo de ambos); después Pruebas; al final el coordinador mira el juego en capturas.

## Paso 4 — Enseñanza arma la lista de verbos

**Qué se le pidió.** Actuar como profesor de inglés con experiencia con hispanohablantes principiantes: escoger unos 30 verbos, agruparlos por patrón, ordenarlos, escribir para cada uno los errores típicos (las opciones falsas del juego) y una pista corta. Solo pensar y entregar datos, sin construir nada.

**Qué decidió.**

| Orden | Grupo | Verbos |
|---|---|---|
| 1–7 | Pasado y participio iguales | have, make, say, get, tell, find, leave |
| 8–11 | Los rebeldes | go, do, come, run |
| 12–15 | Los que no cambian | put, let, cut, hit |
| 16–23 | Participio terminado en N | take, give, see, know, eat, write, speak, break |
| 24–27 | Los de -ought / -aught | think, buy, bring, teach |
| 28–31 | Vocal i – a – u | drink, sing, swim, begin |

- El orden va por grupos, de lo fácil y frecuente a lo exigente, para que el patrón se note.
- **Dejó por fuera el verbo BE**, el más usado de todos, porque tiene dos pasados (was/were) y en un letrero cabe una sola palabra. Es una decisión que el dueño puede cambiar.
- Dejó por fuera los verbos con dos formas aceptadas (learned/learnt, burned/burnt), porque el juego marcaría como error algo correcto. GET entra con "got" y "gotten" nunca aparece como falso.
- Los falsos son de seis tipos, todos errores reales: la forma regular inventada (goed), la otra forma del mismo verbo (gone por went), la doble marca (wented), el patrón de otro grupo (brang), la ortografía (writen) y el verbo vecino (bought por brought).

**Qué dudó o salió mal (lo dijo el propio agente).**
- No consultó ninguna fuente: la frecuencia y el orden de los errores salen de su conocimiento general. Se fía del orden grueso, no del fino.
- El tercer falso de varios verbos es flojo (putten, hitten).
- Algunos falsos son palabras que existen en inglés aunque no sean la respuesta (founded, seed, thank). Un profesor puede preguntar por ellas.
- En COME y RUN, uno de los falsos del pasado es igual a la base ("come"). Es un error real, pero el estudiante ve en el letrero la misma palabra que acaba de recoger.

**Cómo se comprobó.** El agente escribió una revisión automática: sin verbos repetidos, ningún falso igual a la respuesta correcta, ninguna palabra de más de 9 letras. Lo que esa revisión no puede decir es si los falsos son buenos: eso solo se ve con estudiantes.

## Paso 5 — Mecánica define cómo se juega (a la vez que el paso 4)

**Qué se le pidió.** Actuar como diseñador de juegos educativos: resolver con números cuánto tiempo hay para leer, qué pasa al equivocarse, cuándo vuelve un verbo fallado, cómo se gana, cuánto dura, y demostrar con cuentas que no se puede ganar sin saber.

**Qué decidió.**
- **Un letrero a la vez.** Primero el verbo, luego la fila del pasado, luego la del participio. Nunca dos filas a la vista.
- **4,5 segundos para leer cada fila** al empezar; baja poco a poco hasta 3,5 si el jugador acierta y vuelve a subir medio segundo tras cada error. El juego afloja cuando el estudiante se equivoca.
- **Arriba siempre dice qué se pide**: "GO (ir) → pasado: ?".
- **Equivocarse** abre un peligro que dura dos filas: otro error ahí es captura. Tras el error el juego no se congela: deja la calle vacía un momento y muestra la forma correcta en grande, lo elegido tachado y la pista del profesor.
- **El verbo fallado vuelve después de dos verbos distintos**, y trae como opción el mismo falso que el estudiante eligió.
- **Una partida son 8 turnos**: 4 verbos nuevos y 4 de repaso. Se gana cuando no queda ninguno pendiente. Dura entre 1:40 y 3 minutos.
- **No recoger el verbo también es un error**, para que quedarse quieto no sirva.
- **La respuesta correcta se reparte parejo entre los tres carriles** y nunca cae tres veces seguidas en el mismo.
- **Añadió algo que nadie pidió: un comodín.** El profesor salva al estudiante de una captura, una vez; se recarga con seis aciertos seguidos. Su razón: sin eso, un estudiante que acierta 9 de cada 10 perdería una de cada cuatro partidas.

**Sus cuentas** (hechas a mano y con un modelo de dados, no con el juego, que todavía no existía):

| Jugador | Gana |
|---|---|
| No toca nada | 0 % (pierde a los 16–18 segundos) |
| Elige al azar | 0 % |
| Acierta 7 de cada 10 | 17 % |
| Acierta 9 de cada 10 | 93 % |
| Siempre acierta | 100 % |

**Qué dudó o salió mal.**
- Los 4,5 segundos son un cálculo razonado, no una medición con personas. Es el primer número que hay que mirar cuando alguien juegue.
- Rehízo su plan a mitad de camino: iba a inventar su propia fórmula de repaso, vio que Enseñanza ya había dejado su criterio y lo adoptó.
- El comodín contradice a medias la frase del dueño "dos errores seguidos y lo atrapa".

**Decisión del coordinador sobre el comodín.** Se deja, porque encaja con la idea de que el profesor es el aliado, pero queda como un solo número en la tabla de reglas: poniéndolo en cero, el juego vuelve a la regla literal. Es de las cosas que el dueño debe probar y decidir.

**Qué enseña este paso.** Dos agentes que trabajaban a la vez, cada uno en su archivo, no se estorbaron; y uno aprovechó lo que el otro iba dejando. Eso funcionó porque el contrato decía de antemano qué forma tendrían los datos.

**Decisión del dueño sobre BE.** El coordinador le contó que Enseñanza había dejado BE por fuera y por qué. El dueño respondió: "deja BE por fuera". Queda cerrado. Es un ejemplo de decisión de fondo que toma la persona: el agente propone y explica, el profesor decide.

## Paso 6 — Construcción hace la primera versión

**Qué se le pidió.** Actuar como programador: construir el juego completo con los verbos de Enseñanza y las reglas de Mecánica, separando la lógica (lo que pasa) de la pantalla (lo que se ve), y comprobarlo antes de entregar.

**Qué comprobó de verdad.** Sin abrir pantalla, hizo jugar miles de partidas: un jugador que siempre acierta ganó todas; uno que no toca nada perdió a los 17 segundos; uno al azar no ganó ninguna de 2.000; uno que acierta 9 de cada 10 ganó el 92 %, casi lo mismo que Mecánica había calculado a mano (93 %). Midió las 186 filas de letreros posibles en un celular angosto y todas caben sin montarse.

**Qué dijo que NO pudo comprobar.** Abrir con doble clic, un celular real con un dedo real, el sonido y una partida entera a velocidad normal. Es útil que lo diga: un "todo probado" habría sido falso.

**Dónde se apartó del diseño**, y lo avisó: nueve ajustes pequeños. Por ejemplo, el diseño no decía qué hacer si un estudiante ya vio todos los verbos y no queda ninguno por repasar; el constructor lo encontró al encadenar 14 partidas y lo resolvió.

## Paso 7 — El dueño lo abre antes de tiempo y lo rechaza

**Qué pasó.** Mientras Construcción terminaba, el dueño abrió el juego por su cuenta. Su veredicto, en sus palabras: "se ve horrible, completamente desfachado de la realidad, eso parece basura… no aprendió ni a palo, me aburrí solo con entrar".

**Cómo se verificó.** El coordinador abrió el juego y tomó capturas. Lo que vio: una calle gris oscura sobre fondo negro, sin nada a los lados; un menú que era una lista de instrucciones; y cuatro segundos y medio de espera entre letrero y letrero sin nada que hacer. Las palabras se leían perfectamente y todas las mediciones estaban en verde.

**De quién fue el error.** Del coordinador, no del constructor. El dueño había pedido "sin Blender ni modelos pesados: figuras simples" y "lo que tiene que verse bien son las palabras". El coordinador lo convirtió en una orden más dura: "nada de adornos que compitan con las palabras", y además descartó el aspecto del juego anterior. El constructor obedeció al pie de la letra. "Simple" no quería decir "vacío".

**Qué enseña.** Es la lección más importante del proyecto hasta ahora, y es la misma de Tinto: **los agentes miden, las personas notan.** Tres agentes y decenas de pruebas dijeron que todo estaba bien; una persona tardó diez segundos en ver que nadie querría jugarlo. Ninguna prueba automática mide si algo aburre.

**Qué se decidió.** No se bota lo hecho: la lógica y las reglas sirven. Se le encargó a Construcción una segunda pasada solo sobre lo que se ve y se siente: una calle de pueblo de día con casas que pasan, personajes animados, letreros que son pancartas colgadas, confeti y sacudidas, las tres formas del verbo en grande y dichas en voz alta en inglés, estrellas para recoger entre verbos, puntaje y racha, y un menú con un solo botón. Sigue sin Blender y sin internet.

## Paso 8 — Segunda pasada de Construcción: el juego consigue un lugar

**Qué se le pidió.** Rehacer lo que se ve y se siente, sin tocar las reglas: pueblo de día, personajes animados, pancartas colgadas, confeti, voz en inglés, estrellas, puntaje, menú con un botón.

**Cómo se comprobó que no dañó lo que ya servía.** Jugó 300 partidas con la lógica vieja y con la nueva, con los mismos bots: las 300 salieron idénticas. Es la regla de "medir antes y después con las mismas pruebas".

**Qué dijo que no pudo comprobar.** "No oí nada" (su navegador de pruebas no tiene voz en inglés) y "no lo vi en movimiento" (lo revisó cuadro por cuadro). Lo dijo en la primera línea de su informe.

**Qué hizo el coordinador.** Abrió el juego y lo miró en capturas: menú, libro del verbo, filas de pasado y participio, pantalla de derrota. Encontró un defecto menor (un texto cortado en el borde) y avisó al dueño que ya podía probar, diciéndole exactamente qué faltaba por comprobar: la voz, el movimiento y el celular.

**Qué dijo el dueño al probar.** "Se ve mejor." Primero reportó que la voz no sonaba; un rato después: "la voz sí suena, está chévere". Lo único que ningún agente pudo verificar lo verificó la persona en un minuto.

## Paso 9 — Pruebas juega mal a propósito

**Qué se le pidió.** Ser un probador escéptico: no creerle al constructor, volver a medir con su propio código, y sobre todo inventar tramposos: jugadores que intentan ganar sin saber inglés.

**Lo que confirmó.**

| Jugador | Gana | Cómo le va |
|---|---|---|
| No toca nada | 0 % | Pierde a los 17 segundos |
| Elige al azar | 0 % | Dura 25 segundos |
| Siempre acierta | 100 % | 9.000 partidas de 9.000, en todos los modos |
| Acierta 7 / 8 / 9 de cada 10 | 17 % / 56 % / 93 % | Lo mismo que Mecánica calculó a mano |
| Siempre el mismo carril, alternar, perseguir estrellas | 0 % | — |

Revisó además más de un millón de filas de letreros: la respuesta correcta cae parejo en los tres carriles y nunca tres veces seguidas en el mismo.

**Lo que encontró, que nadie había visto.**

1. **El truco del "-ed".** Un jugador que no sabe ningún verbo pero sigue la regla "nunca escojas la palabra que termina en -ed" **gana el 63 % de las partidas**, y el 100 % en el grupo de los verbos que no cambian. La causa: casi todos los falsos eran formas regulares inventadas (goed, haved, cutted) y ninguna respuesta correcta termina en -ed. El profesor que armó la lista escogió bien cada error por separado; el problema solo aparece al mirar todos juntos.
2. **Una partida que no termina nunca.** Quien falla siempre el mismo verbo seguía jugando a los 15 minutos, porque el verbo vuelve y vuelve.
3. **Salirse borra los errores.** Si el estudiante va perdiendo y oprime "Menú", no queda registro de lo que falló.
4. Varios menores: el repaso con un solo verbo fallado dura 30 segundos y dice "¡Llegaste al colegio!"; con tan pocos verbos por partida, los descansos programados casi no llegan a notarse.

**Qué enseña.** Las pruebas "normales" (azar, quieto, perfecto) salieron todas bien. El hallazgo grave salió de pedirle al probador que pensara como un estudiante vivo que busca el atajo. Y es un error de enseñanza, no de programación: lo encontró un agente que no sabe de didáctica, midiendo.

**Qué se hizo.** El hallazgo del "-ed" se le pasó a Enseñanza, que justo estaba ampliando la lista, con una regla nueva: de los dos falsos que más se usan en cada fila, como mucho uno puede terminar en -ed. Los otros hallazgos quedan para la próxima pasada de construcción.

## Paso 10 — El dueño pide pensar antes de seguir construyendo

**Qué pidió.** "Manda unos agentes a discutir cómo mejorar la dinámica del juego. La idea es que aprendan verbos; cada 10 verbos se hace una revisión, como oraciones, o ordenar, o conectar… solo piensa en eso." Y después: seguir hasta tener una cantidad interesante de verbos.

**Qué decidió el coordinador.**
- Montar un debate con tres voces distintas, cada una en su archivo (`equipo/debate/`): un profesor experto en didáctica, un diseñador de juegos y un "abogado del estudiante" que habla por el que se aburre y por el profesor con un proyector y 15 minutos. Primero proponen por separado, sin verse; después cada uno lee a los otros dos y los critica. Nadie construye.
- La pregunta se escribió en un archivo común (`0-pregunta.md`) con las palabras del dueño tal cual, para que los tres partan de lo mismo.
- "Una cantidad interesante de verbos" se interpretó como ampliar de 31 a unos 60. Se le encargó a Enseñanza. Es una interpretación del coordinador: el dueño puede corregirla.

## Paso 11 — El debate: tres agentes discuten la dinámica

**Quiénes.** Tres agentes que solo piensan: Didáctica (profesor de inglés), Juego (diseñador) y Estudiante (el que se aburre con el celular y el profesor con el proyector).

**Cómo se organizó.** Primera ronda: cada uno escribió su propuesta sin ver las otras. Segunda ronda: cada uno leyó las otras dos y tuvo que decir qué aceptaba, qué rechazaba y con qué se quedaba, con la instrucción "cede donde el otro tenga razón: no se trata de ganar". El coordinador escribió la síntesis (`equipo/debate/5-acuerdo.md`).

**En qué coincidieron sin ponerse de acuerdo.** Los tres, por separado, llegaron al mismo diagnóstico (el estudiante aprende "go, went, gone" como una contraseña sin saber cuándo va cada una) y a la misma actividad: completar oraciones con solo dos moldes, "Yesterday I ___" y "I have ___".

**Lo más curioso.** En la pregunta de si la revisión se juega corriendo o quieta, **los tres cambiaron de opinión en la segunda ronda**: los dos que la querían corriendo pasaron a quieta, y el que la quería quieta pasó a corriendo. Quedó quieta por dos contra uno, con un argumento del salón: solo si el juego espera puede votar todo el grupo.

**Dónde le llevaron la contraria al dueño.** Él había sugerido oraciones, ordenar o conectar. Los tres descartaron ordenar y conectar como actividad principal, con razones concretas (en ordenar el verbo ya viene escrito; conectar es lo que la carrera ya hace). El coordinador les pidió que lo revisaran una segunda vez, porque eran ideas del dueño, y que dejaran una razón que se pudiera explicar. Rescataron una versión pequeña de conectar para más adelante.

**Qué enseña.** Pedir opiniones separadas antes de dejarlos leerse evita que el primero que habla arrastre a los demás. Y un agente al que se le dice "defiende tu postura" también puede ceder, si se le pide expresamente. Ninguno de los tres midió nada: es razonamiento, y así quedó escrito.

## Paso 12 — Enseñanza amplía la lista a 60 verbos y corrige el truco del "-ed"

**Qué se le pidió.** Pasar de 31 a unos 60 verbos sin dañar los que ya estaban, y arreglar el hallazgo de Pruebas: que de los dos falsos principales de cada fila, como mucho uno termine en -ed.

**Qué decidió.** 60 verbos en 9 grupos, ordenados de modo que cada corte de 10 cae al final de un grupo (pensando en la revisión cada 10):

| Tramo | Grupo | Verbos |
|---|---|---|
| 1–10 | Pasado y participio iguales | have, make, say, get, tell, sell, find, hear, pay, stand |
| 11–20 | Terminan en -t | leave, feel, keep, sleep, meet, mean, lose, send, spend, build |
| 21–25 | Los rebeldes | go, do, come, become, run |
| 26–30 | Los que no cambian | put, let, cut, hit, read |
| 31–40 | Participio = base + N | take, give, see, know, eat, fall, write, drive, ride, rise |
| 41–45 | Participio = pasado + N | speak, break, choose, forget, wear |
| 46–50 | -ought / -aught | think, buy, bring, teach, catch |
| 51–55 | Vocal i – a – u | drink, sing, swim, begin, ring |
| 56–60 | -ew / -own | grow, throw, fly, draw, blow |

Partió un grupo en dos porque mezclaba dos reglas distintas (taken es la base más N; spoken es el pasado más N). Consultó un diccionario en línea para las formas dudosas y quitó dos falsos que resultaron ser variantes aceptadas (sung como pasado, drank como participio).

**Cómo se comprobó el arreglo.** El coordinador puso la lista nueva en su sitio (guardando copia de la anterior) y volvió a correr el mismo banco de bots de Pruebas, sin cambiarle nada:

| Tramposo "nunca la que termina en -ed" | Antes | Después |
|---|---|---|
| Gana en el camino normal | 63 % | 2,4 % |
| Su mejor grupo | 100 % | 34 % |

**Lo que no quedó resuelto, dicho por el agente.** Mientras ninguna respuesta correcta termine en -ed, el truco nunca baja al puro azar. En el grupo de los que no cambian tuvo que usar falsos que él mismo llama forzados (pat, cat, hat). Su propuesta de fondo: mezclar unos pocos verbos regulares (walk – walked – walked), donde -ed sí es la respuesta; eso desarma el truco y además enseña cuáles no son irregulares. Queda como decisión del dueño.

**Qué enseña.** El ciclo completo en pequeño: un agente mide y encuentra el problema, otro lo corrige en lo suyo, y se vuelve a medir con la misma prueba. Sin la segunda medición, "corregido" sería solo una palabra.

## Paso 13 — El dueño aprueba la revisión y pone un plazo

**Qué dijo.** "Sí, construye la revisión con oraciones." Y enseguida: "hasta las 11 tienes para correr". Eran las 10 de la noche.

**Qué decidió el coordinador con una hora.**
- Saltarse la ronda aparte de Mecánica: los números de la revisión ya estaban discutidos en el debate, así que el coordinador se los pasó directamente a Construcción. Es un atajo: se pierde una revisión independiente de esos números.
- Poner a Enseñanza (las oraciones) y a Construcción (el puente) a trabajar a la vez. Para que el constructor no tuviera que esperar, el formato de las oraciones se escribió primero en el contrato y él probó con oraciones de ejemplo.
- Darle a Construcción la lista en orden de prioridad, con la instrucción "si no cabe en el tiempo, entrega lo de arriba bien hecho y di qué faltó".
- Mientras tanto, el coordinador escribió la `GUIA-PARA-PROFES.md`.

**Qué enseña.** Con plazo, lo primero que se recorta son las revisiones cruzadas, que es justo lo que antes había encontrado los errores. Por eso queda anotado qué se saltó.

## Paso 14 — Se construye la revisión con oraciones

**Enseñanza** escribió 120 oraciones, dos por verbo (una con "Yesterday…" o parecida, que pide el pasado; otra con "have/has", que pide el participio), y las comprobó con una revisión automática y releyéndolas una por una. Marcó ella misma las cuatro menos naturales. GET no tiene oración de participio, a propósito ("I have got" significa "tengo").

**Construcción** hizo el puente en siete minutos: la Ignorancia cierra el paso, el tablero muestra el verbo, la oración con hueco, la palabra clave resaltada y la traducción; tres letreros tapados que se destapan al tocar; sin reloj y sin perder. Además: el botón "Revisiones" en el menú para abrir cualquier tramo sin haber corrido, el marcador con el molde (`Yesterday I ___`) en vez de la palabra "pasado", y los arreglos que había pedido Pruebas.

**Lo que el constructor dijo que quedó flojo:** la palabra aparece de golpe en vez de volar al hueco; el texto de corrección tapa al estudiante; el profesor celebra en vez de frenar al monstruo; nadie oyó la oración.

**El coordinador lo miró en capturas:** el puente tapado, destapado, un acierto con confeti, la lista final de oraciones y el marcador nuevo. No vio un error en el puente.

## Paso 15 — Segunda ronda de Pruebas: un arreglo había creado otro problema

**Qué pasó primero.** El coordinador corrió el banco de bots tal como estaba y salieron 8 fallas de 33. Antes de alarmarse le pidió a Pruebas separar dos cosas: fallas reales, y pruebas que habían quedado viejas porque las reglas cambiaron a propósito.

**Qué encontró Pruebas.**

| Lo que marcaba el banco | Qué era |
|---|---|
| El libro sale en el carril del jugador | Regla vieja: ahora es así a propósito |
| El quieto pierde a los 43 s y no a los 17 | Regla vieja: sigue perdiendo siempre |
| Los aprendices ganan más de lo calculado | Regla vieja: la partida ahora tiene tope |
| El tramposo del "-ed" gana 5,6 % | Falla real, pero pequeña (antes 63 %) |
| **Quien nunca recoge el libro juega para siempre y suma puntos** | **Falla nueva y seria** |

La última es la que importa. Para que un error de dedo no fuera tan castigado, se había decidido que no recoger el libro dejara de ser un error. Resultado: un jugador que esquivaba el libro seguía corriendo a los 15 minutos, recogiendo estrellas, con tres veces más puntaje que el jugador perfecto. **El arreglo de una queja abrió un hueco más grande**, igual que en Tinto cuando se subieron los banderines y quedaron flotando.

También revisó las 120 oraciones: todas cumplen las reglas, y encontró una que quedaba correcta con uno de sus falsos ("They have left us in").

**Qué se hizo.** Faltaban 40 minutos para el plazo, así que el coordinador arregló él mismo las dos cosas, en archivos que no son suyos, y lo deja dicho: la segunda vez que el libro pasa de largo, el profesor se lo entrega al estudiante; y la oración dudosa cambió de falso. Se volvió a correr el banco:

| | Antes del arreglo | Después |
|---|---|---|
| Requisitos sin cumplir | 4 de 43 | 3 de 43 |
| Partida sin final | 50 de 50 | 0 |
| Quieto / azar / perfecto | pierde / no gana / gana siempre | igual |

**Lo que queda sin resolver.**
- El truco del "-ed" sigue rindiendo algo: 5,6 % de victorias en el camino normal y 43 % en un grupo (Participio = pasado + N). En la revisión, quien descarta lo que termina en -ed y la palabra que ya vio en el libro acierta 62 % a la primera. La solución de fondo que propuso Enseñanza, mezclar unos verbos regulares, está pendiente de decisión del dueño.
- Con el tope de 12 turnos, un estudiante que sabe a medias puede "ganar" con verbos pendientes. Pruebas sugiere que la pantalla final lo diga.
- Nadie ha probado con estudiantes reales, ni en un celular real salvo el dueño, ni abriendo el archivo con doble clic.

**Qué enseña.** Cada arreglo necesita su propia vuelta de pruebas; y cuando las reglas cambian, también hay que actualizar la prueba, o empieza a gritar por cosas que ya no son errores y tapa las que sí lo son.

## Paso 16 — Al día siguiente: "sigue corriendo hasta que lo tengas"

**Qué dijo el dueño.** Solo eso. No respondió la pregunta sobre mezclar verbos regulares.

**Qué decidió el coordinador.** Tomarlo como permiso para resolver lo que había quedado pendiente, incluida esa pregunta: se mezclan unos pocos verbos regulares (walk – walked – walked) entre los irregulares, porque es la única forma de que "-ed" deje de delatar la respuesta. Es una interpretación; por eso quedó con un interruptor: un número en la tabla de reglas que, puesto en cero, deja el juego como estaba.

**Lo primero que se comprobó.** Algo que tres agentes habían dejado como "no pude probar": abrir el juego con doble clic sobre el archivo. El coordinador lo abrió directamente desde el archivo con otro navegador, sin servidor, y tomó una captura: carga y dibuja la revisión.

**Lo que se encargó.**
- A Enseñanza: 12 verbos regulares con sus oraciones; rehacer las oraciones poco naturales; y bajar el rendimiento del truco en el grupo donde peor quedó y en la revisión.
- A Construcción: meter los regulares, pulir el puente (que la palabra vuele al hueco, que la corrección no tape al estudiante, que el profesor se vea frenando al monstruo), revisar la pantalla en computador y con el celular acostado, y que la pantalla final diga cuándo se "ganó" con verbos pendientes.

## Paso 17 — Verbos regulares infiltrados y el puente pulido

**Enseñanza** entregó 12 verbos regulares muy comunes (walk, work, play, want, look, live, talk, call, help, start, open, watch), cuyos falsos son irregulares inventados (walken, wolk, workt), y sus oraciones: ya son 144. Sacó a NEED de la lista por una razón que solo aparece al medir: termina en "ed" y confundía la regla. Rehízo las oraciones poco naturales.

También señaló algo que los datos no podían arreglar: como el juego siempre pedía primero el pasado y después el participio, quien recordara cuál acababa de usar tenía media respuesta regalada. **El coordinador lo resolvió por otro lado**: en los verbos de repaso, la mitad de las veces se pide primero el participio. Un problema que parecía de la lista de verbos se arregló en las reglas.

**Construcción** metió los regulares (dos por carrera, sin anunciarlos, y uno en cada revisión), el orden al azar, y pulió el puente: la palabra vuela al hueco, la corrección sale en el tablero, el profesor frena al monstruo con un libro, el monstruo se ríe cuando el estudiante falla. La pantalla final ahora distingue llegar limpio de llegar "con verbos por repasar".

**Lo que vio el coordinador en capturas, y lo que devolvió.** El error en el puente en tamaño de celular: bien. La carrera en pantalla de computador: bien. El puente en pantalla de computador: **el tablero tapaba casi todo el monstruo y medio profesor**. Es justo el caso del proyector en el salón, y el constructor lo había "medido" sin problemas: sus medidas comprobaban que el texto cabía, no que la escena se viera. Se devolvió y quedó con el tablero a un lado.

## Paso 18 — Tercera ronda de Pruebas: el truco del "-ed", cerrado

Jugadores que no saben ningún verbo, mil partidas por casilla:

| Truco | Primera ronda | Segunda ronda | Tercera ronda |
|---|---|---|---|
| "Nunca la que termina en -ed", camino normal | 63 % | 5,6 % | 0,2 % |
| El mismo, en su mejor grupo | 100 % | 11 % | 0,7 % |
| Con memoria de lo que acaba de salir, mejor grupo | 100 % | 43 % | 0,1 % |
| "Siempre la que termina en -ed" | — | — | 0 % |
| En la revisión, aciertos a la primera | — | 62 % | 36 % (el azar da 33 %) |

Con el banco de pruebas al día se cumplen 52 de 53 requisitos.

**El que no se cumple, y por qué se deja así.** Pruebas buscó el mejor tramposo posible probando 6.800 reglas distintas, y encontró una receta de tres pasos con la que se llega al colegio en la primera carrera unas 7 de cada 10 veces, casi nunca "limpio". Funciona porque en la mitad de los verbos el pasado y el participio son la misma palabra, así que la segunda fila repite la primera. Eso no es un truco: es el patrón que el juego quiere enseñar. El coordinador decidió no seguir cerrando: quien descubre esa receta ya entendió tres de los patrones, y la pantalla final le dice que le quedaron verbos por repasar. Pruebas lo resume así: **el juego comprueba que se reconoce la forma y se sabe el patrón, no que se recuerde sin ayuda.** Vale la pena decírselo a los profesores tal cual.

**Lo que sí se arregló de esta ronda.** Pruebas notó que un verbo nunca visto que pedía primero el participio solo podía ser un regular (el orden lo delataba), y que un regular fallado aparecía como "pendiente" sin que el juego lo fuera a repetir. Dos arreglos pequeños, vueltos a medir.

**Un arreglo que casi abre otro hueco, otra vez.** Al quitar los regulares fallados de la cuenta de "pendientes", el coordinador volvió a correr el banco y vio que el mejor tramposo pasaba de llegar "limpio" casi nunca a llegar limpio la mitad de las veces: sus errores eran justamente los regulares, y ya no contaban. Se corrigió en el momento: un regular fallado no es un verbo por repasar, pero sí quita la victoria limpia, y la pantalla final lo dice ("Se te escapó 1 verbo regular: ese solo lleva -ed"). Medido de nuevo: el mejor tramposo llega 65 % de las veces y limpio, 0 %.

**Estado final del banco de pruebas.** 51 de 53 requisitos se cumplen. Los dos que no: el del mejor tramposo, que se deja así por lo explicado arriba; y una prueba que quedó vieja (espera que los regulares nuevos pidan primero el participio la mitad de las veces, y eso se quitó a propósito porque los delataba). Queda anotado para que Pruebas la actualice.

**Lo que queda abierto, para una versión siguiente.**
- Un verbo tarda mucho en volver: con 60 verbos y unos pocos por carrera, a cada uno le toca cada siete u ocho carreras. Ver los 60 le toma 15 carreras a quien no falla.
- Dos carteles de grupo ("base + N", "pasado + N") no predicen bien written, ridden ni worn.
- Algunos falsos son formas que existen en dialectos (thunk, brung).
- Nadie lo ha probado con un grupo real de estudiantes.

## Paso 19 — El dueño pide menos tiempo entre verbos

**Qué pidió.** "Reduce el tiempo entre verbos."

**Qué se hizo.** El coordinador cambió cuatro números en la tabla de reglas, sin tocar el programa: la pausa tras completar un verbo (de 1 s a 0,4), lo que tarda en llegar el libro del verbo siguiente (de unos 3 s a 1,8), la espera al arrancar (de 2 s a 1) y el cartel del grupo (de 3 s a 1,5). El tiempo para leer las tres pancartas no se tocó: ese es el que protege al que apenas está aprendiendo.

**Cómo se comprobó.** Se volvió a correr el banco de bots: entre un verbo y el siguiente ahora pasan unos 2 segundos en vez de 4, la carrera sin errores bajó de 2:03 a 1:43, y nadie gana ni pierde distinto. El banco marca una diferencia nueva que es solo esa: la duración ya no coincide con la de la ronda anterior.

**Qué enseña.** Por tener todos los números en una sola tabla, un cambio de ritmo es editar cuatro líneas y volver a medir, no reprogramar.

---

## Resumen: quién hizo qué

| Agente | Veces que trabajó | Qué entregó |
|---|---|---|
| Coordinador | Todo el tiempo | Contrato, este registro, la guía, la síntesis del debate, dos arreglos de última hora |
| Enseñanza | 4 | 31 verbos; luego 60 con el truco del "-ed" corregido; 120 oraciones; 12 regulares y 144 oraciones |
| Mecánica | 1 | Las reglas y sus cuentas |
| Construcción | 4 y dos retoques | Primera versión (rechazada), el pueblo, la revisión en el puente, los regulares y el pulido |
| Pruebas | 3 | Banco de bots; el truco del "-ed"; la partida sin final; el mejor tramposo posible |
| Debate (3 agentes) | 2 rondas | La propuesta de la revisión con oraciones |

## Las lecciones de este proyecto, en corto

1. Un encargo completo evita construir otra cosa; aun así, una instrucción se puede endurecer al pasar de mano en mano ("simple" se volvió "vacío").
2. Los agentes miden, las personas notan. La primera versión pasó todas las pruebas y aburría.
3. Un buen informe dice qué no se comprobó. La voz solo la pudo oír el dueño.
4. Hay que probar jugando mal y haciendo trampa, no solo jugando bien.
5. Los problemas de conjunto no se ven pieza por pieza: cada falso estaba bien y juntos delataban la respuesta.
6. Medir antes y después con la misma prueba es lo que convierte "arreglado" en un hecho.
7. Arreglar una queja puede abrir otro hueco: cada arreglo pide su vuelta de pruebas.
8. Para decidir cómo seguir, varias voces por separado y luego criticándose.
9. Con afán se recortan las revisiones cruzadas; hay que dejar escrito qué se saltó.
10. Las decisiones de fondo las toma la persona: dejar BE por fuera, rechazar la primera versión, aprobar la revisión.
11. Medir que algo cabe no es mirar que se vea: el puente "sin problemas" tapaba al monstruo en la pantalla del proyector.
12. Hay que saber cuándo parar de cerrar huecos: cuando el "truco" que queda es haber entendido el patrón.

---

## Paso 20 — Cuarta etapa: exploración a fondo y diagnóstico honesto

**Qué se pidió.** Convertir el juego en una herramienta educativa de verdad, de esas que un profesor usaría todo el semestre y de las que un estudiante sale sabiendo más, sin techo: que el estudiante recuerde y produzca (no solo escoja entre tres), que el repaso espaciado funcione de verdad, que el verbo signifique algo en contexto, que se pueda demostrar con datos que funciona (prueba antes y después, vista para el profesor), que sirva en un salón real de 30 estudiantes con proyector en 15 minutos, y que conserve el mundo colorido, sin internet obligatorio y abriendo con doble clic.

**Qué hizo el coordinador antes de proponer nada.**
1. Leyó completos todos los documentos del proyecto (`CONTINUAR.md`, `REGISTRO.md`, `AGENTES.md`, `LEEME.md`, `GUIA-PARA-PROFES.md`, `pruebas/INFORME.md` y los ocho archivos de `equipo/debate/`) y revisó el código completo (`index.html`, `js/verbos.js`, `js/oraciones.js`, `js/reglas.js`, `js/logica.js`, `js/juego.js` y `pruebas/bots.js`).
2. Corrió el banco de pruebas (`node pruebas/bots.js`): tardó 61 segundos y dio **50 de 53 requisitos cumplidos**. Los tres en rojo confirman lo que `CONTINUAR.md` advertía: dos son pruebas viejas que quedaron desactualizadas cuando se acortaron las pausas (el jugador perfecto ahora tarda 1:43 en vez de 2:03) y cuando se dejó de pedir el participio primero en regulares nuevos (bajó a 2,5 % a propósito para no delatarlos); el tercero es el hueco de fondo del juego: un bot tramposo que no sabe inglés llega al colegio hasta el **66,8 % – 74 %** de las veces aplicando una receta mecánica.
3. Sirvió el juego en el puerto 5200 y tomó capturas en tamaño de celular (`360×740`) y de computador (`1280×720`) jugando una carrera completa, cometiendo errores a propósito en la calle y en el puente, y llegando a la pantalla final.

**Qué salió mal o se notó al mirar las capturas y las cuentas.**
- **En enseñanza:** hoy el juego solo mide reconocimiento entre tres palabras a la vista. En 30 de los 60 verbos el pasado y el participio son iguales, así que la segunda fila regala la respuesta que la primera acaba de mostrar. Además, tras 30 partidas perfectas (una hora entera jugando) el estudiante tiene **0 de 60 verbos marcados como "sabidos"**, porque con 60 verbos mezclados cada uno tarda 7 u 8 carreras en volver.
- **En pantalla (`1280×720` y `360×740`):** en pantalla ancha (`1280×720`), el edificio del colegio en la pantalla final se ve pequeño y el cartel de `¡LLEGASTE AL COLEGIO!` con los puntos le tapa el techo y la bandera; en el puente, la palabra que vuela al hueco queda montada sobre el botón verde a mitad de camino y el profesor de espaldas sigue viéndose como un bloque rígido.

**Algo que casi sale mal al arrancar.** El encargo se abrió inicialmente desde la carpeta vecina (`INGLES`), donde había otro registro distinto. El coordinador localizó la carpeta `VERBOS` y verificó que el servidor, las pruebas y todos los archivos fueran los de este proyecto antes de tocar una sola línea.

---

## Paso 21 — Segundo debate a tres voces: cómo pasar de reconocer a saber y cómo brillar en el salón

**Qué se pidió.** Que para las decisiones grandes debatieran varias voces primero por separado y después criticándose, incluyendo a quien sabe cómo se aprende una lengua (`ensenanza`), quien diseña la experiencia y los tiempos (`experiencia`) y quien prueba con bots tramposos y defiende al profesor en un salón real (`pruebas`). Además, el dueño del proyecto avisó que **presentará la herramienta este miércoles en un evento con profesores** y la subirá a GitHub.

**Cómo se hizo el debate (en `equipo/debate-semestre/`).**
1. **Primera ronda (a ciegas entre sí):** cada agente escribió su postura sin leer la de los demás en `1-ensenanza.md`, `2-experiencia.md` y `3-pruebas-salon.md`.
2. **Segunda ronda (réplicas cruzadas):** cada agente leyó las posturas de sus dos compañeros y escribió qué adoptaba y dónde veía un riesgo o un hueco en `4-replica-ensenanza.md`, `4-replica-experiencia.md` y `4-replica-pruebas.md`.
3. **Acuerdo final (`5-acuerdo.md`) y ampliación de `AGENTES.md`.**

**Dos errores graves que el debate evitó antes de escribir código:**
- **El "soplo del libro" que descubrió Pruebas:** Experiencia había propuesto preguntar el significado en español en la segunda fila cuando `pasado = participio`, pero al mismo tiempo mostrar `KEEP = guardar` al recoger el libro en la primera partida. Pruebas demostró que su bot con memoria de turno copiaría `guardar` del libro a la segunda fila 4 segundos después y seguiría ganando más del 60 % sin saber inglés. **Solución acordada:** cuando un turno pregunta el significado en una fila, el libro muestra solo el verbo en inglés (`KEEP`), o bien en la primera vez que se ve el verbo la segunda fila pregunta el contraste negativo con `didn't ___` (que exige la forma base `keep`), donde repetir `kept` falla siempre.
- **El peligro de los sinónimos en español que descubrió Enseñanza:** Experiencia y Pruebas habían sugerido tomar al azar traducciones de otros verbos del tramo para los tres carriles. Enseñanza revisó `js/verbos.js` y encontró que varios verbos comparten traducción (`make` y `do` = *hacer*; `speak` y `talk` = *hablar*; `begin` y `start` = *empezar*) y otros tienen más de 10 letras o coma (*estar de pie*, *llegar a ser*). Si salieran juntos en la calle, el estudiante perdería teniendo la razón. **Solución acordada:** Enseñanza añade a mano en `js/verbos.js` un significado corto de una sola palabra (`esCorto`, máximo 10 letras) y dos falsos curados (`falsosEs`) por cada verbo.

**Qué quedó acordado para construir:**
1. **Caja de 8 Fichas de Letras (`4 × 2`, `76 × 54 px` en celular)** en el puente y como requisito para graduar un verbo a *"Sabido"*, con teclado físico en computador y botón opcional de micrófono (`🎤`), sin abrir jamás el teclado del teléfono.
2. **Repaso espaciado por cuadras cerradas de 10 verbos** (`rachaSabido: 3` + 1 producción con fichas, `descansos: [0, 1, 3]`), para lograr de 8 a 10 verbos *"Sabidos"* en 10–12 minutos en vez de 0 tras 30 carreras.
3. **Tercer molde gramatical (`didn't ___` / `Did you ___?` → pide la forma base)** en `js/oraciones.js`, atacando de frente el error *"I didn't went"*, más limpieza de carteles engañosos (`write/ride`, `wear`) y de falsos dialectales (`thunk`, `brung`, `boughten`, `pat`, `cat`, `hat`).
4. **Termómetro Pre/Post de 5 preguntas (45 segundos) + Código de 6 caracteres + Vista del Profesor** con un botón de *"Cargar ejemplo de un salón (25 estudiantes)"* pensado especialmente para la presentación en vivo de este miércoles ante profesores.
5. **Modo Salón por Equipos (15 minutos en proyector):** 2 o 3 equipos, relevos de 4 verbos con carriles numerados `[1 Azul] [2 Amarillo] [3 Verde]`, pausa con `Espacio` y Gran Puente con opciones tapadas y **Robo de Punto**.

---

## Paso 22 — Actualización de datos (`verbos.js` y `oraciones.js`) y reglas (`reglas.js`)

**Qué hicieron Enseñanza (`ensenanza`) y Experiencia (`experiencia`).**
- **Enseñanza (`js/verbos.js`, `js/oraciones.js`, `equipo/ensenanza.md`):**
  1. Corrigió los títulos y explicaciones de los grupos 4 (`"Participio en -N / -EN"`) y 5 (`"Pasado con O y participio en -N"`) para no contradecir a *written, ridden, worn, forgotten*.
  2. Retiró todas las formas dialectales (`thunk`, `brung`, `brang`, `boughten`) y los sustantivos reales (`pat`, `cat`, `hat`), cambiándolos por errores reales de aprendices hispanohablantes (`thinked`, `bringed`, `buyed`, `putten`, `cutten`, `hitten`).
  3. Añadió `esCorto` (una sola palabra en infinitivo de hasta 10 letras) y `falsosEs` (dos distractores de significado curados a mano sin sinónimos y con largos balanceados) en los 60 verbos irregulares y los 12 regulares.
  4. Añadió 72 oraciones nuevas del tercer molde (`forma: 'base'` con `didn't` y `Did … ?`, llegando a **216 oraciones** en `js/oraciones.js`), donde la respuesta correcta es la forma base y el primer falso es el pasado irregular (*"I didn't went"*).
- **Experiencia (`js/reglas.js`, `DISENO.md`, `equipo/mecanica.md`):**
  1. Actualizó `js/reglas.js` con los parámetros acordados: `tramoCerrado: true`, `sabidosParaAvanzar: 8`, `cupoMantenimiento: 2`, `rachaParaEspaciar: 2`, `descansos: [0, 1, 3]`, `rachaSabido: 3`, `requiereProduccionParaSabido: true`, `filaSignificadoEnIguales: true`, `produccionPorRevision: 2`, `fichasLetrasTotal: 8`, `preguntasPrePost: 5`, `largoCodigoProfe: 6` y las reglas de `Modo Salón`.
  2. Documentó toda la cuarta etapa en `DISENO.md` y `equipo/mecanica.md`.

**Verificación del coordinador.** Se cargaron `js/verbos.js`, `js/oraciones.js` y `js/reglas.js` en Node: 60 verbos irregulares, 12 regulares, 216 oraciones y **0 errores de formato o longitud**.

---

## Paso 23 — Construcción del motor (`logica.js`) y del banco de bots (`pruebas/bots.js`)

**Qué se hizo.**
1. En `js/logica.js`:
   - Se implementó la progresión por cuadras cerradas (`tramoActual`, `armarCola` filtrando por tramo con cupo de mantenimiento).
   - Se implementó el cierre del atajo de memoria en la calle: cuando `pasado === participio`, la segunda fila pregunta el significado en español (`pide: 'significado'`) o el auxiliar (`pide: 'base'`), ocultando la traducción en el libro dorado (`ocultarSignificadoLibro: true`).
   - Se implementó la Caja de Fichas en el puente (`modo: 'fichas'` con 7 letras barajadas + `⌫`), el método `intentarTexto()`, el segundo intento con esqueleto (`w _ _ _`) y la función `VJ.aplicarRevisionAHistorial`.
   - Se añadieron el Termómetro Pre/Post (`VJ.crearPrePost`), el reporte de 6 caracteres con dígito verificador (`VJ.codificarReporte`, `VJ.decodificarReporte`) y la simulación del salón (`VJ.ejemploSalon`).
2. En `pruebas/bots.js`:
   - Se actualizaron las pruebas automáticas para cubrir las nuevas reglas de la cuarta etapa (216 oraciones, 3 moldes, graduación con producción limpia, verificación de códigos y resistencia frente a bots tramposos).
3. **Resultado en pruebas:** corrieron 1.000 partidas por perfil en 73 segundos. **Los 57 requisitos duros se cumplen (`57/57 CUMPLE`, 0 NO CUMPLE)**. El tramposo de dos pasos cayó de 74 % a **0.0 %**, y en 30 carreras un estudiante perfecto logra **60 de 60 verbos sabidos** (frente a 0/60 antes).

---

## Paso 24 — Construcción de pantallas (`juego.js` e `index.html`) y verificación visual en celular y computador

**Qué se construyó.**
1. **Portada y Mapa de las 6 Cuadras (`#menu`):** mapa interactivo rumbo al colegio con los 10 ladrillos por cuadra (gris = nuevo, ámbar = en práctica, verde = sabido), acceso a elegir cualquier cuadra para el profesor y botones de acceso directo a todos los modos.
2. **Caja de Fichas en el Puente (`#revision`):** cuadrícula 4×2 con 8 botones táctiles grandes (`≥ 50×50 px` en celular `360×740`), visor superior de escritura, botón `✓ Listo`, soporte de teclado físico (`A–Z`, `Backspace`, `Enter`) y botón de micrófono opcional (`🎤`), sin abrir jamás el teclado del celular.
3. **Termómetro Pre/Post (45 s) y Vista del Profesor (`#prepost` y `#profe`):** diagnóstico rápido con botón *"Paso / Aún no lo sé (sin adivinar)"*, código verificable de 6 caracteres, botón de demostración *"✨ Cargar ejemplo de salón (25 estudiantes)"*, barras comparativas Pre vs. Post y botón para jugar revancha en clase.
4. **Modo Salón por Equipos (`#salonConfig`):** relevos de 4 verbos por equipo, carriles numerados con insignias gigantes `[ 1 ] [ 2 ] [ 3 ]` (teclas 1, 2, 3), pausa con `Espacio` y Gran Puente con Robo de Punto.
5. **Correcciones visuales:** en `1280×720`, el colegio en la pantalla final no pisa el cartel de victoria ni el puntaje; en el puente, el profesor de espaldas tiene silueta humana con pelo canoso y patillas de gafas, y la palabra en vuelo no duplica texto; en `360×740`, la pancarta fallada se desvanece sin encimarse.

**Verificación visual (Playwright en `360×740` y `1280×720`):**
- **0 errores en consola** en celular (`360×740`), computador (`1280×720`), proyector de salón y apertura directa con doble clic (`file://`).
- Todas las capturas fueron inspeccionadas directamente y verificadas en sus dimensiones.

---

## Paso 25 — Preparación para el evento de profesores y empaquetado final

**Qué se hizo.**
1. Se comprobó la apertura offline con doble clic en `index.html` (`file://`), garantizando que no existan llamadas a `fetch()`, fuentes remotas ni dependencias de internet.
2. Se verificó que ningún archivo contenga nombres personales, correos ni rutas locales del computador.
3. Se actualizó la documentación (`CONTINUAR.md`, `GUIA-PARA-PROFES.md`, `LEEME.md`, `pruebas/INFORME.md`).
4. Se rehizo el comprimido `VERBOS-juego.zip` en la carpeta superior, dejándolo listo para compartir con los docentes del evento y subir a GitHub / GitHub Pages.
