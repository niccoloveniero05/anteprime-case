/* ETICHETTE DI PROVA (anteprima N, 18/11; script della D del 19/11) — da togliere: cancellare questo file e la riga <script src="prova-etichette.js"></script>
   messa in fondo a index.html, subito prima di </body>.
   ==========================================================================================================================
   Servono solo nella fase di prova: Niccolò dice «sposta la 4c» e noi sappiamo di che pezzo parla (la mappa delle etichette
   è in etichette.md, accanto a questo file).
   - Un numero verde per ogni blocco grande della pagina (0 = la testata, poi 1, 2, 3… nell'ordine in cui si scorre) e una
     lettera per le parti di ogni blocco (3a, 3b…).
   - Tutto sta in uno strato sopra al sito (dentro uno shadow DOM, attaccato a <html>, fuori dal <body>): il sito non viene
     toccato (niente stili, classi o ::before sui suoi elementi) e l'impaginazione non cambia di un pixel.
   - Dove stanno:
     · il numero del blocco sta nell'angolo in alto a sinistra del blocco; quando l'inizio del blocco passa sotto la
       testata, il numero va nella testata, al centro (così non copre mai il testo che scorre);
     · la lettera sta appena sopra l'angolo in alto a sinistra della sua parte (per le domande e i passi dentro la riga).
       Se lì coprirebbe un'altra parte, va sopra l'angolo in alto a destra. Quando l'angolo passa sotto la testata la
       lettera va via con lui; solo le parti grandi (pannelli, telefoni, card) la tengono, sotto la testata;
     · l'arancio dell'apertura ha la lettera dentro il cerchio, in basso a destra (appena fuori finché è piccolo);
     · se due etichette si toccano, quella che viene dopo nella tabella si sposta di lato.
   - Le etichette delle parti che scorrono con la pagina stanno in uno strato che scorre con la pagina (così sul telefono non
     restano indietro durante lo scorrimento a inerzia); quelle delle scene a palco fermo e della testata in uno strato fisso.
     Le posizioni si ricalcolano a ogni fotogramma da getBoundingClientRect. Le etichette degli elementi nascosti (display
     none, visibility hidden, opacità ~0 loro o dei genitori, ritagliati via con clip-path o overflow, fuori schermo, sotto la
     testata, o visibili solo per una striscia) non si vedono; il controllo della visibilità gira ogni 150 ms.
   - Con ?etichette=0 nell'indirizzo non si vede niente. Per le prove: window.ETICHETTE.mostra(false|true), .stato(),
     .dettagli(), .mancanti().
   ========================================================================================================================== */
(function () {
  'use strict';
  if (window.ETICHETTE) return;
  try { if (/(?:^|&)etichette=0(?:&|$)/.test(location.search.slice(1))) return; } catch (e) {}

  /* [selettore, etichetta, descrizione, opzioni]. Etichetta di sole cifre = blocco grande; cifre + lettera = sua parte.
     Se il selettore trova più elementi si usa il riquadro che li contiene tutti (per le parti: solo quelli visibili; la
     lettera va sopra il primo il cui angolo in alto si vede). Opzioni:
       vedi      si vede solo se si vede anche quell'elemento;     nonSe  non si vede se si vede quell'elemento;
       dentro    la lettera sta dentro l'angolo (nel margine in alto della riga) invece che appena sopra: per le righe
                 separate da un filo (domande, passi), dove sopra sarebbe sul filo della riga prima;
       resta     parte grande (pannello, telefono, card): quando il suo angolo in alto passa sotto la testata la lettera
                 resta nell'angolo, sotto la testata; senza, la lettera va via insieme all'angolo;
       gruppo    parti che stanno una sopra l'altra e si danno il cambio (le frasi delle scene): si vede solo la lettera di
                 quella più visibile;
       cerchio   la parte è un cerchio (l'arancio dell'apertura): la lettera sta dentro, in basso a destra;
       copertoDa un cerchio: la lettera non si vede quando quel cerchio copre tutta la parte;
       riq       [sinistra, su, destra, giù] in frazioni del riquadro: dove sta davvero il disegno (la V grande) o dove il
                 pannello si vede ancora (i pannelli del Virtual Assistant e della Campagna sfumano nel fondo: sotto c'è il titolo). */
  /* r4 (21/11): al telefono tre righe nuove (4p il «+», 4q la tendina, 4r «Scrivici»); il resto come la r3.
     r3 (21/11): due tabelle. TABELLA_TEL = quella della r2, identica (sotto i 1024 px la pagina è la r2); TABELLA_PC = le
     sezioni del computer rinumerate (da 1024 px). Si sceglie all'avvio; se la finestra passa la soglia si rifà (in fondo) */
  function TABELLA_ORA() {
    var pc = false; try { pc = matchMedia('(min-width:1024px)').matches; } catch (e) {}
    return pc ? TABELLA_PC : TABELLA_TEL;
  }
  var TABELLA_TEL = [
    ['#testata', '0', 'La testata fissa in alto'],
    ['#marchio-testata', '0a', 'Il marchio «Veniello·studio» piccolo nella testata (V e pallino arrivano dall’apertura)'],
    ['#testata nav', '0b', 'Il menu (Come funziona, Servizi, Abbonamenti, Partner, Domande): solo da computer'],
    ['#testata-scrivi', '0c', 'Il pulsante «Scrivici» della testata'],

    ['#inizio', '1', 'L’apertura', { riq: [0, 0.11, 1, 1] }],   /* sotto la testata, non sopra il menu */
    ['#volo-v, #eroe-v', '1a', 'La V grande del marchio: scorrendo vola nella V della testata (0a)', { riq: [0.12, 0.2, 0.95, 0.92] }],
    ['#volo-pl, #eroe-pl', '1b', 'Il pallino arancio: scorrendo vola tra «Veniello» e «studio» nella testata (0a)'],
    ['#inizio .eroe-frase', '1c', '«Fatti trovare. Fatti scegliere.» (r4: a sinistra; nella variante r4-centro al centro)'],
    ['#inizio .eroe-sotto', '1d', '«Veniello Studio porta la tua attività online e la fa crescere: sito, Google, social e video, tutto da un solo studio.» (r4: a sinistra, 3 righe a 390 px)'],

    ['#come', '2', 'Come funziona'],
    ['#come .etichetta', '2a', 'L’etichetta «Come funziona»'],
    ['#t-come', '2b', 'Il titolo «Prima lo vedi. Poi decidi.»'],
    ['#come .wrap > .sotto', '2c', 'La frase breve sotto il titolo'],
    ['#rotaia', '2d', 'Solo computer: la riga dei tre punti (Ci scrivi · Anteprima · Online), ci corre la pallina (2h)'],
    ['#come .passo:nth-child(1)', '2e', 'Passo 01 «Ci scrivi» (telefono: riquadro che scorre di lato)', { dentro: true }],
    ['#come .passo:nth-child(2)', '2f', 'Passo 02 «Ti prepariamo l’anteprima» (Gratis)', { dentro: true }],
    ['#come .passo:nth-child(3)', '2g', 'Passo 03 «Se ti piace, va online»', { dentro: true }],
    ['#corsa-palla', '2h', 'Solo computer: la pallina che corre sulla riga (2d) scorrendo e si ferma in fondo a destra'],

    ['#servizi > .wrap > .etichetta, #t-servizi, #servizi > .wrap > .sotto', '3', 'Servizi', { riq: [-0.05, 0, 1, 1] }],
    ['#servizi > .wrap > .etichetta', '3a', 'L’etichetta «Servizi»'],
    ['#t-servizi', '3b', 'Il titolo «Tutto quello che serve per farti scegliere.»'],
    ['#servizi > .wrap > .sotto', '3c', '«Prendi solo quello che ti serve…»'],
    ['#contenuti .m-video, #montaggio', '3d', 'Creazione Contenuti. Telefono: lo spot nel programma di montaggio, nello schermo del portatile (la linea arancio segue il video). Computer: il riquadro col video (gira una volta)', { resta: true }],
    ['#t-contenuti', '3e', 'Il titolo «Creazione Contenuti.»'],
    ['#contenuti > .sotto', '3f', '«Video, foto e stories per i tuoi social, anche con l’IA.»'],
    ['#contenuti > .dettagli', '3g', '«Scopri i dettagli +» (e l’elenco che si apre)'],
    ['#sito .m-sito', '3h', 'Sito Web: il riquadro dell’anteprima animata del sito', { resta: true }],
    ['#sito .sa-frase', '3i', 'L’anteprima: la frase («Completamente personalizzabile» → «E su tutti i tuoi dispositivi»)', { gruppo: 'frasi-sito' }],
    ['#sito .sa-tel', '3j', 'L’anteprima: il telefono', { resta: true }],
    ['#sito .sa-pc', '3k', 'L’anteprima: il computer (compare alla fine)'],
    ['#t-sito', '3l', 'Il titolo «Sito Web.»'],
    ['#sito > .sotto', '3m', '«Chi sei, cosa fai e un tasto per chiamarti.»'],
    ['#sito > .dettagli', '3n', '«Scopri i dettagli +» (e l’elenco che si apre)'],
    ['#va .m-va', '3o', 'Virtual Assistant: il riquadro con la chat di WhatsApp', { resta: true }],
    ['#va .m-va .chat-testa', '3p', 'La testa della chat «AnomiaLabs · online»'],
    ['#va .m-va .chat-flusso .chat-m', '3q', 'I messaggi della chat'],
    ['#va .m-va .chat-rie', '3r', 'Il riquadro «Riepilogo per il titolare»'],
    ['#va .m-va > .chip', '3s', 'L’etichetta «Esempio · WhatsApp»'],
    ['#t-va', '3t', 'Il titolo «Virtual Assistant.»'],
    ['#va > .sotto', '3u', '«Risponde ai tuoi clienti su WhatsApp, anche quando non puoi.»'],
    ['#va > .dettagli', '3v', '«Scopri i dettagli +» (e l’elenco che si apre)'],
    ['#servizi .nota', '3w', 'La nota «Siti, video e grafiche: lavori veri…»'],

    ['#abbonamenti', '4', 'Abbonamenti'],
    ['#abbonamenti > .wrap > .etichetta', '4a', 'L’etichetta «Abbonamenti»'],
    ['#t-abb', '4b', 'Il titolo «Scegli come crescere.»'],
    ['#abbonamenti > .wrap > .sotto', '4c', 'r5: «Si parte sempre da una consulenza gratuita* per studiare il piano di crescita» (asterisco arancio, spiegato dalla nota 4l)'],
    ['#abb-presenza', '4d', 'Presenza (430 € al mese). Telefono: le schede «a cassette» che si impilano', { resta: true }],
    ['#abb-crescita', '4e', 'Crescita (850 € al mese, Consigliato)', { resta: true }],
    ['#abb-enterprise', '4f', 'Enterprise (2.600 € al mese, Il più completo)', { resta: true }],
    ['#abbonamenti .abb-fig', '4g', 'Le figure: blocco, scala, sfera che gira (telefono: nel riquadro a destra della scheda; computer: la scala si forma col mouse sopra)'],
    ['#abbonamenti .abb-testa', '4h', 'Il nome (e l’etichetta «Per iniziare / Consigliato / Il più completo»)'],
    ['#abbonamenti .abb-prezzo', '4i', 'Il prezzo'],
    ['#abb-scopri', '4j', 'Telefono: il pulsante «Scopri gli abbonamenti →» (apre la landing, stessa scheda)'],
    ['#abbonamenti .abb-btn', '4k', 'Computer: «Contattaci →»'],
    ['#abbonamenti .abb-note', '4l', 'r5: la nota «* Se si sceglie un abbonamento o un servizio, altrimenti il costo è di 70 €» sotto la pila (telefono, 12 px grigio) e, da computer, con l’altra nota («L’anteprima di siti web e landing page è gratis»)'],
    ['#abbonamenti .abb-dett', '4m', '«Dettagli +» (computer): apre il pannello'],
    ['.abb-pannello', '4n', 'Il pannello dei Dettagli (computer)', { resta: true }],
    ['#abbonamenti .abb-desc', '4o', 'La frase sotto il nome'],
    ['#abbonamenti .abb-segno', '4p', 'r4, telefono: il «+» accanto al prezzo (diventa «−»): tutta la scheda si tocca e apre la tendina'],
    ['#abbonamenti .abb-essenziali', '4q', 'r4, telefono: la tendina aperta, con le quattro voci essenziali del piano'],
    ['#abbonamenti .abb-scrivici', '4r', 'r4, telefono: «Scrivici» nella tendina (apre WhatsApp col messaggio del piano)'],

    ['#partner', '5', 'Partner'],
    ['#partner .etichetta', '5a', 'L’etichetta «Partner»'],
    ['#t-partner', '5b', 'Il titolo «Chi ha scelto Veniello·studio.»'],
    ['#partner .wrap > .sotto', '5c', '«Le attività con cui lavoriamo ogni mese.»'],
    ['#partner .carosello > .card:nth-child(1)', '5d', 'Card Jué Club', { resta: true }],
    ['#partner .carosello > .card:nth-child(2)', '5e', 'Card Elena Baldi Wedding Planner', { resta: true }],
    ['#partner .carosello > .card:nth-child(3)', '5f', 'Card GB Oro', { resta: true }],
    ['#partner .card-tua', '5g', 'Card arancio «La tua attività, qui.»', { resta: true }],

    ['#domande', '6', 'Le domande'],
    ['#domande .etichetta', '6a', 'L’etichetta «Domande»'],
    ['#t-domande', '6b', 'Il titolo «Le domande che ci fanno tutti.»'],
    ['#domande .faq > details:nth-of-type(1)', '6c', '«L’anteprima è davvero gratis?»', { dentro: true }],
    ['#domande .faq > details:nth-of-type(2)', '6d', '«Ci sono altre spese oltre al prezzo?»', { dentro: true }],
    ['#domande .faq > details:nth-of-type(3)', '6e', '«Il sito resta mio?»', { dentro: true }],
    ['#domande .faq > details:nth-of-type(4)', '6f', '«Quanto costa?»', { dentro: true }],
    ['#domande .faq > details:nth-of-type(5)', '6g', '«Le foto da dove le prendete?»', { dentro: true }],
    ['#domande .faq > details:nth-of-type(6)', '6h', '«Venite voi a fare le riprese?»', { dentro: true }],
    ['#domande .faq > details:nth-of-type(7)', '6i', '«In che zona lavorate?»', { dentro: true }],
    ['#domande .faq > details:nth-of-type(8)', '6j', '«Cosa devo fare io per avere il Virtual Assistant?»', { dentro: true }],
    ['#domande .faq > details:nth-of-type(9)', '6k', '«Che differenza c’è tra abbonamenti e servizi?» (r5: risposta con la consulenza gratis con un abbonamento o un servizio)', { dentro: true }],
    ['#domande .faq > details:nth-of-type(10)', '6l', 'r5: «La consulenza è gratis?» (dalla landing r47)', { dentro: true }],
    ['#domande .faq > details:nth-of-type(11)', '6m', 'r5: «C’è un vincolo di durata?» (dalla landing r47)', { dentro: true }],

    ['#contatti', '7', 'Contatti'],
    ['#contatti .etichetta', '7a', 'L’etichetta «Contatti»'],
    ['#t-contatti', '7b', 'Il titolo «Vuoi vedere il tuo sito?»'],
    ['#contatti .sotto', '7c', '«Scrivici su WhatsApp il nome della tua attività…»'],
    ['#contatti .pillole > .pill-chiara', '7d', 'Il pulsante «Scrivici su WhatsApp»'],
    ['#contatti .pillole > .pill-scura', '7e', 'Il pulsante «Chiama»'],
    ['#contatti .recapito:nth-child(1)', '7f', 'Il riquadro del telefono (Giuseppe Fusciello)'],
    ['#contatti .recapito:nth-child(2)', '7g', 'Il riquadro dell’email'],
    ['#contatti .recapito:nth-child(3)', '7h', 'Il riquadro «Dove»'],

    ['#piede', '8', 'Il piede'],
    ['#piede .piede-marchio', '8a', 'Il marchio grande «Veniello·studio» (il puntino resta arancio, fermo)'],
    ['#titolare', '8b', 'r5: «Veniello Studio di Giuseppe Fusciello · [via, CAP e città] · P. IVA [numero] · email» (i segnaposto arancio li riempie Giuseppe)'],
    ['#piede .piede-leg-riga', '8c', 'r5: «© 2026 Veniello Studio · Montecatini Terme · Valdinievole · Privacy»'],
    ['#piede .piede-leg-riga a', '8d', 'r5: il link «Privacy» (apre privacy.html)']
  ];
  var TABELLA_PC = [
    ['#testata', '0', 'La testata fissa in alto'],
    ['#marchio-testata', '0a', 'Il marchio «Veniello·studio» completo (da computer è fermo: niente V che vola)'],
    ['#testata nav', '0b', 'Il menu (Come funziona, Servizi, Abbonamenti, Partner, Domande)'],
    ['#testata-scrivi', '0c', 'Il pulsante «Scrivici» della testata'],

    ['#inizio', '1', 'L’apertura (come la testata di Spotify)', { riq: [0, 0.11, 1, 1] }],
    ['#inizio .eroe-frase', '1a', '«Fatti trovare. Fatti scegliere.»'],
    ['#inizio .eroe-sotto', '1b', '«Veniello Studio porta la tua attività online e la fa crescere.»'],
    ['#cerchio-pc .cerchio-disco', '1c', 'Il logo animato: il pallino arancio del marchio in grande, con la luce morbida che si muove dentro; scorrendo si sposta e si rimpicciolisce', { cerchio: true }],
    ['#cerchio-pc .cerchio-v', '1d', 'La V del marchio, scura, sopra il cerchio (come le barre nere di Spotify)', { riq: [0.2, 0.18, 0.8, 0.82] }],

    ['#come', '2', 'Come funziona (al posto di «Qui la musica non si ferma mai»)'],
    ['#come .etichetta', '2a', 'L’etichetta «Come funziona»'],
    ['#t-come', '2b', 'Il titolo «Prima lo vedi. Poi decidi.»: si accende parola per parola scorrendo (da grigio a bianco)'],
    ['#rotaia', '2c', 'La riga dei tre punti (Ci scrivi · Anteprima · Online), ci corre la pallina (2d)'],
    ['#corsa-palla', '2d', 'La pallina che corre sulla riga (2c) scorrendo e si ferma in fondo a destra'],
    ['#come .passo:nth-child(1)', '2e', 'Passo «Ci scrivi»: icona a linee, titolo, frase'],
    ['#come .passo:nth-child(2)', '2f', 'Passo «Ti prepariamo l’anteprima» (Gratis)'],
    ['#come .passo:nth-child(3)', '2g', 'Passo «Se ti piace, va online»'],
    ['#come-scrivi', '2h', 'Il pulsante «Scrivici su WhatsApp»'],
    ['#come .wrap > .sotto', '2i', 'La frase piccola sotto il pulsante («Il sito e il Virtual Assistant li vedi prima in anteprima…»)'],

    ['#servizi > .wrap > .etichetta, #t-servizi, #servizi > .wrap > .sotto', '3', 'Servizi (al posto di «Pensato per i tuoi gusti»)', { riq: [-0.05, 0, 1, 1] }],
    ['#servizi > .wrap > .etichetta', '3a', 'L’etichetta «Servizi»'],
    ['#t-servizi', '3b', 'Il titolo «Tutto quello che serve per farti scegliere.»: si accende parola per parola scorrendo'],
    ['#servizi > .wrap > .sotto', '3c', '«Prendi solo quello che ti serve…»'],
    ['#contenuti', '3d', 'Scheda Creazione Contenuti (fondo bruno scuro): si ferma in alto e la successiva le sale sopra', { resta: true }],
    ['#montaggio', '3e', 'Il riquadro incassato: lo spot nel programma di montaggio (la linea arancio segue il video)', { resta: true }],
    ['#t-contenuti', '3f', 'Il titolo «Creazione Contenuti.»'],
    ['#contenuti > .sotto', '3g', '«Video, foto e stories per i tuoi social, anche con l’IA.»'],
    ['#contenuti > .dettagli', '3h', '«Scopri i dettagli +» (e l’elenco che si apre)'],
    ['#sito', '3i', 'Scheda Sito Web (fondo verde quasi nero)', { resta: true }],
    ['#sito .m-sito', '3j', 'Il riquadro incassato: l’anteprima animata del sito', { resta: true }],
    ['#sito .sa-tel', '3k', 'L’anteprima: il telefono col mini-sito', { resta: true }],
    ['#sito .sa-frase', '3l', 'L’anteprima: la frase («Completamente personalizzabile» → «E su tutti i tuoi dispositivi»)', { gruppo: 'frasi-sito' }],
    ['#sito .sa-pc', '3m', 'L’anteprima: il computer (compare alla fine)'],
    ['#t-sito', '3n', 'Il titolo «Sito Web.»'],
    ['#sito > .sotto', '3o', '«Chi sei, cosa fai e un tasto per chiamarti.»'],
    ['#sito > .dettagli', '3p', '«Scopri i dettagli +» (e l’elenco che si apre)'],
    ['#va', '3q', 'Scheda Virtual Assistant (fondo prugna quasi nero)', { resta: true }],
    ['#va .m-va', '3r', 'Il riquadro incassato: la chat di WhatsApp', { resta: true }],
    ['#va .m-va .chat-testa', '3s', 'La testa della chat «AnomiaLabs · online»'],
    ['#va .m-va .chat-flusso .chat-m', '3t', 'I messaggi della chat'],
    ['#va .m-va .chat-rie', '3u', 'Il riquadro «Riepilogo per il titolare»'],
    ['#va .m-va > .chip', '3v', 'L’etichetta «Esempio · WhatsApp»'],
    ['#t-va', '3w', 'Il titolo «Virtual Assistant.»'],
    ['#va > .sotto', '3x', '«Risponde ai tuoi clienti su WhatsApp, anche quando non puoi.»'],
    ['#va > .dettagli', '3y', '«Scopri i dettagli +» (e l’elenco che si apre)'],
    ['#servizi .nota', '3z', 'La nota «Siti, video e grafiche: lavori veri…»'],

    ['#abbonamenti', '4', 'Abbonamenti'],
    ['#abbonamenti > .wrap > .etichetta', '4a', 'L’etichetta «Abbonamenti»'],
    ['#t-abb', '4b', 'Il titolo «Oppure scegli uno dei nostri abbonamenti.»: si accende parola per parola scorrendo'],
    ['#abbonamenti > .wrap > .sotto', '4c', 'r5: «Si parte sempre da una consulenza gratuita* per studiare il piano di crescita» (asterisco arancio, spiegato dalla nota 4l)'],
    ['#abb-presenza', '4d', 'Scheda Presenza (430 € al mese)', { resta: true }],
    ['#abb-crescita', '4e', 'Scheda Crescita (850 € al mese, Consigliato)', { resta: true }],
    ['#abb-enterprise', '4f', 'Scheda Enterprise (2.600 € al mese, Il più completo)', { resta: true }],
    ['#abbonamenti .abb-fig', '4g', 'Le figure: blocco, scala (si forma col mouse sopra), sfera col nucleo arancio che gira'],
    ['#abbonamenti .abb-testa', '4h', 'L’etichetta («Per iniziare / Consigliato / Il più completo») e il nome'],
    ['#abbonamenti .abb-desc', '4i', 'La frase sotto il nome'],
    ['#abbonamenti .abb-prezzo', '4j', 'Il prezzo'],
    ['#abb-scopri', '4k', 'Il pulsante «Scopri gli abbonamenti →»: apre la landing nella stessa scheda'],
    ['#abbonamenti .abb-note', '4l', 'r5: le due note piccole sotto il pulsante («* Se si sceglie un abbonamento o un servizio, altrimenti il costo è di 70 €»; anteprima gratis di siti e landing page)'],

    ['#partner', '5', 'Partner'],
    ['#partner .etichetta', '5a', 'L’etichetta «Partner»'],
    ['#t-partner', '5b', 'Il titolo «Chi ha scelto Veniello·studio.»'],
    ['#partner .wrap > .sotto', '5c', '«Le attività con cui lavoriamo ogni mese.»'],
    ['#partner .carosello > .card:nth-child(1)', '5d', 'Card Jué Club', { resta: true }],
    ['#partner .carosello > .card:nth-child(2)', '5e', 'Card Elena Baldi Wedding Planner', { resta: true }],
    ['#partner .carosello > .card:nth-child(3)', '5f', 'Card GB Oro', { resta: true }],
    ['#partner .card-tua', '5g', 'Card arancio «La tua attività, qui.»', { resta: true }],

    ['#domande', '6', 'Le domande'],
    ['#domande .etichetta', '6a', 'L’etichetta «Domande»'],
    ['#t-domande', '6b', 'Il titolo «Le domande che ci fanno tutti.»'],
    ['#domande .faq > details:nth-of-type(1)', '6c', '«L’anteprima è davvero gratis?»', { dentro: true }],
    ['#domande .faq > details:nth-of-type(2)', '6d', '«Ci sono altre spese oltre al prezzo?»', { dentro: true }],
    ['#domande .faq > details:nth-of-type(3)', '6e', '«Il sito resta mio?»', { dentro: true }],
    ['#domande .faq > details:nth-of-type(4)', '6f', '«Quanto costa?»', { dentro: true }],
    ['#domande .faq > details:nth-of-type(5)', '6g', '«Le foto da dove le prendete?»', { dentro: true }],
    ['#domande .faq > details:nth-of-type(6)', '6h', '«Venite voi a fare le riprese?»', { dentro: true }],
    ['#domande .faq > details:nth-of-type(7)', '6i', '«In che zona lavorate?»', { dentro: true }],
    ['#domande .faq > details:nth-of-type(8)', '6j', '«Cosa devo fare io per avere il Virtual Assistant?»', { dentro: true }],
    ['#domande .faq > details:nth-of-type(9)', '6k', '«Che differenza c’è tra abbonamenti e servizi?» (r5: risposta con la consulenza gratis con un abbonamento o un servizio)', { dentro: true }],
    ['#domande .faq > details:nth-of-type(10)', '6l', 'r5: «La consulenza è gratis?» (dalla landing r47)', { dentro: true }],
    ['#domande .faq > details:nth-of-type(11)', '6m', 'r5: «C’è un vincolo di durata?» (dalla landing r47)', { dentro: true }],

    ['#contatti', '7', 'Contatti'],
    ['#contatti .etichetta', '7a', 'L’etichetta «Contatti»'],
    ['#t-contatti', '7b', 'Il titolo «Vuoi vedere il tuo sito?»'],
    ['#contatti .sotto', '7c', '«Scrivici su WhatsApp il nome della tua attività…»'],
    ['#contatti .pillole > .pill-chiara', '7d', 'Il pulsante «Scrivici su WhatsApp»'],
    ['#contatti .pillole > .pill-scura', '7e', 'Il pulsante «Chiama»'],
    ['#contatti .recapito:nth-child(1)', '7f', 'Il riquadro del telefono (Giuseppe Fusciello)'],
    ['#contatti .recapito:nth-child(2)', '7g', 'Il riquadro dell’email'],
    ['#contatti .recapito:nth-child(3)', '7h', 'Il riquadro «Dove»'],

    ['#piede', '8', 'Il piede'],
    ['#piede .piede-marchio', '8a', 'Il marchio grande «Veniello·studio» (il puntino resta arancio, fermo)'],
    ['#titolare', '8b', 'r5: «Veniello Studio di Giuseppe Fusciello · [via, CAP e città] · P. IVA [numero] · email» (i segnaposto arancio li riempie Giuseppe)'],
    ['#piede .piede-leg-riga', '8c', 'r5: «© 2026 Veniello Studio · Montecatini Terme · Valdinievole · Privacy»'],
    ['#piede .piede-leg-riga a', '8d', 'r5: il link «Privacy» (apre privacy.html)']
  ];
  var TABELLA = TABELLA_ORA();

  var ATTESA_LENTA = 150;     /* ogni quanto si ricontrolla se un elemento è nascosto (ms) */
  var ATTESA_CERCA = 1000;    /* ogni quanto si ricercano gli elementi (il sito ne crea o ne copia alcuni da sé) */
  var MIN_LARGO = 40;         /* una parte merita la lettera se se ne vede almeno questa larghezza (o il 30% di lei) */
  var COPRE = 0.25;           /* una lettera «copre» un'altra parte se ci sta sopra per almeno questa parte di sé */

  var voci = [], blocchi = {}, host, radice, strati = {}, acceso = true, avvisati = {};

  function crea() {
    host = document.createElement('etichette-prova');
    host.setAttribute('aria-hidden', 'true');
    /* l'ospite è un punto (0×0) nell'angolo in alto a sinistra della pagina: non occupa spazio e non sposta niente */
    host.style.cssText = 'all:initial!important;position:absolute!important;left:0!important;top:0!important;width:0!important;height:0!important;' +
      'display:block!important;overflow:visible!important;pointer-events:none!important;z-index:2147483647!important;' +
      'margin:0!important;padding:0!important;border:0!important;background:none!important;transform:none!important';
    radice = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;
    var st = document.createElement('style');
    st.textContent =
      '.doc{position:absolute;left:0;top:0;width:0;height:0;overflow:visible}' +
      '.fisso{position:fixed;left:0;top:0;right:0;bottom:0;overflow:hidden}' +
      '.e{position:absolute;left:0;top:0;display:none;box-sizing:border-box;white-space:nowrap;' +
      'font:500 9px/1 "Geist Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;letter-spacing:.02em;' +
      'color:#39FF14;opacity:.85;background:none;border:0;border-radius:0;padding:0;box-shadow:none;' +
      'text-shadow:0 0 1px rgba(0,0,0,.95),0 0 3px rgba(0,0,0,.7),0 1px 1px rgba(0,0,0,.8);' +
      '-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision;will-change:transform}' +
      '.e.m{font-size:10px}' +
      '.e.on{display:block}';
    radice.appendChild(st);
    strati.doc = document.createElement('div'); strati.doc.className = 'doc';
    strati.fisso = document.createElement('div'); strati.fisso.className = 'fisso';
    radice.appendChild(strati.doc); radice.appendChild(strati.fisso);
    document.documentElement.appendChild(host);

    TABELLA.forEach(function (r, i) {
      var m = /^(\d+)([a-z]*)$/.exec(r[1]);
      if (!m) { console.warn('Etichette di prova: etichetta strana', r[1]); return; }
      var v = { i: i, sel: r[0], et: r[1], desc: r[2], opz: r[3] || {}, num: +m[1], macro: !m[2], els: [], ok: [], clip: [],
                lab: document.createElement('span'), w: 0, h: 0, on: false, x: -1, y: -1, dx: NaN, dy: NaN, strato: 'doc',
                vis: false, op: 0, fissa: false, vicino: false, m: null, modo: '', anc: null, cop: null };
      v.lab.className = 'e on' + (v.macro ? ' m' : '');
      v.lab.textContent = v.et;
      strati.doc.appendChild(v.lab);
      voci.push(v);
      if (v.macro) blocchi[v.num] = v;
    });
    voci.forEach(function (v) { v.w = v.lab.offsetWidth; v.h = v.lab.offsetHeight; v.lab.classList.remove('on'); });
  }

  function cerca() {
    voci.forEach(function (v) {
      var l = [];
      try { l = [].slice.call(document.querySelectorAll(v.sel)); } catch (e) { l = []; }
      if (!l.length && !avvisati[v.et]) { avvisati[v.et] = 1; console.warn('Etichette di prova: non trovo «' + v.sel + '» (' + v.et + '), la salto'); }
      if (l.length && avvisati[v.et]) delete avvisati[v.et];
      var cambiato = l.length !== v.els.length || l.some(function (x, i) { return x !== v.els[i]; });
      if (cambiato) { v.els = l; v.ok = l.map(function () { return false; }); v.clip = l.map(function () { return []; }); }
    });
  }

  /* ── è nascosto? ── */
  function insetVia(s, el) {
    var c = s.clipPath || s.webkitClipPath;
    if (!c || c === 'none' || c.indexOf('inset(') !== 0) return false;
    var a = c.slice(6, c.indexOf(')')).split(' round ')[0].trim().split(/\s+/);
    if (a.length === 1) a = [a[0], a[0], a[0], a[0]];
    else if (a.length === 2) a = [a[0], a[1], a[0], a[1]];
    else if (a.length === 3) a = [a[0], a[1], a[2], a[1]];
    function pc(x, lato) { var n = parseFloat(x) || 0; return /%$/.test(x) ? n : n / Math.max(1, lato) * 100; }
    var w = el.offsetWidth || 1, h = el.offsetHeight || 1;
    return pc(a[1], w) + pc(a[3], w) >= 99 || pc(a[0], h) + pc(a[2], h) >= 99;
  }
  /* quanto si vede (opacità; 0 = non si vede) e se sta dentro qualcosa di fisso o sticky (le scene a palco fermo) */
  function guarda(el) {
    var r = { op: 0, fissa: false };
    if (!el || !el.isConnected || !el.getClientRects().length) return r;
    var s = getComputedStyle(el);
    if (s.visibility === 'hidden' || s.visibility === 'collapse') return r;
    var op = 1, fissa = false;
    for (var n = el; n && n.nodeType === 1 && n !== document.documentElement; n = n.parentElement) {
      var t = n === el ? s : getComputedStyle(n);
      if (t.display === 'none') return r;
      op *= parseFloat(t.opacity); if (!(op >= .06)) return r;
      if (insetVia(t, n)) return r;
      if (t.position === 'fixed' || t.position === 'sticky') fissa = true;
    }
    r.op = op; r.fissa = fissa;
    return r;
  }
  /* i genitori che tagliano quello che esce (overflow diverso da visible), fino al body */
  function tagli(el) {
    var l = [];
    for (var n = el.parentElement; n && n !== document.body && n !== document.documentElement; n = n.parentElement) {
      var t = getComputedStyle(n);
      if (t.position === 'fixed') break;
      if (t.overflowX !== 'visible' || t.overflowY !== 'visible') l.push(n);
    }
    return l;
  }
  function primo(sel) { try { return document.querySelector(sel); } catch (e) { return null; } }

  function lenta() {
    voci.forEach(function (v) {
      if (!v.vicino) { v.vis = false; v.op = 0; return; }
      var tutto = false, op = 0, fissa = null;
      v.els.forEach(function (el, i) {
        var g = guarda(el); v.ok[i] = g.op > 0;
        if (g.op > 0) { tutto = true; v.clip[i] = tagli(el); if (g.op > op) op = g.op; if (fissa === null) fissa = g.fissa; }
      });
      if (tutto && v.opz.vedi && !(guarda(primo(v.opz.vedi)).op > 0)) tutto = false;
      if (tutto && v.opz.nonSe && guarda(primo(v.opz.nonSe)).op > 0) tutto = false;
      v.vis = tutto; v.op = tutto ? op : 0; v.fissa = !!fissa;
      if (v.opz.copertoDa) { var c = primo(v.opz.copertoDa); v.cop = c && guarda(c).op > 0 ? c : null; }
    });
  }

  /* ── i riquadri (in px dello schermo) di una voce: per ogni elemento g = intero, q = tagliato dai genitori che tagliano ── */
  function misura(v, soloVisibili) {
    var elems = [], tutto = null;
    for (var i = 0; i < v.els.length; i++) {
      if (soloVisibili && !v.ok[i]) continue;
      var b = v.els[i].getBoundingClientRect(), L = b.left, T = b.top, R = b.right, B = b.bottom;
      if (v.opz.riq) { var f = v.opz.riq, bw = R - L, bh = B - T; L = b.left + f[0] * bw; T = b.top + f[1] * bh; R = b.left + f[2] * bw; B = b.top + f[3] * bh; }
      var g = { l: L, t: T, r: R, b: B };
      if (soloVisibili) {
        var c = v.clip[i] || [];
        for (var k = 0; k < c.length; k++) {
          var q = c[k].getBoundingClientRect();
          if (q.left > L) L = q.left; if (q.top > T) T = q.top; if (q.right < R) R = q.right; if (q.bottom < B) B = q.bottom;
        }
      }
      if (R - L < 1 || B - T < 1) continue;
      var e = { l: L, t: T, r: R, b: B, largo: g.r - g.l, g: g };
      elems.push(e);
      if (!tutto) tutto = { l: L, t: T, r: R, b: B, largo: e.largo };
      else { if (L < tutto.l) tutto.l = L; if (T < tutto.t) tutto.t = T; if (R > tutto.r) tutto.r = R; if (B > tutto.b) tutto.b = B; if (e.largo > tutto.largo) tutto.largo = e.largo; }
    }
    return tutto ? { tutto: tutto, elems: elems } : null;
  }
  /* se ne vede abbastanza (non una striscia di pochi px, come la card precedente del carosello) */
  function abbastanza(q, W, H, sopra) {
    var l = Math.max(q.l, 0), r = Math.min(q.r, W), t = Math.max(q.t, sopra), b = Math.min(q.b, H);
    return r - l >= Math.min(MIN_LARGO, 0.3 * q.largo) && b - t >= 6;
  }
  function cerchioDi(g) { return { x: (g.l + g.r) / 2, y: (g.t + g.b) / 2, r: (g.r - g.l) / 2 }; }
  function nelCerchio(c, x, y, margine) { var dx = x - c.x, dy = y - c.y, r = c.r - (margine || 0); return r > 0 && dx * dx + dy * dy <= r * r; }
  function angoliNelCerchio(c, l, t, r, b, margine) {
    return nelCerchio(c, l, t, margine) && nelCerchio(c, r, t, margine) && nelCerchio(c, l, b, margine) && nelCerchio(c, r, b, margine);
  }
  function contiene(a, b) { return a.l <= b.l + 2 && a.t <= b.t + 2 && a.r >= b.r - 2 && a.b >= b.b - 2; }
  /* la lettera di v messa in (x, y) starebbe sopra un'altra parte (che non contiene v)? */
  function copre(v, x, y, parti) {
    var minimo = COPRE * v.w * v.h;
    for (var i = 0; i < parti.length; i++) {
      var p = parti[i];
      if (p === v || (v.opz.gruppo && p.opz.gruppo === v.opz.gruppo)) continue;
      var s = p.m.vis;
      if (contiene(s, v.m.vis)) continue;
      var ix = Math.min(x + v.w, s.r) - Math.max(x, s.l), iy = Math.min(y + v.h, s.b) - Math.max(y, s.t);
      if (ix > 0 && iy > 0 && ix * iy >= minimo) return true;
    }
    return false;
  }

  /* dove va la lettera di una parte: [v, x, y, strato, modo, ancora] oppure null (non si vede) */
  function posto(v, W, H, parti) {
    var m = v.m, sopra = m.sopra, w = v.w, h = v.h, o = v.opz, strato = v.fissa ? 'fisso' : 'doc';
    function xin(x) { return Math.min(Math.max(x, 2), W - w - 2); }

    if (o.cerchio) {
      var c = cerchioDi(m.elems[0].g), x, y;
      if (c.r < 40) { x = c.x + 0.71 * c.r + 2; y = c.y + 0.71 * c.r + 2; }
      else {
        x = Math.min(Math.max(c.x + 0.55 * c.r - w / 2, 4), W - w - 4);
        y = Math.min(Math.max(c.y + 0.55 * c.r - h / 2, sopra + 4), H - h - 4);
        if (!angoliNelCerchio(c, x, y, x + w, y + h, 2)) return null;
      }
      if (x < 2 || x + w > W - 2 || y < sopra + 2 || y + h > H - 2) return null;
      return [v, x, y, strato, 'cerchio', [c.x, c.y]];
    }

    /* 1 · l'angolo in alto (del primo elemento che lo mostra) si vede: la lettera sta lì */
    var alti = null;
    m.elems.forEach(function (q) {
      var yy = o.dentro ? q.t + 1 : q.t - h - 1;
      if (yy < sopra + 2 || q.t > H - 6 || q.r < 0 || q.l > W || !abbastanza(q, W, H, sopra)) return;
      if (!alti) alti = { l: q.l, t: q.t, r: q.r, b: q.b };
      else { if (q.l < alti.l) alti.l = q.l; if (q.t < alti.t) alti.t = q.t; if (q.r > alti.r) alti.r = q.r; if (q.b > alti.b) alti.b = q.b; }
    });
    if (alti) {
      var ya = o.dentro ? alti.t + 1 : alti.t - h - 1;
      if (ya + h > H - 2) return null;                 /* entra dal basso: la lettera arriva appena c'è posto */
      var xa = xin(Math.max(alti.l, 0) - 3), xb = xin(Math.min(alti.r, W) - w + 3);
      if (copre(v, xa, ya, parti) && !copre(v, xb, ya, parti)) return [v, xb, ya, strato, 'sopra-destra', [alti.r, alti.t]];
      return [v, xa, ya, strato, o.dentro ? 'dentro' : 'sopra', [alti.l, alti.t]];
    }

    /* 2 · l'angolo è passato sotto la testata: solo le parti grandi (e quelle della testata) tengono la lettera */
    if (o.resta || v.num === 0) {
      var s = m.vis;
      if (s.b - s.t >= (v.num === 0 ? 1 : 2 * h + 10) && abbastanza(m.tutto, W, H, sopra)) {
        /* ferma sotto la testata (strato fisso); se lì starebbe sopra un'altra parte (il telefono piccolo davanti al
           computer), nell'angolo a destra */
        var xs = xin(s.l - 3), xd = xin(s.r - w + 3);
        if (v.num !== 0 && copre(v, xs, sopra + 2, parti) && !copre(v, xd, sopra + 2, parti)) return [v, xd, sopra + 2, 'fisso', 'resta-destra', [s.r, sopra]];
        return [v, xs, sopra + 2, 'fisso', 'resta', [s.l, sopra]];
      }
    }
    return null;
  }

  var piazzate = [];
  function libera(x, y, w, h) {
    for (var i = 0; i < piazzate.length; i++) {
      var p = piazzate[i];
      if (x < p.x + p.w + 2 && x + w + 2 > p.x && y < p.y + p.h + 2 && y + h + 2 > p.y) return p;
    }
    return null;
  }
  function sistema(v, x, y, W) {
    var x0 = x;
    for (var n = 0; n < 40; n++) {
      var p = libera(x, y, v.w, v.h);
      if (!p) break;
      x = p.x + p.w + 3;
      if (x + v.w > W - 2) { x = x0; y = p.y + p.h + 2; }
    }
    piazzate.push({ x: x, y: y, w: v.w, h: v.h });
    return [x, y];
  }

  function scrivi(v, on, x, y, strato, modo, anc) {
    if (on) {
      if (strato !== v.strato) { strati[strato].appendChild(v.lab); v.strato = strato; v.dx = v.dy = NaN; }
      /* nello strato che scorre la posizione è quella nella pagina: se la parte non si muove, l'etichetta non va riscritta */
      var dx = Math.round(x + (strato === 'doc' ? (window.scrollX || window.pageXOffset || 0) : 0));
      var dy = Math.round(y + (strato === 'doc' ? (window.scrollY || window.pageYOffset || 0) : 0));
      if (dx !== v.dx || dy !== v.dy) { v.dx = dx; v.dy = dy; v.lab.style.transform = 'translate3d(' + dx + 'px,' + dy + 'px,0)'; }
      v.x = Math.round(x); v.y = Math.round(y); v.modo = modo; v.anc = anc;
    }
    if (on !== v.on) { v.on = on; v.lab.classList.toggle('on', on); }
  }

  var testata = null;
  function fotogramma() {
    requestAnimationFrame(fotogramma);
    if (!acceso) return;
    var W = document.documentElement.clientWidth || innerWidth, H = innerHeight;
    if (!testata || !testata.isConnected) testata = document.getElementById('testata');
    var hb = 0;
    if (testata) { var tr = testata.getBoundingClientRect(); if (tr.bottom > 0 && tr.bottom < H / 3) hb = tr.bottom; }
    piazzate.length = 0;
    var attivi = {}, mete = [];

    /* 1 · i blocchi grandi: il numero nell'angolo in alto a sinistra; quando l'inizio del blocco è passato sotto la
           testata, nella testata al centro (uno solo alla volta: il blocco che sta passando sotto la testata) */
    voci.forEach(function (v) {
      if (!v.macro) return;
      var m = misura(v, false), q = m && m.tutto;
      v.vicino = !!q && q.b > -H && q.t < 2 * H;
      if (!q || !v.vis || q.b <= (v.num ? hb : 0) || q.t >= H) return;
      attivi[v.num] = true;
      if (v.num === 0) { mete.push([v, Math.max(q.l, 0) + 2, Math.max(q.t, 0) + 2, 'fisso', 'blocco', [q.l, q.t]]); return; }
      if (q.t >= hb && q.t + 2 + v.h <= H - 1)
        mete.push([v, Math.min(Math.max(q.l, 0) + 2, W - v.w - 2), q.t + 2, v.fissa ? 'fisso' : 'doc', 'blocco', [q.l, q.t]]);
      else if (q.t < hb && q.b >= hb + 2 * v.h + 10)
        var mt = W >= 1024 && document.getElementById('marchio-testata'), mx = mt ? Math.round(mt.getBoundingClientRect().right + 14) : Math.round((W - v.w) / 2);
        mete.push([v, mx, Math.max(1, Math.round((hb - v.h) / 2)), 'fisso', 'testata', [mx + v.w / 2, 0]]);
    });

    /* 2 · le parti */
    var parti = [];
    voci.forEach(function (v) {
      if (v.macro) return;
      var b = blocchi[v.num];
      v.vicino = !!(b && b.vicino);
      v.m = null;
      if (!attivi[v.num] || !v.vis) return;
      var m = misura(v, true); if (!m) return;
      var sopra = v.num === 0 ? 0 : hb, q = m.tutto;
      var vis = { l: Math.max(q.l, 0), t: Math.max(q.t, sopra), r: Math.min(q.r, W), b: Math.min(q.b, H) };
      if (vis.r - vis.l < 1 || vis.b - vis.t < 1) return;
      m.vis = vis; m.sopra = sopra; v.m = m; parti.push(v);
    });
    var migliore = {};
    parti.forEach(function (v) { var g = v.opz.gruppo; if (g && (!migliore[g] || v.op > migliore[g].op)) migliore[g] = v; });
    parti = parti.filter(function (v) {
      if (v.opz.gruppo && migliore[v.opz.gruppo] !== v) return false;
      if (v.cop) {
        var g = v.cop.getBoundingClientRect(), c = cerchioDi({ l: g.left, t: g.top, r: g.right, b: g.bottom }), s = v.m.vis;
        if (angoliNelCerchio(c, s.l, s.t, s.r, s.b, 0)) return false;
      }
      return true;
    });
    parti.forEach(function (v) { var p = posto(v, W, H, parti); if (p) mete.push(p); });

    /* 3 · se due si toccano si sposta quella che viene dopo nella tabella (così l'ordine non cambia mentre si scorre) */
    mete.sort(function (a, b) { return a[0].i - b[0].i; });
    var accese = {};
    mete.forEach(function (p) { var s = sistema(p[0], p[1], p[2], W); scrivi(p[0], true, s[0], s[1], p[3], p[4], p[5]); accese[p[0].i] = 1; });
    voci.forEach(function (v) { if (!accese[v.i]) scrivi(v, false); });
  }

  function avvia() {
    if (host) return;
    crea(); cerca();
    /* il primo giro: posizioni e visibilità subito, poi i controlli a tempo */
    voci.forEach(function (v) { if (v.macro) { var m = misura(v, false); v.vicino = !!m; } });
    voci.forEach(function (v) { if (!v.macro) { var b = blocchi[v.num]; v.vicino = !!(b && b.vicino); } });
    lenta();
    setInterval(lenta, ATTESA_LENTA);
    setInterval(cerca, ATTESA_CERCA);
    requestAnimationFrame(fotogramma);
  }

  window.ETICHETTE = {
    tabella: TABELLA,
    mostra: function (si) { acceso = si !== false; if (host) host.style.setProperty('display', acceso ? 'block' : 'none', 'important'); },
    /* per gli strumenti di prova: le etichette che si vedono adesso, con posizione (sullo schermo) e misura */
    stato: function () {
      return voci.filter(function (v) { return v.on; }).map(function (v) { return { et: v.et, x: v.x, y: v.y, w: v.w, h: v.h }; });
    },
    /* in più: come è stata messa (modo), in quale strato, il riquadro visibile della parte e il punto a cui si appoggia */
    dettagli: function () {
      function r(n) { return Math.round(n); }
      return voci.filter(function (v) { return v.on; }).map(function (v) {
        var s = v.m && v.m.vis;
        return { et: v.et, x: v.x, y: v.y, w: v.w, h: v.h, modo: v.modo, strato: v.strato,
                 riq: s ? [r(s.l), r(s.t), r(s.r), r(s.b)] : null, anc: v.anc ? [r(v.anc[0]), r(v.anc[1])] : null };
      });
    },
    mancanti: function () { return voci.filter(function (v) { return !v.els.length; }).map(function (v) { return v.et + ' ' + v.sel; }); }
  };

  /* r3: da 1024 px la tabella è quella del computer (sezioni rinumerate): se la finestra passa la soglia si rifà tutto */
  try {
    var sogliaEt = matchMedia('(min-width:1024px)');
    var rifaiEt = function () {
      if (!host) return;
      var nuova = TABELLA_ORA(); if (nuova === TABELLA) return;
      if (host.parentNode) host.parentNode.removeChild(host);
      host = null; voci = []; blocchi = {}; avvisati = {}; TABELLA = nuova; window.ETICHETTE.tabella = TABELLA;
      crea(); cerca();
      voci.forEach(function (v) { if (v.macro) { var m = misura(v, false); v.vicino = !!m; } });
      voci.forEach(function (v) { if (!v.macro) { var b = blocchi[v.num]; v.vicino = !!(b && b.vicino); } });
      lenta();
      if (!acceso) host.style.setProperty('display', 'none', 'important');
    };
    if (sogliaEt.addEventListener) sogliaEt.addEventListener('change', rifaiEt); else if (sogliaEt.addListener) sogliaEt.addListener(rifaiEt);
  } catch (e) {}

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvia);
  else avvia();
})();
