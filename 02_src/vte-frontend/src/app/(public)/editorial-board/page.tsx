import { api } from "@/lib/api/client";
import EditorialBoardView from "./EditorialBoardView";
import { connection } from 'next/server';

// Страница остаётся динамической, но данные для неё кэшируются.
//
// `connection()` вместо прежнего `dynamic = 'force-dynamic'`: тот запрещал
// кэшировать вообще что-либо (документация Next 16: он равносилен
// `cache: 'no-store'` на каждом запросе), а нужен он был только ради одного —
// чтобы страница не пререндерилась на сборке, где бэкенд недоступен.
// `connection()` даёт ровно это и ничего больше.
//
// 🛑 `fetchCache` здесь обязателен. По умолчанию ('auto') Next НЕ кэширует
// запросы, обнаруженные ПОСЛЕ Request-time API, а `connection()` — как раз
// такой API. Без этой строки кэш молча не включился бы: страница работает,
// ошибок нет, а бэкенд получает те же запросы на каждый показ.
export const fetchCache = 'default-cache';

export default async function EditorialBoardPage() {
  await connection();
  const members = await api.getEditorialBoard();
  return <EditorialBoardView members={members} />;
}
