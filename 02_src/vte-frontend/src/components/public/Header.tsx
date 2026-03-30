"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Header() {
  const { t } = useLanguage();

  return (
    <>
      {/* Top bar */}
      <div className="bg-forest-800 text-white/80 text-xs">
        <div className="px-4 sm:px-8 lg:px-12 py-2 flex justify-between items-center">
          <span className="tracking-wide">ISSN 2587-7666 (Online)</span>
          <div className="flex items-center gap-4">
            <Link
              href="/search"
              className="hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <Search className="w-4 h-4" />
              {t("Поиск", "Search")}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-stone-400">
        <div className="px-4 sm:px-8 lg:px-12 py-6">
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="w-14 h-14 bg-forest-600 rounded-sm flex items-center justify-center flex-shrink-0"
            >
              <span className="text-white font-serif text-2xl font-bold">
                ВТЭ
              </span>
            </Link>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-600 leading-tight tracking-tight">
                {t("Вопросы теоретической экономики", "Theoretical Economics")}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5 tracking-wide">
                {t("Институт экономики РАН", "Institute of Economics RAS")}
              </p>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
