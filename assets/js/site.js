// Small progressive enhancements. Every page works without this file.
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Restart a CSS entry animation on an element.
  function replay(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  // ----- Header: desktop dropdowns -----
  var groups = $$('.nav__group');
  function closeDropdowns(except) {
    groups.forEach(function (g) {
      if (g === except) return;
      g.classList.remove('is-open');
      $('[data-dropdown]', g).setAttribute('aria-expanded', 'false');
    });
  }
  groups.forEach(function (g) {
    var btn = $('[data-dropdown]', g);
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !g.classList.contains('is-open');
      closeDropdowns(g);
      g.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav__group')) closeDropdowns();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeDropdowns();
    if (menu && !menu.hidden) {
      var inside = menu.contains(document.activeElement);
      setMenu(false);
      if (inside) menuBtn.focus();
    }
  });

  // ----- Header: mobile menu -----
  var menuBtn = $('[data-menu-toggle]');
  var menu = $('#mobile-menu');
  var closeTimer;
  function setMenu(open) {
    if (!menu) return;
    var isOpen = !menu.hidden && !menu.classList.contains('is-closing');
    if (open === isOpen) return;
    clearTimeout(closeTimer);
    if (open) {
      menu.classList.remove('is-closing');
      menu.hidden = false;
    } else if (reduceMotion) {
      menu.hidden = true;
    } else {
      // Let the closing animation play before hiding the menu.
      menu.classList.add('is-closing');
      closeTimer = setTimeout(function () { menu.hidden = true; menu.classList.remove('is-closing'); }, 220);
    }
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? 'Close' : 'Menu';
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () { setMenu(menu.hidden || menu.classList.contains('is-closing')); });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) setMenu(false); });
  }

  // ----- Home: rotating word, rolled letter by letter -----
  // The heading keeps a fixed accessible name; the word pauses on hover, focus or a hidden tab.
  var rot = $('[data-rotate]');
  if (rot && !reduceMotion) {
    var words = JSON.parse(rot.getAttribute('data-rotate'));
    var title = rot.closest('h1');
    var w = 0;
    var paused = false;
    if (title) {
      title.setAttribute('aria-label', title.innerText.replace(/\s+/g, ' ').trim());
      title.tabIndex = 0;
      ['mouseenter', 'focus'].forEach(function (ev) { title.addEventListener(ev, function () { paused = true; }); });
      ['mouseleave', 'blur'].forEach(function (ev) { title.addEventListener(ev, function () { paused = false; }); });
    }
    var paint = function (word, cls) {
      rot.textContent = '';
      word.split('').forEach(function (c, k) {
        var span = document.createElement('span');
        span.className = 'ch ' + cls;
        span.style.setProperty('--i', k);
        span.setAttribute('aria-hidden', 'true');
        span.textContent = c;
        rot.appendChild(span);
      });
    };
    setInterval(function () {
      if (paused || document.hidden) return;
      var prev = words[w];
      w = (w + 1) % words.length;
      paint(prev, 'out');
      setTimeout(function () { paint(words[w], 'in'); }, 380 + prev.length * 28);
    }, 2600);
  }

  // ----- Home: facts as sample tests -----
  var factBtn = $('[data-fact-next]');
  if (factBtn) {
    var facts = JSON.parse(factBtn.getAttribute('data-facts'));
    var fText = $('[data-fact-text]');
    var verdict = $('[data-verdict]');
    var f = 0;
    factBtn.addEventListener('click', function () {
      f = (f + 1) % facts.length;
      fText.textContent = facts[f];
      if (verdict) { verdict.textContent = 'Accepted on test ' + (f + 1); replay(verdict, 'flash'); }
    });
  }

  // ----- Home: entrances as sections scroll in (anything already on screen shows at once) -----
  var ins = $$('[data-in]');
  if (ins.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      ins.forEach(function (el) { el.classList.add('on'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var sib = $$(':scope > [data-in]', e.target.parentElement);
          e.target.style.transitionDelay = Math.max(0, sib.indexOf(e.target)) * 70 + 'ms';
          e.target.classList.add('on');
          io.unobserve(e.target);
        });
      }, { rootMargin: '0px 0px -8% 0px' });
      ins.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('on');
        else io.observe(el);
      });
    }
  }

  // ----- Generic toggle groups: buttons with data-filter-value inside [data-filter-group] -----
  function pressGroup(group, value) {
    $$('[data-filter-value]', group).forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-filter-value') === value));
    });
  }

  // ----- Blog: language filter + search -----
  var blog = $('[data-blog]');
  if (blog) {
    var lang = 'all';
    var q = '';
    var items = $$('[data-post]', blog);
    var featured = $('[data-featured]', blog);
    var empty = $('[data-empty]', blog);
    var search = $('[data-search]', blog);
    function applyBlog() {
      var shown = 0;
      items.forEach(function (it) {
        var ok = (lang === 'all' || it.getAttribute('data-lang') === lang) &&
          (!q || it.getAttribute('data-text').indexOf(q) !== -1);
        it.hidden = !ok;
        if (ok) shown++;
      });
      if (featured) {
        var fOk = (lang === 'all' || featured.getAttribute('data-lang') === lang) &&
          (!q || featured.getAttribute('data-text').indexOf(q) !== -1);
        featured.hidden = !fOk;
        if (fOk) shown++;
      }
      empty.hidden = shown > 0;
    }
    var langGroup = $('[data-filter-group="lang"]', blog);
    langGroup.addEventListener('click', function (e) {
      var b = e.target.closest('[data-filter-value]');
      if (!b) return;
      lang = b.getAttribute('data-filter-value');
      pressGroup(langGroup, lang);
      applyBlog();
    });
    search.addEventListener('input', function () {
      q = search.value.trim().toLowerCase();
      applyBlog();
    });
  }

  // ----- Problem list: year filter + EN/ES intro -----
  var pl = $('[data-problems]');
  if (pl) {
    var yearGroup = $('[data-filter-group="year"]', pl);
    yearGroup.addEventListener('click', function (e) {
      var b = e.target.closest('[data-filter-value]');
      if (!b) return;
      var y = b.getAttribute('data-filter-value');
      pressGroup(yearGroup, y);
      $$('[data-year]', pl).forEach(function (s) { s.hidden = y !== 'all' && s.getAttribute('data-year') !== y; });
    });
    var plLang = $('[data-filter-group="pl-lang"]', pl);
    plLang.addEventListener('click', function (e) {
      var b = e.target.closest('[data-filter-value]');
      if (!b) return;
      var l = b.getAttribute('data-filter-value');
      pressGroup(plLang, l);
      $$('[data-i18n]', pl).forEach(function (el) {
        el.classList.toggle('show-en', l === 'en');
        el.classList.toggle('show-es', l === 'es');
      });
    });
  }

  // ----- Tabs (CP resources judges) -----
  $$('[data-tabs]').forEach(function (wrap) {
    var tabs = $$('[role="tab"]', wrap);
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () {
        tabs.forEach(function (o) {
          var sel = o === t;
          o.setAttribute('aria-selected', String(sel));
          o.tabIndex = sel ? 0 : -1;
          document.getElementById(o.getAttribute('aria-controls')).hidden = !sel;
        });
      });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        var n = tabs[(i + d + tabs.length) % tabs.length];
        n.focus();
        n.click();
      });
    });
  });

  // ----- Back to top -----
  var toTop = $('[data-to-top]');
  if (toTop) {
    var onScroll = function () { toTop.classList.toggle('is-shown', window.scrollY > window.innerHeight * 0.8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    toTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      var brand = $('.brand');
      if (brand) brand.focus({ preventScroll: true });
    });
  }

  // ----- Copy link button -----
  $$('[data-copy-link]').forEach(function (b) {
    b.addEventListener('click', function () {
      var url = b.getAttribute('data-copy-link');
      var done = function () {
        b.classList.add('is-copied');
        b.setAttribute('aria-label', 'Link copied');
        setTimeout(function () { b.classList.remove('is-copied'); b.setAttribute('aria-label', 'Copy link'); }, 1800);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function () { window.prompt('Copy this link', url); });
      else window.prompt('Copy this link', url);
    });
  });
})();
