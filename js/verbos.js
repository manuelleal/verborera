// verbos.js — datos de enseñanza del juego de verbos irregulares (lista ampliada: 60 verbos).
// Dueño: agente de Enseñanza de inglés. Explicación en equipo/ensenanza.md
//
// Cómo leer cada verbo:
//   orden            → 1 es el primero que se enseña. Los del mismo grupo van seguidos.
//   esCorto          → significado en 1 sola palabra en infinitivo (máx. 10 letras) para letreros de calle.
//   falsosEs         → 2 significados falsos en infinitivo (máx. 10 letras), sin sinónimos y con largo balanceado.
//   falsosPasado     → respuestas equivocadas para la fila del pasado. LOS DOS PRIMEROS son la pareja
//                      pensada para mostrarse junto a la correcta; el tercero es para variar en los repasos.
//   falsosParticipio → lo mismo para la fila del participio.
//   pista            → lo que dice el profesor después de un error.
//
// Regla contra el truco "nunca la que termina en -ed": entre los falsos de cada lista
// hay como mucho uno terminado en -ed, y en casi la mitad de las filas no hay ninguno. Además la
// correcta no es siempre la más corta ni la más larga. Si se cambia el orden de una lista, hay que
// volver a medirlo (ver equipo/ensenanza.md, "El truco del -ed").
//
// Tipos de error que se usan como falsos (todos son errores reales de aprendices):
//   regular inventada (goed) · la otra forma del mismo verbo (gone por went) ·
//   la base sin cambiar (yesterday I keep) · doble marca (wented, tooked) ·
//   patrón de otro grupo (tolden, putten, cot) · ortografía (writen, tought, bilt, ment) ·
//   verbo vecino (bought/brought, fell/felt, left/let, raised/rose, loss/lost).
//
// Tramos de 10 (para la revisión): 1–10 · 11–20 · 21–30 · 31–40 · 41–50 · 51–60.
// Cada corte cae al final de un grupo; ver la tabla en equipo/ensenanza.md.

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
      id: 'final-t',
      nombre: 'Los que terminan en T',
      explicacion: 'Pasado y participio iguales y terminados en T: la vocal se acorta (keep, kept) o la D pasa a T (send, sent).',
      ejemplo: 'keep – kept – kept'
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
      explicacion: 'Las tres formas se escriben igual. Son cortos y terminan en T o en D.',
      ejemplo: 'cut – cut – cut'
    },
    {
      id: 'en',
      nombre: 'Participio en -N / -EN',
      explicacion: 'El pasado cambia la vocal y el participio termina en -n o -en (written y ridden doblan la letra).',
      ejemplo: 'take – took – taken'
    },
    {
      id: 'pasado-n',
      nombre: 'Pasado con O y participio en -N',
      explicacion: 'El pasado lleva O y el participio termina en -n o -en (worn pierde la E; forgotten dobla la T).',
      ejemplo: 'speak – spoke – spoken'
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
    },
    {
      id: 'ew-own',
      nombre: 'Los de -ew y -own',
      explicacion: 'El pasado termina en -ew y el participio en -own o -awn. Son primos de know.',
      ejemplo: 'grow – grew – grown'
    }
  ];

  VJ.VERBOS = [
    // ═════ TRAMO 1 (1–10) ═════
    // ───── Grupo: pasado y participio iguales (lo más frecuente y lo más fácil) ─────
    {
      id: 'have', base: 'have', pasado: 'had', participio: 'had',
      es: 'tener', esCorto: 'tener', falsosEs: ['vender', 'oír'],
      grupo: 'iguales', orden: 1,
      falsosPasado: ['has', 'have', 'haved'],
      falsosParticipio: ['haved', 'has', 'haven'],
      pista: 'HAVE pierde la V: had, y had otra vez.'
    },
    {
      id: 'make', base: 'make', pasado: 'made', participio: 'made',
      es: 'hacer', esCorto: 'hacer', falsosEs: ['pagar', 'oír'],
      grupo: 'iguales', orden: 2,
      falsosPasado: ['maked', 'make', 'maden'],
      falsosParticipio: ['maden', 'make', 'maked'],
      pista: 'MAKE cambia la K por D: made, made.'
    },
    {
      id: 'say', base: 'say', pasado: 'said', participio: 'said',
      es: 'decir', esCorto: 'decir', falsosEs: ['tener', 'encontrar'],
      grupo: 'iguales', orden: 3,
      falsosPasado: ['sayed', 'sayd', 'saiden'],
      falsosParticipio: ['sayd', 'say', 'sayed'],
      pista: 'SAY se escribe said (suena "sed"), las dos veces.'
    },
    {
      // Ojo: en inglés americano también se acepta "gotten" como participio.
      // Aquí se enseña "got" y "gotten" NO aparece nunca entre los falsos.
      id: 'get', base: 'get', pasado: 'got', participio: 'got',
      es: 'conseguir', esCorto: 'conseguir', falsosEs: ['pagar', 'vender'],
      grupo: 'iguales', orden: 4,
      falsosPasado: ['getted', 'get', 'getten'],
      falsosParticipio: ['getten', 'get', 'getted'],
      pista: 'GET cambia la E por O: got, got.'
    },
    {
      id: 'tell', base: 'tell', pasado: 'told', participio: 'told',
      es: 'contar', esCorto: 'contar', falsosEs: ['oír', 'conseguir'],
      grupo: 'iguales', orden: 5,
      falsosPasado: ['telled', 'teld', 'tolden'],
      falsosParticipio: ['tolden', 'teld', 'telled'],
      pista: 'TELL: told, told. Hermano de sell: sold, sold.'
    },
    {
      id: 'sell', base: 'sell', pasado: 'sold', participio: 'sold',
      es: 'vender', esCorto: 'vender', falsosEs: ['pararse', 'encontrar'],
      grupo: 'iguales', orden: 6,
      falsosPasado: ['seld', 'sell', 'selled'],
      falsosParticipio: ['selled', 'seld', 'solden'],
      pista: 'SELL es hermano de tell: sold, sold.'
    },
    {
      id: 'find', base: 'find', pasado: 'found', participio: 'found',
      es: 'encontrar', esCorto: 'encontrar', falsosEs: ['decir', 'tener'],
      grupo: 'iguales', orden: 7,
      falsosPasado: ['finded', 'fand', 'founden'],
      falsosParticipio: ['founded', 'founden', 'fand'],
      pista: 'FIND: found, found. "Founded" es fundar, otro verbo.'
    },
    {
      id: 'hear', base: 'hear', pasado: 'heard', participio: 'heard',
      es: 'oír', esCorto: 'oír', falsosEs: ['pagar', 'vender'],
      grupo: 'iguales', orden: 8,
      falsosPasado: ['heared', 'herd', 'hearden'],
      falsosParticipio: ['heared', 'hearden', 'herd'],
      pista: 'HEAR solo suma una D: heard, heard.'
    },
    {
      id: 'pay', base: 'pay', pasado: 'paid', participio: 'paid',
      es: 'pagar', esCorto: 'pagar', falsosEs: ['oír', 'pararse'],
      grupo: 'iguales', orden: 9,
      falsosPasado: ['payed', 'payd', 'pay'],
      falsosParticipio: ['payd', 'pay', 'payed'],
      pista: 'PAY: paid, con I, igual que say: said.'
    },
    {
      id: 'stand', base: 'stand', pasado: 'stood', participio: 'stood',
      es: 'estar de pie', esCorto: 'pararse', falsosEs: ['tener', 'encontrar'],
      grupo: 'iguales', orden: 10,
      falsosPasado: ['standed', 'stod', 'stooden'],
      falsosParticipio: ['stooden', 'stod', 'standed'],
      pista: 'STAND: stood, stood. Con doble O.'
    },

    // ═════ TRAMO 2 (11–20) ═════
    // ───── Grupo: los que terminan en T — primero la vocal que se acorta ─────
    {
      id: 'leave', base: 'leave', pasado: 'left', participio: 'left',
      es: 'irse, dejar', esCorto: 'irse', falsosEs: ['dormir', 'guardar'],
      grupo: 'final-t', orden: 11,
      falsosPasado: ['leaved', 'felt', 'leaft'],
      falsosParticipio: ['felt', 'leaven', 'leaved'],
      pista: 'LEAVE (irse): left, left. Felt es de feel (sentir).'
    },
    {
      id: 'feel', base: 'feel', pasado: 'felt', participio: 'felt',
      es: 'sentir', esCorto: 'sentir', falsosEs: ['irse', 'construir'],
      grupo: 'final-t', orden: 12,
      falsosPasado: ['fell', 'feeled', 'feelt'],
      falsosParticipio: ['left', 'fell', 'feeled'],
      pista: 'FEEL: felt, felt. Fell es de fall; left, de leave.'
    },
    {
      id: 'keep', base: 'keep', pasado: 'kept', participio: 'kept',
      es: 'guardar', esCorto: 'guardar', falsosEs: ['dormir', 'sentir'],
      grupo: 'final-t', orden: 13,
      falsosPasado: ['keeped', 'keep', 'keept'],
      falsosParticipio: ['keep', 'kepten', 'keeped'],
      pista: 'KEEP: una E menos y una T. Kept, kept.'
    },
    {
      id: 'sleep', base: 'sleep', pasado: 'slept', participio: 'slept',
      es: 'dormir', esCorto: 'dormir', falsosEs: ['perder', 'gastar'],
      grupo: 'final-t', orden: 14,
      falsosPasado: ['sleept', 'sleep', 'sleeped'],
      falsosParticipio: ['sleeped', 'sleep', 'slepten'],
      pista: 'SLEEP es como keep: slept, slept.'
    },
    {
      id: 'meet', base: 'meet', pasado: 'met', participio: 'met',
      es: 'conocer', esCorto: 'conocer', falsosEs: ['irse', 'significar'],
      grupo: 'final-t', orden: 15,
      falsosPasado: ['meeted', 'meet', 'mett'],
      falsosParticipio: ['mett', 'meten', 'meeted'],
      pista: 'MEET solo pierde una E: met, met.'
    },
    {
      id: 'mean', base: 'mean', pasado: 'meant', participio: 'meant',
      es: 'significar', esCorto: 'significar', falsosEs: ['sentir', 'enviar'],
      grupo: 'final-t', orden: 16,
      falsosPasado: ['meaned', 'ment', 'mean'],
      falsosParticipio: ['ment', 'mean', 'meaned'],
      pista: 'MEAN solo suma una T: meant (suena "ment").'
    },
    {
      id: 'lose', base: 'lose', pasado: 'lost', participio: 'lost',
      es: 'perder', esCorto: 'perder', falsosEs: ['guardar', 'construir'],
      grupo: 'final-t', orden: 17,
      falsosPasado: ['losed', 'loss', 'loose'],
      falsosParticipio: ['loss', 'losen', 'losed'],
      pista: 'LOSE (perder): lost, lost. Con una sola O.'
    },
    // ───── mismo grupo — ahora los que cambian la D por T ─────
    {
      id: 'send', base: 'send', pasado: 'sent', participio: 'sent',
      es: 'enviar', esCorto: 'enviar', falsosEs: ['dormir', 'conocer'],
      grupo: 'final-t', orden: 18,
      falsosPasado: ['send', 'sendt', 'sended'],
      falsosParticipio: ['send', 'senten', 'sended'],
      pista: 'SEND cambia la D por T: sent, sent.'
    },
    {
      id: 'spend', base: 'spend', pasado: 'spent', participio: 'spent',
      es: 'gastar', esCorto: 'gastar', falsosEs: ['irse', 'guardar'],
      grupo: 'final-t', orden: 19,
      falsosPasado: ['spended', 'spend', 'spendt'],
      falsosParticipio: ['spenten', 'spend', 'spended'],
      pista: 'SPEND es como send: la D pasa a T. Spent, spent.'
    },
    {
      id: 'build', base: 'build', pasado: 'built', participio: 'built',
      es: 'construir', esCorto: 'construir', falsosEs: ['perder', 'significar'],
      grupo: 'final-t', orden: 20,
      falsosPasado: ['builded', 'bilt', 'builten'],
      falsosParticipio: ['bilt', 'builten', 'builded'],
      pista: 'BUILD cambia la D por T: built, con U muda.'
    },

    // ═════ TRAMO 3 (21–30) ═════
    // ───── Grupo: los rebeldes (los más usados de todos) ─────
    {
      id: 'go', base: 'go', pasado: 'went', participio: 'gone',
      es: 'ir', esCorto: 'ir', falsosEs: ['leer', 'correr'],
      grupo: 'rebeldes', orden: 21,
      falsosPasado: ['goed', 'gone', 'wenten'],
      falsosParticipio: ['went', 'goed', 'wenten'],
      pista: 'GO es de los rebeldes: went, gone.'
    },
    {
      id: 'do', base: 'do', pasado: 'did', participio: 'done',
      es: 'hacer', esCorto: 'hacer', falsosEs: ['ir', 'correr'],
      grupo: 'rebeldes', orden: 22,
      falsosPasado: ['done', 'do', 'doed'],
      falsosParticipio: ['did', 'doed', 'doen'],
      pista: 'DO: did, done. Se parece a go: gone, done.'
    },
    {
      id: 'come', base: 'come', pasado: 'came', participio: 'come',
      es: 'venir', esCorto: 'venir', falsosEs: ['poner', 'cortar'],
      grupo: 'rebeldes', orden: 23,
      falsosPasado: ['come', 'comed', 'comen'],
      falsosParticipio: ['came', 'comen', 'comed'],
      pista: 'COME: came, y el participio vuelve a come.'
    },
    {
      id: 'become', base: 'become', pasado: 'became', participio: 'become',
      es: 'llegar a ser', esCorto: 'volverse', falsosEs: ['venir', 'correr'],
      grupo: 'rebeldes', orden: 24,
      falsosPasado: ['become', 'becomed', 'becomen'],
      falsosParticipio: ['became', 'becomen', 'becomed'],
      pista: 'BECOME es come con BE delante: became, become.'
    },
    {
      id: 'run', base: 'run', pasado: 'ran', participio: 'run',
      es: 'correr', esCorto: 'correr', falsosEs: ['leer', 'permitir'],
      grupo: 'rebeldes', orden: 25,
      falsosPasado: ['run', 'runned', 'runnen'],
      falsosParticipio: ['ran', 'runnen', 'runned'],
      pista: 'RUN: ran, y vuelve a run. Igual que come.'
    },

    // ───── Grupo: los que no cambian ─────
    {
      id: 'put', base: 'put', pasado: 'put', participio: 'put',
      es: 'poner', esCorto: 'poner', falsosEs: ['ir', 'golpear'],
      grupo: 'no-cambian', orden: 26,
      falsosPasado: ['putted', 'pote', 'putten'],
      falsosParticipio: ['putten', 'pote', 'putted'],
      pista: 'PUT no cambia nunca: put, put, put.'
    },
    {
      id: 'let', base: 'let', pasado: 'let', participio: 'let',
      es: 'permitir', esCorto: 'permitir', falsosEs: ['leer', 'cortar'],
      grupo: 'no-cambian', orden: 27,
      falsosPasado: ['left', 'lot', 'letted'],
      falsosParticipio: ['letten', 'lot', 'left'],
      pista: 'LET no cambia: let, let, let. Left es de leave.'
    },
    {
      id: 'cut', base: 'cut', pasado: 'cut', participio: 'cut',
      es: 'cortar', esCorto: 'cortar', falsosEs: ['poner', 'permitir'],
      grupo: 'no-cambian', orden: 28,
      falsosPasado: ['cutted', 'cot', 'cutten'],
      falsosParticipio: ['cutten', 'cot', 'cutted'],
      pista: 'CUT no cambia. "Cutted" no existe.'
    },
    {
      id: 'hit', base: 'hit', pasado: 'hit', participio: 'hit',
      es: 'golpear', esCorto: 'golpear', falsosEs: ['leer', 'correr'],
      grupo: 'no-cambian', orden: 29,
      falsosPasado: ['het', 'hitted', 'hitten'],
      falsosParticipio: ['hitten', 'het', 'hitted'],
      pista: 'HIT: corto y termina en T, no cambia. Hit, hit, hit.'
    },
    {
      // Se escribe igual en las tres formas, pero en pasado y participio se pronuncia "red".
      // El juego es de letreros (escritura); la pista se encarga de la pronunciación.
      id: 'read', base: 'read', pasado: 'read', participio: 'read',
      es: 'leer', esCorto: 'leer', falsosEs: ['venir', 'golpear'],
      grupo: 'no-cambian', orden: 30,
      falsosPasado: ['red', 'readen', 'readed'],
      falsosParticipio: ['readen', 'red', 'readed'],
      pista: 'READ se escribe igual; suena "red", pero no se escribe así.'
    },

    // ═════ TRAMO 4 (31–40) ═════
    // ───── Grupo: participio en -N / -EN ─────
    {
      id: 'take', base: 'take', pasado: 'took', participio: 'taken',
      es: 'tomar', esCorto: 'tomar', falsosEs: ['dar', 'escribir'],
      grupo: 'en', orden: 31,
      falsosPasado: ['taked', 'taken', 'tooken'],
      falsosParticipio: ['took', 'taked', 'tooken'],
      pista: 'TAKE: took en pasado; taken = take + n.'
    },
    {
      id: 'give', base: 'give', pasado: 'gave', participio: 'given',
      es: 'dar', esCorto: 'dar', falsosEs: ['caer', 'manejar'],
      grupo: 'en', orden: 32,
      falsosPasado: ['given', 'give', 'gived'],
      falsosParticipio: ['gaven', 'gived', 'gave'],
      pista: 'GIVE: gave en pasado; given = give + n.'
    },
    {
      id: 'see', base: 'see', pasado: 'saw', participio: 'seen',
      es: 'ver', esCorto: 'ver', falsosEs: ['comer', 'saber'],
      grupo: 'en', orden: 33,
      falsosPasado: ['seen', 'sawn', 'sawed'],
      falsosParticipio: ['saw', 'sawn', 'sawed'],
      pista: 'SEE: saw en pasado; seen = see + n.'
    },
    {
      id: 'know', base: 'know', pasado: 'knew', participio: 'known',
      es: 'saber', esCorto: 'saber', falsosEs: ['ver', 'escribir'],
      grupo: 'en', orden: 34,
      falsosPasado: ['knowed', 'know', 'known'],
      falsosParticipio: ['knew', 'knowed', 'knewn'],
      pista: 'KNOW: knew en pasado; known = know + n.'
    },
    {
      id: 'eat', base: 'eat', pasado: 'ate', participio: 'eaten',
      es: 'comer', esCorto: 'comer', falsosEs: ['dar', 'manejar'],
      grupo: 'en', orden: 35,
      falsosPasado: ['eaten', 'eat', 'eated'],
      falsosParticipio: ['ate', 'eated', 'aten'],
      pista: 'EAT: ate en pasado; eaten = eat + en.'
    },
    {
      id: 'fall', base: 'fall', pasado: 'fell', participio: 'fallen',
      es: 'caer', esCorto: 'caer', falsosEs: ['subir', 'montar'],
      grupo: 'en', orden: 36,
      falsosPasado: ['felt', 'fallen', 'falled'],
      falsosParticipio: ['fell', 'fellen', 'falled'],
      pista: 'FALL: fell en pasado; fallen = fall + en.'
    },
    {
      id: 'write', base: 'write', pasado: 'wrote', participio: 'written',
      es: 'escribir', esCorto: 'escribir', falsosEs: ['saber', 'manejar'],
      grupo: 'en', orden: 37,
      falsosPasado: ['writed', 'written', 'wroten'],
      falsosParticipio: ['writen', 'wrote', 'writed'],
      pista: 'WRITE: wrote; y written lleva doble T.'
    },
    {
      id: 'drive', base: 'drive', pasado: 'drove', participio: 'driven',
      es: 'manejar', esCorto: 'manejar', falsosEs: ['caer', 'escribir'],
      grupo: 'en', orden: 38,
      falsosPasado: ['drived', 'drive', 'driven'],
      falsosParticipio: ['droven', 'drove', 'drived'],
      pista: 'DRIVE es como write: drove; driven = drive + n.'
    },
    {
      id: 'ride', base: 'ride', pasado: 'rode', participio: 'ridden',
      es: 'montar', esCorto: 'montar', falsosEs: ['comer', 'manejar'],
      grupo: 'en', orden: 39,
      falsosPasado: ['ridden', 'rided', 'roden'],
      falsosParticipio: ['rode', 'roden', 'rided'],
      pista: 'RIDE: rode; ridden lleva doble D, como written.'
    },
    {
      id: 'rise', base: 'rise', pasado: 'rose', participio: 'risen',
      es: 'subir', esCorto: 'subir', falsosEs: ['caer', 'montar'],
      grupo: 'en', orden: 40,
      falsosPasado: ['risen', 'rise', 'rised'],
      falsosParticipio: ['rosen', 'rised', 'rose'],
      pista: 'RISE (subir): rose, risen. Raised es de raise.'
    },

    // ═════ TRAMO 5 (41–50) ═════
    // ───── Grupo: pasado con O y participio en -N ─────
    {
      id: 'speak', base: 'speak', pasado: 'spoke', participio: 'spoken',
      es: 'hablar', esCorto: 'hablar', falsosEs: ['romper', 'escoger'],
      grupo: 'pasado-n', orden: 41,
      falsosPasado: ['speak', 'spoken', 'speaked'],
      falsosParticipio: ['spoke', 'speak', 'speaken'],
      pista: 'SPEAK: spoke; spoken = spoke + n.'
    },
    {
      id: 'break', base: 'break', pasado: 'broke', participio: 'broken',
      es: 'romper', esCorto: 'romper', falsosEs: ['vestir', 'olvidar'],
      grupo: 'pasado-n', orden: 42,
      falsosPasado: ['break', 'brake', 'broken'],
      falsosParticipio: ['break', 'broke', 'breaked'],
      pista: 'BREAK va con speak: broke, broken / spoke, spoken.'
    },
    {
      id: 'choose', base: 'choose', pasado: 'chose', participio: 'chosen',
      es: 'escoger', esCorto: 'escoger', falsosEs: ['traer', 'pensar'],
      grupo: 'pasado-n', orden: 43,
      falsosPasado: ['choose', 'chosed', 'choosen'],
      falsosParticipio: ['chose', 'choose', 'choosen'],
      pista: 'CHOOSE: chose pierde una O; chosen = chose + n.'
    },
    {
      // Ojo: "forgot" como participio se oye en inglés americano informal.
      // Aquí se enseña "forgotten" y "forgot" NO aparece entre los falsos del participio.
      id: 'forget', base: 'forget', pasado: 'forgot', participio: 'forgotten',
      es: 'olvidar', esCorto: 'olvidar', falsosEs: ['hablar', 'comprar'],
      grupo: 'pasado-n', orden: 44,
      falsosPasado: ['forget', 'forgotten', 'forgetted'],
      falsosParticipio: ['forget', 'forgoten', 'forgetten'],
      pista: 'FORGET: forgot; forgotten lleva doble T.'
    },
    {
      id: 'wear', base: 'wear', pasado: 'wore', participio: 'worn',
      es: 'llevar puesto', esCorto: 'vestir', falsosEs: ['traer', 'enseñar'],
      grupo: 'pasado-n', orden: 45,
      falsosPasado: ['wear', 'worn', 'wored'],
      falsosParticipio: ['wore', 'wear', 'woren'],
      pista: 'WEAR: wore; worn es wore sin la E y con N.'
    },

    // ───── Grupo: los de -ought / -aught ─────
    {
      id: 'think', base: 'think', pasado: 'thought', participio: 'thought',
      es: 'pensar', esCorto: 'pensar', falsosEs: ['traer', 'comprar'],
      grupo: 'ought', orden: 46,
      falsosPasado: ['thinked', 'thougth', 'tought'],
      falsosParticipio: ['tought', 'thinken', 'thoughted'],
      pista: 'THINK: thought. Empieza con TH y termina en GHT.'
    },
    {
      id: 'buy', base: 'buy', pasado: 'bought', participio: 'bought',
      es: 'comprar', esCorto: 'comprar', falsosEs: ['traer', 'pensar'],
      grupo: 'ought', orden: 47,
      falsosPasado: ['brought', 'buyed', 'bougth'],
      falsosParticipio: ['brought', 'bougth', 'boughted'],
      pista: 'BUY: bought, sin R. Brought (con R) es de bring.'
    },
    {
      id: 'bring', base: 'bring', pasado: 'brought', participio: 'brought',
      es: 'traer', esCorto: 'traer', falsosEs: ['vestir', 'comprar'],
      grupo: 'ought', orden: 48,
      falsosPasado: ['bringed', 'bought', 'brougth'],
      falsosParticipio: ['bought', 'brougth', 'broughted'],
      pista: 'BRING tiene R y la conserva: brought, brought.'
    },
    {
      id: 'teach', base: 'teach', pasado: 'taught', participio: 'taught',
      es: 'enseñar', esCorto: 'enseñar', falsosEs: ['pensar', 'olvidar'],
      grupo: 'ought', orden: 49,
      falsosPasado: ['teached', 'tought', 'thought'],
      falsosParticipio: ['tought', 'thought', 'teached'],
      pista: 'TEACH tiene A y la conserva: taught, taught.'
    },
    {
      id: 'catch', base: 'catch', pasado: 'caught', participio: 'caught',
      es: 'atrapar', esCorto: 'atrapar', falsosEs: ['traer', 'romper'],
      grupo: 'ought', orden: 50,
      falsosPasado: ['catched', 'cought', 'caughten'],
      falsosParticipio: ['cought', 'caughten', 'catched'],
      pista: 'CATCH va con teach, los dos con A: caught, caught.'
    },

    // ═════ TRAMO 6 (51–60) ═════
    // ───── Grupo: vocal i – a – u ─────
    {
      id: 'drink', base: 'drink', pasado: 'drank', participio: 'drunk',
      es: 'beber', esCorto: 'beber', falsosEs: ['nadar', 'cantar'],
      grupo: 'i-a-u', orden: 51,
      falsosPasado: ['drunk', 'drinked', 'drink'],
      falsosParticipio: ['drinked', 'drink', 'drunked'],
      pista: 'DRINK: i – a – u. Drink, drank, drunk.'
    },
    {
      id: 'sing', base: 'sing', pasado: 'sang', participio: 'sung',
      es: 'cantar', esCorto: 'cantar', falsosEs: ['beber', 'empezar'],
      grupo: 'i-a-u', orden: 52,
      falsosPasado: ['song', 'singed', 'singen'],
      falsosParticipio: ['sang', 'song', 'singed'],
      pista: 'SING: sang, sung. Song es la canción, no el verbo.'
    },
    {
      id: 'swim', base: 'swim', pasado: 'swam', participio: 'swum',
      es: 'nadar', esCorto: 'nadar', falsosEs: ['volar', 'dibujar'],
      grupo: 'i-a-u', orden: 53,
      falsosPasado: ['swum', 'swimmed', 'swimen'],
      falsosParticipio: ['swam', 'swimmen', 'swimmed'],
      pista: 'SWIM: i – a – u. Swim, swam, swum.'
    },
    {
      id: 'begin', base: 'begin', pasado: 'began', participio: 'begun',
      es: 'empezar', esCorto: 'empezar', falsosEs: ['sonar', 'cantar'],
      grupo: 'i-a-u', orden: 54,
      falsosPasado: ['begun', 'begin', 'begined'],
      falsosParticipio: ['began', 'beginen', 'begined'],
      pista: 'BEGIN: i – a – u al final. Begin, began, begun.'
    },
    {
      id: 'ring', base: 'ring', pasado: 'rang', participio: 'rung',
      es: 'sonar', esCorto: 'sonar', falsosEs: ['nadar', 'crecer'],
      grupo: 'i-a-u', orden: 55,
      falsosPasado: ['ringed', 'ring', 'rung'],
      falsosParticipio: ['rang', 'ring', 'ringed'],
      pista: 'RING: i – a – u, como sing. Ring, rang, rung.'
    },

    // ───── Grupo: los de -ew y -own ─────
    {
      id: 'grow', base: 'grow', pasado: 'grew', participio: 'grown',
      es: 'crecer', esCorto: 'crecer', falsosEs: ['volar', 'dibujar'],
      grupo: 'ew-own', orden: 56,
      falsosPasado: ['grown', 'growed', 'growen'],
      falsosParticipio: ['grew', 'growed', 'growen'],
      pista: 'GROW es primo de know: grew, grown.'
    },
    {
      id: 'throw', base: 'throw', pasado: 'threw', participio: 'thrown',
      es: 'lanzar', esCorto: 'lanzar', falsosEs: ['soplar', 'dibujar'],
      grupo: 'ew-own', orden: 57,
      falsosPasado: ['through', 'thrown', 'throwed'],
      falsosParticipio: ['threw', 'throwen', 'throwed'],
      pista: 'THROW: threw, thrown. Through es "a través", no verbo.'
    },
    {
      id: 'fly', base: 'fly', pasado: 'flew', participio: 'flown',
      es: 'volar', esCorto: 'volar', falsosEs: ['crecer', 'soplar'],
      grupo: 'ew-own', orden: 58,
      falsosPasado: ['flown', 'fly', 'flied'],
      falsosParticipio: ['flowed', 'flewn', 'flew'],
      pista: 'FLY termina como grow: flew, flown.'
    },
    {
      id: 'draw', base: 'draw', pasado: 'drew', participio: 'drawn',
      es: 'dibujar', esCorto: 'dibujar', falsosEs: ['volar', 'lanzar'],
      grupo: 'ew-own', orden: 59,
      falsosPasado: ['drawn', 'draw', 'drawed'],
      falsosParticipio: ['drew', 'drawed', 'drawen'],
      pista: 'DRAW: drew en pasado; drawn = draw + n.'
    },
    {
      id: 'blow', base: 'blow', pasado: 'blew', participio: 'blown',
      es: 'soplar', esCorto: 'soplar', falsosEs: ['beber', 'dibujar'],
      grupo: 'ew-own', orden: 60,
      falsosPasado: ['blowed', 'blown', 'blowen'],
      falsosParticipio: ['blew', 'blowen', 'blowed'],
      pista: 'BLOW es como grow: blew, blown.'
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
    revisionCadaVerbos: {
      valor: 10,
      porque: 'La lista está armada en tramos de 10 que terminan donde termina un grupo. Revisar al cerrar cada tramo es revisar patrones completos, no verbos sueltos.'
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
      valor: 2,
      porque: 'Con un tramo activo de 10 verbos, tras 2 carreras limpias seguidas el verbo descansa 1 carrera antes de su prueba final con fichas.'
    },
    espaciadoEnPartidas: {
      valor: [0, 1, 3],
      porque: 'Tras la 1.ª carrera vuelve enseguida (0); tras la 2.ª descansa 1 carrera; al llegar a sabido descansa 3 carreras.'
    },
    unFalloReiniciaLaCuenta: {
      valor: true,
      porque: 'Si se falla un verbo espaciado, vuelve a salir en todas las partidas hasta juntar otra vez los aciertos seguidos.'
    },
    aciertosParaDarloPorSabido: {
      valor: 3,
      porque: 'Con 3 carreras limpias y al menos 1 producción sin opciones (con fichas de letras en el puente) se corona como sabido.'
    },
    falsosPreferidos: {
      valor: 2,
      porque: 'Los dos primeros falsos de cada lista están escogidos como pareja: errores reales que no delatan la respuesta por terminar en -ed ni por el largo de la palabra. Conviene mostrar esos dos; el tercero sirve para variar en los repasos, sabiendo que con él la fila puede quedar más fácil de adivinar.'
    }
  };

  // ───── Verbos regulares infiltrados ─────
  // No son parte del recorrido de 60: salen de vez en cuando entre los irregulares y en la revisión.
  // Están para que "nunca la que termina en -ed" deje de ser un atajo: aquí la de -ed SÍ es la respuesta.
  // Sus falsos imitan a los irregulares del juego y NINGUNO termina en -ed:
  //   la base sin cambiar (como cut) · -en (como taken) · cambio de vocal (como fell, gave) ·
  //   -t (como kept) · -aid (como paid) · -aught (como caught).
  VJ.GRUPO_REGULARES = {
    id: 'regulares',
    nombre: 'Los que sí llevan -ed',
    explicacion: 'La mayoría de los verbos son así: el pasado y el participio se forman con -ed.',
    ejemplo: 'walk – walked – walked'
  };

  VJ.REGULARES = [
    {
      id: 'walk', base: 'walk', pasado: 'walked', participio: 'walked',
      es: 'caminar', esCorto: 'caminar', falsosEs: ['jugar', 'trabajar'],
      grupo: 'regulares',
      falsosPasado: ['wolk', 'walk', 'walken'],
      falsosParticipio: ['walken', 'wolk', 'walk'],
      pista: 'WALK es regular: solo se le pone -ed.'
    },
    {
      id: 'work', base: 'work', pasado: 'worked', participio: 'worked',
      es: 'trabajar', esCorto: 'trabajar', falsosEs: ['vivir', 'caminar'],
      grupo: 'regulares',
      falsosPasado: ['work', 'workt', 'worken'],
      falsosParticipio: ['worken', 'workt', 'work'],
      pista: 'WORK es regular: worked, worked.'
    },
    {
      id: 'play', base: 'play', pasado: 'played', participio: 'played',
      es: 'jugar', esCorto: 'jugar', falsosEs: ['abrir', 'llamar'],
      grupo: 'regulares',
      falsosPasado: ['plaid', 'play', 'playen'],
      falsosParticipio: ['playen', 'plaid', 'play'],
      pista: 'PLAY es regular: played. No es como say o pay.'
    },
    {
      id: 'want', base: 'want', pasado: 'wanted', participio: 'wanted',
      es: 'querer', esCorto: 'querer', falsosEs: ['jugar', 'empezar'],
      grupo: 'regulares',
      falsosPasado: ['went', 'want', 'wanten'],
      falsosParticipio: ['wanten', 'went', 'want'],
      pista: 'WANT es regular: wanted. Went es de go.'
    },
    {
      id: 'look', base: 'look', pasado: 'looked', participio: 'looked',
      es: 'mirar', esCorto: 'mirar', falsosEs: ['abrir', 'ayudar'],
      grupo: 'regulares',
      falsosPasado: ['lookt', 'look', 'looken'],
      falsosParticipio: ['looken', 'lookt', 'look'],
      pista: 'LOOK es regular: looked, looked.'
    },
    {
      id: 'live', base: 'live', pasado: 'lived', participio: 'lived',
      es: 'vivir', esCorto: 'vivir', falsosEs: ['llamar', 'caminar'],
      grupo: 'regulares',
      falsosPasado: ['lave', 'live', 'liven'],
      falsosParticipio: ['liven', 'lave', 'live'],
      pista: 'LIVE ya termina en E: solo suma una D. Lived.'
    },
    {
      id: 'talk', base: 'talk', pasado: 'talked', participio: 'talked',
      es: 'hablar', esCorto: 'hablar', falsosEs: ['vivir', 'trabajar'],
      grupo: 'regulares',
      falsosPasado: ['tolk', 'talken', 'talk'],
      falsosParticipio: ['talken', 'talk', 'tolk'],
      pista: 'TALK es regular, igual que walk: talked.'
    },
    {
      id: 'call', base: 'call', pasado: 'called', participio: 'called',
      es: 'llamar', esCorto: 'llamar', falsosEs: ['jugar', 'empezar'],
      grupo: 'regulares',
      falsosPasado: ['cell', 'call', 'callen'],
      falsosParticipio: ['callen', 'cell', 'call'],
      pista: 'CALL es regular: called. No es como fall.'
    },
    {
      id: 'help', base: 'help', pasado: 'helped', participio: 'helped',
      es: 'ayudar', esCorto: 'ayudar', falsosEs: ['abrir', 'caminar'],
      grupo: 'regulares',
      falsosPasado: ['helpt', 'help', 'helpen'],
      falsosParticipio: ['helpen', 'helpt', 'help'],
      pista: 'HELP es regular: helped, helped.'
    },
    {
      id: 'start', base: 'start', pasado: 'started', participio: 'started',
      es: 'empezar', esCorto: 'empezar', falsosEs: ['vivir', 'ayudar'],
      grupo: 'regulares',
      falsosPasado: ['start', 'stort', 'starten'],
      falsosParticipio: ['starten', 'start', 'stort'],
      pista: 'START es regular: started, started.'
    },
    {
      id: 'open', base: 'open', pasado: 'opened', participio: 'opened',
      es: 'abrir', esCorto: 'abrir', falsosEs: ['querer', 'llamar'],
      grupo: 'regulares',
      falsosPasado: ['open', 'opent', 'openen'],
      falsosParticipio: ['openen', 'open', 'opent'],
      pista: 'OPEN es regular: opened, opened.'
    },
    {
      id: 'watch', base: 'watch', pasado: 'watched', participio: 'watched',
      es: 'ver, mirar', esCorto: 'mirar', falsosEs: ['jugar', 'caminar'],
      grupo: 'regulares',
      falsosPasado: ['waught', 'watch', 'watchen'],
      falsosParticipio: ['watchen', 'waught', 'watch'],
      pista: 'WATCH es regular: watched. No es como catch.'
    }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
