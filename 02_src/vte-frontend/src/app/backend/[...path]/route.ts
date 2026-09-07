import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { PUBLIC_CACHE_TAG } from "@/lib/api/client";

const TARGET = process.env.NEXT_PUBLIC_API_PROXY_TARGET;

async function proxy(req: NextRequest, path: string[]) {
  if (!TARGET) {
    return NextResponse.json(
      { error: "Proxy target not configured" },
      { status: 500 },
    );
  }
  const search = req.nextUrl.search;
  const url = `${TARGET.replace(/\/$/, "")}/${path.join("/")}/${search}`;

  const headers = new Headers(req.headers);
  // Drop hop-by-hop and host-specific headers
  headers.delete("host");
  headers.delete("connection");
  headers.delete("content-length");

  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: "manual",
  };

  if (!["GET", "HEAD"].includes(req.method)) {
    init.body = await req.arrayBuffer();
  }

  // ⚠️ Своему запросу здесь НЕЛЬЗЯ добавлять `cache`/`next`, а сегменту —
  // объявлять `fetchCache`: через этот прокси ходит админка со своим токеном,
  // и любой кэш положил бы авторизованные ответы в общее хранилище.
  const upstream = await fetch(url, init);

  // Сброс кэша публичных страниц сразу после правки.
  //
  // Админка пишет только через этот прокси — другого пути записи у неё нет,
  // поэтому здесь единственное место, где фронт узнаёт, что данные изменились,
  // и может не ждать истечения минуты. Признак «правка настоящая» — успешный
  // ответ самого бэкенда: права он уже проверил, подделать 2xx с улицы нельзя.
  //
  // Отдельного эндпоинта для сброса намеренно нет: он был бы открытой точкой,
  // которую можно дёргать без токена, превращая каждый POST в поход к бэкенду —
  // новая точка усиления на сервисе, который только что лёг под нагрузкой.
  //
  // ⚠️ Сюда НЕ попадают правки через Django-админку (`/admin/` на том же
  // сервере) и генерация XML (она ходит методом GET). Их правки станут видны
  // по истечении обычной минуты — потому предел жизни кэша и оставлен коротким.
  if (upstream.ok && !["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    // Второй аргумент обязателен: односоставная форма в Next 16 объявлена
    // устаревшей и не проходит проверку типов. `expire: 0` — истечь сейчас, а
    // не «пометить устаревшим и обновить в фоне»: редактор нажимает «Сохранить»
    // и идёт смотреть результат, ему нужно свежее сразу, а не со второго показа.
    revalidateTag(PUBLIC_CACHE_TAG, { expire: 0 });
  }

  const respHeaders = new Headers(upstream.headers);
  respHeaders.delete("transfer-encoding");
  respHeaders.delete("content-encoding");

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: respHeaders,
  });
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
export async function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
