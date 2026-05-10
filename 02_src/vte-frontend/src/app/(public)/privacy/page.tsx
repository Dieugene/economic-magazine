"use client";

import Link from "next/link";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import PageHeading from "@/components/public/PageHeading";
import DocumentTitle from "@/components/public/DocumentTitle";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function PrivacyPage() {
  const { lang } = useLanguage();

  return (
    <>
      <DocumentTitle
        ru="Политика обработки персональных данных"
        en="Personal Data Processing Policy"
      />
      <Breadcrumbs
        items={[
          { label: { ru: "Главная", en: "Home" }, href: "/" },
          {
            label: {
              ru: "Политика обработки персональных данных",
              en: "Personal Data Processing Policy",
            },
          },
        ]}
      />

      <section>
        <div className="w-[60px] h-[2px] bg-copper-400 mb-6" />
        <PageHeading
          ru="Политика обработки персональных данных"
          en="Personal Data Processing Policy"
          level={1}
          className="font-serif text-4xl sm:text-5xl font-bold text-forest-600 leading-tight mb-8"
        />

        {lang === "en" ? <PrivacyEn /> : <PrivacyRu />}
      </section>
    </>
  );
}

function PrivacyRu() {
  return (
    <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6 text-[15px]">
      <div className="bg-white border border-stone-400 rounded-sm p-6 space-y-4 text-sm leading-relaxed">
        <h2 className="font-serif text-xl font-semibold text-forest-600">Общие положения</h2>
        <p>
          Редакция журнала <strong className="text-forest-700">«Вопросы теоретической экономики»</strong> обеспечивает защиту персональных данных пользователей сайта и авторов в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».
        </p>
        <p>
          Персональные данные, предоставленные авторами при подаче рукописей, используются исключительно в редакционных целях и не передаются третьим лицам без согласия субъекта данных.
        </p>
        <p>
          Условия обработки и хранения персональных данных авторов изложены в{" "}
          <Link
            href="/authors/copyright-agreement"
            className="text-teal-600 hover:text-copper-400 underline underline-offset-2"
          >
            авторском соглашении
          </Link>
          .
        </p>
      </div>

      <div className="bg-white border border-stone-400 rounded-sm p-6 space-y-4 text-sm leading-relaxed">
        <h2 className="font-serif text-xl font-semibold text-forest-600">Состав обрабатываемых данных</h2>
        <p>В соответствии с авторским соглашением, при подаче статьи редакция получает право обработки следующих персональных данных автора/соавторов без ограничения по сроку:</p>
        <ul className="list-disc list-inside space-y-1.5 ml-2">
          <li>фамилия, имя, отчество;</li>
          <li>ORCID iD; Researcher ID (WoS); Scopus ID; SPIN-код РИНЦ;</li>
          <li>сведения об образовании, учёных степенях и званиях;</li>
          <li>сведения о месте работы и занимаемой должности;</li>
          <li>сведения о контактной информации для переписки и переговоров.</li>
        </ul>
        <p>Сайт журнала может собирать обезличенные технические данные (IP-адрес, тип браузера, время посещения) для целей анализа посещаемости и улучшения работы ресурса.</p>
        <p>Контактные данные авторов (ФИО, аффилиация, электронная почта, ORCID) публикуются в составе метаданных статьи в открытом доступе в соответствии с принятой академической практикой.</p>
      </div>

      <div className="bg-white border border-stone-400 rounded-sm p-6 space-y-3 text-sm leading-relaxed">
        <h2 className="font-serif text-xl font-semibold text-forest-600">Цели обработки</h2>
        <ul className="list-disc list-inside space-y-1.5 ml-2">
          <li>рассмотрение поступивших рукописей и их рецензирование;</li>
          <li>подготовка статей к публикации, выпуск и распространение журнала в электронном виде;</li>
          <li>идентификация авторов в наукометрических базах (РИНЦ, ORCID, Scopus и др.);</li>
          <li>ведение переписки с авторами, рецензентами и членами редакционной коллегии;</li>
          <li>исполнение обязательств в рамках авторского соглашения.</li>
        </ul>
      </div>

      <div className="bg-stone-200 border border-stone-400 rounded-sm p-6 text-sm leading-relaxed">
        <h2 className="font-serif text-xl font-semibold text-forest-600 mb-2">Контакты</h2>
        <p>
          По вопросам обработки персональных данных обращайтесь в редакцию журнала:{" "}
          <a
            href="mailto:editorqet@inecon.ru"
            className="text-teal-600 hover:text-copper-400 transition-colors underline underline-offset-2"
          >
            editorqet@inecon.ru
          </a>
        </p>
      </div>
    </div>
  );
}

function PrivacyEn() {
  return (
    <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6 text-[15px]">
      <div className="bg-stone-200 border border-stone-400 rounded-sm p-6 text-sm leading-relaxed">
        <p className="font-medium text-forest-700">English version coming soon.</p>
        <p className="mt-2">
          See the{" "}
          <Link
            href="/privacy"
            className="text-teal-600 hover:text-copper-400 transition-colors underline underline-offset-2"
          >
            Russian version
          </Link>{" "}
          of the Personal Data Processing Policy.
        </p>
        <p className="mt-2">
          For questions regarding personal data processing please contact the editorial office:{" "}
          <a
            href="mailto:editorqet@inecon.ru"
            className="text-teal-600 hover:text-copper-400 transition-colors underline underline-offset-2"
          >
            editorqet@inecon.ru
          </a>
          .
        </p>
      </div>
    </div>
  );
}
