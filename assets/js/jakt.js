// jakt.js — brukerens fremgang, lagret i localStorage på enheten.
//
// Følger ENHETEN, ikke personen. Ingen innlogging, ingen brukerkontoer. Dette er
// bevisst og akseptert (se CLAUDE.md §2). Ingenting herfra sendes til noen server
// utenom totalpoeng + kallenavn + klasse til ledertavla (se ledertavle.js).

const NOKKEL = "vafs_jakt";

/** Klasser brukeren kan velge mellom. Tillitsbasert, selvvalgt. */
export const KLASSER = ["Barn", "Voksen", "Senior"];

/** Tom standardtilstand for en ny bruker/enhet. */
function tomTilstand() {
  return { kallenavn: "", klasse: "", funnet: {}, totalpoeng: 0 };
}

/** Les hele tilstanden fra localStorage. Returnerer alltid et gyldig objekt. */
export function lesTilstand() {
  try {
    const raa = localStorage.getItem(NOKKEL);
    if (!raa) return tomTilstand();
    const t = JSON.parse(raa);
    // Vær defensiv mot delvis/ødelagt data.
    return {
      kallenavn: typeof t.kallenavn === "string" ? t.kallenavn : "",
      klasse: typeof t.klasse === "string" ? t.klasse : "",
      funnet: t.funnet && typeof t.funnet === "object" ? t.funnet : {},
      totalpoeng: Number.isFinite(t.totalpoeng) ? t.totalpoeng : 0
    };
  } catch {
    return tomTilstand();
  }
}

/** Skriv hele tilstanden tilbake til localStorage. */
export function lagreTilstand(t) {
  localStorage.setItem(NOKKEL, JSON.stringify(t));
}

/** Har brukeren valgt kallenavn og klasse? */
export function harProfil() {
  const t = lesTilstand();
  return Boolean(t.kallenavn && t.klasse);
}

/** Sett (eller endre) kallenavn og klasse. */
export function settProfil(kallenavn, klasse) {
  const t = lesTilstand();
  t.kallenavn = kallenavn.trim();
  t.klasse = klasse;
  lagreTilstand(t);
  return t;
}

/** Har brukeren allerede registrert dette stedet? */
export function erFunnet(id) {
  return Boolean(lesTilstand().funnet[id]);
}

/**
 * Registrer et sted lokalt. Idempotent: gir kun poeng første gang.
 * Returnerer { nytt: boolean, tilstand } — `nytt` er true bare ved førstegangsfunn.
 */
export function registrerLokalt(id, poeng) {
  const t = lesTilstand();
  if (t.funnet[id]) {
    return { nytt: false, tilstand: t };
  }
  t.funnet[id] = { tid: new Date().toISOString(), poeng };
  t.totalpoeng += poeng;
  lagreTilstand(t);
  return { nytt: true, tilstand: t };
}
