/* Kilian Minkwitz — portfolio interactions. Vanilla JS, no dependencies. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme toggle ---------- */
  var themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", next === "dark" ? "#0b0d13" : "#f6f7fb");
    });
  }

  /* ---------- Mobile menu ---------- */
  var menuToggle = document.getElementById("menuToggle");
  var navLinks = document.getElementById("navLinks");
  if (menuToggle && navLinks) {
    var closeMenu = function () {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    };
    menuToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  /* ---------- Sticky-nav shadow + active link ---------- */
  var nav = document.getElementById("nav");
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var linkFor = {};
  document.querySelectorAll(".nav__links a").forEach(function (a) {
    linkFor[a.getAttribute("href").slice(1)] = a;
  });

  var onScroll = function () {
    if (nav) nav.classList.toggle("is-stuck", window.scrollY > 8);
    var toTop = document.getElementById("toTop");
    if (toTop) {
      var show = window.scrollY > 600;
      toTop.classList.toggle("show", show);
      toTop.hidden = false;
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute("id");
        Object.keys(linkFor).forEach(function (k) {
          linkFor[k].classList.toggle("is-active", k === id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in-view"); });
  } else {
    var revObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // small stagger for siblings entering together
        el.style.transitionDelay = Math.min(i * 60, 240) + "ms";
        el.classList.add("in-view");
        obs.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { revObserver.observe(el); });
  }

  /* ---------- Typewriter ---------- */
  var tw = document.getElementById("typewriter");
  if (tw) {
    var roles = ["AI systems.", "ML services.", "RAG & agents.", "data platforms."];
    if (reduceMotion) {
      tw.textContent = "AI systems.";
    } else {
      var ri = 0, ci = 0, deleting = false;
      var tick = function () {
        var word = roles[ri];
        tw.textContent = word.slice(0, ci);
        if (!deleting) {
          if (ci < word.length) { ci++; setTimeout(tick, 78); }
          else { deleting = true; setTimeout(tick, 1500); }
        } else {
          if (ci > 0) { ci--; setTimeout(tick, 40); }
          else { deleting = false; ri = (ri + 1) % roles.length; setTimeout(tick, 260); }
        }
      };
      setTimeout(tick, 500);
    }
  }

  /* ---------- Project filters ---------- */
  var filters = Array.prototype.slice.call(document.querySelectorAll(".filter"));
  var projects = Array.prototype.slice.call(document.querySelectorAll(".project"));
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filters.forEach(function (b) { b.classList.remove("is-active"); b.setAttribute("aria-selected", "false"); });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      var f = btn.getAttribute("data-filter");
      projects.forEach(function (p) {
        var show = f === "all" || p.getAttribute("data-cat") === f;
        p.classList.toggle("is-hidden", !show);
      });
    });
  });

  /* ---------- Back to top ---------- */
  var toTop = document.getElementById("toTop");
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Live GitHub stats (graceful: hidden on any failure) ---------- */
  (function () {
    var el = document.getElementById("ghStats");
    if (!el) return;
    fetch("https://api.github.com/users/MeKili")
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (d) {
        if (typeof d.public_repos === "number") {
          el.innerHTML = " · <b>" + d.public_repos + "</b> public repositories and counting";
          el.hidden = false;
        }
      })
      .catch(function () { /* stay hidden */ });
  })();
})();
