// samtykke.js — samtykkebanner + Google Analytics for Kulturjakten.
//
// Personvern: Google Analytics lastes IKKE før brukeren aktivt trykker «Godta».
// Valget huskes i localStorage (vafs_samtykke = "ja" | "nei"). Sier brukeren nei,
// lastes ingenting og banneret kommer ikke tilbake. Vi måler kun trafikk og ber om
// IP-anonymisering — ingen annen informasjon lagres av oss.
//
// Bruk i en side: importer og kall én gang:
//   import { monterSamtykke } from "<sti>/samtykke.js";
//   monterSamtykke();

import { bruk } from "./i18n.js";

const LAGRINGSNOKKEL = "vafs_samtykke";   // "ja" = godtatt, "nei" = avslått
const MALE_ID = "G-2N76DV26V7";           // Google Analytics måle-id (GA4)

let banner = null;     // banner-elementet (opprettes kun ved behov)
let lastet = false;    // hindrer dobbel lasting av GA

function lesValg() {
  try { return localStorage.getItem(LAGRINGSNOKKEL); } catch (_) { return null; }
}
function lagreValg(v) {
  try { localStorage.setItem(LAGRINGSNOKKEL, v); } catch (_) {}
}

/** Last og initialiser Google Analytics (gtag). Kjøres kun etter samtykke. */
function lastAnalytics() {
  if (lastet) return;
  lastet = true;

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + MALE_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", MALE_ID, { anonymize_ip: true });
}

function fjernBanner() {
  if (banner) { banner.remove(); banner = null; }
}

/** Vis samtykkebanneret nederst på siden. */
function visBanner() {
  if (banner) return;
  banner = document.createElement("div");
  banner.className = "samtykke";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-label", "Samtykke til trafikkmåling");
  banner.innerHTML = `
    <p class="samtykke-tekst" data-i18n="samtykke_tekst">Vi ønsker kun din godkjennelse for å måle trafikk – ingen annen informasjon vil bli lagret.</p>
    <div class="samtykke-knapper">
      <button type="button" class="knapp" id="samtykke-godta" data-i18n="samtykke_godta">Godta</button>
      <button type="button" class="knapp knapp-sekundaer" id="samtykke-avsla" data-i18n="samtykke_avsla">Nei takk</button>
    </div>`;
  document.body.appendChild(banner);

  // Oversett de injiserte tekstene (banneret kom etter i18n sin første gjennomgang).
  // Ved senere språkbytte plukker i18n sin globale bruk() opp [data-i18n] selv.
  bruk(banner);

  banner.querySelector("#samtykke-godta").addEventListener("click", () => {
    lagreValg("ja");
    fjernBanner();
    lastAnalytics();
  });
  banner.querySelector("#samtykke-avsla").addEventListener("click", () => {
    lagreValg("nei");
    fjernBanner();
  });
}

/** Last GA hvis allerede godtatt, ellers vis samtykkebanneret. */
export function monterSamtykke() {
  const valg = lesValg();
  if (valg === "ja") { lastAnalytics(); return; }
  if (valg === "nei") return;
  visBanner();
}
