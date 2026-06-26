# Kultur- og historiejakt – Vestre Aker Frivilligsentral

En lokal kultur- og historiejakt: fysiske stolper med QR-koder leder til stedssider
med lokalhistorie, kart og bilder. Brukere samler poeng og konkurrerer på en
felles ledertavle. Lav terskel – ingen innlogging, bare et kallenavn.

Se [`CLAUDE.md`](CLAUDE.md) for hele prosjektgrunnlaget (konsept, arkitektur,
beslutninger).

## Teknisk kort

- **Statisk nettsted** (HTML/CSS/vanilla JS) på GitHub Pages. Ingen byggeprosess.
- **Kart:** Leaflet + Kartverkets gratis WMTS-cache (ingen API-nøkkel).
- **Fremgang** (kallenavn, funne steder) lagres i `localStorage` på enheten.
- **Firebase (Firestore)** brukes kun til ledertavla: `{kallenavn, poeng, sistOppdatert}`.
- **Publisering:** eget repo + underdomene `kulturjakten.frivilligsentralen.org`
  (se `CNAME`), servert fra repo-rot.

## Kjøre lokalt

Sidene bruker ES-moduler, som krever HTTP (ikke `file://`). Start en liten lokal
server fra repo-rota:

```powershell
# Alternativ 1: Python
python -m http.server 8000

# Alternativ 2: Node
npx serve
```

Åpne deretter `http://localhost:8000/` i nettleseren.

## Legge til et nytt sted (3 steg)

> Jobber du sammen med Claude Code? Se [`LEGGE-TIL-STED.md`](LEGGE-TIL-STED.md) for den
> AI-assisterte arbeidsflyten (du sender tekst + bilder, får kode + QR-URL tilbake).
> Den manuelle fremgangsmåten er beskrevet under.


1. **Lag stedssiden:** kopier [`steder/_mal.html`](steder/_mal.html) til
   `steder/<din-id>.html`. Bytt ut alt merket med `[[ ... ]]` med ekte innhold,
   og sett `STED_ID` nederst lik stedets id.
2. **Legg til raden:** legg ett objekt i `STEDER` i
   [`assets/js/steder.js`](assets/js/steder.js). `id` og `kode` må være unike.
3. **Legg til bilde** (valgfritt): legg bildefila i `assets/img/steder/` og pek på
   den fra stedssiden.

Kart-markør, registrering, poeng og ledertavle skjer automatisk – ingen andre
endringer trengs.

## Hvordan registrering / poeng fungerer (VIKTIG for QR-koder)

Poeng gis **kun** når stedssiden åpnes med stolpekoden i URL-en, som
`?k=<KODE>` (samme kode som i `steder.js`). Dette er bevisst: å klikke seg til en
stedsside fra kartet eller en lenke skal *ikke* gi poeng – bare det å fysisk være
ved stolpen (skanne QR) eller taste inn koden fra stolpen på forsiden.

Det betyr at **QR-koden på en stolpe må peke til URL-en med koden påført**:

```
https://kulturjakten.frivilligsentralen.org/steder/moteplass-vinderen.html?k=VAFS-01
                                             └─ stedets `side` ─┘          └ `?k=` + `kode` ┘
```

- **Med `?k=<riktig kode>`:** stedet registreres, brukeren får poeng (første gang),
  og ledertavla oppdateres.
- **Uten `?k=` (eller feil kode):** siden vises i ren lesemodus – alt innhold er
  åpent, men ingen poeng. Brukeren får beskjed om å skanne QR-en eller taste koden.

Genererer du QR-koder uten `?k=<KODE>`, gir et skann **null poeng**. Legg alltid på
`?k=` + stedets `kode` når QR-koden lages.

> Lokal testing: query-strengen (`?k=...`) krever at `cleanUrls` er av, ellers
> redirecter `npx serve` bort parameteren. Det er allerede satt i `serve.json`.

## QR-koder og trykkeklare stolpe-etiketter

Alt materiellet til stolpene genereres automatisk fra `steder.js`:

```
npm install     # første gang (henter qrcode + pdfkit, kun lokalt verktøy)
npm run etiketter
```

Det lager, for hvert **aktivt** sted:

- `qr/<id>.png` og `qr/<id>.svg` — rå QR-kode (frittstående bruk).
- `qr/etiketter/<id>.pdf` — én **omslagsstripe** på **400 × 150 mm** (ferdig format) som
  trekkes/limes rundt stolpen. Stolpen er firkantet med 98 mm sider (omkrets 4 × 98 = 392 mm),
  så stripa har de fire sidene ved siden av hverandre — **QR · info · QR · info** — pluss en
  8 mm limflik på enden (gjentar starten av side 1) til skjøten. I tillegg **3 mm utfallende
  kant (bleed) + skjæremerker** → 406 × 156 mm fysisk ark (grafikken går helt ut til kant).
- `qr/etiketter/_alle-stolper.pdf` — alle stripene samlet i én fil (lett å sende trykkeri).

QR-koden peker alltid til `…/steder/<id>.html?k=<KODE>` (se avsnittet over). Designet
(grønn «KULTURJAKTEN»-header, VAFS-logo, «Skan QR koden» / «1. Gå til nettsiden …») og
målene (panelbredde, limflik, headerhøyde, bleed) ligger øverst i
[`tools/lag-etiketter.mjs`](tools/lag-etiketter.mjs). Vil du ha ren 400 × 150 mm uten
bleed/skjæremerker (f.eks. for utskrift selv): sett `MED_BLEED = false` og kjør på nytt.

Legger du til et nytt sted, kjør bare `npm run etiketter` igjen — den nye stolpen
kommer med automatisk. `node_modules/` er git-ignorert og skal ikke pushes.

## Upassende kallenavn

Et enkelt filter ([`assets/js/forbudteord.js`](assets/js/forbudteord.js)) hindrer de
vanligste stygge kallenavnene ved inntasting, og maskerer dem som «(skjult navn)»
på ledertavla om de likevel skulle slippe gjennom. Filteret normaliserer for
store bokstaver, mellomrom og enkel «leetspeak» (`p1kk`, `p i k k`).

- **Utvide lista:** legg ord i `LISTE` i fila (småbokstaver).
- **Begrensning:** ikke vanntett. Målrettede men «rene» navn (uten banneord)
  fanges ikke – fjern dem manuelt i Firestore-konsollen (Data-fanen → `ledertavle`
  → slett raden).

## Firebase-oppsett

1. Lim inn web-config i [`assets/js/firebase-config.js`](assets/js/firebase-config.js)
   (Firebase Console → Prosjektinnstillinger → web-app → Konfigurasjon).
   Web-config er ikke en hemmelighet; sikkerheten ligger i Firestore-reglene.
2. Opprett Firestore-databasen og sett regler. Anbefalt utgangspunkt for
   kolleksjonen `ledertavle` (offentlig lesing, skriving med enkel formvalidering –
   hindrer søppel, ikke juks, som er akseptert i v1):

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /ledertavle/{deltaker} {
         allow read: if true;
         allow write: if request.resource.data.poeng is number
                      && request.resource.data.kallenavn is string;
       }
     }
   }
   ```

## Publisering (GitHub Pages + eget domene)

1. Opprett GitHub-repo og push innholdet (servert fra rot).
2. Settings → Pages → Source: `main` / rot. `CNAME`-fila setter custom domain.
3. Hos domeneleverandøren for `frivilligsentralen.org`: legg en CNAME-record
   `kulturjakten` → `<org-eller-bruker>.github.io`.
4. Vent på DNS + aktiver «Enforce HTTPS» i Pages-innstillingene.

## Nyhetsbrev (MailerLite, valgfritt)

Forsiden har en valgfri nyhetsbrev-seksjon. Den er **skjult** til URL-en er satt:
åpne [`index.html`](index.html), finn `const MAILERLITE_URL = ""` i skriptet
nederst, og lim inn URL-en til VAFS sitt MailerLite-skjema. Selve samtykket
(avkryssing, personvern) ligger i MailerLite-skjemaet, ikke hos oss.

## Status

- ✅ Milepæl 0 + 1: skjelett og hele kjeden for ett sted (kart → stedsside →
  registrering → poeng → Firebase → ledertavle). Verifisert ende-til-ende.
- ✅ Firebase live: Firestore-prosjekt `kulturjakten-1e9a7`, regler publisert,
  ekte skriving/lesing bekreftet.
- ✅ Milepæl 2: manuell kode-inntasting (QR-reserve), egen markørfarge for
  besøkte steder + tegnforklaring, kallenavn-filter, responsiv (mobil først).
- ✅ Forside: hero + «golden circle» (hvorfor/hva/hvordan), ett ekte sted
  (Møteplass Vinderen).
- ✅ Milepæl 3: QR-koder + trykkeklar omslagsstripe (400 × 150 mm) genereres med
  `npm run etiketter` (se avsnittet over). 11 aktive steder.
- ⬜ Gjenstår: MailerLite-URL, flere steder, DNS-oppsett for custom domain.
