// Tests for firestore.rules. Run from firebase/ with `npm test`, which starts the
// Firestore emulator, runs these files with node --test, and stops it.

import { readFileSync } from "node:fs";
import { after, before, beforeEach, describe, test } from "node:test";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  Timestamp,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";

const ADMIN_EMAIL = "diegoangulo5@gmail.com";
const CODE = "def next_step(board, pos, positions, me):\n    return (pos[0] + 1, pos[1])\n";

let env;

before(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-penguino",
    firestore: { rules: readFileSync(new URL("../firestore.rules", import.meta.url), "utf8") },
  });
});

after(async () => {
  await env.cleanup();
});

beforeEach(async () => {
  await env.clearFirestore();
});

const as = (uid, token = {}) => env.authenticatedContext(uid, token).firestore();
const anon = () => env.unauthenticatedContext().firestore();
const secondsAgo = (s) => Timestamp.fromMillis(Date.now() - s * 1000);

function newBot(uid, fields = {}) {
  return {
    uid,
    ownerName: "Ana",
    name: "mi bot",
    code: CODE,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...fields,
  };
}

// What the page does to save: the bot and the rate-limit stamp in one batch.
function saveBot(db, pathUid, slot, data, { stamp = true, update = false } = {}) {
  const batch = writeBatch(db);
  const ref = doc(db, "users", pathUid, "bots", slot);
  if (update) batch.update(ref, data);
  else batch.set(ref, data);
  if (stamp) batch.set(doc(db, "botLimits", pathUid), { lastSaveAt: serverTimestamp() });
  return batch.commit();
}

// Writes data with the rules turned off, to set up a test.
async function seed(path, data) {
  await env.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), path), data);
  });
}

async function seedBot(uid, slot, fields = {}) {
  await seed(`users/${uid}/bots/${slot}`, {
    uid,
    ownerName: "Ana",
    name: "mi bot",
    code: CODE,
    createdAt: secondsAgo(60),
    updatedAt: secondsAgo(60),
    ...fields,
  });
  await seed(`botLimits/${uid}`, { lastSaveAt: secondsAgo(60) });
}

describe("bots: reading", () => {
  test("anyone can read a bot, signed in or not", async () => {
    await seedBot("ana", "1");
    await assertSucceeds(getDoc(doc(anon(), "users/ana/bots/1")));
    await assertSucceeds(getDoc(doc(as("bob"), "users/ana/bots/1")));
  });

  test("anyone can list every user's bots with a collection group query", async () => {
    await seedBot("ana", "1");
    await seedBot("bob", "3");
    const snap = await assertSucceeds(getDocs(collectionGroup(anon(), "bots")));
    if (snap.size !== 2) throw new Error(`expected 2 bots, got ${snap.size}`);
  });

  test("rate-limit stamps are not readable", async () => {
    await seedBot("ana", "1");
    await assertFails(getDoc(doc(as("ana"), "botLimits/ana")));
  });
});

describe("bots: creating", () => {
  test("a user can create a bot in slots 1 to 5", async () => {
    await assertSucceeds(saveBot(as("ana"), "ana", "1", newBot("ana")));
  });

  test("slots outside 1 to 5 are rejected", async () => {
    await assertFails(saveBot(as("ana"), "ana", "6", newBot("ana")));
    await assertFails(saveBot(as("ana"), "ana", "0", newBot("ana")));
    await assertFails(saveBot(as("ana"), "ana", "mybot", newBot("ana")));
  });

  test("signed-out visitors cannot create bots", async () => {
    await assertFails(saveBot(anon(), "ana", "1", newBot("ana")));
  });

  test("a user cannot write in someone else's folder", async () => {
    await assertFails(saveBot(as("bob"), "ana", "1", newBot("ana")));
  });

  test("the uid field must be the author", async () => {
    await assertFails(saveBot(as("ana"), "ana", "1", newBot("bob")));
  });

  test("extra or missing fields are rejected", async () => {
    await assertFails(saveBot(as("ana"), "ana", "1", newBot("ana", { stars: 5 })));
    const { code, ...withoutCode } = newBot("ana");
    await assertFails(saveBot(as("ana"), "ana", "1", withoutCode));
  });

  test("name, owner name and code must have a sane size", async () => {
    await assertFails(saveBot(as("ana"), "ana", "1", newBot("ana", { name: "   " })));
    await assertFails(saveBot(as("ana"), "ana", "1", newBot("ana", { name: "x".repeat(41) })));
    await assertFails(saveBot(as("ana"), "ana", "1", newBot("ana", { ownerName: "" })));
    await assertFails(saveBot(as("ana"), "ana", "1", newBot("ana", { code: "" })));
    await assertFails(saveBot(as("ana"), "ana", "1", newBot("ana", { code: "x".repeat(20001) })));
    await assertSucceeds(saveBot(as("ana"), "ana", "1", newBot("ana", { code: "x".repeat(20000) })));
  });

  test("timestamps must come from the server", async () => {
    await assertFails(saveBot(as("ana"), "ana", "1", newBot("ana", { createdAt: secondsAgo(5) })));
    await assertFails(saveBot(as("ana"), "ana", "1", newBot("ana", { updatedAt: secondsAgo(5) })));
  });
});

describe("bots: rate limit", () => {
  test("a save without the rate-limit stamp is rejected", async () => {
    await assertFails(saveBot(as("ana"), "ana", "1", newBot("ana"), { stamp: false }));
  });

  test("a second save within 10 seconds is rejected", async () => {
    await assertSucceeds(saveBot(as("ana"), "ana", "1", newBot("ana")));
    await assertFails(saveBot(as("ana"), "ana", "2", newBot("ana")));
  });

  test("a save more than 10 seconds after the last one is allowed", async () => {
    await seed("botLimits/ana", { lastSaveAt: secondsAgo(11) });
    await assertSucceeds(saveBot(as("ana"), "ana", "2", newBot("ana")));
  });

  test("a user cannot stamp someone else's limit", async () => {
    await assertFails(setDoc(doc(as("bob"), "botLimits/ana"), { lastSaveAt: serverTimestamp() }));
  });
});

describe("bots: editing", () => {
  test("the owner can change the name and code", async () => {
    await seedBot("ana", "1");
    const edit = { name: "v2", code: CODE + "# v2\n", updatedAt: serverTimestamp() };
    await assertSucceeds(saveBot(as("ana"), "ana", "1", edit, { update: true }));
  });

  test("createdAt cannot change", async () => {
    await seedBot("ana", "1");
    const edit = { createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
    await assertFails(saveBot(as("ana"), "ana", "1", edit, { update: true }));
  });

  test("nobody else can edit the bot", async () => {
    await seedBot("ana", "1");
    await seed("botLimits/bob", { lastSaveAt: secondsAgo(60) });
    const edit = { code: "stolen", updatedAt: serverTimestamp() };
    await assertFails(saveBot(as("bob"), "ana", "1", edit, { update: true }));
  });
});

describe("bots: deleting", () => {
  test("the owner can delete their bot", async () => {
    await seedBot("ana", "1");
    await assertSucceeds(deleteDoc(doc(as("ana"), "users/ana/bots/1")));
  });

  test("other users cannot delete it", async () => {
    await seedBot("ana", "1");
    await assertFails(deleteDoc(doc(as("bob"), "users/ana/bots/1")));
    await assertFails(deleteDoc(doc(anon(), "users/ana/bots/1")));
  });

  test("the site admin can delete any bot", async () => {
    await seedBot("ana", "1");
    const admin = as("diego", { email: ADMIN_EMAIL, email_verified: true });
    await assertSucceeds(deleteDoc(doc(admin, "users/ana/bots/1")));
  });

  test("the admin email must be verified", async () => {
    await seedBot("ana", "1");
    const fake = as("eve", { email: ADMIN_EMAIL, email_verified: false });
    await assertFails(deleteDoc(doc(fake, "users/ana/bots/1")));
  });
});

// The bot rules sit next to the comment rules; these check that comments still work.
describe("comments: unchanged", () => {
  function comment(uid, fields = {}) {
    return { uid, name: "Ana", text: "Hola", parent: null, createdAt: serverTimestamp(), ...fields };
  }

  function postComment(db, uid, id, data) {
    const batch = writeBatch(db);
    batch.set(doc(db, "posts", "my-post", "comments", id), data);
    batch.set(doc(db, "users", uid), { lastCommentAt: serverTimestamp() });
    return batch.commit();
  }

  test("a signed-in user can comment", async () => {
    await assertSucceeds(postComment(as("ana"), "ana", "c1", comment("ana")));
  });

  test("anyone can read comments, nobody can read users", async () => {
    await seed("posts/my-post/comments/c1", { ...comment("ana"), createdAt: secondsAgo(5) });
    await assertSucceeds(getDoc(doc(anon(), "posts/my-post/comments/c1")));
    await assertFails(getDoc(doc(as("ana"), "users/ana")));
  });

  test("a second comment within 30 seconds is rejected", async () => {
    await assertSucceeds(postComment(as("ana"), "ana", "c1", comment("ana")));
    await assertFails(postComment(as("ana"), "ana", "c2", comment("ana")));
  });

  test("everything else is closed", async () => {
    await assertFails(setDoc(doc(as("ana"), "other/x"), { a: 1 }));
    await assertFails(getDoc(doc(anon(), "other/x")));
  });
});
