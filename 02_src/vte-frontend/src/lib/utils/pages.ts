// Парсинг и сравнение диапазонов страниц статьи (поле Article.pages — строка
// вида "15-29", "15", "15–29" или "15 - 29"). Используется для:
// 1) автосортировки статей в номере по start страницы;
// 2) обнаружения перекрытий диапазонов внутри одного номера (warning toast
//    при сохранении статьи в админке).

export interface PagesRange {
  start: number;
  end: number;
}

export interface OverlapInfo {
  id: number;
  title: string;
  pages: string;
}

const DASH = /[-–—]/;

export function parsePagesRange(
  pages: string | null | undefined
): PagesRange | null {
  if (!pages) return null;
  const trimmed = String(pages).trim();
  if (!trimmed) return null;
  const parts = trimmed.split(DASH).map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return null;
  const start = Number(parts[0]);
  if (!Number.isFinite(start)) return null;
  if (parts.length === 1) return { start, end: start };
  const end = Number(parts[1]);
  if (!Number.isFinite(end)) return null;
  return { start, end };
}

// Используется как Array.sort()-компаратор. Статьи без pages идут в конец.
export function comparePages(a: string, b: string): number {
  const ra = parsePagesRange(a);
  const rb = parsePagesRange(b);
  if (!ra && !rb) return 0;
  if (!ra) return 1;
  if (!rb) return -1;
  if (ra.start !== rb.start) return ra.start - rb.start;
  return ra.end - rb.end;
}

export function findOverlaps(
  target: { id: number; pages: string },
  others: Array<{ id: number; pages: string; title: string }>
): OverlapInfo[] {
  const t = parsePagesRange(target.pages);
  if (!t) return [];
  const out: OverlapInfo[] = [];
  for (const o of others) {
    if (o.id === target.id) continue;
    const r = parsePagesRange(o.pages);
    if (!r) continue;
    // Перекрытие диапазонов: t.start <= r.end && r.start <= t.end
    if (t.start <= r.end && r.start <= t.end) {
      out.push({ id: o.id, title: o.title, pages: o.pages });
    }
  }
  return out;
}
