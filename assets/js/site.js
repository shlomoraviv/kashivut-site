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
    /* יונה מפורטת */
    dove: '<svg viewBox="0 0 64 44" fill="none" xmlns="http://www.w3.org/2000/svg">'
      + '<path class="wl" d="M31 22C22 6 8 4 2 10c-4 5 2 16 14 22 6 3 12 3 15 1Z" fill="currentColor" opacity=".5"/>'
      + '<path class="wr" d="M33 22C42 6 56 4 62 10c4 5-2 16-14 22-6 3-12 3-15 1Z" fill="currentColor" opacity=".5"/>'
      + '<path class="wl" d="M31 30c-7 4-15 5-20 2-4-3-2-8 3-9 6-1 13 3 17 7Z" fill="currentColor" opacity=".32"/>'
      + '<path class="wr" d="M33 30c7 4 15 5 20 2 4-3 2-8-3-9-6-1-13 3-17 7Z" fill="currentColor" opacity=".32"/>'
      + '<ellipse cx="32" cy="26" rx="2.6" ry="9.5" fill="currentColor" opacity=".85"/>'
      + '<circle cx="30.8" cy="16.5" r="2" fill="currentColor"/>'
      + '<path d="M29.6 14.5C27 12 24 11 21.5 11.5M34.4 14.5C37 12 40 11 42.5 11.5" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" opacity=".7"/>'
      + '</svg>',
    /* שחף — כנפיים ארוכות וגוף דק */
    gull: '<svg viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg">'
      + '<path class="wl" d="M29 14C21 4 11 1 1 5c9 1 16 5 24 12Z" fill="currentColor" opacity=".9"/>'
      + '<path class="wr" d="M31 14C39 4 49 1 59 5c-9 1-16 5-24 12Z" fill="currentColor" opacity=".9"/>'
      + '<ellipse cx="30" cy="17" rx="2.2" ry="6" fill="currentColor"/>'
      + '<path d="M30 21c-1 4-1 7 0 9 1-2 1-5 0-9Z" fill="currentColor"/>'
      + '</svg>',
    /* סנונית — כנפיים מחודדות וזנב מפוצל */
    swallow: '<svg viewBox="0 0 64 36" fill="none" xmlns="http://www.w3.org/2000/svg">'
      + '<path class="wl" d="M31 12C24 3 12 -1 1 4c10 2 18 6 25 14Z" fill="currentColor" opacity=".9"/>'
      + '<path class="wr" d="M33 12C40 3 52 -1 63 4c-10 2-18 6-25 14Z" fill="currentColor" opacity=".9"/>'
      + '<ellipse cx="32" cy="16" rx="2" ry="6.5" fill="currentColor"/>'
      + '<path d="M32 22c-1 4-3 8-8 11 5-1 7-3 8-6 1 3 3 5 8 6-5-3-7-7-8-11Z" fill="currentColor"/>'
      + '</svg>',
    /* סיס — כנפיים צרות ומגלשות */
    swift: '<svg viewBox="0 0 64 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
      + '<path class="wl" d="M32 14C26 7 16 3 3 5c10 2 19 5 26 11Z" fill="currentColor" opacity=".85"/>'
      + '<path class="wr" d="M32 14C38 7 48 3 61 5c-10 2-19 5-26 11Z" fill="currentColor" opacity=".85"/>'
      + '<ellipse cx="32" cy="17" rx="1.9" ry="8" fill="currentColor"/>'
      + '</svg>',
    /* להקה רחוקה — קווי תעופה דקים בשמיים */
    flock: '<svg viewBox="0 0 72 28" fill="none" xmlns="http://www.w3.org/2000/svg">'
      + '<path d="M2 17c3-5 7-5 10 0M19 9c3-5 7-5 10 0M38 19c3-4 6-4 9 0M55 11c3-4 6-4 9 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>'
      + '</svg>',
    /* צל ציפור גדול — סילואט של ציפור במעוף: כנפיים מחודדות נסוגות לאחור, גוף דק, ראש וזנב מפוצל */
    shadow: '<svg viewBox="0 0 84 48" fill="none" xmlns="http://www.w3.org/2000/svg">'
      + '<path class="wl" d="M40 19C30 11 14 5 3 5c13 4 23 11 31 17Z" fill="currentColor"/>'
      + '<path class="wr" d="M44 19C54 11 70 5 81 5C68 9 58 16 50 22Z" fill="currentColor"/>'
      + '<path d="M42 10.5c2.8 0 4.4 3.6 4.4 10.5v9.5c0 5.6-1.8 9-4.4 9s-4.4-3.4-4.4-9V21c0-6.9 1.6-10.5 4.4-10.5Z" fill="currentColor"/>'
      + '<path d="M42 30 36 46l6-5 6 5Z" fill="currentColor"/>'
      + '<circle cx="42" cy="8.6" r="4" fill="currentColor"/>'
      + '</svg>',
    /* צל ציפור קטן — אותו סילואט בגרסה קטנה לרקע רחוק */
    "shadow-sm": '<svg viewBox="0 0 84 48" fill="none" xmlns="http://www.w3.org/2000/svg">'
      + '<path class="wl" d="M40 19C30 11 14 5 3 5c13 4 23 11 31 17Z" fill="currentColor"/>'
      + '<path class="wr" d="M44 19C54 11 70 5 81 5C68 9 58 16 50 22Z" fill="currentColor"/>'
      + '<path d="M42 10.5c2.8 0 4.4 3.6 4.4 10.5v9.5c0 5.6-1.8 9-4.4 9s-4.4-3.4-4.4-9V21c0-6.9 1.6-10.5 4.4-10.5Z" fill="currentColor"/>'
      + '<path d="M42 30 36 46l6-5 6 5Z" fill="currentColor"/>'
      + '<circle cx="42" cy="8.6" r="4" fill="currentColor"/>'
      + '</svg>',
    /* צל ציפור בינוני — אותו סילואט בגודל בינוני */
    "shadow-md": '<svg viewBox="0 0 84 48" fill="none" xmlns="http://www.w3.org/2000/svg">'
      + '<path class="wl" d="M40 19C30 11 14 5 3 5c13 4 23 11 31 17Z" fill="currentColor"/>'
      + '<path class="wr" d="M44 19C54 11 70 5 81 5C68 9 58 16 50 22Z" fill="currentColor"/>'
      + '<path d="M42 10.5c2.8 0 4.4 3.6 4.4 10.5v9.5c0 5.6-1.8 9-4.4 9s-4.4-3.4-4.4-9V21c0-6.9 1.6-10.5 4.4-10.5Z" fill="currentColor"/>'
      + '<path d="M42 30 36 46l6-5 6 5Z" fill="currentColor"/>'
      + '<circle cx="42" cy="8.6" r="4" fill="currentColor"/>'
      + '</svg>'
  };
  /* רוחב הבסיס של כל דמות (בפיקסלים) — צל הציפור מגיע בשלושה גדלים: גדול, בינוני, קטן */
  var SKY_W = { dove: 64, gull: 60, swallow: 64, swift: 64, flock: 72, shadow: 76, "shadow-md": 60, "shadow-sm": 42 };
  /* לכל מסלול יש גרסת מראה לתנועה מימין לשמאל */
  var SKY_BACK = { fly: "flyBack", glide: "glideBack" };

  /* תוכניות תעופה — כל אזור מקבל שילוב אחר של דמויות, צבעים, גדלים ומסלולים */
  var SKY_PRESETS = {
    /* מסך הכניסה: צל גדול חוצה את הנוף, שחף רחוק וצל קטן קרוב */
    hero: [
      { s: "shadow", p: "glide", top: "10%", size: 1.3, o: .22, tint: "#17205c", dur: 112, delay: -12, flow: 1 },
      { s: "shadow-md", p: "glide", top: "44%", size: 1.15, o: .17, tint: "#17205c", dur: 196, delay: -58, flow: 1 },
      { s: "gull", p: "fly", top: "30%", size: .62, o: .5, tint: "#8f9fe0", dur: 76, delay: -30, flow: -1 },
      { s: "shadow-sm", p: "glide", top: "78%", size: .62, o: .2, tint: "#1e2a6e", dur: 172, delay: -18, flow: 1 }
    ],
    /* זוג: סנונית וצל ציפור קטן */
    pair: [
      { s: "swallow", p: "fly", top: "24%", size: .55, o: .48, tint: "#8f9fe0", dur: 70, delay: -8, flow: 1 },
      { s: "shadow-sm", p: "glide", top: "70%", size: .58, o: .2, tint: "#1e2a6e", dur: 158, delay: -34, flow: -1 }
    ],
    /* שני צללי ציפורים: גדול שחוצה את המסך, וקטן שגולש לאט */
    drift: [
      { s: "shadow-md", p: "glide", top: "30%", size: .72, o: .18, tint: "#17205c", dur: 176, delay: -20, flow: -1 },
      { s: "shadow-sm", p: "glide", top: "66%", size: .5, o: .2, tint: "#1e2a6e", dur: 150, delay: -6, flow: 1 }
    ],
    /* שמיים שקטים: להקה רחוקה בלבד */
    calm: [
      { s: "flock", p: "fly", top: "20%", size: .9, o: .38, tint: "#8f9fe0", dur: 122, delay: -40, flow: 1 }
    ],
    /* דמדומים: צל ציפור וסיס גבוה */
    dusk: [
      { s: "shadow", p: "glide", top: "22%", size: .95, o: .18, tint: "#17205c", dur: 130, delay: -64, flow: -1 },
      { s: "swift", p: "soar", top: "52%", size: .45, o: .4, tint: "#b9a7e6", dur: 92, delay: -24, flow: 1 }
    ],
    /* צללי ציפורים — צללים קטנים וקצת גדולים שמפוזרים לאורך העמוד */
    shadows: [
      { s: "shadow-md", p: "glide", top: "12%", size: 1.05, o: .16, tint: "#17205c", dur: 152, delay: -8, flow: 1 },
      { s: "shadow-sm", p: "glide", top: "34%", size: .7, o: .21, tint: "#1e2a6e", dur: 128, delay: -58, flow: -1 },
      { s: "shadow", p: "glide", top: "62%", size: .9, o: .15, tint: "#17205c", dur: 178, delay: -102, flow: -1 },
      { s: "shadow-sm", p: "glide", top: "84%", size: .6, o: .23, tint: "#1e2a6e", dur: 116, delay: -24, flow: 1 },
      { s: "shadow-md", p: "glide", top: "46%", size: 1, o: .19, tint: "#17205c", dur: 188, delay: -64, flow: 1 }
    ],
    /* מנה קטנה: צל גדול אחד וצל קטן אחד */
    "shadows-few": [
      { s: "shadow", p: "glide", top: "24%", size: 1.1, o: .16, tint: "#17205c", dur: 168, delay: -34, flow: 1 },
      { s: "shadow-sm", p: "glide", top: "72%", size: .68, o: .22, tint: "#1e2a6e", dur: 124, delay: -76, flow: -1 },
      { s: "shadow-md", p: "glide", top: "48%", size: .92, o: .18, tint: "#1e2a6e", dur: 174, delay: -98, flow: -1 }
    ],
    soft: [
      { s: "dove", p: "fly", top: "26%", size: .6, o: .45, tint: "#8f9fe0", dur: 82, delay: -16, flow: -1 },
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
      item.style.setProperty("--flap", (c.flap || (2.6 + Math.random() * 2.4)).toFixed(2) + "s");
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
