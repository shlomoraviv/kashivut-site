/* קשיבות — site.js */
(function () {
  "use strict";

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        links.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Active nav link ---------- */
  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === path) a.classList.add("active");
  });

  /* ---------- כרטיסי קורסים לחיצים: לחיצה על כל אזור הכרטיס מעבירה לעמוד הקורס ---------- */
  document.querySelectorAll(".course-card-link[data-href]").forEach(function (card) {
    card.addEventListener("click", function (e) {
      if (e.target.closest("a, button, input, select, textarea")) return; /* לחיצה על כפתור פנימי — התנהגות רגילה */
      var href = card.getAttribute("data-href");
      if (href) location.href = href;
    });
    card.addEventListener("keydown", function (e) {
      if (e.target !== card) return;
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        var href = card.getAttribute("data-href");
        if (href) location.href = href;
      }
    });
  });

  var FORM_ACTION = "https://formspree.io/f/xkjgppkz"; // כתובת הטופס ב-Formspree (מחובר)

  /* ---------- טופס יצירת קשר בתחתית העמוד + כפתור צ׳אט צף ---------- */
  (function addContactEmbed() {
    var CHAT_SVG = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
      + '<path d="M12 3C6.9 3 2.8 6.4 2.8 10.6c0 2.3 1.2 4.4 3.2 5.8-.1 1-.5 2.3-1.6 3.3 2 0 3.6-.8 4.5-1.6 1 .2 2 .4 3.1.4 5.1 0 9.2-3.5 9.2-7.9S17.1 3 12 3Z" fill="currentColor"/>'
      + '<circle cx="8.1" cy="10.8" r="1.15" fill="#1e2a6e"/>'
      + '<circle cx="12" cy="10.8" r="1.15" fill="#1e2a6e"/>'
      + '<circle cx="15.9" cy="10.8" r="1.15" fill="#1e2a6e"/></svg>';
    var main = document.querySelector("main");
    /* מטמיעים את הטופס המלא בתחתית כל עמוד — חוץ מעמוד צור קשר שבו הוא כבר קיים */
    if (main && !document.querySelector(".form-card[data-formspree]")) {
      main.insertAdjacentHTML("beforeend",
        '<section id="contact-embed" class="section bg-cream contact-embed">'
        + '<div class="container">'
        + '<div class="section-head center reveal rv-float">'
        + '<h2>השאירי פרטים — ונחזור אליך</h2>'
        + '<p class="lead">שיחה קצרה, רגועה וללא התחייבות. אפשר גם פשוט לשאול משהו קטן.</p>'
        + '</div>'
        + '<form class="form-card reveal rv-rise" data-formspree method="POST" action="' + FORM_ACTION + '" aria-label="טופס יצירת קשר והרשמה">'
        + '<div class="form-grid">'
        + '<div class="field"><label for="fe-name">שם מלא <span class="req">*</span></label><input id="fe-name" name="name" required autocomplete="name"></div>'
        + '<div class="field"><label for="fe-phone">טלפון <span class="req">*</span></label><input id="fe-phone" name="phone" type="tel" required autocomplete="tel" inputmode="tel"></div>'
        + '<div class="field full"><label for="fe-email">מייל</label><input id="fe-email" name="email" type="email" autocomplete="email"></div>'
        + '<div class="field full"><label for="fe-course">מה מעניין אותך?</label>'
        + '<select id="fe-course" name="course">'
        + '<option value="קורס MBSR">קורס Mindfulness בגישת MBSR</option>'
        + '<option value="קורס העמקה">קורס העמקה ב-Mindfulness</option>'
        + '<option value="ימי ריטריט">ימי ריטריט — יום של שקט ותרגול</option>'
        + '<option value="סדנאות לצוותי חינוך">מיינדפולנס לצוותי חינוך — סדנה לצוות</option>'
        + '<option value="עדיין לא יודעת">עדיין לא יודעת — שיחת היכרות</option>'
        + '</select></div>'
        + '<div class="field full"><label for="fe-note">הודעה</label><textarea id="fe-note" name="message" placeholder="כאן אפשר לכתוב שאלה, זמנים נוחים לחזרה…"></textarea></div>'
        + '</div>'
        + '<button class="btn btn-primary" type="submit" style="margin-top:1.2rem; width:100%;">שליחת פרטים</button>'
        + '<p class="form-status" role="status"></p>'
        + '<p class="form-note">הפרטים יישלחו אלינו במייל ויישמרו בדיסקרטיות מלאה.</p>'
        + '</form>'
        + '</div>'
        + '</section>');
    }
    /* כפתור צף בעיגול כחול — מגלול לטופס יצירת הקשר (המוטמע או הקיים בעמוד) */
    var fab = document.createElement("a");
    fab.className = "chat-fab";
    var targetForm = document.querySelector(".form-card[data-formspree]");
    if (targetForm && !targetForm.id) targetForm.id = "contact-form";
    fab.href = document.getElementById("contact-embed") ? "#contact-embed" : (targetForm ? "#" + targetForm.id : "contact.html");
    fab.setAttribute("aria-label", "צור קשר");
    fab.title = "צור קשר";
    fab.innerHTML = CHAT_SVG;
    document.body.appendChild(fab);
  })();

  /* ---------- חלון זכוכית ב-hero: עותק מדויק של תמונת הרקע, חד, בתוך המסגרת ----------
     העותק (.arch-sharp) מוצב באותן קואורדינטות בדיוק כמו שכבת הרקע המטושטשת,
     ולכן כל אובייקט שנכנס למסגרת ממשיך את הרקע ברצף מושלם — בלי קפיצה או שינוי מיקום */
  (function syncArchWindow() {
    var hero = document.querySelector(".hero.has-photo");
    var arch = document.querySelector(".hero-arch");
    if (!hero || !arch) return;
    var win = document.createElement("div");
    win.className = "arch-sharp";
    win.setAttribute("aria-hidden", "true");
    arch.appendChild(win);
    var photo = hero.querySelector(".hero-photo");
    var natW = 0, natH = 0, natReady = false;
    var dimCache = {};
    /* ממדי התמונה האמיתיים לפי ה-URL הנוכחי (דסקטופ/מובייל מחליפים קובץ) */
    function dimsFor(url, cb) {
      if (dimCache[url]) { cb(dimCache[url]); return; }
      var im = new Image();
      im.onload = function () { dimCache[url] = [im.naturalWidth, im.naturalHeight]; cb(dimCache[url]); };
      im.src = url;
    }
    function sync() {
      if (!photo) return;
      var m = (getComputedStyle(photo).backgroundImage || "").match(/url\(["']?(.+?)["']?\)/);
      if (!m) return;
      dimsFor(m[1], function (d) {
        var a = photo.getBoundingClientRect();  /* קופסת הרקע */
        var b = arch.getBoundingClientRect();   /* קופסת החלון */
        /* תמונת cover מורחבת מעבר לקופסה — מחשבים את ממדיה ומיקומה האמיתיים */
        var s = Math.max(a.width / d[0], a.height / d[1]);
        var w = d[0] * s, h = d[1] * s;
        var imgX = a.left - (w - a.width) / 2;
        var imgY = a.top - (h - a.height) * 0.42; /* = background-position center 42% */
        win.style.backgroundSize = w.toFixed(1) + "px " + h.toFixed(1) + "px";
        win.style.backgroundPosition = (imgX - b.left).toFixed(1) + "px " + (imgY - b.top).toFixed(1) + "px";
        hero.classList.add("synced");
      });
    }
    /* הגיאומטריה משתנה רק בטעינה/שינוי גודל/פונטים — מסנכרן באירועים (בלי לולאה שורפת CPU).
     הפרש המיקומים נשאר קבוע בגלילה כי שתי המדידות יחסיות ל-viewport */
    var lastKey = "";
    function sync() {
      if (!photo) return;
      var m = (getComputedStyle(photo).backgroundImage || "").match(/url\(["']?(.+?)["']?\)/);
      if (!m) return;
      var bb = arch.getBoundingClientRect();
      var pb = photo.getBoundingClientRect();
      /* מפתח-מצב: מידות הרקע והחלון יחד + קובץ התמונה — כך כל שינוי בפריסה (כולל טעינת פונטים
       שמזיזה את גובה ה-hero) מזוהה ומתוקן. שום שינוי = אין כתיבה */
      var key = Math.round(pb.width * 10) + "," + Math.round(pb.height * 10) + "|"
              + Math.round(bb.width * 10) + "," + Math.round(bb.height * 10) + "|" + m[1];
      if (key === lastKey) return;
      lastKey = key;
      dimsFor(m[1], function (d) {
        var a = photo.getBoundingClientRect();  /* קופסת הרקע */
        var b2 = arch.getBoundingClientRect();  /* קופסת החלון */
        /* תמונת cover מורחבת מעבר לקופסה — מחשבים את ממדיה ומיקומה האמיתיים */
        var s = Math.max(a.width / d[0], a.height / d[1]);
        var w = d[0] * s, h = d[1] * s;
        var imgX = a.left - (w - a.width) / 2;
        var imgY = a.top - (h - a.height) * 0.42; /* = background-position center 42% */
        win.style.backgroundSize = w.toFixed(1) + "px " + h.toFixed(1) + "px";
        win.style.backgroundPosition = (imgX - b2.left).toFixed(1) + "px " + (imgY - b2.top).toFixed(1) + "px";
        hero.classList.add("synced");
      });
    }
    sync();
    window.addEventListener("load", sync);
    window.addEventListener("resize", sync);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sync);
    [300, 900, 2200].forEach(function (t) { setTimeout(sync, t); }); /* התמצאות אחרי טעינה וריווחי פונטים */
    if (window.ResizeObserver && photo) new ResizeObserver(sync).observe(photo);
    var mq = matchMedia("(max-width: 1020px)");
    if (mq.addEventListener) mq.addEventListener("change", sync);
    else if (mq.addListener) mq.addListener(sync);
    /* שומר-סף עדין: כל 800ms מוודא שהסנכרון עדכני — מרפא את עצמו מכל פספוס אירוע,
     כולל מעבר דסקטופ/מובייל שמחליף את קובץ התמונה. כתיבה מתבצעת רק בשינוי אמיתי */
    setInterval(sync, 800);
  })();

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
          /* אחרי החשיפה מנקים את השהיית המעבר ומחזירים קצב hover מהיר */
          (function (el) {
            setTimeout(function () {
              el.style.transitionDelay = "";
              el.style.removeProperty("--rd");
              el.classList.add("rv-done");
            }, 2400);
          })(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Gentle parallax on washes (scroll + slow drift) ---------- */
  var washes = Array.prototype.slice.call(document.querySelectorAll(".wash"));
  var ticking = false;
  function parallax() {
    var vh = window.innerHeight;
    washes.forEach(function (w, i) {
      var rect = w.parentElement.getBoundingClientRect();
      var progress = (rect.top + rect.height / 2 - vh / 2) / vh; // -1..1
      var dir = i % 2 === 0 ? 1 : -1;
      w.style.setProperty("--py", (progress * 26 * dir).toFixed(1) + "px");
      w.style.translate = "0 " + (progress * 26 * dir).toFixed(1) + "px";
    });
    ticking = false;
  }
  if (washes.length && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
    }, { passive: true });
    parallax();
  }

  /* ---------- פרפרים ויונים — תעופה איטית ושקטה ---------- */
  var BIRD = '<svg viewBox="0 0 64 44" fill="none" xmlns="http://www.w3.org/2000/svg">'
    + '<path class="w1" d="M31 22C22 6 8 4 2 10c-4 5 2 16 14 22 6 3 12 3 15 1Z" fill="currentColor" opacity=".5"/>'
    + '<path class="w2" d="M33 22C42 6 56 4 62 10c4 5-2 16-14 22-6 3-12 3-15 1Z" fill="currentColor" opacity=".5"/>'
    + '<path class="w1" d="M31 30c-7 4-15 5-20 2-4-3-2-8 3-9 6-1 13 3 17 7Z" fill="currentColor" opacity=".32"/>'
    + '<path class="w2" d="M33 30c7 4 15 5 20 2 4-3 2-8-3-9-6-1-13 3-17 7Z" fill="currentColor" opacity=".32"/>'
    + '<ellipse cx="32" cy="26" rx="2.6" ry="9.5" fill="currentColor" opacity=".85"/>'
    + '<circle cx="30.8" cy="16.5" r="2" fill="currentColor"/>'
    + '<path d="M29.6 14.5C27 12 24 11 21.5 11.5M34.4 14.5C37 12 40 11 42.5 11.5" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" opacity=".7"/>'
    + '</svg>';
  function addBirds(host) {
    if (!host || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var configs = [
      { top: "14%", color: "#8f9fe0", dur: 58, delay: 0, scale: 0.7, flip: false },
      { top: "30%", color: "#d9a3cf", dur: 74, delay: -26, scale: 0.5, flip: true },
      { top: "62%", color: "#e8b7cf", dur: 88, delay: -52, scale: 0.42, flip: false }
    ];
    configs.forEach(function (c) {
      var b = document.createElement("div");
      b.className = "bird" + (c.flip ? " flip" : "");
      b.style.top = c.top;
      b.style.color = c.color;
      b.style.setProperty("--dur", c.dur + "s");
      b.style.setProperty("--delay", c.delay + "s");
      b.style.setProperty("--scale", c.scale);
      b.style.setProperty("--flap", (3.6 + Math.random() * 1.8).toFixed(2) + "s");
      b.style.width = 64 * c.scale * 2 + "px";
      b.innerHTML = BIRD;
      host.appendChild(b);
    });
  }
  addBirds(document.querySelector(".hero .birds") || document.querySelector(".birds"));

  /* ---------- Falling petals on page-hero sections ---------- */
  function addPetals(host, n) {
    if (!host || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (var i = 0; i < n; i++) {
      var p = document.createElement("span");
      p.className = "petal";
      var size = 10 + Math.random() * 12;
      p.style.width = size + "px";
      p.style.height = size * 1.25 + "px";
      p.style.insetInlineStart = (5 + Math.random() * 90) + "%";
      p.style.setProperty("--dur", (26 + Math.random() * 18) + "s");
      p.style.setProperty("--delay", (-Math.random() * 20) + "s");
      p.style.opacity = (0.25 + Math.random() * 0.3).toFixed(2);
      host.appendChild(p);
    }
  }
  document.querySelectorAll("[data-petals]").forEach(function (host) {
    addPetals(host, parseInt(host.getAttribute("data-petals"), 10) || 6);
  });

  /* ---------- פרלקסה עדינה לאלמנטים מסומנים ---------- */
  var parEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var tick2 = false;
  function parallax2() {
    var vh = window.innerHeight;
    parEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -120 || r.top > vh + 120) return;
      var p = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.transform = "translate3d(0," + (p * parseFloat(el.getAttribute("data-parallax")) * 100).toFixed(1) + "px,0)";
    });
    tick2 = false;
  }
  if (parEls.length && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("scroll", function () {
      if (!tick2) { requestAnimationFrame(parallax2); tick2 = true; }
    }, { passive: true });
    parallax2();
  }

  /* ---------- דירוג הופעה מדורג בתוך גרידים ---------- */
  document.querySelectorAll(".grid, .faq-list").forEach(function (group) {
    group.querySelectorAll(".reveal").forEach(function (el, i) {
      if (!/(^|\s)d[1-3](\s|$)/.test(el.className)) {
        el.style.transitionDelay = Math.min(i * 110, 480) + "ms";
      }
    });
  });

  /* ---------- דיליי מדורג אוטומטי לכל ה-reveal בסקשן (פריחה בשרשרת) ---------- */
  document.querySelectorAll(".section, .page-hero, footer.site-footer").forEach(function (sec) {
    sec.querySelectorAll(".reveal").forEach(function (el, i) {
      if (!/(^|\s)d[1-3](\s|$)/.test(el.className)) el.style.setProperty("--rd", Math.min(i * 130, 650) + "ms");
    });
  });

  /* ---------- נבטים ופרחים שצצים בגלילה ---------- */
  var SPROUTS = {
    flower: '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">'
      + '<path d="M32 62C32 46 29 38 22 33" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" opacity=".5"/>'
      + '<path d="M24 37c-7 1-11-2-12-8 7-1 11 2 12 8Z" fill="currentColor" opacity=".45"/>'
      + '<path d="M27 32c-1-7 2-12 8-13 1 7-2 12-8 13Z" fill="currentColor" opacity=".35"/>'
      + '<g fill="currentColor" opacity=".9">'
      + '<ellipse cx="32" cy="15" rx="4.6" ry="7.2"/>'
      + '<ellipse cx="32" cy="15" rx="4.6" ry="7.2" transform="rotate(72 32 15)"/>'
      + '<ellipse cx="32" cy="15" rx="4.6" ry="7.2" transform="rotate(144 32 15)"/>'
      + '<ellipse cx="32" cy="15" rx="4.6" ry="7.2" transform="rotate(216 32 15)"/>'
      + '<ellipse cx="32" cy="15" rx="4.6" ry="7.2" transform="rotate(288 32 15)"/>'
      + '</g><circle cx="32" cy="15" r="3.4" fill="#fff" opacity=".9"/></svg>',
    stem: '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">'
      + '<path d="M32 62C32 44 30 34 24 26" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" opacity=".6"/>'
      + '<path d="M27 32c-8 0-12-4-13-11 8 0 12 4 13 11Z" fill="currentColor" opacity=".4"/>'
      + '<path d="M29 24c-1-8 3-13 10-14 0 8-4 13-10 14Z" fill="currentColor" opacity=".3"/>'
      + '<circle cx="23" cy="24" r="3.2" fill="currentColor" opacity=".55"/>'
      + '<circle cx="18" cy="19" r="2.2" fill="currentColor" opacity=".4"/></svg>',
    leafy: '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">'
      + '<path d="M30 62C30 46 32 38 38 32" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" opacity=".55"/>'
      + '<path d="M36 36c2-9 9-13 17-12-2 9-9 13-17 12Z" fill="currentColor" opacity=".45"/>'
      + '<path d="M33 44c-8 2-14-1-16-8 8-2 14 1 16 8Z" fill="currentColor" opacity=".35"/></svg>',
    mimosa: '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">'
      + '<path d="M32 62V36" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" opacity=".55"/>'
      + '<g fill="currentColor" opacity=".8">'
      + '<circle cx="32" cy="30" r="5"/>'
      + '<circle cx="24" cy="24" r="4"/>'
      + '<circle cx="40" cy="24" r="4"/>'
      + '<circle cx="28" cy="17" r="3.4"/>'
      + '<circle cx="37" cy="16" r="3"/></g>'
      + '<circle cx="32" cy="30" r="1.8" fill="#fff" opacity=".85"/></svg>'
  };
  var sproutIO = ("IntersectionObserver" in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("in"); sproutIO.unobserve(en.target); }
    });
  }, { threshold: 0.05, rootMargin: "0px 0px -10px 0px" }) : null;
  (function plantSprouts() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var kinds = ["flower", "stem", "leafy", "mimosa"];
    var types = ["s-flower", "s-stem", "s-leafy", "s-mimosa"];
    document.querySelectorAll(".section:not(.hero), footer.site-footer").forEach(function (sec, si) {
      if (sec.querySelector(".sprout")) return;
      var side = si % 2 === 0;
      for (var k = 0; k < 2; k++) {
        var i = (si * 2 + k) % 4;
        var s = document.createElement("div");
        s.className = "sprout " + types[i];
        s.setAttribute("aria-hidden", "true");
        var sz = 46 + Math.round(Math.random() * 34);
        s.style.setProperty("--s", sz + "px");
        s.style.setProperty("--o", (0.4 + Math.random() * 0.3).toFixed(2));
        s.style.setProperty("--sway", (8 + Math.random() * 6).toFixed(1) + "s");
        s.style.setProperty("--rd", (k * 0.35).toFixed(2) + "s");
        s.style.insetInlineEnd = side ? (2 + Math.random() * 6).toFixed(1) + "%" : "auto";
        s.style.insetInlineStart = side ? "auto" : (2 + Math.random() * 6).toFixed(1) + "%";
        s.style.bottom = (-6 - Math.random() * 10).toFixed(0) + "px";
        s.innerHTML = SPROUTS[kinds[i]];
        sec.appendChild(s);
        if (sproutIO) sproutIO.observe(s); else s.classList.add("in");
      }
    });
  })();

  /* זרעים נודדים עדינים ברקע הפרחים של ה-hero */
  (function addSeeds() {
    var host = document.querySelector(".hero.has-photo .birds");
    if (!host || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (var i = 0; i < 4; i++) {
      var seed = document.createElement("span");
      seed.className = "seed in";
      seed.setAttribute("aria-hidden", "true");
      var ss = 9 + Math.random() * 8;
      seed.style.width = ss.toFixed(0) + "px";
      seed.style.height = (ss * 0.82).toFixed(0) + "px";
      seed.style.insetInlineStart = (12 + Math.random() * 74).toFixed(0) + "%";
      seed.style.bottom = "8%";
      seed.style.setProperty("--dur", (24 + Math.random() * 16).toFixed(1) + "s");
      seed.style.setProperty("--delay", (-Math.random() * 26).toFixed(1) + "s");
      seed.style.setProperty("--o", (0.5 + Math.random() * 0.25).toFixed(2));
      host.appendChild(seed);
    }
  })();
  document.querySelectorAll("form[data-formspree]").forEach(function (form) {
    if (form.getAttribute("action") === "#") form.setAttribute("action", FORM_ACTION);
    form.setAttribute("method", "POST");

    var status = form.querySelector(".form-status");
    var btn = form.querySelector('button[type="submit"]');
    var btnText = btn ? btn.textContent : "";

    function show(kind, msg) {
      if (!status) return;
      status.className = "form-status " + kind;
      status.textContent = msg;
    }

    /* שליחה מהימנה: AJAX קודם; אם ה-fetch נחסם (adblocker/רשת) — הדפדפן שולח ישירות ל-Formspree */
    function onSubmit(e) {
      e.preventDefault();
      if (btn) { btn.disabled = true; btn.textContent = "שולח…"; }
      fetch(FORM_ACTION, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      }).then(function (res) {
        if (res.ok) {
          show("ok", "תודה רבה! הפרטים נשלחו בהצלחה — נחזור אליך בקרוב");
          form.reset();
        } else {
          res.json().catch(function () { return {}; }).then(function (data) {
            show("err", (data && data.errors && data.errors[0] && data.errors[0].message) || "השליחה לא הצליחה. אפשר לנסות שוב, או להתקשר 055-5535964.");
          });
        }
      }).catch(function () {
        /* כישלון רשת או חוסם פרסומות שחסם את formspree.io — שליחה ישירה של הדפדפן, שתמיד עובדת */
        show("ok", "שולח את הפרטים…");
        form.removeEventListener("submit", onSubmit);
        form.submit();
      }).finally(function () {
        if (btn) { btn.disabled = false; btn.textContent = btnText; }
      });
    }
    form.addEventListener("submit", onSubmit);
  });
})();
