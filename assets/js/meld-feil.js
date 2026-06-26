// meld-feil.js — gjenbrukbart «Meld feil»-skjema (modal) for Kulturjakten.
//
// Brukeren melder fra om en stolpe som mangler, er ødelagt, eller en feil i
// teksten. Siden er statisk (GitHub Pages), så selve e-postutsendingen gjøres av
// FormSubmit.co — en gratis skjema-til-e-post-tjeneste uten konto. Skjemaet POST-er
// (AJAX) til endepunktet under, og FormSubmit videresender innsendingen som e-post
// til kulturjakten@frivilligsentralen.org.
//
// FØRSTE GANG må mottakeren bekrefte via en aktiverings-e-post fra FormSubmit
// (engangs). Etter det ruller meldingene inn av seg selv. Vil du skjule adressen i
// kildekoden? Bytt e-posten under med den anonyme alias-strengen FormSubmit oppgir.
//
// Bruk i en side: legg en knapp med attributtet data-meld-feil i HTML, og kall
//   import { monterMeldFeil } from "<sti>/meld-feil.js";
//   monterMeldFeil();              // forsiden (intet forhåndsvalgt sted)
//   monterMeldFeil(STED_ID);       // stedsside (forhåndsvelger stedet)

import { STEDER } from "./steder.js";
import { t, gjeldendeSprak, bruk } from "./i18n.js";
import { lesTilstand } from "./jakt.js";

const ENDEPUNKT = "https://formsubmit.co/ajax/kulturjakten@frivilligsentralen.org";

let dialog = null;        // <dialog>-elementet (opprettes kun én gang)
let forhandsvalgt = "";   // sted-id som forhåndsvelges når dialogen åpnes

/** Stedsnavn på gjeldende språk, med fallback til norsk. */
function stedNavn(sted) {
  return sted["navn_" + gjeldendeSprak()] || sted.navn;
}

/** Bygg (eller bygg om) nedtrekket med steder — beholder gjeldende valg. */
function byggStedAlternativer(select) {
  const valgt = select.value || forhandsvalgt;
  select.innerHTML = "";

  const velg = new Option(t("meld_feil_sted_velg"), "");
  velg.disabled = true;
  select.add(velg);

  STEDER.forEach((s) => select.add(new Option(stedNavn(s), s.id)));
  select.add(new Option(t("meld_feil_sted_annet"), "_annet"));

  select.value = valgt || "";
  if (!select.value) velg.selected = true;
}

/** Opprett dialogen og koble den til (kjøres kun én gang). */
function lagDialog() {
  dialog = document.createElement("dialog");
  dialog.className = "meld-feil-dialog";
  dialog.innerHTML = `
    <form class="skjema" id="meld-feil-skjema">
      <h2 data-i18n="meld_feil_tittel">Meld feil på en stolpe</h2>
      <p class="dempet" data-i18n="meld_feil_intro">Mangler en stolpe, er den ødelagt, eller fant du en feil i teksten? Gi oss beskjed.</p>

      <label><span data-i18n="meld_feil_sted_label">Hvilken stolpe gjelder det?</span>
        <select id="mf-sted"></select>
      </label>

      <label><span data-i18n="meld_feil_tekst_label">Hva er feil?</span>
        <textarea id="mf-tekst" rows="4" required maxlength="2000"
                  data-i18n-attr="placeholder:meld_feil_tekst_ph"></textarea>
      </label>

      <label><span data-i18n="meld_feil_navn_label">Navn (valgfritt)</span>
        <input type="text" id="mf-navn" maxlength="60" autocomplete="name" />
      </label>

      <label><span data-i18n="meld_feil_epost_label">E-post (valgfritt, hvis vi kan svare deg)</span>
        <input type="email" id="mf-epost" maxlength="120" autocomplete="email" />
      </label>

      <!-- Honningfelle mot spam: skjult for mennesker, fylles kun av bots. -->
      <input type="text" name="_honey" id="mf-honey" tabindex="-1" autocomplete="off"
             aria-hidden="true" style="position:absolute;left:-5000px" />

      <p class="meld-feil-status" id="mf-status" hidden></p>

      <div class="meld-feil-knapper">
        <button type="submit" id="mf-send" data-i18n="meld_feil_send">Send melding</button>
        <button type="button" class="knapp knapp-sekundaer" id="mf-lukk" data-i18n="meld_feil_lukk">Lukk</button>
      </div>
    </form>`;
  document.body.appendChild(dialog);

  // Oversett de statiske tekstene i dialogen (den ble injisert etter at i18n
  // kjørte sin første gjennomgang av dokumentet).
  bruk(dialog);
  byggStedAlternativer(dialog.querySelector("#mf-sted"));

  dialog.querySelector("#mf-lukk").addEventListener("click", () => dialog.close());
  dialog.querySelector("#meld-feil-skjema").addEventListener("submit", sendInn);

  // Ved språkbytte oppdaterer bruk() de statiske tekstene automatisk; vi bygger
  // bare om nedtrekket (stedsnavn på nytt språk).
  document.addEventListener("sprakbytte", () => byggStedAlternativer(dialog.querySelector("#mf-sted")));
}

/** Åpne dialogen, forhåndsvelg sted og forhåndsfyll navn. */
function apne(stedId) {
  forhandsvalgt = stedId || "";
  const select = dialog.querySelector("#mf-sted");
  byggStedAlternativer(select);
  if (stedId) select.value = stedId;

  const navnFelt = dialog.querySelector("#mf-navn");
  if (!navnFelt.value) {
    const kallenavn = lesTilstand().kallenavn;
    if (kallenavn) navnFelt.value = kallenavn;
  }

  const status = dialog.querySelector("#mf-status");
  status.hidden = true;
  status.textContent = "";
  status.className = "meld-feil-status";

  dialog.showModal();
}

/** Send innsendingen til FormSubmit (AJAX) og vis status i dialogen. */
async function sendInn(e) {
  e.preventDefault();
  const form = dialog.querySelector("#meld-feil-skjema");

  // Honningfelle utløst → stille avvisning (bot).
  if (form.querySelector("#mf-honey").value) { dialog.close(); return; }

  const tekst = form.querySelector("#mf-tekst").value.trim();
  if (!tekst) { form.querySelector("#mf-tekst").focus(); return; }

  const select = form.querySelector("#mf-sted");
  const valgtSted = STEDER.find((s) => s.id === select.value);
  const stedTekst = valgtSted
    ? `${valgtSted.navn} (${valgtSted.id}, kode ${valgtSted.kode})`
    : t("meld_feil_sted_annet");

  const status = form.querySelector("#mf-status");
  const sendKnapp = form.querySelector("#mf-send");
  status.hidden = false;
  status.className = "meld-feil-status dempet";
  status.textContent = t("meld_feil_sender");
  sendKnapp.disabled = true;

  try {
    const svar = await fetch(ENDEPUNKT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        _subject: "Meld feil – Kulturjakten: " + (valgtSted ? valgtSted.navn : "ukjent/manglende stolpe"),
        _template: "table",
        _captcha: "false",
        sted: stedTekst,
        feil: tekst,
        navn: form.querySelector("#mf-navn").value.trim(),
        epost: form.querySelector("#mf-epost").value.trim(),
        side: location.href
      })
    });
    const data = await svar.json().catch(() => ({}));
    if (svar.ok && (data.success === "true" || data.success === true)) {
      status.className = "meld-feil-status ok";
      status.textContent = t("meld_feil_takk");
      form.querySelector("#mf-tekst").value = "";
      form.querySelector("#mf-navn").value = "";
      form.querySelector("#mf-epost").value = "";
    } else {
      throw new Error("FormSubmit svarte ikke OK");
    }
  } catch (_) {
    status.className = "meld-feil-status feil";
    status.textContent = t("meld_feil_sendefeil");
  } finally {
    sendKnapp.disabled = false;
  }
}

/**
 * Monter «Meld feil»-skjemaet på siden. Kobler alle [data-meld-feil]-knapper til
 * å åpne dialogen. Oppgi stedets id på en stedsside for å forhåndsvelge det.
 */
export function monterMeldFeil(forhandsvalgtStedId = "") {
  if (!dialog) lagDialog();
  document.querySelectorAll("[data-meld-feil]").forEach((knapp) => {
    if (knapp.dataset.meldFeilKoblet) return;
    knapp.dataset.meldFeilKoblet = "1";
    knapp.addEventListener("click", () => apne(forhandsvalgtStedId));
  });
}
