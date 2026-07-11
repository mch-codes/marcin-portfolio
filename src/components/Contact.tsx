"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { m, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { sendContactMessage } from "@/app/actions";

const EMAIL = "marcin.chrzuszcz@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/marcin-chrzuszcz/";
const WHATSAPP = "https://wa.me/34633683404";

function InputField({
  label,
  name,
  type = "text",
  placeholder,
  required,
  rows,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
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
          className={baseClass}
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          required={required}
          className={baseClass}
        />
      )}
    </div>
  );
}

export default function Contact() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
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
    <section id="contact" className="py-28 md:py-36 relative bg-[#1a1a1e]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <m.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-text tracking-tight leading-[1.15]">
            {t.contact.subtitle}
          </h2>
          <p className="text-muted leading-relaxed mt-3 max-w-xl">
            {t.contact.intro}
          </p>
        </m.div>

        <div className="grid md:grid-cols-5 gap-10 md:gap-16">
          {/* Left: form */}
          <m.div
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="md:col-span-3"
          >
            {status === "success" ? (
              <div className="flex flex-col items-start gap-4 p-8 rounded-2xl border border-accent/30 bg-accent/5">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M3 9l4 4 8-8"
                      stroke="#10b981"
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
                  />
                  <InputField
                    label={t.contact.email_label}
                    name="email"
                    type="email"
                    placeholder={t.contact.email_placeholder}
                    required
                  />
                </div>
                <InputField
                  label={t.contact.message_label}
                  name="message"
                  placeholder={t.contact.message_placeholder}
                  required
                  rows={5}
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
                    className="self-start inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      boxShadow: "0 4px 16px rgba(16,185,129,0.2)",
                    }}
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

                  <a
                    href={WHATSAPP}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-text border border-border bg-card hover:border-[#25D366]/50 hover:bg-[#25D366] hover:text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.87 9.87 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.24 8.24zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.43 1.03 2.6.12.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.28z" />
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </form>
            )}
          </m.div>

          {/* Right: photo + contact info */}
          <m.div
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="md:col-span-2 flex flex-col sm:flex-row gap-6 items-start"
          >
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
                className="inline-flex items-center gap-2 text-sm font-medium text-text border border-border bg-card hover:border-border-light hover:bg-card-hover px-4 py-2.5 rounded-xl transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Marcin Chrzuszcz
              </a>
            </div>
            </div>
            <div className="w-full h-52 sm:w-44 sm:h-56 rounded-2xl overflow-hidden border border-border shadow-xl shrink-0">
              <Image
                src="/footer-photo.webp"
                alt="Marcin Chrzuszcz"
                width={256}
                height={320}
                quality={90}
                className="w-full h-full object-cover"
              />
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}
