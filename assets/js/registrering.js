// registrering.js — registreringsflyten på en stedsside.
//
// Kalles fra hver stedsside med stedets id. Håndterer tre tilfeller:
//   1. Ingen profil ennå  → vis et lite «bli med»-skjema (men siden er åpen å lese).
//   2. Nytt sted          → registrer, gi poeng, oppdater ledertavla.
//   3. Allerede besøkt    → diskré markering, ingen nye poeng.

import { finnSted } from "./steder.js";
import {
  harProfil,
  settProfil,
  registrerLokalt,
  lesTilstand,
  erFunnet
} from "./jakt.js";
import { oppdaterLedertavle } from "./ledertavle.js";
import { erUpassende } from "./forbudteord.js";
import { t, plural } from "./i18n.js";

/** Enkel HTML-escape for brukerinput (kallenavn vises tilbake i DOM). */
function escape(tekst) {
  const div = document.createElement("div");
  div.textContent = tekst;
  return div.innerHTML;
}

// Siste rendrede tilstand for den aktive registreringsboksen. Brukt for å
// tegne på nytt når brukeren bytter språk (CustomEvent `sprakbytte`).
let _boks = null;
let _sted = null;
let _tegn = null;

function setTegn(fn) {
  _tegn = fn;
  fn();
}

/**
 * Start registreringen for et sted.
 * @param {string} stedId - id fra STEDER (settes i stedssidens markup).
 * @param {string} [boksId="registrering"] - id på containeren statusen skrives til.
 */
export async function kjorRegistrering(stedId, boksId = "registrering") {
  const boks = document.getElementById(boksId);
  const sted = finnSted(stedId);
  _boks = boks;
  _sted = sted;

  if (!boks) return;
  if (!sted) {
    setTegn(() => {
      boks.innerHTML = `<p class="reg-feil">${t("reg_ukjent_sted")}</p>`;
    });
    return;
  }

  // Registrering krever stolpens kode i URL-en (?k=<kode>). QR-koden inneholder
  // den; kart-lenker gjør det ikke. Da blir siden ren lesing (ingen poeng for å
  // klikke seg dit fra sofaen). Reservekoden tastes inn på forsiden.
  const kodeFraUrl = (new URLSearchParams(location.search).get("k") || "").trim().toUpperCase();
  const harGyldigKode = Boolean(kodeFraUrl) && kodeFraUrl === sted.kode.toUpperCase();

  if (!harGyldigKode) {
    visLesemodus();
    return;
  }

  if (!harProfil()) {
    visBliMedSkjema();
    return;
  }

  await registrerOgVis();
}

/** Lesemodus: nådd siden uten gyldig kode (f.eks. via kartet). Ingen poeng. */
function visLesemodus() {
  setTegn(() => {
    if (erFunnet(_sted.id)) {
      _boks.innerHTML = `
        <div class="reg-besokt">
          <p>${t("reg_allerede_besokt_kort")}</p>
        </div>`;
      return;
    }
    _boks.innerHTML = `
      <div class="reg-lesemodus">
        <p>${t("reg_lesemodus_html")}</p>
        <a class="knapp knapp-sekundaer" href="../index.html">${t("til_forsiden")}</a>
      </div>`;
  });
}

/** Vis skjemaet for å velge kallenavn, og registrer ved innsending. */
function visBliMedSkjema() {
  setTegn(() => {
    _boks.innerHTML = `
      <div class="reg-blimed">
        <h3>${t("reg_vil_du_bli_med")}</h3>
        <p>${t("reg_velg_navn")}</p>
        <form id="reg-skjema" class="reg-skjema">
          <label><span>${t("profil_label")}</span>
            <input type="text" id="reg-kallenavn" maxlength="20" required
                   autocomplete="off" placeholder="${t("profil_placeholder")}" />
          </label>
          <p class="reg-feil" id="reg-navn-feil" hidden></p>
          <button type="submit">${t("reg_skjema_knapp")}</button>
        </form>`;

    const skjema = _boks.querySelector("#reg-skjema");
    skjema.addEventListener("submit", async (e) => {
      e.preventDefault();
      const kallenavn = _boks.querySelector("#reg-kallenavn").value.trim();
      if (!kallenavn) return;
      const feil = _boks.querySelector("#reg-navn-feil");
      if (erUpassende(kallenavn)) {
        feil.textContent = t("feil_navn");
        feil.hidden = false;
        return;
      }
      settProfil(kallenavn);
      await registrerOgVis();
    });
  });
}

/** Registrer stedet (idempotent), oppdater ledertavla, og vis resultatet. */
async function registrerOgVis() {
  const { nytt } = registrerLokalt(_sted.id, _sted.poeng);

  if (nytt) {
    visNyttFunnet();
    try {
      const tilst = lesTilstand();
      await oppdaterLedertavle({
        kallenavn: tilst.kallenavn,
        poeng: tilst.totalpoeng
      });
    } catch (err) {
      console.warn("[registrering] Kunne ikke oppdatere ledertavla:", err);
    }
  } else {
    visAlleredeBesokt();
  }
}

function visNyttFunnet() {
  setTegn(() => {
    const tilst = lesTilstand();
    const poengsum = `${tilst.totalpoeng} ${plural("poeng_form", tilst.totalpoeng)}`;
    const linje = t("reg_nytt_du_har_html")
      .replace("{navn}", escape(tilst.kallenavn))
      .replace("{poeng}", poengsum);
    _boks.innerHTML = `
      <div class="reg-nytt">
        <h3>${t("reg_nytt_tittel")}</h3>
        <p class="reg-poeng">+${_sted.poeng} ${plural("poeng_form", _sted.poeng)}</p>
        <p>${linje}</p>
      </div>`;
  });
}

function visAlleredeBesokt() {
  setTegn(() => {
    const tilst = lesTilstand();
    const poengsum = `${tilst.totalpoeng} ${plural("poeng_form", tilst.totalpoeng)}`;
    const linje = t("reg_du_har_totalt_html").replace("{poeng}", poengsum);
    _boks.innerHTML = `
      <div class="reg-besokt">
        <p>${t("reg_besokt_ingen_nye")}</p>
        <p>${linje}</p>
      </div>`;
  });
}

// Re-tegn ved språkbytte (tegner alt unntatt evt. brukerinput i skjemafeltet).
document.addEventListener("sprakbytte", () => {
  if (_tegn) _tegn();
});
