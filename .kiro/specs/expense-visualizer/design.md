# Design — Expense & Budget Visualizer

## Overview

This is a single-page client-side web application for tracking personal expenses and visualising spending by category. There is no build step, no bundler, and no server. The entire app runs in the browser from three files:

- `index.html` — structure & markup
- `css/style.css` — all styling, themes, animations
- `js/app.js` — all logic, state, DOM manipulation

Users can add transactions with a name, amount, and category; view a running balance; see spending broken down in a pie chart; set a spending limit with an alert when exceeded; and switch between light and dark themes. All data is persisted to `localStorage` so it survives page refreshes.

---

## Architecture

This app follows a unidirectional data-flow pattern entirely in the browser:

```
User Action → JS State Update → LocalStorage Persist → DOM Re-render → Chart Update
```

There are no external services, no build pipeline, and no module bundler. All logic lives in a single `js/app.js` file loaded via a `<script>` tag. Chart.js v4 is loaded from a CDN (`jsDelivr`).

### File Structure

```
CodingCamp-3August26-syifachandra/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── .kiro/
    └── specs/
        └── expense-visualizer/
            ├── requirements.md
            ├── design.md
            └── tasks.md
```

### State Flow

All mutable state is held in module-level variables in `app.js`:

```
transactions[]        ← loaded from LocalStorage on init
customCategories[]    ← loaded from LocalStorage on init
spendingLimit         ← loaded from LocalStorage on init
chartInstance         ← Chart.js instance reference (null if no chart yet)
```

A single `render()` function is the only entry point for updating the UI. Every user action that mutates state calls `render()` after persisting to LocalStorage.

### Theme System

CSS custom properties are defined on `:root` (light theme) and overridden on `body.dark` (dark theme). The toggle saves the preference to `localStorage` and calls `updateChart()` to recolour the chart legend.

### Sorting

`getSortedTransactions()` returns a sorted copy of the `transactions` array without mutating the original. Options: `newest` (default), `oldest`, `amount-desc`, `amount-asc`, `category`.

---

## Components and Interfaces

### Header
- Sticky, `z-index: 100`; app title left, theme-toggle button right.
- Shadow appears on scroll.
- Theme toggle switches `body` class between `light`/`dark`, saves to `localStorage`, updates emoji (🌙 / ☀️).

### Balance Card
- Full-width gradient card (`#6c63ff → #a78bfa`), white text, 2.2rem font.
- Driven by `updateBalance()`: sums all transaction amounts, writes to DOM, shows/hides spending-limit alert banner.

### Input Form
- Fields: Item Name (text), Amount in Rp (number), Category (select + custom button), Spending Limit (number, optional).
- Inline validation: red border + error message under each invalid field.
- "＋ Custom" button opens the Custom Category Modal.
- Submit button spans full width; disabled until required fields are valid.

**Interface — `addTransaction(name, amount, category)`**
- Generates a nanoid, appends to `transactions[]`, persists to `localStorage`, calls `render()`.

### Transaction List
- `<ul>` with `max-height: 340px; overflow-y: auto`.
- Each `<li>`: emoji badge, name + meta (category · date · % of total), amount, delete button.
- Items whose amount exceeds 50% of the spending limit receive a yellow left-border highlight.
- Slide-in CSS animation on new items; empty-state paragraph when list is empty.
- Sort dropdown calls `getSortedTransactions()` and re-renders the list.

**Interface — `deleteTransaction(id)`**
- Filters `transactions[]` by id, persists, calls `render()`.

### Pie Chart
- Chart.js v4 `Doughnut`/`Pie` chart, loaded via CDN.
- Data aggregated by category inside `updateChart()`.
- Legend below chart; legend text colour adapts to the active theme.
- Tooltip format: `Category: Rp X.XXX (Y%)`.
- Destroyed and recreated on first render; updated in-place on subsequent renders via `chart.data` + `chart.update()`.
- Shows an empty-state message when no transactions exist.

### Custom Category Modal
- Full-screen overlay with blur backdrop; white card centred, max-width 340px.
- Text input + Add / Cancel buttons.
- Closes on Cancel, overlay click, or Escape key.
- Validates: non-empty and no duplicate (case-insensitive).

**Interface — `addCustomCategory(name)`**
- Appends to `customCategories[]`, persists to `localStorage`, updates the category `<select>`.

---

## Data Models

### Transaction Object

```json
{
  "id":       "lz3k4abc1",
  "name":     "Lunch",
  "amount":   25000,
  "category": "Food",
  "date":     "06 Agt 2026"
}
```

| Field      | Type   | Constraints                          |
|------------|--------|--------------------------------------|
| `id`       | string | Unique, nanoid-generated             |
| `name`     | string | Non-empty, max 100 chars             |
| `amount`   | number | Positive integer, Rp denomination    |
| `category` | string | One of built-in or custom categories |
| `date`     | string | Formatted display string (locale)    |

### LocalStorage Keys

| Key                     | Type       | Description                                 |
|-------------------------|------------|---------------------------------------------|
| `ebv_transactions`      | JSON array | Array of Transaction objects                |
| `ebv_custom_categories` | JSON array | Array of custom category name strings       |
| `ebv_theme`             | string     | `"light"` or `"dark"`                       |
| `ebv_spending_limit`    | number     | Rp spending limit; `0` means not set        |

All reads/writes to `localStorage` are wrapped in `try/catch` to handle storage quota errors or private-browsing restrictions gracefully.

---

## Correctness Properties

The following invariants must hold at all times:

1. **Balance integrity** — the displayed balance equals the sum of all `transaction.amount` values currently in `transactions[]`.
2. **Chart consistency** — pie chart slices always reflect the current `transactions[]`; no stale data persists after a delete.
3. **Immutable sort source** — `getSortedTransactions()` never mutates `transactions[]`; the sort order is a view concern only.
4. **No duplicate ids** — every transaction has a unique `id`; deleting by id removes exactly one item.
5. **No XSS via user input** — every user-supplied string rendered via `innerHTML` is passed through `escapeHtml()` first.
6. **Spending-limit alert accuracy** — the alert banner is visible if and only if `spendingLimit > 0` and the total balance exceeds `spendingLimit`.
7. **Custom category uniqueness** — `customCategories[]` contains no two entries that are equal after `.toLowerCase().trim()`.
8. **LocalStorage round-trip fidelity** — data written to and read back from `localStorage` is structurally identical (JSON serialisation preserves all fields).

---

## Error Handling

| Scenario | Handling |
|---|---|
| `localStorage` unavailable (private mode, quota exceeded) | Reads/writes wrapped in `try/catch`; app continues in-memory, data is not persisted for that session |
| Chart.js CDN fails to load | `updateChart()` guards with `typeof Chart !== 'undefined'`; chart area shows a static fallback message |
| Invalid form input (empty name, zero/negative amount) | Inline field-level error messages; form submission is blocked; no state mutation occurs |
| Duplicate custom category | Modal shows an inline error; category is not added |
| Transaction delete on non-existent id | `filter()` is a no-op; `render()` is still called to keep UI consistent |
| `JSON.parse` failure on corrupted `localStorage` data | Caught and logged to console; the affected key is reset to its empty default (`[]` or `0`) |

---

## Testing Strategy

Because this is a no-build, no-framework app, testing is split across three levels:

### Manual / Exploratory Testing
- Add transactions of various categories, amounts, and names; verify balance updates instantly.
- Delete transactions; verify chart and balance update and no ghost entries remain.
- Enter invalid inputs (empty name, negative amount, duplicate category); verify error messages appear and submission is blocked.
- Set a spending limit; add transactions until the total exceeds it; verify the alert banner appears.
- Toggle theme; verify all text, card backgrounds, and chart legend colours update correctly.
- Reload the page; verify all transactions, categories, theme, and spending limit are restored from `localStorage`.

### Unit-Level Logic (manual or lightweight test script)
- `escapeHtml('<script>')` → `'&lt;script&gt;'`
- `getSortedTransactions()` with each sort option returns correct order without mutating source array.
- Balance calculation: sum of empty array = 0; sum of mixed amounts = expected total.
- Custom category deduplication: adding `"food"` when `"Food"` already exists is rejected.

### Cross-Browser Smoke Test
- Verify app loads and functions in Chrome, Firefox, Edge, and Safari (latest stable versions).
- Verify `-webkit-appearance: none` on the category `<select>` renders consistently in Safari.
- Verify CSS custom properties apply correctly in all target browsers.
