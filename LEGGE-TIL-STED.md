# Legge til et nytt sted — slik jobber vi sammen

Dette er oppskriften for å legge ut en ny stolpe/stedsside i Kulturjakten. Den er skrevet
både til **deg (Espen)** — så du vet hva du skal sende — og til **Claude** — som en runbook
med faste steg og et kode-register som skal holdes oppdatert.

> Kort sagt: Du sender tekst, bilder og hvor stedet er. Claude lager siden, velger
> stolpekode og pusher den live, og sender deg **koden til stolpen** + **QR-URL-en**.

---

## 1. Det DU sender meg

For hvert nytt sted, gi meg:

1. **Stedets navn** — f.eks. «Holmenkollen kapell».
2. **Hvor stedet er** — helst koordinater (`lat, lng`, f.eks. `59.9639, 10.6680`).
   - Har du bare UTM (EPSG:25833, som fra norgeskart.no): send tallene, så konverterer jeg.
   - Har du bare en adresse / et stedsnavn: send det, så finner jeg koordinatene og du
     bekrefter at markøren havner riktig.
3. **Historisk tekst** — ferdig tekst, gjerne delt i avsnitt.
   - Du trenger ikke å pre-strukturere. Jeg bearbeider den lett etter mønsteret
     fra Grimelund gård (se §2.4 nedenfor): kort ingress, 3–5 underseksjoner med
     `<h3>`, bilder fordelt fornuftig. Alle fakta beholdes. Si fra hvis du heller
     vil at jeg lar teksten stå akkurat som du sendte den.
4. **Bilder** (valgfritt, men anbefalt):
   - Legg bildefilene i en mappe under `assets/img/steder/<kort-mappenavn>/`
     (f.eks. `assets/img/steder/holmenkollen/`), og send meg **filnavnene** + en kort
     beskrivelse av hvert bilde (brukes som alt-tekst).
   - Si gjerne hvor i teksten hvert bilde skal stå (ellers fordeler jeg dem fornuftig).
5. **Kilder** — liste over kildene du har brukt for det historiske stoffet.
   - Send hver kilde som **navn + URL der det finnes** (jeg gjør navnet klikkbart).
     Format: én kilde per linje. Ingen ekstra beskrivelse nødvendig.
   - Eksempler: «Akersposten — Heftyevillaen, 2022 https://akersposten.no/…»,
     «Vestre Aker historielag, samtale med X», «Store norske leksikon — Thomas
     Heftye https://snl.no/Thomas_Heftye».
   - Kildelista vises i en egen pent formatert boks rett under brødteksten på
     stedssiden. Står oversetjeren bommer du ingenting: kildenavn og titler
     oversettes ikke (akademisk konvensjon), kun overskriften «Kilder» / «Джерела».
6. **Valgfritt:**
   - **Poeng** for stedet (standard er **100** hvis du ikke sier noe).
   - **Kort kart-tekst** (1 setning som vises i kart-popup). Lager jeg ellers selv fra teksten.

Du trenger **ikke** finne på stolpekode eller id — det gjør jeg, så de blir unike.

---

## 2. Det JEG (Claude) gjør

1. Velger en **`id`** (kebab-case av navnet, f.eks. `holmenkollen-kapell`). Unik, brukes i
   URL og localStorage — endres aldri etter publisering.
2. Tildeler **neste ledige stolpekode** fra registeret under (VAFS-02, VAFS-03 …).
3. Kopierer `steder/_mal.html` → `steder/<id>.html`, fyller inn navn, tekst og bilder,
   setter `STED_ID`.
4. **Bearbeider teksten lett** etter mønsteret fra Grimelund gård
   ([`steder/grimelund-gard.html`](steder/grimelund-gard.html) er referansen):
   - Beholder **alle fakta og navn**, men strammer lange avsnitt.
   - Legger til en kort **ingress** (`<p class="ingress">`) som hekter leseren
     med ett konkret bilde, ikke en abstrakt åpning.
   - Bryter opp stoffet med 3–5 `<h3>`-underseksjoner med korte, konkrete titler
     («Hva betyr navnet?», «Eierne gjennom 700 år», «Tunet», «Hoppbakke og
     hemmelige møter»). Særlig viktig hvis teksten er over ~4 avsnitt.
   - Plasserer bildene i `<figure>` med `<figcaption>` for kreditering: ett
     tidlig som visuelt anker, de andre ved tematisk relevante avsnitt.
   - **Tone:** varm, anekdotisk, ikke oppslagsverk — samme stemme som de
     allerede publiserte stedssidene.
   - Korrigerer åpenbare typografiske feil i navn og diakritikk (f.eks.
     «Thorèn» → «Thorén», «Anders Beers Wilse» → «Anders Beer Wilse»).
   - Optimaliserer bilder over ~1 MB ned til ≤1500px / JPEG q72 med
     PowerShell/System.Drawing (mobil i felt med dårlig dekning).
   - Ber om ukrainsk versjon kun hvis du sender den. Du kan be om
     oversettelse i etterkant — da legges en `<div data-sprak="uk">`-blokk
     parallelt med nb-blokken (samme struktur + figcaptions oversatt).
   - **Kilder** fra ditt steg §1.5 settes inn i en `<section class="kort kilder">`
     mellom brødteksten og kart-utsnittet. Hvert navn med URL gjøres klikkbart
     (`<a href="…" target="_blank" rel="noopener">`). Boksen skjules
     automatisk så lenge `<ul>` er tom (CSS-regel `:not(:has(li))`), så en
     stedsside uten kilder ennå viser ingen «Kilder»-boks. Mønsteret står i
     [`steder/_mal.html`](steder/_mal.html) og er likt for alle sider.
5. Legger til raden i `assets/js/steder.js` (`id`, `navn`, `kode`, `poeng`, `lat`, `lng`,
   `side`, `kortbeskrivelse`). Hvis du har sendt ukrainsk variant av navn/kortbeskrivelse,
   legges de inn som valgfrie `navn_uk` / `kortbeskrivelse_uk` ved siden av — mangler de
   viser kart-popupen norsk fallback.
6. Tester lokalt (kart-markør, lesemodus uten kode, registrering med `?k=`).
7. `git commit` + `git push` til `main` → GitHub Pages bygger automatisk.
8. Oppdaterer **kode-registeret** nederst i denne fila.

---

## 3. Det DU får tilbake

- **Koden som skal stå på stolpen** (lesbar reserve), f.eks. `VAFS-02`.
- **QR-URL-en** som QR-koden skal peke til — alltid med koden påført:

  ```
  https://kulturjakten.frivilligsentralen.org/steder/<id>.html?k=<KODE>
  ```

  Eksempel: `https://kulturjakten.frivilligsentralen.org/steder/holmenkollen-kapell.html?k=VAFS-02`

  > ⚠️ QR-koden MÅ inneholde `?k=<KODE>`. Uten den gir et skann **null poeng** (siden vises
  > bare i lesemodus). Dette er bevisst — se §0/§5 i `CLAUDE.md`.

- (Valgfritt) Jeg kan også **generere selve QR-bildet** (PNG/SVG) til `/qr/<id>.png` hvis du
  vil ha det ferdig til utskrift — bare si fra.

---

## 4. Eksempel på en melding fra deg

> «Nytt sted: **Holmenkollen kapell**. Koordinater 59.9639, 10.6680.
> Bilder ligger i `assets/img/steder/holmenkollen/`: `kapell.jpg` (kapellet forfra),
> `interior.jpg` (innvendig). Tekst:
>
> Holmenkollen kapell er en trekirke fra 1903 … (osv.)»

Så svarer jeg med kode + QR-URL når det er lagt ut.

---

## 5. Kode-register (hold oppdatert!)

Hver stolpe har en unik, lesbar kode `VAFS-NN`. Neste ledige nummer brukes for nye steder.

| Kode | Sted | id | Status |
|------|------|----|--------|
| VAFS-01 | Møteplass Vinderen | `moteplass-vinderen` | ✅ live |
| VAFS-02 | Frøen politistasjon | `froen-politistasjon` | ✅ live |
| VAFS-03 | Grimelund gård | `grimelund-gard` | ✅ live |
| VAFS-04 | Heftyevillaen | `heftyevillaen` | ✅ live |
| VAFS-05 | Bogstadleiren | `bogstadleiren` | ✅ live |
| VAFS-06 | Holmendammen | `holmendammen` | ✅ live |
| VAFS-07 | Holmenkollen kapell | `holmenkollen-kapell` | ✅ live |
| VAFS-08 | Flyulykken på Voksenkollen | `flyulykken-voksenkollen` | ✅ live |
| VAFS-09 | Huseby skole | `huseby-skole` | ✅ live |

**Neste ledige kode: `VAFS-10`.**
