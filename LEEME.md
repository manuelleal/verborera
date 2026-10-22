# Verbos irregulares: el juego, todo en local

Esta carpeta trae todo lo que hace falta: el juego, sus datos, las pruebas con bots y el registro de cómo se hizo. No necesita internet, ni instalar nada, ni cuentas.

**¿Va a seguir mejorándolo?** Empiece por `CONTINUAR.md`: estado, decisiones ya tomadas, lo que falta en orden de importancia y cómo trabajar sin dañar lo que sirve.

## Abrirlo

| Para qué | Cómo |
|---|---|
| Jugar en este computador | Doble clic en `index.html` |
| Jugar desde celulares en la misma red wifi | Doble clic en `ABRIR-JUEGO.bat`. Abre el juego en el navegador y muestra en la ventana negra la dirección que hay que escribir en los celulares. Mientras la ventana esté abierta, el juego está disponible; al cerrarla, se apaga |
| Lo mismo, a mano | En una terminal dentro de esta carpeta: `python servidor.py 5200`, y abrir `http://localhost:5200` |

Para las dos últimas hace falta tener Python instalado. Windows puede preguntar si deja pasar la conexión por la red: hay que aceptar en red privada para que entren los celulares.

### Direcciones útiles para un experimento

Se añaden al final de la dirección del juego (por ejemplo `index.html?modo=revision&tramo=2`):

| Dirección | Qué hace |
|---|---|
| `?modo=revision&tramo=1` | Abre directo la revisión con oraciones del tramo 1 (del 1 al 6) |
| `?modo=grupo&grupo=no-cambian` | Juega un solo grupo de verbos |
| `?semilla=7` | Repite exactamente la misma partida cada vez: útil para que todos jueguen lo mismo |
| `?auto=1` | El juego se juega solo acertando todo (demostración; no guarda progreso). `?auto=0.8` acierta 8 de cada 10 |

Los grupos son: `iguales`, `final-t`, `rebeldes`, `no-cambian`, `en`, `pasado-n`, `ought`, `i-a-u`, `ew-own`.

### El progreso

Cada aparato guarda su propio progreso en el navegador. El botón "Borrar mi progreso" del menú lo deja en cero, útil antes de que otra persona juegue en el mismo aparato. "Copiar resultado", al final de cada partida y de cada revisión, da un texto para pegar donde se quiera.

## Qué hay en la carpeta

| Archivo | Qué es | Quién lo hizo |
|---|---|---|
| `index.html` | La página del juego | Construcción |
| `js/verbos.js` | Los 60 verbos irregulares, sus grupos, sus errores típicos y pistas, y los 12 regulares infiltrados | Enseñanza |
| `js/oraciones.js` | Las 144 oraciones de la revisión | Enseñanza |
| `js/reglas.js` | **La tabla de números**: tiempos, castigos, cuántos verbos por partida | Mecánica (y Construcción, el bloque final) |
| `js/logica.js` | Las reglas del juego, sin pantalla (lo que usan los bots) | Construcción |
| `js/juego.js` | Todo lo que se ve y se oye | Construcción |
| `servidor.py` | Servidor local sencillo para los celulares | Copiado del juego anterior |
| `ABRIR-JUEGO.bat` | Arranca el servidor y abre el juego | Coordinador |
| `CONTINUAR.md` | Para quien siga mejorando el juego | Coordinador |
| `pruebas/bots.js` | Banco de pruebas: miles de partidas con jugadores automáticos | Pruebas |
| `pruebas/INFORME.md` | Resultados de las tres rondas de pruebas | Pruebas |
| `REGISTRO.md` | El paso a paso de cómo se hizo, con agentes, decisiones y errores | Coordinador |
| `GUIA-PARA-PROFES.md` | Cómo usarlo en clase y cómo repetir el método | Coordinador |
| `AGENTES.md` | El contrato entre los agentes | Coordinador |
| `DISENO.md` | El diseño original de las reglas | Mecánica |
| `equipo/` | La bitácora de cada agente, el debate completo y la primera lista de 31 verbos | Cada agente |
| `ARRANQUE.md`, `COMO-SE-HIZO-TINTO.md` | Los documentos con que empezó el proyecto | El dueño |
| `base-tinto/` | Copia del juego anterior (Tinto), solo como referencia; el juego de verbos no la usa | — |

## Cambiar cosas para un experimento

Casi todo lo que se quiera probar se cambia en **`js/reglas.js`**, abriéndolo con el Bloc de notas y cambiando un número. Cada número tiene al lado una línea que explica qué hace. Los más útiles:

| Número | Hoy | Qué cambia |
|---|---|---|
| `lecturaInicial` | 4.5 | Segundos para leer las tres pancartas al empezar. Subirlo hace el juego más fácil |
| `lecturaMinima` | 3.5 | Lo más rápido que llega a ponerse |
| `pausaAprendido`, `fraccionRecoger` | 0.4, 0.4 | El tiempo entre un verbo y el siguiente |
| `comodinInicial` | 1 | Veces que el profesor salva de la captura. En 0 se vuelve "dos errores seguidos y te atrapa" |
| `regularesPorPartida` | 2 | Verbos regulares infiltrados por carrera. En 0 se apagan |
| `ordenAlAzarEnRepaso` | 0.5 | En los repasos, cuántas veces se pide primero el participio. En 0, siempre pasado y luego participio |
| `turnosPorPartida`, `nuevosPorPartida` | 8, 4 | Largo de la carrera y verbos nuevos en cada una |

Para cambiar verbos, errores típicos, pistas u oraciones: `js/verbos.js` y `js/oraciones.js`. Cada uno explica su formato al principio.

**Antes de cambiar, guarde una copia de la carpeta** (o del archivo). Si algo deja de abrir, casi siempre es una coma o una comilla que se borró.

### Comprobar que un cambio no dañó nada

Con [Node.js](https://nodejs.org) instalado, en una terminal dentro de esta carpeta:

```bash
node pruebas/bots.js
```

Tarda un minuto y juega miles de partidas: un jugador que no toca nada (debe perder), uno al azar (no debe ganar), uno que siempre acierta (debe ganar), aprendices que aciertan 7, 8 o 9 de cada 10, y varios tramposos. Al final dice cuántos requisitos se cumplen. Hoy da 50 de 53: los tres que no se cumplen están explicados en `REGISTRO.md` (pasos 18 y 19) y no son fallas nuevas.

## Lo que ya se sabe del juego

- Comprueba que el estudiante reconoce la forma y sabe el patrón, no que la recuerde sin ayuda.
- Nunca se ha probado con un grupo real de estudiantes: un experimento es justo lo que falta.
- Si se quiere medir aprendizaje, la pantalla final de cada partida y de cada revisión trae los verbos que costaron y lo que se eligió mal: es el dato más útil para recoger.
