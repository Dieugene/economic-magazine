// Порядок показа выпусков. Бэк отдаёт `/issues/` неупорядоченным queryset'ом:
// относительный порядок строк меняется от наличия фильтра и после каждого
// сохранения выпуска в админке, поэтому сортировать обязан фронт.
//
// Ключи каскадом: год по убыванию и внутри года номер тоже по убыванию —
// свежее всегда сверху, одинаково и в архиве, и на странице рубрики.
// Дальше два tiebreak'а: уникальность пары (year, number) на бэке не
// гарантирована, а без tiebreak'а компаратор вернёт 0 и дубликаты сохранят
// произвольный порядок бэка.

interface IssueOrderFields {
  id: number;
  year: number;
  number: number;
  sequential_number: number;
}

export function compareIssues(a: IssueOrderFields, b: IssueOrderFields): number {
  if (a.year !== b.year) return b.year - a.year;
  if (a.number !== b.number) return b.number - a.number;
  if (a.sequential_number !== b.sequential_number) {
    return b.sequential_number - a.sequential_number;
  }
  return a.id - b.id;
}

export function sortIssues<T extends IssueOrderFields>(issues: T[]): T[] {
  return [...issues].sort(compareIssues);
}
