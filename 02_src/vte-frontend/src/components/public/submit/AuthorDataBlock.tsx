"use client";

import type { SubmissionFormState, SubmissionErrors } from "@/lib/types/submission";
import FormSection from "./FormSection";

interface Props {
  state: SubmissionFormState;
  errors: SubmissionErrors;
  onChange: <K extends keyof SubmissionFormState>(key: K, value: SubmissionFormState[K]) => void;
  onBlur: (key: keyof SubmissionFormState) => void;
}

const inputClass =
  "w-full bg-white border border-stone-400 rounded-sm px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-forest-600";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";
const errorClass = "text-xs text-red-600 mt-1";
const requiredMark = <span className="text-copper-400 ml-0.5">*</span>;

export default function AuthorDataBlock({ state, errors, onChange, onBlur }: Props) {
  return (
    <FormSection title="Автор / соавторы">
      <div className="space-y-4">
        <div>
          <label htmlFor="sub-authors" className={labelClass}>
            ФИО автора (соавторов через запятую){requiredMark}
          </label>
          <input
            id="sub-authors"
            type="text"
            className={inputClass}
            placeholder="Иванов Иван Иванович"
            value={state.authors}
            onChange={(e) => onChange("authors", e.target.value)}
            onBlur={() => onBlur("authors")}
            aria-invalid={!!errors.authors}
          />
          {errors.authors && <p className={errorClass}>{errors.authors}</p>}
        </div>

        <div>
          <label htmlFor="sub-workplace" className={labelClass}>
            Место работы (название и адрес){requiredMark}
          </label>
          <textarea
            id="sub-workplace"
            className={`${inputClass} min-h-[80px] resize-y`}
            placeholder="Полное название организации, адрес"
            value={state.workplaceTitleAndAddress}
            onChange={(e) => onChange("workplaceTitleAndAddress", e.target.value)}
            onBlur={() => onBlur("workplaceTitleAndAddress")}
            aria-invalid={!!errors.workplaceTitleAndAddress}
          />
          {errors.workplaceTitleAndAddress && <p className={errorClass}>{errors.workplaceTitleAndAddress}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sub-position" className={labelClass}>
              Должность{requiredMark}
            </label>
            <input
              id="sub-position"
              type="text"
              className={inputClass}
              value={state.positionTitle}
              onChange={(e) => onChange("positionTitle", e.target.value)}
              onBlur={() => onBlur("positionTitle")}
              aria-invalid={!!errors.positionTitle}
            />
            {errors.positionTitle && <p className={errorClass}>{errors.positionTitle}</p>}
          </div>

          <div>
            <label htmlFor="sub-city" className={labelClass}>
              Город{requiredMark}
            </label>
            <input
              id="sub-city"
              type="text"
              className={inputClass}
              value={state.city}
              onChange={(e) => onChange("city", e.target.value)}
              onBlur={() => onBlur("city")}
              aria-invalid={!!errors.city}
            />
            {errors.city && <p className={errorClass}>{errors.city}</p>}
          </div>
        </div>
      </div>
    </FormSection>
  );
}
