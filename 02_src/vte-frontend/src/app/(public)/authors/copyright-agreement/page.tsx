"use client";

import Breadcrumbs from "@/components/public/Breadcrumbs";
import PageHeading from "@/components/public/PageHeading";
import DocumentTitle from "@/components/public/DocumentTitle";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function CopyrightAgreementPage() {
  const { lang } = useLanguage();

  return (
    <>
      <DocumentTitle ru="Авторское соглашение" en="Copyright Agreement" />
      <Breadcrumbs
        items={[
          { label: { ru: "Главная", en: "Home" }, href: "/" },
          { label: { ru: "Авторам", en: "For Authors" }, href: "/authors" },
          { label: { ru: "Авторское соглашение", en: "Copyright Agreement" } },
        ]}
      />

      <section>
        <div className="w-[60px] h-[2px] bg-copper-400 mb-6" />
        <PageHeading
          ru="Авторское соглашение"
          en="Copyright Agreement"
          level={1}
          className="font-serif text-4xl sm:text-5xl font-bold text-forest-600 leading-tight mb-8"
        />

        {lang === "en" ? <CopyrightEn /> : <CopyrightRu />}
      </section>
    </>
  );
}

function CopyrightRu() {
  return (
    <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6 text-[15px]">
      <div className="bg-white border border-stone-400 rounded-sm p-6 space-y-4 text-sm leading-relaxed">
        <p>
          <strong>Автор/соавторы</strong> безвозмездно предоставляет(-ют) ФГБУН Институт экономики РАН (далее — Институт) право на публикацию в журнале «Вопросы теоретической экономики» в электронном формате своего Произведения, изложенного в виде статьи и приложений к ней (при наличии).
        </p>
        <p>Передача права на публикацию охватывает:</p>
        <ul className="list-disc list-inside space-y-1.5 ml-2">
          <li>право на воспроизведение Произведения (опубликование, обнародование, дублирование, тиражирование или иное размножение Произведения) без ограничения тиража экземпляров, в том числе на электронных носителях, в электронных сетях и базах данных;</li>
          <li>право на распространение Произведения любым способом;</li>
          <li>право на допечатную обработку (редактирование, корректорскую правку и т.п.) Произведения.</li>
        </ul>
        <p>
          Автор/соавторы Произведения сохраняют все авторские права на опубликованную статью вместе с правом использования статьи или её части в своих будущих работах, книгах, лекциях, интернет-страницах.
        </p>
      </div>

      <div className="bg-white border border-stone-400 rounded-sm p-6 space-y-3 text-sm leading-relaxed">
        <h2 className="font-serif text-xl font-semibold text-forest-600 mb-2">Автор/соавторы гарантирует, что:</h2>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li>текст Произведения является оригинальным и не публиковался ранее ни полностью, ни частично в других печатных и (или) электронных изданиях, не предложен в настоящее время к публикации в других изданиях;</li>
          <li>автор/соавторы Произведения подтверждают своё согласие с проверкой текста Произведения через систему обнаружения заимствований Антиплагиат (внесена в реестр отечественного ПО), осуществляемой редакцией журнала «Вопросы теоретической экономики» для установления степени оригинальности и новизны текста предоставленного Произведения;</li>
          <li>права, предоставленные Институту по настоящему Договору, не являются предметом действующего лицензионного договора Соавторов с третьими лицами;</li>
          <li>являются действительными правообладателями исключительных прав на результаты интеллектуальной деятельности, содержащиеся в Произведении;</li>
          <li>Произведение содержит все предусмотренные действующим законодательством Российской Федерации об авторском праве ссылки на цитируемые источники;</li>
          <li>Произведение не содержит материалы, не подлежащие опубликованию в открытой печати в соответствии с действующим законодательством Российской Федерации, а опубликование и (или) распространение Произведения Редакцией не приведут к разглашению секретной (конфиденциальной) информации (включая государственную, служебную тайну);</li>
          <li>публикация Произведения не приведёт к конфликту интересов, автор/соавторы указывают источники финансирования, организации и лиц, способствовавших проведению исследования.</li>
        </ul>
      </div>

      <div className="bg-white border border-stone-400 rounded-sm p-6 space-y-3 text-sm leading-relaxed">
        <h2 className="font-serif text-xl font-semibold text-forest-600 mb-2">Согласие на обработку персональных данных</h2>
        <p>Автор/соавторы предоставляет Институту право обработки следующих своих персональных данных без ограничения по сроку:</p>
        <ul className="list-disc list-inside space-y-1.5 ml-2">
          <li>фамилия, имя, отчество;</li>
          <li>свой(-и) ORCID iD; Researcher ID (WoS); Scopus ID; SPIN-код РИНЦ;</li>
          <li>сведения об образовании, учёных степенях и званиях;</li>
          <li>сведения о месте работы и занимаемой должности;</li>
          <li>сведения о контактной информации для переписки и переговоров.</li>
        </ul>
      </div>

      <div className="bg-stone-200 border border-stone-400 rounded-sm p-6 text-sm leading-relaxed">
        <p>
          Автор/соавторы выражают своё согласие с настоящими условиями через совершение соответствующих действий на сайте{" "}
          <a
            href="http://questionset.ru/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 hover:text-copper-400 transition-colors underline underline-offset-2"
          >
            http://questionset.ru/
          </a>
          , а также путём заполнения анкеты авторов и отправки файла с Произведением на указанный портал.
        </p>
      </div>
    </div>
  );
}

function CopyrightEn() {
  return (
    <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6 text-[15px]">
      <div className="bg-white border border-stone-400 rounded-sm p-6 space-y-4 text-sm leading-relaxed">
        <p>
          <strong>The author/co-authors</strong> free of charge grant(s) the Institute of Economics of the Russian Academy of Sciences (hereinafter — the Institute) the right to publish in the journal &ldquo;Issues of Economic Theory&rdquo; in electronic format their Work, presented in the form of an article and annexes to it (if any).
        </p>
        <p>The transfer of the right to publish covers:</p>
        <ul className="list-disc list-inside space-y-1.5 ml-2">
          <li>the right to reproduce the Paper (publishing, making public, duplicating, replicating or otherwise multiplying the Paper) without limiting the circulation of copies, including on electronic media, in electronic networks and databases;</li>
          <li>the right to distribute the Paper in any way;</li>
          <li>the right to pre-publish processing (editing, proofreading, etc.) of the Paper.</li>
        </ul>
        <p>
          The author/co-authors of the Paper retain all copyrights to the published article along with the right to use the article or part of it in their future works, books, lectures and web pages.
        </p>
      </div>

      <div className="bg-white border border-stone-400 rounded-sm p-6 space-y-3 text-sm leading-relaxed">
        <h2 className="font-serif text-xl font-semibold text-forest-600 mb-2">The author/co-authors guarantee that:</h2>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li>the text of the manuscript is original and has not been previously published, either in whole or in part, in other printed and/or electronic publications, and is not currently proposed for publication in other publications;</li>
          <li>the author/co-authors of the manuscript confirm their consent to the verification of the text of the manuscript through the Antiplagiat plagiarism detection system (included in the register of domestic software), carried out by the editorial board of the journal &ldquo;Issues of Economic Theory&rdquo; to establish the degree of originality and novelty of the text of the provided manuscript;</li>
          <li>the rights granted to the Institute under this Agreement are not subject to the current license agreement of the co-authors with third parties;</li>
          <li>they are the actual holders of exclusive rights to the results of intellectual activity contained in the Paper;</li>
          <li>the manuscript contains all references to the cited sources, copyrights of other authors are respected;</li>
          <li>the paper does not contain materials that are not to be published in the open press in accordance with the legislation of the Russian Federation, and the publication and/or distribution of the manuscript by the Editorial Board will not lead to the disclosure of secret (confidential) information (including state and official secrets);</li>
          <li>publication of the Work will not lead to a conflict of interest; the author/co-authors indicate the sources of funding, organisations and persons who contributed to the study.</li>
        </ul>
      </div>

      <div className="bg-white border border-stone-400 rounded-sm p-6 space-y-3 text-sm leading-relaxed">
        <h2 className="font-serif text-xl font-semibold text-forest-600 mb-2">Consent to Personal Data Processing</h2>
        <p>The author/co-authors grant(s) the Institute the right to process the following personal data without time limit:</p>
        <ul className="list-disc list-inside space-y-1.5 ml-2">
          <li>surname, name, patronymic;</li>
          <li>own ORCID iD; Researcher ID (WoS); Scopus ID; RSCI SPIN;</li>
          <li>information about education, academic degrees and titles;</li>
          <li>information about the place of work and position held;</li>
          <li>information about contact information for correspondence and negotiations.</li>
        </ul>
      </div>

      <div className="bg-stone-200 border border-stone-400 rounded-sm p-6 text-sm leading-relaxed">
        <p>
          The author/co-authors express their consent to these conditions by performing appropriate actions on the site{" "}
          <a
            href="http://questionset.ru/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 hover:text-copper-400 transition-colors underline underline-offset-2"
          >
            http://questionset.ru/
          </a>
          , as well as by filling out the authors&rsquo; questionnaire and sending the file with the manuscript to the specified portal.
        </p>
      </div>
    </div>
  );
}
