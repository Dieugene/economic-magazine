"use client";

import type { ReactNode } from "react";
import Link from "@/components/public/HoverPrefetchLink";
import type { SubmissionFormState, SubmissionErrors } from "@/lib/types/submission";
import FormSection from "./FormSection";

interface Props {
  state: SubmissionFormState;
  errors: SubmissionErrors;
  onChange: <K extends keyof SubmissionFormState>(key: K, value: SubmissionFormState[K]) => void;
  onBlur: (key: keyof SubmissionFormState) => void;
}

const linkClass =
  "text-teal-600 hover:text-copper-400 underline underline-offset-2 transition-colors";

const ITEMS: { key: keyof SubmissionFormState; label: ReactNode }[] = [
  { key: "declProfile",      label: "Статья соответствует содержательно-тематическому профилю журнала" },
  { key: "declOriginal",     label: "Этот материал ранее не был опубликован — ни полностью, ни частично, — а также не был представлен для рассмотрения и публикации в другом журнале" },
  { key: "declComplete",     label: "Статья полностью укомплектована аппаратом (аннотации, ключевые слова, информация об авторах, списки литературы на двух языках)" },
  { key: "declNoPlagiarism", label: "Статья не содержит неоформленных заимствований — плагиата и самоплагиата" },
  {
    key: "declAgreement",
    label: (
      <>
        Автор (соавторы) принимает условия{" "}
        <Link
          href="/authors/copyright-agreement"
          target="_blank"
          className={linkClass}
          onClick={(e) => e.stopPropagation()}
        >
          авторского соглашения
        </Link>
      </>
    ),
  },
];

export default function DeclarationsBlock({ state, errors, onChange, onBlur }: Props) {
  return (
    <FormSection
      title="Пожалуйста, подтвердите"
      description="Все пункты обязательны."
    >
      <ul className="space-y-3">
        {ITEMS.map((item) => {
          const checked = state[item.key] as boolean;
          const error = errors[item.key];
          return (
            <li key={item.key}>
              <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => onChange(item.key, e.target.checked as never)}
                  onBlur={() => onBlur(item.key)}
                  className="mt-0.5 h-4 w-4 accent-forest-600 cursor-pointer flex-shrink-0"
                />
                <span className="leading-relaxed">
                  {item.label}
                  <span className="text-copper-400 ml-0.5">*</span>
                </span>
              </label>
              {error && (
                <p className="text-xs text-red-600 mt-1 ml-7">{error}</p>
              )}
            </li>
          );
        })}
      </ul>
    </FormSection>
  );
}
