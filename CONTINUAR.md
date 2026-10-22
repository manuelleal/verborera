# Para quien siga mejorando el juego

Lea esto primero. Para abrir y usar el juego está `LEEME.md`; para entender cómo se hizo y por qué, `REGISTRO.md`. Aquí va lo que hace falta para seguir: en qué estado queda, qué ya se decidió, qué falta y cómo trabajar sin dañar lo que sirve.

## En qué estado queda

- **Herramienta semestral lista para la presentación de este miércoles con profesores y para subir a GitHub / GitHub Pages.**
- Funciona en computador y celular, abre con doble clic (`index.html`) y desde celulares con `ABRIR-JUEGO.bat`. No usa internet, no usa librerías externas ni fuentes de Google (`file://` garantizado).
- 60 verbos irregulares en 9 grupos y 6 cuadras de 10 verbos (`1. Salida de Casa`, `2. La Panadería`, `3. El Parque`, `4. La Estación`, `5. El Puente Mayor`, `6. El Colegio`), más 12 regulares infiltrados.
- **Producción sin teclado del teléfono:** Caja de 8 Fichas de Letras (`4 × 2`, 7 letras únicas + `⌫`), visor superior con esqueleto de ayuda en 2.º intento, botón `✓ Listo`, soporte de teclado físico (`A–Z`, `Backspace`, `Enter`) y botón opcional de micrófono (`🎤`).
- **Repaso espaciado por tramos:** `rachaSabido: 3` + 1 producción limpia con fichas. En 30 partidas perfectas se logran **60 de 60 verbos sabidos** (frente a 0/60 antes).
- **Cierre definitivo de tramposos:** cuando pasado = participio, la 2.ª fila pide significado o auxiliar `didn't ___` (forma base). Todos los bots tramposos ganan **0.0 %** (ninguno llega a 1 %).
- **Evaluación demostrable sin servidor:** Termómetro Pre/Post (5 preguntas en 45 s), código de reporte de 6 caracteres con dígito verificador y **Vista del Profesor** con botón *"✨ Cargar ejemplo de salón (25 estudiantes)"*.
- **Modo Salón (15 min en proyector):** 2 o 3 equipos, relevos de 4 verbos, carriles con números gigantes `[ 1 ] [ 2 ] [ 3 ]`, pausa con `Espacio` y Gran Puente con Robo de Punto.
- **Banco de pruebas:** `node pruebas/bots.js` cumple **57 de 57 requisitos duros (`57/57 CUMPLE`, 0 NO CUMPLE)**. Visualmente inspeccionado con Playwright en `360×740` y `1280×720` con 0 errores en consola.

## Lo que ya se decidió (no reabrir sin hablar con el dueño)

| Decisión | Quién | Por qué |
|---|---|---|
| El verbo BE queda por fuera | El dueño | Tiene dos pasados (was/were) y en un letrero cabe una sola palabra |
| Persigue el Monstruo de la Ignorancia; el profesor es aliado | El dueño | Un profesor persiguiendo al estudiante dice lo contrario de lo que se quiere enseñar |
| Sin Blender ni modelos: todo dibujado por código, pero con mundo, color y vida | El dueño | La primera versión, sobria y vacía, la rechazó: "me aburrí solo con entrar" |
| La revisión es completar oraciones, quieta y sin reloj | Debate de tres agentes; aprobado por el dueño | Solo quieta puede votar todo un salón, y leer la señal (yesterday / have) es lo que la prisa estropea |
| No hay actividad de "ordenar" ni de "conectar" | Debate; explicado al dueño | En ordenar, el verbo ya viene escrito; conectar es lo que la carrera ya hace |
| Verbos regulares infiltrados | El coordinador; **falta que el dueño lo confirme** | Sin ellos, "nunca escojas la que termina en -ed" ganaba 63 % sin saber inglés. Se apagan con `regularesPorPartida: 0` |
| Se deja sin cerrar el último "tramposo" | El coordinador | Llega al colegio sin saber los verbos, pero nunca limpio, y lo que aprovecha es el patrón que el juego enseña (pasado = participio en la mitad de los verbos) |

## Qué falta, en orden de importancia

1. **Probarlo con estudiantes de verdad.** Es lo único que ningún agente puede hacer. Mirar sobre todo: si les alcanzan los 4,5 segundos para leer (`lecturaInicial` en `js/reglas.js`), dónde se aburren, si entienden el puente sin explicación, y qué errores repiten (la pantalla final los muestra; "Copiar resultado" los da como texto).
2. **El ritmo del repaso entre partidas.** Con 60 verbos y pocos por carrera, cada verbo vuelve cada 7 u 8 partidas, y casi ninguno llega a "sabido" (pide 5 partidas seguidas sin fallarlo: `rachaSabido`). Hay que decidir: más verbos por carrera, menos verbos en total, o trabajar por tramos.
3. **Datos para que revise un profesor de inglés:**
   - Los carteles "Participio = base + N" y "Participio = pasado + N" no predicen bien *written*, *ridden* ni *worn*.
   - Algunos falsos existen en dialectos (*thunk*, *brung*, *boughten*) y otros son forzados (*pat*, *cat*, *hat* en el grupo de los que no cambian).
   - Las 144 oraciones se revisaron, pero nunca las leyó en voz alta una persona.
4. **Lo que se ve, todavía flojo:** con el celular acostado el tablero del puente tapa media escena; el profesor de espaldas es tosco; en pantalla ancha el colegio del final se ve pequeño; en pantallas muy bajitas (menos de unos 650 píxeles de alto) la letra de los letreros baja de 16 píxeles.
5. **La voz de la oración completa en el puente:** nadie la ha oído. La voz de la carrera sí funciona (la oyó el dueño).
6. **El banco de pruebas tiene dos pruebas viejas:**
   - "En regulares, cerca de la mitad pide primero el participio": se cambió a propósito (el orden delataba a los regulares nuevos).
   - "Con todo apagado, idéntico a la segunda ronda": falla solo por la duración, porque se acortó el tiempo entre verbos.

   Hay que actualizarlas para que el banco vuelva a gritar solo por fallas reales.
7. **`DISENO.md` quedó atrás:** describe la primera versión. Lo nuevo (revisión, regulares, orden al azar, topes) está en la sección "Segunda etapa" y "Tercera etapa" de `AGENTES.md` y en el bloque final de `js/reglas.js`.
8. **Ideas guardadas para después** (salieron del debate, en `equipo/debate/5-acuerdo.md`): la "fila al revés" (se muestra `went` y hay que encontrar `go`), tocar en orden las tres formas revueltas al ganar el puente, y un mapa del recorrido.

## Cómo trabajar sin dañar lo que sirve

1. **Guarde una copia antes de empezar.** La carpeta pesa menos de 3 MB.
2. **Casi todo se ajusta en `js/reglas.js`,** sin tocar el programa: cada número tiene su explicación al lado.
3. **Antes y después de cada cambio, corra `node pruebas/bots.js`** (necesita Node.js) y compare. Debe seguir cumpliéndose que el que no toca nada pierde, el que juega al azar no gana y el que siempre acierta gana siempre.
4. **Mire el resultado con sus ojos,** en celular y en computador. Las pruebas automáticas no notan que algo aburre ni que un dibujo tapa a otro: en este proyecto pasaron las dos cosas con todas las pruebas en verde.
5. **Pruebe jugando mal a propósito** y buscando atajos. Así salieron los dos problemas más serios del proyecto.
6. **Cada arreglo pide su vuelta de pruebas:** dos veces un arreglo abrió un hueco nuevo.
7. **Anote lo que haga en `REGISTRO.md`**, en el mismo estilo: qué se pidió, quién lo hizo, qué se decidió, qué salió mal y cómo se notó. Es parte de la entrega, no un extra.

### Si sigue trabajando con agentes de IA

Así se hizo, y está todo preparado para continuar:

- Dele al agente principal estos tres archivos para empezar: `CONTINUAR.md`, `AGENTES.md` y `REGISTRO.md`.
- Mantenga la regla de `AGENTES.md`: cada agente es dueño de sus archivos y no edita los de otro.
  - Enseñanza: `js/verbos.js` y `js/oraciones.js`.
  - Mecánica: `js/reglas.js` y `DISENO.md`.
  - Construcción: `index.html`, `js/logica.js` y `js/juego.js`.
  - Pruebas: `pruebas/`.
- Pida a cada agente que diga en su informe **qué no pudo comprobar**. Las bitácoras de cada uno, en `equipo/`, muestran el formato.

## Mapa rápido del código

| Archivo | Qué tiene | Para tocarlo hay que saber |
|---|---|---|
| `js/verbos.js` | Verbos, grupos, falsos, pistas, regulares | Nada de programación: es una lista. Las reglas de los datos están al principio y en `AGENTES.md` |
| `js/oraciones.js` | Oraciones de la revisión | Igual: una lista, con sus reglas al principio |
| `js/reglas.js` | Todos los números del juego | Cambiar un número |
| `js/logica.js` | Las reglas del juego, sin pantalla; es lo que usan los bots | JavaScript. No toca la pantalla ni el guardado, y usa un generador con semilla (no `Math.random`) para que las partidas se puedan repetir |
| `js/juego.js` | Todo lo que se ve y se oye: dibujo, controles, voz, pantallas, guardado | JavaScript y dibujo en `canvas`. Es el archivo más grande |
| `index.html` | La página y los estilos de los menús | HTML y CSS |
| `pruebas/bots.js` | El banco de pruebas | JavaScript para Node |
