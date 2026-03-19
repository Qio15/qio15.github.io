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
  if (revealEls.length > 0 && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach((el) => io.observe(el));
  } else {
    // Fallback (navigateurs anciens)
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  // 2) Navbar - lien actif selon la page
  const normalizePath = (p) => {
    if (!p) return "index.html";
    const last = p.split("/").filter(Boolean).pop() || "index.html";
    return last.toLowerCase();
  };

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

