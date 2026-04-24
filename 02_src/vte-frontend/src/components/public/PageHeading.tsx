"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

interface PageHeadingProps {
  ru: string;
  en?: string;
  className?: string;
  level?: 1 | 2;
}

export default function PageHeading({
  ru,
  en,
  className = "font-serif text-3xl sm:text-4xl font-bold text-forest-600 leading-tight",
  level = 2,
}: PageHeadingProps) {
  const { t } = useLanguage();
  const Tag = level === 1 ? "h1" : "h2";
  return <Tag className={className}>{t(ru, en)}</Tag>;
}
