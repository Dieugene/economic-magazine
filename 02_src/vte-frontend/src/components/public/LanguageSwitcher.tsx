"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-1 border-l border-white/20 pl-4">
      <button
        onClick={() => setLang("ru")}
        className={`transition-colors ${
          lang === "ru" ? "text-white font-medium" : "text-white/60 hover:text-white"
        }`}
      >
        RU
      </button>
      <span className="text-white/40">/</span>
      <button
        onClick={() => setLang("en")}
        className={`transition-colors ${
          lang === "en" ? "text-white font-medium" : "text-white/60 hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );
}
