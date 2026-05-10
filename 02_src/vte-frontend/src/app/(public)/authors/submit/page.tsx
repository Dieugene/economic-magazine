"use client";

import Link from "next/link";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import PageHeading from "@/components/public/PageHeading";
import DocumentTitle from "@/components/public/DocumentTitle";
import { useLanguage } from "@/lib/i18n/LanguageContext";

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

        {lang === "en" ? <SubmitEn /> : <SubmitRu />}
      </section>
    </>
  );
}

function SubmitRu() {
  return (
    <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6 text-[15px]">
      <div className="bg-white border border-stone-400 rounded-sm p-6">
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          Подача статей в журнал «Вопросы теоретической экономики» осуществляется через специальный{" "}
          <a
            href="https://ms.questionset.ru/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 hover:text-copper-400 transition-colors underline underline-offset-2"
          >
            сервис подачи статей
          </a>
          . Если у Вас возникли сложности с использованием сервиса, пожалуйста, направьте статью на электронный адрес редакции журнала «Вопросы теоретической экономики»:{" "}
          <a
            href="mailto:editorqet@inecon.ru"
            className="text-teal-600 hover:text-copper-400 transition-colors underline underline-offset-2"
          >
            editorqet@inecon.ru
          </a>
          .
        </p>
        <p className="text-sm text-gray-700 leading-relaxed mb-6">
          Обратите внимание, что, направляя статью, Вы соглашаетесь с условиями{" "}
          <Link
            href="/authors/copyright-agreement"
            className="text-teal-600 hover:text-copper-400 transition-colors underline underline-offset-2"
          >
            авторского соглашения
          </Link>{" "}
          и{" "}
          <Link
            href="/ethics"
            className="text-teal-600 hover:text-copper-400 transition-colors underline underline-offset-2"
          >
            этикой
          </Link>{" "}
          научных публикаций журнала «Вопросы теоретической экономики».
        </p>
        <a
          href="https://ms.questionset.ru/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium bg-forest-600 text-white px-4 py-2 rounded-sm hover:bg-forest-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Подать рукопись (ms.questionset.ru)
        </a>
      </div>

      <div className="bg-white border border-stone-400 rounded-sm p-6">
        <h2 className="font-serif text-xl font-semibold text-forest-600 mb-4">См. также</h2>
        <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside ml-2">
          <li>
            <Link href="/authors/submission" className="text-teal-600 hover:text-copper-400 underline underline-offset-2">
              Порядок подачи и оформления статей
            </Link>
          </li>
          <li>
            <Link href="/authors/copyright-agreement" className="text-teal-600 hover:text-copper-400 underline underline-offset-2">
              Авторское соглашение
            </Link>
          </li>
          <li>
            <Link href="/authors/review" className="text-teal-600 hover:text-copper-400 underline underline-offset-2">
              Порядок рецензирования статей
            </Link>
          </li>
          <li>
            <Link href="/ethics" className="text-teal-600 hover:text-copper-400 underline underline-offset-2">
              Этика научных публикаций
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

function SubmitEn() {
  return (
    <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6 text-[15px]">
      <div className="bg-white border border-stone-400 rounded-sm p-6">
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          Paper submission to the journal &ldquo;Issues of Economic Theory&rdquo; is carried out via a dedicated{" "}
          <a
            href="https://ms.questionset.ru/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 hover:text-copper-400 transition-colors underline underline-offset-2"
          >
            paper submission service
          </a>
          . If you are unable to submit your paper through the service, please send your paper to the editorial e-mail address:{" "}
          <a
            href="mailto:editorqet@inecon.ru"
            className="text-teal-600 hover:text-copper-400 transition-colors underline underline-offset-2"
          >
            editorqet@inecon.ru
          </a>
          .
        </p>
        <p className="text-sm text-gray-700 leading-relaxed mb-6">
          Please note that by submitting a paper you agree to the terms of the{" "}
          <Link
            href="/authors/copyright-agreement"
            className="text-teal-600 hover:text-copper-400 transition-colors underline underline-offset-2"
          >
            copyright agreement
          </Link>{" "}
          and the{" "}
          <Link
            href="/ethics"
            className="text-teal-600 hover:text-copper-400 transition-colors underline underline-offset-2"
          >
            ethics
          </Link>{" "}
          of scientific publications of the journal &ldquo;Issues of Economic Theory&rdquo;.
        </p>
        <a
          href="https://ms.questionset.ru/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium bg-forest-600 text-white px-4 py-2 rounded-sm hover:bg-forest-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Submit a Manuscript (ms.questionset.ru)
        </a>
      </div>

      <div className="bg-white border border-stone-400 rounded-sm p-6">
        <h2 className="font-serif text-xl font-semibold text-forest-600 mb-4">See also</h2>
        <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside ml-2">
          <li>
            <Link href="/authors/submission" className="text-teal-600 hover:text-copper-400 underline underline-offset-2">
              Procedure for Paper Submission
            </Link>
          </li>
          <li>
            <Link href="/authors/copyright-agreement" className="text-teal-600 hover:text-copper-400 underline underline-offset-2">
              Copyright Agreement
            </Link>
          </li>
          <li>
            <Link href="/authors/review" className="text-teal-600 hover:text-copper-400 underline underline-offset-2">
              Procedure for Paper Review
            </Link>
          </li>
          <li>
            <Link href="/ethics" className="text-teal-600 hover:text-copper-400 underline underline-offset-2">
              Ethics of Scientific Publications
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
