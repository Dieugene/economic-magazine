"use client";

import { useEffect, useRef, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Upload, ChevronRight, Save, Trash2, Plus, FileText } from "lucide-react";
import { toast } from "sonner";
import type { IssueFull, IssueStatus, IssueSummary, Article, Section } from "@/lib/types";
import { adminApi, api } from "@/lib/api/client";
import { parseApiError } from "@/lib/api/errors";
import { comparePages } from "@/lib/utils/pages";
import DocumentTitle from "@/components/public/DocumentTitle";
import DateInput from "@/components/admin/DateInput";

const statusLabels: Record<IssueStatus, string> = {
  Draft: "Черновик",
  Ready: "Готов",
  Published: "Опубликован",
};

export default function IssueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const issueId = Number(id);
  const router = useRouter();

  const [issue, setIssue] = useState<IssueFull | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadError, setLoadError] = useState("");
  const [saveBusy, setSaveBusy] = useState(false);

  const [year, setYear] = useState<number>(0);
  const [number, setNumber] = useState<number>(0);
  const [seqNumber, setSeqNumber] = useState<number>(0);
  const [publishedDate, setPublishedDate] = useState<string>("");

  const coverInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [coverBusy, setCoverBusy] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);

  const [allSections, setAllSections] = useState<Section[]>([]);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);

  async function loadAll() {
    try {
      const data = await adminApi.getIssue(issueId);
      setIssue(data);
      setYear(data.year);
      setNumber(data.number);
      setSeqNumber(data.sequential_number);
      setPublishedDate(data.published_date ?? "");
      setSelectedSlugs(data.sections?.map((s) => s.slug) ?? []);
      try {
        const arts = await adminApi.listArticles(issueId);
        setArticles([...arts].sort((a, b) => comparePages(a.pages, b.pages)));
      } catch {
        setArticles([]);
      }
      setLoadError("");
    } catch (e) {
      setLoadError(parseApiError(e));
    }
  }

  useEffect(() => {
    if (!isNaN(issueId)) loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issueId]);

  useEffect(() => {
    api.getSections().then(setAllSections).catch(() => setAllSections([]));
  }, []);

  async function handleSave() {
    if (!issue) return;
    setSaveBusy(true);
    try {
      let allIssues: IssueSummary[] = [];
      try {
        allIssues = await adminApi.listIssues();
      } catch {
        // если список не получен — пропускаем pre-check, бэк всё равно ответит
      }
      const duplicate = allIssues.find(
        (i) => i.id !== issueId && i.year === year && i.number === number,
      );
      if (duplicate) {
        toast.error(
          `Выпуск ${year} № ${number} уже существует (id=${duplicate.id}). Измените номер.`,
        );
        setSaveBusy(false);
        return;
      }
      await adminApi.updateIssue(issueId, {
        year,
        number,
        sequential_number: seqNumber,
        sections_slugs: selectedSlugs,
        published_date: publishedDate || null,
      });
      await loadAll();
      toast.success("Выпуск сохранён");
    } catch (e) {
      toast.error(parseApiError(e), { description: "Не удалось сохранить номер" });
    } finally {
      setSaveBusy(false);
    }
  }

  async function handleStatusChange(newStatus: IssueStatus) {
    if (!issue) return;
    setSaveBusy(true);
    try {
      await adminApi.updateIssueStatus(issueId, newStatus);
      await loadAll();
      const successMsg =
        newStatus === "Published"
          ? "Номер опубликован"
          : `Статус изменён: ${statusLabels[newStatus]}`;
      toast.success(successMsg);
    } catch (e) {
      const errorDesc =
        newStatus === "Published"
          ? "Не удалось опубликовать"
          : "Не удалось изменить статус";
      toast.error(parseApiError(e), { description: errorDesc });
    } finally {
      setSaveBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Удалить номер? Это действие необратимо.")) return;
    setSaveBusy(true);
    try {
      await adminApi.deleteIssue(issueId);
      toast.success("Номер удалён");
      router.push("/control/issues");
    } catch (e) {
      toast.error(parseApiError(e), { description: "Не удалось удалить номер" });
      setSaveBusy(false);
    }
  }

  async function handleCoverUpload(file: File) {
    setCoverBusy(true);
    try {
      await adminApi.uploadIssueCover(issueId, file);
      await loadAll();
      toast.success("Обложка загружена");
    } catch (e) {
      toast.error(parseApiError(e), { description: "Не удалось загрузить обложку" });
    } finally {
      setCoverBusy(false);
    }
  }

  async function handlePdfUpload(file: File) {
    setPdfBusy(true);
    try {
      await adminApi.uploadIssuePdf(issueId, file);
      await loadAll();
      toast.success("PDF загружен");
    } catch (e) {
      toast.error(parseApiError(e), { description: "Не удалось загрузить PDF" });
    } finally {
      setPdfBusy(false);
    }
  }

  async function handleArticleDelete(articleId: number) {
    if (!confirm("Удалить статью?")) return;
    try {
      await adminApi.deleteArticle(articleId);
      await loadAll();
      toast.success("Статья удалена");
    } catch (e) {
      toast.error(parseApiError(e), { description: "Не удалось удалить статью" });
    }
  }

  if (loadError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded p-4 text-sm text-red-700">
        {loadError}
      </div>
    );
  }
  if (!issue) {
    return <div className="text-gray-400">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <DocumentTitle
        ru={`Номер № ${issue.number} (${issue.sequential_number}) / ${issue.year}`}
        en={`Issue No. ${issue.number} (${issue.sequential_number}) / ${issue.year}`}
      />

      <nav className="flex items-center gap-1.5 text-sm text-gray-400">
        <Link href="/control/issues" className="hover:text-forest-600 transition-colors">
          Номера
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-600">
          № {issue.number} ({issue.sequential_number}) / {issue.year}
        </span>
      </nav>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">
          Редактирование номера № {issue.number} ({issue.sequential_number}) / {issue.year}
        </h1>
        <button
          onClick={handleDelete}
          disabled={saveBusy}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:bg-red-50 px-3 py-2 rounded border border-red-200 disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          Удалить номер
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
          Данные номера
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="field-label" htmlFor="issue-year">Год</label>
            <input
              id="issue-year"
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="issue-number">Номер в году</label>
            <input
              id="issue-number"
              type="number"
              value={number}
              onChange={(e) => setNumber(Number(e.target.value))}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="issue-seq">Сквозной номер</label>
            <input
              id="issue-seq"
              type="number"
              value={seqNumber}
              onChange={(e) => setSeqNumber(Number(e.target.value))}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
            />
          </div>
          <DateInput
            id="issue-published-date"
            label="Дата выхода"
            value={publishedDate}
            onChange={setPublishedDate}
          />
          <div>
            <label className="field-label">Текущий статус</label>
            <p className="px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded">
              {statusLabels[issue.status]}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saveBusy}
            className="inline-flex items-center gap-2 bg-forest-600 text-white text-sm font-medium px-4 py-2 rounded-sm hover:bg-forest-700 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            Сохранить данные
          </button>
        </div>
      </div>

      {issue.status === "Published" && (
        <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Номер опубликован, но остаётся полностью редактируемым. Меняйте
          метаданные, рубрики, обложку, PDF, ссылку на XML, состав статей —
          изменения попадут на публичную страницу сразу после сохранения.
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
          Управление статусом
        </h2>
        <div className="flex flex-wrap gap-3">
          {issue.status !== "Draft" && (
            <button
              onClick={() => handleStatusChange("Draft")}
              disabled={saveBusy}
              className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              В черновик
            </button>
          )}
          {issue.status !== "Ready" && (
            <button
              onClick={() => handleStatusChange("Ready")}
              disabled={saveBusy}
              className="px-4 py-2 text-sm bg-copper-50 border border-copper-300 text-copper-700 rounded hover:bg-copper-100 disabled:opacity-50"
            >
              Пометить готовым
            </button>
          )}
          {issue.status !== "Published" && (
            <button
              onClick={() => handleStatusChange("Published")}
              disabled={saveBusy}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Опубликовать
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
          Рубрики номера
        </h2>
        {allSections.length === 0 ? (
          <p className="text-sm text-gray-500">
            Справочник рубрик пуст.
          </p>
        ) : (
          <div className="space-y-2">
            {allSections.map((s) => {
              const checked = selectedSlugs.includes(s.slug);
              return (
                <label
                  key={s.slug}
                  className="flex items-start gap-3 text-sm cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={saveBusy}
                    onChange={(e) => {
                      setSelectedSlugs((prev) =>
                        e.target.checked
                          ? [...prev, s.slug]
                          : prev.filter((x) => x !== s.slug)
                      );
                    }}
                    className="mt-0.5"
                  />
                  <span>
                    <span className="text-gray-800">{s.name.ru}</span>
                    <span className="text-gray-400 ml-2 text-xs">{s.slug}</span>
                  </span>
                </label>
              );
            })}
            <p className="text-xs text-gray-500 mt-3">
              Сохраняется вместе с данными номера по кнопке «Сохранить данные» выше.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
            Обложка
          </h2>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleCoverUpload(e.target.files[0])}
          />
          <button
            onClick={() => coverInputRef.current?.click()}
            disabled={coverBusy}
            className="w-full border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-forest-400 transition-colors disabled:opacity-50"
          >
            <Upload className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              {coverBusy ? "Загрузка..." : "Выбрать изображение"}
            </p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG</p>
          </button>
          {issue.cover_file && (
            <p className="text-xs text-gray-500 mt-3 truncate">
              Текущий файл:{" "}
              <a
                href={issue.cover_file}
                target="_blank"
                rel="noopener noreferrer"
                className="text-forest-600 underline"
              >
                {decodeURIComponent(issue.cover_file.split("/").pop() ?? "")}
              </a>
            </p>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
            PDF номера
          </h2>
          <input
            ref={pdfInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handlePdfUpload(e.target.files[0])}
          />
          <button
            onClick={() => pdfInputRef.current?.click()}
            disabled={pdfBusy}
            className="w-full border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-forest-400 transition-colors disabled:opacity-50"
          >
            <Upload className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              {pdfBusy ? "Загрузка..." : "Выбрать PDF-файл"}
            </p>
            <p className="text-xs text-gray-400 mt-1">PDF</p>
          </button>
          {issue.pdf_file && (
            <p className="text-xs text-gray-500 mt-3 truncate">
              Текущий файл:{" "}
              <a
                href={issue.pdf_file}
                target="_blank"
                rel="noopener noreferrer"
                className="text-forest-600 underline"
              >
                {decodeURIComponent(issue.pdf_file.split("/").pop() ?? "")}
              </a>
            </p>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Статьи номера
          </h2>
          <Link
            href={`/control/articles/new?issue_id=${issueId}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-forest-600 hover:bg-forest-50 px-3 py-1.5 rounded border border-forest-300"
          >
            <Plus className="w-4 h-4" />
            Добавить статью
          </Link>
        </div>

        {articles.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            В номере пока нет статей
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            <p className="text-xs text-gray-400 mb-2">
              Статьи отсортированы по диапазону страниц.
            </p>
            {articles.map((article, index) => (
              <div
                key={article.id}
                className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
              >
                <span className="w-7 h-7 flex-shrink-0 bg-gray-100 rounded text-xs font-medium text-gray-500 flex items-center justify-center">
                  {index + 1}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 truncate">
                    {article.title.ru}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    с. {article.pages || "—"}
                  </p>
                </div>

                <span className="flex-shrink-0 text-xs bg-stone-100 text-gray-500 px-2 py-0.5 rounded hidden sm:inline-block">
                  {article.section_name?.ru ?? "—"}
                </span>

                {article.pdf_file && (
                  <a
                    href={article.pdf_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 text-gray-400 hover:text-forest-600 transition-colors"
                    title="Открыть PDF"
                  >
                    <FileText className="w-4 h-4" />
                  </a>
                )}

                <Link
                  href={`/control/articles/${article.id}`}
                  className="flex-shrink-0 text-forest-600 hover:text-forest-700 text-xs font-medium transition-colors"
                >
                  Редактировать
                </Link>
                <button
                  onClick={() => handleArticleDelete(article.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                  title="Удалить"
                  aria-label="Удалить статью"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
