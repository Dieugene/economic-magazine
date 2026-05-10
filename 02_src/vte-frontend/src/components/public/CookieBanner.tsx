"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const STORAGE_KEY = "vte_cookie_consent";

export default function CookieBanner() {
  const { lang, t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) setVisible(true);
    } catch {
      // localStorage недоступен (приватный режим/SSR-edge) — не показываем баннер
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // ignore
    }
    setVisible(false);
  };

  const handleDecline = () => {
    window.location.href = "https://rkn.gov.ru/";
  };

  if (!visible) return null;

  const policyLink = (
    <Link
      href="/privacy"
      className="underline decoration-copper-300 underline-offset-2 hover:text-copper-200"
    >
      {t(
        "Политикой в отношении обработки персональных данных",
        "Personal Data Processing Policy"
      )}
    </Link>
  );

  return (
    <div
      role="region"
      aria-label={
        lang === "en" ? "Cookie notice" : "Уведомление об использовании cookie"
      }
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-forest-800/95 text-white/90 shadow-2xl backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:px-12 lg:py-5">
        <p className="text-sm leading-relaxed">
          {lang === "en" ? (
            <>
              By using the website{" "}
              <a
                href="https://questionset.ru"
                className="text-copper-300 hover:text-copper-200"
              >
                https://questionset.ru
              </a>
              , I (hereinafter referred to as the &ldquo;User&rdquo; or
              &ldquo;Personal Data Subject&rdquo;) consent to the processing of
              personal data on this site on the terms set forth in the{" "}
              {policyLink} of questionset.ru.
            </>
          ) : (
            <>
              Используя сайт{" "}
              <a
                href="https://questionset.ru"
                className="text-copper-300 hover:text-copper-200"
              >
                https://questionset.ru
              </a>
              , я (далее &mdash; &laquo;Пользователь&raquo; или &laquo;Субъект
              персональных данных&raquo;) даю согласие на обработку персональных
              данных на этом сайте на условиях, установленных {policyLink}{" "}
              сайта questionset.ru.
            </>
          )}
        </p>
        <div className="flex flex-wrap gap-3 lg:flex-shrink-0">
          <button
            type="button"
            onClick={handleAccept}
            className="inline-flex items-center justify-center rounded-sm bg-copper-400 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-copper-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-copper-200 focus-visible:ring-offset-2 focus-visible:ring-offset-forest-800"
          >
            {t("Согласен", "Accept")}
          </button>
          <button
            type="button"
            onClick={handleDecline}
            className="inline-flex items-center justify-center rounded-sm border border-white/30 px-5 py-2 text-sm font-medium text-white/90 transition-colors hover:border-white/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-forest-800"
          >
            {t("Не согласен", "Decline")}
          </button>
        </div>
      </div>
    </div>
  );
}
