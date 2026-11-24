/* Personal portfolio — interaction layer.
   No frameworks: typing effect, scroll reveal, active nav link, reading progress. */

(function () {
  "use strict";

  /* ---------- typing effect ---------- */
  const phrases = [
    "Computer Science student @ XJTLU",
    "Networking & distributed systems",
    "Python · Java · Spark",
    "Measuring what happens on the wire"
  ];
  const target = document.getElementById("typed");
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    if (!target) return;
    const phrase = phrases[phraseIndex];
    charIndex += deleting ? -1 : 1;
    target.textContent = phrase.slice(0, charIndex);

    let delay = deleting ? 35 : 70;
    if (!deleting && charIndex === phrase.length) {
      delay = 1600;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 350;
    }
    setTimeout(tick, delay);
  }
  tick();

  /* ---------- reading progress ---------- */
  const bar = document.getElementById("progress");
  function updateProgress() {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = height > 0 ? window.scrollY / height : 0;
    if (bar) bar.style.width = (ratio * 100).toFixed(2) + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });

  /* ---------- scroll reveal ---------- */
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  /* ---------- active navigation link ---------- */
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".links a"));

  function markActive() {
    const offset = window.scrollY + 120;
    let current = sections[0];
    sections.forEach((section) => {
      if (section.offsetTop <= offset) current = section;
    });
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === "#" + current.id;
      link.style.color = isActive ? "var(--text)" : "";
    });
  }
  window.addEventListener("scroll", markActive, { passive: true });
  markActive();

  /* ---------- mobile menu ---------- */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  function closeMenu() {
    if (!links) return;
    links.classList.remove("open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", (event) => {
      if (event.target.tagName === "A") closeMenu();
    });
  }

  /* ---------- footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
