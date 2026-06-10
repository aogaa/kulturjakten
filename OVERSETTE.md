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
- Klikk norsk flagg → tilbake til norsk. Last på nytt → valget huskes (localStorage).
- Ingen konsollfeil. «Kom i gang»-skjema + kode-skjema virker på begge språk.
- Mobil 375px: flaggene får plass i headeren uten overflyt.

### Steg 5 — Publiser
- `git add -A && git commit && git push` til `main` (GitHub Pages bygger automatisk).
- Oppdater minnet (`kulturjakten-status.md`) + denne fila (huk av at forsiden er live på `uk`).

---

## 3. Avgrensning (med vilje, første runde)

- **Kun forsiden.** Stedssider (`steder/*.html`) og `ledertavle.html` forblir norske.
  Velger man ukrainsk og åpner en stedsside, vises den foreløpig på norsk. Akseptert v1.
- Samme `i18n.js` utvides til de andre sidene senere: legg `data-i18n` på tekst + inkluder
  scriptet + flaggvelger i deres delte header. (Stedssidenes lange brødtekst er den store
  jobben og tas i eget tempo, sted for sted.)
- `<title>`/meta oversettes ikke utover synlig innhold i denne runden.

---

## 4. Status / språkregister (hold oppdatert!)

| Språk | Kode | Flagg-fil | Forside | Stedssider | Ledertavle |
|-------|------|-----------|---------|------------|------------|
| Norsk (bokmål) | `nb` | `flag-no.svg` | ✅ original | ✅ | ✅ |
| Ukrainsk | `uk` | `flag-ua.svg` | ⏳ planlagt (ikke implementert) | ⛔ ikke ennå | ⛔ ikke ennå |

**Neste handling:** når Espen sier fra, gjennomfør §2 for forsiden på ukrainsk.

---

## 5. Åpent punkt

- Claude lager en god ukrainsk førsteversjon, men en **ukrainsktalende bør lese korrektur**
  før bred lansering. All tekst ligger samlet i `assets/js/i18n.js` (ett sted å rette).
