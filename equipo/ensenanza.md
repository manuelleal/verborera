# Bitácora — Enseñanza de inglés

Mi papel en el equipo: profesor de inglés para hispanohablantes que están empezando (A1–A2). No construyo el juego; entrego los datos con los que el juego enseña. Mi archivo es `js/verbos.js`.

## 1. Qué me pidieron

- Escoger unos 30 verbos irregulares para una exposición ante profesores (no un curso completo).
- Agruparlos por la forma en que cambian, con un nombre y una explicación que un estudiante entienda.
- Ponerlos en orden de enseñanza.
- Escribir, para cada verbo, las respuestas equivocadas que van en los letreros. La condición: que sean errores que de verdad comete un estudiante, no palabras al azar.
- Escribir la pista que da el profesor después de un error.
- Recomendar cómo repasar: cuántos verbos nuevos por partida, cuándo vuelve uno fallado, cuándo se puede dejar descansar uno que ya sale bien.

## 2. Qué decidí y por qué

### Los 31 verbos y sus 6 grupos

| Grupo | Qué pasa | Verbos (en el orden en que se enseñan) |
|---|---|---|
| 1. Pasado y participio iguales | Se aprende una sola forma nueva | have, make, say, get, tell, find, leave |
| 2. Los rebeldes | Cada uno cambia a su manera | go, do, come, run |
| 3. Los que no cambian | Las tres formas son iguales | put, let, cut, hit |
| 4. Participio terminado en N | Cambia la vocal en pasado y el participio termina en -n / -en | take, give, see, know, eat, write, speak, break |
| 5. Los de -ought / -aught | Pasado y participio iguales, con esa terminación | think, buy, bring, teach |
| 6. Vocal i – a – u | Solo cambia la vocal | drink, sing, swim, begin |

### Con qué criterio los escogí

Dos condiciones a la vez: que el verbo se use muchísimo y que sirva para mostrar un patrón. Por eso están los más usados (have, do, say, go, get, make, know, think, take, see, come) y también algunos menos usados pero que dejan ver el patrón con claridad (swim, sing, hit). Un grupo con un solo verbo no enseña patrón, así que cada grupo tiene al menos cuatro.

### Con qué criterio los ordené

No es una lista por frecuencia pura. Si lo fuera, los grupos quedarían revueltos y el patrón no se notaría. El orden es **por grupos**, y los grupos van de lo más fácil y frecuente a lo más exigente:

1. Primero los de pasado y participio iguales: son los más usados y solo piden recordar una forma.
2. Luego los rebeldes (go, do, come, run): son irregulares de verdad, pero el estudiante ya los ha visto mil veces.
3. Luego los que no cambian: fáciles de memoria, pero con una trampa (la tentación de decir *cutted*).
4. Luego los de tres formas distintas con participio en N: aquí está el error estrella, usar el pasado donde va el participio (*I have went*, *I have took*).
5. Los de -ought / -aught: difíciles de escribir y fáciles de confundir entre sí (bought / brought, thought / taught).
6. Al final los de i – a – u: el patrón más bonito de mostrar, pero los verbos menos frecuentes.

Dentro de cada grupo, sí van del más usado al menos usado.

El costo de esta decisión: THINK, que es de los verbos más usados del inglés, queda en el puesto 24 porque lo dejé junto a sus hermanos. Me pareció mejor pagar eso que partir el grupo.

### Cómo armé las respuestas equivocadas

Cada falso pertenece a uno de estos tipos de error, y todos se pueden explicar en clase:

| Tipo de error | Ejemplo | Por qué pasa |
|---|---|---|
| Forma regular inventada | goed, buyed, cutted | El estudiante aplica la regla de -ed a todo |
| La otra forma del mismo verbo | *gone* cuando se pide el pasado; *went* cuando se pide el participio | Se sabe las formas pero no cuál es cuál |
| Doble marca | wented, tooked, lefted | Recuerda la forma irregular y además le pone -ed |
| Patrón de otro grupo | brang / brung, tolden, putten, thunk | Aplica un patrón que sí existe, pero en otro verbo |
| Ortografía | writen, tought, cuted, sayd | Sabe la forma pero la escribe mal |
| Verbo vecino | bought ↔ brought, thought ↔ taught, lived por left, founded por found | Confunde dos verbos que se parecen |

Dos cuidados que tuve:

- En los verbos donde pasado y participio son iguales (have, make, buy…), "la otra forma" no sirve como falso porque es correcta. Ahí usé los otros tipos de error.
- En los que no cambian (put, cut, let, hit), el falso natural es la forma con -ed (*cutted*); los otros dos son la misma con una sola T (*cuted*) y una terminación en -en (*cutten*).

Los falsos están ordenados del error que considero más común al menos común. El juego muestra dos por fila; el tercero sirve para variar cuando el verbo se repite.

### GET y BE

- **GET está, con *got* como participio.** En inglés americano también es correcto *gotten*. Para que el juego nunca le diga a alguien que una forma correcta está mal, *gotten* no aparece en ningún letrero. Si un profesor enseña *gotten*, el juego no lo contradice; simplemente no lo muestra.
- **BE no está.** Es el único verbo con dos pasados (*was* y *were*) y un letrero muestra una sola palabra. Si ponía *was/were*, la raya delataba la respuesta; si ponía solo *was*, enseñaba el verbo a medias. Además el pasado de BE suele enseñarse como tema aparte. Es la ausencia más grande de la lista y la dejé a propósito.

### Qué más dejé por fuera a propósito

- **read – read – read**: se escribe igual y se pronuncia distinto. En un juego de letreros parecería del grupo "no cambian" y enseñaría mal la pronunciación.
- **Verbos con dos formas aceptadas**: learn (learned / learnt), burn, dream, forget (forgot / forgotten). Vuelven discutible la respuesta.
- **cost**: *costed* existe en inglés de negocios, así que no es un falso limpio. Puse **hit** en su lugar.
- **Verbos frecuentes que no cupieron**: feel, keep, meet, sleep, pay, catch, become, sell, drive, choose. Con 30 verbos había que escoger; estos serían los siguientes en entrar.

### Las pistas

Son cortas (la más larga tiene 52 letras) y ninguna regaña. Cada una hace una de tres cosas: nombra el patrón (*i – a – u*), señala un verbo hermano (*break va con speak*) o marca el detalle que se suele fallar (*written lleva doble T*; *bought, sin R*).

### La estrategia de repaso

Va al final de `verbos.js`, como una tabla donde cada dato trae su porqué. En resumen:

- **4 verbos nuevos por partida**, tomados en orden, de modo que vengan del mismo grupo.
- **La otra mitad de la partida es repaso** de lo ya visto.
- **Un verbo fallado vuelve en la misma partida, después de 2 o 3 verbos distintos**: pronto, pero no enseguida. Si vuelve de inmediato, el estudiante solo repite lo que acaba de ver; si pasa un ratico, tiene que recordarlo, y ese esfuerzo es el que enseña.
- **Cuando vuelve, debe traer el mismo error que el estudiante escogió.**
- **Con 3 aciertos seguidos, el verbo descansa**: 1 partida, luego 2, luego 4. Si se falla, vuelve a salir siempre.
- **Con 5 aciertos seguidos se puede mostrar como "sabido"**. Menos que eso puede ser suerte: con tres carriles, uno de cada tres intentos se acierta al azar.

Son recomendaciones. Los números finales los decide el agente de Mecánica.

## 3. Qué salió mal o qué dudé, y cómo lo noté

- **No consulté ninguna fuente durante el trabajo.** La frecuencia de los verbos viene de mi conocimiento general de las listas basadas en grandes colecciones de textos en inglés (las mismas que usan los diccionarios para aprendices). No abrí ninguna lista para comprobar el puesto exacto de cada verbo. Me fío del orden grueso (have, do, say, go, get están arriba; swim y sing están abajo), no del orden fino entre vecinos.
- **Los errores típicos tampoco vienen de datos de un salón.** Vienen de lo que se sabe en general sobre cómo se aprenden los verbos irregulares (poner -ed a todo, confundir pasado con participio) y de las confusiones conocidas de los hispanohablantes (leave / live, bought / brought). El orden "del más común al menos común" es mi criterio, no una medición. Un profesor con sus propios exámenes corregidos puede saber más que esta lista, y vale la pena que la corrija.
- **Algunos terceros falsos son más débiles que los dos primeros.** *Putten*, *hitten*, *sunged* o *taughted* son errores posibles pero poco frecuentes. Los dejé de terceros por eso. Si el juego solo usa los dos primeros de cada verbo, no se pierde nada.
- **Varios falsos son palabras que existen en inglés**, solo que no son la respuesta: *founded* (fundó), *lived* (vivió), *seed* (semilla), *sawed* (serruchó), *thank* (agradecer), *drunken* (borracho, como adjetivo), *has*, *putted* (del golf). Los dejé porque justamente por existir son los que más tientan, pero un profesor puede preguntar "¿eso no es una palabra?". La respuesta es: sí, pero no es el pasado de este verbo.
- **En come y run, uno de los falsos del pasado es la misma palabra de la base** (*come*, *run*), porque el participio es igual a la base. Es un error real (*yesterday he come*), pero en pantalla el estudiante verá en un letrero la misma palabra que acaba de recoger. Puede confundir o puede enseñar; hay que mirarlo jugando.
- **Dudé por dónde empezar.** El ejemplo del contrato ponía GO de primero. Lo dejé de octavo, detrás del grupo de pasado y participio iguales, porque ese grupo es más fácil y permite ver un patrón desde la primera partida. Si en la exposición se quiere abrir con GO porque es el ejemplo que todo el mundo reconoce, basta intercambiar los dos primeros grupos.
- **Los "rebeldes" no son un patrón, son un cajón.** Go y do no se parecen a nada; come y run sí comparten algo (el participio vuelve a la base). Preferí un grupo honesto de cuatro a dos grupos de dos. Las pistas de come y run sí mencionan lo que comparten.
- **La comprobación automática pasó a la primera** (31 verbos, 6 grupos, sin repetidos, ningún falso igual a la forma correcta, ninguna palabra de más de 9 letras). También revisé a ojo las tres formas de los 31 verbos. Lo que esa comprobación no puede decir es si los falsos son buenos: eso solo se ve con estudiantes.

## 4. Qué necesito de otro agente o del dueño

- **Del dueño:** decidir si BE entra. Si entra, propongo que sea con un letrero especial (*was / were*) y sabiendo que esa fila queda más fácil que las demás. Y confirmar que *got* como participio de GET está bien para sus cursos.
- **De Mecánica:** que revise `VJ.ESTRATEGIA` y decida los números. Lo único que pido conservar es la idea: el fallado vuelve pronto pero no enseguida, y vuelve con el mismo error que el estudiante escogió.
- **De Construcción:** que al armar una fila use de preferencia los dos primeros falsos de cada lista (están ordenados), y que al empezar un grupo nuevo muestre su nombre y su ejemplo.
- **De Pruebas:** que el bot "aprendiz" caiga sobre todo en el primer falso de cada lista, que es el error más probable. Y que alguien mire en pantalla el caso de come y run descrito arriba.
- **De cualquier profesor que lo use:** que anote qué falsos escogen de verdad sus estudiantes. Con eso la lista se corrige con datos y no con mi criterio.

---

# Ampliación a ~60 verbos

Todo lo de esta parte está en `js/verbos-ampliado.js`. El archivo `js/verbos.js` (los 31 originales) no lo toqué: el coordinador lo pondrá en su sitio cuando Pruebas termine de leerlo.

## Qué me pidieron

1. Pasar de 31 a unos 60 verbos, sin cambiar el nombre interno, las tres formas ni el orden relativo de los 31 que ya estaban (hay progreso guardado con ellos).
2. Que los nuevos caigan en patrones de verdad, con máximo 9 grupos.
3. Que los cortes de 10 en 10 queden en lugares razonables, porque el juego hará una revisión cada 10 verbos.
4. Después llegó un hallazgo de Pruebas: el juego se podía ganar sin saber ningún verbo, con el truco "nunca la que termina en -ed, y si dudas la más corta". Me pidieron corregirlo en todos los verbos.

## Qué decidí y por qué

### 60 verbos en 9 grupos

| Grupo | Qué pasa | Verbos (los nuevos en **negrita**) |
|---|---|---|
| 1. Pasado y participio iguales | Una sola forma nueva | have, make, say, get, tell, **sell**, find, **hear**, **pay**, **stand** |
| 2. Los que terminan en T (nuevo) | Iguales y terminados en T: la vocal se acorta o la D pasa a T | leave, **feel**, **keep**, **sleep**, **meet**, **mean**, **lose**, **send**, **spend**, **build** |
| 3. Los rebeldes | Cada uno a su manera | go, do, come, **become**, run |
| 4. Los que no cambian | Se escriben igual las tres | put, let, cut, hit, **read** |
| 5. Participio = base + N | take → taken | take, give, see, know, eat, **fall**, write, **drive**, **ride**, **rise** |
| 6. Participio = pasado + N (nuevo) | spoke → spoken | speak, break, **choose**, **forget**, **wear** |
| 7. Los de -ought / -aught | Iguales, con esa terminación | think, buy, bring, teach, **catch** |
| 8. Vocal i – a – u | Solo cambia la vocal | drink, sing, swim, begin, **ring** |
| 9. Los de -ew y -own (nuevo) | grew, grown | **grow**, **throw**, **fly**, **draw**, **blow** |

### Los tramos de 10

Cada corte cae justo donde termina un grupo, así que cada revisión repasa patrones completos.

| Tramo | Verbos | Qué se repasa |
|---|---|---|
| 1–10 | have, make, say, get, tell, sell, find, hear, pay, stand | Pasado y participio iguales |
| 11–20 | leave, feel, keep, sleep, meet, mean, lose, send, spend, build | Los que terminan en T |
| 21–30 | go, do, come, become, run · put, let, cut, hit, read | Los rebeldes y los que no cambian |
| 31–40 | take, give, see, know, eat, fall, write, drive, ride, rise | Participio = base + N |
| 41–50 | speak, break, choose, forget, wear · think, buy, bring, teach, catch | Participio = pasado + N, y los de -ought |
| 51–60 | drink, sing, swim, begin, ring · grow, throw, fly, draw, blow | i – a – u, y los de -ew / -own |

Para que los cortes cayeran así ajusté el tamaño de los grupos a 10 o a 5. Eso dejó por fuera verbos que yo habría metido (ver más abajo). Es una decisión de forma que le costó algo al contenido, y la anoto como tal.

### Cambios a los 31 originales

- **Ninguno cambió de nombre interno, de formas ni de orden relativo.** Lo comprobé con un programa que compara los dos archivos.
- **Tres cambiaron de grupo**, para que el patrón fuera más honesto:
  - *leave* pasó de "iguales" a "los que terminan en T" (leave – left va con keep – kept y feel – felt).
  - *speak* y *break* pasaron al grupo nuevo "participio = pasado + N". En el grupo viejo ("participio en N") convivían dos reglas distintas: *taken* sale de la base (take + n) y *spoken* sale del pasado (spoke + n). Ahora cada regla tiene su grupo.
- **El grupo "en" cambió de nombre** a "Participio = base + N", que es lo que de verdad comparten sus verbos. Conserva el mismo identificador interno.
- **"Los que no cambian"** ahora dice "terminan en T o en D", porque entró *read*.
- **Casi todas las listas de falsos de los 31 cambiaron de orden o de contenido**, por el truco del -ed (siguiente apartado). De paso salieron los que yo mismo había marcado como flojos: *sunged* y *sanged* → *song* (confundir el verbo con el sustantivo "canción" sí es un error de salón); *taughted* → *tought*.
- **Algunas pistas cambiaron** para nombrar el verbo vecino que ahora aparece como falso (por ejemplo, LET: "Left es de leave"; SING: "Song es la canción, no el verbo").

### READ entró

Antes lo dejé por fuera porque se escribe igual y suena distinto. La solución: el juego es de letreros, o sea de escritura, y en escritura *read* de verdad no cambia. La pronunciación la carga la pista ("suena red, pero no se escribe así") y el falso *red* es justamente el error de quien lo escribe como suena.

### El truco del -ed

**El problema.** Pruebas encontró que un jugador que no sabe ningún verbo ganaba con dos reglas: descartar lo que termine en -ed y, en la duda, escoger la palabra más corta. Tenía razón y el error era mío: como el error más común es ponerle -ed a todo, yo había puesto esos falsos de primeros. Pero ninguna respuesta correcta de un verbo irregular termina en -ed, así que cada falso con -ed era un regalo. En 33 de 120 filas los dos falsos terminaban en -ed y la respuesta quedaba sola.

**Lo que hice.** Reordené y cambié los falsos de los 60 verbos con tres reglas:

1. Entre los dos primeros falsos de cada lista hay como mucho uno con -ed. En 54 de las 120 filas no hay ninguno.
2. El otro falso es un error real que no se delata por la terminación: la otra forma del mismo verbo (*gone* por *went*), la base sin cambiar (*keep* por *kept*: el estudiante que no marca el pasado), un patrón de otro grupo (*brang*, *tolden*), ortografía (*bilt*, *ment*, *tought*) o un verbo vecino (*left* por *let*, *felt* por *left*, *loss* por *lost*).
3. La correcta no es siempre la más corta ni la más larga de la fila.

**La medición, antes y después.** Fila = la correcta más los dos primeros falsos. El azar puro es 33 %.

| | Antes (31 verbos) | Antes (60 verbos) | Después (60 verbos) |
|---|---|---|---|
| "Sin -ed y la más corta" | 67 % | 68 % | **43 %** |
| "Sin -ed y al azar entre el resto" | 62 % | 63 % | **43 %** |
| "Sin -ed y la más larga" | 57 % | 59 % | 35 % |
| "La más corta", sin mirar el -ed | 63 % | 66 % | 40 % |
| "La más larga", sin mirar el -ed | 10 % | 8 % | 11 % |
| Filas con los dos falsos en -ed | 15 de 62 | 33 de 120 | 0 de 120 |

Por grupo, después del cambio (los dos trucos pedidos):

| Grupo | Sin -ed y la más corta | Sin -ed y al azar |
|---|---|---|
| Iguales | 42 % | 44 % |
| Terminan en T | 44 % | 42 % |
| Rebeldes | 40 % | 43 % |
| **No cambian** | **60 %** | 42 % |
| Participio = base + N | 40 % | 42 % |
| Participio = pasado + N | 40 % | 42 % |
| -ought / -aught | 40 % | 42 % |
| i – a – u | 45 % | 43 % |
| -ew / -own | 40 % | 42 % |

Antes del cambio, en la lista de 60, "iguales" estaba en 90 %, "terminan en T" en 95 % y "no cambian" en 100 %.

## Qué salió mal o qué dudé

- **No llegué al azar (33 %), me quedé en 43 %.** No es descuido, es aritmética: mientras ninguna respuesta correcta termine en -ed, cada fila que muestre un falso con -ed se puede resolver a cara o cruz (50 %). Para bajar a 33 % habría que quitar el -ed de todas las filas, y entonces el juego dejaría de mostrar el error más común de todos (*goed*, *buyed*). Preferí dejarlo en algo más de la mitad de las filas. **La solución de fondo no está en mi archivo**: ver la propuesta de verbos regulares al final.
- **"Los que no cambian" no se puede defender del todo con datos: queda en 60 % con el truco de "la más corta".** La razón: la respuesta correcta es una palabra de tres letras (*put*, *cut*, *let*, *hit*) y casi todo error real es más largo (*cutted*, *cutten*). Para empatar el largo tuve que usar falsos de tres letras hechos por analogía con otros verbos: *pat* y *cat* (como run – ran), *hat* (como sit – sat), *lot* (como get – got). **Con honestidad: esos cuatro son forzados.** Un estudiante podría producirlos, pero no los conozco como error típico, y además son palabras comunes (gato, sombrero) que pueden dar risa en un letrero. Los que sí defiendo en ese grupo: *cutten / putten / hitten / letten* para el participio (hay un patrón real: written, bitten, forgotten), *left* por *let* (los dos se traducen "dejar") y *red* por *read*. Si los cuatro forzados no convencen, mi recomendación es quitarlos y aceptar que este grupo es más fácil de adivinar, o resolverlo desde la mecánica.
- **Un detalle que no vi venir:** *red*, *sed* y *seed* terminan en las letras "ed" sin ser formas regulares. Un bot que mira las dos últimas letras los descarta igual. Lo noté cuando la medición de *read* salió peor de lo que yo había calculado a mano. Reordené para que no hubiera dos de esos en la misma fila.
- **Usé mucho más la base sin cambiar como falso** (*keep*, *send*, *give*, *begin*…): ahora aparece en 34 de las 120 filas. Es un error real, quizá el más real de todos en un principiante (*yesterday I keep*), y tiene casi siempre el mismo largo que la correcta. Pero antes había dudado de él en come y run, porque el estudiante ve en el letrero la palabra que acaba de recoger. Hay que mirarlo en pantalla. Tiene una ventaja que no busqué: como en "los que no cambian" la base es la respuesta correcta, no sirve ni el truco "nunca la que es igual a la base" ni el contrario.
- **Variantes de diccionario (lo que pidió confirmar Pruebas).** Lo consulté en Wiktionary; Merriam-Webster no dejó abrir la página.
  - *sung* como pasado de sing: figura como variante aceptada, sin marca. **Lo quité del todo** de los falsos del pasado.
  - *drank* como participio de drink: figura como dialectal. **Lo quité del todo**, y también *drunken*, que figura como participio arcaico.
  - *swum* como pasado de swim: figura como arcaico. Lo dejé; ningún curso lo acepta hoy.
  - *rung* como pasado de ring: no lo pude verificar (la página era demasiado larga). Lo pasé al tercer puesto, fuera de los dos primeros.
  - *begun* como pasado de begin: no figura como variante. Se queda.
- **FORGET tiene el mismo problema que GET.** *Forgot* se usa como participio en inglés americano informal. Enseño *forgotten* y *forgot* no aparece entre los falsos del participio.
- **Cambié LEND por MEAN a mitad de camino.** Lend estaba en mi primera lista ampliada. Al medir el truco, el grupo "terminan en T" no bajaba de 50 %, porque *met*, *kept* y *lent* son muy cortas. *Meant* es más larga que sus errores reales (*ment*, *mean*) y equilibra el grupo; además "what does it mean?" es más útil para un principiante que "lend". Lo digo porque la razón fue en parte la medición y no solo la enseñanza.
- **Verbos que quedaron por fuera para que los tramos cerraran en 10:** sit, win, hold (iguales); lend; hurt, shut (no cambian); steal (pasado + N); fight (-ought). *Cost* sigue fuera porque *costed* existe en inglés de negocios. *Understand* no cabe: tiene 10 letras y el letrero admite 9. *Wake* y *learn* siguen fuera por tener dos formas aceptadas.
- **FLY y RISE son los menos seguros.** *Fly* no es exactamente "base + own" (fly – flown), pero rima con el resto del grupo y su pista lo dice. *Rise* entró para completar diez en su grupo; es menos de principiante que los demás, aunque trae una confusión muy enseñable (rise / raise).
- **Sigue sin haber datos de salón.** Lo dicho arriba vale también aquí: frecuencia y errores típicos salen de mi conocimiento general. La única consulta externa fue la de las variantes.

## Qué necesito de otros

- **Del coordinador y de Mecánica — la propuesta de fondo contra el truco del -ed:** mezclar en el camino unos pocos **verbos regulares** (walk – walked – walked, play, work, want), donde la respuesta correcta SÍ termina en -ed. Con uno de cada cinco o seis, "nunca la de -ed" deja de ser una regla segura, y además se enseña algo que hace falta: saber cuáles verbos no son irregulares (quien acaba de aprender irregulares empieza a inventarlos donde no van). Si se aprueba, yo entrego la lista y sus falsos; no la incluí porque cambia el alcance del juego.
- **De Construcción:** que la fila normal se arme con los **dos primeros** falsos de cada lista. Ya no es solo una preferencia: la medición de arriba vale para esa pareja. Si se usa el tercero, que sea reemplazando a uno de los dos y sabiendo que la fila puede quedar más adivinable.
- **De Pruebas:** que repita su propia medición sobre `js/verbos-ampliado.js`. Mi bot reparte los empates de largo en partes iguales; si el suyo desempata distinto, los números pueden moverse unos puntos. Y que diga si los falsos *pat, cat, hat, lot* se ven razonables en pantalla.
- **Del dueño:** opinar sobre esos cuatro falsos y sobre la idea de los verbos regulares.

---

# Oraciones de la revisión

Archivo: `js/oraciones.js`. Son 120 oraciones, dos por cada uno de los 60 verbos, ordenadas por tramo.

## Qué me pidieron

Al final de cada tramo de 10 verbos el estudiante se detiene en un puente y completa oraciones, sin reloj. Cada oración tiene un hueco y tres letreros. Me tocaba escribirlas: cortas (caben en un celular angosto), con vocabulario de principiante y de vida diaria, y de modo que solo la forma correcta deje bien la oración.

## Qué decidí y por qué

- **Dos moldes, siempre los mismos, para que la señal se aprenda.** La oración de pasado lleva una marca de tiempo terminado (*yesterday, last night, two days ago, in 2020*). La de participio lleva *have* o *has* pegado al hueco y ninguna marca de tiempo. La palabra que decide (la "señal") se resalta en pantalla: el estudiante aprende a buscarla.
- **Los verbos donde pasado y participio son iguales también llevan las dos oraciones.** La palabra que va en el hueco es la misma, pero una oración enseña "ayer" y la otra "have": lo que se practica ahí es el uso.
- **GET lleva dos de pasado y ninguna de participio.** *I have got* significa "tengo", no "he conseguido", y en inglés americano el participio es *gotten*. Cualquier oración con *have ___* era discutible, así que la evité.
- **HAVE sí lleva participio**: *She has had two coffees* es natural e inequívoca.
- **Los falsos.** En verbos de tres formas, el primero es la otra forma verdadera (*went* ↔ *gone*) y el segundo un error real. En los de pasado = participio, el primero es la base sin cambiar (*Yesterday I keep…*) y el segundo un error real. Nunca hay dos terminados en -ed en la misma oración.
- **Ningún falso es la forma correcta de un verbo vecino que deje bien la oración.** En el camino sí uso *brought* como falso de *buy*; aquí no, porque *My mom brought bread yesterday* es una oración perfecta y el estudiante tendría razón al escogerla. Por lo mismo saqué *fell* de *I ___ sick last night* (*fell sick* existe).
- **Cuatro oraciones no llevan "la otra forma" como primer falso**, a propósito: *forgot* (participio aceptado en inglés americano), *drank* como participio y *sung* como pasado (figuran como variantes en diccionario) y *rung* como pasado (no lo pude verificar). Es la misma regla de la lista de verbos: no marcar como error algo que un diccionario acepta.

## Qué salió mal o qué dudé

- **90 de las 120 oraciones tienen un falso en -ed.** Cumple la regla (como mucho uno), pero quien descarte el -ed queda a cara o cruz en esas. En la revisión no hay reloj ni captura, así que pesa menos que en el camino; aun así, si Pruebas lo mide alto, se puede bajar cambiando segundos falsos.
- **Oraciones que me parecen menos naturales que el resto:** *Yesterday I meant every word* (MEAN casi no se deja usar en pasado con una marca de tiempo corta), *In 2015 I knew no English*, *We stood in line yesterday* y *He has stood up*. Son correctas; no son las más frecuentes.
- **Algunas traducciones no son palabra por palabra**, porque el español natural es otro: *I have known her for years* → "La conozco desde hace años"; *She has caught a cold* → "A ella le ha dado gripa"; *We have done the dishes* → "Hemos lavado los platos".
- **El límite de 30 letras mandó.** Varias oraciones están exactamente en 30 y tres traducciones en 34. Si la pantalla resulta más angosta de lo previsto, son las primeras que hay que mirar.
- **Hubo un solo error en la comprobación**: una traducción sin punto final. Corregido. Las 120 las releí una por una además de pasarlas por el programa.

## Qué necesito de otros

- **De Construcción:** que en la revisión se vea el verbo base de la oración (por ejemplo "GO"), porque algunas oraciones admitirían otro verbo y sin esa ayuda la pregunta deja de ser sobre la forma.
- **De Pruebas:** medir el truco del -ed también en las oraciones.
- **De un profesor:** leer las 120 en voz alta. Es la revisión que más vale y la única que yo no puedo hacer.

---

# Verbos regulares infiltrados

Archivos: `js/verbos.js` (al final: `VJ.REGULARES` y `VJ.GRUPO_REGULARES`) y `js/oraciones.js` (ahora 144 oraciones).

## Qué me pidieron

Se aprobó mi propuesta de mezclar verbos regulares para cerrar el truco del -ed. Me tocaba:

1. Escoger 12 verbos regulares y escribirles falsos que no terminen en -ed.
2. Escribirles sus oraciones para la revisión.
3. Arreglar el grupo "participio = pasado + N", que era el peor frente a un jugador que no sabe verbos pero recuerda lo que vio en la fila anterior.
4. Bajar el truco de la revisión ("ni la de -ed ni la palabra de la ficha"), que acertaba 62 %.
5. Rehacer las oraciones que yo mismo había marcado como poco naturales.

## Qué decidí y por qué

### Los 12 regulares

**walk, work, play, want, look, live, talk, call, help, start, open, watch.** Son de los verbos más usados del inglés, todos de primer mes de clase, y ninguno cambia la ortografía de forma rara al ponerle -ed (dejé por fuera *study → studied* y *stop → stopped* a propósito: aquí lo que se enseña es "este sí lleva -ed", no la regla de la doble consonante).

**Por qué funcionan.** Hasta ahora ninguna respuesta correcta terminaba en -ed, así que "nunca la de -ed" era un atajo. Con estos verbos, la de -ed es la respuesta. Y enseñan algo que hace falta: quien acaba de aprender *took* y *went* empieza a inventar irregulares donde no los hay.

**Sus falsos son irregulares inventados**, hechos con los mismos patrones del juego. Ninguno termina en -ed:

| Tipo de falso | Ejemplo | Imita a |
|---|---|---|
| La base sin cambiar | *walk*, *open*, *start* | cut – cut – cut |
| Terminación -en | *walken*, *playen*, *callen* | taken, fallen |
| Cambio de vocal | *wolk*, *tolk*, *cell*, *lave*, *stort* | fall – fell, give – gave |
| Terminación -t | *workt*, *helpt*, *lookt*, *opent* | keep – kept |
| Verbo hermano | *plaid* (como pay – paid), *waught* (como catch – caught), *went* (por want) | el vecino que se le parece |

Las pistas más útiles son las que nombran al hermano que engaña: "CALL es regular. No es como fall", "WATCH es regular. No es como catch", "PLAY es regular. No es como say o pay".

### El grupo "participio = pasado + N" (speak, break, choose, forget, wear)

**Por qué fallaba.** En la fila del pasado yo mostraba el participio como falso (*spoken* junto a *spoke*). El juego dice cuál era la correcta; entonces, al llegar a la fila del participio, quien recuerda la fila anterior ya sabe que la otra palabra sin -ed era *spoken*. No necesita saber inglés: le basta la memoria de diez segundos.

**Lo que cambié.** La base sin cambiar (*speak*) ahora aparece en las dos filas. Así, al llegar al participio, el que solo recuerda tiene dos candidatas que ya vio y no una. Y el participio ya no es el primer falso de la fila del pasado: sale una vez sí y otra no.

### La revisión

- **La base casi desapareció de los falsos**: estaba en 56 de 120 oraciones y quedó en 4. Tres son come, become y run, donde la base es la otra forma verdadera del verbo; la cuarta es *make* (*My mom make arepas yesterday* es el error que de verdad se oye).
- **Menos -ed**: de 91 oraciones con un falso en -ed a 67. No lo quité del todo a propósito: si en la revisión el -ed solo apareciera en los regulares, nacería el truco contrario ("si hay una de -ed, es esa").
- **Oraciones rehechas**: MEAN (*I meant to call you yesterday*, que sí es de todos los días), KNOW (*I knew the answer yesterday*), STAND (*We stood all day yesterday* / *I have stood here for an hour*). En *Prices have ___ again* quité *raised*: era un verbo de verdad y daba discusión. La de LET que cambió el coordinador quedó bien.

### Los números, antes y después

Medí con mi propio programa. Esta vez imita cómo arma las filas el juego (el tercer falso se turna con el segundo) y añade dos trucos: el de la memoria y el contrario ("escoger la de -ed").

**En el camino** (porcentaje de filas acertadas sin saber verbos; el azar es 33 %):

| Truco | Antes | Después, solo irregulares | Después, con 2 regulares cada 10 turnos |
|---|---|---|---|
| Sin -ed y la más corta | 54 % | 53 % | 42 % |
| Sin -ed y al azar | 50 % | 50 % | 40 % |
| Sin -ed + memoria de la fila anterior | 66 % | 62 % | 50 % |
| El contrario: escoger la de -ed | 12 % | 13 % | 31 % |

El grupo "participio = pasado + N", que era el encargo: de 85 % a 38 % con memoria, y de 50 % a 33 % con "la más corta".

**En la revisión** (porcentaje de oraciones acertadas a la primera):

| Truco | Antes | Después, solo irregulares | Después, con regulares mezclados |
|---|---|---|---|
| Ni la de -ed ni la palabra de la ficha | 62 % | 43 % | 35 % |
| Sin -ed | 46 % | 43 % | 34 % |
| El contrario: escoger la de -ed | 8 % | 15 % | 32 % |

Mi "antes" de la revisión (62 %) coincide con el que midió Pruebas, lo cual me da confianza en la regla de medir. En el camino mis números no son comparables con los de Pruebas: yo cuento filas sueltas y ellos partidas ganadas.

## Qué salió mal o qué dudé

- **Mi medición anterior era optimista y no lo sabía.** Yo había medido solo "la correcta más los dos primeros falsos" (43 %). Al leer cómo arma las filas el juego vi que el tercer falso se turna con el segundo, y con esas filas el mismo truco da 54 %. El error fue suponer cómo se usaban mis datos en vez de leerlo. Lo corregí en la medición, no en los datos: ver el punto siguiente.
- **Solo arreglé un grupo, y hay otros tres con el mismo problema de memoria.** El encargo decía no tocar los demás verbos. Según mi medición, con el truco de la memoria quedan altos "participio = base + N" (79 %), "-ew / -own" (83 %) y "rebeldes" (73 %): en todos muestro el participio como falso del pasado. La receta que usé en speak/break sirve igual para ellos. No lo hice porque no me lo pidieron y hay progreso guardado; lo dejo dicho para que se decida.
- **El truco de la memoria no se cierra del todo con datos.** Mostrar *gone* cuando se pide el pasado de go es lo más instructivo que tiene el juego, y es justo lo que el truco aprovecha. Se puede esconder un poco, no quitar. Si se quiere cerrar de verdad, es asunto de mecánica: por ejemplo, pedir a veces primero el participio.
- **NEED entró y salió.** Lo había escogido, y la comprobación lo delató: *need* termina en las letras "ed", así que sus falsos *need* y *ned* rompían la regla de "ningún falso de un regular termina en -ed". Lo cambié por LOOK.
- **HELP: evité *holp* y *holpen*** aunque eran falsos tentadores: son formas antiguas de verdad (aparecen en textos viejos). Tampoco usé *wrought* para work por lo mismo.
- **Falsos de los regulares que son palabras reales**: *went*, *cell*, *plaid*, *lave*. Me parecen defendibles porque salen de una analogía clara, pero un profesor puede preguntar. *Went* como falso de WANT es además una confusión real de principiantes.
- **En los regulares, la correcta casi nunca es la más corta** (walked es más larga que walk y que wolk) y empata en largo con la de -en (walken). Un truco de "la más larga" los acertaría a medias. No encontré falsos más largos que no fueran inventos sin gracia.
- **Algunos falsos nuevos de las oraciones son terminaciones en -en que no he visto como error típico**: *doen*, *wenten*, *singen*, *ringen*, *swimmen*, *drinken*. Tuve que usarlos porque el encargo cerraba las dos salidas naturales (ni -ed ni la base). Son posibles; no son frecuentes.
- **Sigo sin datos de salón**, igual que antes: todo esto es criterio y medición contra programas, no contra estudiantes.

## Qué necesito de otros

- **Del coordinador:** decidir si aplico a los otros tres grupos la misma corrección de memoria.
- **De Pruebas:** repetir su medición con los regulares encendidos, y añadir el truco contrario ("escoger la de -ed"): con mis números queda en 31–32 %, cerca del azar, pero conviene confirmarlo jugando partidas completas.
- **De Mecánica:** tener presente que la proporción importa. Con 2 regulares por cada 10 turnos los dos trucos quedan parejos; con muchos más, "escoger la de -ed" empieza a rendir.
- **De Construcción:** que cuando salga un regular se vea el nombre de su grupo ("Los que sí llevan -ed") la primera vez, para que no parezca un error del juego.

---

# Cuarta etapa: Significado activo (`esCorto` y `falsosEs`), tercer molde (`didn't` / `Did`) y limpieza de datos

Archivos actualizados: `js/verbos.js` (60 verbos + 12 regulares con `esCorto` y `falsosEs`, grupos 4 y 5 corregidos, falsos dialectales y sustantivos retirados) y `js/oraciones.js` (216 oraciones en total: 3 por verbo).

## Qué cambié y por qué

1. **Corrección de los carteles de los grupos 4 y 5 en `js/verbos.js`:**
   - El grupo `'en'` pasó de llamarse `"Participio = base + N"` a **`"Participio en -N / -EN"`**, aclarando que *written* y *ridden* doblan la consonante.
   - El grupo `'pasado-n'` pasó de `"Participio = pasado + N"` a **`"Pasado con O y participio en -N"`**, aclarando que *worn* pierde la *E* y *forgotten* dobla la *T*.
2. **Eliminación de falsos dialectales y sustantivos reales:**
   - Retiré `thunk` (*think*), `brung` y `brang` (*bring*), `boughten` (*buy*), y los sustantivos `pat`, `cat`, `hat` (*put, cut, hit*). Los reemplacé por errores reales de hispanohablantes (`thinked/thoughted`, `bringed/broughted`, `buyed/boughted`, `putted/putten/pote`, `cutted/cutten/cot`, `hitted/hitten/het`) manteniendo siempre el tope de máximo 1 falso terminado en `-ed`.
3. **Significado activo en una sola palabra (`esCorto`) y dos falsos curados (`falsosEs`):**
   - Añadí `esCorto` (máximo 10 letras, en infinitivo sin comas ni espacios: *pararse, irse, volverse, vestir*) y `falsosEs` (2 falsos del mismo tramo, sin sinónimos como *hacer/hacer* o *empezar/empezar*, y con longitudes balanceadas) a los 60 verbos irregulares y los 12 regulares.
4. **El tercer molde en `js/oraciones.js` (`forma: 'base'` con `didn't` y `Did ... ?`):**
   - Añadí 72 oraciones nuevas (1 por verbo, pasando de 144 a 216 oraciones) con auxiliar en pasado (`didn't` o `Did`) que exigen la forma **base** en el hueco y ponen el pasado irregular como primer falso, corrigiendo el error clásico *"I didn't went"* / *"Did you bought?"*.
