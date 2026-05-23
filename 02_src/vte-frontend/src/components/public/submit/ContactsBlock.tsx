"use client";

import { useRef, type KeyboardEvent } from "react";
import type { SubmissionFormState, SubmissionErrors } from "@/lib/types/submission";
import { formatPhoneMask } from "@/lib/format/phone";
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

export default function ContactsBlock({ state, errors, onChange, onBlur }: Props) {
  const phoneRef = useRef<HTMLInputElement>(null);

  function setPhone(value: string) {
    onChange("phoneNumber", value);
    requestAnimationFrame(() => {
      const el = phoneRef.current;
      if (el) el.setSelectionRange(value.length, value.length);
    });
  }

  function handlePhoneChange(raw: string) {
    setPhone(formatPhoneMask(raw));
  }

  // Backspace на разделителе (скобка/пробел/тире) удаляет цифру слева,
  // иначе маска тут же восстанавливает разделитель и пользователь не может
  // удалить введённую цифру. Когда в поле остаётся только префикс «+7» —
  // Backspace очищает поле полностью, чтобы маска не "залипала".
  function handlePhoneKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Backspace") return;
    const el = e.currentTarget;
    const pos = el.selectionStart ?? 0;
    if (pos !== (el.selectionEnd ?? 0)) return;
    if (pos === 0) return;

    if (el.value === "+7" || el.value === "+") {
      e.preventDefault();
      onChange("phoneNumber", "");
      return;
    }

    const charBefore = el.value[pos - 1];
    if (/\d/.test(charBefore)) return;

    e.preventDefault();
    const before = el.value.slice(0, pos);
    const after = el.value.slice(pos);
    const trimmed = before.replace(/\d(?=\D*$)/, "");
    setPhone(formatPhoneMask(trimmed + after));
  }

  return (
    <FormSection
      title="Контакты и дополнительные сведения"
      description="В случае наличия одного и более соавторов указываются контактные данные одного автора, выбранного для контакта с редакцией."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sub-email" className={labelClass}>
              Почта{requiredMark}
            </label>
            <input
              id="sub-email"
              type="email"
              className={inputClass}
              placeholder="name@example.com"
              autoComplete="email"
              value={state.email}
              onChange={(e) => onChange("email", e.target.value)}
              onBlur={() => onBlur("email")}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className={errorClass}>{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="sub-phone" className={labelClass}>
              Контактный телефон{requiredMark}
            </label>
            <input
              id="sub-phone"
              ref={phoneRef}
              type="tel"
              className={inputClass}
              placeholder="+7 (___) ___-__-__"
              autoComplete="tel"
              inputMode="tel"
              value={state.phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              onKeyDown={handlePhoneKeyDown}
              onBlur={() => onBlur("phoneNumber")}
              aria-invalid={!!errors.phoneNumber}
            />
            {errors.phoneNumber && <p className={errorClass}>{errors.phoneNumber}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sub-degree" className={labelClass}>
              Учёная степень <span className="text-gray-500 font-normal">(при наличии)</span>
            </label>
            <input
              id="sub-degree"
              type="text"
              className={inputClass}
              value={state.degree}
              onChange={(e) => onChange("degree", e.target.value)}
              onBlur={() => onBlur("degree")}
            />
          </div>

          <div>
            <label htmlFor="sub-title" className={labelClass}>
              Учёное звание <span className="text-gray-500 font-normal">(при наличии)</span>
            </label>
            <input
              id="sub-title"
              type="text"
              className={inputClass}
              value={state.academicTitle}
              onChange={(e) => onChange("academicTitle", e.target.value)}
              onBlur={() => onBlur("academicTitle")}
            />
          </div>
        </div>

        <div>
          <label htmlFor="sub-funding" className={labelClass}>
            Источник финансирования и организация-грантодатель{" "}
            <span className="text-gray-500 font-normal">(при наличии)</span>
          </label>
          <input
            id="sub-funding"
            type="text"
            className={inputClass}
            value={state.funding}
            onChange={(e) => onChange("funding", e.target.value)}
            onBlur={() => onBlur("funding")}
          />
        </div>

        <div>
          <label htmlFor="sub-orcid" className={labelClass}>
            ORCID iD <span className="text-gray-500 font-normal">(при наличии)</span>
          </label>
          <input
            id="sub-orcid"
            type="text"
            className={inputClass}
            placeholder="0000-0000-0000-0000"
            value={state.orcidId}
            onChange={(e) => onChange("orcidId", e.target.value)}
            onBlur={() => onBlur("orcidId")}
            aria-invalid={!!errors.orcidId}
          />
          {errors.orcidId && <p className={errorClass}>{errors.orcidId}</p>}
        </div>
      </div>
    </FormSection>
  );
}
