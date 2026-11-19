# NB: anteprima solo telefono con la linea verticale (20/11). Etichette uguali a N, più la 2g.

# Etichette di prova dell'anteprima N: la mappa (18/11, rinumerata dopo i ritocchi della pallina)

Solo per la fase di prova: Niccolò vede sul sito numeri e lettere verdi e dice, per esempio, «sposta la 6d».
**Numero** = un blocco grande della pagina (nell'ordine in cui si scorre); **numero + lettera** = una parte di quel blocco.
Lo script è quello della D (`d/prova-etichette.js`, stesso funzionamento) con una tabella nuova: `n/prova-etichette.js`.

**18/11, ritocchi della pallina: i Partner sono andati in fondo ai servizi e i numeri seguono di nuovo l'ordine della
pagina.** Vecchio → nuovo: **2 → 8** (Partner), **3 → 2** (Come funziona), **4 → 3** (Servizi, l'ingresso),
**5 → 4** (Creazione Contenuti), **6 → 5** (Sito Web), **7 → 6** (Virtual Assistant), **8 → 7** (Campagna 360°);
0, 1 e 9-12 restano uguali; le lettere dentro ogni blocco restano le stesse. Il titolo della Campagna era 8b, ora è **7b**.

**Attenzione: i numeri non sono quelli della D** (qui l'ordine della pagina è quello del sito online, con i Partner in
fondo ai servizi). La chat del Virtual Assistant, che nella D era 5b-5e, qui è **6b-6e** (stesse lettere: b testa,
c messaggi, d riepilogo, e etichetta).

- **Togliere le etichette**: cancellare da `n/index.html` le due righe in fondo, subito prima di `</body>`:
  `<!-- ETICHETTE DI PROVA … -->` e `<script src="prova-etichette.js"></script>`; poi cancellare `n/prova-etichette.js`
  (e, se si vuole, questo file). Per guardare il sito senza etichette senza toglierle: `?etichette=0` in fondo all'indirizzo.
- **Rifare lo script** dopo aver cambiato la tabella (`_lavoro/n/pezzi/tabella-etichette.js`):
  `PYTHONIOENCODING=utf-8 python _lavoro/n/etichette-script.py` (dalla cartella `sito-mobile-2026`).
- Le etichette stanno in uno strato fuori dal `<body>`: l'impaginazione del sito non cambia.
- Il **puntino arancio** che viaggia (`#punto`) non ha un'etichetta: se Niccolò parla del «puntino» è lui.
- **L'anteprima del Sito Web (5b, 5c, 5d)**: le classi **`.sa-frase`** (la frase), **`.sa-tel`** (il telefono),
  **`.sa-pc`** (il computer, si vede solo alla fine). `ETICHETTE.mancanti()` è vuoto (controllato a 390 e 1280).
- **Aspetto (18/11, «ancora meno invasive»)**: niente pillola scura e niente contorno, solo il testo verde acceso #39FF14 in
  Geist Mono, numeri 10 px e lettere 9 px, opacità 0,85, con un'ombra scura sottile per leggerle sul chiaro. Stanno appena
  sopra l'angolo in alto a sinistra della parte (le domande e i passi dentro la riga). Lo stile lo mette
  `_lavoro/n/etichette-script.py` sopra quello della D (la D resta con le pillole).

## 0 · La testata (fissa in alto)
- 0 — la testata
- 0a — il marchio piccolo «Veniello·studio» (sparisce durante l'apertura, poi torna)
- 0b — il menu Come funziona · Servizi · Partner · Domande (solo da computer)
- 0c — il pulsante «Scrivici»

## 1 · L'apertura (i tre momenti della D)
- 1 — tutta l'apertura
- 1a — il titolo «Fatti trovare. Fatti *scegliere*.»
- 1b — il nome «Veniello·studio» sull'arancio
- 1c — la V grande del logo
- 1d — l'arancio: il punto di «scegliere» che si allarga e poi torna nel puntino del logo
- 1e — lo sfondo con le luci (la macchia)
- 1f — il cerchietto di aggiornamento: in cima alla pagina, tirando giù, il punto di «scegliere» sale sopra il titolo e diventa un cerchietto (si vede solo mentre si tira)

## 2 · Come funziona (dal sito online; prima era 3)
- 2 — il blocco
- 2a — l'etichetta «Come funziona»
- 2b — il titolo «Prima lo vedi. **Poi decidi**.» (la prima tappa del puntino dopo l'apertura)
- 2c — la carta 01 «Ci scrivi»
- 2d — la carta 02 «Ti prepariamo l'anteprima» (con «Gratis»)
- 2e — la carta 03 «Se ti piace, va online»
- 2f — il binario con le tre stazioni (al telefono il treno è il puntino)
- 2g — **(solo NB)** la linea verticale a destra su cui corre la pallina dalla stazione «Online» fino a 7b (il «°» del 360), con le tacche: lunghe ai capitoli («…farti scegliere» dei Servizi, «Abbonamenti»), corte ai pacchetti (Creazione Contenuti, Sito Web, Virtual Assistant)

## 3 · Servizi: l'ingresso (prima era 4)
- 3 — l'ingresso dei servizi (l'etichetta sta nel margine a sinistra di «SERVIZI», per non coprirlo)
- 3a — l'etichetta «Servizi»
- 3b — il titolo «Tutto quello che serve per farti **scegliere**.»
- 3c — «Quattro pacchetti. Prendi quello che ti serve…»

## 4 · Creazione Contenuti (prima era 5)
- 4 — il pacchetto (l'etichetta sta nel margine a sinistra, non sul video)
- 4a — il riquadro col video dello spot (gira una volta quando si vede)
- 4b — il titolo «Creazione Contenuti.»
- 4c — «Video, foto e stories per i tuoi social, anche con l'IA.»
- 4d — «Scopri i dettagli +» (e l'elenco che si apre)

## 5 · Sito Web (prima era 6)
- 5 — il pacchetto
- 5a — il riquadro dell'anteprima animata del sito (il telefono che cambia aspetto, poi anche il computer)
- 5b — l'anteprima: la frase («Completamente personalizzabile» → «E su tutti i tuoi dispositivi») — classe `.sa-frase`; al
  telefono il suo punto arancio compare quando ci entra la pallina (dal 18/11 sera)
- 5c — l'anteprima: il telefono — classe `.sa-tel`
- 5d — l'anteprima: il computer (compare alla fine) — classe `.sa-pc`
- 5e — il titolo «Sito Web.»
- 5f — «Chi sei, cosa fai e un tasto per chiamarti.»
- 5g — «Scopri i dettagli +»

## 6 · Virtual Assistant (prima era 7)
- 6 — il pacchetto
- 6a — il riquadro con la chat di WhatsApp
- 6b — la testa della chat «23:47 · AnomiaLabs · online / sta scrivendo…» (nella D 5b); al telefono il puntino
  arancio della foto profilo è una tappa: compare quando ci entra la pallina
- 6c — i messaggi della chat (nella D 5c)
- 6d — il riquadro «Riepilogo per il titolare» (nella D 5d); al telefono il suo pallino è un anellino arancio: a chat
  finita la pallina ci passa (lo riempie) andando da 6b a 6f
- 6e — l'etichetta «Esempio · WhatsApp» (nella D 5e)
- 6f — il titolo «Virtual Assistant.»
- 6g — «Risponde ai tuoi clienti su WhatsApp, anche quando non puoi.»
- 6h — «Scopri i dettagli +» (con «Prenota un'anteprima»)

## 7 · Campagna Pubblicitaria 360° (prima era 8)
- 7x — l'etichetta «Abbonamenti» (con la linea leggera da bordo a bordo sopra)
- 7 — il pacchetto speciale
- 7a — «Pacchetto speciale»
- 7b — il titolo «Campagna Pubblicitaria 360°» (il puntino si posa nel «°» e l'arancio dilaga su tutto il titolo: prima
  «360», poi «Campagna» e «Pubblicitaria» insieme; scorrendo ancora il bianco torna da destra a sinistra e l'arancio si
  riunisce in pallina a sinistra del titolo, che riparte verso 8b)
- 7c — «Contenuti, sito e Virtual Assistant insieme…»
- 7d — il pulsante «Parliamone»
- 7e — «Cosa comprende» a tendina, con le tre voci
- 7f — la nota «Siti, video e grafiche: lavori veri…» (sotto la Campagna)

## 8 · Partner (i blocchi pieni della D; prima era 2, ora in fondo ai servizi come nella D)
- 8 — il blocco dei partner
- 8a — l'etichetta «Partner»
- 8b — il titolo «Chi ha scelto **Veniello·studio**.» («Veniello Studio» scritto come il logo): l'ultima tappa del
  puntino è il puntino arancio del logo (ci arriva tagliando «Veniello» come una linea fine)
- 8c — «Le attività con cui lavoriamo ogni mese.»
- 8d — la card del Jué Club (foto del bancone)
- 8e — la card di Elena Baldi Wedding Planner
- 8f — la card di GB Gioielli
- 8g — la card arancio «La tua attività, *qui*.»

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
- 12a — il marchio grande «Veniello·studio» (col suo puntino arancio fermo, come nella testata)
- 12b — la riga «Siti, Google, social e video · … · Niente cookie, niente tracciamenti.»
