"use client";

import Link from "next/link";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import PageHeading from "@/components/public/PageHeading";
import DocumentTitle from "@/components/public/DocumentTitle";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function EthicsPage() {
  const { lang } = useLanguage();

  return (
    <>
      <DocumentTitle ru="Этика научных публикаций" en="Ethics of Scientific Publications" />
      <Breadcrumbs
        items={[
          { label: { ru: "Главная", en: "Home" }, href: "/" },
          { label: { ru: "Этика научных публикаций", en: "Ethics of Scientific Publications" } },
        ]}
      />

      <section>
        <div className="w-[60px] h-[2px] bg-copper-400 mb-6" />
        <PageHeading
          ru="Этика научных публикаций"
          en="Ethics of Scientific Publications"
          level={1}
          className="font-serif text-4xl sm:text-5xl font-bold text-forest-600 leading-tight mb-8"
        />

        {lang === "en" ? <EthicsEn /> : <EthicsRu />}
      </section>
    </>
  );
}

function EthicsRu() {
  return (
    <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6 text-[15px]">
      <p>
        Политика публикационной этики журнала{" "}
        <strong className="text-forest-700">«Вопросы теоретической экономики»</strong>{" "}
        основывается на рекомендациях и стандартах Комитета по этике научных публикаций (
        <a
          href="https://publicationethics.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-600 hover:text-copper-400 underline underline-offset-2"
        >
          The Committee on Publication Ethics — COPE
        </a>
        ).
      </p>

      <div className="bg-white border border-stone-400 rounded-sm p-6">
        <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">Этические принципы авторов</h2>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed ml-2">
          <li>
            Отправляя рукопись на публикацию, автор/авторы подтверждают своё согласие с{" "}
            <Link
              href="/authors/copyright-agreement"
              className="text-teal-600 hover:text-copper-400 underline underline-offset-2"
            >
              авторским соглашением
            </Link>
            , и сформулированной в нём политикой журнала в отношении интеллектуальной собственности, а также высокую оригинальность высылаемого текста.
          </li>
          <li>Не допускается многократная публикация работ одного автора в течение одного календарного года.</li>
          <li>Не допускается одновременная подача нескольких работ одного автора на рассмотрение.</li>
          <li>Автор/авторы гарантируют, что поданная на рецензирование статья не находится в процессе рассмотрения в ином журнале.</li>
          <li>Автор/авторы подтверждают, что текст статьи не публиковался ранее в иных изданиях, в том числе не является результатом перефразирования и/или перевода с другого языка уже опубликованного исследования, и не находится на рассмотрении в другом журнале. Если работа основана на ранее опубликованных в качестве доклада, препринта, рабочего материала материалах, следует указать на это в сноске к названию статьи и уведомить об этом редакцию.</li>
          <li>Не допускается включение в число соавторов статьи лиц, не принимавших участие в её написании, не ознакомившихся и не выразивших согласие с её окончательным вариантом. Автор, подавший статью, и поддерживающий контакт с редакцией, не может представить окончательный вариант текста без согласования с другими соавторами.</li>
          <li>Автор/авторы подтверждают, что при проведении исследования не допускались фабрикация, фальсификация или манипулирование данными.</li>
          <li>Автор/авторы гарантируют отсутствие в работе плагиата в любой форме. Если используются данные и утверждения из других исследований, они подкрепляются соответствующими библиографическими ссылками.</li>
          <li>Автор/авторы в случае использования инструментов искусственного интеллекта (ИИ) подтверждают, что добросовестно использовали инструменты ИИ в качестве вспомогательного исследовательского инструмента, направленного на ускорение процессов поиска и анализа информации. Автор/соавторы подтверждают, что не использовали ИИ для конечного обобщения научных результатов и создания текста.</li>
          <li>
            Автор/авторы в случае использования инструментов ИИ в процессе подготовки рукописи, заявляют об этом в тексте посредством соответствующих пометок (см.{" "}
            <Link
              href="/authors/submission"
              className="text-teal-600 hover:text-copper-400 underline underline-offset-2"
            >
              порядок подачи и оформления статей
            </Link>
            ). В случае, если у редакции журнала после проверки рукописи через систему Антиплагиат, возникают подозрения о незаявленном факте использования ИИ, редакция оставляет за собой право отказать в публикации.
          </li>
          <li>Автор/авторы в случае использования инструментов ИИ в процессе поиска и обобщения информации, подтверждают, что провели необходимые процедуры верификации полученной информации.</li>
          <li>Автор/авторы несут полную ответственность за достоверность приводимых авторами сведений в том числе библиографических описаний использованной литературы.</li>
          <li>Не допускается самоплагиат (прямой перенос в текст статьи материалов из других своих работ без указания ссылок на первичные публикации) и избыточное самоцитирование.</li>
          <li>Автор/авторы заявляют в своих рукописях о наличии конфликта интересов (в том числе гранты и другое финансовое обеспечение), а также указывают на помощь и полезные советы третьих лиц, участвовавших в обсуждении статьи и/или помощи в получении данных.</li>
          <li>Авторов могут попросить представить исходные данные при рассмотрении статьи редакцией, и они должны быть готовы предоставить публичный доступ к этим данным в соответствии с Заявлением о данных и их базах Ассоциации учёных и профессионального сообщества издателей (The Association of Learned and Professional Society Publishers (ALPSP)), если это осуществимо, и в любом случае должны быть готовы сохранять эти данные в течение некоторого времени после публикации.</li>
          <li>При обнаружении существенных ошибок или неточностей в своей уже опубликованной работе, автор уведомляет об этом редакцию и принимает совместное с ней решение о возможной форме их исправления.</li>
          <li>
            При размещении авторами полного текста или фрагментов текста опубликованной статьи на личных страницах автора/авторов в сети Интернет, в иных публикациях (статьях, монографиях, учебниках, сборниках и докладах), редакция просит указывать полную ссылку с библиографическим описанием и URL опубликованной статьи на сайте{" "}
            <a
              href="http://questionset.ru/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:text-copper-400 underline underline-offset-2"
            >
              http://questionset.ru/
            </a>
            .
          </li>
        </ul>
      </div>

      <div className="bg-white border border-stone-400 rounded-sm p-6">
        <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">Этические принципы рецензентов</h2>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed ml-2">
          <li>Издание осуществляет рецензирование всех поступающих в редакцию материалов с целью их экспертной оценки. При несоответствии статьи проблематике и стандартам журнала, редакция направляет авторам мотивированный отказ в публикации. При выполнении требований на соответствие (включая стандарты оформления) статьи отправляются на рецензирование. Рецензент в течение месяца готовит отзыв по форме, указанной в приложении. При несоблюдении сроков главный редактор может направить статью другому рецензенту (в т.ч. — обратиться с просьбой о рецензировании к одному из членов редакционной коллегии). Все рецензенты являются признанными специалистами по тематике рецензируемых материалов. При отрицательном отзыве возможно привлечение главным редактором дополнительного внешнего рецензента в те же сроки (дополнительный месяц).</li>
          <li>Рецензенты не являются членами редколлегии и редакции журнала.</li>
          <li>Рецензирование основывается на принципе двойного анонимного (слепого) рецензирования: имена авторов и рецензентов не раскрываются друг другу.</li>
          <li>Любая рукопись, полученная для рецензирования, рассматривается как конфиденциальный документ, обсуждение содержания которого с третьими лицами не допускается.</li>
          <li>Рецензент обязан давать объективную оценку текста. Персональная критика автора недопустима.</li>
          <li>Рецензенты оценивают работу по критериям, представленным в бланке рецензента, в том числе: актуальность исследования, новизна, обоснованность выводов.</li>
          <li>Рецензент сообщает редактору в случае обнаружения существенного сходства или совпадения рецензируемой рукописи с известной рецензенту опубликованной работой. Об обнаруженных случаях отсутствия в рукописи ссылок на работы, результаты которых тесно связаны с её содержанием, указывается в рецензии.</li>
          <li>Неопубликованные данные и идеи, полученные из представленных к рассмотрению рукописей, не могут быть использованы рецензентом в собственных исследованиях.</li>
          <li>Рецензенты не должны участвовать в рассмотрении рукописей в случае наличия конфликта интересов, возникающих вследствие конкурентных, совместных и других взаимодействий и отношений с любым из Авторов, компаниями или другими организациями, связанными с представленной работой. В случае возникновения конфликта интересов, рецензенты сообщают об этом редактору.</li>
        </ul>
      </div>

      <div className="bg-white border border-stone-400 rounded-sm p-6">
        <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">Этические принципы редакции</h2>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed ml-2">
          <li>Редактор независимо и самостоятельно принимает решение о публикации, основываясь на результатах анонимного рецензирования, и согласуясь с мнением редакционной коллегии. Редактор основывается на научной значимости, достоверности и новизне исследования.</li>
          <li>Редактор гарантирует честность, эффективность и независимость процесса рецензирования. Редактор гарантирует конфиденциальность процесса рецензирования.</li>
          <li>Редактор оценивает исследования, невзирая на идеологические, религиозные, политические и другие предпочтения авторов.</li>
          <li>Редактор осуществляет проверку оригинальности публикуемых статей.</li>
          <li>Редактор принимает меры для выявления неправомерно проведённых исследований и недопущения публикации результатов исследований, содержащих результаты манипулирования данными, фальсификации и фабрикации данных, а также некорректного цитирования.</li>
          <li>Редактор разрешает конфликтные ситуации, возникающие в процессе работы, и использует для их урегулирования все доступные средства.</li>
        </ul>
      </div>

      <div className="bg-white border border-stone-400 rounded-sm p-6">
        <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">Правила отзыва (ретракции) статьи от публикации</h2>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed ml-2">
          <li>Имея достоверные и подтверждённые сведения о нарушениях авторской этики, незаявленном конфликте интересов и/или наличии недостоверных сведений в уже опубликованных работах, редактор принимает решение об исправлении ситуации и предоставлении соответствующих рекомендаций автору. Отказ от внесения исправлений может служить причиной отзыва (ретракции) публикации.</li>
          <li>
            При реализации процедуры отзыва (ретракции) статьи от публикации, редакция журнала основывается на стандартах и рекомендациях <strong>Комитета по публикационной этике</strong> (
            <a
              href="https://publicationethics.org/guidance/Guidelines"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:text-copper-400 underline underline-offset-2"
            >
              Committee on Publication Ethics — COPE
            </a>
            ).
          </li>
        </ul>
      </div>

      <div className="bg-stone-200 border border-stone-400 rounded-sm p-6">
        <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">Политика свободного доступа</h2>
        <div className="text-sm text-gray-700 space-y-3 leading-relaxed">
          <p>Журнал «Вопросы теоретической экономики» предоставляет непосредственный открытый доступ к своим материалам, исходя из принципа увеличения глобального обмена знаниями посредством предоставления свободного открытого доступа к результатам исследований.</p>
          <p>
            Политика открытого доступа{" "}
            <a
              href="https://www.budapestopenaccessinitiative.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:text-copper-400 underline underline-offset-2"
            >
              соответствует определению Будапештской инициативы открытого доступа (BOAI)
            </a>{" "}
            и означает, что статьи доступны в открытом доступе в сети Интернет. Это позволяет всем пользователям читать, загружать, копировать, распространять, распечатывать, искать или ссылаться на полные тексты этих статей или использовать их для любых других законных целей без финансовых, юридических или технических барьеров, за исключением тех, которые неотделимы от получения доступа к самому Интернету.
          </p>
          <p className="font-medium text-forest-700 pt-2">Авторские сборы</p>
          <p>Публикация в журнале для авторов бесплатна. Редакция не взимает плату с авторов за подготовку и размещение материалов.</p>
        </div>
      </div>
    </div>
  );
}

function EthicsEn() {
  return (
    <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6 text-[15px]">
      <p>
        The publication ethics policy of the journal{" "}
        <strong className="text-forest-700">&ldquo;Issues of Economic Theory&rdquo;</strong>{" "}
        is based on the recommendations and standards of{" "}
        <a
          href="https://publicationethics.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-600 hover:text-copper-400 underline underline-offset-2"
        >
          the Committee on Publication Ethics (COPE)
        </a>
        .
      </p>

      <div className="bg-white border border-stone-400 rounded-sm p-6">
        <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">Ethical principles of the authors</h2>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed ml-2">
          <li>
            By sending the manuscript, the author/authors confirm their agreement with{" "}
            <Link
              href="/authors/copyright-agreement"
              className="text-teal-600 hover:text-copper-400 underline underline-offset-2"
            >
              the copyright agreement
            </Link>
            , as well as the high originality of the paper.
          </li>
          <li>Multiple publication of papers by one author within one calendar year is not allowed.</li>
          <li>Simultaneous submission of several papers by the same author is not allowed.</li>
          <li>The author/authors guarantee that the submitted article is not in the process of peer review in another journal.</li>
          <li>The author/authors confirm that the text of the article has not been previously published in other publications, and is not the result of paraphrasing and/or translation from another language of an already published study, and is not under consideration in another journal. If the paper is based on materials previously published as a report, preprint or working material, the author/authors should indicate this in a footnote to the title of the article and notify the editors of IET.</li>
          <li>It is not allowed to include in the co-authors group persons who did not take part in the study, who did not read and did not agree with its final version. The author submitting the article and contacting the editors cannot submit the final version of the text without the consent of co-authors.</li>
          <li>The author/authors confirm that no fabrication, falsification or manipulation of data was used in the study.</li>
          <li>The author/authors guarantee the absence of plagiarism in any form. There must be appropriate bibliographic references to the data and statements from studies used.</li>
          <li>Self-plagiarism (direct transfer to the text of the article of materials from other works without references to primary publications) and excessive self-citation are not allowed.</li>
          <li>The author/authors declare in their manuscripts the presence of a conflict of interest (including grants and other financial support), and also indicate the help and useful advice of third parties who participated in the discussion of the article and/or assistance in obtaining data.</li>
          <li>Authors may be asked to provide raw data when an article is reviewed by the editors, and they must be prepared to provide public access to this data in accordance with the Statement on data and their databases of The Association of Learned and Professional Society Publishers (ALPSP), if feasible, and in any case should be prepared to retain this data for some time after publication.</li>
          <li>If significant errors or inaccuracies are found in already published work, the author notifies the editors. The joint decision takes place on the possible form of its correction.</li>
          <li>
            When the authors place the full text or fragments of the published paper on personal pages on the Internet or in other publications (articles, monographs, textbooks, collections and reports), the editors ask for a full reference with a bibliographic description and the URL of the published paper on the website{" "}
            <a
              href="http://questionset.ru/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:text-copper-400 underline underline-offset-2"
            >
              http://questionset.ru/
            </a>
            .
          </li>
        </ul>
      </div>

      <div className="bg-white border border-stone-400 rounded-sm p-6">
        <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">Ethical principles of reviewers</h2>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed ml-2">
          <li>The Journal reviews all materials received by the editorial office for the purpose of their expert evaluation. If the article does not correspond to the problems and standards of the journal, the editors send a reasoned refusal to the authors. If the manuscript meets the requirements for compliance (including formatting standards), articles are sent for review. The reviewer prepares a review within a month in the form indicated in the appendix. If the deadline expires, the editor-in-chief can send the article to another reviewer (including asking one of the members of the editorial board for review). All reviewers are recognised experts in the subject matter of the peer-reviewed materials. In case of a negative review, the editor-in-chief may engage an additional external reviewer within the same time frame (an additional month).</li>
          <li>The reviewers are not members of the editorial board of &ldquo;Issues of Economic Theory&rdquo;.</li>
          <li>The review is based on the principle of double-blind peer review: the names of authors and reviewers are not disclosed to each other.</li>
          <li>Any manuscript submitted for review is treated as a confidential document; discussion of the content with third parties is not allowed.</li>
          <li>The reviewer is obliged to give an objective assessment of the text. Personal criticism is unacceptable.</li>
          <li>Reviewers evaluate the work according to the criteria presented in the reviewer&rsquo;s form, including the relevance of the study, novelty, validity of the conclusions.</li>
          <li>The reviewer informs the editor if a significant similarity or coincidence of the reviewed manuscript with the published work known to the reviewer is found. The found cases of the absence of references in the manuscript to works, the results of which are closely related to its content, are indicated in the review.</li>
          <li>Unpublished data and ideas derived from submitted manuscripts cannot be used by the reviewer in their own research.</li>
          <li>Reviewers should not participate in the review of manuscripts if a conflict of interest arising from competitive, joint and other interactions and relationships with any of the authors, companies or other organisations associated with the submitted work takes place. In the case of conflict of interest, the reviewers inform the editor.</li>
        </ul>
      </div>

      <div className="bg-white border border-stone-400 rounded-sm p-6">
        <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">Editorial Ethics</h2>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed ml-2">
          <li>The editor independently makes a decision on publication based on the results of an anonymous review and in accordance with the opinion of the editorial board. The editor bases the decision on the scientific relevance, validity and novelty of the study.</li>
          <li>The editor guarantees the honesty, efficiency and independence of the review process. The editor guarantees the confidentiality of the review process.</li>
          <li>The editor evaluates the research regardless of the ideological, religious, political and other preferences of the authors.</li>
          <li>The editor resolves conflict situations arising during the editorial process and uses all available means to resolve them.</li>
          <li>Having reliable and confirmed information about violations of author&rsquo;s ethics, undeclared conflicts of interest and/or the presence of false information in already published works, the editor decides to resolve the situation and provides appropriate recommendations to the author. Refusal to make corrections may serve as a reason to refuse to publish a manuscript.</li>
          <li>Publication in the journal is free of charge. The editors do not charge authors for the preparation, placement and printing of materials.</li>
        </ul>
      </div>

      <div className="bg-white border border-stone-400 rounded-sm p-6">
        <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">Rules for retraction of a paper</h2>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed ml-2">
          <li>Having reliable and confirmed information about violations of author&rsquo;s ethics, undeclared conflicts of interest and/or the presence of false information in already published works, the editor decides to correct the situation and provide appropriate recommendations to the author. Refusal to make corrections may serve as a reason for retraction of the publication.</li>
          <li>
            When implementing the procedure for retraction, the editors of the journal follow the standards and recommendations of the{" "}
            <a
              href="https://publicationethics.org/guidance/Guidelines"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:text-copper-400 underline underline-offset-2"
            >
              Committee on Publication Ethics (COPE)
            </a>
            .
          </li>
        </ul>
      </div>

      <div className="bg-stone-200 border border-stone-400 rounded-sm p-6">
        <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">Free access policy</h2>
        <div className="text-sm text-gray-700 space-y-3 leading-relaxed">
          <p>The journal &ldquo;Issues of Economic Theory&rdquo; provides direct open access to its materials, based on the principle of increasing the global exchange of knowledge through the provision of free open access to research results.</p>
          <p>
            The open access policy follows the definition of the{" "}
            <a
              href="https://www.budapestopenaccessinitiative.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:text-copper-400 underline underline-offset-2"
            >
              Budapest Open Access Initiative (BOAI)
            </a>{" "}
            and means that articles are available in the public domain on the Internet. This allows all users to read, download, copy, distribute, print, search or reference the full texts of these articles, scan them for indexing, transfer them as data to software, or use them for any other lawful purpose without financial, legal or technical barriers, except for those that are inseparable from gaining access to the Internet itself.
          </p>
          <p className="font-medium text-forest-700 pt-2">Copyright fees</p>
          <p>Publication in the journal is free of charge. The editors do not charge authors for the preparation and placement of materials.</p>
        </div>
      </div>
    </div>
  );
}
