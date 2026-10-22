// juego.js — lo que se ve y se oye: el pueblo, los letreros, los personajes, el menú, el mapa de 6 cuadras,
// la caja de fichas del puente, el termómetro Pre/Post, la vista del profesor y el Modo Salón por equipos.
// Dueño: agente de Construcción. Las reglas del juego están en logica.js y sus números en reglas.js;
// aquí solo hay medidas de dibujo (tamaños como fracción de la pantalla), colores y sonidos.

(function (raiz) {
  'use strict';
  const W = raiz;
  const VJ = raiz.VJ = raiz.VJ || {};
  const R = VJ.REGLAS;
  const doc = raiz.document;
  const $ = function (id) { return doc.getElementById(id); };
  const lienzo = $('lienzo');
  const ctx = lienzo.getContext('2d');
  const PI2 = Math.PI * 2;

  // Índices rápidos de verbos y grupos para consulta instantánea en interfaz y álbum
  VJ.VERBO_POR_ID = VJ.VERBO_POR_ID || {};
  VJ.VERBOS_POR_GRUPO = VJ.VERBOS_POR_GRUPO || {};
  (VJ.VERBOS || []).concat(VJ.REGULARES || []).forEach(function (v) {
    if (!v || !v.id) return;
    VJ.VERBO_POR_ID[v.id] = v;
  });
  (VJ.VERBOS || []).forEach(function (v) {
    if (!v || !v.grupo) return;
    if (!VJ.VERBOS_POR_GRUPO[v.grupo]) VJ.VERBOS_POR_GRUPO[v.grupo] = [];
    if (VJ.VERBOS_POR_GRUPO[v.grupo].indexOf(v) < 0) VJ.VERBOS_POR_GRUPO[v.grupo].push(v);
  });
  if (typeof VJ.verboDominado !== 'function') {
    VJ.verboDominado = function (h, reg) {
      return VJ.esSabido ? VJ.esSabido(h, reg || R) : !!(h && (h.sabido || (h.racha || 0) >= ((reg || R).rachaSabido || 3)));
    };
  }
  if (typeof VJ.totalDominados !== 'function') {
    VJ.totalDominados = function (hist, reg) {
      return (VJ.VERBOS || []).filter(function (v) {
        return VJ.verboDominado(hist && hist[v.id], reg || R);
      }).length;
    };
  }

  const CLAVE = 'verbosJuego';
  const FAMILIA = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  const C = {
    tinta: '#1b2a4a', papel: '#fffdf2', blanco: '#ffffff',
    cieloAlto: '#3f9be8', cieloBajo: '#cfeeff', sol: '#fff3a0',
    monte1: '#9cc7dd', monte2: '#6fb47c', monte3: '#4c9a58', pasto: '#9fcf73',
    calle: '#ecd9ae', calle2: '#e2cc9a', raya: '#b99a62', anden: '#d9d2c4', sardinel: '#a9a091',
    teja: '#c8553d', teja2: '#a8432f', madera: '#7a4a25',
    pizarra: '#1f5c47', pizarra2: '#174636', marco: '#a9713f', tiza: '#f6fbf4',
    ficha: '#ffd23f', fichaBorde: '#b97a00', verde: '#b9ffcf', verdeOscuro: '#128a43',
    rojo: '#ff6b6b', rojoOscuro: '#c62828', cian: '#9fe8ff', naranja: '#ffc078',
    morado: '#5b3cc4', turquesa: '#128a7e',
    monstruo: '#6a35b8', monstruo2: '#8a56d8', monstruoBorde: '#2c1259', ira: '#c4252f', ira2: '#e2555c', iraBorde: '#5c0b12'
  };
  const CASAS = ['#f7c948', '#ef6f6c', '#5fb0e8', '#7ccf8a', '#f39c5a', '#c58be0', '#fdf3e0', '#f48fb1', '#4fc3c8', '#fff1c9'];
  const ZOCALOS = ['#c0392b', '#1f6fb2', '#2e8b57', '#8e44ad', '#d35400', '#16788c', '#b5651d'];
  const CONFETI = ['#ffd23f', '#ff6b6b', '#4fc3c8', '#7ccf8a', '#c58be0', '#ffffff', '#ff8a3d', '#2a6fdb'];
  const AVISOS = ['TIENDA', 'PANADERÍA', 'FRUTAS', 'CAFÉ', 'PAPELERÍA', 'HELADOS'];
  const NOMBRE_MODO = { camino: 'Seguir aprendiendo', grupo: 'Practicar un grupo', repaso: 'Lo que me cuesta', salon: 'Modo Salón por Equipos' };
  const NOMBRE_PIDE = { pasado: 'pasado', participio: 'participio', base: "didn't + base", significado: 'significado', recoger: 'recoger' };
  const CUADRAS_INFO = [
    { tramo: 1, n: 1, icono: '🏠', nombre: 'Salida de Casa', corto: '1. Salida de Casa' },
    { tramo: 2, n: 2, icono: '🥐', nombre: 'La Panadería', corto: '2. La Panadería' },
    { tramo: 3, n: 3, icono: '🌳', nombre: 'El Parque', corto: '3. El Parque' },
    { tramo: 4, n: 4, icono: '🚉', nombre: 'La Estación', corto: '4. La Estación' },
    { tramo: 5, n: 5, icono: '🌉', nombre: 'El Puente Mayor', corto: '5. El Puente Mayor' },
    { tramo: 6, n: 6, icono: '🏫', nombre: 'El Colegio', corto: '6. El Colegio' }
  ];
  const CUADRAS = CUADRAS_INFO;
  const EQUIPOS_INFO = [
    { id: 0, nombre: 'Equipo 1 Azul', corto: 'Eq. 1 Azul', color: '#2a6fdb', fondo: '#d8ebff', texto: '#ffffff' },
    { id: 1, nombre: 'Equipo 2 Amarillo', corto: 'Eq. 2 Amarillo', color: '#ffb62e', fondo: '#fff2bd', texto: '#1b2a4a' },
    { id: 2, nombre: 'Equipo 3 Verde', corto: 'Eq. 3 Verde', color: '#1e9e56', fondo: '#d6ffe6', texto: '#ffffff' }
  ];

  // ───── Guardado local por clave ─────
  function cargar(clave, porDefecto) {
    try {
      const crudo = raiz.localStorage.getItem(CLAVE + '_' + clave);
      if (crudo != null) return JSON.parse(crudo);
    } catch (_) {}
    return porDefecto;
  }
  function guardar(clave, valor) {
    try {
      raiz.localStorage.setItem(CLAVE + '_' + clave, JSON.stringify(valor));
    } catch (_) {}
  }

  // ───── Estado de la interfaz ─────
  let pantalla = 'menu';            // 'menu' | 'juego' | 'final' | 'revision' | 'prepost' | 'profe' | 'salonConfig'
  let partida = null;
  let historial = cargar('historial', {});
  let mejorPuntaje = cargar('mejor', 0);
  let silencio = cargar('silencio', false);
  let tramoSeleccionado = cargar('tramo', 1);
  let profeDesbloqueaTodo = cargar('profeDesb', false);
  let profeDatos = null;
  let colaVoz = [];
  let pausa = false, pausaConTecla = false;
  let ultimoResumen = null;
  let tutorial = false;
  let reloj = 0, mundoZ = 0, fasePaso = 0;
  let pasados = [], flotantes = [], confeti = [], polvo = [], vuelos = [], brillos = [];
  let salvadoT = 0, victoriaT = 0, capturaT = 0, celebraT = 0, sacudeT = 0, destelloT = 0, pufT = 0, rugeT = 0, popT = 0, profeK = 0;
  let banda = null;
  let rev = null;
  let cruceTexto = '';
  let salon = null;
  let prepost = null;

  // ───── Medidas de la pantalla ─────
  const CAM = 4, TRAMO = 3.4, PARED = 2.45, Z_CERCA = -CAM * 0.72, VISUAL = 0.5;
  const G = { W: 0, H: 0, dpr: 1, u: 0, vertical: true, geos: {} };
  let cieloGrad = null;
  function medir() {
    const W = Math.max(200, raiz.innerWidth || doc.documentElement.clientWidth || 360);
    const H = Math.max(200, raiz.innerHeight || doc.documentElement.clientHeight || 640);
    const dpr = Math.min(2, raiz.devicePixelRatio || 1);
    G.W = W; G.H = H; G.dpr = dpr;
    lienzo.width = Math.round(W * dpr); lienzo.height = Math.round(H * dpr);
    const uV = Math.min(W, H * 0.55), uH = Math.min(W * 0.52, H * 1.15);
    G.vertical = uV >= uH;
    const u = G.u = G.vertical ? uV : uH;
    G.cx = W / 2; G.carril = u / 3; G.V = G.carril * 0.8;
    G.margen = Math.max(6, u * 0.022);
    G.letraHud = R.letraHud * u; G.letraChica = u * 0.045;
    G.hudH = (G.vertical ? G.letraHud * 2.3 : G.letraHud * 1.4) + G.letraChica * 1.9 + G.margen;
    G.zona = G.vertical ? u * 0.27 : u * 0.2;
    G.estudiante = G.vertical ? u * 0.24 : u * 0.19;
    G.cuelga = G.estudiante * 0.5;
    const minFrac = (salon && salon.activo && R.letraMinimaSalon) ? R.letraMinimaSalon : R.letraMinima;
    G.letraPieMin = minFrac * u / R.anchoCalleLejos;
    G.letraPieMax = u * (salon && salon.activo ? 0.09 : 0.08);
    G.separa = u * 0.014; G.altoLetrero = 1.75;
    const yPie = H - G.zona, yH = G.hudH + (G.vertical ? u * 0.33 : u * 0.17);
    G.geos.juego = { yH: yH, yPie: yPie };
    G.geos.menu = G.vertical ? { yH: H * 0.2, yPie: H * 0.38 } : { yH: H * 0.24, yPie: H * 0.48 };
    // En 1280x720 el edificio del colegio se dibuja más abajo para que nunca toque el título ni el puntaje
    G.geos.final = G.vertical ? { yH: H * 0.28, yPie: H * 0.54 } : { yH: H * 0.36, yPie: H * 0.62 };
    G.geos.revision = G.vertical ? { yH: H * 0.44, yPie: H * 0.67 } : (H < 480 ? { yH: H * 0.48, yPie: H * 0.82 } : { yH: H * 0.52, yPie: H * 0.85 });
    $('revision').classList.toggle('lado', !G.vertical);
    $('revision').classList.toggle('bajo', !G.vertical && H < 480);
    usarGeo('juego');
    G.ySale = yH + 0.44 * (yPie - yH);
    if (G.vertical) {
      const w = Math.min(W, u * 1.25) - 2 * G.margen;
      G.globo = { x: G.cx - w / 2, y: G.hudH + G.margen, w: w, h: u * 0.4 };
    } else {
      const lado = (W - u) / 2;
      G.globo = { x: G.margen, y: G.hudH + G.margen, w: Math.max(120, lado - G.margen), h: Math.min(H - G.hudH - 2 * G.margen - 40, lado * 1.3) };
    }
    cieloGrad = null;
    cacheFilas = new WeakMap();
  }
  function usarGeo(nombre) {
    const g = G.geos[nombre] || G.geos.juego;
    G.yH = g.yH; G.yPie = g.yPie; G.camH = (g.yPie - g.yH) / G.V;
  }

  function fuente(px, peso) { return (peso || 700) + ' ' + px.toFixed(2) + 'px ' + FAMILIA; }
  function limitar(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function suave(k) { k = limitar(k, 0, 1); return k * k * (3 - 2 * k); }
  function azarFijo(i, k) { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); }

  function yDe(z) { return G.yPie - (z / R.distanciaVista) * (G.yPie - G.ySale); }
  function escalaDe(z) { return 1 - (z / R.distanciaVista) * (1 - R.anchoCalleLejos); }
  function xCarril(c, z) { return G.cx + (c - 1) * G.carril * escalaDe(z); }
  function sV(z) { return CAM / (z + CAM); }
  function pV(x, z, h) { const s = sV(z); return [G.cx + x * G.carril * s, G.yH + (G.yPie - G.yH) * s - h * G.V * s]; }

  function redondo(x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }
  function cuad(a, b, c, d, color) {
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.closePath();
    ctx.fillStyle = color; ctx.fill();
  }
  function circulo(x, y, r, color) { ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, PI2); ctx.fillStyle = color; ctx.fill(); }
  function elipse(x, y, rx, ry, color) { ctx.beginPath(); ctx.ellipse(x, y, Math.max(0, rx), Math.max(0, ry), 0, 0, PI2); ctx.fillStyle = color; ctx.fill(); }
  function estrella(cx, cy, r, color, borde, aplasta) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.46 : r;
      const x = cx + Math.cos(a) * rr * (aplasta == null ? 1 : aplasta), y = cy + Math.sin(a) * rr;
      if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
    }
    ctx.closePath(); ctx.fillStyle = color; ctx.fill();
    if (borde) { ctx.lineWidth = Math.max(1.5, r * 0.14); ctx.strokeStyle = borde; ctx.lineJoin = 'round'; ctx.stroke(); }
  }
  function textoBorde(t, x, y, relleno, borde, grosor) {
    ctx.lineJoin = 'round'; ctx.lineWidth = grosor; ctx.strokeStyle = borde; ctx.strokeText(t, x, y);
    ctx.fillStyle = relleno; ctx.fillText(t, x, y);
  }
  function partirTexto(texto, ancho) {
    const palabras = String(texto).split(/\s+/), lineas = [];
    let linea = '';
    palabras.forEach(function (p) {
      const prueba = linea ? linea + ' ' + p : p;
      if (linea && ctx.measureText(prueba).width > ancho) { lineas.push(linea); linea = p; } else linea = prueba;
    });
    if (linea) lineas.push(linea);
    return lineas;
  }
  function letraQueCabe(texto, ancho, max, peso) {
    ctx.font = fuente(100, peso);
    return Math.min(max, 100 * ancho / Math.max(1, ctx.measureText(texto).width));
  }

  // ═════════════════════ EL PUEBLO ═════════════════════
  function dibujarCielo() {
    const W = G.W, u = G.u;
    if (!cieloGrad) {
      cieloGrad = ctx.createLinearGradient(0, 0, 0, Math.max(G.geos.juego.yH, G.geos.menu.yH, G.geos.final.yH));
      cieloGrad.addColorStop(0, C.cieloAlto); cieloGrad.addColorStop(1, C.cieloBajo);
    }
    ctx.fillStyle = cieloGrad; ctx.fillRect(0, 0, W, G.yH + 2);
    const sx = W * 0.8, sy = Math.max(G.yH - u * 0.36, u * 0.12);
    circulo(sx, sy, u * 0.105 + Math.sin(reloj * 1.3) * u * 0.006, 'rgba(255,243,160,.35)');
    circulo(sx, sy, u * 0.07, C.sol);
    for (let i = 0; i < 4; i++) {
      const ancho = W + u * 0.8;
      const x = ((azarFijo(i, 3) * ancho + reloj * (6 + i * 3)) % ancho) - u * 0.4;
      const y = G.yH - u * (0.17 + azarFijo(i, 4) * 0.3), r = u * (0.035 + azarFijo(i, 5) * 0.025);
      ctx.fillStyle = 'rgba(255,255,255,.92)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, PI2); ctx.arc(x + r * 1.1, y - r * 0.5, r * 1.15, 0, PI2); ctx.arc(x + r * 2.3, y, r * 0.95, 0, PI2);
      ctx.rect(x, y - r * 0.1, r * 2.3, r * 1.1);
      ctx.fill();
    }
    const capas = [[C.monte1, 0.2, 0.6, 1.9], [C.monte2, 0.135, 1.3, 3.1], [C.monte3, 0.08, 2.6, 4.7]];
    capas.forEach(function (c, k) {
      const corr = mundoZ * c[2] * u * 0.002;
      ctx.beginPath(); ctx.moveTo(0, G.yH + 2);
      for (let x = 0; x <= W + 18; x += 18) {
        const t = (x + corr) / u;
        const h = (0.55 + 0.3 * Math.sin(t * c[3] + k * 2.1) + 0.15 * Math.sin(t * c[3] * 2.3 + k)) * c[1] * u;
        ctx.lineTo(x, G.yH - h);
      }
      ctx.lineTo(W + 18, G.yH + 2); ctx.closePath();
      ctx.fillStyle = c[0]; ctx.fill();
    });
  }

  function pared(lado, za, zb, h0, h1, color) {
    za = Math.max(za, Z_CERCA); if (zb <= za) return;
    const x = lado * PARED;
    cuad(pV(x, za, h0), pV(x, zb, h0), pV(x, zb, h1), pV(x, za, h1), color);
  }
  function avisoEnPared(lado, za, zb, h0, h1, texto, fondo, tinta) {
    if (za < Z_CERCA) return;
    const x = lado * PARED;
    const zi = lado < 0 ? za : zb, zd = lado < 0 ? zb : za;
    const tl = pV(x, zi, h1), tr = pV(x, zd, h1), bl = pV(x, zi, h0), br = pV(x, zd, h0);
    if (Math.abs(tr[0] - tl[0]) < 26) return;
    cuad(tl, tr, br, bl, fondo);
    ctx.save();
    ctx.transform(tr[0] - tl[0], tr[1] - tl[1], bl[0] - tl[0], bl[1] - tl[1], tl[0], tl[1]);
    ctx.font = fuente(100, 800);
    const w = ctx.measureText(texto).width;
    ctx.scale(1 / (w * 1.16), 1 / 140);
    ctx.fillStyle = tinta; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.fillText(texto, w * 0.08, 106);
    ctx.restore();
  }

  function dibujarCasa(lado, i, z0) {
    const zA = z0 + 0.05, zB = z0 + TRAMO - 0.05;
    if (zB <= Z_CERCA + 0.1) return;
    if (PARED * G.carril * sV(zB) > G.W / 2 + 6) return;
    const k = lado * 50 + 7;
    const tipo = azarFijo(i, k), s = sV((Math.max(zA, Z_CERCA) + zB) / 2);
    const f = function (a) { return z0 + a * TRAMO; };
    const xP = lado * PARED;
    if (tipo > 0.9) {
      const c = pV(lado * (PARED + 1.1), z0 + TRAMO * 0.5, G.camH * 0.95), r = G.carril * 1.5 * sV(z0 + TRAMO * 0.5);
      circulo(c[0], c[1], r, '#3f8f4f'); circulo(c[0] - r * 0.25, c[1] - r * 0.25, r * 0.7, '#5fb46a');
      pared(lado, zA, zB, 0, 1.5, '#fbf6ea'); pared(lado, zA, zB, 0, 0.4, '#c9b79c'); pared(lado, zA, zB, 1.5, 1.72, C.teja);
      return;
    }
    const color = CASAS[Math.floor(azarFijo(i, k + 1) * CASAS.length)];
    const zoc = ZOCALOS[Math.floor(azarFijo(i, k + 2) * ZOCALOS.length)];
    const alto = Math.max(4.1 + azarFijo(i, k + 3) * 1.3, G.camH * (1.12 + azarFijo(i, k + 3) * 0.38));
    if (zA > Z_CERCA) cuad(pV(xP, zA, 0), pV(xP + lado * 4, zA, 0), pV(xP + lado * 4, zA, alto), pV(xP, zA, alto), 'rgba(27,42,74,.25)');
    pared(lado, zA, zB, 0, alto, color);
    const zr = Math.max(zA, Z_CERCA);
    cuad(pV(xP - lado * 0.3, zr, alto - 0.08), pV(xP - lado * 0.3, zB, alto - 0.08), pV(xP + lado * 0.8, zB, alto + 0.8), pV(xP + lado * 0.8, zr, alto + 0.8), C.teja);
    cuad(pV(xP - lado * 0.3, zr, alto - 0.22), pV(xP - lado * 0.3, zB, alto - 0.22), pV(xP - lado * 0.3, zB, alto - 0.06), pV(xP - lado * 0.3, zr, alto - 0.06), C.teja2);
    if (s < 0.14) return;
    pared(lado, zA, zB, 0, 0.6, zoc);
    const tienda = tipo < 0.24;
    pared(lado, f(0.11), f(0.4), 0, 2.12, C.blanco);
    pared(lado, f(0.135), f(0.375), 0, 2.0, tienda ? '#3b2a20' : (tipo < 0.6 ? C.madera : zoc));
    pared(lado, f(0.53), f(0.87), 0.82, 1.95, C.blanco);
    pared(lado, f(0.555), f(0.845), 0.92, 1.85, '#35557e');
    pared(lado, f(0.69), f(0.71), 0.92, 1.85, C.blanco);
    if (tienda) {
      const t = AVISOS[Math.floor(azarFijo(i, k + 4) * AVISOS.length)];
      avisoEnPared(lado, f(0.1), f(0.9), 2.5, 3.25, t, '#fff8e3', C.tinta);
      const za = Math.max(f(0.06), Z_CERCA), zb = f(0.94);
      cuad(pV(xP, za, 2.45), pV(xP, zb, 2.45), pV(xP - lado * 0.6, zb, 2.12), pV(xP - lado * 0.6, za, 2.12), azarFijo(i, k + 5) < 0.5 ? '#e5484d' : '#2a9d8f');
    }
    for (let piso = 1, b = tienda ? 3.7 : 2.75; b + 1.5 < alto - 0.2 && piso < 4; piso++, b += 2.3) {
      if ((piso + Math.floor(tipo * 10)) % 2 === 1) {
        pared(lado, f(0.36), f(0.64), b, b + 1.45, C.blanco);
        pared(lado, f(0.385), f(0.615), b, b + 1.35, '#35557e');
        const za = Math.max(f(0.16), Z_CERCA), zb = f(0.84);
        cuad(pV(xP, za, b), pV(xP, zb, b), pV(xP - lado * 0.32, zb, b - 0.12), pV(xP - lado * 0.32, za, b - 0.12), zoc);
        cuad(pV(xP - lado * 0.32, za, b - 0.12), pV(xP - lado * 0.32, zb, b - 0.12), pV(xP - lado * 0.32, zb, b + 0.55), pV(xP - lado * 0.32, za, b + 0.55), 'rgba(27,42,74,.5)');
        for (let m = 0; m < 3; m++) {
          const zm = f(0.26 + m * 0.24); if (zm < Z_CERCA) continue;
          const p = pV(xP - lado * 0.32, zm, b + 0.62), r = G.carril * 0.2 * sV(zm);
          circulo(p[0], p[1], r, '#3f9a4f'); circulo(p[0] + r * 0.3, p[1] - r * 0.35, r * 0.4, m % 2 ? '#ff5c8a' : '#ffd23f');
        }
      } else {
        [[0.16, 0.42], [0.58, 0.84]].forEach(function (v) {
          pared(lado, f(v[0]), f(v[1]), b + 0.25, b + 1.3, C.blanco);
          pared(lado, f(v[0] + 0.025), f(v[1] - 0.025), b + 0.34, b + 1.21, '#35557e');
        });
      }
    }
  }

  function dibujarMobiliario(i, z) {
    if (z < Z_CERCA + 0.3) return;
    const s = sV(z);
    if (s < 0.09) return;
    const altoPoste = Math.max(3.9, G.camH * 1.1);
    [-1, 1].forEach(function (lado) {
      const par = ((i % 2) + 2) % 2 === 0;
      if (par) {
        const base = pV(lado * 1.86, z, 0), punta = pV(lado * 1.86, z, altoPoste);
        if (Math.abs(base[0] - G.cx) > G.W / 2 + 40) return;
        ctx.strokeStyle = '#5b5148'; ctx.lineCap = 'round';
        const lejos = pV(lado * 1.86, z + TRAMO * 2, altoPoste), medio = pV(lado * 1.86, z + TRAMO, altoPoste - 0.5);
        ctx.lineWidth = Math.max(1, G.carril * 0.012 * s);
        ctx.beginPath(); ctx.moveTo(punta[0], punta[1]); ctx.quadraticCurveTo(medio[0], medio[1], lejos[0], lejos[1]); ctx.stroke();
        ctx.lineWidth = Math.max(1.5, G.carril * 0.075 * s);
        ctx.beginPath(); ctx.moveTo(base[0], base[1]); ctx.lineTo(punta[0], punta[1]); ctx.stroke();
        const brazo = pV(lado * 1.4, z, altoPoste - 0.15);
        ctx.lineWidth = Math.max(1, G.carril * 0.04 * s);
        ctx.beginPath(); ctx.moveTo(punta[0], punta[1] + G.V * 0.3 * s); ctx.lineTo(brazo[0], brazo[1]); ctx.stroke();
        circulo(brazo[0], brazo[1] + G.V * 0.08 * s, G.carril * 0.085 * s, '#fff3a0');
      } else if (azarFijo(i, lado + 9) < 0.34) {
        const base = pV(lado * 2.02, z, 0), copa = pV(lado * 2.02, z, 2.1), r = G.carril * 0.6 * s;
        if (Math.abs(base[0] - G.cx) > G.W / 2 + r) return;
        ctx.strokeStyle = '#7a5230'; ctx.lineWidth = Math.max(1.5, G.carril * 0.13 * s); ctx.lineCap = 'butt';
        ctx.beginPath(); ctx.moveTo(base[0], base[1]); ctx.lineTo(copa[0], copa[1]); ctx.stroke();
        circulo(copa[0], copa[1], r, '#3f9a4f'); circulo(copa[0] - r * 0.28, copa[1] - r * 0.3, r * 0.62, '#62bd6c');
      }
    });
    if (((i % 4) + 4) % 4 === 1 && s < 1.3) {
      const alto = Math.max(4.3, G.camH * 1.28);
      const a = pV(-PARED, z, alto), b = pV(PARED, z, alto), m = pV(0, z, alto - 0.9);
      ctx.strokeStyle = '#5b5148'; ctx.lineWidth = Math.max(1, G.carril * 0.012 * s);
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(m[0], m[1], b[0], b[1]); ctx.stroke();
      const t = G.carril * 0.21 * s;
      for (let j = 1; j < 12 && t > 1.5; j++) {
        const q = j / 12, x = (1 - q) * (1 - q) * a[0] + 2 * q * (1 - q) * m[0] + q * q * b[0], y = (1 - q) * (1 - q) * a[1] + 2 * q * (1 - q) * m[1] + q * q * b[1];
        ctx.beginPath(); ctx.moveTo(x - t * 0.55, y); ctx.lineTo(x + t * 0.55, y); ctx.lineTo(x, y + t * 1.25); ctx.closePath();
        ctx.fillStyle = CONFETI[(j + i) % 5]; ctx.fill();
      }
    }
  }

  function dibujarMundo() {
    const W = G.W, H = G.H;
    dibujarCielo();
    ctx.fillStyle = C.pasto; ctx.fillRect(0, G.yH, W, H - G.yH + 20);
    const cerca = pV(1, Z_CERCA, 0), k = (cerca[0] - G.cx);
    const tira = function (x, color) {
      ctx.beginPath(); ctx.moveTo(G.cx, G.yH); ctx.lineTo(G.cx + x * k, cerca[1]); ctx.lineTo(G.cx - x * k, cerca[1]); ctx.closePath();
      ctx.fillStyle = color; ctx.fill();
    };
    tira(PARED, C.anden); tira(1.58, C.sardinel); tira(1.5, C.calle);
    const cada = 1.25, corr = mundoZ % (cada * 2);
    for (let z = Z_CERCA - corr - cada * 2; z < 34; z += cada * 2) {
      const a = Math.max(z, Z_CERCA), b = z + cada; if (b <= Z_CERCA) continue;
      cuad(pV(-1.5, a, 0), pV(1.5, a, 0), pV(1.5, b, 0), pV(-1.5, b, 0), C.calle2);
    }
    const cadaR = 2.2, corrR = mundoZ % cadaR;
    for (let z = Z_CERCA - corrR - cadaR; z < 30; z += cadaR) {
      const a = Math.max(z, Z_CERCA), b = z + 0.95; if (b <= Z_CERCA) continue;
      [-0.5, 0.5].forEach(function (x) { cuad(pV(x - 0.03, a, 0), pV(x + 0.03, a, 0), pV(x + 0.03, b, 0), pV(x - 0.03, b, 0), C.raya); });
    }
    const iLejos = Math.floor((mundoZ + 44) / TRAMO), iCerca = Math.floor((mundoZ + Z_CERCA) / TRAMO) - 1;
    for (let i = iLejos; i >= iCerca; i--) {
      const z0 = i * TRAMO - mundoZ;
      dibujarCasa(-1, i, z0); dibujarCasa(1, i, z0);
      dibujarMobiliario(i, z0);
    }
  }

  function dibujarColegio(cx, base, w) {
    const h = w * 0.48, x = cx - w / 2;
    ctx.save();
    ctx.fillStyle = '#fff3d6'; ctx.fillRect(x, base - h, w, h);
    ctx.fillStyle = '#2a6fdb'; ctx.fillRect(x, base - h * 0.2, w, h * 0.2);
    ctx.beginPath(); ctx.moveTo(x - w * 0.04, base - h); ctx.lineTo(x + w * 1.04, base - h); ctx.lineTo(x + w * 0.94, base - h * 1.28); ctx.lineTo(x + w * 0.06, base - h * 1.28); ctx.closePath();
    ctx.fillStyle = C.teja; ctx.fill();
    ctx.fillStyle = C.teja2; ctx.fillRect(x - w * 0.04, base - h * 1.02, w * 1.08, h * 0.06);
    const pw = w * 0.22, ph = h * 0.66;
    ctx.fillStyle = '#fff'; redondo(cx - pw * 0.6, base - ph * 1.08, pw * 1.2, ph * 1.08, pw * 0.6); ctx.fill();
    ctx.fillStyle = C.madera; redondo(cx - pw / 2, base - ph, pw, ph + pw, pw * 0.5); ctx.fill();
    ctx.fillStyle = '#fff3d6'; ctx.fillRect(cx - pw * 0.7, base, pw * 1.4, pw + 2);
    ctx.fillStyle = '#5a3418'; ctx.fillRect(cx - w * 0.006, base - ph * 0.92, w * 0.012, ph * 0.92);
    [-0.36, -0.2, 0.2, 0.36].forEach(function (d) {
      ctx.fillStyle = '#fff'; ctx.fillRect(cx + d * w - w * 0.055, base - h * 0.74, w * 0.11, h * 0.36);
      ctx.fillStyle = '#35557e'; ctx.fillRect(cx + d * w - w * 0.043, base - h * 0.71, w * 0.086, h * 0.3);
    });
    ctx.fillStyle = C.tinta; redondo(cx - w * 0.2, base - h * 0.99, w * 0.4, h * 0.2, h * 0.04); ctx.fill();
    ctx.font = fuente(h * 0.13, 800); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff';
    ctx.fillText('COLEGIO', cx, base - h * 0.885, w * 0.36);
    // Bandera (contenida para no invadir jamás el cartel superior en 1280x720)
    const bx = cx + w * 0.3, by = base - h * 1.28;
    ctx.strokeStyle = '#5b5148'; ctx.lineWidth = Math.max(1.5, w * 0.008);
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by - h * 0.38); ctx.stroke();
    const on = Math.sin(reloj * 4) * h * 0.012;
    ctx.fillStyle = '#ffd23f'; ctx.fillRect(bx, by - h * 0.38, w * 0.12, h * 0.09 + on);
    ctx.fillStyle = '#2a6fdb'; ctx.fillRect(bx, by - h * 0.29 + on, w * 0.12, h * 0.045);
    ctx.fillStyle = '#e5484d'; ctx.fillRect(bx, by - h * 0.245 + on, w * 0.12, h * 0.045);
    ctx.restore();
  }

  // ═════════════════════ PERSONAJES ═════════════════════
  function dibujarEstudiante(x, y, s, o) {
    const fase = o.fase || 0, traspie = o.traspie || 0, salto = o.salto || 0, arriba = o.brazosArriba || 0;
    const zanc = Math.sin(fase), rebote = Math.abs(Math.cos(fase));
    elipse(x, y + s * 0.01, s * 0.24 * (1 - salto * 0.4), s * 0.055, 'rgba(27,42,74,.25)');
    ctx.save();
    ctx.translate(x, y - rebote * s * 0.035 - salto * s * 0.42 + traspie * s * 0.07);
    ctx.rotate((o.inclina || 0) * 0.26 + Math.sin(traspie * Math.PI * 3) * traspie * 0.5);
    if (traspie > 0) ctx.scale(1, 1 - traspie * 0.12);
    [[-1, zanc], [1, -zanc]].forEach(function (p) {
      const largo = s * (0.3 + p[1] * 0.06), px = p[0] * s * 0.085;
      ctx.fillStyle = '#24376b'; redondo(px - s * 0.06, -s * 0.36, s * 0.12, largo, s * 0.04); ctx.fill();
      ctx.fillStyle = '#e8c9a0'; ctx.fillRect(px - s * 0.035, -s * 0.36 + largo - s * 0.07, s * 0.07, s * 0.06);
      ctx.fillStyle = p[1] > 0.2 ? '#f4f4f4' : '#2b2b33';
      redondo(px - s * 0.075, -s * 0.36 + largo - s * 0.02, s * 0.15, s * 0.07, s * 0.03); ctx.fill();
    });
    [[-1, -zanc], [1, zanc]].forEach(function (b) {
      ctx.save();
      ctx.translate(b[0] * s * 0.2, -s * 0.71);
      ctx.rotate(b[0] * (0.18 + arriba * 2.5 + traspie * 1.1) + b[1] * 0.12 * (1 - arriba));
      const largo = s * (0.25 + b[1] * 0.05 * (1 - arriba));
      ctx.fillStyle = '#ffffff'; redondo(-s * 0.05, 0, s * 0.1, largo * 0.55, s * 0.04); ctx.fill();
      ctx.fillStyle = '#e8c9a0'; redondo(-s * 0.04, largo * 0.5, s * 0.08, largo * 0.5, s * 0.04); ctx.fill();
      ctx.restore();
    });
    ctx.fillStyle = '#24376b'; redondo(-s * 0.17, -s * 0.44, s * 0.34, s * 0.13, s * 0.04); ctx.fill();
    ctx.fillStyle = '#ffffff'; redondo(-s * 0.2, -s * 0.76, s * 0.4, s * 0.36, s * 0.08); ctx.fill();
    ctx.strokeStyle = 'rgba(27,42,74,.35)'; ctx.lineWidth = Math.max(1, s * 0.012); ctx.stroke();
    const mb = Math.cos(fase * 2) * s * 0.014;
    const colorMorral = (salon && salon.activo && EQUIPOS_INFO[salon.turnoEquipo]) ? EQUIPOS_INFO[salon.turnoEquipo].color : '#e5484d';
    ctx.fillStyle = '#1b2a4a'; redondo(-s * 0.19, -s * 0.76, s * 0.07, s * 0.2, s * 0.03); ctx.fill(); redondo(s * 0.12, -s * 0.76, s * 0.07, s * 0.2, s * 0.03); ctx.fill();
    ctx.fillStyle = colorMorral; redondo(-s * 0.155, -s * 0.73 + mb, s * 0.31, s * 0.33, s * 0.07); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,.18)'; redondo(-s * 0.155, -s * 0.73 + mb, s * 0.31, s * 0.12, s * 0.07); ctx.fill();
    ctx.fillStyle = '#ffd23f'; redondo(-s * 0.09, -s * 0.555 + mb, s * 0.18, s * 0.1, s * 0.025); ctx.fill();
    ctx.fillStyle = '#e8c9a0'; ctx.fillRect(-s * 0.045, -s * 0.81, s * 0.09, s * 0.07);
    circulo(-s * 0.125, -s * 0.9, s * 0.03, '#e8c9a0'); circulo(s * 0.125, -s * 0.9, s * 0.03, '#e8c9a0');
    circulo(0, -s * 0.915, s * 0.128, '#2e1d12');
    ctx.fillStyle = '#2e1d12';
    ctx.beginPath(); ctx.moveTo(-s * 0.04, -s * 1.03); ctx.lineTo(s * 0.01, -s * 1.1 - rebote * s * 0.015); ctx.lineTo(s * 0.05, -s * 1.02); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function dibujarMonstruo(cx, arriba, rx, o) {
    const esc = o.escala || 1; rx *= esc;
    const ry = rx * 0.82, t = reloj;
    const x0 = cx + (o.ira ? Math.sin(t * 47) * rx * 0.03 : 0), cy = arriba + ry;
    ctx.save();
    elipse(x0, cy + ry * 0.95, rx * 0.95, ry * 0.14, 'rgba(27,42,74,.2)');
    const forma = function (k) {
      ctx.beginPath();
      for (let i = 0; i <= 44; i++) {
        const a = i / 44 * PI2;
        const r = k * (1 + 0.075 * Math.sin(a * 6 + t * 3.2) + 0.05 * Math.sin(a * 10 - t * 2.1) + 0.03 * Math.sin(t * 5));
        const px = x0 + Math.cos(a) * rx * r, py = cy + Math.sin(a) * ry * r;
        if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
      }
      ctx.closePath();
    };
    forma(1); ctx.fillStyle = o.ira ? C.ira : C.monstruo; ctx.fill();
    ctx.lineWidth = Math.max(2, rx * 0.045); ctx.strokeStyle = o.ira ? C.iraBorde : C.monstruoBorde; ctx.lineJoin = 'round'; ctx.stroke();
    elipse(x0 - rx * 0.28, cy - ry * 0.48, rx * 0.34, ry * 0.2, o.ira ? C.ira2 : C.monstruo2);
    [-1, 1].forEach(function (d) {
      ctx.beginPath(); ctx.moveTo(x0 + d * rx * 0.42, arriba + ry * 0.16); ctx.lineTo(x0 + d * rx * 0.62, arriba - ry * 0.16); ctx.lineTo(x0 + d * rx * 0.66, arriba + ry * 0.3); ctx.closePath();
      ctx.fillStyle = '#fff1c9'; ctx.fill(); ctx.lineWidth = Math.max(1.5, rx * 0.03); ctx.stroke();
    });
    const oy = arriba + ry * 0.42, sep = rx * 0.34, ro = rx * 0.2;
    [-1, 1].forEach(function (d) {
      const ex = x0 + d * sep;
      if (o.feliz) {
        ctx.lineWidth = Math.max(2.5, rx * 0.05); ctx.strokeStyle = '#fff'; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(ex, oy + ro * 0.2, ro * 0.7, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
        return;
      }
      circulo(ex, oy, ro, '#ffffff');
      ctx.lineWidth = Math.max(1.5, rx * 0.03); ctx.strokeStyle = o.ira ? C.iraBorde : C.monstruoBorde; ctx.stroke();
      let dx = 0, dy = -1;
      if (o.mira) { dx = o.mira[0] - ex; dy = o.mira[1] - oy; const n = Math.hypot(dx, dy) || 1; dx /= n; dy /= n; }
      circulo(ex + dx * ro * 0.42, oy + dy * ro * 0.42, ro * 0.5, '#10142a');
      circulo(ex + dx * ro * 0.42 - ro * 0.15, oy + dy * ro * 0.42 - ro * 0.18, ro * 0.15, '#ffffff');
      if (o.ira || o.triste) {
        ctx.lineWidth = Math.max(2.5, rx * 0.06); ctx.strokeStyle = o.ira ? C.iraBorde : C.monstruoBorde; ctx.lineCap = 'round';
        const g = (o.triste ? -1 : 1) * d;
        ctx.beginPath(); ctx.moveTo(ex - ro * 1.0, oy - ro * (1.25 + 0.35 * g)); ctx.lineTo(ex + ro * 1.0, oy - ro * (1.25 - 0.35 * g)); ctx.stroke();
      }
    });
    const by = arriba + ry * 0.92, bw = rx * 0.5, abre = limitar(o.boca || 0, 0, 1);
    if (o.feliz || o.triste) {
      ctx.lineWidth = Math.max(2.5, rx * 0.05); ctx.strokeStyle = '#fff'; ctx.lineCap = 'round';
      ctx.beginPath();
      if (o.feliz) ctx.arc(x0, by - ry * 0.12, bw * 0.8, Math.PI * 0.12, Math.PI * 0.88); else ctx.arc(x0, by + ry * 0.3, bw * 0.55, Math.PI * 1.2, Math.PI * 1.8);
      ctx.stroke();
    } else if (abre > 0.12) {
      const bh = ry * 0.42 * abre;
      elipse(x0, by + bh * 0.3, bw, bh, '#2b0a1a');
      elipse(x0, by + bh * 0.85, bw * 0.55, bh * 0.4, '#ff7b9c');
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 5; i++) {
        const tx = x0 - bw * 0.72 + i * bw * 0.36;
        ctx.beginPath(); ctx.moveTo(tx - bw * 0.15, by - bh * 0.42); ctx.lineTo(tx + bw * 0.15, by - bh * 0.42); ctx.lineTo(tx, by - bh * 0.42 + bh * 0.62); ctx.closePath(); ctx.fill();
      }
    } else {
      ctx.beginPath();
      for (let i = 0; i <= 8; i++) { const px = x0 - bw + 2 * bw * i / 8, py = by + (i % 2 ? ry * 0.13 : 0); if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
      ctx.lineWidth = Math.max(2, rx * 0.045); ctx.strokeStyle = '#ffffff'; ctx.lineJoin = 'miter'; ctx.stroke();
    }
    ctx.restore();
  }

  function dibujarProfesor(x, y, s, pose) {
    const celebra = pose === 'celebra', mueve = Math.sin(reloj * 6);
    ctx.save();
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const borde = function () { ctx.lineWidth = Math.max(1.5, s * 0.022); ctx.strokeStyle = C.tinta; ctx.stroke(); };
    const brazo = function (d, ang, tiza) {
      ctx.save();
      ctx.translate(x + d * s * 0.3, y + s * 0.4); ctx.rotate(ang);
      ctx.fillStyle = '#2e8b57'; redondo(-s * 0.07, -s * 0.38, s * 0.14, s * 0.42, s * 0.06); ctx.fill(); borde();
      circulo(0, -s * 0.4, s * 0.075, '#f1c27d'); borde();
      if (tiza) { ctx.fillStyle = '#ffffff'; ctx.fillRect(-s * 0.02, -s * 0.58, s * 0.045, s * 0.15); ctx.lineWidth = 1; ctx.strokeStyle = C.tinta; ctx.strokeRect(-s * 0.02, -s * 0.58, s * 0.045, s * 0.15); }
      ctx.restore();
    };
    if (celebra) { brazo(-1, -0.55 + mueve * 0.2, false); brazo(1, 0.55 - mueve * 0.2, true); }
    else { brazo(-1, -2.75, false); brazo(1, 0.7 + mueve * 0.08, true); }
    ctx.beginPath();
    ctx.moveTo(x - s * 0.44, y + s * 0.78); ctx.lineTo(x - s * 0.36, y + s * 0.36);
    ctx.quadraticCurveTo(x, y + s * 0.2, x + s * 0.36, y + s * 0.36); ctx.lineTo(x + s * 0.44, y + s * 0.78); ctx.closePath();
    ctx.fillStyle = '#2e8b57'; ctx.fill(); borde();
    ctx.beginPath(); ctx.moveTo(x - s * 0.12, y + s * 0.27); ctx.lineTo(x + s * 0.12, y + s * 0.27); ctx.lineTo(x, y + s * 0.6); ctx.closePath(); ctx.fillStyle = '#ffffff'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(x - s * 0.035, y + s * 0.3); ctx.lineTo(x + s * 0.035, y + s * 0.3); ctx.lineTo(x + s * 0.05, y + s * 0.5); ctx.lineTo(x, y + s * 0.58); ctx.lineTo(x - s * 0.05, y + s * 0.5); ctx.closePath(); ctx.fillStyle = '#e5484d'; ctx.fill();
    circulo(x - s * 0.27, y + s * 0.02, s * 0.05, '#f1c27d'); circulo(x + s * 0.27, y + s * 0.02, s * 0.05, '#f1c27d');
    circulo(x, y, s * 0.27, '#f1c27d'); borde();
    ctx.fillStyle = '#e6e9f0';
    ctx.beginPath(); ctx.arc(x, y - s * 0.02, s * 0.285, Math.PI * 1.02, Math.PI * 1.98); ctx.quadraticCurveTo(x, y - s * 0.2, x - s * 0.285, y - s * 0.04); ctx.closePath(); ctx.fill(); borde();
    [-1, 1].forEach(function (d) {
      circulo(x + d * s * 0.105, y + s * 0.02, s * 0.085, '#ffffff'); ctx.lineWidth = Math.max(1.5, s * 0.028); ctx.strokeStyle = C.tinta; ctx.stroke();
      circulo(x + d * s * 0.105 + s * 0.015, y + s * 0.03, s * 0.03, C.tinta);
      ctx.beginPath(); ctx.moveTo(x + d * s * 0.04, y - s * 0.1); ctx.lineTo(x + d * s * 0.18, y - s * (celebra ? 0.14 : 0.115)); ctx.strokeStyle = '#9aa0ad'; ctx.lineWidth = Math.max(2, s * 0.035); ctx.stroke();
    });
    ctx.strokeStyle = C.tinta; ctx.lineWidth = Math.max(1.5, s * 0.028);
    ctx.beginPath(); ctx.moveTo(x - s * 0.02, y + s * 0.02); ctx.lineTo(x + s * 0.02, y + s * 0.02); ctx.stroke();
    ctx.fillStyle = '#e6e9f0'; ctx.beginPath(); ctx.ellipse(x, y + s * 0.125, s * 0.1, s * 0.035, 0, 0, PI2); ctx.fill();
    ctx.beginPath(); ctx.arc(x, y + s * 0.13, s * (celebra ? 0.1 : 0.075), Math.PI * 0.15, Math.PI * 0.85);
    if (celebra) { ctx.closePath(); ctx.fillStyle = '#ffffff'; ctx.fill(); }
    ctx.strokeStyle = C.tinta; ctx.stroke();
    ctx.restore();
  }

  // El profesor de espaldas en el puente: hombros redondeados, cuello, cabeza con pelo canoso, patillas de las gafas y brazos abiertos con manos claras protegiendo el puente.
  function dibujarProfesorFrena(x, y, s, esfuerzo) {
    ctx.save();
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const borde = function () { ctx.lineWidth = Math.max(1.5, s * 0.024); ctx.strokeStyle = C.tinta; ctx.stroke(); };
    const latido = Math.sin(reloj * 6) * 0.04;
    ctx.translate(x, y);
    ctx.rotate(0.05 + esfuerzo * 0.04);

    // Sombra en el piso y piernas firmes
    elipse(0, s * 1.05, s * 0.36, s * 0.07, 'rgba(27,42,74,.25)');
    [-1, 1].forEach(function (d) {
      ctx.fillStyle = '#1f2e4d';
      redondo(d * s * 0.14 - s * 0.075, s * 0.72, s * 0.15, s * 0.32, s * 0.05);
      ctx.fill(); borde();
    });

    // Brazos abiertos a ambos lados protegiendo el puente con manos claras y puños de camisa
    [-1, 1].forEach(function (d) {
      ctx.save();
      ctx.translate(d * s * 0.34, s * 0.42);
      ctx.rotate(d * (-1.05 + (d > 0 ? 0.12 : 0) + latido));
      ctx.fillStyle = '#2e8b57';
      redondo(-s * 0.075, -s * 0.44, s * 0.15, s * 0.46, s * 0.07);
      ctx.fill(); borde();
      // Puño blanco de la camisa
      ctx.fillStyle = '#ffffff';
      redondo(-s * 0.065, -s * 0.49, s * 0.13, s * 0.07, s * 0.02);
      ctx.fill(); borde();
      // Mano abierta clara con pulgar
      circulo(0, -s * 0.56, s * 0.085, '#f1c27d'); borde();
      circulo(-d * s * 0.07, -s * 0.54, s * 0.038, '#f1c27d'); borde();
      if (d > 0) {
        ctx.save();
        ctx.translate(0, -s * 0.72);
        ctx.rotate(-0.45);
        dibujarLibrito(0, 0, s * 0.46, true);
        ctx.strokeStyle = '#fff7cf'; ctx.lineWidth = Math.max(2, s * 0.03);
        for (let i = -1; i <= 1; i++) {
          ctx.beginPath();
          ctx.moveTo(i * s * 0.16, -s * 0.3);
          ctx.lineTo(i * s * 0.21, -s * 0.44 - Math.abs(Math.sin(reloj * 8 + i)) * s * 0.05);
          ctx.stroke();
        }
        ctx.restore();
      }
      ctx.restore();
    });

    // Saco verde con hombros redondeados y cuello de chaqueta
    ctx.beginPath();
    ctx.moveTo(-s * 0.36, s * 0.8);
    ctx.lineTo(-s * 0.38, s * 0.46);
    ctx.quadraticCurveTo(-s * 0.38, s * 0.25, -s * 0.16, s * 0.24);
    ctx.lineTo(s * 0.16, s * 0.24);
    ctx.quadraticCurveTo(s * 0.38, s * 0.25, s * 0.38, s * 0.46);
    ctx.lineTo(s * 0.36, s * 0.8);
    ctx.quadraticCurveTo(0, s * 0.84, -s * 0.36, s * 0.8);
    ctx.closePath();
    ctx.fillStyle = '#2e8b57'; ctx.fill(); borde();

    // Costura central y cuello del saco
    ctx.beginPath(); ctx.moveTo(0, s * 0.3); ctx.lineTo(0, s * 0.8);
    ctx.lineWidth = Math.max(1.2, s * 0.018); ctx.strokeStyle = '#1f6b41'; ctx.stroke();
    ctx.fillStyle = '#1f6b41';
    redondo(-s * 0.17, s * 0.22, s * 0.34, s * 0.08, s * 0.04); ctx.fill(); borde();

    // Cuello de piel y cuello de camisa blanca
    ctx.fillStyle = '#f1c27d';
    redondo(-s * 0.09, s * 0.12, s * 0.18, s * 0.12, s * 0.04); ctx.fill(); borde();
    ctx.fillStyle = '#ffffff';
    redondo(-s * 0.12, s * 0.18, s * 0.24, s * 0.06, s * 0.025); ctx.fill(); borde();

    // Orejas y patillas de las gafas asomando a los lados
    [-1, 1].forEach(function (d) {
      ctx.strokeStyle = '#1b2a4a'; ctx.lineWidth = Math.max(2.2, s * 0.032);
      ctx.beginPath(); ctx.moveTo(d * s * 0.23, -s * 0.03); ctx.lineTo(d * s * 0.33, -s * 0.01); ctx.stroke();
      circulo(d * s * 0.33, -s * 0.01, s * 0.024, '#ffd23f');
      circulo(d * s * 0.27, s * 0.02, s * 0.055, '#f1c27d'); borde();
    });

    // Cabeza y cabello canoso con volumen y mechones en la nuca
    circulo(0, -s * 0.02, s * 0.26, '#f1c27d'); borde();
    ctx.fillStyle = '#e6e9f0';
    ctx.beginPath();
    ctx.arc(0, -s * 0.03, s * 0.27, Math.PI * 0.82, Math.PI * 2.18);
    ctx.quadraticCurveTo(s * 0.16, s * 0.18, 0, s * 0.16);
    ctx.quadraticCurveTo(-s * 0.16, s * 0.18, -s * 0.23, s * 0.11);
    ctx.closePath();
    ctx.fill(); borde();
    // Rizos canosos en la nuca
    [-0.14, 0, 0.14].forEach(function (dx) {
      circulo(dx * s, s * 0.11, s * 0.065, '#dce1ec');
    });
    ctx.restore();
  }

  function dibujarLibrito(cx, cy, s, lleno) {
    ctx.save();
    ctx.fillStyle = lleno ? C.ficha : '#5d8774'; ctx.strokeStyle = lleno ? '#fff7cf' : '#8fb5a3'; ctx.lineWidth = Math.max(1, s * 0.08);
    [-1, 1].forEach(function (d) {
      ctx.beginPath(); ctx.moveTo(cx, cy - s * 0.32); ctx.lineTo(cx + d * s * 0.55, cy - s * 0.42); ctx.lineTo(cx + d * s * 0.55, cy + s * 0.32); ctx.lineTo(cx, cy + s * 0.42); ctx.closePath();
      ctx.fill(); ctx.stroke();
    });
    ctx.restore();
  }
  function dibujarVisto(cx, cy, s, color) {
    ctx.save(); ctx.lineWidth = s * 0.2; ctx.strokeStyle = color; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(cx - s * 0.4, cy); ctx.lineTo(cx - s * 0.1, cy + s * 0.32); ctx.lineTo(cx + s * 0.45, cy - s * 0.38); ctx.stroke(); ctx.restore();
  }

  // ═════════════════════ LETREROS, LIBRO Y ESTRELLAS ═════════════════════
  let cacheFilas = new WeakMap();
  function letraDeFila(o) {
    let f = cacheFilas.get(o);
    if (f) return f;
    const libre = (G.u / 3 - G.separa - G.u * 0.034) * 0.985;
    ctx.font = fuente(100);
    let ancho = 1;
    o.opciones.forEach(function (p) { ancho = Math.max(ancho, ctx.measureText(p).width); });
    f = limitar(100 * libre / ancho, G.letraPieMin, G.letraPieMax);
    cacheFilas.set(o, f);
    return f;
  }
  function cajasDeFila(o, z) {
    const e = escalaDe(z), piso = yDe(z);
    const letra = letraDeFila(o) * e, w = (G.u / 3 - G.separa) * e, h = letra * G.altoLetrero;
    ctx.font = fuente(letra);
    return o.opciones.map(function (p, c) {
      const cx = xCarril(c, z);
      return { palabra: p, cx: cx, x: cx - w / 2, y: piso - G.cuelga * e - h, w: w, h: h, letra: letra, piso: piso, e: e,
        anchoTexto: ctx.measureText(p).width, anchoUtil: w - G.u * 0.034 * e };
    });
  }

  function pancarta(b, fondo, borde, tinta, tachada, carrilIdx) {
    const g = Math.max(2.5, b.letra * 0.14);
    redondo(b.x, b.y, b.w, b.h, b.h * 0.16);
    ctx.fillStyle = fondo; ctx.fill(); ctx.lineWidth = g; ctx.strokeStyle = borde; ctx.stroke();
    ctx.fillStyle = borde; ctx.fillRect(b.x + g * 0.5, b.y + g * 0.4, b.w - g, b.h * 0.1);
    ctx.font = fuente(b.letra, 800); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = tinta;
    ctx.fillText(b.palabra, b.cx, b.y + b.h * 0.56, b.anchoUtil);
    if (tachada) {
      const mitad = Math.min(b.anchoTexto, b.anchoUtil) / 2;
      ctx.lineWidth = Math.max(2, b.letra * 0.12); ctx.strokeStyle = C.rojoOscuro;
      ctx.beginPath(); ctx.moveTo(b.cx - mitad, b.y + b.h * 0.56); ctx.lineTo(b.cx + mitad, b.y + b.h * 0.56); ctx.stroke();
    }
    // En Modo Salón por Equipos, cada pancarta lleva arriba su insignia grande [ 1 ], [ 2 ], [ 3 ] con color fijo
    if (salon && salon.activo && carrilIdx != null && !tachada) {
      const eq = EQUIPOS_INFO[carrilIdx] || EQUIPOS_INFO[0];
      const bw = Math.max(b.w * 0.46, b.letra * 1.5), bh = b.letra * 0.72;
      const bx = b.cx - bw / 2, by = b.y - bh * 0.78;
      redondo(bx, by, bw, bh, bh * 0.35);
      ctx.fillStyle = eq.color; ctx.fill();
      ctx.lineWidth = Math.max(2, b.letra * 0.09); ctx.strokeStyle = C.tinta; ctx.stroke();
      ctx.font = fuente(bh * 0.72, 900); ctx.fillStyle = eq.texto;
      ctx.fillText('[ ' + (carrilIdx + 1) + ' ]', b.cx, by + bh * 0.54);
    }
  }

  function dibujarCintilloFila(o, b0) {
    if (!o || !o.pide || o.pide === 'recoger') return;
    let txt = '', fondo = '#1b2a4a', colorTxt = '#ffffff';
    if (o.pide === 'significado') {
      txt = 'SIGNIFICADO'; fondo = '#128a7e'; colorTxt = '#fff8b8';
    } else if (o.pide === 'base') {
      txt = "DIDN'T ___ (BASE)"; fondo = '#4b2ec4'; colorTxt = '#ffd23f';
    } else if (o.pide === 'pasado') {
      txt = 'PASADO'; fondo = '#1b2a4a'; colorTxt = '#9fe8ff';
    } else if (o.pide === 'participio') {
      txt = 'PARTICIPIO'; fondo = '#1b2a4a'; colorTxt = '#b9ffcf';
    }
    if (!txt) return;
    const hC = Math.max(15, b0.letra * 0.66);
    ctx.font = fuente(hC * 0.72, 900);
    const wC = ctx.measureText(txt).width + hC * 1.1;
    const xC = G.cx - wC / 2;
    const yC = b0.y - b0.h * 0.3 - hC * 0.95 - (salon && salon.activo ? b0.letra * 0.5 : 0);
    redondo(xC, yC, wC, hC, hC * 0.45);
    ctx.fillStyle = fondo; ctx.fill();
    ctx.lineWidth = Math.max(2, hC * 0.12); ctx.strokeStyle = C.blanco; ctx.stroke();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = colorTxt;
    ctx.fillText(txt, G.cx, yC + hC * 0.54);
  }

  function dibujarFila(o, z, alfa, marcas) {
    if (o && o.resuelta === 'error' && (!marcas || marcas.edad > 0.32)) return;
    const cajas = cajasDeFila(o, z);
    const b0 = cajas[0], cuerdaY = b0.y - b0.h * 0.3;
    ctx.save();
    ctx.globalAlpha = alfa;
    cajas.forEach(function (b) { elipse(b.cx, b.piso, b.w * 0.42, b.h * 0.13, 'rgba(27,42,74,.2)'); });
    ctx.strokeStyle = '#6b5a45'; ctx.lineWidth = Math.max(1.5, b0.letra * 0.07); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-10, cuerdaY - b0.h * 0.25); ctx.quadraticCurveTo(G.cx, cuerdaY + b0.h * 0.22, G.W + 10, cuerdaY - b0.h * 0.25); ctx.stroke();
    if (!marcas) dibujarCintilloFila(o, b0);
    cajas.forEach(function (b, c) {
      const esCorrecta = marcas && c === o.correcta, esElegida = marcas && c === marcas.elegido;
      ctx.globalAlpha = alfa * (marcas && !esCorrecta && !esElegida ? 0.4 : 1);
      ctx.strokeStyle = '#6b5a45'; ctx.lineWidth = Math.max(1, b.letra * 0.05);
      ctx.beginPath(); ctx.moveTo(b.x + b.w * 0.14, b.y); ctx.lineTo(b.x + b.w * 0.14, cuerdaY); ctx.moveTo(b.x + b.w * 0.86, b.y); ctx.lineTo(b.x + b.w * 0.86, cuerdaY); ctx.stroke();
      if (esCorrecta) {
        const p = 1 + 0.5 * Math.abs(Math.sin(marcas.edad * 12));
        ctx.lineWidth = b.letra * 0.3 * p; ctx.strokeStyle = 'rgba(255,225,77,.85)';
        redondo(b.x - b.letra * 0.1, b.y - b.letra * 0.1, b.w + b.letra * 0.2, b.h + b.letra * 0.2, b.h * 0.2); ctx.stroke();
        pancarta(b, C.verde, C.verdeOscuro, C.tinta, false, c);
      } else if (esElegida) {
        const k = Math.min(1, marcas.edad * 2.6);
        [-1, 1].forEach(function (d) {
          ctx.save();
          ctx.beginPath(); ctx.rect(d < 0 ? b.x - 40 : b.cx, b.y - 40, b.w / 2 + 40, b.h + 80); ctx.clip();
          ctx.translate(b.cx + d * k * b.w * 0.16, b.y + b.h / 2 + k * k * b.h * 0.7); ctx.rotate(d * k * 0.45); ctx.translate(-b.cx, -(b.y + b.h / 2));
          pancarta(b, C.rojo, C.rojoOscuro, C.tinta, true, c);
          ctx.restore();
        });
      } else {
        pancarta(b, C.papel, C.tinta, C.tinta, false, c);
      }
    });
    ctx.restore();
  }

  function debeOcultarSignificado(E, o) {
    if (o && o.ocultarSignificadoLibro) return true;
    if (!E) return false;
    const c = E.cadena;
    if (c && (c.cerrado || c.significado != null || c.ultima === 'significado')) return false;
    if (E.ocultarSignificadoLibro || (E.turno && E.turno.ocultarSignificadoLibro) || (c && c.ocultarSignificadoLibro)) return true;
    if (E.pide === 'significado') return true;
    return false;
  }

  function libroDeVerbo(o, z) {
    const e = escalaDe(z), w = G.u * 0.29 * e, h = w * 0.74;
    const flota = Math.sin(reloj * 4) * h * 0.05;
    const texto = o.verbo.base.toUpperCase();
    ctx.font = fuente(100, 800);
    const letra = Math.min(h * 0.5, 100 * (w * 0.78) / Math.max(1, ctx.measureText(texto).width));
    return { cx: xCarril(o.carril, z), cy: yDe(z) - G.cuelga * e * 0.75 - h / 2 + flota, w: w, h: h, letra: letra, texto: texto, piso: yDe(z) };
  }
  function dibujarVerbo(o, z, alfa, marcas) {
    const f = libroDeVerbo(o, z);
    let k = 1, cy = f.cy;
    ctx.save();
    if (marcas && marcas.recogido) { k = Math.max(0, 1 - marcas.edad * 3.2); cy = G.yPie - G.estudiante * 0.6; alfa *= k; }
    if (k <= 0.02) { ctx.restore(); return; }
    ctx.globalAlpha = alfa;
    elipse(f.cx, f.piso, f.w * 0.4 * k, f.h * 0.1 * k, 'rgba(27,42,74,.22)');
    const w = f.w * k, h = f.h * k, x = f.cx - w / 2, y = cy - h / 2, perdido = marcas && !marcas.recogido;
    if (!marcas) for (let i = 0; i < 3; i++) {
      const a = reloj * 2 + i * 2.1;
      estrella(f.cx + Math.cos(a) * w * 0.62, cy + Math.sin(a) * h * 0.62, w * 0.05 * (1 + 0.3 * Math.sin(reloj * 7 + i)), '#fff7cf');
    }
    ctx.fillStyle = '#ffffff'; redondo(x + w * 0.04, y + h * 0.07, w * 0.96, h * 0.97, h * 0.08); ctx.fill();
    ctx.lineWidth = Math.max(1.5, w * 0.012); ctx.strokeStyle = C.fichaBorde; ctx.stroke();
    ctx.fillStyle = perdido ? '#c9bfa6' : C.ficha; redondo(x, y, w * 0.96, h * 0.95, h * 0.08); ctx.fill();
    ctx.lineWidth = Math.max(2.5, w * 0.03); ctx.strokeStyle = perdido ? '#8d8472' : C.fichaBorde; ctx.stroke();
    ctx.fillStyle = perdido ? '#a59c88' : '#ff8a3d'; ctx.fillRect(x + w * 0.02, y + h * 0.04, w * 0.09, h * 0.87);
    ctx.font = fuente(f.letra * k, 800); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = C.tinta;
    ctx.fillText(f.texto, f.cx + w * 0.035, cy - h * 0.02, w * 0.8);
    ctx.restore();
  }
  const dibujarLibroEnCalle = dibujarVerbo;

  function dibujarEstrellas(E) {
    for (let i = 0; i < E.estrellas.length; i++) {
      const s = E.estrellas[i];
      if (s.z > R.distanciaVista) continue;
      const e = escalaDe(s.z), x = xCarril(s.carril, s.z), y = yDe(s.z), r = G.u * 0.042 * e;
      elipse(x, y, r * 0.8, r * 0.2, 'rgba(27,42,74,.2)');
      estrella(x, y - G.estudiante * 0.42 * e + Math.sin(reloj * 5 + i) * r * 0.2, r, C.ficha, C.fichaBorde, Math.cos(reloj * 4 + i * 0.7));
    }
  }

  // ═════════════════════ MARCADOR (HUD) ═════════════════════
  function trozosMarcador(E) {
    const c = E.cadena;
    if (!c) return [[{ t: '¡Prepárate!', color: C.tiza }]];
    const ocultarEs = debeOcultarSignificado(E, E.objetos && E.objetos[0]);
    const B = { t: c.base.toUpperCase(), color: C.ficha };
    const flecha = { t: ' → ', color: '#a8d5c2' };
    const es = ocultarEs ? { t: '', color: '#cfe9dd', peso: 600 } : { t: ' (' + (c.esCorto || c.es) + ')', color: '#cfe9dd', peso: 600 };
    const hueco = function (forma) { return { t: E.pide === forma && !c.cerrado ? ' ? ' : ' … ', color: E.pide === forma ? C.cian : '#a8d5c2' }; };
    const pas = c.pasado == null ? hueco('pasado') : { t: c.pasado, color: c.falloPasado ? C.naranja : C.verde, subraya: c.falloPasado, nuevo: c.ultima === 'pasado' };
    const par = c.participio == null ? hueco('participio') : { t: c.participio, color: c.falloParticipio ? C.naranja : C.verde, subraya: c.falloParticipio, nuevo: c.ultima === 'participio' };
    const chico = function (t) { return { t: t, color: '#a8d5c2', peso: 600 }; };
    if (c.cerrado) return [[B, { t: ' (' + (c.esCorto || c.es) + ')', color: '#cfe9dd', peso: 600 }, flecha, pas, flecha, par].concat(c.limpio ? [{ visto: true }] : [])];
    if (E.pide === 'recoger') return [[{ t: 'Recoge: ', color: C.tiza }, B, es]];
    const arriba = c.pasado == null && c.participio == null ? [B, es, flecha] : [B, es, flecha, pas, flecha, par];
    if (E.pide === 'significado') return [arriba, [{ t: '¿Qué significa ', color: '#fff8b8' }, { t: c.base.toUpperCase(), color: C.ficha }, { t: '?  SIGNIFICADO', color: C.cian }]];
    if (E.pide === 'base') return [arriba, [{ t: "DIDN'T ___ (BASE)", color: '#ffd23f' }, chico('  usa forma base')]];
    if (E.pide === 'pasado') return [arriba, [{ t: 'Yesterday I ___', color: C.cian }, chico('  pasado')]];
    return [arriba, [{ t: 'I have ___', color: C.cian }, chico('  participio')]];
  }
  function anchoTrozos(trozos, letra) {
    let w = 0;
    trozos.forEach(function (s) {
      if (s.visto) s.w = letra * 1.1; else if (!s.t) s.w = 0; else { ctx.font = fuente(letra, s.peso || 800); s.w = ctx.measureText(s.t).width; }
      w += s.w;
    });
    return Math.max(1, w);
  }
  let sitioNuevo = null;
  function pintarTrozos(trozos, cx, y, letra) {
    const total = anchoTrozos(trozos, letra);
    let x = cx - total / 2;
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    trozos.forEach(function (s) {
      if (!s.w) return;
      if (s.visto) dibujarVisto(x + s.w * 0.6, y, letra * 0.8, C.verde);
      else {
        let l = letra, dx = 0;
        if (s.nuevo && s.t) { sitioNuevo = [x + s.w / 2, y]; if (popT > 0) { l = letra * (1 + 0.35 * popT); ctx.font = fuente(l, 800); dx = (s.w - ctx.measureText(s.t).width) / 2; } }
        ctx.font = fuente(l, s.peso || 800); ctx.fillStyle = s.color; ctx.fillText(s.t, x + dx, y);
        if (s.subraya) ctx.fillRect(x, y + letra * 0.52, s.w, Math.max(2, letra * 0.09));
      }
      x += s.w;
    });
  }

  function dibujarMarcador(E) {
    const W = G.W, m = G.margen, letra = G.letraHud, chica = G.letraChica;
    ctx.save();
    ctx.fillStyle = C.pizarra; ctx.fillRect(0, 0, W, G.hudH);
    ctx.fillStyle = C.pizarra2; ctx.fillRect(0, 0, W, m * 0.5);
    ctx.fillStyle = E.peligroFilas > 0 && Math.sin(reloj * 9) > -0.2 ? C.rojoOscuro : C.marco; ctx.fillRect(0, G.hudH - Math.max(5, m * 0.7), W, Math.max(5, m * 0.7));
    ctx.fillStyle = 'rgba(27,42,74,.25)'; ctx.fillRect(0, G.hudH, W, 3);

    const lineas = trozosMarcador(E);
    const ancho = (G.vertical ? Math.min(W, G.u * 1.5) : W) - 2 * m;
    const altoGrande = G.vertical ? letra * 2.3 : letra * 1.4;
    const todo = [].concat.apply([], lineas);
    const anchoUna = anchoTrozos(todo, letra);
    sitioNuevo = null;
    if (lineas.length === 1 || anchoUna * (G.vertical ? 0.84 : 0.6) <= ancho) {
      pintarTrozos(todo, G.cx, m * 0.7 + altoGrande / 2, letra * Math.min(1, ancho / anchoUna));
    } else {
      lineas.forEach(function (l, i) {
        pintarTrozos(l, G.cx, m * 0.7 + altoGrande * (i === 0 ? 0.27 : 0.75), letra * Math.min(1, ancho / anchoTrozos(l, letra)));
      });
    }
    const y = m * 0.7 + altoGrande + chica * 0.8, izq = G.cx - ancho / 2, der = G.cx + ancho / 2;
    ctx.font = fuente(chica, 800); ctx.textBaseline = 'middle'; ctx.textAlign = 'left';

    if (salon && salon.activo) {
      // Marcador de equipos en Modo Salón
      let xEq = izq;
      salon.equipos.forEach(function (eq, idx) {
        const esTurno = idx === salon.turnoEquipo;
        const txtEq = eq.corto + ': ' + eq.puntos;
        const wEq = ctx.measureText(txtEq).width + chica * 0.9;
        redondo(xEq, y - chica * 0.76, wEq, chica * 1.52, chica * 0.45);
        ctx.fillStyle = esTurno ? eq.color : 'rgba(255,255,255,.16)';
        ctx.fill();
        if (esTurno) { ctx.lineWidth = 2; ctx.strokeStyle = '#ffffff'; ctx.stroke(); }
        ctx.fillStyle = esTurno ? eq.texto : '#cfe9dd';
        ctx.fillText(txtEq, xEq + chica * 0.45, y + chica * 0.03);
        xEq += wEq + chica * 0.35;
      });
      const metaRelevo = R.turnosSalon || 4;
      const tRelevo = 'Relevo ' + Math.min(metaRelevo, salon.verbosEnRelevo + 1) + '/' + metaRelevo;
      ctx.textAlign = 'right'; ctx.fillStyle = C.ficha;
      ctx.fillText(tRelevo, der, y);
      ctx.restore();
      return;
    }

    estrella(izq + chica * 0.55, y, chica * 0.6, C.ficha);
    ctx.fillStyle = C.tiza;
    const pts = String(E.puntos);
    ctx.fillText(pts, izq + chica * 1.35, y);
    let x = izq + chica * 1.35 + ctx.measureText(pts).width + chica * 0.4;
    if (E.multiplicador > 1) {
      const t = 'x' + E.multiplicador, w = ctx.measureText(t).width + chica * 0.7;
      redondo(x, y - chica * 0.72, w, chica * 1.44, chica * 0.5); ctx.fillStyle = '#ff8a3d'; ctx.fill();
      ctx.fillStyle = '#fff'; ctx.fillText(t, x + chica * 0.35, y + chica * 0.03);
      x += w;
    }
    const listo = E.comodin > 0, tProfe = listo ? 'Profe listo' : 'Profe ' + E.carga + '/' + R.aciertosParaComodin;
    const tVerbos = E.turnosCumplidos + ' / ' + E.turnosTotal;
    const wVerbos = ctx.measureText('Cuadra ' + tramoSeleccionado + ' · ' + tVerbos).width;
    const xProfe = Math.max(x + chica * 1.1, (izq + der - wVerbos) / 2 - ctx.measureText(tProfe).width / 2 + chica * 0.4);
    dibujarLibrito(xProfe, y, chica * 0.9, listo);
    ctx.fillStyle = listo ? C.ficha : '#a8d5c2'; ctx.fillText(tProfe, xProfe + chica * 0.75, y);
    if (E.peligroFilas > 0 && E.fase === 'corriendo') {
      const t = '¡PELIGRO!', w = ctx.measureText(t).width + chica;
      redondo(der - w, y - chica * 0.76, w, chica * 1.52, chica * 0.4);
      ctx.fillStyle = Math.sin(reloj * 9) > -0.3 ? C.rojoOscuro : '#8a1f1f'; ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.fillText(t, der - w / 2, y + chica * 0.04);
    } else {
      ctx.textAlign = 'right'; ctx.fillStyle = C.tiza; ctx.fillText('Cuadra ' + tramoSeleccionado + ' · ' + tVerbos, der, y);
    }
    ctx.restore();
  }
  const dibujarHud = dibujarMarcador;

  // ═════════════════════ EL PROFESOR HABLA (globo) ═════════════════════
  function mensajeDelProfesor(E) {
    if (E.pista) return { tipo: 'pista', p: E.pista, alfa: limitar(E.pista.quedan / 0.3, 0, 1), borde: C.rojoOscuro };
    if (E.anuncio) return { tipo: 'grupo', g: E.anuncio.grupo, alfa: limitar(E.anuncio.quedan / 0.3, 0, 1), borde: '#2e8b57' };
    if (tutorial && E.verbo && E.fase === 'corriendo' && !(E.cadena && E.cadena.cerrado)) {
      const t = E.pide === 'recoger' ? ['¡Recoge el libro!', 'Muévete con ← → o toca los lados de la pantalla.']
        : (E.pide === 'pasado' ? ['Ahora su PASADO', 'Pasa por debajo de la palabra correcta.']
        : (E.pide === 'significado' ? ['¿Qué significa?', 'Pasa por el significado correcto en español.']
        : (E.pide === 'base' ? ["Con DIDN'T va la BASE", 'El auxiliar ya está en pasado: usa el verbo base.']
        : ['Y ahora su PARTICIPIO', 'El tercero de la cadena.'])));
      return { tipo: 'tutorial', t: t, alfa: 1, borde: C.azul || '#2a6fdb' };
    }
    return null;
  }

  function dibujarGlobo(E) {
    const M = mensajeDelProfesor(E);
    if (!M) return;
    const b = G.globo, u = G.u, m = G.margen, entra = suave(profeK);
    const apilado = b.w < b.h * 1.5;
    ctx.save();
    ctx.globalAlpha = M.alfa;
    let gx, gy, gw, gh, cola;
    if (apilado) {
      const sP = Math.min(b.w * 0.5, b.h * 0.3);
      dibujarProfesor(b.x + sP * 0.55 - (1 - entra) * sP * 2, b.y + sP * 0.36, sP, 'explica');
      gx = b.x; gy = b.y + sP * 1.22; gw = b.w; gh = b.h - sP * 1.22;
      cola = [[gx + sP * 0.5, gy + 2], [gx + sP * 0.62, gy - sP * 0.22], [gx + sP * 0.95, gy + 2]];
    } else {
      const sP = Math.min(b.h * 0.92, b.w * 0.3);
      dibujarProfesor(b.x + sP * 0.48 - (1 - entra) * sP * 2, b.y + b.h - sP * 0.8, sP, 'explica');
      gx = b.x + sP * 0.98; gy = b.y; gw = b.w - sP * 0.98; gh = b.h * 0.94;
      cola = [[gx + 2, gy + gh * 0.5], [gx - sP * 0.16, gy + gh * 0.68], [gx + 2, gy + gh * 0.74]];
    }
    const g = Math.max(3, u * 0.011);
    ctx.fillStyle = C.papel; ctx.strokeStyle = M.borde; ctx.lineWidth = g; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(cola[0][0], cola[0][1]); ctx.lineTo(cola[1][0], cola[1][1]); ctx.lineTo(cola[2][0], cola[2][1]); ctx.closePath(); ctx.fill(); ctx.stroke();
    redondo(gx, gy, gw, gh, u * 0.04); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cola[0][0] + (apilado ? g : 0), cola[0][1] + (apilado ? 0 : g)); ctx.lineTo(cola[1][0] + (apilado ? 0 : g * 1.4), cola[1][1] + (apilado ? g * 1.4 : 0)); ctx.lineTo(cola[2][0] - (apilado ? g : 0), cola[2][1] - (apilado ? 0 : g)); ctx.closePath(); ctx.fillStyle = C.papel; ctx.fill();

    const x0 = gx + gw / 2, ancho = gw - 2.4 * m, fondo = gy + gh - m * 0.6;
    let y = gy + m * 0.7;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const renglones = function (texto, letraMax, peso, color) {
      let lp = letraMax, lineas;
      for (let i = 0; i < 8; i++) {
        ctx.font = fuente(lp, peso); lineas = partirTexto(texto, ancho);
        if (y + lineas.length * lp * 1.2 <= fondo || lp <= 11) break;
        lp *= 0.93;
      }
      ctx.fillStyle = color;
      lineas.forEach(function (l, i) { ctx.fillText(l, x0, y + lp * 0.62 + i * lp * 1.2, ancho); });
      y += lineas.length * lp * 1.2;
    };
    const titulo = function (texto, letraMax, color) {
      const l = letraQueCabe(texto, ancho, letraMax, 800);
      ctx.font = fuente(l, 800); ctx.fillStyle = color; ctx.fillText(texto, x0, y + l * 0.66);
      y += l * 1.3;
    };
    if (M.tipo === 'pista') {
      const p = M.p;
      if (p.pide === 'recoger') {
        titulo('¡El libro! Recógelo', u * 0.08, C.tinta);
      } else {
        const izq = p.base.toUpperCase() + ' → ', grande = izq + p.correcta;
        const lg = letraQueCabe(grande, ancho, u * 0.092, 800);
        ctx.font = fuente(lg, 800);
        const wIzq = ctx.measureText(izq).width, wTodo = ctx.measureText(grande).width;
        ctx.textAlign = 'left';
        ctx.fillStyle = C.tinta; ctx.fillText(izq, x0 - wTodo / 2, y + lg * 0.68);
        ctx.fillStyle = C.verdeOscuro; ctx.fillText(p.correcta, x0 - wTodo / 2 + wIzq, y + lg * 0.68);
        y += lg * 1.3;
        const chico = 'no ' + p.elegida + '  ·  ' + (NOMBRE_PIDE[p.pide] || p.pide);
        const lc = letraQueCabe(chico, ancho, u * 0.05, 700);
        ctx.font = fuente(lc, 700);
        const wNo = ctx.measureText('no ').width, wEl = ctx.measureText(p.elegida).width, xc = x0 - ctx.measureText(chico).width / 2;
        ctx.fillStyle = '#6a6f85'; ctx.fillText(chico, xc, y + lc * 0.6);
        ctx.fillStyle = C.rojoOscuro; ctx.fillText(p.elegida, xc + wNo, y + lc * 0.6);
        ctx.fillRect(xc + wNo - 2, y + lc * 0.56, wEl + 4, Math.max(2, lc * 0.11));
        y += lc * 1.45; ctx.textAlign = 'center';
      }
      renglones(p.pide === 'recoger' ? 'Ahí va otra vez ' + p.base.toUpperCase() + ', ahora por tu carril.' : p.texto, Math.max(12, u * 0.044), 600, C.tinta);
    } else if (M.tipo === 'grupo') {
      ctx.font = fuente(u * 0.036, 800); ctx.fillStyle = '#2e8b57'; ctx.fillText('GRUPO DE VERBOS', x0, y + u * 0.025); y += u * 0.052;
      titulo(M.g.nombre, u * 0.064, C.tinta);
      titulo(M.g.ejemplo, u * 0.078, C.verdeOscuro);
      renglones(M.g.explicacion || '', Math.max(12, u * 0.041), 600, C.tinta);
    } else {
      y += gh * 0.06;
      titulo(M.t[0], u * 0.085, '#2a6fdb');
      renglones(M.t[1], Math.max(12, u * 0.048), 700, C.tinta);
    }
    ctx.restore();
  }

  function dibujarFlechasTutorial(E) {
    const o = E.objetos[0];
    if (!tutorial || !o || o.tipo !== 'verbo' || o.carril === E.carril) return;
    const d = o.carril < E.carril ? -1 : 1, u = G.u, y = G.yPie - G.estudiante * 0.45;
    ctx.save();
    for (let i = 0; i < 3; i++) {
      const k = (reloj * 1.6 + i * 0.33) % 1, x = G.cx + (E.x - 1) * G.carril + d * (G.estudiante * 0.45 + k * G.carril * 0.75), t = u * 0.05;
      ctx.globalAlpha = Math.sin(k * Math.PI);
      ctx.beginPath(); ctx.moveTo(x - d * t, y - t * 1.1); ctx.lineTo(x + d * t * 0.5, y); ctx.lineTo(x - d * t, y + t * 1.1);
      ctx.lineWidth = u * 0.03; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = C.tinta; ctx.stroke();
      ctx.lineWidth = u * 0.016; ctx.strokeStyle = '#ffffff'; ctx.stroke();
    }
    ctx.restore();
  }

  // Banda festiva al completar un verbo: incluye las 3 formas, su significado y una oración corta real
  function oracionCortaDe(idVerbo, v) {
    const lista = (VJ.ORACIONES || []).filter(function (o) { return o && o.verbo === idVerbo && o.forma === 'pasado'; });
    const o = lista[0] || (VJ.ORACIONES || []).filter(function (x) { return x && x.verbo === idVerbo; })[0];
    if (o && o.texto) {
      const c = o.forma === 'pasado' ? v.pasado : (o.forma === 'participio' ? v.participio : v.base);
      return o.texto.replace('___', c);
    }
    return 'Yesterday I ' + v.pasado + '.';
  }

  function dibujarBanda() {
    if (!banda) return;
    const u = G.u, k = banda.edad, v = banda.verbo;
    const entra = suave(k / 0.25), sale = suave((banda.dura - k) / 0.3);
    const w = Math.min(G.W - 2 * G.margen, u * 1.32), h = u * 0.42;
    const cx = G.cx, cy = G.hudH + G.margen + h * 0.54;
    ctx.save();
    ctx.globalAlpha = Math.min(entra, sale);
    ctx.translate(cx, cy); ctx.scale(0.6 + 0.4 * entra, 0.6 + 0.4 * entra); ctx.rotate(-0.02 + Math.sin(k * 5) * 0.01);
    ctx.beginPath();
    ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(w / 2, -h / 2); ctx.lineTo(w / 2 - h * 0.13, 0); ctx.lineTo(w / 2, h / 2); ctx.lineTo(-w / 2, h / 2); ctx.lineTo(-w / 2 + h * 0.13, 0); ctx.closePath();
    ctx.fillStyle = C.ficha; ctx.fill(); ctx.lineWidth = Math.max(4, u * 0.014); ctx.strokeStyle = C.tinta; ctx.lineJoin = 'round'; ctx.stroke();
    ctx.fillStyle = '#ff8a3d'; ctx.fillRect(-w / 2 + h * 0.18, -h / 2 + h * 0.06, w - h * 0.36, h * 0.05); ctx.fillRect(-w / 2 + h * 0.18, h / 2 - h * 0.11, w - h * 0.36, h * 0.05);
    const texto = v.base.toUpperCase() + ' · ' + v.pasado.toUpperCase() + ' · ' + v.participio.toUpperCase();
    const l = letraQueCabe(texto, w - h * 0.65, h * 0.32, 900);
    ctx.font = fuente(l, 900); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = C.tinta;
    ctx.fillText(texto, 0, -h * 0.18);
    ctx.font = fuente(h * 0.155, 800); ctx.fillStyle = '#5a3d00';
    ctx.fillText('“' + (v.esCorto || v.es) + '”  ·  ' + banda.nota, 0, h * 0.06, w - h * 0.6);
    const ej = banda.oracion || oracionCortaDe(v.id, v);
    ctx.font = fuente(h * 0.145, 800); ctx.fillStyle = '#128a43';
    ctx.fillText('«' + ej + '»', 0, h * 0.27, w - h * 0.55);
    ctx.restore();
    ctx.save(); ctx.globalAlpha = Math.min(entra, sale);
    dibujarProfesor(G.cx - w / 2 + u * 0.05 - (1 - entra) * u * 0.3, cy + h * 0.58, u * 0.19, 'celebra');
    ctx.restore();
  }

  // ═════════════════════ UN CUADRO ═════════════════════
  function dibujarParticulas() {
    for (let i = 0; i < polvo.length; i++) { const p = polvo[i], k = p.edad / p.dura; circulo(p.x, p.y - k * p.r, p.r * (0.5 + k), 'rgba(214,190,140,' + (0.55 * (1 - k)).toFixed(3) + ')'); }
    for (let i = 0; i < confeti.length; i++) {
      const p = confeti[i];
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = limitar((p.dura - p.edad) / 0.3, 0, 1);
      ctx.fillStyle = p.color; ctx.fillRect(-p.t / 2, -p.t / 4, p.t, p.t / 2); ctx.restore();
    }
    for (let i = 0; i < brillos.length; i++) { const p = brillos[i], k = p.edad / p.dura; ctx.globalAlpha = 1 - k; estrella(p.x, p.y - k * G.u * 0.1, p.r * (1 + k), p.color); ctx.globalAlpha = 1; }
  }

  function dibujarJuego() {
    const E = partida.estado, u = G.u;
    usarGeo('juego');
    ctx.save();
    ctx.translate(sacudeT > 0 ? Math.sin(reloj * 70) * u * 0.012 * sacudeT : 0, E.fase === 'corriendo' ? Math.sin(fasePaso * 2) * u * 0.0035 : 0);
    dibujarMundo();

    if (victoriaT > 0) {
      const k = suave(victoriaT / 2.2), zc = 26 * (1 - k) * (1 - k) + 1.5, s = sV(zc);
      dibujarColegio(G.cx, G.yH + (G.yPie - G.yH) * s, G.carril * 4.6 * s);
    }

    dibujarEstrellas(E);
    E.objetos.forEach(function (o) {
      const nace = o.tipo === 'fila' ? R.distanciaVista : R.distanciaVista * R.fraccionRecoger;
      const alfa = limitar((nace - o.z) / (E.velocidad * 0.15), 0, 1);
      if (o.tipo === 'fila') dibujarFila(o, o.z, alfa, null); else dibujarVerbo(o, o.z, alfa, null);
    });
    // Corrección visual en celular (360x740): si una fila se falla, se desvanece rápido y nunca se dibuja si ya viene otra fila cercana
    const hayFilaNuevaCerca = E.objetos.some(function (o) { return o.tipo === 'fila' && o.z < R.distanciaVista * 0.92; });
    pasados.forEach(function (g) {
      if (!g.marcas.acierto && (hayFilaNuevaCerca || g.marcas.edad > 0.32)) return;
      const tope = g.marcas.acierto ? 0.45 : 0.12;
      const dur = g.marcas.acierto ? 0.4 : 0.2;
      const alfa = limitar(1 - (g.marcas.edad - tope) / dur, 0, 1);
      if (alfa <= 0.02) return;
      if (g.o.tipo === 'fila') dibujarFila(g.o, Math.max(-2, g.z), alfa, g.marcas); else dibujarVerbo(g.o, g.z, alfa, g.marcas);
    });

    const xs = G.cx + (E.x - 1) * G.carril, cubierto = capturaT > 0 ? suave(capturaT / 0.7) : 0;
    const salto = victoriaT > 0 ? Math.abs(Math.sin(victoriaT * 6)) * 0.7 : (celebraT > 0 ? Math.sin(limitar(1 - celebraT / 0.8, 0, 1) * Math.PI) : 0);
    dibujarParticulas();
    dibujarEstudiante(xs, G.yPie, G.estudiante, {
      fase: fasePaso, inclina: limitar(E.carril - E.x, -1, 1), traspie: E.tropiezo / R.tropiezoSegundos,
      salto: salto, brazosArriba: victoriaT > 0 || celebraT > 0 ? Math.min(1, salto * 1.6 + 0.3) : 0
    });
    dibujarFlechasTutorial(E);

    const perdida = E.fase === 'perdida';
    const mon = E.fase === 'ganada' ? Math.max(0, E.monstruo - victoriaT * 0.4) : E.monstruo;
    const ira = E.peligroFilas > 0 || perdida;
    const rx = u * 0.27 * E.monstruoTam * (0.8 + 0.35 * mon) * (E.fase === 'ganada' ? Math.max(0.35, 1 - victoriaT * 0.4) : 1);
    let arriba = G.yPie + G.zona * (0.6 - 0.85 * mon);
    if (perdida) arriba = G.yPie + G.zona * (0.6 - 0.85 * R.monstruoEnPeligro) - cubierto * (G.estudiante * 1.1 + G.zona * 0.1);
    const mx = G.cx + (xs - G.cx) * (perdida ? 0.6 + 0.4 * cubierto : 0.6);
    dibujarMonstruo(mx, arriba, perdida ? rx * (1 + 0.6 * cubierto) : rx, {
      ira: ira, mira: [xs, G.yPie - G.estudiante * 0.8], triste: E.fase === 'ganada',
      boca: Math.max(rugeT > 0 ? 1 : 0, perdida ? 1 : limitar((mon - 0.5) / 0.3, 0, 1) * (0.6 + 0.4 * Math.abs(Math.sin(reloj * 5)))),
      escala: 1 - 0.2 * Math.sin(limitar(pufT, 0, 1) * Math.PI) + 0.22 * Math.sin(limitar(rugeT, 0, 1) * Math.PI)
    });
    if (rugeT > 0.25) {
      ctx.font = fuente(u * 0.07, 800); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      textoBorde('¡GRRR!', mx + Math.sin(reloj * 60) * 2, arriba - u * 0.02, '#fff', C.iraBorde, u * 0.016);
    }

    if (salvadoT > 0) {
      const k = 1 - salvadoT / 1.7, px = G.cx - u * 0.75 + suave(k * 1.6) * u * 0.75 + Math.max(0, k - 0.75) * u * 4, py = G.yPie + G.zona * 0.1;
      dibujarProfesor(px, py - u * 0.1, u * 0.24, 'celebra');
      dibujarLibrito(px, py + u * 0.13, u * 0.16, true);
      const txt = cruceTexto, l = letraQueCabe(txt, u * 0.92, u * 0.075, 800);
      ctx.font = fuente(l, 800); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      textoBorde(txt, G.cx, G.yPie - G.estudiante * 1.4, C.ficha, C.tinta, l * 0.24);
    }

    vuelos.forEach(function (f) {
      const k = suave(f.edad / f.dura), x = f.x0 + (f.x1 - f.x0) * k, y = f.y0 + (f.y1 - f.y0) * k - Math.sin(k * Math.PI) * u * 0.12;
      ctx.font = fuente(f.l0 + (f.l1 - f.l0) * k, 800); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      textoBorde(f.texto, x, y, C.verde, C.tinta, Math.max(3, u * 0.012));
    });
    flotantes.forEach(function (f) {
      const k = f.edad / f.dura, crece = 1 + 0.25 * Math.sin(Math.min(1, k * 4) * Math.PI);
      ctx.globalAlpha = limitar((1 - k) * 3, 0, 1);
      const l = letraQueCabe(f.texto, u * 0.92, u * f.tam, 800) * crece;
      ctx.font = fuente(l, 800); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      textoBorde(f.texto, f.x, f.y - k * u * 0.12, f.color, C.tinta, l * 0.22);
      ctx.globalAlpha = 1;
    });
    ctx.restore();

    if (destelloT > 0) { ctx.fillStyle = 'rgba(229,72,77,' + (0.38 * destelloT).toFixed(3) + ')'; ctx.fillRect(0, 0, G.W, G.H); }
    if (E.peligroFilas > 0 && E.fase === 'corriendo' && !(salon && salon.activo)) {
      const g = Math.max(8, u * 0.035) * (1 + 0.5 * Math.sin(reloj * 9));
      ctx.fillStyle = 'rgba(229,72,77,' + (0.5 + 0.25 * Math.sin(reloj * 9)).toFixed(3) + ')';
      ctx.fillRect(0, G.hudH, g, G.H); ctx.fillRect(G.W - g, G.hudH, g, G.H); ctx.fillRect(0, G.H - g, G.W, g);
    }

    dibujarMarcador(E);
    dibujarGlobo(E);
    dibujarBanda();

    if (salon && salon.activo && salon.cambioEquipoT > 0) {
      const eq = EQUIPOS_INFO[salon.turnoEquipo] || EQUIPOS_INFO[0];
      ctx.save();
      ctx.fillStyle = 'rgba(27,42,74,.76)'; ctx.fillRect(0, G.hudH, G.W, G.H - G.hudH);
      const cw = Math.min(G.W * 0.9, u * 1.3), ch = u * 0.42;
      redondo(G.cx - cw / 2, G.H * 0.48 - ch / 2, cw, ch, u * 0.05);
      ctx.fillStyle = eq.color; ctx.fill();
      ctx.lineWidth = Math.max(4, u * 0.015); ctx.strokeStyle = '#ffffff'; ctx.stroke();
      ctx.font = fuente(u * 0.075, 900); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = eq.texto;
      ctx.fillText('¡TURNO DEL ' + eq.nombre.toUpperCase() + '!', G.cx, G.H * 0.45, cw * 0.92);
      ctx.font = fuente(u * 0.045, 800);
      ctx.fillText('Preparen los carriles [ 1 ] · [ 2 ] · [ 3 ]', G.cx, G.H * 0.53, cw * 0.9);
      ctx.restore();
    }

    if (pausa && pausaConTecla && E.fase === 'corriendo') {
      ctx.save();
      ctx.fillStyle = 'rgba(27,42,74,.45)'; ctx.fillRect(0, G.hudH, G.W, u * 0.18);
      ctx.font = fuente(u * 0.075, 900); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      textoBorde(salon && salon.activo ? '⏸ PAUSA DEL PROFE (Espacio para seguir)' : 'PAUSA (tecla P)', G.cx, G.hudH + u * 0.09, C.ficha, C.tinta, u * 0.02);
      ctx.restore();
    }
    if (E.fase !== 'corriendo') {
      const txt = E.fase === 'ganada' ? '¡Llegaste al colegio!' : '¡Te atrapó la Ignorancia!';
      const l = letraQueCabe(txt, (G.vertical ? u : G.W * 0.9) * 0.94, u * 0.11, 800);
      ctx.font = fuente(l, 800); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      textoBorde(txt, G.cx, E.fase === 'perdida' ? G.hudH + (G.yPie - G.hudH) * 0.62 : (banda ? G.hudH + G.margen + u * 0.47 : G.hudH + (G.yPie - G.hudH) * 0.3), E.fase === 'ganada' ? C.ficha : '#fff', E.fase === 'ganada' ? C.tinta : C.iraBorde, l * 0.26);
    }
  }

  function dibujarMenu() {
    usarGeo('menu');
    ctx.save();
    ctx.translate(0, Math.sin(fasePaso * 2) * G.u * 0.003);
    dibujarMundo();
    dibujarParticulas();
    dibujarEstudiante(G.cx, G.yPie, G.estudiante * 0.88, { fase: fasePaso });
    dibujarMonstruo(G.cx - G.u * 0.28 + Math.sin(reloj * 0.7) * G.u * 0.04, G.yPie - G.estudiante * 0.4, G.u * 0.14, { mira: [G.cx, G.yPie - G.estudiante], boca: 0.4 + 0.4 * Math.sin(reloj * 3) });
    ctx.restore();
  }

  // Pantalla final: edificio del colegio grande y más abajo en 1280x720, sin pisar jamás el cartel ni la bandera
  function dibujarEscenaFinal() {
    const u = G.u, gano = ultimoResumen && ultimoResumen.ganada;
    usarGeo('final');
    if (gano) {
      dibujarCielo();
      ctx.fillStyle = C.pasto; ctx.fillRect(0, G.yH, G.W, G.H);
      const cajaTop = $('finPuntajeCaja');
      const rectTop = cajaTop ? cajaTop.getBoundingClientRect() : null;
      const techoSeguro = (rectTop && rectTop.bottom > 0) ? rectTop.bottom + 18 : G.H * 0.22;
      const base = Math.max(G.yPie, techoSeguro + (G.vertical ? 145 : 210));
      const maxH = Math.max(80, (base - techoSeguro) / 1.72);
      const wDeseado = G.vertical ? Math.min(G.W * 0.92, u * 1.05) : Math.min(G.W * 0.56, u * 1.25);
      const w = Math.min(wDeseado, maxH / 0.48);

      ctx.beginPath(); ctx.moveTo(G.cx - w * 0.13, base); ctx.lineTo(G.cx + w * 0.13, base); ctx.lineTo(G.cx + w * 0.75, G.H); ctx.lineTo(G.cx - w * 0.75, G.H); ctx.closePath(); ctx.fillStyle = C.calle; ctx.fill();
      [-1, 1].forEach(function (d) {
        const x = G.cx + d * w * 0.62; ctx.fillStyle = '#7a5230'; ctx.fillRect(x - w * 0.015, base - w * 0.16, w * 0.03, w * 0.17);
        circulo(x, base - w * 0.22, w * 0.1, '#3f9a4f'); circulo(x - w * 0.03, base - w * 0.25, w * 0.06, '#62bd6c');
      });
      dibujarColegio(G.cx, base, w);
      dibujarParticulas();
      const faltan = ultimoResumen.verbos.filter(function (v) { return v.resultado === 'pendiente' && !v.regular; });
      const salto = faltan.length ? 0 : Math.abs(Math.sin(reloj * 4));
      dibujarEstudiante(G.cx, base + w * 0.15, w * 0.22, { fase: 0, salto: salto * 0.5, brazosArriba: faltan.length ? 0 : 1 });
      if (faltan.length) {
        const sP = w * 0.18, px = G.cx - w * 0.3, py = base + w * 0.02;
        dibujarProfesor(px, py, sP, 'explica');
        const txt = 'Falta: ' + faltan.slice(0, 3).map(function (v) { return v.base.toUpperCase(); }).join(', ') + (faltan.length > 3 ? '…' : '');
        const l = letraQueCabe(txt, w * 0.5, w * 0.055, 800), tw = (ctx.font = fuente(l, 800), ctx.measureText(txt).width);
        const gx = Math.max(6, px - tw / 2 - l * 0.5), gy = py - sP * 0.62 - l * 1.7;
        redondo(gx, gy, tw + l, l * 1.7, l * 0.5); ctx.fillStyle = C.papel; ctx.fill(); ctx.lineWidth = Math.max(2.5, l * 0.14); ctx.strokeStyle = C.rojoOscuro; ctx.stroke();
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = C.tinta; ctx.fillText(txt, gx + l * 0.5, gy + l * 0.9);
      }
      dibujarMonstruo(G.cx + w * 0.24, base + w * 0.02, w * 0.055, { mira: [G.cx, base], triste: true });
    } else {
      dibujarMundo();
      const rx = Math.min(u * 0.38, (G.yPie - G.H * 0.2) * 0.52);
      dibujarMonstruo(G.cx, G.yPie - rx * 1.2 + Math.sin(reloj * 2) * rx * 0.03, rx, { feliz: true });
      ctx.font = fuente(rx * 0.2, 800); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const wn = ctx.measureText('¡Ñam!').width;
      textoBorde('¡Ñam!', Math.min(G.cx + rx * 0.95, G.W - wn / 2 - rx * 0.08 - 6), G.yPie - rx * 1.45 + Math.sin(reloj * 3) * 4, '#fff', C.tinta, rx * 0.05);
    }
  }
  const dibujarFinal = dibujarEscenaFinal;

  function dibujar() {
    ctx.setTransform(G.dpr, 0, 0, G.dpr, 0, 0);
    ctx.globalAlpha = 1;
    if (pantalla === 'juego' && partida) dibujarJuego();
    else if (pantalla === 'final') dibujarEscenaFinal();
    else if (pantalla === 'revision' && rev) dibujarRevision();
    else dibujarMenu();
  }
  // ═════════════════════ SONIDO Y VOZ ═════════════════════
  let audio = null;
  function ctxAudio() {
    if (silencio) return null;
    if (!audio) { const Ctx = W.AudioContext || W.webkitAudioContext; if (Ctx) try { audio = new Ctx(); } catch (_) {} }
    if (audio && audio.state === 'suspended') try { audio.resume(); } catch (_) {}
    return audio;
  }
  function nota(f, d, tipo, vol, t0, f1) {
    const a = ctxAudio(); if (!a) return;
    const t = a.currentTime + (t0 || 0), o = a.createOscillator(), g = a.createGain();
    o.type = tipo || 'triangle'; o.frequency.setValueAtTime(f, t);
    if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + d);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol || 0.14, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + d + 0.02);
  }
  const SONIDOS = {
    paso:      [[240, 0.055, 'sine', 0.09, 0, 340]],
    estrella:  [[988, 0.07, 'sine', 0.1, 0], [1319, 0.11, 'sine', 0.1, 0.045]],
    libro:     [[523, 0.08, 'triangle', 0.13, 0], [659, 0.08, 'triangle', 0.13, 0.055], [784, 0.14, 'triangle', 0.14, 0.11]],
    acierto:   [[523, 0.09, 'triangle', 0.14, 0], [659, 0.13, 'triangle', 0.15, 0.065]],
    cadena:    [[523, 0.09, 'triangle', 0.15, 0], [659, 0.09, 'triangle', 0.15, 0.07], [784, 0.09, 'triangle', 0.15, 0.14], [1046, 0.24, 'triangle', 0.17, 0.21]],
    error:     [[210, 0.18, 'sawtooth', 0.12, 0, 140], [150, 0.24, 'sawtooth', 0.11, 0.12, 105]],
    libro_perdido: [[350, 0.15, 'triangle', 0.1, 0, 220]],
    comodin_listo: [[587, 0.08, 'sine', 0.13, 0], [880, 0.18, 'sine', 0.15, 0.07]],
    salvado:   [[440, 0.09, 'triangle', 0.15, 0], [554, 0.09, 'triangle', 0.15, 0.07], [659, 0.09, 'triangle', 0.15, 0.14], [880, 0.28, 'triangle', 0.17, 0.21]],
    ganada:    [[523, 0.11, 'triangle', 0.16, 0], [659, 0.11, 'triangle', 0.16, 0.1], [784, 0.11, 'triangle', 0.16, 0.2], [1046, 0.34, 'triangle', 0.18, 0.3]],
    perdida:   [[300, 0.18, 'sawtooth', 0.13, 0, 220], [220, 0.2, 'sawtooth', 0.13, 0.16, 155], [155, 0.36, 'sawtooth', 0.14, 0.32, 92]],
    puente:    [[392, 0.1, 'triangle', 0.14, 0], [523, 0.12, 'triangle', 0.14, 0.09], [659, 0.22, 'triangle', 0.15, 0.18]],
    ficha:     [[640, 0.045, 'triangle', 0.08, 0, 760]]
  };
  function sonar(tipo) { const s = SONIDOS[tipo]; if (s) s.forEach(function (n) { nota.apply(null, n); }); }

  let vozEn = null;
  function elegirVoz() {
    if (!W.speechSynthesis) return null;
    const vs = W.speechSynthesis.getVoices() || [];
    vozEn = vs.find(function (v) { return /^en[-_](US|GB)/i.test(v.lang) && /natural|google|microsoft/i.test(v.name); })
         || vs.find(function (v) { return /^en[-_](US|GB)/i.test(v.lang); })
         || vs.find(function (v) { return /^en/i.test(v.lang); }) || null;
    return vozEn;
  }
  if (W.speechSynthesis) { elegirVoz(); if ('onvoiceschanged' in W.speechSynthesis) W.speechSynthesis.onvoiceschanged = elegirVoz; }
  function callarVoz() {
    colaVoz.forEach(clearTimeout); colaVoz = [];
    if (W.speechSynthesis) try { W.speechSynthesis.cancel(); } catch (_) {}
  }
  function hablar(texto) {
    if (silencio || !W.speechSynthesis || !texto) return;
    try {
      const u = new SpeechSynthesisUtterance(String(texto).split('/')[0].trim());
      const v = vozEn || elegirVoz(); if (v) u.voice = v;
      u.lang = (v && v.lang) || 'en-US'; u.rate = 0.92;
      W.speechSynthesis.speak(u);
    } catch (_) {}
  }
  function decir(lista, demora) {
    if (silencio || !W.speechSynthesis) return;
    callarVoz();
    const arr = Array.isArray(lista) ? lista : [lista];
    let t = demora || 0;
    arr.forEach(function (p) { colaVoz.push(setTimeout(function () { hablar(p); }, t)); t += 680; });
  }
  function actualizarBotonAudio() {
    const b = $('btnAudio');
    b.textContent = silencio ? '🔇' : '🔊';
    b.setAttribute('aria-label', silencio ? 'Activar sonido' : 'Silenciar');
  }
  function toggleAudio() {
    silencio = !silencio;
    if (silencio) callarVoz(); else sonar('paso');
    guardar('silencio', silencio);
    actualizarBotonAudio();
  }

  // ═════════════════════ TRAMOS (CUADRAS) Y PARTIDA ═════════════════════
  function verbosDeTramo(tramo) {
    if (typeof VJ.verbosDeTramo === 'function') {
      const vt = VJ.verbosDeTramo(tramo);
      if (Array.isArray(vt) && vt.length) return vt;
    }
    const t = limitar(Number(tramo) || 1, 1, 6);
    const tam = R.verbosPorTramo || 10;
    const ini = (t - 1) * tam;
    return (VJ.VERBOS || []).slice(ini, ini + tam);
  }

  function estadoVerboEnMapa(id) {
    const h = historial && historial[id];
    if (!h || !h.vistos) return 'nuevo';
    if (VJ.verboDominado(h, R)) return 'sabido';
    return 'practicando';
  }

  function progresoCuadra(tramo) {
    const vs = verbosDeTramo(tramo);
    let sabidos = 0, practicando = 0;
    vs.forEach(function (v) {
      const est = estadoVerboEnMapa(v.id);
      if (est === 'sabido') sabidos++;
      else if (est === 'practicando') practicando++;
    });
    return { total: vs.length || 10, sabidos: sabidos, practicando: practicando, verbos: vs };
  }

  function tramoMayorDesbloqueado() {
    if (profeDesbloqueaTodo) return 6;
    if (typeof VJ.tramoActual === 'function') {
      try {
        const ta = VJ.tramoActual(historial, R);
        if (typeof ta === 'number' && ta >= 1) return limitar(ta, 1, 6);
      } catch (_) {}
    }
    const umbral = R.sabidosParaAvanzar || 8;
    let maxT = 1;
    for (let t = 1; t < 6; t++) {
      if (progresoCuadra(t).sabidos >= umbral) maxT = t + 1;
      else break;
    }
    return maxT;
  }

  function elegirMejorTramo() {
    const maxD = tramoMayorDesbloqueado();
    if (tramoSeleccionado > maxD) tramoSeleccionado = maxD;
    for (let t = 1; t <= maxD; t++) {
      const p = progresoCuadra(t);
      if (p.sabidos < p.total) return t;
    }
    return maxD;
  }

  function mostrarCapa(id) {
    ['menu', 'grupos', 'final', 'revision', 'prepost', 'profe', 'salonConfig'].forEach(function (k) {
      const el = $(k);
      if (el) el.classList.toggle('oculta', k !== id);
    });
    $('btnSalir').classList.toggle('oculta', id !== null && id !== 'revision');
    $('btnPausaSalon').classList.toggle('oculta', !(id === null && salon && salon.activo));
  }

  function prepararMetodosPartida(p) {
    if (!p) return p;
    if (!p.avanzar) p.avanzar = p.paso;
    if (!p.cambiarCarril) p.cambiarCarril = p.mover;
    return p;
  }

  function iniciar(modo, semillaFija, grupoFijo, tramoFijo) {
    callarVoz();
    salon = null;
    prepost = null;
    if (tramoFijo != null) tramoSeleccionado = limitar(Number(tramoFijo) || 1, 1, 6);
    const semilla = semillaFija != null ? semillaFija : ((Date.now() ^ ((Math.random() * 0x100000000) >>> 0)) >>> 0) || 1;
    const modoPartida = (!modo || modo === 'normal') ? 'camino' : modo;
    partida = prepararMetodosPartida(VJ.crearPartida({
      semilla: semilla,
      historial: historial,
      modo: modoPartida,
      grupo: grupoFijo,
      tramo: modoPartida === 'camino' ? tramoSeleccionado : undefined
    }));
    const total = Object.keys(historial).reduce(function (s, k) { return s + (historial[k].vistos || 0); }, 0);
    tutorial = total === 0 && !cargar('tutorialHecho', false) && semillaFija == null;
    pantalla = 'juego'; pausa = false; pausaConTecla = false; rev = null;
    pasados = []; confeti = []; polvo = []; brillos = []; flotantes = []; vuelos = [];
    banda = null; mundoZ = 0; fasePaso = 0; profeK = 0;
    destelloT = 0; sacudeT = 0; pufT = 0; rugeT = 0; salvadoT = 0; capturaT = 0; victoriaT = 0; celebraT = 0;
    cacheFilas = new WeakMap();
    medir();
    mostrarCapa(null);
    const E = partida.estado;
    if (E.verbo) decir(E.verbo.base, 250);
  }

  function iniciarSalon(numEquipos, tramo, verbosForzados) {
    callarVoz();
    const nEq = numEquipos === 2 ? 2 : 3;
    const t = limitar(Number(tramo || tramoSeleccionado) || 1, 1, 6);
    tramoSeleccionado = t;
    const equipos = [];
    for (let i = 0; i < nEq; i++) {
      equipos.push({
        id: i,
        nombre: EQUIPOS_INFO[i].nombre,
        corto: EQUIPOS_INFO[i].corto,
        color: EQUIPOS_INFO[i].color,
        texto: EQUIPOS_INFO[i].texto,
        puntos: 0,
        aciertos: 0,
        errores: 0
      });
    }
    salon = {
      activo: true,
      fase: 'calle',
      numEquipos: nEq,
      tramo: t,
      equipos: equipos,
      turnoEquipo: 0,
      verbosEnRelevo: 0,
      relevosCompletados: 0,
      cambioEquipoT: 1.8,
      rebotePara: null,
      verbosForzados: Array.isArray(verbosForzados) && verbosForzados.length ? verbosForzados.slice() : null
    };
    const semilla = ((Date.now() ^ ((Math.random() * 0x100000000) >>> 0)) >>> 0) || 1;
    partida = prepararMetodosPartida(VJ.crearPartida({
      semilla: semilla,
      historial: historial,
      modo: 'camino',
      tramo: t
    }));
    tutorial = false;
    pantalla = 'juego'; pausa = false; pausaConTecla = false; rev = null;
    pasados = []; confeti = []; polvo = []; brillos = []; flotantes = []; vuelos = [];
    banda = null; mundoZ = 0; fasePaso = 0; profeK = 0;
    destelloT = 0; sacudeT = 0; pufT = 0; rugeT = 0; salvadoT = 0; capturaT = 0; victoriaT = 0; celebraT = 0;
    cacheFilas = new WeakMap();
    medir();
    mostrarCapa(null);
    const E = partida.estado;
    if (E.verbo) decir(E.verbo.base, 450);
  }

  function avanzarRelevoSalon() {
    if (!salon || !salon.activo) return;
    salon.verbosEnRelevo++;
    const meta = R.turnosSalon || 4;
    if (salon.verbosEnRelevo >= meta) {
      salon.verbosEnRelevo = 0;
      salon.relevosCompletados++;
      if (salon.relevosCompletados >= salon.numEquipos) {
        const res = partida.resumen();
        ultimoResumen = res;
        iniciarRevision(res);
        return;
      }
      salon.turnoEquipo = (salon.turnoEquipo + 1) % salon.numEquipos;
      salon.cambioEquipoT = 2.1;
      sonar('comodin_listo');
    }
  }

  function celebrarCierreVerbo(v, limpio) {
    if (!v) return;
    sonar('cadena');
    celebraT = 0.85;
    const bono = (VJ.EXTRAS && VJ.EXTRAS.puntosAprendido) || 250;
    const regular = !!(v.regular || v.esRegular || v.grupo === 'regulares');
    const nota = limpio ? '¡Verbo completo! +' + bono : (regular ? 'Regular (+ed)' : '¡Completado!');
    banda = { verbo: v, nota: nota, oracion: oracionCortaDe(v.id, v), edad: 0, dura: 2.1 };
    decir([v.base, v.pasado, v.participio], 80);
    if (tutorial) { tutorial = false; guardar('tutorialHecho', true); }
    if (salon && salon.activo) avanzarRelevoSalon();
  }

  function atender(ev, E) {
    const u = G.u, xs = G.cx + (E.x - 1) * G.carril, ys = G.yPie - G.estudiante * 0.75;
    const vEv = (ev.verbo && typeof ev.verbo === 'object') ? ev.verbo : (VJ.VERBO_POR_ID[ev.verbo] || E.verbo);
    if (ev.tipo === 'estrella') {
      sonar('estrella');
      if (salon && salon.activo) salon.equipos[salon.turnoEquipo].puntos += ev.puntos || 10;
      for (let i = 0; i < 6; i++) brillos.push({ x: xs + (Math.random() - 0.5) * u * 0.08, y: ys, r: u * 0.02, color: C.ficha, edad: 0, dura: 0.45 });
    } else if (ev.tipo === 'recogio' || ev.tipo === 'libro') {
      if (vEv) pasados.push({ o: { tipo: 'verbo', carril: ev.carril != null ? ev.carril : E.carril, verbo: vEv }, z: 0, marcas: { recogido: true, edad: 0 } });
      sonar('libro');
      if (vEv) {
        flotantes.push({ texto: vEv.base.toUpperCase(), x: xs, y: ys - u * 0.05, color: C.ficha, tam: 0.078, edad: 0, dura: 0.85 });
        decir(vEv.base);
      }
      for (let i = 0; i < 10; i++) brillos.push({ x: xs + (Math.random() - 0.5) * u * 0.14, y: ys + (Math.random() - 0.5) * u * 0.08, r: u * 0.025, color: '#fff7cf', edad: 0, dura: 0.55 });
    } else if (ev.tipo === 'sinrecoger' || ev.tipo === 'libro_perdido') {
      if (vEv) pasados.push({ o: { tipo: 'verbo', carril: ev.carril != null ? ev.carril : E.carril, verbo: vEv }, z: 0, marcas: { recogido: false, edad: 0 } });
      sonar('libro_perdido'); destelloT = 0.45;
    } else if (ev.tipo === 'acierto') {
      if (ev.objeto && ev.objeto.tipo === 'fila') {
        pasados.push({ o: ev.objeto, z: 0, marcas: { acierto: true, elegido: ev.objeto.correcta, edad: 0 } });
      }
      const b = (ev.objeto && ev.objeto.tipo === 'fila') ? cajasDeFila(ev.objeto, 0)[ev.objeto.correcta] : { cx: xs, y: ys, h: 40, letra: 28 };
      const palabra = ev.elegida || ev.palabra || ev.correcta || '';
      popT = 1; pufT = 1;
      if (salon && salon.activo) {
        const eq = salon.equipos[salon.turnoEquipo];
        eq.puntos += R.puntosSalonAcierto || 100;
        eq.aciertos++;
      }
      if (sitioNuevo && palabra) vuelos.push({ texto: palabra, x0: b.cx, y0: b.y + b.h / 2, x1: sitioNuevo[0], y1: sitioNuevo[1], l0: b.letra, l1: G.letraHud, edad: 0, dura: 0.36 });
      const ptsGanados = ev.puntosGanados || ((VJ.EXTRAS ? VJ.EXTRAS.puntosAcierto : 100) * (E.multiplicador || 1));
      const txtPts = (salon && salon.activo) ? '+100 ' + salon.equipos[salon.turnoEquipo].corto : '+' + ptsGanados;
      flotantes.push({ texto: txtPts, x: xs, y: ys - u * 0.06, color: C.verde, tam: 0.08, edad: 0, dura: 0.9 });
      for (let i = 0; i < 14; i++) {
        const a = Math.random() * PI2, v = (0.22 + Math.random() * 0.35) * u;
        confeti.push({ x: b.cx, y: b.y + b.h / 2, vx: Math.cos(a) * v, vy: Math.sin(a) * v - u * 0.25, t: u * (0.018 + Math.random() * 0.014), rot: Math.random() * 6, vr: (Math.random() - 0.5) * 10, color: CONFETI[i % 5], edad: 0, dura: 0.65 });
      }
      sonar('acierto');
      if (ev.pide !== 'significado' && palabra) decir(palabra);
    } else if (ev.tipo === 'aprendido') {
      // Celebrado también por cierre de cadena en avanzar()
    } else if (ev.tipo === 'error') {
      if (ev.objeto && ev.objeto.tipo === 'fila') {
        ev.objeto.resuelta = 'error';
        pasados.push({ o: ev.objeto, z: 0, marcas: { acierto: false, elegido: ev.carril != null ? ev.carril : E.carril, edad: 0 } });
      }
      sonar('error'); destelloT = 0.9; sacudeT = 0.45; rugeT = 0.95;
      if (salon && salon.activo) {
        const eq = salon.equipos[salon.turnoEquipo];
        eq.puntos = Math.max(0, eq.puntos - Math.abs(R.puntosSalonError || 50));
        eq.errores++;
        E.peligroFilas = 0;
        if (E.monstruo > 0.65) E.monstruo = 0.55;
        flotantes.push({ texto: '-50 ' + eq.corto, x: xs, y: ys - u * 0.04, color: C.naranja, tam: 0.072, edad: 0, dura: 0.9 });
      } else if (ev.correcta) {
        flotantes.push({ texto: 'Era ' + String(ev.correcta).toUpperCase(), x: xs, y: ys - u * 0.04, color: '#fff', tam: 0.068, edad: 0, dura: 1.0 });
      }
      if (ev.correcta) decir(ev.correcta, 240);
    } else if (ev.tipo === 'comodin' || ev.tipo === 'comodin_listo') {
      sonar('comodin_listo');
      if (!(salon && salon.activo)) flotantes.push({ texto: '¡Profe listo!', x: G.cx, y: G.hudH + u * 0.14, color: C.ficha, tam: 0.072, edad: 0, dura: 1.1 });
    } else if (ev.tipo === 'salvado') {
      sonar('salvado'); salvadoT = 1.7; pufT = 1;
      if (vEv) {
        cruceTexto = '¡El profe frena al monstruo!  ' + vEv.base.toUpperCase() + ' → ' + vEv.pasado + ' → ' + vEv.participio;
        decir([vEv.base, vEv.pasado, vEv.participio], 250);
      }
    } else if (ev.tipo === 'victoria' || (ev.tipo === 'fin' && ev.fase === 'ganada')) {
      sonar('ganada');
      victoriaT = 0.01;
      for (let i = 0; i < 36; i++) {
        const a = Math.random() * PI2, v = (0.2 + Math.random() * 0.55) * u;
        confeti.push({ x: G.cx + (Math.random() - 0.5) * u * 0.5, y: G.hudH + u * 0.25, vx: Math.cos(a) * v, vy: Math.sin(a) * v - u * 0.2, t: u * 0.024, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 10, color: CONFETI[i % 5], edad: 0, dura: 1.7 });
      }
    } else if (ev.tipo === 'captura' || (ev.tipo === 'fin' && ev.fase === 'perdida')) {
      if (salon && salon.activo) {
        E.fase = 'corriendo';
        E.peligroFilas = 0;
        E.monstruo = 0.45;
        return;
      }
      sonar('perdida');
      capturaT = 0.01; sacudeT = 0.7;
    }
  }

  function avanzarListas(dt, vel) {
    pasados.forEach(function (g) { g.z -= vel * dt; g.marcas.edad += dt; });
    pasados = pasados.filter(function (g) { return g.marcas.edad < (g.marcas.acierto ? 0.9 : 0.34); });
    polvo.forEach(function (p) { p.edad += dt; p.y += dt * G.u * 0.04; });
    polvo = polvo.filter(function (p) { return p.edad < p.dura; });
    confeti.forEach(function (p) { p.edad += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += G.u * 0.9 * dt; p.rot += p.vr * dt; });
    confeti = confeti.filter(function (p) { return p.edad < p.dura; });
    brillos.forEach(function (p) { p.edad += dt; });
    brillos = brillos.filter(function (p) { return p.edad < p.dura; });
    flotantes.forEach(function (p) { p.edad += dt; });
    flotantes = flotantes.filter(function (p) { return p.edad < p.dura; });
    vuelos.forEach(function (p) { p.edad += dt; });
    vuelos = vuelos.filter(function (p) { return p.edad < p.dura; });
  }

  function avanzar(dt) {
    reloj += dt;
    if (pantalla === 'juego' && partida) {
      const E = partida.estado;
      const corriendo = E.fase === 'corriendo';
      const congeladaPorRelevo = salon && salon.activo && salon.cambioEquipoT > 0;
      if (congeladaPorRelevo) salon.cambioEquipoT = Math.max(0, salon.cambioEquipoT - dt);
      if (corriendo && !pausa && !congeladaPorRelevo) {
        const verAntes = E.verbo && E.verbo.id;
        const objAntes = E.objetos && E.objetos[0];
        const carrilAntes = E.carril;
        const cerradoAntes = !!(E.cadena && E.cadena.cerrado);
        const evs = partida.paso(dt);
        mundoZ += E.velocidad * dt;
        fasePaso += dt * E.velocidad * 0.78;
        if (Math.random() < dt * 16) polvo.push({ x: G.cx + (E.x - 1) * G.carril + (Math.random() - 0.5) * G.estudiante * 0.22, y: G.yPie, r: G.u * (0.016 + Math.random() * 0.014), edad: 0, dura: 0.38 });
        evs.forEach(function (ev) {
          if (!ev.objeto && objAntes) ev.objeto = objAntes;
          if (ev.carril == null) ev.carril = (objAntes && objAntes.tipo === 'verbo') ? objAntes.carril : carrilAntes;
          atender(ev, E);
        });
        if (!cerradoAntes && E.cadena && E.cadena.cerrado && E.verbo) {
          celebrarCierreVerbo(E.verbo, !!E.cadena.limpio);
        }
        if (E.verbo && E.verbo.id !== verAntes && !banda) decir(E.verbo.base, 260);
      } else if (E.fase === 'ganada') {
        mundoZ += E.velocidad * dt * 0.55;
        fasePaso += dt * 7;
        victoriaT += dt;
        if (victoriaT > 2.2) terminar();
      } else if (E.fase === 'perdida') {
        capturaT += dt;
        if (capturaT > 1.65) terminar();
      }
      avanzarListas(dt, corriendo ? E.velocidad : 0);
      destelloT = Math.max(0, destelloT - dt * 1.9);
      sacudeT   = Math.max(0, sacudeT - dt * 2.2);
      popT      = Math.max(0, popT - dt * 3.2);
      pufT      = Math.max(0, pufT - dt * 2.4);
      rugeT     = Math.max(0, rugeT - dt * 1.4);
      salvadoT  = Math.max(0, salvadoT - dt);
      celebraT  = Math.max(0, celebraT - dt);
      if (banda) { banda.edad += dt; if (banda.edad >= banda.dura) banda = null; }
      const hayGlobo = !!(E.pista || E.anuncio || (tutorial && E.verbo));
      profeK = limitar(profeK + (hayGlobo ? dt * 5 : -dt * 5), 0, 1);
    } else if (pantalla === 'revision' && rev) {
      avanzarRevision(dt);
      avanzarListas(dt, 0);
    } else {
      mundoZ += dt * 5;
      fasePaso += dt * 5.5;
      avanzarListas(dt, 0);
      if (prepost && prepost.activo && !prepost.terminado) {
        prepost.restante = Math.max(0, prepost.restante - dt);
        const rel = $('prepostReloj');
        if (rel) rel.textContent = '⏱ ' + Math.ceil(prepost.restante) + ' s';
        if (prepost.restante <= 0) finalizarPrePost();
      }
    }
  }

  // ═════════════════════ PORTADA (MAPA DE LAS 6 CUADRAS), ÁLBUM Y RESUMEN ═════════════════════
  let pestanaAlbum = 'todos';

  function contarPendientes() {
    return Object.keys(historial).filter(function (id) {
      const h = historial[id];
      return h && h.vistos > 0 && (h.pendiente || h.fallos > 0 || h.errores > 0 || !VJ.verboDominado(h, R));
    }).length;
  }

  function pintarMapaCuadras() {
    const cont = $('mapaCuadras');
    if (!cont) return;
    const maxDesb = tramoMayorDesbloqueado();
    if (tramoSeleccionado > maxDesb) tramoSeleccionado = maxDesb;
    let totalSabidos = 0;
    const html = CUADRAS_INFO.map(function (c) {
      const p = progresoCuadra(c.tramo);
      totalSabidos += p.sabidos;
      const bloq = c.tramo > maxDesb;
      const activa = c.tramo === tramoSeleccionado;
      const completa = p.sabidos >= p.total;
      const estadoTxt = bloq ? '🔒 Bloqueada' : (completa ? '⭐ ¡Completada!' : p.sabidos + '/' + p.total + ' sabidos');
      const ladrillos = p.verbos.map(function (v) {
        const est = estadoVerboEnMapa(v.id);
        return '<span class="ladrillo ' + est + '" title="' + v.base + ' (' + (v.esCorto || v.es) + ')">' + v.base + '</span>';
      }).join('');
      return '<div class="cuadraItem' + (activa ? ' activa' : '') + (bloq ? ' bloqueada' : '') + '" data-tramo="' + c.tramo + '">' +
        '<div class="cuadraCab">' +
          '<span class="cuadraNom">' + c.icono + ' ' + c.tramo + '. ' + c.nombre + '</span>' +
          '<span class="cuadraEst">' + estadoTxt + '</span>' +
        '</div>' +
        '<div class="ladrillos">' + ladrillos + '</div>' +
      '</div>';
    }).join('');
    cont.innerHTML = html;
    $('mapaResumenGlobal').textContent = totalSabidos + ' / ' + VJ.VERBOS.length + ' ¡Sabidos!';
    const infoSel = CUADRAS_INFO[tramoSeleccionado - 1] || CUADRAS_INFO[0];
    $('btnJugar').textContent = '¡A correr! · Cuadra ' + infoSel.tramo + ' (10 verbos)';
    const bDesb = $('btnDesbloquearProfe');
    if (bDesb) {
      bDesb.classList.toggle('activo', profeDesbloqueaTodo);
      bDesb.textContent = profeDesbloqueaTodo ? '🔓 Todas las cuadras abiertas (Profe)' : '🔓 Soy el profe: abrir todas las cuadras';
    }
    cont.querySelectorAll('.cuadraItem').forEach(function (el) {
      el.onclick = function () {
        const t = Number(el.getAttribute('data-tramo')) || 1;
        if (t > tramoMayorDesbloqueado()) return;
        tramoSeleccionado = t;
        guardar('tramo', tramoSeleccionado);
        pintarMapaCuadras();
      };
    });
  }

  function pintarMenu() {
    historial = cargar('historial', {});
    mejorPuntaje = cargar('mejor', 0);
    pintarMapaCuadras();
    const pend = contarPendientes();
    const bR = $('btnRepasar');
    const minRep = R.repasoMinVerbos || R.minimoParaRepaso || 4;
    bR.classList.toggle('oculta', pend < minRep);
    bR.textContent = 'Lo que me cuesta (' + pend + ')';
    $('btnGrupos').textContent = 'Álbum de verbos (' + VJ.totalDominados(historial, R) + '/' + VJ.VERBOS.length + ')';
  }

  function pintarGrupos() {
    const dom = VJ.totalDominados(historial, R);
    $('progresoTexto').textContent = dom + ' de ' + VJ.VERBOS.length + ' verbos ¡Sabidos! · Récord: ' + mejorPuntaje + ' pts';
    const tabs = [
      { id: 'todos', txt: 'Por grupos (' + VJ.VERBOS.length + ')' },
      { id: 'cuesta', txt: 'Lo que me cuesta' },
      { id: 'sabidos', txt: '¡Sabidos! (' + dom + ')' }
    ].concat(CUADRAS_INFO.map(function (c) {
      return { id: 'cuadra_' + c.tramo, txt: 'Cuadra ' + c.tramo };
    }));
    const barra = $('albumPestanas');
    if (barra) {
      barra.innerHTML = tabs.map(function (t) {
        return '<button class="tabBtn' + (pestanaAlbum === t.id ? ' activa' : '') + '" data-tab="' + t.id + '">' + t.txt + '</button>';
      }).join('');
      barra.querySelectorAll('.tabBtn').forEach(function (b) {
        b.onclick = function () {
          pestanaAlbum = b.getAttribute('data-tab');
          pintarGrupos();
        };
      });
    }

    const chipDe = function (v) {
      const est = estadoVerboEnMapa(v.id);
      const cls = est === 'sabido' ? 'ok' : (est === 'practicando' ? 'visto' : '');
      const etq = est === 'sabido' ? ' · ¡Sabido!' : (est === 'practicando' ? ' · En práctica' : '');
      return '<span class="chip ' + cls + '" data-voz="' + v.id + '">' +
        '<b>' + v.base + '</b> → ' + v.pasado + ' → ' + v.participio +
        ' <i>(' + (v.esCorto || v.es) + etq + ')</i></span>';
    };

    const lista = $('listaGrupos');
    if (pestanaAlbum === 'todos') {
      lista.innerHTML = VJ.GRUPOS.map(function (g) {
        const vs = VJ.VERBOS_POR_GRUPO[g.id] || [];
        const ok = vs.filter(function (v) { return VJ.verboDominado(historial[v.id], R); }).length;
        return '<div class="tarjetaGrupo">' +
          '<div class="cabecera"><div><div class="nombre">' + g.nombre + '</div><div class="idea">' + (g.corto || g.ejemplo || '') + ' — ' + ok + '/' + vs.length + ' ¡Sabidos!</div></div>' +
          '<button class="boton mini" data-grupo="' + g.id + '">Practicar</button></div>' +
          '<div class="chips">' + vs.map(chipDe).join('') + '</div></div>';
      }).join('');
    } else {
      let filtrados = VJ.VERBOS.slice();
      let titulo = 'Todos los verbos';
      let subtitulo = 'Toca cualquier verbo para escuchar sus 3 formas en inglés.';
      let tramoPracticar = null;
      if (pestanaAlbum === 'cuesta') {
        filtrados = VJ.VERBOS.filter(function (v) { return estadoVerboEnMapa(v.id) === 'practicando'; });
        titulo = 'Verbos en práctica (Lo que me cuesta)';
        subtitulo = filtrados.length ? 'Estos verbos ya los viste pero aún necesitan práctica limpia.' : '¡No tienes verbos pendientes en práctica ahora mismo!';
      } else if (pestanaAlbum === 'sabidos') {
        filtrados = VJ.VERBOS.filter(function (v) { return estadoVerboEnMapa(v.id) === 'sabido'; });
        titulo = 'Verbos ¡Sabidos!';
        subtitulo = filtrados.length ? 'Verbos dominados con racha limpia y producción en el puente.' : 'Juega una cuadra para ganar tus primeros verbos ¡Sabidos!';
      } else if (pestanaAlbum.indexOf('cuadra_') === 0) {
        tramoPracticar = Number(pestanaAlbum.split('_')[1]) || 1;
        const infoC = CUADRAS_INFO[tramoPracticar - 1] || CUADRAS_INFO[0];
        filtrados = verbosDeTramo(tramoPracticar);
        titulo = infoC.icono + ' Cuadra ' + infoC.tramo + ': ' + infoC.nombre;
        subtitulo = progresoCuadra(tramoPracticar).sabidos + ' de ' + filtrados.length + ' verbos ¡Sabidos! en esta cuadra.';
      }
      lista.innerHTML = '<div class="tarjetaGrupo">' +
        '<div class="cabecera"><div><div class="nombre">' + titulo + '</div><div class="idea">' + subtitulo + '</div></div>' +
        (tramoPracticar ? '<button class="boton mini" data-tramo-jugar="' + tramoPracticar + '">Correr cuadra</button>' : '') +
        '</div><div class="chips">' + (filtrados.map(chipDe).join('') || '<span class="chip"><i>Sin verbos en esta vista todavía.</i></span>') + '</div></div>';
    }

    lista.querySelectorAll('[data-grupo]').forEach(function (b) {
      b.onclick = function () { iniciar('grupo', null, b.getAttribute('data-grupo')); };
    });
    lista.querySelectorAll('[data-tramo-jugar]').forEach(function (b) {
      b.onclick = function () { iniciar('normal', null, null, Number(b.getAttribute('data-tramo-jugar'))); };
    });
    lista.querySelectorAll('[data-voz]').forEach(function (c) {
      c.onclick = function () { const v = VJ.VERBO_POR_ID[c.getAttribute('data-voz')]; if (v) decir([v.base, v.pasado, v.participio]); };
    });
  }

  // ═════════════════════ EL PUENTE DEL PROFESOR (CAJA DE 8 FICHAS 4×2) ═════════════════════
  function puenteDe(u, W, H, vertical) {
    const w = Math.min(W * (vertical ? 0.96 : 0.72), u * 1.38);
    return { x: W / 2 - w / 2, w: w, y: H - u * (vertical ? 0.25 : 0.27), h: u * 0.055 };
  }

  function actualizarMarcadorSalonPuente() {
    const m = $('revMarcadorSalon');
    if (!m) return;
    if (!salon || !salon.activo) {
      m.classList.add('oculta');
      return;
    }
    m.classList.remove('oculta');
    const eqTurno = salon.rebotePara != null ? salon.rebotePara : salon.turnoEquipo;
    m.innerHTML = salon.equipos.map(function (eq, idx) {
      const activo = idx === eqTurno;
      const esRebote = salon.rebotePara === idx;
      return '<span class="pillEquipo' + (activo ? ' activo' : '') + '" style="background:' + eq.color + ';color:' + eq.texto + '">' +
        (esRebote ? '⚡ REBOTE ' : (activo ? '▶ ' : '')) + eq.nombre + ': ' + eq.puntos + ' pts</span>';
    }).join('');
  }

  function normalizarInstanciaRevision(inst) {
    if (!inst) return inst;
    if (typeof inst.progreso !== 'function') {
      inst.progreso = function () {
        const tot = typeof inst.total === 'function' ? inst.total() : (inst.estado ? inst.estado.total : 1);
        const idx = typeof inst.indice === 'function' ? inst.indice() : 0;
        return { resueltos: idx, total: tot };
      };
    }
    return inst;
  }

  function iniciarRevision(res) {
    callarVoz();
    const semilla = ((Date.now() ^ ((Math.random() * 0x100000000) >>> 0)) >>> 0) || 1;
    let ids = (res.verbos || []).map(function (v) { return typeof v === 'string' ? v : v.id; }).filter(Boolean);
    let falladosIds = (res.verbos || []).filter(function (v) { return v && v.resultado === 'pendiente'; }).map(function (v) { return v.id; });
    if (salon && salon.activo && salon.verbosForzados && salon.verbosForzados.length) {
      ids = salon.verbosForzados.slice();
      falladosIds = salon.verbosForzados.slice();
    }
    if (!ids.length) {
      ids = verbosDeTramo(tramoSeleccionado).slice(0, 4).map(function (v) { return v.id; });
    }
    const cant = (salon && salon.activo) ? (R.oracionesPuenteSalon || 6) : (R.revisionTrasCarrera || 4);
    const inst = normalizarInstanciaRevision(VJ.crearRevision({
      ids: ids,
      fallados: falladosIds,
      cantidad: cant,
      semilla: semilla
    }));
    if (inst.terminada()) { mostrarResumenFinal(res, null); return; }
    if (salon && salon.activo) {
      salon.fase = 'puente';
      salon.turnoEquipo = 0;
      salon.rebotePara = null;
    }
    rev = {
      inst: inst, res: res,
      entrada: null,
      escritura: '',
      elegida: -1, estado: 'pregunta', tEstado: 0,
      revelada: '', explicacion: '', intento: 1,
      monstruoAtras: 0, cruce: 0, sacude: 0, ruge: 0,
      vuelo: null
    };
    pantalla = 'revision';
    mostrarCapa('revision');
    sonar('puente');
    actualizarMarcadorSalonPuente();
    pintarPreguntaRevision();
  }

  function llenarOracion(p, huecoCls, textoHueco) {
    const txtOracion = (p && (p.texto || p.oracion)) || '___';
    const partes = txtOracion.split('___');
    $('revOracion').innerHTML = partes[0] + '<span class="hueco ' + (huecoCls || '') + '">' + textoHueco + '</span>' + (partes[1] || '');
    const v = (p && p.verbo) || { base: p ? p.base : '', es: p ? p.significado : '' };
    $('revPista').textContent = '💡 ' + (p.pista || '') + ' — ' + String(v.base || '').toUpperCase() + ' (' + (v.esCorto || v.es || '') + ')';
  }

  function renderVisorFichas(p) {
    const visor = $('revVisorTexto');
    const ayuda = $('revVisorAyuda');
    if (!visor) return;
    visor.classList.remove('correcto', 'error', 'enVuelo');
    const esc = (rev && rev.escritura) ? rev.escritura.toUpperCase() : '';
    const meta = (p && p.correcta) ? p.correcta.toUpperCase() : '';
    const enSegundoIntento = p && ((p.intentosFicha || 0) >= 1 || (p.intento || 1) >= 2 || !!p.esqueleto);
    if (!esc) {
      if (enSegundoIntento && p.esqueleto) {
        visor.textContent = p.esqueleto.toUpperCase();
      } else {
        const guiones = meta ? meta.split('').map(function () { return '_'; }).join(' ') : '_ _ _ _';
        visor.textContent = guiones;
      }
    } else if (enSegundoIntento && meta.length > esc.length) {
      let armado = esc.split('').join(' ');
      for (let i = esc.length; i < meta.length; i++) {
        armado += ' _';
      }
      visor.textContent = armado;
    } else {
      visor.textContent = esc.split('').join(' ');
    }
    if (ayuda) {
      if (salon && salon.activo && salon.rebotePara != null) {
        const eqR = salon.equipos[salon.rebotePara];
        ayuda.textContent = '⚡ ¡REBOTE PARA EL ' + eqR.nombre.toUpperCase() + ' (+100 pts)!';
      } else if (enSegundoIntento && meta) {
        ayuda.textContent = '2.º intento: empieza con ' + meta[0] + ' (' + meta.length + ' letras)';
      } else {
        ayuda.textContent = 'Arma el verbo con las fichas (o usa tu teclado / micrófono)';
      }
    }
  }

  function pintarCajaFichas(p) {
    const grid = $('revGridFichas');
    if (!grid) return;
    const fichas = (p && Array.isArray(p.fichas) && p.fichas.length) ? p.fichas.slice(0, 7) : ['w', 'e', 'n', 't', 'a', 'o', 's'];
    const apagadas = new Set(((p && p.letrasApagadas) || []).map(function (l) { return String(l).toUpperCase(); }));
    const htmlFichas = fichas.map(function (letra, idx) {
      const L = String(letra).toUpperCase();
      const off = apagadas.has(L) && String(p.correcta || '').toUpperCase().indexOf(L) === -1;
      return '<button type="button" class="fichaLetra' + (off ? ' apagada' : '') + '" data-ficha="' + L + '" data-idx="' + idx + '"' + (off ? ' disabled' : '') + '>' + L + '</button>';
    });
    htmlFichas.push('<button type="button" class="fichaLetra borrar" id="btnFichaBorrar" data-accion="borrar" aria-label="Borrar letra">⌫</button>');
    grid.innerHTML = htmlFichas.join('');

    grid.querySelectorAll('.fichaLetra').forEach(function (btn) {
      btn.onclick = function () {
        if (!rev || rev.estado !== 'pregunta') return;
        if (btn.getAttribute('data-accion') === 'borrar') {
          borrarLetraFicha();
        } else {
          agregarLetraFicha(btn.getAttribute('data-ficha'));
        }
      };
    });

    const btnVoz = $('btnFichaVoz');
    const SR = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (btnVoz) {
      btnVoz.classList.toggle('oculta', !SR);
      btnVoz.classList.remove('escuchando');
    }
    renderVisorFichas(p);
  }

  function esModoFichas(p) {
    return !!(p && (p.modo === 'fichas' || p.modo === 'escribir'));
  }

  function agregarLetraFicha(letra) {
    if (!rev || rev.estado !== 'pregunta') return;
    const p = rev.inst.actual();
    if (!esModoFichas(p)) return;
    const L = String(letra || '').replace(/[^a-zA-Z]/g, '').toUpperCase();
    if (!L) return;
    const apagadas = ((p && p.letrasApagadas) || []).map(function (x) { return String(x).toUpperCase(); });
    if (apagadas.indexOf(L) >= 0 && String(p.correcta || '').toUpperCase().indexOf(L) < 0) return;
    const maxLen = R.maxLetras || 9;
    if (rev.escritura.length >= maxLen) return;
    rev.escritura += L.toLowerCase();
    if (typeof rev.inst.tocarFicha === 'function') rev.inst.tocarFicha(L.toLowerCase());
    sonar('ficha');
    renderVisorFichas(p);
  }

  function borrarLetraFicha() {
    if (!rev || rev.estado !== 'pregunta') return;
    const p = rev.inst.actual();
    if (!esModoFichas(p)) return;
    if (!rev.escritura.length) return;
    rev.escritura = rev.escritura.slice(0, -1);
    if (typeof rev.inst.borrarFicha === 'function') rev.inst.borrarFicha();
    sonar('ficha');
    renderVisorFichas(p);
  }

  function pintarPreguntaRevision() {
    const p = rev.inst.actual();
    if (!p) return;
    if (rev.inst.estado && rev.inst.estado.fase === 'tapada' && typeof rev.inst.destapar === 'function') {
      rev.inst.destapar();
    }
    rev.estado = 'pregunta'; rev.elegida = -1;
    const prog = rev.inst.progreso();
    $('revContador').textContent = 'Verbo ' + (prog.resueltos + 1) + ' de ' + prog.total + (p.repetida ? '  ·  🔄 Vuelve a salir' : '');
    const v = p.verbo || { base: p.base, pasado: '', participio: '', es: p.significado };
    let f = v.base.toUpperCase() + '  →  ' + (p.forma === 'pasado' ? '___  →  ' + v.participio : (p.forma === 'participio' ? v.pasado + '  →  ___' : "DIDN'T ___ (BASE)"));
    $('revFormas').textContent = f + '   (' + (v.esCorto || v.es || '') + ')';
    llenarOracion(p, '', '___');
    $('revExplicacion').classList.add('oculta');
    const esEsc = esModoFichas(p);
    $('revOpciones').classList.toggle('oculta', esEsc);
    $('revFichasCaja').classList.toggle('oculta', !esEsc);
    actualizarMarcadorSalonPuente();
    if (esEsc) {
      rev.escritura = '';
      if ((p.intentosFicha || 0) >= 1 && p.correcta) {
        rev.escritura = p.correcta[0].toLowerCase();
      }
      pintarCajaFichas(p);
    } else {
      $('revOpciones').innerHTML = p.opciones.map(function (op, i) {
        const bdg = (salon && salon.activo) ? '<span style="display:block;font-size:12px;color:#5a6b8c">[' + (i + 1) + ']</span>' : '';
        return '<button class="carta" data-i="' + i + '">' + bdg + op + '</button>';
      }).join('');
      $('revOpciones').querySelectorAll('.carta').forEach(function (b) {
        b.onclick = function () { elegirRevision(Number(b.getAttribute('data-i'))); };
      });
    }
    decir(v.base, 180);
  }

  function volarPalabra(elOrigen, palabra) {
    const h = $('revOracion').querySelector('.hueco');
    if (!elOrigen || !h) return;
    const r0 = elOrigen.getBoundingClientRect(), r1 = h.getBoundingClientRect();
    elOrigen.classList.add('enVuelo');
    rev.vuelo = { texto: palabra, x0: r0.left + r0.width / 2, y0: r0.top + r0.height / 2, x1: r1.left + r1.width / 2, y1: r1.top + r1.height / 2, edad: 0, dura: 0.42 };
  }

  function procesarResultadoRevision(r, origenEl) {
    rev.revelada = r.correcta; rev.explicacion = r.explicacion; rev.intento = r.intento || 1;
    const pAct = rev.inst.actual() || r.oracion || { texto: $('revOracion').textContent, pista: r.pista || '', verbo: r.verbo };
    if (r.acierto) {
      if (salon && salon.activo) {
        const eqIdx = salon.rebotePara != null ? salon.rebotePara : salon.turnoEquipo;
        salon.equipos[eqIdx].puntos += (salon.rebotePara != null ? (R.puntosSalonRebote || 100) : 100);
        salon.equipos[eqIdx].aciertos++;
        salon.rebotePara = null;
        salon.turnoEquipo = (salon.turnoEquipo + 1) % salon.numEquipos;
        actualizarMarcadorSalonPuente();
      }
      rev.estado = 'bien'; rev.tEstado = 0.95; rev.monstruoAtras = Math.min(1, rev.monstruoAtras + 0.16);
      sonar('acierto');
      if (r.verbo) decir([r.verbo.base, r.verbo.pasado, r.verbo.participio], 60);
      volarPalabra(origenEl, r.correcta);
      setTimeout(function () { if (rev && rev.estado === 'bien') llenarOracion(pAct, 'lleno', r.correcta); }, 280);
      for (let k = 0; k < 16; k++) {
        const a = Math.random() * PI2, v = (0.2 + Math.random() * 0.4) * G.u;
        confeti.push({ x: G.cx, y: G.H * 0.55, vx: Math.cos(a) * v, vy: Math.sin(a) * v - G.u * 0.2, t: G.u * 0.02, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 10, color: CONFETI[k % 5], edad: 0, dura: 0.7 });
      }
    } else if (r.reintentar) {
      if (salon && salon.activo) {
        salon.rebotePara = (salon.turnoEquipo + 1) % salon.numEquipos;
        actualizarMarcadorSalonPuente();
      }
      rev.sacude = 0.4; rev.ruge = 0.5;
      sonar('error');
      const ex = $('revExplicacion');
      if (salon && salon.activo && salon.rebotePara != null) {
        const eqR = salon.equipos[salon.rebotePara];
        ex.innerHTML = '⚡ <b>¡REBOTE PARA EL ' + eqR.nombre.toUpperCase() + ' (+100 pts)!</b><br>' + (r.explicacion || '');
      } else {
        ex.innerHTML = 'Pista: <b>' + (r.pista || '') + '</b> — ' + (r.explicacion || '');
      }
      ex.classList.remove('oculta');
      if (pAct) {
        rev.escritura = pAct.correcta ? pAct.correcta[0].toLowerCase() : '';
        pintarCajaFichas(pAct);
      }
    } else {
      if (salon && salon.activo) {
        if (salon.rebotePara == null) {
          // En modo opciones del puente de Salón, el primer fallo ofrece rebote inmediato al siguiente equipo
          salon.rebotePara = (salon.turnoEquipo + 1) % salon.numEquipos;
        } else {
          salon.rebotePara = null;
          salon.turnoEquipo = (salon.turnoEquipo + 1) % salon.numEquipos;
        }
        actualizarMarcadorSalonPuente();
      }
      rev.estado = 'mal'; rev.tEstado = 2.1; rev.sacude = 0.45; rev.ruge = 0.9;
      sonar('error');
      if (r.correcta) decir(r.correcta, 240);
      llenarOracion(pAct, 'error', r.correcta);
      const ex = $('revExplicacion');
      const v = r.verbo || { base: '', pasado: '', participio: '' };
      const prefRebote = (salon && salon.activo && salon.rebotePara != null)
        ? '⚡ <b>¡REBOTE PARA EL ' + salon.equipos[salon.rebotePara].nombre.toUpperCase() + ' (+100 pts) en la siguiente!</b><br>'
        : '';
      ex.innerHTML = prefRebote + 'Era <b>' + String(r.correcta || '').toUpperCase() + '</b> (' + v.base + ' → ' + v.pasado + ' → ' + v.participio + '). ' + (r.explicacion || '') + ' <i>Volverá a salir.</i>';
      ex.classList.remove('oculta');
    }
  }

  function elegirRevision(i) {
    if (!rev || rev.estado !== 'pregunta') return;
    const p = rev.inst.actual();
    if (!p || esModoFichas(p) || i < 0 || i >= p.opciones.length) return;
    if (rev.inst.estado && rev.inst.estado.fase === 'tapada' && typeof rev.inst.destapar === 'function') {
      rev.inst.destapar();
    }
    rev.elegida = i;
    rev.inst.elegir(i);
    const acierto = !!(rev.inst.estado && rev.inst.estado.acierto);
    const indCorr = p.indiceCorrecta != null ? p.indiceCorrecta : p.opciones.indexOf(p.correcta);
    const botones = $('revOpciones').querySelectorAll('.carta');
    botones.forEach(function (b, j) {
      if (j === indCorr) b.classList.add('bien');
      else if (j === i && !acierto) b.classList.add('mal');
      else b.classList.add('apagada');
    });
    procesarResultadoRevision({
      acierto: acierto,
      reintentar: false,
      correcta: p.correcta,
      indiceCorrecto: indCorr,
      explicacion: p.explicacion || p.razon,
      pista: p.pista,
      verbo: p.verbo,
      oracion: p
    }, botones[indCorr]);
  }

  function enviarEscrituraRevision() {
    if (!rev || rev.estado !== 'pregunta') return;
    const p = rev.inst.actual();
    if (!esModoFichas(p)) return;
    const txt = (rev.escritura || '').trim().toLowerCase();
    if (!txt) return;
    if (rev.inst.estado && rev.inst.estado.fase === 'tapada' && typeof rev.inst.destapar === 'function') {
      rev.inst.destapar();
    }
    const visor = $('revVisorTexto');
    // Para que elegir(i) en logica.js siempre trate entradas de 1 letra como texto y no como índice numérico
    const argElegir = (txt.length === 1 && txt !== p.correcta.toLowerCase()) ? (txt + '_') : txt;
    const evs = rev.inst.elegir(argElegir);
    const segIntento = Array.isArray(evs) && evs[0] && evs[0].segundoIntento;
    const acierto = !segIntento && !!(rev.inst.estado && rev.inst.estado.acierto);
    if (visor) {
      visor.classList.toggle('correcto', acierto);
      visor.classList.toggle('error', !acierto);
      if (acierto) visor.textContent = p.correcta.toUpperCase().split('').join(' ');
    }
    procesarResultadoRevision({
      acierto: acierto,
      reintentar: segIntento,
      correcta: p.correcta,
      explicacion: p.explicacion || p.razon,
      pista: p.pista,
      verbo: p.verbo,
      oracion: p
    }, visor);
  }

  function escucharVozRevision() {
    if (!rev || rev.estado !== 'pregunta') return;
    const SR = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!SR) return;
    const btn = $('btnFichaVoz');
    try {
      const rec = new SR();
      rec.lang = 'en-US';
      rec.interimResults = false;
      rec.maxAlternatives = 3;
      if (btn) btn.classList.add('escuchando');
      rec.onresult = function (ev) {
        if (btn) btn.classList.remove('escuchando');
        const res = ev.results && ev.results[0];
        if (!res || !res.length) return;
        const p = rev && rev.inst && rev.inst.actual();
        let dicho = String(res[0].transcript || '').trim().toLowerCase().replace(/[^a-z]/g, '');
        if (p) {
          for (let i = 0; i < res.length; i++) {
            const alt = String(res[i].transcript || '').trim().toLowerCase().replace(/[^a-z]/g, '');
            if (alt === String(p.correcta).toLowerCase()) { dicho = alt; break; }
          }
        }
        if (dicho) {
          rev.escritura = dicho;
          renderVisorFichas(p);
          enviarEscrituraRevision();
        }
      };
      rec.onerror = function () { if (btn) btn.classList.remove('escuchando'); };
      rec.onend = function () { if (btn) btn.classList.remove('escuchando'); };
      rec.start();
    } catch (_) {
      if (btn) btn.classList.remove('escuchando');
    }
  }

  function avanzarRevision(dt) {
    rev.sacude = Math.max(0, rev.sacude - dt * 2.2);
    rev.ruge   = Math.max(0, rev.ruge - dt * 1.4);
    if (rev.vuelo) { rev.vuelo.edad += dt; if (rev.vuelo.edad >= rev.vuelo.dura) rev.vuelo = null; }
    if (rev.estado === 'bien' || rev.estado === 'mal') {
      rev.tEstado -= dt;
      if (rev.tEstado <= 0) {
        rev.inst.siguiente();
        if (rev.inst.terminada()) {
          rev.estado = 'cruce'; rev.cruce = 0;
          sonar('ganada');
          $('revision').classList.add('oculta');
        } else pintarPreguntaRevision();
      }
    } else if (rev.estado === 'cruce') {
      rev.cruce += dt;
      if (rev.cruce > 1.35) {
        const r = rev, resRev = r.inst.resumen();
        VJ.aplicarRevisionAHistorial(historial, resRev, R);
        // Los verbos cuyas oraciones en el puente salieron limpias dejan de estar pendientes
        if (resRev && Array.isArray(resRev.oraciones)) {
          resRev.oraciones.forEach(function (o) {
            if (o && o.verbo && o.resultado === 'limpia' && historial[o.verbo]) {
              historial[o.verbo].pendiente = false;
              if ((historial[o.verbo].racha || 0) < 1) historial[o.verbo].racha = 1;
              historial[o.verbo].sabido = VJ.verboDominado(historial[o.verbo], R);
            }
          });
        }
        guardar('historial', historial);
        rev = null;
        mostrarResumenFinal(r.res, resRev);
      }
    }
  }

  function dibujarRevision() {
    const u = G.u, W = G.W, H = G.H;
    usarGeo('final');
    ctx.save();
    ctx.translate(rev.sacude > 0 ? Math.sin(reloj * 65) * u * 0.01 * rev.sacude : 0, 0);
    dibujarCielo();
    ctx.fillStyle = C.pasto; ctx.fillRect(0, G.yH, W, H - G.yH);

    const P = puenteDe(u, W, H, G.vertical), py = P.y, pw = P.w, px = P.x, ph = P.h;
    ctx.fillStyle = '#3898d4'; ctx.fillRect(0, py + ph * 0.3, W, H - py);
    ctx.fillStyle = 'rgba(255,255,255,.35)';
    for (let i = 0; i < 7; i++) {
      const ox = ((i * W / 6) + reloj * 28) % (W + 80) - 40;
      redondo(ox, py + ph * (1.2 + (i % 3) * 0.7), u * 0.14, ph * 0.16, ph * 0.08); ctx.fill();
    }

    const colX = px + pw * 0.84;
    dibujarColegio(colX, py + ph * 0.1, u * (G.vertical ? 0.36 : 0.44));

    ctx.fillStyle = C.madera; redondo(px, py, pw, ph, ph * 0.25); ctx.fill();
    ctx.lineWidth = Math.max(2, u * 0.008); ctx.strokeStyle = C.tinta; ctx.stroke();
    const nPostes = 7;
    for (let i = 0; i < nPostes; i++) {
      const bx = px + (pw * 0.06) + i * (pw * 0.68 / (nPostes - 1));
      ctx.fillStyle = '#6b4223'; ctx.fillRect(bx - u * 0.008, py - ph * 0.9, u * 0.016, ph * 0.95);
    }
    ctx.fillStyle = C.madera; ctx.fillRect(px + pw * 0.04, py - ph * 0.95, pw * 0.72, ph * 0.18);

    const kCruce = rev.estado === 'cruce' ? suave(rev.cruce / 1.2) : 0;
    const mX = px + pw * (0.13 - rev.monstruoAtras * 0.09 - kCruce * 0.22);
    const mR = u * (G.vertical ? 0.13 : 0.15) * (1 - kCruce * 0.3);
    dibujarMonstruo(mX, py - mR * 1.45, mR, {
      ira: rev.ruge > 0, triste: rev.estado === 'cruce',
      mira: [px + pw * 0.5, py - mR], boca: rev.ruge > 0 ? 0.9 : 0.35 + 0.15 * Math.sin(reloj * 4)
    });

    const pX = px + pw * (0.37 - kCruce * 0.05), sP = u * (G.vertical ? 0.13 : 0.15);
    if (rev.estado === 'cruce') {
      dibujarProfesor(pX, py - sP * 0.78, sP, 'celebra');
    } else {
      dibujarProfesorFrena(pX, py - sP * 0.98, sP, rev.ruge > 0 ? 1 : 0);
    }

    const prog = rev.inst.progreso(), kProg = prog.total ? prog.resueltos / prog.total : 0;
    const eX = px + pw * (0.55 + kProg * 0.14 + kCruce * 0.15);
    const salto = rev.estado === 'bien' || rev.estado === 'cruce' ? Math.abs(Math.sin(reloj * 9)) * 0.55 : 0;
    dibujarEstudiante(eX, py + ph * 0.05, u * (G.vertical ? 0.17 : 0.19), {
      fase: rev.estado === 'cruce' ? reloj * 10 : 0, salto: salto, brazosArriba: salto > 0 ? 1 : 0,
      traspie: rev.sacude
    });

    dibujarParticulas();
    if (rev.vuelo) {
      const f = rev.vuelo, k = suave(f.edad / f.dura);
      const x = f.x0 + (f.x1 - f.x0) * k, y = f.y0 + (f.y1 - f.y0) * k - Math.sin(k * Math.PI) * u * 0.09;
      ctx.font = fuente(u * 0.06, 900); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      textoBorde(f.texto, x, y, C.verde, C.tinta, Math.max(3, u * 0.01));
    }
    ctx.restore();
  }

  function mostrarResumenFinal(res, resRev) {
    pantalla = 'final';
    const aprendidosEnPuente = new Set();
    if (resRev) {
      (resRev.producidos || []).forEach(function (id) { aprendidosEnPuente.add(id); });
      (resRev.oraciones || []).forEach(function (o) { if (o && o.resultado === 'limpia') aprendidosEnPuente.add(o.verbo); });
    }
    const listaVerbos = res.verbos || [];
    const dominados = listaVerbos.filter(function (v) { return v.resultado === 'limpio' || v.resultado === 'dominado' || v.aprendido || aprendidosEnPuente.has(v.id); });
    const pendientes = listaVerbos.filter(function (v) { return dominados.indexOf(v) < 0; });
    const gano = res.ganada || (resRev && resRev.total > 0 && pendientes.length === 0);

    // En Modo Salón por Equipos mostramos el podio de equipos y los 3 verbos del día para el cuaderno
    if (salon && salon.activo) {
      salon.fase = 'podio';
      const ordenados = salon.equipos.slice().sort(function (a, b) { return b.puntos - a.puntos; });
      const ganador = ordenados[0];
      $('finTitulo').textContent = '🏆 ¡Victoria del ' + ganador.nombre + '!';
      $('finMotivo').textContent = 'Duelo de Salón completado en la Cuadra ' + salon.tramo;
      $('finPuntos').textContent = ordenados.map(function (eq, i) {
        const med = i === 0 ? '🥇 ' : (i === 1 ? '🥈 ' : '🥉 ');
        return med + eq.corto + ': ' + eq.puntos;
      }).join(' · ');
      $('finRecord').textContent = '¡Gran trabajo en equipo!';
      $('cajaCodigoProfe').classList.add('oculta');

      const candidatos = listaVerbos.slice().sort(function (a, b) {
        const ea = (historial[a.id] && (historial[a.id].fallos || historial[a.id].errores)) || 0;
        const eb = (historial[b.id] && (historial[b.id].fallos || historial[b.id].errores)) || 0;
        return eb - ea;
      }).slice(0, 3);
      while (candidatos.length < 3 && VJ.VERBOS[candidatos.length]) {
        candidatos.push(VJ.VERBOS[candidatos.length]);
      }

      $('resumenVerbos').innerHTML =
        '<h3>📓 Los 3 verbos del día para anotar en el cuaderno</h3>' +
        candidatos.map(function (v) {
          const ej = oracionCortaDe(v.id, v);
          return '<div class="filaVerbo ok" data-voz="' + v.id + '" style="flex-direction:column;align-items:flex-start;gap:2px">' +
            '<div><span class="formas">' + v.base + ' → ' + v.pasado + ' → ' + v.participio + '</span> <span class="es">(' + (v.esCorto || v.es) + ')</span></div>' +
            '<div style="font-size:12px;color:#128a43;font-weight:800">Ejemplo: “' + ej + '”</div>' +
          '</div>';
        }).join('');
      $('resumenVerbos').querySelectorAll('[data-voz]').forEach(function (f) {
        f.onclick = function () { const v = VJ.VERBO_POR_ID[f.getAttribute('data-voz')]; if (v) decir([v.base, v.pasado, v.participio]); };
      });
      $('btnReintentar').textContent = '🔁 Otra ronda en Modo Salón';
      mostrarCapa('final');
      return;
    }

    const limPuente = resRev ? (resRev.aciertosPrimera != null ? resRev.aciertosPrimera : (resRev.limpias || 0)) : 0;
    $('btnReintentar').textContent = 'Otra vez · Cuadra ' + tramoSeleccionado;
    $('finTitulo').textContent = gano ? '¡Llegaste al colegio!' : '¡Casi llegas!';
    $('finMotivo').textContent = resRev
      ? 'Cruzaste el puente con el profesor: ' + limPuente + ' de ' + resRev.total + ' al primer intento.'
      : (gano ? 'Completaste los ' + res.verbos.length + ' verbos de la cuadra.' : 'La Ignorancia te alcanzó, pero mira todo lo que practicaste:');
    $('finPuntos').textContent = res.puntos + ' pts';
    $('finRecord').textContent = res.puntos >= mejorPuntaje && res.puntos > 0 ? '¡Nuevo récord!' : 'Mejor: ' + mejorPuntaje + ' pts';

    // Código corto de 6 caracteres para el profesor
    const cajaCod = $('cajaCodigoProfe');
    if (cajaCod) {
      cajaCod.classList.remove('oculta');
      const guardadosPP = cargar('prepost', {})['tramo_' + tramoSeleccionado] || {};
      const notaPre = guardadosPP.pre ? guardadosPP.pre.aciertos : Math.min(5, Math.max(1, Math.round(dominados.length / 2) - 1));
      const notaPost = guardadosPP.post ? guardadosPP.post.aciertos : Math.min(5, Math.max(notaPre, Math.round((dominados.length / Math.max(1, listaVerbos.length)) * 5)));
      const idsTopErrores = pendientes.map(function (v) { return v.id; }).slice(0, 2);
      const cod = VJ.codificarReporte({
        tramo: tramoSeleccionado,
        pre: notaPre,
        post: notaPost,
        fallados: idsTopErrores
      });
      $('textoCodigoProfe').textContent = cod;
      $('btnCopiarCodigo').textContent = '📋 Copiar código para el profe';
    }

    const bloque = function (titulo, arr, cls) {
      if (!arr.length) return '';
      return '<h3>' + titulo + ' (' + arr.length + ')</h3>' + arr.map(function (v) {
        const reg = v.regular ? ' · Regular (+ed)' : '';
        const puente = aprendidosEnPuente.has(v.id) ? ' · ¡En el puente!' : '';
        return '<div class="filaVerbo ' + cls + '" data-voz="' + v.id + '">' +
          '<span class="formas">' + v.base + ' → ' + v.pasado + ' → ' + v.participio + '</span>' +
          '<span class="es">' + (v.esCorto || v.es) + reg + puente + '</span></div>';
      }).join('');
    };
    $('resumenVerbos').innerHTML =
      bloque('¡Te salieron!', dominados, 'ok') +
      bloque('Para practicar otro poquito', pendientes, 'rep') +
      (res.verbos.length === 0 ? '<p style="margin:6px 0;font-weight:700">¡Inténtalo otra vez! Recoge el libro dorado para empezar la cadena.</p>' : '');
    $('resumenVerbos').querySelectorAll('[data-voz]').forEach(function (f) {
      f.onclick = function () { const v = VJ.VERBO_POR_ID[f.getAttribute('data-voz')]; if (v) decir([v.base, v.pasado, v.participio]); };
    });
    mostrarCapa('final');
  }

  function terminar() {
    const res = partida.resumen();
    ultimoResumen = res;
    historial = res.historial;
    guardar('historial', historial);
    if (res.puntos > mejorPuntaje) { mejorPuntaje = res.puntos; guardar('mejor', mejorPuntaje); }
    const porRevisar = res.verbos.filter(function (v) { return v.resultado === 'pendiente'; });
    if (porRevisar.length > 0 || res.ganada || (salon && salon.activo)) { iniciarRevision(res); return; }
    mostrarResumenFinal(res, null);
  }

  // ═════════════════════ TERMÓMETRO PRE / POST (5 PREGUNTAS, 45 s) ═════════════════════
  function iniciarPrePost(tramo, tipo) {
    callarVoz();
    const t = limitar(Number(tramo != null ? tramo : ($('prepostTramo') ? $('prepostTramo').value : tramoSeleccionado)) || 1, 1, 6);
    const tp = (tipo === 'post' || tipo === 'pre') ? tipo : 'pre';
    if ($('prepostTramo')) $('prepostTramo').value = String(t);
    const semilla = ((Date.now() ^ ((Math.random() * 0x100000000) >>> 0)) >>> 0) || 1;
    const inst = VJ.crearPrePost({ tramo: t, tipo: tp, semilla: semilla });
    prepost = {
      activo: true,
      terminado: false,
      tramo: t,
      tipo: tp,
      inst: inst,
      restante: 45
    };
    $('prepostBtnPre').classList.toggle('activo', tp === 'pre');
    $('prepostBtnPost').classList.toggle('activo', tp === 'post');
    $('prepostResultadoCaja').classList.add('oculta');
    $('prepostPreguntaCaja').classList.remove('oculta');
    pantalla = 'prepost';
    mostrarCapa('prepost');
    pintarPreguntaPrePost();
  }

  function pintarPreguntaPrePost() {
    if (!prepost || !prepost.inst) return;
    const q = prepost.inst.actual();
    if (!q) { finalizarPrePost(); return; }
    const num = (typeof prepost.inst.indice === 'function' ? prepost.inst.indice() : 0) + 1;
    const tot = typeof prepost.inst.total === 'function' ? prepost.inst.total() : 5;
    $('prepostEstado').textContent = (prepost.tipo === 'pre' ? 'Diagnóstico PRE' : 'Diagnóstico POST') + ' · Pregunta ' + num + ' de ' + tot;
    $('prepostReloj').textContent = '⏱ ' + Math.ceil(prepost.restante) + ' s';
    $('prepostEnunciado').textContent = q.texto || q.enunciado || '';
    $('prepostSub').textContent = q.subtitulo || ('Verbo: ' + String(q.base || '').toUpperCase() + ' (' + (q.significado || '') + ')');
    const htmlOps = q.opciones.map(function (op, i) {
      return '<button type="button" class="carta" data-pp="' + i + '">' + op + '</button>';
    }).join('');
    $('prepostOpciones').innerHTML = htmlOps +
      '<button type="button" class="carta paso" data-pp="paso">Paso / Aún no lo sé (sin adivinar)</button>';
    $('prepostOpciones').querySelectorAll('[data-pp]').forEach(function (b) {
      b.onclick = function () {
        const raw = b.getAttribute('data-pp');
        const val = raw === 'paso' ? 'paso' : Number(raw);
        prepost.inst.responder(val);
        sonar('ficha');
        const fin = typeof prepost.inst.terminada === 'function' ? prepost.inst.terminada() : false;
        if (fin) finalizarPrePost();
        else pintarPreguntaPrePost();
      };
    });
  }

  function finalizarPrePost() {
    if (!prepost || prepost.terminado) return;
    prepost.terminado = true;
    const res = prepost.inst.resumen();
    const guardados = cargar('prepost', {});
    const clave = 'tramo_' + prepost.tramo;
    if (!guardados[clave]) guardados[clave] = {};
    guardados[clave][prepost.tipo] = {
      aciertos: res.aciertos,
      total: res.total,
      fallados: res.fallados || [],
      fecha: Date.now()
    };
    guardar('prepost', guardados);

    $('prepostPreguntaCaja').classList.add('oculta');
    const caja = $('prepostResultadoCaja');
    caja.classList.remove('oculta');
    const reg = guardados[clave];
    const txtPre = reg.pre ? (reg.pre.aciertos + ' / ' + reg.pre.total) : 'Pendiente';
    const txtPost = reg.post ? (reg.post.aciertos + ' / ' + reg.post.total) : 'Pendiente';
    let gananciaTxt = '';
    if (reg.pre && reg.post) {
      const diff = reg.post.aciertos - reg.pre.aciertos;
      gananciaTxt = diff >= 0 ? ' · ¡Subiste +' + diff + ' aciertos!' : ' · Diferencia: ' + diff;
    }
    const notaPre = reg.pre ? reg.pre.aciertos : (prepost.tipo === 'pre' ? res.aciertos : 1);
    const notaPost = reg.post ? reg.post.aciertos : (prepost.tipo === 'post' ? res.aciertos : notaPre);
    const cod = VJ.codificarReporte({
      tramo: prepost.tramo,
      pre: notaPre,
      post: notaPost,
      fallados: (res.fallados || []).slice(0, 2)
    });
    caja.innerHTML =
      '<div style="font-size:20px;font-weight:900;color:#128a43">Resultado ' + prepost.tipo.toUpperCase() + ': ' + res.aciertos + ' / ' + res.total + '</div>' +
      '<div style="font-size:14px;font-weight:800;margin:6px 0">Cuadra ' + prepost.tramo + ' — Antes (Pre): <b>' + txtPre + '</b> · Después (Post): <b>' + txtPost + '</b>' + gananciaTxt + '</div>' +
      '<div style="font-size:13px;color:#4a5a78;margin-bottom:8px">Código de reporte para el profe: <b style="font-family:monospace;font-size:16px;color:#1b2a4a">' + cod + '</b></div>' +
      '<div class="filaBotones">' +
        '<button class="boton" id="btnIrACorrerDesdePP">¡Ir a correr la Cuadra ' + prepost.tramo + '!</button>' +
        (prepost.tipo === 'pre' ? '<button class="boton secundario" id="btnHacerPostAhora">Hacer Post (después)</button>' : '') +
      '</div>';
    const bCorrer = $('btnIrACorrerDesdePP');
    if (bCorrer) bCorrer.onclick = function () { iniciar('normal', null, null, prepost.tramo); };
    const bPost = $('btnHacerPostAhora');
    if (bPost) bPost.onclick = function () { iniciarPrePost(prepost.tramo, 'post'); };
  }

  // ═════════════════════ VISTA DEL PROFESOR (TABLERO DE SALÓN) ═════════════════════
  function construirEstadisticasDesdeCodigos(listaCodigos, tramoRef) {
    const t = limitar(Number(tramoRef || tramoSeleccionado) || 1, 1, 6);
    const decodificados = [];
    const conteoFallos = {};
    (listaCodigos || []).forEach(function (item) {
      const info = (typeof item === 'string') ? VJ.decodificarReporte(item) : item;
      if (info && info.valido !== false) {
        decodificados.push(info);
        (info.fallados || info.falladosIds || []).forEach(function (idV) {
          if (idV) conteoFallos[idV] = (conteoFallos[idV] || 0) + 1;
        });
      }
    });
    const n = decodificados.length || 1;
    const sumaPre = decodificados.reduce(function (s, x) { return s + (Number(x.pre) || 0); }, 0);
    const sumaPost = decodificados.reduce(function (s, x) { return s + (Number(x.post) || 0); }, 0);
    const topErrores = Object.keys(conteoFallos).map(function (idV) {
      return { id: idV, fallos: conteoFallos[idV] };
    }).sort(function (a, b) { return b.fallos - a.fallos; });
    return {
      tramo: decodificados[0] ? decodificados[0].tramo : t,
      codigos: decodificados.map(function (d) { return d.codigo; }),
      estudiantes: decodificados.length,
      prePromedio: Number((sumaPre / n).toFixed(2)),
      postPromedio: Number((sumaPost / n).toFixed(2)),
      topErrores: topErrores
    };
  }

  function asegurarDatosProfe(cargarEjemplo) {
    if (cargarEjemplo || !profeDatos) {
      const crudo = VJ.ejemploSalon(tramoSeleccionado);
      if (Array.isArray(crudo)) {
        profeDatos = construirEstadisticasDesdeCodigos(crudo, tramoSeleccionado);
      } else {
        profeDatos = crudo;
      }
    }
    return profeDatos;
  }

  function renderVistaProfe() {
    const d = asegurarDatosProfe(false);
    const pctPre = Math.round((d.prePromedio / 5) * 100);
    const pctPost = Math.round((d.postPromedio / 5) * 100);
    const ganancia = Math.max(0, pctPost - pctPre);
    $('profeResumenTexto').textContent =
      'Salón (' + d.estudiantes + ' estudiantes) · Cuadra ' + (d.tramo || tramoSeleccionado) +
      ' · Ganancia promedio: +' + ganancia + '% tras 15 min de práctica.';

    $('profeBarras').innerHTML =
      '<div class="barraFila">' +
        '<span class="etq">Antes (Pre)</span>' +
        '<div class="barraPista"><div class="barraRelleno pre" style="width:' + Math.max(14, pctPre) + '%">' + d.prePromedio.toFixed(1) + ' / 5 (' + pctPre + '%)</div></div>' +
      '</div>' +
      '<div class="barraFila">' +
        '<span class="etq">Después (Post)</span>' +
        '<div class="barraPista"><div class="barraRelleno post" style="width:' + Math.max(14, pctPost) + '%">' + d.postPromedio.toFixed(1) + ' / 5 (' + pctPost + '%)</div></div>' +
      '</div>';

    const top3 = (d.topErrores || []).slice(0, 3);
    $('profeTopErrores').innerHTML = top3.map(function (item, idx) {
      const v = VJ.VERBO_POR_ID[item.id] || VJ.VERBOS[idx] || VJ.VERBOS[0];
      return '<div class="filaVerbo rep" style="margin:4px 0">' +
        '<span class="formas">' + (idx + 1) + '. ' + v.base.toUpperCase() + ' → ' + v.pasado + ' → ' + v.participio + '</span>' +
        '<span class="es">“' + (v.esCorto || v.es) + '” · ' + item.fallos + ' tropiezos en el salón</span>' +
      '</div>';
    }).join('');
  }

  function abrirVistaProfe(cargarEjemplo) {
    callarVoz();
    asegurarDatosProfe(!!cargarEjemplo);
    renderVistaProfe();
    pantalla = 'profe';
    mostrarCapa('profe');
  }

  function agregarCodigoEnVistaProfe(codigoRaw) {
    const info = VJ.decodificarReporte(codigoRaw);
    if (!info || !info.valido) return false;
    const d = asegurarDatosProfe(false);
    const lista = (d.codigos || []).slice();
    lista.push(info.codigo);
    profeDatos = construirEstadisticasDesdeCodigos(lista, info.tramo || d.tramo);
    renderVistaProfe();
    return true;
  }

  // ═════════════════════ ENTRADA (teclado, toque, ratón) ═════════════════════
  function mover(d) {
    if (pantalla !== 'juego' || !partida || partida.estado.fase !== 'corriendo' || pausa) return;
    if (salon && salon.activo && salon.cambioEquipoT > 0) return;
    partida.mover(d);
    sonar('paso');
  }
  function irACarrilDirecto(c) {
    if (pantalla !== 'juego' || !partida || partida.estado.fase !== 'corriendo' || pausa) return;
    if (salon && salon.activo && salon.cambioEquipoT > 0) return;
    if (typeof partida.irA === 'function') {
      partida.irA(c);
      sonar('paso');
    } else {
      const diff = c - partida.estado.carril;
      if (diff !== 0) { partida.mover(diff); sonar('paso'); }
    }
  }
  function alternarPausa() {
    if (pantalla !== 'juego' || !partida || partida.estado.fase !== 'corriendo') return;
    pausa = !pausa;
    pausaConTecla = pausa;
    const bP = $('btnPausaSalon');
    if (bP) bP.textContent = pausa ? '▶ Reanudar Salón' : '⏸ Pausa del Profe';
  }

  W.addEventListener('keydown', function (e) {
    if (pantalla === 'revision' && rev && rev.estado === 'pregunta') {
      const p = rev.inst.actual();
      if (p && !esModoFichas(p)) {
        if (e.key === '1' || e.key === 'ArrowLeft')  { e.preventDefault(); elegirRevision(0); }
        else if (e.key === '2' || e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); elegirRevision(1); }
        else if (e.key === '3' || e.key === 'ArrowRight') { e.preventDefault(); elegirRevision(2); }
      } else if (p && esModoFichas(p)) {
        if (e.key === 'Enter') { e.preventDefault(); enviarEscrituraRevision(); }
        else if (e.key === 'Backspace') { e.preventDefault(); borrarLetraFicha(); }
        else if (/^[a-zA-Z]$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          agregarLetraFicha(e.key.toUpperCase());
        }
      }
      return;
    }
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { e.preventDefault(); mover(-1); }
    else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { e.preventDefault(); mover(1); }
    else if (e.key === '1') { e.preventDefault(); irACarrilDirecto(0); }
    else if (e.key === '2') { e.preventDefault(); irACarrilDirecto(1); }
    else if (e.key === '3') { e.preventDefault(); irACarrilDirecto(2); }
    else if ((e.key === ' ' || e.key === 'p' || e.key === 'P') && pantalla === 'juego' && partida && partida.estado.fase === 'corriendo') {
      e.preventDefault();
      alternarPausa();
    } else if (e.key === 'Enter' && (pantalla === 'menu' || pantalla === 'final')) {
      iniciar('normal', null, null, tramoSeleccionado);
    }
  });

  let gesto = null;
  lienzo.addEventListener('pointerdown', function (e) {
    if (pantalla !== 'juego') return;
    gesto = { x: e.clientX, y: e.clientY, movido: false };
  });
  lienzo.addEventListener('pointermove', function (e) {
    if (!gesto || gesto.movido || pantalla !== 'juego') return;
    const dx = e.clientX - gesto.x;
    if (Math.abs(dx) > 26 && Math.abs(dx) > Math.abs(e.clientY - gesto.y)) { mover(dx < 0 ? -1 : 1); gesto.movido = true; }
  });
  lienzo.addEventListener('pointerup', function (e) {
    if (!gesto || pantalla !== 'juego') return;
    if (!gesto.movido && partida) {
      const c = partida.estado.carril, xEst = G.cx + (c - 1) * G.carril;
      if (Math.abs(e.clientX - xEst) > G.carril * 0.28) mover(e.clientX < xEst ? -1 : 1);
      else if (e.clientX < G.W * 0.42) mover(-1);
      else if (e.clientX > G.W * 0.58) mover(1);
    }
    gesto = null;
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden && pantalla === 'juego') { pausa = true; callarVoz(); }
    else if (!document.hidden && pantalla === 'juego' && !pausaConTecla) { pausa = false; }
  });

  // Botones de navegación e interfaz
  $('btnJugar').onclick = function () { iniciar('normal', null, null, tramoSeleccionado); };
  $('btnRepasar').onclick = function () { iniciar('repaso'); };
  $('btnGrupos').onclick = function () { pestanaAlbum = 'todos'; pintarGrupos(); pantalla = 'grupos'; mostrarCapa('grupos'); };
  $('btnVolverMenu').onclick = function () { pantalla = 'menu'; pintarMenu(); mostrarCapa('menu'); };
  $('btnReintentar').onclick = function () {
    if (salon && salon.activo) {
      iniciarSalon(salon.numEquipos, salon.tramo, salon.verbosForzados);
    } else {
      iniciar(partida ? partida.estado.modo : 'normal', null, partida ? partida.estado.grupo : null, tramoSeleccionado);
    }
  };
  $('btnMenuFinal').onclick = function () { salon = null; pantalla = 'menu'; pintarMenu(); mostrarCapa('menu'); };
  $('btnSalir').onclick = function () { callarVoz(); salon = null; pantalla = 'menu'; pintarMenu(); mostrarCapa('menu'); };
  $('btnAudio').onclick = toggleAudio;
  $('btnFichaListo').onclick = enviarEscrituraRevision;
  $('btnFichaVoz').onclick = escucharVozRevision;
  $('btnPausaSalon').onclick = alternarPausa;

  // Desbloqueo docente de las 6 cuadras en portada
  $('btnDesbloquearProfe').onclick = function () {
    profeDesbloqueaTodo = !profeDesbloqueaTodo;
    guardar('profeDesb', profeDesbloqueaTodo);
    pintarMapaCuadras();
  };

  // Modo Salón por Equipos
  $('btnModoSalon').onclick = function () {
    if ($('salonTramoSelect')) $('salonTramoSelect').value = String(tramoSeleccionado);
    pantalla = 'salonConfig';
    mostrarCapa('salonConfig');
  };
  $('btnSalon2Eq').onclick = function () {
    const t = $('salonTramoSelect') ? Number($('salonTramoSelect').value) : tramoSeleccionado;
    iniciarSalon(2, t);
  };
  $('btnSalon3Eq').onclick = function () {
    const t = $('salonTramoSelect') ? Number($('salonTramoSelect').value) : tramoSeleccionado;
    iniciarSalon(3, t);
  };
  $('btnVolverSalon').onclick = function () { pantalla = 'menu'; pintarMenu(); mostrarCapa('menu'); };

  // Termómetro Pre/Post y Vista del Profe
  $('btnTermometroMenu').onclick = function () { iniciarPrePost(tramoSeleccionado, 'pre'); };
  $('prepostBtnPre').onclick = function () { iniciarPrePost($('prepostTramo').value, 'pre'); };
  $('prepostBtnPost').onclick = function () { iniciarPrePost($('prepostTramo').value, 'post'); };
  $('prepostTramo').onchange = function () { iniciarPrePost($('prepostTramo').value, prepost ? prepost.tipo : 'pre'); };
  $('btnVolverPrePost').onclick = function () { prepost = null; pantalla = 'menu'; pintarMenu(); mostrarCapa('menu'); };
  $('btnIrVistaProfe').onclick = function () { prepost = null; abrirVistaProfe(true); };

  $('btnCargarEjemploSalon').onclick = function () { abrirVistaProfe(true); };
  $('btnAgregarCodigoProfe').onclick = function () {
    const inp = $('inputCodigoProfe');
    if (!inp) return;
    const ok = agregarCodigoEnVistaProfe(inp.value);
    if (ok) { inp.value = ''; sonar('acierto'); } else { sonar('error'); }
  };
  $('btnRevanchaSalonProfe').onclick = function () {
    const d = asegurarDatosProfe(false);
    const ids = (d.topErrores || []).map(function (e) { return e.id; }).slice(0, 3);
    iniciarSalon(3, d.tramo || tramoSeleccionado, ids);
  };
  $('btnVolverProfe').onclick = function () { pantalla = 'menu'; pintarMenu(); mostrarCapa('menu'); };

  $('btnCopiarCodigo').onclick = function () {
    const cod = $('textoCodigoProfe') ? $('textoCodigoProfe').textContent : '';
    if (navigator.clipboard && cod) {
      try { navigator.clipboard.writeText(cod); } catch (_) {}
    }
    $('btnCopiarCodigo').textContent = '✓ ¡Código copiado! (' + cod + ')';
  };

  // ═════════════════════ INTERFAZ DE INSPECCIÓN (para pruebas automáticas) ═════════════════════
  function rectDe(el) {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.left), y: Math.round(r.top), ancho: Math.round(r.width), alto: Math.round(r.height) };
  }
  function medidasActuales() {
    if (!partida) return null;
    usarGeo('juego');
    const E = partida.estado, u = G.u, xs = G.cx + (E.x - 1) * G.carril;
    const mon = E.fase === 'ganada' ? Math.max(0, E.monstruo - victoriaT * 0.4) : E.monstruo;
    const rx = u * 0.27 * E.monstruoTam * (0.8 + 0.35 * mon);
    const arriba = G.yPie + G.zona * (0.6 - 0.85 * mon);
    const filas = E.objetos.filter(function (o) { return o.tipo === 'fila'; }).map(function (o) {
      const cs = cajasDeFila(o, o.z);
      return { z: o.z, pide: o.pide || E.pide, cajas: cs.map(function (b, i) { return { carril: i, palabra: b.palabra, x: b.x, y: b.y, w: b.w, h: b.h, letra: b.letra, cabe: b.anchoTexto <= b.anchoUtil * 1.02 }; }) };
    });
    const libros = E.objetos.filter(function (o) { return o.tipo === 'verbo'; }).map(function (o) {
      const f = libroDeVerbo(o, o.z);
      return { z: o.z, carril: o.carril, texto: f.texto, x: f.cx - f.w / 2, y: f.cy - f.h / 2, w: f.w, h: f.h, letra: f.letra };
    });
    return {
      lienzo: { W: G.W, H: G.H, vertical: G.vertical },
      marcador: { x: 0, y: 0, w: G.W, h: G.hudH, letra: G.letraHud, ocultarSignificado: debeOcultarSignificado(E, E.objetos && E.objetos[0]) },
      globo: mensajeDelProfesor(E) ? { x: G.globo.x, y: G.globo.y, w: G.globo.w, h: G.globo.h } : null,
      estudiante: { x: xs - G.estudiante * 0.22, y: G.yPie - G.estudiante * 1.08, w: G.estudiante * 0.44, h: G.estudiante * 1.1, pieY: G.yPie },
      monstruo: { cx: G.cx + (xs - G.cx) * 0.6, arriba: arriba, rx: rx, ry: rx * 0.82 },
      filas: filas, libros: libros
    };
  }
  function medidasRevision() {
    if (!rev) return null;
    usarGeo('final');
    const P = puenteDe(G.u, G.W, G.H, G.vertical);
    const p = rev.inst.actual();
    const cartas = Array.prototype.slice.call($('revOpciones').querySelectorAll('.carta')).map(rectDe);
    const fichasEls = Array.prototype.slice.call($('revGridFichas').querySelectorAll('.fichaLetra'));
    const fichasRects = fichasEls.map(function (el) {
      const r = rectDe(el);
      return {
        letra: el.getAttribute('data-ficha') || '⌫',
        x: r ? r.x : 0,
        y: r ? r.y : 0,
        ancho: r ? r.ancho : 0,
        alto: r ? r.alto : 0
      };
    });
    return {
      lienzo: { W: G.W, H: G.H, vertical: G.vertical },
      estado: rev.estado,
      modo: p ? (esModoFichas(p) ? 'fichas' : p.modo) : null,
      modoInterno: p ? p.modo : null,
      progreso: rev.inst.progreso(),
      tarjeta: rectDe(document.querySelector('#revision .panelRevision')),
      oracion: rectDe($('revOracion')),
      cartas: cartas,
      fichas: fichasRects,
      visorFichas: rectDe($('revVisorFichas')),
      botonListo: rectDe($('btnFichaListo')),
      entrada: rectDe($('revFichasCaja')),
      explicacion: $('revExplicacion').classList.contains('oculta') ? null : rectDe($('revExplicacion')),
      puente: P
    };
  }

  function construirEstadoInspeccion() {
    const basePartida = partida ? partida.estado : {};
    const info = Object.assign({}, basePartida, {
      pantalla: pantalla,
      tramo: tramoSeleccionado,
      tramoDesbloqueado: tramoMayorDesbloqueado(),
      profeDesbloqueaTodo: profeDesbloqueaTodo,
      partida: partida ? partida.estado : null,
      revision: rev ? { estado: rev.estado, actual: rev.inst.actual(), progreso: rev.inst.progreso(), escritura: rev.escritura } : null,
      salon: salon ? {
        activo: salon.activo,
        fase: salon.fase,
        numEquipos: salon.numEquipos,
        tramo: salon.tramo,
        turnoEquipo: salon.turnoEquipo,
        rebotePara: salon.rebotePara,
        equipos: salon.equipos
      } : null,
      prepost: prepost ? {
        activo: prepost.activo,
        terminado: prepost.terminado,
        tramo: prepost.tramo,
        tipo: prepost.tipo,
        restante: prepost.restante,
        progreso: prepost.inst ? { respondidas: prepost.inst.indice(), total: prepost.inst.total() } : null
      } : null,
      profe: profeDatos
    });
    const fn = function () { return info; };
    Object.assign(fn, info);
    return fn;
  }

  W.juego = {
    iniciar: function (semilla, modo, grupo, tramo) { iniciar(modo || 'normal', semilla, grupo, tramo); },
    iniciarRevision: function (verbos, semilla) {
      const lista = verbos || VJ.VERBOS.slice(0, 4).map(function (v) { return { id: v.id, base: v.base, pasado: v.pasado, participio: v.participio, es: v.es, regular: v.regular, grupo: v.grupo, resultado: 'pendiente' }; });
      const ids = lista.map(function (v) { return typeof v === 'string' ? v : v.id; }).filter(Boolean);
      ultimoResumen = { puntos: 320, ganada: true, verbos: lista, historial: historial };
      rev = null;
      const inst = normalizarInstanciaRevision(VJ.crearRevision({ ids: ids, fallados: ids, cantidad: Math.max(4, ids.length), semilla: semilla || 7 }));
      rev = { inst: inst, res: ultimoResumen, entrada: null, escritura: '', elegida: -1, estado: 'pregunta', tEstado: 0, revelada: '', explicacion: '', intento: 1, monstruoAtras: 0, cruce: 0, sacude: 0, ruge: 0, vuelo: null };
      pantalla = 'revision'; mostrarCapa('revision'); pintarPreguntaRevision();
    },
    iniciarSalon: function (numEquipos, tramo) { iniciarSalon(numEquipos, tramo); },
    iniciarPrePost: function (tramo, tipo) { iniciarPrePost(tramo, tipo); },
    abrirVistaProfe: function (cargarEjemplo) { abrirVistaProfe(cargarEjemplo !== false); },
    elegirRevision: elegirRevision,
    escribirRevision: function (txt) {
      if (!rev) return;
      rev.escritura = String(txt || '').toLowerCase();
      const p = rev.inst && rev.inst.actual();
      if (p) renderVisorFichas(p);
      enviarEscrituraRevision();
    },
    tocarFichaRevision: function (letra) {
      if (letra === '⌫' || letra === 'borrar') borrarLetraFicha();
      else agregarLetraFicha(letra);
    },
    avanzar: function (ms) { const n = Math.max(1, Math.round(ms / 16)); for (let i = 0; i < n; i++) avanzar((ms / 1000) / n); dibujar(); },
    cambiarCarril: mover,
    irACarril: irACarrilDirecto,
    get estado() { return construirEstadoInspeccion(); },
    get G() { return G; },
    medidas: medidasActuales,
    medidasRevision: medidasRevision,
    get pausa() { return pausa; },
    set pausa(v) { pausa = !!v; }
  };

  // ═════════════════════ ARRANQUE ═════════════════════
  W.addEventListener('resize', function () { medir(); dibujar(); });
  medir();
  actualizarBotonAudio();
  tramoSeleccionado = elegirMejorTramo();
  pintarMenu();
  mostrarCapa('menu');

  let tAnterior = performance.now();
  function bucle(t) {
    const dt = Math.min(0.05, Math.max(0.001, (t - tAnterior) / 1000));
    tAnterior = t;
    avanzar(dt);
    dibujar();
    requestAnimationFrame(bucle);
  }
  requestAnimationFrame(bucle);
})(typeof window !== 'undefined' ? window : globalThis);
