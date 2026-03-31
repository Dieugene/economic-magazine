import Breadcrumbs from "@/components/public/Breadcrumbs";

export default function PrivacyPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Политика персональных данных" },
        ]}
      />

      <section>
        <div className="w-[60px] h-[2px] bg-copper-400 mb-6" />
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest-600 leading-tight mb-8">
          Политика персональных данных
        </h1>

        <div className="grid grid-cols-1 gap-6 max-w-3xl">
          <div className="bg-white border border-stone-400 rounded-sm p-6">
            <h2 className="font-serif text-xl font-semibold text-forest-600 mb-4">
              Общие положения
            </h2>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>
                Редакция журнала{" "}
                <strong className="text-forest-700">
                  {"\u00AB"}Вопросы теоретической экономики{"\u00BB"}
                </strong>{" "}
                обеспечивает защиту персональных данных пользователей сайта и
                авторов в соответствии с Федеральным законом от 27.07.2006
                № 152-ФЗ «О персональных данных».
              </p>
              <p>
                Персональные данные, предоставленные авторами при подаче
                рукописей, используются исключительно в редакционных целях и не
                передаются третьим лицам без согласия субъекта данных.
              </p>
            </div>
          </div>

          <div className="bg-white border border-stone-400 rounded-sm p-6">
            <h2 className="font-serif text-xl font-semibold text-forest-600 mb-4">
              Обработка данных
            </h2>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>
                Сайт журнала может собирать обезличенные технические данные
                (IP-адрес, тип браузера, время посещения) для целей анализа
                посещаемости и улучшения работы ресурса.
              </p>
              <p>
                Контактные данные авторов (ФИО, аффилиация, электронная почта,
                ORCID) публикуются в составе метаданных статьи в открытом
                доступе в соответствии с принятой академической практикой.
              </p>
            </div>
          </div>

          <div className="bg-stone-200 border border-stone-400 rounded-sm p-6">
            <h2 className="font-serif text-xl font-semibold text-forest-600 mb-4">
              Контакты
            </h2>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>
                По вопросам обработки персональных данных обращайтесь в
                редакцию журнала:{" "}
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
