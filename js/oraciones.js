// oraciones.js — oraciones para la revisión de cada tramo de 10 verbos.
// Dueño: agente de Enseñanza de inglés. Explicación en equipo/ensenanza.md ("Oraciones de la revisión").
//
// Tres oraciones por verbo: pasado, participio y base con auxiliar (didn't / Did).
//   Pasado     → la oración trae una marca de tiempo terminado (yesterday, last night, ... ago, in 2020).
//   Participio → have / has pegado al hueco y ninguna marca de tiempo terminado.
//   Base       → negativa o pregunta en pasado con didn't o Did ... ? (pide la forma base; el primer falso
//                es el pasado del verbo para desmontar "I didn't went" y "Did you bought?").
//   senal      → la palabra del texto que decide la forma.
//   falsos     → exactamente 2. Como mucho uno termina en -ed, y ningún falso deja la oración correcta.
// Al final van las oraciones de los verbos regulares infiltrados (VJ.REGULARES en verbos.js).

(function (raiz) {
  const VJ = raiz.VJ = raiz.VJ || {};

  VJ.ORACIONES = [
    // ═════ TRAMO 1 (verbos 1–10) ═════
    { id: 'have-pasado-1', verbo: 'have', forma: 'pasado', texto: 'Yesterday I ___ a bad day.', senal: 'Yesterday', es: 'Ayer tuve un mal día.', falsos: ['has', 'haven'] },
    { id: 'have-participio-1', verbo: 'have', forma: 'participio', texto: 'She has ___ two coffees.', senal: 'has', es: 'Ella se ha tomado dos cafés.', falsos: ['haven', 'haved'] },
    { id: 'have-base-1', verbo: 'have', forma: 'base', texto: "I didn't ___ time yesterday.", senal: "didn't", es: 'Ayer no tuve tiempo.', falsos: ['had', 'has'] },

    { id: 'make-pasado-1', verbo: 'make', forma: 'pasado', texto: 'My mom ___ arepas yesterday.', senal: 'yesterday', es: 'Mi mamá hizo arepas ayer.', falsos: ['make', 'maden'] },
    { id: 'make-participio-1', verbo: 'make', forma: 'participio', texto: 'I have ___ a mistake.', senal: 'have', es: 'He cometido un error.', falsos: ['maden', 'maked'] },
    { id: 'make-base-1', verbo: 'make', forma: 'base', texto: "She didn't ___ coffee today.", senal: "didn't", es: 'Ella no hizo café hoy.', falsos: ['made', 'mak'] },

    { id: 'say-pasado-1', verbo: 'say', forma: 'pasado', texto: 'He ___ hello last night.', senal: 'last night', es: 'Él dijo hola anoche.', falsos: ['sayd', 'says'] },
    { id: 'say-participio-1', verbo: 'say', forma: 'participio', texto: 'They have ___ no.', senal: 'have', es: 'Ellos han dicho que no.', falsos: ['sayd', 'sayed'] },
    { id: 'say-base-1', verbo: 'say', forma: 'base', texto: "He didn't ___ anything.", senal: "didn't", es: 'Él no dijo nada.', falsos: ['said', 'sad'] },

    { id: 'get-pasado-1', verbo: 'get', forma: 'pasado', texto: 'I ___ a gift yesterday.', senal: 'yesterday', es: 'Ayer recibí un regalo.', falsos: ['gets', 'getted'] },
    { id: 'get-participio-1', verbo: 'get', forma: 'participio', texto: 'She has ___ home late.', senal: 'has', es: 'Ella ha llegado tarde a casa.', falsos: ['gets', 'getten'] },
    { id: 'get-base-1', verbo: 'get', forma: 'base', texto: "I didn't ___ your message.", senal: "didn't", es: 'No recibí tu mensaje.', falsos: ['got', 'gat'] },

    { id: 'tell-pasado-1', verbo: 'tell', forma: 'pasado', texto: 'He ___ me a story last night.', senal: 'last night', es: 'Él me contó un cuento anoche.', falsos: ['teld', 'tolden'] },
    { id: 'tell-participio-1', verbo: 'tell', forma: 'participio', texto: 'I have ___ you the truth.', senal: 'have', es: 'Te he dicho la verdad.', falsos: ['teld', 'telled'] },
    { id: 'tell-base-1', verbo: 'tell', forma: 'base', texto: "Why didn't you ___ me?", senal: "didn't", es: '¿Por qué no me contaste?', falsos: ['told', 'tol'] },

    { id: 'sell-pasado-1', verbo: 'sell', forma: 'pasado', texto: 'We ___ the car in 2020.', senal: 'in 2020', es: 'Vendimos el carro en 2020.', falsos: ['seld', 'selled'] },
    { id: 'sell-participio-1', verbo: 'sell', forma: 'participio', texto: 'She has ___ her old bike.', senal: 'has', es: 'Ella ha vendido su bici vieja.', falsos: ['seld', 'solden'] },
    { id: 'sell-base-1', verbo: 'sell', forma: 'base', texto: "They didn't ___ the house.", senal: "didn't", es: 'No vendieron la casa.', falsos: ['sold', 'sol'] },

    { id: 'find-pasado-1', verbo: 'find', forma: 'pasado', texto: 'I ___ my keys two days ago.', senal: 'two days ago', es: 'Encontré mis llaves hace dos días.', falsos: ['fand', 'finded'] },
    { id: 'find-participio-1', verbo: 'find', forma: 'participio', texto: 'We have ___ a good hotel.', senal: 'have', es: 'Hemos encontrado un buen hotel.', falsos: ['founden', 'fund'] },
    { id: 'find-base-1', verbo: 'find', forma: 'base', texto: 'Did you ___ your keys?', senal: 'Did', es: '¿Encontraste tus llaves?', falsos: ['found', 'fan'] },

    { id: 'hear-pasado-1', verbo: 'hear', forma: 'pasado', texto: 'I ___ a noise last night.', senal: 'last night', es: 'Anoche oí un ruido.', falsos: ['herd', 'hearden'] },
    { id: 'hear-participio-1', verbo: 'hear', forma: 'participio', texto: 'She has ___ the news.', senal: 'has', es: 'Ella ha oído la noticia.', falsos: ['herd', 'heared'] },
    { id: 'hear-base-1', verbo: 'hear', forma: 'base', texto: "I didn't ___ the alarm.", senal: "didn't", es: 'No oí la alarma.', falsos: ['heard', 'her'] },

    { id: 'pay-pasado-1', verbo: 'pay', forma: 'pasado', texto: 'My dad ___ the bill yesterday.', senal: 'yesterday', es: 'Mi papá pagó la cuenta ayer.', falsos: ['payd', 'pays'] },
    { id: 'pay-participio-1', verbo: 'pay', forma: 'participio', texto: 'I have ___ the rent.', senal: 'have', es: 'He pagado el arriendo.', falsos: ['payd', 'payed'] },
    { id: 'pay-base-1', verbo: 'pay', forma: 'base', texto: "He didn't ___ yesterday.", senal: "didn't", es: 'Él no pagó ayer.', falsos: ['paid', 'pad'] },

    { id: 'stand-pasado-1', verbo: 'stand', forma: 'pasado', texto: 'We ___ all day yesterday.', senal: 'yesterday', es: 'Ayer pasamos el día de pie.', falsos: ['stod', 'standed'] },
    { id: 'stand-participio-1', verbo: 'stand', forma: 'participio', texto: 'I have ___ here for an hour.', senal: 'have', es: 'Llevo una hora aquí de pie.', falsos: ['stooden', 'stod'] },
    { id: 'stand-base-1', verbo: 'stand', forma: 'base', texto: "We didn't ___ in line.", senal: "didn't", es: 'No hicimos fila de pie.', falsos: ['stood', 'stod'] },

    // ═════ TRAMO 2 (verbos 11–20) ═════
    { id: 'leave-pasado-1', verbo: 'leave', forma: 'pasado', texto: 'She ___ home an hour ago.', senal: 'an hour ago', es: 'Ella salió de casa hace una hora.', falsos: ['leaft', 'leaved'] },
    { id: 'leave-participio-1', verbo: 'leave', forma: 'participio', texto: 'They have ___ the party.', senal: 'have', es: 'Ellos se han ido de la fiesta.', falsos: ['leaft', 'leaven'] },
    { id: 'leave-base-1', verbo: 'leave', forma: 'base', texto: "She didn't ___ early.", senal: "didn't", es: 'Ella no se fue temprano.', falsos: ['left', 'lef'] },

    { id: 'feel-pasado-1', verbo: 'feel', forma: 'pasado', texto: 'I ___ sick last night.', senal: 'last night', es: 'Anoche me sentí enfermo.', falsos: ['feelt', 'feeled'] },
    { id: 'feel-participio-1', verbo: 'feel', forma: 'participio', texto: 'I have ___ tired all week.', senal: 'have', es: 'Me he sentido cansado esta semana.', falsos: ['fell', 'feelt'] },
    { id: 'feel-base-1', verbo: 'feel', forma: 'base', texto: "I didn't ___ well yesterday.", senal: "didn't", es: 'Ayer no me sentí bien.', falsos: ['felt', 'fel'] },

    { id: 'keep-pasado-1', verbo: 'keep', forma: 'pasado', texto: 'He ___ the money last year.', senal: 'last year', es: 'Él guardó la plata el año pasado.', falsos: ['keept', 'kepted'] },
    { id: 'keep-participio-1', verbo: 'keep', forma: 'participio', texto: 'I have ___ your secret.', senal: 'have', es: 'He guardado tu secreto.', falsos: ['keept', 'kepten'] },
    { id: 'keep-base-1', verbo: 'keep', forma: 'base', texto: "He didn't ___ his promise.", senal: "didn't", es: 'Él no cumplió su promesa.', falsos: ['kept', 'kep'] },

    { id: 'sleep-pasado-1', verbo: 'sleep', forma: 'pasado', texto: 'I ___ ten hours last night.', senal: 'last night', es: 'Anoche dormí diez horas.', falsos: ['sleept', 'slepten'] },
    { id: 'sleep-participio-1', verbo: 'sleep', forma: 'participio', texto: 'The baby has ___ well.', senal: 'has', es: 'El bebé ha dormido bien.', falsos: ['sleept', 'sleeped'] },
    { id: 'sleep-base-1', verbo: 'sleep', forma: 'base', texto: "I didn't ___ last night.", senal: "didn't", es: 'Anoche no dormí.', falsos: ['slept', 'slep'] },

    { id: 'meet-pasado-1', verbo: 'meet', forma: 'pasado', texto: 'I ___ Ana two years ago.', senal: 'two years ago', es: 'Conocí a Ana hace dos años.', falsos: ['mett', 'meeted'] },
    { id: 'meet-participio-1', verbo: 'meet', forma: 'participio', texto: 'She has ___ my parents.', senal: 'has', es: 'Ella ha conocido a mis papás.', falsos: ['mett', 'meten'] },
    { id: 'meet-base-1', verbo: 'meet', forma: 'base', texto: "We didn't ___ yesterday.", senal: "didn't", es: 'Ayer no nos vimos.', falsos: ['met', 'mat'] },

    { id: 'mean-pasado-1', verbo: 'mean', forma: 'pasado', texto: 'I ___ to call you yesterday.', senal: 'yesterday', es: 'Ayer quería llamarte.', falsos: ['ment', 'meaned'] },
    { id: 'mean-participio-1', verbo: 'mean', forma: 'participio', texto: 'It has ___ a lot to me.', senal: 'has', es: 'Ha significado mucho para mí.', falsos: ['ment', 'meanted'] },
    { id: 'mean-base-1', verbo: 'mean', forma: 'base', texto: "I didn't ___ to hurt you.", senal: "didn't", es: 'No quise hacerte daño.', falsos: ['meant', 'men'] },

    { id: 'lose-pasado-1', verbo: 'lose', forma: 'pasado', texto: 'I ___ my phone last week.', senal: 'last week', es: 'Perdí el celular la semana pasada.', falsos: ['loss', 'losed'] },
    { id: 'lose-participio-1', verbo: 'lose', forma: 'participio', texto: 'We have ___ the game.', senal: 'have', es: 'Hemos perdido el partido.', falsos: ['loss', 'losen'] },
    { id: 'lose-base-1', verbo: 'lose', forma: 'base', texto: "We didn't ___ the match.", senal: "didn't", es: 'No perdimos el partido.', falsos: ['lost', 'los'] },

    { id: 'send-pasado-1', verbo: 'send', forma: 'pasado', texto: 'She ___ a message last night.', senal: 'last night', es: 'Ella mandó un mensaje anoche.', falsos: ['senten', 'sended'] },
    { id: 'send-participio-1', verbo: 'send', forma: 'participio', texto: 'I have ___ the email.', senal: 'have', es: 'He enviado el correo.', falsos: ['senten', 'sendt'] },
    { id: 'send-base-1', verbo: 'send', forma: 'base', texto: 'Did you ___ the email?', senal: 'Did', es: '¿Enviaste el correo?', falsos: ['sent', 'sen'] },

    { id: 'spend-pasado-1', verbo: 'spend', forma: 'pasado', texto: 'We ___ a lot last weekend.', senal: 'last weekend', es: 'Gastamos mucho el fin de semana.', falsos: ['spendt', 'spenten'] },
    { id: 'spend-participio-1', verbo: 'spend', forma: 'participio', texto: 'He has ___ all his money.', senal: 'has', es: 'Él ha gastado toda su plata.', falsos: ['spenten', 'spended'] },
    { id: 'spend-base-1', verbo: 'spend', forma: 'base', texto: "I didn't ___ much money.", senal: "didn't", es: 'No gasté mucha plata.', falsos: ['spent', 'spen'] },

    { id: 'build-pasado-1', verbo: 'build', forma: 'pasado', texto: 'They ___ this house in 1990.', senal: 'in 1990', es: 'Construyeron esta casa en 1990.', falsos: ['bilt', 'builded'] },
    { id: 'build-participio-1', verbo: 'build', forma: 'participio', texto: 'They have ___ a new bridge.', senal: 'have', es: 'Han construido un puente nuevo.', falsos: ['bilt', 'builten'] },
    { id: 'build-base-1', verbo: 'build', forma: 'base', texto: "They didn't ___ it in a day.", senal: "didn't", es: 'No lo construyeron en un día.', falsos: ['built', 'bilt'] },

    // ═════ TRAMO 3 (verbos 21–30) ═════
    { id: 'go-pasado-1', verbo: 'go', forma: 'pasado', texto: 'Yesterday I ___ to school.', senal: 'Yesterday', es: 'Ayer fui al colegio.', falsos: ['gone', 'goed'] },
    { id: 'go-participio-1', verbo: 'go', forma: 'participio', texto: 'She has ___ to the store.', senal: 'has', es: 'Ella ha ido a la tienda.', falsos: ['went', 'wenten'] },
    { id: 'go-base-1', verbo: 'go', forma: 'base', texto: "I didn't ___ out last night.", senal: "didn't", es: 'Anoche no salí.', falsos: ['went', 'gone'] },

    { id: 'do-pasado-1', verbo: 'do', forma: 'pasado', texto: 'I ___ my homework last night.', senal: 'last night', es: 'Anoche hice la tarea.', falsos: ['done', 'doed'] },
    { id: 'do-participio-1', verbo: 'do', forma: 'participio', texto: 'We have ___ the dishes.', senal: 'have', es: 'Hemos lavado los platos.', falsos: ['did', 'doen'] },
    { id: 'do-base-1', verbo: 'do', forma: 'base', texto: "He didn't ___ his homework.", senal: "didn't", es: 'Él no hizo su tarea.', falsos: ['did', 'done'] },

    { id: 'come-pasado-1', verbo: 'come', forma: 'pasado', texto: 'My aunt ___ here yesterday.', senal: 'yesterday', es: 'Mi tía vino aquí ayer.', falsos: ['come', 'comen'] },
    { id: 'come-participio-1', verbo: 'come', forma: 'participio', texto: 'They have ___ to help.', senal: 'have', es: 'Ellos han venido a ayudar.', falsos: ['came', 'comed'] },
    { id: 'come-base-1', verbo: 'come', forma: 'base', texto: "She didn't ___ to class.", senal: "didn't", es: 'Ella no vino a clase.', falsos: ['came', 'cam'] },

    { id: 'become-pasado-1', verbo: 'become', forma: 'pasado', texto: 'She ___ a nurse in 2021.', senal: 'in 2021', es: 'Ella se hizo enfermera en 2021.', falsos: ['become', 'becomen'] },
    { id: 'become-participio-1', verbo: 'become', forma: 'participio', texto: 'He has ___ a good cook.', senal: 'has', es: 'Él se ha vuelto buen cocinero.', falsos: ['became', 'becomed'] },
    { id: 'become-base-1', verbo: 'become', forma: 'base', texto: "He didn't ___ angry.", senal: "didn't", es: 'Él no se enojó.', falsos: ['became', 'becam'] },

    { id: 'run-pasado-1', verbo: 'run', forma: 'pasado', texto: 'We ___ in the park yesterday.', senal: 'yesterday', es: 'Ayer corrimos en el parque.', falsos: ['run', 'runnen'] },
    { id: 'run-participio-1', verbo: 'run', forma: 'participio', texto: 'I have ___ five kilometers.', senal: 'have', es: 'He corrido cinco kilómetros.', falsos: ['ran', 'runned'] },
    { id: 'run-base-1', verbo: 'run', forma: 'base', texto: "I didn't ___ yesterday.", senal: "didn't", es: 'Ayer no corrí.', falsos: ['ran', 'ron'] },

    { id: 'put-pasado-1', verbo: 'put', forma: 'pasado', texto: 'Last night I ___ it here.', senal: 'Last night', es: 'Anoche lo puse aquí.', falsos: ['putted', 'putten'] },
    { id: 'put-participio-1', verbo: 'put', forma: 'participio', texto: 'She has ___ salt in the soup.', senal: 'has', es: 'Ella le ha puesto sal a la sopa.', falsos: ['putten', 'putted'] },
    { id: 'put-base-1', verbo: 'put', forma: 'base', texto: "I didn't ___ sugar in it.", senal: "didn't", es: 'No le puse azúcar.', falsos: ['putten', 'pot'] },

    { id: 'let-pasado-1', verbo: 'let', forma: 'pasado', texto: 'My dad ___ me go last night.', senal: 'last night', es: 'Mi papá me dejó ir anoche.', falsos: ['left', 'letted'] },
    { id: 'let-participio-1', verbo: 'let', forma: 'participio', texto: 'They have ___ us in.', senal: 'have', es: 'Nos han dejado entrar.', falsos: ['letten', 'letted'] },
    { id: 'let-base-1', verbo: 'let', forma: 'base', texto: "My mom didn't ___ me go.", senal: "didn't", es: 'Mi mamá no me dejó ir.', falsos: ['left', 'lat'] },

    { id: 'cut-pasado-1', verbo: 'cut', forma: 'pasado', texto: 'She ___ her hair last week.', senal: 'last week', es: 'Se cortó el pelo la semana pasada.', falsos: ['cutted', 'cutten'] },
    { id: 'cut-participio-1', verbo: 'cut', forma: 'participio', texto: 'I have ___ my finger.', senal: 'have', es: 'Me he cortado el dedo.', falsos: ['cutten', 'cutted'] },
    { id: 'cut-base-1', verbo: 'cut', forma: 'base', texto: "He didn't ___ the bread.", senal: "didn't", es: 'Él no cortó el pan.', falsos: ['cutten', 'cot'] },

    { id: 'hit-pasado-1', verbo: 'hit', forma: 'pasado', texto: 'The ball ___ me yesterday.', senal: 'yesterday', es: 'Ayer me pegó el balón.', falsos: ['hitted', 'hitten'] },
    { id: 'hit-participio-1', verbo: 'hit', forma: 'participio', texto: 'He has ___ his head.', senal: 'has', es: 'Él se ha pegado en la cabeza.', falsos: ['hitten', 'hitted'] },
    { id: 'hit-base-1', verbo: 'hit', forma: 'base', texto: "The car didn't ___ the tree.", senal: "didn't", es: 'El carro no golpeó el árbol.', falsos: ['hitten', 'het'] },

    { id: 'read-pasado-1', verbo: 'read', forma: 'pasado', texto: 'I ___ that book in 2020.', senal: 'in 2020', es: 'Leí ese libro en 2020.', falsos: ['red', 'readen'] },
    { id: 'read-participio-1', verbo: 'read', forma: 'participio', texto: 'She has ___ your message.', senal: 'has', es: 'Ella ha leído tu mensaje.', falsos: ['readen', 'readed'] },
    { id: 'read-base-1', verbo: 'read', forma: 'base', texto: "I didn't ___ the news today.", senal: "didn't", es: 'No leí las noticias hoy.', falsos: ['red', 'rad'] },

    // ═════ TRAMO 4 (verbos 31–40) ═════
    { id: 'take-pasado-1', verbo: 'take', forma: 'pasado', texto: 'We ___ a taxi last night.', senal: 'last night', es: 'Anoche tomamos un taxi.', falsos: ['taken', 'taked'] },
    { id: 'take-participio-1', verbo: 'take', forma: 'participio', texto: 'He has ___ my umbrella.', senal: 'has', es: 'Él se ha llevado mi sombrilla.', falsos: ['took', 'tooken'] },
    { id: 'take-base-1', verbo: 'take', forma: 'base', texto: "I didn't ___ the bus today.", senal: "didn't", es: 'Hoy no tomé el bus.', falsos: ['took', 'tok'] },

    { id: 'give-pasado-1', verbo: 'give', forma: 'pasado', texto: 'She ___ me a gift yesterday.', senal: 'yesterday', es: 'Ella me dio un regalo ayer.', falsos: ['given', 'gaved'] },
    { id: 'give-participio-1', verbo: 'give', forma: 'participio', texto: 'I have ___ him my number.', senal: 'have', es: 'Le he dado mi número.', falsos: ['gave', 'gaven'] },
    { id: 'give-base-1', verbo: 'give', forma: 'base', texto: "He didn't ___ me the key.", senal: "didn't", es: 'Él no me dio la llave.', falsos: ['gave', 'gav'] },

    { id: 'see-pasado-1', verbo: 'see', forma: 'pasado', texto: 'I ___ Ana two days ago.', senal: 'two days ago', es: 'Vi a Ana hace dos días.', falsos: ['seen', 'sawn'] },
    { id: 'see-participio-1', verbo: 'see', forma: 'participio', texto: 'We have ___ that movie.', senal: 'have', es: 'Hemos visto esa película.', falsos: ['saw', 'sawed'] },
    { id: 'see-base-1', verbo: 'see', forma: 'base', texto: "I didn't ___ you yesterday.", senal: "didn't", es: 'Ayer no te vi.', falsos: ['saw', 'sen'] },

    { id: 'know-pasado-1', verbo: 'know', forma: 'pasado', texto: 'I ___ the answer yesterday.', senal: 'yesterday', es: 'Ayer me sabía la respuesta.', falsos: ['known', 'knowed'] },
    { id: 'know-participio-1', verbo: 'know', forma: 'participio', texto: 'I have ___ her for years.', senal: 'have', es: 'La conozco desde hace años.', falsos: ['knew', 'knewn'] },
    { id: 'know-base-1', verbo: 'know', forma: 'base', texto: "I didn't ___ the answer.", senal: "didn't", es: 'No sabía la respuesta.', falsos: ['knew', 'kno'] },

    { id: 'eat-pasado-1', verbo: 'eat', forma: 'pasado', texto: 'They ___ rice last night.', senal: 'last night', es: 'Anoche comieron arroz.', falsos: ['eaten', 'aten'] },
    { id: 'eat-participio-1', verbo: 'eat', forma: 'participio', texto: 'She has ___ all the soup.', senal: 'has', es: 'Ella se ha comido toda la sopa.', falsos: ['ate', 'eated'] },
    { id: 'eat-base-1', verbo: 'eat', forma: 'base', texto: 'Did you ___ breakfast?', senal: 'Did', es: '¿Desayunaste?', falsos: ['ate', 'et'] },

    { id: 'fall-pasado-1', verbo: 'fall', forma: 'pasado', texto: 'He ___ off his bike yesterday.', senal: 'yesterday', es: 'Ayer él se cayó de la bici.', falsos: ['fallen', 'falled'] },
    { id: 'fall-participio-1', verbo: 'fall', forma: 'participio', texto: 'My phone has ___ again.', senal: 'has', es: 'Mi celular se ha caído otra vez.', falsos: ['fell', 'fellen'] },
    { id: 'fall-base-1', verbo: 'fall', forma: 'base', texto: "The child didn't ___ down.", senal: "didn't", es: 'El niño no se cayó.', falsos: ['fell', 'fal'] },

    { id: 'write-pasado-1', verbo: 'write', forma: 'pasado', texto: 'I ___ a letter last week.', senal: 'last week', es: 'Escribí una carta hace ocho días.', falsos: ['written', 'wroten'] },
    { id: 'write-participio-1', verbo: 'write', forma: 'participio', texto: 'She has ___ three books.', senal: 'has', es: 'Ella ha escrito tres libros.', falsos: ['wrote', 'writen'] },
    { id: 'write-base-1', verbo: 'write', forma: 'base', texto: "He didn't ___ his name.", senal: "didn't", es: 'Él no escribió su nombre.', falsos: ['wrote', 'wrot'] },

    { id: 'drive-pasado-1', verbo: 'drive', forma: 'pasado', texto: 'My dad ___ to Cali last night.', senal: 'last night', es: 'Mi papá manejó a Cali anoche.', falsos: ['driven', 'drived'] },
    { id: 'drive-participio-1', verbo: 'drive', forma: 'participio', texto: 'I have ___ a truck.', senal: 'have', es: 'He manejado un camión.', falsos: ['drove', 'droven'] },
    { id: 'drive-base-1', verbo: 'drive', forma: 'base', texto: "She didn't ___ last night.", senal: "didn't", es: 'Ella no manejó anoche.', falsos: ['drove', 'drov'] },

    { id: 'ride-pasado-1', verbo: 'ride', forma: 'pasado', texto: 'We ___ our bikes yesterday.', senal: 'yesterday', es: 'Ayer montamos en bici.', falsos: ['ridden', 'roden'] },
    { id: 'ride-participio-1', verbo: 'ride', forma: 'participio', texto: 'She has ___ a horse.', senal: 'has', es: 'Ella ha montado a caballo.', falsos: ['rode', 'rided'] },
    { id: 'ride-base-1', verbo: 'ride', forma: 'base', texto: "I didn't ___ my bike today.", senal: "didn't", es: 'Hoy no monté en bici.', falsos: ['rode', 'rod'] },

    { id: 'rise-pasado-1', verbo: 'rise', forma: 'pasado', texto: 'The sun ___ at six yesterday.', senal: 'yesterday', es: 'Ayer el sol salió a las seis.', falsos: ['risen', 'rised'] },
    { id: 'rise-participio-1', verbo: 'rise', forma: 'participio', texto: 'Prices have ___ again.', senal: 'have', es: 'Los precios han subido otra vez.', falsos: ['rose', 'rosen'] },
    { id: 'rise-base-1', verbo: 'rise', forma: 'base', texto: "Prices didn't ___ this month.", senal: "didn't", es: 'Los precios no subieron este mes.', falsos: ['rose', 'ros'] },

    // ═════ TRAMO 5 (verbos 41–50) ═════
    { id: 'speak-pasado-1', verbo: 'speak', forma: 'pasado', texto: 'I ___ to my boss yesterday.', senal: 'yesterday', es: 'Ayer hablé con mi jefe.', falsos: ['spoken', 'speaked'] },
    { id: 'speak-participio-1', verbo: 'speak', forma: 'participio', texto: 'She has ___ to the teacher.', senal: 'has', es: 'Ella ha hablado con la profesora.', falsos: ['spoke', 'speaken'] },
    { id: 'speak-base-1', verbo: 'speak', forma: 'base', texto: "He didn't ___ in class.", senal: "didn't", es: 'Él no habló en clase.', falsos: ['spoke', 'spok'] },

    { id: 'break-pasado-1', verbo: 'break', forma: 'pasado', texto: 'He ___ a glass last night.', senal: 'last night', es: 'Él rompió un vaso anoche.', falsos: ['broken', 'breaken'] },
    { id: 'break-participio-1', verbo: 'break', forma: 'participio', texto: 'I have ___ my glasses.', senal: 'have', es: 'He roto mis gafas.', falsos: ['broke', 'breaked'] },
    { id: 'break-base-1', verbo: 'break', forma: 'base', texto: "I didn't ___ the window.", senal: "didn't", es: 'Yo no rompí la ventana.', falsos: ['broke', 'brok'] },

    { id: 'choose-pasado-1', verbo: 'choose', forma: 'pasado', texto: 'We ___ this school in 2022.', senal: 'in 2022', es: 'Escogimos este colegio en 2022.', falsos: ['chosen', 'chosed'] },
    { id: 'choose-participio-1', verbo: 'choose', forma: 'participio', texto: 'She has ___ the red dress.', senal: 'has', es: 'Ella ha escogido el vestido rojo.', falsos: ['chose', 'choosen'] },
    { id: 'choose-base-1', verbo: 'choose', forma: 'base', texto: "She didn't ___ that color.", senal: "didn't", es: 'Ella no escogió ese color.', falsos: ['chose', 'chos'] },

    { id: 'forget-pasado-1', verbo: 'forget', forma: 'pasado', texto: 'I ___ my wallet yesterday.', senal: 'yesterday', es: 'Ayer olvidé la billetera.', falsos: ['forgotten', 'forgetted'] },
    { id: 'forget-participio-1', verbo: 'forget', forma: 'participio', texto: 'He has ___ my name.', senal: 'has', es: 'Él ha olvidado mi nombre.', falsos: ['forgoten', 'forgetten'] },
    { id: 'forget-base-1', verbo: 'forget', forma: 'base', texto: "I didn't ___ your birthday.", senal: "didn't", es: 'No olvidé tu cumpleaños.', falsos: ['forgot', 'frot'] },

    { id: 'wear-pasado-1', verbo: 'wear', forma: 'pasado', texto: 'She ___ jeans last night.', senal: 'last night', es: 'Ella se puso jeans anoche.', falsos: ['worn', 'woren'] },
    { id: 'wear-participio-1', verbo: 'wear', forma: 'participio', texto: 'I have ___ this shirt twice.', senal: 'have', es: 'He usado esta camisa dos veces.', falsos: ['wore', 'weared'] },
    { id: 'wear-base-1', verbo: 'wear', forma: 'base', texto: "He didn't ___ a coat today.", senal: "didn't", es: 'Él no usó abrigo hoy.', falsos: ['wore', 'wor'] },

    { id: 'think-pasado-1', verbo: 'think', forma: 'pasado', texto: 'Yesterday I ___ about you.', senal: 'Yesterday', es: 'Ayer pensé en ti.', falsos: ['tought', 'thinked'] },
    { id: 'think-participio-1', verbo: 'think', forma: 'participio', texto: 'We have ___ about it.', senal: 'have', es: 'Lo hemos pensado.', falsos: ['tought', 'thinken'] },
    { id: 'think-base-1', verbo: 'think', forma: 'base', texto: "I didn't ___ about that.", senal: "didn't", es: 'No pensé en eso.', falsos: ['thought', 'thok'] },

    { id: 'buy-pasado-1', verbo: 'buy', forma: 'pasado', texto: 'My mom ___ bread yesterday.', senal: 'yesterday', es: 'Mi mamá compró pan ayer.', falsos: ['bougth', 'buyed'] },
    { id: 'buy-participio-1', verbo: 'buy', forma: 'participio', texto: 'I have ___ a new phone.', senal: 'have', es: 'He comprado un celular nuevo.', falsos: ['bougth', 'buyed'] },
    { id: 'buy-base-1', verbo: 'buy', forma: 'base', texto: 'Did you ___ the tickets?', senal: 'Did', es: '¿Compraste las boletas?', falsos: ['bought', 'bot'] },

    { id: 'bring-pasado-1', verbo: 'bring', forma: 'pasado', texto: 'She ___ coffee last night.', senal: 'last night', es: 'Ella trajo café anoche.', falsos: ['brougth', 'bringed'] },
    { id: 'bring-participio-1', verbo: 'bring', forma: 'participio', texto: 'They have ___ the food.', senal: 'have', es: 'Ellos han traído la comida.', falsos: ['brougth', 'bringed'] },
    { id: 'bring-base-1', verbo: 'bring', forma: 'base', texto: "He didn't ___ his book.", senal: "didn't", es: 'Él no trajo su libro.', falsos: ['brought', 'brog'] },

    { id: 'teach-pasado-1', verbo: 'teach', forma: 'pasado', texto: 'She ___ English in 2020.', senal: 'in 2020', es: 'Ella enseñó inglés en 2020.', falsos: ['tought', 'taugth'] },
    { id: 'teach-participio-1', verbo: 'teach', forma: 'participio', texto: 'My mom has ___ me a lot.', senal: 'has', es: 'Mi mamá me ha enseñado mucho.', falsos: ['tought', 'teached'] },
    { id: 'teach-base-1', verbo: 'teach', forma: 'base', texto: "She didn't ___ on Friday.", senal: "didn't", es: 'Ella no dictó clase el viernes.', falsos: ['taught', 'tot'] },

    { id: 'catch-pasado-1', verbo: 'catch', forma: 'pasado', texto: 'I ___ the bus an hour ago.', senal: 'an hour ago', es: 'Cogí el bus hace una hora.', falsos: ['cought', 'catched'] },
    { id: 'catch-participio-1', verbo: 'catch', forma: 'participio', texto: 'She has ___ a cold.', senal: 'has', es: 'A ella le ha dado gripa.', falsos: ['cought', 'caughten'] },
    { id: 'catch-base-1', verbo: 'catch', forma: 'base', texto: "I didn't ___ the ball.", senal: "didn't", es: 'No atrapé el balón.', falsos: ['caught', 'cot'] },

    // ═════ TRAMO 6 (verbos 51–60) ═════
    { id: 'drink-pasado-1', verbo: 'drink', forma: 'pasado', texto: 'We ___ juice last night.', senal: 'last night', es: 'Anoche tomamos jugo.', falsos: ['drunk', 'drinked'] },
    { id: 'drink-participio-1', verbo: 'drink', forma: 'participio', texto: 'I have ___ too much coffee.', senal: 'have', es: 'He tomado demasiado café.', falsos: ['drinken', 'drunked'] },
    { id: 'drink-base-1', verbo: 'drink', forma: 'base', texto: "She didn't ___ coffee today.", senal: "didn't", es: 'Ella no tomó café hoy.', falsos: ['drank', 'drak'] },

    { id: 'sing-pasado-1', verbo: 'sing', forma: 'pasado', texto: 'She ___ at church yesterday.', senal: 'yesterday', es: 'Ella cantó en la iglesia ayer.', falsos: ['song', 'singed'] },
    { id: 'sing-participio-1', verbo: 'sing', forma: 'participio', texto: 'They have ___ that song.', senal: 'have', es: 'Ellos han cantado esa canción.', falsos: ['sang', 'singen'] },
    { id: 'sing-base-1', verbo: 'sing', forma: 'base', texto: "They didn't ___ last night.", senal: "didn't", es: 'Anoche no cantaron.', falsos: ['sang', 'sag'] },

    { id: 'swim-pasado-1', verbo: 'swim', forma: 'pasado', texto: 'I ___ in the river last week.', senal: 'last week', es: 'Nadé en el río hace ocho días.', falsos: ['swum', 'swimmed'] },
    { id: 'swim-participio-1', verbo: 'swim', forma: 'participio', texto: 'He has ___ in the sea.', senal: 'has', es: 'Él ha nadado en el mar.', falsos: ['swam', 'swimmen'] },
    { id: 'swim-base-1', verbo: 'swim', forma: 'base', texto: "We didn't ___ in the pool.", senal: "didn't", es: 'No nadamos en la piscina.', falsos: ['swam', 'swm'] },

    { id: 'begin-pasado-1', verbo: 'begin', forma: 'pasado', texto: 'The class ___ an hour ago.', senal: 'an hour ago', es: 'La clase empezó hace una hora.', falsos: ['begun', 'beginned'] },
    { id: 'begin-participio-1', verbo: 'begin', forma: 'participio', texto: 'The movie has ___.', senal: 'has', es: 'La película ha empezado.', falsos: ['began', 'begined'] },
    { id: 'begin-base-1', verbo: 'begin', forma: 'base', texto: "The show didn't ___ on time.", senal: "didn't", es: 'El show no empezó a tiempo.', falsos: ['began', 'beg'] },

    { id: 'ring-pasado-1', verbo: 'ring', forma: 'pasado', texto: 'The phone ___ last night.', senal: 'last night', es: 'El teléfono sonó anoche.', falsos: ['ringen', 'ringed'] },
    { id: 'ring-participio-1', verbo: 'ring', forma: 'participio', texto: 'The bell has ___.', senal: 'has', es: 'La campana ha sonado.', falsos: ['rang', 'ringen'] },
    { id: 'ring-base-1', verbo: 'ring', forma: 'base', texto: "The bell didn't ___ today.", senal: "didn't", es: 'El timbre no sonó hoy.', falsos: ['rang', 'rag'] },

    { id: 'grow-pasado-1', verbo: 'grow', forma: 'pasado', texto: 'He ___ a lot last year.', senal: 'last year', es: 'Él creció mucho el año pasado.', falsos: ['grown', 'growed'] },
    { id: 'grow-participio-1', verbo: 'grow', forma: 'participio', texto: 'My son has ___ a lot.', senal: 'has', es: 'Mi hijo ha crecido mucho.', falsos: ['grew', 'growen'] },
    { id: 'grow-base-1', verbo: 'grow', forma: 'base', texto: "The plant didn't ___ much.", senal: "didn't", es: 'La mata no creció mucho.', falsos: ['grew', 'gro'] },

    { id: 'throw-pasado-1', verbo: 'throw', forma: 'pasado', texto: 'I ___ it away last week.', senal: 'last week', es: 'Lo boté la semana pasada.', falsos: ['thrown', 'through'] },
    { id: 'throw-participio-1', verbo: 'throw', forma: 'participio', texto: 'He has ___ the ball.', senal: 'has', es: 'Él ha lanzado el balón.', falsos: ['threw', 'throwed'] },
    { id: 'throw-base-1', verbo: 'throw', forma: 'base', texto: "I didn't ___ the stone.", senal: "didn't", es: 'Yo no tiré la piedra.', falsos: ['threw', 'thro'] },

    { id: 'fly-pasado-1', verbo: 'fly', forma: 'pasado', texto: 'We ___ to Bogotá last week.', senal: 'last week', es: 'Volamos a Bogotá hace ocho días.', falsos: ['flown', 'flied'] },
    { id: 'fly-participio-1', verbo: 'fly', forma: 'participio', texto: 'I have ___ in a plane.', senal: 'have', es: 'He volado en avión.', falsos: ['flew', 'flewn'] },
    { id: 'fly-base-1', verbo: 'fly', forma: 'base', texto: "They didn't ___ yesterday.", senal: "didn't", es: 'Ellos no volaron ayer.', falsos: ['flew', 'flo'] },

    { id: 'draw-pasado-1', verbo: 'draw', forma: 'pasado', texto: 'She ___ a cat yesterday.', senal: 'yesterday', es: 'Ella dibujó un gato ayer.', falsos: ['drawn', 'drawed'] },
    { id: 'draw-participio-1', verbo: 'draw', forma: 'participio', texto: 'He has ___ a map.', senal: 'has', es: 'Él ha dibujado un mapa.', falsos: ['drew', 'drawen'] },
    { id: 'draw-base-1', verbo: 'draw', forma: 'base', texto: "She didn't ___ that picture.", senal: "didn't", es: 'Ella no hizo ese dibujo.', falsos: ['drew', 'dro'] },

    { id: 'blow-pasado-1', verbo: 'blow', forma: 'pasado', texto: 'The wind ___ hard last night.', senal: 'last night', es: 'Anoche el viento sopló duro.', falsos: ['blown', 'blewed'] },
    { id: 'blow-participio-1', verbo: 'blow', forma: 'participio', texto: 'She has ___ out the candles.', senal: 'has', es: 'Ella ha soplado las velas.', falsos: ['blew', 'blowen'] },
    { id: 'blow-base-1', verbo: 'blow', forma: 'base', texto: "The wind didn't ___ today.", senal: "didn't", es: 'El viento no sopló hoy.', falsos: ['blew', 'blo'] },

    // ═════ VERBOS REGULARES INFILTRADOS (la respuesta en pasado/participio SÍ termina en -ed; en base NO) ═════
    { id: 'walk-pasado-1', verbo: 'walk', forma: 'pasado', texto: 'We ___ to school yesterday.', senal: 'yesterday', es: 'Ayer caminamos al colegio.', falsos: ['wolk', 'walken'] },
    { id: 'walk-participio-1', verbo: 'walk', forma: 'participio', texto: 'I have ___ a lot today.', senal: 'have', es: 'Hoy he caminado mucho.', falsos: ['walken', 'wolk'] },
    { id: 'walk-base-1', verbo: 'walk', forma: 'base', texto: "We didn't ___ yesterday.", senal: "didn't", es: 'Ayer no caminamos.', falsos: ['walked', 'wok'] },

    { id: 'work-pasado-1', verbo: 'work', forma: 'pasado', texto: 'She ___ late last night.', senal: 'last night', es: 'Ella trabajó hasta tarde anoche.', falsos: ['workt', 'worken'] },
    { id: 'work-participio-1', verbo: 'work', forma: 'participio', texto: 'He has ___ here for years.', senal: 'has', es: 'Él ha trabajado aquí por años.', falsos: ['worken', 'workt'] },
    { id: 'work-base-1', verbo: 'work', forma: 'base', texto: "I didn't ___ on Sunday.", senal: "didn't", es: 'No trabajé el domingo.', falsos: ['worked', 'wok'] },

    { id: 'play-pasado-1', verbo: 'play', forma: 'pasado', texto: 'We ___ soccer last weekend.', senal: 'last weekend', es: 'Jugamos fútbol el fin de semana.', falsos: ['plaid', 'playen'] },
    { id: 'play-participio-1', verbo: 'play', forma: 'participio', texto: 'They have ___ well.', senal: 'have', es: 'Ellos han jugado bien.', falsos: ['playen', 'plaid'] },
    { id: 'play-base-1', verbo: 'play', forma: 'base', texto: "He didn't ___ yesterday.", senal: "didn't", es: 'Él no jugó ayer.', falsos: ['played', 'pla'] },

    { id: 'want-pasado-1', verbo: 'want', forma: 'pasado', texto: 'I ___ a coffee an hour ago.', senal: 'an hour ago', es: 'Hace una hora quería un café.', falsos: ['went', 'wanten'] },
    { id: 'want-participio-1', verbo: 'want', forma: 'participio', texto: 'She has ___ a dog for years.', senal: 'has', es: 'Ella ha querido un perro por años.', falsos: ['wanten', 'went'] },
    { id: 'want-base-1', verbo: 'want', forma: 'base', texto: "She didn't ___ to go out.", senal: "didn't", es: 'Ella no quiso salir.', falsos: ['wanted', 'wan'] },

    { id: 'look-pasado-1', verbo: 'look', forma: 'pasado', texto: 'She ___ at me last night.', senal: 'last night', es: 'Ella me miró anoche.', falsos: ['lookt', 'looken'] },
    { id: 'look-participio-1', verbo: 'look', forma: 'participio', texto: 'I have ___ everywhere.', senal: 'have', es: 'He buscado por todas partes.', falsos: ['looken', 'lookt'] },
    { id: 'look-base-1', verbo: 'look', forma: 'base', texto: "I didn't ___ at the clock.", senal: "didn't", es: 'No miré el reloj.', falsos: ['looked', 'lok'] },

    { id: 'live-pasado-1', verbo: 'live', forma: 'pasado', texto: 'My family ___ here in 2010.', senal: 'in 2010', es: 'Mi familia vivía aquí en 2010.', falsos: ['lave', 'liven'] },
    { id: 'live-participio-1', verbo: 'live', forma: 'participio', texto: 'I have ___ here all my life.', senal: 'have', es: 'He vivido aquí toda la vida.', falsos: ['liven', 'lave'] },
    { id: 'live-base-1', verbo: 'live', forma: 'base', texto: "They didn't ___ in Cali.", senal: "didn't", es: 'Ellos no vivieron en Cali.', falsos: ['lived', 'liv'] },

    { id: 'talk-pasado-1', verbo: 'talk', forma: 'pasado', texto: 'I ___ to my mom last night.', senal: 'last night', es: 'Anoche hablé con mi mamá.', falsos: ['tolk', 'talken'] },
    { id: 'talk-participio-1', verbo: 'talk', forma: 'participio', texto: 'She has ___ to the doctor.', senal: 'has', es: 'Ella ha hablado con el médico.', falsos: ['talken', 'tolk'] },
    { id: 'talk-base-1', verbo: 'talk', forma: 'base', texto: "We didn't ___ about it.", senal: "didn't", es: 'No hablamos de eso.', falsos: ['talked', 'tok'] },

    { id: 'call-pasado-1', verbo: 'call', forma: 'pasado', texto: 'She ___ me two days ago.', senal: 'two days ago', es: 'Ella me llamó hace dos días.', falsos: ['cell', 'callen'] },
    { id: 'call-participio-1', verbo: 'call', forma: 'participio', texto: 'I have ___ the doctor.', senal: 'have', es: 'He llamado al médico.', falsos: ['callen', 'cell'] },
    { id: 'call-base-1', verbo: 'call', forma: 'base', texto: 'Did you ___ your mom?', senal: 'Did', es: '¿Llamaste a tu mamá?', falsos: ['called', 'cal'] },

    { id: 'help-pasado-1', verbo: 'help', forma: 'pasado', texto: 'He ___ me a lot yesterday.', senal: 'yesterday', es: 'Ayer él me ayudó mucho.', falsos: ['helpt', 'helpen'] },
    { id: 'help-participio-1', verbo: 'help', forma: 'participio', texto: 'You have ___ us a lot.', senal: 'have', es: 'Nos has ayudado mucho.', falsos: ['helpen', 'helpt'] },
    { id: 'help-base-1', verbo: 'help', forma: 'base', texto: "He didn't ___ us yesterday.", senal: "didn't", es: 'Ayer él no nos ayudó.', falsos: ['helped', 'hep'] },

    { id: 'start-pasado-1', verbo: 'start', forma: 'pasado', texto: 'The game ___ an hour ago.', senal: 'an hour ago', es: 'El partido empezó hace una hora.', falsos: ['stort', 'starten'] },
    { id: 'start-participio-1', verbo: 'start', forma: 'participio', texto: 'The class has ___.', senal: 'has', es: 'La clase ha empezado.', falsos: ['starten', 'stort'] },
    { id: 'start-base-1', verbo: 'start', forma: 'base', texto: "The movie didn't ___ at six.", senal: "didn't", es: 'La película no empezó a las 6.', falsos: ['started', 'stot'] },

    { id: 'open-pasado-1', verbo: 'open', forma: 'pasado', texto: 'They ___ the store in 2018.', senal: 'in 2018', es: 'Abrieron la tienda en 2018.', falsos: ['opent', 'openen'] },
    { id: 'open-participio-1', verbo: 'open', forma: 'participio', texto: 'She has ___ the window.', senal: 'has', es: 'Ella ha abierto la ventana.', falsos: ['openen', 'opent'] },
    { id: 'open-base-1', verbo: 'open', forma: 'base', texto: "They didn't ___ the door.", senal: "didn't", es: 'No abrieron la puerta.', falsos: ['opened', 'opn'] },

    { id: 'watch-pasado-1', verbo: 'watch', forma: 'pasado', texto: 'We ___ a movie last night.', senal: 'last night', es: 'Anoche vimos una película.', falsos: ['waught', 'watchen'] },
    { id: 'watch-participio-1', verbo: 'watch', forma: 'participio', texto: 'I have ___ that video.', senal: 'have', es: 'He visto ese video.', falsos: ['watchen', 'waught'] },
    { id: 'watch-base-1', verbo: 'watch', forma: 'base', texto: "I didn't ___ TV last night.", senal: "didn't", es: 'Anoche no vi televisión.', falsos: ['watched', 'wach'] }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
