# ВТЭ — Фронтенд журнала «Вопросы теоретической экономики»

## О проекте

Фронтенд научного журнала «Вопросы теоретической экономики» (questionset.ru). Включает публичный сайт для читателей (архив номеров, страницы статей, рубрикатор) и админ-панель для редакции (управление номерами, карточки статей, загрузка PDF).

Фронтенд работает автономно на mock-данных. Переключение на реальный бэкенд (Django REST API) — через переменную окружения, без изменений в коде.

## Технологии

- **Next.js 16** (App Router, React Server Components, SSG/ISR)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS v4**
- **next-intl** (двуязычность RU/EN)
- **Lucide React** (иконки)

## Быстрый старт

### Требования

- Node.js 20+
- npm

### Установка и запуск

```bash
cd 02_src/vte-frontend
cp .env.example .env.local   # создать файл настроек
npm install
npm run dev
```

Открыть [http://localhost:3000](http://localhost:3000)

### Настройка окружения

Файл `.env.example` содержит все необходимые переменные с комментариями. При первом запуске скопируйте его в `.env.local`:

```bash
cp .env.example .env.local
```

По умолчанию фронтенд работает на mock-данных — бэкенд не нужен.

### Переключение на реальный API

В файле `.env.local` изменить одну строку:

```
NEXT_PUBLIC_API_MODE=real
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Перезапустить `npm run dev`.

## Структура проекта

```
src/
├── app/
│   ├── (public)/               # Публичный сайт
│   │   ├── page.tsx            # Главная / О журнале
│   │   ├── archive/[year]/     # Архив за год (сетка обложек)
│   │   ├── archive/[year]/[issue]/  # Страница номера (содержание по рубрикам)
│   │   ├── article/[id]/       # Страница статьи (метаданные, аннотация, PDF)
│   │   ├── sections/[slug]/    # Рубрикатор (статьи по рубрике)
│   │   ├── editorial-board/    # Редколлегия
│   │   ├── authors/            # Авторам
│   │   ├── ethics/             # Этика публикаций
│   │   ├── contacts/           # Контакты
│   │   ├── search/             # Поиск
│   │   └── privacy/            # Политика персональных данных
│   ├── (admin)/admin/          # Админ-панель
│   │   ├── login/              # Авторизация
│   │   ├── issues/             # Список номеров + создание/редактирование
│   │   ├── issues/[id]/        # Редактирование номера, список статей
│   │   └── articles/[id]/      # Карточка статьи (форма)
│   └── layout.tsx              # Корневой layout
├── components/
│   ├── public/                 # Компоненты публичного сайта (Header, Footer, Nav)
│   ├── admin/                  # Компоненты админки (Sidebar, формы)
│   └── ui/                     # Базовые UI-компоненты
├── lib/
│   ├── api/
│   │   ├── client.ts           # API-клиент (mock/real переключение)
│   │   └── mock/               # Mock-данные (JSON-фикстуры)
│   ├── types/
│   │   └── index.ts            # TypeScript типы API-контрактов
│   └── i18n/                   # Конфигурация интернационализации
└── messages/                   # Переводы (ru.json, en.json)
```

## API-контракт

### Эндпоинты, используемые фронтендом

Фронтенд вызывает следующие эндпоинты (см. `src/lib/api/client.ts`):

| Страница | Эндпоинт | Метод | Описание |
|----------|----------|-------|----------|
| Главная | `/api/issues/latest/` | GET | Свежий номер для боковой панели |
| Архив за год | `/api/issues/?year=2026` | GET | Список номеров за год |
| Архив (годы) | `/api/issues/years/` | GET | Список годов с номерами |
| Страница номера | `/api/issues/{id}/` | GET | Номер со статьями по рубрикам |
| Страница статьи | `/api/articles/{id}/` | GET | Полные метаданные статьи |
| Рубрикатор (список) | `/api/sections/` | GET | Список рубрик |
| Рубрикатор (статьи) | `/api/sections/{slug}/articles/?page=1` | GET | Статьи по рубрике (пагинация) |
| Редколлегия | `/api/editorial-board/` | GET | Список членов редколлегии |
| Поиск | `/api/search/?q={query}` | GET | Поиск по статьям |

**Админские эндпоинты** (будут реализованы позже):

| Действие | Эндпоинт | Метод |
|----------|----------|-------|
| Создание номера | `/api/admin/issues/` | POST |
| Обновление номера | `/api/admin/issues/{id}/` | PUT |
| Публикация номера | `/api/admin/issues/{id}/publish/` | POST |
| Создание статьи | `/api/admin/articles/` | POST |
| Обновление статьи | `/api/admin/articles/{id}/` | PUT |
| Загрузка файлов | `/api/admin/upload/` | POST |

### Минимум для запуска публичного сайта

Чтобы публичный сайт заработал на реальных данных, достаточно реализовать **4 эндпоинта**:

1. `GET /api/issues/latest/` — возвращает `IssueSummary`
2. `GET /api/issues/{id}/` — возвращает `IssueFull` (номер со статьями)
3. `GET /api/articles/{id}/` — возвращает `ArticleFull`
4. `GET /api/issues/?year=N` — возвращает `IssueSummary[]`

### CORS

Бэкенд должен разрешить CORS для:

- `http://localhost:3000` (разработка)
- `https://questionset.ru` (продакшн)

Необходимые заголовки:

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Загрузка файлов

- PDF статей и номеров: `multipart/form-data` на `/api/admin/upload/`
- Обложки номеров: аналогично
- Фронтенд отображает файлы по URL из ответа API (поля `pdf_url`, `cover_url`, `xml_url`)

## TypeScript типы

Типы API-контрактов: `src/lib/types/index.ts`

Ключевые типы:

- **`IssueSummary`** — номер журнала (id, year, number, cover_url, status, ...)
- **`IssueFull`** — номер + статьи, сгруппированные по рубрикам
- **`ArticleSummary`** — краткая карточка статьи (title, authors, doi, pdf_url, ...)
- **`ArticleFull`** — полные метаданные (+ keywords, references, jel_codes, ...)
- **`Author`** — автор (full_name, affiliation, email, orcid)
- **`EditorialBoardMember`** — член редколлегии

Все текстовые поля с русской и английской версиями используют тип `LocalizedString`:

```typescript
interface LocalizedString {
  ru: string;
  en?: string;
}
```

Эти типы должны точно соответствовать структуре ответов бэкенда. При расхождении фронтенд сломается.

## Дизайн

Согласованные HTML-макеты: `02_src/design/` (зелёная палитра).
Альтернативный вариант: `02_src/design-alt-navy/` (синяя палитра).

Дизайн-токены:

- Шрифты: Cormorant Garamond (заголовки), IBM Plex Sans (тело текста)
- Основной цвет: `#2B3D2F` (forest)
- Акцент: `#B07D3A` (copper)
- Ссылки: `#1A7A6D` (teal)
- Фоны: `#F7F5F0`, `#F0EDE6` (stone)

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск dev-сервера (http://localhost:3000) |
| `npm run build` | Продакшн-сборка |
| `npm run start` | Запуск продакшн-сервера |
| `npm run lint` | Проверка ESLint |

