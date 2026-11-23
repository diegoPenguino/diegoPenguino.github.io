// Guest page: reads the invitation named by ?i=<code> and saves how many are going.

import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { db, CODE_RE, answerLabel } from "./firebase.js";

const $ = (id) => document.getElementById(id);
const code = new URLSearchParams(location.search).get("i") || "";

let invite = null;

function showStatus(text, isError = false) {
  $("status").textContent = text;
  $("status").classList.toggle("error", isError);
  $("status").hidden = !text;
}

function renderOptions() {
  const box = $("options");
  box.replaceChildren();
  const values = [];
  for (let n = invite.max; n >= 1; n--) values.push(n);
  values.push(0);
  for (const n of values) {
    const label = document.createElement("label");
    label.className = "opt" + (n === 0 ? " no" : "");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "count";
    input.value = String(n);
    input.required = true;
    if (invite.count === n) input.checked = true;
    const span = document.createElement("span");
    span.textContent = answerLabel(n, invite.max);
    label.append(input, span);
    box.append(label);
  }
}

function renderDone() {
  const c = invite.count;
  if (c === 0) {
    $("done-big").textContent = "Qué pena.";
    $("done-small").textContent = "Gracias por avisar. Si cambias de idea, aquí mismo puedes confirmar.";
  } else {
    $("done-big").textContent = "¡Confirmado!";
    $("done-small").textContent =
      c === 1 ? "Anotamos 1 persona. Te esperamos el sábado 19." : `Anotamos ${c} personas. Los esperamos el sábado 19.`;
  }
  $("form").hidden = true;
  $("done").hidden = false;
}

function showForm() {
  renderOptions();
  $("legend").textContent = invite.max === 1 ? "¿Vienes?" : `¿Cuántos van? Tu pase admite hasta ${invite.max}.`;
  $("done").hidden = true;
  $("form").hidden = false;
}

async function load() {
  if (!CODE_RE.test(code)) {
    showStatus("Esta invitación es personal: abre el enlace que te mandó Diego.", true);
    return;
  }
  try {
    const snap = await getDoc(doc(db, "rsvp", code));
    if (!snap.exists()) {
      showStatus("No encontramos esta invitación. Revisa que el enlace esté completo.", true);
      return;
    }
    invite = snap.data();
  } catch (err) {
    console.error(err);
    showStatus("No se pudo cargar la invitación. Revisa tu conexión y recarga la página.", true);
    return;
  }

  $("guest-name").textContent = invite.name;
  $("guest-row").hidden = false;
  $("kicker").textContent = `Pase personal · Admite ${invite.max}`;
  showStatus("");
  if (invite.count === null || invite.count === undefined) showForm();
  else renderDone();
}

$("form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const picked = new FormData($("form")).get("count");
  if (picked === null) return;
  const count = Number(picked);
  const button = $("submit");
  button.disabled = true;
  button.textContent = "Guardando…";
  showStatus("");
  try {
    await updateDoc(doc(db, "rsvp", code), { count, updatedAt: serverTimestamp() });
    invite.count = count;
    renderDone();
  } catch (err) {
    console.error(err);
    showStatus("No se pudo guardar tu respuesta. Intenta de nuevo.", true);
  } finally {
    button.disabled = false;
    button.textContent = "Confirmar";
  }
});

$("change").addEventListener("click", showForm);

load();
