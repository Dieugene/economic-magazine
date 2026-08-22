"use client";

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

const sectionHeadingClass =
  "font-serif text-xl font-semibold text-forest-600 mt-6 mb-2";
const subHeadingClass = "font-semibold text-forest-700 mt-3 mb-1";
const listClass = "list-disc list-inside space-y-1.5 ml-2";

function PrivacyRu() {
  return (
    <div className="prose max-w-none text-gray-700 leading-relaxed text-sm space-y-4">
      <p className="italic text-gray-500">Дата вступления в силу: 15 декабря 2025 года</p>
      <p>
        Настоящая Политика обработки персональных данных (далее — Политика) разработана в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных» (в редакции на декабрь 2025 г.), иными нормативными актами Российской Федерации и определяет порядок обработки персональных данных пользователей сайта{" "}
        <a
          href="https://questionset.ru"
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-600 hover:text-copper-400 underline underline-offset-2"
        >
          https://questionset.ru
        </a>{" "}
        (далее — Сайт).
      </p>

      <h2 className={sectionHeadingClass}>1. Оператор персональных данных</h2>
      <p>
        Оператором персональных данных является: Федеральное государственное бюджетное учреждение науки Институт экономики Российской академии наук (ИЭ РАН).
      </p>
      <ul className={listClass}>
        <li>ОГРН: 1057749043110</li>
        <li>ИНН: 7727559323</li>
        <li>Юридический адрес: 117218, г. Москва, Нахимовский проспект, д. 32</li>
        <li>Фактический адрес: 117218, г. Москва, Нахимовский проспект, д. 32</li>
      </ul>
      <p>Контакты для направления запросов субъектов персональных данных и обращений:</p>
      <ul className={listClass}>
        <li>
          E-mail:{" "}
          <a
            href="mailto:ieras@inecon.ru"
            className="text-teal-600 hover:text-copper-400 underline underline-offset-2"
          >
            ieras@inecon.ru
          </a>
        </li>
        <li>Телефон: 8 (499) 724-15-41</li>
      </ul>
      <p>
        Сайт{" "}
        <a
          href="https://questionset.ru"
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-600 hover:text-copper-400 underline underline-offset-2"
        >
          questionset.ru
        </a>{" "}
        является официальной информационной площадкой научного журнала «Вопросы теоретической экономики» и действует в рамках единой политики обработки персональных данных ИЭ РАН.
      </p>

      <h2 className={sectionHeadingClass}>2. Состав обрабатываемых персональных данных</h2>
      <p className={subHeadingClass}>2.1. Данные авторов статей, рецензентов, членов редакционной коллегии:</p>
      <ul className={listClass}>
        <li>ФИО;</li>
        <li>учёная степень, учёное звание;</li>
        <li>место работы, должность;</li>
        <li>ORCID iD, ResearcherID, Scopus Author ID, SPIN-код РИНЦ;</li>
        <li>адрес электронной почты;</li>
        <li>контактный телефон;</li>
        <li>паспортные данные (серия, номер, кем и когда выдан) — только в случае необходимости заключения лицензионного договора;</li>
        <li>личная подпись (в том числе электронная);</li>
        <li>метаданные загружаемых файлов (включая скрытые поля .docx, .pdf и др.).</li>
      </ul>
      <p className={subHeadingClass}>2.2. Данные посетителей Сайта (автоматически собираемые):</p>
      <ul className={listClass}>
        <li>IP-адрес;</li>
        <li>файлы cookie;</li>
        <li>информация о браузере, типе и версии ОС, типе устройства;</li>
        <li>дата, время и длительность посещения;</li>
        <li>посещённые страницы и действия на Сайте;</li>
        <li>источник перехода;</li>
        <li>технические логи веб-сервера.</li>
      </ul>
      <p>Указанные в п. 2.2 данные обрабатываются в обезличенном виде и не используются для идентификации конкретного пользователя.</p>
      <p>
        Специальные категории персональных данных (касающиеся расовой, национальной принадлежности, политических взглядов, религиозных или философских убеждений, состояния здоровья, интимной жизни) и биометрические персональные данные Оператором не обрабатываются.
      </p>

      <h2 className={sectionHeadingClass}>3. Цели обработки персональных данных</h2>
      <p className={subHeadingClass}>3.1. В отношении авторов, рецензентов, членов редакционной коллегии и редакционного совета:</p>
      <ul className={listClass}>
        <li>заключение и исполнение лицензионных договоров;</li>
        <li>проведение процедуры рецензирования;</li>
        <li>связь по вопросам подготовки, редактирования и публикации статей;</li>
        <li>ведение редакционного делопроизводства;</li>
        <li>публикация статей и сведений об авторах и редакторах в открытом доступе;</li>
        <li>размещение и индексирование статей в российских и международных наукометрических базах.</li>
      </ul>
      <p className={subHeadingClass}>3.2. В отношении пользователей Сайта:</p>
      <ul className={listClass}>
        <li>обеспечение корректной технической работы Сайта;</li>
        <li>анализ посещаемости и улучшение функциональности;</li>
        <li>защита от несанкционированного доступа, спама и DDoS-атак;</li>
        <li>обработка обращений через форму обратной связи.</li>
      </ul>
      <p>
        Обработка персональных данных осуществляется исключительно в указанных целях. Использование данных в иных целях возможно только при получении отдельного согласия субъекта.
      </p>

      <h2 className={sectionHeadingClass}>4. Правовые основания обработки персональных данных</h2>
      <p>Обработка осуществляется на следующих основаниях (ст. 6 Федерального закона № 152-ФЗ):</p>
      <ul className={listClass}>
        <li>согласие субъекта персональных данных;</li>
        <li>заключение и исполнение договора, стороной которого является субъект (ч. 1 п. 5);</li>
        <li>осуществление уставной деятельности научной организации (ч. 1 п. 2);</li>
        <li>законные интересы Оператора (обеспечение безопасности Сайта, аналитика), при условии, что такие интересы не нарушают права субъекта (ч. 1 п. 7).</li>
      </ul>

      <h2 className={sectionHeadingClass}>5. Публикация сведений об авторах в открытом доступе</h2>
      <p>
        Передавая статью для публикации, автор даёт явное согласие на отнесение следующих данных к категории персональных данных, разрешённых субъектом для распространения (ст. 10.1 152-ФЗ):
      </p>
      <ul className={listClass}>
        <li>ФИО;</li>
        <li>место работы и должность;</li>
        <li>учёная степень и звание;</li>
        <li>ORCID iD, SPIN-код РИНЦ и иные идентификаторы;</li>
        <li>адрес электронной почты.</li>
      </ul>
      <p>
        Указанные данные публикуются вместе со статьёй в открытом доступе, включаются в метаданные, DOI и библиографические описания под лицензией Creative Commons Attribution 4.0 International (CC BY 4.0). Такое распространение не является нарушением конфиденциальности.
      </p>

      <h2 className={sectionHeadingClass}>6. Передача персональных данных третьим лицам</h2>
      <p>Персональные данные могут передаваться:</p>
      <ul className={listClass}>
        <li>
          <strong>6.1.</strong> Рецензентам — в объёме, необходимом для проведения экспертизы (ФИО автора скрывается при двойном слепом рецензировании).
        </li>
        <li>
          <strong>6.2.</strong> Наукометрическим и индексационным базам (РИНЦ (ООО НЭБ), КиберЛенинка (ООО «Итеос»), сервисах ФГБУ РЦНИ (Национальная платформа журналов, ИС Метафора), РНЖ (ФГБУ РИЭПП), РГБ (ФГБУ «РГБ»)).
        </li>
        <li>
          <strong>6.3.</strong> Техническим подрядчикам (хостинг-провайдерам, администраторам Сайта, сервисам аналитики) — только на основании договора поручения обработки персональных данных с обязательством обеспечения конфиденциальности и безопасности (ст. 6 ч. 3 Федерального закона 152-ФЗ).
        </li>
      </ul>

      <h2 className={sectionHeadingClass}>7. Трансграничная передача персональных данных</h2>
      <p>Трансграничная передача осуществляется исключительно:</p>
      <ul className={listClass}>
        <li>в обезличенном виде (для индексации в международных базах) либо</li>
        <li>на основании явно выраженного согласия автора и при условии соблюдения требований локализации баз данных граждан РФ на территории Российской Федерации (ч. 5 ст. 18 Федерального закона 152-ФЗ).</li>
      </ul>
      <p>
        Первичная обработка и хранение персональных данных граждан РФ осуществляется на серверах, расположенных на территории Российской Федерации. Передача в страны, не обеспечивающие адекватный уровень защиты прав субъектов персональных данных (перечень определяется Роскомнадзором), допускается только в объёме, необходимом для индексации публикаций в международных базах, и с предварительным уведомлением Роскомнадзора в установленных случаях.
      </p>

      <h2 className={sectionHeadingClass}>8. Сроки хранения персональных данных</h2>
      <ul className={listClass}>
        <li>Данные авторов, рецензентов, членов редакционных органов — в течение 75 лет с момента публикации статьи или подписания согласия (в соответствии с Перечнем типовых управленческих архивных документов, утв. Приказом Росархива от 20.12.2019 № 236, и требованиями архивного хранения научных публикаций).</li>
        <li>Паспортные данные, использованные для заключения договора, — 5 лет после окончания действия договора.</li>
        <li>Технические логи и cookie — не более 1 года или до достижения целей обработки.</li>
      </ul>
      <p>
        По достижении целей или при отзыве согласия данные уничтожаются или обезличиваются в течение 30 дней с составлением соответствующего акта.
      </p>

      <h2 className={sectionHeadingClass}>9. Права субъекта персональных данных</h2>
      <p>Субъект имеет право:</p>
      <ul className={listClass}>
        <li>получать информацию об обработке своих данных;</li>
        <li>требовать уточнения, блокирования или уничтожения данных;</li>
        <li>отзывать согласие на обработку;</li>
        <li>обжаловать действия Оператора в Роскомнадзоре или в судебном порядке.</li>
      </ul>
      <p>
        Запрос направляется на{" "}
        <a
          href="mailto:ieras@inecon.ru"
          className="text-teal-600 hover:text-copper-400 underline underline-offset-2"
        >
          ieras@inecon.ru
        </a>{" "}
        или по почтовому адресу Оператора. Срок ответа — не более 10 рабочих дней, на сложные запросы — до 30 дней.
      </p>

      <h2 className={sectionHeadingClass}>10. Меры по обеспечению безопасности персональных данных</h2>
      <p>
        Оператор применяет комплекс правовых, организационных и технических мер, соответствующих 1-му уровню защищённости персональных данных (УЗ-1) в соответствии с Постановлением Правительства РФ от 01.11.2012 № 1119, включая:
      </p>
      <ul className={listClass}>
        <li>ограничение и учёт доступа сотрудников;</li>
        <li>антивирусную защиту и межсетевые экраны;</li>
        <li>шифрование каналов передачи данных (HTTPS);</li>
        <li>резервное копирование и восстановление;</li>
        <li>журналирование операций с персональными данными;</li>
        <li>регулярные проверки и аудиты системы защиты.</li>
      </ul>

      <h2 className={sectionHeadingClass}>11. Использование cookie и аналитических сервисов</h2>
      <p>
        Сайт использует cookie-файлы для обеспечения работоспособности, сохранения настроек и анализа посещаемости (Яндекс.Метрика в анонимизированном режиме). При первом посещении Сайта отображается баннер с запросом согласия на использование cookie. Пользователь может отказаться — при этом часть функций Сайта может быть недоступна.
      </p>

      <h2 className={sectionHeadingClass}>12. Порядок направления запросов и обращений</h2>
      <p>Все запросы, отзывы согласия и жалобы направляются:</p>
      <ul className={listClass}>
        <li>
          E-mail:{" "}
          <a
            href="mailto:ieras@inecon.ru"
            className="text-teal-600 hover:text-copper-400 underline underline-offset-2"
          >
            ieras@inecon.ru
          </a>
        </li>
        <li>Почтовый адрес: 117218, Москва, Нахимовский пр-т, д. 32, Канцелярия ИЭ РАН.</li>
      </ul>

      <h2 className={sectionHeadingClass}>13. Внесение изменений в Политику</h2>
      <p>
        Оператор вправе вносить изменения в настоящую Политику. Новая редакция публикуется на Сайте и вступает в силу с момента размещения. При существенных изменениях Оператор уведомляет пользователей по электронной почте (если она известна) не менее чем за 10 дней.
      </p>
      <p>
        Политика пересмотрена и утверждена 15 декабря 2025 года. Предыдущие редакции утрачивают силу с указанной даты.
      </p>
    </div>
  );
}

function PrivacyEn() {
  return (
    <div className="prose max-w-none text-gray-700 leading-relaxed text-sm space-y-4">
      <p className="italic text-gray-500">Effective Date: December 15, 2025</p>
      <p>
        This Personal Data Processing Policy (hereinafter referred to as the &ldquo;Policy&rdquo;) has been developed in accordance with Federal Law No. 152-FZ of July 27, 2006 &ldquo;On Personal Data&rdquo; (as amended in December 2025), other regulatory acts of the Russian Federation, and defines the procedure for processing personal data of users of the website{" "}
        <a
          href="https://questionset.ru"
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-600 hover:text-copper-400 underline underline-offset-2"
        >
          https://questionset.ru
        </a>{" "}
        (hereinafter referred to as the &ldquo;Site&rdquo;).
      </p>

      <h2 className={sectionHeadingClass}>1. Personal Data Operator</h2>
      <p>
        The Personal Data Operator is: Federal State Budgetary Institution of Science, Institute of Economics of the Russian Academy of Sciences (IE RAS).
      </p>
      <ul className={listClass}>
        <li>OGRN: 1057749043110</li>
        <li>INN: 7727559323</li>
        <li>Legal address: 32 Nakhimovsky Prospekt, Moscow, 117218, Russian Federation</li>
        <li>Actual address: 32 Nakhimovsky Prospekt, Moscow, 117218, Russian Federation</li>
      </ul>
      <p>Contacts for requests and inquiries from personal data subjects:</p>
      <ul className={listClass}>
        <li>
          Email:{" "}
          <a
            href="mailto:ieras@inecon.ru"
            className="text-teal-600 hover:text-copper-400 underline underline-offset-2"
          >
            ieras@inecon.ru
          </a>
        </li>
        <li>Phone: +7 (499) 724-15-41</li>
      </ul>
      <p>
        The website{" "}
        <a
          href="https://questionset.ru"
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-600 hover:text-copper-400 underline underline-offset-2"
        >
          questionset.ru
        </a>{" "}
        is the official information platform of the scientific journal &ldquo;Issues of Theoretical Economics&rdquo; and operates within the framework of the unified personal data processing policy of IE RAS.
      </p>

      <h2 className={sectionHeadingClass}>2. Composition of Processed Personal Data</h2>
      <p className={subHeadingClass}>2.1. Data of Article Authors, Reviewers, and Editorial Board Members:</p>
      <ul className={listClass}>
        <li>full name;</li>
        <li>academic degree, academic title;</li>
        <li>place of employment, position;</li>
        <li>ORCID iD, ResearcherID, Scopus Author ID, RSCI SPIN code;</li>
        <li>email address;</li>
        <li>contact phone number;</li>
        <li>passport data (series, number, issuing authority and date) — only when necessary for concluding a license agreement;</li>
        <li>personal signature (including electronic);</li>
        <li>metadata of uploaded files (including hidden fields of .docx, .pdf, etc.).</li>
      </ul>
      <p className={subHeadingClass}>2.2. Data of Site Visitors (automatically collected):</p>
      <ul className={listClass}>
        <li>IP address;</li>
        <li>cookies;</li>
        <li>browser information, OS type and version, device type;</li>
        <li>date, time and duration of visit;</li>
        <li>pages visited and actions taken on the Site;</li>
        <li>referral source;</li>
        <li>web server technical logs.</li>
      </ul>
      <p>The data specified in clause 2.2 is processed in anonymized form and is not used to identify specific users.</p>
      <p>
        Special categories of personal data (concerning racial or ethnic origin, political views, religious or philosophical beliefs, health, intimate life) and biometric personal data are not processed by the Operator.
      </p>

      <h2 className={sectionHeadingClass}>3. Purposes of Personal Data Processing</h2>
      <p className={subHeadingClass}>3.1. With respect to authors, reviewers, editorial board and editorial council members:</p>
      <ul className={listClass}>
        <li>conclusion and execution of license agreements;</li>
        <li>conducting the peer-review process;</li>
        <li>communication regarding the preparation, editing and publication of articles;</li>
        <li>maintenance of editorial records;</li>
        <li>publication of articles and information about authors and editors in open access;</li>
        <li>indexing and inclusion of articles in Russian and international scientometric databases.</li>
      </ul>
      <p className={subHeadingClass}>3.2. With respect to Site users:</p>
      <ul className={listClass}>
        <li>ensuring proper technical functioning of the Site;</li>
        <li>traffic analysis and functionality improvement;</li>
        <li>protection against unauthorized access, spam and DDoS attacks;</li>
        <li>processing inquiries submitted via the feedback form.</li>
      </ul>
      <p>
        Personal data is processed exclusively for the above purposes. Use of data for other purposes is possible only with the separate consent of the data subject.
      </p>

      <h2 className={sectionHeadingClass}>4. Legal Grounds for Processing Personal Data</h2>
      <p>Processing is carried out on the following grounds (Article 6 of Federal Law No. 152-FZ):</p>
      <ul className={listClass}>
        <li>consent of the personal data subject;</li>
        <li>conclusion and execution of a contract to which the data subject is a party (Clause 5, Part 1);</li>
        <li>exercise of the statutory functions of a scientific organization (Clause 2, Part 1);</li>
        <li>legitimate interests of the Operator (ensuring Site security, analytics), provided such interests do not violate the rights of the data subject (Clause 7, Part 1).</li>
      </ul>

      <h2 className={sectionHeadingClass}>5. Publication of Information About Authors in Open Access</h2>
      <p>
        By submitting an article for publication, the author gives explicit consent to classify the following data as personal data permitted for dissemination by the data subject (Article 10.1 of Law No. 152-FZ):
      </p>
      <ul className={listClass}>
        <li>full name;</li>
        <li>place of employment and position;</li>
        <li>academic degree and title;</li>
        <li>ORCID iD, RSCI SPIN code and other identifiers;</li>
        <li>email address.</li>
      </ul>
      <p>
        Such data is published together with the article in open access, included in metadata, DOI and bibliographic descriptions under the Creative Commons Attribution 4.0 International License (CC BY 4.0). Such dissemination does not constitute a breach of confidentiality.
      </p>

      <h2 className={sectionHeadingClass}>6. Transfer of Personal Data to Third Parties</h2>
      <p>Personal data may be transferred:</p>
      <ul className={listClass}>
        <li>
          <strong>6.1.</strong> To reviewers — to the extent necessary for the peer-review process (the author&rsquo;s name is hidden during double-blind peer review).
        </li>
        <li>
          <strong>6.2.</strong> To scientometric and indexing databases (RSCI (NEICON LLC), CyberLeninka (Iteos LLC), services of the Russian Center for Scientific Information (National Journal Platform, Metaphora Information System), Russian Journal Network (RIEPP FSBU), Russian State Library (RSL FSBU)).
        </li>
        <li>
          <strong>6.3.</strong> To technical contractors (hosting providers, Site administrators, analytics services) — only on the basis of a data processing agreement that imposes confidentiality and security obligations (Article 6, Part 3 of Federal Law No. 152-FZ).
        </li>
      </ul>

      <h2 className={sectionHeadingClass}>7. Cross-Border Transfer of Personal Data</h2>
      <p>Cross-border transfer is carried out exclusively:</p>
      <ul className={listClass}>
        <li>in anonymized form (for indexing in international databases) or</li>
        <li>based on the explicit consent of the author and provided that the requirements for localization of databases of Russian citizens on the territory of the Russian Federation are met (Part 5, Article 18 of Federal Law No. 152-FZ).</li>
      </ul>
      <p>
        Primary processing and storage of personal data of Russian citizens is carried out on servers located on the territory of the Russian Federation. Transfer to countries that do not provide adequate protection for the rights of personal data subjects (list determined by Roskomnadzor) is permitted only to the extent necessary for indexing publications in international databases and with prior notification to Roskomnadzor where required.
      </p>

      <h2 className={sectionHeadingClass}>8. Retention Periods for Personal Data</h2>
      <ul className={listClass}>
        <li>Data of authors, reviewers, editorial board members — for 75 years from the date of publication of the article or signing of consent (in accordance with the List of Standard Managerial Archival Documents approved by Order No. 236 of the Federal Archive Agency of December 20, 2019, and the requirements for archival storage of scientific publications).</li>
        <li>Passport data used for concluding a contract — 5 years after the contract expires.</li>
        <li>Technical logs and cookies — no more than 1 year or until processing purposes are achieved.</li>
      </ul>
      <p>
        Upon achievement of purposes or withdrawal of consent, data is destroyed or anonymized within 30 days, with a corresponding report drawn up.
      </p>

      <h2 className={sectionHeadingClass}>9. Rights of the Personal Data Subject</h2>
      <p>The data subject has the right to:</p>
      <ul className={listClass}>
        <li>obtain information about the processing of their data;</li>
        <li>request rectification, blocking or destruction of their data;</li>
        <li>withdraw consent to processing;</li>
        <li>appeal the Operator&rsquo;s actions to Roskomnadzor or in court.</li>
      </ul>
      <p>
        Requests should be sent to{" "}
        <a
          href="mailto:ieras@inecon.ru"
          className="text-teal-600 hover:text-copper-400 underline underline-offset-2"
        >
          ieras@inecon.ru
        </a>{" "}
        or to the Operator&rsquo;s postal address. Response time — no more than 10 business days; for complex requests — up to 30 days.
      </p>

      <h2 className={sectionHeadingClass}>10. Security Measures for Personal Data Protection</h2>
      <p>
        The Operator applies a comprehensive set of legal, organizational and technical measures corresponding to Level 1 protection of personal data (PL-1) in accordance with Resolution No. 1119 of the Government of the Russian Federation of November 1, 2012, including:
      </p>
      <ul className={listClass}>
        <li>access restriction and logging of employee access;</li>
        <li>antivirus protection and firewalls;</li>
        <li>data transmission channel encryption (HTTPS);</li>
        <li>backup and recovery;</li>
        <li>logging of operations with personal data;</li>
        <li>regular security checks and audits.</li>
      </ul>

      <h2 className={sectionHeadingClass}>11. Use of Cookies and Analytics Services</h2>
      <p>
        The Site uses cookies to ensure functionality, save preferences and analyze traffic (Yandex.Metrica in anonymized mode). Upon first visit to the Site, a banner requesting consent to use cookies is displayed. The user may decline — in which case some functions of the Site may be unavailable.
      </p>

      <h2 className={sectionHeadingClass}>12. Procedure for Submitting Requests and Inquiries</h2>
      <p>All requests, consent withdrawals and complaints should be sent to:</p>
      <ul className={listClass}>
        <li>
          Email:{" "}
          <a
            href="mailto:ieras@inecon.ru"
            className="text-teal-600 hover:text-copper-400 underline underline-offset-2"
          >
            ieras@inecon.ru
          </a>
        </li>
        <li>Postal address: 32 Nakhimovsky Prospekt, Moscow, 117218, Russian Federation, IE RAS Chancellery.</li>
      </ul>

      <h2 className={sectionHeadingClass}>13. Changes to the Policy</h2>
      <p>
        The Operator has the right to amend this Policy. The new version is published on the Site and becomes effective upon posting. In the event of material changes, the Operator shall notify users by email (if known) at least 10 days in advance.
      </p>
      <p>
        The Policy was reviewed and approved on December 15, 2025. Previous versions are no longer valid as of that date.
      </p>
    </div>
  );
}
