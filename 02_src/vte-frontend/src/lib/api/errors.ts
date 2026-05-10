import { ApiError } from "./client";

// Превращает ошибку из fetch/ApiError в человекочитаемое русское сообщение,
// пригодное для toast'а. Поддерживает структуры DRF: {detail}, поля-объекты
// со списками строк, {non_field_errors}, бэк-обёртку {status_code, error_type, message}.
export function parseApiError(error: unknown): string {
  if (error instanceof ApiError) {
    const fromBody = parseDrfBody(error.body);
    if (fromBody) return fromBody;
    if (error.status === 0) return "Не удалось связаться с сервером";
    if (error.status === 401) return "Сессия истекла, войдите заново";
    if (error.status === 403) return "Недостаточно прав для этого действия";
    if (error.status === 404) return "Объект не найден";
    if (error.status === 413) return "Файл слишком большой";
    if (error.status >= 500) return `Ошибка сервера (HTTP ${error.status})`;
    return `Ошибка соединения с сервером (HTTP ${error.status})`;
  }

  if (error instanceof TypeError) {
    return "Не удалось связаться с сервером";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Непредвиденная ошибка";
}

function parseDrfBody(body: unknown): string | null {
  if (body === null || body === undefined) return null;

  if (typeof body === "string") {
    const trimmed = body.trim();
    if (!trimmed) return null;
    // Не показываем сырые HTML-страницы 404/500 от nginx как сообщение об ошибке.
    if (trimmed.startsWith("<")) return null;
    return trimmed;
  }

  if (Array.isArray(body)) {
    const parts = body.map((item) => parseDrfBody(item)).filter(Boolean) as string[];
    return parts.length ? parts.join("; ") : null;
  }

  if (typeof body !== "object") return null;

  const obj = body as Record<string, unknown>;

  // Бэк-обёртка проекта: {status_code, error_type, message}
  if (typeof obj.message === "string" && obj.message.trim()) {
    return obj.message.trim();
  }

  // DRF-стандарт: {detail: "..."}
  if (typeof obj.detail === "string" && obj.detail.trim()) {
    return obj.detail.trim();
  }

  // {non_field_errors: [...]}
  if (Array.isArray(obj.non_field_errors)) {
    const parts = obj.non_field_errors
      .map((v) => (typeof v === "string" ? v : parseDrfBody(v)))
      .filter(Boolean) as string[];
    if (parts.length) return parts.join("; ");
  }

  // Поля-объекты: {field: ["err1", "err2"], field2: "..."}
  const fieldMessages: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    if (key === "detail" || key === "non_field_errors" || key === "message" || key === "status_code" || key === "error_type") continue;
    const partial = parseDrfBody(value);
    if (partial) {
      fieldMessages.push(`${humanizeField(key)}: ${partial}`);
    }
  }
  if (fieldMessages.length) return fieldMessages.join("; ");

  return null;
}

function humanizeField(name: string): string {
  // Стараемся не плодить мапу: разработчики DRF и так возвращают snake_case,
  // которое в админ-форме всё равно ляжет рядом с подписью поля. Лёгкая косметика.
  return name.replace(/_/g, " ");
}
