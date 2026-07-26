"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/* Caps, not validation for its own sake: this endpoint is a plain POST anyone
   can hit directly, so without them a bot can push an arbitrarily large body
   through to Resend. Generous enough that no real enquiry hits them. */
const MAX = { name: 100, email: 200, message: 5000 };

/* Deliberately loose — the only thing that matters here is that it is a single
   address with no whitespace, because it goes into replyTo. Anything stricter
   rejects valid addresses. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendContactMessage(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  // Honeypot: hidden in the form, so only a bot filling every field reaches
  // this. Returns success so it cannot tell it was caught and retry.
  if (formData.get("website")) {
    return { success: true };
  }

  if (!name || !email || !message) {
    return { success: false };
  }

  // The consent checkbox is `required` in the browser only — a direct POST
  // skips it entirely, and sending without it is the GDPR problem.
  if (formData.get("consent") !== "on") {
    return { success: false };
  }

  if (
    name.length > MAX.name ||
    email.length > MAX.email ||
    message.length > MAX.message ||
    !EMAIL_RE.test(email)
  ) {
    return { success: false };
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message);

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
      to: "marcin.chrzuszcz@gmail.com",
      replyTo: email,
      subject: `Contacto: ${safeName}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px">
          <p><strong>Nombre:</strong> ${safeName}</p>
          <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
          <p style="white-space:pre-wrap">${safeMessage}</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false };
  }
}
