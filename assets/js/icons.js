/**
 * אייקונים מודרניים לאתר קשיבות — קו עדין, סגנון אחיד.
 * data-ico="שם" נחלף אוטומטית ב-SVG תואם currentColor.
 */
(function () {
  "use strict";

  /* עלה קטן */
  var LEAF = '<path d="M4 20C4 11 10 5 20 5c0 9-6 15-15 15H4Z"/><path d="M6.5 17.5C10 14 13 11 17 7.5"/>';

  /* פרח בעל 5 עלי כותרת */
  var FLOWER = '<circle cx="12" cy="12" r="2.6"/><path d="M12 9.4c-.4-2.9.8-4.9 2.4-4.9s2.4 2 1.6 4.3M14.6 10.8c2.5-1.6 4.8-1.3 5.6.2.8 1.5-.8 3.2-3.2 3.4M13.5 14.2c1.9 2.3 1.8 4.6.3 5.4-1.5.8-3.3-.6-3.7-3M10.2 13.5c-2.4 1.7-4.7 1.5-5.5 0-.8-1.5.7-3.3 3.1-3.5M9.7 10.2C8.9 7.9 9.7 5.9 11.2 5.6"/>';
  var FLOWER_SOLID = '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="5.5" r="2.6"/><circle cx="18" cy="10" r="2.6"/><circle cx="15.7" cy="17" r="2.6"/><circle cx="8.3" cy="17" r="2.6"/><circle cx="6" cy="10" r="2.6"/>';

  /* בית חם */
  var HOME = '<path d="M4 11.5 12 4.5l8 7"/><path d="M6 10v9.5h12V10"/><path d="M10 19.5v-5h4v5"/>';

  /* כובע סמכות */
  var GRAD = '<path d="M2.5 9 12 4.5 21.5 9 12 13.5 2.5 9Z"/><path d="M6.5 11v4.6c0 1.3 2.5 2.6 5.5 2.6s5.5-1.3 5.5-2.6V11"/><path d="M21.5 9v5"/>';

  /* לב עדין */
  var HEART = '<path d="M12 19.8s-7.2-4.4-8.8-9C2.1 7.6 4 4.9 6.9 4.9c2 0 3.6 1.1 5.1 3.1 1.5-2 3.1-3.1 5.1-3.1 2.9 0 4.8 2.7 3.7 5.9-1.6 4.6-8.8 9-8.8 9Z"/>';

  /* ידיים מחזיקות לב — תמיכה */
  var HANDS = '<path d="M12 8.2c-1.4-2-4.6-1.7-5.3.6-.5 1.8 1.3 3.6 5.3 6.4 4-2.8 5.8-4.6 5.3-6.4-.7-2.3-3.9-2.6-5.3-.6Z"/><path d="M4 19.5c2.2-.6 4.4-2 6-3.6M20 19.5c-2.2-.6-4.4-2-6-3.6"/>';

  /* ציפור */
  var BIRD = '<path d="M4 15c3-6 7-9 12-9 2.5 0 4-1 5-2-.2 5.5-3 9.5-8 10.5l2.5 4h-3L11 15c-2 1.5-4.5 1.6-7 0Z"/><circle cx="16.6" cy="7.6" r=".6" fill="currentColor"/>';

  /* ענן */
  var CLOUD = '<path d="M7 18.5a4 4 0 0 1-.6-7.9 5.5 5.5 0 0 1 10.7-1.4A4.3 4.3 0 0 1 17 18.5H7Z"/>';

  /* שמש */
  var SUN = '<circle cx="12" cy="12" r="4"/><path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6"/>';

  /* ענן-שמש */
  var CLOUD_SUN = '<path d="M7.5 18.5a3.5 3.5 0 0 1-.5-7 5 5 0 0 1 9.7-1.2 3.8 3.8 0 0 1 .6 7.5"/><path d="M9 5.5V4M5.2 7.2 4.2 6.2M5 11H3.5"/>';

  /* שיחה */
  var CHAT = '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4A2.5 2.5 0 0 1 4 13.5v-7Z"/><path d="M8 9.5h8M8 12.5h5"/>';

  /* מכשיר טלפון */
  var PHONE = '<path d="M7.5 3.5h3l1.2 4.2-2 1.5a12 12 0 0 0 5.1 5.1l1.5-2 4.2 1.2v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 5.5 5.7a2 2 0 0 1 2-2.2Z"/>';

  /* מעטפה */
  var MAIL = '<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="m4.5 7.5 7.5 5.5 7.5-5.5"/>';

  /* פלוס-עיגול */
  var PLUS = '<circle cx="12" cy="12" r="8.5"/><path d="M12 8.5v7M8.5 12h7"/>';

  /* בדיקה/וי */
  var CHECK = '<circle cx="12" cy="12" r="8.5"/><path d="m8.5 12.2 2.4 2.4 4.8-5"/>';

  /* כוכב נצנוץ */
  var SPARK = '<path d="M12 3.5c.6 4.4 2.6 6.4 7 7-4.4.6-6.4 2.6-7 7-.6-4.4-2.6-6.4-7-7 4.4-.6 6.4-2.6 7-7Z"/>';

  /* טיפת מים/רוגע */
  var DROP = '<path d="M12 3.8c3.2 3.7 5.5 6.9 5.5 9.9a5.5 5.5 0 0 1-11 0c0-3 2.3-6.2 5.5-9.9Z"/>';

  /* ענף/המשך דרך */
  var BRANCH = '<path d="M12 20V9"/><path d="M12 9C12 6 10 4.5 7 4.5M12 9c0-3 2-4.5 5-4.5"/><path d="M7 4.5a1.5 1.5 0 1 0-.01 0ZM17 4.5a1.5 1.5 0 1 0-.01 0Z"/><circle cx="12" cy="20" r="1.6"/>';

  /* לולאה/התמדה */
  var LOOP = '<path d="M4.5 12a7.5 7.5 0 0 1 13-5.2L19.5 9M19.5 12a7.5 7.5 0 0 1-13 5.2L4.5 15"/><path d="M19.5 4.5V9H15M4.5 19.5V15H9"/>';

  /* שקט/עלה על יד */
  var CALM = '<path d="M3.5 12a8.5 8.5 0 1 0 17 0 8.5 8.5 0 0 0-17 0Z" opacity="0"/><path d="M3 14c2.5-1.5 5-1.5 7.5 0 2.5 1.5 5 1.5 7.5 0 1.2-.7 2.3-1 3.5-.9"/><path d="M3 10c2.5-1.5 5-1.5 7.5 0 2.5 1.5 5 1.5 7.5 0 1.2-.7 2.3-1 3.5-.9" opacity=".55"/>';

  var MAP = {
    leaf: LEAF, flower: FLOWER, flowerSolid: FLOWER_SOLID, home: HOME, grad: GRAD,
    heart: HEART, hands: HANDS, bird: BIRD, cloud: CLOUD, sun: SUN, cloudSun: CLOUD_SUN,
    chat: CHAT, phone: PHONE, mail: MAIL, plus: PLUS, check: CHECK, spark: SPARK,
    drop: DROP, branch: BRANCH, loop: LOOP, calm: CALM
  };

  function svg(name) {
    var body = MAP[name];
    if (!body) return null;
    var solid = name === "flowerSolid";
    return '<svg class="ico' + (solid ? " q" : "") + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + body + "</svg>";
  }

  function apply(root) {
    (root || document).querySelectorAll("[data-ico]").forEach(function (el) {
      var s = svg(el.getAttribute("data-ico"));
      if (s) el.innerHTML = s;
      el.removeAttribute("data-ico");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { apply(); });
  } else {
    apply();
  }
})();
