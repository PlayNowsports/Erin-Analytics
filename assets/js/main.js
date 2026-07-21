/* =====================================================================
   CADENCE — interactions
   ===================================================================== */
(function () {
  "use strict";

  /* ---- sticky nav shadow ---- */
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("scrolled", window.scrollY > 12);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- mobile menu ---- */
  var toggle = document.getElementById("navToggle");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
    nav.querySelectorAll(".nav__links a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); });
    });
  }

  /* ---- scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- animated counters (hero) ---- */
  var counters = document.querySelectorAll("[data-count]");
  var animateCount = function (el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var start = null, dur = 1400;
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---- capacity simulator ---- */
  var sim = document.getElementById("sim");
  if (sim) {
    var reps = document.getElementById("reps"),
        quota = document.getElementById("quota"),
        att = document.getElementById("att"),
        repsV = document.getElementById("repsV"),
        quotaV = document.getElementById("quotaV"),
        attV = document.getElementById("attV"),
        outB = document.getElementById("outBookings"),
        outC = document.getElementById("outCoverage"),
        outR = document.getElementById("outRamp"),
        bars = document.getElementById("simBars");

    var fmtM = function (v) {
      if (v >= 1000) return "$" + (v / 1000).toFixed(1) + "B";
      return "$" + v.toFixed(1) + "M";
    };

    var render = function () {
      var r = +reps.value, q = +quota.value, a = +att.value / 100;
      repsV.textContent = r;
      quotaV.textContent = q;
      attV.textContent = att.value;

      var bookings = (r * q * a) / 1000; // $M
      var winRate = 0.22 + (a - 0.72) * 0.12; // rough coupling for coverage
      winRate = Math.max(0.12, Math.min(0.4, winRate));
      var coverage = 1 / winRate;
      var ramp = Math.round(4 + r / 22); // more reps => longer avg ramp drag

      outB.textContent = fmtM(bookings);
      outC.textContent = coverage.toFixed(1) + "×";
      outR.textContent = ramp + " mo";

      // quarterly build with slight seasonality
      var seg = [0.20, 0.24, 0.26, 0.30];
      var w = 900, gap = 24, n = seg.length, bw = (w - gap * (n - 1)) / n;
      var max = Math.max.apply(null, seg) * bookings;
      var labels = ["Q1", "Q2", "Q3", "Q4"];
      var svg = "";
      for (var i = 0; i < n; i++) {
        var val = seg[i] * bookings;
        var h = max ? (val / max) * 96 : 0;
        var x = i * (bw + gap);
        var y = 108 - h;
        var col = i === n - 1 ? "#CBF24A" : "#26302A";
        svg += '<rect x="' + x + '" y="' + y + '" width="' + bw + '" height="' + h + '" rx="4" fill="' + col + '"/>';
        svg += '<text x="' + (x + bw / 2) + '" y="128" fill="#616b64" font-family="IBM Plex Mono, monospace" font-size="13" text-anchor="middle">' + labels[i] + '</text>';
        svg += '<text x="' + (x + bw / 2) + '" y="' + (y - 8) + '" fill="#8C968E" font-family="IBM Plex Mono, monospace" font-size="12" text-anchor="middle">' + fmtM(val) + '</text>';
      }
      bars.innerHTML = svg;
    };

    [reps, quota, att].forEach(function (el) { el.addEventListener("input", render); });
    render();
  }

  /* ---- footer year (if present) ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = "2026";
})();
