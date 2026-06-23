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
  // ── AVPUBLISERT 2026-06-18 (Espen): Grimelund gård er midlertidig tatt ut av
  //    kartet og jakten. HTML-sida (steder/grimelund-gard.html) og koden VAFS-03
  //    er bevart. Fjern kommentaren under for å publisere stedet igjen. ──
  // {
  //   id: "grimelund-gard",                      // unik nøkkel — IKKE endre etter publisering
  //   navn: "Grimelund gård",
  //   navn_uk: "Садиба Grimelund",
  //   kode: "VAFS-03",                           // lesbar reservekode på stolpen
  //   poeng: 100,                                // poeng for å finne stedet
  //   lat: 59.942646,                            // fra UTM 259450.83,6652855.14 (EPSG:25833)
  //   lng: 10.692785,
  //   side: "steder/grimelund-gard.html",        // relativ lenke til stedssiden
  //   kortbeskrivelse: "En 700 år gammel gård midt i byen – med smie, stabbur, hoppbakke-historie og hemmelige krigsmøter.", // vises i kart-popup
  //   kortbeskrivelse_uk: "700-річна садиба посеред міста — з кузнею, коморою, історією лижного трампліна і таємними зустрічами часів війни."
  // },
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
    lat: 59.961952,                            // fra UTM 256670,6655193.74 (EPSG:25833)
    lng: 10.640405,
    side: "steder/bogstadleiren.html",         // relativ lenke til stedssiden
    kortbeskrivelse: "Tysk militærleir, brakkeby for husløse familier, og i dag Bogstad Camping – tre liv på samme jorde.", // vises i kart-popup
    kortbeskrivelse_uk: "Німецький військовий табір, бараки для безпритульних родин, а сьогодні Bogstad Camping — три життя на одному полі."
  },
  {
    id: "holmendammen",                        // unik nøkkel — IKKE endre etter publisering
    navn: "Holmendammen",
    navn_uk: "Ставок Holmendammen",
    kode: "VAFS-06",                           // lesbar reservekode på stolpen
    poeng: 100,                                // poeng for å finne stedet
    lat: 59.944847,                            // fra UTM 258769.53,6653145.46 (EPSG:25833)
    lng: 10.680287,
    side: "steder/holmendammen.html",          // relativ lenke til stedssiden
    kortbeskrivelse: "Da isen herfra holdt bryggeri-Kristiania kald – hester, sleder og en elleveåring som kjørte for brødskiver.", // vises i kart-popup
    kortbeskrivelse_uk: "Колись лід звідси охолоджував Крістіанію — коні, сани та одинадцятирічний хлопчина, що возив лід за окрайці хліба."
  },
  {
    id: "holmenkollen-kapell",                 // unik nøkkel — IKKE endre etter publisering
    navn: "Holmenkollen kapell",
    navn_uk: "Каплиця Holmenkollen",
    kode: "VAFS-07",                           // lesbar reservekode på stolpen
    poeng: 100,                                // poeng for å finne stedet
    lat: 59.96542027,                          // GPS-posisjon (EU89 / WGS84)
    lng: 10.67226674,
    side: "steder/holmenkollen-kapell.html",   // relativ lenke til stedssiden
    kortbeskrivelse: "Stavkirkelignende sportskapell fra 1903 – brant ned i 1992, gjenreist i 1996 som landemerke over byen.", // vises i kart-popup
    kortbeskrivelse_uk: "Спортивна каплиця 1903 року у стилі ставкірки — згоріла 1992-го, відбудована 1996-го як прикмета над містом."
  },
  {
    id: "flyulykken-voksenkollen",             // unik nøkkel — IKKE endre etter publisering
    navn: "Flyulykken på Voksenkollen",
    navn_uk: "Авіакатастрофа на Voksenkollen",
    kode: "VAFS-08",                           // lesbar reservekode på stolpen
    poeng: 100,                                // poeng for å finne stedet
    lat: 59.970000,                            // fra 59°58′12″N (DMS → desimal)
    lng: 10.661667,                            // fra 10°39′42″Ø (DMS → desimal)
    side: "steder/flyulykken-voksenkollen.html", // relativ lenke til stedssiden
    kortbeskrivelse: "Her styrtet et kanadisk militærfly 18. desember 1945 – ising tok løftet fra vingene, og bare to av dem om bord overlevde.", // vises i kart-popup
    kortbeskrivelse_uk: "Тут 18 грудня 1945 року розбився канадський військовий літак — обмерзання позбавило крила підйомної сили, і з тих, хто був на борту, вижили лише двоє."
  },
  {
    id: "huseby-skole",                        // unik nøkkel — IKKE endre etter publisering
    navn: "Huseby skole",
    navn_uk: "Школа Huseby",
    kode: "VAFS-09",                           // lesbar reservekode på stolpen
    poeng: 100,                                // poeng for å finne stedet
    lat: 59.946020,                            // fra UTM 257260.18,6653375.45 (EPSG:25833)
    lng: 10.653080,
    side: "steder/huseby-skole.html",          // relativ lenke til stedssiden
    kortbeskrivelse: "Skole siden 1862 – fra ett tømret hus med 56 elever til et helt kvartal med bygninger fra fem tidsaldre.", // vises i kart-popup
    kortbeskrivelse_uk: "Школа від 1862 року — від одного зрубного будинку з 56 учнями до цілого кварталу будівель п’яти епох."
  },
  {
    id: "holmenkollbakken",                    // unik nøkkel — IKKE endre etter publisering
    navn: "Holmenkollbakken",
    navn_uk: "Трамплін Holmenkollbakken",
    kode: "VAFS-10",                           // lesbar reservekode på stolpen
    poeng: 100,                                // poeng for å finne stedet
    lat: 59.963541,                            // fra UTM 258203.24,6655270.42 (EPSG:25833)
    lng: 10.667694,
    side: "steder/holmenkollbakken.html",      // relativ lenke til stedssiden
    kortbeskrivelse: "Verdens mest tradisjonsrike hoppbakke – fra 21,5 meter på snø og kvist i 1892 til stålbakken og Holmenkollrennene i dag.", // vises i kart-popup
    kortbeskrivelse_uk: "Найбагатший на традиції лижний трамплін світу — від 21,5 метра на снігу й хмизі 1892 року до сталевого трампліна й Holmenkollrennene сьогодні."
  },
  {
    id: "ris-kirke",                           // unik nøkkel — IKKE endre etter publisering
    navn: "Ris kirke",
    kode: "VAFS-11",                           // lesbar reservekode på stolpen
    poeng: 100,                                // poeng for å finne stedet
    lat: 59.947978,                            // fra UTM 260077.79,6653409.78 (EPSG:25833)
    lng: 10.703331,
    side: "steder/ris-kirke.html",             // relativ lenke til stedssiden
    kortbeskrivelse: "«Englekirken» fra 1932 – støpt i betong, vigslet med kong Haakon til stede, med en av Norges største kirkeklokker i tårnet." // vises i kart-popup
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
