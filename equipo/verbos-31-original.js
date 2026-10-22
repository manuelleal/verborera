// verbos.js — datos de enseñanza del juego de verbos irregulares.
// Dueño: agente de Enseñanza de inglés. Explicación en equipo/ensenanza.md
//
// Cómo leer cada verbo:
//   orden            → 1 es el primero que se enseña. Los del mismo grupo van seguidos.
//   falsosPasado     → respuestas equivocadas para la fila del pasado, del error más común al menos común.
//   falsosParticipio → lo mismo para la fila del participio.
//   pista            → lo que dice el profesor después de un error.
//
// Tipos de error que se usan como falsos (todos son errores reales de aprendices):
//   regular inventada (goed) · la otra forma del mismo verbo (gone por went) ·
//   doble marca (wented, tooked) · patrón de otro grupo (brang, tolden, putten) ·
//   ortografía (writen, tought, cuted) · verbo vecino (bought/brought, thought/taught, lived/left).

(function (raiz) {
  const VJ = raiz.VJ = raiz.VJ || {};

  VJ.GRUPOS = [
    {
      id: 'iguales',
      nombre: 'Pasado y participio iguales',
      explicacion: 'Solo hay que aprender una forma nueva: sirve para el pasado y para el participio.',
      ejemplo: 'make – made – made'
    },
    {
      id: 'rebeldes',
      nombre: 'Los rebeldes',
      explicacion: 'Cada uno cambia a su manera; son tan usados que se aprenden de tanto verlos.',
      ejemplo: 'go – went – gone'
    },
    {
      id: 'no-cambian',
      nombre: 'Los que no cambian',
      explicacion: 'Las tres formas son iguales. Son cortos y terminan en T.',
      ejemplo: 'cut – cut – cut'
    },
    {
      id: 'en',
      nombre: 'Participio terminado en N',
      explicacion: 'El pasado cambia la vocal y el participio termina en -n o -en.',
      ejemplo: 'take – took – taken'
    },
    {
      id: 'ought',
      nombre: 'Los de -ought / -aught',
      explicacion: 'Pasado y participio iguales, terminados en -ought o -aught (suena "ot").',
      ejemplo: 'buy – bought – bought'
    },
    {
      id: 'i-a-u',
      nombre: 'Vocal i – a – u',
      explicacion: 'Solo cambia la vocal: i en la base, a en el pasado, u en el participio.',
      ejemplo: 'sing – sang – sung'
    }
  ];

  VJ.VERBOS = [
    // ───── Grupo 1: pasado y participio iguales (lo más frecuente y lo más fácil) ─────
    {
      id: 'have', base: 'have', pasado: 'had', participio: 'had',
      es: 'tener', grupo: 'iguales', orden: 1,
      falsosPasado: ['haved', 'haded', 'has'],
      falsosParticipio: ['haved', 'haded', 'haven'],
      pista: 'HAVE pierde la V: had, y had otra vez.'
    },
    {
      id: 'make', base: 'make', pasado: 'made', participio: 'made',
      es: 'hacer', grupo: 'iguales', orden: 2,
      falsosPasado: ['maked', 'maded', 'makeed'],
      falsosParticipio: ['maked', 'maden', 'maded'],
      pista: 'MAKE cambia la K por D: made, made.'
    },
    {
      id: 'say', base: 'say', pasado: 'said', participio: 'said',
      es: 'decir', grupo: 'iguales', orden: 3,
      falsosPasado: ['sayed', 'sayd', 'saided'],
      falsosParticipio: ['sayed', 'saided', 'sayd'],
      pista: 'SAY se escribe said (suena "sed"), las dos veces.'
    },
    {
      // Ojo: en inglés americano también se acepta "gotten" como participio.
      // Aquí se enseña "got" y "gotten" NO aparece nunca entre los falsos.
      id: 'get', base: 'get', pasado: 'got', participio: 'got',
      es: 'conseguir', grupo: 'iguales', orden: 4,
      falsosPasado: ['getted', 'geted', 'gotted'],
      falsosParticipio: ['getted', 'gotted', 'geted'],
      pista: 'GET cambia la E por O: got, got.'
    },
    {
      id: 'tell', base: 'tell', pasado: 'told', participio: 'told',
      es: 'contar', grupo: 'iguales', orden: 5,
      falsosPasado: ['telled', 'tolded', 'teld'],
      falsosParticipio: ['telled', 'tolden', 'tolded'],
      pista: 'TELL: told, told. Hermano de sell: sold, sold.'
    },
    {
      id: 'find', base: 'find', pasado: 'found', participio: 'found',
      es: 'encontrar', grupo: 'iguales', orden: 6,
      falsosPasado: ['finded', 'founded', 'fand'],
      falsosParticipio: ['finded', 'founded', 'founden'],
      pista: 'FIND: found, found. "Founded" es fundar, otro verbo.'
    },
    {
      id: 'leave', base: 'leave', pasado: 'left', participio: 'left',
      es: 'irse, dejar', grupo: 'iguales', orden: 7,
      falsosPasado: ['leaved', 'lefted', 'lived'],
      falsosParticipio: ['leaved', 'lefted', 'leaven'],
      pista: 'LEAVE (irse): left, left. Lived es de live (vivir).'
    },

    // ───── Grupo 2: los rebeldes (los más usados de todos) ─────
    {
      id: 'go', base: 'go', pasado: 'went', participio: 'gone',
      es: 'ir', grupo: 'rebeldes', orden: 8,
      falsosPasado: ['goed', 'gone', 'wented'],
      falsosParticipio: ['went', 'goed', 'goned'],
      pista: 'GO es de los rebeldes: went, gone.'
    },
    {
      id: 'do', base: 'do', pasado: 'did', participio: 'done',
      es: 'hacer', grupo: 'rebeldes', orden: 9,
      falsosPasado: ['doed', 'done', 'dided'],
      falsosParticipio: ['did', 'doed', 'doned'],
      pista: 'DO: did, done. Se parece a go: gone, done.'
    },
    {
      id: 'come', base: 'come', pasado: 'came', participio: 'come',
      es: 'venir', grupo: 'rebeldes', orden: 10,
      falsosPasado: ['comed', 'come', 'camed'],
      falsosParticipio: ['came', 'comed', 'comen'],
      pista: 'COME: came, y el participio vuelve a come.'
    },
    {
      id: 'run', base: 'run', pasado: 'ran', participio: 'run',
      es: 'correr', grupo: 'rebeldes', orden: 11,
      falsosPasado: ['runned', 'run', 'raned'],
      falsosParticipio: ['ran', 'runned', 'ranned'],
      pista: 'RUN: ran, y vuelve a run. Igual que come.'
    },

    // ───── Grupo 3: los que no cambian ─────
    {
      id: 'put', base: 'put', pasado: 'put', participio: 'put',
      es: 'poner', grupo: 'no-cambian', orden: 12,
      falsosPasado: ['putted', 'puted', 'putten'],
      falsosParticipio: ['putted', 'putten', 'puted'],
      pista: 'PUT no cambia nunca: put, put, put.'
    },
    {
      id: 'let', base: 'let', pasado: 'let', participio: 'let',
      es: 'permitir', grupo: 'no-cambian', orden: 13,
      falsosPasado: ['letted', 'leted', 'letten'],
      falsosParticipio: ['letted', 'letten', 'leted'],
      pista: 'LET es como put: no cambia. Let, let, let.'
    },
    {
      id: 'cut', base: 'cut', pasado: 'cut', participio: 'cut',
      es: 'cortar', grupo: 'no-cambian', orden: 14,
      falsosPasado: ['cutted', 'cuted', 'cutten'],
      falsosParticipio: ['cutted', 'cutten', 'cuted'],
      pista: 'CUT no cambia. "Cutted" no existe.'
    },
    {
      id: 'hit', base: 'hit', pasado: 'hit', participio: 'hit',
      es: 'golpear', grupo: 'no-cambian', orden: 15,
      falsosPasado: ['hitted', 'hited', 'hitten'],
      falsosParticipio: ['hitted', 'hitten', 'hited'],
      pista: 'HIT: corto y termina en T, no cambia. Hit, hit, hit.'
    },

    // ───── Grupo 4: participio terminado en N ─────
    {
      id: 'take', base: 'take', pasado: 'took', participio: 'taken',
      es: 'tomar', grupo: 'en', orden: 16,
      falsosPasado: ['taked', 'taken', 'tooked'],
      falsosParticipio: ['took', 'taked', 'tooken'],
      pista: 'TAKE: took en pasado; taken = take + n.'
    },
    {
      id: 'give', base: 'give', pasado: 'gave', participio: 'given',
      es: 'dar', grupo: 'en', orden: 17,
      falsosPasado: ['gived', 'given', 'gaved'],
      falsosParticipio: ['gave', 'gived', 'gaven'],
      pista: 'GIVE: gave en pasado; given = give + n.'
    },
    {
      id: 'see', base: 'see', pasado: 'saw', participio: 'seen',
      es: 'ver', grupo: 'en', orden: 18,
      falsosPasado: ['seed', 'seen', 'sawed'],
      falsosParticipio: ['saw', 'seed', 'sawed'],
      pista: 'SEE: saw en pasado; seen = see + n.'
    },
    {
      id: 'know', base: 'know', pasado: 'knew', participio: 'known',
      es: 'saber', grupo: 'en', orden: 19,
      falsosPasado: ['knowed', 'known', 'knewed'],
      falsosParticipio: ['knew', 'knowed', 'knewn'],
      pista: 'KNOW: knew en pasado; known = know + n.'
    },
    {
      id: 'eat', base: 'eat', pasado: 'ate', participio: 'eaten',
      es: 'comer', grupo: 'en', orden: 20,
      falsosPasado: ['eated', 'eaten', 'ated'],
      falsosParticipio: ['ate', 'eated', 'aten'],
      pista: 'EAT: ate en pasado; eaten = eat + en.'
    },
    {
      id: 'write', base: 'write', pasado: 'wrote', participio: 'written',
      es: 'escribir', grupo: 'en', orden: 21,
      falsosPasado: ['writed', 'written', 'wroted'],
      falsosParticipio: ['wrote', 'writen', 'writed'],
      pista: 'WRITE: wrote; y written lleva doble T.'
    },
    {
      id: 'speak', base: 'speak', pasado: 'spoke', participio: 'spoken',
      es: 'hablar', grupo: 'en', orden: 22,
      falsosPasado: ['speaked', 'spoken', 'spoked'],
      falsosParticipio: ['spoke', 'speaked', 'speaken'],
      pista: 'SPEAK: spoke; spoken = spoke + n.'
    },
    {
      id: 'break', base: 'break', pasado: 'broke', participio: 'broken',
      es: 'romper', grupo: 'en', orden: 23,
      falsosPasado: ['breaked', 'broken', 'broked'],
      falsosParticipio: ['broke', 'breaked', 'breaken'],
      pista: 'BREAK va con speak: broke, broken / spoke, spoken.'
    },

    // ───── Grupo 5: los de -ought / -aught ─────
    {
      id: 'think', base: 'think', pasado: 'thought', participio: 'thought',
      es: 'pensar', grupo: 'ought', orden: 24,
      falsosPasado: ['thinked', 'tought', 'thank'],
      falsosParticipio: ['thinked', 'tought', 'thunk'],
      pista: 'THINK: thought. Empieza con TH y termina en GHT.'
    },
    {
      id: 'buy', base: 'buy', pasado: 'bought', participio: 'bought',
      es: 'comprar', grupo: 'ought', orden: 25,
      falsosPasado: ['buyed', 'brought', 'boughted'],
      falsosParticipio: ['buyed', 'brought', 'boughten'],
      pista: 'BUY: bought, sin R. Brought (con R) es de bring.'
    },
    {
      id: 'bring', base: 'bring', pasado: 'brought', participio: 'brought',
      es: 'traer', grupo: 'ought', orden: 26,
      falsosPasado: ['bringed', 'brang', 'bought'],
      falsosParticipio: ['bringed', 'brung', 'bought'],
      pista: 'BRING tiene R y la conserva: brought, brought.'
    },
    {
      id: 'teach', base: 'teach', pasado: 'taught', participio: 'taught',
      es: 'enseñar', grupo: 'ought', orden: 27,
      falsosPasado: ['teached', 'thought', 'tought'],
      falsosParticipio: ['teached', 'thought', 'taughted'],
      pista: 'TEACH tiene A y la conserva: taught, taught.'
    },

    // ───── Grupo 6: vocal i – a – u ─────
    {
      id: 'drink', base: 'drink', pasado: 'drank', participio: 'drunk',
      es: 'beber', grupo: 'i-a-u', orden: 28,
      falsosPasado: ['drinked', 'drunk', 'dranked'],
      falsosParticipio: ['drank', 'drinked', 'drunken'],
      pista: 'DRINK: i – a – u. Drink, drank, drunk.'
    },
    {
      id: 'sing', base: 'sing', pasado: 'sang', participio: 'sung',
      es: 'cantar', grupo: 'i-a-u', orden: 29,
      falsosPasado: ['singed', 'sung', 'sanged'],
      falsosParticipio: ['sang', 'singed', 'sunged'],
      pista: 'SING: i – a – u, como drink. Sing, sang, sung.'
    },
    {
      id: 'swim', base: 'swim', pasado: 'swam', participio: 'swum',
      es: 'nadar', grupo: 'i-a-u', orden: 30,
      falsosPasado: ['swimmed', 'swum', 'swimed'],
      falsosParticipio: ['swam', 'swimmed', 'swimed'],
      pista: 'SWIM: i – a – u. Swim, swam, swum.'
    },
    {
      id: 'begin', base: 'begin', pasado: 'began', participio: 'begun',
      es: 'empezar', grupo: 'i-a-u', orden: 31,
      falsosPasado: ['begined', 'begun', 'beginned'],
      falsosParticipio: ['began', 'beginned', 'begined'],
      pista: 'BEGIN: i – a – u al final. Begin, began, begun.'
    }
  ];

  // ───── Recomendaciones de repaso ─────
  // Son el criterio pedagógico, no los números finales: esos los decide Mecánica en reglas.js.
  // Cada dato trae su "porque" para poder explicarlo en la exposición.
  VJ.ESTRATEGIA = {
    nuevosPorPartida: {
      valor: 4,
      porque: 'Tres o cuatro verbos nuevos es lo que se alcanza a retener en una sentada corta; con más, se olvidan los primeros.'
    },
    repasoPorPartida: {
      valor: 4,
      porque: 'Media partida es repaso: lo ya visto se mezcla con lo nuevo para que no se pierda. En la primera partida no hay repaso.'
    },
    nuevosSiHayMuchosFallados: {
      valor: 2,
      umbralFallados: 3,
      porque: 'Si vienen 3 o más verbos fallados de antes, primero se arregla eso: se baja a 2 nuevos y el resto es repaso.'
    },
    nuevosDelMismoGrupo: {
      valor: true,
      porque: 'Los nuevos de una partida se toman en el orden de la lista, que ya los trae por grupo: así el patrón se nota solo.'
    },
    anunciarGrupo: {
      valor: true,
      porque: 'Cuando empieza un grupo conviene decir su nombre y su ejemplo una vez; el patrón nombrado se recuerda mejor.'
    },
    falladoVuelveTrasVerbos: {
      minimo: 2,
      maximo: 3,
      porque: 'El fallado vuelve en la misma partida después de 2 o 3 verbos distintos: pronto, pero no enseguida, para que toque recordarlo y no solo repetirlo.'
    },
    falladoAbreLaSiguientePartida: {
      valor: true,
      porque: 'Lo fallado hoy es lo primero del repaso de la próxima partida.'
    },
    alRepetirUsarElFalsoElegido: {
      valor: true,
      porque: 'Cuando vuelve un verbo fallado, entre las opciones debe estar el mismo error que el estudiante escogió: ese es el que hay que desmontar.'
    },
    aciertosSeguidosParaEspaciar: {
      valor: 3,
      porque: 'Un acierto cuenta cuando se aciertan pasado y participio del mismo verbo. Con 3 seguidos el verbo deja de salir en cada partida.'
    },
    espaciadoEnPartidas: {
      valor: [1, 2, 4],
      porque: 'Una vez espaciado, descansa 1 partida, luego 2, luego 4. Cada vez que se acierta, el descanso se alarga.'
    },
    unFalloReiniciaLaCuenta: {
      valor: true,
      porque: 'Si se falla un verbo espaciado, vuelve a salir en todas las partidas hasta juntar otra vez los aciertos seguidos.'
    },
    aciertosParaDarloPorSabido: {
      valor: 5,
      porque: 'Con 5 aciertos seguidos en partidas distintas se puede mostrar como "sabido" en la pantalla final; antes de eso puede ser suerte: con tres carriles, uno de cada tres se acierta al azar.'
    },
    falsosPreferidos: {
      valor: 2,
      porque: 'Los falsos van del error más común al menos común. Para un verbo nuevo conviene mostrar los dos primeros; el tercero sirve para variar en los repasos.'
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
