"use client";

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

export default function ConsentsBlock({ state, errors, onChange, onBlur }: Props) {
  return (
    <FormSection title="Согласия">
      <div className="space-y-3">
        <div>
          <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={state.consentAgreement}
              onChange={(e) => onChange("consentAgreement", e.target.checked as never)}
              onBlur={() => onBlur("consentAgreement")}
              className="mt-0.5 h-4 w-4 accent-forest-600 cursor-pointer flex-shrink-0"
            />
            <span className="leading-relaxed">
              Принимаю условия{" "}
              <Link href="/authors/copyright-agreement" target="_blank" className={linkClass}>
                авторского соглашения
              </Link>
              <span className="text-copper-400 ml-0.5">*</span>
            </span>
          </label>
          {errors.consentAgreement && (
            <p className="text-xs text-red-600 mt-1 ml-7">{errors.consentAgreement}</p>
          )}
        </div>

        <div>
          <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={state.consentPersonalData}
              onChange={(e) => onChange("consentPersonalData", e.target.checked as never)}
              onBlur={() => onBlur("consentPersonalData")}
              className="mt-0.5 h-4 w-4 accent-forest-600 cursor-pointer flex-shrink-0"
            />
            <span className="leading-relaxed">
              Принимаю условия{" "}
              <Link href="/privacy" target="_blank" className={linkClass}>
                политики обработки персональных данных
              </Link>{" "}
              и разрешаю обработку моих персональных данных в указанных целях
              <span className="text-copper-400 ml-0.5">*</span>
            </span>
          </label>
          {errors.consentPersonalData && (
            <p className="text-xs text-red-600 mt-1 ml-7">{errors.consentPersonalData}</p>
          )}
        </div>

        {/* Honeypot — скрыт от людей и a11y, но видим ботам, скрейпящим разметку. */}
        <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
          <label>
            Website
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={state.website}
              onChange={(e) => onChange("website", e.target.value)}
            />
          </label>
        </div>
      </div>
    </FormSection>
  );
}
