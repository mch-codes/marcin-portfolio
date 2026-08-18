"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { SectionHeader, CTA } from "@/components/Section";
import { sendContactMessage } from "@/app/actions";

function InputField({
  label,
  name,
  type = "text",
  placeholder,
  required,
  rows,
  maxLength,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  /** Mirrors the caps in sendContactMessage — the server is what enforces
      them; this only stops a real visitor writing past the limit and losing
      the message on submit. */
  maxLength?: number;
}) {
  const baseClass =
    "w-full bg-card border border-border rounded-xl px-4 py-3 text-text text-sm text-center placeholder:text-muted focus:placeholder:text-transparent focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all duration-200 resize-none";

  return (
    <div>
      <label className="block text-xs font-semibold tracking-wide text-muted mb-2 uppercase">
        {label}
      </label>
      {rows ? (
        <textarea
          name={name}
          placeholder={placeholder}
          required={required}
          rows={rows}
          maxLength={maxLength}
          /* align-content centres the lines in the box, which is what puts the
             placeholder on the textarea's middle instead of its first row.
             `-safe` so a message longer than the box falls back to top-aligned
             rather than centring itself out of view past the scroll origin. */
          className={`${baseClass} content-center-safe`}
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          className={baseClass}
        />
      )}
    </div>
  );
}

export default function Contact() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const formData = new FormData(e.currentTarget);
    const result = await sendContactMessage(formData);
    setStatus(result.success ? "success" : "error");
    if (result.success) {
      (e.target as HTMLFormElement).reset();
    }
  }

  return (
    <section id="contact" className="py-20 md:py-24 relative">
      <SectionHeader word={t.contact.title} />

      <div className="px-6 md:px-16">
        {/* The form is the only thing in this section now, so it is a single
            centred column rather than a grid — narrower than the max-w-5xl
            rail the other sections use, because centred fields need a short
            measure to stay readable. */}
        <div className="mt-24 md:mt-32 mx-auto max-w-2xl text-center">
          {status === "success" ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M3 9l4 4 8-8"
                    stroke="#047857"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-text font-medium">{t.contact.success}</p>
              <button
                onClick={() => setStatus("idle")}
                className="text-xs text-muted hover:text-text transition-colors underline underline-offset-4"
              >
                {t.contact.send_another}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <InputField
                  label={t.contact.name_label}
                  name="name"
                  placeholder={t.contact.name_placeholder}
                  required
                  maxLength={100}
                />
                <InputField
                  label={t.contact.email_label}
                  name="email"
                  type="email"
                  placeholder={t.contact.email_placeholder}
                  required
                  maxLength={200}
                />
              </div>
              <InputField
                label={t.contact.message_label}
                name="message"
                placeholder={t.contact.message_placeholder}
                required
                maxLength={5000}
                rows={5}
              />

              {/* Honeypot. Off-screen rather than type="hidden" or
                  display:none — bots skip the former and detect the latter,
                  but a positioned real text input still gets filled. tabIndex
                  and aria-hidden keep it away from keyboards and screen
                  readers; autoComplete="off" stops the browser filling it
                  for a real visitor, which would block their own message.
                  Checked in sendContactMessage. */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="absolute -left-[9999px] w-px h-px opacity-0"
              />

              <label className="flex items-start justify-center gap-2 text-xs text-muted">
                <input type="checkbox" name="consent" required className="mt-0.5" />
                <span>
                  {t.contact.consent_pre}
                  <Link href="/politica-privacidad" className="underline underline-offset-2 hover:text-text">
                    {t.contact.consent_link}
                  </Link>
                  {t.contact.consent_post}
                </span>
              </label>

              {status === "error" && (
                <p className="text-xs text-error">{t.contact.error}</p>
              )}

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className={`${CTA} self-start disabled:opacity-60 disabled:cursor-not-allowed`}
                  
                >
                  {status === "loading" ? t.contact.sending : t.contact.send}
                  {status !== "loading" && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M2 7h10M8 3l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
