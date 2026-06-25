// i18n.js — lett oversettingslag for Kulturjakten (vanilla JS, ingen avhengigheter).
//
// Konvensjon (viktig — ikke bland):
//   • SPRÅKKODE (ISO 639-1) i nøkler/lagring: "nb" = norsk, "uk" = ukrainsk.
//   • LANDSKODE (ISO 3166-1) brukes KUN i flagg-filnavn: "no", "ua", "gb", "it".
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
const STOTTEDE = ["nb", "uk", "en", "it"];

export const OVERSETTELSER = {
  nb: {
    // Header / footer
    topp_logo_alt: "Vestre Aker Frivilligsentral",
    topp_org: "Stiftelsen Vestre Aker Frivilligsentral",
    topp_tittel: "Kulturjakten",
    bunn_org: "Stiftelsen Vestre Aker Frivilligsentral",
    sprak_no_alt: "Norsk",
    sprak_uk_alt: "Ukrainsk",
    sprak_en_alt: "Engelsk",
    sprak_it_alt: "Italiensk",

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
    topp_tittel: "Kulturjakten — полювання за культурою",
    bunn_org: "Фундація Vestre Aker Frivilligsentral",
    sprak_no_alt: "Норвезька",
    sprak_uk_alt: "Українська",
    sprak_en_alt: "Англійська",
    sprak_it_alt: "Італійська",

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

  en: {
    // Header / footer
    topp_logo_alt: "Vestre Aker Frivilligsentral",
    topp_org: "Vestre Aker Frivilligsentral Foundation",
    topp_tittel: "Heritage Hunt",
    bunn_org: "Vestre Aker Frivilligsentral Foundation",
    sprak_no_alt: "Norwegian",
    sprak_uk_alt: "Ukrainian",
    sprak_en_alt: "English",
    sprak_it_alt: "Italian",

    // Hero
    hero_tittel: "Discover the history right around the corner",
    hero_tekst: "Vestre Aker is full of stories. Go for a walk, find the heritage sites and get to know your neighbourhood in a whole new way.",

    // Hvorfor
    hvorfor_tittel: "Why a Heritage Hunt?",
    hvorfor_tekst: "We believe the history of our local area deserves to be discovered – on foot, together and out in the fresh air. The Heritage Hunt is a free walking and history experience for all of Vestre Aker: good for the legs, the heart and your curiosity.",

    // Hva — paragrafen bygges av forsiden i tre deler (pre + tellbart substantiv + post).
    // Engelsk: 1 → entall (place / is), ellers flertall (places / are).
    hva_tittel: "What we've made",
    hva_tekst_pre: "Around the area we've marked sites of local historical interest. Each site has a QR code that takes you to a page with the story of the place, photos and a map. No app, no sign-up – just a nickname. ",
    hva_steder_navn: ["site", "sites"],
    hva_tekst_post: [" is waiting to be discovered.", " are waiting to be discovered."],

    // Hvordan
    hvordan_tittel: "How it works",
    steg1_tittel: "Choose a nickname",
    steg1_tekst: "Dead simple – no sign-up. Everything is completely anonymous, perfect if you just want to have a nice time.",
    steg2_tittel: "Go for a walk and find a heritage site",
    steg2_tekst: "Use the map below to see where the sites are.",
    steg3_tittel: "Scan the QR code",
    steg3_tekst: "That opens the place page with the story, photos and a map.",
    steg4_tittel: "Collect points",
    steg4_tekst: "New places earn points. Keep an eye on the leaderboard!",
    kom_i_gang_knapp: "Get started",

    // Bli med
    bli_med_tittel: "Join the hunt",
    bli_med_tekst: "Choose a nickname and you're off. You can change it any time.",

    // Kart
    kart_tittel: "Explore the heritage sites on the map",
    kart_tekst: "Tap a marker to read more about the place.",
    tegnforklaring_ny: "Not visited yet",
    tegnforklaring_funnet: "Visited",

    // Kode-skjema
    kode_tittel: "Couldn't scan the QR code?",
    kode_tekst: "Enter the code shown at the site and we'll take you to the place.",
    kode_label: "Code",
    kode_placeholder: "E.g. VAFS-A7",
    kode_knapp: "Go to the place",

    // Ledertavle-lenke
    se_ledertavla: "See the leaderboard",

    // Profil / dynamisk tekst
    hei: "Hi",
    poeng: "points",
    // 1 → point, ellers points.
    poeng_form: ["point", "points"],
    klar_for_tur: "Ready to go! Find a heritage site and scan the QR code.",
    endre_kallenavn: "Change nickname",
    profil_label: "Nickname",
    profil_placeholder: "E.g. Turbo",
    profil_knapp: "Get started",

    // Nyhetsbrev
    nyhetsbrev_tittel: "Want to hear about new sites?",
    nyhetsbrev_tekst: "Sign up for the VAFS newsletter to be notified when we add new heritage sites and arrange walks. Completely optional — you can take part in the hunt without it. For children, an adult signs up by email on behalf of the family.",
    nyhetsbrev_knapp: "Sign me up (opens at MailerLite)",

    // Feilmeldinger
    feil_navn: "Please choose a friendlier nickname 🙂",
    feil_kode: "No site found with that code. Check that you've typed it correctly.",

    // Felles UI på tvers av sider
    tilbake_til_forside: "← Back to the map and home",

    // Stedssider — standardbokser
    om_stedet: "About the place",
    her_er_du: "You are here",
    kilder_h3: "Sources",
    bli_med_h3: "How to join the hunt",
    bli_med_p: "Find the heritage sites around Vestre Aker, scan the QR code and read the story of each place. Choose a nickname – then collect points for every new site you visit. No sign-up, no app.",
    se_kart_kom_i_gang: "See the map and get started",
    til_kartet: "To the map",
    til_ledertavla: "To the leaderboard",
    til_forsiden: "To the home page",

    // Ledertavle
    ledertavle_tittel: "Leaderboard",
    stillingen_tittel: "Standings",
    laster_ledertavla: "Loading the leaderboard…",
    ledertavla_ingen_firebase_html: 'The leaderboard isn\'t connected to Firebase yet. Paste your Firebase config into <code>assets/js/firebase-config.js</code> to see results.',
    ledertavla_ingen_deltakere: "No participants yet. Be the first!",
    ledertavla_skjult_navn: "(hidden name)",
    ledertavla_kol_kallenavn: "Nickname",
    ledertavla_kol_poeng: "Points",

    // Registrering
    reg_ukjent_sted: "Unknown place. Check that the id matches steder.js.",
    reg_allerede_besokt_kort: "✓ You've already visited this place.",
    reg_lesemodus_html: 'You\'re reading about this place. To register your visit and earn points, you need to <strong>scan the QR code at the heritage site</strong> – or enter the code from the site on the home page.',
    reg_vil_du_bli_med: "Want to join the hunt?",
    reg_velg_navn: "Choose a nickname to register this place and collect points. You can read the page either way.",
    reg_skjema_knapp: "Join and register",
    reg_nytt_tittel: "🎉 New place found!",
    reg_nytt_du_har_html: "Hi {navn} — you now have <strong>{poeng}</strong> in total.",
    reg_besokt_ingen_nye: "✓ You've already visited this place. No new points this time.",
    reg_du_har_totalt_html: "You have <strong>{poeng}</strong> in total.",

    // Kart-popup
    kart_les_mer: "Read more →",
    kart_allerede_besokt: "✓ Already visited",
  },

  it: {
    // Header / footer
    topp_logo_alt: "Vestre Aker Frivilligsentral",
    topp_org: "Fondazione Vestre Aker Frivilligsentral",
    topp_tittel: "Alla scoperta della cultura locale",
    bunn_org: "Fondazione Vestre Aker Frivilligsentral",
    sprak_no_alt: "Norvegese",
    sprak_uk_alt: "Ucraino",
    sprak_en_alt: "Inglese",
    sprak_it_alt: "Italiano",

    // Hero
    hero_tittel: "Scopri la storia dietro l'angolo",
    hero_tekst: "Vestre Aker è piena di storie. Fai una passeggiata, scopri i siti culturali e conosci il quartiere in un modo tutto nuovo.",

    // Hvorfor
    hvorfor_tittel: "Perché questo percorso?",
    hvorfor_tekst: "Crediamo che la storia locale meriti di essere scoperta: a piedi, insieme e all'aria aperta. Questo percorso è un'esperienza gratuita che unisce passeggiate e storia in tutta Vestre Aker: fa bene alle gambe, al cuore e alla curiosità.",

    // Hva
    hva_tittel: "Che cosa abbiamo creato",
    hva_tekst_pre: "In diversi punti del quartiere abbiamo individuato siti di interesse storico locale. In ciascun sito troverai un codice QR che ti porterà a una pagina con la storia del luogo, fotografie e una mappa. Nessuna app, nessuna registrazione: basta scegliere un soprannome. ",
    hva_steder_navn: ["sito culturale", "siti culturali"],
    hva_tekst_post: [" aspetta di essere scoperto.", " aspettano di essere scoperti."],

    // Hvordan
    hvordan_tittel: "Come funziona",
    steg1_tittel: "Scegli un soprannome",
    steg1_tekst: "Semplicissimo: nessuna registrazione. Tutto è completamente anonimo, perfetto se vuoi semplicemente goderti l'esperienza.",
    steg2_tittel: "Visita un sito culturale",
    steg2_tekst: "Usa la mappa qui sotto per vedere dove si trovano i siti culturali.",
    steg3_tittel: "Scansiona il codice QR",
    steg3_tekst: "Si aprirà una pagina con la storia del luogo, fotografie e una mappa.",
    steg4_tittel: "Raccogli punti",
    steg4_tekst: "Ogni nuovo sito culturale visitato ti fa guadagnare punti. Tieni d'occhio la classifica!",
    kom_i_gang_knapp: "Inizia",

    // Bli med
    bli_med_tittel: "Inizia il percorso",
    bli_med_tekst: "Scegli un soprannome e sei pronto. Potrai cambiarlo quando vuoi.",

    // Kart
    kart_tittel: "Esplora i siti culturali sulla mappa",
    kart_tekst: "Tocca un indicatore per leggere di più sul luogo.",
    tegnforklaring_ny: "Non ancora visitato",
    tegnforklaring_funnet: "Visitato",

    // Kode-skjema
    kode_tittel: "Non riesci a scansionare il codice QR?",
    kode_tekst: "Inserisci il codice riportato accanto al QR code e ti porteremo direttamente alla pagina del sito culturale.",
    kode_label: "Codice",
    kode_placeholder: "Ad es. VAFS-A7",
    kode_knapp: "Vai al luogo",

    // Ledertavle-lenke
    se_ledertavla: "Vedi la classifica",

    // Profil / dynamisk tekst
    hei: "Ciao",
    poeng: "punti",
    poeng_form: ["punto", "punti"],
    klar_for_tur: "Pronto per partire! Trova un sito culturale e scansiona il codice QR.",
    endre_kallenavn: "Cambia soprannome",
    profil_label: "Soprannome",
    profil_placeholder: "Ad es. Turbo",
    profil_knapp: "Inizia",

    // Nyhetsbrev
    nyhetsbrev_tittel: "Vuoi sapere quando arrivano nuovi siti culturali?",
    nyhetsbrev_tekst: "Iscriviti alla newsletter di VAFS per ricevere notizie quando aggiungiamo nuovi siti culturali e organizziamo passeggiate. È del tutto facoltativo: puoi partecipare anche senza. Per i bambini, un adulto iscrive l'indirizzo e-mail per conto della famiglia.",
    nyhetsbrev_knapp: "Iscrivimi (si apre su MailerLite)",

    // Feilmeldinger
    feil_navn: "Scegli un soprannome più gentile 🙂",
    feil_kode: "Non abbiamo trovato nessun sito con quel codice. Controlla di averlo scritto correttamente.",

    // Felles UI på tvers av sider
    tilbake_til_forside: "← Torna alla mappa e alla pagina iniziale",

    // Stedssider — standardbokser
    om_stedet: "Il luogo",
    her_er_du: "Sei qui",
    kilder_h3: "Fonti",
    bli_med_h3: "Come partecipare al percorso",
    bli_med_p: "Trova i siti culturali in giro per Vestre Aker, scansiona il codice QR e leggi la storia di ogni luogo. Scegli un soprannome: raccoglierai punti per ogni nuovo sito visitato. Nessuna registrazione, nessuna app.",
    se_kart_kom_i_gang: "Vedi la mappa e inizia",
    til_kartet: "Alla mappa",
    til_ledertavla: "Alla classifica",
    til_forsiden: "Alla pagina iniziale",

    // Ledertavle
    ledertavle_tittel: "Classifica",
    stillingen_tittel: "Risultati",
    laster_ledertavla: "Caricamento della classifica…",
    ledertavla_ingen_firebase_html: 'La classifica non è ancora collegata a Firebase. Incolla la configurazione Firebase in <code>assets/js/firebase-config.js</code> per vedere i risultati.',
    ledertavla_ingen_deltakere: "Non ci sono ancora partecipanti. Sii il primo!",
    ledertavla_skjult_navn: "(nome nascosto)",
    ledertavla_kol_kallenavn: "Soprannome",
    ledertavla_kol_poeng: "Punti",

    // Registrering
    reg_ukjent_sted: "Luogo sconosciuto. Controlla che l'id corrisponda a steder.js.",
    reg_allerede_besokt_kort: "✓ Hai già visitato questo luogo.",
    reg_lesemodus_html: 'Stai leggendo la pagina di questo luogo. Per registrare la visita e ottenere punti devi <strong>scansionare il codice QR del sito di interesse storico</strong>, oppure inserire il codice del sito di interesse storico nella pagina iniziale.',
    reg_vil_du_bli_med: "Vuoi partecipare al percorso?",
    reg_velg_navn: "Scegli un soprannome per registrare questo luogo e raccogliere punti. Puoi leggere la pagina in ogni caso.",
    reg_skjema_knapp: "Partecipa e registra",
    reg_nytt_tittel: "🎉 Nuovo luogo trovato!",
    reg_nytt_du_har_html: "Ciao {navn}: ora hai <strong>{poeng}</strong> in totale.",
    reg_besokt_ingen_nye: "✓ Hai già visitato questo luogo. Nessun nuovo punto questa volta.",
    reg_du_har_totalt_html: "Hai <strong>{poeng}</strong> in totale.",

    // Kart-popup
    kart_les_mer: "Leggi di più →",
    kart_allerede_besokt: "✓ Già visitato",
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

  brodtekstFallback(rot);
}

// Brødtekst-fallback for stedssider. Den narrative teksten ligger som søsken-
// blokker (<div data-sprak="nb|uk|en|it">) i .sted-historie, og CSS skjuler dem som
// ikke matcher <html lang>. Er en stedsside ennå ikke oversatt til det valgte
// språket, ville ALT blitt skjult — derfor viser vi norsk som reserve så siden
// aldri blir blank. Vi overstyrer kun i fallback-tilfellet; ellers lar vi CSS
// styre (ingen flimring på sider som faktisk er oversatt).
function brodtekstFallback(rot = document) {
  const sprak = gjeldendeSprak();
  rot.querySelectorAll(".sted-historie").forEach((sek) => {
    const blokker = sek.querySelectorAll(":scope > [data-sprak]");
    if (!blokker.length) return;
    const harAktiv = [...blokker].some((b) => b.getAttribute("data-sprak") === sprak);
    blokker.forEach((b) => {
      if (!harAktiv && b.getAttribute("data-sprak") === STANDARD) {
        b.style.display = "block";       // vis norsk som reserve
      } else {
        b.style.removeProperty("display"); // la CSS bestemme
      }
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
