// steder.js — FASIT over alle stolper i kultur- og historiejakten.
//
// Dette er eneste sannhetskilde for hvilke steder som finnes. Kart-markører,
// gyldige koder og lenker til stedssider leses herfra. Skal du legge til et nytt
// sted: legg til ett objekt i STEDER nedenfor, og lag den tilhørende HTML-sida
// under /steder/ (kopier steder/_mal.html).
//
// Krav til hvert sted:
//   - `id`   må være unik (brukes i URL og som nøkkel i localStorage).
//   - `kode` må være unik (lesbar reservekode som står på stolpen).
//
// VIKTIG om poeng: registrering skjer kun når stedssiden åpnes med koden i URL-en
// (?k=<kode>). QR-koden på stolpen MÅ derfor peke til f.eks.
//   steder/moteplass-vinderen.html?k=VAFS-01
// Uten ?k= blir siden ren lesemodus (ingen poeng). Se README for detaljer.
//
// Flerspråk (valgfritt): legg til `navn_<sprak>` og/eller `kortbeskrivelse_<sprak>`
// ved siden av de norske feltene, f.eks. `navn_uk` og `kortbeskrivelse_uk`. Disse
// brukes i kart-popup når brukeren har valgt det språket; mangler de, faller
// popupen tilbake til norsk. Norsk (`navn`, `kortbeskrivelse`) er alltid påkrevd.

export const STEDER = [
  {
    id: "moteplass-vinderen",                  // unik nøkkel — IKKE endre etter publisering
    navn: "Møteplass Vinderen",
    navn_uk: "Місце зустрічі Vinderen",
    kode: "VAFS-01",                           // lesbar reservekode på stolpen
    poeng: 100,                                // poeng for å finne stedet
    lat: 59.943133,                            // fra UTM 260093.04,6652867.77 (EPSG:25833)
    lng: 10.704232,
    side: "steder/moteplass-vinderen.html",    // relativ lenke til stedssiden
    kortbeskrivelse: "Kafé, frivillighet og varme møter mellom mennesker – kultur i hverdagen.", // vises i kart-popup
    kortbeskrivelse_uk: "Кафе, волонтерство і теплі зустрічі між людьми — культура у повсякденні."
  },
  {
    id: "froen-politistasjon",                 // unik nøkkel — IKKE endre etter publisering
    navn: "Frøen politistasjon",
    navn_uk: "Поліцейський відділок Frøen",
    kode: "VAFS-02",                           // lesbar reservekode på stolpen
    poeng: 100,                                // poeng for å finne stedet
    lat: 59.939396,                            // fra UTM 260037.13,6652454.01 (EPSG:25833)
    lng: 10.703714,
    side: "steder/froen-politistasjon.html",   // relativ lenke til stedssiden
    kortbeskrivelse: "Slemdalsveien 54 A – bolig, venterom og politistasjon med celler i sokkelen.", // vises i kart-popup
    kortbeskrivelse_uk: "Slemdalsveien 54 A — житло, кімната очікування та поліцейський відділок з камерами в цоколі."
  },
  {
    id: "grimelund-gard",                      // unik nøkkel — IKKE endre etter publisering
    navn: "Grimelund gård",
    navn_uk: "Садиба Grimelund",
    kode: "VAFS-03",                           // lesbar reservekode på stolpen
    poeng: 100,                                // poeng for å finne stedet
    lat: 59.942646,                            // fra UTM 259450.83,6652855.14 (EPSG:25833)
    lng: 10.692785,
    side: "steder/grimelund-gard.html",        // relativ lenke til stedssiden
    kortbeskrivelse: "En 700 år gammel gård midt i byen – med smie, stabbur, hoppbakke-historie og hemmelige krigsmøter.", // vises i kart-popup
    kortbeskrivelse_uk: "700-річна садиба посеред міста — з кузнею, коморою, історією лижного трампліна і таємними зустрічами часів війни."
  },
  {
    id: "heftyevillaen",                       // unik nøkkel — IKKE endre etter publisering
    navn: "Heftyevillaen",
    navn_uk: "Вілла Heftye",
    kode: "VAFS-04",                           // lesbar reservekode på stolpen
    poeng: 100,                                // poeng for å finne stedet
    lat: 59.976896,                            // fra UTM 258905.80,6656715.86 (EPSG:25833)
    lng: 10.678551,
    side: "steder/heftyevillaen.html",         // relativ lenke til stedssiden
    kortbeskrivelse: "Thomas Heftyes villa fra 1867 ved Frognerseteren – DNTs vugge, presidenter på besøk og spiren til Osloavtalen.", // vises i kart-popup
    kortbeskrivelse_uk: "Вілла Thomas Heftye 1867 року біля Frognerseteren — колиска Норвезького туристичного товариства, гості-президенти й паросток Ословської угоди."
  },
  {
    id: "bogstadleiren",                       // unik nøkkel — IKKE endre etter publisering
    navn: "Bogstadleiren",
    navn_uk: "Табір Bogstad",
    kode: "VAFS-05",                           // lesbar reservekode på stolpen
    poeng: 100,                                // poeng for å finne stedet
    lat: 59.965661,                            // fra UTM 256822,6655598 (EPSG:25833)
    lng: 10.642643,
    side: "steder/bogstadleiren.html",         // relativ lenke til stedssiden
    kortbeskrivelse: "Tysk militærleir, brakkeby for husløse familier, og i dag Bogstad Camping – tre liv på samme jorde.", // vises i kart-popup
    kortbeskrivelse_uk: "Німецький військовий табір, бараки для безпритульних родин, а сьогодні Bogstad Camping — три життя на одному полі."
  }
  // ── Legg til flere steder her ──
];

/** Finn et sted ut fra unik id. Returnerer objektet eller undefined. */
export function finnSted(id) {
  return STEDER.find((s) => s.id === id);
}

/**
 * Finn et sted ut fra lesbar kode (manuell inntasting / reserve for QR).
 * Tolerant for store/små bokstaver og omkringliggende mellomrom.
 */
export function finnStedMedKode(kode) {
  if (!kode) return undefined;
  const normalisert = kode.trim().toUpperCase();
  return STEDER.find((s) => s.kode.toUpperCase() === normalisert);
}
