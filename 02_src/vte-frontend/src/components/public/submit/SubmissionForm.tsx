"use client";

import { useState, useMemo } from "react";
import { adminApi } from "@/lib/api/client";
import { parseApiError } from "@/lib/api/errors";
import type { SubmissionFormState, SubmissionErrors } from "@/lib/types/submission";
import { INITIAL_FORM_STATE } from "@/lib/types/submission";
import { validateField, validateAll, isHoneypotTripped } from "@/lib/validation/submission";

import TemplateDownloadButton from "./TemplateDownloadButton";
import DeclarationsBlock from "./DeclarationsBlock";
import AuthorDataBlock from "./AuthorDataBlock";
import ContactsBlock from "./ContactsBlock";
import FilesBlock from "./FilesBlock";
import ConsentsBlock from "./ConsentsBlock";
import SubmitSuccess from "./SubmitSuccess";

type Status = "idle" | "submitting" | "success" | "error";

export default function SubmissionForm() {
  const [state, setState] = useState<SubmissionFormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<SubmissionErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string>("");

  function handleChange<K extends keyof SubmissionFormState>(key: K, value: SubmissionFormState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
    // Если поле уже было помечено как ошибочное — переоцениваем сразу,
    // чтобы пользователь видел, что исправил.
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev, [key]: value };
      // Пересчитываем на временном state с новым значением
      const msg = validateField(key, { ...state, [key]: value });
      const updated = { ...prev };
      if (msg) updated[key] = msg;
      else delete updated[key];
      return updated;
    });
  }

  function handleBlur(key: keyof SubmissionFormState) {
    const msg = validateField(key, state);
    setErrors((prev) => {
      const next = { ...prev };
      if (msg) next[key] = msg;
      else delete next[key];
      return next;
    });
  }

  function handleReset() {
    setState(INITIAL_FORM_STATE);
    setErrors({});
    setStatus("idle");
    setServerError(null);
    setSubmittedEmail("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    // Honeypot — молча выходим в success без обращения к API.
    if (isHoneypotTripped(state)) {
      setSubmittedEmail(state.email || "—");
      setStatus("success");
      return;
    }

    const { errors: validation, isValid } = validateAll(state);
    setErrors(validation);
    if (!isValid) {
      // Скроллим к первой ошибке.
      const firstKey = Object.keys(validation)[0];
      const el = document.querySelector(`[aria-invalid="true"], [id="sub-${firstKey}"]`);
      if (el && el instanceof HTMLElement) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setStatus("submitting");
    setServerError(null);
    try {
      await adminApi.submitManuscript({
        authors: state.authors.trim(),
        workplace_title_and_address: state.workplaceTitleAndAddress.trim(),
        position_title: state.positionTitle.trim(),
        city: state.city.trim(),
        email: state.email.trim(),
        phone_number: state.phoneNumber.trim(),
        degree: state.degree.trim() || undefined,
        academic_title: state.academicTitle.trim() || undefined,
        funding: state.funding.trim() || undefined,
        orcid_id: state.orcidId.trim() || undefined,
        docx_file: state.docxFile!,
        zip_with_additional_files: state.zipWithAdditionalFiles ?? undefined,
      });
      setSubmittedEmail(state.email.trim());
      setStatus("success");
    } catch (err) {
      setServerError(parseApiError(err));
      setStatus("error");
    }
  }

  // Кнопка сабмита подсвечена активной, только когда все обязательные согласия
  // и декларации отмечены — это даёт пользователю визуальный сигнал, что не хватает.
  const baselineReady = useMemo(() => {
    return (
      state.declProfile && state.declOriginal && state.declComplete &&
      state.declNoPlagiarism && state.declAgreement &&
      state.consentAgreement && state.consentPersonalData
    );
  }, [
    state.declProfile, state.declOriginal, state.declComplete,
    state.declNoPlagiarism, state.declAgreement,
    state.consentAgreement, state.consentPersonalData,
  ]);

  if (status === "success") {
    return <SubmitSuccess email={submittedEmail} onReset={handleReset} />;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="bg-stone-50 border border-stone-300 rounded-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-gray-700">
          Скачайте шаблон оформления статьи и подготовьте рукопись по нему.
        </p>
        <TemplateDownloadButton />
      </div>

      <DeclarationsBlock state={state} errors={errors} onChange={handleChange} onBlur={handleBlur} />
      <AuthorDataBlock state={state} errors={errors} onChange={handleChange} onBlur={handleBlur} />
      <ContactsBlock state={state} errors={errors} onChange={handleChange} onBlur={handleBlur} />
      <FilesBlock state={state} errors={errors} onChange={handleChange} onBlur={handleBlur} />
      <ConsentsBlock state={state} errors={errors} onChange={handleChange} onBlur={handleBlur} />

      {status === "error" && serverError && (
        <div role="alert" className="border border-red-300 bg-red-50 rounded-sm px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
        {!baselineReady && (
          <p className="text-xs text-gray-500 sm:mr-auto">
            Отметьте все обязательные пункты подтверждений и согласий, чтобы отправить.
          </p>
        )}
        <button
          type="submit"
          disabled={status === "submitting"}
          className={`inline-flex items-center justify-center gap-2 text-sm font-medium px-6 py-2.5 rounded-sm transition-colors ${
            baselineReady
              ? "bg-forest-600 text-white hover:bg-forest-700"
              : "bg-stone-300 text-stone-600 hover:bg-stone-400"
          } disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {status === "submitting" ? "Отправка..." : "Отправить статью"}
        </button>
      </div>
    </form>
  );
}
