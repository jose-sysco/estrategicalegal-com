/**
 * Cloudflare Pages Function — Formulario de contacto
 * Ruta: POST /api/contacto
 *
 * Variables de entorno (Cloudflare Pages → Settings → Environment variables):
 *   RESEND_API_KEY  (obligatoria, marcar como "Secret")  ej. re_xxxxxxxx
 *   TO_EMAIL        (opcional)  destino. Por defecto contacto@estrategicalegal.com
 *   FROM_EMAIL      (opcional)  remitente. DEBE ser de un dominio verificado en Resend.
 *                               ej. "Estratégica Legal <web@estrategicalegal.com>"
 */

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c],
  );

export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: "Solicitud inválida." }, 400);
  }

  // Honeypot: si viene relleno es un bot. Respondemos ok para no darle pistas.
  if (data.website) return json({ ok: true });

  const nombre = (data.nombre || "").trim();
  const correo = (data.correo || "").trim();
  const telefono = (data.telefono || "").trim();
  const mensaje = (data.mensaje || "").trim();

  // Validación en servidor (no se confía en la del navegador)
  const errores = [];
  if (nombre.length < 2) errores.push("nombre");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo)) errores.push("correo");
  if (telefono.replace(/\D/g, "").length !== 8) errores.push("teléfono");
  if (mensaje.length < 5) errores.push("mensaje");
  if (errores.length) {
    return json(
      { ok: false, error: `Revise estos campos: ${errores.join(", ")}.` },
      400,
    );
  }

  if (!env.RESEND_API_KEY) {
    return json(
      { ok: false, error: "El servicio de correo no está configurado." },
      500,
    );
  }

  const TO = env.TO_EMAIL || "contacto@estrategicalegal.com";
  const FROM = env.FROM_EMAIL || "Estratégica Legal <onboarding@resend.dev>";

  const html = `
    <h2 style="font-family:Georgia,serif;color:#16324f;margin:0 0 16px">
      Nueva consulta desde el sitio web
    </h2>
    <table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px;color:#30353b">
      <tr><td><strong>Nombre</strong></td><td>${esc(nombre)}</td></tr>
      <tr><td><strong>Correo</strong></td><td>${esc(correo)}</td></tr>
      <tr><td><strong>Teléfono</strong></td><td>${esc(telefono)}</td></tr>
    </table>
    <p style="font-family:Arial,sans-serif;font-size:14px;color:#30353b;
              border-left:3px solid #a37a47;padding-left:12px;margin-top:20px;
              white-space:pre-wrap">${esc(mensaje)}</p>
    <p style="font-family:Arial,sans-serif;font-size:12px;color:#8a8f96;margin-top:24px">
      Enviado desde el formulario de estrategicalegal.com
    </p>`;

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      reply_to: correo, // responder le contesta directo al visitante
      subject: `Consulta de ${nombre} — Estratégica Legal`,
      html,
    }),
  });

  if (!r.ok) {
    const detalle = await r.text();
    console.error("Resend error:", r.status, detalle);
    return json(
      { ok: false, error: "No se pudo enviar el mensaje. Intente de nuevo." },
      502,
    );
  }

  return json({ ok: true });
}
