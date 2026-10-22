# Debate: cómo mejorar la dinámica del juego

## Qué dijo el dueño (profesor de inglés) después de probar la segunda versión

- La primera versión: "me aburrí solo con entrar", "no aprendió ni a palo".
- La segunda (pueblo de día, personajes, pancartas): "se ve mejor".
- Su idea nueva, en sus palabras: "la idea es que aprendan verbos; cada 10 verbos se hace una revisión, como oraciones, o ordenar, o conectar, o no sé qué". Pidió que unos agentes discutan cómo mejorar la dinámica. **Solo pensar: nadie construye nada todavía.**

## Cómo es el juego hoy

Un estudiante corre por una calle de pueblo de tres carriles, perseguido por el Monstruo de la Ignorancia. Ciclo de un verbo: recoge un libro con el verbo base (HAVE) → pasa por la pancarta del pasado correcto entre tres (had / haded / haved) → pasa por la del participio. Un error es un tropiezo; otro error dentro de las dos filas siguientes es captura (el profesor lo salva una vez). Entre verbos hay estrellas para recoger. Una partida son 8 turnos con 4 verbos nuevos y 4 de repaso, y dura de 1:40 a 3 minutos. Hay 31 verbos en 6 grupos por patrón (pasado = participio; rebeldes; no cambian; participio en -n; -ought/-aught; i-a-u). Cada fila se ve unos 4 segundos antes de llegar a ella. Al completar un verbo sale una cinta con las tres formas.

Detalle completo: `DISENO.md`, `js/reglas.js`, `js/verbos.js`, `equipo/ensenanza.md`.

## Lo que hay que resolver

1. **La revisión cada ~10 verbos.** ¿Qué actividad o actividades? (completar oraciones, ordenar palabras, conectar base–pasado–participio, elegir entre pasado y participio según la oración, otra). ¿Cómo se juega con tres carriles, o sale del runner a otra pantalla? ¿Cuánto dura? ¿Qué pasa si se falla? ¿Qué tiene que ver con el monstruo y con el profesor?
2. **El ritmo general.** Hoy una partida trae 4 verbos distintos; "cada 10 verbos" pide otra estructura (¿etapas?, ¿un recorrido por el pueblo hasta el colegio?). ¿Cómo se organizan los 31 verbos en un camino con revisiones?
3. **Que no aburra y que se aprenda.** Hoy el verbo se practica solo como forma suelta: nunca aparece en una oración ni se usa. ¿Qué cambiar en el ciclo básico, si algo, para que haya más que elegir entre tres palabras?

## Condiciones que no cambian

- Para una exposición ante profesores: pequeño y explicable vale más que completo. Unos 31 verbos.
- Estudiantes hispanohablantes principiantes (A1–A2), jóvenes y adultos. Computador y celular (pantalla vertical angosta, un dedo).
- Canvas 2D dibujado por código, sin internet, sin modelos. Las palabras tienen que leerse.
- Lo construye después UN agente programador: cada idea debe poder explicarse con precisión y hacerse en una pasada. Hay que escoger, no apilar.
