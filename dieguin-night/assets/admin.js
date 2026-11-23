// Admin page: Diego signs in with Google, creates one invitation per guest (name + how
// many people it admits), copies or sends each guest's link, and sees the answers live.
// The Firestore rules only let the admin email list, create, edit or delete invitations.

import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  connectAuthEmulator,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { app, db, emulator, ADMIN_EMAIL, inviteLink, slug } from "./firebase.js";

const $ = (id) => document.getElementById(id);
const auth = getAuth(app);
if (emulator) connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });

let unsubscribe = null;
let current = []; // the invitations on screen, oldest first

// ---------- links ----------

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function newCode() {
  let out = "";
  const bytes = new Uint8Array(32);
  while (out.length < 12) {
    crypto.getRandomValues(bytes);
    for (const b of bytes) {
      if (b < 248 && out.length < 12) out += ALPHABET[b % 62]; // 248 = 4 * 62, no bias
    }
  }
  return out;
}

function whatsappLink(invite, code) {
  const first = invite.name.trim().split(/[\s,]+/)[0];
  const text =
    `¡Hola ${first}! Te invito a la Dieguin Night: sábado 19 de diciembre a las 4:00 p. m., ` +
    `en la calle 15 de Agosto, entre Villa de Oropeza y San Lorenzo. ` +
    `Tu pase admite ${invite.max === 1 ? "1 persona" : `${invite.max} personas`}. ` +
    `Confirma aquí: ${inviteLink(code)}`;
  return "https://wa.me/?text=" + encodeURIComponent(text);
}

// ---------- rendering ----------

function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  Object.assign(node, props);
  node.append(...children);
  return node;
}

function render(docs) {
  current = docs;
  const list = $("guests");
  list.replaceChildren();
  $("empty").hidden = docs.length > 0;

  let people = 0;
  let answered = 0;
  let no = 0;
  let invited = 0;

  for (const snap of docs) {
    const invite = snap.data();
    const code = snap.id;
    const count = invite.count ?? null;
    invited += invite.max;
    if (count !== null) answered++;
    if (count === 0) no++;
    if (count > 0) people += count;

    const answer =
      count === null ? "Sin responder" : count === 0 ? "No va" : `Confirmó: ${count} de ${invite.max}`;
    const answerClass = "guest-answer" + (count === null ? "" : count === 0 ? " no" : " yes");

    const maxInput = el("input", {
      type: "number",
      min: 1,
      max: 10,
      step: 1,
      value: invite.max,
      inputMode: "numeric",
    });
    maxInput.setAttribute("aria-label", `Cuántos admite el pase de ${invite.name}`);
    maxInput.addEventListener("change", () => changeMax(code, invite, maxInput));

    const copyBtn = el("button", { type: "button", className: "chip", textContent: "Copiar enlace" });
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(inviteLink(code));
        copyBtn.textContent = "¡Copiado!";
      } catch {
        prompt("Copia el enlace:", inviteLink(code));
      }
      setTimeout(() => (copyBtn.textContent = "Copiar enlace"), 1600);
    });

    const waLink = el("a", {
      className: "chip",
      href: whatsappLink(invite, code),
      target: "_blank",
      rel: "noopener",
      textContent: "WhatsApp",
    });

    const cardLink = el("a", {
      className: "chip",
      href: inviteLink(code, "invitacion.html"),
      target: "_blank",
      rel: "noopener",
      textContent: "Invitación con QR",
    });

    const openLink = el("a", {
      className: "chip",
      href: inviteLink(code),
      target: "_blank",
      rel: "noopener",
      textContent: "Ver confirmación",
    });

    const delBtn = el("button", { type: "button", className: "chip danger", textContent: "Borrar" });
    delBtn.addEventListener("click", async () => {
      if (!confirm(`¿Borrar la invitación de ${invite.name}? Su enlace dejará de funcionar.`)) return;
      try {
        await deleteDoc(doc(db, "rsvp", code));
      } catch (err) {
        console.error(err);
        alert("No se pudo borrar.");
      }
    });

    list.append(
      el("li", { className: "guest-row" }, [
        el("div", { className: "guest-main" }, [
          el("p", { className: "guest-name", textContent: invite.name }),
          el("p", { className: answerClass, textContent: answer }),
        ]),
        el("label", { className: "guest-max" }, ["Admite", maxInput]),
        el("div", { className: "guest-actions" }, [cardLink, copyBtn, waLink, openLink, delBtn]),
      ]),
    );
  }

  $("s-people").textContent = String(people);
  $("s-people-label").textContent = `personas confirmadas, de ${invited} invitadas`;
  $("zip").hidden = docs.length === 0;
  updateBulkPreview();
  $("s-answered").textContent = `${answered}/${docs.length}`;
  $("s-pending").textContent = String(docs.length - answered);
  $("s-no").textContent = String(no);
}

async function changeMax(code, invite, input) {
  const max = Number(input.value);
  if (!Number.isInteger(max) || max < 1 || max > 10) {
    input.value = invite.max;
    alert("El pase admite de 1 a 10 personas.");
    return;
  }
  if (max === invite.max) return;
  const count = invite.count ?? null;
  const update = { max };
  if (count !== null && count > max) {
    const ok = confirm(
      `${invite.name} ya confirmó ${count}. Si bajas el pase a ${max}, su respuesta se borra ` +
        `y tendrá que confirmar de nuevo. ¿Seguir?`,
    );
    if (!ok) {
      input.value = invite.max;
      return;
    }
    update.count = null;
    update.updatedAt = null;
  }
  try {
    await updateDoc(doc(db, "rsvp", code), update);
  } catch (err) {
    console.error(err);
    input.value = invite.max;
    alert("No se pudo cambiar.");
  }
}

// ---------- adding ----------

$("add").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = form.name.value.trim().replace(/\s+/g, " ");
  const max = Number(form.max.value);
  const status = $("add-status");
  if (!name) return;
  if (!Number.isInteger(max) || max < 1 || max > 10) {
    status.textContent = "El pase admite de 1 a 10 personas.";
    return;
  }
  const button = form.querySelector("button");
  button.disabled = true;
  try {
    const code = newCode();
    await setDoc(doc(db, "rsvp", code), {
      name,
      max,
      count: null,
      createdAt: serverTimestamp(),
      updatedAt: null,
    });
    status.textContent = `Listo: invitación para ${name}.`;
    form.reset();
    form.max.value = "1";
    form.name.focus();
  } catch (err) {
    console.error(err);
    status.textContent = "No se pudo crear la invitación.";
  } finally {
    button.disabled = false;
  }
});

// ---------- adding many ----------

// "Guichi, Chente y Di 3" -> { name: "Guichi, Chente y Di", max: 3 }. No number: admits 1.
function parseLine(line) {
  const text = line.replace(/^[\s*•-]+/, "").trim().replace(/\s+/g, " ");
  if (!text) return null;
  const match = text.match(/^(.*?)\s*[-–:=|]?\s+(\d{1,2})$/);
  const name = (match ? match[1] : text).trim();
  const max = match ? Number(match[2]) : 1;
  return { name, max };
}

function parseBulk() {
  const existing = new Set(current.map((snap) => snap.data().name.toLowerCase()));
  const seen = new Set();
  const rows = [];
  const problems = [];
  for (const line of $("bulk").list.value.split("\n")) {
    const row = parseLine(line);
    if (!row) continue;
    const key = row.name.toLowerCase();
    if (!row.name || row.name.length > 80) problems.push(`"${row.name.slice(0, 30)}…": nombre de 1 a 80 letras`);
    else if (row.max < 1 || row.max > 10) problems.push(`${row.name}: admite de 1 a 10`);
    else if (existing.has(key)) problems.push(`${row.name}: ya tiene invitación`);
    else if (seen.has(key)) problems.push(`${row.name}: repetido`);
    else {
      seen.add(key);
      rows.push(row);
    }
  }
  return { rows, problems };
}

function updateBulkPreview() {
  const { rows, problems } = parseBulk();
  const people = rows.reduce((sum, row) => sum + row.max, 0);
  let text = rows.length
    ? `Se crearán ${rows.length} ${rows.length === 1 ? "invitación" : "invitaciones"} para ${people} ${people === 1 ? "persona" : "personas"}.`
    : "";
  if (problems.length) text += ` Se saltan ${problems.length}: ${problems.join("; ")}.`;
  $("bulk-preview").textContent = text.trim();
  $("bulk-create").disabled = rows.length === 0;
}

$("bulk").list.addEventListener("input", updateBulkPreview);

$("bulk").addEventListener("submit", async (event) => {
  event.preventDefault();
  const { rows } = parseBulk();
  if (!rows.length) return;
  const button = $("bulk-create");
  const status = $("bulk-status");
  button.disabled = true;
  let done = 0;
  try {
    // One at a time, so createdAt keeps the order of the list.
    for (const row of rows) {
      await setDoc(doc(db, "rsvp", newCode()), {
        name: row.name,
        max: row.max,
        count: null,
        createdAt: serverTimestamp(),
        updatedAt: null,
      });
      done++;
      status.textContent = `Creando ${done} de ${rows.length}…`;
    }
    status.textContent = `Listo: ${done} invitaciones creadas.`;
    $("bulk").list.value = "";
  } catch (err) {
    console.error(err);
    status.textContent = `Se crearon ${done} de ${rows.length}; falló la siguiente. Vuelve a intentar: las que ya existen se saltan.`;
  } finally {
    updateBulkPreview();
  }
});

// ---------- all the PNGs in one ZIP ----------

// Opens each invitation card in a hidden frame, renders it to PNG and zips them all.
async function renderCard(frame, code) {
  await new Promise((resolve, reject) => {
    frame.onload = resolve;
    frame.onerror = reject;
    frame.src = inviteLink(code, "invitacion.html");
  });
  const win = frame.contentWindow;
  for (let i = 0; i < 100 && !win.invitationReady; i++) await new Promise((r) => setTimeout(r, 100));
  if (!(await win.invitationReady)) throw new Error("invitation did not load: " + code);
  const canvas = await win.renderInvitationPng();
  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

$("zip").addEventListener("click", async () => {
  const button = $("zip");
  const status = $("zip-status");
  const invites = current.slice();
  button.disabled = true;
  const frame = el("iframe", { title: "Invitación", tabIndex: -1 });
  frame.setAttribute("aria-hidden", "true");
  frame.style.cssText = "position:fixed;left:-10000px;top:0;width:600px;height:1100px;border:0;";
  document.body.append(frame);
  try {
    const zip = new JSZip();
    const width = String(invites.length).length;
    for (const [i, snap] of invites.entries()) {
      status.textContent = `Generando ${i + 1} de ${invites.length}: ${snap.data().name}…`;
      const png = await renderCard(frame, snap.id);
      const number = String(i + 1).padStart(width, "0");
      zip.file(`${number}-${slug(snap.data().name) || snap.id}.png`, png);
    }
    status.textContent = "Comprimiendo…";
    const blob = await zip.generateAsync({ type: "blob" });
    const link = el("a", { href: URL.createObjectURL(blob), download: "dieguin-night-invitaciones.zip" });
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 10000);
    status.textContent = `Listo: ${invites.length} imágenes en dieguin-night-invitaciones.zip.`;
  } catch (err) {
    console.error(err);
    status.textContent = "No se pudieron generar las imágenes. Recarga e intenta de nuevo.";
  } finally {
    frame.remove();
    button.disabled = false;
  }
});

// ---------- auth ----------

$("signin").addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
  } catch (err) {
    console.error(err);
    $("gate-msg").textContent = "No se pudo iniciar sesión. Intenta de nuevo.";
  }
});

$("signout").addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, (user) => {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
  const isAdmin = user && user.email === ADMIN_EMAIL && user.emailVerified;
  $("who").textContent = user ? user.email : "";
  $("signout").hidden = !user;
  $("gate").hidden = isAdmin;
  $("app").hidden = !isAdmin;
  $("signin").hidden = Boolean(user);
  $("gate-msg").textContent = user
    ? "Esta cuenta no tiene acceso. Esta página es solo para Diego."
    : "Esta página es solo para Diego.";
  if (!isAdmin) return;

  unsubscribe = onSnapshot(
    query(collection(db, "rsvp"), orderBy("createdAt")),
    (snap) => render(snap.docs),
    (err) => {
      console.error(err);
      $("empty").hidden = false;
      $("empty").textContent = "No se pudieron cargar las invitaciones.";
    },
  );
});
