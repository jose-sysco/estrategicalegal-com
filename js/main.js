/* ─── MOBILE NAV ─── */
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("open");
    navMenu.classList.toggle("open");
  });
  navMenu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      navToggle.classList.remove("open");
      navMenu.classList.remove("open");
    });
  });
}

/* ─── ANIMATE STATS ON SCROLL ─── */
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.style.opacity = "1";
        e.target.style.transform = "none";
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".stat-item,.svc-pill").forEach((el, i) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(14px)";
  el.style.transition = `opacity .5s ${i * 0.05}s ease, transform .5s ${i * 0.05}s ease`;
  obs.observe(el);
});

/* ─── AÑO DINÁMICO (© footer) ─── */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
