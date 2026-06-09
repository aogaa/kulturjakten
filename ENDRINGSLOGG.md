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

## Gjenstår (per 2026-06-09)
- Rydde testrader i Firestore-ledertavla (manuelt i konsollen).
- Milepæl 3: generere QR-koder (med `?k=<KODE>`) til `/qr/`; fylle inn flere steder.
- (Valgfritt) sette `MAILERLITE_URL` i `index.html` for nyhetsbrev-seksjonen.
