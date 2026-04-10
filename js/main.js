/* ─── CURSOR ─── */
const dot = document.getElementById("cur-dot");
const ring = document.getElementById("cur-ring");
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
  dot.style.left = mx + "px";
  dot.style.top = my + "px";
});

(function loop() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.left = rx + "px";
  ring.style.top = ry + "px";
  requestAnimationFrame(loop);
})();

document.querySelectorAll("a,button,.svc-pill,.stat-item").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    ring.style.width = "52px";
    ring.style.height = "52px";
    ring.style.borderColor = "rgba(201,168,76,.7)";
  });
  el.addEventListener("mouseleave", () => {
    ring.style.width = "32px";
    ring.style.height = "32px";
    ring.style.borderColor = "";
  });
});

if ("ontouchstart" in window) {
  dot.style.display = "none";
  ring.style.display = "none";
  document.body.style.cursor = "auto";
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
