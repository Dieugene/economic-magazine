"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import type { IssueSummary, IssueStatus } from "@/lib/types";
import { adminApi } from "@/lib/api/client";
import { parseApiError } from "@/lib/api/errors";
import DocumentTitle from "@/components/public/DocumentTitle";

const statusLabels: Record<IssueStatus, string> = {
  Draft: "Черновик",
  Ready: "Готов",
  Published: "Опубликован",
};

const statusColors: Record<IssueStatus, string> = {
  Draft: "bg-gray-100 text-gray-600",
  Ready: "bg-copper-50 text-copper-600",
  Published: "bg-green-50 text-green-700",
};

export default function IssuesPage() {
  const [issues, setIssues] = useState<IssueSummary[] | null>(null);
  const [yearFilter, setYearFilter] = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<IssueStatus | "all">("all");
  const [createOpen, setCreateOpen] = useState(false);

  async function loadIssues() {
    try {
      const data = await adminApi.listIssues();
      setIssues(data);
    } catch (e) {
      toast.error(parseApiError(e), { description: "Не удалось загрузить список номеров" });
      setIssues([]);
    }
  }

  useEffect(() => {
    loadIssues();
  }, []);

  const availableYears = useMemo(() => {
    if (!issues) return [];
    return [...new Set(issues.map((i) => i.year))].sort((a, b) => b - a);
  }, [issues]);

  const filtered = useMemo(() => {
    if (!issues) return [];
    return issues.filter((issue) => {
      if (yearFilter !== "all" && issue.year !== yearFilter) return false;
      if (statusFilter !== "all" && issue.status !== statusFilter) return false;
      return true;
    });
  }, [issues, yearFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <DocumentTitle ru="Управление номерами" en="Issues Management" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">
          Управление номерами
        </h1>
        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 bg-forest-600 text-white text-sm font-medium px-4 py-2 rounded-sm hover:bg-forest-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Создать номер
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div>
            <label className="field-label" htmlFor="year-filter">Год</label>
            <select
              id="year-filter"
              value={yearFilter}
              onChange={(e) =>
                setYearFilter(e.target.value === "all" ? "all" : Number(e.target.value))
              }
              className="border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
            >
              <option value="all">Все годы</option>
              {availableYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="status-filter">Статус</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as IssueStatus | "all")}
              className="border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
            >
              <option value="all">Все статусы</option>
              <option value="Draft">Черновик</option>
              <option value="Ready">Готов</option>
              <option value="Published">Опубликован</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-3 font-medium text-gray-500">Год</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Номер</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Сквозной №</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Дата выхода</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Статус</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Статей</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Рубрик</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Действия</th>
            </tr>
          </thead>
          <tbody>
            {issues === null ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  Загрузка...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  Номера не найдены
                </td>
              </tr>
            ) : (
              filtered.map((issue) => (
                <tr
                  key={issue.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-800">{issue.year}</td>
                  <td className="px-4 py-3 text-gray-800">№ {issue.number}</td>
                  <td className="px-4 py-3 text-gray-500">{issue.sequential_number}</td>
                  <td className="px-4 py-3 text-gray-500">{issue.published_date || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${statusColors[issue.status]}`}
                    >
                      {statusLabels[issue.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {issue.sections
                      ? issue.sections.reduce((sum, s) => sum + s.articles.length, 0)
                      : issue.articles_count}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{issue.sections?.length ?? 0}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/control/issues/${issue.id}`}
                      className="text-forest-600 hover:text-forest-700 text-sm font-medium transition-colors"
                    >
                      Редактировать
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {createOpen && (
        <CreateIssueModal
          onClose={() => setCreateOpen(false)}
          onCreated={() => {
            setCreateOpen(false);
            loadIssues();
          }}
        />
      )}
    </div>
  );
}

function CreateIssueModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const now = new Date();
  const [year, setYear] = useState<number>(now.getFullYear());
  const [number, setNumber] = useState<number>(1);
  const [seq, setSeq] = useState<number>(1);
  const [busy, setBusy] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await adminApi.createIssue({ year, number, sequential_number: seq });
      toast.success("Номер создан");
      onCreated();
    } catch (e) {
      toast.error(parseApiError(e), { description: "Не удалось создать номер" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Новый номер</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="field-label" htmlFor="new-year">Год</label>
            <input
              id="new-year"
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
              required
            />
          </div>
          <div>
            <label className="field-label" htmlFor="new-number">Номер в году</label>
            <input
              id="new-number"
              type="number"
              min={1}
              value={number}
              onChange={(e) => setNumber(Number(e.target.value))}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
              required
            />
          </div>
          <div>
            <label className="field-label" htmlFor="new-seq">Сквозной номер</label>
            <input
              id="new-seq"
              type="number"
              min={1}
              value={seq}
              onChange={(e) => setSeq(Number(e.target.value))}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
              required
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-200 rounded text-gray-600 hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 text-sm bg-forest-600 text-white rounded hover:bg-forest-700 disabled:opacity-50"
            >
              {busy ? "Создаём..." : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
