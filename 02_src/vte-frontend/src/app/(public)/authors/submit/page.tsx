"use client";

import Breadcrumbs from "@/components/public/Breadcrumbs";
import PageHeading from "@/components/public/PageHeading";
import DocumentTitle from "@/components/public/DocumentTitle";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import SubmissionForm from "@/components/public/submit/SubmissionForm";

export default function AuthorsSubmitPage() {
  const { lang } = useLanguage();

  return (
    <>
      <DocumentTitle ru="Подать статью" en="Submit a Paper" />
      <Breadcrumbs
        items={[
          { label: { ru: "Главная", en: "Home" }, href: "/" },
          { label: { ru: "Авторам", en: "For Authors" }, href: "/authors" },
          { label: { ru: "Подать статью", en: "Submit a Paper" } },
        ]}
      />

      <section>
        <div className="w-[60px] h-[2px] bg-copper-400 mb-6" />
        <PageHeading
          ru="Подать статью"
          en="Submit a Paper"
          level={1}
          className="font-serif text-4xl sm:text-5xl font-bold text-forest-600 leading-tight mb-8"
        />

        {lang === "en" ? (
          <div className="bg-white border border-stone-400 rounded-sm p-6 max-w-2xl">
            <p className="text-sm text-gray-700 leading-relaxed">
              The manuscript submission form is currently available in Russian only.
              English-speaking authors are kindly asked to send the manuscript to{" "}
              <a href="mailto:editorqet@inecon.ru" className="text-teal-600 underline underline-offset-2 hover:text-copper-400">
                editorqet@inecon.ru
              </a>.
            </p>
          </div>
        ) : (
          <SubmissionForm />
        )}
      </section>
    </>
  );
}
