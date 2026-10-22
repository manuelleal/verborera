# Contrato del equipo — juego de verbos irregulares

Este archivo es el acuerdo entre los agentes. Cada uno es dueño de sus archivos y **no edita los de otro**. Si necesita algo de otro, lo pide en su bitácora y sigue con lo suyo.

## El juego en una frase

Un estudiante corre por una calle de tres carriles perseguido por el Monstruo de la Ignorancia. Recoge un verbo (GO), luego pasa por el carril del pasado correcto (went) y después por el del participio (gone). Equivocarse es tropezar; dos tropiezos seguidos y el monstruo lo atrapa. El profesor es el aliado que da pistas.

> **Ajuste tras el diseño (coordinador):** Mecánica añadió un comodín: el profesor salva al estudiante de una captura, una vez. La frase "dos tropiezos seguidos y lo atrapa" sigue siendo la regla; el comodín es la excepción visible y se apaga poniendo `comodinInicial: 0` en `js/reglas.js`. `DISENO.md` manda en todo lo que amplía este contrato (modos, campos extra del estado, eventos extra).

## Decisiones ya tomadas (no se reabren)

- **2D con perspectiva, dibujado por código en un `<canvas>`.** Sin Three.js, sin Blender, sin modelos, sin imágenes externas, sin fuentes de internet. Lo que tiene que verse bien son las palabras.
- **Abre con doble clic** (`file://`) y también servido por `python servidor.py`. Por eso: scripts clásicos con `<script src>`, **nada de `import`/`export` ni `fetch`**.
- **Computador y celular**: teclado (← →, A/D) y toque (tocar mitad izquierda/derecha, o deslizar).
- **Unos 30 verbos** en total. Es para una exposición ante profesores: pequeño y explicable vale más que completo.
- Textos de la interfaz en español; los verbos en inglés.
- Todo se guarda en el dispositivo (`localStorage`, clave `verbosJuego`). Sin cuentas ni servidor.
- No se publica nada. En ningún archivo va el nombre, correo ni rutas del computador del dueño.

## Quién es dueño de qué

| Rol | Archivos propios | Entrega |
|---|---|---|
| Coordinador (chat principal) | `AGENTES.md`, `REGISTRO.md`, `GUIA-PARA-PROFES.md` | Reparte, junta, mira en capturas, lleva el registro |
| Enseñanza de inglés | `js/verbos.js`, `equipo/ensenanza.md` | Lista de verbos, grupos por patrón, orden, distractores, pistas, estrategia de repaso |
| Mecánica | `js/reglas.js`, `DISENO.md`, `equipo/mecanica.md` | Cómo se juega, con números: tiempos de lectura, tropiezo, captura, cómo se gana, cómo se repite lo fallado |
| Construcción | `index.html`, `js/logica.js`, `js/juego.js`, `servidor.py`, `equipo/construccion.md` | El juego funcionando |
| Pruebas | `pruebas/bots.js`, `pruebas/INFORME.md`, `equipo/pruebas.md` | Bots y mediciones. No arregla el juego: reporta |

## La bitácora de cada agente (`equipo/<rol>.md`)

Es material para explicarles a profesores que no programan. Escribir en lenguaje llano, sin jerga, con estas secciones:

1. **Qué me pidieron**
2. **Qué decidí y por qué** (las decisiones, no el detalle técnico)
3. **Qué salió mal o qué dudé, y cómo lo noté**
4. **Qué necesito de otro agente o del dueño**

Ser honesto en la tercera: los errores son lo más útil de contar.

## Cómo encajan los archivos

Todos los scripts cuelgan de un único objeto global `VJ` y funcionan igual en el navegador y en Node (para los bots). Plantilla obligatoria:

```js
(function (raiz) {
  const VJ = raiz.VJ = raiz.VJ || {};
  // ... VJ.ALGO = ...
})(typeof window !== 'undefined' ? window : globalThis);
```

Orden de carga: `verbos.js` → `reglas.js` → `logica.js` → `juego.js`.

### `js/verbos.js` (Enseñanza)

```js
VJ.GRUPOS = [
  { id: 'no-cambian', nombre: 'Los que no cambian', explicacion: 'Las tres formas son iguales.', ejemplo: 'cut – cut – cut' },
  // ...
];
VJ.VERBOS = [
  {
    id: 'go',                    // único, en minúsculas
    base: 'go', pasado: 'went', participio: 'gone',
    es: 'ir',                    // significado corto en español
    grupo: 'todo-cambia',        // id de VJ.GRUPOS
    orden: 1,                    // 1 = el primero que se enseña (frecuencia de uso)
    falsosPasado: ['goed', 'gone', 'wented'],      // errores típicos, del más común al menos; mínimo 2
    falsosParticipio: ['went', 'goed', 'goned'],   // mínimo 2
    pista: 'GO es de los rebeldes: went, gone.'    // lo que dice el profesor tras un error; corta, en español
  },
];
```

Reglas de los datos: ningún falso puede ser igual a la forma correcta que se pide; cada falso debe poder justificarse como error real de un aprendiz (forma regular inventada, la otra forma del mismo verbo, analogía con otro verbo). Palabras de máximo 9 letras: van en un letrero.

### `js/reglas.js` (Mecánica)

`VJ.REGLAS = { ... }`: una sola tabla con todos los números que deciden cómo se juega (velocidad, distancia entre letreros, segundos para leer, ventana de peligro, cuántos verbos por partida, cuándo se gana, cómo se repite un verbo fallado). Cada número con un comentario que diga qué hace. Nada de números sueltos en `logica.js`.

### `js/logica.js` (Construcción) — el juego sin pantalla

Simulación pura: no toca el DOM, el canvas ni `localStorage`, y no usa `Math.random` directo (usa un generador con semilla), para que los bots puedan jugar miles de partidas en Node y repetirlas.

```js
const partida = VJ.crearPartida({
  verbos: VJ.VERBOS, grupos: VJ.GRUPOS, reglas: VJ.REGLAS,
  semilla: 1,
  historial: {}        // { [idVerbo]: { vistos, aciertos, fallos } } de partidas anteriores; puede venir vacío
});
partida.mover(-1 | 1);         // cambiar de carril
const eventos = partida.paso(dt);  // avanza dt segundos y devuelve lo que pasó
partida.estado;                // solo lectura, ver abajo
partida.resumen();             // datos para la pantalla final
```

`partida.estado` trae como mínimo:

- `fase`: `'corriendo' | 'ganada' | 'perdida'`
- `tiempo`, `distancia`, `carril` (0, 1, 2), `x` (posición suavizada entre carriles, para dibujar)
- `monstruo`: de 0 (lejos) a 1 (encima); `peligro`: segundos que quedan de la ventana en que otro error es captura
- `verbo`: el verbo en curso (objeto de `VJ.VERBOS`) o `null`; `pide`: `'recoger' | 'pasado' | 'participio'`
- `objetos`: lo que viene por la calle, ordenado del más cercano al más lejano. Cada uno `{ tipo: 'verbo' | 'fila', z, verbo, pide, opciones: [3 palabras, una por carril], correcta: índice 0–2 }`. En `tipo: 'verbo'` no hay opciones.
- `aprendidos` (ids), `fallos` (lista de `{ id, pide, elegida }`), `racha`

Eventos que devuelve `paso`: `{ tipo: 'recogio' | 'acierto' | 'error' | 'aprendido' | 'captura' | 'victoria', verbo, pide, elegida, correcta }`.

`partida.resumen()` devuelve: verbos practicados con sus tres formas, aciertos y fallos por verbo, los que costaron (con lo que el jugador eligió mal) y el `historial` actualizado para guardar.

### `js/juego.js` + `index.html` (Construcción) — lo que se ve

Dibuja `partida.estado`, lee teclado y toque, muestra menú, pista del profesor, pantalla final y guarda el historial. Deja `window.juego = { partida, iniciar(), ... }` para poder inspeccionarlo desde fuera.

### `pruebas/bots.js` (Pruebas)

Se corre con `node pruebas/bots.js`. Carga `verbos.js`, `reglas.js` y `logica.js` y juega sin pantalla. Perfiles mínimos: **azar** (debe perder rápido), **perfecto** (debe ganar siempre), **quieto** (no toca nada: debe perder), **aprendiz** (acierta un porcentaje y cae en los falsos más comunes). También revisa los datos de `verbos.js` contra las reglas de arriba.

---

## Segunda etapa: la revisión con oraciones (acordada en `equipo/debate/5-acuerdo.md`, aprobada por el dueño)

Ahora son 60 verbos en 9 grupos. Cada ~10 verbos (un tramo) hay una revisión: la Ignorancia cierra el paso en un puente y el estudiante completa oraciones, quieto y sin reloj, con los mismos tres letreros.

### `js/oraciones.js` (Enseñanza) — archivo nuevo, se carga después de `verbos.js`

```js
VJ.ORACIONES = [
  {
    id: 'go-pasado-1',            // único
    verbo: 'go',                  // id de VJ.VERBOS
    forma: 'pasado',              // 'pasado' | 'participio': la forma que va en el hueco
    texto: 'Yesterday I ___ to school.',   // exactamente un hueco, escrito ___ (tres guiones bajos)
    senal: 'Yesterday',           // la palabra o palabras del texto que deciden la forma; se resaltan
    es: 'Ayer fui al colegio.',   // traducción natural
    falsos: ['gone', 'goed']      // exactamente 2: primero la otra forma verdadera del verbo si es distinta; como mucho uno termina en -ed
  },
];
```

Reglas: toda oración de pasado lleva una marca de tiempo terminado (yesterday, last night, last week, … ago, in 2020); toda de participio lleva have/has pegado al hueco y ninguna marca de tiempo terminado. Sin did/didn't, sin pasiva, sin preguntas. Vocabulario A1. Máximo 30 caracteres en `texto` (contando el hueco como 3) y 34 en `es`: tienen que leerse grandes en un celular angosto. La oración debe ser verdadera y natural solo con la forma correcta.

### `js/reglas.js` y `DISENO.md` (Mecánica)

Mecánica añade a `DISENO.md` una sección "Segunda etapa" y a `REGLAS` los números nuevos: tramos, revisión, partida más corta, tope a la partida sin final, captura más justa.

### Orden de carga

`verbos.js` → `oraciones.js` → `reglas.js` → `logica.js` → `juego.js`.

---

## Tercera etapa: verbos regulares infiltrados (decisión del coordinador para cerrar el truco del "-ed")

Mientras ninguna respuesta correcta termine en -ed, "nunca escojas la que termina en -ed" sirve de atajo. Solución propuesta por Enseñanza: mezclar unos pocos verbos regulares, donde -ed sí es la respuesta. No cuentan como verbos del recorrido ni cambian los tramos; aparecen de vez en cuando entre los irregulares y en la revisión. Se apagan con `regularesPorPartida: 0` en `js/reglas.js`.

### `js/verbos.js` (Enseñanza) — añade `VJ.REGULARES`

Misma forma que un elemento de `VJ.VERBOS`, sin `orden` y con `grupo: 'regulares'`:

```js
VJ.REGULARES = [
  { id: 'walk', base: 'walk', pasado: 'walked', participio: 'walked', es: 'caminar', grupo: 'regulares',
    falsosPasado: ['walk', 'wolk', 'walken'], falsosParticipio: ['walken', 'walk', 'wolk'],
    pista: 'WALK es regular: solo se le pone -ed.' },
];
VJ.GRUPO_REGULARES = { id: 'regulares', nombre: 'Los que sí llevan -ed', explicacion: '…', ejemplo: 'walk – walked – walked' };
```

Ningún falso de un regular termina en -ed. Sus oraciones van en `VJ.ORACIONES` con el mismo formato (el `verbo` es el id del regular).

---

## Cuarta etapa: Herramienta para todo el semestre, producción real, tramos de 10 y Modo Salón

Acuerdo tomado tras el debate a tres voces (`equipo/debate-semestre/5-acuerdo.md`):

### 1. `js/verbos.js` (Enseñanza) — Significado corto, distractores en español y limpieza
Cada verbo de `VJ.VERBOS` (60) y `VJ.REGULARES` (12) añade dos propiedades obligatorias para la fila de significado en la calle:
```js
{
  // ...propiedades actuales...
  esCorto: 'guardar',               // 1 sola palabra en infinitivo, máx. 10 letras, sin comas ni espacios
  falsosEs: ['dormir', 'sentir'],   // exactamente 2 significados falsos en infinitivo (≤10 letras), sin sinónimos y con longitudes balanceadas
}
```
Además:
- Corregir los nombres y explicaciones de los grupos `'en'` (*"Participio en -N / -EN"*) y `'pasado-n'` (*"Pasado con O y participio en -N"*).
- Eliminar falsos dialectales (`thunk`, `brung`, `brang`, `boughten`) y sustantivos reales (`pat`, `cat`, `hat`), reemplazándolos por errores morfológicos reales de hispanohablantes (`thinked/thoughted`, `bringed/broughted`, `buyed/boughted`, `putted/putten`, `cutted/cutten`, `hitted/hitten`).

### 2. `js/oraciones.js` (Enseñanza) — Tercer molde gramatical (`forma: 'base'` con `didn't` / `Did`)
Cada verbo de `VJ.VERBOS` y `VJ.REGULARES` añade una 3.ª oración con `forma: 'base'` (total: 216 oraciones en `VJ.ORACIONES`):
```js
{
  id: 'go-base-1',
  verbo: 'go',
  forma: 'base',                    // 'pasado' | 'participio' | 'base'
  texto: "I didn't ___ yesterday.", // máx. 30 caracteres; lleva didn't o Did ... ?
  senal: "didn't",                  // palabra señal que exige la forma base
  es: 'Ayer no fui.',               // máx. 34 caracteres
  falsos: ['went', 'gone']          // incluye el pasado como error típico ("I didn't went")
}
```

### 3. `js/reglas.js` y `DISENO.md` (Experiencia y Mecánica) — Nuevos parámetros en `VJ.REGLAS`
- **Tramos cerrados y escalera a Sabido:** `tramoCerrado: true`, `sabidosParaAvanzar: 8`, `cupoMantenimiento: 2`, `rachaParaEspaciar: 2`, `descansos: [0, 1, 3]`, `rachaSabido: 3`, `requiereProduccionParaSabido: true`.
- **Cierre del atajo en la calle:** `filaSignificadoEnIguales: true` (cuando `pasado === participio`, las dos filas nunca tienen la misma respuesta; una pide la forma en inglés y la otra pide `pide: 'significado'` con `esCorto` o `pide: 'base'` con `didn't ___`; cuando hay fila de significado, el libro de ese turno no sopla la traducción arriba).
- **Producción con fichas de letras:** `produccionPorRevision: 2`, `fichasLetrasTotal: 8` (7 letras únicas reutilizables + `⌫`), `intentosProduccion: 2`.
- **Pre/Post y Código del Profesor:** `preguntasPrePost: 5`, `largoCodigoProfe: 6`.
- **Modo Salón (15 min):** `turnosSalon: 4`, `lecturaSalon: 5.5`, `letraMinimaSalon: 0.062`, `oracionesPuenteSalon: 6`, `puntosSalonAcierto: 100`, `puntosSalonError: -50`, `puntosSalonRebote: 100`.

### 4. `js/logica.js` y `js/juego.js` (Construcción) — Motor y pantallas nuevas
- `js/logica.js` mantiene su pureza (sin DOM, sin `localStorage`, sin `Math.random`, todo determinado por semilla) y añade:
  - En las filas de la calle: soporte para `pide: 'significado'` (`esCorto` vs `falsosEs`) y `pide: 'base'` (`didn't ___` → `base` vs `[pasado, falso]`) cuando `pasado === participio`, marcando `ocultarSignificadoLibro: true` en el turno cuando una fila pregunta `significado`.
  - En la revisión del puente (`VJ.crearRevision`): soporte para el 3.er molde (`forma: 'base'`) y para preguntas de **producción con fichas** (`p.modo === 'fichas'`, `p.fichas` con 7 letras únicas barajadas que cubren la respuesta correcta y al menos un falso completo), más `rev.intentarTexto(palabra)` / `rev.tocarFicha(letra)`.
  - Generador de prueba corta Pre/Post (`VJ.crearPrePost(semilla, tramo, tipo, reglas)`) y codificador/decodificador verificable de 6 caracteres (`VJ.codificarReporte(datos)`, `VJ.decodificarReporte(codigo)`).
- `js/juego.js` e `index.html` añaden:
  - Mapa vivo de las 6 Cuadras en la portada + Álbum de verbos.
  - Caja de 8 Fichas de Letras (`4 × 2`, `76 × 54 px` en celular) en el puente y en el Pre/Post + soporte de teclado físico (`A–Z`, `Backspace`, `Enter`) + botón opcional de voz (`🎤`).
  - Termómetro Pre/Post de 5 preguntas (45 s) y **Vista del Profesor** (con lector de códigos de 6 caracteres y botón *"Cargar ejemplo de un salón (25 estudiantes)"* para demostraciones en vivo).
  - **Modo Salón por Equipos (2 o 3 equipos)** con carriles numerados `[1 Azul] [2 Amarillo] [3 Verde]`, pausa con `Espacio`, puente con opciones ocultas y Robo de Punto, y resumen de *"Los 3 verbos del día"*.
  - Correcciones visuales en `1280×720` (colegio grande sin solapamiento en pantalla final, profesor de espaldas expresivo en el puente) y en `360×740` (limpieza de pancarta rota).
