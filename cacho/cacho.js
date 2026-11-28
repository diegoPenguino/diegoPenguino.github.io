// Hoja de puntajes del cacho (Alalay). Todo vive en el navegador: el estado se guarda en localStorage.
(() => {
  'use strict';

  const CLAVE = 'cacho-hoja-v1';

  const CATS = {
    balas: { nombre: 'Balas', cara: 1 },
    tontos: { nombre: 'Tontos', cara: 2 },
    tricas: { nombre: 'Tricas', cara: 3 },
    cuadras: { nombre: 'Cuadras', cara: 4 },
    quinas: { nombre: 'Quinas', cara: 5 },
    senas: { nombre: 'Senas', cara: 6 },
    escalera: { nombre: 'Escalera', mano: 25, normal: 20 },
    full: { nombre: 'Full', mano: 35, normal: 30 },
    poker: { nombre: 'Póker', mano: 45, normal: 40 },
    grande1: { nombre: 'Grande', grande: 50 },
    grande2: { nombre: 'Grande', grande: 50 },
  };
  // Orden del gato, fila por fila: unos a treses a la izquierda, juegos al centro, cuatros a seises a la derecha.
  const GATO = ['balas', 'escalera', 'cuadras', 'tontos', 'full', 'quinas', 'tricas', 'poker', 'senas'];
  const TODAS = [...GATO, 'grande1', 'grande2'];

  const $ = (id) => document.getElementById(id);
  const elJugadores = $('jugadores');
  const elMarcador = $('marcador');
  const dlgElegir = $('elegir');
  const dlgFin = $('fin');

  // ---------- Estado ----------

  const nuevoId = () => Math.random().toString(36).slice(2, 10);
  const nuevoJugador = (nombre = '') => ({ id: nuevoId(), nombre, puntos: {} });
  const nuevoEstado = () => ({ jugadores: [nuevoJugador(), nuevoJugador()], turno: 0, historial: [], dormida: null });

  function cargar() {
    try {
      const e = JSON.parse(localStorage.getItem(CLAVE));
      if (e && Array.isArray(e.jugadores) && Array.isArray(e.historial)) return e;
    } catch (_) { /* sin almacenamiento: partida nueva */ }
    return null;
  }
  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (_) { /* modo privado o sin espacio */ }
  }

  let estado = cargar() || nuevoEstado();
  let recien = null; // casilla recién escrita, para animarla solo a ella

  const buscar = (pid) => estado.jugadores.find((j) => j.id === pid);
  const anotada = (j, c) => j.puntos[c] !== undefined && j.puntos[c] !== null;
  const total = (j) => TODAS.reduce((s, c) => s + (typeof j.puntos[c] === 'number' ? j.puntos[c] : 0), 0);
  const quedan = (j) => TODAS.filter((c) => !anotada(j, c)).length;
  const panzaDeOro = (j) => j.puntos.escalera === 25 && j.puntos.full === 35 && j.puntos.poker === 45
    && (j.puntos.grande1 === 50 || j.puntos.grande2 === 50);
  // Palitos (tiros malos). Salen de la hoja misma, así que deshacer o corregir los ajusta solos.
  // Propios: cada casilla tachada, cada juego del medio que no fue de mano y cada número con menos de 4 dados.
  // Por grandes ajenas: la primera grande de otro jugador da 2 palitos a cada uno de los demás; su segunda, 1.
  function palitosPropios(j) {
    let n = 0;
    for (const c of TODAS) {
      const v = j.puntos[c];
      const cat = CATS[c];
      if (v === 'x') n++;
      else if (typeof v === 'number') {
        if (cat.cara && v / cat.cara < 4) n++;
        if (cat.mano !== undefined && v !== cat.mano) n++;
      }
    }
    return n;
  }
  const grandesDe = (j) => (j.puntos.grande1 === 50 ? 1 : 0) + (j.puntos.grande2 === 50 ? 1 : 0);
  const palitosQueDa = (j) => { const g = grandesDe(j); return (g >= 1 ? 2 : 0) + (g >= 2 ? 1 : 0); };
  const palitos = (j) => palitosPropios(j)
    + estado.jugadores.reduce((s, o) => s + (o === j ? 0 : palitosQueDa(o)), 0);
  const nPalitos = (n) => `${n} palito${n === 1 ? '' : 's'}`;
  const nombreDe = (j) => j.nombre.trim() || `Jugador ${estado.jugadores.indexOf(j) + 1}`;

  // Quién ganó, o null si la partida sigue.
  function resultado() {
    const js = estado.jugadores;
    if (estado.dormida) {
      const j = buscar(estado.dormida);
      if (j) return { ganadores: [j], como: 'dormida' };
    }
    const panza = js.find(panzaDeOro);
    if (panza) return { ganadores: [panza], como: 'panza' };
    if (js.length && js.every((j) => quedan(j) === 0)) {
      const max = Math.max(...js.map(total));
      return { ganadores: js.filter((j) => total(j) === max), como: 'puntos' };
    }
    return null;
  }

  function avanzarTurno() {
    const n = estado.jugadores.length;
    for (let k = 1; k <= n; k++) {
      const i = (estado.turno + k) % n;
      if (quedan(estado.jugadores[i]) > 0) { estado.turno = i; return; }
    }
  }

  function registrar(entrada) {
    estado.historial.push(entrada);
    if (estado.historial.length > 300) estado.historial.shift();
  }

  function anotar(pid, cat, valor) {
    const j = buscar(pid);
    if (!j) return;
    const habiaFin = resultado();
    const antes = anotada(j, cat) ? j.puntos[cat] : null;
    registrar({ tipo: 'punto', pid, cat, antes, turno: estado.turno });
    if (valor === null) delete j.puntos[cat];
    else j.puntos[cat] = valor;
    const idx = estado.jugadores.indexOf(j);
    if (valor !== null && antes === null && idx === estado.turno) avanzarTurno();
    recien = valor === null ? null : `${pid}:${cat}`;
    cambio(habiaFin);
  }

  function dormida(pid) {
    const habiaFin = resultado();
    registrar({ tipo: 'dormida', antes: estado.dormida, turno: estado.turno });
    estado.dormida = pid;
    cambio(habiaFin);
  }

  function deshacer() {
    const e = estado.historial.pop();
    if (!e) return;
    if (e.tipo === 'punto') {
      const j = buscar(e.pid);
      if (j) {
        if (e.antes === null) delete j.puntos[e.cat];
        else j.puntos[e.cat] = e.antes;
      }
    } else if (e.tipo === 'dormida') {
      estado.dormida = e.antes;
    }
    estado.turno = Math.min(e.turno, Math.max(0, estado.jugadores.length - 1));
    recien = null;
    guardar();
    render();
  }

  function cambio(habiaFin) {
    guardar();
    render();
    const fin = resultado();
    if (fin && !habiaFin) mostrarFin(fin);
  }

  // ---------- Dibujo a mano ----------

  // Números pseudoaleatorios con semilla, para que las rayas de cada hoja no cambien al redibujar.
  function azar(texto) {
    let s = 2166136261;
    for (const ch of texto) s = Math.imul(s ^ ch.charCodeAt(0), 16777619) >>> 0;
    return () => {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }
  function trazo(x1, y1, x2, y2, r, temblor = 5) {
    const j = () => (r() - 0.5) * temblor;
    const mx = (x1 + x2) / 2 + j() * 1.4;
    const my = (y1 + y2) / 2 + j() * 1.4;
    return `<path d="M${(x1 + j()).toFixed(1)} ${(y1 + j()).toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${(x2 + j()).toFixed(1)} ${(y2 + j()).toFixed(1)}"/>`;
  }
  function rayasGato(id) {
    const r = azar(id);
    return trazo(100, 4, 101, 296, r) + trazo(200, 6, 199, 294, r)
      + trazo(5, 100, 296, 101, r) + trazo(4, 200, 295, 199, r);
  }
  function barraGrandes(id) {
    const r = azar(`${id}g`);
    return trazo(8, 92, 92, 8, r, 4);
  }
  function tachon(id) {
    const r = azar(id);
    return `<svg class="tachon" viewBox="0 0 100 100" aria-hidden="true">${trazo(10, 90, 90, 10, r, 8)}${trazo(12, 10, 88, 92, r, 8)}</svg>`;
  }
  // Palitos de 5 en 5: cuatro rayas y la quinta las cruza.
  function dibujoPalitos(n, id) {
    const r = azar(`${id}p`);
    let html = '';
    for (let g = 0; g * 5 < n; g++) {
      const enGrupo = Math.min(5, n - g * 5);
      let d = '';
      for (let k = 0; k < Math.min(4, enGrupo); k++) d += trazo(8 + k * 9, 6, 9 + k * 9, 34, r, 3);
      if (enGrupo === 5) d += trazo(2, 31, 44, 9, r, 3);
      html += `<svg viewBox="0 0 46 40" aria-hidden="true">${d}</svg>`;
    }
    return html;
  }

  // ---------- Vista ----------

  const escapar = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function etiqueta(cat) {
    const c = CATS[cat];
    if (c.cara) return `${c.nombre}<i>de ${c.cara}</i>`;
    return c.nombre;
  }

  function casilla(j, cat) {
    const v = j.puntos[cat];
    const c = CATS[cat];
    let contenido = '';
    let aria;
    if (v === 'x') {
      contenido = tachon(`${j.id}${cat}`);
      aria = `${c.nombre}: tachada`;
    } else if (typeof v === 'number') {
      const mano = c.mano !== undefined && v === c.mano;
      contenido = `<span class="val${mano ? ' mano' : ''}">${v}</span>`;
      aria = `${c.nombre}: ${v}${mano ? ', de mano' : ''}`;
    } else {
      aria = `${c.nombre}: vacía`;
    }
    const clases = ['casilla'];
    if (!anotada(j, cat)) clases.push('vacia');
    if (recien === `${j.id}:${cat}`) clases.push('recien');
    return `<button type="button" class="${clases.join(' ')}" data-cat="${cat}" aria-label="${escapar(`${aria}. ${nombreDe(j)}`)}">`
      + `<span class="etq">${etiqueta(cat)}</span>${contenido}</button>`;
  }

  function hojaJugador(j, i, fin) {
    const turno = !fin && i === estado.turno;
    const gano = fin && fin.ganadores.includes(j);
    const q = quedan(j);
    let sello = '';
    if (gano) sello = `<p class="sello">${fin.como === 'dormida' ? '¡Dormida!' : fin.como === 'panza' ? '¡Panza de oro!' : '¡Ganó!'}</p>`;
    return `<article class="jugador${turno ? ' turno' : ''}" data-pid="${j.id}">
      <div class="jug-cabeza">
        <input class="nombre" value="${escapar(j.nombre)}" placeholder="Jugador ${i + 1}" aria-label="Nombre del jugador ${i + 1}" maxlength="24" autocomplete="off" enterkeyhint="done">
        <span class="total">${total(j)}</span>
      </div>
      <div class="gato">
        ${GATO.map((c) => casilla(j, c)).join('')}
        <svg class="rayas" viewBox="0 0 300 300" preserveAspectRatio="none" aria-hidden="true">${rayasGato(j.id)}</svg>
      </div>
      <div class="grandes">
        ${casilla(j, 'grande1')}${casilla(j, 'grande2')}
        <svg class="barra" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${barraGrandes(j.id)}</svg>
      </div>
      <div class="palitos" aria-label="${nPalitos(palitos(j))}">
        <span class="palitos-etq">Palitos <b>${palitos(j)}</b></span>
        <span class="palitos-trazos">${dibujoPalitos(palitos(j), j.id)}</span>
      </div>
      ${sello}
      <div class="jug-pie">
        <span class="quedan">${q === 0 ? 'Hoja llena' : turno ? `Le toca · quedan ${q}` : `Quedan ${q}`}</span>
        <button type="button" class="enlace" data-accion="dormida">¿Dormida?</button>
        <button type="button" class="enlace peligro" data-accion="quitar">Quitar</button>
      </div>
    </article>`;
  }

  function renderMarcador() {
    const fin = resultado();
    const js = estado.jugadores;
    const max = js.length ? Math.max(...js.map(total)) : 0;
    let html = js.map((j, i) => {
      const turno = !fin && i === estado.turno;
      const lider = max > 0 && total(j) === max;
      return `<button type="button" class="ficha${turno ? ' turno' : ''}" data-pid="${j.id}" title="Ir a la hoja (y darle el turno)">`
        + `<span class="n">${escapar(nombreDe(j))}</span><span class="t">${total(j)}</span>${lider ? '<span class="estrella" aria-label="va ganando">★</span>' : ''}`
        + `${palitos(j) ? `<span class="p">${nPalitos(palitos(j))}</span>` : ''}</button>`;
    }).join('');
    if (fin) {
      const nombres = fin.ganadores.map(nombreDe).join(' y ');
      const como = fin.como === 'dormida' ? ' con dormida' : fin.como === 'panza' ? ' con panza de oro' : '';
      html += `<p class="aviso">${fin.ganadores.length > 1 ? `Empate: ${escapar(nombres)}` : `Ganó ${escapar(nombres)}${como}`}</p>`;
    }
    elMarcador.innerHTML = html;
  }

  function render() {
    const fin = resultado();
    elJugadores.innerHTML = estado.jugadores.map((j, i) => hojaJugador(j, i, fin)).join('');
    renderMarcador();
    $('deshacer').disabled = estado.historial.length === 0;
  }

  // ---------- Diálogos ----------

  let eligiendo = null;

  function abrirElegir(pid, cat) {
    const j = buscar(pid);
    const c = CATS[cat];
    const actual = j.puntos[cat];
    eligiendo = { pid, cat };
    $('elegir-quien').textContent = nombreDe(j);
    $('elegir-cat').textContent = c.cara ? `${c.nombre} (${c.cara})` : c.nombre;
    let opciones = [];
    if (c.cara) {
      opciones = [1, 2, 3, 4, 5].map((k) => [c.cara * k, `${k} dado${k > 1 ? 's' : ''}`]);
    } else if (c.mano) {
      opciones = [[c.mano, 'de mano'], [c.normal, 'normal']];
    } else {
      opciones = [[c.grande, 'cinco iguales']];
    }
    const elOpc = $('opciones');
    elOpc.className = `opciones${opciones.length <= 2 ? ' dos' : ''}`;
    elOpc.innerHTML = opciones.map(([v, cap]) => `<button class="opcion${actual === v ? ' actual' : ''}" value="${v}"><span class="num">${v}</span><span class="cap">${cap}</span></button>`).join('');
    $('tachar').hidden = actual === 'x';
    $('borrar').hidden = !anotada(j, cat);
    dlgElegir.returnValue = '';
    dlgElegir.showModal();
  }

  // Se actúa en el submit (síncrono, con el botón que se tocó) y no en close, que llega después.
  dlgElegir.querySelector('form').addEventListener('submit', (ev) => {
    const v = ev.submitter ? ev.submitter.value : '';
    const sel = eligiendo;
    eligiendo = null;
    if (!sel || v === '') return;
    if (v === 'x') anotar(sel.pid, sel.cat, 'x');
    else if (v === 'borrar') anotar(sel.pid, sel.cat, null);
    else anotar(sel.pid, sel.cat, Number(v));
  });

  function mostrarFin(fin) {
    const nombres = fin.ganadores.map(nombreDe);
    $('fin-titulo').textContent = fin.ganadores.length > 1 ? '¡Empate!' : `¡Ganó ${nombres[0]}!`;
    $('fin-como').textContent = fin.como === 'dormida' ? 'Sacó dormida: cinco iguales en el primer tiro.'
      : fin.como === 'panza' ? 'Panza de oro: escalera, full y póker de mano, y una grande.'
        : fin.ganadores.length > 1 ? `${nombres.join(' y ')} terminaron con ${total(fin.ganadores[0])}.`
          : `Con ${total(fin.ganadores[0])} puntos.`;
    const orden = [...estado.jugadores].sort((a, b) => total(b) - total(a));
    $('fin-ranking').innerHTML = orden.map((j) => `<li>${escapar(nombreDe(j))} · <b>${total(j)}</b> <small>${nPalitos(palitos(j))}</small></li>`).join('');
    dlgFin.returnValue = '';
    dlgFin.showModal();
  }

  dlgFin.querySelector('form').addEventListener('submit', (ev) => {
    if (ev.submitter && ev.submitter.value === 'nueva') nuevaPartida(false);
  });

  // Tocar fuera del papelito lo cierra sin hacer nada.
  for (const d of [dlgElegir, dlgFin]) {
    d.addEventListener('click', (ev) => { if (ev.target === d) d.close(''); });
  }

  // ---------- Acciones ----------

  function nuevaPartida(preguntar = true) {
    const hay = estado.jugadores.some((j) => quedan(j) < TODAS.length) || estado.dormida;
    if (preguntar && hay && !confirm('¿Empezar una partida nueva? Se borran los puntajes; los jugadores se quedan.')) return;
    estado = {
      jugadores: estado.jugadores.map((j) => ({ id: j.id, nombre: j.nombre, puntos: {} })),
      turno: 0,
      historial: [],
      dormida: null,
    };
    if (!estado.jugadores.length) estado.jugadores = [nuevoJugador(), nuevoJugador()];
    recien = null;
    guardar();
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function quitar(pid) {
    const j = buscar(pid);
    const i = estado.jugadores.indexOf(j);
    if (quedan(j) < TODAS.length && !confirm(`¿Quitar a ${nombreDe(j)} y sus puntos?`)) return;
    estado.jugadores.splice(i, 1);
    estado.historial = estado.historial.filter((e) => e.pid !== pid);
    if (estado.dormida === pid) estado.dormida = null;
    if (estado.turno > i || estado.turno >= estado.jugadores.length) estado.turno = Math.max(0, estado.turno - 1);
    guardar();
    render();
  }

  elJugadores.addEventListener('click', (ev) => {
    const hoja = ev.target.closest('.jugador');
    if (!hoja) return;
    const pid = hoja.dataset.pid;
    const cas = ev.target.closest('.casilla');
    if (cas) { abrirElegir(pid, cas.dataset.cat); return; }
    const acc = ev.target.closest('[data-accion]');
    if (!acc) return;
    if (acc.dataset.accion === 'quitar') quitar(pid);
    if (acc.dataset.accion === 'dormida') {
      const j = buscar(pid);
      if (estado.dormida === pid) return;
      if (confirm(`¿${nombreDe(j)} sacó dormida (cinco iguales en el primer tiro)? Gana el partido.`)) dormida(pid);
    }
  });

  elJugadores.addEventListener('input', (ev) => {
    if (!ev.target.classList.contains('nombre')) return;
    const j = buscar(ev.target.closest('.jugador').dataset.pid);
    j.nombre = ev.target.value;
    guardar();
    renderMarcador();
  });
  elJugadores.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' && ev.target.classList.contains('nombre')) ev.target.blur();
  });

  elMarcador.addEventListener('click', (ev) => {
    const f = ev.target.closest('.ficha');
    if (!f) return;
    const i = estado.jugadores.findIndex((j) => j.id === f.dataset.pid);
    if (i < 0) return;
    if (!resultado() && i !== estado.turno) {
      estado.turno = i;
      guardar();
      render();
    }
    const hoja = elJugadores.querySelector(`[data-pid="${f.dataset.pid}"]`);
    if (hoja) {
      const y = hoja.getBoundingClientRect().top + window.scrollY - elMarcador.offsetHeight - 8;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });

  $('agregar').addEventListener('click', () => {
    estado.jugadores.push(nuevoJugador());
    guardar();
    render();
    const inputs = elJugadores.querySelectorAll('.nombre');
    const ultimo = inputs[inputs.length - 1];
    ultimo.focus();
    ultimo.scrollIntoView({ block: 'center', behavior: 'smooth' });
  });
  $('deshacer').addEventListener('click', deshacer);
  $('nueva').addEventListener('click', () => nuevaPartida(true));

  render();
})();
