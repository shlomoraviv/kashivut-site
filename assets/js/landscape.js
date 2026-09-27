/**
 * נוף פתיחה שקט — שמש, גבעות, ערפל וציפורים רחוקות.
 * נבנה לתוך כל אלמנט .hero-landscape.
 */
(function () {
  "use strict";

  var SVG_OPEN =
    '<svg viewBox="0 0 1200 620" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">';

  var DEFS =
    '<defs>' +
    '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="#fdf6e9"/><stop offset=".45" stop-color="#f6e7f2"/><stop offset="1" stop-color="#e9e4fa"/>' +
    "</linearGradient>" +
    '<radialGradient id="sunglow" cx=".5" cy=".5" r=".5">' +
    '<stop offset="0" stop-color="#ffe9b8" stop-opacity=".95"/><stop offset=".55" stop-color="#ffd9e8" stop-opacity=".4"/><stop offset="1" stop-color="#ffd9e8" stop-opacity="0"/>' +
    "</radialGradient>" +
    '<linearGradient id="h1g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#faf1de"/><stop offset="1" stop-color="#f1e0c4"/></linearGradient>' +
    '<linearGradient id="h2g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9eefa"/><stop offset="1" stop-color="#d3ddf6"/></linearGradient>' +
    '<linearGradient id="h3g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7d9ec"/><stop offset="1" stop-color="#eec3e2"/></linearGradient>' +
    '<linearGradient id="h4g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f5e6cc"/><stop offset="1" stop-color="#ead2ab"/></linearGradient>' +
    "</defs>";

  var BIRD =
    '<g class="hl-bird" style="animation-delay:var(--bd,0s)"><path d="M0 0c4-3 8-3 11 0 3-3 7-3 11 0" fill="none" stroke="#8f9fe0" stroke-width="2" stroke-linecap="round" opacity=".55"/></g>';

  function hills() {
    return (
      /* שכבת גבעות רחוקה (כחול רך) */
      '<g data-parallax="0.05"><path d="M0 470 C150 420 280 440 420 410 C560 380 700 430 840 415 C980 400 1100 430 1200 415 L1200 620 0 620Z" fill="url(#h2g)" opacity=".75"/></g>' +
      /* גבעות אמצע (ורוד) */
      '<g data-parallax="0.09"><path d="M0 520 C170 480 320 505 470 480 C620 455 760 505 910 490 C1030 478 1130 495 1200 488 L1200 620 0 620Z" fill="url(#h3g)" opacity=".85"/></g>' +
      /* גבעות קדמיות (שמנת רכה) */
      '<g data-parallax="0.14"><path d="M0 575 C190 540 360 560 540 545 C720 530 900 555 1080 545 C1140 542 1180 546 1200 544 L1200 620 0 620Z" fill="url(#h1g)"/></g>' +
      /* גבעת חול רכה בקצה */
      '<path d="M0 620 L0 600 C220 585 480 596 700 592 C900 588 1080 596 1200 592 L1200 620Z" fill="url(#h4g)" opacity=".9"/>'
    );
  }

  function clouds() {
    var cloud =
      '<g class="hl-cloud" style="--cy:{Y}px"><g transform="translate(0,{Y}) scale({S})">' +
      '<ellipse cx="0" cy="0" rx="52" ry="16" fill="#fff" opacity=".75"/>' +
      '<ellipse cx="30" cy="-8" rx="30" ry="13" fill="#fff" opacity=".65"/>' +
      '<ellipse cx="-28" cy="-5" rx="24" ry="11" fill="#fff" opacity=".6"/>' +
      "</g></g>";
    return (
      cloud.replace("{Y}", "120").replace("{Y}", "120").replace("{S}", "1") +
      cloud.replace("{Y}", "200").replace("{Y}", "200").replace("{S}", "0.72").replace('class="hl-cloud"', 'class="hl-cloud c2"')
    );
  }

  function mist() {
    var band =
      '<rect class="hl-mist {CLS}" x="-140" y="{Y}" width="1500" height="{H}" rx="{H2}" fill="#fff" opacity="{O}"/>';
    return (
      band.replace("{CLS}", "m1").replace("{Y}", "470").replace("{H}", "60").replace("{H2}", "30").replace("{O}", ".30") +
      band.replace("{CLS}", "m2").replace("{Y}", "515").replace("{H}", "48").replace("{H2}", "24").replace("{O}", ".22")
    );
  }

  function birds() {
    return (
      BIRD.replace("{--bd,0s}", "--bd,0s").replace("{--bd}", "0s")
    ).replace('<g class="hl-bird" style="animation-delay:var(--bd,0s)">', '<g class="hl-bird" style="--bd:0s">') +
      BIRD.replace('<g class="hl-bird" style="animation-delay:var(--bd,0s)">', '<g class="hl-bird" style="--bd:-9s">') +
      BIRD.replace('<g class="hl-bird" style="animation-delay:var(--bd,0s)">', '<g class="hl-bird" style="--bd:-17s">');
  }

  var SCENE =
    SVG_OPEN +
    DEFS +
    /* שמיים */
    '<rect width="1200" height="620" fill="url(#sky)"/>' +
    /* זוהר שמש */
    '<g class="hl-sun"><circle cx="1060" cy="205" r="150" fill="url(#sunglow)"/><circle cx="1060" cy="205" r="46" fill="#ffe3c4" opacity=".9"/></g>' +
    /* ציפורים רחוקות */
    '<g transform="translate(430 150)">' + birds() + "</g>" +
    '<g transform="translate(700 105) scale(.8)">' + birds() + "</g>" +
    clouds() +
    hills() +
    mist() +
    "</svg>";

  function inject() {
    document.querySelectorAll(".hero-landscape").forEach(function (host) {
      host.innerHTML = SCENE;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
