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

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
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

  /* ---------- Decorative birds ---------- */
  var BIRD = '<svg viewBox="0 0 64 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 26C10 14 20 8 32 10c10 1.6 16 8 30 4-8 8-18 12-28 10C22 32 10 30 2 26Z" fill="currentColor"/></svg>';
  function addBirds(host) {
    if (!host || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var configs = [
      { top: "12%", color: "#8f9fe0", dur: 34, delay: 0, scale: 0.7, flip: false },
      { top: "26%", color: "#d9a3cf", dur: 44, delay: -14, scale: 0.5, flip: true },
      { top: "64%", color: "#a8c39f", dur: 52, delay: -30, scale: 0.42, flip: false }
    ];
    configs.forEach(function (c) {
      var b = document.createElement("div");
      b.className = "bird" + (c.flip ? " flip" : "");
      b.style.top = c.top;
      b.style.color = c.color;
      b.style.setProperty("--dur", c.dur + "s");
      b.style.setProperty("--delay", c.delay + "s");
      b.style.setProperty("--scale", c.scale);
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
      p.style.setProperty("--dur", (16 + Math.random() * 14) + "s");
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

  /* ---------- Formspree AJAX ---------- */
  var FORM_ACTION = "https://formspree.io/f/xkjgppkz"; // כתובת הטופס ב-Formspree (מחובר)

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

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (FORM_ACTION.indexOf("YOUR_FORM_ID") !== -1) {
        show("err", "טופס ההרשמה יפעל ברגע שכתובת ה-Formspree תוגדר (הנוהל בקובץ README).");
        return;
      }
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
            show("err", (data && data.errors && data.errors[0] && data.errors[0].message) || "השליחה לא הצליחה. אפשר לנסות שוב או ליצור קשר בוואטסאפ.");
          });
        }
      }).catch(function () {
        show("err", "שגיאת רשת — נסי שוב בעוד רגע.");
      }).finally(function () {
        if (btn) { btn.disabled = false; btn.textContent = btnText; }
      });
    });
  });
})();
