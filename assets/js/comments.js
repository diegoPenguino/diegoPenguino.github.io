// Blog comments: Google sign-in (Firebase Authentication) + Cloud Firestore.
// Data lives in posts/{postId}/comments; rules in firebase/firestore.rules.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import {
  getAuth, onAuthStateChanged, signInWithPopup, signInWithRedirect, getRedirectResult, signOut,
  GoogleAuthProvider, connectAuthEmulator,
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';
import {
  getFirestore, collection, doc, query, orderBy, onSnapshot, writeBatch, deleteDoc,
  serverTimestamp, connectFirestoreEmulator,
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';

const root = document.getElementById('comments');
if (root) start(root);

function start(root) {
  const cfg = JSON.parse(root.dataset.config);
  const postId = root.dataset.postId;
  const $ = (sel) => root.querySelector(sel);
  const els = {
    count: $('[data-count]'), user: $('[data-user]'), form: $('[data-form]'), signin: $('[data-signin]'),
    login: $('[data-login]'), list: $('[data-list]'), status: $('[data-status]'), hint: $('[data-hint]'),
    meAvatar: $('[data-me-avatar]'), text: $('#comment-text'),
  };

  const app = initializeApp({ apiKey: cfg.apiKey, authDomain: cfg.authDomain, projectId: cfg.projectId, appId: cfg.appId });
  const auth = getAuth(app);
  const db = getFirestore(app);

  // A "demo-" project id means local testing against the Firebase emulators.
  if (cfg.projectId.startsWith('demo-')) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
  } else if (cfg.recaptchaSiteKey) {
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app-check.js').then(({ initializeAppCheck, ReCaptchaV3Provider }) => {
      initializeAppCheck(app, { provider: new ReCaptchaV3Provider(cfg.recaptchaSiteKey), isTokenAutoRefreshEnabled: true });
    });
  }

  const commentsRef = collection(db, 'posts', postId, 'comments');
  let me = null;
  let comments = [];
  let replyTo = null; // id of the top-level comment being answered

  const dateFmt = new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

  // ----- Auth -----
  // Popup is the default; browsers that block it fall back to a full-page redirect.
  getRedirectResult(auth).catch((e) => console.error(e));
  els.login.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      if (e.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, provider);
      } else if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') {
        setStatus('Sign-in failed. Please try again.');
        console.error(e);
      }
    }
  });

  onAuthStateChanged(auth, (user) => {
    me = user;
    cancelReply();
    els.form.hidden = !user;
    els.signin.hidden = !!user;
    els.user.textContent = '';
    if (user) {
      els.meAvatar.src = user.photoURL || '';
      els.meAvatar.hidden = !user.photoURL;
      const name = document.createElement('span');
      name.textContent = displayName(user);
      const out = document.createElement('button');
      out.type = 'button';
      out.className = 'link-btn';
      out.textContent = 'Sign out';
      out.addEventListener('click', () => signOut(auth));
      els.user.append(name, out);
    }
    render();
  });

  // ----- Data -----
  onSnapshot(query(commentsRef, orderBy('createdAt', 'asc')), (snap) => {
    comments = snap.docs.map((d) => ({ id: d.id, ...d.data({ serverTimestamps: 'estimate' }) }));
    render();
  }, (err) => {
    console.error(err);
    setStatus('Comments could not be loaded right now.');
  });

  els.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = els.text.value.trim();
    if (!me || !text) return;
    const button = els.form.querySelector('button[type="submit"]');
    button.disabled = true;
    try {
      const batch = writeBatch(db);
      const data = { uid: me.uid, name: displayName(me), text, parent: replyTo, createdAt: serverTimestamp() };
      if (me.photoURL && me.photoURL.startsWith('https://')) data.photo = me.photoURL;
      batch.set(doc(commentsRef), data);
      batch.set(doc(db, 'users', me.uid), { lastCommentAt: serverTimestamp() });
      await batch.commit();
      els.text.value = '';
      cancelReply();
    } catch (err) {
      console.error(err);
      els.hint.textContent = err.code === 'permission-denied'
        ? 'Please wait 30 seconds between comments.'
        : 'Your comment could not be posted. Try again.';
      els.hint.classList.add('is-error');
    } finally {
      button.disabled = false;
    }
  });

  // ----- Rendering -----
  function render() {
    const top = comments.filter((c) => !c.parent);
    const replies = (id) => comments.filter((c) => c.parent === id);
    const visible = top.reduce((n, c) => n + 1 + replies(c.id).length, 0);
    els.count.textContent = visible ? `(${visible})` : '';
    els.list.textContent = '';
    for (const c of top) {
      const li = item(c, true);
      const kids = replies(c.id);
      if (kids.length) {
        const ol = document.createElement('ol');
        ol.className = 'comments__replies';
        kids.forEach((r) => ol.append(item(r, false)));
        li.querySelector('.comment__body').append(ol);
      }
      els.list.append(li);
    }
    setStatus(visible ? '' : 'No comments yet. Be the first!');
  }

  function item(c, canReply) {
    const li = document.createElement('li');
    li.className = 'comment';
    li.id = `comment-${c.id}`;
    const img = document.createElement('img');
    img.className = 'avatar';
    img.alt = '';
    img.width = img.height = 40;
    img.referrerPolicy = 'no-referrer';
    img.loading = 'lazy';
    if (c.photo) img.src = c.photo; else img.classList.add('avatar--empty');
    const body = document.createElement('div');
    body.className = 'comment__body';
    const meta = document.createElement('div');
    meta.className = 'comment__meta';
    const name = document.createElement('span');
    name.className = 'comment__name';
    name.textContent = c.name;
    const date = document.createElement('time');
    const when = c.createdAt && c.createdAt.toDate ? c.createdAt.toDate() : new Date();
    date.dateTime = when.toISOString();
    date.textContent = dateFmt.format(when);
    meta.append(name, date);
    const text = document.createElement('p');
    text.className = 'comment__text';
    text.textContent = c.text;
    const actions = document.createElement('div');
    actions.className = 'comment__actions';
    if (canReply && me) actions.append(button('Reply', () => startReply(c)));
    if (me && (me.uid === c.uid || isAdmin())) {
      actions.append(button('Delete', async () => {
        if (!window.confirm('Delete this comment?')) return;
        try { await deleteDoc(doc(commentsRef, c.id)); } catch (err) { console.error(err); }
      }));
    }
    body.append(meta, text, actions);
    li.append(img, body);
    return li;
  }

  function button(label, onClick) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'link-btn';
    b.textContent = label;
    b.addEventListener('click', onClick);
    return b;
  }

  function startReply(c) {
    replyTo = c.id;
    els.hint.classList.remove('is-error');
    els.hint.textContent = '';
    const label = document.createElement('span');
    label.textContent = `Replying to ${c.name} · `;
    els.hint.append(label, button('cancel', cancelReply));
    els.text.focus();
    root.querySelector('[data-form]').scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  function cancelReply() {
    replyTo = null;
    els.hint.classList.remove('is-error');
    els.hint.textContent = 'Plain text. Be kind.';
  }

  function isAdmin() {
    return !!(me && cfg.admin && me.email === cfg.admin && me.emailVerified);
  }

  function displayName(user) {
    return (user.displayName || 'Reader').slice(0, 80);
  }

  function setStatus(msg) {
    els.status.textContent = msg;
    els.status.hidden = !msg;
  }
}
