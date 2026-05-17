"use client";

interface Props {
  email: string;
  onReset: () => void;
}

export default function SubmitSuccess({ email, onReset }: Props) {
  return (
    <section className="bg-white border border-stone-400 rounded-sm p-8 text-center">
      <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-forest-50 flex items-center justify-center">
        <svg className="w-7 h-7 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="font-serif text-2xl font-semibold text-forest-600 mb-2">
        Статья получена
      </h2>
      <p className="text-sm text-gray-700 leading-relaxed max-w-prose mx-auto mb-6">
        Спасибо. Редакция журнала «Вопросы теоретической экономики» получила вашу
        рукопись и свяжется с вами по адресу{" "}
        <span className="font-medium text-forest-700">{email}</span>.
        Если в течение двух недель ответа не будет — напишите на{" "}
        <a href="mailto:editorqet@inecon.ru" className="text-teal-600 underline underline-offset-2 hover:text-copper-400">
          editorqet@inecon.ru
        </a>.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 text-sm font-medium bg-forest-600 text-white px-4 py-2 rounded-sm hover:bg-forest-700 transition-colors"
      >
        Подать ещё одну статью
      </button>
    </section>
  );
}
