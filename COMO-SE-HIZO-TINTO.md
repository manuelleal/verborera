# Cómo se hizo Tinto

Resumen para explicar el método a alguien que no programa. Tinto es un juego de carreras en 3D para navegador: un gato corre por una calle de tres carriles perseguido por una perra. Lo hizo una sola persona, sin programar, dirigiendo a un asistente de IA que a su vez coordinó a otros agentes. El registro detallado, con cada error, está en el proyecto original (`EQUIPO.md`).

## La idea central

La persona no escribe código. Describe lo que quiere, mira el resultado y corrige. La IA construye, prueba y deja escrito lo que hizo. Lo que hace que funcione no es la IA sola: es el ciclo de **pedir, mirar y corregir**, repetido muchas veces.

## Los pasos, en orden

| # | Qué pasó | Qué enseña |
|---|---|---|
| 1 | Se pidió "hacer el juego" con una carpeta llamada GATO. La IA construyó un tres en raya. | Una instrucción corta se puede entender mal. Se corrigió pegando un documento con la idea completa. |
| 2 | Primera versión del juego en un solo archivo: calle, obstáculos, perseguidor. | Empezar con algo que funcione, aunque sea feo. |
| 3 | El dueño corrigió: el giro en las esquinas no debía ser obligado, y quería que se pareciera a una imagen de referencia. | Las imágenes de referencia ahorran muchas palabras. |
| 4 | Se partió el juego en un núcleo y cuatro módulos, y se escribió un "contrato" entre ellos. | Antes de poner a varios agentes a trabajar a la vez hay que separar el trabajo, o se pisan. |
| 5 | Cuatro agentes constructores en paralelo: Mundos, Gatos, Animación, Niveles. Cada uno con su archivo y su bitácora. | Roles claros, un archivo por agente. |
| 6 | Tres agentes "pensadores" (marketing, publicación, popularidad) que solo investigaron y escribieron. | No todos los agentes construyen; algunos solo piensan. |
| 7 | Se le dio identidad al personaje (nombre, carácter, gesto). | Las decisiones de fondo las toma la persona, no la IA. |
| 8 | La IA descargó Blender (programa de modelado 3D), lo manejó sin abrir la ventana y modeló al gato en tres intentos. | La IA puede aprender a usar una herramienta nueva, pero necesita "ver" el resultado: aquí, renderizando imágenes y mirándolas. |
| 9 | Más agentes de Blender: texturas, la perra, la utilería, y uno que dejó la herramienta configurada y una guía. Otro agente tuvo que seguir esa guía para comprobar si servía. | Una guía solo se prueba cuando otro la usa. |
| 10 | El dueño jugó y trajo observaciones concretas (banderines que tapaban, techo muy bajo, gallinas que hacían daño siendo él un gato). | En minutos, una persona encontró lo que ningún agente había reportado. |
| 11 | El dueño dejó el juego solo tres minutos y no perdió. | El fallo más grave lo encontró jugando mal a propósito. |
| 12 | Un agente midió el juego con cientos de partidas automáticas, dos agentes diseñaron las reglas nuevas y el primero las implementó y volvió a medir. | Medir antes y después con las mismas pruebas demuestra que el arreglo funcionó. |
| 13 | Al revisar a ojo el arreglo, la IA coordinadora encontró que una función "probada" nunca aparecía en el juego. | Un informe puede ser cierto en cada frase y esconder que algo no llega al jugador. |
| 14 | Se publicó en internet con un enlace. | Publicar es un paso aparte, y antes hay que revisar qué información personal va en los archivos. |

## Los agentes y sus roles

| Agente | Qué hizo | Construía o pensaba |
|---|---|---|
| Coordinador (el chat principal) | Repartir el trabajo, juntar las piezas, verificar y llevar el registro | Las dos cosas |
| Mundos | Tres escenarios con sus obstáculos | Construía |
| Gatos | Personajes con habilidades | Construía |
| Animación | Movimiento, cámara, partículas | Construía |
| Niveles | Niveles, tienda, pantallas | Construía |
| Marketing, Publicación, Popularidad | Informes con fuentes | Pensaban |
| Blender, Render, Panela, Figuras | Modelos 3D e imágenes | Construían con una herramienta externa |
| Lógica | Auditoría con mediciones y arreglo de las reglas | Medía y construía |
| Diseñadores (dos) | Especificaciones de cómo debía jugarse | Pensaban |

## Lo que salió mal, que es lo más útil de contar

- **Se entendió mal el primer encargo** y se construyó otro juego.
- **Los agentes no podían ver el juego en movimiento.** Trabajaban midiendo y con imágenes fijas, y eso dejó pasar cosas que una persona vio al instante.
- **Todos probaban jugando bien.** Nadie probó no hacer nada, y el juego se podía dejar quieto.
- **Arreglar una queja rompió otra cosa.** Para que unos banderines no taparan la vista se subieron hasta quedar flotando en el cielo.
- **Una regla tenía sentido para el programa y no para el jugador:** un obstáculo que no se podía saltar se veía como algo bajo y saltable.
- **Añadir cosas agradables empeoró el fondo:** volver comida a las gallinas dio tanta curación que ya no se podía perder.
- **Los agentes se estorbaron entre sí** al compartir el mismo navegador y los mismos datos guardados.
- **Se subieron datos personales sin querer** en la información de autoría de los archivos publicados.

## Las lecciones, en corto

1. Describir con ejemplos e imágenes, no solo con palabras.
2. Separar el trabajo antes de repartirlo.
3. Pedir a cada agente que anote lo que hizo y en qué se equivocó.
4. Medir con las mismas pruebas antes y después de un cambio.
5. Probar jugando mal, no solo jugando bien.
6. Mirar el resultado con ojos propios: los agentes miden, las personas notan.
7. Las decisiones de fondo (para quién es, cómo se llama, qué tono tiene) son de la persona.
