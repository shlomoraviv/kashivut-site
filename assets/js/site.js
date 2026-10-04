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


  /* ---------- שמיים: ציפורים וצללי ציפורים — מגוון דמויות ---------- */
  var SKY_ART = {
    /* יונה — גוף מלא, כנפיים רחבות ומעוגלות וזנב מניפה */
    dove: '<svg viewBox="0 0 64 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
      + '<path class="wl" d="M29.4 15 C28.6 13.4 26.1 13.7 24.4 13.2C22.7 12.7 20.8 12.3 19 12C17.2 11.7 15.4 11.6 13.6 11.6C11.8 11.6 9.9 11.6 8.4 11.8C6.9 12 5.5 12.3 4.4 12.6C3.3 12.9 2.2 13.2 2 13.6C1.8 14 2.3 14.7 3.2 15.2C4.1 15.7 6.1 16.1 7.6 16.6C9.1 17.1 10.8 17.8 12.4 18.4C14 19 15.6 19.7 17.2 20.2C18.8 20.7 20.4 21.2 21.8 21.6C23.2 22 24.3 22.2 25.6 22.4C26.9 22.6 28.8 23.8 29.4 22.6C30 21.4 30.2 16.6 29.4 15Z"/>'
      + '<path class="wr" d="M34.6 15 C35.4 13.4 37.9 13.7 39.6 13.2C41.3 12.7 43.2 12.3 45 12C46.8 11.7 48.6 11.6 50.4 11.6C52.2 11.6 54.1 11.6 55.6 11.8C57.1 12 58.5 12.3 59.6 12.6C60.7 12.9 61.8 13.2 62 13.6C62.2 14 61.7 14.7 60.8 15.2C59.9 15.7 57.9 16.1 56.4 16.6C54.9 17.1 53.2 17.8 51.6 18.4C50 19 48.4 19.7 46.8 20.2C45.2 20.7 43.6 21.2 42.2 21.6C40.8 22 39.7 22.2 38.4 22.4C37.1 22.6 35.2 23.8 34.6 22.6C34 21.4 33.8 16.6 34.6 15Z"/>'
      + '<path d="M32.6 6 C33 6.3 33.8 7 34 7.6C34.2 8.2 33.8 9 33.9 9.8C34 10.6 34.5 11.3 34.9 12.2C35.2 13.1 35.7 14 36 15C36.3 16 36.6 17.2 36.7 18.4C36.9 19.6 36.9 20.8 36.9 22C36.9 23.2 36.8 24.5 36.6 25.6C36.4 26.7 35.8 27.6 35.9 28.6C36 29.6 36.7 30.7 37.1 31.8C37.5 32.9 38 34.1 38.3 35.2C38.6 36.3 38.9 37.5 39.1 38.6C39.3 39.7 39.4 40.9 39.4 41.6C39.4 42.3 41.5 42.8 39.1 43C36.7 43.2 27.3 43.2 24.9 43C22.5 42.8 24.6 42.3 24.6 41.6C24.6 40.9 24.7 39.7 24.9 38.6C25.1 37.5 25.4 36.3 25.7 35.2C26 34.1 26.5 32.9 26.9 31.8C27.3 30.7 28 29.6 28.1 28.6C28.2 27.6 27.6 26.7 27.4 25.6C27.2 24.5 27.1 23.2 27.1 22C27.1 20.8 27.1 19.6 27.3 18.4C27.4 17.2 27.7 16 28 15C28.3 14 28.8 13.1 29.1 12.2C29.5 11.3 30 10.6 30.1 9.8C30.2 9 29.8 8.2 30 7.6C30.2 7 31 6.3 31.4 6C31.8 5.7 32.2 5.7 32.6 6Z"/>'
      + '</svg>',
    /* שחף — כנפיים צרות ומחודדות עם מפרק קל, גוף דק וזנב קצר */
    gull: '<svg viewBox="0 0 60 30" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
      + '<path class="wl" d="M27.4 14.6 C26.7 13.6 25.1 13.8 23.6 13.4C22.1 13 20.1 12.7 18.4 12.4C16.7 12.1 15.2 11.9 13.6 11.8C12 11.7 10.5 11.6 9 11.6C7.5 11.6 5.8 11.7 4.6 11.8C3.4 11.9 2.1 12 1.8 12.2C1.5 12.4 1.8 12.9 2.6 13.2C3.4 13.5 5.1 13.8 6.6 14.2C8.1 14.6 9.7 15 11.4 15.4C13.1 15.8 14.9 16.2 16.6 16.6C18.3 17 20.1 17.3 21.6 17.6C23.1 17.9 24.6 17.9 25.6 18.2C26.6 18.5 27.3 19.8 27.6 19.2C27.9 18.6 28.1 15.6 27.4 14.6Z"/>'
      + '<path class="wr" d="M32.6 14.6 C33.3 13.6 34.9 13.8 36.4 13.4C37.9 13 39.9 12.7 41.6 12.4C43.3 12.1 44.8 11.9 46.4 11.8C48 11.7 49.5 11.6 51 11.6C52.5 11.6 54.2 11.7 55.4 11.8C56.6 11.9 57.9 12 58.2 12.2C58.5 12.4 58.2 12.9 57.4 13.2C56.6 13.5 54.9 13.8 53.4 14.2C51.9 14.6 50.3 15 48.6 15.4C46.9 15.8 45.1 16.2 43.4 16.6C41.7 17 39.9 17.3 38.4 17.6C36.9 17.9 35.4 17.9 34.4 18.2C33.4 18.5 32.7 19.8 32.4 19.2C32.1 18.6 31.9 15.6 32.6 14.6Z"/>'
      + '<path d="M30.5 7 C30.9 7.2 31.4 7.8 31.6 8.4C31.8 9 31.4 9.7 31.5 10.4C31.6 11.1 32 11.8 32.2 12.6C32.4 13.4 32.7 14.3 32.8 15.2C32.9 16.1 32.9 17 32.9 17.8C32.9 18.6 32.8 19.4 32.6 20.2C32.5 21 32.1 21.7 32 22.4C31.9 23.1 31.9 24 31.9 24.6C31.9 25.2 31.9 25.7 31.8 26.2C31.7 26.7 31.4 27.4 31.2 27.4C31 27.4 30.6 26.5 30.5 26.3C30.4 26.1 30.7 26.3 30.5 26.3C30.3 26.3 29.7 26.3 29.5 26.3C29.3 26.3 29.6 26.1 29.5 26.3C29.4 26.5 29 27.4 28.8 27.4C28.6 27.4 28.3 26.7 28.2 26.2C28.1 25.7 28.1 25.2 28.1 24.6C28.1 24 28.1 23.1 28 22.4C27.9 21.7 27.5 21 27.4 20.2C27.2 19.4 27.1 18.6 27.1 17.8C27.1 17 27.1 16.1 27.2 15.2C27.3 14.3 27.6 13.4 27.8 12.6C28 11.8 28.4 11.1 28.5 10.4C28.6 9.7 28.2 9 28.4 8.4C28.6 7.8 29.1 7.2 29.5 7C29.9 6.8 30.1 6.8 30.5 7Z"/>'
      + '</svg>',
    /* סנונית — כנפיים חרמשיות נסוגות לאחור וזנב מפוצל עם שתי זנבות ארוכות */
    swallow: '<svg viewBox="0 0 64 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
      + '<path class="wl" d="M30.4 12.4 C29.6 12.2 27.1 12.1 25.6 12.2C24.1 12.3 22.7 12.5 21.2 12.8C19.7 13.1 18.1 13.5 16.6 14C15.1 14.5 13.5 15 12 15.6C10.5 16.2 8.8 16.8 7.4 17.4C6 18 4.4 18.9 3.4 19.4C2.4 19.9 1.5 20.2 1.4 20.6C1.3 21 1.8 21.7 2.6 21.8C3.4 21.9 4.9 21.5 6.2 21.2C7.5 20.9 9 20.6 10.4 20.2C11.8 19.8 13.3 19.3 14.8 18.8C16.3 18.3 17.7 17.7 19.2 17.2C20.7 16.7 22.2 16.1 23.6 15.6C25 15.1 26.2 14.7 27.4 14.4C28.6 14.1 30.1 13.9 30.6 13.6C31.1 13.3 31.2 12.6 30.4 12.4Z"/>'
      + '<path class="wr" d="M33.6 12.4 C34.4 12.2 36.9 12.1 38.4 12.2C39.9 12.3 41.3 12.5 42.8 12.8C44.3 13.1 45.9 13.5 47.4 14C48.9 14.5 50.5 15 52 15.6C53.5 16.2 55.2 16.8 56.6 17.4C58 18 59.6 18.9 60.6 19.4C61.6 19.9 62.5 20.2 62.6 20.6C62.7 21 62.2 21.7 61.4 21.8C60.6 21.9 59.1 21.5 57.8 21.2C56.5 20.9 55 20.6 53.6 20.2C52.2 19.8 50.7 19.3 49.2 18.8C47.7 18.3 46.3 17.7 44.8 17.2C43.3 16.7 41.8 16.1 40.4 15.6C39 15.1 37.8 14.7 36.6 14.4C35.4 14.1 33.9 13.9 33.4 13.6C32.9 13.3 32.8 12.6 33.6 12.4Z"/>'
      + '<path d="M32.5 6.6 C32.9 6.9 33.5 7.6 33.7 8.2C33.9 8.8 33.4 9.5 33.5 10.2C33.6 10.9 33.9 11.6 34.1 12.4C34.3 13.2 34.5 14 34.6 14.8C34.7 15.6 34.8 16.4 34.7 17.2C34.6 18 34.4 18.7 34.2 19.4C34 20.1 33.6 20.9 33.4 21.4C33.2 21.9 33.2 22.1 33.1 22.6C33 23.1 32.5 23.6 33 24.4C33.5 25.2 35.1 26.6 36 27.6C36.9 28.6 38 29.7 38.6 30.6C39.2 31.5 39.8 32.3 39.9 32.8C40 33.3 39.6 33.7 39 33.4C38.4 33.1 37.1 31.6 36.2 30.8C35.3 30 34.2 29 33.6 28.4C33 27.8 33.1 27.4 32.9 27.2C32.7 27 32.6 27.4 32.6 27.4C32.6 27.4 32.8 27.4 32.6 27.4C32.4 27.4 31.6 27.4 31.4 27.4C31.2 27.4 31.4 27.4 31.4 27.4C31.3 27.4 31.3 27 31.1 27.2C30.9 27.4 30.9 27.8 30.4 28.4C29.8 29 28.7 30 27.8 30.8C26.9 31.6 25.6 33.1 25 33.4C24.4 33.7 24 33.3 24.1 32.8C24.2 32.3 24.8 31.5 25.4 30.6C26 29.7 27.1 28.6 28 27.6C28.9 26.6 30.5 25.2 31 24.4C31.5 23.6 31 23.1 30.9 22.6C30.8 22.1 30.8 21.9 30.6 21.4C30.4 20.9 30 20.1 29.8 19.4C29.6 18.7 29.4 18 29.3 17.2C29.2 16.4 29.3 15.6 29.4 14.8C29.5 14 29.7 13.2 29.9 12.4C30.1 11.6 30.4 10.9 30.5 10.2C30.6 9.5 30.1 8.8 30.3 8.2C30.5 7.6 31.1 6.9 31.5 6.6C31.9 6.3 32.1 6.3 32.5 6.6Z"/>'
      + '</svg>',
    /* סיס — כנפיים חרמשיות צרות במיוחד וגוף טורפדו */
    swift: '<svg viewBox="0 0 64 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
      + '<path class="wl" d="M30.6 13.2 C29.7 12.7 27.1 13.2 25.4 13.2C23.7 13.2 22.1 13.3 20.4 13.4C18.7 13.5 17 13.8 15.4 14C13.8 14.2 12.1 14.5 10.6 14.8C9.1 15.1 7.5 15.4 6.2 15.8C4.9 16.2 3.8 16.7 3 17C2.2 17.3 1.6 17.4 1.6 17.8C1.6 18.2 2 19.1 2.8 19.2C3.6 19.3 5.3 18.7 6.6 18.4C7.9 18.1 9.3 17.8 10.8 17.6C12.3 17.4 13.9 17.2 15.4 17.2C16.9 17.2 18.5 17.3 20 17.4C21.5 17.5 23.1 17.8 24.4 17.8C25.7 17.8 26.7 17.9 27.8 17.6C28.9 17.3 30.3 16.7 30.8 16C31.3 15.3 31.5 13.7 30.6 13.2Z"/>'
      + '<path class="wr" d="M33.4 13.2 C34.3 12.7 36.9 13.2 38.6 13.2C40.3 13.2 41.9 13.3 43.6 13.4C45.3 13.5 47 13.8 48.6 14C50.2 14.2 51.9 14.5 53.4 14.8C54.9 15.1 56.5 15.4 57.8 15.8C59.1 16.2 60.2 16.7 61 17C61.8 17.3 62.4 17.4 62.4 17.8C62.4 18.2 62 19.1 61.2 19.2C60.4 19.3 58.7 18.7 57.4 18.4C56.1 18.1 54.7 17.8 53.2 17.6C51.7 17.4 50.1 17.2 48.6 17.2C47.1 17.2 45.5 17.3 44 17.4C42.5 17.5 40.9 17.8 39.6 17.8C38.3 17.8 37.3 17.9 36.2 17.6C35.1 17.3 33.7 16.7 33.2 16C32.7 15.3 32.5 13.7 33.4 13.2Z"/>'
      + '<path d="M32.5 7.6 C32.9 7.9 33.8 8.6 34 9.2C34.2 9.8 33.9 10.5 33.9 11.2C33.9 11.9 34.2 12.6 34.3 13.4C34.4 14.2 34.6 15 34.6 15.8C34.6 16.6 34.6 17.3 34.5 18C34.4 18.7 34.1 19.4 33.9 20C33.7 20.6 33.4 21.2 33.2 21.6C33.1 22 32.7 22.1 33 22.6C33.3 23.1 34.4 24.2 34.8 24.8C35.2 25.4 35.6 26.1 35.6 26.4C35.6 26.7 35 27 34.6 26.8C34.2 26.6 33.6 25.8 33.3 25.4C33 25 32.9 24.7 32.8 24.6C32.7 24.5 32.6 24.9 32.6 25C32.6 25.1 32.8 25 32.6 25C32.4 25 31.6 25 31.4 25C31.2 25 31.4 25.1 31.4 25C31.4 24.9 31.3 24.5 31.2 24.6C31.1 24.7 31 25 30.7 25.4C30.4 25.8 29.8 26.6 29.4 26.8C29 27 28.4 26.7 28.4 26.4C28.4 26.1 28.8 25.4 29.2 24.8C29.6 24.2 30.7 23.1 31 22.6C31.3 22.1 30.9 22 30.8 21.6C30.6 21.2 30.3 20.6 30.1 20C29.9 19.4 29.6 18.7 29.5 18C29.4 17.3 29.4 16.6 29.4 15.8C29.4 15 29.6 14.2 29.7 13.4C29.8 12.6 30.1 11.9 30.1 11.2C30.2 10.5 29.8 9.8 30 9.2C30.2 8.6 31.1 7.9 31.5 7.6C31.9 7.3 32.1 7.3 32.5 7.6Z"/>'
      + '</svg>',
    /* להקה רחוקה — קווי תעופה דקים בשמיים, כל ציפור בזווית מעט אחרת */
    flock: '<svg viewBox="0 0 72 28" fill="none" xmlns="http://www.w3.org/2000/svg">'
      + '<path class="fl1" d="M2.5 17.8c2.6-4.4 6.4-4.6 9.6-.4" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" fill="none"/>'
      + '<path class="fl2" d="M19.5 9.2c2.9-4.8 7.1-5 10.7-.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/>'
      + '<path class="fl3" d="M38.2 19.4c2.5-4.2 6.2-4.4 9.3-.3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" fill="none"/>'
      + '<path class="fl4" d="M55.2 11.2c2.9-4.8 7.1-5 10.7-.5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" fill="none"/>'
      + '</svg>',
    /* צל שחף גולש — כנפיים ארוכות ומחודדות בקשת עדינה, ראש מוגדר, גוף דק וזנב קצר */
    shadow: '<svg viewBox="0 0 110 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
      + '<path class="wl" d="M52 24.6 C50.5 22.9 45.9 23.3 43 22.6C40.1 21.9 37.3 21.1 34.6 20.6C31.9 20.1 29.3 19.7 27 19.4C24.7 19.1 23.2 19 21 19C18.8 19 16.3 19.1 14 19.2C11.7 19.3 8.8 19.6 7 19.8C5.2 20 3.8 20.1 3.4 20.4C3 20.7 3.3 21.4 4.4 21.8C5.5 22.2 7.9 22.6 9.8 23C11.7 23.4 13.7 23.9 15.8 24.4C17.9 24.9 20 25.4 22.2 25.8C24.4 26.2 26.8 26.5 29.2 27C31.6 27.5 34.2 28 36.6 28.6C39 29.2 41.2 29.7 43.8 30.4C46.4 31.1 50.6 33.6 52 32.6C53.4 31.6 53.5 26.3 52 24.6Z"/>'
      + '<path class="wr" d="M58 24.6 C59.5 22.9 64.1 23.3 67 22.6C69.9 21.9 72.7 21.1 75.4 20.6C78.1 20.1 80.7 19.7 83 19.4C85.3 19.1 86.8 19 89 19C91.2 19 93.7 19.1 96 19.2C98.3 19.3 101.2 19.6 103 19.8C104.8 20 106.2 20.1 106.6 20.4C107 20.7 106.7 21.4 105.6 21.8C104.5 22.2 102.1 22.6 100.2 23C98.3 23.4 96.3 23.9 94.2 24.4C92.1 24.9 90 25.4 87.8 25.8C85.6 26.2 83.2 26.5 80.8 27C78.4 27.5 75.8 28 73.4 28.6C71 29.2 68.8 29.7 66.2 30.4C63.6 31.1 59.4 33.6 58 32.6C56.6 31.6 56.5 26.3 58 24.6Z"/>'
      + '<path d="M55.7 9.6 C56.2 9.9 56.9 10.5 57.1 11.2C57.3 11.9 56.9 12.7 57 13.6C57.1 14.5 57.6 15.5 57.9 16.6C58.2 17.7 58.6 18.9 58.9 20C59.2 21.1 59.5 22.2 59.7 23.4C59.9 24.6 60 25.7 60 27C60 28.3 59.8 29.7 59.6 31C59.4 32.3 59.1 33.7 58.9 35C58.6 36.3 58.3 37.4 58.1 38.6C57.9 39.8 57.6 40.9 57.5 42C57.4 43.1 57.6 44.1 57.6 45C57.6 45.9 57.7 46.4 57.5 47.2C57.3 48 56.7 49.5 56.4 49.6C56.1 49.7 55.6 48.2 55.5 47.9C55.4 47.6 55.7 47.9 55.5 47.9C55.3 47.9 54.7 47.9 54.5 47.9C54.3 47.9 54.6 47.6 54.5 47.9C54.4 48.2 53.9 49.7 53.6 49.6C53.3 49.5 52.7 48 52.5 47.2C52.3 46.4 52.4 45.9 52.4 45C52.4 44.1 52.6 43.1 52.5 42C52.4 40.9 52.1 39.8 51.9 38.6C51.7 37.4 51.4 36.3 51.1 35C50.9 33.7 50.6 32.3 50.4 31C50.2 29.7 50 28.3 50 27C50 25.7 50.1 24.6 50.3 23.4C50.5 22.2 50.8 21.1 51.1 20C51.4 18.9 51.8 17.7 52.1 16.6C52.4 15.5 52.9 14.5 53 13.6C53.1 12.7 52.7 11.9 52.9 11.2C53.1 10.5 53.8 9.9 54.3 9.6C54.8 9.3 55.2 9.3 55.7 9.6Z"/>'
      + '</svg>',
    /* צל שחף בהרמת כנפיים — תנופת נופף טבעית בגודל בינוני */
    "shadow-md": '<svg viewBox="0 0 110 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
      + '<path class="wl" d="M52 25.4 C50.6 23.9 46.2 23.5 43.6 22.4C41 21.3 38.7 19.8 36.4 18.6C34.1 17.4 31.8 16.3 29.6 15.2C27.4 14.1 25.5 13 23.4 12C21.3 11 19.2 9.9 17 9C14.8 8.1 12.4 7.3 10.4 6.6C8.4 5.9 5.5 4.9 4.8 5C4.1 5.1 5.2 6.2 6.4 7C7.6 7.8 10 8.8 12 9.8C14 10.8 16.2 12 18.4 13.2C20.6 14.4 22.8 15.7 25 17C27.2 18.3 29.3 19.7 31.8 21.2C34.3 22.7 37.5 24.6 40 26C42.5 27.4 44.6 28.5 46.6 29.4C48.6 30.3 51.1 32.3 52 31.6C52.9 30.9 53.4 26.9 52 25.4Z"/>'
      + '<path class="wr" d="M58 25.4 C59.4 23.9 63.8 23.5 66.4 22.4C69 21.3 71.3 19.8 73.6 18.6C75.9 17.4 78.2 16.3 80.4 15.2C82.6 14.1 84.5 13 86.6 12C88.7 11 90.8 9.9 93 9C95.2 8.1 97.6 7.3 99.6 6.6C101.6 5.9 104.5 4.9 105.2 5C105.9 5.1 104.8 6.2 103.6 7C102.4 7.8 100 8.8 98 9.8C96 10.8 93.8 12 91.6 13.2C89.4 14.4 87.2 15.7 85 17C82.8 18.3 80.7 19.7 78.2 21.2C75.7 22.7 72.5 24.6 70 26C67.5 27.4 65.4 28.5 63.4 29.4C61.4 30.3 58.9 32.3 58 31.6C57.1 30.9 56.6 26.9 58 25.4Z"/>'
      + '<path d="M55.7 9.6 C56.2 9.9 56.9 10.5 57.1 11.2C57.3 11.9 56.9 12.7 57 13.6C57.1 14.5 57.6 15.5 57.9 16.6C58.2 17.7 58.6 18.9 58.9 20C59.2 21.1 59.5 22.2 59.7 23.4C59.9 24.6 60 25.7 60 27C60 28.3 59.8 29.7 59.6 31C59.4 32.3 59.1 33.7 58.9 35C58.6 36.3 58.3 37.4 58.1 38.6C57.9 39.8 57.6 40.9 57.5 42C57.4 43.1 57.6 44.1 57.6 45C57.6 45.9 57.7 46.4 57.5 47.2C57.3 48 56.7 49.5 56.4 49.6C56.1 49.7 55.6 48.2 55.5 47.9C55.4 47.6 55.7 47.9 55.5 47.9C55.3 47.9 54.7 47.9 54.5 47.9C54.3 47.9 54.6 47.6 54.5 47.9C54.4 48.2 53.9 49.7 53.6 49.6C53.3 49.5 52.7 48 52.5 47.2C52.3 46.4 52.4 45.9 52.4 45C52.4 44.1 52.6 43.1 52.5 42C52.4 40.9 52.1 39.8 51.9 38.6C51.7 37.4 51.4 36.3 51.1 35C50.9 33.7 50.6 32.3 50.4 31C50.2 29.7 50 28.3 50 27C50 25.7 50.1 24.6 50.3 23.4C50.5 22.2 50.8 21.1 51.1 20C51.4 18.9 51.8 17.7 52.1 16.6C52.4 15.5 52.9 14.5 53 13.6C53.1 12.7 52.7 11.9 52.9 11.2C53.1 10.5 53.8 9.9 54.3 9.6C54.8 9.3 55.2 9.3 55.7 9.6Z"/>'
      + '</svg>',
    /* צל שחף בנטייה עדינה (בנק) — כנף אחת גבוהה מהשנייה, כמו ציפור רחוקה */
    "shadow-sm": '<svg viewBox="0 0 110 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
      + '<path class="wl" d="M50.6 25 C49.2 23.7 45.9 25.4 43.6 25.6C41.3 25.8 38.9 26.1 36.6 26.4C34.3 26.7 32.2 27 30 27.2C27.8 27.4 25.8 27.7 23.6 27.8C21.4 27.9 18.9 28 16.6 28C14.3 28 11.6 27.9 9.6 27.8C7.6 27.7 5.3 27.2 4.6 27.4C3.9 27.6 4.6 28.5 5.6 29C6.6 29.5 8.8 30 10.6 30.4C12.4 30.8 14.4 31.2 16.4 31.6C18.4 32 20.4 32.4 22.6 32.8C24.8 33.2 27.1 33.6 29.4 34C31.7 34.4 34 34.8 36.6 35C39.2 35.2 42.2 35.5 44.8 35.2C47.4 34.9 51 35.1 52 33.4C53 31.7 52 26.3 50.6 25Z"/>'
      + '<path class="wr" d="M59.4 24.6 C60.8 23.2 64 23.6 66.4 23C68.8 22.4 71.2 21.6 73.6 20.8C76 20 78.3 19.1 80.6 18.2C82.9 17.3 85.1 16.5 87.4 15.6C89.7 14.7 92.2 13.8 94.4 13C96.6 12.2 98.7 11.6 100.6 11C102.5 10.4 105 9.5 105.6 9.6C106.2 9.7 105.6 10.7 104.4 11.4C103.2 12.1 100.7 12.8 98.6 13.6C96.5 14.4 94.3 15.4 92 16.4C89.7 17.4 87.4 18.5 85 19.6C82.6 20.7 80.1 21.8 77.6 23C75.1 24.2 72.3 25.5 70 26.6C67.7 27.7 65.6 28.8 63.6 29.6C61.6 30.4 58.7 32.2 58 31.4C57.3 30.6 58 26 59.4 24.6Z"/>'
      + '<path d="M55.7 9.6 C56.2 9.9 56.9 10.5 57.1 11.2C57.3 11.9 56.9 12.7 57 13.6C57.1 14.5 57.6 15.5 57.9 16.6C58.2 17.7 58.6 18.9 58.9 20C59.2 21.1 59.5 22.2 59.7 23.4C59.9 24.6 60 25.7 60 27C60 28.3 59.8 29.7 59.6 31C59.4 32.3 59.1 33.7 58.9 35C58.6 36.3 58.3 37.4 58.1 38.6C57.9 39.8 57.6 40.9 57.5 42C57.4 43.1 57.6 44.1 57.6 45C57.6 45.9 57.7 46.4 57.5 47.2C57.3 48 56.7 49.5 56.4 49.6C56.1 49.7 55.6 48.2 55.5 47.9C55.4 47.6 55.7 47.9 55.5 47.9C55.3 47.9 54.7 47.9 54.5 47.9C54.3 47.9 54.6 47.6 54.5 47.9C54.4 48.2 53.9 49.7 53.6 49.6C53.3 49.5 52.7 48 52.5 47.2C52.3 46.4 52.4 45.9 52.4 45C52.4 44.1 52.6 43.1 52.5 42C52.4 40.9 52.1 39.8 51.9 38.6C51.7 37.4 51.4 36.3 51.1 35C50.9 33.7 50.6 32.3 50.4 31C50.2 29.7 50 28.3 50 27C50 25.7 50.1 24.6 50.3 23.4C50.5 22.2 50.8 21.1 51.1 20C51.4 18.9 51.8 17.7 52.1 16.6C52.4 15.5 52.9 14.5 53 13.6C53.1 12.7 52.7 11.9 52.9 11.2C53.1 10.5 53.8 9.9 54.3 9.6C54.8 9.3 55.2 9.3 55.7 9.6Z"/>'
      + '</svg>'
  };
  /* רוחב הבסיס של כל דמות (בפיקסלים) — צל הציפור מגיע בשלושה גדלים: גדול, בינוני, קטן */
  var SKY_W = { dove: 64, gull: 60, swallow: 64, swift: 64, flock: 72, shadow: 84, "shadow-md": 62, "shadow-sm": 46 };
  /* לכל מסלול יש גרסת מראה לתנועה מימין לשמאל */
  var SKY_BACK = { fly: "flyBack", glide: "glideBack" };

  /* תוכניות תעופה — כל אזור מקבל שילוב אחר של דמויות, צבעים, גדלים ומסלולים */
  var SKY_PRESETS = {
    /* מסך הכניסה: צל גדול חוצה את הנוף, שחף רחוק וצל קטן קרוב */
    hero: [
      { s: "shadow", p: "glide", top: "10%", size: 1.3, o: .22, tint: "#17205c", dur: 132, delay: -12, flow: 1 },
      { s: "shadow-md", p: "glide", top: "44%", size: 1.15, o: .17, tint: "#17205c", dur: 196, delay: -58, flow: 1 },
      { s: "gull", p: "fly", top: "30%", size: .62, o: .5, tint: "#8f9fe0", dur: 124, delay: -30, flow: -1 },
      { s: "shadow-sm", p: "glide", top: "78%", size: .62, o: .2, tint: "#1e2a6e", dur: 172, delay: -18, flow: 1 }
    ],
    /* זוג: סנונית וצל ציפור קטן */
    pair: [
      { s: "swallow", p: "fly", top: "24%", size: .55, o: .48, tint: "#8f9fe0", dur: 112, delay: -8, flow: 1 },
      { s: "shadow-sm", p: "glide", top: "70%", size: .58, o: .2, tint: "#1e2a6e", dur: 158, delay: -34, flow: -1 }
    ],
    /* שני צללי ציפורים: גדול שחוצה את המסך, וקטן שגולש לאט */
    drift: [
      { s: "shadow-md", p: "glide", top: "30%", size: .72, o: .18, tint: "#17205c", dur: 176, delay: -20, flow: -1 },
      { s: "shadow-sm", p: "glide", top: "66%", size: .5, o: .2, tint: "#1e2a6e", dur: 150, delay: -6, flow: 1 }
    ],
    /* שמיים שקטים: להקה רחוקה בלבד */
    calm: [
      { s: "flock", p: "fly", top: "20%", size: .9, o: .38, tint: "#8f9fe0", dur: 156, delay: -40, flow: 1 }
    ],
    /* דמדומים: צל ציפור וסיס גבוה */
    dusk: [
      { s: "shadow", p: "glide", top: "22%", size: .95, o: .18, tint: "#17205c", dur: 152, delay: -64, flow: -1 },
      { s: "swift", p: "soar", top: "52%", size: .45, o: .4, tint: "#b9a7e6", dur: 136, delay: -24, flow: 1 }
    ],
    /* צללי ציפורים — צללים קטנים וקצת גדולים שמפוזרים לאורך העמוד */
    shadows: [
      { s: "shadow-md", p: "glide", top: "12%", size: 1.05, o: .16, tint: "#17205c", dur: 152, delay: -8, flow: 1 },
      { s: "shadow-sm", p: "glide", top: "34%", size: .7, o: .21, tint: "#1e2a6e", dur: 128, delay: -58, flow: -1 },
      { s: "shadow", p: "glide", top: "62%", size: .9, o: .15, tint: "#17205c", dur: 178, delay: -102, flow: -1 },
      { s: "shadow-sm", p: "glide", top: "84%", size: .6, o: .23, tint: "#1e2a6e", dur: 146, delay: -24, flow: 1 },
      { s: "shadow-md", p: "glide", top: "46%", size: 1, o: .19, tint: "#17205c", dur: 188, delay: -64, flow: 1 }
    ],
    /* מנה קטנה: צל גדול אחד וצל קטן אחד */
    "shadows-few": [
      { s: "shadow", p: "glide", top: "24%", size: 1.1, o: .16, tint: "#17205c", dur: 168, delay: -34, flow: 1 },
      { s: "shadow-sm", p: "glide", top: "72%", size: .68, o: .22, tint: "#1e2a6e", dur: 150, delay: -76, flow: -1 },
      { s: "shadow-md", p: "glide", top: "48%", size: .92, o: .18, tint: "#1e2a6e", dur: 174, delay: -98, flow: -1 }
    ],
    soft: [
      { s: "dove", p: "fly", top: "26%", size: .6, o: .45, tint: "#8f9fe0", dur: 132, delay: -16, flow: -1 },
      { s: "shadow-sm", p: "glide", top: "72%", size: .54, o: .19, tint: "#1e2a6e", dur: 166, delay: -46, flow: 1 }
    ]
  };

  function mountSky(host, presetName) {
    var plan = [];
    String(presetName || "").split(",").forEach(function (name) {
      plan = plan.concat(SKY_PRESETS[name.trim()] || []);
    });
    if (!plan.length || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var layer = host.classList.contains("birds") ? host : host.querySelector(".birds");
    if (!layer) {
      layer = document.createElement("div");
      layer.className = "birds";
      layer.setAttribute("aria-hidden", "true");
      host.insertBefore(layer, host.firstChild);
    }
    plan.forEach(function (c) {
      var item = document.createElement("div");
      item.className = "sky-item s-" + c.s;
      item.setAttribute("aria-hidden", "true");
      item.style.top = c.top;
      item.style.width = Math.round((SKY_W[c.s] || 64) * c.size) + "px";
      item.style.setProperty("--tint", c.tint);
      item.style.setProperty("--o", c.o);
      item.style.setProperty("--path", c.flow === -1 ? (SKY_BACK[c.p] || c.p) : c.p);
      item.style.setProperty("--dur", c.dur + "s");
      /* היסט אקראי קטן — כדי שאותה תוכנית תעופה לא תיראה זהה בשני אזורים */
      item.style.setProperty("--delay", (c.delay - Math.random() * 55).toFixed(1) + "s");
      item.style.setProperty("--size", c.size);
      item.style.setProperty("--flow", c.flow || 1);
      item.style.setProperty("--dir", c.dir || c.flow || 1);
      item.style.setProperty("--flap", (c.flap || (4.8 + Math.random() * 2.8)).toFixed(2) + "s");
      if (c.ease) item.style.setProperty("--ease", c.ease);
      item.innerHTML = SKY_ART[c.s];
      layer.appendChild(item);
    });
  }
  document.querySelectorAll("[data-sky]").forEach(function (host) {
    mountSky(host, host.getAttribute("data-sky"));
  });

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
            show("err", (data && data.errors && data.errors[0] && data.errors[0].message) || "השליחה לא הצליחה. אפשר לנסות שוב, לכתוב לנו לכתובת kashivut@gmail.com או להתקשר 055-5535964.");
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
