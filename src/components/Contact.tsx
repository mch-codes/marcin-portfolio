"use client";

import Image from "next/image";
import { useState } from "react";
import { m, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
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
    <section id="contact" className="py-28 md:py-36 relative">
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

                {status === "error" && (
                  <p className="text-xs text-red-400">{t.contact.error}</p>
                )}

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
              </form>
            )}
          </m.div>

          {/* Right: photo + contact info */}
          <m.div
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="md:col-span-2 flex flex-row gap-6 items-start"
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
                Location
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
            <div className="w-32 h-40 rounded-2xl overflow-hidden border border-border shadow-xl shrink-0">
              <Image
                src="/5D159DE1-073C-4D6C-BE48-24B3137F7505_1_105_c.jpeg"
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
