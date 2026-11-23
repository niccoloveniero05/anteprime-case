/* Christy Perugia: anteprima del negozio online (borsa, filtri, taglie, cassa). Nessun dato esce dal telefono. */
(function(){
  var d=document, html=d.documentElement, CAPI=window.CAPI||{};
  html.classList.add('js');
  var SOGLIA=150, SPEDIZIONE=6.9, CHIAVE='christy-borsa';

  function euro(n){return n.toLocaleString('it-IT',{minimumFractionDigits:2,maximumFractionDigits:2})+' €'}
  function prezzoDi(c){return c.sconto ? Math.round(c.prezzo*(100-c.sconto))/100 : c.prezzo}
  function esc(s){return String(s).replace(/[&<>"]/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]})}

  /* ---------- borsa ---------- */
  function leggi(){try{var b=JSON.parse(localStorage.getItem(CHIAVE)); return Array.isArray(b)?b.filter(function(r){return CAPI[r.id]}):[]}catch(e){return []}}
  function scrivi(b){try{localStorage.setItem(CHIAVE, JSON.stringify(b))}catch(e){} disegna()}
  function pezzi(b){return b.reduce(function(s,r){return s+r.q},0)}
  function subtotale(b){return b.reduce(function(s,r){return s+prezzoDi(CAPI[r.id])*r.q},0)}
  function aggiungi(id,taglia){
    var b=leggi(), r=b.find(function(x){return x.id===id && x.taglia===taglia});
    if(r) r.q=Math.min(9,r.q+1); else b.push({id:id,taglia:taglia,q:1});
    scrivi(b);
    d.querySelectorAll('.conta').forEach(function(c){c.classList.remove('salta'); void c.offsetWidth; c.classList.add('salta')});
  }

  var velo=d.querySelector('.velo'), pannello=d.querySelector('.borsa'), ultimoFuoco=null;
  function disegna(){
    var b=leggi(), n=pezzi(b), sub=subtotale(b);
    d.querySelectorAll('.conta').forEach(function(c){c.textContent=n; c.classList.toggle('si', n>0)});
    d.querySelectorAll('.apri-borsa').forEach(function(a){a.setAttribute('aria-label','Borsa, '+n+(n===1?' articolo':' articoli'))});
    if(!pannello) return;
    pannello.querySelector('.borsa-testa h2 span').textContent='('+n+')';
    var righe=pannello.querySelector('.borsa-righe'), piede=pannello.querySelector('.borsa-piede'), soglia=pannello.querySelector('.borsa-soglia');
    if(!b.length){
      righe.innerHTML='<div class="borsa-vuota"><p>La borsa è vuota</p><p>Scegli un capo dal negozio.</p><a class="btn btn-pieno" href="negozio.html">Vai al negozio</a></div>';
      piede.hidden=true; soglia.hidden=true; return;
    }
    piede.hidden=false; soglia.hidden=false;
    var manca=SOGLIA-sub;
    soglia.innerHTML=(manca>0 ? 'Ti mancano <b>'+euro(manca)+'</b> per la spedizione gratuita' : '<b>Spedizione gratuita</b> per questo ordine')+'<div class="barra"><i style="transform:scaleX('+Math.min(1,sub/SOGLIA)+')"></i></div>';
    righe.innerHTML=b.map(function(r,i){
      var c=CAPI[r.id];
      return '<div class="riga"><a href="capo-'+r.id+'.html"><img src="img/capi/'+r.id+'-450.webp" alt="" width="84" height="105"></a><div>'+
        '<h3><a href="capo-'+r.id+'.html">'+esc(c.nome)+'</a></h3><p class="meta">'+esc(c.colore)+' · '+(r.taglia==='U'?'Taglia unica':'Taglia '+r.taglia)+'</p>'+
        '<p class="prezzo">'+(c.sconto?'<s>'+euro(c.prezzo*r.q)+'</s><span class="giu">'+euro(prezzoDi(c)*r.q)+'</span>':euro(c.prezzo*r.q))+'</p>'+
        '<div class="riga-giu"><div class="quanti"><button type="button" data-meno="'+i+'" aria-label="Togli uno">−</button><span>'+r.q+'</span><button type="button" data-piu="'+i+'" aria-label="Aggiungi uno">+</button></div>'+
        '<button type="button" class="togli" data-togli="'+i+'">Rimuovi</button></div></div></div>';
    }).join('');
    piede.querySelector('.totale span:last-child').textContent=euro(sub);
  }
  function apriBorsa(){
    if(!pannello) return;
    ultimoFuoco=d.activeElement;
    pannello.removeAttribute('inert'); pannello.setAttribute('aria-hidden','false');
    pannello.classList.add('aperta'); velo.classList.add('aperto'); html.classList.add('borsa-aperta');
    setTimeout(function(){pannello.querySelector('.chiudi-borsa').focus({preventScroll:true})},60);
  }
  function chiudiBorsa(){
    if(!pannello || !pannello.classList.contains('aperta')) return;
    pannello.classList.remove('aperta'); velo.classList.remove('aperto'); html.classList.remove('borsa-aperta');
    pannello.setAttribute('aria-hidden','true'); pannello.setAttribute('inert','');
    if(ultimoFuoco) ultimoFuoco.focus({preventScroll:true});
  }
  d.querySelectorAll('.apri-borsa').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault(); apriBorsa()})});
  if(pannello){
    velo.addEventListener('click',chiudiBorsa);
    pannello.querySelector('.chiudi-borsa').addEventListener('click',chiudiBorsa);
    pannello.addEventListener('click',function(e){
      var t=e.target.closest('button'); if(!t) return;
      var b=leggi();
      if(t.dataset.piu!=null){b[+t.dataset.piu].q=Math.min(9,b[+t.dataset.piu].q+1); scrivi(b)}
      else if(t.dataset.meno!=null){var r=b[+t.dataset.meno]; r.q--; if(r.q<1) b.splice(+t.dataset.meno,1); scrivi(b)}
      else if(t.dataset.togli!=null){b.splice(+t.dataset.togli,1); scrivi(b)}
    });
  }
  addEventListener('storage',function(e){if(e.key===CHIAVE) disegna()});

  /* ---------- testata e menu ---------- */
  var testata=d.querySelector('.testata'), avviso=d.querySelector('.avviso');
  if(testata){
    var riga=function(){testata.classList.toggle('staccata', scrollY > (avviso?avviso.offsetHeight:0) + 1)};
    addEventListener('scroll', riga, {passive:true}); riga();
  }
  var menu=d.getElementById('menu'), apri=d.querySelector('.apri-menu');
  if(menu && apri){
    var chiudi=menu.querySelector('.chiudi-menu');
    var apriMenu=function(){
      menu.style.setProperty('--su', Math.max(0, Math.round(testata.getBoundingClientRect().top)) + 'px');
      menu.removeAttribute('inert'); menu.setAttribute('aria-hidden','false'); menu.classList.add('aperto');
      apri.setAttribute('aria-expanded','true'); html.classList.add('menu-aperto');
      setTimeout(function(){chiudi.focus({preventScroll:true})}, 60);
    };
    var chiudiMenu=function(fuoco){
      menu.classList.remove('aperto'); menu.setAttribute('aria-hidden','true'); menu.setAttribute('inert','');
      apri.setAttribute('aria-expanded','false'); html.classList.remove('menu-aperto');
      if(fuoco) apri.focus({preventScroll:true});
    };
    apri.addEventListener('click', apriMenu);
    chiudi.addEventListener('click', function(){chiudiMenu(true)});
    menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click', function(){chiudiMenu(false)})});
    d.addEventListener('keydown', function(e){if(e.key==='Escape' && menu.classList.contains('aperto')) chiudiMenu(true)});
    matchMedia('(min-width: 900px)').addEventListener('change', function(e){if(e.matches) chiudiMenu(false)});
  }
  d.addEventListener('keydown', function(e){if(e.key==='Escape') chiudiBorsa()});

  /* foto d'apertura che compare morbida (solo home) */
  var cornice=d.querySelector('.apertura-foto');
  if(cornice){
    var foto=cornice.querySelector('img'), pronta=function(){cornice.classList.add('pronta')};
    if(foto.complete) pronta(); else {foto.addEventListener('load', pronta); foto.addEventListener('error', pronta)}
  }

  /* ---------- catalogo: filtri e ordine ---------- */
  var griglia=d.querySelector('.catalogo .prodotti');
  if(griglia){
    var schede=[].slice.call(griglia.children), bottoni=d.querySelectorAll('.filtri-voci button'), sel=d.querySelector('.ordina select'), conteggio=d.querySelector('.conteggio'), titolo=d.querySelector('.catalogo-testa h1');
    var filtro=new URLSearchParams(location.search).get('filtro')||'tutto';
    var applica=function(){
      var n=0;
      schede.forEach(function(s){var ok = filtro==='tutto' || (filtro==='sconti' ? s.dataset.sconto>0 : s.dataset.cat===filtro); s.hidden=!ok; if(ok) n++});
      bottoni.forEach(function(b){b.setAttribute('aria-pressed', b.dataset.filtro===filtro)});
      var attivo=d.querySelector('.filtri-voci button[data-filtro="'+filtro+'"]');
      if(titolo && attivo) titolo.innerHTML=attivo.dataset.titolo;
      conteggio.textContent=n+(n===1?' capo':' capi');
      var o=sel?sel.value:'evidenza';
      schede.slice().sort(function(a,b){
        if(o==='su') return a.dataset.prezzo-b.dataset.prezzo;
        if(o==='giu') return b.dataset.prezzo-a.dataset.prezzo;
        return a.dataset.ordine-b.dataset.ordine;
      }).forEach(function(s){griglia.appendChild(s)});
    };
    bottoni.forEach(function(b){b.addEventListener('click',function(){
      filtro=b.dataset.filtro; history.replaceState(null,'', filtro==='tutto'?'negozio.html':'negozio.html?filtro='+filtro); applica();
      b.scrollIntoView({block:'nearest',inline:'center',behavior:'smooth'});
    })});
    if(sel) sel.addEventListener('change',applica);
    applica();
  }

  /* ---------- scheda del capo ---------- */
  var scheda=d.querySelector('.scheda');
  if(scheda){
    var id=scheda.dataset.id, scelta=null, msg=scheda.querySelector('.avviso-taglia'), btn=scheda.querySelector('.aggiungi'), etichetta=scheda.querySelector('.taglia-scelta');
    var tb=scheda.querySelectorAll('.taglie button');
    if(tb.length===1){scelta=tb[0].dataset.t; tb[0].setAttribute('aria-pressed','true')}
    tb.forEach(function(b){b.addEventListener('click',function(){
      scelta=b.dataset.t; tb.forEach(function(x){x.setAttribute('aria-pressed', x===b)});
      msg.textContent=''; if(etichetta) etichetta.textContent=b.dataset.t==='U'?'Taglia unica':b.dataset.t;
    })});
    var testoBtn=btn.innerHTML, timer;
    btn.addEventListener('click',function(){
      if(!scelta){msg.textContent='Scegli una taglia'; tb[0].focus(); return}
      aggiungi(id,scelta);
      btn.classList.add('fatto'); btn.innerHTML='Aggiunto alla borsa';
      clearTimeout(timer); timer=setTimeout(function(){btn.classList.remove('fatto'); btn.innerHTML=testoBtn},1800);
      setTimeout(apriBorsa,350);
    });
    var gal=scheda.querySelector('.galleria'), punti=scheda.querySelectorAll('.puntini span');
    if(gal && punti.length) gal.addEventListener('scroll',function(){
      var i=Math.round(gal.scrollLeft/gal.clientWidth); punti.forEach(function(p,k){p.classList.toggle('si',k===i)});
    },{passive:true});
  }

  /* ---------- cassa ---------- */
  var cassa=d.querySelector('.cassa');
  if(cassa){
    var riep=cassa.querySelector('.riepilogo'), largo=matchMedia('(min-width: 900px)');
    var apriRiep=function(){riep.open=largo.matches}; apriRiep(); largo.addEventListener('change',apriRiep);
    var righeMini=cassa.querySelector('.righe-mini'), modulo=cassa.querySelector('form'), grazie=d.querySelector('.grazie');
    var spedizione=function(){
      var v=(modulo.querySelector('input[name=consegna]:checked')||{}).value;
      return v==='ritiro' ? 0 : (subtotale(leggi())>=SOGLIA ? 0 : SPEDIZIONE);
    };
    var conti=function(){
      var b=leggi(), sub=subtotale(b), sp=spedizione(), tot=sub+sp;
      if(!b.length && grazie.hidden){location.replace('negozio.html'); return}
      righeMini.innerHTML=b.map(function(r){var c=CAPI[r.id]; return '<div class="mini"><div class="foto"><img src="img/capi/'+r.id+'-450.webp" alt="" width="60" height="75"><span>'+r.q+'</span></div><div><h3>'+esc(c.nome)+'</h3><p>'+esc(c.colore)+' · '+(r.taglia==='U'?'Taglia unica':r.taglia)+'</p></div><span class="p">'+euro(prezzoDi(c)*r.q)+'</span></div>'}).join('');
      cassa.querySelector('[data-sub]').textContent=euro(sub);
      cassa.querySelector('[data-sped]').textContent=sp?euro(sp):'Gratis';
      cassa.querySelectorAll('[data-tot]').forEach(function(e){e.textContent=euro(tot)});
      cassa.querySelector('[data-corriere]').textContent=sub>=SOGLIA?'Gratis':euro(SPEDIZIONE);
      var iva=cassa.querySelector('[data-iva]'); if(iva) iva.textContent='di cui IVA '+euro(tot-tot/1.22);
    };
    modulo.addEventListener('change',conti);
    var indirizzo=modulo.querySelector('.solo-corriere');
    modulo.querySelectorAll('input[name=consegna]').forEach(function(r){r.addEventListener('change',function(){
      var ritiro=modulo.querySelector('input[name=consegna]:checked').value==='ritiro';
      indirizzo.hidden=ritiro; indirizzo.querySelectorAll('input').forEach(function(i){i.required=!ritiro});
    })});
    modulo.addEventListener('submit',function(e){
      e.preventDefault();
      var primo=null;
      modulo.querySelectorAll('input[required]').forEach(function(i){
        var ok=i.value.trim()!=='' && i.checkValidity(); i.closest('.campo').classList.toggle('errore',!ok); if(!ok && !primo) primo=i;
      });
      if(primo){primo.focus(); return}
      var tot=cassa.querySelector('[data-tot]').textContent, nome=modulo.querySelector('#nome').value.trim(), ritiro=modulo.querySelector('input[name=consegna]:checked').value==='ritiro';
      var btnP=modulo.querySelector('.paga'); btnP.disabled=true; btnP.textContent='Elaborazione…';
      setTimeout(function(){
        var num='CP-'+String(Date.now()).slice(-6);
        grazie.querySelector('[data-nome]').textContent=nome;
        grazie.querySelector('[data-num]').textContent='Ordine '+num;
        grazie.querySelector('[data-cosa]').textContent= ritiro ? 'Ti scriviamo appena è pronto da ritirare in Corso Vannucci 105. Totale '+tot+'.' : 'Ti mandiamo un’email con il numero di spedizione appena parte. Totale '+tot+'.';
        cassa.hidden=true; grazie.hidden=false; scrivi([]); scrollTo(0,0);
      },1100);
    });
    modulo.querySelectorAll('.campo input').forEach(function(i){i.addEventListener('input',function(){i.closest('.campo').classList.remove('errore')})});
    conti();
  }

  disegna();
})();
