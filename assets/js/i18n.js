// i18n.js — lett oversettingslag for Kulturjakten (vanilla JS, ingen avhengigheter).
//
// Konvensjon (viktig — ikke bland):
//   • SPRÅKKODE (ISO 639-1) i nøkler/lagring: "nb" = norsk, "uk" = ukrainsk.
//   • LANDSKODE (ISO 3166-1) brukes KUN i flagg-filnavn: "no", "ua".
//
// Bruk i HTML:
//   <h2 data-i18n="hva_tittel">Hva vi har laget</h2>            → setter textContent
//   <p  data-i18n-html="hva_tekst">…</p>                         → setter innerHTML (HTML i ordboken)
//   <input data-i18n-attr="placeholder:kode_placeholder" />     → setter attributt (en eller flere, ";"-separert)
//   <img   data-i18n-attr="alt:topp_logo_alt" />
//
// Bruk i JS:
//   import { t, settSprak, gjeldendeSprak } from "./i18n.js";
//   knapp.textContent = t("kom_i_gang_knapp");
//
// Side-spesifikk re-rendering ved språkbytte:
//   document.addEventListener("sprakbytte", () => { ... oppdater dynamisk innhold ... });

const LAGRINGSNOKKEL = "vafs_sprak";
const STANDARD = "nb";
const STOTTEDE = ["nb", "uk"];

export const OVERSETTELSER = {
  nb: {
    // Header / footer
    topp_logo_alt: "Vestre Aker Frivilligsentral",
    topp_org: "Stiftelsen Vestre Aker Frivilligsentral",
    topp_tittel: "Kultur- og historiejakt",
    bunn_org: "Stiftelsen Vestre Aker Frivilligsentral",
    sprak_no_alt: "Norsk",
    sprak_uk_alt: "Ukrainsk",

    // Hero
    hero_tittel: "Oppdag historien rett rundt hjørnet",
    hero_tekst: "Vestre Aker er fullt av historier. Gå på tur, finn stolpene og bli kjent med nabolaget på en helt ny måte.",

    // Hvorfor
    hvorfor_tittel: "Hvorfor kulturjakt?",
    hvorfor_tekst: "Vi tror nærmiljøets historie fortjener å bli oppdaget – til fots, sammen og ute i frisk luft. Kulturjakten er en gratis tur- og historieopplevelse for hele Vestre Aker: god for beina, hjertet og nysgjerrigheten.",

    // Hva — paragrafen bygges av forsiden i tre deler (pre + tellbart substantiv + post)
    // slik at språk med pluraliseringsregler kan velge riktig form for tallet.
    hva_tittel: "Hva vi har laget",
    hva_tekst_pre: "Rundt om har vi satt ut stolper på steder med lokalhistorisk verdi. Hver stolpe har en QR-kode som tar deg til en side med historien om stedet, bilder og kart. Ingen app, ingen innlogging – bare et kallenavn. ",
    hva_steder_navn: ["sted", "steder"],
    hva_tekst_post: [" venter på å bli oppdaget.", " venter på å bli oppdaget."],

    // Hvordan
    hvordan_tittel: "Slik bruker du det",
    steg1_tittel: "Velg et kallenavn",
    steg1_tekst: "Helt enkelt – ingen innlogging. Alt er helt anonymt, perfekt for deg som bare vil ha det hyggelig.",
    steg2_tittel: "Gå på tur og finn en stolpe",
    steg2_tekst: "Bruk kartet under for å se hvor stolpene står.",
    steg3_tittel: "Skann QR-koden",
    steg3_tekst: "Da åpnes stedssiden med historien, bilder og kart.",
    steg4_tittel: "Samle poeng",
    steg4_tekst: "Nye steder gir poeng. Følg med på ledertavla!",
    kom_i_gang_knapp: "Kom i gang",

    // Bli med
    bli_med_tittel: "Bli med på jakten",
    bli_med_tekst: "Velg et kallenavn, så er du i gang. Du kan endre det når som helst.",

    // Kart
    kart_tittel: "Utforsk stolpene på kartet",
    kart_tekst: "Trykk på en markør for å lese mer om stedet.",
    tegnforklaring_ny: "Ikke besøkt ennå",
    tegnforklaring_funnet: "Besøkt",

    // Kode-skjema
    kode_tittel: "Fikk du ikke skannet QR-koden?",
    kode_tekst: "Skriv inn koden som står på stolpen, så tar vi deg til stedet.",
    kode_label: "Kode",
    kode_placeholder: "F.eks. VAFS-A7",
    kode_knapp: "Gå til stedet",

    // Ledertavle-lenke
    se_ledertavla: "Se ledertavla",

    // Profil / dynamisk tekst
    hei: "Hei",
    poeng: "poeng",
    // Pluralform brukt sammen med et tall (på norsk er begge former like;
    // ukrainsk skiller 1 / 2-4 / 5+).
    poeng_form: ["poeng", "poeng"],
    klar_for_tur: "Klar for tur! Finn en stolpe og skann QR-koden.",
    endre_kallenavn: "Endre kallenavn",
    profil_label: "Kallenavn",
    profil_placeholder: "F.eks. Turbo",
    profil_knapp: "Kom i gang",

    // Nyhetsbrev (vises kun når MAILERLITE_URL er satt)
    nyhetsbrev_tittel: "Vil du høre om nye stolper?",
    nyhetsbrev_tekst: "Meld deg på VAFS sitt nyhetsbrev for å få beskjed når vi setter ut nye stolper og arrangerer turer. Helt frivillig — du kan delta i jakten uten. En voksen melder på e-post på vegne av familien.",
    nyhetsbrev_knapp: "Meld meg på (åpnes hos MailerLite)",

    // Feilmeldinger
    feil_navn: "Velg et vennligere kallenavn 🙂",
    feil_kode: "Fant ingen stolpe med den koden. Sjekk at du har skrevet den riktig.",

    // Felles UI på tvers av sider
    tilbake_til_forside: "← Tilbake til kart og forside",

    // Stedssider — standardbokser
    om_stedet: "Om stedet",
    her_er_du: "Her er du",
    kilder_h3: "Kilder",
    bli_med_h3: "Slik blir du med på jakten",
    bli_med_p: "Finn stolpene rundt om i Vestre Aker, skann QR-koden og les historien om hvert sted. Velg et kallenavn – så samler du poeng for hvert nye sted du besøker. Ingen innlogging, ingen app.",
    se_kart_kom_i_gang: "Se kart og kom i gang",
    til_kartet: "Til kartet",
    til_ledertavla: "Til ledertavla",
    til_forsiden: "Til forsiden",

    // Ledertavle
    ledertavle_tittel: "Ledertavle",
    stillingen_tittel: "Stillingen",
    laster_ledertavla: "Laster ledertavla …",
    ledertavla_ingen_firebase_html: 'Ledertavla er ikke koblet til Firebase ennå. Lim inn Firebase-config i <code>assets/js/firebase-config.js</code> for å se resultater.',
    ledertavla_ingen_deltakere: "Ingen deltakere ennå. Bli den første!",
    ledertavla_skjult_navn: "(skjult navn)",
    ledertavla_kol_kallenavn: "Kallenavn",
    ledertavla_kol_poeng: "Poeng",

    // Registrering (registrering.js — dynamisk innhold på stedssider)
    reg_ukjent_sted: "Ukjent sted. Sjekk at id-en stemmer med steder.js.",
    reg_allerede_besokt_kort: "✓ Du har allerede besøkt dette stedet.",
    reg_lesemodus_html: 'Du leser om dette stedet. For å registrere besøket og få poeng må du <strong>skanne QR-koden på stolpen</strong> – eller taste inn koden fra stolpen på forsiden.',
    reg_vil_du_bli_med: "Vil du være med på jakten?",
    reg_velg_navn: "Velg et kallenavn for å registrere dette stedet og samle poeng. Du kan lese siden uansett.",
    reg_skjema_knapp: "Bli med og registrer",
    reg_nytt_tittel: "🎉 Nytt sted funnet!",
    // Token-substitusjon ({navn} og {poeng}) gjøres i registrering.js.
    reg_nytt_du_har_html: "Hei {navn} — du har nå <strong>{poeng}</strong> totalt.",
    reg_besokt_ingen_nye: "✓ Du har allerede besøkt dette stedet. Ingen nye poeng denne gangen.",
    reg_du_har_totalt_html: "Du har <strong>{poeng}</strong> totalt.",

    // Kart-popup
    kart_les_mer: "Les mer →",
    kart_allerede_besokt: "✓ Allerede besøkt",
  },

  uk: {
    // Header / footer
    topp_logo_alt: "Vestre Aker Frivilligsentral",
    topp_org: "Фундація Vestre Aker Frivilligsentral",
    topp_tittel: "Полювання за культурою та історією",
    bunn_org: "Фундація Vestre Aker Frivilligsentral",
    sprak_no_alt: "Норвезька",
    sprak_uk_alt: "Українська",

    // Hero
    hero_tittel: "Відкрийте історію поруч із вами",
    hero_tekst: "У Вестре-Акер багато історій. Вирушайте на прогулянку, знаходьте стовпчики й відкривайте свій район по-новому.",

    // Hvorfor
    hvorfor_tittel: "Навіщо полювати за культурою?",
    hvorfor_tekst: "Ми віримо, що історія нашого району заслуговує бути відкритою — пішки, разом і на свіжому повітрі. Полювання за культурою — це безкоштовна прогулянка та історичний досвід для всіх мешканців Вестре-Акер: корисно для ніг, серця й допитливості.",

    // Hva — formene under brukes med slavisk pluraliseringsregel
    // (1 → місце/чекає, 2–4 → місця/чекають, 5+ → місць/чекають). Verbet
    // skifter mellom 1 (entall) og resten (flertall).
    hva_tittel: "Що ми створили",
    hva_tekst_pre: "У районі ми встановили стовпчики на місцях, важливих для місцевої історії. На кожному стовпчику є QR-код, який веде на сторінку з історією місця, фотографіями та картою. Без застосунку, без реєстрації — лише прізвисько. ",
    hva_steder_navn: ["місце", "місця", "місць"],
    hva_tekst_post: [" чекає на відкриття.", " чекають на відкриття.", " чекають на відкриття."],

    // Hvordan
    hvordan_tittel: "Як це працює",
    steg1_tittel: "Оберіть прізвисько",
    steg1_tekst: "Просто — без реєстрації. Усе повністю анонімно, ідеально, якщо ви просто хочете розважитися.",
    steg2_tittel: "Вирушайте на прогулянку та знайдіть стовпчик",
    steg2_tekst: "Скористайтеся картою нижче, щоб побачити, де стоять стовпчики.",
    steg3_tittel: "Відскануйте QR-код",
    steg3_tekst: "Відкриється сторінка з історією, фотографіями та картою місця.",
    steg4_tittel: "Збирайте бали",
    steg4_tekst: "За нові місця нараховуються бали. Стежте за таблицею лідерів!",
    kom_i_gang_knapp: "Розпочати",

    // Bli med
    bli_med_tittel: "Приєднайтеся до полювання",
    bli_med_tekst: "Оберіть прізвисько — і ви в грі. Його можна змінити будь-коли.",

    // Kart
    kart_tittel: "Стовпчики на карті",
    kart_tekst: "Натисніть на маркер, щоб дізнатися більше про місце.",
    tegnforklaring_ny: "Ще не відвідано",
    tegnforklaring_funnet: "Відвідано",

    // Kode-skjema
    kode_tittel: "Не вдалося відсканувати QR-код?",
    kode_tekst: "Введіть код зі стовпчика, і ми перенесемо вас на сторінку місця.",
    kode_label: "Код",
    kode_placeholder: "Наприклад, VAFS-A7",
    kode_knapp: "Перейти до місця",

    // Ledertavle-lenke
    se_ledertavla: "Таблиця лідерів",

    // Profil / dynamisk tekst
    hei: "Привіт",
    poeng: "балів",
    // 1 → бал, 2-4 → бали, 5+ → балів (slavisk pluralisering — se pluralKategori).
    poeng_form: ["бал", "бали", "балів"],
    klar_for_tur: "Готові вирушати! Знайдіть стовпчик і відскануйте QR-код.",
    endre_kallenavn: "Змінити прізвисько",
    profil_label: "Прізвисько",
    profil_placeholder: "Наприклад, Турбо",
    profil_knapp: "Розпочати",

    // Nyhetsbrev
    nyhetsbrev_tittel: "Хочете дізнаватися про нові стовпчики?",
    nyhetsbrev_tekst: "Підпишіться на розсилку VAFS, щоб отримувати повідомлення про нові стовпчики та прогулянки. Це повністю добровільно — у полюванні можна брати участь і без підписки. Для дітей дорослий вписує електронну адресу від імені родини.",
    nyhetsbrev_knapp: "Підписатися (на сайті MailerLite)",

    // Feilmeldinger
    feil_navn: "Оберіть, будь ласка, доброзичливіше прізвисько 🙂",
    feil_kode: "Стовпчика з таким кодом не знайдено. Перевірте, чи правильно ви ввели його.",

    // Felles UI på tvers av sider
    tilbake_til_forside: "← Назад до карти й головної",

    // Stedssider — standardbokser
    om_stedet: "Про місце",
    her_er_du: "Ви тут",
    kilder_h3: "Джерела",
    bli_med_h3: "Як долучитися до полювання",
    bli_med_p: "Знаходьте стовпчики у Вестре-Акер, скануйте QR-код і читайте історію кожного місця. Оберіть прізвисько — і збирайте бали за кожне нове відвідане місце. Без реєстрації, без застосунку.",
    se_kart_kom_i_gang: "До карти та початку",
    til_kartet: "До карти",
    til_ledertavla: "До таблиці лідерів",
    til_forsiden: "На головну",

    // Ledertavle
    ledertavle_tittel: "Таблиця лідерів",
    stillingen_tittel: "Поточний результат",
    laster_ledertavla: "Завантажуємо таблицю лідерів…",
    ledertavla_ingen_firebase_html: 'Таблицю лідерів ще не підключено до Firebase. Вставте конфігурацію Firebase у <code>assets/js/firebase-config.js</code>, щоб побачити результати.',
    ledertavla_ingen_deltakere: "Учасників ще немає. Станьте першим!",
    ledertavla_skjult_navn: "(прізвисько приховано)",
    ledertavla_kol_kallenavn: "Прізвисько",
    ledertavla_kol_poeng: "Бали",

    // Registrering
    reg_ukjent_sted: "Невідоме місце. Перевірте, чи відповідає id у steder.js.",
    reg_allerede_besokt_kort: "✓ Ви вже відвідали це місце.",
    reg_lesemodus_html: 'Ви читаєте про це місце. Щоб зареєструвати відвідування й отримати бали, потрібно <strong>відсканувати QR-код на стовпчику</strong> — або ввести код зі стовпчика на головній сторінці.',
    reg_vil_du_bli_med: "Хочете долучитися до полювання?",
    reg_velg_navn: "Оберіть прізвисько, щоб зареєструвати це місце та збирати бали. Сторінку можна читати в будь-якому разі.",
    reg_skjema_knapp: "Долучитися та зареєструвати",
    reg_nytt_tittel: "🎉 Знайдено нове місце!",
    reg_nytt_du_har_html: "Привіт {navn} — тепер у вас <strong>{poeng}</strong> загалом.",
    reg_besokt_ingen_nye: "✓ Ви вже відвідали це місце. Цього разу нових балів не буде.",
    reg_du_har_totalt_html: "У вас <strong>{poeng}</strong> загалом.",

    // Kart-popup
    kart_les_mer: "Дізнатися більше →",
    kart_allerede_besokt: "✓ Уже відвідано",
  },
};

export function gjeldendeSprak() {
  try {
    const lagret = localStorage.getItem(LAGRINGSNOKKEL);
    if (lagret && STOTTEDE.includes(lagret)) return lagret;
  } catch (_) { /* localStorage utilgjengelig */ }
  return STANDARD;
}

export function settSprak(kode) {
  if (!STOTTEDE.includes(kode)) return;
  try { localStorage.setItem(LAGRINGSNOKKEL, kode); } catch (_) {}
  document.documentElement.lang = kode;
  bruk();
  oppdaterFlaggMarkering();
  document.dispatchEvent(new CustomEvent("sprakbytte", { detail: { kode } }));
}

export function t(nokkel) {
  const sprak = gjeldendeSprak();
  const ord = OVERSETTELSER[sprak] || OVERSETTELSER[STANDARD];
  return ord[nokkel] ?? OVERSETTELSER[STANDARD][nokkel] ?? nokkel;
}

// Velg riktig pluralform for et tall.
//   nb: 1 → indeks 0 (entall), ellers indeks 1 (flertall).
//   uk: slavisk regel — 1 → 0, 2–4 → 1, 5+ → 2 (med spesialregel for 11–14).
export function pluralKategori(n, sprak = gjeldendeSprak()) {
  if (sprak === "uk") {
    const m10 = ((n % 10) + 10) % 10;
    const m100 = ((n % 100) + 100) % 100;
    if (m10 === 1 && m100 !== 11) return 0;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 1;
    return 2;
  }
  return n === 1 ? 0 : 1;
}

// Slå opp en nøkkel der verdien er en liste av pluralformer, og returner den
// formen som passer tallet. Fallback til siste form hvis listen er kortere
// enn pluralkategorien tilsier (gjør den trygg ved manglende oversettelser).
export function plural(nokkel, n) {
  const sprak = gjeldendeSprak();
  const ord = OVERSETTELSER[sprak] || OVERSETTELSER[STANDARD];
  const arr = ord[nokkel] ?? OVERSETTELSER[STANDARD][nokkel];
  if (!Array.isArray(arr)) return arr ?? "";
  const idx = pluralKategori(n, sprak);
  return arr[idx] ?? arr[arr.length - 1];
}

export function bruk(rot = document) {
  const sprak = gjeldendeSprak();
  const ord = OVERSETTELSER[sprak] || OVERSETTELSER[STANDARD];

  rot.querySelectorAll("[data-i18n]").forEach((el) => {
    const n = el.getAttribute("data-i18n");
    const v = ord[n] ?? OVERSETTELSER[STANDARD][n];
    if (v != null) el.textContent = v;
  });

  rot.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const n = el.getAttribute("data-i18n-html");
    const v = ord[n] ?? OVERSETTELSER[STANDARD][n];
    if (v != null) el.innerHTML = v;
  });

  // Format: "attribute:nokkel; attribute2:nokkel2"
  rot.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    const spec = el.getAttribute("data-i18n-attr");
    spec.split(";").forEach((par) => {
      const [attr, n] = par.split(":").map((s) => s && s.trim());
      if (!attr || !n) return;
      const v = ord[n] ?? OVERSETTELSER[STANDARD][n];
      if (v != null) el.setAttribute(attr, v);
    });
  });
}

function oppdaterFlaggMarkering() {
  const sprak = gjeldendeSprak();
  document.querySelectorAll(".sprakvelger [data-sprak]").forEach((b) => {
    b.classList.toggle("aktiv", b.getAttribute("data-sprak") === sprak);
    b.setAttribute("aria-pressed", b.getAttribute("data-sprak") === sprak ? "true" : "false");
  });
}

// Sett lang umiddelbart så skjermlesere får riktig språk fra start.
document.documentElement.lang = gjeldendeSprak();

// Kjør oversettelse + markering når DOM er klar.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => { bruk(); oppdaterFlaggMarkering(); });
} else {
  bruk();
  oppdaterFlaggMarkering();
}
