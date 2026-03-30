"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import JournalCover from "@/components/public/JournalCover";

interface Section {
  num: number;
  nameRu: string;
  nameEn: string;
  slug: string;
}

interface LatestIssue {
  year: number;
  number: number;
  sequential_number: number;
  published_date?: string;
}

interface HomeContentProps {
  latestIssue: LatestIssue;
}

const sections: Section[] = [
  { num: 1, nameRu: "Экономическая теория", nameEn: "Economic Theory", slug: "economic-theory" },
  { num: 2, nameRu: "Методология экономической науки", nameEn: "Methodology of Economics", slug: "methodology" },
  { num: 3, nameRu: "От теории к экономической политике", nameEn: "From Theory to Economic Policy", slug: "theory-to-policy" },
  { num: 4, nameRu: "История мысли", nameEn: "History of Thought", slug: "history-of-thought" },
  { num: 5, nameRu: "Междисциплинарные исследования", nameEn: "Interdisciplinary Research", slug: "interdisciplinary" },
  { num: 6, nameRu: "Экономическая история", nameEn: "Economic History", slug: "economic-history" },
  { num: 7, nameRu: "Обзоры и рецензии", nameEn: "Reviews", slug: "reviews" },
];

export default function HomeContent({ latestIssue }: HomeContentProps) {
  const { lang, t } = useLanguage();

  const publishedDate = latestIssue.published_date
    ? new Date(latestIssue.published_date).toLocaleDateString(
        lang === "en" ? "en-US" : "ru-RU",
        { day: "2-digit", month: "2-digit", year: "numeric" }
      )
    : null;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: t("Главная", "Home"), href: "/" },
          { label: t("О журнале", "About") },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
        {/* Left column (2/3 width) */}
        <div className="lg:col-span-2">
          {/* About section */}
          <section>
            <div className="w-[60px] h-[2px] bg-copper-400 mb-6" />
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-forest-600 leading-tight mb-6">
              {t("О журнале", "About the Journal")}
            </h2>
            <div className="prose max-w-none text-gray-700 leading-relaxed space-y-4 text-[15px]">
              {lang === "en" ? (
                <>
                  <p>
                    <strong className="text-forest-700">
                      &ldquo;Issues of Economic Theory&rdquo;
                    </strong>{" "}
                    is e-journal. Registered by the Federal Service for Supervision
                    of Communications, Information Technology and Mass Media; Series
                    El No. FS77-78796 dated July 30, 2020
                  </p>
                  <p>
                    The journal has been published since 2017. Frequency — 4 times
                    a year. Publisher: Institute of Economics, Russian Academy of
                    Sciences, Moscow. ISSN: 2587-7666.
                  </p>
                  <p>
                    Journal focuses on methodological and theoretical issues of
                    interdisciplinary, economic, institutional (including social
                    issues) research. Reviews on the Russian and foreign theoretical
                    research are published. Papers that continue or begin the
                    discussion both papers published in &ldquo;Issues of Economic
                    Theory&rdquo; and other Russian or foreign journals are welcome.
                    We welcome papers both in Russian and English.
                  </p>
                  <p>
                    Decision to publish a paper is made based on double anonymous
                    peer review. When deciding on publication, the only criterion is
                    the quality of the work — originality, importance and validity
                    of the results, clarity of presentation. The author&apos;s
                    affiliation with one or another social movement, a particular
                    political trend, will not influence the decision to publish or
                    reject the paper.
                  </p>
                  <p>
                    All articles are open access and distributed under the terms of
                    the{" "}
                    <Link
                      href="/ethics"
                      className="text-teal-500 underline decoration-copper-200 underline-offset-2 hover:text-copper-400 transition-colors"
                    >
                      Creative Commons 4.0
                    </Link>{" "}
                    license.
                  </p>
                  <p className="italic text-gray-500">
                    With respect, Chief Editor of &ldquo;Issues of Economic
                    Theory&rdquo;{" "}
                    <strong className="text-forest-700 not-italic">
                      P.A. Orekhovsky
                    </strong>
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Электронный журнал{" "}
                    <strong className="text-forest-700">
                      {"\u00AB"}Вопросы теоретической экономики{"\u00BB"}
                    </strong>{" "}
                    является сетевым СМИ. Зарегистрирован Федеральной службой по
                    надзору в сфере связи, информационных технологий и массовых
                    коммуникаций; серия Эл № ФС77-78796 от 30 июля 2020 г.
                  </p>
                  <p>
                    Журнал издаётся с 2017 г. С 2020 г. он стал ежеквартальным.
                    Выходит только в электронном виде. Издатель: Институт экономики
                    РАН, г. Москва. ISSN: 2587-7666.
                  </p>
                  <p>
                    Особенностью журнала является сосредоточенность на
                    методологических и теоретических вопросах междисциплинарных,
                    экономических, институциональных (включая социальные вопросы)
                    исследований. Выходят рецензии и обзоры, посвящённые выпуску
                    монографий отечественных и зарубежных теоретиков. Приветствуются
                    работы, продолжающие или начинающие дискуссию с тезисами,
                    высказанными как на портале {"\u00AB"}Вопросов теоретической
                    экономики{"\u00BB"}, так и других российских и зарубежных
                    изданий.
                  </p>
                  <p>
                    Решения о публикации статей принимаются на основе двойного
                    анонимного рецензирования. При принятии решения о публикации
                    единственным критерием является качество работы —
                    оригинальность, важность и обоснованность результатов, ясность
                    изложения. Принадлежность автора к тому или иному общественному
                    движению, защита в статье тезисов, характерных для того или
                    иного политического течения, не будут влиять на решение о
                    публикации или отвержении статьи.
                  </p>
                  <p>
                    Все статьи находятся в открытом доступе и распространяются на
                    условиях лицензии{" "}
                    <Link
                      href="/ethics"
                      className="text-teal-500 underline decoration-copper-200 underline-offset-2 hover:text-copper-400 transition-colors"
                    >
                      Creative Commons 4.0
                    </Link>
                    .
                  </p>
                  <p className="italic text-gray-500">
                    С уважением, главный редактор {"\u00AB"}Вопросов теоретической
                    экономики{"\u00BB"}{" "}
                    <strong className="text-forest-700 not-italic">
                      П.А. Ореховский
                    </strong>
                  </p>
                </>
              )}
            </div>
          </section>

          {/* Indexing and recognition */}
          <section className="mt-12">
            <div className="bg-white border border-stone-400 rounded-sm p-6 sm:p-8">
              <h3 className="font-serif text-2xl font-semibold text-forest-600 mb-5">
                {t("Индексация и признание", "Indexing and Recognition")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <IndexItem
                    label={t("Перечень ВАК", "HAC List")}
                    value={t("Специальности: 5.2.1, 5.4.2, 5.5.3", "Specialties: 5.2.1, 5.4.2, 5.5.3")}
                  />
                  <IndexItem label="ISSN" value="2587-7666 (Online)" />
                  <IndexItem
                    label={t("Регистрация", "Registration")}
                    value={t("Эл № ФС77-78796 от 30.07.2020", "El No. FS77-78796 dated 30.07.2020")}
                  />
                </div>
                <div className="space-y-3">
                  <IndexItem
                    label={t("Учредитель", "Publisher")}
                    value={t("Институт экономики РАН", "Institute of Economics RAS")}
                  />
                  <IndexItem
                    label={t("Периодичность", "Frequency")}
                    value={t("4 раза в год", "4 times a year")}
                  />
                  <IndexItem
                    label={t("Лицензия", "License")}
                    value="Creative Commons 4.0"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Sections / Rubrics */}
          <section className="mt-12">
            <h3 className="font-serif text-2xl font-semibold text-forest-600 mb-5">
              {t("Рубрики журнала", "Journal Sections")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sections.map((s) => (
                <Link
                  key={s.slug}
                  href={`/sections/${s.slug}`}
                  className={`group flex items-center gap-3 p-4 bg-white border border-stone-400 rounded-sm hover:border-copper-300 hover:shadow-sm transition-all${
                    s.num === 7 ? " sm:col-span-2" : ""
                  }`}
                >
                  <span className="w-8 h-8 bg-forest-50 text-forest-600 font-serif text-sm font-bold rounded-sm flex items-center justify-center group-hover:bg-copper-50 group-hover:text-copper-500 transition-colors">
                    {s.num}
                  </span>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-forest-600 transition-colors">
                    {t(s.nameRu, s.nameEn)}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Right sidebar (1/3 width) */}
        <aside className="lg:col-span-1">
          {/* Latest issue */}
          <div className="bg-white border border-stone-400 rounded-sm overflow-hidden">
            <div className="bg-forest-600 px-5 py-3">
              <h3 className="text-sm font-medium text-white tracking-wide uppercase">
                {t("Свежий номер", "Latest Issue")}
              </h3>
            </div>
            <div className="p-5">
              <Link
                href={`/archive/${latestIssue.year}/${latestIssue.number}`}
                className="block group"
              >
                <JournalCover
                  number={latestIssue.number}
                  year={latestIssue.year}
                  sequential_number={latestIssue.sequential_number}
                  className="mb-4 group-hover:shadow-lg transition-shadow"
                />
              </Link>
              <div className="text-center">
                <p className="font-serif text-lg font-semibold text-forest-600">
                  {"\u2116"} {latestIssue.number} ({latestIssue.sequential_number}) / {latestIssue.year}
                </p>
                {publishedDate && (
                  <p className="text-sm text-gray-500 mt-1">
                    {t("Дата выхода:", "Published:")} {publishedDate}
                  </p>
                )}
                <Link
                  href={`/archive/${latestIssue.year}/${latestIssue.number}`}
                  className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-copper-400 hover:text-copper-500 transition-colors"
                >
                  {t("Содержание номера", "Table of Contents")}
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* For authors */}
          <div className="mt-6 bg-white border border-stone-400 rounded-sm p-5">
            <h3 className="font-serif text-lg font-semibold text-forest-600 mb-3">
              {t("Авторам", "For Authors")}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {t(
                "Принимаются оригинальные статьи по экономической теории, методологии, истории экономической мысли и смежным дисциплинам.",
                "We accept original papers on economic theory, methodology, history of economic thought, and related disciplines."
              )}
            </p>
            <Link
              href="/authors"
              className="inline-flex items-center gap-2 text-sm font-medium bg-forest-600 text-white px-4 py-2 rounded-sm hover:bg-forest-700 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              {t("Подать статью", "Submit a Paper")}
            </Link>
            <div className="mt-3">
              <Link
                href="/authors"
                className="text-sm text-gray-500 hover:text-forest-600 transition-colors underline decoration-stone-400 underline-offset-2"
              >
                {t("Требования к оформлению", "Author Guidelines")}
              </Link>
            </div>
          </div>

          {/* Contacts */}
          <div className="mt-6 bg-stone-200 border border-stone-400 rounded-sm p-5">
            <h3 className="font-serif text-lg font-semibold text-forest-600 mb-3">
              {t("Контакты", "Contacts")}
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>{t("Институт экономики РАН", "Institute of Economics RAS")}</p>
              <p>
                {t("Нахимовский проспект, 32", "Nakhimovsky prospect, 32")}
                <br />
                {t("Москва, 117218", "Moscow, 117218")}
              </p>
              <p>
                <a
                  href="mailto:editorqet@inecon.ru"
                  className="text-teal-500 hover:text-copper-400 transition-colors"
                >
                  editorqet@inecon.ru
                </a>
              </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

function IndexItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-1.5 h-1.5 rounded-full bg-copper-400 mt-2 flex-shrink-0" />
      <div>
        <span className="text-sm font-medium text-forest-700">{label}</span>
        <p className="text-sm text-gray-500 mt-0.5">{value}</p>
      </div>
    </div>
  );
}
