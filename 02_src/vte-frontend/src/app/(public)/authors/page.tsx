import Breadcrumbs from "@/components/public/Breadcrumbs";

export default function AuthorsPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Авторам" },
        ]}
      />

      <section>
        <div className="w-[60px] h-[2px] bg-copper-400 mb-6" />
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest-600 leading-tight mb-8">
          Авторам
        </h1>

        <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6 text-[15px]">
          <div className="bg-white border border-stone-400 rounded-sm p-6">
            <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">
              Порядок подачи статей
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Подача статей в журнал {"\u00AB"}Вопросы теоретической экономики{"\u00BB"} осуществляется через специальный сервис подачи статей.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Если у Вас возникли сложности с использованием сервиса, пожалуйста, направьте статью на электронный адрес редакции журнала:{" "}
              <a
                href="mailto:editorqet@inecon.ru"
                className="text-teal-500 hover:text-copper-400 transition-colors"
              >
                editorqet@inecon.ru
              </a>
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Обратите внимание, что, направляя статью, Вы соглашаетесь с условиями авторского соглашения и этикой научных публикаций журнала.
            </p>
            <a
              href="https://ms.questionset.ru"
              target="_blank"
              rel="noopener noreferrer"
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
              Подать рукопись (ms.questionset.ru)
            </a>
          </div>

          <div className="bg-white border border-stone-400 rounded-sm p-6">
            <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">
              Требования к оформлению статей
            </h2>
            <div className="text-sm text-gray-600 space-y-3 leading-relaxed">
              <p className="font-medium text-forest-700">В начале статьи указываются:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Фамилия, имя, отчество автора (или авторов через запятую) на русском и английском языках</li>
                <li>Название статьи (на русском и английском языках)</li>
                <li>Аннотация на русском и английском языках (не менее 2 тыс. знаков с пробелами каждая)</li>
                <li>Ключевые слова на русском и английском языках (не более 7 слов и/или словосочетаний)</li>
                <li>Коды по классификации JEL, соответствующие тематике статьи</li>
              </ul>

              <p className="font-medium text-forest-700 pt-2">Требования к оформлению текста:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Шрифт Times New Roman с одинарным межстрочным интервалом; текст статьи — 12-м кеглем</li>
                <li>Поля страницы: верхнее — 1 см, левое — 2,0, нижнее — 1,5, правое — 1,5 см</li>
                <li>Таблицы должны быть пронумерованы и иметь названия</li>
                <li>Формулы оформляются средствами программы Word</li>
                <li>Рисунки желательно готовить в программах векторной графики; фотографии — в форматах TIFF или JPG с разрешением не менее 300 dpi</li>
              </ul>

              <p className="font-medium text-forest-700 pt-2">Библиографический список:</p>
              <p>Начиная с 1 номера 2026 года, к статьям прилагается два списка литературы: ЛИТЕРАТУРА и REFERENCES. В каждом списке литературные источники размещаются в алфавитном порядке.</p>
              <p>В списке ЛИТЕРАТУРА иностранные источники идут после русскоязычных. В списке REFERENCES указываются и иностранные источники, и библиографические сведения на английском языке для русскоязычных работ в едином алфавитном порядке.</p>
              <p>Ссылки в тексте заключаются в квадратные скобки, фамилии автор(ов) — курсивом, год издания — прямым, например: [<em>Иванов, Петров</em>, 2016. С. 77].</p>

              <p className="font-medium text-forest-700 pt-2">Использование ИИ:</p>
              <p>В случае использования автором/соавторами инструментов ИИ, фрагменты исследования, созданные с использованием ИИ, помечаются сноской, в сноске раскрывается характер использования ИИ и использованное ПО.</p>

              <p className="font-medium text-forest-700 pt-2">Сведения об авторе:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Фамилия, имя, отчество (полностью)</li>
                <li>Ученая степень, ученое звание</li>
                <li>Должность и место работы (полное официальное название организации)</li>
                <li>Город (если это не ясно из названия организации)</li>
                <li>Контактный e-mail (будет опубликован в журнале)</li>
              </ul>
            </div>
          </div>

          <div className="bg-white border border-stone-400 rounded-sm p-6">
            <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">
              Порядок рецензирования
            </h2>
            <div className="text-sm text-gray-600 space-y-2 leading-relaxed">
              <p>Издание осуществляет рецензирование всех поступающих в редакцию материалов с целью их экспертной оценки.</p>
              <p>При несоответствии статьи проблематике и стандартам журнала, редакция направляет авторам мотивированный отказ в публикации.</p>
              <p>При выполнении требований на соответствие (включая стандарты оформления) статьи отправляются на рецензирование.</p>
              <p>Рецензент в течение месяца готовит отзыв по форме, указанной в приложении.</p>
              <p>Все рецензенты являются признанными специалистами по тематике рецензируемых материалов и имеют в течение последних 3 лет публикации по тематике рецензируемой статьи.</p>
              <p>При отрицательном отзыве возможно привлечение главным редактором дополнительного внешнего рецензента.</p>
              <p>Рецензии хранятся в редакции издания в течение 5 лет.</p>
            </div>
          </div>

          <div className="bg-stone-200 border border-stone-400 rounded-sm p-6">
            <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">
              Авторское соглашение
            </h2>
            <div className="text-sm text-gray-600 space-y-2 leading-relaxed">
              <p>Автор/соавторы безвозмездно предоставляет(-ют) ФГБУН Институт экономики РАН право на публикацию в журнале {"\u00AB"}Вопросы теоретической экономики{"\u00BB"} в электронном формате своего Произведения.</p>
              <p>Передача права на публикацию охватывает:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Право на воспроизведение Произведения без ограничения тиража экземпляров, в том числе на электронных носителях, в электронных сетях и базах данных</li>
                <li>Право на распространение Произведения любым способом</li>
                <li>Право на допечатную обработку (редактирование, корректорскую правку и т.п.) Произведения</li>
              </ul>
              <p>Автор/соавторы Произведения сохраняют все авторские права на опубликованную статью вместе с правом использования статьи или её части в своих будущих работах, книгах, лекциях, интернет-страницах.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
