"use client";

import Link from "@/components/public/HoverPrefetchLink";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type BreadcrumbLabel = string | { ru: string; en?: string };

interface BreadcrumbItem {
  label: BreadcrumbLabel;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const { t } = useLanguage();
  const render = (label: BreadcrumbLabel) =>
    typeof label === "string" ? label : t(label.ru, label.en);

  return (
    <div className="py-3">
      <nav className="text-xs text-gray-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <span key={index}>
              {index > 0 && <span className="mx-1.5" aria-hidden="true">/</span>}
              {isLast || !item.href ? (
                <span
                  className={
                    isLast ? undefined : "text-forest-600 font-medium"
                  }
                >
                  {render(item.label)}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-forest-600 font-medium hover:text-copper-400 transition-colors"
                >
                  {render(item.label)}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </div>
  );
}
