"use client";

import React, { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import { Language, Translations, translations } from "@/lib/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// localStorage is the store; the server can't read it, so SSR renders "es" and
// the saved choice lands on the client's first commit. "storage" covers other
// tabs, the custom event covers this one — localStorage doesn't notify its own
// writer.
const LANG_EVENT = "langchange";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(LANG_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(LANG_EVENT, onChange);
  };
}

// Must return a primitive: React compares snapshots by identity, so a fresh
// object every call would loop forever.
const getSnapshot = (): Language => (localStorage.getItem("lang") === "en" ? "en" : "es");

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(subscribe, getSnapshot, () => "es" as Language);

  // <html lang> follows the store rather than being set at the click. The two
  // only ever disagree on a stale visitor — the cookie SSR reads is capped at a
  // year and localStorage isn't — but that visitor was getting English text
  // under lang="es", which is what a screen reader picks its voice from.
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  function setLanguage(lang: Language) {
    localStorage.setItem("lang", lang);
    document.cookie = `lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    window.dispatchEvent(new Event(LANG_EVENT));
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
