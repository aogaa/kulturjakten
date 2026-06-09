# CLAUDE.md — Kultur- og historiejakt (Vestre Aker Frivilligsentral)

Dette dokumentet er prosjektgrunnlaget for Claude Code. Les hele før du begynner å bygge. Det beskriver HVA vi bygger, HVORDAN det skal struktureres, og I HVILKEN REKKEFØLGE. Følg arkitekturen og prinsippene her med mindre prosjekteieren (Espen) eksplisitt sier noe annet.

---

## 1. Hva prosjektet er

En lokal **kultur- og historiejakt** for Vestre Aker Frivilligsentral (VAFS). Konseptet:

- VAFS plasserer ut fysiske stolper på steder med lokalhistorisk interesse.
- Hver stolpe har en QR-kode (og en lesbar kode som reserve).
- Brukeren skanner QR-koden og havner på en **stedsside** med historie, bilder og kart om stedet. Innholdet lages i samarbeid med historielaget og bydelen.
- Første gang en bruker registrerer et sted, får de poeng. Besøker de det igjen, ser de bare stedssiden på nytt (ingen nye poeng).
- Brukere konkurrerer på en **ledertavle**, inndelt i selvvalgte klasser.

Dette er IKKE en klone av stolpejakten.no. Tyngdepunktet er lokalhistorisk formidling; poeng/ledertavle er et engasjementslag oppå.

### Designfilosofi (viktig)
- **Lav terskel:** ingen innlogging, ingen brukerkontoer. Brukeren velger et kallenavn og en klasse, ferdig.
- **Tillitsbasert:** klassevalg og poeng er basert på tillit. Dette er en folkehelseaktivitet, ikke en konkurranse på elitenivå. Ikke overingeniør juksebeskyttelse.
- **Minimalt personvernansvar:** persondata holdes ute av systemet så langt som mulig. Eneste valgfrie persondata er e-post, som håndteres EKSTERNT (MailerLite), ikke i vår database.
- **Innhold skal være lett å legge til:** å legge til stolpe nr. 11 skal være «fyll inn én rad + lag én ny stedsside», ikke endre systemet.

---

## 2. Teknisk arkitektur

Prosjektet har to deler med svært ulik vekt:

| Del | Innhold | Teknologi | Hosting |
|---|---|---|---|
| Stedssidene + kart + jaktlogikk | Historie, bilder, kart, registrering | Statisk HTML/CSS/JavaScript | GitHub Pages |
| Poeng + ledertavle | Kallenavn, klasse, poeng | Firebase (Firestore) | Firebase (skytjeneste) |
| E-post (valgfritt) | Frivillig påmelding til oppdateringer | MailerLite | Eksternt (ikke vår kode) |

### Prinsipper
- **Alt er statisk på klientsiden.** Ingen egen server, ingen byggeprosess som krever Node på server. Ren HTML/CSS/vanilla JavaScript som kan ligge på GitHub Pages. Ikke dra inn React, Next.js eller andre rammeverk — det er unødvendig kompleksitet for dette.
- **Kart:** Leaflet (gratis JS-bibliotek) + Kartverkets gratis bakgrunnskart (WMTS, ingen API-nøkkel). IKKE Mapbox, IKKE Google Maps.
- **Brukerens fremgang** (kallenavn, klasse, hvilke steder funnet) lagres i `localStorage` på enheten. Følger enheten, ikke personen. Dette er bevisst og akseptert.
- **Firebase** brukes KUN til ledertavla: lagrer `{kallenavn, klasse, poeng, sistOppdatert}`. Ingen e-post, ingen reelle identiteter i Firebase.
- **Stolpedefinisjoner** ligger i én datafil (`stoteder.js` / `steder.json`) som er fasit for både kart-markører, gyldige koder og lenker til stedssider.

### Kjent og akseptert svakhet
Siden alt er klientside og tillitsbasert, kan en teknisk anlagt person i teorien lese de gyldige kodene fra kildekoden og «jukse». Dette er akseptert for v1. Hvis premier av verdi deles ut, kontrollerer VAFS topp 3 manuelt. **Ikke** bygg server-side kodevalidering i v1 med mindre Espen ber om det.

---

## 3. Mappestruktur

Bygg prosjektet med denne strukturen. Den er laget for GitHub Pages (alt serveres fra rot eller `/docs`, avklar med Espen — standard her er rot).

```
/ (repo-rot)
├── CLAUDE.md                  # dette dokumentet
├── README.md                  # kort om prosjektet + hvordan legge til nye steder
├── index.html                 # forside: intro + kart over alle stolper + "kom i gang"
├── ledertavle.html            # ledertavle med klassefilter
├── /steder/                   # én stedsside per stolpe (genereres fra mal)
│   ├── _mal.html              # MAL — kopier denne for nye steder
│   ├── holmenkollen-kapell.html
│   └── ... (flere etter hvert)
├── /assets/
│   ├── /css/
│   │   └── style.css          # felles stil for hele siten
│   ├── /js/
│   │   ├── steder.js          # FASIT: liste over alle stolper (se §4)
│   │   ├── kart.js            # initialiserer Leaflet-kart + Kartverket-lag + markører
│   │   ├── jakt.js            # localStorage-logikk: kallenavn, klasse, funnet-liste, poeng
│   │   ├── registrering.js    # håndterer skanning/kode → registrer sted → poeng
│   │   ├── ledertavle.js      # leser/skriver Firebase, viser ledertavle
│   │   └── firebase-config.js # Firebase-oppsett (se §6 om nøkler)
│   └── /img/
│       ├── /steder/           # bilder til stedssidene
│       └── /ui/               # logo, ikoner, grafikk
├── /qr/                       # genererte QR-koder (PNG/SVG) klare for utskrift
└── /.github/
    └── (ev. workflow hvis vi automatiserer noe senere — ikke nødvendig nå)
```

### Begrunnelse for strukturen
- **Hver stedsside er en egen HTML-fil** under `/steder/`. Det gjør QR-koden til en enkel, lesbar URL (`.../steder/holmenkollen-kapell.html`) og gjør «legg til et sted» til «kopier mal-fila».
- **All delt logikk ligger i `/assets/js/`** og gjenbrukes på tvers av sider. Stedssidene er tynne — de inneholder innhold + et lite skript som kobler på jaktlogikken.
- **`steder.js` er eneste fasit.** Kart, koder og lenker leses derfra. Endrer du stolpene, endrer du kun den fila (+ legger til HTML-sida).

---

## 4. Datamodell

### 4.1 Stolpedefinisjon (`assets/js/steder.js`)
Eneste fasit over stolper. Eksportér en liste med objekter:

```js
// assets/js/steder.js
export const STEDER = [
  {
    id: "holmenkollen-kapell",     // unik, brukes i URL og som nøkkel i localStorage
    navn: "Holmenkollen kapell",
    kode: "VAFS-A7",               // lesbar kode som står på stolpen (reserve for QR)
    poeng: 100,                    // poeng for å finne dette stedet
    lat: 59.9639,                  // breddegrad (for kart-markør)
    lng: 10.6680,                  // lengdegrad
    side: "steder/holmenkollen-kapell.html", // relativ lenke til stedssiden
    kortbeskrivelse: "Trekirke fra 1903 ..."  // vises i kart-popup
  },
  // ... flere steder
];
```

**Viktig:** `kode` og `id` må være unike. QR-koden peker til stedssidens URL (se §5). Den lesbare `kode` brukes ved manuell inntasting og må kunne slås opp i denne lista.

### 4.2 Brukerens tilstand (localStorage)
Lagres på enheten. Foreslått nøkkel `vafs_jakt`:

```js
{
  kallenavn: "Turbo",
  klasse: "Voksen",          // valgt ved oppstart
  funnet: {                  // hvilke steder er registrert + når
    "holmenkollen-kapell": { tid: "2026-06-09T12:00:00Z", poeng: 100 }
  },
  totalpoeng: 100
}
```

### 4.3 Ledertavle (Firebase Firestore)
Kolleksjon `ledertavle`, ett dokument per deltaker (auto-id eller kallenavn-basert):

```js
{
  kallenavn: "Turbo",
  klasse: "Voksen",
  poeng: 100,
  sistOppdatert: <timestamp>
}
```

Ingen e-post, ingen koordinater, ingenting som identifiserer en person. Når brukeren registrerer et nytt sted, oppdateres deres dokument i `ledertavle` med ny totalsum.

---

## 5. Hvordan registrering fungerer

QR-koden på en stolpe er **en URL til stedssiden**, f.eks.:
```
https://<vafs-domene>/steder/holmenkollen-kapell.html
```

Når brukeren lander på en stedsside:
1. Skriptet leser `id` for stedet (hardkodet i stedssiden eller utledet fra filnavn).
2. Sjekker `localStorage`: har brukeren valgt kallenavn/klasse?
   - Nei → vis en liten boks: «Vil du være med på jakten? Velg kallenavn og klasse.» (men la dem fortsatt lese stedssiden — innholdet er åpent for alle).
3. Sjekker om `id` finnes i `funnet`:
   - **Ikke funnet før** → registrer: legg til i `funnet`, øk `totalpoeng`, oppdater Firebase-ledertavla, vis «Nytt sted funnet! +100 poeng».
   - **Allerede funnet** → vis stedssiden normalt med en diskré «Du har allerede besøkt dette stedet»-markering. Ingen nye poeng.

### Manuell kode (reserve)
På `index.html` (eller en egen «registrer»-knapp): et felt der brukeren kan skrive den lesbare koden (f.eks. `VAFS-A7`) hvis QR ikke virker. Slå opp koden i `STEDER`, finn `id`, og kjør samme registreringslogikk, deretter send brukeren til stedssiden.

### Stedsside-malen (`steder/_mal.html`)
Skal inneholde, i denne rekkefølgen:
- Stedets navn (overskrift)
- Historisk tekst (fylles inn av Espen/historielaget)
- Bilde(r)
- Lite kart-utsnitt som viser hvor stedet er (Leaflet, gjenbruk `kart.js`)
- Registreringsstatus («Nytt sted! +100» / «Allerede besøkt»)
- En «Slik blir du med på jakten»-boks for nysgjerrige som ikke deltar ennå
- Lenke tilbake til kart/forside og til ledertavla

Malen må være laget slik at å lage et nytt sted = kopier `_mal.html`, fyll inn innhold, sett riktig `id`, legg til raden i `steder.js`. Ikke noe mer.

---

## 6. Firebase-oppsett

- Bruk **Firestore** (ikke Realtime Database, med mindre Espen foretrekker det).
- Firebase web-config (apiKey osv.) er IKKE en hemmelighet i tradisjonell forstand for web-apper — den ligger i klienten uansett. Sikkerheten ligger i **Firestore-regler**, ikke i å skjule nøkkelen.
- Sett opp Firestore-regler som:
  - tillater å lese ledertavla (offentlig),
  - tillater å skrive til `ledertavle` (siden vi ikke har auth), men vurder enkel validering: at `poeng` er et tall, at dokumentet har forventet form. Dette hindrer ikke juks (akseptert), men hindrer søppel.
- `firebase-config.js` inneholder web-config. Legg den inn, men dokumentér i README at sikkerheten styres av Firestore-regler.

Espen har brukt Firebase før (Vorspiel-spillet) og har konto.

---

## 7. Kart (Leaflet + Kartverket)

- Bruk **Leaflet** (last fra CDN i `<head>`).
- Bakgrunnskart: **Kartverkets gratis WMTS-tjeneste** (topografisk norgeskart). Ingen API-nøkkel.
- `kart.js` skal:
  - initialisere kartet sentrert på Vestre Aker / Vinderen-området,
  - legge til Kartverket-laget,
  - lese `STEDER` og legge en markør per stolpe,
  - markørens popup viser navn + kortbeskrivelse + lenke til stedssiden,
  - (valgfritt) vise hvilke steder brukeren alt har funnet med en annen markørfarge, lest fra localStorage.
- Den nøyaktige URL-en til Kartverkets WMTS-lag må verifiseres mot Geonorge ved bygging (den endres av og til). Begynn med å slå opp gjeldende «Kartverket bakgrunnskart WMTS» / cache-tjeneste.

---

## 8. E-post (valgfritt, EKSTERNT)

- E-post samles IKKE i Firebase eller localStorage.
- På et tydelig valgfritt steg (etter at brukeren er i gang) kan brukeren melde seg på oppdateringer. Dette sender dem til / registrerer dem i **MailerLite**, som Espen allerede bruker for VAFS-nyhetsbrev.
- Enkleste v1: en lenke/innbygd MailerLite-skjema. Ikke bygg egen e-posthåndtering.
- Krav til skjemaet: tomt samtykke-avkryss som standard, tydelig formål, like synlig «hopp over», lenke til personvernerklæring. Barn: be om at en voksen registrerer e-post på vegne av familien.

---

## 9. Byggerekkefølge (milepæler)

Bygg i denne rekkefølgen. **Milepæl 1 er «ett komplett sted gjennom hele kjeden» — ikke ti.**

### Milepæl 0 — Skjelett
- Mappestruktur, `index.html`, `style.css`, tom `steder.js`, README.

### Milepæl 1 — Ett komplett sted, hele kjeden (KRITISK)
- Kart på `index.html` med Kartverket-bakgrunn (Leaflet).
- Ett sted i `steder.js` med ekte koordinat + kode.
- Markør på kartet for stedet.
- `steder/_mal.html` + den ene ekte stedssiden.
- localStorage-logikk: velg kallenavn + klasse.
- Registrering: skanne/åpne QR-URL → registrer → poeng → «allerede besøkt» andre gang.
- Firebase: skriv poeng til ledertavla.
- `ledertavle.html`: vis ledertavla med klassefilter.
- **Test hele løypa fra QR-skann til ledertavle på det ene stedet før du går videre.**

### Milepæl 2 — Polering
- Manuell kode-inntasting som reserve.
- Vis funnede steder med egen markørfarge på kartet.
- «Slik blir du med»-boks på stedssider.
- Responsivt design (mobil først — folk bruker dette ute på tur).
- MailerLite-påmelding (valgfritt steg).

### Milepæl 3 — Skalering av innhold
- Generér QR-koder for stedene (i `/qr/`).
- Dokumentér i README nøyaktig hvordan Espen legger til sted nr. 2–10+ (kopier mal, fyll inn, legg til rad).
- Espen lager det første ekte stedet som mal/fasit; de neste fylles inn i eget tempo.

---

## 10. Konvensjoner og kontekst

- **Språk:** All brukervendt tekst er på **norsk (bokmål)**. Kode/kommentarer kan være norsk eller engelsk, vær konsistent.
- **Miljø:** Espen jobber på **Windows**. Alle terminalkommandoer skal være **PowerShell/cmd**, ikke bash/Mac/Linux.
- **Publisering:** GitHub Pages. VAFS har allerede repo/oppsett for GitHub Pages-sider.
- **Enkelhet over eleganse:** vanilla JS, ingen byggeverktøy med mindre det er strengt nødvendig. Dette skal være vedlikeholdbart av én person over flere år.
- **Mobil først:** brukerne står ute ved en stolpe med telefon. Design for liten skjerm og dårlig dekning (hold sidene lette).

### Beslutninger som er tatt (ikke åpne opp igjen uten grunn)
- Egen løsning, IKKE arrangør i stolpejakten.no.
- Ingen innlogging; kallenavn + klasse i localStorage.
- Tillitsbasert; ingen server-side juksebeskyttelse i v1.
- Firebase kun for ledertavle; e-post kun i MailerLite.
- Leaflet + Kartverket, ikke Mapbox/Google.
- Start med 10 steder, men systemet må gjøre det trivielt å legge til flere.

### Beslutninger som kan tas underveis
- Eksakt klasseinndeling (forslag: Barn / Voksen / Senior / Sykkel).
- Poeng per sted (likt eller variabelt).
- Visuell utforming av QR-kodene.
- Premier og kåring av vinnere.
