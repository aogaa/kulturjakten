# Oversette Kulturjakten til flere språk — runbook

Denne fila er **oppskriften** for å gjøre Kulturjakten flerspråklig. Den er skrevet både
til **Espen** (så du vet hva du får) og til **Claude** (som en fast runbook med besluttet
arkitektur, slik at en ny sesjon kan gjennomføre uten å planlegge på nytt).

> Kort sagt: Du sier f.eks. «Nå kan du oversette forsiden til ukrainsk», og Claude
> gjennomfører stegene under. Første språk er **ukrainsk** (`uk`). Første omfang er
> **kun forsiden** (`index.html`).

---

## 1. Besluttet arkitektur (ikke åpne uten grunn)

- **Én HTML-fil per side + én ordbok** — IKKE en egen `index.uk.html`-kopi.
  Forsiden har ~100 linjer inline-JS; en kopi ville duplisert logikken (to steder å
  vedlikeholde → drift). I stedet legges all **synlig tekst** i en ordbok
  `assets/js/i18n.js` med én kolonne per språk (`nb`, `uk`, …). Logikken finnes ett sted.
  **Nytt språk senere = legg til én kolonne.** Skalerer rent til stedssidene senere.
- **Flagg som SVG, ikke emoji.** Flagg-emoji (🇺🇦) vises IKKE som flagg på Windows
  (Espens maskin) — de blir bokstaver. Bruk små SVG-filer i `assets/img/ui/`.
- **Språkkode vs landskode:** i18n-nøkkel bruker **språkkode** `uk` (ukrainsk).
  Flagg-filnavn bruker **landskode** (`no`, `ua`). Ikke bland disse.
- **Kun visningstekst oversettes.** Lagrede verdier (kallenavn, koder som `VAFS-01`)
  forblir kanoniske og uendret.
- **Vanilla JS, ingen rammeverk.** Følger prosjektets enkelhetsfilosofi (CLAUDE.md §2).

---

## 2. Stegene Claude gjør (forsiden, første gang)

### Steg 1 — Ny fil `assets/js/i18n.js`
Et lite, avhengighetsfritt i18n-lag. Innhold:
- `export const OVERSETTELSER = { nb: { … }, uk: { … } }` — korte nøkler, f.eks.
  `hero_tittel`, `hero_tekst`, `hvorfor_tittel`, `hvorfor_tekst`, `hva_tittel`,
  `hva_tekst`, `hvordan_tittel`, `steg1_tittel`, `steg1_tekst`, … `kom_tittel`,
  `kart_tittel`, `kode_tittel`, `kode_knapp`, `feil_kode`, `feil_navn`, `poeng`, `hei`,
  `klar_for_tur`, `kom_i_gang_knapp`, `se_ledertavla`, osv.
  Norsk tekst hentes **ordrett fra dagens `index.html`**; ukrainsk er ny oversettelse.
- `gjeldendeSprak()` — leser `localStorage["vafs_sprak"]`, default `"nb"`.
- `settSprak(kode)` — lagrer i localStorage, setter `document.documentElement.lang`,
  kaller `bruk()`, og markerer aktivt flagg (`.aktiv`).
- `bruk(rot = document)` — for hvert `[data-i18n="nøkkel"]`: sett `textContent` fra
  ordboken for gjeldende språk. For tekst med innfelt markup: `[data-i18n-html]` →
  sett `innerHTML` i stedet.
- `t(nøkkel)` — slå opp én streng (brukes av forsidens inline-script til JS-genererte
  strenger).
- Topp-kommentar som forklarer språkkode (`uk`) vs landskode (`ua`)-konvensjonen.

### Steg 2 — Flagg + CSS
- To SVG-filer: `assets/img/ui/flag-no.svg` (norsk korsflagg) og
  `assets/img/ui/flag-ua.svg` (Ukraina: to vannrette striper, blå over gul).
- CSS i `assets/css/style.css`: `.sprakvelger` (flex, små flaggknapper i headeren) +
  `.sprakvelger .aktiv` (markert valgt språk). Mobilvennlig (headeren er mobil-først).

### Steg 3 — `index.html`: gjør tekst oversettbar + legg til flaggvelger
- Legg `data-i18n="…"` på hver synlig statisk tekst (hero, Hvorfor/Hva/Hvordan, de 4
  stegene, «Kom i gang», kart-seksjon, kode-skjema, knapper, lenker). Tekst med innfelt
  markup (f.eks. «… <span class="uthev"><span id="antall-steder">N</span> steder</span>»)
  bruker `data-i18n-html`, eller deles slik at det dynamiske tallet bevares.
- Legg en **språkvelger i `.topp`-headeren**: to flaggknapper (Norge + Ukraina). Klikk →
  `settSprak("nb"|"uk")`. Aktivt språk markeres.
- I det eksisterende inline-scriptet: importer fra `i18n.js`, kjør `bruk()` ved oppstart,
  og bytt JS-genererte strenger («Hei …», «… poeng», «Klar for tur!», feilmeldinger,
  knappetekster) til `t(...)`. NB: `escapeHtml` og lagrede verdier
  forblir uendret — kun visningstekst.

### Steg 4 — Verifiser (preview, port 8000)
- `index.html` på norsk (default): uendret forside.
- Klikk ukrainsk flagg → hero, seksjoner, steg, skjema-etiketter og knapper er ukrainske;
  `<html lang>` = `uk`.
- **Klikk norsk flagg → tilbake til norsk.** Begge flaggene MÅ være synlige før og etter
  bytte (begge retninger). Hvis det ene flagget forsvinner: CSS-en som skjuler `data-sprak`
  er ikke scopet riktig — se §3-advarselen og §6-fellen.
- Last på nytt → valget huskes (localStorage `vafs_sprak`).
- Ingen konsollfeil. «Kom i gang»-skjema + kode-skjema virker på begge språk.
- Mobil 375px: flaggene får plass i headeren uten overflyt.

### Steg 5 — Publiser
- `git add -A && git commit && git push` til `main` (GitHub Pages bygger automatisk).
- Oppdater minnet (`kulturjakten-status.md`) + denne fila (huk av at forsiden er live på `uk`).

---

## 3. Hybrid arkitektur (oppdatert 2026-06-10)

- **UI-tekst i ordboken (`assets/js/i18n.js`):** alle korte strenger som går igjen —
  header, footer, knapper, skjemaer, feilmeldinger, kart-popup, registreringsflyten.
  Settes via `data-i18n` / `data-i18n-html` / `data-i18n-attr` eller `t("nokkel")`
  i JS. Pluralform-arrays (`plural("nokkel", n)`) brukes der tallet styrer formen
  (ukrainsk «бал/бали/балів»).
- **Lang narrativ brødtekst inline i sidens HTML:** stedssidenes «Om stedet»-tekst
  legges som to søsken-blokker — `<div data-sprak="nb">…</div>` og
  `<div data-sprak="uk">…</div>` — inne i en `<section class="sted-historie">`-
  wrapper. CSS i `style.css` skjuler den som ikke matcher gjeldende `<html lang>`.
  Ingen JS, ingen flimring, og hver stedsside har sin tekst samlet ett sted.
  (Mangler ukrainsk for en stedsside? Behold bare norsk-blokken — siden viser
  norsk for alle inntil oversettelsen er skrevet.) Stedsnavn (`<h1>` i headeren)
  og `<title>` er foreløpig holdt på norsk for enkelhet; bytt ut `<h1>` med to
  `data-sprak`-blokker hvis det skal oversettes.

  > ⚠️ **CSS-en MÅ scopes til `.sted-historie` (eller annen tekst-container).**
  > Attributtet `data-sprak` brukes også på flaggknappene i `.sprakvelger`. En
  > uskopet regel (`html[lang="nb"] [data-sprak="uk"] { display: none; }`) skjuler
  > flaggknappen for det andre språket → brukeren blir låst inne. Riktig:
  > ```css
  > html[lang="nb"] .sted-historie [data-sprak="uk"] { display: none; }
  > html[lang="uk"] .sted-historie [data-sprak="nb"] { display: none; }
  > ```
  > Hvis du innfører en ny tekst-container (f.eks. `.artikkel`, `.lang-tekst`),
  > legg til tilsvarende scopete regler — ikke fjern scopet.
- **Stedsspesifikke felt i `steder.js` (`navn`, `kortbeskrivelse`)** brukes også
  i kart-popup. Disse oversettes ved å legge til valgfrie `navn_<sprak>` /
  `kortbeskrivelse_<sprak>`-felt ved siden av de norske (f.eks. `navn_uk`).
  `kart.js` har en `feltMedSprak(sted, felt)`-helper som plukker språkvariant
  hvis den finnes, ellers faller tilbake til norsk. Eksisterende rader uten
  `_<sprak>`-felt fortsetter å vise norsk.
- `<title>`/meta-tagger oversettes ikke utover synlig innhold.

---

## 4. Status / språkregister (hold oppdatert!)

| Språk | Kode | Flagg-fil | Forside | Stedssider | Ledertavle |
|-------|------|-----------|---------|------------|------------|
| Norsk (bokmål) | `nb` | `flag-no.svg` | ✅ original | ✅ | ✅ |
| Ukrainsk | `uk` | `flag-ua.svg` | ✅ implementert (2026-06-10) | ✅ implementert (2026-06-10) | ✅ implementert (2026-06-10) |

**Neste handling:** ukrainsk korrektur av en native taler — UI-strenger ligger i
`assets/js/i18n.js` (`OVERSETTELSER.uk`), stedssidenes brødtekst ligger inline i
hver stedsside under `<div data-sprak="uk">`.

### Notater fra første implementering (2026-06-10)

- Pluraliseringshjelper lagt til i `i18n.js`: `pluralKategori(n, sprak)` + `plural(nokkel, n)`.
  Slavisk regel for `uk` (1 → entall, 2–4 → få, 5+ → mange, med 11–14-unntak).
  «Hva vi har laget»-paragrafen bygges i `index.html` med tre nøkler:
  `hva_tekst_pre` + `plural("hva_steder_navn", n)` + `plural("hva_tekst_post", n)`,
  så ukrainsk får riktig grammatikk uansett antall stolper (f.eks. «2 місця чекають»,
  «5 місць чекають»).
- Norsk har samme oppsett (1 → «sted», ellers «steder»). Trivielt i dag, men gir
  symmetri og gjør det rett å legge til andre språk senere.

---

## 5. Sjekkliste for nytt språk (kort)

Legg til kolonne i `OVERSETTELSER` (`i18n.js`), inkl. pluralarrays (`poeng_form`,
`hva_steder_navn`, `hva_tekst_post` osv.). For slaviske/komplekse språk: verifiser
at `pluralKategori(n, sprak)` dekker språket — utvid hvis ikke.

1. Flagg-SVG i `assets/img/ui/flag-<land>.svg` (NB: landskode, ikke språkkode — se §1).
2. Knapp i `.sprakvelger` på **alle** sider med språkvelger (`index.html`, `ledertavle.html`,
   `_mal.html` + alle eksisterende stedssider). Glem du én side, blir den låst på forrige
   språk når brukeren navigerer dit.
3. Hvis du legger til ny CSS-regel for narrativ tekst (§3-toggle): scope den til
   `.sted-historie` (eller annen tekst-container). Aldri til `[data-sprak]` direkte.
4. Test full løype på alle sider: bytte fram og tilbake, reload, mobil 375px,
   pluralisering for `n = 1, 2, 5, 11, 21`, registreringsflyten på stedsside
   (`?k=VAFS-01`), kart-popup oppdateres ved språkbytte.
5. Kjør korrektur med native taler før bred lansering. UI i `i18n.js`
   (`OVERSETTELSER.<kode>`); brødtekst i `<div data-sprak="<kode>">` i hver stedsside.

## 6. Feller å unngå (historisk)

Lærdom fra ukrainsk-implementeringen (2026-06-10). Les før du gjentar mønstrene
for et nytt språk eller en ny sidetype.

### F1 — `data-sprak` attributtkollisjon (CSS-felle)
**Symptom:** Etter bytte til språk X forsvinner flagget for språk Y. Brukeren kan ikke
bytte tilbake.
**Årsak:** Attributtet `data-sprak` brukes både på flaggknappene i `.sprakvelger` og
på brødtekstblokkene i `.sted-historie`. En uskopet CSS-regel traff begge.
**Fiks:** Scope toggle-CSS til `.sted-historie [data-sprak]` — aldri til
`[data-sprak]` alene. Se §3-advarselen for kodeeksempel. (Commit `2a8418a`.)
**Generalisering:** Hver gang du innfører en ny CSS-regel som matcher
`[data-sprak="…"]`, sjekk at scopet utelukker `.sprakvelger`.

### F2 — Pluralisering bakt inn i HTML (i18n-felle)
**Symptom:** «2 місць чекають» i stedet for «2 місця чекають» (feil flertallsform).
**Årsak:** Hele paragrafen lå som ferdig HTML i én ordboknøkkel (`data-i18n-html`),
så tallet kunne ikke styre grammatikken.
**Fiks:** Splitt paragrafen i pre/plural/post-nøkler og bygg den i JS via
`plural("nokkel", n)`. Helperen i `i18n.js` (`pluralKategori` + `plural`) håndterer
slavisk regel (1 / 2–4 / 5+ med 11–14-unntak). Verifiser med `n = 1, 2, 5, 11, 21, 22, 25`.
**Generalisering:** Hver gang et **tall** styrer en setning, bruk pluralarray. Også
for norsk (selv om regelen er triviell) — gir symmetri og er klart når et tredje
språk legges til. Pluralarrays i dag: `poeng_form`, `hva_steder_navn`, `hva_tekst_post`.

### F3 — Re-render mangler ved språkbytte (JS-felle)
**Symptom:** Statisk tekst byttes ved klikk, men dynamisk JS-generert innhold
(profil-stripe, registreringsstatus, kart-popup) blir stående på forrige språk
til neste reload.
**Fiks:** `settSprak()` sender CustomEvent `sprakbytte`. Hver side/modul som
rendrer dynamisk innhold må:
- lagre sin tegne-funksjon (`_tegn`) og kalle den på nytt i en `sprakbytte`-lytter,
- for åpne Leaflet-popups: oppdater med `marker.setPopupContent()` (lagre markørene
  i en modulvariabel — det er gjort i `kart.js`).
**Generalisering:** Når du innfører ny dynamisk-tekst-kilde, koble den til
`sprakbytte`-eventet samtidig. Brukerinput i åpne skjemaer går tapt ved språkbytte —
akseptert, dokumenter hvis brukeren kan miste mye.

### F4 — Glemt språkvelger på én side (navigasjons-felle)
**Symptom:** Brukeren navigerer til en side som mangler språkvelgeren og blir
låst på forrige språk uten mulighet til å bytte.
**Fiks:** Hver side med delt header må ha `<div class="sprakvelger">` med begge
(alle) flaggene + koble dem til `settSprak()` i side-skriptet. Sjekkliste når du
legger til et språk: gå gjennom **alle** HTML-filer som har `.topp`-headeren.
**Generalisering:** Når en ny sidetype lages (kopi av `_mal.html` eller annet),
sjekk at språkvelgeren er med før commit.

### F5 — Stedsspesifikke felt i `steder.js` (mønster, 2026-06-11)
**Symptom (historisk):** Kart-popup viste norsk `navn` og `kortbeskrivelse` selv på
ukrainsk UI.
**Fiks:** Valgfrie `navn_<sprak>` / `kortbeskrivelse_<sprak>`-felt på hvert sted i
`steder.js` (f.eks. `navn_uk`). `kart.js` har en helper
`feltMedSprak(sted, felt)` som returnerer `sted[felt + "_" + sprak] ?? sted[felt]` —
faller tilbake til norsk hvis varianten mangler, så rader uten oversettelse
fortsatt virker. Re-render av åpen popup ved språkbytte er allerede dekket av
`sprakbytte`-lytteren i `kart.js` (F3).
**Generalisering:** Når en ny stedsspesifikk streng dukker opp i `steder.js`
(f.eks. `lengrekobling`, `kategori`): bruk samme `feltMedSprak`-mønster i stedet
for å hardkode språkoppslag.

## 7. Åpent punkt

- Claude lager en god ukrainsk førsteversjon, men en **ukrainsktalende bør lese korrektur**
  før bred lansering. All tekst ligger samlet i `assets/js/i18n.js` (ett sted å rette).
