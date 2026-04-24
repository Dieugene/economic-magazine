"use client";

import { useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface DocumentTitleProps {
  ru: string;
  en: string;
}

const SITE_RU = "Вопросы теоретической экономики";
const SITE_EN = "Issues of Economic Theory";

export default function DocumentTitle({ ru, en }: DocumentTitleProps) {
  const { lang } = useLanguage();

  useEffect(() => {
    const site = lang === "en" ? SITE_EN : SITE_RU;
    const page = lang === "en" ? en : ru;
    const desired = page ? `${page} — ${site}` : site;

    const apply = () => {
      if (document.title !== desired) document.title = desired;
      if (document.documentElement.lang !== lang) {
        document.documentElement.lang = lang;
      }
    };
    apply();

    // Next.js client-side metadata may overwrite document.title shortly
    // after our update. Watch the <title> element and re-apply if needed.
    const titleEl = document.querySelector("head > title");
    if (!titleEl) return;
    const observer = new MutationObserver(apply);
    observer.observe(titleEl, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, [lang, ru, en]);

  return null;
}
