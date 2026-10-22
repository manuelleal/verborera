// reglas.js — la única tabla de números que deciden cómo se juega.
// Dueño: agente de Mecánica. El porqué de cada número está en DISENO.md y en equipo/mecanica.md.
// Tiempos en segundos, distancias en metros de calle, carriles 0 (izquierda), 1 (centro), 2 (derecha).

(function (raiz) {
  const VJ = raiz.VJ = raiz.VJ || {};

  VJ.REGLAS = {
    // ───── La partida: cuántos verbos y cuáles ─────
    turnosPorPartida: 8,          // turnos de la cola inicial; un turno = un verbo completo (recoger, pasado, participio)
    nuevosPorPartida: 4,          // verbos nunca vistos que entran por partida en el modo "camino"
    nuevosSiHayPendientes: 2,     // nuevos por partida cuando hay muchos verbos fallados sin arreglar
    umbralPendientes: 3,          // desde cuántos verbos pendientes se baja a nuevosSiHayPendientes
    maxTurnosPorVerbo: 2,         // veces que un mismo verbo puede estar en la cola inicial (segunda vuelta si falta repaso)
    patronCola: 'RRNNRNNR',       // orden de la cola inicial: R = verbo de repaso, N = verbo nuevo
    repasoTras: 2,                // un verbo fallado vuelve después de este número de verbos distintos
    rachaParaEspaciar: 2,         // partidas seguidas sin fallar un verbo para que empiece a descansar (antes 3; baja a 2 en cuarta etapa)
    descansos: [0, 1, 3],         // partidas que descansa un verbo: tras 1.ª limpia 0, tras 2.ª descansa 1, al ser sabido descansa 3
    rachaSabido: 3,               // partidas seguidas sin fallarlo (más 1 producción con fichas) para coronarlo como "sabido"

    // ───── Que se pueda leer ─────
    lecturaInicial: 4.5,          // segundos que se ve una fila de tres letreros antes de llegar a ella, al empezar
    lecturaMinima: 3.5,           // tope: la fila nunca se ve menos de estos segundos
    lecturaBajaPorTurno: 0.1,     // segundos de lectura que se quitan por cada turno limpio (el juego acelera)
    lecturaSubePorError: 0.5,     // segundos de lectura que se devuelven tras un error (el juego afloja)
    fraccionRecoger: 0.4,         // el verbo base (una sola palabra) se ve esta fracción del tiempo de una fila
    distanciaVista: 40,           // metros a los que aparece una fila; velocidad = distanciaVista / lectura (8,9 a 11,4 m/s)
    arranque: 1,                  // segundos de calle vacía al empezar, para ubicarse
    anuncioGrupo: 1.5,              // segundos que dura el cartel con el nombre y el ejemplo de un grupo, antes de su primer verbo
    cambioCarril: 0.15,           // segundos que tarda el estudiante en pasar de un carril al de al lado
    letraMinima: 0.044,           // alto mínimo de la letra de un letrero, como fracción del ancho de la pantalla (16 px en 360)
    letraHud: 0.07,               // alto de la letra del verbo en el marcador de arriba, como fracción del ancho de la pantalla
    anchoCalleLejos: 0.78,        // ancho de la calle donde aparece la fila, como fracción del ancho al pie: perspectiva suave
    maxLetras: 9,                 // letras de la palabra más larga que debe caber en un letrero con letraMinima

    // ───── El castigo por equivocarse ─────
    peligroFilas: 2,              // tras un error, otro error en las próximas tantas filas de letreros es captura
    comodinInicial: 1,            // veces que el profesor salva de una captura al empezar la partida
    comodinMaximo: 1,             // salvadas que se pueden tener guardadas a la vez
    aciertosParaComodin: 6,       // filas acertadas seguidas para que el profesor vuelva a estar listo para salvar
    respiroTrasError: 1.5,        // segundos extra de calle vacía tras un error, para leer la corrección
    pistaSegundos: 4,             // segundos que queda visible la forma correcta y la pista del profesor
    tropiezoSegundos: 0.5,        // duración del tropiezo del estudiante (solo dibujo; no quita control)
    pausaAprendido: 0.4,            // segundos de calle vacía tras un turno limpio, para celebrar

    // ───── El monstruo (0 = lejos, 1 = encima) ─────
    monstruoInicio: 0.45,         // distancia de reposo del monstruo al empezar
    monstruoPorAcierto: 0.03,     // cuánto se aleja su distancia de reposo con cada fila acertada
    monstruoPorAprendido: 0.05,   // cuánto más se aleja al completar un turno limpio
    monstruoPorError: 0.10,       // cuánto se acerca su distancia de reposo con cada error
    monstruoMin: 0.10,            // lo más lejos que puede quedar en reposo
    monstruoMax: 0.60,            // lo más cerca que puede quedar en reposo
    monstruoEnPeligro: 0.85,      // dónde se pone mientras dura la ventana de peligro
    monstruoVelocidad: 0.6,       // cuánto puede moverse por segundo hacia su sitio (para que no salte)
    monstruoTamMax: 1.0,          // tamaño del monstruo al empezar
    monstruoTamMin: 0.5,          // tamaño cuando todos los turnos están cumplidos: se encoge con lo aprendido

    // ───── Cómo se arma una fila ─────
    falsosPorFila: 2,             // opciones falsas por fila (más la correcta: tres letreros)
    bolsaCarriles: [0, 1, 2, 0, 1, 2], // carriles de la respuesta correcta: se barajan y se gastan; cada 6 filas, 2 por carril
    maxMismoCarrilSeguido: 2,     // la respuesta correcta no cae más de estas veces seguidas en el mismo carril

    // ───── Controles ─────
    deslizarMinPx: 24,            // píxeles que debe recorrer el dedo para contar como deslizar y no como toque

    // ───── Segunda etapa (añadido por Construcción con permiso del coordinador) ─────
    verbosPorTramo: 10,           // un tramo = verbos con orden de 10(k−1)+1 a 10k; cada tramo tiene su revisión
    revisionTrasCarrera: 4,       // oraciones de la revisión en el puente al ganar una carrera
    revisionDeTramo: 6,           // oraciones de la gran revisión de un tramo (mitad pasado, mitad participio)
    revisionRepite: 1,            // veces que vuelve al final una oración fallada en la revisión
    revisionMonstruoMin: 0.25,    // tamaño del monstruo del puente si todas las oraciones salen a la primera
    maxReencolar: 2,              // veces que un mismo verbo fallado puede volver a la cola en una partida
    turnosMaximos: 12,            // tope de turnos de una partida: al llegar, termina (ganada si no hubo captura)
    repasoMinVerbos: 4,           // "Lo que me cuesta" se rellena con verbos ya vistos hasta tener estos verbos distintos

    // ───── Tercera etapa: verbos regulares infiltrados (añadido por Construcción a pedido del coordinador) ─────
    regularesPorPartida: 2,       // turnos extra de verbos regulares mezclados en cada carrera; 0 los apaga del todo
    revisionRegulares: 1,         // oraciones de un verbo regular en cada revisión del puente (si hay)
    ordenAlAzarEnRepaso: 0.5,     // en verbos ya vistos y en regulares: probabilidad de pedir primero el participio y luego el pasado (0 lo apaga)

    // ───── Cuarta etapa: tramos cerrados, producción con fichas, cierre del atajo, Pre/Post y Modo Salón ─────
    tramoCerrado: true,           // el modo camino trabaja sobre el tramo activo de 10 verbos en vez de mezclar los 60 desde el inicio
    sabidosParaAvanzar: 8,        // verbos sabidos (de los 10 del tramo) necesarios para abrir el siguiente tramo en el mapa
    cupoMantenimiento: 2,         // turnos por carrera reservados para repasar verbos de tramos anteriores ya superados
    requiereProduccionParaSabido: true, // exige haber armado el verbo con fichas al menos una vez para coronarlo como "sabido"

    filaSignificadoEnIguales: true, // cuando pasado y participio son iguales, la 2.ª fila pide significado en español o contraste con didn't
    ordenAlRevesEnRepaso: 0.4,    // en verbos ya vistos, probabilidad de dar el pasado/participio y pedir la base o el significado

    produccionPorRevision: 2,     // oraciones de cada revisión en el puente que se resuelven armando el verbo con fichas de letras
    fichasLetrasTotal: 8,         // botones en la caja de fichas (cuadrícula 4x2: 7 letras únicas reutilizables + 1 botón de borrar)
    intentosProduccion: 2,        // intentos con fichas en el puente; tras fallar el 1.º, el 2.º muestra el esqueleto con la 1.ª letra

    preguntasPrePost: 5,          // preguntas de la prueba corta (45 s, sin pistas) antes de empezar un tramo y al completarlo
    largoCodigoProfe: 6,          // caracteres del código verificable (ej. 125BDK) que resume tramo, Pre, Post y 2 verbos fallados

    turnosSalon: 4,               // verbos por relevo de equipo en la calle dentro del Modo Salón (15 minutos en proyector)
    lecturaSalon: 5.5,            // segundos de vista por fila en Modo Salón para que el equipo vote el carril 1, 2 o 3
    letraMinimaSalon: 0.062,      // tamaño mínimo de letra en los letreros del Modo Salón (38 % más grande para leer a 8 metros)
    oracionesPuenteSalon: 6,      // oraciones totales del duelo final en el puente por equipos en Modo Salón
    puntosSalonAcierto: 100,      // puntos que gana un equipo por cada fila acertada en la calle en Modo Salón
    puntosSalonError: -50,        // puntos que pierde un equipo al tropezar en la calle en Modo Salón (no hay captura ni muerte súbita)
    puntosSalonRebote: 100,       // puntos que gana el siguiente equipo si acierta el rebote de una oración fallada en el puente
    segundosTapadoSalon: 4        // segundos que la oración del puente en Modo Salón muestra el hueco sin opciones para pensar en equipo
  };
})(typeof window !== 'undefined' ? window : globalThis);
