/* ============================================================
   קשיבות — editor.js
   מצב ניהול: עריכת טקסטים ישירות על המסך.

   איך זה עובד, בקצרה:
   1. בתחתית כל עמוד מוזרק כפתור "ניהול" שקוף לחלוטין עד שמרחפים
      עליו (או מגיעים אליו ב-Tab / נגיעה ארוכה בנייד).
   2. לחיצה עליו פותחת מסך סיסמה. הסיסמה עצמה אינה מופיעה בקוד —
      נשמר רק טביעת אצבע גיבוב (SHA-256) עם מלח, וההשוואה נעשית
      בין גיבובים. אחרי 5 ניסיונות שגויים יש נעילה זמנית.
   3. אחרי כניסה, כל טקסט באתר הופך לאזור עריכה. כפתור "שמור"
      שומר את הטקסטים, וכפתור "פרסם" מעדכן את האתר החי לכולן.
   4. טקסט המקור נשמר בנפרד ואינו נדרס (localStorage + קובץ גיבוי
      בריפו), וכל שמירה מוסיפה תמונת מצב לגיבויים.

   הערה כנה: כל הגנה שהיא בצד הלקוח ניתנת לעקיפה בידי מי שיש לו
   גישה לקוד הדף. הסיסמה כאן מונעת כניסה מקרית או סקרנית; היא
   אינה אבטחה ברמה בנקאית. שינוי תוכן דורש גם גישת כתיבה לריפו.
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- הגדרות ---------------- */
  var VERSION = 1;
  var CONTENT_FILE = "assets/content.json";
  var ORIGINAL_FILE = "assets/content.original.json";
  var BACKUP_DIR = "assets/backups/";

  /* הסיסמה אינה כתובה בשום מקום — רק גיבוב SHA-256 של המלח+סיסמה */
  var SALT = "kashivut::nihul::v1::";
  var PASS_DIGEST = "ade6b2bf3982ab952f0fbe2ccd0c332942d23fd9bc563003a1e3ca6d8372c065";

  var MAX_FAILS = 5;            /* ניסיונות לפני נעילה */
  var LOCK_MS = [60000, 300000, 900000]; /* 1 דק׳, 5 דק׳, 15 דק׳ */
  var SESSION_MS = 45 * 60 * 1000; /* תוקף התחברות מרגע הפעולה האחרונה */
  var MAX_BACKUPS = 12;

  var KEY = {
    draft: "kx.content.v1",
    original: "kx.original.v1",
    backups: "kx.backups.v1",
    guard: "kx.guard.v1",
    gh: "kx.gh.v1",
    session: "kx.session.v1"
  };

  var PAGES = [
    ["index.html", "דף הבית"],
    ["about.html", "אודות"],
    ["mbsr.html", "קורס MBSR"],
    ["deepening.html", "קורס העמקה"],
    ["education.html", "מסגרות חינוך"],
    ["retreat.html", "ריטריט"],
    ["faq.html", "שאלות נפוצות"],
    ["contact.html", "צור קשר"],
    ["404.html", "עמוד 404"]
  ];

  /* ---------------- עזרי אחסון (עטופים כדי לא לקרוס במצב פרטי) ---------------- */
  function get(k) {
    try {
      var raw = localStorage.getItem(k);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function set(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); return true; }
    catch (e) { return false; }
  }
  function del(k) {
    try { localStorage.removeItem(k); } catch (e) { }
  }
  function sget(k) {
    try { var r = sessionStorage.getItem(k); return r ? JSON.parse(r) : null; }
    catch (e) { return null; }
  }
  function sset(k, v) {
    try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { }
  }

  /* ---------------- זיהוי העמוד הנוכחי ---------------- */
  function pageKey() {
    var attr = document.body && document.body.getAttribute("data-kx-page");
    if (attr) return attr;
    var p = location.pathname.split("/").pop() || "";
    try { p = decodeURIComponent(p); } catch (e) { }
    if (!/\.html?$/i.test(p)) p = "index.html";
    return p.toLowerCase();
  }
  function pageLabel(p) {
    for (var i = 0; i < PAGES.length; i++) if (PAGES[i][0] === p) return PAGES[i][1];
    return p;
  }

  /* ---------------- גיבוב ---------------- */
  var K256 = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  function utf8Bytes(str) {
    var out = [], i, c, c2, cp;
    for (i = 0; i < str.length; i++) {
      c = str.charCodeAt(i);
      if (c < 0x80) out.push(c);
      else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
      else if (c < 0xd800 || c >= 0xe000) out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
      else {
        i++;
        c2 = str.charCodeAt(i) || 0;
        cp = 0x10000 + (((c & 0x3ff) << 10) | (c2 & 0x3ff));
        out.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 63), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
      }
    }
    return out;
  }
  /* מימוש SHA-256 טהור — ליתר ביטחון כשאין crypto.subtle (למשל http לא מאובטח) */
  function sha256Hex(str) {
    function rr(x, n) { return (x >>> n) | (x << (32 - n)); }
    function maj(x, y, z) { return (x & y) ^ (x & z) ^ (y & z); }
    var b = utf8Bytes(str), len = b.length, t, off;
    b.push(0x80);
    while (b.length % 64 !== 56) b.push(0);
    var bits = len * 8;
    b.push(0, 0, 0, 0, (bits >>> 24) & 255, (bits >>> 16) & 255, (bits >>> 8) & 255, bits & 255);
    var H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    var w = new Array(64);
    for (off = 0; off < b.length; off += 64) {
      for (t = 0; t < 16; t++) {
        w[t] = (b[off + t * 4] << 24) | (b[off + t * 4 + 1] << 16) | (b[off + t * 4 + 2] << 8) | b[off + t * 4 + 3];
      }
      for (t = 16; t < 64; t++) {
        var s0 = rr(w[t - 15], 7) ^ rr(w[t - 15], 18) ^ (w[t - 15] >>> 3);
        var s1 = rr(w[t - 2], 17) ^ rr(w[t - 2], 19) ^ (w[t - 2] >>> 10);
        w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0;
      }
      var a = H[0], bb = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (t = 0; t < 64; t++) {
        var S1 = rr(e, 6) ^ rr(e, 11) ^ rr(e, 25);
        var ch = (e & f) ^ (~e & g);
        var t1 = (h + S1 + ch + K256[t] + w[t]) | 0;
        var S0 = rr(a, 2) ^ rr(a, 13) ^ rr(a, 22);
        var t2 = (S0 + maj(a, bb, c)) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = bb; bb = a; a = (t1 + t2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + bb) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }
    return H.map(function (x) { return ("00000000" + (x >>> 0).toString(16)).slice(-8); }).join("");
  }
  function digest(text) {
    var subtle = window.crypto && window.crypto.subtle;
    if (subtle && window.TextEncoder) {
      return window.crypto.subtle.digest("SHA-256", new window.TextEncoder().encode(text))
        .then(function (buf) {
          return Array.prototype.map.call(new Uint8Array(buf), function (x) {
            return ("0" + x.toString(16)).slice(-2);
          }).join("");
        })
        .catch(function () { return sha256Hex(text); });
    }
    return Promise.resolve(sha256Hex(text));
  }

  /* ---------------- ניקוי HTML: מותר רק עיצוב פנימי בטוח ---------------- */
  var OK_TAGS = {
    B: 1, STRONG: 1, I: 1, EM: 1, U: 1, S: 1, SMALL: 1, SPAN: 1, BR: 1, WBR: 1, A: 1,
    SUP: 1, SUB: 1, MARK: 1, CITE: 1, CODE: 1, TIME: 1, ABBR: 1, Q: 1, BDI: 1,
    SVG: 1, G: 1, PATH: 1, CIRCLE: 1, ELLIPSE: 1, RECT: 1, LINE: 1, POLYLINE: 1,
    POLYGON: 1, USE: 1, TITLE: 1, DEFS: 1, CLIPPATH: 1, MASK: 1,
    LINEARGADIENT: 1, RADIALGRADIENT: 1, STOP: 1
  };
  var OK_ATTR = {
    class: 1, href: 1, target: 1, rel: 1, title: 1, dir: 1, lang: 1, datetime: 1,
    "aria-hidden": 1, "aria-label": 1, role: 1, colspan: 1, rowspan: 1, tabindex: 1
  };
  var DANGER_TAGS = { script: 1, style: 1, noscript: 1, template: 1, iframe: 1, object: 1, embed: 1, canvas: 1, form: 1, input: 1, textarea: 1, select: 1 };
  function escText(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function escAttr(s) {
    return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }
  function safeHtml(node) {
    var out = "", kids = node.childNodes, i, j;
    for (i = 0; i < kids.length; i++) {
      var n = kids[i];
      if (n.nodeType === 3) { out += escText(n.nodeValue); continue; }
      if (n.nodeType !== 1) continue;
      var tag = n.tagName.toLowerCase();
      var isSvg = (n.namespaceURI || "").indexOf("svg") >= 0;
      /* תגיות פעילות — נמחקות עם התוכן שלהן, ואינן מומרות לטקסט גלוי */
      if (DANGER_TAGS[tag]) continue;
      if (!OK_TAGS[n.tagName.toUpperCase()] && !isSvg) { out += safeHtml(n); continue; }
      var attrs = "", at = n.attributes;
      for (j = 0; j < at.length; j++) {
        var name = at[j].name, low = name.toLowerCase();
        if (low.indexOf("on") === 0) continue; /* אין מאפייני אירוע — לעולם */
        if (!isSvg && !OK_ATTR[low]) continue;
        if (low === "style") continue;
        var val = String(at[j].value);
        if (/^\s*(javascript|vbscript|data)\s*:/i.test(val)) continue;
        attrs += " " + name + '="' + escAttr(val) + '"';
      }
      if (tag === "br" || tag === "wbr") { out += "<br>"; continue; }
      out += "<" + tag + attrs + ">" + safeHtml(n) + "</" + tag + ">";
    }
    return out;
  }
  function sanitize(html) {
    var box = document.createElement("div");
    box.innerHTML = String(html == null ? "" : html);
    return safeHtml(box);
  }
  /* צורה מנורמלת להשוואה — רווחים מרובים מתכווצים, בדיוק כמו בתצוגה */
  function norm(html) {
    return sanitize(html).replace(/\s+/g, " ").replace(/\s+>/g, ">").replace(/<\s+/g, "<").trim();
  }
  /* בדיקה זריזה לתוך כדי הקלדה — בלי לפרסר מחדש את ה-HTML בכל הקשה */
  function rawNorm(html) {
    return String(html).replace(/\s+/g, " ").replace(/\s+>/g, ">").replace(/<\s+/g, "<").trim();
  }

  /* ---------------- איתור מקטעי הטקסט הניתנים לעריכה ---------------- */
  var TEXT_TAGS = {
    h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, p: 1, li: 1, blockquote: 1, cite: 1,
    figcaption: 1, label: 1, button: 1, a: 1, td: 1, th: 1, dt: 1, dd: 1, summary: 1,
    option: 1, legend: 1, div: 1, span: 1, strong: 1, em: 1, b: 1, i: 1, small: 1,
    time: 1, address: 1, pre: 1, code: 1, caption: 1
  };
  var SKIP_TAGS = {
    script: 1, style: 1, noscript: 1, template: 1, svg: 1, input: 1, textarea: 1,
    select: 1, iframe: 1, canvas: 1, video: 1, audio: 1, img: 1, br: 1, hr: 1,
    meta: 1, link: 1, head: 1, title: 1, object: 1, embed: 1
  };
  /* מקטע נחשב "טקסט" רק אם יש בו טקסט כלשהו שאינו עטוף באלמנט אחר —
     כך כל כפתור, קישור וכותרת הם יחידה בפני עצמה, ואלמנטי עטיפה מתפצלים לפריטים. */
  function hasDirectText(el) {
    for (var n = el.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 3 && n.nodeValue.replace(/[\s\u00a0]+/g, "")) return true;
    }
    return false;
  }
  function isBlock(el) {
    if (!TEXT_TAGS[el.tagName.toLowerCase()]) return false;
    if (el.namespaceURI && el.namespaceURI.indexOf("svg") >= 0) return false;
    if (el.getAttribute("aria-hidden") === "true") return false;
    if (el.closest("[data-kx-ui]")) return false;
    return hasDirectText(el);
  }
  function collectBlocks(root) {
    var out = [];
    (function walk(node) {
      for (var el = node.firstElementChild; el; el = el.nextElementSibling) {
        if (SKIP_TAGS[el.tagName.toLowerCase()]) continue;
        if (isBlock(el)) { out.push(el); continue; }
        walk(el);
      }
    })(root || document.body);
    return out;
  }
  /* עורכים אך ורק את אזורי האתר עצמו (סרגל, תוכן, פוטר) — כך תוספים
     חיצוניים או ווידג'טים שמוזרקים לעמוד לא נכנסים למצב העריכה. */
  var REGIONS = "header.site-header, main, footer.site-footer";
  function siteRoots() {
    var list = [];
    Array.prototype.forEach.call(document.querySelectorAll(REGIONS), function (r) { list.push(r); });
    return list.length ? list : [document.body];
  }
  function allBlocks() {
    var out = [];
    siteRoots().forEach(function (r) { out = out.concat(collectBlocks(r)); });
    return out;
  }

  /* ---------------- מפתח יציב לכל מקטע (נתיב בעץ) ---------------- */
  function sigOf(el) {
    var parts = [], node = el;
    while (node && node.nodeType === 1 && node !== document.documentElement) {
      var n = 1, s = node.previousElementSibling;
      while (s) {
        if (s.tagName === node.tagName) n++;
        s = s.previousElementSibling;
      }
      parts.unshift(node.tagName.toLowerCase() + (n > 1 ? "_" + n : ""));
      node = node.parentElement;
    }
    return parts.join("-");
  }
  function resolve(sig) {
    var parts = String(sig).split("-");
    if (!parts.length || parts[0] !== "body") return null;
    var sel = ["body"];
    for (var i = 1; i < parts.length; i++) {
      var m = /^([a-z][a-z0-9]*)(?:_(\d+))?$/.exec(parts[i]);
      if (!m) return null;
      sel.push(m[1] + ":nth-of-type(" + (m[2] ? parseInt(m[2], 10) : 1) + ")");
    }
    try { return document.querySelector(sel.join(" > ")); } catch (e) { return null; }
  }

  /* ---------------- מצב ---------------- */
  var published = { pages: {} };  /* מה שפורסם באתר (content.json) */
  var editing = false;
  var baseline = {};              /* המצב המנוקה ברגע הכניסה לעריכה */
  var baselineRaw = {};           /* אותו מצב בדיוק כפי שהוא ב-DOM (להשוואה מהירה) */
  var dirtyTimer = null;
  var ui = {};

  function draftAll() { return get(KEY.draft) || {}; }
  function originalAll() { return get(KEY.original) || {}; }
  function publishedAll() { return (published && published.pages) || {}; }

  /* הטיוטה המקומית היא תיקון מעל מה שפורסם: set = מה שהעורכת שינתה,
     del = מה שהוחזר לנוסח המקורי ולכן אסור שמה שפורסם ימשיך לדרוס אותו. */
  function pagePatch(pg) {
    var p = draftAll()[pg];
    if (!p) return { set: {}, del: [] };
    if (p.set || p.del) return { set: p.set || {}, del: p.del || [] };
    return { set: p, del: [] }; /* תאימות לאחור */
  }
  function overridesFor(pg) {
    var out = {}, pub = publishedAll()[pg] || {}, patch = pagePatch(pg);
    Object.keys(pub).forEach(function (k) { out[k] = pub[k]; });
    Object.keys(patch.set).forEach(function (k) { out[k] = patch.set[k]; });
    patch.del.forEach(function (k) { delete out[k]; });
    return out;
  }
  function hasOverride(pg, k) {
    return Object.prototype.hasOwnProperty.call(overridesFor(pg), k);
  }

  /* צילום מצב הטקסטים כפי שהם כרגע — הבסיס לזיהוי שינויים */
  function snapshotBaseline() {
    baseline = {};
    baselineRaw = {};
    Array.prototype.forEach.call(document.querySelectorAll("[data-kx-id]"), function (el) {
      var id = el.getAttribute("data-kx-id");
      baselineRaw[id] = rawNorm(el.innerHTML);
      baseline[id] = norm(el.innerHTML);
    });
  }

  /* ---------------- החלת הטקסטים השמורים על העמוד ---------------- */
  function applyOverrides() {
    var pg = pageKey(), map = overridesFor(pg), n = 0;
    Object.keys(map).forEach(function (id) {
      var el = resolve(id);
      if (!el || el.closest("[data-kx-ui]")) return;
      var html = norm(map[id]);
      if (el.innerHTML.replace(/\s+/g, " ").trim() !== html) { el.innerHTML = html; n++; }
    });
    return n;
  }

  /* ---------------- תיעוד טקסט המקור (פעם אחת, לא נדרס) ---------------- */
  function captureOriginals() {
    var pg = pageKey(), all = get(KEY.original) || {}, page = all[pg] || {};
    var have = Object.keys(page).length, added = 0;
    allBlocks().forEach(function (el) {
      var sig = sigOf(el);
      if (!sig || Object.prototype.hasOwnProperty.call(page, sig)) return;
      if (hasOverride(pg, sig)) return; /* כבר שונה — המקור נשמר בעבר */
      page[sig] = norm(el.innerHTML);
      added++;
    });
    if (added) {
      all[pg] = page;
      all.updated = new Date().toISOString();
      set(KEY.original, all);
    }
    return { added: added, total: have + added };
  }

  /* ---------------- הודעה צפה ---------------- */
  function toast(msg, isErr) {
    if (!ui.toast) {
      ui.toast = document.createElement("div");
      ui.toast.className = "kx-toast";
      ui.toast.setAttribute("data-kx-ui", "");
      ui.toast.setAttribute("role", "status");
      document.body.appendChild(ui.toast);
    }
    ui.toast.textContent = msg;
    ui.toast.className = "kx-toast is-on" + (isErr ? " is-err" : "");
    clearTimeout(ui.toastTimer);
    ui.toastTimer = setTimeout(function () {
      ui.toast.className = "kx-toast" + (isErr ? " is-err" : "");
    }, isErr ? 5200 : 2600);
  }

  /* ---------------- כפתור "ניהול" המוסתר ---------------- */
  function mountDot() {
    if (document.querySelector(".kx-dot")) return;
    var b = document.createElement("button");
    b.type = "button";
    b.className = "kx-dot";
    b.setAttribute("data-kx-ui", "");
    b.setAttribute("aria-label", "ניהול — עריכת טקסטים באתר");
    b.innerHTML = '<span class="kx-dot-in" aria-hidden="true"></span>'
      + '<span class="kx-dot-txt" aria-hidden="true">ניהול</span>';
    b.addEventListener("click", openGate);
    document.body.appendChild(b);
    ui.dot = b;
  }

  /* ---------------- שכבת חלונית כללית ---------------- */
  function modal(html, opts) {
    opts = opts || {};
    closeModal();
    var scrim = document.createElement("div");
    scrim.className = "kx-scrim";
    scrim.setAttribute("data-kx-ui", "");
    scrim.innerHTML = '<div class="kx-modal' + (opts.wide ? " kx-modal--wide" : "") + '" role="dialog" aria-modal="true">' + html + "</div>";
    document.body.appendChild(scrim);
    ui.scrim = scrim;
    scrim.addEventListener("mousedown", function (e) {
      if (e.target === scrim && opts.dismissable !== false) closeModal();
    });
    document.addEventListener("keydown", escClose, true);
    var focusable = scrim.querySelector("[data-autofocus]") || scrim.querySelector("input,button");
    if (focusable) setTimeout(function () { try { focusable.focus(); } catch (e) { } }, 60);
    return scrim.querySelector(".kx-modal");
  }
  function escClose(e) {
    if (e.key === "Escape" && ui.scrim) { e.preventDefault(); closeModal(); }
  }
  function closeModal() {
    if (ui.scrim) {
      var s = ui.scrim;
      s.parentNode.removeChild(s);
      ui.scrim = null;
    }
    document.removeEventListener("keydown", escClose, true);
  }

  /* ---------------- הגנת ניסיונות ---------------- */
  function guardState() {
    var g = get(KEY.guard) || { fails: 0, level: 0, until: 0 };
    if (typeof g.fails !== "number") g.fails = 0;
    if (typeof g.level !== "number") g.level = 0;
    if (typeof g.until !== "number") g.until = 0;
    return g;
  }
  function lockSecondsLeft() {
    var left = guardState().until - Date.now();
    return left > 0 ? Math.ceil(left / 1000) : 0;
  }

  function openGate() {
    if (editing) return;
    if (lockSecondsLeft() > 0) { toast("הכניסה נעולה זמנית. נסו שוב בעוד " + lockSecondsLeft() + " שניות.", true); return; }
    var m = modal(
      '<span class="kx-lock" aria-hidden="true">'
      + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'
      + '<rect x="4.5" y="10.5" width="15" height="9.5" rx="2.4"/>'
      + '<path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5"/><path d="M12 14.4v2.2"/></svg></span>'
      + '<h2>ניהול האתר</h2>'
      + '<p class="kx-sub">כניסה לעריכת הטקסטים. נא להזין סיסמה.</p>'
      + '<form class="kx-gate" novalidate>'
      + '<label class="kx-field"><span class="kx-visually-hidden">סיסמה</span>'
      + '<input class="kx-input" type="password" dir="auto" autocomplete="current-password" '
      + 'autocapitalize="off" spellcheck="false" placeholder="סיסמה" data-autofocus></label>'
      + '<p class="kx-msg" aria-live="polite"></p>'
      + '<div class="kx-row"><button class="kx-btn kx-btn--primary" type="submit">כניסה</button>'
      + '<button class="kx-btn" type="button" data-cancel>ביטול</button></div>'
      + "</form>"
    );
    var input = m.querySelector("input");
    var msg = m.querySelector(".kx-msg");
    m.querySelector("[data-cancel]").addEventListener("click", closeModal);
    m.querySelector("form").addEventListener("submit", function (e) {
      e.preventDefault();
      if (lockSecondsLeft() > 0) {
        msg.className = "kx-msg is-err";
        msg.textContent = "נעול זמנית. נסו שוב בעוד " + lockSecondsLeft() + " שניות.";
        return;
      }
      var typed = input.value;
      if (!typed.trim()) { msg.className = "kx-msg is-err"; msg.textContent = "נא להזין סיסמה."; return; }
      msg.className = "kx-msg";
      msg.textContent = "בודק…";
      input.disabled = true;
      digest(SALT + typed.replace(/[\s\u00a0\u200e\u200f]+/g, " ").trim()).then(function (h) {
        input.disabled = false;
        if (h === PASS_DIGEST) {
          set(KEY.guard, { fails: 0, level: 0, until: 0 });
          closeModal();
          startSession();
          return;
        }
        var g = guardState();
        g.fails++;
        if (g.fails >= MAX_FAILS) {
          g.until = Date.now() + LOCK_MS[Math.min(g.level, LOCK_MS.length - 1)];
          g.level++;
          g.fails = 0;
        }
        set(KEY.guard, g);
        msg.className = "kx-msg is-err";
        msg.textContent = g.until > Date.now()
          ? "יותר מדי ניסיונות. הכניסה נעולה ל-" + Math.ceil((g.until - Date.now()) / 60000) + " דקות."
          : "סיסמה שגויה. נותרו " + (MAX_FAILS - g.fails) + " ניסיונות.";
        input.value = "";
        try { input.focus(); } catch (e) { }
      });
    });
  }

  /* ---------------- התחברות ופתיחת מצב עריכה ---------------- */
  function startSession() {
    sset(KEY.session, Date.now() + SESSION_MS);
    enterEdit(true);
  }
  function sessionAlive() {
    var until = sget(KEY.session);
    return typeof until === "number" && until > Date.now();
  }
  var lastTouch = 0;
  function touchSession() {
    if (!editing) return;
    var now = Date.now();
    if (now - lastTouch < 30000) return;
    lastTouch = now;
    sset(KEY.session, now + SESSION_MS);
  }

  function requestExit() {
    var done = function () { exitEdit(); endSession(); toast("יצאת ממצב ניהול"); };
    if (countDirty() > 0) confirmBox("יציאה ממצב ניהול", "יש שינויים שלא נשמרו. לצאת בלי לשמור?", "יצא", done);
    else done();
  }
  function endSession() {
    try { sessionStorage.removeItem(KEY.session); } catch (e) { }
  }

  function enterEdit(announce) {
    if (editing) return;
    var seen = {};
    allBlocks().forEach(function (el) {
      var sig = sigOf(el);
      if (!sig || seen[sig]) return;
      seen[sig] = 1;
      el.setAttribute("data-kx-id", sig);
      el.setAttribute("contenteditable", "true");
      el.setAttribute("spellcheck", "false");
      el.setAttribute("enterkeyhint", "enter");
    });
    snapshotBaseline();
    editing = true;
    document.body.classList.add("kx-editing");
    if (!ui.dot) mountDot();
    if (ui.dot) ui.dot.style.display = "none";
    buildBar();
    captureOriginals();
    bindEditEvents();
    markDirtyState();
    if (announce) toast("מצב ניהול פעיל — כל הטקסטים ניתנים לעריכה");
    touchSession();
  }

  function exitEdit() {
    editing = false;
    document.body.classList.remove("kx-editing");
    Array.prototype.forEach.call(document.querySelectorAll("[data-kx-id]"), function (el) {
      el.removeAttribute("contenteditable");
      el.removeAttribute("data-kx-id");
      el.removeAttribute("spellcheck");
      el.removeAttribute("enterkeyhint");
      el.classList.remove("kx-dirty");
    });
    if (ui.bar) { ui.bar.parentNode.removeChild(ui.bar); ui.bar = null; }
    if (ui.dot) ui.dot.style.display = "";
    unbindEditEvents();
    baseline = {};
    baselineRaw = {};
  }

  /* ---------------- אירועי עריכה ---------------- */
  var bound = false;
  function onDocClick(e) {
    if (!editing) return;
    if (e.target.closest && e.target.closest("[data-kx-ui]")) return;
    /* במצב עריכה קליקים לא מנווטים ולא מפעילים לוגיקה — הטקסט בלבד */
    e.preventDefault();
    e.stopPropagation();
  }
  function onDocSubmit(e) {
    if (!editing) return;
    if (e.target.closest && e.target.closest("[data-kx-ui]")) return;
    e.preventDefault();
    e.stopPropagation();
    toast("במצב עריכה אין לשלוח טפסים");
  }
  function onDocKeydown(e) {
    if (!editing) return;
    var el = e.target;
    if (!el || !el.closest || !el.closest("[data-kx-id]")) {
      /* Escape יוצא ממצב ניהול, אבל לא כשיש חלונית פתוחה מעליו */
      if (e.key === "Escape" && !ui.scrim) { e.preventDefault(); requestExit(); }
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      try { document.execCommand("insertHTML", false, "<br>"); }
      catch (err) { }
      scheduleDirty();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
      e.preventDefault();
      saveDraft("שמירה במקלדת");
    }
  }
  function onDocPaste(e) {
    if (!editing) return;
    if (!e.target.closest || !e.target.closest("[data-kx-id]")) return;
    /* הדבקה כטקסט נקי — כדי שהעיצוב של האתר לא ייהרס */
    var text = (e.clipboardData || window.clipboardData).getData("text/plain");
    if (text == null) return;
    e.preventDefault();
    try { document.execCommand("insertText", false, text.replace(/\s+/g, " ")); }
    catch (err) {
      var sel = window.getSelection();
      if (sel && sel.rangeCount) {
        var r = sel.getRangeAt(0);
        r.deleteContents();
        r.insertNode(document.createTextNode(text.replace(/\s+/g, " ")));
      }
    }
    scheduleDirty();
  }
  function onDocInput(e) {
    if (!editing) return;
    var el = e.target;
    if (!el || !el.closest || !el.closest("[data-kx-id]")) return;
    el.classList.add("kx-dirty");
    scheduleDirty();
  }
  function onDocDrop(e) {
    if (!editing) return;
    if (!e.target.closest || !e.target.closest("[data-kx-id]")) return;
    /* גרירה לתוך הטקסט מוכנסת גם היא כטקסט נקי בלבד */
    e.preventDefault();
    var text = (e.dataTransfer && e.dataTransfer.getData("text/plain")) || "";
    if (!text) return;
    try { document.execCommand("insertText", false, text.replace(/\s+/g, " ")); } catch (err) { }
    scheduleDirty();
  }
  function bindEditEvents() {
    if (bound) return;
    bound = true;
    document.addEventListener("click", onDocClick, true);
    document.addEventListener("drop", onDocDrop, true);
    document.addEventListener("submit", onDocSubmit, true);
    document.addEventListener("keydown", onDocKeydown, true);
    document.addEventListener("paste", onDocPaste, true);
    document.addEventListener("input", onDocInput, true);
    window.addEventListener("beforeunload", onBeforeUnload);
    ["mousedown", "keydown", "touchstart", "input"].forEach(function (ev) {
      document.addEventListener(ev, touchSession, true);
    });
    document.addEventListener("selectionchange", touchSession, true);
  }
  function unbindEditEvents() {
    if (!bound) return;
    bound = false;
    document.removeEventListener("click", onDocClick, true);
    document.removeEventListener("drop", onDocDrop, true);
    document.removeEventListener("submit", onDocSubmit, true);
    document.removeEventListener("keydown", onDocKeydown, true);
    document.removeEventListener("paste", onDocPaste, true);
    document.removeEventListener("input", onDocInput, true);
    window.removeEventListener("beforeunload", onBeforeUnload);
    ["mousedown", "keydown", "touchstart", "input"].forEach(function (ev) {
      document.removeEventListener(ev, touchSession, true);
    });
    document.removeEventListener("selectionchange", touchSession, true);
  }
  function onBeforeUnload(e) {
    if (!editing) return;
    if (countDirty() > 0) {
      e.preventDefault();
      e.returnValue = "";
      return "";
    }
  }

  /* ---------------- שינויים שלא נשמרו ---------------- */
  function scheduleDirty() {
    clearTimeout(dirtyTimer);
    dirtyTimer = setTimeout(markDirtyState, 200);
  }
  function countDirty() {
    var n = 0;
    Array.prototype.forEach.call(document.querySelectorAll("[data-kx-id]"), function (el) {
      if (rawNorm(el.innerHTML) !== baselineRaw[el.getAttribute("data-kx-id")]) n++;
    });
    return n;
  }
  function markDirtyState() {
    if (!editing) return;
    var n = 0;
    Array.prototype.forEach.call(document.querySelectorAll("[data-kx-id]"), function (el) {
      var id = el.getAttribute("data-kx-id");
      var changed = rawNorm(el.innerHTML) !== baselineRaw[id];
      el.classList.toggle("kx-dirty", changed);
      if (changed) n++;
    });
    if (ui.count) {
      ui.count.textContent = n === 0 ? "אין שינויים שלא נשמרו" : (n === 1 ? "שינוי אחד שלא נשמר" : n + " שינויים שלא נשמרו");
    }
    if (ui.saveDot) ui.saveDot.classList.toggle("is-dirty", n > 0);
    if (ui.save) ui.save.disabled = false;
    return n;
  }

  /* ---------------- איסוף השינויים ושמירה ---------------- */
  function collectChanges() {
    var out = {};
    Array.prototype.forEach.call(document.querySelectorAll("[data-kx-id]"), function (el) {
      var id = el.getAttribute("data-kx-id");
      if (rawNorm(el.innerHTML) === baselineRaw[id]) return; /* לא נגעו — מדלגים בלי לפרסר */
      var now = norm(el.innerHTML);
      if (now === baseline[id]) return; /* נוקה ולא נותר בו שינוי */
      out[id] = now;
    });
    return out;
  }

  function saveDraft(reason) {
    if (!editing) return 0;
    var pg = pageKey();
    var ch = collectChanges();
    var orig = (originalAll()[pg]) || {};
    var patch = pagePatch(pg);
    var setMap = {}, delList = patch.del.slice();
    Object.keys(patch.set).forEach(function (k) { setMap[k] = patch.set[k]; });
    Object.keys(ch).forEach(function (k) {
      var backToOriginal = Object.prototype.hasOwnProperty.call(orig, k) && ch[k] === orig[k];
      if (backToOriginal) {
        /* הוחזר בדיוק לנוסח המקורי — מסירים את הדריסה */
        delete setMap[k];
        delList.push(k);
      } else {
        setMap[k] = ch[k];
        var at = delList.indexOf(k);
        if (at >= 0) delList.splice(at, 1);
      }
    });
    var d = draftAll();
    d[pg] = { set: setMap, del: delList };
    d.updated = new Date().toISOString();
    if (!set(KEY.draft, d)) {
      toast("שמירה נכשלה — אין מקום באחסון הדפדפן. נסו למחוק גיבויים ישנים.", true);
      return -1;
    }
    pushBackup(reason || "שמירה", pg);
    snapshotBaseline();
    markDirtyState();
    return Object.keys(ch).length;
  }

  function pushBackup(kind, pg) {
    var list = get(KEY.backups) || [];
    list.unshift({ ts: Date.now(), kind: kind, page: pg, draft: draftAll() });
    while (list.length > MAX_BACKUPS) list.pop();
    while (list.length && !set(KEY.backups, list)) list.pop();
  }

  /* ---------------- גיבוי: הורדה / ייצוא / ייבוא ---------------- */
  function download(name, text, mime) {
    var blob = new Blob([text], { type: mime || "application/json;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.setAttribute("data-kx-ui", "");
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
      if (a.parentNode) a.parentNode.removeChild(a);
    }, 1500);
  }
  function stamp() {
    var d = new Date(), p = function (n) { return ("0" + n).slice(-2); };
    return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + "-" + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds());
  }
  function fullBackup() {
    return {
      app: "kashivut-site",
      version: VERSION,
      exported: new Date().toISOString(),
      page: pageKey(),
      published: published,
      draft: draftAll(),
      original: originalAll(),
      backups: (get(KEY.backups) || []).map(function (b) {
        return { ts: b.ts, kind: b.kind, page: b.page };
      })
    };
  }

  /* ---------------- פרסום לריפו (GitHub) ---------------- */
  function ghConfig() {
    var c = get(KEY.gh) || {};
    var host = /^([^.]+)\.github\.io$/i.exec(location.hostname);
    if (host && !c.owner) c.owner = host[1];
    if (!c.repo && (location.hostname.indexOf("github.io") >= 0 || /^\/(?!$)/.test(location.pathname))) {
      var seg = location.pathname.split("/").filter(Boolean)[0];
      if (seg && seg.indexOf(".") < 0) c.repo = seg;
    }
    c.owner = c.owner || "shlomoraviv";
    c.repo = c.repo || "kashivut-site";
    c.branch = c.branch || "main";
    return c;
  }
  function b64(str) {
    var bytes = utf8Bytes(str), bin = "";
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }
  function ghHeaders(cfg) {
    return {
      Authorization: "Bearer " + cfg.token,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json"
    };
  }
  function ghGet(cfg, path) {
    var url = "https://api.github.com/repos/" + cfg.owner + "/" + cfg.repo + "/contents/"
      + path + "?ref=" + encodeURIComponent(cfg.branch) + "&t=" + Date.now();
    return fetch(url, { headers: ghHeaders(cfg), cache: "no-store" }).then(function (r) {
      if (r.status === 404) return null;
      if (!r.ok) return r.json().then(function (d) {
        var e = new Error((d && d.message) || ("HTTP " + r.status));
        e.status = r.status;
        throw e;
      });
      return r.json();
    });
  }
  function ghPut(cfg, path, text, message, onlyIfMissing) {
    return ghGet(cfg, path).then(function (existing) {
      if (existing && onlyIfMissing) return { skipped: true };
      var body = { message: message, content: b64(text), branch: cfg.branch };
      if (existing && existing.sha) body.sha = existing.sha;
      var url = "https://api.github.com/repos/" + cfg.owner + "/" + cfg.repo + "/contents/" + path;
      return fetch(url, { method: "PUT", headers: ghHeaders(cfg), body: JSON.stringify(body) })
        .then(function (r) {
          return r.json().then(function (d) {
            if (!r.ok) {
              var e = new Error((d && d.message) || ("HTTP " + r.status));
              e.status = r.status;
              throw e;
            }
            return d;
          });
        });
    });
  }

  /* בדיקת הרשאת כתיבה אמיתית, בלי לשנות שום דבר בריפו:
     PUT לקובץ קיים *בלי* sha נדחה על ידי GitHub ב-422 אם יש הרשאת כתיבה
     ("sha wasn't supplied"), וב-403/404 אם אין. לכן אין כאן יצירה או שינוי. */
  function ghProbeWrite(cfg) {
    var url = "https://api.github.com/repos/" + cfg.owner + "/" + cfg.repo + "/contents/" + CONTENT_FILE;
    return ghGet(cfg, CONTENT_FILE).then(function (existing) {
      if (!existing || !existing.sha) return { known: false };
      return fetch(url, {
        method: "PUT",
        headers: ghHeaders(cfg),
        body: JSON.stringify({ message: "בדיקת הרשאת כתיבה (ללא שינוי)", content: "e30=", branch: cfg.branch })
      }).then(function (r) {
        return { known: true, status: r.status, canWrite: r.status === 422 };
      });
    }).catch(function () { return { known: false }; });
  }

  function mergedPages() {
    var out = {}, pub = publishedAll(), d = draftAll();
    Object.keys(pub).forEach(function (p) { out[p] = Object.assign({}, pub[p]); });
    Object.keys(d).forEach(function (p) {
      if (p === "updated") return;
      var patch = pagePatch(p);
      if (!out[p]) out[p] = {};
      Object.keys(patch.set).forEach(function (k) { out[p][k] = patch.set[k]; });
      patch.del.forEach(function (k) { delete out[p][k]; });
    });
    return out;
  }

  function publish(onDone) {
    var cfg = ghConfig();
    if (!cfg.token) {
      toast("צריך להגדיר טוקן פרסום חד-פעמי", true);
      openSettings();
      if (onDone) onDone();
      return;
    }
    var pg = pageKey();
    var saved = saveDraft("פרסום");
    if (saved < 0) { if (onDone) onDone(); return; }
    var pages = mergedPages();
    var doc = {
      version: VERSION,
      updated: new Date().toISOString(),
      note: "קובץ הטקסטים של האתר. נוצר ממצב הניהול — אין לערוך ידנית.",
      pages: pages
    };
    var text = JSON.stringify(doc, null, 2) + "\n";
    var backups = get(KEY.backups) || [];
    ghPut(cfg, CONTENT_FILE, text, "עדכון טקסטים מהאתר (מצב ניהול) — " + pageLabel(pg))
      .then(function () {
        return ghPut(cfg, ORIGINAL_FILE,
          JSON.stringify({ version: VERSION, note: "טקסט המקור של האתר — נשמר פעם אחת ואינו נדרס.", original: originalAll() }, null, 2) + "\n",
          "גיבוי טקסט המקור של האתר", true);
      })
      .then(function () {
        return ghPut(cfg, BACKUP_DIR + "content-" + stamp() + ".json",
          JSON.stringify({ version: VERSION, saved: new Date().toISOString(), page: pg, backups: backups, draft: draftAll() }, null, 2) + "\n",
          "גיבוי טקסטים לפני/אחרי שמירה — " + pageLabel(pg));
      })
      .then(function () {
        toast("פורסם לאתר בהצלחה — יופיע לכולן תוך דקה");
        if (onDone) onDone();
      })
      .catch(function (err) {
        var msg = "הפרסום נכשל: " + (err && err.message ? err.message : "שגיאה");
        if (err && (err.status === 401 || err.status === 403)) {
          msg = "הטוקן לא תקין או שאין לו הרשאת כתיבה לריפו — צריך טוקן fine-grained עם Contents: Read and write.";
        }
        if (err && err.status === 409) msg = "הקובץ עודכן במקום אחר — נסו לפרסם שוב.";
        toast(msg, true);
        if (onDone) onDone();
      });
  }

  /* ---------------- סרגל הניהול ---------------- */
  function buildBar() {
    if (ui.bar) return;
    var pg = pageKey();
    var opts = PAGES.map(function (p) {
      return '<option value="' + p[0] + '"' + (p[0] === pg ? " selected" : "") + ">" + p[1] + "</option>";
    }).join("");
    var bar = document.createElement("div");
    bar.className = "kx-bar";
    bar.setAttribute("data-kx-ui", "");
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "סרגל ניהול");
    bar.innerHTML =
      '<span class="kx-bar-title"><i aria-hidden="true"></i> מצב ניהול</span>'
      + '<button class="kx-btn kx-btn--primary" type="button" data-save>שמור</button>'
      + '<button class="kx-btn kx-btn--dark" type="button" data-publish>פרסם לאתר</button>'
      + '<button class="kx-btn kx-btn--dark" type="button" data-revert>בטל שינויים</button>'
      + '<button class="kx-btn kx-btn--dark" type="button" data-restore>שחזר למקור</button>'
      + '<button class="kx-btn kx-btn--dark" type="button" data-backup>גיבוי</button>'
      + '<button class="kx-btn kx-btn--dark" type="button" data-settings aria-label="הגדרות פרסום">הגדרות</button>'
      + '<select class="kx-select" data-goto aria-label="מעבר בין עמודים">' + opts + "</select>"
      + '<button class="kx-btn kx-btn--dark" type="button" data-exit>יציאה</button>'
      + '<span class="kx-bar-status">'
      + '<span class="kx-save-dot" aria-hidden="true"></span>'
      + '<span data-count></span></span>';
    document.body.appendChild(bar);
    ui.bar = bar;
    ui.save = bar.querySelector("[data-save]");
    ui.count = bar.querySelector("[data-count]");
    ui.saveDot = bar.querySelector(".kx-save-dot");
    ui.save.addEventListener("click", function () {
      var n = saveDraft("שמירה");
      if (n < 0) return;
      toast(n === 0 ? "אין שינויים חדשים לשמירה" : (n === 1 ? "נשמר — שינוי אחד" : "נשמר — " + n + " שינויים"));
    });
    bar.querySelector("[data-publish]").addEventListener("click", function () {
      confirmBox("פרסום האתר", "הטקסטים יישמרו ויפורסמו לאתר החי, ויופיעו לכל המבקרות תוך דקה. להמשיך?",
        "פרסם עכשיו", function () {
          var b = bar.querySelector("[data-publish]");
          b.disabled = true;
          b.textContent = "מפרסם…";
          publish(function () { b.disabled = false; b.textContent = "פרסם לאתר"; });
        });
    });
    bar.querySelector("[data-revert]").addEventListener("click", function () {
      var n = countDirty();
      if (!n) { toast("אין שינויים לביטול"); return; }
      confirmBox("ביטול שינויים", "להחזיר את הטקסט למצב שהיה לפני העריכה הנוכחית? (" + n + " שינויים)", "בטל שינויים", function () {
        Array.prototype.forEach.call(document.querySelectorAll("[data-kx-id]"), function (el) {
          var id = el.getAttribute("data-kx-id");
          el.innerHTML = sanitize(baseline[id] || "");
          el.classList.remove("kx-dirty");
        });
        markDirtyState();
        toast("השינויים בוטלו");
      });
    });
    bar.querySelector("[data-restore]").addEventListener("click", function () {
      confirmBox("שחזור לטקסט המקור", "כל הטקסטים שנערכו בעמוד הזה יחזרו לנוסח המקורי של האתר. הפעולה אינה מוחקת גיבויים.", "שחזר", function () {
        var pg = pageKey();
        var d = draftAll();
        /* גם מה שפורסם כבר מוסתר — חוזרים לטקסט שבקובץ המקורי */
        d[pg] = { set: {}, del: Object.keys(publishedAll()[pg] || {}) };
        d.updated = new Date().toISOString();
        set(KEY.draft, d);
        pushBackup("שחזור למקור", pageKey());
        toast("שוחזר לטקסט המקור — טוען מחדש");
        setTimeout(function () { location.reload(); }, 700);
      });
    });
    bar.querySelector("[data-backup]").addEventListener("click", openBackupPanel);
    bar.querySelector("[data-settings]").addEventListener("click", openSettings);
    bar.querySelector("[data-goto]").addEventListener("change", function (e) {
      var target = e.target.value;
      if (target === pageKey()) return;
      var go = function () { location.href = target; };
      if (countDirty() > 0) {
        confirmBox("מעבר עמוד", "יש שינויים שלא נשמרו. לעבור בכל זאת?", "עבור", go);
        e.target.value = pageKey();
      } else go();
    });
    bar.querySelector("[data-exit]").addEventListener("click", requestExit);
  }

  function confirmBox(title, text, okLabel, onOk) {
    var m = modal(
      "<h2>" + title + "</h2>"
      + '<p class="kx-sub">' + text + "</p>"
      + '<div class="kx-actions-end">'
      + '<button class="kx-btn" type="button" data-no>חזרה</button>'
      + '<button class="kx-btn kx-btn--primary" type="button" data-yes>' + okLabel + "</button>"
      + "</div>"
    );
    m.querySelector("[data-no]").addEventListener("click", function () {
      closeModal();
      if (editing && ui.bar) markDirtyState();
    });
    m.querySelector("[data-yes]").addEventListener("click", function () {
      closeModal();
      setTimeout(onOk, 30);
    });
  }

  /* ---------------- לוח גיבויים ---------------- */
  function openBackupPanel() {
    var list = get(KEY.backups) || [];
    var rows = list.map(function (b, i) {
      var d = new Date(b.ts);
      return "<li><span><b>" + (b.kind || "שמירה") + "</b> — " + pageLabel(b.page) + "</span>"
        + "<span><time>" + d.toLocaleString("he-IL") + "</time> "
        + '<button class="kx-btn" type="button" data-restore-bk="' + i + '">שחזר</button></span></li>';
    }).join("");
    var m = modal(
      "<h2>גיבויים</h2>"
      + '<p class="kx-hint">טקסט המקור נשמר בנפרד ואינו נדרס. כאן נשמרות תמונות מצב של כל שמירה — '
      + "בדפדפן הזה וגם בקובץ גיבוי שאפשר להוריד ולשמור במקום מוגן.</p>"
      + '<ul class="kx-list">' + (rows || "<li>אין עדיין גיבויים מקומיים</li>") + "</ul>"
      + '<div class="kx-row">'
      + '<button class="kx-btn kx-btn--primary" type="button" data-dl>הורדת קובץ גיבוי מלא</button>'
      + '<button class="kx-btn" type="button" data-import>ייבוא מקובץ גיבוי</button>'
      + '<button class="kx-btn kx-btn--warn" type="button" data-clear>מחיקת הגיבויים המקומיים</button>'
      + '<button class="kx-btn" type="button" data-close>סגור</button>'
      + "</div>",
      { wide: true }
    );
    var file = document.createElement("input");
    file.type = "file";
    file.accept = ".json,application/json";
    file.className = "kx-visually-hidden";
    file.setAttribute("data-kx-ui", "");
    document.body.appendChild(file);

    m.querySelector("[data-dl]").addEventListener("click", function () {
      download("kashivut-content-backup-" + stamp() + ".json", JSON.stringify(fullBackup(), null, 2) + "\n");
      toast("קובץ הגיבוי הורד");
    });
    m.querySelector("[data-import]").addEventListener("click", function () { file.click(); });
    file.addEventListener("change", function () {
      var f = file.files && file.files[0];
      if (!f) return;
      var fr = new FileReader();
      fr.onload = function () {
        try {
          var data = JSON.parse(String(fr.result));
          if (!data || !data.draft) throw new Error("bad");
          set(KEY.draft, data.draft);
          if (data.original && !Object.keys(originalAll()).length) set(KEY.original, data.original);
          closeModal();
          toast("הגיבוי יובא — טוען מחדש");
          setTimeout(function () { location.reload(); }, 700);
        } catch (e) { toast("הקובץ אינו קובץ גיבוי תקין", true); }
      };
      fr.readAsText(f);
    });
    m.querySelector("[data-clear]").addEventListener("click", function () {
      confirmBox("מחיקת גיבויים מקומיים", "תימחקנה תמונות המצב השמורות בדפדפן. טקסט המקור וקובץ הגיבוי בריפו לא ייפגעו.", "מחק", function () {
        del(KEY.backups);
        toast("הגיבויים המקומיים נמחקו");
      });
    });
    m.querySelector("[data-close]").addEventListener("click", closeModal);
    Array.prototype.forEach.call(m.querySelectorAll("[data-restore-bk]"), function (b) {
      b.addEventListener("click", function () {
        var item = (get(KEY.backups) || [])[parseInt(b.getAttribute("data-restore-bk"), 10)];
        if (!item) return;
        confirmBox("שחזור מגיבוי", "לשחזר את הטקסטים ממועד " + new Date(item.ts).toLocaleString("he-IL") + "?", "שחזר", function () {
          set(KEY.draft, item.draft || {});
          closeModal();
          toast("הגיבוי שוחזר — טוען מחדש");
          setTimeout(function () { location.reload(); }, 700);
        });
      });
    });
  }

  /* ---------------- הגדרות פרסום ---------------- */
  function openSettings() {
    var c = ghConfig();
    var m = modal(
      "<h2>פרסום לאתר</h2>"
      + '<p class="kx-hint">כדי ש"פרסם לאתר" יעדכן את האתר החי (GitHub Pages), צריך פעם אחת להזין כאן טוקן '
      + "עם הרשאת כתיבה לריפו. הטוקן נשמר רק בדפדפן הזה — הוא לא נכתב לקוד ולא נשלח לשום מקום מלבד GitHub.</p>"
      + '<label class="kx-field"><span>בעל הריפו</span><input class="kx-input" dir="ltr" data-owner placeholder="shlomoraviv"></label>'
      + '<label class="kx-field"><span>שם הריפו</span><input class="kx-input" dir="ltr" data-repo placeholder="kashivut-site"></label>'
      + '<label class="kx-field"><span>ענף</span><input class="kx-input" dir="ltr" data-branch placeholder="main"></label>'
      + '<label class="kx-field"><span>טוקן פרסום (fine-grained, Contents: Read and write)</span>'
      + '<input class="kx-input" dir="ltr" type="password" data-token autocomplete="off" placeholder="github_pat_…"></label>'
      + '<p class="kx-msg" aria-live="polite"></p>'
      + '<div class="kx-row">'
      + '<button class="kx-btn kx-btn--primary" type="button" data-test>בדיקת חיבור</button>'
      + '<button class="kx-btn" type="button" data-save-cfg>שמור</button>'
      + '<button class="kx-btn kx-btn--warn" type="button" data-del-cfg>מחק טוקן מהדפדפן</button>'
      + '<button class="kx-btn" type="button" data-close>סגור</button>'
      + "</div>"
      + '<p class="kx-hint" style="margin-top:1rem">אין טוקן? אפשר גם להוריד את קובץ הטקסטים ולעדכן אותו בריפו ידנית — '
      + "האתר יקרא אותו משם.</p>"
      + '<div class="kx-row"><button class="kx-btn" type="button" data-dl-content>הורדת content.json</button></div>',
      { wide: true }
    );
    var fOwner = m.querySelector("[data-owner]");
    var fRepo = m.querySelector("[data-repo]");
    var fBranch = m.querySelector("[data-branch]");
    var fToken = m.querySelector("[data-token]");
    var msg = m.querySelector(".kx-msg");
    fOwner.value = c.owner || "";
    fRepo.value = c.repo || "";
    fBranch.value = c.branch || "main";
    fToken.value = c.token || "";
    function collect() {
      return {
        owner: fOwner.value.trim(),
        repo: fRepo.value.trim(),
        branch: fBranch.value.trim() || "main",
        token: fToken.value.trim()
      };
    }
    function saveCfg(quiet) {
      var v = collect();
      if (!set(KEY.gh, v)) { msg.className = "kx-msg is-err"; msg.textContent = "שמירת ההגדרות נכשלה."; return false; }
      if (!quiet) { msg.className = "kx-msg is-ok"; msg.textContent = "ההגדרות נשמרו בדפדפן הזה."; }
      return true;
    }
    m.querySelector("[data-save-cfg]").addEventListener("click", function () { saveCfg(false); });
    m.querySelector("[data-test]").addEventListener("click", function () {
      if (!saveCfg(true)) return;
      var v = collect();
      if (!v.token) { msg.className = "kx-msg is-err"; msg.textContent = "צריך להזין טוקן."; return; }
      msg.className = "kx-msg";
      msg.textContent = "בודק…";
      ghGet(v, CONTENT_FILE).then(function () {
        /* קריאה עבדה — עכשיו בודקים גם הרשאת כתיבה, כדי שלא נתגלה רק בפרסום */
        return ghProbeWrite(v);
      }).then(function (probe) {
        if (probe && probe.known && probe.canWrite) {
          msg.className = "kx-msg is-ok";
          msg.textContent = "החיבור תקין וגם הרשאת הכתיבה קיימת — אפשר לפרסם.";
        } else if (probe && probe.known) {
          msg.className = "kx-msg is-err";
          msg.textContent = "הטוקן קורא את הריפו אבל אין לו הרשאת כתיבה (HTTP " + probe.status
            + "). צריך טוקן עם Contents: Read and write.";
        } else {
          msg.className = "kx-msg is-ok";
          msg.textContent = "הקריאה תקינה. לא הצלחתי לבדוק הרשאת כתיבה — נסו לפרסם.";
        }
      }).catch(function (err) {
        msg.className = "kx-msg is-err";
        msg.textContent = "החיבור נכשל: " + (err && err.message ? err.message : "שגיאה");
      });
    });
    m.querySelector("[data-del-cfg]").addEventListener("click", function () {
      del(KEY.gh);
      fToken.value = "";
      msg.className = "kx-msg is-ok";
      msg.textContent = "הטוקן נמחק מהדפדפן הזה.";
    });
    m.querySelector("[data-dl-content]").addEventListener("click", function () {
      var doc = {
        version: VERSION, updated: new Date().toISOString(),
        note: "קובץ הטקסטים של האתר. נוצר ממצב הניהול.",
        pages: mergedPages()
      };
      download("content.json", JSON.stringify(doc, null, 2) + "\n");
      toast("הקובץ הורד — יש להעלות אותו ל-assets/content.json");
    });
    m.querySelector("[data-close]").addEventListener("click", closeModal);
  }

  /* ---------------- אתחול ---------------- */
  function loadContent() {
    return fetch(CONTENT_FILE + "?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (json) {
        if (json && json.pages && typeof json.pages === "object") published = json;
        else if (json && typeof json === "object") published = { pages: json };
      })
      .catch(function () { /* אין קובץ תוכן — האתר מציג את הטקסט המקורי */ });
  }

  function boot() {
    mountDot();
    /* דרך נוחה לבעלת האתר בנייד: לפתוח את מסך הסיסמה בכתובת index.html#ניהול */
    var hash = "";
    try { hash = decodeURIComponent(location.hash.replace(/^#/, "")); } catch (e) { hash = location.hash; }
    if (/^(kx|admin|ניהול)$/i.test(hash)) setTimeout(openGate, 400);
    loadContent().then(function () {
      applyOverrides();
      setTimeout(function () {
        applyOverrides(); /* ניסיון נוסף אחרי שהעמוד נבנה במלואו */
        if (sessionAlive()) enterEdit(false);
      }, 220);
    });
    /* מצב עריכה נשמר כל עוד הדפדפן פתוח — גם אחרי מעבר עמוד */
    window.addEventListener("pageshow", function () {
      if (!editing && sessionAlive() && ui.dot && ui.dot.style.display !== "none") enterEdit(false);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 0); });
  } else {
    setTimeout(boot, 0);
  }
})();
