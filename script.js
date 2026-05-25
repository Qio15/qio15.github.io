/* ==========================================================
   Portfolio BTS SIO - Script principal
   - Animation au scroll (IntersectionObserver)
   - Mise en évidence du lien actif dans la navbar
   - Bouton "Retour en haut"
   ========================================================== */

(() => {
  "use strict";

  // 1) Animation au scroll
  const revealEls = document.querySelectorAll(".reveal");
  const viewportH = () => window.visualViewport?.height || window.innerHeight || 0;

  // Split elements between "already visible on load" and "later on scroll".
  const visibleNow = [];
  const later = [];

  revealEls.forEach((el) => {
    // Ensure they start hidden and can animate on page load.
    el.classList.remove("in-view");
    const rect = el.getBoundingClientRect();
    const isVisibleSoon = rect.top < viewportH() * 0.92 && rect.bottom > 0;
    (isVisibleSoon ? visibleNow : later).push(el);
  });

  // Animate the first viewport immediately with a stagger (so the effect is visible when changing page).
  // Use a double rAF to guarantee styles are applied before toggling (prevents "instant" appearance).
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      visibleNow.forEach((el, idx) => {
        el.style.setProperty("--reveal-delay", `${Math.min(idx * 90, 720)}ms`);
        el.classList.add("in-view");
      });
    });
  });

  if (revealEls.length > 0 && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.style.setProperty("--reveal-delay", "0ms");
          requestAnimationFrame(() => {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          });
        });
      },
      { threshold: 0.12 }
    );

    requestAnimationFrame(() => {
      later.forEach((el) => io.observe(el));
    });
  } else {
    setTimeout(() => {
      revealEls.forEach((el) => el.classList.add("in-view"));
    }, 80);
  }

  // 2) Navbar - lien actif selon la page
  const normalizePath = (p) => {
    if (!p) return "index.html";
    const last = p.split("/").filter(Boolean).pop() || "index.html";
    return last.toLowerCase();
  };

  // Tech effect: enable optional "glitch" on hover for main titles
  document.querySelectorAll(".section-title").forEach((h) => {
    const txt = (h.textContent || "").trim();
    if (!txt) return;
    h.setAttribute("data-glitch", "1");
    h.setAttribute("data-text", txt);
  });

  const current = normalizePath(window.location.pathname);
  document.querySelectorAll("[data-nav]").forEach((a) => {
    const target = (a.getAttribute("href") || "").toLowerCase();
    if (target === current || (current === "" && target === "index.html")) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    }
  });

  // 3) Retour en haut
  const backBtn = document.getElementById("backToTop");
  if (backBtn) {
    const onScroll = () => {
      if (window.scrollY > 450) backBtn.classList.add("show");
      else backBtn.classList.remove("show");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    backBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // 4) Smooth scroll pour ancres internes
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();

