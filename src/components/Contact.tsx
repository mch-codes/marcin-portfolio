"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { SectionHeader } from "@/components/Section";
import { sendContactMessage } from "@/app/actions";

const EMAIL = "marcin.chrzuszcz@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/marcin-chrzuszcz/";

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
    "w-full bg-card border border-border rounded-xl px-4 py-3 text-text text-sm placeholder:text-muted/60 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all duration-200 resize-none";

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
          className={baseClass}
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
      <SectionHeader word={t.contact.title}>{t.contact.intro}</SectionHeader>

      <div className="px-6 md:px-16">
        <div className="mt-14 md:mt-20 grid md:grid-cols-5 gap-10 md:gap-16">
          {/* Left: form */}
          <div className="md:col-span-3">
            {status === "success" ? (
              <div className="flex flex-col items-start gap-4">
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

                <label className="flex items-start gap-2 text-xs text-muted">
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
                  <p className="text-xs text-red-400">{t.contact.error}</p>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="self-start inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 text-sm font-semibold text-accent border border-accent hover:bg-accent hover:text-bg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-60 disabled:cursor-not-allowed"
                    
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

          {/* Right: photo + contact info */}
          <div className="md:col-span-2 flex flex-col sm:flex-row gap-6 items-start">
            <div className="flex flex-col gap-8">
            {/* Email */}
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-3">
                Email
              </p>
              <a
                href={`mailto:${EMAIL}`}
                className="text-text text-sm font-medium hover:text-accent transition-colors"
              >
                {EMAIL}
              </a>
            </div>

            {/* Location */}
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-3">
                {t.contact.location_label}
              </p>
              <p className="text-text text-sm font-medium">{t.contact.location}</p>
            </div>

            {/* LinkedIn */}
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-3">
                LinkedIn
              </p>
              <a
                href={LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-text transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Marcin Chrzuszcz
              </a>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
