// firebase-config.js — Firebase-oppsett for ledertavla.
//
// VIKTIG (se CLAUDE.md §6): denne web-konfigurasjonen er IKKE en hemmelighet.
// Den ligger i klienten uansett. Sikkerheten styres av Firestore-REGLER, ikke av
// å skjule disse verdiene. Se README for anbefalte regler.
//
// ── Slik fyller Espen inn ekte verdier ──
// Firebase Console → Prosjektinnstillinger → "Dine apper" → web-app → SDK-oppsett
// og konfigurasjon → "Konfigurasjon". Kopier verdiene inn nedenfor.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyD-0A8-zN7vh0qa73P64e-r6HdTnQcoe7A",
  authDomain: "kulturjakten-1e9a7.firebaseapp.com",
  projectId: "kulturjakten-1e9a7",
  storageBucket: "kulturjakten-1e9a7.firebasestorage.app",
  messagingSenderId: "707752835231",
  appId: "1:707752835231:web:b577d514ef064bbf560aaa"
  // measurementId utelatt med vilje — vi bruker ikke Google Analytics.
};

/**
 * Er Firebase faktisk konfigurert, eller står plassholderverdiene fortsatt?
 * Brukes til å vise en vennlig melding i stedet for å kræsje før Espen har
 * limt inn ekte config.
 */
export const FIREBASE_KONFIGURERT = !firebaseConfig.apiKey.startsWith("DIN_");

// Initialiser kun når vi har ekte config, så lokal testing av resten av appen
// (kart, registrering, localStorage) fungerer uten Firebase.
export const app = FIREBASE_KONFIGURERT ? initializeApp(firebaseConfig) : null;
export const db = app ? getFirestore(app) : null;
