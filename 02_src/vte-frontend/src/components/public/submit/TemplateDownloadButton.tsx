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
      if (err instanceof ApiError && (err.status === 404 || err.status === 401 || err.status === 403)) {
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
