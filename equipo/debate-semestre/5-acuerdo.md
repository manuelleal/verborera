# Acuerdo del Debate Semestral (Pasos 21 y 22)

Tras las tres posturas independientes (`1-ensenanza.md`, `2-experiencia.md`, `3-pruebas-salon.md`) y las tres réplicas cruzadas (`4-replica-ensenanza.md`, `4-replica-experiencia.md`, `4-replica-pruebas.md`), el equipo cierra este acuerdo vinculante para convertir el juego en una herramienta de todo el semestre y dejarlo listo para la demostración de este miércoles ante profesores (tanto con doble clic en `index.html` como en GitHub Pages).

---

## 1. Producción sin opciones: Caja de 8 Fichas de Letras + Teclado + Voz opcional

1. **Dónde se produce:**
   - **En la calle (carrera):** se mantienen los 3 carriles ágiles de lectura rápida (`3,5–4,5 s`).
   - **En el puente (sin reloj):** la primera mitad de las oraciones se resuelve eligiendo entre 3 carteles (andamiaje de la señal gramatical) y la **segunda mitad (`produccionPorRevision: 2` en carreras de 4 oraciones; `3` en cierres de 6 oraciones)** se resuelve **armando el verbo letra por letra con la Caja de Fichas**.
   - **Requisito de graduación a "Sabido":** ningún verbo sube al estado final `sabido` sin haber sido producido correctamente al menos una vez (`produccionesLimpias >= 1`).
2. **Geometría y reglas de la Caja de Fichas (`fichasLetrasTotal: 8`, cuadrícula `4 × 2`):**
   - **7 fichas de letras únicas reutilizables + 1 ficha `⌫` (borrar)** en 2 filas de 4 botones (`76 × 54 px` con letra de `26 px` en celular `360 × 740`; `150 × 72 px` en computador/proyector `1280 × 720`).
   - Como cada letra se puede tocar más de una vez en letras repetidas (*keep, been, written, forgotten*), 7 letras únicas cubren el **100 % de los verbos** sin invocar jamás el teclado nativo del celular ni su autocorrector.
   - **Anti-trampa en las fichas (cierre del Hueco 2 de Pruebas):**
     - Las 7 letras únicas incluyen todas las letras de la respuesta correcta **más** las letras necesarias para formar al menos un error típico completo del verbo (p. ej. en *went*, incluye `G, O, D` para poder escribir *goed* o *gone*), barajadas con la semilla de la partida.
     - En el **1.er intento** (`intentosProduccion: 2`), la caja de respuesta es abierta (sin rayitas `_ _ _ _` que delaten el largo) y se confirma con el botón **`✓ Listo`** (o tecla `Enter`).
     - Si falla el 1.er intento, en el **2.º intento** el profesor muestra el esqueleto con la longitud exacta y la primera letra fija (`w _ _ _`) y apaga 2 letras trampa (cuenta como completado con ayuda, no a la primera).
   - **Teclado físico en PC y Voz opcional:** en computador acepta tecleo directo (`A–Z`, `Backspace`, `Enter`); incluye botón opcional **`🎤 Decirlo`** (`SpeechRecognition` del navegador cuando esté disponible, nunca obligatorio).

---

## 2. Repaso espaciado real por Tramos de 10 verbos

1. **Bolsa activa por tramo (`verbosPorTramo: 10`, `tramoCerrado: true`, `sabidosParaAvanzar: 8`):**
   - El modo `"Seguir aprendiendo"` (`camino`) trabaja sobre el **tramo activo de 10 verbos** (Cuadras 1 a 6).
   - A partir del Tramo 2, cada carrera de 8 turnos reserva hasta `cupoMantenimiento: 2` turnos para verbos de tramos anteriores cuyo descanso llegó a 0 o que tengan fallos pendientes.
   - Cuando el estudiante alcanza **8 de 10 verbos en estado `"sabido"`**, se desbloquea el siguiente tramo en el Mapa de las 6 Cuadras.
2. **Escalera de dominio en 3 escalones (`rachaParaEspaciar: 2`, `descansos: [0, 1, 3]`, `rachaSabido: 3`):**
   - **Escalón 1 (`racha: 1`, `descanso: 0`):** 1.ª carrera limpia; vuelve enseguida en la siguiente carrera.
   - **Escalón 2 (`racha: 2`, `descanso: 1`):** 2.ª carrera limpia seguida; descansa 1 carrera completa.
   - **Escalón 3 (`racha: 3` + `produccionesLimpias >= 1`, `descanso: 3`):** vuelve del descanso, pasa limpio y se arma con fichas en el puente → **¡Sabido!**, descansando 3 carreras.
   - **Efecto medido:** en **4 a 5 carreras (~11–12 minutos)** un estudiante atento logra **8 a 10 verbos `"sabidos"`** (frente a los `0 sabidos` tras 30 carreras del sistema anterior).

---

## 3. Cierre definitivo del atajo en la calle (< 1 %), significado activo y 3.er molde (`didn't`)

1. **Cierre de la 2.ª fila regalada cuando `pasado === participio` (`filaSignificadoEnIguales: true`):**
   - En los 30 verbos irregulares donde `pasado === participio` y en los 12 regulares infiltrados, **queda prohibido que las dos filas del turno tengan la misma respuesta correcta**.
   - **Fila 1:** pide la forma en inglés (`pasado` o `participio`, ej. `kept / keeped / kopt`).
   - **Fila 2:** pide **el significado corto en español (`pide: 'significado'`)** entre `[ esCorto, falsosEs[0], falsosEs[1] ]` (ej. `guardar / dormir / sentir`), **o bien** el contraste negativo en pasado **`didn't ___` (`pide: 'base'`)** donde la respuesta correcta es la **forma base** (`keep` frente a `kept` y un falso morfológico).
   - **Cierre del "soplo del libro" (Hueco 1 de Pruebas):** cuando un turno incluye una fila con `pide: 'significado'`, el cartel del libro al inicio de ese turno muestra **solo el verbo en inglés (`KEEP`)** sin mostrar la traducción arriba; la traducción se confirma en el listón al cruzar la fila o en la explicación del profesor si tropieza.
2. **Cierre del chivato en los regulares infiltrados:**
   - Tanto los verbos irregulares como los regulares infiltrados usan la misma regla de orden de preguntas. Así el orden jamás delata si un verbo lleva `-ed`.
   - Además, los regulares infiltrados no ensucian el conteo de verbos pendientes de los 10 verbos del tramo en la pantalla de victoria.
3. **Tercer molde gramatical en `js/oraciones.js` (`forma: 'base'` con `didn't` / `Did ... ?`):**
   - Cada uno de los 60 verbos irregulares y 12 regulares tendrá **3 oraciones** en `js/oraciones.js` (216 oraciones en total):
     1. `forma: 'pasado'` (afirmativa con señal de pasado cerrado: `Yesterday`, `last night`, `ago`).
     2. `forma: 'participio'` (con auxiliar `have / has / had`).
     3. `forma: 'base'` (negativa o pregunta en pasado con señal `didn't` o `Did`, donde la respuesta correcta es `base` y `falsos` incluye el pasado irregular, corrigiendo *"I didn't went"* y *"Did you bought?"*).
4. **Limpieza de `js/verbos.js`:**
   - Renombrar los grupos 4 (`'en'` → `"Participio en -N / -EN"`) y 5 (`'pasado-n'` → `"Pasado con O y participio en -N"`) para que la explicación sea 100 % fiel a *written, ridden, worn, forgotten*.
   - Reemplazar los falsos dialectales (`thunk`, `brung`, `brang`, `boughten`) y los sustantivos reales (`pat`, `cat`, `hat`) por errores reales de aprendices hispanohablantes (`thinked/thoughted`, `bringed/broughted`, `buyed/boughted`, `putted/putten`, `cutted/cutten`, `hitted/hitten`).
   - Añadir a los 60 verbos y 12 regulares `esCorto` (1 sola palabra en infinitivo ≤ 10 letras) y `falsosEs` (2 significados falsos del mismo tramo, sin sinónimos y con longitudes balanceadas).

---

## 4. Demostrar que funciona: Pre/Post de 45 s, Código de 6 caracteres y Vista del Profesor

1. **Termómetro Pre y Post por tramo (`preguntasPrePost: 5`):**
   - Antes de jugar un tramo (Pre) y al completarlo (Post), el estudiante responde **5 preguntas rápidas en 45 segundos** (2 pasado, 2 participio, 1 `didn't` + base, sin pistas del profesor y con botón **`Paso / Aún no lo sé`**).
   - El juego guarda en `localStorage` la comparación (`Pre: 1/5 → Post: 5/5 (+4 verbos aprendidos)`) y la muestra en la pantalla final y en el Mapa de las 6 Cuadras.
2. **Código de Resumen de 6 caracteres (`125BDK`) + Vista del Profesor sin servidor:**
   - Al terminar, se muestra en grande un código de **6 caracteres** con suma de verificación: Tramo (`1–6`), nota Pre (`0–5`), nota Post (`0–5`), los 2 verbos con más fallos del tramo (`A–J` o `0`) y letra de control (`A–Z`), más botón **`Copiar reporte`**.
   - En la portada hay acceso a la **`Vista del Profesor`**: permite digitar o pegar códigos del curso (e incluye un botón **`Cargar ejemplo de salón (25 estudiantes)`** listo para la demostración de este miércoles), calcula el avance grupal Pre → Post, señala los 3 verbos más fallados y ofrece el botón **`Lanzar revancha en el proyector con estos verbos`**.

---

## 5. Modo Salón (15 minutos, 1 proyector, 30 estudiantes) y mejoras visuales

1. **Modo Salón por Equipos (`2 o 3 equipos`):**
   - **Relevos en la Calle:** `turnosSalon: 4` verbos por equipo (~60–75 s por relevo), tiempo de lectura `lecturaSalon: 5.5 s`, carriles numerados con alto contraste **`[1 Azul] · [2 Amarillo] · [3 Verde]`** (teclas directas `1`, `2`, `3`), tecla **`Espacio`** para pausa pedagógica del profesor, y sin muerte súbita (`+100` por acierto, `-50` por tropiezo).
   - **Gran Puente Final con Robo de Punto:** 6 oraciones alternadas donde la oración aparece primero con opciones tapadas (o botón de destapar) para que el equipo piense la respuesta, y si falla salta **`¡REBOTE PARA EL SIGUIENTE EQUIPO (+100 pts)!`**, manteniendo a los 30 estudiantes atentos. Cierra con el cartel **"Los 3 verbos del día"**.
2. **Correcciones visuales comprobadas en capturas (`360×740` y `1280×720`):**
   - En la pantalla final de computador (`1280×720`), agrandar el colegio y separar el título/puntaje para que no pisen el techo ni la bandera.
   - Al fallar una pancarta en celular (`360×740`), limpiar la pancarta rota antes de que se encime con la siguiente fila.
   - Mejorar la silueta del profesor de espaldas en el puente (`dibujarProfesorFrena`) para que tenga cabeza, pelo, gafas y brazos expresivos en vez de un trapecio cuadrado.
