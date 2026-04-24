"use client";

import Breadcrumbs from "@/components/public/Breadcrumbs";
import PageHeading from "@/components/public/PageHeading";
import DocumentTitle from "@/components/public/DocumentTitle";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function EthicsPage() {
  const { lang } = useLanguage();

  return (
    <>
      <DocumentTitle ru="Этика публикаций" en="Publication Ethics" />
      <Breadcrumbs
        items={[
          { label: { ru: "Главная", en: "Home" }, href: "/" },
          { label: { ru: "Этика публикаций", en: "Publication Ethics" } },
        ]}
      />

      <section>
        <div className="w-[60px] h-[2px] bg-copper-400 mb-6" />
        <PageHeading
          ru="Этика публикаций"
          en="Publication Ethics"
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
        <strong className="text-forest-700">
          «Вопросы теоретической экономики»
        </strong>{" "}
        основывается на рекомендациях и стандартах Комитета по этике научных публикаций (The Committee on Publication Ethics — COPE).
      </p>

      <div className="bg-white border border-stone-400 rounded-sm p-6">
        <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">
          Этические принципы авторов
        </h2>
        <div className="text-sm text-gray-600 space-y-2 leading-relaxed">
          <p>Отправляя рукопись на публикацию, автор/авторы подтверждают свое согласие с авторским соглашением и сформулированной в нем политикой журнала в отношении интеллектуальной собственности, а также высокую оригинальность высылаемого текста.</p>
          <ul className="list-disc list-inside space-y-1.5 ml-2">
            <li>Не допускается многократная публикация работ одного автора в течение одного календарного года.</li>
            <li>Не допускается одновременная подача нескольких работ одного автора на рассмотрение.</li>
            <li>Автор/авторы гарантируют, что поданная на рецензирование статья не находится в процессе рассмотрения в ином журнале.</li>
            <li>Автор/авторы подтверждают, что текст статьи не публиковался ранее в иных изданиях, в том числе не является результатом перефразирования и/или перевода с другого языка уже опубликованного исследования.</li>
            <li>Не допускается включение в число соавторов статьи лиц, не принимавших участие в её написании.</li>
            <li>Автор/авторы подтверждают, что при проведении исследования не допускались фабрикация, фальсификация или манипулирование данными.</li>
            <li>Автор/авторы гарантируют отсутствие в работе плагиата в любой форме.</li>
            <li>Не допускается самоплагиат и избыточное самоцитирование.</li>
            <li>Автор/авторы заявляют в своих рукописях о наличии конфликта интересов (в том числе гранты и другое финансовое обеспечение).</li>
          </ul>
          <p className="pt-2 font-medium text-forest-700">Использование ИИ:</p>
          <p>Автор/авторы в случае использования инструментов искусственного интеллекта (ИИ) подтверждают, что добросовестно использовали инструменты ИИ в качестве вспомогательного исследовательского инструмента. Автор/соавторы подтверждают, что не использовали ИИ для конечного обобщения научных результатов и создания текста.</p>
          <p>В случае, если у редакции журнала после проверки рукописи через систему Антиплагиат возникают подозрения о незаявленном факте использования ИИ, редакция оставляет за собой право отказать в публикации.</p>
        </div>
      </div>

      <div className="bg-white border border-stone-400 rounded-sm p-6">
        <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">
          Этические принципы рецензентов
        </h2>
        <div className="text-sm text-gray-600 space-y-2 leading-relaxed">
          <ul className="list-disc list-inside space-y-1.5 ml-2">
            <li>Рецензирование основывается на принципе двойного анонимного (слепого) рецензирования: имена авторов и рецензентов не раскрываются друг другу.</li>
            <li>Любая рукопись, полученная для рецензирования, рассматривается как конфиденциальный документ, обсуждение содержания которого с третьими лицами не допускается.</li>
            <li>Рецензент обязан давать объективную оценку текста. Персональная критика автора недопустима.</li>
            <li>Рецензенты оценивают работу по критериям: актуальность исследования, новизна, обоснованность выводов.</li>
            <li>Рецензент сообщает редактору в случае обнаружения существенного сходства или совпадения рецензируемой рукописи с известной опубликованной работой.</li>
            <li>Неопубликованные данные и идеи, полученные из представленных к рассмотрению рукописей, не могут быть использованы рецензентом в собственных исследованиях.</li>
            <li>Рецензенты не должны участвовать в рассмотрении рукописей в случае наличия конфликта интересов.</li>
          </ul>
        </div>
      </div>

      <div className="bg-white border border-stone-400 rounded-sm p-6">
        <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">
          Этические принципы редакции
        </h2>
        <div className="text-sm text-gray-600 space-y-2 leading-relaxed">
          <ul className="list-disc list-inside space-y-1.5 ml-2">
            <li>Редактор независимо и самостоятельно принимает решение о публикации, основываясь на результатах анонимного рецензирования.</li>
            <li>Редактор основывается на научной значимости, достоверности и новизне исследования.</li>
            <li>Редактор гарантирует честность, эффективность и независимость процесса рецензирования.</li>
            <li>Редактор гарантирует конфиденциальность процесса рецензирования.</li>
            <li>Редактор оценивает исследования, невзирая на идеологические, религиозные, политические и другие предпочтения авторов.</li>
            <li>Редактор осуществляет проверку оригинальности публикуемых статей.</li>
            <li>Редактор принимает меры для выявления неправомерно проведенных исследований и недопущения публикации результатов, содержащих манипулирование, фальсификацию и фабрикацию данных.</li>
          </ul>
        </div>
      </div>

      <div className="bg-white border border-stone-400 rounded-sm p-6">
        <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">
          Правила отзыва (ретракции) статьи
        </h2>
        <div className="text-sm text-gray-600 space-y-2 leading-relaxed">
          <p>Имея достоверные и подтвержденные сведения о нарушениях авторской этики, незаявленном конфликте интересов и/или наличии недостоверных сведений в уже опубликованных работах, редактор принимает решение об исправлении ситуации и предоставлении соответствующих рекомендаций автору.</p>
          <p>Отказ от внесения исправлений может служить причиной отзыва (ретракции) публикации.</p>
          <p>При реализации процедуры отзыва (ретракции) статьи от публикации, редакция журнала основывается на стандартах и рекомендациях COPE.</p>
        </div>
      </div>

      <div className="bg-stone-200 border border-stone-400 rounded-sm p-6">
        <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">
          Политика свободного доступа
        </h2>
        <div className="text-sm text-gray-600 space-y-2 leading-relaxed">
          <p>Журнал «Вопросы теоретической экономики» предоставляет непосредственный открытый доступ к своим материалам, исходя из принципа увеличения глобального обмена знаниями посредством предоставления свободного открытого доступа к результатам исследований.</p>
          <p>Политика открытого доступа соответствует определению Будапештской инициативы открытого доступа (BOAI) и означает, что статьи доступны в открытом доступе в сети Интернет. Это позволяет всем пользователям читать, загружать, копировать, распространять, распечатывать, искать или ссылаться на полные тексты этих статей без финансовых, юридических или технических барьеров.</p>
          <p className="font-medium text-forest-700">Публикация в журнале для авторов бесплатна. Редакция не взимает плату с авторов за подготовку и размещение материалов.</p>
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
        <strong className="text-forest-700">“Issues of Economic Theory”</strong>{" "}
        is based on the recommendations and standards of the Committee on Publication Ethics (COPE).
      </p>

      <div className="bg-white border border-stone-400 rounded-sm p-6">
        <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">
          Ethical principles of the authors
        </h2>
        <div className="text-sm text-gray-600 space-y-2 leading-relaxed">
          <ul className="list-disc list-inside space-y-1.5 ml-2">
            <li>By sending the manuscript, the author/authors confirm their agreement with the copyright agreement, as well as the high originality of the paper.</li>
            <li>Multiple publication of papers by one author within one calendar year is not allowed.</li>
            <li>Simultaneous submission of several papers of the same author is not allowed.</li>
            <li>The author/authors guarantee that the submitted article is not in the process of peer review in another journal.</li>
            <li>The author/authors confirm that the text of the article has not been previously published in other publications, and is not the result of paraphrasing and/or translation from another language of an already published study. If the paper is based on materials previously published as a report, preprint or working material, the author/authors should indicate this in a footnote to the title of the article and notify the editors.</li>
            <li>It is not allowed to include in the co-authors group persons who did not take part in the study, who did not read and did not agree with its final version.</li>
            <li>The author/authors confirm that no fabrication, falsification or manipulation of data was used in the study.</li>
            <li>The author/authors guarantee the absence of plagiarism in any form. Appropriate bibliographic references to the data and statements from studies used must be provided.</li>
            <li>Self-plagiarism (direct transfer to the text of the article of materials from other works without references to primary publications) and excessive self-citation are not allowed.</li>
            <li>The author/authors declare in their manuscripts the presence of a conflict of interest (including grants and other financial support), and also indicate the help and useful advice of third parties who participated in the discussion of the article and/or assistance in obtaining data.</li>
            <li>If significant errors or inaccuracies are found in already published work, the author notifies the editors. A joint decision is then made on the possible form of correction.</li>
          </ul>
        </div>
      </div>

      <div className="bg-white border border-stone-400 rounded-sm p-6">
        <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">
          Ethical principles of reviewers
        </h2>
        <div className="text-sm text-gray-600 space-y-2 leading-relaxed">
          <ul className="list-disc list-inside space-y-1.5 ml-2">
            <li>The journal reviews all materials received by the editorial office for the purpose of expert evaluation. If the article does not correspond to the problems and standards of the journal, the editors send a reasoned refusal to the authors. If the manuscript meets the requirements (including formatting standards), it is sent for review. The reviewer prepares a review within a month.</li>
            <li>The reviewers are not members of the editorial board of “Issues of Economic Theory”.</li>
            <li>The review is based on the principle of double-blind peer review: the names of authors and reviewers are not disclosed to each other.</li>
            <li>Any manuscript submitted for review is treated as a confidential document; discussion of its content with third parties is not allowed.</li>
            <li>The reviewer is obliged to give an objective assessment of the text. Personal criticism is unacceptable.</li>
            <li>Reviewers evaluate the work according to the criteria presented in the reviewer’s form, including relevance of the study, novelty, and validity of the conclusions.</li>
            <li>The reviewer informs the editor if a significant similarity or coincidence of the reviewed manuscript with a known published work is found.</li>
            <li>Unpublished data and ideas derived from submitted manuscripts cannot be used by the reviewer in their own research.</li>
            <li>Reviewers should not participate in the review of manuscripts if there is a conflict of interest arising from competitive, joint or other interactions and relationships with any of the authors, companies or other organizations associated with the submitted work.</li>
          </ul>
        </div>
      </div>

      <div className="bg-white border border-stone-400 rounded-sm p-6">
        <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">
          Editorial Ethics
        </h2>
        <div className="text-sm text-gray-600 space-y-2 leading-relaxed">
          <ul className="list-disc list-inside space-y-1.5 ml-2">
            <li>The editor independently makes a decision on publication based on the results of an anonymous review and in accordance with the opinion of the editorial board. The editor bases the decision on the scientific relevance, validity and novelty of the study.</li>
            <li>The editor guarantees the honesty, efficiency and independence of the review process, as well as its confidentiality.</li>
            <li>The editor evaluates the research regardless of the ideological, religious, political and other preferences of the authors.</li>
            <li>The editor resolves conflict situations arising during the editorial process and uses all available means to resolve them.</li>
            <li>Having reliable and confirmed information about violations of author’s ethics, undeclared conflicts of interest and/or the presence of false information in already published works, the editor decides to resolve the situation and provides appropriate recommendations to the author. Refusal to make corrections may serve as a reason to refuse to publish a manuscript.</li>
            <li>Publication in the journal is free of charge. The editors do not charge authors for the preparation, placement and printing of materials.</li>
          </ul>
        </div>
      </div>

      <div className="bg-white border border-stone-400 rounded-sm p-6">
        <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">
          Rules for retraction of a paper
        </h2>
        <div className="text-sm text-gray-600 space-y-2 leading-relaxed">
          <p>Having reliable and confirmed information about violations of author’s ethics, undeclared conflicts of interest and/or the presence of false information in already published works, the editor decides to correct the situation and provides appropriate recommendations to the author. Refusal to make corrections may serve as a reason for retraction of the publication.</p>
          <p>When implementing the procedure for retraction, the editors of the journal follow the standards and recommendations of the Committee on Publication Ethics (COPE).</p>
        </div>
      </div>

      <div className="bg-stone-200 border border-stone-400 rounded-sm p-6">
        <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-4">
          Free access policy
        </h2>
        <div className="text-sm text-gray-600 space-y-2 leading-relaxed">
          <p>“Issues of Economic Theory” provides direct open access to its materials, based on the principle of increasing the global exchange of knowledge through the provision of free open access to research results.</p>
          <p>The open access policy follows the definition of the Budapest Open Access Initiative (BOAI) and means that articles are available in the public domain on the Internet. This allows all users to read, download, copy, distribute, print, search or reference the full texts of these articles without financial, legal or technical barriers.</p>
          <p className="font-medium text-forest-700">Publication in the journal is free of charge. The editors do not charge authors for the preparation and placement of materials.</p>
        </div>
      </div>
    </div>
  );
}
