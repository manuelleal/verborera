# Réplica de Enseñanza (Segunda ronda): Qué adopto, dónde veo riesgos y mis números para el acuerdo

Leí con mucho cuidado las posturas de **Experiencia** (`2-experiencia.md`) y **Pruebas y Salón** (`3-pruebas-salon.md`). Coincidimos en la médula: trabajar por tramos de 10 verbos, armar palabras con fichas en el puente sin usar el teclado del celular, cerrar la segunda fila regalada cuando `pasado = participio`, meter el tercer molde con `didn't` + base y crear el Modo Salón de 15 minutos.

Además, teniendo claro que **este miércoles el profesor presenta la herramienta ante colegas profesores** (y que vivirá tanto en **GitHub Pages** para entrar desde cualquier celular como en carpeta local de **doble clic**), afino qué adopto, dónde veo riesgos pedagógicos y qué valores exactos propongo cerrar.

---

## 1. Qué adopto de Experiencia y de Pruebas porque mejoran mi propuesta

1. **De Experiencia — Las 8 fichas reutilizables (`7 letras + ⌫` en dos filas de 4, `76×54 px`):** Es mucho más limpio que poner 10 o 12 fichas cuando el verbo es largo (*forgotten*, *written*, *thought*). Que una letra como la `T` o la `E` se pueda tocar dos veces mantiene los botones grandes en `360×740` y evita que el tamaño de la caja delate cuántas letras repetidas lleva el verbo.
2. **De Experiencia — La escalera de 3 escalones (`rachaSabido: 3`, `descansos: [0, 1, 3]`):** Tenía toda la razón: pedir 5 aciertos seguidos obligaba a jugar demasiadas carreras. Bajar a **3 carreras limpias (con descanso intermedio de 1 carrera) + 1 producción con fichas en el puente** garantiza que en una sesión de 12 minutos (o en la demostración en vivo de este miércoles) los profesores vean cómo un verbo sí llega a «Sabido».
3. **De Experiencia — El Mapa de las 6 Cuadras con escudos por verbo y el Robo de Punto en el Puente (Modo Salón):** La regla de «Rebote / Robo de Punto» en el puente del Modo Salón es oro puro para un profesor: es lo único que logra que los 20 estudiantes de los otros dos equipos se queden en silencio prestando atención a la oración ajena.
4. **De Pruebas — Eliminar el chivato del orden en los regulares y no ensuciar el cartel de victoria con regulares:** Que tanto irregulares como regulares puedan pedir pasado o participio en cualquier orden, y que fallar un regular infiltrado se corrija en caliente pero no manche el conteo de los 10 irregulares del tramo.
5. **De Pruebas — Opciones tapadas 4–5 segundos en el Puente del Modo Salón:** Mostrar primero la oración (`Yesterday we ___ the bus`) unos segundos antes de destapar las opciones obliga a todo el equipo a pensar el verbo en su cabeza en vez de gritar un número al azar.

---

## 2. Dónde veo riesgos pedagógicos o de sobrecarga (y cómo corregirlos)

### A. ¿Mostrar o no el número de letras (`_ _ _ _`) en el primer intento con fichas?
- **El riesgo en la propuesta de Experiencia:** Experiencia propone una caja abierta sin rayitas en el primer intento y con un botón extra `✓ Listo`. Pedagógica y ergonómicamente eso tiene dos problemas en celular: primero, exige un toque adicional en `✓ Listo` en cada verbo; segundo, para un estudiante que apenas está consolidando la ortografía de *thought* o *written*, ver un cajón en blanco sin saber si la palabra se acabó produce ansiedad y errores por olvidar darle a «Listo». Tampoco delata la respuesta frente al error típico, porque casi todos los pares confusos tienen el mismo largo (*went* [4] vs *goed* [4] vs *gone* [4]; *spoke* [5] vs *speak* [5]; *sang* [4] vs *sung* [4]; *bought* [6] vs *buyed* [5]).
- **Mi ajuste:** Mostrar una caja limpia pero **auto-verificable al completar la palabra** (o con botón `✓ Listo` grande), y si falla el 1.er intento (`intentosProduccion: 2`), ahí sí mostrar el esqueleto exacto con la primera letra fija (`w _ _ _`) y apagar 2 letras trampa.

### B. Cómo se eligen los distractores de significado en español (cuidado con los sinónimos)
- **El riesgo en ambas propuestas:** Proponen tomar al azar significados de otros verbos del mismo tramo para la segunda fila cuando `pasado = participio`.
- **El peligro en clase:** En nuestra lista hay verbos con significados vecinos o casi sinónimos en español: *make* (hacer) y *do* (hacer); *say* (decir) y *tell* (contar/decir); *see* (ver), *look* (mirar) y *watch* (ver/mirar); *hear* (oír) y *listen*; *start* (empezar) y *begin* (empezar); *leave* (irse, dejar) y *let* (permitir/dejar). Si sale `MAKE` y los tres carriles dicen `[ hacer | decir | ir ]` no hay lío, pero si en un repaso se cruzan `hacer` (de *make*) con `hacer` (de *do*), o `empezar` (*begin*) con `empezar` (*start*), o si la traducción tiene dos palabras (`estar de pie`, `llegar a ser`, `llevar puesto`) que pasan de 10 letras, el estudiante falla teniendo la razón o no cabe en el letrero.
- **Mi ajuste en `verbos.js`:** Yo mismo dejaré definidos en `verbos.js` una propiedad `esCorto` (máximo 10 letras, una sola palabra clara para el cartel de calle: ej. *stand* → `pararse`, *wear* → `vestir`, *become* → `volverse`, *leave* → `irse`) y `falsosEs` (2 significados falsos fijos por verbo que jamás sean sinónimos ni confusos).

### C. Longitud del código para el profesor y número de preguntas en Pre/Post
- **El riesgo en los códigos (`T2-15-KP-BR` de 8–10 letras con guiones):** Si un profesor tiene que teclear a mano 30 códigos de 10 caracteres con letras y guiones (`ANA: T1-2A5-MK,FD`), se va a demorar 10 minutos de la clase y se va a equivocar digitando.
- **Mi ajuste para el código del profesor:**
  1. Que el código manual sea de **solo 5 caracteres sin guiones** (por ejemplo: **`125KF`** = Tramo `1`, Pre `2`, Post `5`, y una letra por cada uno de los 2 verbos fallados dentro de los 10 del tramo, del `0` al `9` o `A` a `J`). Teclear 5 caracteres por estudiante toma 2 segundos.
  2. Además, como el juego estará en **GitHub Pages**, agregar un botón **`Copiar enlace / Resumen`** para que, cuando sí haya celulares con WhatsApp o Classroom, el estudiante lo mande con un toque y el profesor pegue todos los mensajes juntos en una sola caja de texto (el juego extrae los códigos solos del texto pegado).
- **Sobre el número de preguntas en Pre/Post (yo dije 10, Pruebas dijo 6, Experiencia dijo 5):**
  - Reconozco que 10 preguntas antes de empezar a correr aburren al estudiante y se comen 3 minutos de la demostración del miércoles.
  - **Adopto 5 preguntas (`preguntasPrePost: 5`):** 2 de pasado afirmativo, 2 de participio con `have/has` y 1 con `didn't` + base (con significado visible arriba y botón **`Paso / Aún no lo sé`** para no adivinar al azar). Se responde en **45 segundos** y la nota sobre 5 (`De 1/5 a 5/5`) es facilísima de leer para cualquier profesor.

### D. Riesgo de meter `I didn't ___ yesterday` en la calle a toda velocidad
- **El riesgo en Pruebas (Pregunta 2, Opción A):** Pruebas sugirió meter oraciones negativas (`I didn't ___ yesterday`) en los letreros rápidos de la carrera de 3 carriles.
- **Por qué no conviene en la calle:** Leer una oración completa con negación mientras se esquiva al monstruo en 3,5 segundos sobrecarga la lectura en una pantalla de 360 px.
- **Dónde debe ir cada cosa:**
  - **En la calle (carrera):** Carteles ultra cortos de 1 palabra. Cuando `pasado = participio`, la 1.ª fila pide la forma en inglés (`kept`) y la 2.ª fila pide el **significado corto en español** (`guardar` / `dormir` / `sentir`); o en el 40 % de los repasos, sale **al revés** (recoge `KEPT` → 1.ª fila pide la base `keep`, 2.ª fila pide el español `guardar`).
  - **En el puente (quieto y sin reloj):** Ahí viven las 3 estructuras de oración completa: afirmativa en pasado (`Yesterday`), perfecto (`have/has`) y negativa/pregunta con auxiliar (`didn't ___` / `Did you ___?` → base).

---

## 3. Valores exactos que recomiendo para el acuerdo final

Pensando tanto en el semestre completo como en que **este miércoles en el evento con profesores** se pueda probar una partida, un puente con fichas, un Pre/Post de 45 segundos y una ronda de Modo Salón sin que nada falle:

| Punto del acuerdo | Valor exacto que recomiendo | Justificación pedagógica y práctica |
|---|---|---|
| **Trabajo por tramos** | `verbosPorTramo: 10`, `sabidosParaAvanzar: 8`, `cupoMantenimiento: 2` | Avance tangible en una sola sesión sin olvidar los tramos previos. |
| **Escalera a "Sabido"** | `rachaSabido: 3`, `rachaParaEspaciar: 2`, `descansos: [0, 1, 3]` + **1 producción con fichas** | Permite graduar verbos en 10–12 minutos con memoria diferida real. |
| **Cierre del atajo en la calle** | Si `pasado === participio`: Fila 1 = forma en inglés; Fila 2 = `esCorto` (significado en español de máx. 10 letras con `falsosEs` sin sinónimos). En repasos (`40 %`): Carrera al revés (`pasado → base → significado`). | Destruye el atajo de repetir la palabra de la 1.ª fila (< 1 % para bots) y obliga a saber qué significa el verbo. |
| **Producción en el puente** | **8 fichas reutilizables** (`7 letras + ⌫`, de `76×54 px` en 2 filas de 4) en la segunda mitad del puente (`2` de `4` oraciones). `intentosProduccion: 2` (el 2.º muestra inicial `w _ _ _`). | Cero teclado nativo del celular, cero autocorrector, cabe holgado en `360×740` y funciona con teclado físico en PC. |
| **Tercer molde gramatical (`didn't`)** | En `oraciones.js`: agregar 1 oración con `didn't ___` o `Did … ?` por verbo (`forma: 'base'`, señal `didn't`/`Did`, falsos: `[pasado, participio]`). En cada puente sale al menos 1 de este molde. | Ataca de frente el error *"I didn't went"* y rompe el truco de descartar siempre la forma base. |
| **Limpieza de `verbos.js` y `oraciones.js`** | 1) Renombrar grupos `'en'` (*Participio en -N / -EN*) y `'pasado-n'` (*Pasado con O y participio en -N*). 2) Quitar dialectales (`thunk, brung, brang, boughten`) y sustantivos (`pat, cat, hat`). 3) Añadir `esCorto` y `falsosEs` a los 60 verbos + 12 regulares. | Ningún profesor invitado este miércoles encontrará reglas falsas ni palabras dialectales o ambiguas. |
| **Prueba Pre y Post** | `preguntasPrePost: 5` (45 segundos, sin pistas, con botón `Paso / Aún no lo sé`). Código ultracorto de **5 caracteres** (`125KF`) + botón de copiar reporte para pegar en masa en la Vista del Profesor. | Rápido de responder en vivo este miércoles y rapidísimo de digitar o pegar sin internet ni cuentas. |
| **Modo Salón (15 min)** | 2 o 3 equipos, `turnosSalon: 4` verbos por relevo en calle (`lecturaSalon: 5.5 s`, carriles `[1] [2] [3]` gigantes, sin muerte súbita) + Gran Puente de 6 oraciones con opciones tapadas 4 s y **Robo de Punto** + cartel final de **"Los 3 verbos del día"**. | Participan los 30 estudiantes al tiempo, nadie pierde turno y cierra con retroalimentación para el cuaderno. |

---

## Qué comprobé y qué NO pude comprobar

- **Qué comprobé:**
  - Leí completas las posturas `2-experiencia.md` y `3-pruebas-salon.md` y verifiqué en `js/verbos.js` cuáles traducciones actuales en `.es` superan las 10 letras o tienen coma (`'estar de pie'` [12], `'irse, dejar'` [11], `'llegar a ser'` [12], `'llevar puesto'` [13], `'ver, mirar'` [10]) y cuáles verbos comparten traducción (`make/do` = `'hacer'`, `speak/talk` = `'hablar'`, `begin/start` = `'empezar'`, `see/watch` = `'ver'`), confirmando por qué es indispensable definir `esCorto` y `falsosEs` curados a mano en `verbos.js`.
- **Qué NO pude comprobar:**
  - Aún no he editado `js/verbos.js` ni `js/oraciones.js` con las nuevas propiedades (`esCorto`, `falsosEs` y la tercera oración con `didn't`), a la espera de que el coordinador cierre el acuerdo definitivo de esta ronda.
