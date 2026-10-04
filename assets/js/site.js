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
      + '<g class="wl"><path d="M29.4 15 C28.6 13.4 26.1 13.7 24.4 13.2C22.7 12.7 20.8 12.3 19 12C17.2 11.7 13.9 10.2 13.6 11.6C13.3 13 15.8 18.5 17.2 20.2C18.6 21.9 20.4 21.2 21.8 21.6C23.2 22 24.3 22.2 25.6 22.4C26.9 22.6 28.8 23.8 29.4 22.6C30 21.4 30.2 16.6 29.4 15Z"/>'
      + '<g class="wo" style="transform-origin:13.6px 11.6px"><path d="M13.6 11.6 C12.1 10.2 9.9 11.6 8.4 11.8C6.9 12 5.5 12.3 4.4 12.6C3.3 12.9 2.2 13.2 2 13.6C1.8 14 2.3 14.7 3.2 15.2C4.1 15.7 6.1 16.1 7.6 16.6C9.1 17.1 10.8 17.8 12.4 18.4C14 19 17 21.3 17.2 20.2C17.4 19.1 15.1 13 13.6 11.6Z"/>'
      + '</g></g><g class="wr"><path d="M34.5 14.5 C35.3 12.9 37.7 13.2 39.4 12.7C41.1 12.2 42.9 11.8 44.6 11.5C46.4 11.2 49.6 9.7 49.8 11.1C50.1 12.5 47.7 18 46.4 19.7C45 21.4 43.3 20.7 41.9 21.1C40.5 21.5 39.4 21.7 38.2 21.9C37 22.1 35.1 23.3 34.5 22.1C33.9 20.9 33.7 16.1 34.5 14.5Z"/>'
      + '<g class="wo" style="transform-origin:49.8px 11.1px"><path d="M49.8 11.1 C51.3 9.7 53.4 11.1 54.9 11.3C56.4 11.5 57.7 11.8 58.8 12.1C59.8 12.4 60.9 12.7 61.1 13.1C61.3 13.5 60.8 14.2 59.9 14.7C59 15.2 57.2 15.6 55.7 16.1C54.2 16.6 52.6 17.3 51 17.9C49.5 18.5 46.5 20.8 46.4 19.7C46.2 18.6 48.4 12.5 49.8 11.1Z"/>'
      + '</g></g><path d="M31.3 6 C31.8 6.2 32.6 6.9 32.8 7.5C33.1 8.1 32.7 8.9 32.9 9.7C33.1 10.5 33.6 11.2 34 12C34.4 12.9 35 13.7 35.3 14.7C35.7 15.8 36 16.9 36.3 18.1C36.5 19.2 36.6 20.5 36.7 21.7C36.8 22.9 36.8 24.2 36.7 25.3C36.6 26.4 36 27.3 36.2 28.3C36.3 29.3 37.1 30.4 37.6 31.4C38.1 32.5 38.6 33.6 39 34.7C39.4 35.8 39.8 37 40.1 38.1C40.3 39.1 40.5 40.3 40.6 41C40.6 41.8 42.8 42.1 40.4 42.5C38 42.9 28.6 43.5 26.2 43.5C23.8 43.4 25.9 42.8 25.8 42.1C25.8 41.3 25.8 40.1 25.9 39.1C26 38 26.2 36.8 26.5 35.6C26.7 34.5 27.1 33.3 27.4 32.1C27.7 31 28.4 29.9 28.4 28.9C28.4 27.8 27.7 27 27.5 25.9C27.2 24.8 27 23.5 26.9 22.3C26.8 21.2 26.8 19.9 26.9 18.7C27 17.6 27.1 16.4 27.3 15.3C27.6 14.3 28 13.3 28.2 12.4C28.5 11.5 29 10.7 29.1 10C29.2 9.2 28.7 8.4 28.8 7.8C29 7.1 29.7 6.4 30.1 6.1C30.5 5.8 30.9 5.8 31.3 6Z"/>'
      + '</svg>',
    /* שחף — כנפיים צרות ומחודדות עם מפרק כנף, גוף דק וזנב קצר */
    gull: '<svg viewBox="0 0 60 30" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
      + '<g class="wl"><path d="M27.4 14.6 C26.7 13.6 25.1 13.8 23.6 13.4C22.1 13 20.1 12.7 18.4 12.4C16.7 12.1 13.9 11.1 13.6 11.8C13.3 12.5 15.3 15.6 16.6 16.6C17.9 17.6 20.1 17.3 21.6 17.6C23.1 17.9 24.6 17.9 25.6 18.2C26.6 18.5 27.3 19.8 27.6 19.2C27.9 18.6 28.1 15.6 27.4 14.6Z"/>'
      + '<g class="wo" style="transform-origin:13.6px 11.8px"><path d="M13.6 11.8 C12.3 11 10.5 11.6 9 11.6C7.5 11.6 5.8 11.7 4.6 11.8C3.4 11.9 2.1 12 1.8 12.2C1.5 12.4 1.8 12.9 2.6 13.2C3.4 13.5 5.1 13.8 6.6 14.2C8.1 14.6 9.7 15 11.4 15.4C13.1 15.8 16.2 17.2 16.6 16.6C17 16 14.9 12.6 13.6 11.8Z"/>'
      + '</g></g><g class="wr"><path d="M32.5 14.2 C33.2 13.2 34.8 13.4 36.2 13C37.7 12.6 39.6 12.3 41.3 12C42.9 11.7 45.6 10.7 45.9 11.4C46.2 12.1 44.3 15.2 43 16.2C41.7 17.2 39.6 16.9 38.1 17.2C36.7 17.5 35.2 17.5 34.3 17.8C33.3 18.1 32.6 19.4 32.3 18.8C32 18.2 31.9 15.2 32.5 14.2Z"/>'
      + '<g class="wo" style="transform-origin:45.9px 11.4px"><path d="M45.9 11.4 C47.1 10.6 48.9 11.2 50.4 11.2C51.8 11.2 53.5 11.3 54.6 11.4C55.8 11.5 57 11.6 57.4 11.8C57.7 12 57.4 12.5 56.6 12.8C55.8 13.1 54.1 13.4 52.7 13.8C51.3 14.2 49.7 14.6 48 15C46.4 15.4 43.4 16.8 43 16.2C42.6 15.6 44.7 12.2 45.9 11.4Z"/>'
      + '</g></g><path d="M29.8 7 C30.2 7.2 30.8 7.8 31 8.3C31.2 8.9 30.9 9.6 31 10.3C31.2 11 31.6 11.7 31.9 12.5C32.1 13.2 32.5 14.2 32.7 15C32.8 15.9 32.9 16.8 32.9 17.6C33 18.4 32.9 19.2 32.8 20C32.7 20.8 32.4 21.5 32.4 22.2C32.3 23 32.4 23.8 32.4 24.4C32.4 25.1 32.5 25.6 32.4 26.1C32.3 26.5 32.1 27.3 31.9 27.3C31.7 27.3 31.3 26.4 31.1 26.2C31 26.1 31.3 26.2 31.1 26.2C31 26.3 30.3 26.3 30.1 26.3C30 26.3 30.2 26.1 30.1 26.3C30 26.5 29.7 27.5 29.5 27.5C29.3 27.5 29 26.8 28.8 26.3C28.7 25.8 28.7 25.3 28.6 24.7C28.5 24.1 28.5 23.3 28.4 22.5C28.2 21.8 27.8 21.1 27.6 20.4C27.4 19.6 27.2 18.8 27.1 18C27.1 17.2 27 16.3 27.1 15.4C27.1 14.5 27.3 13.6 27.5 12.8C27.6 12 28 11.2 28 10.5C28.1 9.8 27.7 9.1 27.8 8.5C27.9 8 28.5 7.3 28.8 7.1C29.1 6.8 29.4 6.8 29.8 7Z"/>'
      + '</svg>',
    /* סנונית — כנפיים חרמשיות נסוגות לאחור וזנב מפוצל עם שתי זנבות ארוכות */
    swallow: '<svg viewBox="0 0 64 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
      + '<g class="wl"><path d="M30.4 12.4 C29.6 12.2 27.1 12.1 25.6 12.2C24.1 12.3 22.7 12.5 21.2 12.8C19.7 13.1 16.9 13.3 16.6 14C16.3 14.7 18 16.9 19.2 17.2C20.4 17.5 22.2 16.1 23.6 15.6C25 15.1 26.2 14.7 27.4 14.4C28.6 14.1 30.1 13.9 30.6 13.6C31.1 13.3 31.2 12.6 30.4 12.4Z"/>'
      + '<g class="wo" style="transform-origin:16.6px 14px"><path d="M16.6 14 C15.4 13.7 13.5 15 12 15.6C10.5 16.2 8.8 16.8 7.4 17.4C6 18 4.4 18.9 3.4 19.4C2.4 19.9 1.5 20.2 1.4 20.6C1.3 21 1.8 21.7 2.6 21.8C3.4 21.9 4.9 21.5 6.2 21.2C7.5 20.9 9 20.6 10.4 20.2C11.8 19.8 13.3 19.3 14.8 18.8C16.3 18.3 18.9 18 19.2 17.2C19.5 16.4 17.8 14.3 16.6 14Z"/>'
      + '</g></g><g class="wr"><path d="M33.5 11.9 C34.3 11.7 36.7 11.6 38.1 11.7C39.6 11.8 40.9 12 42.4 12.3C43.8 12.6 46.5 12.8 46.8 13.5C47.1 14.2 45.4 16.4 44.3 16.7C43.2 17 41.4 15.6 40.1 15.1C38.8 14.6 37.5 14.2 36.4 13.9C35.3 13.6 33.8 13.4 33.3 13.1C32.9 12.8 32.7 12.1 33.5 11.9Z"/>'
      + '<g class="wo" style="transform-origin:46.8px 13.5px"><path d="M46.8 13.5 C47.9 13.2 49.7 14.5 51.2 15.1C52.7 15.7 54.2 16.3 55.6 16.9C57 17.5 58.5 18.4 59.5 18.9C60.4 19.4 61.2 19.7 61.4 20.1C61.5 20.5 61 21.2 60.2 21.3C59.5 21.4 58 21 56.8 20.7C55.5 20.4 54.1 20.1 52.7 19.7C51.4 19.3 49.9 18.8 48.5 18.3C47.1 17.8 44.6 17.5 44.3 16.7C44 15.9 45.6 13.8 46.8 13.5Z"/>'
      + '</g></g><path d="M31.3 6.6 C31.7 6.8 32.4 7.5 32.7 8.1C32.9 8.7 32.5 9.4 32.6 10.1C32.8 10.8 33.2 11.5 33.4 12.2C33.7 13 34 13.8 34.1 14.6C34.3 15.4 34.4 16.2 34.4 17C34.4 17.7 34.3 18.5 34.1 19.2C34 19.9 33.7 20.7 33.5 21.3C33.4 21.8 33.3 22 33.3 22.5C33.3 23 32.8 23.5 33.4 24.3C33.9 25.1 35.6 26.3 36.6 27.2C37.7 28.2 38.8 29.2 39.5 30C40.2 30.8 40.9 31.6 41 32.1C41.1 32.5 40.8 33 40.1 32.7C39.5 32.5 38.1 31.1 37.1 30.4C36.2 29.6 34.9 28.8 34.3 28.2C33.7 27.7 33.7 27.2 33.5 27.1C33.3 26.9 33.3 27.3 33.2 27.3C33.2 27.4 33.4 27.3 33.2 27.3C33 27.3 32.2 27.4 32 27.4C31.8 27.4 32.1 27.5 32 27.4C32 27.4 31.9 27.1 31.7 27.3C31.6 27.4 31.6 27.9 31.1 28.5C30.6 29.2 29.6 30.2 28.8 31.1C27.9 32 26.8 33.6 26.2 34C25.6 34.3 25.2 33.9 25.2 33.4C25.3 33 25.8 32.1 26.3 31.1C26.9 30.2 27.8 29 28.7 27.9C29.5 26.8 31 25.3 31.4 24.5C31.8 23.6 31.2 23.2 31.1 22.7C31 22.2 31 22 30.7 21.5C30.5 21 30 20.3 29.8 19.6C29.5 18.9 29.2 18.2 29.1 17.4C28.9 16.7 28.9 15.9 29 15C29 14.2 29.1 13.4 29.2 12.6C29.4 11.8 29.6 11.1 29.7 10.4C29.7 9.7 29.2 9 29.3 8.4C29.4 7.8 30 7 30.3 6.7C30.7 6.4 30.9 6.4 31.3 6.6Z"/>'
      + '</svg>',
    /* סיס — כנפיים חרמשיות צרות במיוחד וגוף טורפדו */
    swift: '<svg viewBox="0 0 64 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
      + '<g class="wl"><path d="M30.6 13.2 C29.7 12.7 27.1 13.2 25.4 13.2C23.7 13.2 22.1 13.3 20.4 13.4C18.7 13.5 15.5 13.3 15.4 14C15.3 14.7 18.5 16.8 20 17.4C21.5 18 23.1 17.8 24.4 17.8C25.7 17.8 26.7 17.9 27.8 17.6C28.9 17.3 30.3 16.7 30.8 16C31.3 15.3 31.5 13.7 30.6 13.2Z"/>'
      + '<g class="wo" style="transform-origin:15.4px 14px"><path d="M15.4 14 C13.8 13.6 12.1 14.5 10.6 14.8C9.1 15.1 7.5 15.4 6.2 15.8C4.9 16.2 3.8 16.7 3 17C2.2 17.3 1.6 17.4 1.6 17.8C1.6 18.2 2 19.1 2.8 19.2C3.6 19.3 5.3 18.7 6.6 18.4C7.9 18.1 9.3 17.8 10.8 17.6C12.3 17.4 13.9 17.2 15.4 17.2C16.9 17.2 20 17.9 20 17.4C20 16.9 17 14.4 15.4 14Z"/>'
      + '</g></g><g class="wr"><path d="M33.4 12.8 C34.2 12.3 36.7 12.8 38.4 12.8C40 12.8 41.6 12.9 43.2 13C44.8 13.1 48 12.9 48 13.6C48.1 14.3 45 16.4 43.6 17C42.1 17.6 40.6 17.4 39.3 17.4C38.1 17.4 37.1 17.5 36.1 17.2C35 16.9 33.6 16.3 33.2 15.6C32.7 14.9 32.5 13.3 33.4 12.8Z"/>'
      + '<g class="wo" style="transform-origin:48px 13.6px"><path d="M48 13.6 C49.5 13.2 51.2 14.1 52.7 14.4C54.1 14.7 55.7 15 56.9 15.4C58.1 15.8 59.2 16.3 60 16.6C60.7 16.9 61.3 17 61.3 17.4C61.4 17.8 61 18.7 60.2 18.8C59.4 18.9 57.8 18.3 56.5 18C55.2 17.7 53.9 17.4 52.5 17.2C51 17 49.5 16.8 48 16.8C46.5 16.8 43.6 17.5 43.6 17C43.6 16.5 46.5 14 48 13.6Z"/>'
      + '</g></g><path d="M32 7.6 C32.4 7.8 33.3 8.5 33.6 9.1C33.8 9.7 33.5 10.4 33.6 11.1C33.7 11.8 33.9 12.5 34.1 13.3C34.3 14 34.4 14.9 34.5 15.7C34.6 16.4 34.6 17.2 34.5 17.9C34.5 18.6 34.2 19.3 34 19.9C33.9 20.5 33.6 21.1 33.4 21.5C33.3 22 33 22 33.3 22.5C33.6 23.1 34.7 24 35.2 24.6C35.7 25.3 36.1 25.9 36.1 26.2C36.1 26.5 35.5 26.8 35.1 26.7C34.7 26.5 34 25.7 33.7 25.3C33.4 25 33.3 24.6 33.2 24.5C33.1 24.5 33 24.9 33 25C33 25 33.2 24.9 33 25C32.8 25 32 25 31.8 25C31.6 25 31.8 25.1 31.8 25C31.8 25 31.7 24.6 31.6 24.6C31.5 24.7 31.4 25.1 31.1 25.5C30.9 25.8 30.3 26.7 29.9 26.9C29.5 27.1 28.9 26.9 28.9 26.6C28.8 26.2 29.2 25.6 29.6 24.9C30 24.3 31 23.2 31.3 22.6C31.5 22.1 31.2 22.1 31 21.7C30.9 21.2 30.5 20.7 30.2 20.1C30 19.5 29.7 18.8 29.5 18.1C29.4 17.4 29.3 16.7 29.3 15.9C29.3 15.2 29.4 14.3 29.5 13.5C29.6 12.8 29.8 12 29.8 11.3C29.8 10.6 29.4 9.9 29.6 9.3C29.8 8.7 30.6 7.9 31 7.6C31.4 7.4 31.6 7.3 32 7.6Z"/>'
      + '</svg>',
    /* להקה רחוקה — קווי תעופה דקים בשמיים, כל ציפור בזווית מעט אחרת */
    flock: '<svg viewBox="0 0 72 28" fill="none" xmlns="http://www.w3.org/2000/svg">'
      + '<path class="fl1" d="M2.5 17.8c2.6-4.4 6.4-4.6 9.6-.4" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" fill="none"/>'
      + '<path class="fl2" d="M19.5 9.2c2.9-4.8 7.1-5 10.7-.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/>'
      + '<path class="fl3" d="M38.2 19.4c2.5-4.2 6.2-4.4 9.3-.3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" fill="none"/>'
      + '<path class="fl4" d="M55.2 11.2c2.9-4.8 7.1-5 10.7-.5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" fill="none"/>'
      + '</svg>',
    /* צל שחף גולש — כנפיים ארוכות ומחודדות עם מפרק כנף, ראש מוגדר, גוף דק וזנב קצר */
    shadow: '<svg viewBox="0 0 110 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
      + '<g class="wl"><path d="M52 24.6 C50.5 22.9 45.9 23.3 43 22.6C40.1 21.9 37.3 21.1 34.6 20.6C31.9 20.1 27.9 18.3 27 19.4C26.1 20.5 27.6 25.5 29.2 27C30.8 28.5 34.2 28 36.6 28.6C39 29.2 41.2 29.7 43.8 30.4C46.4 31.1 50.6 33.6 52 32.6C53.4 31.6 53.5 26.3 52 24.6Z"/>'
      + '<g class="wo" style="transform-origin:27px 19.4px"><path d="M27 19.4 C25.6 18.1 23.2 19 21 19C18.8 19 16.3 19.1 14 19.2C11.7 19.3 8.8 19.6 7 19.8C5.2 20 3.8 20.1 3.4 20.4C3 20.7 3.3 21.4 4.4 21.8C5.5 22.2 7.9 22.6 9.8 23C11.7 23.4 13.7 23.9 15.8 24.4C17.9 24.9 20 25.4 22.2 25.8C24.4 26.2 28.4 28.1 29.2 27C30 25.9 28.4 20.7 27 19.4Z"/>'
      + '</g></g><g class="wr"><path d="M57.9 23.9 C59.3 22.2 63.8 22.6 66.6 21.9C69.4 21.2 72.1 20.4 74.7 19.9C77.3 19.4 81.2 17.6 82 18.7C82.9 19.8 81.4 24.8 79.9 26.3C78.4 27.8 75.1 27.3 72.8 27.9C70.4 28.5 68.3 29 65.8 29.7C63.3 30.4 59.2 32.9 57.9 31.9C56.6 30.9 56.4 25.6 57.9 23.9Z"/>'
      + '<g class="wo" style="transform-origin:82px 18.7px"><path d="M82 18.7 C83.3 17.4 85.7 18.3 87.8 18.3C89.9 18.3 92.3 18.4 94.6 18.5C96.8 18.6 99.6 18.9 101.3 19.1C103 19.3 104.4 19.4 104.8 19.7C105.2 20 104.9 20.7 103.8 21.1C102.8 21.5 100.5 21.9 98.6 22.3C96.8 22.7 94.8 23.2 92.8 23.7C90.8 24.2 88.8 24.7 86.7 25.1C84.5 25.5 80.7 27.4 79.9 26.3C79.1 25.2 80.7 20 82 18.7Z"/>'
      + '</g></g><path d="M54.3 9.6 C54.8 9.8 55.5 10.4 55.8 11.1C56.1 11.7 55.7 12.6 55.9 13.5C56.1 14.4 56.6 15.4 57 16.4C57.4 17.5 57.8 18.6 58.2 19.8C58.6 20.9 59 21.9 59.3 23.1C59.5 24.2 59.7 25.4 59.8 26.7C59.9 27.9 59.8 29.3 59.7 30.7C59.6 32 59.4 33.4 59.3 34.7C59.1 36 58.9 37.2 58.7 38.4C58.6 39.5 58.4 40.7 58.4 41.8C58.4 42.9 58.6 43.9 58.7 44.8C58.7 45.6 58.9 46.2 58.7 47C58.6 47.8 58.1 49.3 57.8 49.5C57.5 49.6 56.9 48.1 56.8 47.8C56.6 47.5 56.9 47.8 56.8 47.8C56.6 47.8 55.9 47.9 55.8 47.9C55.6 47.9 55.9 47.6 55.8 47.9C55.6 48.2 55.3 49.7 55 49.6C54.7 49.6 54 48.1 53.7 47.3C53.5 46.6 53.5 46 53.5 45.1C53.4 44.3 53.5 43.2 53.4 42.1C53.2 41.1 52.8 39.9 52.5 38.8C52.2 37.6 51.8 36.5 51.5 35.3C51.1 34 50.8 32.6 50.5 31.3C50.2 30 49.9 28.6 49.8 27.4C49.7 26.1 49.8 24.9 49.9 23.7C50 22.6 50.2 21.4 50.4 20.3C50.7 19.1 51 17.9 51.2 16.8C51.4 15.7 51.8 14.7 51.9 13.8C52 12.9 51.5 12.1 51.6 11.4C51.8 10.7 52.5 10 52.9 9.7C53.4 9.4 53.8 9.4 54.3 9.6Z"/>'
      + '</svg>',
    /* צל שחף בהרמת כנפיים — תנופת נופף טבעית בגודל בינוני */
    "shadow-md": '<svg viewBox="0 0 110 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
      + '<g class="wl"><path d="M52 25.4 C50.6 23.9 46.2 23.5 43.6 22.4C41 21.3 38.7 19.8 36.4 18.6C34.1 17.4 30.4 14.8 29.6 15.2C28.8 15.6 30.1 19.4 31.8 21.2C33.5 23 37.5 24.6 40 26C42.5 27.4 44.6 28.5 46.6 29.4C48.6 30.3 51.1 32.3 52 31.6C52.9 30.9 53.4 26.9 52 25.4Z"/>'
      + '<g class="wo" style="transform-origin:29.6px 15.2px"><path d="M29.6 15.2 C28.2 13.7 25.5 13 23.4 12C21.3 11 19.2 9.9 17 9C14.8 8.1 12.4 7.3 10.4 6.6C8.4 5.9 5.5 4.9 4.8 5C4.1 5.1 5.2 6.2 6.4 7C7.6 7.8 10 8.8 12 9.8C14 10.8 16.2 12 18.4 13.2C20.6 14.4 22.8 15.7 25 17C27.2 18.3 31 21.5 31.8 21.2C32.6 20.9 31 16.7 29.6 15.2Z"/>'
      + '</g></g><g class="wr"><path d="M57.9 24.8 C59.3 23.3 63.5 22.9 66.1 21.8C68.6 20.7 70.8 19.2 73 18C75.3 16.8 78.9 14.2 79.6 14.6C80.4 15 79.2 18.8 77.5 20.6C75.8 22.4 71.9 24 69.5 25.4C67.2 26.8 65.1 27.9 63.1 28.8C61.2 29.7 58.8 31.7 57.9 31C57 30.3 56.6 26.3 57.9 24.8Z"/>'
      + '<g class="wo" style="transform-origin:79.6px 14.6px"><path d="M79.6 14.6 C81 13.1 83.6 12.4 85.7 11.4C87.7 10.4 89.8 9.3 91.9 8.4C94 7.5 96.3 6.7 98.3 6C100.2 5.3 103 4.3 103.7 4.4C104.3 4.5 103.3 5.6 102.1 6.4C101 7.2 98.7 8.2 96.7 9.2C94.8 10.2 92.6 11.4 90.5 12.6C88.4 13.8 86.3 15.1 84.1 16.4C81.9 17.7 78.2 20.9 77.5 20.6C76.8 20.3 78.3 16.1 79.6 14.6Z"/>'
      + '</g></g><path d="M54 9.6 C54.4 9.8 55.2 10.4 55.5 11.1C55.8 11.7 55.4 12.6 55.6 13.5C55.8 14.4 56.3 15.4 56.8 16.4C57.2 17.4 57.7 18.6 58 19.7C58.4 20.8 58.9 21.9 59.1 23C59.4 24.2 59.7 25.3 59.8 26.6C59.8 27.8 59.8 29.2 59.7 30.6C59.6 31.9 59.5 33.4 59.4 34.6C59.2 35.9 59 37.1 58.9 38.3C58.7 39.5 58.6 40.7 58.6 41.7C58.6 42.8 58.9 43.9 58.9 44.7C59 45.6 59.2 46.1 59 46.9C58.9 47.7 58.5 49.3 58.1 49.4C57.8 49.5 57.3 48.1 57.1 47.8C56.9 47.5 57.3 47.8 57.1 47.8C56.9 47.8 56.3 47.9 56.1 47.9C55.9 47.9 56.2 47.6 56.1 47.9C56 48.2 55.7 49.7 55.3 49.6C55 49.6 54.3 48.1 54 47.4C53.8 46.6 53.8 46 53.8 45.2C53.7 44.3 53.8 43.2 53.6 42.2C53.4 41.1 53 40 52.7 38.8C52.4 37.7 51.9 36.6 51.6 35.3C51.2 34.1 50.8 32.7 50.5 31.4C50.2 30.1 49.9 28.7 49.8 27.4C49.7 26.2 49.7 25 49.8 23.8C49.9 22.7 50.1 21.5 50.3 20.4C50.5 19.2 50.8 18 51 16.9C51.2 15.8 51.6 14.7 51.6 13.8C51.7 12.9 51.1 12.1 51.3 11.5C51.5 10.8 52.1 10 52.6 9.7C53 9.4 53.5 9.4 54 9.6Z"/>'
      + '</svg>',
    /* צל שחף בנטייה עדינה (בנק) — כנף אחת גבוהה מהשנייה, כמו ציפור רחוקה */
    "shadow-sm": '<svg viewBox="0 0 110 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
      + '<g class="wl"><path d="M50.6 25 C49.2 23.7 45.9 25.4 43.6 25.6C41.3 25.8 38.9 26.1 36.6 26.4C34.3 26.7 31.2 25.9 30 27.2C28.8 28.5 28.3 32.7 29.4 34C30.5 35.3 34 34.8 36.6 35C39.2 35.2 42.2 35.5 44.8 35.2C47.4 34.9 51 35.1 52 33.4C53 31.7 52 26.3 50.6 25Z"/>'
      + '<g class="wo" style="transform-origin:30px 27.2px"><path d="M30 27.2 C29 26.2 25.8 27.7 23.6 27.8C21.4 27.9 18.9 28 16.6 28C14.3 28 11.6 27.9 9.6 27.8C7.6 27.7 5.3 27.2 4.6 27.4C3.9 27.6 4.6 28.5 5.6 29C6.6 29.5 8.8 30 10.6 30.4C12.4 30.8 14.4 31.2 16.4 31.6C18.4 32 20.4 32.4 22.6 32.8C24.8 33.2 28.2 34.9 29.4 34C30.6 33.1 31 28.2 30 27.2Z"/>'
      + '</g></g><g class="wr"><path d="M59.4 24.6 C60.8 23.2 64 23.6 66.4 23C68.8 22.4 71.2 21.6 73.6 20.8C76 20 79.9 17.8 80.6 18.2C81.3 18.6 79.4 21.6 77.6 23C75.8 24.4 72.3 25.5 70 26.6C67.7 27.7 65.6 28.8 63.6 29.6C61.6 30.4 58.7 32.2 58 31.4C57.3 30.6 58 26 59.4 24.6Z"/>'
      + '<g class="wo" style="transform-origin:80.6px 18.2px"><path d="M80.6 18.2 C82.2 17 85.1 16.5 87.4 15.6C89.7 14.7 92.2 13.8 94.4 13C96.6 12.2 98.7 11.6 100.6 11C102.5 10.4 105 9.5 105.6 9.6C106.2 9.7 105.6 10.7 104.4 11.4C103.2 12.1 100.7 12.8 98.6 13.6C96.5 14.4 94.3 15.4 92 16.4C89.7 17.4 87.4 18.5 85 19.6C82.6 20.7 78.3 23.2 77.6 23C76.9 22.8 79 19.4 80.6 18.2Z"/>'
      + '</g></g><path d="M54.3 9.6 C54.8 9.8 55.5 10.4 55.8 11.1C56.1 11.7 55.7 12.6 55.9 13.5C56.1 14.4 56.6 15.4 57 16.4C57.4 17.5 57.8 18.6 58.2 19.8C58.6 20.9 59 21.9 59.3 23.1C59.5 24.2 59.7 25.4 59.8 26.7C59.9 27.9 59.8 29.3 59.7 30.7C59.6 32 59.4 33.4 59.3 34.7C59.1 36 58.9 37.2 58.7 38.4C58.6 39.5 58.4 40.7 58.4 41.8C58.4 42.9 58.6 43.9 58.7 44.8C58.7 45.6 58.9 46.2 58.7 47C58.6 47.8 58.1 49.3 57.8 49.5C57.5 49.6 56.9 48.1 56.8 47.8C56.6 47.5 56.9 47.8 56.8 47.8C56.6 47.8 55.9 47.9 55.8 47.9C55.6 47.9 55.9 47.6 55.8 47.9C55.6 48.2 55.3 49.7 55 49.6C54.7 49.6 54 48.1 53.7 47.3C53.5 46.6 53.5 46 53.5 45.1C53.4 44.3 53.5 43.2 53.4 42.1C53.2 41.1 52.8 39.9 52.5 38.8C52.2 37.6 51.8 36.5 51.5 35.3C51.1 34 50.8 32.6 50.5 31.3C50.2 30 49.9 28.6 49.8 27.4C49.7 26.1 49.8 24.9 49.9 23.7C50 22.6 50.2 21.4 50.4 20.3C50.7 19.1 51 17.9 51.2 16.8C51.4 15.7 51.8 14.7 51.9 13.8C52 12.9 51.5 12.1 51.6 11.4C51.8 10.7 52.5 10 52.9 9.7C53.4 9.4 53.8 9.4 54.3 9.6Z"/>'
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
      /* גדלים שונים לאורך האתר, עם שינוי קטן בין מסך למסך */
      var size = c.size * (0.93 + Math.random() * 0.14);
      item.style.width = Math.round((SKY_W[c.s] || 64) * size) + "px";
      item.style.setProperty("--tint", c.tint);
      item.style.setProperty("--o", c.o);
      item.style.setProperty("--path", c.flow === -1 ? (SKY_BACK[c.p] || c.p) : c.p);
      item.style.setProperty("--dur", c.dur + "s");
      /* היסט אקראי קטן — כדי שאותה תוכנית תעופה לא תיראה זהה בשני אזורים */
      item.style.setProperty("--delay", (c.delay - Math.random() * 55).toFixed(1) + "s");
      item.style.setProperty("--size", size.toFixed(3));
      item.style.setProperty("--flow", c.flow || 1);
      item.style.setProperty("--dir", c.dir || c.flow || 1);
      /* קצב נופף: לצללים הגדולים איטי במיוחד, ולציפורים הקטנות עדין */
      var isShadow = c.s.indexOf("shadow") === 0;
      var flap = c.flap || (isShadow ? 7.5 + Math.random() * 3 : 4.6 + Math.random() * 2.6);
      item.style.setProperty("--flap", flap.toFixed(2) + "s");
      /* הגוף עצמו עולה ויורד באוויר, בקצב של תנועת הכנפיים */
      item.style.setProperty("--bob", flap.toFixed(2) + "s");
      if (c.ease) item.style.setProperty("--ease", c.ease);
      /* עטיפה שמניעה את הגוף והכנפיים ולא רק מזיזה את הציפור מצד לצד */
      item.innerHTML = '<div class="sky-bob">' + SKY_ART[c.s] + "</div>";
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
