# Prompt para el siguiente chat

Copie todo lo que está debajo de la línea y péguelo en un chat nuevo abierto en la carpeta `VERBOS`.

---

Vas a continuar un proyecto que ya existe: un juego para aprender los verbos irregulares en inglés (base, pasado y participio), hecho por un profesor de inglés que no programa, dirigiendo a un equipo de agentes de IA. Está en esta carpeta y funciona. Tu trabajo no es retocarlo: es convertirlo en una herramienta educativa de verdad, de esas que un profesor usaría todo el semestre y de las que un estudiante sale sabiendo más. No te pongo techo. Rétate y hazlo mejor de lo que yo sabría pedirte.

## Primero, explora a fondo (antes de proponer nada)

1. Lee completos, en este orden: `CONTINUAR.md` (estado, decisiones ya tomadas, lo que falta), `REGISTRO.md` (cómo se hizo, con cada error), `AGENTES.md` (el contrato entre agentes), `LEEME.md`, `GUIA-PARA-PROFES.md`, `pruebas/INFORME.md` y el debate en `equipo/debate/`.
2. Juega el juego. Sírvelo con `python servidor.py 5200` y míralo en capturas en tamaño de celular (360×740) y de computador (1280×720): una carrera completa, un error, el puente de las oraciones con un error, la pantalla final. Juega mal a propósito.
3. Corre `node pruebas/bots.js` y entiende qué mide y qué no.
4. Lee el código (`js/`) lo suficiente para saber dónde está cada cosa.
5. Escribe tu diagnóstico honesto en pocas líneas: qué enseña de verdad este juego hoy, qué no enseña, y qué tan lejos está de algo que mejore el inglés de un estudiante de forma medible. El propio equipo dejó escrito que "comprueba que se reconoce la forma y se sabe el patrón, no que se recuerde sin ayuda". Empieza por ahí.

## Después, apunta alto

Algunas direcciones, para que no te quedes corto. No es una lista para cumplir: tú decides qué vale más.

- **Que se aprenda, no solo que se reconozca.** Que el estudiante recuerde y produzca la forma: escribirla, decirla en voz alta (el navegador puede escuchar), completarla sin opciones. Hoy solo escoge entre tres.
- **Que use lo que se sabe sobre cómo se aprende:** práctica de recuperación, repaso espaciado de verdad (hoy cada verbo vuelve cada 7 u 8 partidas y casi ninguno llega a "sabido"), mezcla de patrones, retroalimentación que explique, dificultad que se ajuste al estudiante.
- **Que el verbo signifique algo:** contexto, oraciones, pequeñas historias, la diferencia real entre "I went" y "I have gone", y por qué importa.
- **Que se pueda demostrar que funciona:** una prueba corta antes y después, y datos que el profesor pueda ver por estudiante y por grupo (qué verbos cuestan, qué error se repite). Sin cuentas ni servidores obligatorios, salvo que justifiques bien lo contrario.
- **Que sirva en un salón real:** un proyector y 30 estudiantes, 15 minutos, celulares modestos, mala conexión. Modo de clase, por equipos, para el profesor.
- **Que den ganas de volver:** progreso visible, metas, recompensas que no tapen el aprendizaje.

Si después de explorar crees que el formato de carrera no es el mejor vehículo para alguna de estas cosas, dilo y propón otra cosa. Puede convivir con la carrera o reemplazar partes de ella.

## Lo que se sabe de quien lo pidió (para no repetir errores)

- **"Simple" no quiere decir "vacío".** Pidió "sin Blender, figuras simples", y la primera versión, sobria y gris, la rechazó: "se ve horrible, me aburrí solo con entrar". Quiere mundo, color y vida, aunque esté dibujado por código. Las palabras tienen que leerse siempre.
- **Prefiere que actúes sin muchas preguntas:** decide con criterio, anota la decisión y sigue. Él prueba y corrige. Pregunta solo lo que de verdad es suyo de decidir.
- **Abre el juego por su cuenta mientras se construye.** No le dejes una versión a medias sin avisar, y avísale cuando pueda probar.
- **Decisiones suyas, que no se cambian sin consultarle:** el verbo BE queda por fuera; persigue el Monstruo de la Ignorancia y el profesor es aliado; la revisión con oraciones se queda.
- **Los verbos regulares infiltrados los añadió el equipo y él no los ha confirmado.** Tenlo presente.
- Es para mostrárselo a otros profesores y explicarles cómo se hizo: **el registro del proceso es parte de la entrega.**

## Cómo trabajar

1. **Desde el primer minuto, sigue llevando `REGISTRO.md`** con el mismo estilo, para alguien que no programa: qué se pidió, qué agente lo hizo y con qué rol, qué decidió, qué salió mal y cómo se notó. Continúa la numeración de pasos.
2. **Trabaja con un equipo de agentes con roles, cada uno dueño de sus archivos** (ver `AGENTES.md`). Amplía el contrato antes de repartir trabajo nuevo. Incluye al menos:
   - alguien que sepa de cómo se aprende una lengua, que piense y entregue datos;
   - alguien que diseñe la experiencia;
   - quien construya;
   - quien pruebe con bots y tramposos.

   Para decisiones grandes, haz debatir a varias voces: primero por separado, después criticándose.
3. **Mide antes y después de cada cambio con las mismas pruebas.** Actualiza `pruebas/bots.js` cuando cambien las reglas; dos de sus pruebas ya quedaron viejas. Prueba jugando mal y buscando atajos: así salieron los dos problemas más serios del proyecto.
4. **Mira tú el resultado en capturas**, en celular y en computador, antes de decir que algo está listo. En este proyecto, dos veces todas las pruebas estaban en verde y lo que se veía estaba mal.
5. **Cada informe dice qué no se pudo comprobar.**
6. **Al final:**
   - actualiza `CONTINUAR.md`, `GUIA-PARA-PROFES.md` y `LEEME.md`;
   - deja el juego abriendo con doble clic en `index.html` (o explica por qué ya no y qué lo reemplaza);
   - rehaz el comprimido `VERBOS-juego.zip` en la carpeta de arriba.
7. **No publiques nada ni subas a GitHub sin que el dueño lo pida.** No escribas en los archivos su nombre, correo ni rutas del computador.

Empieza por la exploración. Después muéstrame tu diagnóstico y tu plan en pocas líneas, y arranca.
