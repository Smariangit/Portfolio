/* ===========================================================
   Sparsh Verma — Portfolio Interactions
   =========================================================== */

(function () {
  "use strict";

  /* ---------- Lucide icons ---------- */
  function initIcons() {
    if (window.lucide) window.lucide.createIcons();
  }

  /* ---------- Experience duration (resume-accurate) ---------- */
  function calculateExperienceTime() {
    // Professional experience start: August 2023 (Blackcoffer internship,
    // per resume — month is 0-indexed in JS Date, so 7 = August)
    const startDate = new Date(2023, 7, 1);
    const now = new Date();

    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }

    const parts = [];
    if (years > 0) parts.push(years + (years === 1 ? " year" : " years"));
    if (months > 0) parts.push(months + (months === 1 ? " month" : " months"));
    const summary = parts.length ? parts.join(" ") : "under a month";

    document.querySelectorAll("[data-experience-duration]").forEach((el) => {
      el.textContent = summary;
    });
    document.querySelectorAll("[data-experience-short]").forEach((el) => {
      el.textContent = (years ? years + "y " : "") + (months ? months + "m" : "");
    });
  }

  /* ---------- Mobile menu ---------- */
  function initMobileMenu() {
    const toggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("mobile-menu");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      const iconOpen = toggle.querySelector("[data-icon-open]");
      const iconClose = toggle.querySelector("[data-icon-close]");
      if (iconOpen && iconClose) {
        iconOpen.classList.toggle("hidden", isOpen);
        iconClose.classList.toggle("hidden", !isOpen);
      }
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        const iconOpen = toggle.querySelector("[data-icon-open]");
        const iconClose = toggle.querySelector("[data-icon-close]");
        if (iconOpen && iconClose) {
          iconOpen.classList.remove("hidden");
          iconClose.classList.add("hidden");
        }
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px -10px 0px" }
    );

    items.forEach((el) => observer.observe(el));

    // Safety net: a short section near the very bottom of the page can sit in a
    // spot the viewport never fully scrolls past, so IntersectionObserver may
    // never fire for it. Reveal anything still hidden once the page is scrolled
    // close to its end.
    function revealNearBottom() {
      const scrollBottom = window.scrollY + window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      if (docHeight - scrollBottom < 200) {
        items.forEach((el) => el.classList.add("is-visible"));
      }
    }
    window.addEventListener("scroll", revealNearBottom, { passive: true });
    window.addEventListener("load", revealNearBottom);
  }

  /* ---------- Scroll-spy: nav links + pipeline rail ---------- */
  function initScrollSpy() {
    const sections = Array.from(document.querySelectorAll("[data-stage-section]"));
    if (!sections.length) return;

    const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
    const railNodes = Array.from(document.querySelectorAll(".rail-node"));
    const railFill = document.querySelector(".rail-fill");

    function setActive(id) {
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("data-nav-link") === id);
      });

      let activeIndex = -1;
      railNodes.forEach((node, i) => {
        const isActive = node.getAttribute("data-rail-node") === id;
        node.classList.toggle("is-active", isActive);
        if (isActive) activeIndex = i;
      });

      if (railFill && activeIndex >= 0 && railNodes.length > 1) {
        const pct = (activeIndex / (railNodes.length - 1)) * 100;
        railFill.style.height = pct + "%";
      }
    }

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((sec) => observer.observe(sec));

    railNodes.forEach((node) => {
      node.addEventListener("click", () => {
        const id = node.getAttribute("data-rail-node");
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  function initHeaderState() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const onScroll = () => {
      header.style.boxShadow = window.scrollY > 8 ? "0 10px 30px -20px rgba(0,0,0,0.8)" : "none";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initIcons();
    calculateExperienceTime();
    initMobileMenu();
    initReveal();
    initScrollSpy();
    initHeaderState();
  });
})();
