"use server";

export async function sendContactMessage(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { success: false };
  }

  // Connect your email service here. Example with Resend:
  // import { Resend } from "resend";
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: "portfolio@yourdomain.com",
  //   to: "marcin.chrzuszcz@gmail.com",
  //   subject: `Portfolio contact from ${name}`,
  //   html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message}</p>`,
  // });

  console.log("Contact form submission:", { name, email, message });

  return { success: true };
}
