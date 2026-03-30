"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-forest-800 text-white/70 mt-auto">
      <div className="px-4 sm:px-8 lg:px-12 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-sm flex items-center justify-center">
                <span className="text-white font-serif text-lg font-bold">
                  ВТЭ
                </span>
              </div>
              <div>
                <p className="text-white font-serif text-sm font-semibold leading-tight">
                  {t("Вопросы теоретической", "Theoretical")}
                </p>
                <p className="text-white font-serif text-sm font-semibold">
                  {t("экономики", "Economics")}
                </p>
              </div>
            </div>
            <p className="text-xs leading-relaxed">
              {t(
                "Научный журнал Института экономики Российской академии наук. Издается с 2017 года.",
                "Academic journal of the Institute of Economics, Russian Academy of Sciences. Published since 2017."
              )}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white text-sm font-medium mb-3 tracking-wide">
              {t("Навигация", "Navigation")}
            </h4>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  {t("О журнале", "About")}
                </Link>
              </li>
              <li>
                <Link
                  href="/editorial-board"
                  className="hover:text-white transition-colors"
                >
                  {t("Редколлегия", "Editorial Board")}
                </Link>
              </li>
              <li>
                <Link
                  href="/sections"
                  className="hover:text-white transition-colors"
                >
                  {t("Рубрикатор", "Sections")}
                </Link>
              </li>
              <li>
                <Link
                  href="/archive"
                  className="hover:text-white transition-colors"
                >
                  {t("Архив", "Archive")}
                </Link>
              </li>
            </ul>
          </div>

          {/* For authors */}
          <div>
            <h4 className="text-white text-sm font-medium mb-3 tracking-wide">
              {t("Авторам", "For Authors")}
            </h4>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link
                  href="/authors#submit"
                  className="hover:text-white transition-colors"
                >
                  {t("Подать статью", "Submit a Paper")}
                </Link>
              </li>
              <li>
                <Link
                  href="/authors#guidelines"
                  className="hover:text-white transition-colors"
                >
                  {t("Требования к оформлению", "Author Guidelines")}
                </Link>
              </li>
              <li>
                <Link
                  href="/authors#agreement"
                  className="hover:text-white transition-colors"
                >
                  {t("Авторское соглашение", "Author Agreement")}
                </Link>
              </li>
              <li>
                <Link
                  href="/ethics"
                  className="hover:text-white transition-colors"
                >
                  {t("Этика публикаций", "Publication Ethics")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-white text-sm font-medium mb-3 tracking-wide">
              {t("Контакты", "Contacts")}
            </h4>
            <div className="text-sm space-y-1.5">
              <p>{t("Институт экономики РАН", "Institute of Economics RAS")}</p>
              <p>{t("Москва, 117218", "Moscow, 117218")}</p>
              <p>{t("Нахимовский пр-т, 32", "Nakhimovsky prospect, 32")}</p>
              <p>
                <a
                  href="mailto:vte@inecon.ru"
                  className="text-copper-300 hover:text-copper-200 transition-colors"
                >
                  vte@inecon.ru
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <p>
            &copy; 2017&ndash;{new Date().getFullYear()}{" "}
            {t(
              "Вопросы теоретической экономики. Учредитель: ИЭ РАН",
              "Theoretical Economics. Publisher: IE RAS"
            )}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/contacts" className="hover:text-white transition-colors">
              {t("Политика персональных данных", "Privacy Policy")}
            </Link>
            <span className="hover:text-white transition-colors">
              ISSN 2587-7666
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
