"use client";

import Breadcrumbs from "@/components/public/Breadcrumbs";
import PageHeading from "@/components/public/PageHeading";
import DocumentTitle from "@/components/public/DocumentTitle";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <>
      <DocumentTitle ru="Политика персональных данных" en="Privacy Policy" />
      <Breadcrumbs
        items={[
          { label: { ru: "Главная", en: "Home" }, href: "/" },
          { label: { ru: "Политика персональных данных", en: "Privacy Policy" } },
        ]}
      />

      <section>
        <div className="w-[60px] h-[2px] bg-copper-400 mb-6" />
        <PageHeading
          ru="Политика персональных данных"
          en="Privacy Policy"
          level={1}
          className="font-serif text-4xl sm:text-5xl font-bold text-forest-600 leading-tight mb-8"
        />

        <div className="grid grid-cols-1 gap-6 max-w-3xl">
          <div className="bg-white border border-stone-400 rounded-sm p-6">
            <h2 className="font-serif text-xl font-semibold text-forest-600 mb-4">
              {t("Общие положения", "General Provisions")}
            </h2>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>
                {t(
                  "Редакция журнала ",
                  "The editorial office of the journal "
                )}
                <strong className="text-forest-700">
                  {t("«Вопросы теоретической экономики»", "“Issues of Economic Theory”")}
                </strong>
                {t(
                  " обеспечивает защиту персональных данных пользователей сайта и авторов в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».",
                  " ensures the protection of the personal data of website users and authors in accordance with Federal Law No. 152-FZ of 27 July 2006 “On Personal Data”."
                )}
              </p>
              <p>
                {t(
                  "Персональные данные, предоставленные авторами при подаче рукописей, используются исключительно в редакционных целях и не передаются третьим лицам без согласия субъекта данных.",
                  "Personal data provided by authors when submitting manuscripts is used exclusively for editorial purposes and is not transferred to third parties without the data subject’s consent."
                )}
              </p>
            </div>
          </div>

          <div className="bg-white border border-stone-400 rounded-sm p-6">
            <h2 className="font-serif text-xl font-semibold text-forest-600 mb-4">
              {t("Обработка данных", "Data Processing")}
            </h2>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>
                {t(
                  "Сайт журнала может собирать обезличенные технические данные (IP-адрес, тип браузера, время посещения) для целей анализа посещаемости и улучшения работы ресурса.",
                  "The journal’s website may collect anonymised technical data (IP address, browser type, visit time) for the purposes of traffic analysis and improving the resource."
                )}
              </p>
              <p>
                {t(
                  "Контактные данные авторов (ФИО, аффилиация, электронная почта, ORCID) публикуются в составе метаданных статьи в открытом доступе в соответствии с принятой академической практикой.",
                  "Authors’ contact details (name, affiliation, email, ORCID) are published as part of the article metadata in open access in accordance with accepted academic practice."
                )}
              </p>
            </div>
          </div>

          <div className="bg-stone-200 border border-stone-400 rounded-sm p-6">
            <h2 className="font-serif text-xl font-semibold text-forest-600 mb-4">
              {t("Контакты", "Contacts")}
            </h2>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>
                {t(
                  "По вопросам обработки персональных данных обращайтесь в редакцию журнала: ",
                  "For questions regarding personal data processing please contact the editorial office: "
                )}
                <a
                  href="mailto:vte@inecon.ru"
                  className="text-teal-600 hover:text-copper-400 transition-colors underline underline-offset-2"
                >
                  vte@inecon.ru
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
