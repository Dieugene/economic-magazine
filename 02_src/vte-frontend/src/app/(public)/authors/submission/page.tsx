"use client";

import Link from "@/components/public/HoverPrefetchLink";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import PageHeading from "@/components/public/PageHeading";
import DocumentTitle from "@/components/public/DocumentTitle";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import TemplateDownloadButton from "@/components/public/submit/TemplateDownloadButton";

export default function AuthorsSubmissionPage() {
  const { lang } = useLanguage();

  return (
    <>
      <DocumentTitle ru="Порядок подачи и оформления статей" en="Procedure for Paper Submission" />
      <Breadcrumbs
        items={[
          { label: { ru: "Главная", en: "Home" }, href: "/" },
          { label: { ru: "Авторам", en: "For Authors" }, href: "/authors" },
          { label: { ru: "Порядок подачи и оформления статей", en: "Procedure for Paper Submission" } },
        ]}
      />

      <section>
        <div className="w-[60px] h-[2px] bg-copper-400 mb-6" />
        <PageHeading
          ru="Порядок подачи и оформления статей"
          en="Procedure for Paper Submission"
          level={1}
          className="font-serif text-4xl sm:text-5xl font-bold text-forest-600 leading-tight mb-8"
        />

        {lang === "en" ? <SubmissionEn /> : <SubmissionRu />}
      </section>
    </>
  );
}

function SubmissionRu() {
  return (
    <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6 text-[15px]">
      <div className="bg-stone-50 border border-stone-300 rounded-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 not-prose mb-6">
        <p className="text-sm text-gray-700 m-0">
          Скачайте шаблон оформления статей.
        </p>
        <TemplateDownloadButton />
      </div>
      <div className="bg-white border border-stone-400 rounded-sm p-6">
        <p className="text-sm text-gray-700 leading-relaxed">
          Подача статей в журнал «Вопросы теоретической экономики» осуществляется через специальный{" "}
          <Link
            href="/authors/submit"
            className="text-teal-600 hover:text-copper-400 transition-colors underline underline-offset-2"
          >
            сервис подачи статей
          </Link>
          . Если у Вас возникли сложности с использованием сервиса, пожалуйста, направьте статью на электронный адрес редакции журнала «Вопросы теоретической экономики»:{" "}
          <a
            href="mailto:editorqet@inecon.ru"
            className="text-teal-600 hover:text-copper-400 transition-colors underline underline-offset-2"
          >
            editorqet@inecon.ru
          </a>
          .
        </p>
        <p className="text-sm text-gray-700 leading-relaxed mt-3">
          Обратите внимание, что, направляя статью, Вы соглашаетесь с условиями{" "}
          <Link
            href="/authors/copyright-agreement"
            className="text-teal-600 hover:text-copper-400 transition-colors underline underline-offset-2"
          >
            авторского соглашения
          </Link>
          ,{" "}
          <Link
            href="/privacy"
            className="text-teal-600 hover:text-copper-400 transition-colors underline underline-offset-2"
          >
            политикой обработки персональных данных
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
      </div>

      <div className="bg-white border border-stone-400 rounded-sm p-6">
        <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">Требования к оформлению статей</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          Для ускорения работы по рецензированию и редактированию статей просим авторов придерживаться следующих распространённых требований к оформлению своих исследований.
        </p>

        <h3 className="font-serif text-lg font-semibold text-forest-700 mt-5 mb-2">1. В начале статьи указываются:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
          <li>Фамилия, имя, отчество автора (или авторов через запятую) на русском и английском языках.</li>
          <li>Название статьи (на русском и английском языках).</li>
          <li>Аннотация на русском и английском языках (не менее 2 тыс. знаков с пробелами каждая).</li>
          <li>Ключевые слова на русском и английском языках (не более 7 слов и/или словосочетаний).</li>
          <li>Коды по классификации JEL, соответствующие тематике статьи на основе алфавитно-цифровой классификационной системы по экономической теории (Journal of Economic Literature).</li>
        </ul>

        <h3 className="font-serif text-lg font-semibold text-forest-700 mt-5 mb-2">2. Требования к оформлению текста:</h3>
        <div className="text-sm text-gray-700 space-y-3 leading-relaxed">
          <p><strong>а)</strong> шрифт Times New Roman с одинарным межстрочным интервалом; фамилия автора – 12-м кеглем светлым, прямым, прописными буквами; название статьи – 12-м кеглем полужирным, прямым, прописными буквами; ключевые слова, аннотация, сноски – 10-м кеглем светлым, прямым; текст статьи – 12-м кеглем. Поля страницы: верхнее – 1 см, левое – 2,0, нижнее – 1,5, правое – 1,5 см.</p>
          <p><strong>б)</strong> таблицы должны быть пронумерованы и иметь названия, а текст должен содержать ссылку на таблицу по соответствующему номеру (например, Табл. 1). Если в таблицах содержатся сноски, они размещаются под таблицей. Для знаков сносок в таблицах используются «звездочки» (*) или буквы. Ссылки на источники размещаются под таблицей после сносок и предваряются словом «Источник:» («Источники:») или «Рассчитано по:».</p>
          <p><strong>в)</strong> формулы оформляются средствами программы Word, а сложные формулы набираются во встроенном редакторе формул. Если в тексте содержатся ссылки на формулы, то формулы должны быть пронумерованы.</p>
          <p><strong>г)</strong> рисунки (диаграммы, схемы, графики) желательно готовить в программах векторной графики. Фотографии должны быть в форматах TIFF или JPG с разрешением не менее 300 dpi. Все рисунки должны быть пронумерованы и иметь подрисуночные подписи, а текст должен содержать ссылки на рисунки по соответствующему номеру, например: Рис. 12. Сноски, примечания, содержащиеся в рисунках, размещаются непосредственно под рисунками. Для знаков сносок используются «звездочки» (*), буквы или другие знаки, но отличные от знаков сносок таблиц и номеров постраничных сносок в основном тексте. Ссылки на источники размещаются под рисунками после сносок и предваряются словом «Источник:» («Источники:»). Иллюстрации (диаграммы, схемы, графики), которые готовились в программе Excel, помимо размещения в самой статье, передаются отдельным файлом .xlsx. На графиках и диаграммах единицы измерения указываются один раз по осям координат. Шрифт – Times. Иллюстрации, которые готовились в векторных графических программах (Adobe Illustrator, CorelDraw), необходимо предоставить в векторном формате *.eps. Шрифт – Times. Растровые иллюстрации (фотографии, сканированные изображения) предоставляются размером 170 мм по ширине в разрешении 300 dpi и цветовой модели RGB. Для формул, которые могут быть записаны средствами Word, не использовать встроенный редактор формул. При использовании <Link href="/authors/submit" className="text-teal-600 hover:text-copper-400 underline underline-offset-2">онлайн-сервиса подачи статей</Link> файлы загружаются в разделе «Дополнительные материалы одним файлом в .zip архиве».</p>
        </div>

        <h3 className="font-serif text-lg font-semibold text-forest-700 mt-5 mb-2">3. Пристатейный библиографический список</h3>
        <div className="text-sm text-gray-700 space-y-3 leading-relaxed">
          <p>Пристатейный библиографический список в конце статьи на русском и английском языках. Примечания, ссылки, библиографический список оформляются в соответствии с приведёнными примерами. Начиная с 1 номера 2026 года, к статьям прилагается два списка литературы: ЛИТЕРАТУРА и REFERENCES. В каждом списке литературные источники размещаются в алфавитном порядке. В списке ЛИТЕРАТУРА иностранные источники идут после русскоязычных. В списке REFERENCES указываются и иностранные источники, и библиографические сведения на английском языке для русскоязычных работ в едином алфавитном порядке. При подготовке библиографических описаний русскоязычных работ на английском языке используются транслитерации фамилий, переводы названий статей и изданий, указанные в самих цитируемых изданиях. Машинный перевод не допускается.</p>
          <p><strong>(a)</strong> Ссылки в тексте заключаются в квадратные скобки, фамилии автор(ов) — курсивом, год издания — прямым, точка, страницы с прописной буквы, например: [<em>Иванов, Петров,</em> 2016. С. 77]. В случае работ автора, датируемых одним и тем же годом, применяется индексация латинскими буквами [<em>Иванов,</em> 2015a] [<em>Иванов,</em> 2015b]. Во всех случаях фамилия автора в квадратных скобках даётся <em>курсивом</em>.</p>
          <p><strong>(b)</strong> Пристатейный библиографический список — список литературных источников, на которые существуют ссылки, упоминания и цитаты в тексте статьи. Литературные источники помещаются в конце статьи в алфавитном порядке, иностранные источники после русскоязычных.</p>

          <p className="font-medium text-forest-700 pt-2"><em>Примеры оформления русскоязычной литературы:</em></p>
          <p>Статья: <em>Андреева Е.Л., Полкова Т.В.</em> (2014). Оценка качества трудовой жизни населения регионов России // <em>Экономика региона.</em> № 3(35). C. 91–101. DOI: 10.17059/2013-3-7.</p>
          <p>Монография: <em>Лапин Н.И.</em> (2021). <em>Сложность становления новой России. Антропосоциокультурный подход.</em> — М.: Весь Мир.</p>
          <p>Сборник материалов: <em>Колосова Р.П., Баймурзина Г.Р.</em> (2021). Достойный труд в новых условиях: актуализация индикаторов качества занятости / <em>Трансформация рынка труда и политика занятости населения: Сб. м-лов IV Междунар. научно-практ. конф. «Костинские чтения»</em>, Москва, 11.02.2021. — М.: Академия труда и социальных отношений. С. 15–20.</p>
          <p><em>МОТ</em> (2008). <em>Измерение достойного труда на основе рекомендаций Трёхстороннего совещания экспертов по измерению достойного труда (Сентябрь 2008 г.)</em>. URL: https://www.ilo.org/wcmsp5/groups/public/---dgreports/---integration/documents/meetingdocument/wcms_192844.pdf (дата обращения: 12.07.2025).</p>
          <p><em>Неустойчивая занятость в Российской Федерации: теория и методология выявления, оценивание и вектор сокращения.</em> (2018) / Ред. В.Н. Бобков. — М.: КНОРУС.</p>

          <p className="font-medium text-forest-700 pt-2"><em>Примеры оформления литературы на иностранных языках:</em></p>
          <p>Статья: <em>Cengiz I. F.</em> (2017). European Constitutionalism and its Future after Brexit! // Inonu University Law Review. Vol. 8. No. 2. Pp. 551–571.</p>
          <p>Монография: <em>Evans J. S. B. T.</em> (2010). <em>Thinking Twice: Two Minds in One Brain.</em> — Oxford and New York: Oxford University Press.</p>

          <p className="font-medium text-forest-700 pt-2">Версии оформления русскоязычных публикаций для списка REFERENCES:</p>
          <p><em>Andreeva E.L., Polkova T.V.</em> (2014). Assessment of the Quality of Working Life of the Population of Russian Regions // <em>Regional Economy.</em> No. 3(35). Pp. 91–101. DOI: 10.17059/2013-3-7. (In Russ.).</p>
          <p><em>Kolosova R.P., Baimurzina G.R.</em> (2021). Decent Work in the New Conditions: Updating the Indicators of the Quality of Employment / <em>Transformation of the Labor Market and Employment Policy: Coll. of the IV Int. scient.-pract. conf. «Kostinsky Readings»</em>, Moscow, 11.02.2021. — M.: Academy of Labor and Social Relations. Pp. 15–20. (In Russ.).</p>
          <p><em>Lapin N.I.</em> (2021). <em>The Complexity of the Formation of a New Russia. An Anthroposociocultural Approach.</em> — M.: Ves` Mir. (In Russ.).</p>
          <p><em>MOT</em> (2008). <em>Measuring Decent Work Based on the Recommendations of the Tripartite Meeting of Experts on Measuring Decent Work</em> (September 2008). URL: https://www.ilo.org/wcmsp5/groups/public/---dgreports/---integration/documents/meetingdocument/wcms_192844.pdf (access date: 12.07.2025). (In Russ.).</p>
          <p><em>Precarious employment in the Russian Federation: theory and methodology of identification, assessment and vector of reduction</em> (2018). / Ed. V.N. Bobkov. — M.: KNORUS. (In Russ.).</p>

          <p><strong>(c)</strong> В случае указания интернет-источников необходимо уточнять дату обращения. Формат: число, месяц, год. Например: дата обращения: 05.04.2020.</p>
          <p className="font-medium text-forest-700 pt-2"><em>Примеры оформления ссылки на интернет-ресурсы:</em></p>
          <p><em>Andrews D.</em> (2020). Brexit and the British Constitutional Crisis. Pomona. URL: https://www.pomona.edu/node/60101/field_event_date/addtocal.ics (access date: 28.12.2021).</p>
          <p>Brexit: United Kingdom is Divided (2016). Heinrich-Böll-Stiftung. URL: https://eu.boell.org/en/2016/06/30/brexit-united-kingdom-divided (access date: 28.12.2021).</p>

          <p><strong>(d)</strong> В библиографический список не включаются: нормативные документы, статистические сборники, архивные материалы, газетные заметки без указания автора, ссылки на сайты без указания конкретного материала. Ссылки на такие источники даются в подстрочных примечаниях (сносках).</p>
          <p className="font-medium text-forest-700 pt-2"><em>Пример оформления:</em></p>
          <p>ЦИК допустила внедрение онлайн-голосования в масштабах страны к 2024 году. РБК. Дата публикации: 23.12.2020 URL: https://www.rbc.ru/politics/23/12/2020/5fe31ba99a79476f1e4deaa4 (дата обращения: 05.12.2021).</p>
        </div>

        <h3 className="font-serif text-lg font-semibold text-forest-700 mt-5 mb-2">8. Использование инструментов ИИ</h3>
        <div className="text-sm text-gray-700 space-y-3 leading-relaxed">
          <p>В случае использования автором/соавторами инструментов ИИ, фрагменты исследования, созданные с использованием ИИ, помечаются сноской, в сноске раскрывается характер использования ИИ и использованное ПО.</p>
          <p className="font-medium text-forest-700">Пример:</p>
          <p><sup>1</sup> В исследовании динамики роста численности фонарных столбов в КНР в период 2013–2025 годов авторы использовали инструменты Deepseek для сбора и анализа информации.</p>
          <p><sup>2</sup> При подготовке обзора исследовательской литературы по теме мериторных благ авторы использовали ChatGPT и YandexGPT.</p>
        </div>

        <h3 className="font-serif text-lg font-semibold text-forest-700 mt-5 mb-2">9. Сведения об авторе (авторах)</h3>
        <p className="text-sm text-gray-700 leading-relaxed mb-2">После статьи прилагаются сведения об авторе (авторах):</p>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
          <li>фамилия, имя, отчество (полностью);</li>
          <li>учёная степень, учёное звание;</li>
          <li>должность и место работы (полное официальное название организации);</li>
          <li>город (если это не ясно из названия организации);</li>
          <li>контактный e-mail (будет опубликован в журнале). Если статья написана группой авторов, указывается e-mail одного из них.</li>
        </ul>
      </div>
    </div>
  );
}

function SubmissionEn() {
  return (
    <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6 text-[15px]">
      <div className="bg-white border border-stone-400 rounded-sm p-6">
        <p className="text-sm text-gray-700 leading-relaxed">
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
        <p className="text-sm text-gray-700 leading-relaxed mt-3">
          Please note that by submitting a paper you agree to the terms of the{" "}
          <Link
            href="/authors/copyright-agreement"
            className="text-teal-600 hover:text-copper-400 transition-colors underline underline-offset-2"
          >
            copyright agreement
          </Link>
          , the{" "}
          <Link
            href="/privacy"
            className="text-teal-600 hover:text-copper-400 transition-colors underline underline-offset-2"
          >
            personal data processing policy
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
      </div>

      <div className="bg-white border border-stone-400 rounded-sm p-6">
        <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">Manuscript Formatting Requirements</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          To expedite the work of reviewing and editing articles, we ask authors to adhere to the following common requirements for the design of their research.
        </p>

        <h3 className="font-serif text-lg font-semibold text-forest-700 mt-5 mb-2">1. The beginning of the article must include:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
          <li>Author&rsquo;s (or authors&rsquo;, separated by commas) surname, name and patronymic in Russian and English.</li>
          <li>Title of the article (in Russian and English).</li>
          <li>Abstract in Russian and English (at least 2,000 characters with spaces each).</li>
          <li>Keywords in Russian and English (no more than 7 words and/or word combinations).</li>
          <li>JEL classification codes corresponding to the subject of the article based on the alphanumeric classification system in economic theory (Journal of Economic Literature).</li>
        </ul>

        <h3 className="font-serif text-lg font-semibold text-forest-700 mt-5 mb-2">2. Text formatting requirements:</h3>
        <div className="text-sm text-gray-700 space-y-3 leading-relaxed">
          <p><strong>a)</strong> Times New Roman with single line spacing; surname of the author — 12 pt light, straight, capital letters; title of the article — 12 pt bold, straight, capital letters; keywords, abstract, footnotes — 10 pt light, straight; main text — 12 pt. Page margins: top — 1 cm, left — 2.0, bottom — 1.5, right — 1.5 cm.</p>
          <p><strong>b)</strong> Tables must be numbered and have titles, and the text must contain a link to the table by the corresponding number (for example, Table 1). If tables contain footnotes, they are placed below the table. Footnote characters in tables use asterisks (*) or letters. References to sources are placed under the table after footnotes and are preceded by the word &ldquo;Source:&rdquo; (&ldquo;Sources:&rdquo;) or &ldquo;Calculated from:&rdquo;.</p>
          <p><strong>c)</strong> Formulas are drawn up by means of the Word program, and complex formulas are typed in the built-in formula editor. If the text contains references to formulas, then the formulas must be numbered.</p>
          <p><strong>d)</strong> Figures (diagrams, schemes, graphs) should preferably be prepared in vector graphics programs. Photos must be in TIFF or JPG formats with a resolution of at least 300 dpi. All figures must be numbered and have figure captions, and the text must contain links to figures by the corresponding number, for example: Fig. 12. Footnotes contained in figures are placed directly below the figures. Footnote signs use asterisks (*), letters, or other characters, but different from table footnote signs and footnote numbers in the body text. References to sources are placed under the figures after footnotes and are preceded by the word &ldquo;Source:&rdquo; (&ldquo;Sources:&rdquo;).</p>
        </div>

        <h3 className="font-serif text-lg font-semibold text-forest-700 mt-5 mb-2">3. Bibliography</h3>
        <div className="text-sm text-gray-700 space-y-3 leading-relaxed">
          <p>Bibliographic list at the end of the article in Russian and English. Notes, references, bibliographic list are drawn up in accordance with the examples below. Starting from issue 1, 2026, two reference lists are attached to each article: ЛИТЕРАТУРА (Russian) and REFERENCES (English). Sources in each list are arranged alphabetically. In ЛИТЕРАТУРА foreign sources follow Russian-language ones. REFERENCES contains both foreign sources and English bibliographic information for Russian-language works in a single alphabetical order.</p>
          <p><strong>(a)</strong> References in the text are enclosed in square brackets, the names of the author(s) are in italics, the year of publication is in direct letters, a period, pages are capitalised, for example: [<em>Ivanov, Petrov,</em> 2016, p. 77]. In the case of the author&rsquo;s works dating from the same year, indexing in Latin letters is used [<em>Ivanov,</em> 2015a] [<em>Ivanov,</em> 2015b].</p>
          <p><strong>(b)</strong> Bibliographic list — a list of references to which there are references and citations in the text of the article. Literary sources are placed at the end of the article in alphabetical order, foreign sources after Russian ones.</p>

          <p className="font-medium text-forest-700 pt-2"><em>Examples of Russian-language literature:</em></p>
          <p>Article: <em>Каравай А.В.</em> (2021). Институциональные барьеры роста человеческого капитала высококвалифицированных специалистов [<em>Karavay A.V.</em> (2021). Institutional barriers to the growth of human capital of highly-skilled professionals] // <em>Journal of Institutional Studies.</em> Vol. 13. No. 3. Pp. 131–143.</p>
          <p>Monograph: <em>Маркузе Г.</em> (2011). Критическая теория общества: Избранные работы по философии и социальной критике [<em>Marcuse H.</em> (2011). Critical Theory of Society: Selected Works in Philosophy and Social Criticism]. — М.: ACT: Астрель.</p>

          <p className="font-medium text-forest-700 pt-2"><em>Examples of literature in foreign languages:</em></p>
          <p>Article: Cengiz I. F. (2017). European Constitutionalism and its Future after Brexit! // Inonu University Law Review. Vol. 8. No. 2. Pp. 551–571.</p>
          <p>Monograph: Evans J. S. B. T. (2010). Thinking Twice: Two Minds in One Brain. — Oxford and New York: Oxford University Press.</p>

          <p><strong>(c)</strong> If Internet sources are indicated, the date of access must be specified. Format: day, month, year. For example: accessed: 05.04.2020.</p>
          <p className="font-medium text-forest-700 pt-2"><em>Examples of links to Internet resources:</em></p>
          <p>Andrews D. (2020). Brexit and the British Constitutional Crisis. Pomona. URL: https://www.pomona.edu/node/60101/field_event_date/addtocal.ics (access date: 28.12.2021).</p>
          <p>Brexit: United Kingdom is Divided (2016). Heinrich-Böll-Stiftung. URL: https://eu.boell.org/en/2016/06/30/brexit-united-kingdom-divided (access date: 28.12.2021).</p>

          <p><strong>(d)</strong> The bibliographic list does not include: normative documents, statistical collections, archival materials, newspaper notes without specifying the author, links to sites without specifying a specific material. References to such sources are given in footnotes.</p>
        </div>

        <h3 className="font-serif text-lg font-semibold text-forest-700 mt-5 mb-2">Author information</h3>
        <p className="text-sm text-gray-700 leading-relaxed mb-2">After the article, information about the author (authors) is attached:</p>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
          <li>surname, name, patronymic (in full);</li>
          <li>academic degree, academic title;</li>
          <li>position and place of work (full official name of the organisation);</li>
          <li>city (if it is not clear from the name of the organisation);</li>
          <li>contact e-mail (will be published in the journal). If the article is written by a group of authors, the e-mail of one of them is indicated.</li>
        </ul>
      </div>
    </div>
  );
}
