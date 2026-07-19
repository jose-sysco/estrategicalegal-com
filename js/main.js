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

/* ─── FORMULARIO DE CONTACTO ───
   Envía por fetch a /api/contacto (Cloudflare Pages Function → Resend).
   El visitante nunca sale de la página ni se abre su cliente de correo. */
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

  const statusEl = document.getElementById("form-status");
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  const setStatus = (texto, tipo) => {
    if (!statusEl) return;
    statusEl.textContent = texto;
    statusEl.className = "form-status" + (tipo ? " is-" + tipo : "");
  };

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    /* Validación nativa: nombre y mensaje presentes, correo con formato
       válido (type=email) y teléfono con 8 dígitos (setCustomValidity). */
    if (!contactForm.reportValidity()) return;

    const datos = {
      nombre: contactForm.nombre.value.trim(),
      correo: contactForm.correo.value.trim(),
      telefono: telefonoInput.value.trim(),
      mensaje: contactForm.mensaje.value.trim(),
      website: contactForm.website ? contactForm.website.value : "",
    };

    const textoOriginal = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando…";
    setStatus("", "");

    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        contactForm.reset();
        telefonoInput.setCustomValidity("Ingrese su número de teléfono.");
        setStatus(
          "Gracias por escribirnos. Hemos recibido su mensaje y le contactaremos a la brevedad.",
          "ok",
        );
      } else {
        setStatus(
          data.error ||
            "No se pudo enviar el mensaje. Por favor intente de nuevo.",
          "error",
        );
      }
    } catch {
      setStatus(
        "No se pudo enviar el mensaje. Verifique su conexión e intente de nuevo.",
        "error",
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = textoOriginal;
    }
  });
}
