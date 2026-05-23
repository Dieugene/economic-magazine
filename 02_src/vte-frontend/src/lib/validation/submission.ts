import type { SubmissionFormState, SubmissionErrors } from "@/lib/types/submission";

// Лимиты на файлы — синхронизированы с UI (FilesBlock).
export const DOCX_MAX_BYTES = 10 * 1024 * 1024; // 10 MB
export const ZIP_MAX_BYTES = 50 * 1024 * 1024;  // 50 MB

const REQUIRED = "Обязательное поле";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// ORCID: 16 цифр, разделённых дефисами, последний символ может быть X.
const ORCID_RE = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/;
const DOCX_EXTS = [".doc", ".docx"];
const ZIP_EXTS = [".zip"];

function hasExt(file: File, exts: string[]): boolean {
  const lower = file.name.toLowerCase();
  return exts.some((e) => lower.endsWith(e));
}

function countDigits(s: string): number {
  let n = 0;
  for (const ch of s) if (ch >= "0" && ch <= "9") n++;
  return n;
}

// Проверка одного поля. Возвращает сообщение или undefined, если валидно.
// Используется как при blur, так и при submit (см. validateAll ниже).
export function validateField(
  key: keyof SubmissionFormState,
  state: SubmissionFormState
): string | undefined {
  switch (key) {
    // Декларации (5 обязательных)
    case "declProfile":
    case "declOriginal":
    case "declComplete":
    case "declNoPlagiarism":
    case "declAgreement":
      return state[key] ? undefined : "Подтвердите этот пункт";

    // Поля автора
    case "authors":
      return state.authors.trim() ? undefined : REQUIRED;
    case "workplaceTitleAndAddress":
      return state.workplaceTitleAndAddress.trim() ? undefined : REQUIRED;
    case "positionTitle":
      return state.positionTitle.trim() ? undefined : REQUIRED;
    case "city":
      return state.city.trim() ? undefined : REQUIRED;

    // Контакты
    case "email":
      if (!state.email.trim()) return REQUIRED;
      if (!EMAIL_RE.test(state.email.trim())) return "Некорректный email";
      return undefined;
    case "phoneNumber":
      if (!state.phoneNumber.trim()) return REQUIRED;
      if (countDigits(state.phoneNumber) < 11) return "Введите номер полностью";
      return undefined;
    case "orcidId":
      if (!state.orcidId.trim()) return undefined; // optional
      if (!ORCID_RE.test(state.orcidId.trim())) return "Формат: 0000-0000-0000-000X";
      return undefined;

    // Файлы
    case "docxFile":
      if (!state.docxFile) return "Прикрепите файл статьи";
      if (!hasExt(state.docxFile, DOCX_EXTS)) return "Допустимые форматы: .doc, .docx";
      if (state.docxFile.size > DOCX_MAX_BYTES) return "Файл больше 10 МБ";
      return undefined;
    case "zipWithAdditionalFiles":
      if (!state.zipWithAdditionalFiles) return undefined; // optional
      if (!hasExt(state.zipWithAdditionalFiles, ZIP_EXTS)) return "Допустим только .zip";
      if (state.zipWithAdditionalFiles.size > ZIP_MAX_BYTES) return "Архив больше 50 МБ";
      return undefined;

    // Согласия
    case "consentAgreement":
      return state.consentAgreement ? undefined : "Необходимо ваше согласие";
    case "consentPersonalData":
      return state.consentPersonalData ? undefined : "Необходимо ваше согласие";

    // Опциональные текстовые поля и honeypot — не валидируем содержимое.
    default:
      return undefined;
  }
}

// Полная валидация всех полей (на submit). Возвращает мапу ошибок и флаг.
export function validateAll(state: SubmissionFormState): {
  errors: SubmissionErrors;
  isValid: boolean;
} {
  const keys: (keyof SubmissionFormState)[] = [
    "declProfile", "declOriginal", "declComplete", "declNoPlagiarism", "declAgreement",
    "authors", "workplaceTitleAndAddress", "positionTitle", "city",
    "email", "phoneNumber", "orcidId",
    "docxFile", "zipWithAdditionalFiles",
    "consentAgreement", "consentPersonalData",
  ];
  const errors: SubmissionErrors = {};
  for (const k of keys) {
    const msg = validateField(k, state);
    if (msg) errors[k] = msg;
  }
  return { errors, isValid: Object.keys(errors).length === 0 };
}

// Принят ли honeypot — значит, это бот. Submit silent no-op.
export function isHoneypotTripped(state: SubmissionFormState): boolean {
  return state.website.trim().length > 0;
}
