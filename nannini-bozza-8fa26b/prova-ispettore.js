/* ISPETTORE DI PROVA (20/11/2026) — solo per le anteprime, come le etichette verdi e il righello.
   Un pulsante «Ispeziona» in basso a sinistra. Acceso: tocchi qualsiasi pezzo della pagina e in basso compare un pannello con
   etichetta (es. 2i), testo, carattere (nome vero, peso, misura, interlinea, spaziatura), colore del testo e del fondo (codice
   e nome nel tema), misura del pezzo e altezza nella pagina in px (come il righello). Mentre è acceso i tocchi non aprono link
   e non fanno partire animazioni; si scorre normalmente. Toccando di nuovo «Ispeziona» si torna alla pagina normale.
   Da togliere: cancellare questo file e la riga <script src="prova-ispettore.js"></script>. Con ?etichette=0 non compare. */
(function () {
  'use strict';
  if (window.ISPETTORE) return;
  try { if (/(?:^|&)etichette=0(?:&|$)/.test(location.search.slice(1))) return; } catch (e) {}

  var NOMI_FONT = { 'system-ui': 'carattere di sistema (San Francisco su iPhone, Roboto su Android)', 'news': 'Newsreader', 'inter': 'Inter', 'geist mono': 'Geist Mono', 'geist': 'Geist', 'instrument serif': 'Instrument Serif' };
  /* i colori del tema (per dire «arancio Veniello» invece di un codice e basta) */
  var TEMA = [
    ['#151515', 1, 'testo (quasi nero)'], ['#5B5B57', 1, 'testo 2 (grigio)'], ['#D2231B', 1, 'rosso Nannini'], ['#A81A13', 1, 'rosso scuro'],
    ['#FAFAF7', 1, 'fondo pagina'], ['#FFFFFF', 1, 'schede (bianco)'], ['#E4E3DD', 1, 'linee'], ['#F3F3EF', 1, 'testo chiaro (contatti)'],
    ['#B9B9B3', 1, 'grigio chiaro (contatti)'], ['#FF6A5F', 1, 'rosso chiaro (contatti)'], ['#39FF14', 1, 'verde delle prove']
  ];

  function hex2(n) { return ('0' + Math.round(n).toString(16)).slice(-2).toUpperCase(); }
  function leggiColore(c) {
    var m = /rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)/.exec(c || '');
    if (!m) return null;
    var a = m[4] == null ? 1 : (m[4].slice(-1) === '%' ? parseFloat(m[4]) / 100 : parseFloat(m[4]));
    return { hex: '#' + hex2(+m[1]) + hex2(+m[2]) + hex2(+m[3]), a: Math.round(a * 100) / 100 };
  }
  function nomeTema(c) {
    for (var i = 0; i < TEMA.length; i++) if (TEMA[i][0] === c.hex && Math.abs(TEMA[i][1] - c.a) < .03) return TEMA[i][2];
    return '';
  }
  function scriviColore(c) {
    if (!c) return '—';
    var t = c.hex + (c.a < 1 ? ' al ' + Math.round(c.a * 100) + '%' : ''), n = nomeTema(c);
    return t + (n ? '  · ' + n : '');
  }
  function fondoDi(el) {
    for (var e = el; e && e.nodeType === 1; e = e.parentElement) {
      var cs = getComputedStyle(e), c = leggiColore(cs.backgroundColor);
      if (c && c.a > 0) return { c: c, el: e };
      if (cs.backgroundImage && cs.backgroundImage !== 'none' && !/url\(/.test(cs.backgroundImage)) return { grad: true, el: e };
    }
    return { c: leggiColore(getComputedStyle(document.body).backgroundColor), el: document.body };
  }
  function etichettaDi(el) {
    var E = window.ETICHETTE; if (!E || !E.tabella) return null;
    var migliore = null, prof = -1;
    E.tabella.forEach(function (r) {
      var sel = r[0], trovati;
      try { trovati = document.querySelectorAll(sel); } catch (e) { return; }
      for (var i = 0; i < trovati.length; i++) {
        if (trovati[i] === el || trovati[i].contains(el)) {
          var d = 0; for (var x = trovati[i]; x; x = x.parentElement) d++;
          if (d > prof || (d === prof && r[1].length > migliore[1].length)) { prof = d; migliore = r; }
        }
      }
    });
    return migliore;
  }
  function testoDi(el) {
    var t = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
    return t.length > 70 ? t.slice(0, 67) + '…' : t;
  }
  function px(v) { var n = parseFloat(v); return isNaN(n) ? v : (Math.round(n * 10) / 10) + ' px'; }

  /* interfaccia: tutto in uno shadow DOM, fuori dal sito */
  var host = document.createElement('div');
  host.style.cssText = 'position:fixed;inset:0;z-index:2147483647;pointer-events:none';
  var ombra = host.attachShadow({ mode: 'open' });
  ombra.innerHTML = '<style>' +
    '*{box-sizing:border-box;margin:0;padding:0}' +
    '.tasto{position:fixed;left:10px;bottom:calc(10px + env(safe-area-inset-bottom));pointer-events:auto;font:500 11px/1 ui-monospace,Menlo,Consolas,monospace;letter-spacing:.1em;text-transform:uppercase;color:#39FF14;background:rgba(10,10,6,.86);border:1px solid rgba(57,255,20,.55);border-radius:999px;padding:9px 12px;-webkit-tap-highlight-color:transparent;cursor:pointer}' +
    '.tasto.on{background:#39FF14;color:#0A0A06}' +
    '.box{position:fixed;left:0;top:0;border:1.5px solid #39FF14;box-shadow:0 0 0 9999px rgba(0,0,0,.18);border-radius:3px;display:none;pointer-events:none}' +
    '.pan{position:fixed;left:8px;right:8px;bottom:calc(52px + env(safe-area-inset-bottom));max-height:46vh;overflow:auto;pointer-events:auto;display:none;font:400 12px/1.5 ui-monospace,Menlo,Consolas,monospace;color:#D9FFD0;background:rgba(10,10,6,.94);border:1px solid rgba(57,255,20,.45);border-radius:12px;padding:12px 14px;-webkit-overflow-scrolling:touch}' +
    '.pan b{color:#39FF14;font-weight:600}.pan .r{display:flex;gap:10px;padding:3px 0;border-top:1px solid rgba(57,255,20,.12)}.pan .r:first-child{border-top:0}' +
    '.pan .k{flex:none;width:86px;color:rgba(217,255,208,.6)}.pan .v{flex:1;min-width:0;overflow-wrap:anywhere}' +
    '.sw{display:inline-block;width:11px;height:11px;border-radius:3px;vertical-align:-1px;margin-right:6px;box-shadow:0 0 0 1px rgba(255,255,255,.35)}' +
    '.aiuto{color:rgba(217,255,208,.7)}' +
    '</style><button class="tasto" type="button">Ispeziona</button><div class="box"></div><div class="pan"></div>';
  var tasto = ombra.querySelector('.tasto'), box = ombra.querySelector('.box'), pan = ombra.querySelector('.pan');
  var acceso = false, scelto = null, stile = document.createElement('style');
  stile.textContent = 'html.ispeziona,html.ispeziona *{cursor:crosshair!important}';

  function mostraBox() {
    if (!scelto) { box.style.display = 'none'; return; }
    var r = scelto.getBoundingClientRect();
    box.style.display = 'block';
    box.style.transform = 'translate(' + (r.left - 2) + 'px,' + (r.top - 2) + 'px)';
    box.style.width = (r.width + 4) + 'px'; box.style.height = (r.height + 4) + 'px';
  }
  function riga(k, v) { return '<div class="r"><span class="k">' + k + '</span><span class="v">' + v + '</span></div>'; }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function campione(c) { return c ? '<span class="sw" style="background:' + c.hex + ';opacity:' + Math.max(c.a, .15) + '"></span>' : ''; }

  function ispeziona(el) {
    if (el.closest && el.closest('svg') && el.tagName.toLowerCase() !== 'svg') el = el.closest('svg');
    scelto = el;
    var cs = getComputedStyle(el), et = etichettaDi(el);
    var fam = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(), nome = NOMI_FONT[fam.toLowerCase()] || fam;
    var col = leggiColore(cs.color), fo = fondoDi(el), r = el.getBoundingClientRect();
    var h = '';
    h += riga('Etichetta', et ? '<b>' + esc(et[1]) + '</b> · ' + esc(et[2]) : '—');
    var t = testoDi(el); if (t) h += riga('Testo', '«' + esc(t) + '»');
    h += riga('Carattere', '<b>' + esc(nome) + '</b>' + (cs.fontStyle === 'italic' ? ' corsivo' : '') + ' · peso ' + cs.fontWeight);
    h += riga('Misura', '<b>' + px(cs.fontSize) + '</b> · interlinea ' + (cs.lineHeight === 'normal' ? 'normale' : px(cs.lineHeight)) +
      ' · spaziatura ' + (cs.letterSpacing === 'normal' ? '0' : px(cs.letterSpacing)) + (cs.textTransform === 'uppercase' ? ' · MAIUSCOLO' : ''));
    h += riga('Colore testo', campione(col) + esc(scriviColore(col)));
    h += riga('Fondo', fo.grad ? 'sfumatura (gradiente)' : campione(fo.c) + esc(scriviColore(fo.c)));
    var bordo = parseFloat(cs.borderTopWidth) ? cs.borderTopWidth + ' ' + scriviColore(leggiColore(cs.borderTopColor)) : '';
    if (bordo) h += riga('Bordo', esc(bordo));
    if (parseFloat(cs.borderTopLeftRadius)) h += riga('Angoli', px(cs.borderTopLeftRadius));
    h += riga('Pezzo', Math.round(r.width) + ' × ' + Math.round(r.height) + ' px · in pagina a <b>' + Math.round(r.top + scrollY) + ' px</b>');
    h += riga('Elemento', esc(el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).join('.') : '')));
    pan.innerHTML = h; pan.style.display = 'block'; pan.scrollTop = 0;
    mostraBox();
  }

  function cattura(e) {
    if (!acceso) return;
    if (e.composedPath && e.composedPath()[0] && host.contains(e.target)) return;
    if (e.target === host) return;
    e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    if (e.type === 'click') ispeziona(e.target);
  }
  ['click', 'pointerdown', 'pointerup', 'mousedown', 'mouseup', 'touchend'].forEach(function (t) {
    window.addEventListener(t, cattura, { capture: true, passive: false });
  });
  /* touchend bloccato impedirebbe il click: sul telefono il pezzo si sceglie al touchend */
  window.removeEventListener('touchend', cattura, { capture: true });
  window.addEventListener('touchend', function (e) {
    if (!acceso || host.contains(e.target) || e.target === host) return;
    var tocco = e.changedTouches && e.changedTouches[0]; if (!tocco || mosso) return;
    e.preventDefault(); e.stopPropagation();
    var el = document.elementFromPoint(tocco.clientX, tocco.clientY);
    if (el && el !== host) ispeziona(el);
  }, { capture: true, passive: false });
  var mosso = false, y0 = 0;
  window.addEventListener('touchstart', function (e) { mosso = false; y0 = e.touches[0] ? e.touches[0].clientY : 0; }, { capture: true, passive: true });
  window.addEventListener('touchmove', function (e) { if (e.touches[0] && Math.abs(e.touches[0].clientY - y0) > 8) mosso = true; }, { capture: true, passive: true });
  addEventListener('scroll', function () { if (acceso) mostraBox(); }, { passive: true });
  addEventListener('resize', function () { if (acceso) mostraBox(); });

  tasto.addEventListener('click', function (e) {
    e.stopPropagation();
    acceso = !acceso;
    tasto.classList.toggle('on', acceso);
    tasto.textContent = acceso ? 'Ispeziona: acceso' : 'Ispeziona';
    document.documentElement.classList.toggle('ispeziona', acceso);
    if (acceso) {
      document.head.appendChild(stile);
      pan.innerHTML = '<span class="aiuto">Tocca un testo o un pezzo della pagina: qui compaiono carattere, misura e colori. Scorri pure. Tocca «Ispeziona» per tornare normale.</span>';
      pan.style.display = 'block';
    } else {
      stile.remove(); scelto = null; mostraBox(); pan.style.display = 'none';
    }
  });

  function avvia() { document.documentElement.appendChild(host); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvia); else avvia();
  window.ISPETTORE = { ispeziona: ispeziona, accendi: function () { if (!acceso) tasto.click(); }, pannello: function () { return pan.innerText; } };
})();
