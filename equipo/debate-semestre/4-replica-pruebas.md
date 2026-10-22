# Réplica de Pruebas — Ojo crítico sobre las propuestas y números para el banco de bots

Leí las propuestas de **Enseñanza** (`1-ensenanza.md`) y de **Experiencia y Mecánica** (`2-experiencia.md`). Coincidimos en las cinco decisiones grandes: producir con fichas de letras propias en el puente (nunca con el teclado del celular), trabajar por tramos cerrados de 10 verbos, romper la segunda fila repetida cuando `pasado == participio`, meter el tercer molde (`didn't ___` → base) y sumar Pre/Post con Tablero del Profesor y Modo Salón de 15 minutos.

Pero como mi oficio es pensar como el bot tramposo antes de escribir una línea de prueba, encontré **cuatro huecos concretos** en los detalles de mis compañeros que, si no se cierran en el acuerdo final, van a dejar vivo al tramposo.

---

## 1. Cuatro huecos para tramposos detectados en las propuestas (y cómo cerrarlos)

### Hueco 1 — El "soplo del libro" en la primera carrera (`Experiencia`, secciones 2B y 3)
- **El hueco:** Experiencia propone que en los 30 verbos donde `pasado == participio` la 2.ª fila pregunte el significado en español (`[ guardar | dormir | sentir ]`), **pero a la vez** propone que cuando el verbo se ve por primera vez (`vistos === 0`) el libro muestre arriba **`KEEP = guardar`** al recogerlo.
- **Cómo lo explota mi bot:** Exactamente igual que hoy. El bot guarda en memoria la palabra en español que salió al recoger el libro (`guardar`) y 4 segundos después, en la 2.ª fila, escoge el letrero idéntico (`guardar`). Acierta el **100 %** de las segundas filas en la primera carrera y sigue ganando más del **60 %** sin saber inglés.
- **Cierre obligatorio:**
  1. Si un turno de la carrera va a preguntar el significado en español en una fila, **el libro de ese turno NO puede mostrar la traducción antes de la pregunta**; el significado se confirma *después* de pasar esa fila (o el profesor lo enseña si el jugador tropieza).
  2. Mejor aún: combinar las dos ideas en los verbos con `pasado == participio`. Cuando el verbo es nuevo (`vistos === 0`), el libro sí enseña `KEEP = guardar`, la 1.ª fila pide el pasado/participio (`Yesterday I ___` → `kept`) y la **2.ª fila pide el contraste con `didn't`** (`I didn't ___` → `keep`, donde repetir `kept` falla el 100 % de las veces). Y a partir de la segunda aparición (`vistos >= 1`), el libro muestra solo `KEEP` y una de las filas pide el significado en español (`guardar`). Así jamás se pregunta algo que acaba de salir escrito hace 4 segundos ni algo que nunca se ha presentado.

### Hueco 2 — Pistas de longitud o de casillas en la Caja de Fichas (`Enseñanza` y `Experiencia`)
- **El hueco:** Enseñanza sugiere mostrar esqueletos como `dr _ _ k`, y Experiencia menciona mostrar casillas vacías `_ _ _ _` en el hueco (aunque luego aclara que en el primer intento la caja es abierta). Además, si las 7 letras disponibles solo alcanzan para escribir `went` pero no `goed` ni `gone`, un bot que pruebe qué palabra de su lista se puede formar con esas letras acierta siempre.
- **Cierre obligatorio:**
  1. **Primer intento a ciegas de longitud:** en el 1.er intento de producción (y en todo el Pre/Post), el hueco es una caja abierta con botón **`✓ Listo`**, sin rayitas `_ _ _ _` que delaten cuántas letras tiene la respuesta (las rayitas y la letra inicial solo salen en el 2.º intento tras fallar en el puente, como ayuda pedagógica que ya no suma para "todo a la primera").
  2. **Fichas que también armen el error típico:** las 7 letras reutilizables (`+ 1 borrar`) deben contener todas las letras únicas de la forma correcta **y todas las letras únicas de al menos un falso completo del verbo** (ej. para `went`, incluir `G, O, D` para que también se pueda escribir `goed`, `gone` y `go`).
  3. **Orden barajado con semilla:** las 7 letras nunca pueden salir en el orden de la palabra ni con la inicial siempre en la primera casilla.

### Hueco 3 — El truco de "la palabra más corta/larga" en los significados en español (`Enseñanza` y `Experiencia`)
- **El hueco:** Si en los letreros de significado ponemos traducciones de dos palabras (`ponerse de pie`, `llegar a ser`) o si la traducción correcta suele ser más corta (`ir`, `ver`, `dar`) que los dos falsos (`construir`, `encontrar`), mi buscador de 6.800 reglas va a encontrar enseguida la regla *"en español, escoge siempre la más corta"* y subirá del 33 % al 55 %.
- **Cierre obligatorio para `js/verbos.js`:**
  - Todo significado de letrero debe ser **una sola palabra en infinitivo (`-ar`, `-er`, `-ir`) de máximo 10 letras** (ej. *stand* → `pararse`, *become* → `volverse`, *wake* → `despertar`).
  - Cada verbo debe traer en `verbos.js` sus **2 falsos de significado en español** del mismo tramo y con longitudes balanceadas: en cada tramo de 10 verbos, la respuesta correcta no puede ser la más corta ni la más larga en más de 4 de los 10 verbos.

### Hueco 4 — El chivato de los regulares infiltrados y el código falsificable
- **Regulares sin chivato:** hoy los regulares se delatan porque empiezan pidiendo participio el 50 % de las veces mientras que los nuevos irregulares nunca lo hacen. Con las reglas nuevas, los 2 regulares infiltrados de la carrera deben seguir **exactamente el mismo par de preguntas** que los verbos del tramo donde caen (por ejemplo, forma afirmativa + contraste con `didn't` o significado), y como ya propuse en primera ronda, fallar un regular infiltrado se corrige en el puente pero no debe manchar el cartel de victoria limpia si no se va a reencolar.
- **Código del profesor a prueba de vivos:** tanto Enseñanza como Experiencia proponen un código corto legible (`T2-15-KP-BR`). Si un adolescente ve que el `15` significa `Pre 1 → Post 5`, escribirá `T2-19-KP-BR` a mano. El código de 8 caracteres debe cerrar con **2 letras de control (suma simple calculada sobre tramo, notas y verbos)** que el Tablero del Profesor valide al instante.

---

## 2. Números unificados con los que voy a programar `pruebas/bots.js`

Nota importante sobre un número de `2-experiencia.md`: al final de su documento, Experiencia escribió que el tramposo bajaría *"a menos de 12 % de victorias"*. **No acepto 12 %**: nuestro requisito duro desde el día uno es **`< 1 %`**, y con el cierre del Hueco 1 (sin soplo del libro a la 2.ª fila) la matemática real da **`< 0,4 %`**.

Estos son los números duros que exigirá `node pruebas/bots.js`:

| Qué se mide | Número duro exigido en `pruebas/bots.js` |
|---|---|
| **1. Mejor bot tramposo en carrera** (entre las 6.800 reglas mecánicas + memoria del libro y de la 1.ª fila, sin saber inglés) | **≤ 1,0 %** de victorias en el modo `camino` (1.ª partida), en cada uno de los 6 tramos y en cualquier grupo |
| **2. Bots tramposos en el Puente y en Pre/Post** (descartar `-ed`, longitud, fuerza bruta en fichas de letras sin saber inglés) | **≤ 1,0 %** de sellos limpios en el puente; **≤ 5 %** de acierto en preguntas de producción con fichas |
| **3. Llegada a `Sabido` en una sesión de clase** (`verbosPorTramo: 10`, `rachaParaEspaciar: 2`, `descansos: [0, 1, 3]`, `rachaSabido: 3` + 1 producción limpia) | En **5 carreras + sus puentes** (~11–12 min): el **Perfecto** logra **≥ 8 de 10 verbos en `sabido`** (destraba el tramo); el **Aprendiz 90 %** lo logra en **≤ 6 carreras**; cualquier **Tramposo** queda con **0 verbos `sabidos`** |
| **4. Tamaño y legibilidad en celular `360 × 740` y proyector `1280 × 720`** | En `360×740`: letra de letreros y oraciones **≥ 16 px**; fichas de letras **≥ 48 × 48 px** (las `76 × 54 px` propuestas cumplen), ocupando **≤ 140 px** de alto total y **0 elementos `<input>` nativos** durante el juego. En `1280×720` (`Modo Salón`): letra de letreros **≥ 28 px** |
| **5. Duración de cada modo** | Carrera individual: **1:40 a 3:30**. Pre o Post (5 preguntas con fichas y botón *Paso*): **≤ 60 s**. `Modo Salón` (3 equipos × 4 turnos sin muerte súbita + 6 retos de puente con rebote): **10 a 14 minutos** |
| **6. Datos limpios (`verbos.js` y `oraciones.js`)** | **0** falsos dialectales (`thunk`, `brung`, `brang`, `boughten`), **0** sustantivos forzados (`pat`, `cat`, `hat`), **60 de 60** verbos con significado de 1 palabra (≤ 10 letras) y 2 falsos de significado balanceados, y presencia de los **3 moldes** (`pasado`, `participio`, `base` con `didn't / Did...?`) |

### Qué pruebas viejas de `pruebas/bots.js` se actualizan y cuáles se agregan
- **Se actualizan (4 reglas que cambian a propósito):**
  1. `armarCola`: pasa de exigir los 60 verbos seguidos de 4 en 4 a verificar el **tramo activo de 10 verbos** (`sabidosParaAvanzar: 8`) y el `cupoMantenimiento: 2` desde el Tramo 2.
  2. Escalera de repaso: pasa de probar `rachaParaEspaciar: 3 / descansos: [1,2,4] / rachaSabido: 5` a probar `2 / [0,1,3] / 3` verificando que ningún verbo suba a `sabido` sin haber aprobado al menos 1 producción con fichas.
  3. Filas por turno: pasa de exigir siempre `[pasado, participio]` a exigir que en `pasado === participio` las dos filas nunca tengan la misma respuesta correcta ni repitan lo que mostró el libro en ese mismo turno.
  4. Contrato de `oraciones.js`: pasa de prohibir `did/didn't` y preguntas a validar el tercer molde (`forma: 'base'` con señal `didn't` o `Did`).
- **Se mantienen intactas:** determinismo por semilla, invarianza de `dt`, quieto y azar pierden siempre (0 de 1.000), perfecto gana siempre (100 %), ninguna partida infinita, y reparto parejo de carriles (33/33/33 %).

---

## 3. Listo para el evento de este miércoles (Doble clic local + GitHub Pages)

Pensando en que este miércoles el profesor lo presenta ante otros docentes y que el juego se podrá abrir tanto con **doble clic en `index.html`** como desde **GitHub Pages**:
1. **Cero dependencias externas y rutas relativas limpias:** todo el código nuevo (Caja de Fichas, Pre/Post, Modo Salón y Tablero del Profesor) debe vivir en los mismos archivos locales sin pedir servidores, bases de datos ni permisos obligatorios de micrófono.
2. **Demostración en vivo en 15 minutos con los profesores invitados:** en el evento del miércoles, los profesores asistentes podrán abrir el enlace de GitHub Pages en sus propios celulares, hacer en 45 segundos el Pre-Tramo, jugar una carrera o el Modo Salón proyectado al frente, y dictarle al presentador sus códigos cortos de 8 caracteres para ver en el proyector cómo el **Tablero del Profesor** arma en 10 segundos la estadística real del auditorio y lanza la revancha con los 3 verbos más fallados.

---

## Qué comprobé y qué NO pude comprobar en esta réplica

- **Qué comprobé:** leí completas `1-ensenanza.md` y `2-experiencia.md` y crucé sus reglas propuestas contra la lógica actual de mis bots en `pruebas/bots.js` (en particular cómo el bot con memoria de turno explotaría el cartel `BUY = comprar` si en esa misma vuelta se pregunta el significado en español).
- **Qué NO pude comprobar todavía:** aún no he ejecutado `node pruebas/bots.js` con los nuevos números porque en fase de debate no se editan `js/verbos.js`, `js/oraciones.js`, `js/reglas.js`, `js/logica.js` ni `pruebas/bots.js`. En cuanto el coordinador cierre el acuerdo y Construcción/Enseñanza/Mecánica entreguen los cambios, actualizaré y correré el banco completo.
