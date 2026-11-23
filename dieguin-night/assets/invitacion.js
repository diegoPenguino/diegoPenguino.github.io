// Invitation card for one guest (?i=<code>): their name, how many the pass admits, and a
// QR code that opens their RSVP page. "Descargar imagen" saves it as a 1080x1920 PNG to
// send by WhatsApp. Uses qrcode-generator and html2canvas (loaded as globals).

import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { db, CODE_RE, inviteLink } from "./firebase.js";

const $ = (id) => document.getElementById(id);
const code = new URLSearchParams(location.search).get("i") || "";
const SVG_NS = "http://www.w3.org/2000/svg";

let guestName = "";

// Scale the 540x960 poster to the width of its frame.
function fit() {
  $("frame").style.setProperty("--s", String($("frame").clientWidth / 540));
}
new ResizeObserver(fit).observe($("frame"));

// The party's location (the link's href), the same for every guest.
drawQr($("map-qr"), $("map-link").href, 84);

function status(text, isError = false) {
  $("status").textContent = text;
  $("status").classList.toggle("error", isError);
  $("status").hidden = !text;
}

// Draws a QR as one SVG path: crisp at any size and in the exported PNG.
function drawQr(target, text, size) {
  const qr = qrcode(0, "M");
  qr.addData(text);
  qr.make();
  const n = qr.getModuleCount();
  let d = "";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
    }
  }
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${n} ${n}`);
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.setAttribute("shape-rendering", "crispEdges");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", d);
  path.setAttribute("fill", "#1b1310");
  svg.append(path);
  target.replaceChildren(svg);
}

async function load() {
  if (!CODE_RE.test(code)) {
    status("Falta el código de la invitación en el enlace.", true);
    return;
  }
  let invite;
  try {
    const snap = await getDoc(doc(db, "rsvp", code));
    if (!snap.exists()) {
      status("No encontramos esta invitación.", true);
      return;
    }
    invite = snap.data();
  } catch (err) {
    console.error(err);
    status("No se pudo cargar la invitación. Revisa tu conexión y recarga.", true);
    return;
  }
  guestName = invite.name;
  document.title = `Dieguin Night · ${invite.name}`;
  $("guest").textContent = invite.name;
  $("kicker").textContent = `PASE PERSONAL — ADMITE ${invite.max}`;
  drawQr($("qr"), inviteLink(code), 104);
  $("rsvp-link").href = inviteLink(code);
  status("");
  $("download").disabled = false;
}

function slug(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Renders the poster at 1:1 (not the on-screen scale) and twice the pixels: 1080x1920.
export async function renderPng() {
  await document.fonts.ready;
  const frame = $("frame");
  const previous = frame.style.getPropertyValue("--s");
  frame.style.setProperty("--s", "1");
  try {
    const canvas = await html2canvas($("poster"), {
      scale: 2,
      width: 540,
      height: 960,
      backgroundColor: null,
      useCORS: true,
      logging: false,
    });
    return canvas;
  } finally {
    frame.style.setProperty("--s", previous);
  }
}

$("download").addEventListener("click", async () => {
  const button = $("download");
  button.disabled = true;
  button.textContent = "Generando…";
  try {
    const canvas = await renderPng();
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `dieguin-night-${slug(guestName) || "invitacion"}.png`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 4000);
  } catch (err) {
    console.error(err);
    status("No se pudo generar la imagen.", true);
  } finally {
    button.disabled = false;
    button.textContent = "Descargar imagen";
  }
});

window.renderInvitationPng = renderPng;
load();
