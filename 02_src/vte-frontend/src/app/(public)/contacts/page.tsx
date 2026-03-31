import Breadcrumbs from "@/components/public/Breadcrumbs";

export default function ContactsPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Контакты" },
        ]}
      />

      <section>
        <div className="w-[60px] h-[2px] bg-copper-400 mb-6" />
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest-600 leading-tight mb-8">
          Контакты
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white border border-stone-400 rounded-sm p-6">
            <h2 className="font-serif text-xl font-semibold text-forest-600 mb-4">
              Редакция журнала
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <strong className="text-forest-700">
                  {"\u00AB"}Вопросы теоретической экономики{"\u00BB"}
                </strong>
              </p>
              <p>Издатель: Институт экономики РАН</p>
              <p>ISSN: 2587-7666</p>
              <p>Периодичность: 4 раза в год</p>
              <p>Издается с декабря 2017 г.</p>
            </div>
          </div>

          <div className="bg-white border border-stone-400 rounded-sm p-6">
            <h2 className="font-serif text-xl font-semibold text-forest-600 mb-4">
              Адрес
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                Нахимовский проспект, 32
                <br />
                Москва
                <br />
                Россия
              </p>
              <p>
                Сайт издателя:{" "}
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
              Электронная почта
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                Для авторов статей:{" "}
                <a
                  href="mailto:editorqet@inecon.ru"
                  className="text-teal-600 hover:text-copper-400 transition-colors underline underline-offset-2"
                >
                  editorqet@inecon.ru
                </a>
              </p>
              <p>
                Институт экономики РАН:{" "}
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
              Телефон
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <a
                  href="tel:+74997241541"
                  className="text-teal-600 hover:text-copper-400 transition-colors underline underline-offset-2"
                >
                  8 (499) 724-15-41
                </a>
                {" "}(тел./факс)
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
