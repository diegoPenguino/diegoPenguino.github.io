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
import { app, db, emulator, ADMIN_EMAIL, answerLabel } from "./firebase.js";

const $ = (id) => document.getElementById(id);
const auth = getAuth(app);
if (emulator) connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });

let unsubscribe = null;

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

function inviteLink(code) {
  const url = new URL("./", location.href);
  url.searchParams.set("i", code);
  if (emulator) url.searchParams.set("emulator", "");
  return url.toString().replace("emulator=", "emulator");
}

function whatsappLink(invite, code) {
  const first = invite.name.trim().split(/\s+/)[0];
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
  const list = $("guests");
  list.replaceChildren();
  $("empty").hidden = docs.length > 0;

  let people = 0;
  let answered = 0;
  let no = 0;

  for (const snap of docs) {
    const invite = snap.data();
    const code = snap.id;
    const count = invite.count ?? null;
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

    const openLink = el("a", {
      className: "chip",
      href: inviteLink(code),
      target: "_blank",
      rel: "noopener",
      textContent: "Ver pase",
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
        el("div", { className: "guest-actions" }, [copyBtn, waLink, openLink, delBtn]),
      ]),
    );
  }

  $("s-people").textContent = String(people);
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
