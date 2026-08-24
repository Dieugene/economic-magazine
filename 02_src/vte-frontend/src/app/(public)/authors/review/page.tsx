"use client";

import Link from "@/components/public/HoverPrefetchLink";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import PageHeading from "@/components/public/PageHeading";
import DocumentTitle from "@/components/public/DocumentTitle";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function AuthorsReviewPage() {
  const { lang } = useLanguage();

  return (
    <>
      <DocumentTitle ru="Порядок рецензирования статей" en="Procedure for Paper Review" />
      <Breadcrumbs
        items={[
          { label: { ru: "Главная", en: "Home" }, href: "/" },
          { label: { ru: "Авторам", en: "For Authors" }, href: "/authors" },
          { label: { ru: "Порядок рецензирования статей", en: "Procedure for Paper Review" } },
        ]}
      />

      <section>
        <div className="w-[60px] h-[2px] bg-copper-400 mb-6" />
        <PageHeading
          ru="Порядок рецензирования статей"
          en="Procedure for Paper Review"
          level={1}
          className="font-serif text-4xl sm:text-5xl font-bold text-forest-600 leading-tight mb-8"
        />

        {lang === "en" ? <ReviewEn /> : <ReviewRu />}
      </section>
    </>
  );
}

function ReviewRu() {
  return (
    <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6 text-[15px]">
      <p className="text-sm text-gray-700 leading-relaxed">
        <strong>Порядок рецензирования статей, направляемых в редакцию журнала «Вопросы теоретической экономики»</strong>
      </p>
      <div className="bg-white border border-stone-400 rounded-sm p-6">
        <ul className="list-disc list-inside space-y-3 text-sm text-gray-700 leading-relaxed ml-2">
          <li>
            Статьи должны быть оформлены по правилам, указанным на сайте журнала{" "}
            <Link
              href="/authors/submission"
              className="text-teal-600 hover:text-copper-400 underline underline-offset-2"
            >
              «Вопросы теоретической экономики»
            </Link>
            . Статьи принимаются только в электронном виде.
          </li>
          <li>
            Статьи направляются на адрес редакции{" "}
            <a
              href="mailto:editorqet@inecon.ru"
              className="text-teal-600 hover:text-copper-400 underline underline-offset-2"
            >
              editorqet@inecon.ru
            </a>
            , либо через{" "}
            <Link
              href="/authors/submit"
              className="text-teal-600 hover:text-copper-400 underline underline-offset-2"
            >
              сервис подачи статей
            </Link>
            .
          </li>
          <li>
            Издание осуществляет рецензирование всех поступающих в редакцию материалов с целью их экспертной оценки. При несоответствии статьи проблематике и стандартам журнала, редакция направляет авторам мотивированный отказ в публикации. При выполнении требований на соответствие (включая стандарты оформления) статьи отправляются на рецензирование.
          </li>
          <li>
            Рецензент в течение месяца готовит отзыв по форме, указанной в приложении. При несоблюдении сроков главный редактор может направить статью другому рецензенту (в т.ч. — обратиться с просьбой о рецензировании к одному из членов редакционной коллегии).
          </li>
          <li>
            Все рецензенты являются признанными специалистами по тематике рецензируемых материалов и имеют в течение последних 3 лет публикации по тематике рецензируемой статьи.
          </li>
          <li>
            При отрицательном отзыве возможно привлечение главным редактором дополнительного внешнего рецензента в те же сроки (дополнительный месяц).
          </li>
          <li>
            Полученные (и подписанные экспертами) рецензии передаются в Национальную электронную библиотеку в соответствии с договором (договор между НЭБ и учредителем «Вопросов теоретической экономики» прикладывается), где хранятся в закрытом режиме доступа.
          </li>
          <li>
            Рецензии также направляются авторам статей после предварительного устранения из текстов данных о рецензентах.
          </li>
          <li>
            Рецензии хранятся в редакции издания в течение 5 лет, а также размещаются на портале{" "}
            <a
              href="https://www.elibrary.ru/defaultx.asp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:text-copper-400 underline underline-offset-2"
            >
              https://www.elibrary.ru/defaultx.asp
            </a>
            , где доступны авторитетным специалистам для оценки качества рецензирования.
          </li>
          <li>
            Редакция обязуется направлять копии рецензий в Министерство науки и высшего образования Российской Федерации при поступлении в редакцию издания соответствующего запроса.
          </li>
        </ul>
      </div>
    </div>
  );
}

function ReviewEn() {
  return (
    <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6 text-[15px]">
      <p className="text-sm text-gray-700 leading-relaxed">
        <strong>Procedure for paper review, sent to the editorial office of &ldquo;Issues of Economic Theory&rdquo;</strong>
      </p>
      <div className="bg-white border border-stone-400 rounded-sm p-6">
        <ul className="list-disc list-inside space-y-3 text-sm text-gray-700 leading-relaxed ml-2">
          <li>
            Papers must be drawn up according to the rules specified on the{" "}
            <Link
              href="/authors/submission"
              className="text-teal-600 hover:text-copper-400 underline underline-offset-2"
            >
              journal&rsquo;s website
            </Link>
            . Papers are accepted only in electronic form.
          </li>
          <li>
            The article should be sent to{" "}
            <a
              href="mailto:editorqet@inecon.ru"
              className="text-teal-600 hover:text-copper-400 underline underline-offset-2"
            >
              editorqet@inecon.ru
            </a>{" "}
            or via the{" "}
            <a
              href="https://ms.questionset.ru/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:text-copper-400 underline underline-offset-2"
            >
              article submission service
            </a>
            .
          </li>
          <li>
            The Journal reviews all materials submitted to the editorial office for the purpose of their expert assessment. If the paper does not correspond to the problems and standards of the journal, the editorial board sends the authors a reasoned refusal to publish. If the manuscript meets the requirements for compliance (including formatting standards), articles are sent for review.
          </li>
          <li>
            The reviewer prepares a review within a month in the form indicated in the appendix. If the deadline is not met, the editor-in-chief can send the paper to another reviewer (including — to apply for reviewing to one of the members of the editorial board).
          </li>
          <li>
            All reviewers are recognised experts on peer-reviewed materials and have, over the past 3 years, publications discussing topics similar to the peer-reviewed paper.
          </li>
          <li>
            In case of a negative review, the editor-in-chief can engage an additional external reviewer within the same time frame (an additional 1 month).
          </li>
          <li>
            Received (and signed by experts) reviews are transferred to the National Electronic Library in accordance with the agreement (the agreement between the NEL and the founder of &ldquo;Issues of Economic Theory&rdquo; is attached), where they are stored in a closed access mode.
          </li>
          <li>
            Reviews are also sent to the authors of the paper after the preliminary removal of the data on the reviewers from the texts.
          </li>
          <li>
            Reviews are stored in the editorial office for 5 years, and are also posted on the portal{" "}
            <a
              href="https://www.elibrary.ru/defaultx.asp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:text-copper-400 underline underline-offset-2"
            >
              https://www.elibrary.ru/defaultx.asp
            </a>
            , where they are available to authoritative experts to assess the quality of reviewing.
          </li>
          <li>
            The editorial office undertakes to send copies of the reviews to the Ministry of Science and Higher Education of the Russian Federation upon receipt of the corresponding request to the editorial office.
          </li>
        </ul>
      </div>
    </div>
  );
}
