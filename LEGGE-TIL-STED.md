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
3. **Historisk tekst** — ferdig tekst, gjerne delt i avsnitt. Skriv den som den skal stå.
4. **Bilder** (valgfritt, men anbefalt):
   - Legg bildefilene i en mappe under `assets/img/steder/<kort-mappenavn>/`
     (f.eks. `assets/img/steder/holmenkollen/`), og send meg **filnavnene** + en kort
     beskrivelse av hvert bilde (brukes som alt-tekst).
   - Si gjerne hvor i teksten hvert bilde skal stå (ellers fordeler jeg dem fornuftig).
5. **Valgfritt:**
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
4. Legger til raden i `assets/js/steder.js` (`id`, `navn`, `kode`, `poeng`, `lat`, `lng`,
   `side`, `kortbeskrivelse`). Hvis du har sendt ukrainsk variant av navn/kortbeskrivelse,
   legges de inn som valgfrie `navn_uk` / `kortbeskrivelse_uk` ved siden av — mangler de
   viser kart-popupen norsk fallback.
5. Tester lokalt (kart-markør, lesemodus uten kode, registrering med `?k=`).
6. `git commit` + `git push` til `main` → GitHub Pages bygger automatisk.
7. Oppdaterer **kode-registeret** nederst i denne fila.

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

**Neste ledige kode: `VAFS-04`.**
