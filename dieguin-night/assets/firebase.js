// Firebase setup shared by the guest page and the admin page.
// Same project as the blog comments (penguin-blog-6526c); the rules are in
// firebase/firestore.rules at the root of this repo (match /rsvp/{code}).
//
// On localhost, add ?emulator to the URL to use the Auth and Firestore emulators instead.

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
  getFirestore,
  connectFirestoreEmulator,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const CONFIG = {
  apiKey: "AIzaSyCx6kz6L01-roRK4Co_qIbDoqa8OCbMwIg",
  authDomain: "penguin-blog-6526c.firebaseapp.com",
  projectId: "penguin-blog-6526c",
  appId: "1:728883874771:web:b168c3193682639fc4fd26",
};

export const ADMIN_EMAIL = "diegoangulo5@gmail.com";

export const emulator =
  ["localhost", "127.0.0.1"].includes(location.hostname) &&
  new URLSearchParams(location.search).has("emulator");

export const app = initializeApp(emulator ? { ...CONFIG, projectId: "demo-penguino" } : CONFIG);
export const db = getFirestore(app);
if (emulator) connectFirestoreEmulator(db, "127.0.0.1", 8080);

export const CODE_RE = /^[A-Za-z0-9]{12}$/;

// "Vamos 3", "Vamos 2", "Solo yo", "No puedo ir"
export function answerLabel(count, max) {
  if (count === 0) return "No puedo ir";
  if (count === 1) return max === 1 ? "Voy" : "Solo yo";
  return `Vamos ${count}`;
}
