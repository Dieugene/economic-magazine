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
