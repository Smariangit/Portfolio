/* ============================================================
   Sparsh Verma — Portfolio interactions
   ============================================================ */

(function () {
  "use strict";

  /* ── Lucide icons ──────────────────────────────────────── */
  function initIcons() {
    if (window.lucide) window.lucide.createIcons();
  }

  /* ── Experience duration ───────────────────────────────── */
  function initExperience() {
    const start = new Date(2023, 7, 1); // Aug 2023
    const now   = new Date();
    let y = now.getFullYear() - start.getFullYear();
    let m = now.getMonth()   - start.getMonth();
    if (m < 0) { y--; m += 12; }
    const parts = [];
    if (y > 0) parts.push(y + (y === 1 ? " year" : " years"));
    if (m > 0) parts.push(m + (m === 1 ? " month" : " months"));
    const str = parts.length ? parts.join(" ") : "under a month";
    document.querySelectorAll("[data-experience-duration]").forEach(el => { el.textContent = str; });
  }

  /* ── Mobile menu ───────────────────────────────────────── */
  function initMobileMenu() {
    const toggle = document.getElementById("menu-toggle");
    const menu   = document.getElementById("mobile-menu");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector("[data-icon-open]")?.classList.toggle("hidden", open);
      toggle.querySelector("[data-icon-close]")?.classList.toggle("hidden", !open);
    });
    menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.querySelector("[data-icon-open]")?.classList.remove("hidden");
      toggle.querySelector("[data-icon-close]")?.classList.add("hidden");
    }));
  }

  /* ── Reveal on scroll ──────────────────────────────────── */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(el => el.classList.add("is-visible")); return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
    }, { threshold: 0.01, rootMargin: "0px 0px -10px 0px" });
    items.forEach(el => io.observe(el));

    // Near-bottom safety net for last section
    const revealAll = () => {
      if (document.documentElement.scrollHeight - window.scrollY - window.innerHeight < 200) {
        items.forEach(el => el.classList.add("is-visible"));
      }
    };
    window.addEventListener("scroll", revealAll, { passive: true });
    window.addEventListener("load", revealAll);
  }

  /* ── Scroll-spy ────────────────────────────────────────── */
  function initScrollSpy() {
    const sections  = Array.from(document.querySelectorAll("[data-section]"));
    const navLinks  = Array.from(document.querySelectorAll("[data-nav-link]"));
    const railNodes = Array.from(document.querySelectorAll(".rail-node"));
    const railFill  = document.querySelector(".rail-fill");
    if (!sections.length) return;

    function setActive(id) {
      navLinks.forEach(l => l.classList.toggle("is-active", l.dataset.navLink === id));
      let idx = -1;
      railNodes.forEach((n, i) => {
        const active = n.dataset.railNode === id;
        n.classList.toggle("is-active", active);
        if (active) idx = i;
      });
      if (railFill && idx >= 0 && railNodes.length > 1) {
        railFill.style.height = (idx / (railNodes.length - 1) * 100) + "%";
      }
    }

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-40% 0px -50% 0px", threshold: 0 });
    sections.forEach(s => io.observe(s));

    railNodes.forEach(n => n.addEventListener("click", () => {
      document.getElementById(n.dataset.railNode)?.scrollIntoView({ behavior: "smooth" });
    }));
  }

  /* ── Header shadow on scroll ───────────────────────────── */
  function initHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    window.addEventListener("scroll", () => {
      header.style.boxShadow = window.scrollY > 8
        ? "0 8px 24px -16px rgba(0,0,0,0.7)" : "none";
    }, { passive: true });
  }

  /* ── Contact form — Google Apps Script ─────────────────── */
  function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    /*
     * SETUP INSTRUCTIONS
     * ──────────────────
     * 1. Open Google Sheets → Extensions → Apps Script
     * 2. Paste the Apps Script code (see comment at bottom of index.html)
     * 3. Click Deploy → New deployment → Web app
     *    – Execute as: Me
     *    – Who has access: Anyone
     * 4. Copy the deployment URL and paste it below, replacing the placeholder.
     */
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwBQtrzByW8Ziz2Ary6boaC_FQUjS2tXWB_uhpywwpxkncev71W2aC0SxZ_zv9k41_SIA/exec";

    const btn      = form.querySelector("[data-submit-btn]");
    const statusEl = document.getElementById("form-status");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (SCRIPT_URL === "Error") {
        statusEl.textContent = "Form not yet configured — email sparshv2325@gmail.com directly.";
        statusEl.className = "form-status form-status--err show";
        return;
      }

      const orig = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Sending…";
      statusEl.className = "form-status";

      const payload = {
        name:    form.name.value.trim(),
        email:   form.email.value.trim(),
        company: form.company.value.trim(),
        subject: form.subject.value,
        message: form.message.value.trim(),
      };

      try {
        // Apps Script requires no-cors; we optimistically assume success on no throw
        await fetch(SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        statusEl.textContent = "Message sent — I'll get back to you within 24 hours.";
        statusEl.className = "form-status form-status--ok show";
        form.reset();
      } catch {
        statusEl.textContent = "Something went wrong. Please email sparshv2325@gmail.com directly.";
        statusEl.className = "form-status form-status--err show";
      } finally {
        btn.disabled = false;
        btn.textContent = orig;
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initIcons();
    initExperience();
    initMobileMenu();
    initReveal();
    initScrollSpy();
    initHeader();
    initContactForm();
  });
})();
