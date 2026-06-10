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

/** Enkel HTML-escape for brukerinput (kallenavn vises tilbake i DOM). */
function escape(tekst) {
  const div = document.createElement("div");
  div.textContent = tekst;
  return div.innerHTML;
}

/**
 * Start registreringen for et sted.
 * @param {string} stedId - id fra STEDER (settes i stedssidens markup).
 * @param {string} [boksId="registrering"] - id på containeren statusen skrives til.
 */
export async function kjorRegistrering(stedId, boksId = "registrering") {
  const boks = document.getElementById(boksId);
  const sted = finnSted(stedId);

  if (!boks) return;
  if (!sted) {
    boks.innerHTML =
      '<p class="reg-feil">Ukjent sted. Sjekk at id-en stemmer med steder.js.</p>';
    return;
  }

  // Registrering krever stolpens kode i URL-en (?k=<kode>). QR-koden inneholder
  // den; kart-lenker gjør det ikke. Da blir siden ren lesing (ingen poeng for å
  // klikke seg dit fra sofaen). Reservekoden tastes inn på forsiden.
  const kodeFraUrl = (new URLSearchParams(location.search).get("k") || "").trim().toUpperCase();
  const harGyldigKode = Boolean(kodeFraUrl) && kodeFraUrl === sted.kode.toUpperCase();

  if (!harGyldigKode) {
    visLesemodus(boks, sted);
    return;
  }

  if (!harProfil()) {
    visBliMedSkjema(boks, sted);
    return;
  }

  await registrerOgVis(boks, sted);
}

/** Lesemodus: nådd siden uten gyldig kode (f.eks. via kartet). Ingen poeng. */
function visLesemodus(boks, sted) {
  if (erFunnet(sted.id)) {
    boks.innerHTML = `
      <div class="reg-besokt">
        <p>✓ Du har allerede besøkt dette stedet.</p>
      </div>`;
    return;
  }
  boks.innerHTML = `
    <div class="reg-lesemodus">
      <p>Du leser om dette stedet. For å registrere besøket og få poeng må du
         <strong>skanne QR-koden på stolpen</strong> – eller taste inn koden fra
         stolpen på forsiden.</p>
      <a class="knapp knapp-sekundaer" href="../index.html">Til forsiden</a>
    </div>`;
}

/** Vis skjemaet for å velge kallenavn, og registrer ved innsending. */
function visBliMedSkjema(boks, sted) {
  boks.innerHTML = `
    <div class="reg-blimed">
      <h3>Vil du være med på jakten?</h3>
      <p>Velg et kallenavn for å registrere dette stedet og samle poeng.
         Du kan lese siden uansett.</p>
      <form id="reg-skjema" class="reg-skjema">
        <label>Kallenavn
          <input type="text" id="reg-kallenavn" maxlength="20" required
                 autocomplete="off" placeholder="F.eks. Turbo" />
        </label>
        <p class="reg-feil" id="reg-navn-feil" hidden></p>
        <button type="submit">Bli med og registrer</button>
      </form>
    </div>`;

  const skjema = boks.querySelector("#reg-skjema");
  skjema.addEventListener("submit", async (e) => {
    e.preventDefault();
    const kallenavn = boks.querySelector("#reg-kallenavn").value.trim();
    if (!kallenavn) return;
    const feil = boks.querySelector("#reg-navn-feil");
    if (erUpassende(kallenavn)) {
      feil.textContent = "Velg et vennligere kallenavn 🙂";
      feil.hidden = false;
      return;
    }
    settProfil(kallenavn);
    await registrerOgVis(boks, sted);
  });
}

/** Registrer stedet (idempotent), oppdater ledertavla, og vis resultatet. */
async function registrerOgVis(boks, sted) {
  const { nytt } = registrerLokalt(sted.id, sted.poeng);
  const t = lesTilstand();

  if (nytt) {
    boks.innerHTML = `
      <div class="reg-nytt">
        <h3>🎉 Nytt sted funnet!</h3>
        <p class="reg-poeng">+${sted.poeng} poeng</p>
        <p>Hei ${escape(t.kallenavn)} — du har nå <strong>${t.totalpoeng} poeng</strong> totalt.</p>
      </div>`;
    try {
      await oppdaterLedertavle({
        kallenavn: t.kallenavn,
        poeng: t.totalpoeng
      });
    } catch (err) {
      console.warn("[registrering] Kunne ikke oppdatere ledertavla:", err);
    }
  } else {
    boks.innerHTML = `
      <div class="reg-besokt">
        <p>✓ Du har allerede besøkt dette stedet. Ingen nye poeng denne gangen.</p>
        <p>Du har <strong>${t.totalpoeng} poeng</strong> totalt.</p>
      </div>`;
  }
}
