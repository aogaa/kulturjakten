# Endringslogg og beslutninger

En kronologisk logg over hva som er bygget, hvilke valg som er tatt, og tekniske feller
verdt å huske. Ment som hukommelse for fremtidig vedlikehold (én person over tid).
For den autoritative, oppsummerte tilstanden: se [`CLAUDE.md`](CLAUDE.md) §0.

---

## 2026-06-09 — Bygget og lansert (v1)

Hele prosjektet ble bygget, verifisert og publisert live denne dagen.

### Beslutninger ved oppstart
- **Hosting:** eget repo + underdomene `kulturjakten.frivilligsentralen.org`, servert fra
  repo-rot. `CNAME`-fil i rot.
- **Klasser:** Barn / Voksen / Senior (ikke Sykkel).
- **Kartverket WMTS:** cache-tjenesten
  `https://cache.kartverket.no/v1/wmts/1.0.0/topo/default/webmercator/{z}/{y}/{x}.png`
  (Web Mercator, ingen API-nøkkel). Den gamle tjenesten fases ut.

### Milepæl 0 + 1 — skjelett og hele kjeden for ett sted
- Mappestruktur, `index.html`, `style.css`, `steder.js`, og delt JS-logikk
  (`jakt.js`, `kart.js`, `registrering.js`, `ledertavle.js`).
- Verifisert ende-til-ende: kart → stedsside → registrering → poeng → localStorage +
  Firestore → ledertavle med klassefilter.

### Firebase
- Firestore-prosjekt `kulturjakten-1e9a7`. Web-config i `assets/js/firebase-config.js`
  (ikke en hemmelighet for web-apper; sikkerheten ligger i reglene).
- Regler publisert: offentlig lesing; skriving med enkel formvalidering.
- **Felle:** reglene tillater **ikke** delete fra klient. Testrader (f.eks. `TestSkogmus`,
  `TestVerifiser`) må slettes manuelt i Firebase-konsollen (Firestore → Data → `ledertavle`).

### Moderering av kallenavn
- `assets/js/forbudteord.js`: blokkliste med normalisering (store bokstaver, mellomrom,
  enkel leetspeak som `p1kk`). Lag 1 hindrer registrering; lag 2 maskerer på ledertavla.
- Ikke vanntett (omgåelig via konsoll; fanger ikke målrettede «rene» navn). Reaktiv sletting
  i Firestore er bakstopper. Lista (`LISTE`) utvides ved behov.

### Milepæl 2 — polering
- Manuell kode-inntasting på forsiden (QR-reserve, bruker `finnStedMedKode`).
- Egen markørfarge for besøkte steder (grønn ✓ vs. oransje) via `divIcon` i `kart.js`,
  med tegnforklaring.
- Responsivt, mobil først (verifisert 375px uten overflyt).

### Poeng krever stolpekoden i URL-en (`?k=<kode>`)
- Registrering/poeng skjer **kun** når stedssiden åpnes med `?k=<kode>` (samme `kode` som i
  `steder.js`). Uten/feil kode = ren lesemodus, ingen poeng.
- **Hvorfor:** tetter «poeng fra sofaen» — å klikke seg til en stedsside fra kartet eller en
  lenke skal ikke gi poeng, bare det å fysisk skanne QR (eller taste koden) ved stolpen.
- **Konsekvens:** QR-koden MÅ peke til `.../steder/<id>.html?k=<KODE>`, ikke den nakne URL-en.
- Logikk i `registrering.js` (leser `?k=` selv); manuell inntasting legger på `?k=` automatisk.
- Verifisert: lesemodus/feil kode = 0 poeng; riktig kode = +100; andre besøk = idempotent.

### serve.json (kun lokal testing)
- `{ "cleanUrls": false, "trailingSlash": false, "rewrites": [{ "/" → "/index.html" }] }`.
- `cleanUrls:false` hindrer at `npx serve` redirecter `.html?k=...` til ren URL og mister
  koden lokalt. Men det slår samtidig av automatisk index-servering på `/`, derav rewriten.
- **Feller:** `serve` avviser ukjente nøkler (måtte fjerne en `_kommentar`). Restart serveren
  etter endringer. Preview-/nettleseren kan cache gamle 301-redirects fra før fila fantes —
  bruk cache-buster eller hard refresh hvis `.html?k=` redirecter bort koden.
- GitHub Pages ignorerer fila (serverer `index.html` på `/` selv; serverer `.html?k=` direkte).

### Første ekte sted
- **Møteplass Vinderen** — `id: moteplass-vinderen`, kode `VAFS-01`,
  `lat 59.943133, lng 10.704232` (konvertert fra UTM `260093.04, 6652867.77`, EPSG:25833).
- Ekte tekst + 3 bilder i `assets/img/steder/moteplassen/` (moteplass1, anita, moteplass2).

### Logo og visuell identitet
- VAFS-logo (`assets/img/ui/vafs-logo.png`) på hvit badge i den delte grønne headeren på
  alle sider, midtstilt: logo → «Stiftelsen Vestre Aker Frivilligsentral»
  (lenke til `https://frivilligsentralen.org/om-oss.html`) → sidetittel.
- Footer-banner (`.bunn`) med © + samme org-lenke. Stiler: `.topp-logo`, `.topp-org`, `.bunn`.

### Forside-redesign («golden circle»)
- `index.html` bygget om for å «selge» konseptet. Rekkefølge: delt header → fullbredde hero
  (bilde + grønt overlegg + krok) → Hvorfor → Hva (med dynamisk antall steder fra
  `STEDER.length`) → Hvordan (4 nummererte `.steg` + «Kom i gang»-knapp) → kom-i-gang-skjema
  (`#start`) → kart → manuell kode → ledertavle.
- Hero-bilde levert som `assets/img/ui/hero.png` (3,2 MB), optimalisert til `hero.jpg`
  (1500×844, q72, ~290 KB) for å holde mobilsiden lett. CSS bruker `.jpg`; `.png` beholdt
  som kilde.
- Steg 1 fremhever at alt er anonymt.

### Lansering (GitHub Pages)
- Repo `aogaa/kulturjakten` gjort **offentlig** (Pages krever public på gratisplan),
  branch `main`, Pages-kilde `main`/rot, Enforce HTTPS på.
- DNS var allerede satt opp → `https://kulturjakten.frivilligsentralen.org/` svarte 200 med
  en gang. Verifisert live: forside, stedsside med `?k=VAFS-01`, ledertavle, bilder = 200.
- Holmenkollen-eksempelet fjernet før lansering (kun Møteplass Vinderen gjenstår).
- `.gitignore` utelater `.claude/` (lokal verktøyconfig).

### Dokumentasjon
- `CLAUDE.md §0` lagt til (faktisk tilstand, beslutninger, avvik — leses først).
- `LEGGE-TIL-STED.md` (runbook: Espen sender tekst + bilder → Claude lager siden og
  returnerer kode + QR-URL; inkluderer kode-register).

---

## 2026-06-10 — Sted nr. 2 + klasser fjernet

### Nytt sted: Frøen politistasjon (VAFS-02)
- `steder/froen-politistasjon.html`, id `froen-politistasjon`, lat 59.939396 lng 10.703714
  (fra UTM 260037.13,6652454.01 EPSG:25833). To bilder i `assets/img/steder/froen/` med
  bildetekster i `<figure>`/`<figcaption>` (ny CSS: `.ingress`, `figure`, `figcaption`).

### Beslutning: klassene (Barn/Voksen/Senior) fjernet
- **Hvorfor:** alle poeng kommer fra de samme stolpene — et barn og en voksen som finner
  de samme stedene får identisk poengsum, så klassene korrigerte ikke for noe. De ga bare
  mening for å kåre flere vinnere, og det var ikke planlagt. Uten klasse er terskelen
  lavere (kun kallenavn) og det er mindre å vedlikeholde.
- **Endret:** `jakt.js` (KLASSER + `klasse` i tilstand fjernet; `settProfil(kallenavn)`),
  `registrering.js` + `index.html` (klassevalg ut av skjemaene), `ledertavle.html`
  (klassefilter + Klasse-kolonne fjernet), `ledertavle.js` (skriver ikke `klasse`),
  `.filter`-CSS fjernet, tekster oppdatert (forside, `_mal.html`, begge stedssidene),
  README + CLAUDE.md §0 + OVERSETTE.md oppdatert.
- **Felle/migrering:** Firestore-reglene krevde `klasse is string` ved skriving — de må
  oppdateres i Firebase-konsollen (fjern klasse-linjen, se README §Firebase) **FØR** koden
  pushes, ellers avvises alle poeng-skrivinger stille (`console.warn`). Løsere regler
  brekker ikke gammel kode (ekstra felt er lov uten `hasOnly`). Gamle rader/localStorage
  med `klasse`-felt er ufarlige: feltet ignoreres ved lesing og forsvinner ved neste
  skriving.

---

## 2026-06-10 — Forsiden oversatt til ukrainsk (`uk`)

Første implementering av flerspråk per `OVERSETTE.md`. Omfang: kun `index.html`.

### Hva som ble lagt til
- `assets/js/i18n.js` — ordbok med kolonner `nb` og `uk`, og funksjonene
  `gjeldendeSprak()`, `settSprak(kode)`, `t(nokkel)`, `bruk(rot)` samt
  `pluralKategori(n, sprak)` + `plural(nokkel, n)` for språk med flere flertallsformer.
  Initialiseres ved import (setter `<html lang>` og kjører `bruk()`) og sender
  CustomEvent `sprakbytte` ved språkendring så side-skript kan re-rendre dynamisk
  innhold.
- `assets/img/ui/flag-no.svg` + `flag-ua.svg` — flagg som SVG (emoji-flagg vises
  som bokstaver på Windows).
- `.sprakvelger`-stiler i `style.css` (to flaggknapper øverst til høyre i den
  grønne headeren, markert `.aktiv`). `.topp` fikk `position: relative` for å huse
  den absolutt-posisjonerte velgeren.
- `index.html`: `data-i18n` (textContent), `data-i18n-html` (innerHTML),
  `data-i18n-attr="placeholder:nokkel"` (attributter) på all synlig tekst.
  Inline-skriptet bruker `t(...)` for JS-genererte strenger (hilsen, knapper,
  feilmeldinger) og lytter på `sprakbytte` for å re-rendre profil-seksjon og
  «Hva»-paragraf.

### Pluraliseringen (Hva-paragrafen)
Slavisk grammatikk krever at både substantiv og verb stemmer med tallet:
1 → entall, 2–4 → få, 5+ → mange (med 11–14-unntak). Løsning: dele paragrafen i
tre nøkler — `hva_tekst_pre` + `plural("hva_steder_navn", n)` + `plural("hva_tekst_post", n)`
— og bygge HTML-en i side-skriptet. Verifisert for `n` = 1, 2, 5, 11, 21, 22, 25, 101, 102:
- uk 2 → «2 місця чекають на відкриття.» (entall verb «чекає» for n=1)
- uk 5 → «5 місць чекають на відкриття.»

### Verifisert
- Norsk default + bytte til ukrainsk + bytte tilbake. Språkvalg vedvarer over
  reload (localStorage `vafs_sprak`).
- Hero, alle seksjoner, steg, skjema, knapper, feilmeldinger (kode-skjema og
  profil-skjema) oversettes. `<html lang>` følger valget.
- Mobil 375px: språkvelgeren får plass uten visuell kollisjon med logo.
- Ingen konsollfeil.

### Felle som ble unngått
Første utkast la hele paragrafen i ordboknøkkelen som ferdig HTML
(`data-i18n-html="hva_tekst"`). Det gjorde at «2 місць чекають» kom ut feil
(skulle vært «2 місця чекають»). Løsningen var å splitte teksten og legge til en
pluraliseringshjelper — gjør i18n-laget korrekt for slaviske språk uten å øke
kompleksiteten merkbart på norsk siden.

### Åpent
- Ukrainsk korrektur av en native taler — alt ligger samlet i `i18n.js`-objektet
  `OVERSETTELSER.uk`, ett sted å rette.
- Stedssider + ledertavle ikke oversatt enda; samme `i18n.js` utvides senere
  (legg `data-i18n` + inkluder script + flaggvelger i delt header).

---

## Gjenstår (per 2026-06-10)
- **Espen: oppdatere Firestore-reglene (fjerne `klasse`-kravet) — deretter pushe
  klasse-fjerningen.**
- Rydde testrader i Firestore-ledertavla (manuelt i konsollen).
- Milepæl 3: generere QR-koder (med `?k=<KODE>`) til `/qr/`; fylle inn flere steder.
- Ukrainsk korrekturlesing av forsiden (`OVERSETTELSER.uk` i `assets/js/i18n.js`).
- Senere: utvide ukrainsk til stedssider + ledertavle.
- (Valgfritt) sette `MAILERLITE_URL` i `index.html` for nyhetsbrev-seksjonen.
