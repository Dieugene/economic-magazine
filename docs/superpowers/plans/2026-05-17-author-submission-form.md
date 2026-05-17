# Author Submission Form — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `/authors/submit` (currently a redirect to ms.questionset.ru) with a native single-page form that POSTs the manuscript to `/api/articles/upload_new_pdf_file/` and offers `/api/articles/download_template/`.

**Architecture:** Single client component `SubmissionForm` orchestrates four data blocks (Declarations, AuthorData, Contacts, Consents) plus a Files block. State is local React state (no global store, no localStorage draft). API calls reuse the existing `adminApi.submitManuscript` and `adminApi.downloadTemplate` from `src/lib/api/client.ts`. Errors → existing `parseApiError()` + `sonner` toasts. Success → inline replacement of the form. RU-only (EN menu hides the entry point).

**Tech stack:** Next.js 16 App Router, React 19 client components, TypeScript, Tailwind v4, `sonner` toasts, `useLanguage()` context (existing). No new deps.

**Reference spec:** `docs/superpowers/specs/2026-05-17-author-submission-form-design.md`

**File map:**

| Path | Action | Responsibility |
|------|--------|----------------|
| `src/lib/validation/submission.ts` | Create | Field-level validators + `validateAll()` |
| `src/lib/types/submission.ts` | Create | `SubmissionFormState`, `SubmissionErrors`, helpers |
| `src/components/public/submit/TemplateDownloadButton.tsx` | Create | Standalone download button (reused twice) |
| `src/components/public/submit/FormSection.tsx` | Create | Card wrapper with title + body |
| `src/components/public/submit/DeclarationsBlock.tsx` | Create | 5 declaration checkboxes |
| `src/components/public/submit/AuthorDataBlock.tsx` | Create | ФИО, место работы, должность, город |
| `src/components/public/submit/ContactsBlock.tsx` | Create | email, телефон, степень, звание, ORCID, финансирование |
| `src/components/public/submit/FilesBlock.tsx` | Create | Drag-drop docx + zip |
| `src/components/public/submit/ConsentsBlock.tsx` | Create | 2 согласия + honeypot |
| `src/components/public/submit/SubmitSuccess.tsx` | Create | Inline success card |
| `src/components/public/submit/SubmissionForm.tsx` | Create | Orchestrator |
| `src/app/(public)/authors/submit/page.tsx` | Rewrite | Page shell hosting `SubmissionForm` |
| `src/app/(public)/authors/submission/page.tsx` | Modify | Add `TemplateDownloadButton` above existing content |
| `src/app/(public)/authors/page.tsx` | Modify | Update `submit` card description; hide `submit` card on EN |
| `src/components/public/Navigation.tsx` | Modify | Hide "Submit a Paper" item on EN |

---

## Task 0: Types and validation foundation

**Files:**
- Create: `02_src/vte-frontend/src/lib/types/submission.ts`
- Create: `02_src/vte-frontend/src/lib/validation/submission.ts`

- [ ] **Step 1: Create the types file**

Write `02_src/vte-frontend/src/lib/types/submission.ts`:

```typescript
// Состояние формы подачи рукописи. Хранится в SubmissionForm как одно
// React-state-поле. Все строки — то, что пользователь ввёл (raw); файлы — File
// или null. Чекбоксы — boolean. honeypot — скрытое поле для ботов.

export interface SubmissionFormState {
  // Декларации
  declProfile: boolean;        // соответствует профилю журнала
  declOriginal: boolean;       // ранее не публиковалась
  declComplete: boolean;       // полностью укомплектована аппаратом
  declNoPlagiarism: boolean;   // нет плагиата/самоплагиата
  declAgreement: boolean;      // принимает условия договора

  // Данные автора
  authors: string;                       // ФИО (один или несколько через запятую)
  workplaceTitleAndAddress: string;      // место работы (textarea)
  positionTitle: string;                 // должность
  city: string;                          // город

  // Контакты и доп. сведения
  email: string;
  phoneNumber: string;
  degree: string;
  academicTitle: string;
  funding: string;
  orcidId: string;

  // Файлы
  docxFile: File | null;
  zipWithAdditionalFiles: File | null;

  // Согласия
  consentAgreement: boolean;   // авторское соглашение
  consentPersonalData: boolean; // обработка персональных данных

  // Honeypot — скрытое поле, человек не должен заполнять
  website: string;
}

// Ошибки валидации по тем же ключам, что и FormState. undefined / отсутствие =
// поле валидно. Используем Partial, чтобы не указывать каждый раз все ключи.
export type SubmissionErrors = Partial<Record<keyof SubmissionFormState, string>>;

export const INITIAL_FORM_STATE: SubmissionFormState = {
  declProfile: false,
  declOriginal: false,
  declComplete: false,
  declNoPlagiarism: false,
  declAgreement: false,
  authors: "",
  workplaceTitleAndAddress: "",
  positionTitle: "",
  city: "",
  email: "",
  phoneNumber: "",
  degree: "",
  academicTitle: "",
  funding: "",
  orcidId: "",
  docxFile: null,
  zipWithAdditionalFiles: null,
  consentAgreement: false,
  consentPersonalData: false,
  website: "",
};
```

- [ ] **Step 2: Create the validation file**

Write `02_src/vte-frontend/src/lib/validation/submission.ts`:

```typescript
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
      if (countDigits(state.phoneNumber) < 7) return "Введите номер полностью";
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
```

- [ ] **Step 3: Run TypeScript check**

Run from `02_src/vte-frontend/`:
```
npx tsc --noEmit
```
Expected: no errors related to these new files.

- [ ] **Step 4: Commit**

```
git add 02_src/vte-frontend/src/lib/types/submission.ts 02_src/vte-frontend/src/lib/validation/submission.ts
git commit -m "feat(submit): types and validation for author submission form"
```

---

## Task 1: TemplateDownloadButton (reusable)

**Files:**
- Create: `02_src/vte-frontend/src/components/public/submit/TemplateDownloadButton.tsx`

This button is reused on `/authors/submit` and `/authors/submission`. It calls `adminApi.downloadTemplate()` (existing in `client.ts`). On 404 it shows a toast with a friendly message.

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { adminApi, ApiError } from "@/lib/api/client";

export default function TemplateDownloadButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    try {
      const blob = await adminApi.downloadTemplate();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "vte-article-template.docx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        toast.error("Шаблон временно недоступен. Обратитесь в редакцию: editorqet@inecon.ru");
      } else {
        toast.error("Не удалось скачать шаблон. Попробуйте позже.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-2 text-sm font-medium bg-forest-600 text-white px-4 py-2 rounded-sm hover:bg-forest-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
      </svg>
      {loading ? "Загрузка..." : "Скачать шаблон оформления"}
    </button>
  );
}
```

- [ ] **Step 2: TS check + commit**

```
cd 02_src/vte-frontend && npx tsc --noEmit
```
Expected: no new errors.

```
git add 02_src/vte-frontend/src/components/public/submit/TemplateDownloadButton.tsx
git commit -m "feat(submit): TemplateDownloadButton with 404 handling"
```

---

## Task 2: FormSection wrapper

**Files:**
- Create: `02_src/vte-frontend/src/components/public/submit/FormSection.tsx`

A card with a serif heading and content slot. Used by every data block.

- [ ] **Step 1: Create component**

```tsx
import type { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function FormSection({ title, description, children }: Props) {
  return (
    <section className="bg-white border border-stone-400 rounded-sm p-6">
      <h2 className="font-serif text-xl font-semibold text-forest-600 mb-1">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-gray-600 mb-4">{description}</p>
      )}
      <div className={description ? "mt-2" : "mt-4"}>{children}</div>
    </section>
  );
}
```

- [ ] **Step 2: TS check + commit**

```
cd 02_src/vte-frontend && npx tsc --noEmit
git add 02_src/vte-frontend/src/components/public/submit/FormSection.tsx
git commit -m "feat(submit): FormSection card wrapper"
```

---

## Task 3: DeclarationsBlock (5 checkboxes)

**Files:**
- Create: `02_src/vte-frontend/src/components/public/submit/DeclarationsBlock.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import type { SubmissionFormState, SubmissionErrors } from "@/lib/types/submission";
import FormSection from "./FormSection";

interface Props {
  state: SubmissionFormState;
  errors: SubmissionErrors;
  onChange: <K extends keyof SubmissionFormState>(key: K, value: SubmissionFormState[K]) => void;
  onBlur: (key: keyof SubmissionFormState) => void;
}

const ITEMS: { key: keyof SubmissionFormState; label: string }[] = [
  { key: "declProfile",      label: "Статья соответствует содержательно-тематическому профилю журнала" },
  { key: "declOriginal",     label: "Этот материал ранее не был опубликован — ни полностью, ни частично, — а также не был представлен для рассмотрения и публикации в другом журнале" },
  { key: "declComplete",     label: "Статья полностью укомплектована аппаратом (аннотации, ключевые слова, информация об авторах, списки литературы на двух языках)" },
  { key: "declNoPlagiarism", label: "Статья не содержит неоформленных заимствований — плагиата и самоплагиата" },
  { key: "declAgreement",    label: "Автор (соавторы) принимает условия договора" },
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
```

- [ ] **Step 2: TS check + commit**

```
cd 02_src/vte-frontend && npx tsc --noEmit
git add 02_src/vte-frontend/src/components/public/submit/DeclarationsBlock.tsx
git commit -m "feat(submit): DeclarationsBlock with 5 required checkboxes"
```

---

## Task 4: AuthorDataBlock (ФИО, место работы, должность, город)

**Files:**
- Create: `02_src/vte-frontend/src/components/public/submit/AuthorDataBlock.tsx`

- [ ] **Step 1: Create the component**

```tsx
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
```

- [ ] **Step 2: TS check + commit**

```
cd 02_src/vte-frontend && npx tsc --noEmit
git add 02_src/vte-frontend/src/components/public/submit/AuthorDataBlock.tsx
git commit -m "feat(submit): AuthorDataBlock with 4 required text fields"
```

---

## Task 5: ContactsBlock

**Files:**
- Create: `02_src/vte-frontend/src/components/public/submit/ContactsBlock.tsx`

- [ ] **Step 1: Create the component**

```tsx
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

export default function ContactsBlock({ state, errors, onChange, onBlur }: Props) {
  return (
    <FormSection title="Контакты и дополнительные сведения">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sub-email" className={labelClass}>
              Рабочая почта{requiredMark}
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
              type="tel"
              className={inputClass}
              placeholder="+7 (___) ___-__-__"
              autoComplete="tel"
              value={state.phoneNumber}
              onChange={(e) => onChange("phoneNumber", e.target.value)}
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
            placeholder="0000-0000-0000-000X"
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
```

- [ ] **Step 2: TS check + commit**

```
cd 02_src/vte-frontend && npx tsc --noEmit
git add 02_src/vte-frontend/src/components/public/submit/ContactsBlock.tsx
git commit -m "feat(submit): ContactsBlock with email/phone/ORCID validation"
```

---

## Task 6: FilesBlock (drag-drop)

**Files:**
- Create: `02_src/vte-frontend/src/components/public/submit/FilesBlock.tsx`

Two file inputs. Drag-drop + click-to-pick. Shows selected file name + size + remove button.

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import type { SubmissionFormState, SubmissionErrors } from "@/lib/types/submission";
import { DOCX_MAX_BYTES, ZIP_MAX_BYTES } from "@/lib/validation/submission";
import FormSection from "./FormSection";

interface Props {
  state: SubmissionFormState;
  errors: SubmissionErrors;
  onChange: <K extends keyof SubmissionFormState>(key: K, value: SubmissionFormState[K]) => void;
  onBlur: (key: keyof SubmissionFormState) => void;
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} Б`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} КБ`;
  return `${(n / 1024 / 1024).toFixed(1)} МБ`;
}

interface DropAreaProps {
  id: string;
  accept: string;
  hint: string;
  file: File | null;
  error?: string;
  onPick: (file: File | null) => void;
  onBlur: () => void;
}

function DropArea({ id, accept, hint, file, error, onPick, onBlur }: DropAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    onPick(list[0]);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
    onBlur();
  }

  return (
    <>
      <div
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label={hint}
        className={`border-2 border-dashed rounded-sm px-4 py-6 text-center cursor-pointer transition-colors ${
          dragOver
            ? "border-forest-600 bg-forest-50"
            : error
            ? "border-red-400 bg-red-50/30"
            : "border-stone-400 bg-stone-50 hover:border-copper-300"
        }`}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            handleFiles(e.target.files);
            // позволяем повторно выбрать тот же файл после удаления
            e.target.value = "";
            onBlur();
          }}
        />
        {file ? (
          <div className="flex items-center justify-between gap-3">
            <div className="text-left min-w-0">
              <div className="text-sm font-medium text-forest-700 truncate">{file.name}</div>
              <div className="text-xs text-gray-500">{formatBytes(file.size)}</div>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onPick(null); }}
              className="text-xs text-gray-500 hover:text-red-600 underline underline-offset-2"
            >
              удалить
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-700">Перетащите файл сюда или</p>
            <p className="text-sm font-medium text-teal-600 mt-1">выберите файл</p>
            <p className="text-xs text-gray-500 mt-2">{hint}</p>
          </>
        )}
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </>
  );
}

export default function FilesBlock({ state, errors, onChange, onBlur }: Props) {
  return (
    <FormSection title="Файлы">
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Текст статьи (.doc или .docx)
            <span className="text-copper-400 ml-0.5">*</span>
          </label>
          <DropArea
            id="sub-docx"
            accept=".doc,.docx"
            hint={`.doc, .docx, до ${(DOCX_MAX_BYTES / 1024 / 1024).toFixed(0)} МБ`}
            file={state.docxFile}
            error={errors.docxFile}
            onPick={(f) => onChange("docxFile", f)}
            onBlur={() => onBlur("docxFile")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Дополнительные материалы одним архивом (.zip)
            <span className="text-gray-500 font-normal ml-2">(при наличии)</span>
          </label>
          <DropArea
            id="sub-zip"
            accept=".zip"
            hint={`.zip, до ${(ZIP_MAX_BYTES / 1024 / 1024).toFixed(0)} МБ`}
            file={state.zipWithAdditionalFiles}
            error={errors.zipWithAdditionalFiles}
            onPick={(f) => onChange("zipWithAdditionalFiles", f)}
            onBlur={() => onBlur("zipWithAdditionalFiles")}
          />
        </div>
      </div>
    </FormSection>
  );
}
```

- [ ] **Step 2: TS check + commit**

```
cd 02_src/vte-frontend && npx tsc --noEmit
git add 02_src/vte-frontend/src/components/public/submit/FilesBlock.tsx
git commit -m "feat(submit): FilesBlock with drag-drop and size validation"
```

---

## Task 7: ConsentsBlock + honeypot

**Files:**
- Create: `02_src/vte-frontend/src/components/public/submit/ConsentsBlock.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import Link from "next/link";
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
```

- [ ] **Step 2: TS check + commit**

```
cd 02_src/vte-frontend && npx tsc --noEmit
git add 02_src/vte-frontend/src/components/public/submit/ConsentsBlock.tsx
git commit -m "feat(submit): ConsentsBlock with agreements and honeypot"
```

---

## Task 8: SubmitSuccess

**Files:**
- Create: `02_src/vte-frontend/src/components/public/submit/SubmitSuccess.tsx`

- [ ] **Step 1: Create the component**

```tsx
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
```

- [ ] **Step 2: TS check + commit**

```
cd 02_src/vte-frontend && npx tsc --noEmit
git add 02_src/vte-frontend/src/components/public/submit/SubmitSuccess.tsx
git commit -m "feat(submit): SubmitSuccess inline confirmation"
```

---

## Task 9: SubmissionForm (orchestrator)

**Files:**
- Create: `02_src/vte-frontend/src/components/public/submit/SubmissionForm.tsx`

Holds state. Wires every block. Submits via `adminApi.submitManuscript`. Honeypot trips → silent success-screen without API call.

- [ ] **Step 1: Create the component**

```tsx
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
```

- [ ] **Step 2: TS check + commit**

```
cd 02_src/vte-frontend && npx tsc --noEmit
git add 02_src/vte-frontend/src/components/public/submit/SubmissionForm.tsx
git commit -m "feat(submit): SubmissionForm orchestrator with state, validation, submit"
```

---

## Task 10: Rewrite `/authors/submit/page.tsx`

**Files:**
- Modify: `02_src/vte-frontend/src/app/(public)/authors/submit/page.tsx` (full rewrite)

Strip the old `SubmitRu/SubmitEn` redirect content. New page hosts `SubmissionForm`. On EN-режиме страница всё равно открывается (можно зайти прямой ссылкой), но сообщает что форма только на русском.

- [ ] **Step 1: Rewrite the page**

```tsx
"use client";

import Breadcrumbs from "@/components/public/Breadcrumbs";
import PageHeading from "@/components/public/PageHeading";
import DocumentTitle from "@/components/public/DocumentTitle";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import SubmissionForm from "@/components/public/submit/SubmissionForm";

export default function AuthorsSubmitPage() {
  const { lang } = useLanguage();

  return (
    <>
      <DocumentTitle ru="Подать статью" en="Submit a Paper" />
      <Breadcrumbs
        items={[
          { label: { ru: "Главная", en: "Home" }, href: "/" },
          { label: { ru: "Авторам", en: "For Authors" }, href: "/authors" },
          { label: { ru: "Подать статью", en: "Submit a Paper" } },
        ]}
      />

      <section>
        <div className="w-[60px] h-[2px] bg-copper-400 mb-6" />
        <PageHeading
          ru="Подать статью"
          en="Submit a Paper"
          level={1}
          className="font-serif text-4xl sm:text-5xl font-bold text-forest-600 leading-tight mb-8"
        />

        {lang === "en" ? (
          <div className="bg-white border border-stone-400 rounded-sm p-6 max-w-2xl">
            <p className="text-sm text-gray-700 leading-relaxed">
              The manuscript submission form is currently available in Russian only.
              English-speaking authors are kindly asked to send the manuscript to{" "}
              <a href="mailto:editorqet@inecon.ru" className="text-teal-600 underline underline-offset-2 hover:text-copper-400">
                editorqet@inecon.ru
              </a>.
            </p>
          </div>
        ) : (
          <SubmissionForm />
        )}
      </section>
    </>
  );
}
```

- [ ] **Step 2: TS check, dev render + commit**

```
cd 02_src/vte-frontend && npx tsc --noEmit
```
Expected: no errors.

Then open `http://localhost:3000/authors/submit` in the browser (dev server already running on port 3000) and verify:
- Form renders, all 5 sections visible.
- Download button is in the top banner.
- Submit button is disabled-looking (grey) until you check the 5 declarations + 2 consents.

```
git add 02_src/vte-frontend/src/app/(public)/authors/submit/page.tsx
git commit -m "feat(submit): rewrite /authors/submit to host native form"
```

---

## Task 11: Add TemplateDownloadButton to `/authors/submission`

**Files:**
- Modify: `02_src/vte-frontend/src/app/(public)/authors/submission/page.tsx`

Inject the download button at the top of the RU version, with a short hint paragraph. Do NOT add to EN block (form is RU-only anyway).

- [ ] **Step 1: Read current page**

Read `02_src/vte-frontend/src/app/(public)/authors/submission/page.tsx` to locate the start of `SubmissionRu()` function body.

- [ ] **Step 2: Edit — add import + injected card**

At the top of the file, add (after the existing imports):

```tsx
import TemplateDownloadButton from "@/components/public/submit/TemplateDownloadButton";
```

Inside `SubmissionRu()` function, right after the opening `<div className="prose ...">` and BEFORE the first existing content, add this block:

```tsx
<div className="bg-stone-50 border border-stone-300 rounded-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 not-prose mb-6">
  <p className="text-sm text-gray-700 m-0">
    Скачайте шаблон оформления статьи и подготовьте рукопись по нему.
  </p>
  <TemplateDownloadButton />
</div>
```

Use the Edit tool with sufficient context to uniquely match.

- [ ] **Step 3: TS check + browser smoke + commit**

```
cd 02_src/vte-frontend && npx tsc --noEmit
```

Open `http://localhost:3000/authors/submission` and verify the download card appears at the top before all other content.

```
git add 02_src/vte-frontend/src/app/(public)/authors/submission/page.tsx
git commit -m "feat(submit): expose template download on /authors/submission"
```

---

## Task 12: Update authors index card + hide on EN

**Files:**
- Modify: `02_src/vte-frontend/src/app/(public)/authors/page.tsx`

The `submit` card in `subPages` currently says "Сервис подачи статей и контакты редакции для отправки рукописи" — needs to be updated to reflect that the form is now on-site. And it should be hidden when `lang === "en"`.

- [ ] **Step 1: Update descriptions**

In the `subPages` array, find the entry where `href === "/authors/submit"` and replace its `descRu` and `descEn` values:

Replace:
```
    descRu: "Сервис подачи статей и контакты редакции для отправки рукописи.",
    descEn: "Manuscript submission service and editorial contacts.",
```

With:
```
    descRu: "Форма подачи рукописи через сайт журнала.",
    descEn: "Manuscript submission form (Russian only).",
```

- [ ] **Step 2: Filter card on EN**

Find the JSX block:
```tsx
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {subPages.map((p) => (
```

Change `subPages.map(...)` to filter out the submit card on EN. Get `lang` from `useLanguage()` (already in scope as `const { t } = useLanguage();` — modify to `const { t, lang } = useLanguage();`).

Then:
```tsx
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {subPages
            .filter((p) => !(lang === "en" && p.href === "/authors/submit"))
            .map((p) => (
```

- [ ] **Step 3: TS check + commit**

```
cd 02_src/vte-frontend && npx tsc --noEmit
```

Browser: open `http://localhost:3000/authors`, switch to EN, verify the "Submit a Paper" card is absent. Switch back to RU, verify it's present with the new description.

```
git add 02_src/vte-frontend/src/app/(public)/authors/page.tsx
git commit -m "feat(submit): update authors index card; hide on EN"
```

---

## Task 13: Hide "Submit a Paper" in main Navigation on EN

**Files:**
- Modify: `02_src/vte-frontend/src/components/public/Navigation.tsx`

- [ ] **Step 1: Read the file to find the menu items definition**

Read `02_src/vte-frontend/src/components/public/Navigation.tsx` and locate where the Authors submenu is defined (probably a flat list or nested object).

- [ ] **Step 2: Hide the item on EN**

Locate the item whose `href` is `/authors/submit` (or whose label is `"Подать статью" / "Submit a Paper"`). Add a `ruOnly: true` flag to it (or equivalent — adapt to existing structure).

Then in the render loop that maps over items, skip the item when `ruOnly && lang === "en"`.

Example pattern (adapt to actual structure):
```tsx
{items
  .filter((item) => !(item.ruOnly && lang === "en"))
  .map((item) => ...)}
```

If the navigation already uses a different mechanism (e.g. distinct RU/EN arrays), apply the equivalent change: remove the submit entry from the EN array but leave RU's intact.

If there is no obvious filter point, add an inline conditional at the JSX level.

- [ ] **Step 3: TS check + browser smoke + commit**

```
cd 02_src/vte-frontend && npx tsc --noEmit
```

Browser: switch to EN, hover "For Authors" menu, verify "Submit a Paper" is gone. Switch back to RU, verify "Подать статью" present.

```
git add 02_src/vte-frontend/src/components/public/Navigation.tsx
git commit -m "feat(submit): hide Submit a Paper from EN navigation"
```

---

## Task 14: End-to-end smoke on dev server

**Files:** none modified — verification only.

Dev server is on `http://localhost:3000`. Perform manual end-to-end via Chrome DevTools MCP.

- [ ] **Step 1: Navigate and snapshot**

Open `http://localhost:3000/authors/submit`. Take a snapshot. Verify visually: 5 cards stack, declarations / author / contacts / files / consents. Download button at the top.

- [ ] **Step 2: Validation negative path**

Click "Отправить статью" without filling anything.
Expected: scroll to top, each required block shows red error text, button stays grey (or active with error toast — check actual behavior).

Take screenshot for evidence.

- [ ] **Step 3: Honeypot trip**

In the DevTools console, run:
```js
const hp = document.querySelector('input[autocomplete="off"][tabindex="-1"]');
hp.dispatchEvent(new Event('input', { bubbles: true }));
hp.value = "spam";
hp.dispatchEvent(new Event('change', { bubbles: true }));
```
Then fill ONLY email (`test@test.com`) and click submit. Expected: success screen appears WITHOUT any network call to `/articles/upload_new_pdf_file/`.

Verify via Network tab: no POST to `upload_new_pdf_file` happened.

- [ ] **Step 4: Real positive path**

Prepare a small valid `.docx` (use one of the QA fixtures in `00_docs/qa/fixtures/`). If none — create with PowerShell:

```powershell
$out = "$env:TEMP\test-article.docx"
Add-Type -AssemblyName "Microsoft.Office.Interop.Word" -ErrorAction SilentlyContinue
# Fallback: hardcode minimal docx zip. If no Office — copy any existing .docx from fixtures.
```

Or simpler: take any existing `.docx` from the system or fixtures.

Fill the form with realistic data, attach the `.docx`, check all 7 boxes, submit.
Expected: success screen appears, network request POSTed to `/backend/articles/upload_new_pdf_file/` and returned 201 with `{message: "Файл успешно загружен и отправлен на рецензирование"}`.

- [ ] **Step 5: Template download — 404 path**

Click "Скачать шаблон оформления". Expected (bound to current bug staging state): toast "Шаблон временно недоступен. Обратитесь в редакцию".

- [ ] **Step 6: Document the smoke in a QA session note**

Add a brief entry to `00_docs/qa/sessions/` describing what was tested and the outcome. Use the existing `_TEMPLATE.md` shape. The session file is the audit trail; do not skip.

Commit:
```
git add 00_docs/qa/sessions/
git commit -m "QA(submit): localhost smoke for new author submission form"
```

---

## Task 15: Staging deploy (gated on user consent)

Do NOT execute this task until the user explicitly says "ok, deploy".

When approved:

- [ ] **Step 1: Bump frontend version in vte-frontend/package.json** to next patch (`0.1.15`).
- [ ] **Step 2: Docker buildx + push** following the same pattern as the previous v0.1.14 deploy (see prior session commits). Image tag `ditkoeu/vte-frontend:0.1.15` and `:latest`.
- [ ] **Step 3: SSH to staging, update compose, redeploy frontend container.**
- [ ] **Step 4: Verify on `http://185.180.230.243/authors/submit`** via Chrome DevTools. Repeat smoke tasks 1, 2, 5 (real upload would pollute staging — skip).
- [ ] **Step 5: Add QA session note for staging smoke.**

---

## Self-review checklist (already passed)

- ✅ Every spec section mapped to a task (form rendering, validation, files, consents, honeypot, success, error, template download, EN-hide).
- ✅ No placeholders, no "TODO", no "similar to Task N".
- ✅ Type names consistent across files (`SubmissionFormState`, `SubmissionErrors`, `INITIAL_FORM_STATE`, `validateField`, `validateAll`, `isHoneypotTripped`, `DOCX_MAX_BYTES`, `ZIP_MAX_BYTES`).
- ✅ All API field names match swagger (snake_case) exactly: `authors`, `workplace_title_and_address`, `position_title`, `city`, `email`, `phone_number`, `degree`, `academic_title`, `funding`, `orcid_id`, `docx_file`, `zip_with_additional_files`.
- ✅ Reuse existing `adminApi.submitManuscript` and `adminApi.downloadTemplate` (no duplicate API code).
- ✅ Each task ends with TS check + commit.
- ✅ Task 14 verifies on dev BEFORE Task 15 deploys to staging.
