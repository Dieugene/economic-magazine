# Test Session: staging reverify — форма /authors/submit на v0.1.15

> Подтверждение позитивного пути новой формы подачи статьи на staging после деплоя `dieugene/vte-frontend:0.1.15` и бэк-фикса B5+B6.

---

## Метаданные

| Поле | Значение |
|---|---|
| **Session ID** | `2026-05-18-author-submission-form-staging-reverify` |
| **Дата / время** | 2026-05-18 |
| **Тестировщик** | Claude (через Chrome DevTools MCP) |
| **Билд / версия** | `dieugene/vte-frontend:0.1.15`, digest `sha256:fcf439490db0d2d724657b3e301672eff6a71514111b9797d1084650c09793f6`, source `main b5d969c`; бэк — staging Django после фикса B5+B6 |
| **Окружение** | staging фронт+бэк (`http://185.180.230.243/`) |
| **Тип сессии** | focused reverify / staging positive path |
| **Связанная сессия** | `2026-05-17-author-submission-form-smoke.md` (B1–B6 история) |

---

## Charter

Подтвердить позитивный путь новой формы прямо на staging после полного деплоя (frontend v0.1.15 + бэк-фикс B5+B6). Один happy-path прогон, проверка реального endpoint и success-экрана.

---

## Coverage / Test log

| # | Сценарий | Шаги | Ожидание | Результат |
|---|---|---|---|---|
| 1 | Рендер формы | Открыть `http://185.180.230.243/authors/submit` в RU | 5 секций + кнопка template + кнопка submit | ✅ |
| 2 | Cookie-баннер | Кликнуть «Согласен» | Баннер исчезает, форма доступна | ✅ |
| 3 | Заполнение | 5 подтверждений + автор `QA-staging Иванов И.И.` + место работы + должность + город + email `qa-staging-v0115@example.com` + телефон + степень/звание/funding/ORCID + 2 согласия + .docx через DataTransfer (`qa_staging_v0115.docx`) | Кнопка submit активна, без ошибок валидации | ✅ |
| 4 | Submit | Клик «Отправить статью» | Multipart POST уходит на `/backend/articles/upload_new_article/` | ✅ — `reqid=119 POST … upload_new_article/ [201]` |
| 5 | Success-экран | После 201 | Заголовок «Статья получена», email пользователя в тексте, кнопка «Подать ещё одну статью» | ✅ — отображено `qa-staging-v0115@example.com` |

---

## Артефакты

- Network log: `reqid=119 POST http://185.180.230.243/backend/articles/upload_new_article/` → **201**.
- Тестовая запись осталась на staging (имя `QA-staging Иванов И.И.`, email `qa-staging-v0115@example.com`) — по правилу «на staging не подчищать».

---

## Итог

✅ **PASS.** Позитивный путь подтверждён на staging. Форма `/authors/submit` ходит на правильный endpoint и обрабатывает success ответ корректно. B1–B6 — все закрыты. Релиз `0.1.15` подтверждён.

Ничего открытого по этой фиче нет.
