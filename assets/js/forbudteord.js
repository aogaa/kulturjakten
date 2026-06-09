// forbudteord.js — enkel blokkliste mot upassende kallenavn.
//
// Brukes to steder:
//   Lag 1: hindrer registrering når kallenavnet matcher (forside + stedssider).
//   Lag 2: maskerer navn på ledertavla som ekstra sikring.
//
// IKKE vanntett: en bevisst, teknisk anlagt person kan omgå klientsiden, og
// målrettede men «rene» navn (uten banneord) fanges ikke. Filteret fanger de
// late/spontane tilfellene; resten rydder du reaktivt i Firestore-konsollen.
//
// ── Slik vedlikeholder Espen lista ──
// Legg til eller fjern ord i LISTE nedenfor. Skriv ordene i SMÅBOKSTAVER.
// Normaliseringen under fanger automatisk vanlige omskrivninger:
//   store bokstaver, mellomrom ("p i k k"), og tall/tegn-erstatninger ("p1kk", "p!kk").

// Vanlige "leetspeak"-erstatninger → bokstav.
const LEET = {
  "0": "o", "1": "i", "3": "e", "4": "a", "5": "s",
  "7": "t", "8": "b", "9": "g", "@": "a", "$": "s", "!": "i", "+": "t"
};

/**
 * Normaliser en tekst for sammenligning: småbokstaver, leetspeak → bokstaver,
 * og fjern alt som ikke er bokstaver (mellomrom, tall-rester, skilletegn).
 * Slik blir "P 1 k K!" → "pikk".
 */
export function normaliser(tekst) {
  return (tekst || "")
    .toLowerCase()
    .replace(/[0134578@$!+]/g, (c) => LEET[c] || c)
    .replace(/[^a-zæøå]/g, "");
}

// Startliste — utvid ved behov. Holdt kort og spesifikk for å begrense
// «falske treff» (uskyldige navn som tilfeldigvis inneholder et ord).
export const LISTE = [
  // Vulgært (norsk)
  "pikk", "kuk", "fitte", "fitta", "kuksuger", "pul", "knull",
  "hore", "ludder", "bæsj", "dritt", "jævla", "jævel",
  "faen", "helvete", "satan",
  // Slurs / hets (norsk)
  "neger", "nazi",
  // Vanlige engelske
  "fuck", "shit", "bitch", "nigger", "cunt", "asshole", "motherfucker"
];

const NORMALISERT_LISTE = LISTE.map(normaliser).filter(Boolean);

/**
 * Er kallenavnet upassende? Sann hvis den normaliserte teksten inneholder et
 * av de forbudte ordene.
 */
export function erUpassende(navn) {
  const n = normaliser(navn);
  if (!n) return false;
  return NORMALISERT_LISTE.some((ord) => n.includes(ord));
}
