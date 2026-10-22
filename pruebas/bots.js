// bots.js — jugadores automáticos y revisiones del juego de verbos irregulares.
// Dueño: agente de Pruebas. Explicación llana en equipo/pruebas.md y resultados en pruebas/INFORME.md
//
// Uso (desde la raíz del proyecto):
//   node pruebas/bots.js            → 1.000 partidas por perfil
//   node pruebas/bots.js 200        → 200 partidas por perfil (más rápido)
//   node pruebas/bots.js 1000 json  → además escribe los números crudos al final, en JSON
//
// No usa nada de fuera. Todo el azar sale de semillas: dos corridas dan los mismos números.
// Termina con código 1 si falla algún requisito duro.

'use strict';
const path = require('path');
const RAIZ = path.join(__dirname, '..');
require(path.join(RAIZ, 'js', 'verbos.js'));
try { require(path.join(RAIZ, 'js', 'oraciones.js')); } catch (e) { /* aún no existe */ }
require(path.join(RAIZ, 'js', 'reglas.js'));
require(path.join(RAIZ, 'js', 'logica.js'));
const VJ = globalThis.VJ;
const R = VJ.REGLAS;

const N = Math.max(10, parseInt(process.argv[2], 10) || 1000);   // partidas por perfil
const CON_JSON = process.argv[3] === 'json';
const DT = 1 / 30;            // paso de simulación (un cuadro de celular modesto)
const TOPE = 900;             // segundos de juego tras los cuales una partida se da por "no termina"

// ───────────────────────── utilidades ─────────────────────────
function crearAzar(semilla) {      // dado propio de los bots, distinto del dado del juego
  let a = (semilla >>> 0) || 1;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function ir(partida, carril) {     // usa solo mover(), como un jugador
  let n = 0;
  while (partida.estado.carril !== carril && n++ < 4) partida.mover(carril > partida.estado.carril ? 1 : -1);
}
function media(l) { return l.length ? l.reduce(function (a, b) { return a + b; }, 0) / l.length : NaN; }
function percentil(l, p) {
  if (!l.length) return NaN;
  const o = l.slice().sort(function (a, b) { return a - b; });
  return o[Math.min(o.length - 1, Math.floor(p * o.length))];
}
function mmss(s) { if (!isFinite(s)) return '—'; s = Math.round(s); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
function pct(x, d) { return isFinite(x) ? (100 * x).toFixed(d == null ? 1 : d) + ' %' : '—'; }
function tabla(titulos, filas) {
  const anchos = titulos.map(function (t, i) {
    return Math.max(String(t).length, Math.max.apply(null, filas.map(function (f) { return String(f[i]).length; }).concat([0])));
  });
  const linea = function (f) { return f.map(function (c, i) { return String(c).padEnd(anchos[i]); }).join('  ').trimEnd(); };
  console.log(linea(titulos));
  console.log(anchos.map(function (a) { return '-'.repeat(a); }).join('  '));
  filas.forEach(function (f) { console.log(linea(f)); });
}
function titulo(t) { console.log('\n' + '═'.repeat(100) + '\n' + t + '\n' + '═'.repeat(100)); }

// Requisitos duros: se van anotando y al final deciden el código de salida.
const requisitos = [];
function requisito(nombre, cumple, numero) { requisitos.push({ nombre: nombre, cumple: !!cumple, numero: String(numero) }); }
const avisos = [];
function aviso(t) { avisos.push(t); }

// ───────────────────────── vigilancia de las filas ─────────────────────────
// Todo lo que sale por la calle en cualquier partida de cualquier perfil pasa por aquí.
const FILAS = {
  total: 0, porCarril: [0, 0, 0], porCarrilPasado: [0, 0, 0], porCarrilParticipio: [0, 0, 0],
  tresSeguidas: 0, repetidas: 0, sinCorrecta: 0, falsoIgualCorrecta: 0, falsoAjeno: 0, largas: 0, vacias: 0,
  mismoQueAnterior: 0, conAnterior: 0,
  verbos: 0, verboEnMiCarril: 0, vuelveLibro: 0, vuelveLibroMal: 0, verboPorCarril: [0, 0, 0],
  vuelveConFalso: 0, vuelveSinFalso: 0,
  orden: {
    nuevo: { pasado: 0, participio: 0, significado: 0, base: 0 },
    visto: { pasado: 0, participio: 0, significado: 0, base: 0 },
    regular: { pasado: 0, participio: 0, significado: 0, base: 0 }
  }, fugaPide: 0, fugaCadena: 0, sinSegunda: 0,
  verboVsPasado: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
  ejemplos: []
};
function ejemplo(t) { if (FILAS.ejemplos.length < 12) FILAS.ejemplos.push(t); }

function vigilarObjeto(o, e, mem, semilla) {
  if (o.tipo === 'verbo') {
    FILAS.verbos++;
    FILAS.verboPorCarril[o.carril]++;
    if (mem.sinRecoger) { FILAS.vuelveLibro++; if (o.carril !== e.carril) { FILAS.vuelveLibroMal++; ejemplo('semilla ' + semilla + ': el libro no recogido de ' + o.verbo.id + ' NO volvió en el carril del jugador'); } }
    else if (o.carril === e.carril) { FILAS.verboEnMiCarril++; ejemplo('semilla ' + semilla + ': el verbo ' + o.verbo.id + ' salió la primera vez en el carril del jugador'); }
    mem.sinRecoger = false;
    mem.carrilVerbo = o.carril;
    return;
  }
  const v = o.verbo, pide = o.pide;
  const forma = pide === 'pasado' ? v.pasado : (pide === 'participio' ? v.participio : (pide === 'significado' ? (v.esCorto || v.es) : v.base));
  const lista = pide === 'significado'
    ? (v.falsosEs || []).concat(['hacer', 'tener', 'ir', 'decir'])
    : (pide === 'base'
      ? [v.pasado, v.participio].concat(v.falsosPasado || [], v.falsosParticipio || [], [v.base + 'ed', v.base + 's'])
      : (pide === 'pasado' ? (v.falsosPasado || []) : (v.falsosParticipio || [])).concat([v.base]));
  // qué se pide primero, y si el estado delata algo
  if (mem.filaDelTurno === 0) {
    const tipo = v.grupo === 'regulares' ? 'regular' : (mem.vistos[v.id] ? 'visto' : 'nuevo');
    FILAS.orden[tipo][pide] = (FILAS.orden[tipo][pide] || 0) + 1;
    mem.primerPide = pide;
    mem.primeraForma = forma;
    if (e.cadena && (e.cadena.pasado != null || e.cadena.participio != null)) {
      FILAS.fugaCadena++; ejemplo('semilla ' + semilla + ': la pizarra ya traía formas antes de pedirlas en ' + v.id);
    }
  } else if (mem.filaDelTurno === 1 && (mem.primerPide === pide || mem.primeraForma === forma)) {
    FILAS.sinSegunda++; ejemplo('semilla ' + semilla + ': el turno de ' + v.id + ' pidió dos veces ' + pide + ' (' + forma + ')');
  }
  mem.filaDelTurno++;
  if (e.pide !== pide) { FILAS.fugaPide++; ejemplo('semilla ' + semilla + ': estado.pide dice ' + e.pide + ' y la fila es de ' + pide); }
  if (pide === 'pasado' || pide === 'participio') {
    if (e.cadena && e.cadena[pide] != null) { FILAS.fugaCadena++; ejemplo('semilla ' + semilla + ': la pizarra ya traía el ' + pide + ' de ' + v.id); }
  } else if (pide === 'base') {
    if (e.cadena && e.cadena.baseConfirmada != null) { FILAS.fugaCadena++; ejemplo('semilla ' + semilla + ': la pizarra ya traía baseConfirmada de ' + v.id); }
  } else if (pide === 'significado') {
    if ((e.cadena && e.cadena.significado != null) || !e.ocultarSignificadoLibro) { FILAS.fugaCadena++; ejemplo('semilla ' + semilla + ': el libro/pizarra adelantó el significado de ' + v.id); }
  }
  FILAS.total++;
  FILAS.porCarril[o.correcta]++;
  if (pide === 'pasado') FILAS.porCarrilPasado[o.correcta]++;
  else if (pide === 'participio') FILAS.porCarrilParticipio[o.correcta]++;
  if (pide === 'pasado' && mem.carrilVerbo != null) FILAS.verboVsPasado[mem.carrilVerbo][o.correcta]++;
  if (mem.ultimo != null) { FILAS.conAnterior++; if (mem.ultimo === o.correcta) FILAS.mismoQueAnterior++; }
  if (mem.ultimo === o.correcta) mem.seguidas++; else { mem.ultimo = o.correcta; mem.seguidas = 1; }
  if (mem.seguidas >= 3) { FILAS.tresSeguidas++; ejemplo('semilla ' + semilla + ': la correcta cayó 3 veces seguidas en el carril ' + o.correcta); }
  if (o.opciones.length !== 3 || o.opciones[o.correcta] !== forma) { FILAS.sinCorrecta++; ejemplo('semilla ' + semilla + ': fila de ' + v.id + ' sin la correcta: ' + o.opciones.join('/')); }
  const unicas = {};
  const topeLetras = pide === 'significado' ? 10 : R.maxLetras;
  o.opciones.forEach(function (p, c) {
    if (!p) FILAS.vacias++;
    if (unicas[p]) { FILAS.repetidas++; ejemplo('semilla ' + semilla + ': fila con palabra repetida: ' + o.opciones.join('/')); }
    unicas[p] = true;
    if (p && p.length > topeLetras) FILAS.largas++;
    if (c !== o.correcta) {
      if (p === forma) FILAS.falsoIgualCorrecta++;
      if (lista.indexOf(p) < 0) FILAS.falsoAjeno++;
    }
  });
  // Si ya falló este verbo en pasado o participio (con un falso de su lista), ese falso debe estar otra vez
  if (pide === 'pasado' || pide === 'participio') {
    const clave = v.id + '/' + pide;
    const listaFija = pide === 'pasado' ? (v.falsosPasado || []) : (v.falsosParticipio || []);
    if (mem.elegido[clave] && listaFija.indexOf(mem.elegido[clave]) >= 0) {
      if (o.opciones.indexOf(mem.elegido[clave]) >= 0) FILAS.vuelveConFalso++;
      else { FILAS.vuelveSinFalso++; ejemplo('semilla ' + semilla + ': ' + clave + ' volvió sin el falso elegido "' + mem.elegido[clave] + '": ' + o.opciones.join('/')); }
    }
  }
}

// ───────────────────────── el motor que juega una partida ─────────────────────────
// bot = { inicio(partida, ctx), objeto(partida, o, ctx), cuadro(partida, ctx), evento(ev, ctx) }  (todo opcional)
function jugar(op, bot, semillaBot, extra) {
  extra = extra || {};
  const partida = VJ.crearPartida(op);
  const e = partida.estado;
  const yaVistos = {};
  if (op.historial && typeof op.historial === 'object') Object.keys(op.historial).forEach(function (id) { const h = op.historial[id]; if (h && Number(h.vistos) > 0) yaVistos[id] = true; });
  const ctx = { azar: crearAzar(semillaBot), m: {}, objeto: null, vistos: yaVistos };
  const mem = { ultimo: null, seguidas: 0, elegido: {}, carrilVerbo: null, vistos: yaVistos, filaDelTurno: 0, primerPide: null, primeraForma: null };
  if (op.historial && extra.vigilarHistorial) {
    Object.keys(op.historial).forEach(function (id) {
      const h = op.historial[id] || {};
      if (h.falsoPasado) mem.elegido[id + '/pasado'] = h.falsoPasado;
      if (h.falsoParticipio) mem.elegido[id + '/participio'] = h.falsoParticipio;
    });
  }
  const dt = extra.dt || DT;
  const sal = { carriles: [], eventos: [], turnos: [], captura: null, grupos: [], excepcion: null, colaInicial: e.cola.slice(), fueraDeCarril: 0 };
  let ultimo = null, nFila = 0;
  sal.porFila = [[0, 0], [0, 0]]; sal.enRegular = [[0, 0], [0, 0]];
  if (bot.inicio) bot.inicio(partida, ctx);
  while (e.fase === 'corriendo' && e.tiempo < TOPE) {
    const o = e.objetos[0] || null;
    if (o !== ultimo) {
      ultimo = o;
      if (o) {
        ctx.objeto = o;
        sal.carriles.push((o.tipo === 'verbo' ? 'v' : 'f') + o.correcta);
        if (!extra.sinVigilar) vigilarObjeto(o, e, mem, op.semilla);
        if (bot.objeto) bot.objeto(partida, o, ctx);
      }
    }
    if (bot.cuadro) bot.cuadro(partida, ctx);
    if (e.carril < 0 || e.carril > 2 || e.carril !== Math.round(e.carril)) sal.fueraDeCarril++;
    const evs = partida.paso(dt);
    for (let i = 0; i < evs.length; i++) {
      const ev = evs[i];
      if (ev.tipo === 'estrella') continue;
      sal.eventos.push(ev.tipo + ':' + (ev.verbo ? ev.verbo.id : '') + ':' + (ev.pide || '') + ':' + (ev.elegida == null ? '' : ev.elegida));
      if (ev.tipo === 'recogio') { sal.turnos.push(ev.verbo.id); mem.filaDelTurno = 0; if (ev.entregado) sal.entregados = (sal.entregados || 0) + 1; }
      if (ev.tipo === 'sinrecoger') { mem.sinRecoger = true; sal.sinRecoger = (sal.sinRecoger || 0) + 1; }
      if (ev.tipo === 'grupo') sal.grupos.push(ev.verbo.grupo);
      if (ev.tipo === 'error' && (ev.pide === 'pasado' || ev.pide === 'participio')) mem.elegido[ev.verbo.id + '/' + ev.pide] = ev.elegida;
      if (ev.tipo === 'recogio') nFila = 0;
      if ((ev.tipo === 'acierto' || ev.tipo === 'error') && ev.pide !== 'recoger') {
        nFila++;
        const k = nFila === 1 ? 0 : 1, bien = ev.tipo === 'acierto' ? 1 : 0;
        sal.porFila[k][0] += bien; sal.porFila[k][1]++;
        if (ev.verbo && ev.verbo.grupo === 'regulares') { sal.enRegular[k][0] += bien; sal.enRegular[k][1]++; }
      }
      if (ev.tipo === 'captura') sal.captura = ev.pide;
      if (bot.evento) bot.evento(ev, ctx);
    }
  }
  sal.partida = partida;
  sal.fase = e.fase;
  sal.tiempo = e.tiempo;
  sal.turnosCumplidos = e.turnosCumplidos;
  sal.filasAcertadas = e.filasAcertadas;
  sal.filasTotal = e.filasTotal;
  sal.resumen = partida.resumen();
  return sal;
}

// ───────────────────────── los perfiles ─────────────────────────
function primerFalso(o) {
  const v = o.verbo;
  const lista = o.pide === 'pasado' ? (v.falsosPasado || [])
    : (o.pide === 'participio' ? (v.falsosParticipio || [])
      : (o.pide === 'significado' ? (v.falsosEs || []) : [v.pasado, v.participio].concat(v.falsosPasado || [])));
  for (let i = 0; i < lista.length; i++) {
    const c = o.opciones.indexOf(lista[i]);
    if (c >= 0 && c !== o.correcta) return c;
  }
  return (o.correcta + 1) % 3;
}
const BOTS = {
  // No toca nada (salvo colocarse una vez al empezar en el carril pedido)
  quieto: function (carril) { return { inicio: function (p) { ir(p, carril); } }; },
  // Carril al azar en cada cosa que viene, también el verbo
  azar: function () { return { objeto: function (p, o, c) { ir(p, Math.floor(c.azar() * 3)); } }; },
  // Recoge el verbo (es una sola palabra, no hay que saber nada) y luego al azar
  azarRecoge: function () {
    return { objeto: function (p, o, c) { ir(p, o.tipo === 'verbo' ? o.correcta : Math.floor(c.azar() * 3)); } };
  },
  perfecto: function () { return { objeto: function (p, o) { ir(p, o.correcta); } }; },
  // Acierta cada fila con probabilidad a; cuando falla, cae en el falso más común que haya en la fila
  aprendiz: function (a) {
    return { objeto: function (p, o, c) {
      if (o.tipo === 'verbo') return ir(p, o.correcta);
      ir(p, c.azar() < a ? o.correcta : primerFalso(o));
    } };
  },
  // Recoge el verbo y vuelve siempre al mismo carril para las filas
  fijo: function (carril) { return { objeto: function (p, o) { ir(p, o.tipo === 'verbo' ? o.correcta : carril); } }; },
  // Se queda en el carril donde recogió el verbo
  // Nunca recoge el libro: se aparta siempre
  esquiva: function () { return { cuadro: function (p) { const o = p.estado.objetos[0]; if (o && o.tipo === 'verbo' && o.carril === p.estado.carril) p.mover(o.carril === 0 ? 1 : -1); } }; },
  dondeRecogio: function () { return { objeto: function (p, o) { if (o.tipo === 'verbo') ir(p, o.correcta); } }; },
  // Alterna sin leer: lista de carriles que recorre en orden, en cada objeto (verbo incluido)
  alterna: function (ciclo) {
    return { inicio: function (p, c) { c.m.i = 0; }, objeto: function (p, o, c) { ir(p, ciclo[c.m.i++ % ciclo.length]); } };
  },
  // Recoge el verbo y en las filas alterna sin leer
  alternaRecoge: function (ciclo) {
    return { inicio: function (p, c) { c.m.i = 0; },
      objeto: function (p, o, c) { ir(p, o.tipo === 'verbo' ? o.correcta : ciclo[c.m.i++ % ciclo.length]); } };
  },
  // Persigue estrellas y no mira ni el verbo ni los letreros
  estrellas: function () {
    return { cuadro: function (p) { const s = p.estado.estrellas; if (s.length) ir(p, s[0].carril); } };
  },
  // Persigue estrellas, recoge el verbo cuando ya no quedan estrellas antes de él, y no lee los letreros
  estrellasRecoge: function () {
    return { cuadro: function (p) {
      const e = p.estado, s = e.estrellas, o = e.objetos[0];
      if (s.length && (!o || s[0].z < o.z)) ir(p, s[0].carril);
      else if (o && o.tipo === 'verbo') ir(p, o.correcta);
    } };
  },
  // "Cuenta cartas": el juego reparte la respuesta correcta 2 veces por carril cada 6 filas y nunca 3 seguidas.
  // Este bot no lee las palabras: solo anota en qué carril estuvo la correcta (el juego lo muestra en verde)
  // y va al carril al que más veces le falta salir.
  contador: function () {
    return {
      inicio: function (p, c) { c.m.resto = [2, 2, 2]; c.m.ult = -1; c.m.seg = 0; },
      objeto: function (p, o, c) {
        if (o.tipo === 'verbo') return ir(p, o.correcta);
        const m = c.m;
        if (m.resto[0] + m.resto[1] + m.resto[2] === 0) m.resto = [2, 2, 2];
        let mejor = [], max = -1;
        for (let k = 0; k < 3; k++) {
          if (m.seg >= R.maxMismoCarrilSeguido && k === m.ult) continue;
          if (m.resto[k] > max) { max = m.resto[k]; mejor = [k]; } else if (m.resto[k] === max) mejor.push(k);
        }
        ir(p, mejor[Math.floor(c.azar() * mejor.length)]);
      },
      evento: function (ev, c) {
        if ((ev.tipo !== 'acierto' && ev.tipo !== 'error') || ev.pide === 'recoger') return;
        const m = c.m, k = c.objeto.correcta;
        if (m.resto[0] + m.resto[1] + m.resto[2] === 0) m.resto = [2, 2, 2];
        if (m.resto[k] === 0) { m.resto[0] += 2; m.resto[1] += 2; m.resto[2] += 2; }
        m.resto[k]--;
        if (k === m.ult) m.seg++; else { m.ult = k; m.seg = 1; }
      }
    };
  },
  // "Sin -ed": no sabe ningún verbo. Regla única: descarta lo que termine en -ed y, de lo que quede,
  // toma la palabra más corta (si empatan, al azar).
  sinEd: function () {
    return { objeto: function (p, o, c) {
      if (o.tipo === 'verbo') return ir(p, o.correcta);
      ir(p, elegirSinEd(o.opciones, c.azar, null));
    } };
  },
  // "Sin -ed con memoria del turno": lo mismo, y en la segunda fila del verbo usa lo que acaba de ver:
  // si en la fila del pasado había dos candidatas sin -ed y el juego mostró cuál era el pasado, la otra es el participio.
  sinEdMemoria: function () {
    return {
      objeto: function (p, o, c) {
        if (o.tipo === 'verbo') { c.m.cand = null; c.m.primera = null; c.m.fila = 0; return ir(p, o.correcta); }
        c.m.fila = (c.m.fila || 0) + 1;
        const sinEd = o.opciones.filter(function (w) { return !/ed$/.test(w); });
        if (c.m.fila === 1) { c.m.cand = sinEd; return ir(p, elegirSinEd(o.opciones, c.azar, null)); }
        let palabra = null;
        const otras = (c.m.cand || []).filter(function (w) { return w !== c.m.primera && o.opciones.indexOf(w) >= 0; });
        if (otras.length) palabra = otras[0];
        else if (c.m.primera && o.opciones.indexOf(c.m.primera) >= 0) palabra = c.m.primera;
        ir(p, palabra ? o.opciones.indexOf(palabra) : elegirSinEd(o.opciones, c.azar, null));
      },
      evento: function (ev, c) { if ((ev.tipo === 'acierto' || ev.tipo === 'error') && ev.pide !== 'recoger' && c.m.fila === 1) c.m.primera = ev.correcta; }
    };
  }
};
function elegirSinEd(opciones, azar) {
  let cand = [];
  opciones.forEach(function (w, i) { if (!/ed$/.test(w)) cand.push(i); });
  if (!cand.length) cand = [0, 1, 2];
  const min = Math.min.apply(null, cand.map(function (i) { return opciones[i].length; }));
  cand = cand.filter(function (i) { return opciones[i].length === min; });
  return cand[Math.floor(azar() * cand.length)];
}

// ───────────────────────── medir un perfil ─────────────────────────
function medir(nombre, crearBot, opciones, n, extra) {
  n = n || N;
  const r = { nombre: nombre, n: n, porFila: [[0, 0], [0, 0]], enRegular: [[0, 0], [0, 0]], ganaConPend: 0, ganaPorTope: 0, limpiosSiGana: [], ganadas: 0, noTermina: 0, dur: [], durGanadas: [], turnos: [], tres: 0,
    filasBien: 0, filas: 0, pierde: { recoger: 0, pasado: 0, participio: 0, significado: 0, base: 0 }, primeraDerrota: null, fueraDeCarril: 0 };
  for (let s = 1; s <= n; s++) {
    const op = Object.assign({ semilla: s, historial: {} }, typeof opciones === 'function' ? opciones(s) : (opciones || {}));
    const sal = jugar(op, crearBot(), (Number(op.semilla) || s) * 7919 + 13, extra);
    r.dur.push(sal.tiempo);
    if (sal.tiempo > MAXIMO.t) { MAXIMO.t = sal.tiempo; MAXIMO.donde = nombre + ', semilla ' + op.semilla + ' (' + sal.fase + ')'; }
    r.puntos = Math.max(r.puntos || 0, sal.resumen.puntos);
    r.turnos.push(sal.turnosCumplidos);
    if (sal.turnosCumplidos >= 3) r.tres++;
    r.filasBien += sal.filasAcertadas; r.filas += sal.filasTotal;
    r.fueraDeCarril += sal.fueraDeCarril;
    for (let k = 0; k < 2; k++) for (let j = 0; j < 2; j++) { r.porFila[k][j] += sal.porFila[k][j]; r.enRegular[k][j] += sal.enRegular[k][j]; }
    if (sal.fase === 'ganada') { r.ganadas++; r.durGanadas.push(sal.tiempo); r.limpiosSiGana.push(sal.turnosCumplidos);
      if (sal.resumen.verbos.some(function (v) { return v.resultado === 'pendiente'; })) r.ganaConPend++;
      if (sal.turnos.length >= (R.turnosMaximos || 1e9) + (R.regularesPorPartida || 0)) r.ganaPorTope++;
      if (sal.resumen.limpia) r.ganaLimpia = (r.ganaLimpia || 0) + 1; }
    else if (sal.fase === 'perdida') { r.pierde[sal.captura] = (r.pierde[sal.captura] || 0) + 1; if (r.primeraDerrota == null) r.primeraDerrota = s; }
    else r.noTermina++;
  }
  r.pGana = r.ganadas / n;
  r.pLimpia = (r.ganaLimpia || 0) / n;
  r.pTres = r.tres / n;
  r.acierto = r.filas ? r.filasBien / r.filas : NaN;
  r.ac1 = r.porFila[0][0] / Math.max(1, r.porFila[0][1]); r.ac2 = r.porFila[1][0] / Math.max(1, r.porFila[1][1]);
  r.acReg1 = r.enRegular[0][0] / Math.max(1, r.enRegular[0][1]); r.acReg2 = r.enRegular[1][0] / Math.max(1, r.enRegular[1][1]);
  return r;
}
function comoPierde(r) {
  const perdidas = r.n - r.ganadas - r.noTermina;
  const partes = [];
  if (perdidas) {
    [['recoger', 'sin recoger el verbo'], ['pasado', 'en el pasado'], ['participio', 'en el participio'], ['significado', 'en significado'], ['base', "en didn't"]].forEach(function (d) {
      if (r.pierde[d[0]]) partes.push(d[1] + ' ' + Math.round(100 * r.pierde[d[0]] / perdidas) + ' %');
    });
  }
  if (r.noTermina) partes.push('NO TERMINA ' + r.noTermina);
  return partes.length ? partes.join(', ') : 'no pierde';
}
function filaDeTabla(r) {
  return [r.nombre, r.n, pct(r.pGana), pct(r.ganaConPend / r.n), mmss(media(r.dur)), mmss(percentil(r.durGanadas, 0.95)), media(r.turnos).toFixed(2), pct(r.pTres), pct(r.acierto, 0), comoPierde(r)];
}
const TITULOS = ['Perfil', 'Partidas', 'Gana', '…de ellas con verbos pendientes', 'Dura', '95 % gana en', 'Turnos limpios', '≥3 turnos', 'Filas bien', 'Cómo pierde'];
function filaDeTablaVieja(r) {
  return [r.nombre, r.n, pct(r.pGana), mmss(media(r.dur)), mmss(media(r.durGanadas)), mmss(percentil(r.durGanadas, 0.95)),
    media(r.turnos).toFixed(2), pct(r.pTres), pct(r.acierto, 0), comoPierde(r)];
}
const MAXIMO = { t: 0, donde: '' };
const TITULOS_VIEJOS = ['Perfil', 'Partidas', 'Gana', 'Dura', 'Dura si gana', '95 % gana en', 'Turnos limpios', '≥3 turnos', 'Filas bien', 'Cómo pierde'];

// ═════════════════════════ 1. LOS DATOS ═════════════════════════
function revisarDatos() {
  titulo('1. Los datos de verbos.js contra el contrato');
  const V = VJ.VERBOS, G = VJ.GRUPOS;
  const problemas = [];
  const ids = {}, ordenes = {}, grupos = {};
  G.forEach(function (g) {
    if (grupos[g.id]) problemas.push('grupo repetido: ' + g.id);
    grupos[g.id] = 0;
    ['nombre', 'explicacion', 'ejemplo'].forEach(function (k) { if (!g[k]) problemas.push('grupo ' + g.id + ' sin ' + k); });
  });
  let maxLargo = 0, palabraLarga = '';
  let falsosIgualBase = 0;
  V.forEach(function (v) {
    if (ids[v.id]) problemas.push('id repetido: ' + v.id);
    ids[v.id] = true;
    if (v.id !== String(v.id).toLowerCase()) problemas.push('id con mayúsculas: ' + v.id);
    if (ordenes[v.orden]) problemas.push('orden repetido: ' + v.orden + ' (' + v.id + ' y ' + ordenes[v.orden] + ')');
    ordenes[v.orden] = v.id;
    if (!(v.grupo in grupos)) problemas.push(v.id + ': grupo que no existe (' + v.grupo + ')'); else grupos[v.grupo]++;
    ['base', 'pasado', 'participio', 'es', 'pista'].forEach(function (k) { if (!v[k] || typeof v[k] !== 'string') problemas.push(v.id + ': falta ' + k); });
    [['falsosPasado', v.pasado], ['falsosParticipio', v.participio]].forEach(function (d) {
      const lista = v[d[0]] || [];
      if (lista.length < 2) problemas.push(v.id + ': menos de 2 en ' + d[0]);
      const vistos = {};
      lista.forEach(function (f) {
        if (f === d[1]) problemas.push(v.id + ': en ' + d[0] + ' el falso "' + f + '" es la forma correcta');
        if (vistos[f]) problemas.push(v.id + ': falso repetido "' + f + '" en ' + d[0]);
        vistos[f] = true;
        if (f === v.base) falsosIgualBase++;
        if (!/^[a-z]+$/.test(f)) problemas.push(v.id + ': falso con caracteres raros "' + f + '"');
      });
    });
    [v.base, v.pasado, v.participio].concat(v.falsosPasado || [], v.falsosParticipio || []).forEach(function (w) {
      if (w.length > maxLargo) { maxLargo = w.length; palabraLarga = w; }
      if (w.length > R.maxLetras) problemas.push(v.id + ': "' + w + '" pasa de ' + R.maxLetras + ' letras');
    });
    const pista = v.pista.toLowerCase();
    if (pista.indexOf(v.pasado) < 0) aviso('La pista de ' + v.id + ' no menciona su pasado "' + v.pasado + '": ' + v.pista);
    if (pista.indexOf(v.participio) < 0) aviso('La pista de ' + v.id + ' no menciona su participio "' + v.participio + '": ' + v.pista);
  });
  // orden: 1..n sin huecos, y los del mismo grupo seguidos
  const porOrden = V.slice().sort(function (a, b) { return a.orden - b.orden; });
  porOrden.forEach(function (v, i) { if (v.orden !== i + 1) problemas.push('orden con hueco en ' + v.id + ' (' + v.orden + ', se esperaba ' + (i + 1) + ')'); });
  const cerrados = {};
  porOrden.forEach(function (v, i) {
    if (i > 0 && porOrden[i - 1].grupo !== v.grupo) { cerrados[porOrden[i - 1].grupo] = true; if (cerrados[v.grupo]) problemas.push('el grupo ' + v.grupo + ' no va seguido en el orden'); }
  });
  Object.keys(grupos).forEach(function (g) { if (!grupos[g]) problemas.push('grupo sin verbos: ' + g); });
  console.log('Verbos: ' + V.length + ' · grupos: ' + G.length + ' (' + Object.keys(grupos).map(function (g) { return g + ' ' + grupos[g]; }).join(', ') + ')');
  console.log('Palabra más larga: "' + palabraLarga + '" (' + maxLargo + ' letras; el tope es ' + R.maxLetras + ')');
  console.log('Falsos que son la forma base del verbo (válidos como error real): ' + falsosIgualBase);
  console.log(problemas.length ? 'PROBLEMAS:\n  - ' + problemas.join('\n  - ') : 'Sin problemas contra el contrato.');
  requisito('Datos: ids y orden únicos, grupos existentes, falsos válidos, máximo ' + R.maxLetras + ' letras', problemas.length === 0,
    problemas.length + ' problemas en ' + V.length + ' verbos');

  // ¿Las palabras delatan la respuesta sin saber el verbo? Se mira la fila que sale la primera vez (los dos primeros falsos).
  console.log('\n¿Se puede acertar sin saber el verbo? Filas tal como salen la primera vez (la correcta + los dos primeros falsos):');
  const porGrupo = {};
  let soloSinEd = 0, conCorta = 0, totalFilas = 0, todosEd = 0, totalFalsos = 0;
  V.forEach(function (v) {
    const g = porGrupo[v.grupo] = porGrupo[v.grupo] || { filas: 0, a: 0, b: 0 };
    [[v.pasado, v.falsosPasado], [v.participio, v.falsosParticipio]].forEach(function (d) {
      const ops = [d[0]].concat(d[1].slice(0, 2));
      const sin = ops.filter(function (w) { return !/ed$/.test(w); });
      const min = Math.min.apply(null, sin.map(function (w) { return w.length; }));
      const cortas = sin.filter(function (w) { return w.length === min; });
      totalFilas++; g.filas++;
      if (sin.length === 1 && sin[0] === d[0]) { soloSinEd++; g.a++; }
      if (cortas.length === 1 && cortas[0] === d[0]) { conCorta++; g.b++; }
      d[1].forEach(function (f) { totalFalsos++; if (/ed$/.test(f)) todosEd++; });
    });
  });
  tabla(['Grupo', 'Filas', 'La correcta es la ÚNICA sin -ed', 'Sale con "sin -ed y la más corta"'],
    Object.keys(porGrupo).map(function (k) { const g = porGrupo[k]; return [k, g.filas, g.a + ' (' + Math.round(100 * g.a / g.filas) + ' %)', g.b + ' (' + Math.round(100 * g.b / g.filas) + ' %)']; })
      .concat([['TODOS', totalFilas, soloSinEd + ' (' + Math.round(100 * soloSinEd / totalFilas) + ' %)', conCorta + ' (' + Math.round(100 * conCorta / totalFilas) + ' %)']]));
  console.log('Falsos que terminan en -ed: ' + todosEd + ' de ' + totalFalsos + ' (' + Math.round(100 * todosEd / totalFalsos) + ' %). Ninguna forma correcta termina en -ed.');
  RES.sinEdEstatico = { filas: totalFilas, unica: soloSinEd, corta: conCorta, falsosEd: todosEd, falsos: totalFalsos };
  return problemas;
}

// ═════════════════════════ 2. LOS BOTS ═════════════════════════
const RES = {};
function medirBots() {
  titulo('2. Bots: primera partida del modo "camino" (historial vacío), ' + N + ' partidas por perfil, dt = 1/30 s');
  const filas = [];
  function m(clave, nombre, crear, opciones, n) { const r = medir(nombre, crear, opciones, n); RES[clave] = r; filas.push(filaDeTabla(r)); return r; }

  m('quieto0', 'quieto (carril izquierdo)', function () { return BOTS.quieto(0); });
  m('quieto1', 'quieto (carril central)', function () { return BOTS.quieto(1); });
  m('quieto2', 'quieto (carril derecho)', function () { return BOTS.quieto(2); });
  m('azar', 'azar', BOTS.azar);
  m('azarRecoge', 'azar que sí recoge el verbo', BOTS.azarRecoge);
  m('perfecto', 'perfecto', BOTS.perfecto);
  [0.5, 0.6, 0.7, 0.8, 0.9, 0.95].forEach(function (a) { m('aprendiz' + a, 'aprendiz ' + Math.round(a * 100) + ' %', function () { return BOTS.aprendiz(a); }, null, Math.max(N, 3000)); });
  m('fijo0', 'tramposo: siempre izquierda (recoge)', function () { return BOTS.fijo(0); });
  m('fijo1', 'tramposo: siempre al centro tras recoger', function () { return BOTS.fijo(1); });
  m('fijo2', 'tramposo: siempre derecha (recoge)', function () { return BOTS.fijo(2); });
  m('esquiva', 'tramposo: esquiva el libro siempre', BOTS.esquiva);
  m('dondeRecogio', 'tramposo: se queda donde recogió', BOTS.dondeRecogio);
  m('alterna02', 'tramposo: alterna izq-der sin leer nada', function () { return BOTS.alterna([0, 2]); });
  m('alterna012', 'tramposo: gira izq-centro-der sin leer nada', function () { return BOTS.alterna([0, 1, 2]); });
  m('alternaR02', 'tramposo: recoge y alterna izq-der', function () { return BOTS.alternaRecoge([0, 2]); });
  m('alternaR012', 'tramposo: recoge y gira izq-centro-der', function () { return BOTS.alternaRecoge([0, 1, 2]); });
  m('alternaR0121', 'tramposo: recoge y hace zigzag 0-1-2-1', function () { return BOTS.alternaRecoge([0, 1, 2, 1]); });
  m('estrellas', 'tramposo: solo persigue estrellas', BOTS.estrellas);
  m('estrellasRecoge', 'tramposo: estrellas, recoge, no lee', BOTS.estrellasRecoge);
  m('contador', 'tramposo: cuenta carriles (no lee)', BOTS.contador);
  m('sinEd', 'tramposo: "nada con -ed, la más corta"', BOTS.sinEd);
  m('sinEdMemoria', 'tramposo: "sin -ed" + memoria del turno', BOTS.sinEdMemoria);
  m('nuncaEd', 'tramposo: "nunca la de -ed"', BOTS.nuncaEd);
  m('siempreEd', 'tramposo: "siempre la de -ed"', BOTS.siempreEd);
  m('polGeneral', 'tramposo: la mejor regla general que encontré', function () { return BOTS.politica(POL.general, true); });
  tabla(TITULOS, filas);
  console.log('\n"Dura" = duración media de todas las partidas. "Turnos limpios" = verbos completados sin error (ahora la partida limpia tiene ' + ((R.turnosPorPartida || 8) + (R.regularesPorPartida || 0)) + ': ' + R.turnosPorPartida + ' irregulares y ' + (R.regularesPorPartida || 0) + ' regulares).');
  console.log('"Filas bien" = letreros acertados sobre letreros jugados.');

  // ── requisitos duros ──
  const q = ['quieto0', 'quieto1', 'quieto2'].map(function (k) { return RES[k]; });
  requisito('Quieto pierde siempre (arrancando en los tres carriles)', q.every(function (r) { return r.ganadas === 0 && r.noTermina === 0; }),
    q.map(function (r) { return r.ganadas; }).join('+') + ' ganadas de ' + (3 * N) + '; dura ' + media(q[1].dur).toFixed(1) + ' s de media');
  requisito('Azar no gana', RES.azar.ganadas === 0, RES.azar.ganadas + ' de ' + N);
  requisito('Azar casi nunca llega a 3 turnos limpios (menos de 3 %; antes 1 %, pero ahora el libro no recogido vuelve solo)', RES.azar.pTres < 0.03, pct(RES.azar.pTres, 2) + '; dura ' + media(RES.azar.dur).toFixed(0) + ' s');
  requisito('Azar que recoge: gana menos de 0,5 % y llega a 3 turnos menos de 3 %', RES.azarRecoge.pGana < 0.005 && RES.azarRecoge.pTres < 0.03,
    'gana ' + pct(RES.azarRecoge.pGana, 2) + ', 3 turnos ' + pct(RES.azarRecoge.pTres, 2));
  requisito('Perfecto gana siempre (camino, primera partida)', RES.perfecto.ganadas === N, RES.perfecto.ganadas + ' de ' + N);

  // ── aprendices contra DISENO ──
  const ANTES = { 0.7: 17.4, 0.8: 56.5, 0.9: 92.9, 0.95: 99.0 };      // lo que yo medí en la primera ronda, con las reglas viejas
  const ANTES2 = { 0.5: 0.6, 0.6: 6.1, 0.7: 25.7, 0.8: 62.5, 0.9: 93.5, 0.95: 99.1 };   // segunda ronda
  console.log('\nAprendices con las reglas nuevas (medición; DISENO sección 11 ya no aplica porque la partida ahora tiene tope):');
  const fa = [];
  [0.5, 0.6, 0.7, 0.8, 0.9, 0.95].forEach(function (a) {
    const r = RES['aprendiz' + a];
    const margen = 196 * Math.sqrt(r.pGana * (1 - r.pGana) / r.n);
    fa.push(['aprendiz ' + Math.round(a * 100) + ' %', ANTES[a] == null ? '—' : ANTES[a] + ' %', ANTES2[a] + ' %', pct(r.pGana), '± ' + margen.toFixed(1), pct(r.ganaConPend / Math.max(1, r.ganadas), 0), pct(r.ganaPorTope / Math.max(1, r.ganadas), 0), media(r.limpiosSiGana).toFixed(1), mmss(media(r.durGanadas))]);
  });
  tabla(['Perfil', 'Ganaba (1.ª ronda)', 'Ganaba (2.ª ronda)', 'Gana ahora', 'Margen', 'Victorias con algún verbo pendiente', 'Victorias por tope de turnos', 'Turnos limpios si gana', 'Dura si gana'], fa);
  const orden = [0.5, 0.6, 0.7, 0.8, 0.9, 0.95].map(function (a) { return RES['aprendiz' + a].pGana; });
  requisito('Quien más sabe, más gana (aprendices de 50 a 95 % en orden) y el de 95 % gana al menos 97 %', orden.every(function (x, i) { return i === 0 || x >= orden[i - 1]; }) && orden[5] >= 0.97,
    orden.map(function (x) { return pct(x); }).join(' < '));
  requisito('Quien acierta la mitad de los letreros gana menos de 1 de cada 10 partidas', orden[0] < 0.10, 'aprendiz 50 % gana ' + pct(orden[0]) + '; aprendiz 60 % gana ' + pct(orden[1]));

  // ── tramposos ──
  const tramposos = ['esquiva', 'fijo0', 'fijo1', 'fijo2', 'dondeRecogio', 'alterna02', 'alterna012', 'alternaR02', 'alternaR012', 'alternaR0121',
    'estrellas', 'estrellasRecoge', 'contador', 'sinEd', 'sinEdMemoria', 'nuncaEd', 'siempreEd'];
  const base = RES.azarRecoge;
  const malos = tramposos.filter(function (k) { return RES[k].pGana > Math.max(0.01, base.pGana); });
  const sobreAzar = tramposos.filter(function (k) { return RES[k].pTres > base.pTres + 0.02 || RES[k].pGana > base.pGana + 0.005; });
  requisito('Ningún tramposo simple (carriles, estrellas y los trucos del "-ed") gana más del 1 % en el camino', malos.length === 0,
    malos.length ? malos.map(function (k) { return RES[k].nombre.replace('tramposo: ', '') + ' gana ' + pct(RES[k].pGana); }).join('; ') : 'el que más: ' +
      pct(Math.max.apply(null, tramposos.map(function (k) { return RES[k].pGana; }))));
  if (sobreAzar.length) aviso('Tramposos que rinden más que el azar que recoge (' + pct(base.pTres) + ' llega a 3 turnos): ' +
    sobreAzar.map(function (k) { return RES[k].nombre.replace('tramposo: ', '') + ' → gana ' + pct(RES[k].pGana) + ', 3 turnos ' + pct(RES[k].pTres) + ', filas bien ' + pct(RES[k].acierto, 0); }).join(' | '));
}

// ═════════════════════════ 3. MODOS Y GRUPOS ═════════════════════════
function historialConFallos() {      // un historial con 10 verbos fallados, para el modo repaso
  const h = {};
  VJ.VERBOS.slice(0, 20).forEach(function (v, i) {
    h[v.id] = { vistos: 3, aciertos: 2, fallos: i % 2 ? 1 + (i % 3) : 0, racha: i % 2 ? 0 : 2, descanso: 0, pendiente: i % 4 === 1,
      falsoPasado: i % 2 ? v.falsosPasado[2] || v.falsosPasado[0] : '' };
  });
  return h;
}
function medirModos() {
  titulo('3. Los tres modos y los ' + VJ.GRUPOS.length + ' grupos');
  const filas = [];
  const n = N;
  const casos = [['camino (1.ª partida)', {}]];
  VJ.GRUPOS.forEach(function (g) { casos.push(['grupo ' + g.id, { modo: 'grupo', grupo: g.id }]); });
  casos.push(['repaso (10 verbos fallados)', { modo: 'repaso', historial: historialConFallos() }]);
  casos.push(['camino con historial a medias', { modo: 'camino', historial: historialConFallos() }]);
  let perfectoSiempre = true, detalle = [];
  let peorTramposo = { p: 0, donde: '' };
  casos.forEach(function (c, i) {
    // cada medición usa semillas propias: si no, todos los grupos repetirían las mismas tiradas
    let salto = 0;
    const con = function () { const base = 100000 * (i + 1) + 10000 * (salto++); return function (s) { return Object.assign({}, c[1], { semilla: base + s }); }; };
    const P = medir('perfecto', BOTS.perfecto, con(), n, { vigilarHistorial: true });
    const A9 = medir('aprendiz 90', function () { return BOTS.aprendiz(0.9); }, con(), n, { vigilarHistorial: true });
    const A7 = medir('aprendiz 70', function () { return BOTS.aprendiz(0.7); }, con(), n, { vigilarHistorial: true });
    const AZ = medir('azar recoge', BOTS.azarRecoge, con(), n, { vigilarHistorial: true });
    const CO = medir('contador', BOTS.contador, con(), n, { vigilarHistorial: true });
    const SE = medir('sinEd', BOTS.sinEd, con(), n, { vigilarHistorial: true });
    const SM = medir('sinEdMemoria', BOTS.sinEdMemoria, con(), n, { vigilarHistorial: true });
    if (P.ganadas !== n) perfectoSiempre = false;
    detalle.push(c[0] + ' ' + P.ganadas + '/' + n);
    [['cuenta carriles', CO], ['sin -ed', SE], ['sin -ed + memoria', SM]].forEach(function (t) { if (t[1].pGana > peorTramposo.p) peorTramposo = { p: t[1].pGana, donde: t[0] + ' en ' + c[0] }; });
    RES['modo:' + c[0]] = { P: P, A9: A9, A7: A7, AZ: AZ, CO: CO, SE: SE, SM: SM };
    filas.push([c[0], pct(P.pGana, 0), mmss(media(P.dur)), pct(A9.pGana), mmss(media(A9.durGanadas)), pct(A7.pGana), pct(AZ.pGana), pct(CO.pGana),
      pct(SE.pGana) + ' (' + pct(SE.acierto, 0) + ')', pct(SM.pGana) + ' (' + pct(SM.acierto, 0) + ')']);
  });
  tabla(['Modo', 'Perfecto gana', 'y dura', 'Aprendiz 90 %', 'y dura', 'Aprendiz 70 %', 'Azar recoge', 'Cuenta carriles', '"Sin -ed" (filas bien)', '"Sin -ed"+memoria (filas bien)'], filas);
  requisito('Perfecto gana siempre en los tres modos y los ' + VJ.GRUPOS.length + ' grupos', perfectoSiempre, detalle.join(' · '));
  requisito('Cuenta carriles y los dos trucos viejos del "-ed" no ganan más del 1 % en ningún modo o grupo', peorTramposo.p <= 0.01, 'el peor: ' + peorTramposo.donde + ' gana ' + pct(peorTramposo.p));

  // Sin comodín: lo que afirma DISENO (última columna) y lo que afirma AGENTES ("se apaga con comodinInicial: 0")
  const sin = Object.assign({}, R, { comodinInicial: 0, comodinMaximo: 0 });
  const solo0 = Object.assign({}, R, { comodinInicial: 0 });
  const f2 = [];
  [0.7, 0.9].forEach(function (a) {
    const x = medir('', function () { return BOTS.aprendiz(a); }, { reglas: sin }, n, { sinVigilar: true });
    const y = medir('', function () { return BOTS.aprendiz(a); }, { reglas: solo0 }, n, { sinVigilar: true });
    f2.push(['aprendiz ' + a * 100 + ' %', pct(RES['aprendiz' + a].pGana), pct(x.pGana), a === 0.7 ? '6 %' : '73 %', pct(y.pGana)]);
  });
  console.log('\nEl comodín del profesor, medido:');
  tabla(['Perfil', 'Con comodín', 'Sin comodín (inicial 0 y máximo 0)', 'DISENO dice', 'Solo comodinInicial: 0 (se recarga)'], f2);
}

// ═════════════════════════ 4. LAS FILAS QUE SALIERON ═════════════════════════
function revisarFilas() {
  titulo('4. Las filas que de verdad salieron (todas las partidas de las secciones 2 y 3)');
  const F = FILAS, t = F.total;
  console.log('Filas de letreros vistas: ' + t + ' · verbos base vistos: ' + F.verbos);
  tabla(['', 'Izquierda', 'Centro', 'Derecha'], [
    ['La correcta, todas las filas'].concat(F.porCarril.map(function (x) { return pct(x / t, 2); })),
    ['La correcta, filas de pasado'].concat(F.porCarrilPasado.map(function (x) { return pct(x / (F.porCarrilPasado[0] + F.porCarrilPasado[1] + F.porCarrilPasado[2]), 2); })),
    ['La correcta, filas de participio'].concat(F.porCarrilParticipio.map(function (x) { return pct(x / (F.porCarrilParticipio[0] + F.porCarrilParticipio[1] + F.porCarrilParticipio[2]), 2); })),
    ['El verbo base'].concat(F.verboPorCarril.map(function (x) { return pct(x / F.verbos, 2); }))
  ]);
  console.log('Pasado en el mismo carril donde estaba el verbo base: ' + pct((F.verboVsPasado[0][0] + F.verboVsPasado[1][1] + F.verboVsPasado[2][2]) /
    (F.porCarrilPasado[0] + F.porCarrilPasado[1] + F.porCarrilPasado[2]), 1) + ' (33,3 % = no delata nada)');
  console.log('La correcta repite el carril de la fila anterior: ' + pct(F.mismoQueAnterior / F.conAnterior, 1) + ' (con dados limpios sería 33,3 %)');
  console.log('Veces que un verbo fallado volvió con el mismo falso que se eligió: ' + F.vuelveConFalso + ' · sin él: ' + F.vuelveSinFalso);
  if (F.ejemplos.length) console.log('Ejemplos de fallos:\n  - ' + F.ejemplos.join('\n  - '));
  const desv = Math.max.apply(null, F.porCarril.map(function (x) { return Math.abs(x / t - 1 / 3); }));
  requisito('La correcta se reparte parejo entre carriles (cada uno a menos de 1 punto de 33,3 %)', desv < 0.01, F.porCarril.map(function (x) { return pct(x / t, 2); }).join(' / '));
  requisito('La correcta nunca cae 3 veces seguidas en el mismo carril', F.tresSeguidas === 0, F.tresSeguidas + ' veces en ' + t + ' filas');
  requisito('Ninguna fila con dos palabras iguales o con un letrero vacío', F.repetidas === 0 && F.vacias === 0, F.repetidas + ' repetidas, ' + F.vacias + ' vacías');
  requisito('La forma correcta está siempre en la fila, y ningún falso es la correcta', F.sinCorrecta === 0 && F.falsoIgualCorrecta === 0 && F.falsoAjeno === 0,
    F.sinCorrecta + ' sin correcta, ' + F.falsoIgualCorrecta + ' falsos correctos, ' + F.falsoAjeno + ' falsos que no son del verbo');
  requisito('El libro sale la primera vez en un carril distinto al del jugador; si no se recoge, vuelve en el carril del jugador', F.verboEnMiCarril === 0 && F.vuelveLibroMal === 0 && F.vuelveLibro > 0,
    'primera vez en mi carril: ' + F.verboEnMiCarril + ' de ' + (F.verbos - F.vuelveLibro) + ' · vuelve en mi carril: ' + (F.vuelveLibro - F.vuelveLibroMal) + ' de ' + F.vuelveLibro);
  requisito('Un verbo fallado vuelve con el falso que se eligió', F.vuelveSinFalso === 0, F.vuelveConFalso + ' veces sí, ' + F.vuelveSinFalso + ' veces no');
}

// ═════════════════════════ 5. LA ESTRATEGIA DE APRENDIZAJE ═════════════════════════
// Un estudiante al que le cuestan unos verbos concretos: los falla (su primera fila) la primera vez que salen en cada
// partida y, ya corregido, los acierta si vuelven en esa misma partida. Durante las primeras partidas no aprende
// de una a otra; desde la partida "aprendeEn" ya se los sabe.
function botDificiles(dificiles, activo) {
  return {
    inicio: function (p, c) { c.m.ya = {}; },
    objeto: function (p, o, c) {
      if (o.tipo === 'verbo') return ir(p, o.correcta);
      const id = o.verbo.id;
      if (activo && dificiles.indexOf(id) >= 0 && !c.m.ya[id]) { c.m.ya[id] = true; return ir(p, primerFalso(o)); }
      ir(p, o.correcta);
    }
  };
}
function cadena(nombre, partidas, crearBot, imprimir) {
  let historial = {};
  const vistos = {}, primeraVez = [], filas = [], aparece = {}, juegos = [];
  for (let k = 1; k <= partidas; k++) {
    const antes = JSON.stringify(historial);
    const sal = jugar({ semilla: 1000 + k, historial: historial, modo: 'camino' }, crearBot(k), k * 31 + 7, { vigilarHistorial: true });
    const r = sal.resumen;
    const intacto = JSON.stringify(historial) === antes;
    const nuevos = [];
    soloIrregulares(sal.turnos).forEach(function (id) { if (!vistos[id]) { vistos[id] = k; primeraVez.push(id); nuevos.push(id); } (aparece[id] = aparece[id] || []); if (aparece[id].indexOf(k) < 0) aparece[id].push(k); });
    // Al ganar la carrera, el estudiante pasa por el puente y produce los verbos limpios que aún no tenía producidos
    if (sal.fase === 'ganada' && VJ.crearRevision && VJ.aplicarRevisionAHistorial) {
      const sinProd = soloIrregulares(sal.turnos).filter(function (id, idx, arr) {
        return arr.indexOf(id) === idx &&
          (!r.historial[id] || !r.historial[id].produccionesLimpias) &&
          !r.costaron.some(function (c) { return c.id === id; });
      });
      if (sinProd.length) {
        const revP = VJ.crearRevision({
          ids: sinProd,
          cantidad: Math.min(4, sinProd.length),
          semilla: 1000 + k,
          regulares: [],
          reglas: Object.assign({}, R, { produccionPorRevision: Math.min(4, sinProd.length) })
        });
        while (!revP.terminada()) {
          const q = revP.actual();
          revP.intentarTexto(q.correcta);
        }
        VJ.aplicarRevisionAHistorial(r.historial, revP.resumen(), R);
      }
    }
    juegos.push({ k: k, cola: soloIrregulares(sal.colaInicial), colaCompleta: sal.colaInicial, turnos: sal.turnos, resumen: r, nuevos: nuevos, grupos: sal.grupos, fase: sal.fase, tiempo: sal.tiempo,
      historialAntes: JSON.parse(antes), historialIntacto: intacto });
    filas.push([k, sal.colaInicial.map(function (id) { return ES_REGULAR[id] ? '(' + id + ')' : id; }).join(' '), nuevos.join(' ') || '—', sal.fase === 'ganada' ? 'gana' : (sal.fase === 'perdida' ? 'PIERDE' : 'NO TERMINA'), mmss(sal.tiempo),
      r.costaron.map(function (c) { return c.base + '→' + c.elegida; }).join(' ') || '—', Object.keys(vistos).length]);
    historial = r.historial;
  }
  if (imprimir) { console.log('\n' + nombre + '  — entre paréntesis, los regulares infiltrados'); tabla(['#', 'Cola con la que empieza', 'Nuevos', 'Fin', 'Dura', 'Le costaron (verbo→lo que eligió)', 'Vistos'], filas); }
  return { juegos: juegos, vistos: vistos, primeraVez: primeraVez, aparece: aparece, historial: historial };
}
function revisarAprendizaje() {
  titulo('5. La estrategia de aprendizaje: 30 partidas encadenadas pasando el historial de una a la siguiente');
  const DIF = ['make', 'go', 'take', 'buy'];
  const APRENDE = 13;      // desde esta partida ya no los falla
  console.log('Estudiante de prueba: falla la primera fila de ' + DIF.join(', ') + ' la primera vez que salen en cada partida (partidas 1 a ' + (APRENDE - 1) + '); desde la ' + APRENDE + ' ya los acierta.');
  const C = cadena('Estudiante con cuatro verbos difíciles', 30, function (k) { return botDificiles(DIF, k < APRENDE); }, true);
  const ordenDe = {}; VJ.VERBOS.forEach(function (v) { ordenDe[v.id] = v.orden; });

  // (a) el fallado vuelve dentro de la misma partida, tras 2 verbos
  const saltos = {};
  let vuelveEnPartida = 0, noVuelve = 0;
  C.juegos.forEach(function (j) {
    const fallados = {};
    j.resumen.costaron.forEach(function (c) { fallados[c.id] = true; });
    Object.keys(fallados).forEach(function (id) {
      const i = j.turnos.indexOf(id), i2 = j.turnos.indexOf(id, i + 1);
      if (i2 < 0) { if (j.fase === 'ganada') noVuelve++; return; }
      vuelveEnPartida++;
      const d = i2 - i - 1; saltos[d] = (saltos[d] || 0) + 1;
    });
  });
  console.log('\n(a) Verbo fallado, dentro de la misma partida: volvió ' + vuelveEnPartida + ' veces; verbos de por medio: ' +
    Object.keys(saltos).map(function (d) { return d + ' verbos → ' + saltos[d] + ' veces'; }).join(', ') + (noVuelve ? ' · NO volvió ' + noVuelve + ' veces' : ''));
  const saltoOk = Object.keys(saltos).every(function (d) { return Number(d) >= 1 && Number(d) <= 3; }) && noVuelve === 0 && vuelveEnPartida > 0;
  requisito('El verbo fallado vuelve en la misma partida tras 2 verbos (se admite 1 a 3)', saltoOk, JSON.stringify(saltos) + ', sin volver: ' + noVuelve);

  // (b) y abre la partida siguiente
  let abre = 0, noAbre = 0; const posiciones = [];
  for (let i = 0; i + 1 < C.juegos.length; i++) {
    const fall = {}; C.juegos[i].resumen.costaron.forEach(function (c) { fall[c.id] = true; });
    Object.keys(fall).forEach(function (id) {
      const pos = C.juegos[i + 1].cola.indexOf(id);
      posiciones.push(pos);
      if (pos >= 0) abre++; else noAbre++;
    });
  }
  const cuenta = {}; posiciones.forEach(function (p) { cuenta[p] = (cuenta[p] || 0) + 1; });
  console.log('(b) Verbo fallado, en la partida siguiente: puesto en la cola (1 = abre la partida) → ' +
    Object.keys(cuenta).map(function (p) { return 'puesto ' + (Number(p) + 1) + ': ' + cuenta[p] + ' veces'; }).join(', '));
  const primeroEsFallado = C.juegos.slice(1).every(function (j, i) { const ant = C.juegos[i].resumen.costaron; return !ant.length || ant.some(function (c) { return c.id === j.cola[0]; }); });
  requisito('Lo fallado en una partida vuelve en la siguiente, y un fallado la abre', noAbre === 0 && abre > 0 && primeroEsFallado, abre + ' veces vuelve, ' + noAbre + ' no; puestos ' +
    Object.keys(cuenta).map(function (p) { return (Number(p) + 1) + '.º×' + cuenta[p]; }).join(' '));
  // con 3 o más pendientes, solo 2 nuevos (comprobado en camino clásico y en la cadena)
  const hTresPend = {
    have: { vistos: 2, aciertos: 1, fallos: 1, racha: 0, descanso: 0, pendiente: true },
    make: { vistos: 2, aciertos: 1, fallos: 1, racha: 0, descanso: 0, pendiente: true },
    say:  { vistos: 2, aciertos: 1, fallos: 1, racha: 0, descanso: 0, pendiente: true },
    get:  { vistos: 2, aciertos: 2, fallos: 0, racha: 1, descanso: 0, pendiente: false },
    tell: { vistos: 2, aciertos: 2, fallos: 0, racha: 1, descanso: 0, pendiente: false },
    sell: { vistos: 2, aciertos: 2, fallos: 0, racha: 1, descanso: 0, pendiente: false }
  };
  const colaTresPend = VJ.armarCola({ modo: 'camino', historial: hTresPend }).cola;
  const nuevosCon3Pend = colaTresPend.filter(function (id, i) { return !hTresPend[id] && colaTresPend.indexOf(id) === i; }).length;
  let cupoOk = nuevosCon3Pend <= R.nuevosSiHayPendientes;
  const cupos = ['3pend→' + nuevosCon3Pend];
  C.juegos.forEach(function (j) {
    const pend = soloIrregulares(Object.keys(j.historialAntes)).filter(function (id) { return j.historialAntes[id].pendiente; }).length;
    const nuevosEnCola = j.cola.filter(function (id, i) { return !j.historialAntes[id] && j.cola.indexOf(id) === i; }).length;
    if (pend >= R.umbralPendientes && nuevosEnCola > R.nuevosSiHayPendientes) cupoOk = false;
    cupos.push(pend + '→' + nuevosEnCola);
  });
  console.log('    Pendientes que traía → verbos nuevos que le dieron, partida a partida: ' + cupos.join('  '));
  requisito('Con ' + R.umbralPendientes + ' o más verbos pendientes entran como mucho ' + R.nuevosSiHayPendientes + ' nuevos', cupoOk, cupos.slice(0, 10).join(' '));

  // (c) los acertados se espacian
  console.log('(c) En qué partidas salió cada verbo (con escalera de descanso 0, 1, 3 y avance de tramo):');
  const fe = [];
  ['have', 'say', 'get', 'tell', 'find'].concat(DIF).forEach(function (id) {
    if (!C.aparece[id]) return;
    const h = C.historial[id] || {};
    fe.push([id, DIF.indexOf(id) >= 0 ? 'difícil' : 'nunca falló', C.aparece[id].join(' '), h.racha, h.descanso, h.vistos, h.fallos]);
  });
  tabla(['Verbo', 'Tipo', 'Partidas en las que salió', 'Racha final', 'Descanso', 'Turnos', 'Filas falladas'], fe);
  function huecos(l) { const h = []; for (let i = 1; i < l.length; i++) h.push(l[i] - l[i - 1] - 1); return h; }
  const hHave = huecos(C.aparece.have || []);
  // el acertado sale menos que el fallado
  const vecesFacil = media(['have', 'say', 'get'].map(function (id) { return C.aparece[id].filter(function (k) { return k < APRENDE; }).length; }));
  const vecesDificil = C.aparece.make.filter(function (k) { return k < APRENDE; }).length;
  requisito('Un verbo acertado sale en menos partidas que uno que se falla', vecesFacil < vecesDificil / 2,
    'en las primeras ' + (APRENDE - 1) + ' partidas: have/say/get salen ' + vecesFacil.toFixed(1) + ' veces, make ' + vecesDificil);
  // la regla 0-1-3, comprobada sola: se le da al juego un verbo con racha 0, 1, 2, 3, 5 y se mira el descanso que guarda
  const regla = [0, 1, 2, 3, 5].map(function (racha) {
    const h = {}; VJ.VERBOS.slice(0, 8).forEach(function (v) { h[v.id] = { vistos: 3, aciertos: 3, fallos: 0, racha: racha, descanso: 0 }; });
    const s = jugar({ semilla: 1, historial: h }, BOTS.perfecto(), 1, { sinVigilar: true });
    return (racha + 1) + '→' + s.resumen.historial.have.descanso;
  });
  console.log('    Regla de descanso, sola (partidas seguidas sin fallar → partidas que descansa): ' + regla.join('  '));
  requisito('La regla de descanso da 0, 1 y 3 partidas con 1, 2 y 3 aciertos seguidos', regla.join(' ') === '1→0 2→1 3→3 4→3 6→3', regla.join(' '));
  console.log('    Lo que se ve en la práctica: HAVE, que nunca se falló, salió en las partidas ' + C.aparece.have.join(', ') + ' (huecos de ' + hHave.join(', ') + ' partidas).');
  // el difícil está en la cola de TODAS las partidas mientras se falla
  const enCola = function (id, k) { return C.juegos[k - 1].cola.indexOf(id) >= 0; };
  const difSiempre = DIF.every(function (id) {
    if (!C.vistos[id]) return false;
    for (let k = C.vistos[id]; k < APRENDE; k++) if (!enCola(id, k)) return false;
    return true;
  });
  requisito('Un verbo que se sigue fallando está en la cola de todas las partidas', difSiempre, DIF.map(function (id) {
    if (!C.vistos[id] || C.vistos[id] >= APRENDE) return id + ' (entra en partida ' + (C.vistos[id] || '—') + ')';
    let c = 0; for (let k = C.vistos[id]; k < APRENDE; k++) if (enCola(id, k)) c++;
    return id + ' ' + c + '/' + (APRENDE - C.vistos[id]);
  }).join(', '));
  const perdidas = C.juegos.filter(function (j) { return j.fase !== 'ganada'; });
  if (perdidas.length) aviso('El estudiante de los cuatro verbos difíciles perdió la partida ' + perdidas.map(function (j) { return j.k + ' (a los ' + mmss(j.tiempo) + ', cola: ' + j.cola.slice(0, 4).join(' ') + '…)'; }).join(', ') +
    ': los pendientes salen juntos al principio y tres fallos casi seguidos son captura.');

  // (d) nuevos en orden y agrupados
  let enOrden = true;
  for (let i = 1; i < C.primeraVez.length; i++) if (ordenDe[C.primeraVez[i]] !== ordenDe[C.primeraVez[i - 1]] + 1) enOrden = false;
  const nuevosPorPartida = C.juegos.map(function (j) { return j.nuevos.length; });
  console.log('(d) Orden en que entraron los verbos nuevos: ' + C.primeraVez.join(' '));
  console.log('    Nuevos por partida: ' + nuevosPorPartida.join(' ') + ' · anuncios de grupo por partida: ' + C.juegos.map(function (j) { return j.grupos.length; }).join(' '));
  requisito('Los verbos nuevos entran en el orden de Enseñanza, sin saltos', enOrden, C.primeraVez.length + ' verbos entraron; ' + (enOrden ? 'todos en orden' : 'HAY SALTOS'));
  const maxNuevos = Math.max.apply(null, nuevosPorPartida);
  const topeNuevos = R.tramoCerrado ? R.turnosPorPartida : R.nuevosPorPartida;
  requisito('Nunca entran más de ' + topeNuevos + ' verbos nuevos en una partida', maxNuevos <= topeNuevos, 'máximo ' + maxNuevos);

  // (e) resumen() lista lo que costó
  let costaronOk = true, ejemploCosto = '';
  C.juegos.forEach(function (j) {
    j.resumen.costaron.forEach(function (c) {
      const v = VJ.VERBOS.filter(function (x) { return x.id === c.id; })[0];
      const esperada = c.pide === 'pasado' ? v.pasado : (c.pide === 'participio' ? v.participio : (c.pide === 'significado' ? (v.esCorto || v.es) : v.base));
      if (!v || c.correcta !== esperada || c.elegida === esperada || !c.pista) costaronOk = false;
      if (!ejemploCosto) ejemploCosto = c.base + ', ' + c.pide + ': eligió "' + c.elegida + '", es "' + c.correcta + '" · pista: ' + c.pista;
    });
    const esperados2 = j.k < APRENDE ? j.turnos.filter(function (id, i) { return DIF.indexOf(id) >= 0 && j.turnos.indexOf(id) === i; }).length : 0;
    if (j.resumen.costaron.length !== esperados2) costaronOk = false;
    if (!j.historialIntacto) costaronOk = false;
  });
  console.log('(e) Ejemplo de lo que devuelve resumen() en "los que costaron": ' + ejemploCosto);
  requisito('resumen() lista cada verbo que costó, con lo que se eligió mal y la forma correcta', costaronOk, C.juegos.reduce(function (a, j) { return a + j.resumen.costaron.length; }, 0) + ' fallos revisados en 30 partidas');

  // (f) ¿se ven los 60?
  const total = Object.keys(C.vistos).length;
  const cuando = Math.max.apply(null, Object.keys(C.vistos).map(function (id) { return C.vistos[id]; }));
  console.log('(f) Verbos vistos al cabo de 30 partidas: ' + total + ' de ' + VJ.VERBOS.length + (total === VJ.VERBOS.length ? ' (el último entró en la partida ' + cuando + ')' : ''));
  RES.vistosDificiles = total + ' de ' + VJ.VERBOS.length + (total === VJ.VERBOS.length ? ', en la partida ' + cuando : ' tras 30 partidas');

  // (g) el estudiante que no falla nada: ¿cuántos turnos le dan cuando ya lo sabe todo?
  const P = cadena('Estudiante que nunca falla, 30 partidas', 30, function () { return BOTS.perfecto(); }, true);
  const tam = P.juegos.map(function (j) { return j.cola.length; });
  const distintos = P.juegos.map(function (j) { const s = {}; j.cola.forEach(function (id) { s[id] = 1; }); return Object.keys(s).length; });
  const pegados = P.juegos.filter(function (j) { return j.colaCompleta.some(function (id, i) { return i > 0 && j.colaCompleta[i - 1] === id; }); }).map(function (j) { return j.k; });
  const conRegs = P.juegos.map(function (j) { return j.colaCompleta.length - j.cola.length; });
  const cuandoP = Math.max.apply(null, Object.keys(P.vistos).map(function (id) { return P.vistos[id]; }));
  const cuandoTramo1 = Math.max.apply(null, VJ.VERBOS.slice(0, 10).map(function (v) { return P.vistos[v.id] || 99; }));
  console.log('\n(g) Estudiante que nunca falla: los 10 del Tramo 1 vistos en la partida ' + cuandoTramo1 + '; los ' + Object.keys(P.vistos).length + ' verbos vistos en la partida ' + cuandoP + '.');
  console.log('    Turnos de cada partida:          ' + tam.join(' '));
  console.log('    Verbos distintos en cada partida: ' + distintos.join(' '));
  console.log('    Duración de cada partida:         ' + P.juegos.map(function (j) { return mmss(j.tiempo); }).join(' '));
  if (pegados.length) console.log('    Partidas que empiezan con el mismo verbo dos turnos seguidos: ' + pegados.join(', '));
  const sabidos = soloIrregulares(Object.keys(P.historial)).filter(function (id) { return VJ.esSabido ? VJ.esSabido(P.historial[id], R) : P.historial[id].racha >= R.rachaSabido; }).length;
  console.log('    "Sabidos" (racha de ' + R.rachaSabido + ' + producción) tras 30 partidas perfectas: ' + sabidos + ' de ' + VJ.VERBOS.length);
  requisito('Con el estudiante que nunca falla, todas las partidas tienen ' + R.turnosPorPartida + ' turnos de irregulares y ' + (R.regularesPorPartida || 0) + ' de regulares', Math.min.apply(null, tam) === R.turnosPorPartida && Math.max.apply(null, tam) === R.turnosPorPartida && conRegs.every(function (x) { return x === (R.regularesPorPartida || 0); }),
    'la más corta: ' + Math.min.apply(null, tam) + ' turnos (partida ' + (tam.indexOf(Math.min.apply(null, tam)) + 1) + '), con ' + Math.min.apply(null, distintos) + ' verbos distintos');
  requisito('Quien nunca falla ve los 10 verbos del tramo en 3 partidas (y los ' + VJ.VERBOS.length + ' verbos al recorrer los 6 tramos con producción en el puente)', cuandoTramo1 <= 3 && cuandoP <= 30 && Object.keys(P.vistos).length === VJ.VERBOS.length,
    'Tramo 1 en partida ' + cuandoTramo1 + '; ' + Object.keys(P.vistos).length + ' de ' + VJ.VERBOS.length + ' en la partida ' + cuandoP + ' (' + sabidos + ' sabidos)');
  // "Lo que me cuesta" cuando solo se ha fallado un verbo
  const uno = jugar({ semilla: 3, modo: 'repaso', historial: { make: { vistos: 3, aciertos: 2, fallos: 1, racha: 0, descanso: 0, pendiente: true, falsoPasado: 'maked' } } }, BOTS.perfecto(), 1, { sinVigilar: true });
  console.log('    Modo "Lo que me cuesta" con un solo verbo fallado: cola ' + uno.colaInicial.join(' ') + ' → ' + uno.fase + ' a los ' + mmss(uno.tiempo) + ' (' + uno.colaInicial.length + ' turnos).');
  const unoPegado = uno.colaInicial.some(function (id, i) { return i > 0 && uno.colaInicial[i - 1] === id; });
  RES.repasoUno = { cola: uno.colaInicial, tiempo: uno.tiempo };
  const hReal = { make: { vistos: 3, aciertos: 2, fallos: 1, racha: 0, descanso: 0, pendiente: true, falsoPasado: 'maked' } };
  ['have', 'say', 'get'].forEach(function (id) { hReal[id] = { vistos: 2, aciertos: 2, fallos: 0, racha: 1, descanso: 0 }; });
  const real = jugar({ semilla: 3, modo: 'repaso', historial: hReal }, BOTS.perfecto(), 1, { sinVigilar: true });
  const realPegado = real.colaInicial.some(function (id, i) { return i > 0 && real.colaInicial[i - 1] === id; });
  console.log('    El mismo modo cuando ya se vieron otros 3 verbos (lo normal tras una primera partida): cola ' + real.colaInicial.join(' ') + ' → ' + real.fase + ' a los ' + mmss(real.tiempo));
  if (unoPegado) aviso('"Lo que me cuesta" con un historial de UN solo verbo (se llega fallando el primer verbo y saliendo con Menú): cola ' + uno.colaInicial.join(' ') + ', ' + mmss(uno.tiempo) + '. El relleno hasta ' + R.repasoMinVerbos + ' verbos solo usa verbos ya vistos, y ahí no hay.');
  requisito('Ninguna cola inicial trae el mismo verbo dos turnos seguidos', pegados.length === 0 && !realPegado,
    (pegados.length ? 'camino: partidas ' + pegados.join(', ') : 'camino: 0 casos') + ' · repaso con 1 fallado y 3 vistos: ' + real.colaInicial.join(' ') + ' (' + mmss(real.tiempo) + ')');
  const hp = huecos(P.aparece.have);
  console.log('    HAVE salió en las partidas ' + P.aparece.have.join(', ') + ' → huecos de ' + hp.join(', ') + ' partidas (DISENO promete 1, 2, 4, 4…).');
  const crecen = hp.slice(2).every(function (x, i, l) { return i === 0 || x >= l[i - 1]; });
  if (!crecen) aviso('Los descansos no crecen en la práctica: con el estudiante que nunca falla, HAVE vuelve con huecos de ' + hp.join(', ') + ' partidas. Con ' + VJ.VERBOS.length + ' verbos y 8 turnos por partida, a cada verbo le toca cada ' + Math.round(VJ.VERBOS.length / 8) + ' partidas, se sepa mucho o poco.');
  RES.cadenaPerfecto = { tam: tam, distintos: distintos, dur: P.juegos.map(function (j) { return j.tiempo; }), cuando: cuandoP, sabidos: sabidos };
  RES.cadenaDificiles = { total: total, cuando: cuando, saltos: saltos, posiciones: posiciones };

  // (h) aprendices de verdad encadenados (fallan al azar): cuántas partidas hacen falta para ver los 31
  const fh = [];
  [0.95, 0.9, 0.8, 0.7].forEach(function (a) {
    const cuantas = [], ganadas = [], vistos20 = [];
    for (let rep = 0; rep < 40; rep++) {
      let historial = {}, visto = {}, lleg = null, g = 0;
      for (let k = 1; k <= 40; k++) {
        const sal = jugar({ semilla: rep * 100 + k, historial: historial }, BOTS.aprendiz(a), rep * 977 + k, { vigilarHistorial: true });
        soloIrregulares(sal.turnos).forEach(function (id) { visto[id] = 1; });
        if (sal.fase === 'ganada') g++;
        historial = sal.resumen.historial;
        if (k === 20) vistos20.push(Object.keys(visto).length);
        if (lleg == null && Object.keys(visto).length === VJ.VERBOS.length) lleg = k;
      }
      cuantas.push(lleg == null ? 41 : lleg); ganadas.push(g / 40);
    }
    fh.push(['aprendiz ' + a * 100 + ' %', media(vistos20).toFixed(1), percentil(cuantas, 0.5) > 40 ? 'más de 40' : percentil(cuantas, 0.5), Math.max.apply(null, cuantas) > 40 ? 'más de 40' : Math.max.apply(null, cuantas), pct(media(ganadas), 0)]);
  });
  console.log('\n(h) Aprendices que fallan al azar, 40 partidas encadenadas, 40 estudiantes de cada tipo:');
  tabla(['Perfil', 'Verbos vistos tras 20 partidas', 'Partidas para verlos todos (mediana)', 'El más lento', 'Partidas que gana'], fh);

  // (i) ¿qué anota el juego de alguien que no sabe ningún verbo y solo aplica un truco?
  const fi = [];
  [['"sin -ed, la más corta"', BOTS.sinEd], ['"sin -ed" + memoria del turno', BOTS.sinEdMemoria], ['cuenta carriles', BOTS.contador], ['azar que recoge', BOTS.azarRecoge]].forEach(function (d) {
    const gan = [], vis = [], sab = [], lim = [], prim = [];
    for (let rep = 0; rep < 40; rep++) {
      let historial = {}, g = 0;
      for (let k = 1; k <= 20; k++) {
        const sal = jugar({ semilla: 5000 + rep * 100 + k, historial: historial }, d[1](), rep * 613 + k, { vigilarHistorial: true });
        if (sal.fase === 'ganada') { g++; if (k === 1) prim.push(1); } else if (k === 1) prim.push(0);
        historial = sal.resumen.historial;
      }
      const ids = soloIrregulares(Object.keys(historial));
      gan.push(g / 20); vis.push(ids.length);
      sab.push(ids.filter(function (id) { return historial[id].racha >= R.rachaSabido; }).length);
      lim.push(ids.filter(function (id) { return historial[id].racha >= 1; }).length);
    }
    fi.push([d[0], pct(media(prim), 0), pct(media(gan), 0), media(vis).toFixed(1), media(lim).toFixed(1), media(sab).toFixed(1)]);
    RES['campana:' + d[0]] = { primera: media(prim), gana: media(gan), vistos: media(vis), sabidos: media(sab) };
  });
  console.log('\n(i) Jugadores que NO saben ningún verbo, 20 partidas encadenadas, 40 de cada tipo: lo que el juego deja anotado de ellos');
  tabla(['Truco', 'Gana la 1.ª partida', 'Partidas que gana (de 20)', 'Verbos vistos', 'Verbos sin fallo en su última partida', 'Verbos marcados "sabido"'], fi);
}

// ═════════════════════════ 6. DURACIÓN ═════════════════════════
function revisarDuracion() {
  titulo('6. Duración (se pide que una partida quepa en 2 a 4 minutos)');
  const f = [];
  [['perfecto', RES.perfecto], ['aprendiz 95 %', RES['aprendiz0.95']], ['aprendiz 90 %', RES['aprendiz0.9']], ['aprendiz 80 %', RES['aprendiz0.8']], ['aprendiz 70 %', RES['aprendiz0.7']]].forEach(function (d) {
    const r = d[1];
    f.push([d[0], mmss(media(r.dur)), mmss(media(r.durGanadas)), mmss(Math.min.apply(null, r.durGanadas)), mmss(percentil(r.durGanadas, 0.95)), mmss(Math.max.apply(null, r.durGanadas)),
      pct(r.durGanadas.filter(function (x) { return x > 240; }).length / Math.max(1, r.durGanadas.length)), mmss(media(r.dur.filter(function (x, i) { return true; })))]);
  });
  tabla(['Perfil', 'Media (todas)', 'Media si gana', 'La más corta', '95 % gana antes de', 'La más larga', 'Ganadas de más de 4:00'], f.map(function (x) { return x.slice(0, 7); }));
  const p = RES.perfecto, a9 = RES['aprendiz0.9'], a7 = RES['aprendiz0.7'];
  const techo = Math.max(percentil(p.durGanadas, 0.95), percentil(a9.durGanadas, 0.95), percentil(RES['aprendiz0.95'].durGanadas, 0.95), percentil(RES['aprendiz0.8'].durGanadas, 0.95));
  requisito('Tope: el 95 % de las partidas ganadas (perfecto y aprendices de 80 a 95 %) dura 4:00 o menos', techo <= 240, 'la peor: ' + mmss(techo));
  if (media(p.durGanadas) < 120) aviso('Piso de 2:00 (ya no es requisito): el perfecto tarda ' + mmss(media(p.durGanadas)) + ' y el aprendiz de 90 % ' + mmss(media(a9.durGanadas)) + '.');
  const cola7 = a7.durGanadas.filter(function (x) { return x > 240; }).length;
  if (cola7) aviso('El aprendiz de 70 % que gana pasa de 4:00 en ' + cola7 + ' de ' + a7.durGanadas.length + ' victorias (la más larga ' + mmss(Math.max.apply(null, a7.durGanadas)) + ').');

  // ¿Puede una partida no acabar nunca?
  const terco = { objeto: function (pp, o) { if (o.tipo === 'verbo') return ir(pp, o.correcta); ir(pp, o.verbo.id === 'say' && o.pide === 'pasado' ? primerFalso(o) : o.correcta); } };
  const sal = jugar({ semilla: 5, historial: {} }, terco, 1, { sinVigilar: true });
  console.log('\nEstudiante que sabe todo menos el pasado de SAY, y lo falla siempre (semilla 5): ' +
    (sal.fase === 'corriendo' ? 'a los ' + mmss(sal.tiempo) + ' la partida SIGUE; lleva ' + sal.turnos.length + ' turnos, ' + sal.turnos.filter(function (x) { return x === 'say'; }).length + ' de ellos de SAY' : 'termina ' + sal.fase + ' a los ' + mmss(sal.tiempo)));
  RES.terco = { fase: sal.fase, tiempo: sal.tiempo, turnos: sal.turnos.length };
  const esq = RES.esquiva;
  console.log('Puntos: el perfecto hace como mucho ' + RES.perfecto.puntos + '; el que solo persigue estrellas y deja pasar el libro hace como mucho ' + RES.estrellas.puntos + ' (en la segunda ronda llegaba a 27.090 porque la partida no acababa).');
  console.log('Jugador que esquiva el libro siempre: ' + (esq.noTermina ? 'NO TERMINA en ' + esq.noTermina + ' de ' + esq.n + ' partidas (a los ' + mmss(TOPE) + ' seguía)' : 'termina siempre; gana ' + esq.ganadas + ' de ' + esq.n + ' y dura ' + mmss(media(esq.dur)) + ' de media (el profesor le entrega el libro a la segunda)'));
  requisito('Una partida siempre termina, en menos de 6 minutos (quien falla siempre el mismo pasado)', sal.fase !== 'corriendo' && sal.tiempo < 360, sal.fase === 'corriendo' ? 'sigue corriendo a los ' + mmss(sal.tiempo) : sal.fase + ' a los ' + mmss(sal.tiempo) + ' con ' + sal.turnos.length + ' turnos');
  requisito('Una partida siempre termina, en menos de 6 minutos (todas las partidas de todos los perfiles, incluido quien no recoge el libro)', MAXIMO.t < 360, 'la más larga: ' + mmss(MAXIMO.t) + ' — ' + MAXIMO.donde);
  const terco2 = { objeto: function (pp, o) { if (o.tipo === 'verbo') return ir(pp, o.correcta); ir(pp, o.verbo.id === 'say' ? primerFalso(o) : o.correcta); } };
  const sal2 = jugar({ semilla: 5, historial: {} }, terco2, 1, { sinVigilar: true });
  console.log('El mismo, fallando siempre las dos formas de SAY: termina ' + sal2.fase + ' a los ' + mmss(sal2.tiempo) + ' con ' + sal2.turnosCumplidos + ' turnos limpios.');
  RES.terco2 = { fase: sal2.fase, tiempo: sal2.tiempo, turnos: sal2.turnosCumplidos };
}

// ═════════════════════════ 7. ROBUSTEZ ═════════════════════════
function revisarRobustez() {
  titulo('7. Robustez');
  const filas = [];
  // blando = true: datos dañados a propósito, más allá de lo pedido. Si falla, sale como aviso y no como requisito.
  function caso(nombre, f, blando) {
    let ok = false, nota = '';
    try { const r = f(); ok = r === true || (r && r.ok); nota = r === true ? '' : (r && r.nota) || String(r); }
    catch (err) { ok = false; nota = 'EXCEPCIÓN: ' + err.message; }
    filas.push([ok ? 'cumple' : (blando ? 'falla (aviso)' : 'NO CUMPLE'), nombre, nota]);
    if (!ok && blando) { aviso('Datos dañados: ' + nombre + ' → ' + nota); return true; }
    return ok;
  }
  let todo = true;
  function huella(sal) { return sal.eventos.join('|') + '#' + sal.fase + '#' + sal.tiempo.toFixed(6) + '#' + JSON.stringify(sal.resumen.historial); }

  // misma semilla dos veces
  todo = caso('Misma semilla dos veces da la misma partida (200 semillas, aprendiz 80 %)', function () {
    let dif = 0;
    for (let s = 1; s <= 200; s++) {
      const a = jugar({ semilla: s }, BOTS.aprendiz(0.8), s, { sinVigilar: true }), b = jugar({ semilla: s }, BOTS.aprendiz(0.8), s, { sinVigilar: true });
      if (huella(a) !== huella(b) || JSON.stringify(a.resumen) !== JSON.stringify(b.resumen)) dif++;
    }
    return { ok: dif === 0, nota: dif + ' diferentes' };
  }) && todo;
  todo = caso('Semillas distintas dan partidas distintas', function () {
    const g = {}; for (let s = 1; s <= 200; s++) g[jugar({ semilla: s }, BOTS.perfecto(), s, { sinVigilar: true }).carriles.join('')] = 1;
    return { ok: Object.keys(g).length >= 199, nota: Object.keys(g).length + ' repartos de carriles distintos en 200 semillas' };
  }) && todo;
  // dt distintos
  todo = caso('Pasos de tiempo distintos dan lo mismo (1/120, 1/60, 1/30, 1/10, 0,25 s; 100 semillas)', function () {
    let dif = 0, maxT = 0, ej = '';
    const dts = [1 / 120, 1 / 60, 1 / 30, 1 / 10, 0.25];
    for (let s = 1; s <= 100; s++) {
      const ref = jugar({ semilla: s }, BOTS.aprendiz(0.85), s, { sinVigilar: true, dt: dts[0] });
      for (let i = 1; i < dts.length; i++) {
        const x = jugar({ semilla: s }, BOTS.aprendiz(0.85), s, { sinVigilar: true, dt: dts[i] });
        maxT = Math.max(maxT, Math.abs(x.tiempo - ref.tiempo));
        if (x.eventos.join('|') !== ref.eventos.join('|') || x.fase !== ref.fase || Math.abs(x.tiempo - ref.tiempo) > 1e-6 ||
          JSON.stringify(x.resumen.historial) !== JSON.stringify(ref.resumen.historial)) { dif++; if (!ej) ej = 'semilla ' + s + ', dt ' + dts[i].toFixed(4); }
      }
    }
    return { ok: dif === 0, nota: dif + ' diferencias' + (ej ? ' (p. ej. ' + ej + ')' : '') + '; mayor diferencia de tiempo ' + maxT.toExponential(1) + ' s' };
  }) && todo;
  todo = caso('paso(10) no avanza más de 0,25 s; paso(0), paso(-1), paso(NaN), paso("x") no avanzan ni rompen', function () {
    const p = VJ.crearPartida({ semilla: 1 });
    p.paso(10); const t1 = p.estado.tiempo;
    p.paso(0); p.paso(-1); p.paso(NaN); p.paso('x'); p.paso(); p.paso(null); p.paso(Infinity);
    const t2 = p.estado.tiempo;
    return { ok: Math.abs(t1 - 0.25) < 1e-9 && t2 >= t1 && t2 <= t1 + 0.25 + 1e-9 && isFinite(t2), nota: 'tras paso(10): ' + t1 + ' s; tras los raros: ' + t2 + ' s' };
  }) && todo;

  // historiales
  const juegaBien = function (op) { const sal = jugar(op, BOTS.perfecto(), 1, { sinVigilar: true }); return sal; };
  todo = caso('Historial vacío, null, undefined y sin el campo: se juega igual', function () {
    const a = juegaBien({ semilla: 3, historial: {} }), b = juegaBien({ semilla: 3, historial: null }), c = juegaBien({ semilla: 3, historial: undefined }), d = juegaBien({ semilla: 3 });
    const ok = [b, c, d].every(function (x) { return huella(x) === huella(a); }) && a.fase === 'ganada';
    return { ok: ok, nota: 'cola: ' + a.colaInicial.join(' ') };
  }) && todo;
  todo = caso('crearPartida() sin nada', function () { const p = VJ.crearPartida(); p.paso(0.1); return p.estado.fase === 'corriendo'; }) && todo;
  todo = caso('Historial con ids que no existen: se ignoran y la partida es la de siempre', function () {
    const a = juegaBien({ semilla: 3, historial: {} }), b = juegaBien({ semilla: 3, historial: { fantasma: { vistos: 9, fallos: 9, pendiente: true }, '': { vistos: 1 }, constructor: { vistos: 2, pendiente: true } } });
    return { ok: b.eventos.join('|') === a.eventos.join('|') && b.fase === 'ganada', nota: 'el historial devuelto conserva: ' + Object.keys(b.resumen.historial).filter(function (k) { return !VJ.VERBOS.some(function (v) { return v.id === k; }); }).join(', ') };
  }) && todo;
  todo = caso('Modo repaso con un historial donde solo hay fallos de ids inexistentes', function () {
    const b = juegaBien({ semilla: 3, modo: 'repaso', historial: { fantasma: { vistos: 9, fallos: 9, pendiente: true } } });
    return { ok: b.fase === 'ganada', nota: 'modo que reporta: ' + b.resumen.modo };
  }) && todo;
  todo = caso('Historial con basura (textos, negativos, null, arreglos): no rompe y termina', function () {
    const basura = [{ have: null, make: 'x', say: 7, get: [], tell: { vistos: 'muchos', fallos: -3, racha: 1e12, descanso: 'x', pendiente: 'no' } },
      [], 'texto', 42, { have: { vistos: NaN, aciertos: Infinity, fallos: {}, racha: -5, descanso: 2.5 } }, { have: { vistos: 3, falsoPasado: 99, falsoParticipio: 'inventado' } }];
    let malas = 0; const notas = [];
    basura.forEach(function (h, i) {
      const s = juegaBien({ semilla: 4, historial: h });
      const txt = JSON.stringify(s.resumen.historial);
      if (s.fase !== 'ganada' || /null|NaN|Infinity/.test(txt)) { malas++; notas.push('caso ' + i + ': ' + s.fase + (/null/.test(txt) ? ', guarda null (era NaN o infinito)' : '')); }
    });
    return { ok: malas === 0, nota: malas + ' de ' + basura.length + ' con problema ' + notas.join('; ') };
  }, true) && todo;
  todo = caso('Historial dañado con descanso negativo: el verbo no debe desaparecer del juego', function () {
    let h = {}; VJ.VERBOS.forEach(function (v) { h[v.id] = { vistos: 2, aciertos: 2, fallos: 0, racha: 1, descanso: 0 }; });
    h.go = { vistos: 2, aciertos: 1, fallos: 1, racha: 0, descanso: -1, pendiente: true };
    let sale = 0;
    for (let k = 0; k < 10; k++) { const s = jugar({ semilla: k + 1, historial: h }, BOTS.perfecto(), 1, { sinVigilar: true }); if (s.turnos.indexOf('go') >= 0) sale++; h = s.resumen.historial; }
    return { ok: sale > 0, nota: 'GO (pendiente, descanso −1) salió en ' + sale + ' de 10 partidas; descanso guardado al final: ' + h.go.descanso };
  }, true) && todo;

  // modos raros
  todo = caso('Modo repaso sin nada que repasar: no se rompe', function () {
    const s = juegaBien({ semilla: 2, modo: 'repaso', historial: {} });
    return { ok: s.fase === 'ganada' && soloIrregulares(s.colaInicial).length === 8, nota: 'juega el camino: ' + s.colaInicial.join(' ') + ' · estado.modo = "' + s.partida.estado.modo + '"' };
  }) && todo;
  todo = caso('Modo grupo con un id que no existe: no se rompe', function () {
    const s = juegaBien({ semilla: 2, modo: 'grupo', grupo: 'no-existe' });
    const s2 = juegaBien({ semilla: 2, modo: 'grupo' });
    return { ok: s.fase === 'ganada' && s2.fase === 'ganada', nota: 'juega en silencio el grupo "' + s.partida.estado.grupo + '": ' + s.colaInicial.join(' ') };
  }) && todo;
  todo = caso('Modo desconocido ("turbo") se toma como camino', function () { const s = juegaBien({ semilla: 2, modo: 'turbo' }); return { ok: s.fase === 'ganada', nota: 'estado.modo = "' + s.partida.estado.modo + '"' }; }) && todo;
  todo = caso('Semillas raras (0, −1, 1,5, "abc", null, 2^40) no rompen', function () {
    const colas = [0, -1, 1.5, 'abc', null, Math.pow(2, 40), NaN].map(function (s) { return juegaBien({ semilla: s }).fase; });
    return { ok: colas.every(function (f) { return f === 'ganada'; }), nota: colas.join(',') };
  }) && todo;
  todo = caso('Lista de verbos vacía o de un solo verbo', function () {
    const a = VJ.crearPartida({ verbos: [], semilla: 1 }); a.paso(0.1);
    const b = jugar({ verbos: [VJ.VERBOS[0]], semilla: 1 }, BOTS.perfecto(), 1, { sinVigilar: true });
    return { ok: b.fase === 'ganada', nota: 'sin verbos: fase "' + a.estado.fase + '" desde el arranque; con un verbo: cola ' + b.colaInicial.join(' ') };
  }) && todo;

  // mover
  todo = caso('mover más allá de los bordes y 1.000 veces por cuadro: el carril nunca sale de 0–2', function () {
    const p = VJ.crearPartida({ semilla: 9 }); const az = crearAzar(5); let fuera = 0, raros = 0;
    for (let i = 0; i < 400 && p.estado.fase === 'corriendo'; i++) {
      for (let k = 0; k < 1000; k++) { p.mover(az() < 0.5 ? -1 : 1); const c = p.estado.carril; if (c !== 0 && c !== 1 && c !== 2) fuera++; }
      [-99, 99, 0, 0.3, -0.3, NaN, undefined, null, 'x', Infinity, -Infinity, {}, '1', '-1'].forEach(function (d) { p.mover(d); const c = p.estado.carril; if (c !== 0 && c !== 1 && c !== 2) raros++; });
      for (let k = 0; k < 10; k++) p.mover(-1);
      if (p.estado.carril !== 0) fuera++;
      for (let k = 0; k < 10; k++) p.mover(1);
      if (p.estado.carril !== 2) fuera++;
      p.paso(DT);
      if (!(p.estado.x >= 0 && p.estado.x <= 2)) fuera++;
    }
    return { ok: fuera === 0 && raros === 0, nota: fuera + ' veces fuera, ' + raros + ' con argumentos raros' };
  }) && todo;
  todo = caso('irA con valores raros (−5, 9, 1,4, NaN, "2")', function () {
    const p = VJ.crearPartida({ semilla: 9 }); const v = [-5, 9, 1.4, NaN, '2', null, undefined].map(function (c) { return p.irA(c); });
    return { ok: v.every(function (c) { return c === 0 || c === 1 || c === 2; }), nota: v.join(',') };
  }) && todo;
  todo = caso('Terminada la partida, mover y paso no hacen nada, y resumen() no cambia ni toca el historial recibido', function () {
    const h = { have: { vistos: 1, aciertos: 1, fallos: 0, racha: 1, descanso: 0, pendiente: false } }; const copia = JSON.stringify(h);
    const s = jugar({ semilla: 6, historial: h }, BOTS.aprendiz(0.6), 3, { sinVigilar: true });
    const p = s.partida, r1 = JSON.stringify(p.resumen()), t = p.estado.tiempo, c = p.estado.carril;
    p.mover(1); p.mover(-1); p.mover(-1); const ev = p.paso(1);
    return { ok: JSON.stringify(p.resumen()) === r1 && p.estado.tiempo === t && ev.length === 0 && p.estado.carril === c && JSON.stringify(h) === copia, nota: 'fase ' + p.estado.fase };
  }) && todo;
  todo = caso('resumen() a mitad de partida no altera la partida', function () {
    const a = VJ.crearPartida({ semilla: 8 }), b = VJ.crearPartida({ semilla: 8 });
    for (let i = 0; i < 2000; i++) { a.mover(i % 7 === 0 ? 1 : -1); b.mover(i % 7 === 0 ? 1 : -1); a.resumen(); a.paso(DT); b.paso(DT); }
    return JSON.stringify(a.resumen()) === JSON.stringify(b.resumen());
  }) && todo;
  todo = caso('El estado no trae números rotos (NaN) en ningún momento (100 partidas de aprendiz 70 %)', function () {
    let malos = 0;
    for (let s = 1; s <= 100; s++) {
      const p = VJ.crearPartida({ semilla: s }); const az = crearAzar(s);
      let ult = null;
      while (p.estado.fase === 'corriendo' && p.estado.tiempo < TOPE) {
        const o = p.estado.objetos[0];
        if (o && o !== ult) { ult = o; ir(p, o.tipo === 'verbo' || az() < 0.7 ? o.correcta : (o.correcta + 1) % 3); }
        p.paso(DT);
        const e = p.estado;
        ['tiempo', 'distancia', 'x', 'monstruo', 'monstruoTam', 'peligro', 'lectura', 'velocidad', 'puntos'].forEach(function (k) { if (!isFinite(e[k])) malos++; });
        if (e.monstruo < 0 || e.monstruo > 1 || e.lectura < R.lecturaMinima - 1e-9 || e.lectura > R.lecturaInicial + 1e-9 || e.comodin < 0 || e.comodin > R.comodinMaximo || e.peligroFilas < 0 || e.peligroFilas > R.peligroFilas) malos++;
      }
    }
    return { ok: malos === 0, nota: malos + ' valores fuera de rango' };
  }) && todo;
  tabla(['Resultado', 'Prueba', 'Detalle'], filas);
  requisito('Robustez: ' + filas.length + ' pruebas de entradas raras', todo, filas.filter(function (f) { return f[0] !== 'cumple'; }).length + ' no cumplen');

  // Reglas del peligro medidas en directo (no se da por cierto lo que dice DISENO)
  console.log('\nLa regla del peligro, comprobada jugada a jugada (semilla 1):');
  function guion(pasos) {      // pasos: lista de 'b' (bien), 'm' (mal), 'n' (no recoge) aplicados en orden a cada objeto
    let i = 0;
    const bot = { objeto: function (p, o) { const a = pasos[i++] || 'b'; if (o.tipo === 'verbo') { if (a !== 'n') ir(p, o.correcta); else ir(p, p.estado.carril); } else ir(p, a === 'm' ? (o.correcta + 1) % 3 : o.correcta); } };
    const s = jugar({ semilla: 1 }, bot, 1, { sinVigilar: true });
    return s;
  }
  const g1 = guion(['b', 'm', 'm', 'b', 'm']);            // error, error (comodín), bien... error → ¿captura?
  const g2 = guion(['b', 'm', 'b', 'b', 'b', 'm', 'b', 'b', 'b', 'm']);
  const g3 = guion(['n', 'n', 'n']);
  const g4 = guion(['b', 'm', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'm', 'm', 'b', 'b', 'm', 'm']);
  const linea = function (s) { return s.eventos.filter(function (x) { return /^(error|salvado|captura|comodin)/.test(x); }).map(function (x) { return x.split(':')[0] + '(' + x.split(':')[2] + ')'; }).join(' → ') + ' ⇒ ' + s.fase + ' a los ' + s.tiempo.toFixed(1) + ' s'; };
  console.log('  recoge, falla, falla, acierta, falla:            ' + linea(g1));
  console.log('  un fallo cada 4 filas (nunca dos seguidos):      ' + linea(g2).slice(0, 110));
  console.log('  no recoge el verbo tres veces:                   ' + linea(g3));
  const ok1 = g1.fase === 'perdida' && g1.eventos.filter(function (x) { return /^salvado/.test(x); }).length === 1;
  const ok3 = g3.eventos.filter(function (x) { return /^sinrecoger/.test(x); }).length >= 1 && g3.eventos.filter(function (x) { return /^error::recoger|^error:[a-z]+:recoger/.test(x); }).length === 0;
  console.log('  (regla nueva: no recoger el libro ya no es error; sale "sinrecoger" ' + g3.eventos.filter(function (x) { return /^sinrecoger/.test(x); }).length + ' veces en ese guion)');
  const ok2 = g2.eventos.filter(function (x) { return /^(captura|salvado)/.test(x); }).length === 0;
  requisito('Peligro: dos errores seguidos gastan el comodín y el tercero es captura; errores separados por 2 aciertos no; no recoger el libro no es error', ok1 && ok2 && ok3,
    'guion 1: ' + g1.fase + ' · guion 2: ' + (ok2 ? 'sin sustos' : 'CON susto') + ' · no recoger: ' + (ok3 ? 'no cuenta como error' : 'CUENTA COMO ERROR'));
  RES.quietoSeg = g3.tiempo;
}

// ═════════════════════════ 8. LA REVISIÓN CON ORACIONES (segunda y cuarta etapa) ═════════════════════════
function revisarRevision() {
  titulo('8. La revisión con oraciones (js/oraciones.js y VJ.crearRevision)');
  const O = VJ.ORACIONES || [];
  if (!O.length || !VJ.crearRevision) { requisito('Existe la revisión con oraciones', false, 'no hay VJ.ORACIONES o VJ.crearRevision'); return; }
  const porId = {}; VJ.VERBOS.concat(VJ.REGULARES || []).forEach(function (v) { porId[v.id] = v; });
  const MARCA = /(yesterday|last (night|week|weekend|year|month)|\bago\b|\bin (19|20)\d\d)/i;
  const problemas = [], ids = {}, porVerbo = {};
  let maxTexto = 0, maxEs = 0, sinSaber = 0, unicaSinEd = 0, baseEntreFalsos = 0;
  O.forEach(function (o) {
    const v = porId[o.verbo];
    if (ids[o.id]) problemas.push(o.id + ': id repetido'); ids[o.id] = 1;
    if (!v) { problemas.push(o.id + ': verbo que no existe (' + o.verbo + ')'); return; }
    if (o.forma !== 'pasado' && o.forma !== 'participio' && o.forma !== 'base') problemas.push(o.id + ': forma rara (' + o.forma + ')');
    const correcta = o.forma === 'pasado' ? v.pasado : (o.forma === 'participio' ? v.participio : v.base);
    (porVerbo[v.id] = porVerbo[v.id] || { pasado: 0, participio: 0, base: 0 })[o.forma]++;
    if (o.texto.split('___').length !== 2 || /____/.test(o.texto)) problemas.push(o.id + ': no tiene exactamente un hueco');
    if (!o.senal || o.texto.indexOf(o.senal) < 0) problemas.push(o.id + ': la señal "' + o.senal + '" no está en el texto');
    if (!Array.isArray(o.falsos) || o.falsos.length !== 2 || o.falsos[0] === o.falsos[1]) problemas.push(o.id + ': no trae exactamente 2 falsos distintos');
    (o.falsos || []).forEach(function (f) { if (f === correcta) problemas.push(o.id + ': el falso "' + f + '" es la correcta'); });
    if ((o.falsos || []).filter(function (f) { return /ed$/.test(f); }).length > 1) problemas.push(o.id + ': los dos falsos terminan en -ed');
    if (v.grupo === 'regulares' && o.forma !== 'base' && (o.falsos || []).some(function (f) { return /ed$/.test(f); })) problemas.push(o.id + ': oración de regular con un falso en -ed');
    if ((o.falsos || []).some(function (f) { return f.length > R.maxLetras; })) problemas.push(o.id + ': falso de más de ' + R.maxLetras + ' letras');
    if (o.texto.length > 30) problemas.push(o.id + ': texto de ' + o.texto.length + ' caracteres (máximo 30)');
    if (!o.es || o.es.length > 34) problemas.push(o.id + ': traducción de ' + (o.es || '').length + ' caracteres (máximo 34)');
    maxTexto = Math.max(maxTexto, o.texto.length); maxEs = Math.max(maxEs, (o.es || '').length);
    if (o.forma === 'pasado') {
      if (!MARCA.test(o.texto)) problemas.push(o.id + ': pasado sin marca de tiempo terminado');
      if (/\bdid\b|didn't|\?/i.test(o.texto)) problemas.push(o.id + ': pasado lleva did, didn\'t o pregunta');
      if (MARCA.test(o.texto) && !MARCA.test(o.senal)) problemas.push(o.id + ': la señal "' + o.senal + '" no es la marca de tiempo');
    } else if (o.forma === 'participio') {
      if (!/\b(have|has|had) ___/.test(o.texto)) problemas.push(o.id + ': participio sin have/has pegado al hueco');
      if (MARCA.test(o.texto)) problemas.push(o.id + ': participio con marca de tiempo terminado');
      if (/\bdid\b|didn't|\?/i.test(o.texto)) problemas.push(o.id + ': participio lleva did, didn\'t o pregunta');
      if (!/^(have|has|had)$/.test(o.senal)) problemas.push(o.id + ': la señal "' + o.senal + '" no es have/has');
    } else if (o.forma === 'base') {
      if (!/\bdid\b|didn't/i.test(o.texto)) problemas.push(o.id + ': oración de base sin did o didn\'t');
      if (!/^(didn't|did)$/i.test(o.senal)) problemas.push(o.id + ': la señal "' + o.senal + '" no es didn\'t ni Did');
    }
    // ¿se saca sin saber? descartando lo que termina en -ed y la forma base (que el jugador ya vio en el libro)
    const ops = [correcta].concat(o.falsos || []);
    const sinEd = ops.filter(function (w) { return !/ed$/.test(w); });
    if (sinEd.length === 1 && sinEd[0] === correcta) unicaSinEd++;
    const cand = sinEd.filter(function (w) { return w !== v.base; });
    if (cand.length === 1 && cand[0] === correcta) sinSaber++;
    if ((o.falsos || []).indexOf(v.base) >= 0) baseEntreFalsos++;
  });
  const sinPar = Object.keys(porId).filter(function (id) { const p = porVerbo[id]; return !p || !p.pasado || !p.participio || !p.base; });
  console.log('Oraciones: ' + O.length + ' · texto más largo ' + maxTexto + ' (tope 30) · traducción más larga ' + maxEs + ' (tope 34)');
  console.log('Verbos sin oración de los 3 moldes: ' + (sinPar.join(', ') || 'ninguno'));
  console.log(problemas.length ? 'PROBLEMAS:\n  - ' + problemas.join('\n  - ') : 'Sin problemas contra el contrato.');
  console.log('La correcta es la única opción sin -ed: ' + unicaSinEd + ' de ' + O.length + ' · sale descartando "-ed" y la forma base del libro: ' + sinSaber + ' de ' + O.length +
    ' (' + Math.round(100 * sinSaber / O.length) + ' %) · oraciones con la forma base entre los falsos: ' + baseEntreFalsos);
  requisito('Oraciones contra el contrato (ids, verbo, un hueco, señal, 2 falsos, largos 30/34, marca de tiempo, have/has o didn\'t/Did)', problemas.length === 0, problemas.length + ' problemas en ' + O.length + ' oraciones');
  if (sinPar.length) aviso('Verbos sin oración en alguno de los 3 moldes: ' + sinPar.join(', '));
  RES.oraciones = { n: O.length, sinSaber: sinSaber, unicaSinEd: unicaSinEd };

  // ── la lógica ──
  const n = 1000;
  const tramos = Math.ceil(VJ.VERBOS.length / (R.verbosPorTramo || 10));
  function jugarRev(op, elegirFn) {       // elegirFn(oracion, azar) → índice
    const rev = VJ.crearRevision(op), az = crearAzar((op.semilla || 1) * 31 + 5);
    const vistas = [], veces = {}; let pasos = 0, primeraBien = 0, primeras = 0;
    while (rev.estado.fase !== 'terminada' && pasos < 500) {
      rev.destapar();
      const it = rev.estado.actual;
      vistas.push(it.id + ':' + it.opciones.join('/')); veces[it.id] = (veces[it.id] || 0) + 1;
      const i = elegirFn(it, az);
      if (veces[it.id] === 1) { primeras++; if (i === it.indiceCorrecta) primeraBien++; }
      rev.elegir(i); rev.siguiente(); pasos++;
    }
    return { rev: rev, pasos: pasos, vistas: vistas, veces: veces, primeraBien: primeraBien, primeras: primeras, r: rev.resumen() };
  }
  const bien = function (it) { return it.indiceCorrecta; };
  const mal = function (it) { return (it.indiceCorrecta + 1) % 3; };
  const azarB = function (it, az) { return Math.floor(az() * 3); };
  const sinEdB = function (it, az) {
    let c = []; it.opciones.forEach(function (w, i) { if (!/ed$/.test(w)) c.push(i); });
    const sinBase = c.filter(function (i) { return it.opciones[i] !== it.verbo.base; });
    if (sinBase.length) c = sinBase;
    if (!c.length) c = [0, 1, 2];
    return c[Math.floor(az() * c.length)];
  };
  let okBien = 0, okMal = 0, okAzar = 0, mitad = 0, total = 0, repetidoVerbo = 0, igual = 0, distinto = 0, incompletas = 0;
  const pos = [0, 0, 0]; let azarBien = 0, azarPrim = 0, edBien = 0, edPrim = 0, edSello = 0, azarSello = 0, maxPasos = 0;
  const porTramo = [];
  for (let k = 1; k <= tramos; k++) {
    const idsT = VJ.verbosDeTramo(k).map(function (v) { return v.id; });
    let mitadK = 0;
    for (let s = 1; s <= n; s++) {
      const op = { ids: idsT, cantidad: R.revisionDeTramo || 6, semilla: s };
      total++;
      const a = jugarRev(op, bien);
      if (a.rev.estado.total !== op.cantidad) incompletas++;
      if (a.pasos === a.rev.estado.total && a.r.sello && a.r.limpias === a.pasos && a.r.terminada) okBien++;
      const formas = a.r.oraciones.map(function (o) { return o.forma; });
      if (formas.indexOf('pasado') >= 0 && formas.indexOf('participio') >= 0 && formas.indexOf('base') >= 0 && a.r.oraciones.length === op.cantidad) { mitad++; mitadK++; }
      const vs = {}; a.r.oraciones.forEach(function (o) { if (vs[o.verbo]) repetidoVerbo++; vs[o.verbo] = 1; });
      a.vistas.forEach(function (x, i) { const ops = x.split(':')[1].split('/'); pos[ops.indexOf(a.r.oraciones.filter(function (o) { return o.id === x.split(':')[0]; })[0].correcta)]++; });
      const a2 = jugarRev(op, bien); if (a2.vistas.join('|') === a.vistas.join('|')) igual++;
      const a3 = jugarRev({ ids: idsT, cantidad: op.cantidad, semilla: s + 100000 }, bien); if (a3.vistas.join('|') !== a.vistas.join('|')) distinto++;
      const b = jugarRev(op, mal);
      if (b.r.terminada && !b.r.sello && b.pasos === 2 * b.rev.estado.total && Object.keys(b.veces).every(function (id) { return b.veces[id] === 2; }) && b.r.falladas === b.rev.estado.total) okMal++;
      const c = jugarRev(op, azarB);
      if (c.r.terminada && c.pasos <= 2 * c.rev.estado.total && Object.keys(c.veces).every(function (id) { return c.veces[id] <= 2; }) && c.r.sello === (c.r.limpias === c.rev.estado.total)) okAzar++;
      azarBien += c.primeraBien; azarPrim += c.primeras; if (c.r.sello) azarSello++;
      maxPasos = Math.max(maxPasos, c.pasos, b.pasos);
      const d = jugarRev(op, sinEdB); edBien += d.primeraBien; edPrim += d.primeras; if (d.r.sello) edSello++;
    }
    porTramo.push('tramo ' + k + ': ' + Math.round(100 * mitadK / n) + ' %');
  }
  tabla(['Jugador de la revisión', 'Acierta a la primera', 'Se lleva el sello', 'Termina'], [
    ['acierta todo', '100 %', pct(okBien / total, 0), okBien + ' de ' + total + ' en ' + (R.revisionDeTramo || 6) + ' pasos'],
    ['falla todo', '0 %', '0 %', okMal + ' de ' + total + ' en ' + 2 * (R.revisionDeTramo || 6) + ' pasos, cada oración 2 veces'],
    ['al azar', pct(azarBien / azarPrim), pct(azarSello / total, 2), okAzar + ' de ' + total + ' (nunca más de ' + maxPasos + ' pasos)'],
    ['truco: sin "-ed" y sin la forma del libro', pct(edBien / edPrim), pct(edSello / total), '—']
  ]);
  console.log('Variedad de los 3 moldes (pasado, participio y base): ' + porTramo.join(' · '));
  console.log('Posición de la correcta: ' + pos.map(function (x) { return pct(x / (pos[0] + pos[1] + pos[2]), 1); }).join(' / ') + ' · verbo repetido dentro de una revisión: ' + repetidoVerbo + ' veces');
  requisito('Revisión: quien acierta todo termina en ' + (R.revisionDeTramo || 6) + ' pasos y con sello', okBien === total && incompletas === 0, okBien + ' de ' + total + ' (' + incompletas + ' con menos oraciones de las pedidas)');
  requisito('Revisión: quien falla termina siempre, sin sello, y cada oración vuelve una sola vez', okMal === total && okAzar === total, 'falla todo ' + okMal + ' de ' + total + ' · al azar ' + okAzar + ' de ' + total);
  requisito('Revisión: misma semilla, mismo orden; otra semilla, otro orden', igual === total && distinto > 0.95 * total, igual + ' iguales de ' + total + ' · ' + distinto + ' distintas con otra semilla');
  requisito('Revisión: variedad de los 3 moldes (pasado, participio y base) en los ' + tramos + ' tramos', mitad === total, mitad + ' de ' + total + ' · ' + porTramo.join(' · '));
  const desv = Math.max.apply(null, pos.map(function (x) { return Math.abs(x / (pos[0] + pos[1] + pos[2]) - 1 / 3); }));
  requisito('Revisión: la correcta se reparte parejo entre los tres letreros', desv < 0.015, pos.map(function (x) { return pct(x / (pos[0] + pos[1] + pos[2]), 1); }).join(' / '));
  requisito('Revisión: al azar se acierta cerca de 1 de cada 3 a la primera', Math.abs(azarBien / azarPrim - 1 / 3) < 0.02, pct(azarBien / azarPrim) + '; se lleva el sello ' + pct(azarSello / total, 2));
  requisito('Revisión: el truco "sin -ed y sin la forma del libro" acierta menos de la mitad', edBien / edPrim < 0.5, 'acierta ' + pct(edBien / edPrim) + ' a la primera y se lleva el sello ' + pct(edSello / total));
  RES.revision = { azar: azarBien / azarPrim, sinEd: edBien / edPrim, edSello: edSello / total };
  // Otros trucos de palabra en la revisión, y el mejor que sale de probar todas las reglas
  const NOM_A = ['termina en -ed', 'es la palabra del verbo (la base)', 'es la más corta', 'es la más larga', 'termina en -n'];
  const NOM_B = ['termina en -ed y la oración lleva have/has', 'termina en -ed y la oración no lleva have/has', 'es la base', 'es la más corta', 'es la más larga', 'termina en -n y lleva have/has', 'termina en -n y no lleva have/has'];
  function rasA(ops, base) {
    const L = ops.map(function (w) { return w.length; }), mn = Math.min.apply(null, L), mx = Math.max.apply(null, L);
    return ops.map(function (w) { return [ED(w) ? 1 : 0, w === base ? 1 : 0, w.length === mn ? 1 : 0, w.length === mx ? 1 : 0, EN(w) ? 1 : 0]; });
  }
  function rasB(ops, base, has) {
    const L = ops.map(function (w) { return w.length; }), mn = Math.min.apply(null, L), mx = Math.max.apply(null, L);
    return ops.map(function (w) { return [has && ED(w) ? 1 : 0, !has && ED(w) ? 1 : 0, w === base ? 1 : 0, w.length === mn ? 1 : 0, w.length === mx ? 1 : 0, has && EN(w) ? 1 : 0, !has && EN(w) ? 1 : 0]; });
  }
  const HAS = /\b(have|has|had) ___/;
  const casosR = O.filter(function (o) { return porId[o.verbo]; }).map(function (o) {
    const v = porId[o.verbo], correcta = o.forma === 'pasado' ? v.pasado : (o.forma === 'participio' ? v.participio : v.base), ops = [correcta].concat(o.falsos);
    return { v: v, regular: v.grupo === 'regulares', FA: rasA(ops, v.base), FB: rasB(ops, v.base, HAS.test(o.texto)) };
  });
  const nReg = casosR.filter(function (c) { return c.regular; }).length, nIrr = casosR.length - nReg, cant = R.revisionDeTramo || 6;
  function buscarR(clave, nw) {
    let mejor = null, mp = -1, ms = 99; const w = new Array(nw);
    for (let k = 0; k < Math.pow(3, nw); k++) {
      let x = k, simple = 0; for (let i = 0; i < nw; i++) { w[i] = (x % 3) - 1; if (w[i]) simple++; x = Math.floor(x / 3); }
      let p = 0;
      casosR.forEach(function (c) { const m = mejores(c[clave], w); if (m.indexOf(0) >= 0) p += (c.regular ? (1 / cant) / Math.max(1, nReg) : ((cant - 1) / cant) / nIrr) / m.length; });
      if (p > mp + 1e-9 || (Math.abs(p - mp) <= 1e-9 && simple < ms)) { mp = p; mejor = w.slice(); ms = simple; }
    }
    return { w: mejor, p: mp };
  }
  const pA = buscarR('FA', 5), pB = buscarR('FB', 7);
  const soloEd = function (quiere) { return function (it, az) { let c = []; it.opciones.forEach(function (w, i) { if (ED(w) === quiere) c.push(i); }); if (!c.length) c = [0, 1, 2]; return c[Math.floor(az() * c.length)]; }; };
  const trucosR = [
    ['"nunca -ed"', soloEd(false)],
    ['"nunca -ed, la más corta"', function (it, az) { return elegirSinEd(it.opciones, az); }],
    ['"siempre -ed"', soloEd(true)],
    ['mejor regla mirando solo las palabras', function (it, az) { const m = mejores(rasA(it.opciones, it.verbo.base), pA.w); return m[Math.floor(az() * m.length)]; }],
    ['mejor regla mirando además si hay have/has', function (it, az) { const m = mejores(rasB(it.opciones, it.verbo.base, HAS.test(it.texto)), pB.w); return m[Math.floor(az() * m.length)]; }]
  ];
  const ftr = []; let peorR = 0, peorRn = '', peorSimpleR = 0;
  trucosR.forEach(function (t, ti) {
    let b = 0, pr = 0, se = 0, tot = 0, bReg = 0, tReg = 0;
    for (let k = 1; k <= tramos; k++) {
      const idsT = VJ.verbosDeTramo(k).map(function (v) { return v.id; });
      for (let s2 = 1; s2 <= n; s2++) {
        const rev = VJ.crearRevision({ ids: idsT, cantidad: cant, semilla: 50000 + s2 }), az = crearAzar(s2 * 17 + k), veces = {}; let g = 0;
        while (rev.estado.fase !== 'terminada' && g++ < 100) {
          rev.destapar(); const it = rev.estado.actual; const i = t[1](it, az);
          if (!veces[it.id]) { veces[it.id] = 1; pr++; if (i === it.indiceCorrecta) b++; if (it.regular) { tReg++; if (i === it.indiceCorrecta) bReg++; } }
          rev.elegir(i); rev.siguiente();
        }
        tot++; if (rev.resumen().sello) se++;
      }
    }
    ftr.push([t[0], pct(b / pr), pct(bReg / Math.max(1, tReg), 0), pct(se / tot, 1)]);
    if (b / pr > peorR) { peorR = b / pr; peorRn = t[0]; }
    if (ti < 3) peorSimpleR = Math.max(peorSimpleR, b / pr);
  });
  console.log('\nTrucos de palabra en la revisión (' + tramos + ' tramos × ' + n + ' revisiones de ' + cant + ' oraciones; al azar se acierta 33 %):');
  tabla(['Truco', 'Acierta a la primera', '…en la oración del regular', 'Se lleva el sello'], ftr);
  console.log('  Mejor regla solo con las palabras: ' + describir(pA.w, NOM_A) + ' (' + pct(pA.p, 0) + ' sobre el papel)');
  console.log('  Mejor regla leyendo have/has:      ' + describir(pB.w, NOM_B) + ' (' + pct(pB.p, 0) + ' sobre el papel)');
  requisito('Revisión: los trucos del "-ed" (nunca, nunca + corta, siempre) aciertan menos de la mitad a la primera', peorSimpleR < 0.5, 'el mejor de los tres acierta ' + pct(peorSimpleR));
  RES.revision3 = { peor: peorR, cual: peorRn, simple: peorSimpleR, filas: ftr };
  if (peorR >= 0.5) aviso('En la revisión, la ' + peorRn + ' acierta ' + pct(peorR) + ' a la primera sin saber los verbos.');


  // entradas raras y el puente tras la carrera
  const raras = [];
  function caso(nombre, f) { let ok = false, nota = ''; try { const r = f(); ok = !!r.ok; nota = r.nota || ''; } catch (e) { nota = 'EXCEPCIÓN: ' + e.message; } raras.push([ok ? 'cumple' : 'NO CUMPLE', nombre, nota]); return ok; }
  let todo = true;
  todo = caso('Puente tras la carrera: 4 oraciones de los 4 verbos jugados', function () {
    let ok = 0; for (let s = 1; s <= 200; s++) { const a = jugarRev({ ids: ['have', 'make', 'say', 'get'], cantidad: R.revisionTrasCarrera || 4, semilla: s }, bien); if (a.pasos === 4 && a.r.sello) ok++; }
    return { ok: ok === 200, nota: ok + ' de 200' };
  }) && todo;
  todo = caso('Los verbos fallados en la carrera entran primero', function () {
    let ok = 0; for (let s = 1; s <= 200; s++) { const a = jugarRev({ ids: VJ.verbosDeTramo(4).map(function (v) { return v.id; }), cantidad: 4, semilla: s, fallados: ['ride', 'rise'] }, bien); const vs = a.r.oraciones.map(function (o) { return o.verbo; }); if (vs.indexOf('ride') >= 0 && vs.indexOf('rise') >= 0) ok++; }
    return { ok: ok === 200, nota: ok + ' de 200 traen los dos fallados' };
  }) && todo;
  todo = caso('Un solo verbo, ids inexistentes, sin ids, cantidad 0 o enorme: no rompe y termina', function () {
    const notas = [];
    [{ ids: ['go'], cantidad: 4 }, { ids: ['fantasma'], cantidad: 4 }, { ids: [], cantidad: 4 }, { cantidad: 0 }, { cantidad: 500, semilla: 2 }, { ids: ['get'], cantidad: 6 }, {}, { oraciones: [{ id: 'x' }, null, { id: 'y', verbo: 'go', forma: 'pasado', texto: 'sin hueco' }], cantidad: 3 }].forEach(function (op) {
      const a = jugarRev(op, azarB); notas.push(a.rev.estado.total + (a.r.terminada ? '' : '!'));
    });
    return { ok: notas.every(function (x) { return !/!/.test(x); }), nota: 'oraciones que salieron en cada caso: ' + notas.join(', ') };
  }) && todo;
  todo = caso('elegir antes de destapar, elegir dos veces, índices raros, seguir tras terminar', function () {
    const rev = VJ.crearRevision({ ids: ['go', 'do', 'come'], cantidad: 3, semilla: 4 });
    const a = rev.elegir(0).length; rev.destapar(); rev.elegir(99); const b = rev.elegir(0).length; rev.elegir(-5); rev.elegir(NaN); rev.siguiente(); rev.siguiente();
    let g = 0; while (rev.estado.fase !== 'terminada' && g++ < 50) { rev.destapar(); rev.elegir('x'); rev.siguiente(); }
    const fin = rev.siguiente().length + rev.elegir(1).length + rev.destapar().length;
    return { ok: a === 0 && b === 0 && rev.estado.fase === 'terminada' && fin === 0, nota: 'fase final ' + rev.estado.fase + ', limpias ' + rev.estado.limpias + ', falladas ' + rev.estado.falladas };
  }) && todo;
  tabla(['Resultado', 'Prueba', 'Detalle'], raras);
  requisito('Revisión: entradas raras y puente tras la carrera', todo, raras.filter(function (x) { return x[0] !== 'cumple'; }).length + ' no cumplen de ' + raras.length);
}

// ═════════════════════════ TERCERA RONDA: regulares infiltrados, orden al azar y el mejor tramposo ═════════════════════════
const REGS = VJ.REGULARES || [];
const ES_REGULAR = {}; REGS.forEach(function (v) { ES_REGULAR[v.id] = true; });
const ES_IRREGULAR = {}; VJ.VERBOS.forEach(function (v) { ES_IRREGULAR[v.id] = true; });
function soloIrregulares(ids) { return ids.filter(function (id) { return ES_IRREGULAR[id]; }); }
function ED(w) { return /ed$/.test(w); }
function EN(w) { return /(n|ne)$/.test(w); }

// Nunca la de -ed; entre las demás, al azar
BOTS.nuncaEd = function () {
  return { objeto: function (p, o, c) {
    if (o.tipo === 'verbo') return ir(p, o.correcta);
    let cand = []; o.opciones.forEach(function (w, i) { if (!ED(w)) cand.push(i); });
    if (!cand.length) cand = [0, 1, 2];
    ir(p, cand[Math.floor(c.azar() * cand.length)]);
  } };
};
// Receta de dos pasos, sin buscar nada: 1) ni la de -ed ni la palabra del libro; 2) en la segunda fila, la misma que acaba de salir como correcta
BOTS.receta = function () {
  return {
    objeto: function (p, o, c) {
      if (o.tipo === 'verbo') { c.m.fila = 0; c.m.primera = null; return ir(p, o.correcta); }
      c.m.fila = (c.m.fila || 0) + 1;
      if (c.m.fila === 2 && c.m.primera && o.opciones.indexOf(c.m.primera) >= 0) return ir(p, o.opciones.indexOf(c.m.primera));
      let cand = []; o.opciones.forEach(function (w, i) { if (!ED(w) && w !== o.verbo.base) cand.push(i); });
      if (!cand.length) o.opciones.forEach(function (w, i) { if (!ED(w)) cand.push(i); });
      if (!cand.length) cand = [0, 1, 2];
      ir(p, cand[Math.floor(c.azar() * cand.length)]);
    },
    evento: function (ev, c) { if ((ev.tipo === 'acierto' || ev.tipo === 'error') && ev.pide !== 'recoger' && c.m.fila === 1) c.m.primera = ev.correcta; }
  };
};
// El truco contrario: siempre la de -ed (si hay varias, una al azar; si no hay, al azar)
BOTS.siempreEd = function () {
  return { objeto: function (p, o, c) {
    if (o.tipo === 'verbo') return ir(p, o.correcta);
    let cand = []; o.opciones.forEach(function (w, i) { if (ED(w)) cand.push(i); });
    if (!cand.length) cand = [0, 1, 2];
    ir(p, cand[Math.floor(c.azar() * cand.length)]);
  } };
};

// ── Tramposo por reglas: le pone puntos a cada letrero según cómo se ve la palabra, sin saber inglés ──
const RASGOS1 = ['termina en -ed', 'es la palabra del libro', 'es la más corta', 'es la más larga', 'termina en -n'];
const RASGOS2 = ['termina en -ed (y la 1.ª respuesta fue de -ed)', 'termina en -ed (y la 1.ª respuesta no fue de -ed)', 'es la palabra del libro', 'es la más corta', 'es la más larga', 'termina en -n',
  'es la misma respuesta de la 1.ª fila', 'estaba en la 1.ª fila, sin -ed, y no era la respuesta'];
function rasgos1(ops, base) {
  const L = ops.map(function (w) { return w.length; }), mn = Math.min.apply(null, L), mx = Math.max.apply(null, L);
  return ops.map(function (w) { return [ED(w) ? 1 : 0, w === base ? 1 : 0, w.length === mn ? 1 : 0, w.length === mx ? 1 : 0, EN(w) ? 1 : 0]; });
}
function rasgos2(ops, base, prim) {
  const L = ops.map(function (w) { return w.length; }), mn = Math.min.apply(null, L), mx = Math.max.apply(null, L);
  const reg = ED(prim.correcta);
  return ops.map(function (w) {
    return [reg && ED(w) ? 1 : 0, !reg && ED(w) ? 1 : 0, w === base ? 1 : 0, w.length === mn ? 1 : 0, w.length === mx ? 1 : 0, EN(w) ? 1 : 0,
      w === prim.correcta ? 1 : 0, (w !== prim.correcta && prim.opciones.indexOf(w) >= 0 && !ED(w)) ? 1 : 0];
  });
}
function mejores(F, w) {
  let max = -1e9, idx = [];
  for (let i = 0; i < F.length; i++) {
    let s = 0; for (let k = 0; k < w.length; k++) s += w[k] * F[i][k];
    if (s > max + 1e-9) { max = s; idx = [i]; } else if (Math.abs(s - max) <= 1e-9) idx.push(i);
  }
  return idx;
}
function describir(w, nombres) {
  const pro = [], contra = [];
  w.forEach(function (x, i) { if (x > 0) pro.push(nombres[i]); if (x < 0) contra.push(nombres[i]); });
  return (pro.length ? 'prefiere la que ' + pro.join(' / ') : 'sin preferencias') + (contra.length ? '; evita la que ' + contra.join(' / ') : '');
}
// Todos los casos posibles tal como salen la primera vez: verbo × orden de las filas
function casosEstaticos(verbos, regulares) {
  const casos = [];
  const esReg = {}; (regulares || []).forEach(function (v) { esReg[v.id] = true; });
  verbos.concat(regulares || []).forEach(function (v) {
    [['pasado', 'participio'], ['participio', 'pasado']].forEach(function (orden) {
      const ops = orden.map(function (pide) {
        const correcta = pide === 'pasado' ? v.pasado : v.participio;
        const fs = (pide === 'pasado' ? v.falsosPasado : v.falsosParticipio).filter(function (f) { return f !== correcta; }).slice(0, 2);
        return [correcta].concat(fs);
      });
      casos.push({ v: v, regular: !!esReg[v.id], pasadoPrimero: orden[0] === 'pasado', F1: rasgos1(ops[0], v.base), F2: rasgos2(ops[1], v.base, { correcta: ops[0][0], opciones: ops[0] }) });
    });
  });
  return casos;
}
// Prueba todas las combinaciones de puntos (−1, 0, +1) y se queda con la que más acierta; a igual acierto, la más simple.
function buscarPolitica(casos, peso) {
  function buscar(clave, n) {
    let mejor = null, mejorP = -1, mejorSimple = 99;
    const total = Math.pow(3, n), w = new Array(n);
    let suma = 0; casos.forEach(function (c) { suma += peso(c); });
    for (let k = 0; k < total; k++) {
      let x = k, simple = 0;
      for (let i = 0; i < n; i++) { w[i] = (x % 3) - 1; if (w[i]) simple++; x = Math.floor(x / 3); }
      let p = 0;
      for (let j = 0; j < casos.length; j++) {
        const ps = peso(casos[j]); if (!ps) continue;
        const m = mejores(casos[j][clave], w);
        if (m.indexOf(0) >= 0) p += ps / m.length;
      }
      p /= suma;
      if (p > mejorP + 1e-9 || (Math.abs(p - mejorP) <= 1e-9 && simple < mejorSimple)) { mejorP = p; mejor = w.slice(); mejorSimple = simple; }
    }
    return { w: mejor, p: mejorP };
  }
  const a = buscar('F1', RASGOS1.length), b = buscar('F2', RASGOS2.length);
  return { w1: a.w, p1: a.p, w2: b.w, p2: b.p };
}
// El bot que juega con una política. chivato = usa además que "si un verbo que nunca vi pide primero el participio, es regular".
BOTS.politica = function (pol, chivato) {
  return {
    objeto: function (p, o, c) {
      if (o.tipo === 'verbo') { c.m.fila = 0; c.m.prim = null; c.m.forzar = false; return ir(p, o.correcta); }
      c.m.fila = (c.m.fila || 0) + 1;
      const base = o.verbo.base;
      if (c.m.fila === 1 && chivato && o.pide === 'participio' && !c.vistos[o.verbo.id]) c.m.forzar = true;
      let idx;
      if (c.m.forzar && o.opciones.some(ED)) { idx = []; o.opciones.forEach(function (w, i) { if (ED(w)) idx.push(i); }); }
      else if (c.m.fila === 1 || !c.m.prim || !c.m.prim.correcta) idx = mejores(rasgos1(o.opciones, base), pol.w1);
      else idx = mejores(rasgos2(o.opciones, base, c.m.prim), pol.w2);
      if (c.m.fila === 1) c.m.prim = { opciones: o.opciones.slice(), correcta: null };
      ir(p, idx[Math.floor(c.azar() * idx.length)]);
    },
    evento: function (ev, c) {
      if ((ev.tipo === 'acierto' || ev.tipo === 'error') && ev.pide !== 'recoger' && c.m.fila === 1 && c.m.prim) c.m.prim.correcta = ev.correcta;
    }
  };
};
const POL = { porGrupo: {} };
function prepararPoliticas() {
  const casos = casosEstaticos(VJ.VERBOS, REGS);
  const nI = VJ.VERBOS.length, nR = Math.max(1, REGS.length);
  const parteReg = (R.regularesPorPartida || 0) / ((R.turnosPorPartida || 8) + (R.regularesPorPartida || 0));
  // en general: verbos nuevos (pasado primero) y repasados (mitad y mitad)
  POL.general = buscarPolitica(casos, function (c) {
    if (c.regular) return parteReg / nR * 0.5;
    return (1 - parteReg) / nI * (c.pasadoPrimero ? 0.75 : 0.25);
  });
  // especializado en cada grupo (modo "Elegir un grupo", verbos nuevos: siempre pasado primero; el regular con participio primero lo delata el orden)
  VJ.GRUPOS.forEach(function (g) {
    const n = VJ.VERBOS.filter(function (v) { return v.grupo === g.id; }).length;
    POL.porGrupo[g.id] = buscarPolitica(casos, function (c) {
      if (!c.pasadoPrimero) return 0;
      if (c.regular) return parteReg / nR;
      return c.v.grupo === g.id ? (1 - parteReg) / n : 0;
    });
  });
}

// ═════════════════════════ 9. EL TRUCO DEL -ED Y EL MEJOR TRAMPOSO ═════════════════════════
function revisarTrucos() {
  titulo('9. ¿Quedó cerrado el truco del "-ed"? Trucos de palabra, en partidas completas');
  // cuántos falsos terminan en -ed ahora
  let fEd = 0, fTot = 0, filasConEd = 0, filas = 0;
  VJ.VERBOS.forEach(function (v) {
    [v.falsosPasado, v.falsosParticipio].forEach(function (l) { l.forEach(function (f) { fTot++; if (ED(f)) fEd++; }); filas++; if (l.slice(0, 2).some(ED)) filasConEd++; });
  });
  console.log('Irregulares: ' + fEd + ' de ' + fTot + ' falsos terminan en -ed; en ' + filasConEd + ' de ' + filas + ' filas (tal como salen la primera vez) hay alguna opción en -ed, siempre falsa.');
  console.log('Regulares: en sus ' + (2 * REGS.length) + ' filas la correcta termina en -ed y ningún falso lo hace. En una carrera normal ' + (R.regularesPorPartida || 0) + ' de ' + ((R.turnosPorPartida || 8) + (R.regularesPorPartida || 0)) + ' turnos son de regulares.');
  console.log('\nEl mejor tramposo "por reglas" que encontré (probé las ' + Math.pow(3, RASGOS1.length) + ' y ' + Math.pow(3, RASGOS2.length) + ' combinaciones de puntos por cómo se ve la palabra):');
  console.log('  En general, 1.ª fila: ' + describir(POL.general.w1, RASGOS1) + ' → acierta ' + pct(POL.general.p1) + ' (sobre el papel)');
  console.log('  En general, 2.ª fila: ' + describir(POL.general.w2, RASGOS2) + ' → acierta ' + pct(POL.general.p2));
  const fg = [];
  VJ.GRUPOS.forEach(function (g) {
    const P = POL.porGrupo[g.id];
    fg.push([g.id, pct(P.p1, 0), describir(P.w1, RASGOS1), pct(P.p2, 0), describir(P.w2, RASGOS2)]);
  });
  console.log('  Especializado en cada grupo (lo que haría quien practica siempre el mismo grupo):');
  tabla(['Grupo', '1.ª fila', 'Regla de la 1.ª fila', '2.ª fila', 'Regla de la 2.ª fila'], fg);

  const n = N;
  const casos = [['camino (1.ª partida)', {}, 'iguales']];
  VJ.GRUPOS.forEach(function (g) { casos.push(['grupo ' + g.id, { modo: 'grupo', grupo: g.id }, g.id]); });
  casos.push(['repaso (10 verbos fallados)', { modo: 'repaso', historial: historialConFallos() }, null]);
  casos.push(['camino con historial a medias', { modo: 'camino', historial: historialConFallos() }, null]);
  const tabl = []; const peor = { p: 0, donde: '' }; const peorSimple = { p: 0, donde: '' }; const peorGeneral = { p: 0, limpia: 0, donde: '' };
  RES.trucos = {};
  casos.forEach(function (c, i) {
    let salto = 0;
    const con = function () { const base = 3000000 + 100000 * (i + 1) + 10000 * (salto++); return function (s) { return Object.assign({}, c[1], { semilla: base + s }); }; };
    const bots = [
      ['nuncaEd', '"nunca -ed"', BOTS.nuncaEd],
      ['sinEd', '"nunca -ed, la más corta"', BOTS.sinEd],
      ['sinEdMemoria', '"nunca -ed" + memoria', BOTS.sinEdMemoria],
      ['siempreEd', '"siempre -ed"', BOTS.siempreEd],
      ['receta', 'receta de dos pasos', BOTS.receta],
      ['general', 'mejor regla general', function () { return BOTS.politica(POL.general, true); }],
      ['grupo', 'mejor regla del grupo', function () { return BOTS.politica(c[2] ? POL.porGrupo[c[2]] : POL.general, true); }]
    ];
    const fila = [c[0]]; const res = {};
    bots.forEach(function (b) {
      const r = medir(b[1], b[2], con(), n, { vigilarHistorial: true });
      res[b[0]] = r;
      fila.push(b[0] === 'general' || b[0] === 'grupo' || b[0] === 'receta' ? pct(r.pGana, 0) + ', limpia ' + pct(r.pLimpia, 0) + ' (' + Math.round(100 * r.ac1) + '/' + Math.round(100 * r.ac2) + ')' : pct(r.pGana) + ' (' + Math.round(100 * r.ac1) + '/' + Math.round(100 * r.ac2) + ')');
      if (b[0] === 'general' || b[0] === 'receta') { if (r.pGana > peorGeneral.p) { peorGeneral.p = r.pGana; peorGeneral.limpia = r.pLimpia; peorGeneral.donde = b[1] + ' en ' + c[0]; } }
      if (r.pGana > peor.p) { peor.p = r.pGana; peor.donde = b[1] + ' en ' + c[0] + ' (acierta ' + pct(r.acierto, 0) + ' de los letreros; ' + pct(r.ganaConPend / Math.max(1, r.ganadas), 0) + ' de sus victorias con verbos pendientes)'; }
      if (b[0] !== 'general' && b[0] !== 'grupo' && b[0] !== 'receta' && r.pGana > peorSimple.p) { peorSimple.p = r.pGana; peorSimple.donde = b[1] + ' en ' + c[0]; }
    });
    RES.trucos[c[0]] = res;
    tabl.push(fila);
  });
  console.log('\nPartidas ganadas por cada truco y, entre paréntesis, % de aciertos en la 1.ª fila del turno / en la 2.ª. ' + n + ' partidas por casilla. El azar acierta 33/33 y gana 0 %.');
  tabla(['Modo', '"Nunca -ed"', '"Nunca -ed, la más corta"', '"Nunca -ed" + memoria del turno', '"Siempre -ed"', 'Receta de dos pasos', 'Mejor regla general', 'Mejor regla del grupo'], tabl);
  console.log('Receta de dos pasos: 1) en la primera fila, ni la de -ed ni la palabra del libro; 2) en la segunda, la misma palabra que acaba de salir como correcta. No usa nada más.');
  console.log('"Limpia" = llegó sin ningún verbo pendiente. La pantalla final ya distingue las dos cosas.');
  requisito('Los trucos del "-ed" (nunca, nunca + corta, nunca + memoria, siempre) ganan 1 % o menos en todo modo y grupo', peorSimple.p <= 0.01, peorSimple.p > 0 ? 'el peor: ' + peorSimple.donde + ' gana ' + pct(peorSimple.p) : 'ninguno gana una sola partida');
  requisito('Ningún tramposo que no sepa los verbos ni el grupo llega al colegio más del 1 % de las veces', peorGeneral.p <= 0.01, 'el peor: ' + peorGeneral.donde + ' llega ' + pct(peorGeneral.p) + ' (limpia, sin verbos pendientes: ' + pct(peorGeneral.limpia) + ')');
  aviso('Techo por grupo: con una regla hecha a la medida de cada grupo (que en varios es el patrón mismo que el grupo enseña) se gana hasta ' + pct(peor.p, 0) + ': ' + peor.donde + '.');
  RES.peorGeneral = peorGeneral;
  RES.peorTramposo = peor; RES.peorSimple = peorSimple;
  // ¿reconocen al regular?
  const cam = RES.trucos['camino (1.ª partida)'];
  console.log('\nEn los turnos de verbos REGULARES (camino, 1.ª partida), aciertos en la 1.ª fila / en la 2.ª:');
  tabla(['Truco', '1.ª fila del regular', '2.ª fila del regular'], [['nuncaEd', '"nunca -ed"'], ['sinEdMemoria', '"nunca -ed" + memoria'], ['siempreEd', '"siempre -ed"'], ['general', 'mejor regla general (con el chivato del orden)']].map(function (d) {
    return [d[1], pct(cam[d[0]].acReg1, 0), pct(cam[d[0]].acReg2, 0)];
  }));
  const sinChivato = medir('', function () { return BOTS.politica(POL.general, false); }, function (s) { return { semilla: 4100000 + s }; }, n, { sinVigilar: true });
  console.log('La misma regla general sin usar el chivato del orden: gana ' + pct(sinChivato.pGana) + ' (1.ª fila del regular: ' + pct(sinChivato.acReg1, 0) + ').');
  RES.sinChivato = sinChivato.pGana;
  // ¿y si los regulares no existieran? (para saber cuánto frenan al tramposo)
  const sinRegs = medir('', function () { return BOTS.politica(POL.general, false); }, function (s) { return { semilla: 4150000 + s, reglas: Object.assign({}, R, { regularesPorPartida: 0 }) }; }, n, { sinVigilar: true });
  console.log('La misma regla general con los regulares apagados (regularesPorPartida: 0): gana ' + pct(sinRegs.pGana) + '.');
  RES.sinRegs = sinRegs.pGana;

  // La misma búsqueda sobre los datos de la PRIMERA ronda (31 verbos, guardados en equipo/verbos-31-original.js), con las reglas de entonces
  try {
    const vm = require('vm'), caja = {}; vm.createContext(caja);
    vm.runInContext(require('fs').readFileSync(path.join(RAIZ, 'equipo', 'verbos-31-original.js'), 'utf8'), caja);
    const V1 = caja.VJ.VERBOS, G1 = caja.VJ.GRUPOS;
    const casos1 = casosEstaticos(V1, []);
    const pol1 = buscarPolitica(casos1, function (c) { return c.pasadoPrimero ? 1 : 0; });
    const reglas1 = Object.assign({}, R, { regularesPorPartida: 0, ordenAlAzarEnRepaso: 0, maxReencolar: null, turnosMaximos: 0 });
    const f1 = [];
    const c1 = medir('', function () { return BOTS.politica(pol1, false); }, function (s) { return { semilla: 4200000 + s, verbos: V1, grupos: G1, reglas: reglas1 }; }, n, { sinVigilar: true });
    f1.push(['camino (1.ª partida), regla general', pct(c1.pGana), Math.round(100 * c1.ac1) + '/' + Math.round(100 * c1.ac2)]);
    let mejorGrupo1 = 0, peorGrupo1 = 1;
    G1.forEach(function (g, i) {
      const pg = buscarPolitica(casos1, function (c) { return c.pasadoPrimero && c.v.grupo === g.id ? 1 : 0; });
      const r = medir('', function () { return BOTS.politica(pg, false); }, function (s) { return { semilla: 4300000 + 10000 * i + s, verbos: V1, grupos: G1, reglas: reglas1, modo: 'grupo', grupo: g.id }; }, n, { sinVigilar: true });
      f1.push(['grupo ' + g.id + ', regla del grupo', pct(r.pGana), Math.round(100 * r.ac1) + '/' + Math.round(100 * r.ac2)]);
      mejorGrupo1 = Math.max(mejorGrupo1, r.pGana); peorGrupo1 = Math.min(peorGrupo1, r.pGana);
    });
    console.log('\nEl mismo buscador de reglas, puesto sobre los 31 verbos de la primera ronda y con las reglas de entonces (sin tope de turnos, sin regulares):');
    console.log('  1.ª fila: ' + describir(pol1.w1, RASGOS1) + ' (' + pct(pol1.p1, 0) + ') · 2.ª fila: ' + describir(pol1.w2, RASGOS2) + ' (' + pct(pol1.p2, 0) + ')');
    tabla(['Modo (datos de la 1.ª ronda)', 'Gana', '1.ª / 2.ª fila'], f1);
    RES.ronda1Mejor = { camino: c1.pGana, grupo: mejorGrupo1, grupoMin: peorGrupo1 };
  } catch (e) { console.log('\n(No pude leer equipo/verbos-31-original.js para comparar con la primera ronda: ' + e.message + ')'); }


  // campaña: 20 partidas seguidas con el mejor tramposo general
  const fi = [];
  [['"nunca -ed"', BOTS.nuncaEd], ['"nunca -ed, la más corta"', BOTS.sinEd], ['"nunca -ed" + memoria', BOTS.sinEdMemoria], ['"siempre -ed"', BOTS.siempreEd],
    ['receta de dos pasos', BOTS.receta], ['mejor regla general', function () { return BOTS.politica(POL.general, true); }]].forEach(function (d) {
    const gan = [], vis = [], sab = [], prim = [];
    for (let rep = 0; rep < 40; rep++) {
      let historial = {}, g = 0;
      for (let k = 1; k <= 20; k++) {
        const sal = jugar({ semilla: 7000 + rep * 100 + k, historial: historial }, d[1](), rep * 613 + k, { vigilarHistorial: true });
        if (sal.fase === 'ganada') { g++; if (k === 1) prim.push(1); } else if (k === 1) prim.push(0);
        historial = sal.resumen.historial;
      }
      const ids = soloIrregulares(Object.keys(historial));
      gan.push(g / 20); vis.push(ids.length);
      sab.push(ids.filter(function (id) { return historial[id].racha >= R.rachaSabido; }).length);
    }
    fi.push([d[0], pct(media(prim), 0), pct(media(gan), 1), media(vis).toFixed(1), media(sab).toFixed(1)]);
    RES['campana3:' + d[0]] = { primera: media(prim), gana: media(gan), vistos: media(vis), sabidos: media(sab) };
  });
  console.log('\n20 partidas encadenadas, 40 jugadores de cada truco:');
  tabla(['Truco', 'Gana la 1.ª partida', 'Partidas que gana (de 20)', 'Verbos vistos', 'Verbos marcados "sabido"'], fi);
}

// ═════════════════════════ 10. REGULARES INFILTRADOS Y ORDEN AL AZAR ═════════════════════════
function revisarRegulares() {
  titulo('10. Verbos regulares infiltrados y orden de las filas');
  const problemas = [];
  const ids = {};
  if (!REGS.length) { requisito('Existen los verbos regulares (VJ.REGULARES)', false, 'no hay'); return; }
  REGS.forEach(function (v) {
    if (ids[v.id]) problemas.push(v.id + ': id repetido'); ids[v.id] = 1;
    if (ES_IRREGULAR[v.id]) problemas.push(v.id + ': también está en la lista de irregulares');
    if (v.grupo !== 'regulares') problemas.push(v.id + ': grupo "' + v.grupo + '"');
    if (v.orden != null) problemas.push(v.id + ': trae orden');
    ['base', 'pasado', 'participio', 'es', 'pista'].forEach(function (k) { if (!v[k] || typeof v[k] !== 'string') problemas.push(v.id + ': falta ' + k); });
    if (v.pasado !== v.participio || !ED(v.pasado)) problemas.push(v.id + ': pasado y participio deberían ser iguales y terminar en -ed');
    const esperado = /e$/.test(v.base) ? v.base + 'd' : v.base + 'ed';
    if (v.pasado !== esperado) problemas.push(v.id + ': "' + v.pasado + '" no es ' + esperado);
    [['falsosPasado', v.pasado], ['falsosParticipio', v.participio]].forEach(function (d) {
      const l = v[d[0]] || [], vistos = {};
      if (l.length !== 3) problemas.push(v.id + ': ' + d[0] + ' tiene ' + l.length + ' (deben ser 3)');
      l.forEach(function (f) {
        if (ED(f)) problemas.push(v.id + ': el falso "' + f + '" termina en -ed');
        if (f === d[1]) problemas.push(v.id + ': el falso "' + f + '" es la correcta');
        if (vistos[f]) problemas.push(v.id + ': falso repetido "' + f + '"'); vistos[f] = 1;
        if (f.length > R.maxLetras || !/^[a-z]+$/.test(f)) problemas.push(v.id + ': falso raro o largo "' + f + '"');
      });
    });
    [v.base, v.pasado].forEach(function (w) { if (w.length > R.maxLetras) problemas.push(v.id + ': "' + w + '" pasa de ' + R.maxLetras + ' letras'); });
    if (v.pista.toLowerCase().indexOf(v.pasado) < 0 && !/-ed/.test(v.pista)) aviso('La pista del regular ' + v.id + ' no menciona "' + v.pasado + '" ni "-ed": ' + v.pista);
  });
  const G = VJ.GRUPO_REGULARES;
  if (!G || G.id !== 'regulares' || !G.nombre || !G.ejemplo || !G.explicacion) problemas.push('VJ.GRUPO_REGULARES incompleto');
  console.log('Regulares: ' + REGS.length + ' (' + REGS.map(function (v) { return v.base; }).join(', ') + ')');
  console.log(problemas.length ? 'PROBLEMAS:\n  - ' + problemas.join('\n  - ') : 'Sin problemas contra el contrato.');
  requisito('Regulares contra el contrato (3 falsos por lista, ninguno en -ed, sin repetidos, máximo ' + R.maxLetras + ' letras, pasado = base + ed)', problemas.length === 0, problemas.length + ' problemas en ' + REGS.length + ' verbos');

  // ── cómo entran en la cola ──
  const n = Math.max(500, N);
  const modos = [['camino', {}]];
  VJ.GRUPOS.forEach(function (g) { modos.push(['grupo ' + g.id, { modo: 'grupo', grupo: g.id }]); });
  modos.push(['repaso', { modo: 'repaso', historial: historialConFallos() }]);
  modos.push(['camino a medias', { modo: 'camino', historial: historialConFallos() }]);
  let colas = 0, conDos = 0, primero = 0, seguidos = 0, mismos = 0; const pos = {}, cual = {}; const largos = {};
  modos.forEach(function (m, i) {
    for (let s = 1; s <= n; s++) {
      const p = VJ.crearPartida(Object.assign({}, m[1], { semilla: 900000 + i * 10000 + s }));
      const cola = p.estado.cola.slice();
      colas++;
      const dónde = []; cola.forEach(function (id, k) { if (ES_REGULAR[id]) dónde.push(k); });
      if (dónde.length === (R.regularesPorPartida || 0)) conDos++;
      if (ES_REGULAR[cola[0]]) primero++;
      dónde.forEach(function (k) { pos[k] = (pos[k] || 0) + 1; cual[cola[k]] = (cual[cola[k]] || 0) + 1; if (ES_REGULAR[cola[k + 1]]) seguidos++; });
      if (dónde.length === 2 && cola[dónde[0]] === cola[dónde[1]]) mismos++;
      largos[cola.length] = (largos[cola.length] || 0) + 1;
    }
  });
  const totalRegs = Object.keys(pos).reduce(function (a, k) { return a + pos[k]; }, 0);
  console.log('\nEn ' + colas + ' colas (todos los modos): con exactamente ' + R.regularesPorPartida + ' regulares ' + conDos + ' · regular en el primer turno ' + primero + ' · dos regulares seguidos ' + seguidos + ' · el mismo regular dos veces ' + mismos);
  console.log('Largo de las colas: ' + Object.keys(largos).map(function (k) { return k + ' turnos × ' + largos[k]; }).join(', '));
  console.log('En qué turno cae el regular (1 = primero): ' + Object.keys(pos).map(function (k) { return (Number(k) + 1) + '.º ' + pct(pos[k] / totalRegs, 0); }).join(' · '));
  const usos = REGS.map(function (v) { return cual[v.id] || 0; });
  console.log('Cuál regular sale: del menos usado (' + pct(Math.min.apply(null, usos) / totalRegs) + ') al más usado (' + pct(Math.max.apply(null, usos) / totalRegs) + '); parejo sería ' + pct(1 / REGS.length));
  requisito('En cada partida entran ' + R.regularesPorPartida + ' regulares, nunca el primero, nunca dos seguidos, nunca el mismo dos veces', conDos === colas && primero === 0 && seguidos === 0 && mismos === 0,
    conDos + ' de ' + colas + ' colas con ' + R.regularesPorPartida + '; primero ' + primero + '; seguidos ' + seguidos + '; repetido ' + mismos);

  // ── apagados: todo idéntico a como era ──
  const apagado = Object.assign({}, R, { regularesPorPartida: 0, ordenAlAzarEnRepaso: 0, ordenAlRevesEnRepaso: 0, tramoCerrado: false, filaSignificadoEnIguales: false });
  const REF = { 0.7: 0.257, 0.8: 0.625, 0.9: 0.935 };       // lo que midió este mismo banco en la segunda ronda (3.000 partidas, mismas semillas)
  const fo = []; let igualQueAntes = true, regsFuera = 0;
  [0.7, 0.8, 0.9].forEach(function (a) {
    const r = medir('', function () { return BOTS.aprendiz(a); }, { reglas: apagado }, 3000, { sinVigilar: true });
    if (Math.abs(r.pGana - REF[a]) > 0.02) igualQueAntes = false;
    fo.push(['aprendiz ' + a * 100 + ' %', pct(REF[a]), pct(r.pGana), pct(RES['aprendiz' + a].pGana)]);
  });
  const pOff = medir('', BOTS.perfecto, { reglas: apagado }, 300, { sinVigilar: true });
  for (let s = 1; s <= 300; s++) { const p = VJ.crearPartida({ semilla: s, reglas: apagado }); if (p.estado.cola.some(function (id) { return ES_REGULAR[id]; })) regsFuera++; }
  fo.push(['perfecto (duración)', '1:42', mmss(media(pOff.dur)), mmss(media(RES.perfecto.dur))]);
  console.log('\nCon regularesPorPartida: 0, ordenAlAzarEnRepaso: 0, tramoCerrado: false y filaSignificadoEnIguales: false:');
  tabla(['Perfil', 'Segunda ronda', 'Ahora, apagados', 'Ahora, encendidos'], fo);
  // y con una semilla, evento por evento: apagar solo el orden no cambia una partida de verbos nuevos
  let igualOrden = 0;
  for (let s = 1; s <= 200; s++) {
    const a = jugar({ semilla: s, reglas: Object.assign({}, R, { ordenAlAzarEnRepaso: 0 }) }, BOTS.aprendiz(0.8), s, { sinVigilar: true });
    const b = jugar({ semilla: s }, BOTS.aprendiz(0.8), s, { sinVigilar: true });
    const tipos = function (x) { return x.eventos.map(function (t) { return t.split(':')[0] + ':' + t.split(':')[1]; }).join('|'); };
    if (tipos(a) === tipos(b) && a.carriles.join('') === b.carriles.join('') && Math.abs(a.tiempo - b.tiempo) < 1e-6) igualOrden++;
  }
  console.log('El dado del orden no altera lo demás: ' + igualOrden + ' de 200 partidas salen iguales (mismos carriles, mismos aciertos, mismo tiempo) con el orden al azar encendido o apagado.');
  requisito('Con los regulares y el orden al azar apagados, todo sale idéntico a la segunda ronda', igualQueAntes && regsFuera === 0 && Math.abs(media(pOff.dur) - 102) < 20,
    fo.map(function (f) { return f[0] + ': ' + f[1] + ' → ' + f[2]; }).join(' · ') + ' · colas con regulares: ' + regsFuera);
  requisito('El dado del orden es aparte: encenderlo no cambia carriles, aciertos ni tiempos', igualOrden === 200, igualOrden + ' de 200');

  // ── orden de las filas ──
  const Or = FILAS.orden;
  function parte(t) { const a = Or[t].pasado, b = Or[t].participio; return (a + b) ? b / (a + b) : NaN; }
  console.log('\nQué se pide primero (todas las partidas del banco, entre pasado y participio):');
  tabla(['Tipo de verbo', 'Turnos (pas/part)', 'Primero el pasado', 'Primero el participio', 'Significado 1.º', 'Base (didn\'t) 1.º'], ['nuevo', 'visto', 'regular'].map(function (t) {
    return [t === 'nuevo' ? 'irregular nunca visto' : (t === 'visto' ? 'irregular ya visto' : 'regular'), Or[t].pasado + Or[t].participio, pct(1 - parte(t)), pct(parte(t)), Or[t].significado || 0, Or[t].base || 0];
  }));
  requisito('Un verbo nuevo también sortea el orden (45 a 55 % participio primero) para no delatar a los regulares', Math.abs(parte('nuevo') - 0.5) < 0.05 && Or.nuevo.pasado > 0, 'nuevos: ' + pct(parte('nuevo')) + ' participio primero');
  requisito('En verbos ya vistos y en regulares, cerca de la mitad de las veces se pide primero el participio (45 a 55 %)', Math.abs(parte('visto') - 0.5) < 0.05 && Math.abs(parte('regular') - 0.5) < 0.05,
    'vistos ' + pct(parte('visto')) + ' · regulares ' + pct(parte('regular')));
  requisito('El estado dice siempre lo que de verdad se pide y no adelanta la respuesta', FILAS.fugaPide === 0 && FILAS.fugaCadena === 0 && FILAS.sinSegunda === 0,
    'estado.pide distinto de la fila: ' + FILAS.fugaPide + ' · la pizarra ya traía la respuesta: ' + FILAS.fugaCadena + ' · turnos que repiten la misma forma: ' + FILAS.sinSegunda + ' (en ' + FILAS.total + ' filas)');

  // ── qué queda anotado de un regular ──
  let conRegPend = 0, soloRegPend = 0, ganadas = 0, enHistorial = 0, enVerbos = 0;
  for (let s = 1; s <= 400; s++) {
    const bot = { objeto: function (p, o) { ir(p, o.tipo === 'fila' && ES_REGULAR[o.verbo.id] && o.pide === 'pasado' ? (o.correcta + 1) % 3 : o.correcta); } };
    const sal = jugar({ semilla: s }, bot, s, { sinVigilar: true });
    const r = sal.resumen;
    if (r.ganada) ganadas++;
    const pend = r.verbos.filter(function (v) { return v.resultado === 'pendiente'; });
    if (pend.some(function (v) { return ES_REGULAR[v.id]; })) conRegPend++;
    if (r.pendientes > 0 && pend.every(function (v) { return ES_REGULAR[v.id]; })) soloRegPend++;
    if (Object.keys(r.historial).some(function (id) { return ES_REGULAR[id]; })) enHistorial++;
    if (r.verbos.some(function (v) { return ES_REGULAR[v.id]; })) enVerbos++;
  }
  console.log('\nJugador que sabe todos los irregulares y falla el pasado de los regulares (400 partidas): gana ' + ganadas + '; el resumen dice "quedaron verbos pendientes" en ' + soloRegPend +
    '; el regular queda guardado en el historial en ' + enHistorial + '.');
  RES.regPend = { ganadas: ganadas, soloReg: soloRegPend, enHistorial: enHistorial };
  if (soloRegPend) aviso('Un regular fallado cuenta como "verbo pendiente" en la pantalla final (' + soloRegPend + ' de 400 partidas), pero no vuelve en esa partida ni entra en "Lo que me cuesta" ni abre la siguiente: queda pendiente de nada.');
}

// ═════════════════════════ 11. CUARTA ETAPA: TRAMOS CERRADOS, FICHAS, PRE/POST Y CÓDIGO DEL PROFESOR ═════════════════════════
function revisarCuartaEtapa() {
  titulo('11. Cuarta etapa: tramos cerrados de 10, producción con fichas, Pre/Post y código del profesor');

  // (a) esCorto, falsosEs y limpieza de falsos dialectales/forzados
  const PROHIBIDOS = { thunk: 1, brung: 1, brang: 1, boughten: 1, pat: 1, cat: 1, hat: 1 };
  const problemasEs = [];
  const prohibidosVistos = [];
  VJ.VERBOS.concat(REGS).forEach(function (v) {
    if (!v.esCorto || typeof v.esCorto !== 'string' || /\s/.test(v.esCorto) || v.esCorto.length > 10) {
      problemasEs.push(v.id + ': esCorto inválido ("' + v.esCorto + '")');
    }
    if (!Array.isArray(v.falsosEs) || v.falsosEs.length !== 2 || v.falsosEs[0] === v.falsosEs[1]) {
      problemasEs.push(v.id + ': falsosEs debe tener 2 elementos distintos');
    } else {
      v.falsosEs.forEach(function (fe) {
        if (!fe || typeof fe !== 'string' || /\s/.test(fe) || fe.length > 10 || fe === v.esCorto) {
          problemasEs.push(v.id + ': falsoEs inválido ("' + fe + '")');
        }
      });
    }
    (v.falsosPasado || []).concat(v.falsosParticipio || []).forEach(function (f) {
      if (PROHIBIDOS[f]) prohibidosVistos.push(v.id + ':' + f);
    });
  });
  (VJ.ORACIONES || []).forEach(function (o) {
    (o.falsos || []).forEach(function (f) {
      if (PROHIBIDOS[f]) prohibidosVistos.push(o.id + ':' + f);
    });
  });
  console.log('Verificación de esCorto y falsosEs en 60 irregulares + 12 regulares: ' + problemasEs.length + ' problemas.');
  console.log('Falsos dialectales o sustantivos forzados (thunk, brung, brang, boughten, pat, cat, hat): ' + prohibidosVistos.length + ' encontrados.');
  requisito('Cuarta etapa: los 72 verbos tienen esCorto (≤10 letras, sin espacios) y 2 falsosEs válidos, y 0 falsos dialectales/forzados',
    problemasEs.length === 0 && prohibidosVistos.length === 0,
    problemasEs.length + ' problemas de significado · ' + prohibidosVistos.length + ' falsos prohibidos');

  // (b) Sesión de clase simulada: 5 carreras del Tramo 1 + sus puentes
  function simularSesionTramo1(crearBot, conProduccionPuente, modoProduccionBot, semillaBase) {
    let h = {};
    for (let k = 1; k <= 5; k++) {
      const sal = jugar({ semilla: (semillaBase || 8000) + k, historial: h, modo: 'camino' }, crearBot(), (semillaBase || 8000) * 13 + k, { sinVigilar: true });
      h = sal.resumen.historial;
      if (sal.fase === 'ganada' && conProduccionPuente) {
        const candidatos = soloIrregulares(sal.turnos).filter(function (id, idx, arr) {
          return arr.indexOf(id) === idx && (!h[id] || !h[id].produccionesLimpias) && !sal.resumen.costaron.some(function (c) { return c.id === id; });
        });
        const idsPuente = candidatos.length >= 2 ? candidatos : soloIrregulares(sal.turnos);
        const rev = VJ.crearRevision({
          ids: idsPuente,
          cantidad: R.revisionTrasCarrera || 4,
          semilla: (semillaBase || 8000) + 100 + k,
          regulares: []
        });
        const az = crearAzar((semillaBase || 8000) + 500 + k);
        let guard = 0;
        while (!rev.terminada() && guard++ < 40) {
          const q = rev.actual();
          if (modoProduccionBot === 'perfecto') {
            rev.intentarTexto(q.correcta);
          } else {
            // Bot sin inglés: en fichas arma 4 letras al azar de las fichas; en opciones aplica sinEd
            if (q.modo === 'fichas') {
              let palabra = '';
              for (let c = 0; c < 4; c++) palabra += q.fichas[Math.floor(az() * q.fichas.length)];
              rev.intentarTexto(palabra);
            } else {
              const idx = elegirSinEd(q.opciones, az);
              rev.intentarTexto(q.opciones[idx]);
            }
          }
        }
        VJ.aplicarRevisionAHistorial(h, rev.resumen(), R);
      }
    }
    const delTramo1 = VJ.verbosDeTramo(1, VJ.VERBOS, R);
    const sabidos = delTramo1.filter(function (v) { return VJ.esSabido(h[v.id], R); }).length;
    return { historial: h, sabidos: sabidos, tramoSiguiente: VJ.tramoActual(h, R, VJ.VERBOS) };
  }

  const sesionPerfecta = simularSesionTramo1(BOTS.perfecto, true, 'perfecto', 8100);
  const sesionSinPuente = simularSesionTramo1(BOTS.perfecto, false, 'perfecto', 8100);
  const sesionTramposo1 = simularSesionTramo1(BOTS.receta, true, 'tramposo', 8200);
  const sesionTramposo2 = simularSesionTramo1(function () { return BOTS.politica(POL.general, true); }, true, 'tramposo', 8300);

  console.log('\nSesión de clase (5 carreras del Tramo 1 + sus puentes):');
  tabla(['Perfil en 5 carreras del Tramo 1', 'Verbos "sabidos" (de 10)', 'Tramo activo al terminar'], [
    ['Perfecto (con producción en el puente)', sesionPerfecta.sabidos + ' / 10', 'Tramo ' + sesionPerfecta.tramoSiguiente],
    ['Perfecto SIN producción en el puente', sesionSinPuente.sabidos + ' / 10', 'Tramo ' + sesionSinPuente.tramoSiguiente],
    ['Tramposo: receta de dos pasos', sesionTramposo1.sabidos + ' / 10', 'Tramo ' + sesionTramposo1.tramoSiguiente],
    ['Tramposo: mejor regla general', sesionTramposo2.sabidos + ' / 10', 'Tramo ' + sesionTramposo2.tramoSiguiente]
  ]);
  requisito('Cuarta etapa: en 5 carreras del Tramo 1 + puentes, el perfecto logra ≥8 sabidos (destraba Tramo 2), sin producción logra 0, y los tramposos logran 0',
    sesionPerfecta.sabidos >= 8 && sesionPerfecta.tramoSiguiente === 2 && sesionSinPuente.sabidos === 0 && sesionTramposo1.sabidos === 0 && sesionTramposo2.sabidos === 0,
    'perfecto: ' + sesionPerfecta.sabidos + '/10 (tramo ' + sesionPerfecta.tramoSiguiente + ') · sin puente: ' + sesionSinPuente.sabidos + ' · tramposos: ' + sesionTramposo1.sabidos + ' y ' + sesionTramposo2.sabidos);

  // (c) Caja de Fichas en el puente: 7 letras únicas, cubre la correcta, 2.º intento con esqueleto y <5 % al azar
  let totalFichasQ = 0, fichasValidas = 0, aciertosBotFichas = 0, pruebasEsqueleto = 0, esqueletoOk = 0;
  for (let t = 1; t <= 6; t++) {
    const idsT = VJ.verbosDeTramo(t).map(function (v) { return v.id; });
    for (let s = 1; s <= 100; s++) {
      const rev = VJ.crearRevision({ ids: idsT, cantidad: 6, semilla: 9000 + t * 100 + s });
      const az = crearAzar(t * 997 + s);
      let pasos = 0;
      while (!rev.terminada() && pasos++ < 30) {
        const q = rev.actual();
        if (q.modo === 'fichas' && !q.repetida && (q.intentosFicha || 0) === 0) {
          totalFichasQ++;
          const letrasOk = Array.isArray(q.fichas) && q.fichas.length === (R.fichasLetrasTotal || 8) - 1 &&
            q.correcta.toLowerCase().split('').every(function (ch) { return q.fichas.indexOf(ch) >= 0; }) &&
            q.esqueleto === null && Array.isArray(q.letrasApagadas) && q.letrasApagadas.length === 0;
          if (letrasOk) fichasValidas++;
          // Bot sin inglés que arma 4 letras al azar usando las fichas disponibles
          let intentoBot = '';
          for (let c = 0; c < 4; c++) intentoBot += q.fichas[Math.floor(az() * q.fichas.length)];
          const res1 = rev.intentarTexto(intentoBot);
          if (res1.correcta) {
            aciertosBotFichas++;
          } else {
            pruebasEsqueleto++;
            if (res1.segundoIntento && typeof res1.esqueleto === 'string' && res1.esqueleto[0] === q.correcta[0] && Array.isArray(res1.letrasApagadas)) {
              esqueletoOk++;
            }
            // En el 2.º intento falla también para avanzar
            rev.intentarTexto('zzzz');
          }
        } else {
          rev.intentarTexto(q.correcta);
        }
      }
    }
  }
  const tasaBotFichas = aciertosBotFichas / Math.max(1, totalFichasQ);
  console.log('\nCaja de Fichas en ' + totalFichasQ + ' preguntas de producción: ' + fichasValidas + ' con las 7 letras válidas y sin esqueleto inicial · ' +
    esqueletoOk + ' de ' + pruebasEsqueleto + ' activan 2.º intento con esqueleto · bot de fichas al azar acierta ' + pct(tasaBotFichas, 2));
  requisito('Cuarta etapa: Caja de Fichas trae 7 letras válidas sin adelantar largo, da 2.º intento con esqueleto al fallar y un bot al azar acierta <5 %',
    fichasValidas === totalFichasQ && totalFichasQ > 0 && esqueletoOk === pruebasEsqueleto && tasaBotFichas < 0.05,
    'válidas ' + fichasValidas + '/' + totalFichasQ + ' · esqueleto ' + esqueletoOk + '/' + pruebasEsqueleto + ' · bot ' + pct(tasaBotFichas, 2));

  // (d) Pre/Post, codificarReporte / decodificarReporte (con rechazo de códigos alterados) y ejemploSalon
  let prePostOk = true, codigosOk = 0, codigosTotal = 0, alteradosRechazados = 0, alteradosTotal = 0, salonOk = true;
  for (let t = 1; t <= 6; t++) {
    const pre = VJ.crearPrePost(100 + t, t, 'pre');
    const post = VJ.crearPrePost(100 + t, t, 'post');
    if (pre.total() !== (R.preguntasPrePost || 5) || post.total() !== (R.preguntasPrePost || 5)) prePostOk = false;
    // En Pre: responde 'paso' a las primeras 4 y acierta la 5.ª → nota 1
    for (let i = 0; i < pre.total(); i++) {
      const q = pre.actual();
      pre.responder(i === 0 ? q.correcta : 'paso');
    }
    // En Post: acierta todas → nota 5
    for (let i = 0; i < post.total(); i++) {
      const q = post.actual();
      post.responder(q.correcta);
    }
    const rPre = pre.resumen(), rPost = post.resumen();
    if (rPre.nota !== 1 || rPre.fallados.length !== 4 || rPost.nota !== 5 || rPost.fallados.length !== 0) prePostOk = false;

    for (let preN = 0; preN <= 5; preN++) {
      for (let postN = 0; postN <= 5; postN++) {
        const vs = VJ.verbosDeTramo(t);
        const fallados = [vs[(preN + t) % 10].id, vs[(postN + t + 3) % 10].id];
        const cod = VJ.codificarReporte({ tramo: t, pre: preN, post: postN, fallados: fallados });
        const dec = VJ.decodificarReporte(cod);
        codigosTotal++;
        if (cod.length === 6 && dec.valido && dec.tramo === t && dec.pre === preN && dec.post === postN && dec.ganancia === postN - preN && dec.falladosIds[0] === fallados[0]) {
          codigosOk++;
        }
        // Intentar falsificar la nota Post cambiándola por otro número sin saber la letra de control
        const postFalso = (postN + 1) % 6;
        const codFalso = cod.slice(0, 2) + String(postFalso) + cod.slice(3);
        alteradosTotal++;
        if (!VJ.decodificarReporte(codFalso).valido) alteradosRechazados++;
      }
    }

    const ej = VJ.ejemploSalon(t);
    if (!Array.isArray(ej) || ej.length !== 25 || !ej.every(function (c) { const d = VJ.decodificarReporte(c); return d.valido && d.tramo === t; })) {
      salonOk = false;
    }
  }
  console.log('Pre/Post y códigos del profesor: ' + codigosOk + '/' + codigosTotal + ' códigos codifican y decodifican exacto · ' +
    alteradosRechazados + '/' + alteradosTotal + ' códigos con nota alterada a mano fueron rechazados.');
  requisito('Cuarta etapa: Pre/Post (5 preguntas con botón Paso), código de 6 caracteres verificable (100 % rechaza nota alterada) y ejemploSalon(25)',
    prePostOk && codigosOk === codigosTotal && alteradosRechazados === alteradosTotal && salonOk,
    'Pre/Post: ' + (prePostOk ? 'ok' : 'fallo') + ' · códigos: ' + codigosOk + '/' + codigosTotal + ' · falsos rechazados: ' + alteradosRechazados + '/' + alteradosTotal + ' · salón: ' + (salonOk ? '25×6 ok' : 'fallo'));
}

// ═════════════════════════ correr todo ═════════════════════════
const t0 = Date.now();
console.log('Bots del juego de verbos irregulares — ' + N + ' partidas por perfil, semillas 1 a ' + N + ', repetible.');
prepararPoliticas();
revisarDatos();
medirBots();
medirModos();
revisarFilas();
revisarAprendizaje();
revisarDuracion();
revisarRobustez();
revisarRevision();
revisarTrucos();
revisarRegulares();
revisarCuartaEtapa();

titulo('REQUISITOS DUROS');
tabla(['', 'Requisito', 'Número'], requisitos.map(function (r) { return [r.cumple ? 'cumple   ' : 'NO CUMPLE', r.nombre, r.numero]; }));
if (avisos.length) { console.log('\nAvisos (no cuentan como requisito):'); avisos.forEach(function (a) { console.log('  · ' + a); }); }
const fallan = requisitos.filter(function (r) { return !r.cumple; });
console.log('\n' + (fallan.length ? 'VEREDICTO: ' + fallan.length + ' de ' + requisitos.length + ' requisitos duros NO se cumplen.' : 'VEREDICTO: los ' + requisitos.length + ' requisitos duros se cumplen.') +
  '  (' + ((Date.now() - t0) / 1000).toFixed(0) + ' s de cómputo)');
if (CON_JSON) {
  const crudo = {};
  Object.keys(RES).forEach(function (k) { const r = RES[k]; if (r && r.n) crudo[k] = { gana: r.pGana, tres: r.pTres, acierto: r.acierto, dur: media(r.dur), durGana: media(r.durGanadas), turnos: media(r.turnos), pierde: r.pierde, noTermina: r.noTermina }; });
  console.log('\nJSON ' + JSON.stringify(crudo));
}
process.exitCode = fallan.length ? 1 : 0;
