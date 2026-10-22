// logica.js — el juego sin pantalla.
// Dueño: agente de Construcción. Explicación llana en equipo/construccion.md
//
// Simulación pura: no toca la página, el canvas ni el guardado, y no usa Math.random
// (tiene su propio generador con semilla). Con la misma semilla y las mismas jugadas,
// la partida sale idéntica. Funciona igual en el navegador y en Node:
//
//   require('./js/verbos.js'); require('./js/oraciones.js'); require('./js/reglas.js'); require('./js/logica.js');
//   const partida = globalThis.VJ.crearPartida({ semilla: 1, historial: {} });
//   partida.mover(1); const eventos = partida.paso(1 / 60); partida.estado; partida.resumen();
//
// Todos los números de juego salen de VJ.REGLAS (aquí R). Los únicos números propios de
// este archivo son técnicos y están en las constantes de abajo.

(function (raiz) {
  'use strict';
  const VJ = raiz.VJ = raiz.VJ || {};

  const CARRILES = 3;        // la calle tiene tres carriles: 0, 1 y 2 (lo fija el contrato)
  const DT_MAX = 0.25;       // técnico: un paso nunca avanza más de esto (pestaña en segundo plano)
  const MAX_SUCESOS = 1000;  // técnico: tope de sucesos dentro de un mismo paso, por seguridad
  const TEXTO_RECOGER = '¡Recoge el verbo! Pasa por encima de la palabra.';

  // Añadidos de Construcción (segunda pasada): estrellas y puntos para que siempre haya algo que hacer.
  // No cambian quién gana ni quién pierde, ni el azar de las filas (usan un dado aparte).
  // Van aquí y no en reglas.js porque esa tabla es de Mecánica.
  VJ.EXTRAS = VJ.EXTRAS || {
    puntosEstrella: 10,        // puntos por cada estrella recogida (se multiplican por la racha)
    puntosRecoger: 20,         // puntos por recoger el verbo base
    puntosAcierto: 100,        // puntos por cada fila acertada (se multiplican por la racha)
    puntosAprendido: 250,      // premio por dejar un verbo aprendido
    puntosVictoria: 500,       // premio por terminar la partida
    rachaPorNivel: 2,          // filas acertadas seguidas para subir un nivel de multiplicador
    multiplicadorMax: 5,       // tope del multiplicador de racha
    estrellaPrimera: 0.45,     // segundos desde que la calle queda vacía hasta la primera estrella
    estrellaCada: 0.4,         // segundos entre una estrella y la siguiente
    estrellaMargen: 0.3,       // la última estrella llega estos segundos antes de que aparezca lo siguiente
    estrellasConVerbo: 0.55,   // mientras viene el verbo base, hay estrellas solo en esta fracción inicial de su recorrido
    estrellasPorTramo: 3       // estrellas seguidas en un mismo carril antes de cambiar al de al lado
  };

  // ───── Azar con semilla (mulberry32) ─────
  function crearAzar(semilla) {
    let a = (Number(semilla) || 0) >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function barajar(lista, azar) {
    const copia = lista.slice();
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(azar() * (i + 1));
      const t = copia[i]; copia[i] = copia[j]; copia[j] = t;
    }
    return copia;
  }

  function limitar(v, min, max) { return v < min ? min : (v > max ? max : v); }

  // Lee lo guardado de un verbo; lo que falte vale 0 / false / vacío.
  function leerHistorial(historial, id) {
    const e = (historial && historial[id]) || {};
    // un dato dañado (texto, negativo, infinito) se lee como 0: así ningún verbo desaparece ni se guarda basura
    const num = function (x) { x = Number(x); return isFinite(x) && x > 0 ? Math.floor(x) : 0; };
    return {
      vistos: num(e.vistos),
      aciertos: num(e.aciertos),
      fallos: num(e.fallos),
      racha: num(e.racha),
      descanso: num(e.descanso),
      produccionesLimpias: num(e.produccionesLimpias),
      sabido: !!e.sabido,
      pendiente: !!e.pendiente,
      falsoPasado: typeof e.falsoPasado === 'string' ? e.falsoPasado : '',
      falsoParticipio: typeof e.falsoParticipio === 'string' ? e.falsoParticipio : ''
    };
  }

  function esSabido(h, R) {
    R = R || VJ.REGLAS || {};
    if (!h) return false;
    const rachaMin = R.rachaSabido || 3;
    if ((h.racha || 0) < rachaMin) return false;
    if (R.requiereProduccionParaSabido) {
      return (h.produccionesLimpias || 0) >= 1 || h.sabido === true;
    }
    return true;
  }

  // Los verbos de un tramo (tramo 1 = orden 1 a verbosPorTramo, etc.)
  function verbosDeTramo(k, verbos, R) {
    R = R || VJ.REGLAS || {};
    const n = R.verbosPorTramo || 10;
    return (verbos || VJ.VERBOS || []).filter(function (v) { return v.orden > n * (k - 1) && v.orden <= n * k; })
      .sort(function (a, b) { return a.orden - b.orden; });
  }

  // Devuelve el primer tramo t (1..6) donde los verbos en estado "sabido" sean menos de R.sabidosParaAvanzar (8).
  function tramoActual(historial, reglas, verbos) {
    const R = reglas || VJ.REGLAS || {};
    const V = verbos || VJ.VERBOS || [];
    const n = R.verbosPorTramo || 10;
    const totalTramos = Math.max(1, Math.ceil(V.length / n));
    const meta = R.sabidosParaAvanzar || 8;
    for (let t = 1; t <= totalTramos; t++) {
      const delTramo = verbosDeTramo(t, V, R);
      const sabidos = delTramo.filter(function (v) {
        return esSabido(leerHistorial(historial, v.id), R);
      }).length;
      if (sabidos < meta) return t;
    }
    return totalTramos;
  }

  // Completa la cola con una segunda vuelta de los mismos verbos (DISENO 6).
  function conVueltas(ids, R) {
    const total = R.turnosPorPartida;
    const base = ids.slice(0, total);
    const cola = base.slice();
    for (let vuelta = 1; vuelta < R.maxTurnosPorVerbo && cola.length < total; vuelta++) {
      for (let i = 0; i < base.length && cola.length < total; i++) {
        if (cola[cola.length - 1] !== base[i] || base.length === 1) cola.push(base[i]);
      }
    }
    return cola;
  }

  // ───── Qué verbos salen en una partida (DISENO 6 + Cuarta etapa: tramos cerrados) ─────
  // Soporta tanto armarCola({ modo, grupo, historial, reglas, verbos, tramo, opciones })
  // como armarCola(modo, grupoId, historial, R, azar, verbos, opciones).
  function armarCola(op, grupoId, historialArg, reglasArg, azarArg, verbosArg, opcionesArg) {
    if (typeof op === 'string') {
      op = Object.assign({}, opcionesArg || {}, {
        modo: op,
        grupo: grupoId,
        historial: historialArg,
        reglas: reglasArg,
        azar: azarArg,
        verbos: verbosArg,
        opciones: opcionesArg
      });
    } else {
      op = op || {};
    }
    const R = op.reglas || VJ.REGLAS;
    const verbos = (op.verbos || VJ.VERBOS).slice().sort(function (a, b) { return a.orden - b.orden; });
    const H = {};
    verbos.forEach(function (v) { H[v.id] = leerHistorial(op.historial, v.id); });
    const total = R.turnosPorPartida;
    let modo = op.modo === 'grupo' || op.modo === 'repaso' ? op.modo : 'camino';
    let grupo = null;
    let ids = [];

    if (modo === 'grupo') {
      grupo = op.grupo;
      if (!verbos.some(function (v) { return v.grupo === grupo; })) grupo = verbos.length ? verbos[0].grupo : null;
      ids = verbos.filter(function (v) { return v.grupo === grupo; }).map(function (v) { return v.id; });
      return { cola: conVueltas(ids, R), modo: modo, grupo: grupo, tramo: null };
    }

    if (modo === 'repaso') {
      ids = verbos.filter(function (v) { return H[v.id].fallos > 0; }).sort(function (a, b) {
        const ha = H[a.id], hb = H[b.id];
        if (ha.pendiente !== hb.pendiente) return ha.pendiente ? -1 : 1;
        const ta = ha.fallos / Math.max(1, ha.vistos), tb = hb.fallos / Math.max(1, hb.vistos);
        if (ta !== tb) return tb - ta;
        return a.orden - b.orden;
      }).map(function (v) { return v.id; });
      if (ids.length && ids.length < (R.repasoMinVerbos || 0)) {
        // pocos verbos por repasar: se rellena con verbos ya vistos, para que no salga el mismo dos veces seguidas
        verbos.filter(function (v) { return H[v.id].vistos > 0 && ids.indexOf(v.id) < 0; }).sort(function (a, b) {
          return (H[a.id].racha - H[b.id].racha) || (a.orden - b.orden);
        }).slice(0, R.repasoMinVerbos - ids.length).forEach(function (v) { ids.push(v.id); });
      }
      if (ids.length) return { cola: conVueltas(ids, R), modo: modo, grupo: null, tramo: null };
      modo = 'camino';   // nada que repasar: se juega el camino normal
    }

    // Camino con tramo cerrado de 10 verbos (Cuarta etapa)
    if (R.tramoCerrado) {
      const opciones = op.opciones || op;
      const tramo = (opciones && opciones.tramo) || tramoActual(op.historial, R, verbos);
      const nTramo = R.verbosPorTramo || 10;
      const minOrden = (tramo - 1) * nTramo + 1;
      const maxOrden = tramo * nTramo;
      let delTramo = verbos.filter(function (v) { return v.orden >= minOrden && v.orden <= maxOrden; });
      if (!delTramo.length) delTramo = verbos.slice(0, nTramo);

      const agregar = function (v) {
        if (v && ids.length < total && ids.indexOf(v.id) < 0) ids.push(v.id);
      };

      // 1. Pendientes del tramo actual (y cualquier pendiente previo en historial para que siempre abra la cola)
      delTramo.filter(function (v) { return H[v.id].pendiente; }).forEach(agregar);
      verbos.filter(function (v) { return H[v.id].pendiente && ids.indexOf(v.id) < 0; }).forEach(agregar);

      // 2. Si tramo > 1, reservar hasta cupoMantenimiento verbos de tramos anteriores (vistos > 0 y pendiente o descanso <= 0)
      if (tramo > 1) {
        const cupoMant = R.cupoMantenimiento == null ? 2 : R.cupoMantenimiento;
        const mant = verbos.filter(function (v) {
          return v.orden < minOrden && H[v.id].vistos > 0 && (H[v.id].pendiente || H[v.id].descanso <= 0);
        }).sort(function (a, b) {
          const ha = H[a.id], hb = H[b.id];
          if (ha.pendiente !== hb.pendiente) return ha.pendiente ? -1 : 1;
          if (ha.racha !== hb.racha) return ha.racha - hb.racha;
          return a.orden - b.orden;
        }).slice(0, cupoMant);
        mant.forEach(agregar);
      }

      // 3. Resto del tramo actual: primero vistos > 0 && descanso <= 0, luego vistos === 0, luego descanso > 0
      delTramo.filter(function (v) { return !H[v.id].pendiente && H[v.id].vistos > 0 && H[v.id].descanso <= 0; })
        .sort(function (a, b) {
          const ha = H[a.id], hb = H[b.id];
          const sa = esSabido(ha, R) ? 1 : 0, sb = esSabido(hb, R) ? 1 : 0;
          if (sa !== sb) return sa - sb;
          if (ha.racha !== hb.racha) return ha.racha - hb.racha;
          return a.orden - b.orden;
        }).forEach(agregar);

      delTramo.filter(function (v) { return H[v.id].vistos === 0; })
        .sort(function (a, b) { return a.orden - b.orden; })
        .forEach(agregar);

      delTramo.filter(function (v) { return ids.indexOf(v.id) < 0; })
        .sort(function (a, b) {
          const ha = H[a.id], hb = H[b.id];
          const sa = esSabido(ha, R) ? 1 : 0, sb = esSabido(hb, R) ? 1 : 0;
          if (sa !== sb) return sa - sb;
          if (ha.descanso !== hb.descanso) return ha.descanso - hb.descanso;
          if (ha.racha !== hb.racha) return ha.racha - hb.racha;
          return a.orden - b.orden;
        }).forEach(agregar);

      return { cola: conVueltas(ids, R), modo: modo, grupo: null, tramo: tramo };
    }

    // Camino clásico (cuando tramoCerrado es false)
    const pendientes = verbos.filter(function (v) { return H[v.id].pendiente; });
    const nuevos = verbos.filter(function (v) { return H[v.id].vistos === 0; });
    const cupoNuevos = Math.min(nuevos.length,
      pendientes.length >= R.umbralPendientes ? R.nuevosSiHayPendientes : R.nuevosPorPartida);
    const repaso = verbos.filter(function (v) { return H[v.id].vistos > 0 && H[v.id].descanso === 0; })
      .sort(function (a, b) {
        const ha = H[a.id], hb = H[b.id];
        if (ha.pendiente !== hb.pendiente) return ha.pendiente ? -1 : 1;
        if (ha.racha !== hb.racha) return ha.racha - hb.racha;
        return a.orden - b.orden;
      });
    let iR = 0, iN = 0;
    for (let i = 0; i < total; i++) {
      const letra = R.patronCola.charAt(i % R.patronCola.length);
      const hayN = iN < cupoNuevos, hayR = iR < repaso.length;
      if (hayN && (letra === 'N' || !hayR)) ids.push(nuevos[iN++].id);
      else if (hayR) ids.push(repaso[iR++].id);
      else break;
    }
    if (!ids.length) {
      ids = verbos.filter(function (v) { return H[v.id].vistos > 0; }).sort(function (a, b) {
        const ha = H[a.id], hb = H[b.id];
        if (ha.descanso !== hb.descanso) return ha.descanso - hb.descanso;
        if (ha.racha !== hb.racha) return ha.racha - hb.racha;
        return a.orden - b.orden;
      }).map(function (v) { return v.id; });
    }
    return { cola: conVueltas(ids, R), modo: modo, grupo: null, tramo: tramoActual(op.historial, R, verbos) };
  }

  // ───── La partida ─────
  function crearPartida(op) {
    op = op || {};
    const R = op.reglas || VJ.REGLAS;
    const X = op.extras || VJ.EXTRAS;
    const verbos = op.verbos || VJ.VERBOS;
    const grupos = op.grupos || VJ.GRUPOS || [];
    const historial = op.historial || {};
    const semilla = op.semilla == null ? 1 : op.semilla;
    const azar = crearAzar(semilla);
    const azarExtra = crearAzar((Number(semilla) || 0) + 7919);   // dado aparte para las estrellas

    const porId = {};
    verbos.forEach(function (v) { porId[v.id] = v; });
    const grupoPorId = {};
    grupos.forEach(function (g) { grupoPorId[g.id] = g; });

    const armado = armarCola({
      verbos: verbos,
      reglas: R,
      historial: historial,
      modo: op.modo,
      grupo: op.grupo,
      tramo: op.tramo,
      opciones: op
    });
    const cola = armado.cola;           // cola[0] es el turno en curso

    // Verbos regulares infiltrados (tercera etapa): turnos extra en sitios al azar, nunca el primero ni dos seguidos.
    // Usan su propio dado: con regularesPorPartida en 0 la partida sale idéntica a como era sin ellos.
    const esRegular = {};
    verbos.forEach(function (v) { if (v && (v.esRegular || v.grupo === 'regulares')) esRegular[v.id] = true; });
    const azarOrden = crearAzar((Number(semilla) || 0) + 27183);   // dado aparte para el orden de las filas y el cierre de atajos
    let infiltrados = 0;
    (function () {
      const regulares = (op.regulares || VJ.REGULARES || []).filter(function (v) { return v && v.id && !porId[v.id]; });
      const cuantos = Math.min(R.regularesPorPartida || 0, regulares.length);
      if (!cuantos || !cola.length) return;
      const dado = crearAzar((Number(semilla) || 0) + 31337);
      const elegidos = barajar(regulares, dado).slice(0, cuantos);
      if (VJ.GRUPO_REGULARES) grupoPorId[VJ.GRUPO_REGULARES.id] = VJ.GRUPO_REGULARES;
      elegidos.forEach(function (v) {
        porId[v.id] = v; esRegular[v.id] = true;
        const sitios = [];
        for (let i = 1; i <= cola.length; i++) if (!esRegular[cola[i - 1]] && !esRegular[cola[i]]) sitios.push(i);
        if (!sitios.length) return;
        cola.splice(sitios[Math.floor(dado() * sitios.length)], 0, v.id);
        infiltrados++;
      });
    })();
    const colaInicial = cola.slice();

    // Lo que pasa con cada verbo en esta partida
    const datos = {};
    const salieron = [];                // ids en el orden en que salieron
    function datosDe(id) {
      if (!datos[id]) {
        const h = leerHistorial(historial, id);
        datos[id] = {
          turnos: 0, limpios: 0, errores: [], reencolados: 0,
          elegido: { pasado: h.falsoPasado, participio: h.falsoParticipio, significado: '', base: '' },
          elegidoAhora: { pasado: '', participio: '', significado: '', base: '' },
          veces: { pasado: {}, participio: {}, significado: {}, base: {} }
        };
      }
      return datos[id];
    }

    // Variables internas
    let lectura = R.lecturaInicial;
    let reposo = R.monstruoInicio;      // distancia de reposo del monstruo ("b" en DISENO)
    let espera = R.arranque;            // segundos de calle vacía antes del siguiente objeto
    let etapa = 'turno';                // 'turno' | 'recoger' | 'pasado' | 'participio' | 'significado' | 'base'
    let objeto = null;                  // lo único que viene por la calle
    let turno = null;                   // { id, errores, contado, orden, filaActual, ocultarSignificadoLibro }
    let bolsa = [];
    let ultimoCarril = -1, seguidas = 0;
    let turnosCumplidos = 0, rellenos = 0, turnosJugados = 0, libroAlCarril = false;
    let filasAcertadas = 0, filasTotal = 0;
    const anunciados = {};
    const estrellas = [];               // estrellas en la calle: { z, carril }, la más cercana primero
    let carrilEstrella = 1, enTramo = 0, mejorRacha = 0;

    const estado = {
      fase: cola.length ? 'corriendo' : 'ganada',
      tiempo: 0, distancia: 0,
      carril: 1, x: 1,
      monstruo: R.monstruoInicio, monstruoTam: R.monstruoTamMax,
      peligro: 0, peligroFilas: 0,
      comodin: Math.min(R.comodinInicial, R.comodinMaximo), carga: 0,
      lectura: lectura, velocidad: R.distanciaVista / lectura,
      verbo: null, pide: 'recoger',
      ocultarSignificadoLibro: false,
      turnoActual: null,
      cadena: null,                     // { base, es, pasado, participio, falloPasado, falloParticipio, cerrado, limpio }
      objetos: [],
      aprendidos: [], fallos: [], racha: 0,
      turnosTotal: cola.length, turnosCumplidos: 0, cola: cola,
      pista: null,                      // { texto, base, es, pide, correcta, elegida, quedan }
      anuncio: null,                    // { grupo, quedan } mientras dura el cartel de un grupo
      tropiezo: 0,                      // segundos que le quedan al traspié (solo dibujo)
      puntos: 0, multiplicador: 1,      // añadidos: no deciden nada del aprendizaje
      estrellas: estrellas,             // estrellas que vienen por la calle: { z, carril }
      estrellasRecogidas: 0,
      filasAcertadas: 0, filasTotal: 0,
      modo: armado.modo, grupo: armado.grupo, tramo: armado.tramo, semilla: semilla
    };

    function evento(tipo, verbo, pide, elegida, correcta) {
      return { tipo: tipo, verbo: verbo || null, pide: pide || null,
        elegida: elegida === undefined ? null : elegida, correcta: correcta === undefined ? null : correcta };
    }

    function formaCorrecta(v, pide) {
      if (pide === 'pasado') return v.pasado;
      if (pide === 'participio') return v.participio;
      if (pide === 'significado') return v.esCorto || v.es;
      if (pide === 'base') return v.base;
      return v.base;
    }

    function explicacionErrorCalle(v, pide) {
      if (pide === 'recoger') return TEXTO_RECOGER;
      if (pide === 'significado') return v.base.toUpperCase() + ' significa "' + (v.esCorto || v.es) + '". ' + v.pista;
      if (pide === 'base') return "Con DID / DIDN'T el verbo vuelve a su forma base: " + v.base + ' (no ' + v.pasado + ').';
      return v.pista;
    }

    function sincronizar() {
      estado.lectura = lectura;
      estado.velocidad = R.distanciaVista / lectura;
      estado.peligro = estado.peligroFilas * lectura;
      estado.turnosCumplidos = turnosCumplidos;
      estado.turnosTotal = turnosCumplidos + cola.length;
      const avance = estado.turnosTotal > 0 ? turnosCumplidos / estado.turnosTotal : 1;
      estado.monstruoTam = R.monstruoTamMax - (R.monstruoTamMax - R.monstruoTamMin) * avance;
      estado.filasAcertadas = filasAcertadas;
      estado.filasTotal = filasTotal;
      estado.objetos = objeto ? [objeto] : [];
      estado.multiplicador = multiplicador();
      if (estado.racha > mejorRacha) mejorRacha = estado.racha;
    }

    // ───── Estrellas (añadido): solo en tramos sin letreros, y todas llegan antes de lo siguiente ─────
    function multiplicador() { return Math.min(X.multiplicadorMax, 1 + Math.floor(estado.racha / X.rachaPorNivel)); }
    function sembrar(segundos) {
      const vel = R.distanciaVista / lectura;
      for (let t = X.estrellaPrimera; t <= segundos - X.estrellaMargen + 1e-9; t += X.estrellaCada) {
        if (enTramo >= X.estrellasPorTramo) {
          enTramo = 0;
          if (carrilEstrella === 0) carrilEstrella = 1;
          else if (carrilEstrella === CARRILES - 1) carrilEstrella = CARRILES - 2;
          else carrilEstrella += azarExtra() < 0.5 ? -1 : 1;
        }
        enTramo++;
        estrellas.push({ z: vel * t, carril: carrilEstrella });
      }
    }
    function pasarEstrellas(eventos) {
      while (estrellas.length && estrellas[0].z <= 1e-9) {
        const s = estrellas.shift();
        if (s.carril === estado.carril) {
          const puntos = X.puntosEstrella * multiplicador();
          estado.puntos += puntos;
          estado.estrellasRecogidas++;
          const e = evento('estrella');
          e.carril = s.carril; e.puntos = puntos;
          eventos.push(e);
        }
      }
    }

    // ───── Cómo se arma una fila (DISENO 7 + Cuarta etapa: 4 valores de pide) ─────
    function carrilDeLaCorrecta() {
      if (!bolsa.length) bolsa = barajar(R.bolsaCarriles, azar);
      let i = 0;
      if (seguidas >= R.maxMismoCarrilSeguido) {
        i = bolsa.findIndex(function (c) { return c !== ultimoCarril; });
        if (i < 0) {                      // en esta bolsa solo queda el mismo carril: se abre otra
          bolsa = bolsa.concat(barajar(R.bolsaCarriles, azar));
          i = bolsa.findIndex(function (c) { return c !== ultimoCarril; });
          if (i < 0) i = 0;
        }
      }
      const carril = bolsa.splice(i, 1)[0];
      if (carril === ultimoCarril) seguidas++; else { ultimoCarril = carril; seguidas = 1; }
      return carril;
    }

    function elegirFalsos(v, pide, nVisto) {
      const correcta = formaCorrecta(v, pide);
      const d = datosDe(v.id);
      const veces = d.veces[pide] = d.veces[pide] || {};

      if (pide === 'significado') {
        const baseEs = (v.falsosEs && v.falsosEs.slice(0, 2)) || ['hacer', 'tener'];
        const elegidosEs = [];
        baseEs.concat(['hacer', 'tener', 'ir', 'decir']).forEach(function (f) {
          if (f && f !== correcta && elegidosEs.indexOf(f) < 0 && elegidosEs.length < R.falsosPorFila) elegidosEs.push(f);
        });
        elegidosEs.forEach(function (f) { veces[f] = (veces[f] || 0) + 1; });
        return elegidosEs;
      }

      if (pide === 'base') {
        const f1 = v.pasado !== correcta ? v.pasado : ((v.falsosPasado && v.falsosPasado[0]) || (v.base + 'ed'));
        const f2 = (v.participio !== v.pasado && v.participio !== correcta)
          ? v.participio
          : ((v.falsosPasado || []).find(function (f) { return !/ed$/.test(f) && f !== v.base && f !== f1; }) || (v.falsosPasado && v.falsosPasado[0]));
        const elegidosBase = [];
        [f1, f2].concat(v.falsosPasado || [], v.falsosParticipio || [], [v.base + 'ed', v.base + 's']).forEach(function (f) {
          if (f && f !== correcta && elegidosBase.indexOf(f) < 0 && elegidosBase.length < R.falsosPorFila) elegidosBase.push(f);
        });
        elegidosBase.forEach(function (f) { veces[f] = (veces[f] || 0) + 1; });
        return elegidosBase;
      }

      const lista = [];
      (pide === 'pasado' ? v.falsosPasado : v.falsosParticipio).forEach(function (f) {
        if (f !== correcta && lista.indexOf(f) < 0) lista.push(f);
      });
      // El falso que el jugador ya eligió va siempre; si no eligió ninguno, va el más común.
      let fijo = d.elegido[pide];
      if (lista.indexOf(fijo) < 0) fijo = lista[0];
      const resto = lista.filter(function (f) { return f !== fijo; }).sort(function (a, b) {
        const va = veces[a] || 0, vb = veces[b] || 0;
        if (va !== vb) return va - vb;
        return lista.indexOf(a) - lista.indexOf(b);
      });
      const elegidos = [fijo].concat(resto).slice(0, R.falsosPorFila);

      // En verbos de 3 formas distintas, en la 2.ª fila del turno (nVisto >= 99), si uno de los 2 falsos
      // termina en 'ed' y verbo.base no está entre los falsos, reemplaza ese falso por verbo.base la mitad de las veces.
      if (v.pasado !== v.participio && (nVisto || 0) >= 99 && v.base !== correcta && elegidos.indexOf(v.base) < 0) {
        const idxEd = elegidos.findIndex(function (f) { return /ed$/.test(f) && f !== d.elegido[pide]; });
        if (idxEd >= 0 && azarOrden() < 0.5) {
          elegidos[idxEd] = v.base;
        }
      }

      elegidos.forEach(function (f) { veces[f] = (veces[f] || 0) + 1; });
      return elegidos;
    }

    function armarFila(v, pide, nVisto) {
      const correcta = carrilDeLaCorrecta();
      const palabraCorrecta = formaCorrecta(v, pide);
      const falsos = barajar(elegirFalsos(v, pide, nVisto), azar);
      const opciones = [];
      let k = 0;
      for (let c = 0; c < CARRILES; c++) opciones.push(c === correcta ? palabraCorrecta : (falsos[k++] || ''));
      return {
        tipo: 'fila',
        z: R.distanciaVista,
        verbo: v,
        pide: pide,
        etiqueta: pide === 'base' ? "didn't ___" : (pide === 'significado' ? 'significado' : pide),
        opciones: opciones,
        correcta: correcta,
        palabraCorrecta: palabraCorrecta
      };
    }

    function crearVerbo(v) {
      // En un carril distinto del que ocupa el jugador: nadie lo recoge sin moverse.
      const otros = [];
      for (let c = 0; c < CARRILES; c++) if (c !== estado.carril) otros.push(c);
      let carril = otros[Math.floor(azar() * otros.length)];
      // Segunda oportunidad: sale donde está el jugador, y sin estrellas (para que esquivar el libro no dé puntos).
      if (libroAlCarril) { carril = estado.carril; libroAlCarril = false; }
      else sembrar(lectura * R.fraccionRecoger * X.estrellasConVerbo);
      return {
        tipo: 'verbo',
        z: R.distanciaVista * R.fraccionRecoger,
        verbo: v,
        pide: 'recoger',
        carril: carril,
        correcta: carril,
        ocultarSignificadoLibro: !!(turno && turno.ocultarSignificadoLibro)
      };
    }

    // ───── Error, peligro y captura (DISENO 4) ─────
    function acierto(v, pide, elegida, eventos) {
      if (estado.peligroFilas > 0) estado.peligroFilas--;
      estado.racha++;
      filasAcertadas++;
      estado.puntos += X.puntosAcierto * multiplicador();
      reposo = limitar(reposo - R.monstruoPorAcierto, R.monstruoMin, R.monstruoMax);
      eventos.push(evento('acierto', v, pide, elegida, elegida));
      if (estado.carga < R.aciertosParaComodin) estado.carga++;
      if (estado.carga >= R.aciertosParaComodin && estado.comodin < R.comodinMaximo) {
        estado.comodin++;
        estado.carga = 0;
        eventos.push(evento('comodin', v, pide, elegida, elegida));
      }
    }

    function error(v, pide, elegida, eventos) {
      const correcta = formaCorrecta(v, pide);
      const textoExplicacion = explicacionErrorCalle(v, pide);
      estado.racha = 0;
      estado.carga = 0;
      lectura = Math.min(R.lecturaInicial, lectura + R.lecturaSubePorError);
      reposo = limitar(reposo + R.monstruoPorError, R.monstruoMin, R.monstruoMax);
      estado.fallos.push({ id: v.id, pide: pide, elegida: elegida });
      estado.tropiezo = R.tropiezoSegundos;
      estado.pista = {
        texto: textoExplicacion,
        explicacion: textoExplicacion,
        base: v.base, es: v.es, esCorto: v.esCorto || v.es, pide: pide, correcta: correcta, elegida: elegida,
        quedan: R.pistaSegundos
      };
      const evErr = evento('error', v, pide, elegida, correcta);
      evErr.explicacion = textoExplicacion;
      evErr.pista = textoExplicacion;
      eventos.push(evErr);
      if (estado.peligroFilas === 0) {
        estado.peligroFilas = R.peligroFilas;                 // tropiezo
      } else if (estado.comodin > 0) {
        estado.comodin--;                                     // el profesor lo salva
        estado.peligroFilas = R.peligroFilas;
        eventos.push(evento('salvado', v, pide, elegida, correcta));
      } else {
        estado.fase = 'perdida';                              // captura
        estado.monstruo = 1;
        objeto = null;
        estrellas.length = 0;
        eventos.push(evento('captura', v, pide, elegida, correcta));
        return;
      }
      espera = R.respiroTrasError;
      sembrar(espera);
    }

    // ───── El verbo fallado vuelve (DISENO 6) ─────
    function sitioPara(id) {
      const desde = Math.min(R.repasoTras, cola.length);
      function sirve(p) { return p >= 1 && p <= cola.length && cola[p - 1] !== id && cola[p] !== id; }
      for (let p = desde; p <= cola.length; p++) if (sirve(p)) return p;
      for (let p = desde - 1; p >= 1; p--) if (sirve(p)) return p;
      return -1;
    }

    function reencolar(id) {
      let pos = sitioPara(id);
      if (pos < 0) {
        // Solo queda este verbo: antes va un relleno, el que lleva más tiempo aprendido.
        const i = estado.aprendidos.findIndex(function (a) { return a !== id; });
        if (i >= 0) {
          const relleno = estado.aprendidos.splice(i, 1)[0];
          if (cola.length && cola[0] === id) cola.unshift(relleno); else cola.push(relleno);
          rellenos++;
        }
        pos = sitioPara(id);
        if (pos < 0) pos = cola.length;
      }
      cola.splice(pos, 0, id);
    }

    function cerrarTurno(v, ultimaFilaBien, eventos) {
      const id = cola.shift();
      const d = datosDe(id);
      const limpio = turno.errores === 0;
      estado.cadena.pasado = v.pasado;
      estado.cadena.participio = v.participio;
      estado.cadena.cerrado = true;
      estado.cadena.limpio = limpio;
      turno = null;
      estado.turnoActual = null;
      estado.ocultarSignificadoLibro = false;
      etapa = 'turno';
      if (limpio) {
        d.limpios++;
        turnosCumplidos++;
        reposo = limitar(reposo - R.monstruoPorAprendido, R.monstruoMin, R.monstruoMax);
        lectura = Math.max(R.lecturaMinima, lectura - R.lecturaBajaPorTurno);
        if (cola.indexOf(id) < 0) {
          if (estado.aprendidos.indexOf(id) < 0) estado.aprendidos.push(id);
          estado.puntos += X.puntosAprendido;
          eventos.push(evento('aprendido', v, 'participio', v.participio, v.participio));
        }
      } else {
        const i = estado.aprendidos.indexOf(id);
        if (i >= 0) estado.aprendidos.splice(i, 1);
        // un mismo verbo no vuelve más de maxReencolar veces: queda pendiente para otra partida
        // (un regular infiltrado no vuelve: su error ya castigó como cualquier otro)
        if (!esRegular[id] && (R.maxReencolar == null || d.reencolados < R.maxReencolar)) { d.reencolados++; reencolar(id); }
      }
      turnosJugados++;
      if (R.turnosMaximos && turnosJugados >= R.turnosMaximos + infiltrados) cola.length = 0;   // tope: la partida no dura para siempre
      if (!cola.length) {
        estado.fase = 'ganada';
        estado.puntos += X.puntosVictoria;
        eventos.push(evento('victoria', v, 'participio', v.participio, v.participio));
        return;
      }
      // Si la última fila se acertó no hubo respiro: se deja la pausa para ver la cadena completa.
      if (ultimaFilaBien) { espera = R.pausaAprendido; sembrar(espera); }
    }

    // ───── Sucesos ─────
    // El objeto llegó al estudiante: se mira el carril.
    var faltasLibro = 0;   // veces seguidas que el libro pasó sin recogerse
    function resolver(eventos) {
      const o = objeto;
      const v = o.verbo;
      objeto = null;
      espera = 0;
      if (o.tipo === 'verbo') {
        if (estado.carril === o.carril || faltasLibro >= 1) {
          // Segunda vez que el libro pasa de largo: el profesor se lo entrega (sin puntos).
          // Sin esto, quien esquiva el libro siempre jugaba sin fin y sumaba estrellas.
          const loRecogio = estado.carril === o.carril;
          if (loRecogio) estado.puntos += X.puntosRecoger;
          faltasLibro = 0;
          const er = evento('recogio', v, 'recoger', v.base, v.base);
          er.entregado = !loRecogio;          // true: no lo recogió, se lo alcanzó el profesor
          eventos.push(er);
          etapa = turno.orden[0];
          estado.pide = turno.orden[0];
        } else {
          // No recoger el libro ya no es un error: vuelve a salir, esta vez en el carril del jugador.
          libroAlCarril = true;
          faltasLibro++;
          estado.pista = { texto: TEXTO_RECOGER, base: v.base, es: v.es, pide: 'recoger', correcta: v.base, elegida: null, quedan: R.pistaSegundos };
          eventos.push(evento('sinrecoger', v, 'recoger', null, v.base));
        }
        return;
      }
      const pide = o.pide;
      const d = datosDe(v.id);
      const elegida = o.opciones[estado.carril];
      const bien = estado.carril === o.correcta;
      if (!turno.contado) { turno.contado = true; d.turnos++; if (salieron.indexOf(v.id) < 0) salieron.push(v.id); }
      filasTotal++;
      if (pide === 'pasado') estado.cadena.pasado = v.pasado;
      else if (pide === 'participio') estado.cadena.participio = v.participio;
      else if (pide === 'significado') estado.cadena.significado = v.esCorto || v.es;
      else if (pide === 'base') estado.cadena.baseConfirmada = v.base;
      estado.cadena.ultima = pide; estado.cadena.ultimaBien = bien;
      if (bien) {
        acierto(v, pide, elegida, eventos);
      } else {
        turno.errores++;
        d.errores.push({ pide: pide, elegida: elegida });
        d.elegido[pide] = elegida;
        d.elegidoAhora[pide] = elegida;
        if (pide === 'pasado' || pide === 'base') estado.cadena.falloPasado = true;
        else estado.cadena.falloParticipio = true;
        error(v, pide, elegida, eventos);
        if (estado.fase !== 'corriendo') return;
      }
      if (turno.filaActual === 0) {
        turno.filaActual = 1;
        etapa = turno.orden[1];
        estado.pide = turno.orden[1];
      } else {
        cerrarTurno(v, bien, eventos);
      }
    }

    // La calle está vacía y se acabó la espera: sale lo que sigue.
    function siguiente(eventos) {
      if (etapa === 'turno') {
        if (!cola.length) { estado.fase = 'ganada'; eventos.push(evento('victoria')); return; }
        const v = porId[cola[0]];
        let ordenFilas = ['pasado', 'participio'];
        if (R.filaSignificadoEnIguales && v.pasado === v.participio) {
          // Cuando pasado === participio (30 irregulares iguales + 12 regulares), nunca se pregunta dos veces la misma palabra en inglés.
          const formaIngles = azarOrden() < 0.5 ? 'pasado' : 'participio';
          const otraFila = (v.base === v.pasado || azarOrden() < 0.5) ? 'significado' : 'base';
          ordenFilas = azarOrden() < 0.5 ? [formaIngles, otraFila] : [otraFila, formaIngles];
        } else {
          // En verbos de 3 formas distintas, se sortea el orden tanto en nuevos como en vistos
          if ((R.ordenAlAzarEnRepaso || 0) > 0 && azarOrden() < R.ordenAlAzarEnRepaso) {
            ordenFilas = ['participio', 'pasado'];
          }
          // Y en una fracción de turnos la 2.ª fila pide 'base' (didn't ___) o 'significado' para cerrar el atajo de memoria
          if ((R.ordenAlRevesEnRepaso || 0) > 0 && azarOrden() < R.ordenAlRevesEnRepaso) {
            ordenFilas[1] = (v.base === v.participio || azarOrden() < 0.5) ? 'significado' : 'base';
          }
        }
        const ocultarEs = ordenFilas.indexOf('significado') >= 0;
        turno = {
          id: v.id,
          verbo: v,
          errores: 0,
          contado: false,
          orden: ordenFilas,
          ordenFilas: ordenFilas,
          filaActual: 0,
          ocultarSignificadoLibro: ocultarEs
        };
        datosDe(v.id);
        estado.verbo = v;
        estado.pide = 'recoger';
        estado.ocultarSignificadoLibro = ocultarEs;
        estado.turnoActual = turno;
        estado.cadena = {
          base: v.base,
          es: v.es,
          esCorto: v.esCorto || v.es,
          ocultarSignificadoLibro: ocultarEs,
          pasado: null,
          participio: null,
          falloPasado: false,
          falloParticipio: false,
          cerrado: false,
          limpio: null
        };
        etapa = 'recoger';
        if (!anunciados[v.grupo] && !esRegular[v.id]) {      // el regular no se anuncia: que el estudiante lo decida
          anunciados[v.grupo] = true;
          const g = grupoPorId[v.grupo] || { id: v.grupo, nombre: v.grupo, ejemplo: '', explicacion: '' };
          estado.anuncio = { grupo: g, quedan: R.anuncioGrupo };
          espera = R.anuncioGrupo;
          sembrar(espera);
          const e = evento('grupo', v, 'recoger', null, null);
          e.grupo = g;
          eventos.push(e);
          return;
        }
      }
      const v = estado.verbo;
      if (etapa === 'recoger') {
        objeto = crearVerbo(v);
      } else {
        const nVisto = turno && turno.filaActual >= 1 ? 99 : leerHistorial(historial, v.id).vistos;
        objeto = armarFila(v, etapa, nVisto);
      }
    }

    // Avanza p segundos sin que pase nada por el camino.
    function avanzar(p) {
      const vel = R.distanciaVista / lectura;
      estado.tiempo += p;
      estado.distancia += vel * p;
      if (objeto) objeto.z -= vel * p; else espera -= p;
      for (let i = 0; i < estrellas.length; i++) estrellas[i].z -= vel * p;
      // el estudiante se desliza hacia su carril
      const dx = estado.carril - estado.x;
      const pasoX = p / R.cambioCarril;
      estado.x = Math.abs(dx) <= pasoX ? estado.carril : estado.x + (dx > 0 ? pasoX : -pasoX);
      // el monstruo va hacia su sitio sin saltar
      const sitio = estado.peligroFilas > 0 ? R.monstruoEnPeligro : reposo;
      const dm = sitio - estado.monstruo;
      const pasoM = R.monstruoVelocidad * p;
      estado.monstruo = Math.abs(dm) <= pasoM ? sitio : estado.monstruo + (dm > 0 ? pasoM : -pasoM);
      if (estado.pista) { estado.pista.quedan -= p; if (estado.pista.quedan <= 0) estado.pista = null; }
      if (estado.anuncio) { estado.anuncio.quedan -= p; if (estado.anuncio.quedan <= 0) estado.anuncio = null; }
      if (estado.tropiezo > 0) estado.tropiezo = Math.max(0, estado.tropiezo - p);
    }

    // ───── Interfaz ─────
    function mover(direccion) {
      if (estado.fase !== 'corriendo') return estado.carril;
      const d = direccion < 0 ? -1 : (direccion > 0 ? 1 : 0);
      estado.carril = limitar(estado.carril + d, 0, CARRILES - 1);
      return estado.carril;
    }

    function irA(carril) {
      if (estado.fase !== 'corriendo') return estado.carril;
      estado.carril = limitar(Math.round(Number(carril) || 0), 0, CARRILES - 1);
      return estado.carril;
    }

    // Avanza dt segundos. El tiempo se parte en los instantes exactos en que pasa algo
    // (llega un objeto, se acaba una espera), así que da lo mismo llamarlo con 1/60 que con 1/30.
    function paso(dt) {
      const eventos = [];
      if (estado.fase !== 'corriendo') return eventos;
      let resto = Math.min(DT_MAX, Number(dt) || 0);
      if (resto < 0) resto = 0;
      for (let n = 0; n < MAX_SUCESOS && estado.fase === 'corriendo'; n++) {
        if (estrellas.length && estrellas[0].z <= 1e-9) { pasarEstrellas(eventos); continue; }
        if (objeto && objeto.z <= 0) { objeto.z = 0; resolver(eventos); continue; }
        if (!objeto && espera <= 0) { espera = 0; siguiente(eventos); continue; }
        if (resto <= 0) break;
        const vel = R.distanciaVista / lectura;
        const falta = objeto ? objeto.z / vel : espera;
        const faltaEstrella = estrellas.length ? estrellas[0].z / vel : Infinity;
        if (faltaEstrella < falta && faltaEstrella <= resto) {
          avanzar(faltaEstrella);
          resto -= faltaEstrella;
          estrellas[0].z = 0;
        } else if (falta <= resto) {
          avanzar(falta);
          resto -= falta;
          if (objeto) objeto.z = 0; else espera = 0;
        } else {
          avanzar(resto);
          resto = 0;
        }
      }
      sincronizar();
      return eventos;
    }

    function calcularDescanso(racha) {
      const d = R.descansos || [0, 1, 3];
      if (racha <= 0) return 0;
      if (racha === 1) return d[0] || 0;
      if (racha === 2) return d[1] != null ? d[1] : 1;
      if (racha >= (R.rachaSabido || 3)) return d[2] != null ? d[2] : 3;
      return racha >= (R.rachaParaEspaciar || 2) ? (d[Math.min(racha - (R.rachaParaEspaciar || 2), d.length - 1)] || 0) : 0;
    }

    function resumen() {
      const lista = salieron.map(function (id) {
        const v = porId[id], d = datos[id], h = leerHistorial(historial, id);
        const regular = !!(esRegular[id] || v.esRegular || v.grupo === 'regulares');
        const fallo = d.errores.length > 0;
        const aprendido = estado.aprendidos.indexOf(id) >= 0;
        const racha = fallo ? 0 : h.racha + 1;
        const sabido = racha >= (R.rachaSabido || 3) && (!R.requiereProduccionParaSabido || (h.produccionesLimpias || 0) >= 1 || h.sabido === true);
        return {
          id: id, base: v.base, pasado: v.pasado, participio: v.participio, es: v.es, esCorto: v.esCorto || v.es, grupo: v.grupo,
          turnos: d.turnos, limpios: d.limpios,
          errores: d.errores.map(function (e) { return { pide: e.pide, elegida: e.elegida }; }),
          resultado: !fallo ? 'limpio' : (aprendido ? 'repetido' : 'pendiente'),
          aprendido: aprendido,
          sabido: sabido,
          regular: regular,
          pista: v.pista
        };
      });

      const costaron = [];
      estado.fallos.forEach(function (f) {
        if (f.pide === 'recoger') return;
        const v = porId[f.id];
        costaron.push({
          id: v.id,
          base: v.base,
          es: v.es,
          pide: f.pide,
          elegida: f.elegida,
          correcta: formaCorrecta(v, f.pide),
          pista: explicacionErrorCalle(v, f.pide)
        });
      });

      // Historial para guardar (no cambia el que se recibió)
      const nuevo = {};
      Object.keys(historial).forEach(function (id) {
        const h = leerHistorial(historial, id);
        if (salieron.indexOf(id) < 0 && h.descanso > 0) h.descanso--;
        nuevo[id] = h;
      });
      salieron.forEach(function (id) {
        const v = porId[id];
        const regular = !!(esRegular[id] || (v && (v.esRegular || v.grupo === 'regulares')));
        const d = datos[id], h = leerHistorial(historial, id);
        const fallo = d.errores.length > 0;
        h.vistos += d.turnos;
        h.aciertos += d.limpios;
        h.fallos += d.errores.length;
        h.racha = fallo ? 0 : h.racha + 1;
        h.pendiente = regular ? false : fallo;
        if (d.elegidoAhora.pasado) h.falsoPasado = d.elegidoAhora.pasado;
        if (d.elegidoAhora.participio) h.falsoParticipio = d.elegidoAhora.participio;
        h.descanso = calcularDescanso(h.racha);
        h.sabido = h.racha >= (R.rachaSabido || 3) && (!R.requiereProduccionParaSabido || (h.produccionesLimpias || 0) >= 1 || (!fallo && h.sabido === true));
        nuevo[id] = h;
      });

      const distintos = [];
      colaInicial.concat(salieron).forEach(function (id) { if (distintos.indexOf(id) < 0) distintos.push(id); });

      // Los regulares infiltrados NO se cuentan en pendientes del resumen final para no ensuciar el cartel de victoria limpia de los 10 verbos del tramo.
      const pendientes = lista.filter(function (x) { return x.resultado === 'pendiente' && !x.regular; }).length;
      const regularesFallados = lista.filter(function (x) { return x.resultado === 'pendiente' && x.regular; }).length;
      return {
        pendientes: pendientes, regularesFallados: regularesFallados,
        limpia: estado.fase === 'ganada' && pendientes === 0 && regularesFallados === 0,
        fase: estado.fase, ganada: estado.fase === 'ganada', tiempo: estado.tiempo,
        modo: estado.modo, grupo: estado.grupo, tramo: estado.tramo, semilla: semilla,
        verbos: lista, costaron: costaron,
        aprendidos: estado.aprendidos.length, verbosTotal: distintos.length,
        turnosCumplidos: turnosCumplidos, turnosTotal: turnosCumplidos + cola.length, rellenos: rellenos,
        filasAcertadas: filasAcertadas, filasTotal: filasTotal,
        puntos: estado.puntos, estrellas: estado.estrellasRecogidas, mejorRacha: mejorRacha,
        sinRecoger: estado.fallos.filter(function (f) { return f.pide === 'recoger'; }).length,
        fallos: estado.fallos.map(function (f) { return { id: f.id, pide: f.pide, elegida: f.elegida }; }),
        historial: nuevo
      };
    }

    sembrar(espera);
    sincronizar();
    return { estado: estado, mover: mover, irA: irA, paso: paso, resumen: resumen, armarFila: armarFila };
  }

  // ───── Utilidades de revisión y producción con fichas ─────
  function explicacionOracion(o, v) {
    if (!o || !v) return '';
    if (o.forma === 'base') {
      return 'Con "' + (o.senal || "didn't") + '" ya está la marca de pasado: el verbo va en su forma base (' + v.base + ').';
    }
    if (o.forma === 'pasado') {
      return (o.senal || 'pasado') + ' → pasado: ' + v.pasado;
    }
    return (o.senal || 'have') + ' → participio: ' + v.participio;
  }

  function generarFichas(correcta, falsos, R, azar) {
    const totalLetras = Math.max(1, ((R && R.fichasLetrasTotal) || 8) - 1); // 7 letras únicas
    const unicas = [];
    function meter(palabra, cortarEnTope) {
      const s = String(palabra || '').toLowerCase();
      for (let i = 0; i < s.length; i++) {
        const ch = s[i];
        if (ch >= 'a' && ch <= 'z' && unicas.indexOf(ch) < 0) {
          if (cortarEnTope && unicas.length >= totalLetras) break;
          unicas.push(ch);
        }
      }
    }
    meter(correcta, false);
    if (Array.isArray(falsos)) {
      if (falsos[0]) meter(falsos[0], true);
      if (falsos[1]) meter(falsos[1], true);
    }
    const relleno = 'etaoinshrdlucm';
    for (let i = 0; i < relleno.length && unicas.length < totalLetras; i++) {
      if (unicas.indexOf(relleno[i]) < 0) unicas.push(relleno[i]);
    }
    return barajar(unicas.slice(0, totalLetras), azar);
  }

  // ───── La revisión en el puente: 3 moldes ('pasado', 'participio', 'base') y Caja de Fichas ('opciones' / 'fichas') ─────
  function crearRevision(op, cantidadArg, semillaArg, reglasArg, oracionesArg, verbosArg) {
    if (Array.isArray(op)) {
      op = {
        ids: op,
        cantidad: cantidadArg,
        semilla: semillaArg,
        reglas: reglasArg,
        oraciones: oracionesArg,
        verbos: verbosArg
      };
    } else {
      op = op || {};
    }
    const R = op.reglas || VJ.REGLAS || {};
    const verbos = op.verbos || VJ.VERBOS || [];
    const azar = crearAzar((Number(op.semilla == null ? 1 : op.semilla) || 0) + 104729);
    const porId = {};
    verbos.forEach(function (v) { porId[v.id] = v; });
    (op.regulares || VJ.REGULARES || []).forEach(function (v) { if (v && v.id && !porId[v.id]) porId[v.id] = v; });
    const fallados = op.fallados || [];
    const cantidad = Math.max(0, op.cantidad == null ? (R.revisionDeTramo || 6) : op.cantidad);
    let ids = (op.ids || op.verbosIds || verbos.map(function (v) { return v.id; })).filter(function (id) { return porId[id]; });

    const todasOraciones = op.oraciones || VJ.ORACIONES || [];
    const tieneBase = todasOraciones.some(function (o) { return o && o.forma === 'base'; });
    const formasValidas = { pasado: true, participio: true, base: true };
    const buenas = todasOraciones.filter(function (o) {
      return o && porId[o.verbo] && ids.indexOf(o.verbo) >= 0 && formasValidas[o.forma] &&
        typeof o.texto === 'string' && o.texto.indexOf('___') >= 0;
    });

    // Primero los verbos fallados; el resto, barajado
    ids = barajar(ids, azar).sort(function (a, b) { return (fallados.indexOf(b) >= 0 ? 1 : 0) - (fallados.indexOf(a) >= 0 ? 1 : 0); });

    // Variedad de los 3 moldes (pasado, participio, base) cuando cantidad >= 3 y existen oraciones de base
    const cupoBase = (cantidad >= 3 && tieneBase) ? Math.max(1, Math.floor(cantidad / 3)) : 0;
    const restoMoldes = Math.max(0, cantidad - cupoBase);
    const falta = {
      pasado: Math.ceil(restoMoldes / 2),
      participio: Math.floor(restoMoldes / 2),
      base: cupoBase
    };

    const usadas = [], elegidas = [];
    // Una de las oraciones es de un verbo regular (si hay)
    (function () {
      const regulares = (op.regulares || VJ.REGULARES || []).filter(function (v) { return v && v.id; });
      const cuantas = Math.min(R.revisionRegulares == null ? 1 : R.revisionRegulares, cantidad > 1 ? cantidad - 1 : 0);
      if (!regulares.length || cuantas <= 0) return;
      const idsReg = regulares.map(function (v) { return v.id; });
      const suyas = barajar(todasOraciones.filter(function (o) {
        return o && idsReg.indexOf(o.verbo) >= 0 && formasValidas[o.forma] && typeof o.texto === 'string' && o.texto.indexOf('___') >= 0;
      }), azar);
      const vistos = [];
      for (let i = 0; i < suyas.length && vistos.length < cuantas; i++) {
        const o = suyas[i];
        if (vistos.indexOf(o.verbo) >= 0 || (falta[o.forma] || 0) <= 0) continue;
        porId[o.verbo] = regulares[idsReg.indexOf(o.verbo)];
        vistos.push(o.verbo); usadas.push(o); elegidas.push(o); falta[o.forma]--;
      }
    })();

    function tomar(id, forma) {
      const candidatas = buenas.filter(function (x) { return x.verbo === id && x.forma === forma && usadas.indexOf(x) < 0; });
      if (!candidatas.length) return false;
      const o = candidatas[Math.floor(azar() * candidatas.length)];
      usadas.push(o); elegidas.push(o);
      if (falta[forma] > 0) falta[forma]--;
      return true;
    }

    const ordenMoldes = function () {
      return ['pasado', 'participio', 'base'].sort(function (a, b) { return (falta[b] || 0) - (falta[a] || 0); });
    };

    for (let vuelta = 0; vuelta < 4 && elegidas.length < cantidad; vuelta++) {
      for (let i = 0; i < ids.length && elegidas.length < cantidad; i++) {
        const moldes = ordenMoldes();
        let tomado = false;
        for (let m = 0; m < moldes.length; m++) {
          const f = moldes[m];
          if ((falta[f] > 0 || vuelta >= 2) && tomar(ids[i], f)) { tomado = true; break; }
        }
        if (tomado) continue;
      }
    }

    function armar(o, idx, totalInicial) {
      const v = porId[o.verbo];
      const correcta = o.forma === 'pasado' ? v.pasado : (o.forma === 'participio' ? v.participio : v.base);
      const falsos = [];
      const fuenteFalsos = (o.falsos || []).concat(
        o.forma === 'pasado' ? (v.falsosPasado || [])
          : (o.forma === 'participio' ? (v.falsosParticipio || []) : [v.pasado, v.participio].concat(v.falsosPasado || []))
      );
      fuenteFalsos.forEach(function (f) {
        if (f && f !== correcta && falsos.indexOf(f) < 0 && falsos.length < 2) falsos.push(f);
      });
      const opciones = barajar([correcta].concat(falsos), azar);
      const numFichas = Math.min(totalInicial, R.produccionPorRevision == null ? 2 : R.produccionPorRevision);
      const modoPregunta = idx >= totalInicial - numFichas ? 'fichas' : 'opciones';
      const fichas = generarFichas(correcta, falsos, R, azar);
      const exp = explicacionOracion(o, v);
      return {
        id: o.id,
        verbo: v,
        verboId: v.id,
        base: v.base,
        significado: v.esCorto || v.es,
        pista: v.pista,
        forma: o.forma,
        texto: o.texto,
        senal: o.senal || '',
        es: o.es || '',
        correcta: correcta,
        falsos: falsos,
        regular: v.grupo === 'regulares' || !!v.esRegular,
        completa: o.texto.replace('___', correcta),
        explicacion: exp,
        razon: exp,
        opciones: opciones,
        indiceCorrecta: opciones.indexOf(correcta),
        modo: modoPregunta,
        fichas: fichas,
        intentosFicha: 0,
        maxIntentosFicha: R.intentosProduccion || 2,
        esqueleto: null,
        letrasApagadas: [],
        armado: '',
        fallos: 0,
        veces: 0,
        repetida: false,
        intentos: 0,
        primera: null
      };
    }

    const barajadas = barajar(elegidas, azar);
    const total = barajadas.length;
    const cola = barajadas.map(function (o, idx) { return armar(o, idx, total); });
    const registro = cola.slice();
    const verbosProducidos = new Set();
    let indice = 0;
    let aciertosPrimera = 0;
    const tamMin = R.revisionMonstruoMin == null ? 0.25 : R.revisionMonstruoMin;

    const estado = {
      fase: total ? 'tapada' : 'terminada',
      total: total,
      numero: total ? 1 : 0,
      quedan: total,
      actual: cola[0] || null,
      elegida: null,
      acierto: null,
      razon: '',
      limpias: 0,
      falladas: 0,
      monstruoTam: 1,
      sello: false
    };

    function clonarParaRepetir(p) {
      const nuevasOpciones = barajar(p.opciones, azar);
      const nuevasFichas = barajar(p.fichas, azar);
      return {
        id: p.id,
        verbo: p.verbo,
        verboId: p.verboId,
        base: p.base,
        significado: p.significado,
        pista: p.pista,
        forma: p.forma,
        texto: p.texto,
        senal: p.senal,
        es: p.es,
        correcta: p.correcta,
        falsos: p.falsos.slice(),
        regular: p.regular,
        completa: p.completa,
        explicacion: p.explicacion,
        razon: p.razon,
        opciones: nuevasOpciones,
        indiceCorrecta: nuevasOpciones.indexOf(p.correcta),
        modo: p.modo,
        fichas: nuevasFichas,
        intentosFicha: 0,
        maxIntentosFicha: p.maxIntentosFicha,
        esqueleto: null,
        letrasApagadas: [],
        armado: '',
        fallos: 0,
        veces: (p.veces || 0) + 1,
        repetida: true,
        intentos: p.intentos,
        primera: p.primera,
        _origen: p._origen || p
      };
    }

    function sincronizarRevision() {
      estado.actual = cola[indice] || null;
      estado.quedan = Math.max(0, cola.length - indice);
      estado.limpias = aciertosPrimera;
      estado.monstruoTam = 1 - (1 - tamMin) * aciertosPrimera / Math.max(1, total);
      if (!estado.actual) {
        estado.fase = 'terminada';
        estado.sello = total > 0 && aciertosPrimera === total;
      } else {
        if (!estado.actual.repetida) {
          estado.numero = Math.min(total, indice + 1);
        }
      }
    }

    function ev(tipo) {
      const it = estado.actual;
      return {
        tipo: tipo,
        verbo: it ? it.verbo : null,
        pide: it ? it.forma : null,
        elegida: it && estado.elegida != null ? (typeof estado.elegida === 'number' ? it.opciones[estado.elegida] : estado.elegida) : null,
        correcta: it ? it.correcta : null,
        oracion: it
      };
    }

    // Evalúa una palabra escrita o armada con fichas y avanza indice++ (salvo en el 1.er fallo con fichas que da 2.º intento).
    function intentarTexto(palabra) {
      const p = cola[indice];
      if (!p || estado.fase === 'terminada') {
        return { correcta: false, terminada: true };
      }
      const limpio = String(palabra || '').trim().toLowerCase();
      const origen = p._origen || p;
      if (origen.primera == null) origen.primera = limpio;

      if (limpio === p.correcta.toLowerCase()) {
        p.intentos++;
        origen.intentos = p.intentos;
        if (p.fallos === 0 && p.veces === 0 && (p.intentosFicha || 0) === 0 && !p.repetida) {
          aciertosPrimera++;
        }
        if (p.modo === 'fichas') {
          verbosProducidos.add(p.verboId || (p.verbo && p.verbo.id) || p.verbo);
        }
        indice++;
        estado.elegida = null;
        estado.acierto = true;
        estado.razon = p.explicacion;
        sincronizarRevision();
        if (estado.actual) estado.fase = 'tapada';
        return {
          correcta: true,
          palabra: p.correcta,
          explicacion: p.explicacion,
          razon: p.razon,
          producida: p.modo === 'fichas',
          oracion: p
        };
      }

      // Si es pregunta de fichas en su 1.er intento y tiene derecho a 2.º intento: muestra esqueleto y apaga 2 letras trampa
      if (p.modo === 'fichas' && (p.intentosFicha || 0) === 0 && (p.maxIntentosFicha || 2) > 1) {
        p.intentosFicha = 1;
        p.esqueleto = p.correcta[0] + ' ' + Array(Math.max(1, p.correcta.length - 1)).fill('_').join(' ');
        p.letrasApagadas = p.fichas.filter(function (l) {
          return p.correcta.toLowerCase().indexOf(l) < 0;
        }).slice(0, 2);
        p.armado = '';
        return {
          correcta: false,
          segundoIntento: true,
          esqueleto: p.esqueleto,
          letrasApagadas: p.letrasApagadas,
          pista: p.pista,
          explicacion: p.explicacion,
          oracion: p
        };
      }

      // Fallo definitivo de esta aparición: incrementa fallos, reencola si corresponde y avanza indice++
      p.fallos = (p.fallos || 0) + 1;
      p.intentos++;
      origen.fallos = (origen.fallos || 0) + 1;
      origen.intentos = p.intentos;
      if (!origen.repetida && p.veces === 0) {
        estado.falladas++;
      }
      origen.repetida = true;
      const maxRepite = R.revisionRepite == null ? 1 : R.revisionRepite;
      if (p.veces < maxRepite) {
        cola.push(clonarParaRepetir(p));
      }
      indice++;
      estado.elegida = null;
      estado.acierto = false;
      estado.razon = p.explicacion;
      sincronizarRevision();
      if (estado.actual) estado.fase = 'tapada';
      return {
        correcta: false,
        elegida: limpio,
        era: p.correcta,
        explicacion: p.explicacion,
        razon: p.razon,
        pista: p.pista,
        oracion: p
      };
    }

    function intentar(indiceCarril) {
      const p = cola[indice];
      if (!p || estado.fase === 'terminada') return { correcta: false, terminada: true };
      if (typeof indiceCarril === 'string') {
        return intentarTexto(indiceCarril);
      }
      if (typeof indiceCarril === 'number') {
        if (p.modo === 'fichas') {
          const k = limitar(Math.round(indiceCarril) || 0, 0, Math.max(0, p.fichas.length - 1));
          const prueba = p.fichas.slice(k, k + 4).join('');
          return intentarTexto(prueba);
        }
        const c = limitar(Math.round(indiceCarril) || 0, 0, p.opciones.length - 1);
        return intentarTexto(p.opciones[c]);
      }
      return intentarTexto('');
    }

    function tocarFicha(letra) {
      const p = cola[indice];
      if (!p) return '';
      const s = String(letra || '');
      if (s === '⌫' || s.toLowerCase() === 'backspace') {
        p.armado = (p.armado || '').slice(0, -1);
      } else if (/^[a-zA-Z]$/.test(s) && (p.armado || '').length < (R.maxLetras || 9)) {
        const ch = s.toLowerCase();
        if ((p.letrasApagadas || []).indexOf(ch) < 0) {
          p.armado = (p.armado || '') + ch;
        }
      }
      return p.armado || '';
    }

    function borrarFicha() {
      return tocarFicha('⌫');
    }

    // Interfaz por fases ('tapada' -> 'destapada' -> 'resuelta' -> siguiente()) usada por juego.js y bots.js
    function destapar() {
      if (estado.fase === 'resuelta') return siguiente();
      if (estado.fase !== 'tapada') return [];
      estado.fase = 'destapada';
      return [ev('destapada')];
    }

    function elegir(i) {
      if (estado.fase !== 'destapada') return [];
      const it = cola[indice];
      if (!it) return [];
      const origen = it._origen || it;
      let palabraElegida = '';
      let idxElegido = null;

      if (typeof i === 'string' && isNaN(Number(i)) && i.trim().length > 1) {
        palabraElegida = i.trim().toLowerCase();
        idxElegido = it.opciones.indexOf(palabraElegida);
      } else {
        idxElegido = limitar(Math.round(Number(i) || 0), 0, it.opciones.length - 1);
        palabraElegida = it.opciones[idxElegido];
      }

      const esCorrecta = palabraElegida.toLowerCase() === it.correcta.toLowerCase();

      // En modo fichas, un primer intento fallido por texto activa el esqueleto sin pasar aún a 'resuelta'
      if (!esCorrecta && typeof i === 'string' && isNaN(Number(i)) && it.modo === 'fichas' && (it.intentosFicha || 0) === 0 && (it.maxIntentosFicha || 2) > 1) {
        it.intentosFicha = 1;
        it.esqueleto = it.correcta[0] + ' ' + Array(Math.max(1, it.correcta.length - 1)).fill('_').join(' ');
        it.letrasApagadas = it.fichas.filter(function (l) {
          return it.correcta.toLowerCase().indexOf(l) < 0;
        }).slice(0, 2);
        it.armado = '';
        const evSeg = ev('segundo_intento');
        evSeg.segundoIntento = true;
        evSeg.esqueleto = it.esqueleto;
        evSeg.letrasApagadas = it.letrasApagadas;
        return [evSeg];
      }

      estado.elegida = idxElegido != null && idxElegido >= 0 ? idxElegido : palabraElegida;
      estado.acierto = esCorrecta;
      estado.razon = it.razon;
      estado.fase = 'resuelta';
      it.intentos++;
      origen.intentos = it.intentos;
      if (origen.primera == null) origen.primera = palabraElegida;

      if (estado.acierto) {
        if (!it.repetida && it.fallos === 0 && it.veces === 0 && (it.intentosFicha || 0) === 0) {
          aciertosPrimera++;
          estado.limpias = aciertosPrimera;
          estado.monstruoTam = 1 - (1 - tamMin) * estado.limpias / Math.max(1, total);
        }
        if (it.modo === 'fichas') {
          verbosProducidos.add(it.verboId || (it.verbo && it.verbo.id) || it.verbo);
        }
        return [ev('acierto')];
      }

      it.fallos = (it.fallos || 0) + 1;
      origen.fallos = (origen.fallos || 0) + 1;
      if (!origen.repetida && it.veces === 0) estado.falladas++;
      origen.repetida = true;
      const maxRepite = R.revisionRepite == null ? 1 : R.revisionRepite;
      if (it.veces < maxRepite) {
        cola.push(clonarParaRepetir(it));
      }
      return [ev('error')];
    }

    function siguiente() {
      if (estado.fase !== 'resuelta') return [];
      indice++;
      estado.elegida = null;
      estado.acierto = null;
      estado.razon = '';
      sincronizarRevision();
      if (!estado.actual) {
        return [{ tipo: 'terminada', verbo: null, pide: null, elegida: null, correcta: null }];
      }
      estado.fase = 'tapada';
      return [ev('siguiente')];
    }

    function resumen() {
      const lista = registro.map(function (it) {
        return {
          id: it.id,
          verbo: it.verbo.id || it.verboId,
          base: it.verbo.base || it.base,
          forma: it.forma,
          modo: it.modo,
          texto: it.texto,
          completa: it.completa,
          es: it.es,
          senal: it.senal,
          correcta: it.correcta,
          elegida: it.primera,
          razon: it.razon,
          explicacion: it.explicacion,
          resultado: it.intentos === 0 ? 'sin jugar' : (it.repetida ? 'repetida' : 'limpia')
        };
      });
      const mal = [];
      lista.forEach(function (o) { if (o.resultado === 'repetida' && mal.indexOf(o.verbo) < 0) mal.push(o.verbo); });
      const term = estado.fase === 'terminada' || indice >= cola.length;
      return {
        terminada: term,
        total: total,
        limpias: aciertosPrimera,
        aciertosPrimera: aciertosPrimera,
        falladas: estado.falladas,
        sello: total > 0 && aciertosPrimera === total && term,
        producidos: Array.from(verbosProducidos),
        oraciones: lista,
        fallados: mal
      };
    }

    return {
      estado: estado,
      preguntas: cola,
      actual: function () { return cola[indice] || null; },
      indice: function () { return indice; },
      total: function () { return cola.length; },
      terminada: function () { return estado.fase === 'terminada' || indice >= cola.length; },
      intentar: intentar,
      intentarTexto: intentarTexto,
      tocarFicha: tocarFicha,
      borrarFicha: borrarFicha,
      destapar: destapar,
      elegir: elegir,
      siguiente: siguiente,
      resumen: resumen
    };
  }

  function aplicarRevisionAHistorial(historial, resRev, reglas) {
    const R = reglas || VJ.REGLAS || {};
    if (!historial || !resRev || !Array.isArray(resRev.producidos)) return historial;
    resRev.producidos.forEach(function (item) {
      const id = typeof item === 'object' && item ? item.id : String(item);
      if (!id) return;
      const h = leerHistorial(historial, id);
      h.produccionesLimpias = (h.produccionesLimpias || 0) + 1;
      h.sabido = (h.racha || 0) >= (R.rachaSabido || 3) && (!R.requiereProduccionParaSabido || h.produccionesLimpias >= 1);
      historial[id] = h;
    });
    return historial;
  }

  // ───── Termómetro Pre/Post (5 preguntas de un tramo: 2 pasado, 2 participio, 1 base) ─────
  function crearPrePost(semilla, tramo, tipo, reglas) {
    if (semilla && typeof semilla === 'object') {
      const op = semilla;
      semilla = op.semilla;
      tramo = op.tramo;
      tipo = op.tipo;
      reglas = op.reglas;
    }
    const R = reglas || VJ.REGLAS || {};
    const t = limitar(Math.round(Number(tramo) || 1), 1, 6);
    const clase = tipo === 'post' ? 'post' : 'pre';
    const semDerivada = ((Number(semilla) || 1) * 2654435761 + t * 9973 + (clase === 'post' ? 7919 : 131)) >>> 0;
    const azar = crearAzar(semDerivada || 1);

    const total = R.preguntasPrePost || 5;
    const vs = barajar(verbosDeTramo(t, VJ.VERBOS, R), azar);
    const oraciones = VJ.ORACIONES || [];
    const moldesBase = ['pasado', 'pasado', 'participio', 'participio', 'base'];
    const moldes = [];
    for (let i = 0; i < total; i++) moldes.push(moldesBase[i % moldesBase.length]);

    const preguntasSinBarajar = [];
    const usadas = [];
    for (let i = 0; i < total && vs.length; i++) {
      const v = vs[i % vs.length];
      const forma = moldes[i];
      let o = oraciones.find(function (x) { return x && x.verbo === v.id && x.forma === forma && usadas.indexOf(x.id) < 0; });
      if (!o) o = oraciones.find(function (x) { return x && x.verbo === v.id && usadas.indexOf(x.id) < 0; });
      if (!o) {
        o = {
          id: v.id + '-' + forma + '-pp',
          verbo: v.id,
          forma: forma,
          texto: forma === 'pasado' ? 'Yesterday I ___ it.' : (forma === 'participio' ? 'I have ___ it.' : "I didn't ___ it."),
          senal: forma === 'pasado' ? 'Yesterday' : (forma === 'participio' ? 'have' : "didn't"),
          es: v.es,
          falsos: forma === 'pasado' ? v.falsosPasado.slice(0, 2) : (forma === 'participio' ? v.falsosParticipio.slice(0, 2) : [v.pasado, v.falsosPasado[0]])
        };
      }
      usadas.push(o.id);
      const fReal = o.forma || forma;
      const correcta = fReal === 'pasado' ? v.pasado : (fReal === 'participio' ? v.participio : v.base);
      const falsos = [];
      (o.falsos || []).concat(fReal === 'pasado' ? v.falsosPasado : (fReal === 'participio' ? v.falsosParticipio : [v.pasado, v.participio])).forEach(function (f) {
        if (f && f !== correcta && falsos.indexOf(f) < 0 && falsos.length < 2) falsos.push(f);
      });
      const opciones = barajar([correcta].concat(falsos), azar);
      const fichas = generarFichas(correcta, falsos, R, azar);
      preguntasSinBarajar.push({
        id: o.id,
        verbo: v.id,
        verboObj: v,
        base: v.base,
        significado: v.esCorto || v.es,
        forma: fReal,
        texto: o.texto,
        senal: o.senal || '',
        es: o.es || '',
        correcta: correcta,
        opciones: opciones,
        indiceCorrecta: opciones.indexOf(correcta),
        fichas: fichas,
        respondida: false,
        paso: false,
        acierto: false,
        elegida: null
      });
    }

    const preguntas = barajar(preguntasSinBarajar, azar);
    let idx = 0;
    let aciertos = 0;
    const fallados = [];

    function responder(valor) {
      if (idx >= preguntas.length) return { terminada: true, correcta: false };
      const p = preguntas[idx];
      const textoVal = valor == null ? 'paso' : String(valor).trim();
      const esPaso = valor === 'paso' || valor === null || valor === undefined || textoVal === '' || textoVal.toLowerCase() === 'paso';

      if (esPaso) {
        p.respondida = true;
        p.paso = true;
        p.acierto = false;
        p.elegida = 'paso';
        if (fallados.indexOf(p.verbo) < 0) fallados.push(p.verbo);
      } else {
        let palabra = textoVal;
        if (typeof valor === 'number' && valor >= 0 && valor < p.opciones.length) {
          palabra = p.opciones[valor];
        } else if ((textoVal === '0' || textoVal === '1' || textoVal === '2') && p.opciones[Number(textoVal)]) {
          palabra = p.opciones[Number(textoVal)];
        }
        const bien = String(palabra).trim().toLowerCase() === p.correcta.toLowerCase();
        p.respondida = true;
        p.paso = false;
        p.acierto = bien;
        p.elegida = palabra;
        if (bien) {
          aciertos++;
        } else if (fallados.indexOf(p.verbo) < 0) {
          fallados.push(p.verbo);
        }
      }
      idx++;
      return {
        correcta: p.acierto,
        paso: p.paso,
        elegida: p.elegida,
        era: p.correcta,
        pregunta: p,
        terminada: idx >= preguntas.length
      };
    }

    function resumen() {
      return {
        tramo: t,
        tipo: clase,
        aciertos: aciertos,
        nota: aciertos,
        total: preguntas.length,
        fallados: fallados.slice(),
        preguntas: preguntas
      };
    }

    return {
      tramo: t,
      tipo: clase,
      preguntas: preguntas,
      actual: function () { return preguntas[idx] || null; },
      indice: function () { return idx; },
      total: function () { return preguntas.length; },
      terminada: function () { return idx >= preguntas.length; },
      responder: responder,
      resumen: resumen
    };
  }

  // ───── Código verificable de 6 caracteres para la Vista del Profesor (T P O V1 V2 C) ─────
  const PESOS_CONTROL = [3, 5, 7, 11, 15]; // todos coprimos con 26: cualquier error de 1 carácter cambia C
  function letraControlReporte(cinco) {
    let suma = 9;
    for (let i = 0; i < 5; i++) {
      suma = (suma + cinco.charCodeAt(i) * PESOS_CONTROL[i]) % 26;
    }
    return String.fromCharCode(65 + suma);
  }

  function codificarReporte(datos) {
    datos = datos || {};
    const tramo = limitar(Math.round(Number(datos.tramo) || 1), 1, 6);
    const pre = limitar(Math.round(Number(datos.pre) || 0), 0, 5);
    const post = limitar(Math.round(Number(datos.post) || 0), 0, 5);
    const vs = verbosDeTramo(tramo, VJ.VERBOS, VJ.REGLAS);
    const letras = [];
    (datos.fallados || datos.falladosIds || []).forEach(function (f) {
      let letra = null;
      if (typeof f === 'string' && /^[A-J]$/.test(f)) {
        letra = f;
      } else if (typeof f === 'number' && f >= 0 && f < 10) {
        letra = String.fromCharCode(65 + Math.floor(f));
      } else {
        const id = typeof f === 'object' && f ? f.id : String(f || '').toLowerCase();
        const idx = vs.findIndex(function (v) { return v.id === id; });
        if (idx >= 0 && idx < 10) letra = String.fromCharCode(65 + idx);
      }
      if (letra && letras.indexOf(letra) < 0 && letras.length < 2) letras.push(letra);
    });
    const v1 = letras[0] || '0';
    const v2 = letras[1] || '0';
    const cinco = String(tramo) + String(pre) + String(post) + v1 + v2;
    return cinco + letraControlReporte(cinco);
  }

  function decodificarReporte(codigo) {
    const limpio = String(codigo || '').toUpperCase().replace(/[\s\-]/g, '');
    if (limpio.length !== 6) return { valido: false };
    if (!/^[1-6][0-5][0-5][A-J0][A-J0][A-Z]$/.test(limpio)) return { valido: false };
    const cinco = limpio.slice(0, 5);
    if (limpio[5] !== letraControlReporte(cinco)) return { valido: false };

    const tramo = Number(limpio[0]);
    const pre = Number(limpio[1]);
    const post = Number(limpio[2]);
    const vs = verbosDeTramo(tramo, VJ.VERBOS, VJ.REGLAS);
    const falladosIds = [];
    [limpio[3], limpio[4]].forEach(function (ch) {
      if (ch >= 'A' && ch <= 'J') {
        const idx = ch.charCodeAt(0) - 65;
        if (vs[idx] && falladosIds.indexOf(vs[idx].id) < 0) falladosIds.push(vs[idx].id);
      }
    });

    return {
      valido: true,
      codigo: limpio,
      tramo: tramo,
      pre: pre,
      post: post,
      ganancia: post - pre,
      falladosIds: falladosIds,
      fallados: falladosIds.slice()
    };
  }

  function ejemploSalon(tramo) {
    const t = limitar(Math.round(Number(tramo) || 1), 1, 6);
    const vs = verbosDeTramo(t, VJ.VERBOS, VJ.REGLAS);
    const azar = crearAzar(t * 4242 + 17);
    // 3 verbos típicos del tramo concentran la mayoría de los fallos
    const focos = [vs[1] && vs[1].id, vs[4] && vs[4].id, vs[7] && vs[7].id].filter(Boolean);
    const otros = [vs[2] && vs[2].id, vs[6] && vs[6].id, vs[9] && vs[9].id].filter(Boolean);
    const codigos = [];
    for (let i = 0; i < 25; i++) {
      const rPre = azar();
      const pre = rPre < 0.2 ? 0 : (rPre < 0.6 ? 1 : (rPre < 0.9 ? 2 : 3));
      const rPost = azar();
      const post = Math.max(pre, rPost < 0.12 ? 3 : (rPost < 0.52 ? 4 : 5));
      const fallados = [];
      if (post < 5 || azar() < 0.75) {
        fallados.push(focos[i % focos.length]);
        if (azar() < 0.65) {
          const seg = azar() < 0.75 ? focos[(i + 1) % focos.length] : otros[i % otros.length];
          if (seg && fallados.indexOf(seg) < 0) fallados.push(seg);
        }
      }
      codigos.push(codificarReporte({ tramo: t, pre: pre, post: post, fallados: fallados }));
    }
    return codigos;
  }

  VJ.tramoActual = tramoActual;
  VJ.esSabido = esSabido;
  VJ.crearRevision = crearRevision;
  VJ.aplicarRevisionAHistorial = aplicarRevisionAHistorial;
  VJ.crearPrePost = crearPrePost;
  VJ.codificarReporte = codificarReporte;
  VJ.decodificarReporte = decodificarReporte;
  VJ.ejemploSalon = ejemploSalon;
  VJ.verbosDeTramo = verbosDeTramo;
  VJ.crearPartida = crearPartida;
  VJ.armarCola = armarCola;
  VJ.crearAzar = crearAzar;
  VJ.leerHistorial = leerHistorial;
  VJ.DT_MAX = DT_MAX;

  if (typeof module !== 'undefined' && module.exports) module.exports = VJ;
})(typeof window !== 'undefined' ? window : globalThis);
