"use client";

import Link from "next/link";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import PageHeading from "@/components/public/PageHeading";
import DocumentTitle from "@/components/public/DocumentTitle";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface SubPage {
  href: string;
  ru: string;
  en: string;
  descRu: string;
  descEn: string;
}

const subPages: SubPage[] = [
  {
    href: "/authors/submit",
    ru: "Подать статью",
    en: "Submit a Paper",
    descRu: "Сервис подачи статей и контакты редакции для отправки рукописи.",
    descEn: "Manuscript submission service and editorial contacts.",
  },
  {
    href: "/authors/submission",
    ru: "Порядок подачи и оформления статей",
    en: "Procedure for Paper Submission",
    descRu: "Требования к структуре, форматированию текста, библиографии и сведениям об авторах.",
    descEn: "Requirements for structure, text formatting, bibliography and author details.",
  },
  {
    href: "/authors/copyright-agreement",
    ru: "Авторское соглашение",
    en: "Copyright Agreement",
    descRu: "Условия передачи прав на публикацию и обработку персональных данных.",
    descEn: "Terms of transfer of publication rights and personal data processing.",
  },
  {
    href: "/authors/review",
    ru: "Порядок рецензирования статей",
    en: "Procedure for Paper Review",
    descRu: "Двойное анонимное рецензирование, сроки, хранение рецензий.",
    descEn: "Double-blind peer review, deadlines, storage of reviews.",
  },
];

export default function AuthorsPage() {
  const { t } = useLanguage();

  return (
    <>
      <DocumentTitle ru="Авторам" en="For Authors" />
      <Breadcrumbs
        items={[
          { label: { ru: "Главная", en: "Home" }, href: "/" },
          { label: { ru: "Авторам", en: "For Authors" } },
        ]}
      />

      <section>
        <div className="w-[60px] h-[2px] bg-copper-400 mb-6" />
        <PageHeading
          ru="Авторам"
          en="For Authors"
          level={1}
          className="font-serif text-4xl sm:text-5xl font-bold text-forest-600 leading-tight mb-8"
        />

        <p className="text-gray-700 leading-relaxed mb-8 text-[15px] max-w-3xl">
          {t(
            "Раздел для авторов журнала «Вопросы теоретической экономики». Здесь собраны порядок подачи и оформления статей, условия авторского соглашения и порядок рецензирования.",
            "Section for authors of the journal “Issues of Economic Theory”. Here you will find the procedure for paper submission and formatting, the copyright agreement and the peer review procedure."
          )}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {subPages.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="block bg-white border border-stone-400 rounded-sm p-6 hover:border-copper-300 hover:shadow-sm transition-all"
            >
              <h2 className="font-serif text-xl font-semibold text-forest-600 mb-2">
                {t(p.ru, p.en)}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t(p.descRu, p.descEn)}
              </p>
              <span className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-copper-500">
                {t("Перейти", "Open")}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
