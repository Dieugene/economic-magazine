"use client";

import Breadcrumbs from "@/components/public/Breadcrumbs";
import PageHeading from "@/components/public/PageHeading";
import DocumentTitle from "@/components/public/DocumentTitle";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ContactsPage() {
  const { t } = useLanguage();

  return (
    <>
      <DocumentTitle ru="Контакты" en="Contacts" />
      <Breadcrumbs
        items={[
          { label: { ru: "Главная", en: "Home" }, href: "/" },
          { label: { ru: "Контакты", en: "Contacts" } },
        ]}
      />

      <section>
        <div className="w-[60px] h-[2px] bg-copper-400 mb-6" />
        <PageHeading
          ru="Контакты"
          en="Contacts"
          level={1}
          className="font-serif text-4xl sm:text-5xl font-bold text-forest-600 leading-tight mb-8"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white border border-stone-400 rounded-sm p-6">
            <h2 className="font-serif text-xl font-semibold text-forest-600 mb-4">
              {t("Редакция журнала", "Journal Editorial")}
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <strong className="text-forest-700">
                  {t(
                    "«Вопросы теоретической экономики»",
                    "“Issues of Economic Theory”"
                  )}
                </strong>
              </p>
              <p>{t("Издатель: Институт экономики РАН", "Publisher: Institute of Economics RAS")}</p>
              <p>ISSN: 2587-7666</p>
              <p>{t("Периодичность: 4 раза в год", "Frequency: 4 times a year")}</p>
              <p>{t("Издаётся с декабря 2017 г.", "Published since December 2017")}</p>
            </div>
          </div>

          <div className="bg-white border border-stone-400 rounded-sm p-6">
            <h2 className="font-serif text-xl font-semibold text-forest-600 mb-4">
              {t("Адрес", "Address")}
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                {t("Нахимовский проспект, 32", "Nakhimovsky prospect, 32")}
                <br />
                {t("Москва", "Moscow")}
                <br />
                {t("Россия", "Russia")}
              </p>
              <p>
                {t("Сайт издателя:", "Publisher’s website:")}{" "}
                <a
                  href="https://inecon.org/institut/ob-institute.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-copper-400 transition-colors underline underline-offset-2"
                >
                  inecon.org
                </a>
              </p>
            </div>
          </div>

          <div className="bg-white border border-stone-400 rounded-sm p-6">
            <h2 className="font-serif text-xl font-semibold text-forest-600 mb-4">
              {t("Электронная почта", "Email")}
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                {t("Для авторов статей:", "For paper authors:")}{" "}
                <a
                  href="mailto:editorqet@inecon.ru"
                  className="text-teal-600 hover:text-copper-400 transition-colors underline underline-offset-2"
                >
                  editorqet@inecon.ru
                </a>
              </p>
              <p>
                {t("Институт экономики РАН:", "Institute of Economics RAS:")}{" "}
                <a
                  href="mailto:ieras@inecon.ru"
                  className="text-teal-600 hover:text-copper-400 transition-colors underline underline-offset-2"
                >
                  ieras@inecon.ru
                </a>
              </p>
            </div>
          </div>

          <div className="bg-stone-200 border border-stone-400 rounded-sm p-6">
            <h2 className="font-serif text-xl font-semibold text-forest-600 mb-4">
              {t("Телефон", "Phone")}
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <a
                  href="tel:+74997241541"
                  className="text-teal-600 hover:text-copper-400 transition-colors underline underline-offset-2"
                >
                  8 (499) 724-15-41
                </a>
                {" "}{t("(тел./факс)", "(tel./fax)")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
