"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface NavItem {
  key: string;
  labelRu: string;
  labelEn: string;
  href: string;
  dropdown?: { labelRu: string; labelEn: string; href: string }[];
}

const rubricatorItems = [
  { labelRu: "Экономическая теория", labelEn: "Economic Theory", href: "/sections/economic-theory" },
  { labelRu: "Методология экономической науки", labelEn: "Methodology of Economics", href: "/sections/methodology" },
  { labelRu: "От теории к экономической политике", labelEn: "From Theory to Economic Policy", href: "/sections/theory-to-policy" },
  { labelRu: "История мысли", labelEn: "History of Thought", href: "/sections/history-of-thought" },
  { labelRu: "Междисциплинарные исследования", labelEn: "Interdisciplinary Research", href: "/sections/interdisciplinary" },
  { labelRu: "Экономическая история", labelEn: "Economic History", href: "/sections/economic-history" },
  { labelRu: "Обзоры и рецензии", labelEn: "Reviews", href: "/sections/reviews" },
];

const archiveItems = [
  { labelRu: "2026", labelEn: "2026", href: "/archive/2026" },
  { labelRu: "2025", labelEn: "2025", href: "/archive/2025" },
  { labelRu: "2024", labelEn: "2024", href: "/archive/2024" },
  { labelRu: "2023", labelEn: "2023", href: "/archive/2023" },
  { labelRu: "2022", labelEn: "2022", href: "/archive/2022" },
];

const navItems: NavItem[] = [
  { key: "about", labelRu: "О журнале", labelEn: "About", href: "/" },
  { key: "editorial", labelRu: "Редколлегия", labelEn: "Editorial Board", href: "/editorial-board" },
  { key: "rubrics", labelRu: "Рубрикатор", labelEn: "Sections", href: "/sections", dropdown: rubricatorItems },
  { key: "archive", labelRu: "Архив", labelEn: "Archive", href: "/archive", dropdown: archiveItems },
  { key: "authors", labelRu: "Авторам", labelEn: "For Authors", href: "/authors" },
  { key: "ethics", labelRu: "Этика публикаций", labelEn: "Publication Ethics", href: "/ethics" },
  { key: "contacts", labelRu: "Контакты", labelEn: "Contacts", href: "/contacts" },
];

interface NavigationProps {
  activeItem?: string;
}

export default function Navigation({ activeItem }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { t } = useLanguage();

  return (
    <nav className="border-t border-stone-300 bg-stone-50">
      <div className="px-4 sm:px-8 lg:px-12">
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0">
          {navItems.map((item) => {
            const isActive = activeItem === item.key;
            const label = t(item.labelRu, item.labelEn);

            if (item.dropdown) {
              return (
                <div
                  key={item.key}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.key)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={`nav-link px-4 py-3 text-sm font-medium inline-flex items-center gap-1 transition-colors ${
                      isActive
                        ? "text-forest-600 bg-copper-50 border-b-2 border-copper-400"
                        : "text-gray-600 hover:text-forest-600"
                    }`}
                  >
                    {label}
                    <ChevronDown className="w-3 h-3" />
                  </Link>
                  {openDropdown === item.key && (
                    <div className="absolute top-full left-0 bg-white shadow-lg border border-stone-300 rounded-sm py-1 min-w-[280px] z-50">
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-stone-100 hover:text-forest-600"
                        >
                          {t(sub.labelRu, sub.labelEn)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.key}
                href={item.href}
                className={`nav-link px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-forest-600 bg-copper-50 border-b-2 border-copper-400"
                    : "text-gray-600 hover:text-forest-600"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden py-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center gap-2 text-sm font-medium text-forest-600"
          >
            <Menu className="w-5 h-5" />
            {t("Меню", "Menu")}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden pb-4 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`block px-3 py-2 text-sm ${
                activeItem === item.key
                  ? "font-medium text-forest-600 bg-copper-50 rounded"
                  : "text-gray-600"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t(item.labelRu, item.labelEn)}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
