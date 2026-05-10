"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, ClipboardEvent } from "react";
import { toast } from "sonner";
import { formatDateRu, isValidYmd, ruToIso } from "@/lib/utils/date";

interface DateInputProps {
  /** ISO YYYY-MM-DD (или "" / null). Контролируемое значение. */
  value: string | null;
  /** Вызывается ISO-строкой при валидной дате; пустой строкой при стирании/невалидной. */
  onChange: (iso: string) => void;
  label?: string;
  required?: boolean;
  id?: string;
  disabled?: boolean;
  /** Подсказка, видимая под полем когда оно пустое. */
  placeholderHint?: string;
}

const ISO_PASTE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const RU_PASTE_RE = /^(\d{2})\.(\d{2})\.(\d{4})$/;

// Маска: цифры → автоматически вставляем точки после 2-й и 4-й цифры.
function applyMask(digits: string): string {
  const d = digits.slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}.${d.slice(2)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 4)}.${d.slice(4)}`;
}

export default function DateInput({
  value,
  onChange,
  label,
  required,
  id,
  disabled,
  placeholderHint,
}: DateInputProps) {
  const [display, setDisplay] = useState<string>(formatDateRu(value));
  const [error, setError] = useState<string>("");

  // Синхронизация при внешних изменениях value (например, после loadAll()).
  useEffect(() => {
    const fromIso = formatDateRu(value);
    setDisplay((prev) => (sameDate(prev, fromIso) ? prev : fromIso));
    if (fromIso) setError("");
  }, [value]);

  function commit(displayValue: string) {
    if (!displayValue) {
      setError("");
      onChange("");
      return;
    }
    if (displayValue.length !== 10) {
      // Не до конца набрано — ничего не публикуем, ошибку не показываем.
      setError("");
      return;
    }
    const m = RU_PASTE_RE.exec(displayValue);
    if (!m) {
      setError("Неверная дата");
      onChange("");
      return;
    }
    const [, dd, mm, yyyy] = m;
    if (!isValidYmd(Number(yyyy), Number(mm), Number(dd))) {
      setError("Неверная дата");
      onChange("");
      return;
    }
    setError("");
    onChange(`${yyyy}-${mm}-${dd}`);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "");
    const masked = applyMask(digits);
    setDisplay(masked);
    commit(masked);
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const raw = e.clipboardData.getData("text").trim();
    if (!raw) return;
    let masked = "";
    const isoMatch = ISO_PASTE_RE.exec(raw);
    const ruMatch = RU_PASTE_RE.exec(raw);
    if (isoMatch) {
      const [, y, mo, d] = isoMatch;
      masked = `${d}.${mo}.${y}`;
    } else if (ruMatch) {
      masked = raw;
    } else {
      e.preventDefault();
      toast.error("Не удалось распознать дату. Используйте формат ДД.ММ.ГГГГ");
      return;
    }
    e.preventDefault();
    setDisplay(masked);
    commit(masked);
  }

  const isInvalid = Boolean(error);
  const inputId = id ?? "date-input";
  const hintId = `${inputId}-hint`;

  return (
    <div>
      {label && (
        <label className="field-label" htmlFor={inputId}>
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <input
        id={inputId}
        type="text"
        inputMode="numeric"
        value={display}
        onChange={handleChange}
        onPaste={handlePaste}
        placeholder="ДД.ММ.ГГГГ"
        disabled={disabled}
        required={required}
        aria-invalid={isInvalid || undefined}
        aria-describedby={hintId}
        maxLength={10}
        className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600 ${
          isInvalid ? "border-red-400" : "border-gray-200"
        }`}
      />
      <p id={hintId} className={`mt-1 text-xs ${isInvalid ? "text-red-600" : "text-gray-400"}`}>
        {error || placeholderHint || "Формат: ДД.ММ.ГГГГ"}
      </p>
    </div>
  );
}

function sameDate(a: string, b: string): boolean {
  return a === b;
}
