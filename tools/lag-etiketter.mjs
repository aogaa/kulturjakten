// lag-etiketter.mjs — genererer trykkeklare stolpe-etiketter med QR-koder.
//
// Kjør:  npm run etiketter
//
// Leser STEDER fra ../assets/js/steder.js (fasit) og lager, for hvert AKTIVT sted:
//   qr/<id>.png, qr/<id>.svg              — rå QR-kode (frittstående)
//   qr/etiketter/<id>.pdf                 — én omslagsstripe (4 sider side ved side)
// I tillegg:
//   qr/etiketter/_alle-stolper.pdf        — samle-PDF, én stripe per side
//
// Stolpen er firkantet med 98 mm sider → omkrets 4 × 98 = 392 mm. Stripa har de fire
// sidene ved siden av hverandre (QR · info · QR · info) + 8 mm limflik = 400 × 150 mm
// ferdig format, og trekkes/limes rundt stolpen. I tillegg 3 mm utfallende kant (bleed)
// og skjæremerker → 406 × 156 mm fysisk ark (krav fra trykkeriet).
//
// QR-koden peker ALLTID til  <BASE>/steder/<id>.html?k=<KODE>  (krav fra CLAUDE.md §0/§5:
// uten ?k=<KODE> gir et skann null poeng).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import { STEDER } from "../assets/js/steder.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ── Innstillinger ────────────────────────────────────────────────────────────
const BASE = "https://kulturjakten.frivilligsentralen.org";
const GRØNN = "#2f5d3a"; // --farge-skog
const SVART = "#1a1d17";
const LOGO = path.join(ROOT, "assets/img/ui/vafs-logo.png");

const MM = 2.834645669; // mm → pt

// Panel = én side av stolpen. Alle tegnefunksjoner jobber panel-lokalt (origo øverst-
// venstre i panelet), så de kan flyttes (translate) ut langs stripa.
const PW = 98 * MM; // panelbredde (én stolpeside)
const PH = 150 * MM; // panelhøyde
const PCX = PW / 2; // panelets horisontale midte
const FLAP = 8 * MM; // limflik på enden (gjentar starten av side 1)

const MED_BLEED = true; // false → rent 400 × 150 mm uten bleed/skjæremerker
const BLEED = MED_BLEED ? 3 * MM : 0;
const TRIM_W = 4 * PW + FLAP; // 400 mm ferdig bredde
const TRIM_H = PH; // 150 mm ferdig høyde
const PAGE_W = TRIM_W + 2 * BLEED; // 406 mm med bleed
const PAGE_H = TRIM_H + 2 * BLEED; // 156 mm med bleed
const OX = BLEED; // trim-boksens venstre kant
const OY = BLEED; // trim-boksens øvre kant

const HEADER_H = 26 * MM; // headerbåndets høyde
const BADGE_R = 12 * MM; // hvit logo-badge radius

// ── QR-mål ──────────────────────────────────────────────────────────────────
function qrUrl(sted) {
  return `${BASE}/steder/${sted.id}.html?k=${sted.kode}`;
}

// ── Tegnehjelpere (panel-lokale) ──────────────────────────────────────────────
function fitFontSize(doc, text, font, maxWidth, start, min = 6) {
  doc.font(font);
  let size = start;
  while (size > min) {
    doc.fontSize(size);
    if (doc.widthOfString(text) <= maxWidth) break;
    size -= 0.5;
  }
  return size;
}

function centerText(doc, text, font, size, y, color = SVART) {
  doc.font(font).fontSize(size).fillColor(color);
  doc.text(text, 0, y, { width: PW, align: "center" });
}

// Felles topp: grønt headerbånd (fyller hele panelbredden) + hvit logo-badge over kanten.
function drawHeader(doc) {
  doc.save();
  doc.rect(0, 0, PW, HEADER_H).fill(GRØNN);
  // Tittel – festet øverst i båndet, så logo-badgen under aldri dekker teksten
  const titleSize = fitFontSize(doc, "KULTURJAKTEN", "Helvetica-Bold", PW - 8 * MM, 30);
  doc.font("Helvetica-Bold").fontSize(titleSize).fillColor("#ffffff");
  doc.text("KULTURJAKTEN", 0, 4 * MM, { width: PW, align: "center" });
  // Hvit badge over headerkanten
  doc.circle(PCX, HEADER_H, BADGE_R).fillColor("#ffffff").fill();
  // Logo sentrert i badgen
  const logoW = BADGE_R * 1.55;
  try {
    doc.image(LOGO, PCX - logoW / 2, HEADER_H - logoW * 0.36, { width: logoW });
  } catch {
    /* logo mangler – hopp over */
  }
  doc.restore();
}

// QR-side: «Skan QR koden» + skarp vektor-QR + stolpekoden.
function drawQrSide(doc, sted) {
  drawHeader(doc);
  const top = HEADER_H + BADGE_R + 6 * MM;

  centerText(doc, "Skan QR koden", "Helvetica-Bold", 24, top);

  // QR som vektor (skarpt trykk uavhengig av oppløsning)
  const qr = QRCode.create(qrUrl(sted), { errorCorrectionLevel: "M" });
  const count = qr.modules.size;
  const quiet = 4;
  const totalModules = count + quiet * 2;
  const qrBox = 56 * MM;
  const module = qrBox / totalModules;
  const qx = PCX - qrBox / 2;
  const qy = top + 16 * MM;

  doc.save();
  doc.rect(qx, qy, qrBox, qrBox).fill("#ffffff"); // hvit bakgrunn inkl. quiet zone
  doc.fillColor("#000000");
  const data = qr.modules.data;
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (data[r * count + c]) {
        const x = qx + (c + quiet) * module;
        const y = qy + (r + quiet) * module;
        doc.rect(x, y, module + 0.3, module + 0.3); // +0.3 unngår hårfine hvite streker
      }
    }
  }
  doc.fill();
  doc.restore();

  // Stolpekoden under
  centerText(doc, sted.kode, "Helvetica-Bold", 30, qy + qrBox + 8 * MM);
}

// Info-side: forklaring + URL + 1-2-3-liste (lik for alle stolper).
function drawInfoSide(doc) {
  drawHeader(doc);
  const startY = HEADER_H + BADGE_R + 6 * MM;
  const innerX = 8 * MM;
  const innerW = PW - 16 * MM;

  doc.fillColor(SVART);

  doc.font("Helvetica-Bold").fontSize(13);
  doc.text("Rundt omkring i Vestre Aker har vi satt ut stolper på steder med lokalhistorisk verdi.", innerX, startY, { width: innerW, align: "center" });

  doc.moveDown(0.6);
  doc.text("Hver stolpe har en QR-kode som tar deg til en side med historien om stedet.", { width: innerW, align: "center" });

  doc.moveDown(0.6);
  doc.font("Helvetica").fontSize(12);
  doc.text("Du trenger ingen app,\nog det er ingen registrering.", { width: innerW, align: "center" });

  doc.moveDown(0.6);
  const urlSize = fitFontSize(doc, "kulturjakten.frivilligsentralen.org", "Helvetica-Bold", innerW, 13);
  doc.font("Helvetica-Bold").fontSize(urlSize).fillColor(GRØNN);
  doc.text("kulturjakten.frivilligsentralen.org", innerX, doc.y, { width: innerW, align: "center" });

  // Nummerert liste, nær bunnen
  const steps = ["Gå til nettsiden", "Lag et kallenavn", "Finn stolpene"];
  const lineH = 12 * MM;
  let ly = PH - 8 * MM - steps.length * lineH;
  const numX = 14 * MM;
  const txtX = numX + 12 * MM;
  doc.fillColor(SVART);
  steps.forEach((s, i) => {
    doc.font("Helvetica").fontSize(24).text(`${i + 1}.`, numX, ly, { lineBreak: false });
    doc.font("Helvetica-Bold").fontSize(24).text(s, txtX, ly, { lineBreak: false });
    ly += lineH;
  });
}

// Skjæremerker i de fire ytre hjørnene av trim-boksen.
function drawCropMarks(doc) {
  if (!MED_BLEED) return;
  const L = 3 * MM; // merkelengde
  const g = 1.2 * MM; // luft mellom trim og merke
  doc.save().lineWidth(0.4).strokeColor("#000000");
  const corners = [
    [OX, OY, -1, -1],
    [OX + TRIM_W, OY, 1, -1],
    [OX, OY + TRIM_H, -1, 1],
    [OX + TRIM_W, OY + TRIM_H, 1, 1],
  ];
  for (const [x, y, sx, sy] of corners) {
    doc.moveTo(x + sx * g, y).lineTo(x + sx * (g + L), y).stroke(); // horisontal
    doc.moveTo(x, y + sy * g).lineTo(x, y + sy * (g + L)).stroke(); // vertikal
  }
  doc.restore();
}

// Tegn ett panel ved x-forskyvning `panelX` (i trim-koordinater), klippet til `clipW`.
function drawPanel(doc, draw, sted, panelX, clipW) {
  doc.save();
  if (clipW) doc.rect(OX + panelX, OY, clipW, PH).clip();
  doc.translate(OX + panelX, OY);
  draw(doc, sted);
  doc.restore();
}

// Tegn hele omslagsstripa for én stolpe (forutsetter at en side allerede er lagt til).
function drawStripe(doc, sted) {
  // Bakgrunn som dekker bleed-sonen: hvit hele arket + sammenhengende grønt bånd på tvers
  // (dratt ut i topp- og side-bleed) så grafikken går helt ut til skjærekanten.
  doc.save();
  doc.rect(0, 0, PAGE_W, PAGE_H).fill("#ffffff");
  doc.rect(0, 0, PAGE_W, OY + HEADER_H).fill(GRØNN);
  doc.restore();

  const sides = [drawQrSide, drawInfoSide, drawQrSide, drawInfoSide];
  sides.forEach((draw, i) => drawPanel(doc, draw, sted, i * PW));
  // Limfliken (de siste 8 mm + bleed) holdes blank: bakgrunnen over dekker den allerede
  // med sammenhengende grønt bånd + hvit bunn, så skjøten blir ren når stripa limes.

  drawCropMarks(doc);
}

// ── Hovedløp ──────────────────────────────────────────────────────────────────
async function main() {
  const qrDir = path.join(ROOT, "qr");
  const etikettDir = path.join(qrDir, "etiketter");
  fs.mkdirSync(etikettDir, { recursive: true });

  const aktive = STEDER; // steder.js eksporterer kun aktive (avpubliserte er kommentert ut)

  // Samle-PDF (én stripe per side)
  const alle = new PDFDocument({ size: [PAGE_W, PAGE_H], margin: 0, autoFirstPage: true });
  alle.pipe(fs.createWriteStream(path.join(etikettDir, "_alle-stolper.pdf")));

  let førsteSamle = true;
  for (const sted of aktive) {
    const url = qrUrl(sted);

    // Rå QR-koder
    await QRCode.toFile(path.join(qrDir, `${sted.id}.png`), url, { errorCorrectionLevel: "M", margin: 4, width: 1024 });
    const svg = await QRCode.toString(url, { type: "svg", errorCorrectionLevel: "M", margin: 4 });
    fs.writeFileSync(path.join(qrDir, `${sted.id}.svg`), svg);

    // Per-stolpe stripe
    const doc = new PDFDocument({ size: [PAGE_W, PAGE_H], margin: 0, autoFirstPage: true });
    doc.pipe(fs.createWriteStream(path.join(etikettDir, `${sted.id}.pdf`)));
    drawStripe(doc, sted);
    doc.end();

    // Samme stripe inn i samle-PDF (ny side per stolpe)
    if (!førsteSamle) alle.addPage({ size: [PAGE_W, PAGE_H], margin: 0 });
    drawStripe(alle, sted);
    førsteSamle = false;

    console.log(`✓ ${sted.kode}  ${sted.navn}  →  ${url}`);
  }

  alle.end();
  console.log(`\nFerdig: ${aktive.length} stolper (stripe 400 × 150 mm). Filer i qr/ og qr/etiketter/.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
