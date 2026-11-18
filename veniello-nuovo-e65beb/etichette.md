# Etichette di prova dell'anteprima N: la mappa (18/11)

Solo per la fase di prova: Niccolò vede sul sito numeri e lettere verdi e dice, per esempio, «sposta la 7d».
**Numero** = un blocco grande della pagina (nell'ordine in cui si scorre); **numero + lettera** = una parte di quel blocco.
Lo script è quello della D (`d/prova-etichette.js`, stesso funzionamento) con una tabella nuova: `n/prova-etichette.js`.

**Attenzione: i numeri non sono quelli della D** (qui l'ordine della pagina è quello del sito online). La chat del
Virtual Assistant, che nella D era 5b-5e, qui è **7b-7e** (stesse lettere: b testa, c messaggi, d riepilogo, e etichetta).

- **Togliere le etichette**: cancellare da `n/index.html` le due righe in fondo, subito prima di `</body>`:
  `<!-- ETICHETTE DI PROVA … -->` e `<script src="prova-etichette.js"></script>`; poi cancellare `n/prova-etichette.js`
  (e, se si vuole, questo file). Per guardare il sito senza etichette senza toglierle: `?etichette=0` in fondo all'indirizzo.
- **Rifare lo script** dopo aver cambiato la tabella (`_lavoro/n/pezzi/tabella-etichette.js`):
  `PYTHONIOENCODING=utf-8 python _lavoro/n/etichette-script.py` (dalla cartella `sito-mobile-2026`).
- Le etichette stanno in uno strato fuori dal `<body>`: l'impaginazione del sito non cambia.
- Il **puntino arancio** che viaggia (`#punto`) non ha un'etichetta: se Niccolò parla del «puntino» è lui.
- **L'anteprima del Sito Web (6b, 6c, 6d)** è innestata (18/11): le classi **`.sa-frase`** (la frase), **`.sa-tel`** (il
  telefono), **`.sa-pc`** (il computer, si vede solo alla fine) ci sono. `ETICHETTE.mancanti()` è vuoto.
- **Aspetto (18/11, «ancora meno invasive»)**: niente pillola scura e niente contorno, solo il testo verde acceso #39FF14 in
  Geist Mono, numeri 10 px e lettere 9 px, opacità 0,85, con un'ombra scura sottile per leggerle sul chiaro. Stanno appena
  sopra l'angolo in alto a sinistra della parte (le domande e i passi dentro la riga). Lo stile lo mette
  `_lavoro/n/etichette-script.py` sopra quello della D (la D resta con le pillole).

## 0 · La testata (fissa in alto)
- 0 — la testata
- 0a — il marchio piccolo «Veniello·studio» (sparisce durante l'apertura, poi torna)
- 0b — il menu Partner · Come funziona · Servizi · Domande (solo da computer)
- 0c — il pulsante «Scrivici»

## 1 · L'apertura (i tre momenti della D)
- 1 — tutta l'apertura
- 1a — il titolo «Fatti trovare. Fatti *scegliere*.»
- 1b — il nome «Veniello·studio» sull'arancio
- 1c — la V grande del logo
- 1d — l'arancio: il punto di «scegliere» che si allarga e poi torna nel puntino del logo
- 1e — lo sfondo con le luci (la macchia)

## 2 · Partner (i blocchi pieni della D)
- 2 — il blocco dei partner
- 2a — l'etichetta «Partner»
- 2b — il titolo «Chi ha scelto **Veniello Studio**.»
- 2c — «Le attività con cui lavoriamo ogni mese.»
- 2d — la card del Jué Club (foto del bancone)
- 2e — la card di Elena Baldi Wedding Planner
- 2f — la card di GB Gioielli
- 2g — la card arancio «La tua attività, *qui*.»

## 3 · Come funziona (dal sito online)
- 3 — il blocco
- 3a — l'etichetta «Come funziona»
- 3b — il titolo «Prima lo vedi. **Poi decidi**.»
- 3c — la carta 01 «Ci scrivi»
- 3d — la carta 02 «Ti prepariamo l'anteprima» (con «Gratis»)
- 3e — la carta 03 «Se ti piace, va online»
- 3f — il binario con le tre stazioni (al telefono il treno è il puntino)

## 4 · Servizi: l'ingresso
- 4 — l'ingresso dei servizi
- 4a — l'etichetta «Servizi»
- 4b — il titolo «Tutto quello che serve per farti **scegliere**.»
- 4c — «Quattro pacchetti. Prendi quello che ti serve…»

## 5 · Creazione Contenuti
- 5 — il pacchetto
- 5a — il riquadro col video dello spot (gira una volta quando si vede)
- 5b — il titolo «Creazione Contenuti.»
- 5c — «Video, foto e stories per i tuoi social, anche con l'IA.»
- 5d — «Scopri i dettagli +» (e l'elenco che si apre)

## 6 · Sito Web
- 6 — il pacchetto
- 6a — il riquadro dell'anteprima animata del sito (il telefono che cambia aspetto, poi anche il computer)
- 6b — l'anteprima: la frase («Completamente personalizzabile» → «E su tutti i tuoi dispositivi») — classe `.sa-frase`
- 6c — l'anteprima: il telefono — classe `.sa-tel`
- 6d — l'anteprima: il computer (compare alla fine) — classe `.sa-pc`
- 6e — il titolo «Sito Web.»
- 6f — «Chi sei, cosa fai e un tasto per chiamarti.»
- 6g — «Scopri i dettagli +»

## 7 · Virtual Assistant
- 7 — il pacchetto
- 7a — il riquadro con la chat di WhatsApp
- 7b — la testa della chat «23:47 · Oreficeria Bianchi · online / sta scrivendo…» (nella D 5b)
- 7c — i messaggi della chat (nella D 5c)
- 7d — il riquadro «Riepilogo per il titolare» (nella D 5d)
- 7e — l'etichetta «Esempio · WhatsApp» (nella D 5e)
- 7f — il titolo «Virtual Assistant.»
- 7g — «Risponde ai tuoi clienti su WhatsApp, anche quando non puoi.»
- 7h — «Scopri i dettagli +» (con «Prenota un'anteprima»)

## 8 · Campagna Pubblicitaria 360°
- 8 — il pacchetto speciale
- 8a — «Pacchetto speciale»
- 8b — il titolo «Campagna Pubblicitaria 360°.»
- 8c — «Contenuti, sito e Virtual Assistant insieme…»
- 8d — il pulsante «Parliamone»
- 8e — «Cosa comprende» e le tre voci
- 8f — la nota «Siti, video e grafiche: lavori veri…» (sotto la Campagna)

## 9 · Domande
- 9 — il blocco
- 9a — l'etichetta «Domande»
- 9b — il titolo «Le domande che ci fanno **tutti**.»
- 9c — «L'anteprima è davvero gratis?»
- 9d — «Ci sono altre spese oltre al prezzo?»
- 9e — «Il sito resta mio?»
- 9f — «Quanto costa?»
- 9g — «Le foto da dove le prendete?»
- 9h — «Venite voi a fare le riprese?»
- 9i — «In che zona lavorate?»
- 9j — «Cosa devo fare io per avere il Virtual Assistant?»
(ogni lettera vale per la domanda e per la risposta che si apre sotto)

## 10 · Contatti
- 10 — il blocco
- 10a — l'etichetta «Contatti»
- 10b — il titolo «Vuoi vedere il tuo **sito?**»
- 10c — «Scrivici su WhatsApp il nome della tua attività…»
- 10d — il pulsante «Scrivici su WhatsApp»
- 10e — il pulsante «Chiama»
- 10f — il riquadro del telefono (Giuseppe Fusciello)
- 10g — il riquadro dell'email
- 10h — il riquadro «Dove»

## 11 · La striscia dei loghi che scorre

## 12 · Il piede
- 12 — il piede
- 12a — il marchio grande «Veniello·studio» (dove cade il puntino alla fine)
- 12b — la riga «Siti, Google, social e video · … · Niente cookie, niente tracciamenti.»
