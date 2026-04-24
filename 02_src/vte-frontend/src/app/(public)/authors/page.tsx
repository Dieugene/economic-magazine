"use client";

import Breadcrumbs from "@/components/public/Breadcrumbs";
import PageHeading from "@/components/public/PageHeading";
import DocumentTitle from "@/components/public/DocumentTitle";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function AuthorsPage() {
  const { lang } = useLanguage();

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

        {lang === "en" ? <AuthorsEn /> : <AuthorsRu />}
      </section>
    </>
  );
}

function AuthorsRu() {
  return (
    <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6 text-[15px]">
      <div className="bg-white border border-stone-400 rounded-sm p-6">
        <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">
          Порядок подачи статей
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          Подача статей в журнал «Вопросы теоретической экономики» осуществляется через специальный сервис подачи статей.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          Если у Вас возникли сложности с использованием сервиса, пожалуйста, направьте статью на электронный адрес редакции журнала:{" "}
          <a
            href="mailto:editorqet@inecon.ru"
            className="text-teal-600 hover:text-copper-400 transition-colors underline underline-offset-2"
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
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
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
          <p>Автор/соавторы безвозмездно предоставляет(-ют) ФГБУН Институт экономики РАН право на публикацию в журнале «Вопросы теоретической экономики» в электронном формате своего Произведения.</p>
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
  );
}

function AuthorsEn() {
  return (
    <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6 text-[15px]">
      <div className="bg-white border border-stone-400 rounded-sm p-6">
        <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">
          Procedure for Paper Submission
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          Papers for the journal “Issues of Economic Theory” are submitted through a dedicated paper submission service.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          If you have any difficulty using the service, please send the article to the editorial email address:{" "}
          <a
            href="mailto:editorqet@inecon.ru"
            className="text-teal-600 hover:text-copper-400 transition-colors underline underline-offset-2"
          >
            editorqet@inecon.ru
          </a>
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          Please note that by submitting a paper you agree to the terms of the copyright agreement and the journal’s publication ethics.
        </p>
        <a
          href="https://ms.questionset.ru"
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
        <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">
          Manuscript Formatting Requirements
        </h2>
        <div className="text-sm text-gray-600 space-y-3 leading-relaxed">
          <p className="font-medium text-forest-700">The beginning of the article must include:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Author’s (or authors’, separated by commas) surname, name and patronymic in Russian and English</li>
            <li>Article title in Russian and English</li>
            <li>Abstract in Russian and English (at least 2,000 characters with spaces each)</li>
            <li>Keywords in Russian and English (no more than 7 words or word combinations)</li>
            <li>JEL classification codes corresponding to the topic of the article</li>
          </ul>

          <p className="font-medium text-forest-700 pt-2">Text formatting requirements:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Times New Roman font with single line spacing; main text — 12 pt</li>
            <li>Page margins: top — 1 cm, left — 2.0 cm, bottom — 1.5 cm, right — 1.5 cm</li>
            <li>Tables must be numbered and titled</li>
            <li>Formulas must be created with Word tools</li>
            <li>Figures should preferably be prepared in vector graphics programs; photos — in TIFF or JPG with at least 300 dpi resolution</li>
          </ul>

          <p className="font-medium text-forest-700 pt-2">Bibliography:</p>
          <p>Starting from issue 1, 2026, two reference lists are attached to each article: ЛИТЕРАТУРА (Russian) and REFERENCES (English). Sources in each list are arranged alphabetically.</p>
          <p>In ЛИТЕРАТУРА foreign sources follow Russian-language ones. REFERENCES contains both foreign sources and English bibliographic information for Russian-language works in a single alphabetical order.</p>
          <p>In-text citations are enclosed in square brackets, with the author(s) surname in italics and year in regular type, for example: [<em>Ivanov, Petrov</em>, 2016, p. 77].</p>

          <p className="font-medium text-forest-700 pt-2">Use of AI:</p>
          <p>If the author/co-authors used AI tools, the fragments of the study created with AI must be marked with a footnote that discloses the nature of AI use and the software used.</p>

          <p className="font-medium text-forest-700 pt-2">Author information:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Full surname, name and patronymic</li>
            <li>Academic degree and academic title</li>
            <li>Position and place of work (full official name of the organization)</li>
            <li>City (if not clear from the name of the organization)</li>
            <li>Contact e-mail (will be published in the journal)</li>
          </ul>
        </div>
      </div>

      <div className="bg-white border border-stone-400 rounded-sm p-6">
        <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">
          Procedure for Paper Review
        </h2>
        <div className="text-sm text-gray-600 space-y-2 leading-relaxed">
          <p>The journal reviews all materials submitted to the editorial office for the purpose of expert assessment.</p>
          <p>If the paper does not correspond to the problems and standards of the journal, the editorial board sends the authors a reasoned refusal to publish.</p>
          <p>If the manuscript meets the requirements (including formatting standards), articles are sent for review.</p>
          <p>The reviewer prepares a review within a month in the form indicated in the appendix.</p>
          <p>All reviewers are recognized experts on the topics of the peer-reviewed materials and have publications discussing similar topics over the past three years.</p>
          <p>In case of a negative review, the editor-in-chief may engage an additional external reviewer within the same time frame.</p>
          <p>Reviews are stored in the editorial office for five years.</p>
        </div>
      </div>

      <div className="bg-stone-200 border border-stone-400 rounded-sm p-6">
        <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">
          Copyright Agreement
        </h2>
        <div className="text-sm text-gray-600 space-y-2 leading-relaxed">
          <p>The author/co-authors grant the Institute of Economics of the Russian Academy of Sciences the free of charge right to publish their Work in electronic format in the journal “Issues of Economic Theory”.</p>
          <p>The transfer of publication rights covers:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>The right to reproduce the Work without circulation limits, including on electronic media, in electronic networks and databases</li>
            <li>The right to distribute the Work by any means</li>
            <li>The right to pre-press editing of the Work</li>
          </ul>
          <p>The author/co-authors of the Work retain all copyrights to the published article together with the right to use the article or part of it in their future works, books, lectures and web pages.</p>
        </div>
      </div>
    </div>
  );
}
