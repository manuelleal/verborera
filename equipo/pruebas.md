# Bitácora de Pruebas

Soy el agente que **no arma nada**: juego mal a propósito, mido y cuento lo que encuentro. No arreglo el juego ni toco archivos de otros. Mis archivos son `pruebas/bots.js` (los jugadores automáticos), `pruebas/INFORME.md` (los resultados) y esta bitácora.

## 1. Qué me pidieron

- Hacer jugadores automáticos ("bots") que jueguen miles de partidas sin pantalla: uno que no toca nada, uno al azar, uno perfecto, aprendices que aciertan 70, 80, 90 y 95 de cada 100, y **tramposos**: gente que intenta ganar sin saber inglés.
- Revisar la lista de verbos contra las reglas del equipo y con ojo de profesor de inglés.
- Comprobar lo que el dueño pidió de verdad: que lo fallado vuelva pronto, que lo acertado se espacie, que los verbos entren en orden.
- Medir cuánto dura una partida, probar entradas absurdas y abrir el juego en el navegador.
- No creerle a nadie: volver a medir lo que los demás dicen haber medido.

## 2. Qué decidí y por qué

**Un solo archivo que cualquiera puede correr.** `node pruebas/bots.js` tarda 25 segundos, juega unas 80.000 partidas y termina con una lista de "cumple / no cumple" con su número. Siempre da lo mismo, porque todo el azar sale de semillas.

**Los bots juegan como un jugador, no como el programador.** Solo usan lo que un estudiante puede hacer (moverse a un lado u otro) y lo que puede ver (lo que viene por la calle). Avanzan el juego de a un treintavo de segundo.

**Vigilé todas las filas, no una muestra.** Cada letrero que salió en cada partida de cada bot pasó por un revisor: más de un millón de filas. Así "la correcta nunca cae tres veces seguidas" es un conteo y no una promesa.

**Los tramposos los inventé leyendo el código con malicia.** Además de los pedidos (mismo carril, alternar, ir al centro, perseguir estrellas), busqué qué podía delatar la respuesta:
- *El reparto de carriles.* El juego reparte la correcta "dos veces por carril cada seis filas". Eso es como una baraja: si uno cuenta lo que ya salió, sabe algo de lo que falta. Hice un bot que cuenta.
- *Las palabras mismas.* Casi todos los falsos son formas regulares inventadas (`haved`, `maked`), y ninguna respuesta correcta termina en -ed. Hice un bot que no sabe ningún verbo y solo aplica "nada con -ed, y si quedan dos, la más corta".

**Separé "requisito duro" de "aviso".** Lo que pidió el coordinador o promete el diseño es requisito: si falla, el programa termina en error. Lo que yo estiré más allá (por ejemplo, datos guardados dañados a mano) sale como aviso.

**Para la estrategia de aprendizaje inventé un estudiante concreto.** Le cuestan cuatro verbos (make, go, take, buy): los falla la primera vez que salen en cada partida durante doce partidas y luego "los aprende". Con él se ve en una tabla qué hace el juego partida a partida. Al lado puse al que nunca falla, durante 30 partidas, para ver qué pasa cuando ya no queda nada nuevo.

## 3. Qué salió mal o qué dudé, y cómo lo noté

**Mi primera tabla por grupos era falsa y parecía perfecta.** Todos los grupos daban exactamente el mismo porcentaje para el aprendiz: 93,0 % en los seis. Demasiado igual. Era culpa mía: usaba las mismas semillas en todos los grupos, así que cada grupo repetía las mismas tiradas y lo único que cambiaba eran las palabras. Le di semillas propias a cada medición y aparecieron las diferencias normales (92,5 a 93,8 %). Lección: un resultado demasiado bonito es motivo para desconfiar del que mide.

**Una de mis pruebas acusaba al juego de algo que no hacía.** Decía que semillas distintas daban partidas repetidas (78 distintas de 200). El juego estaba bien: yo comparaba las partidas de un bot que pierde casi enseguida, y las derrotas rápidas se parecen todas. Lo cambié por comparar el reparto de carriles: 200 de 200 distintas.

**Escribí dos requisitos más estrictos de lo que el diseño prometía.** Exigí que lo fallado saliera en los dos primeros puestos de la partida siguiente; el diseño intercala verbos nuevos, y el tercero pendiente sale quinto, a propósito. Y exigí que un verbo acertado descansara exactamente 1, 2 y 4 partidas; al fallar miré por qué y resultó ser un hallazgo de verdad (los descansos existen, pero lo que manda es que caben 8 turnos y hay 31 verbos). Dejé la regla como requisito, que se cumple, y el efecto visible como hallazgo.

**El hallazgo más importante casi lo descarto.** Cuando el bot de "nada con -ed" ganó 63 %, pensé primero que era trampa mía: ¿no es eso justo lo que hay que aprender de los irregulares? Lo medí mejor antes de decidir: en 20 partidas seguidas ese bot gana la primera la mitad de las veces y luego casi nunca, y el juego jamás lo marca como "sabido". Así que lo reporto con las dos caras: es una puerta abierta en los grupos fáciles, no una forma de pasarse el juego.

**Dudé si el piso de 2 minutos era un requisito.** "Caber en 2 a 4 minutos" puede leerse como máximo o como rango. Lo dejé como requisito no cumplido (el perfecto tarda 1:42), pero es el menos grave de los cinco.

**En el navegador, mis primeras capturas eran viejas.** El juego decía ir en el segundo 8 y la captura mostraba el segundo 0: la imagen tardaba en refrescarse. Y al cambiar el tamaño de la ventana, la medida que leí enseguida era del tamaño anterior. Por eso una de mis medidas (pantalla grande) no sirve y lo digo en el informe.

**No vi el juego moverse solo.** El panel de mi navegador estaba oculto y el juego se detiene cuando nadie lo mira. Lo adelanté a mano. Todo lo que digo de la pantalla es de imágenes quietas.

**Un parche mío falló por una tontería** (unas barras invertidas que la terminal se comió). No llegó a escribir nada; hice los cambios a mano.

## 4. Qué necesito de otro agente o del dueño

**De Enseñanza:**
- Decidir qué hacer con el truco del "-ed": hoy 113 de 186 falsos terminan en -ed y ninguna correcta. Poner un falso tentador sin -ed entre los dos primeros de cada verbo lo cerraría casi del todo.
- Confirmar `drank` (falso de participio) y `sung` (falso de pasado): algún diccionario los registra como variantes.

**De Mecánica:**
- Un final para la partida que hoy no acaba (quien falla siempre el mismo verbo).
- Decidir si los pendientes deben salir pegados al principio: tres seguidos son captura en 48 segundos.
- Decidir si quiere que los descansos crezcan de verdad, o cambiar lo que dice el diseño.
- Qué hacer con "Lo que me cuesta" cuando hay un solo verbo.
- Si le importa que contando carriles se acierte 48 % en vez de 33 %.

**De Construcción:**
- Guardar algo cuando el jugador sale con "Menú" a mitad de partida (hoy se pierde todo, también los errores).
- Proteger el guardado contra un `descanso` negativo o con decimales.
- La letra en pantallas bajitas.

**Del coordinador:**
- Corregir en `AGENTES.md` que el comodín "se apaga con `comodinInicial: 0`": se sigue recargando.
- Decir si el piso de 2 minutos es de verdad un requisito.

**Del dueño:**
- Lo que yo no puedo: un celular real, con sonido, abriendo con doble clic. Ahí están la voz en inglés, la fluidez y si un estudiante alcanza a leer los tres letreros.

## Segunda ronda (20 minutos)

- **Qué me pidieron:** separar, de los 8 "no cumple" que daba mi banco viejo, lo que era regla cambiada a propósito de lo que era falla real; medir si la captura más justa y el tope de 12 turnos regalan victorias; y probar la revisión con oraciones.
- **Qué decidí:** no borré requisitos, los reescribí con la regla nueva (el libro que no se recoge vuelve en el carril del jugador; la partida termina en menos de 6 minutos). A los aprendices ya no los comparo con el diseño: los mido y los pongo al lado de mi primera medición.
- **Lo que encontré:** de los 8, cinco eran regla vieja, uno era un caso extremo de mi propio banco y dos eran fallas reales, ya mucho menores (el truco del "-ed" bajó de 63 % a 5,6 %). Y apareció una falla nueva nacida de un arreglo: como no recoger el libro ya no castiga, quien lo esquiva juega para siempre y suma puntos de estrellas.
- **Qué salió mal:** al añadir una línea a mi medidor rompí sin querer la cuenta de derrotas, y la tabla decía que el jugador perfecto "no terminaba" 1.000 veces y mostraba porcentajes negativos. Lo vi porque era absurdo; un error menos escandaloso se me habría pasado. Dos de mis cambios automáticos no encontraron su sitio por espacios de más.
- **Lo que no me esperaba:** el arreglo de "Lo que me cuesta" sí funcionaba; mi prueba usaba un historial de un solo verbo, que casi nunca existe. Acusé de más.
- **Del tope de turnos:** no le regala nada a quien no sabe (quien acierta la mitad gana 0,6 %), pero quien acierta 7 de 10 gana ahora 26 % en vez de 17 %, y más de la mitad de esas victorias son con verbos sin aprender.
- **Qué necesito:** de Mecánica y Construcción, un límite a las veces que el libro puede volver (o que cuente como turno). De Enseñanza, cambiar el falso `left` en la oración de LET y mirar el grupo "pasado-n", donde un truco gana 42,6 %.
- **Qué no hice:** no toqué "Ver mi carrera" ni vi la gran revisión de tramo en pantalla; las 120 oraciones las leí una sola vez y con prisa.

## Tercera ronda (sin afán)

**Qué me pidieron.** Poner el banco al día con los verbos regulares infiltrados y el orden al azar, y contestar una pregunta: ¿quedó cerrado el truco del "-ed"? Además, buscar el mejor tramposo posible, leer las 144 oraciones con calma y mirar el juego en tres tamaños de pantalla.

**Qué decidí y por qué.**

- *Comprobar primero lo que decía Construcción de mi banco.* Decía que mis 6 "no cumple" eran regla vieja. Los revisé uno por uno y tenía razón en los seis: mi banco contaba los regulares como verbos del recorrido.
- *No conformarme con mis propios tramposos.* Mis bots del "-ed" eran los de la primera ronda; el juego se había arreglado contra ellos. Si solo los volvía a correr, iba a certificar que el juego le gana a mis trucos viejos, no que no se puede hacer trampa. Así que hice un buscador: le doy unas pocas señas visibles de cada palabra (termina en -ed, es la del libro, es la más corta, la más larga, termina en -n, y qué mostró la primera fila) y pruebo las 6.800 maneras de combinarlas. Se queda con la que más acierta.
- *Poner al lado una receta que un estudiante pueda decir en voz alta.* El buscador encuentra reglas raras. Para que el hallazgo se entienda, escribí a mano una de dos pasos y la medí aparte.
- *Separar "llegó" de "llegó limpio".* El juego ya distingue una victoria con verbos pendientes; mi tabla también.
- *Medir el mismo buscador sobre los verbos de la primera ronda,* que alguien guardó en `equipo/verbos-31-original.js`, para que la comparación entre rondas sea justa.

**Qué salió mal o qué dudé, y cómo lo noté.**

- **Casi doy por cerrado lo que no lo estaba.** Los cuatro trucos del "-ed" ganaban 0 %. Era la respuesta que todos esperaban. El buscador dio 74 %. La trampa de fondo no era el "-ed": era que la segunda fila se puede copiar de la primera y que el regular cuesta un solo tropiezo.
- **Mi primer susto con ese 74 % fue pensar que el bot hacía trampa de verdad** (que leía la respuesta). Revisé que solo usa lo que se ve en pantalla. Después dudé de lo contrario: ¿es trampa repetir en la segunda fila la palabra que el juego acaba de mostrar, si el grupo se llama "pasado y participio iguales"? No lo resolví yo: en el informe separé lo que es forma de las palabras de lo que es el patrón que el juego quiere enseñar, y lo dejé a decisión del equipo.
- **Una regla "por grupo" gana 100 % en dos grupos y estuve a punto de reportarlo como lo más grave.** Al leer la regla resultó ser "elige la palabra del libro" en el grupo de los que no cambian. Eso no es trampa, es saberse el grupo. Lo bajé de requisito a aviso.
- **Mi banco me mintió con pocas partidas.** A 300 marcó que la respuesta de la revisión caía más en el centro (38 %). Medido aparte con 5.000 semillas: parejo. El dado del juego, con pocas semillas seguidas, no reparte bien; con semillas de verdad sí. Subí esa prueba a 1.000 siempre.
- **Puse un umbral a ojo (45 %) y un truco dio 46,5 %.** Me di cuenta de que estaba inventando la vara después de ver el número. Volví al criterio de la ronda anterior ("menos de la mitad") y lo digo.
- **Una columna mía quedó midiendo otra cosa:** "victorias por tope de turnos" seguía usando el tope viejo (12) cuando la partida ahora tiene 10 turnos de base. La corregí.
- **La memoria del turno que yo había programado suponía que el pasado va primero.** Con el orden al azar habría medido mal. La rehíce para que recuerde "la primera fila", sea cual sea.
- **Otra vez las capturas llegaron atrasadas** (el panel del navegador estaba oculto). Esta vez no me fié de ninguna: cada cosa de pantalla la confirmé leyendo el texto de la página.

**Qué necesito de otro agente o del dueño.**

- De **Mecánica**: decidir qué hacer con la segunda fila cuando pasado y participio son iguales (hoy sale gratis en 30 de 60 verbos); que el regular pese más que un tropiezo; que el orden no delate al regular; qué pasa con un regular fallado; y si "sabido" debe ser alcanzable (hoy, 0 de 60 tras 30 partidas perfectas).
- De **Enseñanza**: mirar los nombres "base + N" y "pasado + N" (no sirven para *written, ridden, worn*) y decidir, junto con el dueño, si ganar un grupo aplicando su patrón cuenta como aprender. Yo creo que sí, pero no me toca.
- De **Construcción**: que un regular fallado no cuente como "verbo por repasar" si no se va a repasar.
- Del **dueño**: lo de siempre, que solo él puede: un celular real con sonido. Y una cosa nueva: sentar a un estudiante de verdad y ver si descubre la receta. Yo mido que existe; no sé si alguien la encuentra.
