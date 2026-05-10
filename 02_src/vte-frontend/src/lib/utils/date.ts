// ── Date helpers ────────────────────────────────────────────────
// Бэкенд хранит даты как ISO YYYY-MM-DD (date-only). UI ожидает
// российский формат DD.MM.YYYY. Конвертируем строкой, без `new Date()`,
// чтобы не зависеть от системной таймзоны (полночь UTC легко уезжает на сутки).

const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const RU_RE = /^(\d{2})\.(\d{2})\.(\d{4})$/;

/** ISO YYYY-MM-DD → DD.MM.YYYY. Возвращает "" для пустых/невалидных. */
export function formatDateRu(iso: string | null | undefined): string {
  if (!iso) return "";
  const m = ISO_RE.exec(iso);
  if (!m) return "";
  const [, y, mo, d] = m;
  return `${d}.${mo}.${y}`;
}

/** DD.MM.YYYY → ISO YYYY-MM-DD. Возвращает "" если невалидно. */
export function ruToIso(ru: string): string {
  const m = RU_RE.exec(ru);
  if (!m) return "";
  const [, d, mo, y] = m;
  if (!isValidYmd(Number(y), Number(mo), Number(d))) return "";
  return `${y}-${mo}-${d}`;
}

/** Проверка реальности даты (отлавливает 31.02, 32.13.YYYY и т.п.). */
export function isValidYmd(y: number, m: number, d: number): boolean {
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;
  const dt = new Date(y, m - 1, d);
  return (
    dt.getFullYear() === y &&
    dt.getMonth() === m - 1 &&
    dt.getDate() === d
  );
}
