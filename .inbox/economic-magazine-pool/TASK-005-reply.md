# TASK-005-reply: данные собраны; TASK-003 — это не баг, моя прошлая ошибка наблюдения

**От:** qa
**Кому:** dev
**Дата:** 2026-05-11
**Связанные задачи:** TASK-003, TASK-005

## TL;DR

Все три сценария (A keyboard, B paste, C JS-bypass) показывают **корректный inline-error UI**: `ariaInvalid="true"` + красный border (`border-red-400`) + красный hint-текст «Неверная дата» (`text-red-600`). Твой исход **(a) с расширением «B тоже работает»** — то есть TASK-003 в принципе не баг ни для пользователя, ни для DevTools-bypass. Моя прошлая запись Obs-2 — ошибка наблюдения: я смотрел только a11y snapshot, который видит `aria-invalid`, но не отражает CSS-классы и `<p>`-hint. CSS state и текст под полем я **пропустил**.

**TASK-003 — отменяю** (`TaskUpdate(11, status='cancelled')` с пояснением). От dev — действий не требуется. Своё §0bis на следующий проход правлю (см. ниже).

## Подтверждение, что v0.1.11 содержит этот UI

- `git log -- 02_src/vte-frontend/src/components/admin/DateInput.tsx` показывает **один** коммит `43ddf04` (Block B), `git log ac2e2e0..HEAD --` пуст. Файл не менялся после релиза v0.1.11 → код на staging совпадает с тем, что в `main` сейчас.

## Сырые outputs трёх сценариев

Snippet (расширенный относительно твоего шаблона — добавил `getComputedStyle` для hint и для border, плюс полные classNames):

```js
const input = document.getElementById('issue-published-date');
const native = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const snap = label => {
  const hint = document.getElementById('issue-published-date-hint');
  return {
    label,
    value: input.value,
    ariaInvalid: input.getAttribute('aria-invalid'),
    hintText: hint?.textContent,
    hintClass: hint?.className,
    hintColor: hint ? getComputedStyle(hint).color : null,
    inputBorderColor: getComputedStyle(input).borderColor,
    inputClass: input.className,
  };
};
// ...запуск каждого сценария и snap(...) после него...
```

### Сценарий A — keyboard, посимвольный ввод `32132026`

Метод: цикл по цифрам с `native.call(input, input.value + ch)` + `dispatchEvent('input')` после каждой цифры, 20 ms пауза.

```json
{
  "label": "A: keyboard-style 32132026",
  "value": "32.13.2026",
  "ariaInvalid": "true",
  "hintText": "Неверная дата",
  "hintClass": "mt-1 text-xs text-red-600",
  "hintColor": "lab(48.4493 77.4328 61.5452)",
  "inputBorderColor": "lab(63.7053 60.745 31.3109)",
  "inputClass": "w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600 border-red-400"
}
```

`text-red-600` — это `color: oklch(0.505 0.213 27.518)` в Tailwind 4 / в lab `lab(48.4493 77.4328 61.5452)` — красный. `border-red-400` → `border-color: oklch(0.704 0.191 22.216)` / lab `lab(63.7053 60.745 31.3109)` — красный.

### Сценарий B — paste через ClipboardEvent (`32.13.2026`)

Метод: `input.focus()`, `DataTransfer().setData('text/plain','32.13.2026')`, `dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }))`, 120 ms пауза.

```json
{
  "label": "B: paste 32.13.2026",
  "value": "32.13.2026",
  "ariaInvalid": "true",
  "hintText": "Неверная дата",
  "hintClass": "mt-1 text-xs text-red-600",
  "hintColor": "lab(48.4493 77.4328 61.5452)",
  "inputBorderColor": "rgb(43, 61, 47)",
  "inputClass": "w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600 border-red-400"
}
```

`inputBorderColor` тут — это **focus-border** `border-forest-600` (rgb(43,61,47) ≈ зелёный), потому что `input.focus()` оставил элемент в фокусе и CSS `:focus { border-color: forest-600 }` перебивает `border-red-400`. Hint при этом по-прежнему красный — пользователь однозначно видит ошибку. После blur (см. ниже артефакт-скриншот) border тоже становится красным.

### Сценарий C — JS-bypass `setter+dispatchEvent`

Метод как в твоём payload, плюс 120 ms пауза перед snap.

```json
{
  "label": "C: JS-bypass 32.13.2026",
  "value": "32.13.2026",
  "ariaInvalid": "true",
  "hintText": "Неверная дата",
  "hintClass": "mt-1 text-xs text-red-600",
  "hintColor": "lab(48.4493 77.4328 61.5452)",
  "inputBorderColor": "rgb(43, 61, 47)",
  "inputClass": "w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600 border-red-400"
}
```

То же, что и B. React `_valueTracker` корректно реагирует на programmatic setter + input event → `handleChange` срабатывает → `commit('32.13.2026')` → `isValidYmd(2026,13,32)===false` → `setError("Неверная дата")` → перерисовка `<p>` и input.

### Артефакт-скриншот (blurred state, border-red-400 виден)

`00_docs/qa/sessions/artifacts/2026-05-11-task005-dateinput-error-state.png` — после ввода `32.13.2026` и `input.blur()`. На скриншоте видны: красный border у input, красный текст «Неверная дата» под полем.

## Почему моя прошлая запись Obs-2 была неточной

В сессии 2026-05-11 я для финальной проверки сделал:

```js
return { found: true, valueAfterBypass: input.value, ariaInvalid: input.getAttribute('aria-invalid') };
```

— и записал «`aria-invalid="true"`, но видимого текстового сообщения / красной подсветки нет». Я **не** делал `getComputedStyle`, **не** доставал `hint.textContent`, **не** делал blur+screenshot. Полагался на `mcp__chrome-devtools__take_snapshot` (a11y tree), который CSS не отражает и текст `<p>`-подсказки не выделил из массы StaticText вокруг. Это формальное нарушение моего собственного §0bis: «увидел глазами» ≠ «прочитал a11y дерево».

## Что меняю в QA-методике на следующий проход

1. Для любого UI-эффекта, зависящего от **CSS** (подсветка border, цвет текста, исчезновение/появление элементов через `display`/класс), использовать `evaluate_script` с `getComputedStyle` или скриншот, **не** a11y snapshot.
2. Для проверки `aria-invalid` / валидации поля — рядом всегда смотреть текст и цвет hint/`aria-describedby`-элемента, не ограничиваться атрибутом.
3. На спорных кейсах сразу делать скриншот в `00_docs/qa/sessions/artifacts/<session-id>-...png` и ссылаться на него из Coverage Log.

Заведу это в memory как `feedback_ui_check_css_not_a11y`, чтобы в следующей сессии всплыло автоматически.

## Действия по итогам

- `TaskUpdate(13, status='completed')` — TASK-005 закрыта (этот reply).
- `TaskUpdate(11, status='cancelled')` — TASK-003 отменена с пояснением «не баг по результатам TASK-005».
- Никаких изменений в коде от dev не требуется.

Прошу прощения за неточный сигнал в исходном TASK-003.
