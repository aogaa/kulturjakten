// ledertavle.js — all Firestore-kontakt for ledertavla.
//
// Kolleksjonen `ledertavle` har ett dokument per deltaker:
//   { kallenavn, poeng, sistOppdatert }
// Ingen e-post, ingen koordinater, ingenting som identifiserer en person.
// (Rader skrevet før klassene ble fjernet kan ha et ekstra `klasse`-felt —
// det ignoreres ved lesing og forsvinner når raden overskrives.)
//
// Dokument-id utledes fra kallenavnet (slug). Det betyr at samme kallenavn
// oppdaterer samme rad i stedet for å lage duplikater når poengsummen øker. To
// personer med identisk kallenavn vil dele rad — akseptert i en tillitsbasert v1.

import { db, FIREBASE_KONFIGURERT } from "./firebase-config.js";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/** Lag en stabil, filtrygg dokument-id fra et kallenavn. */
function kallenavnTilId(kallenavn) {
  return kallenavn
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9æøå-]/g, "");
}

/**
 * Skriv/oppdater deltakerens rad på ledertavla med ny totalsum.
 * No-op hvis Firebase ikke er konfigurert ennå (lokal testing).
 */
export async function oppdaterLedertavle({ kallenavn, poeng }) {
  if (!FIREBASE_KONFIGURERT) {
    console.info("[ledertavle] Firebase ikke konfigurert — hopper over skriving.");
    return { skrevet: false };
  }
  const id = kallenavnTilId(kallenavn);
  if (!id) return { skrevet: false };

  await setDoc(doc(db, "ledertavle", id), {
    kallenavn: kallenavn.trim(),
    poeng,
    sistOppdatert: serverTimestamp()
  });
  return { skrevet: true };
}

/**
 * Hent alle rader fra ledertavla, sortert synkende på poeng.
 * Returnerer [] hvis Firebase ikke er konfigurert.
 */
export async function hentLedertavle() {
  if (!FIREBASE_KONFIGURERT) return [];
  const snapshot = await getDocs(collection(db, "ledertavle"));
  const rader = [];
  snapshot.forEach((d) => rader.push(d.data()));
  rader.sort((a, b) => (b.poeng || 0) - (a.poeng || 0));
  return rader;
}
