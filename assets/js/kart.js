// kart.js — initialiserer Leaflet-kart med Kartverkets bakgrunnskart og markører.
//
// Forutsetter at Leaflet (global `L`) er lastet fra CDN i <head> FØR denne modulen
// kjører. Brukes både på forsiden (alle steder) og på stedssidene (lite utsnitt av
// ett sted).

import { STEDER, finnSted } from "./steder.js";
import { erFunnet } from "./jakt.js";
import { t, gjeldendeSprak } from "./i18n.js";

// Kartverkets gratis WMTS-cache (topografisk norgeskart, Web Mercator/EPSG:3857).
// Ingen API-nøkkel. Verifisert mot Geonorge — den gamle tjenesten fases ut.
const KARTVERKET_URL =
  "https://cache.kartverket.no/v1/wmts/1.0.0/topo/default/webmercator/{z}/{y}/{x}.png";
const KARTVERKET_ATTRIBUSJON =
  '&copy; <a href="https://www.kartverket.no/">Kartverket</a>';

// Vestre Aker / Vinderen-området som standard midtpunkt.
const STANDARD_SENTER = [59.962, 10.682];
const STANDARD_ZOOM = 13;

/**
 * Plukk språk-variant av et stedsfelt («navn», «kortbeskrivelse» osv.) hvis den
 * finnes for gjeldende språk. Faller tilbake til norsk-feltet hvis _<sprak>-varianten
 * mangler — slik at gamle rader uten oversettelse fortsatt virker.
 */
function feltMedSprak(sted, felt) {
  const sprak = gjeldendeSprak();
  return sted[`${felt}_${sprak}`] ?? sted[felt];
}

/** Bygg HTML-innholdet i en markør-popup. */
function popupInnhold(sted) {
  const funnetMerke = erFunnet(sted.id)
    ? `<p class="popup-funnet">${t("kart_allerede_besokt")}</p>`
    : "";
  return `
    <div class="kart-popup">
      <strong>${feltMedSprak(sted, "navn")}</strong>
      <p>${feltMedSprak(sted, "kortbeskrivelse")}</p>
      ${funnetMerke}
      <a href="${rotPrefiks()}${sted.side}">${t("kart_les_mer")}</a>
    </div>`;
}

// Alle markører laget med lagKart() — så popup-innholdet kan oppdateres ved
// språkbytte (både «Les mer»/«Allerede besøkt» og stedsnavn/kortbeskrivelse via
// `_<sprak>`-varianter i steder.js).
const _markorer = [];
document.addEventListener("sprakbytte", () => {
  for (const { marker, sted } of _markorer) {
    marker.setPopupContent(popupInnhold(sted));
  }
});

/**
 * Stedssidene ligger i undermappa /steder/, mens forsiden ligger i rot. Lenkene i
 * STEDER er relative til rot ("steder/...") — fra en stedsside må vi opp ett nivå.
 */
function rotPrefiks() {
  return location.pathname.includes("/steder/") ? "../" : "";
}

/**
 * Markørikon. Funne steder vises grønne med ✓, ikke-funne i aksentfargen.
 * Bruker divIcon (CSS-stylet) så vi slipper eksterne markørbilder.
 */
function lagIkon(funnet) {
  return L.divIcon({
    className: "",
    html: `<div class="kart-markor${funnet ? " kart-markor--funnet" : ""}">${funnet ? "✓" : ""}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -15]
  });
}

/**
 * Lag et kart i elementet med gitt id.
 * @param {string} elementId - id på <div> som skal holde kartet.
 * @param {object} [opts]
 * @param {string} [opts.kunSted] - vis kun dette stedet (sentrert), for stedssider.
 * @param {boolean} [opts.interaktiv=true] - false gir et rolig, ikke-zoombart utsnitt.
 */
export function lagKart(elementId, opts = {}) {
  const { kunSted = null, interaktiv = true } = opts;
  const el = document.getElementById(elementId);
  if (!el || typeof L === "undefined") return null;

  const fokusSted = kunSted ? finnSted(kunSted) : null;
  const senter = fokusSted ? [fokusSted.lat, fokusSted.lng] : STANDARD_SENTER;
  const zoom = fokusSted ? 15 : STANDARD_ZOOM;

  const kart = L.map(elementId, {
    center: senter,
    zoom,
    zoomControl: interaktiv,
    scrollWheelZoom: interaktiv,
    dragging: interaktiv,
    doubleClickZoom: interaktiv
  });

  L.tileLayer(KARTVERKET_URL, {
    attribution: KARTVERKET_ATTRIBUSJON,
    maxZoom: 18
  }).addTo(kart);

  const stederSomVises = fokusSted ? [fokusSted] : STEDER;
  for (const sted of stederSomVises) {
    const marker = L.marker([sted.lat, sted.lng], { icon: lagIkon(erFunnet(sted.id)) })
      .addTo(kart)
      .bindPopup(popupInnhold(sted));
    _markorer.push({ marker, sted });
  }

  return kart;
}
