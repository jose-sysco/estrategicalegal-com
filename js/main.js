/* ─── MOBILE NAV ─── */
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
  navMenu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ─── AÑO DINÁMICO (© footer) ─── */
document.querySelectorAll("#year").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

/* ─── FORMULARIO DE CONTACTO (mailto:) ─── */
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  const telefonoInput = contactForm.telefono;

  /* Máscara XXXX-XXXX: solo dígitos, guion automático tras el 4to */
  telefonoInput.addEventListener("input", () => {
    const digits = telefonoInput.value.replace(/\D/g, "").slice(0, 8);
    telefonoInput.value =
      digits.length > 4 ? digits.slice(0, 4) + "-" + digits.slice(4) : digits;

    if (digits.length === 0) {
      telefonoInput.setCustomValidity("Ingrese su número de teléfono.");
    } else if (digits.length < 8) {
      telefonoInput.setCustomValidity(
        "El teléfono debe tener 8 dígitos (0000-0000).",
      );
    } else {
      telefonoInput.setCustomValidity("");
    }
  });
  /* Estado inicial: vacío = inválido (campo requerido) */
  telefonoInput.setCustomValidity("Ingrese su número de teléfono.");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    /* Validación nativa: nombre y mensaje presentes, correo con formato
       válido (type=email) y teléfono con 8 dígitos (setCustomValidity). */
    if (!contactForm.reportValidity()) return;

    const nombre = contactForm.nombre.value.trim();
    const correo = contactForm.correo.value.trim();
    const telefono = telefonoInput.value.trim();
    const mensaje = contactForm.mensaje.value.trim();

    const subject = `Consulta de ${nombre} — Estratégica Legal`;
    const bodyLines = [
      `Nombre: ${nombre}`,
      `Correo: ${correo}`,
      `Teléfono: ${telefono}`,
      "",
      mensaje,
    ];

    const mailto = `mailto:contacto@estrategicalegal.com?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;

    window.location.href = mailto;
  });
}
